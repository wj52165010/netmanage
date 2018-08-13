<!-- 设备场所详情组件 -->
<template>
    <div class="DevicePlaceDetail">
        <!--加载中-->
        <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index: 100;">
            <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
        </div>
        <div class="DevicePlaceDetail_container">
            <div class="row">
                <div class="col-md-12 title">基础信息:</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">场所名称:</div><div class="col-md-4 ">重庆智多测试场所</div>
                <div class="col-md-2 text-right">场所编码:</div><div class="col-md-4 ">53011135000127</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">营业状态:</div><div class="col-md-4 ">在线</div>
                <div class="col-md-2 text-right">场所状态:</div><div class="col-md-4 ">离线</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">设备概况:</div><div class="col-md-4 ">在线1/异常0/离线0 </div>
                <div class="col-md-2 text-right">最近联系时间:</div><div class="col-md-4 ">2018-05-09 17:25:07</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">经营性质:</div><div class="col-md-2 ">经营  </div>
                <div class="col-md-2 text-right">场所类型:</div><div class="col-md-2 ">交通枢纽</div>
                <div class="col-md-2 text-right">数据来源:</div><div class="col-md-2 ">无线WIFI</div>
            </div>

            <div class="row">
                <div class="col-md-12 title">网络接入信息:</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">网络服务商:</div><div class="col-md-2 ">中国电信  </div>
                <div class="col-md-2 text-right">接入方式:</div><div class="col-md-2 ">专网、真实IP地址</div>
                <div class="col-md-2 text-right">账号或IP:</div><div class="col-md-2 ">58.17.252.3</div>
            </div>


            <div class="row">
                <div class="col-md-12 title">场所负责人:</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">姓名:</div><div class="col-md-2 ">张三  </div>
                <div class="col-md-2 text-right">证件号码:</div><div class="col-md-2 ">5002351995XXXXXXXX</div>
                <div class="col-md-2 text-right">联系电话:</div><div class="col-md-2 ">138xxxxxxxx</div>
            </div>

            <div class="row">
                <div class="col-md-12 title">所属厂商:</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">厂商名称:</div><div class="col-md-2 ">重庆智多  </div>
                <div class="col-md-2 text-right">负责人员:</div><div class="col-md-2 ">皮皮虾</div>
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
  name: 'DevicePlaceDetail',
  data () {
    return {
      map:null,
      blnLoading:false,
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

.DevicePlaceDetail{width:100%;height:100%;padding:5px;position:relative;}
.DevicePlaceDetail_container{width:100%;height:100%;background-color:white;}

.DevicePlaceDetail .row .title{font-weight:600;}
.DevicePlaceDetail .row {line-height:30px;}

.DevicePlaceDetail .map_container{width:100%;height:200px;}
</style>
