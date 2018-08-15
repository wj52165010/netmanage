<!-- 通知内容页组件 -->
<template>
    <div class="NoteContent">
      <Loading v-if="blnLoading" />
      <div class="NoteContent_container">

        <!--标题栏-->
        <div class="title_bar">
            <div class="vaildData">有效期:{{d.timelimit_desc}}</div>
            <div class="title">"{{d.title}}"事件通知</div>
            <div class="subTitle">发布时间:{{d.post_time_desc}} &nbsp;&nbsp; 发布人:{{d.author}}</div>
        </div>
        <!--内容栏-->
        <div class="content_bar">
            {{d.content}}
        </div>

      </div>
    </div>
</template>

<script>
import Loading from 'components/Loading'

import {BODY_RESIZE,InterBar} from '../../../store/mutation-types'
export default {
  name: 'NoteContent',
  props:['code'],
  components:{Loading},
  data () {
    return {
      blnLoading:false,
      d:{},
    }
  },
  mounted(){
    this.loadData();
  },
  methods:{
    loadData(){
      
      this.blnLoading=true;
      this.$store.dispatch(InterBar.netbar_notice_detail,{
        notice_id:this.code
      }).then(res=>{
        this.blnLoading=false;
        if(!tool.msg(res,'','获取通知内容失败!')) return;

        this.d=res.biz_body;
      });

    }
  }
}
</script>

<style scoped lang="less">
@import "../../../css/variables.less";
.NoteContent{width:100%;height:100%;padding:5px;position:relative;}
.NoteContent_container{width:100%;height:100%;background-color:white;.border('');}

@TitleH:80px;
.NoteContent .title_bar{width:100%;height:@TitleH;.border('bottom');font-size:12px;padding:5px;}
.NoteContent .title_bar .vaildData{color:red;}
.NoteContent .title_bar .title{text-align:center;font-size:16px;font-weight:600;}
.NoteContent .title_bar .subTitle{text-align:center;color:gray;margin-top:10px;}

.NoteContent .content_bar{width:100%;height:~'calc(100% -  @{TitleH})';padding:10px;overflow-y:auto;}
</style>
