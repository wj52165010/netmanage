<!-- 虚拟身份选择组件 -->
<template>
    <div class="virtualIden">
        <el-select v-model="value" filterable placeholder="请输入(支持模糊查找)" :filter-method="filter" :clearable="true" :ccontext="ccontext" @change="dropChange">
            <el-option
            v-for="item in data"
            :key="item.value"
            :label="item.name"
            :value="item.value">
            </el-option>
        </el-select>
    </div>
</template>

<script>
export default {
  name: 'virtualIden',
  props:['options','ccontext','val'],
  data () {
    return {
        data:[],
        value: ''
    }
  },
  watch:{
    val(){
      this.value=this.val || '';
    },
    options(){
      this.options=this.options || {frequently_type:[],vid_type:[]};
      this.data=this.options.frequently_type;
    }
  },
  mounted(){
    this.options=this.options || {frequently_type:[],vid_type:[]};
    this.data=this.options.frequently_type;
    setTimeout(()=>{
      this.value=this.val || '';
    },200);

  },
  methods:{
      dropChange(val,item){
        this.$emit('change',item,val);
      },
      filter(val){
        if(!this.options){return;}
        if(!val){this.data=tool.Clone(this.options.frequently_type);return;}
        this.data=_.filter(this.options.vid_type,i=>{return i.name.toLowerCase().indexOf(val.toLowerCase())>=0;});
      }
  }
}
</script>
<style scoped lang="less">
  @import "../css/variables.less";

</style>
