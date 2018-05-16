<!-- 数据质量页面组件 -->
<template>
    <div class="DataMass">
        <div class="page">
            <HTag :tags="pages" @change="tagChange">
                <div slot="t0" style="height:100%;width:100%;">
                    <div class="page">
                        <HList title="数据接收" :data="data" :header="header" :column="column" :showField="showField" :rowAction="[{name:'详细',action:'lookDetail',icon:'fa fa-plus'}]"
                            :searchAction="searchAction"  @lookDetail="lookDetail" :blnNoSel="true" :expan="false" 
                            @search="search" :blnNoPage="true"
                            />
                    </div>
                    <div class="loading" v-show="blnShowLoading"><div :id="id+'inloading'" class="loadingContainer"></div></div>
                </div>
                <div slot="t1" style="height:100%;width:100%;">
                    <div class="optionBar">
                        <div style="float:left;margin-left:10px;width:250px;margin-top:7px;">
                            <MulDropDwon :data="site" keyProp="厂商名称" id="厂商编码" placeholder="按厂商">
                                <div v-for="t in siteData" @mousedown="siteClick(t)">{{t.厂商名称}}</div>
                            </MulDropDwon>
                        </div>
                        <div style="display:inline-block;margin-left:10px;width:230px;margin-top:7px;">
                            <el-date-picker
                                style="width:220px"
                                v-model="time"
                                :picker-options="beforeToday"
                                type="daterange"
                                placeholder="选择日期范围">
                            </el-date-picker>
                        </div>

                        <div style="display:inline-block;margin-top:7px;">
                            <el-button type="primary" @click="chart_search()"><i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i><span v-show="!blnSearch">搜索</span></el-button>
                        </div>

                        <div style="float:right;display:inline-block;height:100%;display:none;">
                            <el-tooltip class="option_item" effect="light" content="导出Excel" placement="top">
                                <i class="fa fa-file-excel-o" @click=""></i>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="chart_container" name="chart_container"></div>
                </div>
                <div slot="t2" style="height:100%;width:100%;">
                        <div v-if="params.model" style="height:100%;">
                            <component  is="templatePage"
                                        :params="params "  
                                        style="padding:0px;"
                                        class="component-item" 
                                        ref="pages"  >
                            </component>
                        </div>
                </div>
            </HTag>
        </div>
    </div>
</template>

<script>
import HList from 'components/HList'
import cLoading from '../js/canvasLoading.js'
import {searchType} from '../enum/SearchType'
import HTag from 'components/HTag'
import {Add_History_Menu,DataMassCount,BODY_RESIZE,Trigger_RESIZE,Del_Nav_Page,Trigger_Page_Switch,Nav_Page,DataRate} from '../store/mutation-types'
import MulDropDwon from 'components/MulDropDown'

import echarts from  'echarts/lib/echarts'
import 'echarts/lib/chart/line'
// 引入提示框和标题组件
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

export default {
  name: 'DataMass',
  components:{HList,HTag,MulDropDwon},
  data () {
    return {
      beforeToday:{//限制只能选择今天之前的日期
           disabledDate(time) {
               return time.getTime() > Date.now();
           }
      },
      id:'',
      pages:[{name:'数据接收详情',icon:'fa fa-tag'},{name:'数据有效率',icon:'fa fa-tag'},{name:'错误记录',icon:'fa fa-tag'}],
      blnShowLoading:false,
      header:['厂商','上报条数','实际条数','有效条数','无效条数','有效率'],
      column:[{width:0,align:'center'},{width:150,align:'center'},{width:150,align:'center'},{width:150,align:'center'},{width:150,align:'center'},{width:150,align:'center'}],
      showField:'厂商名称,上报条数,实际条数,有效条数,无效条数,有效率',
      searchAction:[
            {name:'接收时间',type:searchType['日期范围'],val:[],options:{
                //限制只能选择今天之前的日期
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            }},
            {name:'厂商',type:'dropdown',val:'',placeholder:'按厂商',data:[],key:'厂商名称',label:'厂商名称',value:'厂商编码'}
            ],
      myLineChart:null,
      site:[],
      time:[],
      timeRange:[{name:'近一月',val:30},{name:'近一周',val:7},{name:'昨天',val:1}],
      pageNum:0,
      data:[],
      siteData:[],//厂商数据
      params:{},
      blnSearch:false,
    }
  },
  mounted(){
    this.id='page_'+tool.guid();
    this.myLineChart=echarts.init($(this.$el).find('div[name="chart_container"]')[0]);

    this.$nextTick(()=>{
        cLoading(this.id+'inloading',7);
        this.search(true);
        //获取数据质量有效率数据
        let endDate=new Date(),startTime=new Date();
        startTime.setDate(endDate.getDate()-7);

        this.$store.dispatch(DataRate,{
            receive_time_start:tool.DateFormat(startTime,'yyyyMMdd'),
            receive_time_end:tool.DateFormat(endDate,'yyyyMMdd'),
        }).then(res=>{
            this.initLineChart(res.biz_body);
        });
    });

    this.$store.commit(BODY_RESIZE,()=>{
        this.myLineChart.resize();
    });

    // //获取数据质量详细页面配置菜单对象

    let menus=_.compact(_.flatten(_.pluck(this.$store.getters.Menus,'menus')));

    let menu=tool.Clone(_.find(menus,m=>m.keyid=='235'));
   
    menu.id=menu.keyid;
    menu.type=menu.type || 'templatePage';
    this.params.model=menu;
  },
  methods:{
      //页面刷新
      refreshPage(){
        this.search(true);
        //获取数据质量有效率数据
        //获取数据质量有效率数据
        let endDate=new Date(),startTime=new Date();
        startTime.setDate(endDate.getDate()-7);
        this.$store.dispatch(DataRate,{
            receive_time_start:tool.DateFormat(startTime,'yyyyMMdd'),
            receive_time_end:tool.DateFormat(endDate,'yyyyMMdd'),
        }).then(res=>{
            this.initLineChart(res.biz_body);
        });
      },
      //tag项改变事件
      tagChange(){
        this.$store.commit(Trigger_RESIZE);
      },
      //查看详细
      lookDetail(val){
        //构造限定条件
        let extraConditon=[];
        extraConditon.push({filed:{
                            table:'clean_log',
                            key:'firm_id',
                            alias:'clean_log_firm_id',
                            value:val.厂商编码
                        },
                        value:val.厂商编码
                    });
        
        let menus=_.flatten(_.pluck(this.$store.getters.Menus,'menus'));
        let menu=tool.Clone(_.find(menus,m=>m.keyid=='235'));
        menu.id=menu.keyid;
        menu.type=menu.type || 'templatePage';
        menu.extraConditon=extraConditon;
        //现删除页面
        this.$store.commit(Del_Nav_Page,menu);
        setTimeout(()=>{
            this.$store.commit(Add_History_Menu,menu);
        },100);
      },
      //数据有效率搜索
      chart_search(){
        if(!this.time[0]){tool.info('请选择时间范围'); return;}
        //获取数据质量有效率数据
        this.$store.dispatch(DataRate,{
            receive_time_start:tool.DateFormat(this.time[0],'yyyyMMdd'),
            receive_time_end:tool.DateFormat(this.time[1],'yyyyMMdd'),
            firm_id:_.map(this.site,s=>s.厂商编码).join(',')
        }).then(res=>{
            this.initLineChart(res.biz_body);
        });
      },
      //搜索
      search(noSearch){
        let timeVal=this.searchAction[0].val,
            startTime=timeVal[0]?tool.Timestamp(timeVal[0]):'',
            endTime=timeVal[1]?tool.Timestamp(timeVal[1]):'';
        this.blnShowLoading=true;

        this.$store.dispatch(DataMassCount,{startTime:startTime,endTime:endTime,firm_id:this.searchAction[1].val}).then(res=>{
            this.blnShowLoading=false;
            if(res.msg.code!='successed')return;
            //转化接收数据为显示数据
            this.data=_.map(res.biz_body,r=>{
                    return {
                        '厂商编码':r.厂商编码,
                        '厂商名称':r.厂商名称,
                        '上报条数':r.data.上报条数 || '0',
                        '实际条数':r.data.实际条数 || '0',
                        '无效条数':r.data.无效条数 || '0',
                        '有效条数':r.data.有效条数 || '0',
                        '有效率'  :(((r.data.有效条数 || 0)/(r.data.实际条数 || 1)).toFixed(2) || 0) * 100+'%',
                    };
            });

            

            if(noSearch){
                this.siteData=tool.Clone(this.data);
            }

            if(this.searchAction[1].data.length<=0){
                this.searchAction[1].data=tool.Clone(this.data);
            }
        });
      },
      siteClick(d){
        if(_.findIndex(this.site,t=>t.厂商编码==d.厂商编码)>=0)return;
        this.site.push(d);
      },
      //初始化折线图
      initLineChart(data){
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
                toolbox: {
                    show: true,
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        dataView: {readOnly: false},
                        magicType: {type: ['line', 'bar']},
                        restore: {},
                        saveAsImage: {}
                    }
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
                series: firms
            };
        
        this.myLineChart.setOption(option,{notMerge:true});
      }
  }
}
</script>

<style scoped lang="less">
  @import "../css/variables.less";
  .DataMass{width:100%;height:100%;padding:5px;}
  .DataMass .page{background-color: @FrontCol;height: 100%;}
  //加载中动画
 .loading{position: absolute;top:0px;left:0px;right:0px;bottom:0px;}
 .loadingContainer{text-align: center;position: absolute;left: 50%;margin-left: -50px;top: 50%;margin-top: -50px;}

 @optionH:50px;
 .optionBar{height:@optionH;width:100%;text-align:left;.border('bottom');}
 .optionBar .option_item{margin-right:10px;cursor:pointer;}
 //.optionBar .option_item:hover{color:@Font_Hover_Col;}
 html{.TCol(~".optionBar .option_item:hover");}
 .chart_container{height:~'calc(100% - @{optionH})';width:100%;}
</style>
