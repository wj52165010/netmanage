<!-- 列表体插件 -->
<template>
    <div class="tableBbody">
       <slot></slot>
    </div>
</template>

<script>
import Vue from 'vue'
import cRow from './tableRow'

export default {
  name: 'v-table-body',
  props:['data','store'],
  data () {
    return {
    }
  },
  mounted(){
    
  },
  // render: function (createElement) {

  //   let rows=_.filter(this.$slots.default,d=>d.tag);
  //   let data=this.data;
  //   return createElement(
  //     'div', 
  //     {
  //       class:{
  //         tableBbody:true,
  //       }
  //     },
  //     _.map(rows,(r,i)=>createElement(cRow,{
  //       props:{
  //         columns:rows,
  //         row:data[i]
  //       }
  //       })
  //     )
  //   )
  // },
  methods:{
      clickHandler(){
        //console.log(this.row);
      }
  }
}
</script>
<style lang="less">
  @import './common.less';
  .tableBbody{width:100%;height:100%;background-color:@tableBodyBG;}
</style>

