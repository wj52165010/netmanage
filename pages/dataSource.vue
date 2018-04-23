<!-- 数据源组件 -->
<template>
    <div class="dataSource">
        <!--<div class="FieldContainer"><LabelPage></LabelPage></div>-->
        <!--数据源类型-->
        <div class="data_kind">
            <div class="scrollContainer">
                <div class="slidee">
                    <div class="item" v-for="(menu,index) in menus" :class="{active:curKindIndex==index}" @click="kind_click(index)">
                        <i class="icon" :class="gclass(menu.icon,index)"></i>
                        <div class="content">
                            <div class="container">
                                <span>{{menu.name}}</span>
                                <div class="desc">{{menu.desc}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="scrollbar dataSource_scrollbar" v-show="blnPage">
                <div class="handle"></div>
            </div>
        </div>
        <!--具体类型下的数据源-->
        <div class="data_soucre">
            <div class="header"><span class="title"><i :class="curKind.icon"></i><span>{{curKind.name}}</span></span></div>
            <div class="content" :class="gclass_source(curKindIndex)">
                <div class="scrollContainer">
                    <div class="slidee">
                        <div class="gallery-wrapper">
                            <div class="item" v-for="item in curKind.tables" @click="source_click(item,curKind)">
                                <div class="title">
                                    <i class="fa fa-check selItem" :class="{sel:blnSel(item)}"></i>
                                    <i class="fa fa-reorder detail" @click.stop="source_fields(item.fields,item)"></i>
                                    <div class="info">{{item.name}}</div>
                                </div>
                                <div class="content">{{item.desc || '&nbsp;'}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="scrollbar dataSource_scrollbar" v-show="blnSourcePage">
                    <div class="handle"></div>
                </div>
            </div>
            <div class="footer">
                <div class="left">
                    <LabelPage ref="sourceField" title="数据源字段" page="fieldListComp" :actions="actions" :data="fields" :pageProp="{noCheckBox:true,tableKey:curLookSource && curLookSource.key}"></LabelPage>
                </div>
                <div class="right">
                    <LabelPage ref="selSource" title="已选数据源" page="sourceListComp" :data="selSources" v-on:delItem="source_click"></LabelPage>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapState,mapMutations} from 'vuex'
import LabelPage from '../components/LabelPage'
import {BODY_RESIZE,SET_TABLE_DATA,SET_ALL_TABLE_DATA,Date_Source,Reg_Menu_Change_Even,Set_Source_data,Set_Show_data,upload_get_fileparse} from '../store/mutation-types'
import '../../static/pinterest_grid/pinterest_grid.js'
import optionHandle from '../js/dao/handlePop.js'
import {add as addSource} from 'modules/source'
// import {tool} from '../js/tool.js'
let sly=null;
let source_sly=null;
export default {
  name: 'DataSource',
  components:{
      LabelPage
  },
  data () {
    return {
      blnSingle:true,//知否只能选择一个数据源
      blnPage:false,
      blnSourcePage:false,
      curKind:{},//当前选中数据类型
      curKindIndex:0,//当前选中的数据类型索引
      fields:[],//当前选中数据源的字段集合
      selSources:[],//已选数据源
      menus:{},
      curLookSource:null,//当前正在查看的数据
    }
  },
  watch:{
    config:{
        deep: true,
        handler: function (val, oldVal) { 
            this.$store.commit(Set_Source_data,this.config);
        }
    },
    dataSouce(){
        this.menus=tool.Clone(this.dataSouce);
        if(!this.menus[this.curKindIndex]) return;
        this.curKind=this.menus[this.curKindIndex];
    }
  },
  computed:mapState({
     config(){
         return{
             curKindIndex:this.curKindIndex,
             curKind:this.curKind,
             fields:this.fields,
             selSources:this.selSources
         }
     },
     //删除监听对象
     delSourceMon:state=>{
         return state.setting.sourceDel;
     },
     //关联操作
     actions(){
        return optionHandle.convertOptionIcon(this.curLookSource);
     },
     dataSouce:state=>{return state.oriSource;}
  }),
  mounted(){
    //监听菜单数据改变事件
    this.$store.commit(Reg_Menu_Change_Even,(menu)=>{
        let self=this;
        if(menu.dataSourceConfig){
           this.curKindIndex=menu.dataSourceConfig.curKindIndex;
           _.each(this.menus,v=>{
               _.each(v.tables,t=>t.c_sel=false)
           });
           this.curKind=this.menus[this.curKindIndex];

           this.fields=[];
    
           if(menu.condtionsObj && menu.condtionsObj.target){
               let tempSources=[],len=menu.condtionsObj.target.split(',').length;
               for(let kind in self.menus){
                   if(len==tempSources.length){break;}
                   for(let table in self.menus[kind].tables){
                       if((','+menu.condtionsObj.target+',').indexOf(','+self.menus[kind].tables[table].key+',')>=0){
                           self.curKindIndex=kind;
                           self.curKind=self.menus[self.curKindIndex];

                           Vue.set(self.menus[kind].tables[table],'parentobj',{name:self.menus[kind].name,c_index:self.getIndexVal(kind),icon:self.menus[kind].icon});
                           tempSources.push(self.menus[kind].tables[table]);
                           if(len==tempSources.length){break;}
                       }
                   }
               }
               this.selSources=tool.Clone(tempSources);
           }else{
               this.selSources=[];
           }
           this.$nextTick(()=>{
              $(window).resize();
            });
        }else{
            this.curKindIndex=0;
            this.curKind={};
            this.fields=[];
            this.selSources=[];
        }

        // if(menu.dataSourceConfig){
        //     this.curKindIndex=menu.dataSourceConfig.curKindIndex;
        //     this.curKind=menu.dataSourceConfig.curKind;
        //     this.fields=menu.dataSourceConfig.fields;
        //     this.selSources=menu.dataSourceConfig.selSources;
        //     this.$nextTick(()=>{
        //       $(window).resize();
        //     });
        // }else{
        //     this.curKindIndex=0;
        //     this.curKind={};
        //     this.fields=[];
        //     this.selSources=[];
        // }
    });

    //获取数据源

    this.menus=tool.Clone(this.dataSouce);

    // let self=this;
    // self.$store.dispatch(Date_Source).then(data=>{
    //     self.menus=data;
    //     let firstSourceIndex='';//第一个数据源的键值
    //     for(let key in self.menus){
    //         firstSourceIndex=key;break;
    //     } 
    //     //this.kind_click(firstSourceIndex);
    //     //设置所有的数据源
    //     let allTables=[];
    //     for(let key in self.menus){
    //         self.menus[key].icon='fa fa-road';
    //         let tables=self.menus[key].tables || [];
    //         for(let tableKey in tables){
    //             allTables.push(tables[tableKey]);
    //         }
    //     }
    //     this.$store.commit(SET_ALL_TABLE_DATA,allTables);
    // });

    this.$nextTick(()=>{
        sly=new Sly($('.data_kind .scrollContainer'),{
        itemNav: "basic",
        speed:200,
        scrollBy:1,
        scrollBar:'.data_kind > .dataSource_scrollbar',
        dragHandle:true,
        dynamicHandle:true,
        smart:1});
        setTimeout(()=>{
            sly.init();
            this.blnPage=sly.pages.length>1;
        },0);
        

        source_sly=new Sly($('.data_soucre .content .scrollContainer'),{
        speed:200,
        scrollBy:50,
        scrollBar:'.data_soucre .content .dataSource_scrollbar',
        dynamicHandle: 0,
        dragHandle: 1,
        mouseDragging: 0});
        setTimeout(()=>{
            source_sly.init();
            this.blnSourcePage=source_sly.rel.slideeSize>source_sly.rel.frameSize;
        },0);
        $(".gallery-wrapper").pinterest_grid({
            scope:[{width:1300,column:3}],
            no_columns:5,
            margin_bottom:40,
            reload:()=>{source_sly.reload();this.blnSourcePage=source_sly.rel.slideeSize>source_sly.rel.frameSize;}
        });

        this.$store.commit(BODY_RESIZE,()=>{
             sly.reload();
             source_sly.reload();
             this.blnPage=sly.pages.length>1;
             this.blnSourcePage=source_sly.rel.slideeSize>source_sly.rel.frameSize;
        });
    });
  },
  methods:{
      blnSel(item){
          let res=item.c_sel;
          if(!res){
            for(let selItem of this.selSources){
                if(selItem.key == item.key){res=true;break;}
            }
          }
          return res;
      },
      gclass(icon,index){
          return icon+' '+ 'item_'+this.getIndexVal(index);
      },
      gclass_source(index){
          return 'source_'+this.getIndexVal(index);
      },
      getIndexVal(index){
          let i=0,self=this;
          for(let key in self.menus){
              if(key==index){
                  break;
              }
              i++;
          }

          return i;
      },
      kind_click(index){
          this.curKindIndex=index;
          this.curKind=this.menus[this.curKindIndex];
          this.$nextTick(()=>{
              $(window).resize();
          });
      },
      //具体数据源单击
      source_click(item,parent){
          let s=this;
          let blnHasSel=!!item.c_sel;
          //单选的处理情况
          if(this.blnSingle){
             for(let i in s.menus){
                let menu =s.menus[i];
                for(let j in menu.tables){
                    let table=menu.tables[j];
                    if(!menu.c_index){
                        Vue.set(menu,'c_index',this.getIndexVal(i));
                    }
                    if(!table.parentobj){
                        Vue.set(table,'parentobj',{name:menu.name,c_index:menu.c_index,icon:menu.icon});
                    }
                    if(!table.c_sel){
                        Vue.set(table,'c_sel',false);
                    }else{
                        table.c_sel=false;
                    }
                }
             }

            item.c_sel=true;
            this.selSources=[item];
            blnHasSel?function(){}:this.$store.state.setting.sourceChange.next({currSource:{},curSelFileds:[]});
            this.$refs.selSource.reloadSly();
            return;
          }
          
          //多选的处理情况
          if(!parent.c_index){
              Vue.set(parent,'c_index',this.getIndexVal(this.curKindIndex));
          }
          if(!item.parentobj){
              Vue.set(item,'parentobj',{name:parent.name,c_index:parent.c_index,icon:parent.icon});
          }

          if(!item.c_sel){
            let res=true;
            for(let selItem of this.selSources){
                if(selItem.key == item.key){res=false;break;}
            }
            Vue.set(item,'c_sel',res);
          }else{
            item.c_sel=!item.c_sel;
          }

          if(item.c_sel){
              this.selSources.push(item);
          }else{
              let index=-1;
              for(let i=0;i<this.selSources.length;i++){
                  if(this.selSources[i].key===item.key){index=i;break;}
              }

              this.delSourceMon.next(this.selSources.splice(index,1));
          }

          //this.$store.commit(SET_TABLE_DATA,this.selSources);
          this.$refs.selSource.reloadSly();
      },
      //查看数据源的字段
      source_fields(fields,source){
          this.curLookSource=source;
          this.fields=fields;
          this.$refs.sourceField.reloadSly();
      },
      reloadSly(){
        sly.reload();
        this.blnPage=sly.pages.length>1;
        setTimeout(()=>{$(window).resize();},500);//由于动画需要执行.5秒需要延后执行
      },
      reloadSourceSly(){
          source_sly.reload();
          this.blnSourcePage=source_sly.rel.slideeSize>source_sly.rel.frameSize;
      }
  }
}
</script>
<style lang="less">
    @import "../css/variables.less";
    .fields_item{height:300px;}
</style>
<style scoped lang="less">
    @import "../css/variables.less";
    @FieldH:300px;
    @kindW:270px;
    @kindH:100px;
    @iconR:40px;
    @iconL:10px;
    @Kind_headerH:45px;
    @Kind_contentH:50%;
    @Kind_footerH:~"calc(100% - @{Kind_headerH} - @{Kind_contentH})";
    @FiledContainerW:70%;
    @FiledContainerGap:10px;

    .dataSource{height:100%;}
    .dataSource .FieldContainer{height:@FieldH;}
    .dataSource .data_kind{
        width:@kindW;height:100%;float:left;background-color:@FrontCol;position:relative;
    }
    .dataSource .data_soucre .content .scrollContainer,
    .dataSource .data_kind .scrollContainer{width:100%;height:100%;}
    //具体类型下的数据源
    .dataSource .data_soucre{margin-left:@kindW;height:100%;padding:10px 15px;color:@FontCol;text-align:left;}
    .dataSource .data_soucre .header{.border('bottom');background-color:@FrontCol;padding:0px 10px;height:@Kind_headerH;line-height:@Kind_headerH;}
    .dataSource .data_soucre .header .title{font-size:18px;}
    .dataSource .data_soucre .header .title i{margin-right:10px;}
    .dataSource .data_soucre .header .title span{font-size:16px;}
    .dataSource .data_soucre .content{.border('bottom');background-color:@FrontCol;height:@Kind_contentH;position:relative;};
    .dataSource .data_soucre .footer{background-color:@FrontCol;height:@Kind_footerH;padding:0px !important;}
    .dataSource .data_soucre .content .item{
        position: absolute;background: white;border-radius: 5px;cursor:pointer;.border('');
    }
    .dataSource .data_soucre .item:hover{margin-top:-5px;.trans();}
    .dataSource .data_soucre .content .item .title{position:relative;padding:0px 10px;text-align:left;line-height:30px;color:@FrontCol;background-color:'';border-top-left-radius:5px;border-top-right-radius:5px;}
    .dataSource .data_soucre .content .item .content{padding:10px;font-size:12px;.border('bottom',transparent);border-radius:5px;word-break: break-all;}
    
    .dataSource .data_soucre .content .item .title .selItem{
        float:right;right:10px;height:30px;font-size:20px;
        color:shade(@FrontCol,10%);line-height:30px;
    }
    .dataSource .data_soucre .content .item .title .selItem.sel{color:@HeaderBgCol;}
    .dataSource .data_soucre .content .item .title .detail{float:right;margin-right:10px;height:30px;line-height:30px;}
    .dataSource .data_soucre .content .item .title .info{margin-right:50px;white-space:nowrap; text-overflow:ellipsis;-o-text-overflow:ellipsis;overflow: hidden; }
    
    
    .dataSource .data_soucre .content.source_0 .item .title{background-color:@btn_Bg_Col_0;}
    .dataSource .data_soucre .content.source_1 .item .title{background-color:@btn_Bg_Col_hover_2;}
    .dataSource .data_soucre .content.source_2 .item .title{background-color:@btn_Bg_Col_hover_3;}
    .dataSource .data_soucre .content.source_3 .item .title{background-color:@btn_Bg_Col_hover_4;}
    .dataSource .data_soucre .content.source_4 .item .title{background-color:@btn_Bg_Col_hover_5;}

    //数据源类型
    .dataSource .data_kind .item{
        height:@kindH;position:relative;padding:@iconL;padding-left:@iconL+@iconR/2;padding-right:@iconL*2;
    }
    .dataSource .data_kind .item .icon{
        height:@iconR;width:@iconR;border-radius:50%;line-height:@iconR;color:@FrontCol;
        position:absolute;left:@iconL;top:50%;margin-top:-(@iconR/2);z-index:100;background-color:@FrontCol;
    }
    .dataSource .data_kind .item .content{
        .border("");height:100%;border-radius:5px;cursor:pointer;text-align:left;
    }
    .dataSource .data_kind .item .content .container{width:100%;height:100%;padding:10px @iconR/2 10px @iconR/2+5;}
    .dataSource .data_kind .item .content .container span{font-weight:600;}
    .dataSource .data_kind .item .content .container .desc{font-size:12px;}

    .dataSource .data_kind .item.active {background-color:shade(@FrontCol,5%);.border('bottom');.border('top');.border('right',transparent)}
    .dataSource .data_kind .item.active .icon.item_0 + .content {background-color:@btn_Bg_Col_0;.border('',@btn_Bg_Col_0);color:@FrontCol;}
    .dataSource .data_kind .item.active .icon.item_1 + .content {background-color:@btn_Bg_Col_hover_2;.border('',@btn_Bg_Col_hover_2);color:@FrontCol;}
    .dataSource .data_kind .item.active .icon.item_2 + .content {background-color:@btn_Bg_Col_hover_3;.border('',@btn_Bg_Col_hover_3);color:@FrontCol;}
    .dataSource .data_kind .item.active .icon.item_3 + .content {background-color:@btn_Bg_Col_hover_4;.border('',@btn_Bg_Col_hover_4);color:@FrontCol;}
    .dataSource .data_kind .item.active .icon.item_4 + .content {background-color:@btn_Bg_Col_hover_5;.border('',@btn_Bg_Col_hover_5);color:@FrontCol;}

    .dataSource .data_kind .item:hover .icon.item_0 + .content {.border('',@btn_Bg_Col_0);}
    .dataSource .data_kind .item:hover .icon.item_1 + .content {.border('',@btn_Bg_Col_2);}
    .dataSource .data_kind .item:hover .icon.item_2 + .content {.border('',@btn_Bg_Col_3);}
    .dataSource .data_kind .item:hover .icon.item_3 + .content {.border('',@btn_Bg_Col_4);}
    .dataSource .data_kind .item:hover .icon.item_4 + .content {.border('',@btn_Bg_Col_5);}
    .dataSource .data_kind .item .icon.item_0{background-color:@btn_Bg_Col_hover_0;}
    .dataSource .data_kind .item .icon.item_1{background-color:@btn_Bg_Col_2;}
    .dataSource .data_kind .item .icon.item_2{background-color:@btn_Bg_Col_3;}
    .dataSource .data_kind .item .icon.item_3{background-color:@btn_Bg_Col_4;}
    .dataSource .data_kind .item .icon.item_4{background-color:@btn_Bg_Col_5;}


    .scrollbar:hover {cursor:pointer;}
    .scrollbar { border:1px solid @borderCol;border-radius:5px;width: 10px; height: ~'calc(100% - 20px)'; position: absolute;right: 5px;top: 0px;background:white;margin-top:10px;}
    .scrollbar .handle {width: 100%;height: 100px;background: @btn_Bg_Col_1;border-radius:5px;}

    .blnPage .scrollbar{display:block;}

    .gallery-wrapper{position:relative;max-width:~'calc(100% - 20px)';width:~'calc(100% - 20px)';margin:10px;}

    //页面底部
    .dataSource .data_soucre .footer .left{width:@FiledContainerW;float:left;height:100%;.border('right')}
    .dataSource .data_soucre .footer .right{margin-left:~"calc(@{FiledContainerW} + @{FiledContainerGap})";.border('left');height:100%;}
</style>
