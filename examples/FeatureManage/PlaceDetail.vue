<!-- 场所详情组件 -->
<template>
    <div class="PlaceDetail">
        <!--加载中-->
        <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index: 100;">
            <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
        </div>
        <div class="PlaceDetail_container">
            <div class="row">
                <div class="col-md-12 title">基础信息:</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">场所名称:</div><div class="col-md-4 ">{{d.netbar_name}}</div>
                <div class="col-md-2 text-right">场所编码:</div><div class="col-md-4 ">{{d.netbar_wacode}}</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">营业状态:</div><div class="col-md-4 ">{{d.business_state}}</div>
                <div class="col-md-2 text-right">场所状态:</div><div class="col-md-4 ">{{d.online_state}}</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">设备概况:</div><div class="col-md-4 ">在线{{d.online_device || 0}}/异常{{d.abnormal_device || 0}}/离线{{d.offline_device || 0}}  </div>
                <div class="col-md-2 text-right">场所类型:</div><div class="col-md-4 ">{{d.netsite_type}}</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">经营性质:</div><div class="col-md-4 ">{{d.business_nature}}  </div>
                <div class="col-md-2 text-right">最近联系时间:</div><div class="col-md-4 ">{{d.capture_time_desc}}</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">营业时间:</div><div class="col-md-4 ">{{d.start_time}} - {{d.end_time}}  </div>
            </div>

            <div class="row">
                <div class="col-md-12 title">网络接入信息:</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">网络服务商:</div><div class="col-md-2 ">{{d.access_servicecode}}  </div>
                <div class="col-md-2 text-right">接入方式:</div><div class="col-md-2 ">{{d.connect_mode}}</div>
                <div class="col-md-2 text-right">账号或IP:</div><div class="col-md-2 ">{{d.access_ip}}&nbsp;&nbsp;&nbsp;&nbsp;{{d.auth_account}}</div>
            </div>

            <div class="row">
                <div class="col-md-12 title">场所负责人:</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">姓名:</div><div class="col-md-2 ">{{d.law_principal_name}}  </div>
                <div class="col-md-2 text-right">证件号码:</div><div class="col-md-2 ">{{d.law_principal_certificate_id}}</div>
                <div class="col-md-2 text-right">联系电话:</div><div class="col-md-2 ">{{d.law_principal_tel}}</div>
            </div>

            <div class="row">
                <div class="col-md-12 title">所属厂商:</div>
            </div>

            <div class="row">
                <div class="col-md-2 text-right">厂商名称:</div><div class="col-md-2 ">{{d.security_software_orgname}}  </div>
                <div class="col-md-2 text-right">负责人:</div><div class="col-md-2 ">{{d.contactor}}</div>
                <div class="col-md-2 text-right">联系电话:</div><div class="col-md-2 ">{{d.contactor_tel}}</div>
            </div>

            <!--地图展示-->
            <div class="map_container" name="map">
            
            </div>
        </div>
    </div>
</template>

<script>

import {SiteDetail} from '../../store/mutation-types'

export default {
  name: 'PlaceDetail',
  props:['code'],
  data () {
    return {
      map:null,
      d:{},
      blnLoading:false,
    }
  },
  mounted(){
    this.loadData();
  },
  methods:{
    //加载场所详细信息
    loadData(){
        this.blnLoading=true;
        this.$store.dispatch(SiteDetail,{netbar_wacode:this.code}).then(res=>{
            this.blnLoading=false;
            if(!tool.msg(res,'','获取详细数据失败!'))return;
            this.d=res.biz_body;
            this.loadMap(this.d);
        });
    },
    loadMap(d){
        if(d.longitude=='' || d.longitude==undefined || d.latitude=='' || d.latitude==undefined){tool.info('无效经纬度!');return;}

        this.map = new BMap.Map($(this.$el).find('div[name="map"]')[0],{enableMapClick:false,minZoom:13,maxZoom:18});          // 创建地图实例  
        let point = new BMap.Point(d.longitude,d.latitude);  // 创建点坐标                                          
        this.map.centerAndZoom(point, 13);                 // 初始化地图，设置中心点坐标和地图级别 
        this.map.enableScrollWheelZoom(true);              // 启动鼠标滚轮缩放
        let marker = new BMap.Marker(new BMap.Point(d.longitude,d.latitude)); // 创建点
        this.map.addOverlay(marker);                      //将点加入地图中
        let top_left_navigation = new BMap.NavigationControl({author:BMAP_NAVIGATION_CONTROL_ZOOM});  //左上角，添加默认缩放平移控件

        let opts = {
            width : 450,     // 信息窗口宽度
            height: 30,     // 信息窗口高度
            title : '场所地址：'+ d.netbar_address , // 信息窗口标题
        }
        let infoWindow = new BMap.InfoWindow(`经纬度：${d.longitude},${d.latitude}`, opts);
        
        marker.addEventListener("click", ()=>{          
            this.map.openInfoWindow(infoWindow,point); //开启信息窗口
        });
    }
  }
}
</script>

<style scoped lang="less">
@import "../../css/variables.less";

.PlaceDetail{width:100%;height:100%;padding:5px;position:relative;}
.PlaceDetail_container{width:100%;height:100%;background-color:white;}

.PlaceDetail .row .title{font-weight:600;}
.PlaceDetail .row {line-height:30px;}

.PlaceDetail .map_container{width:100%;height:200px;}
</style>
