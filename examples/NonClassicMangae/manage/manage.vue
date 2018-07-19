<!-- 管理页面组件 -->
<template>
    <div class="Mangae">
     <!--页面切换按钮-->
     <ul class="tag">
        <li class="tag_item" :class="{active:i==pageIndex}" v-for="(p,i) in pages" @click="pageIndex=i">{{p.name}}</li>
     </ul>
      
      <!--页面显示区域-->
      <div class="page_show">
        <!--场所通知-->
        <PlaceNote v-show="pageIndex==0" ref="PlaceNote" />
      </div>

    </div>
</template>

<script>
import PlaceNote from './PlaceNote'

export default {
  name: 'Mangae',
  components:{PlaceNote},
  data () {
    return {
        pageIndex:0,
        pages:[{name:'场所通知'}],
    }
  },
  watch:{
    pageIndex(){
        this.layout();
    }
  },
  methods:{
    layout(){
        switch(this.pageIndex){
            case 0://场所通知
                this.$refs.PlaceNote.layout && this.$refs.PlaceNote.layout();
                break;
        }
    }
  }
}
</script>

<style scoped lang="less">
@import "../../../css/variables.less";
.Mangae{width:100%;height:100%;}
.tag{text-align:left;padding:0px;overflow:hidden;}
.tag .tag_item{
list-style:none; float:left; margin-left:10px;padding:5px;position:relative;cursor:pointer;
}
.tag .tag_item:hover{cursor:pointer;}
html{.TCol(~".tag .tag_item:hover");}


.HTag .tag .tag_item.active:after{content:'';width: 100%;height: 2px;position: absolute;left:0px;bottom:0px;}
html{.TCol(~".HTag .tag .tag_item.active:after",'bg');}

.Mangae .page_show{width:100%;height:~'calc(100% - 40px)';}
</style>
