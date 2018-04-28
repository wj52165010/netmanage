<!-- 数据点播放组件 -->
<template>
    <div class="PointPlayer">
        <!--播放按钮-->
        <div class="playerBtn">
            <div class="btn_item" @click="rate(-1)"><i class="fa fa-backward"></i></div>
            <div class="btn_item" @click="play()"><i class="fa" :class="{'fa-play':playIns==0,'fa-pause':playIns!=0}"></i></div>
            <div class="btn_item" @click="rate(1)"><i class="fa fa-forward"></i></div>
        </div>
        <!--切换阀-->
        <div class="switch " v-if="!blnSimple">
            <div class="switch_container">
                <div class="up"><span class="info" :class="{active:model==1}" @click="modelChange(1)">D</span></div>
                <div class="down"><span class="info" :class="{active:model==0}"@click="modelChange(0)">P</span></div>
            </div>
        </div>
        <!--进度条-->
        <div class="progress" :class="{simple:blnSimple}">
            <!--进度条路径-->
            <div class="path" name="path" @mousedown.stop="pathMouseDown($event)">
                <!--进度点/进度按钮-->
                <div class="progressBtn" :style="{left:curPos + 'px'}" @mousedown.stop="progressBtnMouseDown($event)"></div>

                <!--进度当前走过的长度显示区域-->
                <div class="progressLength" :style="{width:curPos + 'px'}"></div>

                <!--显示当前进度日期-->
                <div class="progressDate">{{oneCount}} / {{twoCount}}</div>
                <!--显示当前播放速率-->
                <div class="playerRate">x{{curRate}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import {scaleLinear} from "d3-scale";
import {BODY_RESIZE} from '../store/mutation-types'

export default {
  name: 'PointPlayer',
  props:['data','range','kind','blnNoRefresh','blnSimple'],
  data () {
    return {
      blnDrag:false,//是否正在拖动中
      positionEl:null,//组件容器对象
      mousedownid:null,
      mouseupid:null,
      startPos:0,//鼠标开始拖动位置
      curPos:0,//拖动点当前位置
      w:0,//拖动路径宽度
      dragBtnW:14,//拖动按钮宽度
      scaleVal:null,//伸缩对比方法
      oneCount:0,
      twoCount:'',
      maxRate:4,//最大速率
      curRate:1,//当前速率
      speed:1, //每秒前进距离(已时间为基准)
      count:2,//每秒前进数据的个数(已数据为基准)
      playIns:0,//播放时时间句柄(用来删除定时器)
      model:0,//0:已数据项为基准,1:已时间为基准
    }
  },
  watch:{
    range(){this.model?this.initTime():this.init();},
    data(){this.model?this.initTime():this.init();},
    curPos(){
       if(this.model==0){
        let dataIndex=Math.round(this.scaleVal.invert(this.curPos));
        this.oneCount=dataIndex<0?0:dataIndex+1;

        this.$emit('countChange',this.oneCount);
       }
       if(this.model==1){
        //设置时间显示
        let timestamp = Math.round(this.scaleVal(this.curPos));
        this.oneCount=tool.DateByTimestamp(timestamp,'yyyy-MM-dd hh:mm:ss');

        this.$emit('timeChange',this.scaleVal(0),this.scaleVal(this.curPos));
       }
    },
    kind(){this.modelChange(this.kind);}
  },
  mounted(){
    this.model=this.kind || this.model;
    this.positionEl=$(this.$el);
    setTimeout(()=>{this.model?this.initTime():this.init();},100);
    
    this.mousedownid = Fx.SingleBind('mouseup',$('body'), (e)=> {
        this.progressBtnMouseUp();
    });
    this.mouseupid=Fx.SingleBind('mousemove',$('body'), (e)=> {
      this.progressBtnMouseMove(e);
    });

    this.$store.commit(BODY_RESIZE,()=>{
       this.model?this.initTime():this.init();
    });
  },
  destroyed(){
    Fx.ClearBind('mouseup',$('body'),this.mousedownid);
    Fx.ClearBind('mousemove',$('body'),this.mouseupid);
  },
  methods:{
    //重新刷新
    refresh(){
        this.model?this.initTime():this.init();
    },
    //初始化
    init(){
        this.w=$(this.$el).find('div[name="path"]').width();

        this.scaleVal=scaleLinear().domain([0,this.data.length-1]).range([1,this.w-this.dragBtnW]);
        
        let dataIndex=Math.round(this.scaleVal.invert(this.curPos));
        this.oneCount=dataIndex<0?0:dataIndex+1;
        this.twoCount=this.data.length;
    },
    initTime(){
        this.w=$(this.$el).find('div[name="path"]').width();
        this.scaleVal=scaleLinear().domain([0,this.w-this.dragBtnW]).range(this.range.length<=0?[0,0]:this.range);
        let initTimestamp=Math.round(this.scaleVal(this.curPos));
        let endTimestamp=Math.round(this.scaleVal(this.w-this.dragBtnW));

        this.oneCount=tool.DateByTimestamp(initTimestamp,'yyyy-MM-dd hh:mm:ss');
        this.twoCount=tool.DateByTimestamp(endTimestamp,'yyyy-MM-dd hh:mm:ss');
    },
    //播放模式改变事件
    modelChange(model){
        if(model==1 && model!=this.model){//已时间为基准
            this.curPos=0;
            this.initTime();
        }else if(model==0 && model!=this.model){//已数据为基准
            this.curPos=0;
            this.init();
        }

        this.model=model?1:0;
    },
    //播放/暂停
    play(){
       //暂停
       if(this.playIns!=0){
           clearInterval(this.playIns);
           this.playIns=0;
           return;
       }

       //播放
       this.playIns = setInterval(()=>{
           let unitD=((this.w-this.dragBtnW)/this.data.length) * this.count * this.curRate/1000*16;
           let unitT= this.speed * this.curRate/1000*16;
           let unit=this.model==0?unitD:unitT;

           this.curPos=this.curPos+unit>this.w-this.dragBtnW?this.w-this.dragBtnW:this.curPos+unit;
           //播放到最后时,自动关闭播放
           this.$nextTick(()=>{
               if(this.curPos == this.w-this.dragBtnW){
                   clearInterval(this.playIns);
                   if(this.blnNoRefresh){this.playIns=0; return;}
                   this.playIns=0;
                   this.curPos=0;
               }
           });
       },16);
    },
    //回到开始位置
    goStart(){
        if(this.playIns) clearInterval(this.playIns);
        this.playIns=0;
        this.curPos=0;
    },
    //播放速率改变事件
    rate(d){
      if(this.blnSimple){
          let unit=((this.w-this.dragBtnW)/this.data.length);
         
          this.curPos=d>0?
            this.curPos+unit>this.w-this.dragBtnW?this.w-this.dragBtnW:this.curPos+unit:
            this.curPos-unit<=0?0:this.curPos-unit;

        if(d>0){
            this.curPos=this.curPos<1?1:this.curPos;
        }

      }else{
        this.curRate=this.curRate+d<1?1:this.curRate+d>this.maxRate?this.maxRate:this.curRate+d;
      }
      
    },
    //播放路径单击事件(改变播放的位置)
    pathMouseDown(e){
        this.progressBtnMouseMove(e,true);
    },
    //进度拖动按钮按下事件
    progressBtnMouseDown(e){
        this.blnDrag=true;
        let offset=this.positionEl.offset();
        this.startPos=e.clientX-offset.left;
    },
    //进度拖动按钮松开事件
    progressBtnMouseUp(){
        this.blnDrag=false;
    },
    //进度若东按钮鼠标移动事件
    progressBtnMouseMove(e,blnGo){
        if(!this.blnDrag && !blnGo)return;
        let offset=this.positionEl.offset();
        let clientX=e.clientX-offset.left-this.dragBtnW;
        clientX>this.curPos ?this.curPos=clientX>this.w-this.dragBtnW?this.w-this.dragBtnW:clientX
                                    :this.curPos=clientX<0?0:clientX;
    }
  }
}
</script>

<style scoped lang="less">
  @import "../css/variables.less";
   @import "../css/variables.less";
  @bgColor:fade(@HeaderBgCol,90%);
  @TimeH:60px;
  @Padding:5px;
  .PointPlayer{
    width:100%;height:@TimeH;border-radius:10px;background-color:@bgColor;padding:@Padding;position:relative;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
  }
  .PointPlayer:before{
    content:'';
    position:absolute;
    top:@Padding;left:@Padding;bottom:@Padding;right:@Padding;
    border-radius:10px;
    background: linear-gradient(gray 1px,transparent 2px) ;
    -moz-box-shadow:-1px 1px 1px gray,1px 1px 1px gray; -webkit-box-shadow:-1px 1px 1px gray,1px 1px 1px gray; box-shadow:-1px 1px 1px gray,1px 1px 1px gray;
  }
  
  @PlayerBtnW:150px;
  @btnSize:@TimeH - 2*@Padding - 10px;
  @btnColor:gray;
  .PointPlayer .playerBtn{width:@PlayerBtnW;top:@Padding;bottom:@Padding;right:@Padding;position:absolute;color:@btnColor;}
  .PointPlayer .playerBtn .btn_item{
    font-size:14px;display:inline-block;width:@btnSize;height:@btnSize;line-height:@btnSize;text-align:center;margin-top:(@TimeH - 2*@Padding - @btnSize)/2;
    // margin-right:10px;
    // border-radius:50%;
    // background:linear-gradient(360deg,#1b1b1b 20%,gray);
    // -moz-box-shadow:-1px 1px 3px #1b1b1b,1px 1px 3px #1b1b1b; 
    // -webkit-box-shadow:-1px 1px 3px #1b1b1b,1px 1px 3px #1b1b1b; 
    // box-shadow:-1px 1px 3px #1b1b1b,1px 1px 3px #1b1b1b,1px 2px 1px gray inset;

  }
  .PointPlayer .playerBtn .btn_item:last-child{margin-right:0px;}
  .PointPlayer .playerBtn .btn_item:hover{color:white;cursor:pointer;}
  .PointPlayer .playerBtn .btn_item i{
     background:-webkit-linear-gradient(90deg,#b9481c,#f7b13f,#b9481c);
	-webkit-background-clip:text;
	-webkit-text-fill-color:transparent;
  }
  
  @SwitchW:30px;
  @Switchbg:fade(#121214,70%);
  .PointPlayer .switch{position:absolute;top:@Padding;bottom:@Padding;right:@Padding + @PlayerBtnW;width:@SwitchW;padding:@Padding;}
  .PointPlayer .switch .switch_container{
    width:@SwitchW - 10px; height:100%;display: inline-block;border-radius:@SwitchW/3;
    background:linear-gradient(145deg,#1b1b1b 20%,gray);position: relative;font-size:10px;
    color:gray;
   }
  .PointPlayer .switch .switch_container:before{
    content: '';
    position: absolute;
    top: 3px;
    bottom: 3px;
    left: 3px;
    right: 3px;
    background: linear-gradient(360deg, gray 20%, #1b1b1b);
    border-radius:@SwitchW/3;
  }
  .PointPlayer .switch .switch_container .up{
    position:absolute;top:3px;left:3px;right: 3px;
    height:~'calc(50% - 3px)';
    border-top-left-radius:@SwitchW/3;
    border-top-right-radius:@SwitchW/3;
    background: #3e3e3e;cursor:pointer;

  }
  .PointPlayer .switch .switch_container .up:before{
    content:'';
    position:absolute;
    bottom:0px;height:1px;
    background:#1b1b1b;
    left: 0px;
    right: 0px;
    box-shadow:0px 1px 1px gray inset;
  }

  .PointPlayer .switch .switch_container .down{
    position:absolute;top:50%;left:3px;right: 3px;
    height:~'calc(50% - 3px)';
    border-bottom-left-radius:@SwitchW/3;
    border-bottom-right-radius:@SwitchW/3;
    background:#3e3e3e;cursor:pointer;
    box-shadow:0px 0px 1px #1b1b1b inset;
  }
  
  .PointPlayer .switch .switch_container .up .info.active,
  .PointPlayer .switch .switch_container .down .info.active{
    background:-webkit-linear-gradient(90deg,#b9481c,#f7b13f,#b9481c);
	-webkit-background-clip:text;
	-webkit-text-fill-color:transparent;
  }


  @TimePlayerPathH:10px;
  @TimePlayerPathbg:fade(#121214,70%);
  @ProgressBtnSize:14px;
  @ProgressBtnSmallSize:@ProgressBtnSize - 6px;
  .PointPlayer .progress{padding:0px 10px;background-color:transparent;height:auto;border:none;left:@Padding;top:@Padding;bottom:@Padding;right:@PlayerBtnW + @SwitchW + @Padding *2 + 30px;position:absolute;margin:0px;overflow:visible;}
  .PointPlayer .progress.simple{right:@PlayerBtnW + @Padding *2 + 30px;}
  
  .PointPlayer .progress .path{
    width:100%;height:@TimePlayerPathH;margin-top:(@TimeH - 2*@Padding - @TimePlayerPathH)/2;border-radius:10px;background-color:@TimePlayerPathbg;position:relative;
    cursor:pointer;
    -moz-box-shadow:-1px -1px 1px gray inset; 
    -webkit-box-shadow:-1px -1px 1px gray inset; 
    box-shadow:-1px -1px 1px gray inset;
  }
  .PointPlayer .progress .path .progressBtn{
      width:@ProgressBtnSize;height:@ProgressBtnSize;border-radius:50%;position:absolute;top:-(@ProgressBtnSize - @TimePlayerPathH)/2;
      background:linear-gradient(360deg,#1b1b1b 20%,gray);cursor:pointer;
  }
  .PointPlayer .progress .path .progressBtn:before{
    content:'';
    position:absolute;
    top:(@ProgressBtnSize - @ProgressBtnSmallSize)/2;
    bottom:(@ProgressBtnSize - @ProgressBtnSmallSize)/2;
    left:(@ProgressBtnSize - @ProgressBtnSmallSize)/2;
    right:(@ProgressBtnSize - @ProgressBtnSmallSize)/2;
    border-radius:50%;
    background-color:red;
    background:linear-gradient(360deg,gray 20%,#1b1b1b);
  }
  .PointPlayer .progress .path .progressLength{
    width:0px;height:100%;border-radius:10px;background-color:red;
    background:linear-gradient(90deg,transparent 4px,#b9481c,#f7b13f,#b9481c,transparent);
  }
  .PointPlayer .progress .path .progressDate{
    position:absolute;right:0px;top:-16px;color:#f7b13f;font-size:12px;font-style:italic;
    background:-webkit-linear-gradient(90deg,#b9481c,#f7b13f,#b9481c);
	-webkit-background-clip:text;
	-webkit-text-fill-color:transparent;
   }
   .PointPlayer .progress .path .playerRate{
       position:absolute;right:-18px;color:white;top:-3px;font-size:10px;
   }
</style>
