<!-- 高危库页面 -->
<template>
    <div class="HighRisk">
        <div class="c_container">
            <!--搜索栏-->
            <div class="option_bar">
                <div style="display:inline-block;" v-show="pageIndex==0">
                    <div class="item">
                        <span>报警姓名</span>
                        <div style="display:inline-block;">
                            <el-input  placeholder="请输入报警姓名" style="display:inline-block;" v-model="police_name"></el-input>
                        </div>
                    </div>
                    <div class="item">
                        <span>证件号</span>
                        <div style="display:inline-block;">
                            <el-input  placeholder="请输入证件号" style="display:inline-block;" v-model="police_idNumber"></el-input>
                        </div>
                    </div>
                    <div class="item">
                        <span>手机</span>
                        <div style="display:inline-block;">
                            <el-input  placeholder="请输入手机号" style="display:inline-block;" v-model="police_phone"></el-input>
                        </div>
                    </div>
                    <div class="item">
                        <span>MAC</span>
                        <div style="display:inline-block;">
                            <el-input  placeholder="请输入MAC" style="display:inline-block;" v-model="police_mac"></el-input>
                        </div>
                    </div>
                    <div class="item" style="display:none;">
                        <span>人员类型</span>
                        <div style="display:inline-block;">
                            <el-select style="width:250px;"  v-model="police_kind"  :clearable="true" placeholder="请选择" >
                                <el-option
                                    v-for="item in kindData"
                                    :label="item.name"
                                    :value="item.key_identity_type_id">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="item">
                        <el-button type="primary" @click="search()"><i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i><span v-show="!blnSearch">搜索</span></el-button>
                    </div>
                </div>
                <div style="display:inline-block;" v-show="pageIndex==1">
                    <div class="item">
                        <span>姓名</span>
                        <div style="display:inline-block;">
                            <el-input  placeholder="请输入姓名" style="display:inline-block;" v-model="person_name"></el-input>
                        </div>
                    </div>
                    <div class="item">
                        <span>证件号</span>
                        <div style="display:inline-block;">
                            <el-input  placeholder="请输入证件号" style="display:inline-block;" v-model="person_idNumber"></el-input>
                        </div>
                    </div>
                    <div class="item">
                        <span>手机</span>
                        <div style="display:inline-block;">
                            <el-input  placeholder="请输入手机号" style="display:inline-block;" v-model="person_phone"></el-input>
                        </div>
                    </div>
                    <div class="item">
                        <span>MAC</span>
                        <div style="display:inline-block;">
                            <el-input  placeholder="请输入MAC" style="display:inline-block;" v-model="person_mac"></el-input>
                        </div>
                    </div>
                    <div class="item">
                        <span>人员类型</span>
                        <div style="display:inline-block;">
                            <el-select style="width:250px;"  v-model="person_kind"  :clearable="true" placeholder="请选择" >
                                <el-option
                                    v-for="item in kindData"
                                    :label="item.name"
                                    :value="item.key_identity_type_id">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="item">
                        <el-button type="primary" @click="search()"><i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i><span v-show="!blnSearch">搜索</span></el-button>
                    </div>
                </div>
            </div>

            <!--操作栏-->
            <div class="action_bar">
                <span  style="margin-left:10px;cursor:pointer;" class="tag_label" @click="addPerson()">
                    <el-tooltip effect="light" content="添加人员" placement="top">
                        <i  style="margin-right:5px;" class="fa fa-user"></i>添加
                    </el-tooltip>
                </span>

                <span  style="margin-left:10px;cursor:pointer;" class="tag_label" @click="exportList(pageIndex)">
                    <el-tooltip effect="light" :content="pageIndex==0?'导出报警信息':'导出人员信息'" placement="top">
                        <i v-if="!blnExporting" class="fa fa-level-up" ></i>
                        <i v-if="blnExporting" class="fa fa-spinner fa-spin" ></i>导出
                    </el-tooltip>
                </span>
            </div>
            <!--内容框-->
            <div class="content_container">
                <!--类型栏-->
                <div class="kind_bar">
                    <!--按钮栏-->
                    <div class="btn_bar">
                        <div class="item">新建类型</div><div class="item">添加人员</div>
                    </div>
                    <!--类型展示栏-->
                    <div class="kind_show_bar">
                        <Scroll :listen="kindData">
                            <div class="item" v-for="d in kindData">{{d}}</div>
                        </Scroll>
                    </div>
                </div>
                <!--列表栏-->
                <div class="list_bar">
                    <HTag :tags="pages" @change="tagChange">
                        <div slot="t0" style="height:100%;width:100%;">
                            <!--表头-->
                            <div class="table_header">
                                <div class="row">
                                    <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">报警姓名</span></div>
                                    <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">证件号</span></div>
                                    <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">手机</span></div>
                                    <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">MAC</span></div>
                                    <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">报警时间</span></div>
                                    <div class="column"><span class="overflow" :style="{width:police_auto_column_w+'px'}">报警场所</span></div>
                                    <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">报警来源</span></div>
                                </div>
                            </div>
                            <!--表体-->
                            <div class="table_body">
                                <!--暂无数据-->
                                <div v-if="police_data.length<=0" style="width:100%;height:100%;text-align:center;display:table;">
                                    <div style="display:table-cell;vertical-align: middle;">暂无数据</div>
                                </div>
                                <Scroll :listen="police_data">
                                    <div class="table_conatienr">
                                        <template v-for="d in police_data">
                                            <div class="row">
                                                <div class="column" style="width:100px;" :title="d.customer_name"><span class="overflow" style="width:100px;">{{d.customer_name}}</span></div>
                                                <div class="column" style="width:150px;" :title="d.certificate_code"><span class="overflow" style="width:150px;">{{d.certificate_code}}</span></div>
                                                <div class="column" style="width:120px;" :title="d.mobile"><span class="overflow" style="width:120px;">{{d.mobile}}</span></div>
                                                <div class="column" style="width:150px;" :title="d.mac"><span class="overflow" style="width:150px;">{{d.mac}}</span></div>
                                                <div class="column" style="width:150px;" :title="d.policeTime"><span class="overflow" style="width:150px;">{{d.policeTime}}</span></div>
                                                <div class="column" :title="d.netbar_name"><span class="overflow" :style="{width:police_auto_column_w+'px'}"><span @click="showPlace(d)" style="cursor:pointer;color:rgb(3, 171, 103);">{{d.netbar_name}}</span></span></div>
                                                <div class="column" :title="d.source_type" style="width:150px;"><span class="overflow" style="width:150px;">{{d.source_type}}</span></div>
                                            </div>
                                        </template>
                                    </div>
                                </Scroll>
                            </div>
                            <!--分页-->
                            <div name="page_container" class="page_container">
                                <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{police_pageIndex+1}}</span></span>
                                <div class="firstPage" @click="police_pageChange(0)">首页</div>
                                <div class="prePage" @click="police_pageChange(police_pageIndex-1)">上一页</div>
                                <div class="nextPage" @click="police_pageChange(police_pageIndex+1)">下一页</div>
                            </div>
                        </div>
                        <div slot="t1" style="height:100%;width:100%;">
                            <!--表头-->
                            <div class="table_header">
                                <div class="row">
                                    <div class="column" style="width:50px;"><span class="overflow" style="width:50px;">选择</span></div>
                                    <div class="column" style="width:180px;">
                                        <span class="overflow" style="width:180px;">创建时间</span>
                                        <!--<div class="sort_item" style="display: inline-block;text-align: center;position:relative;">
                                            <div class="triangle-up" style="position: absolute;top:-11px;" :class="{active:createTimeSort==1}" @click="createTimeSort=1"></div>
                                            <div class="triangle-down" style="position: absolute;top:-4px;" :class="{active:createTimeSort==2}" @click="createTimeSort=2"></div>
                                        </div>-->
                                    </div>
                                    <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">创建人</span></div>
                                    <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">姓名</span></div>
                                    <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">证件号</span></div>
                                    <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">手机</span></div>
                                    <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">MAC</span></div>
                                    <div class="column"><span class="overflow" :style="{width:person_auto_column_w+'px'}">人员类型</span></div>
                                    <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">短信报警</span></div>
                                    <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">操作</span></div>
                                </div>
                            </div>
                             <!--表体-->
                            <div class="table_body">
                                <!--暂无数据-->
                                <div v-if="person_data.length<=0" style="width:100%;height:100%;text-align:center;display:table;">
                                    <div style="display:table-cell;vertical-align: middle;">暂无数据</div>
                                </div>
                                <Scroll :listen="person_data">
                                    <div class="table_conatienr">
                                        <template v-for="d in person_data">
                                            <div class="row">
                                                <div class="column" style="width:50px;">
                                                    <span class="overflow" style="width:50px;"><i class="fa" style="cursor:pointer;" :class="{'fa-square-o':!d.sel,'fa-check-square-o':d.sel}" @click="person_check(d)"></i></span>
                                                </div>
                                                <div class="column" :title="d.createdTime" style="width:180px;">
                                                    <span class="overflow" style="width:180px;">{{d.createdTime}}</span>
                                                </div>
                                                <div class="column" style="width:100px;" :title="d.account"><span class="overflow" style="width:100px;">{{d.account}}</span></div>
                                                <div class="column" style="width:120px;" :title="d.key_identity_name"><span class="overflow" style="width:120px;">{{d.key_identity_name}}</span></div>
                                                <div class="column" style="width:150px;" :title="d.key_identity_cert"><span class="overflow" style="width:150px;">{{d.key_identity_cert}}</span></div>
                                                <div class="column" style="width:120px;" :title="d.key_identity_mobile"><span class="overflow" style="width:120px;">{{d.key_identity_mobile}}</span></div>
                                                <div class="column" style="width:150px;" :title="d.key_identity_mac"><span class="overflow" style="width:150px;">{{d.key_identity_mac}}</span></div>
                                                <div class="column" :title="d.personType"><span class="overflow" :style="{width:person_auto_column_w+'px'}">{{d.personType}}</span></div>
                                                <div class="column" style="width:150px;" :class="d.alarm_account && d.alarm_account.sms?'openSMS':'closeSMS'">
                                                    <span class="overflow" style="width:150px;">
                                                        <span style="cursor:pointer;" @click="openSMS(d)">
                                                            <el-tooltip effect="light" content="开启" placement="top" v-if="d.alarm_account && d.alarm_account.sms">
                                                                <i class="fa fa-check"></i>
                                                            </el-tooltip>

                                                            <el-tooltip effect="light" content="关闭" placement="top" v-if="!(d.alarm_account && d.alarm_account.sms)">
                                                                <i class="fa fa-remove"></i>
                                                            </el-tooltip>
                                                        </span>
                                                    </span>
                                                </div>
                                                <div class="column" style="width:120px;">
                                                    <span class="overflow" style="width:120px;">
                                                        <span style="margin-right:5px;cursor:pointer;color:rgb(3, 193, 215);" @click="person_detail(d)">
                                                            <el-tooltip effect="light" content="详细" placement="top">
                                                                <i class="fa fa-navicon"></i>
                                                            </el-tooltip>
                                                        </span>
                                                        <span style="margin-right:5px;cursor:pointer;color:rgb(3, 193, 215);" @click="addPerson(d)">
                                                            <el-tooltip effect="light" content="修改" placement="top">
                                                                <i class="fa fa-pencil"></i>
                                                            </el-tooltip>
                                                        </span>
                                                        <span style="margin-right:5px;cursor:pointer;color:rgb(3, 193, 215);" @click="delPerson(d)">
                                                            <el-tooltip effect="light" content="删除" placement="top">
                                                                <i class="fa fa-remove"></i>
                                                            </el-tooltip>
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </Scroll>
                            </div>
                             <!--分页-->
                            <div name="page_container" class="page_container">
                                <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">
                                    <i class="fa" style="cursor:pointer;" :class="{'fa-square-o':!personAllSel,'fa-check-square-o':personAllSel}" @click="person_all_check()"></i>
                                    <button type="button" class="btn btn-default btn-xs" @click="batchesRemove()">删除</button>
                                </span>
                                <span style="float:left;margin-top:15px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{person_pageIndex+1}}</span></span>
                                <div class="firstPage" @click="person_pageChange(0)">首页</div>
                                <div class="prePage" @click="person_pageChange(person_pageIndex-1)">上一页</div>
                                <div class="nextPage" @click="person_pageChange(person_pageIndex+1)">下一页</div>
                            </div>
                        </div>
                    </HTag>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import HTag from 'components/HTag'
import Scroll from 'components/scroll'
import AttenType from '../enum/AttenType'
import cInput from 'components/Input'
import MulSelect from 'components/MulSelect'
import ScaleBar from 'components/scaleBar'

import '../../static/jquery-file-upload/jquery.ui.widget.js'
import '../../static/jquery-file-upload/jquery.iframe-transport.js'
import '../../static/jquery-file-upload/jquery.fileupload.js'
import '../../static/jquery.particleground.js'

import {GetIdenPerson,AddIdentity,GetIndentity,DelIndentity,AddIdenPerson,
        UpdateIdenPerson,DelIdenPerson,GetIdenPersonDetail,
        GetAlarmMobile,AddAlarmMobile,DelAlarmMobile,BODY_RESIZE,Trigger_RESIZE,
        ExportKeyIdentity,ExportKeyIdentityLog
        } from '../store/mutation-types'
export default {
  name: 'HighRisk',
  components:{HTag,Scroll},
  data () {
    return {
      beforeToday:{//限制只能选择今天之前的日期
        disabledDate(time) {
            return time.getTime() > Date.now();
        }
      },
      pageIndex:0,//当前显示页面索引
      pages:[{name:'报警信息',icon:'fa fa-tag'},{name:'人员信息',icon:'fa fa-tag'}],
      timeSort:0,
      createTimeSort:0,
      blnSearch:false,
      police_name:'',//姓名
      police_idNumber:'',//证件号
      police_phone:'',//手机号
      police_mac:'',//MAC
      police_kind:0,//人员类型
      showNum:20,//显示的条数
      timeRange:[],//日期范围
      police_data:[],//报警信息
      police_pageIndex:0,
      person_data:[],//人员信息
      person_pageIndex:0,
      person_name:'',
      person_idNumber:'',
      person_phone:'',
      person_mac:'',
      person_kind:0,//人员类型
      kindData:['全部类型','普通人员','前科人员'],//类型数据集合
      personAllSel:false,//人员信息是否全选
      mobiles:[],//报警电话
      police_auto_column_w:0,//报警信息列表自适应列宽度
      person_auto_column_w:0,//人员信息列表自适应列宽度
      mapLevel:ser.map,
      blnExporting:false,
      bodyResizeSub:null,
    }
  },
  computed:{
    
  },
  mounted(){
    this.loadData();
    
    let containerEl=$(this.$el).find('div[class="c_container"]');
    let optBarEl=$(this.$el).find('div[class="option_bar"]');
    let listEl=$(this.$el).find('div[class="content_container"]'); 
    
    listEl.css('height',containerEl.height()-optBarEl.height());

    this.police_auto_column_w=$(this.$el).width()-820;
    this.person_auto_column_w=$(this.$el).width()-1140;

    // this.$store.commit(BODY_RESIZE,()=>{
    //     listEl.css('height',containerEl.height()-optBarEl.height());
    //     this.police_auto_column_w=$(this.$el).width()-820;
    //     this.person_auto_column_w=$(this.$el).width()-1140;
    // });

    this.$store.commit(BODY_RESIZE,{cb:(sub)=>{
        this.bodyResizeSub=sub
    },sub:()=>{
        listEl.css('height',containerEl.height()-optBarEl.height());
        this.police_auto_column_w=$(this.$el).width()-820;
        this.person_auto_column_w=$(this.$el).width()-1140;
    }});
  },
  beforeDestroy(){
    this.bodyResizeSub.unsubscribe();
  },
  methods:{
      //刷新页面
      refreshPage(){
          this.loadData();
      },
      loadData(){
            //获取人员类型信息
            this.$store.dispatch(GetIndentity,{}).then(res=>{
                if(res.msg.code!='successed')return;
                this.kindData=_.map(res.biz_body,item=>{
                    item.name=item.key_identity_type_title;
                    item.note=item.key_identity_type_note;
                    return item;
                });
                //获取人员信息
                this.getPerson(true);

            
                //获取报警数据
                this.getPloice(true);
            });

            //获取报警电话信息
            this.$store.dispatch(GetAlarmMobile).then(res=>{
                if(res.msg.code!='successed')return;
                this.mobiles=res.biz_body;
                if(res.biz_body.length>0){
                    this.mobiles=_.map(res.biz_body,item=>{return {id:item.id,name:`${item.contact_name}`,contact_name:item.contact_name,mobile:item.mobile,children:[]}});
                }
            });
      },
      //导出列表信息
      exportList(i){
        this.blnExporting=true;
        let policeParam={
            key_identity_name:this.police_name || '',
            key_identity_cert:this.police_idNumber || '',
            key_identity_mobile:this.police_phone || '',
            key_identity_mac:this.police_mac || '',
            key_identity_type:this.police_kind || '',
        },
        personParam={
            key_identity_name:this.person_name || '',
            key_identity_cert:this.person_idNumber || '',
            key_identity_mobile:this.person_phone || '',
            key_identity_mac:this.person_mac || '',
            key_identity_type:this.person_kind || '',
        };
        this.$store.dispatch(i==0?ExportKeyIdentityLog:ExportKeyIdentity,i==0?policeParam:personParam
        ).then(res=>{
            this.blnExporting=false;

            if(!tool.msg(res,'导出成功!','导出失败!')) return;
            if(!res.biz_body.url) return;
            window.location=res.biz_body.url;
        });
      },
      tagChange(index){
          this.pageIndex=index;
          
          this.$nextTick(()=>{
            let containerEl=$(this.$el).find('div[class="c_container"]');
            let optBarEl=$(this.$el).find('div[class="option_bar"]');
            let listEl=$(this.$el).find('div[class="content_container"]'); 
            
            listEl.css('height',containerEl.height()-optBarEl.height());
          });

         this.$store.commit(Trigger_RESIZE);
      },
      //批量删除人员
      batchesRemove(){
          let ids=_.chain(this.person_data).filter(p=>p.sel).map(r=>r.key_identity_id).value() || [];
          if(ids.length<=0){tool.info('请选择需要删除的数据项!'); return;}
          
          tool.confirm('您确定要删除该人员信息吗?',['确定','取消'],()=>{
            this.$store.dispatch(DelIdenPerson,{id:ids}).then(res=>{
                if(!tool.msg(res,'删除成功!','删除失败!'))return;
                for(let id of ids){
                    this.person_data.splice(_.findIndex(this.person_data,t=>{return t.key_identity_id==id}),1);
                }
            });
          },function(){});

      },
      //获取人员信息
      getPerson(blnSearch){
        this.$store.dispatch(GetIdenPerson,{
                limit:this.showNum,
                skip:this.person_pageIndex * this.showNum,
                key_identity_name:this.person_name || '',
                key_identity_cert:this.person_idNumber || '',
                key_identity_mobile:this.person_phone || '',
                key_identity_mac:this.person_mac || '',
                key_identity_type:this.person_kind || '',
            }).then(ress=>{
            if(ress.msg.code!='successed')return;
            let data=ress.biz_body;
            if(blnSearch){
                this.person_data=this.converPersons(data);
                return;
            }

            if(data.length<=0){
                tool.msg({msg:{code:'successed'}},'已经到了最后页!','已经到了最后页!');
                this.person_pageIndex =this.person_pageIndex-1;
                return;
            }
            this.person_data=this.converPersons(data || []);

        });
      },
      //获取报警数据
      getPloice(blnSearch){
          this.$store.dispatch(GetIdenPersonDetail,{
              id:'',
              limit:this.showNum,
              skip:this.police_pageIndex * this.showNum,
              key_identity_name:this.police_name || '',
              key_identity_cert:this.police_idNumber || '',
              key_identity_mobile:this.police_phone || '',
              key_identity_mac:this.police_mac || '',
              key_identity_type:this.police_kind || '',
            }).then(res=>{
                this.blnLoading=false;
                if(res.msg.code!='successed')return;
                let data=res.biz_body;
                if(blnSearch){
                    this.police_data=this.converPolice(data);
                    return;
                }
                if(data.length<=0){
                    tool.msg({msg:{code:'successed'}},'已经到了最后页!','已经到了最后页!');
                    this.police_pageIndex=this.police_pageIndex-1;
                    return;
                }
                this.police_data=this.converPolice(data);
            });
      },
      converPersons(personData){
        if(personData.length<=0){return [];}
        return  _.map(personData,per=>{
            per.personType=_.map(per.key_identity_types,i=>{
               return (_.find(this.kindData,item=>{return item.key_identity_type_id==+i}) || {name:''}).name;
            }).join(',');
            per.perFollows=_.compact(_.map(per.follows,i=>{
               return ((_.find(AttenType,item=>{return item.val==i}) || {name:''}) || {name:''}).name; 
            })).join(',');
            per.createdTime=tool.DateByTimestamp(per.log_time,'yyyy-MM-dd hh:mm:ss')
            return per;
        });
      },
      converPolice(policeData){
        if(policeData.length<=0){return policeData;}
        return _.map(policeData,per=>{
            per.perKind=_.map(per.key_identity_type,i=>{
            return (_.find(this.kindData,item=>{return item.key_identity_type_id==i}) || {name:''}).name;
            }).join(',');

            per.policeTime=tool.DateByTimestamp(per.detect_time,'yyyy-MM-dd hh:mm:ss');
            return per;
        });
      },
      search(){
          switch(this.pageIndex){
                case 0: //报警信息
                    this.police_pageIndex=0;
                    this.getPloice(true);
                    break;
                case 1://人员信息
                    this.person_pageIndex=0;
                    this.getPerson(true);
                    break;
          }
      },
      police_pageChange(pageNum){
        this.police_pageIndex=pageNum>0? pageNum : 0;;
        this.getPloice();
      },
      person_pageChange(pageNum){
        this.person_pageIndex=pageNum>0? pageNum : 0;
        this.getPerson();
      },
      //删除人员
      delPerson(val){
        tool.confirm('您确定要删除该人员信息吗?',['确定','取消'],()=>{
            let index= _.findIndex(this.person_data,per=>{return per.key_identity_id==val.key_identity_id;});
            this.$store.dispatch(DelIdenPerson,{id:val.key_identity_id}).then(res=>{
                if(!tool.msg(res,'删除人员成功!','删除人员失败!'))return;
                this.person_data.splice(index,1);
            });
        },function(){});
      },
      //人员数据项复选框单击事件
      person_check(d){
          if(d.sel==undefined){
              Vue.set(d,'sel',false);
          }

          d.sel=!d.sel;

          if(!d.sel){
              this.personAllSel=false;
          }else{
             this.personAllSel =!(_.filter(this.person_data,d=>!d.sel).length>0);
          }

              
      },
      //人员数据全选复选框单击事件
      person_all_check(){
          this.personAllSel=!this.personAllSel;
          if(this.personAllSel){
            _.each(this.person_data,d=>{
                Vue.set(d,'sel',true);
            });
          }else{
            _.each(this.person_data,d=>{
                Vue.set(d,'sel',false);
            });
          }
          
      },
      //显示报警地址地图信息
      showPlace(d){
        let s=this;
        tool.open(function(){
            let html=`<div  style="width:100%;height:100%;position:relative;">
                        <div name="map_container" style="width:100%;height:100%;"></div>
                        <div style="position:absolute;top:10px;left:10px;">
                            <ScaleBar :start="mapLevel[0]" :end="mapLevel[1]" :defVal="mapLevel[2]" @change="zoomChange" ref="scaleBar" />
                        </div>
                      </div>`;
            let param={
                    title:'位置信息',
                    content:html,
                    area:['800px','400px'],
                    components:{ScaleBar},
                    store:s.$store,
                    context:{
                        map:null,
                        mapLevel:ser.map,
                        zoomChange(zoom){
                            param.selfData.map.setZoom(zoom);
                        }
                    },
                    success(layero){
                        let mapEl=layero.find('div[name="map_container"]');
                        let map = new BMap.Map(mapEl[0],{minZoom:s.mapLevel[0],maxZoom:s.mapLevel[1]});
                        param.selfData.map=map;
                        let centerPoint=tool.cookie.get('centerPoint').split(',') || [];
                        var point =new BMap.Point(d.equipment_longitude || centerPoint[0] || 0,d.equipment_latitude || centerPoint[1] || 0);

                        map.centerAndZoom(point,s.mapLevel[2]);//安阳中心点
                        map.enableScrollWheelZoom(true);

                        var marker=new BMap.Marker(point);

                        map.addOverlay(marker);
                        //场所名称
                        var labelName= new BMap.Label(`<div style="width:200px;text-align:center;">${d.netbar_name}</div>`,{position:point, offset:new BMap.Size(-100,-60)});
                        labelName.setStyle({
                            fontSize : "12px",
                            lineHeight : "20px",
                            fontFamily:"微软雅黑",
                            fontWeight:'400',
                            color:'#006600',
                            border:'0px solid #336600',
                            'background-color':'transparent',
                            'max-width':'none'
                        });
                        map.addOverlay(labelName);

                        //场所地址
                        var label= new BMap.Label(`<div style="width:300px;text-align:center;">${d.netbar_address || ''}</div>`,{position:new BMap.Point(d.equipment_longitude,d.equipment_latitude), offset:new BMap.Size(-150,10)});
                        label.setStyle({
                            fontSize : "12px",
                            lineHeight : "20px",
                            fontFamily:"微软雅黑",
                            fontWeight:'300',
                            border:'0px solid black',
                            'background-color':'transparent',
                            'max-width':'none'
                        });
                        map.addOverlay(label);

                        //添加地图层级改变事件
                        map.addEventListener('zoomend',(e)=>{
                            var zoom=map.getZoom();
                            param.$refs.scaleBar.setVal(zoom);
                        });
                    }
                };

            return param;
        }());  
      },
      //开启/关闭短信功能
      openSMS(d){
          tool.info('短信报警接口还未接入!');
          return;
          if(d.alarm_account && d.alarm_account.sms){
            //关闭
            tool.confirm('短信功能已开启,您确定要关闭吗?',['确定','取消'],()=>{
                let updateTemp={
                    key_identity_id:d.key_identity_id,
                    follows:[],
                    alarm_account:{},
                }
                this.$store.dispatch(UpdateIdenPerson,updateTemp).then(res=>{
                    if(!tool.msg(res,'关闭成功','关闭失败'))return;
                    d.alarm_account={};
                });
            },function(){});
          }else{
            //开启
            tool.confirm('您确定要开启短信功能吗?',['确定','取消'],()=>{
                this.setSmsPolice().then(res=>{
                    if(!res.format) return;
                    let updateTemp={
                        key_identity_id:d.key_identity_id,
                        follows:['sms'],
                        alarm_account:{
                            sms:{phone:res.phone,format:res.format}
                        },
                    }
                    this.$store.dispatch(UpdateIdenPerson,updateTemp).then(res=>{
                        if(!tool.msg(res,'启动成功','开启失败'))return;

                        d.alarm_account={ sms:{phone:res.phone,format:res.format}};
                    });
                });
            },function(){});
          }
      },
      //设置短信相关信息
      setSmsPolice(data){
          let self=this;
          let defPhone=_.filter(self.mobiles,m=>{
              return ((data || {phone:[]}).phone || []).indexOf(m.mobile)>=0;
          }) || [];

          return new Promise((resolve,reject)=>{
            
            tool.open(function(){
                let html=`
                    <div style="padding:10px;">
                        <cInput label="短信格式" @change="format_change" :val="format"/>
                        <MulSelect ref="smsMobile" 
                                    style="margin-top: 10px;"
                                    firstPlace="请输入姓名" 
                                    secondPlace="请输入电话号码"
                                    :defaultVal="defMobiles" 
                                    :selItems="mobiles" 
                                    :blnDel="true" 
                                    @add="addMobile" 
                                    @del="delMobile" 
                                    keyid="id"/>
                        <div class="option_bar" style="margin-top: 10px;text-align:right;">
                            <button type="button" class="btn btn-success" style="font-size:12px;"  @click="submit">
                                确定
                            </button> 
                            <button type="button" class="btn btn-default" style="font-size:12px;" @click="cancel">取消</button>
                        </div>
                    </div>
                `;
                let p={
                        title:'短报警配置',
                        content:html,
                        area:'500px',
                        components:{cInput,MulSelect},
                        context:{
                            format:data?data.format:'',//短信格式
                            sendNum:[],//发送号码
                            defMobiles:defPhone,//默认电话号码
                            mobiles:self.mobiles,
                            format_change(val){p.selfData.format=val;},
                            submit(){
                                let sms=_.map(p.$refs.smsMobile.$data.data,item=>{return item.mobile;});
                                let format=p.selfData.format; 
                    
                                resolve({format:format,phone:sms});

                                p.close();
                            },
                            cancel(){
                                p.close();
                            },
                            //添加报警电话
                            addMobile(val){
                                self.$store.dispatch(AddAlarmMobile,{name:val[0].name,mobile:val[0].note}).then(res=>{
                                    if(res.msg.code!='successed')return;
                                    val[0].id=res.biz_body[0].id;
                                    p.selfData.mobiles.push({id:val[0].id,name:val[0].name,mobile:val[0].note,contact_name:res.biz_body[0].name,children:[]});
                                    val[0].mobile=val[0].note;
                                });
                            },
                            //删除报警电话
                            delMobile(val){
                                self.$store.dispatch(DelAlarmMobile,val.id).then(res=>{
                                        if(res.msg.code!='successed')return;
                                });
                            },
                        }
                };

                return p;
            }());
        });
      },
      //添加人员
      addPerson(valup){
          let self=this;
          _.each(self.kindData,s=>{
              if(s.name=='普通人员'){
                  s.blnNodel=true;//不允许被删除
              }
          });

          tool.open(function(){

            let html=`<div class="addPerson_Pop">
                        <HTag :tags="pages">
                            <div slot="t0" style="height:100%;width:100%;">
                                <div class="item clearfix">
                                    <span class="title" style="line-height:50px;">姓名:</span>
                                    <div class="input" style="margin-top:-2px;"><cInput label="姓名" @change="nameChange" :val="name" /></div>
                                </div>
                                <div class="item clearfix">
                                    <span class="title" style="line-height:50px;">证件号:</span>
                                    <div class="input" style="margin-top:-2px;"><cInput label="证件号" ref="certNum" :blnDisabled="blnEdit" reg="^[a-zA-Z0-9]*$" tip="非法证件号" @change="certChange" :val="cert" /></div>
                                </div>
                                <div class="item clearfix">
                                    <span class="title" style="line-height:50px;">手机:</span>
                                    <div class="input" style="margin-top:-2px;"><cInput label="手机" ref="phoneNum" :blnDisabled="blnEdit" reg="^((1[3|4|5|7|8][0-9]{9})|([\s]*))$" tip="非法手机号" @change="mobileChange" :val="mobile" /></div>
                                </div>
                                <div class="item clearfix">
                                    <span class="title" style="line-height:50px;">MAC:</span>
                                    <div class="input" style="margin-top:-2px;"><cInput label="MAC" ref="macNum" :blnDisabled="blnEdit" reg="^((([A-Fa-f0-9]{2}-){5}[A-Fa-f0-9]{2})|([\s]*))$" tip="非法MAC" @change="macChange" :val="mac" /></div>
                                </div>
                                <div class="item clearfix">
                                    <span class="title" style="line-height:50px;">人员类型:</span>
                                    <div class="input" style="padding-top:10px;"><MulSelect ref="relativePerson" :defaultVal="defTypes" :selItems="types" :blnDel="true" @add="addPersonType" @del="delPersonType" keyid="key_identity_type_id" /></div>
                                </div>
                                <div class="item clearfix" style="line-height:50px;colro:gray;" title="短信报警接口还未接入!">
                                    <span class="title" style="line-height:50px;">关注方式:</span>
                                    <div class="input select">
                                        <el-checkbox-group v-model="follows">
                                            <el-checkbox v-for="item in atten_way" disabled :label="item.val">{{item.name}}</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                </div>
                                <div class="item clearfix">
                                    <div style="display:inline-block;cursor:pointer;" v-if="follows.indexOf('sms')>=0" @click="setSmsPolice()">
                                        <i class="fa fa-plus" style="margin-right:5px;"></i><span style="font-size:12px;">短信报警相关配置</span>
                                    </div>
                                </div>
                                <div class="option_bar">
                                    <button type="button" class="btn btn-success" style="font-size:12px;"  @click="submit">
                                        <i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i><span v-show="!blnSearch">确定</span>
                                    </button> 
                                    <button type="button" class="btn btn-default" style="font-size:12px;" @click="cancel">取消</button>
                                </div>
                            </div>
                            <div slot="t1" style="height:100%;width:100%;">
                                <div :id="'cpop'+fileId" style="width:100%;height:250px;position:relative;text-align:center;">
                                    <input  :id="'c'+fileId" :data-url="url" multiple type="file" style="width: 0px;position: absolute;top: 0px;right: 0px;bottom: 0px;margin: 0px;opacity: 0;direction: ltr;cursor: pointer;" />
                                    <i class="fa fa-cloud-upload" style="font-size: 150px;color: gray;/*! text-align: center; */margin-top: 40px;"></i>
                                    <div style="position:absolute;bottom:0px;text-align:center;width:100%;" v-show="!uploadInfo">将文件拖拽至此，或<span @click="addFiles()" style="color:red;cursor:pointer;">点击此处</span>上传</div>
                                    <div style="position:absolute;bottom:0px;text-align:center;width:100%;" v-show="uploadInfo">{{uploadInfo}}</div>
                                    <div style="text-align:center;">
                                        <el-checkbox-group v-model="follows" style="display:inline-block;">
                                            <el-checkbox label="sms" @change="smsChange" disabled>开启短信报警</el-checkbox>
                                        </el-checkbox-group>
                                        <span v-show="follows.indexOf('sms')>=0" style="margin-left:10px;font-size: 12px;cursor:pointer;" @click="setSmsPolice()">(设置)</span>
                                    </div>
                                
                                </div>
                                <div style="text-align:right;width:100%;color:gray;font-size:12px;cursor:pointer;" @click="uploadFormat()">*文件上传标准</div>
                                <div style="text-align:right;margin-top:10px;padding:0px 10px;border-top:1px solid #e7eaec;padding:5px 0px;">
                                        <button type="button" class="btn btn-success" style="font-size:12px;" @click="addBatchPerson()">完成</button>
                                        <button type="button" class="btn btn-default" style="font-size:12px;" @click="cancel()">关闭</button>
                                </div>
                            </div>
                        </HTag>
                      </div>`;
            let param={
                title:valup?'修改人员':'添加人员',
                content:html,
                area:'600px',
                components:{cInput,MulSelect,HTag},
                context:{
                    url:ser.uri+'/upload/file',//上传地址
                    fileId:tool.guid(),
                    uploadInfo:'',
                    pages:[{name:'手动添加',icon:'fa fa-tag'},{name:'批量导入',icon:'fa fa-tag',disable:false,tip:''}],
                    blnEdit:!!valup,
                    crertKinds:[],//证件类型集合数据
                    blnSearch:false,//是否正在执行新增操作
                    name:valup?valup.key_identity_name:'',//姓名
                    cert:valup?valup.key_identity_cert:'',//身份证
                    mobile:valup?valup.key_identity_mobile:'',//手机
                    mac:valup?valup.key_identity_mac:'',//mac地址
                    crert_kind:valup?valup.crert_kind:'',//证件类型
                    types:self.kindData,//重点人员类型
                    defTypes:valup?_.filter(_.map(valup.key_identity_types,i=>{
                        return _.find(self.kindData,item=>{return item.key_identity_type_id==+i});
                    }),r=>r): _.find(self.kindData,s=>s.name=='普通人员')?[_.find(self.kindData,s=>s.name=='普通人员')]:[],  //默认重点人员类型
                    follows:valup?_.map(_.filter(_.map(valup.alarm_account || {},(r,key)=>{return {key:r};}),(i,k)=>i[k]),(v,j)=>j):[],//关注方式
                    alarm_account:valup?valup.alarm_account || {} : {},//报警方式
                    sms_format:'',//短信格式
                    sms_phone:[],//短信电话号码
                    atten_way:AttenType,
                    nameChange(val){param.selfData.name=val;},
                    certChange(val){param.selfData.cert=val;},
                    mobileChange(val){param.selfData.mobile=val;},
                    macChange(val){param.selfData.mac=val;},
                    addPersonType(val){
                        self.$store.dispatch(AddIdentity,{key_identity_type_title:val[0].name,key_identity_type_note:val[0].note}).then(res=>{
                            if(res.msg.code!='successed')return;
                            val[0].law_case_id=res.biz_body[0].key_identity_type_id;
                            val[0].key_identity_type_id=res.biz_body[0].key_identity_type_id;
                            param.selfData.types.push({name:val[0].name,note:val[0].note,key_identity_type_id:res.biz_body[0].key_identity_type_id});

                        });
                    },
                    //删除人员类型
                    delPersonType(val){
                        self.$store.dispatch(DelIndentity,val.key_identity_type_id).then(res=>{
                            if(!tool.msg(res,'删除类型成功!','删除类型失败!'))return;
                            // console.log(Fx.Clone(param.selfData.types));
                            // console.log(val.key_identity_type_id);
                            // let index = _.findIndex(param.selfData.types,type=>{return type.key_identity_type_id==val.key_identity_type_id;});
                            // console.log(index);
                            //param.selfData.types.splice(index,1);
                        });
                    },
                    //设置短信报警相关信息
                    setSmsPolice(){
                        let data=tool.Clone(valup?valup.alarm_account?valup.alarm_account.sms:{}:{});
                        data.format=param.selfData.sms_format || data.format;
                        data.phone=param.selfData.sms_phone.length>0? param.selfData.sms_phone : data.phone;

                        self.setSmsPolice(data).then(res=>{
                            param.selfData.sms_format=res.format;
                            param.selfData.sms_phone=res.phone;
                        });
                    },
                    submit(){
                        let data=param.selfData;
                        if(data.blnSearch){return;}
                        //验证数据是否符合要求
                        if(!param.$refs.certNum.Valid()){return;}
                        if(!param.$refs.phoneNum.Valid()){return;}
                        if(!param.$refs.macNum.Valid()){return;}
                        if(!data.cert && !data.mobile && !data.mac){tool.info('证件号、手机、MAC至少填一项!'); return;}

                        data.blnSearch=true;
                        
                        let personTypes = _.map(param.$refs.relativePerson.$data.data,item=>{return item.key_identity_type_id+'';});//人员类型ID集合
                        
                        let alarm_way={
                            sms:(','+data.follows.join(',')+',').indexOf(',sms,')>=0?{phone:data.sms_phone,format:data.sms_format}:null
                        };//报警方式具体联络地址
                        if(!alarm_way.sms){delete alarm_way.sms;}

                        
                        let temp={
                            key_identity_name:data.name,
                            key_identity_cert:data.cert,
                            key_identity_mobile:data.mobile,
                            key_identity_mac:data.mac,
                            key_identity_types:personTypes,
                            follows:data.follows,
                            alarm_account:alarm_way,
                        };
                        
                        if(valup){//修改
                            let updateTemp={
                                key_identity_id:valup.key_identity_id,
                                key_identity_name:data.name,
                                key_identity_cert:data.cert,
                                key_identity_mobile:data.mobile,
                                key_identity_types:personTypes,
                                follows:data.follows,
                                alarm_account:alarm_way,
                                key_identity_mac:data.mac,
                            }
            
                            self.$store.dispatch(UpdateIdenPerson,updateTemp).then(res=>{
                                data.blnSearch=false;
                                if(res.msg.code!='successed')return;
                                valup.key_identity_types = updateTemp.key_identity_types;
                                valup.follows=updateTemp.follows;
                                valup.alarm_account=updateTemp.alarm_account;
                                valup.key_identity_mac=updateTemp.key_identity_mac;
                                valup.key_identity_name=updateTemp.key_identity_name;
                                valup.key_identity_cert=updateTemp.key_identity_cert;
                                valup.key_identity_mobile=updateTemp.key_identity_mobile;

                                self.converPersons([valup]);

                                tool.info('修改成功!');
                                param.close();
                            });

                        }else{//新增
                            self.$store.dispatch(AddIdenPerson,temp).then(res=>{
                                data.blnSearch=false;
                                if(res.msg.code!='successed')return;
                                temp.key_identity_id=res.biz_body.key_identity_id;
                                temp.log_time=res.biz_body.log_time;
                                temp.account=res.biz_body.account || tool.cookie.get('account');

                                self.person_data.unshift(self.converPersons([temp])[0]);

                                tool.info('添加成功!');
                                param.close();
                            });
                        }
                    },
                    cancel(){param.close();},
                    //批量上传文件短信报警复选框值改变事件
                    smsChange(){
                        //判断是否包含开启短信设置项
                        if(param.selfData.follows.indexOf('sms')<0)return;
                        param.selfData.setSmsPolice();
                    },
                    //显示文件上传格式页面
                    uploadFormat(){
                        tool.open(function(){
                            let html=`
                                <div style="padding:15px;">
                                    <div>标准示例:</div>
                                    <div class="table_header" style="border-top:1px solid #ebedee;border-left:1px solid #ebedee;">
                                        <div class="row">
                                            <div class="column" style="width:100px;">姓名</div>
                                            <div class="column" style="width:120px;">证件号</div>
                                            <div class="column" style="width:150px;">手机号</div>
                                            <div class="column" style="width:120px;">MAC</div>
                                            <div class="column" style="">人员类型</div>
                                        </div>
                                    </div>
                                    <div class="table_body">
                                        <div class="table_conatienr" style="border-left:1px solid #ebedee;">
                                            <div class="row">
                                                <div class="column" style="width:100px;">张三</div>
                                                <div class="column" style="width:120px;">500135119XXXXXX</div>
                                                <div class="column" style="width:150px;">138XXXXXXXX</div>
                                                <div class="column" style="width:120px;">2A-2B-2C-2D-2X-2C</div>
                                                <div class="column" style="">普通人员</div>
                                            </div>
                                            <div class="row">
                                                <div class="column" style="width:100px;">李四</div>
                                                <div class="column" style="width:120px;">500135119XXXXXX</div>
                                                <div class="column" style="width:150px;">138XXXXXXXX</div>
                                                <div class="column" style="width:120px;">2A-2B-2C-2D-2X-2C</div>
                                                <div class="column" style="">普通人员</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="margin-top:15px;">说明:</div>
                                    <div style="margin:8px 30px;">1.列分隔符:\\t</div>
                                    <div style="margin:8px 30px;">2.行分隔符:\\n</div>
                                    <div style="margin:8px 30px;">3.字符集:gbk</div>
                                </div>
                            `;
                            let param={
                                    title:'上传格式',
                                    content:html,
                                    area:'800px',
                                    context:{
                                    }
                            };

                            return param;

                        }());
                    },
                    //添加上传文件
                    addFiles(){
                        let s=param.selfData,uploadEl=$('#c'+s.fileId);
                        uploadEl.click();
                    },
                    initUpload(){
                        let s=param.selfData,dropbox=$('#cpop'+s.fileId);
                        //阻止文件拖入浏览器后打开新页面
                        dropbox.bind("dragenter", function(e){ 
                            e.stopPropagation(); 
                            e.preventDefault(); 
                        }, false);  
                        dropbox.bind("dragover", function(e){ 
                            e.stopPropagation(); 
                            e.preventDefault(); 
                        }, false); 
                        dropbox.bind("drop", function(e){ 
                            e.stopPropagation(); 
                            e.preventDefault(); 
                        }, false); 
                        
                        $('#c'+s.fileId).fileupload({
                            dataType:'json',
                            dropZone:$('#cpop'+s.fileId),
                            autoUpload:false,
                            add:function(e,data){
                                if(s.uploadInfo){tool.info('正在上传文件,请稍后再试!');return false;}
                                var file=data.files[0];//上传文件
                                if(!file.name.match(s.allowType)){
                                    tool.info('文件格式','只允许上传(gif|jpe|jpeg|png|txt|doc|docx|xls|xlsx|rar|zip|pdf)格式文件!');
                                    return;
                                }

                                let alarm_way={
                                    sms:(','+s.follows.join(',')+',').indexOf(',sms,')>=0?{phone:s.sms_phone,format:s.sms_format}:null
                                };//报警方式具体联络地址
                                if(!alarm_way.sms){delete alarm_way.sms;}

                                data.formData ={code:'key_identity',
                                                user_id:tool.cookie.get('userid'),
                                                follows:s.follows,
                                                alarm_account:alarm_way};
                                data.submit();
                                return;
                            },
                            done:function(e,data){
                                s.uploadInfo='';
                                if(data.result.msg.code!='successed'){
                                    tool.info(data.result.msg.node);
                                    return;
                                }else{
                                    tool.info('文件上传成功!');
                                }
                            },
                            progressall: function (e, data) {
                                // var progress = parseInt(data.loaded / data.total * 100, 10);
                                s.uploadInfo='正在上传,请耐心等待...';
                            }
                        });
                    },
                },
                 success(){
                    param.selfData.initUpload();
                },
            };
            
            return param;
          }());
      },
      //人员详细
      person_detail(data){
          let s=this;
          tool.open(function(){
              let html=`
                <div style="width:100%;height:100%;">
                    <div style="padding:10px;">
                        <div style="padding-left:5px;line-height:30px;">高危人员信息</div>
                        <div class="table_header" style="border-top:1px solid #ebedee;border-left:1px solid #ebedee;">
                            <div class="row">
                                <div class="column" style="width:100px;"><span class="divEllipsis" style="width:100px;">报警姓名</span></div>
                                <div class="column" style="width:150px;"><span class="divEllipsis" style="width:150px;">人员类型</div>
                                <div class="column" style="width:240px;"><span class="divEllipsis" style="width:240px;">证件号</div>
                                <div class="column" style="width:120px"><span class="divEllipsis" style="width:120px;">手机号</span></div>
                                <div class="column" style="width:150px"><span class="divEllipsis" style="width:150px;">MAC</span></div>
                            </div>
                        </div>
                        <div class="table_body">
                            <div class="table_conatienr" style="border-left:1px solid #ebedee;">
                                <div class="row">
                                    <div class="column" style="width:100px;" :title="d.key_identity_name"><span class="divEllipsis" style="width:100px;">{{d.key_identity_name}}</span></div>
                                    <div class="column" style="width:150px;" :title="d.personType"><span class="divEllipsis" style="width:150px;">{{d.personType}}</span></div>
                                    <div class="column" style="width:240px;" :title="d.key_identity_cert"><span class="divEllipsis" style="width:240px;">{{d.key_identity_cert}}</span></div>
                                    <div class="column" style="width:120px"  :title="d.key_identity_mobile"><span class="divEllipsis" style="width:120px;">{{d.key_identity_mobile}}</span></div>
                                    <div class="column" style="width:150px"  :title="d.key_identity_mac"><span class="divEllipsis" style="width:150px;">{{d.key_identity_mac}}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="border-top:1px solid #ebedee;"></div>
                    <div style="padding:10px;">
                        <div style="padding-left:5px;line-height:30px;">报警记录</div>
                    </div>
                    <div class="table_header" style="border-top:1px solid #ebedee;border-left:1px solid #ebedee;">
                        <div class="row">
                            <div class="column" style="width:150px;"><span class="divEllipsis" style="width:150px;">报警时间</span></div>
                            <div class="column" style="width:120px;"><span class="divEllipsis" style="width:120px;">触发类型</span></div>
                            <div class="column" style="width:150px"><span class="divEllipsis" style="width:150px;">证件号</span></div>
                            <div class="column" style="width:120px;"><span class="divEllipsis" style="width:120px;">手机</span></div>
                            <div class="column" style="width:150px;"><span class="divEllipsis" style="width:150px;">MAC</span></div>
                            <div class="column" style="width:110px;"><span class="divEllipsis" style="width:90px;">报警场所</span></div>
                        </div>
                    </div>
                    <div class="table_body" style="height:300px;">
                        <Scroll :listen="police_data" :store="store">
                            <div class="table_conatienr">
                                <template v-for="d in police_data">
                                    <div class="row">
                                        <div class="column" style="width:150px;" :title="d.policeTime"><span class="divEllipsis" style="width:151px;">{{d.policeTime}}</span></div>
                                        <div class="column" style="width:120px;" :title="d.policy_type"><span class="divEllipsis" style="width:120px;">{{d.policy_type}}</span></div>
                                        <div class="column" style="width:150px;" :title="d.certificate_code"><span class="divEllipsis" style="width:150px;">{{d.certificate_code && d.certificate_code.length>11?d.certificate_code:'' }}</span></div>
                                        <div class="column" style="width:120px;" :title="d.mobile"><span class="divEllipsis" style="width:120px;">{{d.mobile}}</span></div>
                                        <div class="column" style="width:150px;" :title="d.mac"><span class="divEllipsis" style="width:150px;">{{d.mac}}</span></div>
                                        <div class="column" style="width:110px;" :title="d.netbar_name"><span class="divEllipsis" style="width:90px;">{{d.netbar_name}}</span></div>
                                    </div>
                                </template>
                            </div>
                        </Scroll>
                    </div>
                </div>
              `;
              let param={
                        title:'报警记录详情',
                        content:html,
                        area:'800px',
                        components:{Scroll},
                        context:{
                            store:s.$store,
                            d:data,
                            police_data:[],
                        },
                        success(){
                             s.$store.dispatch(GetIdenPersonDetail,{id:data.key_identity_id,limit:0}).then(res=>{
                                 param.selfData.police_data=res.biz_body;
                             });
                        }
                };

            return param;
          }());
      },
      converTime(time){
        return tool.DateByTimestamp(time,'yyyy-MM-dd mm:hh:ss');
      }
  }
}
</script>
<style>
  .addPerson_Pop {padding:0px 10px;height:100%;}
  .addPerson_Pop .item .title{float:left;line-height:@pop_itemH;width:70px;text-align:center;}
  .addPerson_Pop .item .input{margin-left:70px;}
  .addPerson_Pop .item .input.select{line-height:@pop_itemH;}
  .addPerson_Pop .option_bar{text-align: right;margin: 10px 0px;}
</style>

<style scoped lang="less">
@import "../css/variables.less";
.HighRisk{width:100%;height:100%;padding:5px;}
.HighRisk .c_container{background-color:@FrontCol;width:100%;height:100%;position:relative;}

.HighRisk .option_bar{.border('bottom');line-height:40px;text-align:left;padding:0px 15px;}
.HighRisk .option_bar .item{display: inline-block;margin-right: 10px;}

.HighRisk .content_container{height:~'calc(100% - 40px)';width:100%;}

@kindBarW:0px;
.HighRisk .kind_bar{width:@kindBarW;height:100%;float:left;display:none;}
.HighRisk .list_bar{width:~'calc(100% - @{kindBarW})';height:100%;.border('left');margin-left:@kindBarW;}

@kindShowH:40px;
.HighRisk .kind_bar .btn_bar{width:100%;height:@kindShowH;.border('bottom');text-align:left;}
.HighRisk .kind_bar .btn_bar .item{display:inline-block;width:50%;height:100%;font-size:12px;text-align:center;line-height:@kindShowH;.border('right');}
.HighRisk .kind_bar .btn_bar .item:last-child{border:0px;}
.HighRisk .kind_bar .btn_bar .item:hover{color:white;cursor:pointer;}
html{.TCol(~".HighRisk .kind_bar .btn_bar .item:hover",'bg');}

.HighRisk .kind_bar .kind_show_bar{width:100%;height:~'calc(100% - @{kindShowH})';}
.HighRisk .kind_bar .kind_show_bar .item{height:50px;line-height:50px;text-align:center;font-size:12px;.border('bottom');}

.HighRisk .action_bar{position:absolute;width:100%;height:40px;line-height:40px;text-align:right;}

//.HighRisk .tag_label:hover{color:@Font_Hover_Col;}
html{.TCol(~".HighRisk .tag_label:hover");}

//列表显示样式
@header_H:40px;
@gainCol:#019cdc;
@collectCol:#85c226;
@resultCol:#f8c301;
.HighRisk .table_header{height:@header_H;display:table;width:100%;border:none;color:white;}
html{.TCol(~".HighRisk .table_header .row",'bg');}

.HighRisk .table_header .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
.HighRisk .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;.border('bottom');}
.HighRisk .table_header .column .sort_item .triangle-up:hover{cursor:pointer;}
html{.TCol(~".HighRisk .table_header .column .sort_item .triangle-up:hover",'bbc');}

.HighRisk .table_header .column .sort_item .triangle-down:hover{cursor:pointer;}
html{.TCol(~".HighRisk .table_header .column .sort_item .triangle-down:hover",'btc');}

//.HighRisk .table_header .column .sort_item .triangle-up.active{border-bottom-color:@Font_Hover_Col;}
html{.TCol(~".HighRisk .table_header .column .sort_item .triangle-up.active",'bbc');}

//.HighRisk .table_header .column .sort_item .triangle-down.active{border-top-color:@Font_Hover_Col;}

html{.TCol(~".HighRisk .table_header .column .sort_item .triangle-down.active",'btc');}

.HighRisk .table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";.border('bottom');}
.HighRisk .table_conatienr{width:100%;display:table;width:100%;border:none;}
.HighRisk .table_conatienr .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}

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

.openSMS{color:@Font_Hover_Col;}
html{.TCol(~".openSMS");}
.closeSMS{color:gray;}

.overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}
</style>
