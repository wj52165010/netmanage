import * as types from '../mutation-types'
const state={
    curSet:null,//当前配置对象
    curSelTable:[],//当前选择的数据源集合
    curLookTableIndex:-1,//当前查看数据源索引
    curFieldListSize:0,//字段展示界面是否最大化
    sourceKind:'',//数据源类型(过滤条件)
    searchVal:'',//搜索关键字(过滤条件)
    curTagIndex:-1,//设置条件页面左边当前选中的数据源索引
    pageLimit:10,//快搜每页显示条数
    pages:{},//关联页面配置
    // selSource:[
    //     {name:'终端上下线',key:'online',fields:[
    //         {name:'场所名称1',key:'1',desc:'描述场所名称1111111111111111',val:'重庆冲浪网咖'},
    //         {name:'场所名称2',key:'2',desc:'描述场所名称1111111111111111',val:'重庆冲浪网咖'},
    //         {name:'场所名称3',key:'3',desc:'描述场所名称1111111111111111',val:'重庆冲浪网咖'},
    //         {name:'场所名称4',key:'4',desc:'描述场所名称1111111111111111',val:'重庆冲浪网咖'},
    //         {name:'场所名称5',key:'5',desc:'描述场所名称1111111111111111',val:'重庆冲浪网咖'},
    //         {name:'场所名称6',key:'6',desc:'描述场所名称1111111111111111',val:'重庆冲浪网咖'},
    //         ]},
    //     {name:'报警日志',key:'police',fields:[{name:'场所名称',key:'1',desc:'描述场所名称',val:'重庆冲浪网咖'}]},
    //     {name:'场所日志',key:'place',fields:[{name:'场所名称',key:'1',desc:'描述场所名称',val:'重庆冲浪网咖'}]}
        
    //     ],//当前选中的数据源集合
    pageGoMap:{}//页面是否通过操作映射
}

const getters={
    kuaisou_blnGo:(state)=>(pageName)=>{
        if(!state.curSet && pageName=='ksearchIndex'){
            return {name:pageName,flag:false,info:'请先选择配置项!'}
        }

        let res = state.pageGoMap[pageName]==undefined?{flag:true}:_.find(state.pageGoMap[pageName],r=>r.flag==false) || {flag:true};
        return res;
    }
}

const mutations={
   [types.Set_Setting_Obj](state,{curSet,curSelTable,curLookTableIndex,curFieldListSize,sourceKind,searchVal,curTagIndex,pageLimit,pages}){
        state.curSet=curSet || state.curSet;
        state.curSelTable=curSelTable || state.curSelTable;
        if(curSelTable){
            state.curSet.souces=curSelTable; 
        }
        state.curLookTableIndex=curLookTableIndex==undefined?state.curLookTableIndex:curLookTableIndex;
        state.curFieldListSize=curFieldListSize==undefined?state.curFieldListSize:curFieldListSize;
        state.sourceKind=sourceKind==undefined?state.sourceKind:sourceKind;
        state.searchVal=searchVal==undefined?state.searchVal:searchVal;
        state.curTagIndex=curTagIndex==undefined?state.curTagIndex:curTagIndex;
        state.pageLimit=pageLimit==undefined?state.pageLimit:pageLimit;
        state.pages=pages==undefined?state.pages:pages;
   },
   [types.Clear_Set_Setting_Obj](state){
        state.curSet=null;
        state.curSelTable=[];
        state.curLookTableIndex=-1;
        state.curFieldListSize=0;
        state.sourceKind='';
        state.searchVal='';
        state.curTagIndex=-1;
        state.pageLimit=10;
        state.pageGoMap={};
        state.pages={};
   },
   [types.Set_Source_Info](state,obj){

   },
   //设置页面是否允许通过
   [types.SetKuaiSouPageGo](state,{page,name,flag,info}){
    state.pageGoMap[page]= state.pageGoMap[page] || {};
    state.pageGoMap[page][name]={flag,info};
   },
}

const actions={
  //保存数据源相关配置
  [types.SaveSearch]({commit,state}){
    return new Promise((resolve,reject)=>{
        tool.confirm('您确定要保存该配置吗？',['确定','取消'],()=>{
            state.curSet.pageLimit=state.pageLimit;
            state.curSet.pages=state.pages;
            let msgIndex=tool.iconMsg('创建中,请耐心等待...');
            if(state.curSet.isAdd){
                ser.addQuickSearch(state.curSet).then(res=>{
                    tool.closeMsg(msgIndex);
                    if(!tool.msg(res,'添加成功！','添加失败!')){
                        resolve(res);
                        return;
                    }
                    state.curSet.keyid=res.biz_body[0].keyid;
                    state.curSet.isAdd=false;
                });
            }else{
                //修改updateQuickSearch
                ser.updateQuickSearch(state.curSet).then(res=>{
                    tool.closeMsg(msgIndex);
                    if(!tool.msg(res,'修改成功！','修改失败!')){
                        resolve(res);
                        return;
                    }
                });
            }
        },function(){});
    });
  }
}



export default{
    state,
    mutations,
    actions,
    getters
}