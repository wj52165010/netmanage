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
                  <div class="photoShow"></div>

                  <!--头像描述区域-->
                  <div class="photoInfo">
                    <div class="mockphoto">
                        <div class="top_left"></div>
                        <div class="top_right"></div>
                        <div class="bottom_left"></div>
                        <div class="bottom_right"></div>

                        <i class="fa fa-user"></i>
                    </div>
                    <div>只能上传一张图片</div>
                  </div>
                </div>
            </div>
            <!--条件设置处-->
            <div class="cond">
                <div class="header"><span class="title">检索条件</span></div>
                <div class="body"></div>
            </div>
        </div>
        <!--搜索结果框-->
        <div class="search_result">
            <div class="header"><span class="title">检索结果</span></div>
            <div class="body" style="padding:10px;">
                <Scroll :listen="data" ref="resScroll">
                    <div class="photo_item" v-for="d in data">
                        <div class="photo_item_header">2012-12-12 12:12:12</div>
                        <div class="photo_item_body">
                            <img class="photo_container" />
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </Scroll>
            </div>
        </div>
    </div>
</template>


<script>
import Scroll from 'components/scroll'

export default {
  name: 'FaceSo',
  components:{Scroll},
  data () {
    return {
      data:[1,2,3,4,5,5,6,7],
    }
  },
  methods:{
    layout(){
      console.log(2);
      this.$nextTick(()=>{
        this.$refs.resScroll.reloadyScroll();
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
   
  @photoItemH:200px;
  @photoStep:30px;
  @photoHeaderH:30px;
  .photo_item{
    float:left;height:@photoItemH;width:~'calc(20% - 24px)';margin-left:@photoStep;.border('');border-radius:5px;overflow:hidden;margin-bottom:10px;
  }
  .photo_item:nth-child(5n+1){margin-left:0px;}
  .photo_item .photo_item_header{height:@photoHeaderH;line-height:@photoHeaderH;font-size:12px;width:100%;color:white;text-align:center;}
  html{.TCol(~'.photo_item .photo_item_header','bg')}

  .photo_item  .photo_item_body{height:~'calc(100% - @{photoHeaderH})';width:100%;text-align:center;overflow:hidden;}
  .photo_item  .photo_item_body .photo_container{display:block;margin:10px 30px;height:(@photoItemH - @photoStep)/5*3;width:~'calc(100% - 60px)';}


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
</style>
