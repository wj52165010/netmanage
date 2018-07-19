<!-- 设备详情组件 -->
<template>
    <div class="DeviceDetail">
        <div class="DeviceDetail_container">
            <div class="row">
                <div class="col-md-12 title">基础信息:</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">设备名称:</div><div class="col-md-4 ">重庆智多测试场所</div>
                <div class="col-md-2 text-right">设备编码:</div><div class="col-md-4 ">53011135000127</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">设备状态:</div><div class="col-md-4 ">在线</div>
                <div class="col-md-2 text-right">最近联系时间:</div><div class="col-md-4 ">2017-12-14 16:18:09</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">设备类型:</div><div class="col-md-4 ">固定采集设备 </div>
                <div class="col-md-2 text-right">设备MAC:</div><div class="col-md-4 ">44-D1-FA-12-14-A0</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">设备楼层:</div><div class="col-md-4 ">10楼  </div>
                <div class="col-md-2 text-right">设备型号:</div><div class="col-md-4 ">10楼</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">固件版本:</div><div class="col-md-4 ">xxx  </div>
                <div class="col-md-2 text-right">软件版本:</div><div class="col-md-4 ">xxx</div>
            </div>

            <div class="row">
                <div class="col-md-12 title">所属场所:</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">场所名称:</div><div class="col-md-4 ">重庆爱思网安测试场所  </div>
                <div class="col-md-2 text-right">场所地址:</div><div class="col-md-4 ">重庆市南岸区</div>
            </div>


            <div class="row">
                <div class="col-md-12 title">所属厂商:</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">厂商名称:</div><div class="col-md-2 ">重庆网安  </div>
                <div class="col-md-2 text-right">负责人员:</div><div class="col-md-2 ">张三</div>
                <div class="col-md-2 text-right">联系电话:</div><div class="col-md-2 ">138xxxxxxxx</div>
            </div>

            <!--地图展示-->
            <div class="map_container" name="map">
            
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'DeviceDetail',
  data () {
    return {
      map:null
    }
  },
  mounted(){
    this.loadMap();
  },
  methods:{
    loadMap(){
        this.map = new BMap.Map($(this.$el).find('div[name="map"]')[0],{enableMapClick:false,minZoom:13,maxZoom:18});          // 创建地图实例  
        let point = new BMap.Point(114.35,36.10);  // 创建点坐标                                          
        this.map.centerAndZoom(point, 13);                 // 初始化地图，设置中心点坐标和地图级别 
        this.map.enableScrollWheelZoom(true);              // 启动鼠标滚轮缩放
        let marker = new BMap.Marker(new BMap.Point(114.35,36.10)); // 创建点
        this.map.addOverlay(marker);                      //将点加入地图中
        let top_left_navigation = new BMap.NavigationControl({author:BMAP_NAVIGATION_CONTROL_ZOOM});  //左上角，添加默认缩放平移控件
     
        let opts = {
            width : 450,     // 信息窗口宽度
            height: 30,     // 信息窗口高度
            title : '场所地址：'+ '' , // 信息窗口标题
        }
        let infoWindow = new BMap.InfoWindow("经纬度：", opts);
        
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
