<!-- 态势感知页面组件 -->
<template>
    <div class="StatePerception">
        <div class="StatePerception_container">
            <HTag :tags="pages" @change="tagChange">
                <!--分析页面-->
                <div slot="t0" style="height:100%;width:100%;">
                    分析页面
                </div>
                
                <!--列表页面-->
                <div slot="t1" style="height:100%;width:100%;">
                    <List ref="list" />
                </div>
            </HTag>
        </div>
    </div>
</template>

<script>
import HTag from 'components/HTag'
import List from './list'

export default {
  name: 'StatePerception',
  components:{HTag,List},
  data () {
    return {
      pages:[{name:'分析',icon:'fa fa-cogs'},{name:'列表',icon:'fa fa-bars'}],
    }
  },
  methods:{
    tagChange(i){
        this.$nextTick(()=>{
           this.$refs.list.layout();
        })
    }
  }
}
</script>

<style scoped lang="less">
  @import "../../css/variables.less";
  .StatePerception{width:100%;height:100%;padding:5px;}
  .StatePerception .StatePerception_container{width:100%;height:100%;background-color:white;}
</style>
