<!-- 仿百度生伸缩组件 -->
<template>
    <div class="ScaleBar">
        <!--增加按钮-->
        <div class="addBtn" @click="addClick()"><i class="fa fa-plus"></i></div>
        <!--拖动条-->
        <div class="dragLine">
            <div name="dragBtn" class="dragBtn" :style="{top:position+'px'}" @mousedown="mousedown($event)">
                <i class="fa fa-minus iconTip"></i>
                <div class="numTip">{{curNum}}</div>
            </div>
            <!--颜色条-->
            <div class="colorLine" :style="{top:position+'px'}"></div>
            <!--刻度线-->
            <div class="tickLine" v-for="t in ticks" :style="{top:t+'px'}"></div>
        </div>
        <!--减少按钮-->
        <div class="removeBtn" @click="removeClick()"><i class="fa fa-minus"></i></div>
    </div>
</template>

<script>
import {scaleLinear} from "d3-scale";
export default {
  name: 'ScaleBar',
  props:['start','end'],
  data () {
    return {
      dragBtn:null,
      position:0,
      blnDrag:false,
      mousedownid:null,
      mouseupid:null,
      cursorStart:0,//鼠标拖动开始位置
      scaleVal:null,//其实值映射函数
      curNum:null,//当前数
      ticks:[],//刻度集合
    }
  },
  watch:{
      curNum(){
         this.$emit('change',this.curNum);
      }
  },
  mounted(){
      this.dragBtn=$(this.$el).find('div[name="dragBtn"]');
      this.mousedownid = Fx.SingleBind('mouseup',$('body'), (e)=> {
          this.mouseup();
      });
      this.mouseupid=Fx.SingleBind('mousemove',$('body'), (e)=> {
        this.mousemove(e);
      });
      this.scaleVal=scaleLinear().domain([this.start,this.end]).range([70,0]);
      this.curNum=this.start;
      this.position = this.scaleVal(this.curNum);
      //生成刻度线
      for(let i=this.start;i<=this.end;i++){
        this.ticks.push(this.scaleVal(i));   
      }
  },
  destroyed(){
    Fx.ClearBind('mouseup',$('body'),this.mousedownid);
    Fx.ClearBind('mousemove',$('body'),this.mouseupid);
  },
  methods:{
      mousedown(e){
        this.blnDrag=true;
        this.cursorStart=e.clientY;
      },
      mouseup(){
          this.blnDrag=false;
          this.curNum= Math.round(this.scaleVal.invert(this.position));
          this.position = this.scaleVal(this.curNum);
      },
      mousemove(e){
        if(!this.blnDrag)return;
        e.clientY>this.cursorStart ?this.position=(this.position+1)>70?70:this.position+1
                                    :this.position=(this.position-1)<0?0:this.position-1;
        this.cursorStart=e.clientY;
      },
      addClick(){
        this.curNum=this.curNum+1>this.end?this.end:this.curNum+1;
        this.position = this.scaleVal(this.curNum);
      },
      removeClick(){
        this.curNum=this.curNum-1<this.start?this.start:this.curNum-1;
        this.position = this.scaleVal(this.curNum);
      },
      setVal(val){
          this.curNum=val;
          this.position=this.scaleVal(this.curNum);
      }
  }
}
</script>

<style scoped lang="less">
  @import "../css/variables.less";
  @width:20px;
  @height:120px;
  .ScaleBar{
      width:@width;
      height:@height;
      margin:10px;
   }
  @btnH:20px;
  .addBtn,
  .removeBtn{
      height:@btnH;width:100%;
      text-align:center;
      color:white;
      background-color:@Font_Hover_Col;
      border-radius:50%;font-size:12px;line-height:@btnH;}
  .addBtn:hover,
  .removeBtn:hover{cursor:pointer;background-color:@btn_Bg_Col_hover_0;}
  .dragLine{height:~"calc(100% - 2*@{btnH})";width:30%;margin-left:35%;.border('left',#999999);.border('right',#999999);position:relative;}

  .dragBtn{
      margin-left:-2px;
      width:@width;
      height:10px;
      background-color:@Font_Hover_Col;
      line-height:2px;
      color:white;
      font-size:12px;
      margin-left:-8px;
      border-radius:2px;
      position:absolute;
      top:10px;
      cursor:pointer;
      z-index:100;
  }
  .dragBtn:hover{background-color:@btn_Bg_Col_hover_0;}
  .colorLine{position:absolute;bottom:0px;background-color:#999999;width:100%;top:0px;}
  .numTip{position: absolute;color: black;right: -15px;top: 4px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}
  .tickLine{position:absolute;width:100%;height:2px;background-color:#999999;}
  .iconTip{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}
</style>
