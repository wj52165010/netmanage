<!-- 设置模板界面(菜单类型为模板时用) -->
<template>
    <div class="TmpSetting">
        <div class="left_container">
          <div class="option_bar">
            <div class="item" @click="preview">
              <i class="fa fa-play-circle-o"></i> 预览
            </div>
            <div class="item" @click="setting">
              <i class="fa fa-cog"></i> 设置
            </div>
            <div class="item" @click="save">
              <i class="fa fa fa-save"></i> 保存
            </div>
          </div>
          <textarea id="tmpSettingTextArea" />
        </div>
        <div class="right_container" :id="preViewCId">
          <div class="tipInfo" v-if="!blnPreView">
            <div>
              预览区域
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import {mapState} from 'vuex'
import {Field_Change,Create_Operate,Reg_Menu_Change_Even,Set_Operate,Update_Operate} from '../store/mutation-types'
import InputDir from '../components/Input'


import '../../static/codemirror/codemirror.css'
import '../../static/codemirror/codemirror.js'
import '../../static/codemirror/xml.js'
import '../../static/codemirror/adds/show-hint.css'
import '../../static/codemirror/adds/showhint.js'
import '../../static/codemirror/adds/jshint.js'

export default {
  name: 'TmpSetting',
  data () {
    return {
      editor:null,       //编辑器对象
      blnPreView:false,  //是否预览
      preViewCId:'',     //预览加载框ID
      preViewVue:null,   //预览加载VUE对象
      selFields:[],      //当前选中字段数据集
      templateHtml:'',   //模板数据
      popWidth:0,        //弹窗宽度
      popHeight:0,       //弹窗高度
      inFields:{},       //已经插入文本框的字段集合
    }
  },
  mounted(){
    //监听字段改变事件
    this.$store.commit(Field_Change,(data)=>{
      let showFields=data.showFields,s=this;
      this.selFields=showFields;
      CodeMirror.hint.dynamicKeys=_.map(showFields,field=>{
        return {
          displayText:s.inFields[field.alias]?field.name+'(<i class="fa fa-check"></i>)':field.name,
          text:field.alias
        }
      });

      //[{displayText:'测试',text:'1'},{displayText:'测试2',text:'2'}];
    });

    //监听菜单数据改变事件
    this.$store.commit(Reg_Menu_Change_Even,(menu)=>{
      this.templateHtml=menu.template || '';
      let fields=menu.condtionsObj?menu.condtionsObj.query_fields:[];
      this.popWidth=menu.popWidth;
      this.popHeight=menu.popHeight;
      this.editor.setValue(this.templte_Html(this.templateHtml,fields));
      $('.CodeMirror-hscrollbar').css('pointer-events','all');//在配置页面来回切换时会出现滚动条无法使用的情况
      setTimeout(()=>{
        this.preview();
      },100);
      
    });

    let self=this;
    this.preViewCId='preView'+tool.guid();
    this.editor = CodeMirror.fromTextArea(document.getElementById("tmpSettingTextArea"), {
      lineNumbers: true,
      mode: "text/html",
      theme:'dracula'
    });
    this.editor.setOption("extraKeys", {
      'Ctrl-S': function(cm) {
        self.preview();
      },
      'Alt':function(cm){//显示字段Key
        CodeMirror.hint.dynamicKeys=_.map(self.selFields,field=>{
          return {
            displayText:self.inFields[field.alias]?field.name+'(<i class="fa fa-check"></i>)':field.name,
            text:field.alias
          }
        });
        self.editor.showHint();
      },
      'Ctrl-Alt':function(cm){//显示字段名
        CodeMirror.hint.dynamicKeys=_.map(self.selFields,field=>{return {displayText:field.name,text:field.name}});
        self.editor.showHint();
      },
      'Ctrl-Z':function(cm){//显示菜单下拉框
        let menus=_.chain(self.$store.getters.Menus).pluck('menus').flatten().value();

        CodeMirror.hint.dynamicKeys=_.map(menus,menu=>{return {displayText:menu.name,text:menu.keyid}});
        self.editor.showHint();
      }
    });

    //监听输入改变事件
    let Rx=this.$store.getters.Rx;
    Rx.Observable.fromEvent(this.editor, 'changes')
    .auditTime(1000)
    .subscribe((instance)=>{
        this.decideField(instance.getValue());
    });
 
  },
  computed:mapState({
    //判断当前查询模式(展示/查询)
    blnShowModel:state=>{
      let cruMenu= state.setting.curMenu;
      if(!cruMenu.condtionsObj)return;
      cruMenu.condtionsObj.query_kind=cruMenu.condtionsObj.query_kind || 'show';
      return cruMenu.condtionsObj.query_kind=='show';
    },
    selTables:state=>{
        return state.setting.tables;
    },
    menu:state=>{
        return state.setting.curMenu;
    },
    oriMenu:state=>{
        return state.setting.oriMenu;
    },
  }),
  methods:{
    //判断输入内容中包含的字段数
    decideField(html){
      let s=this;
      let interReg = '/\\{\\s*({0})\\s*\\}/g';//插值表达式
      s.inFields={};
      for(let i=0; i<s.selFields.length;i++){
        let field=s.selFields[i];
        if(!html.match(eval(tool.format(interReg,field.alias))))continue;
        s.inFields[field.alias]=1;
      }
    },
    //设置操作
    setting(){
      let self=this;
      tool.open(function(){
        let html=`
                  <div><InputDir label="弹窗宽度" @change="width_change" :val="widthVal" /></div>
                  <div><InputDir label="弹窗高度" @change="height_change" :val="heightVal" /></div>
                `;
        let param={
            title:'设置',
            area:'400px',
            components:{InputDir},
            content:`<div style="width:100%;height:100%;overflow:hidden;padding:10px;">
                        ${html}
                        <div style="text-align:right;margin-top:10px;">
                            <button type="button" class="btn btn-success" @click="complete()">完成</button>
                            <button type="button" class="btn btn-default" @click="close()">关闭</button>
                        </div>
                    </div>`,
            context:{
               widthVal:self.popWidth,
               heightVal:self.popHeight,
               complete(){
                param.close();
               },
               close(){
                 param.close();
               },
               //宽度输入改变事件
               width_change(val){
                if(val.match(/\D/g))return;
                self.popWidth=val;
               },
               //高度输入改变事件
               height_change(val){
                 if(val.match(/\D/g))return;
                 self.popHeight=val;
               }
            }
        };

        return param;
      }());
    },
    //预览操作
    preview(){
      let self=this;
      try{
        this.blnPreView=true;
        if(this.preViewVue){this.preViewVue.$destroy();$('#'+this.preViewCId).children().remove();}
        $('#'+this.preViewCId).append(`<div id="previeMount"></div>`);
        let html=this.editor.getValue();
        self.templateHtml = html=this.handleHtml(html);
        let res = Vue.compile(self.templateHtml);
        this.preViewVue= new Vue({
            data:self.MockData(html),
            components: {},
            methods:{},
            render: res.render,
            staticRenderFns: res.staticRenderFns
        });

        this.preViewVue.$mount($('#previeMount')[0]);
      }catch(e){}
    },
    //构造模拟数据用于预览操作
    MockData(html){
      let res={};
      let fields=this.selFields;
      let blnShow=this.blnShowModel;

      //判断是否有v-for的情况
      let reg_for=/v-for=['"]?([^'"]*)['"]/i;
      let repress=/([^'"]*)\s+in\s+([^'"]*)/i;
      if(html.match(reg_for)){
        let vfor=html.match(reg_for)[1];
        let variable=vfor.match(repress)[1],source=vfor.match(repress)[2];
        res[source]=[];
        for(let i=0;i<3;i++){
          let _item={};
          _.each(fields,(item)=>{
            if(blnShow){
              //展示模式
              _item[item.key]='测试数据...'
            }else{
              //查询模式
              _item[item.alias]='测试数据...'
            }
          });

          res[source].push(_item);
        }
      }

      //判断是否有el-table插件
      let elTable=/<el-table\s+[^>]*:data=['"]?([^'"]*)['"]/i
      if(html.match(elTable)){
        let source=html.match(elTable)[1];
        res[source]=[];
        for(let i=0;i<3;i++){
          let _item={};
          _.each(fields,(item)=>{
            if(blnShow){
              //展示模式
              _item[item.key]='测试数据...'
            }else{
              //查询模式
              _item[item.alias]='测试数据...'
            }
          });

          res[source].push(_item);
        }
      }

      //判断是否包含htmlTmpPage模板
      let htmlPage=/<htmlTmpPage\s/i
      if(html.match(htmlPage)){
        res['store']=this.$store;
        res['params']={};
        // let heightReg=/<htmlTmpPage\s+[^>]*:height=['"]?([^'"]*)['"]/i
        // if(html.match(heightReg)){
        //   let height=html.match(heightReg)[1];
        //   res['height']=height;
        // }
      }
      _.each(fields,(item)=>{
        if(blnShow){
          //展示模式
          res[item.key]='测试数据...'
        }else{
          //查询模式
          res[item.alias]='测试数据...'
        }
      });
      return res;
    },
    //替换html中的模板字段为真正数据结果字段
    handleHtml(html){
      //判断查询模式,模式不同显示的类容不同
      let fields=this.selFields;
      let blnShow=this.blnShowModel;
      if(!blnShow){return html;}
      _.each(fields,(item)=>{
         html=html.replace(eval(`/\\{\\s*(${item.alias})\\s*\\}/g`),function (m, i) {
                  return '{'+item.key+'}';
         });
         html=html.replace(eval(`/=\\s*"\\s*(${item.alias})(\\s*|\\s*\\S*\\s*\\S*)"/g`),function (m, i) {
                  let  matchStr = m.substring(m.indexOf('"')+1,m.length-1);
    
                  return '="'+matchStr.replace(item.alias,item.key)+'"';
         });
         html=html.replace(eval(`/=\\s*'\\s*(${item.alias})(\\s*|\\s*\\S*\\s*\\S*)'/g`),function (m, i) {
                  let  matchStr = m.substring(m.indexOf('"')+1,m.length-1);
                  return "='"+matchStr.replace(item.alias,item.key)+"'";
         });
         html=html.replace(eval(`/:\\s*"\\s*(${item.alias})\\s*'/g`),function (m, i) {
                  return ':"'+item.key+'"';
         });
         html=html.replace(eval(`/:\\s*'\\s*(${item.alias})\\s*'/g`),function (m, i) {
                  return ":'"+item.key+"'";
         });
         //html=html.replace(eval(`/${item.alias}/g`),item.key);
      });

      return html;
    },
    //替换html中的数据为模板编写时的数据
    templte_Html(html,fields){
      //判断查询模式,模式不同显示的类容不同
      let blnShow=this.blnShowModel;
      if(!blnShow){return html;}
      _.each(fields,(item)=>{
          html=html.replace(eval(`/\\{\\s*(${item.key})\\s*\\}/g`),function (m, i) {
                  return '{'+item.alias+'}';
          });
          html=html.replace(eval(`/=\\s*"\\s*(${item.key})(\\s*|\\s*\\S*\\s*\\S*)"/g`),function (m, i) {
                  let  matchStr = m.substring(m.indexOf('"')+1,m.length-1);
                  
                  return '="'+ matchStr.replace(item.key,item.alias)+'"';
                  //return '="'+item.alias+'"';
          });
          html=html.replace(eval(`/=\\s*'\\s*(${item.key})(\\s*|\\s*\\S*\\s*\\S*)'/g`),function (m, i) {
                  let  matchStr = m.substring(m.indexOf('"')+1,m.length-1);
                  return "='"+matchStr.replace(item.key,item.alias)+"'";

                  //return "='"+item.alias+"'";
          });
          html=html.replace(eval(`/:\\s*"\\s*(${item.key})\\s*'/g`),function (m, i) {
                  return ':"'+item.alias+'"';
          });
          html=html.replace(eval(`/:\\s*'\\s*(${item.key})\\s*'/g`),function (m, i) {
                    return ":'"+item.alias+"'";
          });
          //html=html.replace(eval(`/${item.key}/g`),item.alias);
      });

      return html;
    },
    //保存
    save(){
      let html=this.editor.getValue();
      this.templateHtml=this.handleHtml(html);
      if(this.menu.isSave){
        let tempMenuData=tool.Clone(this.menu);
        tempMenuData.template=this.templateHtml;
        tempMenuData.popWidth=this.popWidth;
        tempMenuData.popHeight=this.popHeight;

        // delete tempMenuData.condtionsObj;
        // delete tempMenuData.dataSourceConfig;
        // delete tempMenuData.hanldeDataConfig;
        // delete tempMenuData.showDataConfig;
        if(tempMenuData.menu_type.menus) delete tempMenuData.menu_type.menus;
        
        console.log(tool.Clone(tempMenuData));
        //修改模板菜单数据
        this.$store.dispatch(Update_Operate,tempMenuData).then(res=>{
          if(!tool.msg(res,'修改自定义模块成功!','修改自定义模块失败!')){return;}
          this.oriMenu.template=this.templateHtml;
          this.oriMenu.popWidth=this.popWidth;
          this.oriMenu.popHeight=this.popHeight;
        });
        return;
      }


      //新增模板菜单数据
      //转化菜单选中数据源中可以用来设置限定条件的对象(供字段操作,按钮操作用)
      let indexFields={};
      for(let table of this.selTables){
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

      this.menu.condtionsObj.indexFields=indexFields;//保存数据源预设的索引字段
      this.menu.template=this.templateHtml;
      this.menu.popWidth=this.popWidth;
      this.menu.popHeight=this.popHeight;
      let tempData=tool.Clone(this.menu);
      if(tempData.menu_type.menus) delete tempData.menu_type.menus;

      this.$store.dispatch(Create_Operate,tempData).then(res=>{
          this.blnClickSave=true;
          this.menu.isSave = tool.msg(res,'添加自定义模块成功!','添加自定义模块失败!');
          this.oriMenu.keyid=this.menu.keyid=res.biz_body.keyid;
          this.oriMenu.template=this.templateHtml;
          this.oriMenu.popWidth=this.popWidth;
          this.oriMenu.popHeight=this.popHeight;
          tool.Clone(this.menu,this.oriMenu);
      });
    }
  }
}
</script>

<style scoped lang="less">
  @import "../css/variables.less";
  @leftW:700px;
  @optionBarH:40px;
  .TmpSetting{
    background-color:@FrontCol;height:100%;width:100%;text-align:left;position:relative;
  }
  .TmpSetting .left_container{
    width:@leftW;.border('right');height:100%;float:left;
    position: absolute;
  }
  .TmpSetting .left_container textarea{
    width:100%;height:~"calc(100% - @{optionBarH})";resize:none;border:none;margin-top:@optionBarH;
  }
  .TmpSetting .left_container .option_bar{
    height:@optionBarH;
    box-shadow: 0 0px 5px rgba(57, 70, 78, 0.2);
    z-index: 100;
    position: absolute;
    top: 0px;
    width: 100%;
  }
  .TmpSetting .left_container .option_bar .item{
    float:left;height:100%;padding:0px 10px;line-height:@optionBarH;
  }
  .TmpSetting .left_container .option_bar .item:hover{
    cursor:pointer;border-bottom: 2px solid;
  }

  .TmpSetting .right_container{
    margin-left:@leftW;margin-right:0px;height:100%;overflow-x: hidden;overflow-y: auto;
  }

  .TmpSetting .right_container .tipInfo{display:table;height:100%;width:100%;}
  .TmpSetting .right_container .tipInfo >div{display:table-cell;text-align:center;vertical-align:middle;font-size:50px;color:@FontCol;}
</style>
