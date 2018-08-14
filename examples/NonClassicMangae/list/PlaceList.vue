<!-- 场所列表页页面组件 -->
<template>
    <div class="PlaceList">
        <div class="PlaceList_container">

            <!--操作栏-->
            <div class="option_bar">
                <div class="item">
                    <span>场所范围:</span>
                    <div style="display:inline-block;">
                        <PlaceSearch  c_searchKind="1" ccontext="place" :microprobeType="microprobe_type"  @place_res="placechange"></PlaceSearch>
                    </div>
                </div>
                <div class="item">
                    <span>区域范围:</span><div style="display:inline-block;">
                        <PlaceSearch   c_searchKind="0" ccontext="region" :microprobeType="microprobe_type" @place_res="regionchange"></PlaceSearch>
                    </div>
                </div>
                <div class="item">
                    <span>场所类型:</span><div style="display:inline-block;">
                        <el-select v-model="netsite_type" placeholder="请选择" :clearable="true">
                            <el-option
                                v-for="kind in dict_tables.netsite_type || []"
                                :key="kind.value"
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
                                v-for="kind in dict_tables.device_state || []"
                                :key="kind.value"
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
                            <i class="fa fa-caret-up" :class="{active:!codeOrder}" @click="orderChange('codeOrder',false);"></i><i class="fa fa-caret-down" :class="{active:codeOrder}" @click="orderChange('codeOrder',true);"></i>
                        </span>
                    </div>

                    <div class="column" style="width:200px">
                        <span class="overflow" style="position:relative;width:200px">
                            <span style="margin-right:5px;">场所名称</span>
                            <i class="fa fa-caret-up" :class="{active:!nameOrder}" @click="orderChange('nameOrder',false);"></i><i class="fa fa-caret-down" :class="{active:nameOrder}" @click="orderChange('nameOrder',true);"></i>
                        </span>
                    </div>
                    <div class="column"><span class="overflow" :style="{width:column_w+'px'}">场所地址</span></div>
                    <div class="column" style="width:80px;"><span class="overflow" style="width:80px;">场所状态</span></div>
                    <div class="column" style="width:150px;">
                        <span class="overflow" style="width:150px;">
                            终端概况
                            <el-tooltip placement="top" content="申报终端/检测终端/在线终端"><i class="fa fa-question-circle" /></el-tooltip>
                        </span>
                    </div>
                    <div class="column" style="width:150px;">
                        <span class="overflow" style="width:150px;position:relative;">
                            <span style="margin-right:5px;">最近联系时间</span>
                            <i class="fa fa-caret-up" :class="{active:!timeOrder}" @click="orderChange('timeOrder',false);"></i><i class="fa fa-caret-down" :class="{active:timeOrder}" @click="orderChange('timeOrder',true);"></i>
                        </span>
                    </div>
                    <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">昨日采集</span></div>
                    <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">营业状态</span></div>
                    <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">负责人</span></div>
                    <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">负责人电话</span></div>
                    <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">出口IP</span></div>
                    
                    <div class="column" style="width:150px;">
                        <span class="overflow" style="width:150px;position:relative;">
                            <span style="margin-right:5px;">所属区域</span>
                            <i class="fa fa-caret-up" :class="{active:!areaOrder}" @click="orderChange('areaOrder',false);"></i><i class="fa fa-caret-down" :class="{active:areaOrder}" @click="orderChange('areaOrder',true);"></i>
                        </span>
                    </div>

                    <div class="column" style="width:150px;">
                        <span class="overflow" style="width:150px;position:relative;">
                            <span style="margin-right:5px;">所属厂商</span>
                            <i class="fa fa-caret-up" :class="{active:!firmOrder}" @click="orderChange('firmOrder',false);"></i><i class="fa fa-caret-down" :class="{active:firmOrder}" @click="orderChange('firmOrder',true);"></i>
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
                            <div class="column" style="width:200px;"><span class="overflow clickItem" @click="placeDetail(d)" style="width:200px;">{{d.code}}</span></div>
                            <div class="column" style="width:200px;"><span class="overflow" style="width:200px;">{{d.name}}</span></div>
                            <div class="column"><span class="overflow" :style="{width:column_w+'px'}">{{d.address}}</span></div>
                            <div class="column" style="width:80px;"><span class="overflow" style="width:80px;" :style="{color:converPlaceState(d.state).color}">{{converPlaceState(d.state).name}}</span></div>
                            <div class="column" style="width:150px;">
                                <span class="overflow " style="width:150px;" >
                                    {{`${d.declareTerminal}/${d.detectionTerminal}/${d.onlineTerminal}`}}
                                </span>
                            </div>
                            <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">{{d.time}}</span></div>
                            <div class="column" style="width:100px;"><span class="overflow clickItem" style="width:100px;" @click="collectChart(d)">{{d.collect}}</span></div>
                            <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">{{d.businessState}}</span></div>
                            <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">{{d.user}}</span></div>
                            <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">{{d.phone}}</span></div>
                            <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">{{d.ip}}</span></div>
                            <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">{{d.area}}</span></div>
                            <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">{{d.firm}}</span></div>
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
import Scroll from  'components/scroll'
import MulDropDwon from 'components/MulDropDown'     //厂商选择控件
import DeviceInfoList from '../DeviceInfoList'
import CollectChart from '../CollectChart'
import PlaceDetail from '../PlaceDetail'
import DataSource from '../../../enum/DataSource'

import {BODY_RESIZE,GetFirm,getDictTables,GetSiteList} from '../../../store/mutation-types'

export default {
  name: 'PlaceList',
  components:{PlaceSearch,Scroll,MulDropDwon},
  data () {
    return {
      pageNum:15,       //当前页面显示数据条数
      pageCount:0,      //数据总条数
      pageSize:0,       //数据总页数
      region_range:[],  //区域范围
      netsite_range:[], //场所范围
      dict_tables:{},
      placeState:'',
      netsite_type:'',
      firms:[],            //所有厂商数据
      Selfirms:[],
      column_w:0,
      bodyResizeSub:null,
      bodyH:0,
      data:[
        //{code:'53011135000127',name:'重庆智多测试场所',address:'重庆市南岸区',state:'online',declareTerminal:'100',detectionTerminal:'90',onlineTerminal:'12',time:'联系中',collect:6000,businessState:'营业状态',user:'战三',phone:'138xxxx',ip:'xx-xx-xx-xx',area:'南岸区',firm:'爱思网安'},
        //{code:'53011135000127',name:'重庆智多测试场所',address:'重庆市南岸区',state:'online',declareTerminal:'100',detectionTerminal:'90',onlineTerminal:'12',time:'联系中',collect:6000,businessState:'营业状态',user:'战三',phone:'138xxxx',ip:'xx-xx-xx-xx',area:'南岸区',firm:'爱思网安'},
        //{code:'53011135000127',name:'重庆智多测试场所',address:'重庆市南岸区',state:'online',declareTerminal:'100',detectionTerminal:'90',onlineTerminal:'12',time:'联系中',collect:6000,businessState:'营业状态',user:'战三',phone:'138xxxx',ip:'xx-xx-xx-xx',area:'南岸区',firm:'爱思网安'},
      ],
      blnLoading:false,
      pageIndex:0,
      codeOrder:true,
      nameOrder:true,
      areaOrder:true,
      firmOrder:true,
      timeOrder:true,
      orderObj:{sort:'netbar_wacode',order:'desc'},//排序字段
      microprobe_type:DataSource['非经营']
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
            this.bodyH=`calc(100% - 50px - 40px - ${$(this.$el).find('.option_bar').height()}px)`;

            this.$nextTick(()=>{
                this.$refs.scroll.reloadyScroll()
            })
        },100);
        this.column_w=$(this.$el).width()-1690;
    },
    //场所详情
    placeDetail(d){
        let s=this;
        tool.open(function(){
            let param={
                title:'场所详情',
                area:'1000px',
                offset:'20px',
                content:`<div class="place_detail_pop" style="width:100%;height:100%;">
                            <PlaceDetail :code="netbar_wacode" />
                        </div>
                        `,
                components:{PlaceDetail},
                store:s.$store,
                context:{
                    netbar_wacode:d.code,
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
                            <CollectChart :code="code" :microprobe_type="microprobe_type" />
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
    loadData(){
        //获取厂商下拉框数据
        this.$store.dispatch(GetFirm).then(res=>{
            if(!tool.msg(res,'','获取厂商数据失败!'))return;
            this.firms=res.biz_body;
        });

        this.getPlaceData();
    },
    //获取网吧数据
    getPlaceData(){
        this.blnLoading=true;
        this.$store.dispatch(GetSiteList,{
            limit:this.pageNum,
            skip:this.pageIndex*this.pageNum,
            microprobe_type:this.microprobe_type,
            region_range:this.region_range,
            netsite_range:this.netsite_range,
            netsite_state:this.placeState,
            netsite_type:this.netsite_type,
            security_software_orgcodes:_.map(this.Selfirms,s=>s.code).join(','),
            sort:this.orderObj.sort,
            order:this.orderObj.order
        }).then(res=>{
            this.blnLoading=false;
            if(!tool.msg(res,'','获取网吧数据失败!'))return;
            this.data=this.converData(res.biz_body);
            this.pageCount=res.page.total;
            this.pageSize=res.page.page_size;
        });
    },
    //转化服务器数据对象为客户端对象
    converData(d){
        return _.map(d,c=>{
            return {
                    code:c.netbar_wacode || '',         //场所编码
                    name:c.netbar_name || '',           //场所名称
                    address:c.netbar_address || '',     //场所地址
                    state:c.online_state,               //场所状态
                    declareTerminal:c.net_terminal_num,              //申报终端数
                    detectionTerminal:c.actual_terminal,             //检测终端数
                    onlineTerminal:c.internet_users,                //在线终端数
                    time:c.capture_time_desc,           //最近联系时间
                    collect:c.last_upload_num,          //昨日采集
                    businessState:c.business_state,     //营业状态
                    user:c.principal_name,              //负责人
                    phone:c.principal_tel,              //负责人电话
                    ip:'',                   //出口IP
                    area:c.region_name,                 //所属区域
                    firm:c.security_software_orgname,   //所属厂商
                }
        });
    },
    //分页处理
    pageChange(i){
        this.pageIndex=i;
        this.getPlaceData();
    },
    //搜索
    search(){
        this.pageChange(0);
    },
    //处理厂商选择控件的方法
    firmClick(d){
        let index=_.findIndex(this.Selfirms,t=>t.code==d.code);
        if(index>=0){this.Selfirms.splice(index,1); return;}
        this.Selfirms.push(d);
    },
    //排序改变事件
    orderChange(type,val){
     let orderCache=this[type];

     if(orderCache==val) return;

     this.nameOrder=true;
     this.codeOrder=true;
     this.timeOrder=true;
     this.areaOrder=true;
     this.firmOrder=true;
     this[type]=val;

     let fieldMap={
        codeOrder:'netbar_wacode',
        nameOrder:'netbar_name',
        timeOrder:'capture_time',
        areaOrder:'region_name',
        firmOrder:'security_software_orgname'
     };

     this.orderObj.sort=fieldMap[type];
     this.orderObj.order=val?'desc':'asc';
     this.getPlaceData();

    },
    //是否包含选中项
    isHasSelItem(data,code){
        return  _.find(data,d=>d.code==code);
    },
    //场所范围
    placechange(query,val){
        this.netsite_range = _.flatten(_.map(val,v=>{return _.map(v,i=>{ return {code:i.code};})}));
    },
    //区域范围
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

.PlaceList .fa-caret-up.active,
.PlaceList .fa-caret-down.active,
.PlaceList .fa-caret-up:hover,
.PlaceList .fa-caret-down:hover{
    color:white;
}

.PlaceList .clickItem:hover{cursor:pointer;text-decoration:underline;}
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
