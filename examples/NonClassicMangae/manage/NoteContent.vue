<!-- 通知内容页组件 -->
<template>
    <div class="NoteContent">
      <div class="NoteContent_container">

        <!--标题栏-->
        <div class="title_bar">
            <div class="vaildData">有效期:2018年7月16日20:00</div>
            <div class="title">XXX事件通知</div>
            <div class="subTitle">发布时间:2018年7月16日 &nbsp;&nbsp; 发布人:产品部</div>
        </div>
        <!--内容栏-->
        <div class="content_bar">
            XXX事件通知
        </div>

      </div>
    </div>
</template>

<script>

export default {
  name: 'NoteContent',
  data () {
    return {

    }
  },
  methods:{
    
  }
}
</script>

<style scoped lang="less">
@import "../../../css/variables.less";
.NoteContent{width:100%;height:100%;padding:5px;}
.NoteContent_container{width:100%;height:100%;background-color:white;.border('');}

@TitleH:80px;
.NoteContent .title_bar{width:100%;height:@TitleH;.border('bottom');font-size:12px;padding:5px;}
.NoteContent .title_bar .vaildData{color:red;}
.NoteContent .title_bar .title{text-align:center;font-size:16px;font-weight:600;}
.NoteContent .title_bar .subTitle{text-align:center;color:gray;margin-top:10px;}

.NoteContent .content_bar{width:100%;height:~'calc(100% -  @{TitleH})';padding:10px;overflow-y:auto;}
</style>
