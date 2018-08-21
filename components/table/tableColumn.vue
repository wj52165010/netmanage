<!-- 列表列插件 -->
<template>
  <div class="table-column">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'v-table-column',
  props:['label'],
  data () {
    return {
    }
  },
  computed:{
  
  },
  methods:{
  
  },
  mounted(){
    
  }
}
</script>
<style scoped lang="less">
  .table-column{display:inline-block;}
</style>
