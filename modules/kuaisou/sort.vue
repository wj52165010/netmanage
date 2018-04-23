<!-- 快搜配置页面排序配置页 -->
<template>
    <div class="KSearchSort">
        <div style="height:100%;">
          <Scroll>

          </Scroll>
        </div>
    </div>
</template>

<script>
import Scroll from 'components/scroll'
export default {
  name: 'KSearchSort',
  components:{Scroll},
  data () {
    return {
     
    }
  }
}
</script>

<style scoped lang="less">
     @import "../../css/variables.less";
     .KSearchSort{width:100%;height:100%;background-color:white;}
</style>
