<!-- 头部组件 -->
<template>
    <div class="header" onselectstart="return false">
       <div class="logo">
         <!--<span class="title"><span class="titleInfo">{{title}}</span><span class="titleExtra">{{titleExtra}}</span></span>
         <div class="extra_title">network manage</div>-->
         <img class="user_img" style="height:50px;" src="../assets/logo.png" />
       </div>
       <div class="info">
         <div class="user">
           <ul>
             <li class="user_imgae"><img id="user_imgae" class="user_img" src="../assets/noperson.png" style="width:40px;height:40px;" /></li>
             <li class="user_info"><div class="user_info_name" :title="userInfo.name" :class="{simpleName:!userInfo.department}">{{userInfo.name}}</div><div class="user_info_desc" :title="userInfo.department">{{userInfo.department}}</div></li>
            </ul>

            <!--切换皮肤-->
            <div class="skin">
              <el-tooltip class="item" effect="light" content="切换主题" placement="right">
                <i class="fa fa-qq"></i>
              </el-tooltip>

              <!--皮肤选择区域-->
              <div class="fadeIn skin_container">
                <div class="item" @click="changeSkin('defTheme')" style="background-color:rgb(3, 171, 103);"></div>
                <div class="item" @click="changeSkin('blueTheme')" style="background-color:#007acc;"></div>
              </div>
            </div>
         </div>
         <div class="setting" @click="settingMenu_click()">
          <el-tooltip class="item" effect="light" content="定制" placement="left">
            <i class="fa fa-cog fa-fw"></i>
            <div style="font-size:12px;">定制</div>
          </el-tooltip>
         </div>
         <div class="menu" @mouseenter="mouseenter" @mouseleave="mouseleave">
           <i class="fa fa-list-ul"></i>
           <div style="font-size:12px;">菜单</div>
           </div>
       </div>
       <!--历史导航栏-->
       <HNav :menu="historyMenu" @meunClick="menu_click" @menuDel="menu_del"></HNav>
       <!--工具栏-->
       <div id="toolbar-options" class="hidden">
          <a href="#" id="close"><i class="fa fa-close"></i></a>
      </div>   
    </div>
</template>

<script>
import { mapState,mapMutations} from 'vuex'
import {UPDATE_TO_TITLE,BODY_RESIZE,Nav_Page,Del_Nav_Page,Add_History_Menu,Trigger_Page_Switch,LoginOut} from '../store/mutation-types'
import HNav from './HNav'
import '../../static/toolbar/jquery.toolbar.css'
import '../../static/toolbar/jquery.toolbar.min.js'

let sly=null;
export default {
  name: 'Header',
  props:['userInfo'],
  components: {
    HNav
  },
  data () {
    return {
      historyMenu:[
          // {id:1,type:'templatePage',name:'上网场所库',icon:'fa fa-search'},
          // {id:2,type:'templatePage',name:'实名人员库',icon:'fa fa-bullhorn'},
          // {id:3,type:'templatePage',name:'手机号码库',icon:'fa fa-gift'},
          ]
    }
  },
  computed:{
    ...mapState(['title','titleExtra','bodyObser'])
  },
  methods:{
    update(){
      this.$store.commit(UPDATE_TO_TITLE,'你好');
    },
    //历史菜单单击事件
    menu_click(menu){
      this.$store.commit(Trigger_Page_Switch,menu);
      this.$store.commit(Nav_Page,{name:menu.type,id:menu.id,params:{model:menu}});
    },
    //历史菜单删除事件
    menu_del(menu){
      this.$store.commit(Trigger_Page_Switch,menu);
      this.$store.commit(Del_Nav_Page,{name:menu.type,id:menu.id,params:{model:menu}})
    },
    //配置菜单单击事件
    settingMenu_click(){
      this.$store.commit(Add_History_Menu,{
          id:'settingPage',
          name:'定义模块',
          type:'Setting',//'settingPage',
          icon:'fa fa-cog fa-fw'
      });
     
    },
    mouseenter(){
      this.$emit('mouseenter');
    },
    mouseleave(){
      this.$emit('mouseleave');
    },
    //切换皮肤
    changeSkin(theme){
      $('body').removeClass();
      $('body').addClass(theme);
      localStorage.theme=theme;
    }
  },
  mounted(){
    document.body.ondrag=document.body.oncontextmenu=function(){ return false;} 
    document.images.ondragstart=function (){return false;}
		document.images.onselectstart=function(){return false;}

    //初始化头部工具栏插件
    $(this.$el).find('#user_imgae').toolbar({
      content: '#toolbar-options',
      position: 'bottom'
    }).on('toolbarItemClick',(e,el)=>{
      let tag=$(el).attr('id');
      if(tag=='close'){//退出
        this.$store.dispatch(LoginOut,tool.cookie.get('account')).then(res=>{
          if(!tool.msg(res,'','退出失败!'))return;
          tool.cookie.del('token');
          tool.cookie.del('userid');
          tool.cookie.del('exp');
          tool.cookie.del('permissions');
          tool.cookie.del('account');
          tool.cookie.del('pwd');
          window.location='login.html';
        });
      }
    });

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import "../css/variables.less";
  @titleW:270px;
  @infoW:420px;

  .header{background-color:@HeaderBgCol;height:100%;width:100%;text-align:left;position:
          relative;-moz-user-select: none; -webkit-user-select: none;  -webkit-user-drag: none;
          -ms-user-select:none;-ms-user-drag:none;-khtml-user-select:none;-khtml-user-drag:none;
          .border('bottom');
          }
  /*系统标题*/
  .header .logo{float:left;color:white;width:@titleW;text-align:center;padding-top:5px;}
  .header .title{font-size:16px;}
  .header .title .titleInfo{color:#03c1d7;font-style: italic;}
  .header .title .titleExtra{color:#98e32c;font-style: italic;}
  .header .extra_title{font-size: 12px;font-style: italic;margin-top:-5px;}
  /*系统信息栏*/
  //.header .info > div{background-color:@btn_Bg_Col_6;}

  html{.TColAdd(~".header .info > div",'bg');}
  .header .info{float:right;height:100%;width:@infoW;}
  .header .info .user{float:left;width:62%;height:100%;position:relative;}
  .header .info .user ul{list-style:none;padding:10px;padding-right:0px;margin:0px;height:100%;width:100%;}
  .header .info .user ul li{float:left;height:100%;}
  .header .info .user ul .user_img{border-radius:50%;}
  .header .info .user ul li .user_info_desc{font-size:12px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
  .header .info .user ul li .user_info_name{font-weight:600;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
  .header .info .user ul .user_info{padding-left:15px;width: calc(100% - 40px);}

  .header .info .menu{margin-left:81%;.border('left');height:100%;text-align:center;font-size:25px;cursor:pointer;}
  .header .info .menu:hover{background-image:@HeaderBgCol;color:@FrontCol;}
  .header .info .setting{float: left;width: 19%;.border('left');height:100%;text-align:center;font-size:25px;cursor:pointer;}

  .simpleName{margin-top:10px;}

  .Header .info .user .skin{position:absolute;right:10px;top:5px;}

  .Header .info .user .skin:hover{cursor:pointer;}
  html{.TCol(~".Header .info .user .skin:hover");}

  @skin_containerW:50px;
  @bgColor:fade(@HeaderBgCol,90%);
  .Header .info .user .skin .skin_container{
    display:none;
    position:absolute;width:@skin_containerW;height:20px;right:0px;
    .border('',@bgColor);border-radius:5px;background-color:@bgColor;overflow:hidden;
  }

  .Header .info .user .skin:hover .skin_container{display:block;}

  .Header .info .user .skin .skin_container .item{float:left;width:50%;height:20px;}

  .Header .info .user .skin .skin_container .item:hover{cursor:pointer;}


</style>
