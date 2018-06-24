<!-- 案件管理页面组件 -->
<template>
    <div class="CaseManage">
        <div class="CaseManage_container">
            <!--加载中标识-->
            <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index:1000;">
                <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;"><i class="fa fa-spinner fa-pulse"></i></div></div>
            </div>
            <div class="option">
                <div class="item">
                    <span>案件名称</span>
                    <div class="input">
                        <el-input placeholder="案件名称" v-model="query.name"></el-input>
                    </div>
                </div>
                <div class="item">
                    <span>案件时间</span>
                    <div class="input">
                        <el-date-picker v-model="query.time" type="daterange" placeholder="选择日期范围" :picker-options="beforeToday" style="width: 220px"></el-date-picker>
                    </div>
                </div>

                <div class="item" >
                    <el-button type="primary" @click="query_click()"><i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i><span v-show="!blnSearch">搜索</span></el-button>
                </div>

                <div style="float:right;margin-top:10px;">
                    <span class="tag_label" style="margin-left:10px;cursor:pointer;" @click="addCase()">
                        <i class="fa fa-plus" style="margin-right:5px;"></i>新增
                    </span>
                    <span class="tag_label" style="margin-left:10px;cursor:pointer;" @click="exportList()">
                        <i v-if="!blnExporting" class="fa fa-level-up" style="margin-right:5px;"></i>
                        <i v-if="blnExporting" class="fa fa-spinner fa-spin" style="margin-right:5px;"></i>导出
                    </span>
                </div>
            </div>
            <ul class="header">
                <li class="item">
                    <div style="width:80px; cursor:pointer;" @mousedown.stop="blnShowStatus=true">
                        <span style="width:80px;display:block;">
                            <div class="title_content">
                                案件状态 <i class="fa fa-caret-down"></i>
                                <div class="dropDown" v-show="blnShowStatus"><div v-for="d in status" @mousedown.stop="status_click(d)">{{d.name}}</div></div>
                            </div>
                        </span>
                    </div>
                    <div style="width:250px;"><span class="overflow" style="width:250px;">案件名称</span></div>
                    <div :style="{width:case_address_w+'px'}"><span class="overflow" :style="{width:case_address_w+'px'}">案发地点</span></div>
                    <div style="width:130px;"><span class="overflow" style="width:160px;">案发时间</span></div>
                    <div style="width:100px;"><span class="overflow" style="width:100px;">创建人</span></div>
                    <div style="width:130px;"><span class="overflow" style="width:160px;">创建时间</span></div>
                    <div style="width:120px;" class="sep option"><span class="overflow" style="width:120px;">操作</span></div>
                    <div class="count_item"><span class="overflow" style="width:80px;">碰撞分析</span></div>
                    <div class="count_item"><span class="overflow" style="width:80px;">关联分析</span></div>
                    <div class="count_item"><span class="overflow" style="width:80px;">行为分析</span></div>
                    <div class="count_item"><span class="overflow" style="width:80px;">同行分析</span></div>
                    <div class="count_item"><span class="overflow" style="width:80px;">报警布控</span></div>
                </li>
            </ul>
            <div class="content">
                <Scroll :listen="data">
                    <ul class="body">
                        <li class="item" style="text-align:center;display: table-caption;" v-if="showData.length<=0">暂无数据</li>
                        <li v-for="(d,i) in showData" class="item">
                            <div style="width:80px;"><span class="overflow" style="width:80px;" :style="{color:d.status=='running'?'inherit':'rgb(3, 171, 103)',cursor:d.status=='running'?'pointer':'inherit'}" @click="itemClick(d)">{{d.status=="running"?'处理中':'完成'}}</span></div>
                            <div style="width:250px;" :title="d.name"><span class="overflow" style="width:250px;">{{d.name}}</span></div>
                            <div :style="{width:case_address_w+'px'}" :title="d.address"><span class="overflow" :style="{width:case_address_w+'px'}">{{d.address}}</span></div>
                            <div style="width:130px;" :title="d.caseTime"><span class="overflow" style="width:160px;">{{d.caseTime}}</span></div>
                            <div style="width:100px;" :title="d.user"><span class="overflow" style="width:100px;">{{d.user}}</span></div>
                            <div style="width:130px;" :title="d.createTime"><span class="overflow" style="width:160px;">{{d.createTime}}</span></div>
                            <div style="width:120px;" class="sep option"><span class="overflow" style="width:120px;"><span @click.stop="detail(d)">详细</span><span @click.stop="addCase(d)">修改</span><span @click.stop="delCase(d,i)">删除</span></span></div>
                            <div class="count_item" @click.stop="countClick(getTaskType('碰撞分析'),d)"><span class="overflow" style="width:80px;">{{d.crashNumber}}</span></div>
                            <div class="count_item" @click.stop="countClick(getTaskType('关联分析'),d)"><span class="overflow" style="width:80px;">{{d.tradeNumber}}</span></div>
                            <div class="count_item" @click.stop="countClick(getTaskType('行为分析'),d)"><span class="overflow" style="width:80px;">0</span></div>
                            <div class="count_item" @click.stop="countClick(getTaskType('同行分析'),d)"><span class="overflow" style="width:80px;">{{d.actionNumber}}</span></div>
                            <div class="count_item"><span class="overflow" style="width:80px;" @click.stop="ctrlDelay(d)">{{d.idenNumber}}</span></div>
                        </li>
                    </ul>
                </Scroll>
            </div>

                <div class="page_container">
                <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageNum+1}}</span></span>
                <div class="firstPage" @click="pageChange(0)">首页</div>
                <div class="prePage" @click="pageChange(pageNum-1)">上一页</div>
                <div class="nextPage" @click="pageChange(pageNum+1)">下一页</div>
            </div>  
        </div>
    </div>
</template>

<script>
import Scroll from 'components/scroll'
import cInput from 'components/Input'
import TaskType from '../../enum/TaskType'
import RelativeAnlay from './anlay'
import AddPop from './addPop'
import {GetCase,AddCase,DelCase,UpdateCase,GetAnalyTask,BODY_RESIZE,Add_History_Menu,ExportLawCase} from '../../store/mutation-types'
export default {
  name: 'CaseManage',
  components:{Scroll},
  data () {
    return {
        beforeToday:{//限制只能选择今天之前的日期
            disabledDate(time) {
                return time.getTime() > Date.now();
            }
        },
        bodyResizeSub:null,
        blnLoading:false,
        taskType:TaskType,
        limit:10,
        pageNum:0,
        status:[{name:'所有',val:-1},{name:'完成',val:1},{name:'处理中',val:0}],
        curStatus:{name:'所有',val:-1},
        curStatu:'',
        blnShowStatus:false,
        bodyClickId:-1,
        blnSearch:false,
        query:{name:'',time:[]},
        case_address_w:0,
        blnExporting:false,
        data:[
            // {
            //     status:'完成',
            //     name:'xxx手机盗窃',
            //     address:'重庆市xxx',
            //     caseTime:'2017-01-01 12:12',
            //     user:'智多产品部',
            //     createTime:'2017-01-01 12:12',
            //     idenNumber:1,
            //     crashNumber:1,
            //     actionNumber:1,
            //     tradeNumber:1,
            //     deployNumber:1
            // }
        ]
    }
  },
  mounted(){
    this.bodyClickId=tool.SingleBind('mousedown',$('body'),()=>{
       this.blnShowStatus=false;
    });

    this.refreshPage();

    this.case_address_w=$(this.$el).width()-1280;
    // this.$store.commit(BODY_RESIZE,()=>{
    //     this.case_address_w=$(this.$el).width()-1280;
    // });

    this.$store.commit(BODY_RESIZE,{cb:(sub)=>{
       this.bodyResizeSub=sub
    },sub:()=>{
      this.case_address_w=$(this.$el).width()-1280;
    }});
  },
  beforeDestroy(){
    this.bodyResizeSub.unsubscribe();
  },
  computed:{
      showData(){
          return _.map(this.data,r=>{
                return {
                    law_case_id:r.law_case_id,
                    law_case_time:r.law_case_time,
                    law_case_note:r.law_case_note,
                    law_case_status:r.law_case_status,
                    status:r.law_case_status || 'running',
                    name:r.law_case_title || '',
                    address:r.law_case_place || '',
                    caseTime:r.law_case_time?tool.DateByTimestamp(r.law_case_time,'yyyy-MM-dd hh:mm:ss'):'',
                    user:r.account,
                    createTime:tool.DateByTimestamp(r.log_time,'yyyy-MM-dd hh:mm:ss'),
                    idenNumber:r.audit_count || 0,
                    crashNumber:r.collide_count || 0,
                    actionNumber:r.together_count || 0,
                    tradeNumber:r.correlation_count || 0
                }
            });
      }
  },
  destroyed(){
    tool.ClearBind(this.bodyClickId)
  },
  methods:{
      //刷新页面
      refreshPage(){
          this.pageNum=0;
          this.loadData();
      },
      //加载数据
      loadData(){
          this.blnLoading=true;
          //获取案件信息
          this.$store.dispatch(GetCase,{limit:this.limit,skip:this.pageNum*this.limit}).then(res=>{
            this.blnLoading=false;
            if(!tool.msg(res))return;
            this.data=res.biz_body;
          });
      },
      //导出列表信息
      exportList(){
        this.blnExporting=true;
        this.$store.dispatch(ExportLawCase,{
            law_case_title:this.query.name,
            law_case_status:this.curStatu,
            law_case_time:this.query.time[0]?[tool.Timestamp(this.query.time[0]),tool.Timestamp(this.query.time[1])].join(','):'',
        }).then(res=>{
            this.blnExporting=false;
            if(!tool.msg(res,'导出成功!','导出失败!')) return;

            window.location=res.biz_body.url;

        });
      },
      getTaskType(id){
        return _.find(this.taskType,t=>{return  t.id==id});
      },
      pageChange(index){
          this.pageNum=index>0? index : 0;
          //获取案件信息
          this.$store.dispatch(GetCase,{law_case_status:this.curStatu,limit:this.limit,skip:this.pageNum*this.limit}).then(res=>{
            if(!tool.msg(res))return;
            let data=res.biz_body;

            if(data.length<=0){
                tool.msg({msg:{code:'successed'}},'已经到了最后页!','已经到了最后页!');
                this.pageNum =this.pageNum-1;
                return;
            }

            this.data=data;
          });
      },
      status_click(d){
        this.blnShowStatus=false;
        this.curStatus=d;
        this.blnSearch=true;
        this.pageNum=0;

        this.curStatu='';
        if(d.val==1){//完成
            this.curStatu='completed'   
        }else if(d.val==0){//处理中
            this.curStatu='running'
        }
    
        this.$store.dispatch(GetCase,{
            law_case_status:this.curStatu,
            limit:this.limit,
            skip:this.pageNum*this.limit
        }).then(res=>{
            this.blnSearch=false;
            if(!tool.msg(res,'','搜索失败!'))return;
            this.data=res.biz_body;
        });
      },
      query_click(){
          this.blnSearch=true;
          this.pageNum=0;
          this.$store.dispatch(GetCase,{
              law_case_title:this.query.name,
              law_case_status:this.curStatu,
              law_case_time:this.query.time[0]?[tool.Timestamp(this.query.time[0]),tool.Timestamp(this.query.time[1])].join(','):'',
              limit:this.limit,
              skip:this.pageNum*this.limit
          }).then(res=>{
              this.blnSearch=false;
              if(!tool.msg(res,'','搜索失败!'))return;
              this.data=res.biz_body;
          });
      },
      //数据项单击事件
      itemClick(d){
        if(d.status!="running")return;

        tool.confirm('该案件是否已完成?',['确定','取消'],()=>{
            let temp={
                law_case_id:d.law_case_id,
                law_case_title:d.name,
                law_case_status:'completed',
                law_case_place:d.address,
                law_case_time:tool.Timestamp(new Date()),
                law_case_note:d.law_case_note || ''
            };

            this.$store.dispatch(UpdateCase,temp).then(res=>{
                if(!tool.msg(res,'修改成功!','修改失败!')) return;
                let data= _.find(this.data,r=>r.law_case_id==d.law_case_id);
                Object.assign(data,temp);
            });
        },function(){});
      },
      //删除案件
      delCase(d,i){
        tool.confirm('您确定要删除该案件吗?',['确定','取消'],()=>{
            this.$store.dispatch(DelCase,d.law_case_id).then(res=>{
                if(!tool.msg(res,'删除成功!','删除失败!'))return;
                this.data.splice(i,1);
            });
        },function(){});
      },
      //报警布控项单击事件
      ctrlDelay(d){
          if(d.idenNumber<=0)return;
          let s=this;
        //   let menus=_.flatten(_.pluck(this.$store.getters.Menus,'menus'));
        //   let menu=tool.Clone(_.find(menus,m=>m.keyid=='11010'));
        //   menu.type=menu.type || 'templatePage';
        //   menu.id=menu.keyid;
        //   menu._law_case_id=d.law_case_id;//内部案件ID
          
          let popW = $(window).width();
          let popH = $(window).height();
          let html=`
            <component  is="deployCtrlPage"
                        :params="params " 
                        :store="store"
                        style="padding:0px;"
                        class="component-item" 
                        >
            </component>
          `;

          tool.open(function(){
              let param={
                title:'报警关联信息',
                area: [`${popW}px`,`${popH}px`],
                offset:['0px','0px'],
                content:`<div class="policeRelativeInfo" style="position:relative;width:100%;height:100%;overflow-y:auto;font-size:12px;">${html}</div>`,
                components:{},
                context:{
                   params:{model:{_law_case_id:d.law_case_id},blnNoCaseHide:true},
                   store:s.$store
                },
                success(){
                    
                }
            };
            return param;
          }());
          //this.$store.commit(Add_History_Menu,menu);

      },
      countClick(type,d){
        let s=this;
    
        let html=`
                    <RelativeAnlay :data="data" :store="store" :kind="type"></RelativeAnlay>
                `;
        tool.open(function(){
            let param={
                title:'案件关联',
                area:['466px','300px'],
                content:`<div class="caseManagePopCount" style="position:relative;width:100%;height:100%;overflow-y:auto;font-size:12px;">${html}</div>`,
                components:{RelativeAnlay},
                context:{
                    data:[],
                    store:s.$store,
                    type:type.val,
                },
                success(){
                    //获取案件下相关任务信息
                    s.$store.dispatch(GetAnalyTask,{law_case_id:d.law_case_id}).then(res=>{
                        param.selfData.data=res.biz_body;
                    });
                }
            };
            return param;
        }());
      },
      detail(d){
        tool.open(function(){
            let html=`
                    <div class="row" style="margin:0px;">
                        <div style="display:inline-block;width:100%;line-height:25px;">
                            <span>案件名称<span style="margin-right:5px;">:</span>
                            <span>${d.name}</span>
                        </div><div style="display:inline-block;width:100%;line-height:25px;">
                            <span>案发时间<span style="margin-right:5px;">:</span>
                            <span>${d.caseTime}</span>
                        </div><div style="display:inline-block;width:100%;line-height:25px;">
                            <span>案发地点<span style="margin-right:5px;">:</span>
                            <span>${d.address}</span>
                        </div><div style="display:inline-block;width:100%;">
                             <div style="float:left;">备注信息:</div>
                            <div style="margin-left:60px;margin-right:0px;max-height;100px;">${d.law_case_note || ''}</div>
                        </div>

                    </div>
                `;
            let param={
                title:'详细',
                area:'400px',
                content:`<div class="caseManagePopDetail" style="width:100%;height:100%;overflow-y:auto;padding:10px;font-size:12px;">${html}</div>`,
                components:{cInput},
                context:{

                }
            };

            return param;
        }());
      },
      addCase(d){
          if(d){//修改
              AddPop.addCase.call(this,[d,(d)=>{
                let data= _.find(this.data,r=>r.law_case_id==d.law_case_id);
                Object.assign(data,d);
              }]);
          }else{//新增
              AddPop.addCase.call(this,[(d)=>{this.data.unshift(d);}]);
          }
      }
  }
}
</script>
<style lang="less">
  @import "../../css/variables.less";
</style>
<style scoped lang="less">
  @import "../../css/variables.less";

  @rowH:50px;
  .CaseManage{width:100%;height:100%;overflow:hidden;padding:5px;}
  .CaseManage_container{width:100%;height:100%;}
  .CaseManage .body,
  .CaseManage .header{width: 100% !important;list-style: none;padding-left: 0px;padding: 0px;margin-bottom:0px;display:table;}
  .CaseManage .body .item,
  .CaseManage .header .item{line-height: @rowH;height: @rowH;text-align: left;margin: 0px;display: table-row;width: 100%;color: white;}
  html{.TCol(~".CaseManage .header .item",'bg');}
  .CaseManage .body .item > div,
  .CaseManage .header .item > div{display: table-cell;.border('bottom');.border('right');padding: 0px 0px 0px 0px;vertical-align: middle;text-align:center;}
  
  .CaseManage .body .item{background-color:white;color:@HeaderBgCol;}

  .CaseManage .body .item .sep,
  .CaseManage .header .item .sep{border-right:2px solid @FontCol;}
  .CaseManage .body .item .option,
  .CaseManage .header .item .option{width:120px;background-color: inherit;}
  .CaseManage .body .item .count_item,
  .CaseManage .header .item .count_item{width:80px;}
  
  .CaseManage .body .item .option .overflow > span{border:none;font-size:12px;display: initial;margin-right:5px;}
  .CaseManage .body .item .option .overflow > span:hover{cursor:pointer;}

  html{.TCol(~".CaseManage .body .item .option .overflow > span:hover");}
  
  @optionH:50px;
  .CaseManage .option{width:100%;height:@optionH;background-color: white;}
  .CaseManage .page_container{.border('top');.border('bottom');background-color:white;}
  .CaseManage .content{width:100%;height:~'calc(100% - @{optionH} - @{rowH} - 40px)';background-color:white;}

  .CaseManage .header .item .dropDown{position: absolute;z-index: 100;top: 35px;line-height: initial;margin-left: 5px;
        width: calc(100% - 10px);
        color: black;
        text-align:left;
        background-color: white;
        -moz-box-shadow: 2px 2px 2px #333333;
        -webkit-box-shadow: 2px 2px 2px #333333;
        box-shadow: 2px 2px 2px #333333;
        font-size: 12px;
  }

  .CaseManage .header .item .dropDown div{.border('bottom');line-height:25px;padding:0px 10px;}
  .CaseManage .header .item .dropDown div:hover{color:white;cursor:pointer;}
  html{.TCol(~".CaseManage .header .item .dropDown div:hover",'bg');}

  .CaseManage .header .item .title_content{position:relative;}
  
  .CaseManage .option{text-align: initial;padding:10px;}
  .CaseManage .option .item{display:inline-block;}
  .CaseManage .option .item .input{display:inline-block;}
  .CaseManage .tag_label:hover{color:@btn_Bg_Col_hover_1;}

  .CaseManage .body .item .count_item:hover{cursor:pointer;}
  html{.TCol(~".CaseManage .body .item .count_item:hover");}
  .overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}
</style>
