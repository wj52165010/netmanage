<!-- 报警详细页面组件 -->
<template>
    <div class="CallPolicy">
        <div class="CallPolicy_container">

            <div class="option_bar">

                <div class="item">
                    <span>报警时间:</span>
                    <div style="display:inline-block;">
                        <el-date-picker  type="date" placeholder="选择日期" :picker-options="simpleTime"> </el-date-picker>
                    </div>
                </div>

            </div>

            <!--列表头-->
            <div class="table_header">
                <div class="row">
                    <div class="column" style="width:150px;">
                        <span class="overflow" style="width:150px;position:relative;">
                            <span style="margin-right:5px;">报警时间</span>
                            <i class="fa fa-caret-up" :class="{active:!policyTimeOrder}" @click="policyTimeOrder=false"></i><i class="fa fa-caret-down" :class="{active:policyTimeOrder}" @click="policyTimeOrder=true"></i>
                        </span>
                    </div>

                    <div class="column"><span class="overflow" :style="{width:column_w+'px'}">报警原因</span></div>
                    <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">通知方式</span></div>
                    <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">处置状态</span></div> 
                    <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">处置剩余时间</span></div>
                    <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">处置人</span></div>
                    <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">联系电话</span></div>
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
                            <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">报警时间</span></div>
                            <div class="column"><span class="overflow" :style="{width:column_w+'px'}">报警原因</span></div>
                            <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">通知方式</span></div>
                            <div class="column" style="width:120px;"><span class="overflow clickItem" @click="lookState(d)" style="width:120px; clickItem">处置状态</span></div> 
                            <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">处置剩余时间</span></div>
                            <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">处置人</span></div>
                            <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">联系电话</span></div>
                        </div>
                    </div>
                </Scroll>
            </div>

            <!--分页栏-->
            <div name="page_container" class="page_container" style="background-color:white;">
                <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageIndex+1}}</span></span>
                <div class="firstPage" @click="pageChange(0)">首页</div>
                <div class="prePage" @click="pageChange(pageIndex-1)">上一页</div>
                <div class="nextPage" @click="pageChange(pageIndex+1)">下一页</div>          
            </div>
            
            <!--右边显示栏-->
            <div class="right_pop" :style="{left:blnShowPop?'0px':'-100%'}">
               <!--标题栏-->
               <div class="title_bar">处置详情 <i class="fa fa-remove" @click="blnShowPop=false" style="float:right;margin-right: 10px;margin-top: 8px;" /></div>
               <!--内容栏-->
               <div class="content_bar"><HandlerWay /></div>
            </div>
        </div>
    </div>
</template>

<script>
import Scroll from  'components/scroll'
import HandlerWay from './HandlerWay'

import {BODY_RESIZE,GetFirm} from '../../store/mutation-types'
export default {
  name: 'CallPolicy',
  components:{Scroll,HandlerWay},
  data () {
    return {
        simpleTime:{
            disabledDate(time) {
            return time.getTime() > Date.now();
            }
        },
        policyTimeOrder:false,
        column_w:0,
        bodyResizeSub:null,
        bodyH:0,
        data:[1,2,3],
        blnLoading:false,
        pageIndex:0,
        blnShowPop:false,
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
            this.bodyH=`calc(100% - 50px - 40px - ${$(this.$el).find('.option_bar').height()}px)`;

            this.$nextTick(()=>{
                this.$refs.scroll.reloadyScroll()
            })
        },100);
        this.column_w=$(this.$el).width()-760 -10;
    },
    //查看处置状态
    lookState(d){
        this.blnShowPop=true;
    }
  }
}
</script>

<style scoped lang="less">
@import "../../css/variables.less";

.CallPolicy{width:100%;height:100%;padding:5px;position:relative;overflow:hidden;}
.CallPolicy_container{width:100%;height:100%;background-color:white;position:relative;}

.CallPolicy .option_bar{text-align:left;padding:5px 15px;line-height:40px;}
.CallPolicy .option_bar .item{display:inline-block;margin:2px 5px;}

.CallPolicy .right_option_bar {float:right;}
.CallPolicy .right_option_bar .item{display:inline-block;margin:2px 5px;}
.CallPolicy .right_option_bar .item:hover{cursor:pointer;}
html{.TCol(~".CallPolicy .right_option_bar .item:hover");}

.CallPolicy .cursor{cursor:pointer;}

.CallPolicy .page_container{.border('top');}

.CallPolicy .table_body .item{cursor:pointer;}
html{.TCol(~".CallPolicy .table_body .item:hover");}

.CallPolicy .fa-caret-up{position:absolute;top:8px;cursor:pointer;font-size:14px;color:gray;}
.CallPolicy .fa-caret-down{position:absolute;top:17px;cursor:pointer;font-size:14px;color:gray;}
.CallPolicy .fa-caret-up:hover,
.CallPolicy .fa-caret-down:hover{
    color:white;
}

.CallPolicy .clickItem:hover{cursor:pointer;}
html{.TCol(~".CallPolicy .clickItem");}

//列表显示样式
@header_H:40px;
.CallPolicy .table_header{height:@header_H;display:table;width:100%;border:none;color:white;}
html{.TCol(~".CallPolicy .table_header .row",'bg');}

.CallPolicy .table_header .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}
.CallPolicy .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;.border('bottom');background-color:white;}
.CallPolicy .table_header .column .sort_item .triangle-up:hover{cursor:pointer;}
html{.TCol(~".CallPolicy .table_header .column .sort_item .triangle-up:hover",'bbc');}

.CallPolicy .table_header .column .sort_item .triangle-down:hover{cursor:pointer;}
html{.TCol(~".CallPolicy .table_header .column .sort_item .triangle-down:hover",'btc');}

html{.TCol(~".CallPolicy .table_header .column .sort_item .triangle-up.active",'bbc');}

html{.TCol(~".CallPolicy .table_header .column .sort_item .triangle-down.active",'btc');}

.CallPolicy .table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";.border('bottom');}
.CallPolicy .table_body{width:100%;display:table;width:100%;border:none;}
.CallPolicy .table_body .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}

.CallPolicy .table_body .column:first-child{.border('left');}
.overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}


//右边显示栏信息
.CallPolicy .right_pop{
    width:600px;height:350px;position:absolute;left:-100%;top:100px;background:white;.trans();
    -moz-box-shadow:2px 2px 5px #333333; -webkit-box-shadow:2px 2px 5px #333333; box-shadow:2px 2px 5px #333333;
}
@titleH:30px;
.CallPolicy .right_pop .title_bar{width:100%;height:@titleH;color:white;text-align:center;line-height:@titleH;}
.CallPolicy .right_pop .title_bar i:hover{cursor:pointer;}
html{.TCol(~".CallPolicy .right_pop .title_bar",'bg');}

.CallPolicy .right_pop .content_bar{width:100%;height:~'calc(100% - @{titleH})'}


</style>
