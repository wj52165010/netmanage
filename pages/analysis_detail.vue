<!-- 同行分析详细页面组件 -->
<template>
    <div class="AnaDetail">
        <div>
            <div class="tipBar">
                <titleComp :title="title" />
                <div style="display:inline-block;margin-left:15px;"><SearchInput holder="按关键字查询" /></div>
                <div style="float:right">
                    <div style="display:inline-block;margin-right:10px;">
                        <span class="tag_label" style="margin-left:10px;cursor:pointer;" v-for="k in kinds" @click="kindchange(k)">
                            <i :class="k.icon" style="margin-right:5px;"></i>{{k.name}}
                        </span>
                    </div>
                    <div class="item" @click="exportRes()">
                        <div class="icon" style="display:inline-block;"><i class="fa fa-mail-forward" /></div>
                        <span class="info">导出结果</span>
                    </div>
                </div>
            </div>
        </div>
        <!--列表显示-->
        <div class="listShow" :class="{fadeInRight:curShowPage==0}" v-show="curShowPage==0">
            <!--头部信息-->
            <ul class="container" style="margin-bottom:0px;">
                <li class="row header">
                    <span class="fragment" style="text-align:center;font-size:14px; width:200px;">名称</span>
                    <span class="fragment" style="text-align:center;font-size:14px;width:200px;">关键字</span>
                    <span class="fragment" style="text-align:center;font-size:14px;width:200px;">日期</span>
                    <span class="fragment" style="text-align:center;font-size:14px;">地址</span>
                </li>
            </ul>
            <div class="scroll_container">
                <Scroll :listen="data" ref="listShow" :store="store">
                    <div class="container">
                        <template v-for="(i,index) in data">
                            <div class="row main" @click="i.blnNoExpan=!i.blnNoExpan" :class="{noexpan:i.blnNoExpan}">
                                <span class="fragment" style="text-align:center;font-size:14px; width:200px;position:relative;">
                                    <div class="icon_id"></div>
                                    {{i.name}}
                                    <el-tooltip effect="light" content="更多"  v-if="i.child.length>=limit" placement="top">
                                        <i class="fa fa-bars" @click="moreList(i)"></i>
                                    </el-tooltip>
                                </span>
                                <span class="fragment" style="text-align:center;font-size:14px;width:200px;">{{i.keyword}}</span>
                                <span class="fragment" style="text-align:center;font-size:14px;width:200px;">{{i.date}}</span>
                                <span class="fragment" style="text-align:center;font-size:14px;">{{i.address}}</span>
                            </div>
                            <div>
                                <div v-for="i in (i.child || [])" class="row child">
                                    <span class="fragment" style="text-align:center;font-size:14px; width:200px;">{{i.name}}</span>
                                    <span class="fragment" style="text-align:center;font-size:14px;width:200px;">{{i.keyword}}</span>
                                    <span class="fragment" style="text-align:center;font-size:14px;width:200px;">{{i.date}}</span>
                                    <span class="fragment" style="text-align:center;font-size:14px;">{{i.address}}</span>
                                </div>
                            </div>
                        </template>
                    </div>
                </Scroll>
            </div>
            <div class="page_container">
                <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageNum+1}}</span></span>
                <div class="firstPage" @click="pageChange(0)">首页</div>
                <div class="prePage" @click="pageChange(pageNum-1)">上一页</div>
                <div class="nextPage" @click="pageChange(pageNum+1)" >下一页</div>
            </div>
        </div>
        <!--GIS显示-->
        <div class="listShow" :class="{fadeInRight:curShowPage==1}" v-show="curShowPage==1">
            <AnalyGIS ref="gisShow" :taskid="taskid" :store="store" :moreAction="moreList" />
        </div>
        <!--时间轴显示-->
        <div class="listShow" :class="{fadeInRight:curShowPage==2}" v-show="curShowPage==2">
            <AnalyTime ref="analyTime" :taskid="taskid" :store="store" :moreAction="moreList" />
        </div>
        <!--频次列表显示-->
        <div class="listShow ratelistShow" :class="{fadeInRight:curShowPage==3}" v-show="curShowPage==3">
            <!--头部信息-->
            <ul class="container" style="margin-bottom:0px;">
                <li class="row header">
                    <span class="fragment" style="text-align:center;font-size:14px; width:100px;">次数</span>
                    <span class="fragment" style="text-align:center;font-size:14px;width:200px;">关键字</span>
                    <span class="fragment" style="text-align:center;font-size:14px;width:150px;">最近采集时间</span>
                    <span class="fragment" style="text-align:center;font-size:14px;">最近采集地点</span>
                </li>
            </ul>
            <div class="scroll_container">
                <Scroll :listen="rateData" ref="rateListShow" :store="store">
                    <div class="container">
                        <template v-for="(i,index) in rateData">
                            <div class="row main">
                                <span class="fragment" style="text-align:center;font-size:14px; width:100px;">{{i.count}}</span>
                                <span class="fragment" style="text-align:center;font-size:14px;width:200px;">{{i.rkey}}</span>
                                <span class="fragment" style="text-align:center;font-size:14px;width:150px;">{{i.last_together_time}}</span>
                                <span class="fragment" style="text-align:center;font-size:14px;">{{i.last_netbar_name}}</span>
                            </div>
                        </template>
                    </div>
                </Scroll>
            </div>
        </div>
        <div>
    </div>
</template>

<script>
import cSelect from 'components/Select'
import Scroll from 'components/scroll'
import AnalyTime from 'components/analy_time'
import AnalyGIS from 'components/analy_gis'
import SearchInput from '../components/searchInput'
import HList from 'components/HList'
import {GetAnalyTaskData,GetAnalyTaskMore,AnalyRateCount} from '../store/mutation-types'
import {taskObject} from '../enum/TaskType'
export default {
  name: 'AnaDetail',
  props:['store','taskid'],
  components:{
      cSelect,
      Scroll,
      SearchInput,
      AnalyTime,
      AnalyGIS,
      titleComp:{
        props:['title'],
        template:`<div class="titleComp" style="cursor:pointer;display:inline-block;" @click="itemClick()">
                    <i class="fa fa-caret-down" style="font-size:18px;" :class="{rotate:blnExpan,rotatereverse:!blnExpan}"></i>
                    <span style="font-style: italic;">{{title}}</span>
                    </div>
                `,
        data(){
            return {
            blnExpan:false,
            };
        },
        methods:{
            itemClick(){
                this.blnExpan= !this.blnExpan;
                this.$emit('change',this.blnExpan);
            }
        }
    },
  },
  data () {
    return {
      kinds:[
          {name:'列表',val:0,icon:'fa fa-bars'},
          {name:'GIS',val:1,icon:'fa fa-bar-chart'},
          {name:'频次列表',val:3,icon:'fa fa-bars'},
          {name:'时间轴',val:2,icon:'fa fa-calendar-o'},
      ],
      curKind:{name:'列表显示',val:0},
      curShowPage:0,//0:列表显示;1:GIS显示;2:时间轴显示
      limit:10,
      pageNum:0,//当前页号
      data:[],
      rateData:[],//频次数据集
      blnHasLoadMap:false,
      audtime:null,
    }
  },
  computed:{
    title(){
        let arr=['列表','GIS','时间轴','频次列表']
        return '同行分析'+arr[this.curShowPage];
    }
  },
  mounted(){
    this.$store= this.$store || this.store;
    this.getData();
    let Rx=this.$store.getters.Rx;
    this.audtime=new Rx.Subject().auditTime(500);
    this.audtime.subscribe((num)=>{
        this.pageNum=num>0? num : 0;
        this.getData(true);
    });

  },
  methods:{
      //获取分析数据
      getData(blnTip){
        this.$store.dispatch(GetAnalyTaskData,{id:this.taskid || 1695200,limit:this.limit,skip:this.pageNum * this.limit}).then(res=>{
            if(!tool.msg(res,'','获取数据失败!'))return;
            //转化显示数据
            if(res.biz_body.data.length<=0){
                if(blnTip)tool.msg({msg:{code:'successed'}},'已经到了最后页!','已经到了最后页!');
                this.pageNum=(this.pageNum-1)<0?0:(this.pageNum-1);
                return;
            }

            let kind=_.find(taskObject,t=>t.val==res.biz_body.task_target_type);
            this.data=_.map(res.biz_body.data,d=>{
                return {
                    name:`主${kind.name}`,
                    kindName:kind.name,
                    keyword:d.primary.key,
                    latitude:parseFloat(d.latitude),
                    longitude:parseFloat(d.longitude),
                    mid:d.mid,
                    date:tool.DateByTimestamp(d.primary.log_time,'yyyy-MM-dd hh:mm:ss'),
                    address:d.netbar_title,
                    blnNoExpan:false,
                    child:_.map(d.together,t=>{
                        return {
                            name:`从${kind.name}`,
                            keyword:t.key,
                            date:tool.DateByTimestamp(t.log_time,'yyyy-MM-dd hh:mm:ss'),
                            address:d.netbar_title,
                        }
                    })
                }
            });
        });

        //获取频次列表数据
        this.$store.dispatch(AnalyRateCount,this.taskid).then(res=>{
            if(!tool.msg(res,'',''))return;
            this.rateData=res.biz_body;
        });
      }, 
      //获取更多同行数据
      moreList(data){
          let popW = $(window).width()*0.8;
          let popH = $(window).height()*0.8;
          let param=null,self=this;
          tool.open(function(){
            let html=`
                    <HList title="" :action="[]" :data="d" :header="header" :column="column" :showField="showField" :rowAction="[]" :store="store"
                    :searchAction="[]"  :blnNoSel="true" :blnNoPage="true" />
                    `;
            param={
                title:'更多信息',
                area:[`${popW}px`,`${popH}px`],
                content:`<div class="openTmp" style="width:100%;height:100%;overflow-y:auto;">${html}</div>`,
                components:{HList},
                context:{
                  store:self.$store,
                  header:['名称','关键字','日期','地址'],
                  showField:'name,keyword,date,address',
                  column:[{width:200,align:'center'},{width:200,align:'center'},{width:200,align:'center'},{width:0,align:'center'},],
                  d:[]
                }
            };
            return param;
          }());
          this.$store.dispatch(GetAnalyTaskMore,{id:this.taskid || 1695200,mid:data.mid}).then(res=>{
              if(!tool.msg(res,'','获取数据失败!'))return;
              let extraArr=_.map(res.biz_body,t=>{
                  return {
                      name:`从${data.kindName}`,
                      keyword:t.key,
                      date:tool.DateByTimestamp(t.log_time,'yyyy-MM-dd hh:mm:ss'),
                      address:data.netbar_title,
                  } 
              });
            param.selfData.d=extraArr;
          });
      }, 
      //选项卡单击事件
      kindchange(item){
          this.curKind=item;this.curShowPage=item.val;
          this.$nextTick(()=>{
              if(item.val==2)//时间轴
              {
                  this.$refs.analyTime.reloadyScroll();
                  this.$refs.analyTime.reInitTime();
                  setTimeout(()=>{
                      this.$refs.analyTime.hideTip();
                  },100);
                  setTimeout(()=>{
                      this.$refs.analyTime.showTip();
                  },200);
              }
              if(item.val==0)//列表显示
              {
                  this.$refs.listShow.reloadyScroll();
                  this.$refs.analyTime.hideTip();
              }
              if(item.val==1 && !this.blnHasLoadMap)//GIS显示
              {
                  this.$refs.gisShow.init();
                  this.blnHasLoadMap=true;
                  this.$refs.analyTime.hideTip();
              }else{
                  this.$refs.analyTime.hideTip();
              }

              if(item.val==3)//频次显示
              {
                  this.$refs.rateListShow.reloadyScroll();
                  this.$refs.analyTime.hideTip();
              }
              
          })
      },
      //分页列表页面
      pageChange(num){
         this.audtime.next(num)
        //  this.pageNum=num>0? num : 0;
        //  this.getData(true);
      },
      //导出结果
      exportRes(){
        //console.log(2);
        //this.data.push({});
        
      },
  }
}
</script>
<style scoped lang="less">
  @import "../css/variables.less";

  .AnaDetail{width:100%;height:100%;background-color:@FrontCol;text-align:left;}
  .AnaDetail .tipBar{padding:5px 0px;.border('bottom');padding: 5px 10px;}

  //操作按钮样式
 .AnaDetail .item{cursor:pointer;display:inline-block;border:1px solid @btn_Bg_Col_hover_1;color:@FontCol;font-size:12px;border-radius:5px;}
 .AnaDetail .item .icon{text-align:center;background-color: @btn_Bg_Col_hover_1;color: white;width: 30px;font-size:14px;float:right;line-height: 26px;}
 .AnaDetail .item .info{padding:0px 10px;line-height: 26px;}

 .AnaDetail .gisShow,
 .AnaDetail .timeShaft,
 .AnaDetail .listShow{height:~"calc(100% - 40px)";}

 //列表显示相关样式
 @itemH:30px;
 .AnaDetail .listShow .listShow_table{display:table;border-collapse: collapse;width:100%;}
 .listShow .listShow_item{height:@itemH;display:table-row;width:100%;line-height:@itemH;text-align:center;}
 .listShow .listShow_item .cell{display:table-cell;}
 .listShow .row.main .icon_id{position:absolute;height: 100%;width: 5px;background-color:@HeaderBgCol;}
 .listShow .listShow_item.child{margin-bottom:5px;.border('bottom')}
 .listShow .listShow_item.sep{height:10px;}
 .listShow .container{
    width: 100% !important;
    list-style: none;
    padding-left: 0px;
    padding: 0px;
    margin-left:0px;
    margin-right:0px;
}

.listShow .container .row{
    line-height: 50px;
    height: 50px;
    text-align: left;
    margin: 0px;
    display: table;
    width: 100%;
    cursor:pointer;
    .trans(.2s);
}
.listShow .container .row:hover{
    color:white;
}

html{.TColIm(~".listShow .container .row:hover",'bg');}

.listShow .row.header{
    color: white;
}

html{.TColIm(~".listShow .row.header",'bg');}

.listShow .container .row .fragment{
    display:table-cell;.border('bottom');.border('right');padding:0px 0px 0px 0px;vertical-align: middle;
}

.listShow .container .row.child{background-color:@FontCol;color:white;}

.scroll_container{height:~"calc(100% - 51px - 40px)";}
.page_container{.border('top');}
.tag_label:hover{color:@btn_Bg_Col_hover_1;}

.row.main.noexpan + div{display:none;}

.ratelistShow .scroll_container{height:~"calc(100% - 51px)";}

 //GIS显示相关样式

 //时间轴显示相关样式
</style>
