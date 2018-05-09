<!-- 水平列表组件 -->
<template>
    <div class="HList" :id="id" :class="{show:blnShowList_pop,small:blnSmall}">
      <div class="optionBar" v-if="title">
        <div class="left">
          <titleComp :title="title" @change="blnShowList" />
        </div>
        <div class="right">
          <span class="tag_label" style="margin-left:10px;cursor:pointer;" v-for="k in tag_action" @click="tag_actionClick(k.action,k)">
            <i :class="k.icon" style="margin-right:5px;"></i>{{k.name}}
          </span>
          <div class="item" name="HList_ripple" v-for="item in action" @click="actionClick(item.action)">
            <div class="icon" style="display:inline-block;"><i :class="item.icon" /></div>
            <span class="info">{{item.name}}</span>
          </div>
        </div>
        <div class="center">
          <cCheckbox v-for="c in check_action" :label="c.name" :value="c" @change="tag_check" />
          <div style="width:150px;display:inline-block;" v-for="action in searchAction" v-if="!action.type">
            <SearchInput :holder="action.name" :extra="action.action" @btnClick="seachClick" />
          </div>
          
          <div v-for="action in searchAction" v-if="action.type" style="display:inline-block;margin-top:-10px;margin-right:10px;" :style="{width:searchType['日期范围']==action.type?'260px':'auto'}">
            <span>{{action.name}}</span>
            <div class="dataMass_datarange" style="display:inline-block;" v-if="searchType['日期范围']==action.type">
              <el-date-picker
                  v-model="action.val"
                  type="daterange"
                  :picker-options="action.options || {}" 
                  placeholder="选择日期范围">
              </el-date-picker>
            </div> 
        
            <div style="display:inline-block;" v-if="action.type=='dropdown'">
              <el-select v-model="action.val" clearable :placeholder="action.placeholder">
                  <el-option
                    v-for="item in action.data"
                    :key="item[action.key]"
                    :label="item[action.label]"
                    :value="item[action.value]">
                  </el-option>
              </el-select>
            </div>
          </div>

          <el-button type="primary" style="margin-top: -10px;" v-if="searchAction && searchAction.length>0 && searchAction[0].type" @click="query_click()"><span>搜索</span></el-button>
        </div>
      </div>
      <ul class="container" style="margin-bottom:0px;" v-show="blnShowList_pop">
            <li class="row header">
                <!--<span class="fragment" style="width:50px;text-align:center;">星级</span>-->
                <span class="fragment" style="width:50px;text-align:center;" v-if="!expan && !blnNoSel">选择</span>
                <!--<span class="fragment identi" style="width:100px;text-align:center;">报警类型</span>-->
                <span v-for="(val,index) in header" class="fragment" :style="{
                            width:column[index].width?column[index].width+'px':'',
                            textAlign:column[index].align || ''
                            }">
                      <div>{{val}}</div>
                  </span>
                  <span class="fragment" style="width:100px;text-align:center;" v-if="rowAction && rowAction.length>0">操作</span>
            </li>
      </ul>
      <div class="containerScroll" :class="{scroll_noPage:blnNoPage,scroll_noTitle:!title,hasPageNotitle:!blnNoPage && !title,noPageNotitle:blnNoPage && !title}">
        <!--加载中标识-->
        <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;">
          <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;"><i class="fa fa-spinner fa-pulse"></i></div></div>
        </div>
      <div class="scrollContainer" v-show="blnShowList_pop">
        <div class="slidee">
          <ul class="container">
            <li v-if="data.length<=0 && !blnLoading" style="line-height:30px;text-align:center;">暂无数据</li>
            <template v-for="(item,i) in data">
              <li class="row" @click="itemClick(item,i)" :class="{expan:expan && infoArr[i],blnClick:blnRowClick,active:curActiveIndex==i}">
                  <!--<span class="fragment icon" style="width:50px;text-align:center;" v-on:click.stop="item.blnImport=!item.blnImport"><i class="fa" :class="{'fa-star-o':!item.blnImport,'fa-star':item.blnImport,'importRow':item.blnImport}"></i></span>-->
                  <span v-if="!expan && !blnNoSel" class="fragment icon" style="width:50px;text-align:center;color:#728499;" v-on:click.stop="item.blnRead=!item.blnRead"><i class="fa" :class="{'fa-square-o':!item.blnRead,'fa-check-square-o':item.blnRead,'readRow':item.blnRead}"></i></span>
                  <!--<span class="fragment identi" style="width:100px;text-align:center;">
                      <span class="item"><i class="fa fa-vimeo"></i></span>
                  </span>-->
                  <span v-for="(val,key,index) in filterField(item)" class="fragment" :style="{
                            width:column[index].width?column[index].width+'px':'',
                            textAlign:column[index].align || ''
                            }">

                     <div v-html="val" v-if="val!=undefined && val!=''" class="row_item" :title="val" :style="{
                            width:column[index].width?(column[index].width-1)+'px':'',
                            textAlign:column[index].align || '','font-size':blnSmall?'12px':'14px',
                            color:column[index].color || '',
                            cursor:column[index].click?'pointer':'default'
                            }" @click="column[index].click?column[index].click(i):function(){}"></div>

                      <div  v-if="val==undefined || val==''" class="row_item" :title="val" :style="{
                            width:column[index].width?(column[index].width-1)+'px':'',
                            textAlign:column[index].align || '','font-size':blnSmall?'12px':'14px',
                            color:column[index].color || ''
                            }">
                            <span style="opacity:0;">1</span>
                      </div>
                  </span>
                  <span class="fragment" v-if="rowAction && rowAction.length>0" style="width:100px;text-align:center;color:#03c1d7" :style="{'font-size':blnSmall?'12px':'14px'}">
                    <span style="margin-right:5px;cursor:pointer;" v-for="action in rowAction" v-on:click.stop="rowActionClick(action.action,item)">{{action.name}}</span>
                  </span>
              </li>
              <li class="info" v-show="expan && infoArr[index]" :class="{}">
                <div v-if="item.children && item.children.length>0"  class="row"  style="display:table;font-size:12px;height:30px;line-height:30px;background-color:#ebedee;">
                  <span v-for="(val,index) in childHeader" class="fragment" :style="{
                              width:childColumn[index].width?childColumn[index].width+'px':'',
                              textAlign:childColumn[index].align || ''
                              }">
                        {{val}}
                    </span>
                </div>
                <span class="fragment" colspan="10" style="display: inline-block;width: 100%;line-height: 30px">
                   <div v-for="child in item.children" class="row" style="line-height:30px;height:30px;">
                     <span v-for="(val,key,index) in filterField(child,true)" class="fragment" :style="{
                                width:childColumn[index].width?childColumn[index].width+'px':'',
                                textAlign:childColumn[index].align || '',
                                display:'table-cell'
                                }">
                          {{val}}
                      </span>
                   </div>
                </span>
              </li>
            </template> 
          </ul>
        </div>
        <div name="scrollBar" class="scrollbar" v-show="blnShowScroll">
            <div class="handle"></div>
        </div> 
      </div>
      </div>
      <div class="page_container" v-if="!blnNoPage" v-show="blnShowList_pop">
          <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageNum+1}}</span></span>
          <div class="firstPage" @click="pageChange(0)">首页</div>
          <div class="prePage" @click="pageChange(pageNum-1)">上一页</div>
          <div class="nextPage" @click="pageChange(pageNum+1)">下一页</div>
      </div>    
    </div>
</template>

<script>
import Vue from 'vue'
import ripple from '../js/ripple_btn.js'
import cInput from './Input'
import SearchInput from './searchInput'
import cCheckbox from './checkbox'
import {BODY_RESIZE} from '../store/mutation-types'
import {searchType} from '../enum/SearchType'

export default {
  name: 'HList',
  components:{
    cInput,
    SearchInput,
    cCheckbox,
    titleComp:{
      props:['title'],
      template:`<div class="titleComp" style="cursor:pointer;display:inline-block;" @click="itemClick()">
                  <i class="fa fa-caret-down" style="font-size:18px;" :class="{rotate:blnExpan,rotatereverse:!blnExpan}"></i>
                  <span style="font-style: italic;">{{title}}</span>
                </div>
               `,
      data(){
        return {
          blnExpan:false
        };
      },
      methods:{
        itemClick(){
          this.blnExpan= !this.blnExpan;
          this.$emit('change',this.blnExpan);
        }
      }
    }
  },
  props:['title','action','searchAction','rowAction','showField','data','expan','blnNoSel','header','column','childShowField','childColumn','childHeader',
         'tag_action','check_action','pageNum','blnNoPage','blnLoading','store','blnSmall','blnRowClick'
        ],
  data () {
    return {
      id:'',
      infoArr:{},
      curActiveIndex:-1,
      blnShowScroll:false,
      scrollIns:null,
      scrollDom:null,
      blnShowList_pop:true,//是否显示列表框数据
      searchType:searchType
    }
  },
  watch:{
    data(){
      this.$nextTick(()=>{
        this.reloadyScroll();
      });
    }
  },
  mounted(){
    this.$store=this.$store || this.store;
    this.id='HList'+tool.guid();
    //数据唯一标识符
    this.$nextTick(()=>{
      this.scrollDom=$(`div[id="${this.id}"]`).find('div[name="scrollBar"]');
      this.initScroll();
      ripple.Init(`div[id="${this.id}"] > div[name="HList_ripple"]`);
    });
   
    this.$store.commit(BODY_RESIZE,()=>{
        this.reloadyScroll();
    });
  },
  methods:{
    pageChange(num){
      this.$emit('pageChange',(num || 0));
    },
    //搜索按钮单击事件
    query_click(){
      this.$emit('search');
    },
    //过滤掉不需要显示的字段
    filterField(val,blnChild){
      if(!this.showField && !blnChild)return {};
      if(!this.childColumn && blnChild)return {};

      let result={};
      let showField=blnChild?this.childShowField:this.showField;
      for(let index in showField.split(',')){
        result[showField.split(',')[index]]=val[showField.split(',')[index]];
      }
      return result;
    },
    //行操作项单击事件
    rowActionClick(actionName,item){
      this.$emit(actionName,item);
    },
    //操作项单击事件
    actionClick(actionName){
      //console.log(actionName);
      this.$emit(actionName);
    },
    tag_actionClick(actionName,data){
      this.$emit(actionName,data);
    },
    tag_check(val,blnSel){
      this.$emit(val.action,blnSel?val:null);
    },
    //显示或隐藏列表框
    blnShowList(blnExplan){
      this.blnShowList_pop=!blnExplan;
      this.$emit('showChange',this.blnShowList_pop);
      this.$nextTick(()=>{
        this.reloadyScroll();
      });
    },
    //搜索按钮单击事件
    seachClick(val,actionName){
      this.$emit(actionName,val);
    },
    //数据项单击事件
    itemClick(val,index){
      Vue.set(this.infoArr,index,!this.infoArr[index]);
      this.$emit('rowClick',val);
      if(this.blnRowClick){
        this.curActiveIndex=index;
      }
      this.$nextTick(()=>{
        this.reloadyScroll();
      });
    },
    //初始化滚动条
    initScroll(){
     this.scrollIns = new Sly($(`#${this.id} .scrollContainer`),{
        speed:200,
        scrollBy:50,
        scrollBar:`#${this.id} .scrollbar`,
        dynamicHandle: 0,
        dragHandle: 1,
        mouseDragging: 0});
      
      setTimeout(()=>{
            this.scrollIns.init();
            this.reloadyScroll();
      },0); 

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
      let scrollContainerH=this.scrollDom.height();
      let gap=(this.scrollIns.rel.slideeSize-this.scrollIns.rel.frameSize)*(this.scrollIns.rel.frameSize/this.scrollIns.rel.slideeSize);
      this.scrollDom.find('.handle').css('height',(scrollContainerH-gap)<20?20:(scrollContainerH-gap)+'px');
    }
  }
}
</script>
<style>
  .dataMass_datarange .el-date-editor{width:200px !important;}
</style>
<style scoped lang="less">
  @import "../css/variables.less";
  @itemH:50px;
  @sItemH:@itemH*.8;
  @identifyR:30px;
  @titleH:26px;
  @barLeftW:100px;
  @barRightH:300px;

  .HList{width:100%;height:auto;overflow: hidden;position:relative;}
  .HList.show{height:100%;}
  .HList .container{width:100% !important;list-style:none;padding-left:0px;padding:0px;}

  .HList.small .container .row{line-height:@sItemH;height:@sItemH;text-align:left;margin:0px;display:table;width:100%;}
  .HList .container .row{line-height:@itemH;height:@itemH;text-align:left;margin:0px;display:table;width:100%;}

  .HList .container .row.info:hover{background-color: transparent;}
  .HList .container .row .fragment{display:table-cell;.border('bottom');.border('right');padding:0px 0px 0px 0px;vertical-align: middle;}
  .HList .container .row .fragment:last-child{border-right:none;}

  .HList .icon{font-size:16px;cursor:pointer;}
  .HList .importRow{color:#e1546c;cursor:pointer;}
  .HList .readRow{color:rgb(32, 160, 255);}
  .HList .info{text-align:left;padding: 0px 10px;}

  .HList .expan{background-color:@btn_Bg_Col_5;color:white;}
  .HList .container .row.expan:hover{background-color:@btn_Bg_Col_5;}
  .HList .container .row.expan >span{border:none;}
  .HList .container .row.expan + li{border-top:none;border-bottom-left-radius:5px;border-bottom-right-radius:5px;margin-bottom:5px;
    -moz-box-shadow:2px 2px 5px #333333; -webkit-box-shadow:2px 2px 5px #333333; box-shadow:2px 2px 5px #333333;
  }
  .HList .container .row.expan .readRow{color:white !important;}

  .HList .identi .item{margin:auto;width:@identifyR;height:@identifyR;display:block;background-color:@btn_Bg_Col_hover_1;border-radius:@identifyR/2;line-height:@identifyR;color:white;}

  //下拉框样式
  .small .containerScroll{width:100%;height:~"calc(100% - @{titleH} - 26px - 40px - @{sItemH} - 1px)";position: relative;}
  .containerScroll{width:100%;height:~"calc(100% - @{titleH} - 26px - 40px - @{itemH} - 1px)";position: relative;}
  .scrollContainer{width:100%;height:100%;}

  .small .scroll_noPage{height:~"calc(100% - @{titleH} - 26px - @{sItemH} - 1px)"}
  .scroll_noPage{height:~"calc(100% - @{titleH} - 26px - @{itemH} - 1px)"}

  .scroll_noTitle{height:100%;}
  .small .hasPageNotitle{height:~"calc(100% - 40px - @{sItemH} - 1px)"}
  .hasPageNotitle{height:~"calc(100% - 40px - @{itemH} - 1px)"}

  .small .noPageNotitle{height:~"calc(100% - @{sItemH}  - 1px)";}
  .noPageNotitle{height:~"calc(100% - @{itemH}  - 1px)";}
  .scrollbar:hover {cursor:pointer;}
  .scrollbar { border:1px solid @borderCol;border-radius:5px;width: 10px; height: ~"calc(100% - @{titleH} - 20px)"; position: absolute;right: 5px;top: 0px;background:white;margin-top:10px;}
  .scrollbar .handle {width: 100%;height: 100px;background: @btn_Bg_Col_1;}

  .blnPage .scrollbar{display:block;}


  //操作栏相关样式
  .HList .optionBar{text-align:left;margin:10px 10px;height:32px;}
  //操作栏布局框样式
  .HList .optionBar .left{float:left;width:@barLeftW;height:@titleH;}
  .HList .optionBar .right{float:right;min-width:@barRightH;height:@titleH;text-align:right;line-height:@titleH;font-size:12px;}
  .HList .optionBar .center .item,
  .HList .optionBar .right .item{cursor:pointer;display:inline-block;border:1px solid @btn_Bg_Col_hover_1;color:@FontCol;font-size:12px;border-radius:5px;margin-left:10px;}
  .HList .optionBar .center .item .icon,
  .HList .optionBar .right .item .icon{text-align:center;background-color: @btn_Bg_Col_hover_1;color: white;width: 30px;font-size:14px;float:right;line-height: 26px;}

  .HList .optionBar .center{margin-left:@barLeftW;margin-right:@barRightH;height:@titleH;line-height:@titleH;}

  //标题栏插件样式
  .HList .titleComp{line-height:@titleH;}

  .HList .tag_label:hover{color:@btn_Bg_Col_hover_1;}

  .HList .row_item{overflow: hidden;text-overflow:ellipsis;white-space:nowrap}
  .HList .row.header{color:white;}
  html{.TCol(~".HList .row.header",'bg');}
  .HList .page_container{.border('top');.border('bottom');}

  .HList .blnClick{cursor:pointer;}
  .active{background-color:@btn_Bg_Col_5; color:white;}
</style>
