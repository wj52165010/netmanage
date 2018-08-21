<!-- 列表列拖动组件 -->
<template>
    <div :id="id" class="TableDrag" @mouseup="mouseup($event)" @mousemove="mousemove($event)">

        <div class="Slide" :class="{allShow:!blnShowScroll}" :style="{width:blnShowVscorll?`calc(100% - 20px - ${fixColumn.option.length>0?fixColW:0}px)`:`calc(100% - ${fixColumn.option.length>0?fixColW:0}px)`}">
            <div class="slidee">
                <div class="line li" :class="{activLine:curLineIndex==0 && curDragIndex+1!=curLineIndex && curDragIndex!=curLineIndex}"></div>
                <template v-for="(d,i) in _columns">
                    <div class="item li li_header" @mouseover="hoverHeaderIndex=i" @mouseout="hoverHeaderIndex=-1"  @mousemove="header_mousemove($event)" @mousedown.stop="header_mousedown($event,i)" @mouseup="header_mouseup($event)" :class="{dragging:curDragIndex==i,noShow:d.blnShow,'hover_header':hoverHeaderIndex>=0 && hoverHeaderIndex==i}" :style="{width:(d.width || '')+'px'}">
                        <div class="header" :class="{active_header:curHeaderActiveIndex==i}" @click="headerClick(d,i)" @mousedown="mousedown($event,i)" @mouseup="mouseup($event)">{{d.showName || d.name}}</div>
                        <!--操作栏-->
                        <div class="option_bar" v-if="!blnShow">
                            <div class="option_item"  v-for="h in (headerBtns || [])" 
                                                      :style="{width:(headerBtns || []).length>0?100/(headerBtns || []).length+'%':'0px'}"
                                                      @click="headeBtnClick(h,d)"  
                                                      >
                                <el-tooltip 
                                            style="width:100%;height:100%;"
                                            effect="light"  
                                            :content="h.name" 
                                            placement="top"
                                            >
                                <i :class="h.icon"></i>
                                </el-tooltip>
                            </div>
                        </div>
                    </div>
                    <div class="line li" 
                    :class="{
                        activLine:curLineIndex==i+1 && curDragIndex+1!=curLineIndex && curDragIndex!=curLineIndex,
                        transLine:fixColumn.option.length>0 && (_columns.length==i+1)
                    }">
                        <i class="fa fa-caret-down"></i>
                        <i class="fa fa-caret-up"></i>
                    </div>
                </template>
                <!--内容项-->
                <div class="content">
                    <div>
                        <div class="content_row" v-for="d in data">
                            <div style="width:1px;height:100%;"></div>
                            <template v-for="(c,i) in _columns">
                                <div class="item li li_row" :class="{'hover_header':hoverHeaderIndex>=0 && hoverHeaderIndex==i}" style="margin-right:1px;" :style="{width:(c.width || '')+'px'}">
                                    <div class="column" :class="{}">{{d[c.key]}}</div>
                                </div>
                            </template>
                            <div class="clearfix"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--固定列容器-->
        <div class="fix_container" v-show="fixColumn.option.length>0" :style="{right:blnShowVscorll?'20px':'0px',bottom:blnShowScroll?'20px':'0px',width:fixColW+'px'}">
            <div class="fix_item" style="cursor:pointer;" @click="fixHeaderClick()">
                <div class="header" :class="{active_header:curHeaderActiveIndex==_columns.length}">{{fixColumn && fixColumn.name}}</div>
            </div>
            <!--固定列列表内容容器-->
            <div class="fix_content_container">
                <div>
                    <div class="fix_row_item" v-for="d in data" :class="{}">
                        <span v-for="b in fixColumn.option" class="item">
                            <el-tooltip effect="light" :content="b.name" placement="top">
                                <i :class="b.icon" v-if="b.icon"></i><span v-if="!b.icon">{{b.name}}</span>
                            </el-tooltip>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <!--固定列宽度测试-->
        <div name="fix_column_w" class="fix_column_w" style="position:absolute;z-index:100;color:transparent;">
            <span v-for="b in fixColumn.option" class="item">
                <el-tooltip effect="light" :content="b.name" placement="top">
                    <i :class="b.icon" v-if="b.icon"></i><span v-if="!b.icon">{{b.name}}</span>
                </el-tooltip>
            </span>
        </div>

        <!--水平滚动条-->
        <div class="scrollbar_container"  v-show="blnShowScroll">
            <div name="scrollBar" class="scrollbar" v-show="blnShowScroll">
                <div class="handle"></div>
            </div>
        </div> 
        <!--垂直滚动条-->
        <div class="v_scrollbar_container"  v-show="blnShowVscorll">
            <div name="vscrollBar" class="scrollbar" v-show="blnShowVscorll">
                <div class="handle"></div>
            </div>
        </div> 
    </div>
</template>

<script>
import {BODY_RESIZE} from '../store/mutation-types'
export default {
  name: 'TableDrag',
  props:['store','fields','btns','data','selIndex','blnShow','headerBtns'],
  components:{},
  data () {
    return {
      bodyResizeSub:null,
      hoverHeaderIndex:-1,//鼠标悬浮列头索引
      blnSwitchHeader:false,
      id:0,
      sly:null,//水平滚动条
      vsly:null,//垂直滚动条
      fsly:null,//固定列滚动条
      scrollDom:null,
      vscrollDom:null,
      blnShowScroll:false,
      blnShowVscorll:false,
      curDragIndex:-1,
      dragStart:0,
      wDragStart:0,
      curInsertDom:null,
      curLineIndex:-1,
      curHeaderActiveIndex:-1,//当前活动头部列索引
      blnlazy:false,
      blnDragColW:false,//是否为拖动列头改变宽度
      curDragHeaderW:null,//当前拖动列头宽度元素
      curDragHeader:null,//当前改变宽度大小的元素
      curDragHeaderIndex:-1,//当前改变宽度元素数据索引
      cw:0,
      columns:[
        //   {name:1,width:0},
        //   {name:2,width:0},
        //   {name:3,width:0},
        //   {name:4,width:0},
        //   {name:5,width:0},
        //   {name:6,width:0},
        //   {name:7,width:0},
        //   {name:9,width:0},
        //   {name:5,width:0},
        //   {name:6,width:0},
        //   {name:7,width:0},
        //   {name:7,width:0},
        //   {name:9,width:0},
        //   {name:5,width:0},
        //   {name:6,width:0},
        //   {name:7,width:0},
       
      ],
      fixColumn:{name:'操作',option:[]},
      fixColW:80,//固定列宽度
    }
  },
  computed:{
      _columns(){
          let containerW=this.cw,data=tool.Clone(this.columns);
          let remainW=_.reduce(data, function(memo, num){  return memo + parseInt(num.width || 0); }, 0);
          let autoCol=_.filter(data,d=>!d.width);
          if(autoCol.length>0){
            let w=containerW-remainW-data.length-1-(this.blnShowVscorll?20:0)-(this.fixColumn.option.length>0?this.fixColW:0);
            let autoW=w/autoCol.length;
          
            for(let i=0;i<autoCol.length;i++){
                autoCol[i].width=parseInt(autoW) <60 ?100:parseInt(autoW);
                if(i==autoCol.length-1){
                    let lastW=w-(autoCol.length-1)*parseInt(autoW);
                    autoCol[i].width=lastW<0?100:lastW;
                }
            }
            
            return data;
          }else{
              return data;
          }

        return this.columns;
      }
  },
  watch:{
      btns(){
          this.fixColumn.option=this.btns || [];
      },
      fields(){
         this.$nextTick(()=>{
            this.columns=this.fields;
         });
      },
      columns(){
        this.sly.reload();
        this.vsly.reload();
        this.$nextTick(()=>{
            this.reloadyScroll();
        });
      },
      blnShowScroll(){
        this.sly.reload();
        this.$nextTick(()=>{
            this.reloadyScroll();
        });
      },
      blnShowVscorll(){
        this.vsly.reload();
        this.$nextTick(()=>{
            this.reloadyScroll();
        });
      },
      _columns(){
        if(this.sly){this.sly.reload();}
        if(this.vsly){this.vsly.reload();}
        this.$nextTick(()=>{
            this.reloadyScroll();
        });
      },
      fixColumn:{
        deep: true,
        handler: function (val, oldVal) {
            setTimeout(()=>{
                this.fixColW=$(this.$el).find('div[name="fix_column_w"]').width()+20;

                if(this.sly){this.sly.reload();}
                if(this.vsly){this.vsly.reload();}
                if(this.fsly){
                    this.fsly.reload();
                    this.fsly.slideTo(this.vsly.pos.dest);
                }
                this.$nextTick(()=>{
                    this.reloadyScroll();
                });
            },300);
        }
      },
      selIndex(){
        this.curHeaderActiveIndex=this.selIndex==undefined?-1:(this.selIndex-1)<0?this.selIndex:this.selIndex-1;   
      }
  },
  mounted(){
    let s=this;
    this.$store=this.$store || this.store;
    this.fixColumn.option=this.btns || [];
    this.id="scroll"+tool.guid();
    this.cw=$(this.$el).width(); 
    this.curHeaderActiveIndex=this.selIndex==undefined?-1:(this.selIndex-1)<0?this.selIndex:this.selIndex-1;   
    
    this.$nextTick(()=>{
        this.scrollDom=$('#'+this.id).find('div[name="scrollBar"]');
        this.sly=new Sly($(this.$el).find('.Slide'),{
            horizontal: 1,
            itemNav:'basic',
            speed:300,
            mouseDragging: 1,
            scrollBar:`#${s.id} .scrollbar_container .scrollbar`,
            dragHandle: 1,
            startAt: 0,
            scrollBy: 1,
            itemSelector:'.li'
        });
        this.sly.init();
        
        //初始化垂直滚动条

        this.vscrollDom=$('#'+this.id).find('div[name="vscrollBar"]');
        this.vsly = new Sly($(this.$el).find('.content'),{
            speed:200,
            scrollBy:50,
            dynamicHandle: 0,
            dragHandle: 1,
            scrollBar:`#${s.id} .v_scrollbar_container .scrollbar`,
            mouseDragging: 0
        });
        this.vsly.init();

        this.vsly.on('change',e=>{
           if(!this.fsly)return;
           this.fsly.slideTo(this.vsly.pos.dest);
        });

        this.reloadyScroll();

        //初始化固定列滚动条
        this.fsly= new Sly($(this.$el).find('.fix_content_container'),{
            speed:200,
            scrollBy:50,
            dynamicHandle: 0,
            dragHandle:0,
            mouseDragging: 0
        });

        setTimeout(()=>{
            this.fsly.init();
            this.fsly.on('change',e=>{
                if(!this.vsly)return;
                this.vsly.slideTo(this.fsly.pos.dest);
            });
        },0);

        // this.$store.commit(BODY_RESIZE,()=>{
        //     this.layout();
        // });

        this.$store.commit(BODY_RESIZE,{cb:(sub)=>{
            this.bodyResizeSub=sub
        },sub:()=>{
            this.layout();
        }});

        this.columns=this.fields;
    });
  },
  beforeDestroy(){
    this.bodyResizeSub.unsubscribe();
  },
  methods:{
      headeBtnClick(d,f){
        if(!d.action) return;
        d.action(f);
      },
      layout(){
        this.cw=$(this.$el).width();
        this.sly.reload();
        this.vsly.reload();
        this.fsly.reload();
        this.reloadyScroll();
      },
      //禁止列头切换
      blnDisableHeader(){this.blnSwitchHeader=true;},
      //头部列单击事件
      headerClick(d,i){   
        this.$emit('headerClick',d,i);
        if(this.blnSwitchHeader){this.blnSwitchHeader=false; return;}
        this.curHeaderActiveIndex=i;
        //this.fixColumn.option.push('1');
      },
      //头部固定列(操作栏头部单击事件)
      fixHeaderClick(){
        this.curHeaderActiveIndex=this._columns.length;
        this.$emit('fixHeaderClick');
      },
      mousedown(e,i){
        let dom =$(e.target || e.srcElement);
        if(!dom) return;
        let parentDom=$(this.$el);
        let appendDom = dom.clone();
        appendDom.addClass('dragDom');
        appendDom.css({'position':'absolute',
                        top:(dom.offset().top - parentDom.offset().top)+'px',
                        left:(dom.offset().left - parentDom.offset().left)+'px',
                        'border':'1px solid #e7eaec',
                        'width':dom.parents().width()+'px'
                        });
        this.blnlazy=true;
        setTimeout(()=>{
            if(!this.blnlazy)return;
            appendDom.appendTo(parentDom);
            this.curInsertDom=appendDom;
            this.curDragIndex=i;
            this.dragStart=e.clientX;
        },200);
      },
      mouseup(e){
        this.blnDragColW=false;
        this.blnlazy=false; 
        if(this.curDragHeaderW){
          let width=this.curDragHeaderW.offset().left-this.curDragHeader.offset().left;
          this.curDragHeaderW.remove();
          this.curDragHeaderW=null; 
          this.curDragHeader=null;
          this.columns[this.curDragHeaderIndex].width=width;
          this.curDragHeaderIndex=-1;
        }
        this.replacePlace();
        this.curDragIndex=-1;
        if(!this.curInsertDom) return;
        this.curInsertDom.remove();
        this.curInsertDom=null;
        this.curLineIndex=-1;
      },
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
              return;
          }
          //列头排序拖动处理
          if(this.curDragIndex<0)return;
          if(!this.curInsertDom) return;
          let offset=this.curInsertDom.offset();
          this.curInsertDom.css({left:(offset.left+e.clientX-parentDom.offset().left-this.dragStart)+'px'});
          
          this.dragStart=e.clientX;
          this.curLineIndex=this.setLine();
      },
      //判断鼠标是否进入的可拖动表头宽度的位置
      header_mousemove(e){
          let dom =$(e.target || e.srcElement),dragNum=5;//可拖拽的区间
          let w=dom.width(),clientX=e.clientX,left=dom.offset().left;
          if(clientX>w+left || clientX<w+left-dragNum || dom.attr('class')!='header'){ dom[0].style.cursor='pointer'; return}; 
          dom[0].style.cursor='e-resize';
      },
      //拖动列头改变列头宽度
      header_mousedown(e,i){
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
                        'background-color':'rgb(3, 171, 103)',
                        'width':'1px'
                        });
           appendDom.appendTo(parentDom);
           this.wDragStart=e.clientX;
           this.curDragHeaderW=appendDom;
           this.curDragHeader=dom;
           this.curDragHeaderIndex=i;
      },
      //拖动放开
      header_mouseup(e){
          this.blnDragColW=false;
          if(!this.curDragHeaderW)return;
          this.curDragHeaderW.remove();
          this.curDragHeaderW=null;
          this.curDragHeader=null;
          this.curDragHeaderIndex=-1;
      },
      //判断拖动的元素进入哪条分割线
      setLine(){
          let lines=$(this.$el).find('.line');
          let minDistance=-1,resIndex=-1,s=this;
          for(let i=0;i<lines.length;i++){
              let line=$(lines[i]);
              if(minDistance<0){
                minDistance=Math.abs(line.offset().left-s.curInsertDom.offset().left);
                resIndex=i;
              }else{
                let  distance=Math.abs(line.offset().left-s.curInsertDom.offset().left);
                if(minDistance>distance){minDistance=distance;resIndex=i}
              }
          }

          return resIndex;
      },
      //替换元素位置(元素拖动后替换位置)
      replacePlace(){
        if(this.curDragIndex<0)return;
        if(this.curDragIndex+1==this.curLineIndex || this.curDragIndex==this.curLineIndex)return;
        if(this.curLineIndex<0)return;
        let data =tool.Clone(this.columns);
        let targetData=data[this.curLineIndex];
        let dragData=data[this.curDragIndex];

        if(this.curLineIndex<this.curDragIndex){
            this.columns.splice(this.curLineIndex,0,dragData);
            this.columns.splice(this.curDragIndex+1,1);
        }else{
            this.columns.splice(this.curLineIndex,0,dragData);
            this.columns.splice(this.curDragIndex,1);
        }
      },
      //重新计算滚动条高度
      reloadyScroll(){
        this.sly.reload();
        this.vsly.reload();
        this.blnShowScroll=this.sly.rel.slideeSize-10>this.sly.rel.frameSize;
        this.blnShowVscorll=this.vsly.rel.slideeSize-10>this.vsly.rel.frameSize;
        this.setScrollH();
        this.sly.reload();
        this.vsly.reload();
      },
      //设置滚动条高度
      setScrollH(){
        let scrollContainerH=this.scrollDom.width();
        let gap=(this.sly.rel.slideeSize-this.sly.rel.frameSize)*(this.sly.rel.frameSize/this.sly.rel.slideeSize);
        this.scrollDom.find('.handle').css('width',(scrollContainerH-gap)<20?20:(scrollContainerH-gap)+'px');

        let vscrollContainerH=this.vscrollDom.height();
        let vgap=(this.vsly.rel.slideeSize-this.vsly.rel.frameSize)*(this.vsly.rel.frameSize/this.vsly.rel.slideeSize);
        this.vscrollDom.find('.handle').css('height',(vscrollContainerH-vgap)<20?20:(vscrollContainerH-vgap)+'px');
      },
  }
}
</script>

<style scoped lang="less">
  @import "../css/variables.less";
  .TableDrag{width:100%;height:100%;position:relative;background-color:white;}

  @scrollH:20px; 
  .Slide { width:100%; height:~'calc(100% - @{scrollH})'; padding: 0; width:~'calc(100% - @{scrollH})';}
  .Slide.allShow{height:100%;}
  .Slide.vallShow{width:100%;}
  .Slide .slidee { margin: 0; padding: 0; height: 100%; cursor:pointer;}
  .Slide .slidee .li { float: left; height: 100%;}
  //头部样式
  @headerH:31px;
  @rowLineH:30px;
  .Slide .slidee .li_header{height:@headerH;position:relative;}
  .Slide .slidee .li .header{
      .border('bottom');text-align:center;line-height:@rowLineH;font-weight:600;-moz-user-select:none;-webkit-user-select:none;user-select:none;
      text-overflow: ellipsis;overflow: hidden;white-space: nowrap;display: block;
    }

    .Slide .slidee .li_header.noShow{background-color:gray;color:white;}
    .Slide .slidee .li_header .option_bar{display:none;}
    .Slide .slidee .li_header:hover .option_bar{
        display:block;line-height:@headerH;
        width:100%;height:@headerH;background-color:white;z-index: 100;position: absolute;top:@headerH - 1px;
        border-top:none;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;
        color:white;
        -moz-box-shadow:0px 1px 4px #333333; -webkit-box-shadow:0px 1px 4px #333333; box-shadow:0px 1px 4px #333333;
    }

    html{.TCol(~".Slide .slidee .li_header:hover .option_bar",'bg');}

    .Slide .slidee .li_header.hover_header{background-color: #dcdcdc;box-shadow: #dcdcdc 5px 10px 2px;}

    .Slide .slidee .li_header .option_bar .option_item{float:left;text-align:center;.border('right');}
    .Slide .slidee .li_header .option_bar .option_item:last-child{border-right:none;}
    .Slide .slidee .li_header .option_bar .option_item i{cursor:pointer;}
   //列表内容项样式
   .Slide .slidee .content{position:absolute;left:0px;width:100%;top:@headerH;bottom:0px;.border('bottom');}
   .Slide .slidee .li_row{height:@headerH;cursor:default;}
   .Slide .slidee .li_row .column{.border('bottom');text-align:center;line-height:@rowLineH;-moz-user-select:none;-webkit-user-select:none;user-select:none;
      text-overflow: ellipsis;overflow: hidden;white-space: nowrap;display: block;}
   .Slide .slidee .li_row.hover_header{background-color: #dcdcdc;box-shadow: #dcdcdc 5px 10px 2px;margin-left: 1px;}

   //固定列容器
   .fix_container{position:absolute;top:0px;bottom:0px;.border('left');.border('top');.border('bottom');}
   .fix_item{width:100%;line-height:@rowLineH;.border('bottom');text-align:center;}
   .fix_content_container{width:100%;height:~'calc(100% - @{headerH})'}
   .fix_row_item{height:@headerH;width:100%;line-height:@rowLineH;.border('bottom');font-size:12px;text-align:center;
   text-overflow: ellipsis;
   overflow: hidden;
   white-space: nowrap;
   display: block;}

   .fix_row_item .item,
   .fix_column_w .item{margin:0px 5px;}

   //水平滚动条样式
  .scrollbar_container{height:@scrollH;width:100%;text-align:center;line-height:@scrollH;}
  .scrollbar { border:1px solid #d8d8d8;border-radius:0px;width:96%; height:@scrollH/10*6;background:white;margin-top:@scrollH/10*2;margin-left: auto;margin-right: auto;}
  .scrollbar .handle {width: 40px;height: @scrollH/10*6-2px;background: @btn_Bg_Col_1;border-radius: 0px;cursor:pointer;}

   //垂直滚动条样式
   .v_scrollbar_container{height:100%;width:@scrollH;text-align:center;position:absolute;top:0px;right:0px;.border('left');background:white;}
   .v_scrollbar_container .scrollbar { border:1px solid #d8d8d8;border-radius:0px;width: 10px; height: ~"calc(100% - 20px)"; position: absolute;right: 5px;top:10px;background:white;}
   .v_scrollbar_container .scrollbar .handle {width: 100%;height: 100px;background: @btn_Bg_Col_1;border-radius: 0px;}

  .item{height:100%;.border('top');.border('bottom');-moz-user-select:none;-webkit-user-select:none;user-select:none;border-bottom:0px;}
  .item:last-child{border-right:1px;}
  .item.dragging{border:1px dashed;}
  .line{display:block;height:100%;list-style: none;position:relative;width:1px;background-color:@borderCol}
  .line:before{content:''}
  .transLine{background-color:transparent;}
  .line.activLine{width:1px;}
  html{.TCol(~".line.activLine",'bg');}
  .line .fa-caret-down{position:absolute;top:-5px;left:-4px;display:none;}
  .line .fa-caret-up{position:absolute;bottom:-5px;left:-4px;display:none;}
  .line.activLine .fa-caret-up,
  .line.activLine .fa-caret-down{display:block;}
  
  html{.TCol(~".line.activLine .fa-caret-down");}
  

  .dragDom{text-overflow: ellipsis;overflow: hidden;white-space: nowrap;display: block;}
  
  .column.active_header,
  .fix_row_item.active_header,
  .header.active_header{color:white;}

  html{.TCol(~".header.active_header",'bg');}
  


  .fix_row_item.active_header .item{border-top:1px solid;}

  html{.TCol(~".fix_row_item.active_header .item",'btc');}

  .column.active_header{height:100%;}
  .column.active_header{margin-left:1px;margin-right:-1px;}
</style>
