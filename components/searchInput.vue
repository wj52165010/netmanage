<!-- 搜索输入框组件 -->
<template>
    <div class="SearchInput" >
        <div class="item" >
            <div class="icon" @click="btnClick()" style="display:inline-block;font-size:14px;line-height: 26px;"><i class="fa fa-search" /></div>
            <span class="info" style="padding: 0px;display: block;margin-right: 30px;text-align: left;">
            <input type="text" v-model="val" style="width: 100%;margin-top: 3px;border:none;padding-left:10px;outline:none;" :placeholder="holder || ''" />
            </span>
        </div>
    </div>
</template>

<script>
export default {
  name: 'SearchInput',
  props:['holder','extra'],
  data () {
    return {
      val:''
    }
  },
  methods:{
    btnClick(){
      this.$emit('btnClick',this.val,this.extra);
    }
  }
}
</script>

<style scoped lang="less">
   @import "../css/variables.less";
  .SearchInput .item{
    cursor: pointer;
    display: inline-block;
    border: 1px solid @btn_Bg_Col_hover_1;
    color: @FontCol;
    font-size: 12px;
    border-radius: 5px;
    line-height:20px;
  }
  .SearchInput .item .icon{
    text-align: center;
    background-color: @btn_Bg_Col_hover_1;
    color: white;
    width: 30px;
    font-size: 20px;
    float: right;
  }
</style>
