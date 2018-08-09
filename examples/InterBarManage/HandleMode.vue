<!-- 问题总览详情列表页面组件 -->
<template>
    <div class="HandleMode">
        <div class="IssueList_container">

            <!--列表头-->
            <div class="table_header">
                <div class="row">
                    <div class="column" style="width:200px;">
                        <span class="overflow" style="width:200px;position:relative;">
                            <span style="margin-right:5px;">操作时间</span>
                            <i class="fa fa-caret-up" :class="{active:!timeOrder}" @click="timeOrder=false"></i><i class="fa fa-caret-down" :class="{active:timeOrder}" @click="timeOrder=true"></i>
                        </span>
                    </div>

                    <div class="column"><span class="overflow" :style="{width:column_w+'px'}">处理方式</span></div>
                    <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">操作者</span></div>
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
                            <div class="column" style="width:200px;"><span class="overflow " style="width:200px;">{{d.time}}</span></div>
                            <div class="column"><span class="overflow" :style="{width:column_w+'px'}">{{d.handle}}</span></div>
                            <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">{{d.user}}</span></div>
                        </div>
                    </div>
                </Scroll>
            </div>

            <!--底部操作按钮-->
            <div class="bottom_bar" style="text-align:center;">
                <button type="button" class="btn btn-primary btn-sm">处理</button>
                <button type="button" class="btn btn-default btn-sm">观察</button>
            </div>
        </div>
    </div>
</template>

<script>
import Scroll from  'components/scroll'



import {BODY_RESIZE,GetFirm} from '../../store/mutation-types'
export default {
  name: 'HandleMode',
  components:{Scroll},
  data () {
    return {
        simpleTime:{
            disabledDate(time) {
            return time.getTime() > Date.now();
            }
        },
        column_w:0,
        bodyResizeSub:null,
        bodyH:0,
        data:[
           {time:'2018-06-04 14:26',handle:'处理',user:'系统'},
           {time:'2018-06-04 14:26',handle:'忽略',user:'产品部'},
        ],
        blnLoading:false,
        pageIndex:0,
        timeOrder:false,
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
            this.bodyH=`calc(100% - 50px - 40px)`;

            this.$nextTick(()=>{
                if(!this.$refs.scroll) return;
                this.$refs.scroll.reloadyScroll()
            })
        },500);
        this.column_w=$(this.$el).width()-300 -10;
    },
  }
}
</script>

<style scoped lang="less">
@import "../../css/variables.less";
.HandleMode{width:100%;height:100%;padding:5px;}
.IssueList_container{width:100%;height:100%;background-color:white;}

.HandleMode .option_bar{text-align:left;padding:5px 15px;line-height:40px;}
.HandleMode .option_bar .item{display:inline-block;margin:2px 5px;}

.HandleMode .right_option_bar {float:right;}
.HandleMode .right_option_bar .item{display:inline-block;margin:2px 5px;}
.HandleMode .right_option_bar .item:hover{cursor:pointer;}
html{.TCol(~".HandleMode .right_option_bar .item:hover");}

.HandleMode .cursor{cursor:pointer;}

.HandleMode .page_container{.border('top');}

.HandleMode .table_body .item{cursor:pointer;}
html{.TCol(~".HandleMode .table_body .item:hover");}

.HandleMode .fa-caret-up{position:absolute;top:8px;cursor:pointer;font-size:14px;color:gray;}
.HandleMode .fa-caret-down{position:absolute;top:17px;cursor:pointer;font-size:14px;color:gray;}

.HandleMode .fa-caret-up.active,
.HandleMode .fa-caret-down.active,
.HandleMode .fa-caret-up:hover,
.HandleMode .fa-caret-down:hover{
    color:white;
}

.HandleMode .clickItem:hover{cursor:pointer;text-decoration:underline;}
html{.TCol(~".HandleMode .clickItem");}

//列表显示样式
@header_H:40px;
.HandleMode .table_header{height:@header_H;display:table;width:100%;border:none;color:white;}
html{.TCol(~".HandleMode .table_header .row",'bg');}

.HandleMode .table_header .column{display:table-cell;text-align:center;border-right:none;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}
.HandleMode .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;.border('bottom');background-color:white;}
.HandleMode .table_header .column .sort_item .triangle-up:hover{cursor:pointer;}
html{.TCol(~".HandleMode .table_header .column .sort_item .triangle-up:hover",'bbc');}

.HandleMode .table_header .column .sort_item .triangle-down:hover{cursor:pointer;}
html{.TCol(~".HandleMode .table_header .column .sort_item .triangle-down:hover",'btc');}

html{.TCol(~".HandleMode .table_header .column .sort_item .triangle-up.active",'bbc');}

html{.TCol(~".HandleMode .table_header .column .sort_item .triangle-down.active",'btc');}

.HandleMode .table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";.border('bottom');}
.HandleMode .table_body{width:100%;display:table;width:100%;border:none;}
.HandleMode .table_body .column{display:table-cell;text-align:center;border-right:none;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}

.overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}

.HandleMode .bottom_bar{.border('top');padding-top:10px;}
html{.TCol(~".HandleMode .btn-primary",'bg');}
</style>
