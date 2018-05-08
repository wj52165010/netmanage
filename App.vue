<template>
  <div id="app">
    <!--<div style="padding:10px;width:300px;background-color:white;">
      <dropdwonBtn :btn="{name:'定位',action:''}">
        <div>12321</div>
        <div>645645</div>
      </dropdwonBtn>
    </div>-->
    <div class="Header">
      <CHeader :userInfo="user" @mouseleave="menu_mouseleave" @mouseenter="menu_mouseenter"></CHeader>
    </div>
    <div class="Content">
      <virtualIden v-if="false" />
      <!--<router-view></router-view>-->
      <NavPage ref="HPage"></NavPage>
      <div class="menu_c_container" :class="{active:blnShowMenu}"><SideMenu :menus="menus" @Blnshow="blnShow"></SideMenu></div>
      <!--<MenuTable :menus="menus"></MenuTable>-->
    </div>
    <!--<MenuBtn :menus="menus"></MenuBtn>-->
    <div class="index_footer" v-if="true">
      <div style="float:left;"><div class="helperBtn orange" @click="helperClick()"><i class="fa fa-question-circle-o"></i><span style="margin-left:10px;-moz-user-select:none;-khtml-user-select:none;user-select:none;">帮助</span></div></div>
      <div style="float:right;padding-right:10px;">Copyright © 2018 重庆智多信息发展有限公司.版权所有 当前版本:<span style="color:rgb(3, 171, 103);"><span style="cursor:pointer;" @click="banbenClick()">1.0.4-alpha</span></span></div>
    </div>
    <!-- 快搜 -->
    <Kuaiso />
    <!-- 全局加载中弹出层 -->
    <div id="loading_pop_g" class="loading_pop">
      <img src="static/Loading6.gif" />
    </div>

    <div style="position:absolute;top:10px;left:200px;color:white;" v-if="false">
      <PlaceSearch @place_res="placechange" c_searchKind="1"></PlaceSearch>
    </div>
    <!--测试基础组件-->
    <div style="position:absolute;top:10px;left:700px;color:white;" v-if="false">
      <testCom />
    </div>
  </div>
</template>

<script>
import testCom from './components/testCom'
import virtualIden from './components/virtualIden'
import dropdwonBtn from 'components/dropdwonBtn'

import 'webui-popover/dist/jquery.webui-popover.css'
import 'webui-popover/dist/jquery.webui-popover.js'
import CHeader from './components/Header'
import MenuBtn from './components/MenuBar'
import SideMenu from './components/SideMenu'
import MenuTable from './components/MenuTable'
import Kuaiso from './components/Kuaiso'

import '../static/sly.js'
import '../static/layer/skin/layer.css'
import '../static/layer/layer.js'
import '../static/toast/jquery.toast.css'
import '../static/toast/jquery.toast.js'

import NavPage from './components/NavPage'
// import {tool} from './js/tool.js'
let Rx = require('rxjs/Rx');

import PlaceSearch from './components/PlaceSearch'

import {Reg_Navigation_Func,Reg_Del_Nav_Func,Reg_Navigation_Refresh,Get_Operate,Set_System_Menus,Add_System_Menus,SetSource,FieldType,SetFieldKind,FormatDatas,SetFormatData,FormatSearch,SetFormatSearch,
        RSet_System_Menus,Reg_Rx,Add_History_Menu,RegVirType,GetUser,Date_Source,SET_ALL_TABLE_DATA,GetFirm,GetMenuKind,SetMenuKind,MenuChangeEven,DelMenu,broastBacktrack} from './store/mutation-types'

//设置用户ID和请求令牌
ser.baseBag.userid=tool.cookie.get('userid');
ser.baseBag.token=tool.cookie.get('token');
let tokenExp=tool.cookie.get('exp');
let permissions=tool.cookie.get('permissions');

let auth=(tokenExp)=>{
  setTimeout(()=>{
    ser.GetNewToken(ser.baseBag.token).then((res)=>{
      if(res.msg.code!='successed'){
        tool.info('获取令牌失败,系统将于5秒后自动退出,请重新登录!');
        setTimeout(()=>{
          ser.LoginOut(tool.cookie.get('account')).then(res=>{
            tool.cookie.del('token');
            tool.cookie.del('userid');
            tool.cookie.del('exp');
            tool.cookie.del('permissions');
            tool.cookie.del('account');
            tool.cookie.del('pwd');
            tool.cookie.del('centerPoint');
            window.location='login.html';
          });
          return;
        },5000); 
        return;
      }
      
      let expTime='s'+res.biz_body.exp;
      ser.baseBag.token=res.biz_body.token;
      tool.cookie.set('token',res.biz_body.token,expTime);
      tool.cookie.set('userid',res.biz_body.user_id,expTime);
      tool.cookie.set('exp',res.biz_body.exp,expTime);
      tool.cookie.set('permissions',res.biz_body.permissions.join(','),expTime);
      // tool.cookie.set('account',tool.cookie.get('account'),expTime);
      // tool.cookie.set('pwd',tool.cookie.get('pwd'),expTime);
      // tool.cookie.set('centerPoint','114.35,36.10',expTime);//中心点(106.33,29.35:重庆中心点)
      ser.baseBag.userid=tool.cookie.get('userid')
      ser.baseBag.token=tool.cookie.get('token');
      auth(res.biz_body.exp);
    });
  },parseInt(tokenExp)*1000);
};
auth(tokenExp);

//监听服务器端事件
let socket = io(ser.url);
let subJect_socket = new Rx.Subject();//socket连接成功调用
let subJect_mounted = new Rx.Subject();//页面加载完成调用
let menus_mounted = new Rx.Subject();//菜单加载完成调用
let backtrack_sub=new Rx.Subject();//回溯状态改变事件
let source=subJect_socket.combineLatest(subJect_mounted,menus_mounted,function(menu,func){return {menu:menu,func:func};});

var subscription = source.subscribe((x)=>{
      x.func(RSet_System_Menus,x.menu);
    });

//监听服务器端模块状态事件
socket.on('menuInfo', function (data) {
  if(!data){return;}
  subJect_socket.next(eval('('+data+')').data);
});

//监听回溯状态改变事件
socket.on('menuShowBacktrack',function(data){
  let d=eval('('+data+')').data;

  backtrack_sub.next(d);
});

//监听报警推送信息
socket.on('alarm_data',function(data){
  if(!data){return;}
  let res=eval('('+data+')');
  let alarmKind={audit_policy:'策越报警',key_identity:'重点人员报警'};
  $.toast({
      heading: alarmKind[res.type],
      text: `报警人:${res.data.customer_name}`,
      showHideTransition: 'slide',
      icon: 'info',
      hideAfter:5000
  });
});

//监听强制退出信息
socket.on('loginout',function(data){
  
  if(!data)return;
  let res=eval('('+data+')');
  if(tool.cookie.get('token')!=res.token)return;
  
  tool.info('您的账号在其他地方登录,您将会在5秒后退出!');
  setTimeout(()=>{
      ser.LoginOut(tool.cookie.get('account')).then(res=>{
        if(!tool.msg(res,'','退出失败!'))return;
        tool.cookie.del('token');
        tool.cookie.del('userid');
        tool.cookie.del('exp');
        tool.cookie.del('permissions');
        tool.cookie.del('account');
        tool.cookie.set('Invalid',1);
        window.location='login.html';
      })
  },5000);
});


//判断是否页面已经失效(失效则退回到登录页面)
if(tool.cookie.get('Invalid')){
  ser.LoginOut(tool.cookie.get('account')).then(res=>{
    if(!tool.msg(res,'','退出失败!'))return;
    tool.cookie.del('token');
    tool.cookie.del('userid');
    tool.cookie.del('exp');
    tool.cookie.del('permissions');
    tool.cookie.del('account');
    tool.cookie.set('Invalid',1);
    window.location='login.html';
  })
}

//监听页面是否进行操作事件
let optionLimitTime=60*10;

let optionSub = Rx.Observable.fromEvent($('body')[0], 'mouseover')
.debounceTime(optionLimitTime* 1000)
.subscribe(()=>{
  optionSub.unsubscribe();
  //设置失效标识
  tool.cookie.set('Invalid',1);

  tool.NoBtnComfirm('您长时间无操作,请重新登录验证身份!',['确定'],()=>{
      ser.LoginOut(tool.cookie.get('account')).then(res=>{
        if(!tool.msg(res,'','退出失败!'))return;
        tool.cookie.del('token');
        tool.cookie.del('userid');
        tool.cookie.del('exp');
        tool.cookie.del('permissions');
        tool.cookie.del('account');
        window.location='login.html';
      });
  });

});

//判断页面资源是否下载完成
let assetLoaded=new Rx.Subject();//页面JS,CSS等资源加载完成调用
let menucombine=new Rx.Subject();//菜单数据合并

let loadedListen=Rx.Observable.combineLatest([assetLoaded,menus_mounted,menucombine]);
let app=null;//应用程序对象
loadedListen.subscribe(()=>{
  $('#init_info').remove();
  //默认加载首页
  app.t.$store.commit(Add_History_Menu,app.menus[0]);
});

export default {
  name: 'app',
  components: {
    CHeader,
    MenuBtn,
    NavPage,
    SideMenu,
    MenuTable,
    PlaceSearch,
    testCom,
    Kuaiso,
    virtualIden,
    dropdwonBtn,
  },
  data () {
    return {
      menus:[],
      historyMenu:[],//历史菜单
      blnShowMenu:false,
      user:{},//用户信息
    }
  },
  mounted(){

    app={t:this,menus:[]};

    //判断当前资源加载完成
    document.onreadystatechange =function()   
    {   
        if(document.readyState == "complete"){ //当页面加载状态为完全结束时进入
            assetLoaded.next(1);  
        }   
    } 

    //回溯状态改变事件
    backtrack_sub.subscribe(d=>{
      this.$store.commit(broastBacktrack,d);
    });
    

    //获取字段类型
    this.$store.dispatch(FieldType).then(res=>{
      this.$store.commit(SetFieldKind,res.biz_body);
    });

    //获取格式化选项数据集合
    this.$store.dispatch(FormatDatas).then(res=>{
      this.$store.commit(SetFormatData,res.biz_body);
    });

    //获取查询格式化选项数据集合
    this.$store.dispatch(FormatSearch).then(res=>{
      this.$store.commit(SetFormatSearch,res.biz_body);
    });

    //获取菜单类型集合
    let MenuKind=[];
    this.$store.dispatch(GetMenuKind).then(res=>{

      this.$store.commit(SetMenuKind,res.biz_body);
      MenuKind=this.$store.getters.MenuKind;
      //添加一个测试菜单分类(非测试可删除)
      // MenuKind.push({
      //   icon:"fa fa-navicon",
      //   title:'案例',
      //   orderby:10000,
      //   id:100000,
      // });

      //获取登录用户信息
      this.$store.dispatch(GetUser,ser.baseBag.userid).then(res=>{
        if(res.msg.code!='successed'){return;}
        this.user=res.biz_body[0];
      });

      //获取虚拟身份类型
      this.$store.dispatch('VirType').then(res=>{
        this.$store.commit(RegVirType,res.biz_body);
      });

      this.$store.commit(Reg_Rx,Rx);
      //注册跳转页面方法
      this.$store.commit(Reg_Navigation_Func,this.$refs.HPage.activePage);
      this.$store.commit(Reg_Navigation_Refresh,this.$refs.HPage.refresh);
      this.$store.commit(Reg_Del_Nav_Func,this.$refs.HPage.delPage);
      this.menus=tool.Clone(MenuKind);
      this.$store.commit(Set_System_Menus,this.menus);
      //定制菜单页面
      let fixMenus=[
        {name:'首页',icon:'fa fa-opera',keyid:"11029",menu_type:_.find(MenuKind,m=>m.id==8),blnShow:0,status:'{status:"completed"}',type:"Home"},
        //{name:'列表拖动',icon:'fa fa-dashboard',id:'31015',keyid:"31015",menu_type:MenuKind[2],blnShow:1,status:'{status:"completed"}',type:"TableDrag"},
        {name:'报警布控',icon:'fa fa-address-book',keyid:"11010",menu_type:_.find(MenuKind,m=>m.id==9),blnShow:1,status:'{status:"completed"}',type:"deployCtrlPage"},
        // {name:'碰撞关系',icon:'fa fa-address-book',keyid:"11020",menu_type:MenuKind[1],blnShow:1,status:'{status:"completed"}',type:"CollisionPage"},
        //{name:'高危库',icon:'fa fa-address-book',keyid:"11018",menu_type:MenuKind[1],blnShow:1,status:'{status:"completed"}',type:"highriskPage"},
        {name:'高危库',icon:'fa fa-address-book',keyid:"11026",menu_type:_.find(MenuKind,m=>m.id==9),blnShow:1,status:'{status:"completed"}',type:"HighRiskPage"},
        {name:'权限配置',icon:'fa fa-chain',keyid:"11011",menu_type:_.find(MenuKind,m=>m.id==3),blnShow:1,status:'{status:"completed"}',type:"permisPage"},
        {name:'用户管理',icon:'fa fa-users',keyid:"11012",menu_type:_.find(MenuKind,m=>m.id==3),blnShow:1,status:'{status:"completed"}',type:"UserManagePage"},
        // {name:'关系图',icon:'fa fa-users',keyid:"11013",menu_type:MenuKind[2],blnShow:1,status:'{status:"completed"}',type:"RelationPage"},
        {name:'综合分析',icon:'fa fa-dashboard',keyid:"11014",menu_type:_.find(MenuKind,m=>m.id==8),blnShow:1,status:'{status:"completed"}',type:"AnalysisPage"},
        // {name:'分析详细页面',icon:'fa fa-dashboard',keyid:"11016",menu_type:MenuKind[2],blnShow:1,status:'{status:"completed"}',type:"AnalysisDetailPage"},
        // {name:'碰撞分析页面',icon:'fa fa-dashboard',keyid:"11017",menu_type:MenuKind[2],blnShow:1,status:'{status:"completed"}',type:"CrashAnalyPage"},
        // {name:'碰撞分析详细',icon:'fa fa-dashboard',keyid:"11021",menu_type:MenuKind[2],blnShow:1,status:'{status:"completed"}',type:"CrashDetailPage"},
        {name:'远程接口管理',icon:'fa fa-dashboard',keyid:"13023",menu_type:_.find(MenuKind,m=>m.id==3),blnShow:1,status:'{status:"completed"}',type:"remoteInterfacePage"},
        {name:'案件管理',icon:'fa fa-suitcase',keyid:"11024",menu_type:_.find(MenuKind,m=>m.id==8),blnShow:1,status:'{status:"completed"}',type:"CaseManagePage"},
        {name:'CCIC预警',icon:'fa fa-dashboard',keyid:"11025",menu_type:_.find(MenuKind,m=>m.id==9),blnShow:1,status:'{status:"completed"}',type:"CCICPage"},
        {name:'操作日志',icon:'fa fa-opera',keyid:"11027",menu_type:_.find(MenuKind,m=>m.id==3),blnShow:1,status:'{status:"completed"}',type:"OperLogPage"},

       // {name:'同行轨迹',icon:'fa fa-opera',keyid:"11028",menu_type:_.find(MenuKind,m=>m.id==8),blnShow:1,status:'{status:"completed"}',type:"PeerTrack"},
        //{name:'关系展示(案例)',icon:'fa fa-opera',keyid:"11030",menu_type:_.find(MenuKind,m=>m.id==100000),blnShow:1,status:'{status:"completed"}',type:"Relation"},
        {name:'关系展示',icon:'fa fa-user-plus',keyid:"11031",menu_type:_.find(MenuKind,m=>m.id==8),blnShow:1,status:'{status:"completed"}',type:"Relation2"},
        //{name:'测试关系展示(案例)',icon:'fa fa-opera',keyid:"11032",menu_type:_.find(MenuKind,m=>m.id==100000),blnShow:1,status:'{status:"completed"}',type:"TestRelation"},
        //{name:'轨迹分析(案例)',icon:'fa fa-opera',keyid:"11033",menu_type:_.find(MenuKind,m=>m.id==100000),blnShow:1,status:'{status:"completed"}',type:"Track"},
        {name:'轨迹分析',icon:'fa fa-paper-plane',keyid:"11034",menu_type:_.find(MenuKind,m=>m.id==8),blnShow:1,status:'{status:"completed"}',type:"Track2"},
        {name:'关注人员',icon:'fa fa-user-times',keyid:"11035",menu_type:_.find(MenuKind,m=>m.id==9),blnShow:1,status:'{status:"completed"}',type:"AttenPerson"},
        {name:'最短路径',icon:'fa fa-map',keyid:"11036",menu_type:_.find(MenuKind,m=>m.id==8),blnShow:1,status:'{status:"completed"}',type:"ShortPath"},
        //{name:'二次碰撞详细页面(案例)',icon:'fa fa-opera',keyid:"11037",menu_type:_.find(MenuKind,m=>m.id==100000),blnShow:1,status:'{status:"completed"}',type:"CrashSecondDetail"},
        {name:'网约车',icon:'fa fa-car',keyid:"11038",menu_type:_.find(MenuKind,m=>m.id==8),blnShow:1,status:'{status:"completed"}',type:"NetAboutCar"},
        {name:'车船航班',icon:'fa fa-plane',keyid:"11039",menu_type:_.find(MenuKind,m=>m.id==8),blnShow:1,status:'{status:"completed"}',type:"ShipCar"},
        {name:'隐患快递',icon:'fa fa-truck',keyid:"11040",menu_type:_.find(MenuKind,m=>m.id==8),blnShow:1,status:'{status:"completed"}',type:"Expressage"},

        {name:'场所管理',icon:'fa fa-cubes',keyid:"11041",menu_type:_.find(MenuKind,m=>m.id==7),blnShow:1,status:'{status:"completed"}',type:"sitePage"},
        {name:'设备管理',icon:'fa fa-ticket',keyid:"11042",menu_type:_.find(MenuKind,m=>m.id==7),blnShow:1,status:'{status:"completed"}',type:"devicePage"},
        {name:'厂商概况',icon:'fa fa-handshake-o',keyid:"11043",menu_type:_.find(MenuKind,m=>m.id==7),blnShow:1,status:'{status:"completed"}',type:"firmPage"},
        {name:'区域管理',icon:'fa fa-eercast',keyid:"11044",menu_type:_.find(MenuKind,m=>m.id==7),blnShow:1,status:'{status:"completed"}',type:"areaPage"},
        {name:'App管理',icon:'fa fa-mobile',keyid:"11045",menu_type:_.find(MenuKind,m=>m.id==7),blnShow:1,status:'{status:"completed"}',type:"mobileAppPage"},
        {name:'网站备案',icon:'fa fa-ravelry',keyid:"11046",menu_type:_.find(MenuKind,m=>m.id==7),blnShow:1,status:'{status:"completed"}',type:"WebSiteRecordPage"},
        {name:'数据质量',icon:'fa fa-dashboard',keyid:"11022",menu_type:_.find(MenuKind,m=>m.id==7),blnShow:1,status:'{status:"completed"}',type:"dataMassPage"},
        {name:'热点备案',icon:'fa fa-podcast',keyid:"11047",menu_type:_.find(MenuKind,m=>m.id==7),blnShow:1,status:'{status:"completed"}',type:"hotspotPage"},
        {name:'统计考核',icon:'fa fa-map',keyid:"11048",menu_type:_.find(MenuKind,m=>m.id==7),blnShow:1,status:'{status:"completed"}',type:"staticCheckPage"},   
        {name:'数据总览',icon:'fa fa-dashboard',id:'11015',keyid:"11015",menu_type:_.find(MenuKind,m=>m.id==7),blnShow:0,status:'{status:"completed"}',type:"BasePage"},
      ];

      app.menus=fixMenus;
      this.$store.commit(Add_System_Menus,fixMenus);

      subJect_mounted.next(this.$store.commit);

      //app.t.$store.commit(Add_History_Menu,app.menus[0]);//测试111111111111

      //跟新原数据源中的数据到设置数据中
      let menuFinish=new Rx.Subject();
      let sourceFinish=new Rx.Subject();
      let renew = menuFinish.combineLatest(sourceFinish,(menus,source)=>{return {menus:menus,source:source};});

      //获取菜单数据
      this.$store.dispatch(Get_Operate).then(res=>{
        //console.log(res);
        //res.biz_body=_.filter(res.biz_body,r=>r.condtionsObj);
        //console.log(tool.Clone(res.biz_body));
        this.$store.commit(Add_System_Menus,res.biz_body);
        //this.$store.commit(Add_System_Menus,[res.biz_body[6]]);
        menus_mounted.next(1);
        menuFinish.next(res.biz_body);
        if((','+permissions+',').indexOf(',*,')<0){
          _.each(this.menus,(menu)=>{
            menu.menus=_.filter(menu.menus,(item)=>{return (','+permissions+',').indexOf(','+item.keyid+',')>=0;})
          });
        }
        //this.menus[0].menus=res.data;
        //console.log(tool.Clone(this.menus));
      });

      //获取数据源
      this.$store.dispatch(Date_Source).then(data=>{
        let allTables=[];
        for(let key in data){
            data[key].icon=data[key].icon || 'fa fa-road';
            let tables=data[key].tables || [];
            for(let tableKey in tables){
                allTables.push(tables[tableKey]);
            }
        }

        this.$store.commit(SetSource,data);
        this.$store.commit(SET_ALL_TABLE_DATA,allTables);
        sourceFinish.next(data);
      });

      //监听菜单数据改变事件
      this.$store.commit(MenuChangeEven,(m)=>{
        let s=this;
        s.$store.commit(DelMenu,m.keyid);
        s.$store.commit(Add_System_Menus,m);
        // for(let i=0;i<s.menus.length;i++){
        //   let menus=s.menus[i].menus;
        //   let index=_.findIndex(menus,menu=>menu.keyid==m.keyid);
        //   if(index<0)continue;
        //   menus.splice(index,1,m);
        // }
        // console.log(m);
      });

      renew.subscribe(res=>{
        let source=_.chain(res.source).pluck('tables').reduce((pre,next)=>{return _.extend(pre,next);},{}).value();
        _.each(res.menus,m=>{
          let cfg=m.condtionsObj,queryFields=cfg.query_fields || [],orderFields=cfg.show_fields || [],queryItems=cfg.queryItems || [];

          //设置远程数据配置
          if(m.showDataConfig && source[m.showDataConfig.currSource.key]){
            cfg.isRemote=!!source[m.showDataConfig.currSource.key].isRemote;
            cfg.remoteInterface=source[m.showDataConfig.currSource.key].remoteInterface;
          }
        
          if(cfg.query_fields.length && cfg.query_fields[0] && cfg.query_fields[0].table && source[cfg.query_fields[0].table]){
            cfg.primaryKey= cfg.query_fields[0].table+'|'+source[cfg.query_fields[0].table].primeKey;
          }

          let tmpArr=queryFields.concat(orderFields);
          _.each(tmpArr,f=>{
            if(f.table && source[f.table] && source[f.table].fields[f.key]){
              let cloneD=tool.Clone(source[f.table].fields[f.key]);
              _.extend(cloneD,f);
              _.extend(f,cloneD);
            }
          });

          //跟新查询条件中与配置动态相关对象
          _.each(queryItems,q=>{
            if(q && q.filed.tableKey && source[q.filed.tableKey] && source[q.filed.tableKey].fields[q.filed.key]){
              let cloneD=tool.Clone(source[q.filed.tableKey].fields[q.filed.key]);
              q.referval=cloneD.referval;
              q.filed.mask=q.filed.mask==undefined?cloneD.mask:q.filed.mask;
              q.filed.remoteUrl=cloneD.remoteUrl;
              q.filed.remoteName=cloneD.remoteName;
              q.filed.remoteValue=cloneD.remoteValue;
            }

          });
        });
        
        menucombine.next(1);
      });

    });
  },
  methods:{
    menu_mouseenter(){
      this.blnShowMenu=true;
    },
    menu_mouseleave(){
      this.blnShowMenu=false;
    },
    blnShow(flag){
      this.blnShowMenu=flag;
    },
    test(){
       this.$store.commit(Add_History_Menu,{
          id:'placeMap',
          name:'场所地图',
          type:'placeMap',
          icon:'fa fa-cog fa-fw'
      });
    },
    placechange(val){
      console.log(val);
    },
    //版本号单击事件
    banbenClick(){
      window.open('static/helper/test.html');
    },
    //帮助单击事件
    helperClick(){
      window.open('static/helper/index.html');
    }

  }
}
</script>

<style lang="less">
@import "./css/variables.less";
#app {
  font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height:100%;
  background-color:@BgCol;
}
.Container{height:100%;}
.Header{height:@headerH;}
.Content{margin-left:0px;height:@contentH;position:relative;}
.Content .menu_c_container{position: absolute;width: 80px;height: 100%;top: 0px;right: -80px;z-index: 1000;.transLine(.3s);}
.Content .menu_c_container:hover,
.Content .menu_c_container.active{right:0px;}

.index_footer{background-color:@HeaderBgCol;height:@footerH;line-height: @footerH;color:#7a8ca5;font-size:12px;padding-left:10px;position:absolute;width:100%;z-index:10000;}
.index_footer .helperBtn{
  display: inline-block;
	outline: none;
	cursor: pointer;
	text-align: center;
	text-decoration: none;
	font: 14px/100% Arial, Helvetica, sans-serif;
	padding: .5em 1em;
	text-shadow: 0 1px 1px rgba(0,0,0,.3);
	-webkit-border-radius: .5em; 
	-moz-border-radius: .5em;
	border-radius: .5em;
	-webkit-box-shadow: 0 1px 2px rgba(0,0,0,.2);
	-moz-box-shadow: 0 1px 2px rgba(0,0,0,.2);
  box-shadow: inset 0px 0px 0px 1px rgba(35,39,44, 1), 0px 1px 3px #222222;
}
.index_footer .helperBtn:active{box-shadow: inset 0px 0px 0px 1px rgba(35,39,44, 1), 0px 1px 3px #555555;}
//加载中动画
.loading_pop{position:absolute;top:0px;left:0px;right:0px;bottom:0px;display:none;}
.loading_pop img{position:absolute;top:50%;margin-top:-24px;z-index:2000;}

//模板页面弹出详细页面Table样式
.HtmlTmp .el-table__header th,
.openTmp .el-table__header th{height:20px;font-size: 12px;text-align: center;}
.HtmlTmp .el-table__header tr,
.HtmlTmp .el-table__header tr .cell,
.openTmp .el-table__header tr{background-color:@btn_Bg_Col_hover_1;color:white;}

//分页控件样式 
.page_container{height:40px;width:100%;text-align:right;}
.page_container .el-pagination{margin-top:3px;margin-right:55px;}
// 分页上一页按钮/下一页按钮样式
.firstPage,
.prePage,
.nextPage{
    display: inline-block;
    border: 1px solid rgb(224, 230, 237);
    padding: 5px;
    font-size: 12px;
    border-radius: 5px;
    margin-right:10px;
    margin-top:5px;
    cursor:pointer;
}

//菜单排序标示菜单可被替换
.menuReplace{
  border: 1px dashed !important; 
  border-radius: 5px !important;
  z-index:10 !important;
}

//列表显示样式
@header_H:40px;
@gainCol:#019cdc;
@collectCol:#85c226;
@resultCol:#f8c301;
 .table_header{height:@header_H;display:table;width:100%;border:none;}
 .table_row_conatiner{}
 .table_body .row .column,
 .table_header .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;.border('bottom');}
 .table_body .row,
 .table_header .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;.border('bottom');}
 .table_header .column .sort_item .triangle-up:hover{border-bottom-color:@Font_Hover_Col;cursor:pointer;}
 .table_header .column .sort_item .triangle-down:hover{border-top-color:@Font_Hover_Col;cursor:pointer;}
 .table_header .column .sort_item .triangle-up.active{border-bottom-color:@Font_Hover_Col;}
 .table_header .column .sort_item .triangle-down.active{border-top-color:@Font_Hover_Col;}

.table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";.border('bottom');}
.table_conatienr{width:100%;display:table;width:100%;border:none;}
.table_conatienr .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}

.triangle-up {
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid black;
}

.triangle-down {
width: 0;
height: 0;
border-left: 5px solid transparent;
border-right: 5px solid transparent;
border-top: 5px solid black;
}

.el-checkbox__label{font-size:12px !important;font-weight:normal !important;}

.divEllipsis{
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: block;
}
.layui-layer-title{background-color:@Font_Hover_Col !important;color:white !important;}
</style>
