<!-- 电子登记主页组件 -->
<template>
    <div class="PlaceNote">
      <div class="PlaceNote_container">
        <!--操作栏-->
        <div class="option_bar">
            <div class="item">
                <span>发布时间:</span>
                <div style="display:inline-block;">
                    <el-date-picker v-model="time_range" style="width:250px;" type="daterange" placeholder="选择日期" :picker-options="simpleTime"> </el-date-picker>
                </div>
            </div>
            <div class="item">
                <span>标题:</span><div style="display:inline-block;">
                   <el-input placeholder="请输入" v-model="title" ></el-input>
                </div>
            </div>
            <div class="item">
                <span>内容:</span><div style="display:inline-block;">
                   <el-input placeholder="请输入" v-model="content" ></el-input>
                </div>
            </div>

            <div class="item">
                <el-button type="primary" @click="search()"><span>查询</span></el-button>
            </div>

            <!--右边操作栏-->
            <div class="right_option_bar">
                <div class="item" @click="notices()"><i class="fa fa-cog fa-fw" /> 发布通知</div>
                <div class="item" @click="datchRemove()"><i class="fa fa-remove" /> 批量删除 <i class="fa fa-spinner fa-pulse" v-if="blnBatchRemove" /></div>
            </div>
        </div>

         <!--列表头-->
        <div class="table_header">
            <div class="row">
                <div class="column cursor" style="width:50px;" @click="selAll()"><span class="overflow" style="width:50px;"><i :class="{'fa fa-check-square-o':blnAllSel,'fa fa-square-o':!blnAllSel}"></i></span></div>
                <div class="column"><span class="overflow" :style="{width:column_w+'px'}">标题</span></div>
                <div class="column" style="width:200px;">
                    <span class="overflow" style="width:200px;position:relative;">
                        <span style="margin-right:5px;">发布时间</span>
                        <i class="fa fa-caret-up" :class="{active:!timeOrder}" @click="orderChange('timeOrder',false);"></i><i class="fa fa-caret-down" :class="{active:timeOrder}" @click="orderChange('timeOrder',true);"></i>
                    </span>
                </div>
                <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">发布人</span></div>
                <div class="column" style="width:80px;"><span class="overflow" style="width:80px;">通知场所</span></div>
                <div class="column" style="width:80px;"><span class="overflow" style="width:200px;">签收状态</span></div>
                <div class="column" style="width:200px;"><span class="overflow" style="width:200px;">附件</span></div>
                <div class="column" style="width:120px;"><span class="overflow" style="width:100px;">操作</span></div>
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
                        <div class="column"><span class="overflow clickItem" :style="{width:column_w+'px'}" @click="noteDetail(d)">{{d.name}}</span></div>
                        <div class="column" style="width:200px;"><span class="overflow" style="width:200px;">{{d.pulishTime}}</span></div>
                        <div class="column" style="width:120px;"><span class="overflow" style="width:120px;">{{d.user}}</span></div>
                        <div class="column" style="width:80px;"><span class="overflow" style="width:80px;">{{d.placeCount}}</span></div>
                        <div class="column" style="width:80px;"><span class="overflow" style="width:200px;">{{`签收:${d.sign} 未签收:${d.unsign} 回复:${d.reply}`}}</span></div>
                        <div class="column" style="width:200px;"><span class="overflow " :class="{clickItem:d.accessory}" style="width:200px;" @click="loadBag(d)">{{d.accessory || '未上传附件'}}</span></div>
                        <div class="column" style="width:120px;">
                            <span class="overflow" style="width:100px;">
                                <div @click="remove(d)" style="cursor:pointer;"><i class="fa fa-remove" style="margin-right:5px;" />删除</div>
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
import '../../../../static/jquery-file-upload/jquery.ui.widget.js'
import '../../../../static/jquery-file-upload/jquery.iframe-transport.js'
import '../../../../static/jquery-file-upload/jquery.fileupload.js'
import '../../../../static/jquery.particleground.js'

import DataSource from '../../../enum/DataSource'

import Scroll from  'components/scroll'
import PlaceTree from 'components/PlaceTreeNew'
import NoteDetail from './NoteDetail'
import {BODY_RESIZE,InterBar} from '../../../store/mutation-types'


export default {
  name: 'PlaceNote',
  components:{Scroll},
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
            //{name:'会议通知',pulishTime:'2018-06-12 10:28',user:'产品部',placeCount:10,sign:0,unsign:10,reply:9,accessory:'图片XXX'},
            //{name:'会议通知',pulishTime:'2018-06-12 10:28',user:'产品部',placeCount:10,sign:0,unsign:10,reply:9,accessory:'图片XXX'},
            //{name:'会议通知',pulishTime:'2018-06-12 10:28',user:'产品部',placeCount:10,sign:0,unsign:10,reply:9,accessory:'图片XXX'},
            //{name:'会议通知',pulishTime:'2018-06-12 10:28',user:'产品部',placeCount:10,sign:0,unsign:10,reply:9,accessory:''},
        ],
        blnLoading:false,
        blnBatchRemove:false, //是否正在进行批量删除
        microprobe_type:DataSource['网吧'],
        pageIndex:0,
        timeOrder:true,
        pageNum:15,       //当前页面显示数据条数
        pageCount:0,      //数据总条数
        pageSize:0,       //数据总页数
        orderObj:{sort:'post_time',order:'desc'},//排序字段
        time_range:[],
        content:'',
        title:''
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
        this.column_w=$(this.$el).width()-950;
    },
    loadData(){
        this.blnLoading=true;
        this.$store.dispatch(InterBar.netbar_notice_list,{
            limit:this.pageNum,
            skip:this.pageNum *  this.pageIndex,
            sort:this.orderObj.sort,
            order:this.orderObj.order,
            time_range:this.time_range[0]?_.map(this.time_range,t=>tool.DateFormat(t,'yyyy-MM-dd')).join(' - '):'',
            content:this.content,
            title:this.title,
        }).then(res=>{
            this.blnLoading=false;
            if(!tool.msg(res,'','获取场所通知列表数据失败!'))return;
            this.data=this.converData(res.biz_body);

            if(this.data.length<=0){
                this.pageCount=0;
                this.pageSize=0;
            }else{
                this.pageCount=res.page.total;  
                this.pageSize=res.page.page_count;
            }
        });
    },
    converData(d){
        return _.map(d,c=>{
            return {
                id:c.notice_id,             //标识
                name:c.title,               //标题
                pulishTime:c.post_time_desc,//发布时间
                user:c.author,              //发布用户
                placeCount:c.receive_count, //通知场所数
                sign:c.sign_count,          //签收数
                unsign:c.un_sign_count,     //未签收数
                reply:c.reply_count,        //回复数
                accessory:c.accessory==1?'下载附件':''
            }
        });
    },
    //排序改变事件
    orderChange(type,val){
     let orderCache=this[type];

     if(orderCache==val) return;

     this.timeOrder=true;

     this[type]=val;

     let fieldMap={
        timeOrder:'post_time',
     };

     this.orderObj.sort=fieldMap[type];
     this.orderObj.order=val?'desc':'asc';
     this.loadData();

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
    //发布通知
    notices(){
        let s=this;
        tool.open(function(){
            let layIndex=0;
            let layeroDom=null;
            let layTitle=['发布内容编辑','选择场所范围'];
            let param={
                title:'发布场所通知',
                area:'650px',
                content:`<div class="Plan_Setting_pop" style="width:100%;height:100%;padding:10px;">
                            <div v-show="curPageIndex == 0">
                                <div class="row" style="margin:0px;margin-bottom:10px;">
                                    <div class="col-md-3" style="padding-top:10px;padding-left:25px;">通知标题:</div>
                                    <div class="col-md-8" style="padding-left:0px;">
                                        <el-input v-model="title" placeholder="请输入标题" />
                                    </div>
                                </div>
                                <div class="row" style="margin:0px;margin-bottom:10px;">
                                    <div class="col-md-3" style="padding-top:10px;padding-left:25px;">通知内容:</div>
                                    <div class="col-md-8" style="padding-left:0px;">
                                        <textarea v-model="content" style="height:200px;width:100%;resize:none;border-radius:5px;border: 1px solid #e5e5e5;" />
                                    </div>
                                </div>
                                <div class="row" style="margin:0px;margin-bottom:10px;">
                                    <div class="col-md-3" style="padding-top:10px;padding-left:25px;">场所回复:</div>
                                    <div class="col-md-3" style="padding-left:0px;padding-top:10px;">
                                        <el-radio v-model="is_reply"  label="1">是</el-radio>
                                        <el-radio v-model="is_reply"  label="2">否</el-radio>
                                    </div>
                                    <div class="col-md-6" style="padding-left:0px;">
                                        <span>有效期:</span>
                                        <div style="display:inline-block;"><el-date-picker v-model="timelimit" type="datetime" placeholder="选择日期" :picker-options="simpleTime"> </el-date-picker></div>
                                    </div>
                                </div>

                                <div class="row" style="margin:0px;margin-bottom:10px;">
                                    <div class="col-md-3" style="padding-top:10px;padding-left:25px;">附件路径:</div>
                                    <div class="col-md-2" style="padding-left:0px;position:relative;">
                                       <button type="button" class="btn btn-primary" @click="uploadBtnClick()">点击上传 <i v-if="blnUploadFile" class="fa fa-spinner fa-pulse" /></button>
                                       <input id="uploadFile" :data-url="url" name="files[]" type="file" style="width: 0px;position: absolute;top: 0px;right: 0px;bottom: 0px;margin: 0px;opacity: 0;direction: ltr;cursor: pointer;" />
                                    </div>
                                    <div class="col-md-7" style="padding-left:0px;">
                                        <div style="background-color:#e5e5e5;border-radius:5px;display: inline-block;padding:6px 10px;margin-left: 10px;" v-if="uploadFileName">
                                            <i class="fa fa-file-text-o" />{{uploadFileName}}<i class="fa fa-remove" @click="uploadFileName='';blnUploadFile=false;" style="cursor:pointer;" />
                                        </div>
                                    </div>
                                </div>
                                <div class="row" style="margin:0px;margin-bottom:10px;">
                                    <div class="col-md-3" style="padding-top:10px;padding-left:25px;"></div>
                                    <div class="col-md-8" style="padding-left:0px;font-size:12px;">
                                       支持上传不超过5MV的rar、zip、jpeg、gif、png、doc、xis、txt文件
                                    </div>
                                </div>
                            </div>

                            <div class="option_bar" style="text-align:right;" v-show="curPageIndex == 0">
                                <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
                                <button type="button" class="btn btn-success" :disabled="blngoNext" @click="goNext()">下一步</button>
                            </div>


                            <div v-show="curPageIndex == 1" style="overflow:hidden;">
                              <div class="col-md-5" style="height:300px;border:1px solid #e7eaec;border-radius:5px;padding-right:0px;width:45%;">
                                    <PlaceTree ref="placeTree" :rootNode="rootNode" @res="PlaceResult"></PlaceTree>
                                </div>
                                <div class="col-md-1"></div>
                                <div class="col-md-5"  style="height:300px;border:1px solid #e7eaec;border-radius:5px;padding-top:10px;padding-bottom:10px;padding-right:0px;width:45%;">
                                    <Scroll :listen="selPlaces">
                                        <div v-for="(p,i) in selPlaces" style="margin-bottom:5px;padding-right:40px;position:relative;padding-left:20px;">
                                            <span style="font-size:12px;position:absolute;left:0px;top:3px;">{{i+1}}.</span>{{p.name}} 
                                            <i @click="delPlace(p)" class="fa fa-remove delPlaceItem" style="position:absolute;right:20px;top:3px;"></i>
                                        </div>
                                    </Scroll>
                                </div>
                            </div>

                            <div class="option_bar" style="text-align:right;margin-top:10px;" v-show="curPageIndex == 1">
                                <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
                                <button type="button" class="btn btn-success" @click="goPre()">上一步</button>
                                <button type="button" class="btn btn-success" :disabled="blnSubmit || blnExecute" @click="ok_btn()"><span v-if="!blnExecute">确定</span> <i v-if="blnExecute" class="fa fa-spinner fa-pulse"></i></button>
                            </div>
                        </div>`,
                components:{PlaceTree,Scroll},
                store:s.$store,
                watch:{
                    curPageIndex(){
                        layer.title(`发布场所通知 - ${layTitle[this.curPageIndex]}`,layIndex)
                    },
                },
                computed:{
                    blngoNext(){
                        return !(this.title && this.content && this.is_reply && this.timelimit)
                    }
                },
                context:{
                    rootNode:{name:tool.cookie.get('region_name'),code:tool.cookie.get('region_code')},
                    simpleTime:{//限制选择今天之前的日期
                        disabledDate(time) {
                            return time.getTime() < Date.now() - 8.64e7;
                        }
                    },
                    url:ser.uri+'/netbar_manages/netbar_notice_attachment_upload',
                    uploadFileName:'',
                    curPageIndex:0,
                    blnSubmit:false,
                    blnExecute:false,
                    selPlaces:[],
                    title:'',
                    content:'',
                    is_reply:'1',
                    timelimit:'',
                    accessory:'',// 上传的文件标识（先调用上传接口上传文件，返回唯一标识）
                    blnUploadFile:false, //是否正在进行文件上传操作
                    //场所区域选择改变事件
                    PlaceResult(d){
                        let res =  _.chain(d).values().flatten().value();
                        param.selfData.selPlaces=res;
                    },
                    goPre(){
                        param.selfData.curPageIndex=param.selfData.curPageIndex-1<0?0:param.selfData.curPageIndex-1;
                    },
                    goNext(){
                        let d=param.selfData;
                        
                        param.selfData.curPageIndex++;
                    },
                    uploadBtnClick(){
                        layeroDom.find('#uploadFile').click();
                    },
                    ok_btn(){
                        let d=param.selfData;

                        if(s.blnUploadFile){tool.info('文件正在上传中...,请稍后！');return;}

                        s.$store.dispatch(InterBar.netbar_notice_add,{
                            title:d.title,
                            content:d.content,
                            is_reply:d.is_reply=='2'?0:1,
                            timelimit:tool.DateFormat(d.timelimit,'yyyy-MM-dd hh:mm:ss'),
                            target:_.map(d.selPlaces,c=>c.code).join(','),
                            accessory:d.accessory
                        }).then(res=>{
                            if(!tool.msg(res,'发布通知成功!','发布通知失败!')) return;
                            s.pageChange(0);

                            param.close();
                        });
                        
                    },
                    cancel_btn(){param.close();}
                },
                success(layero,index){
                    layeroDom=layero;
                    layIndex=index;
                    let uploadDom = layero.find('#uploadFile');
                    let s=param.selfData;

                    //初始化上传插件
                    uploadDom.fileupload({
                        dataType:'json',
                        autoUpload:false,
                        add:function(e,data){
                            let allowType=/(\.|\/)(rar|zip|jpeg|jpg|gif|png|doc|xis|txt)$/i;

                            var file=data.files[0];//上传文件
                            if(!file.name.match(allowType)){
                                tool.info('文件格式,只允许上传(rar、zip、jpeg、gif、png、doc、xis、txt)格式文件!');
                                return;
                            }

                            //判断文件大小
                            if(file.size>5*1024*1024){
                                tool.info('只能上传5M以内的文件数据!');
                                return;
                            }

                            s.uploadFileName=file.name;
                            s.blnUploadFile=true;
                            
                            // s.uploadFileName=data.files[0].name;
                            // s.uploadCurData=data;

                            // data.formData ={
                            //     encoding:s.encoding,
                            //     row_seperator:s.rowSep,
                            //     col_seperator:s.colSep,
                            //     is_first_column_name:s.containHeader>=1,
                            // };
                            
                            data.submit();
                            return;
                        },
                        done:function(e,data){

                            s.blnUploadFile=false;
                            if(data.result.msg.code!='successed'){
                                tool.info(data.result.msg.note);
                            }else{//成功
                               s.accessory=data.result.biz_body.file_name;
                               tool.info('上传成功!');
                            }
                        },
                        progressall: function (e, data) {
                            var progress = parseInt(data.loaded / data.total * 100, 10);
                           
                        }
                    });
                }
            };

            return param;
        }());
    },
    //批量删除
    datchRemove(){
        let s=this;
        let ids=_.chain(this.data).filter(d=>d.checked).map(d=>d.id).value();//选中的IDS
        if(ids.length<=0){tool.info('请选择需要删除的数据集合!');return;}

        tool.open(function(){
            let param={
                title:'提示',
                area:'400px',
                content:`<div class="Reset_Num_pop" style="width:100%;height:100%;">
                            <div style="padding: 30px 10px;text-align:center;"><i class="fa fa-warning" style="font-size:20px;margin-right:10px;color:red;" />您确定要删除选择的${ids.length}项通知吗?</div>
                            <div class="option_bar" style="text-align:right;padding:5px;">
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
                        s.blnBatchRemove=true;

                        s.$store.dispatch(InterBar.netbar_notice_del,{
                            notice_id:ids.join(',')
                        }).then(res=>{
                            s.blnBatchRemove=false;
                            if(!tool.msg(res,'批量删除成功!','批量删除失败!')) return;

                            //判断当前删除后页数变化没有
                            s.calPage(-ids.length);
                            s.pageChange((s.pageIndex+1)>=s.pageSize?s.pageSize-1:s.pageIndex);
                            param.close()
                        });
                        
                    },
                    cancel_btn(){param.close()}
                }
            };

            return param;
        }());
    },
    //通知详情
    noteDetail(d){
        let s=this;
        tool.open(function(){
            let param={
                title:'场所通知详情',
                area:['600px','500px'],
                content:`<div class="Place_Note_pop" style="width:100%;height:100%;">
                            <NoteDetail :code="code" />
                         </div>
                        `,
                components:{NoteDetail},
                store:s.$store,
                context:{
                    code:d.id,
                    blnExecute:false,
                    ok_btn(){param.close()},
                    cancel_btn(){param.close()}
                }
            };

            return param;
        }());
    },
    //下载附件
    loadBag(d){
        let s=this;
        if(!d.accessory) return;
        tool.open(function(){
            let param={
                title:'提示',
                area:'400px',
                content:`<div class="Reset_Num_pop" style="width:100%;height:100%;">
                            <div style="padding: 30px 10px;text-align:center;"><i class="fa fa-warning" style="font-size:20px;margin-right:10px;color:red;" />您确定要下载该附件进行查看吗?</div>
                            <div class="option_bar" style="text-align:right;padding:5px;">
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
                        window.location=`/netbar_manages/netbar_notice_attachment_download/${d.id}`;
                    },
                    cancel_btn(){param.close()}
                }
            };

            return param;
        }());
    },
    //删除数据项
    remove(d){
        let s=this;
        tool.open(function(){
            let param={
                title:'提示',
                area:'400px',
                content:`<div class="Reset_Num_pop" style="width:100%;height:100%;">
                            <div style="padding: 30px 10px;text-align:center;"><i class="fa fa-warning" style="font-size:20px;margin-right:10px;color:red;" />您确定要删除"${d.name}"通知吗?</div>
                            <div class="option_bar" style="text-align:right;padding:5px;">
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

                        s.$store.dispatch(InterBar.netbar_notice_del,{
                            notice_id:d.id
                        }).then(res=>{
                            if(!tool.msg(res,'删除成功!','删除失败!')) return;

                            //判断当前删除后页数变化没有
                            s.calPage(-1);
                            s.pageChange((s.pageIndex+1)>=s.pageSize?s.pageSize-1:s.pageIndex);
                            param.close()
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
.PlaceNote{width:100%;height:100%;padding:5px;}
.PlaceNote_container{width:100%;height:100%;background-color:white;}

.PlaceNote .option_bar{text-align:left;padding:5px 15px;line-height:40px;}
.PlaceNote .option_bar .item{display:inline-block;margin:2px 5px;}

.PlaceNote .right_option_bar {float:right;}
.PlaceNote .right_option_bar .item{display:inline-block;margin:2px 5px;}
.PlaceNote .right_option_bar .item:hover{cursor:pointer;}
html{.TCol(~".PlaceNote .right_option_bar .item:hover");}

.PlaceNote .cursor{cursor:pointer;}

.PlaceNote .page_container{.border('top');}

.PlaceNote .fa-caret-up{position:absolute;top:8px;cursor:pointer;font-size:14px;color:gray;}
.PlaceNote .fa-caret-down{position:absolute;top:17px;cursor:pointer;font-size:14px;color:gray;}

.PlaceNote .fa-caret-up.active,
.PlaceNote .fa-caret-down.active,
.PlaceNote .fa-caret-up:hover,
.PlaceNote .fa-caret-down:hover{
    color:white;
}

.PlaceNote .clickItem:hover{cursor:pointer;text-decoration:underline;}
html{.TCol(~".PlaceNote .clickItem");}

//列表显示样式
@header_H:40px;
.PlaceNote .table_header{height:@header_H;display:table;width:100%;border:none;color:white;}
html{.TCol(~".PlaceNote .table_header .row",'bg');}

.PlaceNote .table_header .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}
.PlaceNote .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;.border('bottom');background-color:white;}
.PlaceNote .table_header .column .sort_item .triangle-up:hover{cursor:pointer;}
html{.TCol(~".PlaceNote .table_header .column .sort_item .triangle-up:hover",'bbc');}

.PlaceNote .table_header .column .sort_item .triangle-down:hover{cursor:pointer;}
html{.TCol(~".PlaceNote .table_header .column .sort_item .triangle-down:hover",'btc');}

html{.TCol(~".PlaceNote .table_header .column .sort_item .triangle-up.active",'bbc');}

html{.TCol(~".PlaceNote .table_header .column .sort_item .triangle-down.active",'btc');}

.PlaceNote .table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";.border('bottom');}
.PlaceNote .table_body{width:100%;display:table;width:100%;border:none;}
.PlaceNote .table_body .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;}

.overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}
</style>
