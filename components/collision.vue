<!-- 碰撞关系图 -->
<template>
    <div class="Collision">
        <canvas :id="cid" class="canvas"></canvas>
    </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: 'Collision',
  data () {
    return {
      cid:tool.guid(),//画板ID
      canvas:null,//画布对象
      w:0,//显示窗体宽度
      h:0,//显示窗体高度
    }
  },
  mounted(){
    this.init();
  },
  methods:{
    //初始化画板
    init(){
        let container=$(this.$el);
        this.canvas=container.find('#'+this.cid)[0];
        this.w= width = this.canvas.width = container.width();
        this.h= height = this.canvas.height = container.height();

        let tau=2* Math.PI,context=this.canvas.getContext('2d');


        var nodes = d3.range(100).map(function(i) {
                        return {
                            r: 30
                        };
                    });

        var simulation = d3.forceSimulation(nodes)
            .velocityDecay(0.2)
            .force("x", d3.forceX((d,i)=>{return d.x;}).strength(0.02))
            .force("y", d3.forceY().strength(0.02))
            .force('manybody',d3.forceManyBody().strength(10))
            .force("collide", d3.forceCollide().radius(function(d) { return d.r ; }).iterations(2))
            .on("tick", ticked);

        function ticked() {
            context.clearRect(0, 0, width, height);
            context.save();
            context.translate(width / 2, height / 2);

            context.beginPath();
            let activeNode=null;
            nodes.forEach(function(d) {
                if(d.active){
                    activeNode=d;
                }else{
                    context.moveTo(d.x + d.r, d.y);
                    context.arc(d.x, d.y, d.r, 0, tau);
                }
            });
            context.fillStyle = "#ddd";
            context.fill();
            context.strokeStyle = "#333";
            context.stroke();

            context.restore();
            if(activeNode){
                context.save();
                context.translate(width / 2, height / 2);
                context.beginPath();
                context.moveTo(activeNode.x + activeNode.r, activeNode.y);
                context.arc(activeNode.x, activeNode.y, activeNode.r, 0, tau);
                context.fillStyle = "#ddd";
                context.fill();
                context.strokeStyle = "red";
                context.stroke();
                context.restore();
                activeNode=null;
            }
        }

        function zoomed(){
            context.save();
            context.clearRect(0, 0, width, height);
            context.translate(d3.event.transform.x, d3.event.transform.y);
            //context.scale(d3.event.transform.k, d3.event.transform.k);
            ticked();
            context.restore();
        }
  
        //实现拖动
        //d3.select(this.canvas).call(d3.zoom().scaleExtent([1 / 2, 4]).on('zoom',zoomed));
        //注册画布单击事件
        d3.select(this.canvas).on('mousemove',function(){
            var n = nodes.length,
                i,
                dx,
                dy,
                d2,
                s2 =0,
                circle,
                subject;

            for (i = 0; i < n; ++i) {
                circle = nodes[i];
                s2=Math.pow(circle.r,2);
                dx = (d3.event.layerX-width/2) - circle.x;
                dy = (d3.event.layerY-height/2) - circle.y;
                d2 = dx * dx + dy * dy;
                circle.active=false;
                circle.r=30;
                if (d2 < s2) subject = circle, s2 = d2;
            }

            if(!subject){simulation.nodes(nodes);simulation.restart();return;}
            subject.active=true;
            subject.r=60;
            simulation.nodes(nodes);
            simulation.alphaTarget(0.5).restart();
        });
    }
  }
}
</script>

<style scoped lang="less">
    @import "../css/variables.less";
    .Collision{width:100%;height:100%;}
    .Collision .canvas{width:100%;height:100%;}
</style>
