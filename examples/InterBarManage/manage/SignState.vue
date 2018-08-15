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
                            v-for="kind in dict_tables.notice_sign_status"
                            :key="kind.value"
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
            <Loading v-if="blnLoading" />
            <!--暂无数据-->
            <div v-if="data.length<=0 && blnLoading==false" style="width:100%;height:100%;text-align:center;display:table;">
                <div style="display:table-cell;vertical-align: middle;">暂无数据</div>
            </div>

            <Scroll :listen="data" ref="scroll">
                <div class="table_body">
                    <div class="row" v-for="d in data">
                        <div class="column"><span class="overflow" :style="{width:column_w+'px'}">{{d.netbar_name}}</span></div>
                        <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">{{d.is_signature_desc}}</span></div>
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
import {BODY_RESIZE,InterBar,getDictTables} from '../../../store/mutation-types'
export default {
  name: 'SignState',
  props:['code'],
  components:{Scroll,Loading},
  data () {
    return {
        state:'',
        column_w:0,
        bodyResizeSub:null,
        bodyH:0,
        data:[],
        dict_tables:{},
        blnLoading:false,
    }
  },
  watch:{
    state(){
        this.loadData();
    }
  },
  mounted(){

    this.loadData();
    this.layout();

    //获取数据来源（下拉框序列化）
    this.$store.dispatch(getDictTables).then(res=>{
        if(res.msg.code!='successed')return;
        this.dict_tables= res.biz_body;
    });

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
    //加载数据
    loadData(){

        this.blnLoading=true;
        this.$store.dispatch(InterBar.netbar_notice_sign_list,{
            limit:1000,
            skip:0,
            sign_status:this.state,
            notice_id:this.code
        }).then(res=>{
            this.blnLoading=false;
            if(!tool.msg(res,'','获取签收列表数据失败!')) return;

            this.data=res.biz_body;

        });
    }
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
