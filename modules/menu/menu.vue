<!-- 菜单选择页面 -->
<template>
    <div class="Menu">
        <HTag :tags="pages" @change="tagChange" :index="pageIndex">
            <!--菜单-->
            <div class="menu_container" slot="t0">
                <!--加载中标识-->
                <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index:100;text-align:center;">
                    <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;"><i class="fa fa-spinner fa-pulse" style="color:#98e32c;"></i></div></div>
                </div>
                <!--标题栏-->
                <div class="titleInfo">
                    <span class="name">菜单</span>
                    <!--操作栏-->
                    <div class="option_bar_container">
                        <div style="float: left;width:200px;">
                            <el-input placeholder="请输入关键字搜索" v-model="searchMenuVal" class="input-with-select">
                                <i slot="prepend" class="fa fa-search"></i>
                            </el-input>
                        </div>

                        <div style="float: left;width:200px;margin-left:10px;">
                            <el-select  
                                v-model="searchMenuKind"
                                :clearable="true"
                                placeholder="请选择">
                                <el-option
                                    v-for="item in MenuKind"
                                    :label="item.title"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </div>

                    <!--右边操作栏-->
                    <div class="bar_right">
                        <el-tooltip class="btn_item" effect="light" content="新增" placement="top">
                            <div style="width:25px;border-radius:50%;" @click="addMenu(null,{kind:0,blnShow:1,blnNoShowKind:true})"><i class="fa fa-plus"></i></div>
                        </el-tooltip>
                        <el-tooltip class="btn_item" effect="light" content="分类管理" placement="top">
                            <i class="fa fa-cog fa-fw" @click="KindManage()"></i>
                        </el-tooltip>
                    </div>
                </div>
                <!--内容-->
                <div class="content">
                    <Scroll :listen="listMenus" ref="listMenusScroll">
                            <div class="item menuItem" v-for="m in listMenus" @click="SelMenu(m)">
                                <div class="icon" :style="{'background-color':color[m.menu_type.id || 0]}"><i :class="m.icon"></i></div>
                                <div class="title">{{m.name}}</div>
                                <div class="bottom">
                                    <div class="option_bar">              
                                        <el-tooltip class="btn_item" effect="light" content="修改" placement="top">
                                            <div style="width:35px;height:100%;" @click.stop="addMenu(m)">
                                                <i class="fa fa-pencil"></i>
                                            </div>
                                        </el-tooltip>
                                        <el-tooltip class="btn_item" effect="light" content="删除" placement="top">
                                            <div style="width:35px;height:100%;"  @click.stop="m.isSave?del_data_item(m.keyid,m):del_item(m.keyid)">
                                                <i class="fa fa-trash-o fa-lg"></i>
                                            </div>
                                        </el-tooltip>
                                    </div>
                                    <div class="date">{{formatTime(m.createtime,'yyyy-MM-dd')}}</div>
                                </div>
                                <!--标识数据源是否被选中-->
                                <div class="iden_container" :class="{active:curMenu?curMenu.keyid==m.keyid:''}">
                                    <i class="fa fa-check iden" />
                                </div>
                            </div>
                            <div class="clearfix"></div>
                    </Scroll>
                </div>
            </div>
            <!--模板-->
            <div class="tmp_container" slot="t1">
                <!--加载中标识-->
                <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index:100;text-align:center;">
                    <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;"><i class="fa fa-spinner fa-pulse" style="color:#98e32c;"></i></div></div>
                </div>
                <!--标题栏-->
                <div class="titleInfo">
                    <span class="name">模板</span>
                    <!--操作栏-->
                    <div class="option_bar_container">
                        <div style="float: left;width:200px;">
                            <el-input placeholder="请输入关键字搜索" v-model="searchTmpVal" class="input-with-select">
                                <i slot="prepend" class="fa fa-search"></i>
                            </el-input>
                        </div>

                        <div style="float: left;width:200px;margin-left:10px;">
                            <el-select  
                                v-model="searchTmpKind"
                                :clearable="true"
                                placeholder="请选择">
                                <el-option
                                    v-for="item in MenuKind"
                                    :label="item.title"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <!--右边操作栏-->
                    <div class="bar_right">
                        <el-tooltip class="btn_item" effect="light" content="新增" placement="top">
                            <div style="width:25px;border-radius:50%;" @click="addMenu(null,{kind:1,blnShow:0,blnNoShowKind:true})"><i class="fa fa-plus"></i></div>
                        </el-tooltip>
                    </div>
                </div>
                <!--内容-->
                <div class="content">
                    <Scroll :listen="templates" ref="templatesScroll">
                        <div class="item menuItem" v-for="m in templates" @click="SelMenu(m)">
                            <div class="icon" :style="{'background-color':color[m.menu_type.id || 0]}"><i :class="m.icon"></i></div>
                            <div class="title">{{m.name}}</div>
                            <div class="bottom">
                                <div class="option_bar">
                                    <el-tooltip class="btn_item" effect="light" content="修改" placement="top">
                                        <div style="width:35px;height:100%;" @click.stop="addMenu(m)">
                                            <i class="fa fa-pencil"></i>
                                        </div>
                                    </el-tooltip>
                                    <el-tooltip class="btn_item" effect="light" content="删除" placement="top">
                                        <div style="width:35px;height:100%;" @click.stop="m.isSave?del_data_item(m.keyid,m):del_item(m.keyid)">
                                            <i class="fa fa-trash-o fa-lg"></i>
                                        </div>
                                    </el-tooltip>
                                </div>
                                <div class="date">{{formatTime(m.createtime,'yyyy-MM-dd')}}</div>
                            </div>
                            <!--标识数据源是否被选中-->
                            <div class="iden_container" :class="{active:curMenu?curMenu.keyid==m.keyid:''}">
                                <i class="fa fa-check iden" />
                            </div>
                        </div>
                        <div class="clearfix"></div>
                    </Scroll>
                </div>
            </div>
        </HTag>
    </div>
</template>

<script>
import { mapState,mapMutations} from 'vuex'
import Scroll from 'components/scroll'
import {BODY_RESIZE,Set_Menus,Set_Menu,Clear_Menu,Get_Operate,SetSource,SET_ALL_TABLE_DATA,
        Set_Operate,Del_PlaceMenu,DelMenu,Reg_Menu_Change_Even,
        Add_System_Menus,Reg_Menu_Change,Reg_Data_Source_Change,
        Reg_Del_Menu_Even,Sub_Del_Menu,Set_Menu_Setting,Clear_Menu_Setting,GetMenuKind,TriggerMenuChange
        } from '../../store/mutation-types'

import IconSelector from 'components/IconSelector'
import HTag from 'components/HTag'
import MenuUntil from './until'


import KindManage from './kindManage'

export default {
  name: 'Menu',
  components:{Scroll,HTag},
  data () {
    return {
      pages:[{name:'菜单',icon:'fa fa-tag'},{name:'模板',icon:'fa fa-tag'}],
      //菜单集合数据
      menus:[
            //  {keyid:1,name:'测试菜单',icon:'fa fa-desktop',kind:1,createtime:'1515399004',menu_type:{id:0}},
            //  {keyid:2,name:'测试菜单2',icon:'fa fa-address-card',createtime:'1515399004',menu_type:{id:1}},
            //  {keyid:3,name:'测试菜单',icon:'fa fa-desktop',createtime:'1515399004',menu_type:{id:2}},
            //  {keyid:4,name:'测试菜单2',icon:'fa fa-address-card',createtime:'1515399004',menu_type:{id:3}},
            //  {keyid:5,name:'测试菜单',icon:'fa fa-desktop',createtime:'1515399004',menu_type:{id:4}},
            ],
      //菜单图标颜色集合
      color:['rgb(3, 171, 103)','#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3','#9b26b0'],
      //菜单搜索关键字
      searchMenuVal:'',
      //模板搜索关键字
      searchTmpVal:'',
      //查询菜单类型
      searchMenuKind:'',
      //查询模板类型
      searchTmpKind:'',
      //当前页面索引(菜单/模板)
      pageIndex:0,
      blnLoading:false,//正在加载中
    }
  },
  watch:{
      config:{
          deep:true,
          handler:function(){
              this.$store.commit(Set_Menu_Setting,this.config);
          }
      }
  },
  computed:mapState({
      PageData:state=>{
          return state.menuManage;
      },
      config(){
          return {
            searchMenuVal:this.searchMenuVal,
            searchTmpVal:this.searchTmpVal,
            searchMenuKind:this.searchMenuKind,
            searchTmpKind:this.searchTmpKind,
            pageIndex:this.pageIndex
          }
      },
      MenuKind:state=>state.MenuKind,
      //除模板以外的菜单集合
      listMenus(){
          let data=_.filter(this.menus,m=>!m.kind && m.keyid!=='235');
          if(this.searchMenuVal){
              data=_.filter(data,m=>m.name.indexOf(this.searchMenuVal)>=0);
          }

          if(this.searchMenuKind){
            data=_.filter(data,m=>{
                if(m.menu_type && _.find(this.MenuKind,c=>c.id==m.menu_type.id)){
                    type=m.menu_type;
                }else{
                    type=_.find(this.MenuKind,c=>c.isDefault);
                }

                return type.id==this.searchMenuKind;
            })
          }
          
          return data;
      },
      //模板集合
      templates(){
          let data=_.filter(this.menus,m=>m.kind==1);
          if(this.searchTmpVal){
              data=_.filter(data,m=>m.name.indexOf(this.searchTmpVal)>=0);
          }

          if(this.searchTmpKind){
            data=_.filter(data,m=>{
                if(m.menu_type && _.find(this.MenuKind,c=>c.id==m.menu_type.id)){
                    type=m.menu_type;
                }else{
                    type=_.find(this.MenuKind,c=>c.isDefault);
                }

                return type.id==this.searchTmpKind;
            })
          }
          return data;
      },
      //当前选中菜单
      curMenu:state=>state.menuManage.menu,
      dataSouce:state=>{return state.oriSource;},
      tables(){
            let dataSource=tool.Clone(this.dataSouce);
 
            let data =_.chain(dataSource).values().pluck('tables').map(t=>_.values(t)).flatten().value() || [];

            return data;
      },
  }),
  mounted(){
    let self=this;

    this.GetMenus();//获取菜单数据
    //注册菜单改变监听对象
    self.$store.commit(Reg_Menu_Change,new self.$store.getters.Rx.Subject());
    //注册数据源选择改变监听对象
    self.$store.commit(Reg_Data_Source_Change,new self.$store.getters.Rx.Subject());
    //注册菜单删除事件监听对象
    self.$store.commit(Reg_Del_Menu_Even,new self.$store.getters.Rx.Subject());

     //监听菜单删除事件
    self.$store.commit(Sub_Del_Menu,self.del_item);
    //监听菜单数据改变事件
    this.$store.commit(Reg_Menu_Change_Even,(menu)=>{

    });

  },
  methods:{
      //清空数据
      clearData(){
          this.$store.commit(Clear_Menu_Setting);
      },
      //恢复页面之前操作的值
      recoverData(){
        let {searchMenuVal,searchTmpVal,searchMenuKind,searchTmpKind,pageIndex} =this.PageData;
        this.searchMenuVal=searchMenuVal;
        this.searchTmpVal=searchTmpVal;
        this.searchMenuKind=searchMenuKind;
        this.searchTmpKind=searchTmpKind;
        this.tagChange(pageIndex);
      },
      //格式化时间
      formatTime(time,format){
          return tool.DateByTimestamp(time,format);
      },
      //获取菜单集合数据
      GetMenus(){
        //获取已定义的菜单集合数据
        this.blnLoading=true;
        this.$store.dispatch(Get_Operate).then(res=>{
            this.blnLoading=false;
            this.menus=res.biz_body;
            for(let item of this.menus){item.isSave=true;}
            //判断当前选中的菜单是否存在于菜单中不存在则添加
            if(this.curMenu && !_.find(this.menus,m=>m.keyid==this.curMenu.keyid)){
                this.menus.unshift(this.curMenu);
            }

            this.$nextTick(()=>{
                //设置菜单集合
                this.$store.commit(Set_Menus,this.menus);
                this.recoverData();
            });
        });
      },
      tagChange(i){
          this.pageIndex=i;
          this.$nextTick(()=>{
            this.$refs.listMenusScroll.reloadyScroll();
            this.$refs.templatesScroll.reloadyScroll();
          });
      },
      //选择菜单
      SelMenu(m){
          let config=tool.Clone(m).condtionsObj || {};
          let tableKey=config.target;
          let table=_.find(this.tables,t=>t.key==tableKey);
          let fields=MenuUntil.FieldsInfo(table);//查看的字段
          this.clearData();
          
          console.log(tool.Clone(m));
          this.$store.commit(Set_Menu_Setting,{
              menu:m,
              selFields:MenuUntil.strcField(config.show_fields),//选择的字段
              field_options:config.field_options,//字段操作
              remoteInterface:config.remoteInterface,//远程接口
              field_btns:config.field_btns,//操作按钮
              curSelTable:table,//选择的数据源
              fields:fields || [],//查看的字段
              limit:config.limit,//每页显示条数
              is_desc:config.is_desc,//是否排序
              sort_by:config.sort_by,//排序字段
              template:config.templateNum,//模板
              queryCondition:_.map(config.queryItems,q=>{
                  q.blnAdd=q.blnAdd==undefined?0:q.blnAdd;
                  q.type=q.type+'';
                  return q;
              }),//查询项
              realtiveMenu:config.realtiveMenu,//关联页面
              pageIndex:this.pageIndex
          });
      },
      //加入菜单
      joinMenu(menu){
          this.menus.unshift(menu);
          this.$store.commit(Set_Menus,this.menus);
          this.SelMenu(menu);
      },
      //删除临时菜单项
      del_item(keyid){
          let index =_.findIndex(this.menus,l=>l.keyid==keyid);
          this.menus.splice(index,1);
          this.clearData();
          this.$store.commit(Set_Menu_Setting,{pageIndex:this.pageIndex});
      },
      //数据库删除临时菜单
      del_data_item(keyid,item){
        let kind=item.condtionsObj.query_kind;//菜单类型(查询/展示)
        let info=kind=='show'?'您确定要删除该菜单吗?':'删除菜单的同时会删除该菜单下所有数据,您确定要删除该菜单吗?';

        tool.confirm(info,['确定','取消'],()=>{
            
            let menu=_.find(this.menus,l=>l.keyid==keyid);
            this.$store.dispatch(Del_PlaceMenu,{keyid:keyid}).then(res=>{
                if(res.msg.code!='successed')return;
                this.del_item(keyid);
                //删除菜单集合中的数据
                this.$store.commit(DelMenu,keyid);

                // //修改数据源数据
                // if(menu.condtionsObj && menu.condtionsObj.target){
                //     let dataSource=tool.Clone(this.dataSource);
                //     let customSource=dataSource['自建数据源'];//自建数据源对象
                //     customSource.tables[menu.condtionsObj.target].isDel=this.data.length<=0;
                //     this.$store.commit(SetSource,dataSource);
                // }
                
            });
        },function(){});
      },
      //新增菜单
      //updateData:修改对象数据
      //extraData:额外默认数据对象
      addMenu(updateData,extraData){
        let self=this,blnUpdate=!!updateData;
        let {name,keyid,icon,blnShow,disabled,kind,menu_type,blnNoShowKind}=updateData || extraData || {};
        if(menu_type)menu_type.name=menu_type.name || menu_type.title;
 
        let html=`
            <form class="form-horizontal" role="form">
                <div class="form-group">
                    <label class="col-sm-3 control-label">菜单名称</label>
                    <div class="col-sm-9">
                        <el-input placeholder="请输入菜名称" v-model="name"></el-input>
                    </div>
                </div>
                <div class="form-group" v-if="false">
                    <label class="col-sm-3 control-label">菜单ID</label>
                    <div class="col-sm-9">
                        <el-input placeholder="请输入菜ID" v-model="keyid"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">菜单图标</label>
                    <div class="col-sm-9">
                        <div class="icon_container">
                          <div class="btn" @click="select_icon()"><i class="fa fa-navicon"></i></div>
                          <div class="info"><i :class="icon"></i></div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">所属类别</label>
                    <div class="col-sm-9">
                        <el-select v-model="menu_type" placeholder="请选择">
                            <el-option
                                v-for="kind in kinds"
                                :label="kind.title"
                                :value="kind">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group" v-show="!blnUpdate && !blnNoShowKind">
                    <label class="col-sm-3 control-label">菜单类型</label>
                    <div class="col-sm-9">
                        <el-button-group style="width:100%;">
                            <el-button style="width:50%;" :class="{active:kind==0}" @click="kind=0;blnShow=1;">普通</el-button>
                            <el-button style="width:50%;" :class="{active:kind==1}" @click="kind=1;blnShow=0;">模板</el-button>
                        </el-button-group>
                    </div>
                </div>
                <div class="form-group" v-if="kind!=1">
                    <label class="col-sm-3 control-label">是否显示</label>
                    <div class="col-sm-9">
                        <el-button-group style="width:100%;">
                            <el-button style="width:50%;" :class="{active:blnShow}" @click="blnShow=1;">是</el-button>
                            <el-button style="width:50%;" :class="{active:!blnShow}" @click="blnShow=0;">否</el-button>
                        </el-button-group>
                    </div>
                </div>
                <div class="form-group" v-if="kind!=1">
                    <label class="col-sm-3 control-label">是否禁用</label>
                    <div class="col-sm-9">
                        <el-button-group style="width:100%;">
                            <el-button style="width:50%;" :class="{active:disabled}" @click="disabled=true;">是</el-button>
                            <el-button style="width:50%;" :class="{active:!disabled}" @click="disabled=false;">否</el-button>
                        </el-button-group>
                    </div>
                </div>
            </form>
            <div class="option_bar">
                <button type="button" class="btn btn-success" @click="ok_btn()">确定</button>
                <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
            </div>
        `; 
        tool.open(function(store){
        let params = {
            title:blnUpdate?`修改${kind?'模板':'菜单'}`:`新增${kind?'模板':'菜单'}`,
            area:'500px',
            content:`<div class="add_menu_pop">${html}</div>`,
            context:{
                name:name || '',                            //菜单名称
                keyid:keyid || '',                          //菜单ID
                icon:icon || '',                            //菜单图标
                blnShow:blnShow==undefined?true:blnShow,    //是否显示
                disabled:disabled==undefined?false:disabled,//是否禁用
                kind:kind==undefined?0:kind,                //菜单类型0:普通,1:模板
                blnUpdate:blnUpdate || false,               //是否为修改操作
                blnNoShowKind:blnNoShowKind || false,           //是否不显示菜单类型
                menu_type:menu_type || _.find(self.MenuKind,m=>m.isDefault),         //菜单所属类别
                kinds:self.MenuKind,                             //菜单所属类别集合
                ok_btn(){
                    let data=params.selfData;
                    if(!blnUpdate){//新增
                        self.joinMenu({
                            name:data.name,
                            icon:data.icon,
                            keyid:data.keyid || tool.guid(),
                            blnShow:data.blnShow,
                            disabled:data.disabled,
                            kind:data.kind,
                            createtime:tool.Timestamp(new Date()),
                            createpersonid:ser.baseBag.userid,
                            menu_type:data.menu_type,
                            isSave:false,
                            status:JSON.stringify({status:self.Menu_State.getKey('完成')})
                        });
                    }
                    else if(!updateData.isSave){//修改本地缓存
                        updateData.name=data.name;
                        updateData.icon=data.icon;
                        updateData.menu_type=data.menu_type;

                        updateData.blnShow=data.blnShow;
                        updateData.disabled=data.disabled;
                        updateData.kind=data.kind;
                        updateData.createtime=tool.Timestamp(new Date());
                        tool.info('修改成功!');
                    }
                    else{//修改数据库
                        let tempMenuData=tool.Clone(updateData);
                        tempMenuData.name=data.name;
                        tempMenuData.icon=data.icon;
                        tempMenuData.menu_type=data.menu_type;
                        //tempMenuData.keyid=data.keyid;
                        tempMenuData.blnShow=data.blnShow;
                        tempMenuData.disabled=data.disabled;
                        tempMenuData.kind=data.kind;
                        tempMenuData.createtime=tool.Timestamp(new Date());
                        // delete tempMenuData.condtionsObj;
                        // delete tempMenuData.dataSourceConfig;
                        // delete tempMenuData.hanldeDataConfig;
                        // delete tempMenuData.showDataConfig;
                        if(tempMenuData.menu_type.menus) delete tempMenuData.menu_type.menus;
                       
                        self.$store.dispatch(Set_Operate,tempMenuData).then(res=>{
                            if(!tool.msg(res,'修改自定义模块成功!','修改自定义模块失败!')){return;}
                            updateData.name=tempMenuData.name;
                            updateData.icon=tempMenuData.icon;
                            updateData.keyid=tempMenuData.keyid;
                            updateData.blnShow=tempMenuData.blnShow;
                            updateData.disabled=tempMenuData.disabled;
                            updateData.createtime=tempMenuData.createtime;
                            updateData.kind=tempMenuData.kind;
                            updateData.menu_type=tempMenuData.menu_type;

                            self.$store.commit(DelMenu,tempMenuData.keyid);
                            self.$store.commit(Add_System_Menus,updateData);
                        });
                    }
                    params.close();
                },
                cancel_btn(){
                    params.close();
                },
                select_icon(){  //选择图标
                  tool.open(function(store,icon,params){
                      let ins={
                        title:'图标选择',
                        area:['80%','80%'],
                        offset:'50px',
                        components:{
                            IconSelector
                        },
                        context:{
                            store:store,
                            icon:icon,
                            ok_btn(){
                                params.selfData.icon=ins.$vm.$refs.iconSelector.value;
                                ins.close();
                            },
                            cancel_btn(){
                                ins.close();
                            }
                        },
                        methods:{
                            iconChange(value){
                                 this.icon=value;
                            }
                        },
                        content:`<div class="iconSelector_container">
                                    <div class="icons">
                                        <IconSelector ref="iconSelector" :store="store" :value="icon" v-on:iconChange="iconChange"></IconSelector>
                                    </div>
                                    <div class="option_bar">
                                        <button type="button" class="btn btn-success" @click="ok_btn()">确定</button>
                                        <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
                                    </div>
                                </div>`,
                        success(){
                            setTimeout(()=>{ins.$vm.$refs.iconSelector.reloadSly();},500);
                        }
                      };

                      return ins;
                  }(store,params.selfData.icon,params));
                }
            }
        };

        return params;
        }(self.$store));
      },
      //分类管理
      KindManage(){
        let s=this;
        tool.open(function(){
            let html=`
                    <KindManage ref="KindManage" :store="store" style="height:calc(100% - 40px);" />
                    <div class="optionBar" style="text-align:right;padding-right:15px;line-height: 36px;border:1px solid #e7eaec;">
                        <button type="button" class="btn btn-default" @click="cancel_btn()">关闭</button>
                    </div>
                    `;

            let param={
                title:'类型管理',
                area: ['600px', '400px'],
                components:{KindManage},
                content:`<div class="kind_Layout_pop" style="width:100%;height:100%;">${html}</div>`,
                context:{
                    store:s.$store,
                    submit_btn(){
                        let res=param.$refs.KindManage.GetRes();
                        //判断用户是否进行了操作
                        if(res.addItems.length<=0 && res.delItems.length<=0){
                            //无操作
                            param.close();
                        }else{
                            s.KindSurePage(res,param);
                        }
                    },
                    cancel_btn(){
                        param.close();
                    }
                },
                success(layero, index){
                   
                },
            };

            return param;
        }());
      },
      //显示分类操作后提示确认界面
      KindSurePage(data,parent){
          let s=this;
          tool.open(function(){
              let html=`
                <div style="height:300px;overflow:hidden;">
                    <Scroll :store="store" ref="scroll">
                        <div v-if="data.addItems.length>0" style="font-size:12px;font-weight:600;font-style:italic;">新增项信息:</div>
                        <div style="margin-left:40px;line-height:30px;" v-for="(d,i) in data.addItems">{{i+1}}.{{d.name}}</div>
                        <div v-if="data.delItems.length>0" style="font-size:12px;font-weight:600;font-style:italic;">新增项信息:</div>
                        <div style="margin-left:40px;line-height:30px;" v-for="(d,i) in data.delItems">{{i+1}}.{{d.name}}</div>
                    </Scroll>
                </div>
                <div  style="text-align:right;padding-right:15px;line-height: 36px;">
                    <button type="button" class="btn btn-success" @click="submit_btn()">确定</button>
                    <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
                </div>
              `;
              let param={
                title:'类型管理操作确认',
                area:'300px',
                content:`<div class="kind_info_Layout_pop" style="width:100%;height:100%;padding:10px;">${html}</div>`,
                components:{Scroll},
                context:{
                    store:s.$store,
                    data:data,
                    submit_btn(){
                        param.close();
                        parent.close();
                    },
                    cancel_btn(){param.close();}
                },
                success(layero, index){
                   setTimeout(()=>{
                       param.$refs.scroll.reloadyScroll();
                   },600);
                },
              };    

              return param;
          }());
      }
  }
}
</script>
<style lang="less">
  @import "../../css/variables.less";
  .add_menu_pop .form-horizontal .form-group{margin:10px 0px !important;}
  .add_menu_pop .form-horizontal label{font-weight:300;}
  .add_menu_pop .form-horizontal .active{background-color:@btn_Bg_Col_hover_1;color:white;}
  .add_menu_pop .form-horizontal .icon_container{width:100%;height:36px;line-height:36px;border: 1px solid #C0CCDA;border-radius: 5px;}
  .add_menu_pop .form-horizontal .icon_container .btn{float:right;width:36px;border-left:1px solid #C0CCDA;cursor:pointer;border-radius: 0px;}
  .add_menu_pop .form-horizontal .icon_container .info{height:36px;margin-right:37px;text-align: center;}
  .add_menu_pop .option_bar{height:40px;width:100%;text-align:right;line-height:40px;padding-right:15px;margin-bottom:10px;}
  .add_menu_pop .option_bar .btn-success{background-color: @btn_Bg_Col_hover_6;}
  
  //图标选择器样式
  @optionBarH:50px;
  .iconSelector_container{width:100%;height:100%;padding:10px;}
  .iconSelector_container .option_bar{height:@optionBarH;width:100%;text-align:right;line-height:@optionBarH;}
  .iconSelector_container .icons{height:~"calc(100% - @{optionBarH})";width:100%;position: relative;}
  .iconSelector_container .option_bar .btn-success{background-color: @btn_Bg_Col_hover_6;}
</style>

<style scoped lang="less">
    @import "../../css/variables.less";
    .Menu{width:100%;height:100%;text-align:left;}
    .menu_container{width:100%;height:100%;position:relative;}
    .tmp_container{width:100%;height:100%;position:relative;}
     @titleH:40px;
    .menu_container .titleInfo,.tmp_container .titleInfo{width:100%;height:@titleH;line-height:@titleH;padding:0px 10px;.border('top');.border('bottom');}
    .menu_container .name,.tmp_container .name{font-weight:600;font-style: italic;float:left;}
    .menu_container .option_bar_container,.tmp_container .option_bar_container{height:100%;margin-left:70px;float:left;}
    .menu_container .content,.tmp_container .content{width:100%;height:~'calc(100% - @{titleH})';padding-top:10px;}

    .tmp_container .titleInfo,
    .menu_container .titleInfo{
        width:100% !important;
        text-align:center !important;
        text-overflow: ellipsis !important;
        overflow: hidden !important;
        white-space: nowrap !important;
        display: block !important;
        font-style:italic !important;
        font-weight:600 !important;
        border-top:0px !important;
        padding-top: 2px !important;
        text-align:left !important;
        .border('bottom',@HeaderBgCol);
    }
    
    @menuItemW:180px;
    @menuItemH:90px;
    @bordeCol:@FontCol;
    .content .item{width:@menuItemW;height:@menuItemH;.border('',@bordeCol);float:left;margin-left:50px;
                    margin-bottom:50px;text-align:center;padding-top:5px;
                    border-top-left-radius:5px;border-top-right-radius:5px;position:relative;
                    cursor:pointer;
    }

    .content .item:hover{-moz-box-shadow:2px 0px 2px #6E6E6E; -webkit-box-shadow:2px 0px 2px #6E6E6E; box-shadow:2px 0px 2px #6E6E6E;}
    html{.TColIm(~".content .item:hover",'bg');}
    
    .content .menuItem:hover .icon{background-color:white !important;}
    html{.TCol(~".content .menuItem:hover .icon");}

    .content .menuItem:hover .title{color:white;}
    .content .menuItem:hover .bottom{background-color:@HeaderBgCol;color:white;}
    
    .content .item:before{
        background: url(../../assets/shadow-right.png) bottom center no-repeat;
        content: '';
        display: block;
        width: 100px;
        height: 15px;
        position: absolute;
        bottom: -9px;
        right: -6px;
    }
    .content .item:after{
        clear: both;
        background: url(../../assets/shadow-left.png) bottom left no-repeat;
        content: '';
        display: block;
        width: 100px;
        height: 15px;
        position: absolute;
        bottom: -11px;
        left: -3px;
    }
    .content .item .icon{
        margin:0px auto;width:42px;border-radius:50%;height:42px;line-height:42px;font-size:20px;color:white;text-align:center;
        float:left;margin-left:10px;
    }
    html{.TColIm(~".content .item .icon",'bg');}
    .content .item .title{
        width:auto;
        text-align:center;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        display: block;
        font-style:italic;
        font-weight:600;
        border-top:0px;
        border-bottom:0px;
        padding-top: 2px;
        margin-left:52px;
        line-height:42px;
        padding:0px;
        padding-left:10px;
        text-align:left;
    }
    .content .item .bottom{width:100%;height:~'calc(100% - @{titleH} - @{menuItemH}*.5) - 5px';line-height:31px;overflow:hidden;position:absolute;bottom:0px;width:100%;background-color:#cccccc;}
    .content .item .bottom .date{float:right;margin-right:10px;font-style:italic;}
    .content .item .bottom .option_bar{float:left;}
    .content .item .bottom .option_bar .btn_item{float:left;cursor:pointer;height:100%;}
    //.content .item .bottom .option_bar .btn_item:hover{color:@Font_Hover_Col;}

    html{.TCol(~".content .item .bottom .option_bar .btn_item:hover");}
    .content .item .iden_container{
        position: absolute;
        top: 0px;
        right: 0px;
        width: 30px;
        height: 30px;
        background-image:linear-gradient(45deg,transparent 50%,@FontCol 50%),
                         linear-gradient(45deg,transparent 49%,@FontCol 10%) ;
        border-top-right-radius:5px;
        display:none;
   }

   .content .item .iden{position:absolute;right: 3px; top: 2px;color: white;}

   .content .item .iden_container.active{
       display:block;
    }

    html{.TCol(~"  .content .item .iden_container.active",'lineLoopgen',45deg,transparent,50%,@Font_Hover_Col,50%,45deg,transparent,49%,@Font_Hover_Col,10%);}

    .bar_right{float:right;}
    .bar_right .btn_item{cursor:pointer;height:25px;width:25px;line-height:25px;
        text-align:center;margin-top:8px;color:white;border-radius:50%;
    }

    html{.TColIm(~".bar_right .btn_item",'bg');}
</style>
