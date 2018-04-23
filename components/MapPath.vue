<!-- 地图路径组件 -->
<template>
    <div class="MapPath">
    </div>
</template>

<script>
import '../../static/lushu.min.js'
export default {
  name: 'MapPath',
  data () {
    return {
      arrPois:[
          new BMap.Point(116.403984,39.914004),
          new BMap.Point(116.402116,39.913938),
          new BMap.Point(116.402116,39.913938),
          new BMap.Point(116.402046,39.913928),
          new BMap.Point(116.401856,39.913927),
          new BMap.Point(116.401547,39.913926),
          new BMap.Point(116.401008,39.913923),
          new BMap.Point(116.400599,39.913921),
          new BMap.Point(116.39999,39.913908),
          new BMap.Point(116.399471,39.913875),
          new BMap.Point(116.399042,39.913852),
          new BMap.Point(116.398035,39.913835),
          new BMap.Point(116.395593,39.913683),new BMap.Point(116.395383,39.913681),new BMap.Point(116.395114,39.913658),new BMap.Point(116.394666,39.913664),new BMap.Point(116.390265,39.91349),new BMap.Point(116.38925,39.913456),new BMap.Point(116.388931,39.913461),new BMap.Point(116.388643,39.913457),new BMap.Point(116.388335,39.913463),new BMap.Point(116.386455,39.913424),new BMap.Point(116.386166,39.913429),new BMap.Point(116.385898,39.913425),new BMap.Point(116.384327,39.913399),new BMap.Point(116.384168,39.913396),new BMap.Point(116.38384,39.913391),new BMap.Point(116.383472,39.913395),new BMap.Point(116.383323,39.913402),new BMap.Point(116.382796,39.913403),new BMap.Point(116.382747,39.913402)]
    }
  },
  mounted(){
  },
  methods:{
    init(){
        var map=new BMap.Map($(this.$el)[0]);
            //LoadOverlayImage(map);//加载瓦片图
            map.enableScrollWheelZoom();
            map.centerAndZoom();
            map.setViewport(this.arrPois);
        var lushu = new BMapLib.LuShu(map,this.arrPois,{
            defaultContent:"粤A30780",//"从天安门到百度大厦"
            autoView:true,//是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
            icon  : new BMap.Icon('http://developer.baidu.com/map/jsdemo/img/car.png', new BMap.Size(52,26),{anchor : new BMap.Size(27, 13)}),
            speed: 100,
            enableRotation:true,//是否设置marker随着道路的走向进行旋转
            landmarkPois:[
                {lng:116.306954,lat:40.05718,html:'加油站',pauseTime:2}
            ]
                
            });
        lushu.start();
    }
  }
}
</script>

<style scoped lang="less">
  .MapPath{width:100%;height:100%;}
</style>
