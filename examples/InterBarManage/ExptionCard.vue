<!-- 异常卡列表页面组件 -->
<template>
    <div class="ExptionCard">
        <div class="ExptionCard_container">

            <!--列表头-->
            <div class="table_header">
                <div class="row">


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
                            <div class="column" style="width:200px;"><span class="overflow " style="width:200px;">{{d.time}}</span></div>
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
  name: 'ExptionCard',
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
        this.column_w=$(this.$el).width()-200 -10;
    },
  }
}
</script>

<style scoped lang="less">
@import "../../css/variables.less";
.ExptionCard{width:100%;height:100%;}
.ExptionCard_container{width:100%;height:100%;background-color:white;}

.ExptionCard .option_bar{text-align:left;padding:5px 15px;line-height:40px;}
.ExptionCard .option_bar .item{display:inline-block;margin:2px 5px;}

.ExptionCard .right_option_bar {float:right;}
.ExptionCard .right_option_bar .item{display:inline-block;margin:2px 5px;}
.ExptionCard .right_option_bar .item:hover{cursor:pointer;}
html{.TCol(~".ExptionCard .right_option_bar .item:hover");}

.ExptionCard .cursor{cursor:pointer;}

.ExptionCard .page_container{.border('top');}

.ExptionCard .table_body .item{cursor:pointer;}
html{.TCol(~".ExptionCard .table_body .item:hover");}

.ExptionCard .fa-caret-up{position:absolute;top:0px;cursor:pointer;font-size:14px;color:gray;}
.ExptionCard .fa-caret-down{position:absolute;top:9px;cursor:pointer;font-size:14px;color:gray;}

.ExptionCard .fa-caret-up.active,
.ExptionCard .fa-caret-down.active,
.ExptionCard .fa-caret-up:hover,
.ExptionCard .fa-caret-down:hover{
    color:white;
}

.ExptionCard .clickItem:hover{cursor:pointer;text-decoration:underline;}
html{.TCol(~".ExptionCard .clickItem");}

//列表显示样式
@header_H:25px;
.ExptionCard .table_header{height:@header_H;display:table;width:100%;border:none;color:white;border-top-left-radius: 5px;border-top-right-radius: 5px;overflow:hidden;}
html{.TCol(~".ExptionCard .table_header .row",'bg');}

.ExptionCard .table_header .column{display:table-cell;text-align:center;border-right:none;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}
.ExptionCard .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;background-color:white;border-bottom:none;}
.ExptionCard .table_header .column .sort_item .triangle-up:hover{cursor:pointer;}
html{.TCol(~".ExptionCard .table_header .column .sort_item .triangle-up:hover",'bbc');}

.ExptionCard .table_header .column .sort_item .triangle-down:hover{cursor:pointer;}
html{.TCol(~".ExptionCard .table_header .column .sort_item .triangle-down:hover",'btc');}

html{.TCol(~".ExptionCard .table_header .column .sort_item .triangle-up.active",'bbc');}

html{.TCol(~".ExptionCard .table_header .column .sort_item .triangle-down.active",'btc');}

.ExptionCard .table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";}
.ExptionCard .table_body{width:100%;display:table;width:100%;border:none;}
.ExptionCard .table_body .column{display:table-cell;text-align:center;border-right:none;border-bottom:none;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}

.overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}

.ExptionCard .tablebody{.border('');border-top:none;}
</style>
