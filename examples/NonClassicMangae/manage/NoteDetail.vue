<!-- 通知详情页面组件 -->
<template>
    <div class="NoteDetail">
      <div class="NoteDetail_container">
        <HTag :tags="pages" @change="tagChange">
            <!--通知内容页面-->
            <div slot="t0" style="height:100%;width:100%;padding:10px;">
                <NoteContent ref="NoteContent" />
            </div>

            <!--签收状态页面-->
            <div slot="t1" style="height:100%;width:100%;">
                <SignState ref="SignState" />
            </div>

            <!--场所回复页面-->
            <div slot="t2" style="height:100%;width:100%;">
                <PlaceRely ref="PlaceRely" />
            </div>
        </HTag>
      </div>
    </div>
</template>

<script>
import HTag from 'components/HTag'
import NoteContent from './NoteContent'
import SignState from  './SignState'
import PlaceRely from './PlaceRely'
export default {
  name: 'NoteDetail',
  components:{HTag,NoteContent,SignState,PlaceRely},
  data () {
    return {
        pages:[
            {name:'通知内容',icon:'fa fa-area-chart'},
            {name:'签收状态',icon:'fa fa-cog fa-fw'},
            {name:'场所回复',icon:'fa fa-list'},
        ],
        pageIndex:0,
    }
  },
  watch:{
    pageIndex(){
        this.$nextTick(()=>{

            switch(this.pageIndex){
                case 0://通知内容
                    this.$refs.NoteContent.layout && this.$refs.NoteContent.layout();
                    break;
                case 1://签收状态
                    this.$refs.SignState.layout && this.$refs.SignState.layout();
                    break;
                case 2://场所回复
                    this.$refs.PlaceRely.layout && this.$refs.PlaceRely.layout();
                    break;
            }
        })
    }
  },
  methods:{
    tagChange(index){
        this.pageIndex=index;
    }
  }
}
</script>

<style scoped lang="less">
  @import "../../../css/variables.less";
  .NoteDetail{width:100%;height:100%;padding:5px;}
  .NoteDetail_container{width:100%;height:100%;background-color:white;}
</style>
