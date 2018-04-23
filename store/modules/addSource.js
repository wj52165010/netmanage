import * as types from '../mutation-types'
const state={
    sourceCode:'',//数据源Code(唯一标识码)
    sourceTitle:'',//数据源名称
    primary_columns:[],//主键集合,
    split_type:'',//拆分类型
    split_column:'',//拆分列
    rowSep:'',//行分隔符
    colSep:'',//列分隔符
    encoding:'utf-8',//编码格式
    sourceOri:'',//数据来源
    containerHeader:0,//包含列头
    file:'',//上传文件对象
    uploadStatus:0,//当前上传状态
    cols:[],//列对象
    pageGoMap:{},//新增数据源相关页面是否通过操作映射
}

const getters={
    addSource_blnGo:(state)=>(pageName)=>{
        let res = state.pageGoMap[pageName]==undefined?{flag:true}:state.pageGoMap[pageName];
        return res;
    }
}

const mutations={
    //设置新增上传数据源页面数据
    [types.SetAddSourcePageData](state,{rowSep,colSep,encoding,sourceOri,containerHeader,file,uploadStatus,cols,sourceTitle,primary_columns,split_type,split_column,sourceCode}){
        state.rowSep=rowSep || state.rowSep;
        state.colSep=colSep || state.colSep;
        state.encoding=encoding || state.encoding;
        state.sourceOri=sourceOri ||state.sourceOri;
        state.containerHeader=containerHeader || state.containerHeader;
        state.file=file || state.file;

        state.uploadStatus=uploadStatus || state.uploadStatus;
        state.cols=cols || state.cols;
        state.sourceTitle=sourceTitle==undefined?state.sourceTitle:sourceTitle;
        state.primary_columns=primary_columns || state.primary_columns;
        state.split_type=split_type || state.split_type;
        state.split_column=split_column || state.split_column;
        state.sourceCode=sourceCode==undefined?state.sourceCode:sourceCode;
    },
    //清空上传数据源页面相关数据
    [types.ClearAddSourcePageData](state){
        state.rowSep='';
        state.colSep='';
        state.encoding='utf-8';
        state.sourceOri='';
        state.containerHeader=0;
        state.file='';
        state.uploadStatus=0;
        state.cols=[];
        state.sourceTitle='';
        state.primary_columns=[];
        state.split_type='';
        state.split_column='';
        state.sourceCode='';
        state.pageGoMap={};
    },

    //设置页面是否允许通过
    [types.SetAddSourcePageGo](state,{name,flag,info}){
        state.pageGoMap[name]={flag,info};
    },
}

const actions={
    //保存数据源相关配置
    //blnConfirm:是否显示确认框
    [types.SaveSource]({commit,state},{blnConfirm}){
        return new Promise((resolve,reject)=>{
            if(!state.sourceTitle){tool.info('请填写数据源名称!'); return;}
            let data ={
                title:state.sourceTitle,
                split_type:state.split_type,
                split_column:state.split_column,
                primary_columns:state.primary_columns,
                index_columns:[_.chain(state.cols).filter(c=>c.isIndex).map(c=>c.key).value()],
                columns:_.map(state.cols,c=>{
                    return {
                        column:c.key,
                        data_type:c.type,
                        desc:c.desc,
                        name:c.name,
                        data_size:0,
                        parse_format:'',
                        define_column:c.dsFieldType,
                        is_order:c.isOrder,
                        is_quick_search:c.isQuickSearch
                    };
                })
            };
            
            if(blnConfirm){
                tool.confirm('数据源创建后无法修改，您确定配置正确吗？',['确定','取消'],()=>{
                    let msgIndex=tool.iconMsg('创建中,请耐心等待...');
                    ser.upload_add_dataSource_new(data).then(res=>{
                        tool.closeMsg(msgIndex);
                        resolve(res);
                    });
                },function(){});
            }else{
                ser.upload_add_dataSource_new(data).then(res=>{
                    resolve(res);
                });
            }
            
        });
    },

    //创建数据源上传解析规则
    [types.CreateFileParse]({commit,state}){
        return new Promise((resolve,reject)=>{
            let data={
                source_code:state.sourceCode,
                encoding:state.encoding,
                col_seperator:state.colSep,
                row_seperator:state.rowSep,
                is_first_column_name:state.containerHeader>0,
                file_name_filters:[],
                microprobe_type:state.sourceOri,
                columns:_.chain(state.cols).filter(c=>!c.ignore).map(c=>{
                    if(c.ignore){
                        return {
                            source_column:'',
                            dest_column:'',
                            def_val:'',
                            format:'',
                            params:[]
                        }
                    }
                    return {
                        source_column:state.containerHeader>0?c.dest_column:c.key,
                        dest_column:c.key,
                        def_val:c.def_val,
                        format:c.format,
                        params:[c.firstParam].concat([c.senondParam])
                    }
                }).value()
            };
            
     
            let msgIndex=tool.iconMsg('上传数据中,请耐心等待...');
            ser.upload_add_fileparse(data).then(res=>{
                tool.closeMsg(msgIndex);
                resolve(res);
            });
        });
    },

    //上传文件数据
    [types.UplaodFileData]({commit,state},{code,id}){
        return new Promise((resolve,reject)=>{
            ser.uploadFile('upload/file',state.file.files,code,id).then(res=>{
                resolve(res);
            });
        });
    }
}



export default{
    state,
    mutations,
    getters,
    actions
}