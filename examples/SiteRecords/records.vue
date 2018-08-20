<!-- 网站备案页面组件 -->
<template>
    <div class="Records">
        <!--操作栏-->
        <div class="option_bar">
            <div class="item">
                <span>站点域名:</span><div style="display:inline-block;"><el-input placeholder="请输入" v-model="domain"></el-input></div>
            </div>
            <div class="item">
                <span>站点名称:</span><div style="display:inline-block;"><el-input placeholder="请输入" v-model="webname"></el-input></div>
            </div>
            <div class="item">
                <el-button type="primary" @click="search()"><span>搜索</span></el-button>
            </div>

            <div style="float:right;">
              <div class="exportSel" style="font-size:14px;display:inline-block;" :class="{active:blnExport}" @click="blnExport=!blnExport"><i class="fa fa-check-square" style="margin-right:5px;" />选择</div>
            </div>
        </div>
        <!--列表头-->
        <div class="table_header">
            <div class="row">
                <div class="column cursor" @click="selAll()" v-if="blnExport" style="width:50px;"><span class="overflow" style="width:50px;"><i :class="{'fa fa-check-square-o':blnAllSel,'fa fa-square-o':!blnAllSel}"></i></span></div>
                <div class="column"><span class="overflow" :style="{width:column_w/3+'px'}">站点名称</span></div>
                <div class="column"><span class="overflow" :style="{width:column_w/3+'px'}">站点域名</span></div>
                <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">服务类型</span></div>
                <div class="column" style="width:200px;"><span class="overflow" style="width:200px;">域名服务商</span></div>
                <div class="column" style="width:200px;"><span class="overflow" style="width:200px;">接入服务商</span></div>
                <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">备案号</span></div>
                <div class="column"><span class="overflow" :style="{width:column_w/3+'px'}">办公地址</span></div>
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
                        <div class="column bold" :title="d.website_name" @click="detail(d)"><span class="overflow" :style="{width:column_w/3+'px'}">{{d.website_name}}</span></div>
                        <div class="column bold" :title="d.website_domain" @click="openPage(d.website_domain)"><span class="overflow" :style="{width:column_w/3+'px'}">{{d.website_domain}}</span></div>
                        <div class="column" :title="d.website_servicetype" style="width:150px;"><span class="overflow" style="width:150px;">{{d.website_servicetype}}</span></div>
                        <div class="column" :title="d.website_dns_provider" style="width:200px;"><span class="overflow" style="width:200px;">{{d.website_dns_provider}}</span></div>
                        <div class="column" :title="d.website_iap" style="width:200px;"><span class="overflow" style="width:200px;">{{d.website_iap}}</span></div>
                        <div class="column" :title="d.website_record_number" style="width:150px;"><span class="overflow" style="width:150px;">{{d.website_record_number}}</span></div>
                        <div class="column" :title="d.website_company_addr"><span class="overflow" :style="{width:column_w/3+'px'}">{{d.website_company_addr}}</span></div>
                    </div>
                <div>
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

import {BODY_RESIZE,WebSiteRecordList,ExportSiteRecordList,WebSiteRecordDetail} from '../../store/mutation-types'
export default {
  name: 'Records',
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
            if(_.findIndex(this.selIds,id=>id==s.data[i].website_scan_url)<0){
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
      this.data=[];
      this.getList(this.pageIndex);
    },
    //打开新页面
    openPage(url){
        if(!url) return;
        window.open('http://'+url);
    },
    search(){
        this.pageIndex=0;
        this.getList(0);
    },
    getList(index){
        index=index<0?0:index;
       
        this.blnLoading=true;
        this.$store.dispatch(WebSiteRecordList,{
            domain:this.domain,
            webname:this.webname,
            skip:index*10,
            limit:15
        }).then(res=>{
            this.blnLoading=false;
            if(!tool.msg(res,'','获取列表信息失败!')) return;
            if(res.biz_body.length<=0 && index>0){tool.info('已经到了最后页!');return;}
            
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
        this.column_w=$(this.$el).width()-(this.blnExport?750:700);
    },
    pageChange(i){
        this.getList(i);
    },
    //备案详细
    detail(d){
        let s=this;
        tool.open(function(){
            let colW='100px';
            let html=`<div style="font-weight:600;">网站主体 :</div>
                      <div style="width:100%;padding-left:20px;">

                        <div class="row" style="margin-bottom:10px;">
                            <div class="col-md-7">
                                <div style="float:left;width:${colW};text-align:right;padding-right:5px;">网站名称:</div> 
                                <div style="margin-left:${colW};word-break: break-all;word-break: break-all;">{{d.website_name || ''}}</div>
                            </div>
                            <div class="col-md-5">备案号: {{d.website_record_number || ''}}</div>
                        </div>

                        <div class="row" style="margin-bottom:10px;">
                            <div class="col-md-12">
                                <div style="float:left;width:${colW};text-align:right;padding-right:5px;">服务类型:</div> 
                                <div style="margin-left:${colW};word-break: break-all;word-break: break-all;">{{d.website_servicetype || ''}}</div>
                            </div>
                        </div>

                        <div class="row" style="margin-bottom:10px;">
                            <div class="col-md-12">
                                <div style="float:left;width:${colW};text-align:right;padding-right:5px;">网站域名:</div> 
                                <div style="margin-left:${colW};word-break: break-all;word-break: break-all;">{{d.website_domain || ''}}</div>
                            </div>
                        </div>

                        <div class="row" style="margin-bottom:10px;">
                            <div class="col-md-12">
                                <div style="float:left;width:${colW};text-align:right;padding-right:5px;">办公地址:</div> 
                                <div style="margin-left:${colW};word-break: break-all;word-break: break-all;">{{d.website_company_addr || ''}}</div>
                            </div>
                        </div>

                        <div class="row" style="margin-bottom:10px;">
                            <div class="col-md-12">
                                <div style="float:left;width:${colW};text-align:right;padding-right:5px;">所属公安机关:</div> 
                                <div style="margin-left:${colW};word-break: break-all;word-break: break-all;">{{d.website_record_office || ''}}</div>
                            </div>
                        </div>

                      </div>

                      <div style="font-weight:600;">服务商信息 :</div>
                      <div style="width:100%;padding-left:20px;">

                        <div class="row" style="margin-bottom:10px;">
                            <div class="col-md-12">
                                <div style="float:left;width:${colW};text-align:right;padding-right:5px;">域名服务商:</div> 
                                <div style="margin-left:${colW};word-break: break-all;word-break: break-all;">{{d.website_dns_provider || ''}}</div>
                            </div>
                        </div>

                        <div class="row" style="margin-bottom:10px;">
                            <div class="col-md-12">
                                <div style="float:left;width:${colW};text-align:right;padding-right:5px;">接入服务商:</div> 
                                <div style="margin-left:${colW};word-break: break-all;word-break: break-all;">{{d.website_iap || ''}}</div>
                            </div>
                        </div>
                      </div>

                      <div style="font-weight:600;">负责人信息 :</div>
                      <div style="width:100%;padding-left:20px;">

                        <div class="row" style="margin-bottom:10px;">
                            <div class="col-md-7">
                                <div style="float:left;width:${colW};text-align:right;padding-right:5px;">主体负责人:</div> 
                                <div style="margin-left:${colW};word-break: break-all;word-break: break-all;">{{d.main_responsibility || ''}}</div>
                            </div>
                            <div class="col-md-5">联系电话:{{d.main_tel || ''}}</div>
                        </div>

                        <div class="row" style="margin-bottom:10px;">
                            <div class="col-md-7">
                                <div style="float:left;width:${colW};text-align:right;padding-right:5px;">网站负责人:</div> 
                                <div style="margin-left:${colW};word-break: break-all;word-break: break-all;">{{d.website_responsibility || ''}}</div>
                            </div>
                            <div class="col-md-5">联系电话: {{d.website_tel || ''}}</div>
                        </div>
                      </div>

                    <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index: 100;">
                        <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
                    </div>
                     `;
            let param={
                title:'备案网站详情',
                area:'600px',
                content:`<div class="siteRecords_addPop" style="padding:10px;position:relative;">${html}</div>`,
                context:{
                    d:{},
                    blnLoading:false,
                },
                success(){
                    param.selfData.blnLoading=true;
                    s.$store.dispatch(WebSiteRecordDetail,d.id).then(res=>{
                        param.selfData.blnLoading=false;
                        if(!tool.msg(res,'','获取详细信息失败!')) return;
                        param.selfData.d=res.biz_body;

                    });
                }
            };

            return param;
        }());
    },
    //全选/取消全选
    selAll(){
        let s=this;
        if(s.blnAllSel){
            for(let i=0;i<s.data.length;i++){
                let index=_.findIndex(s.selIds,id=>id==s.data[i].website_scan_url);
                if(index<0) continue;
                s.selIds.splice(index,1);
            }
        }else{
            for(let i=0;i<s.data.length;i++){
                let index=_.findIndex(s.selIds,id=>id==s.data[i].website_scan_url);
                if(index>=0) continue;
                s.selIds.push(s.data[i].website_scan_url);
            }
        }
    },
    //单选
    selItem(d){
        let index=_.findIndex(this.selIds,id=>id==d.website_scan_url);
        if(index>=0){
            this.selIds.splice(index,1);
        }else{
            this.selIds.push(d.website_scan_url);
        }
    },
    blnSelItem(d){
        return _.findIndex(this.selIds,id=>id==d.website_scan_url)>=0;
    },
    exportList(){
        if(this.exportDataing) return;
        this.exportDataing=true;
        
            
        this.$store.dispatch(ExportSiteRecordList,{
            domain:this.domain,
            webname:this.webname,
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
    .Records{width:100%;height:100%;}

    .Records .option_bar{text-align:left;padding:5px 15px;}
    .Records .option_bar .item{display:inline-block;margin:2px 5px;}

    .Records .table_body .row .bold{font-weight:bold;}
     html{.TCol(~".Records .table_body .row .bold");}
    .Records .table_body .row .bold:hover{text-decoration:underline;cursor:pointer;}
    //列表显示样式
    @header_H:40px;
    .Records .table_header{height:@header_H;display:table;width:100%;border:none;color:white;}
    html{.TCol(~".Records .table_header .row",'bg');}

    .Records .table_header .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}
    .Records .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;.border('bottom');background-color:white;}
    .Records .table_header .column .sort_item .triangle-up:hover{cursor:pointer;}
    html{.TCol(~".Records .table_header .column .sort_item .triangle-up:hover",'bbc');}

    .Records .table_header .column .sort_item .triangle-down:hover{cursor:pointer;}
    html{.TCol(~".Records .table_header .column .sort_item .triangle-down:hover",'btc');}

    html{.TCol(~".Records .table_header .column .sort_item .triangle-up.active",'bbc');}

    html{.TCol(~".Records .table_header .column .sort_item .triangle-down.active",'btc');}

    .Records .table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";.border('bottom');}
    .Records .table_body{width:100%;display:table;width:100%;border:none;}
    .Records .table_body .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}

    .overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}

    .Records  .exportSel{cursor:pointer;}
    html{.TCol(~".Records .exportSel:hover");}
    html{.TCol(~".Records .exportSel.active");}
    html{.TCol(~".Records .exportBtn:hover");}
    .Records .cursor{cursor:pointer;}
</style>
