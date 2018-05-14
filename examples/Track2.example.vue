<!-- 轨迹分析组件 -->
<template>
    <div class="Track">
      <!--地图容器-->
      <div :id="id" class="map"></div>

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
          <Scroll ref="historyPopScroll" :listen="historyTrace">
            <div v-for="(h,i) in historyTrace" class="item" style="position:relative;" :class="{active:historyPopIndex==i}"  @click="lookTask(h);historyPopIndex=i;">
                <i class="fa fa-remove" style="position:absolute;right:20px;bottom:10px;font-size:20px;" @click.stop="removeTask(h.task_id,i)"></i>
                <div class="child">
                  <div class="item_type">
                    {{h.key_type_note}}
                    <div class="top_left"></div>
                    <div class="bottom_right"></div>
                  </div>
                  <div class="item_type">关键字:{{h.trace_key}}</div>
                  <div class="item_type">{{h.status_note}}</div>
                </div>
                <div class="child">
                  <span style="display:inline-block;width:50%;">开始时间:&nbsp;{{converTime(h.start_time,'yyyy-MM-dd')}}</span><span style="display:inline-block;width:50%;">结束时间:&nbsp;{{converTime(h.end_time,'yyyy-MM-dd')}}</span>
                </div>
                <div class="child">
                  <div style="display:inline-block;width:130px;" class="divEllipsis">区域:&nbsp;{{h.locus_ids_note}}</div><div style="float:right;width:140px;">结果:&nbsp;{{parseInt(h.result)?'有':'无'}}</div>
                </div>              
            </div>
          </Scroll>
      </div>

      <!--左边显示内容-->
      <div class="left_container" :style="{right:blnShowLoading==0?'10px':'300px',left:blnShowHistoryPop?'300px':'0px'}">
        <!--顶部显示信息-->
        <div class="top_info">
          <div class="taginfo" style="display:none"> 
            <div class="item" :class="{active:!blnShowHistory}" @click="blnShowHistory=false">本 次 分 析</div>
            <div class="item" :class="{active:blnShowHistory}" @click="blnShowHistory=true;blnShowDetail=false;">历 史 记 录</div>
          </div>
          <div class="option" v-show="!blnShowHistory">
            <div style="display:inline-block;width:350px;">
              <SearchDropdown v-model="searchNum" :data="searchResult" :info="serachInfo" :noShowOnlyOne="true" holder="请输入关键字(身份证/手机号/MAC/ISMI)" >
                <div class="dropdownItem" v-for="s in searchResult" @click="dropdownItemClick(s)">
                  {{s.name}}<span style="float:right;">{{s.type}}</span>
                </div>
              </SearchDropdown>
            </div>
            <el-date-picker type="daterange" v-model="timeRange" placeholder="选择日期范围" style="width: 220px;display:inline-block;"></el-date-picker>
            
            <div style="display:inline-block;width:250px;"><PlaceSearch :blnClear="true" c_searchKind="0" @place_res="placechange"></PlaceSearch></div>
            
            <button type="button" class="btn btn-default" style="float:right;background-color:#20a1ff;color:white;" @click="search()">
              <span v-show="!blnSearch">搜 索</span>
              <i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i>
            </button>
          </div>
        </div>
      </div>

      <!--底部显示内容-->
      <div class="bottom_info" v-show="!blnShowHistory" :style="{right:blnShowLoading==0?'0px':'300px',left:blnShowHistoryPop?'300px':'0px'}">
        <!--播放器-->
        <div class="player">
          <PointPlayer ref="mapPlayer" :data="traceData" :blnNoRefresh="true"  :range="range" @countChange="countChange" @timeChange="timeChange" />
        </div>
        <!--详细按钮-->
        <div class="detailbtn" @click="blnShowDetail=!blnShowDetail">详 细<br>轨 迹</div>
      </div>
      <!--历史记录-->
      <div class="historyList" v-show="blnShowHistory" :style="{right:blnShowLoading==0?'10px':'300px'}">
        <!--删除按钮-->
        <div class="delBtn" @click="blnShowHistory=false"><i class="fa fa-remove"></i></div>
          <!--表头-->
          <div class="table_header">
              <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                  <thead><tr>
                      <th style="width:150px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">关键词</div></th>
                      <th style="width:100px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">状态</div></th>
                      <th style="width:100px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">类型</div></th>
                      <th style="width:150px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">开始时间</div></th>
                      <th style="width:150px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">结束时间</div></th>
                      <th style="width:150px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">创建时间</div></th>
                      <th style="border-bottom:0px;border-right:1px solid #ddd;" :style="{width:descW+'px'}" class="text-center"><div :style="{width:descW+'px'}" class="divEllipsis">区域</div></th>
                      <th style="width:150px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">是否有结果</div></th>
                      <th style="width:350px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">操作</div></th>
                  </tr></thead>
              </table>
          </div>
          <!--表体-->
          <div class="table_body">
            <Scroll :listen="historyTrace" ref="historySrcoll">
                <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                  <tbody><tr v-for="(h,i) in historyTrace">
                      <td style="width:150px;border-bottom:1px solid;border-top: 0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{h.trace_key}}</div></td>
                      <td style="width:100px;border-bottom:1px solid;border-top: 0px;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">{{h.status_note}}</div></td>
                      <td style="width:100px;border-bottom:1px solid;border-top: 0px;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">{{h.key_type_note}}</div></td>
                      <td style="width:150px;border-bottom:1px solid;border-top: 0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{converTime(h.start_time)}}</div></td>
                      <td style="width:150px;border-bottom:1px solid;border-top: 0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{converTime(h.end_time)}}</div></td>
                      <td style="width:150px;border-bottom:1px solid;border-top: 0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{converTime(h.log_time)}}</div></td>
                      <td style="border-bottom:1px solid;border-top: 0px;border-right:1px solid #ddd;" :style="{width:descW+'px'}" class="text-center"><div :style="{width:descW+'px'}" class="divEllipsis">{{h.locus_ids_note}}</div></th>
                      <td style="width:150px;border-bottom:1px solid;border-top: 0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{parseInt(h.result)?'有':'无'}}</div></td>
                      <td style="width:350px;border-bottom:1px solid;border-top: 0px;border-right:1px solid #ddd;" class="text-center">
                        <div style="width:150px;" class="divEllipsis optionBar">
                          <i class="fa fa-remove" @click="removeTask(h.task_id,i)"></i>
                          <i class="fa fa-eye" @click="lookTask(h)"></i>
                        </div>
                      </td>
                  </tr></tbody>
              </table>
            </Scroll>
          </div>
      </div>
      <!--轨迹详细信息-->
      <div class="historyList" v-show="blnShowDetail" :style="{right:blnShowLoading==0?'10px':'300px',left:blnShowHistoryPop?'310px':'0px'}">
        <!--删除按钮-->
        <div class="delBtn" @click="blnShowDetail=false"><i class="fa fa-remove"></i></div>
        <!--表头-->
        <div class="table_header">
            <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                <thead><tr>
                    <th style="width:150px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">场所编码</div></th>
                    <th style="width:150px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">场所名称</div></th>
                    <th style="width:200px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:200px;" class="divEllipsis">关键字</div></th>
                    <th style="width:150px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">开始时间</div></th>
                    <th style="width:150px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">结束时间</div></th>
                    <th style="border-bottom:0px;border-right:1px solid #ddd;" :style="{width:detailW+'px'}" class="text-center"><div :style="{width:detailW+'px'}" class="divEllipsis">场所地址</div></th>
                </tr></thead>
            </table>
        </div>
        <!--表体-->
          <div class="table_body">
            <Scroll :listen="cTraceData" ref="detailSrcoll">
                <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                  <tbody><tr v-for="(h,i) in cTraceData">
                      <td style="width:150px;border-bottom:1px solid;border-top: 0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{h.netbar_wacode}}</div></td>
                      <td style="width:150px;border-bottom:1px solid;border-top: 0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{h.netbar_name}}</div></td>
                      <td style="width:200px;border-bottom:1px solid;border-top: 0px;border-right:1px solid #ddd;" class="text-center"><div style="width:200px;" class="divEllipsis">{{keyword(h)}}</div></td>
                      <td style="width:150px;border-bottom:1px solid;border-top: 0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{converTime(h.start_time)}}</div></td>
                      <td style="width:150px;border-bottom:1px solid;border-top: 0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{converTime(h.end_time)}}</div></td>
                      <td style="border-bottom:1px solid;border-top: 0px;border-right:1px solid #ddd;" :style="{width:detailW+'px'}" class="text-center"><div :style="{width:detailW+'px'}" class="divEllipsis">{{h.netbar_address}}</div></th>
                  </tr></tbody>
              </table>
            </Scroll>
          </div>
      </div>

      <!--主要活动范围地图展示区域-->
      <div class="historyList border_black" v-if="blnRangeMapShow" :style="{right:blnShowLoading==0?'10px':'300px',left:blnShowHistoryPop?'310px':'0px'}">
        <!--删除按钮-->
        <div class="delBtn" @click="blnRangeMapShow=false"><i class="fa fa-remove"></i></div>
        <div style="width:100%;height:100%;" :id="rangeMapId" ></div>
      </div>

      <!--右边显示内容-->
      <div class="right_container" v-show="blnShowLoading>0">
        <!--显示内容-->
        <div class="content" :class="{showLoading:blnShowLoading==1}">
          <!--标题栏-->
          <div class="title">轨迹分析<span style="float:right;" v-if="detailInfo">完成时间:{{converTime(detailInfo.finished_time)}}</span></div>
          <!--数据加载提示信息-->
          <div class="tipInfo" v-show="blnShowLoading==1">
            <i class="fa fa-clock-o" style="font-size:30px;"></i> 正在分析,请稍后...
          </div>
          <!--展示区域-->
          <div class="info" v-if="blnShowLoading==2">
            <Scroll ref="detailScroll">
              <div class="item">
                <div class="label">{{converTime(detailInfo.stat_begin,'yyyy-MM-dd hh:mm')}}&nbsp;&nbsp;&nbsp;到&nbsp;&nbsp;&nbsp;{{converTime(detailInfo.stat_end,'yyyy-MM-dd hh:mm')}}</div>
                <div class="sub">跨度{{detailInfo.day_count}}天 / 有效{{detailInfo.appear_count}}天 / 缺失{{detailInfo.disappear_count}}天</div>
                <div class="child">累计次数 <span style="float:right;">{{detailInfo.trace_count}}次</span></div>
                <div class="child">累计场所 <span style="float:right;">{{detailInfo.site_count}}所</span></div>
              </div>

              <div class="item" v-show="detailInfo.weekday.length>0">
                <div class="label">周活动Top</div>
                <div class="child" v-for="d in detailInfo.weekday" :title="'周'+chineseNum[d.week]+'出现频率'+(d.appear_count/d.count*100).toFixed(1)+'%'">
                  周{{chineseNum[d.week]}}
                  <span class="right">{{(d.appear_count/d.count*100).toFixed(1)}}%</span> 
                  <div class="right process">
                    <div class="child" :style="{width:d.appear_count/d.count*100+'%'}"></div>
                  </div>
                </div>
              </div>

              <div class="item" v-show="detailInfo.site_top10.length>0">
                <div class="label">常驻场所Top</div>
                <div class="child" style="cursor:pointer;" @click="posPointer(v)" v-for="v in detailInfo.site_top10">{{v.netbar_name}} <span style="float:right;">{{v.count}}次</span></div>
                <!--<div class="child">常青藤网咖 <span style="float:right;">5所</span></div>
                <div class="child">清河时尚网咖网咖 <span style="float:right;">1所</span></div>-->
              </div>

              <div class="item" v-show="(serachInfo.code=='imsi' || serachInfo.code=='mac') && detailInfo.range_top10.length>0">
                <div class="label">主要活动范围</div>
                <div class="child childClick" v-for="(r,i) in detailInfo.range_top10" @click="showHeatMap(r,i)">范围{{i+1}} <span style="float:right;"><i class="fa fa-map-marker"></i></span></div>
                <!--<div class="child">范围二 <span style="float:right;"><i class="fa fa-bell-o"></i></span></div>
                <div class="child">范围三 <span style="float:right;"><i class="fa fa-bell-o"></i></span></div>-->
              </div>

              <div class="item" v-show="serachInfo.code=='certificate_code' || serachInfo.code=='mobile'" style="display:none;">
                <div class="label">每天活动时段Top</div>
                <div class="child" :title="`09:00-11:30时段出现频率52%`">
                  09:00-11:30
                  <span class="right">52%</span> 
                  <div class="right process">
                    <div class="child" style="width:20%;"></div>
                  </div>
                </div>
                <div class="child" :title="`11:00-11:30时段出现频率62%`">
                  11:00-11:30
                  <span class="right">62%</span> 
                  <div class="right process">
                    <div class="child" style="width:30%;"></div>
                  </div>
                </div>
                <div class="child" :title="`14:00-11:30时段出现频率12%`">
                  14:00-11:30
                  <span class="right">12%</span> 
                  <div class="right process">
                    <div class="child" style="width:10%;"></div>
                  </div>
                </div>
              </div>

            </Scroll>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import PointPlayer from 'components/PointPlayer'
import Scroll from 'components/scroll'
import SearchDropdown from 'components/SearchDropdown'
import PlaceSearch from '../components/PlaceSearch'
import BaiduHelper from '../helper/BaiduHelper'
import HeatMap from './Home.HeatMap.js'
import ScaleBar from 'components/scaleBar'
import {BODY_RESIZE,AnalyTraceTask,AnalyTraceHistory,DelTraceHistory,GetAnalyTraceTask,MapDataRange} from '../store/mutation-types'

export default {
  name: 'Track',
  components:{PointPlayer,Scroll,SearchDropdown,PlaceSearch,ScaleBar},
  props:['searchVal','defTimeRange'],
  data () {
    return {
      id:'Track_map'+tool.guid(),
      rangeMapId:'Range_map'+tool.guid(),
      map:null,
      blnShowLoading:0,//0:不显示,1:正在分析中,2:分析完成显示结果
      blnShowHistory:false,//是否显示历史记录信息
      blnShowDetail:false,//是否显示轨迹详细信息
      blnShowHistoryPop:false,//是否显示左边历史记录信息
      historyPopIndex:-1,//当前选中历史记录索引
      blnRangeMapShow:false,//是否显示范围地图信息
      descW:0,
      detailW:0,
      blnSearch:false,
      searchNum:'',
      searchResult:[],
      mapLevel:ser.map,
      serachInfo:{color:'gray',val:'',code:''},
      timeRange:[],//时间范围
      region:'',//区域多个用逗号分隔
      traceData:[],
      cTraceData:[],
      mainPath:[],
      range:[],
      unAddData:[],
      addData:[],
      endTime:'',
      historyTrace:[],
      socket:null,
      detailInfo:null,
      curLookTask:{},//当前正在查看任务对象
      pm:'',//热力图对象
      rangeMap:null,//范围地图对象
      posPointers:[],
      chineseNum:['零','一','二','三','四','五','六','日']
    }
  },
  watch:{
    searchNum(){
      this.searchResult=[];
      let res = this.vaildInupt(this.searchNum);
      if(res.length==0){
        this.serachInfo={color:'gray',val:'',code:''}
      }

      if(res.length==1){
        this.serachInfo={color:'green',val:res[0].name,code:res[0].val}
      }

      this.searchResult=_.map(res,r=>{
        return {name:this.searchNum,type:r.name,code:r.val}
      });
    },
    blnShowHistory(){
      if(!this.blnShowHistory) return;
      this.initData();
      this.$nextTick(()=>{
        this.$refs.historySrcoll.reloadyScroll();
      });
    },
    blnShowLoading(){
      setTimeout(()=>{
        let w= $(this.$el).find('.left_container').width();
        this.descW=w-1100 -5;
        this.detailW=w - 800 - 5;
      },0);

    },
    blnShowDetail(){
      this.$nextTick(()=>{
        this.$refs.detailSrcoll.reloadyScroll();
      }); 
    },
    blnShowHistoryPop(){
      this.$nextTick(()=>{
        this.$refs.mapPlayer.refresh();
        this.$refs.historyPopScroll.reloadyScroll();
      });
      setTimeout(()=>{
        let w= $(this.$el).find('.left_container').width();
        this.descW=w-1100 -5;
        this.detailW=w - 800 - 5;
      },0);
    },
    blnRangeMapShow(){
      if(!this.blnRangeMapShow){ this.pm=null;this.rangeMap=null; return;}
      //初始化范围地图
      this.$nextTick(()=>{
        this.initRangeMap();
      });
      
    },
    detailInfo(){
      if(this.detailInfo){
        setTimeout(()=>{
          this.$refs.detailScroll.reloadyScroll();
        },100);
      }
    }
  },
  mounted(){
    setTimeout(()=>{
        let w= $(this.$el).find('.left_container').width();
        this.descW=w-1100 -5;
        this.detailW=w - 800 - 5;
    },0);
    this.$store.commit(BODY_RESIZE,()=>{
        setTimeout(()=>{
            let w= $(this.$el).find('.left_container').width();
            this.descW=w-1100 -5;
            this.detailW=w - 800 - 5;
        },100);
    });

    this.initMap();
    this.initData();

    if(this.searchVal){this.searchNum=this.searchVal;}

    //监听任务分析结果
    this.socket = io(ser.url);
    this.socket.on('AnalyTraceTask', (data)=> {
      let d=eval('('+data+')');
      if(d.task_status!='completed') return;

      if(this.curLookTask.task_id!=d.task_id) return;
      
      this.$store.dispatch(GetAnalyTraceTask,d.task_id).then(res=>{
        if(res.biz_body.length<=0) return;
        this.blnShowLoading=2;
        this.detailInfo=res.biz_body[0];
      });
      
    });

    if(this.timeRange){this.timeRange=this.defTimeRange;}
 
  },
  destroyed(){
    if(!this.socket) return;
    this.socket.close();
  },
  methods:{
    //初始化地图
    initMap(){
      this.map = new BMap.Map(this.id,{minZoom:this.mapLevel[0],maxZoom:this.mapLevel[1]});
      let centerPoint=tool.cookie.get('centerPoint').split(',') || [];
      this.map.centerAndZoom(new BMap.Point(centerPoint[0] || 0,centerPoint[1] || 0),this.mapLevel[2]);
      this.map.enableScrollWheelZoom(true);

      //添加地图层级改变事件
      this.map.addEventListener('zoomend',(e)=>{
          var zoom=this.map.getZoom();
          this.$refs.scaleBar.setVal(zoom);
      });
    },
    //初始化范围地图
    initRangeMap(){
      this.rangeMap = new BMap.Map(this.rangeMapId,{minZoom:this.mapLevel[0],maxZoom:this.mapLevel[1]});
      let centerPoint=tool.cookie.get('centerPoint').split(',') || [];
      this.rangeMap.centerAndZoom(new BMap.Point(centerPoint[0] || 0,centerPoint[1] || 0),this.mapLevel[2]);
      this.rangeMap.enableScrollWheelZoom(true);
      this.pm=new HeatMap(this.rangeMap,{});

    },
    //初始化数据
    initData(){
      this.$store.dispatch(AnalyTraceHistory).then(res=>{
        this.historyTrace=res.biz_body;
        this.blnShowHistoryPop=this.historyTrace.length>0;
      });
    },
    //搜索事件
    search(){
      if(this.blnSearch){return;}
      if(!this.serachInfo.code){tool.info('请输入正确的关键字搜索条件!');return;}
      if(this.timeRange.length<=0){tool.info('请选择时间范围!');return;}
      //if(!this.region){tool.info('请选择区域!');return;}

      this.analyTraceData();
    },
    //根据多个点指定最佳地图显示位置
    setZoom(points){  
      var maxLng = points[0].lng;  
      var minLng = points[0].lng;  
      var maxLat = points[0].lat;  
      var minLat = points[0].lat;  
      var res;  
      for (var i = points.length - 1; i >= 0; i--) {  
          res = points[i];  
          if(res.lng > maxLng) maxLng =res.lng;  
          if(res.lng < minLng) minLng =res.lng;  
          if(res.lat > maxLat) maxLat =res.lat;  
          if(res.lat < minLat) minLat =res.lat;  
      };  
      var cenLng =(parseFloat(maxLng)+parseFloat(minLng))/2;  
      var cenLat = (parseFloat(maxLat)+parseFloat(minLat))/2;  
      var zoom = this.getZoom(maxLng, minLng, maxLat, minLat);  

      this.map.centerAndZoom(new BMap.Point(cenLng,cenLat), zoom);    
 
    }, 
    getZoom(maxLng, minLng, maxLat, minLat) {  
        var zoom = ["50","100","200","500","1000","2000","5000","10000","20000","25000","50000","100000","200000","500000","1000000","2000000"]//级别18到3。  
        var pointA = new BMap.Point(maxLng,maxLat);  // 创建点坐标A  
        var pointB = new BMap.Point(minLng,minLat);  // 创建点坐标B  
        var distance = this.map.getDistance(pointA,pointB).toFixed(1);  //获取两点距离,保留小数点后两位  
        for (var i = 0,zoomLen = zoom.length; i < zoomLen; i++) {  
            if(zoom[i] - distance > 0){  
                return 18-i+3;//之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3。  
            }  
        };  
    },
    //定位点
    posPointer(d){
     this.posPointers.push(this.drawPoint(this.map,0,d,true,{},d.netbar_name));
    },
    //获取轨迹分析数据
    analyTraceData(){
      this.blnSearch=true;
      this.$store.dispatch(AnalyTraceTask,{
        trace_key:this.searchNum,
        key_type:this.serachInfo.code,
        start_time:tool.Timestamp(this.timeRange[0]),
        end_time:tool.Timestamp(this.timeRange[1]),
        locus_ids:this.region
      }).then(res=>{
        this.blnSearch=false;
        if(res.biz_body.length<=0){tool.info('暂无数据!'); return;}

        this.blnShowLoading=1;
        //清除上一个绘画数据
        this.map.clearOverlays();
        this.addData=[];
        this.mainPath=[];

        this.curLookTask={task_id:res.biz_body.task_id};
        this.traceData=tool.Clone(res.biz_body.data);
        this.cTraceData=tool.Clone(res.biz_body.data);
        this.unAddData=res.biz_body.data;
      

        this.range=[
          res.biz_body.data[0].start_time,
          res.biz_body.data[res.biz_body.data.length-1].start_time
        ];

        this.endTime=parseInt(this.range[0]);
      });
    },
    //查看置顶任务
    lookTask(t){
      if(!parseInt(t.result)){tool.info('没有相关结果!'); return;}
      this.curLookTask={task_id:t.task_id};
      this.timeRange=[tool.DateByTimestamp(t.start_time,'yyyy-MM-dd hh:mm:ss'),tool.DateByTimestamp(t.end_time,'yyyy-MM-dd hh:mm:ss')];
      this.region=t.locus_ids;
      this.searchNum=t.trace_key;

      this.$refs.mapPlayer.goStart();
      this.$nextTick(()=>{
        this.search();
      });
    },
    //删除历史轨迹任务
    removeTask(id,i){
      tool.confirm('您确定要删除该任务吗?',['确定','取消'],()=>{
          this.$store.dispatch(DelTraceHistory,id).then(res=>{
            if(!tool.msg(res,'删除成功!','删除失败!')) return;

            this.historyTrace.splice(i,1);
          }); 
      },function(){});
    },
    //显示范围热力图信息
    showHeatMap(d,i){
      let s=this;
      this.blnRangeMapShow=true;

      setTimeout(()=>{
        let map=this.rangeMap,pm=this.pm;
        map.clearOverlays();

        //获取数据
        s.$store.dispatch(MapDataRange,{id:s.curLookTask.task_id,index:i}).then(res=>{
          if(res.biz_body.length<=0){ tool.info('暂无数据!'); return;}
          let d = res.biz_body[0];

          map.panTo(new BMap.Point(d.longitude,d.latitude));

          let data ={};
          _.each(res.biz_body,r=>{
            data[r.longitude+'_'+r.latitude]={length:r.count};
          });

          pm.draw(data);
        });
      },200);

      //弹窗显示
      // let id='pop_map'+tool.guid(),s=this;
      // tool.open(function(){
      //     let html=`<div id=${id} style="width:100%;height:100%;">热力图</div>`;
      //     let param={
      //         title:'范围热力图',
      //         area:['600px','400px'],
      //         content:`<div style="width:100%;height:100%;overflow-y:auto;">${html}</div>`,
      //         context:{

      //         },
      //         success(layero){
      //           //初始化地图
      //           let map = new BMap.Map(layero.find('#'+id)[0],{minZoom:13,maxZoom:18});
      //           map.centerAndZoom(new BMap.Point(113.841106,36.081306),13);
      //           map.enableScrollWheelZoom(true);
      //           let pm=new HeatMap(map,{});

      //           //获取数据
      //           s.$store.dispatch(MapDataRange,{id:s.curLookTask.task_id,index:i}).then(res=>{

      //             let d = res.biz_body[0];

      //             map.panTo(new BMap.Point(d.longitude,d.latitude));

      //             let data ={};
      //             _.each(res.biz_body,r=>{
      //               data[r.longitude+'_'+r.latitude]={length:parseInt(2)};
      //             });

      //             pm.draw(data);
      //           });
      //         }
      //     };
          
      //     return param;
      // }());
    },
    //描点(单个点)
    drawPoint(map,index,d,blnPanTo,pointOps,extraInfo){
      pointOps=pointOps || {};
      pointOps.size=pointOps.size || 30;
      pointOps.color=pointOps.color || 'red'

      let point=new BMap.Point(d.longitude || d.equipment_longitude, d.latitude || d.equipment_latitude);
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
    //描两点之间的线段
    drawLine(map,points,color){
      color=color || 'red';

      let polyline = new BMap.Polyline(points, {strokeColor:color || "#555555", strokeWeight:2, strokeOpacity:1,strokeStyle:'dashed'});   //创建折线
      map.addOverlay(polyline); //增加折线

      return polyline;
    },
    //描两点之间的三角箭头
    drawArrow(polyline,length,angleValue,distance,strokeColor,width){
     return []; //BaiduHelper.arrows(this.map,polyline,length,angleValue,distance,strokeColor,width);
    },
    //操作MAC路径显示
    macPath(map,res,mainPath,sOps,dOps,pOps,blnEnd){
      let startPointOps=sOps || {size:30,color:'green'},//路径起点样式
          drawPointOps=dOps || {size:30,color:'red'}, //画过后的点样式
          pointOps=pOps || {size:30,color:'blue'}; //正在画的点样式
      
      map=map || this.map;

      switch(res.flag){
        case 'Add':
          _.each(res.data,(d,i)=>{

            if(mainPath.length<=1){
              //map.panTo(new BMap.Point(d.longitude || d.equipment_longitude, d.latitude || d.equipment_latitude));
              let points=_.map(this.cTraceData,d=>{
                return new BMap.Point(d.longitude || d.equipment_longitude, d.latitude || d.equipment_latitude);
              });
              // map.setViewport(points);
              this.setZoom(points);
            }

            let lastPoint=mainPath.length<=0?
              this.drawPoint(map,mainPath.length,d,false,startPointOps,'起点') :
              this.drawPoint(map,mainPath.length,d,false,pointOps,blnEnd?'终点':'');
      

            //从第二个点开始画线
            if(mainPath.length>0){
              let firstPoint=new BMap.Point(mainPath[0].point.lng,mainPath[0].point.lat);
              let secondPoint=new BMap.Point(lastPoint.point.lng,lastPoint.point.lat);

              lastPoint._relLine=this.drawLine(map,[firstPoint,secondPoint],pointOps.color);
              lastPoint._relLine._arrows=this.drawArrow(lastPoint._relLine,10,Math.PI/7,drawPointOps.size/2,startPointOps.color,4);
              _.each(lastPoint._relLine._arrows,a=>{
                map.addOverlay(a);
              });

              if(mainPath.length>1){
                mainPath[0].setOffset(new BMap.Size(-drawPointOps.size/2,-drawPointOps.size));
                //mainPath[0].setContent(`<div style="background-color:${drawPointOps.color};width:${drawPointOps.size}px;height:${drawPointOps.size}px;line-height:${drawPointOps.size}px;text-align:center;border-radius:50%;color:white;"></div>`);
                mainPath[0].setContent(`<div style="background:url(static/map_${drawPointOps.color}.png);background-size: contain;width:${drawPointOps.size}px;height:${drawPointOps.size}px;line-height:${drawPointOps.size}px;text-align:center;color:white;"> </div>`);
                mainPath[0]._relLine.setStrokeColor(drawPointOps.color);
              }

            }


            mainPath.unshift(lastPoint);
            
          });
          break;
        case 'Del':
          _.each(res.data,(d)=>{
            let point=mainPath.shift();
            map.removeOverlay(point);
            if(point._relLine){
              map.removeOverlay(point._relLine);
              
              _.each(point._relLine._arrows || [],a=>{
                  map.removeOverlay(a);
              });
            }
          });

          break;
      }
     
    },
    //数据点播放器数据个数改变事件
    countChange(count){
      let res = this.getCountData(count,this.addData,this.unAddData,this.cTraceData);

      //清除定位点信息
      _.each(this.posPointers,(l)=>this.map.removeOverlay(l));
      this.posPointers=[];
 
      this.macPath(this.map,res,this.mainPath,null,null,null,this.cTraceData.length==count);
    },
    //播放器时间改变事件
    timeChange(start,end){
      end=parseInt(end);

      //清除定位点信息
      _.each(this.posPointers,(l)=>this.map.removeOverlay(l));
      this.posPointers=[];

      let res = this.getOptData(end,this.addData,this.unAddData,this.endTime,this.range);
      this.macPath(this.map,res,this.mainPath,null,null,null,parseInt(this.range[1])==end);
      
      
      this.endTime=end;

    },
    //获取点添加的数据或者删除的数据
    getCountData(count,addData,unAddData,mainMac){
      let data=[],s=this;
      let addCount=addData.length;
      if(count==0){//清除所有删除点

        data=tool.Clone(addData);
        for(let i=0;i<addData.length;i++){
          unAddData.unshift(addData[i]);
        }

        addData.splice(0,addData.length);
        return {flag:'Del',data};

      }else if(count==mainMac.length){//添加所有点

        data=tool.Clone(unAddData);
        
        for(let i=0;i<unAddData.length;i++){
          addData.unshift(unAddData[i]);
        }

        unAddData.splice(0,unAddData.length);
        return {flag:'Add',data};

      }else if(count>addCount){//增加点

        let ac=count-addCount;
        for(let i=0;i<ac;i++){
          if(!unAddData[i])break;
          data.push(unAddData[i]);
          addData.unshift(unAddData[i]);
        }

        unAddData.splice(0,ac);

        return {flag:'Add',data};

      }else if(count<addCount){//删除点

        let dc=addCount-count;
        for(let i=0;i<dc;i++){
          if(!addData[i])break;
          data.push(addData[i]);
          unAddData.unshift(addData[i]);
        }

        addData.splice(0,dc);

        return {flag:'Del',data};
      }

      return {flag:''};
    },
    //根据结束时间得到添加的数据或者删除的数据
    getOptData(end,addData,unAddData,endTime,range){
      let data = [],s=this;
      if(end>endTime){//添加点

        let removeIndex=0;

        for(let i=0;i<unAddData.length;i++){
          let time =parseInt(unAddData[i].start_time || unAddData[i].primary.log_time);
          if(time>end){break;}
          data.push(unAddData[i]);
          addData.unshift(unAddData[i]);
          removeIndex++;
        }

        unAddData.splice(0,removeIndex);
        

        return {flag:'Add',data};
      }
      else if(end==parseInt(range[1])){//等于结束点
        data=tool.Clone(unAddData);
        
        for(let i=0;i<unAddData.length;i++){
          addData.unshift(unAddData[i]);
        }

        unAddData.splice(0,unAddData.length);
        return {flag:'Add',data};
      }
      else if(end==parseInt(range[0])){//等于起始点删除全部添加点
        data=tool.Clone(addData);
        for(let i=0;i<addData.length;i++){
          unAddData.unshift(addData[i]);
        }

        addData.splice(0,addData.length);
        return {flag:'Del',data};
      }
      else{//删除点
        let removeIndex=0;
        //获取删除点内容
        for(let i=0;i<addData.length;i++){
            let time =parseInt(addData[i].start_time || addData[i].primary.log_time);
            if(time<end){removeIndex=i;break;}
            data.push(addData[i]);
            unAddData.unshift(addData[i]);
            removeIndex++
        }

        addData.splice(0,removeIndex);


        return {flag:'Del',data};
      }
    },
    //验证用户输入内容的类型
    vaildInupt(v){
      let res=[];
      //判断输入内容是为纯数字
      let numReg=/^[0-9]*$/;
      let hanziReg = /[\u4E00-\u9FA5]/g; //中文
      let macReg=/([0-9A-Fa-f]{2}-){5}[0-9A-Fa-f]{2}/g;//MAC验证
      let certificateReg=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;//身份证验证
      let phoneReg=/^[1][3,4,5,7,8][0-9]{9}$/;//验证手机号
      let imsiReg=/^4600[0,1,2,3,5,6,7]\d{10}$/g;//验证IMSI
      
      if(hanziReg.test(v)){return res;}
      if(macReg.test(v)){res.push({name:'MAC',val:'mac'})}
      if(certificateReg.test(v)){res.push({name:'身份证',val:'certificate_code'})}
      if(phoneReg.test(v)){res.push({name:'手机号',val:'mobile'})}
      if(imsiReg.test(v)){res.push({name:'IMSI',val:'imsi'})}

      return res;
    },
    //场所选择改变事件
    placechange(c,v){
      if(!v){this.region=''}
      this.region=_.map(v.regions,r=>r.code).join(',');
    },
    //关键字选项单击事件
    dropdownItemClick(v){
      this.serachInfo={color:'green',val:v.name,code:v.val};
    },
    //时间戳转日期
    converTime(t,format){
      return tool.DateByTimestamp(t,format || 'yyyy-MM-dd hh:mm:ss');
    },
    //获取不同类型数据关键字数据
    keyword(d){
      let res='';
      switch(this.serachInfo.code){
        case 'mac':
          res=d.mac;
          break;
        case 'imsi':
          res=d.imsi;
          break;
        case 'mobile':
        case 'certificate_code':
          res=d.certificate_code;
          break;
      }

      return res;
    },
    zoomChange(zoom){
      if(!this.map)return;
      this.map.setZoom(zoom);
    }
  }
}
</script>

<style scoped lang="less">
  @import "../css/variables.less";
  .Track{width:100%;height:100%;}
  .Track .map{width:100%;height:100%;}

  .Track .scaleContainer{
    position:absolute;top:90px;left:0px;z-index: 1000;
  }

  @rightW:300px;
  .Track .left_container{
    position:absolute;left:0px;top:0px;right:@rightW;
    padding:10px;
  }
  .Track .right_container{
    position:absolute;right:0px;top:0px;bottom:0px;width:@rightW;height:100%;
    padding:10px;
  }

  .Track .left_container .taginfo{overflow:hidden;}
  .Track .left_container .taginfo .item{
    float:left;padding:5px 10px;border-radius:5px;color:white;background-color:@HeaderBgCol;
    font-size:12px;margin-right:10px;
  }

  .Track .left_container .taginfo .item:hover{cursor:pointer;}
  html{.TCol(~".Track .left_container .taginfo .item:hover",'bg');}

  .Track .left_container .option{
    background-color:rgba(47, 51, 65, 0.3);padding:10px;border-radius:5px;margin-top:5px;
    width:100%;text-align:left;
  }

  .Track .bottom_info{
    position:absolute;bottom:0px;left:0px;right:@rightW;
  }

  @detailBtnSize:60px;
  .Track  .bottom_info{padding:10px;}
  .Track  .bottom_info .player{
    position:absolute;left:0px;right:@detailBtnSize + 30px;padding-left: 10px;
  }
  .Track  .bottom_info .detailbtn{
    width:@detailBtnSize;height:@detailBtnSize;
    color:white;border-radius:5px;padding-top:10px;float:right;cursor:pointer;
  }
  html{.TCol(~".Track  .bottom_info .detailbtn",'bg');}

  @Distance:5px;
  @bgColor:fade(@HeaderBgCol,90%);
  .Track .right_container{padding-top:14px;padding-bottom:10px;}
  .Track .right_container .content{
    width:100%;height:100%;background-color:@bgColor;border-radius:@Distance;
  }

  .Track .right_container .content.showLoading{height:auto;}

  @InfoTitleH:40px;
  .Track .right_container .title{
    height:@InfoTitleH;line-height:@InfoTitleH;color:white;width:100%;border-top-left-radius:@Distance;border-top-right-radius:@Distance;
    padding:0px 10px;text-align:left;overflow:hidden;
  }
  html{.TCol(~".Track .right_container .title",'bg');}

  .Track .right_container .tipInfo{color:white;font-size:20px;padding:20px;}
  .Track .right_container .info{padding:10px 0px;width:100%;height:~'calc(100% - @{InfoTitleH})';}

  .Track .right_container .info .item{font-size:12px;color:white;text-align:left;padding-bottom:40px;padding-left:10px;padding-right:10px;}
  .Track .right_container .info .item .label{font-size:14px;font-weight:400;font-size:13px;}
  .Track .right_container .info .item .sub{padding:10px 10px;}
  .Track .right_container .info .item .child{padding:0px 10px;}

  .Track .right_container .info .item .child .right{float:right;width:30px;}
  .Track .right_container .info .item .child .process{width:120px;height:8px;background-color:#808080;margin-top:5px;margin-right:10px;}
  .Track .right_container .info .item .child .process .child{background-color:#85c226;height:100%;float:right;padding:0px;}

  .Track .right_container .info .item .childClick:hover{cursor:pointer;}
  html{.TColIm(~".Track .right_container .info .item .childClick:hover",'bg');}

  .Track .historyList{
    position:absolute;top:14px;right:@rightW;left:10px;bottom:10px;
  }

  .Track .dropdownItem{line-height:30px;cursor:pointer;}
  //.Track .dropdownItem:hover{color:@Font_Hover_Col;}
  html{.TCol(~".Track .dropdownItem:hover");}

  //.Track .active{background-color:@Font_Hover_Col !important;}
  html{.TColIm(~".Track .item.active",'bg');}

  .Track .fa-eye:hover,
  .Track .fa-remove:hover{cursor:pointer;}
  html{.TCol(~".Track .fa-remove:hover");}
  html{.TCol(~".Track .fa-eye:hover");}

  .Track .optionBar i{margin-right:10px;}

  .Track .historyList .delBtn{
    position:absolute;right:-10px;top:-10px;width:20px;height:20px;border-radius:50%;color:white;cursor:pointer;z-index:100;
  }
  html{.TCol(~".Track .historyList .delBtn",'bg');}


  //.Track .historyList .delBtn .fa-remove:hover{color:white;}
  html{.TCol(~".Track .historyList .delBtn .fa-remove:hover");}

  .Track .historyList.border_black{
    border:5px solid @bgColor;border-radius:5px;
  }

  //左边侧边框
  @popW:300px;
  .Track .left_pop{
    position:absolute;left:-@popW;top:14px;bottom:10px;z-index:100;width:@popW;background-color:@bgColor !important;
    border-top-right-radius:5px;border-bottom-right-radius:5px;color:white;text-align:left;
  }

  .Track .left_pop.active{left:0px;}

  .Track .left_pop .pop_lable{
    width:30px;position:absolute;top:50%;margin-top:-40px;
    background-color:@bgColor;color:white;
    font-size:12px;padding:10px 8px;border-top-right-radius:5px;border-bottom-right-radius:5px;
    right:-30px;
    cursor:pointer;.trans();
  }

  //.Track .left_pop .pop_lable:hover{background-color:@Font_Hover_Col;}
  html{.TCol(~".Track .left_pop .pop_lable:hover",'bg');}

  .Track .left_pop .item{font-size:12px;padding:10px;.trans();.border('bottom');}
  .Track .left_pop .item:hover{cursor:pointer;}
  html{.TCol(~".Track .left_pop .item:hover","bg");}

  .Track .left_pop .item .child{margin-bottom:10px;}
  .Track .left_pop .item .item_type{
    padding:2px 8px;position:relative;display:inline-block;
  }

  .Track .left_pop .item i:hover{cursor:pointer;color:#20a1ff;}

  .Track .left_pop .item.active .bottom_right:before,
  .Track .left_pop .item.active .bottom_right:after,
  .Track .left_pop .item.active .top_left:after,
  .Track .left_pop .item.active .top_left:before,
  .Track .left_pop .item:hover .bottom_right:before,
  .Track .left_pop .item:hover .bottom_right:after,
  .Track .left_pop .item:hover .top_left:after,
  .Track .left_pop .item:hover .top_left:before{background:@bgColor;}

  @RBH:0px;
  @LeftW:0px;
  @Distance:0px;
  @AngleSize:10px;
  @lineW:3px;
  .Track .top_left{top:@Distance;left:@Distance*2 + @LeftW;position:absolute;width:@AngleSize;height:@AngleSize;overflow:hidden;}
  .Track .top_left:before{
    content:'';position:absolute;left:0px;
    width:100%;height:@lineW;
  }
  html{.TColFade(~".Track .top_left:before",90%,'bg');}
  
  .Track .top_left:after{
    content:'';position:absolute;left:0px;
    height:100%;width:@lineW;
  }
  
  html{.TColFade(~".Track .top_left:after",90%,'bg');}

  .Track .bottom_right{bottom:@Distance*2 + @RBH;right:@Distance*2 + @LeftW;position:absolute;width:@AngleSize;height:@AngleSize;overflow:hidden;}
  .Track .bottom_right:before{
    content:'';position:absolute;right:0px;bottom:0px;
    width:100%;height:@lineW;
  }

  html{.TColFade(~".Track .bottom_right:before",90%,'bg');}

  .Track .bottom_right:after{
    content:'';position:absolute;right:0px;bottom:0px;
    height:100%;width:@lineW;
  }

  html{.TColFade(~".Track .bottom_right:after",90%,'bg');}

//列表样式
@tableRowH:40px;
.table{margin-bottom:0px;color: white;}
.table_header{height:@tableRowH;.border('bottom');border-top-right-radius:5px;border-top-left-radius:5px;}
.table_header tr{height:~'calc(@{tableRowH} - 1px)';}
.table_header th{padding-left:0px;padding-right:0px;}
.table_header{color:white;}
html{.TCol(~".table_header",'bg');}

.table_body{height:~'calc(100% - @{tableRowH})';width:100%;background-color:@bgColor;border-bottom-right-radius:5px;border-bottom-left-radius:5px;}
.table_body td{padding-left:0px;padding-right:0px;}
</style>
