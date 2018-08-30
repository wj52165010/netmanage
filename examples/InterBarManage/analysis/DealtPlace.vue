<!-- 待处理场所页面组件 -->
<template>
    <div class="DealtPlace">
        <div class="DealtPlace_container">
            <!--操作栏-->
            <div class="option_bar">
                <div class="item">
                    <span>问题等级:</span><div style="display:inline-block;">
                    <el-select placeholder="请选择" :clearable="true">
                            <el-option
                                v-for="kind in []"
                                :key="kind.code"
                                :label="kind.name"
                                :value="kind.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>

                <div class="item">
                    <span>问题分类:</span><div style="display:inline-block;">
                    <el-select placeholder="请选择" :clearable="true">
                            <el-option
                                v-for="kind in []"
                                :key="kind.code"
                                :label="kind.name"
                                :value="kind.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>

                <div class="item">
                    <span>场所范围:</span><div style="display:inline-block;">
                        <PlaceSearch  :blnClear="true" c_searchKind="1" :microprobeType="microprobe_type" ccontext="region"  @place_res="placechange"></PlaceSearch>
                    </div>
                </div>

                <div class="item">
                    <span>所属厂商:</span>
                    <div style="display:inline-block;width:180px;">
                        <MulDropDwon :data="Selfirms" keyProp="name" id="code" placeholder="请选择厂商">
                            <div v-for="t in firms" @mousedown="firmClick('listInd',t)">{{t.name}} <i v-if="isHasSelItem(Selfirms,t.code)" class="fa fa-check" style="float:right;margin-top: 10px;"></i></div>
                        </MulDropDwon>
                    </div>
                </div>

                <div class="item">
                    <span>所属区域:</span><div style="display:inline-block;">
                        <PlaceSearch  :blnClear="true" c_searchKind="0" :microprobeType="microprobe_type" ccontext="region"  @place_res="placechange"></PlaceSearch>
                    </div>
                </div>

                <div class="item">
                    <el-button type="primary" @click="search()"><span>查询</span></el-button>
                </div>

                <!--右边操作栏-->
                <div class="right_option_bar">
                    <div class="exportSel" style="display:inline-block;" :class="{active:blnExport}" @click="blnExport=!blnExport"><i class="fa fa-check-square" style="margin-right:5px;" />选择</div>
                </div>

            </div>

            <!--列表容器-->
            <div style="width:100%;" :style="{height:bodyH}">
                <v-table :listen="data" :blnLoading="blnLoading" ref="listTable">
                    <v-table-header>
                        <v-table-column v-show="blnExport" :width="50" >
                            <span class="overflow" @click="selAll()"><i :class="{'fa fa-check-square-o':blnAllSel,'fa fa-square-o':!blnAllSel}"></i></span>
                        </v-table-column>
                        <v-table-column :width="200" >
                            <span style="margin-right:5px;">场所编码</span>
                            <i class="fa fa-caret-up" :class="{active:!placeOrder}" @click="placeOrder=false"></i><i class="fa fa-caret-down" :class="{active:placeOrder}" @click="placeOrder=true"></i>
                        </v-table-column>
                        <v-table-column :width="200" >
                            <span style="margin-right:5px;">场所名称</span>
                            <i class="fa fa-caret-up" :class="{active:!placeNameOrder}" @click="placeNameOrder=false"></i><i class="fa fa-caret-down" :class="{active:placeNameOrder}" @click="placeNameOrder=true"></i>
                        </v-table-column>
                        <v-table-column :width="120" >
                            <span style="margin-right:5px;">所属厂商</span>
                            <i class="fa fa-caret-up" :class="{active:!firmOrder}" @click="firmOrder=false"></i><i class="fa fa-caret-down" :class="{active:firmOrder}" @click="firmOrder=true"></i>
                        </v-table-column>
                        <v-table-column :width="120" >
                            <span style="margin-right:5px;">所属区域</span>
                            <i class="fa fa-caret-up" :class="{active:!areaOrder}" @click="areaOrder=false"></i><i class="fa fa-caret-down" :class="{active:areaOrder}" @click="areaOrder=true"></i>
                        </v-table-column>
                        <v-table-column :width="80" >
                            场所状态
                        </v-table-column>
                        <v-table-column :width="120" >
                            <span>
                                终端概况
                                <el-tooltip placement="top" content="申报终端/检测终端/在线终端"><i class="fa fa-question-circle" /></el-tooltip>
                            </span>
                        </v-table-column>
                        <v-table-column :width="120" >
                            <span style="margin-right:5px;">最近联系时间</span>
                            <i class="fa fa-caret-up" :class="{active:!timeOrder}" @click="timeOrder=false"></i><i class="fa fa-caret-down" :class="{active:timeOrder}" @click="timeOrder=true"></i>
                        </v-table-column>
                        <v-table-column :width="80" >
                            昨日采集
                        </v-table-column>
                        <v-table-column :width="120" >
                            <span>
                                问题数量
                                <el-tooltip placement="top" content="严重数/观察数/忽略数据"><i class="fa fa-question-circle" /></el-tooltip>
                            </span>
                        </v-table-column>
                        <v-table-column  >
                            推送问题摘要
                        </v-table-column>

                    </v-table-header>

                    <v-table-body>
                        <template v-for="d in data">
                            <v-table-row @click="rowClicks">
                                <v-table-column v-show="blnExport"><span class="overflow" style="width:50px;"><i :class="{'fa fa-check-square-o':blnSelItem(d),'fa fa-square-o':!blnSelItem(d)}"></i></span></v-table-column>
                                <v-table-column><span class="overflow clickItem" @click.stop="placeDetail(d)" style="width:200px;">{{d.code}}</span></v-table-column>
                                <v-table-column>{{d.name}}</v-table-column>
                                <v-table-column>{{d.firm}}</v-table-column>
                                <v-table-column>{{d.region}}</v-table-column>
                                <v-table-column><span :style="{color:converPlaceState(d.state).color}">{{converPlaceState(d.state).name}}</span></v-table-column>
                                <v-table-column><span class="overflow clickItem" :title="`申报:${d.declareTerminal}/检测:${d.detectionTerminal}/在线:${d.onlineTerminal}`" @click.stop="terminalDetail(d)">{{`${d.declareTerminal}/${d.detectionTerminal}/${d.onlineTerminal}`}}</span></v-table-column>
                                <v-table-column>{{d.time}}</v-table-column>
                                <v-table-column><span class="overflow clickItem" @click.stop="collectChart(d)">{{d.collect}}</span></v-table-column>
                                <v-table-column>
                                    <span :title="`严重:${d.severityNum}/观察:${d.lookNum}/忽略:${d.ignoreNum}`">
                                        <span style="color:#ec4840;">{{d.severityNum}}</span>/<span style="color:#ff9600;">{{d.lookNum}}</span>/<span style="color:#007ad5;">{{d.ignoreNum}}</span>
                                    </span>
                                </v-table-column>
                                <v-table-column><span class="overflow clickItem" @click="issueDetail(d)">{{d.reason}}</span><span v-if="d.blnLast" class="newLable">new</span></v-table-column>
                            </v-table-row>
                            <v-table-row>
                                <div v-if="d.showTmp" class="row_item_child fadeIn">

                                    <v-table :listen="childData" :base="true">
                                        <v-table-header :style="{'background-color':'transparent','color':'black'}">
                                            <v-table-column :width="150">
                                                <span style="margin-right:5px;">最近推送时间</span>
                                                <i class="fa fa-caret-up" :class="{active:!placeOrder}" @click="placeOrder=false"></i><i class="fa fa-caret-down" :class="{active:placeOrder}" @click="placeOrder=true"></i>
                                            </v-table-column>
                                            <v-table-column :width="150">问题分类</v-table-column>
                                            <v-table-column :width="150">问题等级</v-table-column>
                                            <v-table-column >问题描述</v-table-column>
                                            <v-table-column :width="150">持续出现</v-table-column>
                                            <v-table-column :width="150">推送者</v-table-column>
                                        </v-table-header>

                                        <v-table-body>
                                            <v-table-row v-for="c in childData">
                                                <v-table-column>{{c.lastTime}}</v-table-column>
                                                <v-table-column>{{c.kind}}</v-table-column>
                                                <v-table-column>{{c.level}}</v-table-column>
                                                <v-table-column><span class="clickItem" @click="issuePop()">{{c.desc}}</span><span v-if="c.blnLast" class="newLable">new</span></v-table-column>
                                                <v-table-column>{{c.apperTime}}</v-table-column>
                                                <v-table-column>{{c.user}}</v-table-column>
                                            </v-table-row>
                                        </v-table-body>
                                    </v-table>

                                </div>
                            </v-table-row>
                        </template>
                    </v-table-body>

                </v-table>
            </div>


            <!--分页栏-->
            <div name="page_container" class="page_container" style="background-color:white;">
                <span class="exportBtn" v-if="blnExport" @click="exportData()" style="float:left;margin-top:10px;margin-left:15px;font-size:12px;cursor:pointer;"><i class="fa fa-upload" /> 导出</span>
                <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageIndex+1}}</span></span>
                <div class="firstPage" @click="pageChange(0)">首页</div>
                <div class="prePage" @click="pageChange(pageIndex-1)">上一页</div>
                <div class="nextPage" @click="pageChange(pageIndex+1)">下一页</div>          
            </div>

        </div>
    </div>
</template>

<script>

import PlaceSearch from 'components/PlaceSearch'
import MulDropDwon from 'components/MulDropDown'     //厂商选择控件
import Scroll from  'components/scroll'
import HTag from 'components/HTag'

import TerminalDetail from '../TerminalDetail'
import CallPolicy from '../CallPolicy'
import IssueList from '../IssueList'
import IssueDetail from '../IssueDetail'
import PendHandle from '../PendHandle'
import HandlerWay from '../HandlerWay'
import CollectChart from '../CollectChart'
import PlaceDetail from '../PlaceDetail'



import {BODY_RESIZE,GetFirm} from '../../../store/mutation-types'

export default {
  name: 'DealtPlace',
  props:['microprobe_type'],
  components:{PlaceSearch,MulDropDwon,Scroll},
  data () {
    return {
      firms:[],//厂商数据集合
      Selfirms:[],
      column_w:0,
      bodyResizeSub:null,
      bodyH:0,
      data:[
        {code:'53011135000127',name:'重庆智多测试场所',firm:'重庆爱思网安',region:'南岸区',kind:'severity',state:'online',declareTerminal:'100',detectionTerminal:'90',onlineTerminal:'12',time:'1天前',collect:'0',reason:'场所已离线48小时',blnLast:true,severityNum:3,lookNum:2,ignoreNum:1,showTmp:false,},
        {code:'53011135000125',name:'重庆智多测试场所',firm:'重庆爱思网安',region:'南岸区',kind:'general',state:'offline',declareTerminal:'100',detectionTerminal:'90',onlineTerminal:'12',time:'1天前',collect:'0',reason:'场所已离线48小时',blnLast:true,severityNum:3,lookNum:2,ignoreNum:1,showTmp:false,},
        {code:'53011135000124',name:'重庆智多测试场所',firm:'重庆爱思网安',region:'南岸区',kind:'ignore',state:'abnormal',declareTerminal:'100',detectionTerminal:'90',onlineTerminal:'12',time:'1天前',collect:'0',reason:'场所已离线48小时',blnLast:false,severityNum:3,lookNum:2,ignoreNum:1,showTmp:false,}
      ],
      childData:[{lastTime:'2018-08-08 10:35:48',kind:'场所离线',level:'严重',desc:'场所已经离线，未上传数据及心跳',apperTime:'2天',user:'系统',blnLast:true}],
      blnLoading:false,
      pageIndex:0,
      placeOrder:false,
      placeNameOrder:false,
      firmOrder:false,
      areaOrder:false,
      timeOrder:false,
      blnExport:false,//是否进入导出选择阶段,
      selIds:[],//选中项的IDS
    }
  },
  watch:{
    blnExport(){
        this.selIds=[];
        this.layout();
    }
  },
  computed:{
    viewData(){
        return _.map(this.data,d=>{d.checked=d.checked || false; return d;  })
    },
    blnAllSel(){
        let s=this,res=true;
        for(let i=0;i<s.viewData.length;i++){
            if(_.findIndex(this.selIds,id=>id==s.viewData[i].code)<0){
                res=false;break;
            }
        }
        return res;
    }
  },
  mounted(){

    //获取厂商下拉框数据
    this.$store.dispatch(GetFirm).then(res=>{
        if(!tool.msg(res,'','获取厂商数据失败!'))return;
        this.firms=res.biz_body;
    });

   this.layout();
   this.$store.commit(BODY_RESIZE,{cb:(sub)=>{
       this.bodyResizeSub=sub
   },sub:()=>{
      this.layout();
   }});
  },
  beforeDestroy(){
    this.bodyResizeSub.unsubscribe();
  },
  methods:{
    layout(){
        setTimeout(()=>{
            this.bodyH=`calc(100% - 50px  - ${$(this.$el).find('.option_bar').height()}px)`;

            this.$nextTick(()=>{
                this.$refs.listTable.reloadScroll()
            })
        },500);
        this.column_w=$(this.$el).width()-(this.blnExport?1210:1160) -10;
    },
    //全选/取消全选
    selAll(){
        let s=this;
        if(s.blnAllSel){
            for(let i=0;i<s.viewData.length;i++){
                let index=_.findIndex(s.selIds,id=>id==s.viewData[i].code);
                if(index<0) continue;
                s.selIds.splice(index,1);
            }
        }else{
            for(let i=0;i<s.viewData.length;i++){
                let index=_.findIndex(s.selIds,id=>id==s.viewData[i].code);
                if(index>=0) continue;
                s.selIds.push(s.viewData[i].code);
            }
        }
    },
    //单选
    selItem(d){
        let index=_.findIndex(this.selIds,id=>id==d.code);
        if(index>=0){
            this.selIds.splice(index,1);
        }else{
            this.selIds.push(d.code);
        }
    },
    blnSelItem(d){
        return _.findIndex(this.selIds,id=>id==d.code)>=0;
    },
    //场所详情
    placeDetail(d){
        let s=this;
        tool.open(function(){
            let param={
                title:'场所详情',
                area:'1000px',
                content:`<div class="place_detail_pop" style="width:100%;height:100%;">
                            <PlaceDetail />
                        </div>
                        `,
                components:{PlaceDetail},
                store:s.$store,
                context:{
                    blnExecute:false,
                    ok_btn(){param.close()},
                    cancel_btn(){param.close()}
                }
            };

            return param;
        }());
    },
    //终端概况详情
    terminalDetail(d){
        let s=this;
        tool.open(function(){
            let param={
                title:'终端列表(场所名称)',
                area:['1300px','500px'],
                content:`<div class="terminaDetail_Num_pop" style="width:100%;height:100%;">
                            <TerminalDetail />
                        </div>
                        `,
                components:{TerminalDetail},
                store:s.$store,
                context:{
                    blnExecute:false,
                    ok_btn(){param.close()},
                    cancel_btn(){param.close()}
                }
            };

            return param;
        }());
    },
    //问题总览详情
    issueDetail(){
        let s=this;
        tool.open(function(){
            let param={
                title:'问题总览详情(场所名称)',
                area:['800px','400px'],
                content:`<div class="pendHandle_detail_pop" style="width:100%;height:100%;overflow:hidden;">
                            <HTag :tags="pages" @change="tagChange">
                                <div slot="t0" style="height:100%;width:100%;">
                                    <PendHandle ref="pend" />
                                </div>
                                <div slot="t1" style="height:100%;width:100%;">
                                    <IssueList ref="issue" />
                                </div>
                            </HTag>
                        </div>
                        `,
                components:{HTag,IssueList,PendHandle},
                store:s.$store,
                context:{
                    pages:[
                        {name:'待处理问题详情',icon:'fa fa-list'},
                        {name:'场所问题日志',icon:'fa fa-list'}
                    ],
                    blnExecute:false,
                    tagChange(i){
                        i==0?param.$refs.pend.layout():param.$refs.issue.layout();
                    },
                    ok_btn(){param.close()},
                    cancel_btn(){param.close()}
                }
            };

            return param;
        }());
    },
    //问题描述详情
    issuePop(){
        let s=this;
        tool.open(function(){
            let param={
                title:'问题详情(场所名称)',
                area:'800px',
                content:`<div class="issue_detail_pop" style="width:100%;height:100%;overflow:hidden;">
                            <IssueDetail />
                         </div>
                        `,
                components:{IssueDetail},
                store:s.$store,
                context:{
                    ok_btn(){param.close()},
                    cancel_btn(){param.close()}
                }
            };

            return param;
        }());
    },
    //报警原因详情
    callPolicy(d){
        let s=this;
        tool.open(function(){
            let param={
                title:'报警详情(场所名称)',
                area:['1000px','500px'],
                content:`<div class="terminaDetail_Num_pop" style="width:100%;height:100%;">
                            <CallPolicy />
                        </div>
                        `,
                components:{CallPolicy},
                store:s.$store,
                context:{
                    blnExecute:false,
                    ok_btn(){param.close()},
                    cancel_btn(){param.close()}
                }
            };

            return param;
        }());
    },
    //处置方式
    handerWay(d){
        let s=this;
        tool.open(function(){
            let param={
                title:'处置详情',
                area:['600px','500px'],
                content:`<div class="Handler_Way_pop" style="width:100%;height:100%;">
                            <HandlerWay />
                        </div>
                        `,
                components:{HandlerWay},
                store:s.$store,
                context:{
                    blnExecute:false,
                    ok_btn(){param.close()},
                    cancel_btn(){param.close()}
                }
            };

            return param;
        }());
    },
    //昨日采集弹窗
    collectChart(d){
        let s=this;
        tool.open(function(){
            let param={
                title:'数据采集情况(场所名称)',
                area:['800px','400px'],
                content:`<div class="collect_chart_pop" style="width:100%;height:100%;">
                            <CollectChart />
                        </div>
                        `,
                components:{CollectChart},
                store:s.$store,
                context:{
                    blnExecute:false,
                    ok_btn(){param.close()},
                    cancel_btn(){param.close()}
                }
            };

            return param;
        }());
    },
    firmClick(type,d){
        let index=-1;
        index=_.findIndex(this.Selfirms,t=>t.code==d.code);
        if(index>=0){this.Selfirms.splice(index,1); return;}
        this.Selfirms.push(d);  
    },
    //是否包含选中项
    isHasSelItem(data,code){
        return  _.find(data,d=>d.code==code);
    },
    placechange(query,val){
        let res =_.flatten(_.map(val,v=>{return _.map(v,i=>i.code)}));
        console.log(res);
    },
    //转化紧急分类
    converKind(v){
        let res={};
        switch(v){
            case 'severity':
                res={name:'严重',color:'#e94840'};
            break;
            case 'general':
                res={name:'一般',color:'#ff9600'};
            break;
            case 'ignore':
                res={name:'忽略',color:'#3197d8'};
            break;
        }

        return res;
    },
    //转化场所状态
    converPlaceState(v){
        let res={};
        switch(v){
            case 'online':
                res={name:'在线',color:'#bee35f'};
            break;
            case 'offline':
                res={name:'离线',color:'#999999'};
            break;
            case 'abnormal':
                res={name:'异常',color:'#ffb937'};
            break;
        }

        return res;
    },
    //列表行单击事件
    rowClicks(i){
      let index = i/2;
      let data =tool.Clone(this.data[index]);
      data.showTmp=!data.showTmp;

      this.data.splice(index,1,data);
     }
  }
}
</script>

<style scoped lang="less">
@import "../../../css/variables.less";

.DealtPlace{width:100%;height:100%;padding:5px;position:relative;}
.DealtPlace_container{width:100%;height:100%;background-color:white;}

.DealtPlace .option_bar{text-align:left;padding:5px 15px;line-height:40px;}
.DealtPlace .option_bar .item{display:inline-block;margin:2px 5px;}

.DealtPlace .right_option_bar {float:right;}
.DealtPlace .right_option_bar .item{display:inline-block;margin:2px 5px;}
.DealtPlace .right_option_bar .item:hover{cursor:pointer;}
html{.TCol(~".DealtPlace .right_option_bar .item:hover");}

.DealtPlace .cursor{cursor:pointer;}

.DealtPlace .table_body .item{cursor:pointer;}
html{.TCol(~".DealtPlace .table_body .item:hover");}

.DealtPlace .fa-caret-up{position:absolute;top:8px;cursor:pointer;font-size:14px;color:gray;}
.DealtPlace .fa-caret-down{position:absolute;top:17px;cursor:pointer;font-size:14px;color:gray;}

.DealtPlace .fa-caret-up.active,
.DealtPlace .fa-caret-down.active,
.DealtPlace .fa-caret-up:hover,
.DealtPlace .fa-caret-down:hover{
    color:white;
}

.DealtPlace .clickItem:hover{cursor:pointer;text-decoration:underline;}
html{.TCol(~".DealtPlace .clickItem");}

//导出
.DealtPlace  .exportSel{cursor:pointer;}
html{.TCol(~".DealtPlace .exportSel:hover");}
html{.TCol(~".DealtPlace .exportSel.active");}
html{.TCol(~".DealtPlace .exportBtn:hover");}
.DealtPlace .cursor{cursor:pointer;}

.DealtPlace .newLable{padding:5px 10px;background:red;color:white;border-radius:5px;margin-left:5px;text-decoration:none;}

.DealtPlace .row_item_child{padding:10px 50px;.border('bottom');position:relative;z-index:1;}
</style>
