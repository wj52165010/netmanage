//上传数据源
import * as types from '../mutation-types'
const state={
    targetSource:'',//目标数据源关键字
    oriSource:'',//来源数据源关键字
    mapField:[],//映射字段key值
    query_kind:['backtrack'],//查询类型
    conds:[],//字段条件集合
    groupConds:[],//组合条件集合
    oriConds:[],//设置后的条件数据集合
    filter:{term:'',source_column:'',value:'',condtions:[]},//过滤对象
}

const mutations={
   //设置上传数据源相关页面数据
   [types.SetUploadSourcePageData](state,{targetSource,oriSource,fields,conds,groupConds,oriConds,filter,query_kind}){
        state.targetSource=targetSource==undefined?state.targetSource:targetSource;
        state.oriSource=oriSource==undefined?state.oriSource:oriSource;
        state.mapField=fields==undefined?state.mapField:_.chain(fields).filter(f=>f.mapField).map(f=>{
            return {target:f.key,ori:f.mapField}
        }).value();
        state.conds=conds==undefined?state.conds:conds;
        state.groupConds=groupConds==undefined?state.groupConds:groupConds;
        state.oriConds=oriConds==undefined?state.oriConds:oriConds;
        state.filter=filter==undefined?state.filter:filter;
        state.query_kind=query_kind==undefined?state.query_kind:query_kind;
        
   },
   //清空上传数据源相关页面数据
   [types.ClearUploadSourcePageData](state){
        state.targetSource='';
        state.oriSource='';
        state.mapField=[];
        state.conds=[];
        state.groupConds=[];
        state.oriConds=[];
        state.filter={term:'',source_column:'',value:'',condtions:[]};
        state.query_kind=['backtrack'];
   }
}


const actions={
    //创建数据源导入解析规则
    [types.CreateDataParse]({commit,state}){
        return new Promise((resolve,reject)=>{

            if(!state.oriSource){
                tool.info('来源数据源必选!');
                return;
            }
            if(state.mapField.length<=0){
                tool.info('请选择映射字段!');
                return;
            }

            if(!state.filter.condtions && state.filter.field && (!state.filter.field.table || !state.filter.value)){
                if(!state.filter.field.table){tool.info('请配置条件!');return;}
                if(!state.filter.value){tool.info('条件值不能为空!');return;}
            }
            
            if(!state.filter.condtions && !state.filter.field){//单个条件
                tool.info('请配置条件!');
                return;
            }
            

            let data={
                source_code:state.targetSource,
                dest_code:state.oriSource,
                encoding:'',
                col_seperator:'',
                row_seperator:'',
                is_first_column_name:false,
                file_name_filters:[],
                query_kind:state.query_kind.join(','),
                microprobe_type:'',
                columns:_.chain(state.mapField).map(c=>{
                    return {
                        source_column:c.ori,
                        dest_column:c.target,
                        def_val:'',
                        format:'',
                        params:[]
                    }
                }).value(),
                filter:state.filter
            };
            
            let msgIndex=tool.iconMsg('上传数据中,请耐心等待...');
            ser.upload_add_fileparse(data).then(res=>{
                tool.closeMsg(msgIndex);
                resolve(res);
            });
        });
    }
}



export default{
    state,
    mutations,
    actions
}