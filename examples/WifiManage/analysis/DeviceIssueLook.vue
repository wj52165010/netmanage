<!-- 问题总览页面组件 -->
<template>
    <div class="IssueLook">
        <div class="IssueLook_container">
            <div class="option_bar">

                <div class="item">
                    <span>场所范围:</span><div style="display:inline-block;">
                        <PlaceSearch   c_searchKind="1" ccontext="region"  @place_res="placechange"></PlaceSearch>
                    </div>
                </div>

                <div class="item">
                    <span>设备名称:</span><div style="display:inline-block;">
                        <el-input v-model="equipment_name" />
                    </div>
                </div>

                <div class="item">
                    <span>问题分类:</span><div style="display:inline-block;">
                    <el-select placeholder="请选择" v-model="iabnormal_type" >
                            <el-option
                                v-for="kind in dict_tables.netbar_abnormal_type"
                                :key="kind.value"
                                :label="kind.name"
                                :value="kind.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>

                <div class="item">
                    <span>所属厂商:</span>
                    <div style="display:inline-block;width:180px;">
                        <MulDropDwon :data="Selfirms" keyProp="name" id="code" placeholder="请选择厂商">
                            <div v-for="t in firms" @mousedown="firmClick('listInd',t)">{{t.name}} <i v-if="isHasSelItem(Selfirms,t.code)" class="fa fa-check" style="float:right;margin-top: 10px;"></i></div>
                        </MulDropDwon>
                    </div>
                </div>

                <div class="item">
                    <span>所属区域:</span><div style="display:inline-block;">
                        <PlaceSearch   c_searchKind="0" ccontext="region"  @place_res="regionchange"></PlaceSearch>
                    </div>
                </div>

                <div class="item">
                    <el-button type="primary" @click="search()"><span>查询</span></el-button>
                </div>

                <!--右边操作栏-->
                <div class="right_option_bar">
                    <div class="item" @click="ExportOnlineCount()"><i class="fa fa-share" /> 导出</div>
                </div>
            </div>

            <!--列表头-->
            <div class="table_header">
                <div class="row">
                    <div class="column" style="width:200px;">
                        <span class="overflow" style="width:200px;position:relative;">
                            <span style="margin-right:5px;">设备编码</span>
                            <i class="fa fa-caret-up" :class="{active:!placeCodeOrder}" @click="orderChange('placeCodeOrder',false);"></i><i class="fa fa-caret-down" :class="{active:placeCodeOrder}" @click="orderChange('placeCodeOrder',true);"></i>
                        </span>
                    </div>

                    <div class="column" style="width:200px;">
                        <span class="overflow" style="width:200px;position:relative;">
                            <span style="margin-right:5px;">设备名称</span>
                            <i class="fa fa-caret-up" :class="{active:!placeNameOrder}" @click="orderChange('placeNameOrder',false);"></i><i class="fa fa-caret-down" :class="{active:placeNameOrder}" @click="orderChange('placeNameOrder',true);"></i>
                        </span>
                    </div>

                    <div class="column" style="width:120px;">
                        <span class="overflow" style="width:120px;position:relative;">
                            <span style="margin-right:5px;">所属场所</span>
                            <i class="fa fa-caret-up" :class="{active:!placeOrder}" @click="orderChange('placeOrder',false);"></i><i class="fa fa-caret-down" :class="{active:placeOrder}" @click="orderChange('placeOrder',true);"></i>
                        </span>
                    </div>

                    <div class="column" style="width:120px;">
                        <span class="overflow" style="width:120px;position:relative;">
                            <span style="margin-right:5px;">所属厂商</span>
                            <i class="fa fa-caret-up" :class="{active:!firmOrder}" @click="orderChange('firmOrder',false);"></i><i class="fa fa-caret-down" :class="{active:firmOrder}" @click="orderChange('firmOrder',true);"></i>
                        </span>
                    </div>

                    <div class="column" style="width:120px;">
                        <span class="overflow" style="width:120px;position:relative;">
                            <span style="margin-right:5px;">所属区域</span>
                            <i class="fa fa-caret-up" :class="{active:!areaOrder}" @click="orderChange('areaOrder',false);"></i><i class="fa fa-caret-down" :class="{active:areaOrder}" @click="orderChange('areaOrder',true);"></i>
                        </span>
                    </div>

                    <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">问题分类</span></div>
                    <div class="column" style="width:80px;"><span class="overflow" style="width:80px;">当前状态</span></div>

                    <div class="column" style="width:120px;">
                        <span class="overflow" style="width:120px;position:relative;">
                            <span style="margin-right:5px;">最近联系时间</span>
                            <i class="fa fa-caret-up" :class="{active:!timeOrder}" @click="orderChange('timeOrder',false);"></i><i class="fa fa-caret-down" :class="{active:timeOrder}" @click="orderChange('timeOrder',true);"></i>
                        </span>
                    </div>

                    <div class="column" style="width:80px;"><span class="overflow" style="width:80px;">昨日采集</span></div>
                    <div class="column"><span class="overflow" :style="{width:column_w+'px'}">昨日问题摘要</span></div>
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
                            <div class="column" style="width:200px;"><span class="overflow clickItem" @click="deviceDetail(d)"  style="width:200px;">{{d.code}}</span></div>
                            <div class="column" style="width:200px;"><span class="overflow" style="width:200px;">{{d.name}}</span></div>
                            <div class="column" style="width:120px;"><span class="overflow clickItem" @click="placeDetail(d)" style="width:120px;">{{d.place}}</span></div>
                            <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">{{d.firm}}</span></div>
                            <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">{{d.region}}</span></div>
                            <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">{{d.issueKind}}</span></div>
                            <div class="column" style="width:80px;"><span class="overflow" style="width:80px;" :style="{color:converPlaceState(d.state).color}">{{converPlaceState(d.state).name}}</span></div> 
                            <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">{{d.time}}</span></div>
                            <div class="column" style="width:80px;"><span class="overflow clickItem" style="width:80px;" @click="collectChart(d)">{{d.collect}}</span></div>
                            <div class="column"><span class="overflow clickItem" :style="{width:column_w+'px'}" @click="issueDetail(d)">{{d.digest}}</span></div>
                        </div>
                    </div>
                </Scroll>
            </div>

            <!--分页栏-->
            <div name="page_container" class="page_container" style="background-color:white;">
                <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">
                    当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageIndex+1}}</span>/{{pageSize}},
                    每页{{pageNum}}条,共{{pageCount}}条
                </span>
                <div class="firstPage"  v-show="pageIndex!=0" @click="pageChange(0)">首页</div>
                <div class="prePage"    v-show="pageIndex>0" @click="pageChange(pageIndex-1)">上一页</div>
                <div class="nextPage"   v-show="pageIndex<pageSize-1" @click="pageChange(pageIndex+1)">下一页</div>
                <div class="nextPage"   v-show="pageIndex!=pageSize-1" @click="pageChange(pageSize-1)">最后页</div>           
            </div>

        </div>
    </div>
</template>

<script>
import PlaceSearch from 'components/PlaceSearch'
import MulDropDwon from 'components/MulDropDown'     //厂商选择控件
import Scroll from  'components/scroll'

import TerminalDetail from '../TerminalDetail'
import CollectChart from '../CollectChart'
import IssueList from '../IssueList'
import PlaceDetail from '../PlaceDetail'
import DeviceDetail from '../DeviceDetail'

import {BODY_RESIZE,GetFirm,DeviceScoreCollect,getDictTables} from '../../../store/mutation-types'
export default {
  name: 'IssueLook',
  props:['microprobe_type','abnormal_type'],
  components:{PlaceSearch,MulDropDwon,Scroll},
  data () {
    return {
      pageNum:15,       //当前页面显示数据条数
      pageCount:0,      //数据总条数
      pageSize:0,       //数据总页数
      firms:[],//厂商数据集合
      Selfirms:[],
      column_w:0,
      bodyResizeSub:null,
      bodyH:0,
      data:[
        //{code:'53011135000127',name:'重庆智多测试设备',place:'重庆智多测试设备',firm:'重庆爱思网安',region:'南岸区',issueKind:'采集失效',state:'online',time:'1天前',collect:'0',digest:'XXXXXX'},
        //{code:'53011135000127',name:'重庆智多测试设备',place:'重庆智多测试设备',firm:'重庆爱思网安',region:'南岸区',issueKind:'采集失效',state:'online',time:'1天前',collect:'0',digest:'XXXXXX'},
        //{code:'53011135000127',name:'重庆智多测试设备',place:'重庆智多测试设备',firm:'重庆爱思网安',region:'南岸区',issueKind:'采集失效',state:'online',time:'1天前',collect:'0',digest:'XXXXXX'},
      ],
      blnLoading:false,
      pageIndex:0,
      placeCodeOrder:true,
      placeOrder:true,
      placeNameOrder:true,
      firmOrder:true,
      areaOrder:true,
      timeOrder:true,
      netsite_range:[],//场所范围
      region_range:[],//区域范围
      equipment_name:'',//设备名称
      dict_tables:{},
      orderObj:{sort:'equipment_id',order:'desc'},
      iabnormal_type:'',
      iabnormal_name:''
    }
  },
  watch:{
    abnormal_type(){
        this.iabnormal_type=this.abnormal_type;
        this.loadData();
    },
    iabnormal_type(){
        this.iabnormal_name=_.find(this.dict_tables.netbar_abnormal_type,c=>c.value==this.iabnormal_type);
    },
  },
  mounted(){

    //获取厂商下拉框数据
    this.$store.dispatch(GetFirm).then(res=>{
        if(!tool.msg(res,'','获取厂商数据失败!'))return;
        this.firms=res.biz_body;
        this.$nextTick(()=>{
            this.iabnormal_type=this.abnormal_type;
        })
    });

    //获取数据来源（下拉框序列化）
    this.$store.dispatch(getDictTables).then(res=>{
        if(res.msg.code!='successed')return;
        this.dict_tables= res.biz_body;

        this.$nextTick(()=>{
            this.iabnormal_type=this.abnormal_type;
            this.loadData();
        })
    });

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
        },500);
        this.column_w=$(this.$el).width()-1140 -10;
    },
     //加载列表数据
    loadData(){
        if(!this.iabnormal_type) return;
        this.blnLoading=true;
        this.$store.dispatch(DeviceScoreCollect,{
           limit:this.pageNum,
           skip:this.pageNum*this.pageIndex,
           equip_abnormal_type:this.iabnormal_type,
           netsite_range:this.netsite_range,
           region_range:this.region_range,
           security_software_orgcodes:_.map(this.Selfirms,s=>s.code).join(','),
           equipment_name:this.equipment_name,
           microprobe_type:this.microprobe_type,
           sort:this.orderObj.sort,
           order:this.orderObj.order
        }).then(res=>{
            this.blnLoading=false;
            if(!tool.msg(res,'','获取总览列表数据失败!'))return;
            this.data = this.converData(res.biz_body);
            //测试数据
            //this.data=[{code:'53011135000127',name:'重庆智多测试设备',place:'重庆智多测试设备',firm:'重庆爱思网安',region:'南岸区',issueKind:'采集失效',state:'online',time:'1天前',collect:'0',digest:'XXXXXX'}];
            
            if(this.data.length<=0){
                this.pageCount=0;
                this.pageSize=0;
            }else{
                this.pageCount=res.page.total;  
                this.pageSize=res.page.page_size;
            }
            
        });
    },
    //排序改变事件
    orderChange(type,val){
     let orderCache=this[type];

     if(orderCache==val) return;
    
     
     this.placeCodeOrder=true;
     this.placeOrder=true;
     this.placeNameOrder=true;
     this.firmOrder=true;
     this.areaOrder=true;
     this.timeOrder=true;
     this[type]=val;

     let fieldMap={
        placeCodeOrder:'equipment_id',
        placeOrder:'netbar_name',
        placeNameOrder:'equipment_name',
        timeOrder:'capture_time',
        areaOrder:'region_name',
        firmOrder:'security_software_orgname'
     };

     this.orderObj.sort=fieldMap[type];
     this.orderObj.order=val?'desc':'asc';
     this.loadData();

    },
    //转化数据
    converData(d){
        let s=this;
        return _.map(d,c=>{
            return {
                code:c.equipment_id,
                name:c.equipment_name,
                place:c.netbar_name,
                firm:c.security_software_orgname,
                region:c.region_name,
                issueKind:s.iabnormal_name.name,
                state:c.online_state,
                time:c.capture_time_desc,
                collect:c.last_upload_num,
                digest:c.errors,
                siteId:c.netbar_wacode
            }
        });
    },
    pageChange(i){
        this.pageIndex=i;
        this.loadData();
    },
    //搜索
    search(){
        this.pageChange(0);
    },
    //设备详情
    deviceDetail(d){
        let s=this;
        tool.open(function(){
            let param={
                title:'设备详情',
                area:'1000px',
                content:`<div class="place_detail_pop" style="width:100%;height:100%;">
                            <DeviceDetail :code="code" />
                        </div>
                        `,
                components:{DeviceDetail},
                store:s.$store,
                context:{
                    code:d.code,
                    blnExecute:false,
                    ok_btn(){param.close()},
                    cancel_btn(){param.close()}
                }
            };

            return param;
        }());
    },
    //场所详情
    placeDetail(d){
        let s=this;
        tool.open(function(){
            let param={
                title:'场所详情',
                area:'1000px',
                content:`<div class="place_detail_pop" style="width:100%;height:100%;">
                            <PlaceDetail :code="netbar_wacode" />
                        </div>
                        `,
                components:{PlaceDetail},
                store:s.$store,
                context:{
                    netbar_wacode:d.siteId,
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
                title:`数据采集情况(${d.name})`,
                area:['800px','400px'],
                content:`<div class="collect_chart_pop" style="width:100%;height:100%;">
                            <CollectChart :code="code" :microprobe_type="microprobe_type" :type="1" />
                        </div>
                        `,
                components:{CollectChart},
                store:s.$store,
                context:{
                    code:d.code,
                    microprobe_type:s.microprobe_type,
                    blnExecute:false,
                    ok_btn(){param.close()},
                    cancel_btn(){param.close()}
                }
            };

            return param;
        }());
    },
    //问题总览详情
    issueDetail(){
        let s=this;
        tool.open(function(){
            let param={
                title:'问题总览详情(场所名称)',
                area:['800px','400px'],
                content:`<div class="issue_detail_pop" style="width:100%;height:100%;">
                            <IssueList />
                        </div>
                        `,
                components:{IssueList},
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
    //导出
    ExportOnlineCount(){

    },
    firmClick(type,d){
        let index=-1;
        index=_.findIndex(this.Selfirms,t=>t.code==d.code);
        if(index>=0){this.Selfirms.splice(index,1); return;}
        this.Selfirms.push(d);  
    },
    //是否包含选中项
    isHasSelItem(data,code){
        return  _.find(data,d=>d.code==code);
    },
    placechange(query,val){
        this.netsite_range = _.flatten(_.map(val,v=>{return _.map(v,i=>{ return {code:i.code};})}));
    },
    regionchange(query,val){
        this.region_range = _.flatten(_.map(val,v=>{return _.map(v,i=>{ return {code:i.code};})}));
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

.IssueLook{width:100%;height:100%;padding:5px;position:relative;}
.IssueLook_container{width:100%;height:100%;background-color:white;}

.IssueLook .option_bar{text-align:left;padding:5px 15px;line-height:40px;}
.IssueLook .option_bar .item{display:inline-block;margin:2px 5px;}

.IssueLook .right_option_bar {float:right;}
.IssueLook .right_option_bar .item{display:inline-block;margin:2px 5px;}
.IssueLook .right_option_bar .item:hover{cursor:pointer;}
html{.TCol(~".IssueLook .right_option_bar .item:hover");}

.IssueLook .cursor{cursor:pointer;}

.IssueLook .page_container{.border('top');}

.IssueLook .table_body .item{cursor:pointer;}
html{.TCol(~".IssueLook .table_body .item:hover");}

.IssueLook .fa-caret-up{position:absolute;top:8px;cursor:pointer;font-size:14px;color:gray;}
.IssueLook .fa-caret-down{position:absolute;top:17px;cursor:pointer;font-size:14px;color:gray;}

.IssueLook .fa-caret-up.active,
.IssueLook .fa-caret-down.active,
.IssueLook .fa-caret-up:hover,
.IssueLook .fa-caret-down:hover{
    color:white;
}

.IssueLook .clickItem:hover{cursor:pointer;text-decoration:underline;}
html{.TCol(~".IssueLook .clickItem");}

//列表显示样式
@header_H:40px;
.IssueLook .table_header{height:@header_H;display:table;width:100%;border:none;color:white;}
html{.TCol(~".IssueLook .table_header .row",'bg');}

.IssueLook .table_header .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}
.IssueLook .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;.border('bottom');background-color:white;}
.IssueLook .table_header .column .sort_item .triangle-up:hover{cursor:pointer;}
html{.TCol(~".IssueLook .table_header .column .sort_item .triangle-up:hover",'bbc');}

.IssueLook .table_header .column .sort_item .triangle-down:hover{cursor:pointer;}
html{.TCol(~".IssueLook .table_header .column .sort_item .triangle-down:hover",'btc');}

html{.TCol(~".IssueLook .table_header .column .sort_item .triangle-up.active",'bbc');}

html{.TCol(~".IssueLook .table_header .column .sort_item .triangle-down.active",'btc');}

.IssueLook .table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";.border('bottom');}
.IssueLook .table_body{width:100%;display:table;width:100%;border:none;}
.IssueLook .table_body .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}

.IssueLook .table_body .column:first-child{.border('left');}
.overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}
</style>
