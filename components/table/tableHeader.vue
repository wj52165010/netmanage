<!-- 列表头插件 -->
<!--<template>
    <div class="table-header">
      <slot></slot>
    </div>
</template>-->

<script>

import cRow from './tableRow'

export default {
  name: 'v-table-header',
  props:['store'],
  data () {
    return {
      replaceFunc:null
    }
  },
  mounted(){
    let cols=_.map(_.filter(this.$slots.default,d=>d.tag),d=>{
      d.componentOptions.propsData.width=d.componentOptions.propsData.width || 0;
      d.data.attrs=d.data.attrs || {};
      d.data.attrs.width=d.data.attrs.width || 0;
      return d;
    });

    this.store.comit('insertColumn',cols,0);
  },
  render: function (createElement) {

    let  cols=_.filter(this.$slots.default,d=>d.tag);

    this.replaceCols(cols);

    return createElement(
      'div', 
      {
        class:{
          "table-header":true,
        },
        props:{
          store:this.store
        }
      },
      [
        createElement(cRow,{
          props:{
            store:this.store,
            columns:cols,
          }
        })
      ]
    )
  },
  computed:{
    columns(){return this.store.states.columns;}
  },
  methods:{
    replaceCols(cols){
      if(!this.replaceFunc){
        this.replaceFunc =  _.throttle(this.replaceStoreCol,200);
      }
    
      this.replaceFunc(cols);
    },
    replaceStoreCol(cols){
      console.log(cols);
      let  newCols=_.map(cols,d=>{
  
        let old =_.find(this.columns,c=>c.elm.id==d.elm.id) || d ;

        d.componentOptions.propsData.width=old.componentOptions.propsData.width || 0;
        d.data.attrs=d.data.attrs || {};
        d.data.attrs.width=old.data.attrs.width || 0;

        return d;
      });
      
      console.log(newCols);
      console.log('````````````````');


      this.store.comit('replaceColumn',newCols);
    }
  }

}
</script>
<style scoped lang="less">
  @import "../../css/variables.less";
  @import './common.less';
  .table-header{width:100%;height:@tableHeaderH;background-color:@tableHeaderBG;.border('bottom');}

  //设置列的边界线
  .table-header .table-column:first-child{.border('bottom');.border('right');}
  .table-header .table-column:last-child{.border('bottom');}
  .table-header .table-column:not(:first-child):not(:last-child){.border('bottom');.border('right');}

  html{.TCol(~".table-header .table-row ",'bg');}
</style>
