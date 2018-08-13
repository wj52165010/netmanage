<!-- 设备详情组件 -->
<template>
    <div class="DeviceDetail">
        <!--加载中-->
        <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index: 100;">
            <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
        </div>
        <div class="DeviceDetail_container">
            <div class="row">
                <div class="col-md-12 title">基础信息:</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">设备名称:</div><div class="col-md-4 ">{{d.equipment_name}}</div>
                <div class="col-md-2 text-right">设备编码:</div><div class="col-md-4 ">{{d.equipment_id}}</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">设备状态:</div><div class="col-md-4 ">{{d.online_state}}</div>
                <div class="col-md-2 text-right">最近联系时间:</div><div class="col-md-4 ">{{d.capture_time_desc}}</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">设备类型:</div><div class="col-md-4 ">{{d.equipment_type}} </div>
                <div class="col-md-2 text-right">设备MAC:</div><div class="col-md-4 ">{{d.mac}}</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">设备楼层:</div><div class="col-md-4 ">{{d.floor}}  </div>
                <div class="col-md-2 text-right">设备型号:</div><div class="col-md-4 ">{{d.firmware_ver}}</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">固件版本:</div><div class="col-md-4 ">{{d.hw_version}}  </div>
                <div class="col-md-2 text-right">软件版本:</div><div class="col-md-4 ">{{d.sf_version}}</div>
            </div>

            <div class="row">
                <div class="col-md-12 title">所属场所:</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">场所名称:</div><div class="col-md-4 ">{{d.netbar_name}}  </div>
                <div class="col-md-2 text-right">场所地址:</div><div class="col-md-4 ">{{d.netbar_address}}</div>
            </div>


            <div class="row">
                <div class="col-md-12 title">所属厂商:</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">厂商名称:</div><div class="col-md-2 ">{{d.security_software_orgname}}  </div>
                <div class="col-md-2 text-right">负责人员:</div><div class="col-md-2 ">{{d.contactor}}</div>
                <div class="col-md-2 text-right">联系电话:</div><div class="col-md-2 ">{{d.contactor_tel}}</div>
            </div>

            <!--地图展示-->
            <div class="map_container" name="map">
            
            </div>
        </div>
    </div>
</template>

<script>

import {DeviceDetail} from '../../store/mutation-types'
export default {
  name: 'DeviceDetail',
  props:['code'],
  data () {
    return {
      map:null,
      d:{},
      blnLoading:false,
    }
  },
  mounted(){
    this.loadData();
  },
  methods:{
    //加载场所详细信息
    loadData(){
        this.blnLoading=true;
        this.$store.dispatch(DeviceDetail,{equipment_id:this.code}).then(res=>{
            this.blnLoading=false;
            if(!tool.msg(res,'','获取设备详细数据失败!'))return;
            this.d=res.biz_body;
            this.loadMap(this.d);
        });
    },
    loadMap(d){
        this.map = new BMap.Map($(this.$el).find('div[name="map"]')[0],{enableMapClick:false,minZoom:13,maxZoom:18});          // 创建地图实例  
        let point = new BMap.Point(114.35,36.10);  // 创建点坐标                                          
        this.map.centerAndZoom(point, 13);                 // 初始化地图，设置中心点坐标和地图级别 
        this.map.enableScrollWheelZoom(true);              // 启动鼠标滚轮缩放
        let marker = new BMap.Marker(new BMap.Point(114.35,36.10)); // 创建点
        this.map.addOverlay(marker);                      //将点加入地图中
        let top_left_navigation = new BMap.NavigationControl({author:BMAP_NAVIGATION_CONTROL_ZOOM});  //左上角，添加默认缩放平移控件
        let opy_address=!d.equipment_address?"暂无数据":d.equipment_address;
     
        let opts = {
            width : 450,     // 信息窗口宽度
            height: 30,     // 信息窗口高度
            title : '场所地址：'+ opy_address, // 信息窗口标题
        }
        let infoWindow = new BMap.InfoWindow(`经纬度：${d.longitude},${d.latitude}`, opts);
        
        marker.addEventListener("click", ()=>{          
            this.map.openInfoWindow(infoWindow,point); //开启信息窗口
        });
    }
  }
}
</script>

<style scoped lang="less">
@import "../../css/variables.less";

.DeviceDetail{width:100%;height:100%;padding:5px;position:relative;}
.DeviceDetail_container{width:100%;height:100%;background-color:white;}

.DeviceDetail .row .title{font-weight:600;}
.DeviceDetail .row {line-height:30px;}

.DeviceDetail .map_container{width:100%;height:200px;}
</style>
