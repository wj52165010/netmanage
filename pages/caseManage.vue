<!-- 案件管理页面组件 -->
<template>
    <div class="CaseManage">
        <div class="CaseManage_container">
            <!--加载中标识-->
            <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;">
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
                        <el-date-picker v-model="query.time" type="daterange" placeholder="选择日期范围" style="width: 220px"></el-date-picker>
                    </div>
                </div>

                <div class="item" >
                    <el-button type="primary" @click="query_click()"><i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i><span v-show="!blnSearch">搜索</span></el-button>
                </div>

                <div style="float:right;margin-top:10px;">
                    <span class="tag_label" style="margin-left:10px;cursor:pointer;" @click="addCase()">
                        <i class="fa fa-plus" style="margin-right:5px;"></i>新增
                    </span>
                </div>
            </div>
            <ul class="header">
                <li class="item">
                    <span style="width:80px; cursor:pointer;" @mousedown.stop="blnShowStatus=true">
                        <div class="title_content">
                            案件状态 <i class="fa fa-caret-down"></i>
                            <div class="dropDown" v-show="blnShowStatus"><div v-for="d in status" @mousedown.stop="status_click(d)">{{d.name}}</div></div>
                        </div>
                    </span>
                    <span style="width:120px;">案件名称</span>
                    <span>案发地点</span>
                    <span style="width:130px;">案发时间</span>
                    <span style="width:100px;">创建人</span>
                    <span style="width:130px;">创建时间</span>
                    <span style="width:120px;" class="sep option">操作</span>
                    <span class="count_item">身份分析</span>
                    <span class="count_item">碰撞分析</span>
                    <span class="count_item">行为分析</span>
                    <span class="count_item">同行分析</span>
                </li>
            </ul>
            <div class="content">
                <Scroll :listen="data">
                    <ul class="body">
                        <li v-for="d in data" class="item">
                            <span style="width:80px;">{{d.status}}</span>
                            <span style="width:120px;">{{d.name}}</span>
                            <span>{{d.address}}</span>
                            <span style="width:130px;">{{d.caseTime}}</span>
                            <span style="width:100px;">{{d.user}}</span>
                            <span style="width:130px;">{{d.createTime}}</span>
                            <span style="width:120px;" class="sep option"><span @click="detail(d)">详细</span><span @click="addCase(d)">修改</span><span>删除</span></span>
                            <span class="count_item" @click="countClick(getTaskType('关联分析'))">{{d.idenNumber}}</span>
                            <span class="count_item" @click="countClick(getTaskType('碰撞分析'))">{{d.crashNumber}}</span>
                            <span class="count_item" @click="countClick(getTaskType('行为分析'))">{{d.actionNumber}}</span>
                            <span class="count_item" @click="countClick(getTaskType('同行分析'))">{{d.tradeNumber}}</span>
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
import TaskType from '../enum/TaskType'
export default {
  name: 'CaseManage',
  components:{Scroll},
  data () {
    return {
        blnLoading:false,
        taskType:TaskType,
        pageNum:0,
        status:[{name:'所有',val:-1},{name:'完成',val:'1'},{name:'执行中',val:0}],
        curStatus:{name:'所有',val:-1},
        blnShowStatus:false,
        bodyClickId:-1,
        blnSearch:false,
        query:{name:'',time:''},
        data:[
            {
                status:'完成',
                name:'xxx手机盗窃',
                address:'重庆市xxx',
                caseTime:'2017-01-01 12:12',
                user:'智多产品部',
                createTime:'2017-01-01 12:12',
                idenNumber:1,
                crashNumber:1,
                actionNumber:1,
                tradeNumber:1,
                deployNumber:1
            }
        ]
    }
  },
  mounted(){
    this.bodyClickId=tool.SingleBind('mousedown',$('body'),()=>{
       this.blnShowStatus=false;
    })
  },
  destroyed(){
    tool.ClearBind(this.bodyClickId)
  },
  methods:{
      //刷新页面
      refreshPage(){
          this.loadData();
      },
      //加载数据
      loadData(){
          this.blnLoading=true;
          this.blnLoading=false;
      },
      getTaskType(id){
        return _.find(this.taskType,t=>{return  t.id==id});
      },
      pageChange(){

      },
      status_click(d){
          this.blnShowStatus=false;
          this.curStatus=d;
      },
      query_click(){
          this.blnSearch=true;
      },
      countClick(type){
        switch(type.id){
            case '同行分析':
                console.log('同行分析');
                break;
            case '关联分析':
                console.log('关联分析');
                break;
            case '碰撞分析':
                console.log('碰撞分析');
                break;
            case '行为分析':
                console.log('行为分析');
                break;
        }

        let tags=_.map(TaskType,t=>{ 
                return `<div class="tag_item">
                            <div style="display:table;height:100%;width:100%;">
                                <div style="display:table-cell;vertical-align: middle;">
                                    <i class="${t.icon}"></i>
                                    <div>${t.name}</div>
                                </div>
                            </div>
                            <div class="triangle-left"></div>
                        </div>`
            }).join('');
        let html=`
                 <div class="tag" style="width:100px;height:100%;position:absolute;left:0px;top:0px;">
                    ${tags}
                 </div>

                 <div style="margin-left:100px;margin-right:0px; height:100%;">
                 
                 </div>
                `;
        tool.open(function(){
            let param={
                title:'分析任务',
                area:['600px','300px'],
                content:`<div class="caseManagePopCount" style="position:relative;width:100%;height:100%;overflow-y:auto;font-size:12px;">${html}</div>`,
                components:{cInput},
                context:{

                }
            };
            return param;
        }());
      },
      detail(d){
        tool.open(function(){
            let html=`
                    <div class="row" style="margin:0px;">
                        <div style="display:inline-block;width:50%;line-height:25px;">
                            <span>案件名称<span style="margin-right:5px;">:</span>
                            <span>${d.name}</span>
                        </div><div style="display:inline-block;width:50%;line-height:25px;">
                            <span>案发时间<span style="margin-right:5px;">:</span>
                            <span>${d.caseTime}</span>
                        </div><div style="display:inline-block;width:50%;line-height:25px;">
                            <span>案发地点<span style="margin-right:5px;">:</span>
                            <span>${d.address}</span>
                        </div><div style="display:inline-block;width:100%;">
                            <div style="float:left;">线索信息:</div>
                            <div style="margin-left:60px;margin-right:0px;max-height;100px;">${d.clue || ''}</div>
                        </div><div style="display:inline-block;width:100%;">
                             <div style="float:left;">备注信息:</div>
                            <div style="margin-left:60px;margin-right:0px;max-height;100px;">${d.remarke || ''}</div>
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
        let html=`
                <cInput label="案件名称" @change="nameChange" :val="name" />
                <cInput label="案发时间" @change="timeChange" :val="time" />
                <cInput label="案发地点" @change="addressChange" :val="address" />
                <div style="color:#bdbdbd;line-height: 30px;padding-left: 5px;">线索信息</div>
                <textarea rows="3" v-model="clue" style="width: 100%;resize:none;"></textarea>
                <div style="color:#bdbdbd;line-height: 30px;padding-left: 5px;">备注</div>
                <textarea rows="3" v-model="remarke" style="width: 100%;resize:none;"></textarea>
                <div style="margin-top:10px; text-align:right;">
                    <button type="button" class="btn btn-success" style="font-size:12px;"  @click="submit">确定</button> 
                    <button type="button" class="btn btn-default" style="font-size:12px;" @click="cancel">取消</button>
                </div>
            `;
        tool.open(function(){
            let param={
                title:d?'修改':'新增',
                area:'400px',
                content:`<div class="caseManagePop" style="width:100%;height:100%;overflow-y:auto;padding:10px;">${html}</div>`,
                components:{cInput},
                context:{
                    name:d?d.name ||'':'',//案件名称
                    time:d?d.time ||'':'',//案发时间
                    address:d?d.address ||'':'',//案发地点
                    clue:d?d.clue ||'':'',//线索信息
                    remarke:d?d.remarke ||'':'',//备注
                    nameChange(val){param.selfData.val=val;},
                    timeChange(val){param.selfData.val=val;},
                    addressChange(val){param.selfData.val=val;},
                    submit(){
                        param.close();
                    },
                    cancel(){
                        param.close();
                    }
                }
            };

        return param;
        }());     
      }
  }
}
</script>
<style lang="less">
  @import "../css/variables.less";

 .caseManagePopCount .tag_item{width:100%;height:25%;.border('right');text-align:center;position:relative;}
 .caseManagePopCount .tag_item:hover{cursor:pointer;background-color:@Font_Hover_Col;color:white;}
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
</style>
<style scoped lang="less">
  @import "../css/variables.less";

  @rowH:50px;
  .CaseManage{width:100%;height:100%;overflow:hidden;padding:5px;}
  .CaseManage_container{width:100%;height:100%;}
  .CaseManage .body,
  .CaseManage .header{width: 100% !important;list-style: none;padding-left: 0px;padding: 0px;margin-bottom:0px;}
  .CaseManage .body .item,
  .CaseManage .header .item{line-height: @rowH;height: @rowH;text-align: left;margin: 0px;display: table;width: 100%;background-color: @Font_Hover_Col;color: white;}
  .CaseManage .body .item span,
  .CaseManage .header .item span{display: table-cell;.border('bottom');.border('right');padding: 0px 0px 0px 0px;vertical-align: middle;text-align:center;}
  
  .CaseManage .body .item{background-color:white;color:@HeaderBgCol;}

  .CaseManage .body .item .sep,
  .CaseManage .header .item .sep{border-right:2px solid @FontCol;}
  .CaseManage .body .item .option,
  .CaseManage .header .item .option{width:120px;background-color: inherit;}
  .CaseManage .body .item .count_item,
  .CaseManage .header .item .count_item{width:80px;}
  
  .CaseManage .body .item .option span{border:none;font-size:12px;display: initial;margin-right:5px;}
  .CaseManage .body .item .option span:hover{cursor:pointer;color:@Font_Hover_Col;}
  
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
  .CaseManage .header .item .dropDown div:hover{background-color:@Font_Hover_Col;color:white;cursor:pointer;}

  .CaseManage .header .item .title_content{position:relative;}
  
  .CaseManage .option{text-align: initial;padding:10px;}
  .CaseManage .option .item{display:inline-block;}
  .CaseManage .option .item .input{display:inline-block;}
  .CaseManage .tag_label:hover{color:@btn_Bg_Col_hover_1;}

  .CaseManage .body .item .count_item:hover{color:@Font_Hover_Col;cursor:pointer;}
</style>
