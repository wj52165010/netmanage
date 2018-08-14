<!-- 停业计划页组件 -->
<template>
    <div class="ClosePlan">
      <div class="ClosePlan_container">

        <!--操作栏-->
        <div class="option_bar">
            <div class="item">
                <span>场所范围:</span>
                <div style="display:inline-block;">
                    <PlaceSearch :blnClear="true"  c_searchKind="1" :microprobeType="microprobe_type" ccontext="place"  @place_res="placechange"></PlaceSearch>
                </div>
            </div>
            <div class="item">
                <span>区域范围:</span><div style="display:inline-block;">
                    <PlaceSearch  :blnClear="true" c_searchKind="0" :microprobeType="microprobe_type" ccontext="region"  @place_res="regionchange"></PlaceSearch>
                </div>
            </div>
            <div class="item">
                <span>发布时间:</span>
                <div style="display:inline-block;">
                    <el-date-picker  type="date" v-model="time_range" placeholder="选择日期" :picker-options="simpleTime"> </el-date-picker>
                </div>
            </div>
            <div class="item">
                <span>执行状态:</span><div style="display:inline-block;">
                   <el-select v-model="plan_status" placeholder="请选择" :clearable="true">
                        <el-option
                            v-for="kind in dict_tables.stop_status"
                            :key="kind.value"
                            :label="kind.name"
                            :value="kind.value">
                        </el-option>
                    </el-select>
                </div>
            </div>

            <div class="item">
                <el-button type="primary" @click="search()"><span>查询</span></el-button>
            </div>

            <!--右边操作栏-->
            <div class="right_option_bar">
                <div class="item" @click="pulishClosePlan()"><i class="fa fa-cog fa-fw" /> 发布停业</div>
                <div class="item" @click="cancelClose()"><i class="fa fa-copyright" /> 撤销停业 <i class="fa fa-spinner fa-pulse" v-if="blnRevocation" /></div>
                <div class="item" @click="exportData()"><i class="fa fa-share" /> 导出<i class="fa fa-spinner fa-pulse" v-if="blnExport" /></div>
            </div>
        </div>

         <!--列表头-->
        <div class="table_header">
            <div class="row">
                <div class="column cursor" style="width:50px;" @click="selAll()"><span class="overflow" style="width:50px;"><i :class="{'fa fa-check-square-o':blnAllSel,'fa fa-square-o':!blnAllSel}"></i></span></div>

                <div class="column" style="width:200px;">
                    <span class="overflow" style="width:200px;position:relative;">
                        <span style="margin-right:5px;">场所编码</span>
                        <i class="fa fa-caret-up" :class="{active:!placeCodeOrder}" @click="orderChange('placeCodeOrder',false);"></i><i class="fa fa-caret-down" :class="{active:placeCodeOrder}" @click="orderChange('placeCodeOrder',true);"></i>
                    </span>
                </div>

                <div class="column">
                  <span class="overflow" style="position:relative" :style="{width:column_w+'px'}">
                    <span style="margin-right:5px;">场所名称</span>
                    <i class="fa fa-caret-up" :class="{active:!placeNameOrder}" @click="orderChange('placeNameOrder',false);"></i><i class="fa fa-caret-down" :class="{active:placeNameOrder}" @click="orderChange('placeNameOrder',true);"></i>
                  </span>
                </div>
                <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">执行状态</span></div>
                <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">负责人姓名</span></div>
                <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">负责人电话</span></div>
                <div class="column" style="width:250px;"><span class="overflow" style="width:250px;">停业时效</span></div>
                <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">发布人</span></div>

                <div class="column" style="width:120px;">
                    <span class="overflow" style="width:120px;position:relative;">
                        <span style="margin-right:5px;">发布时间</span>
                        <i class="fa fa-caret-up" :class="{active:!pulishTimeOrder}" @click="orderChange('pulishTimeOrder',false);"></i><i class="fa fa-caret-down" :class="{active:pulishTimeOrder}" @click="orderChange('pulishTimeOrder',true);"></i>
                    </span>
                </div>

                <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">停业原因</span></div>

                <div class="column" style="width:150px;">
                    <span class="overflow" style="width:150px;position:relative;">
                        <span style="margin-right:5px;">所属区域</span>
                        <i class="fa fa-caret-up" :class="{active:!areaOrder}" @click="orderChange('areaOrder',false);"></i><i class="fa fa-caret-down" :class="{active:areaOrder}" @click="orderChange('areaOrder',true);"></i>
                    </span>
                </div>

            </div>
        </div>

        <!--列表体-->
        <div :style="{height:bodyH}" style="position:relative;">
            <!--加载中-->
            <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index: 100;">
                <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
            </div>
            <!--暂无数据-->
            <div v-if="viewData.length<=0 && blnLoading==false" style="width:100%;height:100%;text-align:center;display:table;">
                <div style="display:table-cell;vertical-align: middle;">暂无数据</div>
            </div>

            <Scroll :listen="viewData" ref="scroll">
                <div class="table_body">
                    <div class="row" v-for="(d,i) in viewData">
                        <div class="column cursor" style="width:50px;" @click="selItem(d,i)"><span class="overflow" style="width:50px;"><i :class="{'fa fa-check-square-o':d.checked,'fa fa-square-o':!d.checked}"></i></span></div>
                        <div class="column" style="width:200px;"><span class="overflow clickItem" @click="placeDetail(d)" style="width:200px;">{{d.code}}</span></div>
                        <div class="column"><span class="overflow" :style="{width:column_w+'px'}">{{d.name}}</span></div>
                        <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">{{d.state}}</span></div>
                        <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">{{d.user}}</span></div>
                        <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">{{d.phone}}</span></div>
                        <div class="column" style="width:250px;"><span class="overflow" style="width:250px;">{{d.closeTime}}</span></div>
                        <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">{{d.publishUser}}</span></div>
                        <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">{{d.publishTime}}</span></div>
                        <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">{{d.closeReason}}</span></div>
                        <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">{{d.region}}</span></div>
                    </div>
                </div>
            </Scroll>
        </div>

        <!--分页栏-->
        <div name="page_container" class="page_container" style="background-color:white;">
            <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">
                当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageIndex+1}}</span>/{{pageSize}},
                每页{{pageNum}}条,共{{pageCount}}条
            </span>
            <div class="firstPage"  v-show="pageIndex!=0" @click="pageChange(0)">首页</div>
            <div class="prePage"    v-show="pageIndex>0" @click="pageChange(pageIndex-1)">上一页</div>
            <div class="nextPage"   v-show="pageIndex<pageSize-1" @click="pageChange(pageIndex+1)">下一页</div>
            <div class="nextPage"   v-show="pageIndex!=pageSize-1" @click="pageChange(pageSize-1)">最后页</div>              
        </div>

      </div>
    </div>
</template>

<script>
import Scroll from  'components/scroll'
import PlaceSearch from 'components/PlaceSearch'
import PublishClosePlan from './PulishClosePlan'
import PlaceDetail from '../PlaceDetail'

import DataSource from '../../../enum/DataSource'

import {BODY_RESIZE,getDictTables,netbar_stop_plan_list,netbar_stop_add,netbar_stop_plan_export,netbar_stop_cancel} from '../../../store/mutation-types'
export default {
  name: 'ClosePlan',
  components:{PlaceSearch,Scroll},
  data () {
    return {
      simpleTime:{
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      column_w:0,
      bodyResizeSub:null,
      bodyH:0,
      data:[
          {code:'50099910000005',name:'重庆智多测试部',state:'执行中',user:'张三',phone:'138xxxxxxx',closeTime:'2017-12-06 10:53—2017-12-07 10:53',publishUser:'产品部',publishTime:'2017-12-04 17:09',closeReason:'',region:'南岸区'},
          {code:'50099910000005',name:'重庆智多测试部',state:'执行中',user:'张三',phone:'138xxxxxxx',closeTime:'2017-12-06 10:53—2017-12-07 10:53',publishUser:'产品部',publishTime:'2017-12-04 17:09',closeReason:'',region:'南岸区'},
          {code:'50099910000005',name:'重庆智多测试部',state:'执行中',user:'张三',phone:'138xxxxxxx',closeTime:'2017-12-06 10:53—2017-12-07 10:53',publishUser:'产品部',publishTime:'2017-12-04 17:09',closeReason:'',region:'南岸区'}
        ],
      dict_tables:{},
      blnLoading:false,
      microprobe_type:DataSource['网吧'],
      blnExport:false,  //是否正在进行导出数据
      blnRevocation:false, //是否正在进行撤销操作
      pageIndex:0,
      pageNum:15,       //当前页面显示数据条数
      pageCount:0,      //数据总条数
      pageSize:0,       //数据总页数
      placeNameOrder:true,
      placeCodeOrder:true,
      pulishTimeOrder:true,
      areaOrder:true,
      states:[],
      orderObj:{sort:'netbar_wacode',order:'desc'},//排序字段
      time_range:[],
      netsite_range:[],
      region_range:[],
      plan_status:''
    }
  },
  computed:{
      viewData(){
        return this.converData(this.data);
      },
      blnAllSel(){
        return !_.find(this.data,d=>!d.checked);
      }
  },
  mounted(){
    //加载数据
    this.loadData();
    this.layout();

    //获取数据来源（下拉框序列化）
    this.$store.dispatch(getDictTables).then(res=>{
        if(res.msg.code!='successed')return;
        this.dict_tables= res.biz_body;
    });

    this.$store.commit(BODY_RESIZE,{cb:(sub)=>{
        this.bodyResizeSub=sub
    },sub:()=>{
        this.layout();
    }});

  },
  beforeDestroy(){
    this.bodyResizeSub.unsubscribe();
  },
  methods:{
    layout(){
        setTimeout(()=>{
            this.bodyH=`calc(100% - 50px - 40px - ${$(this.$el).find('.option_bar').height()}px)`;

            this.$nextTick(()=>{
                this.$refs.scroll.reloadyScroll()
            })
        },100);
        this.column_w=$(this.$el).width()-1360;
    },
    //加载数据
    loadData(){
        this.blnLoading=true;
        this.$store.dispatch(netbar_stop_plan_list,{
            limit:this.pageNum,
            skip:this.pageNum *  this.pageIndex,
            sort:this.orderObj.sort,
            order:this.orderObj.order,
            time_range:this.time_range[0]?_.map(this.time_range,t=>tool.DateFormat(t,'yyyy-MM-dd')).join(' - '):'',
            netsite_range:this.netsite_range,
            region_range:this.region_range,
            plan_status:this.plan_status,
        }).then(res=>{
            this.blnLoading=false;
            if(!tool.msg(res,'','获取查询停业计划列表数据失败!'))return;
            this.data=res.biz_body;

            if(this.data.length<=0){
                this.pageCount=0;
                this.pageSize=0;
            }else{
                this.pageCount=res.page.total;  
                this.pageSize=res.page.page_size;
            }
        });
    },
    converData(d){
        return _.map(d,c=>{
            return {
                id:c.plan_id,                   //计划ID
                code:c.netbar_wacode,           //场所编码
                name:c.netbar_name,             //场所名称
                state:c.plan_status_desc,       //执行状态
                user:c.principal_name,          //负责人
                phone:c.principal_tel,          //负责人电话
                closeTime:c.stop_time_range,    //停业时间
                publishUser:c.author,           //发布人
                publishTime:c.log_time,         //发布时间
                closeReason:c.reason,           //关闭原因
                region:c.region_name,           //区域
                checked:c.checked || false,     //是否被选中
            }
        });
    },
    //排序改变事件
    orderChange(type,val){
     let orderCache=this[type];

     if(orderCache==val) return;

     this.placeNameOrder=true;
     this.placeCodeOrder=true;
     this.pulishTimeOrder=true;
     this.areaOrder=true;

     this[type]=val;

     let fieldMap={
        placeCodeOrder:'netbar_wacode',
        placeNameOrder:'netbar_name',
        pulishTimeOrder:'log_time',
        areaOrder:'region_name'
     };

     this.orderObj.sort=fieldMap[type];
     this.orderObj.order=val?'desc':'asc';
     this.loadData();

    },
    placechange(query,val){
        this.netsite_range = _.flatten(_.map(val,v=>{return _.map(v,i=>{ return {code:i.code};})}));
    },
    regionchange(query,val){
        this.region_range = _.flatten(_.map(val,v=>{return _.map(v,i=>{ return {code:i.code};})}));
    },
    //全选/取消全选
    selAll(){
        this.data = _.map(this.data,d=>{ d.checked=!this.blnAllSel; return d });
    },
    //单选
    selItem(d,i){
        d.checked=!d.checked;
        this.data.splice(i,1,d);
    },
    //场所详情
    placeDetail(d){
        let s=this;
        tool.open(function(){
            let param={
                title:'场所详情',
                area:'1000px',
                content:`<div class="place_detail_pop" style="width:100%;height:100%;">
                            <PlaceDetail />
                        </div>
                        `,
                components:{PlaceDetail},
                store:s.$store,
                context:{
                    blnExecute:false,
                    ok_btn(){param.close()},
                    cancel_btn(){param.close()}
                }
            };

            return param;
        }());
    },
    //发布停业计划
    pulishClosePlan(){
        let s=this;
        tool.open(function(){
            let layIndex=0;
            let param={
                title:'发布停业',
                area:'600px',
                content:`<div class="Publish_Close_pop" style="width:100%;height:100%;">
                            <div v-show="curPageIndex==0">
                                <PublishClosePlan @change="contentChange" />
                                <div class="option_bar" style="text-align:right;margin:10px;margin-right:18px;" >
                                    <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
                                    <button type="button" class="btn btn-success" :disabled="blnSubmit || blnExecute" @click="goNext()"><span v-if="!blnExecute">确定</span> <i v-if="blnExecute" class="fa fa-spinner fa-pulse"></i></button>
                                </div>
                            </div>
                            <div v-show="curPageIndex==1">
                                <div class="option_bar" style="text-align:right;margin:10px;margin-right:18px;" >
                                    <div style="width:100%;text-align:center;padding:10px;">请输入密码确认操作</div>

                                    <div style="text-align:center;width:100%;margin-bottom:10px;">
                                        <input type="password" v-model="pwd" style="width:200px;display: inline-block;" class="form-control" />
                                    </div>

                                    <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
                                    <button type="button" class="btn btn-default" @click="goPre()">上一步</button>
                                    <button type="button" class="btn btn-success" :disabled="!pwd || blnExecute" @click="ok_btn()"><span v-if="!blnExecute">确定</span> <i v-if="blnExecute" class="fa fa-spinner fa-pulse"></i></button>
                                </div>
                            </div>
                         </div>
                        `,
                components:{PublishClosePlan},
                store:s.$store,
                computed:{
                  blnSubmit(){
                    let d=this.data;
                    return !(d.close_way && d.stop_time_range && d.reason && d.target);
                  }
                },
                watch:{
                    curPageIndex(){
                        let titles=['发布停业','确认操作'];
                        layer.title(` ${titles[this.curPageIndex]}`,layIndex);
                        layer.style(layIndex, {
                            width:`${this.curPageIndex==0?'600px':'400px'}`
                        });
                    }
                },
                context:{
                    curPageIndex:0,
                    blnExecute:false,
                    data:{},
                    pwd:'',//确认操作密码
                    //内容改变事件
                    contentChange(d){
                        param.selfData.data=d;
                    },
                    goNext(){
                        let d=param.selfData;
                        
                        param.selfData.curPageIndex++;
                    },
                    goPre(){
                        let d=param.selfData;
                        
                        param.selfData.curPageIndex--;
                    },
                    ok_btn(){
                        let d=param.selfData;
                        d.blnExecute=true;
                        s.$store.dispatch(netbar_stop_add,{
                            pwd:d.pwd,
                            close_way:d.data.close_way,
                            stop_time_range:d.data.stop_time_range,
                            reason:d.data.reason,
                            reason:d.data.reason
                        }).then(res=>{
                            d.blnExecute=false;
                            if(!tool.msg(res,'添加成功!')){
                                if(res.msg.code=='error_pwd'){
                                    d.curPageIndex=1;
                                }else{
                                    d.curPageIndex=0;
                                }
                                return;
                            }
                            s.calPage(1);
                            s.data.unshift(res.biz_body);
                            param.close();
                        })
                    },
                    cancel_btn(){param.close()}
                },
                success(layero,index){
                    layIndex=index;
                }
            };

            return param;
        }());
    },
    //导出数据
    exportData(){
        let s=this;
        let ids=_.chain(this.data).filter(d=>d.checked).map(d=>d.id).value();//选中的IDS
        if(ids.length<=0){tool.info('请选择需要导出的数据集合!');return;}
        tool.open(function(){
            let param={
                title:'提示',
                area:'400px',
                content:`<div class="Reset_Num_pop" style="width:100%;height:100%;">
                            <div style="padding: 30px 10px;text-align:center;">请确定是否需要导出所选的${ids.length}条数据!</div>
                            <div class="option_bar" style="text-align:right;padding:15px;padding-top:0px;">
                                <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
                                <button type="button" class="btn btn-success"  @click="ok_btn()"><span v-if="!blnExecute">确定</span> <i v-if="blnExecute" class="fa fa-spinner fa-pulse"></i></button>
                            </div>
                        </div>
                        `,
                components:{},
                store:s.$store,
                context:{
                    blnExecute:false,
                    ok_btn(){
                        if(param.selfData.blnExecute){return;}
                        param.selfData.blnExecute=true;
                        s.blnExport=true;
                        s.$store.dispatch(netbar_stop_plan_export,{
                            sort:s.orderObj.sort,
                            order:s.orderObj.order,
                            time_range:s.time_range[0]?_.map(s.time_range,t=>tool.DateFormat(t,'yyyy-MM-dd')).join(' - '):'',
                            netsite_range:s.netsite_range,
                            region_range:s.region_range,
                            plan_status:s.plan_status,
                            plan_id:ids.join(',')
                        }).then(res=>{
                            s.blnExport=false;
                            if(!tool.msg(res,'导出成功!','导出失败!'))return;
                            window.location=res.biz_body.url;
                            param.close();
                        });
                    },
                    cancel_btn(){param.close()}
                }
            };

            return param;
        }());
    },
    //撤销停业
    cancelClose(){
        let s=this;
        let ids=_.chain(this.data).filter(d=>d.checked).map(d=>d.id).value();//选中的IDS
        if(ids.length<=0){tool.info('请选择需要撤销的数据集合!');return;}
        tool.open(function(){
            let param={
                title:'提示',
                area:'400px',
                content:`<div class="Reset_Num_pop" style="width:100%;height:100%;">
                            <div style="padding: 30px 10px;text-align:center;"><i class="fa fa-warning" style="font-size:20px;margin-right:10px;color:red;" />确定要撤销对所选${ids.length}家场所的停业处置吗?</div>
                            <div class="option_bar" style="text-align:right;padding:15px;padding-top:0px;">
                                <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
                                <button type="button" class="btn btn-success"  @click="ok_btn()"><span v-if="!blnExecute">确定</span> <i v-if="blnExecute" class="fa fa-spinner fa-pulse"></i></button>
                            </div>
                        </div>
                        `,
                components:{},
                store:s.$store,
                context:{
                    blnExecute:false,
                    ok_btn(){
                        if(param.selfData.blnExecute){return;}
                        param.selfData.blnExecute=true;
                        s.blnRevocation=true;

                        s.$store.dispatch(netbar_stop_cancel,{
                            plan_id:ids.join(',')
                        }).then(res=>{  
                            s.blnRevocation=false;
                            if(!tool.msg(res,'撤销成功!','撤销失败!'))return;

                            //判断当前删除后页数变化没有
                            s.calPage(-ids.length);
                            s.pageChange((s.pageIndex+1)>=s.pageSize?s.pageSize-1:s.pageIndex);
                            param.close();
                        })
                        param.close()
                    },
                    cancel_btn(){param.close()}
                }
            };

            return param;
        }());
    },
    search(){
        this.pageChange(0);
    },
    pageChange(i){
        this.pageIndex=i;
        this.loadData();
    },
    //根据操作(新增/删除)对页面总数进行重新计算
    calPage(num){
        this.pageCount=this.pageCount+num;
        this.pageSize=Math.ceil(this.pageCount/this.pageNum);
    }
  }
}
</script>

<style scoped lang="less">
@import "../../../css/variables.less";
.ClosePlan{width:100%;height:100%;padding:5px;}
.ClosePlan_container{width:100%;height:100%;background-color:white;}

.ClosePlan .option_bar{text-align:left;padding:5px 15px;line-height:40px;}
.ClosePlan .option_bar .item{display:inline-block;margin:2px 5px;}

.ClosePlan .right_option_bar {float:right;}
.ClosePlan .right_option_bar .item{display:inline-block;margin:2px 5px;}
.ClosePlan .right_option_bar .item:hover{cursor:pointer;}
html{.TCol(~".ClosePlan .right_option_bar .item:hover");}

.ClosePlan .cursor{cursor:pointer;}

.ClosePlan .page_container{.border('top');}

.ClosePlan .fa-caret-up{position:absolute;top:8px;cursor:pointer;font-size:14px;color:gray;}
.ClosePlan .fa-caret-down{position:absolute;top:17px;cursor:pointer;font-size:14px;color:gray;}

.ClosePlan .fa-caret-up.active,
.ClosePlan .fa-caret-down.active,
.ClosePlan .fa-caret-up:hover,
.ClosePlan .fa-caret-down:hover{
    color:white;
}

.ClosePlan .clickItem:hover{cursor:pointer;text-decoration:underline;}
html{.TCol(~".ClosePlan .clickItem");}

//列表显示样式
@header_H:40px;
.ClosePlan .table_header{height:@header_H;display:table;width:100%;border:none;color:white;}
html{.TCol(~".ClosePlan .table_header .row",'bg');}

.ClosePlan .table_header .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}
.ClosePlan .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;.border('bottom');background-color:white;}
.ClosePlan .table_header .column .sort_item .triangle-up:hover{cursor:pointer;}
html{.TCol(~".ClosePlan .table_header .column .sort_item .triangle-up:hover",'bbc');}

.ClosePlan .table_header .column .sort_item .triangle-down:hover{cursor:pointer;}
html{.TCol(~".ClosePlan .table_header .column .sort_item .triangle-down:hover",'btc');}

html{.TCol(~".ClosePlan .table_header .column .sort_item .triangle-up.active",'bbc');}

html{.TCol(~".ClosePlan .table_header .column .sort_item .triangle-down.active",'btc');}

.ClosePlan .table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";.border('bottom');}
.ClosePlan .table_body{width:100%;display:table;width:100%;border:none;}
.ClosePlan .table_body .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}

.overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}
</style>
