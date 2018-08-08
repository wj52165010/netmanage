<!-- 列表页主页组件 -->
<template>
    <div class="ListIndex">
       <div class="ListIndex_container">

        <PlaceList ref="PlaceList" v-show="showPage=='place'" />
        <DeviecList ref="DeviecList" v-show="showPage!='place'" />

        <!--切换按钮-->
        <div class="switchBtn" @click="switchList()" @mouseover="blnmouseover=true" @mouseleave="blnmouseover=false" :style="{
            height:blnmouseover?'auto':'30px',
            'line-height':blnmouseover?'15px':'30px',
            'padding':blnmouseover?'10px 5px':'0px',
            'top':blnmouseover?'0px':'20px',
            'width':blnmouseover?'30px':'20px'
            }">
          <i class="fa fa-exchange" v-if="!blnmouseover" />
          <span v-if="blnmouseover">{{showPage=='place'?'切换至设备':'切换至场所'}}</span>
        </div>
       
       </div>
    </div>
</template>

<script>

import PlaceList from './PlaceList';
import DeviecList from './DeviecList'

export default {
  name: 'ListIndex',
  components:{PlaceList,DeviecList},
  data () {
    return {
      showPage:'place',
      blnmouseover:false,
    }
  },
  watch:{
    showPage(){
      this.$nextTick(()=>{
        this.showPage=='place' && this.$refs.PlaceList && this.$refs.PlaceList.layout();
        this.showPage!='place' && this.$refs.DeviecList && this.$refs.DeviecList.layout();
      });
    }
  },
  mounted(){
    this.layout();
  },
  methods:{
    layout(){
        this.$refs.PlaceList && this.$refs.PlaceList.layout();
        this.$refs.DeviecList && this.$refs.DeviecList.layout();
    },
    //切换列表
    switchList(){
      if(!this.blnmouseover) return;
      this.showPage=this.showPage=='place'?'deviece':'place';
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
