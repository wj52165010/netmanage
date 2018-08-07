<!-- 长挂卡列表页面组件 -->
<template>
    <div class="LongHungCard">
        <div class="LongHungCard_container">

            <!--列表头-->
            <div class="table_header">
                <div class="row">
                    <div class="column" style="width:150px;">
                        <span class="overflow" style="width:150px;position:relative;">
                            <span style="margin-right:5px;">开始时间</span>
                            <i class="fa fa-caret-up" :class="{active:!timeOrder}" @click="timeOrder=false"></i><i class="fa fa-caret-down" :class="{active:timeOrder}" @click="timeOrder=true"></i>
                        </span>
                    </div>
                    <div class="column" style="width:100px;">
                        <span class="overflow" style="width:100px;position:relative;">
                            <span style="margin-right:5px;">使用时长</span>
                            <i class="fa fa-caret-up" :class="{active:!timeOrder}" @click="timeOrder=false"></i><i class="fa fa-caret-down" :class="{active:timeOrder}" @click="timeOrder=true"></i>
                        </span>
                    </div>

                    <div class="column" style="width:200px;"><span class="overflow" style="width:200px;">姓名</span></div>
                    <div class="column"><span class="overflow" :style="{width:column_w+'px'}">证件号</span></div>
                </div>
            </div>

            <!--列表体-->
            <div class="tablebody"  style="position:relative;height:calc(100%  - 25px);">
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
                            <div class="column" style="width:150px;"><span class="overflow " style="width:150px;">{{d.time}}</span></div>
                            <div class="column" style="width:100px;"><span class="overflow " style="width:100px;">{{d.time}}</span></div>
                            <div class="column" style="width:100px;"><span class="overflow " style="width:200px;">{{d.time}}</span></div>
                            <div class="column" ><span  class="overflow " :style="{width:column_w+'px'}" :title="d.content">{{d.content}}</span></div>
                        </div>
                    </div>
                </Scroll>
            </div>

        </div>
    </div>
</template>

<script>
import Scroll from  'components/scroll'
import {BODY_RESIZE,GetFirm} from '../../store/mutation-types'
export default {
  name: 'LongHungCard',
  components:{Scroll},
  data () {
    return {
        column_w:0,
        bodyResizeSub:null,
        bodyH:0,
        data:[
            {time:'20',content:'1.dsalkjdlkasjjjjjjjjjj'}
        ],
        blnLoading:false,
        pageIndex:0,
        timeOrder:false,
    }
  },
  mounted(){

   setTimeout(()=>{
       this.layout();
   },200);
   
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
            this.$nextTick(()=>{
                this.$refs.scroll.reloadyScroll()
            })
        },500);
        this.column_w=$(this.$el).width()-450 -10;
    },
  }
}
</script>

<style scoped lang="less">
@import "../../css/variables.less";
.LongHungCard{width:100%;height:100%;}
.LongHungCard_container{width:100%;height:100%;background-color:white;}

.LongHungCard .option_bar{text-align:left;padding:5px 15px;line-height:40px;}
.LongHungCard .option_bar .item{display:inline-block;margin:2px 5px;}

.LongHungCard .right_option_bar {float:right;}
.LongHungCard .right_option_bar .item{display:inline-block;margin:2px 5px;}
.LongHungCard .right_option_bar .item:hover{cursor:pointer;}
html{.TCol(~".LongHungCard .right_option_bar .item:hover");}

.LongHungCard .cursor{cursor:pointer;}

.LongHungCard .page_container{.border('top');}

.LongHungCard .table_body .item{cursor:pointer;}
html{.TCol(~".LongHungCard .table_body .item:hover");}

.LongHungCard .fa-caret-up{position:absolute;top:0px;cursor:pointer;font-size:14px;color:gray;}
.LongHungCard .fa-caret-down{position:absolute;top:9px;cursor:pointer;font-size:14px;color:gray;}

.LongHungCard .fa-caret-up.active,
.LongHungCard .fa-caret-down.active,
.LongHungCard .fa-caret-up:hover,
.LongHungCard .fa-caret-down:hover{
    color:white;
}

.LongHungCard .clickItem:hover{cursor:pointer;text-decoration:underline;}
html{.TCol(~".LongHungCard .clickItem");}

//列表显示样式
@header_H:25px;
.LongHungCard .table_header{height:@header_H;display:table;width:100%;border:none;color:white;border-top-left-radius: 5px;border-top-right-radius: 5px;overflow:hidden;}
html{.TCol(~".LongHungCard .table_header .row",'bg');}

.LongHungCard .table_header .column{display:table-cell;text-align:center;border-right:none;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}
.LongHungCard .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;background-color:white;border-bottom:none;}
.LongHungCard .table_header .column .sort_item .triangle-up:hover{cursor:pointer;}
html{.TCol(~".LongHungCard .table_header .column .sort_item .triangle-up:hover",'bbc');}

.LongHungCard .table_header .column .sort_item .triangle-down:hover{cursor:pointer;}
html{.TCol(~".LongHungCard .table_header .column .sort_item .triangle-down:hover",'btc');}

html{.TCol(~".LongHungCard .table_header .column .sort_item .triangle-up.active",'bbc');}

html{.TCol(~".LongHungCard .table_header .column .sort_item .triangle-down.active",'btc');}

.LongHungCard .table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";}
.LongHungCard .table_body{width:100%;display:table;width:100%;border:none;}
.LongHungCard .table_body .column{display:table-cell;text-align:center;border-right:none;border-bottom:none;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}

.overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}

.LongHungCard .tablebody{.border('');border-top:none;}
</style>
