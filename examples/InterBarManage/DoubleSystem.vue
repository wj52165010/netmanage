<!-- 双系统列表页面组件 -->
<template>
    <div class="DoubleSystem">
        <div class="DoubleSystem_container">

            <!--列表头-->
            <div class="table_header">
                <div class="row">

                    <div class="column" style="width:200px;"><span class="overflow" style="width:200px;">终端MAC</span></div>
                    <div class="column"><span class="overflow" :style="{width:column_w+'px'}">终端IP</span></div>
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
  name: 'DoubleSystem',
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
                if(!this.$refs.scroll) return;
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
.DoubleSystem{width:100%;height:100%;}
.DoubleSystem_container{width:100%;height:100%;background-color:white;}

.DoubleSystem .option_bar{text-align:left;padding:5px 15px;line-height:40px;}
.DoubleSystem .option_bar .item{display:inline-block;margin:2px 5px;}

.DoubleSystem .right_option_bar {float:right;}
.DoubleSystem .right_option_bar .item{display:inline-block;margin:2px 5px;}
.DoubleSystem .right_option_bar .item:hover{cursor:pointer;}
html{.TCol(~".DoubleSystem .right_option_bar .item:hover");}

.DoubleSystem .cursor{cursor:pointer;}

.DoubleSystem .page_container{.border('top');}

.DoubleSystem .table_body .item{cursor:pointer;}
html{.TCol(~".DoubleSystem .table_body .item:hover");}

.DoubleSystem .fa-caret-up{position:absolute;top:0px;cursor:pointer;font-size:14px;color:gray;}
.DoubleSystem .fa-caret-down{position:absolute;top:9px;cursor:pointer;font-size:14px;color:gray;}

.DoubleSystem .fa-caret-up.active,
.DoubleSystem .fa-caret-down.active,
.DoubleSystem .fa-caret-up:hover,
.DoubleSystem .fa-caret-down:hover{
    color:white;
}

.DoubleSystem .clickItem:hover{cursor:pointer;text-decoration:underline;}
html{.TCol(~".DoubleSystem .clickItem");}

//列表显示样式
@header_H:25px;
.DoubleSystem .table_header{height:@header_H;display:table;width:100%;border:none;color:white;border-top-left-radius: 5px;border-top-right-radius: 5px;overflow:hidden;}
html{.TCol(~".DoubleSystem .table_header .row",'bg');}

.DoubleSystem .table_header .column{display:table-cell;text-align:center;border-right:none;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}
.DoubleSystem .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;background-color:white;border-bottom:none;}
.DoubleSystem .table_header .column .sort_item .triangle-up:hover{cursor:pointer;}
html{.TCol(~".DoubleSystem .table_header .column .sort_item .triangle-up:hover",'bbc');}

.DoubleSystem .table_header .column .sort_item .triangle-down:hover{cursor:pointer;}
html{.TCol(~".DoubleSystem .table_header .column .sort_item .triangle-down:hover",'btc');}

html{.TCol(~".DoubleSystem .table_header .column .sort_item .triangle-up.active",'bbc');}

html{.TCol(~".DoubleSystem .table_header .column .sort_item .triangle-down.active",'btc');}

.DoubleSystem .table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";}
.DoubleSystem .table_body{width:100%;display:table;width:100%;border:none;}
.DoubleSystem .table_body .column{display:table-cell;text-align:center;border-right:none;border-bottom:none;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}

.overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}

.DoubleSystem .tablebody{.border('');border-top:none;}
</style>
