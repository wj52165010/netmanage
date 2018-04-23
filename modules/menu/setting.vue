<!-- 菜单配置页面(起始页) -->
<template>
    <div class="Setting">
        <!--导航标识-->
        <div class="nav">
            <div class="nav_content">
                <TimeLine :data="navs" />
            </div>
            <div class="option">
                <template v-if="curBarId!=='AddSource' && 
                                curBarId!=='local' && 
                                curBarId!=='ShowBtn' && 
                                curBarId!='AddSourceNoFile' && 
                                curBarId!='search' &&
                                curBarId!='menu' &&
                                curBarId!='SpecialSource'">
                    <div><button type="button" class="btn btn-default btn-sm colorBlue" style="padding:5px 36px" @click="goBar()">返回</button></div>
                    <div><button type="button" class="btn btn-default btn-sm colorBlue" style="padding:5px 30px;margin-top:10px;" @click="preStep()"  :disabled="curStep==0">上一步</button></div>
                    <div><button type="button" class="btn btn-default btn-sm colorGreen" style="padding:5px 30px;margin-top:10px;" @click="nextStep()" :disabled="curStep==navs.length-1">下一步</button></div>
                </template>
                
                <!--数据源首页-->
                <template v-if="curBarId=='local' || curBarId=='ShowBtn'">
                    <div><button type="button" class="btn btn-default btn-sm colorBlue" style="padding:5px 36px" @click="goBar()">返回</button></div>
                    <!--<div><button type="button" class="btn btn-default btn-sm" style="padding:5px 24px;margin-top:10px;" @click="addSpecialSource()"  v-if="curBarId=='ShowBtn'">限定数据</button></div>-->
                </template>
                <!--新增数据源(带文件)-->
                <template v-if="curBarId=='AddSource'">
                    <div><button type="button" class="btn btn-default btn-sm" :class="{colorGray:!sourceCode,colorBlue:sourceCode}" style="padding:5px 36px" @click="goBar()">{{sourceCode?'返回':'取消'}}</button></div>
                    <div><button type="button" class="btn btn-default btn-sm colorBlue" style="padding:5px 30px;margin-top:10px;" @click="preStep()"  v-if="curStep!=0">上一步</button></div>
                    <div><button type="button" class="btn btn-default btn-sm colorBlue" style="padding:5px 24px;margin-top:10px;" v-if="curStep==0" @click="NoFileSetSource()">没有文件</button></div>
                    <div><button type="button" class="btn btn-default btn-sm colorGreen" style="padding:5px 30px;margin-top:10px;" @click="nextStep()" v-if="!(curStep==navs.length-1)">下一步</button></div>
                    <div><button type="button" class="btn btn-default btn-sm colorGreen" style="padding:5px 36px;margin-top:10px;" @click="save()" v-if="curStep==navs.length-1">保存</button></div>
                </template>

                <!--新增数据源(不带文件)-->
                <template v-if="curBarId=='AddSourceNoFile'">
                    <div><button type="button" class="btn btn-default btn-sm" :class="{colorGray:!sourceCode,colorBlue:sourceCode}" style="padding:5px 36px" @click="goBar()">{{sourceCode?'返回':'取消'}}</button></div>
                    <div><button type="button" class="btn btn-default btn-sm colorBlue" style="padding:5px 30px;margin-top:10px;" @click="preStep()"  v-if="curStep!=0">上一步</button></div>
                    <div><button type="button" class="btn btn-default btn-sm colorGreen" style="padding:5px 30px;margin-top:10px;" @click="nextStep()" v-if="!(curStep==navs.length-1)">下一步</button></div>
                    <div><button type="button" class="btn btn-default btn-sm colorGreen" style="padding:5px 36px;margin-top:10px;" @click="save()" v-if="curStep==navs.length-1">保存</button></div>
                </template>

                <!--限定数据源-->
                <template v-if="curBarId=='SpecialSource'">
                    <div><button type="button" class="btn btn-default btn-sm colorGray" style="padding:5px 36px" @click="goBar()">取消</button></div>
                    <div><button type="button" class="btn btn-default btn-sm colorBlue" style="padding:5px 30px;margin-top:10px;" @click="preStep()"  :disabled="curStep==0">上一步</button></div>
                    <div><button type="button" class="btn btn-default btn-sm colorGreen" style="padding:5px 30px;margin-top:10px;" @click="nextStep()" v-if="!(curStep==navs.length-1)">下一步</button></div>
                    <div><button type="button" class="btn btn-default btn-sm colorGreen" style="padding:5px 36px;margin-top:10px;" @click="save()" v-if="curStep==navs.length-1">保存</button></div>
                </template>

                <!--快搜页面-->
                <template v-if="curBarId=='search'">
                    <div><button type="button" class="btn btn-default btn-sm colorGray" style="padding:5px 36px" @click="goBar()">取消</button></div>
                    <div><button type="button" class="btn btn-default btn-sm colorBlue" style="padding:5px 30px;margin-top:10px;" @click="preStep()"  :disabled="curStep==0">上一步</button></div>
                    <div><button type="button" class="btn btn-default btn-sm colorGreen" style="padding:5px 30px;margin-top:10px;" @click="nextStep()" v-if="!(curStep==navs.length-1)">下一步</button></div>
                    <div><button type="button" class="btn btn-default btn-sm colorGreen" style="padding:5px 36px;margin-top:10px;" @click="save()" v-if="curStep==navs.length-1">保存</button></div>
                </template>

                <!--菜单配置页面-->
                <template v-if="curBarId=='menu'">
                    <div><button type="button" class="btn btn-default btn-sm colorGray" style="padding:5px 36px" @click="goBar()">取消</button></div>
                    <div><button type="button" class="btn btn-default btn-sm colorBlue" style="padding:5px 30px;margin-top:10px;" @click="preStep()"  :disabled="curStep==0">上一步</button></div>
                    <div><button type="button" class="btn btn-default btn-sm colorGreen" style="padding:5px 30px;margin-top:10px;" @click="nextStep()" v-if="!(curStep==navs.length-1)">下一步</button></div>
                    <div><button type="button" class="btn btn-default btn-sm colorGreen" style="padding:5px 36px;margin-top:10px;" @click="save()" v-if="curStep==navs.length-1">保存</button></div>
                </template>
            </div>
        </div>
        <!--配置页面展示区域-->
        <div class="content">
            <transition name="fade">
                <component v-for="(page,index) in navs" :is="page.page || ''" :params="page.params || {}" v-on:SendEvent="SendEvent"  v-bind:key="page" ref="pages"  v-if="curStep==index"></component>
            </transition>
        </div>
        <!--栏目选择页面-->
        <div class="bar_page" v-show="!curBarId">
            <div class="center_bar">
                <Slide :listen='bars' ref="slide">
                    <li class="bar_item" v-for="b in bars" @click="bar_click(b.id)">
                        <div class="bar_title">{{b.name}}</div>
                        <div class="bar_icon"><i :class="b.icon"></i><div class="small_icon"><i :class="b.sicon"></i></div></div>
                        <div class="bar_info">
                            <div v-for="i in b.info">
                                {{i.name}}:{{i.val}}
                            </div>
                            <div class="clearfix"></div>
                        </div>
                    </li> 
                </Slide>
            </div>
        </div>

    </div>
</template>

<script>
import {BODY_RESIZE,Set_Menus,Set_Menu,Get_Operate,SetSource,SET_ALL_TABLE_DATA,
        Set_Operate,Del_PlaceMenu,DelMenu,Reg_Menu_Change_Even,
        Add_System_Menus,Reg_Menu_Change,Reg_Data_Source_Change,IsDelSource,TriggerMenuChange,
        Reg_Del_Menu_Even,Sub_Del_Menu,upload_add_dataSource,SaveSource,ClearSepSource,ClearAddSourcePageData,
        Clear_Set_Setting_Obj,SaveSearch,Clear_Menu_Setting,SaveMenu,Set_Menu_Setting,SetAddSourcePageData,GetSearch
        } from '../../store/mutation-types'
import { mapState,mapMutations} from 'vuex'

import Accordion from 'components/accordion'
import TimeLine from 'components/TimeLine'
import MenuPage from './menu'
import SourcePage from './source'
import ListPage from './List'
import TmpSetPage from './tmpSetting'
import Slide from 'components/Slide'
import ksearchIndex from '../kuaisou/index'
import ksearchSource from '../kuaisou/source'
import ksearchCond from '../kuaisou/cond'
import SourceSet from '../source/index.vue'
import AddSource from '../source/addSource.vue'
import FieldSetting from '../source/fieldSetting.vue'
import TableSetting from '../source/Table.vue'
import SpecialSourceSet from '../source/SpecialSourceSet.vue'
import SpecialSourceCond from '../source/SpecialSourceCond.vue'
import SourceSuccess from '../source/success.vue'

//菜单导航内容
let menuNavs=[
          {name:'选择配置文件',page:'MenuPage',active:1},
          {name:'选择数据源',page:'SourcePage',active:0},
          {name:'配置显示',page:'ListPage',active:0}
          ];

//模板导航内容
let tmpNavs=[
     {name:'选择配置文件',page:'MenuPage',active:2},
     {name:'选择数据源',page:'SourcePage',active:0},
     {name:'设置模板',page:'TmpSetPage',active:0}
];

//快搜导航内容
let kuaiSearchNavs=[
  {name:'选择配置文件',page:'ksearchIndex',active:1},
  {name:'关联数据源',page:'ksearchSource',active:0},
  {name:'配置条件',page:'ksearchCond',active:0},
];

//数据源管理页面
let sourceNavs=[
    {name:'选择数据源',page:'SourceSet',active:1},
];

//新增数据源相关页面(带文件)
let addSourceNavs=[
    {name:'上传文件',page:'AddSource',active:1},
    {name:'字段配置',page:'FieldSetting',active:0},
    {name:'配置表',page:'TableSetting',active:0}
];

//新增数据源相关页面(不带文件)
let addSourceNoFileNavs=[
    {name:'字段配置',page:'FieldSetting',active:1},
    {name:'配置表',page:'TableSetting',active:0}
];

//特定数据源相关页面
let specialSourceNavs=[
    {name:'选择数据源',page:'SourceSet',active:2},
    {name:'数据源配置',page:'SpecialSourceSet',active:1},
    {name:'条件配置',page:'SpecialSourceCond',active:0},
];


export default {
  name: 'Setting',
  components:{
    Accordion,TimeLine,
    SourcePage,ListPage,MenuPage,Slide,TmpSetPage,
    ksearchIndex,ksearchSource,ksearchCond,
    SourceSet,AddSource,FieldSetting,TableSetting,
    SpecialSourceSet,SpecialSourceCond
  },
  data () {
    return {
      list:[],//菜单集合
      curSelPage:-1,//当前选中菜单
      curStep:0,//当前设置步数
      curBarId:'',//栏目ID
      //栏目集合
      bars:[
          {id:"menu",name:'菜单定制',icon:'fa fa-building-o',sicon:'fa fa-gear',info:[{name:'菜单数量',val:0},{name:'模板数量',val:0}]},
          {id:'local',name:'数据源管理',icon:'fa fa fa-database',sicon:'fa fa-search',info:[{name:'内建数据源',val:0},{name:'自建数据源',val:0}]},
          {id:'search',name:'快搜配置',icon:'fa fa-file-text-o',sicon:'fa fa-gear',info:[{name:'配置文件',val:0},{name:'正在使用',val:'安阳配置'}]}
      ],
      //导航项目数据
      navs:[],
    }
  },
  watch:{
      curBarId(){
        if(this.curBarId)return;
        this.SetNavInfo();
        this.$nextTick(()=>{
            this.$refs.slide.reload();
        });
      }
  },
  computed:mapState({
      dataSource:state=>{return state.oriSource;},
      //当前展示的页面对象
      curPage(){
          return _.find(this.navs,n=>n.active==1);
      },
      addSourceData:state=>{
          return state.addSource;
      },
      MenuKind:state=>state.MenuKind,
      sourceCode:state=>state.addSource.sourceCode
  }),
  mounted(){
      this.SetNavInfo();
    
  },
  beforeDestroy(){
    //清空配置页面相关的所有设置数据
    this.$store.commit(ClearAddSourcePageData);//清空新增数据源相关数据
    this.$store.commit(ClearSepSource);//清空限定数据源相关数据
    this.$store.commit(Clear_Set_Setting_Obj); //清空快搜相关数据
    this.$store.commit(Clear_Menu_Setting);//清空菜单相关数据
  },
  methods:{
    //设置导航栏相关数据信息
    SetNavInfo(){
        //获取已定义的菜单集合数据
        this.$store.dispatch(Get_Operate).then(res=>{
            this.list=res.biz_body;
            _.find(this.bars,b=>b.id=='menu').info[0].val=_.filter(this.list,l=>!l.kind).length;
            _.find(this.bars,b=>b.id=='menu').info[1].val=_.filter(this.list,l=>l.kind).length;
        });

        _.find(this.bars,b=>b.id=='local').info[0].val=_.keys(this.dataSource['内建数据源'].tables).length;
        _.find(this.bars,b=>b.id=='local').info[1].val=_.keys(this.dataSource['自建数据源'].tables).length;


        //获取快搜配置数据
        this.$store.dispatch(GetSearch).then(res=>{
            let data=res.biz_body;
            _.find(this.bars,b=>b.id=='search').info[0].val=data.length;
            _.find(this.bars,b=>b.id=='search').info[1].val=(_.find(data,d=>d.isDefault) || {name:''}).name;
        });
    },
    //没有文件添加数据源的情况
    NoFileSetSource(){
       this.$store.commit(ClearAddSourcePageData);//清空新增数据源相关数据
       this.curBarId='AddSourceNoFile';
       this.navs=tool.Clone(addSourceNoFileNavs);
    },
    //栏目单击事件
    bar_click(id){
        this.curBarId=id;
        this.curStep=0;
        this.navs=this.handlerStatus();
    },
    //处理栏目的状态
    //step:当前栏目所在步数起始位置为0
    handlerStatus(step){
        let navs=[];
        switch(this.curBarId){
            case 'menu'://菜单配置
                navs = tool.Clone(menuNavs);
                break;
            case 'local'://数据源管理
                navs =  tool.Clone(sourceNavs);
                break;
            case 'search'://快搜配置
                navs = tool.Clone(kuaiSearchNavs);
                break;
            case 'AddSource'://新增数据源(带文件)
                navs = tool.Clone(addSourceNavs);
                break;
            case 'AddSourceNoFile'://新增数据源(不带带文件)
                navs = tool.Clone(addSourceNoFileNavs);
                break;
            case 'SpecialSource'://限定数据源
                navs = tool.Clone(specialSourceNavs);
                break;
            case 'tmpSet'://模板设置
                navs=tool.Clone(tmpNavs);
                break;
        }
        
        for(let i=0;i<=step;i++){
            navs[i].active=i==step?1:2;
        }

        return navs;
    },
    //保存数据
    save(){
        let s=this;
        switch(this.curBarId){
            case 'menu'://菜单配置
                this.$store.dispatch(SaveMenu).then(res=>{
                    let {menu,blnUpdate}=res;
                    if(blnUpdate){
                        //修改菜单
                        this.$store.commit(TriggerMenuChange,menu);

                        return;
                    }

                    //新增菜单
                    this.$store.commit(Add_System_Menus,menu);

                    //修改数据源数据
                    if(menu.condtionsObj && menu.condtionsObj.target){
                        let dataSource=tool.Clone(s.dataSource);
                        let customSource=dataSource['自建数据源'];//自建数据源对象
                        let innerSource=dataSource['内建数据源'];//内建数据源
                        let source=customSource.tables[menu.condtionsObj.target] || innerSource.tables[menu.condtionsObj.target];

                        this.$store.dispatch(IsDelSource,source.key).then(res=>{
                            source.isDel=res.biz_body.isDel;
                            this.$store.commit(SetSource,dataSource);
                        });
                    }
                });
                break;
            case 'AddSource'://新增数据源
                //保存数据源信息
                this.$store.dispatch(SaveSource,{blnConfirm:true}).then(res=>{
                    if(!tool.msg(res,''))return;

                    //添加新增的数据源到已有的数据源中
                    let dataSource=tool.Clone(s.dataSource);
                    let customSource=dataSource['自建数据源'];//自建数据源对象
                    customSource.tables[res.biz_body.code]=res.biz_body.config;
                    this.$store.commit(SetSource,dataSource);

                    //设置数据源唯一标识
                    this.$store.commit(SetAddSourcePageData,{sourceCode:res.biz_body.code});

                    let table=res.biz_body.config;
                    tool.open(function(){
                        let html=`
                            <SourceSuccess :store=store @complete="close" @customMenu="customMenu" />
                        `;
                        let param={
                            title:'提示',
                            area:['400px','200px'],
                            content:`<div style="width:100%;height:100%;">${html}</div>`,
                            components:{SourceSuccess},
                            context:{
                                store:s.$store,
                                close(){param.close();},
                                //定制菜单
                                customMenu(){
                                    //清空数据源配置页面数据
                                    s.$store.commit(ClearAddSourcePageData);
                                    //跳转的菜单配置页面
                                    s.curBarId='menu';
                                    s.curStep=1;
                                    s.navs=s.handlerStatus(s.curStep);
                                    //构建新增菜单数据
                                    let menu = {
                                        name:`${table.name}(菜单)`,
                                        icon:'fa fa-tags',
                                        keyid:tool.guid(),
                                        blnShow:1,
                                        disabled:false,
                                        kind:0,
                                        createtime:tool.Timestamp(new Date()),
                                        createpersonid:ser.baseBag.userid,
                                        menu_type:_.find(s.MenuKind,c=>c.isDefault),
                                        isSave:false,
                                        status:JSON.stringify({status:s.Menu_State.getKey('创建中')})
                                    }

                                    //设置菜单配置页面相关数据
                                    s.$store.commit(Set_Menu_Setting,{
                                        menu:menu,
                                        curSelTable:table,
                                        pageIndex:0,
                                    });
                                }
                            },
                            success(layero,index){
                            }
                        };

                        return param;
                    }());
                });
                
                break;
            case 'AddSourceNoFile'://新增数据源不带文件的情况
                this.$store.dispatch(SaveSource,{blnConfirm:true}).then(res=>{
                    if(!tool.msg(res))return;
                    //添加新增的数据源到已有的数据源中
                    let dataSource=tool.Clone(s.dataSource);
                    let customSource=dataSource['自建数据源'];//自建数据源对象
                    customSource.tables[res.biz_body.code]=res.biz_body.config;
                    this.$store.commit(SetSource,dataSource);

                    //设置数据源唯一标识
                    this.$store.commit(SetAddSourcePageData,{sourceCode:res.biz_body.code});

                    let table=res.biz_body.config;

                    tool.open(function(){
                        let html=`
                            <SourceSuccess :store=store :model="1" @complete="close" @customMenu="customMenu" />
                        `;
                        let param={
                            title:'提示',
                            area:['400px','200px'],
                            content:`<div style="width:100%;height:100%;">${html}</div>`,
                            components:{SourceSuccess},
                            context:{
                                store:s.$store,
                                close(){param.close();},
                                //定制菜单
                                customMenu(){
                                    //清空数据源配置页面数据
                                    s.$store.commit(ClearAddSourcePageData);
                                    //跳转的菜单配置页面
                                    s.curBarId='menu';
                                    s.curStep=1;
                                    s.navs=s.handlerStatus(s.curStep);
                                    //构建新增菜单数据
                                    let menu = {
                                        name:`${table.name}(菜单)`,
                                        icon:'fa fa-tags',
                                        keyid:tool.guid(),
                                        blnShow:1,
                                        disabled:false,
                                        kind:0,
                                        createtime:tool.Timestamp(new Date()),
                                        createpersonid:ser.baseBag.userid,
                                        menu_type:_.find(s.MenuKind,c=>c.isDefault),
                                        isSave:false,
                                        status:JSON.stringify({status:s.Menu_State.getKey('创建中')})
                                    }

                                    //设置菜单配置页面相关数据
                                    s.$store.commit(Set_Menu_Setting,{
                                        menu:menu,
                                        curSelTable:table,
                                        pageIndex:0,
                                    });
                                }
                            },
                            success(layero,index){
                            }
                        };

                        return param;
                    }());
                    
                });
                break;
            case 'SpecialSource'://特定数据源
                console.log(2);
                break;

            case 'search'://快搜
                this.$store.dispatch(SaveSearch).then(res=>{

                });
                break;

        }
    },
    //清空页面相关数据
    ClearPageData(){
        //清空所有页面之前的选择内容
        if(this.$refs.pages){
            for(let i=0;i<this.$refs.pages.length;i++){
                if(this.$refs.pages[i].clearData)this.$refs.pages[i].clearData();
            }
        }
    },
    //返回栏目页面
    goBar(blnNoClearData){
        //处理不同页面返回按钮单击时执行的操作不一样
        let nav=_.find(this.navs,n=>n.active==1);

        //新增数据源页面触发返回
        if(_.filter(addSourceNavs,s=>s.page==nav.page).length>0){
            //新增数据源字段设置页面触发取消事件
            if(nav.page=='FieldSetting'){
                if(this.sourceCode){
                    this.curStep=0;
                    this.curBarId='local';
                    this.navs=this.handlerStatus();
                    if(!blnNoClearData)this.ClearPageData();
                    return;
                }
                tool.confirm('还需一步即可完成，确定要退出操作吗？',['确定','取消'],()=>{
                    this.curStep=0;
                    this.curBarId='local';
                    this.navs=this.handlerStatus();
                    if(!blnNoClearData)this.ClearPageData();
                },function(){});
                return;
            }

            //新增数据源表设置页面触发取消事件
            if(nav.page=='TableSetting'){
                if(this.sourceCode){
                    this.curStep=0;
                    this.curBarId='local';
                    this.navs=this.handlerStatus();
                    if(!blnNoClearData)this.ClearPageData();
                    return;
                }
                tool.confirm('退出后当前配置将不被保存，确定要退出操作吗？',['确定','取消'],()=>{
                    this.curStep=0;
                    this.curBarId='local';
                    this.navs=this.handlerStatus();
                    if(!blnNoClearData)this.ClearPageData();
                },function(){});
                return;
            }

            this.curStep=0;
            this.curBarId='local';
            this.navs=this.handlerStatus();
            if(!blnNoClearData)this.ClearPageData();

            return;
        }


        this.curStep=0;
        //特定(限定)数据源页面触发返回
        if(_.filter(specialSourceNavs,s=>s.page==nav.page).length>0 && nav.page!='SourceSet'){
            this.curBarId='local';
            this.navs=this.handlerStatus();
            if(!blnNoClearData)this.ClearPageData();

            return;
        }


        this.curBarId='';
        //清空所有页面之前的选择内容
        if(!blnNoClearData)this.ClearPageData();
        this.navs=[];
    },
    //下一步单击事件
    nextStep(){
        //判断新增数据源流程是否可以进入下一步
        if(!this.$store.getters.addSource_blnGo(this.navs[this.curStep].page).flag && (this.curBarId=='AddSource' || this.curBarId =='AddSourceNoFile')){
            tool.info(this.$store.getters.addSource_blnGo(this.navs[this.curStep].page).info);
            return;
        }

        //判断限定数据源流程是否可以进入下一步
        if(!this.$store.getters.sepSource_blnGo(this.navs[this.curStep].page).flag && this.curBarId=='SpecialSource' ){
            tool.info(this.$store.getters.sepSource_blnGo(this.navs[this.curStep].page).info);
            return;
        }

        //判断快搜流程是否可以进入下一步
        if(!this.$store.getters.kuaisou_blnGo(this.navs[this.curStep].page).flag && this.curBarId=='search' ){
            tool.info(this.$store.getters.kuaisou_blnGo(this.navs[this.curStep].page).info);
            return;
        }

        //判断菜单配置流程是否可以进入下一步
        if(!this.$store.getters.menu_blnGo(this.navs[this.curStep].page).flag && this.curBarId=='menu' ){
            tool.info(this.$store.getters.menu_blnGo(this.navs[this.curStep].page).info);
            return;
        }

        if(!this.$store.getters.menu_blnGo(this.navs[this.curStep].page).flag && this.curBarId=='tmpSet'){
            tool.info(this.$store.getters.menu_blnGo(this.navs[this.curStep].page).info);
            return;
        }

        //菜单流程(模板设置)
        if(this.curBarId=='menu' && this.$store.state.menuManage.menu.kind==1){
            this.curBarId='tmpSet';
            this.curStep=1;
            this.navs=this.handlerStatus(this.curStep);

            return;
        }

        this.curStep=this.curStep+1>=this.navs.length?this.navs.length-1:this.curStep+1;
        this.navs=this.handlerStatus(this.curStep);
    },
    //上一步单击事件
    preStep(){
        
        this.curStep=this.curStep-1<0?0:this.curStep-1;
        
        //判断限定数据上一步回到数据源页面需要特殊处理
        if(this.curBarId=='SpecialSource' && this.curStep==0){
            this.goBar(true);
            return;
        }

        //判断模板设置上一步回到菜单显示页面
        if(this.curBarId=='tmpSet' && this.curStep==0){
           this.curBarId='menu';
        }


        this.navs=this.handlerStatus(this.curStep);
    },
    //接收各个页面组件内部发送出来的事件
    /*
     *   event:{
     *      name:''//事件名称
     *      page:''//所属页面名称
     *      param:{}/[],//参数
     *   }
     */
    SendEvent(event){
        
        //数据源配置页面触发新建表事件
        if(event.name=='AddSource' && event.page=='SourceSet'){
            this.curBarId='AddSource';
            this.navs=tool.Clone(addSourceNavs);
        }

        //数据源配置页面触发限定数据添加事件
        if(event.name=='ShowBtn' && event.page=='SourceSet'){
            this.curBarId=event.param.blnShowBtn?'ShowBtn':'local';
            //this.navs=tool.Clone(specialSourceNavs);
        }
    },
    //新增特定数据源
    addSpecialSource(){
        this.$refs.pages[0].SavePageData();
        //判断页面是否允许进入限定数据源设置界面
        if(!this.$store.getters.sepSource_blnGo(this.navs[this.curStep].page).flag){
            tool.info(this.$store.getters.sepSource_blnGo(this.navs[this.curStep].page).info);
            this.$refs.pages[0].clearData();
            return;
        }

        this.curBarId='SpecialSource';
        this.curStep=1;
        this.navs=tool.Clone(specialSourceNavs);
    }
  }

}
</script>
<style scoped lang="less">
 @import "../../css/variables.less";
 .Setting{width:100%;height:100%;background-color:white;position:relative;}
 @menuBarW:0px;
 @navW:200px;
 .menuBar{width:@menuBarW;height:100%;.border('right');float:left;}
 .Setting .nav{width:@navW;height:100%;.border('left');float:right;background-color:#dcdcdc;}
 .content{margin-left:@menuBarW;margin-right:@navW + 1px;height:100%;}
 
 @navOptionH:120px;
 .option{height:@navOptionH;width:100%;}
 .nav_content{height:~'calc(100% - @{navOptionH})';width:100%;}

 .fade-enter-active {
    -o-animation-name: FadeInRight;
    -o-animation-duration: 1s;
    -o-animation-fill-mode: both;
    -webkit-animation-name: FadeInRight;
    -webkit-animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    -moz-animation-name: FadeInRight;
    -moz-animation-duration: 1s;
    -moz-animation-fill-mode: both;
    animation-name: FadeInRight;
    animation-duration: 1s;
    animation-fill-mode: both;
 }
 .fade-leave-active{
    opacity: 0
 }
 .fade-enter/* .fade-leave-active below version 2.1.8 */ {
   -o-animation-name: FadeInRight;
    -o-animation-duration: 1s;
    -o-animation-fill-mode: both;
    -webkit-animation-name: FadeInRight;
    -webkit-animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    -moz-animation-name: FadeInRight;
    -moz-animation-duration: 1s;
    -moz-animation-fill-mode: both;
    animation-name: FadeInRight;
    animation-duration: 1s;
    animation-fill-mode: both;
 }
 .fade-leave-to {
     opacity: 0
 }

 //栏目选择页面样式
 @barCenterH:300px;
.bar_page{height:100%;width:100%;position:absolute;background-color: white;z-index: 300;top: 0px;left:0px;}
.bar_page .center_bar{width:80%;height:@barCenterH;position:absolute;top:~'calc(50% - @{barCenterH}/2)';left:10%;}
.bar_item {margin: 0 60px 0 0; padding: 0px; width:300px;.border('');border-top-left-radius:5px;border-top-right-radius:5px;}
.bar_item:hover{
    background-color:@Font_Hover_Col;color:white;
    -moz-box-shadow:2px 2px 10px #333333; -webkit-box-shadow:2px 2px 10px #333333; box-shadow:2px 2px 10px #333333;
    border:none;
}
.bar_item:hover .bar_info{background-color:@HeaderBgCol;}
.bar_item:hover .bar_icon .small_icon{background-color:@Font_Hover_Col;}

.bar_item .bar_title{text-align:left;font-size:20px;font-weight:600;text-align:center;margin-top:10px;}
.bar_item .bar_icon{width:100%;height:@barCenterH/5*3;line-height:@barCenterH/5*3;text-align:center;font-size:100px;position:relative;}
.bar_item .bar_icon .small_icon{position:absolute;right:80px;bottom:30px;font-size:50px;line-height:0px;background:white;border-radius:50%;width:55px;height:55px;text-align:center;}
.bar_item .bar_icon .small_icon i{position: absolute;left: 5px;top: 2px;}

.bar_item .bar_info{font-size:14px;font-weight:400;overflow:hidden;height:41px;line-height:41px;padding:0px 10px;background-color:#cccccc;}
.bar_item .bar_info div:first-child{float:left;}
.bar_item .bar_info div{float:right;}

.Setting .colorBlue{background-color:#6f859a;color:white;}
.Setting .colorGreen{background-color:@Font_Hover_Col;color:white;}
.Setting .colorGray{background-color:#999999;color:white;}
</style>
