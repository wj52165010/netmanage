<!-- 舆情个人详细页面 -->
<template>
    <div class="PublicOpiDetail">
        <!--基本信息-->
        <div class="baseInfo"></div>
        <!--列表信息-->
        <div class="listInfo"></div>
    </div>
</template>

<script>
export default {
  name: 'PublicOpiDetail',
  data () {
    return {
      
    }
  }
}
</script>

<style scoped lang="less">
  .PublicOpiDetail{width:100%;height:100%;}
  
  @baseInfoH:200px;
  .PublicOpiDetail .baseInfo{width:100%;height:@baseInfoH;}
</style>
