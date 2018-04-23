<!-- 碰撞分析详细组件 -->
<template>
    <div class="CrashDetail">
        <div class="page">
            <div class="right">
                <!--所有数据碰撞结果-->
                <div class="allData">
                    <div class="title">数据结果集</div>
                    <div class="subject">
                        <scroll ref="tagScroll" :listen="res" :store="store">
                            <template v-for="(r,i) in res">
                                <div class="tag_item" :class="{active:curTagIndex==i}" @click="tag_item(i)">
                                    <span class="number">{{i+1}}.</span> 
                                    <span class="option">
                                        <span class="option_item" v-show="false">导出</span>
                                        <span class="option_item" v-show="i>0" @click.stop="delSecondInfo(r)">删除</span>
                                    </span>
                                    <div class="content">{{r.name}}</div>
                                </div>
                                <div class="tag_item_content" :class="{fadeIn:curTagIndex==i}" style="min-height:50px;" :style="{height:'calc('+(h-31)+'px - '+res.length*30+'px)'}">
                                    <tagItem :ref="'scroll'+i" :task="r" :store="store" />
                                </div>
                            </template>
                        </scroll>
                    </div>
                </div>
            </div>
            <div class="left" name="canvan_container">
                <canvas :id="cid" class="canvas"></canvas>
                <div class="btn_lead" @click="importdata" v-show="false">导入数据集</div>

                <div class="btn_crash" style="background-color:gray;"v-show="false" title="碰撞接口尚未接入">{{blnCrashing?'碰撞中...':'碰&nbsp;&nbsp;&nbsp;撞'}}</div>
                
                <div class="btn_crash" v-for="(t,i) in crashType" :style="{right:(10+i*110) + 'px'}" @click="crash(t.val)" v-show="true">{{blnCrashing?'碰撞中...':'碰&nbsp;&nbsp;&nbsp;撞'+`(${t.name})`}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3'
import {Nav_Page_Switch,SecondCrashTask,delSecondCrash,GetAnalyTaskData,GetAnalyTask} from '../store/mutation-types'
import scroll from 'components/scroll'
import CInput from 'components/Input'
export default {
  name: 'CrashDetail',
  props:['store','taskid'],
  components:{
      scroll,
      tagItem:{
          props:['task','store'],
          components:{scroll},
          template:`<div style="height:100%;width:100%;">
                        <div style="height:calc(100% - 41px)">
                            <scroll ref="scroll" :listen="data" :store="store">
                                <div v-for="d in data" class="analy_detail_tag_item" style="font-size:12px;">
                                    <div class="row" style="line-height:30px;margin-left:0px;margin-right:0px;">
                                        <div class="col-md-6" style="padding: 0px 5px;"><span style="margin-right:5px;">姓名:</span>{{d.customer_name}}</div>
                                        <div class="col-md-6" style="padding: 0px 5px;"><span style="margin-right:5px;">场所编码:</span>{{d.netbar_wacode}}</div>
                                    </div>
                                    <div class="row" style="line-height:30px;margin-left:0px;margin-right:0px;">
                                        <div class="col-md-6" style="padding: 0px 5px;"><span style="margin-right:5px;">证件号:</span>{{d.key}}</div>
                                        <div class="col-md-6" style="padding: 0px 5px;"><span style="margin-right:5px;">证件类型:</span>{{d.certificate_type}}</div>
                                    </div>
                                    <div class="row" style="line-height:30px;margin-left:0px;margin-right:0px;">
                                        <div class="col-md-6" style="padding: 0px 5px;"><span style="margin-right:5px;">开始时间:</span>{{converTime(d.start_time)}}</div>
                                        <div class="col-md-6" style="padding: 0px 5px;"><span style="margin-right:5px;">结束时间:</span>{{converTime(d.end_time)}}</div>
                                    </div>
                                </div>
                            </scroll>
                        </div>
                        <div class="page_container" style="border-top:1px solid #e7eaec;">
                            <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageNum+1}}</span></span>
                            <div class="firstPage" @click="pageChange(0)">首页</div>
                            <div class="prePage" @click="pageChange(pageNum-1)">上一页</div>
                            <div class="nextPage" @click="pageChange(pageNum+1)">下一页</div>
                        </div>    
                    </div>`,
            data(){
                return {
                    pageNum:0,
                    limit:10,
                    data:[]
                };
            },
            mounted(){
                this.$store=this.$store || this.store;
                //加载数据
                this.loadData();
            },
            methods:{
                //转化时间戳
                converTime(val){
                    return tool.DateByTimestamp(val,'yyyy-MM-dd hh:mm:ss');
                },
                //重新加载滚动条
                reloadScroll(){
                    this.$refs.scroll.reloadyScroll();
                },
                pageChange(pageNum){
                    this.pageNum=pageNum>0? pageNum : 0;
                    this.loadData(true);
                },
                //加载数据
                loadData(blnTip){
                    this.$store.dispatch(GetAnalyTaskData,{
                        id:this.task.taskid,
                        limit:this.limit,
                        skip:this.limit * this.pageNum,
                        conds:this.task.sid?[this.task.sid]:[]}).then(res=>{
                            if(res.msg.code!='successed')return;
                            let data=res.biz_body.data;
                            if(data.length<=0){
                                if(blnTip)tool.msg({msg:{code:'successed'}},'已经到了最后页!','已经到了最后页!');
                                this.pageNum=(this.pageNum-1)<0?0:(this.pageNum-1);
                                return;
                            }

                            this.data=data;
                        });
                }
            }
      }
  },
  data () {
    return {
      cid:0,
      canvas:null,//画布对象
      w:0,//画布宽度
      h:0,//画布高度
      sepH:0,//分割线高度
      radius:0,//圆形半径
      crashArr:[],//碰撞数组集合
      ticked:null,
      simulation:null,
      blnCrashing:false,
      crashTimer:null,
      particle:[],//碰撞后产生的粒子数
      fontSize:'',
      nodes:[],
      res:[],//碰撞结果集数据
      curTagIndex:-1,//当前展开的Tag项索引
      h:0,//页面高度
      crashType:[{name:'差集',val:'except'},{name:'并集',val:'union'},{name:'交集',val:'join'}],
    }
  },
  mounted(){
      let s=this;
      this.$store=this.$store || this.store;
      this.h=$(this.$el).height();
      this.cid=tool.guid();
      this.$nextTick(()=>{
        setTimeout(()=>{
            this.init();this.GetFirstData();
            //默认显示首次碰撞结果集
            this.res.unshift({
                            taskid:s.taskid,
                            name:`原始数据集碰撞结果集`,
                            sourceids:[]
                        });
        },0);
      });
      this.$store.commit(Nav_Page_Switch,menu=>{
        if(menu.keyid!='11021' && this.crashTimer){
            this.crashTimer.stop();
        }
      });
  },
  methods:{
      //获取第一次碰撞数据集数据
      GetFirstData(){
        let self=this;

        this.$store.dispatch(GetAnalyTask,{id:this.taskid}).then(res=>{
            if(res.msg.code!='successed')return;
            let index=1;
            this.nodes= res.biz_body[0].task_conditions.values.map(function(i) {
                        if(i.data_source_ids && i.data_source_ids.length>0){
                            self.res.push({
                                taskid:self.taskid,
                                name:i.title,
                                sourceids:i.data_source_ids,
                                sid:i.id
                            });
                        }
                        return {
                            id:i.id,
                            i:i.data_source_ids && i.data_source_ids.length>0?++index:'原',
                            title:i.title,
                            r: self.radius,
                            x: Math.round(Math.random() * (self.w - self.radius * 2) + self.radius),
                            y: Math.round(Math.random() * (self.sepH - self.radius * 2-self.fontSize)+self.radius)
                        };
                    });
            this.simulation.nodes(this.nodes);
            this.simulation.restart();
        });
      },
      //Tag项单击事件
      tag_item(i){
        if(this.curTagIndex==i){
            this.curTagIndex=-1;
        }else{
            this.curTagIndex=i;
        }

        this.$nextTick(()=>{
            this.$refs.tagScroll.reloadyScroll();
            this.$refs['scroll'+i][0].reloadScroll();
        })
      },
      //导入数据集
      importdata(){
        let self=this;
        let arr=d3.range(1).map(function(i) {
            return {
                r: self.radius,
                x: Math.round(Math.random() * (self.w - self.radius * 2) + self.radius),
                y: Math.round(Math.random() * (self.h - self.radius * 2-self.fontSize)+self.radius)
            };
        });

        this.nodes =this.nodes.concat(arr);
        this.simulation.nodes(this.nodes);
        this.simulation.restart();
      },
      //碰撞单击事件
      crash(type){
       if(this.crashArr.length<=0){tool.info('碰撞区暂无数据!');return;}
       if(this.crashArr.length<=1){tool.info('碰撞区只有一个数据集合,无法进行碰撞!');return;}
       let self=this;
       tool.open(function(){
            let param={
                title:'碰撞条件名称',
                area:'300px',
                content:`<div class="openTmp" style="width:100%;height:100%;overflow-y:auto;padding:10px;">
                            <CInput label="条件名称" :val="val" v-on:change="nameChange" />
                            <div class="option_bar" style="margin-top: 10px;text-align:right;">
                                <button type="button" class="btn btn-success" style="font-size:12px;" @click="complete()">确定</button>
                            </div>    
                         </div>`,
                components:{CInput},
                context:{
                    val:tool.DateFormat(new Date(),'yyyy-MM-dd hh:mm:ss'),
                    nameChange(val){
                        param.selfData.val=val;
                    },
                    complete(){
                       let newid='crash'+(self.nodes.length+1);

                       self.$store.dispatch(SecondCrashTask,{id:self.taskid,cond:{
                           id:newid,
                           type:type,
                           title:param.selfData.val,
                           data_source_ids:_.map(self.crashArr,c=>c.id)
                       }}).then(res=>{
                       if(res.msg.code!='successed')return;
                        self.blnCrashing=!self.blnCrashing;
                        if(self.crashTimer){
                            if(self.blnCrashing){
                                self.crashTimer.restart(self.crashAnimated,150)
                            }
                        }else{
                            self.crashTimer =d3.timer(self.crashAnimated,150);
                        }
                        setTimeout(()=>{
                            self.particle=[];self.crashTimer.stop();self.simulation.alphaTarget(0.001).restart();
                            _.each(self.crashArr,c=>{c.blnHide=false;});
                            self.blnCrashing=!self.blnCrashing;

                            //添加二次碰撞节点
                            let arr=d3.range(1).map(function(i) {
                                return {
                                    i:(self.nodes.length+1),
                                    id:newid,
                                    title:param.selfData.val,
                                    r: self.radius,
                                    x: Math.round(Math.random() * (self.w - self.radius * 2) + self.radius),
                                    y: Math.round(Math.random() * (self.sepH - self.radius * 2-self.fontSize)+self.radius)
                                };
                            });

                            self.nodes =self.nodes.concat(arr);
                            self.simulation.nodes(self.nodes);
                            self.simulation.restart(); 

                            //添加显示Tag集合数据
                            self.res.push({
                                taskid:self.taskid,
                                sid:newid,
                                name:`(${_.map(self.crashArr,c=>c.title).join(',')})碰撞结果集`,
                                sourceids:_.map(self.crashArr,c=>c.id)
                            });

                        },3150);
                       });
                       param.close();
                    },
                }
            };
            
            return param;
        }());
      },
      //碰撞动画
      crashAnimated(els){
        let self=this,speed=5;
        if(els>=2000 && self.particle.length<=0){
            let tempArr=_.chain(self.crashArr);
            self.particle = tempArr.map(c=>{
                 c.blnHide=true;
                 return d3.range(15).map(function(i) {
                        return {
                            index:i,
                            xDir:Math.round(Math.random()),
                            yDir:Math.round(Math.random()),
                            r: 5,
                            x: Math.round(Math.random() * self.radius*2+c.x-self.radius),
                            y: Math.round(Math.random() * self.radius*2+c.y-self.radius)
                        };
                    });
             }).flatten().value();
        }
        let tempArr=self.particle.length>0?self.particle:self.crashArr;
        _.each(tempArr,c=>{
            if((c.x+self.radius)<self.w && !c.xDir){
                c.x=c.x+speed;
                c.xDir=0;//向右
            }else if((c.x-self.radius)<=0){
                c.x=c.x+speed;
                c.xDir=0;//向右
            }
            else if((c.x+self.radius)<self.w && c.xDir){
                 c.x=c.x-speed;
            }
            else if((c.x+self.radius)>=self.w){
                c.x=c.x-speed;
                c.xDir=1;//向左
            }
            
            if((c.y-self.radius)>self.sepH && !c.yDir){
                c.y=c.y-speed;
                c.yDir=0;//向上
            }else if((c.y-self.radius)<=self.sepH){
                c.y=c.y+speed;
                c.yDir=1;//向下
            }
            else if((c.y+self.radius)>=self.h){
                c.y=c.y-speed;
                c.yDir=0;//向上
            }
            else if((c.y-self.radius)>self.sepH && c.yDir){
                 c.y=c.y+speed;
            }
        });
        self.ticked();
        self.simulation.stop();
      },
      //删除二次碰撞信息
      delSecondInfo(d){
        tool.confirm('您确定要删除该条信息吗?',['确定','取消'],()=>{
            this.$store.dispatch(delSecondCrash,{taskid:d.taskid,id:d.sid}).then(res=>{
                if(!tool.msg(res,'删除成功!'))return;
                this.res=_.filter(this.res,r=>r.sid!=d.sid);
            });
        },function(){});
      },
      //初始化画布
      init(){
        let container=$(this.$el).find('div[name="canvan_container"]'),self=this,radius=this.radius=20,fontSize=this.fontSize=12;
        this.canvas=container.find('#'+this.cid)[0];
        this.w= width = this.canvas.width = container.width();
        this.h= height = this.canvas.height = container.height();
        var color = d3.scaleOrdinal().range(d3.schemeCategory20);
        let tau=2* Math.PI,context=this.canvas.getContext('2d');
        let sepH=this.sepH=height/3*2;//分割线高度

        // this.nodes= d3.range(10).map(function(i) {
        //                 return {
        //                     r: radius,
        //                     x: Math.round(Math.random() * (width - radius * 2) + radius),
        //                     y: Math.round(Math.random() * (sepH - radius * 2-fontSize)+radius)
        //                 };
        //             });

        var simulation =this.simulation = d3.forceSimulation(this.nodes)
            .velocityDecay(0.2)
            .force("x", d3.forceX((d,i)=>{return d.x;}).strength(0.02))
            .force("y", d3.forceY(
                (d,i)=>{
                    let y=d.y>(height-radius-fontSize)?(height-radius-fontSize):d.y;
                        y=d.y<radius?radius:y;
                    return y;
                }).strength(0.02)
            )
            .force('manybody',d3.forceManyBody().strength(10))
            .force("collide", d3.forceCollide().radius(function(d) { return d.r ; }).iterations(2))
            .on("tick", ticked);
        
        //画分区域割线
        function drawCutLine(){
            context.save();
            context.beginPath();
            context.moveTo(0,sepH);
            context.lineTo(width,sepH);
            context.closePath();
            context.strokeStyle = '#e7eaec';
            context.lineWidth = 2;
            context.stroke();
            context.restore();
        }

        //画数据集图形
        function drawDataCircle(){
            let funcs=[];
            for(let i=0;i<self.nodes.length;i++){
                let node=self.nodes[i];
                if(node.blnHide){continue;}
                context.beginPath();
                context.moveTo(node.x + radius,node.y);
                context.arc(node.x, node.y, radius, 0, 2 * Math.PI);
                context.fillStyle = color(node.index);
                context.fill();
                //if(!node.active)continue;
                funcs.push(function(){
                    context.save();
                    context.font = `${fontSize}px 微软雅黑`;
                    context.fillStyle =color(node.index);
                    let txtSize= context.measureText(node.title);
                    context.fillText(node.title, node.x-txtSize.width/2, node.y+radius+fontSize);
                    
                    context.save();
                    context.font = `${fontSize}px 微软雅黑`;
                    context.fillStyle ='black';
                    let itxtSize= context.measureText(node.i);
                    context.fillText(node.i, node.x-itxtSize.width/2, node.y+5);
                });
            }
            _.each(funcs,f=>f());
            //画碰撞后的产生的粒子节点
            for(let j=0;j<self.particle.length;j++){
                let node=self.particle[j];
                context.beginPath();
                context.moveTo(node.x + node.r,node.y);
                context.arc(node.x, node.y, node.r, 0, 2 * Math.PI);
                context.fillStyle = color(node.index);
                context.fill();
            }
        }

        //画碰撞区背景文字
        function drawCrashBgTxt(){
            context.save()
            context.font = `50px 微软雅黑`;
            context.fillStyle ='gray';
            let txtSize= context.measureText("碰撞区");
            context.fillText("碰撞区", width/2-txtSize.width/2,sepH+radius+(height-sepH)/2);
        }

        
        function ticked() {
            context.clearRect(0, 0, width, height);
            drawCrashBgTxt();
            drawCutLine();
            drawDataCircle();
        }
        this.ticked=ticked;

        //注册数据进入数据集事件
        d3.select(this.canvas).on('mousemove',function(){
           let node = simulation.find(d3.event.layerX,d3.event.layerY,radius);
           _.each(self.nodes,n=>n.active=false);
           if(!node){ticked();return;}
           node.active=true;
           ticked();
        });

        //收集在碰撞区的数据集
        function colletCrashData(){
            self.crashArr = _.filter(self.nodes,n=>{
                return n.y>=(sepH+radius);
            });
        }

        //注册拖动事件
        d3.selectAll(`canvas[id="${this.cid}"]`).call(d3.drag()
        .subject(()=>{return simulation.find(d3.event.x,d3.event.y,radius);})
        .on("drag",()=>{
            if(self.blnCrashing){return;}
            d3.event.subject.x = d3.event.x;
            d3.event.subject.y = d3.event.y;
        })
        .on("end", ()=>{
            simulation.nodes(self.nodes);
            simulation.alphaTarget(0.01).restart();//这里必须要从新设置alpha的值否则拖不动元素
            colletCrashData();
        }));
      }
  }
}
</script>
<style lang="less">
    @import "../css/variables.less";
    .analy_detail_tag_item{padding:5px 0px; width:100%;.border('bottom');}


</style>

<style scoped lang="less">
  @import "../css/variables.less";
  .CrashDetail{width:100%;height:100%;padding: 5px;}
  .CrashDetail .page{width:100%;height:100%;background-color:@FrontCol;}

  @RightW:400px;
  .CrashDetail .left{height:100%;margin-right:@RightW;.border('right');position: relative;}
  .CrashDetail .right{height:100%;width:@RightW;float:right;}
  .CrashDetail .left .btn_lead{
      position:absolute;top:0px;right:0px;font-size:12px;padding:10px;
      background-color: @btn_Bg_Col_5;color:white;
   }
  .CrashDetail .left .btn_crash:hover,
  .CrashDetail .left .btn_lead:hover{background-color:@btn_Bg_Col_hover_5;cursor:pointer;}
  .CrashDetail .left .btn_crash{
      position: absolute;bottom:10px;right:10px;font-size:12px;padding:7px 15px;
      background-color: @btn_Bg_Col_5;color:white;border-radius: 5px;
  }

  @titlH:30px;
  //所有数据碰撞
  .allData{width:100%;height:100%;}
  .allData .title{.border('bottom');line-height:@titlH;text-align:center;}
  .allData .subject{width:100%;height:~"calc(100% - @{titlH} - 1px)";}
  .allData .subject .tag_item{
      line-height:30px;.border('bottom');background-color:@Font_Hover_Col;color:white;text-align:left;padding:0px 20px 0px 10px;
      cursor:pointer;
  }
  .allData .subject .tag_item .number{font-style:italic;font-weight:600;float:left;}
  .allData .subject .tag_item .option{float:right;display:none;}
  .allData .subject .tag_item:hover .option{display:block;}
  .allData .subject .tag_item .content{margin-left:20px;margin-right:40px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
  .allData .subject .tag_item_content {width:100%;display:none;}
  .allData .tag_item.active + .tag_item_content{display:block;}
</style>
