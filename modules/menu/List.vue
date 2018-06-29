<!-- 列表配置页面 -->
<template>
    <div class="List">
        <!--列表配置条件显示-->
        <div class="table_cond">
          <!--标题栏-->
          <div class="title"><span class="name"><i class="fa fa-cog fa-fw"></i>列表配置</span></div>
          <!--操作项容器-->
          <div class="option_bar">
            <Scroll ref="optionScroll">

              <div class="item">
                <div class="option_bar_title">每页显示条数</div>
                <el-input-number v-model="limit" :min="1" :max="10000"></el-input-number>
              </div>

              <div class="item">
                <div class="option_bar_title">排序字段</div>
                <el-select v-model="sort_by" clearable placeholder="请选择">
                    <el-option
                        v-for="field in fields"
                        :label="field.name"
                        :value="field.key">
                    </el-option>
                </el-select>
              </div>

              <div class="item">
                <div class="option_bar_title">是否降序</div>
                <el-button-group>
                    <el-button style="width:90px;" :class="{active:is_desc}" @click="is_desc=true;">是</el-button>
                    <el-button style="width:90px;" :class="{active:!is_desc}"@click="is_desc=false;">否</el-button>
                </el-button-group>
              </div>

              <div class="item" style="padding-left:5px;padding-right:5px;">
                <div class="option_bar_title">选择模板</div>
                <div>
                  <span v-for="t in templates" style="margin-right:10px;cursor:pointer;" @click="templateClick(t)">
                    <i class="fa" :class="{'fa-square-o':template.indexOf(t.value)<0,'fa-check-square-o':template.indexOf(t.value)>=0}">
                    <span style="font-size:12px;">{{t.label}}</span>
                  </span>
                  
                  <!--<span style="font-size:12px;text-decoration:underline;cursor:pointer;" :style="{color:template.length<=1?'gray':'black'}"  @click="tmp_setting()">配置</span>-->
                </div>
              </div>

              <div class="item">
                  <div class="option_bar_title">关联页面</div>
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

              <div class="item" v-if="remoteInters.length>0">
                  <div class="option_bar_title">远程字段</div>
                  <div>
                      <MulDropDwon :data="remoteInterface" keyProp="name" id="id" style="width:180px;">
                        <div class="remote_item" v-for="t in remoteInters" @mousedown="remoteitemClick(t)">{{t.name}} <i v-if="isHasSelItem(remoteInterface,t.id)" class="fa fa-check" style="float:right;margin-top: 10px;"></i></div>
                      </MulDropDown>
                  </div>
              </div>

            </Scroll>
          </div>
        </div>
        <!--列表显示-->
        <div class="table_show">
          <!--标题栏-->
          <div class="title">
            <span class="name"><i class="fa fa-image" style="margin-right:5px;"></i>数据预览</span>

            <div class="option_bar_right">
              <span class="item" @click="addQuery()"><i class="fa fa-search" style="margin-right:5px;"></i>查询条件</span>
              <span class="item" @click="AddOptionBtn()"><i class="fa fa-pencil" style="margin-right:5px;"></i>操作按钮</span>
              <span class="item" @click="AddField()"><i class="fa fa-plus" style="margin-right:5px;"></i>新增字段</span>
              <span class="item"><i class="fa fa-refresh" style="margin-right:5px;"></i>刷新</span>
              <span class="item" @click="fullSrceen()"><i class="fa fa-arrows-alt" style="margin-right:5px;"></i>全屏预览</span>
            </div>
          </div>
          <!--内容栏-->
          <div class="content">
              <PreView ref="PreView" :data="config" :headerBtns="headerBtns" :selIndex="config.fields.length" :store="store" v-on:headerClick="listHeaderClick" v-on:fixHeaderClick="fixHeaderClick" />
          </div>
        </div>
        <!--字段条件显示-->
        <div class="field_cond">
          <!--标题栏-->
          <div class="title">
            <span class="name"><i class="fa fa-cog fa-fw" ></i>{{setField?'字段属性':'操作按钮'}}</span>
            <span v-if="setField" style="font-size:12px;font-weight:600;margin-left:5px;">({{setField && setField.name}})</span>
          </div>
          <!--字段属性内容栏-->
          <div class="content" style="padding:15px;" v-if="setField">
            <Scroll ref="fieldScroll">
              <div class="row" style="margin-left:0px;margin-right:0px;">
                  <div class="item">
                    <div class="info">字段标题 :</div>
                    <div class="bar"><el-input v-model="setField.showName" placeholder="请输入内容"></el-input></div>
                  </div>
                  <div class="item" v-if="setField.blnExtra">
                    <div class="info">来源字段 :</div>
                    <div class="bar">
                        <el-select v-model="setField.mapField"  placeholder="请选择(必选)">
                            <el-option
                                v-for="f in oriFields"
                                :label="f.name"
                                :value="f.key">
                            </el-option>
                        </el-select>
                        <!--验证错误提示信息-->
                        <div class="validInfo" v-if="!blnVaildField" @mousedown="blnVaildField=true">
                            请选择<i class="fa fa-remove"></i>
                        </div>
                    </div>
                  </div>
                  <div class="item">
                    <div class="info">转换显示 :</div>
                    <div class="bar">
                        <el-select v-model="setField.fun" clearable  placeholder="请选择">
                            <el-option
                                v-for="kind in setField.show_format || formatData"
                                :label="kind.name"
                                :value="kind.val">
                            </el-option>
                        </el-select>
                    </div>
                  </div>
                  <div class="item">
                    <div class="info">字段宽度 :</div>
                    <div class="bar"><el-input v-model="setField.width" placeholder="自适应"></el-input></div>
                  </div>
                  <div class="item">
                    <div class="info">是否显示 :</div>
                    <div class="bar">
                      <el-button-group>
                          <el-button style="width:90px;" :class="{active:!setField.blnShow}" @click="setField.blnShow=0;">是</el-button>
                          <el-button style="width:90px;" :class="{active:setField.blnShow}"@click="setField.blnShow=1;">否</el-button>
                      </el-button-group>
                    </div>
                  </div>
                  <div class="item" v-if="fieldSet || setField.fieldType==4">
                    <div class="info">字段类型 :</div>
                    <div class="bar">
                        <div class="card">
                            <div class="info">类型:{{setField.fieldType==4?'超链接':'页面跳转'}}</div>
                            <div class="btnOption" @click="removeFieldOption()"><i class="fa fa-remove"></i></div>
                        </div>
                    </div>
                  </div>
                  <div class="clearfix"></div>
              </div>
              
              <!--经过讨论暂时取消字段类型-->
              <div class="row" style="display:none;">
                <div class="item">
                  <div class="info">字段类型 :</div>
                  <div class="bar">
                    <el-select style="width:166px;" v-model="setField.fieldType" placeholder="请选择">
                        <el-option
                            v-for="kind in fieldKind"
                            :label="kind.name"
                            :value="kind.val">
                        </el-option>
                    </el-select>
                  </div>
                </div>
              </div>

              <!--格式化字段设置-->
              <div class="row" v-show="setField.fieldType==1">
                <div class="item" style="width:510px;">
                  <div class="info">
                    <el-dropdown trigger="click" @command="selFormatItem">
                      <span class="el-dropdown-link">
                        {{setlFormatTypeName(setField)}}<i class="el-icon-caret-bottom el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="0">文本格式</el-dropdown-item>
                        <el-dropdown-item command="1">日期格式</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>:
                  </div>
                  <div class="bar">
                    <el-input style="width:400px;" v-model="setField.Format_express" placeholder="输入表达式"></el-input>
                  </div>
                </div>
              </div>

              <!--组合字段设置-->
              <div v-show="setField.fieldType==2">
                <div class="row">
                  <div class="item" style="width:510px;">
                    <div class="info">组合字段 :</div>
                    <div class="bar">
                      <el-select v-model="setField.groupFields" style="width:400px;" multiple placeholder="请选择">
                          <el-option
                            v-for="f in CFields"
                            :label="f.name"
                            :value="f">
                          </el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="item" style="width:510px;">
                    <div class="info">设置表达式 :</div>
                    <div class="bar"><el-input style="width:400px;" v-model="setField.Format_group_express" placeholder="请输入表达式"></el-input></div>
                  </div>
                </div>
                <div class="row">
                  <div class="item" style="width:510px;">
                    <div class="info">注意事项 :</div>
                    <div class="bar" style="width:400px;">
                      请根据所选字段的表名+符号'.'+字段名来设置格式化</br>
                      例如:{ tabeA.name } - { tableB.name }
                    </div>
                  </div>
                </div>
              </div>

              <!--组合字段设置-->
              <div v-show="setField.fieldType==3">
                <div class="row">
                  <div class="item" style="width:510px;">
                    <div class="info">选择参数 :</div>
                    <div class="bar">
                      <el-select v-model="setField.remoteFields" style="width:400px;" multiple placeholder="请选择">
                          <el-option
                            v-for="f in CFields"
                            :label="f.name"
                            :value="f">
                          </el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <template v-for="f in setField.remoteFields">
                  <div class="row">
                    <div class="item" style="width:510px;">
                      <div class="info">选择参数 :</div>
                      <div class="bar"><el-input style="width:400px;" placeholder="请输入参数"></el-input></div>
                    </div>
                </template>
              </div>
            </Scroll>
          </div>

          <!--操作按钮内容栏-->
          <div class="content" style="padding:15px;" v-if="!setField">
              <Scroll ref="btnsScroll" :listen="field_btns">
                <div class="btn_item" v-for="(item,index) in field_btns">
                  <div style="float:left;width:50px;height:100%;font-size:35px;text-align:center;">
                            <i :class="item.menu.icon" style="font-size:30px;"></i>
                  </div>
                  <div style="margin-left:50px;margin-right:0px;font-size:12px;text-align:right;margin-right:5px;">
                      <div>{{item.name}}</div>
                      <div>类型:{{item.type==0?"跳转":"操作"}}
                      <el-tooltip v-show="item.type==0 && item.mapFields && item.mapFields.length>0" effect="light" content="查看映射条件" placement="top">
                          <i style="margin-left:5px;" class="fa fa-info optionInfo" @click="lookMap(item)"></i>
                      </el-tooltip>
                      </div>
                      <div>菜单:{{item.menu.name}}</div>
                  </div>
                  <div style="position:absolute;right:0px;top:0px;width: 30px;height: 100%;font-size: 20px;text-align: center;line-height: 60px;border-left: 1px solid #ebedee;">
                      <i class="fa fa-close" style="cursor:pointer;"  @click="del_btn(index)"></i>
                  </div>
                </div>
              </Scroll>
          </div>
        </div>
    </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import PreView from './preview'
import Scroll from 'components/Scroll'
import {dropVal as tempType} from '../../enum/TempType.js'
import MulDropDwon from 'components/MulDropDown'
import IconSelector from 'components/IconSelector'
import ParamPass from 'components/ParamPass'
import MapRelation from 'components/mapRelation'
import optionHandle from '../../js/dao/handlePop.js'
import SpecificOps from '../../enum/SpecificOps.js'

import {BODY_RESIZE,Clear_Menu_Setting,Set_Menu_Setting} from '../../store/mutation-types'
export default {
  name: 'List',
  components:{PreView,Scroll,MulDropDwon},
  data () {
    return {
      store:null,
      limit:10,//列表显示条数
      kind:['show'],//查询类型(默认展示)为了兼容前面的版本有监察回溯的情况
      setField:null,//当前设置的字段
      fieldKind:[{name:'普通字段',val:'0'},{name:'超链接字段',val:'4'}],//{name:'格式化字段',val:'1'},{name:'组合字段',val:'2'},{name:'远程字段',val:'3'},
      sort_by:'',//排序字段
      is_desc:true,//排序方向(true:降序;false:升序)
      templates:tool.Clone(tempType),//[{label:'列表',value:1},{label:'图表',value:2},{label:'地图描点',value:3},{label:'地图路径',value:4}],
      template:[1],//模板类型,
      remoteInterface:[],//远程接口
      realtiveMenu:'',//关联页面
      field_btns:[],//操作按钮
      field_options:[],//字段操作
      queryCondition:[],//查询条件
      headerBtns:[],//列表头列操作按钮
      blnVaildField:true,//验证新增字段是否选择的映射字段
      config:{
        primaryKey:'',//数据源主键
        relateMenus:[],//关联页面
        showTemplate:[],//页面展示数据的模板类型(1:列表,2:图表,3:地图描点,4:地图路径)
        queryCondition:[],//查询条件
        fields:[],//显示字段数
        orderFields:[],//排序过后显示的字段
        remoteInterface:[],//远程接口(选项)
        remoteIds:[],//远程接口选择查询的ID集合
        field_btns:[],//操作按钮
        field_options:[],//字段操作
      }
    }
  },
  watch:{
    setting:{
      deep:true,
      handler:function(){
        this.$store.commit(Set_Menu_Setting,this.setting);
      }
    },
    setField:{
      deep:true,
      handler:function(){
        if(!this.$refs.fieldScroll)return;
        this.$nextTick(()=>{
          if(!this.$refs.fieldScroll)return;
          this.$refs.fieldScroll.reloadyScroll();
        });
        
      }
    },
    realtiveMenu(){
      this.config.relateMenus=_.compact([this.curMenuKeyid,this.realtiveMenu]);
      this.$nextTick(()=>{
        this.$refs.PreView.layout();
      });
    }
  },
  computed:mapState({
    PageData:state=>{
        return state.menuManage;
    },
    setting(){
      return {
        limit:this.limit,
        setField:this.setField,
        sort_by:this.sort_by,
        is_desc:this.is_desc,
        template:this.template,
        remoteInterface:this.remoteInterface,
        realtiveMenu:this.realtiveMenu,
        field_btns:this.field_btns,
        field_options:this.field_options
      };
    },
    //当前选中字段的字段操作
    fieldSet(){
        if(!this.setField) return null;
        return _.find(this.field_options,f=>f.key==this.setField.key);
    },
    //判断当前查询模式(展示/查询)
    dataKindComputed(){
      if(this.kind.length<=0)return -1;
      let blnShow=this.kind.join(',').indexOf('show')>=0;
      return blnShow?0:1;//0:展示,1:查询
    },
    //远程接口配置数据
    remoteInters:state=>{
      let tables=[state.menuManage.curSelTable];
      return _.chain(tables)
              .map(t=>t.remoteInterface || [])
              .flatten()
              .uniq(t=>{return t.id})
              .value();
    },
    fields:state=>state.menuManage.selFields,
    CFields:state=>{
     return tool.Clone(state.menuManage.selFields);
    },
    oriFields:state=>{
        return _.filter(state.menuManage.selFields,f=>!f.blnExtra);
    },
    menus:state=>{
        let cruMenu= state.menuManage.menu,menus=state.setting.menus;
        let result=[];
        if(!cruMenu){return menus;}
        for(let menu of  menus){
          if(menu.keyid==cruMenu.keyid){continue;}
          result.push(menu);
        }
        return result;
    },
    menu:state=>state.menuManage.menu,
    table:state=>state.menuManage.curSelTable,
    curMenuKeyid:state=> state.menuManage.menu.keyid,
    menuSet:function(){
        return this.$store.getters.menu_set()
    },
    formatData:state=>state.formatData
  }),
  mounted(){
    this.recoverData();
    this.config.fields=this.fields;
    this.config.remoteInterface=this.remoteInterface;
    this.config.showTemplate=this.template;
    this.config.primaryKey=this.PageData.curSelTable.primeKey;
    this.config.relateMenus=_.compact([this.curMenuKeyid,this.realtiveMenu]);
    this.config.field_btns=this.field_btns;

    this.config.field_options=this.field_options;
    this.config.queryCondition=this.queryCondition;

    this.store=this.$store;

    //判断当前数据源是否有设置描点的功能
    this.templates=tool.Clone(tempType);

    if(!this.table.is_longlat){
      this.templates=_.filter(this.templates,tmp=>{return tmp.value!=3;})
    }
    //判断当前数据源是否有设置路径的功能
    if(!this.table.mapTrack){
      this.templates=_.filter(this.templates,tmp=>{return tmp.value!=4;})
    }

    //设置当前列表头操作按钮
    this.headerBtns=[
        {name:'字段操作',icon:'fa fa-pencil',action:(f)=>{
            if(!this.blnMapField()) return;
            this.setField=f;
            this.add_field_option(f);
        }},
        {name:'删除',icon:'fa fa-remove',action:(f)=>{
           let index = _.findIndex(this.config.fields,field=>field.key==f.key);
           if(index<0) return;
           this.removeFieldOption(f);
           if(this.setField && this.setField.key==f.key){
               this.setField=null;
           }
           this.config.fields.splice(index,1);
        }}
    ];
  },
  methods:{
    //清空数据
    clearData(){
      this.$store.commit(Clear_Menu_Setting);
    },
    //恢复页面之前操作的值
    recoverData(){
      let {limit,setField,sort_by,is_desc,template,remoteInterface,realtiveMenu,field_btns,field_options,queryCondition} =this.PageData;
      this.limit=limit;
      this.setField=setField;
      this.sort_by=sort_by;
      this.is_desc=is_desc;
      this.template=template;
      this.remoteInterface=remoteInterface;
      this.realtiveMenu=realtiveMenu;
      this.field_btns=field_btns;
      this.field_options=field_options;
      this.queryCondition=queryCondition;
    },
    //添加字段
    AddField(){
        let field={
            table:this.table.key,
            key:'field'+tool.guid(),
            name:'转换字段',
            blnShow:0,
            fieldType:'0',
            formatType:'0',
            columnW:'',
            width:'',
            showName:'转化字段',
            remoteFields:[],
            Format_express: "",
            Format_group_express: "",
            format:'',
            groupFields:'',
            mapField:'',//新增字段映射字段属性
            fun:'',
            blnExtra:true,

        }
        if(!this.blnMapField()) return;
        this.config.fields.push(field);
        this.setField=field;
    },
    //添加查询条件
    addQuery(){
      this.queryCondition.push(
        {name:'',type:'1',defVal:'',value:'',filed:'',mask:'',searchFormat:'',referval:[],dropVal:'',range:0,timeShort:[],blnAdd:1,}
      );
    },
    //转化索引为字段映射组件需要的格式
    converIndexs(indexs){
      let self=this;
      let converIndex={};
      for(let indexArrStr of indexs){
          let indexArr=indexArrStr.split(',');
          for(let index of indexArr){
              let tableKey=index.split('@_@')[0],filedKey=index.split('@_@')[1];
              for(let source of self.allTables){
                  if(source.key!=tableKey)continue;
                  let field=source.fields[filedKey];
                  if(!field){continue;}
                  converIndex[index]=converIndex[index] || [];
                  converIndex[index].push({key:index,name:field.name,tableName:source.name,tableKey:source.key,fieldKey:field.key});
              }
          }
      }
      return converIndex;
    },
      
    //转化映射的索引字段为对应的字段对象
    converMapIndexs(){
        let indexFields={};
        let table=this.table;
        let indexFs=this.table.indexFields;
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

        return indexFields;
    },
    //获取索引的字段
    GetIndexs(){
        let blnShowPattern=this.menuSet.query_kind.indexOf('show')>=0;//是否为展示模式(否:查询模式)
        let indexs=this.menuSet.indexs || [];
        let fields=this.menuSet.indexFields || this.converMapIndexs() || [];
        //转化索引为字段映射控件需要的数据格式
        let converIndex=this.converIndexs(indexs);

        return blnShowPattern?fields:converIndex;
    },
    //删除字段操作
    removeFieldOption(f){
        if(!this.setField && !f) return;
        let field=f || this.setField;
        let index = _.findIndex(this.field_options,f=>f.key==field.key);
        if(index<0) return;
        this.field_options.splice(index,1);
    },
    //添加字段操作
    add_field_option(f){
        let self=this;
        let fieldOption=f?_.find(self.field_options,o=>o.key==f.key) || '':'';
        let indexFields=(_.find(self.menus,m=>m.keyid == (fieldOption || {menu:{keyid:''}}).menu.keyid) || {condtionsObj:{indexFields:[]}}).condtionsObj.indexFields; 
        let mapFields = _.chain(indexFields || {}).values().flatten().value();

        let html=`
          <form class="form-horizontal" role="form">
                <div class="form-group" style="margin-bottom:10px !important;">
                  <label class="col-sm-2 control-label" style="font-weight:300;padding: 0px;margin-top: 10px;">字段类型</label>
                  <div class="col-sm-10">
                    <el-select v-model="field.fieldType" placeholder="请选择">
                        <el-option
                            v-for="kind in fieldKind"
                            :label="kind.name"
                            :value="kind.val">
                        </el-option>
                    </el-select>
                  </div>
                </div>
              <div class="form-group" style="margin-bottom:10px !important;" v-if="blnShowField">
                  <label class="col-sm-2 control-label" style="font-weight:300;padding: 0px;margin-top: 10px;">字段</label>
                  <div class="col-sm-10">
                        <el-select v-model="field" placeholder="请选择">
                          <el-option
                          v-for="item in fields"
                          :label="item.tableName+'_'+item.name"
                          :value="item">
                          </el-option>
                      </el-select>
                  </div>
              </div>
              <div class="form-group" style="margin-bottom:10px !important;" v-show="field.fieldType!=4">
                  <label class="col-sm-2 control-label" style="font-weight:300;padding: 0px;margin-top: 10px;">关联选择</label>
                  <div class="col-sm-10">
                      <el-select v-model="menu" placeholder="请选择" @change="menuChange">
                          <el-option
                          v-for="item in options"
                          :label="item.name"
                          :value="item">
                          </el-option>
                      </el-select>
                  </div>
              </div>
              <div class="form-group" style="margin-bottom:10px !important;margin-top:20px !important;padding:0px 15px;" v-show="field.fieldType!=4 && target && target.length>0">
                <MapRelation ref="MapRelation" :defVal="mapRes" :source="source" :target="target" />
              </div>

          </form>
          <div style="text-align:right;padding-right:15px;">
              <button type="button" class="btn btn-success" @click="submit_btn()">确定</button>
              <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
          </div>
        `;

            
          tool.open(function(menus,curMenu){
          let param = {
              title:'添加字段操作',
              area:'500px',
              content:`<div class="add_btn_option" style="padding:10px;">${html}</div>`,
              components:{ParamPass,MapRelation},
              context:{
                  blnShowField:!!!f,
                  field:f || '',
                  fieldKind:self.fieldKind,
                  menu:fieldOption?_.find(menus,m=>m.keyid==fieldOption.menu.keyid) || '':'',
                  source:self.menuSet.show_fields,//当前菜单显示字段集合
                  target:mapFields,//关联页面允许被指定的映射字段
                  mapRes:fieldOption?fieldOption.mapFields || []:[],//映射字段结果集合
                  fields:self.fields || [],
                  options:menus,
                  submit_btn(){
                    if(param.selfData.field.fieldType==4){
                        self.removeFieldOption();
                        param.close();
                        return;
                    }

                    
                    let mapRes=tool.Clone(_.filter(param.$refs.MapRelation.result,r=>r.source));

                    let menu =param.selfData.menu;
                    self.field_options.push({
                                            name:param.selfData.field.name,
                                            type:0,//0:跳转页面1:具体操作
                                            key:param.selfData.field.key,
                                            mapFields:mapRes,
                                            menu:{keyid:menu.keyid,icon:menu.icon,name:menu.name}
                                            });
                    param.close();
                  },
                  cancel_btn(){
                    if(param.selfData.field.fieldType==4 && fieldOption){
                        param.selfData.field.fieldType='0';
                    }

                    param.close();
                  },
                  menuChange(menu){
                    if(!menu){return;}
                    let fields= _.chain(menu.condtionsObj.indexFields || {}).values().flatten().value();
                    param.selfData.target=fields;
                    param.$refs.MapRelation.clear();
                  }
              }
          };
          return param;
          }(self.menus,self.menu));
    },
    //添加操作按钮
    AddOptionBtn(){
      let self=this;
      let html=`
        <form class="form-horizontal containerBar btnOptionPop" role="form">
            <div class="form-group" style="margin-bottom:10px !important;">
                <label class="col-sm-2 control-label" style="font-weight:300;">名称</label>
                <div class="col-sm-10">
                    <el-input placeholder="请输入内容" v-model="name"></el-input>
                </div>
            </div>
            <div style="margin:10px 15px;">
                <el-tabs type="border-card">
                    <el-tab-pane label="页面跳转" name="first">
                        <div class="form-group" style="margin-bottom:10px !important;">
                            <label class="col-sm-2 control-label" style="font-weight:300;">菜单</label>
                            <div class="col-sm-10">
                                <el-select v-model="menu" placeholder="请选择" @change="menuChange">
                                    <el-option
                                    v-for="item in options"
                                    :label="item.name"
                                    :value="item">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="form-group" style="margin-bottom:10px !important;margin-top:20px !important;padding:0px 15px;">
                            <ParamPass :result="mapRes" :source="source" :target="target" />
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="具体操作" name="second">
                        <div class="clearfix" style="margin-bottom:5px;">
                            <label class="col-sm-3 control-label" style="font-weight:300;">操作类型</label>
                            <div class="col-sm-9">
                                <el-select v-model="kind" placeholder="请选择" @change="optionChange">
                                    <el-option
                                    v-for="item in operateKind"
                                    :label="item.name"
                                    :value="item">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="clearfix" style="margin-bottom:5px;">
                            <label class="col-sm-3 control-label" style="font-weight:300;">操作图标</label>
                            <div class="col-sm-9">
                                <div class="icon_container">
                                <div class="btn" @click="select_icon()"><i class="fa fa-navicon"></i></div>
                                <div class="info"><i :class="icon"></i></div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group" style="margin-bottom:10px !important;margin-top:20px !important;padding:0px 15px;">
                            <el-checkbox style="margin-left:40px;font-weight:normal;" v-model="commonOption">公共操作</el-checkbox>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="特定操作" name="third">
                        <div class="clearfix" style="margin-bottom:5px;">
                            <label class="col-sm-3 control-label" style="font-weight:300;">操作类型</label>
                            <div class="col-sm-9">
                                <el-select v-model="kind" placeholder="请选择" @change="optionChange">
                                    <el-option
                                    v-for="item in SpecificOps"
                                    :label="item.name"
                                    :value="item">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="clearfix" style="margin-bottom:5px;">
                            <label class="col-sm-3 control-label" style="font-weight:300;">操作图标</label>
                            <div class="col-sm-9">
                                <div class="icon_container">
                                <div class="btn" @click="select_icon()"><i class="fa fa-navicon"></i></div>
                                <div class="info"><i :class="icon"></i></div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group" style="margin-bottom:10px !important;margin-top:20px !important;padding:0px 15px;">
                            <ParamPass :result="mapRes" :source="source" :target="sepTarget" />
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </form>
        <div class="optionBar" style="text-align:right;padding-right:15px;">
            <button type="button" class="btn btn-success" @click="submit_btn()">确定</button>
            <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
        </div>
      `;

        tool.open(function(menus,curMenu,store){
        let param = {
            title:'添加按钮操作',
            area:'600px',
            content:`<div class="add_btn_option" style="padding:10px;">${html}</div>`,
            components:{ParamPass},
            context:{
                name:'',
                menu:'',
                source:self.menuSet.query_fields,//当前菜单查询字段集合
                target:{},//关联页面允许被指定的映射字段(页面跳转用)
                sepTarget:self.GetIndexs(),//允许映射的字段(特定操作用)
                mapRes:self.menuSet.field_btns.mapFields || [],//映射字段结果集合
                options:menus,
                kind:null,//操作类型
                icon:'',//具体操作项的icon值
                commonOption:false,//是否为公共操作(false:对应的数据行操作,ture:针对整个列表的操作)
                operateKind:optionHandle.getSourceAction(self.menu,[self.table],tool.Clone(self.fields)),//具体数据源允许执行的操作
                SpecificOps:SpecificOps,//特定操作执行项(如:路径)
                submit_btn(){
                    let menu =param.selfData.menu,kind=param.selfData.kind;
                    //设置页面跳转按钮
                    if(menu){
                        self.field_btns.push({
                            name:param.selfData.name,
                            type:0,//0:跳转页面1:具体操作
                            menu:{keyid:menu.keyid,icon:menu.icon,name:menu.name},
                            icon:menu.icon,
                            mapFields:param.selfData.mapRes
                        });
                    }

                    //设置具体操作按钮
                    if(kind && !kind.type){
                        self.field_btns.push({
                            name:param.selfData.name || kind.name,
                            type:1,//0:跳转页面1:具体操作
                            menu:{keyid:self.menu.keyid,icon:param.selfData.icon,name:self.menu.name},
                            icon:param.selfData.icon,
                            value:kind,
                            blnCom:param.selfData.commonOption //是否为功能操作
                        });
                    }

                    //特定操作
                    if(kind && kind.type==2){
                        self.field_btns.push({
                            name:param.selfData.name,
                            type:2,//0:跳转页面1:具体操作2:特定操作
                            menu:{keyid:menu.keyid,icon:menu.icon,name:menu.name},
                            icon:menu.icon,
                            value:kind,
                            mapFields:param.selfData.mapRes
                        });
                    }

                    param.close();
                },
                cancel_btn(){
                    param.close();
                },
                //页面跳转下拉框选择改变事件
                menuChange(menu){
                    if(!menu){return;}
                    let data=param.selfData;
                    data.clearOptionSetting();

                    // let blnShowPattern=self.menuSet.query_kind.indexOf('show')>=0;//是否为展示模式(否:查询模式)
                    // let indexs=self.menuSet.indexs || [];
                    // let fields=self.menuSet.indexFields || [];
                    // //转化索引为字段映射控件需要的数据格式
                    // let converIndex=self.converIndexs(indexs);
                    // param.selfData.target=blnShowPattern?fields:converIndex;
                    param.selfData.target=menu.condtionsObj.indexFields || [];
                },
                //页面操作下拉框选择改变事件
                optionChange(menu){
                    if(!menu || !menu._key){return;}
                    let data=param.selfData;
                    data.clearMenuSetting();
                },
                //清除页面跳转相关设置信息
                clearMenuSetting(){
                    let data=param.selfData;
                    data.target={};
                    data.mapRes=[];
                    data.menu='';
                },
                //清除页面操作相关设置信息
                clearOptionSetting(){
                    let data=param.selfData;
                    data.commonOption=false;
                    data.kind=null;
                    data.icon='';
                },
                //选择图标操作
                select_icon(){
                    tool.open(function(store,icon,params){
                        let ins={
                            title:'图标选择',
                            area:['80%','80%'],
                            offset:'50px',
                            components:{
                                IconSelector
                            },
                            context:{
                                store:store,
                                icon:icon,
                                ok_btn(){
                                    params.selfData.icon=ins.$vm.$refs.iconSelector.value;
                                    ins.close();
                                },
                                cancel_btn(){
                                    ins.close();
                                }
                            },
                            methods:{
                                iconChange(value){
                                    this.icon=value;
                                }
                            },
                            content:`<div class="iconSelector_container">
                                        <div class="icons">
                                            <IconSelector ref="iconSelector" :store="store" :value="icon" v-on:iconChange="iconChange"></IconSelector>
                                        </div>
                                        <div class="option_bar">
                                            <button type="button" class="btn btn-success" @click="ok_btn()">确定</button>
                                            <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
                                        </div>
                                    </div>`,
                            success(){
                                setTimeout(()=>{ins.$vm.$refs.iconSelector.reloadSly();},500);
                            }
                        };

                        return ins;
                    }(store,param.selfData.icon,param));
                }
            }
        };
        return param;
      }(self.menus,self.menu,self.$store));
    },
    //判断新增字段是否设置了映射关系
    blnMapField(){
        if(!this.setField) this.blnVaildField=true;
        if(this.setField && this.setField.blnExtra && !this.setField.mapField){ this.blnVaildField=false;}else{this.blnVaildField=true;}

        if(!this.blnVaildField){
            this.$refs.PreView.blnDisableHeader();
        }
        return this.blnVaildField;
    },
    //列表头单击事件
    listHeaderClick(d,i){
      if(!this.blnMapField()) return;
      this.setField=this.fields[i];

      return true;
    },
    //列表操作栏头部单击事件
    fixHeaderClick(){
      this.setField=null;
    },
    //查看映射信息
    lookMap(item){
        let items=_.map(item.mapFields,m=>{
            return `
                    <div style="width:100%;height:30px;line-height:30px;border:1px solid #e7eaec;border-bottom:none;">
                      <div style="width:50%;display:inline-block;text-align:center;border-right:1px solid #e7eaec;">${m.source.name}</div><div style="width:50%;display:inline-block;text-align:center;">${m.target.name}</div>
                    </div>
                    `;
        }).join('');
        let html=`
              <div style="width:100%;height:30px;line-height:30px;border:1px solid #e7eaec;border-bottom:none;">
                  <div style="width:50%;display:inline-block;text-align:center;border-right:1px solid #e7eaec;">原数据</div><div style="width:50%;display:inline-block;text-align:center;">目标数据</div>
              </div>
              ${items}
            `;
        tool.show({
            title:'映射信息',
            area:'300px',
            content:html
        });
    },
    //删除操作按钮
    del_btn(index){
        this.field_btns.splice(index,1);
    },
    selFormatItem(formatType){
      this.setField.formatType=formatType;
    },
    setlFormatTypeName(d){
      let result='';
      switch(d.formatType)
      {
        case '0':result ='文本格式';break;
        case '1':result ='日期格式';break;
      }
      return result;
    },
    //模板设置
    tmp_setting(){
      if(this.template.length<=1) return;
    },
    //模板选择项单击事件
    templateClick(t){
      let index=this.template.indexOf(t.value);
      if(index>=0){
        this.template.splice(index,1);
      }else{
        this.template.push(t.value);
      }
    },
    //是否包含选中项
    isHasSelItem(data,id){
        return  _.find(data,d=>d.id==id);
    },
    //远程接口项单击事件
    remoteitemClick(d){
       let index=_.findIndex(this.remoteInterface,t=>t.id==d.id);
       if(index>=0){this.remoteInterface.splice(index,1); return;}
       this.remoteInterface.push(d);
    },
    //全屏预览
    fullSrceen(){
      let s=this;
      tool.open(function(){
        let html=`<div name="mask" style="position:absolute;top:0px;left:0px;bottom:0px;right:0px;background-color:white;z-index:100;"></div>
                  <PreView ref="PreView" :data="config" :blnShow="blnShow" :store=store />`;
        let param={
              title:'全屏预览',
              initMaxMin:true,
              offset: ['0px', '0px'],
              components:{PreView},
              content:`<div class="mapPath_pop" style="width:100%;height:100%;">${html}</div>`,
              store:s.$store,
              context:{
                blnShow:true,
                store:s.$store,
                config:s.config
              },
              success(layero, index){
               setTimeout(()=>{
                  param.$refs.PreView.layout();
                  layero.find('div[name="mask"]').remove();
               },600);
              },
        };

        return param;
      }());
    }
  }
}
</script>
<style lang="less">
  @import "../../css/variables.less";
  //操作字段弹窗样式
  .btnOptionPop .el-tabs{display:block !important;}
  //操作按钮弹窗样式
  .add_btn_option .form-horizontal .icon_container{width:100%;height:36px;line-height:36px;border: 1px solid #C0CCDA;border-radius: 5px;}
  .add_btn_option .form-horizontal .icon_container .btn{float:right;width:36px;border-left:1px solid #C0CCDA;cursor:pointer;border-radius: 0px;}
  .add_btn_option .form-horizontal .icon_container .info{height:36px;margin-right:37px;text-align: center;}
</style>

<style scoped lang="less">
  @import "../../css/variables.less";
  .List{width:100%;height:100%;}
  @table_condW:250px;
  @field_condH:350px;
  .table_cond{width:@table_condW;height:100%;float:left;.border('right');}
  .table_show{margin-left:@table_condW;margin-right:0px;height:~'calc(100% - @{field_condH})';text-align:left;}
  .field_cond{margin-left:@table_condW;margin-right:0px;height:@field_condH;text-align:left;}

  @titleH:40px;
  .table_cond .title,.table_show .title,.field_cond .title{width:100%;height:@titleH;line-height:@titleH;padding:0px 10px;.border('top');.border('bottom');}
  .table_show .title,.field_cond .title{background-color:#dcdcdc;}
  .table_show .content,.field_cond .content{width:100%;height:~'calc(100% - @{titleH})';}

  .table_show .name,.field_cond .name{font-weight:600;font-style: italic;}
  
  .field_cond .option_bar_right,
  .table_show .option_bar_right{float:right;height:100%;font-weight:600;font-style:italic;}
  .table_show .option_bar_left .item,
  .field_cond .option_bar_right .item,
  .table_show .option_bar_right .item{cursor:pointer;margin-left:10px;}
  .table_show .option_bar_left .item:hover,
  .field_cond .option_bar_right .item:hover,
  //.table_show .option_bar_right .item:hover{color:@Font_Hover_Col;}
  html{.TCol(~".table_show .option_bar_right .item:hover");}

  .table_show .option_bar_left{padding:0px 10px;height:100%;font-weight:400;font-size:14px;font-style:italic;display:inline-block;}
  .table_show .option_bar_left .item{padding:5px 10px;}
  .table_show .option_bar_left .item:hover{.border('');border-radius:5px;}
  
  .option_bar{width:100%;height:~'calc(100% - @{titleH})';float: left;}
  .option_bar .item{margin:10px;.border('');padding:10px 24px;border-radius:5px;position:relative;float:left;}
  .option_bar .item .option_bar_title {position:absolute;font-size:12px;top:-10px;left:10px;background-color:white;font-style:italic;}

  .field_cond .content .item{float:left;margin-bottom:10px;position:relative;}
  .field_cond .content .row{}
  .field_cond .content .item .info{float:left;width:110px;line-height:36px;text-align:center;font-style:italic;}
  .field_cond .content .item .bar{float:right;}

  .active{color:white;}

  html{.TColIm(~".active",'bg');}

  //操作按钮项
  .btn_item{display:inline-block;background: #1d365d;margin: 10px;
    min-width: 170px;
    border-radius: 5px;
    color: #fff;
    height: 60px;
    padding: 5px;
    padding-right: 5px;
    padding-right: 30px;
    position:relative;
  }

  .List .card{.border('',#8492a6);height:36px;width:150px;border-radius:5px;} 
  .List .card .info{line-height:36px;text-align:center;width:~'calc(100% - 30px)' !important;font-size:12px;}
  .List .card .btnOption{float:right;height:100%;.border('left',#8492a6);line-height:36px;text-align:center;width:30px;cursor:pointer;}

  .field_cond .content .item .validInfo{
       content:'';
       width:100%;
       height:100%;
       position:absolute;
       .border('',red);
       z-index:100;
       border-radius:5px;
       top:0px;
       left:0px;
       line-height:36px;
       padding-left:10px;
       background-color:white;
       color:red;
       cursor:pointer;
   }
</style>
