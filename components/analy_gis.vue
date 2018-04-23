<!-- 同行分析GIS页面组件 -->
<template>
    <div class="AnalyGis" id="AnalyGis">
    </div>
</template>

<script>
import {GetAnalyTaskData,GetAnalyTaskMore} from '../store/mutation-types'
import {taskObject} from '../enum/TaskType'

export default {
  name: 'AnalyGis',
  props:['taskid','blnNoLoad','store','moreAction'],
  data () {
    return {
        map:null,
        data:[],
    }
  },
  watch:{
    data(){
    
    }
  },
  mounted(){
    this.$store=this.$store || this.store;
    if(this.blnNoLoad)return;
    //获取数据
    this.$store.dispatch(GetAnalyTaskData,{id:this.taskid || 1695200,limit:1000,skip:0}).then(res=>{
        if(!tool.msg(res,'','获取数据失败!'))return;
        let kind=_.find(taskObject,t=>t.val==res.biz_body.task_target_type);
        
        let data=_.map(res.biz_body.data,d=>{
            return {
                name:`主${kind.name}`,
                netbar_name:d.netbar_name,
                kindName:kind.name,
                keyword:d.primary.key,
                latitude:parseFloat(d.latitude),
                longitude:parseFloat(d.longitude),
                mid:d.mid,
                date:tool.DateByTimestamp(d.primary.log_time,'yyyy-MM-dd hh:mm:ss'),
                address:d.netbar_title,
                child:_.map(d.together,t=>{
                    return {
                        name:`从${kind.name}`,
                        keyword:t.key,
                        date:tool.DateByTimestamp(t.log_time,'yyyy-MM-dd hh:mm:ss'),
                        address:d.netbar_title,
                    }
                })
            }
        });

        //去重
        let s=this;
        for(let i=0;i<data.length;i++){
            if(_.findIndex(s.data,d=>d.netbar_name==data[i].netbar_name)>=0)continue;
            s.data.push(data[i]);
        }
    });
  },
  methods:{
      init(){
          if(this.data.length<=0)return;
          this.map = new BMap.Map($(this.$el)[0],{minZoom:7,maxZoom:18});
          this.map.centerAndZoom(new BMap.Point(this.data[0].longitude,this.data[0].latitude),11);
          this.map.enableScrollWheelZoom(true);
          for(let i=0;i<this.data.length;i++){
            this.addMarker(new BMap.Point(this.data[i].longitude,this.data[i].latitude),this.data[i]);
          }
      },
      //增加遮罩描点
      addMarker(pos,item){
          if(!item)return;
          var marker_style={
                fontSize : "12px",
                lineHeight : "20px",
                fontFamily:"微软雅黑",
                fontWeight:'600',
                border:'0px solid black',
                'background-color':'transparent',
                'max-width':'none'
          };

          let childHtml=_.map(item.child || [],child=>{
              return `<div class="data_item child"><span style="margin-right:10px;">${child.name}</span><span>${child.keyword}</span></div>`
          }).join('');
          
          let moreId='more_'+tool.guid();
          let labelHtml=`<div class="analy_gis_map">
                            <i class="fa fa-map-marker"></i>
                            <div class="triangle pulse tip">
                                <div class="data_item main">
                                    <span style="margin-right:10px;">${item.name}</span><span>${item.keyword}</span>
                                    <span style="position: absolute;right:20px;"><i class="fa fa-bars" id="${moreId}" ></i></span>
                                </div>
                                ${childHtml}
                            </div>
                        </div>`;
          var label= new BMap.Label(labelHtml,{position:pos || _CurPos, offset:new BMap.Size(0, 0)});
		  label.setStyle(marker_style || {});
		  this.map.addOverlay(label);
          
          //添加显示名称字段
          var nameLabel= new BMap.Label(`<div style="width:300px;text-align:center;">
                                            <div>${item.netbar_name}</div>
                                            <div>${item.date}</div>
                                         </div>`,
                                         {position:pos || _CurPos, offset:new BMap.Size(-140, 20)});
		  nameLabel.setStyle(marker_style || {});
		  this.map.addOverlay(nameLabel);

          //注册单击事件
          (function(data,i){
           // console.log(i.moreAction);
           setTimeout(()=>{
            $(`#${moreId}`).click(function(){
                if(!i.moreAction){return;}
                i.moreAction(item);
            });
           },0);
          })(item,this);
      }
  }
}
</script>
<style lang="less">
    @import "../css/variables.less";
    @time_item_W:400px;
    @time_point_size:10px;
    @triangle_size:8px;
    .analy_gis_map .fa-map-marker{font-size:24px;color:@btn_Bg_Col_hover_1;}

    .analy_gis_map .tip{
        .border('',@btn_Bg_Col_hover_1);color: white;padding: 0px 10px;border-radius: 5px;position:absolute;
        padding:5px 10px;min-width:@time_item_W/2+50px;
        left: ~"calc(50% - @{time_point_size}/2 - @{time_item_W}/4)";
        bottom:~"calc(100% + 20px)";
        color:@FontCol;font-size:12px;
        background-color:@BgCol;
    }

    .analy_gis_map .tip .data_item{line-height:24px;}
    .analy_gis_map .tip .data_item.main{.border('bottom',@btn_Bg_Col_hover_1);}

    .analy_gis_map .triangle::before{
        content: '';
        border-left: @triangle_size solid transparent;
        border-right: @triangle_size solid transparent;
        border-top: @triangle_size solid @btn_Bg_Col_hover_1;
        position: absolute;
        bottom: -8px;
        left: @time_item_W/2/2 - @triangle_size/2;
    }

</style>
<style scoped lang="less">
  @import "../css/variables.less";

  .AnalyGis{width:100%;height:100%;}

</style>
