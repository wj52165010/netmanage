<!-- 快搜配置页面展示字段 -->
<template>
    <div class="KSearchField">
        <!--左边数据源列表展示内容-->
        <div class="source">
            <div class="item"><span class="icon"><i class="fa fa-th"></i></span><span class="content">数据源源列表</span></div>
            <div class="item hover" :class="{active:curSource.key==s.key}" v-for="(s,i) in sources" @click="curSource=s"><span class="number">{{i+1}}.</span>{{s.name}}</div>
        </div>
        <!--右边内容展示-->
        <div class="info" >
          <!--字段展示列表-->
          <div class="fieldList">
            <!--标题栏-->
            <div class="title"><i class="fa fa-server" style="margin-right:10px;" /><span v-if="curSource.name">{{curSource.name}} - <span style="font-size:12px;">({{computeLength()}})</span></span></div>
            <!--表头-->
            <div class="table_header">
                <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                    <thead><tr>
                        <th style="width:30px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center hover table_title" @click="allCheck_click"><div style="width:30px;" class="divEllipsis"><i class="fa" :class="{
                        'fa-square-o':computeLength()!=(selFields[curSource.key] || []).length || !computeLength(),
                        'fa-check-square-o':computeLength()==(selFields[curSource.key] || []).length}">
                        </i></div>
                        </th>
                        <th style="width:150px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">名称</div></th>
                        <th style="width:200px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:200px;" class="divEllipsis">表名</div></th>
                        <th style="width:200px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:200px;" class="divEllipsis">字段名</div></th>
                        <th style="border-bottom:0px;" class="text-center"><div style="" class="divEllipsis">描述</div></th>
                    </tr></thead>
                </table>
            </div>
            <!--列表展示区域-->
            <div class="content">
              <Scroll :listen="curSource">
                  <table class="table table-striped table-hover" style="border-collapse: collapse;margin-bottom:0px;">
                    <tbody><tr v-for="f in curSource.fields">
                        <td style="width:30px;border-top:0px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center hover" @click="check_click(f.key)"><div style="width:30px;" class="divEllipsis"><i class="fa" :class="{
                          'fa-square-o':!selFields[curSource.key] || (selFields[curSource.key] && selFields[curSource.key].indexOf(f.key)<0),
                          'fa-check-square-o':selFields[curSource.key] && selFields[curSource.key].indexOf(f.key)>=0}">
                          </i></div>
                        </td>
                        <td style="width:150px;border-top:0px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{f.name}}</div></td>
                        <td style="width:200px;border-top:0px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:200px;" class="divEllipsis">{{curSource.key}}</div></td>
                        <td style="width:200px;border-top:0px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:200px;" class="divEllipsis">{{f.key}}</div></td>
                        <td style="border-top:0px;border-bottom:1px solid #ddd;" class="text-center"><div style="" class="divEllipsis">{{f.desc}}</div></th>
                    </tr></tbody>
                </table>
              </Scroll>
            </div>
          </div>
          <!--字段排序列表-->
          <div class="fieldSort">
              <!--标题栏-->
              <div class="title"></div>
          </div>
        </div>
    </div>
</template>

<script>
import { mapState,mapMutations} from 'vuex'
import Scroll from 'components/scroll'
import Vue from 'vue'
import '../../js/dragSort.js'
export default {
  name: 'KSearchField',
  components:{Scroll},
  data () {
    return {
      curSource:{},//当前选中的数据源
      selFields:{},//选中的字段集合(根据不同数据源分类)
    }
  },
  computed:mapState({
    sources:state=>{
      let sourceList=_.chain(tool.Clone(state.oriSource)).values('tables').map(m=>m.tables).value();
      let sourceObj=_.extend(...sourceList); 
      return _.compact(_.map(state.kuaisou.selSource,key=>sourceObj[key] || ''));
    }
  }),
  methods:{
    //字段全选按钮单击事件
    allCheck_click(){
      if(!this.selFields[this.curSource.key]){
        Vue.set(this.selFields,this.curSource.key,[]);
      }

      //判断是否全选
     if(this.computeLength()!=this.selFields[this.curSource.key].length){//全选
        this.selFields[this.curSource.key]=_.keys(this.curSource.fields || {});
     }else{//取消全选
        this.selFields[this.curSource.key]=[];
     }

    },
    //字段项选中切换事件
    check_click(key){
      if(!this.selFields[this.curSource.key]){
        Vue.set(this.selFields,this.curSource.key,[]);
      }

      //判断是否包含该字段
      let index=this.selFields[this.curSource.key].indexOf(key);
      if(index>=0){
        this.selFields[this.curSource.key].splice(index,1);
      }else{
        this.selFields[this.curSource.key].push(key);
      }
    },
    //计算具体数据源下字段数
    computeLength(){
      return _.keys(this.curSource.fields || {}).length;
    }
  }
}
</script>

<style scoped lang="less">
     @import "../../css/variables.less";
     @sourceW:250px;
     @sourceItemH:40px;
     .KSearchField{width:100%;height:100%;background-color:white;}

     .KSearchField .source{width:@sourceW;height:100%;.border('right');float:left;}
     .KSearchField .source .item{height:@sourceItemH;line-height:@sourceItemH;.border('bottom');text-align:left;padding:0px 10px;}
     .KSearchField .source .item.hover:hover{cursor:pointer;}
     .KSearchField .source .item .content{margin-left:10px;font-size:14px;}
     .KSearchField .source .item .number{font-style: italic;}
     .KSearchField .source .item.active{background-color:@Font_Hover_Col;color:white;}

     .KSearchField .info{width:~'calc(100% - @{sourceW})';height:100%;margin-left:@sourceW;}

     @fieldListH:50%;
     @headerH:40px;
     .KSearchField .info .fieldList{height:@fieldListH;.border('bottom');}
     .KSearchField .info .fieldList .title{height:@sourceItemH;.border('bottom');line-height:@sourceItemH;font-size:16px;}
     .KSearchField .info .fieldList .table_header{height:@headerH;.border('bottom');}
     .KSearchField .info .fieldList .table_header tr{height:~'calc(@{headerH} - 1px)';}
     .KSearchField .info .fieldList .table_header .table_title{color:@Font_Hover_Col;}
     .KSearchField .info .fieldList .content{height:~'calc(100% - @{sourceItemH} - @{headerH})';}
     .KSearchField .info .fieldList .hover{cursor:pointer;}

     .KSearchField .info .fieldSort{height:~'calc(100% - @{fieldListH})';}

     .KSearchField .info .fieldSort .title{}
</style>
