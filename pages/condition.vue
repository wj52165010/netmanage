<!-- 设置条件页面 -->
<template>
    <div class="condition">
        <div name="basice_setting" class="content_item">
            <div class="content_item_title">
                <span class="title"><i class="fa fa-cog fa-fw title_icon"></i>基础设置</span>
            </div>
            <div class="content">
                <div class="form-group col-sm-2" style="width: 150px;">
                    <label >数据类型</label>
                    <div>
                        <el-button-group>
                            <el-button :type="dataKindComputed==0?'primary':'default'" @click="kind=['show'];limitCond={info:'',cGroups:[],conditions:[],selectConds:[],params:{}};selConds={};indexs=[];queryItems=[]">展示</el-button>
                            <el-button :type="dataKindComputed==1?'primary':'default'" @click="kind=['backtrack'];queryItems=[]">查询</el-button>
                        </el-button-group>
                    </div>
                </div>
                <div class="form-group col-sm-2" style="width: 200px;" v-show="dataKindComputed==1">
                    <label >查询类型</label>
                    <div>
                       <el-select v-model="kind" multiple placeholder="请选择">
                            <el-option
                                v-for="item in queryKind"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group col-sm-2" style="width:200px;">
                    <label >每页显示条数</label>
                    <div style="height:36px;">
                        <el-input-number v-model="limit" :min="1" :max="10000"></el-input-number>
                    </div>
                </div>
                <div class="form-group col-sm-2" style="width:300px;">
                    <label>排序字段</label>
                    <div>
                        <el-select v-model="sort_by" clearable placeholder="请选择">
                            <el-option-group
                            v-for="table in queryFields"
                            :label="table.name">
                            <el-option
                                v-for="field in table.fields"
                                :label="field.name"
                                :value="field">
                            </el-option>
                            </el-option-group>
                        </el-select>
                    </div>
                </div>
                <div class="form-group col-sm-2" style="width:123px;">
                    <label >是否降序</label>
                    <div>
                        <el-button-group>
                            <el-button :class="{active:is_desc}" @click="is_desc=true;">是</el-button>
                            <el-button :class="{active:!is_desc}"@click="is_desc=false;">否</el-button>
                        </el-button-group>
                    </div>
                </div>
                <div class="form-group col-sm-2 groupdrop" style="width:480px;">
                    <label >选择模板</label>
                    <div>
                        <el-button-group>
                            <el-select v-model="template" style="width:330px" multiple placeholder="请选择">
                                <el-option
                                v-for="item in templates"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button @click="preview_click()">预览</el-button>
                            <el-button :disabled="template.length<=1" @click="tag_setting()">配置</el-button>
                        </el-button-group>
                    </div>
                </div>
                <div class="form-group col-sm-2" style="width:200px;">
                    <label>关联页面</label>
                    <div>
                        <el-select v-model="realtiveMenu" clearable  placeholder="请选择">
                            <el-option
                                v-for="menu in menus"
                                :label="menu.name"
                                :value="menu.keyid">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group col-sm-2" style="width:200px;" v-if="remoteInters.length>0">
                    <label>远程数据</label>
                    <div>
                       <MulDropDwon :data="remoteInterface" keyProp="name" id="id">
                        <div class="remote_item" v-for="t in remoteInters" @mousedown="remoteitemClick(t)">{{t.name}}</div>
                       </MulDropDown>
                    </div>
                </div>
                <!--<div class="form-group col-sm-2" style="width:200px;">
                    <label>去重字段</label>
                    <div>
                        <el-select v-model="distinctField" placeholder="请选择">
                            <el-option-group
                            v-for="table in allTables"
                            :label="table.name">
                            <el-option
                                v-for="field in table.fields"
                                :label="field.name"
                                :value="field">
                            </el-option>
                            </el-option-group>
                        </el-select>
                    </div>
                </div>-->
                <div class="form-group col-sm-2" style="width:200px;" v-if="dataKindComputed!=0">
                    <label>去重字段</label>
                    <div>
                        <el-select v-model="distinctField" placeholder="请选择">
                            <el-option-group
                            v-for="table in queryFields"
                            :label="table.name">
                            <el-option
                                v-for="field in table.fields"
                                :label="field.name"
                                :value="field">
                            </el-option>
                            </el-option-group>
                        </el-select>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>
        </div>

        <div name="limit_setting" class="content_item" v-if="dataKindComputed==1">
            <div class="content_item_title">
                <span class="title"><i class="fa fa-sitemap title_icon"></i>限定条件</span>
                <div class="editer">
                    <el-tooltip class="item" effect="light" content="编辑" placement="top">
                        <i class="fa fa-pencil" @click="condition_edit()"></i>
                    </el-tooltip>
                </div>
            </div>
            <div class="limit_condition_content">{{limitCond.info}}</div>
        </div>
        <div name="query_setting" class="query_setting content_item">
            <div name="title_container" class="content_item_title">
                <span class="title"><i class="fa fa-search title_icon"></i>查询条件</span>
                <div class="editer">
                    <el-tooltip class="item" effect="light" content="新增" placement="top">
                       <i class="fa fa-plus" @click="query_edit()"></i>
                    </el-tooltip>
                    <el-tooltip class="item" effect="light" content="查询索引" placement="top" v-show="dataKindComputed==1">
                        <i class="fa fa-sliders" @click="query_index()"></i>
                    </el-tooltip>
                </div>
            </div>
            <div name="content_container" class="content">
                <div class="scrollContainer">
                    <div class="slidee">
                        <div name="field_container" class="gridly">
                            <div class="query_item" v-for="(item,index) in queryItems" :id="item.filed.tableKey+'_'+item.filed.key">
                                <div class="query_title">
                                    <el-tooltip class="item" effect="light" content="编辑" placement="top">
                                        <i class="fa fa-pencil" @mouseup="query_edit(item,index);blnNoHandle=true"></i>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="light" content="删除" placement="top">
                                        <i class="fa fa-close" @mouseup="query_del(item);blnNoHandle=true"></i>
                                    </el-tooltip>
                                </div>
                                <div class="query_item_content">
                                    <div class="query_content_item"><span class="title">名称</span>{{item.name}}</div>
                                    <div class="query_content_item"><span class="title">类型</span>{{queryTypeMap[item.type]}}</div>
                                    <div class="query_content_item"><span class="title">必填</span>{{item.blnRequried?'是':'否'}}</div>
                                    <div class="query_content_item"><span class="title">数据源</span>{{item.filed.tableName}}</div>
                                    <div class="query_content_item"><span class="title">字段</span>{{item.filed.name}}</div>
                                    <div class="query_content_item"><span class="title">默认值</span>{{covertDefVal(item)}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="scrollbar dataSource_scrollbar" v-show="blnShowQueryScorll">
                    <div class="handle"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import {Set_Conifg,Reg_Menu_Change_Even,BODY_RESIZE,Field_Change} from '../store/mutation-types'
import CFieldSet from '../components/FieldSet.vue'
import CondGroup from '../components/CondGroup.vue'
import OrderCheck from '../components/orderCheck.vue'
// import {tool} from '../js/tool.js'
import searchArrType from '../enum/SearchType.js'
import {dropVal as tempType} from '../enum/TempType.js'
import virtualIden from 'components/virtualIden'
import MulDropDwon from 'components/MulDropDown'
import Scroll from 'components/scroll'

//拖动插件相关库
import  '../../static/Gridly/jquery.gridly.css'
import  '../../static/Gridly/jquery.gridly.js'

let LimitParamFunc=null;
let recurGroup=null;//递归条件数组
export default {
  name: 'Condition',
  components:{MulDropDwon},
  data () {
    return {
      blnNoHandle:false,
      queryKind:[{name:'回溯',value:'backtrack'},{name:'监察',value:'monitor'}],
      queryScrollPluins:null,//查询容器滚动插件实例
      blnShowQueryScorll:false,//是否显示查询条件容器滚动条
      limit:200, //每页显示条数
      selConds:{},//限定条件选中的指定索引项
      limitCond:{info:'',cGroups:[],conditions:[],selectConds:[],params:{}},//限定条件表达式
      kind:[],//查询类型(backtrack:回溯;monitor:监察,show:'展示')
      sort_by:'',//排序字段
      is_desc:true,//排序方向(true:降序;false:升序)
      queryTypeMap:searchArrType,//查询类型映射1:文本框;2:日期;3:日期范围;4:下拉框
      queryItems:[],//查询项
      indexs:[],//设置的索引集合
      templates:tool.Clone(tempType),//[{label:'列表',value:1},{label:'图表',value:2},{label:'地图描点',value:3},{label:'地图路径',value:4}],
      template:[1],//模板类型,
      templateSet:{},//模板设置
      realtiveMenu:'',//关联菜单(显示在同一个页面)
      distinctField:null,//去重字段
      queryFields:[],//当前选中的查询字段
      remoteInterface:[],//远程接口
      sortInstance:null,//拖动插件实例
    }
  },
  watch:{
      config:{
          deep: true,
          handler: function (val, oldVal) { 
              this.$store.commit(Set_Conifg,this.config);
          }
      },
      indexs(){
        //展示情况下忽略索引
        if(!this.dataKindComputed){return;}
        let tempQuery=[];
        for(let indexArr of this.indexs){
            let tempIndexArr=[];
            for(let index of indexArr){
                for(let queryItem of this.queryItems){
                    if(queryItem.filed.tableKey==index.tableKey && queryItem.filed.key==index.key){
                        tempQuery.push(queryItem);
                    }
                }
            }
        }
        this.queryItems=tempQuery;
      },
      queryItems(){
         //重新计算查询容器高度并重置滚动插件
         this.$nextTick(()=>{
             this.SetQueryCH();
             this.loadGridly(true);
         });
      },
      limitCond:{
          deep:true,
          handler(){
              this.$nextTick(()=>{
                this.SetQueryCH();
              });
          }
      },
      dataKindComputed(){
          this.$nextTick(()=>{
            this.SetQueryCH();
          });
          
          if(this.dataKindComputed==0){
              //展示
              if(!this.selTables[0]){return;}
              let fields=this.selTables[0].fields,
                  primeKey=this.selTables[0].primeKey,
                  tableKey=this.selTables[0].key;
                  if(!fields[primeKey]){return;}
                
              fields[primeKey].tableKey= fields[primeKey].tableKey || tableKey;
              this.distinctField=fields[primeKey];
          }else{
              //查询
              //this.distinctField=0;
          }
      }
  },
  computed:mapState({
      //判断当前查询模式(展示/查询)
      dataKindComputed(){
        if(this.kind.length<=0)return -1;
        let blnShow=this.kind.join(',').indexOf('show')>=0;
        return blnShow?0:1;//0:展示,1:查询
      },
      selTables:state=>{
          return state.setting.tables;
      },
      //远程接口配置数据
      remoteInters:state=>{
        let tables=state.setting.tables;
        return _.chain(tables)
                .map(t=>t.remoteInterface || [])
                .flatten()
                .uniq(t=>{return t.id})
                .value();
      },
      virType:state=>{return state.VirType;},
      menus:state=>{
          let cruMenu= state.setting.curMenu,menus=state.setting.menus;
          let result=[];
          if(!cruMenu){return menus;}
          for(let menu of  menus){
            if(menu.keyid==cruMenu.keyid){continue;}
            result.push(menu);
          }
          return result;
      },
      showFields:state=>{
          return state.setting.curMenu;
      },
      //配置信息
      config(){
          return {
              limit:this.limit,
              limitCond:this.limitCond,
              query_kind:this.kind,
              sort_by:this.sort_by,
              is_desc:this.is_desc,
              queryItems:this.queryItems,
              indexs:this.indexs,
              template:this.template,
              templateSet:this.templateSet,
              realtiveMenu:this.realtiveMenu,
              distinctField:this.distinctField,
              selConds:this.selConds,
              remoteInterface:this.remoteInterface
          }
      }
  }),
  mounted(){
      //监听选择字段数据改变事件
      this.$store.commit(Field_Change,(res)=>{
         if(!this.kind.length && this.selTables.length>0){this.kind=['show'];}
         //判断当前数据源是否有设置描点的功能
         this.templates=tool.Clone(tempType);
         if(!_.find(this.selTables,table=>{ return table.is_longlat;})){
            this.templates=_.filter(this.templates,tmp=>{return tmp.value!=3;})
         }
         //判断单签数据源是否有设置路径的功能
         if(!_.find(this.selTables,table=>{ return table.mapTrack;})){
            this.templates=_.filter(this.templates,tmp=>{return tmp.value!=4;})
         }

          this.queryFields=res.selFields;
          //判断去重字段是否还存在
          if(this.distinctField && !res.objFields[this.distinctField.tableKey+'_'+this.distinctField.key]){this.distinctField=null;}
          
          //判断查询条件中关联字段是否存在
          let tempQItem=[],indexsField=Object.assign({},..._.chain(this.fieldByIndex()).values().pluck('fields').value());
          for(let queryItem of this.queryItems){
              //判断是否在已选字段中
              if(res.objFields[queryItem.filed.tableKey+'_'+queryItem.filed.key]){
                  tempQItem.push(queryItem);
              }
              //判断是否在索引字段中
              else if(indexsField[queryItem.filed.key]){
                  tempQItem.push(queryItem);
              }
          }
          this.queryItems=tempQItem;
          //判断建立的索引是否存在
          let tempIndexs=[];
          let tempIndexsObj={};
          for(let indexArr of this.indexs){
              let tempIndexArr=[];
              for(let index of indexArr){
                  if(res.objFields[index.tableKey+'_'+index.key]){tempIndexArr.push(index);tempIndexsObj[index.tableKey+'_'+index.key]=1}
              }
              if(tempIndexArr.length>0)tempIndexs.push(tempIndexArr);
          }
          this.indexs=tempIndexs;

          //递归分组条件
          recurGroup=function(group,tempIndexsObj,counter){
              if(!group){return;}
              if(!counter){return;}
              let hasObj={};

              let firstCount=tool.counter((blnHas)=>{
                  hasObj['first']=blnHas[0];
                  counter.exec(hasObj);
              });
              let secondCount=tool.counter((blnHas)=>{
                  hasObj['second']=blnHas[0];
                  counter.exec(hasObj);
              });

              let firstCond=group.firstVal,secondCond=group.scendtVal;
              if(firstCond && firstCond.type=='group'){
                let childCounter=tool.counter((obj)=>{
                    hasObj['first']=obj[0].first || obj[0].second;
                    if(!hasObj['first']){
                        group.scendtVal='';
                        group.term='';
                    }
                    counter.exec(hasObj);
                },2);
                recurGroup(firstCond,tempIndexsObj,childCounter);
              }else if(firstCond && firstCond.field){
                if(!tempIndexsObj[firstCond.field.tableKey+'_'+firstCond.field.key]){
                    group.firstVal='';firstCount.exec(false);
                }else{
                    firstCount.exec(true);
                }
              }else{
                group.firstVal='';
                firstCount.exec(false);
              }

              if(secondCond && secondCond.type=='group'){
                let childCounter=tool.counter((obj)=>{
                    hasObj['second']=obj[0].first || obj[0].second;
                    if(!hasObj['second']){
                        group.scendtVal='';
                        group.term='';
                    }
                    counter.exec(hasObj);
                },2);
                recurGroup(secondCond,tempIndexsObj,childCounter);
              }else if(secondCond && secondCond.field){
                if(!tempIndexsObj[secondCond.field.tableKey+'_'+secondCond.field.key]){
                    group.scendtVal='';secondCount.exec(false);
                }else{
                    secondCount.exec(true);
                }
              }else{
                group.scendtVal='';
                secondCount.exec(false);
              }
          };

        //   let tempGroup=[],tempGroupIndex=0;
         
        //   for(let group of this.limitCond.cGroups){
        //     let counter=tool.counter((obj)=>{
        //         let blnHas=obj[0].first || obj[0].second;
        //         if(blnHas){
        //             group.name='分组'+(++tempGroupIndex);
        //             tempGroup.push(group);
        //         }
        //     },2);
        //     recurGroup(group,tempIndexsObj,counter);
        //   }

        //   this.limitCond.cGroups=tempGroup;

        //   let conditions=[];
        //   for(let cond of this.limitCond.conditions){
        //     if(tempIndexsObj[cond.field.tableKey+'_'+cond.field.key]){conditions.push(cond);}
        //   }
        //   this.limitCond.conditions=conditions;

        //   let selectConds=[],selGroupIndex=0,selCondIndex=0;
        //   for(let cond of this.limitCond.selectConds){
        //     if(cond.type=='group'){
        //         let counter=tool.counter((obj)=>{
        //             let blnHas=obj[0].first || obj[0].second;
        //             if(blnHas){
        //                 cond.name='分组'+(++selGroupIndex);
        //                 selectConds.push(cond);
        //             }
        //         },2);
        //         recurGroup(cond,tempIndexsObj,counter);
        //         continue;
        //     }
        //     if(tempIndexsObj[cond.field.tableKey+'_'+cond.field.key]){
        //         cond.name='条件'+(++selCondIndex);
        //         cond.number=selCondIndex;
        //         selectConds.push(cond);
        //     }
        //   }
        //   this.limitCond.selectConds=selectConds;

          if(LimitParamFunc && this.limitCond.cGroups[0] && (this.limitCond.cGroups[0].firstVal || this.limitCond.cGroups[0].scendtVal)){
            let res={};
            LimitParamFunc(this.limitCond.cGroups[0] || {},res,true,this.limitCond.params);
            this.limitCond.info=res.pre()+res.cond+res.after();
          }

          //console.log(this.limitCond.cGroups);
      });

      //监听菜单数据改变事件
      this.$store.commit(Reg_Menu_Change_Even,(menu)=>{
            let config=menu.condtionsObj;
            if(config){
                this.kind=config.query_kind.split(',');
                this.limit=config.limit;
                this.limitCond=config.oriLimitCond;
                this.sort_by=config.ori_sort_by;
                this.is_desc=config.is_desc;
                this.indexs=config.oriIndexs;
                this.queryItems=config.queryItems;
                this.template=config.templateNum;
                this.templateSet=config.templateSet;
                this.realtiveMenu=config.realtiveMenu;
                this.distinctField=config.oriDistinctField;
                this.selConds=config.selConds;
                this.remoteInterface=config.remoteInterface || [];
            }else{
                this.kind=[];
                this.limit=10;
                this.limitCond={info:'',cGroups:[],conditions:[],selectConds:[],params:{}};
                this.sort_by='';
                this.is_desc=true;
                this.queryItems=[];
                this.indexs=[];
                this.template=[1];
                this.templateSet={};
                this.realtiveMenu='';
                this.distinctField=null;
                this.selConds={};
                this.remoteInterface=[];
            }

            this.$store.commit(Set_Conifg,this.config);
      });

    //设置查询条件容器高度
    this.SetQueryCH();
    this.$store.commit(BODY_RESIZE,()=>{
        this.SetQueryCH();
        this.loadGridly(true);
    });

  },
  methods:{
    //远程接口项单击事件
    remoteitemClick(d){
       if(_.findIndex(this.remoteInterface,t=>t.id==d.id)>=0)return;
       this.remoteInterface.push(d);
    },
    //加载字段拖动插件
    loadGridly(blnIm){
      let self=this;
       setTimeout(()=>{
          let el=$('div[name="field_container"]'),containerW=el.width();
          let columns =Math.floor((containerW-80)/(228));
          if(!this.sortInstance){
            this.sortInstance=el.gridly({gutter:10,base:228,columns:columns,callbacks:{
              reordered:(els)=>{
                  if(self.blnNoHandle){return self.blnNoHandle=false;}
                  setTimeout(()=>{
                    let tempArr=[];
                    for(let i=0;i<els.length;i++){
                        let obj = _.find(self.queryItems,s=>{return (s.filed.tableKey+'_'+s.filed.key)==$(els[i]).attr('id')});
                        if(!obj)continue;
                        if(_.find(tempArr,s=>{
                            return (s.filed.tableKey+'_'+s.filed.key)==(obj.filed.tableKey+'_'+obj.filed.key)
                            }))continue;
                        tempArr.push(obj);
                    }

                    self.queryItems=[];
                    setTimeout(()=>{
                        self.queryItems=tempArr;
                        //console.log(tool.Clone(self.queryItems));
                    },0);
                  },400);
                // self.sortData=self.getDataObj(els);
                // self.$emit('triggerEvent','dataChange',self.sortData);
              }
            }});
          }else{
            this.sortInstance.settings.columns=columns;
            this.sortInstance.layout();
          }
        if(this.$parent.reloadSly){this.$parent.reloadSly();}
       },this.sortInstance && !blnIm?500:0);
    },
    //预览单击事件
    preview_click(){
        let fields=this.showFields.condtionsObj.show_fields;
        let btns=this.showFields.condtionsObj.field_btns;
        let html=`
        <el-table :data="[{},{},{},{}]" border stripe style="width: 100%;height:100%;">
            <el-table-column v-for="field in fields" inline-template   min-width="150px" :label="field.name">
                 <span>预览</span>
            </el-table-column>
            <el-table-column v-if="btns.length>0" align="center" :width="calOptionW(btns)" fixed="right" inline-template  label="操作" >
                <div class="option_btn_container">
                    <span class="option_btn" v-for="option in btns">{{option.name}}</span>
                </div>
            </el-table-column>
        </el-table>
                 `;
        tool.open(function(){
            let param = {
                title:'预览',
                area:['80%','300px'],
                content:`<div class="preview_pop" style="height:100%;">${html}</div>`,
                context:{
                   fields:fields,
                   btns:btns
                },
                methods:{
                    //计算操作栏宽度
                    calOptionW(options){
                        let width=36;
                        for(let option of options){
                            width+=option.name.length*20;
                        }
                        return width;
                    },
                }
            }
            return param;
        }());
    },
    //多模版显示状态下，配置各个模板之间关联操作(例如:描点模板需要列表模板某行被选中的情况才能被打开)
    tag_setting(){
        let s=this;
        let fields =this.showFields.condtionsObj.query_fields;

        let html=`
                    <div class="option_content">
                        <template v-for="(d,i) in data">
                            <div class="tag" @click="itemClick(d)">
                                    {{(i+1)}}.<i :class="d.icon" style="margin:0px 10px;"></i>{{d.label}}
                                    <i :class="{'fa fa-plus':!d.blnExpend,'fa fa-minus':d.blnExpend}" style="float:right;margin-top:10px;"></i>
                            </div>
                            <div class="setting_content" v-show="d.blnExpend">
                                <div class="row" style="margin:0px;border:1px solid #ebedee;border-top:none;line-height:30px;">
                                    <div class="col-md-2" style="border-right:1px solid #ebedee;">依赖项</div>
                                    <div class="col-md-10">
                                        <el-select v-model="d.rely" :clearable="true" placeholder="请选择">
                                            <el-option
                                            v-for="item in data.filter(r=>r.value!=d.value)"
                                            :label="item.label"
                                            :value="item">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </div>
                                <div class="row" style="margin:0px;border:1px solid #ebedee;border-top:none;line-height:30px;">
                                    <div class="col-md-2" style="border-right:1px solid #ebedee;">依赖字段</div>
                                    <div class="col-md-10">
                                        <el-select v-model="d.relyField" :clearable="true" placeholder="请选择">
                                            <el-option
                                            v-for="item in fields"
                                            :label="item.name"
                                            :value="item">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </div>
                                <div class="row" style="margin:0px;border:1px solid #ebedee;border-top:none;line-height:30px;">
                                    <div class="col-md-2" style="border-right:1px solid #ebedee;">提示信息</div>
                                    <div class="col-md-10">
                                        <input type="text" v-model="d.msg" style="width: 100%;border: none;outline: none;" />
                                    </div>
                                </div>
                            </div>
                        </template>
                        <div class="optionBar" style="text-align:right;padding-right:15px;">
                            <button type="button" class="btn btn-success" @click="submit_btn()">确定</button>
                            <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
                        </div>
                    </div>
                 `;
        let cTmpType=tool.Clone(tempType);
        tool.open(function(){
            let param = {
                title:'配置模板关联操作',
                area:'600px',
                content:`<div class="tagSetting_pop" style="height:100%;padding:10px;">${html}</div>`,
                context:{
                   data:_.map(s.template,r=>{
                       let item=_.find(cTmpType,t=>{return t.value==r});
                       item.blnExpend=false;
                       let relyId='',msg='';
                       _.each(s.templateSet,(t,key)=>{
                            _.each(t,c=>{
                               if(c.id==r){
                                relyId=key;
                                msg=c.msg;
                               }
                            })
                       })

                       item.rely=relyId?_.find(cTmpType,t=>{return t.value+''==relyId}):'';
                       item.relyField=relyId?_.find(fields,f=>f.alias==_.find(s.templateSet[relyId],t=>t.id=r).alias):'';
                       item.msg=msg;
                       return item;
                  }),//条件数据
                  fields:fields,//依赖字段集合
                },
                methods:{
                    //数据项单击事件
                    itemClick(d){
                        d.blnExpend=!d.blnExpend;
                    },
                    submit_btn(){
                        let data=param.selfData.data;
                        s.templateSet={};
                        for(let i=0;i<data.length;i++){
                            let d=data[i];
                            if(!d.rely || !d.relyField)continue;
                            s.templateSet[d.rely.value]=s.templateSet[d.rely.value] || [];
                            s.templateSet[d.rely.value].push({
                                id:d.value,
                                table:d.relyField.table,
                                key:d.relyField.key,
                                alias:d.relyField.alias,
                                msg:d.msg,
                                value:''
                            });
                        }
                        param.close();
                    },
                    cancel_btn(){
                        param.close();
                    }
                }
            }

            return param;
        }());
    },
    reloadSly(){
        setTimeout(()=>{
            this.SetQueryCH();
        },500);
    },
    //查询类型显示信息
    QueryShowInfo(val){
          let result='';
          switch(val){
              case 'backtrack': result='回溯';break;
              case 'monitor':result='监察';break;
          }
          return result;
    },
    //根据索引生成可选字段类型
    fieldByIndex(){
        let fieldKind={};
        //数据类型为查询
        if(this.dataKindComputed==1){
            for(let index of this.indexs){
                for(let field of index){
                    fieldKind[field.tableKey]=fieldKind[field.tableKey] || {name:field.tableName,fields:{}};
                    fieldKind[field.tableKey].fields[field.key]=field;
                }
            }
        }else if(this.dataKindComputed==0){//数据类型为展示
            let tables =this.selTables;
            for(let table of tables){
                let indexFields=table.indexFields, 
                requisite=(indexFields && indexFields.requisite) || [],
                notRequisite=(indexFields && indexFields.notRequisite) || [];

                for(let site in requisite){
                    let group=[];
                    let groupItems=requisite[site].split(',');
                    for(let field in groupItems){
                        let item =table.fields[groupItems[field]];
                        if(!item){continue;}
                        item.tableKey=table.key;
                        item.tableName=table.name;
                        fieldKind[item.tableKey]=fieldKind[item.tableKey] || {name:item.tableName,fields:{}};
                        fieldKind[item.tableKey].fields[item.key]=item;
                    }
                }

                for(let site in notRequisite){
                    let groupItem=notRequisite[site];
                    let item =table.fields[groupItem];
                    if(!item){continue;}
                    item.tableKey=table.key;
                    item.tableName=table.name;
                    fieldKind[item.tableKey]=fieldKind[item.tableKey] || {name:item.tableName,fields:{}};
                    fieldKind[item.tableKey].fields[item.key]=item;
                }
            }
        }
        return fieldKind;
    },
    //设置查询条件容器高度并初始化滚动插件
    SetQueryCH(){
        let dom=$(this.$el),totalH=dom.height(),
        basicDom=dom.find('div[name="basice_setting"]'),
        limitDom=dom.find('div[name="limit_setting"]'),
        queryDom=dom.find('div[name="query_setting"]'),
        query_title_dom=queryDom.find('div[name="title_container"]'),
        query_content_dom=queryDom.find('div[name="content_container"]'),
        basicH=basicDom.height(),
        limitH=limitDom.height() || 0;

        queryDom.height(totalH-basicH-limitH);
        query_content_dom.height(totalH-basicH-limitH-query_title_dom.height()-20);

        //设置滚动插件
        if(this.queryScrollPluins){this.queryScrollPluins.reload();this.blnShowQueryScorll=this.queryScrollPluins.rel.slideeSize>this.queryScrollPluins.rel.frameSize;return;}
        this.queryScrollPluins=new Sly($('.query_setting .content .scrollContainer'),{
            speed:200,
            scrollBy:200,
            scrollBar:'.query_setting .content > .dataSource_scrollbar',
            dragHandle:true,
            dynamicHandle:true
        });
        this.queryScrollPluins.init();
        this.blnShowQueryScorll=this.queryScrollPluins.rel.slideeSize>this.queryScrollPluins.rel.frameSize;

    },
    //查询类型选择(0:回溯;1;监察)
    selQueryKind(val){
        this.kind=val;
    },
    //转化默认值
    covertDefVal(data){
        //console.log(tool.Clone(data));
        if(this.queryTypeMap[data.type]=='日期'){
            if(!data.defVal){return data.defVal;}
            if((typeof data.defVal)=='string'){data.defVal=new Date(data.defVal)}
            return tool.DateFormat(data.defVal,'yyyy-MM-dd');
        }
        if(this.queryTypeMap[data.type]=='日期范围'){
            if(!data.defVal){return data.defVal;}
            if((typeof data.defVal[0])=='string'){data.defVal[0]=new Date(data.defVal[0])}
            if((typeof data.defVal[1])=='string'){data.defVal[1]=new Date(data.defVal[1])}
            let firstDate=data.defVal[0],secendDate=data.defVal[1];
            return tool.DateFormat(firstDate,'yyyy-MM-dd')+' - '+tool.DateFormat(secendDate,'yyyy-MM-dd');
        }
        if(this.queryTypeMap[data.type]=='下拉框'){//下拉框
           return data.dropVal.name;
        }

        return data.defVal;
    }, 
    //限定条件编辑   
    condition_edit(){
        let self=this;
        let html=`
        <div :id="id">
            
            <el-steps :space="80" :active="stepIndex" :align-center="true" style="text-align:center;">
                <el-step title="选择条件"></el-step>
                <el-step title="设置条件"></el-step>
                <el-step title="设置关系"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <div v-if="stepIndex==1">
                <div v-for="(item,index) in selTables" style="margin-bottom:5px;" v-if="getCondItem(item).length>0">
                    <div class="limitCondItem"><span class="title"><i class="icon fa fa-road item_0"></i></span>{{item.name}}</div>
                    <OrderCheck style="margin-right:10px;" v-for="(checkItems,index) in getCondItem(item)" :items="checkItems" :id="item.key+'@_@'+index" :res="selConds"></OrderCheck>
                </div>
                <div style="margin-bottom:5px;">
                    <div class="limitCondItem"><span class="title"><i class="fa fa-folder"></i></span>通用字段</div>
                     <OrderCheck style="margin-right:10px;" v-for="(checkItems,index) in getComomItem(selTables[0])" :items="checkItems" :id="'commonField'+'@_@'+index" :res="selConds"></OrderCheck>
                </div>
                <div style="text-align:right;"><button type="button" class="btn btn-default" @click="skipSetPage()">{{'下一步'}}</button></div>
            </div>
            <div v-if="stepIndex==2">
                <div>
                <div class="col-sm-6" v-for="(item,index) in conditions">
                        <div class="FieldSetItem">
                            <span class="number">{{index+1}}</span>
                            <CFieldSet class="fieldSetComp" :tables="tables" :data="item" @copy="copyCond"></CFieldSet>
                            <i class="fa fa-plus-circle addBtn" @click="addFieldSet" v-if="false"></i>
                            <i class="fa fa-times-circle closeBtn" @click="delFieldSet(index)" v-if="false"></i>
                        </div>
                </div>
                <div class="clearfix"></div>
                </div>
                <div style="float:right;padding:5px 0px;">
                    <button style="margin-right:10px;" type="button" class="btn btn-default" @click="preStep()">上一步</button>
                    <div style="text-align:right;float:right;"><button type="button" class="btn btn-default" @click="nextStep()">{{conditions.length<=1?'完成':'下一步'}}</button></div>
                </div>
            </div>
            <div v-if="stepIndex==3">
                <div class="relation_container">
                    <div name="FieldSetItem_condition_list" class="FieldSetItem_condition_list" :class="{blnPage:blnShowScrollbar}">
                        <div name="container" class="content_container">
                            <div class="slidee">
                                <div class="item" v-for="(item,index) in conditions">
                                 <div class="number">{{index+1}}</div>   
                                 <div class="info">设置条件</div>
                                </div>
                            </div>
                        </div>
                        <div class="scrollbar">
                            <div class="handle"></div>
                        </div>
                    </div>
                    
                    <div name="FieldSetItem_group_list" class="FieldSetItem_group_list" :class="{blnPage:blnShowGroupScrollbar}">
                        <div class="optionbar" @click="addGroup">添加</div>
                        <div name="container" class="content_container">
                            <div class="slidee">
                                <div class="group_item" :class="{active:curGroupIndex==index}" v-for="(item,index) in cGroups" @click="groupItem_click(index)">{{item.name}}</div>
                            </div>
                        </div>
                        <div class="scrollbar">
                            <div class="handle"></div>
                        </div>
                    </div>
                    
                    <div class="FieldSetItem_relation_container">
                        <div class="showResult"><span style="margin-right:10px;">结果:</span>{{calculResult}}</div>
                        <div class="optionBar">
                            <CondGroup v-show="curGroup==item" v-on:selChange="selChange" v-for="(item,index) in cGroups" :group="item" :items="selectConds"></CondGroup>
                        </div>
                    </div>
                </div>
                <div style="text-align:right;">
                    <button type="button" class="btn btn-default" @click="preStep()">上一步</button>
                    <button type="button" class="btn btn-success" @click="complete()">完成</button>
                </div>
            </div>
        </div>
        `;
        tool.open(function(){
            let group=[],conds=[],selectConds=[];

            for(let item of (self.limitCond.cGroups || [])){
                group.push(item);
            }
            if(group.length<=0){group.push({name:'分组1',type:'group',firstVal:'',scendtVal:'',cond:'',condSign:''});}
            for(let item of (self.limitCond.conditions || [])){
                conds.push(item);
            }

            //if(conds.length<=0){conds.push({name:'条件1',number:1,field:'',value:'',cond:''});}

            for(let item of (self.limitCond.selectConds || [])){
                selectConds.push(item);
            }

            //转化选中对象为控件使用的对象
            let converCond=(obj,selTables)=>{
                let sepSign="@_@";
                let result={};
                let tempTables={},lastTable=null;
                for(let table of selTables){
                    tempTables[table.key]=table;
                    lastTable=table;
                }
                for(let key in obj){
                    if(key.split(sepSign)[0]!='commonField'){
                        let cKey=key.split(sepSign)[0];
                        let table = tempTables[cKey];
                        if(!table){continue;}
                        result[key]=[];
                        if(obj[key].length>0){
                            for(let item of obj[key]){
                                let field=table.fields[item.key];
                                if(!field){continue;}
                                result[key].push(field);
                            }
                        }
                    }else{
                        result[key]=[];
                        if(obj[key].length>0){
                            for(let item of obj[key]){
                                let field=lastTable.fields[item.key];
                                if(!field){continue;}
                                result[key].push(field);
                            }
                        }
                    }
                }

                return result;
            }

            let param = {
                title:'编辑限定条件',
                area:'880px',
                content:`<div class="edit_limit_condition">${html}</div>`,
                components:{CFieldSet,CondGroup,OrderCheck},
                context:{
                    id:tool.guid(),
                    tables:self.fieldByIndex(),
                    stepIndex:1,//当前执行步骤索引
                    blnShowScrollbar:false,//是否显示滚动条
                    blnShowGroupScrollbar:false,//是否显示分组列表滚动条
                    cGroups:group,//条件分组
                    curGroupIndex:-1,//当前分组索引
                    curGroup:null,//当前激活的分组项
                    conditions:conds,
                    selTables:self.selTables,//选中数据源
                    selConds:converCond(self.selConds,self.selTables),//选中的条件
                    calculResult:'',//计算后的显示结果
                    selectConds:selectConds,//选择条件
                    //克隆条件
                    copyCond(data){
                        data.name='条件'+ (param.selfData.conditions.length+1);
                        data.number=param.selfData.conditions.length+1;
                        param.selfData.conditions.push(data);
                        param.selfData.selectConds.push(data);
                    },
                    getComomItem(table){//获取通用字段选项对象
                        let indexFields=table.indexFields, 
                        notRequisite=(indexFields && indexFields.notRequisite) || [],
                        condItem=[];
                        for(let site in notRequisite){
                            let group=[];
                            let groupItem=notRequisite[site];
                            let item =table.fields[groupItem];
                            if(!item){continue;}
                            item.tableKey=table.key;
                            item.tableName=table.name;
                            group.push(item);
                            condItem.push(group);
                        }
                        return condItem;
                    },
                    getCondItem(table){//获取限定条件选项对象
                        let indexFields=table.indexFields, 
                            requisite=(indexFields && indexFields.requisite) || [],
                            condItem=[];

                        for(let site in requisite){
                            let group=[];
                            let groupItems=requisite[site].split(',');
                            for(let field in groupItems){
                                let item =table.fields[groupItems[field]];
                                if(!item){continue;}
                                item.tableKey=table.key;
                                item.tableName=table.name;
                                group.push(item);
                            }
                         condItem.push(group);
                        }
                        return condItem;
                    },
                    calculGroup(group,res,blnField,conds){//计算分组项的值
                    //   if(!group.firstVal || !group.scendtVal || !group.cond){
                    //       res.pre=()=>{return '';};
                    //       res.after=()=>{return '';}; 
                    //       res.cond='';
                    //       return;
                    //   }
                      let condMap=['&&','||'],condValMap=['and','or'];
                      let firstVal=group.firstVal,scendtVal=group.scendtVal,cond=condMap[group.cond] || '',hasOne=(firstVal && !scendtVal) || (!firstVal && scendtVal);
                      if(conds && firstVal && scendtVal){
                          conds.term=condValMap[group.cond];conds.condtions=[{},{}];conds.value='';conds.field={};
                      }else{
                          res.cond='';
                          conds.term='';conds.value='';conds.field='';
                          if(conds.condtions){delete conds.condtions;}
                      }
                      if(firstVal && firstVal.type=='group')
                      {
                          res.pre=()=>{
                            let result={};
                            param.selfData.calculGroup(firstVal,result,blnField,conds.condtions?conds.condtions[0]:conds);
                            return (hasOne?'':'( ')+ result.pre() + result.cond + result.after();
                          };
                      }else if(firstVal){
                          if(conds && !hasOne){
                            conds.condtions[0].term=firstVal.condLetter;
                            conds.condtions[0].field={table:firstVal.field.tableKey,key:firstVal.field.key};//firstVal.field.tableKey+'_'+firstVal.field.key;
                            conds.condtions[0].value=firstVal.value;
                          }else{
                            conds.term=firstVal.condLetter;
                            conds.field={table:firstVal.field.tableKey,key:firstVal.field.key};//firstVal.field.tableKey+'_'+firstVal.field.key;
                            conds.value=firstVal.value;
                          }

                          res.pre=()=>{
                              return (hasOne?'':'( ') + (blnField?firstVal.field.tableName+'.'+firstVal.field.name+' '+firstVal.condSign+' '+firstVal.value:firstVal.number);};
                      }else{
                          res.pre=()=>{return '';}
                      }

                      if(scendtVal && scendtVal.type=='group')
                      {
                      
                          res.after=()=>{
                            let result={};
                            param.selfData.calculGroup(scendtVal,result,blnField,conds.condtions?conds.condtions[1]:conds);
                            return  result.pre() + result.cond +result.after() + (hasOne?'':' )');
                          };
                      }else if(scendtVal){
                          if(conds && !hasOne){
                            conds.condtions[1].term=scendtVal.condLetter;
                            conds.condtions[1].field={table:scendtVal.field.tableKey,key:scendtVal.field.key};//scendtVal.field.tableKey+'_'+scendtVal.field.key;
                            conds.condtions[1].value=scendtVal.value;
                          }else{
                            conds.term=scendtVal.condLetter;
                            conds.field={table:scendtVal.field.tableKey,key:scendtVal.field.key};//scendtVal.field.tableKey+'_'+scendtVal.field.key;
                            conds.value=scendtVal.value;
                          }
                          res.after=()=>{
                              return (blnField?scendtVal.field.tableName+'.'+scendtVal.field.name+' '+scendtVal.condSign+' '+scendtVal.value:scendtVal.number) + (hasOne?'':' )');};
                      }else{
                          res.after=()=>{return '';};
                      }

                     if(!hasOne){res.cond=' '+cond+' ';}
                    },
                    //添加限定条件
                    addFieldSet(){
                        let conds=param.selfData.conditions;
                        let item={name:'条件'+(conds.length+1),number:conds.length+1,field:'',value:'',cond:'',condSign:''};
                        conds.push(item);
                        param.selfData.selectConds.push(item);
                    },
                    //删除限定条件
                    delFieldSet(index){
                        let conds=param.selfData.conditions,selCond=param.selfData.selectConds;
                        let selIndex=-1;
                        for(let i=0;i<selCond.length;i++){
                            if(selCond[i]==conds[index]){
                                selIndex=i;break;
                            }
                        }
                        conds.splice(index,1);
                        if(selIndex>=0){
                            selCond.splice(selIndex,1);
                        }
                    },
                    //条件改变事件
                    selChange(){
                       let group = param.selfData.cGroups[0];
                       let calFunc=param.selfData.calculGroup;
                       let res={};
                       calFunc(group,res,false,self.limitCond.params);
                       param.selfData.calculResult=res.pre()+res.cond+res.after();
                    },
                    //分组项单击事件
                    groupItem_click(index){
                        param.selfData.curGroupIndex=index;
                        param.selfData.curGroup=param.selfData.cGroups[index];
                    },
                    //新增分组
                    addGroup(){
                        let groups=param.selfData.cGroups;
                        let item ={name:'分组'+(groups.length+1),type:'group',firstVal:'',scendtVal:'',cond:''};
                        groups.push(item);
                        param.selfData.selectConds.push(item);

                        param.groupSly.reload();
                        param.selfData.blnShowGroupScrollbar=param.groupSly.pages.length>1;
                    },
                    //转化选中的限定条件为简单对象或复杂对象
                    //obj:不存在则转化为简单对象,存在则转化为字段格式
                    converSelConds(){
                        let result={};
                        for(let key in param.selfData.selConds){
                            let cond=param.selfData.selConds[key];
                            if(cond.length>0){
                                result[key]=[];
                                for(let fields of cond){
                                    result[key].push({key:fields.key,name:fields.name});
                                }
                            }
                        }

                        return result;
                    },
                    //跳转到设置条件页面
                    skipSetPage(){
                         //设置选定条件
                         let conds=param.selfData.conditions;
                         let tempConds=[];
                         let tempIndexsObj={};
                         for(let key in param.selfData.selConds){
                             let items=param.selfData.selConds[key];
                             for(let item of items){
                                 let hasContain=false;
                                 for(let cond of conds){
                                    if(cond.field.tableKey==item.tableKey && cond.field.key==item.key){
                                        tempConds.push(cond);
                                        tempIndexsObj[cond.field.tableKey+'_'+cond.field.key]=1;
                                        hasContain=true;break;
                                    }
                                 }
                                 if(!hasContain){
                                     let condItem={name:'条件'+(tempConds.length+1),number:tempConds.length+1,field:item,value:'',cond:'',condSign:''};
                                     tempIndexsObj[item.tableKey+'_'+item.key]=1;
                                     tempConds.push(condItem);
                                     param.selfData.selectConds.push(condItem);
                                 }
                             }
                         }
                         conds.splice(0,conds.length);
                         param.selfData.selectConds.splice(0,param.selfData.selectConds.length);
                         for(let tempCond of tempConds){
                             conds.push(tempCond);
                             param.selfData.selectConds.push(tempCond);
                         }

                         //重新设置分组信息
                        let tempGroup=[],tempGroupIndex=0;

                        for(let group of param.selfData.cGroups){
                            let counter=tool.counter((obj)=>{
                                let blnHas=obj[0].first || obj[0].second;
                                if(blnHas){
                                    group.name='分组'+(++tempGroupIndex);
                                    tempGroup.push(group);
                                }
                            },2);
                            recurGroup(group,tempIndexsObj,counter);
                        }
                        param.selfData.cGroups= tempGroup.length<=0 ? [{name:'分组1',type:'group',firstVal:'',scendtVal:'',cond:'',condSign:''}] : tempGroup; 
                        param.selfData.stepIndex++;
                    },
                    //跳转到下一步
                    nextStep(){
                        //判断是否只设置了一个条件(如果是则直接跳转的下一个环节)
                        if(param.selfData.conditions.length==1){
                            param.selfData.complete();
                            return;
                        }

                        param.selfData.stepIndex++;
                        param.$vm.$nextTick(()=>{
                            let sly=new Sly($('#'+param.selfData.id).find('div[name="FieldSetItem_condition_list"] > div[name="container"]'),{
                                itemNav: "basic",
                                speed:200,
                                scrollBy:1,
                                scrollBar:'.FieldSetItem_condition_list > .scrollbar',
                                dragHandle:true,
                                dynamicHandle:true,
                                smart:1
                            });
                            sly.init();
                            param.selfData.blnShowScrollbar=sly.pages.length>1;
                            param.sly=sly;

                            let groupSly=new Sly($('#'+param.selfData.id).find('div[name="FieldSetItem_group_list"] > div[name="container"]'),{
                                itemNav: "basic",
                                speed:200,
                                scrollBy:1,
                                scrollBar:'.FieldSetItem_group_list > .scrollbar',
                                dragHandle:true,
                                dynamicHandle:true,
                                smart:1
                            });
                            groupSly.init();
                            param.selfData.blnShowGroupScrollbar=groupSly.pages.length>1;
                            param.groupSly=groupSly;

                            param.selfData.groupItem_click(0);
                        });
  
                    },
                    //跳转到上一步
                    preStep(){
                        param.selfData.stepIndex--; 
                    },
                    //完成
                    complete(){
                        param.close();
                        self.selConds = param.selfData.converSelConds();
                        //只设置一个条件下需要特殊处理
                        if(param.selfData.conditions.length==1){
                            self.limitCond.cGroups=param.selfData.cGroups;
                            self.limitCond.conditions=param.selfData.conditions;
                            self.limitCond.selectConds=param.selfData.selectConds;
                            self.limitCond.params={
                                term:param.selfData.conditions[0].condLetter,
                                field:{table:param.selfData.conditions[0].field.tableKey,key:param.selfData.conditions[0].field.key},
                                value:param.selfData.conditions[0].value
                            };

                            self.limitCond.info=param.selfData.conditions[0].field.tableName+'.'+param.selfData.conditions[0].field.name+
                                                ' ' +param.selfData.conditions[0].condSign+' '+
                                                param.selfData.conditions[0].value;
                            return;
                        }

                        //以前用索引的时候用来判断索引减少后去除多余的选中条件
                        // let tempIndexsObj={};
                        // for(let indexArr of self.indexs){
                        //     for(let index of indexArr){
                        //         tempIndexsObj[index.tableKey+'_'+index.key]=1;
                        //     }
                        // }
                        // let tempGroup=[],tempGroupIndex=0;

                        // for(let group of param.selfData.cGroups){
                        //     let counter=tool.counter((obj)=>{
                        //         let blnHas=obj[0].first || obj[0].second;
                        //         if(blnHas){
                        //             group.name='分组'+(++tempGroupIndex);
                        //             tempGroup.push(group);
                        //         }
                        //     },2);
                        //     recurGroup(group,tempIndexsObj,counter);
                        // }

                        // param.selfData.cGroups=tempGroup;
                  
                        self.limitCond.cGroups=param.selfData.cGroups;
                        self.limitCond.conditions=param.selfData.conditions;
                        self.limitCond.selectConds=param.selfData.selectConds;
                        let res={};
          
                        param.selfData.calculGroup(self.limitCond.cGroups[0],res,true,self.limitCond.params);
                        

                        self.limitCond.info=res.pre()+res.cond+res.after();
                    }
                },
                success(){
                    let groups=param.selfData.cGroups;
                    let conds=param.selfData.conditions;
                    param.selfData.selectConds=groups.concat(conds);
                    LimitParamFunc=param.selfData.calculGroup;
                }
            };
          return param;  
        }());
    },
    //查询索引
    query_index(){
        let self=this;
        let tempIndexs=[];
        for(let item of self.indexs){
            tempIndexs.push(item);
        }
        tool.open(function(){
            let html=`<div class="title">
                        <span>已添加索引</span>
                        <i class="fa fa-plus" @click="add_index()"></i>
                      </div>
                      <div class="index_content">
                        <div class="item" v-for="(item ,index) in indexs">
                            <span class="number">{{index+1}}</span>
                            <div class="option_bar"><span><i class="fa fa-pencil" @click="add_index(item)"></i></span><span><i class="fa fa-close" aria-hidden="true" @click="del_item(index)"></i></span></div>
                            <div class="content">{{infoIndex(item)}}</div>
                            <div class="clearfix"></div>
                        </div>
                      </div>
                      <div class="option_bar">
                        <button type="button" class="btn btn-success" @click="ok_btn()">确定</button>
                        <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
                      </div>
                      `;
            let param = {
                title:'编辑索引',
                area:['600px','300px'],
                content:`<div class="editer_index">${html}</div>`,
                context:{
                    indexs:tempIndexs || [],//索引
                    infoIndex(item){//显示索引信息
                      let result=[];
                      for(let i=0;i<item.length;i++){
                          result.push('('+item[i].tableName+'.'+item[i].name+')');
                      }
                      return result.join(' - ');
                    },
                    //删除索引
                    del_item(index){
                        param.selfData.indexs.splice(index,1);
                    },
                    //确定按钮单击事件
                    ok_btn(){
                        self.indexs=[];
                        for(let item of param.selfData.indexs){
                            self.indexs.push(item);
                        }
                        param.close();
                    },
                    //取消按钮单击事件
                    cancel_btn(){
                        param.close();
                    },
                    add_index(item){
                        let add_tempIndexs=[];
                        if(item){
                            for(let add_child of item){
                                add_tempIndexs.push(add_child);
                            }
                        }
                        tool.open(function(){
                            let add_index_html=`
                                <div class="col-sm-3">关联字段</div>
                                <div class="col-sm-9">
                                    <el-select v-model="value" multiple placeholder="请选择">
                                        <el-option-group
                                        v-for="table in data"
                                        :label="table.name">
                                            <el-option
                                                v-for="item in table.fields"
                                                :label="convert_filed_label(item)"
                                                :value="item">
                                            </el-option>
                                        </el-option-group>
                                    </el-select>
                                </div>
                                <div class="clearfix"></div>
                                <div style="text-align:right;padding-right: 15px;padding-top: 10px;">
                                    <button type="button" class="btn btn-success" @click="ok_btn()">确定</button>
                                    <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
                                </div>
                            `;
                            let res={
                                title:item?'修改索引':'新增索引',
                                area:'400px',
                                content:`<div class="add_index">${add_index_html}</div>`,
                                context:{
                                    data:self.queryFields,
                                    value:add_tempIndexs || '',
                                    convert_filed_label(item){
                                        return item.name;
                                    },
                                    ok_btn(){
                                        if(!item){
                                            //新增
                                            param.selfData.indexs.push(res.selfData.value);
                                        }else{
                                            //修改
                                            let tempArr=[]
                                            for(let i=0;i<param.selfData.indexs.length;i++){
                                                tempArr.push(param.selfData.indexs[i]);
                                            }
                                            param.selfData.indexs=[];
                                            for(let i=0;i<tempArr.length;i++){
                                                if(tempArr[i]==item){
                                                    param.selfData.indexs.push(res.selfData.value);
                                                }else{
                                                    param.selfData.indexs.push(tempArr[i]);
                                                }
                                            }
                                        }
                                        res.close();
                                    },
                                    cancel_btn(){
                                        res.close();
                                    }
                                }
                            };

                            return res;
                        }());
                    }
                }
            };
            return param;
        }());
    },
    //查询条件删除
    query_del(item){
        let index=-1,self=this;
        for(let i=0;i<self.queryItems.length;i++){
            if(self.queryItems[i]===item){
                index=i;break;
            }
        }
       self.queryItems.splice(index,1);
    },
    //查询条件编辑
    query_edit(item,index){
        //console.log(tool.Clone(item));
        let self=this;
        tool.open(function(){ 
            let html=`
            <form class="form-horizontal" role="form">
                <div class="form-group">
                    <label class="col-sm-3 control-label">名称</label>
                    <div class="col-sm-9">
                         <el-input placeholder="请输入内容" v-model="addInfo.name"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">查询类型</label>
                    <div class="col-sm-9">
                         <optionKind :value="addInfo.type" :data="searchKinds"></optionKind>
                         <div v-if="addInfo.filed && addInfo.filed.type" style="display:none;border: 1px solid #C0CCDA;line-height:34px;padding-left:10px;border-radius:4px;">{{searchKinds[addInfo.type]}}</div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">是否必填</label>
                    <div class="col-sm-9">
                        <el-button-group>
                            <el-button :class="{requried:addInfo.blnRequried}" @click="addInfo.blnRequried=true">是</el-button>
                            <el-button :class="{no_requried:!addInfo.blnRequried}" @click="addInfo.blnRequried=false">否</el-button>
                        </el-button-group>
                    </div>
                </div>
                <div class="form-group" v-show="searchKinds[addInfo.type]=='日期范围'">
                    <label class="col-sm-3 control-label">选择范围</label>
                    <div class="col-sm-9">
                        <el-button-group>
                            <el-button :class="{requried:addInfo.range==1}" @click="addInfo.range=1">今天之前</el-button>
                            <el-button :class="{no_requried:!addInfo.range}" @click="addInfo.range=0">无</el-button>
                        </el-button-group>
                    </div>
                </div>
                <div class="form-group" v-show="searchKinds[addInfo.type]=='日期范围'">
                    <label class="col-sm-3 control-label">快捷选项</label>
                    <div class="col-sm-9">
                        <el-button-group>
                            <el-button :class="{}">{{addInfo.timeShort?addInfo.timeShort.length:0}}个</el-button>
                            <el-button :class="{}" @click="addShortcut()" style="height:36px;"><i class="fa fa-plus"></i></el-button>
                        </el-button-group>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">索引字段</label>
                    <div class="col-sm-9">
                         <relativeField :tables="tables" :value="addInfo.filed"></relativeField>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label" v-show="searchKinds[addInfo.type]!='场所控件' && searchKinds[addInfo.type]!='区域控件' && searchKinds[addInfo.type]!='派出所控件' && searchKinds[addInfo.type]!='远程字段'">默认值</label>
                    <div class="col-sm-9">
                        <!--文本框-->
                        <el-input v-if="searchKinds[addInfo.type]=='文本框'" placeholder="请输入内容" v-model="addInfo.defVal"></el-input>
                        <!--日期-->
                        <el-date-picker style="width:100%;" v-show="searchKinds[addInfo.type]=='日期'" format="yyyy-MM-dd" v-model="addInfo.defVal" type="date" placeholder="选择日期" :picker-options="single_pickerOptions"></el-date-picker>
                        <!--生日-->
                        <el-date-picker style="width:100%;" v-show="searchKinds[addInfo.type]=='生日'" format="yyyy-MM-dd" v-model="addInfo.defVal" type="date" placeholder="选择日期"></el-date-picker>
                        <!--日期范围-->
                        <el-date-picker style="width:100%;" v-show="searchKinds[addInfo.type]=='日期范围'" format="yyyy-MM-dd" v-model="addInfo.defVal" type="daterange" placeholder="选择日期" :picker-options="single_pickerOptions"></el-date-picker>
                        <!--下拉框-->
                        <el-select style="width:100%;" v-show="searchKinds[addInfo.type]=='下拉框'" v-model="addInfo.dropVal" placeholder="请选择" @change="dropChange">
                            <el-option
                                v-for="item in ((addInfo.filed || {}).referval || [])"
                                :label="item.name"
                                :value="item">
                            </el-option>
                        </el-select>
                        <!--虚拟身份控件-->
                        <virtualIden v-if="searchKinds[addInfo.type]=='虚拟身份控件'" :ccontext="addInfo" :options="virType" @change="Idenchange"></virtualIden>
                    </div>
                </div>
            </form>
            <div style="text-align:right;">
                <button type="button" class="btn btn-success" @click="submit_btn()">确定</button>
                <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
            </div>
            `;
            let updateTemp=null;
            if(item){
                updateTemp=Object.assign({},item);
                updateTemp.type=updateTemp.type+'';
            }   

            //构建查询条件可选字段类型
            let fieldKind=self.fieldByIndex();
            let param = {
                title:item?'修改查询条件':'新增查询条件',
                area:'400px',
                content:`<div class="add_query_condition">${html}</div>`,
                context:{
                    tables:fieldKind,
                    searchKinds:self.queryTypeMap,
                    virType:self.virType,//虚拟身份类型
                    addInfo:updateTemp || {//新增条件信息
                        name:'',//查询条件名称
                        type:'1',//查询类型(1:文本框;2:日期;3:日期范围;4:下拉框;5:场所控件;6:区域控件;7:派出所控件)
                        filed:null,//关联字段对象
                        blnRequried:false, //是否必填
                        range:0,//选择范围
                        referval:'',//查询类型为下拉框时的参考值
                        dropVal:'',//下拉框控件选中时的值
                        timeShort:[],//日期范围快捷选项值
                        defVal:'',   //默认值
                    },
                    single_pickerOptions:{//单个日期控件选择限制条件
                        disabledDate(time) {
                            return false; //time.getTime() < Date.now() - 8.64e7;
                        }
                    },
                    dropChange(val){
                        let addInfo=param.selfData.addInfo;
                        if(!val){addInfo.defVal='';return;}
                        addInfo.defVal=val.value;
                    },
                    Idenchange(item,val){
                        item.defVal=val;
                    },
                    cancel_btn(){//取消按钮单击事件
                        param.close();
                    },
                    submit_btn(){//确定按钮单击事件
                        param.close();
                        if(!item && param.selfData.addInfo.filed){
                            //新增
                            param.selfData.addInfo.alias=param.selfData.addInfo.filed.tableKey+'_'+param.selfData.addInfo.filed.key;
                            self.queryItems.push(param.selfData.addInfo);
                        }else{
                            //修改
                            self.queryItems.splice(index,1,updateTemp);
                        }
                    },
                    //添加/删除快捷选项
                    addShortcut(){
                        let shortHtml=`
                            <div class="optionBar" style="height:40px;width:100%;line-height:40px;text-align: center;border-bottom:1px solid #e7eaec;">
                                <div style="display:inline-block;width:100px;"><el-input placeholder="快捷名称" v-model="name"></el-input></div>
                                <div style="display:inline-block;width:80px;"><el-input placeholder="天数" v-model="day"></el-input></div>
                                <div style="display:inline-block;width:180px;line-height:auto;">
                                    <el-button-group style="margin-top:-4px;width:180px;">
                                        <el-button :class="{shoreParamActive:tag==0}" @click="tag=0">之前</el-button>
                                        <el-button :class="{shoreParamActive:tag==1}" @click="tag=1">之后</el-button>
                                        <el-button :class="{shoreParamActive:odd==1}" @click="odd=odd?0:1">单天</el-button>
                                    </el-button-group>
                                </div>
                                <div style="display:inline-block;width:60px;">
                                    <el-button type="primary"" @click="add()"><span >添加</span></el-button>
                                </div>
                            </div>
                            <div class="list" style="height:calc(100% - 40px - 34px);width:100%;">
                                <Scroll :store="store" :listen="data">
                                    <div v-for="(d,i) in data" class="shortItem" style="font-size:12px;">
                                        <div style="float:left;height:100%;width:30px;text-align:center;border-right:1px solid #e7eaec;">{{i+1}}</div>
                                        <div style="float:right;height:100%;width:30px;text-align:center;border-left:1px solid #e7eaec;cursor:pointer;">
                                            <i class="fa fa-close" @click="remove(i)"></i>
                                        </div>
                                        <div style="margin: 0px 41px;height:100%;">
                                            {{d.name}}
                                            <span style="margin:0px 5px;color:#03c1d7;">{{d.day}}/天</span>
                                            <span style="color:#ebb52f;">{{d.tag==0?'之前':'之后'}}</span>
                                            <span style="">({{d.odd==0?'范围':'单天'}})</span>
                                        </div>
                                    </div>
                                </Scroll>
                            </div>
                            <div style="text-align:right;">
                                <button type="button" class="btn btn-success" @click="submit_btn()">确定</button>
                                <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
                            </div>
                        `;
                        tool.open(function(){
                            let shortParma={
                                title:'快捷项操作',
                                area:['460px','300px'],
                                components:{Scroll},
                                content:`<div class="add_Shortcut_Pop" style="height:100%;width:100%;">${shortHtml}</div>`,
                                context:{
                                    store:self.$store,
                                    name:'',
                                    day:'',
                                    tag:0,//时间标识(0:之前,1:之后)
                                    odd:0,//标识是否为单天(0:为选取范围,1:为单天)
                                    data:tool.Clone(param.selfData.addInfo.timeShort || []),
                                    add(){
                                        let d=shortParma.selfData,item={name:d.name,day:d.day,tag:d.tag,odd:d.odd},data=d.data;
                                        data.push(item);
                                        d.name='';
                                        d.day='';
                                        d.tag=0;
                                        d.odd=0;
                                    },
                                    submit_btn(){
                                        shortParma.close();
                                        param.selfData.addInfo.timeShort=tool.Clone(shortParma.selfData.data);
                                    },
                                    cancel_btn(){
                                        shortParma.close();
                                    },
                                    remove(i){
                                        shortParma.selfData.data.splice(i,1);
                                    }
                                }
                            };

                            return shortParma;
                        }());
                    }
                },
                components:{
                    virtualIden,
                    //查询类型
                    optionKind:{
                        props:['value','data'],
                        template:`
                            <el-select v-model="defVal" placeholder="请选择" @change="change">
                                <el-option v-for="(val,key) in data" :label="val" :value="key"></el-option>
                            </el-select>
                        `,
                        data(){
                           return {
                               defVal:'',
                               blnInitLoad:true
                           }
                        },
                        watch:{
                            value(){
                                this.defVal=this.value;
                            }
                        },
                        mounted(){
                            this.defVal=this.value;
                            this.$nextTick(()=>{
                                this.blnInitLoad=false;
                            });
                        },
                        methods:{
                            change(val){
                                if(this.blnInitLoad){return;}
                                param.selfData.addInfo.type=val;
                                param.selfData.addInfo.defVal='';
                                param.selfData.addInfo.range=0;
                            }
                        }
                    },
                    //关联类型
                    relativeField:{
                        props:['tables','value'],
                        template:`
                            <el-select v-model="innerVal" placeholder="请选择" @change="change">
                                <el-option-group
                                    v-for="table in tables"
                                    :label="table.name">
                                    <el-option
                                    v-for="field in table.fields"
                                    :label="field.name"
                                    :value="field">
                                    </el-option>
                                </el-option-group>
                            </el-select>
                        `,
                        data(){
                            return {
                                innerVal:''
                            }
                        },
                        mounted(){
                            this.innerVal=this.value;
                        },
                        watch:{
                            value(){
                                let addInfo=param.selfData.addInfo,referval=addInfo.filed.referval || [];
                                addInfo.type=(addInfo.filed?addInfo.filed.type || '1' : addInfo.type || '1') +'';
                                addInfo.defVal=addInfo.filed?addInfo.filed.defval || addInfo.defVal || '' : addInfo.defVal;
                                addInfo.referval=referval;
                                addInfo.isPrimeIndex=addInfo.filed?addInfo.filed.isPrimeIndex || addInfo.isPrimeIndex || false : addInfo.isPrimeIndex;//是否该参数为独立索引(前端页面构造查询条件时单独构造)
                                addInfo.name= addInfo.filed.name;
                                //转变参考值
                                for(let item of referval){
                                    if(item.value==addInfo.defVal){
                                        addInfo.dropVal=item;break;
                                    }
                                }   
                            }
                        },
                        methods:{
                            change(val){
                                if(!val){return;}
                                let addInfo=param.selfData.addInfo,referval=val.referval || [];
                                addInfo.filed=val;
                                // addInfo.type=addInfo.filed?addInfo.filed.type+'' || addInfo.type || '1' : addInfo.type;
                                // addInfo.defVal=addInfo.filed?addInfo.filed.defval || addInfo.defVal || '' : addInfo.defVal;
                                // addInfo.referval=referval;
                                // addInfo.isPrimeIndex=addInfo.filed?addInfo.filed.isPrimeIndex || addInfo.isPrimeIndex || false : addInfo.isPrimeIndex;//是否该参数为独立索引(前端页面构造查询条件时单独构造)
                                // addInfo.name= addInfo.filed.name;
                                // //转变参考值
                                // for(let item of referval){
                                //     if(item.value==addInfo.defVal){
                                //         addInfo.dropVal=item;break;
                                //     }
                                // }        
                            }
                        }
                    }
                }
            };
            return param;
        }());
    }
  }
}
</script>
<style lang="less">
    @import "../css/variables.less";
    .edit_limit_condition{padding:10px;}
    .edit_limit_condition .el-step .el-step__title{margin-left:-10px;}
    .edit_limit_condition .el-input__icon + .el-input__inner{line-height: 36px;}

    .FieldSetItem{display:inline-block;position: relative;}
    .FieldSetItem .number{
        display: inline-block;height: 20px;width: 20px;background-color:@btn_Bg_Col_hover_1;
        text-align: center;border-radius: 50%;
        position: absolute;top: 10px;color:@FrontCol;
    }
    .FieldSetItem .addBtn{
        display: inline-block;height: 20px;width: 20px;
        position: absolute;top: 10px;cursor:pointer;
        right:25px;font-size:22px;color:@FontCol;
    }
    .FieldSetItem .closeBtn{
        display: inline-block;height: 20px;width: 20px;
        position: absolute;top: 10px;cursor:pointer;
        right:0px;font-size:22px;color:@FontCol;
    }
    .FieldSetItem .fieldSetComp{display: inline-block;margin-left: 25px;margin-right:50px;}

    @FieldSetItem_condition_listW:200px;
    @FieldSetItem_group_listW:100px;
    .relation_container{height:300px;.border('');margin-bottom:10px;}
    .FieldSetItem_condition_list{float:left;height:100%;width:@FieldSetItem_condition_listW;.border('right');position: relative;}
    .FieldSetItem_condition_list .content_container{width:100%;height:100%;}
    .FieldSetItem_relation_container{margin-left:@FieldSetItem_condition_listW;margin-right:@FieldSetItem_group_listW;height:100%;}

    .FieldSetItem_group_list .optionbar{height:30px;line-height:30px;background-color:@btn_Bg_Col_hover_1;color:@FrontCol;cursor:pointer;text-align:center;}
    .FieldSetItem_group_list{float:right;width:@FieldSetItem_group_listW;height:100%;.border('left');position: relative;}
    .FieldSetItem_group_list .content_container{width:100%;height:~"calc(100% - 30px)";}

    .FieldSetItem_group_list .scrollbar:hover,
    .FieldSetItem_condition_list .scrollbar:hover {cursor:pointer;}
    .FieldSetItem_group_list .scrollbar,
    .FieldSetItem_condition_list .scrollbar { width: 10px; height: 100%; position: absolute;right: 0px;top: 0px;background: #ccc;display:none;}
    .FieldSetItem_group_list .scrollbar .handle,
    .FieldSetItem_condition_list .scrollbar .handle {width: 100%;height: 100px;background: @btn_Bg_Col_1;}
    .blnPage .scrollbar{display:block;}

    .FieldSetItem_group_list .group_item{.border('bottom');line-height:30px;padding-left:10px;cursor:pointer;}
    .FieldSetItem_group_list .group_item.active{color:@FrontCol;}

    html{.TCol(~".FieldSetItem_group_list .group_item.active",'bg');}

    @itemH:30px;
    @item_numberW:30px;
    .FieldSetItem_condition_list .item{height:@itemH;line-height:@itemH;margin:5px 15px 5px 10px;.border('');border-radius:5px;}
    .FieldSetItem_condition_list .item .number{
        float:left;width:@item_numberW;.border('right');border-top-left-radius:5px;border-bottom-left-radius:5px;text-align:center;
        color:@FontCol;
    }
    .FieldSetItem_condition_list .item .info{margin-left:@item_numberW;padding-left:10px;}
    .FieldSetItem_relation_container .showResult{height:40px;line-height:40px;.border('bottom');padding:0px 10px;}
    .FieldSetItem_relation_container .optionBar{width:100%;height:~"calc(100% - 40px)";border:none;text-align:center;padding:10px;}

    // 新增查询条件
    .add_query_condition{padding:10px;}
    .add_query_condition label{font-weight:300;}
    .add_query_condition .form-group{margin-bottom:10px !important;}
    .add_query_condition .requried{color:@FrontCol;}

    html{.TCol(~".add_query_condition .requried",'bg');}
    .add_query_condition .no_requried{color:@FrontCol;}

    html{.TCol(~".add_query_condition .no_requried",'bg');}

    //编辑索引
    .editer_index{height:100%;}
    .editer_index .title{height:30px;line-height:30px;color:@FontCol;.border('bottom');padding:0px 10px;}
    .editer_index .title i{float:right;margin-top:8px;cursor:pointer;}
    .editer_index .index_content{height:~"calc(100% - 84px)";overflow-y: auto;}
    .editer_index .index_content .item{line-height:30px;.border('bottom')}
    .editer_index .index_content .item .number{float:left;width:30px;height:100%;.border('right');text-align:center;}
    .editer_index .index_content .item .content{margin-left:30px;margin-right:60px;.border('right');padding-left:10px;}
    .editer_index .index_content .item .option_bar{float:right;width:60px;line-height:30px;padding:0px;}
    .editer_index .index_content .item .option_bar span{width:50%;display:inline-block;text-align:center;cursor:pointer;}
    .editer_index .index_content .item .option_bar span:first-child{.border('right');}
    //.editer_index .index_content .item .option_bar span:hover{color:@Font_Hover_Col;}
    html{.TCol(~".editer_index .index_content .item .option_bar span:hover");}

    .editer_index .option_bar{text-align:right;padding: 0px 15px;line-height:54px;}

    //新增索引
    .add_index{padding:10px;line-height:36px;}
    .el-step__line-inner{display:block !important;}

    //模板配置弹窗页面样式
    .tagSetting_pop .option_container{width:100%;.border('bottom');text-align:right;}
    .tagSetting_pop .option_container > i{margin-right:10px;cursor:pointer;}
    //.tagSetting_pop .option_container > i:hover{color:@btn_Bg_Col_hover_0;}
    
    html{.TColAdd(~".tagSetting_pop .option_container > i:hover");}

    .tagSetting_pop .option_content{width:100%;}
    .tagSetting_pop .option_content .tag{line-height:30px;padding:0px 10px;color:white;.border('bottom');cursor:pointer;}
    html{.TCol(~".tagSetting_pop .option_content .tag",'bg');}
    .tagSetting_pop .option_content .setting_content{min-height:100px;}
    

    //操作快捷项可选按钮样式
    .add_Shortcut_Pop .shoreParamActive{background-color:#03c1d7;color:white !important;}
    .add_Shortcut_Pop .shortItem{.border('bottom');line-height:30px;}
</style>
<style lang="less">
    .groupdrop .el-input__inner{
        border-right: none !important;
        border-top-right-radius: 0px !important;
        border-bottom-right-radius: 0px !important;
    }
    .groupdrop .el-select{float:left;}
    .groupdrop .el-button-group::after, .el-button-group::before{width:280px;}
    .preview_pop .option_btn_container .option_btn:nth-child(odd),
    .preview_pop .option_btn_container .option_btn:nth-child(even){margin-right:10px;}
    .preview_pop .option_btn_container .option_btn:only-child{margin-right:0px;}
     //选择条件样式(编辑限定条件)
    .limitCondItem{height:30px;border-bottom:1px solid #20a0ff;margin-bottom:5px;}
    .limitCondItem .title{display: inline-block;height: 25px;width: 25px;line-height: 25px;text-align: center;border-radius: 50%;background-color: #20a0ff;color: white;margin-right: 10px;}

</style>
<style scoped lang="less">
 @import "../css/variables.less";

 .condition{height:100%;padding:10px;background-color:@FrontCol;}
 .condition .content_item{
     position:relative;text-align:left;min-height:20%;
  }
  .condition .content_item .title{
    padding:0px 20px 0px 5px;
    color:@FrontCol;
    font-size:13px;
    width: 120px;
    position: relative;
    margin-top: 5px;
    text-align: left;
    display:inline-block;
  }
  html{.TCol(~".condition .content_item .title",'bg');}

  .condition .content_item .content_item_title{padding:5px;.border('bottom',shade(@borderCol,10%));margin-bottom:10px;}
  .condition .content_item .content_item_title .title{font-size:14px;background-color: transparent;color:black;}
  .condition .content_item .content_item_title .title_icon{margin-right:5px;font-size:18px;}
  .condition .content_item .title span{
    position:absolute;
    right:0px;
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-right: 10px solid @FrontCol;
    border-bottom: 10px solid transparent;
  }

  .condition .content_item .editer{float:right;margin-top: 5px;margin-right: 5px;cursor:pointer;}
  //.condition .content_item .editer i:hover{color:@Font_Hover_Col;}
  html{.TCol(~".condition .content_item .editer i:hover");}

  .condition .content_item .content{text-align:left;position:relative;}

  .condition .limit_condition_content{padding:10px;}
  .condition .query_item{
      .border('');display:inline-block;width:200px;border-radius:5px;margin:10px;
  }
  @query_titleH:30px;
  .condition .query_item .query_title{
      height:@query_titleH;background-color:@btn_Bg_Col_hover_1;color:@FrontCol;
      border-top-left-radius:5px;border-top-right-radius:5px;text-align:left;
  }
  .condition .query_item .item{height: 100%;width: 50%;text-align: center;line-height: @query_titleH;font-size: 20px;float:left;}

  .condition .query_item .query_title i{margin-right:5px;cursor:pointer;}
  .condition .query_item .query_title .item:hover{cursor:pointer;}
  //.condition .query_item .query_title .item:hover i{color:@btn_Bg_Col_hover_0;}
  
  html{.TColAdd(~".condition .query_item .query_title .item:hover i");}

  .condition .query_item .query_item_content .query_content_item{
      line-height:30px;padding-right:10px;.border('bottom');font-size:12px;
      overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
  }
  .condition .query_item .query_item_content .query_content_item:last-child{border-bottom:none;}
  .condition .query_item .query_item_content .query_content_item .title{
      width:80px;text-align:center;.border('right');display: inline-block;height: 100%;
      padding: 0px;margin: 0px;background-color: transparent;color: black;margin-right: 10px;
  }

  .condition .content_item .active{background-color:#20a0ff;color:white;}

  .scrollContainer{width:100%;height:100%;}
  .scrollbar:hover {cursor:pointer;}
  .scrollbar { border:1px solid @borderCol;border-radius:5px;width: 10px; height: ~'calc(100% - 20px)'; position: absolute;right: 5px;top: 0px;background:white;margin-top:10px;}
  .scrollbar .handle {width: 100%;height: 100px;background: @btn_Bg_Col_1;border-radius:5px;}
  

  //远程接口数据项
  .remote_item{padding:0px 10px;.border('bottom');}
  .remote_item:hover{background-color:@btn_Bg_Col_hover_1;color:white;}
</style>
