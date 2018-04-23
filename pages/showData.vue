<!-- 展示数据组件 -->
<template>
    <div class="showData">
        <!--数据源列表-->
        <div class="sourceList_container">
          <LabelPage title="数据源列表" page="sourceListComp" :data="tables" :noBtn="true" v-on:itemClick="source_click" :pageProp="{noCloseBtn:true}"></LabelPage>
        </div>
        <!--字段操作区域-->
        <div class="filedoption_container">
          <div class="selFiled_container">
            <LabelPage title="可选字段" page="fieldListComp" ref="fieldListComp" :data="currSource.fields" :actions="actions" :pageProp="{selData:curSelFileds,tableKey:currSource.key}" v-on:filedChange="filedChange"></LabelPage>
          </div>
          <div class="showFiled_container">
            <LabelPage title="展示字段" ref="sortTableComp" page="sortableComp" :data="curSelFileds" v-on:settingClick="settingClick" v-on:filedChange="sortable_item_del" v-on:dataChange="dataChange"></LabelPage>
          </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapState,mapMutations} from 'vuex'
import {SET_ORDER_FIELD,Reg_Menu_Change_Even,Set_Show_data,Reg_Date_Source_Del_Even,Data_Change} from '../store/mutation-types'
import LabelPage from '../components/LabelPage'
import optionHandle from '../js/dao/handlePop.js'
// import {tool} from '../js/tool.js'

export default {
  name: 'ShowData',
  components:{
      LabelPage
  },
  data () {
    return {
      currSource:{},//当前数据源
      curSelFileds:[]//当前选中的字段集合{name:'1',parent:'测试'}
    }
  },
  watch:{
    config:{
        deep: true,
        handler: function (val, oldVal) {
          this.$store.commit(Set_Show_data,tool.Clone(this.config));
        }
    }
  },
  computed:mapState({
      tables:state=>{return state.setting.tables;},
      config(){
        return {
          currSource:this.currSource,
          curSelFileds:this.curSelFileds
        }
      },
      allTables:state=>{return state.setting.allTables},
      //关联操作
      actions(){
        return optionHandle.convertOptionIcon(this.currSource);
      }
  }),
  mounted(){
    let sortTableComp=this.$refs.sortTableComp;
    //监听数据源改变事件
    this.$store.commit(Data_Change,(showData)=>{
      this.currSource=showData.currSource;
      this.curSelFileds=showData.curSelFileds;
      if(!sortTableComp.$refs.page){return;}

      setTimeout(()=>{
        sortTableComp.$refs.page.relayout();
      },200);      
    });

    //监听菜单数据改变事件
    this.$store.commit(Reg_Menu_Change_Even,(menu)=>{
      if(menu.showDataConfig){
          _.find(this.allTables,t=>t.key==menu.showDataConfig.currSource.key)
          this.currSource=tool.Clone(_.find(this.allTables,t=>t.key==menu.showDataConfig.currSource.key) || menu.showDataConfig.currSource);
          let s=this;
          for(key in s.currSource.fields){
            s.currSource.fields[key].tableKey=menu.showDataConfig.currSource.key;
          }
          this.currSource.parentobj=menu.showDataConfig.currSource.parentobj;

          this.curSelFileds=menu.showDataConfig.curSelFileds;
          if(!sortTableComp.$refs.page){return;}

          setTimeout(()=>{
            sortTableComp.$refs.page.relayout();
          },200);      
      }else{
          this.currSource={};
          this.curSelFileds=[];
      }
    });
    //监听数据源删除事件
    this.$store.commit(Reg_Date_Source_Del_Even,(delSource)=>{
      delSource=delSource[0];
      if(delSource.key==this.currSource.key){this.currSource={};}
      let tempSelFileds=[];
      for(let selFiled of this.curSelFileds){
        let blnContain=false;
        for(let key in delSource.fields){
          if(selFiled.tableKey == delSource.fields[key].tableKey && selFiled.key == delSource.fields[key].key){
            blnContain=true;break;
          }
        }
        if(!blnContain){tempSelFileds.push(selFiled);}
      }
      
      this.curSelFileds=tempSelFileds;
    });
  },
  methods:{
    source_click(item){
      this.currSource=item;
    },
    //重新加载滚动拖动插件
    reloadSortComp(){
      if(this.$refs.sortTableComp.$refs.page && this.$refs.sortTableComp.$refs.page.loadGridly){
         this.$refs.sortTableComp.$refs.page.loadGridly();
      }
    },
    sortable_item_del(item){
      if(this.$refs.fieldListComp.$refs.page.specialCheck_click && this.$refs.fieldListComp.$refs.page.specialCheck_click(item)==0){
        item.c_sel=false;
        this.filedChange(item);
      }
    },
    //选中数据改变
    dataChange(data){
      let showData=tool.Clone(this.config);
      showData.curSelFileds=tool.Clone(data);
      this.$store.commit(Set_Show_data,showData);
      this.$store.commit(SET_ORDER_FIELD,data);
    },
    //在可选字段中，字段的选中状态被改变
    filedChange(item){
      if(!item.tableName){
        Vue.set(item,'tableName',this.currSource.name);
      }
      if(!item.parent_index){
        Vue.set(item,'parent_index',this.currSource.parentobj.c_index);
      }
      if(!item.tableKey){
        Vue.set(item,'tableKey',this.currSource.key);
      }

      if(item.c_sel){
        this.curSelFileds.push(item);
      }else{
        for(let i=0; i<this.curSelFileds.length;i++){
          if(this.curSelFileds[i].tableKey===item.tableKey && this.curSelFileds[i].key==item.key){
            this.curSelFileds.splice(i,1);
            //还原字段初始化的值
            if(!item.showName){Vue.set(item,'showName','');}
            if(!item.fieldType){Vue.set(item,'fieldType','0');}//字段类型
            if(!item.formatType){Vue.set(item,'formatType','0');}//字段格式化类型
            if(!item.groupFields){Vue.set(item,'groupFields','');}//组合字段
            if(!item.remoteFields){Vue.set(item,'remoteFields','');}//远程字段
            item.Format_express='';
            item.Format_group_express='';
            item.fieldType=0;
            item.formatType=0;
            item.showName='';
            item.keyName='';  
            break;
          }
        }
      }
    },
    //字段项的设置按钮单击事件
    settingClick(item){
      let self=this;
      let sourceField='';
      for(let table of self.tables)
      {
        let table_item=`<el-dropdown-item command="0">${table.name}</el-dropdown-item>`;
        let split_line=`<el-dropdown-item divided=true></el-dropdown-item>`;
        sourceField+=table_item;
        for(let key in table.fields ){
          let field=table.fields[key];
          let field_item=`<el-dropdown-item command=field.key>${field.name}</el-dropdown-item>`;
          sourceField+=field_item;
        }

        sourceField+=split_line;
      }

      let html=`
        <form class="form-horizontal" role="form">
          <div class="form-group">
            <label class="col-sm-3 control-label">显示名称</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" v-model="showName" placeholder="请输入显示名称">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-3 control-label">列宽</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" v-model="columnW" placeholder="请输入列宽">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-3 control-label">是否显示</label>
            <div class="col-sm-9">
             <el-button-group style="width:100%;">
                <el-button style="width:50%;" :class="{active:!blnShow}" @click="blnShow=0;">是</el-button>
                <el-button style="width:50%;" :class="{active:blnShow}" @click="blnShow=1;">否</el-button>
             </el-button-group>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-3 control-label">字段类型</label>
            <div class="col-sm-9">
              <el-dropdown trigger="click" @command="selectItem">
                <el-button>
                  {{fieldType==0?'普通字段':fieldType==1?'格式化字段':fieldType==2?'组合字段':fieldType==3?'远程字段':'超链接字段'}}<i class="el-icon-caret-bottom el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="0">普通字段</el-dropdown-item>
                  <el-dropdown-item command="1">格式化字段</el-dropdown-item>
                  <el-dropdown-item command="2">组合字段</el-dropdown-item>
                  <el-dropdown-item command="3">远程字段</el-dropdown-item>
                  <el-dropdown-item command="4">超链接字段</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>

          <div class="form-group" v-show="fieldType==1">
             <div class="col-sm-3" style="text-align:right;margin-top:10px;padding-right:0px;cursor:pointer;">
              <el-dropdown trigger="click" @command="selFormatItem">
                <span class="el-dropdown-link">
                  {{setlFormatTypeName()}}<i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="0">文本格式</el-dropdown-item>
                  <el-dropdown-item command="1">日期格式</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
             </div>
             <div class="col-sm-8">
                <input type="text" class="form-control" id="" v-model="Format_express" placeholder="请输入表达式">
             </div>
          </div>

          <div class="form-group" v-show="fieldType==2">
            <span class="col-sm-3 control-label">组合字段</span>
            <div class="col-sm-9">
              <el-select v-model="groupFields" multiple placeholder="请选择">
                <el-option-group
                  v-for="table in tables"
                  :label="table.name">
                  <el-option
                    v-for="field in table.fields"
                    :label="convert_filed_label(field,table)"
                    :value="field">
                  </el-option>
                </el-option-group>
              </el-select>
             </div>
             <span class="col-sm-3 control-label" style="margin-top:10px;">设置表达式</span>
             <div class="col-sm-9" style="margin-top:10px;">
              <input type="text" class="form-control" id="" v-model="Format_group_express" placeholder="请输入表达式">
             </div>
             <span class="col-sm-3 control-label" style="margin-top:5px;">描述</span>
             <div class="col-sm-9" style="margin-top:5px;color:gray;">
              请根据所选字段的表名+符号'.'+字段名来设置格式化</br>
              例如:{ tabeA.name } - { tableB.name }
             </div>
          </div>

          <div class="form-group" v-show="fieldType==3">
             <span class="col-sm-3 control-label">选择参数</span>
             <div class="col-sm-9">
                <el-select v-model="data.remoteFields" multiple placeholder="请选择">
                  <el-option-group
                    v-for="table in tables"
                    :label="table.name">
                    <el-option
                      v-for="field in table.fields"
                      :label="convert_filed_label(field,table)"
                      :value="field">
                    </el-option>
                  </el-option-group>
                </el-select>
              </div>
              <template v-for="item in data.remoteFields">
                <span class="col-sm-3 control-label" style="margin-top:10px;">{{item.tableName+'-'+item.name}}</span>
                <div class="col-sm-9" style="margin-top: 5px;">
                  <input type="text" class="form-control" id="" placeholder="请输入参数值">
                </div>
              </template>
          </div>
        </form>
        <div style="text-align:right;margin-bottom:10px;">
          <button type="button" class="btn btn-success" style="margin-right:10px;" @click="btn_ok(showName,fieldType,Format_express,groupFields,Format_group_express,formatType,blnShow,columnW)">确定</button>
          <button type="button" class="btn btn-default" style="margin-right:25px;" @click="btn_cancel">取消</button>
        </div>
      `;
      if(!item.showName){Vue.set(item,'showName','');}
      if(!item.fieldType){Vue.set(item,'fieldType','0');}//字段类型
      if(!item.formatType){Vue.set(item,'formatType','0');}//字段格式化类型
      if(!item.groupFields){Vue.set(item,'groupFields','');}//组合字段
      if(!item.remoteFields){Vue.set(item,'remoteFields','');}//远程字段
      if(!item.blnShow){Vue.set(item,'blnShow',0);}//是否显示字段
      if(!item.columnW){Vue.set(item,'columnW','');}//列宽

      tool.open(function(item){
        let newGroupFields=[];
        for(let groupItem of item.groupFields){
          newGroupFields.push(groupItem);
        }
      
        let result = {
        title:'设置字段信息',
        content:`<div class="filed_setting">${html}</div>`,
        context:{
            data:item,
            showName:item.showName || '', //显示名称
            blnShow:item.blnShow,//是否显示字段(0:显示,1:不显示)
            columnW:item.columnW,//列宽
            fieldType:item.fieldType || 0,//字段类型
            formatType:item.formatType || 0,//格式化类型(0:文本格式化,1:日期格式化)
            Format_express:item.Format_express ||'',//格式类型-表达式
            groupFields:newGroupFields || [],//组合字段相关字段集合
            Format_group_express:item.Format_group_express || '',//组合字段类型-表达式
            tables:self.tables,
            btn_ok(showName,fieldType,Format_express,groupFields,Format_group_express,formatType,blnShow,columnW){
              if(item.fieldType=='2'){
                let tempItem=item.oriData;
                self.sortable_item_del(item);
                item=tempItem;
                item.blnShow=blnShow;
                item.c_sel=true;
                self.filedChange(item);
              }

              item.blnShow=blnShow;
              item.columnW=columnW;
              switch(fieldType){
                case '0'://普通字段
                  item.Format_express='';
                  item.Format_group_express='';
                  item.fieldType=fieldType;
                  item.formatType=formatType;
                  item.showName=showName;
                  item.keyName=item.name;     
                  break;
                case '1'://格式化字段           
                   item.Format_group_express='';
                   item.Format_express=Format_express;
                   item.groupFields=[];
                   item.fieldType=fieldType;
                   item.formatType=formatType;
                   item.showName=showName;
                   item.keyName=item.name;     
                  break;
                case '2'://组合字段
                  item.Format_express='';
                  let nameArr=[],keyArr=[],keyNameArr=[];
                  for(let child of groupFields)
                  {
                    nameArr.push(child.tableName);
                    keyArr.push(child.tableKey+'_'+child.key);
                    keyNameArr.push(child.tableName+'.'+child.name);
                  }

                  if(item.fieldType!='2'){
                    let newItem={oriData:item};
                    Vue.set(newItem,'name','组合字段');
                    Vue.set(newItem,'showName',showName);
                    Vue.set(newItem,'keyName',keyNameArr.join(','));
                    Vue.set(newItem,'c_sel',true);
                    Vue.set(newItem,'id',tool.guid());
                    Vue.set(newItem,'key',keyArr.join(','));
                    Vue.set(newItem,'tableName',nameArr.join(','));
                    Vue.set(newItem,'Format_group_express',Format_group_express);
                    Vue.set(newItem,'groupFields',groupFields);
                    Vue.set(newItem,'fieldType',fieldType);
                    Vue.set(newItem,'formatType',formatType);
                    self.curSelFileds.push(newItem);
                    self.sortable_item_del(item);
                  }else{
                    item.showName=showName;
                    item.key=keyArr.join(',');
                    item.tableName=nameArr.join(',');
                    item.Format_group_express=Format_group_express;
                    item.groupFields=groupFields || [];
                    item.fieldType=fieldType;
                    item.formatType=formatType;
                  }
                  break;
                case '3'://远程字段
                    item.fieldType=fieldType;
                    item.showName=showName;     
                  break;
                case '4'://超链接字段
                    item.fieldType=fieldType;
                    item.showName=showName;     
                  break;  
              }
              result.close();
              self.$refs.sortTableComp.$refs.page.dataChange();
            },
            btn_cancel(){
              result.close();
            },
            selectItem(fieldType){result.selfData.fieldType=fieldType;},
            selFormatItem(formatType){result.selfData.formatType=item.formatType=formatType;},
            setlFormatTypeName(){
              let result='';
              switch(item.formatType)
              {
                case '0':result ='文本格式';break;
                case '1':result ='日期格式';break;
              }
              return result;
            },
            //转化组合字段多选项显示字段
            convert_filed_label(item,table){
               if(!item.tableName){
                  Vue.set(item,'tableName',table.name);
               }
              return table.name+'_'+item.name+"("+table.key+'.'+item.key+")";
            }
        },
        area:'600px'
      };
      return result;
      }(item));
    }
  }
}
</script>
<style lang="less">
  @import "../css/variables.less";
  .filed_setting .form-horizontal .form-group{margin:10px 0px !important;}
  .filed_setting .active{background-color:@Active_Bg_Col;color:@Active_Front_Col;}
  .filed_setting label{font-weight:normal;}
</style>
<style scoped lang="less">
  @import "../css/variables.less";
  @sourceListW:250px;
  @selFiledH:300px;
  .showData{height:100%;width:100%;}
  .showData .sourceList_container{float:left;width:@sourceListW;height:100%;.border('right')}
  .showData .filedoption_container{margin-left:@sourceListW;height:100%;}
  .showData .filedoption_container .selFiled_container{width:100%;height:@selFiledH;}
  .showData .filedoption_container .showFiled_container{width:100%;height:~'calc(100% - @{selFiledH})'}
</style>
