<!-- 车船航班分析页面组件 -->
<template>
    <div class="ShipCar">

        <!--左边侧边框-->
      <div class="left_pop bound" :class="{active:blnShowHistoryPop}">
          <!--显示标签-->
          <div class="pop_lable" @click="blnShowHistoryPop=!blnShowHistoryPop">
            历史记录
          </div>
          <Scroll ref="historyPopScroll" >
            
          </Scroll>
      </div>

        <!--操作栏-->
        <div class="main" :style="{'margin-left':blnShowHistoryPop?'340px':'0px'}">
            <div class="option_bar">
                <div style="float:left;margin-top:2px;">
                 日期 <el-date-picker type="daterange"  placeholder="选择日期范围" style="width: 220px;display:inline-block;"></el-date-picker>
                </div>
                <div style="float:left;margin-top:2px;margin-left:10px;width:130px;">
                    <el-select  clearable placeholder="民族">
                        
                    </el-select>
                </div>
                <div style="float:left;margin-top:2px;margin-left:10px;width:200px;">
                    <el-input placeholder="身份筛选" /> 
                </div>

                <button type="button" class="btn btn-default" style="float:left;background-color:#20a1ff;color:white;margin-top:3px;margin-left:10px;" >
                    <span v-show="!blnSearch">分 析</span>
                    <i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i>
                </button>
            </div>
            <!--内容栏-->
            <div class="content">
                <!--图标显示区域-->
                <div class="chart_container">

                    <div class="item">
                        <div style="position:absolute;font-size:14px;font-weight:600;top:0px;left:40px;">每日进入人数趋势</div>
                        <div name="chartone" style="width:100%;height:100%;"></div>
                    </div>
                    <div class="item">
                        <div style="position:absolute;font-size:14px;font-weight:600;top:0px;left:40px;">每日离开人数趋势</div>
                        <div name="charttwo" style="width:100%;height:100%;"></div>
                    </div>
                </div>

                <!--内容显示区域-->
                <div class="content_container">
                    <div style="font-weight:600;font-size:14px;line-height:40px;">疑似群体</div>
                    <!--内容展示区域-->
                    <div class="info_conatienr">
                        <!--左边导航栏-->
                        <div class="left_nav">
                            <Scroll>
                                <div class="item">群体一</div>
                                <div class="item">群体一</div>
                            </Scroll>
                        </div>
                        <!--右边内容区域-->
                        <div class="right_container">
                            <Scroll>
                                <div class="person" v-for="p in persons">
                                    <div class="photo_container"><div class="photo"></div></div>
                                    <div class="info">
                                        <div class="item">张亮同</div>
                                        <div class="item">汉族</div>
                                        <div class="item">身份证&nbsp;&nbsp;500109198612122533</div>
                                        <div class="item fixitem divEllipsis">到达车站&nbsp;&nbsp;重庆菜园坝火车站</div>
                                        <div class="item">到达时间&nbsp;&nbsp;2018-2-3 10:11</div>
                                    </div>
                                </div>
                            </Scroll>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import echarts from  'echarts'
import Scroll from 'components/scroll'

import {BODY_RESIZE,GetNation} from '../store/mutation-types'
export default {
  name: 'ShipCar',
  components:{Scroll},
  data () {
    return {
      chartone:null,
      charttwo:null,
      persons:[1,2],
      blnShowHistoryPop:false,
      blnSearch:false,
    }
  },
  watch:{
    blnShowHistoryPop(){
        this.$nextTick(()=>{
            setTimeout(()=>{
                this.chartone.resize();
                this.charttwo.resize();
            },600);
        });
        
    }
  },
  mounted(){
    setTimeout(()=>{
        this.initChart();
        this.setChart();
    },200); 

    this.$store.commit(BODY_RESIZE,()=>{
        if(!this.chartone || !this.charttwo) return;
        this.chartone.resize();
        this.charttwo.resize();
    });
    
  },
  methods:{
    initChart(){
        this.chartone = echarts.init($(this.$el).find(`div[name="chartone"]`)[0]);
        this.charttwo = echarts.init($(this.$el).find(`div[name="charttwo"]`)[0]);
    },
    setChart(){
        let option = {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['意向','预购','成交']
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : ['周一','周二','周三','周四','周五','周六','周日']
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'成交',
                        type:'line',
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data:[10, 12, 21, 54, 260, 830, 710]
                    },
                    {
                        name:'预购',
                        type:'line',
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data:[30, 182, 434, 791, 390, 30, 10]
                    },
                    {
                        name:'意向',
                        type:'line',
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data:[1320, 1132, 601, 234, 120, 90, 20]
                    }
                ]
            };
    
    this.chartone.setOption(option);
    this.charttwo.setOption(option);
                    
    }
  }
}
</script>

<style scoped lang="less">
    @import "../css/variables.less";
    .ShipCar{width:100%;height:100%;padding:5px;background-color:white;position:relative;}

    .ShipCar .main{.trans();height:100%;}
    @optionH:40px;
    .ShipCar .option_bar{width:100%;height:@optionH;background-color:#d9d9d9;text-align:left;padding:0px 10px;}
    .ShipCar .content{width:100%;height:~'calc(100% - @{optionH})';.border('',#d9d9d9);}

    @contentH:380px;
    .ShipCar .content .chart_container{width:100%;height:~'calc(100% - @{contentH})';padding:20px;}
    .ShipCar .content .content_container{width:100%;height:@contentH;padding:10px 60px;text-align:left;}
    
    @step:30px;
    .ShipCar .content .chart_container .item{float:left;height:100%;width:~'calc(50% - @{step})';position:relative;}

    .ShipCar .content .chart_container .item:first-child{margin-right:@step;}

    .ShipCar .content .content_container .info_conatienr{width:100%;height:~'calc(100% - 40px)';.border('',#d9d9d9);}

    @navW:150px;
    .ShipCar .content .content_container .info_conatienr .left_nav{width:@navW;height:100%;float:left;}
    .ShipCar .content .content_container .info_conatienr .left_nav .item{line-height:30px;padding:0px 15px;}

    .ShipCar .content .content_container .info_conatienr .left_nav .item.active,
    .ShipCar .content .content_container .info_conatienr .left_nav .item:hover{cursor:pointer;background-color:@Font_Hover_Col;color:white;}

    .ShipCar .content .content_container .info_conatienr .right_container{margin-left:@navW;height:100%;.border('left',#d9d9d9);padding:10px;}

    .ShipCar .content .content_container .info_conatienr .right_container .person{
        width:330px;height:140px;.border('',#d9d9d9);border-radius:5px;display:inline-block;margin-right:15px;margin-bottom:15px;
    }

    @photoW:120px;
    .ShipCar .content .content_container .info_conatienr .right_container .person .photo_container{padding:10px 10px;width:@photoW;height:100%;float:left;}
    .ShipCar .content .content_container .info_conatienr .right_container .person .photo_container .photo{height:100%;width:100%;.border('',#d9d9d9);}

    .ShipCar .content .content_container .info_conatienr .right_container .person .info{margin-left:@photoW;height:100%;padding:10px;font-size:12px;}
    .ShipCar .content .content_container .info_conatienr .right_container .person .info .item{margin-bottom:8px;}
    .ShipCar .content .content_container .info_conatienr .right_container .person .info .fixitem{width:100%;}

    //左边侧边框
  @bgColor:fade(@HeaderBgCol,90%);
  @popW:300px;
  .ShipCar .left_pop{
    position:absolute;left:-@popW;top:14px;bottom:10px;z-index:100;width:@popW;background-color:@bgColor !important;
    border-top-right-radius:5px;border-bottom-right-radius:5px;color:white;text-align:left;
  }

  .ShipCar .left_pop.active{left:0px;}

  .ShipCar .left_pop .pop_lable{
    width:30px;position:absolute;top:50%;margin-top:-40px;
    background-color:@bgColor;color:white;
    font-size:12px;padding:10px 8px;border-top-right-radius:5px;border-bottom-right-radius:5px;
    right:-30px;
    cursor:pointer;.trans();
  }

  .ShipCar .left_pop .pop_lable:hover{background-color:@Font_Hover_Col;}

  .ShipCar .left_pop .item{font-size:12px;padding:10px;.trans();.border('bottom');}
  .ShipCar .left_pop .item:hover{background-color:@Font_Hover_Col;cursor:pointer;}
  .ShipCar .left_pop .item .child{margin-bottom:10px;}
  .ShipCar .left_pop .item .item_type{
    padding:2px 8px;position:relative;display:inline-block;
  }

  .ShipCar .left_pop .item.active .bottom_right:before,
  .ShipCar .left_pop .item.active .bottom_right:after,
  .ShipCar .left_pop .item.active .top_left:after,
  .ShipCar .left_pop .item.active .top_left:before,
  .ShipCar .left_pop .item:hover .bottom_right:before,
  .ShipCar .left_pop .item:hover .bottom_right:after,
  .ShipCar .left_pop .item:hover .top_left:after,
  .ShipCar .left_pop .item:hover .top_left:before{background:@bgColor;}
</style>


