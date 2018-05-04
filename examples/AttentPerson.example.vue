<!-- 关注人员例子页面组件 -->
<template>
    <div class="AttentPerson" :class="{unSelect:blnbatch}">
        <!--加载中标识-->
        <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index:100;">
            <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;"><i class="fa fa-spinner fa-pulse" style="color:#98e32c;"></i></div></div>
        </div>
        <!--左边框-->
        <div class="left_container">
            <div style="padding:5px;">
                <div class="input-group">
                    <input type="text" class="form-control" v-model="tag_label" placeholder="创建新标签">
                    <span class="input-group-addon"  @click="AddLabel()">+</span>
                </div>
            </div>

            <!--标签栏-->
            <div class="label_bar">
                <div class="left_item" @click="curShowTagId='';noDeFine=false;">
                    关注人员<span class="numver">{{labelCount}}</span>
                </div>
                <div class="label_child_bar">
                    <Scroll :listen="labels">
                        <div class="left_item" :class="{active:noDeFine}" @click="curShowTagId='';noDeFine=true;">
                            <div>
                                <div class="dootl"></div>未定义标签<span class="numver">{{undefineCount}}</span>
                            </div>

                        </div>

                        <div class="left_item" :class="{active:l.tag_id == curShowTagId}" v-for="(l,i) in labels" @click="curShowTagId=l.tag_id;noDeFine=false;">
                            <div v-if="showUplateLabelIndex!=i">
                                <div class="dootl"></div>{{l.tag_title}}<span class="numver">{{l.ajax_count || 0}}</span>
                                <div class="option_item" style="float:right;"><i class="fa fa-pencil" style="margin-right:10px;" @click.stop="showUplateLabelIndex=i"></i><i class="fa fa-trash-o" @click.stop="delLabel(l)"></i></div>
                            </div>
                            <div v-if="showUplateLabelIndex==i">
                                <input type="text" v-model="labelName" style="height:23px;width:100%;outline:none;color:black;" v-focus />
                            </div>
                        </div>
                    </Scroll>
                </div>
            </div>
        </div>
        <!--右边框-->
        <div class="right_container">
            <!--操作栏-->
            <div class="option_bar">
                <div style="width:190px;float:left;">
                    <el-dropdown class="sortDropDown" @command="orderChange" size="medium" style="margin-top:2px;" split-button type="default">
                        {{orders[curOrder]}}
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :command="i+''" v-for="(o,i) in orders">{{o}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <button v-show="!blnbatch" type="button" class="btn btn-default" style="margin-top:-4px;" @click="blnbatch=true">批量管理</button>
                <button v-show="blnbatch" @mousedown.stop="popMouseDown($event,'bottom',true);popType='labatch'" type="button" class="btn btn-default" style="margin-top:-4px;text-align:left;width:110px;position:relative;">添加到标签 <span style="color:#059cd3;font-size:20px;font-size: 20px;position: absolute;top: 2px;right: 10px;">+<span></button>
                <button v-show="blnbatch" @click="batchDel()" type="button" class="btn btn-default" style="margin-top:-4px;text-align:left;width:70px;position:relative;">删除 <span style="color:#ff8282;font-size:20px;font-size: 14px;position: absolute;top: 6px;right: 10px;"><i class="fa fa-trash-o"></i><span></button>
                <button v-show="blnbatch" @click="blnbatch=false;" type="button" class="btn btn-default" style="margin-top:-4px;text-align:left;width:130px;position:relative;">退出批量管理 <span style="color:gray;font-size:20px;font-size: 14px;position: absolute;top: 6px;right: 10px;"><i class="fa fa-arrow-right"></i><span></button>
                <span v-show="blnbatch" style="margin-left:10px;margin-right:20px;font-size: 12px;">已选择{{batchData.length}}</span>
                <span v-show="blnbatch" @click="batchData=[]" style="font-size:12px;cursor:pointer;">取消选择</span>

            
                <div style="float:right;width:200px;margin-top:2px;">
                    <div class="input-group">
                        <input type="text" class="form-control" v-model="searchKey" placeholder="输入标题或特征">
                        <span class="input-group-addon"  @click="search()"><i class="fa fa-search" style="font-size:16px;"></i></span>
                    </div>
                </div>
                <button type="button" @click="addAttention()" class="btn btn-default" style="margin-top:-4px;text-align:left;width:125px;position:relative;float:right;margin-top: 2px;">添加关注人员 <span style="color:#059cd3;font-size:20px;font-size: 20px;position: absolute;top: 2px;right: 10px;">+<span></button>
            
            </div>
            <!--内容展示区域-->
            <div class="content_bar">
                <div class="content_info">
                    <Scroll :listen="data">
                        <!--卡片项-->
                        <div class="card" :class="{active:blnbatch && isBatchData(d)}" v-for="(d,i) in data" @click="toggleBatch(d)" @mouseenter="card_mouseover(d)">
                            <!--内容展示区域-->
                            <div class="info">
                                <!--选中标识-->
                                <div class="iden_container">
                                    <i class="fa fa-check iden"></i>
                                </div>
                                <!--照片栏-->
                                <div class="photo_bar">
                                    <img :src="getPhotoUrl(d)" style="width:100%;height:100%;" />
                                </div>
                                <!--信息栏-->
                                <div class="info_bar">
                                    <div class="item" @click="showUpdateNameIndex=i;curUpdateData=d;name=d.focus_title;">
                                        <span style="font-weight:600;" v-show="showUpdateNameIndex!=i">{{d.focus_title}}</span>
                                        <input type="text" v-model="name" @mousedown.stop="noHandler()" style="height:20px;outline:none;color:black;" v-focus v-if="showUpdateNameIndex==i" />
                                    </div>
                                    <div class="item child" @mousedown.stop="popMouseDown($event,'bottom');popType='te';curUpdateData=d"><span>{{d.focus_property[0]?d.focus_property[0].n_note || d.focus_property[0].t_note:''}}</span><span class="content" style="margin-left:10px;">{{d.focus_property[0]?d.focus_property[0].k:''}}</span> <i style="float:right;" class="fa fa-sort-down icon" ></i></div>
                                    
                                    <div class="item child" @mousedown.stop="popMouseDown($event,'bottom');popType='la';curUpdateData=d">
                                        <span class="divEllipsis" style="display:inline-block;width:170px;">
                                            <div class="labelTip" v-for="s in d.focus_tags.slice(0,3)">{{s.note || s.tag_title}}</div>
                                        </span>
                                        <i style="float:right;" class="fa fa-sort-down icon"></i>
                                    </div>
                                    
                                    <div class="item child divEllipsis" @mousedown.stop="regionSel();curUpdateData=d"><span style="float:left;">关注区域:</span><span class="divEllipsis" style="margin-left:10px;display:inline-block;width:105px;float:left;" :title="converRegionTip(d)"><span v-for="f in d.focus_locus_ids" style="margin-right:5px;">{{f.note}}</span></span> <i style="float:right;" class="fa fa-sort-down icon"></i></div>
                                </div>
                            </div>
                            <!--底部显示区域-->
                            <div class="bottom" @click="lookIndent(d)">
                                <span>报警{{d.alarms}}</span>
                                <span style="float:right;">最后报警时间&nbsp;{{parseInt(d.alarm_last_time)?converTime(d.alarm_last_time):'无'}}</span>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                    </Scroll>
                </div>
                <div class="page page_container">
                    <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageIndex+1}}</span></span>
                    <div class="firstPage" @click="pageChange(0)">首页</div>
                    <div class="prePage" @click="pageChange(pageIndex-1)">上一页</div>
                    <div class="nextPage" @click="pageChange(pageIndex+1)">下一页</div>
                </div>
            </div>
        </div>

        <!--悬浮操作框-->
        <div class="pop" v-if="popLeft!=-1000" style="width:300px;backrgound-color:red;position:absolute;z-index:100;" @mousedown.stop="noHandler()" :style="{left:popLeft+'px',top:popTop+'px'}">
            <!--标题栏-->
            <div class="title_bar">
               {{popType=='te'?'特征详情':'标签'}} <span><i class="fa fa-sort-up" style="float:right;margin-top: 10px;cursor:pointer;" @click="popLeft=-1000;popTop=-1000;"></i></span>
            </div>
            <!--内容栏-->
            <div class="contentinfo_bar">
                <DetailInfo v-if="popType=='te'" :data="curUpdateData" />
                <LableInfo v-if="popType=='la'" :label="labels" :data="curUpdateData" />
                <LableInfos v-if="popType=='labatch'" :label="labels" :data="batchData"  />
            </div>
        </div>

        <!--隐藏选择关注区域-->
        <div style="display:none;">
            <PlaceSearch ref="PlaceSel" :defautVal="curUpdateDelRegion" :blnNoSaveDelVal="true" c_searchKind='0'  @place_res="region_change"></PlaceSearch>
        </div>
    </div>
</template>

<script>
import { mapState,mapMutations} from 'vuex'
import Scroll from 'components/scroll'
import InputDir from 'components/Input'
import PlaceSearch from 'components/PlaceSearch'
import MulSelect from 'components/MulSelect'
import { GetFocusPerson , AddFocusPersonLabel ,GetFocusPersonLabel,GetTagCount,DelFocusPersonLabel,UpdateFocusPersonLabel , DelFocusPerson ,UpdateFocusPerson,GetIdentData
        ,DelFocusPersonProperty,AddFocusPersonProperty,AddFocusPerson,AddMoreFocusPersonProperty,DelMoreFocusPersonProperty,UpdateFocusPersonRegion,UpdateFocusPersonName} from '../store/mutation-types'
export default {
  name: 'AttentPerson',
  props:['blnNoInit'],
  components:{
    Scroll,
    PlaceSearch,
    DetailInfo:{
        components:{Scroll},
        props:['data'],
        template:`<div class="detailInfo">
                    <div class="info_item" v-for="(d,i) in data.focus_property">{{d.t_note}}:&nbsp;&nbsp;{{d.k}} 
                        <el-tooltip  effect="light" content="删除" placement="top" style="float:right;margin-top:2px;">
                            <i class="fa fa-remove del" @click="del(d,i)"></i>
                        </el-tooltip>
                    </div>

                    <div class="info_item">
                        <div class="inputDropDown">
                            <div class="dropDownItem">
                                <i class="fa fa-sort-down" @mousedown.stop="blnShowDropDown=!blnShowDropDown;"></i>
                                <div style="width:100%;height:100%;padding:0px 10px;" @mousedown.stop="blnShowDropDown=!blnShowDropDown;">{{type?type.name:'请选择'}}</div>
                                <div class="dropDownContent" v-show="blnShowDropDown">
                                    <div class="selectItem" v-for="t in types" @mousedown.stop="mousedownItem(t)">
                                        {{t.name}}
                                    </div>
                                </div>
                            </div>
                            <div class="dropDownItem" style="border-left:none;" v-if="type && type.val=='vid'">
                                <i class="fa fa-sort-down" @mousedown.stop="blnShowVidDropDown=!blnShowVidDropDown;"></i>
                                <div style="width:100%;height:100%;padding:0px 10px;" @mousedown.stop="blnShowVidDropDown=!blnShowVidDropDown;">
                                    <input type="text" class="vidTypeInput" v-model="vidType" />
                                </div>
                                <div class="dropDownContent" v-show="blnShowVidDropDown" :style="{height:vidTypes.length>10?'190px':'auto'}">
                                    <Scroll :listen="vidTypes">
                                        <div class="selectItem divEllipsis" v-for="t in vidTypes" @mousedown.stop="mousedownVidItem(t)">
                                            {{t.name}}
                                        </div>
                                    </Scroll>
                                </div>
                            </div>
                            <div class="addBtn" style="cursor:pointer;" @click="add()">+</div>
                            <div class="input" :class="{double:type && type.val=='vid'}"><input type="text" v-model="key" /></div>
                            
                        </div>
                    </div>
                  </div>`,
        computed:mapState({
            VirType:state=>{return state.VirType;},
        }),
        watch:{
            type(){
                this.vidType='';
                this.vidTypeVal='';
            },
            vidType(){
                if(this.vidType==''){vidTypeVal='';this.vidTypes=this.VirType.frequently_type;return;}
                this.vidTypes=_.filter(this.VirType.vid_type,t=>t.name.indexOf(this.vidType)>=0);
            }
        },
        data(){
            return{
                blnShowDropDown:false,
                blnShowVidDropDown:false,
                mousedownid:0,
                type:null,//大类型(手机/MAC/虚拟身份)
                vidType:'',
                vidTypeVal:'',
                vidTypes:[],
                types:[
                    {name:'虚拟身份',val:'vid'},
                    {name:'手机',val:'mobile'},
                    {name:'身份证',val:'cert'},
                    {name:'MAC',va:'mac'},
                ],
                key:''

            }
        },
        mounted(){
            this.mousedownid=Fx.SingleBind('mousedown',$('body'), (e)=> {
                this.blnShowDropDown=false;
            });

            this.vidTypes=this.VirType.frequently_type;

        },
        destroyed(){
            Fx.ClearBind('mousedown',$('body'),this.mousedownid);
        },
        methods:{
            mousedownItem(t){
                this.type=t;
                this.blnShowDropDown=false;
            },
            mousedownVidItem(t){
                this.vidType=t.name;
                this.vidTypeVal=t.value;
            },
            del(d,index){
                tool.confirm('确定要删除该特征信息吗?',['确定','取消'],()=>{
                    this.$store.dispatch(DelFocusPersonProperty,{
                        focus_id:this.data.focus_id,
                        focus_property_item:d,
                    }).then(res=>{
                        if(!tool.msg(res,'删除成功！')) return;
                        this.data.focus_property.splice(index,1);
                    });
                    
                },function(){});
            },
            add(){
              
              let pro={
                    k:this.key,
                    t:this.type.val,
                    n:this.vidTypeVal,
                };
              this.$store.dispatch(AddFocusPersonProperty,{
                focus_id:this.data.focus_id,
                focus_property_item:pro
              }).then(res=>{
                if(!tool.msg(res,'添加成功!')) return;
                pro.t_note=this.type.name;
                this.data.focus_property.push(pro);
              });
            }
        }
    },
    LableInfo:{
        components:{Scroll},
        props:['label','data','blnClearAll'],
        template:`<div class="LableInfo">
                    <div class="lable_container">
                        <Scroll :listen="data.focus_tags">
                            <div style="display:inline-block;margin-right:10px;" v-for="d in orderLabel">
                                <i class="fa" @click="toogleLable(d)" :class="{
                                'fa-square-o':!isSelect(d),
                                'fa-check-square-o':isSelect(d)}" :style="{color:isSelect(d)?'green':'gray',cursor:'pointer'}">
                                </i> {{d.tag_title || d.note }} 
                            </div>
                        </Scroll>
                    </div>
                    <div class="option_container">
                        <div class="btn_container" style="cursor:pointer;" @click="AddLabel()">+</div>
                        <div class="input_container">
                            <input type="text" v-model="key" placeholder="创建新标签" />
                        </div>
                    </div>
                  </div>`,
        data(){
            return {
                key:''
            }
        },
        computed:{
            orderLabel(){
                let noSelLabel=_.filter(this.label,l=>{ return !_.find(this.data.focus_tags,f=>(f.id || f.tag_id)==(l.id || l.tag_id))})
                return [...this.data.focus_tags,...noSelLabel];
            }
        },
        methods:{
            AddLabel(){
                if(!this.key){tool.info('请先输入标签内容!');return;}
                this.$store.dispatch(AddFocusPersonLabel,{tag_title:this.key}).then(res=>{
                    if(!tool.msg(res,'添加成功!')) return;

                    res.biz_body[0].ajax_count=0;
                    this.label.push(res.biz_body[0]);
                });
            },
            toogleLable(d){
                let index=_.findIndex(this.data.focus_tags,t=>(t.id || t.tag_id)==(d.tag_id || d.id));
                if(index>=0){
                    this.$store.dispatch(DelMoreFocusPersonProperty,{
                        tag_id:d.id || d.tag_id,
                        focus_ids:[this.data.focus_id]
                    }).then(res=>{
                        if(!tool.msg(res)) return;
                        this.data.focus_tags.splice(index,1);

                        let label =_.find(this.label,l=>(l.id || l.tag_id)==(d.id || d.tag_id));
                        label.ajax_count= (label.ajax_count-1)>0 ? (label.ajax_count-1) : 0;
                    });
                   
                }else{
                    this.$store.dispatch(AddMoreFocusPersonProperty,{
                        tag_id:d.id || d.tag_id,
                        focus_ids:[this.data.focus_id]
                    }).then(res=>{
                        if(!tool.msg(res)) return;
                        this.data.focus_tags.push(d);

                        let label =_.find(this.label,l=>(l.id || l.tag_id)==(d.id || d.tag_id));
                        label.ajax_count= (label.ajax_count || 0) + 1;
                    });
                }

                this.$parent.getSpeLabelCount();
            },
            isSelect(d){
                return _.find(this.data.focus_tags,l=>{return ((l.id || l.tag_id)+'')==((d.tag_id || d.id)+'')});
            }
        }
    },
    LableInfos:{
        components:{Scroll},
        props:['label','data'],
        template:`<div class="LableInfo">
                    <div class="lable_container">
                        <Scroll >
                            <div style="display:inline-block;margin-right:10px;" v-for="d in label">
                                <i class="fa" @click="toogleLable(d)" :class="{
                                'fa-square-o':!isSelect(d),
                                'fa-check-square-o':isSelect(d)}" :style="{color:isSelect(d)?'green':'gray',cursor:'pointer'}">
                                </i> {{d.tag_title}}
                            </div>
                        </Scroll>
                    </div>
                    <div class="option_container">
                        <div class="btn_container" style="cursor:pointer;" @click="AddLabel()">+</div>
                        <div class="input_container">
                            <input type="text" v-model="key" placeholder="创建新标签" />
                        </div>
                    </div>
                  </div>`,
        data(){
            return {
                key:'',
                focus_tags:[],
            }
        },
        methods:{
            AddLabel(){
                if(!this.key){tool.info('请先输入标签内容!');return;}

                this.$store.dispatch(AddFocusPersonLabel,{tag_title:this.key}).then(res=>{
                    if(!tool.msg(res,'添加成功!')) return;

                    res.biz_body[0].ajax_count=0;
                    this.label.push(res.biz_body[0]);
                });
            },
            toogleLable(d){
                if(this.data.length<=0){tool.info('请选择要操作的选项!');return;}

                let index=_.findIndex(this.focus_tags,t=>(t.id || t.tag_id)==d.tag_id);
                if(index>=0){
                    this.$store.dispatch(DelMoreFocusPersonProperty,{
                        tag_id:d.id || d.tag_id,
                        focus_ids:_.map(this.data,d=>d.focus_id)
                    }).then(res=>{
                        if(!tool.msg(res)) return;
                        this.focus_tags.splice(index,1);

                        _.each(this.data,f=>{
                            let index =_.findIndex(f.focus_tags,f=>((f.id || f.tag_id) + '')==(d.tag_id + ''));
                            if(index>=0){
                                f.focus_tags.splice(index,1);
                                let label =_.find(this.label,l=>(l.id || l.tag_id)==(d.id || d.tag_id));
                                label.ajax_count= (label.ajax_count-1)>0 ? (label.ajax_count-1) : 0;
                            }
                        })
                    });
                   
                }else{
                    this.$store.dispatch(AddMoreFocusPersonProperty,{
                        tag_id:d.id || d.tag_id,
                        focus_ids:_.map(this.data,d=>d.focus_id)

                    }).then(res=>{
                        if(!tool.msg(res)) return;
                        this.focus_tags.push(d);

                         _.each(this.data,f=>{
                            let index =_.findIndex(f.focus_tags,f=>(f.id || f.tag_id)==(d.tag_id + ''));
                            if(index<0){
                                f.focus_tags.push(d);
                                let label =_.find(this.label,l=>(l.id || l.tag_id)==(d.id || d.tag_id));
                                label.ajax_count= (label.ajax_count || 0) + 1;
                            }
                        })
                    });
                }

                this.$parent.getSpeLabelCount();
            },
            isSelect(d){
                return _.find(this.focus_tags,l=>{return ((l.id || l.tag_id)+'')==(d.tag_id+'')});
            }
        }
    }
  },
  data () {
    return {
      data:[],
      labels:[],
      popLeft:-1000,
      popTop:-1000,
      mousedownid:0,
      pageIndex:0,
      limit:15,
      showUpdateNameIndex:-1,//当前修改名字索引
      showUplateLabelIndex:-1,
      popType:'te',//弹窗类型(te:特征,la:标签)
      tag_label:'',//标签输入内容
      labelCount:0,//关联标签总数
      undefineCount:0,//未定义标签数
      labelName:'',//标签修改名称
      labelNameChange:null,
      nameChange:null,
      curUpdateLabel:null,
      searchPersonKey:'',//当前查询任务标签关键字
      blnLoading:false,
      orders:['默认排序','按报警数降序','按报警时间降序'],
      curOrder:2,
      ordersVal:['','alarms','alarm_last_time'],
      blnbatch:false,
      batchData:[],
      searchKey:'',
      curUpdateData:[],
      curShowTagId:'',
      noDeFine:false,//是否显示为定义标签
      name:'',
      blnDragSelect:false,//是否开启拖动选择
      mouseDownId:0,
      mouseUpId:0
    }
  },
  watch:{
    labels(){
        let s=this;
        for(let i=0;i<s.labels.length;i++){
            let l=s.labels[i];
            if(l.ajax_count!=''){continue;}
            this.$store.dispatch(GetTagCount,{id:l.tag_id}).then(res=>{
                l.ajax_count=res.biz_body.count;
            });
        }
    },
    labelName(){
        this.curUpdateLabel=this.labels[this.showUplateLabelIndex];
        this.labelNameChange.next(this.labelName);
    },
    name(){
        this.nameChange.next(this.name);
    },
    searchPersonKey(){
        this.pageChange(0);
    },
    blnbatch(){
        this.batchData=[];
    },
    curOrder(){
        this.pageChange(this.pageIndex);
    },
    curShowTagId(){
        this.pageChange(0);
    },
    noDeFine(){
        this.pageChange(0);
    }
  },
  computed:{
      curUpdateDelRegion(){
          if(!this.curUpdateData) return '';
          
          _.each(this.curUpdateData.focus_locus_ids,f=>{f.type='1'});
          return JSON.stringify(this.curUpdateData.focus_locus_ids);
      }
  },
  directives: {
    focus: {
        // 指令的定义
        inserted: function (el) {
        el.focus()
        }
    }
  },
  mounted(){
    //获取标签信息
    this.GetFocusPersonLabel();

    if(this.blnNoInit) return;
    this.mousedownid=Fx.SingleBind('mousedown',$('body'), (e)=> {
      this.popLeft=-1000;
      this.popTop=-1000;
      this.showUpdateNameIndex=-1;
      this.showUplateLabelIndex=-1;
    });

    //获取关注人员信息
    this.pageChange(0);
    //获取关联标签总数
    this.getSpeLabelCount();

    let Rx=this.$store.getters.Rx;
    this.labelNameChange=(new Rx.Subject()).debounceTime(500);
    this.labelNameChange.subscribe(v=>{
        if(!v) return;

        this.$store.dispatch(UpdateFocusPersonLabel,{tag_id:this.curUpdateLabel.tag_id,tag_title:v}).then(res=>{
            if(!tool.msg(res)) return;
            this.curUpdateLabel.tag_title=v;
        });
    });

    this.nameChange=(new Rx.Subject()).debounceTime(500);

    this.nameChange.subscribe(v=>{
        if(!v) return;
        
        this.$store.dispatch(UpdateFocusPersonName,{focus_id:this.curUpdateData.focus_id,focus_title:v}).then(res=>{
            if(!tool.msg(res)) return;
            this.curUpdateData.focus_title=v;
        });
    });


    //判断是否正在进行拖动选择操作
    this.mouseDownId=Fx.SingleBind('mousedown',$(this.$el),(e)=>{
        if(!this.blnbatch) return;
        this.blnDragSelect=true;
    });

    this.mouseUpId=Fx.SingleBind('mouseup',$(this.$el),(e)=>{
        if(!this.blnbatch) return;
        this.blnDragSelect=false;
    });
  },
  destroyed(){
    if(this.blnNoInit) return;
    Fx.ClearBind('mousedown',$('body'),this.mousedownid);
    Fx.ClearBind('mousedown',$(this.$el),this.mouseDownId);
    Fx.ClearBind('mouseup',$(this.$el),this.mouseUpId);
  },
  methods:{
    noHandler(){},
    getPhotoUrl(d){
        let type=d.focus_property[0]?d.focus_property[0].t:'';
        return '/cert/' + (type=='cert'?d.focus_property[0].k:'0');
    },
    //标签项进入卡片项
    card_mouseover(d){
        if(!this.blnDragSelect) return;
        
        let index=_.findIndex(this.batchData,b=>b.focus_id==d.focus_id);
        if(index>-1){
            this.batchData.splice(index,1);
        }else{
            this.batchData.push(d);
        }
        d.blnAssess=true;
    },
    //查看报警数据
    lookIndent(d){
       let s=this;

      tool.open(function(){
        let html=`
          <div class="table_header">
              <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                  <thead><tr>
                      <th style="width:150px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">报警姓名</div></th>
                      <th :style="{width:w+'px'}" style="border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div :style="{width:w+'px'}" class="divEllipsis">证件号</div></th>
                      <th :style="{width:w+'px'}" style="border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div :style="{width:w+'px'}"class="divEllipsis">手机</div></th>
                      <th style="width:150px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">MAC</div></th>
                      <th style="width:150px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">报警时间</div></th>
                      <th style="width:150px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">报警场所</div></th>
                      <th style="width:150px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">报警来源</div></th>
                      
                  </tr></thead>
              </table>
          </div>
          <div class="table_body">
            <Scroll :listen="data" ref="detailSrcoll">
                <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                  <tbody><tr v-for="d in data">
                      <td style="width:150px;border-top:0px;border-right:1px solid #ddd;" class="text-center" :title="d.customer_name"><div style="width:150px;" class="divEllipsis">{{d.customer_name}}</div></td>
                      <td :style="{width:w+'px'}" style="border-top:0px;border-right:1px solid #ddd;" class="text-center" :title="d.certificate_code"><div :style="{width:w+'px'}" class="divEllipsis">{{d.certificate_code}}</div></td>
                      <td :style="{width:w+'px'}" style="border-top:0px;border-right:1px solid #ddd;" class="text-center" :title="d.mobile"><div :style="{width:w+'px'}" class="divEllipsis">{{d.mobile}}</div></td>
                      <td style="width:150px;border-top:0px;border-right:1px solid #ddd;" class="text-center" :title="d.mac"><div style="width:150px;" class="divEllipsis">{{d.mac}}</div></td>
                      <td style="width:150px;border-top:0px;border-right:1px solid #ddd;" class="text-center" :title="d.policeTime"><div style="width:150px;" class="divEllipsis">{{converTime(d.logtime)}}</div></td>
                      <td style="width:150px;border-top:0px;border-right:1px solid #ddd;" class="text-center" :title="d.netbar_name"><div style="width:150px;" class="divEllipsis">{{d.netbar_name}}</div></td>
                      <td style="width:150px;border-top:0px;border-right:1px solid #ddd;" class="text-center" :title="d.source_type"><div style="width:150px;" class="divEllipsis">{{d.source_type}}</div></td>
                      
                  </tr></tbody>
              </table>
            </Scroll>
          </div>
        `;
        let param={
            title:'人员信息',
            area:['1000px','600px'],
            content:`<div class="LookPersonList_pop pop" style="width:100%;height:100%;overflow: hidden;background-color:rgba(47, 51, 65, 0.9) !important;color:white;">${html}</div>`,
            components:{Scroll},
            store:s.$store,
            context:{
              w:0,
              data:[],
              converTime(time){
                return tool.DateByTimestamp(time,'yyyy-MM-dd mm:hh:ss');
              }
            },
            success(layero){
              param.selfData.w=(layero.width()-750)/2;

              s.$store.dispatch(GetIdentData,{focus_id:d.focus_id})
              .then(res=>{
                if(!tool.msg(res,'','获取数据失败!')) return;
                param.selfData.data=res.biz_body;

              });
            }
        }

        return param;
      }());

    },
    //获取特定标签数据
    getSpeLabelCount(){
        //获取关联标签总数
        this.$store.dispatch(GetTagCount,{id:''}).then(res=>{
            this.labelCount=res.biz_body.count;
        });
        //获取未定义标签数
        this.$store.dispatch(GetTagCount,{id:'',not_define:true}).then(res=>{
            this.undefineCount=res.biz_body.count;
        });
    },
    //转化关注区域提示信息
    converRegionTip(d){
        return _.map(d.focus_locus_ids,f=>f.note).join(',');
    },
    //区域选择弹窗事件
    regionSel(){
        if(this.blnbatch) return;
        this.$refs.PlaceSel.Pop();
    },
    //区域选择改变事件
    region_change(obj,val){

        let regions=val.regions || [];
        if(regions.length<=0){
            this.$store.dispatch(UpdateFocusPersonRegion,{focus_ids:[this.curUpdateData.focus_id],focus_locus_ids:[]}).then(res=>{
                if(!tool.msg(res)) return;
                this.curUpdateData.focus_locus_ids.splice(0,this.curUpdateData.focus_locus_ids.length);
            });
            
        }else{
            this.$store.dispatch(UpdateFocusPersonRegion,{focus_ids:[this.curUpdateData.focus_id],focus_locus_ids:_.map(regions,r=>r.code)}).then(res=>{
                if(!tool.msg(res)) return;

                _.each(regions,r=>{
                    this.curUpdateData.focus_locus_ids.push({
                        code:r.code,
                        note:r.name,
                        type:'1'
                    });
                });       
            });
        
        }
    },
    popMouseDown(e,dir,blnShow){
        if(this.blnbatch && !blnShow) return;

        let dom =$(e.target || e.srcElement).parents('.child'),
            poffset=$(this.$el).offset();
        dom = dom.length<=0? $(e.target || e.srcElement):dom;

     
        this.popTop=dom.offset().top - poffset.top + (dir=='bottom'?tool.getHeight(dom[0]):0);
        this.popLeft=dom.offset().left - poffset.left;
    },
    //获取关注人员信息
    GetPeson(index){
        index=index<0?0:index;
        
        this.blnLoading=true;
        this.$store.dispatch(GetFocusPerson,{
                                             key:this.searchPersonKey,
                                             tag_id:this.curShowTagId,
                                             not_define:this.noDeFine,
                                             sort_by:this.ordersVal[this.curOrder],
                                             limit:this.limit,
                                             skip:this.limit*index}).then(res=>{
            this.blnLoading=false;
            this.data=res.biz_body;
    
            //console.log(tool.Clone(this.data));
            if(res.biz_body.length<=0){tool.info('暂无数据!');return;}
            this.pageIndex=index;
        });
    },
    //获取标签信息
    GetFocusPersonLabel(){
        this.$store.dispatch(GetFocusPersonLabel,{tag_title:''}).then(res=>{
            this.labels=_.map(res.biz_body,r=>{
                r.ajax_count='';

                return r;
            });
        });
    },
    pageChange(index){
      this.GetPeson(index);
      this.batchData=[];
    },
    //添加标签
    AddLabel(){
        if(!this.tag_label){tool.info('请输入标签名称!'); return;}
        this.$store.dispatch(AddFocusPersonLabel,{tag_title:this.tag_label}).then(res=>{
            if(!tool.msg(res,'添加成功!')) return;

            res.biz_body[0].ajax_count='';
            this.labels.push(res.biz_body[0]);

        });
    },
    //删除标签
    delLabel(d){
        this.$store.dispatch(DelFocusPersonLabel,{tag_id:d.tag_id}).then(res=>{
            if(!tool.msg(res,'删除成功!')) return;

            let index=_.findIndex(this.labels,l=>l.tag_id==d.tag_id);
            this.labels.splice(index,1);

            //清除人员数据中的标签数据
            _.each(this.data,v=>{

                let index =_.findIndex(v.focus_tags,l=>(l.id || l.tag_id)==(d.tag_id +''));
 
                v.focus_tags.splice(index,1);
            });
        });
    },
    //排序改变事件
    orderChange(val){
        this.curOrder=val;
    },
    //判断数据是否已被选中为批量操作数据
    isBatchData(d){
        return _.findIndex(this.batchData,f=>f.focus_id==d.focus_id)>=0;
    },
    //选择或删除批量数据
    toggleBatch(d){
        let index = _.findIndex(this.batchData,f=>f.focus_id==d.focus_id);
        if(index>=0){
            this.batchData.splice(index,1);
        }else{
            this.batchData.push(d);
        }
    },
    //批量删除
    batchDel(){
        if(this.batchData.length<=0){tool.info('请先选择需要删除的项!'); return;}
        this.$store.dispatch(DelFocusPerson,{focus_id:_.map(this.batchData,b=>b.focus_id)}).then(res=>{
            if(!tool.msg(res,'删除成功!')) return;

     
            this.data=_.filter(this.data,d=>{
               return !_.find(this.batchData,f=>f.focus_id ==d.focus_id); 
            });
            
        });
    },
    search(){
        //if(!this.searchKey){tool.info('请填入您要查询的条件!'); return;}
        this.searchPersonKey=this.searchKey;f
    },
    //添加关注人员
    addAttention(defval,callback,blnUpdate){
      
        if(defval && defval.focus_locus_ids){
            _.each(defval.focus_locus_ids,f=>{f.type=1});
        }
        if(defval && defval.focus_tags){
            _.each(defval.focus_tags,f=>{f.tag_title=f.note;f.tag_id=f.id;});
        }

        let VirType = this.$store.state.VirType;
        let store=this.$store;
        let s=this;
        let labels=_.map(s.labels,r=>{r.name=r.tag_title; return r;});

        tool.open(function(){
            let mousedownid=0;
            let html=`
                    <div class="detailInfo">
                        <el-input v-model="name" placeholder='输入姓名' />
                        <div class="info_item" style="margin-top:10px;margin-bottom:0px;height:120px;border: 1px solid #d4d4d4;">
                            <div class="inputDropDown">
                                <div class="dropDownItem" style="border-top:0px;border-left: 0px;">
                                    <i class="fa fa-sort-down" @mousedown.stop="blnShowDropDown=!blnShowDropDown;"></i>
                                    <div style="width:100%;height:100%;padding:0px 10px;background-color: #e5e5e5;" @mousedown.stop="blnShowDropDown=!blnShowDropDown;">{{type?type.name:'类型'}}</div>
                                    <div class="dropDownContent" style="z-index:100;" v-show="blnShowDropDown">
                                        <div class="selectItem" v-for="t in types" @mousedown.stop="mousedownItem(t)">
                                            {{t.name}}
                                        </div>
                                    </div>
                                </div>
                                <div class="dropDownItem" style="border-left:none;border-top:0px;" v-if="type && type.val=='vid'">
                                    <i class="fa fa-sort-down" @mousedown.stop="blnShowVidDropDown=!blnShowVidDropDown;"></i>
                                    <div style="width:100%;height:100%;padding:0px 10px;background-color: #e5e5e5;" @mousedown.stop="blnShowVidDropDown=!blnShowVidDropDown;">
                                        <input type="text" style="background-color: #e5e5e5;height:100%;" placeholder="选择类型" class="vidTypeInput" v-model="vidType" />
                                    </div>
                                    <div class="dropDownContent" v-show="blnShowVidDropDown" :style="{height:vidTypes.length>10?'190px':'auto','z-index':100}">
                                        <Scroll :listen="vidTypes" :store="store">
                                            <div class="selectItem divEllipsis" v-for="t in vidTypes" @mousedown.stop="mousedownVidItem(t)">
                                                {{t.name}}
                                            </div>
                                        </Scroll>
                                    </div>
                                </div>
                                <div class="addBtn" style="cursor:pointer;" @click="add()">+</div>
                                <div class="input" :class="{double:type && type.val=='vid'}" style="border-bottom: 1px solid #d4d4d4;border-top: 0px;background-color: #e5e5e5;"><input style="background-color: #e5e5e5;" type="text" v-model="key" /></div>
                                
                            </div>
                        
                            <div style="height:80px;">
                                <Scroll :store="store" :listen="focus_property">
                                    <div v-for="(f,i) in focus_property" style="margin:5px;">
                                        {{i+1}}. <span style="margin-left:5px;margin-right:15px;">{{f.name || f.t_note}}</span><span>{{f.k}}</span>
                                        <span style="float:right;cursor:pointer;margin-right:15px;" @click="delPro(i)"><i class="fa fa-remove"></i></span>
                                    </div>
                                </Scroll>
                            </div>
                        </div>
                        
                        <div style="line-height:36px;padding:10px 0px;border-bottom: 1px solid #bdbdbd;">
                                <span style="width:80px;float: left;color: #bdbdbd;padding-left: 5px;">关注区域</span>
                                <div style="margin-left:80px;"><PlaceSearch :defautVal="defRegionVal" c_searchKind='0' :store="store"  @place_res="region_change"></PlaceSearch></div>
                        </div>
                        <div style="width:100%;margin-top:10px;" class="label_set">
                            <div class="btn" @click="selLabel()" style="margin-right:0px;"><i class="fa fa-pencil"></i></div>
                            <div style="margin-right:40px;line-height:30px;padding:0px 10px;">
                                <span v-if="defaultVal.length<=0">添加标签</span>
                                <div class="label_item" v-for="(d,i) in defaultVal">{{d.tag_title}}<div class="del_btn" @click="delLable(i)">X</div></div>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                        <div style="text-align:right;margin-top:10px;">
                                <button type="button" class="btn btn-success" style="font-size:12px;" @click="complete()"><span v-if="!blnAdding">完成</span><span v-if="blnAdding"><i class="fa fa-spinner fa-spin"></i></span></button>
                                <button type="button" class="btn btn-default" style="font-size:12px;" @click="close()">关闭</button>
                        </div>
                    </div>
                    `;
            let param={
                title:blnUpdate?'修改关注':'添加关注',
                area:'450px',
                components:{InputDir,Scroll,PlaceSearch,MulSelect},
                content:`<div class="addAttention_pop AttentPerson" style="width:100%;height:100%;padding:10px;">${html}</div>`,
                watch:{
                    type(){
                        param.selfData.vidType='';
                        param.selfData.vidTypeVal='';
                    },
                    vidType(){
                        if(param.selfData.vidType==''){vidTypeVal='';param.selfData.vidTypes=param.selfData.VirType.frequently_type;return;}
                        param.selfData.vidTypes=_.filter(param.selfData.VirType.vid_type,t=>t.name.indexOf(param.selfData.vidType)>=0);
                    }
                },
                context:{
                    name:defval?defval.focus_title:'',
                    blnShowDropDown:false,
                    type:'',
                    vidType:'',
                    vidTypeVal:'',
                    key:'',
                    blnShowVidDropDown:false,
                    vidTypes:VirType.frequently_type,
                    VirType:VirType,
                    store:store,
                    focus_property:defval?defval.focus_property || []:[],
                    labels:'',
                    regionVal:defval?defval.focus_locus_ids:[],
                    defRegionVal:defval?defval.focus_locus_ids.length<=0?'':JSON.stringify(defval.focus_locus_ids):'',
                    labelVal:labels,
                    defaultVal:defval?defval.focus_tags:[],
                    blnAdding:false,
                    types:[
                        {name:'虚拟身份',val:'vid'},
                        {name:'手机',val:'mobile'},
                        {name:'身份证',val:'cert'},
                        {name:'MAC',val:'mac'},
                    ],
                    complete(){
                        let data=param.selfData;
                        if(!data.name){tool.info('姓名必填!');return;}
                        if(data.focus_property.length<=0){tool.info('特征必填!');return;}


                        let res={
                            focus_title:data.name,
                            focus_property:data.focus_property,
                            focus_tags:_.map(param.selfData.defaultVal,d=>d.tag_id),
                            focus_locus_ids:_.map(data.regionVal,r=>r.code),
                            alarm_type:[],
                            alarm_account:{}
                        } 
                        
                        data.blnAdding=true;
                        if(!blnUpdate){//新增
                            s.$store.dispatch(AddFocusPerson,res).then(res=>{
                                data.blnAdding=false;
                                if(!tool.msg(res,'添加成功!')) return;
                                let d=res.biz_body[0];

                                s.data.push(d);

                                if(callback){callback(d)}
                                param.close();
                            });
                        }else{//修改
                            res.focus_id=defval.focus_id;
                            s.$store.dispatch(UpdateFocusPerson,res).then(result=>{
                                data.blnAdding=false;
                                if(!tool.msg(result,'修改成功!')) return;

                                res.focus_tags=_.map(param.selfData.defaultVal,d=>{
                                    return {
                                        id:d.tag_id,
                                        note:d.tag_title || d.name
                                    }
                                });

                                res.focus_locus_ids=data.regionVal;

                                if(callback){callback(res,true)}

                                param.close();
                            });
                        }
                        
                    },
                    close(){param.close();},
                    mousedownItem(t){
                        param.selfData.type=t;
                        param.selfData.blnShowDropDown=false;
                    },
                    mousedownVidItem(t){
                        param.selfData.vidType=t.name;
                        param.selfData.vidTypeVal=t.value;
                        param.selfData.blnShowVidDropDown=false;

                    },
                    add(){
                        if(!param.selfData.type){tool.info('类型必须选择!');return;}
                        if(param.selfData.type && !param.selfData.key){tool.info('内容必填!');return;}
                        if(param.selfData.type.val == 'vid' && !param.selfData.vidTypeVal){tool.info('虚拟身份内容必选!');return;}
                        if(param.selfData.type.val == 'cert'){
                            let idReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份证验证
                            if(!idReg.test(param.selfData.key)){tool.info('身份证格式不正确!');return;}
                        }
                
                        if(param.selfData.type.val=='mac'){//MAC
                            let idReg = /^([A-Fa-f0-9]{2}-){5}[A-Fa-f0-9]{2}$/; //MAC
                            let macReg= /^([A-Fa-f0-9]{2}){5}[A-Fa-f0-9]{2}$/; //MAC
                            if(!idReg.test(param.selfData.key) && !macReg.test(param.selfData.key)){tool.info('MAC格式不正确!'); return;}
                        }

                        if(param.selfData.type.val=='mobile'){//手机
                            let idReg = /^1[3|4|5|7|8][0-9]{9}$/; //手机
                            if(!idReg.test(param.selfData.key)){tool.info('手机格式不正确!');return;}
                        }
                 

                        param.selfData.focus_property.push({
                            name:param.selfData.type.name,
                            k:param.selfData.key,
                            t:param.selfData.type.val,
                            n:param.selfData.vidTypeVal,
                        });

                        //param.selfData.type='';
                        param.selfData.key='';
                        //param.selfData.vidTypeVal='';

                    },
                    delLable(index){
                        param.selfData.defaultVal.splice(index,1);
                    },
                    addLable(val){
                        tool.open(function(){
                            
                            let html=`
                                <InputDir label="标题" @change="name_change" :val="name"/>
                                <div style="text-align:right;margin-top:10px;">
                                        <button type="button" class="btn btn-success" style="font-size:12px;" @click="complete()">完成</button>
                                        <button type="button" class="btn btn-default" style="font-size:12px;" @click="close()">关闭</button>
                                </div>
                            `;
                            let addParam={
                                title:'添加标签',
                                area:'300px',
                                components:{InputDir},
                                content:`<div class="addAttention_item_x" style="width:100%;height:100%;padding:10px;">${html}</div>`,
                                context:{
                                    name:'',
                                    name_change(val){addParam.selfData.name=val;},
                                    complete(){
                           
                                        s.$store.dispatch(AddFocusPersonLabel,{tag_title:addParam.selfData.name}).then(res=>{
                                            if(!tool.msg(res,'添加成功!')) return;
                                            let item = _.map(res.biz_body,r=>{r.name=r.tag_title; return r;})[0];
                                            param.selfData.defaultVal.push(item);
                               
                                            s.labels.push(item);
                                            param.selfData.labelVal.push(item);
                                        });
                                        addParam.close();
                                    },
                                    close(){ addParam.close();}
                                }
                            }
                           
                           return addParam;
                        }());
                    },
                    selLabel(){

                        tool.open(function(){
                            
                            let html=`
                                <div class="LableInfo">
                                    <div class="lable_container">
                                        <Scroll :listen="labels">
                                            <div style="display:inline-block;margin-right:10px;" v-for="d in labels">
                                                <i class="fa" @click="toogelLabel(d)" :class="{
                                                'fa-square-o':!isSelect(d),
                                                'fa-check-square-o':isSelect(d)}" :style="{color:isSelect(d)?'green':'gray',cursor:'pointer'}">
                                                </i> {{d.tag_title}}
                                            </div>
                                        </Scroll>
                                    </div>
                                
                                    <div class="option_container">
                                        <div class="btn_container" style="cursor:pointer;" @click="AddLabel()">+</div>
                                        <div class="input_container">
                                            <input type="text" v-model="key" placeholder="创建新标签" />
                                        </div>
                                    </div>
                                </div>
                            `;
                            let addParam={
                                title:'选择标签',
                                area:'300px',
                                components:{Scroll},
                                content:`<div class="addAttention_item_sel AttentPerson" style="width:100%;height:100%;padding:10px;">${html}</div>`,
                                store:store,
                                context:{
                                    labels:labels,
                                    key:'',
                                    isSelect(d){
                                        return _.find(param.selfData.defaultVal,f=>f.tag_id==d.tag_id);
                                    },
                                    toogelLabel(d){
                                       let index = _.findIndex(param.selfData.defaultVal,f=>f.tag_id==d.tag_id);
                                       if(index>=0){
                                           param.selfData.defaultVal.splice(index,1);
                                       }else{
                                           param.selfData.defaultVal.push(d);
                                       }
                                    },
                                    AddLabel(){
                                         s.$store.dispatch(AddFocusPersonLabel,{tag_title:addParam.selfData.key}).then(res=>{
                                            if(!tool.msg(res,'添加成功!')) return;
                                            let item = _.map(res.biz_body,r=>{r.name=r.tag_title; return r;})[0];
                                            param.selfData.defaultVal.push(item);
                               
                                            s.labels.push(item);
                                            param.selfData.labelVal.push(item);
                                        });
                                        addParam.close();
                                    },
                                    close(){ addParam.close();}

                                }
                            }
                           
                           return addParam;
                        }());
                    },
                    delPro(index){
                        param.selfData.focus_property.splice(index,1);
                    },
                    name_change(val){param.selfData.name=val;},
                    label_change(val){param.selfData.labels=val;},
                    //区域选择改变事件
                    region_change(obj,val,cmpVal){
                       param.selfData.regionVal=val.regions?val.regions || []:[];
                    },
                    success(){
                        mousedownid=Fx.SingleBind('mousedown',$('.layui-layer-shade'), (e)=> {
                            param.selfData.blnShowDropDown=false;
                            param.selfData.blnShowVidDropDown=false;
                        });
                    },
                    cancel(){
                        Fx.ClearBind('mousedown',$('.layui-layer-shade'),mousedownid);
                    }
                }
            }

            return param;
        }());
    },
    converTime(time){
        return tool.DateByTimestamp(time,'yyyy-MM-dd mm:hh:ss');
    }
  }
}
</script>


<style lang="less">
    @import "../css/variables.less";
    .AttentPerson.unSelect{
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
    }
    .AttentPerson .detailInfo{
        width:100%;
        height:100%;
        position:relative;
    }
    .AttentPerson .detailInfo .info_item{margin-left:0px;margin-bottom:5px;}
    .AttentPerson .detailInfo .info_item .del{float:right;display:none;}
    .AttentPerson .detailInfo .info_item .del:hover{color:@Font_Hover_Col;cursor:pointer;}
    .AttentPerson .detailInfo .info_item:hover i{display:block;}
    .AttentPerson .detailInfo .el-select input{border-radius:0px !important;}

    .AttentPerson .detailInfo .inputDropDown{width:100%;height:30px;line-height:30px;}
    .AttentPerson .detailInfo .inputDropDown .dropDownItem{width:90px;height:100%;float:left;.border('',#d9d9d9);position:relative;}
    .AttentPerson .detailInfo .inputDropDown .dropDownItem:hover{cursor:pointer;}
    .AttentPerson .detailInfo .inputDropDown .dropDownItem .dropDownContent{position: absolute;width: 100%;.border('',#d9d9d9); width: calc(100% + 2px);left:-1px;background-color:white;}
    .AttentPerson .detailInfo .inputDropDown .dropDownItem .fa-sort-down{float:right;font-size:20px;margin-right:5px;}
    .AttentPerson .detailInfo .inputDropDown .addBtn{width:30px;float:right;.border('left',#d9d9d9);text-align:center;font-size:20px;background-color:#059cd3;color:white;}
    .AttentPerson .detailInfo .inputDropDown .input{margin-left:90px;margin-right:30px;.border('top',#d9d9d9);.border('bottom',#d9d9d9);height: 30px;padding:0px 10px;}
    .AttentPerson .detailInfo .inputDropDown .input input{height:19px;border:none;outline:none;width:100%;}

    .AttentPerson .detailInfo .inputDropDown .dropDownItem .vidTypeInput{width:50px;border:none;outline:none;height:20px;}

    .AttentPerson .detailInfo .inputDropDown .dropDownItem .selectItem{line-height:25px;padding:0px 5px;}
    .AttentPerson .detailInfo .inputDropDown .dropDownItem .selectItem:hover{background-color:@Font_Hover_Col;color:white;}

    .AttentPerson .detailInfo .inputDropDown .input.double{margin-left:180px;}

    .AttentPerson .el-input-group__append{background-color:#059cd3;color:white;font-size:20px;}
    .AttentPerson .el-input-group{overflow:hidden;}

    .AttentPerson .option_bar .sortDropDown .el-button-group button:first-child{width:150px;}
    .AttentPerson .option_bar .sortDropDown .el-button-group button{height:34px;}


    .AttentPerson  .input-group-addon{background-color:#059cd3;color:white;font-size:20px;cursor:pointer;}

    .addAttention_pop .el-input__inner{border:1px solid #d4d4d4;border-radius: 0px;}

    .addAttention_pop .label_set .btn{    
        float: right;
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        background-color: #b2dcf1;
        border: 1px solid #1792c5;
        margin-right:10px;
        padding:0px;
    }

    .addAttention_pop .label_set .btn:last-child{margin-right:0px;}

    .addAttention_pop .label_set .label_item{position:relative;background-color:#1792c5;color:white;float:left;font-size:12px; padding:0px 10px;margin-right:10px;margin-bottom:10px;}
    .addAttention_pop .label_set .label_item:hover{cursor:pointer;}

    .addAttention_pop .label_set .label_item .del_btn{display:none;position:absolute;width:30px;height:30px;line-height:30px;text-align:center;right:0px;top:0px;background-color:rgba(0,0,0,.6);}
    .addAttention_pop .label_set .label_item:hover .del_btn{display:block;}

    .addAttention_item_sel .label_item{line-height:25px;padding:0px 10px;font-size:12px;.border('bottom');}
    .addAttention_item_sel .label_item i{color:@Font_Hover_Col;float:right;margin-right:10px;margin-top: 7px;}
    .addAttention_item_sel .label_item:hover{background-color:@Font_Hover_Col;color:white;cursor:pointer;}

    //标签样式
    @LableH:200px;
    @LableBtn:30px;
    .AttentPerson .LableInfo{width:100%;height:@LableH;}
    .AttentPerson .LableInfo .lable_container{height:~'calc(@{LableH} - 30px)';width:100%}
    .AttentPerson .LableInfo .option_container{width:100%;}
    .AttentPerson .LableInfo .option_container .input_container{margin-right:@LableBtn;height:@LableBtn;line-height:@LableBtn - 5px;.border('',#d9d9d9);border-right:none;}
    .AttentPerson .LableInfo .option_container .input_container input{width:100%;outline:none;border:none;padding:0px 10px;margin-top:2px;}
    .AttentPerson .LableInfo .option_container .btn_container{
        width:@LableBtn;height:@LableBtn;background-color:#059cd3;color:white;font-size:20px;
        text-align:center;line-height:@LableBtn;float:right;
    }

    //列表样式
    @bgColor:fade(@HeaderBgCol,90%);
    @tableRowH:36px;
    .pop  .table{margin-bottom:0px;color: white;background-color:rgba(47, 51, 65, 0.9) !important;}
    .pop  .table_header{height:@tableRowH;}
    .pop  .table_header tr{height:~'calc(@{tableRowH} - 1px)';}
    .pop  .table_header th{padding:0px !important;color:black; line-height:@tableRowH;color:white;}
    .pop  .table_header{color:black;}
    .pop  .table_body{height:~'calc(100% - @{tableRowH})';width:100%;}
    .pop  .table_body td{padding:0px !important;color:black;line-height:@tableRowH;.border('bottom');color:white;}
    </style>

<style scoped lang="less">
@import "../css/variables.less";

.AttentPerson{width:100%;height:100%;padding:5px;}

@bgColor:#d9d9d9;
@LeftContainerW:250px;
.AttentPerson .left_container{
    float:left;width:@LeftContainerW;height:100%;background-color:@bgColor;font-size:12px;font-weight:600;text-align:left;
}
.AttentPerson .left_container .left_item{ line-height:25px;padding:0px 10px;}
.AttentPerson .left_container .left_item .numver{margin-left:20px;}
@dottlBg:#059cd3;
.AttentPerson .left_container .left_item .dootl{float:left;width:10px;height:10px;border-radius:50%;background-color:@dottlBg;margin-right:10px;margin-top:7px;}

.AttentPerson .left_container .left_item.active,
.AttentPerson .left_container .left_item:hover{color:white;cursor:pointer;background-color:@dottlBg;}
.AttentPerson .left_container .left_item.active .dootl,
.AttentPerson .left_container .left_item:hover .dootl{background-color:white;}
.AttentPerson .left_container .left_item .option_item{display:none;}
.AttentPerson .left_container .left_item.active .option_item,
.AttentPerson .left_container .left_item:hover .option_item{display:block;}

.AttentPerson .left_container .label_bar{height:~'calc(100% - 50px)';width:100%;overflow:hidden;}

.AttentPerson .left_container .label_bar .label_child_bar{height:~'calc(100% - 25px)';width:100%;}

.AttentPerson .right_container{margin-left:@LeftContainerW + 5px;height:100%;.border('',@bgColor);}

@optionBarH:40px;
.AttentPerson .right_container .option_bar{height:@optionBarH;line-height:@optionBarH;width:100%;background-color:@bgColor;text-align:left;padding:0px 10px;}
.AttentPerson .right_container .content_bar{height:~'calc(100% - @{optionBarH} - 10px)';width:100%;}
.AttentPerson .right_container .content_bar .content_info{height:~'calc(100% - 40px)';width:100%;padding:0px 10px;overflow:hidden;}
.AttentPerson .right_container .content_bar .page{height:40px;width:100%;.border('top',@bgColor);}

.AttentPerson .right_container .content_bar .card{
    height:150px;width:310px;border:2px solid #c1c1c1;border-radius:5px;float:left;margin-right:10px;margin-bottom:10px;overflow:hidden;
}

.AttentPerson .right_container .content_bar .card:hover{cursor:pointer;}
//.AttentPerson .right_container .content_bar .card:hover{background-color:@Font_Hover_Col;cursor:pointer;color:white;}

@bottomH:30px;
.AttentPerson .right_container .content_bar .card .info{height:~'calc(100% - @{bottomH})';width:100%;padding:10px;position:relative;}
.AttentPerson .right_container .content_bar .card .bottom{height:@bottomH;width:100%;background-color:@bgColor;line-height:@bottomH;text-align:left;padding:0px 10px;font-size:12px;}

//.AttentPerson .right_container .content_bar .card:hover .bottom{background-color:@HeaderBgCol;}
@photo_barW:80px;
.AttentPerson .right_container .content_bar .card .info .photo_bar{width:@photo_barW;height:100%;.border('',@bgColor);float:left;}

.AttentPerson .right_container .content_bar .card .info .iden_container{
    position: absolute;
    top: 0px;
    right: 0px;
    width: 30px;
    height: 30px;
    background-image: linear-gradient(45deg, transparent 50%, #03ab67 50%), linear-gradient(45deg, transparent 49%, #03ab67 10%);
    display:none;
}

.AttentPerson .right_container .content_bar .card .info .iden_container .iden{
    position: absolute;
    right: 3px;
    top: 2px;
    color: white;
}
.AttentPerson .right_container .content_bar .card.active .info .iden_container{display:block;}
.AttentPerson .right_container .content_bar .card.active{border:2px solid @Font_Hover_Col;}
.AttentPerson .right_container .content_bar .card.active .bottom{background-color:@Font_Hover_Col;color:white;}

.AttentPerson .right_container .content_bar .card .info .info_bar{margin-left:@photo_barW;height:100%;text-align:left;padding-left:10px;}
.AttentPerson .right_container .content_bar .card .info .info_bar .item{margin-bottom:7px;}
.AttentPerson .right_container .content_bar .card .info .info_bar .item.child{font-size:12px;}
.AttentPerson .right_container .content_bar .card .info .info_bar .item .labelTip{font-size:11px !important;background-color:#3a3d4e;color:white;font-size:10px;padding: 1px 5px;border-radius:3px;position:relative;margin-left:15px;display:inline-block;font-family: 微软雅黑;}
.AttentPerson .right_container .content_bar .card .info .info_bar .item .labelTip:before{
    content:'';
    width: 0;
    height: 0;
    border-width: 11px 9px 9px 0;
    border-style: solid;
    border-color: transparent #3a3d4e transparent transparent;
    position: absolute;
    left: -7px;
    top: -1px;
}
.AttentPerson .right_container .content_bar .card .info .info_bar .item .labelTip:after{
    content:'';
    position:absolute;
    width:5px;
    height:5px;
    background-color:white;
    border-radius:50%;
    left:-3px;
    top:50%;
    margin-top:-2.5px;
}

.AttentPerson .right_container .content_bar .card .info .info_bar .item .icon{color:@Font_Hover_Col;}
//.AttentPerson .right_container .content_bar .card:hover .info .info_bar .item .icon{color:white;}

//.AttentPerson .right_container .content_bar .card:hover .info .info_bar .item .labelTip{background-color:white;color:@Font_Hover_Col;}
//.AttentPerson .right_container .content_bar .card:hover .info .info_bar .item .labelTip:before{border-color: transparent white transparent transparent;}
//.AttentPerson .right_container .content_bar .card:hover .info .info_bar .item .labelTip:after{background-color:@Font_Hover_Col;}

.AttentPerson .pop{.border('',@bgColor);border-radius:5px;background-color:white;text-align:left;font-size:12px;}

@title_barH:30px;
.AttentPerson .pop .title_bar{width:100%;height:@title_barH;background-color:@Font_Hover_Col;color:white;padding:0px 10px;line-height:@title_barH;border-top-right-radius:5px;border-top-left-radius:5px;}
.AttentPerson .pop .contentinfo_bar{width:100%;padding:10px;}

</style>
