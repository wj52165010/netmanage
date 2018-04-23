<!-- 字段映射组件 -->
<template>
    <div class="FieldMap">
        <!--数据源选择-->
        <div class="source_container">
            <!--目标数据源-->
            <div class="source_item" style="text-align:left;">
                <span style="float:left;margin:0px 5px;">类型:</span>
                <div style="float:left;width:140px;margin-top: 8px;margin-right: 5px;">
                    <el-select v-model="query_kind" multiple placeholder="请选择">
                        <el-option
                            v-for="item in queryKind"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <span class="title">目标数据源:</span>
                <div v-if="model" class="option divEllipsis" style="width: 120px;text-align:left;height:32px;">{{sourceName}}</div>
                <div class="option" v-if="!model">
                    <el-select  
                        v-model="targetSource"
                        placeholder="请选择">
                        <el-option
                            v-for="item in targetTables"
                            :label="item.name"
                            :value="item.key">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <!--来源数据源-->
            <div class="source_item">
                <span class="title">来源数据源:</span>
                <div class="option">
                    <el-select  
                        v-model="oriSource"
                        placeholder="请选择(必选)">
                        <el-option
                            v-for="item in oriTables"
                            :label="item.name"
                            :value="item.key">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </div>

        <!--映射字段列表-->
        <div class="mapFields_list">
            <!--列表头-->
            <div class="header">
                <!--目标数据源-->
                <div class="target">
                    <div class="title">目标数据源</div>
                    <div class="col">
                        <div class="col_item">字段标题</div>
                        <div class="col_item">预览数据</div>
                    </div>
                </div>
                <!--映射-->
                <div class="map">映射</div>
                <!--来源数据源-->
                <div class="ori">
                    <div class="title">来源数据源</div>
                    <div class="col">
                        <div class="col_item">字段标题</div>
                        <div class="col_item">预览数据</div>
                    </div>
                </div>
            </div>
            <!--列表体-->
            <div class="body">
                <Scroll :listen="fields">
                    <div class="body_item" v-for="f in fields">
                        <!--目标数据源-->
                        <div class="target">
                            <div class="col">
                                <div class="col_item divEllipsis" :title="f.name">{{f.name}}</div>
                                <div class="col_item divEllipsis" :title="f.previewVal">{{targetPreViewData[f.key]}}</div>
                            </div>
                        </div>
                        <!--映射-->
                        <div class="map"><i class="fa fa-exchange"></i></div>
                        <!--来源数据源-->
                        <div class="ori">
                            <div class="col">
                                <div class="col_item">
                                    <el-select
                                        v-model="f.mapField"
                                        clearable  
                                        placeholder="请选择">
                                        <el-option
                                            v-for="item in oriFields"
                                            :label="item.name"
                                            :value="item.key">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="col_item divEllipsis">{{oriPreViewData[f.mapField]}}</div>
                            </div>
                        </div>
                    </div>
                </Scroll>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import {BODY_RESIZE,SetUploadSourcePageData,ClearUploadSourcePageData,PreviewSearch} from '../../store/mutation-types'
import Scroll from 'components/scroll'
import {mapState,mapMutations} from 'vuex'
import QueryKind from '../../enum/QueryKind'
import SourceType from '../../enum/SourceType'
export default {
  name: 'FieldMap',
  props:['model','source'],
  components:{Scroll},
  data () {
    return {
       queryKind:QueryKind,
       targetSource:'',//目标数据源
       oriSource:'',//来源数据源
       fields:[],
       sourceName:'',
       query_kind:'',
       targetPreViewData:{},//目标数据源预览数据
       oriPreViewData:{},//来源数据源预览数据
    }
  },
  watch:{
    config:{
        deep:true,
        handler:function(){
            this.$store.commit(SetUploadSourcePageData,this.config);
        }
    },
    targetSource(){
        this.fields=tool.Clone(this.targetSource?
            _.map(_.find(this.targetTables,d=>d.key==this.targetSource).fields,f=>{f.mapField=''; return f;})
            :
            []);

        this.$store.dispatch(PreviewSearch,{dbkey:[this.targetSource]}).then(res=>{
            this.targetPreViewData=res.biz_body[this.targetSource][0] || {};
        });
    },
    oriSource(){
        _.each(this.fields,f=>f.mapField='');
        
        this.$store.dispatch(PreviewSearch,{dbkey:[this.oriSource]}).then(res=>{
            if(!this.oriSource){this.oriPreViewData={};return;}
            this.oriPreViewData=res.biz_body[this.oriSource][0] || {};
        });
    },
    query_kind(){
        if(this.oriSource && !_.find(this.oriTables,o=>o.key==this.oriSource)){
            this.oriSource='';
        }
    }
  },
  computed:mapState({
      PageData:state=>{
          return state.uploadSource;
      },
      config(){
          return {
            targetSource:this.targetSource,
            oriSource:this.oriSource,
            fields:this.fields,
            query_kind:this.query_kind
          };
      },
      dataSource:state=>{return state.oriSource;},
      targetTables(){
        let dataSource=this.dataSource;
        let data = tool.Clone(_.chain(dataSource).values().pluck('tables').map(d=>{
            return _.map(d,c=>c)
        }).flatten().value());

        return data;
      },
      oriTables(){
        let dataSource=this.dataSource;
        let data = tool.Clone(_.chain(dataSource).values().pluck('tables').map(d=>{
            return _.map(d,c=>c)
        }).flatten().value());

        //判断是否包含回溯信息
        let backInfo=_.find(QueryKind,q=>q.id=='回溯');
        let estype=_.find(SourceType,s=>s.id=='ELASTIC')
        if(this.query_kind.indexOf(backInfo.value)>=0){
            data=_.filter(data,d=>d.db_type==estype.val);
        }

        data=this.targetSource?_.filter(data,d=>d.key!=this.targetSource):data;

        return data;
      },
      oriFields(){
        return tool.Clone(this.oriSource?
            _.find(this.targetTables,d=>d.key==this.oriSource).fields
            :
            []);
      }
  }),
  mounted(){
    this.recoverData();
  },
  methods:{
    //清空页面数据
    clearData(){
        this.$store.commit(ClearUploadSourcePageData);
    },
    //恢复页面之前操作的值
    recoverData(){
        let s=this;
        let {targetSource,oriSource,mapField,query_kind} =this.PageData;
        this.query_kind=query_kind;
        if(this.model){
            this.targetSource=this.source;
            this.$nextTick(()=>{
                this.sourceName=(_.find(this.targetTables,d=>d.key==this.targetSource) || {name:''}).name;
            });

        }else{
            this.targetSource=targetSource;
        }
        
        this.oriSource=oriSource;

        this.$nextTick(()=>{
            for(let i=0;i<mapField.length;i++){
                let f=_.find(s.fields,f=>f.key==mapField[i].target);
                if(!f)continue;
                f.mapField=mapField[i].ori;
            }
        });
    },
    //获取映射字段对象信息
    getFieldObj(f){
      if(!f.mapField)return  {};
      return _.find(this.oriFields,d=>d.key==f.mapField) || {};
    }
  }
}
</script>

<style scoped lang="less">
  @import "../../css/variables.less";
  .FieldMap{width:100%;height:100%;}

  @sourceH:50px;
  .FieldMap .source_container{height:@sourceH;width:100%;.border('bottom');line-height:@sourceH;}
  .FieldMap .source_container .source_item{float:left;width:50%;height:100%;text-align:center;}
  .FieldMap .source_container .source_item .title{font-style:italic;}
  .FieldMap .source_container .source_item .option{display:inline-block;}

  .FieldMap .mapFields_list{width:100%;height:~'calc(100% - @{sourceH})';}

  @headerH:60px;
  .FieldMap .mapFields_list .header{width:100%;height:@headerH;.border('bottom');}
  @mapW:60px;
  .FieldMap .mapFields_list .map{height:100%;width:@mapW;float:left;.border('left');.border('right');line-height:@headerH;text-align:center;}
  .FieldMap .mapFields_list .target{height:100%;width:~'calc(50% - @{mapW}/2)';float:left;}
  .FieldMap .mapFields_list .ori{height:100%;width:~'calc(50% - @{mapW}/2)';float:left;}
  
  @titleH:25px;
  .FieldMap .mapFields_list .ori .title,
  .FieldMap .mapFields_list .target .title{height:@titleH;width:100%;text-align:center;.border('bottom');line-height:@titleH;}
  
  .FieldMap .mapFields_list .map,
  .FieldMap .mapFields_list .ori,
  .FieldMap .mapFields_list .target{font-weight:600;}

  .FieldMap .mapFields_list .col{height:~'calc(100% - @{titleH})';width:100%;}
  .FieldMap .mapFields_list .col .col_item{float:left;width:50%;height:100%;text-align:center;line-height: 34px;}

  .FieldMap .mapFields_list .body{width:100%;height:~'calc(100% - @{headerH})';}

  @bodyItemH:40px;
  .mapFields_list .body_item{width:100%;height:@bodyItemH;.border('bottom');}
  .mapFields_list .body_item .col{height:100%;}
  .mapFields_list .body_item .map,
  .mapFields_list .body_item .ori,
  .mapFields_list .body_item .target,{font-weight:400;}

  .mapFields_list .body_item .map,
  .mapFields_list .body_item .col .col_item{line-height:@bodyItemH;padding:0px 5px;}

  .mapFields_list .body_item:nth-child(odd){background-color:#f2f2f2;}

</style>
