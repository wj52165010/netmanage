<!-- 最短路径页面组件 -->
<template>
    <div class="ShortPath">
        <!--加载中标识-->
        <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index:100;">
            <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;"><i class="fa fa-spinner fa-pulse" style="color:#98e32c;"></i></div></div>
        </div>
        <!--搜索栏-->
        <div class="Search_bar" :style="{left:blnShowHistoryPop?'310px':'10px'}">
            <div class="option">
                <div style="display:inline-block;width:200px;">
                    <el-input placeholder="关键字1" v-model="keyOne" />
                </div>
                <div style="display:inline-block;width:200px;">
                    <el-input placeholder="关键字2" v-model="keyTwo" />
                </div>

                <button type="button" class="btn btn-default" style="float:right;background-color:#20a1ff;color:white;" @click="search()">
                    <span v-show="!blnSearch">搜 索</span>
                    <i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i>
                </button>
            </div>
        </div>

        <!--左边侧边框-->
        <div class="left_pop bound" :class="{active:blnShowHistoryPop}">
            <!--显示标签-->
            <div class="pop_lable" @click="blnShowHistoryPop=!blnShowHistoryPop">
                历史记录
            </div>
            <Scroll ref="historyPopScroll" :listen="historyData">
                <div v-for="(h,i) in historyData" class="item" @click="getTaskRes(h.task_id);curShowTaskId=h.task_id;">
                    <div class="item_span">
                        <span>关键字1:{{h.first_key}}</span>
                        <span style="float:right;">{{h.status_note || '分析中...'}}</span>
                    </div>
                    <div><span style="margin-right:10px;">关键字2:{{h.second_key}}</span><span>结果数:{{h.result}}</span></div>
                    <div>
                        创建时间:{{converTime(h.log_time)}}

                        <span class="delBtn" @click.stop="delTask(h.task_id,i)"><i class="fa fa-remove"></i></span>
                    </div>
                </div>
            </Scroll>
        </div>
        <canvas name="canvas" :id="id" :style="{left:blnShowHistoryPop?'310px':'0px',position:'absolute'}" />
    </div>
</template>

<script>
import * as d3 from 'd3'
import Scroll from 'components/scroll'

import {BODY_RESIZE,AddShortPath,GetShortPath,DelShortPath,GetShortPathRes} from '../store/mutation-types'

export default {
  name: 'ShortPath',
  components:{Scroll},
  data () {
    return {
      id:'Short'+tool.guid(),
      blnLoading:false,
      dataSubject:null,
      simulation:null,
      instances:100,
      radius:50,
      points:[],
      edges:[],
      canvas:null,
      offset:null,
      ctx:null,
      transform:d3.zoomIdentity,
      translate:{x:0,y:0},
      blnSearch:false,
      blnShowHistoryPop:false,
      historyData:[],
      curShowTaskId:0,
      curTaskData:{},
      blnDrag:false,
      keyOne:'',
      keyTwo:'',
      kind:{vid:'虚拟身份',cert:'身份证',mac:'MAC',mobile:'手机'},
      rectSize:{h:70,w:145},
      subtion:null,
      blnRect:true,
    }
  },
  watch:{
    blnShowHistoryPop(){
        let el=$(this.$el);
        if(this.blnShowHistoryPop){
            this.canvas.width=el.width() - 310;
            this.canvas.attr('width',el.width() - 310);
        }else{
            this.canvas.width=el.width();
            this.canvas.attr('width',el.width());
        }

        this.translate={x:this.canvas.width/2,y:this.canvas.height/2};

        this.ticked();
        this.simulation.alphaTarget(0.3).restart();
    },
    curTaskData(){
       
       this.bindDataListen(this.curTaskData).subscribe(v=>{
           this.dataSubject.next(v);
       });
    }
  },
  mounted(){
    let Rx=this.$store.getters.Rx;
    this.dataSubject=new Rx.Subject();
    this.subtion = this.dataSubject.subscribe(this.redraw);

    let el=$(this.$el);
    this.canvas=el.find(`canvas[name="canvas"]`);
    setTimeout(()=>{
        this.offset=el.offset();
        this.canvas.width=el.width();
        this.canvas.height=el.height();
        this.canvas.attr('width',this.canvas.width);
        this.canvas.attr('height',this.canvas.height);

        this.ctx=this.canvas[0].getContext('2d');

        this.initDraw();
        this.initDrag();
        //获取历史记录
        this.getHistory();

        this.translate={x:this.canvas.width/2,y:this.canvas.height/2};

        //监听任务回调事件
        let socket = io(ser.url);
        socket.on('ShortPath', (data)=> {
            let d=eval('('+data+')');
            //替换状态
            if(this.curShowTaskId!=data.task_id) return;
            this.getTaskRes(this.curShowTaskId);
        });
    },100);

    this.$store.commit(BODY_RESIZE,()=>{
        let el=$(this.$el);
        if(this.blnShowHistoryPop){
            this.canvas.width=el.width() - 310;
            this.canvas.attr('width',el.width() - 310);
        }else{
            this.canvas.width=el.width();
            this.canvas.attr('width',el.width());
        }

        this.translate={x:this.canvas.width/2,y:this.canvas.height/2};

        this.canvas.height=el.height();
        this.canvas.attr('height',el.height());

        this.ticked();
        if(!this.simulation) return;
        this.simulation.alphaTarget(0.3).restart();
    });
  },
  destroyed(){
    this.simulation.stop();
    this.subtion.unsubscribe();
    this.subtion=null;
  },
  methods:{
    //转化时间
    converTime(t){
        return tool.DateByTimestamp(t,'yyyy-MM-dd hh:mm:ss');
    },
    //初始化画布力图控件
    initDraw(){
        let s=this;
        var simulation =this.simulation = d3.forceSimulation(this.points)
            // .force("x", d3.forceX((d,i)=>{return d.x;}))
            // .force("y", d3.forceY((d,i)=>{return d.y;}))
            .force("link", d3.forceLink().distance(s.instances).id(function(d) { return d.id; }))
            .force('manybody',d3.forceManyBody())
            .force("collide", d3.forceCollide().radius(function(d) { return s.radius*2 ; }).strength(1))
            .on("tick", s.ticked);
    },
    ticked(){
        if(!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw();
    },
    //画
    draw(){
        this.ctx.save();
        this.ctx.translate(this.translate.x,this.translate.y);

        //画节点连线
        _.each(this.edges,e=>{
            this.drawLine(e);
        });

        //画节点
        _.each(this.points,(p,i)=>{
            let step=250;
            if(i==0){ //起点
                p.x=-this.translate.x + step;p.y=0;
            }else if(i==1){ //终点
                p.x=this.canvas.width - this.translate.x -step;p.y=0;
            }
            //this.drawCirclePath(p.x,p.y,p.radius || this.radius,p.color)
            this.drawRect(p,true);
        });

        //画描述文字
        //_.each(this.points,this.drawText);

        this.ctx.restore();
    },
    //画圆节点路径
    drawCirclePath(x,y,r,color){
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x,y,r,0,2*Math.PI);
        this.ctx.fillStyle =color || '#5f52a1';
        this.ctx.fill();
        this.ctx.restore();
    },
    //画矩形节点路径
    drawRect(p,flag){
        let ctx=this.ctx,size=this.rectSize;
        ctx.save();
        
        this.drawRadiusRect(p.x-size.w/2,p.y-size.h/2,size.w,size.h,10);

        ctx.lineWidth=2;
        let storeColor=d3.color(p.color || '#5f52a1').darker(0.5);
        storeColor.opacity=0.7
        ctx.strokeStyle=storeColor;
        let colorBg=p.blnChild?'#ebedee':d3.color(p.color || '#5f52a1');

        ctx.fillStyle=colorBg;
        
        ctx.fill();
        ctx.stroke();
        ctx.clip();


        if(flag){
          //如果是子节点加个颜色框
          if(p.blnChild){
            ctx.fillStyle =p.color;  //对画布填充颜色  
            ctx.fillRect(p.x-this.rectSize.w/2, p.y-this.rectSize.h/2, this.rectSize.w,30);
          }

          this.drawText(p);
        }

        ctx.restore();
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
    //画节点连线
    drawLine(p){
    
        let lineW = this.pointRectByDetal(p.source,p.target)

        let start=this.pointPosByR(p.target,p.source,lineW),
              end=this.pointPosByR(p.source,p.target,lineW);

        // let start=this.pointPosByR(p.target,p.source,p.target.radius || this.radius),
        //    end=this.pointPosByR(p.source,p.target,p.target.radius || this.radius);

        
        if(p.dir==0){
        
            this.drawArrow(start,end);
        }else if(p.dir==1){

            this.drawArrow(end,start);
        }else{
            this.drawArrow(start,end);
            this.drawArrow(end,start);
        }
        //画线
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(start.x,start.y);
        this.ctx.lineTo(end.x,end.y);
        this.ctx.lineWidth=2;
        this.ctx.strokeStyle='#8B8378';
        this.ctx.stroke();
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
    //根据斜率判断线与矩形边框之间的焦点长度
    pointRectByDetal(pStart,pEnd){
        if(pStart.y==pEnd.y){//没有斜率
            return this.rectSize.w/2;
        }

        let detal=(pEnd.y-pStart.y)/(pEnd.x-pStart.x);//斜率
        let angle=Math.atan(detal);
        let constB=this.rectSize.w/2;

        if(angle<Math.PI/4 && 0<=angle){
            constB=this.rectSize.w/2;
            return constB/Math.cos(angle);
        }
        if(angle>=Math.PI/4 && angle < Math.PI/2){
            constB=this.rectSize.h/2;
            return constB/Math.sin(angle);
        }
    
        if(angle>=-Math.PI/2 && angle < -Math.PI/4){
            constB=this.rectSize.h/2;
            return constB/Math.sin(angle);
        }

        if(angle>=-Math.PI/4 && angle < 0){
            constB=this.rectSize.w/2;
            return constB/Math.cos(angle);
        }

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
            if(pixelEnd.x<pixelStart.x && pixelEnd.y>pixelStart.y){//第二象限
                arrowPoint.x=pixelEnd.x+x;
                arrowPoint.y=pixelEnd.y-y;

            }
            if(pixelEnd.x>pixelStart.x && pixelEnd.y>pixelStart.y){//第一象限
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
    //获取历史记录信息
    getHistory(){
        this.$store.dispatch(GetShortPath).then(res=>{
            this.historyData=res.biz_body;
            this.blnShowHistoryPop=this.historyData.length>0;
        });
    },

    //绑定当前显示任务数据
    bindDataListen(bindData){
        //bindData.paths=[bindData.paths[0].splice(0,2)] //测试数据
    
        let Rx=this.$store.getters.Rx;
        let startP={id:bindData.start_node.data_id,x:0,y:0,text:'条件1'};
        let endP={id:bindData.end_node.data_id,x:0,y:0,text:'条件2'};

        let obs = _.map(bindData.paths,path=>{
            let lines=Rx.Observable.from(_.filter(path,p=>p.type=='line'));
            let res = Rx.Observable.from([..._.filter(path,p=>p.type=='data'),endP]);

            return resScan=res.scan((acc,one)=>{
                    let sp = acc.pop();
                    acc.push({
                        "source": sp.id , "target": one.id 
                    });
                    acc.push(one);

                    return acc;
                },[startP]).map(v=>{
                    let data =_.filter(v,d=>d.source!=undefined);
                    return data[data.length-1];
                }).zip(lines).map(v=>{
                    let d=v[0],l=v[1];
                    
                    d.dir=l.value =='->'?0:1;

                    return d;
                }).scan((acc,one)=>{
                    acc.push(one);
                    return acc;
                },[]).last();
        });

        if(bindData.paths.length>0){
            return Rx.Observable.combineLatest(...obs);
        }else{
            return Rx.Observable.combineLatest([[]],[[]]);
        }
    },
    //刷新画布
    redraw(v){
        this.curTaskData.start_node.root=true;
        this.curTaskData.end_node.root=true;
        let startP={id:this.curTaskData.start_node.data_id,x:0,y:0,text:this.curTaskData.start_node.key};
        let endP={id:this.curTaskData.end_node.data_id,x:0,y:0,text:this.curTaskData.end_node.key};
        let childs=_.chain(this.curTaskData.paths).flatten().filter(r=>r.type=='data').map(r=>{r.x=0;r.y=0;r.radius=30;r.color='#009a44'; return r;}).value(); 

        this.points=[
            startP,
            endP,
            ...childs
        ];

        
        this.edges=_.flatten(v);

        //判断起始节点是否需要连线
        if(this.curTaskData.is_StartToEnd){
            this.edges.push({"source": startP.id , "target": endP.id,dir:2,starttoend:true}); 
        }
       

        this.simulation.nodes(this.points);

        this.simulation.force("link").links(this.edges).distance((d)=>{
            if(d.starttoend){
                return (this.canvas.width - this.translate.x -250)*2;
            }
            
            return this.instances;
        });

        this.simulation.alphaTarget(0.3).restart();
        
    
    },
    //画节点描述信息
    drawText(p){
        if(!p.text) return;
        let ctx=this.ctx;
        ctx.save();
        ctx.font="normal 12px 微软雅黑";
        let rectSize=this.rectSize;

        if(this.blnRect){
            let rect={w:ctx.measureText(p.text).width,h:ctx.measureText('W').width};
            ctx.fillStyle='white';
            ctx.textBaseline='middle';
            if(p.blnChild){
                ctx.fillText(p.text,p.x-rectSize.w/2 + 10,p.y-rectSize.h/2+15);

                ctx.fillStyle='black';
                ctx.fillText(p.subText,p.x-rectSize.w/2 + 10,p.y-rectSize.h/2+15 + rect.h+20);
            }else{
                ctx.fillText(p.text,p.x-rect.w/2,p.y);
            }
        }else{
            let rect={w:ctx.measureText(p.text+p.subText).width,h:ctx.measureText('W').width};
            ctx.fillStyle='black';
            ctx.textBaseline='middle';
            ctx.fillText(p.text,p.x-rect.w/2,p.y);
        }
        


        this.ctx.restore();

    },
    //获取指定任务分析结果数据
    getTaskRes(taskid){
        let s=this;
        this.$store.dispatch(GetShortPathRes,{task_id:taskid}).then(res=>{
   
            if(!tool.msg(res)) return;

            // res.biz_body.paths[0].splice(2,1);
            // res.biz_body.paths[0].push({type:'line',value:"->"});
            res.biz_body.paths=_.map(res.biz_body.paths,arr=>{

                return _.map(arr,a=>{a.id=a._id;a.text=(a.account_type_note || a.key_type_note);a.subText=`${a.key}`;a.blnChild=true;return a;})
            });

            this.curTaskData=res.biz_body;

            //console.log(tool.Clone(this.curTaskData));
        });

        // this.curTaskData={
        //     start_node:{id:0,x:0,y:0},
        //     end_node:{id:1,x:0,y:0},
        //     paths:[
        //         [
        //             {id:3,type:'line',value:"<-"},
        //             {id:2,type:'data'},
        //             {id:3,type:'line',value:"<-"},
        //             {id:4,type:'data'},
        //             {id:3,type:'line',value:"->"},
        //             {id:5,type:'data'},
        //             {id:3,type:'line',value:"->"},
        //         ],
        //         [
        //             {id:3,type:'line',value:"->"},
        //             {id:6,type:'data'},
        //             {id:3,type:'line',value:"->"},
        //             {id:7,type:'data'},
        //             {id:3,type:'line',value:"->"},
        //         ],
        //         [
        //             {id:3,type:'line',value:"->"},
        //             {id:8,type:'data'},
        //             {id:3,type:'line',value:"->"},
        //             {id:9,type:'data'},
        //             {id:3,type:'line',value:"<-"},
        //         ],
        //     ]
        // };
                
    },
    search(){
       if(!this.keyOne || !this.keyTwo){tool.info('关键字必填!'); return;}

       this.blnLoading=true;
       this.$store.dispatch(AddShortPath,{
           first_key:this.keyOne,
           second_key:this.keyTwo
       }).then(res=>{
           this.blnLoading=false;
           if(!tool.msg(res,`查询成功,${res.biz_body[0] && res.biz_body[0].task_status=='aborted'?'任务异常!':'任务正在创建中...!'}`)) return;

           this.historyData.push(res.biz_body[0]);
           this.curTaskData=res.biz_body[0];
           this.curShowTaskId=this.curTaskData.task_id;
       });
    },
    //删除任务
    delTask(id,index){
        this.$store.dispatch(DelShortPath,{task_id:id}).then(res=>{
            if(!tool.msg(res,'删除成功!')) return;
            this.historyData.splice(index,1);
            this.curShowTaskId=0;
        });
    },
    //初始化画布拖动功能
    initDrag(){
        var canvas = d3.select("#"+this.id);
        canvas
        .call(d3.drag().subject(this.dragsubject)
        .on("start", this.dragstarted)
        .on("drag", this.dragged)
        .on("end", this.dragended))
        .call(this.ticked)
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

            dx = (x-s.transform.invertX(s.translate.x)) - point.x - s.canvas.offset().left;
            dy = (y-s.transform.invertY(s.translate.y)) - point.y;

            if(!s.blnRect){
                let radius =point.radius || s.radius;
                if (dx * dx + dy * dy < radius * radius) {
                res=point;break;
                }
            }else{
                //画节点路径(矩形)
                let size=s.rectSize;
                s.drawRadiusRect(point.x-size.w/2,point.y-size.h/2,size.w,size.h,10);
                let cx =(x-s.transform.invertX(s.translate.x)) - s.canvas.offset().left;
                let cy =(y-s.transform.invertY(s.translate.y));
                if(s.ctx.isPointInPath(cx,cy)){
                     res=point;break;
                }
            }
        }
        return  res; 
    },
    dragstarted(){
        // let s=this;
        // this.simulation.force("collide", d3.forceCollide().radius(function(d) { return s.radius ; }).strength(1));
        this.simulation.alphaTarget(0.3).restart();
    },
    dragged(){
        if(d3.event.subject.x==undefined){
      
           this.translate.x+=d3.event.dx;
           this.translate.y+=d3.event.dy;
        }else if(!d3.event.subject.root && d3.event.subject.type){//根节点不允许拖动

            d3.event.subject.fx = d3.event.x;
            d3.event.subject.fy = d3.event.y;
        }
    },
    dragended(){
        this.simulation.alphaTarget(0);

        // d3.event.subject.fx = null;
        // d3.event.subject.fy = null;
        
    },
  }
}
</script>

<style scoped lang="less">
  @import "../css/variables.less";
  .ShortPath{width:100%;height:100%;position:relative;}

  .ShortPath .Search_bar{position:absolute;top:10px;padding:10px;left:10px;right:10px;.trans();z-index:1000;}

  .ShortPath .Search_bar .option{
    background-color:rgba(47, 51, 65, 0.3);padding:10px;border-radius:5px;margin-top:5px;
    width:100%;text-align:left;
  }


  //左边侧边框
  @bgColor:fade(@HeaderBgCol,90%);
  @popW:300px;
  .ShortPath .left_pop{
    position:absolute;left:-@popW;top:14px;bottom:10px;z-index:100;width:@popW;background-color:@bgColor !important;
    border-top-right-radius:5px;border-bottom-right-radius:5px;color:white;text-align:left;
  }

  .ShortPath .left_pop.active{left:0px;}

  .ShortPath .left_pop .pop_lable{
    width:30px;position:absolute;top:50%;margin-top:-40px;
    background-color:@bgColor;color:white;
    font-size:12px;padding:10px 8px;border-top-right-radius:5px;border-bottom-right-radius:5px;
    right:-30px;
    cursor:pointer;.trans();
  }

  .ShortPath .left_pop .pop_lable:hover{background-color:@Font_Hover_Col;}

  .ShortPath .left_pop .item{font-size:12px;padding:10px;.trans();.border('bottom');}
  .ShortPath .left_pop .item:hover{background-color:@Font_Hover_Col;cursor:pointer;}
  .ShortPath .left_pop .item .child{margin-bottom:10px;}
  .ShortPath .left_pop .item .item_type{
    padding:2px 8px;position:relative;display:inline-block;
  }

  .ShortPath .left_pop .item.active .bottom_right:before,
  .ShortPath .left_pop .item.active .bottom_right:after,
  .ShortPath .left_pop .item.active .top_left:after,
  .ShortPath .left_pop .item.active .top_left:before,
  .ShortPath .left_pop .item:hover .bottom_right:before,
  .ShortPath .left_pop .item:hover .bottom_right:after,
  .ShortPath .left_pop .item:hover .top_left:after,
  .ShortPath .left_pop .item:hover .top_left:before{background:@bgColor;}

  @delBtnSize:20px;
  .ShortPath .left_pop .delBtn{
      cursor:pointer;
      margin-right:10px;font-size:10px;width:@delBtnSize;height:@delBtnSize;line-height:@delBtnSize;float:right;border-radius:5px;background-color:#20a1ff;text-align:center;font-size:12px;
    }
.ShortPath .left_pop .delBtn:hover{background-color:#ff7733;}
</style>
