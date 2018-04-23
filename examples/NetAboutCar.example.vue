<!-- 网约车分析页面组件 -->
<template>
    <div class="NetAboutCar">
        <!--地图容器-->
        <div class="map" :id="mapid"></div>

        <!--操作栏-->
        <div class="option_bar">
          <div style="float:left;margin-right:10px;margin-top:5px;">
            日期 <el-date-picker type="daterange" v-model="timeRange"  placeholder="选择日期范围" style="width: 220px;display:inline-block;"></el-date-picker>
          </div>
          <div style="float:left;margin-right:10px;margin-top:5px;">
            时间段 <el-time-select
                    placeholder="起始时间"
                    v-model="startHour"
                    :picker-options="{
                      start: '00:00',
                      step: '01:00',
                      end: '24:00'
                    }">
                  </el-time-select>
                  <el-time-select
                    placeholder="结束时间"
                    v-model="endHour"
                    :picker-options="{
                      start: '00:00',
                      step: '01:00',
                      end: '24:00'
                    }">
                  </el-time-select>
          </div>
          <div style="float:left;margin-right:10px;margin-top:5px;">
            <span style="float:left;margin-top:10px;margin-right:10px;">用车次数</span> <el-input-number v-model="num" :min="0" :max="10000" label="描述文字"></el-input-number>
          </div>

          <button type="button" class="btn btn-default" style="float:right;background-color:#20a1ff;color:white;margin-top:5px;" >
              <span v-show="!blnSearch">分 析</span>
              <i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i>
          </button>
          <div class="clearfix"></div>
        </div>
        <!--右边显示区域-->
        <div class="right_container">
          <!--列表栏-->
          <div class="title">网约车分析 <span style="float:right;font-size:12px;">完成时间&nbsp;&nbsp;&nbsp;2018-02-01</span></div>
          <!--内容栏-->
          <div class="content">
            <Scroll>
              <div class="item">
                <div class="child_item">
                  <span class="item_title">积累人数</span>
                  <span class="item_icon"><i class="fa fa-line-chart" @click="LookLine()"></i><i class="fa fa-navicon"></i></span>
                  <span class="item_number">47人</span>
                </div>
              </div>

              <div class="item">
                <div class="child_item">
                  <span class="item_title" style="font-size:14px;">乘车地址top</span>
                  <span class="item_icon"><i class="fa fa-bullseye" @click="heartMap()"></i><i class="fa fa-navicon"></i></span>
                </div>
                <div class="child_item">
                  <span class="item_title">美全世纪城附近</span>
                  <span class="item_icon"> &nbsp;</span>
                  <span class="item_number">10人</span>
                </div>
                <div class="child_item">
                  <span class="item_title">美全世纪城附近</span>
                  <span class="item_icon"> &nbsp;</span>
                  <span class="item_number">10人</span>
                </div>
              </div>

              <div class="item">
                <div class="child_item">
                  <span class="item_title" style="font-size:14px;">目的地top</span>
                  <span class="item_icon"><i class="fa fa-bullseye"></i><i class="fa fa-navicon"></i></span>
                </div>
                <div class="child_item">
                  <span class="item_title">美全世纪城附近</span>
                  <span class="item_icon"> &nbsp;</span>
                  <span class="item_number">10人</span>
                </div>
                <div class="child_item">
                  <span class="item_title">美全世纪城附近</span>
                  <span class="item_icon"> &nbsp;</span>
                  <span class="item_number">10人</span>
                </div>
              </div>

              <div class="item" v-for="d in data">
                <div class="child_item">
                  <span class="item_title" style="font-size:14px;">{{d.name}}</span>
                  <span class="item_icon"><i class="fa fa-navicon"></i></span>
                </div>
                <!--图表显示容器-->
                <div class="chart_container" :id="d.id"></div>
              </div>

              <!--<div class="item">
                <div class="child_item">
                  <span class="item_title" style="font-size:14px;">目的地区域分布</span>
                  <span class="item_icon"><i class="fa fa-navicon"></i></span>
                </div>

                <div class="chart_container" id="chartwo"></div>
              </div>-->

            </Scroll>
          </div>
        </div>
    </div>
</template>

<script>
import echarts from  'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/legend'

import Scroll from 'components/scroll'

import {AddAnalyTask} from '../store/mutation-types'


export default {
  name: 'NetAboutCar',
  components:{Scroll},
  data () {
    return {
      mapid:'map'+tool.guid(),
      map:null,
      blnSearch:false,
      num:0,
      charts:{},
      data:[{id:'chartone',name:'乘车地区域分布'},{id:'chartwo',name:'乘车地区域分布'}],
      timeRange:[],
      startHour:'',
      endHour:''
    }
  },
  watch:{
    startHour(){
      console.log(parseInt(this.startHour));
    }
  },
  mounted(){
    this.initMap();

    setTimeout(()=>{
      this.initEchart();
    },1000);
    
  },
  methods:{
    //初始化地图
    initMap(){
      this.map = new BMap.Map(this.mapid,{minZoom:13,maxZoom:18});
      let centerPoint=tool.cookie.get('centerPoint').split(',') || [];
      this.map.centerAndZoom(new BMap.Point(centerPoint[0] || 0,centerPoint[1] || 0),13);
      this.map.enableScrollWheelZoom(true);
    },
    //初始化图表插件
    initEchart(){
      this.charts={};
      let option={
          color:['#85c226','#f8c301','#728499'],
          legend: {
              orient: 'vertical',
              left: 'left',
              data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎'],
              textStyle:{color:'white'}
          },
          series : [
                {
                  name: '访问来源',
                  type: 'pie',
                  radius : '70px',
                  center: ['70%', '50%'],
                  data:[
                      {value:335, name:'直接访问'},
                      {value:310, name:'邮件营销'},
                      {value:234, name:'联盟广告'},
                      {value:135, name:'视频广告'},
                      {value:1548, name:'搜索引擎'}
                  ],
                  itemStyle: {
                      normal: {
                          label:{
                            show:true,
                            position:'inner',
                            formatter:'{d}%'
                          }
                      }
                  }
              }
          ]
      };
      _.each(this.data,d=>{
        this.charts[d.id] = echarts.init($(this.$el).find(`div[id="${d.id}"]`)[0]);
        this.charts[d.id].setOption(option);
      });
    },
    //查看折线图
    LookLine(){
      tool.open(function(){
        let html=`<div name="container" style="width:100%;height:100%;"></div>`;
        let chart=null;
        let param={
            title:'地图路径',
            area:['800px','600px'],
            content:`<div class="LookLine_pop" style="width:100%;height:100%;">${html}</div>`,
            success(layero){
              chart = echarts.init(layero.find('div[name="container"]')[0]);
              chart.setOption(
                 {
                  legend: {
                      data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
                  },

                  calculable : true,
                  xAxis : [
                      {
                          type : 'category',
                          boundaryGap : false,
                          data : ['周一','周二','周三','周四','周五','周六','周日']
                      }
                  ],
                  yAxis : [
                      {
                          type : 'value'
                      }
                  ],
                  series : [
                      {
                          name:'邮件营销',
                          type:'line',
                          stack: '总量',
                          data:[120, 132, 101, 134, 90, 230, 210]
                      },
                      {
                          name:'联盟广告',
                          type:'line',
                          stack: '总量',
                          data:[220, 182, 191, 234, 290, 330, 310]
                      },
                      {
                          name:'视频广告',
                          type:'line',
                          stack: '总量',
                          data:[150, 232, 201, 154, 190, 330, 410]
                      },
                      {
                          name:'直接访问',
                          type:'line',
                          stack: '总量',
                          data:[320, 332, 301, 334, 390, 330, 320]
                      },
                      {
                          name:'搜索引擎',
                          type:'line',
                          stack: '总量',
                          data:[820, 932, 901, 934, 1290, 1330, 1320]
                      }
                  ]
              }
              );
            }
        }

        return param;
      }());
    },
    //热力图
    heartMap(){
      
    }
  }
}
</script>

<style scoped lang="less">
 @import "../css/variables.less";
 .NetAboutCar{width:100%;height:100%;position:relative;}
 .NetAboutCar .map{width:100%;height:100%;}

 @bgColor:fade(@HeaderBgCol,90%);
 @rightContainerW:300px;
 .NetAboutCar .right_container{width:@rightContainerW;position:absolute;right:10px; top:10px;bottom:10px;background-color:@bgColor;border-radius:10px;overflow:hidden;}
 
 @titleH:40px;
 .NetAboutCar .right_container .title{width:100%;height:@titleH;line-height:@titleH;background-color:@Font_Hover_Col;color:white;text-align:left;padding:0px 10px;}

 .NetAboutCar .option_bar{
   position:absolute;top:10px;left:10px;right:@rightContainerW + 20px;background-color:rgba(47, 51, 65, 0.3);text-align:left;padding:2px 10px;border-radius:10px;color:white;
  }

  .NetAboutCar .right_container .content{width:100%;height:~'calc(100% - @{titleH})';color:white;text-align:left;font-size:12px;padding:10px 0px;}

  .NetAboutCar .right_container .content .item{padding:5px 20px;margin-top:10px;}
  .NetAboutCar .right_container .content .item .item_title{}
  .NetAboutCar .right_container .content .item  .item_number{float:right;margin-right:20px;}
  .NetAboutCar .right_container .content .item  .item_icon{float:right;width:60px;height:100%;display:inline-block;text-align:right;}
  .NetAboutCar .right_container .content .item  .item_icon i{margin-left:10px;cursor:pointer;}
  .NetAboutCar .right_container .content .item  .item_icon i:hover{color:@Font_Hover_Col;}

  .NetAboutCar .right_container .content .item .child_item{margin-bottom:5px;}

  .NetAboutCar .right_container .content .item .chart_container{width:100%;height:170px;}
</style>
