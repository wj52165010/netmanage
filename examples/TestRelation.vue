<!-- 关系展示组件 -->
<template>
    <div class="TestRelation">
        <div class="left">
        </div>
        <div class="right">
          <div style="padding:100px 0px;height:100%;">
                <Relation />
          </div>
        </div>
    </div>
</template>

<script>
import Relation from './Relation.example'
export default {
  name: 'TestRelation',
  components:{Relation},
  data () {
   
  },

}
</script>

<style scoped lang="less">
  @import "../css/variables.less";
  .TestRelation{width:100%;height:100%;}
  .TestRelation .left{width:200px;float:left;.border('right');height:100%;}
  .TestRelation .right{margin-left:200px;margin-righ:0px;height:100%;}
</style>
