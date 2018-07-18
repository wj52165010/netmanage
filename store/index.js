window['Promise']=window['Promise'] || 1;
import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'
import main from './modules/main'
import setting from './modules/setting'
import condition from './modules/condition'
import handle from './modules/handle'
import kuaisou from './modules/kuaisou'
import addSource from './modules/addSource'
import uploadSource from './modules/uploadSource'
import specialSource from './modules/specialSource'
import menuManage from './modules/menu'
// import {tool}  from '../js/tool.js'
let Rx = require('rxjs/Rx');

//获取伪造数据
import {site_data,place_data} from '../js/mock.js'

Vue.use(Vuex);
export default new Vuex.Store({
    state:{
        title:'网络',
        titleExtra:'管理系统',
        bodyObser:null,//页面大小改变监听对象
        mousemoveObser:null,//页面鼠标移动事件对象
        mousermoveSub:null,//页面鼠标移动订阅对象
        menuUpdateSub:new Rx.Subject(),//菜单改变后观察对象
        resizeOber:null, //页面大小观察对象
        pageSwitch:null, //页面切换监听对象
        navPageFunc:null,//跳转页面方法
        navPageRefresh:null,//页面刷新方法
        delNavPageFunc:null,//删除导航方法
        addHistoryMenuFunc:null,//添加历史菜单方法
        oriSource:{},//原生数据源对象(从服务器中取来得数据未经处理)
        menus:[],//当前系统中所注册所有菜单集合
        Rx:'',//全局Rx对象
        VirType:{},//全局虚拟身份对象
        MenuKind:[],//菜单类型
        fieldKinds:[],//字段类型
        formatData:[],//后端格式化选项数据
        formatSearch:[],//查询格式化选项数据
        backtrackOber:new Rx.Subject(),//回溯状态改变监听事件
        backtrackListens:{},//回溯状态改变监听事件对象
    },
    getters:{
        Menus:state=>{return state.menus;},
        MenuKind:state=>{return state.MenuKind},
        fieldKinds:state=>{return state.fieldKinds},
        Rx:state=>{return state.Rx;}
    },
    mutations:{
        [types.Reg_Rx](state,rx){
            state.Rx=rx;
        },
        [types.SetSource](state,source){
            state.oriSource=source;
        },
        [types.RegVirType](state,types){
            state.VirType=types;
        },
        [types.UPDATE_TO_TITLE](state,title){
            state.title=title;
        },
        //注册菜单回溯状态改变事件
        [types.MenuBacktrackChange](state,data){
            let sub=state.backtrackOber.subscribe(data.callback);
            state.backtrackListens[data.id]=sub;
        },
        //广播菜单回溯状态事件
        [types.broastBacktrack](state,d){
            state.backtrackOber.next(d);
        },
        //注销菜单会所状态改变事件
        [types.MenuBacktrackCancel](state,id){
            if(!state.backtrackListens[id]) return;
            state.backtrackListens[id].unsubscribe();
            delete state.backtrackListens[id];
        },
        [types.BODY_RESIZE_REG](state,obj){
            state.bodyObser=obj.event;
            state.resizeOber=obj.sub;
            state.bodyObser.subscribe(()=>{
                state.resizeOber.next(' ');
            });
        },
        [types.BODY_MOUSEMOVE_REG](state,obj){
            state.mousemoveObser=obj.event;
            state.mousermoveSub=obj.sub;
            state.mousemoveObser.subscribe((e)=>{
                state.mousermoveSub.next(e);
            });
        },
        [types.BODY_MOUSEMOVE](state,subscribe){
            state.mousermoveSub.subscribe(subscribe);
        },
        //注册页面切换
        [types.Reg_Page_Switch](state,subject){
            state.pageSwitch=subject;
        },
        //触发页面切换事件
        [types.Trigger_Page_Switch](state,menu){
            state.pageSwitch.next(menu);
        },
        //订阅页面切换事件
        [types.Nav_Page_Switch](state,subscribe){
            state.pageSwitch.subscribe(subscribe);
        },
        //订阅页面大小改变事件
        [types.BODY_RESIZE](state,subscribe){
           if(typeof subscribe === 'function'){
            state.resizeOber.subscribe(subscribe);    
           }else{
            subscribe.cb(state.resizeOber.subscribe(subscribe.sub));    
           }
           
        },
        //触发页面大小改变事件
        [types.Trigger_RESIZE](state){
            state.resizeOber.next(' ');
        },
        //注册导航方法
        [types.Reg_Navigation_Func](state,func){
            state.navPageFunc=func;
        },
        //导航页面
        [types.Nav_Page](state,page){
            state.navPageFunc(page);
        },
        //注册页面刷新方法
        [types.Reg_Navigation_Refresh](state,func){
            state.navPageRefresh=func;
        },
        //页面刷新
        [types.PageRefresh](state,index){
            state.navPageRefresh(index);
        },
        //注册删除导航方法
        [types.Reg_Del_Nav_Func](state,func){
            state.delNavPageFunc=func;
        },
        //删除导航页面
        [types.Del_Nav_Page](state,page){
            state.delNavPageFunc(page);
        },
        //注册添加历史菜单方法
        [types.Reg_Add_History_Menu_Func](state,func){
            state.addHistoryMenuFunc=func;
        },
        //添加历史菜单
        [types.Add_History_Menu](state,menu){
            state.addHistoryMenuFunc(menu);
        },
        //设置系统菜单集合
        [types.Set_System_Menus](state,menus){
            state.menus=menus;
        },
        //重置菜单状态
        [types.RSet_System_Menus](state,menus){
             for(let menu of menus || []){
                _.each(state.menus,item=>{
                    let tempMenus=item.menus || [];
                    for(let tempMenu of tempMenus){
                        if(menu.keyid==tempMenu.keyid){
                            tempMenu.status=menu.status;
                        }
                    }
                });
             }
             //state.menus[0].menus=menus;
        },
        //添加系统菜单集合
        [types.Add_System_Menus](state,menu){
            if(menu instanceof Array){
                _.each(menu,itemMenu=>{
                    let pMenu=(_.find(state.menus,item=>{return item.id==(itemMenu.menu_type || {id:''}).id;}) ||  _.find(state.menus,m=>m.isDefault));
                    pMenu.menus=pMenu.menus || [];
                    let menus = pMenu.menus;
                    menus.push(itemMenu);
                    pMenu.menus=_.sortBy(pMenu.menus,'orderby');
        
                });
                //state.menus[0].menus =state.menus[0].menus.concat(menu);

            }else{
                let pMenu=(_.find(state.menus,item=>{return item.id==(menu.menu_type || {id:''}).id;}) ||  _.find(state.menus,m=>m.isDefault));
                pMenu.menus=pMenu.menus || [];
                let menus = pMenu.menus;
                menus.push(menu);
                pMenu.menus=_.sortBy(pMenu.menus,'orderby');
            }
        },
        //根据指定菜单keyid删除菜单集合中的菜单数据
        [types.DelMenu](state,keyid){
            for(let i=0;i<state.menus.length;i++){
                let blnFind=false;
                state.menus[i].menus=_.filter(state.menus[i].menus,(menu)=>{blnFind=menu.keyid==keyid; return menu.keyid!=keyid;});
                if(blnFind)break;
            }
        },
        //设置菜单类型
        [types.SetMenuKind](state,menukind){
            state.MenuKind=menukind;
        },
        //设置字段类型
        [types.SetFieldKind](state,fieldkind){
            state.fieldKinds=fieldkind;
        },
        //设置格式选项数据
        [types.SetFormatData](state,formatData){
            state.formatData=formatData;
        },
        //设置查询格式化选项数据
        [types.SetFormatSearch](state,formatSearch){
            state.formatSearch=formatSearch;
        },
        //订阅菜单数据改变事件
        [types.MenuChangeEven](state,subscribe){
            state.menuUpdateSub.subscribe(subscribe)
        },
        [types.TriggerMenuChange](state,menu){
            state.menuUpdateSub.next(menu)
        },
    },
    actions:{
        //根据配置ID获取配置对象
        [types.GET_CONFIG]({dispatch},id){
            return dispatch(types.Get_Operate,id).then(res=>{
                return res.biz_body[0];
            });
            // return  new Promise((resolve, reject) => {
            //     resolve({
            //         id:'123',                                                                    //配置ID
            //         queryCondition:[{name:'姓名',type:1,value:'',defVal:'123',blnRequried:false,field:'name',table:'table'},
            //                         {name:'交货日期',type:2,value:'',defVal:'',blnRequried:false,field:'name',table:'table'},
            //                         {name:'日期',type:3,value:'',defVal:'',blnRequried:false,field:'name',table:'table'}],                                                      //查询条件
            //         orderFields:[{name:'测试',key:'name'},{name:'营地',key:'depart'},{name:'fsaf',key:'depart1'}],            //排序字段
            //         relateMenus:[1],
            //         limit:10,//每页显示数量
            //         data:[{name:'小王',depart:'测试部',depart1:'测试部'},{name:'小明',depart:'开发部',depart1:'测试部'},{name:'小明',depart:'开发部',depart1:'测试部'},{name:'小明',depart:'开发部',depart1:'测试部'}],
            //         options:[],
            //         field_options:[]
            //     });
            // })
        },
        //删除场所菜单
        [types.Del_PlaceMenu]({dispatch},data){
            return new Promise((resolve,reject)=>{
                ser.delPlace(data.keyid).then(res=>{
                    resolve(res);
                });
            });
        },
        //根据模块ID获取模块对应数据
        [types.Get_OPerate_Data]({dispatch},data){
             return dispatch(types.get_OPerate_Data,data).then(res=>{
                return res;
            });
        },
        //获取动态数据
        [types.DynamicData]({commit},{url}){
            return new Promise((resolve,reject)=>{
                ser.dynamicData(url).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取场所信息
        [types.GET_PLACE]({commit},data){
            return new Promise((resolve,reject)=>{
                //resolve(place_data);
                ser.placeByArea(data.code || '',data.type || '',data.defaultVal || {}).then(res=>{
                    let data= res.biz_body?res.biz_body.data:[];
                    resolve(data);
                });
            });
        },
        //根据经纬度获取场所信息
        [types.SearchRangeSites]({commit},data){
            return new Promise((resolve,reject)=>{
                data.rt={lng:200,lat:200};
                ser.SearchRangeSites(data.lb || '',data.rt || '').then(res=>{
                    resolve(res.biz_body.data);
                });
            });
        },
        //根据编码/中文/拼音/字母获取场所信息
        [types.GetSitesInfoByInfo]({commit},data){
            
            return new Promise((resolve,reject)=>{
                //resolve(site_data);
                ser.GetSitesInfoByInfo(data.condition || '',data.types || '').then(res=>{
                    resolve(res.biz_body);
                });
            });
        },
        // 场所选择控件-精确查询(SearchExact)
        [types.SearchExact]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.SearchExact({search:data}).then(res=>{
                    resolve(res.biz_body);
                });
            });
        },
        //添加数据
        [types.AddData]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.addData(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //修改数据
        [types.UpdateData]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.updateData(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //删除数据
        [types.DelData]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.delData(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //导出数据
        [types.ExportData]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.exportData(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取用户组信息
        [types.GetGroup]({commit}){
            return new Promise((resolve,reject)=>{
                ser.getGroup().then(res=>{
                    resolve(res);
                });
            });
        },
        //添加用户组信息
        [types.AddGroup]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.addGroup(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //修改用户组信息
        [types.UpdateGroup]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.updateGroup(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //删除用户组信息
        [types.DelGroup]({commit},id){
            return new Promise((resolve,reject)=>{
                ser.delGroup(id).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取用户信息
        [types.GetUser]({commit},id){
            return new Promise((resolve,reject)=>{
                ser.getUser(id).then(res=>{
                    resolve(res);
                });
            });
        },
        //新增用户信息
        [types.AddUser]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.addUser(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //修改用户信息
        [types.UpdateUser]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.updateUser(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //删除用户信息
        [types.DelUser]({commit},id){
            return new Promise((resolve,reject)=>{
                ser.delUser(id).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取用户部门信息
        [types.GetDepartments]({commit}){
            return new Promise((resolve,reject)=>{
                ser.getDepartments().then(res=>{
                    resolve(res);
                });
            });
        },
        //创建审计策略
        [types.AddPolicy]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.addPolicy(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取审计策略
        [types.GetPolicy]({commit},{policy_id,policy_title,law_case,user_id,blnCase,limit,skip}){
            return new Promise((resolve,reject)=>{
                ser.getPolicy({policy_id,policy_title,law_case,user_id,blnCase,limit,skip}).then(res=>{
                    resolve(res);
                });
            });
        },
        //删除审计策略
        [types.DelPolicy]({commit},id){
            return new Promise((resolve,reject)=>{
                ser.delPolicy(id).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取策略详细数据
        [types.GetPolicyDetail]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.getPolicyDetail(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //添加案件
        [types.AddCase]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.addCase(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //案件修改
        [types.UpdateCase]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.updateCase(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //案件删除
        [types.DelCase]({commit},id){
            return new Promise((resolve,reject)=>{
                ser.delCase(id).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取案件
        [types.GetCase]({commit},{law_case_id,law_case_title,law_case_time,law_case_status,limit,skip}){
            return new Promise((resolve,reject)=>{
                ser.getCase({law_case_id,law_case_title,law_case_time,law_case_status,limit,skip}).then(res=>{
                    resolve(res);
                });
            });
        },
        //添加重点人员类型
        [types.AddIdentity]({commit},{key_identity_type_title,key_identity_type_note}){
            return new Promise((resolve,reject)=>{
                ser.addIdentity({key_identity_type_title,key_identity_type_note}).then(res=>{
                    resolve(res);
                });
            });
        },
        //修改重点人员类型
        [types.UpdateIdentity]({commit},{key_identity_type_id,key_identity_type_title,key_identity_type_note}){
            return new Promise((resolve,reject)=>{
                ser.updateIdentity({key_identity_type_id,key_identity_type_title,key_identity_type_note}).then(res=>{
                    resolve(res);
                });
            });
        },
        //删除重点人员类型
        [types.DelIndentity]({commit},id){
            return new Promise((resolve,reject)=>{
                ser.delIdentity(id).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取重点人员类型
        [types.GetIndentity]({commit},{}){
            return new Promise((resolve,reject)=>{
                ser.getIndentity({}).then(res=>{
                    resolve(res);
                });
            });
        },
        //添加重点人员
        [types.AddIdenPerson]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.addIdenPerson(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //修改重点人员
        [types.UpdateIdenPerson]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.updateIndenPerson(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //删除重点人员
        [types.DelIdenPerson]({commit},{id:id}){
            return new Promise((resolve,reject)=>{
                ser.delIdenPerson(id).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取重点人员
        [types.GetIdenPerson]({commit},{limit,skip,key_identity_name,key_identity_cert,key_identity_mobile,key_identity_mac,key_identity_type}){
            return new Promise((resolve,reject)=>{
                ser.getIdenPerson({limit,skip,key_identity_name,key_identity_cert,key_identity_mobile,key_identity_mac,key_identity_type}).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取重点人员详细
        [types.GetIdenPersonDetail]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.getIdenPersonDetail(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取分析任务
        [types.GetAnalyTask]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.getAnalyTask(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取分析任务分析信息
        [types.GetAnalyTaskData]({commit},{id,limit,skip,conds}){
            return new Promise((resolve,reject)=>{
                ser.getAnalyTaskData(id,limit,skip,conds).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取分析任务分析信息详细更多
        [types.GetAnalyTaskMore]({commit},{id,mid}){
            return new Promise((resolve,reject)=>{
                ser.getAnalyTaskMore(id,mid).then(res=>{
                    resolve(res);
                });
            });
        },
        //添加二次碰撞任务信息
        [types.SecondCrashTask]({commit},{id,cond}){
            return new Promise((resolve,reject)=>{
                ser.secondCrashTask(id,cond).then(res=>{
                    resolve(res);
                });
            });
        },
        //删除二次碰撞任务信息
        [types.delSecondCrash]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.delSecondCrash(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取关联分析二次查询信息
        [types.RelationSecond]({commit},{task_target_type,account_type,keyword}){
            return new Promise((resolve,reject)=>{
                ser.getRelationSecond(task_target_type,account_type,keyword).then(res=>{
                    resolve(res);
                });
            });
        },
        //新增分析任务
        [types.AddAnalyTask]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.addAnalyTask(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //删除分析任务
        [types.DelAnalyTask]({commit},id){
            return new Promise((resolve,reject)=>{
                ser.delAnalyTask(id).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取虚拟身份类型
        [types.VirType]({commit}){
            return new Promise((resolve,reject)=>{
                ser.getVidType().then(res=>{
                    resolve(res);
                });
            });
        },
        //菜单排序批量修改
        [types.Menu_Sort]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.menuSort(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取快搜结果
        [types.Search]({commit},{str,skip,limit}){
            return new Promise((resolve,reject)=>{
                ser.search(str,skip,limit).then(res=>{
                    resolve(res);
                });
            });
        },
        //添加报警手机
        [types.AddAlarmMobile]({commit},{name,mobile}){
            return new Promise((resolve,reject)=>{
                ser.addAlarmMobile(name,mobile).then(res=>{
                    resolve(res);
                });
            });
        },
        //删除报警手机
        [types.DelAlarmMobile]({commit},id){
            return new Promise((resolve,reject)=>{
                ser.delAlarmMobile(id).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取报警手机
        [types.GetAlarmMobile]({commit}){
            return new Promise((resolve,reject)=>{
                ser.getAlarmMobile().then(res=>{
                    resolve(res);
                });
            });
        },
        //获取场所在离线统计数据
        [types.SiteCount]({commit}){
            return new Promise((resolve,reject)=>{
                ser.siteCount().then(res=>{
                    resolve(res);
                });
            });
        },
        //获取设备在离线统计数据
        [types.EquipmentCount]({commit}){
            return new Promise((resolve,reject)=>{
                ser.equipmentCount().then(res=>{
                    resolve(res);
                });
            });
        },
        //获取厂商在离线统计数据
        [types.FirmCount]({commit}){
            return new Promise((resolve,reject)=>{
                ser.firmCount().then(res=>{
                    resolve(res);
                });
            });
        },
        //获取实名在离线统计数据
        [types.Customer]({commit}){
            return new Promise((resolve,reject)=>{
                ser.customer().then(res=>{
                    resolve(res);
                });
            });
        },
        //获取虚拟网吧/非经营统计数据
        [types.VidCounter]({commit}){
            return new Promise((resolve,reject)=>{
                ser.vidcounter().then(res=>{
                    resolve(res);
                });
            });
        },
        //获取虚拟MAC统计数据
        [types.VidMac]({commit}){
            return new Promise((resolve,reject)=>{
                ser.vidMac().then(res=>{
                    resolve(res);
                });
            });
        },
        //获取数据总量统计数据
        [types.DataTotal]({commit}){
            return new Promise((resolve,reject)=>{
                ser.dataTotal().then(res=>{
                    resolve(res);
                });
            });
        },
        //获取厂商场所在离线数据
        [types.FirmSiteCount]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.firmSiteCount(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取厂商设备在离线数据
        [types.FirmEquipmentCount]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.firmEquipmentCount(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //数据质量统计(数据质量组建使用)
        [types.DataMassCount]({commit},{startTime,endTime,firm_id}){
            return new Promise((resolve,reject)=>{
                ser.dataMassCount(startTime,endTime,firm_id).then(res=>{
                    resolve(res);
                });
            });
        },
        //数据质量统计(首页使用)
        [types.DataCount]({commit}){
            return new Promise((resolve,reject)=>{
                ser.dataCount().then(res=>{
                    resolve(res);
                });
            });
        },
        //数据质量有效率统计
        [types.DataRate]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.dataRate(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //日统计量
        [types.DayCount]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.dayCount(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取地区
        [types.GetRegion]({commit}){
            return new Promise((resolve,reject)=>{
                ser.GetRegion().then(res=>{
                    resolve(res);
                });
            });
        },
        //获取厂商
        [types.GetFirm]({commit}){
            return new Promise((resolve,reject)=>{
                ser.GetFirm().then(res=>{
                    resolve(res);
                });
            });
        },
        //获取数据来源
        [types.GetMicroprobe]({commit}){
            return new Promise((resolve,reject)=>{
                ser.GetMicroprobe().then(res=>{
                    resolve(res);
                });
            });
        },
        //手机号码采集统计
        [types.MobileCount]({commit}){
            return new Promise((resolve,reject)=>{
                ser.mobileCount().then(res=>{
                    resolve(res);
                });
            });
        },
        //特定人员统计
        [types.IdentityCount]({commit}){
            return new Promise((resolve,reject)=>{
                ser.identityCount().then(res=>{
                    resolve(res);
                });
            });
        },
        //接入厂商
        [types.InFirmCount]({commit}){
            return new Promise((resolve,reject)=>{
                ser.inFirmCount().then(res=>{
                    resolve(res);
                });
            });
        },
        //真实身份统计
        [types.CertificateCount]({commit}){
            return new Promise((resolve,reject)=>{
                ser.certificateCount().then(res=>{
                    resolve(res);
                });
            });
        },
        //虚拟身份统计
        [types.VirtualCount]({commit}){
            return new Promise((resolve,reject)=>{
                ser.virtualCount().then(res=>{
                    resolve(res);
                });
            });
        },
        //获取最新重点人员报警数据
        [types.GetLastData]({commit}){
            return new Promise((resolve,reject)=>{
                ser.getLastData().then(res=>{
                    resolve(res);
                });
            });
        },
        //获取远程数据接口
        [types.GetInterface]({commit}){
            return new Promise((resolve,reject)=>{
                ser.getInterface().then(res=>{
                    resolve(res);
                });
            });
        },
        //新增远程数据接口
        [types.AddInterface]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.addInterface(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //修改远程数据接口
        [types.UpdateInterface]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.updateInterface(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //删除远程数据接口
        [types.DelInterface]({commit},id){
            return new Promise((resolve,reject)=>{
                ser.delInterfase(id).then(res=>{
                    resolve(res);
                });
            });
        },
        //保存本地数据源表结构
        [types.SaveTableSchema]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.saveTableSchema(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取场所统计数据(描点插件使用)
        [types.Get_Place_Count]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetPlaceCount().then(res=>{
                    resolve(res);
                });
            });
        },
        //导出厂商在离线数据(首页)
        [types.ExportOnlineCount]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.ExportOnlineCount(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //导出详情统计数据(首页)
        [types.ExportDetailCount]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.ExportDetailCount(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //注销账户
        [types.LoginOut]({commit},account){
            return new Promise((resolve,reject)=>{
                ser.LoginOut(account).then(res=>{
                    resolve(res);
                });
            });
        },
        //用户强制登录
        [types.LoginForce]({commit},account){
            return new Promise((resolve,reject)=>{
                ser.LoginForce(account).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取同区域用户
        [types.GetRegionUsers]({commit}){
            return new Promise((resolve,reject)=>{
                ser.GetRegionUsers().then(res=>{
                    resolve(res);
                });
            });
        },
        //CCIC获取报警信息
        [types.CCICPoliceData]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.CCICPoliceData(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //CCIC添加人员信息
        [types.CCICAddPerson]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.CCICAddPerson(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //CCIC删除人员信息
        [types.CCICDelPerson]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.CCICDelPerson(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //CCIC获取人员信息
        [types.CCICGetPerson]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.CCICGetPerson(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取证件类型
        [types.GetCertificateType]({commit}){
            return new Promise((resolve,reject)=>{
                ser.GetCertificateType().then(res=>{
                    resolve(res);
                });
            });
        },
        //获取匹配模式
        [types.GetMatchMode]({commit}){
            return new Promise((resolve,reject)=>{
                ser.GetMatchMode().then(res=>{
                    resolve(res);
                });
            });
        },
        //详情统计列表统计(首页)
        [types.DetailListCount]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.DetailListCount(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //详情统计列表统计导出(首页)
        [types.DetailListExport]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.DetailListExport(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //厂商在离线率统计
        [types.SiteOnlineRate]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.siteOnlineRate(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取新的Token信息
        [types.GetNewToken]({commit},token){
            return new Promise((resolve,reject)=>{
                ser.GetNewToken(token).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取虚拟身份类型
        [types.GetVirType]({commit},key){
            return new Promise((resolve,reject)=>{
                ser.GetVirType({key}).then(res=>{
                    resolve(res);
                });
            });
        },
        //同行频次统计
        [types.AnalyRateCount]({commit},id){
            return new Promise((resolve,reject)=>{
                ser.AnalyRateCount(id).then(res=>{
                    resolve(res);
                });
            });
        },
        //#region 上传数据源

        //判断数据源名称是否存在
        [types.upload_dataSourceName_exist]({commit},name){
            return new Promise((resolve,reject)=>{
                ser.upload_dataSourceName_exist(name).then(res=>{
                    resolve(res);
                });
            });
        },
        //添加数据源配置对象
        [types.upload_add_dataSource]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.upload_add_dataSource(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取上传数据源配置对象
        [types.upload_get_dataSource]({commit},{key}){
            return new Promise((resolve,reject)=>{
                ser.upload_get_dataSource({key}).then(res=>{
                    resolve(res);
                });
            });
        },
        //添加文件解析规则
        [types.upload_add_fileparse]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.upload_add_fileparse(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //修改文件解析规则
        [types.upload_update_fileparse]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.upload_update_fileparse(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取文件解析规则
        [types.upload_get_fileparse]({commit},{dataSource,type}){
            return new Promise((resolve,reject)=>{
                ser.upload_get_fileparse({dataSource,type}).then(res=>{
                    resolve(res);
                });
            });
        },
        //删除文件解析规则
        [types.upload_del_fileparse]({commit},code){
            return new Promise((resolve,reject)=>{
                ser.upload_del_fileparse(code).then(res=>{
                    resolve(res);
                });
            });
        },
        //上传数据源文件
        [types.upload_dataSource_file]({commit},code){
            return new Promise((resolve,reject)=>{
                ser.upload_dataSource_file(code).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取文件分隔符
        [types.File_Seperator]({commit}){
            return new Promise((resolve,reject)=>{
                ser.file_seperator().then(res=>{
                    resolve(res);
                });
            });
        },
        //获取操作日志
        [types.oper_log]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.oper_log(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //#endregion

        //删除上传数据源
        [types.delSource]({commit},sourceId){
            return new Promise((resolve,reject)=>{
                ser.delSource(sourceId).then(res=>{
                    resolve(res);
                });
            });
        },

        //获取字段类型
        [types.FieldType]({commit}){
            return new Promise((resolve,reject)=>{
                ser.fieldType().then(res=>{
                    resolve(res);
                });
            });
        },

        //新增快搜
        [types.AddSearch]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.addQuickSearch(data).then(res=>{
                    resolve(res);
                });
            }); 
        },

        //获取快搜配置集合
        [types.GetSearch]({commit},keyid){
            return new Promise((resolve,reject)=>{
                ser.getQuickSearch(keyid).then(res=>{
                    resolve(res);
                });
            }); 
        },

        //删除快搜配置
        [types.DelSearch]({commit},keyid){
            return new Promise((resolve,reject)=>{
                ser.delQuickSearch(keyid).then(res=>{
                    resolve(res);
                });
            });
        },

        //修改快搜
        [types.UpdateSearch]({commit},config){
            return new Promise((resolve,reject)=>{
                ser.updateQuickSearch(config).then(res=>{
                    resolve(res);
                });
            });
        },

        //设置默认使用快搜
        [types.UseSearch]({commit},keyid){
            return new Promise((resolve,reject)=>{
                ser.useQuickSearch(keyid).then(res=>{
                    resolve(res);
                });
            });
        },

        //快搜预览数据
        [types.PreviewSearch]({commit},{dbkey,format_fields,limit}){
            return new Promise((resolve,reject)=>{
                ser.previewQucikSearch({dbkey,format_fields,limit}).then(res=>{
                    resolve(res);
                });
            });
        },

        //快搜数据
        [types.DataSearch]({commit},{keyword,pageIndex}){
            return new Promise((resolve,reject)=>{
                ser.getDataQuickSearch({keyword,pageIndex}).then(res=>{
                    resolve(res);
                });
            });
        },

        //获取菜单类型
        [types.GetMenuKind]({commit},data){
            return new Promise((resolve,reject)=>{
                // resolve({biz_body:
                //         [
                //             {
                //                 icon:"fa fa-navicon",
                //                 title:'案例',
                //                 orderby:10000,
                //                 id:100000,
                //             }
                //         ]
                //     }
                // );

                ser.GetMenuKind(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //添加菜单类型
        [types.AddMenuKind]({commit},{title,icon}){
            return new Promise((resolve,reject)=>{
                ser.AddMenuKind({title,icon}).then(res=>{
                    resolve(res);
                });
            });
        },
        //删除菜单类型
        [types.DelMenuKind]({commit},id){
            return new Promise((resolve,reject)=>{
                ser.DelMenuKind(id).then(res=>{
                    resolve(res);
                });
            });
        },
        //菜单类型排序
        [types.OrderMenuKind]({commit},ids){
            return new Promise((resolve,reject)=>{
                ser.OrderMenuKind(ids).then(res=>{
                    resolve(res);
                });
            });
        },
        //删除数据源
        [types.DelDataSource]({commit},code){
            return new Promise((resolve,reject)=>{
                ser.delDataSource(code).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取格式选项数据
        [types.FormatDatas]({commit}){
            return new Promise((resolve,reject)=>{
                ser.formatDatas().then(res=>{
                    resolve(res);
                });
            });
        },
        //获取查询格式化选项参数
        [types.FormatSearch]({commit}){
            return new Promise((resolve,reject)=>{
                ser.formatSearch().then(res=>{
                    resolve(res);
                });
            });
        },
        //判断数据源是否允许删除
        [types.IsDelSource]({commit},sourceId){
            return new Promise((resolve,reject)=>{
                ser.isDelSource(sourceId).then(res=>{
                    resolve(res);
                });
            });
        },
        //清空数据源数据
        [types.ClearDataSource]({commit},code){
            return new Promise((resolve,reject)=>{
                ser.clearDataSource(code).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取菜单回溯状态信息
        [types.MenuBacktrackInfo]({commit},keyid){
            return new Promise((resolve,reject)=>{
                ser.MenuBacktrackInfo(keyid).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取场所在线例子数据
        [types.SiteMapData]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.SiteMapData(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取设备在离线数据
        [types.EquipmentMapData]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.EquipmentMapData(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取MAC热力图数据
        [types.MacMapData]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.MacMapData(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //轨迹分析
        [types.AnalyTraceTask]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.AnalyTraceTask(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取历史轨迹任务信息
        [types.AnalyTraceHistory]({commit}){
            return new Promise((resolve,reject)=>{
                ser.AnalyTraceHistory().then(res=>{
                    resolve(res);
                });
            });
        },
        //删除历史轨迹任务
        [types.DelTraceHistory]({commit},id){
            return new Promise((resolve,reject)=>{
                ser.DelTraceHistory(id).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取轨迹分析任务结果
        [types.GetAnalyTraceTask]({commit},id){
            return new Promise((resolve,reject)=>{
                ser.GetAnalyTraceTask(id).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取范围热力图数据
        [types.MapDataRange]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.MapDataRange(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取关注人员
        [types.GetFocusPerson]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetFocusPerson(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //修改关注人员姓名
        [types.UpdateFocusPersonName]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.UpdateFocusPersonName(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //修改关注区域
        [types.UpdateFocusPersonRegion]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.UpdateFocusPersonRegion(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //添加关注特征
        [types.AddFocusPersonProperty]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.AddFocusPersonProperty(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //删除关注特征
        [types.DelFocusPersonProperty]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.DelFocusPersonProperty(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //添加关注标签
        [types.AddMoreFocusPersonProperty]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.AddMoreFocusPersonProperty(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //删除关注标签
        [types.DelMoreFocusPersonProperty]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.DelMoreFocusPersonProperty(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //关注人员添加标签
        [types.AddFocusPersonLabel]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.AddFocusPersonLabel(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //关注人员修改标签
        [types.UpdateFocusPersonLabel]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.UpdateFocusPersonLabel(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //关注人员删除标签
        [types.DelFocusPersonLabel]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.DelFocusPersonLabel(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //关注人员获取标签
        [types.GetFocusPersonLabel]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetFocusPersonLabel(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取标签统计数量
        [types.GetTagCount]({commit},{id,not_define}){
            return new Promise((resolve,reject)=>{
                ser.GetTagCount({id,not_define}).then(res=>{
                    resolve(res);
                });
            });
        },
        //删除关注人员
        [types.DelFocusPerson]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.DelFocusPerson(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //添加关注人员
        [types.AddFocusPerson]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.AddFocusPerson(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //修改关注人员
        [types.UpdateFocusPerson]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.UpdateFocusPerson(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //添加最短路径
        [types.AddShortPath]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.AddShortPath(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取最短路径
        [types.GetShortPath]({commit}){
            return new Promise((resolve,reject)=>{
                ser.GetShortPath().then(res=>{
                    resolve(res);
                });
            });
        },
        //删除最短路径
        [types.DelShortPath]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.DelShortPath(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取最短分析结果集
        [types.GetShortPathRes]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetShortPathRes(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //一键搜搜索
        [types.OneSearch]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.OneSearch(data).then(res=>{
                    resolve(res);
                });
            });
        },
        /******************* 例子接口 ****************/
        //#region 例子接口
        [types.TogetherTeam]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.TogetherTeam(data).then(res=>{
                    resolve(res);
                });
            });
        },

        [types.TogetherTeamTrack]({commit},{task_id,mac,indexArray}){
            return new Promise((resolve,reject)=>{
                ser.TogetherTeamTrack({task_id,mac,indexArray}).then(res=>{
                    resolve(res);
                });
            });
        },

        [types.TogetherTeamMainTrack]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.TogetherTeamMainTrack(data).then(res=>{
                    resolve(res);
                });
            });
        },

        [types.GetCarhailingChart]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetCarhailingChart(data).then(res=>{
                    resolve(res);
                });
            });
        },

        [types.GetCarhailingPersonList]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetCarhailingPersonList(data).then(res=>{
                    resolve(res);
                });
            });
        },

        [types.GetCarhailingToplaceList]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetCarhailingToplaceList(data).then(res=>{
                    resolve(res);
                });
            });
        },

        [types.GetVehicleChart]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetVehicleChart(data).then(res=>{
                    resolve(res);
                });
            });
        },

        [types.GetVehiclePersonList]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetVehiclePersonList(data).then(res=>{
                    resolve(res);
                });
            });
        },

        [types.GetVehicleTeam]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetVehicleTeam(data).then(res=>{
                    resolve(res);
                });
            });
        },

        [types.GetDangerExpress]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetDangerExpress(data).then(res=>{
                    resolve(res);
                });
            });
        },

        [types.GetDangerExpressList]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetDangerExpressList(data).then(res=>{
                    resolve(res);
                });
            });
        },

        [types.GetCarhailingFromplaceList]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetCarhailingFromplaceList(data).then(res=>{
                    resolve(res);
                });
            });
        },

        [types.GetDangerExpressListLoaction]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetDangerExpressListLoaction(data).then(res=>{
                    resolve(res);
                });
            });
        },

        [types.GetNation]({commit}){
            return new Promise((resolve,reject)=>{
                ser.GetNation().then(res=>{
                    resolve(res);
                });
            });
        },

        [types.GetPersonPhoto]({commit},cert){
            return new Promise((resolve,reject)=>{
                ser.GetPersonPhoto().then(res=>{
                    resolve(res);
                });
            });
        },
        //获取场所管理定制页面
        [types.GetSiteList]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetSiteList(data).then(res=>{
                    resolve(res);
                });
            });
        },
                //获取场所管理定制页面
        [types.GetSiteList]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetSiteList(data).then(res=>{
                    resolve(res);
                });
            });
        },       
        //获取场所下挂在设备详情
        [types.GetSiteDeviceList]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetSiteDeviceList(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取网吧场所下挂载终端列表
        [types.GetSiteTerminalList]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetSiteTerminalList(data).then(res=>{
                    resolve(res);
                });
            });
        },        
        //获取获取字典信息集合
        [types.getDictTables]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.getDictTables(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取数据采集趋势
        [types.SiteDetectColl]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.SiteDetectColl(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取场所昨日采集详情的柱状图
        [types.siteDetectYesterday]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.siteDetectYesterday(data).then(res=>{
                    resolve(res);
                });
            });
        },     
        //获取场所历史采集详情的折线图
        [types.siteDetectHistory]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.siteDetectHistory(data).then(res=>{
                    resolve(res);
                });
            });
        },            
        //获取场所详情
        [types.SiteDetail]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.SiteDetail(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取场所在离线数据
        [types.SiteHisPercentage]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.SiteHisPercentage(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取场所昨日在离线状况
        [types.LastPercentage]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.LastPercentage(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //导出统计场所状态率
        [types.HisPercentageExport]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.HisPercentageExport(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取可视范围内场所集合
        [types.GetSiteMap]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetSiteMap(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取按区域汇总场所集合
        [types.SiteMapRegion]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.SiteMapRegion(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取场所管理问题场所页面信息
        [types.siteScoreCollect]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.siteScoreCollect(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取场所管理待处理场所饼图数据
        [types.waitingHandleSite]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.waitingHandleSite(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取场所管理待处理场所列表数据
        [types.waitingHandleList]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.waitingHandleList(data).then(res=>{
                    resolve(res);
                });
            });
        },        

        //获取设备管理定制页面
        [types.GetDeviceList]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetDeviceList(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取设备采集趋势
        [types.DeviceDetectColl]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.DeviceDetectColl(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取设备昨日采集详情的柱状图
        [types.DeviceDetectYesterday]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.DeviceDetectYesterday(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取设备历史采集详情的折线图
        [types.DeviceDetectHistory]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.DeviceDetectHistory(data).then(res=>{
                    resolve(res);
                });
            });
        },        
        //获取设备昨日在离线状况
        [types.LastDevicePercentage]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.LastDevicePercentage(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取设备详情
        [types.DeviceDetail]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.DeviceDetail(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取设备在离线数据
        [types.DeviceHisPercentage]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.DeviceHisPercentage(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //导出统计设备状态率
        [types.DeviceHisPercentageExport]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.DeviceHisPercentageExport(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取设备管理异常设备列表信息
        [types.DeviceScoreCollect]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.DeviceScoreCollect(data).then(res=>{
                    resolve(res);
                });
            });
        },        
        //获取可视范围内场所集合
        [types.GetDeviceMap]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetDeviceMap(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取按区域汇总场所集合
        [types.DeviceMapRegion]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.DeviceMapRegion(data).then(res=>{
                    resolve(res);
                });
            });
        },


        //获取厂商管理定制页面
        [types.GetFirmList]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetFirmList(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //厂商状态数量统计[柱状图]
        [types.GetFirmCollColumn]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetFirmCollColumn(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //厂商状态数量统计[折线图]
        [types.GetFirmCollLine]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetFirmCollLine(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //厂商状态率按场所汇总导出
        [types.GetFirmSiteExport]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetFirmSiteExport(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //厂商状态率按设备汇总导出
        [types.GetFirmDeviceExport]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetFirmDeviceExport(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取厂商采集趋势
        [types.FirmDetectColl]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.FirmDetectColl(data).then(res=>{
                    resolve(res);
                });
            });
        },        
        //厂商采集统计（采集详情）
        [types.firmDetectRange]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.firmDetectRange(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取厂商昨日采集详情的柱状图
        [types.FirmDetectYesterday]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.FirmDetectYesterday(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //获取厂商历史采集详情的折线图
        [types.FirmDetectHistory]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.FirmDetectHistory(data).then(res=>{
                    resolve(res);
                });
            });
        },


        //获取区域管理定制页面
        [types.GetRegionList]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetRegionList(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //区域采集统计（采集详情）
        [types.RegionDetectRange]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.RegionDetectRange(data).then(res=>{
                    resolve(res);
                });
            });
        },
        //区域状态数量统计[柱状图]
        [types.regionCollColumn]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.regionCollColumn(data).then(res=>{
                    resolve(res);
                });
            });
        },         
        //区域状态数量统计[折线图]
        [types.RegionCollLine]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.RegionCollLine(data).then(res=>{
                    resolve(res);
                });
            });
        },        
        //区域状态率按场所汇总导出
        [types.RegionSiteExport]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.RegionSiteExport(data).then(res=>{
                    resolve(res);
                });
            });
        },  
        //区域状态率按设备汇总导出
        [types.RegionDeviceExport]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.RegionDeviceExport(data).then(res=>{
                    resolve(res);
                });
            });
        },  


        //获取app定制页面列表信息
        [types.GetAppList]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetAppList(data).then(res=>{
                    resolve(res);
                });
            });
        },   
        //获取app定制页面违规app列表
        [types.GetViolationsAppList]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetViolationsAppList(data).then(res=>{
                    resolve(res);
                });
            });
        },             
        //获取app定制页面详情
        [types.GetAppDetail]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetAppDetail(data).then(res=>{
                    resolve(res);
                });
            });
        },  
        //获取app定制页面概况统计（用于饼图和右侧柱状图）
        [types.GetAppViolations]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetAppViolations(data).then(res=>{
                    resolve(res);
                });
            });
        },  
        //app页面健康率统计
        [types.GetAppGreenPre]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetAppGreenPre(data).then(res=>{
                    resolve(res);
                });
            });
        }, 
        //app页面健康率导出
        [types.GetAppGreenPreExport]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetAppGreenPreExport(data).then(res=>{
                    resolve(res);
                });
            });
        }, 
        //获取网站备案定制页面列表信息
        [types.GetWebList]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetWebList(data).then(res=>{
                    resolve(res);  
                });
            });
        }, 
        //获取未备案网站详情
        [types.GetWebDetail]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetWebDetail(data).then(res=>{
                    resolve(res);  
                });
            });
        },         
        //获取网站备案定制页面备案变更列表
        [types.GetWebChangeList]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetWebChangeList(data).then(res=>{
                    resolve(res);  
                });
            });
        }, 
        //获取备案变更详情获取备案变更详情
        [types.GetWebChangeDetail]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetWebChangeDetail(data).then(res=>{
                    resolve(res);  
                });
            });
        }, 
        //获取热点列表定制页面信息
        [types.GetHotspotList]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetHotspotList(data).then(res=>{
                    resolve(res);  
                });
            });
        }, 
        //获取热点列表定制页面详情
        [types.GetHotspotDetail]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetHotspotDetail(data).then(res=>{
                    resolve(res);  
                });
            });
        }, 

        //考核任务列表
        [types.examineTaskList]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.examineTaskList(data).then(res=>{
                    resolve(res);  
                });
            });
        }, 
        //考核任务-考核结果列表
        [types.examineResultList]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.examineResultList(data).then(res=>{
                    resolve(res);  
                });
            });
        },         
        //考核任务-删除考核任务
        [types.examineDelTask]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.examineDelTask(data).then(res=>{
                    resolve(res);  
                });
            });
        }, 
        //考核任务-导出考核结果
        [types.examineExportTask]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.examineExportTask(data).then(res=>{
                    resolve(res);  
                });
            });
        }, 
        //考核任务-考核规则列表
        [types.examineRuleList]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.examineRuleList(data).then(res=>{
                    resolve(res);  
                });
            });
        }, 
        //考核任务-新增考核规则
        [types.examineRuleAdd]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.examineRuleAdd(data).then(res=>{
                    resolve(res);  
                });
            });
        }, 
        //考核任务-新增考核任务
        [types.examineAddTask]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.examineAddTask(data).then(res=>{
                    resolve(res);  
                });
            });
        },  
        //考核任务-获取定时考核设置
        [types.examineGetTimeSetting]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.examineGetTimeSetting(data).then(res=>{
                    resolve(res);  
                });
            });
        }, 
        //考核任务-修改定时考核设置
        [types.examineUpdTimeSetting]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.examineUpdTimeSetting(data).then(res=>{
                    resolve(res);  
                });
            });
        },   
        //考核任务-删除考核任务
        [types.examineDeleteTask]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.examineDeleteTask(data).then(res=>{
                    resolve(res);  
                });
            });
        }, 
        //考核任务-删除考核规则
        [types.examineDeleteRule]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.examineDeleteRule(data).then(res=>{
                    resolve(res);  
                });
            });
        },         
        //考核任务-获取厂商配置
        [types.examineOrgOptionList]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.examineOrgOptionList(data).then(res=>{
                    resolve(res);  
                });
            });
        },           
        //考核任务-保存厂商配置
        [types.examineSaveOrgOption]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.examineSaveOrgOption(data).then(res=>{
                    resolve(res);  
                });
            });
        },     



        //按厂商统计采集量
        [types.GetFirmCollFirm]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetFirmCollFirm(data).then(res=>{
                    resolve(res);  
                });
            });
        },    
         //按数据来源统计采集量
         [types.GetCollMicroprobe]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetCollMicroprobe(data).then(res=>{
                    resolve(res);  
                });
            });
        },        
        //获取报警数据
        [types.GetIdentData]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.GetIdentData(data).then(res=>{
                    resolve(res);  
                });
            });
        },
        //导出案件
        [types.ExportLawCase]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.ExportLawCase(data).then(res=>{
                    resolve(res);  
                });
            });
        },
        //导出综合分析任务
        [types.ExportAnalyTask]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.ExportAnalyTask(data).then(res=>{
                    resolve(res);  
                });
            });
        },
        //导出在逃人员
        [types.ExportCriminal]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.ExportCriminal(data).then(res=>{
                    resolve(res);  
                });
            });
        },
        //导出在逃人员报警
        [types.ExportCriminalLog]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.ExportCriminalLog(data).then(res=>{
                    resolve(res);  
                });
            });
        },
        //导出重点人员
        [types.ExportKeyIdentity]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.ExportKeyIdentity(data).then(res=>{
                    resolve(res);  
                });
            });
        },
        //导出重点人员报警
        [types.ExportKeyIdentityLog]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.ExportKeyIdentityLog(data).then(res=>{
                    resolve(res);  
                });
            });
        },
        //导出布控
        [types.ExportPolicy]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.ExportPolicy(data).then(res=>{
                    resolve(res);  
                });
            });
        },
        //导出报警布控
        [types.ExportPolicyLog]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.ExportPolicyLog(data).then(res=>{
                    resolve(res);  
                });
            });
        },
        //导出轨迹分析详细
        [types.ExportAnalyTraceTask]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.ExportAnalyTraceTask(data).then(res=>{
                    resolve(res);  
                });
            });
        },
        //获取场所策略
        [types.GetSitePatrol]({commit},{code}){
            return new Promise((resolve,reject)=>{
                ser.GetSitePatrol(code).then(res=>{
                    resolve(res);  
                });
            });
        },
        //获取场所策略历史信息
        [types.HistoryPolicy]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.HistoryPolicy(data).then(res=>{
                    resolve(res);  
                });
            });
        },
        //获取场所策略项历史记录
        [types.HistoryPlicyItem]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.HistoryPlicyItem(data).then(res=>{
                    resolve(res);  
                });
            });
        },
        //获取场所策略具体查询项
        [types.GetPatrolItems]({commit},id){
            return new Promise((resolve,reject)=>{
                ser.GetPatrolItems(id).then(res=>{
                    resolve(res);  
                });
            });
        },
        //获取场所策略列表信息
        [types.GetSitePolicyList]({commit}){
            return new Promise((resolve,reject)=>{
                ser.GetSitePolicyList().then(res=>{
                    resolve(res);  
                });
            });
        },
        //添加场所策略
        [types.AddPlacePolicy]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.AddPlacePolicy(data).then(res=>{
                    resolve(res);  
                });
            });
        },
        //获取场所详细信息
        [types.DetailPolicy]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.DetailPolicy(data).then(res=>{
                    resolve(res);  
                });
            });
        },
        //获取场所巡查详细信息
        [types.DetailPlaceInfo]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.DetailPlaceInfo(data).then(res=>{
                    resolve(res);  
                });
            });
        },
        //获取场所巡查详细策略历史记录
        [types.DetailPlacePolicy]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.DetailPlacePolicy(data).then(res=>{
                    resolve(res);  
                });
            });
        },
        //暂停巡查项目
        [types.StopPatrol]({commit},id){
            return new Promise((resolve,reject)=>{
                ser.StopPatrol(id).then(res=>{
                    resolve(res);  
                });
            });
        },
        //开启巡查项目
        [types.StartPatrol]({commit},id){
            return new Promise((resolve,reject)=>{
                ser.StartPatrol(id).then(res=>{
                    resolve(res);  
                });
            });
        },
        //删除巡查项目
        [types.DelPatrol]({commit},id){
            return new Promise((resolve,reject)=>{
                ser.DelPatrol(id).then(res=>{
                    resolve(res);  
                });
            });
        },
        //导出巡查项目
        [types.ExportPatrol]({commit},id){
            return new Promise((resolve,reject)=>{
                ser.ExportPatrol(id).then(res=>{
                    resolve(res);  
                });
            });
        },
        //未备案列表
        [types.WebSiteList]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.WebSiteList(data).then(res=>{
                    resolve(res);  
                });
            });
        },
        //备案列表信息
        [types.WebSiteRecordList]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.WebSiteRecordList(data).then(res=>{
                    resolve(res);  
                });
            });
        },
        //备案列表信息详细信息
        [types.WebSiteRecordDetail]({commit},id){
            return new Promise((resolve,reject)=>{
                ser.WebSiteRecordDetail(id).then(res=>{
                    resolve(res);  
                });
            });
        },
        //备案获取IP列表
        [types.WebSiteScanSetting]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.WebSiteScanSetting(data).then(res=>{
                    resolve(res);  
                });
            });
        },
        //备案新增ip段
        [types.WebSiteAddIP]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.WebSiteAddIP(data).then(res=>{
                    resolve(res);  
                });
            });
        },
        //备案删除ip段
        [types.WebSiteDelIP]({commit},id){
            return new Promise((resolve,reject)=>{
                ser.WebSiteDelIP(id).then(res=>{
                    resolve(res);  
                });
            });
        },
        //备案保存端口配置
        [types.WebSiteSavePort]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.WebSiteSavePort(data).then(res=>{
                    resolve(res);  
                });
            });
        },
        //备案获取端口配置
        [types.WebSitePortSetting]({commit}){
            return new Promise((resolve,reject)=>{
                ser.WebSitePortSetting().then(res=>{
                    resolve(res);  
                });
            });
        },
        //搜人脸
        [types.SearchFace]({commit},data){
            return new Promise((resolve,reject)=>{
                ser.SearchFace(data).then(res=>{
                    resolve(res);  
                });
            });
        }
    },
    modules:{
        main,
        setting,
        condition,
        handle,
        kuaisou,
        addSource,
        specialSource,
        menuManage,
        uploadSource
    }
});