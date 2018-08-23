<!-- 列表行插件 -->
<!--<template>
    <div class="table-row">
       <slot></slot>
    </div>
</template>-->
<script>
import Vue from 'vue'
export default {
  name: 'v-table-row',
  props:['columns','store'],
  data () {
    return {
      wDragStart:0,
      curDragHeaderW:null,//当前拖动列头宽度元素
      curDragHeader:null,//当前改变宽度大小的元素
      curDragHeaderIndex:-1,//当前改变宽度元素数据索引
    }
  },
  mounted(){
    
  },
  render(h){
     let columns=this.cols || [];
     let colContent=this.columns || [];
     let slots=_.filter(this.$slots.default,d=>d.tag);
     let fixWTotal=_.reduce(this.cols,(memo,d)=>{return memo+ (d.data.attrs || {width:0}).width},0);
     let autoCols=_.filter(this.cols,d=>!(d.data.attrs || {width:0}).width).length;
     
     
     return h('div',
        {
          class:{
            'table-row':true,
          },
          on:{
            //mousemove:colContent.length?this.mousemove:function(){},
            //mouseup:colContent.length?this.header_mouseup:function(){},
          }
        },
        columns.map((column,index)=>{
           
           
           let {width,title} =  this.cols[index].data.attrs || {};
           let curWidth=0;

           if(autoCols){//包含自适应列

            curWidth=width?width+'px':`calc(${100/autoCols}% - ${fixWTotal/autoCols}px)`; 
  
           }else{//所有列都是固定宽度则设置为百分比

            curWidth=width/fixWTotal*100 + '%';
           
           }
           
           if(colContent[index] || slots[index]){
             (colContent[index] || slots[index]).componentOptions.propsData={column:column}
           }

            
           return h('div',{
              'class':{'table-row-item':true},
              'style':{'width':curWidth},
              'attrs':{'title':title,'data-index':index},
              'on':{
                mousemove:colContent.length?this.header_mousemove:function(){},
                mousedown:colContent.length?this.header_mousedown:function(){},
              }
            },
            [
              colContent[index] || slots[index] || ''
            ]);
        })
    );
  },
  computed:{
    cols(){return this.store.states.columns;}
  },
  methods:{
    //判断鼠标是否进入的可拖动表头宽度的位置
    header_mousemove(e){
      let dom =$(e.target || e.srcElement),dragNum=5;//可拖拽的区间
      if(!dom.attr('class') || (dom.attr('class') && dom.attr('class').indexOf('table-column')<0)) return;
      let w=dom.width(),clientX=e.clientX,left=dom.offset().left;
      if(clientX>w+left || clientX<w+left-dragNum ){ dom[0].style.cursor='pointer'; return}; 
      dom[0].style.cursor='e-resize';

    },
    //拖动列头改变列头宽度
    header_mousedown(e,i){
        e.stopPropagation(); 
        let dom =$(e.target || e.srcElement);
        if(dom[0].style.cursor!='e-resize')return;
        this.blnlazy=false;
        this.blnDragColW=true;
        let parentDom=$(this.$el);
        let appendDom = $('<div></div>');
        appendDom.addClass('dragHeaderW');
        appendDom.css({'position':'absolute',
                      top:'0px',
                      bottom:'0px',
                      left:(e.clientX-parentDom.offset().left)+'px',
                      'background-color':'rgba(47,51,65,0.6)',
                      'width':'3px',
                      'z-index':100
                      });
          appendDom.appendTo(parentDom);
          this.wDragStart=e.clientX;
          this.curDragHeaderW=appendDom;
          this.curDragHeader=dom;

          return false;
    },
    //拖动列宽时响应事件
    mousemove(e){
      let parentDom=$(this.$el);
      //列头宽度拖动处理
      if(this.blnDragColW && this.curDragHeaderW && this.curDragHeader){
          let offset=this.curDragHeaderW.offset();
          let domSet=this.curDragHeader.offset();
          let move=e.clientX-parentDom.offset().left;
          let limit=domSet.left-parentDom.offset().left+20;

          this.curDragHeaderW.css({
              left:(move>limit?move:limit) +'px'
          });
          return  true;
      }

    },
    //拖动放开
    header_mouseup(e,w){
      this.blnDragColW=false;
      if(!this.curDragHeaderW)return;
      let width=this.curDragHeaderW.offset().left-this.curDragHeader.offset().left;
      let instances= width-this.curDragHeader.width(); //拖动距离
      let colIndex=parseInt(this.curDragHeader.parents('.table-row-item').attr('data-index'));


      if(this.cols[colIndex])this.cols[colIndex].data.attrs.width=width;

      if(this.cols[colIndex+1]){
        let relatievDom = $(this.$el).find(`div[class="table-row-item"][data-index="${colIndex+1}"]`);
        let relativeW=relatievDom.width();
        this.cols[colIndex+1].data.attrs.width=relativeW-instances;

      }else{
        let relatievDom = $(this.$el).find(`div[class="table-row-item"][data-index="${colIndex-1}"]`);
        let relativeW=relatievDom.width();
        this.cols[colIndex-1].data.attrs.width=relativeW-instances;

      }


      this.curDragHeaderW.remove();
      this.curDragHeaderW=null;
      this.curDragHeader=null;
     
    },
  }
}
</script>
<style scoped lang="less">
  @import './common.less';
  .table-row{height:@tableHeaderH;line-height:@tableHeaderH;}
  .table-row-item{float:left;height:@tableHeaderH;}
  .table-row-item:first-child{.border('bottom');.border('right');}
  .table-row-item:last-child{.border('bottom');}
  .table-row-item:not(:first-child):not(:last-child){.border('bottom');.border('right');}

  .table-header .table-row .table-column{color:white;}

</style>
