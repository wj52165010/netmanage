<!-- 昨日采集页面组件 -->
<template>
    <div class="CollectChart">
        <div class="CollectChart">
            
            <HTag :tags="pages" @change="tagChange">
                <!--采集趋势-->
                <div slot="t0" style="height:100%;width:100%;">
                    <div class="option_bar">

                        <div class="item_child">
                            <span>昨日采集:</span>
                            <div style="display:inline-block;">
                                5000000
                            </div>
                        </div>

                        <div class="item_child">
                            <span>累计采集:</span>
                            <div style="display:inline-block;">
                                5000000
                            </div>
                        </div>

                        <!--右边操作栏-->
                        <div class="right_option_bar">
                            <div class="item_child"  >近一周 <div class="undeline"></div></div>
                            <div class="item_child " >近一月 <div class="undeline"></div></div>
                  
                        </div>
                    </div>
                    
                    <!--内容栏-->
                    <div class="content_bar" name="content_bar">
                    
                    </div>
                </div>

                <!--采集详情-->
                <div slot="t1" style="height:100%;width:100%;">
                    <div class="option_bar">

                        <div class="item_child cursor" @click="pageShow='bar'" >
                            <span :class="{active:pageShow=='bar'}"><i class="fa fa-bar-chart"/>柱状图</span>
                        </div>

                        <div class="item_child cursor" @click="pageShow='line'">
                            <span :class="{active:pageShow=='line'}"><i class="fa fa-line-chart" />线性图</span>
                        </div>

                        <!--右边操作栏-->
                        <div class="right_option_bar">
                            <div class="item_child"  >近一周 <div class="undeline"></div></div>
                            <div class="item_child " >近一月 <div class="undeline"></div></div>
                  
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
export default {
  name: 'CollectChart',
  components:{HTag},
  data () {
    return {
      pages:[
              {name:'采集趋势',icon:'fa fa-area-chart'},
              {name:'采集详情',icon:'fa fa-cog fa-fw'},
            ],
      pageIndex:0,
      tendencyChart:null,//趋势图表对象
      barChart:null,//柱状图
      lineChart:null,//线性图
      pageShow:'bar',
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
        
    }
  },
  mounted(){

      setTimeout(()=>{
        this.loadTendencyChart();
        this.loadBarChart();
        this.loadLineChart();
      },100);
  },
  methods:{
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
                data:  ['1月1','1月1','1月1']
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
                data:  [1,2,4],
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
                data: [1,2,3,4]
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
                data: [1,3,2,4,],
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
                    let str='';
                    // _.each(param,p=>{
                    //     str+=`${p.seriesName}:${p.data}<br>`
                    // });
                    return str;
                }
            },
            legend: {
                orient : 'horizontal',  
                y:20,
                textStyle: {  
                    fontSize: 13,
                }, 
                data:['321','ds','23'], 
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data:  [1,2,3]
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
            series:[
                {
                name:"采集数",
                data:  [1,2,4],
                type: 'line',
                }
            ]
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

html{.TCol(~".CollectChart .right_option_bar .item_child:hover");}
html{.TCol(~".CollectChart .right_option_bar .item_child:hover .undeline",'bbc');}

html{.TCol(~".CollectChart .right_option_bar .active");}

.CollectChart .content_bar{width:100%;height:~'calc(100% - 55px)';}

.CollectChart .item_child.cursor{cursor:pointer;}

html{.TCol(~".CollectChart .item_child .active");}



html{.TCol(~".CollectChart .item_child.cursor:hover");}
</style>
