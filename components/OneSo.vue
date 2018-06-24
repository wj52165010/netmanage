<!-- 一键搜页面组件 -->
<template>
    <div class="OneSo">
        <!--搜索栏-->
        <div class="search_bar">
            <div class="search">
                <div class="icon_container"><i class="fa fa-search"></i></div>
                <div class="input_container">
                    <SearchDropdown v-model="searchval" :data="[]" :info="serachInfo" :noShowOnlyOne="true" holder="请输入关键字(身份证/手机号/MAC/ISMI)" ></SearchDropdown>
                </div>
            </div>
        </div>
        <!--内容展示区域-->
        <div class="content_bar">
          <!--卡片展示区域-->
          <div class="card_bar">

            <!--主要内容-->
            <div class="card" v-show="curData.length>0">
              <!--标题栏-->
              <div class="title_bar">
                <div v-show="serachInfo.code=='vid'">
                  <div class="tag" v-for="(d,i) in curData" :class="{active:curShowVidIndex==i}" @click="curShowVidIndex=i" v-if="d.account_type_note">{{d.account_type_note}}</div>
                </div>
                <span style="margin-left:10px;font-size:12px;" v-show="serachInfo.code!='vid'">{{
                  serachInfo.val
                }}</span>
              </div>
              <!--内容栏-->
              <div class="info_bar">
                <!--头像-->
                <div v-if="serachInfo.code=='cert' && curData.length>0" style="width:70px;height:90px;float:left;margin-right:10px;border:1px solid #e7eaec;">
                  <img :src="'/cert/'+(curData[0].certificate_code || 0)" style="width:100%;height:100%;" />
                </div>
                <!--身份证-->
                <div v-if="serachInfo.code=='cert' && curData.length>0">
                  <div><span style="margin-right:10px;">姓名</span>{{curData[0].customer_name}}</div>
                  <div><span style="margin-right:10px;">身份证</span>{{curData[0].certificate_code}}</div>
                  <div><span style="margin-right:10px;">最近出现场所</span>{{curData[0].last_netbar_wacode}}</div>
                  <div><span style="margin-right:10px;">最新采集</span>{{curData[0].last_time}}</div>
                </div>

                <!--虚拟身份-->
                <div v-if="serachInfo.code=='vid' && curData.length>0">
                  <div><span style="margin-right:10px;">账号</span>{{curData[curShowVidIndex].account}}</div>
                  <div><span style="margin-right:10px;">类型</span>{{curData[curShowVidIndex].account_type_note}}</div>
                  <div><span style="margin-right:10px;">最近出现场所</span>{{curData[curShowVidIndex].last_netbar_wacode}}</div>
                  <div><span style="margin-right:10px;">最新采集</span>{{curData[curShowVidIndex].last_time}}</div>
                </div>

                <!--手机号-->
                <div v-if="serachInfo.code=='mobile' && curData.length>0">
                  <div><span style="margin-right:10px;">手机号</span>{{curData[0].mobile}}</div>
                  <div><span style="margin-right:10px;">最近出现场所</span>{{curData[0].last_netbar_wacode}}</div>
                  <div><span style="margin-right:10px;">最新采集</span>{{curData[0].last_time}}</div>
                </div>

                <!--MAC-->
                <div v-if="serachInfo.code=='mac' && curData.length>0">
                  <div><span style="margin-right:10px;">Mac</span>{{curData[0].mac}}</div>
                </div>

                <!--按钮区域-->
                <div class="btn_container">
                    <div class="btn_item" @click="trackAnalyze()"><i class="fa fa-sliders" style="margin-right:5px;"></i>轨迹分析</div>
                    <div class="btn_item" @click="showFocus()"><i class="fa fa-flag" style="margin-right:5px;"></i>关注人员</div>
                </div>
              </div>
              <!--向下延伸箭头-->
              <div class="down_angle" v-show="blnShowFcous"><i class="fa fa-angle-double-down"></i></div>
            </div>

            <!--中间导航箭头-->
            <div class="middle_angle" v-show="curData.length>0">
              ....&nbsp;&nbsp;<i class="fa fa-angle-double-right"></i>
            </div>
            
            <!--关联身份-->
            <div class="card" v-show="curData.length>0">
              <!--标题栏-->
              <div class="title_bar">
                <span style="margin-left:10px;font-size:12px;">关联身份</span>
              </div>
              <!--内容栏-->
              <div class="info_bar">
                <div class="scroll_container">
                  <Scroll :listen="identitys" ref="idenScroll">
                    <div class="iden_item" @click="lookIden(d)" v-for="(d,k) in identitys">{{k}}<span>( {{d.count}} )</span></div>
                  </Scroll>
                </div>
                <!--按钮区域-->
                <div class="btn_container">
                  <div class="btn_item" @click="LookRelation()"><i class="fa fa-sliders" style="margin-right:5px;"></i>关联分析</div>
                </div>
              </div>
              
              <!--向下延伸箭头-->
              <div class="down_angle" v-show="list"><i class="fa fa-angle-double-down"></i></div>
            </div>

            <div class="clearfix"></div>
          </div>
          <!--列表展示区域-->
          <div class="list_bar">
              <!--左边显示-->
              <div class="left_info" v-show="blnShowFcous">
                <div class="card" style="height:100%;">
                  <!--标题栏-->
                  <div class="title_bar">
                    <span style="margin-left:10px;font-size:12px;">特别关注<i class="fa fa-remove delbtn" @click="blnShowFcous=false"></i></span>
                  </div>
                  <!--内容栏-->
                  <div class="info_bar">
                    <el-input placeholder="请输入关键词" v-model="attenSearchVal"  class="input-with-select">
                        <i slot="prepend" class="fa fa-search"></i>
                    </el-input>
                    <div style="height:calc(100% - 36px);width:calc(100% + 10px);">
                      <!--数据不存在信息信息-->
                      <div style="width:100%;height:100%;text-align:center;" v-show="fcous.length<=0">
                        <div style="margin-top:20px;padding-left:40px;">
                          <img src="../assets/cry.png" style="width:30px;margin-right:10px;float:left;" />
                          <span style="font-size:16px;float:left;padding-top: 5px;">该QQ号未与此人发生关联</span>
                          <div class="clearfix"></div>
                        </div>
                        <div style="margin-top:10px;">
                          <button type="button" class="btn btn-success btn-sm" @click="addFcous()">添加关注</button>
                        </div>
                      </div>
                      <!--数据存在显示信息-->
                      <div style="width:100%;height:100%;" v-show="fcous.length>0">
                        <Scroll ref="fcousScroll">
                          <div class="focus_item" v-for="f in fcous">
                            <span style="width:50px;display:inline-block;">{{f.focus_title}}</span>
                            <span style="margin-left:10px;" v-if="f.focus_property.length>0">
                              <span style="color:#4bbae4;">{{f.focus_property[0].t_note}}</span>&nbsp;&nbsp;{{f.focus_property[0].k}}
                            </span>
                            <div style="float:right;" @click="addFcous(f)"><i class="fa fa-pencil-square-o"></i></div>
                          </div>
                        </Scroll>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            <!--右边显示(列表)-->
            <div class="right_info" v-show="list" :style="{'margin-left':blnShowFcous?'360px':'0px'}">
              <!--头部信息-->
              <div class="header">
                <div class="td">类型</div>
                <div class="td">账号</div>
                <div class="td">最近活动时间</div>
                <div class="td">最近活动场所</div>
              </div>
              <!--表体信息-->
              <div class="body">
                <Scroll ref="listScroll">
                  <div v-if="list && list.type=='vid'">
                    <div class="row" v-for="d in list.data">
                      <div class="td divEllipsis">{{d.account_type_note}}</div>
                      <div class="td divEllipsis">{{d.account}}</div>
                      <div class="td divEllipsis">{{d.last_time}}</div>
                      <div class="td divEllipsis">{{d.last_netbar_wacode}}</div>
                      <div class="clearfix"></div>
                    </div>
                  </div>

                  <div v-if="list && list.type=='mac'">
                    <div class="row" v-for="d in list.data">
                      <div class="td divEllipsis">MAC</div>
                      <div class="td divEllipsis">{{d.mac}}</div>
                      <div class="td divEllipsis">{{d.last_time}}</div>
                      <div class="td divEllipsis">{{d.last_netbar_wacode}}</div>
                      <div class="clearfix"></div>
                    </div>
                  </div>

                  <div v-if="list && list.type=='mobile'">
                    <div class="row" v-for="d in list.data">
                      <div class="td divEllipsis">手机</div>
                      <div class="td divEllipsis">{{d.mobile}}</div>
                      <div class="td divEllipsis">{{d.last_time}}</div>
                      <div class="td divEllipsis">{{d.last_netbar_wacode}}</div>
                      <div class="clearfix"></div>
                    </div>
                  </div>

                  <div v-if="list && list.type=='cert'">
                    <div class="row" v-for="d in list.data">
                      <div class="td divEllipsis">身份证</div>
                      <div class="td divEllipsis">{{d.cert}}</div>
                      <div class="td divEllipsis">{{d.last_time}}</div>
                      <div class="td divEllipsis">{{d.last_netbar_wacode}}</div>
                      <div class="clearfix"></div>
                    </div>
                  </div>
                  
                </Scroll>
              </div>
            </div>
          </div>
        </div>

        <!--关注人员隐藏页面-->
        <div style="display:none;">
          <AttentPerson ref="AttentPerson" :blnNoInit="true" />
        </div>
    </div>
</template>

<script>
import SearchDropdown from 'components/SearchDropdown'
import AttentPerson from '../examples/AttentPerson.example'
import TrackAnalyze from '../examples/Track2.example'
import Relation from '../examples/Relation2.example'
import Scroll from 'components/Scroll'
import {OneSearch,GetFocusPerson} from '../store/mutation-types'


export default {
  name: 'OneSo',
  components:{SearchDropdown,Scroll,AttentPerson},
  data () {
    return {
      RxSub:null,
      attenRxSub:null,
      attenSubscript:null,
      subscription:null,
      blnShowFcous:false,//是否显示关注信息
      searchval:'',
      serachInfo:{color:'gray',val:'',code:''},
      identitys:{},//身份信息集合
      fcous:[],//关注信息
      curData:[],
      curShowVidIndex:0,
      list:null,
      attenSearchVal:'',
      types:{vid:'虚拟身份',cert:'身份证',mobile:'手机',mac:'MAC'}
    }
  },
  watch:{
    searchval(){
      let res = this.vaildInupt(this.searchval);
      if(res.length==0){
        this.serachInfo={color:'gray',val:'',code:''}
      }

      if(res.length==1){
        this.serachInfo={color:'green',val:res[0].name,code:res[0].val}
      }

      this.RxSub.next({val:this.searchval,code: this.serachInfo.code});
    },
    attenSearchVal(){

      this.attenRxSub.next(this.attenSearchVal);
    }
  },
  mounted(){
    this.RxSub=new this.$store.getters.Rx.Subject();
    this.subscription = this.RxSub.debounceTime(400).subscribe((val)=>{
      if(!val.val) return;
      this.$store.dispatch(OneSearch,{
        keyword:val.val,
        task_target_type:val.code,
        account_type:'',
      }).then(res=>{
        this.identitys=res.biz_body.data;
        this.curData=this.serachInfo.code=='vid'?_.filter(res.biz_body.selfData,d=>d.account_type_note):res.biz_body.selfData;

      
      });
    
    });

  this.attenRxSub=new this.$store.getters.Rx.Subject();
  this.attenSubscript=this.attenRxSub.debounceTime(400).subscribe((val)=>{
    if(!val){this.fcous.splice(0,this.fcous.length); return;}
    this.$store.dispatch(GetFocusPerson,{
                                             key:val,
                                             tag_id:'',
                                             not_define:false,
                                             sort_by:'',
                                             limit:1000,
                                             skip:0}).then(res=>{
                                                this.fcous=res.biz_body;
                                             });
  });

 
  },
  destroyed(){
    this.subscription.unsubscribe();
    this.attenSubscript.unsubscribe();
  },
  methods:{
    layout(){
      this.$refs.listScroll.reloadyScroll();
      this.$refs.fcousScroll.reloadyScroll();
    },
    //关联分析
    LookRelation(){
      let self=this;
      let ww=$('body').width();
      let wh=$('body').height();
      tool.open(function(){
        let html=`
          <Relation :searchVal="search" />
        `;
        let param={
            title:'轨迹分析',
            area:[`${ww}px`, `${wh}px`],
            offset:['0px','0px'],
            move:false,
            content:`<div class="TrackAnalyze_window_pop" style="width:100%;height:100%;overflow:hidden;text-align:center;">${html}</div>`,
            components:{Relation},
            store:self.$store,
            context:{
              search:self.searchval
            }
        }

        return param;
      }());
    },
    //轨迹分析
    trackAnalyze(){
      let self=this;
      let ww=$('body').width();
      let wh=$('body').height();
      let start = new Date();
      let end=new Date();

      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)


      tool.open(function(){
        let html=`
          <TrackAnalyze :searchVal="search" :defTimeRange="timeRange" />
        `;
        let param={
            title:'轨迹分析',
            area:[`${ww}px`, `${wh}px`],
            offset:['0px','0px'],
            move:false,
            content:`<div class="TrackAnalyze_window_pop" style="width:100%;height:100%;overflow:hidden;text-align:center;">${html}</div>`,
            components:{TrackAnalyze},
            store:self.$store,
            context:{
              search:self.searchval,
              timeRange:[tool.DateFormat(start,'yyyy-MM-dd'),tool.DateFormat(end,'yyyy-MM-dd')]
            }
        }

        return param;
      }());
    },
    //查看身份详细列表
    lookIden(d){
      this.list=d;
      this.$nextTick(()=>{this.layout();});
    },
    //显示关注人员
    showFocus(){
      this.blnShowFcous=true;
      if(this.attenSearchVal) return;
      this.attenSearchVal=this.searchval;
    },
    //添加关注
    addFcous(f){
      let s=this;
      
      let focus =  _.flatten(_.map(this.identitys,i=>{
        let kval='';
        if(i.type=='mac'){kval='mac'}
        if(i.type=='vid'){kval='account'}
        if(i.type=='cert'){kval='cert'}
        if(i.type=='mobile'){kval='mobile'}

        return _.map(i.data,d=>{
        
          return {
            name:s.types[i.type],
            k:d[kval],
            t:i.type,
            n:d.account_type || ''
          }
        });
      }));

      this.$refs.AttentPerson.addAttention(f?tool.Clone(f):{focus_tags:[],focus_locus_ids:[],focus_property:focus},(b,blnUpdate)=>{
        if(!blnUpdate){
          s.fcous.push(b);
        }else{
          Object.assign(f,b);
        }
      },f);
    },
     //验证用户输入内容的类型
    vaildInupt(v){
      let res=[];
      //判断输入内容是为纯数字
      let numReg=/^[0-9]*$/;
      let hanziReg = /[\u4E00-\u9FA5]/g; //中文
      let macReg=/([0-9A-Fa-f]{2}-){5}[0-9A-Fa-f]{2}/g;//MAC验证
      let certificateReg=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;//身份证验证
      let phoneReg=/^[1][3,4,5,7,8][0-9]{9}$/;//验证手机号
      let imsiReg=/^4600[0,1,2,3,5,6,7]\d{10}$/g;//验证IMSI

      if(hanziReg.test(v)){res.push({name:'虚拟身份',val:'vid'});return res;}
      if(macReg.test(v)){res.push({name:'MAC',val:'mac'})}
      if(certificateReg.test(v)){res.push({name:'身份证',val:'cert'})}
      if(phoneReg.test(v)){res.push({name:'手机号',val:'mobile'})}
      if(imsiReg.test(v)){res.push({name:'IMSI',val:'imsi'})}
      if(res.length<=0){
        res.push({name:'虚拟身份',val:'vid'})
      }

      return res;
    }
  }
}
</script>

<style  lang="less">
    @import "../css/variables.less";
    .OneSo .search_bar .search .input_container .SearchDropdown input{border-left:none !important;border-top-left-radius: 0px;border-bottom-left-radius: 0px !important;}
   
    .OneSo .search_bar .search .input_container .SearchDropdown input::-webkit-input-placeholder { color:#99a9bf; }
    .OneSo .search_bar .search .input_container .SearchDropdown input::-ms-placeholder{ color:#99a9bf;}
    .OneSo .search_bar .search .input_container .SearchDropdown input::-moz-placeholder{ color:#99a9bf;}

    .OneSo .el-input-group__prepend{.border('',@Font_Hover_Col);color:white;}

    html{.TCol(~".OneSo .el-input-group__prepend",'bg');}
    html{.TCol(~".OneSo .el-input-group__prepend",'bc');}
</style>

<style scoped lang="less">
  @import "../css/variables.less";

  .OneSo{width:100%;height:100%;}

  .OneSo .search_bar{padding:10px;width:100%;}

  .OneSo .search_bar .search{width:384px;}

  @iconW:34px;
  .OneSo .search_bar .search .icon_container{
      float:left;height:36px;width:@iconW;line-height:@iconW;text-align:center;color:#99a9bf;.border('',@Font_Hover_Col);
      border-top-left-radius:5px;border-bottom-left-radius:5px;color:white;
  }

  html{.TCol(~".OneSo .search_bar .search .icon_container",'bc');}
  html{.TCol(~".OneSo .search_bar .search .icon_container",'bg');}

  .OneSo .search_bar .search .input_container{margin-left:@iconW;}
  

  .OneSo .content_bar{width:100%;height:~'calc(100% -  56px)';}

  @card_barH:180px;
  .OneSo .content_bar .card_bar{height:@card_barH;margin:0px 10px;.border('top',#C0CCDA);padding-top:10px;}
  .OneSo .content_bar .list_bar{height:~'calc(100% - @{card_barH})';width:100%;padding:5px 10px;}

  @cardH:140px;
  @cardW:350px;
  .OneSo .content_bar .card{width:@cardW;height:@cardH;.border('',#d2d2d2);border-radius:5px;float:left;}

  .OneSo .content_bar .card .down_angle{text-align:center;font-size:40px;line-height:10px;color:#d2d2d2;}
  @titleH:26px;
  .OneSo .content_bar .title_bar{height:@titleH;line-height:@titleH;width:100%;background-color:#d2d2d2;padding-right:10px;}
  .OneSo .content_bar .title_bar .tag{float:left;font-size:12px;padding:0px 5px;height:100%;}
  .OneSo .content_bar .title_bar .tag:hover{color:white;cursor:pointer;}
  html{.TCol(~".OneSo .content_bar .title_bar .tag:hover",'bg');}

  .OneSo .content_bar .info_bar{height:~'calc(100% - @{titleH})';width:100%;position:relative;font-size:12px;padding:10px;}
  .OneSo .content_bar .info_bar .btn_container{position:absolute;bottom:5px;right:0px;}
  .OneSo .content_bar .info_bar .btn_container .btn_item{
    float:left;font-size:12px;.border('',@Font_Hover_Col);border-radius:5px;margin-right:5px;padding:3px 10px;color:white;
  }

  

  html{.TCol(~".OneSo .content_bar .info_bar .btn_container .btn_item",'bc');}
  html{.TCol(~".OneSo .content_bar .info_bar .btn_container .btn_item");}

  .OneSo .content_bar .info_bar .btn_container .btn_item:hover{color:white !important;cursor:pointer;}
  html{.TCol(~".OneSo .content_bar .info_bar .btn_container .btn_item:hover",'bg');}

  .OneSo .content_bar .info_bar .iden_item{display:inline-block;margin-right:10px;}
  .OneSo .content_bar .info_bar .iden_item:hover{cursor:pointer;}
  html{.TCol(~".OneSo .content_bar .info_bar .iden_item:hover");}

  .OneSo .content_bar .info_bar .iden_item span{margin-left:2px;}

  .OneSo .content_bar .info_bar .scroll_container{width:100%;height:~'calc(100% - 25px)';}

  .OneSo .content_bar .middle_angle{float:left;width:80px;height:@cardH;line-height:@cardH;text-align:center;font-size:40px;color:#d2d2d2;position:relative;}
  .OneSo .content_bar .middle_angle i{position:absolute;top:50%;margin-top:-20px;margin-top: -8px;right: 5px;}


  .OneSo .content_bar .list_bar .left_info{height:100%;width:@cardW;float:left;}
  .OneSo .content_bar .list_bar .right_info{height:100%;margin-left:@cardW + 10px;.border('',#d2d2d2);}

  @headerH:25px;
  .OneSo .content_bar .list_bar .right_info .header{height:@headerH;width:100%;background-color:#d2d2d2;}
  .OneSo .content_bar .list_bar .right_info .body .td,
  .OneSo .content_bar .list_bar .right_info .header .td{float:left;width:25%;line-height:@headerH;text-align:center;font-size:12px;padding:0px 5px;}
  .OneSo .content_bar .list_bar .right_info .body{width:100%;height:~'calc(100% - @{headerH})';.border('bottom',#d2d2d2);}
  .OneSo .content_bar .list_bar .right_info .body .row{height:@headerH;width:100%;margin:0px;}

  .OneSo .content_bar .title_bar .delbtn{cursor:pointer;float:right;margin-top:6px;}
  //.OneSo .content_bar .title_bar .delbtn:hover{color:@Font_Hover_Col;}

  html{.TCol(~".OneSo .content_bar .title_bar .delbtn:hover");}

  .OneSo .list_bar .focus_item{line-height:25px;padding:0px 10px;}
  .OneSo .list_bar .focus_item i:hover{cursor:pointer;}

  html{.TCol(~".OneSo .list_bar .focus_item i:hover");}

  .OneSo .tag.active{color:white;}

  html{.TCol(~".OneSo .tag.active",'bg');}
  .OneSo .tag:first-child{border-top-left-radius:5px;}
</style>