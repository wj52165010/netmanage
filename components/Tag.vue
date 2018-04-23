<!-- Tag标签页组件 -->
<template>
    <div class="tagComp">
        <div class="item" :class="{active:curSelTemp==template}" v-for="template in templates" @click="itemClick(template)">
            <div class="item_container">
                <span class="content">
                    <i :class="mapTmp[template].icon"></i>
                    {{mapTmp[template].name}} 
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import {tagVal as tempType} from '../enum/TempType.js'

export default {
  name: 'Tag',
  props:['templates','extra'],
  data () {
    return {
      mapTmp:_.extend(tempType,{100:{name:'远程数据',icon:'fa fa-rss'}}),//{1:{name:'列表',icon:'fa fa-list'},2:{name:'图表',icon:'fa fa-area-chart'},3:{name:'地图描点',icon:'fa fa-map-marker'},4:{name:'地图路径',icon:'fa fa-motorcycle'}},
      curSelTemp:-1,//当前选中的Tag项标识
      oriSel:-1,//上一个选中的标识
    }
  },
  mounted(){
    this.itemClick(_.first(this.templates));
  },
  methods:{
      //恢复上一次选中Tag
      resetSel(){
        this.curSelTemp=this.oriSel;
      },
      itemClick(template){
        if(this.oriSel<0){
            this.oriSel=template;
        }else{
            this.oriSel=this.curSelTemp;
        }
        this.curSelTemp=template;
        this.$emit('itemClick',template,this.extra);
      }
  }
}
</script>
<style scoped lang="less">
    @import "../css/variables.less";
    @min-item-w:50px;
    .tagComp{height:100%;width:100%;padding:2px 0px;}
    .tagComp .item{display:inline-block;display:inline-block;height:100%;min-width: @min-item-w;text-align: center;margin: 0px 5px;cursor:pointer;.transLine(.2s)}
    .tagComp .item .item_container{display:table;height:100%;width: 100%;padding: 0px 10px;}
    .tagComp .item .item_container .content{display:table-cell;vertical-align: middle;}
    .tagComp .item .item_container .content i{margin-right:5px;}
    .tagComp .item.active,
    .tagComp .item:hover{background-color:@btn_Bg_Col_hover_5;color:white;border-radius:5px;}
    
</style>
