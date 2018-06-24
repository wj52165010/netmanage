<!-- 手风琴组件 -->
<template>
    <div class="Accordion">
        <!--加载中标识-->
        <div v-if="!blnLoadData" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index: 100;">
          <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;"><i class="fa fa-spinner fa-pulse"></i></div></div>
        </div>
        <template v-for="(i,dindex) in list">
            <div class="tag_item" @click="tagClick(dindex)">
                <span @click.stop="i.click"><i :class="i.icon" style="margin-right:5px;"></i>{{i.name}}</span>
                <span style="float:right;font-style: italic;font-weight: 600;">{{i.childs.length}}</span>
                <div style="float:right;width:150px;margin-top:7px;margin-right:15px;"><IconInput :extrput="{i:i,index:dindex}" @change="tagSearchChange" /></div>
            </div>
            <div class="tag_content" v-show="curShowTagIndex==dindex" :style="{height:curShowTagIndex==dindex?(cH-data.length*40)+'px':'0px'}">
                <scroll :listen="i.childs" :ref="('scroll'+dindex)">
                    <div class="list_item" :class="{active:curSelPage==(dindex+''+index)}" v-for="(item,index) in i.childs" @click="menuItem_click(item,(dindex+''+index));">
                        <span class="icon">
                            <i :class="item.icon"></i>
                            <!--<span :title="item.isSave?item.keyid:''" style="font-size:12px;position: absolute;right: 0px;top:-25px;width:30px;overflow:hidden;">{{item.isSave?item.keyid:''}}</span>-->
                        </span>
                        <div class="title">
                            <div class="title_name">{{item.name}}</div>
                            <div class="title_kind">{{(item.menu_type || MenuKind[0]).name}}</div>
                            <div class="title_info">{{formatTime(item.createtime,'yyyy-MM-dd')}}</div>
                        </div>
                        <div class="option">
                            <div><i class="fa fa-close" v-show="!item.isSave" @click.stop="del_item(item.keyid)"></i></div>
                            <div><i class="fa fa-close"  v-show="item.isSave && (notDelArr || []).indexOf(item.keyid)<0"  @click.stop="del_data_item(item.keyid,item)"></i></div>
                            <div><i class="fa fa-pencil" v-show="item.isSave" @click.stop="del_update(item)"></i></div>
                        </div>
                    </div>
                </scroll>
            </div>
        </template>
    </div>
</template>

<script>
import scroll from 'components/scroll'
import {BODY_RESIZE} from '../store/mutation-types'
import IconInput from 'components/IconInput'

export default {
  name: 'Accordion',
  props:['data','curSelPage','notDelArr'],
  components:{
    scroll,IconInput
  },
  data () {
    return {
        cH:0,//容器高度
        curShowTagIndex:0,//当前显示TAG索引,
        cacheData:[],//缓存数据
        curSelKind:[],//当前选中的分类对象集合
        blnLoadData:false,
        bodyResizeSub:null,
    }
  },
  computed:{
      list(){
         let res=tool.Clone(this.cacheData),s=this;
         for(let i=0;i<s.curSelKind.length;i++){
             let curSearch = s.curSelKind[i];
             let kind=_.find(res,c=>c.id==curSearch.item.i.id);
             let childs = kind.childs;
         
             kind.childs=_.filter(childs,c=>c.name.indexOf(curSearch.val)>=0);
         }

        return res;
      }
  },
  watch:{
      data(){
          this.cacheData=tool.Clone(this.data);
          this.blnLoadData=true;
      }
  },
  mounted(){
      this.cH=$(this.$el).height();
      this.cacheData=tool.Clone(this.data);
      
      this.$store.commit(BODY_RESIZE,{cb:(sub)=>{
        this.bodyResizeSub=sub
      },sub:()=>{
        this.cH=$(this.$el).height();
        setTimeout(()=>{
            this.$refs['scroll0'] && this.$refs['scroll0'][0] && this.$refs['scroll0'][0].reloadyScroll();
            this.$refs['scroll1'] && this.$refs['scroll1'][0] && this.$refs['scroll1'][0].reloadyScroll();
        },100);
      }});

  },
  beforeDestroy(){
    this.bodyResizeSub.unsubscribe();
  },
  methods:{
      //刷新滚动条
      refreshScroll(){
          setTimeout(()=>{
            this.$refs['scroll0'][0].reloadyScroll();
            this.$refs['scroll1'][0].reloadyScroll();
          },100);
      },
      //格式化时间
      formatTime(time,format){
          return tool.DateByTimestamp(time,format);
      },
      //Tag项单机事件
      tagClick(tagIndex){
        if(this.curShowTagIndex==tagIndex){this.curShowTagIndex=-1;return;}
        this.curShowTagIndex=tagIndex;
        this.$nextTick(()=>{
            this.$refs['scroll'+tagIndex][0].reloadyScroll();
        });
      },
      //Tag项过滤搜索事件
      tagSearchChange(val,item){
          let tmp= _.find(this.curSelKind,c=>item.i.id==c.item.i.id);
          if(tmp){
              tmp.val=val;
          }else{
              this.curSelKind.push({val:val,item:item});
          }
          
          this.$nextTick(()=>{
            this.curShowTagIndex=item.index;
          });
      },
      menuItem_click(item,index){this.$emit('menuItem_click',item,index)},
      del_item(index){this.$emit('del_item',index)},
      del_data_item(index,item){this.$emit('del_data_item',index,item)},
      del_update(index){this.$emit('del_update',index)}
  }
}
</script>

<style scoped lang="less">
    @import "../css/variables.less";

    @tagH:40px;
    @list_itemH:80px;
    .Accordion{width:100%;height:100%;position:relative;}
    .Accordion .tag_item{
        line-height:@tagH;text-align:left;font-size:12px;padding:0px 10px;background-color:@btn_Bg_Col_hover_1;color:white;margin-bottom:1px;
        cursor:pointer;
    }
    .Accordion .tag_content{.transLine()}
    .Accordion .tag_content .list_item{
        text-align:left;height:@list_itemH;.border('bottom',tint(@borderCol));padding:0px 10px 0px 0px;cursor:pointer;
        color:@FontCol;.trans(.1s);position: relative;overflow: hidden;
    }

    .Accordion .tag_content .list_item .tipInfo{
        position: absolute;width: 30px;height: 30px;
        color:white;font-size:12px;
    }
    .Accordion .tag_content .list_item .title{padding-left: 90px;padding-top: 5px;}

    .Accordion .tag_content .list_item .tipInfo.flag-o{background: linear-gradient(-45deg, transparent 50%, @btn_Bg_Col_hover_6 50%);}
    .Accordion .tag_content .list_item .tipInfo.bars{background: linear-gradient(-45deg, transparent 50%, @btn_Bg_Col_hover_1 50%);}

    .Accordion .tag_content .list_item .tipInfo i{margin-left:3px;}

    .Accordion .tag_content .list_item .title .title_name{margin-bottom:10px;font-style:italic;width:160px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
    .Accordion .tag_content .list_item .title .title_kind{font-size:12px;}
    .Accordion .tag_content .list_item .title .title_info{font-size:12px;}

    .Accordion .tag_content .list_item .icon{
        height:-(1-@list_itemH);width:@list_itemH;text-align:center;float:left;font-size:40px;position:relative;line-height:@list_itemH;
    }
    .Accordion .tag_content .list_item .date{float:right;font-size:12px;margin-right:10px;}
    .Accordion .tag_content .list_item .option{
        height:@list_itemH;font-size:20px;cursor:pointer;position:absolute;right: 0px;top:0px;width: 50px;text-align:center;display:none;}
    .Accordion .tag_content .list_item .option > div{line-height:40px;color:white;font-size:20px;}
    .Accordion .tag_content .list_item:hover .option{display:block;}

    .Accordion .tag_content .list_item.active{background-color:@Active_Bg_Col;color:@Active_Front_Col;}
    .Accordion .tag_content .list_item.active .icon{.border('right',shade(@borderCol,10%))}
    .Accordion .tag_content .list_item:hover{background-color:@btn_Bg_Col_hover_1;color:@Active_Front_Col;}
</style>
