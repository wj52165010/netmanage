<!-- 网站木马页面组件 -->
<template>
    <div class="WebHorse">
      <!--操作栏-->
      <div class="option_bar">
 
      </div>
      
      <!--列表头-->
      <div class="table_header">
          <div class="row">
              <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">木马类型</span></div>
              <div class="column" style="width:350px;"><span class="overflow" style="width:350px;">URL地址</span></div>
              <div class="column"><span class="overflow" :style="{width:column_w+'px'}">木马详情</span></div>
          </div>
      </div>

      <!--列表体-->
      <div class="table_body" :style="{height:bodyH}" style="position:relative;">
          <!--加载中-->
          <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index: 100;">
              <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
          </div>
          <!--暂无数据-->
          <div class="row" v-if="data.length<=0">暂无数据</div>

          <Scroll :listen="data" ref="scroll">
              <div class="row" >
                <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">木马类型</span></div>
                <div class="column" style="width:350px;"><span class="overflow" style="width:350px;">URL地址</span></div>
                <div class="column"><span class="overflow" :style="{width:column_w+'px'}">木马详情</span></div>
              </div>
          </Scroll>
      </div>

    </div>
</template>

<script>
import Scroll from  'components/scroll'

import {BODY_RESIZE} from '../../store/mutation-types'
export default {
  name: 'WebHorse',
  components:{Scroll},
  data () {
    return {
      blnLoading:false,
      bodyH:0,
      column_w:0,
      bodyResizeSub:null,
      pageIndex:0,
      data:[1],
    }
  },
  mounted(){
   this.layout();

   this.$store.commit(BODY_RESIZE,{cb:(sub)=>{
       this.bodyResizeSub=sub
   },sub:()=>{
      this.layout();
   }});
  },
  beforeDestroy(){
    this.bodyResizeSub.unsubscribe();
  },
  methods:{
    layout(){
        setTimeout(()=>{
            this.bodyH=`calc(100% - 50px - ${$(this.$el).find('.option_bar').height()}px)`;

            this.$nextTick(()=>{
               this.$refs.scroll.reloadyScroll()
            })
        },100);
        this.column_w=$(this.$el).width()-500;
    },
  }
}
</script>

<style scoped lang="less">
  @import "../../css/variables.less";
  .WebHorse{width:100%;height:100%;}

  .WebHorse .option_bar{text-align:left;padding:5px 15px;}
  .WebHorse .option_bar .item{display:inline-block;margin:2px 5px;}

  .WebHorse .table_body .row .bold{font-weight:bold;color:#03ab67;}
  .WebHorse .table_body .row .bold:hover{text-decoration:underline;cursor:pointer;}
  //列表显示样式
  @header_H:40px;
  .WebHorse .table_header{height:@header_H;display:table;width:100%;border:none;color:white;}
  html{.TCol(~".WebHorse .table_header .row",'bg');}

  .WebHorse .table_header .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}
  .WebHorse .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;.border('bottom');background-color:white;}
  .WebHorse .table_header .column .sort_item .triangle-up:hover{cursor:pointer;}
  html{.TCol(~".WebHorse .table_header .column .sort_item .triangle-up:hover",'bbc');}

  .WebHorse .table_header .column .sort_item .triangle-down:hover{cursor:pointer;}
  html{.TCol(~".WebHorse .table_header .column .sort_item .triangle-down:hover",'btc');}

  html{.TCol(~".WebHorse .table_header .column .sort_item .triangle-up.active",'bbc');}

  html{.TCol(~".WebHorse .table_header .column .sort_item .triangle-down.active",'btc');}

  .WebHorse .table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";.border('bottom');}
  .WebHorse .table_body{width:100%;display:table;width:100%;border:none;}
  .WebHorse .table_body .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}

  .overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}

  .WebHorse .table_body .row:hover{cursor:pointer;background-color:#f5f5f5;}
</style>
