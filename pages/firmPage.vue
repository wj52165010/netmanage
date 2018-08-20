<!-- 厂商管理定制页面组件 created by Chuanjiang Li 2018/04/16-->
<template>
    <div class="firmpage">
        <div class="CaseManage_container">
            <!--加载中标识-->
            <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;">
                <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;"><i class="fa fa-spinner fa-pulse"></i></div></div>
            </div>
            <!-- 标签切换 -->
            <div style="height:30px" name="tagcomp">
              <div class="tagComp" style="text-align:left">
                <div class="item" @click="switchView('statistics')" :class="{active: viewTable=='statistics'}">
                    <div class="item_container">
                        <span class="content"><i class="fa fa-gear"></i>分析</span>
                    </div>
                </div>                  
                <div class="item" @click="switchView('list')" :class="{active: viewTable=='list'}">
                    <div class="item_container">
                        <span class="content"><i class="fa fa-list"></i>列表</span>
                    </div>
                </div>

               </div>
            </div>

            <!--列表显示区域-->
            <div v-show="viewTable=='list'" style="height: calc(100% - 50px - -63px - 40px);position:relative">
                <div class="option" name="listOption">
                    <div class="item">
                        <span>厂商编码:</span>
                        <div class="input">
                            <el-input placeholder="厂商编码" v-model="query.security_software_orgcode"></el-input>
                        </div>
                    </div>
                    <!-- <div class="item">
                        <span>场所范围:</span>
                        <div class="input">
                            <PlaceSearch :blnLike="true" :blnClear="true" c_searchKind="1" @place_res="selectSite"></PlaceSearch>
                        </div>
                    </div> -->
                    <!-- <div class="item" >
                        <span>厂商名称：</span>
                        <div class="input" style="width:250px;display:inline-block;">
                            <MulDropDwon :data="Selfirms" keyProp="name" id="code" placeholder="请选择厂商">
                                <div v-for="t in firms" @mousedown="firmClick('list',t)">{{t.name}}</div>
                            </MulDropDwon>
                        </div>
                    </div>  -->
                    <div class="item">
                        <span>厂商名称:</span>
                        <div class="input">
                            <el-input placeholder="厂商名称" v-model="query.security_software_orgname"></el-input>
                        </div>
                    </div>
                    <div class="item" >
                        <el-button type="primary" @click="query_click()"><i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i><span v-show="!blnSearch">搜索</span></el-button>
                    </div>

                    <div class="item" style="float:right;">
                        <div class="exportSel" :class="{active:blnExport}" @click="blnExport=!blnExport"><i class="fa fa-check-square" style="margin-right:5px;" />选择</div>
                    </div>

                </div>
                <ul class="header">
                    <li class="item">
                        <div class="column cursor" @click="selAll()" v-if="blnExport" style="width:50px;"><span class="overflow" style="width:50px;"><i :class="{'fa fa-check-square-o':blnAllSel,'fa fa-square-o':!blnAllSel}"></i></span></div>
                        <div><span class="overflow" style="width:75px;">厂商编码</span></div>
                        <div><span class="overflow" style="width:205px;">厂商名称</span></div>
                        <div><span class="overflow" style="width:90px;">昨日采集总量</span></div>
                        <!-- <div><span class="overflow" style="width:200px;">厂商地址</span></div> -->
                        <div><span class="overflow" style="width:100px;">场所概况</span></div>
                        <div><span class="overflow" style="width:90px;">场所在线率</span></div>
                        <div><span class="overflow" style="width:90px;">场所采集总量</span></div>
                        <div><span class="overflow" style="width:80px;">场所贡献率</span></div>
                        <div><span class="overflow" style="width:95px;">设备概况</span></div>
                        <div><span class="overflow" style="width:90px;">设备在线率</span></div>
                        <div><span class="overflow" style="width:90px;">设备采集总量</span></div>
                        <div><span class="overflow" style="width:90px;">设备贡献率</span></div>
                        <!-- <div><span class="overflow" style="width:80px;">所属厂商</span></div> -->
                        <!-- <div><span class="overflow" style="width:70px;">操作</span></div> -->
                    </li>
                </ul>
                <div class="content" :style="{height:listBodyH}">
                    <Scroll :listen="data" ref="indList">
                        <ul class="body">
                            <li class="item" style="text-align:center;display: table-caption;" v-if="showData.length<=0&&!blnLoading">暂无数据</li>
                            <li v-for="(d,i) in showData" class="item" >
                                <div class="column cursor" @click="selItem(d)" v-if="blnExport"  style="width:50px;" ><span class="overflow" style="width:50px;"><i :class="{'fa fa-check-square-o':blnSelItem(d),'fa fa-square-o':!blnSelItem(d)}"></i></span></div>
                                <div  :title="d.security_software_orgcode" ><span class="overflow" style="width:75px;">{{d.security_software_orgcode}}</span></div>
                                <div class="align" :title="d.security_software_orgname" ><span class="overflow" style="width:205px;">{{d.security_software_orgname}}</span></div>
                                <div  :title="d.total_detect_num" @click="dataStatus(d.security_software_orgcode,d.security_software_orgname)"><span class="overflow sit-click" style="width:90px;">{{d.total_detect_num}}</span></div>
                                <!-- <div class="align" :title="d.security_software_address"><span class="overflow" style="width:200px;">{{d.security_software_address}}</span></div> -->
                                <div><span class="overflow" style="width:100px;" v-html="d.security_software_site_status"></span></div>
                                <div ><span class="overflow " style="width:90px;">{{d.site_online_pre}}</span></div>
                                <div  :title="d.site_detect_num" ><span class="overflow" style="width:90px;">{{d.site_detect_num}}</span></div>
                                <div  :title="d.last_upload_num"><span class="overflow" style="width:80px;">{{d.site_contribution}}</span></div>
                                <div  :title="d.site_contribution"><span class="overflow" style="width:95px;" v-html="d.security_software_equip_status"></span></div>
                                <div  :title="d.equipment_online_pre"><span class="overflow" style="width:90px;">{{d.equipment_online_pre}}</span></div>
                                <div  :title="d.equip_detect_num"><span class="overflow" style="width:90px;">{{d.equip_detect_num}}</span></div>
                                <div  :title="d.equip_contribution"><span class="overflow" style="width:90px;">{{d.equip_contribution}}</span></div>
                                <!-- <div class="align" :title="d.security_software_orgname"><span class="overflow" style="width:80px;">{{d.security_software_orgname}}</span></div> -->
                                <!-- <div  title="查看详情" @click="searchFirmDetail(d.security_software_orgcode)"><span class="overflow sit-click" style="width:70px">详细</span></div> -->
                            </li>
                        </ul>
                    </Scroll>
                </div>
                <div class="page_container">
                    <span class="exportBtn" v-if="blnExport" @click="exportList()" style="float:left;margin-top:10px;margin-left:15px;font-size:12px;cursor:pointer;"><i class="fa fa-upload" /> 导出 <i v-if="exportDataing" class="fa fa-spinner fa-pulse" /></span>
                    <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageNum+1}}</span></span>
                    <div class="firstPage" @click="pageChange(0)">首页</div>
                    <div class="prePage" @click="pageChange(pageNum-1)">上一页</div>
                    <div class="nextPage" @click="pageChange(pageNum+1)">下一页</div>
                </div>
            </div>

            <!--统计图表显示区域-->
            <div class="chart_container" v-show="viewTable=='statistics'" style="height: calc(100% - 50px - -63px - 40px);">
                <div class="chart_container" style="width:100%;height:100%;position:relative">
                    <!--扇形图（昨日状况）-->
                    <div style="width:1%;height:50%;display:inline-block">
                        <div name="deal_chart_container" class="" style="width:100%;height:100%;text-align:left"></div>
                    </div>               
                    <!--柱状图(问题总览)-->
                    <div style="width:97%;height:50%;display:inline-block">
                        <div class="his-row" style="height:13%;margin-left:80px">
                            <div class="his-title" style="margin-left: -40px">采集详情</div>
                            <div class="block" style="float: left;margin-left: 30px;">
                                <span class="demonstration">时间范围:</span>
                                <!--<el-date-picker
                                v-model="timeBar"
                                type="date"
                                :editable="false"
                                :clearable="false"
                                default-value="timeBar"
                                @change="changeTime"
                                placeholder="选择日期"
                                :picker-options="pickerOptions0">
                                </el-date-picker>-->

                                    <el-date-picker
                                    v-model="timeBar"
                                    type="daterange"
                                    :picker-options="pickerOptions0"
                                    placeholder="选择日期范围"
                                    style="width:200px"
                                    >
                                    </el-date-picker>
                            </div>
                        </div>
                        <div name="bar_chart_container" style="width:100%%;height:80%;" ></div>
                    </div>

 
                    <!--场所在离线-->
                    <!--<div style="width:100%;height:50%;">
                        <div class="his-row" style="height:13%">
                            <div class="his-title">场所在离线</div>
                            <div class="his-title item" style="font-size:12px;font-weight:normal;text-align:left">
                                <span>厂商名称：</span>
                                <div class="input" style="width:250px;display:inline-block;">
                                    <MulDropDwon :data="sitefirms" keyProp="name" id="code" placeholder="请选择厂商">
                                        <div v-for="t in firms" @mousedown="firmClick('site',t)">{{t.name}}</div>
                                    </MulDropDwon>
                                </div>
                            </div> 
                            <div class="his-term item">
                                <span>区域范围:</span>
                                <div class="input">
                                    <PlaceSearch  :blnClear="true" c_searchKind="0" @place_res="selectAreaSite"></PlaceSearch>
                                </div>
                            </div>
                            <div class="his-term item">
                                <span>时间范围</span>
                                <div class="input">
                                    <el-select v-model="siteSelect.coll_type" placeholder="请选择">
                                    <el-option
                                    v-for="kind in selectTime"
                                    :key="kind.code"
                                    :label="kind.name"
                                    :value="kind.val">
                                    </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="optionBar">
                                <div class="el-tooltip item " title="场所在离线详情" :class="{active: changeSiteChart=='bar'}" @click="changesiteChartSty('bar')">
                                    <div class="el-tooltip__rel" ><i class="fa fa-area-chart"></i></div>
                                </div> 
                                <div class="el-tooltip item" title="场所在离线率" :class="{active: changeSiteChart=='line'}" @click="changesiteChartSty('line')">
                                    <div class="el-tooltip__rel"><i class="fa fa-line-chart"></i></div>
                                </div>
                                <div class="el-tooltip item" title="导出数据" @click="ExportSiteCount()">
                                    <div class="el-tooltip__rel">
                                        <i class="fa fa-level-down"></i>
                                    </div>
                                </div>
                            </div>      
                        </div>                                
                        <!--场所在离线在离线率图表显示区域-->
                       <!-- <div class="chart_container" style="height:87%;width:100%;display:inline-block">
                            <!--场所在离线率柱状图-->
                          <!--  <div name="site_bar_chart_container"  v-show="changeSiteChart=='bar'" style="margin:0 auto;width:100%;height:100%"></div>
                            <!--场所在离线线形图-->
                        <!--    <div name="site_line_chart_container" v-show="changeSiteChart=='line'" style="margin:0 auto;width:100%;height:100%"></div>
                        </div>
                    </div>          -->         
                    <!--在离线状况-->
                    <div name="line_chart_container" style="width:95%;height:50%;display:inline-block;margin:0 auto" >
                        <div class="his-row" style="height:13%">
                            <div class="his-title">在离线状况</div>
                            <div class="his-term item">
                                <span>统计类型</span>
                                <div class="input" style="width:120px">
                                    <el-select v-model="deviceSelect.type" placeholder="请选择">
                                    <el-option
                                    v-for="kind in selectType"
                                    :key="kind.code"
                                    :label="kind.name"
                                    :value="kind.val">
                                    </el-option>
                                    </el-select>
                                </div>
                            </div>

                           <div class="his-term item">
                                <span>数据来源：</span>
                                <div class="input">
                                    <el-select v-model="deviceSelect.microprobe_type" placeholder="请选择" :clearable="true" :multiple="true">
                                       <el-option v-for="kind in dict_tables.microprobe_type" :key="kind.value" :label="kind.name" :value="kind.value"></el-option>
                                    </el-select>
                                </div>
                            </div>    
                            <div class="his-term item">
                                <span>时间范围</span>
                                <div class="input" style="width:100px">
                                    <el-select v-model="deviceSelect.coll_type" placeholder="请选择">
                                    <el-option
                                    v-for="kind in selectTime"
                                    :key="kind.code"
                                    :label="kind.name"
                                    :value="kind.val">
                                    </el-option>
                                    </el-select>
                                </div>
                            </div>
                             <div class="his-term item">
                                <span>区域范围:</span>
                                <div class="input">
                                    <PlaceSearch  :blnClear="true" c_searchKind="0" @place_res="selectAreaDevice"></PlaceSearch>
                                </div>
                            </div>
                            <div class="his-title item" style="font-size:12px;font-weight:normal;text-align:left">
                                <span>厂商名称：</span>
                                <div class="input" style="width:180px;display:inline-block;">
                                    <MulDropDwon :data="devicefirms" keyProp="name" id="code" placeholder="请选择厂商">
                                        <div v-for="t in firms" @mousedown="firmClick('device',t)">{{t.name}} <i v-if="isHasSelItem(devicefirms,t.code)" class="fa fa-check" style="float:right;margin-top: 10px;"></i></div>
                                    </MulDropDwon>
                                </div>
                            </div> 


                            <div class="optionBar">
                                <div class="el-tooltip item " title="设备在离线详情" :class="{active: changeDeviceChart=='bar'}" @click="changeDeviceChartSty('bar')">
                                    <div class="el-tooltip__rel" ><i class="fa fa-area-chart"></i></div>
                                </div> 
                                <div class="el-tooltip item" title="设备在线率" :class="{active: changeDeviceChart=='line'}" @click="changeDeviceChartSty('line')">
                                    <div class="el-tooltip__rel"><i class="fa fa-line-chart"></i></div>
                                </div> 
                                <div class="el-tooltip item" title="导出数据" @click="ExportDeviceCount()">
                                    <div class="el-tooltip__rel">
                                        <i class="fa fa-level-down"></i>
                                    </div>
                                </div>
                            </div>      
                        </div>     
                        <!--在离线率图表显示区域-->
                        <div class="chart_container" style="height:75%;width:100%;display:inline-block">
                            <!--在离线率柱状图-->
                            <div name="device_bar_chart_container" v-show="changeDeviceChart=='bar'" style="margin:0 auto;width:100%;height:100%"></div>
                            <!--在离线率线形图-->
                            <div name="device_line_chart_container" v-show="changeDeviceChart=='line'" style="margin:0 auto;width:100%;height:100%"></div>
                        </div>
                    </div>
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

// 引入图表组件
import echarts from  'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie';

// 引入提示框和标题组件
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/dataZoom'

import MulDropDwon from 'components/MulDropDown'     //首页厂商选择控件


import TaskType from '../enum/TaskType'
import RelativeAnlay from '../modules/case/anlay'
import AddPop from '../modules/case/addPop'
import {waitingHandleSite,BODY_RESIZE,Trigger_RESIZE,getDictTables,SiteDetail,GetFirm,GetFirmList,ExportFirmList,
        SiteHisPercentage,GetFirmCollColumn,GetFirmCollLine,GetFirmDeviceExport,GetFirmSiteExport,
        FirmDetectHistory,FirmDetectYesterday,FirmDetectColl,firmDetectRange} from '../store/mutation-types'
export default {
  name: 'firmPage',
  components:{
      Scroll,
      PlaceSearch,
      cSelect,
      MulDropDwon
    },

  data () {
    return {
        blnLoading:false,                //加载中标识
        pageNum:0,                      //当前页号（0开始计数）
        viewTable:"statistics",                //列表和统计相互切换的标识
        dict_tables:{},                 //字典信息集合
        taskType:TaskType,
        firms:[],            //所有厂商数据
        selectTime:[{name:'近一周',val:'week'},{name:'近一月',val:'month'}],      //时间选择
        selectType:[{name:'场所在线率',val:'site'},{name:'设备在线率',val:'device'}],      //时间选择
        Selfirms:[],         //列表中的控件选中的厂商
        sitefirms:[],         //统计页中场所在线率的厂商控件选中的厂商
        devicefirms:[],         //统计页中设备在线率的厂商控件选中的厂商
        elWidth:0,
        elHeight:0,
        changeSiteChart:"bar",       //场所在离线条形图与折线图切换标识
        changeDeviceChart:"bar",       //设备在离线条形图与折线图切换标识
        myDealChart:"",           //在线率较低的厂商饼图
        siteOnOffBarChart:"",     //场所在线率柱状图
        siteOnOffLineChart:"",     //场所在线率折线图
        deviceOnOffBarChart:"",     //场所在线率柱状图
        deviceOnOffLineChart:"",     //场所在线率折线图        
        siteSelect:{           //场所在线率提交数据
            coll_type:"week",
            region_range:[],
            security_software_orgcodes:"",
        },
        timeBar:[],             //采集详情的时间控件
        myBarChart:"",
        deviceSelect:{           //设备在线率提交数据
            coll_type:"week",
            region_range:[],
            security_software_orgcodes:"",
            type:"device",
            microprobe_type:"",
        },
        blnShowStatus:false,
        bodyClickId:-1,
        blnSearch:false,
        query:{
            limit:20,//每页10条
            skip:0,//跳过0条
            security_software_orgcode:'',//厂商编码
            security_software_orgname:'',//厂商名称
        },
        data:[
        ],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() >Date.now()+1000*60*60*24 - 8.64e7; //默认只能选择今天及今天以前的日期
          }
        },
        listBodyH:0,
        blnExport:false,//是否进入导出选择阶段,
        selIds:[],//选中项的IDS
        exportDataing:false,
    }
  },
  mounted(){
    this.bodyClickId=tool.SingleBind('mousedown',$('body'),()=>{
       this.blnShowStatus=false;
    });
   // this.elWidth=$(this.$el).width();
   // this.elHeight=$(this.$el).height();
    //console.log(this.elWidth,this.elHeight);

    this.refreshPage();
    // this.getSiteOnBarData();        // 获取场所在线柱状图数据
    this.getDeviceOnBarData();        // 获取设备在线柱状图数据
    this.getDetectRange();            //获取厂商采集详情
    // this.getDealData();            //获取在线率较低的厂商
    // this.getSiteOnlineData();        // 获取场所在线折线图数据
    this.getDeviceOnlineData();        // 获取设备在线折线图数据      

    this.layout();
    this.$store.commit(BODY_RESIZE,()=>{
        this.layout();
        if(this.myDealChart){
            setTimeout(()=>{
                this.myDealChart.resize(); 
            })                          
        };
        if(this.myBarChart){
            setTimeout(()=>{
                this.myBarChart.resize();
            })                                                      
        };
        if(this.deviceOnOffBarChart){
            setTimeout(()=>{
                this.deviceOnOffBarChart.resize(); 
            })                                                    
        } ;        
        if(this.deviceOnOffLineChart){
            setTimeout(()=>{
                this.deviceOnOffLineChart.resize();
            })                                                     
        }                 
    });



  },
  computed:{
      showData(){
          return _.map(this.data,r=>{
                return {
                    security_software_orgcode:r.security_software_orgcode,
                    security_software_orgname:r.security_software_orgname,
                    security_software_address:r.security_software_address,
                    total_detect_num:r.total_detect_num,
                    //security_software_site_status:r.site_online_num+'/'+r.site_abnormal_num+'/'+r.site_offline_num,
                    security_software_site_status:"<span style='color:green'>"+ r.site_online_num+"</span>/<span style='color:red'>"+r.site_abnormal_num+"</span>/<span style='color:#000'>"+r.site_offline_num+"</span>",

                    site_online_pre:(r.site_online_pre*100).toFixed(2) +"%",
                    site_detect_num:r.site_detect_num,
                    site_contribution:(r.site_contribution*100).toFixed(2)+"%",
                    //security_software_equip_status:r.equip_online_num+'/'+r.equip_abnormal_num+'/'+r.equip_offline_num,      
                    security_software_equip_status:"<span style='color:green'>"+ r.equip_online_num+"</span>/<span style='color:red'>"+r.equip_abnormal_num+"</span>/<span style='color:#000'>"+r.equip_offline_num+"</span>",
                    equipment_online_pre:(r.equipment_online_pre*100).toFixed(2) + "%",
                    equip_detect_num:r.equip_detect_num,
                    equip_contribution:(r.equip_contribution*100).toFixed(2)+"%"              

                    //"<span style='color:green'>"+ r.online_device+"</span>/<span style='color:red'>"+r.abnormal_device+"</span>/<span style='color:#000'>"+r.offline_device+"</span>"

                }
            });
      },
      blnAllSel(){
        let s=this,res=true;
        for(let i=0;i<s.data.length;i++){
            if(_.findIndex(this.selIds,id=>id==s.data[i].security_software_orgcode)<0){
                res=false;break;
            }
        }
        return res;
      }
  },
  destroyed(){
    tool.ClearBind(this.bodyClickId)
  },
  watch:{
      timeBar(){
          /*if(!this.timeBar){
            this.timeBar=Date.now()
          }*/
        this.getDetectRange();
      },
    Selfirms(){
       this.query.security_software_orgcodes=_.map(this.Selfirms,s=>s.code).join(',');
    },
    // sitefirms(){
    //    this.siteSelect.security_software_orgcodes=_.map(this.sitefirms,s=>s.code).join(',');
    //     this.getSiteOnBarData();        // 获取场所在线柱状图数据
    //     this.getSiteOnlineData();        // 获取场所在线折线图数据
    // },
    devicefirms(){
       this.deviceSelect.security_software_orgcodes=_.map(this.devicefirms,s=>s.code).join(',');
        this.getDeviceOnBarData();        // 获取设备在线柱状图数据
        this.getDeviceOnlineData();        // 获取设备在线折线图数据 
    },
    // siteSelect:{
    //     handler(val, oldVal){
    //         this.getSiteOnBarData();        // 获取场所在线柱状图数据
    //         this.getSiteOnlineData();        // 获取场所在线折线图数据
    //     },
    //     deep: true    
    // },
    deviceSelect:{
        handler(val, oldVal){
            this.getDeviceOnBarData();        // 获取设备在线柱状图数据
            this.getDeviceOnlineData();        // 获取设备在线折线图数据     
        },
        deep: true    
    },
    viewTable(){
        if(this.viewTable=="statistics"){
            // if(this.siteOnOffBarChart){
            //     setTimeout(()=>{
            //         this.siteOnOffBarChart.resize(); 
            //     })                          
            // };
            if(this.siteOnOffLineChart){
                setTimeout(()=>{
                    this.siteOnOffLineChart.resize();
                })                                                      
            };
            if(this.deviceOnOffBarChart){
                setTimeout(()=>{
                    this.deviceOnOffBarChart.resize(); 
                })                                                    
            } ;        
            if(this.deviceOnOffLineChart){
                setTimeout(()=>{
                    this.deviceOnOffLineChart.resize();
                })                                                     
            }                   
        }
    },
    changeSiteChart(){
            if(this.siteOnOffBarChart){
                setTimeout(()=>{
                    this.siteOnOffBarChart.resize(); 
                })                          
            };
            if(this.siteOnOffLineChart){
                setTimeout(()=>{
                    this.siteOnOffLineChart.resize();
                })                                                      
            };
    },
    changeDeviceChart(){
            if(this.deviceOnOffBarChart){
                setTimeout(()=>{
                    this.deviceOnOffBarChart.resize(); 
                })                                                    
            } ;        
            if(this.deviceOnOffLineChart){
                setTimeout(()=>{
                    this.deviceOnOffLineChart.resize();
                })                                                     
            }  
    },
    blnExport(){
        this.selIds=[];
    } 



  },
  methods:{
      //刷新页面
      refreshPage(){
          this.loadData();
      },
      //加载数据
      loadData(){
        //加载时先清空数据在加载等待动画，请求完后数据加载
        if(this.data){
          this.data=[];
          this.blnLoading=true;
        }          
        this.$store.dispatch(GetFirmList,this.query).then(res=>{
           if(res.msg.code!='successed')return;
           this.data=res.biz_body;
            this.blnLoading=false; 
        });        
        //获取厂商下拉框数据
        this.$store.dispatch(GetFirm).then(res=>{
            if(!tool.msg(res,'','获取厂商数据失败!'))return;
            this.firms=res.biz_body;
        });
        //获取数据来源（下拉框序列化）
        this.$store.dispatch(getDictTables).then(res=>{
            if(res.msg.code!='successed')return;
            this.dict_tables= res.biz_body;
            this.query.microprobe_type=["120"];
        })      
      },
      layout(){
        let optionH=$(this.$el).find('div[name="listOption"]').height();
        this.listBodyH=`calc(100% - 40px - 50px - 20px - ${optionH}px)`;
        this.$nextTick(()=>{
            this.$refs.indList.reloadyScroll();
        });
      },
      //列表和统计相互切换  
      switchView(type){
        if(type==this.viewTable) return;
        this.viewTable=type;
        //处理多滚动条页面来回切换的bug
        if(type=="list"){
            this.$nextTick(()=>{
                this.layout();
            });
        }

        this.$store.commit(Trigger_RESIZE);
      },
      //简单的时间戳转化（仅用于当前页面）
      changeTimeFun(val){
        let time=new Date(val).getFullYear()+'-';
        let timeMonth=parseInt((new Date(val).getMonth()+1))<10 ? '0'+(new Date(val).getMonth()+1):(new Date(val).getMonth()+1);
        let timeDay=parseInt(new Date(val).getDate())<10 ? '0'+new Date(val).getDate():new Date(val).getDate();
        time+=timeMonth+'-'+timeDay;
        return time;
      },
      //获取采集详情   
      getDetectRange(){
        let beginTime,endTime;

        if(this.timeBar[0]){
            beginTime=this.changeTimeFun(this.timeBar[0]);
            endTime=this.changeTimeFun(this.timeBar[1]);            
        }else{
            let curDate=new Date();
            curDate.setDate(curDate.getDate()-6);//默认显示7天内的数据

            beginTime=this.changeTimeFun(curDate);
            endTime=this.changeTimeFun(Date.now()); 
            this.timeBar=[curDate,new Date()];             
        }

        this.$store.dispatch(firmDetectRange,{begin_time:beginTime,end_time:endTime}).then(res=>{
           if(res.msg.code!='successed')return;
            this.loadBarChart(res.biz_body);
        });
      },  
      //获取在线率较低的厂商 （饼图）
      getDealData(){
         this.$store.dispatch(waitingHandleSite).then(res=>{
           if(res.msg.code!='successed')return;
           this.loadDealChart(res.biz_body);
         });
      },    
      //加载扇形图(饼图)，待处理场所
      loadDealChart(data){
        let myaPieChart=$(this.$el).find('div[name="deal_chart_container"]')[0]
        this.myDealChart = echarts.init(myaPieChart);
        let allNum=data.urgent+data.serious+data.general+data.normal;
        if(!data.micprotype_120){
            data.micprotype_120={
                general:0,
                urgent:0,
                serious:0,
                normal:0
            }
        }
        if(!data.micprotype_145){
            data.micprotype_145={
                general:0,
                urgent:0,
                serious:0,
                normal:0
            }
        }
        if(!data.micprotype_123){
            data.micprotype_123={
                general:0,
                urgent:0,
                serious:0,
                normal:0
            }
        }
        if(!data.micprotype_146){
            data.micprotype_146={
                general:0,
                urgent:0,
                serious:0,
                normal:0
            }
        }

        let urgentNum="网吧："+data.micprotype_120.urgent+' ( '+(data.micprotype_120.urgent/allNum*100).toFixed(2)+'% )<br>WIFI：'+data.micprotype_145.urgent+' ( '+(data.micprotype_145.urgent/allNum*100).toFixed(2)+'% )<br>非经：'+data.micprotype_123.urgent+' ( '+(data.micprotype_123.urgent/allNum*100).toFixed(2)+'% )<br>特征：'+data.micprotype_146.urgent+' ( '+(data.micprotype_146.urgent/allNum*100).toFixed(2)+'% )';
        let seriousNum="网吧："+data.micprotype_120.serious+' ( '+(data.micprotype_120.serious/allNum*100).toFixed(2)+'% )<br>WIFI：'+data.micprotype_145.serious+' ( '+(data.micprotype_145.serious/allNum*100).toFixed(2)+'% )<br>非经：'+data.micprotype_123.serious+' ( '+(data.micprotype_123.serious/allNum*100).toFixed(2)+'% )<br>特征：'+data.micprotype_146.serious+' ( '+(data.micprotype_146.serious/allNum*100).toFixed(2)+'% )';
        let generaNum="网吧："+data.micprotype_120.general+' ( '+(data.micprotype_120.general/allNum*100).toFixed(2)+'% )<br>WIFI：'+data.micprotype_145.general+' ( '+(data.micprotype_145.general/allNum*100).toFixed(2)+'% )<br>非经：'+data.micprotype_123.general+' ( '+(data.micprotype_123.general/allNum*100).toFixed(2)+'% )<br>特征：'+data.micprotype_146.general+' ( '+(data.micprotype_146.general/allNum*100).toFixed(2)+'% )';
        let normalNum="网吧："+data.micprotype_120.normal+' ( '+(data.micprotype_120.normal/allNum*100).toFixed(2)+'% )<br>WIFI：'+data.micprotype_145.normal+' ( '+(data.micprotype_145.normal/allNum*100).toFixed(2)+'% )<br>非经：'+data.micprotype_123.normal+' ( '+(data.micprotype_123.normal/allNum*100).toFixed(2)+'% )<br>特征：'+data.micprotype_146.normal+' ( '+(data.micprotype_146.normal/allNum*100).toFixed(2)+'% )';
        var option = {
            title: {
                text: '在线率较低的厂商',
                x : 50, 
                y :30, 
                textStyle: {  
                    fontSize: 15,
                    fontWeight:200,
                }, 
            },
            tooltip: {
                trigger: 'item',
                // formatter:function(param){
                //     let str=param.name+'需处理<br>总量：'+param.value+' ( '+param.percent+'% )<br>';
                //     if(allNum!=0){                        
                //         if(param.name=='紧急'){
                //             str+=urgentNum;
                //         }else if(param.name=='严重'){
                //             str+=seriousNum;
                //         }else if(param.name=='一般'){
                //             str+=generaNum;
                //         }else{
                //             str+=abnormalsNum;
                //         }
                //     }
                //     return str;
                // }
            },
            legend: {
                orient : 'vertical',  
                x : 50,  
                y : 80,
                itemHeight:20,
                padding:[20,5,20,5],
                textStyle: {  
                    fontSize: 13,
                }, 
                data:['紧急','严重','一般','无影响']  
            },
            series: [{
                name: '',
                type: 'pie',
                radius:"76%",
                center: ['65%','55%'],
                data: [
                    {
                        name: '紧急', 
                        value: data.urgent,
                        itemStyle:{
                            normal:{
                                //color:'#85C226',
                                label : {
                                    show : true,
                                    position:'inner', //标签的位置
                                textStyle : {
                                    fontWeight : 300 ,
                                    fontSize : 12    //文字的字体大小
                                },
                                formatter:'{d}%'
                                },
                            }
                        }
                    },{
                        name: '严重', 
                        value: data.serious,
                        itemStyle:{
                            normal:{
                                //color:'#F8C301',
                                label : {
                                    show : true,
                                    position:'inner', //标签的位置
                                    textStyle : {
                                        fontWeight : 300 ,
                                        fontSize : 12    //文字的字体大小
                                    },
                                formatter:'{d}%'
                                },
                            }
                        }
                    },{
                        name: '一般', 
                        value: data.general,
                        itemStyle:{
                            normal:{
                                //color:'#F8C301',
                                label : {
                                    show : true,
                                    position:'inner', //标签的位置
                                    textStyle : {
                                        fontWeight : 300 ,
                                        fontSize : 12    //文字的字体大小
                                    },
                                formatter:'{d}%'
                                },
                            }
                        }
                    },{
                        name: '无影响', 
                        value: data.normal,
                        itemStyle:{
                            normal:{
                                //color:'#728498',
                                label : {
                                    show : true,
                                    position:'inner', //标签的位置
                                textStyle : {
                                    fontWeight : 300 ,
                                    fontSize : 12    //文字的字体大小
                                }, 
                                formatter:'{d}%'
                                },
                            }
                        }
                    },
                ]
            }]
        };
        this.myDealChart.setOption(option);
         setTimeout(()=>{
             this.myDealChart.resize();
         })
        
      },        
      //加载柱状图 采集详情   
      loadBarChart(data){
        let barObject={     //将所有的数据归类到该对象中
            FirmName:[],  // 厂商名
            num: [], // 采集总量
            site_per: [], // 场所占全部场所比例
            qq: [], // qq采集量
            wechat: [],//微信采集量
            taobao:[],//淘宝采集量
            otherVir: [],//其他虚拟身份
            identity: [],//真实身份
            im: [],//即时通信
            others: [] // 其他数据
        }
        for(let any of data){
           barObject.FirmName.push(any.security_software_orgname)  //所有厂商名称
           barObject.num.push(any.total.num)  //所有的厂商单个采集总量
           barObject.site_per.push(any.total.site_per)  
           barObject.qq.push(any.range.qq)  
           barObject.wechat.push(any.range.wechat) 
           barObject.taobao.push(any.range.taobao)  
           barObject.otherVir.push(any.range.otherVir)  
           barObject.identity.push(any.range.identity)  
           barObject.im.push(any.range.im) 
           barObject.others.push(any.range.others)  
        }
        let myaBarChart=$(this.$el).find('div[name="bar_chart_container"]')[0]
        this.myBarChart = echarts.init(myaBarChart);
        option = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                textStyle:{
                   align:'left'
                },
                formatter:function(param){
                     let indexNo=parseInt(param[0].dataIndex);
                     let str= barObject.FirmName[indexNo]+'<br/>采集总量：'+barObject.num[indexNo]+'条<br/>场所占比：'+(barObject.site_per[indexNo]*100).toFixed(2)+'%<br/>';
                     str +='QQ:'+barObject.qq[indexNo]+'条<br/>微信：'+barObject.wechat[indexNo]+'条<br/>其他虚拟身份：'+barObject.otherVir[indexNo]+'条<br/>';
                     str +='真实身份:'+barObject.identity[indexNo]+'条<br/>即时通信：'+barObject.im[indexNo]+'条<br/>其他数据：'+barObject.others[indexNo]+'条<br/>';
                     return str;
                } ,
            },
            dataZoom: [
                {
                    type: 'slider',
                    show: true,
                    yAxisIndex:0,   
                    zoomLock:false, 
                    start: 40,
                    end: 100
                },
            ],
            legend: {
                data: ['qq采集量', '微信采集量','淘宝采集量','其他虚拟身份','真实身份','即时通信','其他数据']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01],
                splitLine:{
                    show:false
                },
                axisLine:{
                    lineStyle:{
                        //color:'#C9C9C9',
                       // width:8,
                    }                    
                }
            },
            yAxis: {
                type: 'category',
                data: barObject.FirmName,
                splitLine:{
                    show:false
                },
                axisTick: {
                    show: false
                },
                axisLine:{
                    lineStyle:{

                    }                    
                }
            },
            series: [
                {
                    name: 'qq采集量',
                    type: 'bar',
                    stack: '采集量',
                    label: {
                        normal: {
                            show: false,
                            position: 'insideRight'
                        }
                    },
                    data: barObject.qq
                },{
                    name: '微信采集量',
                    type: 'bar',
                    stack: '采集量',
                    label: {
                        normal: {
                            show: false,
                            position: 'insideRight'
                        }
                    },
                    data: barObject.wechat
                },{
                    name: '淘宝采集量',
                    type: 'bar',
                    stack: '采集量',
                    label: {
                        normal: {
                            show: false,
                            position: 'insideRight'
                        }
                    },
                    data: barObject.taobao
                }, {
                    name: '其他虚拟身份',
                    type: 'bar',
                    stack: '采集量',
                    label: {
                        normal: {
                            show: false,
                            position: 'insideRight'
                        }
                    },
                    data: barObject.otherVir
                }, {
                    name: '真实身份',
                    type: 'bar',
                    stack: '采集量',
                    label: {
                        normal: {
                            show: false,
                            position: 'insideRight'
                        }
                    },
                    data: barObject.identity
                },{
                    name: '即时通信',
                    type: 'bar',
                    stack: '采集量',
                    label: {
                        normal: {
                            show: false,
                            position: 'insideRight'
                        }
                    },
                    data: barObject.im
                },{
                    name: '其他数据',
                    type: 'bar',
                    stack: '采集量',
                    label: {
                        normal: {
                            show: false,
                            position: 'insideRight'
                        }
                    },
                    data: barObject.others
                }               
            ]
        };
        this.myBarChart.setOption(option);
        setTimeout(()=>{
              this.myBarChart.resize();   
         })

      },


      //场所在线率切换柱状图和条形图
      changesiteChartSty(val){
         if(val==this.changeSiteChart) return;
         this.changeSiteChart = val;
      },
      //设备在线率切换柱状图和条形图
      changeDeviceChartSty(val){
         if(val==this.changeDeviceChart) return;
         this.changeDeviceChart = val;
      },
      //这个是场所在线率的区域范围数据，区域范围的事件回传，第一个参数为上下文环境，第二个参数为具体值,因为该页面为单独定制没有上下文，因此取第二个值即可 
      selectAreaSite(val,data){
        if(data){
            this.siteSelect.region_range=data.regions;
        }else{
            this.siteSelect.region_range="";
        }
      },
      //这个是设备在线率的区域范围数据，区域范围的事件回传，第一个参数为上下文环境，第二个参数为具体值,因为该页面为单独定制没有上下文，因此取第二个值即可 
      selectAreaDevice(val,data){
        if(data){
            this.deviceSelect.region_range=data.regions;
        }else{
            this.deviceSelect.region_range="";
        }
      },
      //是否包含选中项
      isHasSelItem(data,code){
        return  _.find(data,d=>d.code==code);
      },
      //   处理厂商管理控件的方法
      firmClick(type,d){
          let index=-1;
          switch(type){
              case "list":
                index=_.findIndex(this.Selfirms,t=>t.code==d.code);
                if(index>=0){this.Selfirms.splice(index,1); return;}
                this.Selfirms.push(d);
                break;
              case "site":           
                index=_.findIndex(this.sitefirms,t=>t.code==d.code);
                if(index>=0){this.sitefirms.splice(index,1); return;}
                this.sitefirms.push(d);
                break;
              case "device":           
                index=_.findIndex(this.devicefirms,t=>t.code==d.code);
                if(index>=0){this.devicefirms.splice(index,1);return;}
                this.devicefirms.push(d);
                break;              
          }
        },

      // 获取场所在线柱状图数据
      getSiteOnBarData(){
         this.$store.dispatch(GetFirmCollColumn,this.siteSelect).then(res=>{
           if(res.msg.code!='successed')return;
           this.addSiteBarChart(res.biz_body);


         })
      },
      // 获取设备在线柱状图数据
      getDeviceOnBarData(){
         this.$store.dispatch(GetFirmCollColumn,this.deviceSelect).then(res=>{
           if(res.msg.code!='successed')return;
           this.addDeviceBarChart(res.biz_body);
         })
      },
      // 获取场所在线折线图图数据
      getSiteOnlineData(){
         this.$store.dispatch(GetFirmCollLine,this.siteSelect).then(res=>{
           if(res.msg.code!='successed')return;
           this.addSiteLineChart(res.biz_body);
         })
      },
      // 获取设备在线折线图图数据
      getDeviceOnlineData(){
         this.$store.dispatch(GetFirmCollLine,this.deviceSelect).then(res=>{
           if(res.msg.code!='successed')return;
           this.addDeviceLineChart(res.biz_body);
         })
      },
    
    //加载场所在离线折线图
     addSiteLineChart(data){
        let offlineLineChart=$(this.$el).find('div[name="site_line_chart_container"]')[0]
        this.siteOnOffLineChart = echarts.init(offlineLineChart);
        let time=[],allData=[],firmNames=[];
        for(let i=0;i<data[0].orgs.length;i++){
            firmNames.push(data[0].orgs[i].security_software_orgname);           //获取所有厂商名
            allData.push({
                name: data[0].orgs[i].security_software_orgname,
                type: 'line',
                data: [],
                itemStyle: {
                    normal: {
                        label: {
                            formatter: '{c}%'
                        }
                    }
                }                
            })
        }

        for(let i=0;i<data.length;i++){
            time.push(data[i].stat_date.substr (0,4)+"-"+data[i].stat_date.substr (4,2)+"-"+data[i].stat_date.substr (6,2));
            for(let j=0;j<data[i].orgs.length;j++){
                allData[j].data.push((data[i].orgs[j].netbar_online_pre*100).toFixed(2))
            }
        }
        let  option = {
                tooltip: {
                    trigger: 'axis',
                    formatter:function(param){
                        let str='';
                        _.each(param,p=>{
                            str+=`${p.seriesName}:${p.data}%<br>`
                        });
                        return str;
                    }
                },
                legend: {
                    orient : 'horizontal',  
                    // x : 50,  
                    // y : 80,
                    // itemHeight:20,
                    // padding:[20,5,20,5],
                    textStyle: {  
                        fontSize: 13,
                    }, 
                    data:firmNames  
                },
                grid:{	//设置图标上面和下面的距离
                    left: 80,
                    right: 50,
                    //y:20
                },
                xAxis:  {
                    type: 'category',
                    boundaryGap: false,
                    data: time,
                    axisLabel:{  
                        interval:0,  
                        rotate:45,//倾斜度 -90 至 90 默认为0  
                        margin:2,  
                        textStyle:{  
                            color:"#000000"  
                        }  
                    },               
                },
                yAxis: {
                    type: 'value',     
                    name: '在线率',               
                    xisLabel: {
                        formatter: '{value} %'
                    },
                    axisLabel: {
                        formatter: '{value} %'
                    },
                    axisPointer: {
                        snap: true
                    }
                },
                series:allData
            };
        
            this.siteOnOffLineChart.setOption(option);
     },
    //  加载场所在离线柱状图
    addSiteBarChart(data){
        let offlineLineChart=$(this.$el).find('div[name="site_bar_chart_container"]')[0]
        this.siteOnOffBarChart = echarts.init(offlineLineChart);
        let xAxisdata=[],inLineData=[],offLineData=[],abnormalsData=[],led=null;

        for(let i=0;i<data.length;i++){
            xAxisdata.push(data[i].security_software_orgname);
            inLineData.push(data[i].netbar_online)
            offLineData.push(data[i].netbar_offline)
            abnormalsData.push(data[i].netbar_abnormal)
        }
        if(data.length>8){
            led=$(window).width()>1500?(data[8].security_software_orgname || data[data.length-1].security_software_orgname) : (data[5].security_software_orgname || data[data.length-1].security_software_orgname)
        }else{
            led=null
        }
        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    label: {
                        show: true
                    }
                }
            },
            legend: {
                orient : 'horizontal',  
                textStyle: {  
                        fontSize: 13,
                }, 
                data:['在线数','异常数','离线数']  
            },
            grid:{	//设置图标上面和下面的距离
                left: 70,
                right: 70,
                //y:20
            },                     
            xAxis: {
                type: 'category',
                data: xAxisdata,
                axisLabel:{  
                    interval:0,//横轴信息全部显示  
                    //rotate:-30,//-30度角倾斜显示  
                }                 
            },
            yAxis: {
                type: 'value'
            },
            dataZoom: [{
                startValue: data[0].security_software_orgname,
               // endValue:$(window).width()>1500?data[8].security_software_orgname || data[data.length-1].security_software_orgname:data[5].security_software_orgname || data[data.length-1].security_software_orgname
                endValue:led,
            }, {
                type: 'inside'
            }],
            series: [{
                name:"在线数",
                itemStyle: {
                    normal: {
                        color:'#42ABDF'
                    }
                },
                data: inLineData,
                type: 'bar'
            },
            {
                name:"异常数",
                itemStyle: {
                    normal: {
                        color:'#93C24A'
                    }
                },                
                data: abnormalsData,
                type: 'bar'
            },
            {
                name:"离线数",
                itemStyle: {
                    normal: {
                        color:'#DFC22E'
                    }
                },                
                data: offLineData,
                type: 'bar'
            },
            ]
        };
        this.siteOnOffBarChart.setOption(option);
    },
      //导出统计场所状态率
    ExportSiteCount(){
        this.$store.dispatch(GetFirmSiteExport,this.siteSelect).then(res=>{
            if(!tool.msg(res,'','导出失败!'))return;
            window.location=res.biz_body.url;
        });
    },

    //加载设备在离线折线图
     addDeviceLineChart(data){
        let offlineLineChart=$(this.$el).find('div[name="device_line_chart_container"]')[0]
        this.deviceOnOffLineChart = echarts.init(offlineLineChart);
        let time=[],allData=[],firmNames=[];
        for(let i=0;i<data[0].orgs.length;i++){
            firmNames.push(data[0].orgs[i].security_software_orgname);           //获取所有厂商名
            allData.push({
                name: data[0].orgs[i].security_software_orgname,
                type: 'line',
                data: [],
                itemStyle: {
                    normal: {
                        label: {
                            formatter: '{c}%'
                        }
                    }
                }                
            })
        }
        for(let i=0;i<data.length;i++){
            time.push(data[i].stat_date.substr (0,4)+"-"+data[i].stat_date.substr (4,2)+"-"+data[i].stat_date.substr (6,2));
            for(let j=0;j<data[i].orgs.length;j++){
                // 判断是加载场所还是加载设备
                if(this.deviceSelect.type=='device'){
                    allData[j].data.push((data[i].orgs[j].equip_online_pre*100).toFixed(2))
                }else{
                     allData[j].data.push((data[i].orgs[j].netbar_online_pre*100).toFixed(2))
                }
                
            }
        }
        let  option = {
                tooltip: {
                    trigger: 'axis',
                    formatter:function(param){
                        let str='';
                        _.each(param,p=>{
                            str+=`${p.seriesName}:${p.data}%<br>`
                        });
                        return str;
                    }
                },
                legend: {
                    orient : 'horizontal',  
                    textStyle: {  
                        fontSize: 13,
                    }, 
                    data:firmNames  
                },
                grid:{	//设置图标上面和下面的距离
                    left: 80,
                    right: 50,
                    //y:20
                },
                xAxis:  {
                    type: 'category',
                    boundaryGap: false,
                    data: time,
                    axisLabel:{  
                        interval:0,  
                        rotate:45,//倾斜度 -90 至 90 默认为0  
                        margin:2,  
                        textStyle:{  
                            color:"#000000"  
                        }  
                    },               
                },
                yAxis: {
                    type: 'value',     
                    name: '在线率',               
                    xisLabel: {
                        formatter: '{value} %'
                    },
                    axisLabel: {
                        formatter: '{value} %'
                    },
                    axisPointer: {
                        snap: true
                    }
                },
                series:allData
            };
        
            this.deviceOnOffLineChart.setOption(option);
     },
    //加载设备在离线柱状图
    addDeviceBarChart(data){
        let offlineLineChart=$(this.$el).find('div[name="device_bar_chart_container"]')[0]
        this.deviceOnOffBarChart = echarts.init(offlineLineChart);
        let xAxisdata=[],inLineData=[],offLineData=[],abnormalsData=[],led=null;
        let tipOnline=[],tipOffline=[],tipAbnormals=[],typeName='';
        let typeIco=this.deviceSelect.type;

        if(typeIco=="device"){     
            typeName="设备";         
            //console.log(data);
            for(let i=0;i<data.length;i++){
                xAxisdata.push(data[i].security_software_orgname);
                inLineData.push(data[i].equip_online)
                offLineData.push(data[i].equip_offline)
                abnormalsData.push(data[i].equip_abnormal);
                // 如果为空则不显示
                tipOnline[i]=(data[i].equip_online_pre*100).toFixed(2)+'% )<br>';
                let newAnyOne=!data[i].micprotype_120 ?'' : '网吧：'+data[i].micprotype_120.equip_online+'( '+(data[i].micprotype_120.equip_online_pre*100).toFixed(2)+'% )<br>';
                let newAnyTwo=!data[i].micprotype_145 ?'' : 'WIFI：'+data[i].micprotype_145.equip_online+'( '+(data[i].micprotype_145.equip_online_pre*100).toFixed(2)+'% )<br>';
                let newAnyThree=!data[i].micprotype_123 ?'' : '非经：'+data[i].micprotype_123.equip_online+'( '+(data[i].micprotype_123.equip_online_pre*100).toFixed(2)+'% )<br>';
                let newAnyFour=!data[i].micprotype_146 ?'' : '特征：'+data[i].micprotype_146.equip_online+'( '+(data[i].micprotype_146.equip_online_pre*100).toFixed(2)+'% )<br>';
                tipOnline[i] +=newAnyOne+newAnyTwo+newAnyThree+newAnyFour;
               
                tipOffline[i]=(data[i].equip_offline_pre*100).toFixed(2)+'% )<br>';
                let newAnyOffOne=!data[i].micprotype_120 ?'' : '网吧：'+data[i].micprotype_120.equip_offline+'( '+(data[i].micprotype_120.equip_offline_pre*100).toFixed(2)+'% )<br>';
                let newAnyOffTwo=!data[i].micprotype_145 ?'' : 'WIFI：'+data[i].micprotype_145.equip_offline+'( '+(data[i].micprotype_145.equip_offline_pre*100).toFixed(2)+'% )<br>';
                let newAnyOffThree=!data[i].micprotype_123 ?'' : '非经：'+data[i].micprotype_123.equip_offline+'( '+(data[i].micprotype_123.equip_offline_pre*100).toFixed(2)+'% )<br>';
                let newAnyOffFour=!data[i].micprotype_146 ?'' : '特征：'+data[i].micprotype_146.equip_offline+'( '+(data[i].micprotype_146.equip_offline_pre*100).toFixed(2)+'% )<br>';
                tipOffline[i] +=newAnyOffOne + newAnyOffTwo + newAnyOffThree + newAnyOffFour;
   
                tipAbnormals[i]=(data[i].equip_abnormal_pre*100).toFixed(2)+'% )<br>';
                let newAnyAbsOne=!data[i].micprotype_120 ?'' : '网吧：'+data[i].micprotype_120.equip_abnormal+'( '+(data[i].micprotype_120.equip_abnormal_pre*100).toFixed(2)+'% )<br>';
                let newAnyAbsTwo=!data[i].micprotype_145 ?'' : 'WIFI：'+data[i].micprotype_145.equip_abnormal+'( '+(data[i].micprotype_145.equip_abnormal_pre*100).toFixed(2)+'% )<br>';
                let newAnyAbsThree=!data[i].micprotype_123 ?'' : '非经：'+data[i].micprotype_123.equip_abnormal+'( '+(data[i].micprotype_123.equip_abnormal_pre*100).toFixed(2)+'% )<br>';
                let newAnyAbsFour=!data[i].micprotype_146 ?'' : '特征：'+data[i].micprotype_146.equip_abnormal+'( '+(data[i].micprotype_146.equip_abnormal_pre*100).toFixed(2)+'% )<br>';
                tipAbnormals[i] +=newAnyAbsOne + newAnyAbsTwo + newAnyAbsThree + newAnyAbsFour;
            }                
        }else{

            typeName="场所";            
            for(let i=0;i<data.length;i++){
                xAxisdata.push(data[i].security_software_orgname);
                inLineData.push(data[i].netbar_online)
                offLineData.push(data[i].netbar_offline)
                abnormalsData.push(data[i].netbar_abnormal);

                tipOnline[i]=(data[i].netbar_online_pre*100).toFixed(2)+'% )<br>';
                let newAnyOne=!data[i].micprotype_120 ?'' : '网吧：'+data[i].micprotype_120.netbar_online+'( '+(data[i].micprotype_120.netbar_online_pre*100).toFixed(2)+'% )<br>';
                let newAnyTwo=!data[i].micprotype_145 ?'' : 'WIFI：'+data[i].micprotype_145.netbar_online+'( '+(data[i].micprotype_145.netbar_online_pre*100).toFixed(2)+'% )<br>';
                let newAnyThree=!data[i].micprotype_123 ?'' : '非经：'+data[i].micprotype_123.netbar_online+'( '+(data[i].micprotype_123.netbar_online_pre*100).toFixed(2)+'% )<br>';
                let newAnyFour=!data[i].micprotype_146 ?'' : '特征：'+data[i].micprotype_146.netbar_online+'( '+(data[i].micprotype_146.netbar_online_pre*100).toFixed(2)+'% )<br>';
                tipOnline[i] +=newAnyOne+newAnyTwo+newAnyThree+newAnyFour;
               
                tipOffline[i]=(data[i].netbar_offline_pre*100).toFixed(2)+'% )<br>';
                let newAnyOffOne=!data[i].micprotype_120 ?'' : '网吧：'+data[i].micprotype_120.netbar_offline+'( '+(data[i].micprotype_120.netbar_offline_pre*100).toFixed(2)+'% )<br>';
                let newAnyOffTwo=!data[i].micprotype_145 ?'' : 'WIFI：'+data[i].micprotype_145.netbar_offline+'( '+(data[i].micprotype_145.netbar_offline_pre*100).toFixed(2)+'% )<br>';
                let newAnyOffThree=!data[i].micprotype_123 ?'' : '非经：'+data[i].micprotype_123.netbar_offline+'( '+(data[i].micprotype_123.netbar_offline_pre*100).toFixed(2)+'% )<br>';
                let newAnyOffFour=!data[i].micprotype_146 ?'' : '特征：'+data[i].micprotype_146.netbar_offline+'( '+(data[i].micprotype_146.netbar_offline_pre*100).toFixed(2)+'% )<br>';
                tipOffline[i] +=newAnyOffOne + newAnyOffTwo + newAnyOffThree + newAnyOffFour;
   
                tipAbnormals[i]=(data[i].netbar_abnormal_pre*100).toFixed(2)+'% )<br>';
                let newAnyAbsOne=!data[i].micprotype_120 ?'' : '网吧：'+data[i].micprotype_120.netbar_abnormal+'( '+(data[i].micprotype_120.netbar_abnormal_pre*100).toFixed(2)+'% )<br>';
                let newAnyAbsTwo=!data[i].micprotype_145 ?'' : 'WIFI：'+data[i].micprotype_145.netbar_abnormal+'( '+(data[i].micprotype_145.netbar_abnormal_pre*100).toFixed(2)+'% )<br>';
                let newAnyAbsThree=!data[i].micprotype_123 ?'' : '非经：'+data[i].micprotype_123.netbar_abnormal+'( '+(data[i].micprotype_123.netbar_abnormal_pre*100).toFixed(2)+'% )<br>';
                let newAnyAbsFour=!data[i].micprotype_146 ?'' : '特征：'+data[i].micprotype_146.netbar_abnormal+'( '+(data[i].micprotype_146.netbar_abnormal_pre*100).toFixed(2)+'% )<br>';
                tipAbnormals[i] +=newAnyAbsOne + newAnyAbsTwo + newAnyAbsThree + newAnyAbsFour;


               // tipOnline[i]=(data[i].netbar_online_pre*100).toFixed(2)+'% )<br>网吧：'+data[i].micprotype_120.netbar_online+'( '+(data[i].micprotype_120.netbar_online_pre*100).toFixed(2)+'% )<br>WIFI：'+data[i].micprotype_145.netbar_online+'( '+(data[i].micprotype_145.netbar_online_pre*100).toFixed(2);
               // tipOnline[i]+='% )<br>非经：'+data[i].micprotype_123.netbar_online+'( '+(data[i].micprotype_123.netbar_online_pre*100).toFixed(2)+'% )<br>特征：'+data[i].micprotype_146.netbar_online+'( '+(data[i].micprotype_146.netbar_online_pre*100).toFixed(2)+'% )'
                
                //tipOffline[i]=(data[i].netbar_offline_pre*100).toFixed(2)+'% )<br>网吧：'+data[i].micprotype_120.netbar_offline+'( '+(data[i].micprotype_120.netbar_offline_pre*100).toFixed(2)+'% )<br>WIFI：'+data[i].micprotype_145.netbar_offline+'( '+(data[i].micprotype_145.netbar_offline_pre*100).toFixed(2);
                //tipOffline[i]+='% )<br>非经：'+data[i].micprotype_123.netbar_offline+'( '+(data[i].micprotype_123.netbar_offline_pre*100).toFixed(2)+'% )<br>特征：'+data[i].micprotype_146.netbar_offline+'( '+(data[i].micprotype_146.netbar_offline_pre*100).toFixed(2)+'% )'           
                
                //tipAbnormals[i]=(data[i].netbar_abnormal_pre*100).toFixed(2)+'% )<br>网吧：'+data[i].micprotype_120.netbar_abnormal+'( '+(data[i].micprotype_120.netbar_abnormal_pre*100).toFixed(2)+'% )<br>WIFI：'+data[i].micprotype_145.netbar_abnormal+'( '+(data[i].micprotype_145.netbar_abnormal_pre*100).toFixed(2);
               // tipAbnormals[i]+='% )<br>非经：'+data[i].micprotype_123.netbar_abnormal+'( '+(data[i].micprotype_123.netbar_abnormal_pre*100).toFixed(2)+'% )<br>特征：'+data[i].micprotype_146.netbar_abnormal+'( '+(data[i].micprotype_146.netbar_abnormal_pre*100).toFixed(2)+'% )'
 
            }            
        }

        if(data.length>8){
            led=$(window).width()>1500?(data[8].security_software_orgname || data[data.length-1].security_software_orgname) : (data[5].security_software_orgname || data[data.length-1].security_software_orgname)
        }else{
            led=null
        }
        option = {
            tooltip: {
                trigger: 'item',
                axisPointer: {
                    type: 'shadow',
                    label: {
                        show: true
                    }
                },   
                textStyle:{
                   align:'left'
                }, 
                formatter:function(param){
                    let  str=param.name+'<br>'+typeName+param.seriesName+'<br>总量：'+param.value+"( ";
                    if(param.seriesName=='在线数'){
                        str+=tipOnline[param.dataIndex];
                    }else if(param.seriesName=='离线数'){
                        str+=tipOffline[param.dataIndex];
                    }else{
                        str+=tipAbnormals[param.dataIndex];
                    }
                    return str;
                }                                
            },
            legend: {
                orient : 'horizontal',  
                textStyle: {  
                        fontSize: 13,
                }, 
                data:['在线数','异常数','离线数']  
            },
            grid:{	//设置图标上面和下面的距离
                left: 70,
                right: 70,
                //y:20
            },            
            xAxis: {
                type: 'category',
                data: xAxisdata,
                axisLabel:{  
                    interval:0,//横轴信息全部显示  
                    //rotate:-30,//-30度角倾斜显示  
                }                   
            },
            yAxis: {
                type: 'value'
            },
            dataZoom: [{
                startValue: data[0].security_software_orgname,
              //  endValue:$(window).width()>1500?data[8].security_software_orgname || data[data.length-1].security_software_orgname:data[5].security_software_orgname || data[data.length-1].security_software_orgname
                endValue:led,
            }, {
                type: 'inside'
            }],
            series: [{
                name:"在线数",
                itemStyle: {
                    normal: {
                        color:'#42ABDF'
                    }
                },
                data: inLineData,
                type: 'bar'
            },
            {
                name:"异常数",
                itemStyle: {
                    normal: {
                        color:'#93C24A'
                    }
                },                
                data: abnormalsData,
                type: 'bar'
            },
            {
                name:"离线数",
                itemStyle: {
                    normal: {
                        color:'#DFC22E'
                    }
                },                
                data: offLineData,
                type: 'bar'
            },
            ]
        };
        this.deviceOnOffBarChart.setOption(option);
    },
    //导出统计设备状态率
    ExportDeviceCount(){
        let typeIco=this.deviceSelect.type;
        if(typeIco=="device"){     
            this.$store.dispatch(GetFirmDeviceExport,this.deviceSelect).then(res=>{
                if(!tool.msg(res,'','导出失败!'))return;
                window.location=res.biz_body.url;
            });
        }else{
            this.$store.dispatch(GetFirmSiteExport,this.deviceSelect).then(res=>{
                if(!tool.msg(res,'','导出失败!'))return;
                window.location=res.biz_body.url;
            });
        }
    },



      //查询按钮(搜索)
      query_click(){
          this.data=[];
          this.blnSearch=true;
          this.blnLoading=true;
          this.pageNum= 0;
          this.query.skip=this.pageNum*this.query.limit;
          this.$store.dispatch(GetFirmList,this.query).then(res=>{
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
          this.$store.dispatch(GetFirmList,this.query).then(res=>{              
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
       //删除厂商
      delFirm(data){
        tool.confirm('您确定要删除该厂商吗?',['确定','取消'],()=>{
            this.$store.dispatch(DelCase,d.law_case_id).then(res=>{
                if(!tool.msg(res,'删除成功!','删除失败!'))return;
                //this.data.splice(i,1);
            });
        },function(){});
      },
      editFirm(data){
        let self=this;
        let html=`
                <cInput label="厂商名称" @change="nameChange" :val="sum.name" />
                <cInput label="厂商地址" @change="timeChange" :val="sum.time" />
                <cInput label="联系人" @change="timeChange" :val="sum.people" />
                <cInput label="联系电话" @change="addressChange" :val="sum.address" />
                <div style="margin-top:10px; text-align:right;">
                    <button type="button" class="btn btn-success" style="font-size:12px;"  @click="submit">确定</button> 
                    <button type="button" class="btn btn-default" style="font-size:12px;" @click="cancel">取消</button>
                </div>
            `;
        tool.open(function(){
            let param={
                title:'修改操作',
                area:'600px',
                content:`<div class="caseManagePop" style="width:100%;height:100%;overflow-y:auto;padding:10px;">${html}</div>`,
                components:{cInput},
                context:{
                    sum:{
                        id:"",
                        name:"",
                        time:"",
                        people:"",
                        address:"",                   
                    },
                    nameChange(val){param.selfData.val=val;},
                    timeChange(val){param.selfData.val=val;},
                    addressChange(val){param.selfData.val=val;},
                    submit(){
                        if(!param.selfData.sum.name || !param.selfData.sum.time || !param.selfData.sum.people || !param.selfData.sum.address){
                            tool.info('厂商名称,厂商地址,联系人,联系电话必填!');
                            return;
                        }


                        param.close();
                    },
                    cancel(){
                        param.close();
                    },
                    success(){

                    }
                }
            };

        return param;
        }());     
      },


       //查看详情
        searchFirmDetail(siteId){
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
                        title:'厂商详情',
                        content:html,
                        skin:'firm-detail-container',
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
        // 数据采集趋势
        dataStatus(siteId,name){
             let self=this;            
            tool.open(function(){
                let html=`<div name="container" style="width:100%;height:100%;padding: 10px;">
                            <div class="tit-row">
                                <div class="bar tit-bars" :class="isStateNo=='1'? 'active':''" @click="changeStatus('1')">采集趋势</div>
                                <div class="bar tit-bars" :class="isStateNo=='2'? 'active':''" @click="changeStatus('2')">采集详情</div>
                            </div>
                            <!--加载中标识-->
                            <div v-if="DeviceblnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 10px;font-size: 50px;">
                                <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
                            </div>
                            <div style="width:100%;height:100%;border-top: 1px solid #ccc;" class="data-row" >
                                <div class="tda-ert">
                                    <div class="lefts" v-show="isStateNo=='1'">
                                        <span>昨日采集：{{yesCollect}}</span>
                                        <span>累计采集：{{allCollect}}</span>
                                    </div>
                                    <div class="lefts" style="font-size:18px;margin:0 15px" v-show="isStateNo=='2'">
                                        <div class="el-tooltip item" title="昨日采集详情" :class="chartType=='bar'? 'active':''" @click="yesOrHisFun('bar')">
                                                <div class="el-tooltip__rel" ><i class="fa fa-area-chart"></i></div>
                                        </div>&nbsp; &nbsp;
                                        <div class="el-tooltip item" title="历史采集详情" :class="chartType=='line'? 'active':''" @click="yesOrHisFun('line')">
                                            <div class="el-tooltip__rel"><i class="fa fa-line-chart"></i></div>
                                        </div>
                                    </div>                                    
                                    <div class="rights" v-show="isStateNo=='1'">                                       
                                        <div class="sele-time" @click="changeline('week')" :class="{active: viewTime=='week'}">近一周</div>
                                        <div class="sele-time" @click="changeline('month')" :class="{active: viewTime=='month'}">近一月</div>
                                    </div>
                                    <div class="rights" v-show="isStateNo=='2'&&chartType=='line'">                                       
                                        <div class="sele-time" @click="changelineDetail('week')" :class="{active: viewLineTime=='week'}">近一周</div>
                                        <div class="sele-time" @click="changelineDetail('month')" :class="{active: viewLineTime=='month'}">近一月</div>
                                    </div>                                    
                                </div>
                                <div style="width:880px;height:400px;background-color:#eee" id="statusChar"  v-show="isStateNo=='1'"></div>
                                <div style="width:880px;height:400px;background-color:#eee" id="statusChar1" v-show="isStateNo=='2'&&chartType=='bar'"></div>
                                <div style="width:880px;height:400px;background-color:#eee" id="statusChar2" v-show="isStateNo=='2'&&chartType=='line'"></div>
                            </div>                        
                        </div>`;
                let param={
                    title:'数据采集趋势（'+name+'）',
                    content:html,
                    skin:'status-detail-container',
                    area:['900px','530px'],
                    context:{
                        pages:[{name:'手动添加',icon:'fa fa-tag'},{name:'批量导入',icon:'fa fa-tag',disable:false,tip:''}],
                        xData:[],
                        sginData:[],
                        allCollect:"",
                        yesCollect:"",
                        viewTime:"week",         //近一月与近一周的切换(采集趋势)
                        viewLineTime:"week",         //近一月与近一周的切换(采集详情)
                        chartType:"bar",         //采集详情中柱状图与折线图的切换标识
                        isStateNo:"1",          //采集趋势与采集详情的切换标识
                        DeviceblnLoading:true,  //加载中标识
                        lineHistoryChart:"",           //绘制采集详情折线图(历史详情)
                        //采集详情中与采集趋势
                        changeStatus(val){
                            if(val== param.selfData.isStateNo) return;
                             param.selfData.isStateNo=val;
                        },
                        //采集趋势中的近一月和近一周切换
                        changeline(val){
                            if(val== param.selfData.viewTime) return;
                            param.selfData.viewTime = val;
                            param.selfData.thisShowData()
                        },
                        //采集详情中的近一月和近一周切换
                        changelineDetail(val){
                            if(val== param.selfData.viewLineTime) return;
                            param.selfData.viewLineTime = val;
                            param.selfData.thisShowYesterDayLine();
                        },
                        //采集详情中的昨日与历史采集详情相互切换
                        yesOrHisFun(val){
                            if(val== param.selfData.chartType) return;
                            param.selfData.chartType = val;
                        },                        
                        editDate(val){
                            let times =val.substr (0,4)+"-"+val.substr (4,2)+"-"+val.substr (6,2);
                            return times
                        },
                        // 绘制采集详情柱状图(昨日详情)
                        thisShowYesterDayBar(){ 
                            var barChart=echarts.init(document.getElementById('statusChar1'));                             
                            self.$store.dispatch(siteDetectYesterday,{netbar_wacode:siteId,microprobe_type:type}).then(res=>{
                                if(res.msg.code!='successed')return;
                                let yesterday=res.biz_body;
                                var xZData=[],numData=[];
                                for( let ary of yesterday){
                                    xZData.push(ary.title)
                                    numData.push(ary.count)
                                };

                                option = {
                                    title: {
                                        text: '昨日采集详情',
                                        x : 20, 
                                        y :5, 
                                        textStyle: {  
                                            fontSize: 15,
                                            fontWeight:700,
                                        }, 
                                    },                                    
                                    tooltip: {
                                        trigger: 'axis',
                                        axisPointer: {
                                            type: 'shadow',
                                            label: {
                                                    show: true
                                            }
                                        }                   
                                    },
                                    grid:{	//设置图标距离
                                        left: 100,
                                        right: 40,
                                        y:45
                                    },            
                                    xAxis: {

                                        type: 'category',
                                        data: xZData
                                    },
                                    yAxis: {
                                        type: 'value'
                                    },
                                    series: [{
                                        name:"采集数",
                                        itemStyle: {
                                            normal: {
                                                color:'#42ABDF'
                                            }
                                        },
                                        data: numData,
                                        type: 'bar'
                                      },
                                    ]
                                };
                                barChart.setOption(option);
                            })
                        },
                        // 绘制采集详情折线图(历史详情)
                        thisShowYesterDayLine(){
                             param.selfData.DeviceblnLoading=true;
                            // document.getElementById('statusChar2').html("");
                            param.selfData.lineHistoryChart=echarts.init(document.getElementById('statusChar2'));                            
                             self.$store.dispatch(siteDetectHistory,{netbar_wacode:siteId,coll_type:param.selfData.viewLineTime,microprobe_type:type}).then(res=>{
                                if(res.msg.code!='successed')return;
                                param.selfData.DeviceblnLoading=false;
                                let allHistoryData=res.biz_body;
                                let time=[],allData=[],firmNames=[];
                                //获取所有类型
                                for(let i=0;i<allHistoryData[0].coll.length;i++){
                                    firmNames.push(allHistoryData[0].coll[i].title);           
                                    allData.push({
                                        name: allHistoryData[0].coll[i].title,
                                        type: 'line',
                                        data: [],
                                        itemStyle: {
                                            normal: {
                                                label: {
                                                    formatter: '{c}%'
                                                }
                                            }
                                        }                
                                    })
                                }
                                for(let i=0;i<allHistoryData.length;i++){
                                    time.push(allHistoryData[i].date.substr (0,4)+"-"+allHistoryData[i].date.substr (4,2)+"-"+allHistoryData[i].date.substr (6,2));
                                    for(let j=0;j<allHistoryData[i].coll.length;j++){
                                        allData[j].data.push((allHistoryData[i].coll[j].count))
                                    }
                                }
                                option = {      
                                    title: {
                                        text: '历史采集详情',
                                        textStyle: {  
                                            fontSize: 15,
                                            fontWeight:700,
                                        }, 
                                    },                       
                                    tooltip: {
                                        trigger: 'axis',
                                        formatter:function(param){
                                            let str='';
                                            _.each(param,p=>{
                                                str+=`${p.seriesName}:${p.data}<br>`
                                            });
                                            return str;
                                        }
                                    },
                                    legend: {
                                        orient : 'horizontal',  
                                        textStyle: {  
                                            fontSize: 13,
                                        }, 
                                        data:firmNames  
                                    },
                                    xAxis: {
                                        type: 'category',
                                        boundaryGap: false,
                                        data:  time
                                    },
                                    grid:{	//设置图标上面和下面的距离
                                        left: 60,
                                        right: 40,
                                        y:45
                                    },
                                    yAxis: {
                                        type: 'value',     
                                        //name: '历史采集详情',               
                                        xisLabel: {
                                            formatter: '{value}'
                                        },
                                        axisLabel: {
                                            formatter: '{value} '
                                        },
                                        axisPointer: {
                                            snap: true
                                        }
                                    },
                                    series:allData
                                };                               
                                param.selfData.lineHistoryChart.setOption(option);
                            });
                        },  
                        // 绘制采集趋势折线图
                        thisShowData(){
                             param.selfData.DeviceblnLoading=true;
                            var lineChart=echarts.init(document.getElementById('statusChar'));                            
                             self.$store.dispatch(SiteDetectColl,{netbar_wacode:siteId,coll_type:param.selfData.viewTime}).then(res=>{
                                if(res.msg.code!='successed')return;
                                param.selfData.DeviceblnLoading=false;
                                let allData=res.biz_body;
                                param.selfData.allCollect =allData.total_num ? allData.total_num : '0';
                                param.selfData.yesCollect =allData.last_num ? allData.last_num : '0';
                                param.selfData.xData=[];
                                param.selfData.sginData=[];
                                for( let ary of allData.chart){
                                    param.selfData.xData.push(param.selfData.editDate(ary.stat_date))
                                    param.selfData.sginData.push(ary.detect_num)
                                 };
                                option = {                           
                                    tooltip: {trigger: 'axis',},
                                    xAxis: {
                                        type: 'category',
                                        boundaryGap: false,
                                        data:  param.selfData.xData
                                    },
                                    grid:{	//设置图标上面和下面的距离
                                        left: 60,
                                        right: 40,
                                        y:45
                                    },
                                    yAxis: {
                                        type: 'value',                    
                                        xisLabel: {
                                            formatter: '{value} W'
                                        },
                                        axisPointer: {
                                            snap: true
                                        }
                                    },
                                    series: [{
                                        name:"采集数",
                                        data:  param.selfData.sginData,
                                        type: 'line',
                                    }]
                                };                               
                                lineChart.setOption(option);
                            });
                        }                  
                    }, 
                    success(){
                        param.selfData.thisShowData();
                        param.selfData.thisShowYesterDayBar();
                        param.selfData.thisShowYesterDayLine();
                    }
                };
                return param;           
            }())
        },
        // 数据采集趋势
        dataStatus(siteId,name){
             let self=this;            
             //<div class="sele-time" @click="changelineDetail('custom')" :class="{active: viewLineTime=='custom'}">自定义</div>
            tool.open(function(){
                let html=`<div name="container" style="width:100%;height:100%;padding: 10px;">
                            <div class="tit-row">
                                <div class="bar tit-bars" :class="isStateNo=='1'? 'active':''" @click="changeStatus('1')">采集趋势</div>
                                <div class="bar tit-bars" :class="isStateNo=='2'? 'active':''" @click="changeStatus('2')">采集详情</div>
                            </div>
                            <!--加载中标识-->
                            <div v-if="DeviceblnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 10px;font-size: 50px;">
                                <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
                            </div>
                            <div style="width:100%;height:100%;border-top: 1px solid #ccc;" class="data-row" >
                                <div class="tda-ert">
                                    <div class="lefts" v-show="isStateNo=='1'">
                                        <span>昨日采集：{{yesCollect}}</span>
                                        <span>累计采集：{{allCollect}}</span>
                                    </div>
                                    <div class="lefts" style="font-size:18px;margin:0 15px" v-show="isStateNo=='2'">
                                        <div class="el-tooltip item" title="昨日采集详情" :class="chartType=='bar'? 'active':''" @click="yesOrHisFun('bar')">
                                                <div class="el-tooltip__rel" ><i class="fa fa-area-chart"></i></div>
                                        </div>&nbsp; &nbsp;
                                        <div class="el-tooltip item" title="历史采集详情" :class="chartType=='line'? 'active':''" @click="yesOrHisFun('line')">
                                            <div class="el-tooltip__rel"><i class="fa fa-line-chart"></i></div>
                                        </div>
                                    </div>    
                                    <div v-show="isStateNo=='2'&&chartType=='line'&&viewLineTime=='custom'" style="position:relative;left:100px">
                                        <div class="cond_item" >
                                            <span>请选择时间范围</span>
                                            <el-date-picker
                                                v-model="timeasa"
                                                type="daterange"
                                                align="right"
                                                width="300"
                                                placeholder="选择时间范围"
                                                >
                                            </el-date-picker>
                                        </div>                                    
                                    </div>                                
                                    <div class="rights" v-show="isStateNo=='1'">                                       
                                        <div class="sele-time" @click="changeline('week')" :class="{active: viewTime=='week'}">近一周</div>
                                        <div class="sele-time" @click="changeline('month')" :class="{active: viewTime=='month'}">近一月</div>
                                    </div>
                                    <div class="rights" v-show="isStateNo=='2'&&chartType=='line'">                                       
                                        <div class="sele-time" @click="changelineDetail('week')" :class="{active: viewLineTime=='week'}">近一周</div>
                                        <div class="sele-time" @click="changelineDetail('month')" :class="{active: viewLineTime=='month'}">近一月</div>
                                       
                                    </div>                                    
                                </div>
                                <div style="width:880px;height:400px;background-color:#eee" id="statusChar"  v-show="isStateNo=='1'"></div>
                                <div style="width:880px;height:400px;background-color:#eee" id="statusChar1" v-show="isStateNo=='2'&&chartType=='bar'"></div>
                                <div style="width:880px;height:400px;background-color:#eee" id="statusChar2" v-show="isStateNo=='2'&&chartType=='line'"></div>
                            </div>                        
                        </div>`;
                let param={
                    title:'厂商数据采集趋势（'+name+'）',
                    content:html,
                    skin:'status-detail-container',
                    area:['900px','530px'],
                    context:{
                        pages:[{name:'手动添加',icon:'fa fa-tag'},{name:'批量导入',icon:'fa fa-tag',disable:false,tip:''}],
                        xData:[],
                        sginData:[],
                        allCollect:"",
                        timeasa:"",
                        yesCollect:"",
                        viewTime:"week",         //近一月与近一周的切换(采集趋势)
                        viewLineTime:"week",         //近一月与近一周的切换(采集详情)
                        chartType:"bar",         //采集详情中柱状图与折线图的切换标识
                        isStateNo:"1",          //采集趋势与采集详情的切换标识
                        DeviceblnLoading:true,  //加载中标识
                        lineHistoryChart:"",           //绘制采集详情折线图(历史详情)
                        //采集详情中与采集趋势
                        changeStatus(val){
                            if(val== param.selfData.isStateNo) return;
                             param.selfData.isStateNo=val;
                        },
                        //采集趋势中的近一月和近一周切换,
                        changeline(val){
                            if(val== param.selfData.viewTime) return;
                            param.selfData.viewTime = val;
                            param.selfData.thisShowData()
                        },
                        //采集详情中的近一月和近一周以及自定义切换
                        changelineDetail(val){
                            if(val== param.selfData.viewLineTime) return;    
                            param.selfData.viewLineTime = val;                       
                            if(val!='custom'){
                                
                                param.selfData.thisShowYesterDayLine();
                            }
                            
                        },
                        //采集详情中的昨日与历史采集详情相互切换
                        yesOrHisFun(val){
                            if(val== param.selfData.chartType) return;
                            param.selfData.chartType = val;
                        },                        
                        editDate(val){
                            let times =val.substr (0,4)+"-"+val.substr (4,2)+"-"+val.substr (6,2);
                            return times
                        },
                        // 绘制采集详情柱状图(昨日详情)
                        thisShowYesterDayBar(){ 
                            var barChart=echarts.init(document.getElementById('statusChar1'));                             
                            self.$store.dispatch(FirmDetectYesterday,{org_id:siteId}).then(res=>{
                                if(res.msg.code!='successed')return;
                                let yesterday=res.biz_body;
                                var xZData=[],numData=[];
                                for( let ary of yesterday){
                                    xZData.push(ary.title)
                                    numData.push(ary.count)
                                };
                                option = {
                                    title: {
                                        text: '昨日采集详情',
                                        x : 20, 
                                        y :5, 
                                        textStyle: {  
                                            fontSize: 15,
                                            fontWeight:700,
                                        }, 
                                    },                                    
                                    tooltip: {
                                        trigger: 'axis',
                                        axisPointer: {
                                            type: 'shadow',
                                            label: {
                                                    show: true
                                            }
                                        }                   
                                    },
                                    grid:{	//设置图标距离
                                        left: 100,
                                        right: 40,
                                        y:45
                                    },            
                                    xAxis: {

                                        type: 'category',
                                        data: xZData,
                                        axisLabel:{  
                                            interval:0,//横轴信息全部显示  
                                            //rotate:-30,//-30度角倾斜显示  
                                        }
                                    },
                                    yAxis: {
                                        type: 'value'
                                    },
                                    series: [{
                                        name:"采集数",
                                        itemStyle: {
                                            normal: {
                                                color:'#42ABDF'
                                            }
                                        },
                                        data: numData,
                                        type: 'bar'
                                      },
                                    ]
                                };
                                barChart.setOption(option);
                            })
                        },
                        // 绘制采集详情折线图(历史详情)
                        thisShowYesterDayLine(){
                             param.selfData.DeviceblnLoading=true;
                            // document.getElementById('statusChar2').html("");
                            param.selfData.lineHistoryChart=echarts.init(document.getElementById('statusChar2'));                            
                             self.$store.dispatch(FirmDetectHistory,{org_id:siteId,coll_type:param.selfData.viewLineTime,}).then(res=>{
                                if(res.msg.code!='successed')return;
                                param.selfData.DeviceblnLoading=false;
                                let allHistoryData=res.biz_body;
                                let time=[],allData=[],firmNames=[];
                                //获取所有类型
                                for(let i=0;i<allHistoryData[0].coll.length;i++){
                                    firmNames.push(allHistoryData[0].coll[i].title);           
                                    allData.push({
                                        name: allHistoryData[0].coll[i].title,
                                        type: 'line',
                                        data: [],
                                        itemStyle: {
                                            normal: {
                                                label: {
                                                    formatter: '{c}%'
                                                }
                                            }
                                        }                
                                    })
                                }
                                for(let i=0;i<allHistoryData.length;i++){
                                    time.push(allHistoryData[i].date.substr (0,4)+"-"+allHistoryData[i].date.substr (4,2)+"-"+allHistoryData[i].date.substr (6,2));
                                    for(let j=0;j<allHistoryData[i].coll.length;j++){
                                        allData[j].data.push((allHistoryData[i].coll[j].count))
                                    }
                                }
                                option = {      
                                    title: {
                                        text: '历史采集详情',
                                        textStyle: {  
                                            fontSize: 15,
                                            fontWeight:700,
                                        }, 
                                    },                       
                                    tooltip: {
                                        trigger: 'axis',
                                        formatter:function(param){
                                            let str='';
                                            _.each(param,p=>{
                                                str+=`${p.seriesName}:${p.data}<br>`
                                            });
                                            return str;
                                        }
                                    },
                                    legend: {
                                        orient : 'horizontal',  
                                        y:20,
                                        textStyle: {  
                                            fontSize: 13,
                                        }, 
                                        data:firmNames  
                                    },
                                    xAxis: {
                                        type: 'category',
                                        boundaryGap: false,
                                        data:  time
                                    },
                                    grid:{	//设置图标上面和下面的距离
                                        left: 100,
                                        right: 40,
                                        y:75
                                    },
                                    yAxis: {
                                        type: 'value',     
                                        //name: '历史采集详情',               
                                        xisLabel: {
                                            formatter: '{value}'
                                        },
                                        axisLabel: {
                                            formatter: '{value} '
                                        },
                                        axisPointer: {
                                            snap: true
                                        }
                                    },
                                    series:allData
                                };                               
                                param.selfData.lineHistoryChart.setOption(option);
                            });
                        },  
                        // 绘制采集趋势折线图
                        thisShowData(){
                             param.selfData.DeviceblnLoading=true;
                            var lineChart=echarts.init(document.getElementById('statusChar'));                            
                             self.$store.dispatch(FirmDetectColl,{org_id:siteId,coll_type:param.selfData.viewTime}).then(res=>{
                                if(res.msg.code!='successed')return;
                                param.selfData.DeviceblnLoading=false;
                                let allData=res.biz_body;
                                param.selfData.allCollect =allData.total_num ? allData.total_num : '0';
                                param.selfData.yesCollect =allData.last_num ? allData.last_num : '0';
                                param.selfData.xData=[];
                                param.selfData.sginData=[];
                                for( let ary of allData.chart){
                                    param.selfData.xData.push(param.selfData.editDate(ary.stat_date))
                                    param.selfData.sginData.push(ary.detect_num)
                                 };
                                option = {                           
                                    tooltip: {trigger: 'axis',},
                                    xAxis: {
                                        type: 'category',
                                        boundaryGap: false,
                                        data:  param.selfData.xData
                                    },
                                    grid:{	//设置图标上面和下面的距离
                                        left: 100,
                                        right: 40,
                                        y:45
                                    },
                                    yAxis: {
                                        type: 'value',                    
                                        xisLabel: {
                                            formatter: '{value} W'
                                        },
                                        axisPointer: {
                                            snap: true
                                        }
                                    },
                                    series: [{
                                        name:"采集数",
                                        data:  param.selfData.sginData,
                                        type: 'line',
                                    }]
                                };                               
                                lineChart.setOption(option);
                            });
                        }                  
                    }, 
                    success(){
                        param.selfData.thisShowData();
                        param.selfData.thisShowYesterDayBar();
                        param.selfData.thisShowYesterDayLine();
                    }
                };
                return param;           
            }())
        },
        //全选/取消全选
      selAll(){
        let s=this;
        if(s.blnAllSel){
            for(let i=0;i<s.data.length;i++){
                let index=_.findIndex(s.selIds,id=>id==s.data[i].security_software_orgcode);
                if(index<0) continue;
                s.selIds.splice(index,1);
            }
        }else{
            for(let i=0;i<s.data.length;i++){
                let index=_.findIndex(s.selIds,id=>id==s.data[i].security_software_orgcode);
                if(index>=0) continue;
                s.selIds.push(s.data[i].security_software_orgcode);
            }
        }
      },
      //单选
      selItem(d){
        let index=_.findIndex(this.selIds,id=>id==d.security_software_orgcode);
        if(index>=0){
            this.selIds.splice(index,1);
        }else{
            this.selIds.push(d.security_software_orgcode);
        }
      },
      blnSelItem(d){
        return _.findIndex(this.selIds,id=>id==d.security_software_orgcode)>=0;
      },
      exportList(){
        if(this.exportDataing) return;
        this.exportDataing=true;
        
            
        this.$store.dispatch(ExportFirmList,{
            security_software_orgcode:this.query.security_software_orgcode, //厂商编码
            security_software_orgname:this.query.security_software_orgname, //厂商名称
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
<style>
    /* 厂商详情样式*/
   .firm-detail-container .layui-layer-title{
        background-color: #03ab67;
        font-weight: 700;
        color:#fff;
    }
    .firm-detail-container .site-detail-row{
        margin: 0px;
        line-height: 30px;
        border-bottom: 1px solid #e7eaec;
    }
    .firm-detail-container .site-detail-row .item_label_left{
        text-align: right;
        border-right: 1px solid #e7eaec;
    }
    .firm-detail-container .site-detail-row .item_label_right{
        text-align: right;
        border-right: 1px solid #e7eaec;
        border-left: 1px solid #e7eaec;
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
        margin: 10px 0 7px;
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
    .status-detail-container .data-row .el-tooltip:hover{
    cursor: pointer;
    color: #03ab67;
  }  
  .status-detail-container .data-row .el-tooltip.active{
    cursor: pointer;
    color: #03ab67;
  } 

</style>
<style scoped lang="less">
  @import "../css/variables.less";
  @rowH:40px;
  .firmpage{width:100%;height:100%;overflow:hidden;padding:5px;}
  .firmpage .CaseManage_container{width:100%;height:100%;}
  .firmpage .body,
  .firmpage .header{width: 100% !important;list-style: none;padding-left: 0px;padding: 0px;margin-bottom:0px;display:table;}
  .firmpage .body .item,
  .firmpage .header .item{line-height: @rowH;height: @rowH;text-align: left;margin: 0px;display: table-row;width: 100%;color: white;}
  html{.TCol(~".firmpage .header .item",'bg');}
  .firmpage .body .item > div,
  .firmpage .header .item > div{display: table-cell;.border('bottom');.border('right');padding: 0px 0px 0px 0px;vertical-align: middle;text-align:center;}

  .firmpage .body .item{background-color:white;color:@HeaderBgCol;}

  .firmpage .body .item .sep,
  .firmpage .header .item .sep{border-right:2px solid @FontCol;}
  .firmpage .body .item .option,
  .firmpage .header .item .option{width:120px;background-color: inherit;}
  .firmpage .body .item .count_item,
  .firmpage .header .item .count_item{width:80px;}

  .firmpage .body .item .option .overflow > span{border:none;font-size:12px;display: initial;margin-right:5px;}
  .firmpage .body .item .option .overflow > span:hover{cursor:pointer;}
  html{.TCol(~".firmpage .body .item .option .overflow > span:hover");}
  .firmpage .item .overflow{margin:0 auto;}
  .firmpage .body .item .align .overflow{text-align:left}
  .firmpage .body .item .overflow.sit-click,.firmpage .body .item .overflow .sit-click{
      color:#03ab67;
      font-weight:bolder;
  }
 .firmpage .body .item .overflow.sit-click:hover,.firmpage .body .item .overflow .sit-click:hover{
      cursor:pointer;
      text-decoration:underline;
  }
  @optionH:50px;
  .firmpage .option{width:100%;background-color: white;}
  .firmpage .page_container{.border('top');.border('bottom');background-color:white;position: absolute;bottom: 2px; }
  .firmpage .content{width:100%;height:~'calc(100% - @{optionH} - 60px - 40px)';}

  .firmpage .header .item .dropDown{position: absolute;z-index: 100;top: 35px;line-height: initial;margin-left: 5px;
        width: calc(100% - 10px);
        color: black;
        text-align:left;
        background-color: white;
        -moz-box-shadow: 2px 2px 2px #333333;
        -webkit-box-shadow: 2px 2px 2px #333333;
        box-shadow: 2px 2px 2px #333333;
        font-size: 12px;
  }

  .firmpage .header .item .dropDown div{.border('bottom');line-height:25px;padding:0px 10px;}
  .firmpage .header .item .dropDown div:hover{color:white;cursor:pointer;}
  html{.TCol(~".firmpage .header .item .dropDown div:hover",'bg');}

  .firmpage .header .item .title_content{position:relative;}

  .firmpage .option{text-align: initial;padding:10px;}
  .firmpage .option .item{display:inline-block;margin: 2px 0;}
  .firmpage .option .item .input{display:inline-block;}
  .firmpage .tag_label:hover{color:@btn_Bg_Col_hover_1;}

  .firmpage .body .item .count_item:hover{cursor:pointer;}
  html{.TCol(~".firmpage .body .item .count_item:hover");}
  .overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}
  .firmpage .tagComp[data-v-033fe12d]{
    height: 100%;
    width: 100%;
    padding: 2px 0px;
    text-align: left;
  }
  .firmpage .tagComp .item{
    display: inline-block;
    height: 100%;
    min-width: 50px;
    text-align: center;
    margin: 0px 5px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.35, 0.52, 0.33, 0.98) 0s;
  }
  .firmpage .tagComp .item.active{
    background-color: #03ab67;
    color: white;
    border-radius: 5px;
  }
  .firmpage .tagComp .item:hover{
    background-color: #03ab67;
    color: white;
    border-radius: 5px;
  }
  .firmpage .tagComp .item .item_containner{
    display: table;
    height: 100%;
    width: 100%;
    padding: 0px 10px;
  }
  .firmpage .tagComp .item .item_container .content{
    display: table-cell;
    vertical-align: middle;
    padding: 5px 10px;
  }
  .firmpage .tagComp .item .item_container .content i{
    margin-right: 5px;
  }
  .firmpage .chart_container .his-row{
    height:40px;
    width:100%;      
  }
  .firmpage .chart_container .his-row div{
    display: inline-block;
  }   
  .firmpage .chart_container .his-row .drop_content div{
    display: block;
  }  
  .firmpage .chart_container .his-row .his-title{
    float: left;
    margin-left: 30px;
    font-size: 19px;
    font-weight: 900;  
  }

    .firmpage .red{color:red}
    .firmpage .green{color:green}
  .firmpage .chart_container .his-row .his-term{
    float: left;
    margin-left: 30px;
    margin-bottom: 5px
  }
  .firmpage .chart_container .his-row .optionBar{
    float: right;
    margin-right: 30px;
  }
  .firmpage .chart_container .his-row .optionBar .el-tooltip{
    margin-right:10px;
  }
  .firmpage .chart_container .his-row .optionBar .el-tooltip:hover{
    cursor: pointer;
    color: #03ab67;
  }  
  .firmpage .chart_container .his-row .optionBar .el-tooltip.active{
    cursor: pointer;
    color: #03ab67;
  }  

.firmpage  .exportSel{cursor:pointer;}
html{.TCol(~".firmpage .exportSel:hover");}
html{.TCol(~".firmpage .exportSel.active");}
html{.TCol(~".firmpage .exportBtn:hover");}
.firmpage .cursor{cursor:pointer;}
</style>
