<!-- 菜单插件 -->
<template>
    <div class="MenuBar">
     <ul id="nav">
          <li v-for="menu in menus" v-init-hook="{bindFn:InitPopover,data:menu}"><a href="javascript:void(0);"><i :class="menu.icon"></i></a></li>
      </ul> 
    </div>
</template>
<script>

//引用环形菜单插件
import '../../static/ferroMenu/jquery.ferro.ferroMenu.css'
import '../../static/ferroMenu/jquery.ferro.ferroMenu-1.2.3.min.js'

//window8布局流
import  '../../static/Window8Layout.css'
import W8Layout from '../js/window8Layout.js'

export default {
  name: 'MenuBar',
  props:['menus'],
  data () {
    return {
        
    }
  },
  mounted(){
    this.initMenu();
  },
  methods:{
    InitPopover(el,data){
      $(el).webuiPopover({content:data.name,trigger:'hover',animation:'pop',placement:'auto',cache:true});
      //菜单项
      let menuTemp=`
        <div class="menusContainer">
          <div class="menu_container_titleBar"><i class="fa fa-th-large openBtn"></i><span>${data.name}</span></div>
          <div class="menu_container_contentBar"></div>
        </div>
      `;

      $(el).find('a').webuiPopover({content:menuTemp,trigger:'click',animation:'pop',placement:'auto',cache:true,onload:function(el){
        var window8Layout=new W8Layout();
        window8Layout.AppendTo($(el).find('.menu_container_contentBar'),{ScreenWidth:600,ScreenHeight:230});
      }});
    },
    initMenu(){
      let self=this;
      this.$nextTick(()=>{
        setTimeout(()=>{
           $('#nav').ferroMenu({
            delay 		: 50,
            rotation 	: 720,
            margin		: 20,
            drag      : false,
            position  : 'right-bottom'
          });
        },0);
      
      });
      $(document).on("menuopened",function(e){
        let pos=e.menustatus.position,id=e.menustatus.id;
        switch(pos){
          case 'left-bottom'://左下
            $('#'+id).addClass('menu_LeftBottom');
            break;
          case 'right-bottom'://右下
            $('#'+id).addClass('menu_rightBottom');
            break;
          case 'left-top'://左上
            $('#'+id).addClass('menu_LeftTop');
            break;
          case 'right-top'://右上
            $('#'+id).addClass('menu_rightTop');
            break;
          case 'center-bottom'://中下
            $('#'+id).addClass('menu_centerBottom');
            break;
          case 'center-top'://中上
            $('#'+id).addClass('menu_centerTop');
            break;
          case 'right-center'://右中
            $('#'+id).addClass('menu_rightCenter');
            break;
          case 'center-center'://居中

            break;
          
        }
      });

      $(document).on("menuclosed",function(e){
        let pos=e.menustatus.position,id=e.menustatus.id;
        switch(pos){
          case 'left-bottom'://左下
            $('#'+id).removeClass('menu_LeftBottom');
            break;
          case 'right-bottom'://右下
            $('#'+id).removeClass('menu_rightBottom');
            break;
          case 'left-top'://左上
            $('#'+id).removeClass('menu_LeftTop');
            break;
          case 'right-top'://右上
            $('#'+id).removeClass('menu_rightTop');
            break;
          case 'center-bottom'://中下
            $('#'+id).removeClass('menu_centerBottom');
            break;
          case 'center-top'://中上
            $('#'+id).removeClass('menu_centerTop');
            break;
          case 'right-center'://右中
            $('#'+id).removeClass('menu_rightCenter');
            break;
          
        }
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
   @import "../css/variables.less";
  .ferromenu-controller,.ferromenu-controller.desktop:hover{background-color:@btn_Bg_Col_1 !important;}
  .menus_content_container{color:#9b9a99;}
  .menusContainer .menu_container_titleBar{font-size:16px;}
  .menusContainer .menu_container_titleBar span{margin-left:10px;}
  .menus_content_container {cursor:pointer;}
  .menus_content_container {font-size:14px;height:100%;position:relative;transition: all .2s cubic-bezier(.82,.01,.37,1.17) 0.05s;}
  .menus_content_container i{font-size:30px;}
  .menus_content_container .name{position: absolute;bottom: 0px;line-height: normal;width: 100%;}
  .menus_content_container:hover{background-color:#ececec;color:black;}


  //自定义菜单样式
  .menu_LeftBottom{
    height: 500px !important;
    width: 500px !important;
    margin-left: -250px !important;
    bottom: -250px !important;
    z-index: 100 !important;
    line-height: 480px !important;
    padding-left: 50px !important;
    opacity:.6;
  }
  .menu_rightBottom{
    height: 500px !important;
    width: 500px !important;
    margin-right: -250px !important;
    bottom: -250px !important;
    z-index: 100 !important;
    line-height: 480px !important;
    padding-right: 50px !important;
  }

  .menu_LeftTop{
    height: 500px !important;
    width: 500px !important;
    margin-left: -250px !important;
    top: -250px !important;
    z-index: 100 !important;
    line-height: 520px !important;
    padding-left: 50px !important;
    opacity: .6;
  }

  .menu_rightTop{
    height: 500px !important;
    width: 500px !important;
    margin-right: -250px !important;
    top: -250px !important;
    z-index: 100 !important;
    line-height: 520px !important;
    padding-right: 50px !important;
    opacity: .6;
  }
  .menu_centerBottom{
    height: 480px !important;
    width: 480px !important;
    bottom: -240px !important;
    z-index: 100 !important;
    line-height: 440px !important;
    opacity: .6;
    margin-left: -240px !important;
  }

  .menu_centerTop{
    height: 480px !important;
    width: 480px !important;
    top: -240px !important;
    z-index: 100 !important;
    line-height: 500px !important;
    opacity: .6;
    margin-left: -240px !important;
  }

  .menu_rightCenter{
    height: 500px !important;
    width: 500px !important;
    margin-right: -250px !important;
    top: -250px !important;
    z-index: 100 !important;
    line-height: 520px !important;
    padding-right: 50px !important;
    opacity: .6;
  }

  .menu_LeftBottom:hover,
  .menu_rightBottom:hover,
  .menu_LeftTop:hover,
  .menu_rightTop:hover,
  .menu_centerBottom:hover,
  .menu_centerTop:hover,
  .menu_rightCenter:hover
  {background-color:#45484d !important;}

  .menu_LeftBottom .label,
  .menu_rightBottom .label,
  .menu_LeftTop .label,
  .menu_rightTop .label,
  .menu_centerBottom .label,
  .menu_centerTop .label,
  .menu_rightCenter .label
  {background-color: #52bf8a;border-radius: 50% !important;}
</style>