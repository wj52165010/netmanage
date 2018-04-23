<!-- 列表体插件 -->
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
  computed:{
    columns(){return this.store.states.columns;}
  },
  render(h){

    let _self=this;
    return h('div',
              this.data.map((item,index)=>{
                return h(cRow,{props:{columns:_self.columns,row:item}});
              })
            );
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
    
</style>

