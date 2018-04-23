<!-- 基础组件 -->
<template>
    <div class="basecom">
        {{msg}}
    </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    props:{propMessage:String}
})

export default class baseCom extends Vue {
  msg=1234132;
  test(){console.log('基础');}
}
</script>

<style scoped lang="less">
  
</style>
