<!-- 舆情个人详细页面 -->
<template>
    <div class="PublicOpiDetail">
        <!--基本信息-->
        <div class="baseInfo">
          <!--显示人员信息-->
          <div class="personInfo">
            <!--左边头像-->
            <div class="leftPhoto">
              <span class="title">人员基本信息</span>
              <div class="imgContainer"><img src="" /></div>
            </div>
            <!--右边信息-->
            <div class="rightInfo">
              <div class="line">
                <div class="item">证件号:<span class="info color">500109198612122533</span></div>
                <div class="item">姓名:<span class="info">王小贱</span></div>
              </div>
              <div class="line">
                <div class="item">性别:<span class="info">男</span></div>
                <div class="item">证件类型:<span class="info">身份证</span></div>
              </div>
              <div class="line">
                <div class="item">生日:<span class="info">1986/12/12</span></div>
                <div class="item">涉案:<span class="info">民事行为</span></div>
              </div>
              <div class="line">
                <div class="item">分数:<span class="info max red">100</span></div>
              </div>
            </div>
          </div>
        </div>
        <!--列表信息-->
        <div class="listInfo">
          <!--标题栏-->
          <div class="title_bar">预警信息详解</div>
          <!--内容栏-->
          <div class="content_bar">
            <!--表头-->
            <div class="table_header">
                <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                    <thead><tr>
                        <th style="width:200px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:200px;" class="divEllipsis">上机时间</div></th>
                        <th style="width:200px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:200px;" class="divEllipsis">下机时间</div></th>
                        <th style="border-bottom:0px;border-right:1px solid #ddd;" :style="{width:detailW+'px'}" class="text-center"><div :style="{width:detailW+'px'}" class="divEllipsis">摘要</div></th>
                        <th style="width:50px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis">详细</div></th>
                    </tr></thead>
                </table>
            </div>
            <!--表体-->
            <div class="table_body">
              <Scroll>

              </Scroll>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import Scroll from 'components/scroll'
export default {
  name: 'PublicOpiDetail',
  components:{Scroll},
  data () {
    return {
      detailW:0,
    }
  },
  mounted(){
    this.layout();
  },
  methods:{
    layout(){
      setTimeout(()=>{
        let w= $(this.$el).find('.content_bar').width();
        this.detailW=w - 450 - 5;
      },0);
    }
  }
}
</script>

<style scoped lang="less">
  @import "../css/variables.less";
  .PublicOpiDetail{width:100%;height:100%;}
  @bgColor:#d9d9d9;
  @baseInfoH:200px;
  .PublicOpiDetail .baseInfo{width:100%;height:@baseInfoH;padding:20px;}

  .PublicOpiDetail .listInfo{width:100%;height:~'calc(100% - @{baseInfoH})';padding:0px 40px 40px 40px;text-align:left;}

  .PublicOpiDetail .baseInfo .personInfo{margin:0px 50px;height:100%;}

  @leftPhotoW:150px;
  .PublicOpiDetail .baseInfo .personInfo .leftPhoto{float:left;width:@leftPhotoW;height:100%;text-align:center;}
  .PublicOpiDetail .baseInfo .personInfo .leftPhoto .title{display:block;font-size:18px;font-weight:600;}
  html{.TCol(~'.PublicOpiDetail .baseInfo .personInfo .leftPhoto .title')}
 
 .PublicOpiDetail .baseInfo .personInfo .leftPhoto .imgContainer{margin:15px 25px;height:~'calc(100% -  55px)';}
 .PublicOpiDetail .baseInfo .personInfo .leftPhoto .imgContainer img{width:100%;height:100%;}


  .PublicOpiDetail .baseInfo .personInfo .rightInfo{margin-left:@leftPhotoW;height:100%;text-align:left;padding-top:40px;font-size:12px;}
  .PublicOpiDetail .baseInfo .personInfo .rightInfo .line{.border('bottom',@bgColor);overflow:hidden;line-height:25px;}
  .PublicOpiDetail .baseInfo .personInfo .rightInfo .line .item{float:left;width:50%;}
  .PublicOpiDetail .baseInfo .personInfo .rightInfo .line .item .info{margin-left:5px;}

  html{.TCol(~'.PublicOpiDetail .baseInfo .personInfo .rightInfo .color')}
  .PublicOpiDetail .baseInfo .personInfo .rightInfo .red{color:red;}
  .PublicOpiDetail .baseInfo .personInfo .rightInfo .max{font-weight:600;font-size:16px;}

  @titleBarH:30px;
  .PublicOpiDetail .listInfo .title_bar{height:@titleBarH;line-height:@titleBarH;width:100%;font-weight:600;font-size:18px;padding-left:50px;}
  html{.TCol(~'.PublicOpiDetail .listInfo .title_bar')}

  .PublicOpiDetail .listInfo .content_bar{height:~'calc(100% - @{titleBarH})';width:100%;}

  //列表样式
@tableRowH:40px;
.table{margin-bottom:0px;color: white;}
.table_header{height:@tableRowH;.border('bottom');border-top-right-radius:5px;border-top-left-radius:5px;}
.table_header tr{height:~'calc(@{tableRowH} - 1px)';}
.table_header th{padding-left:0px;padding-right:0px;}
.table_header{color:white;}
html{.TCol(~".table_header",'bg');}

.table_body{height:~'calc(100% - @{tableRowH})';width:100%;background-color:@bgColor;border-bottom-right-radius:5px;border-bottom-left-radius:5px;}
.table_body td{padding-left:0px;padding-right:0px;}
</style>
