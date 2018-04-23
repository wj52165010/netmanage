<!-- 列表行插件 -->
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
    
    //console.log(this.columns);
  },
  render(h){
     return h('div',
        this.columns.map((column,index)=>{
           return h('div',{
               'class':{'table-row-item':true},
               'style':{'width':(100/this.columns.length)+'%'},
            },
            [column.renderCell.call(this._renderProxy, h, { row:this.row, _self: this.context || this.$parent.$vnode.context })]);
        })
    );
  }
}
</script>
<style scoped lang="less">
  @import './common.less';
  .table-row-item{display:inline-block;height:@tableHeaderH;}
  .table-row-item:first-child{.border('bottom');.border('right');}
  .table-row-item:last-child{.border('bottom');}
  .table-row-item:not(:first-child):not(:last-child){.border('bottom');.border('right');}

</style>
