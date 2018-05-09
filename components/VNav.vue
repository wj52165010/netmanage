<!-- 垂直导航组件 -->
<template>
    <div class="VNav" :style="{width:(width || 40)+'px'}">
        <Scroll :listen="menus">
            <el-tooltip v-for="m in menus" class="item" :class="{active:curId==m._keyid}" effect="light" :content="m._name" placement="left">
                <i :class="m._icon" @click="itemClick(m._keyid)"></i>
            </el-tooltip>
        </Scroll>
    </div>
</template>

<script>

import Scroll from 'components/scroll'
export default {
  name: 'VNav',
  props:['menus','defId'],
  components:{Scroll},
  data () {
    return {
        curId:'',//当前显示页面ID
        width:0
    }
  },
  mounted(){
    this.curId=this.defId;
  },
  methods:{
      itemClick(id){
        this.curId=id;
        this.$emit('itemClick',id);
      }
  }
}
</script>
<style scoped lang="less">
 @import "../css/variables.less";
 .VNav{height:100%;width:100%;background-color:@HeaderBgCol;}
 .VNav .item{color:@FrontCol;padding:10px 0px;width:100%;text-align:center;cursor:pointer;}
 .VNav .item i{color:@FrontCol;font-size:20px;}
 .VNav .item.active i,
 //.VNav .item:hover i{color:@btn_Bg_Col_hover_0;}

 html{.TColImAdd(~".VNav .item:hover i");}
</style>
