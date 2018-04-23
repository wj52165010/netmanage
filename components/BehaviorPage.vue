<!-- 行为分析详细页面组件 -->
<template>
    <div class="BehaviorDetail">
        <div class="option">
            行为分析GIS
            <div class="bar">
                <span class="tag_label" style="margin-left:10px;cursor:pointer;" v-for="k in btns">
                    <i :class="k.icon" style="margin-right:5px;"></i>{{k.name}}
                </span>
            </div>
        </div>
        <div class="map">
            <div class="map_container"></div>
            <!--轨迹信息-->
            <div class="trackInfo">
                <div class="title">行为轨迹</div>
                <div class="content">
                    <Scroll :listen="trackData" :store="store" :scrollStyle="{'margin-top':'0px'}">
                        <div v-for="t in trackData" style="line-height:30px;height:30px;">{{t}}</div>
                    </Scroll>
                </div>
            </div>
            <!--身份信息-->
            <div class="idenInfo">
                <div class="title">使用身份</div>
                <div class="content">
                    <Scroll :listen="idenData" :store="store" :scrollStyle="{'margin-top':'0px'}">
                        <div v-for="t in idenData" style="line-height:30px;height:30px;">{{t}}</div>
                    </Scroll>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import * as d3 from 'd3'
import {scaleLinear} from "d3-scale";
import Scroll from 'components/scroll'

export default {
  name: 'BehaviorDetail',
  props:['store'],
  components:{Scroll},
  data () {
    return {
      map:null,
      color:scaleLinear().domain([0,100]).range(['#9ff75f','#ff0200']),
      polyline:null,
      btns:[{name:'导出结果',icon:'fa fa-mail-forward'}],
      trackData:[1,2,3,4,5,6,7,8],//轨迹信息数据
      idenData:[],//身份信息数据
    }
  },
  mounted(){
    this.init();
  },
  methods:{
    init(){
        this.addColorIden();
        let s=this;
        this.map=new BMap.Map($(this.$el).find('.map_container')[0],{minZoom:13,maxZoom:18});
        this.map.centerAndZoom(new BMap.Point(116.418261, 39.921984),15);
        this.map.enableScrollWheelZoom();     //开启鼠标滚轮缩放

        let tempPos=_.map([
            {"lng":116.418261,"lat":39.921984,"count":50},
            {"lng":116.423332,"lat":39.916532,"count":51},
            {"lng":116.419787,"lat":39.930658,"count":15},
            {"lng":116.418455,"lat":39.920921,"count":0},
            {"lng":116.418843,"lat":39.915516,"count":100},
            {"lng":116.42546,"lat":39.918503,"count":6}],m=>{
                let p = new BMap.Point(m.lng, m.lat);
                
                let pSize=16;
                let html=`<div class="behaviorPoint" style="width:${pSize}px;height:${pSize}px;background-color:${s.color(m.count)};"></div>`;
                var label= new BMap.Label(html,{position:p, offset:new BMap.Size(-pSize/2, -pSize/2)});
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
              return p;
            });


        this.polyline = new BMap.Polyline(tempPos, {strokeColor:"#03c1d7", strokeWeight:2, strokeOpacity:1});   //创建折线
        this.map.addOverlay(this.polyline);   //增加折线
    },
    //添加热力颜色标识
    addColorIden(){
        let s=this;
        let svg = d3.select(".BehaviorDetail")
          .append("svg")
          .attr('class','colorIen');

        svg.selectAll('line')
            .data(d3.range(100))
            .enter()
            .append('line')
            .attr('x1',40)
            .attr('y1',function(d){return d;})
            .attr('x2',40)
            .attr('y2',function(d){return d+1;})
            .style('stroke',function(d){return s.color(100-d);})
            .style('stroke-width',20);
        
        svg.append('text')
           .text('高')
           .attr('x',60)
           .attr('dy',12)
           .style('font-size','12px')

        svg.append('text')
           .text('低')
           .attr('x',60)
           .attr('dy',98)
           .style('font-size','12px')

        svg.append('text')
           .text('出现在场所频率')
           .attr('x',5)
           .attr('dy',118)
           .style('font-size','12px')
    }
  }
}
</script>
<style lange="less">
    .behaviorPoint{border-radius:50%;}
    .behaviorPoint:hover{cursor:pointer;}
    .colorIen{position:absolute;width:100px;height:130px;left:0px;bottom:0px;}
</style>

<style scoped lang="less">
  @import "../css/variables.less";
  .BehaviorDetail{width:100%;height:100%;}

  @optionH:30px;
  .BehaviorDetail .option{line-height:@optionH;padding:0px 10px 0px 20px;.border('bottom');}
  .BehaviorDetail .option .bar{float:right;font-size:12px;}
  .BehaviorDetail .option .bar .tag_label:hover{color:@btn_Bg_Col_hover_1;}

  .BehaviorDetail .map{width:100%;height:~"calc(100% - @{optionH} - 1px)";position:relative;}
  .BehaviorDetail .map .map_container{width:100%;height:100%;}
  
  @infoW:300px;
  .BehaviorDetail .map .trackInfo{
      position: absolute;right: 0px;width: @infoW;height: 40%;top: 10px;
      .border('');border-top-left-radius:5px;border-bottom-left-radius:5px;
      border-right:none;
      -moz-box-shadow:-3px 2px 2px #999999; -webkit-box-shadow:-3px 2px 2px #999999; box-shadow:-3px 2px 2px #999999;
   }

  .BehaviorDetail .map .idenInfo{
      position: absolute;right: 0px;width: @infoW;height: 40%;bottom:10px;
      .border('');border-top-left-radius:5px;border-bottom-left-radius:5px;
      border-right:none;
      -moz-box-shadow:-3px 2px 2px #999999; -webkit-box-shadow:-3px 2px 2px #999999; box-shadow:-3px 2px 2px #999999;
   }

   @titleH:30px;
   .BehaviorDetail .map .idenInfo .title,
   .BehaviorDetail .map .trackInfo .title{
       line-height:@titleH;.border('bottom');text-align:center;background-color:white;border-top-left-radius:5px;
   }

   .BehaviorDetail .map .idenInfo .content,
   .BehaviorDetail .map .trackInfo .content{
     width:100%;height:~'calc(100% - @{titleH})';;
   }
</style>
