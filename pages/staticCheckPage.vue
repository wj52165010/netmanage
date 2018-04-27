<!-- 统计考核定制页面组件  created by Chuanjiang Li 2018/04/20 -->
<template>
    <div class="BasePage">
       <div class="base_conatiner">
       <!--加载中标识-->
        <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index:100;">
            <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;"><i class="fa fa-spinner fa-pulse" style="color:#98e32c;"></i></div></div>
        </div>
        <!--相关页面过滤条件-->
        <div class="filter_container">

            <!--详细统计页面过滤条件-->
            <div class="detail_filter" v-show="pageIndex==1">
                <div style="height:100%;float:left;" v-show="countIndex==0">
                    <div style="width:150px;display:inline-block;">
                        <el-select v-model="region" clearable placeholder="选择区域">
                            <el-option
                            v-for="kind in regions"
                            :key="kind.code"
                            :label="kind.name"
                            :value="kind.code">
                            </el-option>
                        </el-select>
                    </div>
                    <div style="width:150px;display:inline-block;">
                        <el-select v-model="firm" clearable placeholder="选择厂商">
                            <el-option
                            v-for="kind in firms"
                            :key="kind.code"
                            :label="kind.name"
                            :value="kind.code">
                            </el-option>
                        </el-select>
                    </div>
                    <div style="width:200px;display:inline-block;">
                        <el-select v-model="dataSource" clearable placeholder="数据来源1">
                            <el-option
                            v-for="kind in dataSources"
                            :key="kind.code"
                            :label="kind.name"
                            :value="kind.code">
                            </el-option>
                        </el-select>
                    </div>
                    <div style="width:220px;display:inline-block;">
                        <el-date-picker v-model="commonTime" type="daterange" placeholder="选择日期范围" :picker-options="limitTime" style="width: 220px"></el-date-picker>
                    </div>
                </div>

                <div style="height:100%;float:left;" v-show="countIndex==1">

                    <div style="width:250px;display:inline-block;">
                        <MulDropDwon :data="Listfirm" keyProp="name" id="code" placeholder="选择厂商">
                            <div v-for="t in firms" @mousedown="detail_list_firmClick(t)">{{t.name}}</div>
                        </MulDropDwon>
                    </div>

                   
                    <div style="width:220px;display:inline-block;">
                        <el-date-picker v-model="countTime" type="daterange" placeholder="统计时间" :picker-options="limitTime" style="width: 220px"></el-date-picker>
                    </div>
                </div>

                <div class="optionBar" style="float:right;line-height: 40px;">
                    <el-tooltip class="item" :class="{active:countIndex==0}" effect="light" content="图表" placement="top">
                        <i class="fa fa-area-chart" @click="countIndex=0"></i>
                    </el-tooltip>
                    <el-tooltip class="item" :class="{active:countIndex==1}" effect="light" content="列表" placement="top">                        
                        <i class="fa fa-bars" @click="countIndex=1"></i>
                    </el-tooltip>
                    <el-tooltip class="item" effect="light" content="导出数据" placement="top">                        
                        <i class="fa fa-level-down" @click="ExportDetailCount()"></i>
                    <el-tooltip>
                </div>
            </div>
        </div>

        <HTag :tags="pages" @change="tagChange">
                <div slot="t0" style="height:100%;width:100%;">
                    <!--基础数据-->
                    <div class="header">
                        <titleComp title="基础数据" />
                    </div>
                    <div class="base_container">
                        <tag v-for="tag in tags" 
                            :title="tag.name" 
                            :num="tag.num" 
                            :info="tag.info" 
                            :icon="tag.icon" 
                            :tip="tag.tip" 
                            :subTip="tag.subTip" 
                            :bottomTip="tag.bottomTip"
                            :rightTitle="tag.right_title" 
                        />
                    </div>
                    <!--在离线统计-->
                    <div class="header">
                        <div class="titleComp" style="cursor:pointer;display:inline-block;">
                            <i class="fa fa-caret-down" style="font-size:18px;" ></i>
                            <span style="font-style: italic;">在离线统计</span>
                            <!--类型切换-->
                            <span class="tag_label" style="margin-left:10px;cursor:pointer;" v-for="k in kinds" @click="kindchange(k)">
                                <i :class="k.icon" style="margin-right:5px;"></i>{{k.name}}
                            </span>
                        </div>
                        <div style="width:250px;display:inline-block;">
                            <MulDropDwon :data="Selfirms" keyProp="name" id="code" placeholder="选择厂商">
                                <div v-for="t in firms" @mousedown="firmClick(t)">{{t.name}}</div>
                            </MulDropDwon>
                        </div>
                        <div style="display:inline-block;margin-left:10px;width:130px;">
                            <el-select v-model="timeRageVal" clearable placeholder="时间范围">
                                <el-option
                                v-for="item in timeRange"
                                :key="item.val"
                                :label="item.name"
                                :value="item.val">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="optionBar">
                            <el-tooltip class="item" :class="{active:optionIndex==0}" effect="light" content="厂商在离线详情" placement="top">
                                <i class="fa fa-area-chart" @click="optionIndex=0"></i>
                            </el-tooltip>
                            <el-tooltip class="item" :class="{active:optionIndex==1}" effect="light" content="厂商在离线率" placement="top">                        
                                <i class="fa fa-line-chart" @click="optionIndex=1"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="light" content="导出数据" placement="top">                        
                                <i class="fa fa-level-down" @click="ExportOnlineCount()"></i>
                            <el-tooltip>
                        </div>
                    </div>
                    <!--图表显示区域-->
                    <div class="chart_container" >
                        <!--柱状图-->
                        <div name="chart_container" v-show="optionIndex==0" :class="{fadeIn:optionIndex==0}" style="width:100%;height:100%;"></div>
                        <!--线形图-->
                        <div name="line_chart_container" v-show="optionIndex==1" :class="{fadeIn:optionIndex==0}" style="width:100%;height:100%;"></div>
                    </div>
                </div>
                <div slot="t1" style="height:100%;width:100%;text-align:left;">

                    <!--图表显示-->
                    <div style="width:100%;height:100%;" class="fadeIn" v-show="countIndex==0">
                        <div class="count_item" v-for="i in detais">
                            <LineCount ref="lineCount" 
                                :name="i.name" 
                                :keyWord="i.key" 
                                :time="i.time"
                                :region="region"
                                :firm="firm" 
                                :microprobe="dataSource"
                            />
                        </div>
                    </div>

                    <!--列表显示-->
                    <div style="width:100%;height:100%;" class="fadeIn" v-show="countIndex==1">
                        <!--列表头-->
                        <div class="base_table_header">
                            <div class="column_1">
                                厂商
                            </div>
                            <div class="column_2">
                                <div class="row_1">
                                    <div class="item">数据上传详情</div><div class="item">数据上传质量</div>
                                </div>
                                <div class="row_2">
                                    <div class="item">
                                        <div class="sep">网吧</div>
                                        <div class="sep">无线WIFI采集</div>
                                        <div class="sep">特征采集设备</div>
                                        <div class="sep">合计</div>
                                    </div><div class="item">
                                        <div class="sep">实际条数</div>
                                        <div class="sep">有效条数</div>
                                        <div class="sep">无效条数</div>
                                        <div class="sep">有效率</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!--统计项-->
                        <div class="base_count_item">
                            <div class="column_1">全部厂商</div>
                            <div class="column_2">
                                <div class="item">
                                    <div class="sep">{{list_count_count_data.网吧}}</div>
                                    <div class="sep">{{list_count_count_data.无线WIFI}}</div>
                                    <div class="sep">{{list_count_count_data.特征采集}}</div>
                                    <div class="sep">{{list_count_count_data.合计}}</div>
                                </div><div class="item">
                                    <div class="sep">{{list_count_count_data.实际条数}}</div>
                                    <div class="sep">{{list_count_count_data.有效条数}}</div>
                                    <div class="sep">{{list_count_count_data.无效条数}}</div>
                                    <div class="sep">{{list_count_count_data.有效率}}</div>
                                </div>
                            </div>
                        </div>
                        <!--列内容-->
                        <div class="base_table_content">
                            <Scroll :listen="list_count_data">
                                <template v-for="d in list_count_data">
                                        <div class="base_count_item">
                                            <div class="column_1" :title="d.厂商名称">{{d.厂商名称}}</div>
                                            <div class="column_2">
                                                <div class="item">
                                                    <div class="sep">{{d.网吧}}</div>
                                                    <div class="sep">{{d.无线WIFI}}</div>
                                                    <div class="sep">{{d.特征采集}}</div>
                                                    <div class="sep">{{d.合计}}</div>
                                                </div><div class="item">
                                                    <div class="sep">{{d.实际条数}}</div>
                                                    <div class="sep">{{d.有效条数}}</div>
                                                    <div class="sep">{{d.无效条数}}</div>
                                                    <div class="sep">{{d.有效率}}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                            </Scroll>
                        </div>
                    </div>
                </div>
                <div slot="t2" style="height:100%;width:100%;">
                    <div class="option" style="display:block"> 
                        <div class="item" style="text-align: left;margin: 10px;">
                            <span>统计方式:</span>
                            <div class="input" style="display:inline-block;width:190px;">
                                <el-select v-model="colltype" placeholder="请选择"  >
                                <el-option
                                v-for="kind in colltypeAll"                           
                                :label="kind.name"
                                :value="kind.value">
                                </el-option>
                                </el-select>
                            </div>
                        </div>    
                    </div>
                    <div class="date-sel" v-show="colltype=='1'">
                        <div class="tag" style="width: 400px;float: left;margin: 10px;" v-for="name in FirmStatis">
                            <div style="padding:10px;">
                                <div class="title" style="line-height: 30px;font-size: 14px;text-indent: 20px;">
                                    <span style="font-size:18px;font-weight:900">{{name.security_software_orgname}}</span>
                                </div> 
                                <div class="title" style="line-height: 30px;font-size: 14px;text-indent: 20px;">昨日量：
                                    <span>{{name.last_detect_num}}</span>
                                </div> 
                                <div class="title" style="line-height: 30px;font-size: 14px;text-indent: 20px;">接入总量：
                                    <span>{{name.total_detect_num}}</span>
                                </div> 
                                <div style="padding-top:10px;font-size:20px;" class="number">
                                    <div style="position: absolute;right: 29px;top: 16px;"><i style="font-size: 90px" class="fa fa-globe"></i> 
                                    </div> 
                                </div>
                            </div> 
                        </div>                        
                    </div>
                    <div class="date-sel" v-show="colltype=='0'">
                        <div class="tag" style="width: 300px;float: left;margin: 10px;" v-for="f in CollMicroprobe">
                            <div style="padding:10px;">
                                <div class="title" style="line-height: 30px;font-size: 14px;text-indent: 20px;">
                                    <span style="font-size:18px;font-weight:900">{{f.name}}</span>
                                </div> 
                                <div class="title" style="line-height: 30px;font-size: 14px;text-indent: 20px;">{{f.title_one}}
                                    <span>{{f.num_one}}</span>
                                </div> 
                                <div class="title" style="line-height: 30px;font-size: 14px;text-indent: 20px;">{{f.title_two}}
                                    <span>{{f.num_two}}</span>
                                </div> 
                                <div style="padding-top:10px;font-size:20px;" class="number">
                                    <div style="position: absolute;right: 29px;top: 24px;"><i style="font-size: 80px" :class="f.icon"></i> 
                                    </div> 
                                </div>
                            </div> 
                        </div>                        
                    </div>               



                </div>            



        </HTag>
    </div>
    </div>
</template>

<script>
import cSelect from 'components/Select'
import HTag from 'components/HTag'
import LineCount from 'components/count/lineCount'
import NumShow from 'components/numshow'
import Scroll from 'components/scroll'
import MulDropDwon from 'components/MulDropDown'

import '../../static/DateRangePicker/moment.js'
//import echarts from  'echarts'
import echarts from  'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
// 引入提示框和标题组件
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/dataZoom'

import CountType from '../enum/CountType'

import {Customer,VidCounter,VidMac,SiteCount,DataCount,EquipmentCount,MobileCount,ExportOnlineCount,ExportDetailCount,DataTotal,DetailListCount,DetailListExport,
        FirmCount,BODY_RESIZE,Trigger_RESIZE,FirmSiteCount,FirmEquipmentCount,GetRegion,GetFirm,GetMicroprobe,SiteOnlineRate,GetFirmCollFirm,GetCollMicroprobe} from '../store/mutation-types'

export default {
  name: 'BasePage',
  components:{
    cSelect,
    HTag,
    LineCount,
    MulDropDwon,
    Scroll,
    titleComp:{
      props:['title'],
      template:`<div class="titleComp" style="cursor:pointer;display:inline-block;" @click="itemClick()">
                  <i class="fa fa-caret-down" style="font-size:18px;" :class="{rotate:blnExpan,rotatereverse:!blnExpan}"></i>
                  <span style="font-style: italic;">{{title}}</span>
                </div>
               `,
      data(){
        return {
          blnExpan:false,
        };
      },
      methods:{
        itemClick(){
        //   this.blnExpan= !this.blnExpan;
        //   this.$emit('change',this.blnExpan);
        }
      }
    },
    tag:{
        props:['title','num','info','icon','tip','subTip','bottomTip','rightTitle'],
        components:{NumShow},
        template:`<div class="tag" @mouseenter="mouseenter()">
                    <div style="padding:10px;">
                        <div class="title">
                            {{title}}
                            <span style="float:right;">{{tip}}</span>
                        </div>
                        <div class="number" style="padding-top:10px;font-size:20px;">
                            <div style="float:left;">
                                <i :class="icon || ''" style="font-size: 45px;margin-right:10px;"></i>
                                <span style="font-size: 14px;">{{subTip}}{{subTip && ':'}}</span>
                            </div>
                            <div style="float:right;margin-top: 20px;font-size: 14px;">{{rightTitle}}</div>
                            <div style="margin-left:100px;margin-right:70px;margin-top:18px;" :title="cNum">
                                <NumShow :num="cNum" ref="numShow" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" />
                            </div>
                            <div class="clearfix"></div>
                        </div>
                    </div>
                    <div class="bar">
                        <div style="margin-right:20px;display:inline-block;" v-for="i in info">{{i.name}} : {{conver(i.val)}}</div>
                        <div style="float:right;font-size:12px;margin-right:10px;">{{bottomTip}}</div>
                    </div>
                  </div>
                  `,
        computed:{
            cNum(){
                let num =(this.num+'') || '0';
                num = num.split('').reverse().join('');
                let len=num.length/3;
                let arr=[];
                for(let i=0;i<len;i++){
                    let start=i*3;
                    arr.unshift(num.substr(start,3).split('').reverse().join(''));
                }
                return arr.join(',');
            }
        },
        methods:{
            conver(val){
                let num =(val+'') || '0';
                num = num.split('').reverse().join('');
                let len=num.length/3;
                let arr=[];
                for(let i=0;i<len;i++){
                    let start=i*3;
                    arr.unshift(num.substr(start,3).split('').reverse().join(''));
                }
                return arr.join(',');
            },
            mouseenter(){
                //this.$refs.numShow.reset();
            }
        }

    }
  },
  watch:{
    optionIndex(){
        switch(this.optionIndex){
            case 0://柱状图
                if(!this.myChart)return;
                setTimeout(()=>{
                    this.myChart.resize();
                },0);
                break;
            case 1://线性图
                if(!this.myLineChart)return;
                setTimeout(()=>{
                    this.myLineChart.resize();
                },0);
                break;
        }
    },
    colltype(){
        if(this.colltype=="0"){
            this.addCollMicroprobe();
        }else{
            this.addFirmStatis();
        }
    },
    countIndex(){
        this.$nextTick(()=>{
            this.$store.commit(Trigger_RESIZE);
        });
    },
    timeRageVal(){
        this.SiteCountData(this.curKind).then(res=>{
            this.loadChart(res);
        });
        this.$store.dispatch(SiteOnlineRate,{
            queryType:this.curKind.val==0?'site':'equipment',
            timeType:this.timeRageVal,
            firm_id:_.map(this.Selfirms,s=>s.code).join(',')
        }).then(res=>{
            this.loadLineChart(res.biz_body);
        });
    },
    Selfirms(){
        this.SiteCountData(this.curKind).then(res=>{
            this.loadChart(res);
        });
        this.$store.dispatch(SiteOnlineRate,{
            queryType:this.curKind.val==0?'site':'equipment',
            timeType:this.timeRageVal,
            firm_id:_.map(this.Selfirms,s=>s.code).join(',')
        }).then(res=>{
            this.loadLineChart(res.biz_body);
        });
    },
    commonTime(){
        //if(!(this.commonTime && this.commonTime.length>1 && this.commonTime[0]))return;
        this.detais=_.map(this.detais,d=>{
            d.startTime=tool.DateFormat(this.commonTime[0],'yyyy-MM-dd');
            d.endTime=tool.DateFormat(this.commonTime[1],'yyyy-MM-dd');
            d.time=[tool.DateFormat(this.commonTime[0],'yyyy-MM-dd'),tool.DateFormat(this.commonTime[1],'yyyy-MM-dd')];

            return d;
        });
    },
    Listfirm(){
        this.GetListData();
    },
    countTime(){
        this.GetListData();
    }
  },
  data () {
    return {
      blnLoading:false,
      tags:[
          {name:'场所在离线',num:0,icon:'fa fa-bank',info:[{name:'在线',val:'0'},{name:'离线',val:'0'}],tip:'统计时间:当天',subTip:'总数',bottomTip:'单位/个'},
          {name:'设备在离线',num:0,icon:'fa fa-feed',info:[{name:'在线',val:'0'},{name:'离线',val:'0'}],tip:'统计时间:当天',subTip:'总数',bottomTip:'单位/台'},
          {name:'数据上传质量',num:0,icon:'fa fa-line-chart',info:[{name:'在线',val:'0'},{name:'离线',val:'0'}],tip:'统计时间:当天',subTip:'接收总数',bottomTip:'单位/条'},
          {name:'数据采集总量',num:0,icon:'fa fa-database',info:[{name:'特征',val:'0'},{name:'非经',val:'0'},{name:'网吧',val:'0'}],tip:'截止时间:当前',subTip:'总数'},
          {name:'实名信息采集',num:0,icon:'fa fa-male',info:[{name:'证件',val:'0'},{name:'手机',val:'0'}],tip:'截止时间:当前',subTip:'总数'},
          {name:'虚拟身份采集',num:0,icon:'fa fa-id-card-o',info:[{name:'网吧',val:'0'},{name:'非经',val:'0'},{name:'WIFI',val:'0'}],tip:'截止时间:当前',subTip:'总数'},
          {name:'手机号码采集',num:0,icon:'fa fa-phone-square',info:[{name:'无线',val:'0'},{name:'非经',val:'0'},{name:'非经',val:'0'}],tip:'截止时间:当前',subTip:'总数'},
          {name:'Mac采集',num:0,icon:'fa fa-sticky-note-o',info:[{name:'围栏',val:'0'},{name:'无线',val:'0'}],tip:'截止时间:当前',subTip:'总数'},
      ],
      pages:[{name:'数据总揽',icon:'fa fa-tag'},{name:'采集详情',icon:'fa fa-tag'},{name:'接入统计',icon:'fa fa-tag'}],
      pageIndex:0,
      curKind:null,
      kinds:[{name:'场所',val:0,icon:'fa fa-share-alt'},{name:'设备',val:1,icon:'fa fa-shopping-basket'}],
      colltype:"1",
      colltypeAll:[{name:'按数据来源',value:"0"},{name:'按厂商',value:"1"}],
      myChart:null,
      myChartData:null,
      myLineChart:null,
      myLineChartData:null,
      timeRange:[{name:'近一月',val:'month'},{name:'近一周',val:'week'},{name:'上一月',val:'last_month'}],
      timeRageVal:'',
      optionIndex:0,//当前图表显示页面索引
      countIndex:0,//当前详情统计显示索引(0:图表,1:列表)
      detais:[],
      region:null,
      regions:[],//区域数据
      firm:null,
      Selfirms:[],
      Listfirm:[],//列表厂商过滤条件
      firms:[],//厂商数据
      dataSource:null,
      dataSources:[],//数据来源数据
      commonTime:[],//公共日期范围
      countTime:[],//统计日期范围
      limitTime:{//限定统计日期范围选择只能选择60天之内的数据
           disabledDate(time) {
               let startTime=moment(),endTime=moment(),selTime=moment(time);
               startTime.subtract(60,'d');
               endTime.add(60,'d');
               
               return !(startTime.isBefore(selTime) && selTime.isBefore(endTime) && time.getTime() < Date.now());
           }
       },
       list_count_data:[],//列表统计数据
       list_count_count_data:{},//厂商统计数据
       FirmStatis:[],
       CollMicroprobe:[]
    }
  },
  mounted(){
    this.loadData();
    this.$store.commit(BODY_RESIZE,()=>{
        if(!this.myChart)return;
        this.loadChart();
        this.myChart.resize();
        
        if(!this.myLineChart)return;
        this.myLineChart.resize();

    });

    //构造当前详细默认时间
    this.detais=_.map(CountType,(val,key)=>{
        let date=new Date(),startTime=new Date();
        startTime.setDate(startTime.getDate()-30);
        date.setDate(date.getDate()-1);

        return {
            name:key,
            key:val,
            startTime:tool.DateFormat(startTime,'yyyy-MM-dd'),
            endTime:tool.DateFormat(date,'yyyy-MM-dd'),
            time:[tool.DateFormat(startTime,'yyyy-MM-dd'),tool.DateFormat(date,'yyyy-MM-dd')]
        };
    });

    //获取列表统计数据
    this.GetListData();

  },
  methods:{
      //刷新页面
      refreshPage(){
          this.loadData();
      },
      //加载数据
      loadData(){
        this.blnLoading=true;
        let Rx=this.$store.getters.Rx;
        let countRx = new Rx.Subject().bufferCount(6);
        countRx.subscribe(r=>{
            this.blnLoading=false;
        });
        //获取场所在离线信息
        this.$store.dispatch(SiteCount).then(res=>{
            countRx.next(1);
            if(!tool.msg(res,'','获取场所在离线信息失败!')){return;}
            let self=this;
            this.tags=_.map(this.tags,(t,i)=>{
                if(i==0){return tool.Clone(self.formatCounter('场所在离线',res.biz_body),t);}
                return t;
            });
        });

        //获取设备在离线信息
        this.$store.dispatch(EquipmentCount).then(res=>{
            countRx.next(1);
            if(!tool.msg(res,'','获取设备在离线信息失败!')){return;}
            let self=this;
            this.tags=_.map(this.tags,(t,i)=>{
                if(i==1){return tool.Clone(self.formatCounter('设备在离线',res.biz_body),t);}
                return t;
            });
        });

        //数据上传质量统计信息
        this.$store.dispatch(DataCount).then(res=>{
            countRx.next(1);
            if(!tool.msg(res,'','获取数据上传质量信息失败!')){return;}
            let self=this;
            this.tags=_.map(this.tags,(t,i)=>{
                if(i==2){return tool.Clone(self.formatCounter('数据上传质量',res.biz_body),t);}
                return t;
            });
        });

        //数据采集总量
        this.$store.dispatch(DataTotal).then(res=>{
            countRx.next(1);
            if(!tool.msg(res,'','获取数据采集总量信息失败!')){return;}
            let self=this;
            this.tags=_.map(this.tags,(t,i)=>{
                if(i==3){return tool.Clone(self.formatCounter('数据采集总量',res.biz_body),t);}
                return t;
            });
        });

        //获取实名在离线信息
        this.$store.dispatch(Customer).then(res=>{
            countRx.next(1);
            if(!tool.msg(res,'','获取实名在离线信息失败!')){return;}
            let self=this;
            this.tags=_.map(this.tags,(t,i)=>{
                if(i==4){return tool.Clone(self.formatCounter('实名信息采集',res.biz_body),t);}
                return t;
            });
        });

        //获取虚拟网吧/非经营统计信息
        this.$store.dispatch(VidCounter).then(res=>{
            countRx.next(1);
            if(!tool.msg(res,'','获取虚拟网吧/非经营统计信息失败!')){return;}
            let self=this;
            this.tags=_.map(this.tags,(t,i)=>{
                if(i==5){return tool.Clone(self.formatCounter('虚拟身份采集',res.biz_body),t);}
                return t;
            });
        });

        //获取手机号码采集信息
        this.$store.dispatch(MobileCount).then(res=>{
            countRx.next(1);
            if(!tool.msg(res,'','获取手机号码采集信息失败!')){return;}
            let self=this;
            this.tags=_.map(this.tags,(t,i)=>{
                if(i==6){return tool.Clone(self.formatCounter('手机号码采集',res.biz_body),t);}
                return t;
            });
        });

        //获取虚拟MAC统计信息
        this.$store.dispatch(VidMac).then(res=>{
            countRx.next(1);
            if(!tool.msg(res,'','获取虚拟MAC统计信息失败!')){return;}
            let self=this;
            this.tags=_.map(this.tags,(t,i)=>{
                if(i==7){return tool.Clone(self.formatCounter('Mac采集',res.biz_body),t);}
                return t;
            });
        });

        //获取区域下拉框数据
        this.$store.dispatch(GetRegion).then(res=>{
            if(!tool.msg(res,'','获取区域数据失败!'))return;
            this.regions=res.biz_body;
        });
        //获取厂商下拉框数据
        this.$store.dispatch(GetFirm).then(res=>{
            if(!tool.msg(res,'','获取厂商数据失败!'))return;
            this.firms=res.biz_body;
        });
        //获取数据来源下拉框数据
        this.$store.dispatch(GetMicroprobe).then(res=>{
            if(!tool.msg(res,'','获取数据来源数据失败!'))return;
            this.dataSources=res.biz_body;
        });

        this.addFirmStatis();    //按厂商统计采集量


        setTimeout(()=>{
            this.curKind=this.kinds[0];
            this.SiteCountData(this.curKind).then(res=>{
                countRx.next(1);
                this.myChart = echarts.init($(this.$el).find('div[name="chart_container"]')[0]);
                this.loadChart(res);
            });
            this.$store.dispatch(SiteOnlineRate,{
                queryType:this.curKind.val==0?'site':'equipment',
                timeType:this.timeRageVal,
                firm_id:_.map(this.Selfirms,s=>s.code).join(',')
            }).then(res=>{
                this.myLineChart=echarts.init($(this.$el).find('div[name="line_chart_container"]')[0]);
                this.loadLineChart(res.biz_body);
            });
        },100);

      },
      //获取列表数据
      GetListData(){
        //获取列表统计数据
        this.$store.dispatch(DetailListCount,{
            firm_id:_.map(this.Listfirm,d=>d.code).join(','),
            receive_time_start:this.countTime.length>0 && this.countTime[0]?tool.Timestamp(this.countTime[0]):'',
            receive_time_end:this.countTime.length>0 && this.countTime[1]?tool.Timestamp(this.countTime[1]):''
        }).then(res=>{
            this.list_count_data=res.biz_body;
            this.list_count_count_data=_.reduce(this.list_count_data,(r,d)=>{

                return {
                    '网吧':(r.网吧 || 0)+d.网吧,
                    '无线WIFI':(r.无线WIFI || 0)+d.无线WIFI,
                    '特征采集':(r.特征采集 || 0)+d.特征采集,
                    '合计':(r.合计 || 0)+d.合计,
                    '实际条数':(r.实际条数 || 0)+d.实际条数,
                    '有效条数':(r.有效条数 || 0)+d.有效条数,
                    '无效条数':(r.无效条数 || 0)+d.无效条数,
                    '有效率':parseFloat((r.有效率 || '0%').replace('%')) +parseFloat(d.有效率.replace('%'))+'%'
                };

            },{});
        });
      },
      //详情统计列表展示页面场所统计厂商选择项单击事件
      detail_list_firmClick(d){
        if(_.findIndex(this.Listfirm,t=>t.code==d.code)>=0)return;
        this.Listfirm.push(d);
      },
      firmClick(d){
        if(_.findIndex(this.Selfirms,t=>t.code==d.code)>=0)return;
        this.Selfirms.push(d);
      },
      //tag项改变事件
      tagChange(i){
        this.pageIndex=i;
        this.$store.commit(Trigger_RESIZE);
      },
      kindchange(item){
        this.curKind=item;
        this.SiteCountData(item).then(res=>{
            this.loadChart(res);
         });
        this.$store.dispatch(SiteOnlineRate,{
            queryType:this.curKind.val==0?'site':'equipment',
            timeType:this.timeRageVal,
            firm_id:_.map(this.Selfirms,s=>s.code).join(',')
        }).then(res=>{
            this.loadLineChart(res.biz_body);
        });
      },
      //导出在离线统计数据
      ExportOnlineCount(){

          this.$store.dispatch(ExportOnlineCount,{
              firm_id:_.map(this.Selfirms,m=>m.code).join(','),
              timeType:this.timeRageVal
            }).then(res=>{
              if(!tool.msg(res,'','导出失败!'))return;
              window.location=res.biz_body.url;
          });
      },
      //导出详情统计数据
      ExportDetailCount(){

          if(this.countIndex==0){
            //详情图表导出
            let time=this.commonTime[0]?[moment(tool.DateFormat(this.commonTime[0],'yyyy-MM-dd')),moment(tool.DateFormat(this.commonTime[1],'yyyy-MM-dd'))]:[];

            this.$store.dispatch(ExportDetailCount,{
                    region:this.region,
                    firm_id:this.firm,
                    microprobe_type:this.dataSource,
                    date:time.length>0?`${time[0].format('YYYYMMDD')},${time[1].format('YYYYMMDD')}`:'',
                }).then(res=>{

                if(!tool.msg(res,'','导出失败!'))return;
                window.location=res.biz_body.url;
            });
          }else{
              
              let time=this.countTime[0]?[moment(tool.DateFormat(this.countTime[0],'yyyy-MM-dd')),moment(tool.DateFormat(this.countTime[1],'yyyy-MM-dd'))]:[];
              
              //详情列表导出
              this.$store.dispatch(DetailListExport,{
                  firm_id:_.map(this.Listfirm,m=>m.code).join(','),
                  date:time.length>0?`${time[0].format('YYYYMMDD')},${time[1].format('YYYYMMDD')}`:'',
              }).then(res=>{
                  if(!tool.msg(res,'','导出失败!'))return;
                  window.location=res.biz_body.url;
              });
          }
      },
      //获取在离线统计相关数据
      SiteCountData(kind){ 
        switch(kind.val){
            case 0: //场所
               return this.$store.dispatch(FirmSiteCount,{timeType:this.timeRageVal,firm_id:_.map(this.Selfirms,s=>s.code).join(',')}).then(res=>{
                    if(res.msg.code!='successed')return;
                    let data=_.sortBy(res.biz_body,r=>{
                        return -_.reduce(r.data,function(memo,num){
                            return memo+Math.abs(num);},0)
                    });
                    
                    res={
                        xAxis:_.map(data,d=>d.厂商名称),
                        series:_.map(_.zip(..._.map(data,d=>{
                            return _.map(d.data,(val,key)=>{return {name:key,data:[val]};})
                        })),arr=>{
                            let res={};
                            res.data=_.map(arr,a=>{
                                res.name=a.name;
                                return a.data[0]
                            });
                            return res;
                        })
                    };

                    return res;
                });
                break;
            case 1://设备
                return this.$store.dispatch(FirmEquipmentCount,{timeType:this.timeRageVal,firm_id:_.map(this.Selfirms,s=>s.code).join(',')}).then(res=>{
                    if(res.msg.code!='successed')return;
                    let data=_.sortBy(res.biz_body,r=>{
                        return -_.reduce(r.data,function(memo,num){
                            return memo+Math.abs(num);},0)
                    });

                    res={
                        xAxis:_.map(data,d=>d.厂商名称),
                        series:_.map(_.zip(..._.map(data,d=>{
                            return _.map(d.data,(val,key)=>{return {name:key,data:[val]};})
                        })),arr=>{
                            let res={};
                            res.data=_.map(arr,a=>{
                                res.name=a.name;
                                return a.data[0]
                            });
                            return res;
                        })
                    };

                    return res;
                });
                break;
        }

        return res;
      },
      //加载柱状图数据
      loadChart(data){
        if(data){this.myChartData=data;}else{data=this.myChartData;}

        let option = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            color:['#1ca5f6','#85c226', '#f8c301'],
            legend: {
                data:_.map(data.series,d=>d.name)
            },
            grid: {
                left: '3%',
                right: '4%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    axisLabel:{
                        rotate:0,
                        show:true,
                        showMinLabel:true,
                    },
                    data :data.xAxis
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    splitNumber:1,
                }
            ],
            dataZoom: [{
                startValue: data.xAxis[0],
                endValue:$(window).width()>1500?data.xAxis[8] || data.xAxis[data.xAxis.length-1]:data.xAxis[5] || data.xAxis[data.xAxis.length-1]
            }, {
                type: 'inside'
            }],
            series : _.map(data.series,d=>{return {name:d.name,type:'bar',data:d.data}})
        };

        this.myChart.setOption(option,{notMerge:true});
      },
      //加载线性图
      loadLineChart(data){
        if(data){this.myLineChartData=data;}else{data=this.myLineChartData;}
        data.firms =_.sortBy(data.firms, function(f){ return Math.sin(f.id); });

        let firmNames=_.pluck(data.firms,'name');
        let firms=_.map(data.firms,f=>{ f.type="line"; return f;});

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
                    data:firmNames
                },
                xAxis:  {
                    type: 'category',
                    boundaryGap: false,
                    data: data.days,
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
                    axisLabel: {
                        formatter: '{value} %'
                    }
                },
                series:firms
            };
        
        this.myLineChart.setOption(option,{notMerge:true});
      },
      //转化统计数据显示格式
      formatCounter(name,data){
        let res={name:name,num:0,info:[]};
        let converFunc=(num,blnShow)=>{
            let baseNum=10000;
            if(num<baseNum){return num;}
            return blnShow?Math.floor(num/baseNum)+'万'+(num%baseNum):num;
        };

        _.each(data || [],(val,key)=>{
            if(key=='total'){
                res.num=converFunc(parseInt(val));
            }else if(key=='data'){
                res.info=_.map(val,v=>{return {name:v.name,val:converFunc(parseInt(v.count))};});
            }else if(key=='right_title'){
                res.right_title=val;
            }
        });
        return res;
      },

        // 加载按厂商统计采集量
       addFirmStatis(){
          this.$store.dispatch(GetFirmCollFirm).then(res=>{
              if(!tool.msg(res,'','搜索失败!'))return;
              this.FirmStatis=res.biz_body;
          });
       },
        // 加载按按数据来源统计采集量
       addCollMicroprobe(){
          this.$store.dispatch(GetCollMicroprobe).then(res=>{
              if(!tool.msg(res,'','搜索失败!'))return;
              this.CollMicroprobe=[];
                for(arr of res.biz_body){
                    switch(arr.microprobe_type){
                        case "网吧":
                            this.CollMicroprobe.push({
                                name:arr.microprobe_type,
                                title_one:"接入场所：",
                                num_one:arr.netbar_num,
                                title_two:"采集总量：",
                                num_two:arr.netbar_detect_num,     
                                icon:"fa fa-desktop"                       
                            })
                            break;
                        case "无线WIFI":
                            this.CollMicroprobe.push({
                                name:arr.microprobe_type,
                                title_one:"接入设备：",
                                num_one:arr.equip_num,
                                title_two:"接入总量：",
                                num_two:arr.equip_detect_num,     
                                icon:"fa fa-wifi"                       
                            })
                            break;
                        case "特征设备":
                            this.CollMicroprobe.push({
                                name:arr.microprobe_type,
                                title_one:"接入设备:",
                                num_one:arr.equip_num,
                                title_two:"接入总量:",
                                num_two:arr.equip_detect_num,     
                                icon:"fa fa-podcast"                       
                            })
                            break;
                        case "宾馆酒店":
                            this.CollMicroprobe.push({
                                name:arr.microprobe_type,
                                title_one:"接入设备:",
                                num_one:arr.equip_num,
                                title_two:"接入总量:",
                                num_two:arr.equip_detect_num,     
                                icon:"fa fa-leaf"                       
                            })
                            break;                                                    
                    }
                }



          });
       }






  }
}
</script>
<style lang="less">
    @import "../css/variables.less";
    //基础数据标签样式
    .BasePage .tag .number{font-size:30px;}
    .BasePage .tag .bar{
        position: absolute;bottom:0px;width:100%;height:30px;background-color:@HeaderBgCol;color:white;line-height:30px;padding-left:10px;
        border-bottom-left-radius: 5px;
    }
  
    .BasePage .tag:hover .number .info{
        display:inline-block;
        -webkit-animation: toBottomFromTop 0.5s forwards;
        -moz-animation: toBottomFromTop 0.5s forwards;
        animation: toBottomFromTop 0.5s forwards;
    }

    @transW:100px;

    @-webkit-keyframes toRightFromLeft {
            49% {
                -webkit-transform: translate(@transW);
            }
            50% {
                opacity: 0;
                -webkit-transform: translate(-@transW);
            }
            51% {
                opacity: 1;
            }
        }
    @-moz-keyframes toRightFromLeft {
        49% {
            -moz-transform: translate(@transW);
        }
        50% {
            opacity: 0;
            -moz-transform: translate(-@transW);
        }
        51% {
            opacity: 1;
        }
    }
    @keyframes toRightFromLeft {
        49% {
            transform: translate(@transW);
        }
        50% {
            opacity: 0;
            transform: translate(-@transW);
        }
        51% {
            opacity: 1;
        }
    }   

    @-webkit-keyframes toBottomFromTop {
            49% {
                -webkit-transform: translateY(100%);
            }
            50% {
                opacity: 0;
                -webkit-transform: translateY(-100%);
            }
            51% {
                opacity: 1;
            }
        }
    @-moz-keyframes toBottomFromTop {
        49% {
            -moz-transform: translateY(100%);
        }
        50% {
            opacity: 0;
            -moz-transform: translateY(-100%);
        }
        51% {
            opacity: 1;
        }
    }
    @keyframes toBottomFromTop {
        49% {
            transform: translateY(100%);
        }
        50% {
            opacity: 0;
            transform: translateY(-100%);
        }
        51% {
            opacity: 1;
        }
    }   
</style>

<style scoped lang="less">
  @import "../css/variables.less";
  @titleH:40px;
  @tagH:120px;
  .BasePage{width:100%;height:100%;padding:5px;}
  .BasePage .base_conatiner{background-color:@FrontCol;height:100%;position:relative;}
  .BasePage .header{height:@titleH;line-height:@titleH;text-align:left;padding:0px 10px;.border('bottom');}
  .BasePage .tag{
      display:inline-block;height:@tagH;width:~"calc(24.6% - 10px)";text-align: left;margin-right:15px;margin-bottom:10px;position:relative;
      background-color:@btn_Bg_Col_hover_5;color:white;
      -moz-box-shadow: 2px 2px 1px #333333;
      -webkit-box-shadow: 2px 2px 1px #333333;
      box-shadow: 2px 2px 1px #333333;
      border-radius:5px;
   }
  .BasePage .tag:nth-child(4n){margin-right:0px;}

  .BasePage .base_container{padding:10px;}
  .tag_label:hover{color:@btn_Bg_Col_hover_1;}
  //图表显示区域样式
  .BasePage .chart_container{height:~"calc(100% - @{titleH} - 330px)";width:100%;}

  .filter_container .optionBar,
  .header .optionBar{float:right;}
  .filter_container .optionBar .item,
  .header .optionBar .item{width:auto;margin-right:10px;}
  .filter_container .optionBar .item:hover,
  .header .optionBar .item:hover{cursor:pointer;color:@Font_Hover_Col;}
  .filter_container .optionBar .item.active,
  .header .optionBar .item.active{color:@Font_Hover_Col;}

  .count_item{display:inline-block;width:33%;margin-right:.5%;height:49.75%;margin-bottom:.5%;}
  .count_item:nth-child(6),
  .count_item:nth-child(5),
  .count_item:nth-child(4){margin-bottom:0px;}

  .count_item:nth-child(6),
  .count_item:nth-child(3){margin-right:0px;}

  .BasePage .filter_container{position:absolute;right:0px;width:100%;height:40px;padding-left:330px;padding-right:10px;}
  .BasePage .filter_container .detail_filter{width:100%;height:100%;text-align:left;}


  @tableHeaderH:80px;
  @column_1_W:150px;
  .BasePage .base_table_header{width:100%;height:@tableHeaderH;.border("");color:rgb(114, 132, 153);}
  .BasePage .base_table_header .column_1{float:left;width:@column_1_W;height:@tableHeaderH - 1;.border('right');text-align:center;line-height:@tableHeaderH;}
  .BasePage .base_table_header .column_2{margin-left:@column_1_W;margin-right:0px;height:@tableHeaderH;}
  .BasePage .base_table_header .column_2 .row_1{height:@tableHeaderH/2;width:100%;.border('bottom');}

  .BasePage .base_table_header .column_2 .row_2 .item,
  .BasePage .base_table_header .column_2 .row_1 .item{display:inline-block;height:@tableHeaderH/2;width:50%;text-align:center;line-height:@tableHeaderH/2;}
  .BasePage .base_table_header .column_2 .row_2 .item:first-child,
  .BasePage .base_table_header .column_2 .row_1 .item:first-child{.border('right');}

  .BasePage .base_table_header .column_2 .row_2{height:@tableHeaderH/2;width:100%;}

  .BasePage .base_table_header .column_2 .row_2 .item .sep{float:left;width:25%;}
  .BasePage .base_table_header .column_2 .row_2 .item .sep{.border('right');}
  .BasePage .base_table_header .column_2 .row_2 .item .sep:last-child{border-right:none;}

  .BasePage .base_count_item{width:100%;height:@tableHeaderH/2;.border('bottom');.border('left');.border('right');}
  .BasePage .base_count_item .column_1{float:left;width:@column_1_W;height:@tableHeaderH/2;.border('right');text-align:center;line-height:@tableHeaderH/2;overflow:hidden;}
  .BasePage .base_count_item .column_2{margin-left:@column_1_W;margin-right:0px;height:@tableHeaderH/2;}
  .BasePage .base_count_item .column_2 .item{display:inline-block;height:@tableHeaderH/2;width:50%;text-align:center;line-height:@tableHeaderH/2;}
  .BasePage .base_count_item .column_2 .item:first-child{.border('right');}
  .BasePage .base_count_item .column_2 .item .sep{float:left;width:25%;height:100%;}
  .BasePage .base_count_item .column_2 .item .sep{.border('right');}
  .BasePage .base_count_item .column_2 .item .sep:last-child{border-right:none;}  


  .BasePage .base_table_content{width:100%;height:~'calc(100% - @{tableHeaderH} - @{tableHeaderH}/2)';}
</style>
