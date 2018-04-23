<!-- 操作日志页面组件 -->
<template>
    <div class="OperLog">
        <div class="OperLog_container">
            <!--加载中标识-->
            <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;">
                <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
            </div>
            <div class="option_bar">
                <div class="item">
                    <span>用户账户</span>
                    <el-input  placeholder="请输入账户" style="display:inline-block;" v-model="account_input"></el-input>
                </div>

                <div class="item">
                    <el-select style="width:150px;" v-model="result_type_input" :clearable="true" placeholder="请结果类型">
                        <el-option
                            v-for="val in ['成功','失败']"
                            :label="val"
                            :value="val">
                        </el-option>
                    </el-select>
                </div>

                <div class="item">
                    <el-button type="primary" @click="query_click()"><i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i><span v-show="!blnSearch">搜索</span></el-button>
                </div>
            </div>
            <div class="group_header">
                <div class="userId">用户ID</div>
                <div class="account">用户账号</div>
                <div class="time">操作时间</div>
                <div class="result">操作结果</div>
                <div class="model">操作模块</div>
                <div class="custom_model">自定义模块</div>
                <div class="note">说明</div>
            </div>
            <div class="group">
                <!--暂无数据-->
                <div v-if="data.length<=0" style="width:100%;height:100%;text-align:center;display:table;">
                    <div style="display:table-cell;vertical-align: middle;">暂无数据</div>
                </div>
                <div class="group_item" v-for="item in data">
                    <div class="userId">{{item.user_id}}</div>
                    <div class="account">{{item.account}}</div>
                    <div class="time">{{converTime(item.create_time)}}</div>
                    <div class="result">{{item.result_type}}</div>
                    <div class="model">{{item.operation_module}}</div>
                    <div class="custom_model" :title="item.CustomModule_Name">{{item.CustomModule_Name}}</div>
                    <div class="note" :title="item.note">{{item.note}}</div>
                </div>
            </div>
            <div name="page_container" class="page_container">
                <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageIndex+1}}</span></span>
                <div class="firstPage" @click="pageChange(0)">首页</div>
                <div class="prePage" @click="pageChange(pageIndex-1)">上一页</div>
                <div class="nextPage" @click="pageChange(pageIndex+1)">下一页</div>
            </div>
        </div>
    </div>
</template>

<script>
import {BODY_RESIZE,oper_log} from '../store/mutation-types'
export default {
  name: 'OperLog',
  data () {
    return {
      blnSearch:false,
      blnLoading:false,
      pageNum:15,
      pageIndex:0,
      data:[],
      account:'',//用户账户
      account_input:'',//用户已经输入的账户信息
      result_type:'',//成功/失败
      result_type_input:''//用户已经选择的结果类型信息
    }
  },
  mounted(){
      this.loadData();
  },
  methods:{
      //刷新页面
    refreshPage(){
        this.loadData();
    },
    loadData(){
        //获取操作日志数据
        this.blnLoading=true;
        this.$store.dispatch(oper_log,{limit:this.pageNum,skip:this.pageNum*this.pageIndex}).then(res=>{
            this.blnLoading=false;
            this.data=res.biz_body;
        });
    },
    //转化时间
    converTime(t){
        return tool.DateByTimestamp(t,'yyyy-MM-dd hh:mm:ss');
    },
    query_click(){
        this.account = this.account_input;
        this.result_type = this.result_type_input;
        this.blnLoading=true;
        this.pageIndex=0;
        this.$store.dispatch(oper_log,{
            limit:this.pageNum,
            skip:this.pageIndex*this.pageNum,
            account:this.account,
            result_type:this.result_type
        })
        .then(res=>{
            this.blnLoading=false;
            let data =res.biz_body;
            this.data=res.biz_body;
        });
    },
    pageChange(pageNum){
        this.blnLoading=true;
        this.pageIndex=pageNum>0? pageNum : 0;
        this.$store.dispatch(oper_log,{
            limit:this.pageNum,
            skip:this.pageIndex*this.pageNum,
            account:this.account,
            result_type:this.result_type
        })
        .then(res=>{
            this.blnLoading=false;
            let data =res.biz_body;
            if(data.length<=0){
                tool.msg({msg:{code:'successed'}},'已经到了最后页!','已经到了最后页!');
                this.pageIndex--;
                return;
            }
            this.data=res.biz_body;
        });
    }
  }
}
</script>

<style scoped lang="less">
  @import "../css/variables.less";
  @barH:40px;
  @headerH:40px;
  @group_item_min_H:40px;
  @groupH:~"calc(100% - @{barH} - @{headerH} - 40px)";
  @group_item_userId_W:100px;
  @group_item_account_W:150px;
  @group_item_time_W:220px;
  @group_item_result_W:100px;
  @group_item_model_W:150px;
  @group_item_custom_model_W:200px;

  .OperLog{width:100%;height:100%;text-align:left;padding:5px;}
  .OperLog .OperLog_container{background-color:@FrontCol;margin-bottom:0px;position:relative;width:100%;height:100%;}
  .group{height:@groupH;background-color:@FrontCol;overflow-y:auto;.border('bottom');}
  .group_header{height:@headerH;margin-top:0px;background-color:@FrontCol;line-height:@headerH;text-align:center;}
  .option_bar{
    height:@barH;
    background-color:@FrontCol;
    box-shadow: 0 0px 5px rgba(57, 70, 78, 0.2);
    z-index: 99;
    top: 0px;
    width: 100%;
    .border('bottom');
    padding: 0px 10px;
  }
  .option_bar .item{display:inline-block;margin-right:10px;}

.group_header,
.group .group_item{height:@group_item_min_H;.border('bottom');line-height:@group_item_min_H;cursor:pointer;.transLine();text-align: center;} 
.group .group_item:hover{background-color:@FontCol;color:white;}
.group_header .userId,
.group .group_item .userId{width:@group_item_userId_W;height:100%;float:left;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;}
.group_header .account,
.group .group_item .account{width:@group_item_account_W;height:100%;float:left;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;}
.group_header .time,
.group .group_item .time{width:@group_item_time_W;height:100%;float:left;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;}
.group_header .result,
.group .group_item .result{width:@group_item_result_W;height:100%;float:left;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;}
.group_header .model,
.group .group_item .model{width:@group_item_model_W;height:100%;float:left;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;}
.group_header .custom_model,
.group .group_item .custom_model{width:@group_item_custom_model_W;height:100%;float:left;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;}
.group_header .note,
.group .group_item .note{margin-left:
@group_item_userId_W+
@group_item_account_W+
@group_item_time_W+
@group_item_result_W+
@group_item_model_W+
@group_item_custom_model_W;

margin-right:0px;height:100%;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;}

</style>
