<!-- 分析页面组件 -->
<template>
    <div class="PlaceAnalysis">
        <div class="PlaceAnalysis_container">

            <div class="top_container">
                <!--当前状态-->
                <div class="curState" name="curState">
                
                </div>

                <!--待处理场所-->
                <div class="place" name="place">
                
                </div>

                <!--问题总览-->
                <div class="issue" name="issue">
                
                </div>
            </div>

            <div class="bottom_container">
                <!--标题栏-->
                <div class="option_bar">
                    <span class="title">场所在离线:</span>

                    <div class="item">
                        <span>区域范围:</span>
                        <div style="display:inline-block;">
                            <PlaceSearch  :blnClear="true" c_searchKind="0" @place_res="selectArea"></PlaceSearch>
                        </div>
                    </div>

                    <div class="item">
                        <span>厂商范围:</span>
                        <div style="display:inline-block;width:180px;">
                            <MulDropDwon :data="Selfirms" keyProp="name" id="code" placeholder="请选择厂商">
                                <div v-for="t in firms" @mousedown="firmClick('listInd',t)">{{t.name}} <i v-if="isHasSelItem(Selfirms,t.code)" class="fa fa-check" style="float:right;margin-top: 10px;"></i></div>
                            </MulDropDwon>
                        </div>
                    </div>

                    <div class="item">
                        <span>时间范围:</span>
                        <div style="display:inline-block;width:180px;">
                            <el-select v-model="collType" placeholder="请选择">
                                <el-option
                                v-for="kind in staticTime"
                                :key="kind.code"
                                :label="kind.name"
                                :value="kind.val">
                                </el-option>
                            </el-select>
                        </div>
                    </div>

                    <!--右边操作栏-->
                    <div class="right_option_bar">
                        <div class="item" :class="{active:changeChart=='bar'}" @click="changeChart='bar'"><i class="fa fa-area-chart" /> 柱状图</div>
                        <div class="item" :class="{active:changeChart=='line'}" @click="changeChart='line'"><i class="fa fa-line-chart" /> 线性图</div>
                        <div class="item" @click="ExportOnlineCount()"><i class="fa fa-share" /> 导出</div>
                    </div>
                    
                </div>

                <!--图表容器-->
                <div class="chart_container">
                    <!--在离线率柱状图-->
                    <div name="his_bar_chart_container" style="margin:0 auto;width:100%;height:100%" v-show="changeChart=='bar'"></div>
                    <!--在离线率线形图-->
                    <div name="his_line_chart_container" style="margin:0 auto;width:100%;height:100%" v-show="changeChart=='line'"></div>
                </div>
            </div>

            <!--底部弹出页面层-->
            <div class="bottom_page" :style="{top:showPage!=''?'0px':'110%'}">
                <!--标题栏-->
                <div class="title_bar" @click="showPage=''">
                    <span>{{this.showPage=='place'?'待处理场所':this.showPage=='issue'?'问题总览':''}}</span>
                </div>
                <!--内容栏-->
                <div class="content_bar">
                    <DealtPlace ref="DealtPlace" v-show="showPage=='place'" />
                    <IssueLook ref="IssueLook" v-show="showPage=='issue'" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
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

import PlaceSearch from 'components/PlaceSearch'
import MulDropDwon from 'components/MulDropDown'     //厂商选择控件

import DealtPlace from './DealtPlace'
import IssueLook from './IssueLook'

import {BODY_RESIZE,GetFirm,SiteHisPercentage,HisPercentageExport} from '../../../store/mutation-types'

export default {
  name: 'PlaceAnalysis',
  components:{PlaceSearch,MulDropDwon,DealtPlace,IssueLook},
  data () {
    return {
      bodyResizeSub:null,
      data:[ ],
      curStateChart:null,
      placeChart:null,
      myLineChart:null,
      myOnOffBarChart:null,
      issueChart:null,
      staticTime:[{name:'近一周',val:'week'},{name:'近一月',val:'month'}],
      firms:[],//厂商数据集合
      changeChart:'bar',//场所在离线显示标识
      regionRange:'',
      Selfirms:[],
      collType:'week',
      weekOnOffLIne:[],
      showPage:'',//底部显示具体页面
    }
  },
  watch:{
      regionRange(){this.getOnOffLineData()},
      Selfirms(){this.getOnOffLineData()},
      collType(){this.getOnOffLineData()},
      changeChart(){
        this.$nextTick(()=>{
            this.changeChart=='bar'?this.myOnOffBarChart.resize():this.myLineChart.resize();
        });
        
      },
      showPage(){
          this.$nextTick(()=>{
              this.$refs.DealtPlace.layout && this.$refs.DealtPlace.layout();
              this.$refs.IssueLook.layout && this.$refs.IssueLook.layout();
          });
      },
      showList(){
        this.$nextTick(()=>{
            
        });
       }
  },
  mounted(){
    setTimeout(()=>{
        this.loadCurState();
        this.loadPlaceChart();
        this.loadIssueChart();
    },100);

    //获取厂商下拉框数据
    this.$store.dispatch(GetFirm).then(res=>{
        if(!tool.msg(res,'','获取厂商数据失败!'))return;
        this.firms=res.biz_body;
    });

    this.$store.commit(BODY_RESIZE,{cb:(sub)=>{
        this.bodyResizeSub=sub
    },sub:()=>{
        this.layout();
    }});

    //获取在离线数据
    this.getOnOffLineData();
  },
  beforeDestroy(){
    this.bodyResizeSub.unsubscribe();
  },
  methods:{
    layout(){
        this.curStateChart && this.curStateChart.resize();
        this.placeChart && this.placeChart.resize();
        this.issueChart && this.issueChart.resize();
        this.myLineChart && this.myLineChart.resize();
        this.myOnOffBarChart && this.myOnOffBarChart.resize();
    },
    //获取场所在离线数据
    getOnOffLineData(){
        this.$store.dispatch(SiteHisPercentage,{
                coll_type:this.collType,
                region_range:this.regionRange,
                security_software_orgcodes:_.map(this.Selfirms,s=>s.code).join(',')
        }).then(res=>{
            if(res.msg.code!='successed')return;
            this.weekOnOffLIne=res.biz_body;
            this.addOfflineLineChart(this.weekOnOffLIne);     //加载折线图
            this.addOfflineBarChart(this.weekOnOffLIne);      //加载柱状图
        });
    },
    //加载在离线折线图time横坐标时间 inLineData：在线 ,offLineData：离线,abnormalsData：异常
    addOfflineLineChart(data){
        let offlineLineChart=$(this.$el).find('div[name="his_line_chart_container"]')[0]
        this.myLineChart = echarts.init(offlineLineChart);
        let time=[],inLineData=[],offLineData=[],abnormalsData=[];
        for(let i=0;i<data.length;i++){
            time.push(data[i].stat_date.substr (0,4)+"-"+data[i].stat_date.substr (4,2)+"-"+data[i].stat_date.substr (6,2));
            inLineData.push((data[i].online_pre*100).toFixed(2))
            offLineData.push((data[i].offline_pre*100).toFixed(2))
            abnormalsData.push((data[i].abnormals_pre*100).toFixed(2))
        }
        let  option = {
                tooltip: {
                    trigger: 'axis',
                    formatter:function(param){
                        let str=param[0].axisValue+'<br>';
                        _.each(param,p=>{
                            str+=`${p.seriesName}:${p.data}%<br>`
                        });
                        return str;
                    },              
                },
                legend: {
                    orient : 'horizontal',  
                    textStyle: {  
                        fontSize: 13,
                    }, 
                    //selectedMode:false,
                    data:['在线率','异常率','离线率']  
                },
                grid:{	//设置图标上面和下面的距离
                    left: 50,
                    right: 50,
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
                            color:'#85C226',
                            label: {
                                formatter: '{c}%'
                            },
                        }
                    },
                    areaStyle: {
                        normal: {
                            color:{
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: '#B2CDFF' // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#fff' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                        }
                    },
                },{
                    name: "异常率",
                    type: 'line',
                    data: abnormalsData,
                    itemStyle: {
                        normal: {
                                color:'#F8C301',
                            label: {
                                formatter: '{c}%'
                            },
                            // color: '#d68262'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color:{
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: '#F5E8B4' // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#fff' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                        }
                    },                   
                },{
                    name: "离线率",
                    type: 'line',
                    data: offLineData,
                    itemStyle: {
                        
                        normal: {
                            color:'#728498',
                            label: {
                                formatter: '{c}%'
                            },
                            // color: '#FFD601'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color:{
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: '#D7DEE8' // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#fff' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                        }
                    },                  
                }]
            };
        
            this.myLineChart.setOption(option);
            this.myLineChart.resize();
    },
    //加载在离线柱状图 
    addOfflineBarChart(data){
        let offlineLineChart=$(this.$el).find('div[name="his_bar_chart_container"]')[0]
        this.myOnOffBarChart = echarts.init(offlineLineChart);
        let time=[],inLineData=[],offLineData=[],abnormalsData=[];
        let tipOnline=[],tipOffline=[],tipAbnormals=[];
        for(let i=0;i<data.length;i++){
            time.push(data[i].stat_date.substr (0,4)+"-"+data[i].stat_date.substr (4,2)+"-"+data[i].stat_date.substr (6,2));
            inLineData.push(data[i].online_num)
            offLineData.push(data[i].offline_num)
            abnormalsData.push(data[i].abnormals_num);

                tipOnline[i]=(data[i].online_pre*100).toFixed(2)+'% )<br>';
                let newAnyOne=!data[i].micprotype_120 ?'' : '网吧：'+data[i].micprotype_120.online_num+'( '+(data[i].micprotype_120.online_pre*100).toFixed(2)+'% )<br>';
                let newAnyTwo=!data[i].micprotype_145 ?'' : 'WIFI：'+data[i].micprotype_145.online_num+'( '+(data[i].micprotype_145.online_pre*100).toFixed(2)+'% )<br>';
                let newAnyThree=!data[i].micprotype_123 ?'' : '非经：'+data[i].micprotype_123.online_num+'( '+(data[i].micprotype_123.online_pre*100).toFixed(2)+'% )<br>';
                let newAnyFour=!data[i].micprotype_146 ?'' : '特征：'+data[i].micprotype_146.online_num+'( '+(data[i].micprotype_146.online_pre*100).toFixed(2)+'% )<br>';
                tipOnline[i] +=newAnyOne+newAnyTwo+newAnyThree+newAnyFour;
                
                tipOffline[i]=(data[i].offline_pre*100).toFixed(2)+'% )<br>';
                let newAnyOffOne=!data[i].micprotype_120 ?'' : '网吧：'+data[i].micprotype_120.offline_num+'( '+(data[i].micprotype_120.offline_pre*100).toFixed(2)+'% )<br>';
                let newAnyOffTwo=!data[i].micprotype_145 ?'' : 'WIFI：'+data[i].micprotype_145.offline_num+'( '+(data[i].micprotype_145.offline_pre*100).toFixed(2)+'% )<br>';
                let newAnyOffThree=!data[i].micprotype_123 ?'' : '非经：'+data[i].micprotype_123.offline_num+'( '+(data[i].micprotype_123.offline_pre*100).toFixed(2)+'% )<br>';
                let newAnyOffFour=!data[i].micprotype_146 ?'' : '特征：'+data[i].micprotype_146.offline_num+'( '+(data[i].micprotype_146.offline_pre*100).toFixed(2)+'% )<br>';
                tipOffline[i] +=newAnyOffOne + newAnyOffTwo + newAnyOffThree + newAnyOffFour;

                tipAbnormals[i]=(data[i].abnormals_pre*100).toFixed(2)+'% )<br>';
                let newAnyAbsOne=!data[i].micprotype_120 ?'' : '网吧：'+data[i].micprotype_120.abnormals_num+'( '+(data[i].micprotype_120.abnormals_pre*100).toFixed(2)+'% )<br>';
                let newAnyAbsTwo=!data[i].micprotype_145 ?'' : 'WIFI：'+data[i].micprotype_145.abnormals_num+'( '+(data[i].micprotype_145.abnormals_pre*100).toFixed(2)+'% )<br>';
                let newAnyAbsThree=!data[i].micprotype_123 ?'' : '非经：'+data[i].micprotype_123.abnormals_num+'( '+(data[i].micprotype_123.abnormals_pre*100).toFixed(2)+'% )<br>';
                let newAnyAbsFour=!data[i].micprotype_146 ?'' : '特征：'+data[i].micprotype_146.abnormals_num+'( '+(data[i].micprotype_146.abnormals_pre*100).toFixed(2)+'% )<br>';
                tipAbnormals[i] +=newAnyAbsOne + newAnyAbsTwo + newAnyAbsThree + newAnyAbsFour;
        
        } 

        option = {
            tooltip: {
                // triggerOn:'click',
                trigger: 'item',
                formatter:function(param){
                    let  str=param.name+'<br>场所'+param.seriesName+'<br>总量：'+param.value+"( ";
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
            grid:{	//设置图标距离
                left: 50,
                right: 50,
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
                        color:'#85C226'
                    }
                },
                data: inLineData,
                type: 'bar'
            },
            {
                name:"异常数",
                itemStyle: {
                    normal: {
                        color:'#F8C301'
                    }
                },                
                data: abnormalsData,
                type: 'bar'
            },
            {
                name:"离线数",
                itemStyle: {    
                    normal: {
                        color:'#728498'
                    }
                },                
                data: offLineData,
                type: 'bar'
            },
            ]
        };
        this.myOnOffBarChart.setOption(option);

        this.myOnOffBarChart.resize();
    },
    //导出统计场所状态率
    ExportOnlineCount(){
        tool.confirm('确定要导出场所在离线记录吗?',['确定','取消'],()=>{
            this.$store.dispatch(HisPercentageExport,{coll_type:this.collType}).then(res=>{
                if(!tool.msg(res,'','导出失败!'))return;
                window.location=res.biz_body.url;
            });    
           
        },function(){});
        
    },
    //加载当前状态图表
    loadCurState(d){
        if(!this.curStateChart){
            this.curStateChart = echarts.init($(this.$el).find('div[name="curState"]')[0]);
        }

        let option = {
            title: [
                {
                    text: '当前场所状态',
                    x : 50, 
                    textStyle: {  
                        fontSize: 19,
                        fontWeight:900,
                    }, 
                },
                {
                    text: '总量：'+100,
                    x : 50, 
                    y : 30, 
                    textStyle: {  
                        fontSize: 13,
                        fontWeight:"normal",
                    }, 
            } ],
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient : 'vertical',  
                x : 50,  
                y : 50,
                itemHeight:20,
                padding:[20,5,20,5],
                selectedMode:false,
                textStyle: {  
                    fontSize: 13,
                }, 
                data:["在线："+100,"异常："+20,"离线："+10]  
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius:"76%",
                    center: ['65%','55%'],
                    data: [
                        {
                            name: "在线："+100, 
                            value: 100,
                            itemStyle:{
                                normal:{
                                    color:'#85C226',
                                    label : {
                                        show : true,
                                    textStyle : {
                                        fontWeight : 300 ,
                                        fontSize : 12    //文字的字体大小
                                    },
                                    formatter:'{d}%'
                                    },
                                }
                            }
                        },{
                            name: "异常："+20, 
                            value: 20,
                            itemStyle:{
                                normal:{
                                    color:'#F8C301',
                                    label : {
                                        show : true,
                                        textStyle : {
                                            fontWeight : 300 ,
                                            fontSize : 12    //文字的字体大小
                                        },
                                    formatter:'{d}%'
                                    },
                                }
                            }
                        },{
                            name: "离线："+10, 
                            value: 10,
                            itemStyle:{
                                normal:{
                                    color:'#728498',
                                    label : {
                                        show : true,
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
                }
            ]
        }

        this.curStateChart.setOption(option);
    },
    //加载待处理场所图标
    loadPlaceChart(d){
        if(!this.placeChart){
            this.placeChart = echarts.init($(this.$el).find('div[name="place"]')[0]);

            //注册单击事件
            this.placeChart.on('click',  (params)=> {
                this.showPage='place';
            });
        }

        let option = {
            title: [
                {
                    text: '待处理场所',
                    x : 50, 
                    textStyle: {  
                        fontSize: 19,
                        fontWeight:900,
                    }, 
                },
                {
                    text: '总量：'+100,
                    x : 50, 
                    y : 30, 
                    textStyle: {  
                        fontSize: 13,
                        fontWeight:"normal",
                    }, 
            } ],
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient : 'vertical',  
                x : 50,  
                y : 50,
                itemHeight:20,
                padding:[20,5,20,5],
                selectedMode:false,
                textStyle: {  
                    fontSize: 13,
                }, 
                data:["严重："+100,"一般："+20,"忽略："+10]  
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: ['50%', '76%'],
                    center: ['65%','55%'],
                    data: [
                        {
                            name: "严重："+100, 
                            value: 100,
                            itemStyle:{
                                normal:{
                                    color:'#85C226',
                                    label : {
                                        show : true,
                                    textStyle : {
                                        fontWeight : 300 ,
                                        fontSize : 12    //文字的字体大小
                                    },
                                    formatter:'{d}%'
                                    },
                                }
                            }
                        },{
                            name: "一般："+20, 
                            value: 20,
                            itemStyle:{
                                normal:{
                                    color:'#F8C301',
                                    label : {
                                        show : true,
                                        textStyle : {
                                            fontWeight : 300 ,
                                            fontSize : 12    //文字的字体大小
                                        },
                                    formatter:'{d}%'
                                    },
                                }
                            }
                        },{
                            name: "忽略："+10, 
                            value: 10,
                            itemStyle:{
                                normal:{
                                    color:'#728498',
                                    label : {
                                        show : true,
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
                }
            ]
        }

        this.placeChart.setOption(option);
    },
    //加载问题总览
    loadIssueChart(d){
        if(!this.issueChart){
            this.issueChart = echarts.init($(this.$el).find('div[name="issue"]')[0]);
            //注册单击事件
            this.issueChart.on('click',  (params)=> {
                this.showPage='issue';
            });
        }

        let option = {
            title: {
                text: '问题总览',
                x : 20, 
            },
            legend: {
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
                data: ['场所维护','场所离线','设备离线','设备异常',"采集波动",'程序失效'],
                splitLine:{
                    show:false
                },
                axisTick: {
                    show: false
                },
                axisLine:{
                    lineStyle:{
                        //color:'#C9C9C9',
                       // width:8,//
                    }                    
                }
            },
            series: [
                {
                    name: '',
                    type: 'bar',
                    //label: labelOption,
                    barWidth : 25,//柱图宽度
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
                    data: [1,2,3,4]
                }
                
            ]
        }

        this.issueChart.setOption(option);
    },
    selectArea(val,data){
        if(data){
            this.regionRange=data.regions;
        }else{
            this.regionRange="";
        }
    },
    firmClick(type,d){
        let index=-1;
        index=_.findIndex(this.Selfirms,t=>t.code==d.code);
        if(index>=0){this.Selfirms.splice(index,1); return;}
        this.Selfirms.push(d);  
    },
    //是否包含选中项
    isHasSelItem(data,code){
        return  _.find(data,d=>d.code==code);
    },
  }
}
</script>

<style scoped lang="less">
@import "../../../css/variables.less";
.PlaceAnalysis{width:100%;height:100%;padding:5px;position:relative;}
.PlaceAnalysis_container{width:100%;height:100%;background-color:white;position:relative;}

@topContainerH:40%;
.PlaceAnalysis_container .top_container{width:100%;height:@topContainerH;}
@curStateW:30%;
@placeW:30%;
.PlaceAnalysis_container .top_container .curState{width:@curStateW;height:100%;float:left;}
.PlaceAnalysis_container .top_container .place{width:@placeW;height:100%;float:left;}
.PlaceAnalysis_container .top_container .issue{width:~'calc(100% - @{curStateW} - @{placeW})';height:100%;float:left;}

.PlaceAnalysis_container .bottom_container{width:100%;height:~'calc(100% - @{topContainerH})';}

.PlaceAnalysis_container .option_bar{text-align:left;padding:5px 15px;line-height:40px;}
.PlaceAnalysis_container .option_bar .item{display:inline-block;margin:2px 5px;}

.PlaceAnalysis_container .option_bar .title{font-size:20px;font-weight:600;}

.PlaceAnalysis_container .chart_container{width:100%;height:~'calc(100% - 55px)'}

.PlaceAnalysis_container .right_option_bar {float:right;}
.PlaceAnalysis_container .right_option_bar .item{display:inline-block;margin:2px 5px;}
.PlaceAnalysis_container .right_option_bar .item:hover{cursor:pointer;}
html{.TCol(~".PlaceAnalysis_container .right_option_bar .item:hover");}

html{.TCol(~".PlaceAnalysis_container .right_option_bar .active");}


.bottom_page{
    position:absolute;
    left:0px;right:0px;bottom:0px;top:110%;.trans();background:white;
}

@titleBarH:40px;
.bottom_page .title_bar{width:100%;height:@titleBarH;line-height:@titleBarH;color:white;font-size:18px;font-weight:600;}
.bottom_page .title_bar span:after{
    content:'\F106';
    margin-left:10px;
    font:normal normal normal 14px/1 FontAwesome;
    font-size:40px;position:absolute;
}
.bottom_page .title_bar:hover{cursor:pointer;}

html{.TCol(~".bottom_page .title_bar",'bg');}

.bottom_page .content_bar{width:100%;height:~'calc(100% -  @{titleBarH})'}

.PlaceAnalysis_container .switchBtn{
  position:absolute;
  width: 15px;
  height: 40px;
  color: white;
  right: -10px;
  top: 20px;
  line-height: 40px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  font-size: 12px;
  cursor:pointer;
  z-index:1000;
}

html{.TCol(~".PlaceAnalysis_container .switchBtn",'bg');}
</style>
