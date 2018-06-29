<!-- 头像识别搜索 -->
<template>
    <div class="FaceSo">
        <!--搜索条件框-->
        <div class="search_container">
            <!--图片拖动处-->
            <div class="photo">
                <div class="header"><span class="title">检索图像</span></div>
                <div class="body">
                  <!--头像展示区域-->
                  <div class="photoShow">
                    <img :src="'/api/v1/face_search/get_upload_image/'+file_name" :onerror="`this.src='${noPersonImg}'`" style="width:100%;height:100%;" />
                  </div>

                  <!--头像描述区域-->
                  <div class="photoInfo" @click="addFiles()" style="cursor:pointer;">
                    <input :id="fileId" :data-url="url" name="files[]" type="file" style="width: 0px;position: absolute;top: 0px;right: 0px;bottom: 0px;margin: 0px;opacity: 0;direction: ltr;cursor: pointer;" />
                    <div class="mockphoto">
                        <div class="top_left"></div>
                        <div class="top_right"></div>
                        <div class="bottom_left"></div>
                        <div class="bottom_right"></div>

                        <i :class="{'fa fa-user':!blnUploading,'fa fa-spinner fa-pulse':blnUploading}"></i>
                    </div>
                    <div>{{uploadInfo}}</div>
                  </div>
                </div>
            </div>
            <!--条件设置处-->
            <div class="cond">
                <div class="header"><span class="title">检索条件</span></div>
                <div class="body">
                  <div class="filter_bar"></div>
                  <div class="option_bar">
                    <button type="button" @click="search()" :disabled="!file_name" class="btn btn-primary">搜   索</button>
                  </div>
                </div>
            </div>
        </div>
        <!--搜索结果框-->
        <div class="search_result">
            <div class="header"><span class="title">检索结果</span></div>
            <div class="body" style="padding:10px;position:relative;">
                <!--暂无数据-->
                <div v-if="data.length<=0" style="width:100%;height:100%;text-align:center;display:table;">
                    <div style="display:table-cell;vertical-align: middle;">暂无数据</div>
                </div>
                <!--加载中-->
                <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index: 100;">
                  <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
                </div>

                <Scroll :listen="data" ref="resScroll">
                    <div class="photo_item" v-for="d in data">
                        <div class="photo_item_header">{{d.name}}</div>
                        <div class="photo_item_body">
                            <img class="photo_container" :src="'/api/v1/face_search/get_face_image/'+d.certno" />

                            <div class="photo_item_child">证件号:{{d.certno}}</div>
                            <div class="photo_item_child">相似度:{{(d.similarity*100).toFixed(2)}}%</div>
                            <div class="photo_item_child">民族:{{d.ethnic}}</div>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </Scroll>
            </div>
        </div>
    </div>
</template>


<script>

import '../../static/jquery-file-upload/jquery.ui.widget.js'
import '../../static/jquery-file-upload/jquery.iframe-transport.js'
import '../../static/jquery-file-upload/jquery.fileupload.js'
import '../../static/jquery.particleground.js'
import Scroll from 'components/scroll'

import noPerson from '../assets/noperson.png'

import {SearchFace} from '../store/mutation-types'
export default {
  name: 'FaceSo',
  components:{Scroll},
  data () {
    return {
      fileId:0,
      url:'/api/v1/face_search/upload',
      uploadInfo:'点击此处上传图片',
      blnUploading:false,
      allowType:/(\.|\/)(jpg|jpeg|png)$/i,
      data:[],
      file_name:'',
      noPersonImg:noPerson,
      blnLoading:false
    }
  },
  mounted(){
    this.fileId="file"+tool.guid();

    this.$nextTick(()=>{
      this.initUpload();
    });
    
  },
  methods:{
    layout(){
      this.$nextTick(()=>{
        this.$refs.resScroll.reloadyScroll();
      });
    },
    //搜索
    search(){
      if(!this.file_name){tool.info('请先上传图片!'); return;}
      this.blnLoading=true;
      this.$store.dispatch(SearchFace,{file_name:this.file_name}).then(res=>{
        this.blnLoading=false;
        if(!tool.msg(res)) return;
        if(res.biz_body.length<=0){tool.info('暂无数据!');}
        this.data=res.biz_body;
      });
    },
    //单击上传文件
    addFiles(){
      let uploadEl=$('#'+this.fileId);
      uploadEl.click();
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
            tool.info('只允许上传jpg,jpeg,png格式图片!');
            return;
          }

          //判断文件大小
          if(file.size>5*1024*1024){
            tool.info('只能上传5M以内的文件数据!');
            return;
          }

          
          data.submit();
          return;
        },
        done:function(e,data){
          if(data.result.msg.code!='successed'){
            tool.info('上传失败');
          }else{//成功
            tool.info('上传成功');
            s.file_name=data.result.biz_body.file_name;
          }

          s.uploadInfo='点击此处上传图片';
          s.blnUploading=false;

        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            s.uploadInfo='上传中,请等待...';
            s.blnUploading=true;
        }
      });
    }
  }
}
</script>

<style scoped lang="less">
  @import "../css/variables.less";

  @searchH:150px;
  .FaceSo{padding:10px;width:100%;height:100%;background-color:#f0f0f0;}
  .search_container{height:@searchH;width:100%;}
  @photoW:300px;
  @step:10px;
  .search_container .photo{width:@photoW;height:100%;float:left;background-color:white;}
  .search_container .cond{width:~'calc(100% - @{photoW} - @{step})';margin-left:@step + @photoW;height:100%;background-color:white;}

  .search_result{height:~'calc(100% - @{searchH} - @{step})';margin-top:@step;width:100%;background-color:white;}
  
  @headerH:30px;
  .FaceSo .header{width:100%;height:@headerH;line-height:@headerH;position:relative;.border('bottom');}
  .FaceSo .header .title{padding:0px 15px;font-weight:600;}
  .FaceSo .header:before{
    content:'';
    position:absolute;
    top:0px;left:0px;bottom:0px;width:2px;
  }
  html{.TCol(~'.FaceSo .header:before','bg')}

  .FaceSo .body{height:~'calc(100% - @{headerH})';width:100%;}

  .photoShow{height:100%;padding:10px;width:100px;float:left;}
  
  @bgCol:rgb(224, 224, 224);
  .photoInfo{float:right;height:100%;padding:10px;width:120px;font-size:12px;color:@bgCol;text-align:center;}
  .photoInfo .mockphoto{width:80px;height:80px;line-height:80px;position:relative;margin: 0px auto;text-align:center;margin-bottom:5px;}
  .photoInfo .mockphoto i{font-size:40px;margin-top:20px;}
   
  @photoItemH:220px;
  @photoStep:30px;
  @photoHeaderH:30px;
  .photo_item{
    float:left;height:@photoItemH;width:~'calc(25% - 24px)';margin-left:@photoStep;.border('');border-radius:5px;overflow:hidden;margin-bottom:10px;
  }
  .photo_item:nth-child(5n+1){margin-left:0px;}
  .photo_item .photo_item_header{height:@photoHeaderH;line-height:@photoHeaderH;font-size:12px;width:100%;color:white;text-align:center;}
  html{.TCol(~'.photo_item .photo_item_header','bg')}

  .photo_item  .photo_item_body{height:~'calc(100% - @{photoHeaderH})';width:100%;text-align:center;overflow:hidden;}
  .photo_item  .photo_item_body .photo_container{display:block;margin:10px 40px;height:(@photoItemH - @photoStep)/5*3;width:~'calc(100% - 80px)';}

  .photo_item .photo_item_child{font-size:12px;text-align:center;}

  @Distance:0px;
  @AngleSize:35px;
  @lineW:2px;
  
  .FaceSo .top_left{top:@Distance;left:@Distance*2;position:absolute;width:@AngleSize;height:@AngleSize;overflow:hidden;border-radius:5px;}
  .FaceSo .top_left:before{
    content:'';position:absolute;left:0px;
    width:100%;height:@lineW;background:linear-gradient(135deg,fade(@bgCol,90%) @AngleSize - 20px,transparent 0)
  }
  .FaceSo .top_left:after{
    content:'';position:absolute;left:0px;
    height:100%;width:@lineW;background:linear-gradient(135deg,fade(@bgCol,90%) @AngleSize - 20px,transparent 0)
  }

  .FaceSo .top_right{top:@Distance;right:@Distance*2;position:absolute;width:@AngleSize;height:@AngleSize;overflow:hidden;border-radius:5px;}
  .FaceSo .top_right:before{
    content:'';position:absolute;left:0px;
    width:100%;height:@lineW;background:linear-gradient(-135deg,fade(@bgCol,90%) @AngleSize - 20px,transparent 0)
  }

  .FaceSo .top_right:after{
    content:'';position:absolute;right:0px;
    height:100%;width:@lineW;background:linear-gradient(-135deg,fade(@bgCol,90%) @AngleSize - 20px,transparent 0)
  }

  .FaceSo .bottom_left{bottom:@Distance*2;left:@Distance*2;position:absolute;width:@AngleSize;height:@AngleSize;overflow:hidden;border-radius:5px;}
  .FaceSo .bottom_left:before{
    content:'';position:absolute;left:0px;bottom:0px;
    width:100%;height:@lineW;background:linear-gradient(-135deg,transparent 10px,fade(@bgCol,90%) 10px)
  }

  .FaceSo .bottom_left:after{
    content:'';position:absolute;left:0px;bottom:0px;
    height:100%;width:@lineW;background:linear-gradient(-135deg,transparent 10px,fade(@bgCol,90%) 10px)
  }

  .FaceSo .bottom_right{bottom:@Distance*2;right:@Distance*2;position:absolute;width:@AngleSize;height:@AngleSize;overflow:hidden;border-radius:5px;}
  .FaceSo .bottom_right:before{
    content:'';position:absolute;right:0px;bottom:0px;
    width:100%;height:@lineW;background:linear-gradient(135deg,transparent 10px,fade(@bgCol,90%) 10px)
  }

  .FaceSo .bottom_right:after{
    content:'';position:absolute;right:0px;bottom:0px;
    height:100%;width:@lineW;background:linear-gradient(135deg,transparent 10px,fade(@bgCol,90%) 10px)
  }

  
  .FaceSo .filter_bar{width:100%;height:~'calc(100% - 44px)';}
  .FaceSo .option_bar{text-align:center;padding-bottom:5px;}
</style>
