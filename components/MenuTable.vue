<!-- 菜单表格 -->
<template>
    <div class="MenuTable">
      <div class="left">
        <div style="height:10%;"><div class="entry_item" v-for="i in 1"></div></div>
        <div style="height:80%;"><div class="entry_item_3" v-for="i in 3"></div></div>
        <div style="height:10%;"><div class="entry_item" v-for="i in 1"></div></div>
      </div>
      <div class="right">
        <div style="height:10%;"><div class="entry_item" v-for="i in 1"></div></div>
        <div style="height:80%;"><div class="entry_item_3" v-for="i in 3"></div></div>
        <div style="height:10%;"><div class="entry_item" v-for="i in 1"></div></div>
      </div>
      <div class="center">
        <div style="height:10%;"><div class="place_item" v-for="i in 3"></div></div>
        <div style="height:80%;">
          <div class="item" v-for="item in items">
            <div style="display:table-cell;vertical-align: middle;">
              <i :class="item.icon" style="margin-bottom:10px;"></i>
              <div style="font-size:12px;">{{item.name}}</div>
            </div>
          </div>
        </div>
        <div style="height:10%;"><div class="place_item" v-for="i in 3"></div></div>
      </div>
    </div>
</template>
<script>
import { mapState,mapMutations} from 'vuex'
// import {tool} from '../js/tool.js'
export default {
  name: 'MenuTable',
  props:['menus'],
  data () {
    return {
      items:[]
    }
  },
  watch:{
     menus(){
       this.$nextTick(()=>{
        let menu_base=tool.Clone(this.menus[2].menus);
        if(menu_base.length<9){
          let count=9-menu_base.length;
          for(let i=0;i<count;i++){
            menu_base.push({});
          }
        }

        this.items=menu_base;
       });
     }
  },
  mounted(){
 
  }
}
</script>

<style lang="less">
  @import "../css/variables.less";
  @width:30%;
  @backgrounImg:rgba(215,218,226,.7);
  .MenuTable{
    position: absolute;top:0px;left:0px;right:0px;bottom:0px;background-color:@backgrounImg;
  }
  .MenuTable .left{float:left;width:@width;height:100%;}
  .MenuTable .right{float:right;width:@width;height:100%;}
  .MenuTable .center{margin-left:@width;margin-right:@width;height:100%;}

  .MenuTable .entry_item{width:100%;height:100%;.border('bottom');.border('right');}
  .MenuTable .entry_item_3{width:100%;height:33.3%;.border('bottom');.border('right');}

  .MenuTable .place_item{float:left;width:33.3%;height:100%;.border('bottom');.border('right');}
  .MenuTable .item{
    float:left;
    width:33.3%;
    height:33.3%;
    .border('bottom');
    .border('right');
    display: table;
    color:#509ed6;
    cursor:pointer;
    .transLine();
  }

  .MenuTable .item i{font-size:40px}
  .MenuTable .item:hover{
    transform:translate(-5px,-5px);
    background-color:rgb(215,218,226);
    -moz-box-shadow:5px 5px 2px #BFBFBF; -webkit-box-shadow:5px 5px 2px #BFBFBF; box-shadow:5px 5px 2px #BFBFBF;
  }

</style>