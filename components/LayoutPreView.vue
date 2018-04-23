<!-- 快搜内容展示组件 -->
<template>
    <div class="LayoutPreView">
        <!--内容展示区域-->
        <div class="info_content">
            <!--正在查询中提示信息-->
            <div class="tipInfo" v-show="blnLoading">
                <div class="tipInfo_container">
                    <div class="tipInfo_info">
                        正在查询中,请稍后<i class="fa fa-spinner fa-pulse"></i>
                    </div>
                </div>
            </div>
            <!--空数据提示信息-->
            <div class="tipInfo" v-show="blnEmpty">
                <div class="tipInfo_container">
                    <div class="tipInfo_info">
                        <img src="../assets/cry.png" style="width:50px;" />&nbsp;暂未找到相关数据
                    </div>
                </div>
            </div>
            <Scroll :listen="data" ref="contentScroll" :store="store">
                <template v-for="d in data" v-if="_sources[d.sourceKey] && _sources[d.sourceKey].layout && _sources[d.sourceKey].layout.length>0">
                    <div class="row">
                        <!--行标题-->
                        <div class="row_title" :class="{underline:n_pages[d.sourceKey]}"><span class="info" @click="titleClick(d)">{{_sources[d.sourceKey].name}}</span></div>
                        <!--内容展示区域-->
                        <div class="content">
                            <template v-for="r in _sources[d.sourceKey]._layout">
                                <div class="item">
                                    <div class="field" v-for="c in r" :class="{flowhide:r.length>1}" :style="{width:r.length>1?c.width+'px':'100%'}">
                                        <span class="title">{{c.name}}</span>
                                        <span class="colon">:</span>
                                        <span class="val">{{d[c.key]}}</span>
                                    </div>
                                </div>
                            </template>
                        <div>
                    </div>
                
                </template>
            </Scroll>
        </div>
        <!--分页-->
        <div class="pager_container">
            <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageIndex+1}}</span></span>
            <div class="firstPage" @click="pageChange(0)">首页</div>
            <div class="prePage" @click="pageChange(pageIndex-1)">上一页</div>
            <div class="nextPage" @click="pageChange(pageIndex+1)">下一页</div>
        </div>
    </div>
</template>

<script>
import { mapState,mapMutations} from 'vuex'
import {PreviewSearch,DataSearch,GetSearch,Get_Operate} from '../store/mutation-types'
import tmpDAO from '../js/dao/tmpDao.js'
import Scroll from 'components/scroll'
export default {
  name: 'LayoutPreView',
  props:['sources','pages','store','keyword','model'],
  components:{Scroll},
  data () {
    return {
      cw:0,//容器宽度
      data:[
         
      ],
      pageIndex:0,
      RxSub:null,
      n_pages:{},
      menus:[],//菜单数据
      blnLoading:false,
      blnEmpty:false,
    }
  },
  watch:{
      sources:{
          deep:true,
          handler(){
            this.$nextTick(()=>{
                this.$refs.contentScroll.reloadyScroll();
            });
          }
      },
      _sources:{
          deep:true,
          handler(){
            this.$nextTick(()=>{
                this.$refs.contentScroll.reloadyScroll();
            });
          }
      },
      keyword(){
        if(this.model || !this.keyword) return;
        this.pageIndex=0;
        this.RxSub.next({keyword:this.keyword,pageIndex:this.pageIndex});
       
      }
  },
  computed:{
    _sources(){
        let sources=tool.Clone(this.sources);
        let sourceKeyArr=_.pluck(this.sources || [],'key');
        //计算数据源布局对象字段宽度
        for(let i=0;i<this.sources.length;i++){
        let rowW=this.cw,s=this,rows=tool.Clone(this.sources[i].layout || []);
        for(let r=0;r<rows.length;r++){
            let cols=rows[r];
            let remainW=_.reduce(cols, function(memo, num){  return memo + (num.width || 0); }, 0);
            let autoCol=_.filter(cols,d=>!d.width);

            if(autoCol.length>0){
                let autoW=(rowW-remainW-(cols.length)*5)/autoCol.length;
                for(let i=0;i<autoCol.length;i++){
                    autoCol[i].width=autoW <0 ?'':autoW;

                }
            }
        }
        sources[i]._layout=rows;
        }

        return _.object(sourceKeyArr,tool.Clone(sources));
    },
  },
  mounted(){
    this.$store=this.$store || this.store;
    this.n_pages=this.pages || {};
    this.cw=$(this.$el).find('.info_content').width();

    this.RxSub=new this.$store.getters.Rx.Subject();
    this.RxSub.debounceTime(400).subscribe((val)=>{
        //获取快搜数据
        this.blnLoading=true;
        this.blnEmpty=false;
        this.$store.dispatch(DataSearch,{keyword:val.keyword,pageIndex:val.pageIndex}).then(res=>{
            this.blnLoading=false;
            this.data=this.converDataFormat(res.biz_body);
            this.blnEmpty=this.data.length<=0;    
        });
        
    });

    if(this.model){
        //获取预览数据
        this.$store.dispatch(PreviewSearch,{dbkey:_.map(this.sources,s=>s.key)}).then(res=>{
            this.data=this.converData(res.biz_body);
        });
    }
    // else{
    //     //获取快搜数据
    //     this.$store.dispatch(DataSearch,{keyword:this.keyword,pageIndex:this.pageIndex}).then(res=>{
    //         this.data=this.converDataFormat(res.biz_body);
    //     });
    // }

    //获取菜单数据
    this.$store.dispatch(Get_Operate).then(res=>{
        this.menus=res.biz_body;
    });
  },
  methods:{
      //转化预览数据格式
      converData(data){
        return _.flatten(_.map(data,(val,key)=>{
            return _.map(val,v=>{
                v.sourceKey=key;
                return v;
            });
        }));
      },
      //转化快搜数据格式
      converDataFormat(data){
          return _.map(data,d=>{
              d.data.sourceKey=d.source;
              return d.data;
          });
      },
      //标题单击事件
      titleClick(d){
        let option=this.n_pages[d.sourceKey];
        if(!option) return;
        //构造条件
        let extraConditon;
        if(option.mapFields.length>0){
            extraConditon=extraConditon || [];
            for(let field of option.mapFields){
                extraConditon.push({filed:{
                        table:field.target.tableKey,
                        key:field.target.fieldKey,
                        alias:field.target.key,
                        value:d[field.source.fieldKey]
                    },
                    value:d[field.source.fieldKey]
                });
            }
        }
        
        let menu = _.find(this.menus,m=>m.keyid==option.menu.keyid);

        let temp_area=menu.popWidth?menu.popHeight?[menu.popWidth+'px',menu.popHeight+'px']:menu.popWidth+'px':'';
        tmpDAO.openTmp(menu,{extraConditon:extraConditon,intetface:''},this.$store,{title:'详细信息',area:temp_area});

      },
      layout(){
        if(!this.$refs.contentScroll)return;
        this.cw=$(this.$el).find('.info_content').width();
        this.$refs.contentScroll.reloadyScroll();
      },
      //分页
      pageChange(index){
        index=index<0?0:index;
        if(this.pageIndex==index && index==0){
            tool.info('已是首页');
            return;
        }
       
        //获取快搜数据
        this.blnLoading=true;
        this.blnEmpty=false;
        
       
        this.$store.dispatch(DataSearch,{keyword:this.keyword,pageIndex:index}).then(res=>{
            this.blnLoading=false;
            let data=res.biz_body;
            if(data.length<=0 ){
                if(index==0){
                    tool.info('已是首页');
                }else{
                    tool.info('已经到了最后页');
                }
                return;
            }

            this.pageIndex=index;
            this.data=this.converDataFormat(res.biz_body);
            this.blnEmpty=this.data.length<=0;    
        });
      }
  }
}
</script>

<style scoped lang="less">
  @import "../css/variables.less";
  .LayoutPreView{width:100%;height:100%;padding-bottom:0px;}
   
  @pagerH:40px;
  .info_content{height:~'calc(100%  - @{pagerH})';width:100%;padding:15px;position:relative;}
  .pager_container{height:@pagerH;width:100%;margin:0px;text-align:right;.border('top');}

  @RowH:30px;
  .row{margin-bottom:15px;margin-left:0px;margin-right:0px;}
  .row .info:hover{cursor:pointer;color:@Font_Hover_Col;}
  .row_title{height:@RowH;line-height:@RowH;width:100%;font-size:12px;font-style:italic;font-weight:600;}
  .row_title.underline{text-decoration:underline;}
  .row .content{width:100%;}

  .row .content .item{line-height:@RowH;height:@RowH;}
  .row .content .item .field{font-size: 12px;float:left;margin-right:5px;word-break: break-all;}
  .row .content .item .field .title{font-style:italic;color:@Font_Hover_Col;}
  .row .content .item .field .colon{margin:0px 5px;}

  .flowhide{text-overflow: ellipsis;overflow: hidden;white-space: nowrap;display: block;position:relative;}


  .LayoutPreView .info_content .tipInfo{position:absolute;top:0px;left:0px;right:0px;bottom:0px;}
  .LayoutPreView .info_content .tipInfo .tipInfo_container{display:table;width:100%;height:100%;text-align:center;}
  .LayoutPreView .info_content .tipInfo .tipInfo_container .tipInfo_info{height:100%;vertical-align:middle;display:table-cell;font-weight:600;font-size:18px;}
</style>
