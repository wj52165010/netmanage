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
            <div class="fliter_item" v-for="(t,key) in typesParam"  @click="toggleType(key)">
               <i :class="t.icon" :style="{color:t.color}"></i> 
               <span style="font-size:12px;">{{t.name}}</span>
               <i class="fa fa-square-o" style="float:right;margin-top:5px;" v-show="showTypes.indexOf(key)<0" ></i>
               <i class="fa fa-check-square-o" v-show="showTypes.indexOf(key)>=0" :class="{active:showTypes.indexOf(key)>=0}" style="float:right;margin-top:5px;"></i>
            </div>
            
        </div>
        <canvas :id="id" @click="regPosClick($event)"></canvas>
        <!--提示信息-->
        <div  class="tip_pop" :id="tipId" :style="{top:tipTop+'px',left:tipLeft+'px'}">{{tipInfo}}</div>
    </div>
</template>

<script>
import {RelationSecond} from '../store/mutation-types'
import SearchDropdown from 'components/SearchDropdown'
import clipboard from 'clipboard-polyfill'

import * as d3 from 'd3'
export default {
  name: 'Relation',
  props:['searchVal'],
  components:{SearchDropdown},
  data () {
    return {
      id:'relation_'+tool.guid(),
      tipId:'tip_'+tool.guid(),
      tipDom:null,
      blnSearch:false,
      simulation:null,
      canvas:null,//画布对象
      ctx:null,//画布上下文对象
      radius:30,//关系点半径
      instances:250,//节点之间的距离
      points:[],//[{x:0,y:0,active:false}],//画布上点集合数据
      edges:[],
      translate:{},//画布坐标转换地址
      transform:d3.zoomIdentity,
      offset:{},//当前容器偏移量
      icon:null,//图片对象
      iconExtend:null,//扩展图片对象
      iconPin:null,//定位图片对象
      iconStar:null,//五角星图标
      iconWarn:null,//警告图标
      iconWarnYellow:null,//黄色警告
      iconLoading:null,//加载中图标
      iconPaste:null,//粘贴图标
      searchKey:'',//搜索关键字
      serachInfo:{color:'gray',val:'',code:''},//搜索类型提示信息
      showTypes:['cert','mac','mobile','vid','start'],//当前显示的类型
      typesParam:{
          'cert':{color:'#0168b7',name:'身份证',icon:'fa fa-square'},
          'mac':{color:'#5f52a1',name:'MAC',icon:'fa fa-square'},
          'mobile':{color:'#009a44',name:'手机号',icon:'fa fa-square'},
          'vid':{color:'#b37d47',name:'虚拟身份',icon:'fa fa-square'},
          'start':{color:'#e74c3c',name:'起点',icon:'fa fa-star'}
      },
      rectSize:{h:70,w:165},
      opionH:30,//操作栏高度
      opionSpace:20,//操作栏之间的间隔
      roundRadius:10,//矩形圆角弧度
      rectLineWidth:5,//矩形边框宽度
      tipTop:-1000,
      tipLeft:-1000,
      tipInfo:'',
      curShowTipId:'',//当前显示提示信息所属节点ID
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
            this.showTypes.indexOf(p.typeCode)>=0?p.typeHide=false:p.typeHide=true;
        });

        this.ticked();
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
        //this.regPosClick();
        //this.regPosDblclick();

        if(this.searchVal){this.searchKey=this.searchVal;this.$nextTick(()=>{this.Search()});}
    },100);
    

    //加载图片
    this.icon = new Image(); //定义一个图片对象
    this.icon.src = 'static/icons-remove.png';
    this.iconExtend = new Image(); //定义一个图片对象
    this.iconExtend.src='static/icons-extend.png'; 
    this.iconPin=new Image();
    this.iconPin.src='static/icons-pin.png';
    this.iconStar=new Image();
    this.iconStar.src='static/icons-star.png';
    this.iconWarn=new Image();
    this.iconWarn.src='static/icons-warn.png';
    this.iconWarnYellow=new Image();
    this.iconWarnYellow.src="static/icons-warn-yellow.png";
    this.iconLoading=new Image();
    this.iconLoading.src='static/Loading6.gif';
    this.iconPaste=new Image();
    this.iconPaste.src='static/icons-paste.png';

    this.tipDom=$(this.$el).find(`div[id="${this.tipId}"]`);

    
  },
  methods:{
    //初始化画布力图控件
    initDraw(){
        let s=this;
        var simulation =this.simulation = d3.forceSimulation(this.points)
            // .force("x", d3.forceX((d,i)=>{return d.x;}))
            // .force("y", d3.forceY((d,i)=>{return d.y;}))
            .force("link", d3.forceLink().distance(s.instances).id(function(d) { return d.id; }))
            .force('manybody',d3.forceManyBody())
            .force("collide", d3.forceCollide().radius(function(d) { return s.rectSize.w/2 ; }).strength(1))
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
     
            let {w,h}=s.rectSize;
            if(Math.pow(dx,2)<=Math.pow(w/2,2) && Math.pow(dy,2)<=Math.pow(h/2,2)){
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
        //_.each(this.edges,this.drawLineText);
        //画节点
        //_.each(this.points,this.drawPoint);
        _.each(this.points,this.drawRect);
        //画节点描述信息
        //_.each(this.points,this.drawText);

        this.ctx.restore();
    },
    //画节点描述信息
    drawText(p){
        if(p.blnHide || p.typeHide || p.blnMoreHide) return;
        if(!p.text) return;
        let size=this.rectSize;
        let ctx=this.ctx;
        ctx.save();
        ctx.font="bold 12px 微软雅黑";
        let rect={w:ctx.measureText(p.text).width,h:ctx.measureText('W').width};

        ctx.fillStyle='white';
        ctx.textBaseline='middle';
        ctx.fillText(p.text,p.x-size.w/2+10,p.y-size.h/2+15);

        ctx.font="12px 微软雅黑";
        let rectOne={w:ctx.measureText(p.subTextOne).width,h:ctx.measureText('W').width};
        ctx.fillText(p.subTextOne,p.x-size.w/2+10,p.y-size.h/2+15+rect.h+10);

        //画复制粘贴按钮
        if(p.subTextOne){
            this.drawOption(p.x-size.w/2+10 + rectOne.w +20,p.y-size.h/2+15+rect.h+12,this.iconPaste);//画警告路径
        }

        if(p.subTextTwo){
            ctx.font="12px 微软雅黑";
            let rectOne={w:ctx.measureText(p.subTextTwo).width,h:ctx.measureText('W').width};
            ctx.fillText(p.subTextTwo,p.x-size.w/2+10,p.y-size.h/2+15+rect.h+10+rectOne.h+5);
        }

        this.ctx.restore();

    },
    //画矩形
    drawRect(p){
        if(p.blnHide || p.typeHide || p.blnMoreHide) return;
        let ctx=this.ctx,size=this.rectSize;
        ctx.save();
        
        this.drawRadiusRect(p.x-size.w/2,p.y-size.h/2,size.w,size.h,10);

        ctx.lineWidth=this.rectLineWidth;
        let storeColor=d3.color(p.color).darker(0.5);
        storeColor.opacity=0.7
        ctx.strokeStyle=storeColor;
        let colorBg=d3.color(p.color);

        // var lineGradient = ctx.createLinearGradient (p.x-size.h/2, p.y-size.h/2, p.x, p.y+size.h/2);  
        //     lineGradient.addColorStop(0, colorBg);
        //     lineGradient.addColorStop(1, colorBg);  
        //     colorBg.opacity=0.3    
        //     lineGradient.addColorStop(0.5, colorBg);  

        ctx.fillStyle=colorBg;
        
        ctx.fill();
        ctx.stroke();

        ctx.restore();

        if(p.clicked){
            let space=this.opionSpace,rectLineWidth=this.rectLineWidth,roundRadius=this.roundRadius,measure=(size.w-roundRadius*2-space*2)/3,h=this.opionH;
            // let animalH=0;
            // //设置外边框操作按钮
            // let iconAnimalScales=d3.scaleLinear().domain([0,1]).range([0,h]);//节点操作图标显示动画伸缩尺
            // let timeelspe=(new Date()).getTime()-p.anmalTime;
            // let timeDurition=100;//动画持续时间
            // if(timeelspe<=timeDurition){
            //     animalH = iconAnimalScales(d3.easeSinInOut(timeelspe/timeDurition));
            // }else{
            //    p.anmalcomplete=true;
            //    animalH=h;
            // }
            
            
            // ctx.save();
            
            // for(let i=0;i<3;i++){

            //     ctx.fillStyle=p.arcIndex==i?'#8B8378':'#c1c1c1';
            //     this.drawOptionPath(p.x-size.w/2 + roundRadius + (space + measure)*i,p.y-size.h/2- rectLineWidth/2 -animalH,measure,animalH);
            //     ctx.fill();
            //     let icon=[this.icon,this.iconExtend,this.iconPin];
            //     ctx.drawImage(icon[i],0,0,50,50,p.x-size.w/2 + roundRadius + (space + measure)*i + 10,p.y-size.h/2-animalH - rectLineWidth/2 + 5,measure -20,animalH -10);
            // }

            // ctx.restore();

            this.drawClearBtn(p.x+size.w/2,p.y-size.h/2,p.color);//画清除按钮
        }else{
            p.opts=[];
            p.arcIndex=-1;
            p.anmalcomplete=false;
        }

        if(!p.isNone){
            this.drawOption(p.x+size.w/2-15-20,p.y+size.h/2-10,p.isloading?this.iconLoading:this.iconExtend);//画展开按钮
        }

        this.drawOption(p.x+size.w/2-15,p.y+size.h/2-10,this.iconPin);//画展定位按钮

        //画警告图标
        if(p.isOver){
            this.drawOption(p.x+size.w/2-15,p.y-size.h/2 +15,this.iconWarn);//画警告路径
        }
        //画黄色警告图标
        if(p.isNone){
            this.drawOption(p.x+size.w/2-15,p.y-size.h/2 +15,this.iconWarnYellow);//画警告路径
        }
        

        //画节点描述信息
        this.drawText(p);
        //起始点画五角星
        if(p.root){
            ctx.drawImage(this.iconStar,0,0,50,50,p.x + size.w/2 - 30,p.y-size.h/2+5,20,20);
        }
        //画父节点数据过多现实的提示标签
        if(p.blnMore){
            this.drawTip(p.x + size.w/2 - 45,p.y-size.h/2+15,p.moreData.length);
        }
    },
    //画操作栏路径
    drawOptionPath(x,y,w,h){
        let ctx =this.ctx;
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.lineTo(x,y+h);
        ctx.lineTo(x+w,y+h);
        ctx.lineTo(x+w,y);
        ctx.closePath();
    },
    //画带圆角的矩形
    drawRadiusRect(x, y, w, h, r){
        let ctx=this.ctx;
        if (w < 2 * r) {r = w / 2;}
        if (h < 2 * r){ r = h / 2;}

        ctx.beginPath();
        ctx.moveTo(x+r, y);
        ctx.arcTo(x+w, y, x+w, y+h, r);
        ctx.arcTo(x+w, y+h, x, y+h, r);
        ctx.arcTo(x, y+h, x, y, r);
        ctx.arcTo(x, y, x+w, y, r);
        ctx.closePath();
    },
    //画清除按钮路径
    drawClearBtn(x,y,color){
        let ctx=this.ctx;
        ctx.beginPath();
        ctx.arc(x,y,10,0,Math.PI*2);
        ctx.fillStyle=color;
        ctx.fill();

        ctx.font="10px 微软雅黑";
        let rect={w:ctx.measureText('X').width,h:ctx.measureText('W').width};

        ctx.fillStyle='white';
        ctx.textBaseline='middle';
        ctx.fillText('X',x-rect.w/2,y);
        ctx.closePath();
    },
    //父节点过多显示的提示标签
    drawTip(x,y,text){
        let ctx=this.ctx;
        ctx.beginPath();
        ctx.arc(x,y,10,0,Math.PI*2);
        ctx.fillStyle='#e74c3c';
        ctx.fill();
        ctx.font="10px 微软雅黑";
        let rect={w:ctx.measureText(text).width,h:ctx.measureText('W').width};
        ctx.fillStyle='white';
        ctx.textBaseline='middle';
        ctx.fillText(text,x-rect.w/2,y);
        ctx.closePath();
    },
    //画操作项
    drawOption(x,y,img){
        let ctx=this.ctx,r=10;
        ctx.beginPath();
        ctx.arc(x,y,r,0,Math.PI*2);
        if(img){
            ctx.drawImage(img,0,0,50,50,x-r,y-r,1.5*r,1.5*r);
        }

        ctx.closePath();
    },
    //画点(圆)节点
    drawPoint(p){
        //是否隐藏节点
        if(p.blnHide || p.typeHide || p.blnMoreHide) return;

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

        if(p.target.blnHide || p.source.blnHide || p.source.blnMoreHide || p.target.typeHide || p.source.typeHide || p.target.blnMoreHide) return;
        let start=this.pointPosByR(p.target,p.source,this.radius),end=this.pointPosByR(p.source,p.target,this.radius);
        //画箭头
        this.drawArrow(start,end);

        //画线
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(start.x,start.y);
        this.ctx.lineTo(end.x,end.y);
        this.ctx.lineWidth=5;
        this.ctx.strokeStyle='#8B8378';
        this.ctx.stroke();
        this.ctx.restore();
    },
    //画节点连线间的提示信息
    drawLineText(p){
        if(p.target.blnHide || p.source.blnHide || p.source.blnMoreHide || p.target.typeHide || p.source.typeHide || p.target.blnMoreHide) return;
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
                pos=s.computePos(point),
                dx=pos.dx,
                dy=pos.dy,
                {w,h}=s.rectSize;
                if(Math.pow(dx,2)<=Math.pow(w/2,2) && Math.pow(dy,2)<=Math.pow(h/2,2)){
                    point.active=true;
                }else{
                    point.active=false;
                }

                //操作栏选中索引
                let index=-1;
                point.arcIndex=index;
                let res=s.blnOpiton();
                if(res.flag){
                    index=res.index;
                }
                
                point.arcIndex=index;

                //判断鼠标是否进入警告图标
                let size=s.rectSize;
                if(point.isOver || point.isNone){
                    s.drawOption(point.x+size.w/2-15,point.y-size.h/2 +15);//画警告路径
                    if(s.ctx.isPointInPath(pos.x,pos.y)) {
                        let tipW = s.tipDom.width();
                        s.tipTop=pos.py-size.h/2 -35;
                        s.tipLeft=pos.px+size.w/2-15-tipW/2-10;
                        s.curShowTipId=point.id;
                        s.tipInfo=point.isOver?'结果数太多':'暂无数据';
                    }else if(s.curShowTipId == point.id){
                        s.tipTop=-1000;
                        s.tipLeft=-1000;
                        s.curShowTipId='';
                    }
                }

                //判断是否进入复制图标
                if(point.subTextOne){
                    s.ctx.font="12px 微软雅黑";
                    let rectOne={w:s.ctx.measureText(point.subTextOne).width,h:s.ctx.measureText('W').width};
                    s.drawOption(point.x-size.w/2+10 + rectOne.w +20,point.y-size.h/2+15+rectOne.h+12);//画警告路径
                    if(s.ctx.isPointInPath(pos.x,pos.y)){
                        let tipW = s.tipDom.width();
                        s.tipTop=pos.py-size.h/2-10;
                        s.tipLeft=pos.px-size.w/2 + rectOne.w + 5;
                        s.curShowTipId=point.id;
                        s.tipInfo='复制';
                    }else if(s.curShowTipId == point.id){
                        s.tipTop=-1000;
                        s.tipLeft=-1000;
                        s.curShowTipId='';
                    }
                }

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
    regPosClick(e){

        let res=this.blnOpiton(e);

        _.each(this.points,p=>p.clicked=false);
        //判断鼠标单击节点数据
        let point = this.blnInPoint(e);
        
        if (point) {
            
            //判断点击过多标签显示隐藏数据
            let size =this.rectSize;
            this.drawTip(point.x + size.w/2 - 45,point.y-size.h/2+15);
            let {x,y} = this.computePos(point,e);
            if(this.ctx.isPointInPath(x,y)) {
                _.each(point.moreData,m=>{
                    _.find(this.points,c=>c.id==m.id).blnMoreHide=false;
                });

                return;
            }
            point.clicked=!point.clicked;
            if(!point.anmalcomplete) point.anmalTime=(new Date()).getTime();//当前动画开始时间
        }
        

        res= res.flag ?res : this.blnOpiton(e);

        //判断鼠标单击节点操作栏
        let clickP=null,optIndex=-1;
        
        if(res.flag){
            clickP=res.p;
            optIndex=res.index;
        }
        

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
                    // clickP.x=clickP.fx;
                    // clickP.x=clickP.fy;
                    clickP.fx=null;
                    clickP.fy=null;
                    break;
                case 3://复制
                    clipboard.writeText(point.subTextOne);
                    tool.info('复制成功!');
                    break;
            }
        }
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
        point.isloading=true;
        this.$store.dispatch(RelationSecond,{
            task_target_type:point.root?point.type:point.typeCode,
            account_type:point.account_type,
            keyword:point.keyword,
        }).then(res=>{
            let data=res.biz_body.data || {macs:[],mobiles:[],customers:[],virtuals:[]};
            let macs=data.macs,
                mobiles=data.mobiles,
                customers=data.customers,
                virtuals=data.virtuals;

            point.isloading=false;
            if(_.flatten(data)){tool.info('暂无数据!');return;}
            
            point.isOver=point.root?false:res.biz_body.is_over;
        

 
            let childs=[
                ...this.converData('vid',virtuals),
                ...this.converData('mac',_.filter(macs,m=>m.id!=point.id)),
                ...this.converData('cert',_.filter(customers,m=>m.id!=point.id)),
                ...this.converData('mobile',_.filter(mobiles,m=>m.id!=point.id)),
                ];

            point.isNone=true;
            let tmpChilds=_.filter(childs,c=>!_.find(this.points,p=>p.id==c.id));
            point.isNone=tmpChilds.length<=0;

            let distinctData =this.distinctPoint(point,childs);
            distinctData.points=this.pointPos(point,distinctData.points);

            this.points=[...this.points,...distinctData.points];
            this.simulation.nodes(this.points);

            this.edges=[...this.edges,...distinctData.edges,..._.map(distinctData.points,c=>{
                return {"source": point.id , "target": c.id, text:c.type}
            })];
            

            this.simulation.force("link").links(this.edges).distance(this.instances);

            this.simulation.restart();

            point.blnExtend=true;

            //设置子节点引用
            point.childs=distinctData.points;
        });
    },
    //判断当前鼠标是否进入节点外围操作区域
    blnOpiton(e){
        let res=false;
        let index=-1;
        let s=this;
        let p=_.find(s.points,p=>p.clicked);
   
        if(!p) return res;
        let size=s.rectSize;

        let space=this.opionSpace,rectLineWidth=s.rectLineWidth,roundRadius=s.roundRadius,measure=(size.w-roundRadius*2-space*2)/3,h=this.opionH;
        let {x,y} = s.computePos(p,e);

        // for(let i=0;i<3;i++){
        //     s.drawOptionPath(p.x-size.w/2 + roundRadius + (space + measure)*i,p.y-size.h/2- rectLineWidth/2 -h,measure,h);

        //     if(s.ctx.isPointInPath(x,y)) {
        //         res=true;index=i;
        //     }
        // }
        
        //判断删除按钮
        s.drawClearBtn(p.x+size.w/2,p.y-size.h/2);
      
        if(s.ctx.isPointInPath(x,y)) {
            res=true;index=0;
        }

        s.drawOption(p.x+size.w/2-15-20,p.y+size.h/2-10);//画展开按钮
        if(s.ctx.isPointInPath(x,y)) {
            res=true;index=1;
        }
        s.drawOption(p.x+size.w/2-15,p.y+size.h/2-10);//画展定位按钮
        if(s.ctx.isPointInPath(x,y)) {
            res=true;index=2;
        }

        //判断是否进入复制图标
        s.ctx.font="12px 微软雅黑";
        let rectOne={w:s.ctx.measureText(point.subTextOne).width,h:s.ctx.measureText('W').width};
        s.drawOption(point.x-size.w/2+10 + rectOne.w +20,point.y-size.h/2+15+rectOne.h+12);//画警告路径
        if(s.ctx.isPointInPath(x,y)){
            res=true;index=3;
        }

        return {flag:res,index:index,p};

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

        let x =(s.transform.invertX(clientX)-s.transform.invertX(s.translate.x)) -rect.left;
        let y =(s.transform.invertY(clientY)-s.transform.invertY(s.translate.y)) -rect.top ;

        let px=p.x + s.transform.invertX(s.translate.x);
        let py=p.y + s.transform.invertX(s.translate.y);
        return {dx,dy,x,y,px,py};
    },
    //判断鼠标是否在节点范围内
    blnInPoint(e){
        let s=this;
        let res=null;
        for(let i=0;i<s.points.length;i++){
            let point=s.points[i],
            pos=s.computePos(point,e),
            dx=pos.dx,
            dy=pos.dy,
            {w,h}=s.rectSize;
            if(Math.pow(dx,2)<=Math.pow(w/2,2) && Math.pow(dy,2)<=Math.pow(h/2,2)){
                res=point;break;
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


        let rootPointers=this.converData(this.serachInfo.code,res.biz_body.selfData);

        //return;
        let root=null;
        if(res.biz_body.selfData.length==0){tool.info('未找到相关数据!'); return;}

        if(rootPointers.length==1 && this.serachInfo.code!='vid'){
            root=rootPointers[0];
            root.type=root.typeCode;
            root.typeCode='start';
            root.root=true;
            root.blnExtend=data.length>0;
            root.parent=true;
            root.typeHide=false;
            rootPointers.splice(0,1);
        }else if(this.serachInfo.code=='vid'){
            if(rootPointers.length==1){
                root=rootPointers[0];
                rootPointers.splice(0,1);
            }else if(rootPointers.length==2){
                root=rootPointers[1];
                rootPointers.splice(0,2);
                // root.blnMore=true;
                // root.moreData=rootPointers;
            }else{
              //超过2两个则隐藏多余的部分
              root=rootPointers[0];
              rootPointers.splice(0,1);
              root.blnMore=true;
              root.moreData=rootPointers;

            }
            root.text=root.text || this.serachInfo.val;
            root.type=root.typeCode;
            root.typeCode='start';
            root.root=true;
            root.blnExtend=data.length>0;
            root.parent=true;
            root.typeHide=false;
            //构造多余的子节点数据

            _.each(rootPointers,r=>{
                r.blnMoreHide=true;
            });
        }

        //root={id:res.biz_body.selfData.id,x:0,y:0,active:false,parent:true,blnExtend:true,root:true,typeCode:'start',color:'#0168b7',borderCol:'#edba39',text:this.serachInfo.val,subTextOne:this.searchKey}
        let macs=data.macs,
            mobiles=data.mobiles,
            customers=data.customers,
            virtuals=data.virtuals;


        let childs=[
            ...rootPointers,
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
        

        this.simulation.force("link").links(this.edges).distance(this.instances);

        this.simulation.alphaTarget(0.3).restart();

        //设置主节点不可受到碰撞影响
        setTimeout(()=>{
            let parentPs = _.filter(this.points,p=>p.parent);
            _.each(parentPs,p=>{
                p.fx=p.x;
                p.fy=p.y;
            });
        },1000);

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
                        text:`${v.account_type_note || ''}`,
                        subTextOne:v.account,
                        subTextTwo:v.last_time?tool.DateByTimestamp(v.last_time,'yyyy-MM-dd'):'',
                        type:'虚拟身份',
                        keyword:v.account,
                        typeCode:'vid',
                        typeHide:!(this.showTypes.indexOf('vid')>=0),
                        color:this.typesParam['vid'].color,
                        account_type:v.account_type,
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
                        subTextOne:v.last_time || '',
                        type:'MAC',
                        keyword:v.mac,
                        typeCode:'mac',
                        typeHide:!(this.showTypes.indexOf('mac')>=0),
                        color:this.typesParam['mac'].color,
                        account_type:'',
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
                        text:`${v.certificate_type_note || ''}         ${v.customer_name || ''}`,
                        subTextOne:`${v.certificate_code}`,
                        subTextTwo:tool.DateByTimestamp(v.last_time,'yyyy-MM-dd'),
                        type:'身份',
                        keyword:v.certificate_code,
                        typeCode:'cert',
                        typeHide:!(this.showTypes.indexOf('cert')>=0),
                        color:this.typesParam['cert'].color,
                        account_type:'',
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
                        subTextOne:v.last_time,
                        type:'Mobile',
                        keyword:v.mobile,
                        typeCode:'mobile',
                        typeHide:!(this.showTypes.indexOf('mobile')>=0),
                        color:this.typesParam['mobile'].color,
                        account_type:'',
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
.Relation{width:100%;height:100%;position:relative;}

.Relation  .option_bar{
    background-color:rgba(47, 51, 65, 0.3);padding:10px;border-radius:5px;margin-top:5px;
    text-align:left;position:absolute;left:10px;right:10px;
}

.Relation .fliter_bar{
    position:absolute;top:65px;left: 10px;text-align:left;
}

.Relation .fliter_bar .fliter_item{font-style:italic;width:100px;}
.Relation .fliter_bar .fliter_item:hover{cursor:pointer;}
html{.TCol(~".Relation .fliter_bar .fliter_item:hover");}

//.Relation .fliter_bar i.active{color:@Font_Hover_Col;}
html{.TCol(~".Relation .fliter_bar i.active");}


.Relation .tip_pop{
    position:absolute;padding:5px 10px;border-radius:5px;
    font-size:12px;color:white !important;
}
html{.TCol(~".Relation .tip_pop",'bg');}
.Relation .tip_pop:before{
    content:'';
    border-top: 5px solid;
    border-right:5px solid transparent;
    border-bottom:5px solid transparent;
    border-left:5px solid transparent;
    position:absolute;
    bottom:-10px;
    left:50%;
    margin-left:-5px;
}

html{.TCol(~".Relation .tip_pop:before",'btc');}
</style>
