<!-- 车船航班分析页面组件 -->
<template>
    <div class="ShipCar">

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
                <span style="display:inline-block;width:40%;">民族:&nbsp;{{h.task_conditions.nations && h.task_conditions.nations[0]}}</span><span style="display:inline-block;width:60%;">身份证:&nbsp;{{h.task_conditions.certs && h.task_conditions.certs[0]}}</span>
              </div>
              <div class="child">
                <span style="display:inline-block;width:50%;">结果:&nbsp;{{h.result_count}}</span><span style="display:inline-block;width:50%;">状态:&nbsp;{{h.status_note}}</span>
              </div>
            </div>
          </Scroll>
      </div>

        <!--操作栏-->
        <div class="main" :style="{'margin-left':blnShowHistoryPop?'340px':'0px'}">
            <div class="option_bar">
                <div style="float:left;margin-top:2px;">
                 日期 <el-date-picker type="daterange" v-model="timeRange"  placeholder="选择日期范围" style="width: 220px;display:inline-block;"></el-date-picker>
                </div>
                <div style="float:left;margin-top:2px;margin-left:10px;width:130px;">
                    <el-select v-model="nation"  clearable placeholder="民族">
                        <el-option
                        v-for="item in nations"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div style="float:left;margin-top:2px;margin-left:10px;width:200px;">
                    <el-input placeholder="身份筛选" v-model="cert" /> 
                </div>

                <button type="button" class="btn btn-default" style="float:left;background-color:#20a1ff;color:white;margin-top:3px;margin-left:10px;" @click="search()">
                    <span v-show="!blnSearch">分 析</span>
                    <i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i>
                </button>
            </div>
            <!--内容栏-->
            <div class="content">
                <!--图标显示区域-->
                <div class="chart_container" v-show="chartsData">

                    <div class="item">
                        <div style="position:absolute;font-size:14px;font-weight:600;top:0px;left:40px;">每日进入人数趋势</div>
                        <div name="chartone" style="width:100%;height:100%;"></div>
                        <div style="position:absolute;font-size:14px;top:0px;right:40px;color:rgb(3, 171, 103);cursor:pointer;" @click="lookList('in')">
                            <i class="fa fa-navicon"></i>
                        </div>
                    </div>
                    <div class="item">
                        <div style="position:absolute;font-size:14px;font-weight:600;top:0px;left:40px;">每日离开人数趋势</div>
                        <div name="charttwo" style="width:100%;height:100%;"></div>
                        <div style="position:absolute;font-size:14px;top:0px;right:40px;color:rgb(3, 171, 103);cursor:pointer;" @click="lookList('out')">
                            <i class="fa fa-navicon"></i>
                        </div>
                    </div>
                </div>

                <!--内容显示区域-->
                <div class="content_container" v-if="personData.length>0">
                    <div style="font-weight:600;font-size:14px;line-height:40px;">疑似群体</div>
                    <!--内容展示区域-->
                    <div class="info_conatienr">
                        <!--左边导航栏-->
                        <div class="left_nav">
                            <Scroll :listen="personData">
                                <div class="item" @click="curShowIndex=i" :class="{active:curShowIndex==i}"  v-for="(v,i) in personData" >{{v.netbar_wacode_note}}</div>
                            </Scroll>
                        </div>
                        <!--右边内容区域-->
                        <div class="right_container">
                            <Scroll>
                                <div class="person" v-for="p in personData[curShowIndex].persons">
                                    <div class="photo_container">
                                        <div class="photo">
                                            <img :src="'/cert/'+(p.cert_number || 0)" style="width:100%;height:100%;" />
                                        </div>
                                    </div>
                                    <div class="info">
                                        <div class="item">{{p.name}}</div>
                                        <div class="item">{{p.nation}}</div>
                                        <div class="item">身份证&nbsp;&nbsp;{{p.cert_number}}</div>
                                        <div class="item fixitem divEllipsis">到达车站&nbsp;&nbsp;{{p.to.station}}</div>
                                        <div class="item">到达时间&nbsp;&nbsp;{{converTime(p.receive_time)}}</div>
                                    </div>
                                </div>
                            </Scroll>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import echarts from  'echarts'
import Scroll from 'components/scroll'

import {BODY_RESIZE,GetNation,GetAnalyTask,AddAnalyTask,GetVehicleChart,GetVehiclePersonList,GetVehicleTeam,DelTraceHistory} from '../store/mutation-types'
export default {
  name: 'ShipCar',
  components:{Scroll},
  data () {
    return {
      chartone:null,
      charttwo:null,
      blnShowHistoryPop:false,
      blnSearch:false,
      curTask:null,
      historyData:[],
      timeRange:[],
      nation:'',
      cert:'',
      nations:[],
      chartsData:null,
      personData:[],
      curShowIndex:0,
    }
  },
  watch:{
    blnShowHistoryPop(){
        this.$nextTick(()=>{
            setTimeout(()=>{
                this.chartone.resize();
                this.charttwo.resize();
            },600);
        });
        
    },
    chartsData(){
        let keysdomestic=_.map(this.chartsData.inVehicle_domestic,d=>d.day),
            valsdomestic=_.map(this.chartsData.inVehicle_domestic,d=>d.count),
            keysabroad=_.map(this.chartsData.inVehicle_abroad,d=>d.day),
            valsabroad=_.map(this.chartsData.inVehicle_abroad,d=>d.count),
            keysdomesticOut=_.map(this.chartsData.outVehicle_domestic,d=>d.day),
            valsdomesticOut=_.map(this.chartsData.outVehicle_domestic,d=>d.count),
            keysabroadOut=_.map(this.chartsData.outVehicle_abroad,d=>d.day),
            valsabroadOut=_.map(this.chartsData.outVehicle_abroad,d=>d.count);
        let optionOne = {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['国内','国际']
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : _.uniq(keysdomestic.concat(keysabroad))
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'国内',
                        type:'line',
                        data:valsdomestic
                    },
                    {
                        name:'国际',
                        type:'line',
                        data:valsabroad
                    },
                ]
            };
        
        let optionTwo = {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['国内','国际']
                },
    
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : _.uniq(keysdomesticOut.concat(keysabroadOut))
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'国内',
                        type:'line',
                        data:valsdomesticOut
                    },
                    {
                        name:'国际',
                        type:'line',
                        data:valsabroadOut
                    },
                ]
            };

        this.$nextTick(()=>{
            setTimeout(()=>{
                this.chartone.setOption(optionOne);
                this.chartone.resize();
                this.charttwo.setOption(optionTwo);
                this.charttwo.resize();
            },300);
        });
        
    }
  },
  mounted(){
    setTimeout(()=>{
        this.initChart();
        //this.setChart();
    },200); 

    this.$store.commit(BODY_RESIZE,()=>{
        if(!this.chartone || !this.charttwo) return;
        this.chartone.resize();
        this.charttwo.resize();
    });

    this.getNation();
    this.getAnalyTask();

    //监听任务分析结果
    this.socket = io(ser.url);
    this.socket.on('vehicle', (data)=> {
      let d=eval('('+data+')');
      if(d.task_status!='completed') return;

      if(this.curTask.task_id!=d.task_id) return;
      
      let task=_.find(this.historyData,h=>h.task_id==d.task_id);
      task.result_count=d.count;
      this.lookTask(task);
    });
    
  },
  methods:{
    initChart(){
        this.chartone = echarts.init($(this.$el).find(`div[name="chartone"]`)[0]);
        this.charttwo = echarts.init($(this.$el).find(`div[name="charttwo"]`)[0]);
    },
    search(){
      if(this.timeRange.length<=0){return tool.info('时间范围必填!');}
      
      this.blnSearch=true;
      this.$store.dispatch(AddAnalyTask,{
        task_type:'vehicle',
        task_conditions:{
          begin_time:tool.Timestamp(this.timeRange[0]),
          end_time:tool.Timestamp(this.timeRange[1]),
          nations:[this.nation],
          certs:[this.cert]
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
          this.$store.dispatch(DelTraceHistory,id).then(res=>{
            if(!tool.msg(res,'删除成功!','删除失败!')) return;

            this.historyData.splice(i,1);
          }); 
      },function(){});
    },
    lookTask(t){
      if(!parseInt(t.result_count)){tool.info('没有相关结果!'); return;}
      this.getTaskDetail(t);
    },
    //获取任务详细
    getTaskDetail(t){
        this.curTask=t;
        //获取统计图信息
        this.$store.dispatch(GetVehicleChart,{
            task_id:t.task_id
        }).then(res=>{
            if(!tool.msg(res,'','获取数据失败!')) return;
            this.chartsData=res.biz_body;
        });

        //获取同行人员信息
        this.$store.dispatch(GetVehicleTeam,{
            task_id:t.task_id
        }).then(res=>{
            if(!tool.msg(res,'','获取数据失败!')) return;
            this.personData=res.biz_body;
        });
    },
    //查看列表
    lookList(type){
      let s=this;
      tool.open(function(){
        let w=$(s.$el).width(),
            h=$(s.$el).height();
        let html=`
            <div style="width:100%;height:calc(100% - 40px);">
                <div class="table_header">
                    <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                        <thead><tr>
                            <th style="width:120px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:120px;" class="divEllipsis">姓名</div></th>
                            <th style="width:120px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:120px;" class="divEllipsis">证件类型</div></th>
                            <th style="width:330px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:330px;" class="divEllipsis">证件号码/民族/国籍</div></th>
                            <th style="width:120px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:120px;" class="divEllipsis">车次/座位</div></th>
                            <th style="width:150px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">到达时间</div></th>
                            <th :style="{width:w+'px'}" style="border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div :style="{width:w+'px'}" class="divEllipsis">到达地</div></th>
                            <th style="width:200px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:200px;" class="divEllipsis">最近出现场所及时间</div></th>
                            <th style="width:80px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:80px;" class="divEllipsis">已关注</div></th>
                        </tr></thead>
                    </table>
                </div>
                <div class="table_body">
                    <Scroll :listen="data" ref="detailSrcoll">
                        <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                        <tbody><tr v-for="d in data">
                            <td style="width:120px;border-top:0px;border-right:1px solid #ddd;" class="text-center" :title="d.name"><div style="width:120px;" class="divEllipsis">{{d.name}}</div></td>
                            <td style="width:120px;border-top:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:120px;" class="divEllipsis">身份证</div></td>
                            <td style="width:330px;border-top:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:330px;" class="divEllipsis">{{d.cert_number}}/{{d.nation}}/{{d.nationality}}</div></td>
                            <td style="width:120px;border-top:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:120px;" class="divEllipsis">{{d.train_no}}/{{d.seat}}</div></td>
                            <td style="width:150px;border-top:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{converTime(d.time)}}</div></td>
                            <td :style="{width:w+'px'}" style="border-top:0px;border-right:1px solid #ddd;" class="text-center"><div :style="{width:w+'px'}" class="divEllipsis">{{d.to.country}}{{d.to.county}}{{d.to.station}}</div></td>
                            <td style="width:200px;border-top:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:200px;" class="divEllipsis">{{d.net_wacode_note || '无'}}/{{converTime(d.online)}}</div></td>
                            <td style="width:80px;border-top:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:80px;" class="divEllipsis">{{d.focus?'是':'否'}}</div></td>
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
            title:`${type=='in'?'进入':'离开'}信息`,
            area:[`${w}px`,`${h}px`],
            content:`<div class="Lookin_out_pop pop" style="width:100%;height:100%;overflow:hidden;background-color:rgba(47, 51, 65, 0.9) !important;color:white;">${html}</div>`,
            components:{Scroll},
            store:s.$store,
            offset:'10px',
            context:{
              w:0,
              pageIndex:0,
              limit:20,
              data:[],
              pageChange(index){
                  index = index<0?0:index;
                  let d=param.selfData;
                  s.$store.dispatch(GetVehiclePersonList,{
                      task_id:s.curTask.task_id,
                      type:type,
                      limit:d.limit,
                      skip:index*d.limit
                  }).then(res=>{
                      if(!tool.msg(res,'','获取数据失败!')){ return;}
                      //if(index==0){tool.info('已经位于首页!');}
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
                param.selfData.w=layero.width()-1120;

                param.selfData.pageChange(0);
            }
        };

        return param;
      }());
    },
    //获取历史记录
    getAnalyTask(){
      this.$store.dispatch(GetAnalyTask,{task_type:'vehicle'}).then(res=>{
        this.historyData=res.biz_body;
        this.blnShowHistoryPop=this.historyData.length>0;
      });
    },
    //获取民族
    getNation(){
        this.$store.dispatch(GetNation).then(res=>this.nations=res.biz_body);
    },
    //时间戳转日期
    converTime(t,format){
      return tool.DateByTimestamp(t,format || 'yyyy-MM-dd hh:mm:ss');
    },
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
    .ShipCar{width:100%;height:100%;padding:5px;background-color:white;position:relative;}

    .ShipCar .main{.trans();height:100%;}
    @optionH:40px;
    .ShipCar .option_bar{width:100%;height:@optionH;background-color:#d9d9d9;text-align:left;padding:0px 10px;}
    .ShipCar .content{width:100%;height:~'calc(100% - @{optionH})';.border('',#d9d9d9);}

    @contentH:380px;
    .ShipCar .content .chart_container{width:100%;height:~'calc(100% - @{contentH})';padding:20px;}
    .ShipCar .content .content_container{width:100%;height:@contentH;padding:10px 60px;text-align:left;}
    
    @step:30px;
    .ShipCar .content .chart_container .item{float:left;height:100%;width:~'calc(50% - @{step})';position:relative;}

    .ShipCar .content .chart_container .item:first-child{margin-right:@step;}

    .ShipCar .content .content_container .info_conatienr{width:100%;height:~'calc(100% - 40px)';.border('',#d9d9d9);}

    @navW:150px;
    .ShipCar .content .content_container .info_conatienr .left_nav{width:@navW;height:100%;float:left;}
    .ShipCar .content .content_container .info_conatienr .left_nav .item{line-height:30px;padding:0px 15px;}

    .ShipCar .content .content_container .info_conatienr .left_nav .item.active,
    .ShipCar .content .content_container .info_conatienr .left_nav .item:hover{cursor:pointer;background-color:@Font_Hover_Col;color:white;}

    .ShipCar .content .content_container .info_conatienr .right_container{margin-left:@navW;height:100%;.border('left',#d9d9d9);padding:10px;}

    .ShipCar .content .content_container .info_conatienr .right_container .person{
        width:330px;height:140px;.border('',#d9d9d9);border-radius:5px;display:inline-block;margin-right:15px;margin-bottom:15px;
    }

    @photoW:120px;
    .ShipCar .content .content_container .info_conatienr .right_container .person .photo_container{padding:10px 10px;width:@photoW;height:100%;float:left;}
    .ShipCar .content .content_container .info_conatienr .right_container .person .photo_container .photo{height:100%;width:100%;.border('',#d9d9d9);}

    .ShipCar .content .content_container .info_conatienr .right_container .person .info{margin-left:@photoW;height:100%;padding:10px;font-size:12px;}
    .ShipCar .content .content_container .info_conatienr .right_container .person .info .item{margin-bottom:8px;}
    .ShipCar .content .content_container .info_conatienr .right_container .person .info .fixitem{width:100%;}

    //左边侧边框
  @bgColor:fade(@HeaderBgCol,90%);
  @popW:300px;
  .ShipCar .left_pop{
    position:absolute;left:-@popW;top:14px;bottom:10px;z-index:100;width:@popW;background-color:@bgColor !important;
    border-top-right-radius:5px;border-bottom-right-radius:5px;color:white;text-align:left;
  }

  .ShipCar .left_pop.active{left:0px;}

  .ShipCar .left_pop .pop_lable{
    width:30px;position:absolute;top:50%;margin-top:-40px;
    background-color:@bgColor;color:white;
    font-size:12px;padding:10px 8px;border-top-right-radius:5px;border-bottom-right-radius:5px;
    right:-30px;
    cursor:pointer;.trans();
  }

  .ShipCar .left_pop .pop_lable:hover{background-color:@Font_Hover_Col;}

  .ShipCar .left_pop .item{font-size:12px;padding:10px;.trans();.border('bottom');}
  .ShipCar .left_pop .item:hover{background-color:@Font_Hover_Col;cursor:pointer;}
  .ShipCar .left_pop .item .child{margin-bottom:10px;}
  .ShipCar .left_pop .item .item_type{
    padding:2px 8px;position:relative;display:inline-block;
  }

  .ShipCar .left_pop .item i:hover{color:#20a1ff;}

  .ShipCar .left_pop .item.active .bottom_right:before,
  .ShipCar .left_pop .item.active .bottom_right:after,
  .ShipCar .left_pop .item.active .top_left:after,
  .ShipCar .left_pop .item.active .top_left:before,
  .ShipCar .left_pop .item:hover .bottom_right:before,
  .ShipCar .left_pop .item:hover .bottom_right:after,
  .ShipCar .left_pop .item:hover .top_left:after,
  .ShipCar .left_pop .item:hover .top_left:before{background:@bgColor;}
</style>


