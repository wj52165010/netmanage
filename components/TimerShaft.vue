<!-- 时间轴组件 -->
<template>
    <div class="timerShaft" :class="{blnPage:blnPage}">
        <div class="scrollBar_container">
            <div class="slidee">
                <div v-for="(item,index) in data" :style="{height:index==0?node_space+20+'px':data.length-1==index?70+'px':node_space+'px'}">
                    <div class="node" @click="item_click(item.index)" :class="{active:activeIndex==item.index}" :style="{top:(index*node_space+20)+'px'}">
                        <el-tooltip style="cursor:pointer;" class="item" effect="light" :content="item.name" placement="right">
                            <div class="container">
                                <i :class="item.icon" class="icon">
                                </i>
                                <div class="Hline" :style="{height:data.length==(index+1)?'0px':'50px'}"></div>
                                <div class="number">{{index+1}}</div>
                                <!--<i v-if="data.length-1!=index" class="fa fa-chevron-down arrow"></i>-->
                            </div>
                        </el-tooltip>
                    </div>
                </div>
            </div>
        </div>
        <div class="scrollbar">
            <div class="handle"></div>
        </div>
    </div>
</template>

<script>
import {BODY_RESIZE} from '../store/mutation-types'
let sly=null;
export default {
  name: 'TimerShaft',
  props:['data','beforeClick'],
  data () {
    return {
      node_space:100, //节点间隔
      activeIndex:0,   //活动节点索引
      blnPage:false
    }
  },
  watch:{
    data(){
        this.$nextTick(()=>{
            sly.reload();
            this.blnPage=sly.pages.length>1;
        });
    }
  },
  methods:{
      item_click(index){
          if(this.beforeClick && this.beforeClick(index)){return;}
          this.activeIndex=index;
          this.$emit('timerClick',index);
      },
      active(index){
          this.activeIndex=index;
      }
  },
  mounted(){
    sly=new Sly($('.timerShaft > .scrollBar_container'),{
        itemNav: "basic",
        speed:200,
        scrollBy:1,
        scrollBar:'.timerShaft > .scrollbar',
        dragHandle:true,
        dynamicHandle:true,
        smart:1});
        sly.init();

    this.blnPage=sly.pages.length>1;
    this.$store.commit(BODY_RESIZE,()=>{
      sly.reload();
      this.blnPage=sly.pages.length>1;
    });
  }
}
</script>

<style scoped lang="less">
    @import "../css/variables.less";
    @timerLineW:4px;
    @timerLineCol:shade(@BgCol,5%);
    @nodeR:50px;//节点半径
    @nodeCol:shade(@BgCol,5%);


    .timerShaft{position:relative;padding-top:0px;height:100%;}
    .timerShaft .scrollBar_container{height:100%;}
    //.timerShaft .active{background-color:@Font_Hover_Col !important;}
    
    html{.TColIm(~".timerShaft .active",'bg');}

    .timerShaft .Hline{
        position:absolute;
        width:@timerLineW;
        height:100%;
        left:50%;
        margin-left:-(@timerLineW/2);
        background-color:@timerLineCol;
    }

    .timerShaft .node{
        position:absolute;
        height:@nodeR;
        width:@nodeR;
        background-color:@nodeCol;
        border-radius:50%;
        left:50%;
        margin-left:-(@nodeR/2);
        line-height:@nodeR;
        font-size:20px;
        z-index:100;
        cursor:pointer;
        color:white;
        .trans(.3s);
    }
    // .timerShaft .node:hover{
    //     background-color:@Font_Hover_Col;
    // }
    html{.TCol(~".timerShaft .node:hover",'bg');}
    .timerShaft .node:hover .icon{
        -webkit-animation: toRightFromLeft 0.3s forwards;
        -moz-animation: toRightFromLeft 0.3s forwards;
        animation: toRightFromLeft 0.3s forwards;
    }

    .timerShaft .node .container{width:@nodeR;height:100%;padding:0px;position:relative;}

    .timerShaft .node .container .number{
        position: absolute;
        top: -5px;
        width: 20px;
        height: 20px;
        background-color:@btn_Bg_Col_hover_2;
        line-height: 20px;
        border-radius: 50%;
        left: -5px;
        font-size: 12px;
        font-weight: 600;
    }
    .timerShaft .node .container .arrow{position:absolute;bottom: -54px;color:@timerLineCol;left:15px;}

    .scrollbar:hover {cursor:pointer;}
    .scrollbar { width: 10px; height: 100%; position: absolute;right: 0px;top: 0px;background: #ccc;display:none;}
    .scrollbar .handle {width: 100%;height: 100px;background: @btn_Bg_Col_1;}

    .blnPage .scrollbar{display:block;}

    @-webkit-keyframes toRightFromLeft {
        49% {
            -webkit-transform: translate(100%);
        }
        50% {
            opacity: 0;
            -webkit-transform: translate(-100%);
        }
        51% {
            opacity: 1;
        }
    }
    @-moz-keyframes toRightFromLeft {
        49% {
            -moz-transform: translate(100%);
        }
        50% {
            opacity: 0;
            -moz-transform: translate(-100%);
        }
        51% {
            opacity: 1;
        }
    }
    @keyframes toRightFromLeft {
        49% {
            transform: translate(100%);
        }
        50% {
            opacity: 0;
            transform: translate(-100%);
        }
        51% {
            opacity: 1;
        }
    }
</style>
