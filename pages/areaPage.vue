<!-- 区域管理定制页面组件 created by Chuanjiang Li 2018/04/16-->
<template>
    <div class="areapage">
        <div class="CaseManage_container">
            <!--加载中标识-->
            <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;">
                <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;"><i class="fa fa-spinner fa-pulse"></i></div></div>
            </div>
            <!--列表显示区域-->
            <div style="height: calc(100% - 50px - -93px - 40px);position:relative">
                <div class="option">
                    <div class="item">
                        <span>区域范围:</span>
                        <div class="input">
                            <PlaceSearch  :blnClear="true" c_searchKind="0" @place_res="selectArea"></PlaceSearch>
                        </div>
                    </div>
                    <div class="item" >
                        <el-button type="primary" @click="query_click()"><i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i><span v-show="!blnSearch">搜索</span></el-button>
                    </div>

                </div>
                <ul class="header">
                    <li class="item">
                        <div><span class="overflow" style="width:115px;">区域编码</span></div>
                        <div><span class="overflow" style="width:100px;">区域名称</span></div>
                        <div><span class="overflow" style="width:130px;">区域下场所</span></div>
                        <div><span class="overflow" style="width:70px;">场所在线率</span></div>
                        <div><span class="overflow" style="width:120px;">场所采集量</span></div>
                        <div><span class="overflow" style="width:90px;">场所贡献率</span></div>
                        <div><span class="overflow" style="width:80px;">区域下设备</span></div>
                        <div><span class="overflow" style="width:65px;">设备在线率</span></div>
                        <div><span class="overflow" style="width:90px;">设备采集量</span></div>
                        <div><span class="overflow" style="width:90px;">设备贡献率</span></div>
                        <!-- <div><span class="overflow" style="width:90px;">区域操作员</span></div> -->
                        <!-- <div><span class="overflow" style="width:80px;">所属厂商</span></div> -->
                        <!-- <div><span class="overflow" style="width:100px;">操作</span></div> -->
                    </li>
                </ul>
                <div class="content">
                    <Scroll :listen="data">
                        <ul class="body">
                            <li class="item" style="text-align:center;display: table-caption;" v-if="showData.length<=0&&!blnLoading">暂无数据</li>
                            <li v-for="(d,i) in showData" class="item" >
                                <div  :title="d.netbar_wacode" ><span class="overflow" style="width:115px;">{{d.region_code}}</span></div>
                                <div class="align" :title="d.region_name" ><span class="overflow" style="width:100px;">{{d.region_name}}</span></div>
                                <div ><span class="overflow" style="width:130px;" v-html="d.region_site_status"></span></div>
                                <div  :title="d.site_online_pre"><span class="overflow" style="width:70px;">{{d.site_online_pre}}</span></div>
                                <div ><span class="overflow " style="width:120px;">{{d.site_detect_num}}</span></div>
                                <div  :title="d.site_contribution"><span class="overflow" style="width:90px;">{{d.site_contribution}}</span></div>
                                <div ><span class="overflow" style="width:80px;" v-html="d.region_equip_status"></span></div>
                                <div  :title="d.equipment_online_pre"><span class="overflow" style="width:65px;">{{d.equipment_online_pre}}</span></div>
                                <div  :title="d.equip_detect_num"><span class="overflow" style="width:90px;">{{d.equip_detect_num}}</span></div>
                                <div  :title="d.equip_contribution"><span class="overflow" style="width:90px;">{{d.equip_contribution}}</span></div>
                                <!-- <div  :title="d.microprobe_type"><span class="overflow" style="width:90px;">{{d.microprobe_type}}</span></div> -->
                                <!-- <div class="align" :title="d.security_software_orgname"><span class="overflow" style="width:80px;">{{d.security_software_orgname}}</span></div> -->
                                <!-- <div><span class="overflow" style="width:100px">
                                   <span class="overflow sit-click" style="width:50px">详细</span>
                                </div> -->
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
import {BODY_RESIZE,GetSiteList,SiteDetail,GetRegionList} from '../store/mutation-types'
export default {
  name: 'areaPage',
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

        blnShowStatus:false,
        bodyClickId:-1,
        blnSearch:false,
        query:{
            limit:20,//每页10条
            skip:0,//跳过0条
            region_range:[],   //区域范围

        },
        data:[
        ],
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
                    region_code:r.region_code,
                    region_name:r.region_name,
                    region_site_status:"<span style='color:green'>"+ r.site_online_num+"</span>/<span style='color:red'>"+r.site_abnormal_num+"</span>/<span style='color:#000'>"+r.site_offline_num+"</span>",
                    site_online_pre:(r.site_online_pre*100).toFixed(2) +"%",
                    site_detect_num:r.site_detect_num,
                    site_contribution:(r.site_contribution*100).toFixed(2)+"%",
                    //security_software_equip_status:r.equip_online_num+'/'+r.equip_abnormal_num+'/'+r.equip_offline_num,      
                    region_equip_status:"<span style='color:green'>"+ r.equip_online_num+"</span>/<span style='color:red'>"+r.equip_abnormal_num+"</span>/<span style='color:#000'>"+r.equip_offline_num+"</span>",
                    equipment_online_pre:(r.equipment_online_pre*100).toFixed(2) + "%",
                    equip_detect_num:r.equip_detect_num,
                    equip_contribution:(r.equip_contribution*100).toFixed(2)+"%"    
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
         this.$store.dispatch(GetRegionList,this.query).then(res=>{
           if(res.msg.code!='successed')return;
           this.data=res.biz_body;
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
      //查询按钮(搜索)
      query_click(){
          this.data=[];
          this.blnSearch=true;
          this.blnLoading=true;
          this.pageNum= 0;
          this.query.skip=this.pageNum*this.query.limit;
          this.$store.dispatch(GetRegionList,this.query).then(res=>{
              this.blnSearch=false;
              this.blnLoading=false;
              if(!tool.msg(res,'','搜索失败!'))return;
              this.data=res.biz_body;
          });
      },
      //页码切换(分页)
       pageChange(index){
          this.pageNum=index>0? index : 0;
          this.query.skip=this.pageNum*this.query.limit;
          this.$store.dispatch(GetRegionList,this.query).then(res=>{
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

       //查看详情
        searchSiteDetail(siteId){
            let self=this;
            tool.open(function(){
                let html=`<div name="container" style="width:100%;height:100%;padding: 10px;" >
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">场所编码：</div>
                                <div class="col-md-4">{{detailData.netbar_wacode}}</div>

                                <div class="col-md-2 item_label_right">场所名称：</div>
                                <div class="col-md-4">{{detailData.netbar_name}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">数据来源：</div>
                                <div class="col-md-4">{{detailData.microprobe_type}}</div>
                                <div class="col-md-2 item_label_right">设备MAC：</div>
                                <div class="col-md-4">{{detailData.mac}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">场所类型：</div>
                                <div class="col-md-4">{{detailData.netsite_type}}</div>
                                <div class="col-md-2 item_label_right">经营性质：</div>
                                <div class="col-md-4">{{detailData.business_nature}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">营业状态：</div>
                                <div class="col-md-4">{{detailData.business_state}}</div>
                                <div class="col-md-2 item_label_right">上网终端数：</div>
                                <div class="col-md-4">{{detailData.net_terminal_num}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">所属区域：</div>
                                <div class="col-md-4">{{detailData.region_name}}</div>
                                <div class="col-md-2 item_label_right">所属派出所：</div>
                                <div class="col-md-4">{{detailData.wa_department}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">场所状态</div>
                                <div class="col-md-4">{{detailData.online_state}}</div>
                                <div class="col-md-2 item_label_right">厂商名称：</div>
                                <div class="col-md-4">{{detailData.security_software_orgname}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">场所经纬度：</div>
                                <div class="col-md-4">{{detailData.longitude}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{detailData.latitude}}</div>
                                <div class="col-md-2 item_label_right">场所分配时间：</div>
                                <div class="col-md-4">{{detailData.assign_time}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">营业开始时间：</div>
                                <div class="col-md-4">{{detailData.start_time}}</div>
                                <div class="col-md-2 item_label_right">营业结束时间：</div>
                                <div class="col-md-4">{{detailData.end_time}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">场所法人：</div>
                                <div class="col-md-4">{{detailData.law_principal_name}}</div>
                                <div class="col-md-2 item_label_right">法人证件号：</div>
                                <div class="col-md-4">{{detailData.law_principal_certificate_id}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">法人联系电话：</div>
                                <div class="col-md-4">{{detailData.law_principal_tel}}</div>
                                <div class="col-md-2 item_label_right">安全员：</div>
                                <div class="col-md-4">{{detailData.infoman_name}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">安全员证件号：</div>
                                <div class="col-md-4">{{detailData.infoman_certificate_id}}</div>
                                <div class="col-md-2 item_label_right">安全员联系电话：</div>
                                <div class="col-md-4">{{detailData.infoman_tel}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">场所负责人：</div>
                                <div class="col-md-4">{{detailData.principal_name}}</div>
                                <div class="col-md-2 item_label_right">负责人证件号：</div>
                                <div class="col-md-4">{{detailData.principal_certificate_id}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">负责人联系电话：</div>
                                <div class="col-md-10">{{detailData.principal_tel}}</div>                           
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">场所地址：</div>
                                <div class="col-md-10">{{detailData.netbar_address}}</div>                            
                            </div>


                        </div>`;
                let param={
                        title:'场所详情',
                        content:html,
                        skin:'site-detail-container',
                        area:['900px','500px'],
                        context:{
                            detailData:{},
                            loadDetail(){
                                self.$store.dispatch(SiteDetail,{netbar_wacode:siteId}).then(res=>{
                                    if(res.msg.code!='successed')return;
                                    param.selfData.detailData=res.biz_body;
                                    param.selfData.detailData.assign_time = param.selfData.detailData.assign_time ? tool.DateByTimestamp(param.selfData.detailData.assign_time,'yyyy-MM-dd hh:mm:ss'):'';
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

<style scoped lang="less">
  @import "../css/variables.less";
  @rowH:40px;
  .areapage{width:100%;height:100%;overflow:hidden;padding:5px;}
  .areapage .CaseManage_container{width:100%;height:100%;}
  .areapage .body,
  .areapage .header{width: 100% !important;list-style: none;padding-left: 0px;padding: 0px;margin-bottom:0px;display:table;}
  .areapage .body .item,
  .areapage .header .item{line-height: @rowH;height: @rowH;text-align: left;margin: 0px;display: table-row;width: 100%;color: white;}
  html{.TCol(~".areapage .header .item",'bg');}
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
  .areapage .body .item .option .overflow > span:hover{cursor:pointer;}
  html{.TCol(~".areapage .body .item .option .overflow > span:hover");}

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
  .areapage .header .item .dropDown div:hover{color:white;cursor:pointer;}

  html{.TCol(~".areapage .header .item .dropDown div:hover",'bg');}

  .areapage .header .item .title_content{position:relative;}

  .areapage .option{text-align: initial;padding:10px;}
  .areapage .option .item{display:inline-block;margin: 2px 0;}
  .areapage .option .item .input{display:inline-block;}
  .areapage .tag_label:hover{color:@btn_Bg_Col_hover_1;}

  .areapage .body .item .count_item:hover{cursor:pointer;}
  html{.TCol(~".areapage .body .item .count_item:hover");}

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
