<!-- web漏洞页面组件 -->
<template>
    <div class="WebBug">
       <!--操作栏-->
      <div class="option_bar">
        <div class="item">
              <span>漏洞级别:</span><div style="display:inline-block;">
                <el-select style="width:100px;" :clearable="true" placeholder="请选择">
                    <el-option
                        v-for="item in [{name:'高风险',val:'0'},{name:'中风险',val:'1'},{name:'低风险',val:'2'}]"
                        :label="item.name"
                        :value="item.val">
                    </el-option>
                </el-select>
            </div>
        </div>
      </div>

      <!--列表头-->
      <div class="table_header">
          <div class="row">
              <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">风险级别</span></div>
              <div class="column"><span class="overflow" :style="{width:column_w/2+'px'}">漏洞名称</span></div>
              <div class="column"><span class="overflow" :style="{width:column_w/2+'px'}">漏洞URL</span></div>
          </div>
      </div>
      
      <!--列表体-->
      <div class="table_body" :style="{height:bodyH}" style="position:relative;">
          <!--加载中-->
          <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index: 100;">
              <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
          </div>
          <!--暂无数据-->
          <div class="row" v-if="data.length<=0">暂无数据</div>

          <Scroll :listen="data" ref="scroll">
              <div class="row" @click.stop="detail()">
                  <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">风险级别</span></div>
                  <div class="column"><span class="overflow" :style="{width:column_w/2+'px'}">漏洞名称</span></div>
                  <div class="column"><span class="overflow" :style="{width:column_w/2+'px'}">漏洞URL</span></div>
              </div>
          </Scroll>
      </div>

    </div>
</template>

<script>
import Scroll from  'components/scroll'

import {BODY_RESIZE} from '../../store/mutation-types'
export default {
  name: 'WebBug',
  components:{Scroll},
  data () {
    return {
      blnLoading:false,
      bodyH:0,
      column_w:0,
      bodyResizeSub:null,
      pageIndex:0,
      data:[1],
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
            this.bodyH=`calc(100% - 50px - ${$(this.$el).find('.option_bar').height()}px)`;

            this.$nextTick(()=>{
               this.$refs.scroll.reloadyScroll()
            })
        },100);
        this.column_w=$(this.$el).width()-150;
    },
    //详细
    detail(){
      tool.open(function(){
        let html=`
          <div style="font-weight:600;margin-bottom:5px">风险级别</div>
          <div style="margin-bottom:5px">中</div>
          <div style="font-weight:600;margin-bottom:5px">漏洞描述</div>
          <div style="margin-bottom:5px;word-break: break-all;">在这个端口上发现一个位置的服务.特洛伊木马和其他恶意软件有事可能会打开这些端口,以允许远程访问机器.</div>
          <div style="font-weight:600;margin-bottom:5px">解决办法</div>
          <div style="margin-bottom:5px">请删除包含的路径信息</div>
          <div style="font-weight:600;margin-bottom:5px">漏洞URL</div>
          <div style="margin-bottom:5px">http://www.ayjxjy.com/zxkt_scholl.aspx</div>
        `;
        let param={
            title:'漏洞详情',
            area:'600px',
            content:`<div class="systemBug_addPop" style="padding:10px;">${html}</div>`,
            context:{

            }
        };

        return param;
      }());
    }
  }
}
</script>

<style scoped lang="less">
  @import "../../css/variables.less";
  .WebBug{width:100%;height:100%;}

  .WebBug .option_bar{text-align:left;padding:5px 15px;}
  .WebBug .option_bar .item{display:inline-block;margin:2px 5px;}

  .WebBug .table_body .row .bold{font-weight:bold;color:#03ab67;}
  .WebBug .table_body .row .bold:hover{text-decoration:underline;cursor:pointer;}
  //列表显示样式
  @header_H:40px;
  .WebBug .table_header{height:@header_H;display:table;width:100%;border:none;color:white;}
  html{.TCol(~".WebBug .table_header .row",'bg');}

  .WebBug .table_header .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}
  .WebBug .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;.border('bottom');background-color:white;}
  .WebBug .table_header .column .sort_item .triangle-up:hover{cursor:pointer;}
  html{.TCol(~".WebBug .table_header .column .sort_item .triangle-up:hover",'bbc');}

  .WebBug .table_header .column .sort_item .triangle-down:hover{cursor:pointer;}
  html{.TCol(~".WebBug .table_header .column .sort_item .triangle-down:hover",'btc');}

  html{.TCol(~".WebBug .table_header .column .sort_item .triangle-up.active",'bbc');}

  html{.TCol(~".WebBug .table_header .column .sort_item .triangle-down.active",'btc');}

  .WebBug .table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";.border('bottom');}
  .WebBug .table_body{width:100%;display:table;width:100%;border:none;}
  .WebBug .table_body .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}

  .overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}

  .WebBug .table_body .row:hover{cursor:pointer;background-color:#f5f5f5;}
</style>
