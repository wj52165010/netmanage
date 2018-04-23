//限定数据源
import * as types from '../mutation-types'
const state={
    sourceName:'',//数据源名称
    sourceDesc:'',//数据源描述
    condFields:[],//用来设置限定条件的字段集合
    distinct:2,//是否去重
    kind:[],//查询模式
    fields:[],//当前数据源展示的字段集合,
    selFields:[],//当前选中的字段集合
    curSourceIndex:0,//当前选中的数据源索引
    curSelTable:null,//当前选中的表
    conds:[],//限定字段条件集合
    groups:[],//条件组合信息
    curSelGroupIndex:-1,//当前选中的分组项索引
    params:{},//限定条件提交数据
    pageGoMap:{}//限定数据源相关页面是否通过操作映射

}

const getters={
    sepSource_blnGo:(state)=>(pageName)=>{
        if(!state.curSelTable){
            return {name:'SpecialSource',flag:false,info:'请先选择表!'}
        }

        let res = state.pageGoMap[pageName]==undefined?{flag:true}:_.find(state.pageGoMap[pageName],r=>r.flag==false) || {flag:true};
        return res;
    }
}

const mutations={
   //设置限定数据源数据源页面数据
   [types.SetSepSourcePageData](state,{fields,selFields,curSourceIndex,curSelTable,sourceName,sourceDesc,condFields,distinct,kind,conds,groups,curSelGroupIndex,params}){
       state.fields=fields || state.fields;
       state.selFields=selFields || state.selFields;
       state.curSourceIndex=curSourceIndex || state.curSourceIndex;
       state.curSelTable=curSelTable || state.curSelTable;
       state.sourceName=sourceName || state.sourceName;
       state.sourceDesc=sourceDesc || state.sourceDesc;
       state.condFields=condFields || state.condFields;
       state.distinct=distinct || state.distinct;
       state.kind=kind || state.kind;
       state.conds=conds || state.conds;
       state.groups=groups || state.groups;
       state.curSelGroupIndex=curSelGroupIndex==undefined?state.curSelGroupIndex:curSelGroupIndex;
       state.params=params || state.params;
   },
   //清空限定数据源数据源页面相关数据
   [types.ClearSepSource](state){
        state.fields=[];
        state.selFields=[];
        state.curSourceIndex=0;
        state.curSelTable=null;
        state.sourceName='';
        state.sourceDesc='';
        state.condFields=[];
        state.distinct=2;
        state.kind=[];
        state.conds=[];
        state.groups=[];
        state.curSelGroupIndex=-1;
        state.params={};
        state.pageGoMap={};
   },
   //设置页面是否允许通过
   [types.SetSepSourcePageGo](state,{page,name,flag,info}){
        state.pageGoMap[page]= state.pageGoMap[page] || {};
        state.pageGoMap[page][name]={flag,info};
   },

}



export default{
    state,
    mutations,
    getters
}