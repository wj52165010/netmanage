<!-- CCIC页面组件 -->
<template>
    <div class="CCIC">
        <div class="CCIC_container">
            <!--查询项-->
            <div class="option_bar">
                <!--报警信息过滤条件-->
                <div class="callPolice" v-show="curPageIndex==0">
                    <div class="item" style="display:none;">
                        <span>场所编码</span>
                        <div style="display:inline-block;">
                            <PlaceSearch c_searchKind="1" :blnList="true" :blnRadio="true" :blnLike="true"  @place_res="placechange"></PlaceSearch>
                        </div>
                    </div>
                    <div class="item" style="display:none;">
                        <span>MAC</span>
                        <MaskInput style="display: inherit;"  placeholder="请输入Mac" :mask="1"  @change="macChange" />
                    </div>
                    <div class="item">
                        <span>证件号</span>
                        <el-input  placeholder="请输入证件号" style="display:inline-block;" v-model="police_number"></el-input>
                    </div>
                    <div class="item">
                        <span>报警姓名</span>
                        <el-input  placeholder="请输入报警姓名" style="display:inline-block;" v-model="police_name"></el-input>
                    </div>
                    <div class="item" style="display:none;">
                        <el-select style="margin-top: 10px;" v-model="police_card_type" :clearable="true" placeholder="证件类型">
                            <el-option
                            v-for="item in GetCertificateType"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="item">
                        <el-button type="primary" @click="police_search()"><i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i><span v-show="!blnSearch">搜索</span></el-button>
                    </div>
                </div>
                <!--人员信息过滤条件-->
                <div class="personInfo" v-show="curPageIndex==1">
                    <div class="item">
                        <span>证件号</span>
                        <el-input  placeholder="请输入证件号" style="display:inline-block;" v-model="person_number"></el-input>
                    </div>
                    <div class="item">
                        <span>姓名</span>
                        <el-input  placeholder="请输入姓名" style="display:inline-block;" v-model="person_name"></el-input>
                    </div>
                    <div class="item">
                        <el-select style="" v-model="person_match_mode" placeholder="匹配模式" :clearable="true">
                            <el-option
                            v-for="item in GetMatchMode"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="item">
                        <el-button type="primary" @click="person_search()"><i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i><span v-show="!blnSearch">搜索</span></el-button>
                    </div>
                </div>
            </div>

            <!--操作栏-->
            <div class="action_bar">
                <!--报警信息操作栏-->
                <div class="policeOption" v-show="curPageIndex==0" style="width:150px;right:20px;position: absolute;z-index:1000;">
                    <el-tooltip effect="light" content="添加人员" placement="top">
                        <span class="action_item" @click="addPerson()"><i class="fa fa-user"></i>添加</span>
                    </el-tooltip>
                    <el-tooltip effect="light" content="导出报警信息" placement="top">
                        <span class="action_item" @click="exportList(0)">
                            <i v-if="!blnExporting" class="fa fa-level-up" ></i>
                            <i v-if="blnExporting" class="fa fa-spinner fa-spin" ></i>导出
                        </span>
                    </el-tooltip>
                    <!--<span class="action_item" @click="policeWay()"><i class="fa fa-cog fa-fw"></i>报警方式</span>-->
                </div>
                <!--人员信息操作栏-->
                <div class="personOption" v-show="curPageIndex==1" style="width:150px;right:20px;position: absolute;z-index:1000;">
                    <el-tooltip effect="light" content="添加人员" placement="top">
                        <span class="action_item" @click="addPerson()"><i class="fa fa-user"></i>添加</span>
                    </el-tooltip>
                    <el-tooltip effect="light" content="导出人员信息" placement="top">
                        <span class="action_item" @click="exportList(1)">
                            <i v-if="!blnExporting" class="fa fa-level-up" ></i>
                            <i v-if="blnExporting" class="fa fa-spinner fa-spin" ></i>导出
                        </span>
                    </el-tooltip>
                </div>
            </div>

            <div class="content_container">
                <HTag :tags="pages" @change="tagChange">
                    <div slot="t0" style="height:100%;width:100%;">
                        <div class="table_header">
                            <!--表头-->
                            <div class="row">
                                <div class="column" style="width:100px;"><span class="overflow" style="width:100px;">报警姓名</span></div>
                                <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">证件类型</span></div>
                                <div class="column" style="width:200px;"><span class="overflow" style="width:200px;">证件号</span></div>
                                <div class="column" style="width:200px;">
                                    <span class="overflow" style="width:200px;">报警时间</span>
                                    <!--<div class="sort_item" style="display: inline-block;text-align: center;position:relative;">
                                    <div class="triangle-up" style="position: absolute;top:-11px;" :class="{active:timeSort==1}" @click="timeSort=1"></div>
                                    <div class="triangle-down" style="position: absolute;top:-4px;" :class="{active:timeSort==2}" @click="timeSort=2"></div>
                                    </div>-->
                                </div>
                                <div class="column" style=""><span class="overflow" :style="{width:police_auto_column_w+'px'}">报警场所</span></div>
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
                                            <div class="column" style="width:150px;" :title="d.certificate_type"><span class="overflow" style="width:150px;">{{d.certificate_type}}</span></div>
                                            <div class="column" style="width:200px;" :title="d.certificate_code"><span class="overflow" style="width:200px;">{{d.certificate_code}}</span></div>
                                            <div class="column" style="width:200px;" :title="converTimestamp(d.detect_time)"><span class="overflow" style="width:200px;">{{converTimestamp(d.detect_time)}}</span></div>
                                            <div class="column" style="color:rgb(3, 171, 103);" :title="d.netbar_name">
                                                <span class="overflow" style="cursor:pointer;" @click="placeClick(d)" :style="{width:police_auto_column_w+'px','text-decoration':d.equipment_latitude?'underline':''}">
                                                    <el-tooltip effect="light" content="无经纬度,无法定位!" placement="top" v-if="!d.equipment_latitude">
                                                        {{d.netbar_name}}
                                                    </el-tooltip>

                                                    <span v-if="d.equipment_latitude">{{d.netbar_name}}</span>
                                                </span>
                                            </div>
                                            <div class="column" style="width:150px;" :title="d.source_type"><span class="overflow" style="width:150px;">{{d.source_type}}</span></div>
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
                        <div class="table_header">
                            <!--表头-->
                            <div class="row">
                            <div class="column" style="width:50px;"><span class="overflow" style="width:50px;">选择</span></div>
                            <div class="column" style="width:150px;">
                                <span class="overflow" style="width:150px;">创建时间</span>
                                <!--<div class="sort_item" style="display: inline-block;text-align: center;position:relative;">
                                    <div class="triangle-up" style="position: absolute;top:-11px;" :class="{active:timeSort==1}" @click="timeSort=1"></div>
                                    <div class="triangle-down" style="position: absolute;top:-4px;" :class="{active:timeSort==2}" @click="timeSort=2"></div>
                                </div>-->
                            </div>
                            <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">证件类型</span></div>
                            <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">姓名</span></div>
                            <div class="column" style="width:300px;"><span class="overflow" style="width:300px;">证件号码</span></div>
                            <div class="column" style=""><span class="overflow" :style="{width:person_auto_column_w+'px'}">匹配方式</span></div>
                            <div class="column" style="width:150px;"><span class="overflow" style="width:150px;">操作</span></div>
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
                                                <span class="overflow" style="width:50px;">
                                                    <i class="fa" style="cursor:pointer;" :class="{'fa-square-o':!d.sel,'fa-check-square-o':d.sel}" @click="person_check(d)"></i>
                                                </span>
                                            </div>
                                            <div class="column" style="width:150px;" :title="converTimestamp(d.log_time)"><span class="overflow" style="width:150px;">{{converTimestamp(d.log_time)}}</span></div>
                                            <div class="column" style="width:150px;" :title="converCertificateType(d.certificate_type)"><span class="overflow" style="width:150px;">{{converCertificateType(d.certificate_type)}}</span></div>
                                            <div class="column" style="width:150px;" :title="d.customer_name"><span class="overflow" style="width:150px;">{{d.customer_name}}</span></div>
                                            <div class="column" style="width:300px;" :title="d.certificate_code"><span class="overflow" style="width:300px;">{{d.certificate_code}}</span></div>
                                            <div class="column" style="" :title="converMatchWay(d.crime_match_mode)"><span class="overflow" :style="{width:person_auto_column_w+'px'}">{{converMatchWay(d.crime_match_mode)}}</span></div>
                                            <div class="column" style="width:150px;">
                                                <span class="overflow" style="width:150px;color:rgb(3, 193, 215);">
                                                    <el-tooltip style="cursor:pointer;" class="item" effect="light" content="详细" placement="top">
                                                        <i class="fa fa-navicon" @click="detailPerson(d)"></i>
                                                    </el-tooltip>
                                                    <el-tooltip style="cursor:pointer;color:rgb(3, 193, 215);" class="item" effect="light" content="删除" placement="top">
                                                        <i class="fa fa-remove" @click="removePerson(d)"></i>
                                                    </el-tooltip>
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
</template>

<script>
import Vue from 'vue'
import HTag from 'components/HTag'
import PlaceSearch from 'components/PlaceSearch'
import Scroll from 'components/scroll'
import ScaleBar from 'components/scaleBar'
import {BODY_RESIZE,GetCertificateType,CCICPoliceData,CCICGetPerson,CCICAddPerson,GetMatchMode,CCICDelPerson,ExportCriminal,ExportCriminalLog} from '../store/mutation-types'
import InputDir from 'components/Input'
import MaskInput from 'components/maskInput'
import '../../static/jquery-file-upload/jquery.ui.widget.js'
import '../../static/jquery-file-upload/jquery.iframe-transport.js'
import '../../static/jquery-file-upload/jquery.fileupload.js'
import '../../static/jquery.particleground.js'

export default {
  name: 'CCIC',
  components:{
      HTag,
      PlaceSearch,
      Scroll,
      MaskInput,
  },
  data () {
    return {
      beforeToday:{//限制只能选择今天之前的日期
        disabledDate(time) {
            return time.getTime() > Date.now();
        }
      },
      bodyResizeSub:null,
      pages:[{name:'报警信息',icon:'fa fa-tag'},{name:'人员信息',icon:'fa fa-tag'}],
      curPageIndex:0,
      pageNum:20,
      blnSearch:false,
      police_time:[],
      police_number:'',
      police_name:'',
      police_pageIndex:0,
      police_card_type:'',
      police_mac:'',
      police_netbar_wacode:'',
      police_data:[],
      person_creater:'',
      person_name:'',
      person_time:[],
      person_number:'',
      person_pageIndex:0,
      person_match_mode:'',
      person_data:[],
      personAllSel:false,
      GetCertificateType:[],//证件类型
      GetMatchMode:[],//匹配模式
      timeSort:1,
      police_auto_column_w:0,//报警信息列表自适应列宽度
      person_auto_column_w:0,//人员信息列表自适应列宽度
      mapLevel:ser.map,
      blnExporting:false,
    }
  },
  mounted(){
    
    this.loadData();

    let containerEl=$(this.$el).find('div[class="CCIC_container"]');
    let optBarEl=$(this.$el).find('div[class="option_bar"]');
    let listEl=$(this.$el).find('div[class="content_container"]'); 

    setTimeout(()=>{
        listEl.css('height',containerEl.height()-optBarEl.height());
    },100);

    this.police_auto_column_w=$(this.$el).width()-800;
    this.person_auto_column_w=$(this.$el).width()-950;
    // this.$store.commit(BODY_RESIZE,()=>{
    //     listEl.css('height',containerEl.height()-optBarEl.height());
    //     this.police_auto_column_w=$(this.$el).width()-800;
    //     this.person_auto_column_w=$(this.$el).width()-950;
    // });

    this.$store.commit(BODY_RESIZE,{cb:(sub)=>{
        this.bodyResizeSub=sub
    },sub:()=>{
        listEl.css('height',containerEl.height()-optBarEl.height());
        this.police_auto_column_w=$(this.$el).width()-800;
        this.person_auto_column_w=$(this.$el).width()-950;
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
          //加载报警记录数据
          this.$store.dispatch(CCICPoliceData,{
              limit:this.pageNum,
              skip:this.police_pageIndex*this.pageNum})
          .then(res=>{
              this.police_data=res.biz_body;
          });

          //加载人员记录数据
          this.$store.dispatch(CCICGetPerson,{
              limit:this.pageNum,
              skip:this.person_pageIndex*this.pageNum})
          .then(res=>{
              this.person_data=res.biz_body;
          });

          //获取证件类型
          this.$store.dispatch(GetCertificateType).then(res=>{
              this.GetCertificateType=res.biz_body;
          });

          //获取匹配模式
          this.$store.dispatch(GetMatchMode).then(res=>{
              this.GetMatchMode=res.biz_body;

          });
      },
      //导出列表信息
      exportList(i){
        this.blnExporting=true;
        let policeParam={
            customer_name:this.police_name,
            certificate_code:this.police_number,
            certificate_type:this.police_card_type,
            netbar_wacode:this.police_netbar_wacode,
            mac:this.police_mac
        },
        personParam={
            customer_name:this.person_name,
            certificate_code:this.person_number,
            crime_match_mode:this.person_match_mode
        };
        this.$store.dispatch(i==0?ExportCriminalLog:ExportCriminal,i==0?policeParam:personParam
        ).then(res=>{
            this.blnExporting=false;

            if(!tool.msg(res,'导出成功!','导出失败!')) return;
            if(!res.biz_body.url) return;
            window.location=res.biz_body.url;

        });
      },
      //场所地址字段单击事件
      placeClick(d){
          if(!d.equipment_latitude || !d.equipment_longitude){return;}
          let s=this;
          tool.open(function(){
              let html=`
                <div name="map_container" style="width:100%;height:100%;"></div>
                <div style="position:absolute;top:10px;left:10px;">
                    <ScaleBar :start="mapLevel[0]" :end="mapLevel[1]" :defVal="mapLevel[2]" @change="zoomChange" ref="scaleBar" />
                </div>
              `;

              let param={
                title:'位置信息',
                area:['800px','400px'],
                content:`<div name="map_container_pop" style="width:100%;height:400px;position:relative;">${html}</div>`,
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

                    let map =  new BMap.Map(layero.find('div[name="map_container"]')[0],{minZoom:s.mapLevel[0],maxZoom:s.mapLevel[1]});
                    param.selfData.map=map;
                    map.centerAndZoom(new BMap.Point(d.equipment_longitude,d.equipment_latitude),s.mapLevel[2]);//重庆中心点
                    map.enableScrollWheelZoom(true);

                    var marker=new BMap.Marker(new BMap.Point(d.equipment_longitude,d.equipment_latitude));
                    map.addOverlay(marker);
                    
                    //场所名称
                    var labelName= new BMap.Label(`<div style="width:300px;text-align:center;">${d.netbar_name}</div>`,{position:new BMap.Point(d.equipment_longitude,d.equipment_latitude), offset:new BMap.Size(-150,-60)});
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

                    //添加地图层级改变事件
                    map.addEventListener('zoomend',(e)=>{
                        var zoom=map.getZoom();
                        param.$refs.scaleBar.setVal(zoom);
                    });
                }
              }

              return param;
          }());
      },
      //转化时间戳为日期格式
      converTimestamp(timestamp){
          return tool.DateByTimestamp(timestamp,'yyyy-MM-dd hh:mm:ss');
      },
      //转化对应的证件类型
      converCertificateType(type){
          return (_.find(this.GetCertificateType,g=>g.code==type) || {name:''}).name;
      },
      //转化对应的匹配方式
      converMatchWay(code){
          return (_.find(this.GetMatchMode,g=>g.code==code) || {name:''}).name;
      },
      tagChange(index){
          this.curPageIndex=index;
          this.$nextTick(()=>{
            let containerEl=$(this.$el).find('div[class="CCIC_container"]');
            let optBarEl=$(this.$el).find('div[class="option_bar"]');
            let listEl=$(this.$el).find('div[class="content_container"]'); 

            setTimeout(()=>{
                listEl.css('height',containerEl.height()-optBarEl.height());
            },100);
          });
      },
      placechange(context,val){
          let sites=val.sites || [];
          this.police_netbar_wacode=(sites[0] || {code:''}).code;
        
      },
      macChange(val){
          this.police_mac=val;
      },        
      police_search(){
        this.police_pageIndex=0;
        this.$store.dispatch(CCICPoliceData,{
            limit:this.pageNum,
            skip:this.police_pageIndex*this.pageNum,
            customer_name:this.police_name,
            certificate_code:this.police_number,
            certificate_type:this.police_card_type,
            netbar_wacode:this.police_netbar_wacode,
            mac:this.police_mac
            })
        .then(res=>{
            let data =res.biz_body;
            this.police_data=res.biz_body;
        });
      },
      police_pageChange(pageNum){
        this.police_pageIndex=pageNum>0? pageNum : 0;
        this.$store.dispatch(CCICPoliceData,{
            limit:this.pageNum,
            skip:this.police_pageIndex*this.pageNum,
            customer_name:this.police_name,
            certificate_code:this.police_number,
            certificate_type:this.police_card_type,
            netbar_wacode:this.police_netbar_wacode,
            mac:this.police_mac
            })
        .then(res=>{
            let data =res.biz_body;
            if(data.length<=0){
                tool.msg({msg:{code:'successed'}},'已经到了最后页!','已经到了最后页!');
                this.police_pageIndex--;
                return;
            }

            this.police_data=res.biz_body;
        });
      },
      person_search(){
          this.person_pageIndex=0;
          this.$store.dispatch(CCICGetPerson,{
              limit:this.pageNum,
              skip:this.person_pageIndex*this.pageNum,
              customer_name:this.person_name,
              certificate_code:this.person_number,
              crime_match_mode:this.person_match_mode
            })
          .then(res=>{
                let data =res.biz_body;
                this.person_data=res.biz_body;
          });

      },
      person_pageChange(pageNum){
          this.person_pageIndex=pageNum>0? pageNum : 0;
          this.$store.dispatch(CCICGetPerson,{
              limit:this.pageNum,
              skip:this.person_pageIndex*this.pageNum,
              customer_name:this.person_name,
              certificate_code:this.person_number,
              crime_match_mode:this.person_match_mode
            })
          .then(res=>{
                let data =res.biz_body;
                if(data.length<=0){
                    tool.msg({msg:{code:'successed'}},'已经到了最后页!','已经到了最后页!');
                    this.person_pageIndex--;
                    return;
                }
                this.person_data=res.biz_body;
          });
      },
      //批量删除在逃人员
      batchesRemove(){
          let ids=_.chain(this.person_data).filter(p=>p.sel).map(r=>r.crime_id).value() || [];
          if(ids.length<=0){tool.info('请选择需要删除的数据项!'); return;}

          tool.confirm('您确定要删除该人员信息吗?',['确定','取消'],()=>{
            this.$store.dispatch(CCICDelPerson,ids).then(res=>{
                if(!tool.msg(res,'删除成功!','删除失败!'))return;
                for(let id of ids){
                    this.person_data.splice(_.findIndex(this.person_data,t=>{return t.crime_id==id}),1);
                }
            });
          },function(){});

      },
      //删除在逃人员
      removePerson(d){
        tool.confirm('您确定要删除该人员信息吗?',['确定','取消'],()=>{
            this.$store.dispatch(CCICDelPerson,[d.crime_id]).then(res=>{
                if(!tool.msg(res,'删除成功!','删除失败!'))return;
                this.person_data.splice(_.findIndex(this.person_data,t=>{return t.crime_id==d.crime_id}),1);
            });
        },function(){});
      },
      detailPerson(d){
        let s=this;
        tool.open(function(){
            let html=`
            <div style="width:100%;height:100%;">
                <div style="padding:10px;">
                    <div style="padding-left:5px;line-height:30px;">CCIC人员信息</div>
                    <div class="table_header" style="border-top:1px solid #ebedee;border-left:1px solid #ebedee;">
                        <div class="row">
                            <div class="column" style="width:150px;">
                                创建时间
                            </div>
                            <div class="column" style="width:150px;">证件类型</div>
                            <div class="column" style="width:150px;">姓名</div>
                            <div class="column" style="">证件号码</div>
                            <div class="column" style="width:150px;">匹配方式</div>
                        </div>
                    </div>
                    <div class="table_body">
                        <div class="table_conatienr" style="border-left:1px solid #ebedee;">
                            <div class="row">
                                <div class="column" style="width:150px;">{{converTimestamp(d.log_time)}}</div>
                                <div class="column" style="width:150px;">{{converCertificateType(d.certificate_type)}}</div>
                                <div class="column" style="width:150px;">{{d.customer_name}}</div>
                                <div class="column" style="">{{d.certificate_code}}</div>
                                <div class="column" style="width:150px;">{{converMatchWay(d.crime_match_mode)}}</div>
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
                        <div class="column" style="width:100px;"><span style="width:100px;" class="divEllipsis">姓名</span></div>
                        <div class="column" style="width:150px;"><span style="width:150px;" class="divEllipsis">证件类型</span></div>
                        <div class="column" style="width:150px;"><span style="width:150px;" class="divEllipsis">证件号</span></div>
                        <div class="column" style="width:150px;">
                            <span style="width:150px;" class="divEllipsis">报警时间</span>
                        </div>
                        <div class="column" style="width:100px;"><span style="width:100px;" class="divEllipsis">报警场所</span></div>
                        <div class="column" style="width:150px;"><span style="width:150px;" class="divEllipsis">报警来源</span></div>
                    </div>
                </div>
                <div class="table_body" style="height:300px;">
                    <Scroll :listen="p" :store="store">
                        <div class="table_conatienr">
                            <template v-for="d in p">
                                <div class="row">
                                    <div class="column" style="width:100px;"><span style="width:101px;" class="divEllipsis">{{d.customer_name}}</span></div>
                                    <div class="column" style="width:150px;"><span style="width:150px;" class="divEllipsis">{{d.certificate_type}}</span></div>
                                    <div class="column" style="width:150px;"><span style="width:150px;" class="divEllipsis">{{d.certificate_code}}</span></div>
                                    <div class="column" style="width:150px;"><span style="width:150px;" class="divEllipsis">{{converTimestamp(d.detect_time)}}</span></div>
                                    <div class="column" style="width:100px;"><span style="width:100px;" class="divEllipsis">{{d.netbar_wacode}}</span></div>
                                    <div class="column" style="width:150px;"><span style="width:150px;" class="divEllipsis">{{d.source_type}}</span></div>
                                </div>
                            </template>
                        </div>
                    </Scroll>
                </div>
            </div>
            `;
            let param={
                    title:'人员详情',
                    content:html,
                    area:'800px',
                    components:{Scroll},
                    context:{
                        d:d,//人员数据
                        p:[],//报警数据
                        converTimestamp:s.converTimestamp,
                        converCertificateType:s.converCertificateType,
                        converMatchWay:s.converMatchWay,
                        store:s.$store,
                    },
                    success(){
                        s.$store.dispatch(CCICPoliceData,{crime_id:d.crime_id}).then(res=>{
                            param.selfData.p=res.biz_body;
                        });
                    }
            };

        return param;
        }());
      },
      //添加在逃人员
      addPerson(){
          let s=this;

          tool.open(function(){
              let html=`
                <HTag :tags="pages">
                    <div slot="t0" style="height:100%;width:100%;padding:10px;">

                        <InputDir label="姓名" @change="name_change" :val="name"/>

                        <el-select style="margin-top: 10px;" v-show="false" v-model="cardType" placeholder="证件类型">
                            <el-option
                            v-for="item in cTypes"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                            </el-option>
                        </el-select>

                        <InputDir label="证件号码" @change="card_num_change" :val="cardNum"/>

                        <el-select style="margin-top: 10px;" v-model="match_mode" placeholder="匹配模式">
                            <el-option
                            v-for="item in mTypes"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                            </el-option>
                        </el-select>
                        
                        <div style="margin-top:10px;display:none;">
                            <el-button-group style="width:100%;">
                                    <el-button style="width:50%;" :class="{active:sms=='open'}" @click="sms='open';">短信开启</el-button>
                                    <el-button style="width:50%;" :class="{active:sms=='close'}" @click="sms='close';">短信关闭</el-button>
                            </el-button-group>
                        </div>

                        <div v-show="sms=='open'">
                            <InputDir label="通知次数" @change="broadcastChange" :val="broadcastNum"/>
                            <InputDir label="短信间隔" @change="gapChange" :val="gap"/>
                            <InputDir label="短信格式" @change="formatChange" :val="format"/>
                        </div>

                        <div style="text-align:right;margin-top:10px;">
                                <button type="button" class="btn btn-success" style="font-size:12px;" @click="addPerson()">完成</button>
                                <button type="button" class="btn btn-default" style="font-size:12px;" @click="close()">关闭</button>
                        </div>
                    </div>
                    <div slot="t1" style="height:100%;width:100%;position:relative;">
                        <div style="position:absolute;top:0px;width:100%;z-index: 100000;padding: 0px 50px;">
                            <el-select style="margin-top: 10px;" v-model="match_mode" placeholder="匹配模式">
                                <el-option
                                v-for="item in mTypes"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code">
                                </el-option>
                            </el-select>
                        </div>
                        <div :id="'cpop'+fileId" style="width:100%;height:calc(100% - 50px);position:relative;text-align:center;">
                            <input  :id="'c'+fileId" :data-url="url" multiple type="file" style="width: 0px;position: absolute;top: 0px;right: 0px;bottom: 0px;margin: 0px;opacity: 0;direction: ltr;cursor: pointer;" />
                            <i class="fa fa-cloud-upload" style="font-size: 150px;color: gray;/*! text-align: center; */margin-top: 40px;"></i>
                            <div style="position:absolute;bottom:0px;text-align:center;width:100%;" v-show="!uploadInfo">将文件拖拽至此，或<span @click="addFiles()" style="color:red;cursor:pointer;">点击此处</span>上传</div>
                            <div style="position:absolute;bottom:0px;text-align:center;width:100%;" v-show="uploadInfo">{{uploadInfo}}</div>
                        </div>
                        <div style="display:none;text-align:right;width:100%;color:gray;font-size:12px;cursor:pointer;padding:0px 10px;" @click="uploadFormat()">*文件上传标准</div>
                        <div style="text-align:right;margin-top:10px;padding:0px 10px;border-top:1px solid #e7eaec;padding-top:5px;margin-bottom:5px;">
                                <button type="button" class="btn btn-success" style="font-size:12px;" @click="addBatchPerson()">完成</button>
                        </div>
                    </div>
                </HTag>
              `; 

              let param={
                title:'添加在逃人员',
                area:'400px',
                content:`<div class="person_run_pop" style="height:100%;width:100%;">${html}</div>`,
                components:{
                    HTag,InputDir,MaskInput
                },
                store:s.$store,
                context:{
                    url:ser.uri+'/upload/file',//上传地址
                    pages:[{name:'手动添加',icon:'fa fa-tag'},{name:'批量导入',icon:'fa fa-tag',disable:false,tip:''}],
                    cTypes:_.filter(s.GetCertificateType,s=>s.code!=501),//证件类型
                    mTypes:s.GetMatchMode,//匹配类型
                    fileId:tool.guid(),
                    cards:[],//证件类型集合
                    cardType:_.filter(s.GetCertificateType,s=>s.code!=501)[0].code,//证件类型
                    cardNum:'',//证件号码
                    sms:'close',//是否开启短信报警
                    name:'',//姓名
                    match_mode:'',//匹配模式
                    broadcastNum:'',//短信通知次数
                    gap:'',//短信间隔
                    format:'',//短信格式
                    uploadInfo:'',
                    broadcastChange(val){param.selfData.broadcastNum=val;},
                    gapChange(val){param.selfData.gap=val;},
                    formatChange(val){param.selfData.format=val;},
                    card_num_change(val){param.selfData.cardNum=val;},
                    name_change(val){param.selfData.name=val;},
                    addPerson(){
                        let data=param.selfData;
                        let alarm_way={
                            sms:data.sms=='open'?{broadcastNum:data.broadcastNum,gap:data.gap,format:data.format}:{},
                        };//报警方式具体联络地址
                        
                        //验证数据
                        if(!data.name && !data.cardNum){tool.info('姓名和证件号至少填写一项!'); return;}
                        //身份证
                        if(data.cardType && data.match_mode=='10' && !data.cardNum){tool.info('身份匹配模式下,证件号不能为空!'); return;}

                        //姓名+身份证
                        if(data.cardType && data.match_mode=='11' && (!data.cardNum || !data.name)){tool.info('姓名,身份匹配模式下,姓名,证件号不能为空!'); return;}
                        //姓名
                        if(data.cardType && data.match_mode=='01' && !data.name){tool.info('姓名匹配模式下,姓名不能为空!'); return;}

                        //验证证件号
                        let han=/^[a-zA-Z0-9]*$/;//中文验证
                        let idReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份证验证
                        if(data.cardNum && !han.test(data.cardNum)){tool.info('证件号非法!');return;}
                     
                        if(data.cardNum && !idReg.test(data.cardNum)){tool.info('证件号非法!');return;}
                        


                        let temp={
                            certificate_type:data.cardType || '',
                            certificate_code:data.cardNum || '',
                            customer_name:data.name || '',
                            crime_match_mode:data.match_mode || '',
                            alarm_account:alarm_way
                        };

                        s.$store.dispatch(CCICAddPerson,temp).then(res=>{
                            if(!tool.msg(res,'添加成功!','新增失败!')) return;
                            s.person_data.push(res.biz_body);
                        });

                        param.close();
                    },
                    addBatchPerson(){
                        param.close();
                    },
                    mackChange(val){param.selfData.mac=val;},
                    //添加上传文件
                    addFiles(){
                        let s=param.selfData,uploadEl=$('#c'+s.fileId);
                        uploadEl.click();
                    },
                    close(){
                        param.close();
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

                                if(!s.match_mode){tool.info('请选择匹配模式!');return;}

                                data.formData ={code:'criminal',crime_match_mode:s.match_mode || '',user_id:tool.cookie.get('userid')};
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
                    //显示上传格式页面
                    uploadFormat(){
                        tool.open(function(){
                            let html=`
                                <div style="padding:15px;">
                                    <div>标准示例:</div>
                                    <div class="table_header" style="border-top:1px solid #ebedee;border-left:1px solid #ebedee;">
                                        <div class="row">
                                            <div class="column" style="width:50%;">XM</div>
                                            <div class="column" style="width:50%;">SFZH</div>
                                        </div>
                                    </div>
                                    <div class="table_body">
                                        <div class="table_conatienr" style="border-left:1px solid #ebedee;">
                                            <div class="row">
                                                <div class="column" style="width:50%;"></div>
                                                <div class="column" style="width:50%;"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="margin-top:15px;">说明:</div>
                                    <div style="margin:8px 30px;">1.列分隔符:,</div>
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
                    }
                },
                success(){
                    param.selfData.initUpload();
                },

              };
              
              return param;
          }());
      },
      //报警方式
      policeWay(){
          tool.open(function(){
              let html=`
                <div class="clearfix" style="line-height: 40px;">
                    <span style="width:90px;float:left;text-align:center;">短信报警:</span>
                    <div style="margin-left:90px;">
                        <el-button-group style="width:100%;">
                                <el-button style="width:50%;" :class="{active:status=='normal'}" @click="status='normal';">开启</el-button>
                                <el-button style="width:50%;" :class="{active:status=='lock'}" @click="status='lock';">关闭</el-button>
                        </el-button-group>
                    </div>
                </div>
              `;
              let param={
                   title:'短信报警设置',
                    area:['400px','335px'],
                    content:`<div class="preview_pop" style="height:100%;width:100%;">${html}</div>`,
                    components:{
                      InputDir
                    },
                    context:{
                        status:'nomal',//短信状态(开启,关闭)
                    }
              };

              return param;
          }());
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
      //人员全选操作
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
      }
  }
}
</script>

<style lang="less">
    @import "../css/variables.less";
    .person_run_pop .el-button.active{color:white;}
    html{.TCol(~".person_run_pop .el-button.active",'bg');}
</style>

<style scoped lang="less">
  @import "../css/variables.less";
  .CCIC{width:100%;height:100%;padding:5px;}
  .CCIC_container{background-color:@FrontCol;width:100%;height:100%;position:relative;}
  .option_bar{width:100%;padding-left:15px;padding-right:15px;.border('bottom');line-height:40px;}
  .option_bar .personInfo,
  .option_bar .callPolice{text-align:left;}
  .option_bar .item{display:inline-block;margin-right:10px;}

  .action_bar{position:absolute;text-align:right;width:100%;line-height:40px;padding-right:15px;}
  .action_bar .action_item{margin-left:10px;}
  .action_bar .action_item i{ margin-right:3px;}
  .action_bar .action_item:hover{cursor:pointer;}
  html{.TCol(~".action_bar .action_item:hover");}

  .CCIC .content_container{width:100%;height:~"calc(100%  - 55px)";}
  

   //列表显示样式
  @header_H:40px;
  @gainCol:#019cdc;
  @collectCol:#85c226;
  @resultCol:#f8c301;
  .CCIC .table_header{height:@header_H;display:table;width:100%;border:none;color:white;}
  html{.TCol(~".CCIC .table_header .row",'bg');}

  .CCIC .table_header .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
  .CCIC .row{height:@header_H;display:table-row;width:100%;line-height:@header_H;.border('bottom');}
  .CCIC .table_header .column .sort_item .triangle-up:hover{cursor:pointer;}
  html{.TCol(~".CCIC .table_header .column .sort_item .triangle-up:hover",'bbc');}
  .CCIC .table_header .column .sort_item .triangle-down:hover{cursor:pointer;}
  html{.TCol(~".CCIC .table_header .column .sort_item .triangle-down:hover",'btc');}
  //.CCIC .table_header .column .sort_item .triangle-up.active{border-bottom-color:@Font_Hover_Col;}
  html{.TCol(~".CCIC .table_header .column .sort_item .triangle-up.active",'bbc');}
  //.CCIC .table_header .column .sort_item .triangle-down.active{border-top-color:@Font_Hover_Col;}
  html{.TCol(~".CCIC .table_header .column .sort_item .triangle-down.active",'btc');}
  
  .CCIC .table_body{width:100%;height:~"calc(100% - @{header_H} - 40px)";.border('bottom');}
  .CCIC .table_conatienr{width:100%;display:table;width:100%;border:none;}
  .CCIC .table_conatienr .column{display:table-cell;text-align:center;.border('right');overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
  
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

 .overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}
</style>
