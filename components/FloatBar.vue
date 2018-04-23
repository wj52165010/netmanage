<!-- 浮动操作组件 -->
<template>
    <div class="floatBar" v-on:mouseenter="mouseenter" v-on:mouseleave="mouseleave">
        <div name="iconContainer" class="floatBar_icon"><i class="fa fa-paint-brush icon"></i></div>
        <div name="barContainer" class="barContainer">
            <span class="cbtn" name="cbtn" v-for="action in actions" @click="action.callback(action.param)"><i :class="action.icon || 'fa fa fa-pencil'"/>{{action.name}}</span>
        </div>
    </div>
</template>

<script>
import ripple from '../js/ripple_btn.js'
export default {
  name: 'FloatBar',
  props:['actions','roffset'],
  data () {
    return {
      barContainerDom:null,
      iconContainerDom:null,
      blnEnter:null,
    }
  },
  mounted(){
    this.barContainerDom=$(this.$el).find('div[name="barContainer"]');
    this.iconContainerDom=$(this.$el).find('div[name="iconContainer"]');
    ripple.Init($(this.$el).find('span[name="cbtn"]'));
  },
  methods:{
      mouseenter(){
        this.blnEnter=true;
        $(this.$el).css('right',(0+ this.roffset || 0)+'px');
        $(this.$el).css('width',this.barContainerDom.width()+'px');
        $(this.$el).addClass('box-shadow');
        this.barContainerDom.show();
        this.iconContainerDom.hide();
      },
      mouseleave (){
        this.blnEnter=false;
        $(this.$el).css({'width':'40px','right':'-20px'});
        setTimeout(()=>{
          if(this.blnEnter){this.blnEnter=false;return;}
          $(this.$el).removeClass('box-shadow');
          this.barContainerDom.hide();
          this.iconContainerDom.show();
        },500);
      }
  }
}
</script>
<style scoped lang="less">
  @import "../css/variables.less";
  @size:40px;
   .floatBar{position: absolute;z-index:100;border-radius:8px;color:white;top:0px;right:-@size/2;line-height:@size;.transLine();width:@size;height:@size;cursor:pointer;.user-select()}
   .floatBar_icon{height:@size;width:@size;background-color:@btn_Bg_Col_hover_1;border-radius:50%;text-align: left;}
   .floatBar .icon{font-size: 15px;color: white;margin-left: 8px;}
   .floatBar .barContainer{display:none;white-space: nowrap;background-color:@btn_Bg_Col_hover_1;position:absolute;border-top-left-radius:8px;border-bottom-left-radius:8px;}
   .floatBar .barContainer .cbtn{padding:0px 10px;cursor:pointer;border-right: 1px solid @BgCol;display:inline-block;}
   .floatBar .barContainer .cbtn i{margin-right:5px;}
   .floatBar .barContainer .cbtn:hover{color:@btn_Bg_Col_6;}
   .box-shadow{ box-shadow: 2px 4px 2px #BFBFBF;}

</style>
