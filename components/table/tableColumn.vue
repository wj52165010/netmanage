<!-- 列表列插件 -->
<template>
  <div class="table-column" @click="click()">
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
    click(){
      this.$emit('click');
    }
  },
  mounted(){
    
  }
}
</script>
<style scoped lang="less">
  .table-column{display:inline-block;height:100%;width:100%;}
</style>
