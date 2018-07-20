<!-- 场所列表页页面组件 -->
<template>
    <div class="DeviceList">
        <div class="DeviceList_container">

            <!--操作栏-->
            <div class="option_bar">
                <div class="item">
                    <span>设备名称:</span>
                    <div style="display:inline-block;">
                        <el-input placeholder="请输入设备编码" />
                    </div>
                </div>
                <div class="item">
                    <span>设备编码:</span>
                    <div style="display:inline-block;">
                        <el-input placeholder="请输入设备编码" />
                    </div>
                </div>
                <div class="item">
                    <span>区域范围:</span><div style="display:inline-block;">
                        <PlaceSearch  :blnClear="true" c_searchKind="0" ccontext="region"  @place_res="placechange"></PlaceSearch>
                    </div>
                </div>
                <div class="item">
                    <span>设备类型:</span><div style="display:inline-block;">
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
                    <span>设备状态:</span><div style="display:inline-block;">
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
                            <span style="margin-right:5px;">设备编码</span>
                            <i class="fa fa-caret-up" :class="{active:!CodeOrder}" @click="CodeOrder=false"></i><i class="fa fa-caret-down" :class="{active:CodeOrder}" @click="CodeOrder=true"></i>
                        </span>
                    </div>

                    <div class="column" >
                        <span class="overflow" style="position:relative;" :style="{width:column_w+'px'}">
                            <span style="margin-right:5px;">设备名称</span>
                            <i class="fa fa-caret-up" :class="{active:!NameOrder}" @click="NameOrder=false"></i><i class="fa fa-caret-down" :class="{active:NameOrder}" @click="NameOrder=true"></i>
                        </span>
                    </div>
                    <div class="column" style="width:200px;"><span class="overflow" style="width:200px;">设备MAC</span></div>
                    <div class="column" style="width:80px;"><span class="overflow" style="width:80px;">设备状态</span></div>
   
                    <div class="column" style="width:150px;">
                        <span class="overflow" style="width:150px;position:relative;">
                            <span style="margin-right:5px;">最近联系时间</span>
                            <i class="fa fa-caret-up" :class="{active:!TimeOrder}" @click="TimeOrder=false"></i><i class="fa fa-caret-down" :class="{active:TimeOrder}" @click="TimeOrder=true"></i>
                        </span>
                    </div>
                    <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">昨日上传量</span></div>
                    <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">设备类型</span></div>
                   
                   <div class="column" style="width:150px;">
                        <span class="overflow" style="width:150px;position:relative;">
                            <span style="margin-right:5px;">所属场所</span>
                            <i class="fa fa-caret-up" :class="{active:!areaOrder}" @click="PlaceOrder=false"></i><i class="fa fa-caret-down" :class="{active:PlaceOrder}" @click="PlaceOrder=true"></i>
                        </span>
                    </div>

                    <div class="column" style="width:150px;">
                        <span class="overflow" style="width:150px;position:relative;">
                            <span style="margin-right:5px;">所属区域</span>
                            <i class="fa fa-caret-up" :class="{active:!areaOrder}" @click="areaOrder=false"></i><i class="fa fa-caret-down" :class="{active:areaOrder}" @click="areaOrder=true"></i>
                        </span>
                    </div>

                    <div class="column" style="width:150px;">
                        <span class="overflow" style="width:150px;position:relative;">
                            <span style="margin-right:5px;">所属厂商</span>
                            <i class="fa fa-caret-up" :class="{active:!FirmOrder}" @click="FirmOrder=false"></i><i class="fa fa-caret-down" :class="{active:FirmOrder}" @click="FirmOrder=true"></i>
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
                            <div class="column" style="width:200px;"><span class="overflow clickItem" @click="devieceDetail(d)" style="width:200px;">{{d.code}}</span></div>
                            <div class="column"><span class="overflow" :style="{width:column_w+'px'}">{{d.name}}</span></div>
                            <div class="column" style="width:200px;"><span class="overflow" style="width:200px;">{{d.mac}}</span></div>
                            <div class="column" style="width:80px;"><span class="overflow" style="width:80px;" :style="{color:converPlaceState(d.state).color}">{{converPlaceState(d.state).name}}</span></div>
                            <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">{{d.time}}</span></div>
                            <div class="column" style="width:100px;"><span class="overflow clickItem" @click="collectChart(d)" style="width:100px;">{{d.collect}}</span></div>
                            <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">{{d.kind}}</span></div>
                            <div class="column" style="width:150px;"><span class="overflow clickItem" @click="devicePlaceDetail(d)" style="width:150px;">{{d.address}}</span></div>                          
                            <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">{{d.region}}</span></div>
                            <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">{{d.firm}}</span></div>
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
import DeviceDetail from '../DeviceDetail'
import DevicePlaceDetail from '../DevicePlaceDetail'

import {BODY_RESIZE,GetFirm} from '../../../store/mutation-types'

export default {
  name: 'DeviceList',
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
      data:[
        {code:'53011135000127',name:'53011135000127',mac:'XX-XX-XX-XX-XX-XX',state:'online',time:'联系中',collect:6000,kind:'固定采集设备',address:'重庆爱思测试场所',region:'南岸区',firm:'爱思网安'},
        {code:'53011135000127',name:'53011135000127',mac:'XX-XX-XX-XX-XX-XX',state:'online',time:'联系中',collect:6000,kind:'固定采集设备',address:'重庆爱思测试场所',region:'南岸区',firm:'爱思网安'},
        {code:'53011135000127',name:'53011135000127',mac:'XX-XX-XX-XX-XX-XX',state:'online',time:'联系中',collect:6000,kind:'固定采集设备',address:'重庆爱思测试场所',region:'南岸区',firm:'爱思网安'},
      ],
      blnLoading:false,
      pageIndex:0,
      CodeOrder:false,
      NameOrder:false,
      TimeOrder:false,
      PlaceOrder:false,
      areaOrder:false,
      FirmOrder:false,
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
        this.column_w=$(this.$el).width()-1280;
    },
    //场所详情
    devieceDetail(d){
        let s=this;
        tool.open(function(){
            let param={
                title:'设备详情(设备名称)',
                area:'1000px',
                content:`<div class="place_detail_pop" style="width:100%;height:100%;">
                            <DeviceDetail />
                        </div>
                        `,
                components:{DeviceDetail},
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
    //设备场所详情
    devicePlaceDetail(d){
        let s=this;
        tool.open(function(){
            let param={
                title:'场所详情',
                area:['1000px','500px'],
                content:`<div class="terminaDetail_Num_pop" style="width:100%;height:100%;">
                            <DevicePlaceDetail />
                        </div>
                        `,
                components:{DevicePlaceDetail},
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
    },
    //转化场所状态
    converPlaceState(v){
        let res={};
        switch(v){
            case 'online':
                res={name:'在线',color:'#bee35f'};
            break;
            case 'offline':
                res={name:'离线',color:'#999999'};
            break;
            case 'abnormal':
                res={name:'异常',color:'#ffb937'};
            break;
        }

        return res;
    },
  }
}
</script>

<style scoped lang="less">
@import "../../../css/variables.less";
.DeviceList{width:100%;height:100%;padding:5px;}
.DeviceList_container{width:100%;height:100%;background-color:white;}

.DeviceList .option_bar{text-align:left;padding:5px 15px;line-height:40px;}
.DeviceList .option_bar .item{display:inline-block;margin:2px 5px;}

.DeviceList .right_option_bar {float:right;}
.DeviceList .right_option_bar .item{display:inline-block;margin:2px 5px;}
.DeviceList .right_option_bar .item:hover{cursor:pointer;}
html{.TCol(~".DeviceList .right_option_bar .item:hover");}

.DeviceList .cursor{cursor:pointer;}

.DeviceList .page_container{.border('top');}

.DeviceList .fa-caret-up{position:absolute;top:8px;cursor:pointer;font-size:14px;color:gray;}
.DeviceList .fa-caret-down{position:absolute;top:17px;cursor:pointer;font-size:14px;color:gray;}

.DeviceList .fa-caret-up.active,
.DeviceList .fa-caret-down.active,
.DeviceList .fa-caret-up:hover,
.DeviceList .fa-caret-down:hover{
    color:white;
}

.DeviceList .clickItem:hover{cursor:pointer;text-decoration:underline;}
html{.TCol(~".DeviceList .clickItem");}

//列表显示样式
@header_H:40px;
.DeviceList .table_header{height:@header_H;display:table;width:100%;border:none;color:white;}
html{.TCol(~".DeviceList .table_header .row",'bg');}

.DeviceList .table_header .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}
.DeviceList .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;.border('bottom');background-color:white;}
.DeviceList .table_header .column .sort_item .triangle-up:hover{cursor:pointer;}
html{.TCol(~".DeviceList .table_header .column .sort_item .triangle-up:hover",'bbc');}

.DeviceList .table_header .column .sort_item .triangle-down:hover{cursor:pointer;}
html{.TCol(~".DeviceList .table_header .column .sort_item .triangle-down:hover",'btc');}

html{.TCol(~".DeviceList .table_header .column .sort_item .triangle-up.active",'bbc');}

html{.TCol(~".DeviceList .table_header .column .sort_item .triangle-down.active",'btc');}

.DeviceList .table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";.border('bottom');}
.DeviceList .table_body{width:100%;display:table;width:100%;border:none;}
.DeviceList .table_body .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}

.DeviceList .table_body .column:first-child{.border('left');}
.overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}
</style>
