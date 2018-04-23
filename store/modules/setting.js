import * as types from '../mutation-types'
import {tempType} from '../../enum/TempType'
// import {tool}  from '../../js/tool.js'
const state={
    content:'配置页面',
    allTables:[],//所有的数据源
    tables:[],//选择的数据源数据
    queryFields:[],//查询字段
    orderFields:[],//排序字段
    menus:[],//菜单集合
    oriMenu:null,//原菜单项数据
    curMenu:null,//当前操作菜单项数据
    menuDataChange:null,//当前菜单数据改变监听对象
    fieldDataChange:null,//当前选择的字段项改变事件
    sourceDel:null,//数据源删除事件监听对象
    sourceChange:null,//数据源改变事件
    menuDelChange:null,//菜单删除监听对象
}

const mutations={
    //注册菜单数据改变监听对象
    [types.Reg_Menu_Change](state,obj){
        state.menuDataChange=obj;
    },
    //注册菜单数据改变事件
    [types.Reg_Menu_Change_Even](state,func){
        setTimeout(()=>{
            state.menuDataChange.subscribe(func);
        },0);
    },
    //注册数据选择改变监听对象
    [types.Reg_Data_Source_Change](state,obj){
         state.sourceChange=obj;
    },
    //监听数据源改变事件
    [types.Data_Change](state,func){
        state.sourceChange.subscribe(func);
    },
    //注册字段项选择改变监听对象
    [types.Reg_fieldChange_Even](state,obj){
        state.fieldDataChange=obj;
    },
    //监听字段项改变事件
    [types.Field_Change](state,func){
        state.fieldDataChange.subscribe(func);
    },
    //设置所有的数据源
    [types.SET_ALL_TABLE_DATA](state,data){
        state.allTables=data;
    },

    //注册菜单删除监听事件对象
    [types.Reg_Del_Menu_Even](state,data){
        state.menuDelChange=data;
    },
    //订阅菜单删除事件
    [types.Sub_Del_Menu](state,func){
        state.menuDelChange.subscribe(func);
    },
    //触发菜单删除事件
    [types.Trigger_Del_Menu](state,keyid){
        state.menuDelChange.next(keyid);
    },

    // //设置选中的数据源
    // [types.SET_TABLE_DATA](state,data){
    //     if(!state.curMenu){return;}
    //     state.curMenu.dataSourceConfig.selSource=data;
    //     state.tables=data;
    //     state.menuDataChange.next(state.curMenu);
    // },

    // //设置查询字段
    // [types.SET_QUERY_FIELD](state,data){
    //     state.queryFields=data;
    // },
    //设置菜单列表集合数据
    [types.Set_Menus](state,data){
        state.menus=data;
    },
    //清空当前操作菜单数据
    [types.Clear_Menu](state){
        state.oriMenu=null;
        state.curMenu=null;
        state.tables=[];
        state.allTables=[];//所有的数据源
        state.queryFields=[];//查询字段
        state.orderFields=[];//排序字段
        state.menus=[];//菜单集合
        state.menuDataChange=null;//当前菜单数据改变监听对象
        state.fieldDataChange=null;//当前选择的字段项改变事件
        state.sourceDel=null;//数据源删除事件监听对象
        state.sourceChange=null;//数据源改变事件
        state.menuDelChange=null;//菜单删除监听对象
    },
    //设置当前操作菜单数据
    [types.Set_Menu](state,data){
        state.oriMenu=data;
        state.curMenu=tool.Clone(data);
        state.tables=!state.curMenu.dataSourceConfig?[]:!state.curMenu.dataSourceConfig.selSources?[]:state.curMenu.dataSourceConfig.selSources;
        state.menuDataChange.next(state.curMenu);
    },
    //设置数据源页面操作历史数据
    [types.Set_Source_data](state,data){
        if(!state.curMenu){return;}
        state.curMenu.dataSourceConfig=state.curMenu.dataSourceConfig || {};
        state.curMenu.dataSourceConfig.curKindIndex=data.curKindIndex;
        state.tables=data.selSources;
        let selSource=[];
        for(let table of state.tables){
            selSource.push(table.key);
        }
        if(!state.curMenu.condtionsObj) return;
        state.curMenu.condtionsObj.target=selSource.join(',');
    },
    //注册数据源删除事件监听对象
    [types.Reg_Date_Source_Del](state,obj){
        state.sourceDel=obj;
    },
    //注册数据源删除事件
    [types.Reg_Date_Source_Del_Even](state,func){
        state.sourceDel.subscribe(func);
    },
    //设置字段显示页面历史数据
    [types.Set_Show_data](state,data){
        if(!state.curMenu){return;}
        state.curMenu.showDataConfig=data;
    },
    //设置操作页面历史数据
    [types.Set_Handle_data](state,data){
        if(!state.curMenu){return;}
        state.curMenu.hanldeDataConfig=data;
        if(!state.curMenu.condtionsObj) return;

        state.curMenu.condtionsObj.field_btns=state.curMenu.hanldeDataConfig.field_btns;
        state.curMenu.condtionsObj.field_options=state.curMenu.hanldeDataConfig.field_options;
    },
    //设置条件页面配置对象
    [types.Set_Conifg](state,data){
        if(!state.curMenu){return;}
        state.curMenu.condtionsObj=state.curMenu.condtionsObj || {};
        let config=state.curMenu.condtionsObj;
        // let selSource=[];
        // for(let table of state.tables){
        //     selSource.push(table.key);
        // }

        // config.target=selSource.join(',');
        config.templateNum=data.template || config.templateNum;
        config.tmpParam={
            [tempType['地图路径'].id]:_.compact(_.map(state.tables,t=>t.mapTrack))
        };//模板类型参数(4:地图路径需要指定日期数据字段)
        config.templateSet=data.templateSet || config.templateSet;//模板页面之间关联设置

        config.limit=data.limit || config.limit;
        config.sort_by=data.sort_by?data.query_kind.indexOf('show')>=0?data.sort_by.key:data.sort_by.tableKey+'_'+data.sort_by.key:'';
        config.ori_sort_by=data.sort_by;
        config.is_desc=data.is_desc || config.is_desc;
        config.realtiveMenu=data.realtiveMenu;
        config.distinct_fields=data.distinctField?{table:data.distinctField.tableKey,key:data.distinctField.key,alias:data.distinctField.tableKey+'_'+data.distinctField.key}:data.distinctField ==0?{}:config.distinct_fields || {};//data.distinctField?data.distinctField.tableKey+'_'+data.distinctField.key:config.distinct_fields;
        config.oriDistinctField=data.distinctField || config.oriDistinctField;
        config.queryItems=data.queryItems || config.queryItems;
        config.query_kind=data.query_kind?data.query_kind.join(','):config.query_kind;
        config.params=data.limitCond?data.limitCond.params:config.params;
        config.oriLimitCond=data.limitCond || config.oriLimitCond;
        config.selConds=data.selConds || config.selConds;
        config.remoteInterface=data.remoteInterface || config.remoteInterface;//远程接口
        if(data.indexs){
            let tempIndexs=[];
            for(let index of data.indexs){
                let tempArr=[];
                for(let item of index){
                    tempArr.push(item.alias|| (item.tableKey+'@_@'+item.key));
                }
                tempIndexs.push(tempArr.join(','));
            }
            config.indexs=tempIndexs;
            config.oriIndexs=data.indexs;
        }
    },
    [types.SET_ORDER_FIELD](state,data){
        let orderFields=[];//排序字段数组
        let groupFileds=[];//组合的字段
        let extraFileds=[];//额外的字段
        let tempFileds=[];//临时转换字段
        let oriFields=[];//原生字段
        if(!state.curMenu){return;}

        for(let filed of data)
        {
            let fieldType=filed.fieldType || '0';
            let newF={};
            switch(fieldType){
                case '0'://普通字段
                    newF.name=filed.showName || filed.name;
                    newF.key=filed.key;
                    newF.table=filed.tableKey;
                    newF.tableName=filed.tableName;
                    newF.alias=newF.table+'_'+newF.key;
                    newF.format=filed.Format_express || filed.Format_group_express || '';
                    newF.formatType=filed.formatType || 0;
                    newF.keyName=filed.keyName;
                    newF.blnShow=filed.blnShow || 0;
                    newF.columnW=filed.columnW || '';
                    newF.pop_title=filed.pop_title || '';//提示信息字段

                    newF.blnShow || orderFields.push(newF);
                    tempFileds.push(newF);
                    oriFields.push(filed);
                    break;
                case '1'://格式化字段
                    newF.name=filed.showName || filed.name;
                    newF.key=filed.key;
                    newF.table=filed.tableKey;
                    newF.tableName=filed.tableName;
                    newF.alias=newF.table+'_'+newF.key;
                    newF.format=filed.Format_express || filed.Format_group_express || '';
                    newF.format=newF.format?tool.format(newF.format,'{'+newF.alias+'}'):newF.format;
                    newF.formatType=filed.formatType || 0;
                    newF.keyName=filed.keyName;
                    newF.blnShow=filed.blnShow || 0;
                    newF.columnW=filed.columnW || '';
                    newF.pop_title=filed.pop_title || '';//提示信息字段

                    newF.blnShow || orderFields.push(newF);
                    tempFileds.push(newF);
                    oriFields.push(filed);
                    break;
                case '2'://组合字段
                    newF.name=filed.showName || filed.name;
                    newF.key=filed.key;
                    newF.table=filed.tableKey || '';
                    newF.alias=newF.key || '';
                    newF.format=filed.Format_express || filed.Format_group_express || '';
                    newF.format=newF.format?tool.formatFunc(newF.format,(res)=>{return'{'+res.replace('.','_')+'}'}):newF.format;
                    newF.formatType=filed.formatType || 0;
                    newF.keyName=filed.keyName;
                    newF.blnShow=filed.blnShow || 0;
                    newF.columnW=filed.columnW || '';
                    newF.pop_title=filed.pop_title || '';//提示信息字段
                    
                    newF.blnShow || orderFields.push(newF);
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
                    newF.table=filed.tableKey;
                    newF.tableName=filed.tableName;
                    newF.alias=newF.table+'_'+newF.key;
                    newF.format=filed.Format_express || filed.Format_group_express || '';
                    newF.formatType=4;//这里要特殊处理下
                    newF.keyName=filed.keyName;
                    newF.blnShow=filed.blnShow || 0;
                    newF.columnW=filed.columnW || '';
                    newF.pop_title=filed.pop_title || '';//提示信息字段

                    newF.blnShow || orderFields.push(newF);
                    tempFileds.push(newF);
                    oriFields.push(filed);
                    break;
                
            }
        }

        state.curMenu.condtionsObj.show_fields=orderFields;
        state.curMenu.condtionsObj.query_fields=tempFileds.concat(extraFileds);

        //设置提示字段(如果该字段没有被选中则需要程序手动添加到查询字段中去)
        for(let f of tempFileds){
            if(!f['pop_title']) continue;
            for(let table of state.tables){
                let filed = table.fields[f['pop_title']];
                if(!filed)continue;
                let newField={};
                newField.name=filed.showName || filed.name;
                newField.key=filed.key;
                newField.table=filed.tableKey;
                newField.tableName=filed.tableName;
                newField.alias=newField.table+'_'+newField.key;
                newField.format=filed.Format_express || filed.Format_group_express || '';
                newField.formatType=filed.formatType || 0;
                newField.keyName=filed.keyName;
                newField.blnShow=filed.blnShow || 0;
                newField.columnW=filed.columnW || '';
                newField.pop_title=filed.pop_title || '';//提示信息字段

                //判断该字段是否已经被选中为要显示的字段(被选中则不需要添加)
                let blnContain =_.chain(state.curMenu.condtionsObj.query_fields).pluck('alias').contains(newField.alias).value();
                if(blnContain)continue;
                state.curMenu.condtionsObj.query_fields.push(newField);
            }
        }

        //设置默认附加字段(唯一标识符字段)
        for(let table of state.tables){
           let primeKey = table['primeKey'];
           if(!primeKey)continue;
           let filed = table.fields[primeKey];
           if(!filed)continue;
           let newField={};
           newField.name=filed.showName || filed.name;
           newField.key=filed.key;
           newField.table=filed.tableKey;
           newField.tableName=filed.tableName;
           newField.alias=newField.table+'_'+newField.key;
           newField.format=filed.Format_express || filed.Format_group_express || '';
           newField.formatType=filed.formatType || 0;
           newField.keyName=filed.keyName;
           newField.blnShow=filed.blnShow || 0;
           newField.columnW=filed.columnW || '';
           newField.pop_title=filed.pop_title || '';//提示信息字段

           //判断该字段是否已经被选中为要显示的字段(被选中则不需要添加)
           let blnContain =_.chain(state.curMenu.condtionsObj.query_fields).pluck('alias').contains(newField.alias).value();
           if(blnContain)continue;
           state.curMenu.condtionsObj.query_fields.push(newField);
        }

        //设置默认模板字段(路径模板情况下:需要默认添加日期字段否则展示时会因缺少日期字段而造成显示问题)
        if(state.curMenu.condtionsObj.templateNum==tempType['地图路径'].id){
           let param = state.curMenu.condtionsObj.tmpParam[tempType['地图路径'].id][0];
           let filed = table.fields[param];
           if(filed){
                let newField={};
                newField.name=filed.showName || filed.name;
                newField.key=filed.key;
                newField.table=filed.tableKey;
                newField.tableName=filed.tableName;
                newField.alias=newField.table+'_'+newField.key;
                newField.format=filed.Format_express || filed.Format_group_express || '';
                newField.formatType=filed.formatType || 0;
                newField.keyName=filed.keyName;
                newField.blnShow=filed.blnShow || 0;
                newField.columnW=filed.columnW || '';
                newField.pop_title=filed.pop_title || '';//提示信息字段
                //判断该字段是否已经被选中为要显示的字段(被选中则不需要添加)
                let blnContain =_.chain(state.curMenu.condtionsObj.query_fields).pluck('alias').contains(newField.alias).value();
                if(!blnContain){
                    state.curMenu.condtionsObj.query_fields.push(newField);
                }
           }
        }

        //设置关联字段(有些字段的数据需要其他字段存在的情况下才会有，因此如果该关联字段没有被选中则需要字段添加该字段)
        let relativeFields=_.filter(data,d=>d.for) || [];
        for(let field of relativeFields){
            let relativeKey=field.for.split(',') || [];
            if(relativeKey.length<=0)continue;
            for(let key of relativeKey){
                for(let table of state.tables){
                    let filed = table.fields[key];
                    if(!filed)continue;
                    let newField={};
                    newField.name=filed.showName || filed.name;
                    newField.key=filed.key;
                    newField.table=filed.tableKey;
                    newField.tableName=filed.tableName;
                    newField.alias=newField.table+'_'+newField.key;
                    newField.format=filed.Format_express || filed.Format_group_express || '';
                    newField.formatType=filed.formatType || 0;
                    newField.keyName=filed.keyName;
                    newField.blnShow=filed.blnShow || 0;
                    newField.columnW=filed.columnW || '';
                    newField.pop_title=filed.pop_title || '';//提示信息字段

                    //判断该字段是否已经被选中为要显示的字段(被选中则不需要添加)
                    let blnContain =_.chain(state.curMenu.condtionsObj.query_fields).pluck('alias').contains(newField.alias).value();
                    if(blnContain)continue;
                    state.curMenu.condtionsObj.query_fields.push(newField);
                }
            }
        }

        //console.log(state.orderFields);
        //转化字段到对应的数据源下
        let selFields={},objFields={};
        for(let field of oriFields){
            selFields[field.tableKey]=selFields[field.tableKey] || {name:field.tableName,fields:[]};
            selFields[field.tableKey].fields.push(field);
            objFields[field.tableKey+'_'+field.key]=1;
        }

        state.fieldDataChange.next({selFields:selFields,objFields:objFields,showFields:orderFields});
    },
};

const actions={
    [types.Date_Source]({commit}){
         return  new Promise((resolve, reject) => {
            // let menus={'基础库':
            // {name:'基础库',
            //  isRemote:true,
            //  icon:'fa fa-road',
            //  tables:{
            //      '测试数据源1':{
            //          name:'测试数据源1',key:'table1',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',
            //          indexFields:{
            //                 requisite: ["name,depart", "name1,depart1", "name2"],
            //                 notRequisite: ["depart2"]
            //          },
            //          fields:{
            //             name:{name:'姓名',key:'name',desc:'描述用户的名字',type:'4',defval:2,referval:[{name:'小王',value:1},{name:'小张',value:2}]},
            //             depart:{name:'部门',key:'depart',desc:'描述用户所在部门位置'},
            //             name1:{name:'年龄',key:'name1',desc:'描述用户的名字'},
            //             depart1:{name:'生日',key:'depart1',desc:'描述用户所在部门位置'},
            //             name2:{name:'姓名',key:'name2',desc:'描述用户的名字'},
            //             depart2:{name:'部门',key:'depart2',desc:'描述用户所在部门位置'},
            //          },
            //          action:{
            //                 add:{
            //                         name: "添加",
            //                         initVal: false,    
            //                         fields: ["name", "depart", "name1", "depart1", "name2", "depart2"]
            //                 },
            //                 update: {
            //                         name: "修改", 
            //                         initVal: true,
            //                         fields: ["name", "depart", "name1", "depart1", "name2", "depart2"]
            //                 },
            //                 del:{
            //                         name: "删除",
            //                         fields: []
            //                 },
            //                 detail:{
            //                         name:'详细'
            //                 }
            //         },
            //         primeKey: "name"
            //       },
            //      '测试数据源2':{name:'测试数据源2',key:'table2',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',fields:{
            //             name:{name:'姓名',key:'name',desc:'描述用户的名字',type:'4',defval:2,referval:[{name:'小王',value:1},{name:'小张',value:2}]},
            //             depart:{name:'部门',key:'depart',desc:'描述用户所在部门位置'},
            //             name1:{name:'年龄',key:'name1',desc:'描述用户的名字'},
            //             depart1:{name:'生日',key:'depart1',desc:'描述用户所在部门位置'},
            //             name2:{name:'姓名',key:'name2',desc:'描述用户的名字'},
            //             depart2:{name:'部门',key:'depart2',desc:'描述用户所在部门位置'},
            //      },
            //      action:{
            //                 add:{
            //                         name: "添加",
            //                         initVal: false,    
            //                         fields: ["name", "depart", "name1", "depart1", "name2", "depart2"]
            //                 },
            //                 update: {
            //                         name: "修改", 
            //                         initVal: true,
            //                         fields: ["name", "depart", "name1", "depart1", "name2", "depart2"]
            //                 },
            //                 del:{
            //                         name: "删除",
            //                         fields: []
            //                 }
            //         },
            //         primeKey: "name"
            //     },
            //      '测试数据源3':{name:'测试数据源3',key:'table3',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',fields:[]},
            //      '测试数据源4':{name:'测试数据源4',key:'table4',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',fields:[]},
            //      '测试数据源5':{name:'测试数据源5',key:'table5',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',fields:[]},
            //      '测试数据源6':{name:'测试数据源6',key:'table6',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',fields:[]},
            //      '测试数据源7':{name:'测试数据源7',key:'table7',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',fields:[]},
            //      '测试数据源8':{name:'测试数据源2',key:'table22',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',fields:[]},
            //      '测试数据源9':{name:'测试数据源3',key:'table23',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',fields:[]},
            //      '测试数据源10':{name:'测试数据源4',key:'table24',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',fields:[]},
            //      '测试数据源11':{name:'测试数据源5',key:'table25',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',fields:[]},
            //      '测试数据源12':{name:'测试数据源6',key:'table26',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',fields:[]},
            //      '测试数据源13':{name:'测试数据源7',key:'table27',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',fields:[]},
            //      '测试数据源14':{name:'测试数据源2',key:'table22',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',fields:[]},
            //      '测试数据源15':{name:'测试数据源3',key:'table23',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',fields:[]},
            //      '测试数据源16':{name:'测试数据源4',key:'table24',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',fields:[]},
            //      '测试数据源17':{name:'测试数据源5',key:'table25',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',fields:[]},
            //      '测试数据源18':{name:'测试数据源6',key:'table26',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',fields:[]},
            //      '测试数据源19':{name:'测试数据源7',key:'table27',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',fields:[]}
                 
            //  },
            //  desc:'一些常用的数据展示库,通常用来组合成新的数据源的库'},
            // '基础库2':{name:'基础库2',
            //  icon:'fa fa-s15',
            //   tables:{
            //      '测试数据源1':{name:'测试数据源1',key:'table8',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',fields:[
            //          {name:'姓名',key:'name1',desc:'描述用户的名字'},
            //          {name:'部门',key:'depart1',desc:'描述用户所在部门位置'},
            //          {name:'姓名',key:'name2',desc:'描述用户的名字'},
            //          {name:'部门',key:'depart2',desc:'描述用户所在部门位置'},
            //          {name:'姓名',key:'name3',desc:'描述用户的名字'},
            //          {name:'部门',key:'depart3',desc:'描述用户所在部门位置'},
            //          {name:'部门',key:'depart4',desc:'描述用户所在部门位置'},
            //          {name:'姓名',key:'name4',desc:'描述用户的名字'},
            //          {name:'部门',key:'depart5',desc:'描述用户所在部门位置'}
            //      ]},
            //      '测试数据源2':{name:'测试数据源2',key:'table9',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',fields:[]},
            //      '测试数据源3':{name:'测试数据源3',key:'table10',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',fields:[]},
            //      '测试数据源4':{name:'测试数据源4',key:'table11',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',fields:[]},
            //      '测试数据源5':{name:'测试数据源5',key:'table12',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',fields:[]},
            //      '测试数据源6':{name:'测试数据源6',key:'table13',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',fields:[]},
            //      '测试数据源7':{name:'测试数据源7',key:'table14',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',fields:[]},
            //      '测试数据源7':{name:'测试数据源8',key:'table14',desc:'测试专用数据源,用来呈现UI帮助开发人员更好更直观的关系界面',fields:[]}
            //   },
            //  desc:'一些常用的数据展示库,通常用来组合成新的数据源的库'},
            // '基础库3':{name:'基础库3',icon:'fa fa-send',desc:'一些常用的数据展示库,通常用来组合成新的数据源的库'},
            // '基础库4':{name:'基础库4',icon:'fa fa-share-alt',desc:'一些常用的数据展示库,通常用来组合成新的数据源的库'},
            // '基础库5':{name:'基础库5',icon:'fa fa-shield',desc:'一些常用的数据展示库,通常用来组合成新的数据源的库'}}
            
            // resolve(menus);
            //     return;

             ser.dataSource().then(res=>{
                 let data=res.biz_body.mappingTable || {dbs:{}};
                 resolve(data);
             });
         });
    },
    [types.Create_Operate]({commit},data){
        return new Promise((resolve,reject)=>{
            ser.createOperate(data).then(res=>{
                resolve(res);
            });
        });
    },
    [types.Update_Operate]({commit},data){
        return new Promise((resolve,reject)=>{
            ser.updateOperate(data).then(res=>{
                resolve(res);
            });
        });
    },
    [types.Set_Operate]({commit},data){
        return new Promise((resolve,reject)=>{
            ser.setOperate(data).then(res=>{
                resolve(res);
            });
        });
    },
    [types.Get_Operate]({commit},keyid){
        return new Promise((resolve,reject)=>{
            ser.getOperate({keyid:keyid || ''}).then(res=>{
                resolve(res);
            });
        });
    },
    [types.get_OPerate_Data]({commit},data){
        data=data || {};
        return new Promise((resolve,reject)=>{
            ser.getOperateData({interface:data.interface || '',
                                keyid:data.keyid || '',
                                extraData:data.extraData || {},
                                indexFields:data.indexFields || [],
                                condtionsObj:data.condtionsObj || {},
                                ditu:data.ditu || {},
                                time:!data.startTime?'':{startTime:data.startTime,endTime:data.endTime}
                            }).then(res=>{
                resolve(res);
            });
        });
    }
};



export default{
    state,
    mutations,
    actions
}