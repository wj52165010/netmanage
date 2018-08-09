<!-- 场所列表页页面组件 -->
<template>
    <div class="DeviceList">
        <div class="DeviceList_container">

            <!--操作栏-->
            <div class="option_bar">
                <div class="item">
                    <span>设备名称:</span>
                    <div style="display:inline-block;" >
                        <el-input placeholder="请输入设备编码" v-model="equipment_name" />
                    </div>
                </div>
                <div class="item">
                    <span>设备编码:</span>
                    <div style="display:inline-block;">
                        <el-input placeholder="请输入设备编码" v-model="equipment_id" />
                    </div>
                </div>
                <div class="item">
                    <span>区域范围:</span><div style="display:inline-block;">
                        <PlaceSearch c_searchKind="0" ccontext="region"  @place_res="regionchange"></PlaceSearch>
                    </div>
                </div>
                <div class="item">
                    <span>设备类型:</span><div style="display:inline-block;">
                       <el-select v-model="equipment_type"  placeholder="请选择" :clearable="true">
                            <el-option
                                v-for="kind in dict_tables.equipment_type"                           
                                :label="kind.name"
                                :value="kind.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <span>设备状态:</span><div style="display:inline-block;">
                        <el-select v-model="device_state" placeholder="请选择" :clearable="true">
                            <el-option
                                v-for="kind in dict_tables.device_state"                           
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
                            <i class="fa fa-caret-up" :class="{active:!CodeOrder}" @click="orderChange('CodeOrder',false);"></i><i class="fa fa-caret-down" :class="{active:CodeOrder}" @click="orderChange('CodeOrder',true);"></i>
                        </span>
                    </div>

                    <div class="column" >
                        <span class="overflow" style="position:relative;" :style="{width:column_w+'px'}">
                            <span style="margin-right:5px;">设备名称</span>
                            <i class="fa fa-caret-up" :class="{active:!NameOrder}" @click="orderChange('NameOrder',false);"></i><i class="fa fa-caret-down" :class="{active:NameOrder}" @click="orderChange('NameOrder',true);"></i>
                        </span>
                    </div>
                    <div class="column" style="width:200px;"><span class="overflow" style="width:200px;">设备MAC</span></div>
                    <div class="column" style="width:80px;"><span class="overflow" style="width:80px;">设备状态</span></div>
   
                    <div class="column" style="width:150px;">
                        <span class="overflow" style="width:150px;position:relative;">
                            <span style="margin-right:5px;">最近联系时间</span>
                            <i class="fa fa-caret-up" :class="{active:!TimeOrder}" @click="orderChange('TimeOrder',false);"></i><i class="fa fa-caret-down" :class="{active:TimeOrder}" @click="orderChange('TimeOrder',true);"></i>
                        </span>
                    </div>
                    <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">昨日上传量</span></div>
                    <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">设备类型</span></div>
                   
                   <div class="column" style="width:150px;">
                        <span class="overflow" style="width:150px;position:relative;">
                            <span style="margin-right:5px;">所属场所</span>
                            <i class="fa fa-caret-up" :class="{active:!PlaceOrder}" @click="orderChange('PlaceOrder',false);"></i><i class="fa fa-caret-down" :class="{active:PlaceOrder}" @click="orderChange('PlaceOrder',true);"></i>
                        </span>
                    </div>

                    <div class="column" style="width:150px;">
                        <span class="overflow" style="width:150px;position:relative;">
                            <span style="margin-right:5px;">所属区域</span>
                            <i class="fa fa-caret-up" :class="{active:!areaOrder}" @click="orderChange('areaOrder',false);"></i><i class="fa fa-caret-down" :class="{active:areaOrder}" @click="orderChange('areaOrder',true);"></i>
                        </span>
                    </div>

                    <div class="column" style="width:150px;">
                        <span class="overflow" style="width:150px;position:relative;">
                            <span style="margin-right:5px;">所属厂商</span>
                            <i class="fa fa-caret-up" :class="{active:!FirmOrder}" @click="orderChange('FirmOrder',false);"></i><i class="fa fa-caret-down" :class="{active:FirmOrder}" @click="orderChange('FirmOrder',true);"></i>
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
                            <div class="column" style="width:100px;"><span class="overflow clickItem" @click="collectChart(d)" style="width:100px;">{{d.uploadNum}}</span></div>
                            <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">{{d.kind}}</span></div>
                            <div class="column" style="width:150px;"><span class="overflow clickItem" @click="devicePlaceDetail(d)" style="width:150px;">{{d.place}}</span></div>                          
                            <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">{{d.region}}</span></div>
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
import DeviceDetail from '../DeviceDetail'
import DevicePlaceDetail from '../DevicePlaceDetail'

import DataSource from '../../../enum/DataSource'

import {BODY_RESIZE,GetFirm,getDictTables,GetDeviceList} from '../../../store/mutation-types'

export default {
  name: 'DeviceList',
  components:{PlaceSearch,Scroll,MulDropDwon},
  data () {
    return {
      pageNum:15,       //当前页面显示数据条数
      pageCount:0,      //数据总条数
      pageSize:0,       //数据总页数
      equipment_name:'',//设备名称
      equipment_id:'',  //设备编码
      region_range:'',  //区域范围
      equipment_type:'',//设备类型
      device_state:'',  //设备状态   
      firms:[],            //所有厂商数据
      Selfirms:[],
      column_w:0,
      bodyResizeSub:null,
      bodyH:0,
      data:[
        //{code:'53011135000127',name:'重庆智多测试设备',mac:'XX-XX-XX-XX-XX-XX',state:'online',time:'3天前',uploadNum:6000,kind:'固定采集设备',place:'重庆爱思测试场所',region:'南岸区',firm:'爱思网安'},
        //{code:'53011135000127',name:'重庆智多测试设备',mac:'XX-XX-XX-XX-XX-XX',state:'online',time:'3天前',uploadNum:6000,kind:'固定采集设备',place:'重庆爱思测试场所',region:'南岸区',firm:'爱思网安'},
        //{code:'53011135000127',name:'重庆智多测试设备',mac:'XX-XX-XX-XX-XX-XX',state:'online',time:'3天前',uploadNum:6000,kind:'固定采集设备',place:'重庆爱思测试场所',region:'南岸区',firm:'爱思网安'},
      ],
      blnLoading:false,
      pageIndex:0,
      CodeOrder:true,
      NameOrder:true,
      TimeOrder:true,
      PlaceOrder:true,
      areaOrder:true,
      FirmOrder:true,
      dict_tables:{},
      orderObj:{sort:'netbar_wacode',order:'desc'},
      microprobe_type:DataSource['特征']
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
        this.column_w=$(this.$el).width()-1280;
    },
    //场所详情
    devieceDetail(d){
        let s=this;
        tool.open(function(){
            let param={
                title:`设备详情(${d.name})`,
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
    //设备场所详情
    devicePlaceDetail(d){
        let s=this;
        tool.open(function(){
            let param={
                title:'场所详情',
                area:'1000px',
                content:`<div class="terminaDetail_Num_pop" style="width:100%;height:100%;">
                            <DevicePlaceDetail :code="code" />
                        </div>
                        `,
                components:{DevicePlaceDetail},
                store:s.$store,
                context:{
                    code:d.siteId,
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

        //获取设备数据
        this.getDeviceData();
    },
    //获取设备列表信息
    getDeviceData(){
        this.blnLoading=true;
        this.$store.dispatch(GetDeviceList,{
            limit:this.pageNum,
            skip:this.pageIndex*this.pageNum,
            microprobe_type:this.microprobe_type,
            equipment_name:this.equipment_name,
            equipment_id:this.equipment_id,
            region_range:this.region_range,
            equipment_type:this.equipment_type,
            device_state:this.device_state,
            security_software_orgcodes:_.map(this.Selfirms,s=>s.code).join(','),
            sort:this.orderObj.sort,
            order:this.orderObj.order
        }).then(res=>{
            this.blnLoading=false;
            if(!tool.msg(res,'','获取数据失败!'))return;
            this.data=this.converData(res.biz_body);
            this.pageCount=res.page.total;
            this.pageSize=res.page.page_size;
        });
    },
    //转化服务器数据对象为客户端对象
    converData(d){
        return _.map(d,c=>{
           
            return {
                    code:c.equipment_id,                //设备编码
                    name:c.equipment_name,              //设备名称
                    mac:c.mac,                          //MAC
                    state:c.online_state,               //状态
                    time:c.capture_time_desc,           //最近联系时间
                    uploadNum:c.last_upload_num,        //昨日上传量
                    kind:c.equipment_type,              //设备类型
                    place:c.netbar_name,                //所属场所
                    region:c.region_name,               //所属区域
                    firm:c.security_software_orgname,   //所属厂商
                    siteId:c.netbar_wacode              //场所ID
                }
        });
    },
    //分页处理
    pageChange(i){
        this.pageIndex=i;
        this.getDeviceData();
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

 
     this.CodeOrder=true;
     this.NameOrder=true;
     this.TimeOrder=true;
     this.PlaceOrder=true;
     this.areaOrder=true;
     this.FirmOrder=true;
     this[type]=val;

     let fieldMap={
        CodeOrder:'equipment_id',
        NameOrder:'equipment_name',
        TimeOrder:'capture_time',
        PlaceOrder:'netbar_wacode',
        areaOrder:'region_name',
        firmOrder:'security_software_orgname'
     };

     this.orderObj.sort=fieldMap[type];
     this.orderObj.order=val?'desc':'asc';
     this.getDeviceData();

    },
    //是否包含选中项
    isHasSelItem(data,code){
        return  _.find(data,d=>d.code==code);
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

.DeviceList .clickItem:hover{cursor:pointer;}
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
