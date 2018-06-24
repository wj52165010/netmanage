<!-- 列表预览组件 -->
<template>
    <div class="Preview" :class="{simplePage:data.relateMenus.length<=1}">
       <!--侧边栏-->
        <div class="slideBar" v-if="data.relateMenus.length>1">
            <el-tooltip v-for="m in relativePage" class="item" :class="{active:curPageId==m.keyid}" effect="light" :content="m.name" placement="left">
                <i :class="m.icon" @click="curPageId=m.keyid"></i>
            </el-tooltip>
        </div>

        <!--当前设置菜单页面-->
        <div class="SetMenu" v-show="relativePage[0] && curPageId==relativePage[0].keyid">
            <!--Tag栏-->
            <div class="tagBar" v-if="data.showTemplate.length>1">
                <Tag :templates="data.showTemplate" v-on:itemClick="tagClick" />
            </div>
            <!--列表显示页面-->
            <div class="pageContainer" v-if="(data.showTemplate.length==1 && data.showTemplate[0]==mapTmp['列表'].id) || curShowTmpId==mapTmp['列表'].id">
                <!--查询条件栏-->
                <div name="searchBar" class="searchBar" v-show="data.queryCondition.length>0 || data.remoteInterface.length>0">
                    <div class="queryItem" :data-index="i" v-for="(q,i) in data.queryCondition" :class="{fake:q.blnAdd==1}">
                        <div style="float:left;margin-right: 10px;line-height:36px;">{{q.name}} :</div>
                        <div style="float:left;">
                            <MaskInput v-if="searchArrType[q.type]=='文本框' && (q.blnAdd==0 || q.blnAdd==2)" :val="q.defVal" placeholder="请输入内容" :mask="q.filed.mask" />
                            <el-date-picker v-if="searchArrType[q.type]=='日期'" v-model="q.defVal" type="date" placeholder="选择日期" :picker-options="simpleTime"> </el-date-picker>
                            <el-date-picker v-if="searchArrType[q.type]=='日期范围'" v-model="q.defVal" type="datetimerange" placeholder="选择日期范围" :format="'yyyy-MM-dd'" :picker-options="timeRangeSet(q)" style="width: 220px"></el-date-picker>
                            <el-date-picker v-if="searchArrType[q.type]=='生日'" v-model="q.defVal" type="date" placeholder="选择日期"> </el-date-picker>
                            <el-select style="width:250px;" v-if="searchArrType[q.type]=='下拉框'" v-model="q.dropVal" :ccontext="q" :clearable="true" placeholder="请选择">
                                <el-option
                                    v-for="item in (q.referval || [])"
                                    :label="item.name"
                                    :value="item">
                                </el-option>
                            </el-select>
                            <PlaceSearch v-if="searchArrType[q.type]=='场所控件'" :store="store" :blnClear="true" :blnLike="true" c_searchKind="1" :ccontext="q" @place_res="placechange"></PlaceSearch>
                            <PlaceSearch v-if="searchArrType[q.type]=='区域控件'" :store="store" :blnClear="true" c_searchKind="0" :ccontext="q" @place_res="placechange"></PlaceSearch>
                            <PlaceSearch v-if="searchArrType[q.type]=='派出所控件'" :store="store" :blnClear="true" c_searchKind="2" :ccontext="q" @place_res="placechange"></PlaceSearch>
                            <virtualIden v-if="searchArrType[q.type]=='虚拟身份控件'" :val="q.defVal" :ccontext="q" :options="VirType" @change="Idenchange"></virtualIden>
                            <el-select style="width:250px;" v-if="searchArrType[q.type]=='远程字段'" v-model="q.dropVal" :ccontext="q" :clearable="true" placeholder="请选择">
                                <el-option
                                    v-for="item in (q.referval || [])"
                                    :label="item.name"
                                    :value="item">
                                </el-option>
                            </el-select>

                        </div>
                        <!--条件设置-->
                        <div class="option_bar" v-if="q.blnAdd==1 || q.blnAdd==2"><queryCond :data="q" :store="store" v-on:cancel="cancel_query" /></div>

                        <!--操作按钮-->
                        <div class="option_btn" v-if="!blnShow">
                            <i class="fa fa-hand-pointer-o dragItem"></i>
                            <i class="fa fa-pencil" @click="q.blnAdd=2"></i>
                            <i class="fa fa-remove" @click="removeCond(i)"></i>
                        </div>
                    </div>

                    <!--远程数据筛选项-->
                    <div class="queryItem" :data-index="data.queryCondition.length" v-if="data.remoteInterface && data.remoteInterface.length>0" style="line-height:40px;">
                        <div style="float:left;margin-right: 10px;line-height:36px;">远程数据:</div>
                        <div class="input" style="margin-left:10px;width:200px;float:left;">
                            <MulDropDown :data="data.remoteIds" keyProp="name">
                                <div class="remote_item" v-for="i in data.remoteInterface" @mousedown="remoteItemClick(i,data)">{{i.name}}</div>
                            </MulDropDown>
                        </div>
                        <!--操作按钮-->
                        <div class="option_btn" style="top:-30px;">
                            <i class="fa fa-hand-pointer-o dragItem" @click=""></i>
                        </div>
                    </div>

                    <!--搜索按钮-->
                    <div class="searchBtn" v-if="data.queryCondition.length>0 || data.remoteInterface.length>0">
                        <el-button type="primary" style="float:left;"><span>搜索</span></el-button>
                    </div>
                </div>
                <!--列表显示栏-->
                <div class="tableBar" :style="{height:tableH+'px'}">
                    <TableDrag ref="tableDrag" :store="store" :blnShow="blnShow" :headerBtns="headerBtns" :selIndex="selIndex" :data="previewData" :fields="data.fields" :btns="data.field_btns" v-on:headerClick="headerClick" v-on:fixHeaderClick="fixHeaderClick" />
                </div>
            </div>


            <!--图表显示-->
            <div class="pageContainer" :style="{height:pageH+'px'}" v-if="curShowTmpId==mapTmp['图表'].id && data.showTemplate && data.showTemplate.indexOf(curShowTmpId)>=0" style="text-align:center;">
                图表显示界面
            </div>

            <!--地图描点显示-->
            <div class="pageContainer" :style="{height:pageH+'px'}" v-if=" curShowTmpId==mapTmp['地图描点'].id && data.showTemplate && data.showTemplate.indexOf(curShowTmpId)>=0">
                <MapDot ref="mapDot" :data="data" :store="store" :blnPreview="true" />
            </div>

            <!--地图路径显示-->
            <div class="pageContainer" :style="{height:pageH+'px'}" v-if=" curShowTmpId==mapTmp['地图路径'].id && data.showTemplate && data.showTemplate.indexOf(curShowTmpId)>=0">
                <MapDot ref="mapPath" :data="data" :blnPath="true" :store="store" :blnPreview="true"  />
            </div>

            <!--远程数据显示-->
            <div class="pageContainer" :style="{height:pageH+'px'}" v-if=" curShowTmpId==100 && data.showTemplate && data.showTemplate.indexOf(100)>=0">
            <RemoteTable ref="remoteTable" :data="data" 
                                    :params="{model:{status:''}}"
                                    :remoteIds="data.remoteIds" 
                                    :converShowInfo="converShowInfo"
                                    :blnClickField="blnClickField"
                                    :calOptionW="calOptionW"
                                    />
            </div>

        </div>
        <!--关联页面显示-->
        <div class="relativePage" v-if="relativePage[1] && curPageId==relativePage[1].keyid">
            <templatePage :params="{model:relativePage[1]}" />
        </div>
    </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import TableDrag from 'components/tableDrag'
import {BODY_RESIZE,PreviewSearch} from '../../store/mutation-types'
import QueryCond from './queryCond'
import MaskInput from 'components/maskInput'
import searchArrType from '../../enum/SearchType.js'
import PlaceSearch from 'components/PlaceSearch'
import virtualIden from 'components/virtualIden'
import MulDropDown from 'components/MulDropDown'
import Tag from 'components/Tag'
import {tempType} from '../../enum/TempType.js'
import MapDot from 'components/MapDot'
import RemoteTable from 'components/remoteTable'
import tmpDAO from '../../js/dao/tmpDao.js'
import DragPos from '../../js/dragPos.js'

export default {
  name: 'Preview',
  props:['data','store','selIndex','blnShow','headerBtns'],
  components:{TableDrag,QueryCond,MaskInput,PlaceSearch,virtualIden,MulDropDown,Tag,MapDot,RemoteTable},
  watch:{
      data:{
          deep:true,
          handler(){
            setTimeout(()=>{
                this.tableH=this.getTableH();
                this.pageH=this.getPageH();
                this.$nextTick(()=>{
                    if(!this.$refs.tableDrag)return;
                    this.$refs.tableDrag.layout();
                })
            },300);
          }
      },
      curPageId(){
        setTimeout(()=>{
            this.tableH=this.getTableH();
            this.pageH=this.getPageH();
            this.$nextTick(()=>{
                if(!this.$refs.tableDrag)return;
                this.$refs.tableDrag.layout();
                
            })
        },300);
      },
      relativePage(){
        this.curPageId=this.relativePage[0].keyid;
      },
      fields:{
        deep:true,
        handler(val,oldVal){
            this.getPreVeiwData();
        }
      }
  },
  data () {
    return {
       simpleTime:{//限制选择今天之前的日期
          disabledDate(time) {
            return false; //time.getTime() < Date.now() - 8.64e7;
          }
       },
       beforeToday:{//限制只能选择今天之前的日期
           disabledDate(time) {
               return time.getTime() > Date.now();
           }
       },
      bodyResizeSub:null,
      tableH:0,//列表显示高度
      pageH:0,
      searchArrType:searchArrType,
      VirType:[],
      mapTmp:tempType,//模板唯一标识符映射对象
      curShowTmpId:-1,
      curPageId:'',//当前显示页面keyId
      previewData:[],//列表预览数据
    }
  },
  computed:mapState({
    //关联页面对象
    relativePage:function(state){
  
      let menus=state.setting.menus,
          relativeId=this.data.relateMenus || [],
          menu=state.menuManage.menu;
      
      return _.map(relativeId,id=>{
           return _.find(menus,m=>m.keyid==id) || menu;
      })
    },
    curSelTable:state=> state.menuManage.curSelTable,
    fields:state=>state.menuManage.selFields
  }),
  mounted(){
    this.$store=this.$store || this.store;
    this.tableH=this.getTableH();
    this.pageH=this.getPageH();
    // this.$store.commit(BODY_RESIZE,()=>{
    //     this.layout();
    // });

    this.$store.commit(BODY_RESIZE,{cb:(sub)=>{
       this.bodyResizeSub=sub
    },sub:()=>{
       this.layout();
    }});

    ser.getVidType().then(res=>{
        this.VirType=res.biz_body;
    });

    this.$nextTick(()=>{
       this.curPageId=this.relativePage[0].keyid;
    });

    //获取列表预览数据
    this.getPreVeiwData();

    let s=this;
    $(this.$el).dragpos({
       dragDomSel:'.queryItem',
       triggerDomSel:'.dragItem',
       posChange:(ori,target)=>{
           let oriIndex=ori.attr('data-index'),
               targetIndex=target.attr('data-index'),
               oriData=_.find(s.data.queryCondition,(val,i)=>i==oriIndex),
               targetData=_.find(s.data.queryCondition,(val,i)=>i==targetIndex);
            if(oriIndex==targetIndex)return;

            s.data.queryCondition.splice(oriIndex,1,targetData);
            s.data.queryCondition.splice(targetIndex,1,oriData);

       }
    });

   
    
  },
  beforeDestroy(){
    this.bodyResizeSub.unsubscribe();
  },    
  methods:{
      layout(){
          this.tableH=this.getTableH();
          this.pageH=this.getPageH();
          this.$nextTick(()=>{
            if(!this.$refs.tableDrag)return;
            this.$refs.tableDrag.layout();
          });
      },
      //禁止列表头选中切换
      blnDisableHeader(){
        this.$refs.tableDrag.blnDisableHeader();
      },
      //获取预览数据
      getPreVeiwData(){
        //获取列表预览数据
        this.$store.dispatch(PreviewSearch,{dbkey:[this.curSelTable.key],format_fields:this.fields,limit:10}).then(res=>{
            this.previewData=res.biz_body[this.curSelTable.key] || [];
        });
      },
      //多页面时页面切换
      PageChange(m){

      },
      //Tag单击事件
      tagClick(template){
        if(template==this.mapTmp['地图路径'].id){
            this.curShowTmpId=template;
            this.$nextTick(()=>{
                this.$refs['mapPath'].init();
            });
        }

        if(template==this.mapTmp['地图描点'].id){
            this.curShowTmpId=template;
            this.$nextTick(()=>{
                this.$refs['mapDot'].init();
            });
        }

        if(template==this.mapTmp['列表'].id){
            this.curShowTmpId=template;
        }

        if(template==this.mapTmp['图表'].id){
            this.curShowTmpId=template;
        }

        if(template==100 ){//远程数据
              this.curShowTmpId=template;
              this.$nextTick(()=>{
                  this.$refs['remoteTable'].calListH();
              })
          }
       
      },
      //删除查询条件
      removeCond(i){
          this.data.queryCondition.splice(i,1);
      },
      //取消配置查询项
      cancel_query(f){
          //修改取消不需要删除查询项
          if(f.blnAdd==2){f.blnAdd=0;return;}
          let index=this.data.queryCondition.indexOf(f);
          this.data.queryCondition.splice(index,1);
      },
      //获取页面高度
      getPageH(){
          let tagH=$(this.$el).find('.tagBar').height();
          return $(this.$el).height() -tagH;
      },
      //获取列表高度
      getTableH(){
          let searchH=$(this.$el).find('.searchBar').height();
          let tagH=$(this.$el).find('.tagBar').height();
          return $(this.$el).height()-$(this.$el).find('.searchBar').height() -(searchH>0?20:0) -tagH;
      },
      //转化显示字段数据
      converShowInfo(row,field){
          let info=row[field.alias] || row[field.key];
          return tmpDAO.formatData(field,info,row);
      },
      //判断字段是否为可点击跳转
      blnClickField(field,field_option){
        //超链接跳转
        if(field.formatType==4){
            return true;
        }
        if(!field_option){return false;}
        if(field_option.length<=0){return false;}
        let result=false;
        for(let option of field_option){
            if(option.key==field.key){result=true;break;}
        }

        return result;
      },
      //计算操作栏宽度
      calOptionW(options){
        let width=36;
        for(let option of options){
            width+=option.name.length*20;
        }
        return width;
      },
      //表头单击事件
      headerClick(d,i){
        this.$emit('headerClick',d,i);
      },
      //操作栏单击事件
      fixHeaderClick(){
        this.$emit('fixHeaderClick');
      },
      //有场所控件的情况，监听场所控件值改变事件
      placechange(query,val){
        if(!val)query.value='';
        query.value=_.flatten(_.map(val,v=>{return _.map(v,i=>i.code)}));
      },
      //有虚拟身份的情况,监听虚拟身份控件值改变事件
      Idenchange(query,val){
        if(!query)return;
        query.value=val;
      },
      //远程数据项单击事件
      remoteItemClick(val,item){
        let i=_.findIndex(item.remoteIds,i=>i.id==val.id);
        
        if(i>=0){
            item.remoteIds.splice(i,1);
        }else{
            item.remoteIds.push(val);
        }
      },
      //生成对应的日期范围控件限制条件参数
      timeRangeSet(query){
          let limitSel=tool.Clone(query.range?this.beforeToday:this.simpleTime);
          
          //构造快捷选项
          let shortcuts=_.map(query.timeShort,t=>{
              return {
                  text:t.name,
                  onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    
                    if(t.day==0){//今天(特殊处理)
                        picker.$emit('pick', [start, end]);
                    }else{
                        if(t.tag==0){//之前
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * t.day);
                        }else{//之后
                            end.setTime(end.getTime() + 3600 * 1000 * 24 * t.day);
                        }

                        if(t.odd==0){//范围
                            picker.$emit('pick', [start, end]);
                        }else{//单天
                            t.tag==0?picker.$emit('pick', [start, start]):picker.$emit('pick', [end, end]);
                        }
                    }
                  }
              }
          }) || [];

          limitSel.shortcuts=shortcuts;

          return limitSel;
      },
  }
}
</script>

<style scoped lang="less">
  @import "../../css/variables.less";
    .Preview{width:100%;height:100%;}
    @slideBarW:40px;
    @tagBarH:30px;
    .slideBar{width:@slideBarW;height:100%;background-color:@HeaderBgCol;float:left;}
    .searchBar,.tableBar,
    .tagBar{width:100%;}
    .tagBar{height:@tagBarH;}

    .Preview.simplePage .slideBar{width:0px;display:none;}

    .Preview.simplePage .searchBar,.Preview.simplePage .tableBar,
    .Preview.simplePage .tagBar{margin-left:0px;margin-right:0px;}

    .Preview .searchBar{padding:10px 15px;}
    .Preview .searchBtn,
    .Preview .queryItem{display:inline-block;margin-right: 10px;position:relative;}
    .Preview .queryItem.fake{width:250px;height:36px;border:1px dashed @FontCol;}

    .Preview .queryItem .option_bar{
        position:absolute;top:45px;width:200px;border-radius:5px;z-index:100;.border('');background-color:#f2f2f2;
        -moz-box-shadow:2px 1px 4px #333333; -webkit-box-shadow:2px 1px 4px #333333; box-shadow:2px 1px 4px #333333;
    }

    //远程数据项
    .remote_item{padding:0px 10px;font-size:12px;.border('bottom');}
    .remote_item:hover{cursor:pointer;color:white;}

    html{.TColIm(~".remote_item:hover",'bg');}

    .Preview .option_btn{position:absolute;top:-20px;right:0px;display:none;}
    .Preview .option_btn i:hover{cursor:pointer;}

    html{.TCol(~".Preview .option_btn i:hover");}

    .Preview .queryItem:hover .option_btn{display:block;}

    
    .Preview .pageContainer{height:100%;position:relative;margin-left:0px;width:100%;}
    .Preview.simplePage .pageContainer{margin-left:0px;}



    .slideBar .item{color:@FrontCol;padding:10px 0px;width:100%;text-align:center;cursor:pointer;}
    .slideBar .item i{color:@FrontCol;font-size:20px;}
    .slideBar .item.active i,
    //.slideBar .item:hover i{color:@btn_Bg_Col_hover_0;}

    html{.TColAdd(~".slideBar .item:hover i");}

    .Preview .SetMenu{margin-left:@slideBarW;height:100%;}
    .Preview.simplePage .SetMenu{margin-left:0px;}
    .Preview .relativePage{height:100%;margin-left:@slideBarW;overflow:hidden;}
</style>
