<!-- 处置方式组件 -->
<template>
    <div class="HandlerWay">
        <div class="HandlerWay_container">
            <Scroll :listen="data" ref="scroll">
                <div class="content_bar">
                    <div class="item" v-for="d in data">
                        <!--显示项-->
                        <div class="showItem">
                            {{d.content}}
                        </div>
                        <div style="diplay:table">
                            <div class="statue_bar">{{d.name}}</div>
                        </div>
                        
                        <div class="clearfix"></div>
                    </div>

                    <!--操作栏-->
                    <div class="option_bar" style="text-align:center;">
                        <button type="button" class="btn btn-primary">通过</button>
                        <button class="btn btn-default" type="submit">未通过</button>
                    </div>
                </div>
            </Scroll>
        </div>

        <!--未开始处置提示信息-->
        <div v-if="blnShowTip" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;z-index: 100;">
            <div style="display:table;width: 100%;height: 100%;">
                <div style="display: table-cell;vertical-align: middle;text-align: center;font-size:18px;color:gray;">
                     还未开始处置,剩余时间xx天xx小时
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import Scroll from 'components/scroll'

import {BODY_RESIZE} from '../../store/mutation-types'
export default {
  name: 'HandlerWay',
  components:{Scroll},
  data () {
    return {
      bodyResizeSub:null,
      blnShowTip:false,
      data:[
          {name:'通知',content:'系统已于2018年5月8日20:00:00时下发通知至 张三（138xxxxxxx）'},
          {name:'处置',content:'张三已于2018年5月9日20:00:00时开始处置'},
          {name:'回执',content:'张三已于2018年5月9日回执：该场所故障由设备进水导致，设备已损坏无法修复'},
          {name:'已完成',content:'张三已于2018年5月9日解决完成：设备已修复'},
          {name:'审核中',content:'系统已检测到场所数据恢复，处置完成'}
        ],
    
    }
  },
  mounted(){
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
        
    }
  }
}
</script>

<style scoped lang="less">
@import "../../css/variables.less";

.HandlerWay{width:100%;height:100%;padding:5px;position:relative;}
.HandlerWay_container{width:100%;height:100%;background-color:white;}

.HandlerWay_container .content_bar{padding-left:10px;position:relative;}
.HandlerWay_container .content_bar:before{
    content:'';
    position:absolute;
    top:0px;
    bottom:0px;
    width:4px;
    background:#cccccc;
    left:10px;
}

@minH:60px;
.HandlerWay_container .content_bar .item{min-height:@minH;margin-bottom:10px;}
.HandlerWay_container .content_bar .item .statue_bar{
    width:20px;font-weight:600;padding:0px 10px;height:@minH;
    display:table-cell;vertical-align:middle;position:relative;font-size:12px;
}
.HandlerWay_container .content_bar .item .statue_bar:before{
    content:'';
    position:absolute;
    top:0px;
    bottom:0px;
    left:0px;
    width:4px;
}

html{.TCol(~".HandlerWay_container .content_bar .item .statue_bar:before",'bg');}

.HandlerWay_container .content_bar .showItem{.border('');width:86%;float:right;padding:15px 10px;margin-right:20px;word-wrap: break-word;}

</style>
