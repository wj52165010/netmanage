<!-- 列表插件 -->
<!--<template>
    <div class="table">
      <slot></slot>
    </div>
</template>-->

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
  render: function (createElement) {
    this.$slots.default[0].componentOptions.propsData={data:this.data};//设置Props属性值
    this.$slots.default[2].componentOptions.propsData={data:this.data};

    let cols=this.$slots.default[0].child;

    console.log(cols);

    return createElement(
      'div', 
      {
        class:{
          table:true,
        },
        props:{
          data:this.data
        }
      },
      [
        createElement('div',[this.$slots.default[0]]),
        createElement('div',{
            class:{
              'table-body':true,
            }
          },
          [this.$slots.default[2]]
        )
      ]
    )
  },
  mounted(){
    
  },
}
</script>
<style scoped lang="less">
  @import './common.less';
  .table{width:100%;height:100%;margin:0px;text-align:left;.border("");}
  .table .hiddencolumns{display:none;position:absolute;z-index:-1;}
  .table .table-body{height:~"calc(100% - @{tableHeaderH})"}
</style>
