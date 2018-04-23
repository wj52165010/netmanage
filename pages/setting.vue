<!--  配置页面 -->
<template>
  <div class="setting_page_container" >
    <!--栏目选择页面-->
    <div class="bar_page" v-show="!curBarId">
        <div class="center_bar">
            <Slide :listen='bars'>
                <li class="bar_item" v-for="b in bars" @click="bar_click(b.id)">
                    <div class="bar_title">{{b.name}}<div>
                    <div class="bar_icon"><i :class="b.icon"></i><div class="small_icon"><i :class="b.sicon"></i></div></div>
                    <div class="bar_info"></div>
                </li> 
            </Slide>
        </div>
    </div>
    <!--配置页面-->
    <div class="setting_page" :class="{blnShowMenu:blnShowMenu}">
        <div class="left_container">
            <TimerShaft ref="timerShaft" :data="curTimerData" :beforeClick="time_before_click" v-on:timerClick="timer_Click"></TimerShaft>
        </div>
        <div class="right_container">
            <div class="list">
                <div class="header">
                    <!--关闭按钮-->
                    <div class="header_close_btn" @click="packMenu()">
                        <el-tooltip effect="light" content="关闭" placement="top">
                            <i class="fa fa-chevron-right"></i>
                        </el-tooltip>
                    </div>
                    <!--返回按钮-->
                    <div class="header_close_btn" @click="curBarId=''">
                        <el-tooltip effect="light" content="返回" placement="top">
                            <i class="fa fa-mail-reply"></i>
                        </el-tooltip>
                    </div>
                    <div v-for="(t,i) in realTags" class="tag_item" @click="curTagIndex=t.id" :class="{active:curTagIndex==t.id}">
                        <i style="margin-right:5px;" :class="t.icon"></i>{{t.name}}
                    </div>
                </div>
                <div class="content" :class="{blnPage:blnPage}">
                    <!--加载中标识-->
                    <div v-if="!curTagIndex" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index: 100;">
                    <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;"><i class="fa fa-spinner fa-pulse"></i></div></div>
                    </div>
                    <!--菜单-->
                    <Accordion  ref="accordion"
                                :data="menusData" 
                                :curSelPage="curSelPage"
                                :notDelArr="['235']" 
                                v-on:menuItem_click="menuItem_click"
                                v-on:del_item="del_item"
                                v-on:del_data_item="del_data_item"
                                v-on:del_update="del_update"
                                v-show="curTagIndex=='menu'" 
                    />

                    <!--本地库-->
                    <div style="width:100%;height:100%;padding:10px;"  v-show="curTagIndex=='local'" >
                        <div class="localBtn" @click="addSource()"> <i style="margin-right:5px;" class="fa fa-plus"></i>新增数据源</div>
                    </div>

                    <!--快搜-->
                    <div style="width:100%;height:100%;"  v-show="curTagIndex=='search'" >
                        <!--配置起始页-->
                        <div v-show="tags[2].tagIndex==6" class="searchInfo">
                            <div class="title"><span class="number">1</span>请选择快搜配置</div>
                            <div class="item"><span class="dot"></span>在这里您可以:</div>
                            <div class="item"><span class="dot"></span>新添加一个配置</div>
                            <div class="item"><span class="dot"></span>更换快搜配置</div>
                            <div class="item"><span class="dot"></span>删除无用的配置</div>
                        </div>
                        <!--关联数据源页-->
                        <div v-show="tags[2].tagIndex==7" class="searchInfo">
                            <div class="title"><span class="number">2</span>请关联需要查询的数据源</div>
                            <div class="item">
                                <button class="btn btn-primary" style="float:left;" type="button">关联当前库</button>
                                <button class="btn btn-info" style="float:right;" type="button">关联所有</button>
                            </div>
                        </div>
                        <!--展示字段-->
                        <div v-show="tags[2].tagIndex==8" class="searchInfo">
                            <div class="title"><span class="number">3</span>制定展示时的主要字段</div>
                            <div class="item"><span class="dot"></span><div class="content">设定制定数据源在快搜结果中需要展示的字段</div></div>
                            <div class="item"><span class="dot"></span><div class="content">拖动展示字段中的卡片可移动展示字段位置</div></div>
                        </div>
                        <!--排序字段-->
                        <div v-show="tags[2].tagIndex==9" class="searchInfo">
                            <div class="title"><span class="number">4</span>查询结果排序</div>
                            <div class="item"><span class="dot"></span><div class="content">设置各数据源对应的排序类型及排序方式</div></div>
                            <div class="item"><span class="dot"></span><div class="content">设置快搜页面展示的条数</div></div>
                            <div class="item"><span class="dot"></span><div class="content">拖动卡片可排列集合类型数据源的排列顺序</div></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div class="content_container">
            <VPaging :data="pages" ref="pageComp"></VPaging>
        </div>

        <!--菜单按钮-->
        <div class="menu_btn">
            <div class="menu_container">
                <div class="icon"><i class="fa fa-chevron-left"></i></div>
                <div class="content" @click="menuClick()"><span><i class="fa fa-th-large"></i></span>菜单列表</div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { mapState,mapMutations} from 'vuex'
import {BODY_RESIZE,Set_Menus,Set_Menu,Get_Operate,SetSource,SET_ALL_TABLE_DATA,
        Set_Operate,Del_PlaceMenu,DelMenu,Reg_Menu_Change_Even,
        Add_System_Menus,Reg_Menu_Change,Reg_Data_Source_Change,
        Reg_Del_Menu_Even,Sub_Del_Menu
        } from '../store/mutation-types'
// import {tool} from '../js/tool.js'
import TimerShaft from '../components/TimerShaft'
import VPaging from '../components/VPaging'
import IconSelector from '../components/IconSelector'
import MenuKind from '../enum/MenuKind'
import Accordion from '../components/accordion'
import {add as addSource} from 'modules/source'
import Slide from 'components/Slide'

let sly=null;
export default {
  name: 'setting',
  components: {
      TimerShaft,VPaging,Accordion,Slide
  },
  data () {
    return {
      curTagIndex:'',//当前Tag索引
      blnPage:false,//判断右边菜单列表栏是否需要滚动条
      blnShowMenu:false,//判断是否显示右边列表栏
      curSelPage:-1,//当前选中的页面
      MenuKind:MenuKind,
      tags:[
          {id:"menu",name:'菜单',icon:'fa fa-bars',tagIndex:0},
          {id:'local',name:'本地库',icon:'fa fa-tasks',tagIndex:5},
          {id:'search',name:'快搜',icon:'fa fa-search',tagIndex:6}
      ],
      pages:['dataSourcePage','showDataPage','conditionPage','tmpSettingPage','handlePage','LocalDatasourcePage','ksearchIndex','ksearchSource','ksearchField','ksearchSort'],//页面组件集合
      //时间轴数据
      timerData:[
          {id:'source',name:'数据源',icon:'fa fa-database',index:0},
          {id:'data',name:'展示数据',icon:'fa fa-clone',index:1},
          {id:'condition',name:'设置条件',icon:'fa fa-exchange',index:2},
          {id:'template',name:'设置模板',icon:'fa fa-newspaper-o',index:3},
          {id:'handle',name:'操作',icon:'fa fa-gears',index:4},
          {id:'localData',name:'本地库',icon:'fa fa-tasks',index:5},
          {id:'ksearchIndex',name:'配置',icon:'fa fa-tasks',index:6},
          {id:'ksearchSource',name:'关联数据源',icon:'fa fa-clone',index:7},
          {id:'ksearchField',name:'展示字段',icon:'fa fa-tags',index:8},
          {id:'ksearchSort',name:'排序设置',icon:'fa fa-sort',index:9},
          ],
      //当前时间轴显示数据
      curTimerData:[],
      list:[//已保存的菜单集合
          //{name:'实名人员库',icon:'fa fa-bullhorn',time:'2016-11-24'},{name:'手机号码库',icon:'fa fa-gift',time:'2016-11-24'},{name:'上网场所库',icon:'fa fa-search',time:'2016-11-24'}
          ],
      bars:[
          {id:"menu",name:'菜单定制',icon:'fa fa-building-o',sicon:'fa fa-gear'},
          {id:'local',name:'数据源管理',icon:'fa fa fa-database',sicon:'fa fa-search'},
          {id:'search',name:'快搜配置',icon:'fa fa-file-text-o',sicon:'fa fa-gear'}
      ],//栏目集合
      curBarId:'',//当前栏目ID
    }
  },
  methods:{
      //栏目项单击事件
      bar_click(id){
          this.curBarId=id;
          this.curTagIndex=id;
      },
      //菜单项单击事件
      menuItem_click(item,index){
          this.$store.commit(Set_Menu,item);
          this.curSelPage=index;
      },
      menuClick(){
          this.blnShowMenu=true;
          this.$refs.pageComp.reloadSly();
      },
      packMenu(){
          this.blnShowMenu=false;
          this.$refs.pageComp.reloadSly();
      },
      //时间轴单击前触发事件
      time_before_click(index){
          let tagData=_.find(this.tags,t=>t.id==this.curTagIndex); 

          if(tagData.id=='search'){//快搜页面流程判断
              return !this.$store.getters.kuaisou_blnGo(index,index-5);
          }
      },
      //时间轴控件被单击
      timer_Click(index){
          let tagData=_.find(this.tags,t=>t.id==this.curTagIndex); 

          tagData.tagIndex=index;
          this.$refs.pageComp.activePage(index);

      },
      //格式化时间
      formatTime(time,format){
          return tool.DateByTimestamp(time,format);
      },
      //删除临时菜单项
      del_item(keyid){
          let index =_.findIndex(this.list,l=>l.keyid==keyid);
          this.list.splice(index,1);
      },
      //数据库删除临时菜单
      del_data_item(keyid,item){
        let kind=item.condtionsObj.query_kind;//菜单类型(查询/展示)
        let info=kind=='show'?'您确定要删除该菜单吗?':'删除菜单的同时会删除该菜单下所有数据,您确定要删除该菜单吗?';

        tool.confirm(info,['确定','取消'],()=>{
            let index=_.findIndex(this.list,l=>l.keyid==keyid);
            this.$store.dispatch(Del_PlaceMenu,{keyid:keyid}).then(res=>{
                if(res.msg.code!='successed')return;
                this.del_item(keyid);
                //删除菜单集合中的数据
                this.$store.commit(DelMenu,keyid);
            });
        },function(){});
      },
      //新增数据源
      addSource(){
        let s=this;
        tool.open(function(){
            let layerIndex=-1;
            let param={
                title:'新增数据源-设置字段',
                area:['500px','570px;'],
                components:{addSource},
                content:`<div class="settingSourcePop" style="width:100%;height:100%;overflow-y:auto;">
                            <addSource ref="addSource" :store="store" @titleChange="titleChange" @complete="complete" @saveconfig="saveconfig" />
                         </div>`,
                context:{
                    store:s.$store,
                    titleChange(title){
                        layer.title(`新增数据源-${title}`,layerIndex);
                    },
                    complete(){
                        param.close();
                    },
                    saveconfig(table){
                        let data=tool.Clone(s.curSource);
                        data['localdb']=data['localdb'] || {desc: "本地库",icon: "fa fa-road",key: "localdb",name: "本地库",tables:{}};
                        data['localdb'].tables[table.key]=table;
                        s.$store.commit(SetSource,data);//重新设置数据源集合
                        
                        let allTables=[];
                        for(let key in data){
                            data[key].icon=data[key].icon || 'fa fa-road';
                            let tables=data[key].tables || [];
                            for(let tableKey in tables){
                                allTables.push(tables[tableKey]);
                            }
                        }

                        this.$store.commit(SET_ALL_TABLE_DATA,allTables);//重新设置数据源相关表集合

                    }
                },
                success(layero,index){
                   layerIndex=index;
                   setTimeout(()=>{
                    param.$refs.addSource.reload();
                   },500);
                }
            };

            return param;
        }());
      },
      //修改菜单信息
      del_update(item){
          this.addMenu(item);
      },
      //新增菜单
      //updateData:修改对象数据
      //extraData:额外默认数据对象
      addMenu(updateData,extraData){
        let self=this,blnUpdate=!!updateData;
        let {name,keyid,icon,blnShow,disabled,kind,menu_type,blnNoShowKind}=updateData || extraData || {};
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
                                :label="kind.name"
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
            title:blnUpdate?'修改菜单':'新增菜单',
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
                menu_type:menu_type || MenuKind[0],         //菜单所属类别
                kinds:MenuKind,                             //菜单所属类别集合
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
                            status:JSON.stringify({status:self.Menu_State.getKey('创建中')})
                        });
                    }else{//修改
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

      //加入菜单
      joinMenu(menu){
          this.list.unshift(menu);
          this.$store.commit(Set_Menus,this.list);
          this.menuItem_click(menu,0);
      }
  },
  computed:mapState({
      tables:state=>{return state.setting.tables;},
      menusData(){
        let res=[];
        let tempArr= _.map(this.list,i=>{i.kind=i.kind || 0; return i;});
        let groupArr = _.groupBy(tempArr,'kind');
        _.each(groupArr,(g,k)=>{
            switch(k){
                case '0': //菜单
                    res.push({id:1,name:'菜单',icon:'fa fa-plus',childs:g,click:()=>{this.addMenu(null,{kind:0,blnNoShowKind:true});}});
                    break;
                case '1': //模板    
                    res.push({id:2,name:'模板',icon:'fa fa-plus',childs:g,click:()=>{this.addMenu(null,{kind:1,blnNoShowKind:true});}});
                    break;
            }
        });
        return res;
      },
      curMenu:state=>{
          return state.setting.curMenu;
      },
      curSource:state=>{
           return state.oriSource;
      },
      realTags(){
         return _.filter(this.tags,t=>t.id==this.curBarId);
      }
  }),
  watch:{
      curTagIndex(){
          let tagData=_.find(this.tags,t=>t.id==this.curTagIndex); 
          if(this.curTagIndex=='menu'){//菜单
            if(!this.curMenu || (this.curMenu && !this.curMenu.kind)){//普通菜单
                this.curTimerData=_.filter(this.timerData,(item)=>{return item.id!='template' && item.id!='localData' && item.id!='ksearchIndex' && item.id!='ksearchSource' && item.id!='ksearchField' && item.id!='ksearchSort'});
            }
            if(this.curMenu && this.curMenu.kind){//模板菜单
                this.curTimerData=_.filter(this.timerData,(item)=>{return item.id!='condition' && item.id!='handle' && item.id!='localData' && item.id!='ksearchIndex' && item.id!='ksearchSource' && item.id!='ksearchField' && item.id!='ksearchSort'});
            }
            this.$refs.timerShaft.active(tagData.tagIndex);
            this.$refs.accordion.refreshScroll();
          }else if(this.curTagIndex=='local'){//本地库
            this.curTimerData=_.filter(this.timerData,(item)=>{return item.id=='localData'});
            this.$refs.timerShaft.active(tagData.tagIndex);
          }else if(this.curTagIndex=='search'){//快搜
            this.curTimerData=_.filter(this.timerData,(item)=>{return item.id=='ksearchIndex' || item.id=='ksearchSource' || item.id=='ksearchField' || item.id=='ksearchSort'});
            this.$refs.timerShaft.active(tagData.tagIndex);
          }
          
          this.$nextTick(()=>{
              this.$refs.pageComp.activePage(tagData.tagIndex);
          });
      }
  },
  mounted(){
    let self=this;
    //注册菜单改变监听对象
    self.$store.commit(Reg_Menu_Change,new self.$store.getters.Rx.Subject());
    //注册数据源选择改变监听对象
    self.$store.commit(Reg_Data_Source_Change,new self.$store.getters.Rx.Subject());
    //注册菜单删除事件监听对象
    self.$store.commit(Reg_Del_Menu_Even,new self.$store.getters.Rx.Subject());
    
    //监听菜单删除事件
    self.$store.commit(Sub_Del_Menu,self.del_item);
    
    this.curTimerData=this.timerData;
    let timerShaft = self.$refs.timerShaft;
    let pageComp=this.$refs.pageComp;
    let tagData=_.find(this.tags,t=>t.id==this.curTagIndex); 
    //监听菜单数据改变事件
    this.$store.commit(Reg_Menu_Change_Even,(menu)=>{
        let type=menu.kind || 0; //菜单类型
        switch(type){
            case 0://普通
                this.curTimerData=_.filter(this.timerData,(item)=>{return item.id!='template' && item.id!='localData' && item.id!='ksearchIndex' && item.id!='ksearchSource' && item.id!='ksearchField' && item.id!='ksearchSort'});
            break;
            case 1://模板
                this.curTimerData=_.filter(this.timerData,(item)=>{return item.id!='condition' && item.id!='handle' && item.id!='localData' && item.id!='ksearchIndex' && item.id!='ksearchSource' && item.id!='ksearchField' && item.id!='ksearchSort'});
            break;
        }

        self.$nextTick(()=>{
            tagData.tagIndex=0;
            timerShaft.active(0);
            pageComp.activePage(0);
        });
    });

    //获取已定义的菜单集合数据
    this.$store.dispatch(Get_Operate).then(res=>{
    //   _.filter(res.biz_body,t=>{return t.name=="认证上网轨迹详情(模板)"})[0].showDataConfig.curSelFileds=[];
    //   _.filter(res.biz_body,t=>{return t.name=="认证上网轨迹详情(模板)"})[0].condtionsObj.query_fields=[];
    //   _.filter(res.biz_body,t=>{return t.name=="认证上网轨迹详情(模板)"})[0].condtionsObj.show_fields=[];
    // console.log(tool.Clone(_.filter(res.biz_body,t=>{return t.name=="认证上网轨迹详情(模板)"})));
        this.list=res.biz_body;
        for(let item of this.list){item.isSave=true;}
        this.$nextTick(()=>{
            //设置菜单集合
            this.$store.commit(Set_Menus,this.list);
            //默认菜单栏显示
            this.$nextTick(()=>{
                this.$refs.pageComp.reloadSly();
                this.curTagIndex='menu';
                tagData=_.find(this.tags,t=>t.id==this.curTagIndex); 
            })
        });
    });
    
    this.blnShowMenu=true;
  }
}
</script>
<style lang="less">
  @import "../css/variables.less";
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
    @import "../css/variables.less";
    @leftW:130px;
    @rightW:260px;
    @stepH:340px;
    @list_headerH:40px;
    @list_itemH:80px;

    .setting_page_container{height:100%;width:100%;position:relative;}

    @barCenterH:300px;
    .bar_page{height:100%;width:100%;position:absolute;background-color: white;z-index: 300;}
    .bar_page .center_bar{width:80%;height:@barCenterH;position:absolute;top:~'calc(50% - @{barCenterH}/2)';left:10%;}
    .bar_item {margin: 0 60px 0 0; padding: 10px; width:300px;.border('');}
    .bar_item:hover{-moz-box-shadow:2px 2px 10px #333333; -webkit-box-shadow:2px 2px 10px #333333; box-shadow:2px 2px 10px #333333;}
    .bar_item .bar_title{text-align:left;font-size:20px;font-weight:600;font-style: italic;}
    .bar_item .bar_icon{width:100%;height:@barCenterH/5*3;line-height:@barCenterH/5*3;text-align:center;font-size:100px;position:relative;}
    .bar_item .bar_icon .small_icon{position:absolute;right:80px;bottom:30px;font-size:50px;line-height:0px;background:white;border-radius:50%;width:55px;height:55px;text-align:center;}
    .bar_item .bar_icon .small_icon i{position: absolute;left: 5px;top: 2px;}

    .setting_page{height:100%;width:100%;position:relative;}
    .setting_page .left_container{float:left;width:@leftW;height:100%;background-color:@FrontCol;}
    .setting_page .right_container{float:right;width:@rightW;height:100%;background-color:@FrontCol;.trans();position:absolute;top:0px;right:-@rightW;}
    .setting_page .content_container{margin-left:@leftW+1;margin-right:0px;height:100%;background-color:shade(@FrontCol,5%);.trans();}
    .blnShowMenu .right_container{right:0px;}
    .blnShowMenu .content_container{margin-right:@rightW+1;}
    //右边列表栏
    .setting_page .right_container .list{.border('bottom');width:100%;height:100%;}
    .setting_page .right_container .list .header{.border('bottom');width:100%;height:@list_headerH;line-height:@list_headerH;padding:0px 10px;position:relative;text-align:left;}
    .setting_page .right_container .list .content{width:100%;height:~'calc(100% - @{list_headerH})';position:relative;padding-bottom:0px;}
    .setting_page .right_container .list .content .list_content{width:100%;height:100%;}
    .setting_page .right_container .list .header .title {float:left;}
    .setting_page .right_container .list .header .title .icon{
        color:white;height:-(20px-@list_headerH);width:-(20px-@list_headerH);background-color:@Font_Hover_Col;
        display: inline-block;border-radius: 50%;line-height: -(20px-@list_headerH);margin-right:5px;
    }
    .setting_page .right_container .list .header .title .icon i {font-size:12px;}
    .setting_page .right_container .list .header .btn-group {float: right;margin-top: 10px;}
    
    .setting_page .right_container .list .content .list_item{
        text-align:left;height:@list_itemH;.border('bottom',tint(@borderCol));padding:0px 10px 0px 0px;cursor:pointer;
        color:@FontCol;.trans(.1s);position: relative;overflow: hidden;
    }
    .setting_page .right_container .list .content .list_item:last-child{border:none;}
    .setting_page .right_container .list .content .list_item:first-child{.border('bottom',tint(@borderCol));}
    .setting_page .right_container .list .content .list_item .title{
        display:inline-block;width:100px;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow: ellipsis;overflow: hidden;padding-top:10px;padding-left:10px;padding-right:10px;
        width:~"calc(100% - @{list_itemH})"
    }

    .setting_page .right_container .list .content .list_item .tipInfo{
        position: absolute;width: 30px;height: 30px;
        color:white;font-size:12px;
    }

    .setting_page .right_container .list .content .list_item .tipInfo.flag-o{background: linear-gradient(-45deg, transparent 50%, @btn_Bg_Col_hover_6 50%);}
    .setting_page .right_container .list .content .list_item .tipInfo.bars{background: linear-gradient(-45deg, transparent 50%, @btn_Bg_Col_hover_1 50%);}

    .setting_page .right_container .list .content .list_item .tipInfo i{margin-left:3px;}

    .setting_page .right_container .list .content .list_item .title .title_name{margin-bottom:10px;font-style:italic;}
    .setting_page .right_container .list .content .list_item .title .title_kind{font-size:12px;}
    .setting_page .right_container .list .content .list_item .title .title_info{font-size:12px;}

    .setting_page .right_container .list .content .list_item .icon{
        height:-(1-@list_itemH);width:@list_itemH;text-align:center;float:left;font-size:40px;position:relative;line-height:@list_itemH;
    }
    .setting_page .right_container .list .content .list_item .date{float:right;font-size:12px;margin-right:10px;}
    .setting_page .right_container .list .content .list_item .option{
        height:@list_itemH;font-size:20px;cursor:pointer;position:absolute;right: 0px;top:0px;width: 50px;text-align:center;display:none;}
    .setting_page .right_container .list .content .list_item .option > div{line-height:40px;color:white;font-size:20px;}
    .setting_page .right_container .list .content .list_item:hover .option{display:block;}

    .setting_page .right_container .list .content .list_item.active{background-color:@Active_Bg_Col;color:@Active_Front_Col;}
    .setting_page .right_container .list .content .list_item.active .icon{.border('right',shade(@borderCol,10%))}
    .setting_page .right_container .list .content .list_item:hover{background-color:@btn_Bg_Col_hover_1;color:@Active_Front_Col;}

    .scrollbar:hover {cursor:pointer;}
    .scrollbar { width: 10px; height: 100%; position: absolute;right: 0px;top: 0px;background: #ccc;display:none;}
    .scrollbar .handle {width: 100%;height: 100px;background: @btn_Bg_Col_1;}

    .blnPage .scrollbar{display:block;}

    //右边列表栏
    .setting_page .left_container .step{width:100%;height:@stepH;}

    //菜单按钮样式
    .setting_page .menu_btn{
        position:absolute;right:0px;top:20px;width:10px;height:50px;background-color:@Font_Hover_Col;color:white;
        font-size:16px;line-height:50px;text-align:left;cursor:pointer;
    }
    .blnShowMenu .menu_btn{display:none;}
    .setting_page .menu_btn .menu_container{position:relative;height:100%;width:100%;}
    .setting_page .menu_btn .menu_container .content{
        width: 150px;height: 100%;position: absolute;top: 0px;right:-160px;background-color:@btn_Bg_Col_1;.trans();
        text-align:center; font-size:14px;
    }
    .setting_page .menu_btn:hover .menu_container .content{right:10px;z-index:0;}
    .setting_page .menu_btn .content i{font-size:20px;margin-right:10px;}
    .setting_page .menu_btn:hover .icon i{display:none;}
    .setting_page .menu_btn .menu_container .content span{height: 100%;display: inline-block;vertical-align: middle;line-height: 53px;}


    //tag
    .tag_item{
        display: inline-block;
        height: 30px;
        line-height: 30px;
        .border('');
        border-bottom: none;
        padding: 0px 10px;
        margin-top: 10px;
        margin-left: 10px;
        font-size: 12px;
        position: relative;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        color: @FontCol;
    }
    .tag_item.active::before{
        content: '';
        width: 100%;
        height: 2px;
        position: absolute;
        background-color: white;
        left: 0px;
        bottom: -1px;
    }
    
    .tag_item.active::after {
        content: '';
        width: 100%;
        height: 2px;
        position: absolute;
        background-color: @Font_Hover_Col;
        left: 0px;
        top: 0px;
    }

    .tag_item:hover{
        cursor: pointer;
        background-color: @Font_Hover_Col;
        color: white;
    }

    .localBtn{line-height:30px;.border('');color:@FontCol;cursor:pointer;}
    .localBtn:hover{background-color:@Font_Hover_Col;color:white;}

    .header_close_btn{float:right;font-size:12px;height:20px;width:20px;line-height:20px;text-align:center;
                      .border('');color:@Font_Hover_Col;cursor:pointer;border-radius:50%;margin-top:15px;margin-left:5px;}

    /**快搜右边栏提示框样式**/
    .searchInfo{width:100%;height:100%;padding:25px;text-align:left;}
    .searchInfo .title{font-weight:600;}
    .searchInfo .number{text-align:center;width:16px;height:16px;display:inline-block;border:1px solid black;border-radius:50%;font-size:10px;margin-right:5px;margin-bottom:20px;}
    .searchInfo .item{margin-bottom:10px;}
    .searchInfo .dot{width:5px;height:5px;background-color:black;border-radius:50%;display:inline-block;float:left;margin-top:8px; margin-right:5px;}
    .searchInfo .content{margin-left:15px;}
</style>
