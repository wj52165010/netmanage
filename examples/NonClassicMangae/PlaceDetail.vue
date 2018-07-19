<!-- 场所详情组件 -->
<template>
    <div class="PlaceDetail">
        <div class="PlaceDetail_container">
            <div class="row">
                <div class="col-md-12 title">场所信息:</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">场所名称:</div><div class="col-md-4 ">重庆智多测试场所</div>
                <div class="col-md-2 text-right">场所编码:</div><div class="col-md-4 ">53011135000127</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">营业状态:</div><div class="col-md-4 ">开机营业</div>
                <div class="col-md-2 text-right">场所状态:</div><div class="col-md-4 ">在线</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">终端概况:</div><div class="col-md-4 ">申报100/检测100/在线20  </div>
                <div class="col-md-2 text-right">最近联系时间:</div><div class="col-md-4 ">2017-12-14 16:18:09</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">办卡权限:</div><div class="col-md-4 ">注册实名/身份证上网/一代证扫描  </div>
                <div class="col-md-2 text-right">所属地区:</div><div class="col-md-4 ">南岸区</div>
            </div>

    

            <div class="row">
                <div class="col-md-12 title">网络接入信息:</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">网络服务商:</div><div class="col-md-2 ">中国电信  </div>
                <div class="col-md-2 text-right">接入方式:</div><div class="col-md-2 ">专网、真实IP地址</div>
                <div class="col-md-2 text-right">出口IP:</div><div class="col-md-2 ">58.17.252.3</div>
            </div>

            <div class="row">
                <div class="col-md-12 title">场所负责人:</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">法人姓名:</div><div class="col-md-4 ">张三  </div>
                <div class="col-md-2 text-right">联系电话:</div><div class="col-md-4 ">138xxxxxxxx</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">信息安全员:</div><div class="col-md-2 ">皮皮虾  </div>
                <div class="col-md-2 text-right">联系邮箱:</div><div class="col-md-2 ">XXX@mail.com</div>
                <div class="col-md-2 text-right">联系电话:</div><div class="col-md-2 ">138xxxxxxxx</div>
            </div>

            <div class="row">
                <div class="col-md-12 title">所属网监:</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">网监部门:</div><div class="col-md-2 ">皮皮虾  </div>
                <div class="col-md-2 text-right">网监负责人:</div><div class="col-md-2 ">张三</div>
                <div class="col-md-2 text-right">联系电话:</div><div class="col-md-2 ">138xxxxxxxx</div>
            </div>

            <div class="row">
                <div class="col-md-12 title">所属派出所:</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">派出所名称:</div><div class="col-md-4 ">测试派出所  </div>
                <div class="col-md-2 text-right">责任警员:</div><div class="col-md-4 ">张三</div>
            </div>

            <div class="row">
                <div class="col-md-12 title">所属厂商:</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">厂商名称:</div><div class="col-md-2 ">重庆网安  </div>
                <div class="col-md-2 text-right">厂商负责人:</div><div class="col-md-2 ">张三</div>
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
  name: 'PlaceDetail',
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

.PlaceDetail{width:100%;height:100%;padding:5px;position:relative;}
.PlaceDetail_container{width:100%;height:100%;background-color:white;}

.PlaceDetail .row .title{font-weight:600;}
.PlaceDetail .row {line-height:30px;}

.PlaceDetail .map_container{width:100%;height:200px;}
</style>
