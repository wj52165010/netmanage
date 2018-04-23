<!-- 添加数据源 -->
<template>
    <div style="width:100%;height:100%;">
      <!--背景容器-->
      <div :id="'bg'+fileId" style="position:absolute;width:100%;height:100%;"></div>
      <!--显示内容-->
      <div class="AddSource">
        <div class="slidee">

              <!--设置数据库-->
              <div style="display:table;width:100%;" :style="{height:h}">
                  <div style="display:table-cell;vertical-align: middle;text-align:center;">
                    <div style="margin:0px auto;display: inline-block;">
                      <span style="float:left;margin-top: 5px;margin-right: 10px;font-style: italic;}">数据库</span>
                      <CDrop style="float: left;" />
                      <el-button type="primary" style="padding:8px;margin-left:15px;" @click="sly.activatePage(1);curIndex=1">确定</el-button>
                    </div>
                  </div>
              </div>

              <!--设置字段-->
              <div :style="{height:h}" style="position:relative;">
                <div class="pageCut" :class="{pageCutAnimate:blnAddFiled}"></div>
                <!--新增按钮-->
                <div class="addFieldBtn" @click="exceAddFieldAnimate()">
                  <el-tooltip effect="light" content="添加字段信息" placement="top">
                    <i class="fa fa-plus"></i>
                  </el-tooltip>
                </div>

                <div class="filed_table">
                  <HList title="" :action="[]" :data="fileds" :header="fHeader" :column="fColumns" :showField="fShowField" :rowAction="[{name:'删除',action:'delField',icon:'fa fa-plus'}]"
                  :searchAction="[]" :blnNoSel="true" :blnNoPage="true" @delField="delField"
                  :expan="false" :blnLoading="false" :store="store" :blnSmall="true"
                  />
                </div>
                <div class="optionBar" style="text-align:right;position: absolute;bottom: 10px;right: 10px;">
                    <button type="button" class="btn btn-default" @click="PageChange(2)">下一步</button>
                </div>
                <!--添加字段页面-->
                <div class="addFieldPage" v-if="blnOpenAddFiled" :style="{display:blnOpenAddFiled?'block':'none'}" :class="{fadeIn5:blnOpenAddFiled}">
                      <CInput label="字段名称" :val="field.name" @change="f_name_change" />
                      <CInput label="字段关键字" :val="field.key" @change="f_key_change" reg="[a-zA-Z_]" tip="不能包含中文和特殊字符" />
                      <CInput label="字段描述" :val="field.desc" @change="f_desc_change" />
                      <el-select style="margin-top: 10px;" v-model="field.fun" :clearable="true" placeholder="请选择字段显示格式">
                          <el-option
                          v-for="item in showFormat"
                          :key="item.val"
                          :label="item.name"
                          :value="item.val">
                          </el-option>
                      </el-select>
                      <el-select style="margin-top: 10px;" v-model="field.mask" :clearable="true" placeholder="请选择输入限制类型">
                          <el-option
                          v-for="item in mask"
                          :key="item.val"
                          :label="item.name"
                          :value="item.val">
                          </el-option>
                      </el-select>
                      <el-select style="margin-top: 10px;" v-model="field.type" placeholder="请选择字段输入类型(默认文本框类型)">
                          <el-option
                          v-for="item in fieldType"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                          </el-option>
                      </el-select>
                      <el-select style="margin-top: 10px;" v-model="field._data_type" placeholder="数据库字段类型(默认字符串类型)">
                          <el-option
                          v-for="item in [{name:'字符串',id:'text'},{name:'整形',id:'int'},{name:'长整形',id:'long'},{name:'日期',id:'date'}]"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                          </el-option>
                      </el-select>
                      <el-button-group style="width:100%;margin-top: 10px;">
                            <el-button style="width:50%;" :class="{active:field.indexType==0}" @click="field.indexType=0;">普通</el-button>
                            <el-button style="width:50%;" :class="{active:field.indexType==1}" @click="field.indexType=1;">本地索引</el-button>
                            <el-button style="width:33.3%;display:none;" :class="{active:field.indexType==2}" @click="field.indexType=2;">通用索引</el-button>
                      </el-button-group>
                      <el-button-group style="width:100%;margin-top: 10px;">
                            <el-button style="width:50%;" :class="{active:field.primeKey==0}" @click="field.primeKey=0;">普通</el-button>
                            <el-button style="width:25%; display:none;" title="前端用来进行增删改查,只能有一个主键" :class="{active:field.primeKey==1}" @click="field.primeKey=1;">
                                前端主键
                            </el-button>
                            <el-button style="width:50%;" title="后端用来创建数据结构,可以有多个主键" :class="{active:field.primeKey==2}" @click="field.primeKey=2;">
                                <!--后端主键-->主键
                            </el-button>
                            <el-button style="width:25%; display:none;" :class="{active:field.primeKey==3}" @click="field.primeKey=3;">前后端主键</el-button>
                      </el-button-group>
                      <div class="optionBar" style="text-align:right;position: absolute;bottom: 10px;right: 10px;">
                          <button type="button" class="btn btn-success" @click="addField()">确定</button>
                          <button type="button" class="btn btn-default" @click="blnOpenAddFiled=false;">关闭</button>
                      </div>
                </div>
              </div>

              <!--设置操作(增删改查)-->
              <div class="action" :style="{height:h}" style="position:relative;" v-if="blnSetAction">
                  <div class="a_container">
                    <div class="tag">
                      <Scroll :store="store" :listen="actions">
                        <div class="tag_item" :class="{active:curAction==i.id}" v-for="i in actions" @click="tag_item_click(i.id)">
                            <div style="display:table-cell;vertical-align: middle;">
                                <div><i :class="i.icon"></i></div>
                                {{i.name}}
                            </div>
                        </div>
                      </Scroll>
                    </div>
                    <div class="content">
                        <div class="header">
                          <div class="sel">
                            <cCheckBox label="" :sel="action_setting[curAction].fields.length==fileds.length && action_setting[curAction].fields.length>0" value="_全选" v-on:change="actionSel" style="margin-left: 5px;" />
                          </div><div class="name">名称</div>
                        </div>
                        <div class="body">
                          <Scroll :store="store" :listen="fileds">
                              <template v-for="i in fileds">
                                  <div class="item">
                                    <div class="sel">
                                      <cCheckBox label="" :sel="action_setting[curAction].fields.indexOf(i.key)>=0" :value="i.key" v-on:change="actionSel" style="margin-left: 5px;" />
                                    </div><div class="name">{{i.name}}</div>
                                  </div>
                              </template>
                          </Scroll>
                        </div>
                    </div>
                  </div>
                  <div class="optionBar" style="text-align:right;position: absolute;bottom: 10px;right: 10px;">
                      <button type="button" class="btn btn-default" @click="sly.activatePage(1);curIndex=1">上一步</button>
                      <button type="button" class="btn btn-default" @click="sly.activatePage(3);curIndex=3">下一步</button>
                  </div>
              </div>

              <!--设置表-->
              <div :style="{height:h}" style="position:relative;">
                <div style="float:left;padding:10px;width:100%;">
                  <CInput label="数据源名称" @change="t_name_change" />

                  <div style="margin-top: 10px;">
                    <div style="color:#c1c1c1;padding:0px 5px;">数据源类型:</div>
                    <el-select v-model="conf" placeholder="数据源类型">
                        <el-option
                        v-for="item in ['elastic']"
                        :key="item"
                        :label="item"
                        :value="item">
                        </el-option>
                    </el-select>
                  </div>
                  <div style="margin-top: 10px;" v-if="conf=='elastic'">
                    <el-select v-model="ela_conf.split_type" placeholder="拆分类型">
                        <el-option
                        v-for="item in [{name:'年',val:'YEAR'},{name:'月',val:'MONTH'},{name:'日',val:'DAY'}]"
                        :key="item.val"
                        :label="item.name"
                        :value="item.val">
                        </el-option>
                    </el-select>
                  </div>
                  <div style="margin-top: 10px;" v-if="ela_conf.split_type">
                    <el-select v-model="ela_conf.split_column" placeholder="拆分依据列名">
                        <el-option
                        v-for="item in fileds"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key">
                        </el-option>
                    </el-select>
                  </div>
                  <CInput label="数据源描述" @change="t_desc_change" />
                </div>
                <div class="optionBar" style="text-align:right;position: absolute;bottom: 10px;right: 10px;">
                    <button type="button" class="btn btn-default" @click="sly.activatePage(blnSetAction?2:1);curIndex=blnSetAction?2:1">上一步</button>
                    <button type="button" class="btn btn-success" v-throttle-even:click="saveConfig"><i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i><span v-show="!blnSearch">保存数据源</span></button>
                </div>
              </div>

              <!--设置文件解析-->
              <div  :style="{height:h}" style="position:relative;">
                <div style="height:calc(100% - 44px);width:100%;border-bottom: 1px solid #e7eaec;position:relative;">

                  <!--新增按钮-->
                  <div class="addFieldBtn" @click="addParseFile()">
                    <el-tooltip effect="light" content="添加文件解析规则" placement="top">
                      <i class="fa fa-plus"></i>
                    </el-tooltip>
                  </div>

                  <HList title="" :action="[]" :data="parseData" :header="pHeader" :column="pColumns" :showField="pShowField" :rowAction="[]"
                  :searchAction="[]" :blnNoSel="true" :blnNoPage="true" :blnRowClick="true"
                  :expan="false" :blnLoading="false" :store="store" :blnSmall="true" @rowClick="parseRowClick"
                  />
                </div>
                <div class="optionBar" style="text-align:right;position: absolute;bottom: 5px;right: 10px;">
                    <span v-if="!curParseData">请选择一项文件解析规则后进行上传</span>
                    <button type="button" class="btn btn-default" @click="PageChange(blnSetAction?5:4)">下一步</button>
                </div>

              </div>

              <!--上传数据-->
              <div :id="'c'+fileId" class="uploadPage" :style="{height:h}" style="position:relative;display:table;width:100%;height:100%;">
                  <!--上传方式-->
                  <div style="position:absolute;width:300px;top:10px;left:100px;">
                    <el-button-group style="width:100%;">
                            <el-button style="width:50%;" :class="{active:uploadKind==0}" @click="uploadKind=0;">文件上传</el-button>
                            <el-button style="width:50%;" :class="{active:uploadKind==1}" @click="uploadKind=1;">FTP上传</el-button>
                    </el-button-group>
                  </div>
                  <!--文件上传格式显示-->
                  <div style="position:absolute;width:400px;top:50px;left:50px;">
                    <div>1.{{uploadKind==0?'文件':'FTP'}}上传格式为您预先设置格式,如下例子</div>
                    <div class="frame">
                      <div class="slidee">
                        <li v-for="i in (curParseData &&  curParseData.columns) || []" :title="getFiledByKey(i.datasource_column).name">
                          {{getFiledByKey(i.datasource_column).name}}
                        </li>
                      </div>
                    </div>
                    <div class="scrollbar upload_scrollbar" v-show="blnShowScroll">
                        <div class="handle"></div>
                    </div>
                  </div>
                  <!--其他上传设置项显示信息-->
                  <div style="position:absolute;width:400px;top:120px;left:50px;">
                    <div v-if="uploadKind==0">2.行分隔符为,{{curParseData && curParseData.ori_row_seperator}}</div>
                    <div v-if="uploadKind==0">3.列分隔符为,{{curParseData && curParseData.ori_col_seperator}}</div>
                    <div v-if="uploadKind==0">4.仅支持txt文本</div>

                    <div v-if="uploadKind==1">2.FTP主机名、账号、密码等,在服务器中预先配置</div>
                  </div>


                  <input :id="fileId" :data-url="url" name="files[]" multiple type="file" style="width: 0px;position: absolute;top: 0px;right: 0px;bottom: 0px;margin: 0px;opacity: 0;direction: ltr;cursor: pointer;" />
                  <div class="upload_info" style="display:table-cell;vertical-align:middle;text-align:center;" v-if="uploadKind==0">
                      {{uploadInfo}}
                  </div>
                  <div class="optionBar" style="text-align:right;position: absolute;bottom: 10px;right: 10px;">
                      <button type="button" class="btn btn-default" @click="sly.activatePage(blnSetAction?4:3);curIndex=blnSetAction?4:3">上一步</button>
                      <button type="button" class="btn btn-success" @click="complete()">确定</button>
                  </div>
              </div>
        </div>
      </div>

      <!--时间轴-->
      <div class="timeShaft">
        <div style="height:100%;width:auto;" class="clearfix">
          <div class="item" :class="{active:curIndex>=1}">
            <div class="iconContainer" @click="PageChange(1)">
              <el-tooltip effect="light" content="设置字段" placement="top">
                <i class="icon fa fa-server"></i>
              </el-tooltip>
            </div>
            <div class="line"></div>
          </div><div class="item" :class="{active:curIndex>=2}" v-if="blnSetAction">
            <div class="iconContainer" @click="PageChange(2)">
              <el-tooltip effect="light" content="设置操作" placement="top">
                <i class="icon fa fa-random"></i>
              </el-tooltip>
            </div>
            <div class="line"></div>
          </div><div class="item" :class="{active:blnSetAction?curIndex>=3:curIndex>=2}">
            <div class="iconContainer" @click="PageChange(blnSetAction?3:2)">
              <el-tooltip effect="light" content="设置数据源" placement="top">
                <i class="icon fa fa-database"></i>
              </el-tooltip>
            </div>
            <div class="line"></div>
          </div><div class="item" :class="{active:blnSetAction?curIndex>=4:curIndex>=3}">
            <div class="iconContainer" @click="PageChange(blnSetAction?4:3)">
              <el-tooltip effect="light" content="文件解析配置" placement="top">
                <i class="icon fa fa-file"></i>
              </el-tooltip>
            </div>
            <div class="line"></div>
          </div><div class="item lastItem" :class="{active:blnSetAction?curIndex>=5:curIndex>=4}">
            <div class="iconContainer" @click="PageChange(blnSetAction?5:4)">
              <el-tooltip effect="light" content="上传" placement="top">
                <i class="icon fa fa-cloud-upload"></i>
              </el-tooltip>
            </div>
          </div>


        </div>
      </div>
    </div>
</template>

<script>
import CInput from 'components/Input'
import CDrop from 'components/dropdwon'
import HList from 'components/HList'
import Scroll from 'components/scroll'
import cCheckBox from 'components/checkbox'
import showFormat from './emnu/showFormat.js'
import parseFormat from './emnu/parseFormat.js'
import {mask} from '../../enum/MaskType.js' 
import {searchObj as FieldType} from '../../enum/SearchType'
import {table,field} from './data'
import '../../../static/jquery-file-upload/jquery.ui.widget.js'
import '../../../static/jquery-file-upload/jquery.iframe-transport.js'
import '../../../static/jquery-file-upload/jquery.fileupload.js'
import '../../../static/jquery.particleground.js'
import {SaveTableSchema,upload_dataSourceName_exist,upload_add_dataSource,upload_add_fileparse} from '../../store/mutation-types'
import '../../js/dragSort.js'

export default {
  name: 'AddSource',
  props:['store','startIndex','fields','sourceId','fileParse'],
  components:{CInput,CDrop,HList,Scroll,cCheckBox},
  watch:{
    curIndex(){
      let title=''
      if(this.curIndex==1){
        title='设置字段'
      }
      if(this.curIndex==2){
        title='设置操作'
      }
      if(this.curIndex==3){
        title='设置数据源'
      }
      if(this.curIndex==4){
        title='设置文件解析'
      }
      if(this.curIndex==5){
        title='上传文件'
      }

      this.$emit('titleChange',title);
      this.reloadyScroll();
    },
    fileParse(){
      this.parseData=_.map(this.fileParse,(r,i)=>{
        r.blnContainHeader=r.is_first_column_name?'包含':'不包含';
        r.num=i+1;
        return r;
      });
    }
  },
  data () {
    return {
      url:ser.uri+'/upload/file',//上传地址
      fileId:0,
      allowType:/(\.|\/)(txt)$/i,
      uploadInfo:'文件拖动这里',
      blnSearch:false,
      sly:null,
      h:0,
      curIndex:1,
      uploadKind:0,//0:文件上传,1:FTP上传
      blnUploading:false,//是否正在上传中
      conf:'elastic',//数据源类型
      ela_conf:{split_type:'',split_column:''},//elastic数据源类型时的配置对象
      fileds:[],//字段数据集合
      //字段头部信息
      fHeader:['字段名','类型','描述'],
      blnAddFiled:false,
      blnOpenAddFiled:false,
      fShowField:'name,typeName,desc',
      fColumns:[{width:100,align:'center'},{width:120,align:'center'},{width:0,align:'center'}],
      //文件解析头部信息
      pHeader:['编号','编码','列分隔符','行分隔符','包含表头'],
      pShowField:'num,encoding,ori_col_seperator,ori_row_seperator,blnContainHeader',
      pColumns:[{width:100,align:'center'},{width:100,align:'center'},{width:100,align:'center'},{width:100,align:'center'},{width:100,align:'center'}],
      parseData:[],//文件解析数据集合
      curParseData:null,//当前文件解析对象
      fieldType:FieldType,
      sourceKey:'',//数据源唯一key值
      table:tool.Clone(table),
      field:tool.Clone(field),
      showFormat:showFormat,
      blnSetAction:false,//是否设置增删改查
      mask:mask,
      actions:[
               {id:'add',name:'添加',icon:'fa fa-plus'},
               {id:'update',name:'修改',icon:'fa fa-pencil'},
               {id:'del',name:'删除',icon:'fa fa-trash'},
               {id:'detail',name:'详细',icon:'fa fa-clone'}
              ],
      curAction:'add',//add,update,del,detail
      action_setting:{
        add:{name:"新增",fields:[]},
        update:{name:"修改",fields:[]},
        del:{name:"删除",fields:[]},
        detail:{name:"详细",fields:[]}
      },
      scrollDom:null,
      scrollIns:null,
      blnShowScroll:false,
      sourceNameSub:null,
    }
  },
  mounted(){
      this.store=this.store || this.$store;
      this.fileds=this.fields || [];
      this.sourceKey=this.sourceId || '';
      this.parseData=this.fileParse || [];

      //定义数据源名称节流阀
      this.sourceNameSub=new this.store.getters.Rx.Subject();
      this.sourceNameSub.debounceTime(400)
      .subscribe((name)=>{
        this.store.dispatch(upload_dataSourceName_exist,name).then(res=>{
          if(!tool.msg(res,'','该名称已经存在!')){return;}
          this.table.name=name;
        });

      });

      this.h=$(this.$el).height()-60+'px';
      setTimeout(()=>{
         this.h=$(this.$el).height()-60+'px';
      },100);
     
      this.fileId="file"+tool.guid();

      this.$nextTick(()=>{
        this.sly=new Sly($(this.$el).find('.AddSource'),{
        itemNav: "basic",
        speed:200,
        scrollBy:0,
        startAt:2});
        this.sly.init();
        this.initUpload();
        //this.initBgAnima();

        this.scrollDom=$(this.$el).find('div[class="upload_scrollbar"]');
        this.scrollIns = new Sly($(this.$el).find('.frame'),{
              horizontal: 1,
              itemNav: "centered",
              dragContent: 1,
              scrollBy: 1,
              scrollBar:'.AddSource .upload_scrollbar',
              dynamicHandle: 0,
              dragHandle: 1,
          });

        setTimeout(()=>{
              this.scrollIns.init();
              this.reloadyScroll();
        },0); 

        if(this.startIndex!=undefined){
          this.curIndex=this.blnSetAction?this.startIndex:this.startIndex-1;
          setTimeout(()=>{
             this.sly.activatePage(this.curIndex);
          },500);
        }
      });
  },
  methods:{
    //根据Key获取对应字段信息对象
    getFiledByKey(key){

      return _.find(this.fileds,f=>f.key==key) || {name:'占位符'};
    },
    //页面跳转函数
    PageChange(index){
      if(this.startIndex!=undefined && this.startIndex>index){return;}

      if(index>=2 && this.fileds.length<=0 && this.startIndex==undefined){//字段设置进入操作设置页面
        tool.info('请设置相关字段信息!');
        return;
      }

      if(index>=(this.blnSetAction?4:3) && !this.sourceKey){
        tool.info('请先保存数据源配置!');
        return;
      }

      if(index>=(this.blnSetAction?5:4) && !this.curParseData){//文件解析页面
        tool.info('请选择一项文件解析方案!');
        return;
      }


      this.sly.activatePage(index);
      this.curIndex=index;
    },
    //页面操作完成
    complete(){
      this.$emit('complete');
    },
    //重新计算滚动条高度
    reloadyScroll(){
      this.scrollIns.reload();
      this.blnShowScroll=this.scrollIns.rel.slideeSize-10>this.scrollIns.rel.frameSize;
      this.setScrollH();
      this.scrollIns.reload();
    },
    //设置滚动条高度
    setScrollH(){
      let scrollContainerH=this.scrollDom.width();
      let gap=(this.scrollIns.rel.slideeSize-this.scrollIns.rel.frameSize)*(this.scrollIns.rel.frameSize/this.scrollIns.rel.slideeSize);
      this.scrollDom.find('.handle').css('width',(scrollContainerH-gap)<20?20:(scrollContainerH-gap)+'px');
    },
    //初始化背景动画
    initBgAnima(){
      $('#bg'+this.fileId).particleground({
          dotColor: '#0d8eb5',
          lineColor: '#0d8eb5'
      });
    },
    //文件解析页面数据项单击事件
    parseRowClick(d){
      this.curParseData=d;
    },
    //初始化上传插件
    initUpload(){
      let s=this,dropbox=$('#c'+s.fileId);
      //阻止文件拖入浏览器后打开新页面
      dropbox.bind("dragenter", function(e){ 
          e.stopPropagation(); 
          e.preventDefault(); 
      }, false);  
      dropbox.bind("dragover", function(e){ 
          e.stopPropagation(); 
          e.preventDefault(); 
      }, false); 
      dropbox.bind("drop", function(e){ 
          e.stopPropagation(); 
          e.preventDefault(); 
          
      }, false); 
     
      $('#'+s.fileId).fileupload({
        dataType:'json',
        dropZone:$('#c'+s.fileId),
        autoUpload:false,
        add:function(e,data){
          if(s.uploadKind==1) return false;//FTP上传
          if(s.blnUploading){tool.info('正在上传文件,请稍后再试!');return false;}

          var file=data.files[0];//上传文件
  
          if(!file.name.match(s.allowType)){
            tool.info('文件格式,只允许上传(txt)格式文件!');
            return;
          }

          //判断文件大小
          if(file.size>5*1024*1024){
            tool.info('只能上传5M以内的文件数据!');
            return;
          }

          data.formData ={code:s.curParseData.code || ''};
          data.submit();
          return;
        },
        done:function(e,data){
          s.blnUploading=false;
          s.uploadInfo='文件拖动这里';
          if(data.result.msg.code!='successed'){
            tool.info(data.result.msg.node);
            return;
          }else{
            tool.info('文件上传成功!');
          }
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            s.uploadInfo='正在上传,请耐心等待...';
            s.blnUploading=true;
        }
      });
    },
    //执行界面Tag项单击事件
    tag_item_click(id){
      this.curAction=id;
    },
    next(){
      //this.sly.activatePage(1);
      //this.curIndex=1;
    },
    reload(){
      if(!this.sly)return;
      this.sly.reload();
    },
    //添加文件解析配置
    addParseFile(){
      let s=this;
      tool.open(function(){
        let html=`
          <div style="margin-top: 10px;">
            <el-select v-model="encoding" placeholder="编码格式">
                <el-option
                v-for="item in ['utf-8']"
                :key="item"
                :label="item"
                :value="item">
                </el-option>
            </el-select>
          </div>
          <div style="margin-top: 10px;">
            <el-select v-model="microprobe_type" placeholder="系统采集类型">
                <el-option
                v-for="item in [{name:'网吧',val:120},{name:'宾馆酒店',val:126},{name:'特征',val:145},{name:'WIFI',val:146},{name:'其他',val:999}]"
                :key="item.val"
                :label="item.name"
                :value="item.val">
                </el-option>
            </el-select>
          </div>

          <CInput label="列分隔符" @change="col_sep_change" />

          <CInput label="行分隔符" @change="row_sep_change" />

          <el-button-group style="width:100%;margin-top: 10px;">
                <el-button style="width:50%;" :class="{openFileParse_active:!blnFTP}" @click="blnFTP=false;">不支持FTP</el-button>
                <el-button style="width:50%;" :class="{openFileParse_active:blnFTP}" @click="blnFTP=true;">支持FTP</el-button>
          </el-button-group>

          <CInput v-if="blnFTP" label="文件名筛选(支持通配符星号'*',‘非’控制符'^')多个逗号分隔" @change="filters_change" />

          <el-button-group style="width:100%;margin-top: 10px;">
                <el-button style="width:50%;" :class="{openFileParse_active:!is_first_column_name}" @click="is_first_column_name=false;">不包含列头</el-button>
                <el-button style="width:50%;" :class="{openFileParse_active:is_first_column_name}" @click="is_first_column_name=true;">包含列头</el-button>
          </el-button-group>

          <el-button-group style="width:100%;margin-top: 10px;">
            <el-button style="width:100%;" @click="setColumnInfo()">设置列相关信息</el-button>
          </el-button-group>

          <el-button-group style="width:100%;margin-top: 10px;" v-if="is_first_column_name">
            <el-button style="width:100%;" @click="setColumnSort()">设置列上传顺序</el-button>
          </el-button-group>

          <div class="optionBar" style="text-align:right;margin-top: 10px;">
              <button type="button" class="btn btn-success" @click="submit()">确定</button>
              <button type="button" class="btn btn-default" @click="close()">关闭</button>
          </div>
        `;
        let param={
            title:'添加文件解析配置',
            area:'400px',
            content:`<div class="openFileParse" style="width:100%;height:100%;overflow-y:auto;padding:15px;">${html}</div>`,
            components:{CInput},
            context:{
               blnFTP:false,
               col_seperator:'\t',//Tag
               row_seperator:'\r\n',//回车换行
               is_first_column_name:false,
               encoding:'',
               filters:[],
               microprobe_type:'',//系统采集类型
               sorts:[],//字段排序关键字数组
               col_sep_change(val){param.selfData.col_seperator=val;},
               row_sep_change(val){param.selfData.row_seperator=val;},
               filters_change(val){param.selfData.filters=val.split(',');},
               //设置列相关信息
               setColumnInfo(){
                 s.setColumnInfo(param.selfData);
               },
               //设置列顺序
               setColumnSort(){
                 s.setColumnSort().then(res=>{
                  param.selfData.sorts=res;
                 });
               },
               submit(){
                  let d=param.selfData;
                  //判断在包含列头的情况下每列是否包含列头设置
                  if(d.is_first_column_name){
                    let blnFlag=true;
                    for(let i =0;i<s.fileds.length;i++){
                        if(!s.fileds[i].file_column){blnFlag=false;break;}
                    }
                    if(!blnFlag){tool.info('包含列头的情况,字段列头不能为空!');return;}
                  }

                  //构造列数据结构
                  let columns=_.map(s.fileds,r=>{
                    return {
                      datasource_column:r.key,
                      file_column:r.file_column,
                      def_val:r.def_val,
                      format:r._format,
                      params:[r.firstParam].concat([r.senondParam])
                    };
                  });

                  let tmp={
                    datasource:s.sourceKey,
                    col_seperator:d.col_seperator=='\\t'?'\t':d.col_seperator || '\t',
                    row_seperator:d.row_seperator=='\\r\\n'?'\r\n':d.row_seperator || '\r\n',
                    ori_col_seperator:d.col_seperator=='\t'?'\\t':d.col_seperator || '\\t',
                    ori_row_seperator:d.row_seperator=='\r\n'?'\\r\\n':d.row_seperator || '\\r\\n',
                    is_first_column_name:d.is_first_column_name,
                    blnContainHeader:d.is_first_column_name?'包含':'不包含',
                    encoding:d.encoding || 'utf-8',
                    microprobe_type:d.microprobe_type,
                    filters:d.filters,
                    columns:d.sorts.length<=0? columns:_.map(d.sorts,key=>{ 
                      return _.find(columns,c=>c.datasource_column==key) || {
                        datasource_column:'',
                        file_column:'',
                        def_val:'',
                        format:'',
                        params:[]
                      };
                    })
                  };

                  //添加到数据
                  s.store.dispatch(upload_add_fileparse,tmp).then(res=>{
                    if(!tool.msg(res,'添加文件解析成功!','添加文件解析失败!')){return;}
                    tmp.num=s.parseData.length+1;
                    tmp.code=res.biz_body.code;
                    s.parseData.push(tmp);
                    param.selfData.close();
                  });
               },
               close(){
                 //清除列对象上的缓存数据
                  _.each(s.fileds,r=>{
                    r.file_column='';
                    r.def_val='';
                    r._format='';
                    r.firstParam='';
                    r.senondParam='';
                  });
                  param.close();
               }
            }
        };
        
        return param;
      }());
    },
    //设置列顺序
    setColumnSort(){
      let s=this;

      return new Promise((resolve,reject)=>{
        tool.open(function(){
          let html=`
            <div class="addFieldBtn" @click="addSit()">
              <el-tooltip effect="light" content="添加占位符(不需要处理的列)" placement="top">
                <i class="fa fa-plus"></i>
              </el-tooltip>
            </div>
            <div style="width:100%;height:calc(100% - 44px);overflow-y:auto;overflow-x: hidden;">
              <div class="column_sort_container">
                <div class="item" v-for="(d,i) in data" :data-key="d.key">
                    <div class="number">{{i+1}}</div>
                    <div class="name">{{d.name}}</div>
                </div>
              </div>
            </div>
            <div class="optionBar" style="text-align:right;padding:5px 15px;border-top:1px solid #e7eaec;">
                <button type="button" class="btn btn-success" @click="submit()">确定</button>
                <button type="button" class="btn btn-default" @click="close()">关闭</button>
            </div>
          `;
          let param={
              title:'设置列上传顺序',
              area:['593px','445px'],
              content:`<div class="openFileParse_column_sort" style="width:100%;height:100%;overflow: hidden;">${html}</div>`,
              components:{CInput,Scroll},
              context:{
                gridly:null,
                sorts:_.map(s.fileds,s=>s.key) || [],//排序关键字数组
                data:tool.Clone(s.fileds),
                //添加站位项
                addSit(){
                  param.selfData.data.unshift({name:'站位符'});
                  param.selfData.sorts.unshift('');

                  setTimeout(()=>{
                    param.selfData.gridly.reload();
                  },200);
                },
                //获取排序数据
                getSort(els){
                  let keys=_.chain(els).map(i=>{return $(i).attr('data-key') || '';}).value();
                  param.selfData.sorts=keys;
                },
                submit(){
                  resolve(param.selfData.sorts);
                  param.close();
                },
                close(){
                  param.close();
                }
              },
              success(layero){
                let self=param.selfData;
                self.gridly = $(layero).find('.column_sort_container').dragsort({
                      columns:5,
                      remove:()=>{
                          self.blnDrag=true;
                      },
                      mouseup:(els)=>{
                          if(self.blnDrag){setTimeout(()=>{ self.blnDrag=false;},0)}else{self.blnDrag=false;}
                          self.getSort(els);
                      }
                });
              }
          };

          return param;
        }());
      });
    },
    //设置列相关信息
    setColumnInfo(d){
      let s=this;
      return new Promise((resolve,reject)=>{
        tool.open(function(){

          let html=`
            <div style="float:left;width:150px;height:calc(100% - 45px);border-right:1px solid #e7eaec;">
              <Scroll :store="store" :listen="columns">
                <div v-for="(c,i) in columns" class="column_item divEllipsis" :class="{active:i==curIndex}" @click.stop="colClick(c,i)">{{i+1}}.<span style="font-size:12px;">{{c.name}}</span></div>
              </Scroll>
            </div>

            <div style="margin-left:150px;height:calc(100% - 45px);">
                <div style="width:100%;height:100%;padding: 15px;" v-if="curCol">
                    <CInput label="文件列名" @change="col_name_change" :val="curCol.file_column" tip="必填" :require="fileRequrie" />
                    
                    <CInput label="缺省值" @change="col_defVal_change" :val="curCol.def_val" />

                    <div style="margin-top: 10px;">
                      <el-select v-model="curCol._format" placeholder="格式化函数" :clearable="true" @change="formatChange">
                          <el-option
                          v-for="item in parseFormat"
                          :key="item.val"
                          :label="item.name"
                          :value="item.val">
                          </el-option>
                      </el-select>
                    </div>

                    <div style="margin-top: 10px;" v-if="curCol._format=='SUBSTRING'">
                        <CInput label="启始索引" @change="param_one_change" :val="curCol.firstParam" />
                        <CInput label="结束索引" @change="param_two_change" :val="curCol.senondParam" />
                    </div>

                    <div style="margin-top: 10px;" v-if="curCol._format=='REPALCE'">
                      <CInput label="正则表达式" @change="param_one_change" :val="curCol.firstParam" />
                      <CInput label="替换字符串" @change="param_two_change" :val="curCol.senondParam" />
                    </div>

                    <div style="margin-top: 10px;" v-if="curCol._format=='TO_UNIX_TIMESTAMP'">
                      <CInput label="来源时间格式(如:yyyyMMddHHmmss)" @change="param_one_change" :val="curCol.firstParam" />
                    </div>

                    <div style="margin-top: 10px;" v-if="curCol._format=='TO_DEFINE'">
                      <CInput label="定义的值" :val="curCol.firstParam" />
                    </div>

                    <div style="margin-top: 10px;" v-if="curCol._format=='TO_DEFAULT'">
                      <CInput label="默认值" :val="curCol.firstParam" />
                    </div>

                    <div style="margin-top: 10px;" v-if="curCol._format=='TO_POLICE_STATION'">
                      <CInput label="字段名" :val="curCol.firstParam" />
                    </div>

                    <div style="margin-top: 10px;" v-if="curCol._format=='TO_CHECKSUM_ID'">
                      <CInput label="字段名" :val="curCol.firstParam" />
                    </div>
                </div>
            </div>

            <div style="padding: 5px 15px;text-align: right;border-top:1px solid #e7eaec;">
              <button type="button" class="btn btn-default" @click="close()">确定</button>
            </div>
          `;

          let param={
            title:'设置列相关信息',
            area:['600px','400px'],
            content:`<div class="openFileParse_column" style="width:100%;height:100%;overflow-y:auto;">${html}</div>`,
            components:{CInput,Scroll},
            context:{
              fileRequrie:d.is_first_column_name,
              curIndex:-1,
              parseFormat:parseFormat,
              store:s.store,
              columns:s.fileds,
              curCol:null,
              blnClick:false,
              formatChange(){
                if(param.selfData.blnClick){param.selfData.blnClick=false;return;}
                param.selfData.curCol.firstParam='';
                param.selfData.curCol.senondParam='';
              },
              colClick(d,i){
                param.selfData.blnClick=true;
                param.selfData.curCol=d;
                param.selfData.curIndex=i;
                setTimeout(()=>{
                  param.selfData.blnClick=false;
                },100)
              },
              close(){
                param.close();
              },
              col_name_change(val){param.selfData.curCol.file_column=val;},
              col_defVal_change(val){param.selfData.curCol.def_val=val;},
              param_one_change(val){param.selfData.curCol.firstParam=val;},
              param_two_change(val){param.selfData.curCol.senondParam=val;}
            }
          };

          return param;
        }());
      });
    },  
    //执行新增字段页面切换动画(打开新增字段操作页面)
    exceAddFieldAnimate(){
      this.blnAddFiled=true;
      this.field=tool.Clone(field);
      //this.field.type=this.fieldType[0].id;
      setTimeout(()=>{this.blnAddFiled=false;this.blnOpenAddFiled=true;},800);
    },
    //添加字段
    addField(){
      if(!this.field.name || !this.field.key){
        tool.info('字段名称或字段关键不能为空!');
        return;
      }

      this.field.type=this.field.type || FieldType[0].id;
      this.field._data_type=this.field._data_type || 'text';
      this.field.typeName=(_.find(FieldType,f=>f.id==this.field.type) || {name:''}).name;

      this.fileds.push(tool.Clone(this.field));
      this.blnOpenAddFiled=false;
    },
    //删除字段
    delField(val){
      this.fileds.splice(_.findIndex(this.fileds,f=>f.key == val.key),1);
      _.each(this.action_setting,v=>{
        _.findIndex(v.fields,f=>f == val.key)>=0?v.fields.splice(_.findIndex(v.fields,f=>f == val.key),1):'';
      });
    },
    //复选框值改变事件
    actionSel(val,blnSel){
      let  fields=this.action_setting[this.curAction].fields;
      if(val=='_全选'){
        this.action_setting[this.curAction].fields=blnSel?_.map(this.fileds,f=>f.key):[];
      }else{
        blnSel?fields.push(val):fields.splice(_.findIndex(fields,f=>f==val),1);
      }
    },
    //保存配置信息(数据源)
    saveConfig(){
      if(this.blnSearch){tool.info('正在保存配置信息,请稍后...'); return;}
      if(!this.table.name){tool.info('数据源名称不能为空!'); return;}

      //构造数据结构
      let table=tool.Clone(this.table),fields=tool.Clone(this.fileds),action=tool.Clone(this.action_setting);
      fields.type=fields.type || this.fieldType[0].id;
      fields._data_type=fields._data_type || 'text';
      table.fields=_.object(_.pluck(fields,'key'),fields);

      let actionObj={};
      for(let key in action){
        if(action[key].fields.length<=0){continue;}
        actionObj[key]=action[key];
      }
      table.action=actionObj;

      table.primeKey=(_.map(_.filter(fields,f=>{ return f.primeKey==1 || f.primeKey==3}),v=>v.key) || [''])[0];
      table.indexFields.requisite=_.map(_.filter(fields,f=>f.indexType==1),v=>v.key) || [];
      table.indexFields.notRequisite=_.map(_.filter(fields,f=>f.indexType==2),v=>v.key) || [];

      //构造后台数据源需要的数据
      let serData={
        source:'',
        conf:this.ela_conf,
        primary_columns:_.map(_.filter(fields,f=>{return f.primeKey==2 || f.primeKey==3 }),v=>v.key) || [],
        columns:_.map(fields,f=>{
          return {
            column:f.key,
            data_type:f._data_type,
            is_index:f.indexType>0,
            column_title:f.name
          };
        })
      };

      //保存
      this.blnSearch=true;
      this.store.dispatch(upload_add_dataSource,{webConfig:table,dbConfig:serData}).then(res=>{
        this.blnSearch=false;
        if(!tool.msg(res,'添加数据源配置成功!','添加本地数据源失败!')){return;}
        this.sourceKey=res.biz_body.key;

        table.key=res.biz_body.key;
        this.sly.activatePage(this.blnSetAction?4:3);this.curIndex=this.blnSetAction?4:3;
        this.$emit('saveconfig',table);
      });
    },
    t_name_change(val){
      this.sourceNameSub.next(val);
    },
    t_desc_change(val){this.table.desc=val;},
    f_name_change(val){this.field.name=val;},
    f_key_change(val){this.field.key=val;},
    f_desc_change(val){this.field.desc=val;}
  }
}
</script>

<style lang="less">
  @import "../../css/variables.less";
  .openFileParse_active{background-color:@Font_Hover_Col;color:white !important;}

  .openFileParse_column .column_item{line-height:30px; padding:0px 10px;width: 150px;.border('bottom');}
  .openFileParse_column .column_item:hover{cursor:pointer;background-color:@Font_Hover_Col;color:white;}
  .openFileParse_column .active{background-color:@Font_Hover_Col;color:white;}


  .openFileParse_column_sort .item{
    float: left;
    width: 120px;
    height: 119px;
    margin-top: 0px;
    border-radius: 0px;
    position: relative;
    background-color:#e7eaec;
    color:black;
    text-align:center;
  }

  .openFileParse_column_sort .item .number{width:30px;height:30px;line-height:30px;background-color:@btn_Bg_Col_2;border-radius:50%;text-align:center;color:white;margin: auto;
    margin-top: 30px;}
  .openFileParse_column_sort .item .name{margin-top:10px;font-size:12px;}

  .openFileParse_column_sort .item:hover{background-color:@Font_Hover_Col;color:white;}
  .openFileParse_column_sort .column_sort_container{position:relative;}
  .openFileParse_column_sort .addFieldBtn{
    position:absolute;top:0px;right:0px;z-index:100;width:26px;height:26px;background-color:@HeaderBgCol;
    color:white;border-bottom-left-radius:26px;text-align:center;cursor:pointer;
  }
  .openFileParse_column_sort .addFieldBtn i{margin-left:5px;}
  .openFileParse_column_sort .addFieldBtn:hover i{color:@Font_Hover_Col;}

</style>

<style scoped lang="less">
@import "../../css/variables.less";

@timeH:60px;
.timeShaft{width:100%;height:@timeH;.border('top');text-align:center;}
.timeShaft .item{width:80px;height:@timeH - 7;display: inline-block;position:relative;}
.timeShaft .item .iconContainer{position:absolute;left:0px;top:10px;width:40px; height:40px;cursor:pointer;z-index: 100;line-height:44px;border-radius:20px;background-color:@FontCol;color:white;text-align:center;}
.timeShaft .item.active .iconContainer{background-color:@Font_Hover_Col;}
.timeShaft .item .iconContainer .icon{font-size:18px;}
.timeShaft .item .line{height:3px;width:100%;position:absolute;background-color:@FontCol;top: 50%;margin-top: 2px;}
.timeShaft .item.active .line{background-color:@Font_Hover_Col;}
.timeShaft .item.lastItem{width:40px;}

.AddSource{width:100%;height:~'calc(100% - @{timeH})';}
.AddSource .table_info{width:100%;}
.frame { width: 100%; height: 160px; padding: 0; }
.frame .slidee { margin: 0; padding: 0; height: 100%; list-style: none; }
.frame .slidee li { float: left; margin: 0 5px 0 0; padding: 0; width: 120px; height: 100%; }

.table_info{float:left;}

.pageCut{width:0px;height:0px;position:absolute;top:0px;right:0px;z-index:100;background-color:#000;opacity:.6;}
.pageCutAnimate{.trans(1.2s);width:200%;height:200%;border-bottom-left-radius:100%;}
.filed_table{height:~'calc(100% - 44px)';}
.addFieldPage{position:absolute;width:100%;height:100%;z-index:101;top:0px;left:0px;display:none;background-color:white;padding:10px;}

.addFieldBtn{
  position:absolute;top:0px;right:0px;z-index:100;width:26px;height:26px;background-color:@HeaderBgCol;
  color:white;border-bottom-left-radius:26px;text-align:center;cursor:pointer;
  }
.addFieldBtn i{margin-left:5px;}
.addFieldBtn:hover i{color:@Font_Hover_Col;}

.addFieldPage .active{background-color:@Font_Hover_Col;color:white;}

@tagW:80px;
.action .tag{height:100%;width:@tagW;float:left;.border('right');}
.action .content{margin-left:@tagW;height:100%;}

.tag .tag_item{height:@tagW/9*8;width:100%;.border('bottom');text-align:center;display:table;font-size:12px;}
.tag .tag_item:hover{background-color:@Font_Hover_Col;color:white;cursor:pointer;}
.tag .tag_item.active{background-color:@Font_Hover_Col;color:white;}


@headerH:40px;
.action .content .body .item,
.action .content .header{height:@headerH;width:100%;line-height:@headerH;.border('bottom');}
.action .content .body{height:~'calc(100% - @{headerH})';width:100%;}

.action .a_container{height:~'calc(100% - 54px)';.border('bottom');}
@selItemW:40px;
.action .content .body .item .sel,
.action .content .header .sel{width:@selItemW;display:inline-block;text-align:center;}
.action .content .body .item .name,
.action .content .header .name{width:~'calc(100% - @{selItemW} )';display:inline-block;.border('left');text-align:center;font-size:12px;}


 .action .content .header {background-color:@Font_Hover_Col;color:white;}

 .upload_info{font-size:30px;color:@FontCol;font-weight: 600;}

 .uploadPage .active{background-color:@Font_Hover_Col;color:white !important;}


  .frame { width: 100%; height: 30px; line-height:30px;padding: 0; .border('');}
  .frame .slidee { margin: 0; padding: 0; height: 100%; list-style: none; }
  .frame .slidee li { 
    float: left; margin: 0 0px 0 0; padding: 0; width: 100px; height: 100%;position: relative;
    .border('left');text-align:center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    }

  .frame .slidee li:first-child{border-left:none;}
  .frame .slidee li:last-child{.border('right');}
  .scrollbar { width: 100%; height: 10px;margin-top:10px;cursor:pointer;background: gainsboro;}
  .scrollbar .handle {
        width: 100px; 
        height: 100%;
        background: @Font_Hover_Col;
    }
</style>
