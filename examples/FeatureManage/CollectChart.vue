<!-- 昨日采集页面组件 -->
<template>
    <div class="CollectChart">
        <div class="CollectChart">
            
            <HTag :tags="pages" @change="tagChange">
                <!--采集趋势-->
                <div slot="t0" style="height:100%;width:100%;position:relative;">

                    <!--加载中-->
                    <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index: 100;">
                        <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
                    </div>

                    <div class="option_bar">

                        <div class="item_child">
                            <span>昨日采集:</span>
                            <div style="display:inline-block;">
                                {{collctNum}}
                            </div>
                        </div>

                        <div class="item_child">
                            <span>累计采集:</span>
                            <div style="display:inline-block;">
                                {{totalNum}}
                            </div>
                        </div>

                        <!--右边操作栏-->
                        <div class="right_option_bar">
                            <div class="item_child" :class="{active:trendTime=='week'}" @click="trendTime='week'">近一周 <div class="undeline"></div></div>
                            <div class="item_child" :class="{active:trendTime=='month'}"  @click="trendTime='month'">近一月 <div class="undeline"></div></div>
                  
                        </div>
                    </div>
                    

                    <!--内容栏-->
                    <div class="content_bar" name="content_bar"></div>
                </div>

                <!--采集详情-->
                <div slot="t1" style="height:100%;width:100%;">

                    <!--加载中-->
                    <div v-if="blnLoading_detail" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index: 100;">
                        <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
                    </div>

                    <div class="option_bar">

                        <div class="item_child cursor" @click="pageShow='bar'" >
                            <span :class="{active:pageShow=='bar'}"><i class="fa fa-bar-chart"/>柱状图</span>
                        </div>

                        <div class="item_child cursor" @click="pageShow='line'">
                            <span :class="{active:pageShow=='line'}"><i class="fa fa-line-chart" />线性图</span>
                        </div>

                        <!--右边操作栏-->
                        <div class="right_option_bar">
                            <div class="item_child"  :class="{active:detailTime=='week'}" @click="detailTime='week'">近一周 <div class="undeline"></div></div>
                            <div class="item_child"  :class="{active:detailTime=='month'}"  @click="detailTime='month'">近一月 <div class="undeline"></div></div>
                  
                        </div>
                    </div>

                    <div class="content_bar" v-show="pageShow=='bar'" name="bar_chart"></div>
                    <div class="content_bar" v-show="pageShow=='line'" name="line_chart"></div>
                </div>
            </HTag>

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

import HTag from 'components/HTag'

import {siteDetectYesterday,SiteDetectColl,siteDetectHistory,
        DeviceDetectYesterday,DeviceDetectColl,DeviceDetectHistory  
      } from '../../store/mutation-types'
export default {
  name: 'CollectChart',
  props:['code','microprobe_type','type'],
  components:{HTag},
  data () {
    return {
      blnLoading:false,
      blnLoading_detail:false,
      pages:[
              {name:'采集趋势',icon:'fa fa-area-chart'},
              {name:'采集详情',icon:'fa fa-cog fa-fw'},
            ],
      pageIndex:0,
      tendencyChart:null,//趋势图表对象
      barChart:null,//柱状图
      lineChart:null,//线性图
      pageShow:'bar',
      trendTime:"week",//采集趋势日期类型
      detailTime:"week",//采集详情日期类型
      collctNum:0, //昨日采集采集量
      totalNum:0,//累计采集数
      allHistoryData:[],
    }
  },
  watch:{
    pageIndex(){
        this.tendencyChart && this.tendencyChart.resize();
        this.barChart && this.barChart.resize();
        this.lineChart && this.lineChart.resize();
    },
    pageShow(){
        this.$nextTick(()=>{
            this.barChart && this.barChart.resize();
            this.lineChart && this.lineChart.resize();
        });
    },
    trendTime(){
        this.loadSiteDetectColl();
    },
    detailTime(){
        this.loadCollect();
    }
  },
  mounted(){
      setTimeout(()=>{
        //this.loadTendencyChart();
        //this.loadBarChart();
        //this.loadLineChart();

        this.loadData();
      },100);
  },
  methods:{
    //获取数据
    loadData(){
        this.loadSiteDetectColl();
        this.loadCollect();
    },
    //加载绘制采集趋势折线图数据
    loadSiteDetectColl(){
        //绘制采集趋势折线图
        this.blnLoading=true;
        this.$store.dispatch(this.type?DeviceDetectColl:SiteDetectColl,{
            netbar_wacode:this.code,
            microprobe_type:this.microprobe_type,
            coll_type:this.trendTime,
        }).then(res=>{
            this.blnLoading=false;
            if(!tool.msg(res,'','获取采集趋势数据失败!'))return;
            let data=res.biz_body;
            this.collctNum=data.last_num || 0;
            this.totalNum=data.total_num || 0;

            let d={months:[],data:[]}

            for( let ary of data.chart){
                d.months.push(function(val){
                    return val.substr (0,4)+"-"+val.substr (4,2)+"-"+val.substr (6,2);
                }(ary.stat_date));
                d.data.push(ary.detect_num);
            };

            this.loadTendencyChart(d);

        });
    },
    //加载采集Tag下图表数据
    loadCollect(){
        //绘制采集详情柱状图(昨日详情)
        let exceCount=0;
        this.blnLoading_detail=true;
        this.$store.dispatch(this.type?DeviceDetectYesterday:siteDetectYesterday,{
            netbar_wacode:this.code,
            microprobe_type:this.microprobe_type,
            coll_type:this.detailTime,
        }).then(res=>{
            exceCount++;
            if(exceCount==2){this.blnLoading_detail=false;}
            if(!tool.msg(res,'','获取昨日采集数据失败!'))return;
            let yesterday=res.biz_body;
            var xZData=[],numData=[];
            for( let ary of yesterday){
                xZData.push(ary.title)
                numData.push(ary.count)
            };
            
            this.loadBarChart({x:xZData,data:numData});
        });

        //绘制采集详情折线图(历史详情)
        this.$store.dispatch(this.type?DeviceDetectHistory:siteDetectHistory,{
            netbar_wacode:this.code,
            coll_type:this.detailTime,
            microprobe_type:this.microprobe_type
        }).then(res=>{
            exceCount++;
            if(exceCount==2){this.blnLoading_detail=false;}
            if(!tool.msg(res,'','获取历史详情数据失败!'))return;
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

            this.allHistoryData=allHistoryData;
            this.loadLineChart({x:time,legend:firmNames,series:allData})
        });
    },
    //加载趋势图表对象
    loadTendencyChart(d){
        if(!this.tendencyChart){
            this.tendencyChart=echarts.init($(this.$el).find('div[name="content_bar"]')[0]);
        }  

        let option = {
            title: [
                {
                    text: '趋势分析:',
                    x : 0, 
                  
                },
                {
                    text: '稳定',
                    x : 80,
                    y:2, 
                    textStyle: {  
                        fontSize: 14,
                        fontWeight:'normal'
                    }, 
                },
            ],                           
            tooltip: {trigger: 'axis',},
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data:  d.months
            },
            grid:{	//设置图标上面和下面的距离
                left: 60,
                right: 40,
                y:45
            },
            yAxis: {
                type: 'value',                    
                axisLabel: {
                    formatter: '{value} %'
                },
                axisPointer: {
                    snap: true
                }
            },
            series: [{
                name:"采集数",
                data:  d.data,
                type: 'line',
            }]
        };                               
        this.tendencyChart.setOption(option);
    },
    //加载采集详情柱状图(昨日详情)
    loadBarChart(d){
        if(!this.barChart){
            this.barChart=echarts.init($(this.$el).find('div[name="bar_chart"]')[0]);
        }  

        let option = {
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
                left: 60,
                right: 40,
                y:45
            },            
            xAxis: {

                type: 'category',
                data: d.x
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
                data: d.data,
                type: 'bar'
                },
            ]
        };                        
        this.barChart.setOption(option);
    },
    //加载采集详情线性图(历史详情)
    loadLineChart(d){
        if(!this.lineChart){
            this.lineChart=echarts.init($(this.$el).find('div[name="line_chart"]')[0]);
        }  

        let s=this;
        let option = {      
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
                    
                    return `${param[0].name}<br>` + _.map(param,p=>{

                        let details=''

                    
                        let data = s.allHistoryData[p.dataIndex].coll[p.seriesIndex];
                        details=_.map(data.details || [],d=>{
                            return `<br>${d.name} : ${d.count}   (${d.per})`
                        }).join('');
                
                        
                        let str=`
                                ${p.seriesName} : ${p.data}
                                ${details}<br>
                                `;
                        return str;
                    }).join('<div style="height:1px;width:100%;border:1px dashed white;margin-top:5px;"></div>');
                    
                },
                padding:10,
                textStyle:{
                    fontSize:12
                }
            },
            legend: {
                orient : 'horizontal',  
                y:20,
                textStyle: {  
                    fontSize: 13,
                }, 
                data:d.legend, 
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data:  d.x
            },
            grid:{	//设置图标上面和下面的距离
                left: 60,
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
            series:d.series
            // series:[
            //     {
            //     name:"采集数",
            //     data:  [1,2,4],
            //     type: 'line',
            //     }
            // ]
        };                  
        this.lineChart.setOption(option);
    },
    tagChange(index){
        this.pageIndex=index;
    }
  }
}
</script>

<style scoped lang="less">
@import "../../css/variables.less";
.CollectChart{width:100%;height:100%;padding:5px;}
.CollectChart_container{width:100%;height:100%;background-color:white;}

.CollectChart .option_bar{text-align:left;padding:5px 15px;line-height:40px;}
.CollectChart .option_bar .item_child{display:inline-block;margin:2px 5px;}

.CollectChart .right_option_bar {float:right;}
.CollectChart .right_option_bar .item_child{display:inline-block;margin:2px 5px;position:relative;}
.CollectChart .right_option_bar .item_child:hover{cursor:pointer;}
html{.TCol(~".CollectChart .right_option_bar .item:hover");}

.CollectChart .right_option_bar .item_child .undeline{
    position:absolute;
    top:30px;
    width:100%;
    border-bottom:2px solid #e5e5e5;
}

html{.TCol(~".CollectChart .right_option_bar .item_child.active .undeline",'bbc');}


html{.TCol(~".CollectChart .right_option_bar .item_child:hover");}
html{.TCol(~".CollectChart .right_option_bar .item_child:hover .undeline",'bbc');}

html{.TCol(~".CollectChart .right_option_bar .active");}

.CollectChart .content_bar{width:100%;height:~'calc(100% - 55px)';}

.CollectChart .item_child.cursor{cursor:pointer;}

html{.TCol(~".CollectChart .item_child .active");}



html{.TCol(~".CollectChart .item_child.cursor:hover");}
</style>
