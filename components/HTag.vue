<!--水平Tag插件-->
<template>
    <div class="HTag">
        <div class="arrow_left fadeIn" @click="left_arrow()" v-if="blnPage"><i class="fa fa-chevron-left"></i></div>
        <div class="arrow_right fadeIn" @click="right_arrow()" v-if="blnPage"><i class="fa fa-chevron-right"></i></div>
        <div class="slide_container" :class="{pageMore:blnPage}">
            <div class="tag_header">
                <div v-for="(t,i) in tags" class="tag_item" :class="{active:curIndex==i}" @click="tagClick(i,t)" :title="t.tip || ''">
                    <i :class="t.icon" style="margin-right:5px;"></i>{{t.name}}<i class="fa fa-remove" style="margin-left:5px;" @click.stop="remove(t)" v-if="t.blnRemove"></i>
                </div>
            </div>
        </div>
        <div v-for="(t,i) in tags" v-show="curIndex==i" class="item" :class="{fadeIn:curIndex==i}">
            <slot :name="'t'+i"></slot>
        </div>
    </div>
</template>

<script>
import {BODY_RESIZE} from '../store/mutation-types'
export default {
  name: 'HTag',
  props:['tags','index'],
  data () {
    return {
        curIndex:0,
        sly:null,
        blnPage:false,
    }
  },
  watch:{
    index(){
        this.curIndex=this.index;
    },
    tags(){
        this.$nextTick(()=>{
            this.sly.reload();
            this.blnPage=this.sly.pages.length>1;
        });
    }
  },
  mounted(){
      this.curIndex=this.index==undefined?this.curIndex:this.index;
      setTimeout(()=>{
        this.initSly();
      },1000);
      
  },
  methods:{
    //初始化滚动插件
    initSly(){
        this.sly=new Sly($(this.$el).find('.slide_container'),{
                horizontal: 1,
                itemNav: "basic",
                speed:300,
                smart:true,
                startAt: 0,
                scrollBy: 1
            });
            this.sly.init();
            this.blnPage=this.sly.pages.length>1;
            
        this.$store.commit(BODY_RESIZE,()=>{
            this.sly.reload();
            this.sly.reload();
            this.blnPage=this.sly.pages.length>1;
        });
        
    },
    left_arrow(){
      this.sly.prevPage();
    },
    right_arrow(){
      this.sly.nextPage();
    },
    tagClick(i,d){
        if(d.disable){return;}
        this.curIndex=i;
        this.$nextTick(()=>{
            this.$emit('change',i);
        });
    },
    //定位到Tag
    posTag(i){
        this.curIndex=i;
        this.$nextTick(()=>{
            this.$emit('change',i);
        });
    },
    //删除
    remove(item){
        this.$emit('remove',item)
    }
  }
}
</script>

<style scoped lang="less">
 @import "../css/variables.less";
 .HTag{width:100%;height:100%;position:relative;}
 @tagH:40px;
 .HTag .tag_header{height:@tagH;width:100%;text-align:left;padding:0px 10px;}

//  .HTag .tag_item{
//      float:left;height:@tagH/4*3;line-height:@tagH/4*3;.border('');border-bottom:none;padding:0px 10px;
//      margin-top:@tagH/4*1;margin-left:10px;font-size:12px;position:relative;border-top-left-radius:5px;border-top-right-radius:5px;
//      color:@FontCol;
//     }

.HTag .slide_container{position:relative;}
.HTag .slide_container:before{
    content:'';
    position:absolute;
    bottom:0px;
    left:0px;
    height:1px;
    width:100%;
    background-color:@borderCol;
}
.HTag .tag_item{
     float:left;height:@tagH/4*3;line-height:@tagH/4*3;.border('');border-bottom:none;padding:0px 10px;
     margin-top:@tagH/4*1;margin-right:10px;font-size:12px;position:relative;border-top-left-radius:5px;border-top-right-radius:5px;
     color:@FontCol;
    }
 .HTag .tag_item.active:before{content:'';width: 100%;height: 2px;position: absolute;background-color: white;left: 0px;bottom: -1px;}
 .HTag .tag_item:hover{cursor:pointer;color:white;}
 html{.TCol(~".HTag .tag_item:hover",'bg');}
 .HTag .tag_item.active:after{content:'';width: 100%;height: 2px;position: absolute;left:0px;top:0px;}
 html{.TCol(~".HTag .tag_item.active:after",'bg');}

 .HTag .item{height:~'calc(100% -  @{tagH})';width:100%;}
 
 
 .HTag .arrow_left{
    position: absolute;
    width: 15px;
    height: 28px;
    left: 0px;
    top: 11px;
    z-index: 100;
    line-height: 28px;
    text-align: center;
    color:white;
    font-size:12px;
    z-index:100;
  }

  html{.TColAdd(~'.HTag .arrow_left','bg')}

  .HTag .arrow_left:hover{cursor:pointer;}
  html{.TCol(~'.HTag .arrow_left:hover','bg')}
 .HTag .arrow_right{
    position: absolute;
    width: 15px;
    height: 28px;
    right: 0px;
    top: 10px;
    z-index: 100;
    line-height: 28px;
    background: red;
    text-align: center;
    color:white;
    font-size:12px;
    z-index:100;
 }

 html{.TColAdd(~'.HTag .arrow_right','bg')}

 .HTag .arrow_right:hover{cursor:pointer;}
 html{.TCol(~'.HTag .arrow_right:hover','bg')}
</style>

