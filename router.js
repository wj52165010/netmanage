// 路由
import Vue from 'vue'

Vue.component('mainPage',(resolve)=>{require(['./pages/main'], resolve)});
Vue.component('dataSourcePage',(resolve)=>{require(['./pages/dataSource'], resolve)});
Vue.component('showDataPage',(resolve)=>{require(['./pages/showData'], resolve)});
Vue.component('conditionPage',(resolve)=>{require(['./pages/condition'], resolve)});
Vue.component('handlePage',(resolve)=>{require(['./pages/handle'], resolve)});
Vue.component('tmpSettingPage',(resolve)=>{require(['./pages/tmpSetting'], resolve)});
Vue.component('htmlTmpPage',(resolve)=>{require(['./pages/htmlTmp'], resolve)});
Vue.component('MapDotPage',(resolve)=>{require(['./components/MapDot'], resolve)});
Vue.component('LocalDatasourcePage',(resolve)=>{require(['./pages/localDatasource'], resolve)});
Vue.component('permisPage',(resolve)=>{require(['./pages/permis'],resolve)});
Vue.component('UserManagePage',(resolve)=>{require(['./pages/UserManage'],resolve)});
Vue.component('RelationPage',(resolve)=>{require(['./pages/relation'],resolve)});
Vue.component('AnalysisPage',(resolve)=>{require(['./pages/analysis'],resolve)});
Vue.component('BasePage',(resolve)=>{require(['./pages/base'],resolve)});
Vue.component('AnalysisDetailPage',(resolve=>{require(['./pages/analysis_detail'],resolve)})); //同步分析详细页面
Vue.component('CrashAnalyPage',(resolve=>{require(['./components/crash_analy'],resolve)}));
Vue.component('BehaviorPage',(resolve=>{require(['./components/BehaviorPage'],resolve)}));//行为分析详细页面

Vue.component('CollisionPage',(resolve=>{require(['./components/collision'],resolve)}));//碰撞关系图
Vue.component('CrashDetailPage',(resolve=>{require(['./components/crash_detail'],resolve)}));//碰撞分析详细页面

Vue.component('CaseManagePage',(resolve=>{require(['./modules/case/caseManage'],resolve)}));// 案件管理页面
Vue.component('CCICPage',(resolve=>{require(['./pages/ccic'],resolve)}));//CCIC页面
Vue.component('HighRiskPage',(resolve=>{require(['./pages/highRiskNew'],resolve)}));//新高危库页面
Vue.component('OperLogPage',(resolve=>{require(['./pages/logManage'],resolve)}));//操作日志页面

Vue.component('fieldListComp',(resolve)=>{require(['./components/FieldList'], resolve)});
Vue.component('sourceListComp',(resolve)=>{require(['./components/SourceList'], resolve)});
Vue.component('sortableComp',(resolve)=>{require(['./components/Sortable'], resolve)});

Vue.component('settingPage',(resolve)=>{require(['./pages/setting'], resolve)});
Vue.component('templatePage',(resolve)=>{require(['./pages/template'], resolve)});
Vue.component('deployCtrlPage',(resolve)=>{require(['./pages/deployContrl'], resolve)});
Vue.component('highriskPage',(resolve)=>{require(['./pages/high_risk'],resolve)});
Vue.component('dataMassPage',(resolve)=>{require(['./pages/dataMass'],resolve)}); //数据质量
Vue.component('remoteInterfacePage',(resolve)=>{require(['./pages/remoteInterface'],resolve)});//远程数据接口

Vue.component('ksearchIndex',(resolve)=>{require(['./modules/kuaisou/index'],resolve)});//快搜配置页面起始页
Vue.component('ksearchSource',(resolve)=>{require(['./modules/kuaisou/source'],resolve)});//快搜配置页面数据源页
Vue.component('ksearchField',(resolve)=>{require(['./modules/kuaisou/field'],resolve)});//快搜配置页面字段展示页
Vue.component('ksearchSort',(resolve)=>{require(['./modules/kuaisou/sort'],resolve)});//快搜配置页面字段排序页


Vue.component('TableDrag',(resolve)=>{require(['./components/tableDrag'],resolve)});
//测试场所地图插件
Vue.component('placeMap',(resolve)=>{require(['./components/PlaceMap'],resolve)});

//菜单配置

Vue.component('Setting',(resolve)=>{require(['./modules/menu/setting'],resolve)});


Vue.component('mapSite',(resolve)=>{require(['./components/mapSite'],resolve)});//场所管理定制版的地图描点组件
Vue.component('sitePage',(resolve)=>{require(['./pages/sitePage'],resolve)});//场所管理定制版页面
Vue.component('devicePage',(resolve)=>{require(['./pages/devicePage'],resolve)});//设备管理定制版页面
Vue.component('firmPage',(resolve)=>{require(['./pages/firmPage'],resolve)});//厂商管理定制版页面
Vue.component('areaPage',(resolve)=>{require(['./pages/areaPage'],resolve)});//区域管理定制版页面
Vue.component('mobileAppPage',(resolve)=>{require(['./pages/mobileAppPage'],resolve)});//手机App管控定制版页面
Vue.component('WebSiteRecordPage',(resolve)=>{require(['./pages/WebSiteRecordPage'],resolve)});//网站备案定制版页面 
Vue.component('hotspotPage',(resolve)=>{require(['./pages/hotspotPage'],resolve)});//热点备案定制版页面 
Vue.component('staticCheckPage',(resolve)=>{require(['./pages/staticCheckPage'],resolve)});//统计考核页面


/***********************************************案例页面********************************************/
Vue.component('PeerTrack',(resolve)=>{require(['./examples/PeerTrack.example'],resolve)});
Vue.component('Home',(resolve)=>{require(['./examples/Home.example'],resolve)});
Vue.component('Relation',(resolve)=>{require(['./examples/Relation.example'],resolve)});
Vue.component('Relation2',(resolve)=>{require(['./examples/Relation2.example'],resolve)});
Vue.component('TestRelation',(resolve)=>{require(['./examples/TestRelation'],resolve)});
Vue.component('Track',(resolve)=>{require(['./examples/Track.example'],resolve)});
Vue.component('Track2',(resolve)=>{require(['./examples/Track2.example'],resolve)});
Vue.component('AttenPerson',(resolve)=>{require(['./examples/AttentPerson.example'],resolve)});
Vue.component('ShortPath',(resolve)=>{require(['./examples/ShortPath.example'],resolve)});
Vue.component('CrashSecondDetail',(resolve)=>{require(['./components/crash_second_detail'],resolve)});
Vue.component('NetAboutCar',(resolve)=>{require(['./examples/NetAboutCar.example'],resolve)});
Vue.component('ShipCar',(resolve)=>{require(['./examples/ShipCar.example'],resolve)});
Vue.component('Expressage',(resolve)=>{require(['./examples/Expressage.example'],resolve)});
Vue.component('PublicOpinion',(resolve)=>{require(['./examples/PublicOpinion.example'],resolve)});
Vue.component('Patrol',(resolve)=>{require(['./examples/Patrol.example'],resolve)});
Vue.component('StatePerception',(resolve)=>{require(['./examples/StatePerception/index'],resolve)});
Vue.component('SiteRecords',(resolve)=>{require(['./examples/SiteRecords/index'],resolve)});

/***********************************************网吧管理页面********************************************/
Vue.component('InterBarManage',(resolve)=>{require(['./examples/InterBarManage/index'],resolve)});

/***********************************************WIFI管理页面********************************************/
Vue.component('WIFIMangae',(resolve)=>{require(['./examples/WifiManage/index'],resolve)});

/***********************************************特征管理页面********************************************/
Vue.component('FeatureManage',(resolve)=>{require(['./examples/FeatureManage/index'],resolve)});

/***********************************************非经管理页面********************************************/
Vue.component('NonClassicMangae',(resolve)=>{require(['./examples/NonClassicMangae/index'],resolve)});


//测试页面
Vue.component('TestPage',(resolve)=>{require(['./pages/Test'],resolve)});

export default[
  { path: '/', component: (resolve)=>{require(['./pages/index'], resolve)} },
  { path: '/setting', component:(resolve)=>{require(['./pages/setting'],resolve)} },
  { name:'template',path: '/:id', component:(resolve)=>{require(['./pages/template'],resolve)} }
]