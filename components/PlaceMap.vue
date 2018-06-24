<!-- 场所地图展示组件 -->
<template>
    <div class="PlaceMap">
        <div :id="id"></div>
    </div>
</template>

<script>

import bmap from '../../static/BaiduMap.js'
import Vue from 'vue'
import cInput from './Input'
import PlaceSearchTable from './PlaceSearchTable'
import {mapState} from 'vuex'
import {GetSitesInfoByInfo,BODY_RESIZE} from '../store/mutation-types'

export default {
  name: 'PlaceMap',
  props:['data'],
  data () {
    return {
      bodyResizeSub:null,
      id:'',//地图布局dom唯一标识符
      map:null,//地图控件对象
      searchVal:'',//场所查询条件
      Input_ins:null,//搜索输入框实例对象
      Table_ins:null,//查询内容列表实例对象
      marker_html:`<div class="c_triangle pulse" style="background-color:rgb(0, 204, 102);color: white;padding: 0px 10px;border-radius: 5px;min-width:140px;padding:5px 10px;">
                    {0}
                  </div>`,
      marker_triangle_html:`<div class="triangle pulse" style="background-color:rgb(0, 204, 102);color: white;padding: 0px 10px;border-radius: 5px;min-width:140px;padding:5px 10px;">
                   {0}
                  </div>`,
      marker_style:{
        fontSize : "12px",
        lineHeight : "20px",
        fontFamily:"微软雅黑",
        fontWeight:'600',
        border:'0px solid black',
        'background-color':'transparent',
        'max-width':'none'
      },
      blnPath:false,//是否画路径
      detail_data:{test:1,adc:2,test1:1,adc1:2,test2:1,adc2:2,test3:1,adc3:2,test4:1,adc4:2},//详细信息数据
      orderFields:[{name:'测试',key:'test'},
                   {name:'大度',key:'adc'},
                   {name:'大度',key:'test1'},
                   {name:'大度',key:'adc1'},
                   {name:'大度',key:'test3'},
                   {name:'大度',key:'test2'},
                   {name:'大度',key:'test3'},
                   {name:'大度',key:'adc2'},
                  ],
      detailScrollDom:null,//详细框滚动条dom元素
      detailscrollIns:null,//详细框滚动条插件对象
    }
  },
  watch:{
      searchVal(){
           let self=this;
           this.Input_ins.$data.blnLoad=true;
           this.$store.dispatch(GetSitesInfoByInfo,{condition:self.searchVal, types:'3'}).then(function (code) {
               self.Input_ins.$data.blnLoad=false;
               self.Table_ins.$data.data=code.sites || [];
           });
      },
      detail_data(){
          this.$nextTick(()=>{
            this.reloadydetailScroll();
          });
      }
  },
  computed:{
    ...mapState(['Rx'])
  },
  mounted(){
    this.id='place_map_' + Fx.guid();
    this.$nextTick(()=>{
        let child = $('#'+this.id);
        let parent = child.parents('div');
        child.css({height:parent.height()+'px',width:parent.width()+'px'});

        this.initMap();
    });

    //监听页面大小改变事件
    // this.$store.commit(BODY_RESIZE,()=>{
    //     let child = $('#'+this.id);
    //     let parent = child.parents('div');
    //     child.css({height:parent.height()+'px',width:parent.width()+'px'});
    // });

    this.$store.commit(BODY_RESIZE,{cb:(sub)=>{
       this.bodyResizeSub=sub
    },sub:()=>{
      let child = $('#'+this.id);
      let parent = child.parents('div');
      child.css({height:parent.height()+'px',width:parent.width()+'px'});
    }});

  },
  beforeDestroy(){
    this.bodyResizeSub.unsubscribe();
  },
  methods:{
    //初始化地图插件
    initMap(){
        let self=this;
        //bmap.SetBaiduMapPos(116.404, 39.915,4);
        bmap.initComplete((pos,map)=>{
            self.map=map;
            self.addSearchPlace();
            self.addPlaceDetail();
            self.complieTable();
        });

        bmap.addEvent('zoomend',function(map,ScaleControl){
            if(!self.blnPath){
                map.clearOverlays();
            }
        });

        this.addData();
    },
    //添加数据
    addData(){
        var MAX = 10;
        var pos = [];
        var pt = null;
        var i = 0;
        let self=this;
        for (; i < MAX; i++) {
            pt = new BMap.Point(Math.random() * 40 + 85, Math.random() * 30 + 21);
            pos.push(pt);
        }
        this.data=pos;
        bmap.BaiduMap(this.id,false,false,true,false,this.data);
        
        if(!this.blnPath){//描点
            bmap.AddRP(pos,'',this.marker_style,{mouseover(point){
                let data = _.find(self.data,(item)=>{return item.lat==point.lat && item.lng==point.lng;});
            }});
        }else{//画路径
            bmap.AddPath(pos,{mouseover(point){
                let data = _.find(self.data,(item)=>{return item.lat==point.lat && item.lng==point.lng;});
                console.log(data);
            }});
        }

        //添加地图页面拖动事件监听
        bmap.DragListen(()=>{console.log(2);});
    },
    //添加场所详细内容框
    addPlaceDetail(){
        $('#'+this.id).append(`
            <div class="map_place_pop" style="position:absolute;left:0px;bottom:0px;width:400px;height:300px;">
                 <div class="map_detail_item">
                    <div class="slidee">
                        <div id="map_detail_item"></div>
                    </div>
                 </div>
                 <div name="scrollBar" class="scrollbar" style="display:none;">
                    <div class="handle"></div>
                </div> 
                 <div class="map_detail_item_title">详细信息</div> 
            </div>
        `);

        //编译详细内容
        var res = Vue.compile(`
            <div class="detail_content_item_content">
                <div class="detail_content_item_content_item" v-for="item in fields">
                    <div class="title">{{item.name}}</div><div class="info">{{data[item.alias] || data[item.key]}}</div>
                </div>
            </div>
        `);
        this.detailScrollDom=$('div[class="map_place_pop"] > div[name="scrollBar"]');
        let self=this;
        detailComp= new Vue({
            data:{data:self.detail_data,fields:self.orderFields},
            render: res.render,
            staticRenderFns: res.staticRenderFns
        });
        

        detailComp.$mount($('#'+this.id).find('#map_detail_item')[0]);

        this.$nextTick(()=>{
            this.initdetailScroll();
        });
    },
     //初始化详细滚动条
     initdetailScroll(){
        this.detailscrollIns = new Sly($('.map_place_pop .map_detail_item'),{
            speed:200,
            scrollBy:50,
            scrollBar:'.map_place_pop .scrollbar',
            dynamicHandle: 0,
            dragHandle: 1,
            mouseDragging: 0});
        
        setTimeout(()=>{
                this.detailscrollIns.init();
                this.reloadydetailScroll();
        },0); 
    },
    //重新计算详细菜单滚动条高度
    reloadydetailScroll(){
      this.detailscrollIns.reload();
      let blnShowScroll=this.detailscrollIns.rel.slideeSize>this.detailscrollIns.rel.frameSize;
      if(blnShowScroll){
          this.detailScrollDom.show();
      }else{
          this.detailScrollDom.hide();
      }
      this.setdetailScrollH();
      this.detailscrollIns.reload();
    },
    //设置详细滚动条高度
    setdetailScrollH(){
      let scrollContainerH=this.detailScrollDom.height();
      let gap=(this.detailscrollIns.rel.slideeSize-this.detailscrollIns.rel.frameSize)*(this.detailscrollIns.rel.frameSize/this.detailscrollIns.rel.slideeSize);
      this.detailScrollDom.find('.handle').css('height',(scrollContainerH-gap)<20?20:(scrollContainerH-gap)+'px');
    },
    //添加场所搜索框
    addSearchPlace(){
        $('#'+this.id).append(`
            <div style="position:absolute;right:0px;">
                <div class="map_search_item">
                    <div id="placeSearchOption"></div>
                    <div id="placeSearchTable" style="max-height:300px;"></div>
                </div>
            </div>
        `);

        this.Input_ins = this.complieInput();
        this.Input_ins.$mount($('#'+this.id).find('#placeSearchOption')[0]);
    },
    //编译VUE(Input插件)
    complieInput(){
        let self=this;
        let subJect=(new self.Rx.Subject()).debounce(() => self.Rx.Observable.interval(300));
        subJect.subscribe((val)=>{
           self.Table_ins.$data.data=null;
           self.searchVal=val;
        });

        var res = Vue.compile(`<cInput label="编号/拼音/字母" @change="change" :blnLoad="blnLoad" />`);
        return tempV= new Vue({
            data:{blnLoad:false},
            methods:{
                change(val){
                    subJect.next(val);
                }
            },
            components:{cInput},
            render: res.render,
            staticRenderFns: res.staticRenderFns
        });
    },
    //编译查询结果列表数据
    complieTable(data){
        let map=this.map,self=this;
        var res = Vue.compile(`<PlaceSearchTable :data="data" @rowClick="rowClick" />`);

        this.Table_ins= new Vue({
            data:{data:data},
            components:{PlaceSearchTable},
            methods:{
                rowClick(val){
                    //bmap.AddLabel(self.data[0],Fx.format(self.marker_triangle_html,self.posSearchHtml(self.data[0])),self.marker_style,{left:-70,top:-130},false,true,true)
                     self.detail_data=val;
                     bmap.AddLabel(self.data[0],'',self.marker_style,{left:-70,top:-130},false,true,true)
                }
            },
            render: res.render,
            staticRenderFns: res.staticRenderFns
        });

        this.Table_ins.$mount($('#'+this.id).find('#placeSearchTable')[0]);
    },
    //场所显示信息格式
    //构造定位搜索后显示html
    posSearchHtml(data){
        var result='';
        var template='<div>{0}&nbsp;&nbsp;:&nbsp;&nbsp;{1}</div>';
        result+=Fx.format(template,'全称',data.title || '');
        result+=Fx.format(template,'地址',data.address || '');
        result+=Fx.format(template,'电话',data.tel || '');
        result+=Fx.format(template,'在线上网人员','('+(data.onlinepeoplecount || 0)+'&nbsp;人)');

        return result;
    }
  }
}
</script>
<style lang="less">
    @import "../css/variables.less";
    @borderCol:#0c6;
    .map_search_item{
        width:500px;
        background-color:white;
        border: 3px solid @borderCol;
        border-radius: 5px;
        box-shadow: 0 1px 4px rgba(0,0,0,.2);
    }

    //场所详细信息框
    .map_detail_item{
        width:400px;
        height:300px;
        background-color:white;
        border: 3px solid @borderCol;
        border-radius: 5px;
        box-shadow: 0 1px 4px rgba(0,0,0,.2);
    }
    .map_place_pop .map_detail_item_title{
        width:30px;position:absolute;right:-20px;border: 3px solid @borderCol;
        right: -30px;
        top: 100px;
        border-left: none;
        padding: 10px 0px;
        text-align: center;
        background: white;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        cursor:pointer;
    }

    .map_detail_item .detail_content_item_content_item{height: 30px;line-height: 30px;}
    .map_detail_item .detail_content_item_content_item .title{width: 150px;float: left;height: inherit;text-align: center;.border('bottom',@FontCol);}
    .map_detail_item .detail_content_item_content_item .info{margin-left: 150px;margin-right: 0px;height: inherit;padding-left: 10px;.border('left',@FontCol);.border('bottom',@FontCol);}

    .PlaceMap .BMap_scaleCtrl{left:auto !important;right:20px !important;}

    //下拉框样式
    .map_place_pop .map_detail_item{width:100%;height:100%;position: relative;}
    .map_place_pop .map_detail_item:hover {cursor:pointer;}
    .map_place_pop .scrollbar { border:1px solid @borderCol;border-radius:5px;width: 10px; height: ~"calc(100% - 20px)"; position: absolute;right: 5px;top: 0px;background:white;margin-top:10px;}
    .map_place_pop .scrollbar .handle {width: 100%;height: 100px;background: @btn_Bg_Col_1;}

    .blnPage .scrollbar{display:block;}

</style>

<style scoped lang="less">
    .PlaceMap{height:100%;width:100%;}
</style>
