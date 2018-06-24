<!-- 内容标签页组件 -->
<template>
    <div class="LabelPage" :id="id">
        <header class="header">
            <span class="icon"><i class="fa fa-th"></i></span>
            <span class="title">{{title}}</span>
            <div v-if="!noBtn" class="btn-group btn-group-sm">
               <!-- <button type="button" class="btn btn-default"><i class="fa fa-plus"></i></button>
                <button type="button" class="btn btn-default"><i class="fa fa-repeat"></i></button>
                <button type="button" class="btn btn-default"><i class="fa fa-trash-o fa-lg"></i></button>-->
            </div>
        </header>
        <section class="content" :class="{blnPage:blnPage}">
           <div class="LabelPage_scrollContainer">
            <div class="slidee">
                 <component :is="page" ref="page" :data="data" :extraProp="pageProp" :actions="actions" v-on:triggerEvent="triggerEvent"></component>
            </div>
           </div>
           <div class="scrollbar LabelPage_scrollbar" :id="idscrollbar">
                <div class="handle"></div>
            </div>
        </section>
    </div>
</template>

<script>
import {BODY_RESIZE} from '../store/mutation-types'

export default {
  name: 'LabelPage',
  props:['title','page','data','noBtn','pageProp','actions'],
  data () {
    return {
        blnPage:false,
        id:null,
        idscrollbar:null,
        sly:null,
        bodyResizeSub:null,
    }
  },
  watch:{
      data(){
          this.$nextTick(()=>{
              this.reloadSly();
          });
      }
  },
  mounted(){
    this.id=this.guid();
    this.idscrollbar='scrollbar'+this.guid();
    this.$nextTick(()=>{
        this.sly=new Sly($('#'+this.id+' .LabelPage_scrollContainer'),{
            speed:200,
            scrollBy:50,
            scrollBar:$('#'+this.idscrollbar),
            dynamicHandle: 0,
            dragHandle: 1,
            mouseDragging: 0
        });
        this.sly.init();
        this.blnPage=this.sly.rel.slideeSize>this.sly.rel.frameSize;
    });

    this.$store.commit(BODY_RESIZE,{cb:(sub)=>{
       this.bodyResizeSub=sub
    },sub:()=>{
        this.reloadSly();
    }});
  },
  beforeDestroy(){
    this.bodyResizeSub.unsubscribe();
  },
  methods:{
      reloadSly(){
        this.$nextTick(()=>{
            setTimeout(()=>{
                this.sly.reload();
                this.blnPage=this.sly.rel.slideeSize>this.sly.rel.frameSize;
            },400);
        });
      },
      triggerEvent(){
        let paramArr=[];
         for(let i=1;i<arguments.length;i++){
             paramArr.push(arguments[i]);
         }
        this.$emit(arguments[0],...paramArr);
      },
      guid() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
      }
  }
}
</script>

<style scoped lang="less">
    @import "../css/variables.less";
    @_headerH:40px;
    @_contentH:~"calc(100% - @{_headerH})";
    @_iconR:-(10-@_headerH);
    .LabelPage{width:100%;height:100%;background-color:@FrontCol;border-radius:5px;}
    .LabelPage .header{
        height:@_headerH;.border('bottom');border-top-left-radius:5px;border-top-right-radius:5px;
        text-align:left;line-height:@_headerH;padding:0px 10px;
    }
    .LabelPage .content{
        height:@_contentH;text-align:left;position:relative;border-bottom-right-radius:5px;padding:0px 0px;
        // background:-webkit-linear-gradient(138deg, transparent 50%, rgba(255, 255, 255, 0.2) 99%,rgba(255, 255, 255, 0.2) 99.2%,@btn_Bg_Col_hover_1 99.2%);
        // background:linear-gradient(138deg, transparent 50%, rgba(255, 255, 255, 0.2) 99%,rgba(255, 255, 255, 0.2) 99.2%,@btn_Bg_Col_hover_1 99.2%);
    }
    .LabelPage .header .icon{
        display:inline-block;height:@_iconR;width:@_iconR;text-align:center;line-height:@_iconR;
        background-color:@btn_Bg_Col_hover_1;color:white;border-radius:50%;margin-right:5px;
    }

    .LabelPage .header .btn-group{float:right;margin-top:-(30-@_headerH)/2;}

    .LabelPage .content .LabelPage_scrollContainer{height:100%;width:100%;}

    .scrollbar:hover {cursor:pointer;}
    .scrollbar { border:1px solid @borderCol;border-radius:5px;width: 10px; height: ~'calc(100% - 20px)'; position: absolute;right: 10px;top: 0px;background:white;display:none;margin-top:10px;}
    .scrollbar .handle {width: 100%;height: 100px;background: @btn_Bg_Col_1;border-radius:5px;}

    .blnPage .scrollbar{display:block;}
</style>
