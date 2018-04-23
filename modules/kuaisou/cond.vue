<!-- 配置条件组件 -->
<template>
    <div class="cond">
        <!--数据源列表-->
        <div class="sourceList">
            <!--标题栏-->
            <div class="title">
                <span class="name">数据源列表</span>
            </div>
            <!--数据源列表-->
            <div class="source_list">
                <Scroll :listen="sources" ref="sourceList">
                    <template v-for="(s,i) in sources" >
                        <div class="source_item" :class="{active:curTagIndex==i}" @click="tagClick(i)">
                            {{i+1}}.{{s.name}}
                            <el-tooltip class="item" effect="light" content="关联" placement="right">
                                <i class="fa fa-chain" :class="{hasSet:pages[s.key]}" @click.stop="relativePage(s)"></i>
                            </el-tooltip>
                        </div>
                        <div class="source_item_child column" col="true" v-for="f in s.fields" v-show="curTagIndex==i" @mousedown="field_mousedown($event,f)">
                            <div class="child_container">
                                <div class="labelTitle">{{f.name}}</div>
                                <div class="desc">{{f.desc}}</div>
                                <div class="val"><span style="font-style:italic;margin-right:5px;font-weight:600;">参考值:</span>{{f.previewVal}}</div>
                            </div>
                        </div>
                    </template>
                </Scroll>
            </div>
        </div>
        <!--内容展示区域-->
        <div class="content">
            <!--标题栏-->
            <div class="title">
                <span class="name">排版布局</span>
                <span style="font-weight:400;font-size:12px;" v-if="this.selSources[this.curTagIndex]">({{this.selSources[this.curTagIndex].name}})</span>
            </div>
            <!--布局内容-->
            <div class="layout">
                <Layout ref="layout" :fields="fields" v-on:insertAfter="insertAfter" v-on:removeAfter="removeAfter" />
            </div>
            <!--预览-->
            <div class="title">
                <span class="name">预览</span>
                <div class="option_bar_right">
                    <span class="item"><i class="fa fa-refresh" style="margin-right:5px;"></i>刷新</span>
                    <span class="item" @click="fullSrceen()"><i class="fa fa-arrows-alt" style="margin-right:5px;"></i>全屏预览</span>
                </div>
            </div>
            <!--预览内容-->
            <div class="preView">
                <LayoutPreView :sources="selSources" :model='1' />
                <!--每页显示条数-->
                <div class="pager_num">
                    <div style="height:36px;line-height:36px;">
                       <div style="float:left;font-style:italic;margin-right:10px;font-size:12px;font-weight:600;">展示条数 :</div> 
                       <el-input-number v-model="pageLimit" :min="1" :max="10000"></el-input-number>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapState,mapMutations} from 'vuex'
import Scroll from 'components/scroll'
import ParamPass from 'components/ParamPass'
import Layout from 'components/Layout'
import LayoutPreView from 'components/LayoutPreView'
import {Clear_Set_Setting_Obj,Set_Setting_Obj,SetKuaiSouPageGo} from '../../store/mutation-types'

export default {
  name: 'cond',
  components:{Scroll,Layout,LayoutPreView},
  data () {
    return {
        curTagIndex:-1,//当前选中数据源列表Tag项索引
        fields:[],
        sources:[],
        pageLimit:10,//每页显示条数
        pages:{},//关联页面配置
    }
  },
  watch:{
      curTagIndex(){
       //切换每个数据源的布局对象
       if(this.selSources[this.curTagIndex]){
           if(!this.selSources[this.curTagIndex].layout){
                Vue.set(this.selSources[this.curTagIndex],'layout',[])
           }
           
           this.fields=this.selSources[this.curTagIndex].layout;
       }else{
           this.fields=[];
       }
      
       this.$nextTick(()=>{
           this.calcLayout();
           this.$refs.sourceList.reloadyScroll();
       });
      },
      sources:{
        deep:true,
        handler(){
            this.$nextTick(()=>{
                this.$refs.sourceList.reloadyScroll();
            });
        }
      },
      selSources:{
          deep:true,
          handler(){
              this.hanlderSources();
          }
      },
      config:{
          deep:true,
          handler:function(){
              this.$store.commit(Set_Setting_Obj,this.config);
          }
      }
  },
  computed:mapState({
    PageData:state=>{
        return state.kuaisou;
    },
    config(){
        return {
            curTagIndex:this.curTagIndex,
            pageLimit:this.pageLimit,
            pages:this.pages
        }
    },
    selSources:state=>{
      return state.kuaisou.curSelTable;
    },
    menus:state=>{
      return _.chain(tool.Clone(state.menus)).pluck('menus').flatten().filter(m=>m.kind).value();
    },
    dataSouce:state=>{return state.oriSource;},
    tables(){
        let dataSource=tool.Clone(this.dataSouce);

        let data =_.extend(..._.chain(dataSource).values().pluck('tables').value());

        return data;
    },
  }),
  mounted(){
    this.hanlderSources();
    this.recoverData();
  },
  methods:{
    //清空页面数据
    clearData(){
        this.$store.commit(Clear_Set_Setting_Obj);
    },
    //恢复页面之前操作的值
    recoverData(){
        let {curTagIndex,pageLimit,pages} =this.PageData;
        this.curTagIndex=curTagIndex;
        this.pageLimit=pageLimit;
        this.pages=pages;
    },
    //关联页面
    relativePage(source){
        let s=this;
        tool.open(function(){
            let html=`
                <div class="form-group" style="margin-bottom:10px !important;line-height:36px">
                    <label class="col-sm-2 control-label" style="font-weight:300;width:60px;">菜单</label>
                    <div class="col-sm-10" style="width:calc(100% - 60px);">
                        <el-select v-model="menu" placeholder="请选择" @change="menuChange">
                            <el-option
                            v-for="item in options"
                            :label="item.name"
                            :value="item">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="clearfix"></div>
                </div>
                <div class="form-group" style="margin-bottom:10px !important;margin-top:20px !important;padding:0px 15px;">
                    <ParamPass :result="mapRes" :source="source" :target="target" />
                </div>
                <div class="optionBar" style="text-align:right;padding-right:15px;">
                    <button type="button" class="btn btn-success" @click="submit_btn()">确定</button>
                    <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
                </div>
            `;
            let params={
                title:'添加关联页面',
                area:'600px',
                content:`<div class="add_btn_option" style="padding:10px;">${html}</div>`,
                components:{ParamPass},
                context:{
                    menu:_.find(s.menus,m=>m.keyid==(s.pages[source.key] || {menu:{keyid:''}}).menu.keyid) ||'',
                    source:_.map(s.tables[source.key].fields,f=>{f.tableKey=source.key; return f;}),
                    target:(_.find(s.menus,m=>m.keyid==(s.pages[source.key] || {menu:{keyid:''}}).menu.keyid) || {condtionsObj:{indexFields:[]}}).condtionsObj.indexFields,
                    mapRes:tool.Clone((s.pages[source.key] || {mapFields:[]}).mapFields),
                    options:s.menus,
                    submit_btn(){
                        let menu =params.selfData.menu;
                        s.pages[source.key]={
                            menu:{keyid:menu.keyid,icon:menu.icon,name:menu.name},
                            mapFields:params.selfData.mapRes
                        };

                        params.close();
                    },
                    cancel_btn(){
                        params.close();
                    },
                    menuChange(menu){
                        if(!menu){return;}
                        let data=params.selfData;
                        data.target=menu.condtionsObj.indexFields;
                    }
                }
            };

            return params;
        }());

    },
    //判断数据源列表中的字段是否已经被去除,去除则需要重新制定布局
    calcLayout(){
        let s=this;
        if(!s.selSources[this.curTagIndex]) return;
        let source=s.selSources[this.curTagIndex];
        //没有进行过布局则不需要处理
        if(!source.layout || (source.layout && source.layout.length<=0)) return;
        
        let removeItems=[];
        for(let r=0;r<source.layout.length;r++){//行
            for(let c=0;c<source.layout[r].length;c++){//列
                //存在则不处理
                if(_.find(source.fields,f=>{
                    return f.key==source.layout[r][c].key;
                })){
                    continue;
                }

                removeItems.push({r:r,c:c,f:source.layout[r][c],cols:source.layout[r].length});
            }
        }
        for(let i=0;i<removeItems.length;i++){
            let item=removeItems[i];

            s.$refs.layout.removeField(item.f,item.r,item.c);
            //重新调整其他删除项的位置参数(由于删除一列后可能会造成之前的位置参数变动)
            for(let j=1+i;j<removeItems.length;j++){
                let closeRow=item.cols-1==0,otherItem=removeItems[j];
                
                if(closeRow && otherItem.r>item.r){//删除行
                    otherItem.r-=1;
                }

                if(otherItem.r==item.r ){//同行
                   if(otherItem.c>item.c){
                       otherItem.c-=1;
                   }
                   otherItem.cols-=1;
                }
            }
        }
        
    },
    //处理数据源数据
    hanlderSources(){
        let sources=tool.Clone(this.selSources);
        sources=_.map(sources,s=>{
            s.fields= _.filter(s.fields,f=>{
                let layoutKeys=','+_.chain(s.layout || []).flatten().pluck('key').value().join(',')+',';
                return layoutKeys.indexOf(','+f.key+',')<0
            });

            return s;
        });
        this.sources=sources;
    },
    //数据源列表Tag项单击事件
    tagClick(i){
        this.curTagIndex=this.curTagIndex==i?-1:i;
    },
    //字段拖动功能按下事件
    field_mousedown(e,d){
        this.$refs.layout.drag(e,d);

    },
    //字段插入布局控件后
    insertAfter(d){
        //删除插入的字段控件
        let fields=this.sources[this.curTagIndex].fields || [];
        if(fields.length<=0)return;
        let index = _.findIndex(fields,f=>{return f.key==d.key});
        if(index<0)return;
        fields.splice(index,1);
    },
    //字段删除布局控件后
    removeAfter(d){
        let fields=this.sources[this.curTagIndex].fields || [];
        //获取未修改前的源数据字段相关信息
        let oriCol = _.find(this.selSources[this.curTagIndex].fields,f=>f.key==d.key);
        if(!oriCol)return;
        fields.unshift(oriCol);
    },
    //全屏预览
    fullSrceen(){
        let s=this;
        tool.open(function(){
            let html=`
                    <div name="mask" style="position:absolute;top:0px;left:0px;bottom:0px;right:0px;background-color:white;z-index:100;"></div>
                    <LayoutPreView ref="LayoutPreView" :sources="selSources" :model="1" :store=store />
                    `;
            let param={
                title:'全屏预览',
                initMaxMin:true,
                offset: ['0px', '0px'],
                components:{LayoutPreView},
                content:`<div class="Layout_pop" style="width:100%;height:100%;">${html}</div>`,
                context:{
                    store:s.$store,
                    selSources:s.selSources
                },
                success(layero, index){
                    setTimeout(()=>{
                        param.$refs.LayoutPreView.layout();
                        layero.find('div[name="mask"]').remove();
                    },600);
                },
            };

            return param;
        }());
    }
  }
}
</script>
<style scoped lang="less">
  @import "../../css/variables.less";
  .cond{width:100%;height:100%;text-align:left;}
  
  @sourceListW:200px;
  .sourceList{width:@sourceListW;height:100%;float:left;.border('right'); -webkit-user-select:none; -moz-user-select:none; -ms-user-select:none; user-select:none}
  .content{width:~'calc(100% - @{sourceListW})';height:100%;margin-left:@sourceListW;}

  .content .option_bar_right{float:right;height:100%;}
  .content .option_bar_right .item{cursor:pointer;margin-left:10px;}
  .content .option_bar_right .item:hover{color:@Font_Hover_Col;}

  @titleH:40px;
  .sourceList .title,.content .title{
      width:100%;height:@titleH;line-height:@titleH;padding:0px 10px;.border('top');.border('bottom');font-weight:600;font-style: italic;
    }
  .content .layout{width:100%;height:~'calc(50% - @{titleH})';}
  .content .preView{width:100%;height:~'calc(50% - @{titleH})';position:relative;}

  .content .preView .pager_num{position:absolute;right:5px;top:5px;}
  
  .sourceList .source_list{width:100%;height:~'calc(100% - @{titleH})';}

  @sourceItemH:40px;
  .sourceList .source_list .source_item{
    width:100%;height:@sourceItemH;line-height:@sourceItemH;.border('bottom');padding:0px 10px;font-style:italic;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: block;position:relative;
    cursor:pointer;
  }

  .sourceList .source_list .source_item .item{position:absolute;right:18px;}
  .sourceList .source_list .source_item .item:hover{color:@Font_Hover_Col;}

  .sourceList .source_list .source_item.active:before,
  .sourceList .source_list .source_item:hover:before{
    content:'';
    position:absolute;
    top:0px;
    left:-10px;
    right:-10px;
    height:2px;
    background-color:@Font_Hover_Col;
    cursor:pointer;
  }
  .sourceList .source_list .source_item_child{width:100%;.border('bottom');padding:5px;font-size:12px;}
  .sourceList .source_list .source_item_child .child_container{width:100%;height:100%;.border('');border-radius:5px;padding:10px;}
  .sourceList .source_list .source_item_child:hover .child_container{cursor:pointer;.border('',@Font_Hover_Col);}
  .sourceList .source_list .source_item_child .child_container .labelTitle{font-style:italic;font-weight:600;.border('bottom');text-overflow: ellipsis;overflow: hidden;white-space: nowrap;display: block;}
  .sourceList .source_list .source_item_child .child_container .desc{margin:5px 0px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;display: block;}
  .sourceList .source_list .source_item_child .child_container .val{text-overflow: ellipsis;overflow: hidden;white-space: nowrap;display: block;}

  .dragDom{text-overflow: ellipsis;overflow: hidden;white-space: nowrap;display: block;z-index:100;background-color:white;padding:10px;border-radius:5px;}

  .cond .hasSet{color:@Font_Hover_Col;}
</style>
