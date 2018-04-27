<!-- 设备管理定制页面组件 created by Chuanjiang Li 2018/04/13-->
<template>
    <div class="CaseManage devicepage">
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
                <div class="item" @click="switchView('map')" :class="{active: viewTable=='map'}">
                    <div class="item_container">
                        <span class="content"><i class="fa fa-map-marker"></i>描点</span>
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
                        <span>设备编码：</span>
                        <div class="input">
                            <el-input placeholder="设备编码" v-model="query.equipment_id"></el-input>
                        </div>
                    </div>
                    <div class="item">
                        <span>设备名称：</span>
                        <div class="input">
                            <el-input placeholder="设备名称" v-model="query.equipment_name"></el-input>
                        </div>
                    </div>
                    <div class="item">
                        <span>场所编码：</span>
                        <div class="input">
                            <el-input placeholder="场所编码" v-model="query.netbar_wacode"></el-input>
                        </div>
                    </div>
                    <div class="item">
                        <span>场所名称：</span>
                        <div class="input">
                            <el-input placeholder="场所名称" v-model="query.netbar_name"></el-input>
                        </div>
                    </div>
                    <div class="item">
                        <span>区域范围：</span>
                        <div class="input">
                            <PlaceSearch  :blnClear="true" c_searchKind="0" @place_res="selectArea"></PlaceSearch>
                        </div>
                    </div>
                    <div class="item">
                        <span>数据来源：</span>
                        <div class="input">
                            <el-select v-model="query.microprobe_type" :clearable="true" placeholder="数据来源" :multiple="true" :collapse-tags="true" @change=filterMicroprobe>
                            <el-option 
                            v-for="kind in dict_tables.microprobe_type"                            
                            :label="kind.name"
                            :value="kind.value">
                            </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="item">
                        <span>设备类型:</span>
                        <div class="input">
                            <el-select v-model="query.equipment_type" :clearable="true" placeholder="设备类型" >
                            <el-option
                            v-for="kind in dict_tables.equipment_type"                           
                            :label="kind.name"
                            :value="kind.value">
                            </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="item">
                        <span>设备状态:</span>
                        <div class="input">
                            <el-select v-model="query.device_state" :clearable="true" placeholder="设备状态" >
                            <el-option
                            v-for="kind in dict_tables.device_state"                           
                            :label="kind.name"
                            :value="kind.value">
                            </el-option>
                            </el-select>
                        </div>
                    </div>



                    <div class="item" >
                        <el-button type="primary" @click="query_click()"><i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i><span v-show="!blnSearch">搜索</span></el-button>
                    </div>

                </div>
                <ul class="header">
                    <li class="item">
                        <div><span class="overflow" style="width:215px;">设备编码</span></div>
                        <div><span class="overflow" style="width:150px;">设备名称</span></div>
                        <!-- <div :style="{width:case_address_w+'px'}"><span class="overflow" :style="{width:case_address_w+'px'}">场所名称</span></div> -->
                        <div><span class="overflow" style="width:130px;">设备MAC</span></div>
                        <div><span class="overflow" style="width:70px;">设备状态</span></div>
                        
                        <div><span class="overflow" style="width:140px;">最近联系时间</span></div>
                        <div><span class="overflow" style="width:80px;">昨日上传量</span></div>
                        <div><span class="overflow" style="width:100px;">设备类型</span></div>
                        <!-- <div><span class="overflow" style="width:65px;">营业状态</span></div> -->
                        <div><span class="overflow" style="width:140px;">所属场所</span></div>
                        <div><span class="overflow" style="width:60px;">所属区域</span></div>
                        <div><span class="overflow" style="width:60px;">数据来源</span></div>
                        <div><span class="overflow" style="width:80px;">所属厂商</span></div>
                        <div><span class="overflow" style="width:50px;">操作</span></div>
                    </li>
                </ul>
                <div class="content">
                    <Scroll :listen="data">
                        <ul class="body">
                            <li class="item" style="text-align:center;display: table-caption;" v-if="showData.length<=0&&!blnLoading">暂无数据</li>
                            <li v-for="(d,i) in showData" class="item" >
                                <div  :title="d.equipment_id" ><span class="overflow" style="width:215px;">{{d.equipment_id}}</span></div>
                                <div class="align" :title="d.equipment_name" ><span class="overflow" style="width:150px;">{{d.equipment_name}}</span></div>
                                <div class="align" :title="d.mac"><span class="overflow" style="width:130px;">{{d.mac}}</span></div>
                                <div  :title="d.online_state" :class="[{red : d.online_state=='异常'},{green : d.online_state=='在线'}]"><span class="overflow" style="width:70px;">{{d.online_state}}</span></div>                                
                                <div  :title="d.capture_time"><span class="overflow" style="width:140px;">{{d.capture_time}}</span></div>
                                <div  :title="d.last_upload_num" @click="dataStatus(d.equipment_id,d.equipment_name)"><span class="overflow sit-click" style="width:80px;">{{d.last_upload_num}}</span></div>
                                <div :title="d.equipment_type"><span class="overflow" style="width:100px;">{{d.equipment_type}}</span></div>
                                <!-- <div  :title="d.business_state"><span class="overflow" style="width:65px;">{{d.business_state}}</span></div> -->
                                <div class="align" :title="d.netbar_name"><span class="overflow" style="width:140px;">{{d.netbar_name}}</span></div>
                                <div  :title="d.county"><span class="overflow" style="width:60px;">{{d.county}}</span></div>
                                <div  :title="d.microprobe_type"><span class="overflow" style="width:60px;">{{d.microprobe_type}}</span></div>
                                <div class="align" :title="d.security_software_orgname"><span class="overflow" style="width:80px;">{{d.security_software_orgname}}</span></div>
                                <div  title="查看详情" @click="searchDeviceDetail(d.equipment_id)"><span class="overflow sit-click" style="width:50px">详细</span></div>

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
            <!--地图（瞄点）显示区域-->
            <div v-if="viewTable=='map'" style="height: calc(100% - 30px);position:relative">
                <MapSite :blnInit="true" :data="newObject" :showData="showData" :isSite="false"/>
            </div>
            <!--统计图表显示区域-->
            <div class="chart_container" v-show="viewTable=='statistics'">
                <!--扇形图（昨日状况）-->
                <div name="pie_chart_container" class="" style="width:500px;height:370px;margin:0 20px;display:inline-block" ></div>
                <!--柱状图(问题总览)-->
                <div name="bar_chart_container" style="height:370px;display:inline-block" :style="{ width: elWidth-600+'px' }"></div>
                <!--线形图（在离线率）-->
                <div name="line_chart_container" style="width:100%;height:400px;display:inline-block">
                     <div class="his-row">
                        <div class="his-title">设备在离线</div>
                        <div class="his-term item">
                            <span>统计方式：</span>
                            <div class="input">
                                <el-select v-model="collType" placeholder="数据来源">
                                <el-option
                                v-for="kind in staticTime"
                                :key="kind.code"
                                :label="kind.name"
                                :value="kind.val">
                                </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="optionBar">
                            <div class="el-tooltip item " title="设备在离线详情" :class="{active: changeChart=='bar'}" @click="changeChartSty('bar')">
                                    <div class="el-tooltip__rel" ><i class="fa fa-area-chart"></i></div>
                            </div> 
                            <div class="el-tooltip item" title="设备在离线率" :class="{active: changeChart=='line'}" @click="changeChartSty('line')">
                                <div class="el-tooltip__rel"><i class="fa fa-line-chart"></i></div>
                            </div>
                            <div class="el-tooltip item" title="导出数据" @click="ExportOnlineCount()">
                                <div class="el-tooltip__rel">
                                    <i class="fa fa-level-down"></i>
                                    <!-- <div class="el-tooltip" >
                                        <div class="el-tooltip__rel"></div>
                                        <div class="el-tooltip__popper is-dark" style="display: none;"><div>
                                    </div> -->
                                </div>
                            </div>  
                        </div>       
                    </div>
                    <!--在离线率图表显示区域-->
                    <div class="chart_container" style="width:100%;height:320px;display:inline-block">
                        <!--在离线率柱状图-->
                        <div name="his_bar_chart_container" style="height:420px;margin:0 auto" :style="{ width: elWidth-100+'px',height:elHeight-450+'px' }" v-show="changeChart=='bar'"></div>
                        <!--在离线率线形图-->
                        <div name="his_line_chart_container" style="height:420px;margin:0 auto" :style="{ width: elWidth-100+'px',height:elHeight-450+'px'}" v-show="changeChart=='line'"></div>
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
import MapSite from 'components/MapSite'
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


import TaskType from '../enum/TaskType'
import RelativeAnlay from '../modules/case/anlay'
import AddPop from '../modules/case/addPop'
import {GetDeviceList,DeviceDetectColl,LastDevicePercentage,DeviceDetail,DeviceHisPercentage,DeviceHisPercentageExport,BODY_RESIZE,Add_History_Menu,GetMicroprobe,Get_OPerate_Data,GetSiteList,getDictTables,SiteDetectColl} from '../store/mutation-types'
export default {
  name: 'devicePage',
  components:{
      Scroll,
      PlaceSearch,
      cSelect,
      MapSite,
    },
    watch:{
        collType () {
            this.getOnOffLineData();
        }
    },
  data () {
    return {
        siteType:[],          //场所类型
        siteState:[{name:'在线',val:true},{name:'离线',val:false}],
        siteSource:[],                  //数据来源
        viewTable:"list",                //列表，地图和统计相互切换的标识
        blnLoading:true,                //加载中标识
        pageNum:0,                      //当前页号（0开始计数）
        dict_tables:{},                 //字典信息集合
        myPieChart:"",  
        myBarChart:"",
        myLineChart:"",   
        myOnOffBarChart :"",

        staticTime:[{name:'近一周',val:'week'},{name:'近一月',val:'month'}],
        collType:'week',              //数据采集趋势率统计状态默认为近一周    
        changeChart:"line",             //场所在线率柱状图与条形图的相互切换标识
        //OnOffLIneType:'week',              //场所在线率统计状态默认为近一周   
        weekOnOffLIne:"",              //周场所在离线数据             
        monthOnOffLIne:"",              //月场所在离线数据  
        myYesdayOnOffLIne:"",           //获取场所昨日在离线状况
        elWidth:0,
        elHeight:0,


        taskType:TaskType,

        status:[{name:'所有',val:-1},{name:'完成',val:1},{name:'处理中',val:0}],
        curStatus:{name:'所有',val:-1},
        curStatu:'',
        blnShowStatus:false,
        bodyClickId:-1,
        blnSearch:false,
        query:{
            netbar_wacode:'',//场所编码
            netbar_name:'',//场所名称
            equipment_name:'',//设备名称
            equipment_id:'',//设备编码
            microprobe_type:'',//数据来源
            region_range:[],//区域范围
            device_state:'',//设备状态
            equipment_type:'',//设备类型
            limit:20,//每页显示几条数据，默认100
            skip:0//跳过多少条数据，默认0

        },
        case_address_w:0,
        data:[
        ],
        newObject:{
            primaryKey:"netbar_info|netbar_wacode",
        }
    }
  },
  mounted(){
    this.bodyClickId=tool.SingleBind('mousedown',$('body'),()=>{
       this.blnShowStatus=false;
    });
    this.elWidth=$(this.$el).width();
    this.elHeight=$(this.$el).height();

    this.refreshPage();
    this.getOnOffLineData();
    this.getYesdayData()

    this.$store.commit(BODY_RESIZE,()=>{
          this.elWidth=$(this.$el).width();
          this.elHeight=$(this.$el).height();
          if(!this.myLineChart)return;
           this.myLineChart.resize();
          if(!this.myOnOffBarChart)return;
          this.myOnOffBarChart.resize();
          if(!this.myPieChart)return;          
          this.myPieChart.resize();
          if(!this.myBarChart)return;                 
          this.myBarChart.resize();
    });
  },
  computed:{
      showData(){
          return _.map(this.data,r=>{
                return {
                    equipment_id:r.equipment_id,
                    equipment_name:r.equipment_name,
                    mac:r.mac,
                    online_state:r.online_state,
                    capture_time:r.capture_time ? tool.DateByTimestamp(r.capture_time,'yyyy-MM-dd hh:mm:ss'):'',
                    last_upload_num:r.last_upload_num,
                    equipment_type:r.equipment_type,
                    county:r.county,
                    security_software_orgname:r.security_software_orgname,
                    netbar_name:r.netbar_name,

                    //capture_time:r.capture_time?tool.DateByTimestamp(capture_time,'yyyy-MM-dd hh:mm:ss'):'',
                    business_state:r.business_state,
                    last_upload_num:r.last_upload_num,
                    longitude:r.longitude,
                    latitude:r.latitude,
                    netsite_type:r.netsite_type,
                    region_name:r.region_name,
                    microprobe_type:r.microprobe_type,
                    //security_software_orgname:r.security_software_orgname,


                    //situation:r.microprobe_type=="网吧"? r.net_terminal_num+"/"+r.actual_terminal+"/"+r.internet_users :"<span style='color:green'>"+ r.online_device+"</span>/<span style='color:red'>"+r.abnormal_device+"</span>/<span style='color:#000'>"+r.offline_device+"</span>",
                }
            });
      }
  },
  destroyed(){
    tool.ClearBind(this.bodyClickId)
  },
  methods:{
    //   数据来源多选下拉框特殊处理，选了网吧就不能选择其他的
        filterMicroprobe(data){
            if(data.length<=1) return;
            if(data[data.length-1]=="120"){
                this.query.microprobe_type=["120"];
                return
            }
            for(let i=0;i<data.length;i++){               
                if(data[i]=="120"){
                    this.query.microprobe_type.splice(i,1);                   
                }
               
            }
           //  console.log(this.query.microprobe_type);

        },
      //刷新页面
      refreshPage(){
          this.loadData();
      },
      //加载数据
      loadData(){
          //this.blnLoading=true;
          //this.blnLoading=false;
          //获取场所信息
         this.$store.dispatch(GetDeviceList,this.query).then(res=>{
           if(res.msg.code!='successed')return;
           this.data=res.biz_body;
            this.blnLoading=false;  
         });
            //获取数据来源
          this.$store.dispatch(getDictTables).then(res=>{
             if(res.msg.code!='successed')return;
             //console.log(res.biz_body);
            this.dict_tables= res.biz_body;
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
      //列表，地图和统计相互切换  
      switchView(type){
          if(type==this.viewTable) return
          this.viewTable=type;
      },
        // 获取场所在离线数据
      getOnOffLineData(){
         this.$store.dispatch(DeviceHisPercentage,{coll_type:this.collType}).then(res=>{
           if(res.msg.code!='successed')return;
           this.weekOnOffLIne=res.biz_body;
           this.addOfflineLineChart(this.weekOnOffLIne);     //加载折线图
           this.addOfflineBarChart(this.weekOnOffLIne)
         });
      },
      //获取设备昨日状况
      getYesdayData(){
         this.$store.dispatch(LastDevicePercentage).then(res=>{
           if(res.msg.code!='successed')return;
           this.myYesdayOnOffLIne=res.biz_body;
            this.loadPieChart(this.myYesdayOnOffLIne);
            this.loadBarChart(this.myYesdayOnOffLIne);
         });
      },     
      //切换柱状图和条形图
        changeChartSty(val){
            if(val==this.changeChart) return;
            this.changeChart = val;
        },
      //加载扇形图(饼图)，昨日状况
      loadPieChart(data){
        let myaPieChart=$(this.$el).find('div[name="pie_chart_container"]')[0]
        this.myPieChart = echarts.init(myaPieChart);
        var option = {
            title: {
                text: '昨日概况',
                x : 50, 
                y :30, 
                textStyle: {  
                    fontSize: 15,
                    fontWeight:200,
                }, 
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
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
                data:['在线','异常','离线']  
            },
            series: [{
                name: '',
                type: 'pie',
                radius:"76%",
                center: ['65%','55%'],
                data: [
                    {
                        name: '在线', 
                        value: data.pie.online,
                        itemStyle:{
                            normal:{
                                color:'#85C226',
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
                        name: '异常', 
                        value: data.pie.abnormals,
                        itemStyle:{
                            normal:{
                                color:'#F8C301',
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
                        name: '离线', 
                        value: data.pie.offline,
                        itemStyle:{
                            normal:{
                                color:'#728498',
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
        this.myPieChart.setOption(option);
      },
       //加载柱状图 问题总览   
      loadBarChart(data){
        let myaBarChart=$(this.$el).find('div[name="bar_chart_container"]')[0]
        this.myBarChart = echarts.init(myaBarChart);
        option = {
            title: {
                text: '问题总览'
            },

            legend: {
            // data: ['2011年']
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
                       // width:8,//这里是为了突出显示加上的
                    }                    
                }
            },
            yAxis: {
                type: 'category',
                data: ['设备维护','设备故障','数据采集不稳定','采集程序失效'],
                //inverse: false,
                splitLine:{
                    show:false
                },
                axisTick: {
                    show: false
                },
                axisLine:{
                    lineStyle:{
                        //color:'#C9C9C9',
                       // width:8,//这里是为了突出显示加上的
                    }                    
                }
            },
            series: [
                {
            
                    type: 'bar',
                    //label: labelOption,
                    barWidth : 35,//柱图宽度
                    itemStyle:{  
                        normal:{  
                            color: function (params){
                                var colorList = ['rgb(114, 132, 154)','rgb(147, 160, 176)','rgb(189, 202, 218)','rgb(249, 201, 129)','rgb(253, 188, 96)','rgb(254, 169, 50)','rgb(255, 150, 0)'];
                                return colorList[params.dataIndex];
                            }
                        }  
                    }, 
                    label:{
                        normal:{
                            show:true,            //显示数字
                            position: 'insideLeft',        //这里可以自己选择位置
                            textStyle: {
                                color: '#fff',
                                fontSize:13,
                                fontWeight:700,
                                padding: [0, 20]
                            }
                        },

                    },
                    data: [data.hist.abn_equip_maintenances,data.hist.abn_equip_err, data.hist.abn_detect_err, data.hist.abn_soft_err]
                }
                
            ]
        };
        this.myBarChart.setOption(option);
      },
    //加载在离线折线图time横坐标时间 inLineData：在线 ,offLineData：离线,abnormalsData：异常
     addOfflineLineChart(data){
        let offlineLineChart=$(this.$el).find('div[name="his_line_chart_container"]')[0]
        this.myLineChart = echarts.init(offlineLineChart);
        let time=[],inLineData=[],offLineData=[],abnormalsData=[];
        for(let i=0;i<data.length;i++){
            time.push(data[i].stat_date.substr (0,4)+"-"+data[i].stat_date.substr (4,2)+"-"+data[i].stat_date.substr (6,2));
            inLineData.push(data[i].online_pre*100)
            offLineData.push(data[i].offline_pre*100)
            abnormalsData.push(data[i].abnormals_pre*100)
        }
        let  option = {
                tooltip: {
                    trigger: 'axis',
                    formatter: '{b}<br/>{a0}: {c0}% <br/>{a1}:{c1}% <br/>{a2}: {c2}%'
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
                    data:['在线率','异常率','离线率']  
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
                },
                yAxis: {
                    type: 'value',                    
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
                series:[{
                    name: "在线率",
                    type: 'line',
                    data: inLineData,
                    itemStyle: {
                        normal: {
                            label: {
                                formatter: '{c}%'
                            }
                        }
                    }
                },{
                    name: "异常率",
                    type: 'line',
                    data: abnormalsData,
                    itemStyle: {
                        normal: {
                            label: {
                                formatter: '{c}%'
                            }
                        }
                    }
                },{
                    name: "离线率",
                    type: 'line',
                    data: offLineData,
                    itemStyle: {
                        normal: {
                            label: {
                                formatter: '{c}%'
                            }
                        }
                    }
                }]
            };
        
            this.myLineChart.setOption(option);
     },
    //  加载在离线柱状图
    addOfflineBarChart(data){
        let offlineLineChart=$(this.$el).find('div[name="his_bar_chart_container"]')[0]
        this.myOnOffBarChart = echarts.init(offlineLineChart);
        let time=[],inLineData=[],offLineData=[],abnormalsData=[];
        for(let i=0;i<data.length;i++){
            time.push(data[i].stat_date.substr (0,4)+"-"+data[i].stat_date.substr (4,2)+"-"+data[i].stat_date.substr (6,2));
            inLineData.push(data[i].online_num)
            offLineData.push(data[i].offline_num)
            abnormalsData.push(data[i].abnormals_num)
        }
        option = {
            tooltip: {
                trigger: 'axis',
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
                data:['在线数','异常数','离线数']  
            },
            xAxis: {

                type: 'category',
                data: time
            },
            yAxis: {
                type: 'value'
            },
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
        this.myOnOffBarChart.setOption(option);
    },
      
      //查询按钮(搜索)
      query_click(){
          this.data=[];
          this.blnSearch=true;
          this.blnLoading=true;
          this.pageNum= 0;
          this.query.skip=this.pageNum*this.query.limit;
          this.$store.dispatch(GetDeviceList,this.query).then(res=>{
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
          this.$store.dispatch(GetDeviceList,this.query).then(res=>{
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
        searchDeviceDetail(siteId){
            let self=this;
            tool.open(function(){
                let html=`<div name="container" style="width:100%;height:100%;padding: 10px;" >
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">设备编码：</div>
                                <div class="col-md-4">{{detailData.equipment_id}}</div>

                                <div class="col-md-2 item_label_right">设备名称：</div>
                                <div class="col-md-4">{{detailData.equipment_name}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">设备类型：</div>
                                <div class="col-md-4">{{detailData.equipment_type}}</div>
                                <div class="col-md-2 item_label_right">设备MAC：</div>
                                <div class="col-md-4">{{detailData.mac}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">所属场所：</div>
                                <div class="col-md-4">{{detailData.netbar_wacode}}</div>
                                <div class="col-md-2 item_label_right">场所名称：</div>
                                <div class="col-md-4">{{detailData.netbar_name}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">所属厂商：</div>
                                <div class="col-md-4">{{detailData.security_software_orgcode}}</div>
                                <div class="col-md-2 item_label_right">厂商名称：</div>
                                <div class="col-md-4">{{detailData.security_software_orgname}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">数据来源：</div>
                                <div class="col-md-4">{{detailData.microprobe_type}}</div>
                                <div class="col-md-2 item_label_right">设备版本：</div>
                                <div class="col-md-4">{{detailData.firmware_ver}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">设备经纬度：</div>
                                <div class="col-md-4">{{detailData.longitude}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{detailData.latitude}}</div>
                                <div class="col-md-2 item_label_right">最近联系时间：</div>
                                <div class="col-md-4">{{detailData.capture_time}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">上传间隔时间：</div>
                                <div class="col-md-4">{{detailData.upload_time_interval}}</div>
                                <div class="col-md-2 item_label_right">设备采集半径：</div>
                                <div class="col-md-4">{{detailData.collection_radius}}</div>                                
                            </div>
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">软件版本：</div>
                                <div class="col-md-4">{{detailData.sf_version}}</div>
                                <div class="col-md-2 item_label_right">硬件版本：</div>
                                <div class="col-md-4">{{detailData.hw_version}}</div>                                
                            </div>                   
                            <div class="row site-detail-row">
                                <div class="col-md-2 item_label_left">设备地址：</div>
                                <div class="col-md-10">{{detailData.equipment_address}}</div>                            
                            </div>


                        </div>`;
                let param={
                        title:'设备详情',
                        content:html,
                        skin:'device-detail-container',
                        area:['900px','360px'],
                        context:{
                            detailData:{},
                            loadDetail(){
                                self.$store.dispatch(DeviceDetail,{equipment_id:siteId}).then(res=>{
                                    if(res.msg.code!='successed')return;
                                    param.selfData.detailData=res.biz_body;
                                    param.selfData.detailData.capture_time = param.selfData.detailData.capture_time ? tool.DateByTimestamp(param.selfData.detailData.capture_time,'yyyy-MM-dd hh:mm:ss'):'';
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
                                <div class="bar tit-bars active" @click=changeStatus(1)>采集趋势</div>
                                <div class="bar tit-bars" @click=changeStatus(2)>采集状况</div>
                            </div>
                            <!--加载中标识-->
                            <div v-if="DeviceblnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 10px;font-size: 50px;">
                                <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
                            </div>
                            <div style="width:100%;height:100%;border-top: 1px solid #ccc;" class="data-row">
                                <div class="tda-ert">
                                    <div class="lefts">
                                        <span>昨日采集：{{yesCollect}}</span>
                                        <span>累计采集：{{allCollect}}</span>
                                    </div>
                                    <div class="rights">                                       
                                        <div class="sele-time" @click="changeline('week')" :class="{active: viewTime=='week'}">近一周</div>
                                        <div class="sele-time" @click="changeline('month')" :class="{active: viewTime=='month'}">近一月</div>
                                    </div>
                                </div>
                                <div style="width:880px;height:400px;background-color:#eee" id="statusChar"></div>
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
                        viewTime:"week",
                        DeviceblnLoading:true,  //加载中标识
                        changeStatus(val){
                            //点击采集情况时触发为以后预留
                        },
                        changeline(val){
                            if(val== param.selfData.viewTime) return;
                            param.selfData.viewTime = val;
                            param.selfData.thisShowData()
                        },
                        editDate(val){
                            let times =val.substr (0,4)+"-"+val.substr (4,2)+"-"+val.substr (6,2);
                            return times
                        },
                        thisShowData(){
                             param.selfData.DeviceblnLoading=true;
                            var lineChart=echarts.init(document.getElementById('statusChar'));
                             self.$store.dispatch(DeviceDetectColl,{equipment_id:siteId,coll_type:param.selfData.viewTime}).then(res=>{
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
                                        y:20
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
                    }
                };
                return param;           
            }())
        },
       //导出统计设备状态率
      ExportOnlineCount(){
          this.$store.dispatch(DeviceHisPercentageExport,{coll_type:this.collType}).then(res=>{
              if(!tool.msg(res,'','导出失败!'))return;
              window.location=res.biz_body.url;
          });
      },



  }
}
</script>
<style lang="less">
    /* 场所详情样式*/
   .device-detail-container .layui-layer-title{
        background-color: #03ab67;
        font-weight: 700;
        color:#fff;
    }
    .device-detail-container .site-detail-row{
        margin: 0px;
        line-height: 30px;
        border-bottom: 1px solid #e7eaec;
    }
    .device-detail-container .site-detail-row .item_label_left{
        text-align: right;
        border-right: 1px solid #e7eaec;
    }
    .device-detail-container .site-detail-row .item_label_right{
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
  .devicepage{width:100%;height:100%;overflow:hidden;padding:5px;}
  .devicepage .CaseManage_container{width:100%;height:100%;}
  .devicepage .body,
  .devicepage .header{width: 100% !important;list-style: none;padding-left: 0px;padding: 0px;margin-bottom:0px;display:table;}
  .devicepage .body .item,
  .devicepage .header .item{line-height: @rowH;height: @rowH;text-align: left;margin: 0px;display: table-row;width: 100%;background-color: @Font_Hover_Col;color: white;}
  .devicepage .body .item > div,
  .devicepage .header .item > div{display: table-cell;.border('bottom');.border('right');padding: 0px 0px 0px 0px;vertical-align: middle;text-align:center;}

  .devicepage .body .item{background-color:white;color:@HeaderBgCol;}

  .devicepage .body .item .sep,
  .devicepage .header .item .sep{border-right:2px solid @FontCol;}
  .devicepage .body .item .option,
  .devicepage .header .item .option{width:120px;background-color: inherit;}
  .devicepage .body .item .count_item,
  .devicepage .header .item .count_item{width:80px;}

  .devicepage .body .item .option .overflow > span{border:none;font-size:12px;display: initial;margin-right:5px;}
  .devicepage .body .item .option .overflow > span:hover{cursor:pointer;color:@Font_Hover_Col;}
  .devicepage .item .overflow{margin:0 auto;}
  .devicepage .body .item .align .overflow{text-align:left}
  .devicepage .body .item .overflow.sit-click{
      color:#03ab67;
  }
 .devicepage .body .item .overflow.sit-click:hover{
      cursor:pointer;
      text-decoration:underline;
  }
  @optionH:50px;
  .devicepage .option{width:100%;background-color: white;}
  .devicepage .page_container{.border('top');.border('bottom');background-color:white;position: absolute;bottom: 2px; }
  .devicepage .content{width:100%;height:~'calc(100% - @{optionH} - 60px - 40px)';}

  .devicepage .header .item .dropDown{position: absolute;z-index: 100;top: 35px;line-height: initial;margin-left: 5px;
        width: calc(100% - 10px);
        color: black;
        text-align:left;
        background-color: white;
        -moz-box-shadow: 2px 2px 2px #333333;
        -webkit-box-shadow: 2px 2px 2px #333333;
        box-shadow: 2px 2px 2px #333333;
        font-size: 12px;
  }

  .devicepage .header .item .dropDown div{.border('bottom');line-height:25px;padding:0px 10px;}
  .devicepage .header .item .dropDown div:hover{background-color:@Font_Hover_Col;color:white;cursor:pointer;}

  .devicepage .header .item .title_content{position:relative;}

  .devicepage .option{text-align: initial;padding:10px;}
  .devicepage .option .item{display:inline-block;margin: 2px 0;}
  .devicepage .option .item .input{display:inline-block;}
  .devicepage .tag_label:hover{color:@btn_Bg_Col_hover_1;}

  .devicepage .body .item .count_item:hover{color:@Font_Hover_Col;cursor:pointer;}
  .overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}
  .devicepage .tagComp[data-v-033fe12d]{
    height: 100%;
    width: 100%;
    padding: 2px 0px;
    text-align: left;
  }
  .devicepage .tagComp .item{
    display: inline-block;
    height: 100%;
    min-width: 50px;
    text-align: center;
    margin: 0px 5px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.35, 0.52, 0.33, 0.98) 0s;
  }
  .devicepage .tagComp .item.active{
    background-color: #03ab67;
    color: white;
    border-radius: 5px;
  }
  .devicepage .tagComp .item:hover{
    background-color: #03ab67;
    color: white;
    border-radius: 5px;
  }
  .devicepage .tagComp .item .item_containner{
    display: table;
    height: 100%;
    width: 100%;
    padding: 0px 10px;
  }
  .devicepage .tagComp .item .item_container .content{
    display: table-cell;
    vertical-align: middle;
    padding: 5px 10px;
  }
  .devicepage .tagComp .item .item_container .content i{
    margin-right: 5px;
  }
  .devicepage .chart_container .his-row{
    height:40px;
    width:100%;      
  }
  .devicepage .chart_container .his-row div{
    display: inline-block;
  }   
  .devicepage .chart_container .his-row .his-title{
    float: left;
    margin-left: 30px;
    font-size: 19px;
    font-weight: 900;  
  }
  .devicepage .chart_container .his-row .his-term{
    float: left;
    margin-left: 60px;
  }
  .devicepage .chart_container .his-row .optionBar{
    float: right;
    margin-right: 50px;
  }
  .devicepage .chart_container .his-row .optionBar .el-tooltip{
    margin-right:10px;
  }
  .devicepage .chart_container .his-row .optionBar .el-tooltip:hover{
    cursor: pointer;
    color: #03ab67;
  }  
  .devicepage .chart_container .his-row .optionBar .el-tooltip.active{
    cursor: pointer;
    color: #03ab67;
  }  
  .devicepage .red{color:red}
  .devicepage .green{color:green}
</style>
