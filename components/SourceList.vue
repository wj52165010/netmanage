<!-- 数据源列表组件 -->
<template>
    <div class="sourceList">
       <div class="item" v-for="item in data" @click="item_click(item)">
            <i class="icon" :class="gclass(item)"></i>{{item.name}} - <span class="desc">{{item.parentobj.name}}</span>
            <i v-if="!noCloseBtn" class="close_icon fa fa-close" @click="delSel(item)"></i>
       </div>
    </div>
</template>

<script>
export default {
  name: 'SourceList',
  props:['data','extraProp'],
  data () {
    return {
      noCloseBtn:false,
    }
  },
  mounted(){
      this.noCloseBtn=!this.extraProp?false:!!this.extraProp.noCloseBtn;
  },
  methods:{
      gclass(item){
          return item.parentobj.icon + " " + "item_"+item.parentobj.c_index;
      },
      //去掉选中
      delSel(item){
          this.$emit('triggerEvent','delItem',item,item.parentobj);
      },
      //数据源项单击
      item_click(item){
          this.$emit('triggerEvent','itemClick',item);
      }
  }
}
</script>

<style scoped lang="less">
  @import "../css/variables.less";
  @itemH:40px;
  @gapSize:12px;
  .sourceList .item{
      height:@itemH;line-height:@itemH;padding:0px 10px;.border('bottom');cursor:pointer;position:relative;
      overflow: hidden;white-space:nowrap; text-overflow:ellipsis;-o-text-overflow:ellipsis;overflow: hidden;
  }
  .sourceList .item .icon{
      color:@FrontCol;width:-(@gapSize - @itemH);height:-(@gapSize - @itemH);border-radius:50%;line-height:-(@gapSize - @itemH);
      text-align:center;margin-right:10px;
  }
  .sourceList .item .desc{font-size:13px;}
  .sourceList .item .close_icon{position:absolute;right:0px;height:100%;line-height:@itemH;.border('right');padding-right:10px;}
  .sourceList .item .close_icon:hover{color:@Font_Hover_Col;}

  .sourceList .item .icon.item_0{background-color:@btn_Bg_Col_1;}
  .sourceList .item .icon.item_1{background-color:@btn_Bg_Col_2;}
  .sourceList .item .icon.item_2{background-color:@btn_Bg_Col_3;}
  .sourceList .item .icon.item_3{background-color:@btn_Bg_Col_4;}
  .sourceList .item .icon.item_4{background-color:@btn_Bg_Col_5;}
</style>
