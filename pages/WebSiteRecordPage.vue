<!-- 网站备案定制页面组件 created by Chuanjiang Li 2018/04/19-->
<template>
    <div class="areapage">
        <div class="CaseManage_container">
            <!--加载中标识-->
            <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;">
                <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;"><i class="fa fa-spinner fa-pulse"></i></div></div>
            </div>
            <!-- 标签切换 -->
            <div style="height:30px" name="tagcomp">
              <div class="tagComp" style="text-align:left">
                <div class="item" @click="switchView('list')" :class="{active: viewTable=='list'}">
                    <div class="item_container">
                        <span class="content"><i class="fa fa-list"></i>未备案网站</span>
                    </div>
                </div>
                <div class="item" @click="switchView('changeList')" :class="{active: viewTable=='changeList'}">
                    <div class="item_container">
                        <span class="content"><i class="fa fa-map-marker"></i>备案变更</span>
                    </div>
                </div>
               </div>
            </div>
            <!--未备案网站显示区域-->
            <div v-show="viewTable=='list'" style="height: calc(100% - 50px - -63px - 40px);position:relative">
                <div class="option">
                    <div class="item">
                        <span>网站域名:</span>
                        <div class="input">
                            <el-input placeholder="网站域名" v-model="query.domain"></el-input>
                        </div>
                    </div>
                    <div class="item">
                        <span>网站名称:</span>
                        <div class="input">
                            <el-input placeholder="网站名称" v-model="query.webname"></el-input>
                        </div>
                    </div>
                    <div class="item">
                        <span>IP地址:</span>
                        <div class="input">
                            <el-input placeholder="IP地址" v-model="query.server_ip"></el-input>
                        </div>
                    </div>
                    <div class="item" >
                        <el-button type="primary" @click="query_click()"><i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i><span v-show="!blnSearch">搜索</span></el-button>
                    </div>

                </div>
                <ul class="header">
                    <li class="item">
                        <div><span class="overflow" style="width:165px;">网站域名</span></div>
                        <div><span class="overflow" style="width:100px;">网站名称</span></div>
                        <div><span class="overflow" style="width:100px;">服务器IP</span></div>
                        <div><span class="overflow" style="width:70px;">网站负责人</span></div>
                        <div><span class="overflow" style="width:120px;">负责人电话</span></div>
                        <div><span class="overflow" style="width:90px;">接入服务商</span></div>
                        <div><span class="overflow" style="width:100px;">服务商电话</span></div>
                        <div><span class="overflow" style="width:165px;">服务商地址</span></div>
                        <!-- <div><span class="overflow" style="width:90px;">设备采集量</span></div>
                        <div><span class="overflow" style="width:90px;">设备贡献率</span></div> -->
                        <!-- <div><span class="overflow" style="width:90px;">区域操作员</span></div> -->
                        <!-- <div><span class="overflow" style="width:80px;">所属厂商</span></div> -->
                        <div><span class="overflow" style="width:100px;">操作</span></div>
                    </li>
                </ul>
                <div class="content">
                    <Scroll :listen="data">
                        <ul class="body">
                            <li class="item" style="text-align:center;display: table-caption;" v-if="showData.length<=0&&!blnLoading">暂无数据</li>
                            <li v-for="(d,i) in showData" class="item" >
                                <div  :title="d.domain" ><span class="overflow" style="width:165px;">{{d.domain}}</span></div>
                                <div class="align" :title="d.webname" ><span class="overflow" style="width:100px;">{{d.webname}}</span></div>
                                <div ><span class="overflow" style="width:100px;">{{d.server_ip}}</span></div>
                                <div  :title="d.web_head"><span class="overflow" style="width:70px;">{{d.web_head}}</span></div>
                                <div :title="d.web_head_tel"><span class="overflow " style="width:120px;">{{d.web_head_tel}}</span></div>
                                <div  :title="d.service_prod_name"><span class="overflow" style="width:90px;">{{d.service_prod_name}}</span></div>
                                <div ><span class="overflow" style="width:100px;">{{d.service_prod_tel}}</span></div>
                                <div  :title="d.service_prod_addr"><span class="overflow" style="width:165px;">{{d.service_prod_addr}}</span></div>
                                <!-- <div  :title="d.equip_detect_num"><span class="overflow" style="width:90px;">{{d.equip_detect_num}}</span></div>
                                <div  :title="d.equip_contribution"><span class="overflow" style="width:90px;">{{d.equip_contribution}}</span></div> -->
                                <!-- <div  :title="d.microprobe_type"><span class="overflow" style="width:90px;">{{d.microprobe_type}}</span></div> -->
                                <!-- <div class="align" :title="d.security_software_orgname"><span class="overflow" style="width:80px;">{{d.security_software_orgname}}</span></div> -->
                                <div><span class="overflow" style="width:100px" @click="searchDetail(d.domain)">
                                   <span class="overflow sit-click" style="width:50px" >详细</span>
                                </div> 
                            </li>
                        </ul>
                    </Scroll>
                </div>
                <div class="page_container">
                    <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageNum+1}}</span></span>
                    <div class="firstPage" @click="pageChange(0)">首页</div>
                    <div class="prePage" @click="pageChange(pageNum-1)">上一页</div>
                    <div class="nextPage" @click="pageChange(pageNum+1)">下一页</div>
                </div>
            </div>


            <!--备案变更网站显示区域-->
            <div v-show="viewTable=='changeList'" style="height: calc(100% - 50px - -63px - 40px);position:relative">
                <div class="option">
                    <div class="item">
                        <span>网站域名:</span>
                        <div class="input">
                            <el-input placeholder="网站域名" v-model="queryChange.domain"></el-input>
                        </div>
                    </div>
                    <div class="item">
                        <span>网站名称:</span>
                        <div class="input">
                            <el-input placeholder="网站名称" v-model="queryChange.webname"></el-input>
                        </div>
                    </div>
                    <div class="item">
                        <span>IP地址:</span>
                        <div class="input">
                            <el-input placeholder="IP地址" v-model="queryChange.server_ip"></el-input>
                        </div>
                    </div>
                    <div class="item" >
                        <el-button type="primary" @click="queryChange_click()"><i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i><span v-show="!blnSearch">搜索</span></el-button>
                    </div>

                </div>
                <ul class="header">
                    <li class="item">
                        <div><span class="overflow" style="width:165px;">网站域名</span></div>
                        <div><span class="overflow" style="width:100px;">网站名称</span></div>
                        <div><span class="overflow" style="width:130px;">备案前服务器IP</span></div>
                        <div><span class="overflow" style="width:130px;">备案前接入服务商</span></div>
                        <div><span class="overflow" style="width:120px;">变更后服务器IP</span></div>
                        <div><span class="overflow" style="width:90px;">接入服务商</span></div>
                        <div><span class="overflow" style="width:80px;">服务商电话</span></div>
                        <div><span class="overflow" style="width:100px;">服务商地址</span></div>
                        <!-- <div><span class="overflow" style="width:90px;">设备采集量</span></div>
                        <div><span class="overflow" style="width:90px;">设备贡献率</span></div> -->
                        <!-- <div><span class="overflow" style="width:90px;">区域操作员</span></div> -->
                        <!-- <div><span class="overflow" style="width:80px;">所属厂商</span></div> -->
                        <div><span class="overflow" style="width:100px;">操作</span></div>
                    </li>
                </ul>
                <div class="content">
                    <Scroll :listen="data">
                        <ul class="body">
                            <li class="item" style="text-align:center;display: table-caption;" v-if="showDataChange.length<=0&&!blnLoading">暂无数据</li>
                            <li v-for="(d,i) in showDataChange" class="item" >
                                <div  :title="d.domain" ><span class="overflow" style="width:165px;">{{d.domain}}</span></div>
                                <div class="align" :title="d.webname" ><span class="overflow" style="width:100px;">{{d.webname}}</span></div>
                                <div ><span class="overflow" style="width:130px;">{{d.before_server_ip}}</span></div>
                                <div  :title="d.before_service_prod_name"><span class="overflow" style="width:130px;">{{d.before_service_prod_name}}</span></div>
                                <div :title="d.after_server_ip"><span class="overflow " style="width:120px;">{{d.after_server_ip}}</span></div>
                                <div  :title="d.after_service_prod_name"><span class="overflow" style="width:90px;">{{d.after_service_prod_name}}</span></div>
                                <div ><span class="overflow" style="width:80px;">{{d.service_prod_tel}}</span></div>
                                <div  :title="d.service_prod_addr"><span class="overflow" style="width:100px;">{{d.service_prod_addr}}</span></div>
                                <!-- <div  :title="d.equip_detect_num"><span class="overflow" style="width:90px;">{{d.equip_detect_num}}</span></div>
                                <div  :title="d.equip_contribution"><span class="overflow" style="width:90px;">{{d.equip_contribution}}</span></div> -->
                                <!-- <div  :title="d.microprobe_type"><span class="overflow" style="width:90px;">{{d.microprobe_type}}</span></div> -->
                                <!-- <div class="align" :title="d.security_software_orgname"><span class="overflow" style="width:80px;">{{d.security_software_orgname}}</span></div> -->
                                <div><span class="overflow" style="width:100px" @click="searchDetailChange(d.domain)">
                                   <span class="overflow sit-click" style="width:50px" >详情</span>
                                </div>
                            </li>
                        </ul>
                    </Scroll>
                </div>
                <div class="page_container">
                    <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageNum+1}}</span></span>
                    <div class="firstPage" @click="pageChangeChange(0)">首页</div>
                    <div class="prePage" @click="pageChangeChange(pageNum-1)">上一页</div>
                    <div class="nextPage" @click="pageChangeChange(pageNum+1)">下一页</div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import Scroll from 'components/scroll'
import cInput from 'components/Input'
import PlaceSearch from 'components/PlaceSearch'
import cSelect from 'components/Select'

// 引入提示框和标题组件
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/dataZoom'


import TaskType from '../enum/TaskType'
import RelativeAnlay from '../modules/case/anlay'
import AddPop from '../modules/case/addPop'
import {BODY_RESIZE,GetSiteList,SiteDetail,GetRegionList,GetWebList,GetWebChangeList,GetWebDetail,GetWebChangeDetail} from '../store/mutation-types'
export default {
  name: 'WebSiteRecordPage',
  components:{
      Scroll,
      PlaceSearch,
      cSelect,
    },
  data () {
    return {
        blnLoading:true,                //加载中标识
        pageNum:0,                      //当前页号（0开始计数）
        taskType:TaskType,
        viewTable:'list',
        blnShowStatus:false,
        bodyClickId:-1,
        blnSearch:false,
        query:{                        //未备案网站查询条件
            limit:20,//每页10条
            skip:0,//跳过0条
            domain:"",//网站域名
            webname:"",//网站名称
            server_ip:""//服务器ip
        }, 
        queryChange:{               //备案变更查询条件
            limit:20,//每页10条
            skip:0,//跳过0条
            domain:"",//网站域名
            webname:"",//网站名称
            server_ip:""//服务器ip
        },        
        data:[
        ],
        dataChange:[],
    }
  },
  mounted(){
    this.bodyClickId=tool.SingleBind('mousedown',$('body'),()=>{
       this.blnShowStatus=false;
    });
    this.refreshPage();

    this.$store.commit(BODY_RESIZE,()=>{

    });
  },
  computed:{
      showData(){
          return _.map(this.data,r=>{
                return {
                    domain:r.domain,
                    webname:r.webname,
                    server_ip:r.server_ip,
                    web_head:r.web_head,
                    web_head_tel:r.web_head_tel,
                    service_prod_name:r.service_prod_name,
                    service_prod_tel:r.service_prod_tel,
                    service_prod_addr:r.service_prod_addr 
                }
            });
      },
      showDataChange(){
          return _.map(this.dataChange,r=>{
                return {
                    domain:r.update_after.domain,
                    webname:r.update_after.webname,
                    before_server_ip:r.update_befor.server_ip,
                    before_service_prod_name:r.update_befor.service_prod_name,
                    after_server_ip:r.update_after.server_ip,
                    after_service_prod_name:r.update_after.service_prod_name,
                    service_prod_tel:r.update_after.service_prod_tel,
                    service_prod_addr:r.update_after.service_prod_addr 
                }
            });
       }
  
  },
  destroyed(){
    tool.ClearBind(this.bodyClickId)
  },
  methods:{
      //刷新页面
      refreshPage(){
          this.loadData();
      },
      //加载数据
      loadData(){
         // 获取未备案列表信息
         this.$store.dispatch(GetWebList,this.query).then(res=>{
           if(res.msg.code!='successed')return;
           this.data=res.biz_body;
            this.blnLoading=false;  
         });
         //获取网站备案定制页面备案变更列表
         this.$store.dispatch(GetWebChangeList,this.queryChange).then(res=>{
           if(res.msg.code!='successed')return;
           this.dataChange=res.biz_body;
            this.blnLoading=false;  
         });


      },
      //区域范围的事件回传，第一个参数为上下文环境，第二个参数为具体值,因为该页面为单独定制没有上下文，因此取第二个值即可
      selectArea(val,data){
        if(data){
            this.query.region_range=data.regions;
        }else{
            this.query.region_range="";
        }
      },
      //列表和统计相互切换  
      switchView(type){
          if(type==this.viewTable) return
          this.viewTable=type;
      },
      //查询按钮(搜索 未备案的搜索)
      query_click(){
          this.data=[];
          this.blnSearch=true;
          this.blnLoading=true;
          this.pageNum= 0;
          this.query.skip=this.pageNum*this.query.limit;
          this.$store.dispatch(GetWebList,this.query).then(res=>{
              this.blnSearch=false;
              this.blnLoading=false;
              if(!tool.msg(res,'','搜索失败!'))return;
              this.data=res.biz_body;
          });
      },
      //查询按钮(搜索 备案变更的搜索)
      queryChange_click(){
          this.dataChange=[];
          this.blnSearch=true;
          this.blnLoading=true;
          this.pageNum= 0;
          this.queryChange.skip=this.pageNum*this.queryChange.limit;
          this.$store.dispatch(GetWebChangeList,this.queryChange).then(res=>{
              this.blnSearch=false;
              this.blnLoading=false;
              if(!tool.msg(res,'','搜索失败!'))return;
              this.dataChange=res.biz_body;
          });
      }, 
            
      //页码切换(分页 未备案的分页)
       pageChange(index){
          this.pageNum=index>0? index : 0;
          this.query.skip=this.pageNum*this.query.limit;
          this.$store.dispatch(GetWebList,this.query).then(res=>{
            if(!tool.msg(res))return;
            let data=res.biz_body;

            if(data.length<=0){
                tool.msg({msg:{code:'successed'}},'已经到了最后页!','已经到了最后页!');
                this.pageNum =this.pageNum-1;
                return;
            }

            this.data=data;
          });
       },
      //页码切换(分页 备案变更的分页)
       pageChangeChange(index){
          this.pageNum=index>0? index : 0;
          this.queryChange.skip=this.pageNum*this.queryChange.limit;
          this.$store.dispatch(GetWebChangeList,this.queryChange).then(res=>{
            if(!tool.msg(res))return;
            let data=res.biz_body;

            if(data.length<=0){
                tool.msg({msg:{code:'successed'}},'已经到了最后页!','已经到了最后页!');
                this.pageNum =this.pageNum-1;
                return;
            }

            this.dataChange=data;
          });
       },












       //查看未备案网站详情
        searchDetail(siteId){
            let self=this;
            tool.open(function(){
                let html=`<div name="container" style="width:100%;height:100%;padding: 10px;" >
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">网站域名：</div>
                                <div class="col-md-4">{{detailData.domain}}</div>

                                <div class="col-md-2 item_label_right">网站名称：</div>
                                <div class="col-md-4">{{detailData.webname}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">服务器IP：</div>
                                <div class="col-md-4">{{detailData.server_ip}}</div>
                                <div class="col-md-2 item_label_right">网站负责人：</div>
                                <div class="col-md-4">{{detailData.web_head}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">负责人证件号：</div>
                                <div class="col-md-4">{{detailData.web_head_id_no}}</div>
                                <div class="col-md-2 item_label_right">负责人电话：</div>
                                <div class="col-md-4">{{detailData.web_head_tel}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">接入服务商代码：</div>
                                <div class="col-md-4">{{detailData.service_prod_code}}</div>
                                <div class="col-md-2 item_label_right">接入服务商名称：</div>
                                <div class="col-md-4">{{detailData.service_prod_name}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">接入服务商电话：</div>
                                <div class="col-md-4">{{detailData.service_prod_tel}}</div>
                                <div class="col-md-2 item_label_right">接入服务商地址：</div>
                                <div class="col-md-4">{{detailData.service_prod_addr}}</div>                                
                            </div>
                        
                        </div>`;
                let param={
                        title:'未备案网站详情',
                        content:html,
                        skin:'site-detail-container',
                        area:['900px','250px'],
                        context:{
                            detailData:{},
                            loadDetail(){
                                self.$store.dispatch(GetWebDetail,{domain:siteId}).then(res=>{
                                    if(res.msg.code!='successed')return;
                                    param.selfData.detailData=res.biz_body;
                                   // param.selfData.detailData.assign_time = param.selfData.detailData.assign_time ? tool.DateByTimestamp(param.selfData.detailData.assign_time,'yyyy-MM-dd hh:mm:ss'):'';
                                });
                            }
                        },
                        success(){
                            param.selfData.loadDetail();    
                        }
                    };

                return param;
            }());             
        },
      //查看备案变更详情详情
        searchDetailChange(siteId){
                                console.log("2");
            let self=this;
            tool.open(function(){
                let html=`<div name="container" style="width:100%;height:100%;padding: 10px;" >
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">网站域名：</div>
                                <div class="col-md-4">{{detailData.domain}}</div>

                                <div class="col-md-2 item_label_right">网站名称：</div>
                                <div class="col-md-4">{{detailData.update_after.webname}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">网站负责人</div>
                                <div class="col-md-4">{{detailData.update_after.web_head}}</div>
                                <div class="col-md-2 item_label_right">负责人电话</div>
                                <div class="col-md-4">{{detailData.update_after.web_head_tel}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">负责人证件号：</div>
                                <div class="col-md-4">{{detailData.update_after.web_head_id_no}}</div>
                                <div class="col-md-2 item_label_right">变更前服务器IP</div>
                                <div class="col-md-4">{{detailData.update_befor.server_ip}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">变更后服务器IP</div>
                                <div class="col-md-4">{{detailData.update_after.server_ip}}</div>
                                <div class="col-md-2 item_label_right">变更后服务商名称：</div>
                                <div class="col-md-4">{{detailData.update_after.service_prod_name}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">接入服务商电话：</div>
                                <div class="col-md-4">{{detailData.update_after.service_prod_tel}}</div>
                                <div class="col-md-2 item_label_right">接入服务商地址：</div>
                                <div class="col-md-4">{{detailData.update_after.service_prod_addr}}</div>                                
                            </div>
                        
                        </div>`;
                let param={
                        title:'备案变更详情',
                        content:html,
                        skin:'site-detail-container',
                        area:['900px','250px'],
                        context:{
                            detailData:{},
                            loadDetail(){
                                console.log("1");
                                self.$store.dispatch(GetWebChangeDetail,{domain:siteId}).then(res=>{
                                    if(res.msg.code!='successed')return;
                                    param.selfData.detailData=res.biz_body;
                                   // param.selfData.detailData.assign_time = param.selfData.detailData.assign_time ? tool.DateByTimestamp(param.selfData.detailData.assign_time,'yyyy-MM-dd hh:mm:ss'):'';
                                });
                            }
                        },
                        success(){
                            param.selfData.loadDetail();    
                        }
                    };

                return param;
            }());             
        },

  }
}
</script>
<style lang="less">
    /* 场所详情样式*/
   .site-detail-container .layui-layer-title{
        background-color: #03ab67;
        font-weight: 700;
        color:#fff;
    }
    .site-detail-container .site-detail-row{
        margin: 0px;
        line-height: 30px;
        border-bottom: 1px solid #e7eaec;
    }
    .site-detail-container .site-detail-row .item_label_left{
        text-align: right;
        border-right: 1px solid #e7eaec;
    }
    .site-detail-container .site-detail-row .item_label_right{
        text-align: right;
        border-right: 1px solid #e7eaec;
        border-left: 1px solid #e7eaec;
    }

    /*挂在设备详情*/
    .device-detail-container .layui-layer-title{
        background-color: #03ab67;
        font-weight: 700;
        color:#fff;
    }
    .device-detail-container .mount-table .header div{
        display: inline-block;
    }
    .device-detail-container .mount-table .header{
        display: table-row;
    }
    .device-detail-container .mount-table .header .mount_item{
        display: table-cell;
        font-weight: bolder;
        text-align: center;
        background-color: #E5E5E5;
        line-height: 30px;
        padding: 5px 5px;
        border: 1px solid #C9C9C9;
    }
    .device-detail-container .mount-table .header .mount_item .overflow{
        display: block;
    }
    .device-detail-container .mount-table .content .mount_item{
        display: table-cell;
        font-weight: normal;
        text-align: center;
        line-height: 30px;
        padding: 5px;
        border: 1px solid #C9C9C9;

    }
    .device-detail-container .red{color:red}
    .device-detail-container .green{color:green}
    .device-detail-container .mount-table .content .mount_item .overflow{
        width:100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        display: block;
    }


    /* 数据采集趋势*/
    .status-detail-container .layui-layer-title{
        background-color: #03ab67;
        font-size: 16px;
        color: #fff;
    }
    .status-detail-container .tit-row{
        height:30px;
        padding:0 10px;
        margin-bottom: 6px;
    }
    .status-detail-container .tit-row .tit-bars{
        display: inline-block;
        text-align: center;
        margin: 0px 5px;
        cursor: pointer;
        width: 73px;
        line-height: 25px;
        background-color: #fff;
        color: #000;
        border:1px solid #04AB66;
        border-radius: 6px;
    }
    .status-detail-container .tit-row .tit-bars:hover{
         background-color: #04AB66;
        color: #fff;
        border:1px solid #04AB66;        
    }
    .status-detail-container .tit-row .tit-bars.active{
        background-color: #04AB66;
        color: #fff;
        border:1px solid #04AB66;        
    }
    .status-detail-container .data-row div{
        display: inline-block;
    }
    .status-detail-container .data-row .tda-ert{
        width: 100%;
        margin: 17px 0 13px;
        padding: 0 15px;
        font-size: 12px;
    }
    .status-detail-container .data-row .lefts span{
        display: inline-block;
        margin-right: 40px;
        margin-left: 5px;
    }
    .status-detail-container .data-row .rights{
        float:right;
    }
    .status-detail-container .data-row .rights .sele-time{
        width: 66px;
        text-align: center;
        color: #333645;
        border-bottom: 2px solid #CCC;
        margin: 0 3px;
        cursor: pointer;
    }
    .status-detail-container .data-row .rights .sele-time:hover{
        border-bottom: 2px solid #04AB66;       
    }
    .status-detail-container .data-row .rights .sele-time.active{
        border-bottom: 2px solid #04AB66;       
    }
</style>
<style scoped lang="less">
  @import "../css/variables.less";
  @rowH:40px;
  .areapage{width:100%;height:100%;overflow:hidden;padding:5px;}
  .areapage .CaseManage_container{width:100%;height:100%;}
  .areapage .body,
  .areapage .header{width: 100% !important;list-style: none;padding-left: 0px;padding: 0px;margin-bottom:0px;display:table;}
  .areapage .body .item,
  .areapage .header .item{line-height: @rowH;height: @rowH;text-align: left;margin: 0px;display: table-row;width: 100%;background-color: @Font_Hover_Col;color: white;}
  .areapage .body .item > div,
  .areapage .header .item > div{display: table-cell;.border('bottom');.border('right');padding: 0px 0px 0px 0px;vertical-align: middle;text-align:center;}

  .areapage .body .item{background-color:white;color:@HeaderBgCol;}

  .areapage .body .item .sep,
  .areapage .header .item .sep{border-right:2px solid @FontCol;}
  .areapage .body .item .option,
  .areapage .header .item .option{width:120px;background-color: inherit;}
  .areapage .body .item .count_item,
  .areapage .header .item .count_item{width:80px;}

  .areapage .body .item .option .overflow > span{border:none;font-size:12px;display: initial;margin-right:5px;}
  .areapage .body .item .option .overflow > span:hover{cursor:pointer;color:@Font_Hover_Col;}
  .areapage .item .overflow{margin:0 auto;}
  .areapage .body .item .align .overflow{text-align:left}
  .areapage .body .item .overflow.sit-click,.firmpage .body .item .overflow .sit-click{
      color:#03ab67;
  }
 .areapage .body .item .overflow.sit-click:hover,.firmpage .body .item .overflow .sit-click:hover{
      cursor:pointer;
      text-decoration:underline;
  }
  @optionH:50px;
  .areapage .option{width:100%;background-color: white;}
  .areapage .page_container{.border('top');.border('bottom');background-color:white;position: absolute;bottom: 2px; }
  .areapage .content{width:100%;height:~'calc(100% - @{optionH} - 60px - 40px)';}

  .areapage .header .item .dropDown{position: absolute;z-index: 100;top: 35px;line-height: initial;margin-left: 5px;
        width: calc(100% - 10px);
        color: black;
        text-align:left;
        background-color: white;
        -moz-box-shadow: 2px 2px 2px #333333;
        -webkit-box-shadow: 2px 2px 2px #333333;
        box-shadow: 2px 2px 2px #333333;
        font-size: 12px;
  }

  .areapage .header .item .dropDown div{.border('bottom');line-height:25px;padding:0px 10px;}
  .areapage .header .item .dropDown div:hover{background-color:@Font_Hover_Col;color:white;cursor:pointer;}

  .areapage .header .item .title_content{position:relative;}

  .areapage .option{text-align: initial;padding:10px;}
  .areapage .option .item{display:inline-block;margin: 2px 0;}
  .areapage .option .item .input{display:inline-block;}
  .areapage .tag_label:hover{color:@btn_Bg_Col_hover_1;}

  .areapage .body .item .count_item:hover{color:@Font_Hover_Col;cursor:pointer;}
  .overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}
  .areapage .tagComp[data-v-033fe12d]{
    height: 100%;
    width: 100%;
    padding: 2px 0px;
    text-align: left;
  }
  .areapage .tagComp .item{
    display: inline-block;
    height: 100%;
    min-width: 50px;
    text-align: center;
    margin: 0px 5px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.35, 0.52, 0.33, 0.98) 0s;
  }
  .areapage .tagComp .item.active{
    background-color: #03ab67;
    color: white;
    border-radius: 5px;
  }
  .areapage .tagComp .item:hover{
    background-color: #03ab67;
    color: white;
    border-radius: 5px;
  }
  .areapage .tagComp .item .item_containner{
    display: table;
    height: 100%;
    width: 100%;
    padding: 0px 10px;
  }
  .areapage .tagComp .item .item_container .content{
    display: table-cell;
    vertical-align: middle;
    padding: 5px 10px;
  }
  .areapage .tagComp .item .item_container .content i{
    margin-right: 5px;
  }
  .areapage .chart_container .his-row{
    height:40px;
    width:100%;      
  }
  .areapage .chart_container .his-row div{
    display: inline-block;
  }   
  .areapage .chart_container .his-row .his-title{
    float: left;
    margin-left: 30px;
    font-size: 19px;
    font-weight: 900;  
  }

    .areapage .red{color:red}
    .areapage .green{color:green}
  .areapage .chart_container .his-row .his-term{
    float: left;
    margin-left: 60px;
  }
  .areapage .chart_container .his-row .optionBar{
    float: right;
    margin-right: 50px;
  }
  .areapage .chart_container .his-row .optionBar .el-tooltip{
    margin-right:10px;
  }
  .areapage .chart_container .his-row .optionBar .el-tooltip:hover{
    cursor: pointer;
    color: #03ab67;
  }  
  .areapage .chart_container .his-row .optionBar .el-tooltip.active{
    cursor: pointer;
    color: #03ab67;
  }  
</style>
