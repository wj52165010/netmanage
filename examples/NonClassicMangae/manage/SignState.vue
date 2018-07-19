<!-- 签收状态组件 -->
<template>
    <div class="SignState">
      <div class="SignState_container">
        <!--操作栏-->
        <div class="option_bar">
            <div class="item">
                <span>签收状态:</span>
                <div style="display:inline-block;">
                   <el-select v-model="state" placeholder="请选择" :clearable="true">
                        <el-option
                            v-for="kind in states"
                            :key="kind.code"
                            :label="kind.name"
                            :value="kind.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </div>

        <!--列表头-->
        <div class="table_header">
            <div class="row">
                <div class="column"><span class="overflow" :style="{width:column_w+'px'}">场所名称</span></div>
                <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">签收状态</span></div>
            </div>
        </div>

        <!--列表体-->
        <div :style="{height:bodyH}" style="position:relative;">
            <!--加载中-->
            <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index: 100;">
                <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
            </div>
            <!--暂无数据-->
            <div v-if="data.length<=0 && blnLoading==false" style="width:100%;height:100%;text-align:center;display:table;">
                <div style="display:table-cell;vertical-align: middle;">暂无数据</div>
            </div>

            <Scroll :listen="data" ref="scroll">
                <div class="table_body">
                    <div class="row" v-for="d in data">
                        <div class="column"><span class="overflow" :style="{width:column_w+'px'}">场所名称</span></div>
                        <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">签收状态</span></div>
                    </div>
                </div>
            </Scroll>
        </div>

      </div>
    </div>
</template>

<script>
import Scroll from  'components/scroll'
import {BODY_RESIZE} from '../../../store/mutation-types'
export default {
  name: 'SignState',
  components:{Scroll},
  data () {
    return {
        states:[],
        state:'',
        column_w:0,
        bodyResizeSub:null,
        bodyH:0,
        data:[1,2,3],
        blnLoading:false,
    }
  },
  mounted(){
   this.layout();
   this.$store.commit(BODY_RESIZE,{cb:(sub)=>{
       this.bodyResizeSub=sub
   },sub:()=>{
      this.layout();
   }});
  },
  beforeDestroy(){
    this.bodyResizeSub.unsubscribe();
  },
  methods:{
    layout(){
        setTimeout(()=>{
            this.bodyH=`calc(100% - 40px - 10px - ${$(this.$el).find('.option_bar').height()}px)`;

            this.$nextTick(()=>{
                this.$refs.scroll.reloadyScroll()
            })
        },100);
        this.column_w=$(this.$el).width()-100;
    },
  }
}
</script>

<style scoped lang="less">
@import "../../../css/variables.less";
.SignState{width:100%;height:100%;padding:5px;}
.SignState_container{width:100%;height:100%;background-color:white;}

.SignState .option_bar{text-align:left;padding:5px 15px;line-height:40px;}
.SignState .option_bar .item{display:inline-block;margin:2px 5px;}

//列表显示样式
@header_H:40px;
.SignState .table_header{height:@header_H;display:table;width:100%;border:none;color:white;}
html{.TCol(~".SignState .table_header .row",'bg');}

.SignState .table_header .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}
.SignState .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;.border('bottom');background-color:white;}
.SignState .table_header .column .sort_item .triangle-up:hover{cursor:pointer;}
html{.TCol(~".SignState .table_header .column .sort_item .triangle-up:hover",'bbc');}

.SignState .table_header .column .sort_item .triangle-down:hover{cursor:pointer;}
html{.TCol(~".SignState .table_header .column .sort_item .triangle-down:hover",'btc');}

html{.TCol(~".SignState .table_header .column .sort_item .triangle-up.active",'bbc');}

html{.TCol(~".SignState .table_header .column .sort_item .triangle-down.active",'btc');}

.SignState .table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";.border('bottom');}
.SignState .table_body{width:100%;display:table;width:100%;border:none;}
.SignState .table_body .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}

.overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}
</style>
