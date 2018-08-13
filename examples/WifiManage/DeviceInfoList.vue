<!-- 场所列表页页面组件 -->
<template>
    <div class="DeviceInfoList">
        <div class="DeviceInfoList_container">
            <!--加载中-->
            <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index: 100;">
                <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
            </div>
            <!--列表头-->
            <div class="table_header">
                <div class="row">
                    <div class="column" style="width:250px;">
                        <span class="overflow" style="width:250px;position:relative;">
                            <span style="margin-right:5px;">设备编码</span>
                            <i class="fa fa-caret-up" :class="{active:!CodeOrder}" @click="orderChange('CodeOrder',false);"></i><i class="fa fa-caret-down" :class="{active:CodeOrder}" @click="orderChange('CodeOrder',true);"></i>
                        </span>
                    </div>

                    <div class="column">
                        <span class="overflow" style="position:relative;" :style="{width:column_w+'px'}">
                            <span style="margin-right:5px;">设备名称</span>
                            <i class="fa fa-caret-up" :class="{active:!NameOrder}" @click="orderChange('NameOrder',false);"></i><i class="fa fa-caret-down" :class="{active:NameOrder}" @click="orderChange('NameOrder',true);"></i>
                        </span>
                    </div>
                    <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">设备类型</span></div>
                    <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">设备状态</span></div>
                    <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">最近联系时间</span></div>
                    <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">安全厂商</span></div>
                    

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
                            <div class="column" style="width:250px;"><span class="overflow" style="width:250px;">{{d.equipment_id}}</span></div>
                            <div class="column"><span class="overflow" :style="{width:column_w+'px'}">{{d.equipment_name}}</span></div>
                            <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">{{d.equipment_type}}</span></div>
                            <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">{{d.online_state}}</span></div>
                            <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">{{converTime(d.capture_time)}}</span></div>
                            <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">{{d.security_software_orgname}}</span></div>
                        </div>
                    </div>
                </Scroll>
            </div>

        </div>
    </div>
</template>

<script>
import Scroll from  'components/scroll'

import {BODY_RESIZE,GetSiteDeviceList} from '../../store/mutation-types'

export default {
  name: 'DeviceInfoList',
  props:['code'],
  components:{Scroll},
  data () {
    return {
      column_w:0,
      bodyResizeSub:null,
      bodyH:0,
      data:[],
      blnLoading:false,
      pageIndex:0,
      CodeOrder:true,
      NameOrder:true,
      orderObj:{sort:'netbar_wacode',order:'desc'},
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
            this.bodyH=`calc(100% - 40px`;

            this.$nextTick(()=>{
                this.$refs.scroll.reloadyScroll()
            })
        },100);
        this.column_w=$(this.$el).width()-700 -10;
    },
    //加载设备信息数据
    loadData(){
        this.blnLoading=true;
        this.$store.dispatch(GetSiteDeviceList,{
            netbar_wacode:this.code,
            sort:'customer_name',
            order:this.nameOrder?'desc':'asc'
        }).then(res=>{
            this.blnLoading=false;
            if(!tool.msg(res,'','获取数据失败!'))return;
            this.data=res.biz_body;
        });
    },
    converTime(v){
        return  v && v!='0' ? tool.DateByTimestamp(v,'yyyy-MM-dd hh:mm:ss'):"无";
    },
    //排序改变事件
    orderChange(type,val){
     let orderCache=this[type];

     if(orderCache==val) return;


     this.CodeOrder=true;
     this.NameOrder=true;

     this[type]=val;

     let fieldMap={
        CodeOrder:'netbar_wacode',
        NameOrder:'netbar_name',
     };

     this.orderObj.sort=fieldMap[type];
     this.orderObj.order=val?'desc':'asc';
     this.loadData();

    },
  }
}
</script>

<style scoped lang="less">
@import "../../css/variables.less";
.DeviceInfoList{width:100%;height:100%;padding:5px;position:relative;}
.DeviceInfoList_container{width:100%;height:100%;background-color:white;}

.DeviceInfoList .option_bar{text-align:left;padding:5px 15px;line-height:40px;}
.DeviceInfoList .option_bar .item{display:inline-block;margin:2px 5px;}

.DeviceInfoList .right_option_bar {float:right;}
.DeviceInfoList .right_option_bar .item{display:inline-block;margin:2px 5px;}
.DeviceInfoList .right_option_bar .item:hover{cursor:pointer;}
html{.TCol(~".DeviceInfoList .right_option_bar .item:hover");}

.DeviceInfoList .cursor{cursor:pointer;}

.DeviceInfoList .page_container{.border('top');}

.DeviceInfoList .fa-caret-up{position:absolute;top:8px;cursor:pointer;font-size:14px;color:gray;}
.DeviceInfoList .fa-caret-down{position:absolute;top:17px;cursor:pointer;font-size:14px;color:gray;}

.DeviceInfoList .fa-caret-up.active,
.DeviceInfoList .fa-caret-down.active,
.DeviceInfoList .fa-caret-up:hover,
.DeviceInfoList .fa-caret-down:hover{
    color:white;
}

.DeviceInfoList .clickItem:hover{cursor:pointer;}
html{.TCol(~".DeviceInfoList .clickItem");}

//列表显示样式
@header_H:40px;
.DeviceInfoList .table_header{height:@header_H;display:table;width:100%;border:none;color:white;}
html{.TCol(~".DeviceInfoList .table_header .row",'bg');}

.DeviceInfoList .table_header .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}
.DeviceInfoList .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;.border('bottom');background-color:white;}
.DeviceInfoList .table_header .column .sort_item .triangle-up:hover{cursor:pointer;}
html{.TCol(~".DeviceInfoList .table_header .column .sort_item .triangle-up:hover",'bbc');}

.DeviceInfoList .table_header .column .sort_item .triangle-down:hover{cursor:pointer;}
html{.TCol(~".DeviceInfoList .table_header .column .sort_item .triangle-down:hover",'btc');}

html{.TCol(~".DeviceInfoList .table_header .column .sort_item .triangle-up.active",'bbc');}

html{.TCol(~".DeviceInfoList .table_header .column .sort_item .triangle-down.active",'btc');}

.DeviceInfoList .table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";.border('bottom');}
.DeviceInfoList .table_body{width:100%;display:table;width:100%;border:none;}
.DeviceInfoList .table_body .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}

.DeviceInfoList .table_body .column:first-child{.border('left');}
.overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}
</style>
