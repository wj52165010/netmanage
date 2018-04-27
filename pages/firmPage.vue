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
                <div class="item" @click="switchView('list')" :class="{active: viewTable=='list'}">
                    <div class="item_container">
                        <span class="content"><i class="fa fa-list"></i>列表</span>
                    </div>
                </div>
                <div class="item" @click="switchView('statistics')" :class="{active: viewTable=='statistics'}">
                    <div class="item_container">
                        <span class="content"><i class="fa fa-gear"></i>统计</span>
                    </div>
                </div>
               </div>
            </div>

            <!--列表显示区域-->
            <div v-show="viewTable=='list'" style="height: calc(100% - 50px - -63px - 40px);position:relative">
                <div class="option">
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

                </div>
                <ul class="header">
                    <li class="item">
                        <div><span class="overflow" style="width:75px;">厂商编码</span></div>
                        <div><span class="overflow" style="width:205px;">厂商名称</span></div>
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
                <div class="content">
                    <Scroll :listen="data">
                        <ul class="body">
                            <li class="item" style="text-align:center;display: table-caption;" v-if="showData.length<=0&&!blnLoading">暂无数据</li>
                            <li v-for="(d,i) in showData" class="item" >
                                <div  :title="d.security_software_orgcode" ><span class="overflow" style="width:75px;">{{d.security_software_orgcode}}</span></div>
                                <div class="align" :title="d.security_software_orgname" ><span class="overflow" style="width:205px;">{{d.security_software_orgname}}</span></div>
                                <!-- <div class="align" :title="d.security_software_address"><span class="overflow" style="width:200px;">{{d.security_software_address}}</span></div> -->
                                <div><span class="overflow" style="width:100px;" v-html="d.security_software_site_status"></span></div>
                                <div ><span class="overflow " style="width:90px;">{{d.site_online_pre}}</span></div>
                                <div  :title="d.site_detect_num"><span class="overflow" style="width:90px;">{{d.site_detect_num}}</span></div>
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
                    <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageNum+1}}</span></span>
                    <div class="firstPage" @click="pageChange(0)">首页</div>
                    <div class="prePage" @click="pageChange(pageNum-1)">上一页</div>
                    <div class="nextPage" @click="pageChange(pageNum+1)">下一页</div>
                </div>
            </div>

            <!--统计图表显示区域-->
            <div class="chart_container" v-show="viewTable=='statistics'" style="height: calc(100% - 50px - -63px - 40px);">
                <div class="chart_container" style="width:100%;height:100%;position:relative">
                    <!--场所在离线-->
                    <div style="width:100%;height:50%;">
                        <div class="his-row">
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
                        <div class="chart_container">
                            <!--场所在离线率柱状图-->
                            <div name="site_bar_chart_container"  v-show="changeSiteChart=='bar'" style="height:420px;margin:0 auto" :style="{ width: elWidth-100+'px',height:(elHeight/2-74)+'px' }"></div>
                            <!--场所在离线线形图-->
                            <div name="site_line_chart_container" v-show="changeSiteChart=='line'" style="height:420px;margin:0 auto" :style="{ width: elWidth-100+'px',height:elHeight/2-74+'px' }"></div>
                        </div>
                    </div>                   
                    <!--设备在离线-->
                    <div style="width:100%;height:50%;">
                        <div class="his-row">
                            <div class="his-title">设备在离线</div>
                            <div class="his-title item" style="font-size:12px;font-weight:normal;text-align:left">
                                <span>厂商名称：</span>
                                <div class="input" style="width:250px;display:inline-block;">
                                    <MulDropDwon :data="devicefirms" keyProp="name" id="code" placeholder="请选择厂商">
                                        <div v-for="t in firms" @mousedown="firmClick('device',t)">{{t.name}}</div>
                                    </MulDropDwon>
                                </div>
                            </div> 
                            <div class="his-term item">
                                <span>区域范围:</span>
                                <div class="input">
                                    <PlaceSearch  :blnClear="true" c_searchKind="0" @place_res="selectAreaDevice"></PlaceSearch>
                                </div>
                            </div>
                            <div class="his-term item">
                                <span>时间范围</span>
                                <div class="input">
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
                        <div class="chart_container" style="width:100%;height:320px;display:inline-block">
                            <!--在离线率柱状图-->
                            <div name="device_bar_chart_container" v-show="changeDeviceChart=='bar'" style="height:420px;margin:0 auto" :style="{ width: elWidth-100+'px',height:(elHeight/2-74)+'px' }"></div>
                            <!--在离线率线形图-->
                            <div name="device_line_chart_container" v-show="changeDeviceChart=='line'" style="height:420px;margin:0 auto" :style="{ width: elWidth-100+'px',height:(elHeight/2-74)+'px' }"></div>
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
import {BODY_RESIZE,SiteDetail,GetFirm,GetFirmList,SiteHisPercentage,GetFirmCollColumn,GetFirmCollLine,GetFirmDeviceExport,GetFirmSiteExport} from '../store/mutation-types'
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
        blnLoading:true,                //加载中标识
        pageNum:0,                      //当前页号（0开始计数）
        viewTable:"list",                //列表和统计相互切换的标识

        taskType:TaskType,
        firms:[],            //所有厂商数据
        selectTime:[{name:'近一周',val:'week'},{name:'近一月',val:'month'}],      //时间选择
        Selfirms:[],         //列表中的控件选中的厂商
        sitefirms:[],         //统计页中场所在线率的厂商控件选中的厂商
        devicefirms:[],         //统计页中设备在线率的厂商控件选中的厂商
        elWidth:0,
        elHeight:0,
        changeSiteChart:"bar",       //场所在离线条形图与折线图切换标识
        changeDeviceChart:"bar",       //设备在离线条形图与折线图切换标识
        siteOnOffBarChart:"",     //场所在线率柱状图
        siteOnOffLineChart:"",     //场所在线率折线图
        deviceOnOffBarChart:"",     //场所在线率柱状图
        deviceOnOffLineChart:"",     //场所在线率折线图        
        siteSelect:{           //场所在线率提交数据
            coll_type:"week",
            region_range:[],
            security_software_orgcodes:"",
        },
        deviceSelect:{           //设备在线率提交数据
            coll_type:"week",
            region_range:[],
            security_software_orgcodes:"",
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
    }
  },
  mounted(){
    this.bodyClickId=tool.SingleBind('mousedown',$('body'),()=>{
       this.blnShowStatus=false;
    });
    this.elWidth=$(this.$el).width();
    this.elHeight=$(this.$el).height();
    //console.log(this.elWidth,this.elHeight);

    this.refreshPage();

    this.$store.commit(BODY_RESIZE,()=>{
          this.elWidth=$(this.$el).width();
          this.elHeight=$(this.$el).height();

          if(!this.siteOnOffLineChart)return;
           this.siteOnOffLineChart.resize();

          if(!this.siteOnOffBarChart)return;
          this.siteOnOffBarChart.resize();

          if(!this.deviceOnOffLineChart)return;
           this.deviceOnOffLineChart.resize();

          if(!this.deviceOnOffBarChart)return;
          this.deviceOnOffBarChart.resize();
    });
  },
  computed:{
      showData(){
          return _.map(this.data,r=>{
                return {
                    security_software_orgcode:r.security_software_orgcode,
                    security_software_orgname:r.security_software_orgname,
                    security_software_address:r.security_software_address,
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
      }
  },
  destroyed(){
    tool.ClearBind(this.bodyClickId)
  },
  watch:{
    Selfirms(){
       this.query.security_software_orgcodes=_.map(this.Selfirms,s=>s.code).join(',');
    },
    sitefirms(){
       this.siteSelect.security_software_orgcodes=_.map(this.sitefirms,s=>s.code).join(',');
        this.getSiteOnBarData();        // 获取场所在线柱状图数据
        this.getSiteOnlineData();        // 获取场所在线折线图数据
    },
    devicefirms(){
       this.deviceSelect.security_software_orgcodes=_.map(this.devicefirms,s=>s.code).join(',');
        this.getDeviceOnBarData();        // 获取设备在线柱状图数据
        this.getDeviceOnlineData();        // 获取设备在线折线图数据 
    },
    siteSelect:{
        handler(val, oldVal){
            this.getSiteOnBarData();        // 获取场所在线柱状图数据
            this.getSiteOnlineData();        // 获取场所在线折线图数据
        },
        deep: true    
    },
    deviceSelect:{
        handler(val, oldVal){
            this.getDeviceOnBarData();        // 获取设备在线柱状图数据
            this.getDeviceOnlineData();        // 获取设备在线折线图数据     
        },
        deep: true    
    }
  },
  methods:{
      //刷新页面
      refreshPage(){
          this.loadData();
      },
      //加载数据
      loadData(){
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
      
        this.getSiteOnBarData();        // 获取场所在线柱状图数据
        this.getDeviceOnBarData();        // 获取设备在线柱状图数据
        this.getSiteOnlineData();        // 获取场所在线折线图数据
        this.getDeviceOnlineData();        // 获取设备在线折线图数据        
    
      },
      //列表和统计相互切换  
      switchView(type){
          if(type==this.viewTable) return
          this.viewTable=type;
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
      //   处理厂商管理控件的方法
      firmClick(type,d){
          switch(type){
              case "list":
                if(_.findIndex(this.Selfirms,t=>t.code==d.code)>=0)return;
                this.Selfirms.push(d);
                break;
              case "site":           
                if(_.findIndex(this.sitefirms,t=>t.code==d.code)>=0)return;
                this.sitefirms.push(d);
                break;
              case "device":           
                if(_.findIndex(this.devicefirms,t=>t.code==d.code)>=0)return;
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
                    left: 50,
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
                allData[j].data.push((data[i].orgs[j].equip_online_pre*100).toFixed(2))
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
                    left: 50,
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
    //加载设备在离线柱状图
    addDeviceBarChart(data){
        let offlineLineChart=$(this.$el).find('div[name="device_bar_chart_container"]')[0]
        this.deviceOnOffBarChart = echarts.init(offlineLineChart);
        let xAxisdata=[],inLineData=[],offLineData=[],abnormalsData=[],led=null;
        for(let i=0;i<data.length;i++){
            xAxisdata.push(data[i].security_software_orgname);
            inLineData.push(data[i].equip_online)
            offLineData.push(data[i].equip_offline)
            abnormalsData.push(data[i].equip_abnormal)
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
        this.$store.dispatch(GetFirmDeviceExport,this.deviceSelect).then(res=>{
            if(!tool.msg(res,'','导出失败!'))return;
            window.location=res.biz_body.url;
        });
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
</style>
<style scoped lang="less">
  @import "../css/variables.less";
  @rowH:40px;
  .firmpage{width:100%;height:100%;overflow:hidden;padding:5px;}
  .firmpage .CaseManage_container{width:100%;height:100%;}
  .firmpage .body,
  .firmpage .header{width: 100% !important;list-style: none;padding-left: 0px;padding: 0px;margin-bottom:0px;display:table;}
  .firmpage .body .item,
  .firmpage .header .item{line-height: @rowH;height: @rowH;text-align: left;margin: 0px;display: table-row;width: 100%;background-color: @Font_Hover_Col;color: white;}
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
  .firmpage .body .item .option .overflow > span:hover{cursor:pointer;color:@Font_Hover_Col;}
  .firmpage .item .overflow{margin:0 auto;}
  .firmpage .body .item .align .overflow{text-align:left}
  .firmpage .body .item .overflow.sit-click,.firmpage .body .item .overflow .sit-click{
      color:#03ab67;
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
  .firmpage .header .item .dropDown div:hover{background-color:@Font_Hover_Col;color:white;cursor:pointer;}

  .firmpage .header .item .title_content{position:relative;}

  .firmpage .option{text-align: initial;padding:10px;}
  .firmpage .option .item{display:inline-block;margin: 2px 0;}
  .firmpage .option .item .input{display:inline-block;}
  .firmpage .tag_label:hover{color:@btn_Bg_Col_hover_1;}

  .firmpage .body .item .count_item:hover{color:@Font_Hover_Col;cursor:pointer;}
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
    margin-left: 60px;
  }
  .firmpage .chart_container .his-row .optionBar{
    float: right;
    margin-right: 50px;
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
</style>
