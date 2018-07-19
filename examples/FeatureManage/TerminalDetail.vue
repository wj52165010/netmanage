<!-- 终端概况详情组件 -->
<template>
    <div class="TerminalDetail">
        <div class="TerminalDetail_container">

            <!--列表头-->
            <div class="table_header">
                <div class="row">
                    <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">证件类型</span></div>
                    <div class="column" style="width:200px;"><span class="overflow" style="width:200px;">证件号</span></div>

                    <div class="column" style="width:120px;">
                        <span class="overflow" style="width:120px;position:relative;">
                            <span style="margin-right:5px;">姓名</span>
                            <i class="fa fa-caret-up" :class="{active:!nameOrder}" @click="nameOrder=false"></i><i class="fa fa-caret-down" :class="{active:nameOrder}" @click="nameOrder=true"></i>
                        </span>
                    </div>

                    <div class="column" style="width:60px;"><span class="overflow" style="width:60px;">名族</span></div>
                    <div class="column"><span class="overflow" :style="{width:column_w+'px'}">地址</span></div>
                    <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">终端IP</span></div>
                    <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">终端MAC</span></div>
                    <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">采集时间</span></div>
                    <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">终端状态</span></div>

                </div>
            </div>

            <!--列表体-->
            <div :style="{height:bodyH}" style="position:relative;">
                <!--加载中-->
                <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index: 100;">
                    <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
                </div>
                <!--暂无数据-->
                <div v-if="data.length<=0 && blnLoading==false" style="width:100%;height:100%;text-align:center;display:table;">
                    <div style="display:table-cell;vertical-align: middle;">暂无数据</div>
                </div>

                <Scroll :listen="data" ref="scroll">
                    <div class="table_body">
                        <div class="row" v-for="d in data">
                            <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">证件类型</span></div>
                            <div class="column" style="width:200px;"><span class="overflow" style="width:200px;">证件号</span></div>
                            <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">姓名</span></div>
                            <div class="column" style="width:60px;"><span class="overflow" style="width:60px;">名族</span></div>
                            <div class="column"><span class="overflow" :style="{width:column_w+'px'}">地址</span></div>
                            <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">终端IP</span></div>
                            <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">终端MAC</span></div>
                            <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">采集时间</span></div>
                            <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">终端状态</span></div>
                        </div>
                    </div>
                </Scroll>
            </div>
        </div>

    </div>
</template>

<script>
import Scroll from  'components/scroll'
import {BODY_RESIZE} from '../../store/mutation-types'
export default {
  name: 'TerminalDetail',
  components:{Scroll},
  data () {
    return {
      column_w:0,
      bodyResizeSub:null,
      bodyH:0,
      data:[1,2,3],
      blnLoading:false,
      nameOrder:false
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
            this.bodyH=`calc(100% - 40px - 10px )`;

            this.$nextTick(()=>{
                this.$refs.scroll.reloadyScroll()
            })
        },100);
        this.column_w=$(this.$el).width()-1030;
    },
  }
}
</script>
<style scoped lang="less">
 @import "../../css/variables.less";
.TerminalDetail{width:100%;height:100%;padding:5px;}
.TerminalDetail_container{width:100%;height:100%;background-color:white;}


.TerminalDetail .fa-caret-up{position:absolute;top:8px;cursor:pointer;font-size:14px;color:gray;}
.TerminalDetail .fa-caret-down{position:absolute;top:17px;cursor:pointer;font-size:14px;color:gray;}
.TerminalDetail .fa-caret-up:hover,
.TerminalDetail .fa-caret-down:hover{
    color:white;
}
//列表显示样式
@header_H:40px;
.TerminalDetail .table_header{height:@header_H;display:table;width:100%;border:none;color:white;}
html{.TCol(~".TerminalDetail .table_header .row",'bg');}

.TerminalDetail .table_header .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}
.TerminalDetail .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;.border('bottom');background-color:white;}
.TerminalDetail .table_header .column .sort_item .triangle-up:hover{cursor:pointer;}
html{.TCol(~".TerminalDetail .table_header .column .sort_item .triangle-up:hover",'bbc');}

.TerminalDetail .table_header .column .sort_item .triangle-down:hover{cursor:pointer;}
html{.TCol(~".TerminalDetail .table_header .column .sort_item .triangle-down:hover",'btc');}

html{.TCol(~".TerminalDetail .table_header .column .sort_item .triangle-up.active",'bbc');}

html{.TCol(~".TerminalDetail .table_header .column .sort_item .triangle-down.active",'btc');}

.TerminalDetail .table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";.border('bottom');}
.TerminalDetail .table_body{width:100%;display:table;width:100%;border:none;}
.TerminalDetail .table_body .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}

.TerminalDetail .table_body .column:first-child{.border('left');}

.overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}
</style>
