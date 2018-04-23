<!-- 场所搜索结果展示插件 -->
<template>
    <div class="placeSearchTable">
        <div class="scrollContainer">
            <div class="slidee">
                <div v-if="data && data.length<=0" style="text-align:center;padding:10px 0px;">暂无数据</div>
                <table v-if="data && data.length>0" class="table table-bordered table-hover">
                    <tbody>
                        <tr v-for="item in data" @click="rowClick(item)">
                            <td style="width:100px;">{{item.code}}</td>
                            <td>{{item.note}}</td>
                            <td style="width:60px;text-align:center;">查看</td>
                        </tr>
                    </tbody>
                </table>
            </div>
         </div>
         <div name="scrollBar" class="scrollbar" v-show="blnShowScroll">
            <div class="handle"></div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'placeSearchTable',
  props:['data'],
  data () {
    return {
     blnShowScroll:false,
     scrollIns:null,
     scrollDom:null,
    }
  },
  watch:{
    data(){
        this.$nextTick(()=>{
            this.reloadyScroll();
        });
    }
  },
  mounted(){
    this.scrollDom=$('div[class="placeSearchTable"] > div[name="scrollBar"]');
    this.initScroll();
  },
  methods:{
    rowClick(val){
        this.$emit('rowClick',val);
    },
    //初始化滚动条
    initScroll(){
     this.scrollIns = new Sly($('.placeSearchTable .scrollContainer'),{
        speed:200,
        scrollBy:50,
        scrollBar:'.placeSearchTable .scrollbar',
        dynamicHandle: 0,
        dragHandle: 1,
        mouseDragging: 0});
      
      setTimeout(()=>{
            this.scrollIns.init();
            this.reloadyScroll();
      },0); 

    },
    //重新计算滚动条高度
    reloadyScroll(){
      this.scrollIns.reload();
      this.blnShowScroll=this.scrollIns.rel.slideeSize-10>this.scrollIns.rel.frameSize;
      this.setScrollH();
      this.scrollIns.reload();
    },
    //设置滚动条高度
    setScrollH(){
      let scrollContainerH=this.scrollDom.height();
      let gap=(this.scrollIns.rel.slideeSize-this.scrollIns.rel.frameSize)*(this.scrollIns.rel.frameSize/this.scrollIns.rel.slideeSize);
      this.scrollDom.find('.handle').css('height',(scrollContainerH-gap)<20?20:(scrollContainerH-gap)+'px');
    }
  }
}
</script>

<style scoped lang="less">
  @import "../css/variables.less";
    //下拉框样式
  .scrollContainer{width:100%;height:100%;position: relative;}
  .scrollbar:hover {cursor:pointer;}
  .scrollbar { border:1px solid @borderCol;border-radius:5px;width: 10px; height: ~"calc(100% - 20px)"; position: absolute;right: 5px;top:0px;background:white;margin-top:10px;}
  .scrollbar .handle {width: 100%;height: 100px;background: @btn_Bg_Col_1;}

  .blnPage .scrollbar{display:block;}
</style>
