<!-- 手机App定制页面组件 created by Chuanjiang Li 2018/04/17-->
<template>
    <div class="CaseManage stiepage">
        <div class="CaseManage_container">
            <!--加载中标识-->
            <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;">
                <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;"><i class="fa fa-spinner fa-pulse"></i></div></div>
            </div>
            <!-- 标签切换 -->
            <div style="height:30px" name="tagcomp">
              <div class="tagComp" style="text-align:left">

                <!-- <div class="item" @click="switchView('map')" :class="{active: viewTable=='map'}">
                    <div class="item_container">
                        <span class="content"><i class="fa fa-map-marker"></i>描点</span>
                    </div>
                </div> -->
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
                <div class="option clearfix" name="listOption">
                    <div class="item">
                        <span>应用名称:</span>
                        <div class="input">
                            <el-input placeholder="应用名称" v-model="query.app_name"></el-input>
                        </div>
                    </div>
                    <!--<div class="item">
                        <span>来源市场:</span>
                        <div class="input">
                            <el-input placeholder="来源市场" v-model="query.source_market"></el-input>
                        </div>
                    </div>-->
                    <div class="his-term item">
                        <span>来源市场:</span>
                        <div class="input">
                                <el-select v-model="query.source_market" placeholder="请选择" :clearable="true">
                                <el-option
                                v-for="kind in dict_tables.app_markets"                           
                                :label="kind.name"
                                :value="kind.value">
                                </el-option>
                                </el-select>
                        </div>
                    </div>
                    <div class="item">
                        <span>应用开发商:</span>
                        <div class="input">
                            <el-input placeholder="应用开发商" v-model="query.app_devp"></el-input>
                        </div>
                    </div>
                    <div class="item">
                        <span>是否违规:</span>
                        <div class="input">
                            <el-select v-model="query.is_illegal" :clearable="true" placeholder="请选择" >
                            <el-option
                            v-for="kind in dict_tables.is_illegal"                           
                            :label="kind.name"
                            :value="kind.value">
                            </el-option>
                            </el-select>
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
                        <div><span class="overflow" style="width:150px;">应用名称</span></div>
                        <!--<div><span class="overflow" style="width:100px;">应用分类</span></div>-->
                        <div><span class="overflow" style="width:130px;">来源应用市场</span></div>
                        <div><span class="overflow" style="width:120px;">版本号</span></div>
                        <div><span class="overflow" style="width:150px;">更新时间</span></div>
                        <div><span class="overflow" style="width:80px;">下载次数</span></div>
                        <div><span class="overflow" style="width:90px;">好评率</span></div>
                        <div><span class="overflow" style="width:270px;">应用开发商</span></div>
                        <div><span class="overflow" style="width:70px;">是否违规</span></div>
                        <!--<div><span class="overflow" style="width:50px;">操作</span></div>-->
                    </li>
                </ul>
                <div class="content" :style="{height:listBodyH}">
                    <Scroll :listen="data" ref="indList">
                        <ul class="body">
                            <li class="item" style="text-align:center;display: table-caption;" v-if="showData.length<=0&&!blnLoading">暂无数据</li>
                            <li v-for="(d,i) in showData" class="item" >
                                <div class="column cursor" @click="selItem(d)" v-if="blnExport"  style="width:50px;" ><span class="overflow" style="width:50px;"><i :class="{'fa fa-check-square-o':blnSelItem(d),'fa fa-square-o':!blnSelItem(d)}"></i></span></div>
                                <div class="align" :title="d.app_name"  @click="searchSiteDetail(d.app_id)"><span class="overflow sit-click" style="width:150px;">{{d.app_name}}</span></div>
                                <!--<div  :title="d.app_id" ><span class="overflow" style="width:100px;">{{d.app_id}}</span></div>-->
                                <div  :title="d.source_market"><span class="overflow" style="width:130px;">{{d.source_market}}</span></div>
                                <div  :title="d.version"><span class="overflow" style="width:120px;">{{d.version}}</span></div>
                                <div  :title="d.update_time"><span class="overflow" style="width:150px;" >{{d.update_time}}</span></div>
                                <div  :title="d.donwload_times"><span class="overflow" style="width:80px;">{{d.download_times}}</span></div>
                                <div  :title="d.evaluation_index"><span class="overflow" style="width:90px;">{{d.evaluation_index}}</span></div>
                                <div class="align" :title="d.app_devp"><span class="overflow" style="width:270px;">{{d.app_devp}}</span></div>
                                <div  :title="d.is_illegal"><span class="overflow" style="width:70px;">{{d.is_illegal}}</span></div>
                                <!--<div  title="查看详情" @click="searchSiteDetail(d.app_id)"><span class="overflow sit-click" style="width:50px">详细</span></div>-->

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
            <!--地图（瞄点）显示区域-->
            <!-- <div v-show="viewTable=='map'" style="height: calc(100% - 50px - -63px - 40px);position:relative">
                <MapSite :blnInit="true" :data="newObject" :showData="showData" :isSite="true"/>
            </div> -->
            <!--统计图表显示区域-->
            <div class="chart_container" v-show="viewTable=='statistics'" style="height: calc(100% - 30px);width:100%;position:relative">
                <!--扇形图（昨日状况）-->
                <div style="width:30%;height:50%;display:inline-block">
                     <div name="pie_chart_container" class="" style="width:100%;height:100%;text-align:left"></div>
                </div>               
                <!--柱状图(问题总览)-->
                <div style="width:67%;height:50%;display:inline-block">
                    <div name="bar_chart_container" style="width:100%%;height:100%;" ></div>
                </div>
                <!--线形图（在离线率）-->
                <div name="line_chart_container" style="width:95%;height:50%;display:inline-block;margin:0 auto">
                     <div class="his-row" style="height:13%">
                        <div class="his-title">应用市场监测</div>
                        <!--<div class="his-term item">
                            <span>应用类型</span>
                            <div class="input">
                                <el-select v-model="collType" placeholder="请选择" :clearable="true">
                                <el-option
                                v-for="kind in dict_tables.soft_type"
                                :key="kind.code"
                                :label="kind.name"
                                :value="kind.value">
                                </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="his-term item">
                            <span>来源市场:</span>
                            <div class="input">
                                <el-input placeholder="来源市场" v-model="source_market"></el-input>
                            </div>
                        </div>-->
                        <div class="his-term item">
                            <span>来源市场:</span>
                            <div class="input">
                                <el-select v-model="source_market" placeholder="请选择" :clearable="true">
                                <el-option
                                v-for="kind in dict_tables.app_markets"                           
                                :label="kind.name"
                                :value="kind.value">
                                </el-option>
                                </el-select>
                            </div>
                        </div>

                        <div class="optionBar">
                            <div class="el-tooltip item " :class="{active: changeChart=='bar'}" @click="changeChartSty('bar')">
                                    <div class="el-tooltip__rel" ><i class="fa fa-area-chart"></i></div>
                            </div> 
                            <!--<div class="el-tooltip item" :class="{active: changeChart=='line'}" @click="changeChartSty('line')">
                                <div class="el-tooltip__rel"><i class="fa fa-line-chart"></i></div>
                            </div>-->
                            <div class="el-tooltip item" title="导出数据" @click="ExportOnlineCount()">
                                <div class="el-tooltip__rel">
                                    <i class="fa fa-level-down"></i>
                                </div>
                            </div>  
                        </div>        
                    </div>
                    <!--在离线率图表显示区域-->
                    <div class="chart_container" style="width:100%;height:87%;display:inline-block">
                        <!--在离线率柱状图-->
                        <div name="his_bar_chart_container" style="margin:0 auto;width:100%;height:100%" v-show="changeChart=='bar'"></div>
                        <!--在离线率线形图-->
                        <div name="his_line_chart_container" style="margin:0 auto;width:100%;height:100%" v-show="changeChart=='line'"></div>
                    </div>
                </div>
                <!--违规APP信息列表显示-->
                <div class="analysis_list" :class="{ 'noAnimateHide': problemTable=='0', 'noAnimateShow': problemTable=='1','animateShow': problemTable=='2','animateHide': problemTable=='3'}">
                    <div style="" class="drag-info" @click="changeProblemFun(false)">
                        <div>违规APP信息&nbsp;&nbsp;<span style="font-size:40px;line-height:10px">︿</span></div>                        
                    </div>
                    <div class="option">
                        <div class="item">
                            <span>违规分类:</span>
                            <div class="input">
                                <el-select v-model="queryProblem.violations_type" placeholder="请选择" >
                                <el-option
                                v-for="kind in dict_tables.violations_type"                           
                                :label="kind.name"
                                :value="kind.value">
                                </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="item" >
                            <el-button type="primary" @click="queryProblem_click()"><i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i><span v-show="!blnSearch">搜索</span></el-button>
                        </div> 

                    </div>
                    <ul class="header">
                        <li class="item">
                            <div><span class="overflow" style="width:115px;">应用名称</span></div>
                            <!--<div><span class="overflow" style="width:100px;">应用分类</span></div>-->
                            <div><span class="overflow" style="width:150px;">来源应用市场</span></div>
                            <div><span class="overflow" style="width:70px;">版本号</span></div>
                            <!--<div><span class="overflow" style="width:150px;">更新时间</span></div>-->
                            <div><span class="overflow" style="width:80px;">下载次数</span></div>
                            <div><span class="overflow" style="width:60px;">好评率</span></div>
                            <div><span class="overflow" style="width:135px;">应用开发商</span></div>
                            <div><span class="overflow" style="width:60px;">违规分类</span></div>
                            <div><span class="overflow" style="width:190px;">违规原因</span></div>
                            <!--<div><span class="overflow" style="width:50px;">操作</span></div>-->
                        </li>
                    </ul>
                    <div class="content" style="height: calc(100% - 50px - 60px - 60px);background-color: #eee;">
                        <Scroll :listen="dataProblem" ref="ABC">
                            <ul class="body">
                                <li class="item" style="text-align:center;display: table-caption;" v-if="showDataProblem.length<=0&&!blnLoading">暂无数据</li>
                                <li v-for="(d,i) in showDataProblem" class="item" >
                                    <div  :title="d.app_name"  @click="searchSiteDetail(d.app_id)"><span class="overflow sit-click" style="width:115px;">{{d.app_name}}</span></div>
                                    <!--<div  :title="d.app_id" ><span class="overflow" style="width:100px;">{{d.app_id}}</span></div>-->
                                    <div class="align" :title="d.source_market"><span class="overflow" style="width:150px;">{{d.source_market}}</span></div>
                                    <div  :title="d.version"><span class="overflow" style="width:70px;">{{d.version}}</span></div>
                                    <!--<div  :title="d.update_time"><span class="overflow" style="width:150px;" >{{d.update_time}}</span></div>-->
                                    <div  :title="d.donwload_times"><span class="overflow" style="width:80px;">{{d.download_times}}</span></div>
                                    <div  :title="d.evaluation_index"><span class="overflow" style="width:60px;">{{d.evaluation_index}}</span></div>
                                    <div  :title="d.app_devp"><span class="overflow" style="width:135px;">{{d.app_devp}}</span></div>
                                    <div  :title="d.name"><span class="overflow" style="width:60px;">{{d.name}}</span></div>
                                    <div class="align" :title="d.illegal_reason"><span class="overflow" style="width:190px;">{{d.illegal_reason}}</span></div>
                                    <!--<div  title="查看详情" @click="searchSiteDetail(d.app_id)"><span class="overflow sit-click" style="width:50px">详细</span></div>-->

                                </li>
                            </ul>
                        </Scroll>
                    </div>
                    <div class="page_container">
                        <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageNumProblem+1}}</span></span>
                        <div class="firstPage" @click="pageProblemChange(0)">首页</div>
                        <div class="prePage" @click="pageProblemChange(pageNumProblem-1)">上一页</div>
                        <div class="nextPage" @click="pageProblemChange(pageNumProblem+1)">下一页</div>
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
import {HisPercentageExport,GetAppList,GetAppDetail,BODY_RESIZE,GetViolationsAppList,GetAppGreenPreExport,ExportAppList,
        GetAppViolations,GetAppGreenPre,Get_OPerate_Data,GetSiteList,GetSiteDeviceList,getDictTables,
        SiteDetectColl,SiteDetail,SiteHisPercentage,LastPercentage} from '../store/mutation-types'
export default {
  name: 'mobileAppPage',
  components:{
      Scroll,
      PlaceSearch,
      cSelect,
      MapSite,
      
    },
    watch:{
        collType () {
            this.getOnOffLineData();
        },
        source_market(){
            this.getOnOffLineData();
        },
        viewTable(){
            if(this.viewTable=="statistics"){
                if(this.myLineChart){
                    setTimeout(()=>{
                        this.myLineChart.resize(); 
                    })                          
                };
                if(this.myOnOffBarChart){
                    setTimeout(()=>{
                        this.myOnOffBarChart.resize();
                    })                                                      
                };
                if(this.myPieChart){
                    setTimeout(()=>{
                        this.myPieChart.resize(); 
                    })                                                    
                } ;        
                if(this.myBarChart){
                    setTimeout(()=>{
                        this.myBarChart.resize();
                    })                                                     
                }                  
            }
        },     
        blnExport(){
            this.selIds=[];
        } 
    },
  data () {
    return {
        qweqwe:[],
        siteType:[],          //场所类型
        siteState:[{name:'在线',val:true},{name:'离线',val:false}],
        siteSource:[],                  //数据来源
        viewTable:"statistics",                //列表，地图和统计相互切换的标识
        blnLoading:true,                //加载中标识
        pageNum:0,                      //当前页号（0开始计数）
        pageNumProblem:0,                      //当前页号（0开始计数）违规列表
        dict_tables:{},                 //字典信息集合
        myPieChart:"",  
        myBarChart:"",
        myLineChart:"",   
        myOnOffBarChart :"",
        source_market:"",          //来源市场  柱状图的筛选条件
        problemTable:'0',              //违规详情列表与页面切换标识（0:不显示，无动画    1： 显示 无动画  2：显示，临时动画   3：隐藏，临时动画）
        is_illegalAll:[{name:'否',val:'0'},{name:'是',val:'1'}],        //是否违规选择条件


        //staticTime:[{name:'近一周',val:'week'},{name:'近一月',val:'month'}],
        collType:'',              //数据采集趋势率统计状态默认为近一周    
        changeChart:"bar",             //场所在线率柱状图与条形图的相互切换标识
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
            limit:20,//每页10条
            skip:0,//跳过0条
            app_name:'',//应用名称
            source_market:"",//来源市场
            app_devp:"",//应用开发商
            is_illegal:"",//是否违规，0否，1是
        },
        queryProblem:{
            limit:20,//每页10条
            skip:0,//跳过0条
            violations_type:"",   //违规分类
        },
        case_address_w:0,
        data:[
        ],
        dataProblem:[
        ],
        newObject:{
            primaryKey:"netbar_info|netbar_wacode",
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
    //this.elWidth=$(this.$el).width();
    //this.elHeight=$(this.$el).height();

    this.refreshPage();
    this.getOnOffLineData();
    this.getYesdayData();
    this.layout();

    this.$store.commit(BODY_RESIZE,()=>{
        this.layout();
        if(this.myLineChart){
            this.myLineChart.resize();              
        };
        if(this.myOnOffBarChart){
            this.myOnOffBarChart.resize();              
        };
        if(this.myPieChart){
            this.myPieChart.resize();             
        } ;        
        if(this.myBarChart){
            this.myBarChart.resize();             
        }                
    });
  },
  computed:{
      showData(){
          return _.map(this.data,r=>{
                return {
                    app_name:r.app_name,
                    app_id:r.app_id,
                    source_market:r.source_market,
                    version:r.version,
                    update_time:r.update_time,
                    download_times:r.download_times,
                    evaluation_index:r.evaluation_index,
                    app_devp:r.app_devp,
                    is_illegal:r.is_illegal,
               
                }
            });
      },
      showDataProblem(){
          return _.map(this.dataProblem,r=>{
                return {
                    app_name:r.app_name,
                    app_id:r.app_id,
                    source_market:r.source_market,
                    version:r.version,
                    update_time:r.update_time,
                    download_times:r.download_times,
                    evaluation_index:r.evaluation_index,
                    app_devp:r.app_devp,
                    is_illegal:r.is_illegal,
                    name:r.name,
                    illegal_reason:r.illegal_reason,

                }
            });
      },
      blnAllSel(){
        let s=this,res=true;
        for(let i=0;i<s.data.length;i++){
            if(_.findIndex(this.selIds,id=>id==s.data[i].app_id)<0){
                res=false;break;
            }
        }
        return res;
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
        //   加载时先清空数据在加载等待动画，请求完后数据加载
        if(this.data){
          this.data=[];
          this.blnLoading=true;
        }
          //获取场所信息
         this.$store.dispatch(GetAppList,this.query).then(res=>{
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
      layout(){
        let optionH=$(this.$el).find('div[name="listOption"]').height();
        this.listBodyH=`calc(100% - 40px - 50px - 20px - ${optionH}px)`;
        this.$nextTick(()=>{
            this.$refs.indList.reloadyScroll();
        });
      },
    //   //区域范围的事件回传，第一个参数为上下文环境，第二个参数为具体值,因为该页面为单独定制没有上下文，因此取第二个值即可
    //   selectArea(val,data){
    //     if(data){
    //         this.query.region_range=data.regions;
    //     }else{
    //         this.query.region_range="";
    //     }
    //   },
    //   //场所范围的事件回传，第一个参数为上下文环境，第二个参数为具体值,和区域范围选择类似
    //   selectSite(val,data){ 
    //     if(data){           
    //         this.query.netsite_range=data.sites;
    //     }else{
    //         this.query.netsite_range="";
    //     }
    //   },
      //列表，地图和统计相互切换  
      switchView(type){
          if(type==this.viewTable) return
          this.viewTable=type;
        if(type=="list"){
            this.$nextTick(()=>{
                this.layout();
            });
        }else{
            this.$nextTick(()=>{
                this.$refs.ABC.reloadyScroll();
            });         
        }          
      },
        // 获取场所在离线数据
      getOnOffLineData(){
         this.$store.dispatch(GetAppGreenPre,{source_market:this.source_market,soft_type:this.collType}).then(res=>{
           if(res.msg.code!='successed')return;
           this.weekOnOffLIne=res.biz_body;
           //this.addOfflineLineChart(this.weekOnOffLIne);     //加载折线图
           this.addOfflineBarChart(this.weekOnOffLIne)
         });
      },
      //app概括统计
      getYesdayData(){
         this.$store.dispatch(GetAppViolations).then(res=>{
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
      //加载扇形图(饼图)app概括统计
      loadPieChart(data){
        let myaPieChart=$(this.$el).find('div[name="pie_chart_container"]')[0]
        this.myPieChart = echarts.init(myaPieChart);
        var option = {
            title: [{
                text: 'App概况',
                x : 50, 
                textStyle: {  
                    fontSize: 19,
                    fontWeight:900,
                }, 
            },{
                text: 'App总量：'+(parseInt(data.pie.green)+parseInt(data.pie.violations)),
                x : 50, 
                y : 110, 
                textStyle: {  
                    fontSize: 13,
                    fontWeight:"normal",
                }, 
            }],
            tooltip: {
                trigger: 'item',
                formatter: "{b} ({d}%)"
            },
            legend: {
                orient : 'vertical',  
                x : 50,  
                y : 30,
                itemHeight:20,
                selectedMode:false,
                padding:[20,5,20,5],
                textStyle: {  
                    fontSize: 13,
                }, 
                data:['绿色：'+data.pie.green,'违规：'+data.pie.violations]  
            },
            series: [{
                name: '',
                type: 'pie',
                radius:"76%",
                center: ['65%','55%'],
                data: [
                    {
                        name: '绿色：'+data.pie.green, 
                        value: data.pie.green,
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
                        name: '违规：'+data.pie.violations, 
                        value: data.pie.violations,
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
                    }
                ]
            }]
        };
        this.myPieChart.setOption(option);
      },
       //加载柱状图 app概括统计   
      loadBarChart(data){
        let myaBarChart=$(this.$el).find('div[name="bar_chart_container"]')[0]
        this.myBarChart = echarts.init(myaBarChart);
        option = {
            title: {
                text: '违规App'
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
                data: ['权限异常','反动','博彩','病毒','色情','暴力'],
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
                    name: '2011年',
                    type: 'bar',
                    //label: labelOption,
                    barWidth : 25,//柱图宽度
                    itemStyle:{  
                        normal:{  
                            color: function (params){
                                var colorList = ['rgb(147, 160, 176)','rgb(189, 202, 218)','rgb(249, 201, 129)','rgb(253, 188, 96)','rgb(254, 169, 50)','rgb(255, 150, 0)'];
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
                    data: [data.hist.authority,data.hist.reactionary,data.hist.gambling, data.hist.virus, data.hist.pornographic, data.hist.violence]
                }
                
            ]
        };
        this.myBarChart.setOption(option);
        let that=this;
        this.myBarChart.on('click', function (params) {
            for(let any of that.dict_tables.violations_type){
                if(any.name==params.name){
                    that.queryProblem.violations_type=any.value;
                }
            }            
            that.changeProblemFun(true);
        });
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
        let time=[],inLineData=[],offLineData=[];
        for(let i=0;i<data.length;i++){
            time.push(data[i].source_market);
            inLineData.push((data[i].green_num))
            offLineData.push((data[i].violations_num))
            //abnormalsData.push(data[i].abnormals_num)
        }
        option = {
            tooltip: {
                trigger: 'axis',
                //formatter: '{b}<br/>{a0}: {c0} <br/>{a1}:{c1}',                
                axisPointer: {
                    type: 'shadow',
                    label: {
                        show: true
                    }
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
                data:['健康数','违规数']  
            },
            grid:{	//设置图标距离
                left: 50,
                right: 50,
            },              
            xAxis: {

                type: 'category',
                data: time
            },
            yAxis: {
                type: 'value',
                xisLabel: {
                        formatter: '{value} '
                    },
                    axisLabel: {
                        formatter: '{value} '
                    },
            },
            series: [{
                name:"健康数",
                itemStyle: {
                    normal: {
                        color:'#85C226',
                        label: {
                            formatter: '{c}'
                        }
                    }
                },
                data: inLineData,
                type: 'bar'
            },
            {
                name:"违规数",
                itemStyle: {
                    normal: {
                        color:'#F8C301',
                        label: {
                            formatter: '{c}'
                        }
                    }
                },                
                data: offLineData,
                type: 'bar'
            },
        
            ]
        };
        this.myOnOffBarChart.setOption(option);
    },
      //导出统计场所状态率
      ExportOnlineCount(){
          this.$store.dispatch(GetAppGreenPreExport,{source_market:this.source_market,soft_type:this.collType}).then(res=>{
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
          this.$store.dispatch(GetAppList,this.query).then(res=>{
              this.blnSearch=false;
              this.blnLoading=false;
              if(!tool.msg(res,'','搜索失败!'))return;
              this.data=res.biz_body;
          });
      },
      //查询按钮(搜索)违规APP
      queryProblem_click(){
          //this.data=[];
          //this.blnSearch=true;
          //this.blnLoading=true;
          this.pageNumProblem= 0;
          this.queryProblem.skip=this.pageNumProblem*this.queryProblem.limit;
          this.$store.dispatch(GetViolationsAppList,this.queryProblem).then(res=>{
              //this.blnSearch=false;
              //this.blnLoading=false;
              if(!tool.msg(res,'','搜索失败!'))return;
              this.dataProblem=res.biz_body;
          });
      },      
      //页码切换(分页)
       pageChange(index){ 
          this.pageNum=index>0? index : 0;
          this.query.skip=this.pageNum*this.query.limit;
          this.$store.dispatch(GetAppList,this.query).then(res=>{
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
      //页码切换(分页违规APp
       pageProblemChange(index){ 
          this.pageNumProblem=index>0? index : 0;
          this.queryProblem.skip=this.pageNumProblem*this.queryProblem.limit;
          this.$store.dispatch(GetViolationsAppList,this.queryProblem).then(res=>{
            if(!tool.msg(res))return;
            let data=res.biz_body;

            if(data.length<=0){
                tool.msg({msg:{code:'successed'}},'已经到了最后页!','已经到了最后页!');
                this.pageNumProblem =this.pageNumProblem-1;
                return;
            }

            this.dataProblem=data;
          });
       },

       //查看详情
        searchSiteDetail(siteId){
            let self=this;
            tool.open(function(){
                let html=`<div name="container" style="width:100%;height:100%;padding: 10px;" >
                            <div  class="row">
                                <div class="col-md-12 item_label_left item_label_title">APP基础信息:</div>
                            </div>
                            <div class="row site-detail-row" >
                                <div class="col-md-3 item_label_left" style="height:160px;">
                                    <img :src="icon" class="item_label_img">                               
                                </div>
                                <div class="col-md-9">
                                    <div class="row" style="line-height:30px">
                                        <div class="col-md-2 item_label_left">应用名称：</div>
                                        <div class="col-md-3">{{detailData.app_name}}</div>
                                        <div class="col-md-2 item_label_right">版本号：</div>
                                        <div class="col-md-1" style="padding:0 3px">{{detailData.version}}</div>  
                                        <div class="col-md-2 item_label_right">更新时间：</div>
                                        <div class="col-md-2">{{detailData.update_time}}</div>  
                                    </div>
                                    <div class="row" style="line-height:30px">
                                        <div class="col-md-2 item_label_left">下载次数：</div>
                                        <div class="col-md-3">{{detailData.download_times}}</div>
                                        <div class="col-md-2 item_label_right">好评率：</div>
                                        <div class="col-md-1" style="padding:0 3px">{{detailData.evaluation_index}}</div>  
                                        <div class="col-md-2 item_label_right">是否违规：</div>
                                        <div class="col-md-2">{{detailData.is_illegal}}</div>  
                                    </div>
                                    <div class="row" style="line-height:30px">
                                        <div class="col-md-2 item_label_right">下载地址：</div>
                                        <div class="col-md-10">{{detailData.app_down_url}}</div> 
                                    </div>
                                    <div class="row" style="line-height:20px;text-align:center;color:#aaa;cursor:pointer" title="点击展开" @click="isShowfun">
                                        查看权限要求&nbsp;
                                        <span style="font-size: 19px;font-weight: 700;position: relative;top: 6px" v-show="!isShow">﹀</span>
                                        <span style="font-size: 19px;font-weight: 700;position: relative;top: -3px" v-show="isShow">︿</span>
                                    </div>
                                    <div class="row" style="height:65px;" v-show="isShow">
                                        <div  style="border:1px solid #ccc;padding:3px;height:65px;overflow:auto;margin-right:10px" v-if="detailData.authority">{{detailData.authority}}</div>
                                        <div  style="border:1px solid #ccc;padding:3px;height:65px;overflow:auto;margin-right:10px;text-align: center;color: #999;line-height: 53px;" v-if="!detailData.authority">暂无数据</div>
                                    </div>                               
                                </div>                                
                            </div>
                            <div  class="row">
                                <div class="col-md-3 item_label_left item_label_title">应用截图:</div>
                                <div class="col-md-2 item_label_left" style="position:relative;top:10px;">应用介绍:</div>
                            </div>
                            <div class="row site-detail-row" >
                                <div class="col-md-3 item_label_left" style="height:160px;position:relative">
                                    <div class="left-lunbo-Cli" @click="clickLeftFun()">〈</div>     
                                    <img :src="img" class="item_label_img">    
                                    <div class="right-lunbo-Cli" @click="clickRightFun()">〉</div> 
                                                          
                                </div>
                                <div class="col-md-9">
                                    <div class="row" style="height:160px">                                        
                                        <div style="border:1px solid #ccc;height:120px;overflow:auto;padding:5px;text-indent:10px;margin-right:10px;margin-top: 15px;">{{detailData.introduce}}</div>                                       
                                    </div>
                                
                                </div>                                
                            </div>
                            <div  class="row">
                                <div class="col-md-12 item_label_left item_label_title">开发者信息:</div>
                            </div>
                            <div class="row site-detail-row" >
                                <div class="col-md-2 item_label_right">开发对象：</div>
                                <div class="col-md-4">{{detailData.app_devp}}</div>  
                                <div class="col-md-2 item_label_right">官网地址：</div>
                                <div class="col-md-4">{{detailData.devp_url}}</div>                                                         
                            </div>
                            <div class="row site-detail-row" >
                                <div class="col-md-2 item_label_right">联系电话：</div>
                                <div class="col-md-4">{{detailData.devp_tel}}</div>  
                                <div class="col-md-2 item_label_right">联系邮箱：</div>
                                <div class="col-md-4">{{detailData.devp_mail}}</div>                                                         
                            </div>
                            <div class="row site-detail-row" >
                                <div class="col-md-2 item_label_right">联系地址：</div>
                                <div class="col-md-10"></div>                                                          
                            </div>                                                        
                            <div  class="row">
                                <div class="col-md-12 item_label_left item_label_title">上架市场:</div>
                            </div>
                            <div class="row site-detail-row" >
                                <div class="col-md-2 item_label_right">市场名称：</div>
                                <div class="col-md-4">{{detailData.source_market}}</div>  
                                <div class="col-md-2 item_label_right">市场地址：</div>
                                <div class="col-md-4" :title="detailData.app_market_url" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{detailData.app_market_url}}</div>                                                         
                            </div>
                            <div class="row site-detail-row" >
                                <div class="col-md-2 item_label_right">联系电话：</div>
                                <div class="col-md-4">{{detailData.org_tel}}</div>  
                                <div class="col-md-2 item_label_right">联系邮箱：</div>
                                <div class="col-md-4">{{detailData.org_mail}}</div>                                                         
                            </div>
                            <div class="row site-detail-row" >
                                <div class="col-md-2 item_label_right">所属公司：</div>
                                <div class="col-md-4">{{detailData.app_org}}</div>  
                                <div class="col-md-2 item_label_right">联系地址：</div>
                                <div class="col-md-4">{{detailData.app_org_addr}}</div>                                                         
                            </div> 
                        </div>`;
                let param={
                        title:'App详情',
                        content:html,
                        skin:'app-detail-container',
                        area:['900px','690px'],
                        context:{
                            detailData:{},
                            icon:'',
                            height:'690px',
                            imgs:'',
                            img:"",
                            indexNo:0,
                            isShow:false,
                            loadDetail(){
                                self.$store.dispatch(GetAppDetail,{app_id:siteId}).then(res=>{
                                    if(res.msg.code!='successed')return;
                                    param.selfData.detailData=res.biz_body.detail;
                                    param.selfData.icon='data:image/jpg;base64,'+res.biz_body.pictrue.icon;
                                    param.selfData.imgs=res.biz_body.pictrue.screen;
                                    param.selfData.img='data:image/jpg;base64,'+res.biz_body.pictrue.screen[param.selfData.indexNo].pic;
                                    //param.selfData.detailData.update_time = param.selfData.detailData.update_time ? tool.DateByTimestamp(param.selfData.detailData.update_time,'yyyy-MM-dd hh:mm:ss'):'';
                                });
                            },
                            isShowfun(){
                                 param.selfData.isShow=! param.selfData.isShow
                            },
                            clickLeftFun(){
                                param.selfData.indexNo=param.selfData.indexNo-1;
                                if(param.selfData.indexNo<0){
                                   param.selfData.indexNo =param.selfData.imgs.length-1
                                }
                                param.selfData.img='data:image/jpg;base64,'+param.selfData.imgs[param.selfData.indexNo].pic;
                            },
                            clickRightFun(){
                                param.selfData.indexNo=param.selfData.indexNo+1
                                if(param.selfData.indexNo+1>=param.selfData.imgs.length){
                                   param.selfData.indexNo =0
                                }
                                param.selfData.img='data:image/jpg;base64,'+param.selfData.imgs[param.selfData.indexNo].pic;
                            },                            
                        },
                        success(){
                            param.selfData.loadDetail();    
                        }
                    };

                return param;
            }());             
        },
        // 挂在设备详情
        mountDevice(siteId,name){
            let self=this;
            tool.open(function(){
                let html=`<div name="container" style="width:100%;height:100%;padding: 10px;" >
                            <!--加载中标识-->
                            <div v-if="DeviceblnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;">
                                <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
                            </div>
                            <div class="mount-table">
                                <div class="header">
                                    <div class="mount_item" ><span class="overflow" style="width:180px;">设备编码</span></div>
                                    <div class="mount_item" ><span class="overflow" style="width:130px;">设备名称</span></div>
                                    <div class="mount_item" ><span class="overflow" style="width:70px;">设备状态</span></div>
                                    <div class="mount_item" ><span class="overflow" style="width:150px;">最近联系时间</span></div>
                                    <div class="mount_item" ><span class="overflow" style="width:80px;">问题分类</span></div>
                                    <div class="mount_item" ><span class="overflow" style="width:80px;">问题原因</span></div>
                                    <div class="mount_item" ><span class="overflow" style="width:80px;">数据来源</span></div>
                                    <div class="mount_item" ><span class="overflow" style="width:113px;">安全厂商</span></div>
                                    <div class="mount_item" v-if="deviceData.length>=9"><span class="overflow" style="width:6px;"></span></div>
                                </div>
                                <div class="content" style="height: 393px;overflow-y: auto;">
                                    <div v-if="deviceData.length<=0&&!DeviceblnLoading" class="content">
                                        <div class="mount_item"><span class="overflow" style="width:968px;">暂无数据</span></div>
                                    </div>
                                    <div v-for="(d,i) in deviceData" class="content">
                                        <div class="mount_item" :title="d.equipment_id"><span class="overflow" style="width:180px;">{{d.equipment_id}}</span></div>
                                        <div class="mount_item" :title="d.equipment_name"><span class="overflow" style="width:130px;">{{d.equipment_name}}</div>
                                        <div class="mount_item" :title="d.online_state" :class="[{red : d.online_state=='异常'},{green : d.online_state=='在线'}]"><span class="overflow" style="width:70px;">{{d.online_state}}</span></div>
                                        <div class="mount_item" :title="d.capture_time"><span class="overflow" style="width:150px;">{{d.capture_time}}</span></div>
                                        <div class="mount_item" :title="d.problem_type"><span class="overflow" style="width:80px;">{{d.problem_type}}</span></div>
                                        <div class="mount_item" :title="d.problem_reson"><span class="overflow" style="width:80px;">{{d.problem_reson}}</span></div>
                                        <div class="mount_item" :title="d.microprobe_type"><span class="overflow" style="width:80px;">{{d.microprobe_type}}</span></div>
                                        <div class="mount_item" :title="d.security_software_orgname"><span class="overflow" style="width:113px;">{{d.security_software_orgname}}</span></div>                               
                                    </div>
                                </div>
                            </div>
                        </div>`;
                let param={
                        title:'挂载设备详情（'+name+'）',
                        content:html,
                        skin:'device-detail-container',
                        area:['1020px','500px'],
                        components:{Scroll},
                        context:{
                            deviceData:"",
                            DeviceblnLoading:true,   //加载中标识
                            data:[],
                            loadDevice(data){
                                self.$store.dispatch(GetSiteDeviceList,data).then(res=>{
                                    if(res.msg.code!='successed')return;
                                    param.selfData.DeviceblnLoading=false;
                                    param.selfData.deviceData= res.biz_body;
                                    for( let ary of param.selfData.deviceData){
                                       ary.capture_time=ary.capture_time ? tool.DateByTimestamp(ary.capture_time,'yyyy-MM-dd hh:mm:ss'):"";
                                   };

                                });
                            }
                        },
                        success(){
                            param.selfData.loadDevice({netbar_wacode:siteId});
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
                                    tooltip: {
                                        trigger: 'axis',
                                        axisPointer: {
                                            type: 'shadow',
                                            label: {
                                                show: true
                                            }
                                        }
                                    },
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
        // 问题总览列表与分析图表页面相互切换
      changeProblemFun(val){
          if(val){
                        
            setTimeout(()=>{
               // this.data=[];
               // this.blnSearch=true;
                //this.blnLoading=true;
                //this.pageNum= 0;
               // this.query.skip=this.pageNum*this.query.limit;
                this.$store.dispatch(GetViolationsAppList,this.queryProblem).then(res=>{
                   // this.blnSearch=false;
                   // this.blnLoading=false;
                    if(!tool.msg(res,'','搜索失败!'))return;
                    this.dataProblem=res.biz_body;
                    //console.log(this.dataProblem);
                    this.problemTable='2';
                    setTimeout(()=>{
                        this.problemTable='1';    
                    },500)  
                    this.$nextTick(()=>{
                        this.$refs.ABC.reloadyScroll();
                    });
                });
            },40)            
          }else{
                this.problemTable='3';
                setTimeout(()=>{
                    this.problemTable='0';    
                },500) 
          }
      },
      //全选/取消全选
      selAll(){
        let s=this;
        if(s.blnAllSel){
            for(let i=0;i<s.data.length;i++){
                let index=_.findIndex(s.selIds,id=>id==s.data[i].app_id);
                if(index<0) continue;
                s.selIds.splice(index,1);
            }
        }else{
            for(let i=0;i<s.data.length;i++){
                let index=_.findIndex(s.selIds,id=>id==s.data[i].app_id);
                if(index>=0) continue;
                s.selIds.push(s.data[i].app_id);
            }
        }
      },
      //单选
      selItem(d){
        let index=_.findIndex(this.selIds,id=>id==d.app_id);
        if(index>=0){
            this.selIds.splice(index,1);
        }else{
            this.selIds.push(d.app_id);
        }
      },
      blnSelItem(d){
        return _.findIndex(this.selIds,id=>id==d.app_id)>=0;
      },
      exportList(){
        if(this.exportDataing) return;
        this.exportDataing=true;
          
        this.$store.dispatch(ExportAppList,{
            app_name:this.query.app_name,           //应用名称
            source_market:this.query.source_market, //来源市场
            app_devp:this.query.app_devp,           //应用开发商
            is_illegal:this.query.is_illegal,        //是否违规，0否，1是
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
<style lang="less">
    /* 场所详情样式*/
   .app-detail-container .layui-layer-title{
        background-color: #03ab67;
        font-weight: 700;
        color:#fff;
    }
    .app-detail-container .site-detail-row{
        margin: 0px;
        line-height: 30px;

    }
    .app-detail-container .site-detail-row .item_label_left{
        text-align: right;

    }
    .app-detail-container .item_label_title{
        font-weight: 900;
        text-indent: 10px;
        line-height: 25px;
    }
    .app-detail-container .item_label_img{
        width: 120px;
        height: 130px;
        display: block;
        margin: 9px auto;
    }
    .app-detail-container .left-lunbo-Cli{
        position: absolute;
        height: 100%;
        left: 4px;
        line-height: 160px;
        font-size: 36px;
        cursor: pointer;
        color: #888;
        user-select: none;
    }
    .app-detail-container .right-lunbo-Cli{
        position: absolute;
        height: 100%;
        right: 4px;
        line-height: 160px;
        top: 0;
        font-size: 36px;
        cursor: pointer;
        color: #888;
        user-select: none;
    }
    .app-detail-container .site-detail-row .item_label_right{
        text-align: right;

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
  .CaseManage{width:100%;height:100%;overflow:hidden;padding:5px;}
  .CaseManage_container{width:100%;height:100%;}
  .CaseManage .body,
  .CaseManage .header{width: 100% !important;list-style: none;padding-left: 0px;padding: 0px;margin-bottom:0px;display:table;}
  .CaseManage .body .item,
  .CaseManage .header .item{line-height: @rowH;height: @rowH;text-align: left;margin: 0px;display: table-row;width: 100%;color: white;}
  html{.TCol(~".CaseManage .header .item",'bg');}
  
  .CaseManage .body .item > div,
  .CaseManage .header .item > div{display: table-cell;.border('bottom');.border('right');padding: 0px 0px 0px 0px;vertical-align: middle;text-align:center;}

  .CaseManage .body .item{background-color:white;color:@HeaderBgCol;}

  .CaseManage .body .item .sep,
  .CaseManage .header .item .sep{border-right:2px solid @FontCol;}
  .CaseManage .body .item .option,
  .CaseManage .header .item .option{width:120px;background-color: inherit;}
  .CaseManage .body .item .count_item,
  .CaseManage .header .item .count_item{width:80px;}

  .CaseManage .body .item .option .overflow > span{border:none;font-size:12px;display: initial;margin-right:5px;}
  .CaseManage .body .item .option .overflow > span:hover{cursor:pointer;}
  html{.TCol(~".CaseManage .body .item .option .overflow > span:hover");}

  .CaseManage .item .overflow{margin:0 auto;}
  .CaseManage .body .item .align .overflow{text-align:left}
  .CaseManage .body .item .overflow.sit-click{
      color:#03ab67;
      font-weight:bolder;
  }
 .CaseManage .body .item .overflow.sit-click:hover{
      cursor:pointer;
      text-decoration:underline;
  }
  @optionH:50px;
  .CaseManage .option{width:100%;background-color: white;}
  .CaseManage .page_container{.border('top');.border('bottom');background-color:white;position: absolute;bottom: 2px; }
  .CaseManage .content{width:100%;height:~'calc(100% - @{optionH} - 60px - 30px)';}

  .CaseManage .header .item .dropDown{position: absolute;z-index: 100;top: 35px;line-height: initial;margin-left: 5px;
        width: calc(100% - 10px);
        color: black;
        text-align:left;
        background-color: white;
        -moz-box-shadow: 2px 2px 2px #333333;
        -webkit-box-shadow: 2px 2px 2px #333333;
        box-shadow: 2px 2px 2px #333333;
        font-size: 12px;
  }

  .CaseManage .header .item .dropDown div{.border('bottom');line-height:25px;padding:0px 10px;}
  .CaseManage .header .item .dropDown div:hover{color:white;cursor:pointer;}
  html{.TCol(~".CaseManage .header .item .dropDown div:hover",'bg');}

  .CaseManage .header .item .title_content{position:relative;}

  .CaseManage .option{text-align: initial;padding:10px;}
  .CaseManage .option .item{display:inline-block;margin: 2px 0;}
  .CaseManage .option .item .input{display:inline-block;}
  .CaseManage .tag_label:hover{color:@btn_Bg_Col_hover_1;}

  .CaseManage .body .item .count_item:hover{cursor:pointer;}
  html{.TCol(~".CaseManage .body .item .count_item:hover");}

  .overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}
  .stiepage .tagComp[data-v-033fe12d]{
    height: 100%;
    width: 100%;
    padding: 2px 0px;
    text-align: left;
  }
  .stiepage .tagComp .item{
    display: inline-block;
    height: 100%;
    min-width: 50px;
    text-align: center;
    margin: 0px 5px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.35, 0.52, 0.33, 0.98) 0s;
  }
  .stiepage .tagComp .item.active{
    background-color: #03ab67;
    color: white;
    border-radius: 5px;
  }
  .stiepage .tagComp .item:hover{
    background-color: #03ab67;
    color: white;
    border-radius: 5px;
  }
  .stiepage .tagComp .item .item_containner{
    display: table;
    height: 100%;
    width: 100%;
    padding: 0px 10px;
  }
  .stiepage .tagComp .item .item_container .content{
    display: table-cell;
    vertical-align: middle;
    padding: 5px 10px;
  }
  .stiepage .tagComp .item .item_container .content i{
    margin-right: 5px;
  }
  .stiepage .chart_container .his-row{
    height:40px;
    width:100%;      
  }
  .stiepage .chart_container .his-row div{
    display: inline-block;
  }   
  .stiepage .chart_container .his-row .his-title{
    float: left;
    margin-left: 30px;
    font-size: 19px;
    font-weight: 900;  
  }

    .stiepage .red{color:red}
    .stiepage .green{color:green}
  .stiepage .chart_container .his-row .his-term{
    float: left;
    margin-left: 40px;
  }
  .stiepage .chart_container .his-row .optionBar{
    float: right;
    margin-right: 50px;
  }
  .stiepage .chart_container .his-row .optionBar .el-tooltip{
    margin-right:10px;
  }
  .stiepage .chart_container .his-row .optionBar .el-tooltip:hover{
    cursor: pointer;
    color: #03ab67;
  }  
  .stiepage .chart_container .his-row .optionBar .el-tooltip.active{
    cursor: pointer;
    color: #03ab67;
  }  
 .stiepage .chart_container .analysis_list{
    height: calc(100%);
    width:100%;
    position:absolute;
    top:0px;
  }  
  .analysis_list .drag-info{
    height: 30px;
    width:100%;
    background-color:#eee;
  }
  html{.TCol(~".analysis_list .drag-info div",'bg');}
  .analysis_list .drag-info div{
    width: 100%;
    height: 100%;
    border-radius: 5px;
    text-align: center;
    color:#fff;
    line-height: 34px;
    cursor:pointer;
    font-Weight:800;
  }
  //不加载动画直接显示
  .stiepage .chart_container .analysis_list.noAnimateShow{
    top:0;  
    display: block;      
  }
  //不加载动画直接影藏
  .stiepage .chart_container .analysis_list.noAnimateHide{
   top:2000px;      
   display: none;   
  }
  /*加载动画，逐渐出现 */
  .stiepage .chart_container .analysis_list.animateShow{
    animation: startAit 0.5s;
    -moz-animation: startAit 0.5s;	/* Firefox */
    -webkit-animation: startAit 0.5s;	/* Safari 和 Chrome */
    -o-animation: startAit 0.5s;	/* Opera */
    top:0;
  }
    /*加载动画，逐渐消失 */
  .stiepage .chart_container .analysis_list.animateHide{
    animation: finishAit  0.5s;
    -moz-animation: finishAit  0.5s;	/* Firefox */
    -webkit-animation: finishAit  0.5s;	/* Safari 和 Chrome */
    -o-animation: finishAit  0.5s;	/* Opera */
    top:2000px;        //将这个值改为一个较大的数值，必须远超屏幕高度，用于做动画效果
  }
  //css动画
  @keyframes startAit{
        0% {
            top:1000px;
            display:block;
        }
        100% {
            top:0px;
            display:block;
        }                
    }
  @keyframes  finishAit{
        0% {
            top:0;
            display:block;
        }
        100% {
            top:1000px;
            display:none;
        }                
  } 

.stiepage  .exportSel{cursor:pointer;}
html{.TCol(~".stiepage .exportSel:hover");}
html{.TCol(~".stiepage .exportSel.active");}
html{.TCol(~".stiepage .exportBtn:hover");}
.stiepage .cursor{cursor:pointer;}
</style>
