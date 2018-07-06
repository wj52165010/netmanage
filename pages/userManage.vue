<!-- 用户管理页面组件 -->
<template>
    <div class="UserManage">
        <div class="UserManage_container">
            <!--加载中标识-->
            <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;">
                <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;"><i class="fa fa-spinner fa-pulse"></i></div></div>
            </div>
            <div class="option_bar" >
                <div class="item" @click="add()"><i class="fa fa-plus"></i> 新增</div>
            </div>
            <div class="group_header">
                <div class="account">账号</div>
                <div class="name">名称</div>
                <div class="tel">电话</div>
                <div class="email">邮箱</div>
                <div class="pwd"></div>
                <div class="department">部门</div>
                <div class="region_code">区域</div>
                <div class="policestation_code">场所</div>
                <div class="status">状态</div>
                <div class="note">描述</div>
                <div class="option">操作</div>
                <div class="groups">分组</div>
            </div>
            <div class="group" :style="{height:permissions.indexOf('*')>=0?'calc(100% - 40px - 40px)':'calc(100% - 40px)'}">
                <div class="group_item" v-for="item in data">
                    <div class="account">{{item.account}}</div>
                    <div class="name">{{item.name}}</div>
                    <div class="tel">{{item.tel}}</div>
                    <div class="email">{{item.email}}</div>
                    <div class="pwd">{{item.pwd}}</div>
                    <div class="department">{{item.department}}</div>
                    <div class="region_code">{{item.region_name || ''}}</div>
                    <div class="policestation_code">{{item.policestation_name || ''}}</div>
                    <div class="status">{{statusMap[item.status]}}</div>
                    <div class="note">{{item.note}}</div>
                    <div class="option">
                        <div class="item" @click="add(item)" ><i class="fa fa-pencil"></i> 修改</div>
                        <!--<div class="item"  v-show="permissions.indexOf('*')<0" style="color:gray"><i class="fa fa-pencil"></i> 修改</div>-->
                        <div class="item" @click="del(item.user_id)" v-show="permissions.indexOf('*')>=0"><i class="fa fa-trash-o fa-lg"></i> 删除</div>
                        <div class="item"  v-show="permissions.indexOf('*')<0" style="color:gray"><i class="fa fa-trash-o fa-lg"></i> 删除</div>
                    </div>
                    <div class="groups">{{showGroup(item.groups)}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {GetUser,AddUser,UpdateUser,DelUser,GetDepartments,GetGroup} from '../store/mutation-types'

import InputDir from '../components/Input'
import PlaceSearch from '../components/PlaceSearch'

let permissions=tool.cookie.get('permissions');
export default {
  name: 'UserManage',
  data () {
    return {
      data:[],
      statusMap:{lock:'锁定',disabled:'禁用',normal:'普通'},
      groups:[],
      blnLoading:false,
      permissions:ser.permissions,
    }
  },
  mounted(){
      this.loadData();
  },
  methods:{
    //刷新页面
    refreshPage(){
        this.loadData();
    },
    //加载数据
    loadData(){
        this.blnLoading=true;
        let Rx=this.$store.getters.Rx;
        let countRx = new Rx.Subject().bufferCount(2);
        countRx.subscribe(r=>{
            this.blnLoading=false;
        });
        //获取用户组信息
        this.$store.dispatch(GetGroup).then(res=>{
            countRx.next(1);
            if(!tool.msg(res,'','获取用户组数据失败!')){return;}
            this.groups=res.biz_body;
        });

        //获取用户信息
        this.$store.dispatch(GetUser).then(res=>{
            countRx.next(1);
            if(!tool.msg(res,'','获取用户数据失败!')){return;}
            //权限过滤
            if((','+permissions+',').indexOf(',*,')<0){
                this.data=_.filter(res.biz_body,r=>r.user_id==ser.baseBag.userid);
            }else{
                this.data=res.biz_body;
            }
        });
    },
    //显示用户信息
    showGroup(group){
        return _.map(group,id=>{
            return (_.find(this.groups,i=>{
               return i.user_group_id==id;
            }) || {name:''}).name;
        }).join(',');
    },
    //删除
    del(id){
        tool.confirm('您确定要删除该用户信息吗?',['确定','取消'],()=>{
            this.$store.dispatch(DelUser,id).then(res=>{
                if(!tool.msg(res,'删除用户成功!','删除用户失败!')){return}
                this.data.splice(_.findLastIndex(this.data,item=>{return item.user_id == id}),1);
            });
        },function(){});
    },
    //新增修改
    add(updateData){
        let self=this;
        let permissions=tool.cookie.get('permissions');

        tool.open(function(store){
            let html=`
               <InputDir v-if="blnAdd" label="账号" @change="account_change" :val="account" :require="true" tip="必填"/>
               <InputDir label="名称" @change="name_change" :val="name" :require="true" tip="必填" />
               <InputDir v-if="blnAdd || blnUpdatePwd" label="密码" type="pwd" @change="pwd_change" :val="pwd" :require="blnUpdatePwd?false:true" tip="必填" />
               <InputDir v-if="blnAdd || blnUpdatePwd" label="确认密码" ref="confirmPwd" type="pwd" @change="confirmPwd_change" :require="blnUpdatePwd?false:true" tip="必填" :val="confirmPwd" />
               <InputDir label="电话" @change="tel_change" :val="tel" :require="true" tip="必填"/>
               <InputDir label="邮箱" @change="email_change" :val="email"/>
               <InputDir label="部门" @change="department_change" :val="department" :require="true" tip="必填"/>
               <el-select style="margin-top: 10px;" v-model="groupVal" multiple placeholder="请选择关联组">
                    <el-option
                    v-for="item in groups"
                    :key="item.user_group_id"
                    :label="item.name"
                    :value="item.user_group_id">
                    </el-option>
                </el-select>
               <div style="line-height:36px;padding:10px 0px;border-bottom: 1px solid #bdbdbd;">
                    <span style="width:80px;float: left;color: #bdbdbd;padding-left: 5px;">区域编码<span style="color:red;float:left;margin-top:3px;">*</span></span>
                    <div style="margin-left:80px;"><PlaceSearch c_searchKind='0' :store="store" :blnRadio="true" :defautVal="defRegion" @place_res="region_change"></PlaceSearch></div>
               </div>
               <div style="line-height:36px;padding:10px 0px;border-bottom: 1px solid #bdbdbd;">
                    <span style="width:80px;float: left;color: #bdbdbd;padding-left: 5px;">派出所编码</span>
                    <div style="margin-left:80px;"><PlaceSearch c_searchKind='2' :store="store" :blnRadio="true" :defautVal="defPlace" @place_res="place_change"></PlaceSearch></div>
               </div>
               
               <el-button-group style="width:100%;margin-top: 10px;">
                    <el-button style="width:33.3%;" :class="{active:status=='normal'}" @click="status='normal';">普通</el-button>
                    <el-button style="width:33.3%;" :class="{active:status=='lock'}" @click="status='lock';">锁定</el-button>
                    <el-button style="width:33.3%;" :class="{active:status=='disabled'}" @click="status='disabled';">禁用</el-button>
               </el-button-group>
               <el-select style="margin-top: 10px;" v-model="accountType" placeholder="请选择用户类型">
                    <el-option
                        v-for="item in [{name:'网安账号',val:'netsafe'},{name:'厂商账号',val:'firm'}]"
                        :key="item.val"
                        :label="item.name"
                        :value="item.val">
                    </el-option>
               </el-select>
               <div style="text-align:right;margin-top:10px;">
                    <div style="float:left;cursor:pointer;" @click="blnLoginApp=!blnLoginApp"><i :class="{'fa fa-check-square-o':blnLoginApp,'fa fa-square-o':!blnLoginApp}"></i> 允许登录APP</div>
                    <button type="button" class="btn btn-success" style="font-size:12px;" :disabled="blnSubmit" @click="complete()">完成</button>
                    <button type="button" class="btn btn-default" style="font-size:12px;" @click="close()">关闭</button>
               </div>
            `;
            
            let param={
                title:updateData?'修改用户':'新增用户',
                area:'400px',
                components:{InputDir,PlaceSearch},
                content:`<div class="user_pop" style="width:100%;height:100%;overflow:hidden;padding:10px;">${html}</div>`,
                computed:{
                    blnSubmit(){
                        return this.blnAdd?!(this.account && this.name && this.pwd && this.tel && this.department  && this.regionVal.length>0 && this.pwd==this.confirmPwd):
                                           !(this.account && this.name && this.tel && this.department && this.regionVal.length>0 && this.pwd==this.confirmPwd);
                    },
                },
                context:{
                    store:store,
                    blnUpdatePwd:updateData && (updateData.user_id==ser.baseBag.userid || permissions.indexOf('*')>=0),
                    blnAdd:!updateData,
                    account:updateData?updateData.account:'',//账号
                    accountType:updateData && updateData.user_type!=undefined?updateData.user_type:'netsafe', //账号类型
                    blnLoginApp:updateData?updateData.blnLoginApp:false,//是否允许登录App
                    name:updateData?updateData.name:'',//姓名
                    pwd:updateData?updateData.pwd:'',//密码
                    confirmPwd:updateData?updateData.pwd:'',//确认密码
                    tel:updateData?updateData.tel:'',//电话
                    email:updateData?updateData.email:'',//邮箱
                    note:updateData?updateData.note:'',//描述
                    groups:self.groups,//[{user_group_id:1,name:'测试'},{user_group_id:2,name:'非测事故hi'}],//组信息
                    groupVal:updateData?updateData.groups || []:[],//选择的分组信息
                    status:updateData?updateData.status:'normal',//状态(lock,disabled,normal)
                    department:updateData?updateData.department:'',//部门
                    defRegion:updateData?updateData.region_code?JSON.stringify([{code:updateData.region_code,type:1}]):'':'',//区域选中默认值
                    regionVal:[],//区域选中的值
                    defPlace:updateData?updateData.policestation_code?JSON.stringify([{code:updateData.policestation_code,type:2}]):'':'',//派出所选中默认值
                    placeVal:[],//派出所选中的值
                    //账号改变事件
                    account_change(val){param.selfData.account=val;},
                    //姓名改变事件
                    name_change(val){param.selfData.name=val;},
                    //密码改变事件
                    pwd_change(val){param.selfData.pwd=val;},
                    //确认密码改变事件
                    confirmPwd_change(val){
                        param.selfData.confirmPwd=val;
                        if(param.selfData.confirmPwd!=param.selfData.pwd){
                            param.$refs.confirmPwd.setVaildInfo('两次输入的密码不一致')
                        }else{
                            param.$refs.confirmPwd.setVaildInfo('');
                        }
                    },
                    //电话改变事件
                    tel_change(val){param.selfData.tel=val;},
                    //邮箱改变事件
                    email_change(val){param.selfData.email=val;},
                    //部门改变事件
                    department_change(val){param.selfData.department=val;},
                    //描述改变事件
                    note_change(val){param.selfData.note=val;},
                    //区域选择改变事件
                    region_change(obj,val,cmpVal){
                       param.selfData.regionVal=val.regions?val.regions || []:[];
                    },
                    //场所选择改变事件
                    place_change(obj,val,cmpVal){
                        param.selfData.placeVal=val.polices?val.polices || []:[];
                    },
                    complete(){
                        param.close();
                        let d=param.selfData;
                        if(!updateData){
                            let data={
                                account:d.account,
                                name:d.name,
                                pwd:d.pwd,
                                tel:d.tel,
                                email:d.email,
                                department:d.department,
                                policestation_code:d.placeVal[0]?d.placeVal[0].code || '':'',
                                policestation_name:d.placeVal[0]?d.placeVal[0].name || '':'',
                                region_code:d.regionVal[0]?d.regionVal[0].code || '':'',
                                region_name:d.regionVal[0]?d.regionVal[0].name || '':'',
                                status:d.status,
                                note:d.note,
                                groups:d.groupVal,
                                user_type:d.accountType,
                            };
  
                            self.$store.dispatch(AddUser,data).then(res=>{
                                if(!tool.msg(res,'添加用户成功!','添加用户失败!')){return}
                                data.user_id=res.biz_body.user_id;
                                self.data.unshift(data);
                            });
                        }else{
                            //修改
                            let data=tool.Clone(updateData);
                            data.account=d.account;
                            data.name=d.name;
                            data.pwd=d.pwd;
                            data.tel=d.tel;
                            data.email=d.email;
                            data.department=d.department;
                            data.policestation_code=d.placeVal[0]?d.placeVal[0].code || '':'';
                            data.policestation_name=d.placeVal[0]?d.placeVal[0].name || '':'';
                            data.region_code=d.regionVal[0]?d.regionVal[0].code || '':'';
                            data.region_name=d.regionVal[0]?d.regionVal[0].name || '':'';
                            data.status=d.status;
                            data.note=d.note;
                            data.groups=d.groupVal;
                            data.user_type=d.accountType;

                            self.$store.dispatch(UpdateUser,data).then(res=>{
                                if(!tool.msg(res,'修改用户成功!','修改用户失败!')){return}
                                updateData.account=d.account;
                                updateData.name=d.name;
                                updateData.pwd=d.pwd;
                                updateData.tel=d.tel;
                                updateData.email=d.email;
                                updateData.department=d.department;
                                updateData.policestation_code=d.placeVal[0]?d.placeVal[0].code || '':'';
                                updateData.policestation_name=d.placeVal[0]?d.placeVal[0].name || '':'';
                                updateData.region_code=d.regionVal[0]?d.regionVal[0].code || '':'';
                                updateData.region_name=d.regionVal[0]?d.regionVal[0].name || '':'';
                                updateData.status=d.status;
                                updateData.note=d.note;
                                updateData.groups=d.groupVal;
                            });
                        }
                    },
                    close(){
                        param.close();
                    }
                }
            };

            return param;
        }(self.$store));
    }
  }
}
</script>
<style lang="less">
    @import "../css/variables.less";
    .user_pop .active{background-color:@btn_Bg_Col_hover_1;color:white;}
</style>

<style scoped lang="less">
  @import "../css/variables.less";
  @barH:40px;
  @headerH:40px;
  @groupH:~"calc(100% - @{barH} - @{headerH})";
  @group_item_min_H:40px;
  @group_item_account_W:100px;
  @group_item_name_W:100px;
  @group_item_tel_W:100px;
  @group_item_email_W:150px;
  @group_item_department_W:100px;
  @group_item_region_code_W:150px;
  @group_item_policestation_code_W:150px;
  @group_item_status_W:50px;
  @group_item_pwd_W:0px;
  @group_item_note_W:150px;
  @group_item_option_W:100px;

  .UserManage{width:100%;height:100%;overflow:hidden;padding:5px;}
  .UserManage_container{width:100%;height:100%;position:relative;}

  .group{height:@groupH;background-color:@FrontCol;overflow-y:auto;}
  .group_header{height:@headerH;margin-top:0px;color:white;}
   html{.TCol(~".group_header",'bg');}

  .option_bar{
    height:@barH;
    background-color:@FrontCol;
    box-shadow: 0 0px 5px rgba(57, 70, 78, 0.2);
    z-index: 99;
    top: 0px;
    width: 100%;
    .border('bottom');
  }
  .option_bar .item{
    float:right;height:100%;padding:0px 10px;line-height:@barH;font-size:12px;
  }
  .option_bar .item:hover{
    cursor:pointer;border-bottom: 2px solid;
  }

  .group_header,
  .group .group_item{height:@group_item_min_H;.border('bottom');line-height:@group_item_min_H;cursor:pointer;.transLine();} 
  .group .group_item:hover{background-color:@FontCol;color:white;}
  .group_header .account,
  .group .group_item .account{width:@group_item_account_W;height:100%;float:left;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;}
  .group_header .name,
  .group .group_item .name{width:@group_item_name_W;height:100%;float:left;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;}
  .group_header .tel,
  .group .group_item .tel{width:@group_item_tel_W;height:100%;float:left;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;}
  .group_header .email,
  .group .group_item .email{width:@group_item_email_W;height:100%;float:left;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;}
  .group_header .pwd,
  .group .group_item .pwd{width:@group_item_pwd_W;height:100%;float:left;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;}
  .group_header .department,
  .group .group_item .department{width:@group_item_department_W;height:100%;float:left;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;}
  .group_header .region_code, 
  .group .group_item .region_code{width:@group_item_region_code_W;height:100%;float:left;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;}
  .group_header .policestation_code,
  .group .group_item .policestation_code{width:@group_item_policestation_code_W;height:100%;float:left;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;}
  .group_header .status,
  .group .group_item .status{width:@group_item_status_W;height:100%;float:left;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;}
  .group_header .note,
  .group .group_item .note{width:@group_item_note_W;height:100%;float:left;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;}
  .group_header .groups,
  .group .group_item .groups{height:100%;margin-left:
    @group_item_account_W+
    @group_item_name_W+
    @group_item_tel_W+
    @group_item_email_W+
    @group_item_department_W+
    @group_item_region_code_W+
    @group_item_policestation_code_W+
    @group_item_status_W+
    @group_item_pwd_W+
    @group_item_note_W
    ;
    margin-right:@group_item_option_W;
    white-space:nowrap;overflow: hidden;text-overflow: ellipsis;
  }
  .group_header .option,
  .group .group_item .option{width:@group_item_option_W;float:right;}
  .group .group_item .option .item{float:left;font-size:12px;padding:0px 5px;}
</style>
