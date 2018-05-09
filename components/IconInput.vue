<!-- 带图标的输入框组件(带显示动画) -->
<template>
    <div class="IconInput" @click.stop="inputClick()">
        <div class="icon"><i class="fa fa-search"></i></div>
        <div class="input_container"><input type="text" v-model="value" /></div>
    </div>
</template>

<script>
export default {
  name: 'IconInput',
  props:['extrput'],
  data () {
    return {
      value:'',
      RxSub:null,
    }
  },
  mounted(){
      this.RxSub=new this.$store.getters.Rx.Subject();
      this.RxSub.debounceTime(400).subscribe((val)=>{
          this.$emit('change',val.val,val.extrput || '');
      });

  },
  watch:{
      value(){
          this.RxSub.next({val:this.value,extrput:this.extrput});
      }
  },
  methods:{
      inputClick(){return false;}
  }
}
</script>

<style scoped lang="less">
  @import "../css/variables.less";
  @H:26px;
  @IconW:30px;
  .IconInput{width:100%;height:@H;line-height:@H;}
  .IconInput .input_container{
      height:100%;.border('');border-top-right-radius:5px;border-bottom-right-radius:5px;background:#EEEEEE;
      width:~"calc(100% - @{IconW})";
      margin-left:@IconW;
  }
  .IconInput input{width:100%;color:black;border:none;background-color:transparent;padding: 0px;height: @H;padding:0px 5px;outline:none;}
  
  .IconInput .icon{
      width: @IconW;height:@H;line-height:@H;text-align:center;float:left;
      .border('');border-top-left-radius:5px;border-bottom-left-radius:5px;background:#EEEEEE;
      .border('right',@Font_Hover_Col);
  }

  html{.TCol(~".IconInput .icon");}
  html{.TCol(~".IconInput .icon",'brc');}

  .IconInput .icon i{font-size: 14px;}
</style>
