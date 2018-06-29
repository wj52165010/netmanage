<!-- 碰撞分析组件 -->
<template>
    <div class="CrashAnaly" onselectstart="return false;">
        <!--右边条件展示-->
        <div class="right_container">
            <!--条件设置-->
            <div class="condSet" style="padding-top:10px;">
                <!--<CInput label="数据名称(默认按时间命名)" :val="condName" @change="cond_name_change" />-->
                <div style="padding:0px 10px;">
                    <input type="text" class="form-control" style="background-color:#eeeeee;color:#20a0ff;" v-model="condName"  placeholder="数据名称(默认按时间命名)">
                </div>
                <div style="padding:0px 10px;">
                    <input type="text" class="form-control" style="margin-top:10px;background-color:#eeeeee;color:#20a0ff;" v-model="condCount"  placeholder="出现次数">
                </div>
                <!--<CInput label="出现次数" :val="condCount" @change="cond_count_change"/>-->
                <div style="padding:0px 10px;">
                    <el-date-picker style="width:100%;margin:10px 0px;" v-model="time" type="datetimerange" placeholder="选择日期" :picker-options="pickerOptions2"> </el-date-picker>
                </div>
                <div style="padding-left:10px;">
                   <div style="padding:5px;display:inline-block;background-color:#3a3d4e;color:white;font-size:12px;"> 关联场所</div>
                </div>
                <div class="relativePlace">
                    <Scroll :listen="places" :store="store">
                        <div class="palceItem" v-for="d in places">
                           <div class="icon"><i class="fa" style="cursor:pointer;" :class="{'fa-square-o':!d.sel,'fa-check-square-o':d.sel}" @click="place_check(d)"></i></div>
                           <div class="content">{{d.name}}</div>
                        </div>
                    </Scroll>
                </div>
                <div style="margin:0px 10px;">
                    <div style="display:inline-block;width:32%;padding:5px 0px;background-color:#47b38f;color:white;cursor:pointer;text-align:center;margin-right:2%;" @click="place_all_check()"><i class="fa fa-check-circle" style="margin-right:5px;"></i>全选</div><div style="display:inline-block;width:32%;padding:5px 0px;background-color:#808080;color:white;cursor:pointer;text-align:center;margin-right:2%;" @click="place_clear()"><i class="fa fa-remove" style="margin-right:5px;"></i>清除</div><div style="display:inline-block;width:32%;padding:5px 0px;background-color:#20a0ff;color:white;cursor:pointer;text-align:center;" @click="set_cond()"><i class="fa fa-save" style="margin-right:5px;"></i>保存</div>
                </div>
            </div>
            
            <!--条件展示-->
            <div class="condShow">
                <Scroll :listen="conds" :store="store">
                    <div class="cond_item" v-for="(d,i) in conds" >
                        <div class="icon incon_item" style="cursor:pointer;" @mousedown="mousedown($event,d,`A${i+1}`)" >A{{i+1}}</div>
                        <i class="fa fa-remove" style="cursor:pointer;float:right;margin-top:6px;" @click="delConds(i)"></i>
                        <div class="content">{{d.title}}</div>
                    </div>
                </Scroll>
            </div>

            <!--条件组合(分组)-->
            <div class="condGroup">
                <div class="condGroup_item" style="position:absolute;background-color:transparent;width:100%;height:9px;top:-30px">
                    <div class="info"></div>
                    <div class="option_bar" style="border:none;">
                        <div class="option_item" style="background-color:transparent;text-align:center;padding:0px;font-weight:600;"><el-tooltip placement="top" content="分组B">B</el-tooltip></div>
                        <div class="option_item" style="background-color:transparent;text-align:center;padding:0px;font-weight:600;"><el-tooltip placement="top" content="分组C">C</el-tooltip></div>
                        <div class="option_item" style="background-color:transparent;text-align:center;padding:0px;font-weight:600;"><el-tooltip placement="top" content="分组D">D</el-tooltip></div>
                    </div>
                </div>
                <div class="condGroup_item">
                    <div class="info"><el-tooltip placement="top" content="交集">∩</el-tooltip></div>
                    <div class="option_bar">
                        <div class="option_item" name="dragIn" dataT="B1" @mousedown="mousedown($event,B1,`B1`)">
                            <div class="child" :class="`child${i.name.substr(0,1)}`" v-if="B1.length<=3" v-for="i in B1">
                                {{i.name}}
                                <div class="delgroup" @mousedown.stop="delGroup(i,B1,'B1More')">x</div>
                            </div>

                            <div class="moreShow" v-if="B1More">
                                <div class="child" :class="`child${i.name.substr(0,1)}`" v-for="i in B1">{{i.name}}<div class="delgroup" @mousedown.stop="delGroup(i,B1,'B1More')">x</div></div>
                            </div>
                            <div class="groupBtn childB" v-if="B1.length>3" @mousedown.stop="B1More=!B1More">B1(超出3个)<div class="delgroup" @mousedown.stop="delGroup('all',B1)">x</div></div>
                            
                        </div>
                        <div class="option_item" name="dragIn" dataT="C1" @mousedown="mousedown($event,C1,`C1`)">
                            <div class="child" :class="`child${i.name.substr(0,1)}`"  v-if="C1.length<=3" v-for="i in C1">{{i.name}}<div class="delgroup" @mousedown.stop="delGroup(i,C1,'C1More')">x</div></div>
                             
                            <div class="moreShow" v-if="C1More">
                                <div class="child" :class="`child${i.name.substr(0,1)}`" v-for="i in C1">{{i.name}}<div class="delgroup" @mousedown.stop="delGroup(i,C1,'C1More')">x</div></div>
                            </div>
                            <div class="groupBtn childC" v-if="C1.length>3" @mousedown.stop="C1More=!C1More">C1(超出3个)<div class="delgroup" @mousedown.stop="delGroup('all',C1)">x</div></div>
                        </div>
                        <div class="option_item" name="dragIn" dataT="D1" @mousedown="mousedown($event,D1,`D1`)">
                            <div class="child" :class="`child${i.name.substr(0,1)}`"  v-if="D1.length<=3" v-for="i in D1">{{i.name}}<div class="delgroup" @mousedown.stop="delGroup(i,D1,'D1More')">x</div></div>
                            
                            <div class="moreShow" v-if="D1More">
                                <div class="child" :class="`child${i.name.substr(0,1)}`" v-for="i in D1">{{i.name}}<div class="delgroup" @mousedown.stop="delGroup(i,D1,'D1More')">x</div></div>
                            </div>
                            <div class="groupBtn childC" v-if="D1.length>3" @mousedown.stop="D1More=!D1More">D1(超出3个)<div class="delgroup" @mousedown.stop="delGroup('all',D1)">x</div></div>
                        </div>
                    </div>
                </div>
                <div class="condGroup_item">
                    <div class="info"><el-tooltip placement="top" content="并集">U</el-tooltip></div>
                    <div class="option_bar">
                        <div class="option_item" name="dragIn" dataT="B2" @mousedown="mousedown($event,B2,`B2`)">
                            <div class="child" :class="`child${i.name.substr(0,1)}`" v-if="B2.length<=3" v-for="i in B2">{{i.name}}<div class="delgroup" @mousedown.stop="delGroup(i,B2,'B2More')">x</div></div>

                            <div class="moreShow" v-if="B2More">
                                <div class="child" :class="`child${i.name.substr(0,1)}`" v-for="i in B2">{{i.name}}<div class="delgroup" @mousedown.stop="delGroup(i,B2,'B2More')">x</div></div>
                            </div>
                            <div class="groupBtn childB" v-if="B2.length>3" @mousedown.stop="B2More=!B2More">B2(超出3个)<div class="delgroup" @mousedown.stop="delGroup('all',B2)">x</div></div>
                        </div>
                        <div class="option_item" name="dragIn" dataT="C2" @mousedown="mousedown($event,C2,`C2`)">
                            <div class="child" :class="`child${i.name.substr(0,1)}`" v-if="C2.length<=3" v-for="i in C2">{{i.name}}<div class="delgroup" @mousedown.stop="delGroup(i,C2,'C2More')">x</div></div>

                            <div class="moreShow" v-if="C2More">
                                <div class="child" :class="`child${i.name.substr(0,1)}`" v-for="i in C2">{{i.name}}<div class="delgroup" @mousedown.stop="delGroup(i,C2,'C2More')">x</div></div>
                            </div>
                            <div class="groupBtn childB" v-if="C2.length>3" @mousedown.stop="C2More=!C2More">C2(超出3个)<div class="delgroup" @mousedown.stop="delGroup('all',C2)">x</div></div>
                        </div>
                        <div class="option_item" name="dragIn" dataT="D2" @mousedown="mousedown($event,D2,`D2`)">
                            <div class="child" :class="`child${i.name.substr(0,1)}`" v-if="D2.length<=3" v-for="i in D2">{{i.name}}<div class="delgroup" @mousedown.stop="delGroup(i,D2,'D2More')">x</div></div>

                            <div class="moreShow" v-if="D2More">
                                <div class="child" :class="`child${i.name.substr(0,1)}`" v-for="i in D2">{{i.name}}<div class="delgroup" @mousedown.stop="delGroup(i,D2,'D2More')">x</div></div>
                            </div>
                            <div class="groupBtn childB" v-if="D2.length>3" @mousedown.stop="D2More=!D2More">D2(超出3个)<div class="delgroup" @mousedown.stop="delGroup('all',D2)">x</div></div>
                        </div>
                    </div>
                </div>
                <div class="condGroup_item">
                    <div class="info"><el-tooltip placement="top" content="差集">一</el-tooltip></div>
                    <div class="option_bar">
                        <div class="option_item" name="dragIn" dataT="B3" @mousedown="mousedown($event,B3,`B3`)">
                            <div class="child" :class="`child${i.name.substr(0,1)}`" v-if="B3.length<=3" v-for="i in B3">{{i.name}}<div class="delgroup" @mousedown.stop="delGroup(i,B3,'B3More')">x</div></div>

                            <div class="moreShow" v-if="B3More">
                                <div class="child" :class="`child${i.name.substr(0,1)}`" v-for="i in B3">{{i.name}}<div class="delgroup" @mousedown.stop="delGroup(i,B3,'B3More')">x</div></div>
                            </div>
                            <div class="groupBtn childB" v-if="B3.length>3" @mousedown.stop="B3More=!B3More">B3(超出3个)<div class="delgroup" @mousedown.stop="delGroup('all',B3)">x</div></div>
                        </div>
                        <div class="option_item" name="dragIn" dataT="C3" @mousedown="mousedown($event,C3,`C3`)">
                            <div class="child" :class="`child${i.name.substr(0,1)}`" v-if="C3.length<=3" v-for="i in C3">{{i.name}}<div class="delgroup" @mousedown.stop="delGroup(i,C3,'C3More')">x</div></div>

                            <div class="moreShow" v-if="C3More">
                                <div class="child" :class="`child${i.name.substr(0,1)}`" v-for="i in C3">{{i.name}}<div class="delgroup" @mousedown.stop="delGroup(i,C3,'C3More')">x</div></div>
                            </div>
                            <div class="groupBtn childB" v-if="C3.length>3" @mousedown.stop="C3More=!C3More">C3(超出3个)<div class="delgroup" @mousedown.stop="delGroup('all',C3)">x</div></div>
                        </div>
                        <div class="option_item" name="dragIn" dataT="D3" @mousedown="mousedown($event,D3,`D3`)">
                            <div class="child" :class="`child${i.name.substr(0,1)}`" v-if="D3.length<=3" v-for="i in D3">{{i.name}}<div class="delgroup" @mousedown.stop="delGroup(i,D3,'D3More')">x</div></div>

                            <div class="moreShow" v-if="D3More">
                                <div class="child" :class="`child${i.name.substr(0,1)}`" v-for="i in D3">{{i.name}}<div class="delgroup" @mousedown.stop="delGroup(i,D3,'D3More')">x</div></div>
                            </div>
                            <div class="groupBtn childB" v-if="D3.length>3" @mousedown.stop="D3More=!D3More">D3(超出3个)<div class="delgroup" @mousedown.stop="delGroup('all',D3)">x</div></div>   
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--左边筛选条件-->
        <div class="left_container">
            <!--过滤条件-->
            <div style="height:40px;position:absolute;margin-left:180px;z-index:1000;">
                <!--场所定位-->
                <div class="cond_item" style="float:left;width:300px;margin-top: 3px;">
                    <dropdwonBtn v-show="tagIndex==0" placeholder="请输入场所编码/名称/拼音" ref="placeDwon" :store="store" :data="siteSearch" :btn="placeBtn" @change="placeChange" @placePos="placePos">
                        <div v-for="s in siteSearch" @mousedown="placeSearch_click(s)">{{s.name}}</div>
                    </dropdwonBtn>        
                </div>
            </div>


            <HTag :tags="tags" @change="tagChange">
                <!--地图筛选-->
                <div slot="t0" style="height:100%;width:100%;">
                    <div class="map_container" style="width:100%;height:100%;"></div>
                </div>

                <!--树形筛选-->
                <div slot="t1" style="height:100%;width:100%;">
                    <PlaceTree ref="placeTree" :store="store" @change="placeCondChange"></PlaceTree>
                </div>
            </HTag>
        </div>
        <!--操作栏-->
        <div class="option_bar">
            <div style="float: right;">
                <div class="cbtn white" @click="clear()">清除</div>
                <div class="cbtn white" @click="pre()">返回上一步</div>
                <div class="cbtn " style="background-color:#20a0ff;" @click="ok()">确定</div>
            </div>
        </div>
        
        <!--以前的页面(弃用)-->
        <div style="display:none;">
            <div class="header">
                <titleComp title="碰撞分析条件" />
            </div>
            <!--显示条件项-->
            <div class="condition">
                <div class="condition_item" v-for="(cond,index) in conds">
                    <span class="num">{{index+1}}</span>
                    <div class="val">
                        <span class="valinfo">{{convertCond(cond)}}</span>
                        <span class="bar" @click="delConds(index)"><i class="fa fa-remove" /></span>
                    </div>
                </div>
            </div>
            <!--设置条件项-->
            <div class="setting">
                <div class="setting_title">
                    设置条件
                    <div class="listBtn">
                        <el-tooltip effect="light" content="列表选择" placement="top">
                            <PlaceSel searchKind="1" :callback="placeCallback" :store="store" :blnList="true" :btnStyle="{'background-color':'transparent',color:'#2f3341'}"></PlaceSel>
                        </el-tooltip>
                    </div>
                </div>
                <div class="cond">
                    <div class="cond_item" >
                        <span>时间段</span>
                        <el-date-picker
                            v-model="time"
                            type="daterange"
                            align="right"
                            width="300"
                            placeholder="选择日期范围"
                            :picker-options="pickerOptions2">
                        </el-date-picker>
                    </div>

                    <!--场所定位-->
                    <div class="cond_item" style="float:right;width:250px;">
                        <dropdwonBtn placeholder="请输入场所编码/名称/拼音" ref="placeDwon1" :store="store" :data="siteSearch" :btn="placeBtn" @change="placeChange" @placePos="placePos">
                            <div v-for="s in siteSearch" @mousedown="placeSearch_click(s)">{{s.name}}</div>
                        </dropdwonBtn>        
                    </div>
                </div>
                <!--地图容器-->
                <div class="map_container"></div>
                <!--操作栏-->
                <div class="option_bar">
                    <div class="cbtn blue" @click="addCond">添加条件<i class="fa fa-plus" /></div>
                    <!--<div class="cbtn" @click="clearCond()">删除本次条件<i class="fa fa-remove" /></div>-->
                    <div style="float: right;">
                        <div class="cbtn white" @click="clear()">清除</div>
                        <div class="cbtn white" @click="pre()">返回上一步</div>
                        <div class="cbtn black" @click="ok()">确定</div>
                    </div>
                    <div name="crash_analy_selPlace" style="float:right;line-height: 30px;margin-right: 10px;font-size:12px;"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import {GET_PLACE,SearchRangeSites,GetSitesInfoByInfo} from '../store/mutation-types'
import PlaceSel from 'components/PlaceSel'
import CInput from 'components/Input'
import dropdwonBtn from 'components/dropdwonBtn'
import Scroll from 'components/scroll'
import HTag from 'components/HTag'
import PlaceTree from 'components/PlaceTree'
import Drag from '../js/drag.js'

export default {
  name: 'CrashAnaly',
  props:['store','blnNoInit'],
  components:{
    PlaceSel,
    dropdwonBtn,
    PlaceTree,
    CInput,
    Scroll,
    HTag,
    titleComp:{
        props:['title'],
        template:`<div class="titleComp" style="cursor:pointer;display:inline-block;" @click="itemClick()">
                    <i class="fa fa-caret-down" style="font-size:18px;" :class="{rotate:blnExpan,rotatereverse:!blnExpan}"></i>
                    <span style="font-style: italic;">{{title}}</span>
                    </div>
                `,
        data(){
            return {
            blnExpan:false,
            };
        },
        methods:{
            itemClick(){
                this.blnExpan= !this.blnExpan;
                this.$emit('change',this.blnExpan);
            }
        }
    },
  },
  data () {
    return {
        pickerOptions2: {
          disabledDate(time) {
               return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        tags:[{name:'地图',icon:'fa fa-map-marker'},{name:'列表',icon:'fa fa-list'}],
        tagIndex:0,
        time:[],//时间段,
        map:null,
        overlays:[],
        conds:[],//设置的条件
        markers:[],
        cacheData:{},
        labels:{},
        mapResult:[],//地图结果
        cachePlace:{},
        siteSearch:[],//场所定位搜索结果
        RxSub:null,
        placeBtn:{name:'定位',action:'placePos'},
        placeSearchCond:'',//场所定位条件
        places:[],//所选场所信息集合
        condName:'',//条件名称
        condCount:'',//出现次数
        curDragDom:null,//当前拖动元素
        dragStartX:0,//当前拖动X轴开始位置
        dragStartY:0,//当前拖动Y轴开始位置
        mousemoveid:0,
        mouseupid:0,
        dragInDoms:null,
        dragData:null,
        insertDom:null,
        dragText:'',
        B1:[],
        C1:[],
        D1:[],
        B2:[],
        C2:[],
        D2:[],
        B3:[],
        C3:[],
        D3:[],
        B1More:false,
        B2More:false,
        B3More:false,
        C1More:false,
        C2More:false,
        C3More:false,
        D1More:false,
        D2More:false,
        D3More:false,
    }
  },
  watch:{
    siteSearch(){
        //判断只有一个结果项时，直接选中
        if(this.siteSearch.length==1){
            this.placeSearch_click(this.siteSearch[0]);
        }
    }
  },
  mounted(){
    var store=this.$store || this.store;

    if(this.blnNoInit) return;
    this.init();

    this.mousemoveid=Fx.SingleBind('mousemove',$('body'), (e)=> {
      this.mousemove(e);
    });
    this.mouseupid=Fx.SingleBind('mouseup',$('body'), (e)=> {
      this.mouseup(e);
    });

    this.dragInDoms=$(this.$el).find('div[name="dragIn"]');

    this.genIdens();
  },
  destroyed(){
     Fx.ClearBind('mouseup',$('body'),this.mouseupid);
     Fx.ClearBind('mousemove',$('body'),this.mousemoveid);
  },
  methods:{
      //给每个分组对象生成一个唯一标识
      genIdens(){
        this.B1.id='B1'+tool.guid();
        this.B2.id='B2'+tool.guid();
        this.B3.id='B3'+tool.guid();

        this.C1.id='C1'+tool.guid();
        this.C2.id='C2'+tool.guid();
        this.C3.id='C3'+tool.guid();
        
        this.D1.id='D1'+tool.guid();
        this.D2.id='D2'+tool.guid();
        this.D3.id='D3'+tool.guid();
      },
      //删除分组项
      delGroup(d,data,showMore){
        let s=this;
        if(d=='all'){
            data.splice(0,data.length);
        }else{
            let index = _.findIndex(data,i=>i.id==d.id);
            data.splice(index,1);

            if(data.length<=3){this[showMore]=false;}
        }
    
        this.$emit('dataChange',s.conds,{B1:s.B1,C1:s.C1,D1:s.D1,B2:s.B2,C2:s.C2,D2:s.D2,B3:s.B3,C3:s.C3,D3:s.D3});
      },
      //鼠标按下事件
      mousedown(e,d,text){
        //判断是否为B1,C1,D1这种类似数组的元素拖动
        let blnArr=false;
        if(d instanceof Array){
            blnArr=true;
            if(d.length<=0) return;
        }

        let dom =$(e.target || e.srcElement);
        if(blnArr)dom =dom.attr('dataT')?dom:dom.parent('div');

        if(!dom) return;
        let parentDom=$(this.$el);
        let appendDom = dom.clone();
        
        appendDom.addClass('incon_item');
        appendDom.css({'position':'absolute',
                        top:(dom.offset().top - parentDom.offset().top)+'px',
                        left:(dom.offset().left - parentDom.offset().left)+'px',
                        'border':'1px dashed #2f3341',
                        });
        
        if(blnArr){
            appendDom.empty();
            appendDom.append(text);
            appendDom.addClass(`child${appendDom.attr('dataT').substr(0,1)}`);
        }

        appendDom.appendTo(parentDom);
     
        this.dragData=tool.Clone(d);
        this.dragText=text;

        this.curDragDom=appendDom;
        this.dragStartX=e.clientX;
        this.dragStartY=e.clientY;
      },
      //鼠标松开事件
      mouseup(e){
        if(!this.curDragDom) return;
        let s=this;
        this.dragInDoms.removeClass('active');
        this.curDragDom.remove();
        this.curDragDom=null;
        if(this.insertDom){
            let type=$(this.insertDom).attr('dataT');
            this.dragData.name=this.dragText;

            this.dragData.id=this.dragData.id || this.dragData.name;

            this[type].push(this.dragData);
            this.insertDom=null;
            this.dragData=null;
            s.$emit('dataChange',s.conds,{B1:s.B1,C1:s.C1,D1:s.D1,B2:s.B2,C2:s.C2,D2:s.D2,B3:s.B3,C3:s.C3,D3:s.D3});
        }
      },
      //鼠标移到事件
      mousemove(e){
        let s=this;
        let parentDom=$(this.$el);

    
        if(!this.curDragDom) return;
        let offset=this.curDragDom.offset();
        let left= (offset.left - parentDom.offset().left +e.clientX-this.dragStartX),
            top =(offset.top - parentDom.offset().top +e.clientY-this.dragStartY),
            lw=this.curDragDom.width(),
            lh=this.curDragDom.height();
        this.curDragDom.css({
            left:left+'px',
            top:top+'px',
        });
        this.dragStartX=e.clientX;
        this.dragStartY=e.clientY;

        //判断拖动元素是否进入拖动框中
        
        this.insertDom=null;
        this.dragInDoms.removeClass('active');
        for(let i=0;i<this.dragInDoms.length;i++){
            let item=$(this.dragInDoms[i]),
                ioffset=item.offset(),
                w=item.width(),
                h=item.height(),
                ileft=ioffset.left - parentDom.offset().left,
                itop=ioffset.top - parentDom.offset().top;
            if(top<=itop+h && top>=itop && left>=ileft && left<=ileft+w){
                s.insertDom=item;

            }    
        }

        if(this.insertDom){
            //判断添加元素数据是否已经存在于容易内
            let type = $(this.insertDom).attr('dataT');
            if(this.dragText == type || _.find(this[type],i=>i.name==this.dragText)){
                s.insertDom=null;
            }else{
                $(this.insertDom).addClass('active');
            }

        }
      },
      //tag切换
      tagChange(index){
          this.tagIndex=index;
          this.$nextTick(()=>{
              if(index==0) return;
              this.$refs.placeTree.initScroll();
          });

      },
      //条件名称改变事件
      cond_name_change(val){
          this.condName=val;
      },
      //条件出现次数改变事件
      cond_count_change(val){
          this.condCount=val;
      },
      //设置条件
      set_cond(){
          let selPlaces=_.map(_.filter(this.places,i=>i.sel),d=>d.code);
          if(!this.condCount){tool.info('请输入出现次数!');return;}
          if(this.condCount){
              var reg = new RegExp("^[0-9]*$");
             if(!reg.test(this.condCount)){tool.info('请输入正确的出现次数!'); return;}
          }
          if(!this.time[0]){tool.info('请选择时间范围!');return;}
          if(selPlaces.length<=0){tool.info('请选择关联场所!');return;}

          let s=this;
          this.conds.push({
              id:tool.guid(),
              title:this.condName || tool.DateFormat(new Date(),'yyyy-MM-dd hh:mm:ss'),
              val:[tool.DateFormat(s.time[0],'yyyyMMddhhmmss'),tool.DateFormat(s.time[1],'yyyyMMddhhmmss')],
              sites:selPlaces,
              sitecnt:this.condCount
          });
          
          
          s.$emit('dataChange',s.conds,{B1:s.B1,C1:s.C1,D1:s.D1,B2:s.B2,C2:s.C2,D2:s.D2,B3:s.B3,C3:s.C3,D3:s.D3});
          this.condName='';
          this.condCount='';
      },
      //场所清除
      place_clear(){
        let overlays=this.overlays,map=this.map;
        for (var i = 0; i < overlays.length; i++) {
            map.removeOverlay(overlays[i]);
        }

        this.condName='';
        this.condCount='';
        this.time=[];
        this.places=[];
      },
      //场所全选
      place_all_check(){
          _.each(this.places,p=>{
            Vue.set(p,'sel',true);
          })
      },
      //场所复选框选择事件
      place_check(d){
          if(d.sel==undefined){
              Vue.set(d,'sel',false);
          }

          d.sel=!d.sel;
      },
      //场所条件改变事件
      placeCondChange(val){
          _.each(val,v=>{
              let index = _.findIndex(this.places,p=>{return p.code==v.code});
              if(index<0){
                  Vue.set(v,'sel',true);
                  this.places.unshift(v);
              }
          });
      },
      //场所改变事件
      placeChange(val){
        if(!val){this.placeSearchCond='';return;}
        var store=this.$store || this.store;
        store.dispatch(GetSitesInfoByInfo,{condition:val, types:'1'}).then((code)=>{
            //默认只取前十条数据
            let sites=code.sites || [];
            this.siteSearch=sites.slice(0,10);
        });
      },
      //场所搜索项单击事件
      placeSearch_click(val){
          this.$refs.placeDwon.setVal(val.name);
          this.placeSearchCond=val;
      },
      //场所定位
      placePos(){
          if(!this.placeSearchCond){tool.info('请选择下拉框中的值在进行搜索!'); return;}
          let self=this;
          let {longitude:lng,latitude:lat}=this.placeSearchCond
          this.map.panTo(new BMap.Point(lng,lat));
          Fx.DelayTrigger(function () {
            self.setPlaces(lng,lat);
          }, this.map, 200);
      },
      //列表场所选择后的回调函数
      placeCallback(val){
        this.mapResult = _.flatten(_.map(val,data=>{
            return _.map(data,v=>{return {code:v.code, name:v.name}});
        }));
        //设置显示信息
        $(this.$el).find('div[name="crash_analy_selPlace"]').html('已选择' + this.mapResult.length + '所场所');
        return true;
      },
      //转化条件显示
      convertCond(cond){
        let temp=_.map(cond.val,info=>{
            let year=info.substr(0,4) || '',
            mouth=info.substr(4,2) || '',
            day=info.substr(6,2) || '';
            
            return year+'-'+mouth+'-'+day;
        });

        return temp.join(' - ');
      },
      //清除选择区域
      clear(){
        let overlays=this.overlays,map=this.map;
        for (var i = 0; i < overlays.length; i++) {
            map.removeOverlay(overlays[i]);
        }
        overlays= [];
        $(this.$el).find('div[name="crash_analy_selPlace"]').html('已选择' + overlays.length + '所场所');
        this.mapResult = [];
      },
      //上一步
      pre(){this.$emit('pre')},
      //确定
      ok(){
        this.$emit('submit');
      },
      //添加条件
      addCond(){
        if(this.time.length<=0)return;
        let title='',s=this;
        tool.open(function(){
            let param={
                title:'添加条件',
                area:'300px',
                content:`<div class="openTmp" style="width:100%;height:100%;overflow-y:auto;padding:10px;">
                            <CInput label="条件名称" v-on:change="nameChange" />
                            <div class="option_bar" style="margin-top: 10px;text-align:right;">
                                <button type="button" class="btn btn-success" style="font-size:12px;" @click="complete()">完成</button>
                                <button type="button" class="btn btn-default" style="font-size:12px;" @click="close()">关闭</button>
                            </div>    
                         </div>`,
                components:{CInput},
                context:{
                    nameChange(val){
                        title=val;
                    },
                    complete(){
                       s.conds.push({title:title,val:[tool.DateFormat(s.time[0],'yyyyMMddhhmmss'),tool.DateFormat(s.time[1],'yyyyMMddhhmmss')],sites:_.map(s.mapResult,i=>i.code)});
                       s.time=[];
                       s.$emit('dataChange',s.conds);
                       s.clear();
                       param.close();
                    },
                    close(){
                        param.close();
                    }
                }
            };
            
            return param;
        }());
      },
      //删除添加
      delConds(index){
        this.conds.splice(index,1);
        this.$emit('dataChange',this.conds);
      },
      init(){
        let self=this;
        this.map=new BMap.Map($(this.$el).find('.map_container')[0],{minZoom:13,maxZoom:18});
        //this.map.centerAndZoom(new BMap.Point(106.33,29.35),13);
        let centerPoint=tool.cookie.get('centerPoint').split(',') || [];
        this.map.centerAndZoom(new BMap.Point(centerPoint[0] || 0,centerPoint[1] || 0),18);//安阳中心点
        this.map.enableScrollWheelZoom();     //开启鼠标滚轮缩放
        let markers=this.markers;
        let cachePlace=this.cachePlace;
        let overlays=this.overlays;

        var styleOptions = {
            strokeColor: "red",    //边线颜色。
            fillColor: "#f0d2d0",      //填充颜色。当参数为空时，圆形将没有填充效果。
            strokeWeight: 1,       //边线的宽度，以像素为单位。
            strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
            fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
            strokeStyle: 'solid' //边线的样式，solid或dashed。
         };

         //实例化鼠标绘制工具
        var drawingManager = new BMapLib.DrawingManager(this.map, {
            isOpen: false, //是否开启绘制模式
            enableDrawingTool: true, //是否显示工具栏
            enableCalculate: false,//开起计算模式
            drawingToolOptions: {
                anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                offset: new BMap.Size(5, 5), //偏离值
                drawingModes: [
                    BMAP_DRAWING_CIRCLE,
                    BMAP_DRAWING_RECTANGLE
                ]
            },
            circleOptions: styleOptions, //圆的样式
            rectangleOptions: styleOptions //矩形的样式
        });

        //生成鼠标绘制工具
        var overlaycomplete = function (e, o) {
            var count = 0, bound = e.overlay.getBounds();
            var result = [];
            for (var i = 0; i < markers.length; i++) {
                if (bound.containsPoint(markers[i].marker.point)) {
                    count++;
                    var data = cachePlace[markers[i].siteid];
                    if (data) {
                        result.push({code: data.code, name: data.name});
                    }
                }
            }
            self.mapResult = result;
            
            //设置显示信息
            $(self.$el).find('div[name="crash_analy_selPlace"]').html('已选择' + count + '所场所');
            overlays.push(e.overlay);

            self.placeCondChange(result);
        };
        //添加鼠标绘制工具监听事件，用于获取绘制结果
        drawingManager.addEventListener('overlaycomplete',overlaycomplete);

        //添加地图鼠标拖动事件
        this.map.addEventListener('dragend', (e) => {
            Fx.DelayTrigger(function () {
                self.setPlaces();
            }, this.map, 200);
        });

        //删除画图工具的提示信息
        $(this.$el).find('.map_container').find('.BMapLib_box').attr('title','');
        

        this.setPlaces();
      },
    //设置场所
    setPlaces(lng,lat){
        var markers = this.markers;
        var cacheData=this.cacheData;
        var labels=this.labels;
        var cachePlace=this.cachePlace;
        let map=this.map;
        var centerPointer = map.getCenter();
        var bounds=map.getBounds();
        var lb=bounds.getSouthWest(),rt=bounds.getNorthEast();
        var store=this.$store || this.store;
        var curMarker=null;
        //添加数遍移上/移下事件(添加描述遮罩)
        var marker_triangle_html='<div class="triangle pulse" style="background-color:rgb(0, 204, 102);color: white;padding: 0px 10px;border-radius: 5px;min-width:140px;padding:5px 10px;">{0}</div>';
        var posSearchHtml=function(data){
            var result='';
            var template='<div>{0}&nbsp;&nbsp;:&nbsp;&nbsp;{1}</div>';
            result+=Fx.format(template,'编码',data.code || '');
            result+=Fx.format(template,'全称',data.name || '');
            result+=Fx.format(template,'地址',data.address || '');
            
            return result;
        };
        store.dispatch(SearchRangeSites,{lb:lb, rt:rt}).then(function (code) {
            var data = code;
            var tempMarker = [];
            for (var i = 0; i < data.length; i++) {
                if (cachePlace[data[i].code]) {
                    if(lng==data[i].lng && lat==data[i].lat){
                        curMarker={point:{lng:parseFloat(data[i].lng),lat:parseFloat(data[i].lat)}};
                    }
                    continue;
                }
                cachePlace[data[i].code] = data[i];
                cacheData[parseFloat(data[i].lng)+'-'+parseFloat(data[i].lat)]=data[i];
                var marker=new BMap.Marker(new BMap.Point(data[i].lng, data[i].lat));

                if(lng==data[i].lng && lat==data[i].lat){
                   curMarker=marker;
                }

                
                marker.addEventListener("mouseover",function(e){
                        var point=e.target.point;

                        if(labels[point.lng+'-'+point.lat]){
                            $('.BMapLabel').parent('div').css('z-index',500);
                            map.removeOverlay(labels[point.lng+'-'+point.lat]);
                            delete labels[point.lng+'-'+point.lat];
                        }

                        $('.BMapLabel').parent('div').css('z-index',1000);

                        if(!cacheData[point.lng+'-'+point.lat]){return;}
                        var label= new BMap.Label(Fx.format(marker_triangle_html,posSearchHtml(cacheData[point.lng+'-'+point.lat])),{position:point, offset:new BMap.Size(-70, -130)});
                        label.setStyle({
                        fontSize : "12px",
                        lineHeight : "20px",
                        fontFamily:"微软雅黑",
                        fontWeight:'600',
                        border:'0px solid black',
                        'background-color':'transparent',
                        'max-width':'none'
                        });
                        map.addOverlay(label);
                        labels[point.lng+'-'+point.lat]=label;
                });

                marker.addEventListener("mouseout",function(e){
                    $('.BMapLabel').parent('div').css('z-index',500);
                    var point=e.target.point;
                    if(!cacheData[point.lng+'-'+point.lat]){return;}
                    var label=labels[point.lng+'-'+point.lat];
                    map.removeOverlay(label);
                    delete labels[point.lng+'-'+point.lat];
                });

                //构造场所遮罩
                markers.push({
                    marker: marker,
                    siteid: data[i].code
                });
                tempMarker.push(marker);
            }
            //console.log(tempMarker);
            new BMapLib.MarkerClusterer(map, {markers: tempMarker});
            
            if(curMarker){
                var point=curMarker.point;
                if(labels[point.lng+'-'+point.lat]){
                    $('.BMapLabel').parent('div').css('z-index',500);
                    map.removeOverlay(labels[point.lng+'-'+point.lat]);
                    delete labels[point.lng+'-'+point.lat];
                }

                $('.BMapLabel').parent('div').css('z-index',1000);
                if(!cacheData[point.lng+'-'+point.lat]){return;}
                var label= new BMap.Label(Fx.format(marker_triangle_html,posSearchHtml(cacheData[point.lng+'-'+point.lat])),{position:point, offset:new BMap.Size(-70, -130)});
                label.setStyle({
                fontSize : "12px",
                lineHeight : "20px",
                fontFamily:"微软雅黑",
                fontWeight:'600',
                border:'0px solid black',
                'background-color':'transparent',
                'max-width':'none'
                });
                map.addOverlay(label);
                labels[point.lng+'-'+point.lat]=label;
            }
        });
    },
    //清除条件
    clearCond(){
    let overlays=this.overlays,map=this.map;
    for (var i = 0; i < overlays.length; i++) {
        map.removeOverlay(overlays[i]);
    }

    this.overlays=[];
    }
  }
}
</script>
<style>
    .CrashAnaly .el-date-editor{width:220px;}
    .CrashAnaly .el-date-editor .el-date-editor__editor{background-color:#eeeeee !important;color:#20a0ff;}
</style>
<style scoped lang="less">
  @import "../css/variables.less";
  .CrashAnaly{width:100%;height:100%;background-color:@FrontCol;text-align:left;padding:0px;}
  .CrashAnaly .header{.border('bottom');}

  @rightW:360px;
  .right_container{width:@rightW;height:~'calc(100% - 30px)';float:right;}
  .left_container{margin-right:@rightW;height:~'calc(100% - 30px)';.border('right');}
 
  @condSet:50%;
  .right_container .condSet{width:100%;height:@condSet;}
  .right_container .condShow{height:~'calc(100% - @{condSet} - 140px)';.border('');margin:0px 10px;}
  .right_container .condGroup{height:140px;.border('');margin:0px 10px;border-top:0px;position:relative;}
  .right_container .relativePlace{height:~'calc(100% - 192px)';margin-bottom:5px;.border('');margin:0px 10px;}
  .right_container .relativePlace .palceItem{line-height:25px;padding:0px 10px;height: 30px;}
  .right_container .relativePlace .palceItem .icon{position:absolute;line-height: 28px;}
  .right_container .relativePlace .palceItem .content{margin-left:30px;width:300px;display:inline-block;overflow:hidden;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}
  
  .right_container .condShow .cond_item{padding:5px 10px;line-height:30px;}
  .right_container .condShow .cond_item .icon{float:left;}
  .right_container .condShow .cond_item .content{width:270px;margin-left:5px;overflow:hidden;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;padding:0px 10px;}

  .right_container .condGroup .condGroup_item{height:40px;margin-bottom:10px;;line-height:40px;background-color:#dcdcdc;}
  .right_container .condGroup .condGroup_item:last-child{margin-bottom:0px;}

  @condGroupInfoW:30px;
  .right_container .condGroup .condGroup_item .info{float:left;width:@condGroupInfoW;text-align:center;}
  .right_container .condGroup .condGroup_item .option_bar{margin-left:@condGroupInfoW;height:100%;padding:4px 0px;padding-right:5px;}
  .right_container .condGroup .condGroup_item .option_bar .option_item{
      float:left;width:32%;margin-right:2%;height:100%;background-color:white;border-radius:5px;padding:2px;position:relative;
  }
  .right_container .condGroup .condGroup_item .option_bar .option_item:last-child{margin-right:0px;}
  .right_container .condGroup .condGroup_item .option_bar .option_item .child{width:32%;line-height:27px;color:white;height:100%;margin-right:2%;text-align:center;background-color:#ff4c6a;float:left;border-radius:5px;position:relative;}
  .right_container .condGroup .condGroup_item .option_bar .option_item .child:nth-child(3n){margin-right:0px;}
  .right_container .condGroup .condGroup_item .option_bar .option_item .child:nth-child(n+4){margin-top:5px;}
  
  .right_container .condGroup .condGroup_item .option_bar .option_item .groupBtn .delgroup,
  .right_container .condGroup .condGroup_item .option_bar .option_item .child .delgroup{
    color:white;position:absolute;
    top: -7.5px;
    font-size: 1px;
    font-weight: 400;
    right: -7.5px;
    height: 15px;
    line-height: 15px;
    width: 15px;
    background-color: black;
    border-radius: 50%;
    cursor:pointer;
    z-index:100;
  }

  .right_container .condGroup .condGroup_item .option_bar .option_item .groupBtn{height:100%;width:100%;border-radius:5px;text-align:center;line-height:27px;color:white;font-size:12px;cursor:pointer;position:relative;}
  
  .right_container .condGroup .condGroup_item .option_bar .option_item .moreShow{position: absolute;width: 100%;bottom:100%;padding:5px;background-color:#535353;z-index:100;border-radius:5px;margin-bottom:10px;}
  .right_container .condGroup .condGroup_item .option_bar .option_item .moreShow:before{
    content:'';
    width:0;
    height:0;
    border-width:10px 10px 0;
    border-style:solid;
    border-color:#535353 transparent transparent;
    position:absolute;
    bottom:0px;
    margin-bottom:-10px;
    left:50%;
    margin-left:-10px;
  }

  .right_container .condGroup .condGroup_item .option_bar .option_item.active{background-color:#535353;}

  @condH:50px;
  @removeBtnW:30px;
  .CrashAnaly .condition{height:@condH;padding:10px 0px;}
  .CrashAnaly .condition_item{display:inline-block;line-height:30px;font-size:14px;}
  .CrashAnaly .condition_item .num{font-style:italic;}
  .CrashAnaly .condition_item .val{display:inline-block;.border('');border-radius:5px;position: relative;}
  .CrashAnaly .condition_item .val .valinfo{padding:0px @removeBtnW+10px 0px 10px;font-size:12px;}
  .CrashAnaly .condition_item .val .bar{
      position: absolute;right:0px;top:0px;width:@removeBtnW;text-align:center;background-color:@btn_Bg_Col_hover_1;color:white;
      height: 100%;border-top-right-radius: 5px;border-bottom-right-radius: 5px;cursor:pointer;
  }

  @titleH:30px;
  .CrashAnaly .setting{height:~"calc(100% - @{condH} - 22px)";.border('',@btn_Bg_Col_hover_1);border-radius:5px;}
  .CrashAnaly .setting .setting_title{background-color:@btn_Bg_Col_hover_1;color:white;padding:0px 10px;line-height:@titleH;}
  .CrashAnaly .setting .cond{padding:10px 10px;font-size:14px;}
  .CrashAnaly .setting .cond .cond_item{display:inline-block;}

  @optionH:40px;
  .CrashAnaly .setting .option_bar{height:@optionH;.border('top',@btn_Bg_Col_hover_1);padding:5px 10px 0px 10px;}
  .CrashAnaly .option_bar{.border('top');}

  //.CrashAnaly .map_container{height:~"calc(100% - @{optionH} - @{titleH} - 56px)";.border('top',@btn_Bg_Col_hover_1);}


  .CrashAnaly .cbtn{
      font-size:12px;padding:5px 10px;background-color:@FontCol;color:white;display:inline-block;border-radius: 5px;
      cursor:pointer;margin-right:10px;
  }
  .CrashAnaly .cbtn i{margin-left:10px;}

  .CrashAnaly .cbtn.blue{background-color:@btn_Bg_Col_hover_1;}
  .CrashAnaly .cbtn.green{background-color:@btn_Bg_Col_hover_6;}
  .CrashAnaly .cbtn.black{background-color:@HeaderBgCol;}
  .CrashAnaly .cbtn.white{background-color:white;color:@FontCol;.border('')}

  .listBtn{float:right;}
  
  @iconColor:#ff4c6a;
  @iconH:30px;
  .CrashAnaly .incon_item{width:@iconH;height:@iconH;line-height:@iconH;background-color:@iconColor;border-radius:5px;text-align:center;color:white;}
  
  .CrashAnaly .childB{background-color:#33bbff !important;}
  .CrashAnaly .childC{background-color:#52cc52 !important;}
  .CrashAnaly .childD{background-color:#ff7733 !important;}
</style>
