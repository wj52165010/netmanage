<!-- 数据源配置页面 -->
<template>
    <div class="Source">
       <!--数据源-->
       <div class="dataSource">
            <!--标题栏-->
            <div class="title">
                <span class="name">数据源</span>
                <!--操作栏-->
                <div class="option_bar_container">
                    <div style="float: left;width:200px;">
                        <el-input placeholder="请输入关键字搜索" v-model="searchVal" class="input-with-select">
                            <i slot="prepend" class="fa fa-search"></i>
                        </el-input>
                    </div>

                    <div style="float: left;width:200px;margin-left:10px;">
                        <el-select  
                            v-model="searchSource"
                            :clearable="true"
                            placeholder="请选择">
                            <el-option
                                v-for="item in sourceKinds"
                                :label="item.name"
                                :value="item.key">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <!--内容栏-->
            <div class="content">
                <Scroll :listen="tables">
                    <div class="source_item empty" v-for="t in tables" @click="curSelTable=t;lookFields(t);">
                        <div class="name">{{t.name}}</div>
                        <div class="desc">{{t.desc}}</div>
                        <div class="option" @click.stop="lookFields(t)">
                            <!--<el-tooltip class="item" effect="light" content="查看" placement="top"><i class="fa fa-eye"></i></el-tooltip>-->
                        </div>
                        <!--标识数据源是否被选中-->
                        <div class="iden_container" v-show="curSelTable && curSelTable.key==t.key">
                            <i class="fa fa-check iden" />
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </Scroll>
            </div>
       </div>
       <!--列字段-->
       <div class="columns" :class="{maxSize:curFieldListSize==1}">
            <!--标题栏-->
            <div class="title">
                <span class="name">数据源字段</span>
                <span v-if="curSelTable" style="font-size:12px;font-weight:600;margin-left:5px;">({{curSelTable && curSelTable.name}})</span>
                <!--右边操作项-->
                <div class="right_item" @click="toggleSize()"><i class="fa " :class="{'fa-angle-double-up':curFieldListSize==0,'fa-angle-double-down':curFieldListSize==1}"></i></div>
            </div>
            <!--内容栏-->
            <div class="content">
                <!--表头-->
                <div class="table_header">
                    <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                        <thead><tr>
                            <th @click="AllCheck()" style="cursor:pointer;width:30px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center hover table_title"><div style="width:30px;" class="divEllipsis">
                            <i class="fa" :class="{
                            'fa-square-o':!blnCheck(),
                            'fa-check-square-o':blnCheck()}" :style="{color:blnAllowCheck?'':'gray'}">
                            </i></div>
                            </th>
                            <th style="width:150px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">名称</div></th>
                            <th style="width:150px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">表名</div></th>
                            <th style="width:150px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">字段名</div></th>
                            <th style="width:350px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:350px;" class="divEllipsis">描述</div></th>
                            <th style="width:50px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis">索引</div></th>
                            <th style="width:50px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis">排序</div></th>
                            <th style="width:50px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis">快搜</div></th>
                            <th style="width:100px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">操作</div></th>
                            <th style="border-bottom:0px;border-right:1px solid #ddd;" :style="{width:descW+'px'}" class="text-center"><div :style="{width:descW+'px'}" class="divEllipsis">预览数据</div></th>
                        </tr></thead>
                    </table>
                </div>
                <div class="table_body">
                    <Scroll :listen="fields" ref="FieldScroll">
                        <table class="table" style="border-collapse: collapse;margin-top:0px;">
                            <tbody><tr v-for="f in fields">
                                <td @click="Check(f)" style="cursor:pointer;width:30px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center hover table_title"><div style="width:30px;" class="divEllipsis">
                                <i class="fa" :class="{
                                'fa-square-o':!blnCheck(f.key),
                                'fa-check-square-o':blnCheck(f.key)}" :style="{color:blnAllowCheck?'':'gray'}">
                                </i></div>
                                </td>
                                <td style="width:150px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{f.name}}</div></td>
                                <td style="width:150px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{f.tableName}}</div></td>
                                <td style="width:150px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{f.key}}</div></td>
                                <td style="width:350px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:350px;" class="divEllipsis">{{f.desc}}</div></th>
                                <td style="width:50px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis"><i class="fa" :class="{'fa-check':f.isIndex,'fa-remove':!f.isIndex}"></i></div></td>
                                <td style="width:50px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis"><i class="fa" :class="{'fa-check':f.isOrder,'fa-remove':!f.isOrder}"></i></div></td>
                                <td style="width:50px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis"><i class="fa" :class="{'fa-check':f.isQuickSearch,'fa-remove':!f.isQuickSearch}"></i></div></td>
                                <td style="width:100px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">
                                    <el-tooltip style="margin-right:5px;" effect="light" v-for="a in f.action_option" :content="a.name" placement="top">
                                        <i :class="a.icon"></i>
                                    </el-tooltip>
                                </div></td>
                                <td style="border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" :style="{width:descW+'px'}" class="text-center" :title="preViewdata[f.key]"><div :style="{width:descW+'px'}"  class="divEllipsis">{{preViewdata[f.key]}}</div></td>
                            </tr></tbody>
                        </table>
                    </Scroll>
                </div>
            </div>
       </div>
    </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import Scroll from 'components/scroll'
import {BODY_RESIZE,Set_Menu_Setting,Clear_Menu_Setting,SetMenuPageGo,PreviewSearch} from '../../store/mutation-types'
import MenuUntil from './until'
export default {
  name: 'Source',
  components:{Scroll},
  watch:{
    curFieldListSize(){
        this.$nextTick(()=>{
            setTimeout(()=>{
                this.$refs.FieldScroll.reloadyScroll();
            },500);
        });
    },
    config:{
        deep:true,
        handler:function(){
            this.$store.commit(Set_Menu_Setting,this.config);

            this.$store.commit(SetMenuPageGo,{page:'SourcePage',name:'fields',flag:this.selFields.length>0,info:'请选择显示字段!'});
            this.$store.commit(SetMenuPageGo,{page:'SourcePage',name:'source',flag:!!this.curSelTable,info:'请选择数据源!'});
        }
    },
    curSelTable(){
        if(!this.curSelTable) return
        
        this.preViewdata={};
        //获取预览数据
        this.$store.dispatch(PreviewSearch,{dbkey:[this.curSelTable.key]}).then(res=>{
            let data=res.biz_body[this.curSelTable.key] || [];
            if(data.length<=0) return;
            this.preViewdata=data[0];
        });

        //记录当前操作数据源相关数据

        this.opTables[this.curSelTable.key]=this.opTables[this.curSelTable.key] || {_selFields:[]};
        
        this.selFields=this.opTables[this.curSelTable.key]['_selFields'];

    },
    selFields(){
        if(!this.curSelTable){return;}
        //数据源切换时,需要把上个数据配置的相关信息去掉
        let config = this.opTables[this.curSelTable.key];

        if(config && config._selFields.length<=0){
            this.$store.commit(Set_Menu_Setting,{
                realtiveMenu:'',
                template:[1],
                remoteInterface:[],
                sort_by:'',
                limit:10,
                is_desc:'',
                field_options:[],
                field_btns:[],
                queryCondition:[],
            });
        }else if(config){
            this.$store.commit(Set_Menu_Setting,config);
        }

        
        let {realtiveMenu,template,remoteInterface,sort_by,limit,is_desc,field_options,field_btns,queryCondition}=this.PageData;
        this.opTables[this.curSelTable.key]['realtiveMenu']=realtiveMenu;
        this.opTables[this.curSelTable.key]['template']=template;
        this.opTables[this.curSelTable.key]['remoteInterface']=remoteInterface;
        this.opTables[this.curSelTable.key]['sort_by']=sort_by;
        this.opTables[this.curSelTable.key]['limit']=limit;
        this.opTables[this.curSelTable.key]['is_desc']=is_desc;
        this.opTables[this.curSelTable.key]['field_options']=field_options;
        this.opTables[this.curSelTable.key]['field_btns']=field_btns;
        this.opTables[this.curSelTable.key]['queryCondition']=queryCondition;

    }
  },
  data () {
    return {
      descW:0,//描述列的宽度
      sourceKinds:[{id:'CustomSource',name:'自建数据源',key:'自建数据源'},{id:'InnerSource',name:'内建数据源',key:'内建数据源'}],
      curFieldListSize:0,//0:原大小,1:最大化
      searchVal:'',//搜索关键字
      searchSource:'',//搜索数据源类型
      curSelTable:null,//当前选中的表
      fields:[],//查看的字段集合
      selFields:[],//当前选中的列集合数据
      preViewdata:{},//预览数据
      opTables:{},//缓存用户操作过得列表操作
    }
  },
  computed:mapState({
      dataSouce:state=>{return state.oriSource;},
      tables(){
            let dataSource=tool.Clone(this.dataSouce);
            if(this.searchSource){
                dataSource={[this.searchSource]:dataSource[this.searchSource]};
            }

            let data =_.chain(dataSource).values().pluck('tables').map(t=>_.values(t)).flatten().value() || [];

            if(this.searchVal){
                data=_.filter(data,d=>d.name.indexOf(this.searchVal)>=0);
            }

            return data;
      },
      //是否允许勾选列(当查看的表与选中的表不一致的情况下,不允许勾选列数据)
      blnAllowCheck(){
        if(this.fields.length<=0) return false;
        if(!this.curSelTable) return false;
        if(this.curSelTable && this.curSelTable.key!=this.fields[0].tableKey) return false;
        
        return true;
      },
      PageData:state=>{
          return state.menuManage;
      },
      config(){
          return {
            curFieldListSize:this.curFieldListSize,
            searchVal:this.searchVal,
            searchSource:this.searchSource,
            curSelTable:this.curSelTable,
            fields:this.fields,
            selFields:this.selFields
          }
      },
  }),
  mounted(){
    
    this.$store.commit(SetMenuPageGo,{page:'SourcePage',name:'source',flag:!!this.curSelTable,info:'请选择数据源!'});

    setTimeout(()=>{
        let w= $(this.$el).width();
        this.descW=w-1100;
    },0);
    this.$store.commit(BODY_RESIZE,()=>{
        setTimeout(()=>{
            let w= $(this.$el).width();
            this.descW=w-1100;
        },100);
    });

    this.recoverData();
  },
  methods:{
       //清空数据
      clearData(){
          this.$store.commit(Clear_Menu_Setting);
      },
      //恢复页面之前操作的值
      recoverData(){
        let {curFieldListSize,searchVal,searchSource,curSelTable,fields,selFields} =this.PageData;

        if(curSelTable){
            this.opTables[curSelTable.key]=this.opTables[curSelTable.key] || {_selFields:selFields};
        }

        this.curFieldListSize=curFieldListSize;
        this.searchVal=searchVal;
        this.searchSource=searchSource;
        this.curSelTable=curSelTable;
        this.fields=fields;
        this.selFields=selFields;
      },
      //切换字段列表项大小
      toggleSize(){
          this.curFieldListSize=this.curFieldListSize==0?1:0;
      },
      //全选
      AllCheck(){
          if(!this.blnAllowCheck) return;
          if(this.selFields.length===this.fields.length){
              //取消全选
              this.selFields.splice(0,this.selFields.length);
          }else{
              //全选
              this.selFields.splice(0,this.selFields.length);
              let data=tool.Clone(this.strcField(this.fields));
              for(let i=0;i<data.length;i++){
                  this.selFields.push(data[i]);
              }
              //this.selFields=tool.Clone(this.strcField(this.fields));
          }
      },
      //单选
      Check(f){
          if(!this.blnAllowCheck) return;
          let fIndex=this.selFields.map(f=>f.key).indexOf(f.key);
          if(fIndex>=0){
              //取消单选
              this.selFields.splice(fIndex,1);
          }else{
              //单选
              this.selFields.push(tool.Clone(this.strcField(f)));
          }
      },
      //判断是否选中某列(或是否全选)
      blnCheck(key){
          if(key){
            return this.selFields.map(f=>f.key).indexOf(key)>=0;
          }else{
            //判断全选
            return  _.difference(this.fields.map(f=>f.key),this.selFields.map(f=>f.key)).length<=0 && this.selFields.length>0;
          }
      },
      //构建字段在设置条件页面需要的配置数据
      strcField(f){
        return MenuUntil.strcField(f);
      },
      //查看字段
      lookFields(d){
        this.fields=MenuUntil.FieldsInfo(d);
      }
  }
}
</script>

<style scoped lang="less">
  @import "../../css/variables.less";
  .Source{width:100%;height:100%;position:relative;}
  @dataSourceH:60%;
  @titleH:40px;
  .dataSource{width:100%;height:@dataSourceH;text-align:left;}
  .dataSource .title{width:100%;height:@titleH;line-height:@titleH;padding:0px 10px;.border('top');.border('bottom');}
  .dataSource .content{width:100%;height:~'calc(100% - @{titleH})';padding-bottom:10px;padding-top:10px;}
  .dataSource .option_bar_container{height:100%;margin-left:70px;float:left;}

  .columns{width:100%;top:@dataSourceH;bottom:0px;text-align:left;position:absolute;.trans();background-color:white;}
  .columns.maxSize{top:0px;}

  .columns .title{width:100%;height:@titleH;line-height:@titleH;padding:0px 10px;.border('top');.border('bottom');}
  .columns .content{width:100%;height:~'calc(100% - @{titleH})';}

  .dataSource .name,.columns .name{font-weight:600;font-style: italic;float:left;}
  
  //数据源项样式
  @sourceItemSize:180px;
  @optionBarH:30px;
  .source_item{
              width:@sourceItemSize;
              height:110px;
              .border('');float:left;
              margin-left:50px;
              margin-bottom:50px;
              border-radius:5px;
              text-align:center;
              position:relative;
              overflow:hidden;
              cursor:pointer;
            }
  .source_item .name{width:100%;font-size:18px;font-weight:600;text-align:left;padding:10px; overflow: hidden; text-overflow: ellipsis;white-space: nowrap;}
  .source_item .desc{color:@FontCol;font-style:italic;font-size:12px;word-break: break-all;overflow:hidden;text-overflow: ellipsis;
                     text-align:left;height:~'calc(100% - 45px - @{optionBarH})';margin:0px 10px;}
  .source_item .option{
      width:100%;height:@optionBarH;overflow:hidden;border-bottom-left-radius:5px;border-bottom-right-radius:5px;
      background-color:#cccccc;
  }
  
  .source_item.empty{height:90px;}
  .source_item .option:empty{height:0px;}
  .source_item.empty .desc{background-color:#cccccc;margin:0px;height:~'calc(100% - 45px )';padding:5px 10px;}
  .source_item.empty:hover .desc{background-color:@HeaderBgCol;}

  .source_item .option .item{
      float:left;width:18%;height:100%;line-height:@optionBarH;font-size:14px;
  }
  .source_item .option .item:hover{cursor:pointer;}
  .source_item .option .item:hover i{color:white ;}

  .source_item:hover{color:white;}
  html{.TColIm(~".source_item:hover",'bg');}
  .source_item:hover .desc{color:white;}
  .source_item:hover .option{background-color:@HeaderBgCol;}
  .source_item:hover .option .item i{color:white;}
  //.source_item:hover .option .item:hover i{color:@Font_Hover_Col;}
  
  html{.TCol(~".source_item:hover .option .item:hover i");}

  .source_item .iden_container{
        position: absolute;
        top: 0px;
        right: 0px;
        width: 30px;
        height: 30px;
   }
   
   html{.TCol(~".source_item .iden_container",'lineLoopgen',45deg,transparent,50%,@Font_Hover_Col,50%,45deg,transparent,49%,@Font_Hover_Col,10%);}

  .source_item .iden{position:absolute;right: 3px; top: 2px;color: white;}

.right_item{float:right;height:100%;font-size:16px;}
.right_item:hover{cursor:pointer;}

html{.TCol(~".right_item:hover");}

//列表样式
@tableRowH:40px;
.table{margin-bottom:0px;}
.table_header{height:@tableRowH;.border('bottom');}
.table_header tr{height:~'calc(@{tableRowH} - 1px)';}
.table_header th{padding-left:0px;padding-right:0px;}
.table_header{color:white;}
html{.TColIm(~".table_header",'bg');}
.table_body{height:~'calc(100% - @{tableRowH})';width:100%;}
.table_body td{padding-left:0px;padding-right:0px;}
</style>
