<!-- 模板页面 -->
<template>
    <div :id="id" class="template">
        <div :style="{float:'right',height:'100%',width:'calc(100% - '+(menus.length>1?40:0)+'px)'}">
            <div name="page_item" class="page" v-for="(item,index) in menus" v-show="curPageId==item.keyid">
                <!--tag插件-->
                <div style="height:30px" name="tagcomp" v-if="item.showTemplate.length>1">
                    <Tag :ref="'tag'+item.id" :templates="item.showTemplate" v-on:itemClick="tagClick" :extra="item" />
                </div>

                <!--列表页面-->
                <div v-show="item.curShowTmpId==mapTmp['列表'].id" name="page_item_container" :class="{fadeIn:item.curShowTmpId==mapTmp['列表'].id}" :style="{'position':'relative',height:'calc(100% - '+(item.showTemplate.length>1?30:0)+'px)'}">
                    <!--列表公共操作栏-->
                    <FloatBar v-if="item.comOptions.length>0" :actions="item.comOptions" :roffset="-10" />
                    <div name="condition" class="condition clearfix" v-if="item.queryCondition.length || (item.remoteInterface && item.remoteInterface.length>0)">
                        <div class="item" v-for="query in item.queryCondition">
                            <div class="title">{{query.name}}:</div>
                            <div class="input">
                                <MaskInput v-if="searchArrType[query.type]=='文本框'" :val="query.defVal" placeholder="请输入内容" :mask="query.filed.mask" :context="query" @change="inputChange" />
                                <!--<el-input v-if="searchArrType[query.type]=='文本框'" placeholder="请输入内容" v-model="query.defVal"></el-input>-->
                                <el-date-picker v-if="searchArrType[query.type]=='日期'" v-model="query.defVal" type="date" placeholder="选择日期" :picker-options="simpleTime"> </el-date-picker>
                                <el-date-picker v-if="searchArrType[query.type]=='日期范围'" v-model="query.defVal" type="datetimerange" placeholder="选择日期范围" :format="'yyyy-MM-dd'" :picker-options="timeRangeSet(query)" style="width: 220px"></el-date-picker>
                                <el-date-picker v-if="searchArrType[query.type]=='生日'" v-model="query.defVal" type="date" placeholder="选择日期"> </el-date-picker>
                                <el-select style="width:250px;" v-if="searchArrType[query.type]=='下拉框'" v-model="query.dropVal" :ccontext="query" :clearable="true" placeholder="请选择" @change="dropChange">
                                    <el-option
                                        v-for="item in (query.referval || [])"
                                        :label="item.name"
                                        :value="item">
                                    </el-option>
                                </el-select>
                                <PlaceSearch v-if="searchArrType[query.type]=='场所控件'" :blnClear="true" :blnLike="true" c_searchKind="1" :ccontext="query" @place_res="placechange"></PlaceSearch>
                                <PlaceSearch v-if="searchArrType[query.type]=='区域控件'" :blnClear="true" c_searchKind="0" :ccontext="query" @place_res="placechange"></PlaceSearch>
                                <PlaceSearch v-if="searchArrType[query.type]=='派出所控件'" :blnClear="true" c_searchKind="2" :ccontext="query" @place_res="placechange"></PlaceSearch>
                                <virtualIden v-if="searchArrType[query.type]=='虚拟身份控件'" :ccontext="query" :options="VirType" @change="Idenchange"></virtualIden>
                                <el-select style="width:250px;" v-if="searchArrType[query.type]=='远程字段'" v-model="query.dropVal" :ccontext="query" :clearable="true" placeholder="请选择" @change="dropChange">
                                    <el-option
                                        v-for="item in (query.referval || [])"
                                        :label="item.name"
                                        :value="item">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <!--远程数据筛选项-->
                        <div class="item" v-if="item.remoteInterface && item.remoteInterface.length>0" style="line-height:40px;">
                            远程数据:
                            <div class="input" style="margin-left:10px;width:200px;">
                                <MulDropDown :data="item.remoteIds" keyProp="name">
                                    <div class="remote_item" v-for="i in item.remoteInterface" @mousedown="remoteItemClick(i,item)">{{i.name}}</div>
                                </MulDropDown>
                                <!--<el-select v-model="item.remoteIds" multiple placeholder="请选择">
                                    <el-option
                                    v-for="item in remoteData"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item">
                                    </el-option>
                                </el-select>-->
                            </div>
                        </div>
                        <div class="item" v-if="item.queryCondition.length>0 || (item.remoteInterface &&  item.remoteInterface>0)">
                            <el-button type="primary" @click="query_click(item,item.queryCondition,item.condtion,item.keyid)"><i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i><span v-show="!blnSearch">搜索</span></el-button>
                        </div>
                    </div>
                    <div name="table_container" class="table_container">
                        <el-table :data="pageData(item.data,item.curPage || 0,item.limit)" :row-style="function(row,i){return {'background-color':item.curSelIndex==i?'#03c1d7':'#fff','color':item.curSelIndex==i?'white':'#1f2d3d'}}" :height="item.listH || 0" :max-height="item.listH || 0" :empty-text="statusText"  border stripe style="width: 100%" :ccontext="item" @row-click="rowClick">
                            <el-table-column v-for="field in item.orderFields" inline-template  :width="field.columnW || 'auto'" :label="field.name">
                                <div @click="column_click(row,field,item)" :title="converTitleInfo(row,field)">
                                    <span :style="{'text-decoration':blnClickField(field,item.field_options)?'underline':'none',cursor:blnClickField(field,item.field_options)?'pointer':'default'}">{{converShowInfo(row,field)}}</span>
                                </div>
                            </el-table-column>
                            <el-table-column v-if="item.options.length>0" align="center" :width="calOptionW(item.options)" fixed="right" inline-template  label="操作" >
                                <div>
                                    <span class="option_btn" v-for="option in item.options" @click="option_click(option,$index,item.id,row,item.queryFields,item.keyid,item.data,item.queryKind,item.interface,item)" >{{option.name}}</span>
                                </div>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div name="page_container" class="page_container">
                        <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{item.pageIndex+1}}</span></span>
                        <div class="firstPage" @click="pageChange(0,item)">首页</div>
                        <div class="prePage" @click="pageChange(item.pageIndex-1,item)">上一页</div>
                        <div class="nextPage" @click="pageChange(item.pageIndex+1,item)">下一页</div>
                        
                        <el-pagination v-show="false" layout="prev, pager, next" :total="item.data.length" :context="item" :page-size="item.limit" @current-change="pageChange"></el-pagination>
                    </div>
                </div>
                <!--图表页面-->
                <div v-show="item.curShowTmpId==mapTmp['图表'].id" name="page_item_container" :class="{fadeIn:item.curShowTmpId==mapTmp['图表'].id}" :style="{'position':'relative',height:'calc(100% - '+(item.showTemplate.length>1?30:0)+'px)'}">
                    图表页面
                </div>
                <!--地图描点-->
                <div v-show="item.curShowTmpId==mapTmp['地图描点'].id" name="page_item_container" :class="{fadeIn:item.curShowTmpId==mapTmp['地图描点'].id}" :style="{'position':'relative',height:'calc(100% - '+(item.showTemplate.length>1?30:0)+'px)'}">
                    <MapDot :ref="'mapDot'+item.id" :data="item" />
                </div>
                <!--地图路径-->
                <div v-show="item.curShowTmpId==mapTmp['地图路径'].id" name="page_item_container" :class="{fadeIn:item.curShowTmpId==mapTmp['地图路径'].id}" :style="{'position':'relative',height:'calc(100% - '+(item.showTemplate.length>1?30:0)+'px)'}">
                    <!--<MapPath ref="mapPath" :data="item" />-->
                    <MapDot :ref="'mapPath'+item.id" :data="item" :blnPath="true"  />
                </div>
                <!--远程数据-->
                <div v-show="item.curShowTmpId==100" name="page_item_container" :class="{fadeIn:item.curShowTmpId==100}" :style="{'position':'relative',height:'calc(100% - '+(item.showTemplate.length>1?30:0)+'px)'}">
                    <RemoteTable :ref="'remoteTable'+item.id" :data="item" 
                                 :params="params"
                                 :remoteIds="item.remoteIds" 
                                 :converShowInfo="converShowInfo"
                                 :blnClickField="blnClickField"
                                 :calOptionW="calOptionW"
                                 />
                </div>
            </div>
        </div>
        <!--多页面导航展示框-->
        <div style="height:100%;width:60px;" v-if="menus.length>1">
            <VNav :menus="menus" :defId="curPageId" v-on:itemClick="mulPageChange" />
        </div>
        <!--加载中动画-->
        <div class="loading" v-show="blnShowLoading"><div :id="id+'inloading'" class="loadingContainer"></div></div>
        <!--回溯状态信息查看按钮-->
        <div class="iden_container" v-show="blnShowBacktrack"> 
            <div class="iden">
                <el-tooltip  effect="light" content="回溯状态" placement="left">
                    <i class="fa fa-exclamation" @click="lookBackTrack()" />
                </el-tooltip>
            </div>
        </div>
    </div>
</template>

<script>
import {BODY_RESIZE,GET_CONFIG,Add_History_Menu,Get_Operate,Get_OPerate_Data,Add_System_Menus,GetInterface,DynamicData,MenuBacktrackInfo,MenuBacktrackChange,MenuBacktrackCancel} from '../store/mutation-types'
// import {tool} from '../js/tool.js'
import Vue from 'vue'
import { mapState,mapMutations} from 'vuex'
import searchArrType from '../enum/SearchType.js'
import PlaceSearch from '../components/PlaceSearch'
import MapPath from 'components/MapPath'
import MapDot from 'components/MapDot'
import cLoading from '../js/canvasLoading.js'
import FloatBar from 'components/FloatBar'
import handlePop from '../js/dao/handlePop.js'
import Tag from 'components/Tag'
import {tempType} from '../enum/TempType.js'
import tmpDAO from '../js/dao/tmpDao.js'
import virtualIden from 'components/virtualIden'
import VNav from 'components/VNav'
import RemoteTable from 'components/remoteTable'
import MulDropDown from 'components/MulDropDown'
import MaskInput from 'components/maskInput'
import Scroll from 'components/scroll'


let Rx = require('rxjs/Rx');
export default {
  name: 'Template',
  props:['params'],
  components:{
    PlaceSearch,FloatBar,Tag,MapPath,MapDot,virtualIden,VNav,RemoteTable,MulDropDown,MaskInput
  },
  data () {
    return {
       id:'',//页面唯一标识
       simpleTime:{//限制选择今天之前的日期
          disabledDate(time) {
            return false; //time.getTime() < Date.now() - 8.64e7;
          }
       },
       beforeToday:{//限制只能选择今天之前的日期
           disabledDate(time) {
               return time.getTime() > Date.now();
           }
       },
       backtrackList:[],//回溯状态列表信息
       curPageId:'',//当前显示页面Keyid
       mapTmp:tempType,//模板唯一标识符映射对象
       blnShowLoading:false,//是否显示加载中动画
       blnSearch:false,//判定是否正在搜索中
       searchArrType:searchArrType,//查询类型
       emptyInfo:'',//当正在请求数据时显示的提示信息
       listH:[],//列表高度集合
       menus:[],//菜单集合
       remoteData:[{id:1,name:'四川'},{id:2,name:'成都'}],//远程数据集合
       config:{
           id:'',//页面临时标识
           blnRemote:true,//是否有远程取数据功能(全局设置)
           remoteInterface:[],//关联远程数据接口集合(页面配置时设置) 
           remoteIds:[],//远程数据集合
           queryCondition:[{name:'姓名',type:1,defVal:'123',value:'',blnRequried:false,field:'name',table:'table'},{name:'日期',type:3,defVal:'',value:'',blnRequried:false,field:'name',table:'table'}],                                                //查询条件(1:文本框;2:日期;3:日期范围;4:下拉框;)
           orderFields:[{name:'姓名',key:'name'},{name:'部门',key:'depart'}],            //显示字段(后台设置的字段)
           queryFields:[],//查询字段
           relateMenus:[],  //在同一个页面显示的模块ids
           limit:10,//每页显示数量
           skip:0,//跳过多少条数据
           pageIndex:0,//当前页号索引
           data:[],//[{vidlog_id:'小王'},{vidlog_id:'小明'},{vidlog_id:'小1'},{vidlog_id:'小4'}],   //关联菜单页面
           condtion:null,//模块自带条件
           keyid:'',//模块ID
           queryKind:'',//查询类型(展示/查看)
           options:[{name:'详细',id:100},{name:'检查',id:200},{name:'检查',id:300}],  //列表操作按钮
           comOptions:[],//列表公共操作;如导入导出
           field_options:[{key:'name',menuId:1}],//字段响应事件
           curQueryCond:null,//当前列表搜索后的条件对象
           showTemplate:[],//页面展示数据的模板类型(1:列表,2:图表,3:地图描点,4:地图路径)
           curShowTmpId:-1,//当前显示模板标识号
           tmpParam:[],//当前模板相关查询参数
           curSelIndex:-1,//当前选中的行索引
       } 
    }
  },
  computed:mapState({
    statusText(){
         let status=this.params.model.status || {status:this.Menu_State.getKey('完成')},mapStatus=this.Menu_State.getRes(status);
         if(this.Menu_State.getKey('完成')==mapStatus.code){return this.emptyInfo || '暂无数据';}

         return mapStatus.info;
     },
     oriMenus:state=>{
         return state.menus;
     },
     source:state=>{
         return state.oriSource;
     },
     Rx:state=>{return state.Rx;},
     VirType:state=>{return state.VirType;},
     blnShowBacktrack(){
        if(this.backtrackList.length<=0) return false;
        if(_.filter(this.backtrackList,b=>b.status!='completed').length<=0) return false;
        return true;
     }
  }),

  mounted(){
      //获取远程数据集合
    //   this.$store.dispatch(GetInterface).then(res=>{
    //     if(!tool.msg(res)){return}
    //     this.remoteData=res.biz_body;
    //   });
      let self=this,config=tool.Clone(self.config),model=this.params.model.condtionsObj;
      self.id='page_'+tool.guid();
      self.$nextTick(()=>{
        cLoading(self.id+'inloading',7);
      });
      self.curPageId=this.params.model.keyid || '';
      config._keyid=this.params.model.keyid || '';
      config._icon=this.params.model.icon || '';
      config._name=this.params.model.name || '';
      
      
      //判断是否为远程数据显示(远程数据显示时,多个远程数据需要分开显示，已多页面的方式显示)
      let firstInter='',interArr=[];
      if(this.params.model.interface){
          interArr=this.params.model.interface.split(',');
          firstInter = interArr.shift();
          config._name=_.find(this.remoteData,r=>(r.id+'')==firstInter).name;
          config.relateMenus=_.map(interArr,i=>{return config._keyid;});
      }
      
      this.converData(config,model,this.params.model.keyid,this.params.model.extraConditon,firstInter);

      if(config.relateMenus.length>0){
          let promiseArr=[];
          for(let id of config.relateMenus){
              promiseArr.push(self.$store.dispatch(GET_CONFIG,id));
          }
          Promise.all(promiseArr).then((datas)=>{
              this.menus.push(config);
              
              let index=0;
              for(let data of datas){
                  let tempObj=tool.Clone(self.config);
                  tempObj._keyid=data.keyid || '';
                  tempObj._icon=data.icon || '';
                  tempObj._name=interArr.length>0?_.find(this.remoteData,r=>(r.id+'')==interArr[index]).name:data.name || '';

                  self.converData(tempObj,data.condtionsObj,data.keyid,this.params.model.extraConditon,interArr[index]);
                  this.menus.push(tempObj);
                  index++;
              }
             
              this.$nextTick(()=>{
                this.calListH();
              });
          });
      }else{
        this.menus.push(config);
        this.$nextTick(()=>{
            this.calListH();
        });
      }
      
      //获取菜单回溯状态信息
      this.$store.dispatch(MenuBacktrackInfo,this.params.model.keyid).then(res=>{
           this.backtrackList=res.biz_body.data[0].backtrack_list;
      });
      
      //监听菜单回溯状态改变事件
      this.$store.commit(MenuBacktrackChange,{id:this.params.model.keyid,callback:(d)=>{
          let data = _.find(d,i=>i.menu_keyid==this.params.model.keyid);
          if(!data) return;
          
          this.backtrackList=data.backtrack_list || [];
      }});

      this.$store.commit(BODY_RESIZE,()=>{
          this.calListH()
      });
  },
  destroyed(){
      this.$store.commit(MenuBacktrackCancel,this.params.model.keyid);
  },
  methods:{
      //输入框值改变事件
      inputChange(val,item){
        item.defVal=val;
      },
      //刷新功能
      refreshPage(){
        //重新查询菜单数据
        _.each(this.menus,m=>{
            //刷新列表页面数据
            this.query_click(m,m.queryCondition,m.condtion,m.keyid);
            //刷新地图描点页面数据
            if(m.curShowTmpId==this.mapTmp['地图描点'].id){
                this.$refs['mapDot'+m.id][0].refreshPage();
            }
            //刷新地图路径页面数据
            if(m.curShowTmpId==this.mapTmp['地图路径'].id){
                this.$refs['mapPath'+m.id][0].refreshPage();
            }
            //刷新远程数据页面
            if(m.curShowTmpId==100){
                this.$refs['remoteTable'+m.id][0].refreshPage();
            }
        });
      },
      //生成对应的日期范围控件限制条件参数
      timeRangeSet(query){
          let limitSel=tool.Clone(query.range?this.beforeToday:this.simpleTime);
          
          //构造快捷选项
          let shortcuts=_.map(query.timeShort,t=>{
              return {
                  text:t.name,
                  onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    
                    if(t.day==0){//今天(特殊处理)
                        picker.$emit('pick', [start, end]);
                    }else{
                        if(t.tag==0){//之前
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * t.day);
                        }else{//之后
                            end.setTime(end.getTime() + 3600 * 1000 * 24 * t.day);
                        }

                        if(t.odd==0){//范围
                            picker.$emit('pick', [start, end]);
                        }else{//单天
                            t.tag==0?picker.$emit('pick', [start, start]):picker.$emit('pick', [end, end]);
                        }
                    }
                  }
              }
          }) || [];

          limitSel.shortcuts=shortcuts;

          return limitSel;
      },
      //远程数据项单击事件
      remoteItemClick(val,item){
        let i=_.findIndex(item.remoteIds,i=>i.id==val.id);
        
        if(i>=0){
            item.remoteIds.splice(i,1);
        }else{
            item.remoteIds.push(val);
        }
      },
      //列表行单击事件
      rowClick(row,e,config,index){
        if(!config || _.keys(config.templateSet)<=0)return;
        let tmpSet=config.templateSet[tempType['列表'].id];

        config.curSelIndex ==index ? config.curSelIndex=-1 :config.curSelIndex=index;

        _.each(tmpSet,r=>{
            if((row[r.alias] || row[r.key]) && config.curSelIndex>=0){
                r.value=row[r.alias] || row[r.key];
            }else{
                r.value='';
            }
        })

      },
      //tag标签页项单击事件
      tagClick(template,config){
          let tmpSet=config.templateSet;
          let hasTmp=_.keys(tmpSet).length>0;

          //依赖对象
          let relyObject=_.find(tmpSet,t=>{
           return _.find(t,r=>{
                return r.id+''==template+'';
            })
          }) || [];
          
          //判断是否有依赖对象要求
          let blnPass= (hasTmp && relyObject.length>0 && relyObject[0].value) ||
                       (!hasTmp || relyObject.length<=0)

          if(template==this.mapTmp['地图路径'].id && blnPass){
              config.curShowTmpId=template;
              this.$nextTick(()=>{
                this.$refs['mapPath'+config.id][0].init();
              });
          }

          if(template==this.mapTmp['地图描点'].id && blnPass){
              config.curShowTmpId=template;
              this.$nextTick(()=>{
                this.$refs['mapDot'+config.id][0].init();
              });
          }

          if(template==this.mapTmp['列表'].id && blnPass){
              config.curShowTmpId=template;
          }

          if(template==this.mapTmp['图表'].id && blnPass){
              config.curShowTmpId=template;
          }

          if(template==100 && blnPass){//远程数据
              config.curShowTmpId=template;
              this.$nextTick(()=>{
                  this.$refs['remoteTable'+config.id][0].calListH();
              })
          }
  
          if(!blnPass){
              tool.info(relyObject[0].msg);
              this.$refs['tag'+config.id][0].resetSel();
          }
      },
      //多页面切换事件
      mulPageChange(id){
        this.curPageId=id;
        this.$nextTick(()=>{this.calListH()})
      },
      //判断字段是否为可点击跳转
      blnClickField(field,field_option){
        //超链接跳转
        if(field.formatType==4){
            return true;
        }
        if(!field_option){return false;}
        if(field_option.length<=0){return false;}
        let result=false;
        for(let option of field_option){
            if(option.key==field.key){result=true;break;}
        }

        return result;
      },
      //转化字段上提示信息(title)
      converTitleInfo(row,field){
          let info=field.pop_title?(row[field.pop_title] || row[field.table+'_'+field.pop_title]):(row[field.alias] || row[field.key]);
          return tmpDAO.formatData(field,info,row);
      },
      //转化显示字段数据
      converShowInfo(row,field){
          let info=row[field.alias] || row[field.key];
          return tmpDAO.formatData(field,info,row);
      },
      //有场所控件的情况，监听场所控件值改变事件
      placechange(query,val){
        if(!val)query.value='';
        query.value=_.flatten(_.map(val,v=>{return _.map(v,i=>i.code)}));
      },
      //有虚拟身份的情况,监听虚拟身份控件值改变事件
      Idenchange(query,val){
        if(!query)return;
        query.value=val;
      },
      //转化模块定义数据为模板数据
      //inter:'远程数据查看条件'
      //extraConditon:'页面附带的额外限定条件'
      converData(config,model,keyid,extraConditon,inter){
        let self=this;
        config.id=tool.guid(model.show_fields);
        config.blnRemote=model.isRemote || (model.remoteInterface && model.remoteInterface.length>0);
        config.remoteInterface=model.remoteInterface;
        config.relateMenus=model.realtiveMenu?model.realtiveMenu.split(','):[];
        config.orderFields=model.show_fields;
        config.queryFields=model.query_fields;
        config.limit=model.limit;
        config.data =model.data || [],//[{vidlog_id:'2012-12-12 12:12:12',vidlog_number:1},{vidlog_id:'2012-12-12 12:12:12',vidlog_number:1},{vidlog_id:'2012-12-12 12:12:12',vidlog_number:1},{vidlog_id:'2012-12-12 12:12:12',vidlog_number:1}];
        config.options=_.filter(model.field_btns,(btn)=>{return !btn.blnCom;});
        config.field_options=model.field_options;
        config.queryCondition=tool.Clone(model.queryItems);

        //判断查询字段是否包含远程字段
        let remoteSearch= _.filter(config.queryCondition,q=>this.searchArrType[q.type]=='远程字段');
        
        if(remoteSearch){
            for(let i=0;i<remoteSearch.length;i++){
                (function(s,data){
                    s.$store.dispatch(DynamicData,{url:data.filed.remoteUrl}).then(res=>{
                        if(!tool.msg(res,'',''))return;
                        //映射下拉框对应显示字段
                        data.referval=_.map(res.biz_body,r=>{
                            return {
                                name:r[data.filed.remoteName] || '',
                                value:r[data.filed.remoteValue] || '',
                            };
                        });
                    });
                })(self,remoteSearch[i])
            }
        }

        config.condtion=model;
        config.keyid=keyid;
        config.extraConditon=tool.Clone(extraConditon);
        config.interface=tool.Clone(inter);
        config.primaryKey=model.primaryKey;
        config.queryKind=model.query_kind;
        config.showTemplate=tool.Clone(model.templateNum || []);
        config.curShowTmpId=config.showTemplate[0];
        config.tmpParam=model.tmpParam || [];
        config.templateSet=tool.Clone(model.templateSet || {});
        config.comOptions=_.chain(model.field_btns)
                           .filter((btn)=>{return btn.blnCom;})
                           .map(tempItem=>{
                               let item=tool.Clone(tempItem);
                               item.callback=this.public_click;
                               item.name=tempItem.name;
                               item.icon=tempItem.icon;
                               item.param={
                                keyid:config.keyid,
                                queryKind:config.queryKind,
                                queryFields:config.queryFields,
                                option:item,
                                config:config,
                                interface:inter
                               };
                               return item;
                            }).value();

        //获取模板数据
        this.emptyInfo='正在获取数据中.....';

        let tempDatePre=(new Date()).getTime();

         //判断页面是否需要加载额外的数据
        let extraParam={};
        if(extraConditon){
            extraParam= tmpDAO.searchParam(extraConditon,model);
        }

        this.$store.dispatch(Get_OPerate_Data,{interface:config.interface || '',keyid:keyid,condtionsObj:model,extraData:extraParam.param,indexFields:extraParam.sepParam}).then(res=>{
            console.log((new Date()).getTime()-tempDatePre);
            this.emptyInfo='';
            let blnSucess = tool.msg(res,'','获取模板数据失败!');
            if(!blnSucess){return;}
            config.data=res.biz_body;
        });
      },
      //计算列表高度
      calListH(){
          let self=this;
          setTimeout(()=>{
            let pages=$('#'+self.id).find('div[name="page_item"]');
            self.listH=[];
            for(let i=0;i<pages.length;i++){
                let page=$(pages[i]),
                    pageH=page.height(),
                    condH=page.find('div[name="condition"]').height(),
                    pagingH=page.find('div[name="page_container"]').height(),
                    tagH=page.find('div[name="tagcomp"]').length>0?page.find('div[name="tagcomp"]').height():0;
                page.find('div[name="table_container"]').css('height',(pageH-(condH?condH+20:-0))-pagingH-tagH+'px');

                if(!self.menus[i].listH){
                    Vue.set(self.menus[i],'listH',pageH-(condH?condH+20:-0)-pagingH-tagH);
                }else{
                    self.menus[i].listH=pageH-(condH?condH+20:-0)-pagingH-tagH;
                }
            }
          },0);
      },
      //计算操作栏宽度
      calOptionW(options){
        let width=36;
        for(let option of options){
            width+=option.name.length*20;
        }
        return width;
      },
      //查询类型为下拉框时，下拉框项选中改变事件
      dropChange(val,item){
        if(!item)return;
        if(!val){item.defVal='';return;}
        item.defVal=val.value;
      },
      //公共方法单击事件
      public_click(param){
        handlePop.play(param.option,{},{},param.queryFields,this.$store,param.keyid,param.config.data,param.queryKind,param.config.curQueryCond,param.interface,{},this.source);
      },
      //操作栏项单击事件
      option_click(option,index,id,row,fields,keyid,list,queryKind,inter,menu){
          //跳转页面操作
          if(!option.type || option==0){
            //判断是否存在附加限定条件，存在则转换格式
            let extraConditon;
            if(option.mapFields.length>0){
                extraConditon=extraConditon || [];
                for(let field of option.mapFields){
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
            
            //获取菜单
            let getMenu = this.Rx.Observable.create(obs=>{
                let menu = _.chain(this.oriMenus).pluck('menus').flatten().compact().find(item=>{return item.keyid==option.menu.keyid;}).value();//从缓存中获取
                if(menu){obs.next(menu); return;}
                this.$store.dispatch(Get_Operate,option.menu.keyid).then(res=>{ //从服务器获取
                    obs.next(res.biz_body[0]);
                    this.$store.commit(Add_System_Menus,res.biz_body[0]);
                });
            });
            

            getMenu.subscribe(menu=>{
                if(!menu.kind){//列表模板页面
                    this.$store.commit(Add_History_Menu,{
                            id:id+'_'+index+'_'+menu.keyid,
                            keyid:menu.keyid,
                            name:option.name,
                            type:menu.type || 'templatePage',
                            icon:menu.icon || 'fa fa-history',
                            condtionsObj:menu.condtionsObj,
                            status:menu.status,
                            extraConditon:extraConditon,
                            intetface:inter
                    });
                }else if(menu.kind==1){//HTML模板页面
                    let temp_area=menu.popWidth?menu.popHeight?[menu.popWidth+'px',menu.popHeight+'px']:menu.popWidth+'px':'';
                    tmpDAO.openTmp(menu,{extraConditon:extraConditon,intetface:inter},this.$store,{title:option.name,area:temp_area});
                }
            });
          }
          //具体操作(增删改查等)
          if(option.type==1){
            handlePop.play(option,{},row,fields,this.$store,keyid,list,queryKind,{},inter,{},this.source);
          }
          
          //特定操作
          if(option.type==2){
              handlePop.play(option,{},row,fields,this.$store,keyid,list,queryKind,{},inter,menu,this.source);
          }
      },
      //列单击事件
      column_click(row,field,column){
        let field_options=column.field_options,redirectMenu=null,option=null;
        //超链接跳转
        if(field.formatType==4){
            window.open(this.converShowInfo(row,field));
            return;
        }
        if(!(field_options && field_options.length>0))return;
        for(let field_option of  field_options){
            if(field_option.key != field.key){continue;}
            redirectMenu=field_option.menu;
            option=field_option;
        }
        if(!option){return;}
        //判断是否存在附加限定条件，存在则转换格式
        let extraConditon;
        if(option.mapFields.length>0){
            extraConditon=extraConditon || [];
            for(let field of option.mapFields){
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


        if(!redirectMenu)return;

         //获取菜单
        let getMenu = this.Rx.Observable.create(obs=>{
            let menu = _.chain(this.oriMenus).pluck('menus').flatten().compact().find(item=>{return item.keyid==redirectMenu.keyid;}).value();
            if(menu){obs.next(menu); return;}
            this.$store.dispatch(Get_Operate,redirectMenu.keyid).then(res=>{
                obs.next(res.biz_body[0]);
                this.$store.commit(Add_System_Menus,res.biz_body[0]);
            });
        });


        getMenu.subscribe(menu=>{
              if(!menu.kind){//列表模板页面
                this.$store.commit(Add_History_Menu,{
                        id:'field_menu_'+tool.guid(),
                        keyid:menu.keyid,
                        name:redirectMenu.name,
                        type:menu.type || 'templatePage',
                        icon:menu.icon || 'fa fa-history',
                        condtionsObj:menu.condtionsObj,
                        status:menu.status,
                        extraConditon:extraConditon,
                        interface:column.interface
                });
              }else if(menu.kind==1){//HTML模板页面
                  let temp_area=menu.popWidth?menu.popHeight?[menu.popWidth+'px',menu.popHeight+'px']:menu.popWidth+'px':'';
                  tmpDAO.openTmp(menu,{extraConditon:extraConditon,interface:column.interface},this.$store,{title:field.name,area:temp_area});
              }
          });
    
      },
      //搜索单击事件
      //blnNoRemote:是否禁止远程
      //cachCond:缓存条件(记录当前搜索后的条件数据用于翻页使用)
      query_click(config,condtion,model,keyid,callback,blnNoRemote,cachCond){
        // let param=[],self=this;
        // let comCond=_.filter(condtion,cond=>{return !cond.isPrimeIndex;});//一般通用查询条件
        // let sepCond=_.filter(condtion,cond=>{return cond.isPrimeIndex;});//特殊查询条件

        // //构造通用查询条件
        // for(let cond of comCond){
        //     if(!cond.value && !cond.defVal){continue;}

        //     let value=cond.value || cond.defVal || '';
        //     if(self.searchArrType[cond.type]=='日期' && value){
        //         value = tool.Timestamp(value);
        //     }
        //     if(self.searchArrType[cond.type]=='日期范围' && value){
        //         value=[tool.Timestamp(value[0]),tool.Timestamp(value[1])];
        //     }
        //     param.push({
        //         term:'eq',
        //         field:{table:cond.filed.tableKey,key:cond.filed.key,alias:model.query_kind =='show'?cond.filed.key:cond.filed.tableKey+'_'+cond.filed.key},
        //         value:value
        //     });
        // }
        // //if(param.length<=0){return;}
        // let result={term:'',field:{},value:'',condtions:[]};
        // let converParam=(param,result)=>{
        //     if(param.length>1){
        //         let item=param.shift();
        //         result.term='and';
        //         result.condtions[0]=item;
        //         result.condtions[1]={term:'',field:{},value:'',condtions:[]};
        //         converParam(param,result.condtions[1]);
        //     }else{
        //         result.term=param[0].term;
        //         result.field=param[0].field;
        //         result.value=param[0].value;
        //     }
        // };
        // if(param.length>0){
        //     converParam(param,result);
        // }else{
        //     result={};
        // }

        // //获取特殊查询条件
        // let queryKind=model.query_kind;//模板查询类型
        // let sepParam=[];
        // for(let cond of sepCond){
        //     if(!cond.value && !cond.defVal){continue;}

        //     let value=cond.value || cond.defVal || '';
        //     if(self.searchArrType[cond.type]=='日期' && value){
        //         value = [tool.Timestamp(value)];
        //     }
        //     else if(self.searchArrType[cond.type]=='日期范围' && value){
        //         value=[tool.Timestamp(value[0]),tool.Timestamp(value[1])];
        //     }
        //     else{
        //         value=[value]
        //     }
        //     sepParam.push({field:queryKind=='show'?cond.filed.key:cond.filed.tableKey+'_'+cond.filed.key,values:value});
        // }
        
        if(!cachCond)config._cachCond=tool.Clone(condtion);
        let {param:result,sepParam} = tmpDAO.searchParam((cachCond || condtion).concat(config.extraConditon || []),model);
      
        //远程数据查询
        if(config.blnRemote && config.remoteIds.length>0 && !blnNoRemote){
            let hasShow=config.showTemplate.indexOf(100);
            if(hasShow<0){
                config.showTemplate.push(100);
            }

            this.$nextTick(()=>{
                this.$refs['tag'+config.id][0].itemClick(100);
                this.$refs['remoteTable'+config.id][0].query_click();
                config.remoteIds=[];
            });
            return;
        }


        //本地数据查询
        //获取模板数据
        this.blnSearch=true;
        
        let tempDatePre=(new Date()).getTime();
        this.$store.dispatch(Get_OPerate_Data,{interface:config.interface,keyid:keyid,extraData:result,indexFields:sepParam,condtionsObj:model}).then(res=>{
            console.log((new Date()).getTime()-tempDatePre);
            let blnLast=false;
            if(callback){
               blnLast=callback(res.biz_body)
            }
            this.blnSearch=false;
            let blnSucess = tool.msg(res,'','获取模板数据失败!');
            if(!blnSucess || blnLast){return;}
            config.curQueryCond={com:result,sep:sepParam};
            config.data=res.biz_body;
            if(!cachCond)config.pageIndex=0;
        });
      },
      //页号改变事件
      pageChange(number,item){
        // if(!item.curPage){
        //     Vue.set(item,'curPage',number-1);
        // }else{
        //     item.curPage=number-1;
        // }

        let tempModel = tool.Clone(item.condtion);
        
        if(number>=0){
          tempModel.skip=item.limit*number;
        }else{
          number=0;
          tempModel.skip=item.limit*number;
        }

        this.blnShowLoading=true;
        this.query_click(item,item.queryCondition,tempModel,item.keyid,(data)=>{
            this.blnShowLoading=false;
            if(data.length<=0){
                tool.msg({msg:{code:'successed'}},'已经到了最后页!','已经到了最后页!');
                return true;
            }
            item.skip=item.limit*number;
            item.pageIndex=number;
        },true,item._cachCond || []);

      },
      //获取分页数据
      //page_size:每页显示的数量
      //page_number:页号
      pageData(data,page_number,page_size){
          return data;
          //return data.slice(page_size*page_number,(page_number+1)*page_size);
      },
      //查看回溯状态
      lookBackTrack(){
        let s=this;
        tool.open(function(){
            let html=`
                <div style="margin:0px 20px;">
                    <div class="table_header" style="height:auto;">
                        <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                            <thead><tr style="border:1px solid #ddd;">
                                <th style="width:150px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px" class="divEllipsis">数据源</div></th>
                                <th style="width:150px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px" class="divEllipsis">回溯状态</div></th>
                            </tr></thead>
                        </table>
                    </div>
                    <div class="table_header">
                        <div style="height:150px;width:100%;">
                            <Scroll :listen="data" ref="ContentScroll">
                                <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                                    <thead>
                                        <tr style="border:1px solid #ddd;border-top:0px;" v-for="d in data">
                                            <td style="width:150px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px" class="divEllipsis">{{d.name}}</div></td>
                                            <td style="width:150px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px" class="divEllipsis">{{d.statusName}}</div></td>
                                        </tr>
                                    </thead>
                                </table>
                            </Scroll>
                        </div>
                    </div>
                </div>
                <div style="margin:0px 20px;">
                    <div style="float:left;width:40px;height:60px;font-size:40px;">
                        <i class="fa fa-exclamation-triangle"></i>
                    </div>
                    <div style="margin-left:40px;height:60px;padding: 12px;font-size:12px;">
                        当数据源并未全部回溯完时,会在列表右侧出现提示。</br>
                        当数据源已全部完成回溯时,提示图标会自动小时。
                    </div>
                </div>
                <div style="text-align:right;padding:5px 20px;">
                    <button type="button" class="btn btn-default" @click="cancel()">关闭</button>
                </div>
            `;
            let param={
                title:'回溯状态显示',
                area:'400px',
                content:`<div class="openTmp" style="width:100%;height:100%;overflow-y:auto;padding:10px 0px;">${html}</div>`,
                components:{Scroll},
                store:s.$store,
                context:{
                    data:_.map(s.backtrackList,b=>{
                        b.statusName=(s.Menu_State[b.status] || {info:''}).info;
                        if(s.Menu_State.getKey('完成')==b.status){
                            b.statusName=b.statusName+(b.count>0?'':' (无数据)');
                        }
                        return b;
                    }),
                    cancel(){param.close()}
                },
                success(){
                    setTimeout(()=>{
                        param.$refs.ContentScroll.reloadyScroll();
                    },200)
                    
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
    .el-table{border:none;}
    .el-table__header th div,
    .el-table__header th{background-color:transparent !important;color:white;}
    .el-table__header tr{background-color:@Font_Hover_Col;}
    .el-table__fixed-right{box-shadow:none !important;}
    .el-table__fixed-right:before{background-color: transparent;}
    
    .el-table--border th:nth-last-child(1){border-right:none;}
    .el-table--striped .el-table__body tr:nth-child(2n) td {background:transparent;}
    .el-table--enable-row-hover tr:hover > td{background-color:@Font_Hover_Col !important;color:white !important;}
    //.el-table__body-wrapper{overflow-x:hidden !important;}
    .template .overflow,
    .template .el-table .cell div{overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
    .template .el-table__fixed-header-wrapper tr th:nth-last-child(1):after,
    .template .el-table__fixed-body-wrapper tr td:nth-last-child(1):after{content: '';
        background-color: #e0e6ed;
        position: absolute;
        width: 1px;
        height: 100%;
        top: 0px;
        left: 0px;
        
    }
    .template .el-table__fixed-right::before{background-color:#e0e6ed;}
    //  .template .el-table__body-wrapper td[class*="lastTwo"]{border-right:0px;}
    //  .template .el-table__header-wrapper th[class*="lastTwo"]{border-right:0px;}
    //  .template .el-table__fixed-header-wrapper th[class*="lastTwo"]{border-right:0px;}
    //.template .el-table__fixed-header-wrapper .is-hidden{border-right:0px;}
    //.template .el-table__fixed-right{border-left:1px solid #e0e6ed;}
</style>
<style scoped lang="less">
    @import "../css/variables.less";
    .template{width:100%;height:100%;text-align:left;padding:5px;position:relative;}
    .template .page{background-color:@FrontCol;margin-bottom:0px;position:relative;width:100%;height:100%;}
    .template .page .condition{.border('bottom');padding:10px;}

    .template .page .condition .item{float:left;margin-right:10px;}
    .template .page .condition .item .title{display:inline-block;margin-right:10px;line-height:40px;}
    .template .page .condition .item .input{float:right;}


    .template .table_container .option_btn{margin-right:10px;cursor:pointer;color:@Font_Hover_Col;}
    .template .table_container .option_btn:hover{color:@Font_Hover_Col;}

    //加载中动画
    .loading{position: absolute;top:0px;left:0px;right:0px;bottom:0px;}
    .loadingContainer{text-align: center;position: absolute;left: 50%;margin-left: -50px;top: 50%;margin-top: -50px;}


    //多页面展示框


    //远程数据项
    .remote_item{padding:0px 10px;font-size:12px;.border('bottom');}
    .remote_item:hover{cursor:pointer;color:white;background-color:@Font_Hover_Col;}

    .template .iden_container{
        position: absolute;
        top: 2px;
        right: 2px;
        width: 30px;
        height: 30px;
        background-image:linear-gradient(45deg,transparent 50%,#dd5044 50%),
                         linear-gradient(45deg,transparent 49%,#dd5044 10%) ;
    }
    .template .iden{position:absolute;right:5px; top: -1px;color: white;font-size:18px;cursor:pointer;}

</style>
