<!-- 列表页主页组件 -->
<template>
    <div class="Analysis">
       <div class="Analysis_container">

        <PlaceAnalysis ref="PlaceList" />

       
       </div>
    </div>
</template>

<script>

import PlaceAnalysis from './PlaceAnalysis';

export default {
  name: 'Analysis',
  components:{PlaceAnalysis},
  data () {
    return {
    }
  },

  mounted(){
    this.layout();
  },
  methods:{
    layout(){
        this.$refs.PlaceList && this.$refs.PlaceList.layout();
    },
  }
}
</script>

<style scoped lang="less">
@import "../../../css/variables.less";
.Analysis{width:100%;height:100%;padding:5px;}
.Analysis_container{width:100%;height:100%;background-color:white;position:relative;}

.Analysis .switchBtn{
  position:absolute;
  width: 15px;
  height: 40px;
  color: white;
  right: -10px;
  top: 20px;
  line-height: 40px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  font-size: 12px;
  cursor:pointer;
  z-index:1000;
}

html{.TCol(~".Analysis .switchBtn",'bg');}
</style>
