<!-- 导航组件 -->
<template>
    <div  v-show="show" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index: 100;">
        <div style="display:table;width: 100%;height: 100%;">
            <div style="display: table-cell;vertical-align: middle;text-align: center;">
                <i class="fa fa-spinner fa-pulse"></i>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Loading',
  data () {
    return {
      show:true,
    }
  },
  methods:{
    blnShow(b){
        this.show=b;
    }
  }
}
</script>
<style scoped lang="less">
  
</style>
