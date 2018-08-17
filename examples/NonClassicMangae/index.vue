<!-- 非经管理主页组件 -->
<template>
    <div class="NonClassicMangae">
      <div class="NonClassicMangae_container">
        <HTag :tags="pages" @change="tagChange">
          <!--分析页面-->
          <div slot="t0" style="height:100%;width:100%;">
              <Analysis ref="Analysis" />
          </div>
        
          <!--管理页面-->
          <!--<div slot="t1" style="height:100%;width:100%;">
              <Manage ref="Manage" />
          </div>-->

          <!--列表页面-->
          <div slot="t1" style="height:100%;width:100%;">
              <ListIndex ref="ListIndex" />
          </div>

          <!--地图页面-->
          <div slot="t2" style="height:100%;width:100%;">
              地图页面
          </div>

        </HTag>
      </div>
    </div>
</template>

<script>
import HTag from 'components/HTag'
import Analysis from './analysis/index'
import ListIndex from './list/index'
import Manage from './manage/manage'

export default {
  name: 'NonClassicMangae',
  components:{HTag,ListIndex,Analysis,Manage},
  data () {
    return {
       pages:[
              {name:'分析',icon:'fa fa-area-chart'},
              //{name:'管理',icon:'fa fa-cog fa-fw'},
              {name:'列表',icon:'fa fa-list'},
              {name:'地图',icon:'fa fa-map-marker'}
            ],
      pagesIndex:0,
    }
  },
  watch:{
    pagesIndex(){
      this.$nextTick(()=>{
        switch(this.pagesIndex){
          case 0: //分析
            this.$refs.Analysis && this.$refs.Analysis.layout();
            break;
          // case 1://管理
          //   this.$refs.Manage && this.$refs.Manage.layout();
          //   break;
          case 1://列表
            this.$refs.ListIndex && this.$refs.ListIndex.layout();
            break;
          case 2://地图
            break;
        }
      });
    }
  },
  methods:{
    tagChange(index){
      this.pagesIndex=index;
    }
  }
}
</script>

<style scoped lang="less">
  @import "../../css/variables.less";
  .NonClassicMangae{width:100%;height:100%;padding:5px;}
  .NonClassicMangae_container{width:100%;height:100%;background-color:white;}
</style>
