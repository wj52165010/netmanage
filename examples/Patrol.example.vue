<!-- 巡查列表组件 -->
<template>
    <div class="PatrolList">
        <!--加载中-->
        <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index: 100;">
          <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
        </div>
        <!--操作栏-->
        <div class="option">
          <div class="item">
            <span>场所范围:</span><div style="display:inline-block;"><PlaceSearch  c_searchKind="1"  @place_res="placechange"></PlaceSearch></div>
          </div>
          <div class="item">
            <span>区域范围:</span><div style="display:inline-block;"><PlaceSearch  c_searchKind="0"  @place_res="areachange"></PlaceSearch></div>
          </div>
          <div class="item">
            <span>巡查人员:</span><div style="display:inline-block;"><el-input placeholder="巡查人员" v-model="partrolUser"></el-input></div>
          </div>
          <div class="item">
            <span>巡查结果:</span><div style="display:inline-block;">
              <el-select style="width:100px;" v-model="partrolRes" :clearable="true" placeholder="请选择">
                  <el-option
                      v-for="item in [{name:'合格',val:'1'},{name:'不合格',val:'0'}]"
                      :label="item.name"
                      :value="item.val">
                  </el-option>
              </el-select>
            </div>
          </div>

          <div class="item">
            <el-button type="primary" @click="search()"><i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i><span v-show="!blnSearch">搜索</span></el-button>
          </div>
        </div>
        <!--表头-->
        <div class="table_header">
            <div class="row">
                <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">场所编码</span></div>
                <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">场所名称</span></div>
                <div class="column"><span class="overflow" :style="{width:column_w+'px'}">场所地址</span></div>
                <div class="column" style="width:200px;"><span class="overflow" style="width:200px;">最近巡检日期</span></div>
                <div class="column" style="width:80px;"><span class="overflow" style="width:80px;">已检次数</span></div>
                <div class="column" style="width:80px;"><span class="overflow" style="width:80px;">检查项</span></div>
                <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">巡检人员</span></div>
                <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">巡检结果</span></div>
            </div>
        </div>
        <div class="table_body" :style="{height:bodyH}">
            <!--暂无数据-->
            <div v-if="data.length<=0" style="width:100%;height:100%;text-align:center;display:table;">
                <div style="display:table-cell;vertical-align: middle;">暂无数据</div>
            </div>

            <Scroll :listen="data" ref="scroll">
              <div class="table_conatienr">
                <template v-for="d in data">
                  <div class="row" @click="lookDeail(d)">
                      <div class="column" :title="d.netbar_wacode" style="width:150px;"><span class="overflow" style="width:150px;">{{d.netbar_wacode}}</span></div>
                      <div class="column" :title="d.netbar_name" style="width:150px;"><span class="overflow" style="width:150px;">{{d.netbar_name}}</span></div>
                      <div class="column" :title="d.netbar_address"><span class="overflow" :style="{width:column_w+'px'}">{{d.netbar_address}}</span></div>
                      <div class="column" style="width:200px;"><span class="overflow" style="width:200px;">{{converTime(d.log_time)}}</span></div>
                      <div class="column" style="width:80px;"><span class="overflow" style="width:80px;">{{d.postNum}}</span></div>
                      <div class="column" style="width:80px;"><span class="overflow" style="width:80px;">{{d.itemNum}}</span></div>
                      <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">{{d.user_name}}</span></div>
                      <div class="column" style="width:100px;" @click.stop="lookRes(d)"><span class="overflow" style="width:100px;text-decoration:underline;">{{d.is_pass=='1'?'合格':'不合格'}}</span></div>
                  </div>
                </template>
              </div>
            </Scroll>
        </div>

        <div name="page_container" class="page_container" style="background-color:white;">
          <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageIndex+1}}</span></span>
          <div class="firstPage" @click="pageChange(0)">首页</div>
          <div class="prePage" @click="pageChange(pageIndex-1)">上一页</div>
          <div class="nextPage" @click="pageChange(pageIndex+1)">下一页</div>          
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import Scroll from 'components/scroll'
import PlaceSearch from 'components/PlaceSearch'

import {BODY_RESIZE,GetSitePatrol,HistoryPolicy,HistoryPlicyItem,DetailPolicy,DetailPlaceInfo,DetailPlacePolicy} from '../store/mutation-types'
export default {
  name: 'PatrolList',
  components:{
    PlaceSearch,
    Scroll
  },
  data () {
    return {
      blnLoading:false,
      curPolicy_id:0,//当前显示的策略id
      pageIndex:0,
      column_w:0,
      bodyH:0,
      blnSearch:false,
      data:[],
      partrolUser:'',//巡查人员
      partrolRes:'',//巡查结果
      places:[],//场所范围
      regins:[],//区域范围
    }
  },
  mounted(){
    this.column_w=$(this.$el).width()-930;
    setTimeout(()=>{
      this.bodyH=`calc(100% - 100px - ${$(this.$el).find('.option').height()}px)`;

      this.$nextTick(()=>{this.$refs.scroll.reloadyScroll()})
    },100);
    
    this.$store.commit(BODY_RESIZE,()=>{
      this.column_w=$(this.$el).width()-930;

      this.bodyH=`calc(100% - 100px - ${$(this.$el).find('.option').height()}px)`;
    });

    this.loadData();
  },
  methods:{
    //刷新页面
    refreshPage(){
      this.loadData();
    },
    //加载数据
    loadData(){
      //获取历史记录信息
      this.getListData();

    
    },
    //搜索
    search(){
      //获取历史记录信息
      this.blnSearch=true;
      this.getListData();
    },
    //分页
    pageChange(index){
      this.getListData(index);
    },
    //获取列表数据
    getListData(index){
       if(index!=undefined && index<0){
         index=0;
       }

      this.blnLoading=true;
      this.$store.dispatch(HistoryPolicy,{
        netbar_wacode:this.places.join(','),
        region:this.regins.join(','),
        userName:this.partrolUser,
        is_pass:this.partrolRes,
        skip:index ==undefined ? this.pageIndex*10:index*15,
        limit:15
      }).then(res=>{
        this.blnLoading=false;
        this.blnSearch=false;
        if(!tool.msg(res,'','获取列表数据失败!')) return;
        if(index!=undefined && res.biz_body.length<=0){
          tool.info('已经到了最后页!');
          return;
        }else if(index !=undefined){
          this.pageIndex=index;
        }

        this.data=res.biz_body;

        //console.log(tool.Clone(this.data));
      });
    },
    //查看详细
    lookDeail(d){
      let s=this;
      //console.log(tool.Clone(d));
      tool.open(function(){
        let html=`
          <Scroll :listen="data" ref="scroll">
            <div style="width:100%;height:100%;padding:10px;">
              <div class="detail_item" v-for="(d,i) in data">
                <div class="title_bar">{{i+1}}.{{d.title}}</div>
                <div class="child" v-if="d.blnShowDetail">
                  <div class="child_header">
                    <div class="column">巡检序号</div>
                    <div class="column">巡检结果</div>
                    <div class="column">备注</div>
                    <div class="column">巡检日期</div>
                    <div class="column">巡检人员</div>
                  </div>

                  <div class="child_body" v-if="d.historyItems && d.historyItems.length<=0">
                    <div style="width:100%;height:30px;line-height:30px;text-align:center;">暂无数据</div>
                  </div>
                  
                  <div class="child_body" v-if="d.blnLoadData">
                    <div style="width:100%;height:30px;line-height:30px;text-align:center;"><i class="fa fa-spinner fa-pulse"></i></div>
                  </div>

                  <div class="child_body" v-for="(h,i) in (d.historyItems || [])">
                    <div class="column divEllipsis">{{i+1}}</div>
                    <div class="column divEllipsis">{{h.is_post=='1'?h.btn_text:'未操作'}}</div>
                    <div class="column divEllipsis">{{h.item_remark || '_'}}</div>
                    <div class="column divEllipsis">{{converTime(h.log_time)}}</div>
                    <div class="column divEllipsis">{{h.user_name}}</div>
                  </div>
                </div>
                <div class="extend_bar" @click="toggleShowDetail(d)" :style="{'border-top-width':d.blnShowDetail==true?'1px':'0px'}">
                  <div :class="d.blnShowDetail?'triangle_border_up':'triangle_border_down'"></div>  
                </div>
              </div>
            </div>
          </Scroll>
        `;
        let param={
          title:`检查项详情(${d.netbar_name})`,
          area:['600px','400px'],
          content:`<div class="patraol_addPop_detail"  style="width:100%;height:100%;">${html}</div>`,
          components:{Scroll},
          store:s.$store,
          context:{
            data:[],
            patrol_id:'',
            netbar_wacode:d.netbar_wacode,
            policy_id:d.policy_id,
            toggleShowDetail(d){
              if(d.blnShowDetail == undefined){

                Vue.set(d,'blnShowDetail',true);
                Vue.set(d,'blnLoadData',true);
                 s.$store.dispatch(DetailPlacePolicy,{
                   patrol_id:param.selfData.patrol_id,
                   netbar_wacode:param.selfData.netbar_wacode,
                   policy_id:param.selfData.policy_id,
                   policy_item_id:d.itemId,
                }).then(res=>{
                  Vue.set(d,'blnLoadData',false);
                  Vue.set(d,'historyItems',res.biz_body);
                  
                });

              }else{
                d.blnShowDetail=!d.blnShowDetail;
              }

              s.$nextTick(()=>{
                param.$refs.scroll.reloadyScroll();
              })
            },
            converTime(t){
              if(!t) return '';
              return tool.DateByTimestamp(t,'yyyy-MM-dd');
            }
          },
          success(){
            s.$store.dispatch(DetailPlaceInfo,{netbar_wacode:d.netbar_wacode,policy_id:d.policy_id}).then(res=>{
              param.selfData.data=res.biz_body[0].note;
              param.selfData.patrol_id=res.biz_body[0].patrol_id;
            })
          }
        };

        return param;

      }());
    },
    //查看巡检结果
    lookRes(d){
      let s=this;
      tool.open(function(){
        let html=`
          <div class="res_bar">
            <div class="res_bar_item"><span class="title">巡检结果 : </span>{{data.is_pass=='1'?'合格':'不合格'}}</div>
            <div class="res_bar_item"><span class="title">巡检日期 : </span>{{converTime(data.log_time)}}</div>
            <div class="res_bar_item"><span class="title">巡检人员 : </span>{{data.user_name}}</div>
          </div>

          <div class="content">
            <Scroll :listen="items">
              <div class="item" v-for="(d,i) in items">
                <div class="title_bar divEllipsis" :title="d.title">{{i+1}}.{{d.title}}</div>
                <div class="title_content">
                  <div class="content_item"><span class="title">检查结果 : </span> {{d.items[0].text}}</div>
                  <div class="content_item divEllipsis"><span class="title">备注 : </span> {{d.remark}}</div>
                </div>
              </div>
            </Scroll>
          </div>
        `;

        let param={
          title:`巡查结果(${d.netbar_name})`,
          area:['600px','400px'],
          content:`<div class="patraol_addPop_res"  style="width:100%;height:100%;">${html}</div>`,
          components:{Scroll},
          store:s.$store,
          context:{
            data:{},
            items:[],
            converTime(t){
              if(!t) return '';
              return tool.DateByTimestamp(t,'yyyy-MM-dd');
            }
          },
          success(){
            s.$store.dispatch(DetailPolicy,{code:d.netbar_wacode,policy_id:d.policy_id,is_last:'1'}).then(res=>{
              param.selfData.data=res.biz_body[0];
              param.selfData.items=res.biz_body[0].note;
            })
          }
        };

        return param;
      }());
    },
    placechange(context,v){
      let sites=v.sites;
      this.places=_.map(sites,s=>s.code);
    },
    areachange(context,v){
      let regions=v.regions;
      this.regins=_.map(regions,s=>s.code);
    },
    converTime(t){
      if(!t) return '';
      return tool.DateByTimestamp(t,'yyyy-MM-dd hh:mm:ss');
    }
  }
}
</script>

<style lang="less">
  @import "../css/variables.less";
  .patraol_addPop_detail .detail_item{width:100%;margin-bottom:10px;.border('');border-radius:5px;}

  .patraol_addPop_detail .detail_item .title_bar{line-height:40px;height:40px;.border('bottom');padding:0 10px;}
  .patraol_addPop_detail .detail_item .extend_bar{line-height:20px;height:20px;text-align:center;cursor:pointer;.border('top');}
  .patraol_addPop_detail .detail_item .child{
    width:100%;padding:10px;
  }
  .patraol_addPop_detail .detail_item .child .child_header{width:100%;overflow:hidden;.border('bottom');line-height:30px;}
  .patraol_addPop_detail .detail_item .child .child_header .column{float:left;width:20%;text-align:center;color:@FontCol;}

  .patraol_addPop_detail .detail_item .child .child_body{width:100%;overflow:hidden;.border('bottom');line-height:26px;}
  .patraol_addPop_detail .detail_item .child .child_body .column{float:left;width:20%;text-align:center;}


  .patraol_addPop_detail .detail_item .triangle_border_up{
      width:0;
      height:0;
      border-width:0 10px 10px;
      border-style:solid;
      border-color:transparent transparent @FontCol;/*透明 透明  灰*/
      position:relative;
      display:inline-block;
  }
  .patraol_addPop_detail .detail_item .triangle_border_down{
      width:0;
      height:0;
      border-width:10px 10px 0;
      border-style:solid;
      border-color:@FontCol transparent transparent;/*灰 透明 透明 */
      position:relative;
      display:inline-block;
  }


  .patraol_addPop_res .res_bar{padding:0px 10px;width:100%;height:45px;line-height:45px;}


  .patraol_addPop_res .res_bar .res_bar_item{float:left;width:33%;text-align:center;}
  .patraol_addPop_res .res_bar .res_bar_item .title{color:@FontCol;}

  .patraol_addPop_res .content{width:100%;height:~"calc(100% - 45px)";padding:10px;}
  .patraol_addPop_res .content .item{.border('');border-radius:5px;margin-bottom:10px;}

  .patraol_addPop_res .content .item .title_bar{line-height:40px;height:40px;.border('bottom');padding:0 10px;}
  .patraol_addPop_res .content .item .title_content{line-height:40px;height:40px;padding:0 10px;overflow:hidden;}
  .patraol_addPop_res .content .item .title_content .content_item{float:left;width:50%;}
  .patraol_addPop_res .content .item .title_content .content_item .title{color:@FontCol;}

</style>

<style scoped lang="less">
@import "../css/variables.less";
.PatrolList{width:100%;height:100%;padding:5px;position:relative;}

.PatrolList .option{text-align:left;padding:10px;}
.PatrolList .option .item{display:inline-block;margin:2px 0;}


.PatrolList .table_body .row{cursor:pointer;}
//列表显示样式
@header_H:40px;
.PatrolList .table_header{height:@header_H;display:table;width:100%;border:none;color:white;}
html{.TCol(~".PatrolList .table_header .row",'bg');}

.PatrolList .table_header .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
.PatrolList .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;.border('bottom');background-color:white;}
.PatrolList .table_header .column .sort_item .triangle-up:hover{cursor:pointer;}
html{.TCol(~".PatrolList .table_header .column .sort_item .triangle-up:hover",'bbc');}

.PatrolList .table_header .column .sort_item .triangle-down:hover{cursor:pointer;}
html{.TCol(~".PatrolList .table_header .column .sort_item .triangle-down:hover",'btc');}

//.HighRisk .table_header .column .sort_item .triangle-up.active{border-bottom-color:@Font_Hover_Col;}
html{.TCol(~".PatrolList .table_header .column .sort_item .triangle-up.active",'bbc');}

//.HighRisk .table_header .column .sort_item .triangle-down.active{border-top-color:@Font_Hover_Col;}

html{.TCol(~".PatrolList .table_header .column .sort_item .triangle-down.active",'btc');}

.PatrolList .table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";.border('bottom');}
.PatrolList .table_conatienr{width:100%;display:table;width:100%;border:none;}
.PatrolList .table_conatienr .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}

.overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}
</style>
