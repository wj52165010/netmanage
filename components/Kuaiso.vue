<!-- 一键快搜插件组件 -->
<template>
    <div class="Kuaiso" :class="{bound:blnBound}" @mouseenter="mouserover()" @mouseleave="mouseout()">
        <div class="btnContainer" :class="{Rotate:blnShowInput}">
            <span v-if="!blnLoadings">快搜</span>
            <i class="fa fa-refresh fa-spin" v-if="blnLoadings" style="font-size:20px;margin-top:16px;"></i>
        </div>
        <!--<div class="inputContainer fadeIn" :class="{left:inputDir,right:!inputDir,showSearchBottom:search.length>0 && contentDir,showSearchTop:search.length>0 && !contentDir}" v-show="blnShowInput">
            <div class="holder"></div>
            <div class="input_Container" v-on:mousedown.stop="inputClick">
                <div style="display:table;width:100%;height:100%;">
                    <div style="display:table-cell;vertical-align: middle;">
                        <input type="text" v-model="searchStr" v-on:mousedown.stop="inputClick" />
                    </div>
                </div>
            </div>
            <div class="content" v-show="search.length>0 || searchStr" name="search_content" v-on:mousedown.stop="inputClick" :class="{top:!contentDir,bottom:contentDir}">
         
                <div v-if="searchStr && search.length<=0 && !blnLoadings && blnJoinSearch" style="position:absolute;top:0px;left:0px;right:0px;bottom:0px;">
                    <div style="display:table;height:100%;width:100%;">
                        <div style="display:table-cell;vertical-align: middle;">暂无相关数据</div>
                    </div>
                </div>

                <div class="data" style="position:relative" name="data_container" v-show="search.length">
                    <div v-for="i in search" v-on:mousedown.stop="inputClick">
                        <div class="item" name="content_item">
                            <div class="data_content" v-on:mousedown.stop="inputClick($event)" v-on:mouseup.stop="inputClick" v-html="clipStr(i.data,i.highlights)"></div>
                            <div style="font-size:12px;color:green;text-align:left;">数据来源:{{i.source}}</div>
                        </div>
                    </div>
                </div>
                <div v-show="search.length>0" name="page_container" class="page_container" style="border-top: 1px solid #ebedee;;">
                    <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageIndex+1}}</span></span>
                    <div class="firstPage" @click="pageChange(0)">首页</div>
                    <div class="prePage" @click="pageChange(pageIndex-1)">上一页</div>
                    <div class="nextPage" @click="pageChange(pageIndex+1)">下一页</div>
                </div>
            </div>
        </div>-->
    </div>
</template>

<script>
import {Search} from '../store/mutation-types'
import '../../static/drag.js'
import ripple from '../js/ripple_btn.js'
import Scroll from 'components/scroll'
import LayoutPreView from 'components/LayoutPreView'
import OneSo from 'components/OneSo'
import HTag from 'components/HTag'
import {BODY_RESIZE,GetSearch} from '../store/mutation-types'
let Rx = require('rxjs/Rx');

export default {
  name: 'Kuaiso',
  data () {
    return {
      blnJoinSearch:false,
      blnLoadings:false,//是否正在请求远程数据
      blnBound:false,
      dir:'center',//控件所在方位(right,left,top,bottom,center)
      w:0,//拖动插件所在容器宽度
      h:0,//拖动插件所在容器高度
      blnDrag:false,
      btnR:50,//拖动按钮直径
      blnShowInput:false,
      btnW:400,//整个插件展开后的宽度
      curX:0,//当前插件X轴坐标
      curY:0,//当前插件Y轴坐标
      inputDir:true,//输入框显示方向(true:右,false:左)
      contentDir:true,//查询内容框显示方向(true:下,false:上)
      oriBgCol:'',//按钮原来的颜色
      changeBgCol:'rgba(33,33,33,0.098)',//改变后的颜色
      contentEl:null,//查询结果容器元素对象
      searchStr:'',//查询条件
      pageIndex:0,//当前页号
      limit:10,//默认每页显示数量
      delayObj:{},
      //搜索结果
      search:[],
      dragEl:null,//拖动元素
      RxSub:null,
    }
  },
  watch:{
    searchStr(){
        tool.dr(()=>{
            if(!this.searchStr || this.searchStr.length<2){this.search=[];this.blnJoinSearch=false;return;}
            this.blnJoinSearch=false;
            this.pageIndex=0;
            this.blnLoadings=true;
            this.$store.dispatch(Search,{str:this.searchStr,skip:this.limit*this.pageIndex,limit:this.limit}).then(res=>{
                this.blnJoinSearch=true;
                if(!tool.msg(res,'','获取数据失败!')){this.blnLoadings=false;return;}
                this.search=res.biz_body;
                this.blnLoadings=false;
                //console.log(tool.Clone(res.biz_body));
            });
        },this.delayObj,300);
    },
    blnShowInput(){
        
    }
  },
  mounted(){
    let el=$(this.$el),self=this;
    ripple.Init(el.find('.btnContainer'));
    //设置拖动按钮颜色
    var bgCol=el.find('.btnContainer').css('background-color');
    self.oriBgCol=bgCol;
    self.contentEl=el.find('div[name="search_content"]');
    this.dragEl=el;
    let sources =[];
    let pages=[];
    

    //打开查看页面
    this.RxSub=new Rx.Subject();
    this.RxSub.debounceTime(100).subscribe((val)=>{

            tool.open(function(){
                let html=`
                    <HTag :tags="tags" @change="tagChange">
                        <div slot="t0" style="height:100%;width:100%;">
                            <OneSo ref="OneSo" />
                        </div>
                        <div slot="t1" style="height:100%;width:100%;">
                            <div style="height:60px;line-height:60px;width:300px;margin-left:15px;margin-top:15px;">
                                <el-input placeholder="请输入关键词" v-model="searchVal" class="input-with-select">
                                    <i slot="prepend" class="fa fa-search"></i>
                                </el-input>
                            </div>
                            <div style="height:calc(100% - 80px);width:100%;">
                                <LayoutPreView ref="LayoutPreView" :sources="sources" :pages="pages" :keyword="searchVal" :store="store" />
                            </div>
                        </div>
                    </HTag> 
                `;
                let param={
                    title:'快搜信息',
                    area:['800px','600px'],
                    maxmin: true,
                    content:`<div class="kuaisearch_window_pop" style="width:100%;height:100%;">${html}</div>`,
                    components:{LayoutPreView,HTag,OneSo},
                    store:self.$store,
                    context:{
                        tags:[{name:'特征',icon:'fa fa-tag'},{name:'日志',icon:'fa fa-tag'}],
                        store:self.$store,
                        sources:sources,
                        pages:pages,
                        searchVal:'',
                        tagChange(){
                            param.$refs.LayoutPreView.layout();
                            param.$refs.OneSo.layout();
                        },
                    },
                    success(layero,index){
                        self.$store.dispatch(GetSearch).then(res=>{
                            let setting = _.find(res.biz_body,r=>r.isDefault);
                            if(setting){
                                sources = eval('(' + setting.originalObj + ')').souces;
                                pages = eval('(' + setting.originalObj + ')').pages;
                                param.selfData.sources=sources;
                                param.selfData.pages=pages;
                            }
                        });
                    },
                    full(){
                        setTimeout(()=>{
                            param.$refs.LayoutPreView.layout();
                            param.$refs.OneSo.layout();
                        },300);
                    },
                    restore(e,index){ 
                        setTimeout(()=>{
                            param.$refs.LayoutPreView.layout();
                            param.$refs.OneSo.layout();
                        },300);
                    }  
                };

                return param;
            }());
    });
    
    this.$nextTick(()=>{
        this.initDrag();
    });
    this.$store.commit(BODY_RESIZE,()=>{
        this.initDrag();
    });
  },
  methods:{
    //初始化拖插件
    initDrag(){
        let self=this;
        let el=this.dragEl;
        el.dragging({
          randomPosition:false,
          dragStart(w,h,movex,movey){
            self.w=w;self.h=h;self.curX=movex;self.curY=movey;
            self.blnBound=false;
            setTimeout(()=>{
               if(self.blnDrag){return;}
               self.RxSub.next(1);
            //
            //    self.blnShowInput=!self.blnShowInput;
            //    self.$nextTick(()=>{
            //         if(self.blnShowInput){
            //             self.inputDir =self.decideDir();
            //             self.contentDir=self.decideContent();
            //             el.find('.btnContainer').css('background-color',self.changeBgCol).css('font-size','12px');
            //         }else{
            //             el.find('.btnContainer').css('background-color',self.oriBgCol).css('font-size','14px');
            //         }
            //    });
            },300);
          },
          dragMove(){
            self.blnDrag=true;
            self.blnShowInput=false;
            el.find('.btnContainer').css('background-color',self.oriBgCol);
          },
          xbound(dir,x,movex,movey,e){
              if(e){
                let targetDom=e.target || e.srcElement;
                if(targetDom && $(targetDom).parent('div[name="content_item"]').length>0){return;}
              }
              self.blnBound=true;
              self.$nextTick(()=>{
                setTimeout(()=>{
                    if(dir==1){//靠右
                        self.dir='right';self.w=x;
                        if(self.blnShowInput)return;
                        el.css('left',x+self.btnR/2);
                        self.curX=x+self.btnR/2;
                        self.curY=movey;
                    }else if(dir==0){//靠左
                        self.dir='left';
                        if(self.blnShowInput)return;
                        el.css('left',-self.btnR/2);
                        self.curX=-self.btnR/2;
                        self.curY=movey;
                    }else if(dir == -1){//中间
                        self.dir='center';
                        self.curX=movex;
                        self.curY=movey;
                        self.w=x;
                    }
                    setTimeout(function() {
                        self.blnBound=false;
                    },300);

                    self.blnDrag=false;
                },100);
              });
          },
          ybound(dir,y,movex,movey,e){
              if(e){
                let targetDom=e.target || e.srcElement;
                if(targetDom && $(targetDom).parent('div[name="content_item"]').length>0){return;}
              }
                
              self.blnBound=true;
              self.$nextTick(()=>{
                setTimeout(()=>{
                    if(dir==1){//靠上
                        self.dir='bottom';self.h=y;
                        if(self.blnShowInput)return;
                        el.css('top',y+self.btnR/2);
                        self.curX=movex;
                        self.curY=y+self.btnR/2;
                    }else if(dir==0){//靠下
                        self.dir='top';
                        if(self.blnShowInput)return;
                        el.css('top',-self.btnR/2);
                        self.curX=movex;
                        self.curY=-self.btnR/2;
                    }else if(dir == -1){//中间
                        self.dir='center';
                        self.curX=movex;
                        self.curY=movey;
                        self.h=y;
                    }
                    setTimeout(function() {
                        self.blnBound=false;
                    },300);

                    self.blnDrag=false;
                },300);
              });
          }
      });
    },
    pageChange(number){
        number=number || 0;
        this.blnLoadings=true;
        this.$store.dispatch(Search,{str:this.searchStr,skip:this.limit*number,limit:this.limit}).then(res=>{
            this.blnLoadings=false;
            if(!tool.msg(res,'','获取数据失败!'))return;
            let data=res.biz_body;
            if(data.length<=0){
                tool.msg({msg:{code:'successed'}},'已经到了最后页!','已经到了最后页!');
                return;
            }
            this.pageIndex=number;
            this.search=data;
        });
    },
    //截断数据字符串超出部分
    clipStr(val,highlights){
        highlights=highlights || [];
        let highStr=_.chain(val).pick(...highlights).map((v,k)=>{return k+':'+`<span style="color:red;">${v}</span>`}).value().join(',');
        let str=_.chain(val).omit(...highlights).map((v,k)=>{return `<span style="margin-right:10px;">${k}:${v || '无'}</span>`}).value().join('');
        let highHtml=`<div style="font-size:16px;line-height:26px;">${highStr}</div>`;
        let len=600;

        if((highStr+str).length>len){
            
            return highHtml + str.substr(0,len-highStr.length)+'...';
        }else{
            return highHtml + str;
        }
    },
    mouserover(){
        if(this.blnDrag || this.blnShowInput){return;}
        let s=this,el=$(this.$el);
        switch(this.dir){
            case 'left':
                s.blnBound=true;
                s.$nextTick(()=>{
                    el.css('left',0);
                    s.curX=0;
                });
                break;
            case 'right':
                s.blnBound=true;
                s.$nextTick(()=>{
                    el.css('left',s.w);
                    s.curX=s.w;
                });
                break;
            case 'top':
                s.blnBound=true;
                s.$nextTick(()=>{
                    el.css('top',0);
                    s.curY=0;
                });
                break;
            case 'bottom':
                s.blnBound=true;
                s.$nextTick(()=>{
                    el.css('top',s.h);
                    s.curY=s.h;
                });
                break;
            case 'center':
                break;
        }
    },
    mouseout(){
        setTimeout(()=>{
            if(this.blnDrag || this.blnShowInput){return;}
            let s=this,el=$(this.$el);
            switch(this.dir){
                case 'left':
                    s.$nextTick(()=>{
                        el.css('left',-s.btnR/2);
                        s.curX=-s.btnR/2;
                    });
                    break;
                case 'right':
                    s.$nextTick(()=>{
                        el.css('left',s.w+s.btnR/2);
                        s.curX=s.w+s.btnR/2;
                    });
                    break;
                case 'top':
                    s.$nextTick(()=>{
                        el.css('top',-s.btnR/2);
                        s.curY=-s.btnR/2;
                    });
                    break;
                case 'bottom':
                    s.$nextTick(()=>{
                        el.css('top',s.h+s.btnR/2);
                        s.curY=s.h+s.btnR/2;
                    });
                    break;
                case 'center':
                    break;
            }
        },100)
    },
    //空方法用于阻止输入框单击事件冒泡导致输入框被隐藏
    inputClick(e){return false;},
    //判断输入方向(false:右;true:左)
    decideDir(){
        if(this.dir=='right'){return false;}
        if(this.dir=='left'){return true;}
        if(this.dir=='top'){
            if(this.w>=(this.curX+this.btnW)){return true;}else{return false;}
        }
        if(this.dir=='bottom'){
            if(this.w>=(this.curX+this.btnW)){return true;}else{return false;}

        }
        if(this.dir=='center'){
            if(this.w>=(this.curX+this.btnW)){return true;}else{return false;}
        }
    },
    //判断搜索内容框显示方向(true:下,false:上)
    decideContent(){
        let el=$(this.$el),datC=el.find('div[name="data_container"]');
        let barH=this.btnR *1.2;
        if(this.dir=='top'){
            datC.css('max-height',this.h-barH-30-40);
            return true;
        }
        if(this.dir=='bottom'){
            datC.css('max-height',this.h-barH-30-40);
            return false;
        }
        if(this.dir=='center' || this.dir=='left' || this.dir=='right'){
            let topDis=this.curY,bottomDis=this.h-this.curY-barH;

            if(bottomDis>=topDis){//向下
              datC.css('max-height',this.h-this.curY-barH-30-40);
            }else{//向上
              datC.css('max-height',this.curY-30-40);
            }
            return bottomDis>=topDis;
        }
    }
  }
}
</script>

<style scoped lang="less">
  @import "../css/variables.less";

  @c_w:50px;
  @start_time:0.3s;
  @backgroundColor:@btn_Bg_Col_hover_1;
  .Kuaiso{position:absolute;}
  .Kuaiso .btnContainer{
      width:@c_w;height:@c_w;border-radius:@c_w/2;line-height:@c_w;text-align:center;
      cursor:pointer;color:white;overflow:hidden;z-index: 300;position: relative;.trans();font-size:14px;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
   }

   html{.TCol(~".Kuaiso .btnContainer",'bg');}

   .Kuaiso .btnContainer.Rotate{
    animation: rotateDom 1s  linear;
    -moz-animation: rotateDom 1s  linear;	/* Firefox */
    -webkit-animation: rotateDom 1s  linear;	/* Safari 和 Chrome */
    -o-animation: rotateDom 1s  linear;	
   }

   @inputW:800px;
   @inputL:5px;
   .Kuaiso .inputContainer{
        background-color: @backgroundColor;
        height: 120%;
        position: absolute;
        width: @inputW;
        top: -10%;
        border-radius: 5px;
        }
   .Kuaiso .inputContainer .holder{width:@c_w+@inputL;height:100%;float: left;}
   .Kuaiso .input_Container{display: inline-block;height: 100%;width:~"calc(100% - @{c_w} - @{inputL})";}
   .Kuaiso .input_Container input{display:block;margin:0px auto;width:90%;}
   .Kuaiso .inputContainer.left{left: -@inputL;}
   .Kuaiso .inputContainer.left .holder{float:left;}
   .Kuaiso .inputContainer.right{left:@c_w + @inputL - @inputW;}
   .Kuaiso .inputContainer.right .holder{float:right;}
   .Kuaiso .inputContainer .content{position: absolute;width:100%;font-size:12px;background-color:white;}
   .Kuaiso .inputContainer.showSearchBottom .content{box-shadow:2px -2px 1px @backgroundColor inset,-2px -2px 1px @backgroundColor inset;}
   .Kuaiso .inputContainer.showSearchTop .content{box-shadow:2px 2px 1px @backgroundColor inset,-2px 2px 1px @backgroundColor inset;}

   .Kuaiso .inputContainer .content.top{bottom:100%;}
   .Kuaiso .inputContainer .content.bottom{top:100%;}
   .Kuaiso .inputContainer .content .data{margin:10px;overflow-y: auto;text-align:left;}
   .Kuaiso .inputContainer.showSearchBottom{border-bottom-left-radius:0px;border-bottom-right-radius:0px;}
   .Kuaiso .inputContainer.showSearchTop{border-top-left-radius:0px;border-top-right-radius:0px;}

  .Kuaiso.bound{
    transition: all @start_time cubic-bezier(1,-0.87,.39,1) 0s;
    -moz-transition: all @start_time cubic-bezier(1,-0.87,.39,1) 0s;
    -ms-transition: all @start_time cubic-bezier(1,-0.87,.39,1) 0s;
    -webkit-transition: all @start_time cubic-bezier(1,-0.87,.39,1) 0s;
    -o-transition:all @start_time cubic-bezier(1,-0.87,.39,1) 0s;
   }

   //内容项数据
   .data .item .data_content{word-wrap: break-word;margin-bottom:10px;}
</style>
