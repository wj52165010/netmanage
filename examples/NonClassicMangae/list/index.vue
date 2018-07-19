<!-- 列表页主页组件 -->
<template>
    <div class="ListIndex">
       <div class="ListIndex_container">

        <PlaceList ref="PlaceList"/>

       </div>
    </div>
</template>

<script>

import PlaceList from './PlaceList';

export default {
  name: 'ListIndex',
  components:{PlaceList},
  data () {
    return {
      blnmouseover:false,
    }
  },
  mounted(){
    this.layout();
  },
  methods:{
    layout(){
        this.$refs.PlaceList && this.$refs.PlaceList.layout();
    }
  }
}
</script>

<style scoped lang="less">
@import "../../../css/variables.less";
.ListIndex{width:100%;height:100%;padding:5px;}
.ListIndex_container{width:100%;height:100%;background-color:white;position:relative;}

.ListIndex .switchBtn{
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

html{.TCol(~".ListIndex .switchBtn",'bg');}
</style>
