<!-- 布局组件 -->
<template>
    <div class="LayoutCmp" >
        <Scroll :listen="_list">
        <div class="Hline" :class="{active:rowIndex==0 && blnInertRow}"></div>
        <template v-for="(r,i) in _list">
          <div class="row" :rowid="i" :class="{active:rowIndex==i && !blnInertRow}">
            <div class="Vline" :class="{active:rowIndex==i && colIndex==0}">
              <i class="fa fa-caret-down"></i>
              <i class="fa fa-caret-up"></i>
            </div>
            <template v-for="(c,j) in r">
              <div class="column" col="1" :style="{width:c.width+'px'}" @mousedown="col_mousedown($event,c)">
                <div class="content">
                  <span class="title">{{c.name}}</span>
                  <span class="colon">:</span>
                  <span class="val">{{c.previewVal}}</span>
                </div>
                <!--操作栏-->
                <div class="option_bar"@mousedown.stop="noHandler()">
                  <el-tooltip class="item" effect="light" content="移除" placement="right"><div class="i_container" @click="removeField(c,i,j)"><i class="fa fa-remove"></i></div></el-tooltip>
                  <el-tooltip class="item" effect="light" content="编辑" placement="right"><div class="i_container" @click="setting($event,c)"><i class="fa fa-pencil"></i></div></el-tooltip>
                </div>
              </div>
              <div class="Vline" :class="{active:rowIndex==i && colIndex==j+1}">
                <i class="fa fa-caret-down"></i>
                <i class="fa fa-caret-up"></i>
              </div>
            </template>
          </div>
          <div class="Hline" :class="{active:rowIndex==i+1 && blnInertRow}"></div>
        </template>
        </Scroll>

        <!--属性设置窗体-->
        <div class="setting" v-show="blnShowSettingPop" :style="{left:setPopLeft + 'px',top:setPopTop + 'px'}">
          <!--标题栏-->
          <div class="title">展示条件</div>
          <!--内容栏-->
          <div class="content">
            <!--操作项-->
            <div class="option_item">
              <div class="option_item_title">字段标题 :</div>
              <div><input type="text" class="form-control" v-model="field_name" :placeholder="curSetField.name || ''" ></div>
            </div>
            <div class="option_item">
              <div class="option_item_title">字段列宽 :</div>
              <div><input type="text" class="form-control" v-model="field_width" placeholder="自适应" ></div>
            </div>
          </div>
          <!--按钮栏-->
          <div class="btn_bar" @click="updateSet()">
              确定
          </div>
          <!--删除按钮-->
          <div class="remove_btn" @click="clearSetPop()">
            <i class="fa fa-remove"></i>
          </div>
        </div>

    </div>
</template>

<script>
import Vue from 'vue'
import { mapState,mapMutations} from 'vuex'
import {BODY_RESIZE} from '../store/mutation-types'
import Scroll from 'components/scroll'
export default {
  name: 'Layout',
  components:{Scroll},
  props:['fields'],
  data () {
    return {
      mouseupid:'',
      mousemoveid:'',
      cw:0,
      curDragData:null,//当前拖动元素数据
      curInsertDom:null,//当前拖动元素
      blnInertRow:false,//是否为插入新行
      rowIndex:-1,//行索引
      colIndex:-1,//列索引
      dragStartX:0,
      dragStartY:0,
      outDrag:false,
      data:[
        // [
        //   {name:'证件类型',key:'12',width:200,val:'预览数据11111111111111111111111'},
        //   {name:'姓名',key:'123',val:'预览数据'},
        //   {name:'证件号码1',key:'125',width:241,val:'预览数据++++'},
        //   {name:'证件号码2',key:'126',val:'预览数据++++'},
        //   {name:'证件号码3',key:'127',val:'预览数据++++'}
        // ],
        // [
        //   {name:'证件类型',key:'52',val:'预览数据11111111111111111111111'},
        //   {name:'姓名',key:'623',val:'预览数据'},
        // ],
      ],
      blnShowSettingPop:false,//是否显示列属性设置框
      setPopLeft:0,//列属性框距左边距离
      setPopTop:0,//列属性框距上边距离
      curSetField:{},//当前设置属性的字段对象信息
      field_name:'',//设置的字段名称
      field_name_old:{},//各个字段原来的值
      field_width:null,//设置的字段宽度
      field_width_old:{},//各个字段原来的值
    }
  },
  computed:mapState({
    //内部布局数据样式
    _list(){
      let rowW=this.cw,s=this,rows=tool.Clone(s.data);
      for(let r=0;r<rows.length;r++){
        let cols=rows[r];
        let remainW=_.reduce(cols, function(memo, num){  return memo + (num.width || 0); }, 0);
        let autoCol=_.filter(cols,d=>!d.width);
        let fixCol =_.filter(cols,d=>d.width);

        if(autoCol.length>0){
          let autoW=(rowW-remainW-(cols.length)*5 - cols.length -4)/autoCol.length;
          for(let i=0;i<autoCol.length;i++){
              autoCol[i].width=autoW <0 ?'':autoW;
              autoCol[i].blnAuto=true;
          }
        }
        if(fixCol.length>0){
          for(let i=0;i<fixCol.length;i++){
              fixCol[i].blnAuto=false;
          }
        }
      }
    
      return rows;
    }
  }),
  watch:{
    field_name(){
      //获取当前设置列元数据
      let oriCol=this.getOriCol(this.curSetField);
    
      if(!oriCol)return;
      oriCol.name=this.field_name;
    },
    field_width(){
      //获取当前设置列元数据
      let oriCol=this.getOriCol(this.curSetField);
      if(!oriCol)return;
      Vue.set(oriCol,'width',this.field_width?parseFloat(this.field_width):'');
    },
    fields(){
      this.data=this.fields || this.data;
    }
  },
  mounted(){
    this.data=this.fields || this.data;
    this.cw=$(this.$el).width();
    this.$store.commit(BODY_RESIZE,()=>{
      this.cw=$(this.$el).width();
    });
    this.mousemoveid=Fx.SingleBind('mousemove',$('body'), (e)=> {
      this.mousemove(e);
    });
    this.mouseupid=Fx.SingleBind('mouseup',$('body'), (e)=> {
      this.mouseup(e);
    });
  },
  destroyed(){
     Fx.ClearBind('mouseup',$('body'),this.mouseupid);
     Fx.ClearBind('mousemove',$('body'),this.mousemoveid);
  },
  methods:{
    noHandler(){},
    drag(e,d){
      this.outDrag=true;
      this.$nextTick(()=>{
        this.col_mousedown(e,d);
      });
    },
    //获取指定列元数据
    getOriCol(col){
      //获取当前设置列元数据
      let s=this,oriCol=null;
      for(let i=0;i<s.data.length;i++){
        for(let j=0;j<s.data[i].length;j++){
          if(s.data[i][j].key==col.key){
            oriCol=s.data[i][j];break;
          }
        }
      }

      return oriCol;
    },
    //移除字段项
    removeField(c,row,col){
      this.data[row].splice(col,1);
      if(this.data[row].length<=0){
        this.data.splice(row,1);
      }

      //触发字段删除后事件
      this.$emit('removeAfter',c);
    },
    //设置列属性
    setting(e,d){
      let dom =$(e.target || e.srcElement);
      //获取列对象
      let colDom=dom.parents('.column');
      let parentDom=$(this.$el);

      //判断上一个设置对象是否需要恢复之前的设置
      if(this.curSetField.key){
        let preOriCol=this.getOriCol(this.curSetField);
        preOriCol.name=this.field_name_old[preOriCol.key]?this.field_name_old[preOriCol.key]:preOriCol.name;
        preOriCol.width=this.field_width_old[preOriCol.key].blnAuto?'':this.field_width_old[preOriCol.key].width?this.field_width_old[preOriCol.key].width:preOriCol.width;
      }
      
      setTimeout(()=>{
        this.blnShowSettingPop=true;
        this.setPopTop=colDom.offset().top - parentDom.offset().top + Fx.getHeight(colDom[0]);
        this.setPopLeft=colDom.offset().left - parentDom.offset().left;
      },0);

      this.curSetField=d;
      this.field_name=d.name;
      this.field_width=d.blnAuto?'':d.width || '';
      let oriCol=this.getOriCol(this.curSetField);
      Vue.set(oriCol,'width',this.field_width?parseFloat(this.field_width):'');

      this.field_name_old[this.curSetField.key]=this.curSetField.name;

      this.field_width_old[this.curSetField.key]=this.field_width_old[this.curSetField.key] || {};
      this.field_width_old[this.curSetField.key].width=this.curSetField.width || '';
      this.field_width_old[this.curSetField.key].blnAuto=d.blnAuto;
    },
    //修改字段属性
    updateSet(){
       this.field_name_old[this.curSetField.key]='';
       this.field_width_old[this.curSetField.key]={};
       this.blnShowSettingPop=false;
       this.curSetField={};
    },
    //清除列设置框
    clearSetPop(){
      this.blnShowSettingPop=false;
      //判断上一个设置对象是否需要恢复之前的设置
      if(this.curSetField.key){
        let preOriCol=this.getOriCol(this.curSetField);
        preOriCol.name=this.field_name_old[preOriCol.key]?this.field_name_old[preOriCol.key]:preOriCol.name;
        preOriCol.width=this.field_width_old[preOriCol.key].blnAuto?'':this.field_width_old[preOriCol.key].width?this.field_width_old[preOriCol.key].width:preOriCol.width;
      }

      this.curSetField={};
    },
    //列鼠标按下事件
    col_mousedown(e,d){
      let dom =$(e.target || e.srcElement);
      //获取列元素父类
      if(dom.attr('col')!=1){
        dom=dom.parents('.column');
      }
      this.clearSetPop();
      if(!dom) return;
      let parentDom=$(this.$el);
      let appendDom = dom.clone();
      appendDom.addClass('dragDom');
      appendDom.css({'position':'absolute',
                      top:(dom.offset().top - parentDom.offset().top)+'px',
                      left:(dom.offset().left - parentDom.offset().left)+'px',
                      'border':'1px dashed #2f3341',
                      });
      
      appendDom.appendTo(parentDom);
      appendDom.find('.option_bar').remove();
      let cd=tool.Clone(d);
      if(cd.blnAuto){cd.width=0;}
      this.curDragData=cd;
      this.curInsertDom=appendDom;
      this.dragStartX=e.clientX;
      this.dragStartY=e.clientY;
    },
    //鼠标松开事件
    mouseup(e){
      //处理拖动后的结果
      if(!this.curDragData)return;
      //获取当前拖动元素位置信息
      let colIndex=-1;rowIndex=-1,s=this; 
      for(let i=0;i<s.data.length;i++){
        for(let j=0;j<s.data[i].length;j++){
          if(s.data[i][j].key==this.curDragData.key){
            rowIndex=i;colIndex=j;break;
          }
        }
      }
      

      if((this.colIndex!=-1 || this.rowIndex!=-1) && (this.colIndex!=colIndex || this.rowIndex!=rowIndex)){
        if(s.blnInertRow){//新增行
          if(this.rowIndex<=rowIndex){
              this.data.splice(this.rowIndex,0,[this.curDragData]);
              if(!this.outDrag){
                this.data[rowIndex+1].splice(colIndex,1);
                if(this.data[rowIndex+1].length<=0){
                  this.data.splice(rowIndex+1,1);
                }
              }
          }else{
              this.data.splice(this.rowIndex,0,[this.curDragData]);
              if(!this.outDrag){
                this.data[rowIndex].splice(colIndex,1);
                if(this.data[rowIndex].length<=0){
                  this.data.splice(rowIndex,1);
                }
              }
          }
        }
        else if(!s.blnInertRow && this.rowIndex==rowIndex){//本行操作
          if(this.colIndex<colIndex){
              this.data[rowIndex].splice(this.colIndex,0,this.curDragData);
              if(!this.outDrag){
                this.data[rowIndex].splice(colIndex+1,1);
              }
          }else{
              this.data[rowIndex].splice(this.colIndex,0,this.curDragData);
              if(!this.outDrag){
                this.data[rowIndex].splice(colIndex,1);
              }
          }
        }else if(!s.blnInertRow && this.rowIndex!=rowIndex){//跨行操作
           this.data[this.rowIndex].splice(this.colIndex,0,this.curDragData);
           if(!this.outDrag){
            this.data[rowIndex].splice(colIndex,1);
            if(this.data[rowIndex].length<=0){
                this.data.splice(rowIndex,1);
            }
           }
        }

        //触发添加元素成功事件
        this.$emit('insertAfter',this.curDragData);
      }

      this.outDrag=false;
      this.curDragData=null;
      this.blnInertRow=false,
      this.rowIndex=-1;
      this.colIndex=-1;
      if(!this.curInsertDom)return;
      this.curInsertDom.remove();
      this.curInsertDom=null;
    },
    //鼠标移到事件
    mousemove(e){
      let parentDom=$(this.$el);

   
      if(!this.curInsertDom) return;
      let offset=this.curInsertDom.offset();
      this.curInsertDom.css({
        left:(offset.left - parentDom.offset().left +e.clientX-this.dragStartX-(this.outDrag?0:5))+'px',
        top:(offset.top - parentDom.offset().top +e.clientY-this.dragStartY)+'px',
      });
      this.dragStartX=e.clientX;
      this.dragStartY=e.clientY;
      this.setLine();
    },
   
    //判断拖动的元素进入哪条分割线
    setLine(){
      //判断拖动元素是进入拖动框
      let domH=Fx.getHeight(this.curInsertDom[0]),
          domW=Fx.getWidth(this.curInsertDom[0]),
          colH=38,
          containerOffset=$(this.$el).offset(),
          curDomOffset=this.curInsertDom.offset();

      if(curDomOffset.left+domW<=containerOffset.left || 
         curDomOffset.top+domH<=containerOffset.top ||
         curDomOffset.left>=containerOffset.left+Fx.getWidth($(this.$el)[0]) ||
         curDomOffset.top>=containerOffset.top+Fx.getHeight($(this.$el)[0])){
          this.rowIndex=-1;
          this.colIndex=-1;
          return;}
    

      let Hlines=$(this.$el).find('.Hline');//水平线
      let minDistance=-1,colIndex=-1,rowIndex=-1,s=this;

      let VminDistance=-1;
      for(let i=0;i<Hlines.length;i++){
        let line=$(Hlines[i]);
        if(VminDistance<0){
          VminDistance= Math.abs(line.offset().top-s.curInsertDom.offset().top);
          rowIndex=i;
        }else{
          let  distance=Math.abs(line.offset().top-s.curInsertDom.offset().top);

          if(VminDistance>distance){VminDistance=distance;rowIndex=i}
        }
      }

      //判断当前拖动元素是属于某一行中还是新增行
      let blnInertRow=false;
      if((rowIndex+1)>=Hlines.length){
        blnInertRow=true;
      }else{
        let topOffset=$(Hlines[rowIndex]).offset(),
            bottomOffset=$(Hlines[rowIndex+1]).offset(),
            domOffset=s.curInsertDom.offset();
        if(Math.abs(domOffset.top-topOffset.top)>=colH/2 
            || Math.abs(domOffset.top+colH-bottomOffset.top)>=colH/2 ){
            blnInertRow=true;
          }
      }

      this.blnInertRow=blnInertRow;
      this.rowIndex=rowIndex;
      
      //如果为新增行则不需要判断列
      if(this.blnInertRow){
        this.colIndex=-1;
        return;
      }

      let Vlines=$(this.$el).find(`div[class*="row"][rowid="${rowIndex}"]`).find('.Vline');//垂直线
      for(let i=0;i<Vlines.length;i++){
          let line=$(Vlines[i]);
          if(minDistance<0){
            minDistance=Math.abs(line.offset().left-s.curInsertDom.offset().left);
            colIndex=i;
          }else{
            let  distance=Math.abs(line.offset().left-s.curInsertDom.offset().left);

            if(minDistance>distance){minDistance=distance;colIndex=i}
          }
      }

      this.colIndex=colIndex;

    }
  

  }
}
</script>

<style scoped lang="less">
  @import "../css/variables.less";
  .LayoutCmp{width:100%;height:100%;position:relative;-webkit-user-select:none; -moz-user-select:none; -ms-user-select:none; user-select:none}
  .Hline{width:100%;height:1px;background-color:transparent;}
  //.Hline.active{background-color:@Font_Hover_Col;}
  html{.TCol(~".Hline.active",'bg');}
  .Vline{width:1px;height:100%;background-color:transparent;float:left;position:relative;}
  .Vline .fa-caret-down{position:absolute;top:-12px;left:-4px;display:none;}
  .Vline .fa-caret-up{position:absolute;bottom:-12px;left:-4px;display:none;}
  .Vline.active .fa-caret-down,
  .Vline.active .fa-caret-up{display:block;}
   html{.TCol(~".Vline.active .fa-caret-up");}

  @rowH:40px;
  .row{width:100%;height:@rowH;margin:0px;margin:10px 0px;}
  .row.active{border:1px dashed @FontCol;}
  .column{
    height: 38px;background-color:white;float:left;padding:10px;font-size:12px;.border('');border-radius:5px;margin-left:5px;position:relative;
  }
  .column:hover{cursor:pointer;.border('',@Font_Hover_Col);}
   html{.TCol(~".column:hover",'bc');}
  .column .content{width:100%;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;display: block;position:relative;}
  .column .title{font-weight:600;font-style:italic;}
  .column .colon{margin:0px 5px;}
  .column .option_bar{
    position:absolute;right:0px;top:0px;height:100%;width:30px;text-align:right;.border('left',@Font_Hover_Col);background-color:white;
    border-top-right-radius:5px;border-bottom-right-radius:5px;display:none;
    }
  html{.TCol(~".column .option_bar",'blc');}
  .column .option_bar .i_container{width:30px;height:100%;}
  .column .option_bar .item{
    display:none;width:100%;height:50%;line-height:20px;
    text-align:center;
    }
  .column .option_bar .item:first-child{.border('bottom',@Font_Hover_Col);}
  html{.TCol(~".column .option_bar .item:first-child",'bbc');}
  .column:hover .option_bar{display:block;}
  .column:hover .option_bar .item{display:block;}

  @settingH:200px;
  .setting{
    width:150px;height:@settingH;.border('');position:absolute;top:38px;left:0px;z-index:100;background-color:white;border-radius:5px;
  }
  @setTitle:30px;
  @setBtn:30px;
  .setting .title{width:100%;height:@setTitle;line-height:@setTitle;.border('bottom');text-align:center;font-size:12px;font-style:italic;}
  .setting .content{width:100%;height:~'calc(100% - @{setTitle} - @{setBtn})';padding:10px;}
  .setting .content .option_item{margin-bottom:10px;}
  .setting .content .option_item_title{font-size:12px;font-style:italic;margin-bottom:5px;}
  .setting .btn_bar{width:100%;height:@setBtn;line-height:@setBtn;.border('top');text-align:center;font-style:italic;border-bottom-left-radius:5px;border-bottom-right-radius:5px;}
  .setting .btn_bar:hover{cursor:pointer;color:white;}
  html{.TCol(~".setting .btn_bar:hover",'bg');}

  .setting .remove_btn{position:absolute;top:-10px;right:-10px;width:20px;height:20px;line-height:20px;text-align:center;background-color:@FontCol;color:white;border-radius:50%;}
  .setting .remove_btn:hover{cursor:pointer;}

  html{.TCol(~".setting .remove_btn:hover",'bg');}

  .dragDom{text-overflow: ellipsis;overflow: hidden;white-space: nowrap;display: block;z-index:100;}
</style>
