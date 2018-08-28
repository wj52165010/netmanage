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
  props:['store','style'],
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
          },
          style:Object.assign({},this.style)
        })
      ]
    )
  },
  computed:{
    columns(){return this.store.states.columns;},
  },
  methods:{
    replaceCols(cols){
      if(!this.replaceFunc){
        this.replaceFunc =  _.throttle(this.replaceStoreCol,200);
      }
    
      this.replaceFunc(cols);
    },
    replaceStoreCol(cols){

      if(this.columns.length<=0) return;
      //if(!cols[0].elm) return;
          
      let  newCols=_.map(cols,(d,i)=>{

        d.componentOptions.propsData.width=this.columns[i].componentOptions.propsData.width || 0;
        d.data.attrs=d.data.attrs || {};
        d.data.attrs.width=this.columns[i].data.attrs.width || 0;


        return d;
      });
      

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

  .table-header .table-row {color:white;}

  html{.TCol(~".table-header .table-row ",'bg');}
</style>
