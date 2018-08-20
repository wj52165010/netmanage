<!-- 网站未备案页面组件 -->
<template>
    <div class="UnRecords">
        <!--操作栏-->
        <div class="option_bar clearfix">
            <div class="item">
                <span>站点URL:</span><div style="display:inline-block;"><el-input placeholder="请输入" v-model="domain"></el-input></div>
            </div>
            <div class="item">
                <span>站点名称:</span><div style="display:inline-block;"><el-input placeholder="请输入" v-model="webname"></el-input></div>
            </div>
            <div class="item">
                <span>IP地址:</span><div style="display:inline-block;"><el-input placeholder="请输入" v-model="ip"></el-input></div>
            </div>
            <div class="item">
                 <span>是否整改:</span><div style="display:inline-block;">
                    <el-select style="width:100px;" v-model="isrecord" :clearable="true" placeholder="请选择">
                        <el-option
                            v-for="item in [{name:'全部',val:'3'},{name:'是',val:'1'},{name:'否',val:'0'}]"
                            :label="item.name"
                            :value="item.val">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="item">
                <el-button type="primary" @click="search()"><span>搜索</span></el-button>
            </div>

            <div style="float:right;font-size:20px;margin-top:10px;cursor:pointer;">
              <div class="exportSel" style="font-size:14px;display:inline-block;" :class="{active:blnExport}" @click="blnExport=!blnExport"><i class="fa fa-check-square" style="margin-right:5px;" />选择</div>
              <el-tooltip effect="light" content="扫描IP配置" placement="top">
                <i class="fa fa-cog fa-fw" @click="ipSetting()"></i>
              </el-tooltip>

            </div>
        </div>
        <!--列表头-->
        <div class="table_header">
            <div class="row">
                <div class="column cursor" @click="selAll()" v-if="blnExport" style="width:50px;"><span class="overflow" style="width:50px;"><i :class="{'fa fa-check-square-o':blnAllSel,'fa fa-square-o':!blnAllSel}"></i></span></div>
                <div class="column"><span class="overflow" :style="{width:column_w/3+'px'}">站点名称</span></div>
                <div class="column"><span class="overflow" :style="{width:column_w/3+'px'}">站点域名</span></div>
                <div class="column"><span class="overflow" :style="{width:column_w/3+'px'}">站点url</span></div>
                <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">IP地址</span></div>
                <div class="column" style="width:200px;"><span class="overflow" style="width:200px;">首次发现时间</span></div>
                <div class="column" style="width:200px;"><span class="overflow" style="width:200px;">最近发现时间</span></div>
                <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">是否整改</span></div>
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
                        <div class="column cursor" @click="selItem(d)" v-if="blnExport"  style="width:50px;" ><span class="overflow" style="width:50px;"><i :class="{'fa fa-check-square-o':blnSelItem(d),'fa fa-square-o':!blnSelItem(d)}"></i></span></div>
                        <div class="column" :title="d.website_title"><span class="overflow" :style="{width:column_w/3+'px'}">{{d.website_title}}</span></div>
                        <div class="column bold" @click="d.website_domain && openPage(d.website_response_url)" :title="d.website_domain"><span class="overflow" :style="{width:column_w/3+'px'}">{{d.website_domain}}</span></div>
                        <div class="column bold" @click="openPage(d.website_response_url)" :title="d.website_response_url"><span class="overflow" :style="{width:column_w/3+'px'}">{{d.website_response_url}}</span></div>
                        <div class="column" :title="d.ip" style="width:150px;"><span class="overflow" style="width:150px;">{{d.ip}}</span></div>
                        <div class="column" :title="converTime(d.scan_firsttime)" style="width:200px;"><span class="overflow" style="width:200px;">{{converTime(d.scan_firsttime)}}</span></div>
                        <div class="column" :title="converTime(d.logtime)" style="width:200px;"><span class="overflow" style="width:200px;">{{converTime(d.logtime)}}</span></div>
                        <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">{{d.isrecord=='1'?'是':'否'}}</span></div>
                    </div>
                </div>
            </Scroll>
        </div>
        <!--分页栏-->
        <div name="page_container" class="page_container" style="background-color:white;">
          <span class="exportBtn" v-if="blnExport" @click="exportList()" style="float:left;margin-top:10px;margin-left:15px;font-size:12px;cursor:pointer;"><i class="fa fa-upload" /> 导出 <i v-if="exportDataing" class="fa fa-spinner fa-pulse" /></span>
          <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageIndex+1}}</span></span>
          <div class="firstPage" @click="pageChange(0)">首页</div>
          <div class="prePage" @click="pageChange(pageIndex-1)">上一页</div>
          <div class="nextPage" @click="pageChange(pageIndex+1)">下一页</div>          
        </div>
    </div>
</template>

<script>
import Scroll from  'components/scroll'
import IPsetting from './ipSetting'

import {BODY_RESIZE,WebSiteList,ExportWebSiteList} from '../../store/mutation-types'
export default {
  name: 'UnRecords',
  components:{Scroll},
  data () {
    return {
      blnLoading:false,
      bodyH:0,
      column_w:0,
      bodyResizeSub:null,
      pageIndex:0,
      data:[],
      domain:'',
      webname:'',
      ip:'',
      isrecord:'3',
      listBodyH:0,
      blnExport:false,//是否进入导出选择阶段,
      selIds:[],//选中项的IDS
      exportDataing:false,
    }
  },
  watch:{
    blnExport(){
        this.selIds=[];
        this.layout();
    } 
  },
  computed:{
    blnAllSel(){
        let s=this,res=true;
        for(let i=0;i<s.data.length;i++){
            if(_.findIndex(this.selIds,id=>id==s.data[i].id)<0){
                res=false;break;
            }
        }
        return res;
    }
  },
  mounted(){
   this.layout();
   this.getList(this.pageIndex);

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
    //刷新页面
    refreshPage(){
      this.pageIndex=0;
      this.domain='';
      this.webname='';
      this.ip='';
      this.isrecord='3';
      this.data=[];
      this.getList(this.pageIndex);
    },
    //扫描IP配置
    ipSetting(){
        let s=this;
        tool.open(function(s){
            let html=`<IPsetting />`;
            let param={
                title:'扫描IP配置',
                area:['800px','600px'],
                content:`<div class="IPSetting_pop" style="width:100%;height:100%;">${html}</div>`,
                components:{IPsetting},
                store:s.$store,
                context:{

                }
            };

            return param;
        }(s));
    },
    //打开页面
    openPage(url){
        if(!url) return;
        window.open(url);
    },
    //搜索
    search(){
        this.pageIndex=0;
        this.getList(0);
    },
    //获取列表数据
    getList(index){
        index=index<0?0:index;
        this.blnLoading=true;
        this.$store.dispatch(WebSiteList,{
            domain:this.domain,
            webname:this.webname,
            ip:this.ip,
            isrecord:this.isrecord=='3'?'':this.isrecord,
            skip:index*10,
            limit:15
        }).then(res=>{
            this.blnLoading=false;
            if(!tool.msg(res,'','获取列表信息失败!')) return;
            if(res.biz_body.length<=0 && index>0){tool.info('已经到了最后页!');return;}
            console.log(tool.Clone(res.biz_body));
            this.pageIndex=index;
            this.data=res.biz_body;
        })
    },
    layout(){
        setTimeout(()=>{
            this.bodyH=`calc(100% - 50px - 40px - ${$(this.$el).find('.option_bar').height()}px)`;

            this.$nextTick(()=>{
               this.$refs.scroll.reloadyScroll()
            })
        },100);
        this.column_w=$(this.$el).width()-(this.blnExport?700:650);
    },
    pageChange(i){
        this.getList(i);
    },
    //时间戳转日期
    converTime(t,format){
        return tool.DateByTimestamp(t,format || 'yyyy-MM-dd hh:mm:ss');
    },
    //全选/取消全选
    selAll(){
        let s=this;
        if(s.blnAllSel){
            for(let i=0;i<s.data.length;i++){
                let index=_.findIndex(s.selIds,id=>id==s.data[i].id);
                if(index<0) continue;
                s.selIds.splice(index,1);
            }
        }else{
            for(let i=0;i<s.data.length;i++){
                let index=_.findIndex(s.selIds,id=>id==s.data[i].id);
                if(index>=0) continue;
                s.selIds.push(s.data[i].id);
            }
        }
    },
    //单选
    selItem(d){
        let index=_.findIndex(this.selIds,id=>id==d.id);
        if(index>=0){
            this.selIds.splice(index,1);
        }else{
            this.selIds.push(d.id);
        }
    },
    blnSelItem(d){
        return _.findIndex(this.selIds,id=>id==d.id)>=0;
    },
    exportList(){

        if(this.exportDataing) return;
        this.exportDataing=true;
        
            
        this.$store.dispatch(ExportWebSiteList,{
            domain:this.domain,
            webname:this.webname,
            ip:this.ip,
            isrecord:this.isrecord=='3'?'':this.isrecord,
            ids:this.selIds.join(',')
        }).then(res=>{
            this.exportDataing=false;
            if(!tool.msg(res,'导出成功!','导出失败!'))  return;

            window.location = res.biz_body.url;
        });
    }
  }
}
</script>

<style scoped lang="less">
    @import "../../css/variables.less";
    .UnRecords{width:100%;height:100%;}
    .UnRecords .option_bar{text-align:left;padding:5px 15px;}
    .UnRecords .option_bar .item{display:inline-block;margin:2px 5px;}

    .UnRecords .table_body .row .bold{font-weight:bold;color:#03ab67;}
    .UnRecords .table_body .row .bold:hover{text-decoration:underline;cursor:pointer;}
    //列表显示样式
    @header_H:40px;
    .UnRecords .table_header{height:@header_H;display:table;width:100%;border:none;color:white;}
    html{.TCol(~".UnRecords .table_header .row",'bg');}

    .UnRecords .table_header .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}
    .UnRecords .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;.border('bottom');background-color:white;}
    .UnRecords .table_header .column .sort_item .triangle-up:hover{cursor:pointer;}
    html{.TCol(~".UnRecords .table_header .column .sort_item .triangle-up:hover",'bbc');}

    .UnRecords .table_header .column .sort_item .triangle-down:hover{cursor:pointer;}
    html{.TCol(~".UnRecords .table_header .column .sort_item .triangle-down:hover",'btc');}

    html{.TCol(~".UnRecords .table_header .column .sort_item .triangle-up.active",'bbc');}

    html{.TCol(~".UnRecords .table_header .column .sort_item .triangle-down.active",'btc');}

    .UnRecords .table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";.border('bottom');}
    .UnRecords .table_body{width:100%;display:table;width:100%;border:none;}
    .UnRecords .table_body .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}

    .overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}

    .UnRecords  .exportSel{cursor:pointer;}
    html{.TCol(~".UnRecords .exportSel:hover");}
    html{.TCol(~".UnRecords .exportSel.active");}
    html{.TCol(~".UnRecords .exportBtn:hover");}
    .UnRecords .cursor{cursor:pointer;}
</style>
