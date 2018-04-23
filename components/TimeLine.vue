<!-- 时间线组件 -->
<template>
    <div class="TimeLine">
        <Scroll :listen="data">
            <template v-for="(d,i) in data">
                    <div class="item" :class="{active:d.active==1,option:d.active==2}">
                        <div class="icon_container" :class="{first:i==0,last:i==data.length-1}">
                            <div class="icon"><span v-show="d.active!=2">{{i+1}}</span><i class="fa fa-check" v-show="d.active==2"></i></div>
                            <div class="line"></div>
                        </div>
                        <div class="info" :class="{first:i==0,last:i==data.length-1}">
                            <!--内容展示项-->
                            <div class="content">
                                <h5>{{statusVal[d.active || 0]}}</h5>
                                <div style="line-height:0px;font-size:12px;">{{d.name}}</div>
                            </div>
                        </div>
                    </div>
            </template>
        </Scroll>
    </div>
</template>

<script>
import {BODY_RESIZE} from '../store/mutation-types'
import Scroll from 'components/scroll'
let sly=null;
export default {
  name: 'TimeLine',
  props:['data'],
  components:{Scroll},
  data () {
    return {
      statusVal:['未开始','进行中','完成']
    }
  },
  watch:{
    
  },
  methods:{
     
  },
  mounted(){
    
  }
}
</script>

<style scoped lang="less">
    @import "../css/variables.less";
    .TimeLine{width:100%;height:100%;padding-top:15px;}
    @iconW:40px;
    @itemH:100px;
    .item{width:100%;height:@itemH;line-height:@itemH;padding:0px 10px;}

    .icon_container{width:@iconW;height:100%;float:left;position:relative;}
    .icon{position:absolute;color:white;width:@iconW;height:@iconW;background-color:@FontCol;border-radius:50%;top:(@itemH - @iconW)/2;z-index:100;line-height:@iconW;}
    .icon_container.first .icon{top:(@itemH - @iconW)/3}

    .icon_container.first.last .icon{top:(@itemH - @iconW)/3}

    .line{position:absolute;top:0px;bottom:0px;width:3px;background-color:@FontCol;left:(@iconW - 3px)/2}
    .icon_container.first .line{top:(@itemH - @iconW)/3}
    .icon_container.first.last .line{top:(@itemH - @iconW)/3}
    .icon_container.last .line{bottom:(@itemH - @iconW)/3*2}

    .info{margin-left:@iconW;height:100%;position:relative;}
    .content{left:20px;height:@itemH*.6;.border('',@FontCol);border-radius:5px;position:absolute;width:~'calc(100% - 20px)';top:(@itemH - @iconW)/3;}
    .content:before{
        content:'';
        height:0px; width:0px; float:left;
        border-right:5px solid @FontCol;
        border-top:5px solid transparent;
        border-bottom:5px solid transparent;
        position:absolute;
        left:-10px;
        top:50%;
        margin-top:-5px;
    }
    .info.first .content{top:(@itemH - @iconW - @itemH*.6/2)/3;}
    .info.first.last .icon{top:(@itemH - @iconW)/3}

    .item.active .icon_container .icon{background-color:@btn_Bg_Col_2;}
    .item.active .content{.border('',@btn_Bg_Col_2);}
    .item.active .content:before{border-right:5px solid @btn_Bg_Col_2;}

    .item.option .icon_container .icon{background-color:@Font_Hover_Col;}
    .item.option .content{.border('',@Font_Hover_Col);}
    .item.option .content:before{border-right:5px solid @Font_Hover_Col;}
</style>
