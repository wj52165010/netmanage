<!-- 电子登记主页组件 -->
<template>
    <div class="ElectronicReg">
      <div class="ElectronicReg_container">
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
                <el-button type="primary" @click="search()"><span>查询</span></el-button>
            </div>

            <!--右边操作栏-->
            <div class="right_option_bar">
                <div class="item" @click="regSetting()"><i class="fa fa-cog fa-fw" /> 登记配置</div>
                <div class="item" @click="editNum()"><i class="fa fa-pencil-square-o" /> 编辑可用</div>
                <div class="item" @click="resetNum()"><i class="fa fa-copyright" /> 重置已用</div>
                <div class="item" @click="exportData()"><i class="fa fa-share" /> 导出</div>
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

                <div class="column" >
                    <span class="overflow" style="position:relative;" :style="{width:column_w+'px'}">
                        <span style="margin-right:5px;">场所名称</span>
                        <i class="fa fa-caret-up" :class="{active:!placeNameOrder}" @click="orderChange('placeNameOrder',false);"></i><i class="fa fa-caret-down" :class="{active:placeNameOrder}" @click="orderChange('placeNameOrder',true);"></i>
                    </span>
                </div>

                <div class="column" style="width:120px;">
                    <span class="overflow" style="width:120px;position:relative;">
                        <span style="margin-right:5px;">所属区域</span>
                        <i class="fa fa-caret-up" :class="{active:!placeReginOrder}" @click="orderChange('placeReginOrder',false);"></i><i class="fa fa-caret-down" :class="{active:placeReginOrder}" @click="orderChange('placeReginOrder',true);"></i>
                    </span>
                </div>

                <div class="column" style="width:80px;"><span class="overflow" style="width:80px;">可用次数</span></div>
                <div class="column" style="width:200px;"><span class="overflow" style="width:200px;">最后一次重置时间</span></div>
                <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">重置人</span></div>
                <div class="column" style="width:200px;"><span class="overflow" style="width:200px;">操作</span></div>
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
                        <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">{{d.region}}</span></div>
                        <div class="column" style="width:80px;"><span class="overflow" style="width:80px;">{{d.uableCount}}</span></div>

                        <div class="column" style="width:200px;"><span class="overflow" style="width:200px;">{{d.logtime}}</span></div>
                        <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">{{d.user}}</span></div>
                        <div class="column" style="width:200px;">
                            <span class="overflow" style="width:200px;">
                                <div class="item" @click="editNum(d)"  style="display:inline-block;"><i class="fa fa-pencil-square-o" /> 编辑可用</div>
                                <div class="item" @click="resetNum(d)" style="display:inline-block;margin-left:10px;"><i class="fa fa-copyright" /> 重置已用</div>
                            </span>
                        </div>
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
import PlaceSearch from 'components/PlaceSearch'
import Scroll from  'components/scroll'
import RegSetting from './RegSetting'
import PlaceDetail from '../PlaceDetail'

import DataSource from '../../../enum/DataSource'

import {BODY_RESIZE,netbar_electronic_list,netbar_electronic_option_allow,netbar_electronic_edit_allow,netbar_electronic_list_export} from '../../../store/mutation-types'

export default {
  name: 'ElectronicReg',
  components:{PlaceSearch,Scroll},
  data () {
    return {
        column_w:0,
        bodyResizeSub:null,
        bodyH:0,
        data:[
             {code:'50099910000005',name:'重庆智多测试部',region:'测试区',uableCount:10,logtime:'2017-12-04 17:09',user:'产品部'},
             {code:'50099910000005',name:'重庆智多测试部',region:'测试区',uableCount:10,logtime:'2017-12-04 17:09',user:'产品部'},
             {code:'50099910000005',name:'重庆智多测试部',region:'测试区',uableCount:10,logtime:'2017-12-04 17:09',user:'产品部'}
        ],
        blnLoading:false,
        microprobe_type:DataSource['网吧'],
        pageIndex:0,
        pageNum:15,       //当前页面显示数据条数
        pageCount:0,      //数据总条数
        pageSize:0,       //数据总页数
        placeCodeOrder:true,
        placeNameOrder:true,
        placeReginOrder:true,
        orderObj:{sort:'netbar_wacode',order:'desc'},//排序字段
        netsite_range:[],
        region_range:[],
    }
  },
  computed:{
      viewData(){
        return _.map(this.data,d=>{d.checked=d.checked || false; return d;  })
      },
      blnAllSel(){
        return !_.find(this.data,d=>!d.checked);
      }
  },
  mounted(){
   //加载数据
   this.loadData();
   this.layout();


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
        this.column_w=$(this.$el).width()-970;
    },
    //加载数据
    loadData(){
        this.blnLoading=true;
        this.$store.dispatch(netbar_electronic_list,{
            limit:this.pageNum,
            skip:this.pageNum *  this.pageIndex,
            sort:this.orderObj.sort,
            order:this.orderObj.order,
            netsite_range:this.netsite_range,
            region_range:this.region_range
        }).then(res=>{
            this.blnLoading=false;
            if(!tool.msg(res,'','获取电子登记列表数据失败!'))return;
            this.data=this.converData(res.biz_body);

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
                id:c.netbar_wacode,         //标识
                code:c.netbar_wacode,       //场所编码
                name:c.netbar_name,         //场所名称
                region:c.region_name,       //区域名称
                uableCount:c.allow_use,     //可用次数
                logtime:c.last_reset_time,  //最后重置可用时间
                user:c.user_name            //最后重置操作人
            }
        });
    },
    //排序改变事件
    orderChange(type,val){
     let orderCache=this[type];

     if(orderCache==val) return;

     this.placeNameOrder=true;
     this.placeCodeOrder=true;
     this.placeReginOrder=true;

     this[type]=val;

     let fieldMap={
        placeCodeOrder:'netbar_wacode',
        placeNameOrder:'netbar_name',
        placeReginOrder:'region_name',
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
    //登记配置
    regSetting(){
        let s=this;
        tool.open(function(){
            let param={
                title:'电子登记配置',
                area:'800px',
                content:`<div class="Plan_Setting_pop" style="width:100%;height:100%;">
                            <RegSetting @change="change" />
                            <div class="option_bar" style="text-align:right;padding:15px;">
                                <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
                                <button type="button" class="btn btn-success" :disabled="blnSubmit || blnExecute" @click="ok_btn()"><span v-if="!blnExecute">确定</span> <i v-if="blnExecute" class="fa fa-spinner fa-pulse"></i></button>
                            </div>
                        </div>`,
                components:{RegSetting},
                store:s.$store,
                computed:{
                    blnSubmit(){
                        let d=this.d;
                        return !(d.times && d.cover!=undefined && d.target)
                    }
                },
                context:{
                    blnSubmit:false,
                    blnExecute:false,
                    d:{},
                    change(d){
                        param.selfData.d=d;
                    },
                    ok_btn(){
                        if(param.selfData.blnExecute) return;
                        param.selfData.blnExecute=true;

                        let d=param.selfData.d;
                        s.$store.dispatch(netbar_electronic_option_allow,{
                            times:d.times,
                            cover:d.cover,
                            target:d.target
                        }).then(res=>{
                            param.selfData.blnExecute=false;
                            if(!tool.msg(res,'配置成功!','配置失败!')) return;

                            param.close();
                        });
                        
                    },
                    cancel_btn(){param.close();}
                }
            };

            return param;
        }());
    },
    //重置已用
    resetNum(id){
        let s=this;

        let ids=_.chain(this.data).filter(d=>d.checked).map(d=>d.id).value();//选中的IDS
        if(!id && ids.length<=0){tool.info('请选择需要编辑的数据集合!');return;}


        tool.open(function(){
            let param={
                title:'提示',
                area:'400px',
                content:`<div class="Reset_Num_pop" style="width:100%;height:100%;">
                            <div style="padding: 30px 10px;text-align:center;"><i class="fa fa-warning" style="font-size:20px;margin-right:10px;color:red;" />确定要将${id?'':`所选${ids.length}的家`}场所可用次数重置为0吗?</div>
                            <div class="option_bar" style="text-align:right;padding:15px;">
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
                        if(param.selfData.blnExecute) return;
                        param.selfData.blnExecute=true;

                        s.$store.dispatch(netbar_electronic_edit_allow,{
                            times:0,
                            site_id:id || ids.join(',')
                        }).then(res=>{
                            param.selfData.blnExecute=false;
                            if(!tool.msg(res,'重置成功!','重置失败!')) return;

                            s.pageChange(s.pageIndex);
                            param.close();
                        });

                    },
                    cancel_btn(){param.close()}
                }
            };

            return param;
        }());
    },
    //编辑已用
    editNum(id){
        let s=this,blnBatch=id==undefined,ids=[];
        id=id || -1;

        if(blnBatch){//批量编辑
            ids=_.chain(this.data).filter(d=>d.checked).map(d=>d.id).value();//选中的IDS
            if(ids.length<=0){tool.info('请选择需要编辑的数据集合!');return;}

        }

        tool.open(function(){
            let param={
                title:'编辑可用',
                area:'400px',
                content:`<div class="Plan_Setting_pop" style="width:100%;height:100%;">
                            <RegSetting @change="change" :blnHideCoverPlace="true" :blnHideTargetPlace="blnHideTargetPlace" />
                            <div class="option_bar" style="text-align:right;padding:15px;padding-top:0px;">
                                <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
                                <button type="button" class="btn btn-success" :disabled="blnSubmit || blnExecute" @click="ok_btn()"><span v-if="!blnExecute">确定</span> <i v-if="blnExecute" class="fa fa-spinner fa-pulse"></i></button>
                            </div>
                        </div>`,
                components:{RegSetting},
                store:s.$store,
                context:{
                    blnHideTargetPlace:true,
                    blnSubmit:false,
                    blnExecute:false,
                    d:{},
                    change(d){
                        param.selfData.d=d;
                    },
                    ok_btn(){
                        if(param.selfData.blnExecute) return;
                        param.selfData.blnExecute=true;

                        let d=param.selfData.d;
                        s.$store.dispatch(netbar_electronic_edit_allow,{
                            times:d.times,
                            site_id:blnBatch?ids.join(','):id
                        }).then(res=>{
                            param.selfData.blnExecute=false;
                            if(!tool.msg(res,'编辑成功!','编辑失败!')) return;

                            s.pageChange(s.pageIndex);
                            param.close();
                        });
                    },
                    cancel_btn(){param.close();}
                }
            };

            return param;
        }());
    },
    //导出数据
    exportData(){
        let s=this;

        let ids=_.chain(this.data).filter(d=>d.checked).map(d=>d.id).value();//选中的IDS
        if(!id && ids.length<=0){tool.info('请选择需要导出的数据集合!');return;}

        tool.open(function(){
            let param={
                title:'提示',
                area:'400px',
                content:`<div class="Reset_Num_pop" style="width:100%;height:100%;">
                            <div style="padding: 30px 10px;text-align:center;">请确定是否需要导出所选的${ids.length}条数据!</div>
                            <div class="option_bar" style="text-align:right;padding:15px;">
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
                            netsite_range:s.netsite_range,
                            region_range:s.region_range,
                            site_id:ids.join(',')
                        }).then(res=>{
                            param.selfData.blnExecute=false;
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
    search(){
        this.pageChange(0);
    },
    pageChange(i){
        this.pageIndex=i;
        this.loadData();
    },
  }
}
</script>

<style scoped lang="less">
@import "../../../css/variables.less";
.ElectronicReg{width:100%;height:100%;padding:0px 0px;}
.ElectronicReg_container{width:100%;height:100%;background-color:white;}

.ElectronicReg .option_bar{text-align:left;padding:5px 15px;line-height:40px;}
.ElectronicReg .option_bar .item{display:inline-block;margin:2px 5px;}

.ElectronicReg .right_option_bar {float:right;}
.ElectronicReg .right_option_bar .item{display:inline-block;margin:2px 5px;}
.ElectronicReg .right_option_bar .item:hover{cursor:pointer;}
html{.TCol(~".ElectronicReg .right_option_bar .item:hover");}

.ElectronicReg .cursor{cursor:pointer;}

.ElectronicReg .page_container{.border('top');}

.ElectronicReg .table_body .item{cursor:pointer;}
html{.TCol(~".ElectronicReg .table_body .item:hover");}

.ElectronicReg .fa-caret-up{position:absolute;top:8px;cursor:pointer;font-size:14px;color:gray;}
.ElectronicReg .fa-caret-down{position:absolute;top:17px;cursor:pointer;font-size:14px;color:gray;}

.ElectronicReg .fa-caret-up.active,
.ElectronicReg .fa-caret-down.active,
.ElectronicReg .fa-caret-up:hover,
.ElectronicReg .fa-caret-down:hover{
    color:white;
}

.ElectronicReg .clickItem:hover{cursor:pointer;text-decoration:underline}
html{.TCol(~".ElectronicReg .clickItem");}
//列表显示样式
@header_H:40px;
.ElectronicReg .table_header{height:@header_H;display:table;width:100%;border:none;color:white;}
html{.TCol(~".ElectronicReg .table_header .row",'bg');}

.ElectronicReg .table_header .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}
.ElectronicReg .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;.border('bottom');background-color:white;}
.ElectronicReg .table_header .column .sort_item .triangle-up:hover{cursor:pointer;}
html{.TCol(~".ElectronicReg .table_header .column .sort_item .triangle-up:hover",'bbc');}

.ElectronicReg .table_header .column .sort_item .triangle-down:hover{cursor:pointer;}
html{.TCol(~".ElectronicReg .table_header .column .sort_item .triangle-down:hover",'btc');}

html{.TCol(~".ElectronicReg .table_header .column .sort_item .triangle-up.active",'bbc');}

html{.TCol(~".ElectronicReg .table_header .column .sort_item .triangle-down.active",'btc');}

.ElectronicReg .table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";.border('bottom');}
.ElectronicReg .table_body{width:100%;display:table;width:100%;border:none;}
.ElectronicReg .table_body .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}

.overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}
</style>
