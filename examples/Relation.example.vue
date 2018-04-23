<!-- 关系展示组件 -->
<template>
    <div class="Relation">
        <!--搜索栏-->
        <div class="option_bar">
            <div style="display:inline-block;width:350px;">
                <SearchDropdown v-model="searchKey"  :info="serachInfo" :noShowOnlyOne="true" holder="请输入关键字(身份证/手机号/MAC/虚拟身份)" >

                </SearchDropdown>
            </div>
            <button type="button" class="btn btn-default" style="float:right;background-color:#20a1ff;color:white;" @click="Search()">
              <span v-show="!blnSearch">搜 索</span>
              <i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i>
            </button>
        </div>
        <!--过滤栏-->
        <div class="fliter_bar">
            <span class="fliter_item" :class="{active:showTypes.indexOf('cert')>=0}" @click="toggleType('cert')">身份证</span>
            <span class="fliter_item" :class="{active:showTypes.indexOf('mobile')>=0}" @click="toggleType('mobile')">手机号</span>
            <span class="fliter_item" :class="{active:showTypes.indexOf('mac')>=0}" @click="toggleType('mac')">MAC</span>
            <span class="fliter_item" :class="{active:showTypes.indexOf('vid')>=0}" @click="toggleType('vid')">虚拟身份</span>
        </div>
        <canvas :id="id"></canvas>
    </div>
</template>

<script>
import {RelationSecond} from '../store/mutation-types'
import SearchDropdown from 'components/SearchDropdown'

import * as d3 from 'd3'
export default {
  name: 'Relation',
  components:{SearchDropdown},
  data () {
    return {
      id:'relation_'+tool.guid(),
      blnSearch:false,
      simulation:null,
      canvas:null,//画布对象
      ctx:null,//画布上下文对象
      radius:30,//关系点半径
      instances:200,//节点之间的距离
      points:[],//[{x:0,y:0,active:false}],//画布上点集合数据
      edges:[],
      translate:{},//画布坐标转换地址
      transform:d3.zoomIdentity,
      offset:{},//当前容器偏移量
      icon:null,//图片对象
      iconExtend:null,//扩展图片对象
      iconPin:null,//定位图片对象
      searchKey:'',//搜索关键字
      serachInfo:{color:'gray',val:'',code:''},//搜索类型提示信息
      showTypes:['cert','mac','mobile','vid'],//当前显示的类型
      typesParam:{
          'cert':{color:'blue'},
          'mac':{color:'yellow'},
          'mobile':{color:'orange'},
          'vid':{color:'black'}
      }
    }
  },
  watch:{
    points:{
        deep:true,
        handler:function(){
           this.$nextTick(()=>{
              this.ticked();
           });
           
        }
    },
    searchKey(){
      let res = this.vaildInupt(this.searchKey);
      if(res.length==0){
        this.serachInfo={color:'gray',val:'',code:''}
      }

      if(res.length==1){
        this.serachInfo={color:'green',val:res[0].name,code:res[0].val}
      }

    },
    showTypes(){
        _.each(this.points,p=>{
            (p.root || this.showTypes.indexOf(p.typeCode)>=0)?p.typeHide=false:p.typeHide=true;
        });
    }
  },
  mounted(){
    let el=$(this.$el);
    this.canvas=el.find(`#${this.id}`);
    setTimeout(()=>{
        this.offset=el.offset();
        this.canvas.width=el.width();
        this.canvas.height=el.height();
        this.canvas.attr('width',this.canvas.width);
        this.canvas.attr('height',this.canvas.height);

        this.ctx=this.canvas[0].getContext('2d');

        this.translate={x:this.canvas.width/2,y:this.canvas.height/2};

        this.initDraw();
        this.inPath();
        this.initDrag();
        this.regPosClick();
        this.regPosDblclick();

        // this.points=[
        //     {id:0,x:0,y:0,active:false},
        // ];

        // this.points = this.points.concat(this.pointPos(this.points[0],[
        //    {id:1,x:0,y:0,active:false},
        //    {id:2,x:0,y:0,active:false},
        //    {id:3,x:0,y:0,active:false},
        //    {id:3,x:0,y:0,active:false},
        // ]));

        // this.points = this.points.concat(this.pointPos(this.points[1],[
        //     {id:5,x:0,y:0,active:false,instances:100},
        //     {id:6,x:0,y:0,active:false,instances:100},
        //     {id:7,x:0,y:0,active:false,instances:100},
        // ]));

        // this.points=[
        //     {id:1,x:0,y:0,active:false,parent:true,color:'#ffd86e',borderCol:'#edba39',text:'测试'},
        //     {id:2,x:0,y:0,active:false},
        //     {id:3,x:0,y:0,active:false},
        //     {id:4,x:0,y:0,active:false},
        //     {id:5,x:0,y:0,active:false,parent:true,color:'#ffd86e',borderCol:'#edba39'},
        // ];
        // this.simulation.nodes(this.points);

        // this.edges=[
        //     { "source": 1 , "target": 2, text:'测试连线字符串'},
        //     { "source": 1 , "target": 3, text:'测试连线字符串' },
        //     { "source": 1 , "target": 4, text:'测试连线字符串' },
        // ];

        // this.simulation.force("link").links(this.edges).distance(200);

        // //设置主节点不可受到碰撞影响
        // setTimeout(()=>{
        //     let parentPs = _.filter(this.points,p=>p.parent);
        //     _.each(parentPs,p=>{
        //         p.fx=p.x;
        //         p.fy=p.y;
        //     });
        // },100);
    },100);
    

    //加载图片
    this.icon = new Image(); //定义一个图片对象
    this.icon.src = 'static/icons-remove.png';
    this.iconExtend = new Image(); //定义一个图片对象
    this.iconExtend.src='static/icons-extend.png'; 
    this.iconPin=new Image();
    this.iconPin.src='static/icons-pin.png';
    
  },
  methods:{
    //初始化画布力图控件
    initDraw(){
        let s=this;
        var simulation =this.simulation = d3.forceSimulation(this.points)
            // .force("x", d3.forceX((d,i)=>{return d.x;}))
            // .force("y", d3.forceY((d,i)=>{return d.y;}))
            .force("link", d3.forceLink().id(function(d) { return d.id; }))
            .force('manybody',d3.forceManyBody())
            .force("collide", d3.forceCollide().radius(function(d) { return s.radius ; }).strength(1))
            .on("tick", s.ticked);
    },
    ticked(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawRelation();//绘画关系图
    },
    //初始化画布拖动功能
    initDrag(){
        var canvas = d3.select("#"+this.id);
        canvas
        .call(d3.drag().subject(this.dragsubject)
        .on("start", this.dragstarted)
        .on("drag", this.dragged)
        .on("end", this.dragended))
        //.call(d3.zoom().scaleExtent([1 / 2, 8]).on("zoom", this.zoomed)).on("dblclick.zoom", null)
        .call(this.ticked)


        // canvas.call(d3.drag().on("drag", ()=>{
        //     this.translate.x+=d3.event.dx;
        //     this.translate.y+=d3.event.dy;
        //     this.ticked();
        // }));
    },
    dragsubject(){
        let s=this;
        var i,
            x = s.transform.invertX(d3.event.x),
            y = s.transform.invertY(d3.event.y),
            res={},
            dx,
            dy;

        for (i = s.points.length - 1; i >= 0; --i) {
            res={};
            point = s.points[i];

            dx = (x-s.transform.invertX(s.translate.x)) - point.x;
            dy = (y-s.transform.invertY(s.translate.y)) - point.y;
     
            if (dx * dx + dy * dy < s.radius * s.radius) {
               res=point;break;
            }
        }
        return  res; 
    },
    dragstarted(){
        this.simulation.alphaTarget(0.3).restart();
    },
    dragged(){
        if(d3.event.subject.x==undefined){
          this.translate.x+=d3.event.dx;
          this.translate.y+=d3.event.dy;
        }else{
            d3.event.subject.fx = d3.event.x;
            d3.event.subject.fy = d3.event.y;

            //重新设置拖动点连接线斜率
            let endP=d3.event.subject;
            let link = _.find(this.edges,e=>e.target.id==endP.id);
            if(!link) return;
            let startP= link.source;
            endP.linkAngle=Math.abs((endP.fy-startP.y)/(endP.fx-startP.x));

        }
    },
    dragended(){
        this.simulation.alphaTarget(0);

        // d3.event.subject.fx = null;
        // d3.event.subject.fy = null;
        
    },
    zoomed() {
        this.translate.x=this.transform.applyX(this.translate.x);
        this.translate.y=this.transform.applyY(this.translate.y);
        this.transform = d3.event.transform;
        this.ticked();
    },
    //构造分支点位置
    pointPos(parent,childs){
        let area=this.quadrant(parent);
       
        let data = tool.Clone(childs),len=data.length,aveAngle=(area.end-area.start)/(area.blnAll?(len-1):len),s=this;

        for(let i=0;i<len;i++){
            let d=data[i];
            d.x =parent.x + Math.cos(area.start + aveAngle*i) * (d.instances || s.instances);
            d.y =parent.y - Math.sin(area.start + aveAngle*i) * (d.instances || s.instances);
            d.linkAngle=aveAngle*i;//该点连线的角度
            d.linkNode=parent; //节点连接点对象引用
            d.angle=area.start + aveAngle*i;
        }

        return data;
    },
    //根据节点连线判定该点子节点绘画区域
    quadrant(d){
        let res={start:0,end: Math.PI*2,blnAll:false};
     
        if(d.linkAngle==undefined) return res;

        if(d.linkAngle == 0){//垂直在一，四象限
            res.start=-Math.PI/2; //90度
            res.end=Math.PI/2; //90度
            res.blnAll=true;
        }else if(d.linkAngle == Math.PI/2){ //垂直在三，四象限
            res.start=0; //0度
            res.end=Math.PI; //180度
            res.blnAll=true;
        }else if (d.linkAngle == Math.PI){//垂直在二，三象限
            res.start=Math.PI/2; //90度
            res.end=Math.PI + Math.PI/2; //270度
            res.blnAll=true;
        }else if(d.linkAngle == Math.PI/2 * 3){//垂直在一，二象限
            res.start=Math.PI; //180度
            res.end=Math.PI * 2; //360度
            res.blnAll=true;
        }else if(d.linkAngle>0 && d.linkAngle<Math.PI/2){ //第四象限
            res.start=0; 
            res.end=Math.PI/2;
            res.blnAll=true;
        }else if(d.linkAngle>Math.PI/2 && d.linkAngle<Math.PI){//第三象限
            res.start=Math.PI/2; 
            res.end=Math.PI;
            res.blnAll=true;
        }else if(d.linkAngle>Math.PI && d.linkAngle<Math.PI/2*3){//第二象限
            res.start=Math.PI; 
            res.end=Math.PI/2*3;
            res.blnAll=true;
        }else if(d.linkAngle>Math.PI/2*3 && d.linkAngle<Math.PI*2){//第一象限
            res.start=Math.PI/2*3; 
            res.end=Math.PI*2;
            res.blnAll=true;
        }
        
        return res;
    },
    //画关系图
    drawRelation(){
        this.ctx.save();
        this.ctx.translate(this.translate.x,this.translate.y);
        //this.ctx.translate(this.transform.x, this.transform.y);
        this.ctx.scale(this.transform.k, this.transform.k);
        
        //画节点间的连线
        _.each(this.edges,this.drawLine);
        //画连线间的字符串
        _.each(this.edges,this.drawLineText);
        //画节点
        _.each(this.points,this.drawPoint);
        //画节点描述信息
        _.each(this.points,this.drawText);

        this.ctx.restore();
    },
    //画节点描述信息
    drawText(p){
        if(p.blnHide || p.typeHide) return;
        if(!p.text) return;
        let ctx=this.ctx;
        ctx.save();
        ctx.font="12px 微软雅黑";
        let rect={w:ctx.measureText(p.text).width,h:ctx.measureText('W').width};

        ctx.fillStyle='black';
        ctx.textBaseline='middle';
        ctx.fillText(p.text,p.x-rect.w/2,p.y);
        
        this.ctx.restore();

    },
    //画点(圆)节点
    drawPoint(p){
        //是否隐藏节点
        if(p.blnHide || p.typeHide) return;

        //鼠标停留在节点上
        let innerRadius=this.radius+8;
        let outerRadius=innerRadius + 30;
        if(p.active){
            //设置外边框
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(p.x,p.y,innerRadius,0,2*Math.PI);
            this.ctx.fillStyle ='rgba(142,229,238,0.5)';
            this.ctx.fill();
            this.ctx.restore();
        }

        //判断节点单击事件
        if(p.clicked){
            //设置外边框操作按钮
            let iconAnimalScales=d3.scaleLinear().domain([0,1]).range([innerRadius,outerRadius]);//节点操作图标显示动画伸缩尺
            let timeelspe=(new Date()).getTime()-p.anmalTime;
            let timeDurition=100;//动画持续时间
            if(timeelspe<=timeDurition){
                outerRadius = iconAnimalScales(d3.easeSinInOut(timeelspe/timeDurition));
            }else{
               p.anmalcomplete=true;
            }

            let arc = d3.arc()
            .outerRadius(outerRadius)
            .innerRadius(innerRadius)
            .padAngle(Math.PI/180*2)
            .context(this.ctx);
            let pie = d3.pie()
            .sort(null)
            .value(function(d) { return d });

            var arcs = pie([1,1,1]);
            p.opts=arcs;


            arcs.forEach((d, i) => {
                d.innerRadius=innerRadius;
                d.outerRadius=outerRadius;
                this.ctx.save();
                this.ctx.translate(p.x,p.y);
                this.ctx.beginPath();
                arc(d);
                this.ctx.fillStyle =p.arcIndex==i?'#8B8378':'#d3d7d4';
                this.ctx.fill();
                this.ctx.restore();

                //设置文字
                var c = arc.centroid(d);
                this.ctx.save();
                this.ctx.translate(p.x,p.y);
                // this.ctx.textAlign = "center";
                // this.ctx.textBaseline = "middle";
                // this.ctx.fillStyle = "#000";
                // this.ctx.fillText(i+1, c[0], c[1]);
                let icon=[this.icon,this.iconExtend,this.iconPin];
                this.ctx.drawImage(icon[i],0,0,50,50,c[0]-10,c[1]-10,20,20);
                this.ctx.restore();

            });
        }else{
            p.opts=[];
            p.arcIndex=-1;
            p.anmalcomplete=false;
        }

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(p.x,p.y,this.radius,0,2*Math.PI);
        this.ctx.fillStyle = p.color || 'red';
        this.ctx.strokeStyle=p.borderCol || 'red';
        this.ctx.lineWidth=2;
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    },
    //画节点间的连线
    drawLine(p){

        if(p.target.blnHide || p.source.blnHide || p.target.typeHide || p.source.typeHide) return;
        let start=this.pointPosByR(p.target,p.source,this.radius),end=this.pointPosByR(p.source,p.target,this.radius);
        //画箭头
        this.drawArrow(start,end);

        //画线
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(start.x,start.y);
        this.ctx.lineTo(end.x,end.y);
        this.ctx.lineWidth=2;
        this.ctx.strokeStyle='#8B8378';
        this.ctx.stroke();
        this.ctx.restore();


        // //判断是否需要连线
        // if(!p.linkNode){ return;}
        // //计算各条线到节点边缘的坐标距离
    
        // let start=this.pointPosByinstance(p.linkNode,p.angle,this.radius,true),
        //     end=this.pointPosByinstance(p,p.angle,this.radius);

        // this.ctx.save();
        // this.ctx.beginPath();
        // this.ctx.moveTo(start.x,start.y);
        // this.ctx.lineTo(end.x,end.y);
        // this.ctx.lineWidth=2;
        // this.ctx.strokeStyle='black';
        // this.ctx.stroke();
        // this.ctx.restore();
    },
    //画节点连线间的提示信息
    drawLineText(p){
        if(p.target.blnHide || p.source.blnHide || p.target.typeHide || p.source.typeHide) return;
        if(!p.text) return;
        let ctx=this.ctx;
        let space=10;//字符串跟周围的间距
        ctx.save();
        let centerLine={x:(p.target.x-p.source.x)/2+p.source.x,y:(p.target.y-p.source.y)/2+p.source.y};//连线中点
        let detel=(p.target.y-p.source.y)/(p.target.x-p.source.x);//连线斜率
        ctx.font="12px 微软雅黑";
        let rect={w:ctx.measureText(p.text).width,h:ctx.measureText('W').width};

        ctx.beginPath();
        
        ctx.translate(centerLine.x,centerLine.y);//将绘图原点移到画布中点
        ctx.rotate(Math.atan(detel));
        ctx.rect(-rect.w/2,-rect.h/2,rect.w+space,rect.h);
        ctx.strokeStyle="transparent";
        ctx.stroke();
        ctx.clip();
        ctx.clearRect(-centerLine.x-this.translate.x,-centerLine.y-this.translate.y,this.canvas.width,this.canvas.height);
        ctx.fillStyle='black';
        ctx.textBaseline='middle';
        ctx.fillText(p.text,-rect.w/2+space/2,0);

        this.ctx.restore();
    },
    //画连接点之间线上的箭头
    drawArrow(start,end){
      let arrowPath=this.getArrowPath(start,end,10,Math.PI/6);
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(arrowPath[0].x,arrowPath[0].y);
      this.ctx.lineTo(arrowPath[1].x,arrowPath[1].y);
      this.ctx.lineTo(arrowPath[2].x,arrowPath[2].y);
      this.ctx.closePath();
      this.ctx.fillStyle='#8B8378';
      this.ctx.fill();
      this.ctx.restore();
    },
    //获取箭头各个点的路径
    getArrowPath(startP,endP,length,angleValue){
        var arrows=[];
        var arrowPoint={x:0,y:0};
        var pixelStart=startP;
        var pixelEnd=endP;
        var angle=angleValue;//箭头和主线的夹角
        var r=length; // r/Math.sin(angle)代表箭头长度
        var delta=0; //主线斜率，垂直时无斜率
        var param=0; //代码简洁考虑
        var pixelTemX,pixelTemY;//临时点坐标
        var pixelX,pixelY,pixelX1,pixelY1;//箭头两个点

        
        //获取箭头三个点位置
        if(pixelEnd.x-pixelStart.x==0){ //斜率不存在是时
            pixelTemX=pixelEnd.x;
            if(pixelEnd.y>pixelStart.y)
            {
                pixelTemY=pixelEnd.y-r;
            }
            else
            {
                pixelTemY=pixelEnd.y+r;
            }    
            //已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
            pixelX=pixelTemX-r*Math.tan(angle); 
            pixelX1=pixelTemX+r*Math.tan(angle);
            pixelY=pixelY1=pixelTemY;
        }else  //斜率存在时
        {
            delta=(pixelEnd.y-pixelStart.y)/(pixelEnd.x-pixelStart.x);
            param=Math.sqrt(delta*delta+1);

            if((pixelEnd.x-pixelStart.x)<0) //第二、三象限
            {
                pixelTemX=pixelEnd.x+ r/param;
                pixelTemY=pixelEnd.y+delta*r/param;
            }
            else//第一、四象限
            {
                pixelTemX=pixelEnd.x- r/param;
                pixelTemY=pixelEnd.y-delta*r/param;
            }
            //已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
            pixelX=pixelTemX+ Math.tan(angle)*r*delta/param;
            pixelY=pixelTemY-Math.tan(angle)*r/param;

            pixelX1=pixelTemX- Math.tan(angle)*r*delta/param;
            pixelY1=pixelTemY+Math.tan(angle)*r/param;
        }

        var pointArrow={x:pixelX,y:pixelY}
        var pointArrow1={x:pixelX1,y:pixelY1};
        
        arrows=[pointArrow,endP,pointArrow1];

        return arrows;
    },
    //根据直线斜率计算除开节点半径后的点位置
    pointPosByR(pixelStart,pixelEnd,distance){
        let detal=0;
        let arrowPoint={x:0,y:0};
        if(pixelEnd.x-pixelStart.x==0){//斜率不存在
            arrowPoint.x=pixelEnd.x;
            arrowPoint.y=pixelEnd.y>pixelStart.y?pixelEnd.y-distance:pixelEnd.y+distance;

        }else if(pixelEnd.y-pixelStart.y==0){
            arrowPoint.x=pixelEnd.x>pixelStart.x?pixelEnd.x-distance:pixelEnd.x+distance;
            arrowPoint.y=pixelEnd.y;
        }
        else{//存在斜率
            delta=(pixelEnd.y-pixelStart.y)/(pixelEnd.x-pixelStart.x);
            let lineW=Math.sqrt(Math.pow(pixelEnd.y-pixelStart.y,2) + Math.pow(pixelEnd.x-pixelStart.x,2));

            let x= Math.abs((pixelEnd.x-pixelStart.x)/lineW*distance);
            let y= Math.abs((pixelEnd.y-pixelStart.y)/lineW*distance);
                //判断象限
            if(pixelEnd.x<pixelStart.x && pixelEnd.y>pixelStart.y){//第一象限
                arrowPoint.x=pixelEnd.x+x;
                arrowPoint.y=pixelEnd.y-y;

            }
            if(pixelEnd.x>pixelStart.x && pixelEnd.y>pixelStart.y){//第二象限
                arrowPoint.x=pixelEnd.x-x;
                arrowPoint.y=pixelEnd.y-y;

            }
            if(pixelEnd.x>pixelStart.x && pixelEnd.y<pixelStart.y){//第三象限
                arrowPoint.x=pixelEnd.x-x;
                arrowPoint.y=pixelEnd.y+y;
            }
            if(pixelEnd.x<pixelStart.x && pixelEnd.y<pixelStart.y){//第四象限
                arrowPoint.x=pixelEnd.x+x;
                arrowPoint.y=pixelEnd.y+y;
            }
        }

        return arrowPoint;
    },
    //根据角度计算距离该点一定距离的点位置
    pointPosByinstance(p,angle,ins,positive){
        let res={x:0,y:0};
        if(angle == 0){ //垂直第一,四象限
            res.x=p.x + (positive?ins:-ins);
            res.y=p.y;
        }
        else if(angle == Math.PI/2 || angle == -Math.PI/2 * 3){//垂直在第一,二象限
            res.x=p.x;
            res.y=p.y + (positive?-ins:+ins);
        }
        else if(angle == Math.PI || angle == -Math.PI){//垂直在第二,三象限
            res.x=p.x + (positive?-ins:ins);
            res.y=p.y
        }
        else if(angle == Math.PI/2 * 3 || angle == -Math.PI/2){//垂直在第三,四象限
            res.x=p.x;
            res.y=p.y + (positive?ins:-ins);
        }

        return res;
    },
    //判断当前鼠标是否在某个路径上
    inPath(){
        let s=this;
        d3.select(this.canvas[0]).on('mousemove',function(){
            
            for(let i=0;i<s.points.length;i++){
                let point=s.points[i],
                pos=s.computePos(point)
                s2=Math.pow(s.radius,2),
                dx = pos.dx,
                dy = pos.dy,
          
                d2 = dx * dx + dy * dy;
     
                if (d2 < s2) {
                    point.active=true;
                }else{
                    point.active=false;
                }

                //操作栏选中索引
                let index=-1;
                point.arcIndex=index;
                for(let j=0;j<(point.opts || []).length;j++){
                    if(s.blnOpiton(point.opts[j],point)){
                        index=j;break;
                    }
                }
                
                point.arcIndex=index;

            }
            
            if(_.find(s.points,p=>p.active || p.arcIndex>=0)){
                $('body')[0].style.cursor='pointer';
            }else{
                $('body')[0].style.cursor='default';
            }
            s.ticked();
        });
    },

    //canvas鼠标单击事件
    regPosClick(){
        $(this.canvas[0]).on('click',(e)=>{
            _.each(this.points,p=>p.clicked=false);
            //判断鼠标单击节点数据
            let point = this.blnInPoint(e);

            if (point) {
                point.clicked=!point.clicked;
                if(!point.anmalcomplete) point.anmalTime=(new Date()).getTime();//当前动画开始时间
            }

            //判断鼠标单击节点操作栏
            let clickP=null,optIndex=-1;
            _.each(this.points,p=>{
                for(let j=0;j<(p.opts || []).length;j++){
                    if(this.blnOpiton(p.opts[j],p,e)){
                        clickP=p;
                        optIndex=j;break;
                    }
                }
            });


            if(clickP && optIndex>=0){

                switch(optIndex){
                    case 0: //删除
                        let data=[];
                        this.recursionChild(clickP,data);
                        _.each(data,c=>{c.blnHide=true;c.blnExtend=false;});
                        clickP.blnExtend=false;
                        clickP.blnHide=true;
                        //设置删除点关联点为不完全展开状态
                        _.each(this.edges,e=>{
                            if(e.source.id==clickP.id){
                                e.target.blnExtend=false;
                            }else if(e.target.id==clickP.id){
                                e.source.blnExtend=false;
                            }
                        });

                        break;
                    case 1://展示子节点
                        if(clickP.blnExtend){//已展开则隐藏 
                            let data=[];
                            this.recursionChild(clickP,data);
                            _.each(data,c=>{c.blnHide=true;c.blnExtend=false;});
                            clickP.blnExtend=false;
                        }else if(clickP.childs && clickP.childs.length>0){//子节点被隐藏则重新显示
                            _.each(clickP.childs,c=>c.blnHide=false);
                            clickP.blnExtend=true;
                        }else if (clickP) {
                            this.showChildPoint(clickP);
                        }
                        break;
                    case 2://解锁
                        if(clickP.parent){return;}//父节点不用解锁
                        clickP.x=clickP.fx;
                        clickP.x=clickP.fy;
                        clickP.fx=null;
                        clickP.fy=null;
                        break;
                }
            }

        });
    },
    //节点双击事件
    regPosDblclick(){
        let s=this;
        d3.select(this.canvas[0]).on('dblclick',()=>{
            let point = this.blnInPoint();
            if(!point) return;
            //if(point.root)return; //根节点
            if(point.blnExtend){//已展开则隐藏(需要递归所有子节点)
                let data = [];
                this.recursionChild(point,data);
                _.each(data,c=>{c.blnHide=true;c.blnExtend=false;});
                point.blnExtend=false;
            }else if(point.childs && point.childs.length>0){//子节点被隐藏则重新显示
                _.each(point.childs,c=>c.blnHide=false);
                point.blnExtend=true;
            }else if (point) {
               this.showChildPoint(point);
            }

           
        });
    },
    //递归子节点
    recursionChild(p,arr){
      _.each(p.childs,c=>{
        if(c.childs && c.childs.length>0){
            arr.push(c);
            this.recursionChild(c,arr);
        }else{
            arr.push(c);
        }
      });
    },
    //显示子节点
    showChildPoint(point){
        this.$store.dispatch(RelationSecond,{
            task_target_type:point.typeCode,
            account_type:point.account_type,
            keyword:point.keyword,
        }).then(res=>{
            let data=res.biz_body.data;
            let macs=data.macs,
                mobiles=data.mobiles,
                customers=data.customers,
                virtuals=data.virtuals;

            let childs=[
                ...this.converData('vid',virtuals),
                ...this.converData('mac',macs),
                ...this.converData('cert',customers),
                ...this.converData('mobile',mobiles),
                ];

            let distinctData =this.distinctPoint(point,childs);
            distinctData.points=this.pointPos(point,distinctData.points);

            this.points=[...this.points,...distinctData.points];
            this.simulation.nodes(this.points);

            this.edges=[...this.edges,...distinctData.edges,..._.map(distinctData.points,c=>{
                return {"source": point.id , "target": c.id, text:c.type}
            })];
            

            this.simulation.force("link").links(this.edges).distance(200);

            this.simulation.alphaTarget(0.3).restart();

            point.blnExtend=true;

            //设置子节点引用
            point.childs=distinctData.points;
        });
    },
    //判断当前鼠标是否进入节点外围操作区域
    blnOpiton(arc,p,e){
        let res=false;
        let s=this;
        let startAngle=arc.startAngle,
            endAngle=arc.endAngle
            innerRadius=arc.innerRadius,
            outerRadius=arc.outerRadius;
    

        //判断边长是否在操作区域内
        let pos=s.computePos(p,e);
        let dx = pos.dx;
        let dy = pos.dy;
        let detal=Math.atan2(dy,dx)+Math.PI/2;
        if(Math.atan2(dy,dx)>-Math.PI && Math.atan2(dy,dx)< -Math.PI/2){
           detal = Math.PI + Math.atan2(dy,dx) + Math.PI/2*3;
           
        }

   
        let lineW=Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));

  

        if(lineW>=arc.innerRadius  && lineW<=arc.outerRadius && startAngle <= detal && endAngle >= detal){
            res=true;
        }

        return res;

    },
    //计算当前鼠标与节点的位置
    computePos(p,e){
        e=e ||  {clientX:-100000,clientY:-100000};
        let s=this;
        let offset =$(s.$el).offset();
        let parentOffset=$(s.$el).parent().offset();
        let clientX=d3.event?d3.event.clientX:e.clientX,
            clientY=d3.event?d3.event.clientY:e.clientY;
        s.offset =offset;


        let rect=this.canvas[0].getBoundingClientRect();

        let dx = (s.transform.invertX(clientX)-s.transform.invertX(s.translate.x)) - p.x -rect.left;
        let dy = (s.transform.invertY(clientY)-s.transform.invertY(s.translate.y)) - p.y -rect.top ;

        return {dx,dy};
    },
    //判断鼠标是否在节点范围内
    blnInPoint(e){
        let s=this;
        let res=null;
        for(let i=0;i<s.points.length;i++){
            let point=s.points[i],
            pos=s.computePos(point,e)
            s2=Math.pow(s.radius,2),
            dx = pos.dx,
            dy = pos.dy,

            d2 = dx * dx + dy * dy;
            
            if (d2 < s2) {
               res = point;break;
            }
        }

        return res;
    },
    //搜索数据
    Search(){
      if(this.blnSearch){return;}
      if(!this.serachInfo.code){tool.info('请输入正确的关键字搜索条件!');return;}
      
      this.blnSearch=true;
      this.$store.dispatch(RelationSecond,{
          task_target_type:this.serachInfo.code,
          account_type:'',
          keyword:this.searchKey
      }).then(res=>{
     
        this.blnSearch=false;
        this.points=[];

        let data=res.biz_body.data;


        let root={id:1,x:0,y:0,active:false,parent:true,blnExtend:true,root:true,color:'#ffd86e',borderCol:'#edba39',text:this.serachInfo.val}
        let macs=data.macs,
            mobiles=data.mobiles,
            customers=data.customers,
            virtuals=data.virtuals;

        let childs=[
            ...this.converData('vid',virtuals),
            ...this.converData('mac',macs),
            ...this.converData('cert',customers),
            ...this.converData('mobile',mobiles),
            ];
        
        childs=this.pointPos(root,childs);

        root.childs=childs;
        this.points=[root,...childs];
        this.simulation.nodes(this.points);

        this.edges=_.map(childs,c=>{
            return {"source": root.id , "target": c.id, text:c.type}
        });
        

        this.simulation.force("link").links(this.edges).distance(200);

        this.simulation.alphaTarget(0.3).restart();

        //设置主节点不可受到碰撞影响
        // setTimeout(()=>{
        //     let parentPs = _.filter(this.points,p=>p.parent);
        //     _.each(parentPs,p=>{
        //         p.fx=p.x;
        //         p.fy=p.y;
        //     });
        // },1000);
      });
    },
    //去除重复点
    distinctPoint(parent,childs){
        let edges=[];
        let addPoints = _.filter(childs,c=>{
            let repeatPoint=_.find(this.points,p=>p.id==c.id);
            if(repeatPoint){
                repeatPoint.blnHide=false;repeatPoint.blnExtend=true;
                edges.push({"source": parent.id , "target": repeatPoint.id, text:repeatPoint.type});
            }
            return !repeatPoint;
        });

   
        edges=_.filter(edges,e=>{
            return  !_.find(this.edges,p=>{
                return (p.source.id==e.source || p.source.id==e.target) && 
                       (p.target.id==e.source || p.target.id==e.target)
            });
        })


        return {points:addPoints,edges}
    },
    //转化服务器数据到图表数据
    converData(type,data){
        let res=[];
        switch(type){
            case 'vid':
                res=_.map(data,(v,i)=>{
                    return {
                        id:v.id,
                        x:0,y:0,
                        active:false,
                        parent:false,
                        text:`${v.account_type_note}(${v.account})`,
                        type:'虚拟身份',
                        keyword:v.account,
                        typeCode:'vid',
                        color:this.typesParam['vid'].color,
                        account_type:v.account_type
                    }
                });
          
                break;
            case 'mac':
                res=_.map(data,(v,i)=>{
                    return {
                        id:v.id,
                        x:0,y:0,
                        active:false,
                        parent:false,
                        text:`${v.mac}`,
                        type:'MAC',
                        keyword:v.mac,
                        typeCode:'mac',
                        color:this.typesParam['mac'].color,
                        account_type:''
                    }
                });
                break;
            case 'cert':
                res=_.map(data,(v,i)=>{
                    return {
                        id:v.id,
                        x:0,y:0,
                        active:false,
                        parent:false,
                        text:`${v.customer_name}`,
                        type:'身份',
                        keyword:v.certificate_code,
                        typeCode:'cert',
                        color:this.typesParam['cert'].color,
                        account_type:''
                    }
                });
                break;
            case 'mobile':
                res=_.map(data,(v,i)=>{
                    return {
                        id:v.id,
                        x:0,y:0,
                        active:false,
                        parent:false,
                        text:`${v.mobile}`,
                        type:'Mobile',
                        keyword:v.mac,
                        typeCode:'mobile',
                        color:this.typesParam['mobile'].color,
                        account_type:''
                    }
                });
                break;

        }

        return res;
    },
    //切换显示类型
    toggleType(type){
        let index=this.showTypes.indexOf(type);
        if(index>=0){
            this.showTypes.splice(index,1);
        }else{
            this.showTypes.push(type);
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
      
      if(hanziReg.test(v)){return res;}
      if(macReg.test(v)){res.push({name:'MAC',val:'mac'})}
      if(certificateReg.test(v)){res.push({name:'身份证',val:'cert'})}
      if(phoneReg.test(v)){res.push({name:'手机号',val:'mobile'})}
      
      //如果没匹配则认为是虚拟身份
      if(res.length<=0){
        res.push({name:'虚拟身份',val:'vid'})
      }

      return res;
    },
  }
  
}
</script>

<style scoped lang="less">
@import "../css/variables.less";
.Relation{width:100%;height:100%;}

.Relation  .option_bar{
    background-color:rgba(47, 51, 65, 0.3);padding:10px;border-radius:5px;margin-top:5px;
    text-align:left;position:absolute;left:10px;right:10px;
}

.Relation .fliter_bar{
    position:absolute;top:65px;left: 10px;right: 10px;text-align:left;
}

.Relation .fliter_bar .fliter_item{font-style:italic;}
.Relation .fliter_bar .fliter_item:hover{color:@Font_Hover_Col;cursor:pointer;}
.Relation .fliter_bar .fliter_item.active{color:@Font_Hover_Col;}
</style>
