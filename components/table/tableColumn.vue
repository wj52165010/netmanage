<!-- 列表列插件 -->
<template>
  <div class="table-column" @click="click()">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'v-table-column',
  props:['column'],
  data () {
    return {
    }
  },
  computed:{
  
  },
  methods:{
    click(){
      //this.column.data.attrs.width=200;//改变列宽度

      //console.log(this.column);
      this.$emit('click');
    }
  },
  mounted(){
    
  }
}
</script>
<style scoped lang="less">
  .table-column{display:inline-block;height:100%;width:100%;overflow: hidden;text-overflow: ellipsis;}
</style>
