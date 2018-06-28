<!-- 综合分析页面组件 -->
<template>
    <div class="analysis">
        <!--加载中标识-->
        <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index: 100;">
          <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;"><i class="fa fa-spinner fa-pulse"></i></div></div>
        </div>
       <div class="page">
        <!--综合分析-->
        <div class="header">
              <titleComp title="综合分析" />
              <!--<div class="search_container"><SearchInput holder="按关键字查询" /></div>-->
        </div>
        <div class="analysis_container">
              <labelComp v-for="kind in taskKind" class="item" 
                :title="kind.name" 
                :completeNum="(countData[kind.val] || []).length" 
                :ayalysisiNum="(countData[kind.val] || []).filter(function(r){return r.task_status!='completed' && r.task_status!='aborted'}).length" 
                :kind="kind" v-on:addClick="addAnaly" 
                :icon="kind.icon"
                :blnNoAdd="kind.blnDisabled"
              />
        </div>
        <!--任务总览-->
        <div class="header">
              <div class="titleComp" style="cursor:pointer;display:inline-block;" >
                <i class="fa fa-caret-down" style="font-size:18px;" ></i>
                <span style="font-style: italic;">任务总揽</span>
              </div>
              <div style="display:inline-block;margin-left:10px;">
                <span>任务状态:</span>
                <div style="display:inline-block;margin-left:0px;width:130px;">
                    <el-select v-model="showStatus" placeholder="显示状态">
                        <el-option
                        v-for="kind in showStatuss"
                        :key="kind.val"
                        :label="kind.name"
                        :value="kind.val">
                        </el-option>
                    </el-select>
                </div>
              </div>
              <div style="display:inline-block;margin-left:10px;">
                <!--<span class="tag_label" style="margin-left:10px;cursor:pointer;" v-for="k in tags" @click="tagchange(k)">
                  <i :class="k.icon" style="margin-right:5px;"></i>{{k.name}}
                </span>-->
                <span>任务类型:</span>
                <div style="display:inline-block;margin-left:0px;width:130px;">
                    <el-select v-model="showKind" placeholder="显示类型">
                        <el-option
                        v-for="kind in showKinds"
                        :key="kind.val"
                        :label="kind.name"
                        :value="kind.val">
                        </el-option>
                    </el-select>
                </div>
              </div>
              <div style="display:inline-block;margin-left:10px;">
                <span>创建时间:</span>
                <div style="display:inline-block;margin-left:0px;width:220px;">
                    <el-date-picker v-model="rangDate" type="daterange" placeholder="选择日期范围" :picker-options="beforeToday" style="width: 220px"> </el-date-picker>
                </div>
              </div>
              <!--<div style="float:right;magrin-right:20px;margin-top:10px;" v-show="curTag.val==1">
                  <div class="tipInfo"><div class="color gain"></div><div class="content">分析中</div></div>
                  <div class="tipInfo"><div class="color collect"></div><div class="content">执行中</div></div>
                  <div class="tipInfo"><div class="color result"></div><div class="content">完成</div></div>
              </div>-->

              <div style="float:right;margin-top:10px;">
                <span class="tag_label" style="margin-left:10px;cursor:pointer;" @click="exportList()">
                    <i v-if="!blnExporting" class="fa fa-level-up" style="margin-right:5px;"></i>
                    <i v-if="blnExporting" class="fa fa-spinner fa-spin" style="margin-right:5px;"></i>导出
                </span>
              </div>
        </div>
        <div class="task_container">
            <div class="scrollContainer">
              <div class="slidee">
                  <!--卡片显示-->
                  <div v-show="curTag.val==0" style="margin-top:10px;">
                      <taskComp v-for="task in tasks" 
                      :title="task.task_name+showTaskKind(task.task_type)" 
                      :subject="task.kind" :time="converTime(task.create_time)" 
                      :status="converStatus(task.task_status)" 
                      :resNum="task.resNum" 
                      :icon="task.icon"
                      :data="task"
                      :detaiCallback="detail" 
                      :lookConditionClick="lookCondition"
                      :blnHigh="task.task_type==showKind"
                  />
                  </div>
                  <!--列表显示-->
                  <div v-show="curTag.val==1">
                      <div class="table_header">
                        <div class="row">
                          <div class="item">任务状态</div>
                          <div class="item">任务类型</div>
                          <div class="item">任务名称</div>
                          <div class="item">任务结果</div>
                          <div class="item">
                            创建时间
                            <div class="sort_item" style="display: inline-block;text-align: center;position:relative;">
                              <div class="triangle-up" style="position: absolute;top:-11px;" :class="{active:timeSort==1}" @click="timeSort=1"></div>
                              <div class="triangle-down" style="position: absolute;top:-4px;" :class="{active:timeSort==2}" @click="timeSort=2"></div>
                            </div>
                          </div>
                          <div class="item">创建者</div>
                          <div class="item">操作</div>
                          <div class="item">分析结果</div>
                        </div>
                        <div class="row" v-for="task in filterTask()">
                            <div class="item">
                              <div class="progress_bar">
                                <div v-if="task.task_status!='completed' && task.task_status!='aborted'"><i class="fa fa-spinner"></i> 分析中</div>
                                <div v-if="task.task_status=='completed'"><i class="fa fa-check-circle"></i> 已完成</div>
                                <div v-if="task.task_status=='aborted'"><i class="fa fa-exclamation-triangle"></i> 异常</div>
                              </div>
                            </div>
                            <div class="item">{{showTaskKind(task.task_type)}}</div>
                            <div class="item">{{task.task_name}}</div>
                            <div class="item">{{task.task_status=='completed'?task.result_count || 0:'--'}}</div>
                            <div class="item">{{converTime(task.create_time)}}</div>
                            <div class="item">{{task.account}}</div>
                            <div class="item">
                              <!--<span @click="updateTask(task)" style="cursor:pointer;">
                                <el-tooltip effect="light" content="修改" placement="top">
                                  <i class="fa fa-pencil"></i>
                                </el-tooltip>
                              </span>-->
                              <span @click="delTask(task)" style="cursor:pointer;">
                                <el-tooltip effect="light" content="删除" placement="top">
                                  <i class="fa fa-remove"></i>
                                </el-tooltip>
                              </span>
                              <span @click="lookCondition(task)" style="cursor:pointer;">
                                <el-tooltip effect="light" content="条件" placement="top">
                                  <i class="fa fa-eye"></i>
                                </el-tooltip>
                              </span>
                              <span @click="relativeTask(task)" style="cursor:pointer;">
                                <el-tooltip effect="light" content="案件关联任务" placement="top">
                                  <i class="fa fa-briefcase" :style="{color:task.law_case?'inherit':'gray'}"></i>
                                </el-tooltip>
                              </span>
                            </div>
                            <div class="item">
                              <span style="cursor:pointer;" @click="detail(task.task_id,task.task_type,task)">
                                <el-tooltip effect="light" content="详细" placement="top">
                                  <i class="fa fa-navicon"></i>
                                </el-tooltip>
                              </span>
                            </div>
                        </div>
                      </div>
                  </div>
              </div>
            </div>
            <div name="scrollBar" class="scrollbar" v-show="blnShowScroll">
                  <div class="handle"></div>
            </div>  
        </div>
        <div name="page_container" class="page_container">
            <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">
              当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageIndex+1}}</span>,
              &nbsp;&nbsp;&nbsp;共&nbsp;&nbsp;<span>{{pageTotal}}&nbsp;&nbsp;页</span>
            </span>
            <div class="firstPage" @click="pageChange(0)">首页</div>
            <div class="prePage" @click="pageChange(pageIndex-1)">上一页</div>
            <div class="nextPage" @click="pageChange(pageIndex+1)">下一页</div>
            <div class="nextPage" @click="pageChange(pageTotal-1)">最后页</div>
        </div>
       </div>

       <!--碰撞分析添加任务页面-->
       <div style="position:absolute;left:0px;top:0px;right:0px;bottom:0px;" v-if="showCrash">
          <!--标题栏-->
          <div style="height:40px;line-height:40px;background-color:#c6c6c6;padding:0px 15px;text-align:left;">
              碰撞分析&nbsp;>&nbsp;新增任务
              <span style="float:right;cursor:pointer;" @click="closeCrash()">X</span>
          </div>
          <div style="position:absolute;top:40px;left:0px;right:0px;bottom:0px;">
            <CrashAnaly :store="store"  v-on:pre="preCrash" v-on:submit="submitCrash" v-on:dataChange="crashDataChangeCrash" />
          </div>
       </div>
    </div>
</template>

<script>
import SearchInput from 'components/searchInput'
import cSelect from 'components/Select'
import InputDir from 'components/Input'
import taskKind,{taskObject} from '../enum/TaskType'
import CrashAnaly from 'components/crash_analy'
import Relation from '../pages/relation'
import dropdwonBtn from 'components/dropdwonBtn'
import RelativeAnlay from '../modules/case/anlay'
import CrashSecondDetail from 'components/crash_second_detail'
import PeerTrack from '../examples/PeerTrack.example.vue'

import {AddAnalyTask,GetAnalyTask,DelAnalyTask,GetAnalyTaskData,GetVirType,GetCase,ExportAnalyTask} from '../store/mutation-types'

let preCrashFunc=null;
let submitCrashFunc=null;
let crashDataChangeCrashFunc=null;
let closeCrashFunc=null;
export default {
  name: 'Analysis',
  components:{
    SearchInput,
    CrashAnaly,
    cSelect,
    InputDir,
    CrashSecondDetail,
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
          // this.blnExpan= !this.blnExpan;
          // this.$emit('change',this.blnExpan);
        }
      }
    },
    //标签组件
    labelComp:{
        props:['title','completeNum','ayalysisiNum','kind','icon','blnNoAdd'],
        template:`<div class="label_info">
                    <div class="header"><span class="title">{{title}}</span></div>
                    <div class="label_info_container">
                        <i class="icon_container" :class="icon"></i>
                        <div class="analy_container">
                            <div class="analy"><span>总&nbsp;&nbsp;&nbsp;&nbsp;数</span><span class="num" style="margin-left:13px;">{{completeNum}}</span></div>
                        </div>
                        <div class="analy_container">
                            <div class="analy"><span>分析中</span><span class="num">{{ayalysisiNum}}</span></div>
                        </div>
                        <div class="complete_container">
                          <div class="complete"><span>已完成</span><span class="num">{{completeNum-ayalysisiNum}}</span></div>
                        </div>
                        <div class="addBtn" v-if="!blnNoAdd" @click="itemClick(kind)"><i class="fa fa-plus" /></div>
                        <div class="addBtn" v-if="blnNoAdd" style="background-color:gray;">
                          <el-tooltip style="cursor:pointer;" class="item" effect="light" :content="title+'接口暂未接入'" placement="top">
                            <i class="fa fa-plus" />
                          </el-tooltip>  
                        </div>
                    </div>
                  </div>`,
          methods:{
            itemClick(kind){
             this.$emit('addClick',kind);
            }
          }
    },
    //任务组件
    taskComp:{
        props:['title','subject','time','status','resNum','icon','data','detaiCallback','lookConditionClick','blnHigh'],
        template:`<div class="label_info task" :class="{highShow:blnHigh}">
                    <div class="header">
                        <span class="title">{{title}}</span><span class="subject">{{subject}}</span>
                        <span style="float:right;color:white;cursor:pointer;">
                          <el-tooltip effect="light" content="详细" placement="top">
                            <i class="fa fa-bars" @click="detailClick()"></i>
                          </el-tooltip>
                          <el-tooltip effect="light" content="条件" placement="top">
                            <i class="fa fa-cogs" @click="lookCondition()"></i>
                          </el-tooltip>
                        </span>
                    </div>
                    <div class="label_info_container">
                        <div class="item">添加时间 : {{time}}</div>
                        <div class="item">分析状态 : {{status}}</div>
                        <div class="item">分析结果 : {{resNum || 0}}条</div>
                        <i class="icon" :class="icon" />
                    </div>
                  </div>
                 `,
        methods:{
          //详细单击事件
          detailClick(){
            if(!this.detaiCallback) return;
            this.detaiCallback(this.data.task_id,this.data.task_type);
          },
          //查看条件信息
          lookCondition(){
            if(!this.lookCondition) return;
            this.lookConditionClick(this.data);
          }
        }
    }
  },
  watch:{
    curTag(){
       this.$nextTick(()=>{
         this.reloadyScroll();
       });
    },
    tasks(){
      //处理统计数据
      this.countData=_.chain(this.tasks).groupBy(r=>r.task_type).value();
      //处理分页数据
      this.pageTotal=Math.ceil(this.tasks.length/this.pageNum);
    },
    countData(){
      this.$nextTick(()=>{
        this.reloadyScroll();
      });
    },
    showKind(){
      let filterTasks=this.getFilterTasks();

      this.pageIndex=0;
      this.pageTotal=Math.ceil(filterTasks.length/this.pageNum);
    },
    showStatus(){
      let filterTasks=this.getFilterTasks();

      this.pageIndex=0;
      this.pageTotal=Math.ceil(filterTasks.length/this.pageNum);
    },
    rangDate(){
      let filterTasks=this.getFilterTasks();

      this.pageIndex=0;
      this.pageTotal=Math.ceil(filterTasks.length/this.pageNum);
    }
  },
  data () {
    return {
      beforeToday:{//限制只能选择今天之前的日期
           disabledDate(time) {
               return time.getTime() > Date.now();
           }
      },
      showKind:'all',
      showKinds:(function(){
        return [{name:'显示全部',val:'all'}].concat(taskKind);
      }()),
      showStatus:'all',
      showStatuss:[
        {name:'显示全部',val:'all'},{name:'分析中',val:'created'},{name:'完成',val:'completed'},{name:'异常',val:'aborted'}
      ],
      timeSort:2,//排序方向(0:无排序,1:升序,2:降序)
      rangDate:[],//时间范围
      blnShowScroll:false,
      scrollIns:null,
      scrollDom:null,
      taskKind:taskKind,
      //tags:[{name:'卡片显示',val:0,icon:'fa fa-credit-card'},{name:'列表显示',val:1,icon:'fa fa-list'}],
      tags:[{name:'列表显示',val:1,icon:'fa fa-list'}],
      curTag:{name:'列表显示',val:1},
      tasks:[],
      cases:[],//案件信息
      countData:{},//统计数据
      blnLoading:false,
      pageIndex:0,//分页索引
      pageNum:10,//每页显示数量
      pageTotal:0,//页号总数
      showCrash:false,
      store:null,
      blnExporting:false,
    }
  },
  mounted(){
    this.store=this.$store;
    this.scrollDom=$('div[class="task_container"] > div[name="scrollBar"]');
    $('.analysis .task_container').height($(this.$el).height()-270);
    this.initScroll();

    this.loadData();
    //监听任务状态推送事件
    let socket = io(ser.url);
    socket.on('AnalyTask', (data)=> {
      let d=eval('('+data+')');
      //替换状态
      let task = _.find(this.tasks,t=>t.task_id==d.task_id);
      if(!task) return;
      task.task_status=d.task_status;
      task.result_count=d.count;
    });
    
  },
  methods:{
    //导出任务列表信息
    exportList(){
      this.blnExporting=true;

      let startTime='',
          endTime='';
      if(this.rangDate && this.rangDate.length>1 && this.rangDate[0] && this.rangDate[1]){
        startTime=tool.Timestamp(this.rangDate[0]);
        endTime=tool.Timestamp(this.rangDate[1]);

        let date=new Date();
        date.setDate(this.rangDate[1].getDate()+1);
        endTime=tool.Timestamp(date);
      }

      this.$store.dispatch(ExportAnalyTask,{
        task_type:this.showKind=='all'?'':this.showKind,
        task_status:this.showStatus=='all'?'':this.showStatus,
        start_time:startTime,
        end_time:endTime
      }).then(res=>{
          this.blnExporting=false;
          if(!tool.msg(res,'导出成功!','导出失败!')) return;

          window.location=res.biz_body.url;

      });
    },
    //获取过滤后的任务集合数据
    getFilterTasks(){
      let tasks=this.tasks;
      if(this.timeSort==1){//升序
        tasks=_.sortBy(tasks,t=>{return parseInt(t.create_time);});
      }else if(this.timeSort==2){//降序
        tasks=_.sortBy(tasks,t=>{return -parseInt(t.create_time);});
      }

      if(this.showKind!='all'){
        tasks=_.filter(tasks,t=>{return  t.task_type==this.showKind;});
      }

      if(this.showStatus!='all'){
        tasks=_.filter(tasks,t=>{return  t.task_status==this.showStatus;});
      }

      if(this.rangDate && this.rangDate.length>1 && this.rangDate[0] && this.rangDate[1]){
        let startTime=tool.Timestamp(this.rangDate[0]),endTime=tool.Timestamp(this.rangDate[1]);

        //if(startTime==endTime){
          let date=new Date();
          date.setDate(this.rangDate[1].getDate()+1);
          endTime=tool.Timestamp(date);
        //}

        tasks=_.filter(tasks,t=>{return startTime<=parseInt(t.create_time) && parseInt(t.create_time) <=endTime; });
      }


      return tasks;
    },
    //分页改变事件
    pageChange(index){
      if(index<0){ tool.info('已经到了首页!');return;}
      if(index>=this.pageTotal){ tool.info('已经到了最后页!');return;}
      this.pageIndex=index;
    },
    //过滤需要显示任务数据
    filterTask(){
      let tasks=this.getFilterTasks();

      return tasks.slice(this.pageIndex*this.pageNum,(this.pageIndex+1)*this.pageNum);
     
    },
    //刷新页面
    refreshPage(){
      //重置页面数据
      this.rangDate=[];
      this.showStatus='all';
      this.showKind='all';
      this.pageIndex=0;
      this.timeSort=2;
      this.$nextTick(()=>{
        this.loadData();
      });
    },
    //加载数据
    loadData(){
      this.blnLoading=true;
      this.$store.dispatch(GetAnalyTask).then(res=>{
        this.blnLoading=false;
        if(res.msg.code!='successed')return;
        this.tasks=res.biz_body;

      });

      //获取案件信息
      this.$store.dispatch(GetCase,{}).then(res=>{
        if(res.msg.code!='successed')return;
        this.cases=res.biz_body;

      });
    },
    //转化日期显示格式
    converShowTime(info){
      let year=info.substr(0,4) || '',
          mouth=info.substr(4,2) || '',
          day=info.substr(6,2) || '',
          hour=info.substr(8,2) || '00',
          minute=info.substr(10,2) || '00',
          second=info.substr(12,2) || '00';
      return year+'-'+mouth+'-'+day+' '+ hour +':'+minute+':'+second;
    },
    //转化状态
    converStatus(val){
      let res='';
      switch(val){
        case 'created':
          res='分析中';
          break;
        case 'running':
          res='执行中';
          break;
        case 'completed':
          res='完成';
          break;
        case 'aborted':
          res='异常';
          break;
      }
      return res;
    },
    //转化时间格式
    converTime(val){
      return tool.DateByTimestamp(val,'yyyy-MM-dd hh:mm:ss');
    },
    //转化任务类型为显示值
    showTaskKind(val){
      return (_.find(taskKind,k=>{return k.val==val}) || {name:''}).name;
    },
    tagchange(item){
        this.curTag=item;
    },
    //修改任务
    updateTask(task){

    },
    //查看任务详细信息
    detail(id,type,taskData){
      let self=this;
      let popW = $(window).width()*0.8;
      let popH = $(window).height()*0.8;
      
      //判断任务还没有结果的时候需要给予提示
      if((taskData.result_count=='0' ||  !taskData.result_count)&& (taskData.task_status=='created' || taskData.task_status=='running')){
        tool.info('任务正在分析中还未产生结果,请稍候...');
        return;
      }

      if(taskData.task_status=='aborted'){
        tool.info('任务出现异常,请重新创建任务!');
        return;
      }

      //判断是否分析结果为空,为空则需要显示提示信息
      if((taskData.result_count=='0' || !taskData.result_count) && taskData.task_status=='completed'){
        tool.open(function(){
          let html=`
            <div style="width:100%;position:relative;text-align:center;padding: 10px;">
              <i class="fa fa-frown-o" style="font-size:100px;"></i>
            </div>
            <div style="width:100%;text-align:center;padding:10px;">
              本次分析无结果,尝试更改一下任务条件吧！
            </div>
            <div style="width:100%;text-align:center;padding:10px;">
              <el-button type="primary" @click="update()"><span>更改</span></el-button>
            </div>
            <div style="width:100%;text-align:left;padding:10px;font-size:12px;color:gray;">
              <span style="color:red;">*</span>
              点击更改后,将会为您创建一个分析任务,您可以通过更改时间范围,场所范围等方式进行调整
            </div>
          `;

          let param={
            title:'详细信息',
            area: `${popW*.5}px`,
            content:`<div class="openTmp" style="width:100%;height:100%;overflow-y:hidden;position:raltive;">${html}</div>`,
            context:{
              update(){
                self.addAnaly({
                              name:_.find(self.taskKind,t=>{return t.val==taskData.task_type}).id,
                              val:taskData.task_type
                              },
                              taskData
                              );

                param.close();
              }
            }
          };

          return param;
        }());
        return ;
      }


        tool.open((function(){
          let content='';
          switch(_.find(self.taskKind,t=>{return t.val==type}).id){
            case '同行分析':
              content=`<PeerTrack :taskid="taskid" />`;
              break;
            case '关联分析':
              content=`<RelationPage ref="relationCmp" :store="store" :taskid="taskid" />`
              break;
            case '碰撞分析':
              //content=`<CrashDetailPage :store="store" :taskid="taskid" />`
              content=`<CrashSecondDetail :taskid="taskid" />`
              popW=700;
              break;
            case '行为分析':
              content=`<BehaviorPage :store="store"/>`;
              break;
          }
          let html=`${content}`;
          let param={
            title:'详细信息',
            area: [`${popW}px`,`${popH}px`],
            content:`<div class="openTmp" style="width:100%;height:100%;overflow-y:auto;">${html}</div>`,
            store:self.$store,
            components:{PeerTrack},
            context:{
              store:self.$store,
              taskid:id,
            },
            pop_close(){
              if(!param.$refs.relationCmp)return;
              param.$refs.relationCmp.destroy();
            },
          };

          return param;
        })());
    },
    //查看任务条件
    lookCondition(data){
      let s=this; 
      let html=`
            <div class="row" style="margin:0px;line-height:30px;border-bottom:1px solid #e7eaec">
              <div class="col-md-3" style="text-align:center;border-right:1px solid #e7eaec;">
                名称
              </div>
              <div class="col-md-9">${data.task_name}</div>
            </div>
            <div class="row" style="margin:0px;line-height:30px;border-bottom:1px solid #e7eaec">
              <div class="col-md-3" style="text-align:center;border-right:1px solid #e7eaec;">
                任务类型
              </div>
              <div class="col-md-9">${_.find(taskObject,t=>{return t.val==data.task_target_type}).name}</div>
            </div>
          `;
      switch(_.find(this.taskKind,t=>{return t.val==data.task_type}).id){
        case '同行分析':
          html+=`
            <div class="row" style="margin:0px;line-height:30px;border-bottom:1px solid #e7eaec">
              <div class="col-md-3" style="text-align:center;border-right:1px solid #e7eaec;">
                分析目标
              </div>
              <div class="col-md-9">${data.task_conditions.keyword}</div>
            </div>
            <div class="row" style="margin:0px;line-height:30px;border-bottom:1px solid #e7eaec">
              <div class="col-md-3" style="text-align:center;border-right:1px solid #e7eaec;">
                开始时间
              </div>
              <div class="col-md-9">${data.task_conditions.begin_time}</div>
            </div>
            <div class="row" style="margin:0px;line-height:30px;border-bottom:1px solid #e7eaec">
              <div class="col-md-3" style="text-align:center;border-right:1px solid #e7eaec;">
                结束时间
              </div>
              <div class="col-md-9">${data.task_conditions.end_time}</div>
            </div>
            <div class="row" style="margin:0px;line-height:30px;border-bottom:1px solid #e7eaec">
              <div class="col-md-3" style="text-align:center;border-right:1px solid #e7eaec;">
                时间间隔
              </div>
              <div class="col-md-9">${data.task_conditions.interval}</div>
            </div>
            <div class="row" style="margin:0px;line-height:30px;border-bottom:1px solid #e7eaec">
              <div class="col-md-3" style="text-align:center;border-right:1px solid #e7eaec;">
                同行次数
              </div>
              <div class="col-md-9">${data.task_conditions.sitecnt}</div>
            </div>
          `;
          break;
        case '关联分析':
          html+=`
            <div class="row" style="margin:0px;line-height:30px;border-bottom:1px solid #e7eaec">
              <div class="col-md-3" style="text-align:center;border-right:1px solid #e7eaec;">
                分析目标
              </div>
              <div class="col-md-9">${data.task_conditions.keyword}</div>
            </div>
          `;
          break;
        case '碰撞分析':
          html+=`
            <div class="row" style="margin:0px;line-height:30px;border-bottom:1px solid #e7eaec;height: calc(100% - 63px);">
              <div class="col-md-3" style="text-align:center;border-right:1px solid #e7eaec;height: 100%;display: table;">
                <div style="height:100%;width:100%;display:table-cell;vertical-align: middle;">条件</div>
              </div>
              <div class="col-md-9" style="height:100%;overflow-y:auto;padding: 0px;">
                  ${_.map(data.task_conditions.values,(v,i)=>{
                    if(!v.begin_time) return '';
                    
                    return `<div style="border-bottom:1px solid #e7eaec;position:relative;">
                              <div style="width:25px;height:100%;position:absolute;text-align:center;">
                                <div style="width:100%;height:100%;display:table;">
                                  <div style="width:100%;height:100%;display:table-cell;vertical-align: middle;border-right:1px solid #e7eaec;">
                                    ${i+1}
                                  </div>
                                </div>
                              </div>
                              <div style="margin-left:25px;margin-right:0px;padding:0px 10px;">
                                <div style="line-height:20px;">开始时间:${s.converShowTime(v.begin_time)}</div>
                                <div style="line-height:20px;">结束时间:${s.converShowTime(v.end_time)}</div>
                              </div>
                            </div>
                            `
                  }).join('')}
              </div>
            </div>
          `;
          break;
        case '行为分析':
          console.log('行为分析');
          break;
      }

      tool.open(function(d){
          let param={
            title:d.task_name+'分析条件',
            area:_.find(s.taskKind,t=>{return t.val==data.task_type}).id=='碰撞分析'?['400px','300px']:'400px',
            content:`<div class="openAnalyCond" style="width:100%;height:100%;overflow-y:auto;font-size:12px;">${html}</div>`,
            context:{
            }
          };

          return param;
      }(data));

    },
    //关联案件任务
    relativeTask(d){
      if(!d.law_case) return;

      let s=this;
      let html=`
                  <RelativeAnlay :data="data" :store="store" :kind="type"></RelativeAnlay>
              `;
      tool.open(function(){
          let param={
              title:'案件关联',
              area:['591px','300px'],
              content:`<div class="caseManagePopCount" style="position:relative;width:100%;height:100%;overflow-y:auto;font-size:12px;">${html}</div>`,
              components:{RelativeAnlay},
              context:{
                  data:[],
                  store:s.$store,
                  type:d.task_type,
              },
              success(){
                  //获取案件下相关任务信息
                  s.$store.dispatch(GetAnalyTask,{law_case_id:d.law_case}).then(res=>{
                      param.selfData.data=res.biz_body;
                  });
              }
          };
          return param;
      }());
    },
    //删除任务
    delTask(task){
      tool.confirm('您确定要删除该任务信息吗?',['确定','取消'],()=>{
        this.$store.dispatch(DelAnalyTask,task.task_id).then(res=>{
        if(!tool.msg(res,'删除任务成功!','删除任务失败!'))return;
          this.tasks.splice(_.findIndex(this.tasks,t=>{return t.task_id==task.task_id}),1);
        });
      },function(){});
    },
    preCrash(){
      if(!preCrashFunc) return;
      preCrashFunc();
    },
    submitCrash(){
      if(!submitCrashFunc) return;
      submitCrashFunc();
    },
    crashDataChangeCrash(data,otherData){
      if(!crashDataChangeCrashFunc) return;
      crashDataChangeCrashFunc(data,otherData);
    },
    closeCrash(){
      if(!closeCrashFunc) return;
      closeCrashFunc();
    },  
    //新增分析任务(0:同行分析,1:关联分析,2:碰撞分析,3:排查分析)
    addAnaly(kind,extraParam){
      extraParam=extraParam || {};
      extraParam.task_conditions=extraParam.task_conditions || {};
      let self=this;
      let curLayerIndex=null;//当前弹窗实例索引
      let layero=null;

      tool.open(function(){
        let condition='';
        let taskKinds=tool.Clone(taskObject);
        let kindObj=_.find(taskKind,item =>{return item.val == kind.val;});
        switch (kindObj.id) {
          case '同行分析':
            condition=`
                      <div class="item clearfix" v-show="targetKind=='vid'">
                          <span class="title">虚拟类型</span>
                          <div class="input" style="margin-top:10px;">
                            <dropdwonBtn ref="virDropDown" placeholder="请输入虚拟身份类型(支持模糊查找)" :store="store" @change="virChange" dropH="150px">
                              <div v-for="v in virTypes" @mousedown="virItemClick(v)">{{v.name}}</div>
                            </dropdwonBtn>
                          </div>
                      </div>
                      <div class="item clearfix">
                          <span class="title">案件:</span>
                          <div class="input" style="margin-top:-2px;">
                            <el-select style="margin-top: 10px;" v-model="caseRes" placeholder="关联案件">
                                <el-option
                                v-for="item in cases"
                                :key="item.law_case_id"
                                :label="item.law_case_title"
                                :value="item.law_case_id">
                                </el-option>
                            </el-select>
                          </div>
                      </div>
                      <div class="item clearfix">
                          <span class="title">分析目标:</span>
                          <div class="input" style="margin-top:-2px;"><InputDir ref="tongxing_target" label="分析目标" :require="true" tip="必填" @change="analyTarget_change" :val="analyTarget"/></div>
                      </div>
                      <div class="item clearfix">
                        <span class="title">时间区间:</span>
                        <div class="input" style="margin-top:-2px;">
                          <el-date-picker
                              v-model="timeRange"
                              type="daterange"
                              align="right"
                              width="500"
                              placeholder="选择日期范围"
                              :picker-options="pickerOptions2">
                          </el-date-picker>
                         </div>
                       </div>
                       <div class="item clearfix">
                          <span class="title">时间间隔:</span>
                          <div class="input" style="margin-top:-2px;"><InputDir ref="tongxing_time" reg="^[0-9]*$" tip="必须为数字" label="单位/分钟，默认1分钟" @change="timeSep_change" :val="timeSep"/></div>
                       </div>
                       <div class="item clearfix">
                          <span class="title">同行次数:</span>
                          <div class="input" style="margin-top:-2px;"><InputDir ref="tongxing_count" reg="^[0-9]*$" tip="必须为数字" label="单位/次，默认两次" @change="siteNum_change" :val="siteNum"/></div>
                       </div>
                       <!--<div class="item clearfix" style="line-height:34px;">
                            <span class="title">是否去重:</span>
                            <div class="input" style="padding-top:5px;">
                                <el-checkbox v-model="blnDistinct"></el-checkbox>
                            </div>
                      </div>-->
                      <div class="option_bar" style="text-align: right;margin-top:5px;">
                          <button type="button" class="btn btn-success" style="font-size:12px;"  @click="submit">确定</button> 
                          <button type="button" class="btn btn-default" style="font-size:12px;" @click="cancel">取消</button>
                      </div>
                      `;
            break;
          case '关联分析':
            taskKinds=_.filter(taskKinds,t=>{return t.val!='imsi'});
            condition=`
                      <div class="item clearfix">
                          <span class="title">案件:</span>
                          <div class="input" style="margin-top:-2px;">
                            <el-select style="margin-top: 10px;" v-model="caseRes" placeholder="关联案件">
                                <el-option
                                v-for="item in cases"
                                :key="item.law_case_id"
                                :label="item.law_case_title"
                                :value="item.law_case_id">
                                </el-option>
                            </el-select>
                          </div>
                      </div>
                      <div class="item clearfix">
                          <span class="title">分析目标:</span>
                          <div class="input" style="margin-top:-2px;"><InputDir ref="guanlian_target" label="分析目标" :require="true" tip="必填" @change="analyTarget_change" :val="analyTarget"/></div>
                       </div>
                      <div class="option_bar" style="text-align: right;margin-top:5px;">
                          <button type="button" class="btn btn-success" style="font-size:12px;"  @click="submit">确定</button> 
                          <button type="button" class="btn btn-default" style="font-size:12px;" @click="cancel">取消</button>
                      </div>
                      `;
            break;
          case '碰撞分析':
             condition=`
                        <div class="item clearfix">
                          <span class="title">案件:</span>
                          <div class="input" style="margin-top:-2px;">
                            <el-select style="margin-top: 10px;" v-model="caseRes" placeholder="关联案件">
                                <el-option
                                v-for="item in cases"
                                :key="item.law_case_id"
                                :label="item.law_case_title"
                                :value="item.law_case_id">
                                </el-option>
                            </el-select>
                          </div>
                        </div>
                        <div class="option_bar" style="text-align: right;margin-top:5px;">
                            <button type="button" class="btn btn-success" style="font-size:12px;"  @click="next">下一步</button> 
                            <button type="button" class="btn btn-default" style="font-size:12px;" @click="cancel">取消</button>
                        </div>
                       `;
            break;
          case '行为分析':
            condition=`
                      <div class="item clearfix">
                          <span class="title">案件:</span>
                          <div class="input" style="margin-top:-2px;">
                            <el-select style="margin-top: 10px;" v-model="caseRes" placeholder="关联案件">
                                <el-option
                                v-for="item in cases"
                                :key="item.law_case_id"
                                :label="item.law_case_title"
                                :value="item.law_case_id">
                                </el-option>
                            </el-select>
                          </div>
                      </div>
                      <div class="item clearfix">
                        <span class="title">分析目标:</span>
                        <div class="input" style="margin-top:-2px;"><InputDir label="分析目标" @change="analyTarget_change" :val="analyTarget"/></div>
                      </div>
                      <div class="item clearfix">
                        <span class="title">起止时间:</span>
                        <div class="input" style="margin-top:-2px;">
                          <el-date-picker
                              v-model="timeRange"
                              type="daterange"
                              align="right"
                              width="500"
                              placeholder="选择日期范围"
                              :picker-options="pickerOptions2">
                          </el-date-picker>
                        </div>
                      </div>
                      <div class="option_bar" style="text-align: right;margin-top:5px;">
                          <button type="button" class="btn btn-success" style="font-size:12px;"  @click="submit">确定</button> 
                          <button type="button" class="btn btn-default" style="font-size:12px;" @click="cancel">取消</button>
                      </div>
                      `;
            break;
        }
        let html=`
                  <div class="popAddTask">
                    <div v-show="blnFirst">
                      <div class="item clearfix">
                          <span class="title">名称:</span>
                          <div class="input" style="margin-top:-2px;"><InputDir label="默认按照时间命名" @change="name_change" :val="name"/></div>
                      </div>
                      <div class="item clearfix">
                          <span class="title">任务类型:</span>
                          <div class="input" style="margin-top:-2px;">
                            <el-select style="margin-top: 10px;" v-model="targetKind" placeholder="任务对象类型">
                                <el-option
                                v-for="item in targetKindSel"
                                :key="item.val"
                                :label="item.name"
                                :value="item.val">
                                </el-option>
                            </el-select>
                          </div>
                      </div>
                      ${condition}
                      </div>
                      <div v-show="blnNext" style="height:100%;">
                        <CrashAnaly ref="crashAnaly" :store="store" :blnNoInit="true" v-on:pre="pre" v-on:submit="submit" v-on:dataChange="crashDataChange" />
                      </div>
                      <div v-show="blnRelation" style="height:100%;">
                        <Relation ref="relationCmp" :store="store" :blnNoInit="true" style="height:calc(100% - 36px);" />
                        <div class="option_bar" style="text-align: right;margin-top:5px;">
                          <button type="button" class="btn btn-success" style="font-size:12px;"  @click="preCrash">上一步</button> 
                          <button type="button" class="btn btn-default" style="font-size:12px;" @click="cancel">取消</button>
                        </div>
                      </div>
                  </div>
                 `;
        
        preCrashFunc=function(){
          self.showCrash=false;
          param.selfData.blnFirst=true;
          param.selfData.blnNext=false;
          param.selfData.blnRelation=false;
          //layer.restore(curLayerIndex);
          //$('body').find('.layui-layer-shade').show();
          layero.css({'display':'block'});
        };

        submitCrashFunc=function(){
          let data=param.selfData;

          if(data.blnSubmit){return;}
          data.blnSubmit=true;

          let temp={
            task_name:data.name || tool.DateFormat(new Date(),'yyyy-MM-dd hh:mm:ss'),         //任务名称
            task_type:kindObj.val || '',                 //任务类型
            task_target_type:data.targetKind || '',  //任务对象类型
            law_case:data.caseRes,//关联案件
            task_conditions:{}    //分析条件
          }
        
          if(kindObj.id=='同行分析'){
      
            //验证数据格式
            let blnVaild = param.$refs.tongxing_target.Valid();
            blnVaild=param.$refs.tongxing_time.Valid();
            blnVaild=param.$refs.tongxing_count.Valid();
            let msg='';
            if(!data.targetKind){
              msg+='类型必填<br>';
              blnVaild=false;
            }
            if(!data.timeRange[0]){
              msg+='时间区间必填<br>';
              blnVaild=false;
            }

            if(!data.virType && data.targetKind == 'vid'){
              msg+='虚拟类型必选';
              blnVaild=false;
            }

            if(!data.analyTarget){msg+='分析目标必填';blnVaild=false;}
            if(data.analyTarget){
              let kind=_.find(taskObject,t=>t.val==data.targetKind);
              if(kind.reg && !kind.reg.test(data.analyTarget)){
                msg+=`${kind.name}格式不正确`;
                blnVaild=false;
              }
            }
            
        
            if(msg){tool.info(msg);}
            if(!blnVaild){data.blnSubmit=false;return;}

            temp.task_conditions={
              keyword:data.analyTarget,
              begin_time:tool.DateFormat((data.timeRange || ['',''])[0],'yyyy-MM-dd'),
              end_time:tool.DateFormat((data.timeRange || ['',''])[1],'yyyy-MM-dd'),
              interval:data.timeSep || 1,
              sitecnt:data.siteNum || 2,
              distnct:data.blnDistinct?1:0,
              account_type:data.virType || '',
            };
          }else if(kindObj.id=='关联分析'){
            //数据格式验证
            let blnVaild = param.$refs.guanlian_target.Valid();
            let msg='';
            if(!data.targetKind){
              msg+='类型必填';
              blnVaild=false;
            }

            if(!data.analyTarget){msg+='分析目标必填';blnVaild=false;}
            if(data.analyTarget){
              let kind=_.find(taskObject,t=>t.val==data.targetKind);
              if(kind.reg && !kind.reg.test(data.analyTarget)){
                msg+=`${kind.name}格式不正确`;
                blnVaild=false;
              }
            }

            if(msg){tool.info(msg);}
            if(!blnVaild){data.blnSubmit=false;return;}

            temp.task_conditions={keyword:data.analyTarget};
          }else if(kindObj.id=='碰撞分析'){
            //根据交并集生成结果
            //let crashType=[{name:'差集',val:'except'},{name:'并集',val:'union'},{name:'交集',val:'join'}];
            let groupData =data.groupData || [];
        
            data.blnSubmit=false;
            let validGroup = _.filter([(groupData.B1 || []),(groupData.B2 || []),(groupData.B3 || []),
                                      (groupData.C1 || []),(groupData.C2 || []),(groupData.C3 || []),
                                      (groupData.D1 || []),(groupData.D2 || []),(groupData.D3 || [])],f=>f.length>=2);

            let normalData=_.flatten([validGroup]);
                normalData=_.uniq(normalData,n=>n.id);

                normalData=_.map(normalData,(item,i)=>{
                            return {
                              id:item.id,
                              title:item.title,
                              stids:item.sites,
                              sitecnt:item.sitecnt,
                              begin_time:item.val[0].replace(/\-/g, ""),
                              end_time:item.val[1].replace(/\-/g, ""),
                              data_source_ids:[],
                            }
                          });
                
            
            //生成交并集数据
            let genData=function(){
              
              let ids=_.map(arguments,a=>a).slice(4);
              let ds=_.map(_.map(arguments,a=>a).slice(1,4),(item,i)=>{
                item.id=item.id || ids[i];
                return item;
              });
      
              let type = arguments[0];
                  data=_.chain(ds)
                        .filter(f=>f.length>0)
                        .map((itemArr,i)=>{
                          return {
                                  id:itemArr.id,
                                  title:'',
                                  stids:[],
                                  sitecnt:1,
                                  begin_time:'',
                                  end_time:'',
                                  type:type,
                                  data_source_ids:_.map(itemArr,item=>item.id) || [],
                                };
                        }).value();
              return data;
            };
            
            let joinData =[],unionData=[],exceptData=[];
            joinData = genData('join',groupData.B1 || [],groupData.C1 || [],groupData.D1 | [],'B1','C1','D1');
            unionData = genData('union',groupData.B2 || [],groupData.C2 || [],groupData.D2 || [],'B2','C2','D2');
            exceptData = genData('except',groupData.B3 || [],groupData.C3 || [],groupData.D3 || [],'B3','C3','D3');


            // console.log([...joinData,...unionData,...exceptData]);
            // data.blnSubmit=false;
            // return;

            if(normalData.length<=0){
              tool.info('请建立任务条件,每个条件必须至少包含两个元素!');
              data.blnSubmit=false;
              return;
            }

            

            temp.task_conditions={values:[...normalData,...joinData,...unionData,...exceptData]};

          }else if(kindObj.id=='行为分析'){

          }

          self.$store.dispatch(AddAnalyTask,temp).then(res=>{
            if(res.msg.code!='successed')return;
            self.tasks.unshift(res.biz_body[0]);
            tool.info('创建成功!');
            closeCrashFunc();
          });
        };

        crashDataChangeCrashFunc=function(data,otherData){

          param.selfData.groupData=otherData;
          param.selfData.crashConds=_.map(data,(item,i)=>{
            return {
              id:item.id || 'crash_'+i,
              title:item.title,
              stids:item.sites,
              sitecnt:item.sitecnt,
              begin_time:item.val[0].replace(/\-/g, ""),
              end_time:item.val[1].replace(/\-/g, ""),
              data_source_ids:[],
            }
          });
        };

        closeCrashFunc=function(){
          self.showCrash=false;
          param.close();
        };

        let param={
          title:kind.name + ` > 新增任务`,
          components:{InputDir,CrashAnaly,Relation,dropdwonBtn},
          id:'test',
          area:'500px',
          content:`<div style="width:100%;height:100%;overflow:hidden;" :style="{padding:blnNext?'0px':'10px'}">${html}</div>`,
          success(layeroa,index){
            curLayerIndex=index;
            layero=layeroa;
          },
          store:self.$store,
          context:{
            pickerOptions2: {
              disabledDate(time) {
                  return time.getTime() > Date.now();
              },
              shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近一个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近三个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                  picker.$emit('pick', [start, end]);
                }
              }]
            },
            blnLoadCrash:false,//是否已经加载碰撞分析条件地图插件
            blnLoadRelation:false,//是否已经加载关系图插件
            name:extraParam.task_name || '',
            targetKind:extraParam.task_target_type || '',//任务对象类型
            targetKindSel:taskKinds,//任务对象类型选择器数据集合
            timeRange:[],//时间区间
            timeSep:'',//时间间隔
            siteNum:'',//场所数量
            caseRes:'',//关联案件
            cases:_.filter(self.cases,s=>s.law_case_status!='completed') || [],//关联案件可选数据集
            analyTarget:extraParam.task_conditions.keyword ||'',//分析目标值
            blnDistinct:false,//是否去重
            crashConds:[],//碰撞分析条件
            groupData:[],//交并集数据
            name_change(val){param.selfData.name=val;},
            timeSep_change(val){param.selfData.timeSep=val;},
            siteNum_change(val){param.selfData.siteNum=val;},
            analyTarget_change(val){param.selfData.analyTarget=val;},
            blnFirst:true,//碰撞分析时用来切换页面
            blnNext:false,//碰撞分析时用来切换页面(显示碰撞地图页面)
            blnRelation:false,//显示关系图
            store:self.$store,
            blnSubmit:false,//是否正在提交
            virTypes:[],//虚拟类型集合
            virType:'',
            virChange(val){
              if(!val){param.selfData.virType='';}
              //获取虚拟身份类型
              self.$store.dispatch(GetVirType,val).then(res=>{
                if(res.msg.code!='successed')return;
                param.selfData.virTypes=res.biz_body;
              });
            },
            virItemClick(v){
              param.$refs.virDropDown.setVal(v.name);
              param.selfData.virType=v.value;
            },
            submit(){
              submitCrashFunc();
            },
            cancel(){
              param.$refs.relationCmp.destroy();
              param.close();
            },
            next(){
              if(!param.selfData.targetKind){tool.info('类型必填'); return;}
              //layer.full(curLayerIndex);
      
              layero.css({'display':'none'});
              $('body').find('.layui-layer-shade').hide();
              param.selfData.blnFirst=false;
              param.selfData.blnRelation=false;
              setTimeout(()=>{
                //param.selfData.blnNext=true;
              },100);
              
              self.showCrash=true;

              if(param.selfData.blnLoadCrash) return;
              param.$vm.$nextTick(()=>{
               setTimeout(()=>{
                 param.selfData.blnLoadCrash=true;
                 param.$refs.crashAnaly.init();
               },100);
              });
            },
            pre(){
              preCrashFunc();
            },
            //返回到碰撞条件页面
            preCrash(){
              param.selfData.blnFirst=false;
              param.selfData.blnRelation=false;
              param.selfData.blnNext=true;
              param.$vm.$nextTick(()=>{
                param.$refs.relationCmp.stop();
              });
            },
            //碰撞条件设置页面点击下一步
            crashNext(){
              param.selfData.blnFirst=false;
              param.selfData.blnNext=false;
              param.selfData.blnRelation=true;
              if(param.selfData.blnLoadRelation){return;}
              param.$vm.$nextTick(()=>{
                param.selfData.blnLoadRelation=true;
                param.$refs.relationCmp.load();
              });
              //param.selfData.submit();
            },
            //碰撞数据改变监听事件
            crashDataChange(data,otherData){
              // data = _.map([50010610009083,50010710000348,50010510000124,50010610009006,50010610009086,50010810000206,50010610009141],(val,i)=>{
              //   let start=(i*4)+1,end=((i+1)*4);
              //   start=start<10?'0'+start:start;
              //   end=end<10?'0'+end:end;

              //   return {title:'条件'+(i+1),stids:[val],val:['201705'+start,'201705'+end]}
              // })
    
              crashDataChangeCrashFunc(data,otherData);
            }
          }
        };


        return param;
      }());
    },
     //初始化滚动条
    initScroll(){
     this.scrollIns = new Sly($('.analysis .scrollContainer'),{
        speed:200,
        scrollBy:50,
        scrollBar:'.analysis .scrollbar',
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
<style lang="less">
    @import "../css/variables.less";
    //标签样式
    @label_H:130px;
    @label_header_H:30px;
    .analysis .label_info{height:@label_H;display:inline-block;background-color:@BgCol;}
    .analysis .label_info .header{height:@label_header_H;padding:0px 10px;line-height:@label_header_H;}  
    html{.TCol(~".analysis .label_info .header",'bg');}

    .analysis .label_info .header .title{font-size:14px;font-weight:600;color:@FrontCol;}
    .analysis .label_info .label_info_container{height:~"calc(100% - @{label_header_H} )";position: relative;}
    .analysis .label_info .label_info_container .complete{display:table-cell;vertical-align: middle;}

    html{.TCol(~".analysis .label_info .label_info_container .complete");}
    
    .analysis .label_info .label_info_container .analy{color:@FontCol;display:table-cell;vertical-align: middle;}

    .analysis .label_info .label_info_container .analy .num,
    .analysis .label_info .label_info_container .complete .num{font-size:20px;margin-left:15px;}
    .analysis .label_info .label_info_container .icon_container{position: absolute;right: 40px;font-size: 80px;top: 10px;}

    .analysis .label_info .label_info_container .analy_container,
    .analysis .label_info .label_info_container .complete_container{display: table;width: 100%;height:33.3%;padding:0px 10px;}

    @addBtnSize:30px;
    .analysis .label_info .label_info_container .addBtn{
        width:@addBtnSize;height:@addBtnSize;color:white;text-align:center;line-height:@addBtnSize;font-size:20px;
        position:absolute;bottom:0px;right:0px;cursor:pointer;
    }

    html{.TCol(~".analysis .label_info .label_info_container .addBtn",'bg');}

    //任务标签样式
    .analysis .label_info.task{width:~"calc(25% - 9px)";text-align: left;margin-right:12px;margin-bottom:10px;}
    .analysis .label_info.task:nth-child(4n){margin-right:0px;}
    .analysis .label_info.task .subject{margin-left:10px;font-size:12px;color:white;}
    .analysis .label_info.task .label_info_container{padding:10px;}
    .analysis .label_info.task .label_info_container .item{color:@FontCol;font-size:12px;line-height:26px;}
    .analysis .label_info.task .label_info_container .icon{position:absolute;font-size:60px;right:30px;bottom:20px;opacity:.2;}

    //新增任务弹窗
    .popAddTask {height:100%;}
    .popAddTask .title{float: left;line-height: 44px;width: 70px;text-align: center;}
    .popAddTask .input{margin-left: 70px;}
    .popAddTask .input .el-date-editor{width:400px !important;margin-top:10px;}
    .layui-layer-content{height:~"calc(100% - 42px)"}

    //过滤显示标签组建
    .highShow{-moz-box-shadow:2px 2px 5px #333333; -webkit-box-shadow:2px 2px 5px #333333; box-shadow:2px 2px 5px #333333;}
</style>

<style scoped lang="less">
  @import "../css/variables.less";
  @titleH:40px;
  .analysis{width:100%;height:100%;padding:5px;position:relative;}
  .analysis .page{background-color:@FrontCol;}
  .analysis .titleComp{height:@titleH;}
  .analysis .header{height:@titleH;line-height:@titleH;text-align:left;padding:0px 10px;.border('bottom');}
  .analysis .search_container{width:200px;display:inline-block;margin-left:20px;}

  .analysis .analysis_container{text-align:left;padding:10px;width: 100%;}
  .analysis .analysis_container .item{display:inline-block;width:~"calc(25% - 9px)";text-align: left;margin-right:12px;}
  .analysis .analysis_container .item:nth-child(4n){margin-right:0px;}
  //height:~"calc(100% - @{titleH} - @{titleH} - 200px)";
  .analysis .task_container{height:~"calc(100% - @{titleH} - @{titleH} - 200px)";padding:0px 10px;text-align:left;position:relative;}

  //滚动条样式
  .scrollContainer{width:100%;height:100%;position: relative;}
  .scrollbar:hover {cursor:pointer;}
  .scrollbar { border:1px solid @borderCol;border-radius:5px;width: 10px; height: ~"calc(100% - @{titleH} - 20px)"; position: absolute;right: 5px;top:10px;background:white;margin-top:10px;}
  .scrollbar .handle {width: 100%;height: 100px;}

  html{.TCol(~".scrollbar .handle",'bg');}

  //列表显示样式
  @header_H:40px;
  @gainCol:#019cdc;
  @collectCol:#85c226;
  @resultCol:#f8c301;
  .analysis .table_header{height:@header_H;display:table;width:100%;border:none;border-collapse: collapse;}
  .analysis .table_header .item{display:table-cell;text-align:center;}
  .analysis .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;.border('bottom');}
  .analysis .table_header .item .progress_bar{height:@header_H/2;margin-top:@header_H/4;margin-left:10%;margin-right:10%;}
  .analysis .table_header .item .progress_bar .gain{width:33.3%;background-color: @gainCol;height:100%;display:inline-block;}
  .analysis .table_header .item .progress_bar .collect{width:33.3%;background-color: @collectCol;height:100%;display:inline-block;}
  .analysis .table_header .item .progress_bar .result{width:33.3%;background-color: @resultCol;height:100%;display:inline-block;}
  .analysis .table_header .item .sort_item .triangle-up:hover{cursor:pointer;}
  html{.TCol(~".analysis .table_header .item .sort_item .triangle-up:hover",'bbc');}

  .analysis .table_header .item .sort_item .triangle-down:hover{cursor:pointer;}
  html{.TCol(~".analysis .table_header .item .sort_item .triangle-down:hover",'btc');}

  //.analysis .table_header .item .sort_item .triangle-up.active{border-bottom-color:@Font_Hover_Col;}
  html{.TCol(~".analysis .table_header .item .sort_item .triangle-up.active",'bbc');}
  //.analysis .table_header .item .sort_item .triangle-down.active{border-top-color:@Font_Hover_Col;}
  html{.TCol(~".analysis .table_header .item .sort_item .triangle-down.active",'btc');}
   
  .analysis .tipInfo{font-size:12px;float:right;margin-right:10px;margin-top:10px; line-height:15px;}
  .analysis .tipInfo .color.gain{height:15px;width:15px;float:left;margin-right:5px;background-color:@gainCol;}
  .analysis .tipInfo .color.collect{height:15px;width:15px;float:left;margin-right:5px;background-color:@collectCol;}
  .analysis .tipInfo .color.result{height:15px;width:15px;float:left;margin-right:5px;background-color:@resultCol;}
  .analysis .tipInfo .content{display:table-cell;}

  //标签按钮样式
  .labelBtn{float:right;height:100%;padding:0px 10px;font-size:12px;}
  .labelBtn i{margin-right:5px;}
  .labelBtn:hover{cursor:pointer;border-bottom: 2px solid;};

  //进度条样式
  .gray{background-color:gray;display:inline-block;width:33.3%;height: 100%;}

  .tag_label:hover{color:@btn_Bg_Col_hover_1;}

  .page_container{.border('top');}

  .triangle-up {
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 5px solid black;
  }

  .triangle-down {
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid black;
 }
</style>
