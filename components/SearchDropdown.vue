<!-- 搜索输入下拉框组件 -->
<template>
    <div class="SearchDropdown" >
        <input type="text" 
            :value="value" 
            :style="{'border-bottom-left-radius':(data || []).length>0 && !(noShowOnlyOne && data.length==1)?'0px':'5px','border-bottom-right-radius':(data || []).length>0 && !(noShowOnlyOne && data.length==1)?'0px':'5px'}" 
            @input="changeVal($event.target.value)"
            @focus="blnClose=true" 
            style="width: 100%;border: 1px solid #c0ccda;padding-left:10px;outline:none;" 
            :placeholder="holder || ''" />
        <!--提示信息-->
        <div class="tipinfo" :style="{color:(info || {color:'gray'}).color}">{{(info || {val:''}).val}}</div>
        <!--下拉筛选框-->
        <div class="dropdownInfo" v-if="blnClose" v-show="(data || []).length>0 && !(noShowOnlyOne && data.length==1)">
            <Scroll :listen="data || []">
                <slot></slot>
            </Scroll>
        </div>
    </div>
</template>

<script>
import Scroll from 'components/scroll'
export default {
  name: 'SearchDropdown',
  props:['holder','value','data','noShowOnlyOne','info'],
  components:{Scroll},
  data () {
    return {
        val:'',
        blnClose:true,
    }
  },
  watch:{
   
  },
  methods:{
    changeVal(v){
        this.$emit('input',v);
    },
    closeDropDown(){
        this.blnClose=false;
    }
  }
}
</script>

<style scoped lang="less">
    @import "../css/variables.less";
    @lineH:36px;
    .SearchDropdown{width:100%;height:@lineH;position:relative;}
    .SearchDropdown input{line-height:@lineH;height:@lineH;border-radius:5px;}

     @bgColor:rgba(47, 51, 65, 0.3);
    .SearchDropdown .dropdownInfo{
        position:absolute;width:100%;background-color:@bgColor;color:white;padding:10px;border-bottom-left-radius:5px;border-bottom-right-radius:5px;
    }

    .SearchDropdown .tipinfo{position:absolute;right:10px;top:0px;line-height:@lineH;color:gray;}
</style>
