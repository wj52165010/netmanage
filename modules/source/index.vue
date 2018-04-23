<!-- 数据源配置界面 -->
<template>
    <div class="SourceSet">
        <!--数据源信息显示-->
        <div class="source">
            <!--标题栏-->
            <div class="title">
                <span class="name">数据源</span>
                 <div style="float:right;">
                    <button type="button" 
                        class="btn btn-primary btn-sm" 
                        style="padding:5px 20px" 
                        @click="AddTable()">
                        新建表
                    </button>
                </div>
            </div>
            <!--左边数据源列-->
            <div class="LeftCol">
                <Scroll :listen="sourceKinds">
                    <div style="overflow:hidden;" v-for="(s,i) in sourceKinds">
                        <div class="item" :class="{active:curSourceIndex==i}" @click="curSourceIndex=i">
                            <div class="icon">
                                <i class="fa fa fa-database"></i>
                            </div>
                            {{s.name}}
                        </div>
                    </div>
                </Scroll>
            </div>
            <!--右边具体数据项-->
            <div class="RightInfo">
                <Scroll :listen="tables">
                    <div class="source_item" :class="{empty:getOptions(s).length<=0}" v-for="s in tables" @click="curSelTable=s;selFields=[];IconClick({id:'look'},s);">
                        <div class="name">{{s.name}}</div>
                        <div class="desc">{{s.desc}}</div>
                        <div class="option">
                            <div class="item" @click.stop="IconClick(o,s)" v-for="o in getOptions(s)" >
                                <el-tooltip  effect="light" :style="{width:'100%',color:o.disabled?'gray':'black'}" :content="o.info || o.name" placement="top">
                                    <i :class="o.icon"></i>
                                </el-tooltip>
                            </div>
                        </div>
                        <!--标识数据源是否被选中-->
                        <div class="iden_container" v-show="sourceKinds[curSourceIndex] && sourceKinds[curSourceIndex].id!=='SpecialSource' && curSelTable && curSelTable.key==s.key">
                            <i class="fa fa-check iden" />
                        </div>
                    </div>
                    <div  style="height:10px;float:left;width:100%;"></div>
                    <div class="clearfix"></div>
                </Scroll>
            </div>
        </div>
        <!--字段信息显示-->
        <div class="field">
            <!--标题栏-->
            <div class="title">
                <span class="name">数据源字段</span>
                <span v-if="curSelTable" style="font-size:12px;">({{curSelTable && curSelTable.name}})</span>
            </div>
            <!--内容展示区域-->
            <div class="content">
                <!--表头-->
                <div class="table_header">
                    <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                        <thead><tr>
                           <!-- <th @click="AllCheck()" style="cursor:pointer;width:30px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center hover table_title"><div style="width:30px;" class="divEllipsis">
                            <i class="fa" :class="{
                            'fa-square-o':!blnCheck(),
                            'fa-check-square-o':blnCheck()}" :style="{color:blnAllowCheck?'':'gray'}">
                            </i></div>
                            </th> -->
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
                                <!--<td @click="Check(f)" style="cursor:pointer;width:30px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center hover table_title"><div style="width:30px;" class="divEllipsis">
                                <i class="fa" :class="{
                                'fa-square-o':!blnCheck(f.key),
                                'fa-check-square-o':blnCheck(f.key)}" :style="{color:blnAllowCheck?'':'gray'}">
                                </i></div>
                                </td>-->
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
import {BODY_RESIZE,SetSepSourcePageData,ClearUploadSourcePageData,ClearSepSource,DelDataSource,ClearDataSource,SetSource,PreviewSearch} from '../../store/mutation-types'
import ParsingRulesColSet from './ParsingRulesColSet'

import UploadSource from './uploadSource.vue'
import UploadData from './uploadData.vue'

let btns=[
            {id:'look',name:'查看',icon:'fa fa-eye'},
            {id:'clear',name:'清空',icon:'fa fa-trash-o fa-lg'},
            {id:'remove',name:'删除',icon:'fa fa-remove'},
            {id:'upload',name:'上传',icon:'fa fa-cloud-upload'}
        ];
export default {
  name: 'SourceSet',
  components:{Scroll},
  data () {
    return {
      sourceKinds:[{id:'CustomSource',name:'自建数据源',key:'自建数据源'},{id:'InnerSource',name:'内建数据源',key:'内建数据源'}],//{id:'SpecialSource',name:'特定数据源',key:'特定数据源'}
      fields:[],
      selFields:[],//当前选中的列集合数据
      curSourceIndex:-1,
      curSelTable:null,//当前选中的表
      descW:0,
      options:[],
      uploadFields:[],//当前上传操作的字段集合
      preViewdata:{},//预览数据
    }
  },
  computed:mapState({
      dataSouce:state=>{return state.oriSource;},
      tables(){
          if(this.curSourceIndex==-1)return {};
          if(!this.dataSouce[this.sourceKinds[this.curSourceIndex].key]) return {};
         
          return this.dataSouce[this.sourceKinds[this.curSourceIndex].key].tables;
      },
      //是否允许勾选列(当查看的表与选中的表不一致的情况下,不允许勾选列数据)
      blnAllowCheck(){
        if(this.fields.length<=0) return false;
        if(!this.curSelTable) return false;
        if(this.curSelTable && this.curSelTable.key!=this.fields[0].tableKey) return false;
        
        return true;
      },
      PageData:state=>{
          return state.specialSource;
      },
  }),
  watch:{
    curSourceIndex(){
        let source=this.sourceKinds[this.curSourceIndex] || {id:''}

        if(source.id=='CustomSource'){
            this.options=_.filter(btns,b=>b.id!='look');;
        }

        if(source.id=='InnerSource'){
            this.options=[];
        }

        if(source.id=='SpecialSource'){
            this.options=_.filter(btns,b=>b.id=='look' || b.id=='remove');
        }
        this.$emit('SendEvent',{name:'ShowBtn',page:'SourceSet',param:{blnShowBtn:source.id=='CustomSource' || source.id=='InnerSource'}});
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
    }
  },
  mounted(){
    this.options=btns;
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
    });

  },
  methods:{
      //保存页面数据
      SavePageData(){
          this.$store.commit(SetSepSourcePageData,{
              fields:this.fields,
              selFields:this.selFields,
              curSourceIndex:this.curSourceIndex,
              curSelTable:this.curSelTable
          });
      },
      //清空页面数据
      clearData(){
         this.$store.commit(ClearSepSource);
      },
      //恢复页面之前操作的值
      recoverData(){
        let {fields,selFields,curSourceIndex,curSelTable} =this.PageData;
        this.fields=fields;
        this.selFields=selFields;
        this.curSourceIndex=curSourceIndex;
        this.curSelTable=curSelTable;
      },
      getOptions(t){
        let option=tool.Clone(this.options);
        let removeO = _.find(option,o=>o.id=='remove');
        if(!t.isDel && removeO){
            
            removeO.disabled=true;
            removeO.info='该数据源关联了菜单或解析规则,不能被删除!';
            //option=_.filter(option,o=>o.id!='remove');
        }

        return option;
      },
      //全选
      AllCheck(){
          if(!this.blnAllowCheck) return;
          if(this.selFields.length===this.fields.length){
              //取消全选
              this.selFields=[];
          }else{
              //全选
              this.selFields=tool.Clone(this.fields);
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
              this.selFields.push(f);
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
      //新建表
      AddTable(){
        this.$emit('SendEvent',{name:'AddSource',page:'SourceSet',param:{}});
      },
      //图标项单击事件
      IconClick(icon,d){
        let s=this;
        switch(icon.id){
            case 'look'://查看
                s.curSelTable=d;
                s.selFields=[];
                //表索引字段
                let indexs=_.chain(d.indexFields || {requisite:[],notRequisite:[]}).values().flatten().value().join(',');
                //表字段相关操作(增删改查)
                let action =d.action || {};

                let fields=_.map(tool.Clone(d.fields),f=>{
                    f.tableKey=d.key;
                    f.tableName=d.name;
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
                break;
            case 'clear'://清空
                tool.confirm('您确定要清空该数据源下的数据吗？',['确定','取消'],()=>{
                    let msgIndex=tool.iconMsg('清除中,请耐心等待...');
                    this.$store.dispatch(ClearDataSource,d.key).then(res=>{
                        tool.closeMsg(msgIndex);
                        if(!tool.msg(res,'清除成功!','清除失败!'))return;
                    });
                },function(){});
                break;
            case 'remove'://删除
                if(icon.disabled){return;}
                tool.confirm('您确定要删除该数据源吗？',['确定','取消'],()=>{
                    let msgIndex=tool.iconMsg('删除中,请耐心等待...');
                    this.$store.dispatch(DelDataSource,d.key).then(res=>{
                        tool.closeMsg(msgIndex);
                        if(!tool.msg(res,'删除成功!','删除失败!'))return;
                        let dataSource=tool.Clone(s.dataSouce);
                        for(let key in dataSource){
                            let tables=dataSource[key].tables;
                            for(let name in tables){
                                if(name!=d.key)continue;
                                delete tables[name];
                            }
                        }
                        this.$store.commit(SetSource,dataSource);

                    });
                },function(){});
                break;
            case 'upload'://上传
                tool.open(function(){
                    //let html=`<UploadData :store=store :fields="fields" v-on:close="cancel_btn" v-on:pageChange="pageChange" />`;
                    let html=`<UploadSource :fields="fields" :code="code" v-on:close="cancel_btn" v-on:changesize="change_size" v-on:pageChange="pageChange" />`;

                    let layerIndex=-1;
                    let param={
                        title:'请选择上传方式',//'上传数据源 - 选择解析规则',
                        area:['400px;','300px'], //['600px', '600px'],
                        components:{UploadData,UploadSource},
                        content:`<div class="source_upload_pop" style="width:100%;height:100%;">${html}</div>`,
                        store:s.$store,
                        context:{
                            code:d.key,
                            fields:tool.Clone(_.map(d.fields,f=>{
                                f.source_column='';
                                f.dest_column='';
                                f.def_val='';
                                f.format='';
                                f.params=[];
                                f.ignore=0;
                                f.firstParam='';
                                f.senondParam='';
                                f.type=f.type || 'text';

                                return f;
                            })),
                            submit_btn(){
                               //layer.title('',index);
                            },
                            cancel_btn(){
                                param.close();
                            },
                            pageChange(tag,index){
                                if(tag=='file'){
                                    let titles=['上传数据源 - 选择解析规则','上传数据源 - 新增解析规则','上传数据源 - 上传文件'];
                                    layer.title(titles[index],layerIndex);
                                }

                                if(tag=='source'){
                                    let titles=['请选择解析规则','配置映射','编辑限定条件','配置条件关系'];
                                    layer.title(titles[index],layerIndex);
                                }
                            },
                            change_size(tag){
                                if(tag=='file'){
                                    layer.size(layerIndex, {
                                        width: 700,
                                        height:600,
                                    }); 
                                }
                                if(tag=='source'){
                                    layer.size(layerIndex, {
                                        width: 800,
                                        height:410,
                                    }); 
                                }
                            }
                        },
                        success(layero, index){
                            layerIndex=index;
                        },
                        sizeChange(){
                            
                        },
                        pop_close(){
                            s.$store.commit(ClearUploadSourcePageData);
                        }
                    };

                    return param;
                }());
                break;

        }
      }
  }
}
</script>
<style scoped lang="less">
    @import "../../css/variables.less";
    .SourceSet{width:100%;height:100%;}
    .SourceSet .source{width:100%;height:60%;.border('bottom');}
    .SourceSet .field{width:100%;height:40%;}

    @titleH:40px;
    .SourceSet .title{text-align:left;width:100%;height:@titleH;line-height:@titleH;padding:0px 10px;.border('top');.border('bottom');font-weight:600;font-style: italic;}

    @ColW:200px;
    @ColItemH:80px;
    .SourceSet .source .LeftCol{width:@ColW;height:~'calc(100% - @{titleH})';.border('right');float:left;}
    .SourceSet .source .LeftCol .item{
        height:@ColItemH;.border('');margin-left:30px;margin-right:30px;margin-top:10px; margin-bottom:10px;
        border-radius:5px;position:relative;
        line-height:@ColItemH;text-align:center;
        font-style:italic;
    }

    .SourceSet .source .LeftCol .item.active,
    .SourceSet .source .LeftCol .item:hover{cursor:pointer;.border('',@Font_Hover_Col);}
    .SourceSet .source .LeftCol .item.active i,
    .SourceSet .source .LeftCol .item:hover i{color:@Font_Hover_Col;}
    .SourceSet .source .LeftCol .item .icon{position:absolute;left:-16px;top:18px;color:@FontCol;z-index:100;line-height:0px;background-color:white;}
    .SourceSet .source .LeftCol .item .icon i{font-size:40px;}
    
    .SourceSet .source .RightInfo{margin-left:@ColW;margin-right:0px;height:~'calc(100% - @{titleH})';padding-top:10px;}

    .SourceSet .field .content{width:100%;height:~'calc(100% - @{titleH})';}

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

  .source_item:hover{background-color:@Font_Hover_Col;color:white;}
  .source_item:hover .desc{color:white;}
  .source_item:hover .option{background-color:@HeaderBgCol;}
  .source_item:hover .option .item i{color:white;}
  .source_item:hover .option .item:hover i{color:@Font_Hover_Col;}

  .source_item .iden_container{
        position: absolute;
        top: 0px;
        right: 0px;
        width: 30px;
        height: 30px;
        background-image:linear-gradient(45deg,transparent 50%,@Font_Hover_Col 50%),
                         linear-gradient(45deg,transparent 49%,@Font_Hover_Col 10%) ;
   }
  .source_item .iden{position:absolute;right: 3px; top: 2px;color: white;}

//列表样式
@tableRowH:40px;
.table{margin-bottom:0px;}
.table_header{height:@tableRowH;.border('bottom');}
.table_header tr{height:~'calc(@{tableRowH} - 1px)';}
.table_header th{padding-left:0px;padding-right:0px;}
.table_header{background-color:@Font_Hover_Col;color:white;}
.table_body{height:~'calc(100% - @{tableRowH})';width:100%;}
.table_body td{padding-left:0px;padding-right:0px;}
</style>
