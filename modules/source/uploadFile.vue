<!-- 上传文件组件 -->
<template>
    <div class="UploadFile">
        <HTag :tags="pages" @change="tagChange">
            <div slot="t0" style="height:100%;width:100%;padding:10px;">
                <div class="content" :id="'c'+fileId">
                    <div style="overflow:hidden;color:gray;"><div class="fileName"><i class="fa fa-folder-o"></i>文件 : {{uploadFileName}}</div></div>
                    <input :id="fileId" :data-url="url" name="files[]" type="file" style="width: 0px;position: absolute;top: 0px;right: 0px;bottom: 0px;margin: 0px;opacity: 0;direction: ltr;cursor: pointer;" />
                    <div style="position:absolute;top:50%;left:50%;margin-top: -105px;margin-left: -129px;text-align:center;" :style="{'margin-left':uploadStauts==4?'-94px':uploadStauts==1?'-71px':'-129px'}">
                        <!--上传文件-->
                        <div v-if="uploadStauts==0">
                            <i class="fa fa-cloud-upload" style="font-size: 150px;color: gray;/*! text-align: center; */margin-top: 40px;"></i>
                            <div style="text-align:center;width:100%;">将文件拖拽至此，或<span @click="addFiles()" style="color:red;cursor:pointer;">点击此处</span>上传 <span style="color:gray;font-size:10px;">(暂仅支持txt文本)</span></div>
                        </div>
                        <!--文件上传失败-->
                        <div v-if="uploadStauts==1">
                            <img src="../../assets/cry.png" style="width:50px;" />
                            <span class="tipInfo">文件上传失败!</span>
                            <div style="margin-top:10px;">
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
                </div>
            </div>
            <div slot="t1" style="height:100%;width:100%;padding-top:30px;">
                <div style="text-align: center;">
                    <div class="name" style="display:inline-block;font-style:italic;font-size:14px;">FTP文件名筛选 :</div><div style="display:inline-block;width:200px;margin:0px 10px;">
                        <el-input v-model="file_name" />
                    </div><div style="display:inline-block;">
                        <div><button @click="ftpSet()" type="button" class="btn btn-default btn-sm" style="padding:5px 36px">{{ftp_is_open?'停 用':'启 用'}}</button></div>
                    </div>
                </div>
                <div style="padding-left:200px;">
                    <div class="tipInfo"><span class="dot"></span>通配符星号 : *</div>
                    <div class="tipInfo"><span class="dot"></span>非处理符号 : ^</div>
                    <div class="tipInfo"><span class="dot"></span>忽略大小写</div>
                    <div class="tipInfo"><span class="dot"></span>不支持正则表达式</div>
                </div>
            </div>
        </HTag>
    </div>
</template>

<script>
import '../../../static/jquery-file-upload/jquery.ui.widget.js'
import '../../../static/jquery-file-upload/jquery.iframe-transport.js'
import '../../../static/jquery-file-upload/jquery.fileupload.js'
import '../../../static/jquery.particleground.js'

import {upload_update_fileparse} from '../../store/mutation-types'
import HTag from 'components/HTag'
export default {
  name: 'UploadFile',
  props:['store','code','id','fileName','ftp','parseItem'],
  components:{HTag},
  data () {
    return {
       url:ser.uri+'/upload/file',//上传地址
       fileId:'',
       uploadFileName:'',
       uploadStauts:0,//文件上传状态(0:为开始上传,1:上传失败,2:上传成功)
       uploadCurData:null,//当前上传的文件对象
       pages:[{name:'文本',icon:'fa fa-tag'},{name:'FTP',icon:'fa fa-tag'}],
       allowType:/(\.|\/)(txt)$/i,
       file_name:'',
       ftp_is_open:false,
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
    fileName(){
        this.file_name=this.fileName;
    },
    ftp(){
        this.ftp_is_open=this.ftp;
    }
  },
  mounted(){
    this.$store=this.$store || this.store;
    this.fileId="file"+tool.guid();
    this.ftp_is_open=this.ftp;

    this.$nextTick(()=>{
        this.initUpload();
    });
  },
  methods:{
    //重新初始化
    reload(){
        //this.initUpload();
    },
    tagChange(i){

    },
    //FTP设置
    ftpSet(){
        this.$store.dispatch(upload_update_fileparse,{
            code:this.code,
            file_name_filters:this.file_name.split(',') || [],
            ftp_is_open:!this.ftp_is_open
        }).then(res=>{
            if(!tool.msg(res,'设置成功'))return;

            this.parseItem.file_name_filters=this.file_name.split(',');
            this.ftp_is_open=!this.ftp_is_open;
        });
    },
    //上传文件
    addFiles(){
        let uploadEl=$('#'+this.fileId);
        uploadEl.click();
    },
    //重新上传
    againUpload(){
         $('#'+this.fileId).fileupload('enable');
         this.uploadStauts=0;
    },
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

                s.uploadFileName=data.files[0].name;
                s.uploadCurData=data;

                data.formData ={
                    code:s.code,
                    id:s.id
                };
                
                data.submit();
                s.uploadStauts=4;
                return;
            },
            done:function(e,data){
                if(data.result.msg.code!='successed'){
                    s.uploadStauts=1;
                    tool.info(data.result.msg.note);
                    return;
                }else{//成功
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
  }
}
</script>

<style scoped lang="less">
@import "../../css/variables.less";
.UploadFile{width:100%;height:100%;text-align:left;}
.UploadFile .content{width:100%;height:100%;}

.UploadFile .tipInfo{color:gray;}
.UploadFile .tipInfo .dot{width:5px;height:5px;background-color:gray;border-radius:50%;display:inline-block;float:left;margin-top:8px; margin-right:5px;}
</style>
