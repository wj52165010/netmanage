<!-- 下拉框组件 -->
<template>
    <div class="DropDown" :style="{width:width || ''}">
        <div class="btnOption" @click="blnShow=!blnShow;"><i class="fa fa-angle-down"></i></div>
        <input type="text" v-model="val"/>
        <div class="drop" v-show="blnShow">
          <div class="item" @mousedown="itemClick('123')">1123</div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'DropDown',
  props:['width'],
  data () {
    return {
      blnShow:false,
      mousedownid:null,
      val:'',
    }
  },
  watch:{
    val(){
      this.$emit('change',this.val);
    }
  },
  mounted(){
    this.mousedownid = Fx.SingleBind('mousedown',$('body'), (e)=> {e.stopPropagation();this.blnShow=false;});
  },
  destroyed(){
    Fx.ClearBind('mousedown',$('body'),this.mousedownid);
  },
  methods:{
    itemClick(val){
      this.val=val;
  
    }
  }
}
</script>

<style scoped lang="less">
    @import "../css/variables.less";
    @H:28px;
    @btnW:30px;
    @col:@btn_Bg_Col_hover_1;

    .DropDown {.border('',@col);width:200px;border-radius:5px;position:relative;}
    .DropDown input{line-height:@H;border:none;outline:none;width:~'calc(100% - @{btnW})';border-radius:5px;padding-left:5px;padding-right:5px;}

    .DropDown .btnOption{float:right;height:@H+2px;width:@btnW;.border('left',@col);text-align:center;line-height:@H;background-color:@btn_Bg_Col_hover_1;color:white;cursor:pointer;}
    .DropDown .drop{position:absolute;width:~'calc(100% - @{btnW} + 1px)';.border('',@col);border-top:none;}
    .DropDown .drop:empty{border:none;}
    .DropDown .drop .item{line-height:26px;.border('bottom',@col);padding:0px 5px;font-size:12px;}
    .DropDown .drop .item:last-child{border:none;}

</style>
