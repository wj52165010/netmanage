<!--线性统计插件(时间筛选)-->
<template>
    <div class="LineCount">
        <div class="title">
            <div class="tip">{{name}}</div>
            <div class="sub">
                <span class="time" name="time"><i class="fa fa-calendar" style="margin-right:5px;"></i>{{timeStr}}</span>
                <span class="totle">
                    <span class="label_info">总量</span>
                    <span class="sep">:</span>
                    <span class="info">{{data.total}}</span>
                </span>
                <span class="perDay">
                    <span class="label_info">日均</span>
                    <span class="sep">:</span>
                    <span class="info">{{data.day_average}}</span>
                </span>
            </div>
        </div>
        <!--日期选择-->
        <div class="dateSel">
            <div style="display:table;margin:0px auto;">
                <i class="fa fa-caret-left" :class="{disabled:!blnPre}" @click="subtractDay()"></i>
                <span>{{converTime(curTime)}}</span>
                <i class="fa fa-caret-right" :class="{disabled:!blnNext}" @click="addDay()"></i>
            </div>
        </div>
        <!--图表展示区域-->
        <div class="chart_container" @mouseleave="chart_mouseleave">
            <div class="numberInfo">{{curNumber}}</div>
            <div name="chart_container" style="width:100%;height:100%;"></div>
        </div>
    </div>
</template>

<script>
import {BODY_RESIZE} from '../../store/mutation-types'
import echarts from  'echarts/lib/echarts'
import 'echarts/lib/chart/line'
// 引入提示框和标题组件
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

//引入日期范围控件
import '../../../static/DateRangePicker/daterangepicker.css'
import '../../../static/DateRangePicker/moment.js'
import '../../../static/DateRangePicker/daterangepicker.js'

import {DayCount} from '../../store/mutation-types'

export default {
  name: 'LineCount',
  props:['name','time','keyWord','region','firm','microprobe'],
  data () {
    return {
      lineChart:null,
      timeVal:[],
      curTime:'',
      lastTime:'',//上一次日期
      curNumber:0,
      lastNumber:0,//上一次统计数据
      data:{},
      lastTimeData:[],//上一次的日期数据(为了恢复上一次记录的日期数据)
    }
  },
  computed:{
    timeStr(){
        if(this.timeVal.length<=0)return '';
        return this.timeVal[0].format('YYYY-MM-DD') +'至'+ this.timeVal[1].format('YYYY-MM-DD')+'|'+ this.timeVal[0].from(this.timeVal[1]);
    },
    blnNext(){
        if(!this.curTime)return false;
        return  this.curTime.isBefore(this.timeVal[1],'day');
    },
    blnPre(){
        if(!this.curTime)return false;
        return this.curTime.isAfter(this.timeVal[0],'day');
    }
  },
  watch:{
      time(){
         if(!this.time) return;
         if(this.time && !this.time[0]){
            this.time=this.lastTimeData;
         }
         this.timeVal=_.map(this.time,t=>moment(t));
         this.curTime=moment(this.timeVal[0]);
         this.lastTime=this.curTime;
         this.getData(true);
      },
      curTime(){
          if(!this.curTime)return;
          this.getCurDateData();
      },
      region(){
          this.getData();
      },
      firm(){
          this.getData();
      },
      microprobe(){
          this.getData();
      }
  },
  mounted(){
     this.init();
  },
  methods:{
      init(){
        if(this.time){
            this.lastTimeData=this.time;
            this.timeVal=_.map(this.time,t=>moment(t));
            this.curTime=moment(this.timeVal[0]);
            this.lastTime=moment(this.timeVal[0]);
            this.getData(true);
    
        }

        this.lineChart=echarts.init($(this.$el).find('div[name="chart_container"]')[0]);

        this.lineChart.on('click',(params)=>{
            let data =this.data.data[params.dataIndex];
            this.curTime=this.lastTime=moment(data.day);
            this.curNumber=this.lastNumber=data.count;
        });

        this.$nextTick(()=>{
            this.initTimer();
        });
        this.$store.commit(BODY_RESIZE,()=>{
            if(!this.lineChart)return;
            this.lineChart.resize();
        });
      },
      //获取数据
      getData(blnInit){
          this.$store.dispatch(DayCount,{
              region:this.region || '',
              firm_id:this.firm || '',
              microprobe_type:this.microprobe || '',
              date:`${this.curTime.format('YYYYMMDD')},${this.timeVal[1].format('YYYYMMDD')}`,
              type:this.keyWord
              }).then(res=>{
              if(!tool.msg(res,'','获取数据失败!'))return;
                this.data=res.biz_body;
                this.getCurDateData(blnInit);
                this.initLineChart(this.data || {data:[]});
          });
      },
      //获取当前日期对应的数据对象
      getCurDateData(blnInit){
          if(!this.data){this.curNumber=0; return;}
          if(!this.data || !this.data.data){this.curNumber=0; return;}
          let data = _.find(this.data.data,d=>{return d.day==this.curTime.format('YYYY-MM-DD')});
          if(!data){this.curNumber=0; return;}
          this.curNumber=data.count;
          if(blnInit){
              this.lastNumber=this.curNumber;
          }
      },
      chart_mouseleave(){
          this.curTime=this.lastTime;
          this.curNumber=this.lastNumber;
      },
      refresh(){this.lineChart.resize();},
      converTime(t){
        if(!t)return '';
        return t.format('M[月]D[日]');
      },
      //增加时间
      addDay(){
        if(!this.blnNext)return;
        let time=this.curTime.add(1,'days');
        this.curTime='';
        setTimeout(()=>{this.curTime=time},0);
      },
      //减少时间
      subtractDay(){
        if(!this.blnPre)return;
        let time=this.curTime.subtract(1,'days');
        this.curTime='';
        setTimeout(()=>{this.curTime=time},0);
      },
      initTimer(){
        let s=this;
        let minDate=moment(),maxDate=moment();
        minDate.subtract(60,'d');
        maxDate.add(60,'d');

        let timer= $(this.$el).find('span[name="time"]').daterangepicker({
            "startDate":s.timeVal.length>0?s.timeVal[0]:'',
            "endDate": s.timeVal.length>0?s.timeVal[1]:'',
            'minDate':minDate,
            'maxDate':maxDate,
            "locale": {
                "direction": "ltr",
                "format": "YYYY-MM-DD HH:mm",
                "separator": " - ",
                "fromLabel": "From",
                "toLabel": "To",
                "daysOfWeek": [
                    "星期天",
                    "星期一",
                    "星期二",
                    "星期三",
                    "星期四",
                    "星期五",
                    "星期六"
                ],
                "monthNames": [
                    "一月",
                    "二月",
                    "三月",
                    "四月",
                    "五月",
                    "六月",
                    "七月",
                    "八月",
                    "九月",
                    "十月",
                    "十一月",
                    "十二月"
                ]
            },
        }, function(start, end, label) {
            s.timeVal=[start,end];
            s.lastTimeData=[start.format('YYYY-MM-DD'),end.format('YYYY-MM-DD')];
            s.curTime=moment(start);
            s.getData();
        });
    },
    //初始化线性图
    initLineChart(data){
        let xAxis=[],yAxis=[],sAxis=[],s=this;
        _.each(data.data,d=>{
            xAxis.push(moment(d.day).format('M[月]D[日]'));
            yAxis.push(d.count);
        });

        let  option = {
                tooltip: {
                    trigger: 'axis',
                    formatter:function(params){
                        let cdata= data.data[params[0].dataIndex];
                        s.curTime=moment(cdata.day);
                        s.curNumber=cdata.count;
                        //return '数量:<br>'+params[0].value;
                    }
                },
                grid:{
                    left:'15%'
                },
                xAxis:  {
                    type: 'category',
                    boundaryGap: false,
                    axisLabel:{
                        rotate:45,
                    },
                    data: xAxis,
                    triggerEvent:true
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter:function(value){
                            return value;
                        }
                    }
                },
                series: [
                    {
                        name:'数量',
                        type:'line',
                        data:yAxis,
                        areaStyle: {normal: {}},
                    }
                ]
            };
        this.lineChart.setOption(option,{notMerge:true});
    }
  }
}
</script>

<style scoped lang="less">
  @import "../../css/variables.less";
  .LineCount{width:100%;height:100%;.border('');}
  @titleH:60px;
  .LineCount .title{height:@titleH;.border('bottom');width:100%;background-color:@Font_Hover_Col;text-align:left;}
  .LineCount .title .tip{color:white;line-height:30px;padding:0px 10px;}
  .LineCount .title .sub{width:100%;line-height:30px;height:30px;padding:0px 10px;font-size:12px;color:@HeaderBgCol;}
  .LineCount .title .sub .totle{color:white;font-weight:600;}
  .LineCount .title .sub .totle .label_info{font-size:20px;margin-left:10px;}
  
  .LineCount .title .sub .perDay{color:white;font-weight:600;}
  .LineCount .title .sub .perDay .label_info {font-size:14px;margin-left:10px;}

  @dateSelH:30px;
  .LineCount .dateSel{height:@dateSelH;width:100%;.border('bottom');text-align:center;}
  .LineCount .dateSel i{font-size:20px;height:@dateSelH;display:table-cell;vertical-align: middle;}
  .LineCount .dateSel span{height:@dateSelH;display:table-cell;vertical-align: middle;padding: 0px 10px;}

  .LineCount .dateSel i:hover{cursor:pointer;color:@Font_Hover_Col;}

  .LineCount .chart_container{height:~'calc(100% - @{titleH} - @{dateSelH})';width:100%;position:relative;}

  .LineCount .numberInfo{position:absolute;top:5px;width: 100%;text-align: center;color:@Font_Hover_Col;font-size:18px;}
  .disabled{color:@FontCol;}
</style>
