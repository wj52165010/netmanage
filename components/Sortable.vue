<!-- 拖动排序组件 -->
<template>
    <div class="sortable">
       <div name="sortable_container" class="gridly">
        <div class="draggable_item" :class="gclass(element)" :id="gid(element)" v-for="element in data">
          <div class="tableName">{{element.name}} <i class="fa fa-remove" @click="setting_del(element)"></i> <i class="fa fa-pencil" @click="setting_click(element)"></i></div> 
          <div class="filedName">
            <div class="info_item"><label>表名</label>
              <div class="content">
                <el-tooltip effect="light" :content="element.tableName" placement="top">
                  {{element.tableName}}
                </el-tooltip>
              </div>
            </div>
            <div class="info_item"><label>字段名</label>
              <div class="content">
                <el-tooltip effect="light" :content="element.keyName || element.name" placement="top">
                  {{element.keyName || element.name}}
                </el-tooltip>
              </div>
            </div>
            <div class="info_item"><label>显示名</label><div class="content">{{element.showName || element.name}}</div></div>
            <div class="info_item"><label>列宽</label><div class="content">{{element.columnW || '自适应'}}</div></div>
            <div class="info_item"><label>是否显示</label><div class="content">{{element.blnShow?'否':'是'}}</div></div>
          </div>
        </div>
       </div>
    </div>
</template>

<script>
import  '../../static/Gridly/jquery.gridly.css'
import  '../../static/Gridly/jquery.gridly.js'
import {BODY_RESIZE} from '../store/mutation-types'

export default {
  name: 'Sortable',
  props:['data'],
  data () {
    return {
      sortInstance:null,
      sortData:[]//排序后的数组
    }
  },
  mounted(){
       this.$store.commit(BODY_RESIZE,()=>{
         this.loadGridly(true);
       });
  },
  watch:{
    data(val, oldVal){
      this.loadGridly(true);
      this.$nextTick(()=>{
        if(!this.sortInstance){return;}
        let els=this.sortInstance.$sorted();
        this.sortData=this.getDataObj(els);
        this.$emit('triggerEvent','dataChange',this.sortData);
      });
    }
  },
  methods:{
    gid(item){
      return item.id || item.tableKey+'|'+item.key;
    },
    gclass(item){
      return 'item_' + item.parent_index;
    },
    //设置按钮单击事件
    setting_click(item){
      this.$emit('triggerEvent','settingClick',item);
    },
    //设置项删除事件
    setting_del(item){
      this.$emit('triggerEvent','filedChange',item);
    },
    //数据改变
    dataChange(){
      this.$emit('triggerEvent','dataChange',this.sortData);
    },
    //重新布局
    relayout(){
      if(!this.sortInstance){return;}
      this.sortInstance.layout(true);
      let els=this.sortInstance.$sorted();
      this.sortData=this.getDataObj(els);
      this.$emit('triggerEvent','dataChange',this.sortData);
    },
    loadGridly(blnIm){
      let self=this;
       setTimeout(()=>{
          let el=$('div[name="sortable_container"]'),containerW=el.width();
          let columns =Math.floor((containerW-80)/(208));
          if(!this.sortInstance){
            this.sortInstance=el.gridly({gutter:10,base:208,columns:columns,callbacks:{
              reordered:(els)=>{
                self.sortData=self.getDataObj(els);
                self.$emit('triggerEvent','dataChange',self.sortData);
              }
            }});
          }else{
            this.sortInstance.settings.columns=columns;
            this.sortInstance.layout();
          }
        if(this.$parent.reloadSly){this.$parent.reloadSly();}
       },this.sortInstance && !blnIm?500:0);
    },
    //根据元素获取相关联的数据对象
    getDataObj(els){
      let self=this,result=[];
      for(let i=0;i< els.length;i++){
          let id=$(els[i]).attr('id'),tableKey=id.split('|')[0],fieldKey=id.split('|')[1];
          for(let item of self.data){
            if((item.tableKey==tableKey && item.key==fieldKey) || item.id==id){
              result.push(item);
            }
          }
      }
      return result;
    }
  }
}
</script>
<style>
  .sortable .draggable_item .filedName .info_item .content .el-tooltip .el-tooltip__rel{width: 100%;height:30px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}
</style>
<style scoped lang="less">
    @import "../css/variables.less";
    @titleH:25px;
    .sortable .gridly{width:100%;margin:10px 0px;position:relative;}
    .sortable .draggable_item{width:200px;height:180px;.border('');cursor:pointer;border-radius:5px;font-size:12px;}
    .sortable .draggable_item div{text-align:left;}
    .sortable .draggable_item .filedName{.border('bottom');height:~'calc(100% - @{titleH})';}
    .sortable .draggable_item .filedName .info_item{padding:0px 0px;.border('bottom');line-height: 30px;}
    .sortable .draggable_item .filedName .info_item:last-child{border:none;}
    .sortable .draggable_item .filedName .info_item label{margin-bottom:0px !important;font-weight:normal;.border('right');width:70px;text-align:center;}
    .sortable .draggable_item .filedName .info_item .content{float:right;width:120px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;height:30px;}
    .sortable .draggable_item .filedName .info_item .content .el-tooltip{width: 100%;height:30px;}

    .sortable .draggable_item .tableName{text-align:left;padding:0px 10px;height:@titleH;line-height:25px;}
    .sortable .draggable_item .tableName i{float:right;margin-top:5px;cursour:pointer;margin-left:5px;}
    //.sortable .draggable_item .tableName i:hover{color:@Font_Hover_Col;}
    html{.TCol(~".sortable .draggable_item .tableName i:hover");}
    
    .sortable .draggable_item .tableName {background-color:black;color:@FrontCol;border-top-left-radius:5px;border-top-right-radius:5px;}
    .sortable .draggable_item.item_0 .tableName{background-color:@btn_Bg_Col_1;color:@FrontCol;border-top-left-radius:5px;border-top-right-radius:5px;}
    .sortable .draggable_item.item_1 .tableName{background-color:@btn_Bg_Col_2;color:@FrontCol;border-top-left-radius:5px;border-top-right-radius:5px;}
    .sortable .draggable_item.item_2 .tableName{background-color:@btn_Bg_Col_3;color:@FrontCol;border-top-left-radius:5px;border-top-right-radius:5px;}
    .sortable .draggable_item.item_3 .tableName{background-color:@btn_Bg_Col_4;color:@FrontCol;border-top-left-radius:5px;border-top-right-radius:5px;}
    .sortable .draggable_item.item_4 .tableName{background-color:@btn_Bg_Col_5;color:@FrontCol;border-top-left-radius:5px;border-top-right-radius:5px;}
</style>
