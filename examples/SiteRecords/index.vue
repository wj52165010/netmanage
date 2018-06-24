<!-- 导航组件 -->
<template>
    <div class="SiteRecords">
        <div class="Site_container">
            <HTag :tags="pages" @change="tagChange">
                <!--未备案网站页面-->
                <div slot="t0" style="height:100%;width:100%;">
                    <UnRecords ref="unRecords" />
                </div>
                
                <!--备案网站页面-->
                <div slot="t1" style="height:100%;width:100%;">
                    <Records ref="records" />
                </div>
            </HTag>
        </div>
    </div>
</template>

<script>
import HTag from 'components/HTag'
import UnRecords from './unRecords'
import Records from './Records'

export default {
  name: 'SiteRecords',
  components:{HTag,UnRecords,Records},
  data () {
    return {
        pages:[{name:'未备案网站',icon:'fa fa-list'},{name:'备案网站',icon:'fa fa-map-marker'}],
        curPage:0,
    }
  },
  methods:{
    //刷新页面
    refreshPage(){
      this.curPage==0?this.$refs.unRecords.refreshPage():this.$refs.records.refreshPage();
    },
    tagChange(i){
        i==0?this.$refs.unRecords.layout():this.$refs.records.layout();
        this.curPage=i;
    }
  }
}
</script>
<style scoped lang="less">
 @import "../../css/variables.less";
 .SiteRecords{width:100%;height:100%;padding:5px;}
 .Site_container{width:100%;height:100%;background-color:white;}

</style>
