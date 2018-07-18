<!-- 报警布控页面组件 -->
<template>
    <div class="DeployContrl">
      <!--报警-->
      <div class="page" v-show="curSelCase.val==-1">
        <div :style="{height:params.blnNoCaseHide?'100%':alarmShow?alarmNoShow?'50%':'calc(100% - 52px)':'auto'}">
          <HList title="案侦报警" ref="alarm"  :class="{hasPage:curSelCase.val==-1,noPage:curSelCase.val!=-1}" :action="params.blnNoCaseHide?[]:[ctlaction[0],ctlaction[2]]" :data="alarmData" :header="alarmHeader" :column="alarmColumn" :showField="alarmShowField" :rowAction="[{name:'详细',action:'lookDetail',icon:'fa fa-plus'}]"
          :searchAction="alarmSearchAction" @updateCase="updateCase" @delPolicy="delPolicy" @searchAlarmKey="searchAlarmKey" @lookDetail="lookDetail" @delCase="delCase" :blnNoSel="blnNoSel"
          :expan="blnexpan" @addControl="addControl" @delControl="delControl" @exportList="exportList" @addCase="addCase" :blnLoading="alarmLoading"
          :tag_action="params.blnNoCaseHide?[]:kinds.slice(0,2)" @kindchange="kindchange" @personchange="personchange" @showChange="alarmShowFunc" @pageChange="pageChange" :pageNum="pageNum" :store="store"
          />
        </div>
        <div :style="{height:alarmShow?'50%':'calc(100% - 52px)'}" v-show="!params.blnNoCaseHide">
          <HList title="非案侦报警" ref="alarmNo" :class="{hasPage:curSelCase.val==-1,noPage:curSelCase.val!=-1}" :action="[noctlaction[0]]" :data="alarmNoData" :header="alarmHeader" :column="alarmColumn" :showField="alarmShowField" :rowAction="[{name:'详细',action:'lookDetail',icon:'fa fa-plus'}]"
          :searchAction="alarmSearchActionNoCase" @updateCase="updateCase" @delPolicy="delPolicy" @exportListNo="exportListNo" @searchAlarmKeyNoCase="searchAlarmKeyNoCase" @lookDetail="lookDetail" @delCase="delCase" :blnNoSel="blnNoSel"
          :expan="blnexpan" @addControl="addControl" @delControl="delControl" @addCase="addCase" @pageChange="alarmNoPageChange" :pageNum="alarmNoPageNum"
          @showChange="alarmNoShowFunc" :store="store"
          />
        </div>
      </div>
      <!--策略(布控)-->
      <div class="page" v-show="curSelCase.val==0">
        <div :style="{height:params.blnNoCaseHide?'100%':ctlShow?ctlNoShow?'50%':'calc(100% - 52px)':'auto'}">
          <HList title="案侦布控" ref="policy" :blnNoPage="false" :class="{hasPage:curSelCase.val==-1,noPage:curSelCase.val!=-1}" :action="ctlaction" :data="ctlData" :header="ctlHeader" :column="ctlColumn" :showField="ctlShowField" :rowAction="ctlRowAction"
          :searchAction="ctlSearchAction" @updateCase="updateCase" @delPolicy="delPolicy" @seachPolicyName="seachPolicyName" @lookDetail="lookDetail" @delCase="delCase" :blnNoSel="blnNoSel"
          :expan="blnexpan" @addControl="addControl" @delControl="delControl" @exportList="exportList" @addCase="addCase" @pageChange="ctrlPageChange" :pageNum="ctlPageNum" 
          :tag_action="kinds.slice(0,2)" @kindchange="kindchange" :check_action="items" @personchange="personchange"  @showChange="ctlShowFunc" :store="store"
          />
        </div>
        <div :style="{height:ctlShow?'50%':'calc(100% - 52px)'}" v-show="!params.blnNoCaseHide">
          <HList title="非案侦布控" ref="policyNo" :blnNoPage="false" :class="{hasPage:curSelCase.val==-1,noPage:curSelCase.val!=-1}" :action="[]" :data="ctlNoData" :header="ctlHeader" :column="ctlColumn" :showField="ctlShowField" :rowAction="ctlRowAction"
          :searchAction="ctlSearchActionNoCase" @updateCase="updateCase" @delPolicy="delNoPolicy" @searchPolicyNameNoCase="searchPolicyNameNoCase" @lookDetail="lookDetail" @delCase="delCase" :blnNoSel="blnNoSel"
          :expan="blnexpan" @addControl="addControl" @delControl="delControl" @addCase="addCase"
           @pageChange="ctrlNoPageChange" :pageNum="ctlNoPageNum"  @showChange="ctlNoShowFunc" :store="store"
          />
        </div>
      </div>
      <!--案件-->
      <div class="page" v-show="curSelCase.val==1">
        <div :style="{height:caseShow?'50%':'100%'}">
          <HList title="案侦案件" ref="case" :blnNoPage="true" :class="{hasPage:curSelCase.val==-1,noPage:curSelCase.val!=-1}" :action="[ctlaction[0]]" :data="caseInfos" :header="caseHeader" :column="caseColumn" :showField="caseShowField" :rowAction="caseRowAction"
          :searchAction="caseSearchAction" @updateCase="updateCase" @delPolicy="delPolicy" @searchCase="searchCase" @lookDetail="lookDetail" @delCase="delCase" :blnNoSel="true"
          :expan="blnexpan" @addControl="addControl" @delControl="delControl" @addCase="addCase" @rowClick="rowClick" :blnRowClick="true"
          :tag_action="kinds" @kindchange="kindchange" @personchange="personchange" @pageChange="pageChange" :pageNum="pageNum" :store="store"
          />
        </div>
        <!--案件关联详细-->
        <div :style="{height:caseShow?'50%':'0%',display:caseShow?'block':'none'}" class="case_detail">
          <div class="left">
            <div class="title">关联布控<span>{{caseRelationCtl.length}}</span></div>
            <div class="info">
              <scroll :listen="caseRelationCtl" ref="caseCtlScroll" :store="store">
                <div class="info_item" :title="c.policy_title" :class="{active:(caseCurCtl || {policy_id:-1}).policy_id==c.policy_id}" v-for="(c,index) in caseRelationCtl" @click="case_detail_infoClick(c)">{{index+1}}.{{c.policy_title}}</div>
              </scroll>
            </div>
          </div>
          <div class="right">
            <HList title="" ref="alarmRigt"  :class="{hasPage:curSelCase.val==-1,noPage:curSelCase.val!=-1}" :action="[]" :data="caseAlarmData" :header="alarmHeader" :column="alarmColumn" :showField="alarmShowField" :rowAction="[]"
              :searchAction="[]" @updateCase="updateCase" @delPolicy="delPolicy" @seachPolicyName="seachPolicyName" @lookDetail="lookDetail" @delCase="delCase" :blnNoSel="true"
              :expan="blnexpan" @addControl="addControl" @delControl="delControl" @addCase="addCase"
              @personchange="personchange" @pageChange="caseAlarmPageChange" :pageNum="caseAlarmPageNum" :blnLoading="alarmRigtLoading" :store="store"
              />
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import cSelect from 'components/Select'
import HList from 'components/HList'
import cInput from 'components/Input'
import MulSelect from 'components/MulSelect'
import PolicyType from '../enum/PolicyType'
import AlarmType from '../enum/AlarmType'
import scroll from 'components/scroll'
import addPop from '../modules/case/addPop.js'

import {GetCase,AddCase,AddPolicy,GetPolicy,DelPolicy,UpdateCase,GetPolicyDetail,
        DelCase,GetAlarmMobile,AddAlarmMobile,DelAlarmMobile,BODY_RESIZE,ExportPolicy,ExportPolicyLog} from '../store/mutation-types'

export default {
  name: 'DeployContrl',
  props:['params','store'],
  data () {
    return {
      pageNum:0,//当前报警数据源页号
      alarmNoPageNum:0,//当前非报警数据源页面分页
      caseAlarmPageNum:0,//案件详细报警分页
      showNum:10,//每页显示条数
      rowAction:[],
      searchAction:[],//搜索操作项
      caseInfos:[],//案件信息
      mobiles:[],//报警电话信息
      items:[{name:'只看我的布控',val:1,action:'personchange'}],
      kinds:[{name:'报警',val:-1,icon:'fa fa-exclamation-triangle',action:'kindchange'},
             {name:'布控',val:0,icon:'fa fa-sitemap',action:'kindchange'},
             {name:'案件',val:1,icon:'fa fa-suitcase',action:'kindchange'}
             ],
      ctlaction:[
              {name:'添加布控',action:'addControl',icon:'fa fa-plus'},
              {name:'撤销布控',action:'delControl',icon:'fa fa-remove'},
              {name:'导出',action:'exportList',icon:'fa fa-level-up'}
            ],
      noctlaction:[{name:'导出',action:'exportListNo',icon:'fa fa-level-up'}],//非案件导出
      ctlRowAction:[{name:'撤销',action:'delPolicy',icon:'fa fa-plus'}],
      ctlSearchAction:[{name:'布控名称',action:'seachPolicyName'}],//布控(案件)名称搜索
      ctlSearchActionNoCase:[{name:'布控名称',action:'searchPolicyNameNoCase'}],//布控(非案件)名称搜索
      curSelPerson:{name:'所有布控',val:0},
      curSelCase:{name:'显示布控',val:-1},
      //报警查询条件
      alarmSearch:'',
      //非案件报警查询条件
      alarmNoSearch:'',
      //报警数据请求中
      alarmLoading:false,
      //报警头部
      alarmHeader:['报警时间','关键字','所属案件','姓名','证件类型','证件号','报警地点','报警来源','采集类型'],
      //报警对应数据显示字段
      alarmShowField:'logtime,keywords,law_case_title,customer_name,certificate_type,certificate_code,netbar_title,source_type,microprobe_type',
      //报警列配置
      alarmColumn:[
        {width:200,align:'center'},{width:200,align:'center'},{width:200,align:'center'},{width:100,align:'center'},
        {width:100,align:'center'},{width:250,align:'center'},{width:100,align:'center',color:'rgb(3, 171, 103)',click:this.alarmAddressClick},{width:150,align:'center'},{width:100,align:'center'}
      ],
      alarmSearchAction:[{name:'关键字',action:'searchAlarmKey'}],//报警(案件)关键字搜索
      alarmSearchActionNoCase:[{name:'关键字',action:'searchAlarmKeyNoCase'}],//报警(非案件)关键字搜索
      //报警控件是否显示
      alarmShow:true,
      //非报警控件是否显示
      alarmNoShow:true,
      //报警数据
      alarmData:[],
      //非案件报警数据
      alarmNoData:[],
      //策略头部信息
      ctlHeader:['布控名称','布控类型','布控关键字','报警方式','布控时间','报警结果','所属案件'],
      ctlShowField:'_name,_type,_keys,_alarm_type,_log_time,total,law_cases',
      //策略列配置
      ctlColumn:[
        {width:200,align:'center'},{width:120,align:'center'},{width:0,align:'center'},{width:200,align:'center'},{width:200,align:'center'},{width:200,align:'center'},{width:200,align:'center'}
      ],
      //策略控件是否显示
      ctlShow:true,
      //非案件策略控件是否显示
      ctlNoShow:true,
      //策略数据
      ctlData:[],
      //非关联案件策略数据
      ctlNoData:[],
      ctlNoCacheData:[],//非关联案件策略缓存数据
      ctlCacheData:[],//策略缓存数据
      ctlPageNum:0,
      ctlNoPageNum:0,
      //案件数据:
      caseHeader:['案件名','案件描述','立案人','立案时间','布控数','报警数'],
      caseShowField:'name,note,user,time,ctlNum,alarmNum',
      caseColumn:[
        {width:200,align:'center'},{width:0,align:'center'},{width:150,align:'center'},{width:200,align:'center'},{width:80,align:'center'},{width:80,align:'center'}
      ],
      caseAction:[],//[{name:'添加案件',action:'addCase',icon:'fa fa-plus'},],
      caseRowAction:[{name:'修改',action:'updateCase',icon:'fa fa-plus'},{name:'删除',action:'delCase',icon:'fa fa-plus'}],
      caseSearchAction:[{name:'案件名称',action:'searchCase'}],//案件名称搜索
      caseShow:false,//是否显示案件详细信息
      caseRelationCtl:[],//案件关联布控数据
      caseAlarmData:[],//案件关联策略关联报警数据
      caseCurCtl:null,//案件详细当前选中的布控对象
      //是否展开子项
      blnexpan:false,
      blnNoSel:false,//是否不显示多选框
      alarmRigtLoading:false,//判断数据是否正在加载中
      law_case_id:'',//案件ID用于过滤显示条件
      PolicyNameNoCase:'',
      PolicyName:'',
      bodyResizeSub:null,
    }
  },
  mounted(){
 
    this.$store=this.$store || this.store;

    if(this.params){
      this.law_case_id=this.params.model._law_case_id;
    }

    this.personchange();
    this.kindchange(this.kinds[0]);
    //加载数据
    this.loadData();

    // this.$store.commit(BODY_RESIZE,()=>{
    //   this.adjustColumnW();
    // });

    this.$store.commit(BODY_RESIZE,{cb:(sub)=>{
       this.bodyResizeSub=sub
    },sub:()=>{
      this.adjustColumnW();
    }});

    this.adjustColumnW();
  },
  beforeDestroy(){
    this.bodyResizeSub.unsubscribe();
  },
  methods:{
    //刷新页面
    refreshPage(){
      this.loadData();
    },
    //加载页面相关数据
    loadData(){
      //获取报警数据(案件)
      this.getAlarmData(false,'','',undefined,true,this.law_case_id);
      //获取报警数据(非案件)
      this.getAlarmData(false,'','alarmNoData','alarmNoPageNum',false,this.law_case_id);

      //获取案件信息
      this.$store.dispatch(GetCase,{law_case_id:this.law_case_id}).then(res=>{
        if(res.msg.code!='successed')return;
        let temp=[];
        this.caseInfos=this.converCaseData(res.biz_body);
      });

      //获取报警电话信息
      this.$store.dispatch(GetAlarmMobile).then(res=>{
        if(res.msg.code!='successed')return;
        this.mobiles=res.biz_body;
        if(res.biz_body.length>0){
          this.mobiles=_.map(res.biz_body,item=>{return {id:item.id,name:`${item.contact_name}`,contact_name:item.contact_name,mobile:item.mobile,children:[]}});
        }
      });

      //获取策略信息(包含案件)
      this.ctrlPageChange(0);
      
      //获取策略信息(不包含案件)
      this.ctrlNoPageChange(0);
    },
    //导出列表数据(案件相关)
    exportList(){
        let policeParam={
          law_case_id:this.law_case_id,
          is_lawpolicy:true,
          keywords:this.alarmSearch,
        },
        personParam={
          user_id:this.curSelPerson.val?ser.baseBag.userid:'',
          policy_title:this.PolicyName,
          is_lawpolicy:true,
          law_case:this.law_case_id,

        };

        this.$store.dispatch(this.curSelCase.val==-1?ExportPolicyLog:ExportPolicy,this.curSelCase.val==0?policeParam:personParam
        ).then(res=>{
            if(!tool.msg(res,'导出成功!','导出失败!')) return;
            if(!res.biz_body.url) return;
            window.location=res.biz_body.url;
      });
    },
    //导出列表数据(非案件相关)
    exportListNo(){
      let policeParam={
          law_case_id:this.law_case_id,
          is_lawpolicy:false,
          keywords:this.alarmNoSearch,
        },
        personParam={
          user_id:this.curSelPerson.val?ser.baseBag.userid:'',
          policy_title:this.PolicyNameNoCase,
          is_lawpolicy:false,
          law_case:this.law_case_id,

        };
        this.$store.dispatch(this.curSelCase.val==-1?ExportPolicyLog:ExportPolicy,this.curSelCase.val==0?policeParam:personParam
        ).then(res=>{
            if(!tool.msg(res,'导出成功!','导出失败!')) return;
            if(!res.biz_body.url) return;
            window.location=res.biz_body.url;
      });
    },
    //布控分页
    ctrlPageChange(pageNum){
      this.ctlPageNum=pageNum>0? pageNum : 0;

      //获取策略信息(包含案件)
      this.$store.dispatch(GetPolicy,{user_id:this.curSelPerson.val?ser.baseBag.userid:'',
                          policy_title:this.PolicyName,
                          blnCase:true,
                          law_case:this.law_case_id,
                          limit:this.showNum,
                          skip:this.ctlPageNum*this.showNum
      }).then(res=>{
        if(res.msg.code!='successed')return;
        //转换显示效果
        let data=this.converShowData(res.biz_body);
        this.ctlCacheData=data;
        this.ctlData =tool.Clone(this.ctlCacheData);
      });
      
    },
    //布控非案件分页
    ctrlNoPageChange(pageNum){
      this.ctlNoPageNum=pageNum>0? pageNum : 0;
      this.$store.dispatch(GetPolicy,{user_id:this.curSelPerson.val?ser.baseBag.userid:'',
                                      policy_title:this.PolicyNameNoCase,
                                      law_case:this.law_case_id,
                                      limit:this.showNum,
                                      skip:this.ctlNoPageNum*this.showNum
      }).then(res=>{
        if(res.msg.code!='successed')return;
        //转换显示效果
        let data=this.converShowData(res.biz_body);
        this.ctlNoCacheData=data;
        this.ctlNoData=tool.Clone(this.ctlNoCacheData);
      });

    },
    //报警信息场所地址栏单击事件
    alarmAddressClick(index){
      let d =this.alarmData[index];
      //地图地位
      if(!d.equipment_latitude || !d.equipment_longitude){return;}
      tool.open(function(){
          let html=``;

          let param={
            title:'显示位置',
            area:'600px',
            content:`<div name="map_container" style="width:100%;height:400px;">${html}</div>`,
            context:{},
            success(layero){

                let map =  new BMap.Map(layero.find('div[name="map_container"]')[0],{minZoom:13,maxZoom:18});
                map.centerAndZoom(new BMap.Point(d.equipment_longitude,d.equipment_latitude),7);//重庆中心点
                map.enableScrollWheelZoom(true);

                var marker=new BMap.Marker(new BMap.Point(d.equipment_longitude,d.equipment_latitude));
                map.addOverlay(marker);
                
                //场所名称
                var labelName= new BMap.Label(`<div style="width:300px;text-align:center;">${d.netbar_title}</div>`,{position:new BMap.Point(d.equipment_longitude,d.equipment_latitude), offset:new BMap.Size(-150,-60)});
                labelName.setStyle({
                    fontSize : "12px",
                    lineHeight : "20px",
                    fontFamily:"微软雅黑",
                    fontWeight:'300',
                    border:'0px solid black',
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
            }
          }

          return param;
      }());
    },
    //根据网页宽度调整列表项宽度
    adjustColumnW(){
      let w=$(this.$el).width();
      if(w>1550){
        setTimeout(()=>{
          //报警
          this.alarmColumn=[
            {width:200,align:'center'},{width:200,align:'center'},{width:200,align:'center'},{width:100,align:'center'},
            {width:100,align:'center'},{width:250,align:'center'},{width:0,align:'center',color:'rgb(3, 171, 103)',click:this.alarmAddressClick},{width:150,align:'center'},{width:100,align:'center'}
          ];
          
          //布控
          this.ctlColumn=[
            {width:200,align:'center'},{width:120,align:'center'},{width:0,align:'center'},
            {width:200,align:'center'},{width:200,align:'center'},{width:200,align:'center'},{width:200,align:'center'}
          ];
        },0);
      }
      if(1024<w<1550){
        //报警配置
        this.alarmColumn=[
          {width:120,align:'center'},{width:120,align:'center'},{width:100,align:'center'},{width:80,align:'center'},
          {width:80,align:'center'},{width:150,align:'center'},{width:0,align:'center',color:'rgb(3, 171, 103)',click:this.alarmAddressClick},{width:100,align:'center'},{width:80,align:'center'}
        ];

        //布控
        this.ctlColumn=[
          {width:100,align:'center'},{width:120,align:'center'},{width:0,align:'center'},
          {width:100,align:'center'},{width:150,align:'center'},{width:80,align:'center'},{width:150,align:'center'}
        ];
      }

      if(800>=w){

      }
    },
    //报警控件是否显示
    alarmShowFunc(blnShow){
      this.alarmShow=blnShow;
      this.$nextTick(()=>{
        this.$refs.alarm.reloadyScroll();
        this.$refs.alarmNo.reloadyScroll();
      });
    },
    //非报警控件是否显示
    alarmNoShowFunc(blnShow){
      this.alarmNoShow=blnShow;
      this.$nextTick(()=>{
          this.$refs.alarm.reloadyScroll();
          this.$refs.alarmNo.reloadyScroll();
      });
    },
    //策略控件是否显示
    ctlShowFunc(blnShow){
      this.ctlShow=blnShow;
      this.$nextTick(()=>{
        this.$refs.policy.reloadyScroll();
        this.$refs.policyNo.reloadyScroll();
      });
    },
    //非案件相关策略控件是否显示
    ctlNoShowFunc(blnShow){
      this.ctlNoShow=blnShow;
      this.$nextTick(()=>{
        this.$refs.policy.reloadyScroll();
        this.$refs.policyNo.reloadyScroll();
      });
    },
    //案件数据行单击事件
    rowClick(val){
      this.caseShow=true;
      this.$nextTick(()=>{
        this.$refs.caseCtlScroll.reloadyScroll();
      });
      this.caseCurCtl=null;
      this.$store.dispatch(GetPolicy,{law_case:val.law_case_id,blnCase:true}).then(res=>{
        if(res.msg.code!='successed')return;
        this.caseRelationCtl=res.biz_body;

        //if(res.biz_body.length>0){
          //待修改
          this.alarmRigtLoading=true;
          this.getAlarmData(false,'','caseAlarmData',undefined,true,val.law_case_id).then(res=>{this.alarmRigtLoading=false;});
        //}

      });
    },
    //案件详细数据中相关布控项单击事件
    case_detail_infoClick(val){
      this.caseCurCtl=val;
      this.alarmRigtLoading=true;
      this.getAlarmData(false,val.policy_id,'caseAlarmData').then(res=>{this.alarmRigtLoading=false;});
     
    },
    //案件项数据报警分页函数
    caseAlarmPageChange(pageNum){
      if(!this.caseCurCtl)return;
      this.caseAlarmPageNum=pageNum>0? pageNum : 0;
      this.getAlarmData(true,this.caseCurCtl.policy_id,'caseAlarmData','caseAlarmPageNum');
    },
    //报警分页跳转(案件)
    pageChange(pageNum){
      this.pageNum=pageNum>0? pageNum : 0;
      this.getAlarmData(true,'','',undefined,true,this.law_case_id,this.alarmSearch);
    },
    //非案件报警分页跳转
    alarmNoPageChange(pageNum){
      this.alarmNoPageNum=pageNum>0? pageNum : 0;
      this.getAlarmData(true,'','alarmNoData','alarmNoPageNum',false,this.law_case_id,this.alarmNoSearch);
    },
    //获取报警数据(blnCase:是否包含案件)
    //keywords:案件关键字
    getAlarmData(blnTip,id,cdata,pageNum,blnCase,caseid,keywords,blnSeach){
      if(blnCase){this.alarmLoading=true;}
      let _pageNum=pageNum==undefined?this.pageNum:this[pageNum];
      return this.$store.dispatch(GetPolicyDetail,{id:id || '',law_case_id:caseid,limit:this.showNum,skip:_pageNum*this.showNum,blnCase,keywords}).then(res=>{
        if(blnCase){this.alarmLoading=false;}
        if(res.msg.code!='successed')return;
        let data=res.biz_body;
        
        data=_.map(data,i=>{
          let tmps=_.filter(AlarmType,t=>{return i.alarm_type.indexOf(t.val)>=0;});
          i.alarm_alarm_type=_.map(tmps,tmp=>{return `<i class="${tmp.icon}"></i>${tmp.name}`}).join('');
          i.netbar_title= i.netbar_title || '';
          i.keywords=i.keywords.replace(/^,/g,'').replace(/,$/g,'');
          return i;
        });

        if(data.length<=0 && !blnSeach){
            if(blnTip)tool.msg({msg:{code:'successed'}},'已经到了最后页!','已经到了最后页!');
            if(pageNum){
              this[pageNum]=(this[pageNum]-1)<0?0:(this[pageNum]-1);
            }else{
              this.pageNum=(this.pageNum-1)<0?0:(this.pageNum-1);
            }
            if(cdata && !pageNum){
              this[cdata]=[];
            }
            return;
        }


        if(this.curSelPerson.val==0){
          //所有布控
          if(cdata){
            this[cdata]=data;
          }else{
            this.alarmData=data;
          }
        }else{
          //我的布控
          if(cdata){
            this[cdata]=_.filter(data,i=>{return i.user_id==ser.baseBag.userid;});
          }else{
            this.alarmData=_.filter(data,i=>{return i.user_id==ser.baseBag.userid;});
          }
        }

        if(cdata)return;
        this.kindchange(this.kinds[0]);


      });
    },
    //转化策略显示数据
    converShowData(data){
    
     return _.map(data,item=>{
        item._name=item.policy_title;
        item._type=(_.find(PolicyType,itemD=>{return itemD.val==item.policy_type;}) || {name:''}).name;
        item._keys=item.keywords.replace(/^,/g,'').replace(/,$/g,'');
        item._alarm_type=_.map(item.alarm_type,itemD=>{
          return _.find(AlarmType,i=>{return i.val==itemD}).name;
        }).join(',');
        item._log_time=tool.DateByTimestamp(item.log_time,'yyyy-MM-dd hh:mm:ss');
        item.blnRead=false;
        item.children=[];
        return item;
      });
    },
    //转化案件显示信息
    converCaseData(data){
      return _.map(data,item=>{return { name:item.law_case_title,
                                                            note:item.law_case_note,
                                                            user:item.law_user || '',
                                                            time:tool.DateByTimestamp(item.log_time || '','yyyy-MM-dd hh:mm:ss'),
                                                            ctlNum:item.ctlNum || '0',
                                                            alarmNum:item.total || '0',
                                                            law_case_id:item.law_case_id || '',
                                                            law_case_status:item.law_case_status,
                                                            children:[]}
                                                  });
    },
    personchange(item){
      this.curSelPerson=item || {val:0};
      
      //获取策略信息(包含案件)
      this.ctrlPageChange(0);

      //获取策略信息(非包含案件)
      this.ctrlNoPageChange(0);
    },
    kindchange(item){
      this.curSelCase=item;
      switch(item.val){
        case -1://报警布控
            this.blnexpan=false;
            this.blnNoSel=true;
            this.$nextTick(()=>{
              this.$refs.alarm.reloadyScroll();
              this.$refs.alarmNo.reloadyScroll();
            });
          break;
        case 0://策略
            this.blnexpan=false;
            this.blnNoSel=false;
            this.showField='_name,_type,_keys,_alarm_type,_log_time';

            this.$nextTick(()=>{
              this.$refs.policy.reloadyScroll();
              this.$refs.policyNo.reloadyScroll();
            });
          break;
        case 1://案件
            this.blnexpan=false;
            this.blnNoSel=false;
            this.$nextTick(()=>{this.$refs.case.reloadyScroll()});
          break;
      }
    },
    //根据报警关键字搜索(案件)
    searchAlarmKey(val){
      this.pageNum=0;
      this.alarmSearch=val;
       //获取报警数据(案件)
      this.getAlarmData(false,'','',undefined,true,this.law_case_id,val,true);
    },
    //根据报警关键字搜索(非案件)
    searchAlarmKeyNoCase(val){
      this.alarmNoPageNum=0;
      this.alarmNoSearch=val;
      //获取报警数据(非案件)
      this.getAlarmData(false,'','alarmNoData','alarmNoPageNum',false,this.law_case_id,val,true);
    },
    //根据策略名称搜索(案件)
    seachPolicyName(val){
      this.PolicyName=val;
      this.$store.dispatch(GetPolicy,{policy_title:val,blnCase:true,law_case:this.law_case_id}).then(res=>{
        if(res.msg.code!='successed')return;
        //转换显示效果
        let data=this.converShowData(res.biz_body);
        this.ctlCacheData=data;
        this.ctlData = data;
      });
    },
    //根据策略名称搜索(非案件)
    searchPolicyNameNoCase(val){
      this.PolicyNameNoCase=val;
      this.$store.dispatch(GetPolicy,{policy_title:val}).then(res=>{
        if(res.msg.code!='successed')return;
        //转换显示效果
        let data=this.converShowData(res.biz_body);
        this.ctlNoCacheData=data;
        this.ctlNoData = data;
      });
    },
    //案件名称搜索
    searchCase(val){
      this.$store.dispatch(GetCase,{law_case_title:val,law_case_id:this.law_case_id}).then(res=>{
        if(res.msg.code!='successed')return;
        this.caseInfos=this.converCaseData(res.biz_body);
      });
    },
    //查看策略报警详细
    lookDetail(val){
      let self=this;
      let param=null;
      tool.open(function(){
        let html=`
                <div class="alarm_table">
                  <div class="row row_item">
                    <div class="col-md-2 item_label_left">布控名称</div><div class="col-md-4">{{d.policy_title}}</div>
                    <div class="col-md-2 item_label_right">布控类型</div><div class="col-md-4">{{d.policy_type}}</div>
                  </div>
                  <div class="row row_item">
                    <div class="col-md-2 item_label_left">报警类型</div><div class="col-md-4">{{d.alarm_type}}</div>
                    <div class="col-md-2 item_label_right">案件名</div><div class="col-md-4">{{d.law_case_title}}</div>
                  </div>
                  <div class="row row_item">
                    <div class="col-md-2 item_label_left">上网人员姓名</div><div class="col-md-4">{{d.customer_name}}</div>
                    <div class="col-md-2 item_label_right">上网场所编码</div><div class="col-md-4">{{d.netbar_wacode}}</div>
                  </div>
                  <div class="row row_item">
                    <div class="col-md-2 item_label_left">终端MAC</div><div class="col-md-4">{{d.mac}}</div>
                    <div class="col-md-2 item_label_right">产生时间</div><div class="col-md-4">{{converTime(d.logtime)}}</div>
                  </div>
                  <div class="row row_item">
                    <div class="col-md-2 item_label_left">身份证类型</div><div class="col-md-4">{{d.certificate_type}}</div>
                    <div class="col-md-2 item_label_right">身份证号码</div><div class="col-md-4">{{d.certificate_code}}</div>
                  </div>
                  <div class="row row_item">
                    <div class="col-md-2 item_label_left">虚拟身份证类型</div><div class="col-md-4">{{d.account_type}}</div>
                    <div class="col-md-2 item_label_right">虚拟身份证号码</div><div class="col-md-4">{{d.account}}</div>
                  </div>
                  <div class="row row_item">
                    <div class="col-md-2 item_label_left">虚拟身份证昵称</div><div class="col-md-4">{{d.account_nick}}</div>
                    <div class="col-md-2 item_label_right">终端IMSI码</div><div class="col-md-4">{{d.imsi}}</div>
                  </div>
                  <div class="row row_item">
                    <div class="col-md-2 item_label_left">终端IMEI码</div><div class="col-md-4">{{d.imei}}</div>
                    <div class="col-md-2 item_label_right">数据来源</div><div class="col-md-4">{{d.source_type}}</div>
                  </div>
                  <div class="row row_item">
                    <div class="col-md-2 item_label_left">报警时间</div><div class="col-md-4">{{d.detect_time}}</div>
                    <div class="col-md-2 item_label_right">报警地点</div><div class="col-md-4 divEllipsis" style="height:30px;" :title="d.netbar_address">{{d.netbar_address}}</div>
                  </div>
                </div>
              `;
        param={
          title:'报警详细',
          area:'800px',
          content:`<div class="alarm_detail" style="width:100%;height:100%;overflow-y:auto;">${html}</div>`,
          context:{
            d:{},
            converTime(time){
              return tool.DateByTimestamp(time,'yyyy-MM-dd hh:mm:ss');
            }
          }
        };

        return param;
      }());
      
      self.$store.dispatch(GetPolicyDetail,{log_id:val.log_id}).then(res=>{
        if(res.msg.code!='successed')return;
        let data=res.biz_body;

        data=_.map(data,i=>{
          let tmps=_.filter(AlarmType,t=>{return i.alarm_type.indexOf(t.val)>=0;});
          i.alarm_type=_.map(tmps,tmp=>{return `${tmp.name}`}).join(''); //报警类型
          // let policyTmp=_.find(PolicyType,t=>{return i.policy_type==t.val;});
          // i.policy_type=policyTmp;//策略类型
          return i;
        });

        param.selfData.d=data[0];
      });
 
    },
    //修改案件
    updateCase(val){
     this.addCase(val);
    },
    //删除案件
    delCase(val){
      tool.confirm('您确定要删除该案件信息吗?',['确定','取消'],()=>{
        this.$store.dispatch(DelCase,val.law_case_id).then(res=>{
        if(!tool.msg(res,'删除案件成功!','删除案件失败!'))return;
          this.caseInfos=_.filter(this.caseInfos,item=>{return item.law_case_id!=val.law_case_id;});
        });
      },function(){});
    },
    //添加案件
    addCase(item){
      let self=this;
      tool.open(function(){
          let html=`
                      <cInput label="请输入名称" @change="inputChange" :val="val" />
                      <cInput label="请输入描述" @change="noteChange"  :val="note"/>
                      <div style="margin-top:10px; text-align:right;">
                          <button type="button" class="btn btn-success" style="font-size:12px;"  @click="submit">
                            <i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i><span v-show="!blnSearch">确定</span>
                          </button> 
                          <button type="button" class="btn btn-default" style="font-size:12px;" @click="cancel">取消</button>
                      </div>
                    `;
          let param={
              title:item?'修改':'添加',
              area:'300px',
              skin:'deployCtrPopTitle',
              components:{cInput},
              content:`<div style="width:100%;height:100%;overflow:hidden;padding:10px;">
                          ${html}
                        </div>`,
              context:{
                  blnSearch:false,//是否正在查询
                  val:item?item.name:'',
                  note:item?item.note:'',
                  submit(){
                      if(!param.selfData.val){param.close();}
                      if(param.selfData.blnSearch)return;
                      param.selfData.blnSearch=true;

                      let val = {name:param.selfData.val,note:param.selfData.note,children:[]};
                      if(!item){//新增
                        self.$store.dispatch(AddCase,{law_case_title:val.name,law_case_note:val.note}).then(res=>{
                          param.selfData.blnSearch=false;
                          if(res.msg.code!='successed')return;
                          tool.info('新增成功!');
                          val.law_case_id=res.biz_body[0].law_case_id;
                          self.caseInfos.unshift(val);
                          param.close();
                        });
                      }else{//修改
                        self.$store.dispatch(UpdateCase,{law_case_id:item.law_case_id,law_case_title:val.name,law_case_note:val.note}).then(res=>{
                          param.selfData.blnSearch=false;
                          if(res.msg.code!='successed')return;
                          tool.info('修改成功!');
                          item.name=val.name;
                          item.note=val.note;
                          param.close();
                        });
                      }
                  },
                  cancel(){
                      param.close();
                  },
                  inputChange(val){
                      param.selfData.val=val;
                  },
                  noteChange(val){
                      param.selfData.note=val;
                  }
              }
          };

          return param;
      }());
    },
    //删除布控(案件)
    delPolicy(item){

      tool.confirm('您确定要撤销该条布控吗?',['确定','取消'],()=>{
        let index=_.findIndex(this.ctlData,i=>{return i.policy_id==item.policy_id;});
        this.$store.dispatch(DelPolicy,item.policy_id).then(res=>{
            if(res.msg.code!='successed')return;
            tool.info('撤销成功!');
            this.ctlData.splice(index,1);
        });
      },function(){});
    },
    //删除布控(非案件)
    delNoPolicy(item){
      tool.confirm('您确定要撤销该条布控吗?',['确定','取消'],()=>{
        let index=_.findIndex(this.ctlNoData,i=>{return i.policy_id==item.policy_id;});
        this.$store.dispatch(DelPolicy,item.policy_id).then(res=>{
            if(res.msg.code!='successed')return;
            tool.info('撤销成功!');
            this.ctlNoData.splice(index,1);
        });
      },function(){});
    },
    //批量删除布控
    delControl(){
      
      let hasDelItem=_.findIndex(this.ctlData,d=> d.blnRead)>=0 || _.findIndex(this.ctlNoData,d=> d.blnRead)>=0;
      if(!hasDelItem){tool.info('请选择需要撤销的布控项!'); return;}

      tool.confirm('您确定要撤销选中的布控吗?',['确定','取消'],()=>{
            let data=this.ctlData,self=this;
            for(let i=0;i<data.length;i++){
              if(!data[i].blnRead){continue;}
              (function(index){
                self.$store.dispatch(DelPolicy,data[i].policy_id).then(res=>{
                  if(res.msg.code!='successed')return;
                  data.splice(i,1);
                });
              }(i));
            }
            
            let noData =this.ctlNoData;
            for(let i=0;i<noData.length;i++){
              if(!noData[i].blnRead){continue;}
              (function(index){
                self.$store.dispatch(DelPolicy,noData[i].policy_id).then(res=>{
                  if(res.msg.code!='successed')return;
                  noData.splice(i,1);
                });
              }(i));
            }
      },function(){});
    },
    //添加布控单击事件
    addControl(){
      let self=this;
      tool.open(function(){
        let html=`
                   <div class="control_pop">
                      <div class="item clearfix"><span class="title">布控名称:</span><div class="input" style="margin-top:-2px;"><cInput label="默认按照时间命名" @change="nameChange" /></div></div>
                      <div class="item clearfix">
                        <span class="title">策略类型:</span>
                        <div class="input select">
                          <el-radio-group v-model="type" @change="typeChange">
                            <el-radio v-for="item in type_data" :label="item.val">{{item.name}}</el-radio>
                          </el-radio-group>
                        </div>
                      </div>
                      <div class="item clearfix">
                        <span class="title">关联案件:</span>
                        <div class="input" style="padding-top:10px;"><MulSelect ref="relativeCase" :defaultVal="defCases" :addFunc="addNewCase" :selItems="cases" @add="addCase" keyid="law_case_id" /></div>
                      </div>
                      <div class="item clearfix">
                        <span class="title">关键字:</span>
                        <div class="input"><cInput ref="keyNum" :reg="keyNumReg" tip="非法关键字" label="请输入内容,多个关键字用逗号分隔" @change="keyChange" /></div>
                      </div>
                      <div class="item clearfix">
                        <span class="title">报警方式:</span>
                        <div class="input select">
                          <el-checkbox-group v-model="police_way">
                            <el-checkbox v-for="item in police_way_data" disabled :title="item.name+'接口尚未接入'" :label="item.val">{{item.name}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </div>
                      <div class="item clearfix">
                        <cInput :label="item.name+',多个用逗号分隔'" @change="wayChange" :extra="item.val" v-for="item in police_way_commn" v-show="(','+police_way.join(',')+',').indexOf(','+item.val+',')>=0" />
                        <MulSelect ref="smsMobile" firstPlace="请输入姓名" secondPlace="请输入电话号码" :selItems="mobiles" :blnDel="true" @add="addMobile" @del="delMobile" keyid="id" v-show="(','+police_way.join(',')+',').indexOf(',sms,')>=0"/>
                      </div>
                      <div class="option_bar">
                        <button type="button" class="btn btn-success" style="font-size:12px;"  @click="submit">
                          <i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i><span v-show="!blnSearch">确定</span>
                        </button> 
                        <button type="button" class="btn btn-default" style="font-size:12px;" @click="cancel">取消</button>
                      </div>
                   </div>
                 `;

        let param={
          title:'添加布控',
          content:html,
          area:'600px',
          skin:'deployCtrPopTitle',
          components:{cInput,MulSelect},
          context:{
            blnSearch:false,//是否正在查询
            type_data:PolicyType,
            type:PolicyType[0].val,//策略类型
            police_way_data:AlarmType,
            police_way_commn:_.filter(AlarmType,i=> i.val!='sms'),
            cases:_.filter(self.caseInfos,s=>s.law_case_status!='completed'),
            defCases:[],
            mobiles:self.mobiles,//报警电话信息
            police_way:[],//报警方式
            key:'',//策略关键字
            keyNumReg:'',//关键字验证表达式
            name:'',//策略名称
            law_cases:[],//案件
            email:'',//邮件
            sms:'',//短信
            web:'',//网站
            submit(){
               let cases = _.map(param.$refs.relativeCase.$data.data,item=>{return item.law_case_id;});//案件ID集合
               let caseName=_.map(param.$refs.relativeCase.$data.data,item=>{return item.name;}).join(',');//案件名称集合
               let sms=_.map(param.$refs.smsMobile.$data.data,item=>{return item.mobile;});
               let data=param.selfData;
               
               //验证数据格式
               if(!param.$refs.keyNum.Valid()){return;}
               
               if(!param.selfData.key){
                  if(param.selfData.type=='cert'){//身份证
                    tool.info('身份证必填!');
                  }
                  if(param.selfData.type=='vid'){//虚拟身份
                    tool.info('虚拟身份必填!');
                  }
                  if(param.selfData.type=='mac'){//MAC
                    tool.info('MAC必填!');
                  }
                  if(param.selfData.type=='mobile'){//手机
                    tool.info('手机号必填!');
                  }
                  if(param.selfData.type=='imsi'){//imsi
                    tool.info('imsi必填!');
                  }
                  return;
                }

               if(param.selfData.key && param.selfData.type){
                  let blnVaild=true;
                  let keys=param.selfData.key.split(',');
          
                  for(let i=0;i<keys.length;i++){
                    if(param.selfData.type=='cert'){//身份证
                      let idReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份证验证
                      if(!idReg.test(keys[i])){tool.info('非法关键字');blnVaild=false;break;}
                    }
                    if(param.selfData.type=='vid'){//虚拟身份

                    }
                    if(param.selfData.type=='mac'){//MAC
                      let idReg = /^([A-Fa-f0-9]{2}-){5}[A-Fa-f0-9]{2}$/; //MAC
                      let macReg= /^([A-Fa-f0-9]{2}){5}[A-Fa-f0-9]{2}$/; //MAC
                      if(!idReg.test(keys[i]) && !macReg.test(keys[i])){tool.info('非法关键字');blnVaild=false;break;}
                    }
                    if(param.selfData.type=='mobile'){//手机
                      let idReg = /^1[3|4|5|7|8][0-9]{9}$/; //手机
                      if(!idReg.test(keys[i])){tool.info('非法关键字');blnVaild=false;break;}
                    }
                    if(param.selfData.type=='imsi'){//imsi
                      let idReg = /^(01|03)(\d{2})(\w{1})(\w{1})(\d{3})(\d{6})(\w{1})$/; //imsi
                      if(!idReg.test(keys[i])){tool.info('非法关键字');blnVaild=false;break;}
                    }
                  }

                  if(!blnVaild)return;
               }

               if(data.blnSearch)return;
               data.blnSearch=true;

               let alarm_way={
                email:(','+data.police_way.join(',')+',').indexOf(',email,')>=0?data.email.split(','):[],
                sms:(','+data.police_way.join(',')+',').indexOf(',sms,')>=0?sms:[],
                web:(','+data.police_way.join(',')+',').indexOf(',web,')>=0?data.web.split(','):[],
               };//报警方式具体联络地址
        
               //创建策略类型
               let temp={
                 policy_title:param.selfData.name || tool.DateFormat(new Date(),'yyyy-MM-dd hh:mm:ss'),
                 policy_type:param.selfData.type,
                 keywords:_.map(param.selfData.key.split(','),r=>{
                    //MAC没有横杠的情况
                    if(/^([A-Fa-f0-9]{2}){5}[A-Fa-f0-9]{2}$/.test(r)){
                        let tmp=[r.substr(0,2),r.substr(2,2),r.substr(4,2),r.substr(6,2),r.substr(8,2),r.substr(10,2)];
                        return tmp.join('-');
                    }else{
                      return r;
                    }
                 }),
                 locus_ids:[],
                 alarm_type:param.selfData.police_way,
                 alarm_account:alarm_way,
                 law_cases:cases
                };

               self.$store.dispatch(AddPolicy,temp).then(res=>{
                  if(res.msg.code!='successed')return;
                  tool.info('布控新增完成!');

                  temp.policy_id=res.biz_body.policy_id;
                  temp.log_time=tool.Timestamp(new Date());
                  temp.keywords=temp.keywords.join(',');
                  let data = self.converShowData([temp]);
                  data[0].law_cases=caseName;
    
                  if(cases.length>0){//包括案件
                    self.ctlCacheData.unshift(data[0]);
                    self.ctlData.unshift(data[0]);
                  }else{//不包括案件
                    self.ctlNoCacheData.unshift(data[0]);
                    self.ctlNoData.unshift(data[0]);
                  }
                });

                param.close();
            },
            //策略类型值改变事件
            typeChange(val){
              let data=param.selfData;
              if(val=='cert'){//身份证
                // data.keyNumReg='\\d{15}';

                // console.log(param.selfData.keyNumReg);
              }
              if(val=='vid'){//虚拟身份

              }
              if(val=='mac'){//MAC

              }
              if(val=='mobile'){//手机

              }
              if(val=='imsi'){//imsi

              }
            },
            cancel(){
              param.close();
            },
            addNewCase(){
              addPop.addCase.call(self,[(d)=>{
                let data={name:d.law_case_title,note:d.law_case_note,law_case_id:d.law_case_id,children:[]};
                param.selfData.cases.push(data);
                param.selfData.defCases.push(data);
              }]);
            },
            addCase(val){
              self.$store.dispatch(AddCase,{law_case_title:val[0].name,law_case_note:val[0].note}).then(res=>{
                if(res.msg.code!='successed')return;
                val[0].law_case_id=res.biz_body[0].law_case_id;
                param.selfData.cases.push({name:val[0].name,note:val[0].note,law_case_id:res.biz_body[0].law_case_id,children:[]});
              });
            },
            //添加报警电话
            addMobile(val){
              self.$store.dispatch(AddAlarmMobile,{name:val[0].name,mobile:val[0].note}).then(res=>{
                if(res.msg.code!='successed')return;
                val[0].id=res.biz_body[0].id;
                param.selfData.mobiles.push({id:val[0].id,name:val[0].name,mobile:val[0].note,contact_name:res.biz_body[0].name,children:[]});
                val[0].mobile=val[0].note
              });
            },
            //删除报警电话
            delMobile(val){
               self.$store.dispatch(DelAlarmMobile,val.id).then(res=>{
                    if(res.msg.code!='successed')return;
               });
            },
            nameChange(val){param.selfData.name=val;},
            keyChange(val){param.selfData.key=val;},
            wayChange(val,kind){
              switch(kind){
                case 'email':
                 param.selfData.email=val;
                  break;
                case 'sms':
                 param.selfData.sms=val;
                  break;
                case 'web':
                 param.selfData.web=val;
                  break;
              }
            }
          }
        };

        return param;
      }());
    }
  },
  components:{cSelect,HList,cInput,scroll},
}
</script>

<style lang="less">
  @pop_itemH:44px;
  //添加布控弹窗样式
  .control_pop {padding:0px 10px;height:100%;}
  .control_pop .item .title{float:left;line-height:@pop_itemH;}
  .control_pop .item .input{margin-left:70px;}
  .control_pop .item .input.select{line-height:@pop_itemH;}
  .control_pop .option_bar{text-align: right;margin: 10px 0px;}
  .el-checkbox__label,
  .el-radio__label{font-weight:normal;}

  //策略详细弹窗样式
  .policy_detail{padding:10px;}
  .policy_detail .label{width:100px;color: black;}
  .policy_detail .rowItem{line-height:30px;}

  .deployCtrPopTitle .layui-layer-title{background-color: #e7eaec;}

  //报警详细页面样式
  .alarm_detail .alarm_table{border:1px solid #e7eaec;}
  .alarm_detail .row_item{margin:0px;line-height:30px;border-bottom:1px solid #e7eaec;}
  .alarm_detail .row_item .item_label_left{text-align:center;border-right:1px solid #e7eaec;}
  .alarm_detail .row_item .item_label_right{text-align:center;border-right:1px solid #e7eaec;border-left:1px solid #e7eaec;}
</style>

<style scoped lang="less">
  @import "../css/variables.less";
  .DeployContrl{height:100%;padding:5px;}
  .DeployContrl .page{background-color:@FrontCol;height:100%;}
  .DeployContrl .hasPage{height:"100%"}
  .DeployContrl .noPage{height:"100%"}
  .DeployContrl .page_container{border-top:1px solid @borderCol;}

  @detailLW:150px;
  @detail_title_H:50px;
  @detail_item_H:30px;
  .DeployContrl .case_detail{.border('top');}
  .DeployContrl .case_detail .left{float:left;width:@detailLW;height:100%;.border('right')}
  .DeployContrl .case_detail .right{margin-left:@detailLW;margin-right:0px;height:100%;}
  .DeployContrl .case_detail .left .title{.border('bottom');text-align:center;line-height:@detail_title_H;color:white;}
  html{.TCol(~".DeployContrl .case_detail .left .title",'bg');}
  .DeployContrl .case_detail .left .title > span{margin-left:10px;}
  .DeployContrl .case_detail .left .info{width:100%;height:~'calc(100% - @{detail_title_H})';}
  .DeployContrl .case_detail .left .info .info_item{
    height:@detail_item_H;line-height:@detail_item_H;.border('bottom');font-size:12px;padding:0px 10px;text-align:left;cursor:pointer;
    overflow: hidden;text-overflow: ellipsis;white-space: nowrap;
  }
  .DeployContrl .case_detail .left .info .info_item.active{background-color:@btn_Bg_Col_hover_6;color:white;}
</style>
