<!-- 新增数据源组件 -->
<template>
    <div class="AddSource">
        <!--选择文件-->
        <div class="SelFile">
             <!--标题栏-->
            <div class="title">
                <span class="name">选择文件</span>
            </div>
            <!--内容栏-->
            <div class="content" :id="'c'+fileId">
                <div style="overflow:hidden;"><div class="fileName"><i class="fa fa-folder-o"></i>文件 : {{uploadFileName}}</div></div>
                <input :id="fileId" :data-url="url" name="files[]" type="file" style="width: 0px;position: absolute;top: 0px;right: 0px;bottom: 0px;margin: 0px;opacity: 0;direction: ltr;cursor: pointer;" />
                <div style="position:absolute;top:50%;left:50%;margin-top: -105px;margin-left: -129px;text-align:center;">
                    <!--上传文件-->
                    <div v-if="uploadStauts==0">
                        <i class="fa fa-cloud-upload" style="font-size: 150px;color: gray;/*! text-align: center; */margin-top: 40px;"></i>
                        <div style="text-align:center;width:100%;">将文件拖拽至此，或<span @click="addFiles()" style="color:red;cursor:pointer;">点击此处</span>上传 <span style="color:gray;font-size:10px;">(暂仅支持txt文本)</span></div>
                    </div>
                    <!--文件上传失败-->
                    <div v-if="uploadStauts==1">
                        <img src="../../assets/cry.png" style="width:50px;" />
                        <span class="tipInfo">文件上传失败!</span>
                        <div>
                            <button type="button" @click="againUpload()" class="btn btn-default btn-sm" style="padding:5px 20px">重新上传</button>
                        </div>
                    </div>
                    <!--文件上传成功-->
                    <div v-if="uploadStauts==2">
                        <img src="../../assets/smile.png" style="width:50px;" />
                        <span class="tipInfo">文件上传成功,请点击下一步继续!</span>
                        <div>
                            <button type="button" @click="againUpload()" class="btn btn-default btn-sm" style="padding:5px 20px">重新上传</button>
                        </div>
                    </div>

                    <!--文件正在上传中-->
                    <div v-if="uploadStauts==4">
                        <i class="fa fa-cloud-upload" style="font-size: 150px;color: gray;/*! text-align: center; */margin-top: 40px;"></i>
                        <div style="text-align:center;width:100%;">文件正在上传中请耐心等待.....</div>
                    </div>
                </div>

                <!--列格式化函数-->
                <div style="position:absolute;bottom:5px;right:5px;cursor:pointer;" @click="formatCol()"><i class="fa fa fa-cog fa-fw"></i> 格式化函数</div>
            </div>
        </div>
        <!--解析规则-->
        <div class="ParsingRules">
            <!--标题栏-->
            <div class="title">
                <span class="name">解析规则</span>
            </div>
            <!--内容栏-->
            <div class="content">
                <div class="item">
                    <div class="name">行分隔符 :</div>
                    <div class="option">
                        <el-select  
                            v-model="rowSep"
                            clearable
                            allow-create
                            default-first-option
                            placeholder="请选择">
                            <el-option
                                v-for="item in fileSep"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="clearfix"></div>
                </div>

                <div class="item">
                    <div class="name">列分隔符 :</div>
                    <div class="option">
                        <el-select  
                            v-model="colSep"
                            clearable
                            allow-create
                            default-first-option
                            placeholder="请选择">
                            <el-option
                                v-for="item in fileSep"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="clearfix"></div>
                </div>

                <div class="item">
                    <div class="name">编码格式 :</div>
                    <div class="option">
                        <el-select  
                            v-model="encoding"
                            placeholder="请选择">
                            <el-option
                                v-for="item in ['utf-8','gbk']"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="clearfix"></div>
                </div>

                <div class="item" style="display:none;">
                    <div class="name">数据来源 :</div>
                    <div class="option">
                        <el-select  
                            v-model="sourceOri"
                            placeholder="请选择">
                            <el-option
                                v-for="item in ['elastic']"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="clearfix"></div>
                </div>

                <div class="item">
                    <div class="name">包含列头 :</div>
                    <div class="option">
                        <el-radio v-model="containHeader" style="font-weight:400;" :label="1">是</el-radio>
                        <el-radio v-model="containHeader" style="font-weight:400;" :label="0">否</el-radio>
                    </div>
                    <div class="clearfix"></div>
                </div>

                <!--提示信息-->
                <div class="tipInfo">
                    <div style="font-weight:600;">提示 :</div>
                    <div class="chlidInfo"><span class="dot"></span>上传文件时,请先设置解析规则</div>
                    <div class="chlidInfo"><span class="dot"></span>如果需要直接建表,请点击"没有文件"按钮</div>
                    <div class="chlidInfo"><span class="dot"></span>其他</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import '../../../static/jquery-file-upload/jquery.ui.widget.js'
import '../../../static/jquery-file-upload/jquery.iframe-transport.js'
import '../../../static/jquery-file-upload/jquery.fileupload.js'
import '../../../static/jquery.particleground.js'

import {mapState,mapMutations} from 'vuex'

import ParsingRulesColSet from './ParsingRulesColSet'
import {File_Seperator,SetAddSourcePageData,SetAddSourcePageGo,ClearAddSourcePageData} from '../../store/mutation-types'


export default {
  name: 'AddSource',
  data () {
    return {
      url:ser.uri+'/upload/preview',//上传地址
      fileId:0,
      allowType:/(\.|\/)(txt)$/i,
      uploadInfo:'文件拖动这里',
      uploadFileName:'',
      containHeader:0,
      uploadStauts:0,//文件上传状态(0:未开始上传,1:上传失败,2:上传成功,4:正在上传)
      uploadCurData:null,//当前上传的文件对象
      fileSep:[],//文件分隔符
      rowSep:'',//行分隔符
      colSep:'',//列分隔符
      encoding:'',//编码格式
      sourceOri:'',//数据来源
      value10:'',
      preViewCols:[],//上传文件后返回回来的预览列数据
    }
  },
  watch:{
      uploadStauts(){
        if(this.uploadStauts==0){
            $('#'+this.fileId).fileupload('enable');
        }
        if(this.uploadStauts==1){
            $('#'+this.fileId).fileupload('disable');
        }
        if(this.uploadStauts==2){
            $('#'+this.fileId).fileupload('disable');
        }
        if(this.uploadStauts==4){
            $('#'+this.fileId).fileupload('disable');
        }
      },
      config:{
          deep:true,
          handler:function(){
            this.$store.commit(SetAddSourcePageData,this.config);
          }
      },
      preViewCols(){
        if(this.preViewCols.length<=0){
            this.$store.commit(SetAddSourcePageGo,{name:'AddSource',flag:false,info:'请上传文件或您上传的文件没有数据!'});
        }else{
            this.$store.commit(SetAddSourcePageGo,{name:'AddSource',flag:true});
        }
      }  
  },
  computed:mapState({
      PageData:state=>{
          return state.addSource;
      },
      config(){
          return {
            rowSep:this.rowSep,
            colSep:this.colSep,
            encoding:this.encoding,
            sourceOri:this.sourceOri,
            containerHeader:this.containHeader,
            file:this.uploadCurData,
            uploadStatus:this.uploadStauts,
            cols:this.preViewCols
          }
      }
  }),
  mounted(){
    this.fileId="file"+tool.guid();

    if(this.preViewCols.length<=0){
        this.$store.commit(SetAddSourcePageGo,{name:'AddSource',flag:false,info:'请上传文件或您上传的文件没有数据!'});
    }else{
        this.$store.commit(SetAddSourcePageGo,{name:'AddSource',flag:true});
    }

    this.$nextTick(()=>{
        this.initUpload();
    });

    //获取文件分隔符
    this.$store.dispatch(File_Seperator).then(res=>{
        this.fileSep=res.biz_body;
        //恢复页面之前操作的值
        this.$nextTick(()=>{
            this.recoverData();
        });  
    });

  },
  methods:{
    //清空页面数据
    clearData(){
        this.$store.commit(ClearAddSourcePageData);
    },
    //恢复页面之前操作的值
    recoverData(){
        let {rowSep,colSep,encoding,sourceOri,containerHeader,file,uploadStatus,cols} =this.PageData;
        this.rowSep=rowSep;
        this.colSep=colSep;
        this.encoding=encoding;
        this.sourceOri=sourceOri;
        this.containHeader=containerHeader;
        this.uploadCurData=file;
        this.uploadFileName=this.uploadCurData?this.uploadCurData.files[0].name:'';
        this.uploadStauts=uploadStatus;
        this.preViewCols=cols;
    },
    //单击上传文件
    addFiles(){
       let uploadEl=$('#'+this.fileId);
        uploadEl.click();
    },
    //重新上传
    againUpload(){
        let s=this;
        $('#'+this.fileId).fileupload('enable');
        s.uploadStauts=0;

        // $('#'+this.fileId).fileupload('send', {
        //     files: this.uploadCurData.files,
        //     formData:{
        //       encoding:s.encoding,
        //       row_seperator:s.rowSep,
        //       col_seperator:s.colSep,
        //       is_first_column_name:s.containHeader>=1,
        //    }
        // });
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

          if(!s.rowSep){
            tool.info('请设置行分隔符!');
            return;
          }

          if(!s.colSep){
            tool.info('请设置列分隔符!');
            return;
          }

          s.uploadFileName=data.files[0].name;
          s.uploadCurData=data;

          data.formData ={
              encoding:s.encoding,
              row_seperator:s.rowSep,
              col_seperator:s.colSep,
              is_first_column_name:s.containHeader>=1,
          };
          
          data.submit();
          s.uploadStauts=4;
          return;
        },
        done:function(e,data){
          if(data.result.msg.code!='successed'){
            s.uploadStauts=1;
            return;
          }else{//成功
            s.preViewCols=_.map(data.result.data,d=>{
                d.source_column='';
                d.dest_column='';
                d.def_val='';
                d.format='';
                d.params=[];
                d.ignore=0;
                d.firstParam='';
                d.senondParam='';
                d.type=(d.type || 'string').toLowerCase();
                return d;
            });

            s.uploadStauts=2;
          }
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            s.uploadInfo='正在上传,请耐心等待...';
            s.blnUploading=true;
        }
      });
    },

    //列格式化函数
    formatCol(){
        let s=this;

        tool.open(function(){
            let html=`<ParsingRulesColSet :store="store" :data="data" :sort="containHeader" />`;
            let param={
                title:'格式化函数',
                area: ['600px', '400px'],
                components:{ParsingRulesColSet},
                content:`<div class="source_upload_format_col_pop" style="width:100%;height:100%;">${html}</div>`,
                context:{
                    store:s.$store,
                    containHeader:s.containHeader<=0,
                    data:s.preViewCols || [],
                    submit_btn(){
                        //layer.title('',index);
                    },
                    cancel_btn(){
                        param.close();
                    },
                    pageChange(index){
                       
                    }
                },
                success(layero, index){
                },
            };
        return param;
        }());
    }
  }
}
</script>

<style scoped lang="less">
  @import "../../css/variables.less";
  .AddSource{width:100%;height:100%;padding:10px;text-align:left;}
  @ParsingRulesW:300px;
  .SelFile{width:~'calc(100% - @{ParsingRulesW} - 10px)';height:100%;.border('');float:left;}
  .ParsingRules{width:@ParsingRulesW;height:100%;.border('');float:right;}

  @titleH:40px;
  .ParsingRules .title,
  .SelFile .title{text-align:left;width:100%;height:@titleH;line-height:@titleH;padding:0px 10px;.border('bottom');font-weight:600;font-style: italic;}

  .ParsingRules .content,
  .SelFile .content{width:100%;height:~'calc(100% - @{titleH})';position:relative;}

  .SelFile .content .fileName{color:gray;margin:10px 0px 0px 10px;font-style:italic;}
  .SelFile .content .fileName i{margin-right:5px;}
  
  .ParsingRules .content{}
  .ParsingRules .content .item {width:@ParsingRulesW*.8;line-height:40px;margin:0px auto;margin-top:10px;}
  
  @ItemNameW:70px;
  .ParsingRules .content .item .name{width:@ItemNameW;float:left;font-style:italic;}
  .ParsingRules .content .item .option{float:right;width:~'calc(100% - @{ItemNameW})';}

  .tipInfo{padding:10px;}
  .tipInfo .chlidInfo{color:gray;}
  .tipInfo .chlidInfo .dot{width:5px;height:5px;background-color:gray;border-radius:50%;display:inline-block;float:left;margin-top:8px; margin-right:5px;}
</style>
