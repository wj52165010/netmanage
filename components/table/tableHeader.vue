<!-- 列表头插件 -->
<template>
    <div class="table-header">
       <div class="table-column" v-for="(column,index) in columns" :style="{width:(100/columns.length)+'%'}">
          {{column.label}}
       </div>
    </div>
</template>

<script>

export default {
  name: 'v-table-header',
  props:['store'],
  data () {
    return {
    }
  },
  mounted(){
  },
  computed:{
    columns(){return this.store.states.columns;}
  }
}
</script>
<style scoped lang="less">
  @import './common.less';
  .table-header{width:100%;height:@tableHeaderH;}
  .table-header .table-column{display:inline-block;height:100%;}
  //设置列的边界线
  .table-header .table-column:first-child{.border('bottom');.border('right');}
  .table-header .table-column:last-child{.border('bottom');}
  .table-header .table-column:not(:first-child):not(:last-child){.border('bottom');.border('right');}
</style>
