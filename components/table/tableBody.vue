<!-- 列表体插件 -->
<!--<template>
    <div class="tableBbody">
       <slot></slot>
    </div>
</template>-->

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
    console.log(this.data);
  },
  render: function (createElement) {
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
  methods:{
      clickHandler(){
        //console.log(this.row);
      }
  }
}
</script>
<style lang="less">
  @import './common.less';
  .tableBbody{width:100%;height:100%;}
</style>

