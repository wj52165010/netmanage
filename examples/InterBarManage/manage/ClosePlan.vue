<!-- 停业计划页组件 -->
<template>
    <div class="ClosePlan">
      <div class="ClosePlan_container">

        <!--操作栏-->
        <div class="option_bar">
            <div class="item">
                <span>发布时间:</span>
                <div style="display:inline-block;">
                    <el-date-picker  type="date" placeholder="选择日期" :picker-options="simpleTime"> </el-date-picker>
                </div>
            </div>
            <div class="item">
                <span>标题:</span><div style="display:inline-block;">
                   <el-input placeholder="请输入" ></el-input>
                </div>
            </div>
            <div class="item">
                <span>内容:</span><div style="display:inline-block;">
                   <el-input placeholder="请输入" ></el-input>
                </div>
            </div>
            <div class="item">
                <span>执行状态:</span><div style="display:inline-block;">
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

            <div class="item">
                <el-button type="primary" @click="search()"><span>查询</span></el-button>
            </div>

            <!--右边操作栏-->
            <div class="right_option_bar">
                <div class="item" @click="pulishClosePlan()"><i class="fa fa-cog fa-fw" /> 发布停业</div>
                <div class="item" @click="cancelClose()"><i class="fa fa-copyright" /> 撤销停业</div>
                <div class="item" @click="exportData()"><i class="fa fa-share" /> 导出</div>
            </div>
        </div>

         <!--列表头-->
        <div class="table_header">
            <div class="row">
                <div class="column cursor" style="width:50px;" @click="selAll()"><span class="overflow" style="width:50px;"><i :class="{'fa fa-check-square-o':blnAllSel,'fa fa-square-o':!blnAllSel}"></i></span></div>

                <div class="column" style="width:200px;">
                    <span class="overflow" style="width:200px;position:relative;">
                        <span style="margin-right:5px;">场所编码</span>
                        <i class="fa fa-caret-up" :class="{active:!placeCodeOrder}" @click="placeCodeOrder=false"></i><i class="fa fa-caret-down" :class="{active:placeCodeOrder}" @click="placeCodeOrder=true"></i>
                    </span>
                </div>

                <div class="column">
                  <span class="overflow" style="position:relative" :style="{width:column_w+'px'}">
                    <span style="margin-right:5px;">场所名称</span>
                    <i class="fa fa-caret-up" :class="{active:!placeNameOrder}" @click="placeNameOrder=false"></i><i class="fa fa-caret-down" :class="{active:placeNameOrder}" @click="placeNameOrder=true"></i>
                  </span>
                </div>
                <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">执行状态</span></div>
                <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">负责人姓名</span></div>
                <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">负责人电话</span></div>
                <div class="column" style="width:250px;"><span class="overflow" style="width:250px;">停业时效</span></div>
                <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">发布人</span></div>

                <div class="column" style="width:120px;">
                    <span class="overflow" style="width:120px;position:relative;">
                        <span style="margin-right:5px;">发布时间</span>
                        <i class="fa fa-caret-up" :class="{active:!pulishTimeOrder}" @click="pulishTimeOrder=false"></i><i class="fa fa-caret-down" :class="{active:pulishTimeOrder}" @click="pulishTimeOrder=true"></i>
                    </span>
                </div>

                <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">停业原因</span></div>

                <div class="column" style="width:150px;">
                    <span class="overflow" style="width:150px;position:relative;">
                        <span style="margin-right:5px;">所属区域</span>
                        <i class="fa fa-caret-up" :class="{active:!areaOrder}" @click="areaOrder=false"></i><i class="fa fa-caret-down" :class="{active:areaOrder}" @click="areaOrder=true"></i>
                    </span>
                </div>

            </div>
        </div>

        <!--列表体-->
        <div :style="{height:bodyH}" style="position:relative;">
            <!--加载中-->
            <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index: 100;">
                <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
            </div>
            <!--暂无数据-->
            <div v-if="viewData.length<=0 && blnLoading==false" style="width:100%;height:100%;text-align:center;display:table;">
                <div style="display:table-cell;vertical-align: middle;">暂无数据</div>
            </div>

            <Scroll :listen="viewData" ref="scroll">
                <div class="table_body">
                    <div class="row" v-for="(d,i) in viewData">
                        <div class="column cursor" style="width:50px;" @click="selItem(d,i)"><span class="overflow" style="width:50px;"><i :class="{'fa fa-check-square-o':d.checked,'fa fa-square-o':!d.checked}"></i></span></div>
                        <div class="column" style="width:200px;"><span class="overflow clickItem" @click="placeDetail(d)" style="width:200px;">{{d.code}}</span></div>
                        <div class="column"><span class="overflow" :style="{width:column_w+'px'}">{{d.name}}</span></div>
                        <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">{{d.state}}</span></div>
                        <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">{{d.user}}</span></div>
                        <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">{{d.phone}}</span></div>
                        <div class="column" style="width:250px;"><span class="overflow" style="width:250px;">{{d.closeTime}}</span></div>
                        <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">{{d.publishUser}}</span></div>
                        <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">{{d.publishTime}}</span></div>
                        <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">{{d.closeReason}}</span></div>
                        <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">{{d.region}}</span></div>
                    </div>
                </div>
            </Scroll>
        </div>

        <!--分页栏-->
        <div name="page_container" class="page_container" style="background-color:white;">
          <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageIndex+1}}</span></span>
          <div class="firstPage" @click="pageChange(0)">首页</div>
          <div class="prePage" @click="pageChange(pageIndex-1)">上一页</div>
          <div class="nextPage" @click="pageChange(pageIndex+1)">下一页</div>          
        </div>

      </div>
    </div>
</template>

<script>
import Scroll from  'components/scroll'
import PublishClosePlan from './PulishClosePlan'
import PlaceDetail from '../PlaceDetail'

import {BODY_RESIZE} from '../../../store/mutation-types'
export default {
  name: 'ClosePlan',
  components:{Scroll},
  data () {
    return {
      simpleTime:{
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      column_w:0,
      bodyResizeSub:null,
      bodyH:0,
      data:[
          {code:'50099910000005',name:'重庆智多测试部',state:'执行中',user:'张三',phone:'138xxxxxxx',closeTime:'2017-12-06 10:53—2017-12-07 10:53',publishUser:'产品部',publishTime:'2017-12-04 17:09',closeReason:'',region:'南岸区'},
          {code:'50099910000005',name:'重庆智多测试部',state:'执行中',user:'张三',phone:'138xxxxxxx',closeTime:'2017-12-06 10:53—2017-12-07 10:53',publishUser:'产品部',publishTime:'2017-12-04 17:09',closeReason:'',region:'南岸区'},
          {code:'50099910000005',name:'重庆智多测试部',state:'执行中',user:'张三',phone:'138xxxxxxx',closeTime:'2017-12-06 10:53—2017-12-07 10:53',publishUser:'产品部',publishTime:'2017-12-04 17:09',closeReason:'',region:'南岸区'}
        ],
      blnLoading:false,
      pageIndex:0,
      placeNameOrder:false,
      placeCodeOrder:false,
      pulishTimeOrder:false,
      areaOrder:false,
      states:[],
      state:'',
    }
  },
  computed:{
      viewData(){
        return _.map(this.data,d=>{d.checked=d.checked || false; return d;  })
      },
      blnAllSel(){
        return !_.find(this.data,d=>!d.checked);
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
            this.bodyH=`calc(100% - 50px - 40px - ${$(this.$el).find('.option_bar').height()}px)`;

            this.$nextTick(()=>{
                this.$refs.scroll.reloadyScroll()
            })
        },100);
        this.column_w=$(this.$el).width()-1360;
    },
    //全选/取消全选
    selAll(){
        this.data = _.map(this.data,d=>{ d.checked=!this.blnAllSel; return d });
    },
    //单选
    selItem(d,i){
        d.checked=!d.checked;
        this.data.splice(i,1,d);
    },
    //场所详情
    placeDetail(d){
        let s=this;
        tool.open(function(){
            let param={
                title:'场所详情',
                area:'1000px',
                content:`<div class="place_detail_pop" style="width:100%;height:100%;">
                            <PlaceDetail />
                        </div>
                        `,
                components:{PlaceDetail},
                store:s.$store,
                context:{
                    blnExecute:false,
                    ok_btn(){param.close()},
                    cancel_btn(){param.close()}
                }
            };

            return param;
        }());
    },
    //发布停业计划
    pulishClosePlan(){
      let s=this;
        tool.open(function(){
            let param={
                title:'发布停业',
                area:'600px',
                content:`<div class="Publish_Close_pop" style="width:100%;height:100%;">
                            <PublishClosePlan />
                            <div class="option_bar" style="text-align:right;margin:10px;margin-right:18px;" >
                                <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
                                <button type="button" class="btn btn-success" :disabled="blnSubmit || blnExecute" @click="ok_btn()"><span v-if="!blnExecute">确定</span> <i v-if="blnExecute" class="fa fa-spinner fa-pulse"></i></button>
                            </div>
                         </div>
                        `,
                components:{PublishClosePlan},
                store:s.$store,
                computed:{
                  blnSubmit(){
                    return false;
                  }
                },
                context:{
                    blnExecute:false,
                    ok_btn(){param.close()},
                    cancel_btn(){param.close()}
                }
            };

            return param;
        }());
    },
    //导出数据
    exportData(){
      let s=this;
        tool.open(function(){
            let param={
                title:'提示',
                area:'400px',
                content:`<div class="Reset_Num_pop" style="width:100%;height:100%;">
                            <div style="padding: 30px 10px;text-align:center;">请确定是否需要导出所选的50条数据!</div>
                            <div class="option_bar" style="text-align:right;padding:15px;padding-top:0px;">
                                <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
                                <button type="button" class="btn btn-success"  @click="ok_btn()"><span v-if="!blnExecute">确定</span> <i v-if="blnExecute" class="fa fa-spinner fa-pulse"></i></button>
                            </div>
                        </div>
                        `,
                components:{},
                store:s.$store,
                context:{
                    blnExecute:false,
                    ok_btn(){param.close()},
                    cancel_btn(){param.close()}
                }
            };

            return param;
        }());
    },
    //撤销停业
    cancelClose(){
      let s=this;
        tool.open(function(){
            let param={
                title:'提示',
                area:'400px',
                content:`<div class="Reset_Num_pop" style="width:100%;height:100%;">
                            <div style="padding: 30px 10px;text-align:center;"><i class="fa fa-warning" style="font-size:20px;margin-right:10px;color:red;" />确定要撤销对所选15家场所的停业处置吗?</div>
                            <div class="option_bar" style="text-align:right;padding:15px;padding-top:0px;">
                                <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
                                <button type="button" class="btn btn-success"  @click="ok_btn()"><span v-if="!blnExecute">确定</span> <i v-if="blnExecute" class="fa fa-spinner fa-pulse"></i></button>
                            </div>
                        </div>
                        `,
                components:{},
                store:s.$store,
                context:{
                    blnExecute:false,
                    ok_btn(){param.close()},
                    cancel_btn(){param.close()}
                }
            };

            return param;
        }());
    }
  }
}
</script>

<style scoped lang="less">
@import "../../../css/variables.less";
.ClosePlan{width:100%;height:100%;padding:5px;}
.ClosePlan_container{width:100%;height:100%;background-color:white;}

.ClosePlan .option_bar{text-align:left;padding:5px 15px;line-height:40px;}
.ClosePlan .option_bar .item{display:inline-block;margin:2px 5px;}

.ClosePlan .right_option_bar {float:right;}
.ClosePlan .right_option_bar .item{display:inline-block;margin:2px 5px;}
.ClosePlan .right_option_bar .item:hover{cursor:pointer;}
html{.TCol(~".ClosePlan .right_option_bar .item:hover");}

.ClosePlan .cursor{cursor:pointer;}

.ClosePlan .page_container{.border('top');}

.ClosePlan .fa-caret-up{position:absolute;top:8px;cursor:pointer;font-size:14px;color:gray;}
.ClosePlan .fa-caret-down{position:absolute;top:17px;cursor:pointer;font-size:14px;color:gray;}

.ClosePlan .fa-caret-up.active,
.ClosePlan .fa-caret-down.active,
.ClosePlan .fa-caret-up:hover,
.ClosePlan .fa-caret-down:hover{
    color:white;
}

.ClosePlan .clickItem:hover{cursor:pointer;text-decoration:underline;}
html{.TCol(~".ClosePlan .clickItem");}

//列表显示样式
@header_H:40px;
.ClosePlan .table_header{height:@header_H;display:table;width:100%;border:none;color:white;}
html{.TCol(~".ClosePlan .table_header .row",'bg');}

.ClosePlan .table_header .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}
.ClosePlan .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;.border('bottom');background-color:white;}
.ClosePlan .table_header .column .sort_item .triangle-up:hover{cursor:pointer;}
html{.TCol(~".ClosePlan .table_header .column .sort_item .triangle-up:hover",'bbc');}

.ClosePlan .table_header .column .sort_item .triangle-down:hover{cursor:pointer;}
html{.TCol(~".ClosePlan .table_header .column .sort_item .triangle-down:hover",'btc');}

html{.TCol(~".ClosePlan .table_header .column .sort_item .triangle-up.active",'bbc');}

html{.TCol(~".ClosePlan .table_header .column .sort_item .triangle-down.active",'btc');}

.ClosePlan .table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";.border('bottom');}
.ClosePlan .table_body{width:100%;display:table;width:100%;border:none;}
.ClosePlan .table_body .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}

.overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}
</style>
