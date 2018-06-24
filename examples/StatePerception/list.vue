<!-- 列表页面组件 -->
<template>
    <div class="List">
        <!--操作栏-->
        <div class="option_bar">
            <div class="item">
                <span>站点名称:</span><div style="display:inline-block;"><el-input placeholder="请输入名称"></el-input></div>
            </div>
            <div class="item">
                <span>站点域名:</span><div style="display:inline-block;"><el-input placeholder="请输入域名"></el-input></div>
            </div>
            <div class="item">
                <span>站点类型:</span><div style="display:inline-block;">
                    <el-select style="width:100px;" :clearable="true" placeholder="请选择">
                        <el-option
                            v-for="item in [{name:'合格',val:'1'},{name:'不合格',val:'0'}]"
                            :label="item.name"
                            :value="item.val">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="item">
                <el-button type="primary" ><span>搜索</span></el-button>
            </div>
        </div>
        
        <!--表头-->
        <div class="table_header">
            <div class="row">
                <div class="column"><span class="overflow" :style="{width:column_w/2+'px'}">站点名称</span></div>
                <div class="column"><span class="overflow" :style="{width:column_w/2+'px'}">站点域名</span></div>
                <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">站点IP</span></div>
                <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">站点类别</span></div>
                <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">监控地址</span></div>
                <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">可用性检查</span></div>
                <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">系统漏洞</span></div>
                <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">web漏洞</span></div>
                <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">内容监控</span></div>
                <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">网站木马</span></div>
                <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">弱口令</span></div>
                <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">网站健康值</span></div>
            </div>
        </div>
        <!--内容栏-->
        <div class="table_body" :style="{height:bodyH}" style="position:relative;">
            <!--加载中-->
            <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index: 100;">
                <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
            </div>
            <!--暂无数据-->
            <div class="row" v-if="data.length<=0">暂无数据</div>

            <Scroll :listen="data" ref="scroll">
                <div class="row">
                    <div class="column"><span class="overflow" :style="{width:column_w/2+'px'}">站点名称</span></div>
                    <div class="column"><span class="overflow" :style="{width:column_w/2+'px'}">站点域名</span></div>
                    <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">站点IP</span></div>
                    <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">站点类别</span></div>
                    <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">监控地址</span></div>
                    <div class="column" style="width:100px;"><span class="wordBreak" style="width:100px;">
                        <div class="simpleRow green">H:155ms</div>
                        <div class="simpleRow green">D:155ms</div>
                        <div class="simpleRow dullRed">P:15599999ms</div>
                        </span>
                    </div>
                    <div class="column" @click.stop="popPage(1)" style="width:100px;cursor:pointer;"><span class="wordBreak" style="width:100px;">
                        <div class="halfRow green">严:2</div>
                        <div class="halfRow brightRed">高:5</div>
                        <div class="halfRow orange">中:3</div>
                        <div class="halfRow blue">低:10</div>
                        <div class="halfRow shallowBlue">告:10</div>
                    </span></div>
                    <div class="column" @click.stop="popPage(2)" style="width:100px;cursor:pointer;"><span class="wordBreak" style="width:100px;">
                        <div class="halfRow green">高:2</div>
                        <div class="halfRow brightRed">中:5</div>
                        <div class="halfRow orange">低:3</div>
                        <div class="halfRow blue">高:10</div>
                    </span>
                    </div>
                    <div class="column" @click.stop="popPage(3)" style="width:100px;cursor:pointer;"><span class="wordBreak" style="width:100px;">
                        <div class="simpleRow green">页面变更:5</div>
                        <div class="simpleRow green">恶意链接:6</div>
                        <div class="simpleRow dullRed">敏感词:5</div>
                    </span></div>
                    <div class="column" @click.stop="popPage(4)" style="width:100px;cursor:pointer;"><span class="wordBreak" style="width:100px;text-align: center;">
                        <div class="simpleCol green">30</div>
                    </span></div>
                    <div class="column" style="width:100px;"><span class="wordBreak" style="width:100px;text-align: center;">
                        <div class="simpleCol green">20</div>
                    </span></div>
                    <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">67</span></div>
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

        <!--弹窗栏-->
        <div class="pop" :style="{top:showPop?'0px':'110%'}">
            <div class="title" @click="showPop=false"><span class="name">{{popName}}</span></div>
            <div class="content">
                <SystemBug v-if="showPageKind==1" />

                <WebBug v-if="showPageKind==2" />

                <contentMonitoring v-if="showPageKind==3" />

                <WebHorse v-if="showPageKind==4" />
            </div>
        </div>
    </div>
</template>

<script>
import Scroll from  'components/scroll'

import ContentMonitoring from './contentMonitoring'
import WebHorse from './webHorse'
import SystemBug from './SystemBug'
import WebBug from './WebBug'

import {BODY_RESIZE} from '../../store/mutation-types'
export default {
  name: 'List',
  components:{Scroll,ContentMonitoring,WebHorse,SystemBug,WebBug},
  data () {
    return {
      data:[1],
      column_w:0,
      blnLoading:false,
      bodyH:0,
      pageIndex:0,
      bodyResizeSub:null,
      popName:'',
      showPop:false,
      showPageKind:0,//1:系统漏洞,2:web漏洞,3:内容监控,4:网站木马
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
        this.column_w=$(this.$el).width()-1100;
    },
    pageChange(i){

    },
    //内容监控
    popPage(type){
        let pages=['','系统漏洞','web漏洞','内容监控','网站木马'];
        this.showPop=true;
        this.showPageKind=type;
        this.popName=pages[type];
    }
  },
}
</script>

<style scoped lang="less">
  @import "../../css/variables.less";
    .List{width:100%;height:100%;position:relative;}
    .List .option_bar{text-align:left;padding:5px 15px;}
    .List .option_bar .item{display:inline-block;margin:2px 5px;}

    .List .table_body .row .bold{font-weight:bold;color:#03ab67;}
    .List .table_body .row .bold:hover{text-decoration:underline;cursor:pointer;}
    //列表显示样式
    @header_H:40px;
    .List .table_header{height:@header_H;display:table;width:100%;border:none;color:white;}
    html{.TCol(~".List .table_header .row",'bg');}

    .List .table_header .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}
    .List .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;.border('bottom');background-color:white;}
    .List .table_header .column .sort_item .triangle-up:hover{cursor:pointer;}
    html{.TCol(~".List .table_header .column .sort_item .triangle-up:hover",'bbc');}

    .List .table_header .column .sort_item .triangle-down:hover{cursor:pointer;}
    html{.TCol(~".List .table_header .column .sort_item .triangle-down:hover",'btc');}

    //.HighRisk .table_header .column .sort_item .triangle-up.active{border-bottom-color:@Font_Hover_Col;}
    html{.TCol(~".List .table_header .column .sort_item .triangle-up.active",'bbc');}

    //.HighRisk .table_header .column .sort_item .triangle-down.active{border-top-color:@Font_Hover_Col;}

    html{.TCol(~".List .table_header .column .sort_item .triangle-down.active",'btc');}

    .List .table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";.border('bottom');}
    .List .table_body{width:100%;display:table;width:100%;border:none;}
    .List .table_body .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}

    .overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}

    .List .wordBreak{
        display: block;
        word-break: break-all;
        line-height:23px;
        white-space: normal;
        text-align:left;
    }

    .List .simpleRow{text-align:center;font-size:12px;border-radius:5px;color:white;margin:5px;margin-top:0px;}
    .List .halfRow{width:40%;float:left;color:white;text-align:center;margin:5px;font-size:12px;border-radius:5px;}
    .List .simpleCol{padding:2px 10px;font-size:12px;border-radius:5px;color:white;display:inline-block;line-height:20px;}
    
    .List .green{background:#03ab67;}
    .List .dullRed{background:#bb2431;}
    .List .brightRed{background:#ed4e2a;}
    .List .orange{background:#ffa500;}
    .List .blue{background:#428bca;}
    .List .shallowBlue{background:#57b5e3;}


    .List .page_container{.border('top');}

    //弹窗样式
    .pop{
        width:100%;height:100%;position:absolute;top:0px;left:0px;background-color:white;.trans();
    }

    .pop .title{width:100%;height:40px;line-height:40px;color:white;font-size:16px;background:gray;}
    html{.TCol(~".pop .title:hover",'bg');}
    .pop .title:hover{cursor:pointer;}
    .pop .title .name:after{
        content:'\F106';
        font:normal normal normal 14px/1 FontAwesome;
        font-size:40px;
        font-weight:600;
        position:absolute;
        margin-left:10px;
    }


    .pop .content{width:100%;height:~'calc(100% - 40px)';}
</style>
