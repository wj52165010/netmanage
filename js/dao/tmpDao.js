//模板业务层操作对象
import searchArrType from '../../enum/SearchType.js'
let Rx = require('rxjs/Rx');
module.exports={
    //获取查询参数数据
    searchParam(condtion,model){
        let param=[],self=this;
        let comCond=condtion;
        //let comCond=_.filter(condtion,cond=>{return !cond.isPrimeIndex;});//一般通用查询条件
        //let sepCond=_.filter(condtion,cond=>{return cond.isPrimeIndex;});//特殊查询条件
        //构造通用查询条件
        for(let cond of comCond){
            if(!cond.value && !cond.defVal){continue;}
            let value=cond.value || cond.defVal || '';
        
            if(searchArrType[cond.type]=='日期范围' && _.compact(value).length<=0){continue;}
            if(searchArrType[cond.type]=='日期' && value){
                if(typeof(value) == 'string'){
                    value=new Date(value);
                }
                let start=tool.Timestamp(value);
                value.setHours(23,59,59);
                let end=tool.Timestamp(value);
                value = [start,end];
            }
            if(searchArrType[cond.type]=='日期范围' && value){
                if(typeof(value[1]) == 'string'){
                    value[0]=new Date(value[0])
                    value[1]=new Date(value[1]);
                }
                
                //value[1].setHours(23,59,59);
                value=[tool.Timestamp(value[0]),tool.Timestamp(value[1])];
            }
            if(searchArrType[cond.type]=='生日' && value){
                value=tool.DateFormat(value,'yyyyMMdd');
            }
            
            //日期格式参数
            if((searchArrType[cond.type]=='日期' || searchArrType[cond.type]=='日期范围')  && value ){
                if(value.length<=0)continue;
                param.push({
                    term:'gte',
                    field:{table:cond.filed.tableKey || cond.filed.table,key:cond.filed.key,alias:model.query_kind =='show'?cond.filed.key:(cond.filed.tableKey || cond.filed.table)+'_'+cond.filed.key},
                    value:value[0],
                });
                param.push({
                    term:'lte',
                    field:{table:cond.filed.tableKey || cond.filed.table,key:cond.filed.key,alias:model.query_kind =='show'?cond.filed.key:(cond.filed.tableKey || cond.filed.table)+'_'+cond.filed.key},
                    value:value[1],
                });
            }

            //普通条件
            if(!(searchArrType[cond.type]=='日期' || searchArrType[cond.type]=='日期范围') && searchArrType[cond.type]!='区域控件'){
                if(tool.isArray(value) ){
                    if(value.length<=0)continue;
                    param.push({
                        term:'in',
                        field:{table:cond.filed.tableKey || cond.filed.table,key:cond.filed.key,alias:model.query_kind =='show'?cond.filed.key:(cond.filed.tableKey || cond.filed.table)+'_'+cond.filed.key},
                        value:'',
                        condtions:_.map(value,v=>{return {term:'',field:{},value:v};})
                    });
                }else{
                    param.push({
                        term:'eq',
                        field:{table:cond.filed.tableKey || cond.filed.table,key:cond.filed.key,alias:model.query_kind =='show'?cond.filed.key:(cond.filed.tableKey || cond.filed.table)+'_'+cond.filed.key},
                        value:value,
                    });
                }
            }

            //场所区域控件
            if(searchArrType[cond.type]=='区域控件'){
                //判断是否为根结点区域项(位数为4或6位,最后两位为00)
                let noRootData=[];//不是根节点区域项
                _.each(value,v=>{
                    let blnRoot=v.substr(-2)=='00';
                    if(blnRoot){
                        param.push({
                            term:'gte',
                            field:{table:cond.filed.tableKey || cond.filed.table,key:cond.filed.key,alias:model.query_kind =='show'?cond.filed.key:(cond.filed.tableKey || cond.filed.table)+'_'+cond.filed.key},
                            value:v,
                        });
                        
                        //补位(最后两位为00则替换为99,一次倒推直到条件不成立)
                        
                        let placeStr=v;
                        let placeNumber=function(str,count){
                            let blnRoot=str.substr(-2*count,2)=='00';
                            if(blnRoot){
                                let place='';
                                for(let i=0;i<count;i++){
                                    place+='99';
                                }
                                placeStr = v.substr(0,v.length-2*count)+place;
                                placeNumber(placeStr,++count);
                            }
                        };
                        
                        placeNumber(placeStr,1);

                        param.push({
                            term:'lte',
                            field:{table:cond.filed.tableKey || cond.filed.table,key:cond.filed.key,alias:model.query_kind =='show'?cond.filed.key:(cond.filed.tableKey || cond.filed.table)+'_'+cond.filed.key},
                            value:placeStr,
                        });
                    }else{
                        noRootData.push(v);
                    }
                });
     
                if(noRootData.length>0){
                    param.push({
                        term:'in',
                        field:{table:cond.filed.tableKey || cond.filed.table,key:cond.filed.key,alias:model.query_kind =='show'?cond.filed.key:(cond.filed.tableKey || cond.filed.table)+'_'+cond.filed.key},
                        value:'',
                        condtions:_.map(noRootData,n=>{return {term:'',field:{},value:n};})
                    });
                }
            }
        }

        let result={term:'',field:{},value:'',condtions:[]};
        let converParam=(param,result)=>{
            if(param.length>1){
                let item=param.shift();
                result.term='and';
                result.condtions[0]=item;
                result.condtions[1]={term:'',field:{},value:'',condtions:[]};
                converParam(param,result.condtions[1]);
            }else{
                result.term=param[0].term;
                result.field=param[0].field;
                result.value=param[0].value;
                result.condtions=param[0].condtions || [];
            }
        };
        if(param.length>0){
            converParam(param,result);
        }else{
            result={};
        }
        //获取特殊查询条件
        // let queryKind=model.query_kind;//模板查询类型
        let sepParam=[];
        // for(let cond of sepCond){
        //     if(!cond.value && !cond.defVal){continue;}
        //     let value=cond.value || cond.defVal || '';
        //     if(searchArrType[cond.type]=='日期范围' && _.compact(value).length<=0){continue;}

        //     if(searchArrType[cond.type]=='日期' && value){
        //         value = [tool.Timestamp(value)];
        //     }
        //     else if(searchArrType[cond.type]=='日期范围' && value){
        //         value=[tool.Timestamp(value[0]),tool.Timestamp(value[1])];
        //     }
        //     else if(searchArrType[cond.type]=='生日' && value){
        //         value=[tool.DateFormat(value,'yyyyMMdd')];
        //     }
        //     else{
        //         value=[value]
        //     }
        //     sepParam.push({field:queryKind=='show'?cond.filed.key:cond.filed.tableKey+'_'+cond.filed.key,values:value});
        // }
        return {param:result,sepParam:sepParam};
    },
    //打开模板页面
    openTmp(menu,params,store,option){
        option=option || {};
        tool.open(function(){
            let html=`<htmlTmpPage :menu="menu" :params='params' :store="store"/>`;
            let param={
                title:option.title || '模板页',
                area:option.area || '600px',
                content:`<div class="openTmp" style="width:100%;height:100%;overflow-y:auto;">${html}</div>`,
                store:store,
                context:{
                    menu:menu,
                    params:params,
                    store:store
                }
            };
            
            return param;
        }());
    },

    //格式化数据显示类容
    formatData(field,info,data){
        if(field.formatType=='0' && field.format){
            return tool.formatPop(field.format,data);
        }
        else if(field.formatType=='1' || (field.type && '日期'==searchArrType[field.type]) || (field.type && '日期范围'==searchArrType[field.type])){
            if(!info){return '';}
            //判断日期格式是否已被转换
            if(info.indexOf('-')>=0 && info.indexOf(':')>=0){return info;}

            let res='';
            //时间戳转化
            let timestampRx = Rx.Observable.of(info).map(info=> tool.DateByTimestamp(parseInt(info),'yyyy/MM/dd hh:mm:ss'));
            //字符串日期转化(格式:20161212011212)
            let oriRx =Rx.Observable.of(info).map(info=>{
                let year=info.substr(0,4) || '',
                    mouth=info.substr(4,2) || '',
                    day=info.substr(6,2) || '',
                    hour=info.substr(8,2) || '',
                    minute=info.substr(10,2) || '',
                    second=info.substr(12,2) || '';
                return year+'/'+mouth+'/'+day+' '+ hour +':'+minute+':'+second;
            });

            let finalRx = Rx.Observable.merge(oriRx,timestampRx).filter(x=>tool.CheckDateTime(x)).map(x=>tool.DateFormat(new Date(x),field.format || 'yyyy-MM-dd hh:mm:ss'));
            let finalRxSub =finalRx.subscribe(x=>res=x);
            finalRxSub.unsubscribe();

            return res;
        }
        else if(field.type && '生日'==searchArrType[field.type] || ''){
            let oriRx =Rx.Observable.of(info).map(info=>{
                let year=info.substr(0,4) || '',
                    mouth=info.substr(4,2) || '',
                    day=info.substr(6,2) || '';
                return year+'-'+mouth+'-'+day;
            });

           let finalRxSub = oriRx.subscribe(x=>res=x);
           finalRxSub.unsubscribe();
           return res;
        }

        return info;
    }
}