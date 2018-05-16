<!-- 网约车分析页面组件 -->
<template>
    <div class="NetAboutCar">
        <!--地图容器-->
        <div class="map" :id="mapid"></div>

        <!--中间地图伸缩尺-->
        <div class="scaleContainer" :style="{left:blnShowHistoryPop?'300px':'0px'}">
            <ScaleBar :start="mapLevel[0]" :end="mapLevel[1]" :defVal="mapLevel[2]" @change="zoomChange" ref="scaleBar" />
        </div>

        <!--左边侧边框-->
        <div class="left_pop bound" :class="{active:blnShowHistoryPop}">
          <!--显示标签-->
          <div class="pop_lable" @click="blnShowHistoryPop=!blnShowHistoryPop">
            历史记录
          </div>
          <Scroll ref="historyPopScroll" :listen="historyData">
            <div v-for="(h,i) in historyData" class="item" @click="lookTask(h);" style="position:relative;">
              <i class="fa fa-remove" style="position:absolute;right:10px;bottom:5px;font-size:20px;" @click.stop="removeTask(h.task_id,i)"></i>
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
        <!--提示信息-->
        <div style="position:absolute;top:100px;" :style="{'right':curTask?'320px':'0px',left:blnShowHistoryPop?'310px':'10px'}">
          <div style="padding: 5px 10px;display: inline-block;background: rgb(3, 171, 103);color: white;border-radius: 5px;" v-if="tipInfo">{{tipInfo}}</div>
        </div>

        <!--右边显示区域-->
        <div class="right_container" v-if="curTask" :style="{bottom:curTask && curTask.task_status=='completed'?'10px':'auto'}">
          <!--数据加载提示信息-->
          <div class="tipInfo" v-if="curTask && curTask.task_status!=='completed'">
            <i class="fa fa-clock-o" style="font-size:30px;"></i>{{curTask.task_status=='created'?'正在分析,请稍后...':'出现异常'}}
          </div>
          <div v-if="curTask && curTask.task_status=='completed' && detailData" style="width:100%;height:100%;">
            <!--列表栏-->
            <div class="title">网约车分析 <span style="float:right;font-size:12px;">完成时间&nbsp;&nbsp;&nbsp;{{converTime(curTask.task_conditions.end_time,'yyyy-MM-dd')}}</span></div>
            <!--内容栏-->
            <div class="content">
              <Scroll ref="detailScroll">
                <div class="item">
                  <div class="child_item">
                    <span class="item_title">积累人数</span>
                    <span class="item_icon">
                      <el-tooltip placement="top" content="统计图">
                        <i class="fa fa-line-chart" @click="LookLine('day')"></i>
                      </el-tooltip>
                      <el-tooltip placement="top" content="列表信息">
                        <i class="fa fa-navicon" @click="lookPersonList()"></i>
                      </el-tooltip>
                    </span>
                    <span class="item_number">{{detailData.totlePerson}}人</span>
                  </div>
                </div>

                <div class="item" v-if="detailData.fromplaceTop.length>0">
                  <div class="child_item">
                    <span class="item_title" style="font-size:14px;">乘车地址top</span>
                    <span class="item_icon">
                      <el-tooltip placement="top" content="热点图">
                        <i class="fa fa-bullseye" @click="lookHeart(1)"></i>
                      </el-tooltip>
                      <el-tooltip placement="top" content="列表信息">
                        <i class="fa fa-navicon" @click="lookList(1)"></i>
                      </el-tooltip>
                    </span>
                  </div>
                  <div class="child_item" v-for="v in detailData.fromplaceTop" @click="posPointer(v)" style="cursor:pointer;">
                    <span class="item_title divEllipsis" :title="v.address">{{v.address}}</span>
                    <span class="item_number">{{v.count}}次</span>
                  </div>
                
                </div>

                <div class="item" v-if="detailData.toplaceTop.length>0">
                  <div class="child_item">
                    <span class="item_title" style="font-size:14px;">目的地top</span>
                    <span class="item_icon">
                      <el-tooltip placement="top" content="热点图">
                        <i class="fa fa-bullseye" @click="lookHeart()"></i>
                      </el-tooltip>
                      <el-tooltip placement="top" content="列表信息">
                        <i class="fa fa-navicon" @click="lookList()"></i>
                      </el-tooltip>
                    </span>
                  </div>
                  <div class="child_item" v-for="v in detailData.toplaceTop" @click="posPointer(v)" style="cursor:pointer;">
                    <span class="item_title divEllipsis" :title="v.address">{{v.address}}</span>
    
                    <span class="item_number">{{v.count}}次</span>
                  </div>

                </div>

                <div class="item" v-for="d in data">
                  <div class="child_item">
                    <span class="item_title divEllipsis" style="font-size:14px;">{{d.name}}</span>
                    <span class="item_icon">
                      <el-tooltip placement="top" content="列表信息">
                        <i class="fa fa-navicon" @click="lookArea(d)"></i>
                      </el-tooltip>
                    </span>
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
import 'echarts/lib/component/tooltip'

import Scroll from 'components/scroll'
import HeatMap from './Home.HeatMap.js'
import ScaleBar from 'components/scaleBar'

import {AddAnalyTask,GetAnalyTraceTask,GetAnalyTask,GetAnalyTaskData,DelAnalyTask,
        GetCarhailingChart,GetCarhailingPersonList,GetCarhailingFromplaceList,GetCarhailingToplaceList} from '../store/mutation-types'


export default {
  name: 'NetAboutCar',
  components:{Scroll,ScaleBar},
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
      pm:null,
      tipInfo:'',
      mapLevel:ser.map,
      posPointers:[],
    }
  },
  watch:{
    curTask(){
      this.$nextTick(()=>{
        setTimeout(()=>{
          if(!this.curTask) return;
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
    //刷新页面
    refreshPage(){
      this.blnSearch=false;
      this.num=0;
      this.charts={};
      this.timeRange=[];
      this.startHour='';
      this.endHour='';
      this.curTask=null;
      this.blnShowHistoryPop=false;
      this.historyData=[];
      this.detailData=null;
      if(this.pm)this.pm.destroy();
      this.pm=null;
      this.tipInfo='';
      this.posPointers=[];
      this.getAnalyTask();
    },
    //初始化地图
    initMap(){
      this.map = new BMap.Map(this.mapid,{minZoom:this.mapLevel[0],maxZoom:this.mapLevel[1]});
      let centerPoint=tool.cookie.get('centerPoint').split(',') || [];
      this.map.centerAndZoom(new BMap.Point(centerPoint[0] || 0,centerPoint[1] || 0),this.mapLevel[2]);
      this.map.enableScrollWheelZoom(true);

      //添加地图层级改变事件
      this.map.addEventListener('zoomend',(e)=>{
          var zoom=this.map.getZoom();
          this.$refs.scaleBar.setVal(zoom);
      });
    },
    posPointer(d){
      this.posPointers.push(this.drawPoint(this.map,d,true,d.address));
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
    //删除历史轨迹任务
    removeTask(id,i){
      tool.confirm('您确定要删除该任务吗?',['确定','取消'],()=>{
          this.$store.dispatch(DelAnalyTask,id).then(res=>{
            if(!tool.msg(res,'删除成功!','删除失败!')) return;

            this.historyData.splice(i,1);
          }); 
      },function(){});
    },
    //获取历史记录
    getAnalyTask(){
      this.$store.dispatch(GetAnalyTask,{task_type:'carhailing'}).then(res=>{
        this.historyData=res.biz_body;
        this.blnShowHistoryPop=this.historyData.length>0;
      });
    },
    lookTask(t){
      if(!parseInt(t.result_count)){tool.info('没有相关结果!'); return;}
      this.getTaskDetail(t);
      _.each(this.posPointers,(l)=>this.map.removeOverlay(l));
      this.posPointers=[];
    },

    //获取任务详细信息
    getTaskDetail(t){
      this.$store.dispatch(GetAnalyTaskData,{id:t.task_id}).then(res=>{
        if(!tool.msg(res)) return
        this.detailData=res.biz_body;
        this.curTask=t;

        this.data=_.flatten([
          _.keys((res.biz_body.fromRegion) || []).length>0?{
            id:'chartone',
            name:'乘车地区分布',
            data:res.biz_body.fromRegion
          }:[],
          _.keys((res.biz_body.toRegion) || []).length>0?{
            id:'chartwo',
            name:'目的地区分布',
            data:res.biz_body.toRegion
          }:[]
        ]);

        //默认打开第一个热力图
        this.lookHeart(0);
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
            tooltip : {
                trigger: 'item',
                formatter: "{b} : {c} ({d}%)"
            },
            series : [
                  {
                    name: '',
                    type: 'pie',
                    radius : '120px',
                    center: ['50%', '50%'],
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
    //查看网约车人员信息列表
    lookPersonList(){
      let s=this;

      tool.open(function(){
        let html=`
          <div class="table_header">
              <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                  <thead><tr>
                      <th style="width:150px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">驾驶员</div></th>
                      <th :style="{width:w+'px'}" style="border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div :style="{width:w+'px'}" class="divEllipsis">出发地</div></th>
                      <th :style="{width:w+'px'}" style="border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div :style="{width:w+'px'}"class="divEllipsis">目的地</div></th>
                      <th style="width:150px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">驾驶员电话</div></th>
                      <th style="width:150px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">乘车人电话</div></th>
                      <th style="width:150px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">上车时间</div></th>
                      <th style="width:150px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">车色</div></th>
                      
                  </tr></thead>
              </table>
          </div>
          <div class="table_body">
            <Scroll :listen="data" ref="detailSrcoll">
                <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                  <tbody><tr v-for="d in data">
                      <td style="width:150px;border-top:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{d.driver_name}}</div></td>
                      <td :style="{width:w+'px'}" style="border-top:0px;border-right:1px solid #ddd;" class="text-center" :title="d.from_address"><div :style="{width:w+'px'}" class="divEllipsis">{{d.from_address}}</div></td>
                      <td :style="{width:w+'px'}" style="border-top:0px;border-right:1px solid #ddd;" class="text-center" :title="d.to_address"><div :style="{width:w+'px'}" class="divEllipsis">{{d.to_address}}</div></td>
                      <td style="width:150px;border-top:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{d.driver_mobile}}</div></td>
                      <td style="width:150px;border-top:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{d.mobile}}</div></td>
                      <td style="width:150px;border-top:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{d.order_time}}</div></td>
                      <td style="width:150px;border-top:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{d.driver_color}}</div></td>
                      
                  </tr></tbody>
              </table>
            </Scroll>
          </div>
        `;
        let param={
            title:'人员信息',
            area:['1000px','600px'],
            content:`<div class="LookPersonList_pop pop" style="width:100%;height:100%;overflow: hidden;background-color:rgba(47, 51, 65, 0.9) !important;color:white;">${html}</div>`,
            components:{Scroll},
            store:s.$store,
            context:{
              w:0,
              data:[],
            },
            success(layero){
              param.selfData.w=(layero.width()-750)/2;

              s.$store.dispatch(GetCarhailingPersonList,{
                task_id:s.curTask.task_id
              }).then(res=>{
                if(!tool.msg(res,'','获取数据失败!')) return;
                param.selfData.data=res.biz_body;

              });
            }
        }

        return param;
      }());
    },
    //查看出发地/目的地列表
    lookList(type){
      let s=this;
      tool.open(function(){
        let html=`
          <div class="table_header">
              <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                  <thead><tr>
                      <th style="width:150px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">区域</div></th>
                      <th style="width:150px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">编码</div></th>
                      <th style="width:150px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">数量</div></th>
                      <th :style="{width:w+'px'}" style="border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div :style="{width:w+'px'}" class="divEllipsis">地址</div></th>
                  </tr></thead>
              </table>
          </div>
          <div class="table_body">
            <Scroll :listen="data" ref="detailSrcoll">
                <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                  <tbody><tr v-for="d in data">
                      <td style="width:150px;border-top:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{d.region_name}}</div></td>
                      <td style="width:150px;border-top:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{d.region_code}}</div></td>
                      <td style="width:150px;border-top:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{d.count}}</div></td>
                      <td :style="{width:w+'px'}" style="border-top:0px;border-right:1px solid #ddd;" class="text-center"><div :style="{width:w+'px'}" class="divEllipsis">{{d.address}}</div></td>
                  </tr></tbody>
              </table>
            </Scroll>
          </div>
        `;
        let chart=null;
        let param={
            title:`${type?'出发':'到达'}地列表`,
            area:['800px','600px'],
            content:`<div class="LookFromPlaceList_pop pop" style="width:100%;height:100%;overflow:hidden;background-color:rgba(47, 51, 65, 0.9) !important;color:white;">${html}</div>`,
            components:{Scroll},
            store:s.$store,
            context:{
              w:0,
              data:[]
            },
            success(layero){
              param.selfData.w=layero.width()-450;

       
              s.$store.dispatch(type?GetCarhailingFromplaceList:GetCarhailingToplaceList,{
                task_id:s.curTask.task_id
              }).then(res=>{
                if(!tool.msg(res,'','获取数据失败!'))  return

                param.selfData.data=res.biz_body;
              });

            }
        };

        return param;
      }());
    },
    //查看出发地/目的地热力图
    lookHeart(type){
      let s=this;
      if(this.pm)this.pm.destroy();

      this.tipInfo=type?'出发地热力图':'目的地热力图';

      s.$store.dispatch(type?GetCarhailingFromplaceList:GetCarhailingToplaceList,{
                task_id:s.curTask.task_id
              }).then(res=>{
        if(!tool.msg(res,'','获取数据失败!'))  return

        this.pm=new HeatMap(this.map,{});

        let data = _.map(res.biz_body,d=>{
          return {longitude:d.longti,latitude:d.lat,count:d.count};
        });
        let d = data[0];

        this.map.panTo(new BMap.Point(d.longitude,d.latitude));

        let ds ={};
        _.each(data,r=>{
          ds[r.longitude+'_'+r.latitude]={length:r.count};
        });

        this.pm.draw(ds);
      });
    },
    //查看折线图
    LookLine(type){
      
      let s=this;
      tool.open(function(){
        let html=`<div name="container" style="width:100%;height:100%;"></div>`;
        let chart=null;
        let param={
            title:'统计图',
            area:['800px','600px'],
            content:`<div class="LookLine_pop pop" style="width:100%;height:100%;">${html}</div>`,
            success(layero){
              chart = echarts.init(layero.find('div[name="container"]')[0]);
              //获取数据
              s.$store.dispatch(GetCarhailingChart,{
                task_id:s.curTask.task_id,
                type:type
              }).then(res=>{
                if(!tool.msg(res,'','获取数据失败!')) return;
                let data=res.biz_body;
                let days=_.map(data,d=>d.day);
                let ds=_.map(data,d=>d.count);

                chart.setOption(
                 {
                  calculable : true,
                  xAxis : [
                      {
                          type : 'category',
                          boundaryGap : false,
                          data :days
                      }
                  ],
                  yAxis : [
                      {
                          type : 'value'
                      }
                  ],
                  series : [
                      {
                          name:'',
                          type:'line',
                          data:ds
                      },
                  ]
                }
                );
              });
            }
        }

        return param;
      }());
    },
    //查看区域列表
    lookArea(d){
      let s=this;
      tool.open(function(){
        let html=`
          <div class="table_header">
              <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                  <thead><tr>
                      <th style="width:200px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:200px;" class="divEllipsis">区域名称</div></th>
                      <th style="width:100px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">次数</div></th>
                      <th style="width:100px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">百分比</div></th>
                  </tr></thead>
              </table>
          </div>
          <div class="table_body">
            <Scroll :listen="data" ref="detailSrcoll">
                <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                  <tbody><tr v-for="d in data">
                      <td style="width:200px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:200px;" class="divEllipsis">{{d.name}}</div></td>
                      <td style="width:100px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">{{d.count}}</div></td>
                      <td style="width:100px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">{{d.radio}}</div></td>
                  </tr></tbody>
              </table>
            </Scroll>
          </div>
        `;
        let param={
          title:`${d.name}`,
          area:['450px','350px'],
          content:`<div class="LookFromPlaceList_area_pop pop" style="width:100%;height:100%;overflow:hidden;">${html}</div>`,
          components:{Scroll},
          store:s.$store,
          context:{
            data:[]
          },
          success(layero){
            
            let countArr=_.pluck(d.data,'count');
            let total = _.reduce(countArr, function(memo, num){ return memo + num; }, 0)

            param.selfData.data=_.map(d.data,(v,k)=>{
              return {
                name:k,
                count:v.count,
                radio:(v.count/total*100).toFixed(2)
              }
            });
          }
        };

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

              // let d = res.biz_body[0];

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
    drawPoint(map,d,blnPanTo,extraInfo){
      pointOps= {};
      pointOps.size=pointOps.size || 30;
      pointOps.color=pointOps.color || 'red'

      let point=new BMap.Point(d.longitude || d.equipment_longitude || d.longti, d.latitude || d.equipment_latitude || d.lat);
      let labelStyle={
                          fontSize : "12px",
                          lineHeight : "20px",
                          fontFamily:"微软雅黑",
                          fontWeight:'600',
                          border:'0px solid black',
                          'background-color':'transparent',
                          'max-width':'none'
                      };

      var label= new BMap.Label(`<div style="background:url(static/map_${pointOps.color}.png);background-size: contain;width:${pointOps.size}px;height:${pointOps.size}px;line-height:${pointOps.size}px;text-align:center;color:white;">
                                  <div style="display:${extraInfo?'block':'none'};position:absolute;bottom:0px;color:white;bottom:-20px;line-height:20px;left:${extraInfo?((-extraInfo.length*12-20)/2+15)+'px':'0px'};background-color:#30cc73;border-radius:5px;padding:0px 10px;"> 
                                    ${extraInfo}
                                  </div>
                                  </div>`,{position:point,offset:new BMap.Size(-pointOps.size/2,-pointOps.size)});
      label.setStyle(labelStyle);
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
    zoomChange(zoom){
      if(!this.map)return;
      this.map.setZoom(zoom);
    }
  }
}
</script>

<style lang="less">
  @import "../css/variables.less";
 //列表样式
  @bgColor:fade(@HeaderBgCol,90%);
  @tableRowH:36px;
  .pop  .table{margin-bottom:0px;color: white;background-color:rgba(47, 51, 65, 0.9) !important;}
  .pop  .table_header{height:@tableRowH;}
  .pop  .table_header tr{height:~'calc(@{tableRowH} - 1px)';}
  .pop  .table_header th{padding:0px !important;color:black; line-height:@tableRowH;color:white;}
  .pop  .table_header{color:black;}
  .pop  .table_body{height:~'calc(100% - @{tableRowH})';width:100%;}
  .pop  .table_body td{padding:0px !important;color:black;line-height:@tableRowH;.border('bottom');color:white;}
</style>

<style scoped lang="less">
 @import "../css/variables.less";
 .NetAboutCar{width:100%;height:100%;position:relative;}
 .NetAboutCar .map{width:100%;height:100%;}
 .NetAboutCar .scaleContainer{
    position:absolute;top:90px;left:0px;z-index: 1000;
  }

 @bgColor:fade(@HeaderBgCol,90%);
 @rightContainerW:300px;
 .NetAboutCar .right_container{width:@rightContainerW;position:absolute;right:10px; top:10px;bottom:10px;background-color:@bgColor;border-radius:10px;overflow:hidden;}
 
 @titleH:40px;
 .NetAboutCar .right_container .title{width:100%;height:@titleH;line-height:@titleH;color:white;text-align:left;padding:0px 10px;}
 html{.TCol(~".NetAboutCar .right_container .title",'bg');}

 .NetAboutCar .right_container .tipInfo{color:white;font-size:20px;padding:20px;}
 html{.TCol(~".NetAboutCar .right_container .tipInfo",'bg');}

 .NetAboutCar .option_bar{
   position:absolute;top:10px;left:10px;right:@rightContainerW + 20px;background-color:rgba(47, 51, 65, 0.3);text-align:left;padding:2px 10px;border-radius:10px;color:white;
  }

  .NetAboutCar .right_container .content{width:100%;height:~'calc(100% - @{titleH})';color:white;text-align:left;font-size:12px;padding:10px 0px;}

  .NetAboutCar .right_container .content .item{padding:5px 20px;margin-top:10px;}
  .NetAboutCar .right_container .content .item .item_title{display:inline-block;width:80%;}
  .NetAboutCar .right_container .content .item  .item_number{float:right;margin-right:0px;}
  .NetAboutCar .right_container .content .item  .item_icon{float:right;width:60px;height:100%;display:inline-block;text-align:right;}
  .NetAboutCar .right_container .content .item  .item_icon i{margin-left:10px;cursor:pointer;}
  //.NetAboutCar .right_container .content .item  .item_icon i:hover{color:@Font_Hover_Col;}
  html{.TCol(~".NetAboutCar .right_container .content .item  .item_icon i:hover");}

  .NetAboutCar .right_container .content .item .child_item{margin-bottom:5px;}

  .NetAboutCar .right_container .content .item .chart_container{width:100%;height:280px;}

  
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

  //.NetAboutCar .left_pop .pop_lable:hover{color:@Font_Hover_Col;}
  html{.TCol(~".NetAboutCar .left_pop .pop_lable:hover");}

  .NetAboutCar .left_pop .item{font-size:12px;padding:10px;.trans();.border('bottom');}
  .NetAboutCar .left_pop .item:hover{cursor:pointer;}
  html{.TCol(~".NetAboutCar .left_pop .item:hover",'bg');}

  .NetAboutCar .left_pop .item .child{margin-bottom:10px;}
  .NetAboutCar .left_pop .item .item_type{
    padding:2px 8px;position:relative;display:inline-block;
  }
  .NetAboutCar .left_pop .item i:hover{cursor:pointer;color:#20a1ff;}

  .NetAboutCar .left_pop .item.active .bottom_right:before,
  .NetAboutCar .left_pop .item.active .bottom_right:after,
  .NetAboutCar .left_pop .item.active .top_left:after,
  .NetAboutCar .left_pop .item.active .top_left:before,
  .NetAboutCar .left_pop .item:hover .bottom_right:before,
  .NetAboutCar .left_pop .item:hover .bottom_right:after,
  .NetAboutCar .left_pop .item:hover .top_left:after,
  .NetAboutCar .left_pop .item:hover .top_left:before{background:@bgColor;}


  
</style>
