<!-- 多选下拉组件 -->
<template>
    <div class="MulDropDwon">
        <div class="icon" @mousedown.stop="blnShowDrop=!blnShowDrop;"><i class="fa fa-caret-down"></i></div>
        <div class="content" @mouseenter="mouseenter()" @mouseleave="mouseout()">
            <span v-if="data && data.length>0">已选择{{data.length}}项</span>
            <span v-if="data && data.length<=0">{{placeholder || ''}}</span>
        </div>
        <div class="drop_content" @mousedown.stop="" v-show="blnShowDrop">
            <slot></slot>
        </div>
        <div class="drop_sel" @mouseenter="mouseenter()" @mouseleave="mouseout()" v-show="blnShowSel && !blnShowDrop && !blnPure">
            <div class="item" v-for="(d,i) in data" :title="d[keyProp]">
                {{i+1}}.{{d[keyProp]}}
                <i class="fa fa-remove" style="float:right;margin-top:12px;cursor:pointer;position: absolute;top: 0px;right: 5px;" @click="del(d)"></i>
            </div>
        </div>
        <div class="clearfix"></div>
    </div>
</template>

<script>
export default {
  name: 'MulDropDwon',
  props:['data','keyProp','id','placeholder'],
  data () {
    return {
      blnShowDrop:false,
      blnShowSel:false,
      mousedownid:'',
      blnPure:true,//是否为简单的下拉框插件
    }
  },
  mounted(){
    this.mousedownid = Fx.SingleBind('mousedown',$('body'), (e)=> {e.stopPropagation();this.blnShowDrop=false;});
  },
  destroyed(){
    Fx.ClearBind('mousedown',$('body'),this.mousedownid);
  },
  methods:{
      mouseenter(){
        tool.DelayTrigger(()=>{
            this.blnShowSel=true;
        },this,300)
      },
      mouseout(){
        tool.DelayTrigger(()=>{
            this.blnShowSel=false;
        },this,300)
      },
      del(d){
        let index=_.findIndex(this.data,t=>{return t[this.id]==d[this.id]});
        this.data.splice(index,1);
      }
  }
}
</script>

<style scoped lang="less">
  @import "../css/variables.less";
  @height:34px;
  @col:rgb(192, 204, 218);
  .MulDropDwon {width:100%;.border('',@col);line-height:@height;border-radius:5px;position:relative;}

  @iconW:30px;
  .MulDropDwon .content{
      margin-left:0px;margin-right:@iconW;height:@height;font-size:12px;padding:0px 10px;
  }
  .MulDropDwon .icon{width:@iconW;height:100%;float:right;.border('left',@col);text-align:center;}
  .MulDropDwon .icon:hover{cursor:pointer;}

  .MulDropDwon .drop_sel:not(:empty),
  .MulDropDwon .drop_content{
      max-height:200px;
      overflow-y:auto;
      left:-1px;
      position:absolute;width:~'calc(100% - @{iconW} + 2px)';.border('',@col);border-bottom-left-radius:5px;border-bottom-right-radius:5px;
      background-color:white;z-index:100;
  }

  .MulDropDwon .drop_sel .item{text-align:left;padding:0px 10px;font-size:12px;.border('bottom',@col);overflow: hidden;word-break: keep-all;text-overflow: ellipsis;position: relative;    white-space: nowrap;}
  .MulDropDwon .drop_sel .item:last-child{border:none;}

  .drop_content >div{
      cursor:pointer;padding:0px 10px;
  }
  .drop_content > div:hover{color:white;}

  html{.TCol(~".drop_content > div:hover",'bg');}
</style>
