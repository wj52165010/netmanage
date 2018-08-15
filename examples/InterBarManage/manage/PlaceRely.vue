<!-- 场所回复页组件 -->
<template>
    <div class="PlaceRely">
      <div class="PlaceRely_container">
        
        <!--列表头-->
        <div class="table_header" v-if="data.length>0">
            <div class="row">
                <div class="column" style="width:200px;"><span class="overflow" style="width:200px;">场所名称</span></div>
                <div class="column"><span class="overflow" :style="{width:column_w+'px'}">回复内容</span></div>
            </div>
        </div>

        <!--列表体-->
        <div :style="{height:bodyH}" style="position:relative;">
            <!--加载中-->
            <Loading v-if="blnLoading" />
            <!--暂无数据-->
            <div v-if="data.length<=0 && blnLoading==false" style="width:100%;height:100%;text-align:center;display:table;color:gray;">
                <div style="display:table-cell;vertical-align: middle;">暂无场所回复该通知!</div>
            </div>

            <Scroll :listen="data" ref="scroll">
                <div class="table_body">
                    <div class="row" v-for="d in data">
                        <div class="column" style="width:200px;"><span class="overflow" style="width:200px;">{{d.netbar_name}}</span></div>
                        <div class="column"><span class="overflow" :style="{width:column_w+'px'}" :title="d.content">{{d.content}}</span></div>
                    </div>
                </div>
            </Scroll>
        </div>

      </div>
    </div>
</template>

<script>
import Loading from 'components/Loading'

import Scroll from  'components/scroll'
import {BODY_RESIZE,netbar_notice_reply_list} from '../../../store/mutation-types'
export default {
  name: 'PlaceRely',
  props:['code'],
  components:{Scroll},
  data () {
    return {
        column_w:0,
        bodyResizeSub:null,
        bodyH:0,
        data:[1,2,3],
        blnLoading:false,
    }
  },
  mounted(){
   
   this.loadData();
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
            this.bodyH=`calc(100% - 40px - 10px )`;

            this.$nextTick(()=>{
                this.$refs.scroll.reloadyScroll()
            })
        },100);
        this.column_w=$(this.$el).width()-200;
    },
    loadData(){
        this.blnLoading=true;
        this.$store.dispatch(netbar_notice_reply_list,{
            notice_id:this.code,
            limit:1000,
            skip:0
        }).then(res=>{
            this.blnLoading=false;
            if(!tool.msg(res,'','获取回复列表数据失败!')) return;

            this.data =  res.biz_body;
        });


    }
  }
}
</script>

<style scoped lang="less">
  @import "../../../css/variables.less";
  .PlaceRely{width:100%;height:100%;padding:5px;}
  .PlaceRely_container{width:100%;height:100%;background-color:white;}

  //列表显示样式
@header_H:40px;
.PlaceRely .table_header{height:@header_H;display:table;width:100%;border:none;color:white;}
html{.TCol(~".PlaceRely .table_header .row",'bg');}

.PlaceRely .table_header .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}
.PlaceRely .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;.border('bottom');background-color:white;}
.PlaceRely .table_header .column .sort_item .triangle-up:hover{cursor:pointer;}
html{.TCol(~".PlaceRely .table_header .column .sort_item .triangle-up:hover",'bbc');}

.PlaceRely .table_header .column .sort_item .triangle-down:hover{cursor:pointer;}
html{.TCol(~".PlaceRely .table_header .column .sort_item .triangle-down:hover",'btc');}

html{.TCol(~".PlaceRely .table_header .column .sort_item .triangle-up.active",'bbc');}

html{.TCol(~".PlaceRely .table_header .column .sort_item .triangle-down.active",'btc');}

.PlaceRely .table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";.border('bottom');}
.PlaceRely .table_body{width:100%;display:table;width:100%;border:none;}
.PlaceRely .table_body .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}

.overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}
</style>
