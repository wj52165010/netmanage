<!-- 问题总览待处理页面组件 -->
<template>
    <div class="IssueList">
        <div class="IssueList_container">

            <div class="option_bar">

                <div class="item">
                    <span>报警时间:</span><div style="display:inline-block;">
                        <el-date-picker  type="date" placeholder="选择日期" :picker-options="simpleTime"> </el-date-picker>
                    </div>
                </div>

                <div class="item">
                    <span>问题类型:</span><div style="display:inline-block;">
                        <el-select  placeholder="请选择" :clearable="true">
                            <el-option
                                v-for="kind in  []"
                                :key="kind.value"
                                :label="kind.name"
                                :value="kind.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>

                <!--右边操作栏-->
                <div class="right_option_bar">
                   
                </div>
            </div>

            <!--列表头-->
            <div class="table_header">
                <div class="row">
                    <div class="column" style="width:200px;">
                        <span class="overflow" style="width:200px;position:relative;">
                            <span style="margin-right:5px;">发布时间</span>
                            <i class="fa fa-caret-up" :class="{active:!timeOrder}" @click="timeOrder=false"></i><i class="fa fa-caret-down" :class="{active:timeOrder}" @click="timeOrder=true"></i>
                        </span>
                    </div>

                    <div class="column"><span class="overflow" :style="{width:column_w+'px'}">问题详情</span></div>

                    <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">推送者</span></div>
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
                            <div class="column" style="word-wrap:break-word;white-space: normal;"><span 
                                                    style="display:block;word-wrap:break-word;text-align:left;line-height:25px;padding-left:20px;position:relative;" 
                                                    :style="{width:column_w+'px'}" >
                                                        <template v-for="(c,j) in d.content">

                                                            <div @click="c.blnExport=!c.blnExport" style="cursor:pointer;position:relative;" v-if="c.blnExport!=undefined">
                                                                <i :class="c.blnExport?'fa fa-chevron-down':'fa fa-chevron-right'" style="position:absolute;left:-15px;top:5px;" />
                                                                {{j+1}}.{{c.val}}
                                                            </div>

                                                            <div v-if="c.blnExport==undefined">{{j+1}}.{{c.val}}</div>

                                                            <div v-if="c.blnExport" style="height:100px;width:100%">
                                                                <CircCardList />
                                                            </div>
                                                        </template>
                                                </span>
                            </div>

                            <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">推送者</span></div>
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

        </div>
    </div>
</template>

<script>
import Scroll from  'components/scroll'

import CircCardList from './CircCardList'
import ExptionCard from './ExptionCard'
import LongHungCard from './LongHungCard'
import PlusCard from './PlusCard'
import DoubleSystem from './DoubleSystem'

import {BODY_RESIZE,GetFirm} from '../../store/mutation-types'
export default {
  name: 'PendHandle',
  components:{Scroll,CircCardList,ExptionCard,LongHungCard,PlusCard,DoubleSystem},
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
            {time:'2018-06-05 17:13:30',content:[
                    {blnExport:false,val:'场所已经离线，连续两天未上传数据，一天未上传心跳'}
                ]
            },
            {time:'2018-06-06 17:13:30',content:[
                    {blnExport:false,val:'场所存在非法刷卡上网行为，连续两天使用6张证件反复刷卡上网,最多一张证件刷卡20次'},
                    {blnExport:false,val:'场所一天内共使用了3次外挂共计6小时'}
                ]
            }
        ],
        blnLoading:false,
        pageIndex:0,
        timeOrder:false,
    }
  },
  watch:{
    data:{
        deep:true,
        handler:function(){
            this.$nextTick(()=>{
                this.$refs.scroll.reloadyScroll();
            });
        }
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
        },500);
        this.column_w=$(this.$el).width()-300 -10;
    },
  }
}
</script>

<style scoped lang="less">
@import "../../css/variables.less";
.IssueList{width:100%;height:100%;padding:5px;}
.IssueList_container{width:100%;height:100%;background-color:white;}

.IssueList .option_bar{text-align:left;padding:5px 15px;line-height:40px;}
.IssueList .option_bar .item{display:inline-block;margin:2px 5px;}

.IssueList .right_option_bar {float:right;}
.IssueList .right_option_bar .item{display:inline-block;margin:2px 5px;}
.IssueList .right_option_bar .item:hover{cursor:pointer;}
html{.TCol(~".IssueList .right_option_bar .item:hover");}

.IssueList .cursor{cursor:pointer;}

.IssueList .page_container{.border('top');}

.IssueList .table_body .item{cursor:pointer;}
html{.TCol(~".IssueList .table_body .item:hover");}

.IssueList .fa-caret-up{position:absolute;top:8px;cursor:pointer;font-size:14px;color:gray;}
.IssueList .fa-caret-down{position:absolute;top:17px;cursor:pointer;font-size:14px;color:gray;}

.IssueList .fa-caret-up.active,
.IssueList .fa-caret-down.active,
.IssueList .fa-caret-up:hover,
.IssueList .fa-caret-down:hover{
    color:white;
}

.IssueList .clickItem:hover{cursor:pointer;text-decoration:underline;}
html{.TCol(~".IssueList .clickItem");}

//列表显示样式
@header_H:40px;
.IssueList .table_header{height:@header_H;display:table;width:100%;border:none;color:white;}
html{.TCol(~".IssueList .table_header .row",'bg');}

.IssueList .table_header .column{display:table-cell;text-align:center;border-right:none;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}
.IssueList .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;.border('bottom');background-color:white;}
.IssueList .table_header .column .sort_item .triangle-up:hover{cursor:pointer;}
html{.TCol(~".IssueList .table_header .column .sort_item .triangle-up:hover",'bbc');}

.IssueList .table_header .column .sort_item .triangle-down:hover{cursor:pointer;}
html{.TCol(~".IssueList .table_header .column .sort_item .triangle-down:hover",'btc');}

html{.TCol(~".IssueList .table_header .column .sort_item .triangle-up.active",'bbc');}

html{.TCol(~".IssueList .table_header .column .sort_item .triangle-down.active",'btc');}

.IssueList .table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";.border('bottom');}
.IssueList .table_body{width:100%;display:table;width:100%;border:none;}
.IssueList .table_body .column{display:table-cell;text-align:center;border-right:none;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}

.overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}
</style>
