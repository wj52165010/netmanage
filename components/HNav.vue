<!-- 水平导航组件 -->
<template>
    <div class="hnav" :class="{menuPage:blnPage}">
      <div class="arrow_left" @click="left_arrow()"><i class="fa fa-chevron-left"></i></div>
      <div class="arrow_right" @click="right_arrow()"><i class="fa fa-chevron-right"></i></div>
      <div class="menuContainer">
        <ul class="historyBar slidee">
            <li v-for="(menu,index) in menu" :class="{active_item:index==curIndex}" @click="menu_click(menu)" @mouseenter="mouseenter($event,menu,index)" @mouseleave="mouseleave($event)">
              <div class="historyBar_icon"><i :class="menu.icon"></i></div>
              <div class="historyBar_name">{{menu.name}}</div>
              <!--<div class="close_container">
                <i class="fa fa-close" @click.stop="menu_del(menu,index)"></i>
                <i class="fa fa-refresh" @click.stop="refresh(menu,index)" style="margin-left:10px;"></i>
              </div>-->
              <!--<i class="fa fa-close close_btn" @click.stop="menu_del(menu,index)"></i>-->
            </li>
        </ul>
      </div>
      <div name="nav_tip" v-show="blnShowTip" class="nav_tip" @mouseenter="tipMouseenter($event)" @mouseleave="tipMouseleave($event)">
        <i class="fa fa-close" @click.stop="menu_del(hoverMenu,hoverIndex)"></i>
        <i class="fa fa-refresh" @click.stop="refresh(hoverMenu,hoverIndex)" style="margin-left:10px;"></i>
      </div>
    </div>
</template>

<script>
import {BODY_RESIZE,Reg_Add_History_Menu_Func,PageRefresh} from '../store/mutation-types'

let sly=null;//导航栏插件实例
export default {
  name: 'HNav',
  props:['menu'],
  data () {
    return {
      blnPage:false, //是否存在多页
      curIndex:-1,
      blnShowTip:false,
      hoverMenu:null,
      hoverIndex:-1,
      blnHidenTipId:'',
    }
  },
  methods:{
    mouseenter(e,menu,index){
      if(this.blnHidenTipId){clearTimeout(this.blnHidenTipId.Fx_DelayTimerId);this.blnHidenTipId=null;}
      let el=$(e.target),offset=el.offset(),tipEl=$(this.$el).find('div[name="nav_tip"]');
      this.blnShowTip=true;
      this.hoverMenu=menu;
      this.hoverIndex=index;
      tipEl.css({
        left:offset.left+'px'
      });
    },
    mouseleave(e){
      this.blnHidenTipId=tool.DelayTrigger(()=>{
        this.blnShowTip=false;
      },this,200);
    },
    tipMouseenter(){
      if(this.blnHidenTipId){clearTimeout(this.blnHidenTipId.Fx_DelayTimerId);this.blnHidenTipId=null;}
    },
    tipMouseleave(){
      this.mouseleave();
    },
    left_arrow(){
      sly.prevPage();
    },
    right_arrow(){
      sly.nextPage();
    },
    menu_click(menu){
      let self=this,index=-1;;
      //判断菜单是否存在
      for(let i=0;i<self.menu.length;i++){
        if(self.menu[i].id==menu.id){index=i;break;}
      }
      //存在
      if(index>=0){
        this.curIndex=index;
        this.$emit('meunClick',menu);
      }
      if(index<0){
        //不存在
        self.menu.push(menu);
        self.$nextTick(()=>{
          self.curIndex=self.menu.length-1;
          self.$emit('meunClick',menu);
        });
      }
      
      self.$nextTick(()=>{
        setTimeout(()=>{
           sly.toEnd(index>=0?index:self.menu.length-1);
        },100)
      });
    },
    //刷新页面
    refresh(menu,index){
      this.mouseleave();
      this.$store.commit(PageRefresh,index);
    },
    menu_del(menu,index){
      let menus=this.menu,itemIndex=-1,self=this,activeItem=menus[self.curIndex];
      this.mouseleave();
      this.blnShowTip=false;

      for(let i=0;i<menus.length;i++){
        if(menu.id==menus[i].id){itemIndex=i;break;}
      }
      this.menu.splice(itemIndex,1);
      this.$emit('menuDel',menu);
      if(itemIndex==this.curIndex && this.menu[0]){
        setTimeout(()=>{
          this.menu_click(this.menu[0]);
        },0);
      }else{
        for(let i=0;i<menus.length;i++){
          if(activeItem.id==menus[i].id){self.curIndex=i;break;}
        }
      }
    }
  },
  watch:{
    blnPage(){
       this.$nextTick(()=>{
        sly.reload();
        this.blnPage=sly.pages.length>1;
       });
    },
    menu(){
      this.$nextTick(()=>{
        sly.reload();
        this.blnPage=sly.pages.length>1;
       });
    }
  },
  mounted(){
    sly=new Sly($('.menuContainer'),{
    horizontal: 1,
    itemNav: "basic",
    speed:300,
    smart:true,
    startAt: 1,
    scrollBy: 1
    });
    sly.init();
    this.blnPage=sly.pages.length>1;
    
    this.$store.commit(BODY_RESIZE,()=>{
      sly.reload();
      this.blnPage=sly.pages.length>1;
    });

    //注册添加历史菜单方法
    this.$store.commit(Reg_Add_History_Menu_Func,this.menu_click);
  }
}
</script>

<style scoped lang="less">
    @import "../css/variables.less";
    @historyBar_li_width:100px;
    @navW:30px;
    .hnav .menuContainer{height:-(1-@headerH);}
    .hnav .historyBar{color:white;padding:0px;margin:0px;height:100%;list-style:none;}
    .hnav .historyBar li{.border('right');float:left;height:100%;width:@historyBar_li_width;cursor:pointer;background-color:#393d4d;color:white;text-align:center;position:relative;}
    .hnav .historyBar li:first-child:nth-last-child(1),.hnav .historyBar li:nth-last-child(1){border:none;}

    .hnav .historyBar li:hover{color:@Font_Hover_Col;background-color:@BgCol;.trans(.2s)}
    .hnav .historyBar li .close_container{
      position:absolute;
      bottom:-20px;
      height: 20px;
      width: 100%;
      text-align: center;
      font-size: 16px;
      line-height: 20px;
      background-color: rgba(0,0,0,.5);
      color:white;
      .trans(.3s);
    }
    .hnav .historyBar li:hover .close_container{bottom:0px;}
    .hnav .historyBar li .close_container i:hover{color:@btn_Bg_Col_hover_0;}

    .hnav .historyBar .historyBar_icon{line-height:@headerH/1.8;font-size:18px;}
    .hnav .historyBar .historyBar_name{font-size:12px;}
    .hnav .historyBar .active_item{background-color:@Font_Hover_Col;color:@Active_Front_Col;}
    .hnav .historyBar li .close_btn{position:absolute;right:5px;top:5px;cursor:pointer;}

    .hnav .arrow_left{float:left;display:none;height:-(1-@headerH);width:@navW;background: @btn_Bg_Col_1;color:white;line-height:-(1-@headerH);text-align:center;cursor:pointer;}
    .hnav .arrow_right{float:right;display:none;height:-(1-@headerH);width:@navW;background: @btn_Bg_Col_1;color:white;line-height:-(1-@headerH);text-align:center;cursor:pointer;}

    .hnav.menuPage .arrow_left,
    .hnav.menuPage .arrow_right{display:block;.trans();}

    .hnav.menuPage .arrow_left:hover,
    .hnav.menuPage .arrow_right:hover{background:@btn_Bg_Col_hover_1;}

    //提示框样式
    .nav_tip{width:@historyBar_li_width;position:absolute;z-index:1000;
             background-color: @btn_Bg_Col_hover_0;
             border-bottom-left-radius:5px;
             border-bottom-right-radius:5px;
             .trans(.3s);
             text-align:center;
             -moz-box-shadow:1px 1px 2px #333333; -webkit-box-shadow:1px 1px 2px #333333; box-shadow:1px 1px 2px #333333;
            }

  .nav_tip i:hover{color:white;cursor:pointer;}
</style>
