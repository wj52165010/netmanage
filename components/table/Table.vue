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
    this.$slots.default[0].data.attrs={data:this.data};
    this.$slots.default[2].data.attrs={data:this.data};

    console.log(this.$slots.default);

    return createElement(
      'div', 
      {
        class:{
          table:true,
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
    //console.log(this.$slots);
  }
}
</script>
<style scoped lang="less">
  @import './common.less';
  .table{width:100%;height:100%;margin:0px;text-align:left;.border("");}
  .table .hiddencolumns{display:none;position:absolute;z-index:-1;}
  .table .table-body{height:~"calc(100% - @{tableHeaderH})"}
</style>
