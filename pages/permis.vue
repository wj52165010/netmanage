<!-- 权限设置页面组件 -->
<template>
    <div class="Permis">
        <div class="Permis_container">
            <!--加载中标识-->
            <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;">
                <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;"><i class="fa fa-spinner fa-pulse"></i></div></div>
            </div>
            <div class="option_bar">
                <div class="item" @click="add()"><i class="fa fa-plus"></i> 新增</div>
            </div>
            <div class="group_header">
                <div class="id">序号</div>
                <div class="name">名称</div>
                <div class="note">描述</div>
                <div class="create_time">创建日期</div>
                <div class="permission">菜单</div>
            </div>
            <div class="group">
                <div class="group_item" v-for="(item,i) in data">
                    <div class="id">{{i+1}}</div>
                    <div class="name">{{item.name}}</div>
                    <div class="note">{{item.note}}</div>
                    <div class="create_time">{{showTime(item.create_time)}}</div>
                    <div class="option">
                        <div class="item" v-show="item.permission.indexOf('*')>=0 || permissions.indexOf('*')<0" style="color:gray;"><i class="fa fa-pencil"></i> 修改</div>
                        <div class="item" @click="add(item)" v-show="item.permission.indexOf('*')<0 && permissions.indexOf('*')>=0"><i class="fa fa-pencil"></i> 修改</div>

                        <div class="item" v-show="item.permission.indexOf('*')>=0 || permissions.indexOf('*')<0" style="color:gray;"><i class="fa fa-trash-o fa-lg"></i> 删除</div>
                        <div class="item" @click="del(item.user_group_id)" v-show="item.permission.indexOf('*')<0 && permissions.indexOf('*')>=0"><i class="fa fa-trash-o fa-lg"></i> 删除</div>

                    </div>
                    <div class="permission">{{showMenu(item.permission)}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import {GetGroup,AddGroup,UpdateGroup,DelGroup} from '../store/mutation-types'
import InputDir from '../components/Input'

export default {
  name: 'Permis',
  data () {
    return {
      data:[],
      blnLoading:false,
      permissions:ser.permissions,
    }
  },
  mounted(){
    this.loadData();
  },
  computed:mapState({
      //可以设置的权限菜单
      menus:state=>{
        let res=_.chain(state.menus).map(menu=>{return menu.menus;}).flatten().filter(menu=>{
            return menu.blnShow && menu.kind!=1;
        }).value();

        return res;
     }
  }),
  methods:{
      //刷新页面
      refreshPage(){
          this.loadData();
      },
      loadData(){
        //获取用户组信息
        this.blnLoading=true;
        this.$store.dispatch(GetGroup).then(res=>{
            this.blnLoading=false;
            if(!tool.msg(res,'','获取用户组数据失败!')){return;}
            this.data=res.biz_body;
        });
      },
      //显示日期
      showTime(time){
        return tool.DateByTimestamp(parseInt(time)/1000,'yyyy-MM-dd hh:mm:ss')
      },
      //转换菜单显示
      showMenu(ids){

        return _.map(ids,id=>{
            let item=_.find(this.menus,menu=>{return menu.keyid == id;}) || {name:'超级管理员'}
            return item.name;
        }).join(',');
      },
      //删除组
      del(id){
        tool.confirm('您确定要删除该用户组信息吗?',['确定','取消'],()=>{
            this.$store.dispatch(DelGroup,id).then(res=>{
                if(!tool.msg(res,'删除用户组成功!','删除用户组失败!')){return}
                this.data.splice(_.findLastIndex(this.data,item=>{return item.user_group_id == id}),1);
            });
        },function(){});
      },
      //增加修改分组
      add(updateData){
        let self=this;
        tool.open(function(){
            let html=`
               <InputDir label="用户组名称" @change="name_change" :val="name"/>
               <InputDir label="用户组描述" @change="note_change" :val="note"/>
               <div style="position:relative;">
                <div class="option_bar">
                    <div style="float:left;font-size:12px;margin-left:10px;">{{relatievMenu.length}}个</div>
                    <div class="item" @click="relateMenu()"><i class="fa fa-tasks"></i> 关联菜单</div>
                </div>
                 <div class="content"></div>
               </div>
               <div style="text-align:right;margin-top:10px;">
                    <button type="button" class="btn btn-success" style="font-size:12px;" @click="complete()">完成</button>
                    <button type="button" class="btn btn-default" style="font-size:12px;" @click="close()">关闭</button>
               </div>
            `;
            let relateMenu=[];
            if(updateData){
                relateMenu=_.filter(self.menus,menu=>{
                    return _.indexOf(updateData.permission,menu.keyid)>=0
                });
            }

            let param={
                title:updateData?'修改用户组':'新增用户组',
                area:'400px',
                components:{InputDir},
                content:`<div class="group_pop" style="width:100%;height:100%;overflow:hidden;padding:10px;">${html}</div>`,
                context:{
                    //分组名称
                    name:updateData?updateData.name:'',
                    //分组描述
                    note:updateData?updateData.note:'',
                    //关联菜单
                    relatievMenu:relateMenu || [],
                    //关联菜单设置
                    relateMenu(){
                        let menus=tool.Clone(param.selfData.relatievMenu);
                        let keyids=_.pluck(param.selfData.relatievMenu,'keyid');
                        tool.open(function(){
                            let html=`<div class="set_menu_pop_item" @click="clickItem(menu)" :class="{selItem:selKeyids.indexOf(menu.keyid)>=0}" v-for="menu in data">
                                        <i :class="menu.icon" class="icon"></i>
                                        <div class="content">{{menu.name}}</div>
                                      </div>`;
                            let pam={
                                title:'设置关联菜单',
                                area:'412px',
                                content:`<div class="set_menu_pop" style="width:100%;overflow:hidden;">
                                            <div class="contentContainer">
                                                <div class="scrollContainer">
                                                    <div class="slidee">${html}</div>
                                                </div>
                                                <div name="scrollBar" class="scrollbar" v-show="blnShowScroll">
                                                    <div class="handle"></div>
                                                </div>
                                            </div> 
                                             <div class="option_bar">
                                                    <button type="button" class="btn btn-success" style="font-size:12px;" @click="complete()">完成</button>
                                                    <button type="button" class="btn btn-default" style="font-size:12px;" @click="close()">关闭</button>
                                            </div>    
                                         </div>`,
                                mounted(){
                                    this.scrollDom=$('div[class="set_menu_pop"] > div[name="scrollBar"]');
                                   
                                },
                                success(){
                                    pam.selfData.initScroll();
                                },
                                context:{
                                    data:self.menus,
                                    blnShowScroll:false,
                                    scrollIns:null,
                                    scrollDom:null,
                                    selKeyids:keyids || [],
                                    selMenus:menus || [],
                                    clickItem(menu){
                                        if(_.findLastIndex(pam.selfData.selMenus,item=>{return item.keyid == menu.keyid})>=0){
                                            pam.selfData.selMenus.splice(_.findLastIndex(pam.selfData.selMenus,item=>{return item.keyid == menu.keyid}),1);
                                            pam.selfData.selKeyids.splice(_.indexOf(pam.selfData.selKeyids,menu.keyid),1);  
                                            return;
                                        }
                                        pam.selfData.selKeyids.push(menu.keyid);
                                        pam.selfData.selMenus.push(menu);
                                    },
                                    complete(){
                                        param.selfData.relatievMenu=tool.Clone(pam.selfData.selMenus);
                                        pam.close();
                                    },
                                    close(){
                                        pam.close();
                                    },
                                    //初始化滚动条
                                    initScroll(){
                                        pam.selfData.scrollIns = new Sly($('.set_menu_pop .scrollContainer'),{
                                            speed:200,
                                            scrollBy:50,
                                            scrollBar:'.set_menu_pop .scrollbar',
                                            dynamicHandle: 0,
                                            dragHandle: 1,
                                            mouseDragging: 0});
                                        
                                        setTimeout(()=>{
                                                pam.selfData.scrollIns.init();
                                                pam.selfData.reloadyScroll();
                                        },0); 
                                    },
                                    //重新计算滚动条高度
                                    reloadyScroll(){
                                        pam.selfData.scrollIns.reload();
                                        pam.selfData.blnShowScroll=pam.selfData.scrollIns.rel.slideeSize-10>pam.selfData.scrollIns.rel.frameSize;
                                        pam.selfData.setScrollH();
                                        pam.selfData.scrollIns.reload();
                                    },
                                    //设置滚动条高度
                                    setScrollH(){
                                        let scrollContainerH=pam.selfData.scrollDom.height();
                                        let gap=(pam.selfData.scrollIns.rel.slideeSize-pam.selfData.scrollIns.rel.frameSize)*(pam.selfData.scrollIns.rel.frameSize/pam.selfData.scrollIns.rel.slideeSize);
                                        pam.selfData.scrollDom.find('.handle').css('height',(scrollContainerH-gap)<20?20:(scrollContainerH-gap)+'px');
                                    }
                                }
                            };

                            return pam;
                        }());
                    },
                    name_change(val){
                        param.selfData.name=val;
                    },
                    note_change(val){
                        param.selfData.note=val;
                    },
                    complete(){
                        if(!updateData){
                            //新增
                            let data={
                                name:param.selfData.name,
                                note:param.selfData.note,
                                permission:_.pluck(param.selfData.relatievMenu,'keyid')
                            };
                            self.$store.dispatch(AddGroup,data).then(res=>{
                               if(!tool.msg(res,'添加用户组成功!')){return}
                                data.user_group_id=res.biz_body.user_group_id;
                                data.create_time=parseInt(tool.Timestamp(new Date()))*1000;
                                self.data.unshift(data);
                            })
                           
                        }else{
                            //修改
                            let data=tool.Clone(updateData);
                            data.name=param.selfData.name;
                            data.note=param.selfData.note;
                            data.permission=_.pluck(param.selfData.relatievMenu,'keyid');
                            self.$store.dispatch(UpdateGroup,data).then(res=>{
                                if(!tool.msg(res,'修改用户组成功!','修改用户组失败!')){return}
                                updateData.name=param.selfData.name;
                                updateData.note=param.selfData.note;
                                updateData.permission=_.pluck(param.selfData.relatievMenu,'keyid');
                            });
                            
                        }

                        param.close();
                    },
                    close(){
                        param.close();
                    }
                }
            };

            return param;
        }());
      }
  }
}
</script>
<style lang="less">
    @import "../css/variables.less";
    .group_pop .option_bar{
        height:40px;
        background-color:@FrontCol;
        box-shadow: 0 0px 5px rgba(57, 70, 78, 0.2);
        z-index: 99;
        top: 0px;
        width: 100%;
        .border('bottom');
        line-height:40px;
    }
    .group_pop .option_bar .item{
        float:right;height:100%;padding:0px 10px;line-height:40px;font-size:12px;
    }
    .group_pop .option_bar .item:hover{
        cursor:pointer;border-bottom: 2px solid;
    }

    .group_pop .content{
        margin-top:0px;
    }

    .set_menu_pop .contentContainer{height:300px;position:relative;}
    .set_menu_pop .option_bar{text-align: right;padding:5px;.border('top')}

    .set_menu_pop .set_menu_pop_item{
        display:inline-block;
        width:100px;
        height:100px;
        padding-top: 20px;
        text-align: center;
        .transLine();cursor:pointer;
        position:relative;
    }
    .set_menu_pop .set_menu_pop_item:hover{background-color:@btn_Bg_Col_hover_1;color:white;}

    .set_menu_pop .set_menu_pop_item .icon{font-size: 30px;margin-bottom: 10px;}
    .set_menu_pop .set_menu_pop_item .content{font-size:12px;}
    .set_menu_pop .set_menu_pop_item.selItem {background-color:@btn_Bg_Col_2;color:white;}

    //下拉框样式
    .set_menu_pop .scrollContainer{width:100%;height:100%;position: relative;}
    .set_menu_pop .scrollbar:hover {cursor:pointer;}
    .set_menu_pop .scrollbar { border:1px solid @borderCol;border-radius:5px;width: 10px; height: ~"calc(100% - 20px)"; position: absolute;right: 5px;top:0px;background:white;margin-top:10px;}
    .set_menu_pop .scrollbar .handle {width: 100%;height: 100px;background: @btn_Bg_Col_1;}


</style>

<style scoped lang="less">
  @import "../css/variables.less";
  @barH:40px;
  @groupH:~"calc(100% - @{barH} - @{barH})";
  @group_item_min_H:40px;
  @group_item_id_W:100px;
  @group_item_name_W:150px;
  @group_item_note_W:200px;
  @group_item_create_time_W:200px;
  @group_item_option_W:100px;

  .Permis{width:100%;height:100%;overflow: hidden;padding:5px;}
  .Permis_container{width:100%;height:100%;position:relative;}
  .group{height:@groupH;background-color:@FrontCol;overflow-y:auto;}
  .group_header{height:@headerH;color:white;}
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
  .group_header .id,
  .group .group_item .id{width:@group_item_id_W;height:100%;float:left;}
  .group_header .name,
  .group .group_item .name{width:@group_item_name_W;height:100%;float:left;}
  .group_header .note,
  .group .group_item .note{width:@group_item_note_W;height:100%;float:left;}
  .group_header .create_time,
  .group .group_item .create_time{width:@group_item_create_time_W;height:100%;float:left;}
  .group_header .permission,
  .group .group_item .permission{height:100%;margin-left:@group_item_id_W+@group_item_name_W+@group_item_note_W+@group_item_create_time_W;margin-right:@group_item_option_W;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;}
  .group_header .option,
  .group .group_item .option{width:@group_item_option_W;float:right;}
  .group .group_item .option .item{float:left;font-size:12px;padding:0px 5px;}
</style>
