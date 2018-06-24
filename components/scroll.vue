<!-- 滚动条插件组件 -->
<template>
    <div class="Scroll" :id="id">
        <div class="scroll_container">
            <div class="slidee">
                <slot></slot>
            </div>
        </div>
        <div name="scrollBar" class="scrollbar" :style="scrollStyle || {}" v-show="blnShowScroll">
            <div class="handle"></div>
        </div> 
    </div>
</template>

<script>
import {BODY_RESIZE} from '../store/mutation-types'
export default {
  name: 'Scroll',
  props:['listen','store','scrollStyle'],
  watch:{
    listen:function(){
       this.$nextTick(()=>{
           this.reloadyScroll();
       });
    }
  },
  mounted(){
    this.id="scroll"+tool.guid();
    this.$nextTick(()=>{
        this.scrollDom=$('#'+this.id).find('div[name="scrollBar"]');
        this.initScroll();
    });
    this._store =this.$store || this.store;

    this._store.commit(BODY_RESIZE,{cb:(sub)=>{
       this.bodyResizeSub=sub
    },sub:()=>{
        setTimeout(()=>{
          this.reloadyScroll();
        },0);
    }});
 
  },
  beforeDestroy(){
    this.bodyResizeSub.unsubscribe();
  },
  data () {
    return {
      id:0,
      scrollIns:null,
      blnShowScroll:false,
      scrollDom:null,
      _store:null,
      bodyResizeSub:null,
    }
  },
  methods:{
    //初始化滚动条
    initScroll(){
     let self=this;
     let id=this.id;
     
     this.scrollIns = new Sly($(self.$el).find('.scroll_container'),{
        speed:200,
        scrollBy:50,
        scrollBar:`#${id} .scrollbar`,
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
    .Scroll{width:100%;height:100%;position:relative;}
    .Scroll .scroll_container{width:100%;height:100%;position: relative;}
    .Scroll .scrollbar:hover {cursor:pointer;}
    .Scroll .scrollbar { border:1px solid #d8d8d8;border-radius:5px;width: 10px; height: ~"calc(100% - 20px)"; position: absolute;right: 5px;top:10px;background:white;}
    .Scroll .scrollbar .handle {width: 100%;height: 100px;border-radius: 5px;}

    html{.TCol(~".Scroll .scrollbar .handle",'bg');}
</style>
