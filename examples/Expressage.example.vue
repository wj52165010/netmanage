<!-- 隐患快递页面组件 -->
<template>
    <div class="Expressage">
        <!--地图容器-->
        <div class="map" :id="mapid"></div>
        <!--中间地图伸缩尺-->
        <div class="scaleContainer" :style="{left:blnShowHistoryPop?'300px':'0px'}">
            <ScaleBar :start="13" :end="18" @change="zoomChange" ref="scaleBar" />
        </div>

        <!--左边侧边框-->
        <div class="left_pop bound" :class="{active:blnShowHistoryPop}">
          <!--显示标签-->
          <div class="pop_lable" @click="blnShowHistoryPop=!blnShowHistoryPop">
            历史记录
          </div>
          <Scroll ref="historyPopScroll" :listen="historyData">
            <div v-for="(h,i) in historyData" class="item" @click="lookTask(h);" style="position:relative;">
              <i class="fa fa-remove" style="position:absolute;right:20px;bottom:5px;font-size:20px;" @click.stop="removeTask(h.task_id,i)"></i>
              <div class="child">
                <span style="display:inline-block;width:50%;">开始时间:&nbsp;{{converTime(h.task_conditions.begin_time,'yyyy-MM-dd')}}</span><span style="display:inline-block;width:50%;">结束时间:&nbsp;{{converTime(h.task_conditions.end_time,'yyyy-MM-dd')}}</span>
              </div>
           
              <div class="child">
                <span style="display:inline-block;width:50%;">结果:&nbsp;{{h.result_count}}</span><span style="display:inline-block;width:50%;">状态:&nbsp;{{h.status_note}}</span>
              </div>
            </div>
          </Scroll>
        </div>

        <!--操作栏-->
        <div class="option_bar" :style="{'right':curTask?'320px':'0px',left:blnShowHistoryPop?'310px':'10px'}">
          <div style="float:left;margin-right:10px;margin-top:2px;">
            日期 <el-date-picker type="daterange" v-model="timeRange"  placeholder="选择日期范围" style="width: 220px;display:inline-block;"></el-date-picker>
          </div>

          <button type="button" class="btn btn-default" style="float:right;background-color:#20a1ff;color:white;margin-top:2px;" @click="search()" >
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
            <div class="title">快递隐患分析 <span style="float:right;font-size:12px;">完成时间&nbsp;&nbsp;&nbsp;{{converTime(curTask.task_conditions.end_time,'yyyy-MM-dd')}}</span></div>
            <!--内容栏-->
            <div class="content">
              <Scroll ref="detailScroll">
                <div class="item">
                  <div class="child_item">
                    <span class="item_title">接收人数</span>
                    <span class="item_icon">
                      <el-tooltip placement="top" content="列表信息">
                        <i class="fa fa-navicon" @click="lookPersonList()"></i>
                      </el-tooltip>
                    </span>
                    <span class="item_number">{{detailData.totlePerson}}人</span>
                  </div>
                </div>

                <div class="item" v-if="detailData.locationTop.length>0">
                  <div class="child_item">
                    <span class="item_title" style="font-size:14px;">接收地top</span>
                    <span class="item_icon">
                      <el-tooltip placement="top" content="热点图">
                        <i class="fa fa-bullseye" @click="lookHeart()"></i>
                      </el-tooltip>
                      <el-tooltip placement="top" content="列表信息">
                        <i class="fa fa-navicon" @click="lookList()"></i>
                      </el-tooltip>
                    </span>
                  </div>
                  <div class="child_item" v-for="v in detailData.locationTop">
                    <span class="item_title">{{v.address}}</span>
                    <span class="item_number">{{v.count}}次</span>
                  </div>
                
                </div>

                <div class="item" v-for="d in data">
                  <div class="child_item">
                    <span class="item_title" style="font-size:14px;">{{d.name}}</span>
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

import {AddAnalyTask,GetAnalyTraceTask,GetAnalyTask,GetAnalyTaskData,DelTraceHistory,DelAnalyTask,
        GetCarhailingChart,GetCarhailingPersonList,GetCarhailingFromplaceList,GetCarhailingToplaceList,
        GetDangerExpress,GetDangerExpressList,GetDangerExpressListLoaction
        } from '../store/mutation-types'


export default {
  name: 'Expressage',
  components:{Scroll,ScaleBar},
  data () {
    return {
      mapid:'map'+tool.guid(),
      map:null,
      blnSearch:false,
      num:0,
      charts:{},
      data:[{id:'chartone',name:'区域'}],
      timeRange:[],
      curTask:null,
      blnShowHistoryPop:false,
      historyData:[],
      detailData:null,
      pm:null
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
    this.socket.on('danger_express', (data)=> {
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

      //添加地图层级改变事件
      this.map.addEventListener('zoomend',(e)=>{
          var zoom=this.map.getZoom();
          this.$refs.scaleBar.setVal(zoom);
      });
    },
    search(){
      if(this.timeRange.length<=0){return tool.info('时间范围必填!');}

      this.blnSearch=true;
      this.$store.dispatch(AddAnalyTask,{
        task_type:'danger_express',
        task_conditions:{
          begin_time:tool.Timestamp(this.timeRange[0]),
          end_time:tool.Timestamp(this.timeRange[1]),
        },
        
      }).then(res=>{
        this.blnSearch=false;
        if(!tool.msg(res,`正在分析中....`,'分析失败!')) return;
        this.curTask=res.biz_body[0];
        this.curTask.status_note='创建中...';

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
      this.$store.dispatch(GetAnalyTask,{task_type:'danger_express'}).then(res=>{
        this.historyData=res.biz_body;
        this.blnShowHistoryPop=this.historyData.length>0;
      });
    },
    lookTask(t){
      if(!parseInt(t.result_count)){tool.info('没有相关结果!'); return;}
      this.getTaskDetail(t);
      
    },

    //获取任务详细信息
    getTaskDetail(t){
      this.$store.dispatch(GetDangerExpress,{task_id:t.task_id}).then(res=>{
        if(!tool.msg(res,'','获取数据失败!')) return;
        this.detailData=res.biz_body;
        this.curTask=t;

        this.data=[
           {
            id:'chartone',
            name:'区域',
            data:res.biz_body.region
          }
        ];

        //默认打开热力图
        this.lookHeart();
      });

    },
    //初始化图表插件
    initEchart(){
      this.charts={};
  
        _.each(this.data,d=>{
          let data=d.data;
          let keys=_.map(data,d=>d.region_name); 
  
          let vals=_.map(data,(v,k)=>{return {name:v.region_name,value:v.count}});


          let option={
            color:['#85c226','#f8c301','#728499'],
            // legend: {
            //     orient: 'vertical',
            //     left: 'left',
            //     data: keys,
            //     textStyle:{color:'white'}
            // },
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
    //查看人员信息列表
    lookPersonList(){
      let s=this;
      tool.open(function(){
        let html=`
          <div style="width:100%;height:calc(100% - 40px);">
            <div class="table_header">
                <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                    <thead><tr>
                        <th style="width:150px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:120px;" class="divEllipsis">手机号</div></th>
                        <th style="width:80px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:80px;" class="divEllipsis">风险等级</div></th>
                        <th style="width:150px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">最后接收日期</div></th>        
                        <th style="width:50px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis">次数</div></th>        
                        <th :style="{width:w+'px'}" style="border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div :style="{width:w+'px'}" class="divEllipsis">最后接收地址</div></th>
                    </tr></thead>
                </table>
            </div>
            <div class="table_body">
                <Scroll :listen="data" ref="detailSrcoll">
                    <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                    <tbody><tr v-for="d in data">
                        <td style="width:150px;border-top:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:120px;" class="divEllipsis">{{d.mobile}}</div></td>
                        <td style="width:80px;border-top:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:80px;" class="divEllipsis">{{d.risk_level}}</div></td>
                        <td style="width:150px;border-top:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{converTime(d.date)}}</div></td>               
                        <td style="width:50px;border-top:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis">{{d.count}}</div></td> 
                        <td :style="{width:w+'px'}" style="border-top:0px;border-right:1px solid #ddd;" class="text-center"><div :style="{width:w+'px'}" class="divEllipsis">{{d.address}}</div></td>
                    </tr></tbody>
                </table>
                </Scroll>
            </div>
          </div>

          <div name="page_container" class="page_container">
              <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageIndex+1}}</span></span>
              <div class="firstPage" @click="pageChange(0)">首页</div>
              <div class="prePage" @click="pageChange(pageIndex-1)">上一页</div>
              <div class="nextPage" @click="pageChange(pageIndex+1)">下一页</div>
          </div>
        `;
        let param={
            title:'人员信息',
            area:['1000px','600px'],
            content:`<div class="LookPersonList_Express_pop pop" style="width:100%;height:100%;overflow:hidden;background-color:rgba(47, 51, 65, 0.9) !important;color:white;">${html}</div>`,
            components:{Scroll},
            store:s.$store,
            context:{
              w:0,
              pageIndex:0,
              limit:20,
              data:[],
              pageChange(index){
                  index = index<0?0:index;
                  let d=param.selfData;
                  s.$store.dispatch(GetDangerExpressList,{
                      task_id:s.curTask.task_id,
                      limit:d.limit,
                      skip:index*d.limit
                  }).then(res=>{
                      if(!tool.msg(res,'','获取数据失败!')){ return;}
                      if(res.biz_body.length<=0){tool.info('已经位于尾页!'); return;}

                      d.pageIndex=index;

                      d.data=res.biz_body;
                  });
              },
              //时间戳转日期
              converTime(t,format){
                return tool.DateByTimestamp(t,format || 'yyyy-MM-dd hh:mm:ss');
              },
            },
            success(layero){
              param.selfData.w=layero.width()-430;
              param.selfData.pageChange(0);
            }
        }

        return param;
      }());
    },
    //查看快递区域列表
    lookList(){
      let s=this;
      tool.open(function(){
        let html=`
          <div class="table_header">
              <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                  <thead><tr>
                      <th style="width:150px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">区域</div></th>
                      <th style="width:150px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">编码</div></th>
                      <th style="width:100px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">风险等级</div></th>
                      <th style="width:150px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">手机号码</div></th>
                      <th style="width:50px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis">次数</div></th>
                      <th :style="{width:w+'px'}" style="border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div :style="{width:w+'px'}" class="divEllipsis">地址</div></th>
                  </tr></thead>
              </table>
          </div>
          <div class="table_body">
            <Scroll :listen="data" ref="detailSrcoll">
                <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                  <tbody><tr v-for="d in data">
                      <td style="width:150px;border-top:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{d.region_name}}</div></td>
                      <td style="width:150px;border-top:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{d.region}}</div></td>
                      <td style="width:100px;border-top:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">{{d.risk_level}}</div></td>
                      <td style="width:150px;border-top:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{d.mobile}}</div></td>
                      <td style="width:50px;border-top:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis">{{d.count}}</div></td>
                      <td :style="{width:w+'px'}" :title="d.address" style="border-top:0px;border-right:1px solid #ddd;" class="text-center"><div :style="{width:w+'px'}" class="divEllipsis">{{d.address}}</div></td>
                  </tr></tbody>
              </table>
            </Scroll>
          </div>
        `;
        let chart=null;
        let param={
            title:'快递区域',
            area:['800px','600px'],
            content:`<div class="LookFromPlaceList_area_pop pop" style="width:100%;height:100%;overflow:hidden;background-color:rgba(47, 51, 65, 0.9) !important;color:white;">${html}</div>`,
            components:{Scroll},
            store:s.$store,
            context:{
              w:0,
              data:[]
            },
            success(layero){
              param.selfData.w=layero.width()-600;
              s.$store.dispatch(GetDangerExpressListLoaction,{
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
    //查看热力图
    lookHeart(){
      let s=this;
      if(this.pm)this.pm.destroy();

      s.$store.dispatch(GetDangerExpressListLoaction,{
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
          title:'区域',
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

            param.selfData.data=_.map(d.data,v=>{
              return {
                name:v.region_name,
                count:v.count,
                radio:(v.count/total*100).toFixed(2)
              }
            });
          }
        };

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
 .Expressage{width:100%;height:100%;position:relative;}
 .Expressage .map{width:100%;height:100%;}
 .Expressage .scaleContainer{
    position:absolute;top:90px;left:0px;z-index: 1000;
  }

 @bgColor:fade(@HeaderBgCol,90%);
 @rightContainerW:300px;
 .Expressage .right_container{width:@rightContainerW;position:absolute;right:10px; top:10px;bottom:10px;background-color:@bgColor;border-radius:10px;overflow:hidden;}
 
 @titleH:40px;
 .Expressage .right_container .title{width:100%;height:@titleH;line-height:@titleH;background-color:@Font_Hover_Col;color:white;text-align:left;padding:0px 10px;}

 .Expressage .right_container .tipInfo{color:white;font-size:20px;padding:20px;background-color:@Font_Hover_Col;}

 .Expressage .option_bar{
   position:absolute;top:10px;left:10px;right:@rightContainerW + 20px;background-color:rgba(47, 51, 65, 0.3);text-align:left;padding:2px 10px;border-radius:10px;color:white;
  }

  .Expressage .right_container .content{width:100%;height:~'calc(100% - @{titleH})';color:white;text-align:left;font-size:12px;padding:10px 0px;}

  .Expressage .right_container .content .item{padding:5px 20px;margin-top:10px;}
  .Expressage .right_container .content .item .item_title{}
  .Expressage .right_container .content .item  .item_number{float:right;margin-right:0px;}
  .Expressage .right_container .content .item  .item_icon{float:right;width:60px;height:100%;display:inline-block;text-align:right;}
  .Expressage .right_container .content .item  .item_icon i{margin-left:10px;cursor:pointer;}
  .Expressage .right_container .content .item  .item_icon i:hover{color:@Font_Hover_Col;}

  .Expressage .right_container .content .item .child_item{margin-bottom:5px;}

  .Expressage .right_container .content .item .chart_container{width:100%;height:260px;}

  
    //左边侧边框
  @bgColor:fade(@HeaderBgCol,90%);
  @popW:300px;
  .Expressage .left_pop{
    position:absolute;left:-@popW;top:14px;bottom:10px;z-index:100;width:@popW;background-color:@bgColor !important;
    border-top-right-radius:5px;border-bottom-right-radius:5px;color:white;text-align:left;
  }

  .Expressage .left_pop.active{left:0px;}

  .Expressage .left_pop .pop_lable{
    width:30px;position:absolute;top:50%;margin-top:-40px;
    background-color:@bgColor;color:white;
    font-size:12px;padding:10px 8px;border-top-right-radius:5px;border-bottom-right-radius:5px;
    right:-30px;
    cursor:pointer;.trans();
  }

  .Expressage .left_pop .pop_lable:hover{background-color:@Font_Hover_Col;}

  .Expressage .left_pop .item{font-size:12px;padding:10px;.trans();.border('bottom');}
  .Expressage .left_pop .item:hover{background-color:@Font_Hover_Col;cursor:pointer;}
  .Expressage .left_pop .item .child{margin-bottom:10px;}
  .Expressage .left_pop .item .item_type{
    padding:2px 8px;position:relative;display:inline-block;
  }

  .Expressage .left_pop .item i:hover{color:#20a1ff;}

  .Expressage .left_pop .item.active .bottom_right:before,
  .Expressage .left_pop .item.active .bottom_right:after,
  .Expressage .left_pop .item.active .top_left:after,
  .Expressage .left_pop .item.active .top_left:before,
  .Expressage .left_pop .item:hover .bottom_right:before,
  .Expressage .left_pop .item:hover .bottom_right:after,
  .Expressage .left_pop .item:hover .top_left:after,
  .Expressage .left_pop .item:hover .top_left:before{background:@bgColor;}


  
</style>
