<!-- 关联任务组件 -->
<template>
    <div class="Relative_Anlay">
        <div class="tag" style="width:100px;height:100%;position:absolute;left:0px;top:0px;">
            <template v-for="t in TaskType">
                <div class="tag_item" :class="{'active':t.val==type}" @click="tag_item_click(t)">
                    <div style="display:table;height:100%;width:100%;">
                        <div style="display:table-cell;vertical-align: middle;">
                            <i :class="t.icon"></i>
                            <div>{{t.name}}</div>
                        </div>
                    </div>
                    <div class="triangle-left"></div>
                </div>
            </template>
        </div>

        <div style="margin-left:100px;margin-right:0px; height:100%;background-color:#ebedee;">
            <Scroll :listen="showData" :store="store">
                <div style="width:100%;" class="clearfix">
                    <div class="case_relative_item" v-for="d in showData" @click="itemClick(d)">
                        <div class="title_container">
                            <div class="title">{{d.law_case_name}}</div>
                        </div>
                    </div>
                </div>
            </Scroll>
        </div>
    </div>
</template>

<script>
import Scroll from 'components/scroll'
import cInput from 'components/Input'
import TaskType from '../../enum/TaskType'

export default {
  name: 'RelativeAnlay',
  props:['store','kind','data'],
  components:{Scroll},
  data () {
    return {
        TaskType:TaskType,
        type:'',
    }
  },
  computed:{
      showData(){
          return _.filter(this.data,d=>{
             return d.task_type==this.type;
          });

      }
  },
  mounted(){
      this.type=this.kind || this.TaskType[0].val;
  },
  methods:{
    tag_item_click(t){
        this.type=t.val;
    },
    itemClick(d){
      let self=this;
      let popW = $(window).width()*0.8;
      let popH = $(window).height()*0.8;
      
      //判断任务还没有结果的时候需要给予提示
      if(d.result_count=='0' && (d.task_status=='created' || d.task_status=='running')){
        tool.info('任务正在分析中还未产生结果,请稍候...');
        return;
      }

      tool.open((function(){
        let content='';
        switch(_.find(self.TaskType,t=>{return t.val==d.task_type}).id){
            case '同行分析':
                content=`<AnalysisDetailPage :store="store" :taskid="taskid" />`;
                break;
            case '关联分析':
                content=`<RelationPage ref="relationCmp" :store="store" :taskid="taskid" />`
                break;
            case '碰撞分析':
                content=`<CrashDetailPage :store="store" :taskid="taskid" />`
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
            context:{
                store:self.store,
                taskid:d.task_id,
            },
            pop_close(){
                if(!param.$refs.relationCmp)return;
                param.$refs.relationCmp.destroy();
            },
        };

        return param;
    })());
    }
  }
}
</script>

<style scoped lang="less">
    @import "../../css/variables.less";
    .Relative_Anlay{width:100%;height:100%;}
    .caseManagePopCount .tag_item{width:100%;height:25%;.border('right');text-align:center;position:relative;}
    .caseManagePopCount .tag_item.active,
    .caseManagePopCount .tag_item:hover{cursor:pointer;color:white;}

    html{.TCol(~".caseManagePopCount .tag_item:hover",'bg');}
    html{.TCol(~".caseManagePopCount .tag_item.active",'bg');}
    .caseManagePopCount .triangle-left {
            width: 0;
            height: 0;
            border-top: 10px solid transparent;
            border-right: 15px solid white;
            border-bottom: 10px solid transparent;
            position: absolute;
            right: 0px;
            top: 50%;
            margin-top: -10px;

    }

    .caseManagePopCount .tag_item.active .triangle-left{border-right: 15px solid #ebedee;}

    .caseManagePopCount .case_relative_item{
        width:121px;
        height:128px;
        float:left;
        margin:.5px;
        background-color:white;
        cursor:pointer;
    }

    .caseManagePopCount .case_relative_item .title_container{
        display: table;
        width: 80%;
        height: 100%;
        margin: auto;
    }
    .caseManagePopCount .case_relative_item .title_container .title{
        width: 100%;
        word-wrap: break-word;
        margin: auto;
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        word-break: break-all;
    }
</style>
