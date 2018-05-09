<!-- 数据源配置页面 -->
<template>
    <div class="Source">
       <!--数据源-->
       <div class="dataSource">
            <!--标题栏-->
            <div class="title">
                <span class="name">数据源</span>
                <div class="option_bar">

                    <div style="float: left;width:200px;">
                        <el-input placeholder="请输入关键字" v-model="searchVal" class="input-with-select">
                            <i slot="prepend" class="fa fa-search"></i>
                        </el-input>
                    </div>

                    <div style="float: left;width:200px;margin-left:10px;">
                        <el-select  
                            v-model="sourceKind"
                            :clearable="true"
                            placeholder="请选择">
                            <el-option
                                v-for="item in [{id:'CustomSource',name:'自建数据源',key:'自建数据源'},{id:'InnerSource',name:'内建数据源',key:'内建数据源'}]"
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
                    <div class="source_item empty" v-for="(s,i) in tables" @click="tableClick(s);curLookTableIndex=i;">
                        <div class="name">{{s.name}}</div>
                        <div class="desc">{{s.desc}}</div>
                        <div class="option" @click.stop="curLookTableIndex=i">
                            
                        </div>
                        <!--标识数据源是否被选中-->
                        <div class="iden_container" v-show="curSelTable.findIndex(function(v){return v.key==s.key;})>=0">
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
                <span style="font-size:12px;font-weight:600;font-style:italic;" v-if="tables[curLookTableIndex]" >({{tables[curLookTableIndex] && tables[curLookTableIndex].name}})</span>
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
                            <tbody><tr v-for="f in fields" v-if="tables[curLookTableIndex]">
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
                                <td style="width:50px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis"><i class="fa" :class="{'fa-check':f.isIndex,'fa-remove':!f.isIndex}"></div></td>
                                <td style="width:50px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis"><i class="fa" :class="{'fa-check':f.isOrder,'fa-remove':!f.isOrder}"></i></div></td>
                                <td style="width:50px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis"><i class="fa" :class="{'fa-check':f.isQuickSearch,'fa-remove':!f.isQuickSearch}"></i></div></td>
                                <td style="width:100px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">
                                    <el-tooltip style="margin-right:5px;" effect="light" v-for="a in f.action_option" :content="a.name" placement="top">
                                        <i :class="a.icon"></i>
                                    </el-tooltip>
                                </div></td>
                                <td style="border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center" :style="{width:descW+'px'}" :title="preViewdata[f.key]"><div :style="{width:descW+'px'}" class="divEllipsis">{{preViewdata[f.key]}}</div></td>
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
import {BODY_RESIZE,Clear_Set_Setting_Obj,Set_Setting_Obj,SetKuaiSouPageGo,PreviewSearch} from '../../store/mutation-types'
export default {
  name: 'Source',
  components:{Scroll},
  data () {
    return {
      descW:0,//描述列的宽度
      curSelTable:[],
      curLookTableIndex:-1,//当前查看表索引
      fields:[],//查看字段数据集
      curFieldListSize:0,//0:原大小,1:最大化
      sourceKind:'',//数据源类型
      searchVal:'',//搜索关键字
      preViewdata:{},
      opTables:[],
    }
  },
  watch:{
    config:{
        deep:true,
        handler:function(){
            this.$store.commit(Set_Setting_Obj,this.config);
        }
    },
    curSelTable:{
        deep:true,
        handler:function(){
            
            let fields=_.chain(this.curSelTable).pluck('fields').flatten().value();
            
            this.$store.commit(SetKuaiSouPageGo,{page:'ksearchSource',name:'fields',flag:fields.length>0,info:'请选择显示字段!'});
            this.$store.commit(SetKuaiSouPageGo,{page:'ksearchSource',name:'source',flag:this.curSelTable.length>0,info:'请选择数据源!'});
        }
    },  
    curFieldListSize(){
        this.$nextTick(()=>{
            setTimeout(()=>{
                this.$refs.FieldScroll.reloadyScroll();
            },500);
        });
    },
    curLookTableIndex(){
        if(this.curLookTableIndex==-1) {this.fields=[];return;}
        if(!this.tables[this.curLookTableIndex]){ this.fields=[]; return;}
        //表索引字段
        let indexs=_.chain(this.tables[this.curLookTableIndex].indexFields || {requisite:[],notRequisite:[]}).values().flatten().value().join(',');
        //表字段相关操作(增删改查)
        let action =this.tables[this.curLookTableIndex].action || {};

        let fields=_.map(tool.Clone(this.tables[this.curLookTableIndex].fields),f=>{
            f.tableKey=this.tables[this.curLookTableIndex].key;
            f.tableName=this.tables[this.curLookTableIndex].name;
            f.isIndex=(','+indexs+',').indexOf(','+f.key+',')>=0;
            f.action_option=_.compact([
                (action.add || {fields:[]}).fields.indexOf(f.key)>=0?{name:'新增',icon:'fa fa-plus'}:'',
                (action.update || {fields:[]}).fields.indexOf(f.key)>=0?{name:'修改',icon:'fa fa-pencil'}:'',
                action.del?{name:'删除',icon:'fa fa-remove'}:'',
                action.detail?{name:"详细",icon:'fa fa-tasks'}:''
            ]);

            return f;
        });
        this.fields=fields;

        this.preViewdata={};
        //获取预览数据
        this.$store.dispatch(PreviewSearch,{dbkey:[this.tables[this.curLookTableIndex].key]}).then(res=>{
            let data=res.biz_body[this.tables[this.curLookTableIndex].key];
            if(data.length<=0) return;
            this.preViewdata=data[0];
        });
    }
  },
  computed:mapState({
      PageData:state=>{
          return state.kuaisou;
      },
      config(){
          return {
            curSelTable:this.curSelTable,
            curLookTableIndex:this.curLookTableIndex,
            curFieldListSize:this.curFieldListSize,
            sourceKind:this.sourceKind,
            searchVal:this.searchVal,
          }
      },
      dataSouce:state=>{
        //   return {
        //     '自建数据源':{
        //         key:'自建数据源',
        //         tables:{
        //             'test':{name:'测试',key:'test',fields:[
        //                     {name:'ID',key:'id',previewVal:'ddadasdsad'},
        //                     {name:'编码',key:'code',previewVal:'1111111111'},
        //                     {name:'场所',key:'place',previewVal:'ddadasdsad'},
        //                     {name:'电话',key:'phone',previewVal:'1111111111'}
        //                 ]
        //                 },
        //             'test1':{name:'测试1',key:'test1',fields:[{name:'ID',key:'id'},{name:'编码',key:'code'}]}
        //         }
        //     },
        //     '内建数据源':{
        //         key:'内建数据源'
        //     }
        // };
          return state.oriSource;
      },
      tables(){
        let dataSource=!this.sourceKind?this.dataSouce:{[this.sourceKind]:this.dataSouce[this.sourceKind]};
        let data = tool.Clone(_.chain(dataSource).values().pluck('tables').map(d=>{
            return _.map(d,c=>c)
        }).flatten().value());

        data=this.searchVal?_.filter(data,d=>d.name.indexOf(this.searchVal)>=0):data;
        //获取支持快搜数据库
        data=_.filter(data,d=>d.isQuickSearch);

        return  data;
        
      },
      blnAllowCheck(){
          if(this.curLookTableIndex<0)return false;
          if(!this.tables[this.curLookTableIndex]){return false;}
          let curLookTable=_.find(this.curSelTable,t=>t.key==this.tables[this.curLookTableIndex].key);
          if(!curLookTable) return false;
          return true;
      }
  }),
  mounted(){
    this.$store.commit(SetKuaiSouPageGo,{page:'ksearchSource',name:'source',flag:this.curSelTable.length>0,info:'请选择数据源!'});

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

    this.$nextTick(()=>{
        this.recoverData();

        let tables=tool.Clone(this.tables);
        _.each(tables,t=>{
            let selT = _.find(this.curSelTable,s=>s.key==t.key);
            t.fields=selT?selT.fields:[];
            t.layout=selT?selT.layout || '':'';
        });

        this.opTables=tables;

    });

  },
  methods:{
    //清空页面数据
    clearData(){
        this.$store.commit(Clear_Set_Setting_Obj);
    },
    //恢复页面之前操作的值
    recoverData(){
        let {curSelTable,curLookTableIndex,curFieldListSize,sourceKind,searchVal} =this.PageData;
        this.curSelTable=curSelTable;
        this.curLookTableIndex=curLookTableIndex;
        this.curFieldListSize=curFieldListSize;
        this.sourceKind=sourceKind;
        this.searchVal=searchVal;
    },
    //切换字段列表项大小
    toggleSize(){
        this.curFieldListSize=this.curFieldListSize==0?1:0;
    },
    //数据源单击选择/取消事件
    tableClick(s){
        let index=_.findIndex(this.curSelTable,t=>t.key==s.key);
        let selTable=_.find(this.opTables,t=>t.key==s.key);
        //let table=tool.Clone(s);

        //table.fields=[];
        index<0?this.curSelTable.push(selTable):this.curSelTable.splice(index,1);
    },
    //全选
    AllCheck(){
        if(!this.blnAllowCheck) return;
        if(!this.tables[this.curLookTableIndex]){return;}
        let curLookTable=_.find(this.curSelTable,t=>t.key==this.tables[this.curLookTableIndex].key);
        let selFields=curLookTable.fields;

        if(selFields.length===this.fields.length){
            //取消全选
            selFields.splice(0,selFields.length);
        }else{
            //全选
            selFields.splice(0,selFields.length);
            selFields.push(...tool.Clone(this.fields));
        }
    },
    //单选
    Check(f){
        if(!this.blnAllowCheck) return;
        if(!this.tables[this.curLookTableIndex]){return ;}
        let curLookTable=_.find(this.opTables,t=>t.key==this.tables[this.curLookTableIndex].key);
        let selFields=curLookTable.fields;

        let fIndex=selFields.map(f=>f.key).indexOf(f.key);
        if(fIndex>=0){
            //取消单选
            selFields.splice(fIndex,1);
        }else{
            //单选
            selFields.push(f);
        }
    },
    //判断是否选中某列(或是否全选)
    blnCheck(key){
        if(this.curLookTableIndex<0)return false;
        if(!this.tables[this.curLookTableIndex]){return false;}
        let curLookTable=_.find(this.opTables,t=>t.key==this.tables[this.curLookTableIndex].key);
        if(!curLookTable) return false;

        let selFields=curLookTable.fields;
        
        if(key){
            return selFields.map(f=>f.key).indexOf(key)>=0;
        }else{
        //判断全选
            return  _.difference(this.fields.map(f=>f.key),selFields.map(f=>f.key)).length<=0 && selFields.length>0;
        }
    },
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

  .dataSource .title .option_bar{height:100%;margin-left:100px;float: left;}
  .dataSource .title .name{float:left;}

  .columns{width:100%;top:@dataSourceH;bottom:0px;text-align:left;position:absolute;.trans();background-color:white;}
  .columns.maxSize{top:0px;}

  .columns .title{width:100%;height:@titleH;line-height:@titleH;padding:0px 10px;.border('top');.border('bottom');}
  .columns .content{width:100%;height:~'calc(100% - @{titleH})';}

  .dataSource .name,.columns .name{font-weight:600;font-style: italic;}
  
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
  .source_item .name{font-size:18px;font-weight:600;text-align:left;padding:10px; overflow: hidden; text-overflow: ellipsis;white-space: nowrap;}
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

  html{.TCol(~".source_item:hover",'bg');}

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
html{.TCol(~".table_header",'bg');}
.table_body{height:~'calc(100% - @{tableRowH})';width:100%;}
.table_body td{padding-left:0px;padding-right:0px;}
</style>
