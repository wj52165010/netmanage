<!-- 首页组件 -->
<template>
    <div class="Home" >
       <!--地图容器-->
       <div :id="id" class="map"></div>
       <!--加载中-->
        <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index: 100;">
          <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
        </div>

       <!--左边展示区域-->
       <div class="left_container">
        <div class="title">
            <span class="label">今日概要</span>
            <span class="info">{{currentDate}}</span>
        </div>
        <div class="content">
          <Scroll>

            <div class="item">
              <div class="bar">
                <span class="label">场所总数 {{countData.place.total}}</span>
                <span class="icon">
                  <div class="circlebg">
                    <el-tooltip placement="top" content="场所在离线情况">
                      <i class="fa fa-home" @click="showMapIndex=0"></i>
                    </el-tooltip>
                  </div>
                  <div class="circlebg">
                    <el-tooltip placement="top" content="区域在离线情况">
                      <i class="fa fa-laptop" @click="showMapIndex=1"></i>
                    </el-tooltip>
                  </div>
                </span>
              </div>
              <div class="info">
                <span class="left">在线:{{countData.place.online}}</span>
                <span class="right">{{countData.place.onlineRate}}</span>
              </div>
              <div class="info">
                <span class="left">离线:{{countData.place.unline}}</span>
                <div class="right process">
                  <div class="child" :style="{width:countData.place.onlinePercent}"></div>
                </div>
              </div>
            </div>

            <div class="item">
              <div class="bar">
                <span class="label">设备总数 {{countData.equipment.total}}</span>
                <span class="icon">
                  <el-tooltip placement="top" content="设备在离线情况">
                    <i class="fa fa-support" @click="showMapIndex=2"></i>
                  </el-tooltip>
                </span>
              </div>
              <div class="info">
                <span class="left">在线:{{countData.equipment.online}}</span>
                <span class="right">{{countData.equipment.onlineRate}}</span>
              </div>
              <div class="info">
                <span class="left">离线:{{countData.equipment.unline}}</span>
                <div class="right process">
                  <div class="child" :style="{width:countData.equipment.onlinePercent}"></div>
                </div>
              </div>
            </div>

            <div class="item">
              <div class="bar">
                <span class="label">日志采集质量 {{countData.logo.total}}</span>
                <span class="icon"></span>
              </div>
              <div class="info">
                <span class="left">有效:{{countData.logo.vaild}}</span>
                <span class="right">无效:{{countData.logo.invaild}}</span>
              </div>
            </div>

            <div class="item">
              <div class="bar">
                <span class="label">特定人员 {{countData.iden.total}}</span>
                <span class="icon">
                  <el-tooltip placement="top" content="特定人员报警点">
                    <i class="fa fa-bell-o" @click="showMapIndex=4"></i>
                  </el-tooltip>
                </span>
              </div>
              <div class="info">
                <span class="left">报警人数:{{countData.iden.persons}}</span>
                <span class="right">报警次数:{{countData.iden.polices}}</span>
              </div>
            </div>

          </Scroll>
        </div>
       </div>

       <!--右边展示区域-->
       <div class="right_container">
        <!--顶部展示区域-->
        <div class="top_show">
            <div class="title">
                <span class="label">数据采集概括</span>
            </div>
            <div class="content">
              <Scroll>

                <div class="item">
                  <div class="bar">
                    <span class="label">接入厂商 {{countData.firm.total}}</span>
                  </div>
                  <div class="info">
                    <span class="left">近7天有数据:{{countData.firm.hasData}}</span>
                    <span class="right">近7天无数据:{{countData.firm.noData}}</span>
                  </div>
                </div>

                <div class="item">
                  <div class="bar">
                    <span class="label">日志采集 {{countData.logoCollect.total}}</span>
                  </div>
                  <div class="info">
                    <span class="left">网吧:{{countData.logoCollect.sites}}</span>
                    <span class="right">特征:{{countData.logoCollect.idens}}</span>
                  </div>
                </div>

                <div class="item">
                  <div class="bar">
                    <span class="label">实名身份采集 {{countData.certificate.total}}</span>
                  </div>
                  <div class="info">
                    <span class="left">身份证:{{countData.certificate.card}}</span>
                    <span class="right">手机号:{{countData.certificate.phones}}</span>
                  </div>
                </div>

                <div class="item">
                  <div class="bar">
                    <span class="label">虚拟身份采集 {{countData.virtual.total}}</span>
                  </div>
                  <div class="info">
                    <span class="left">QQ:{{countData.virtual.qq}}</span>
                    <span class="right">微信:{{countData.virtual.weixin}}</span>
                  </div>
                </div>
              </Scroll>
            </div>
        </div>
        <!--底部展示区域-->
        <div class="bottom_show">

          <div class="item">
            <span class="date">2018年3月8日</span>
            深信服 厂商数据异常
          </div>

          <div class="item">
            <span class="date">2018年3月5日</span>
            QQ采集异常
          </div>

          <div class="item divEllipsis">
            <span class="date">2018年3月1日</span>
            中国电信安阳分公司 数据异常显示
          </div>

        </div>
       </div>

       <!--中间底部区域-->
       <div class="center_bottom_show" v-show="blnShowCenter">
          <div class="scaleBtn" @click="toggleShow()">
            <i class="fa fa-arrows-alt"></i>
          </div>
          <Scroll :listen="policesInfo">
            <div class="item" v-for="p in policesInfo" @click="infoClick(p)">{{p.info}}</div>
          </Scroll>
       </div>
       <!--中间显示底部区域按钮-->
       <div class="showCenter" v-show="!blnShowCenter" @click="toggleShow()">
        <i class="fa fa-arrows-alt"></i>
       </div>

      <!--中间悬浮框-->
      <div class="navpop">

        <div class="item" @click="showMapIndex=0">
          <div class="circlebg"><i class="fa fa-home"></i></div> 场所在离线情况
          <i class="fa fa-check" v-show="showMapIndex==0"></i>
        </div>

        <div class="item" @click="showMapIndex=1">
          <div class="circlebg"><i class="fa fa-laptop"></i></div> 区域场所在离线率热力图
          <i class=" fa fa-spinner fa-spin" v-show="!loadedSite"></i>
          <i class="fa fa-check" v-show="showMapIndex==1"></i>
        </div>

        <div class="item" @click="showMapIndex=2">
          <i class="fa fa-support"></i> 区域设备在离线率热力图
          <i class="fa fa-spinner fa-spin" v-show="!loadedEq"></i>
          <i class="fa fa-check" v-show="showMapIndex==2"></i>
        </div>

        <div class="item" @click="showMapIndex=3">
          <i class="fa fa-universal-access"></i> MAC热力图
          <i class="fa fa-spinner fa-spin" v-show="!loadedMac"></i>
          <i class="fa fa-check" v-show="showMapIndex==3"></i>
        </div>

        <div class="item" @click="showMapIndex=4">
          <i class="fa fa-bell-o"></i> 特定人员报警点
          <i class="fa fa-check" v-show="showMapIndex==4"></i>
        </div>

      </div>

      <!--中间地图伸缩尺-->
      <div class="scaleContainer">
          <ScaleBar :start="13" :end="18" @change="zoomChange" ref="scaleBar" />
      </div>

      <!--主操作框边角显示-->
      <div class="top_left"></div>
      <div class="top_right"></div>
      <div class="bottom_left"></div>
      <div class="bottom_right"></div>

      <!--地图提示框-->
      <div class="TipInfo fadeIn" name="TipInfo" :style="{left:tipInfoSize.x + 'px',top:tipInfoSize.y +'px'}" v-show="blnShowTipInfo">
        <div class="left-top"></div>
        <div class="right-bottom"></div>
        <Scroll ref="tipScroll" :listen="showData">
          <table class="table" style="border-collapse: collapse;margin-top:0px;">
              <tbody><tr v-for="f in showData">
                  <td style="width:120px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:120px;" class="divEllipsis">{{f.name}}</div></td>
                  <td style="width:60px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:60px;" class="divEllipsis">{{f.info}}</div></td>
                  <td style="width:60px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:60px;" class="divEllipsis">{{f.infoSub}}</div></td>
              </tr></tbody>
          </table>
        </Scroll>
      </div>
    </div>
</template>

<script>

import theme from './MapTheme'
import Scroll from 'components/scroll'
import PlacePoint from './Home.PlacePoint'
import HeatMap from './Home.HeatMap.js'
import DrowPoint from './Home.DrowPoint.js'
import ScaleBar from 'components/scaleBar'
import {SiteCount,EquipmentCount,DataCount,IdentityCount,InFirmCount,DataTotal,CertificateCount,VirtualCount,GetLastData,
        SiteMapData,EquipmentMapData,MacMapData
       } from '../store/mutation-types'

export default {
  name: 'Home',
  components:{Scroll,ScaleBar},
  data () {
    return {
      id:tool.guid(),
      blnLoading:false,
      map:null,
      pp:null,//地图秒点对象
      pm:null,//场所地图热点对象
      em:null,//设备地图热点对象
      macm:null,//MAC地图热点对象
      mainPerson:null,//特定人员热点对象
      blnShowCenter:false,
      blnShowTipInfo:false,
      tipInfoSize:{x:0,y:0},
      tipInfo:null,
      loadedSite:false,//场所在离线数据是否加载完成
      loadedEq:false,//设备在离线数据是否加载完成
      loadedMac:false,//MAC热力图是否加载完成
      currentDate:tool.DateFormat(new Date(),'yyyy年MM月dd日 hh:mm'),
      showMapIndex:-1,//当前显示地图索引
      showData:[],
      //统计信息
      countData:{
        //场所统计数据
        place:{total:0,onlineRate:'在线率:0%',online:0,unline:0,onlinePercent:'0%'},
        //设备统计数据
        equipment:{total:0,onlineRate:'在线率:0%',online:0,unline:0,onlinePercent:'0%'},
        //日志采集质量
        logo:{total:0,vaild:0,invaild:0},
        //特定人员
        iden:{total:0,persons:0,polices:0},
        //接入厂商
        firm:{total:0,hasData:0,noData:0},
        //日志采集
        logoCollect:{total:0,sites:0,idens:0},
        //真实身份
        certificate:{total:0,card:0,phones:0},
        //虚拟身份
        virtual:{total:0,qq:0,weixin:0}
      },
      //报警信息
      policesInfo:[],
      sitesData:[],
      equipmentData:[],
      macData:[],
      sepPersonMarsk:[],
      labels:[],
    }
  },
  watch:{
    showMapIndex(){
      this.blnShowTipInfo=false;
      if(this.showMapIndex==0){
        this.pm.hidden();
        this.em.hidden();
        this.macm.hidden();
        this.mainPerson.clear();
        this.pp.AddMarker();
      }

      if(this.showMapIndex==1){
        this.pp.ClearMarkers();
        this.em.hidden();
        this.macm.hidden();
        this.mainPerson.clear();
        this.pm.draw(this.sitesData);
      }

      if(this.showMapIndex==2){
        this.pp.ClearMarkers();
        this.pm.hidden();
        this.macm.hidden();
        this.mainPerson.clear();
        this.em.draw(this.equipmentData);
      }

      if(this.showMapIndex==3){
        this.pp.ClearMarkers();
        this.em.hidden();
        this.pm.hidden();
        this.mainPerson.clear();

        this.macm.draw(this.macData);
      }

      if(this.showMapIndex==4){
        this.pp.ClearMarkers();
        this.em.hidden();
        this.pm.hidden();
        this.macm.hidden();

        this.sepPersonMarsk = this.mainPerson.draw(this.policesInfo);
      }

    },
    blnShowTipInfo(){
      if(!this.blnShowTipInfo) return;
      this.$refs.tipScroll.reloadyScroll();
    }
  },
  mounted(){
    this.tipInfo=$(this.$el).find('div[name="TipInfo"]');
    this.initData();

    setTimeout(()=>{
      this.initMap();
      this.showMapIndex=0;
      this.pp= new PlacePoint(this.map,this.$store);
      this.pm=new HeatMap(this.map,{click:(item)=>{this.heatMapclick(item,1)}});
      this.em=new HeatMap(this.map,{click:(item)=>{this.heatMapclick(item,2)}});
      this.macm=new HeatMap(this.map,{click:(item)=>{this.heatMapclick(item,3)}});
      this.mainPerson=new DrowPoint(this.map,{click:this.heatMapclick});


      let bounds=this.map.getBounds();
      let lb=bounds.getSouthWest(),rt=bounds.getNorthEast();
      //获取场所在离线数据
      this.$store.dispatch(SiteMapData,{lb,rt}).then(res=>{
        let data = res.biz_body;
        let groupData = _.groupBy(data,(d)=>{ return d.longitude+'_'+d.latitude;});
        this.sitesData = groupData;
        this.loadedSite=true;
      });
      
      //获取设备离线数据
      this.$store.dispatch(EquipmentMapData,{lb,rt}).then(res=>{
        let data = res.biz_body;
        let groupData = _.groupBy(data,(d)=>{ return d.longitude+'_'+d.latitude;});
        this.equipmentData = groupData;
        this.loadedEq=true;
      });

      //获取MAC热力图数据
      this.$store.dispatch(MacMapData,{lb,rt}).then(res=>{
        let data = res.biz_body;
        let groupData = _.groupBy(data,(d)=>{ return d.equipment_longitude+'_'+d.equipment_latitude;});
        this.macData = groupData;
        this.loadedMac=true;
      });


    },100);

    
  },
  methods:{
    //初始化地图
    initMap(){
      this.map = new BMap.Map(this.id,{minZoom:13,maxZoom:18,enableMapClick: false});
      let centerPoint=tool.cookie.get('centerPoint').split(',') || [];
      this.map.centerAndZoom(new BMap.Point(centerPoint[0] || 0,centerPoint[1] || 0),13);//重庆中心点
      this.map.enableScrollWheelZoom(true);
      // this.map.setMapStyle({
      //     styleJson:theme
      // });

      //添加地图鼠标拖动事件
      this.map.addEventListener('dragend',(e)=>{
          Fx.DelayTrigger( () => {
            if(this.showMapIndex==0){
              this.blnLoading=true;
              this.pp.AddMarker().then(()=>{this.blnLoading=false;});
            }
          }, this.map, 200);
      });

      //添加地图层级改变事件
      this.map.addEventListener('zoomend',(e)=>{
          var zoom=this.map.getZoom();
          this.$refs.scaleBar.setVal(zoom);
          if(this.showMapIndex==0){
            this.blnLoading=true;
            this.pp.AddMarker().then(()=>{this.blnLoading=false;});
          }
      });

      
    },
    initData(){
      //获取场所在离线信息
      this.$store.dispatch(SiteCount).then(res=>{
        if(!tool.msg(res,'','获取场所在离线信息失败!')){return;}
        this.countData.place=this.formatCountData(res.biz_body,'place');
      });
      //获取设备在离线信息
      this.$store.dispatch(EquipmentCount).then(res=>{
        if(!tool.msg(res,'','获取设备在离线信息失败!')){return;}
        this.countData.equipment=this.formatCountData(res.biz_body,'equipment');
      });

      //日志采集质量统计信息
      this.$store.dispatch(DataCount).then(res=>{
          if(!tool.msg(res,'','获取日志采集质量信息失败!')){return;}
          this.countData.logo=this.formatCountData(res.biz_body,'logo');
      });

      //日志采集质量统计信息
      this.$store.dispatch(IdentityCount).then(res=>{
          if(!tool.msg(res,'','获取特定人员信息失败!')){return;}
          this.countData.iden=this.formatCountData(res.biz_body,'iden');
      });

      //厂商接入
      this.$store.dispatch(InFirmCount).then(res=>{
          if(!tool.msg(res,'','获取厂商接入信息失败!')){return;}
          this.countData.firm=this.formatCountData(res.biz_body,'firm');
      });

      //日志采集总数
      this.$store.dispatch(DataTotal).then(res=>{
          if(!tool.msg(res,'','获取日志采集信息失败!')){return;}
          this.countData.logoCollect=this.formatCountData(res.biz_body,'logoCollect');
      });
      
      //真实身份统计
      this.$store.dispatch(CertificateCount).then(res=>{
          if(!tool.msg(res,'','获取真实身份统计信息失败!')){return;}
          this.countData.certificate=this.formatCountData(res.biz_body,'certificate');
      });

      //虚拟身份统计
      this.$store.dispatch(VirtualCount).then(res=>{
          if(!tool.msg(res,'','获取虚拟身份统计信息失败!')){return;}
          this.countData.virtual=this.formatCountData(res.biz_body,'virtual');
      });

      //获取最新重点人员报警信息
      this.$store.dispatch(GetLastData).then(res=>{
          if(!tool.msg(res,'','获取最新重点人员报警信息失败!')){return;}
          
          this.blnShowCenter=res.biz_body.length>0;
          this.policesInfo=_.map(res.biz_body,d=>{
            return {
              id:d.id,
              info:`${tool.DateByTimestamp(d.logtime,'yyyy年MM月dd日 hh:mm')} ${d.customer_name} 在${d.netbar_address}${d.netbar_name} 出现`,
              equipment_longitude:d.equipment_longitude,
              equipment_latitude:d.equipment_latitude
            }
          });

      });
      
    },
    //中间列表项单击事件
    infoClick(d){
      this.showMapIndex=4;
      this.$nextTick(()=>{
        let mask= _.find(this.sepPersonMarsk,p=>{
          return p.point.lat==d.equipment_latitude && p.point.lng==d.equipment_longitude;
        });

        _.each(this.labels,l=>{
          this.map.removeOverlay(l);
        });
        _.each(this.sepPersonMarsk,p=>{
          p.setAnimation(null)
        });
    
        this.map.panTo(mask.point);
        // var label= new BMap.Label('<div><i class="fa fa-check-circle" style="color:green;font-size:30px;"></i></dvi>',{offset:new BMap.Size(-5, -30)});
        // label.setStyle({
        // fontSize : "12px",
        // lineHeight : "20px",
        // fontFamily:"微软雅黑",
        // fontWeight:'600',
        // border:'0px solid black',
        // 'background-color':'transparent',
        // 'max-width':'none'
        // });
        // mask.setLabel(label);
        mask.setAnimation(BMAP_ANIMATION_BOUNCE);
        //this.labels.push(label);
      });
  
    },
    //热力鼠标移动到点上的提示信息
    heatMapclick(item,flag){
    
      if(!item &&  this.showMapIndex == flag){this.blnShowTipInfo=false; return;}
      if(!item){return;}

      if(this.showMapIndex == flag){
        let map=this.map;
        let point=map.pointToPixel(new BMap.Point(item.geometry.coordinates[0], item.geometry.coordinates[1]));
        let x=point.x,
            y=point.y,
            w=this.tipInfo.width()+20,
            h=this.tipInfo.height()+20;

        this.tipInfoSize={x:x-w/2,y:y-h-50}
        this.blnShowTipInfo=true;
        
        this.showData=_.map(item.data,d=>{
          return {
            name:d.netbar_wacode,
            info:d.netbar_type,
            infoSub:d.online
          }
        });
      }

      

    },
    //转化统计数据显示格式
    formatCountData(d,flag){
      switch(flag){
        case 'place':
        case 'equipment':
          return {
            total:this.joinComma(d.total,3),
            onlineRate:d.right_title,
            online:this.joinComma(d.data[0].count,3),
            unline:this.joinComma(d.data[1].count,3),
            onlinePercent:d.data[0].count/d.total*100+'%'
          }    
          break;
        case 'logo':
          return {
            total:this.joinComma(d.total,3),
            vaild:this.joinComma(d.data[0].count,3),
            invaild:this.joinComma(d.data[1].count,3),
          }
          break;
        case 'iden':  
          return {
            total:this.joinComma(d.total,3),
            persons:this.joinComma(d.data[0].count,3),
            polices:this.joinComma(d.data[1].count,3),
          }
          break;
        case 'firm':
          return {
            total:this.joinComma(d.total,3),
            hasData:this.joinComma(d.data[0].count,3),
            noData:this.joinComma(d.data[1].count,3),
          }
          break;
        case 'logoCollect':
          return {
            total:this.joinComma(d.total,3),
            sites:this.joinComma(d.data[0].count,3),
            idens:this.joinComma(d.data[1].count,3),
          }
          break;
        case 'certificate':
          return {
            total:this.joinComma(d.total,3),
            card:this.joinComma(d.data[0].count,3),
            phones:this.joinComma(d.data[1].count,3),
          }
          break;
        case 'virtual':
          return {
            total:this.joinComma(d.total,3),
            qq:this.joinComma(d.data[0].count,3),
            weixin:this.joinComma(d.data[1].count,3),
          }
          break;
      }
      
    },
    //添加逗号
    joinComma(val,count){
        let num =(val+'') || '0';
        num = num.split('').reverse().join('');
        let len=num.length/count;
        let arr=[];
        for(let i=0;i<len;i++){
            let start=i*count;
            arr.unshift(num.substr(start,3).split('').reverse().join(''));
        }
        return arr.join(',');
    },
    toggleShow(){
      this.blnShowCenter=!this.blnShowCenter;
    },
    zoomChange(zoom){
      if(!this.map)return;
      this.map.setZoom(zoom);
    }
  }
}
</script>
<style>
    .Home .placeCount{width:80px;height:80px;background-color:red;border-radius:50%;text-align:center;color:white;}
</style>

<style scoped lang="less">
  @import "../css/variables.less";
  .Home{width:100%;height:100%;position:relative;}
  .Home .map{width:100%;height:100%;}
  
  @LeftW:280px;
  @Distance:10px;
  @bgColor:fade(@HeaderBgCol,90%);
  
  .Home .left_container{width:@LeftW;height:~'calc(100% - @{Distance} - @{Distance})';position:absolute;background-color:@bgColor;top:@Distance;margin-left:@Distance;border-radius:10px;}
  

  @RBH:200px;
  .Home .right_container{width:@LeftW;height:~'calc(100% - @{Distance} - @{Distance})';position:absolute;top:@Distance;right:@Distance;}
  .Home .right_container .top_show{width:100%;background-color:@bgColor;border-radius:10px;height:~'calc(100% - @{RBH} - @{Distance})';margin-bottom:@Distance;}
  .Home .right_container .bottom_show{width:100%;height:@RBH;background-color:@bgColor;border-radius:10px;padding:10px 0px;}

  .Home .center_bottom_show {
    position:absolute;left:@Distance*2 + @LeftW;right:@Distance*2 + @LeftW;bottom:@Distance;height:@RBH;border-radius:10px;background-color:@bgColor;
    padding:10px 0px;
  }

  .Home .showCenter {position: absolute;width:30px;height:30px;line-height:30px;border-radius:5px;background-color:@bgColor;color:white;text-align:center;right:@Distance*2 + @LeftW;bottom:@Distance;}
  //.Home .showCenter:hover{color:@Font_Hover_Col;cursor:pointer;}
  html{.TCol(~".Home .showCenter:hover");cursor:pointer;}

  @InfoTitleH:40px;
  .Home .right_container .title,
  .Home .left_container .title{
    height:@InfoTitleH;line-height:@InfoTitleH;color:white;width:100%;border-top-left-radius:@Distance;border-top-right-radius:@Distance;
    padding:0px 10px;text-align:left;overflow:hidden;
  }
  html{.TCol(~".Home .right_container .title",'bg');}
  html{.TCol(~".Home .left_container .title",'bg');}

  .Home .right_container .title .label,
  .Home .left_container .title .label{font-size:14px;}
  .Home .right_container .title .info,
  .Home .left_container .title .info{float:right;font-size:12px;line-height:@InfoTitleH + 5px;}
  .Home .left_container .content{height:~'calc(100% - @{InfoTitleH})';width:100%;padding-bottom:10px;}
  
  .Home .right_container .top_show .content .item,
  .Home .left_container .content .item{text-align:left;color:white;padding:10px 10px;overflow:hidden;}
  
  @InfoLineH:30px;
  .Home .right_container .top_show .content .item .bar .label,
  .Home .left_container .content .item .bar .label{font-size:14px;line-height:@InfoLineH;padding:0px;}
  .Home .right_container .top_show .content .item .bar .icon,
  .Home .left_container .content .item .bar .icon{float:right;margin-top:5px;cursor:pointer;}

  .Home .navpop .item:hover .circlebg i,
  .Home .navpop .item:hover{cursor:pointer;}
  html{.TCol(~".Home .navpop .item:hover .circlebg i");}
  html{.TCol(~".Home .navpop .item:hover");}

  .Home .navpop .item .circlebg,
  .Home .right_container .top_show .content .item .circlebg,
  .Home .left_container .content .item .bar .icon .circlebg{display:inline-block; width:15px;height:15px;line-height:15px;border-radius:50%;text-align:center;background-color:white;}
  .Home .navpop .item .circlebg i,
  .Home .right_container .top_show .content .item .circlebg i,
  .Home .left_container .content .item .bar .icon .circlebg i{color:black;font-size:11px;}

  //.Home .navpop .item .fa-check{color:@Font_Hover_Col;}
  html{.TCol(~".Home .navpop .item .fa-check");}


  .Home .right_container .top_show .content .item .info,
  .Home .left_container .content .item .info{line-height:@InfoLineH - 10px;font-size:12px;}
  .Home .right_container .top_show .content .item .info .right,
  .Home .left_container .content .item .info .right{float:right;}
  .Home .right_container .top_show .content .item .info .process,
  .Home .left_container .content .item .info .process{width:120px;height:8px;background-color:#808080;margin-top:5px;}
  .Home .right_container .top_show .content .item .info .process .child,
  .Home .left_container .content .item .info .process .child{background-color:#85c226;height:100%;float:right;}


  .Home .right_container .top_show .content{height:~'calc(100% - @{InfoTitleH})';width:100%;}

  .Home .center_bottom_show .item,
  .Home .right_container .bottom_show .item{color:white;text-align:left;line-height:30px;padding:0px 10px;font-size:12px;}

  .Home .center_bottom_show .item:hover{cursor:pointer;color:white;}
  html{.TCol(~".Home .center_bottom_show .item:hover","bg");}

  .Home .navpop{
    position:absolute;border-radius:5px;padding:10px;top:@Distance;left:@Distance*2 + @LeftW;background-color:@bgColor;color:white;font-size:12px;
    text-align:left;line-height:30px;min-width: 190px;
  }

  .Home .scaleContainer{
    position:absolute;top:@Distance + 10px;right:@Distance*2 + @LeftW + 10px;z-index: 1000;
  }

  @AngleSize:40px;
  @lineW:3px;
  .Home .top_left{top:@Distance;left:@Distance*2 + @LeftW;position:absolute;width:@AngleSize;height:@AngleSize;overflow:hidden;border-radius:5px;}
  .Home .top_left:before{
    content:'';position:absolute;left:0px;
    width:100%;height:@lineW;//background:linear-gradient(135deg,fade(@Font_Hover_Col,90%) @AngleSize - 20px,transparent 0)
  }
  html{.TCol(~".Home .top_left:before","bgLine",135deg,90%,@AngleSize - 20px,transparent,0);}

  .Home .top_left:after{
    content:'';position:absolute;left:0px;
    height:100%;width:@lineW;//background:linear-gradient(135deg,fade(@Font_Hover_Col,90%) @AngleSize - 20px,transparent 0)
  }

  html{.TCol(~".Home .top_left:after","bgLine",135deg,90%,@AngleSize - 20px,transparent,0);}
  
  .Home .top_right{top:@Distance;right:@Distance*2 + @LeftW;position:absolute;width:@AngleSize;height:@AngleSize;overflow:hidden;border-radius:5px;}
  .Home .top_right:before{
    content:'';position:absolute;left:0px;
    width:100%;height:@lineW;//background:linear-gradient(-135deg,fade(@Font_Hover_Col,90%) @AngleSize - 20px,transparent 0)
  }

  html{.TCol(~".Home .top_right:before","bgLine",-135deg,90%,@AngleSize - 20px,transparent,0);}

  .Home .top_right:after{
    content:'';position:absolute;right:0px;
    height:100%;width:@lineW;//background:linear-gradient(-135deg,fade(@Font_Hover_Col,90%) @AngleSize - 20px,transparent 0)
  }

  html{.TCol(~".Home .top_right:after","bgLine",-135deg,90%,@AngleSize - 20px,transparent,0);}

  .Home .bottom_left{bottom:@Distance*2 + @RBH;left:@Distance*2 + @LeftW;position:absolute;width:@AngleSize;height:@AngleSize;overflow:hidden;border-radius:5px;}
  .Home .bottom_left:before{
    content:'';position:absolute;left:0px;bottom:0px;
    width:100%;height:@lineW;//background:linear-gradient(-135deg,transparent 10px,fade(@Font_Hover_Col,90%) 10px)
  }

  html{.TCol(~".Home .bottom_left:before","bgLineRerver",-135deg,90%,10px,transparent,10px);}

  .Home .bottom_left:after{
    content:'';position:absolute;left:0px;bottom:0px;
    height:100%;width:@lineW;background:linear-gradient(-135deg,transparent 10px,fade(@Font_Hover_Col,90%) 10px)
  }

  html{.TCol(~".Home .bottom_left:after","bgLineRerver",-135deg,90%,10px,transparent,10px);}

  .Home .bottom_right{bottom:@Distance*2 + @RBH;right:@Distance*2 + @LeftW;position:absolute;width:@AngleSize;height:@AngleSize;overflow:hidden;border-radius:5px;}
  .Home .bottom_right:before{
    content:'';position:absolute;right:0px;bottom:0px;
    width:100%;height:@lineW;//background:linear-gradient(135deg,transparent 10px,fade(@Font_Hover_Col,90%) 10px)
  }

  html{.TCol(~".Home .bottom_right:before","bgLineRerver",135deg,90%,10px,transparent,10px);}

  .Home .bottom_right:after{
    content:'';position:absolute;right:0px;bottom:0px;
    height:100%;width:@lineW;//background:linear-gradient(135deg,transparent 10px,fade(@Font_Hover_Col,90%) 10px)
  }

  html{.TCol(~".Home .bottom_right:before","bgLineRerver",135deg,90%,10px,transparent,10px);}

  .Home .scaleBtn{position:absolute;top:5px;right:15px;color:white;z-index:100;}
  .Home .scaleBtn:hover{cursor:pointer;}

  html{.TCol(~".Home .scaleBtn:hover");}



  //地图提示框样式
  .Home .TipInfo{
    position:absolute;top:0px;left:500px;width:300px;height:100px;background-color:@bgColor;
    border-radius:10px;
    -moz-box-shadow:2px 2px 5px #333333; -webkit-box-shadow:2px 2px 5px #333333; box-shadow:2px 2px 5px #333333;
    padding:10px;color:white;
  }

  .Home .TipInfo:before{
    content:'';
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 6px solid @bgColor;
    position: absolute;
    bottom: -7px;
    left: ~'calc(50% - 4px)';
  }

  .Home .TipInfo .left-top{
    position:absolute;left:0px;top:0px;width:50px;height:50px;
    border-top:5px solid;
    border-left:5px solid;
    border-top-left-radius:10px;
  }

  html{.TCol(~".Home .TipInfo .left-top",'btc');}
  html{.TCol(~".Home .TipInfo .left-top",'blc');}

  .Home .TipInfo .right-bottom{
    position:absolute;right:0px;bottom:0px;width:50px;height:50px;
    border-right:5px solid ;
    border-bottom:5px solid ;
    border-bottom-right-radius:10px;
  }

  html{.TCol(~".Home .TipInfo .right-bottom",'brc');}
  html{.TCol(~".Home .TipInfo .right-bottom",'bbc');}

  //列表样式
@tableRowH:30px;
.table{margin-bottom:0px;}
.table_header{height:@tableRowH;.border('bottom');}
.table_header tr{height:~'calc(@{tableRowH} - 1px)';}
.table_header th{padding-left:0px;padding-right:0px;}
.table_header{color:white;}

html{.TCol(~"table_header",'bg');}
.table_body{height:~'calc(100% - @{tableRowH})';width:100%;}
.table_body td{padding-left:0px;padding-right:0px;}
</style>
