<!-- 数据库数据上传 -->
<template>
    <div class="UploadDataBase">
        <!--解析规则展示页面-->
        <div class="pageItem" v-if="curPageIndex==0">
            <div class="title">
                <span class="item" @click="addSet()"><i class="fa fa-plus" style="margin-right:5px;"></i>解析规则</span>
            </div>

            <!--展示区域-->
            <div class="content">
                <!--表头-->
                <div class="table_header">
                    <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                        <thead><tr>
                            <th style="border-bottom:0px;border-right:1px solid #ddd;" :style="{width:descW+'px'}" class="text-center"><div :style="{width:descW+'px'}" class="divEllipsis">来源数据</div></th>
                            <th style="width:100px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">类型</div></th>
                            <th style="width:100px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">映射字段数</div></th>
                            <th style="width:100px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">操作</div></th>
                        </tr></thead>
                    </table>
                </div>
                <!--标体-->
                <div class="table_body">
                    <Scroll :listen="rules" ref="scroll">
                        <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                            <thead><tr v-for="(r,i) in rules">
                                <td style="border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" :style="{width:descW+'px'}" class="text-center"><div :style="{width:descW+'px'}" class="divEllipsis">{{getSourceName(r.source_code)}}</div></td>
                                <td style="width:100px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">{{getQueryName(r.query_kind)}}</div></td>
                                <td style="width:100px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">{{r.columns.length}}</div></td>
                                <td style="width:100px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">
                                 <i class="fa fa-eye option" @click="lookRule(r)"></i>
                                 <i class="fa fa-remove option" @click="removeRule(r,i)"></i>
                                </div></td>
                            </tr></thead>
                        </table>
                    </Scroll>
                </div>
            </div>
            <!--操作按钮-->
            <div class="option_bar">
                <button type="button" class="btn btn-default" @click="close()">关闭</button>
            </div>
        </div>

        <!--配置映射(新增映射规则)-->
        <div class="pageItem" v-if="curPageIndex==1">
            <div class="notitle_content">
                <FieldMap :model="1" :source="code" />
            </div>
            <!--操作按钮-->
            <div class="option_bar">
                <button type="button" class="btn btn-default" v-show="curPageIndex==1" @click="pageChange(0);clearData()">取消</button>
                <!--<button type="button" class="btn btn-default" @click="saveSource()">保存</button>-->
                <button type="button" class="btn btn-default" @click="pageChange(2)" v-show="true">下一步</button>
            </div>
        </div>

        <!--字段条件设置(高级设置)-->
        <div class="pageItem" v-if="curPageIndex==2">
            <div class="notitle_content">
                <FieldCond @change="fieldCondChange" />
            </div>
            <!--操作按钮-->
            <div class="option_bar">
                <button type="button" class="btn btn-default" @click="pageChange(3)" v-show="!blnSave">下一步</button>
                <button type="button" class="btn btn-default" @click="saveSourceAndParam()" v-show="blnSave">保存</button>
                <button type="button" class="btn btn-default" @click="fieldCancel();pageChange(1);">取消</button>
            </div>
        </div>

        <!--条件分组(高级设置)-->
        <div class="pageItem" v-if="curPageIndex==3">
            <div class="notitle_content">
                <CondGround />
            </div>
             <!--操作按钮-->
            <div class="option_bar">
                <button type="button" class="btn btn-default" @click="pageChange(2)">上一步</button>
                <button type="button" class="btn btn-default" @click="fieldCancel();pageChange(1);">取消</button>
                <button type="button" class="btn btn-default" @click="saveSource()">保存</button>
            </div>
        </div>
    </div>
</template>

<script>
import Scroll from 'components/scroll'
import {mapState,mapMutations} from 'vuex'
import {BODY_RESIZE,SetUploadSourcePageData,ClearUploadSourcePageData,CreateDataParse,upload_get_fileparse,upload_del_fileparse} from '../../store/mutation-types'
import FieldMap from './fieldMap.vue'
import FieldCond from './fieldCond.vue'
import CondGround from './condGround'
import LookRule from './lookRule'
import QueryKind from '../../enum/QueryKind'

export default {
  name: 'UploadDataBase',
  props:['code'],
  components:{Scroll,FieldMap,FieldCond,CondGround},
  data () {
    return {
      curPageIndex:0,
      descW:0,
      rules:[],
      blnSave:false,
      bodyResizeSub:null,
    }
  },
  computed:mapState({
      dataSource:state=>{return state.oriSource;},
      targetTables(){
        let dataSource=this.dataSource;
        let data = tool.Clone(_.chain(dataSource).values().pluck('tables').map(d=>{
            return _.map(d,c=>c)
        }).flatten().value());

        return data;
      },
      oriSource:state=>state.uploadSource.oriSource,
      mapField:state=>state.uploadSource.mapField
  }),
  mounted(){
    //获取解析规则
    this.$store.dispatch(upload_get_fileparse,{dataSource:this.code,type:'ELASTIC_ELASTIC'}).then(res=>{
        this.rules=res.biz_body;
    });
    
    setTimeout(()=>{
        let w= $(this.$el).width();
        this.descW=w-320;
    },0);
    // this.$store.commit(BODY_RESIZE,()=>{
    //     setTimeout(()=>{
    //         let w= $(this.$el).width();
    //         this.descW=w-320;
    //     },100);
    // });

    this.$store.commit(BODY_RESIZE,{cb:(sub)=>{
       this.bodyResizeSub=sub
    },sub:()=>{
      setTimeout(()=>{
            let w= $(this.$el).width();
            this.descW=w-320;
      },100);
    }});
  },
  beforeDestroy(){
    this.bodyResizeSub.unsubscribe();
  },
  methods:{
    //清空页面数据
    clearData(){
        this.$store.commit(ClearUploadSourcePageData);
    },
    //关闭窗体
    close(){
        this.$emit('close');
    },
    //获取查询类型名字
    getQueryName(kind){
        if(!kind) return '';
        let arrKind=kind.split(',');
        return _.map(arrKind,k=>_.find(QueryKind,q=>q.value==k).name).join(',');
    },
    //根据数据源keyi获取数据源名称
    getSourceName(keyid){
       return (_.find(this.targetTables,d=>d.key==keyid) || {name:''}).name;
    },
    //字段条件改变事件
    fieldCondChange(conds){
        this.blnSave=conds.length==1;
    },
    //添加解析规则
    addSet(){
        this.pageChange(1);
    },
    pageChange(i){
        //判断操作进入限定条件配置界面时,是否选择了来源数据源与映射字段
        if(i==2 && (!this.oriSource || this.mapField.length<=0)){
            tool.info('来源数据源与映射条件必填!');
            return;
        }

        //判断进入条件组合页面时,条件是否不为空
        if(i==3 && _.find(this.$store.state.uploadSource.conds,c=>!c.field || !c.value)){
           tool.info('条件不允许为空!');
           return;
        }

        this.curPageIndex=i;
        this.$emit('pageChange',i);
    },
    //高级设置字段条件配置页面取消事件
    fieldCancel(){
        this.$store.commit(SetUploadSourcePageData,{
            conds:[],//字段条件集合
            groupConds:[],//组合条件集合
            oriConds:[],//设置后的条件数据集合
        });
    },
    //保存上传数据配置以及限定条件
    saveSourceAndParam(){
        let conds=this.$store.state.uploadSource.conds;
        let filter={
            term:conds[0].condLetter,
            field:{table:conds[0].field.tableKey,key:conds[0].field.key},
            value:conds[0].value
        }

        this.$store.commit(SetUploadSourcePageData,{
            filter:filter
        });
        this.saveSource();
    },
    //保存上传数据配置
    saveSource(){
        this.$store.dispatch(CreateDataParse).then(res=>{
            if(!tool.msg(res,'保存成功!','保存失败!')) return;
            this.rules.push(res.biz_body);

            this.clearData();
            this.pageChange(0);
        });
    },
    //删除规则
    removeRule(d,i){
        tool.confirm('您确定要删除该项解析规则？',['确定','取消'],()=>{
            this.$store.dispatch(upload_del_fileparse,d.id).then(res=>{
                if(!tool.msg(res,'','删除失败!'))return;
                this.rules.splice(i,1);
            });
        },function(){});
    },
    //查看规则
    lookRule(d){
        let s=this;
        tool.open(function(){
            let html=`<LookRule :data="data" />`;
            let params={
                title:'请选择上传方式',//'上传数据源 - 选择解析规则',
                area:['600px;','400px'], //['600px', '600px'],
                components:{LookRule},
                content:`<div class="Look_Rule_pop" style="width:100%;height:100%;">${html}</div>`,
                store:s.$store,
                context:{
                    data:d
                }
            };

            return params
        }());
    }
  }
}
</script>

<style scoped lang="less">
    @import "../../css/variables.less";
    .UploadDataBase{width:100%;height:100%;}
    .UploadDataBase .pageItem{width:100%;height:100%;}

    @titleH:40px;
    @OptionBarH:40px;
    .UploadDataBase .title{font-size:12px;text-align:right;width:100%;
    height:@titleH;line-height:@titleH;padding:0px 10px;.border('bottom');font-style: italic;}
    .UploadDataBase .item{padding:5px;}
    .UploadDataBase .item:hover{.border('',@Font_Hover_Col);border-radius:5px;cursor:pointer;}

    html{.TCol(~".UploadDataBase .item:hover",'bc');}
    html{.TCol(~".UploadDataBase .item:hover");}

    .UploadDataBase .option_bar{text-align:right;padding-right:15px;line-height: @OptionBarH;}
    .UploadDataBase .content{height:~'calc(100% - @{titleH} - @{OptionBarH} - 1px)';.border('bottom');}
    .UploadDataBase .notitle_content{height:~'calc(100% - @{OptionBarH} - 1px)';.border('bottom');}
    
    .UploadDataBase .table_body .option:hover{cursor:pointer;}
    html{.TCol(~".UploadDataBase .table_body .option:hover");}
    .UploadDataBase .table_body .option:last-child{margin-left:15px;}

    //列表样式
    @tableRowH:40px;
    .table{margin-bottom:0px;}
    .table_header{height:@tableRowH;.border('bottom');}
    .table_header tr{height:~'calc(@{tableRowH} - 1px)';}
    .table_header th{padding-left:0px;padding-right:0px;}
    //.table_header .table_title{color:@Font_Hover_Col;}
    html{.TCol(~".table_header .table_title");}
    .table_body{height:~'calc(100% - @{tableRowH})';width:100%;}
    .table_body td{padding-left:0px;padding-right:0px;}
</style>
