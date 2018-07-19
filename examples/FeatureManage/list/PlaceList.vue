<!-- 场所列表页页面组件 -->
<template>
    <div class="PlaceList">
        <div class="PlaceList_container">

            <!--操作栏-->
            <div class="option_bar">
                <div class="item">
                    <span>场所编码:</span>
                    <div style="display:inline-block;">
                        <PlaceSearch :blnClear="true" :blnLike="true" c_searchKind="1" ccontext="place"  @place_res="placechange"></PlaceSearch>
                    </div>
                </div>
                <div class="item">
                    <span>区域范围:</span><div style="display:inline-block;">
                        <PlaceSearch  :blnClear="true" c_searchKind="0" ccontext="region"  @place_res="placechange"></PlaceSearch>
                    </div>
                </div>
                <div class="item">
                    <span>场所类型:</span><div style="display:inline-block;">
                        <el-select  placeholder="请选择" :clearable="true">
                            <el-option
                                v-for="kind in []"
                                :key="kind.code"
                                :label="kind.name"
                                :value="kind.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <span>场所状态:</span><div style="display:inline-block;">
                        <el-select v-model="placeState" placeholder="请选择" :clearable="true">
                            <el-option
                                v-for="kind in placeStates"
                                :key="kind.code"
                                :label="kind.name"
                                :value="kind.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>

                <div class="item">
                    <span>厂商名称:</span><div style="display:inline-block;width:180px;">
                        <MulDropDwon :data="Selfirms" keyProp="name" id="code" placeholder="请选择厂商">
                            <div v-for="t in firms" @mousedown="firmClick(t)">{{t.name}} <i v-if="isHasSelItem(Selfirms,t.code)" class="fa fa-check" style="float:right;margin-top: 10px;"></i></div>
                        </MulDropDwon>
                    </div>
                </div>

                
                <div class="item">
                    <el-button type="primary" @click="search()"><span>查询</span></el-button>
                </div>

            
            </div>

            <!--列表头-->
            <div class="table_header">
                <div class="row">
                    <div class="column" style="width:200px;">
                        <span class="overflow" style="width:200px;position:relative;">
                            <span style="margin-right:5px;">场所编码</span>
                            <i class="fa fa-caret-up" :class="{active:!placeCodeOrder}" @click="placeCodeOrder=false"></i><i class="fa fa-caret-down" :class="{active:placeCodeOrder}" @click="placeCodeOrder=true"></i>
                        </span>
                    </div>

                    <div class="column" style="width:200px">
                        <span class="overflow" style="position:relative;width:200px">
                            <span style="margin-right:5px;">场所名称</span>
                            <i class="fa fa-caret-up" :class="{active:!placeNameOrder}" @click="placeNameOrder=false"></i><i class="fa fa-caret-down" :class="{active:placeNameOrder}" @click="placeNameOrder=true"></i>
                        </span>
                    </div>
                    <div class="column"><span class="overflow" :style="{width:column_w+'px'}">场所地址</span></div>
                    <div class="column" style="width:80px;"><span class="overflow" style="width:80px;">场所状态</span></div>
                    <div class="column" style="width:150px;">
                        <span class="overflow" style="width:150px;">
                            设备概况
                            <el-tooltip placement="top" content="在线设备/异常设备/离线设备"><i class="fa fa-question-circle" /></el-tooltip>
                        </span>
                    </div>
                    <div class="column" style="width:150px;">
                        <span class="overflow" style="width:150px;position:relative;">
                            <span style="margin-right:5px;">最近联系时间</span>
                            <i class="fa fa-caret-up" :class="{active:!pulishTimeOrder}" @click="pulishTimeOrder=false"></i><i class="fa fa-caret-down" :class="{active:pulishTimeOrder}" @click="pulishTimeOrder=true"></i>
                        </span>
                    </div>
                    <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">昨日采集</span></div>
                    <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">营业状态</span></div>
                    <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">场所类型</span></div>

                    <div class="column" style="width:150px;">
                        <span class="overflow" style="width:150px;position:relative;">
                            <span style="margin-right:5px;">所属区域</span>
                            <i class="fa fa-caret-up" :class="{active:!areaOrder}" @click="areaOrder=false"></i><i class="fa fa-caret-down" :class="{active:areaOrder}" @click="areaOrder=true"></i>
                        </span>
                    </div>

                    <div class="column" style="width:150px;">
                        <span class="overflow" style="width:150px;position:relative;">
                            <span style="margin-right:5px;">所属厂商</span>
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
                <div v-if="data.length<=0 && blnLoading==false" style="width:100%;height:100%;text-align:center;display:table;">
                    <div style="display:table-cell;vertical-align: middle;">暂无数据</div>
                </div>

                <Scroll :listen="data" ref="scroll">
                    <div class="table_body">
                        <div class="row" v-for="d in data">
                            <div class="column" style="width:200px;"><span class="overflow clickItem" @click="placeDetail(d)" style="width:200px;">场所编码</span></div>
                            <div class="column" style="width:200px;"><span class="overflow" style="width:200px;">场所名称</span></div>
                            <div class="column"><span class="overflow" :style="{width:column_w+'px'}">场所地址</span></div>
                            <div class="column" style="width:80px;"><span class="overflow" style="width:80px;">场所状态</span></div>
                            <div class="column" style="width:150px;"><span class="overflow clickItem" style="width:150px;" @click="terminalDetail(d)">终端概况</span></div>
                            <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">最近联系时间</span></div>
                            <div class="column" style="width:100px;"><span class="overflow clickItem" style="width:100px;" @click="collectChart(d)">昨日采集</span></div>
                            <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">营业状态</span></div>
                            <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">场所类型</span></div>
                            <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">所属区域</span></div>
                            <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">所属厂商</span></div>
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
import PlaceSearch from 'components/PlaceSearch'
import Scroll from  'components/scroll'
import MulDropDwon from 'components/MulDropDown'     //厂商选择控件
import DeviceInfoList from '../DeviceInfoList'
import CollectChart from '../CollectChart'
import PlaceDetail from '../PlaceDetail'

import {BODY_RESIZE,GetFirm} from '../../../store/mutation-types'

export default {
  name: 'PlaceList',
  components:{PlaceSearch,Scroll,MulDropDwon},
  data () {
    return {
      placeState:'',
      placeStates:[],
      businessState:'',
      businessStates:[],
      firms:[],            //所有厂商数据
      Selfirms:[],
      column_w:0,
      bodyResizeSub:null,
      bodyH:0,
      data:[1,2,3],
      blnLoading:false,
      pageIndex:0,
      placeNameOrder:false,
      placeCodeOrder:false,
      pulishTimeOrder:false,
      areaOrder:false,
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
            this.bodyH=`calc(100% - 50px - 40px - ${$(this.$el).find('.option_bar').height()}px)`;

            this.$nextTick(()=>{
                this.$refs.scroll.reloadyScroll()
            })
        },100);
        this.column_w=$(this.$el).width()-1390;
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
    //设备概况详情
    terminalDetail(d){
        let s=this;
        tool.open(function(){
            let param={
                title:'挂载设备详情(场所名称)',
                area:['1000px','500px'],
                content:`<div class="terminaDetail_Num_pop" style="width:100%;height:100%;">
                            <DeviceInfoList />
                        </div>
                        `,
                components:{DeviceInfoList},
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
    //昨日采集弹窗
    collectChart(d){
        let s=this;
        tool.open(function(){
            let param={
                title:'数据采集情况(场所名称)',
                area:['800px','400px'],
                content:`<div class="collect_chart_pop" style="width:100%;height:100%;">
                            <CollectChart />
                        </div>
                        `,
                components:{CollectChart},
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
    loadData(){
        //获取厂商下拉框数据
        this.$store.dispatch(GetFirm).then(res=>{
            if(!tool.msg(res,'','获取厂商数据失败!'))return;
            this.firms=res.biz_body;
        });
    },
    //处理厂商选择控件的方法
      firmClick(d){
        this.Selfirms.push(d);
    },
    //是否包含选中项
    isHasSelItem(data,code){
        return  _.find(data,d=>d.code==code);
    },
    placechange(query,val){
        let res =_.flatten(_.map(val,v=>{return _.map(v,i=>i.code)}));
        console.log(res);
    }
  }
}
</script>

<style scoped lang="less">
@import "../../../css/variables.less";
.PlaceList{width:100%;height:100%;padding:5px;}
.PlaceList_container{width:100%;height:100%;background-color:white;}

.PlaceList .option_bar{text-align:left;padding:5px 15px;line-height:40px;}
.PlaceList .option_bar .item{display:inline-block;margin:2px 5px;}

.PlaceList .right_option_bar {float:right;}
.PlaceList .right_option_bar .item{display:inline-block;margin:2px 5px;}
.PlaceList .right_option_bar .item:hover{cursor:pointer;}
html{.TCol(~".PlaceList .right_option_bar .item:hover");}

.PlaceList .cursor{cursor:pointer;}

.PlaceList .page_container{.border('top');}

.PlaceList .fa-caret-up{position:absolute;top:8px;cursor:pointer;font-size:14px;color:gray;}
.PlaceList .fa-caret-down{position:absolute;top:17px;cursor:pointer;font-size:14px;color:gray;}
.PlaceList .fa-caret-up:hover,
.PlaceList .fa-caret-down:hover{
    color:white;
}

.PlaceList .clickItem:hover{cursor:pointer;}
html{.TCol(~".PlaceList .clickItem");}

//列表显示样式
@header_H:40px;
.PlaceList .table_header{height:@header_H;display:table;width:100%;border:none;color:white;}
html{.TCol(~".PlaceList .table_header .row",'bg');}

.PlaceList .table_header .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}
.PlaceList .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;.border('bottom');background-color:white;}
.PlaceList .table_header .column .sort_item .triangle-up:hover{cursor:pointer;}
html{.TCol(~".PlaceList .table_header .column .sort_item .triangle-up:hover",'bbc');}

.PlaceList .table_header .column .sort_item .triangle-down:hover{cursor:pointer;}
html{.TCol(~".PlaceList .table_header .column .sort_item .triangle-down:hover",'btc');}

html{.TCol(~".PlaceList .table_header .column .sort_item .triangle-up.active",'bbc');}

html{.TCol(~".PlaceList .table_header .column .sort_item .triangle-down.active",'btc');}

.PlaceList .table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";.border('bottom');}
.PlaceList .table_body{width:100%;display:table;width:100%;border:none;}
.PlaceList .table_body .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}

.PlaceList .table_body .column:first-child{.border('left');}
.overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}
</style>
