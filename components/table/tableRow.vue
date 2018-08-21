<!-- 列表行插件 -->
<template>
    <div class="table-row">
       <slot></slot>
    </div>
</template>
<script>
import Vue from 'vue'
export default {
  name: 'v-row',
  props:['row','columns'],
  data () {
    return {
     
    }
  },
  mounted(){
    
  },
  // render(h){
  //    return h('div',
  //       {
  //         class:{
  //           'table-row':true,
  //         }
  //       },
  //       this.columns.map((column,index)=>{
  //          return h('div',{
  //              'class':{'table-row-item':true},
  //              'style':{'width':(100/this.columns.length)+'%'},
  //           },
  //           []);
  //       })
  //   );
  // }
}
</script>
<style scoped lang="less">
  @import './common.less';
  .table-row{height:@tableHeaderH;}
  .table-row-item{display:inline-block;height:@tableHeaderH;}
  .table-row-item:first-child{.border('bottom');.border('right');}
  .table-row-item:last-child{.border('bottom');}
  .table-row-item:not(:first-child):not(:last-child){.border('bottom');.border('right');}

</style>
