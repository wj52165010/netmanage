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
  props:['listen','blnLoading','base'],
  data () {
    return {
      store:new TableStore(),
    }
  },
  render: function (createElement) {
    let self=this,
        props={
          listen:this.listen,
          store:this.store,
          blnLoading:this.blnLoading,
        };
    this.$slots.default[0].componentOptions.propsData=Object.assign({},this.$slots.default[0].componentOptions.propsData || {},props,{style:this.$slots.default[0].data.style || {}});//设置Props属性值
    this.$slots.default[2].componentOptions.propsData=Object.assign({},this.$slots.default[2].componentOptions.propsData || {},props);


    return createElement(
      'div', 
      {
        class:{
          table:true,
        },
        props:{
          listen:this.listen
        },
        on:{
          mousemove:this.mousemove,
          mouseup:this.mouseup
        },
        attrs: {
          
        },
        style:{
          'border-top':this.base?'none':false,
          'border-left':this.base?'none':false,
          'border-right':this.base?'none':false,
          'border-bottom':this.base?'none':false
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
    this.store.comit('showWay',this.base);
  },
  methods:{
    mouseup(e){
      let mouseup=this.$slots.default[0].child.$children[0].header_mouseup;
      mouseup(e,$(this.$el).width());
      $(this.$el).removeClass('unselect');
    },
    mousemove(e){
      let mousemove=this.$slots.default[0].child.$children[0].mousemove;

      if(mousemove(e)){
        $(this.$el).addClass('unselect');
      }
      
    },
    reloadScroll(){
      this.$slots.default[2].child.$children[0].reloadyScroll();
    }
  }
}
</script>
<style scoped lang="less">
  @import './common.less';
  .table{width:100%;height:100%;margin:0px;text-align:left;.border("");position:relative;}
  .table .hiddencolumns{display:none;position:absolute;z-index:-1;}
  .table .table-body{height:~"calc(100% - @{tableHeaderH})"}

  .unselect {
    -webkit-user-select: none; 
    -moz-user-select: none;    
    -khtml-user-select: none;  
    -ms-user-select: none;    

    /* 以下两个属性目前并未支持，写在这里为了减少风险 */
    -o-user-select: none;
    user-select: none;  
  }
</style>
