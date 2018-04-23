<!-- 垂直翻页组件 -->
<template>
    <div class="vpaging">
        <div class="slidee">
            <div class="page" :style="{height:pageH+'px'}" v-for="page in data">
               <component :is="page" ref="pages"></component>
            </div>
        </div>
    </div>
</template>

<script>
import {BODY_RESIZE} from '../store/mutation-types'

export default {
  name: 'VPaging',
  props:['data'],
  data () {
    return {
        pageH:0,//页面高度
        sly:null,
        curIndex:-1,
    }
  },
  methods:{
    reloadSly(){
        for(let item of this.$refs.pages){
            if(item.reloadSly){
                item.reloadSly();
            }
            if(item.reloadSortComp){
                item.reloadSortComp();
            }
        }
        this.sly.reload();
    },
    activePage(index){
        this.curIndex=index;
        this.sly.activatePage(this.curIndex);
        for(let page of this.$refs.pages){
            if(page.reloadSortComp){
                page.reloadSortComp();
            }
        }
    }
  },
  mounted(){
    this.pageH =$('.vpaging').height();
    this.$nextTick(()=>{
        this.sly=new Sly($('.vpaging'),{
            itemNav: "basic",
            speed:200,
            scrollBy:0,
            dragHandle:true,
            dynamicHandle:true,
            smart:1
        });
        this.sly.init();
    });
    
    this.$store.commit(BODY_RESIZE,()=>{
        if($(this.$el).parents('div[id="setting"]').css('display')=='block'){
            this.pageH =$('.vpaging').height();
             this.$nextTick(()=>{
                this.reloadSly();
                this.activePage(this.curIndex);
             });
        }
    });
  }
}
</script>

<style scoped lang="less">
 @import "../css/variables.less";
 .vpaging{width:100%;height:100%;}
 .vpaging .page{height:100%;padding:0px;}
</style>
