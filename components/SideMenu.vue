<!-- 侧边导航菜单组件 -->
<template>
    <div class="sideMenu">
        <div class="pos_container">
            <div class="kind_container">
                <div class="sideMenu_conatiner">
                    <div class="slidee">
                        <div class="kind_item" v-for="(menu,index) in menus" :class="{active:curIndex==index}"  @mouseenter="menu_mouseenter(menu,index)" @mouseleave="menu_mouseleave()">
                            <!--<el-tooltip class="item" effect="light" :content="menu.name" placement="top">-->
                                <div style="display:table-cell;vertical-align:middle;">
                                    <i :class="menu.icon"></i>
                                    <div style="font-size:12px;">{{menu.title}}</div>
                                </div>
                            <!--<el-tooltip>-->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--具体类型下的菜单集合-->
        <div class="kind_menu_container" :class="{active:curIndex!=-1}" @mouseenter="menu_item_mouseenter()" @mouseleave="menu_item_mouseleave($event)">
            <div class="title">{{(menus[curIndex] || {name:''}).name }}</div>
            <div class="content">
                <div class="gridly1" name="sideMenu_container" style="height:200px;overflow: hidden;">
                    <div class="menu_item" :id="menu.keyid+'_'+((menu.menu_type || {id:0}).id || 0)+'_'+menu.name"  :class="Menu_State.getRes(menu.status).val>0 && {complete:true}" @click="item_click(menu)" v-for="menu in showMenus" v-if="menu.blnShow && !menu.disabled">
                        <div class="_container">
                            <i :class="menu.icon"></i>
                            <div style="font-size:12px;">{{menu.name}}</div>
                            <div class="info_mask" v-show="Menu_State.getRes(menu.status).val<=0"><div class="info_mask_container"><div>{{Menu_State.getRes(menu.status).info}}</div></div></div>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {BODY_RESIZE,BODY_MOUSEMOVE,Add_History_Menu,Menu_Sort} from '../store/mutation-types'
import { mapState,mapMutations} from 'vuex'
import '../js/dragSort.js'

// import {tool} from '../js/tool.js'
let blnClose=true;
let closeTime=null;
let blnWillClose=false;
export default {
  name: 'SideMenu',
  props:['menus'],
  data () {
    return {
      sly:null,
      curIndex:-1,
      gridly:null,
      blnDrag:false,
      leaveStart:0,//离开时起始位置
    }
  },
  watch:{
      menus(){
          this.$nextTick(()=>{
            this.sly.reload();
          });
      },
      curIndex(){
        //权限判断
        let self=this;
        this.$nextTick(()=>{
            if(!this.gridly){
                this.gridly = $('div[name="sideMenu_container"]').dragsort({
                    remove:()=>{
                        //console.log('remove',this.blnDrag);
                        this.blnDrag=true;
                    },
                    mouseup:(els)=>{
                        //console.log('mouseup',this.blnDrag);
                        if(this.blnDrag){setTimeout(()=>{ self.blnDrag=false;},0)}else{self.blnDrag=false;}
                        self.saveSort(els);
                    }
                });
            }else{
                this.gridly.reload();
            }
        });
      },
  },
  computed:mapState({
    showMenus(){
        let permissions = tool.cookie.get('permissions');
        if((','+permissions+',').indexOf(',*,')>=0){
            return _.filter((this.menus[this.curIndex] || {menus:[]}).menus,m=>{return !m.kind;})
        }else{
            return _.filter((this.menus[this.curIndex] || {menus:[]}).menus,m=>{return !m.kind && (','+permissions+',').indexOf(','+m.keyid+',');})
        }
    }
  }),
  mounted(){
    this.$nextTick(()=>{
        this.sly=new Sly($('.sideMenu > .pos_container >.kind_container > .sideMenu_conatiner'),{
            itemNav: "basic",
            speed:200,
            scrollBy:1,
            dragHandle:true,
            dynamicHandle:true,
            smart:1
        });
        this.sly.init();
    });
    this.$store.commit(BODY_RESIZE,()=>{
        this.sly.reload();
    });

    this.$store.commit(BODY_MOUSEMOVE,(e)=>{
        let {clientX:x}=e;
        if(blnWillClose && Math.abs(this.leaveStart - x)>50){//判断鼠标离开容器50px距离后才隐藏菜单
            blnWillClose=false;
            this.curIndex=-1;
            this.$emit('Blnshow',false);
        }
    });
  },
  methods:{
      //保存排序
      saveSort(els){
        let self=this;
        let kindId,ids= _.chain(els).map(i=>{return $(i).attr('id')}).compact().map((val,i)=>{
            kindId=val.split('_')[1];
            return {keyid:val.split('_')[0],order_index:i,name:val.split('_')[2]};
        }).value();
        this.$store.dispatch(Menu_Sort,ids).then(res=>{
            if(res.msg.code!='successed'){return;}
            //调整菜单显示顺序
            _.each(self.menus,m=>{
                if(m.id==kindId){
                    _.each(ids,(id,index)=>{
                        let tempMenu=_.find(m.menus,i=>{return i.keyid==id.keyid});
                        tempMenu.orderby=index;
                    });
                    m.menus=_.sortBy(m.menus,'orderby');
                }
            });
        });
      },
      menu_mouseenter(menu,index){
         blnWillClose=false;
         if(closeTime){
             clearTimeout(closeTime);
             blnClose=true;
         }
         //blnClose=false;
         this.curIndex=index;
      },
      menu_mouseleave(){
         closeTime = setTimeout(()=>{
              if(!blnClose){blnClose=true;return;}
              this.curIndex=-1;
          },300);
      },
      menu_item_mouseenter(){
        blnWillClose=false;
        blnClose=false;
        this.$emit('Blnshow',true);
      },
      menu_item_mouseleave(e){
            let {clientX:x}=e;
            this.leaveStart=x;
            blnWillClose=true;
            //this.curIndex=-1;
            //this.$emit('Blnshow',false);
      },
      //菜单项单击事件
      item_click(menu){
          //console.log('click',this.blnDrag);
          if(this.blnDrag){return;}

          if(this.Menu_State.getRes(menu.status).val<=0){return;}
          menu.type=menu.type || 'templatePage';
          menu.id=menu.keyid;
          this.$store.commit(Add_History_Menu,menu);
          this.curIndex=-1;
          this.$emit('Blnshow',false);
      }
  }
}
</script>

<style scoped lang="less">
  @import "../css/variables.less";
  @backgrounImg:rgba(226,226,226,.9);
  @color_one:@HeaderBgCol;

  .sideMenu .kind_container,
  .sideMenu .kind_container .sideMenu_conatiner,
  .sideMenu{height:100%;width:100%;color:#2c3e50;}
  .sideMenu .sideMenu_conatiner .kind_item{.border('bottom');height:60px;font-size:25px;cursor: pointer;color:white;display:table;width:100%;}
  .sideMenu .sideMenu_conatiner .kind_item .item{height:100%;width:100%;}
  .sideMenu .sideMenu_conatiner .kind_item .item i{margin-left:10px;}
  .sideMenu .sideMenu_conatiner .kind_item .item:hover{background-color:white;}
  .sideMenu .pos_container{height:100%;width:100%;position:absolute;z-index:100;}

  .sideMenu .kind_container{background-color:@HeaderBgCol;}

  .sideMenu .sideMenu_conatiner .kind_item.active{background-color:#1a1e27;color:@Font_Hover_Col;}

  .sideMenu .kind_menu_container{
      position:absolute;background-color:@backgrounImg;height:100%;width:340px;top:0px;left:340px;.transLine(.3s);z-index:0;
      -moz-box-shadow:-4px 0px 2px #BFBFBF; -webkit-box-shadow:-4px 0px 2px #BFBFBF; box-shadow:-4px 0px 2px #BFBFBF;
  }
  .sideMenu .kind_menu_container.active{left:-340px;}
  @menuTitleH:20px;
  .sideMenu .kind_menu_container .title{@height:@menuTitleH;.border('bottom');padding:10px 0px;background-color:@color_one;color:white;}
  .sideMenu .kind_menu_container .content{height:~"calc(100% - @{menuTitleH} - 20px)";width:100%;overflow-y:auto;position:relative;}
  .sideMenu .kind_menu_container .content .menu_item{
      float:left;width:33.3%;height:100px;margin-top:0px;border-radius:0px;position:relative;.border('bottom');.border('right');
   }
   .sideMenu .kind_menu_container .content .menu_item:hover{z-index:100 !important;}
  .sideMenu .kind_menu_container .content .menu_item i{font-size:30px;margin-bottom:10px;color:@btn_Bg_Col_hover_1;}
  .sideMenu .kind_menu_container .content .menu_item.complete:hover i{color:white;}
  .sideMenu .kind_menu_container .content .menu_item.complete:hover{cursor: pointer;}
  .sideMenu .kind_menu_container .content .menu_item ._container {padding:20px 10px;.transLine();}
  .sideMenu .kind_menu_container .content .menu_item.complete:hover ._container{
      transform:translate(-5px,-5px);
      background-color:@btn_Bg_Col_hover_1;
      color:white;
      z-index:100;
    //   box-shadow:
    //     1px 1px 0 #CCC,
    //     2px 2px 0 #CCC, /* end of 2 level deep grey shadow */
    //     3px 3px 0 #bcc0c9,
    //     4px 4px 0 #bcc0c9,
    //     5px 5px 0 #bcc0c9,
    //     6px 6px 0 #bcc0c9, /* end of 4 level deep dark shadow */
    //     7px 7px 0 #bcc0c9,
    //     8px 8px 0 #bcc0c9,
    //     9px 9px 0 #bcc0c9; /* end of 4 level deep dark shadow */
    -moz-box-shadow:2px 2px 2px #BFBFBF; -webkit-box-shadow:2px 2px 2px #BFBFBF; box-shadow:2px 2px 2px #BFBFBF;
  }

  .sideMenu .kind_menu_container .content .menu_item .info_mask{position:absolute;width:100%;height:100%;top:0px;left:0px;background:rgba(0,0,0,.6);color:white;}
  .sideMenu .kind_menu_container .content .menu_item .info_mask .info_mask_container{display:table;width:100%;height:100%;}
  .sideMenu .kind_menu_container .content .menu_item .info_mask .info_mask_container div{display:table-cell;vertical-align: middle;}
</style>
