<!-- 水平翻页组件 -->
<template>
    <div class="navPage">
        <transition-group name="component" tag="div" class="component_container">
            <component v-for="(page,index) in data" :is="page.name || ''" :params="page.params || {}"  v-bind:key="page" class="component-item" ref="pages"  v-show="curIndex==index"></component>
        </transition-group>
    </div>
</template>

<script>
import {Trigger_RESIZE} from '../store/mutation-types'
export default {
  name: 'NavPage',
  data () {
    return {
        data:[],
        pageW:0,//页面宽度
        pageH:0,
        curIndex:'',//当前页面
        sly:null
    }
  },
  methods:{
    activePage(page){
        let self=this,index=-1;
        for(let i=0;i<self.data.length;i++){
            if(self.data[i].id==page.id){index=i;break;}
        }

        if(index>=0){
            //存在则直接跳转
            this.curIndex=index;
        }else{
            //不存在则创建
            this.data.push(page);
            this.$nextTick(()=>{
                this.curIndex=this.data.length-1;
            });
        }

        this.$nextTick(()=>{
          setTimeout(()=>{
              this.$store.commit(Trigger_RESIZE);
              $(window).resize();
          },0);
          setTimeout(()=>{
              this.$store.commit(Trigger_RESIZE);
          },10);
        });
    },
    delPage(page){

        let index=-1,self=this,activeItem=self.data[self.curIndex];
        for(let i=0;i<self.data.length;i++){
            if(self.data[i].id==page.id){index=i;break;}
        }

        if(index<0){return;}
        if(this.$refs.pages[index] && this.$refs.pages[index].destroy){this.$refs.pages[index].destroy();}
        this.data.splice(index,1);
        //获取当前激活项的索引
        if(activeItem){
            for(let i=0;i<self.data.length;i++){
                if(self.data[i].id==activeItem.id){self.curIndex=i;break;}
            }
        }
    },
    //刷新页面
    refresh(index){
        if(!(this.$refs.pages[index] && this.$refs.pages[index].refreshPage))return;
        this.$refs.pages[index].refreshPage();
    }
  },
  mounted(){
  }
}
</script>

<style scoped lang="less">
 @import "../css/variables.less";
 .navPage{width:100%;height:100%;}
 .navPage .component_container{width:100%;height:100%;box-shadow: 1px 1px 2px #23272c inset, -1px -1px 2px #222222 inset;}
 .component-enter-active{
     animation: FadeInRight .5s;
 }

@keyframes FadeInRight
{
    0% {opacity:0;transform: translateX(40px);}
    100% {opacity: 1;transform: translateX(0px);}
}

@-moz-keyframes FadeInRight 
{
    0% {opacity:0;transform: translateX(40px);}
    100% {opacity: 1;transform: translateX('0px');}
}

@-webkit-keyframes FadeInRight 
{
    0% {opacity:0;transform: translateX(0px);}
    100% {opacity: 1;transform: translateX(0px);}
}

@-o-keyframes FadeInRight
{
    0% {opacity:0;transform: translateX(40px);}
    100% {opacity: 1;transform: translateX(0px);}
}

    @-webkit-keyframes fadeInLeft {
        from {
            opacity: 0;
            -webkit-transform: translate3d(-100%, 0, 0);
            transform: translate3d(-100%, 0, 0);
        }

        to {
            opacity: 1;
            -webkit-transform: none;
            transform: none;
        }
    }
</style>
