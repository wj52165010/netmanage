<!-- 列表插件 -->
<template>
    <div class="table">
      <!--隐藏列对象(为了让插件子对象能被加载所用)-->
      <div class="hiddencolumns" ref="hiddenColumns"><slot></slot></div>

      <v-table-header :store="store"></v-table-header>
      <v-table-body :store="store" :data="data" class="table-body"></v-table-body>
    </div>
</template>

<script>
import TableStore from './table-store.js'
import ctableHeader from './tableHeader'
import ctableBody from './tableBody'

export default {
  name: 'v-table',
  components:{'v-table-header':ctableHeader,'v-table-body':ctableBody},
  props:['data'],
  data () {
    return {
      store:new TableStore(),
    }
  },
  mounted(){
    
  }
}
</script>
<style scoped lang="less">
  @import './common.less';
  .table{width:100%;height:100%;margin:0px;text-align:left;.border("");}
  .table .hiddencolumns{display:none;position:absolute;z-index:-1;}
  .table .table-body{height:~"calc(100% - @{tableHeaderH})"}
</style>
