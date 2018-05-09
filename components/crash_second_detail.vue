<!-- 二次碰撞页面组件 -->
<template>
    <div class="CrashSecondDetail">
        <!--左边操作栏-->
        <div class="left_container">
            <CrashGroup :store="$store" :taskid="taskid" :conds="conds" @AddData="AddData" />
        </div>

        <div class="right_container">
          <Scroll ref="tagScroll" :listen="res" :store="store">
            <template v-for="(r,i) in res">
                <div class="tag_item" :class="{active:curTagIndex==i}" @click="tag_item(i)">
                    <span class="number">{{i+1}}.</span> 
                    <span class="option">
                        <span class="option_item" v-show="false">导出</span>
                        <span class="option_item" v-show="i>0" @click.stop="delSecondInfo(r)">删除</span>
                    </span>
                    <div class="content">{{r.name}}</div>
                </div>
                <div class="tag_item_content" :class="{fadeIn:curTagIndex==i}" style="min-height:50px;" :style="{height:'calc('+h+'px - '+res.length*33+'px)'}">
                    <tagItem :ref="'scroll'+i" :task="r" :store="store" />
                </div>
            </template>
          </Scroll>
        </div>
    </div>
</template>

<script>
import CrashGroup from 'components/crash_group'
import Scroll from 'components/Scroll'

import {GetAnalyTask,GetAnalyTaskData,delSecondCrash} from '../store/mutation-types'
export default {
  name: 'CrashSecondDetail',
  props:['store','taskid'],
  components:{
    CrashGroup,
    Scroll,
    tagItem:{
          props:['task','store'],
          components:{Scroll},
          template:`<div style="height:100%;width:100%;">
                        <div style="height:calc(100% - 41px)">
                            <div v-if="data.length<=0" style="position: absolute;width: 100%;top: 50%;text-align:center;">暂无数据</div>
                            <Scroll ref="scroll" :listen="data" :store="store" v-show="data.length>0">
                                <div v-for="d in data" class="analy_detail_tag_item" style="font-size:12px;">
                                    <div class="row" style="line-height:30px;margin-left:0px;margin-right:0px;">
                                        <div class="col-md-6" style="padding: 0px 5px;"><span style="margin-right:5px;">姓名:</span>{{d.customer_name}}</div>
                                        <div class="col-md-6" style="padding: 0px 5px;"><span style="margin-right:5px;">场所编码:</span>{{d.netbar_wacode}}</div>
                                    </div>
                                    <div class="row" style="line-height:30px;margin-left:0px;margin-right:0px;">
                                        <div class="col-md-6" style="padding: 0px 5px;"><span style="margin-right:5px;">证件号:</span>{{d.key}}</div>
                                        <div class="col-md-6" style="padding: 0px 5px;"><span style="margin-right:5px;">证件类型:</span>{{d.certificate_type}}</div>
                                    </div>
                                    <div class="row" style="line-height:30px;margin-left:0px;margin-right:0px;">
                                        <div class="col-md-6" style="padding: 0px 5px;"><span style="margin-right:5px;">开始时间:</span>{{converTime(d.start_time)}}</div>
                                        <div class="col-md-6" style="padding: 0px 5px;"><span style="margin-right:5px;">结束时间:</span>{{converTime(d.end_time)}}</div>
                                    </div>
                                </div>
                            </Scroll>
                        </div>
                        <div class="page_container" style="border-top:1px solid #e7eaec;">
                            <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageNum+1}}</span></span>
                            <div class="firstPage" @click="pageChange(0)">首页</div>
                            <div class="prePage" @click="pageChange(pageNum-1)">上一页</div>
                            <div class="nextPage" @click="pageChange(pageNum+1)">下一页</div>
                        </div>    
                    </div>`,
            data(){
                return {
                    pageNum:0,
                    limit:10,
                    data:[]
                };
            },
            mounted(){
                this.$store=this.$store || this.store;
                //加载数据
                this.loadData();
            },
            methods:{
                //转化时间戳
                converTime(val){
                    return tool.DateByTimestamp(val,'yyyy-MM-dd hh:mm:ss');
                },
                //重新加载滚动条
                reloadScroll(){
                    this.$refs.scroll.reloadyScroll();
                },
                pageChange(pageNum){
                    this.pageNum=pageNum>0? pageNum : 0;
                    this.loadData(true);
                },
                //加载数据
                loadData(blnTip){
                    this.$store.dispatch(GetAnalyTaskData,{
                        id:this.task.taskid,
                        limit:this.limit,
                        skip:this.limit * this.pageNum,
                        conds:this.task.sid?[this.task.sid]:[]}).then(res=>{

                            if(res.msg.code!='successed')return;
                            let data=res.biz_body.data;
                            if(data.length<=0){
                                if(blnTip)tool.msg({msg:{code:'successed'}},'已经到了最后页!','已经到了最后页!');
                                this.pageNum=(this.pageNum-1)<0?0:(this.pageNum-1);
                                return;
                            }

                            this.data=data;
                        });
                }
            }
    }
  },
  data () {
    return {
      //taskid:1695511,
      curTagIndex:-1,
      resIndex:0,//起始结果索引
      h:0,//页面高度
      conds:[],
      res:[],
      groupType:{join:'交集',union:'并集',except:'差集'}
    }
  },
  mounted(){
    this.h=$(this.$el).height();
  
    this.$store=this.store || this.$store;

    // this.res.unshift({
    //                   taskid:this.taskid,
    //                   name:`原始数据集碰撞结果集`,
    //                   sourceids:[]
    //               });

    //获取任务相关信息
    this.getTaskData();
  },
  methods:{
    //转化条件对象
    converConds(conds){
      _.each(conds,c=>{
        if(c.data_source_ids && c.data_source_ids.length>0){
          this.resIndex++;
          c.title="结果"+this.resIndex+'('+this.groupType[c.type]+')'
        }
      });

      return conds;
    },
    //获取任务相关信息
    getTaskData(){
      let self=this;
      this.$store.dispatch(GetAnalyTask,{id:this.taskid}).then(res=>{
        if(!tool.msg(res,'','获取任务数据失败!')) return;
          let conds=this.converConds(res.biz_body[0].task_conditions.values);
         
          this.conds=conds;
          this.conds.map(function(i) {
                self.res.push({
                    taskid:self.taskid,
                    name:i.title,
                    sourceids:i.data_source_ids,
                    sid:i.id
                });

          });

          console.log(res);
      });
    },
    AddData(data){
      let self=this;
      let conds=this.converConds(data);
      this.conds=this.conds.concat(conds);
      conds.map(function(i) {
            self.res.push({
                taskid:self.taskid,
                name:i.title,
                sourceids:i.data_source_ids,
                sid:i.id
            });

      });

    },
    //删除二次碰撞信息
    delSecondInfo(d){
      tool.confirm('您确定要删除该条信息吗?',['确定','取消'],()=>{
          this.$store.dispatch(delSecondCrash,{taskid:d.taskid,id:d.sid}).then(res=>{
              if(!tool.msg(res,'删除成功!'))return;
              this.res=_.filter(this.res,r=>r.sid!=d.sid);
          });
      },function(){});
    },
    tag_item(i){
      if(this.curTagIndex==i){
          this.curTagIndex=-1;
      }else{
          this.curTagIndex=i;
      }

      this.$nextTick(()=>{
          this.$refs.tagScroll.reloadyScroll();
          this.$refs['scroll'+i][0].reloadScroll();
      })
    },
  }
}
</script>

<style lang="less">
    @import "../css/variables.less";
    .analy_detail_tag_item{padding:5px 0px; width:100%;.border('bottom');}
</style>
<style scoped lang="less">
@import "../css/variables.less";
.CrashSecondDetail{width:100%;height:100%;background-color:white;}
@leftW:340px;
.CrashSecondDetail .left_container{width:@leftW;height:100%;border-right:2px solid @borderCol;float:left;}
.CrashSecondDetail .right_container{margin-left:@leftW;height:100%;}


.CrashSecondDetail .tag_item{
      line-height:30px;.border('bottom');color:white;text-align:left;padding:0px 20px 0px 10px;
      cursor:pointer;.border('');border-radius:5px;
  }
html{.TCol(~".CrashSecondDetail .tag_item",'bg');}

.CrashSecondDetail .tag_item .number{font-style:italic;font-weight:600;float:left;}
.CrashSecondDetail .tag_item .option{float:right;display:none;}
.CrashSecondDetail .tag_item:hover .option{display:block;}
.CrashSecondDetail .tag_item .content{margin-left:20px;margin-right:40px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
.CrashSecondDetail .tag_item_content {width:100%;display:none;}
.CrashSecondDetail .tag_item.active + .tag_item_content{display:block;}
</style>
