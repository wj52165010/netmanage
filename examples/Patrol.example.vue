<!-- 巡查列表组件 -->
<template>
    <div class="PatrolList">
        <!--加载中-->
        <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index: 100;">
          <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
        </div>

        <!--左边侧边框-->
        <div class="left_pop bound" :class="{active:blnShowHistoryPop}">
          <!--显示标签-->
          <div class="pop_lable" @click="blnShowHistoryPop=!blnShowHistoryPop">
            巡查任务
          </div>
          <div class="title_bar">
            <div class="item_bar" @click="addTaskRule(0)"><i class="fa fa-cog" />定期巡检</div>
            <div class="item_bar" @click="addTaskRule(1)"><i class="fa fa-plus-circle" />巡查任务</div>
          </div>
          <div class="content_bar">
            <Scroll ref="historyPopScroll" :listen="tasks">
                <div v-for="(h,i) in tasks" class="item" :class="{active:curPolicy_id==h.policy_id}"  @click="lookTask(h);" style="position:relative;">
                    <div class="content_title">{{h.title}}</div>
                    <div class="content_row">
                        <div class="column">执行日期:{{converTime(h.log_time,'yyyy-MM-dd')}}</div>
                        <div class="column">执行进度:{{h.progress}}</div>
                    </div>
                    <div class="content_row">
                        <div class="column">任务类型:{{h.policy_type=='signle'?'巡查任务':'定期巡检'}}</div>
                        <div class="column">任务状态:{{h.status=='running'?'进行中':'停止'}}</div>
                    </div>
                    <div class="opiton_bar">
                        <el-tooltip placement="top" content="删除">
                            <i class="fa fa-remove" @click.stop="removeTask(h,i)" />
                        </el-tooltip>
                        <el-tooltip placement="top" content="启动" v-if="h.status!='running'">
                            <i class="fa fa-play-circle-o" @click.stop="startTask(h)" />
                        </el-tooltip>
                        <el-tooltip placement="top" content="停止" v-if="h.status=='running'">
                            <i class="fa fa-dot-circle-o" @click.stop="stopTask(h)" />
                        </el-tooltip>
                        <el-tooltip placement="top" content="导出">
                            <i class="fa fa fa-download" @click.stop="exportTask(h)" />
                        </el-tooltip>
                    </div>
                </div>
            </Scroll>
          </div>
        </div>

        <!--操作栏-->
        <div class="option">
          <div class="item">
            <span>场所范围:</span><div style="display:inline-block;"><PlaceSearch  c_searchKind="1"  @place_res="placechange"></PlaceSearch></div>
          </div>
          <div class="item">
            <span>区域范围:</span><div style="display:inline-block;"><PlaceSearch  c_searchKind="0"  @place_res="areachange"></PlaceSearch></div>
          </div>
          <div class="item">
            <span>巡查人员:</span><div style="display:inline-block;"><el-input placeholder="巡查人员" v-model="partrolUser"></el-input></div>
          </div>
          <div class="item">
            <span>巡查结果:</span><div style="display:inline-block;">
              <el-select style="width:100px;" v-model="partrolRes" :clearable="true" placeholder="请选择">
                  <el-option
                      v-for="item in [{name:'合格',val:'1'},{name:'不合格',val:'0'}]"
                      :label="item.name"
                      :value="item.val">
                  </el-option>
              </el-select>
            </div>
          </div>

          <div class="item">
            <el-button type="primary" @click="search()"><i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i><span v-show="!blnSearch">搜索</span></el-button>
          </div>
        </div>
        <!--表头-->
        <div class="table_header">
            <div class="row">
                <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">场所编码</span></div>
                <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">场所名称</span></div>
                <div class="column"><span class="overflow" :style="{width:column_w+'px'}">场所地址</span></div>
                <div class="column" style="width:200px;"><span class="overflow" style="width:200px;">最近巡检日期</span></div>
                <div class="column" style="width:80px;"><span class="overflow" style="width:80px;">已检次数</span></div>
                <div class="column" style="width:80px;"><span class="overflow" style="width:80px;">检查项</span></div>
                <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">巡检人员</span></div>
                <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">巡检结果</span></div>
            </div>
        </div>
        <div :style="{height:bodyH}">
            <!--暂无数据-->
            <div v-if="data.length<=0" style="width:100%;height:100%;text-align:center;display:table;">
                <div style="display:table-cell;vertical-align: middle;">暂无数据</div>
            </div>

            <Scroll :listen="data" ref="scroll">
              <div class="table_body">
                <div class="table_conatienr">
                    <template v-for="d in data">
                    <div class="row">
                        <div class="column" :title="d.netbar_wacode" style="width:150px;" @click.stop="searchSiteDetail(d.netbar_wacode,d.microprobe_type)"><span class="overflow bold" style="width:150px;">{{d.netbar_wacode}}</span></div>
                        <div class="column" :title="d.netbar_name" style="width:150px;"><span class="overflow" style="width:150px;">{{d.netbar_name}}</span></div>
                        <div class="column" :title="d.netbar_address"><span class="overflow" :style="{width:column_w+'px'}">{{d.netbar_address}}</span></div>
                        <div class="column" style="width:200px;"><span class="overflow" style="width:200px;">{{converTime(d.log_time)}}</span></div>
                        <div class="column" style="width:80px;"><span class="overflow" style="width:80px;">{{d.postNum}}</span></div>
                        <div class="column" style="width:80px;" @click.stop="lookDeail(d)"><span class="overflow bold" style="width:80px;">{{d.itemNum}}</span></div>
                        <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">{{d.user_name}}</span></div>
                        <div class="column" style="width:100px;" @click.stop="lookRes(d)"><span class="overflow bold" style="width:100px;">{{d.is_pass=='1'?'合格':'不合格'}}</span></div>
                    </div>
                    </template>
                </div>
              </div>
            </Scroll>
        </div>

        <div name="page_container" class="page_container" style="background-color:white;">
          <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageIndex+1}}</span></span>
          <div class="firstPage" @click="pageChange(0)">首页</div>
          <div class="prePage" @click="pageChange(pageIndex-1)">上一页</div>
          <div class="nextPage" @click="pageChange(pageIndex+1)">下一页</div>          
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import Scroll from 'components/scroll'
import PlaceSearch from 'components/PlaceSearch'
import PlaceTree from 'components/PlaceTreeNew'

import {BODY_RESIZE,GetSitePatrol,GetPatrolItems,HistoryPolicy,HistoryPlicyItem,GetSitePolicyList,StartPatrol,
        DetailPolicy,DetailPlaceInfo,DetailPlacePolicy,SiteDetail,AddPlacePolicy,StopPatrol,DelPatrol,ExportPatrol} from '../store/mutation-types'
export default {
  name: 'PatrolList',
  components:{
    PlaceSearch,
    Scroll
  },
  data () {
    return {
      bodyResizeSub:null,
      blnShowHistoryPop:false,
      blnLoading:false,
      curPolicy_id:'',//当前显示的策略id
      pageIndex:0,
      column_w:0,
      bodyH:0,
      blnSearch:false,
      data:[],
      partrolUser:'',//巡查人员
      partrolRes:'',//巡查结果
      places:[],//场所范围
      regins:[],//区域范围
      tasks:[],
      policyItems:[],//巡查项集合
    }
  },
  mounted(){
    this.column_w=$(this.$el).width()-930;
    setTimeout(()=>{
      this.bodyH=`calc(100% - 100px - ${$(this.$el).find('.option').height()}px)`;

      this.$nextTick(()=>{this.$refs.scroll.reloadyScroll()})
    },100);
    
    this.$store.commit(BODY_RESIZE,{cb:(sub)=>{
       this.bodyResizeSub=sub
    },sub:()=>{
      this.column_w=$(this.$el).width()-930;

      this.bodyH=`calc(100% - 100px - ${$(this.$el).find('.option').height()}px)`;
    }});

    this.loadData();
  },
  methods:{
    //刷新页面
    refreshPage(){
      this.loadData();
    },
    //加载数据
    loadData(){
      //获取历史记录信息
      this.getListData();
      //获取策略检查项
      this.$store.dispatch(GetPatrolItems).then(res=>{
        this.policyItems=res.biz_body;
      });

      //获取策略列表信息
      this.$store.dispatch(GetSitePolicyList).then(res=>{
        this.tasks=res.biz_body;

      });
    },
    //添加巡检任务规则
    //type:任务类型(0:定期巡检,1:巡检任务)
    addTaskRule(type){
        let s=this;
        tool.open(function(){
            let html=`
                <div class="row" style="margin-bottom:10px;">
                    <div class="col-md-2" style="padding-top:10px;padding-left:25px;">任务名称</div>
                    <div class="col-md-5" style="padding-left:0px;"><el-input v-model="title" placeholder="请输入"></el-input></div>
                </div>

                <div class="row" style="margin-bottom:10px;" v-if="type==0">
                    <div class="col-md-2" style="padding-top:10px;padding-left:25px;">巡查周期</div>
                    <div class="col-md-5" style="padding-left:0px;">
                        <el-select style="width:100%;" v-model="cycType" :clearable="true" placeholder="请选择">
                            <el-option
                                v-for="item in [{name:'每月',val:'month'},{name:'每周',val:'week'},{name:'每日',val:'day'}]"
                                :label="item.name"
                                :value="item.val">
                            </el-option>
                        </el-select>
                    </div>
                </div>

                <div class="row" style="margin-bottom:10px;" v-if="type==1">
                    <div class="col-md-2" style="padding-top:10px;padding-left:25px;">巡查时间</div>
                    <div class="col-md-5" style="padding-left:0px;">
                        <el-date-picker  type="datetimerange" v-model="timeRange" placeholder="选择日期范围" :picker-options="simpleTime" :format="'yyyy-MM-dd'"  style="width: 100%;"></el-date-picker>
                    </div>
                </div>

                <div class="row" style="margin-bottom:10px;">
                    <div class="col-md-2" style="padding-top:10px;padding-left:25px;">巡查场所</div>
                    <div class="col-md-4" style="height:200px;border:1px solid #e7eaec;border-radius:5px;padding-right:0px;">
                        <PlaceTree ref="placeTree" @res="PlaceResult"></PlaceTree>
                    </div>
                    <div class="col-md-1"></div>
                    <div class="col-md-4"  style="height:200px;border:1px solid #e7eaec;border-radius:5px;padding-top:10px;padding-bottom:10px;padding-right:0px;">
                        <Scroll :listen="selPlaces">
                            <div v-for="(p,i) in selPlaces" style="margin-bottom:5px;padding-right:40px;position:relative;padding-left:20px;">
                                <span style="font-size:12px;position:absolute;left:0px;top:3px;">{{i+1}}.</span>{{p.name}} 
                                <i @click="delPlace(p)" class="fa fa-remove delPlaceItem" style="position:absolute;right:20px;top:3px;"></i>
                            </div>
                        </Scroll>
                    </div>
                </div>
                <div class="row" style="margin-bottom:10px;">
                    <div class="col-md-2" style="padding-top:10px;padding-left:25px;">巡查项目</div>
                    <div class="col-md-9" style="height:200px;border:1px solid #e7eaec;border-radius:5px;padding:10px;padding-right:0px;">
                        <Scroll :listen="projects">
                            <div v-for="p in projects" style="margin-bottom:10px;padding-left:35px;position:relative;padding-right:15px;">
                                <span  :class="{
                                        checkIcon_tree:selProjects.indexOf(p.policy_item_id)>=0,
                                        uncheckIcon_tree:selProjects.indexOf(p.policy_item_id)<0
                                        }" @click="toggleProject(p)" style="position:absolute;left:0px;top:0px;"></span>{{p.title}}
                            </div>
                        </Scroll>
                    </div>
                </div>

                <div class="option_bar" style="text-align:center;">
                    <button type="button" class="btn btn-success" :disabled="blnSubmit || blnExecute" @click="ok_btn()">确定</button>
                    <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
                </div>

            `;
            let param={
                title:type?'巡检任务':'定期巡检',
                area:'800px',
                content:`<div class="patrol_pop" style="padding:10px;">${html}</div>`,
                components:{PlaceTree,Scroll},
                store:s.$store,
                computed:{
                    blnSubmit(){
                        
                        return this.type?!(this.title && this.timeRange.length>0 && this.selProjects.length>0 && this.selPlaces.length>0):
                                         !(this.title && this.cycType && this.selProjects.length>0 && this.selPlaces.length>0);
                    }
                },
                context:{
                  blnExecute:false,
                  simpleTime:{//限制选择今天之前的日期
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                  },
                  type:type,
                  projects:s.policyItems,
                  title:'',
                  cycType:'',
                  timeRange:[],//时间范围
                  selProjects:[],//已选择的检查项
                  selPlaces:[],//选择的场所区域
                  //场所区域选择改变事件
                  PlaceResult(d){
                    let res =  _.chain(d).values().flatten().value();
                    param.selfData.selPlaces=res;
                  },
                  //切换巡查项选中情况
                  toggleProject(d){
                    let pros=param.selfData.selProjects,
                        index=pros.indexOf(d.policy_item_id);
                    if(index>=0){
                        pros.splice(index,1);
                    }else{
                        pros.push(d.policy_item_id);
                    }
                  },
                  //删除选中的场所节点
                  delPlace(d){
                    param.$refs.placeTree.checkOut(d.code);
                  },
                  ok_btn(){
                    let d=param.selfData;
                    if(d.blnExecute) return;

                    let res={
                        title:d.title,
                        policy_type:type?'signle':'cycle',
                        note:'',
                        locus_ids:_.map(d.selPlaces,p=>p.code).join(','),
                        policy_item_ids:d.selProjects.join(','),
                        start_time:type?tool.Timestamp(d.timeRange[0]):'',
                        end_time:type?tool.Timestamp(d.timeRange[1]):'',
                        type:type?'':d.cycType,
                    }

                    d.blnExecute=true;
                    s.$store.dispatch(AddPlacePolicy,res).then(res=>{
                        d.blnExecute=false;
                        if(!tool.msg(res,'添加成功!','添加失败!')) return;
                        s.tasks.push(res.biz_body);
                        param.close();
                    });
                    
                  },
                  cancel_btn(){
                    param.close();
                  }
                }
            };

            return param;
        }());
    },
    //查看任务
    lookTask(d){
        this.curPolicy_id=d.policy_id;
        this.pageIndex=0;
        this.getListData();
    },
    //删除任务
    removeTask(d,i){
        tool.confirm('一旦删除巡检结果,将无法恢复,请确认是否需要删除!',['确定','取消'],()=>{
            this.$store.dispatch(DelPatrol,d.policy_id).then(res=>{
                if(!tool.msg(res,'操作成功!','操作失败!')) return;
                this.tasks.splice(i,1);
            
                this.lookTask(this.tasks[0] || {policy_id:''});
                
            })
    
        },function(){});
    },
    //启动任务
    startTask(d){
        tool.confirm('您确定要开启该定时巡查任务!',['确定','取消'],()=>{
            this.$store.dispatch(StartPatrol,d.policy_id).then(res=>{
                if(!tool.msg(res,'操作成功!','操作失败!')) return;
                d.status='running';
            })
        });
    },
    //停止任务
    stopTask(d){
        tool.confirm('您确定要停止该定时巡查任务!',['确定','取消'],()=>{
            this.$store.dispatch(StopPatrol,d.policy_id).then(res=>{
                if(!tool.msg(res,'操作成功!','操作失败!')) return;
                d.status='stop';
            })
    
        },function(){});
    },
    //导出任务
    exportTask(d){
        this.$store.dispatch(ExportPatrol,d.policy_id).then(res=>{
            if(!tool.msg(res,'操作成功!','操作失败!')) return;
            window.location=res.biz_body.url;
        })
    },
    //搜索
    search(){
      //获取历史记录信息
      this.blnSearch=true;
      this.getListData();
    },
    //分页
    pageChange(index){
      this.getListData(index);
    },
    //获取列表数据
    getListData(index){
       if(index!=undefined && index<0){
         index=0;
       }

      this.blnLoading=true;
      this.$store.dispatch(HistoryPolicy,{
        netbar_wacode:this.places.join(','),
        region:this.regins.join(','),
        userName:this.partrolUser,
        is_pass:this.partrolRes,
        policy_id:this.curPolicy_id,
        skip:index ==undefined ? this.pageIndex*10:index*15,
        limit:15
      }).then(res=>{
        this.blnLoading=false;
        this.blnSearch=false;
        if(!tool.msg(res,'','获取列表数据失败!')) return;
        if(index!=undefined && res.biz_body.length<=0){
          tool.info('已经到了最后页!');
          return;
        }else if(index !=undefined){
          this.pageIndex=index;
        }

        this.data=res.biz_body;

        //console.log(tool.Clone(this.data));
      });
    },

    //查看场所详情
    searchSiteDetail(siteId,type){

          let self=this;
          tool.open(function(){
              // 网吧和非网吧分开  html1：网吧    html2：非网吧
              let html1=`<div name="container" style="width:100%;height:100%;padding: 10px;" >
                          <!--加载中标识-->
                          <div v-if="detaillnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 10px;font-size: 50px;">
                              <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
                          </div>
                          <div style="width:100%;height:100%" v-if="!detaillnLoading">
                              <div  class="row">
                                  <div class="col-md-12 item_label_left item_label_title">场所信息：</div>
                              </div>
                              <div class="row site-detail-row">
                                  <div class="col-md-2 item_label_left">场所名称：</div>
                                  <div class="col-md-4">{{detailData.netbar_name}}</div>
                                  <div class="col-md-2 item_label_right">场所编码：</div>
                                  <div class="col-md-4">{{detailData.netbar_wacode}}</div>                                
                              </div>
                              <div class="row site-detail-row">
                                  <div class="col-md-2 item_label_left">营业状态：</div>
                                  <div class="col-md-4">{{detailData.business_state}}</div>
                                  <div class="col-md-2 item_label_right">场所状态：</div>
                                  <div class="col-md-4">{{detailData.online_state}}</div>                                
                              </div>
                              <div class="row site-detail-row">
                                  <div class="col-md-2 item_label_left">上网方式：</div>
                                  <div class="col-md-4">{{detailData.connect_mode  }}</div>
                                  <div class="col-md-2 item_label_right">申报IP：</div>
                                  <div class="col-md-4">{{detailData.access_ip}}</div>                                
                              </div>
                              <div class="row site-detail-row">
                                  <div class="col-md-2 item_label_left">终端状况：</div>
                                  <div class="col-md-4">申报终端：{{detailData.net_terminal_num}}/检测终端：{{detailData.actual_terminal}}/在线终端：{{detailData.internet_users}}</div>
                                  <div class="col-md-2 item_label_right">最近联系时间：</div>
                                  <div class="col-md-4">{{detailData.capture_time}}</div>                                
                              </div>
                              <div class="row site-detail-row">
                                  <div class="col-md-2 item_label_left">所属派出所：</div>
                                  <div class="col-md-4">{{detailData.policestation_name}}</div>
                                  <div class="col-md-2 item_label_right">所属地区：</div>
                                  <div class="col-md-4">{{detailData.region_name}}</div>                                
                              </div>     
                              <div  class="row">
                                  <div class="col-md-12 item_label_left item_label_title">场所负责人：</div>
                              </div>                                                                                  
                              <div class="row site-detail-row">
                                  <div class="col-md-2 item_label_left">法人姓名：</div>
                                  <div class="col-md-2">{{detailData.law_principal_name}}</div>
                                  <div class="col-md-1 item_label_right">证件号:</div>
                                  <div class="col-md-3">{{detailData.law_principal_certificate_id}}</div>     
                                  <div class="col-md-2 item_label_left">联系电话：</div>
                                  <div class="col-md-2">{{detailData.law_principal_tel}}</div>                           
                              </div>
                              <div class="row site-detail-row">
                                  <div class="col-md-2 item_label_right">信息安全员：</div>
                                  <div class="col-md-2">{{detailData.infoman_name}}</div> 
                                  <div class="col-md-1 item_label_left">证件号:</div>
                                  <div class="col-md-3">{{detailData.infoman_certificate_id}}</div>
                                  <div class="col-md-2 item_label_right">联系电话：</div>
                                  <div class="col-md-2">{{detailData.infoman_tel}}</div>                                  
                              </div>
                              <div  class="row">
                                  <div class="col-md-12 item_label_left item_label_title">所属网监：</div>
                              </div>     
                              <div class="row site-detail-row">
                                  <div class="col-md-2 item_label_left">所属网监部门：</div>
                                  <div class="col-md-2">{{detailData.wa_department}}</div>   
                                  <div class="col-md-2 item_label_left">网监负责人：</div>
                                  <div class="col-md-2">{{detailData.supervisor}}</div>
                                  <div class="col-md-2 item_label_left">联系电话：</div>
                                  <div class="col-md-2">{{detailData.supervisor_tel_tel}}</div>                                     
                              </div>
                              <div  class="row">
                                  <div class="col-md-12 item_label_left item_label_title">所属厂商：</div>
                              </div>                                   
                              <div class="row site-detail-row">
                                  <div class="col-md-2 item_label_right">所属厂商：</div>
                                  <div class="col-md-2">{{detailData.security_software_orgname}}</div>       
                                  <div class="col-md-2 item_label_left">厂商负责人：</div>
                                  <div class="col-md-2">{{detailData.contactor}}</div>     
                                  <div class="col-md-2 item_label_right">联系电话：</div>
                                  <div class="col-md-2">{{detailData.contactor_tel}}</div>                    
                              </div>
                              <div id="siteMapOne" style="width:94%;height:200px;margin:0 auto;border:1px solid #aaa">
                              </div>
                          </div>
                      </div>`;
              let html2=`<div name="container" style="width:100%;height:100%;padding: 10px;" >
                          <!--加载中标识-->
                          <div v-if="detaillnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 10px;font-size: 50px;">
                              <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
                          </div>
                          <div style="width:100%;height:100%" v-if="!detaillnLoading">
                              <div  class="row">
                                  <div class="col-md-12 item_label_left item_label_title">场所信息：</div>
                              </div>
                              <div class="row site-detail-row">
                                  <div class="col-md-2 item_label_left">场所名称：</div>
                                  <div class="col-md-4">{{detailData.netbar_name}}</div>
                                  <div class="col-md-2 item_label_right">场所编码：</div>
                                  <div class="col-md-4">{{detailData.netbar_wacode}}</div>                                
                              </div>
                              <div class="row site-detail-row">
                                  <div class="col-md-2 item_label_left">营业状态：</div>
                                  <div class="col-md-4">{{detailData.business_state}}</div>
                                  <div class="col-md-2 item_label_right">场所状态：</div>
                                  <div class="col-md-4">{{detailData.online_state}}</div>                                
                              </div>
                              <div class="row site-detail-row">
                                  <div class="col-md-2 item_label_left">挂载设备：</div>
                                  <div class="col-md-4"><span style="color:green">在线：{{detailData.online_device}}</span>/<span style="color:red">异常：{{detailData.abnormal_device}}</span>/<span style="color:#000">离线：{{detailData.offline_device}}</span></div>
                                  <div class="col-md-2 item_label_right">最近联系时间：</div>
                                  <div class="col-md-4">{{detailData.capture_time}}</div>                                
                              </div>
                              <div class="row site-detail-row">
                                  <div class="col-md-2 item_label_left">经营性质：</div>
                                  <div class="col-md-4">{{detailData.business_nature}}</div>
                                  <div class="col-md-2 item_label_right">数据来源：</div>
                                  <div class="col-md-4">{{detailData.microprobe_type}}</div>                                
                              </div>
                              <div class="row site-detail-row">
                                  <div class="col-md-2 item_label_left">场所类型：</div>
                                  <div class="col-md-4">{{detailData.netsite_type}}</div>
                                  <div class="col-md-2 item_label_right">所属派出所：</div>
                                  <div class="col-md-4">{{detailData.policestation}}</div>                                
                              </div>     
                              <div  class="row">
                                  <div class="col-md-12 item_label_left item_label_title">网络接入信息：</div>
                              </div>                                                                                  
                              <div class="row site-detail-row">
                                  <div class="col-md-2 item_label_left">网络服务商：</div>
                                  <div class="col-md-2">{{detailData.access_servicecode}}</div>
                                  <div class="col-md-1 item_label_right" style="padding-left:0">接入方式:</div>
                                  <div class="col-md-3">{{detailData.connect_mode}}</div>     
                                  <div class="col-md-2 item_label_left">账号或IP：</div>
                                  <div class="col-md-2">{{detailData.access_ip}}&nbsp;&nbsp;&nbsp;&nbsp;{{detailData.auth_account}}</div>                           
                              </div>
                              <div  class="row">
                                  <div class="col-md-12 item_label_left item_label_title">场所负责人：</div>
                              </div>                                                                                  
                              <div class="row site-detail-row">
                                  <div class="col-md-2 item_label_left">法人姓名：</div>
                                  <div class="col-md-2">{{detailData.law_principal_name}}</div>
                                  <div class="col-md-1 item_label_right">证件号:</div>
                                  <div class="col-md-3">{{detailData.law_principal_certificate_id}}</div>     
                                  <div class="col-md-2 item_label_left">联系电话：</div>
                                  <div class="col-md-2">{{detailData.law_principal_tel}}</div>                           
                              </div>
                              <div  class="row">
                                  <div class="col-md-12 item_label_left item_label_title">所属厂商：</div>
                              </div>                                   
                              <div class="row site-detail-row">
                                  <div class="col-md-2 item_label_right">所属厂商：</div>
                                  <div class="col-md-2">{{detailData.security_software_orgname}}</div>       
                                  <div class="col-md-2 item_label_left">厂商负责人：</div>
                                  <div class="col-md-2">{{detailData.contactor}}</div>     
                                  <div class="col-md-2 item_label_right">联系电话：</div>
                                  <div class="col-md-2">{{detailData.contactor_tel}}</div>                    
                              </div>
                              <div id="siteMapOne" style="width:94%;height:200px;margin:0 auto;border:1px solid #aaa">
                              </div>                   
                          </div>
                      </div>`;
              let param={
                      title:'场所详情',
                      content:type=="120" ? html1 : html2,
                      skin:'site-detail-container',
                      area:['1000px','630px'],
                      context:{
                          detailData:{},
                          detaillnLoading:true,
                          map:null,
                          loadDetail(){
                              self.$store.dispatch(SiteDetail,{netbar_wacode:siteId}).then(res=>{
                                  if(res.msg.code!='successed')return;
                                  param.selfData.detaillnLoading=false;
                                  param.selfData.detailData=res.biz_body;
                                  param.selfData.detailData.capture_time = (param.selfData.detailData.capture_time && param.selfData.detailData.capture_time!='0') ? tool.DateByTimestamp(param.selfData.detailData.capture_time,'yyyy-MM-dd hh:mm:ss'):'无';
                                  
                                  self.$nextTick(()=>{
                                      let id=document.getElementById("siteMapOne");
                                      param.selfData.map = new BMap.Map(id,{enableMapClick:false,minZoom:13,maxZoom:18});          // 创建地图实例  
                                      let point = new BMap.Point(param.selfData.detailData.longitude, param.selfData.detailData.latitude);  // 创建点坐标                                          
                                      param.selfData.map.centerAndZoom(point, 13);                 // 初始化地图，设置中心点坐标和地图级别 
                                      param.selfData.map.enableScrollWheelZoom(true);              // 启动鼠标滚轮缩放
                                      let marker = new BMap.Marker(new BMap.Point(param.selfData.detailData.longitude, param.selfData.detailData.latitude)); // 创建点
                                      param.selfData.map.addOverlay(marker);                      //将点加入地图中
                                      let top_left_navigation = new BMap.NavigationControl({author:BMAP_NAVIGATION_CONTROL_ZOOM});  //左上角，添加默认缩放平移控件
                                      //param.selfData.map.addControl(top_left_navigation);   
                                      let opts = {
                                          width : 450,     // 信息窗口宽度
                                          height: 30,     // 信息窗口高度
                                          title : '场所地址：'+param.selfData.detailData.netbar_address , // 信息窗口标题
                                      }
                                      let infoWindow = new BMap.InfoWindow("经纬度："+param.selfData.detailData.longitude+' , '+param.selfData.detailData.latitude, opts);
                                      
                                      marker.addEventListener("click", function(){          
                                          param.selfData.map.openInfoWindow(infoWindow,point); //开启信息窗口
                                      });
                                  });

                              
                              
                              });
                          }
                      },
                      success(){
                          param.selfData.loadDetail();    
                      },
                  };

              return param;
          }());             
    },
    //查看详细
    lookDeail(d){
      let s=this;
      //console.log(tool.Clone(d));
      tool.open(function(){
        let html=`
          <Scroll :listen="data" ref="scroll">
            <div style="width:100%;height:100%;padding:10px;">
              <div class="detail_item" v-for="(d,i) in data">
                <div class="title_bar">{{i+1}}.{{d.title}}</div>
                <div class="child" v-if="d.blnShowDetail">
                  <div class="child_header">
                    <div class="column">巡检序号</div>
                    <div class="column">巡检结果</div>
                    <div class="column">备注</div>
                    <div class="column">巡检日期</div>
                    <div class="column">巡检人员</div>
                  </div>

                  <div class="child_body" v-if="d.historyItems && d.historyItems.length<=0">
                    <div style="width:100%;height:30px;line-height:30px;text-align:center;">暂无数据</div>
                  </div>
                  
                  <div class="child_body" v-if="d.blnLoadData">
                    <div style="width:100%;height:30px;line-height:30px;text-align:center;"><i class="fa fa-spinner fa-pulse"></i></div>
                  </div>

                  <div class="child_body" v-for="(h,i) in (d.historyItems || [])">
                    <div class="column divEllipsis">{{i+1}}</div>
                    <div class="column divEllipsis">{{h.is_post=='1'?h.btn_text:'未操作'}}</div>
                    <div class="column divEllipsis">{{h.item_remark || '_'}}</div>
                    <div class="column divEllipsis">{{converTime(h.log_time)}}</div>
                    <div class="column divEllipsis">{{h.user_name}}</div>
                  </div>
                </div>
                <div class="extend_bar" @click="toggleShowDetail(d)" :style="{'border-top-width':d.blnShowDetail==true?'1px':'0px'}">
                  <div :class="d.blnShowDetail?'triangle_border_up':'triangle_border_down'"></div>  
                </div>
              </div>
            </div>
          </Scroll>
        `;
        let param={
          title:`检查项详情(${d.netbar_name})`,
          area:['600px','400px'],
          content:`<div class="patraol_addPop_detail"  style="width:100%;height:100%;">${html}</div>`,
          components:{Scroll},
          store:s.$store,
          context:{
            data:[],
            patrol_id:'',
            netbar_wacode:d.netbar_wacode,
            policy_id:d.policy_id,
            toggleShowDetail(d){
              if(d.blnShowDetail == undefined){

                Vue.set(d,'blnShowDetail',true);
                Vue.set(d,'blnLoadData',true);
                 s.$store.dispatch(DetailPlacePolicy,{
                   patrol_id:param.selfData.patrol_id,
                   netbar_wacode:param.selfData.netbar_wacode,
                   policy_id:param.selfData.policy_id,
                   policy_item_id:d.itemId,
                }).then(res=>{
                  Vue.set(d,'blnLoadData',false);
                  Vue.set(d,'historyItems',res.biz_body);
                  
                });

              }else{
                d.blnShowDetail=!d.blnShowDetail;
              }

              s.$nextTick(()=>{
                param.$refs.scroll.reloadyScroll();
              })
            },
            converTime(t){
              if(!t) return '';
              return tool.DateByTimestamp(t,'yyyy-MM-dd');
            }
          },
          success(){
            s.$store.dispatch(DetailPlaceInfo,{netbar_wacode:d.netbar_wacode,policy_id:d.policy_id}).then(res=>{
              param.selfData.data=res.biz_body[0].note;
              param.selfData.patrol_id=res.biz_body[0].patrol_id;
            })
          }
        };

        return param;

      }());
    },
    //查看巡检结果
    lookRes(d){
      let s=this;
      tool.open(function(){
        let html=`
          <div class="res_bar">
            <div class="res_bar_item"><span class="title">巡检结果 : </span>{{data.is_pass=='1'?'合格':'不合格'}}</div>
            <div class="res_bar_item"><span class="title">巡检日期 : </span>{{converTime(data.log_time)}}</div>
            <div class="res_bar_item"><span class="title">巡检人员 : </span>{{data.user_name}}</div>
          </div>

          <div class="content">
            <Scroll :listen="items">
              <div class="item" v-for="(d,i) in items">
                <div class="title_bar divEllipsis" :title="d.title">{{i+1}}.{{d.title}}</div>
                <div class="title_content">
                  <div class="content_item"><span class="title">检查结果 : </span> {{d.items[0].text}}</div>
                  <div class="content_item divEllipsis"><span class="title">备注 : </span> {{d.remark}}</div>
                </div>
              </div>
            </Scroll>
          </div>
        `;

        let param={
          title:`巡查结果(${d.netbar_name})`,
          area:['600px','400px'],
          content:`<div class="patraol_addPop_res"  style="width:100%;height:100%;">${html}</div>`,
          components:{Scroll},
          store:s.$store,
          context:{
            data:{},
            items:[],
            converTime(t){
              if(!t) return '';
              return tool.DateByTimestamp(t,'yyyy-MM-dd');
            }
          },
          success(){
            s.$store.dispatch(DetailPolicy,{code:d.netbar_wacode,policy_id:d.policy_id,is_last:'1'}).then(res=>{
              param.selfData.data=res.biz_body[0];
              param.selfData.items=res.biz_body[0].note;
            })
          }
        };

        return param;
      }());
    },
    placechange(context,v){
      let sites=v.sites;
      this.places=_.map(sites,s=>s.code);
    },
    areachange(context,v){
      let regions=v.regions;
      this.regins=_.map(regions,s=>s.code);
    },
    converTime(t,format){
      if(!t) return '';
      return tool.DateByTimestamp(t,format || 'yyyy-MM-dd hh:mm:ss');
    }
  }
}
</script>
<style lang="less">
    /* 场所详情样式*/
   .site-detail-container .layui-layer-title{
        background-color: #03ab67;
        font-weight: 700;
        color:#fff;
    }
    .site-detail-container .site-detail-row{
        margin: 0px;
        line-height: 30px;

    }
    .site-detail-container .site-detail-row .item_label_left{
        text-align: right;

    }
    .site-detail-container .site-detail-row .item_label_left{
        text-align: right;

    }
    .site-detail-container .item_label_title{
        font-weight: 900;
        text-indent: 10px;
        line-height: 25px;
    }
    .site-detail-container .site-detail-row .item_label_right{
        text-align: right;

    }

    /*挂在设备详情*/
    .device-detail-container .layui-layer-title{
        background-color: #03ab67;
        font-weight: 700;
        color:#fff;
    }
    .device-detail-container .mount-table .header div{
        display: inline-block;
    }
    .device-detail-container .mount-table .header{
        display: table-row;
    }
    .device-detail-container .mount-table .header .mount_item{
        display: table-cell;
        font-weight: bolder;
        text-align: center;
        background-color: #E5E5E5;
        line-height: 30px;
        padding: 5px 5px;
        border: 1px solid #C9C9C9;
    }
    .device-detail-container .mount-table .header .mount_item .overflow{
        display: block;
    }
    .device-detail-container .mount-table .content .mount_item{
        display: table-cell;
        font-weight: normal;
        text-align: center;
        line-height: 30px;
        padding: 5px;
        border: 1px solid #C9C9C9;

    }
    .device-detail-container .red{color:red}
    .device-detail-container .green{color:green}
    .device-detail-container .mount-table .content .mount_item .overflow{
        width:100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        display: block;
    }


    /* 数据采集趋势*/
    .status-detail-container .layui-layer-title{
        background-color: #03ab67;
        font-size: 16px;
        color: #fff;
    }
    .status-detail-container .tit-row{
        height:30px;
        padding:0 10px;
        margin-bottom: 6px;
    }
    .status-detail-container .tit-row .tit-bars{
        display: inline-block;
        text-align: center;
        margin: 0px 5px;
        cursor: pointer;
        width: 73px;
        line-height: 25px;
        background-color: #fff;
        color: #000;
        border:1px solid #04AB66;
        border-radius: 6px;
    }

    .status-detail-container .tit-row .tit-bars:hover{
         background-color: #04AB66;
        color: #fff;
        border:1px solid #04AB66;        
    }
    .status-detail-container .tit-row .tit-bars.active{
        background-color: #04AB66;
        color: #fff;
        border:1px solid #04AB66;        
    }
    .status-detail-container .data-row div{
        display: inline-block;
    }
    .status-detail-container .data-row .tda-ert{
        width: 100%;
        margin: 10px 0 7px;
        padding: 0 15px;
        font-size: 12px;
    }
    .status-detail-container .data-row .lefts span{
        display: inline-block;
        margin-right: 40px;
        margin-left: 5px;
    }
    .status-detail-container .data-row .rights{
        float:right;
    }
    .status-detail-container .data-row .rights .sele-time{
        width: 66px;
        text-align: center;
        color: #333645;
        border-bottom: 2px solid #CCC;
        margin: 0 3px;
        cursor: pointer;
    }
    .status-detail-container .data-row .rights .sele-time:hover{
        border-bottom: 2px solid #04AB66;       
    }
    .status-detail-container .data-row .rights .sele-time.active{
        border-bottom: 2px solid #04AB66;       
    }
    .status-detail-container .data-row .el-tooltip:hover{
    cursor: pointer;
    color: #03ab67;
  }  
  .status-detail-container .data-row .el-tooltip.active{
    cursor: pointer;
    color: #03ab67;
  } 
</style>
<style lang="less">
  @import "../css/variables.less";
  .patraol_addPop_detail .detail_item{width:100%;margin-bottom:10px;.border('');border-radius:5px;}

  .patraol_addPop_detail .detail_item .title_bar{line-height:40px;height:40px;.border('bottom');padding:0 10px;}
  .patraol_addPop_detail .detail_item .extend_bar{line-height:20px;height:20px;text-align:center;cursor:pointer;.border('top');}
  .patraol_addPop_detail .detail_item .child{
    width:100%;padding:10px;
  }
  .patraol_addPop_detail .detail_item .child .child_header{width:100%;overflow:hidden;.border('bottom');line-height:30px;}
  .patraol_addPop_detail .detail_item .child .child_header .column{float:left;width:20%;text-align:center;color:@FontCol;}

  .patraol_addPop_detail .detail_item .child .child_body{width:100%;overflow:hidden;.border('bottom');line-height:26px;}
  .patraol_addPop_detail .detail_item .child .child_body .column{float:left;width:20%;text-align:center;}


  .patraol_addPop_detail .detail_item .triangle_border_up{
      width:0;
      height:0;
      border-width:0 10px 10px;
      border-style:solid;
      border-color:transparent transparent @FontCol;/*透明 透明  灰*/
      position:relative;
      display:inline-block;
  }
  .patraol_addPop_detail .detail_item .triangle_border_down{
      width:0;
      height:0;
      border-width:10px 10px 0;
      border-style:solid;
      border-color:@FontCol transparent transparent;/*灰 透明 透明 */
      position:relative;
      display:inline-block;
  }


  .patraol_addPop_res .res_bar{padding:0px 10px;width:100%;height:45px;line-height:45px;}


  .patraol_addPop_res .res_bar .res_bar_item{float:left;width:33%;text-align:center;}
  .patraol_addPop_res .res_bar .res_bar_item .title{color:@FontCol;}

  .patraol_addPop_res .content{width:100%;height:~"calc(100% - 45px)";padding:10px;}
  .patraol_addPop_res .content .item{.border('');border-radius:5px;margin-bottom:10px;}

  .patraol_addPop_res .content .item .title_bar{line-height:40px;height:40px;.border('bottom');padding:0 10px;}
  .patraol_addPop_res .content .item .title_content{line-height:40px;height:40px;padding:0 10px;overflow:hidden;}
  .patraol_addPop_res .content .item .title_content .content_item{float:left;width:50%;}
  .patraol_addPop_res .content .item .title_content .content_item .title{color:@FontCol;}

  .patrol_pop .delPlaceItem:hover{cursor:pointer;}
  html{.TCol(~".patrol_pop .delPlaceItem:hover");}

</style>

<style scoped lang="less">
@import "../css/variables.less";
.PatrolList{width:100%;height:100%;padding:5px;position:relative;}

.PatrolList .option{text-align:left;padding:10px;}
.PatrolList .option .item{display:inline-block;margin:2px 0;}


.PatrolList .table_body .row{}

.PatrolList .table_body .row .bold{font-weight:bold;color:#03ab67;}
.PatrolList .table_body .row .bold:hover{text-decoration:underline;cursor:pointer;}
//列表显示样式
@header_H:40px;
.PatrolList .table_header{height:@header_H;display:table;width:100%;border:none;color:white;}
html{.TCol(~".PatrolList .table_header .row",'bg');}

.PatrolList .table_header .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
.PatrolList .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;.border('bottom');background-color:white;}
.PatrolList .table_header .column .sort_item .triangle-up:hover{cursor:pointer;}
html{.TCol(~".PatrolList .table_header .column .sort_item .triangle-up:hover",'bbc');}

.PatrolList .table_header .column .sort_item .triangle-down:hover{cursor:pointer;}
html{.TCol(~".PatrolList .table_header .column .sort_item .triangle-down:hover",'btc');}

//.HighRisk .table_header .column .sort_item .triangle-up.active{border-bottom-color:@Font_Hover_Col;}
html{.TCol(~".PatrolList .table_header .column .sort_item .triangle-up.active",'bbc');}

//.HighRisk .table_header .column .sort_item .triangle-down.active{border-top-color:@Font_Hover_Col;}

html{.TCol(~".PatrolList .table_header .column .sort_item .triangle-down.active",'btc');}

.PatrolList .table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";.border('bottom');}
.PatrolList .table_conatienr{width:100%;display:table;width:100%;border:none;}
.PatrolList .table_conatienr .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}

.overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}

  //左边侧边框
  @bgColor:fade(@HeaderBgCol,90%);
  @popW:300px;
  .PatrolList .left_pop{
    position:absolute;left:-@popW;top:14px;bottom:10px;z-index:100;width:@popW;background-color:@bgColor !important;
    border-top-right-radius:5px;border-bottom-right-radius:5px;color:white;text-align:left;
  }

  .PatrolList .left_pop.active{left:0px;}

  .PatrolList .left_pop .pop_lable{
    width:30px;position:absolute;top:50%;margin-top:-40px;
    background-color:@bgColor;color:white;
    font-size:12px;padding:10px 8px;border-top-right-radius:5px;border-bottom-right-radius:5px;
    right:-30px;
    cursor:pointer;.trans();
  }
  
  @popTitleH:40px;
  .PatrolList .left_pop .title_bar{width:100%;height:40px;border-top-left-radius:5px;border-top-right-radius:5px;overflow:hidden;}
  .PatrolList .left_pop .title_bar .item_bar{float:left;width:50%;height:100%;line-height:@popTitleH;text-align:center;font-size:16px;.border('bottom');cursor:pointer;}
  .PatrolList .left_pop .title_bar .item_bar i{margin-right:10px;} 
  html{.TCol(~".PatrolList .left_pop .title_bar .item_bar:hover",'bg');}

  .PatrolList .left_pop .content_bar{width:100%;height:~'calc(100% - @{popTitleH})';}
  .PatrolList .left_pop .content_bar .item{padding:0px 20px;.border('bottom');cursor:pointer;}
  .PatrolList .left_pop .content_bar .item .content_title{text-align:center;padding:10px 0px;}
  .PatrolList .left_pop .content_bar .item .content_row{height:30px;}
  .PatrolList .left_pop .content_bar .item .content_row .column{float:left;width:50%;font-size:12px;}
  .PatrolList .left_pop .content_bar .item .content_row .column:last-child{text-align:right;}
  .PatrolList .left_pop .content_bar .item .opiton_bar{text-align:right;cursor:pointer;}


  //.Expressage .left_pop .pop_lable:hover{background-color:@Font_Hover_Col;}
  html{.TCol(~".PatrolList .left_pop .pop_lable:hover",'bg');}

  .Expressage .left_pop .item{font-size:12px;padding:10px;.trans();.border('bottom');}
  .Expressage .left_pop .item:hover{cursor:pointer;}
  html{.TCol(~".PatrolList .left_pop .item:hover",'bg');}

  .PatrolList .left_pop .item .child{margin-bottom:10px;}
  .PatrolList .left_pop .item .item_type{
    padding:2px 8px;position:relative;display:inline-block;
  }

  .PatrolList .left_pop .item i:hover{color:#20a1ff;}

  .PatrolList .left_pop .item.active .bottom_right:before,
  .PatrolList .left_pop .item.active .bottom_right:after,
  .PatrolList .left_pop .item.active .top_left:after,
  .PatrolList .left_pop .item.active .top_left:before,
  .PatrolList .left_pop .item:hover .bottom_right:before,
  .PatrolList .left_pop .item:hover .bottom_right:after,
  .PatrolList .left_pop .item:hover .top_left:after,
  .PatrolList .left_pop .item:hover .top_left:before{background:@bgColor;}

  html{.TCol(~".PatrolList .active ",'bg');}
</style>
