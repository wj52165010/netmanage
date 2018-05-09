<!-- 时间拖动条组件 -->
<template>
    <div class="RangeSlider" @mouseleave="mouseleave()">
        <!--中间线-->
        <div class="middleLine"></div>
        <!--拖动点-->
        <div :class="{drag:blnDrag && curBtnIndex==1,movePoint:!blnDrag || curBtnIndex!=1}" :style="{left:onePosition+'px','z-index':curBtnIndex==1?100:10}"  @mousedown="mousedown($event,1)" @mouseover="mouseover(1)">
            <div style="margin-left:35%;">
                <el-tooltip  effect="dark" ref="oneTip" :manual="true" style="width:100%;height:100%;" :content="oneTimeContent" :placement="placement || 'bottom'">
                
                </el-tooltip>
            </div>
        </div>
        <div :class="{drag:blnDrag && curBtnIndex==2,movePoint:!blnDrag || curBtnIndex!=2}" :style="{left:twoPosition+'px','z-index':curBtnIndex==2?100:10}"  @mousedown="mousedown($event,2)"  @mouseover="mouseover(2)">
            <div style="margin-left:35%;">
                <el-tooltip effect="dark" ref="twoTip" :manual="true" style="width:100%;height:100%;" :content="twoTimeContent" :placement="placement || 'bottom'">
                
                </el-tooltip>
            </div>
        </div>
        <!--拖动点之间的范围线-->
        <div class="rang_bar" :style="{left:bar.left+'px',width:bar.width+'px'}"></div>
    </div>
</template>

<script>
let Rx = require('rxjs/Rx');
import {scaleLinear} from "d3-scale";
export default {
  name: 'TimeSlider',
  props:['placement','range'],
  data () {
    return {
        blnDrag:false,
        curBtnIndex:0,//当前正在拖动按钮索引
        oneCursorStart:0,//鼠标拖动开始位置
        twoCursorStart:0,
        onePosition:0,
        twoPosition:0,
        w:0,
        mousedownid:0,
        mouseupid:0,
        bar:{left:0,width:0},
        scaleVal:null,//伸缩对比方法
        delaySend:null,
        oneTimeContent:'',
        twoTimeContent:'',
        positionEl:null,
    }
  },
  watch:{
      range(){
          this.reInit();
      }
  },
  mounted(){
      this.positionEl=$(this.$el);
      this.w=$(this.$el).width()-15;
      this.mousedownid = Fx.SingleBind('mouseup',$('body'), (e)=> {
          this.mouseup();
      });
      this.mouseupid=Fx.SingleBind('mousemove',$('body'), (e)=> {
        this.mousemove(e);
      });
      
      this.scaleVal=scaleLinear().domain([0,this.w]).range(this.range);

      this.delaySend=(new Rx.Subject()).debounceTime(200);
      this.delaySend.subscribe(res=>{
          let min=Math.round(this.scaleVal(res.min)),
              max=Math.round(this.scaleVal(res.max));
          this.$emit('change',[min,max]);
      });
      
      let initTimestamp=Math.round(this.scaleVal(0));
      let endTimestamp=Math.round(this.scaleVal(this.w));

      this.oneTimeContent=tool.DateByTimestamp(initTimestamp,'yyyy-MM-dd hh:mm:ss');
      this.twoTimeContent=tool.DateByTimestamp(endTimestamp,'yyyy-MM-dd hh:mm:ss');
      this.twoPosition=this.w;

      this.$refs.oneTip.showPopper = false;
      this.$refs.twoTip.showPopper = false;

      this.bar.left=Math.min(0,this.w);
      this.bar.width=Math.abs(0-this.w);
  },
  destroyed(){
    Fx.ClearBind('mouseup',$('body'),this.mousedownid);
    Fx.ClearBind('mousemove',$('body'),this.mouseupid);
  },
  methods:{
      reInit(){
          this.w=$(this.$el).width()-15;
          this.scaleVal=scaleLinear().domain([0,this.w]).range(this.range);
          let initTimestamp=Math.round(this.scaleVal(0));
          let endTimestamp=Math.round(this.scaleVal(this.w));
          this.oneTimeContent=tool.DateByTimestamp(initTimestamp,'yyyy-MM-dd hh:mm:ss');
          this.twoTimeContent=tool.DateByTimestamp(endTimestamp,'yyyy-MM-dd hh:mm:ss');
          this.twoPosition=this.w;
          
        //   setTimeout(()=>{
        //     this.$refs.oneTip.showPopper = true;
        //     this.$refs.twoTip.showPopper = true;
        //   },1000);

          this.bar.left=Math.min(0,this.w);
          this.bar.width=Math.abs(0-this.w);
          this.oneCursorStart=0;
          this.twoCursorStart=this.w;
      },
      showTip(){
        this.$refs.oneTip.showPopper = true;
        this.$refs.twoTip.showPopper = true;
      },
      hideTip(){
        this.$refs.oneTip.showPopper = false;
        this.$refs.twoTip.showPopper = false;
      },
      mousedown(e,btnIndex){
          this.curBtnIndex=btnIndex;
          this.blnDrag=true;
          let offset=this.positionEl.offset();
          let clientX=e.clientX-offset.left;
          if(this.curBtnIndex==1){
              this.oneCursorStart=clientX;
          }else{
              this.twoCursorStart=clientX;
          }
      },
      mouseup(){
          this.blnDrag=false;
          //this.$refs.oneTip.showPopper = false;
          //this.$refs.twoTip.showPopper = false;
      },
      mousemove(e){
        if(!this.blnDrag)return;
        let offset=this.positionEl.offset();
        let clientX=e.clientX-offset.left-15;

    
        if(this.curBtnIndex==1){
            this.$refs.oneTip.showPopper = true;
            this.$refs.oneTip.updatePopper();
            clientX>this.oneCursorStart ?this.onePosition=clientX>this.w?this.w:clientX
                                    :this.onePosition=clientX<0?0:clientX;
            this.oneCursorStart=this.onePosition;
            //设置提示框信息
            let timestamp = Math.round(this.scaleVal(this.oneCursorStart));
            this.oneTimeContent=tool.DateByTimestamp(timestamp,'yyyy-MM-dd hh:mm:ss');

        }else{
            this.$refs.twoTip.showPopper = true;
            this.$refs.twoTip.updatePopper();

            clientX>this.twoCursorStart ?this.twoPosition=clientX>this.w?this.w:clientX
                                    :this.twoPosition=clientX<0?0:clientX;
            this.twoCursorStart=this.twoPosition;

            //设置提示框信息
            let timestamp = Math.round(this.scaleVal(this.twoCursorStart));
            this.twoTimeContent=tool.DateByTimestamp(timestamp,'yyyy-MM-dd hh:mm:ss');
        }

        this.bar.left=Math.min(this.oneCursorStart,this.twoCursorStart);
        this.bar.width=Math.abs(this.oneCursorStart-this.twoCursorStart);
        this.delaySend.next({min:Math.min(this.oneCursorStart,this.twoCursorStart),max:Math.max(this.oneCursorStart,this.twoCursorStart)});

      },
      mouseleave(){
          //this.blnDrag=false;
          //this.$refs.oneTip.showPopper = false;
          //this.$refs.twoTip.showPopper = false;
      },
      mouseover(index){
          index==1?this.$refs.oneTip.showPopper = true:this.$refs.twoTip.showPopper = true;
      }
  }
}
</script>

<style scoped lang="less">
  @import "../css/variables.less";
  
  @H:40px;
  @LineH:6px;
  @PointNormalSize:15px;
  @PointSize:20px;
  .RangeSlider{width:100%;height:@H;line-height:@H;position:relative;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
  }
  .RangeSlider .middleLine{width:100%;height:@LineH;background-color:@FontCol;border-radius:5px;position:absolute;top:(@H - @LineH)/2;}
  .RangeSlider .rang_bar{height:@LineH;border-radius:5px;position:absolute;top:(@H - @LineH)/2;}

  html{.TCol(~".RangeSlider .rang_bar",'bg');}

  .RangeSlider .drag,
  .RangeSlider .movePoint{
      position:absolute;width:@PointNormalSize;height:@PointNormalSize;background-color:@Font_Hover_Col;top:(@H - @PointNormalSize)/2;cursor:pointer;
      left:0px;border-radius:@PointSize/2;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
  }
  .RangeSlider .movePoint:hover{width:@PointSize;height:@PointSize;top:(@H - @PointSize)/2;transition: .2s;}
  .RangeSlider .drag{
      width:@PointSize;height:@PointSize;top:(@H - @PointSize)/2;cursor:pointer;
      -moz-box-shadow:2px 2px 2px #333333; -webkit-box-shadow:2px 2px 2px #333333; box-shadow:2px 2px 2px #333333;
  }
</style>
