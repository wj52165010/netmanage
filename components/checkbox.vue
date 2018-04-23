<!-- 复选框组件 -->
<template>
    <div class="cCheckBox" @click="itemClick">
        <span class="icon"><i :class="{'fa fa-square-o':!blnSel,'fa fa-check-square-o':blnSel}"></i></span><span class="info">{{label}}</span>
    </div>
</template>

<script>
export default {
  name: 'cCheckBox',
  props:['label','value','sel'],
  watch:{
    sel(){
      this.blnSel=this.sel;
    }
  },
  data () {
    return {
      blnSel:false,
    }
  },
  methods:{
      itemClick(){
        this.blnSel=!this.blnSel;
        this.$emit('change',this.value,this.blnSel);
      }
  }
}
</script>
<style scoped lang="less">
  @import "../css/variables.less";
  .cCheckBox{display:inline-block;cursor:pointer;}
  .cCheckBox .info{margin-left:5px;font-size:12px;}
</style>
