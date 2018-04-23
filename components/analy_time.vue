<!-- 同行分析时间轴组件 -->
<template>
    <div class="AnalyTime">
        <!--时间轴-->
       <div style="width:100%;position: absolute;padding:0px 20px;">
            <TimeSlider ref="timeSlider" :range="timeRange" @change="timeRangeChange" />
        </div>

        <div class="frame">
            <div class="slidee">
                <li class="timeItem" v-for="i in showData">
                    <div class="time_line"></div>
                    <div class="time_point">
                        <div class="triangle pulse tip">
                            <div class="data_item main">
                                <span style="margin-right:10px;">{{i.name}}</span><span>{{i.keyword}}</span>
                                <span style="position: absolute;right:20px;cursor:pointer;" @click="moreClick(i)"><i class="fa fa-bars" ></i></span>
                            </div>
                            <div class="data_item child" v-for="c in i.child">
                                <span style="margin-right:10px;">{{c.name}}</span><span>{{c.keyword}}</span>
                            </div>
                        </div>

                        <div class="time_tip">{{i.date}}</div>
                        <div class="place_name">
                            <el-tooltip class="item" effect="light" :content="i.address" placement="top">
                               {{i.placeName}}
                            </el-tooltip>
                        </div>
                    </div>
                </li> 
            </div>
        </div>
        <div class="scrollbar" v-show="blnShowScroll">
            <div class="handle"></div>
        </div>
    </div>
</template>

<script>
import TimeSlider from 'components/TimeSlider'
import {GetAnalyTaskData,GetAnalyTaskMore} from '../store/mutation-types'
import {taskObject} from '../enum/TaskType'
import {BODY_RESIZE} from '../store/mutation-types'
export default {
  name: 'AnalyTime',
  props:['taskid','store','moreAction'],
  components:{TimeSlider},
  data () {
    return {
      scrollIns:null,
      blnShowScroll:false,
      scrollDom:null,
      data:[],
      showData:[],
      timeRange:[0,0],//时间范围
      blnInitTime:false,
    }
  },
  watch:{
      showData(){
          this.$nextTick(()=>{
              this.reloadyScroll();
          })
      }
  },
  mounted(){
   this.$store=this.$store || this.store;
   //获取数据
   this.$store.dispatch(GetAnalyTaskData,{id:this.taskid || 1695200,limit:1000,skip:0}).then(res=>{
        if(!tool.msg(res,'','获取数据失败!'))return;
        let kind=_.find(taskObject,t=>t.val==res.biz_body.task_target_type);
        let index=0;

        this.data=_.map(res.biz_body.data,d=>{
            if(index==0){
                this.timeRange[1]=d.primary.log_time;
            }
            
            if(index==(res.biz_body.data.length-1)){
                this.timeRange[0]=d.primary.log_time;
            }
            index++;
            return {
                name:`主${kind.name}`,
                kindName:kind.name,
                keyword:d.primary.key,
                latitude:parseFloat(d.latitude),
                longitude:parseFloat(d.longitude),
                mid:d.mid,
                date:tool.DateByTimestamp(d.primary.log_time,'yyyy-MM-dd hh:mm:ss'),
                timestamp:d.primary.log_time,
                placeName:d.netbar_name || '',
                address:d.netbar_address || '',
                child:_.map(d.together,t=>{
                    return {
                        name:`从${kind.name}`,
                        keyword:t.key,
                        date:tool.DateByTimestamp(t.log_time,'yyyy-MM-dd hh:mm:ss'),
                        address:d.netbar_address || '',
                    }
                })
            }
        });

        this.showData=tool.Clone(this.data);
    });

   this.$nextTick(()=>{
      this.scrollDom=$(this.$el).find('div[class="scrollbar"]');
      this.scrollIns = new Sly($(this.$el).find('.frame'),{
            horizontal: 1,
            itemNav: "centered",
            dragContent: 1,
            scrollBy: 1,
            scrollBar:'.AnalyTime .scrollbar',
            dynamicHandle: 0,
            dragHandle: 1,
        });

      setTimeout(()=>{
            this.scrollIns.init();
            this.reloadyScroll();
      },0); 

      this.$store.commit(BODY_RESIZE,()=>{
            this.reloadyScroll();
      });
   });
  },
  methods:{
    //时间范围控件改变事件
    timeRangeChange(range){
        this.showData=_.filter(this.data,d=>{return range[0]<=d.timestamp && range[1]>=d.timestamp;});
    },
    //查看更多单击事件
    moreClick(d){
        if(!this.moreAction)return;
        this.moreAction(d);
    },
    //重新初始化Tiem
    reInitTime(){
      if(this.blnInitTime){return;}
      this.$refs.timeSlider.reInit();
      this.blnInitTime=true;
    },
    //重新计算滚动条高度
    reloadyScroll(){
      this.scrollIns.reload();
      this.blnShowScroll=this.scrollIns.rel.slideeSize-10>this.scrollIns.rel.frameSize;
      this.setScrollH();
      this.scrollIns.reload();
    },
    //设置滚动条高度
    setScrollH(){
      let scrollContainerH=this.scrollDom.width();
      let gap=(this.scrollIns.rel.slideeSize-this.scrollIns.rel.frameSize)*(this.scrollIns.rel.frameSize/this.scrollIns.rel.slideeSize);
      this.scrollDom.find('.handle').css('width',(scrollContainerH-gap)<20?20:(scrollContainerH-gap)+'px');
    },
    showTip(){
        this.$refs.timeSlider.showTip();
    },
    hideTip(){
        this.$refs.timeSlider.hideTip();
    }
  }
}
</script>
<style scoped lang="less">
  @import "../css/variables.less";
  @time_item_W:400px;
  .AnalyTime{width:100%;height:100%;position:relative;}

  .frame { width: 100%; height: ~"calc(100% - 10px)"; padding: 0; }
  .frame .slidee { margin: 0; padding: 0; height: 100%; list-style: none; }
  .frame .slidee li { float: left; margin: 0 0px 0 0; padding: 0; width: @time_item_W; height: 100%;position: relative;}
  .scrollbar { width: 100%; height: 10px; position: absolute;bottom:0px;cursor:pointer;}
  .scrollbar .handle {
        width: 100px; 
        height: 100%;
        background: #222;
    }

  @time_line_H:4px;
  @time_point:20%;
  @time_point_size:10px;
  @triangle_size:8px;
  .frame .slidee li .time_line{position:absolute;bottom:@time_point;width:100%;height:@time_line_H;background-color:@borderCol;}
  .frame .slidee li .time_point{
      position:absolute;width:@time_point_size;height:@time_point_size;border-radius:@time_point_size/2;background-color:@btn_Bg_Col_hover_1;
      left: ~"calc(50% - @{time_point_size}/2)";bottom: ~"calc(@{time_point} - @{time_point_size}/2 + @{time_line_H}/2 )";
  }

  .frame .slidee li .tip{
      .border('',@btn_Bg_Col_hover_1);color: white;padding: 0px 10px;border-radius: 5px;position:absolute;
      padding:5px 10px;width:@time_item_W/2+50px;
      left: ~"calc(50% - @{time_point_size}/2 - @{time_item_W}/4)";
      bottom:~"calc(100% + 20px)";
      color:@FontCol;font-size:12px;
  }

  .frame .slidee li .time_tip{
      white-space: nowrap;color:@FontCol;font-size:12px;position:absolute;
      bottom:~"calc(-100% - 20px)";left:-60px;
   }
  .frame .slidee li .place_name{
      white-space: nowrap;color:@FontCol;font-size:12px;position:absolute;
      bottom:~"calc(-100% - 50px)";left: -100px;width: 200px;text-align: center;}

  .frame .slidee li .tip .data_item{line-height:24px;}
  .frame .slidee li .tip .data_item.main{.border('bottom',@btn_Bg_Col_hover_1);}

  .frame .slidee li .triangle::before{
    content: '';
    border-left: @triangle_size solid transparent;
    border-right: @triangle_size solid transparent;
    border-top: @triangle_size solid @btn_Bg_Col_hover_1;
    position: absolute;
    bottom: -8px;
    left: @time_item_W/2/2 - @triangle_size/2;
  }
</style>
