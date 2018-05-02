<!-- 同行轨迹案例组件 -->
<template>
    <div class="PeerTrack">
        <!--左边导航栏-->
        <div class="left_container">
          <Scroll ref="NavScroll">

            <!--背景色测试-->
            <!--<div class="test"></div>-->

            <!--栏目项-->
            <div class="nav_item" :class="{open:n.show}" v-for="(n,i) in navs">
              <div class="title" @click="navToogle(n)">
                同行率:{{n.supportStr}}
                <div class="option_bar">
                  <el-tooltip  effect="light" content="展示" placement="top" >
                    <i class="fa fa-eye" @click="curLookIndex=i" :class="{active:curLookIndex==i}"></i>
                  </el-tooltip>
                </div>
              </div>
              <div class="content fadeIn" v-if="n.show">
                <div class="content_item" v-for="c in n.team">
                  <el-checkbox v-model="c.checked" v-on:change="change(c,n.id)"></el-checkbox><div class="info divEllipsis">{{c.name}}</div>
                </div>
              </div>
            </div>
          </Scroll>
        </div>
        <!--右边子MAC显示区域-->
        <div class="childMac" :id="childId">

        </div>

        <!--中间地图展示区域(主MAC)-->
        <div class="right_container">
          <!--地图展示区域-->
          <div :id="id" style="width:100%;height:100%;"></div>
          <!--时间播放器容器-->
          <div class="TimerPlayerContainer">
            <!--<TimePlayer :range="range" @timeChange="timeChange" />-->
            <PointPlayer :data="i_mainMac" @countChange="countChange" :range="range" :blnSimple="true" @timeChange="timeChange" />
          </div>
        </div>
    </div>
</template>

<script>
import {TogetherTeam,TogetherTeamTrack,TogetherTeamMainTrack} from '../store/mutation-types'

import Scroll from 'components/scroll'
import TimePlayer from 'components/TimePlayer'
import PointPlayer from 'components/PointPlayer'
import BaiduHelper from '../helper/BaiduHelper'
import ScaleBar from 'components/scaleBar'
export default {
  name: 'PeerTrack',
  props:['taskid'],
  components:{Scroll,TimePlayer,PointPlayer,ScaleBar},
  data () {
    return {
       id:'map'+tool.guid(),
       map:null,
       childId:'child_map'+tool.guid(),
       childMap:null,
       navs:[
        //  {name:'测试',show:false,content:[{name:'1',checked:false},{name:'2',checked:false}]},
        //  {name:'测试',show:false,content:[{name:'1',checked:false}]},
        //  {name:'测试',show:false,content:[{name:'1',checked:false}]}
       ],
       curLookIndex:0,
       cacheShape:{},//缓存地图上显示的图形信息便于后续删除操作
       mainMac:[],//缓存当前数据
       i_mainMac:[],//记录当前主MAC数据
       mainPath:[],//主MAC路径对象(用于操作删除对象)
       childMac:{},//子MAC路径数据集合(存在多个子MAC用键值对的形式存储)
       addData:[],//已经添加进地图的数据(主MAC数据)
       unAddData:[],//还未添加进地图的数据(主MAC数据)
       _range:[],//记录当前主MAC的时间范围
       range:[],//当前数据时间区间范围
       curShowIndexSide:0,//当前界面上显示数据边界
       endTime:0,//结束时间
    }
  },
  watch:{
    navs:{
      deep:true,
      handler(){
        this.$nextTick(()=>{
          this.$refs.NavScroll.reloadyScroll();
        });
      }
    }
  },
  mounted(){
    this.initMap();
    this.initChildMap();

    //获取同行主MAC轨迹信息
    this.$store.dispatch(TogetherTeamMainTrack,{task_id:this.taskid}).then(res=>{
      
      if(res.biz_body.data.length<=0){tool.info('暂无数据!');return;}
      this.mainMac=tool.Clone(res.biz_body.data);
      this.i_mainMac=tool.Clone(res.biz_body.data);
      this.unAddData=res.biz_body.data;

      this.range=[
        res.biz_body.data[0].primary.log_time,
        res.biz_body.data[res.biz_body.data.length-1].primary.log_time
      ];

      this._range=tool.Clone(this.range);
      this.endTime=parseInt(this.range[0]);

      //res.biz_body.data=[res.biz_body.data[0]];//[{latitude:'36.081306',longitude:'113.841106'}];
    
      setTimeout(()=>{
        //this.playPath(res.biz_body.data,'red');
        this.map.panTo(new BMap.Point(res.biz_body.data[0].longitude,res.biz_body.data[0].latitude));

        let points=_.map(this.mainMac,d=>{
          return new BMap.Point(d.longitude || d.equipment_longitude, d.latitude || d.equipment_latitude);
        });
        
        let viewport = this.map.getViewport(points);
        this.map.setCenter(new BMap.Point(viewport.center.lng,viewport.center.lat));
        this.map.setZoom(viewport.zoom);
      },100);
    });

    //获取同行分析组
    this.$store.dispatch(TogetherTeam,{task_id:this.taskid}).then(res=>{
      this.navs=this.struNavsData(res.biz_body);
    });

  },
  methods:{
    //导航项内容显示切换
    navToogle(n){
      n.show=!n.show;
    },
    //构建同行分组信息数据
    struNavsData(data){
      return _.map(data,d=>{

        return{
          id:d._id,
          support:d.support,
          supportStr:(parseFloat(d.support || '0') * 100) +'%',
          team:_.map(d.team.split(','),c=>{ return {name:c,checked:false};}),
          show:false
        }
      });
    },
    //初始化地图
    initMap(){
      this.map = new BMap.Map(this.id,{minZoom:12,maxZoom:18});
      let centerPoint=tool.cookie.get('centerPoint').split(',') || [];
      this.map.centerAndZoom(new BMap.Point(centerPoint[0] || 0,centerPoint[1] || 0),13);
      this.map.enableScrollWheelZoom(true);
    },
    //初始化子MAC地图
    initChildMap(){
      this.childMap = new BMap.Map(this.childId,{minZoom:12,maxZoom:18});
      let centerPoint=tool.cookie.get('centerPoint').split(',') || [];
      this.childMap.centerAndZoom(new BMap.Point(centerPoint[0] || 0,centerPoint[1] || 0),13);
      this.childMap.enableScrollWheelZoom(true);
    },
    //构建路径
    playPath(data,color,pointOps){
      if(!this.map) return;
      pointOps=pointOps || {};
      let s=this,markers=[],lines=[],polyline;
      pointOps.size=pointOps.size || 30;
      pointOps.color=pointOps.color || 'red'

      for(let i=0;i<data.length;i++){

        let point=new BMap.Point(data[i].longitude || data[i].equipment_longitude, data[i].latitude || data[i].equipment_latitude);
        //let marker=new BMap.Marker(point);
        
        var label= new BMap.Label(`<div style="background-color:${pointOps.color};width:${pointOps.size}px;height:${pointOps.size}px;line-height:${pointOps.size}px;text-align:center;border-radius:50%;color:white;">
                                    ${i+1}
                                  </div>`,{position:point,offset:new BMap.Size(-pointOps.size/2,-pointOps.size/2)});
        label.setStyle({
                            fontSize : "12px",
                            lineHeight : "20px",
                            fontFamily:"微软雅黑",
                            fontWeight:'600',
                            border:'0px solid black',
                            'background-color':'transparent',
                            'max-width':'none'
                        });

        markers.push(label);
        s.map.addOverlay(label);

        lines.push(point);
      }
      
      polyline = new BMap.Polyline(lines, {strokeColor:color || "#555555", strokeWeight:3, strokeOpacity:1});   //创建折线
      s.map.addOverlay(polyline);   //增加折线

      return {markers,polyline};
    },
    //导航子项checkbox选中改变事件
    change(d,parentId){
      if(d.checked){
        //获取该从MAC路径信息
        if(this.cacheShape[d.name+parentId]) return;

        this.$store.dispatch(TogetherTeamTrack,{task_id:this.taskid,mac:d.name,indexArray:this.mainMac}).then(res=>{
          //this.cacheShape[d.name+parentId] = this.playPath(res.biz_body[0][d.name],'rgb(3, 171, 103)',{size:20,color:'rgb(3, 171, 103)'});//画出整个子MAC路径数据

          this.childMac[d.name+parentId]={};
          this.childMac[d.name+parentId].addData=[];
          this.childMac[d.name+parentId].unAddData=res.biz_body[0][d.name];
          this.childMac[d.name+parentId].data=tool.Clone(res.biz_body[0][d.name]);
          this.childMac[d.name+parentId].endTime=0;
          this.childMac[d.name+parentId].path=[];

          if(this.childMac[d.name+parentId].unAddData.length>0){
            this.childMac[d.name+parentId].range=[
              this.childMac[d.name+parentId].unAddData[0].logtime,
              this.childMac[d.name+parentId].unAddData[this.childMac[d.name+parentId].unAddData.length-1].logtime
            ];
          }
        
          //分屏显示时，需要定位当前子MAC在地图上的点
          let points=_.map(res.biz_body[0][d.name],d=>{
            return new BMap.Point(d.longitude || d.equipment_longitude, d.latitude || d.equipment_latitude);
          });
          
          let viewport = this.childMap.getViewport(points);
          this.childMap.setCenter(new BMap.Point(viewport.center.lng,viewport.center.lat));
          this.childMap.setZoom(viewport.zoom);
          
        });

      }else{
      //清除根据播放器实现的描点路径
      let data=this.childMac[d.name+parentId];
      if(!data) return;

      _.each(data.path,(d)=>{
        let point=data.path.shift();
        this.map.removeOverlay(point);
        if(point._relLine){
          this.map.removeOverlay(point._relLine);

          _.each(point._relLine._arrows || [],a=>{
              this.map.removeOverlay(a);
          });
        }
      });

      delete this.childMac[d.name+parentId];



      //清除该路径下图像显示(完整路径清除)
      //   let shapes=this.cacheShape[d.name+parentId];
      //   if(!shapes) return;
      
      //  _.each(shapes.markers,m=>this.map.removeOverlay(m));
      //   this.map.removeOverlay(shapes.polyline);

      
      //   delete this.cacheShape[d.name+parentId];
      }
    },
    //描点(单个点)
    drawPoint(map,index,d,blnPanTo,pointOps){
      pointOps=pointOps || {};
      pointOps.size=pointOps.size || 30;
      pointOps.color=pointOps.color || 'red'

      let point=new BMap.Point(d.longitude || d.equipment_longitude, d.latitude || d.equipment_latitude);
      var label= new BMap.Label(`<div style="background-color:${pointOps.color};width:${pointOps.size}px;height:${pointOps.size}px;line-height:${pointOps.size}px;text-align:center;border-radius:50%;color:white;">
                                    
                                  </div>`,{position:point,offset:new BMap.Size(-pointOps.size/2,-pointOps.size/2)});
      label.setStyle({
                          fontSize : "12px",
                          lineHeight : "20px",
                          fontFamily:"微软雅黑",
                          fontWeight:'600',
                          border:'0px solid black',
                          'background-color':'transparent',
                          'max-width':'none'
                      });
      map.addOverlay(label);

      if(blnPanTo){
        map.panTo(point);
      }

      return label;
    },
    //描两点之间的线段
    drawLine(map,points,color){
      color=color || 'red';

      let polyline = new BMap.Polyline(points, {strokeColor:color || "#555555", strokeWeight:2, strokeOpacity:1});   //创建折线
      map.addOverlay(polyline); //增加折线

      return polyline;
    },
    //描两点之间的三角箭头
    drawArrow(polyline,length,angleValue,distance,strokeColor,width){
     return ''; //BaiduHelper.arrows(this.map,polyline,length,angleValue,distance,strokeColor,width);
    },
    //操作MAC路径显示
    macPath(map,res,mainPath,sOps,dOps,pOps){
      let startPointOps=sOps || {size:15,color:'#ff0000'},//路径起点样式
          drawPointOps=dOps || {size:10,color:'green',borderColor:'#808080'}, //画过后的点样式
          pointOps=pOps || {size:20,color:'#0077b3'}; //正在画的点样式
      
      map=map || this.map;

      switch(res.flag){
        case 'Add':
          _.each(res.data,(d)=>{

            let lastPoint=mainPath.length<=0?
              this.drawPoint(map,mainPath.length,d,false,startPointOps) :
              this.drawPoint(map,mainPath.length,d,false,pointOps);
      

            //从第二个点开始画线
            if(mainPath.length>0){
              let firstPoint=new BMap.Point(mainPath[0].point.lng,mainPath[0].point.lat);
              let secondPoint=new BMap.Point(lastPoint.point.lng,lastPoint.point.lat);

              lastPoint._relLine=this.drawLine(map,[firstPoint,secondPoint],pointOps.color);
              lastPoint._relLine._arrows=this.drawArrow(lastPoint._relLine,10,Math.PI/7,drawPointOps.size/2,startPointOps.color,4);
              _.each(lastPoint._relLine._arrows,a=>{
                map.addOverlay(a);
              });

              if(mainPath.length>1){
                mainPath[0].setOffset(new BMap.Size(-drawPointOps.size/2,-drawPointOps.size/2));
                mainPath[0].setContent(`<div style="background-color:${drawPointOps.color};width:${drawPointOps.size}px;height:${drawPointOps.size}px;line-height:${drawPointOps.size}px;text-align:center;border-radius:50%;color:white;"></div>`);
                mainPath[0]._relLine.setStrokeColor(drawPointOps.borderColor || drawPointOps.color);
              }
            }

            mainPath.unshift(lastPoint);
            
          });
          break;
        case 'Del':
          _.each(res.data,(d)=>{
            let point=mainPath.shift();
            map.removeOverlay(point);
            if(point._relLine){
              map.removeOverlay(point._relLine);
              
              _.each(point._relLine._arrows || [],a=>{
                  map.removeOverlay(a);
              });
            }
          });

          break;
      }
     
    },
    //播放器时间改变事件
    timeChange(start,end){
      end=parseInt(end);
      let res = this.getOptData(end,this.addData,this.unAddData,this.endTime,this.range);
      this.macPath(this.map,res,this.mainPath);
      
      //操作子MAC
      this.childMacDraw(end);
      
      this.endTime=end;

    },
    //根据结束时间得到添加的数据或者删除的数据
    getOptData(end,addData,unAddData,endTime,range){
      let data = [],s=this;
      if(end>endTime){//添加点

        let removeIndex=0;

        for(let i=0;i<unAddData.length;i++){
          let time =parseInt(unAddData[i].logtime || unAddData[i].primary.log_time);
          if(time>end){break;}
          data.push(unAddData[i]);
          addData.unshift(unAddData[i]);
          removeIndex++;
        }

        unAddData.splice(0,removeIndex);
        

        return {flag:'Add',data};
      }
      else if(end==parseInt(range[1])){//等于结束点
        data=tool.Clone(unAddData);
        
        for(let i=0;i<unAddData.length;i++){
          addData.unshift(unAddData[i]);
        }

        unAddData.splice(0,unAddData.length);
        return {flag:'Add',data};
      }
      else if(end==parseInt(range[0])){//等于起始点删除全部添加点
        data=tool.Clone(addData);
        for(let i=0;i<addData.length;i++){
          unAddData.unshift(addData[i]);
        }

        addData.splice(0,addData.length);
        return {flag:'Del',data};
      }
      else{//删除点
        let removeIndex=0;
        //获取删除点内容
        for(let i=0;i<addData.length;i++){
            let time =parseInt(addData[i].logtime || addData[i].primary.log_time);
            if(time<end){removeIndex=i;break;}
            data.push(addData[i]);
            unAddData.unshift(addData[i]);
            removeIndex++
        }

        addData.splice(0,removeIndex);


        return {flag:'Del',data};
      }
    },
    //执行子Mac路径绘画
    childMacDraw(end,count){
      let s=this;
      //获取最大的时间区间范围
      if(count==undefined){//已时间为基准
        let ranges = _.chain(this.childMac).pluck('range').value();
        let groupRange = _.zip(this._range,...ranges);
        let newRange=[_.min(groupRange[0]),_.max(groupRange[1])];
        if(newRange[0]+''!=this.range[0]+'' || newRange[1]+''!=this.range[1]+''){
          this.range=[_.min(groupRange[0]),_.max(groupRange[1])];
        }

        for(let key in s.childMac){
          let childMac=s.childMac[key];
          let res = this.getOptData(end,childMac.addData,childMac.unAddData,childMac.endTime,this.range);

          s.macPath(this.childMap,res,childMac.path,{size:15,color:'#ff0000'},{size:10,color:'green',borderColor:'#808080'},{size:20,color:'#0077b3'});
          childMac.endTime=end;
        }
      }else{//已数据为基准
        //获取数据最大的值
        let ds = _.chain(this.childMac).pluck('data').value();
        let maxData =_.max([this.mainMac,...ds],d=>d.length);
        if(maxData.length>this.i_mainMac.length){
          this.i_mainMac=tool.Clone(maxData);
        }

        for(let key in s.childMac){
          let childMac=s.childMac[key];
          let res = this.getCountData(count,childMac.addData,childMac.unAddData,childMac.data);

          s.macPath(this.childMap,res,childMac.path,{size:15,color:'#ff0000'},{size:10,color:'green',borderColor:'#808080'},{size:20,color:'#0077b3'});
        }
      }

    },
    //数据点播放器数据个数改变事件
    countChange(count){
      let res = this.getCountData(count,this.addData,this.unAddData,this.mainMac);

      this.macPath(this.map,res,this.mainPath);

      this.childMacDraw('',count);
    },
    //获取点添加的数据或者删除的数据
    getCountData(count,addData,unAddData,mainMac){
      let data=[],s=this;
      let addCount=addData.length;
      if(count==0){//清除所有删除点

        data=tool.Clone(addData);
        for(let i=0;i<addData.length;i++){
          unAddData.unshift(addData[i]);
        }

        addData.splice(0,addData.length);
        return {flag:'Del',data};

      }else if(count==mainMac.length){//添加所有点

        data=tool.Clone(unAddData);
        
        for(let i=0;i<unAddData.length;i++){
          addData.unshift(unAddData[i]);
        }

        unAddData.splice(0,unAddData.length);
        return {flag:'Add',data};

      }else if(count>addCount){//增加点

        let ac=count-addCount;
        for(let i=0;i<ac;i++){
          if(!unAddData[i])break;
          data.push(unAddData[i]);
          addData.unshift(unAddData[i]);
        }

        unAddData.splice(0,ac);

        return {flag:'Add',data};

      }else if(count<addCount){//删除点

        let dc=addCount-count;
        for(let i=0;i<dc;i++){
          if(!addData[i])break;
          data.push(addData[i]);
          unAddData.unshift(addData[i]);
        }

        addData.splice(0,dc);

        return {flag:'Del',data};
      }

      return {flag:''};
    }
  }
}
</script>


<style scoped lang="less">
  @import "../css/variables.less";
  .PeerTrack{width:100%;height:100%;background-color:white;}

  @leftW:300px;
  .PeerTrack .left_container{float:left;width:@leftW;height:100%;.border('right');}
  .PeerTrack .right_container{margin-left:@leftW;width:~'calc(50% - @{leftW}/2)';height:100%;position:relative;}
  
  .PeerTrack .right_container .TimerPlayerContainer{position:absolute;bottom:0px;left:0px;width:100%;padding:10px;}

  .PeerTrack .left_container .nav_item{margin:10px;border-top-left-radius:5px;border-top-right-radius:5px;.border('');overflow:hidden;text-align:left;}
  .PeerTrack .left_container .nav_item.open .title{.border('bottom');}

  .PeerTrack .childMac{float:right;width:~'calc(50% - @{leftW}/2)';height:100%;.border('left',@Font_Hover_Col);}

  @titleH:40px;
  .PeerTrack .left_container .nav_item .title{height:@titleH;line-height:@titleH;cursor:pointer;padding:0px 10px;font-size:14px;}
  .PeerTrack .left_container .nav_item .title:hover{background-color:@Font_Hover_Col;color:white;}

  .PeerTrack .left_container .nav_item .title .option_bar{float:right;}
  .PeerTrack .left_container .nav_item .title .option_bar .fa.active{color:@btn_Bg_Col_4;}

  .PeerTrack .left_container .nav_item .content{padding:10px;}
  .PeerTrack .left_container .nav_item .content .content_item{margin-bottom:10px;.border('bottom');}
  .PeerTrack .left_container .nav_item .content .content_item:last-child{margin-bottom:0px;}

  .PeerTrack .left_container .nav_item .content .content_item:hover{color:@Font_Hover_Col;cursor:pointer;.border('bottom',@Font_Hover_Col);}

  .PeerTrack .left_container .nav_item .content .content_item .info{float:right;width:~'calc(100% - 18px)';padding:0px 10px;}

  .test{
    height:400px;
    width:300px;
    border:5px solid;
    border-image: linear-gradient(-135deg,#547aab ,#6e4c96,#1e93ad) ;
    border-image-slice:2;
    border-image-width:1;
    background-image:linear-gradient(-45deg,#27405f ,#303666,#194862) ;

  }
</style>
