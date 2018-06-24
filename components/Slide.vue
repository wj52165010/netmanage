<!-- 幻灯片组件 -->
<template>
    <div class="Slide_Container">
        <div class="Slide">
            <ul class="slidee">
                <slot></slot>
                <!--<li>
                    <h2>1</h2>
                    <p>...can be anything. <strong>Anything!</strong></p>
                </li> -->
            </ul>
        </div>

        <!--分页按钮-->
        <div class="pages" v-if="itemNav=='forceCentered'?pages.length>3:true">
            <span v-for="(p,i) in pages" class="item" :class="{active:i==curPageIndex}" @click="pageChange(i)"></span>
        </div>
        <!--前进/后退按钮-->
        <div class="before_Btn" @click="pageChange(curPageIndex-1)"><i class="fa fa-angle-left"></i></div>
        <div class="back_Btn" @click="pageChange(curPageIndex+1)"><i class="fa fa-angle-right"></i></div>
    </div>
</template>

<script>
import {BODY_RESIZE} from '../store/mutation-types'
export default {
  name: 'Slide',
  props:['listen'],
  watch:{
    listen:function(){
       this.$nextTick(()=>{
          this.sly.reload();
          this.pages=this.sly.pages;
       });
    }
  },
  data () {
    return {
      bodyResizeSub:null,
      sly:null,
      pages:[],
      curPageIndex:1,
      itemNav:'forceCentered'
    }
  },
  mounted(){
    this.sly=new Sly($(this.$el).find('.Slide'),{
        horizontal: 1,
        itemNav: this.itemNav,
        speed:300,
        mouseDragging: 1,
        startAt: this.curPageIndex,
        scrollBy: 1
    });
    this.sly.init();
    this.pages = this.sly.pages;

    this.sly.on('activePage',(eventName,i)=>{
        this.curPageIndex=i;
    });

    this.$store.commit(BODY_RESIZE,{cb:(sub)=>{
       this.bodyResizeSub=sub
    },sub:()=>{
      this.sly.reload();
      this.pages=this.sly.pages;
    }});

    // this.$store.commit(BODY_RESIZE,()=>{
    //   this.sly.reload();
    //   this.pages=this.sly.pages;
    // });
  },
  beforeDestroy(){
    this.bodyResizeSub.unsubscribe();
  },
  methods:{
      reload(){
        this.sly.reload();
        this.pages=this.sly.pages;
      },
      pageChange(i){
          i=i >= this.sly.pages.length?this.sly.pages.length-1 : i;
          i=i || 0;
          this.curPageIndex=i;
          this.sly.activatePage(i);
      }
  }
}
</script>

<style scoped lang="less">
@import "../css/variables.less";

@PageH:30px;
@btnH:60px;
@btnW:30px;

.Slide_Container{width:100%;height:100%;position:relative;}
.Slide { width: ~'calc(100% - @{btnW}*2 - 40px)'; height:~'calc(100% - @{PageH} )'; padding: 0;margin-left:@btnW+20px; }
.Slide .slidee { margin: 0; padding: 0; height: 100%; list-style: none;cursor:pointer;padding-bottom:10px; }
.Slide .slidee li { float: left; height: 100%; }

.pages{width:100%;height:@PageH;text-align:center;line-height:@PageH;}
.pages .item{display:inline-block;width:@PageH/2;height:@PageH/2;border-radius:50%;.border('',gray);margin-left:10px;cursor:pointer;}
//.pages .item.active{background-color:@Font_Hover_Col;}
html{.TCol(~".pages .item.active",'bg');}

.before_Btn{position:absolute;height:@btnH;width:@btnW;line-height:@btnH;text-align:center;top:50%;margin-top:-@btnH/2;left:10px;font-size:30px;font-weight:600;}
.back_Btn{position:absolute;height:@btnH;width:@btnW;line-height:@btnH;text-align:center;top:50%;margin-top:-@btnH/2;right:10px;font-size:30px;font-weight:600;}
.before_Btn:hover,.back_Btn:hover{background-color:rgba(0,0,0,.3);cursor:pointer;color:white;.trans();border-radius:5px;}
</style>
