<!-- 网约车分析页面组件 -->
<template>
    <div class="NetAboutCar">
        <!--地图容器-->
        <div class="map" :id="mapid"></div>

        <!--左边侧边框-->
        <div class="left_pop bound" :class="{active:blnShowHistoryPop}">
          <!--显示标签-->
          <div class="pop_lable" @click="blnShowHistoryPop=!blnShowHistoryPop">
            历史记录
          </div>
          <Scroll ref="historyPopScroll" :listen="historyData">
            <div v-for="h in historyData" class="item" @click="lookTask(h);">
              <div class="child">
                <span style="display:inline-block;width:50%;">开始时间:&nbsp;{{converTime(h.task_conditions.begin_time,'yyyy-MM-dd')}}</span><span style="display:inline-block;width:50%;">结束时间:&nbsp;{{converTime(h.task_conditions.end_time,'yyyy-MM-dd')}}</span>
              </div>
              <div class="child">
                <span style="display:inline-block;width:50%;">开始时段:&nbsp;{{h.task_conditions.begin_hour}}点</span><span style="display:inline-block;width:50%;">结束时段:&nbsp;{{h.task_conditions.end_hour}}点</span>
              </div>
              <div class="child">
                <span style="display:inline-block;width:50%;">用车次数:&nbsp;{{h.task_conditions.frequency}}次</span><span style="display:inline-block;width:25%;">结果:&nbsp;{{h.result_count}}</span><span style="display:inline-block;width:25%;">状态:&nbsp;{{h.status_note}}</span>
              </div>
            </div>
          </Scroll>
        </div>

        <!--操作栏-->
        <div class="option_bar" :style="{'right':curTask?'320px':'0px',left:blnShowHistoryPop?'310px':'10px'}">
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

          <button type="button" class="btn btn-default" style="float:right;background-color:#20a1ff;color:white;margin-top:5px;" @click="search()" >
              <span v-show="!blnSearch">分 析</span>
              <i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i>
          </button>
          <div class="clearfix"></div>
        </div>
        <!--右边显示区域-->
        <div class="right_container" v-if="curTask" :style="{bottom:curTask && curTask.task_status=='completed'?'10px':'auto'}">
          <!--数据加载提示信息-->
          <div class="tipInfo" v-if="curTask.task_status!=='completed'">
            <i class="fa fa-clock-o" style="font-size:30px;"></i>{{curTask.task_status=='created'?'正在分析,请稍后...':'出现异常'}}
          </div>
          <div v-if="curTask.task_status=='completed' && detailData" style="width:100%;height:100%;">
            <!--列表栏-->
            <div class="title">网约车分析 <span style="float:right;font-size:12px;">完成时间&nbsp;&nbsp;&nbsp;2018-02-01</span></div>
            <!--内容栏-->
            <div class="content">
              <Scroll ref="detailScroll">
                <div class="item">
                  <div class="child_item">
                    <span class="item_title">积累人数</span>
                    <span class="item_icon"><i class="fa fa-line-chart" @click="LookLine()"></i><i class="fa fa-navicon"></i></span>
                    <span class="item_number">{{detailData.totlePerson}}人</span>
                  </div>
                </div>

                <div class="item" v-if="detailData.fromplaceTop.length>0">
                  <div class="child_item">
                    <span class="item_title" style="font-size:14px;">乘车地址top</span>
                    <span class="item_icon"><i class="fa fa-bullseye" @click="heartMap()"></i><i class="fa fa-navicon"></i></span>
                  </div>
                  <div class="child_item" v-for="v in detailData.fromplaceTop">
                    <span class="item_title">{{v.region_name}}</span>
                    <span class="item_icon"> &nbsp;</span>
                    <span class="item_number">{{v.count}}次</span>
                  </div>
                
                </div>

                <div class="item" v-if="detailData.toplaceTop.length>0">
                  <div class="child_item">
                    <span class="item_title" style="font-size:14px;" @click="heartMap()">目的地top</span>
                    <span class="item_icon"><i class="fa fa-bullseye"></i><i class="fa fa-navicon"></i></span>
                  </div>
                  <div class="child_item" v-for="v in detailData.toplaceTop">
                    <span class="item_title">{{v.region_name}}</span>
                    <span class="item_icon"> &nbsp;</span>
                    <span class="item_number">{{v.count}}次</span>
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

              </Scroll>
            </div>
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
import HeatMap from './Home.HeatMap.js'

import {AddAnalyTask,GetAnalyTraceTask,GetAnalyTask,GetAnalyTaskData} from '../store/mutation-types'


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
      endHour:'',
      curTask:null,
      blnShowHistoryPop:false,
      historyData:[],
      detailData:null,
    }
  },
  watch:{
    curTask(){
      this.$nextTick(()=>{
        setTimeout(()=>{
          if(this.curTask.task_status!='completed') return;
          setTimeout(()=>{
            this.initEchart();
            this.$refs.detailScroll.reloadyScroll();
          },200);
          
        },200);
        
      });
    },
  },
  mounted(){
    this.initMap();

    this.getAnalyTask();

    //监听任务分析结果
    this.socket = io(ser.url);
    this.socket.on('carhailing', (data)=> {
      let d=eval('('+data+')');
      if(d.task_status!='completed') return;

      if(this.curTask.task_id!=d.task_id) return;
      
      let task=_.find(this.historyData,h=>h.task_id==d.task_id);
      task.result_count=d.count;
      this.lookTask(task);
    });
    
  },
  methods:{
    //初始化地图
    initMap(){
      this.map = new BMap.Map(this.mapid,{minZoom:13,maxZoom:18});
      let centerPoint=tool.cookie.get('centerPoint').split(',') || [];
      this.map.centerAndZoom(new BMap.Point(centerPoint[0] || 0,centerPoint[1] || 0),13);
      this.map.enableScrollWheelZoom(true);
    },
    search(){
      if(this.timeRange.length<=0){return tool.info('时间范围必填!');}
      if(!this.startHour || !this.endHour){return tool.info('时间段必填!');}

      this.blnSearch=true;
      this.$store.dispatch(AddAnalyTask,{
        task_type:'carhailing',
        task_conditions:{
          begin_time:tool.Timestamp(this.timeRange[0]),
          end_time:tool.Timestamp(this.timeRange[1]),
          begin_hour:parseInt(this.startHour),
          end_hour:parseInt(this.endHour),
          frequency:this.num
        },
        
      }).then(res=>{
        this.blnSearch=false;
        if(!tool.msg(res,`正在分析中....`,'分析失败!')) return;
        this.curTask=res.biz_body[0];

        this.historyData.unshift(this.curTask);        
      });
    

    },
    //获取历史记录
    getAnalyTask(){
      this.$store.dispatch(GetAnalyTask,{task_type:'carhailing'}).then(res=>{
        this.historyData=res.biz_body;
      });
    },
    lookTask(t){
      if(!parseInt(t.result_count)){tool.info('没有相关结果!'); return;}
      this.getTaskDetail(t);
      
    },

    //获取任务详细信息
    getTaskDetail(t){
      this.$store.dispatch(GetAnalyTaskData,{id:t.task_id}).then(res=>{
        this.detailData=res.biz_body;
        this.curTask=t;

        this.data=_.flatten([
          _.keys(res.biz_body.fromRegion).length>0?{
            id:'chartone',
            name:'乘车地区分布',
            data:res.biz_body.fromRegion
          }:[],
          _.keys(res.biz_body.toRegion).length>0?{
            id:'chartwo',
            name:'目的地区分布',
            data:res.biz_body.toRegion
          }:[]
        ]);
      });

    },
    //初始化图表插件
    initEchart(){
      this.charts={};
  
        _.each(this.data,d=>{
          let data=d.data;
          let keys=_.keys(data); 
  
          let vals=_.map(data,(v,k)=>{return {name:k,value:v.count}});


          let option={
            color:['#85c226','#f8c301','#728499'],
            legend: {
                orient: 'vertical',
                left: 'left',
                data: keys,
                textStyle:{color:'white'}
            },
            series : [
                  {
                    name: '访问来源',
                    type: 'pie',
                    radius : '70px',
                    center: ['70%', '50%'],
                    data:vals,
                    itemStyle: {
                        normal: {
                            label:{
                              show:true,
                              position:vals.length>1?'inner':'center',
                              formatter:'{d}%',
                              textStyle : {
                                color:'white'
                              }
                            }
                        }
                    }
                }
            ]
        };
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
            title:'折线图',
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
      tool.open(function(){
        let id='pop_map'+tool.guid();
        html=`<div id="${id}" style="width:100%;height:100%;"></div>`;
        let param={
            title:'热力图',
            area:['800px','600px'],
            content:`<div class="LookLine_pop" style="width:100%;height:100%;">${html}</div>`,
            success(layero){
              let map = new BMap.Map(layero.find('#'+id)[0],{minZoom:13,maxZoom:18});
              map.centerAndZoom(new BMap.Point(113.841106,36.081306),13);
              map.enableScrollWheelZoom(true);
              let pm=new HeatMap(map,{});

              //let d = res.biz_body[0];

              // map.panTo(new BMap.Point(d.longitude,d.latitude));

              // let data ={};
              // _.each(res.biz_body,r=>{
              //   data[r.longitude+'_'+r.latitude]={length:parseInt(2)};
              // });

              // pm.draw(data);
            }
        }

        return param;
      }());
    },
    //画点
    drawPoint(map,d,blnPanTo){

      let point=new BMap.Point(d.longitude || d.equipment_longitude, d.latitude || d.equipment_latitude);
      var label= new BMap.Label(`<div style="border:3px solid white;width:20px;height:20px;border-radius:50%;background-color:#0faaea;">
                                    
                                </div>`,{position:point,offset:new BMap.Size(-pointOps.size/2,-pointOps.size)});
      label.setStyle({
                          fontSize : "12px",
                          lineHeight : "20px",
                          fontFamily:"微软雅黑",
                          fontWeight:'600',
                          border:'0px solid black',
                          'background-color':'transparent',
                          'max-width':'none'
                      });
      map.addOverlay(label);


      if(blnPanTo){
        map.panTo(point);
      }

      return label;
    },
    //清除地图覆盖物
    clearOverlays(map){
      map.clearOverlays();
    },
    //时间戳转日期
    converTime(t,format){
      return tool.DateByTimestamp(t,format || 'yyyy-MM-dd hh:mm:ss');
    },
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

 .NetAboutCar .right_container .tipInfo{color:white;font-size:20px;padding:20px;background-color:@Font_Hover_Col;}

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

  
    //左边侧边框
  @bgColor:fade(@HeaderBgCol,90%);
  @popW:300px;
  .NetAboutCar .left_pop{
    position:absolute;left:-@popW;top:14px;bottom:10px;z-index:100;width:@popW;background-color:@bgColor !important;
    border-top-right-radius:5px;border-bottom-right-radius:5px;color:white;text-align:left;
  }

  .NetAboutCar .left_pop.active{left:0px;}

  .NetAboutCar .left_pop .pop_lable{
    width:30px;position:absolute;top:50%;margin-top:-40px;
    background-color:@bgColor;color:white;
    font-size:12px;padding:10px 8px;border-top-right-radius:5px;border-bottom-right-radius:5px;
    right:-30px;
    cursor:pointer;.trans();
  }

  .NetAboutCar .left_pop .pop_lable:hover{background-color:@Font_Hover_Col;}

  .NetAboutCar .left_pop .item{font-size:12px;padding:10px;.trans();.border('bottom');}
  .NetAboutCar .left_pop .item:hover{background-color:@Font_Hover_Col;cursor:pointer;}
  .NetAboutCar .left_pop .item .child{margin-bottom:10px;}
  .NetAboutCar .left_pop .item .item_type{
    padding:2px 8px;position:relative;display:inline-block;
  }

  .NetAboutCar .left_pop .item.active .bottom_right:before,
  .NetAboutCar .left_pop .item.active .bottom_right:after,
  .NetAboutCar .left_pop .item.active .top_left:after,
  .NetAboutCar .left_pop .item.active .top_left:before,
  .NetAboutCar .left_pop .item:hover .bottom_right:before,
  .NetAboutCar .left_pop .item:hover .bottom_right:after,
  .NetAboutCar .left_pop .item:hover .top_left:after,
  .NetAboutCar .left_pop .item:hover .top_left:before{background:@bgColor;}


  
</style>
