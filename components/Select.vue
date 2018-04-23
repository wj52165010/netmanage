<!-- 下拉框组件 -->
<template>
    <div class="cSelect" :class="{expan:blnExpan}">
        <div class="info" @click="blnExpan=!blnExpan"><i class="fa fa-caret-down" :class="{rotate:blnExpan,rotatereverse:!blnExpan}"></i><span class="title">{{val?val.name:''}}</span></div>
        <ul v-show="blnExpan" :class="{fadeIn:blnExpan}">
            <li v-for="item in items || []" @click.stop="itemClick(item)">{{item.name}}</li>
        </ul>
    </div>
</template>

<script>
export default {
  name: 'cSelect',
  props:['val','items'],
  data () {
    return {
       blnExpan:false,
    }
  },
  methods:{
    itemClick(item){
        this.val=item;
        this.blnExpan=false;
        this.$emit('change',item);
    }
  },
  computed:{
      
  }
}
</script>

<style scoped lang="less">
 @import "../css/variables.less";
 @SeparLi:7px;
 @borderCol:@btn_Bg_Col_hover_1;

 .cSelect{position:relative;text-align:left;width:150px;line-height:30px;color:white;}
 .cSelect .title{-webkit-user-select:none; -moz-user-select:none; -ms-user-select:none; user-select:none;}
 .cSelect.expan .info{.trans(.5s);border: 1px solid @borderCol;border-bottom: 0px;border-top:0px;border-bottom-left-radius:0px; border-bottom-right-radius:0px;}
 .cSelect.expan ul{border: 1px solid @borderCol;border-bottom-right-radius: 5px;border-bottom-left-radius: 5px;}
 .cSelect .info{cursor:pointer;padding-left:5px;width:150px;background-color:@borderCol;border-radius:5px;}
 .cSelect ul{position:absolute;list-style: none;padding-left:0px !important;width:100%;background-color:white;padding-bottom:@SeparLi;box-shadow: 1px 1px 2px #BFBFBF;z-index:100;}
 .cSelect ul li{margin-top:@SeparLi;cursor:pointer;line-height:25px;padding-left:@SeparLi;color:@FontCol;}
 .cSelect ul li:hover{background-color:@BgCol;}

 .cSelect i{margin-right:10px;float:right;margin-top: 8px;}
</style>
