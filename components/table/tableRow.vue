<!-- 列表行插件 -->
<!--<template>
    <div class="table-row">
       <slot></slot>
    </div>
</template>-->
<script>
import Vue from 'vue'
export default {
  name: 'v-row',
  props:['columns','store'],
  data () {
    return {
     
    }
  },
  mounted(){
    
  },
  render(h){
     let columns=this.cols || [];
     let colContent=this.columns || [];
     let slots=_.filter(this.$slots.default,d=>d.tag);
     let fixWTotal=_.reduce(this.cols,(memo,d)=>{return memo+ (d.data.attrs || {width:0}).width},0);
     console.log(fixWTotal);

     return h('div',
        {
          class:{
            'table-row':true,
          }
        },
        columns.map((column,index)=>{
           let {width} =  this.cols[index].data.attrs || {};

           
           return h('div',{
               'class':{'table-row-item':true},
               'style':{'width':(100/columns.length)+'%'},
            },
            [
              colContent[index] || slots[index] || ''
            ]);
        })
    );
  },
  computed:{
    cols(){return this.store.states.columns;}
  }
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
