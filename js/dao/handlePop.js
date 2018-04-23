// 操作弹窗(主要处理具体数据源下配置的增删改导出等一系列特殊操作)

import './handlePop.css'
import cInput from 'components/Input.vue'
import {AddData,UpdateData,DelData,ExportData} from '../../store/mutation-types'
import {separator as sep} from '../../enum/sepHolder.js'
import MapDot from 'components/MapDot'

class _option{
    constructor(data,option,row,fields,store,keyid,list,queryKind,queryCond,inter,menu,source){
        this.data=data||{};
        this.option=option || {};
        this.row=row || {};
        this.fields=fields || [];
        this.store=store;
        this.keyid=keyid;
        this.list=list;
        this.queryKind=queryKind;
        this.queryCond=queryCond || {};
        this.inter=inter || '';
        this.menu=tool.Clone(menu || {});
        this.source=_.chain(source || {}).pluck('tables').value() || [];
        this.source=_.extend({},...this.source); 
        this.loading=()=>{$('#loading_pop_g').show();};
        this.hideLoad=()=>{$('#loading_pop_g').hide();};
        
    }

    //新增弹出窗
    addPop(){
        let self=this,
            selFields=_.chain(_.map(self.data.value.val,(item)=>{
                let tableKey=item._tableKey;
                return _.map(item.fields,(key)=>{
                    return tableKey+sep+key;
                });
            })).flatten().value(),//self.data.value.fields,
            //tableKey=self.data.value._tableKey,
            queryFields=this.fields,
            store=this.store,
            keyid=this.keyid,
            list=this.list,
            source=this.source,
            queryKind=this.queryKind;
        tool.open(function(){
            let contextData=_.object(selFields,_.map(selFields,()=>{return '';}));
        
            let html=`
                ${
                    _.map(selFields,(field)=>{
                         let mapField = _.find(queryFields,(qf)=>{return qf.key==field.split(sep)[1] && qf.table==field.split(sep)[0];});
                         let vaild=source[field.split(sep)[0]].fields[field.split(sep)[1]].verification || {};
                         

                         return `<div><cInput ref="${field.split(sep)[1]}"
                                              :label="'${mapField.name}'" 
                                              :require="${vaild.require}" 
                                              reg="${vaild.reg || ''}"
                                              tip="${vaild.tip}" 
                                              @change="change"
                                              :extra="'${field}'" /></div>`
                    }).join('')
                 }
                 <div style="text-align: right;margin-top: 10px;">
                    <button type="button" class="btn btn-success" @click="ok_btn()">确定</button>
                    <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
                 </div>
            `;
            
            let param = {
                title:'添加操作',
                area:'600px',
                content:`<div class="handlePop_addPop" >${html}</div>`,
                components:{cInput},
                context:_.extend(contextData,{
                    ok_btn(){
                        //判断是否验证成功
                        let blnValid =!_.contains(_.map(param.$refs,p=>{
                            if(!p.Valid)return true; 
                            return p.Valid();
                        }),false);

                        if(!blnValid) return;
                       
                        let data=param.selfData;
                        let res = _.map(selFields,(field)=>{
                            return {field:queryKind!='show'?field.split(sep)[0]+'_'+field.split(sep)[1]:field.split(sep)[1],value:data[field]};
                        });
                        self.loading();
                       
                        store.dispatch(AddData,{interface:self.inter,keyid:keyid,values:res}).then(res=>{
                            self.hideLoad();
                            if(res.msg.code!='successed'){return;}
                            tool.info('新增成功!');
                            list.unshift(res.biz_body[0]);
                            param.close();
                        });
                    },
                    cancel_btn(){
                        param.close();
                    },
                    change(val,field){
                        param.selfData[field]=val;
                    },
                })
            };

            return param;
        }());
    }

    //修改弹出窗
    updatePop(){
        let self=this,
            selFields=_.chain(_.map(self.data.value.val,(item)=>{
                let tableKey=item._tableKey;
                return _.map(item.fields,(key)=>{
                    return tableKey+sep+key;
                });
            })).flatten().value(),//self.data.value.fields,
            //tableKey=self.data.value._tableKey,
            primeKey=_.map(self.data.value.val,(item)=>{
                return item._primeKey;
            }),//self.data.value._primeKey,
            queryFields=this.fields
            row=this.row,
            store=this.store,
            keyid=this.keyid,
            list=this.list,
            source=this.source,
            queryKind=this.queryKind;
        tool.open(function(){
            let contextData=_.object(selFields,_.map(selFields,()=>{return '';}));
            let html=`
                ${
                    _.map(selFields,(field)=>{
                         let mapField = _.find(queryFields,(qf)=>{return qf.key==field.split(sep)[1] && qf.table==field.split(sep)[0];});
                         let mapKey=queryKind!='show'?field.split(sep)[0]+'_'+field.split(sep)[1]:field.split(sep)[1];
                         let vaild=source[field.split(sep)[0]].fields[field.split(sep)[1]].verification || {};

                         return `<div><cInput ref="${field.split(sep)[1]}"
                                              :label="'${mapField.name}'"
                                              :require="${vaild.require}" 
                                              reg="${vaild.reg || ''}"
                                              tip="${vaild.tip}"  
                                              @change="change" :extra="'${field}'" 
                                              :val="'${row[mapKey]}'" /></div>`
                    }).join('')
                 }
                 <div style="text-align: right;margin-top: 10px;">
                    <button type="button" class="btn btn-success" @click="ok_btn()">确定</button>
                    <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
                 </div>
            `;
            
            let param = {
                title:'修改操作',
                area:'600px',
                content:`<div class="handlePop_addPop" >${html}</div>`,
                components:{cInput},
                context:_.extend(contextData,{
                    ok_btn(){
                        //判断是否验证成功
                        let blnValid =!_.contains(_.map(param.$refs,p=>{
                            if(!p.Valid)return true; 
                            return p.Valid();
                        }),false);

                        if(!blnValid) return;

                        let data=param.selfData;
                        let res = _.map(selFields,(field)=>{
                            return {field:queryKind!='show'?field.split(sep)[0]+'_'+field.split(sep)[1]:field.split(sep)[1],value:data[field]};
                        });
                        //修改前数据项的值
                        let beforeVals=_.map(selFields,(field)=>{
                            let mapKey=queryKind!='show'?field.split(sep)[0]+'_'+field.split(sep)[1]:field.split(sep)[1];
                            return {field:queryKind!='show'?field.split(sep)[0]+'_'+field.split(sep)[1]:field.split(sep)[1],value:row[mapKey]};
                        });

                        let mapPrimeKey=queryKind!='show'?field.split(sep)[0]+'_'+primeKey[0]:primeKey[0];
                        
                        self.loading();
                        store.dispatch(UpdateData,{interface:self.inter,keyid:keyid,values:res,beforeValues:beforeVals,prime_key:row[mapPrimeKey]}).then(result=>{
                            self.hideLoad();
                            if(result.msg.code!='successed'){return;}
                            tool.info('修改成功!');
                            _.each(res,item=>{
                                row[item.field]=item.value;
                            });

                            param.close();
                        });
                    },
                    cancel_btn(){
                        param.close();
                    },
                    change(val,field){
                        param.selfData[field]=val;
                    }
                })
            };

            return param;
        }());
    }
    //导出弹出窗
    exportPop(){
        let setting=this.data.value.val[0],conditions=setting.condition,keyid=this.keyid,queryCond=this.queryCond,store=this.store,self=this;
        tool.open(function(){
            let contextData={};
            let extractData={};
            let html=`${
                 _.map(conditions,(cond,key)=>{
                    contextData[key]='';
                    let valid =cond.condition?JSON.stringify(cond.condition):'';
                    let value=cond.value;
                    if(valid){
                        return `<div><cInput :label="'${cond.name}'" @change="change" :extra="'${key}'" :valid='${valid}' /></div>`
                    }else if(tool.isArray(value)){
                        extractData[key+'val']=value;
                        return  `
                            <div class="form-group clearfix">
                                <div class="col-sm-3" style="padding:0px; text-align:center;margin-top: 10px;">${cond.name}</div>
                                <div class="col-sm-9">
                                    <el-select v-model="${key}" placeholder="请选择">
                                        <el-option
                                            v-for="val in ${key+'val'}"
                                            :label="val"
                                            :value="val">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                        `
                    }else if(value){
                        return `<div><cInput :label="'${cond.name}'" @change="change" :extra="'${key}'" :val="'${value}'" /></div>`
                    }
                 }).join('')
                }
                <div style="text-align: right;margin-top: 10px;">
                    <button type="button" class="btn btn-success" @click="ok_btn()">确定</button>
                    <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
                 </div>
            `;

            let param={
                title:'导出操作',
                area:'600px',
                content:`<div class="handlePop_exportPop" >${html}</div>`,
                components:{cInput},
                context:_.extend(extractData,contextData,{
                    ok_btn(){
                        let param_data={keyid:keyid};
                        _.each(contextData,(val,key)=>{
                            param_data[key]=param.selfData[key]
                        });

                        param_data['params']=queryCond.com;
                        param_data['indexFields']=queryCond.sep;
                        param_data['interface']=self.inter;
                        self.loading();
                        store.dispatch(ExportData,param_data).then(res=>{
                            self.hideLoad();
                            if(res.msg.code!='successed'){return;}
                            let url=res.biz_body.url;
                            window.location=url;
                            param.close();
                        });
                    },
                    cancel_btn(){
                        param.close();
                    },
                    change(val,field){
                        param.selfData[field]=val;
                    }
                })
            };


            return param;
        }());
    }
    //删除操作
    delOption(){
        let self=this,
            keyid=this.keyid,
            queryKind=this.queryKind,
            row=this.row,
            store=this.store,
            list=this.list,
            tableKey=this.data.value.val[0]._tableKey,
            primeKey=this.data.value.val[0]._primeKey;
        let mapPrimeKey=queryKind!='show'?tableKey+'_'+primeKey:primeKey;

        tool.confirm('您确定要删除该条信息吗?',['确定','取消'],()=>{
            self.loading();
            store.dispatch(DelData,{interface:self.inter,keyid:keyid,prime_key:row[mapPrimeKey]}).then(res=>{
                self.hideLoad();
                if(!tool.msg(res,'删除成功!','删除失败!')){return;}
                let rowIndex=-1;
                for(let i=0;i<list.length;i++){
                    if(list[i][mapPrimeKey]==row[mapPrimeKey]){
                        rowIndex=i;break;
                    }
                }
                list.splice(rowIndex,1);
            });
        },function(){});
    }

    //详细操作
    detailPop(){
        console.log('详细操作');
    }

    //地图路径
    mapPath(){
        let s=this;
        tool.open(function(){
            let html=`<MapDot :data="menu" :store="store" ref="mapDot" :blnPath="true"  />`;
            let layerIndex=-1;
            let blnFull=true;
            let resizeListen= Fx.SingleBind('resize',$(window), (e)=> {
                let wH = $(window).height();
                let wW = $(window).width();
                if(!blnFull){
                    setTimeout(()=>{
                        layer.style(layerIndex, {
                            left: `${(wW-800)>0?(wW-800)/2:0}px`,
                            top: `${(wH-600)>0?(wH-600)/2:0}px`
                        });    
                    },100);
                }else{
                    layer.style(layerIndex, {
                        width: `${wW}px`,
                        height: `${wH}px`
                    });    
                }
                
            });

            //构建额外的限定条件
            let extraConditon=[],row=s.row;
            if(s.data.mapFields.length>0){
                extraConditon=extraConditon || [];
                for(let field of s.data.mapFields){
                    extraConditon.push({filed:{
                            table:field.target.tableKey,
                            key:field.target.fieldKey,
                            alias:field.target.key,
                            value:row[field.source.fieldKey] || row[field.source.tableKey] || row[field.target.fieldKey]
                        },
                        value:row[field.source.fieldKey] || row[field.source.tableKey] || row[field.target.fieldKey]
                    });
                }
            }
            s.menu.extraConditon=extraConditon;
            
            let param={
                title:'地图路径',
                area:['800px','600px'],
                initMaxMin:true,
                maxmin: true,
                offset: ['0px', '0px'],
                content:`<div class="mapPath_pop" style="width:100%;height:100%;">${html}</div>`,
                components:{MapDot},
                context:{
                    menu:s.menu,
                    store:s.store
                },
                success(layero,index){
                    layerIndex=index;
                    setTimeout(()=>{
                        param.$refs.mapDot.init();
                        param.$refs.mapDot.refreshPage();
                    },1000);
                },
                full(){
                    blnFull=true;
                    setTimeout(()=>{
                       // param.$refs.mapDot.refreshMap();
                    },200);
                },
                restore(e,index){
                    blnFull=false;
                    let wH = $(window).height();
                    let wW = $(window).width();
                    layer.style(index, {
                        left: `${(wW-800)>0?(wW-800)/2:0}px`,
                        top: `${(wH-600)>0?(wH-600)/2:0}px`
                    });  
                    
                    //param.$refs.mapDot.panCenter();
                }
            };

            return param;
        }());
    }
}

module.exports={
    /**
     * 
     * @param {增删改查导出等操作数据} data 
     * @param {弹出窗体配置数据} option
     * @param {行数据} row 
     * @param {列表查询字段} fields
     * @param {数据操作对象} store
     * @param {菜单ID} keyid
     * @param {列表数据} list
     * @param {查询类型} queryKind
     * @param {查询条件} queryCond
     * @param {远程数据条件} inter
     * @param {菜单数据体} menu
     * @param {数据源} source
     */
    play(data,option,row,fields,store,keyid,list,queryKind,queryCond,inter,menu,source){
        let key=data.value._key || data.value.key;
        let o=new _option(data,option,row,fields,store,keyid,list,queryKind,queryCond,inter,menu,source);
        switch(key){
            case 'add'://新增
                o.addPop();
                break;
            case 'update'://修改
                o.updatePop();
                break;
            case 'del'://删除
                o.delOption();
                break;
            case 'export'://导出
                o.exportPop();
                break;
            case 'detail'://详细
                o.detailPop();
                break;
            case 'MapPath'://地图路径
                o.mapPath();
                break;
        }
    },
    /**
     * 转化操作图标(用于展示数据列中显示字段有哪些相关操作)
     */
    convertOptionIcon(source){
        if(!source) return {};
        let action = _.chain(source).pick('action').value().action;
        let fields = _.chain(source).pick('fields').value().fields;
        let res={};
        _.each(action,(val,key)=>{
           switch(key){
             case 'add': //新增
                _.each(val.fields,(field)=>{res[field]=res[field] || [];res[field].push({name:'新增',icon:'fa fa-plus'});})
              break;
             case 'update'://修改
                _.each(val.fields,(field)=>{res[field]=res[field] || [];res[field].push({name:'修改',icon:'fa fa-pencil'});})
              break;
             case 'del': //删除
                _.each(fields,(field,key)=>{res[key]=res[key] || [];res[key].push({name:'删除',icon:'fa fa-close'});})
              break;
             case 'export'://导出
                _.each(fields,(field,key)=>{res[key]=res[key] || [];res[key].push({name:'导出',icon:'fa fa-level-up'});})
              break;
             case 'detail'://详细
               _.each(fields,(field,key)=>{res[key]=res[key] || [];res[key].push({name:'详细',icon:'fa fa-file-text-o'});})
              break;
           }
        });
        return res;
    },
    /**
     * 获取数据源中具体字段操作内容(用于操作页面操作按钮设置中具体操作)
     * @param {菜单数据} menu
     * @param {所选数据源} tables 
     */
    getSourceAction(menu,tables){
        let selFields=menu.condtionsObj?menu.condtionsObj.query_fields:[];
        let tableKeys=_.chain(tables).pluck('key').value();
        let primeKeys=_.chain(tables).pluck('primeKey').value();
        let _actions=_.chain(tables).pluck('action').value();

        

        let tabelPrimeKeys = _.chain(_.object(tableKeys,primeKeys)).map((val,key)=>{
            return key+sep+val;
        }).flatten().value()

        let __actions=_.chain(_.object(tableKeys,_.chain(_.object(tabelPrimeKeys,_actions)).map((val,key)=>{
            return {[key]:val};
        }).flatten().value()));

        
        let res={};
        let actions=__actions.map((tableval,tablekey)=>{

            return _.map(tableval,(field,fieldkey)=>{

                return _.filter(_.map(field,(item,key)=>{
                     let tempItem=tool.Clone(item);
                     tempItem['_key']=key;
                     tempItem['_primeKey']=fieldkey.split(sep)[1];
                     tempItem['_tableKey']=tablekey;
                     let tempFields=[];
                     _.each(selFields,(field_)=>{
                        if(field_.table==tablekey && tempItem.fields && (','+tempItem.fields.join(',')+',').indexOf(','+field_.key+',')>=0){
                            tempFields.push(field_.key);
                        }
                     });
                     tempItem.fields=tempFields;
                     if((key=='add' || key=='update') && tempFields.length<=0){
                        //新增和修改的情况需要特别处理
                        return null;
                     }else{
                        return tempItem;
                     }
                }),(val)=>{return val!=null;});

            });
        }).flatten().each((val)=>{
            res[val._key]=res[val._key] || {name:val.name,_key:val._key,val:[]};
            res[val._key].val.push(val);
        });
        //console.log(tool.Clone(res));
        return res;
    }
}