<!-- 地图描点组件 -->
<template>
    <div class="MapDot">
        <div class="MapDot_container" :id="id">
            <!--地图描点-->
        </div>
        <!--日期搜索框-->
        <div v-if="blnPath" class="dateSearch">
            <el-date-picker
                v-model="dateRange"
                type="daterange"
                :picker-options="beforeToday"
                placeholder="选择日期范围">
            </el-date-picker>
            <el-button type="primary" @click="query_click()"><i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i><span v-show="!blnSearch">搜索</span></el-button>
        </div>
        <!--仿百度伸缩比例组建-->
        <div class="scaleBar_container">
            <ScaleBar :start="13" :end="18" @change="zoomChange" ref="scaleBar" />
        </div>

        <!--图标解释框-->
        <div class="icon_conatainer">
            <span style="margin-right:10px;" v-for="(p,i) in showIcon"><img  :src="p" style="width:20px;" />{{i}}</span>
        </div>

        <!--加载中-->
        <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index: 100;">
          <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
        </div>
    </div>
</template>

<script>
import {Get_OPerate_Data,Get_Place_Count} from '../store/mutation-types'
import {tempType} from '../enum/TempType'
import tmpDAO from '../js/dao/tmpDao.js'
import ScaleBar from 'components/scaleBar'
import * as d3 from 'd3'
import {scaleLinear,scaleSequential} from "d3-scale"
import BaiduHelper from '../helper/BaiduHelper';
export default {
  name: 'MapDot',
  props:['data','blnPath','store','blnInit','blnPreview'],
  components:{ScaleBar},
  data () {
    return {
     beforeToday:{//限制只能选择今天之前的日期
        disabledDate(time) {
            return time.getTime() > Date.now();
        }
     },
     id:'',
     blnLoading:false,
     hasInit:false,
     dateRange:[],
     blnSearch:false, //是否正在进行搜索功能
     map:null,
     markers:[], //遮罩
     cacheData:{},//缓存对象
     polyline:null,//折线
     dateLabel:[],//日期标签集合
     labels:[],//场所统计信息标签集合
     clus:null,//点聚合对象
     cachePlace:{},//缓存场所数据
     cacheData:{},//缓存场所经纬度数据
     colorScale:function(val){
         let scale= scaleSequential(d3.interpolateCool);
         let num=scaleLinear().domain([0,5000]).range([0,1]);
        return scale(num(val));
     },//scaleLinear().domain([0,5000]).range(['#ffbf00','#008cff']),
     photo:{
        '网吧在线':'static/images/site_online.png',
        '网吧离线':'static/images/site_unline.png',
        '非经在线':'static/images/hotal_online.png',
        '非经离线':'static/images/hotal_unline.png',
        '无线采集在线':'static/images/wifi_online.png',
        '无线采集离线':'static/images/wifi_unline.png'
    },
    showIcon:{
        '网吧':'static/images/site_online.png',
        '宾馆酒店':'static/images/hotal_online.png',
        '无线采集':'static/images/wifi_online.png',
    },
    arrows:[],
    }
  },
  mounted(){
    this.id='MapDot'+tool.guid();
    this.$store=this.$store || this.store;
    if(this.blnInit){
        setTimeout(()=>{
             this.init();
        },100)
       
    }
  },
  methods:{
      //重新刷新地图
      refreshMap(){
          this.map.reset();
      },
      panCenter(num){
        this.map.panBy(num);
      },
      //刷新页面
      refreshPage(){
          this.query_click();//重新查询页面数据
      },
      //页面层级改变事件
      zoomChange(zoom){
          if(!this.map)return;
          this.map.setZoom(zoom);
      },
      //通过日期范围搜索数据
      query_click(){
        _.each(this.markers,m=>this.map.removeOverlay(m.marker));
        this.markers=[];
        _.each(this.dateLabel,m=>this.map.removeOverlay(m));
        this.dateLabel=[];
        this.cacheData={};
        !this.polyline || this.map.removeOverlay(this.polyline);
        if(this.blnPreview) return;
        this.SetMark();
      },
      //构造连线箭头对象
      genArrow(polyline,length,angleValue,distance){
        if(this.arrows.length>0){
            _.each(this.arrows,a=>this.map.removeOverlay(a));
            this.arrows=[];
        }

        let arrows = BaiduHelper.arrows(this.map,polyline,length,angleValue,distance);
        _.each(arrows,a=>{
            this.map.addOverlay(a);
            this.arrows.push(a);
        });
      },
      //设置路径遮罩物
      SetMark(){
        let store=this.$store || this.store,
            data=tool.Clone(this.data || {keyid:'',condtion:''}),
            s=this,
            primaryKey=data.primaryKey.split('|'),
            tmpParam=(data.tmpParam && (data.tmpParam[tempType['地图路径'].id] || [''])[0]) || '',
            fields=data.orderFields
            startTime=s.dateRange[0]?tool.Timestamp(s.dateRange[0]):'',
            endTime=s.dateRange[1]?tool.Timestamp(s.dateRange[1]):'';
        
        let labels={};
        if(data.condtion){
            data.condtion.limit=3000;//获取场所经纬的情况下需要把分页数设置较大才能更好的接近真实的数据
        }
        s.blnSearch=true;
        let extraParam={},extraConditon=tool.Clone(data.extraConditon || []);

        if(_.keys(data.templateSet)>0){
          //依赖对象
          let relyObject=_.find(data.templateSet,t=>{
           return _.find(t,r=>{
                return r.id+''==tempType['地图路径'].id+'';
            })
          }) || [];
         
          if(relyObject.length>0){
              extraConditon.push({filed:relyObject[0],value:relyObject[0].value});
          }
        }

        // if(extraConditon){
        //     extraParam= tmpDAO.searchParam(extraConditon,data.condtion);
        // }

        //查询条件
        extraParam=tmpDAO.searchParam((data.queryCondition || []).concat(extraConditon || []),data.condtion);

        store.dispatch(Get_OPerate_Data,{keyid:data.keyid,
                                         condtionsObj:data.condtion,
                                         time:tmpParam.time_field,
                                         startTime:startTime,
                                         endTime:endTime,
                                         extraData:extraParam.param,
                                         indexFields:extraParam.sepParam
                                         }).then(function (code) {
            s.blnSearch=false;
            var data = code.biz_body;
            //分组数据

            data=_.chain(data)
                  .groupBy(d=>{ return d.equipment_longitude+''+d.equipment_latitude})
                  .map(d=>{
                    d[0].latitude=d[0].latitude ||  d[0].equipment_latitude;
                    d[0].longitude=d[0].longitude ||  d[0].equipment_longitude;
                    d[0]._dateArr=_.chain(d)
                                   .map(t=>t[tmpParam.time_field] || t[primaryKey[0]+'_'+tmpParam.time_field])
                                   .sortBy(t=>t)
                                   .map(t=>tool.DateByTimestamp(t,'yyyy-MM-dd hh:mm:ss')).value();
                    return d[0];
                  }).value();

            s.map.setZoom(18);
            s.map.setCenter(new BMap.Point(data[0].longitude, data[0].latitude));

            var tempPos = [];
            var pointOps={color:'red',size:30};

            for (var i = 0; i < data.length; i++) {

                s.cacheData[parseFloat(data[i].longitude)+'-'+parseFloat(data[i].latitude)]=data[i];

                let point =new BMap.Point(data[i].longitude, data[i].latitude);

                var marker= new BMap.Label(`<div style="background-color:${pointOps.color};width:${pointOps.size}px;height:${pointOps.size}px;line-height:${pointOps.size}px;text-align:center;border-radius:50%;color:white;">
                                    ${i+1}
                                  </div>`,{position:point,offset:new BMap.Size(-pointOps.size/2,-pointOps.size/2)});
                marker.setStyle({
                    fontSize : "12px",
                    lineHeight : "20px",
                    fontFamily:"微软雅黑",
                    fontWeight:'600',
                    border:'0px solid black',
                    'background-color':'transparent',
                    'max-width':'none'
                });

                tempPos.push(point);
                //添加数遍移上/移下事件(添加描述遮罩)
                var marker_triangle_html='<div class="triangle pulse" style="background-color:rgb(0, 204, 102);color: white;padding: 0px 10px;border-radius: 5px;min-width:140px;padding:5px 10px;">{0}</div>';
                var posSearchHtml=function(data){
                    var result='';
                    var template='<div>{0}&nbsp;&nbsp;:&nbsp;&nbsp;{1}</div>';
                    for(let i=0;i<fields.length;i++){
                        result+=Fx.format(template,fields[i].name,tmpDAO.formatData(fields[i],data[fields[i].alias] || data[fields[i].key] || ''));
                    }

                     result+=Fx.format(template,'停留次数',data._dateArr.length);
                    return result;
                };
                
                marker.addEventListener("mouseover",function(e){
                        var point=e.target.point;
                        $('.BMapLabel').parent('div').css('z-index',1000);

                        if(!s.cacheData[point.lng+'-'+point.lat]){return;}
                        var label= new BMap.Label(Fx.format(marker_triangle_html,posSearchHtml(s.cacheData[point.lng+'-'+point.lat])),{position:point, offset:new BMap.Size(-70, -((fields.length+1)*26))});
                        label.setStyle({
                            fontSize : "12px",
                            lineHeight : "20px",
                            fontFamily:"微软雅黑",
                            fontWeight:'600',
                            border:'0px solid black',
                            'background-color':'transparent',
                            'max-width':'none'
                        });
                        s.map.addOverlay(label);
                        labels[point.lng+'-'+point.lat]=label;
                });
                marker.addEventListener("mouseout",function(e){
                    $('.BMapLabel').parent('div').css('z-index',500);
                    var point=e.target.point;
                    if(!s.cacheData[point.lng+'-'+point.lat]){return;}
                    var label=labels[point.lng+'-'+point.lat];
                    s.map.removeOverlay(label);
                    delete labels[point.lng+'-'+point.lat];
                });

                //标记单击事件
                marker.addEventListener("click",function(e){
                    var point=e.target.point;
                    if(!s.cacheData[point.lng+'-'+point.lat]){return;}
                    let data=s.cacheData[point.lng+'-'+point.lat];
                    if(data._dateArr.length<=1)return;

                    let html=_.map(data._dateArr,(d,i)=>{
                        return `
                                <div class="row border" style="margin-left:0px;margin-right:0px;line-height:30px;font-size:12px; border-bottom:1px solid #ebedee;">
                                    <div class="col-md-3" style="text-align:center;border-right: 1px solid #ebedee;">${i+1}</div>
                                    <div class="col-md-8">${d}</div>
                                </div>
                               `;
                    }).join('');
                    tool.open(function(){
                        let param={
                            title:'详细',
                            area:['250px','400px'],
                            content:`<div class="openPathPop" style="width:100%;height:100%;overflow-y:auto;">${html}</div>`,
                            context:{
                            }
                        };

                        return param;
                    }());

                });

                //添加日期标签
                // var datelabel= new BMap.Label(tool.DateByTimestamp(data[i][tmpParam.time_field] || data[i][primaryKey[0]+'_'+tmpParam.time_field],'yyyy-MM-dd hh:mm:ss'),{position:tempPos[i], offset:new BMap.Size(-70, 0)});
                // datelabel.setStyle({
                //     fontSize : "12px",
                //     lineHeight : "20px",
                //     fontFamily:"微软雅黑",
                //     fontWeight:'400',
                //     color:'#006600',
                //     border:'0px solid #336600',
                //     'background-color':'transparent',
                //     'max-width':'none'
                // });
                // s.map.addOverlay(datelabel);
                // s.dateLabel.push(datelabel);

                //构造场所遮罩
                s.markers.push({
                    marker: marker,
                    siteid: data[i]
                });
                s.map.addOverlay(marker);
            }
            //添加线
           s.polyline = new BMap.Polyline(tempPos, {strokeColor:"#555555", strokeWeight:2, strokeOpacity:1});   //创建折线
           s.map.addOverlay(s.polyline);   //增加折线

           //添加折线箭头
            if(s.blnPath)s.genArrow(s.polyline,14,Math.PI/7,pointOps.size/2);
        })
      },
      init(){
        this.blnPath?this.initPath():this.initDrawPoint();
      },
      //初始化路径
      initPath(){
        if(this.hasInit)return;
        this.map = new BMap.Map(this.id,{minZoom:13,maxZoom:18});
        //this.map.centerAndZoom(new BMap.Point(106.33,29.35),7);//重庆中心点
        let centerPoint=tool.cookie.get('centerPoint').split(',') || [];
        this.map.centerAndZoom(new BMap.Point(centerPoint[0] || 0,centerPoint[1] || 0),13);//安阳中心点
        this.map.enableScrollWheelZoom(true);

        this.hasInit=true;
        //添加地图层级改变事件
        let s=this;
        s.map.addEventListener('zoomend',function(e){
            s.$refs.scaleBar.setVal(s.map.getZoom());
            if(s.blnPath)s.genArrow(s.polyline,14,Math.PI/7,15);
        });
      },
      //初始化描点
      initDrawPoint(){
        let photo=this.photo;
        if(this.hasInit)return;

        let store=this.$store,data=tool.Clone(this.data || {keyid:'',condtion:''}),primaryKey=this.data.primaryKey.split('|'),s=this;
        this.map = map = new BMap.Map(this.id,{minZoom:13,maxZoom:18});
        //map.centerAndZoom(new BMap.Point(106.33,29.35),13);//重庆中心点
        let centerPoint=tool.cookie.get('centerPoint').split(',') || [];
        map.centerAndZoom(new BMap.Point(centerPoint[0] || 0,centerPoint[1] || 0),13);//安阳中心点
  
        map.enableScrollWheelZoom(true);
        
        let markers=[],labels={},blnClose={},popIds={};

        s.clus = new BMapLib.MarkerClusterer(map, {
            markers:[],
            mouseover(d,p){
                blnClose[p.lng+'-'+p.lat]=false;
                if(labels[p.lng+'-'+p.lat]) return;

                let data=_.map(d,v=>{
                    let point = v.point;
                    return s.cacheData[point.lng+'-'+point.lat]
                });

                //设置显示内容框
                if(data.length<0){return;}
                $('.BMapLabel').parent('div').css('z-index',10000);
                let popId=tool.guid();
                popIds[p.lng+'-'+p.lat]=popId;

                var marker_triangle_html=`<div id="${popId}" class="triangle pulse" style="background-color:rgb(0, 204, 102);color: white;border-radius: 5px;min-width:140px;padding:5px 20px;height:150px;overflow-y:auto;">{0}</div>`;
                var posSearchHtml=function(data){
                    var result='';
                    var template='<div>{0}&nbsp;&nbsp;:&nbsp;&nbsp;{1}</div>';
                    result+=Fx.format(template,'全称',data.netbar_name || '');
                    result+=Fx.format(template,'地址',data.netbar_address || '');
                    result+=Fx.format(template,'状态',data.online || '');
                    result+=Fx.format(template,'类型',(data.netbar_type || '').replace('非经','宾馆酒店'));
                    result+=Fx.format(template,'编码',data.netbar_wacode || '');

                    return result+'<div style="height:1px;background-color:white;margin:5px 0px;"></div>';
                };

                var htmls=_.map(data,d=>posSearchHtml(d));
                
                
                var label= new BMap.Label(Fx.format(marker_triangle_html,htmls.join('')),{position:p, offset:new BMap.Size(-70, -180)});
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
                labels[p.lng+'-'+p.lat]=label;

                $('#'+popId).mouseover(()=>{
                    blnClose[p.lng+'-'+p.lat]=false;
                });

                $('#'+popId).mouseout(()=>{
                    blnClose[p.lng+'-'+p.lat]=true;
                    Fx.DelayTrigger(()=>{
                        if(!blnClose[p.lng+'-'+p.lat]) return;
                        $('#'+popId).parent('BMapLabel').css('z-index',500);
                        var label=labels[p.lng+'-'+p.lat];
                        map.removeOverlay(label);
                        delete labels[p.lng+'-'+p.lat];
                        delete popIds[p.lng+'-'+p.lat];
                    },300);
                });
            },
            mouseout(d,point){
                if(!s.cacheData[point.lng+'-'+point.lat]){return;}
                blnClose[point.lng+'-'+point.lat]=true;
                Fx.DelayTrigger(()=>{
                    if(!blnClose[point.lng+'-'+point.lat]) return;
                    $('#'+popIds[point.lng+'-'+point.lat]).parent('BMapLabel').css('z-index',500);
                    var label=labels[point.lng+'-'+point.lat];
                    map.removeOverlay(label);
                    delete labels[point.lng+'-'+point.lat];
                    delete popIds[point.lng+'-'+point.lat]
                },300);
            }
        });
        
    

        if(data.condtion){
            data.condtion.limit=1000000;//获取场所经纬的情况下需要把分页数设置较大才能更好的接近真实的数据
        }
    
        var setMarks = function () {
            var centerPointer = map.getCenter();
            var bounds=map.getBounds();
            var lb=bounds.getSouthWest(),rt=bounds.getNorthEast();
            var zoom=map.getZoom();
            if(zoom<=15){
                if(s.clus){s.clus.clearMarkers();s.cachePlace={};s.cacheData={};}

                store.dispatch(Get_Place_Count).then(res=>{
                    let data=_.filter(res.biz_body,r=>r.latitude);
                    for(let i=0;i<data.length;i++){
                        let item=data[i],point=new BMap.Point(item.longitude, item.latitude);
                        var label= new BMap.Label(`<div class="pulse placeCount" style="background-color:${s.colorScale(item.count)};">
                                                        <div style="padding-top:20px;">${item.name}</div>
                                                        <div>${item.count}</div>
                                                    </div>`,
                            {position:point, offset:new BMap.Size(0, 0)});
                            label.setStyle({
                            fontSize : "12px",
                            lineHeight : "20px",
                            fontFamily:"微软雅黑",
                            fontWeight:'400',
                            border:'0px solid black',
                            'background-color':'transparent',
                            'max-width':'none'
                            });
                        s.labels.push(label);
                        map.addOverlay(label);
                    }
                });

                return;
            }

            if(s.blnPreview) return;//预览不执行下面操作
            
            let extraParam={};
            if(data.extraConditon){
                extraParam= tmpDAO.searchParam(data.extraConditon,data.condtion);
            }

            s.blnLoading=true;

            store.dispatch(Get_OPerate_Data,{
                                             keyid:data.keyid,
                                             condtionsObj:data.condtion,
                                             ditu:{lb:lb, rt:rt},
                                             extraData:extraParam.param,
                                             indexFields:extraParam.sepParam
                                             }).then(function (code) {
                s.blnLoading=false;
                
                var data = code.biz_body;

                var tempMarker = [];          
                for (var i = 0; i < data.length; i++) {
                    if (s.cachePlace[data[i][primaryKey[1]] || (data[i][primaryKey[0]]+'_'+data[i][primaryKey[1]])]) {
                        continue;
                    }
                    s.cachePlace[data[i][primaryKey[1]] || (data[i][primaryKey[0]]+'_'+data[i][primaryKey[1]])] = data[i];
                    s.cacheData[parseFloat(data[i].longitude)+'-'+parseFloat(data[i].latitude)]=data[i];

                    var myIcon = new BMap.Icon(photo[data[i].netbar_type+data[i].online], new BMap.Size(28,36));

                    var marker=new BMap.Marker(new BMap.Point(data[i].longitude, data[i].latitude),{icon:myIcon});
                    //添加数遍移上/移下事件(添加描述遮罩)
                    var marker_triangle_html='<div class="triangle pulse" style="background-color:rgb(0, 204, 102);color: white;padding: 0px 10px;border-radius: 5px;min-width:140px;padding:5px 10px;">{0}</div>';
                    var posSearchHtml=function(data){
                        var result='';
                        var template='<div>{0}&nbsp;&nbsp;:&nbsp;&nbsp;{1}</div>';
                        result+=Fx.format(template,'全称',data.netbar_name || '');
                        result+=Fx.format(template,'地址',data.netbar_address || '');
                        result+=Fx.format(template,'状态',data.online || '');
                        result+=Fx.format(template,'类型',(data.netbar_type || '').replace('非经','宾馆酒店'));
                        result+=Fx.format(template,'编码',data.netbar_wacode || '');

                        return result;
                    };
                    
                    marker.addEventListener("mouseover",function(e){
                        
                            var point=e.target.point;
                            $('.BMapLabel').parent('div').css('z-index',10000);

                            if(!s.cacheData[point.lng+'-'+point.lat]){return;}
                            var label= new BMap.Label(Fx.format(marker_triangle_html,posSearchHtml(s.cacheData[point.lng+'-'+point.lat])),{position:point, offset:new BMap.Size(-70, -150)});
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
                            labels[point.lng+'-'+point.lat]=label;
                    });
                    marker.addEventListener("mouseout",function(e){
                        $('.BMapLabel').parent('div').css('z-index',500);
                        var point=e.target.point;
                        if(!s.cacheData[point.lng+'-'+point.lat]){return;}
                        var label=labels[point.lng+'-'+point.lat];
                        map.removeOverlay(label);
                        delete labels[point.lng+'-'+point.lat];
                    });

                    //构造场所遮罩
                    markers.push({
                        marker: marker,
                        siteid: data[i][primaryKey[1]] || (data[i][primaryKey[0]]+'_'+data[i][primaryKey[1]])
                    });
                    tempMarker.push(marker);
                }

                s.clus.addMarkers(tempMarker);

            })
        };

        //添加地图鼠标拖动事件
        map.addEventListener('dragend', function (e) {
            Fx.DelayTrigger(function () {
                setMarks();
            }, map, 200);
        });

        //添加地图层级改变事件
        map.addEventListener('zoomend',function(e){
            var zoom=map.getZoom();
            s.$refs.scaleBar.setVal(zoom);
            if(zoom<=15){
                if(s.clus){s.clus.clearMarkers();s.cachePlace={};s.cacheData={};}
                setMarks();
            }
            if(zoom>=16){
               if(s.clus){s.clus.clearMarkers();s.cachePlace={};s.cacheData={};}
               map.clearOverlays();
               setMarks();
            }

        });

        setMarks();
        this.hasInit=true;
      }
  }
}
</script>
<style>
    .MapDot .dateSearch .el-date-editor{width:200px !important;}
    .MapDot .placeCount{width:80px;height:80px;background-color:red;border-radius:50%;text-align:center;color:white;}
</style>
<style scoped lang="less">
  @import "../css/variables.less";
  .MapDot{width:100%;height:100%;position:relative;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .MapDot .MapDot_container{width:100%;height:100%;}
  .MapDot .dateSearch{position:absolute;top:0px;left:50%;margin-left:-123px;}
  .MapDot .scaleBar_container{position:absolute;top:0px;left:0px;}

  .MapDot .icon_conatainer{position:absolute;bottom:0px;left:0px;}
</style>
