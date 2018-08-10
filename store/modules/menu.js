import * as types from '../mutation-types'
import {tempType} from '../../enum/TempType'
const state={
    menu:'',//菜单对象
    searchMenuVal:'',//菜单关键字搜索
    searchTmpVal:'',//模板关键字搜索
    searchMenuKind:'',//菜单类型搜索
    searchTmpKind:'',//菜单模板搜索
    pageIndex:0,//页面显示索引
    
    curFieldListSize:0,//0:原大小,1:最大化(数据源页面)
    searchVal:'',//搜索关键字(数据源页面)
    searchSource:'',//搜索数据源类型(数据源页面)
    curSelTable:null,//当前选中的表(数据源页面)
    fields:[],//查看的字段集合(数据源页面)
    selFields:[],//选中的字段集合(数据源页面)

    limit:10,//每页显示条数(配置显示页面)
    setField:null,//当前设置字段(配置显示页面)
    sort_by:'',//排序字段(配置显示页面)
    is_desc:'',//排序方向(true:降序;false:升序)(配置显示页面)
    template:[1],//模板类型(配置显示页面)
    remoteInterface:[],//远程接口(配置显示页面)
    realtiveMenu:'',//关联页面(配置显示页面)
    field_btns:[],//操作字段按钮(配置显示页面)
    field_options:[],//操作字段(配置显示页面)
    queryCondition:[],//查询项(配置显示页面)

    templateHtml:'',//模板html
    popWidth:0,//模板弹窗宽度
    popHeight:0,//模板弹窗高度

    pageGoMap:{},
}

const getters={
    menu_blnGo:(state)=>(pageName)=>{
        if(!state.menu && pageName=='MenuPage'){
            return {name:pageName,flag:false,info:'请先选择菜单/模板项!'}
        }
        
        let res = state.pageGoMap[pageName]==undefined?{flag:true}:_.find(state.pageGoMap[pageName],r=>r.flag==false) || {flag:true};
        return res;
    },
    //转化映射的索引字段为对应的字段对象
    converMapIndexs:(state) => {
        let indexFields={};
        let tables=[state.curSelTable];
        for(let table of tables){
          let indexFs=table.indexFields;
          let groupIndex=0;
          for(let requisiteItem of indexFs.requisite){
              let fields=requisiteItem.split(','),gourp=[];
              for(let fieldKey of fields){
                  let field=table.fields[fieldKey];
                  if(!field)continue;
                  gourp.push({key:table.key+'_'+field.key,name:field.name,tableName:table.name,tableKey:table.key,fieldKey:field.key});
              }
              indexFields[table.key+(groupIndex++)]=gourp;
          }

          for(let notRequisiteItem of indexFs.notRequisite){
              //排除独立索引与共享索引相同的数据
              if(indexFs.requisite.join(',').indexOf(notRequisiteItem)>=0)continue;
              let field = table.fields[notRequisiteItem];
              if(!field)continue;
              indexFields[table.key+(groupIndex++)]=[{key:table.key+'_'+field.key,name:field.name,tableName:table.name,tableKey:table.key,fieldKey:field.key}];
          }
        }

        return indexFields;
    },
    //构造菜单服务器端配置对象
    menu_set:(state,getters)=>()=>{
        let t=state.curSelTable,
            primeKey=t.primeKey,
            fields=t.fields,
            distinctField=fields[primeKey] || {key:''};
        let tmpParam={
            [tempType['地图路径'].id]:_.compact(_.map([t],ts=>ts.mapTrack))
        };

        let setField=converFields(state.selFields,[t],state.template,tmpParam);
      
        let config={
            distinct_fields:{table:t.key,key:distinctField.key,alias:`${t.key}_${distinctField.key}`}, //去重字段
            field_btns:state.field_btns, //操作按钮
            field_options:state.field_options, //字段操作
            is_desc:state.is_desc,//是否排序
            limit:state.limit,//每页显示数量
            queryItems:state.queryCondition, //查询项
            tmpParam:tmpParam,//地图模板参数
            templateNum:state.template,
            realtiveMenu:state.realtiveMenu,//关联页面
            indexs:[],
            query_kind:'show',
            query_fields:setField.query_fields,//查询字段
            show_fields:setField.orderFields,//显示字段
            remoteInterface:state.remoteInterface,//远程接口
            sort_by:state.sort_by,//排序字段
            target:t.key,//表字段名
            indexFields:getters.converMapIndexs,//数据源索引字段(设置页面间字段映射)
        };
        
        return config;
    }
}

const mutations={
    [types.Set_Menu_Setting](state,{menu,searchMenuVal,searchTmpVal,searchMenuKind,searchTmpKind,pageIndex,
                                    curFieldListSize,searchVal,searchSource,curSelTable,fields,selFields,
                                    limit,setField,sort_by,is_desc,template,remoteInterface,realtiveMenu,field_btns,field_options,queryCondition,
                                    templateHtml,popWidth,popHeight
                                }){
       
        state.menu=menu==undefined?state.menu:menu;
        state.searchMenuVal=searchMenuVal==undefined?state.searchMenuVal:searchMenuVal;
        state.searchTmpVal=searchTmpVal==undefined?state.searchTmpVal:searchTmpVal;
        state.searchMenuKind=searchMenuKind==undefined?state.searchMenuKind:searchMenuKind;
        state.searchTmpKind=searchTmpKind==undefined?state.searchTmpKind:searchTmpKind;
        state.pageIndex=pageIndex==undefined?state.pageIndex:pageIndex;
        state.curFieldListSize=curFieldListSize==undefined?state.curFieldListSize:curFieldListSize;
        state.searchVal=searchVal==undefined?state.searchVal:searchVal;
        state.searchSource=searchSource==undefined?state.searchSource:searchSource;
        state.curSelTable=curSelTable==undefined?state.curSelTable:curSelTable;
        state.fields=fields==undefined?state.fields:fields;
        state.selFields=selFields==undefined?state.selFields:selFields;

        state.limit=limit==undefined?state.limit:limit;
        state.setField=setField==undefined?state.setField:setField;
        state.sort_by=sort_by==undefined?state.sort_by:sort_by;
        state.is_desc=is_desc==undefined?state.is_desc:is_desc;
        state.template=template==undefined?state.template:template;
        state.remoteInterface=remoteInterface==undefined?state.remoteInterface:remoteInterface;
        state.realtiveMenu=realtiveMenu==undefined?state.realtiveMenu:realtiveMenu;
        state.field_btns=field_btns==undefined?state.field_btns:field_btns;
        
        state.field_options=field_options==undefined?state.field_options:field_options;
        state.queryCondition=queryCondition==undefined?state.queryCondition:queryCondition;

        state.templateHtml=templateHtml==undefined?state.templateHtml:templateHtml;
        state.popWidth=popWidth==undefined?state.popWidth:popWidth;
        state.popHeight=popHeight==undefined?state.popHeight:popHeight;
    },
    [types.Clear_Menu_Setting](state){
        state.menu='';
        state.searchMenuVal='';
        state.searchTmpVal='';
        state.searchMenuKind='';
        state.searchTmpKind='';
        state.pageIndex=0;
        state.curFieldListSize=0;
        state.searchVal='';
        state.searchSource='';
        state.curSelTable=null;
        state.fields=[];
        state.selFields=[];
        state.limit=10;
        state.setField=null;
        state.sort_by='';
        state.is_desc='';
        state.template=[1];
        state.remoteInterface=[];
        state.realtiveMenu='';
        state.field_btns=[];
        state.field_options=[];
        state.queryCondition=[];
        state.templateHtml='';
        state.popWidth=0;
        state.popHeight=0;
        state.pageGoMap={};
    },
   //设置页面是否允许通过
   [types.SetMenuPageGo](state,{page,name,flag,info}){
    state.pageGoMap[page]= state.pageGoMap[page] || {};
    state.pageGoMap[page][name]={flag,info};
   },

}

const actions={
    //保存菜单相关配置
    [types.SaveMenu]({commit,state,getters}){
        return new Promise((resolve,reject)=>{
            let config = getters.menu_set();//获取菜单服务器端配置对象
            let menu=tool.Clone(state.menu);
            
            menu.condtionsObj=config;
            
            if(!menu.isSave){
                let msgIndex=tool.iconMsg('创建中,请耐心等待...');
                ser.createOperate(menu).then(res=>{
                    tool.closeMsg(msgIndex);
                    if(!tool.msg(res,'添加成功!','添加失败!')) return;

                    state.menu.isSave=true;
                    state.menu.keyid=res.biz_body.keyid;
                    state.menu.condtionsObj=config;
                    resolve({menu:state.menu});
                });
            }else{
                tool.confirm('修改模板会重新生成数据,您确定要继续修改吗?',['确定','取消'],()=>{
                    ser.updateOperate(menu).then(res=>{
                         tool.msg(res,'修改自定义模块成功!','修改自定义模块失败!');
                         state.menu.condtionsObj=config;
                         resolve({menu:state.menu,blnUpdate:true});
                     });
                 },function(){});
            }
        });


    }, 
}

let converFields=function(data,tables,templateNum,tmpParam){

    let query_fields=[];//查询字段
    let orderFields=[];//排序字段数组
    let groupFileds=[];//组合的字段
    let extraFileds=[];//额外的字段
    let tempFileds=[];//临时转换字段
    let oriFields=[];//原生字段

    for(let filed of data)
    {

        if(filed.blnExtra && !filed.mapField)continue;

        let fieldType=filed.fieldType || '0';
        let newF={};
        switch(fieldType){
            case '0'://普通字段
                newF.name=filed.showName || filed.name;
                newF.key=filed.key;
                newF.table=filed.tableKey || filed.table;
                newF.tableName=filed.tableName;
                newF.alias=newF.table+'_'+newF.key;
                newF.fieldType=filed.fieldType || '0';
                newF.format='';
                newF.formatType=filed.formatType || 0;
                newF.keyName=filed.name;
                newF.blnShow=filed.blnShow || 0;
                newF.columnW=filed.width || '';
                newF.pop_title=filed.pop_title || '';//提示信息字段
                newF.fun=filed.fun || '';
                newF.mapField=filed.mapField || '';

                orderFields.push(newF);
                filed.mapField || tempFileds.push(newF);
                oriFields.push(filed);
                break;
            case '1'://格式化字段
                newF.name=filed.showName || filed.name;
                newF.key=filed.key;
                newF.table=filed.tableKey || filed.table;
                newF.tableName=filed.tableName;
                newF.alias=newF.table+'_'+newF.key;
                newF.fieldType=filed.fieldType || '0';
                newF.format=filed.Format_express || '';
                newF.format=newF.format?tool.format(newF.format,'{'+newF.alias+'}'):newF.format;
                newF.formatType=filed.formatType || 0;
                newF.keyName=filed.name;
                newF.blnShow=filed.blnShow || 0;
                newF.columnW=filed.width || '';
                newF.pop_title=filed.pop_title || '';//提示信息字段
                newF.fun=filed.fun || '';
                newF.mapField=filed.mapField || '';

                orderFields.push(newF);
                filed.mapField || tempFileds.push(newF);
                oriFields.push(filed);
                
                break;
            case '2'://组合字段
                newF.name=filed.showName || filed.name;
                newF.key=filed.key;
                newF.table=filed.tableKey || filed.table;
                newF.alias=newF.key || '';
                newF.fieldType=filed.fieldType || '0';
                newF.format= filed.Format_group_express || '';
                newF.format=newF.format?tool.formatFunc(newF.format,(res)=>{return'{'+res.replace('.','_')+'}'}):newF.format;
                newF.formatType=filed.formatType || 0;
                newF.keyName=filed.name;
                newF.blnShow=filed.blnShow || 0;
                newF.columnW=filed.width || '';
                newF.pop_title=filed.pop_title || '';//提示信息字段
                newF.fun=filed.fun || '';
                newF.mapField=filed.mapField || '';
                
                orderFields.push(newF);
                //groupFileds.push(newF);
                for(let extraF of filed.groupFields)
                {
                    extraFileds.push({
                        name:extraF.showName || extraF.name,
                        key:extraF.key,
                        table:extraF.tableKey,
                        alias:extraF.tableKey+'_'+extraF.key
                    });
                    oriFields.push(extraF);
                }

                break;
            case '3'://远程字段 

                break;
            case '4'://超链接字段
                newF.name=filed.showName || filed.name;
                newF.key=filed.key;
                newF.table=filed.tableKey || filed.table;
                newF.tableName=filed.tableName;
                newF.alias=newF.table+'_'+newF.key;
                newF.fieldType=filed.fieldType || '0';
                newF.format= '';
                newF.formatType=4;//这里要特殊处理下
                newF.keyName=filed.name;
                newF.blnShow=filed.blnShow || 0;
                newF.columnW=filed.width || '';
                newF.pop_title=filed.pop_title || '';//提示信息字段
                newF.fun=filed.fun || '';
                newF.mapField=filed.mapField || '';

                orderFields.push(newF);
                filed.mapField || tempFileds.push(newF);
                oriFields.push(filed);
                break;
            
        }
    }

    query_fields=tempFileds.concat(extraFileds);
    

    //设置提示字段(如果该字段没有被选中则需要程序手动添加到查询字段中去)
    for(let f of tempFileds){
        if(!f['pop_title']) continue;
        for(let table of tables){
            let filed = table.fields[f['pop_title']];
            if(!filed)continue;
            let newField={};
            newField.name=filed.showName || filed.name;
            newField.key=filed.key;
            newField.table=table.key;
            newField.tableName=table.name;
            newField.alias=newField.table+'_'+newField.key;
            newField.fieldType=filed.fieldType || '0';
            newField.format= '';
            newField.formatType=filed.formatType || 0;
            newField.keyName=filed.name;
            newField.blnShow=filed.blnShow || 0;
            newField.columnW=filed.width || filed.columnW || '';
            newField.pop_title=filed.pop_title || '';//提示信息字段
            newField.fun=filed.fun || '';
            newField.mapField=filed.mapField || '';

            //判断该字段是否已经被选中为要显示的字段(被选中则不需要添加)
            let blnContain =_.chain(query_fields).pluck('alias').contains(newField.alias).value();
            if(blnContain)continue;
            query_fields.push(newField);
        }
    }
    
    //设置默认附加字段(唯一标识符字段)
    for(let table of tables){
        let primeKey = table['primeKey'];
        if(!primeKey)continue;
        let filed = table.fields[primeKey];
        if(!filed)continue;
        let newField={};
        newField.name=filed.showName || filed.name;
        newField.key=filed.key;
        newField.table=table.key;
        newField.tableName=table.name;
        newField.alias=newField.table+'_'+newField.key;
        newField.fieldType=filed.fieldType || '0';
        newField.format='';
        newField.formatType=filed.formatType || 0;
        newField.keyName=filed.name;
        newField.blnShow=filed.blnShow || 0;
        newField.columnW=filed.width || filed.columnW || '';
        newField.pop_title=filed.pop_title || '';//提示信息字段

        //判断该字段是否已经被选中为要显示的字段(被选中则不需要添加)
        let blnContain =_.chain(query_fields).pluck('alias').contains(newField.alias).value();
        if(blnContain)continue;
        query_fields.push(newField);
    }

    //设置默认模板字段(路径模板情况下:需要默认添加日期字段否则展示时会因缺少日期字段而造成显示问题)
    if(templateNum.indexOf(tempType['地图路径'].id)>=0){
        for(let table of tables){
            let param = tmpParam[tempType['地图路径'].id][0];
            let filed = table.fields[param];
            if(filed){
                let newField={};
                newField.name=filed.showName || filed.name;
                newField.key=filed.key;
                newField.table=table.key;
                newField.tableName=table.name;
                newField.alias=newField.table+'_'+newField.key;
                newField.format= '';
                newField.formatType=filed.formatType || 0;
                newField.keyName=filed.name;
                newField.blnShow=filed.blnShow || 0;
                newField.columnW=filed.width || filed.columnW || '';
                newField.pop_title=filed.pop_title || '';//提示信息字段
                //判断该字段是否已经被选中为要显示的字段(被选中则不需要添加)
                let blnContain =_.chain(query_fields).pluck('alias').contains(newField.alias).value();
                if(!blnContain){
                    query_fields.push(newField);
                }
            }
        }
     }

    //设置关联字段(有些字段的数据需要其他字段存在的情况下才会有，因此如果该关联字段没有被选中则需要字段添加该字段)
    let relativeFields=_.filter(data,d=>d.for) || [];
    for(let field of relativeFields){
        let relativeKey=field.for.split(',') || [];
        if(relativeKey.length<=0)continue;
        for(let key of relativeKey){
            for(let table of tables){
                let filed = table.fields[key];
                if(!filed)continue;
                let newField={};
                newField.name=filed.showName || filed.name;
                newField.key=filed.key;
                newField.table=table.key;
                newField.tableName=table.name;
                newField.alias=newField.table+'_'+newField.key;
                newField.fieldType=filed.fieldType || '0';
                newField.format='';
                newField.formatType=filed.formatType || 0;
                newField.keyName=filed.name;
                newField.blnShow=filed.blnShow || 0;
                newField.columnW=filed.width || filed.columnW || '';
                newField.pop_title=filed.pop_title || '';//提示信息字段

                //判断该字段是否已经被选中为要显示的字段(被选中则不需要添加)
                let blnContain =_.chain(query_fields).pluck('alias').contains(newField.alias).value();
                if(blnContain)continue;
                query_fields.push(newField);
            }
        }
    }

    
    return {orderFields,query_fields};
};



export default{
    state,
    mutations,
    getters,
    actions
}