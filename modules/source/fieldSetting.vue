<!-- 字段配置组件 -->
<template>
    <div class="FieldSetting">
        <!--标题栏-->
        <div class="title">
            <span class="name">配置字段</span>

            <!--操作栏-->
            <div class="option_bar">
              <span class="item" @click="lookSimple()"><i class="fa fa-eye"></i>查看示例</span>
              <span class="item" @click="addCol()"><i class="fa fa-plus" style="margin-right:5px;"></i>添加字段</span>
            </div>
        </div>
        <!--内容栏-->
        <div class="content">
          <!--表头-->
            <div class="table_header">
                <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                    <thead><tr>
                        <th style="width:150px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">默认类型(可为空)</div></th>
                        <th style="width:150px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">字段名称</div></th>
                        <th style="width:150px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">字段标题</div></th>
                        <th style="width:200px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:200px;" class="divEllipsis">字段描述</div></th>
                        <th style="width:120px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:120px;" class="divEllipsis">数据类型</div></th>
                        <th style="width:50px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis">索引</div></th>
                        <th style="width:50px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis">排序</div></th>
                        <th style="width:50px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis">快搜</div></th>
                        <th style="border-bottom:0px;border-right:1px solid #ddd;" :style="{width:descW+'px'}" class="text-center"><div :style="{width:descW+'px'}" class="divEllipsis">预览数据</div></th>
                        <th style="width:100px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">操作</div></th>
                    </tr></thead>
                </table>
            </div>
          <!--表体-->
          <div class="table_body">
            <Scroll :listen="cols">
              <table class="table" style="border-collapse: collapse;margin-top:0px;">
                <tbody>
                  <tr v-for="(c,i) in cols">
                    <td style="width:150px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;vertical-align: middle;" class="text-center"><div style="width:150px;" class="divEllipsis">
                      <el-select
                        v-model="c.dsFieldType"
                        :ccontext="c" 
                        filterable
                        default-first-option
                        clearable
                        @change="fieldKindChange"
                        placeholder="请输入关键词">
                        <el-option
                          v-for="item in fieldKinds"
                          :key="item.code"
                          :label="item.title"
                          :value="item.code">
                        </el-option>
                      </el-select>
                    </div></td>
                    <td style="width:150px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;vertical-align: middle;" class="text-center"><div style="width:150px;" class="">
                      <ToggleInput ref="fieldKey" :value="c.key" @change="keyChange" :validFunc="keyUniq" :extra="c" reg="[a-zA-Z_]" placeholder="请输入(不支持中文)" tip="不能包含中文和特殊字符" :require="true" />
                    </div></td>
                    <td style="width:150px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;vertical-align: middle;" class="text-center"><div style="width:150px;" class="">
                      <ToggleInput ref="fieldName" :value="c.name" @change="nameChange" :validFunc="nameUniq" :extra="c" placeholder="请输入" :require="true" />
                    </div></td>
                    <td :title="c.desc" style="width:200px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;vertical-align: middle;" class="text-center"><div style="width:200px;" class="">
                      <ToggleInput :value="c.desc" @change="descChange"  :extra="c" placeholder="请输入" />
                    </div></td>
                    <td style="width:120px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;vertical-align: middle;" class="text-center"><div style="width:120px;" class="divEllipsis">
                      
                      <el-select v-model="c.type"  :ccontext="c"  @change="dataKindChange" placeholder="请选择">
                        <el-option
                          v-for="item in dataKinds"
                          :key="item.val"
                          :label="item.name"
                          :value="item.val">
                        </el-option>
                      </el-select> 
                    </div></td>
                    <td style="width:50px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;vertical-align: middle;" class="text-center"><div style="width:50px;" class="divEllipsis">
                      <el-switch
                        v-model="c.isIndex"
                        :width="40"
                        >
                      </el-switch>
                    </div></td>
                    <td style="width:50px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;vertical-align: middle;" class="text-center"><div style="width:50px;" class="divEllipsis">
                      <el-switch
                        v-model="c.isOrder"
                        :width="40"
                        >
                      </el-switch>
                    </div></td>
                    <td style="width:50px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;vertical-align: middle;" class="text-center"><div style="width:50px;" class="divEllipsis">
                      <el-switch
                        v-model="c.isQuickSearch"
                        :width="40"
                        >
                      </el-switch>
                    </div></td>
                    <td style="border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;vertical-align: middle;" :style="{width:descW+'px'}" class="text-center"><div :style="{width:descW+'px'}" class="divEllipsis">
                      {{c.previewVal}}
                    </div></td>
                    <td style="width:100px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;vertical-align: middle;" class="text-center"><div style="width:100px;" class="divEllipsis">
                     <el-tooltip class="btn_item" effect="light" content="删除" placement="top">
                      <i class="fa fa-remove" @click="removeCol(i)"></i>
                     </el-tooltip>
                    </div></td>
                  </tr>
                </tbod>
              </table>
            </Scroll>
          </div>
        </div>
    </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import Scroll from 'components/scroll'
import ToggleInput from 'components/toggleInput'
import {BODY_RESIZE,FieldType,SetAddSourcePageGo,ClearAddSourcePageData} from '../../store/mutation-types'
import FieldKind from './emnu/fieldKind'
export default {
  name: 'FieldSetting',
  components:{Scroll,ToggleInput},
  data () {
    return {
      descW:0,
      data:[],
      fieldKind:'',//字段类型
      dataKind:'',//数据类型
      dataKinds:FieldKind,
    }
  },
  watch:{
    cols:{
      deep:true,
      handler:function(){
        this.$nextTick(()=>{
          this.Valid();
          if(this.cols.length<=0){
            this.$store.commit(SetAddSourcePageGo,{name:'FieldSetting',flag:false,info:'请添加列数据!'});
          }
        });
      }
    }
  },
  computed:mapState({
    cols:state=>{
      return state.addSource.cols;
    },
    fieldKinds:state=>state.fieldKinds
  }),
  mounted(){
    setTimeout(()=>{
        let w= $(this.$el).width();
        this.descW=w-1040;
    },0);

    this.Valid();
    this.$store.commit(BODY_RESIZE,()=>{
        setTimeout(()=>{
            let w= $(this.$el).width();
            this.descW=w-1040;
        },100);
    });

    if(this.cols.length<=0){
      this.$store.commit(SetAddSourcePageGo,{name:'FieldSetting',flag:false,info:'请添加列数据!'});
    }
  },
  methods:{
    //清空页面数据
    clearData(){
        this.$store.commit(ClearAddSourcePageData);
    },
    //验证字段标题不能相同
    nameUniq(val){
      return {flag:_.filter(this.cols,c=>c.name==val).length<=1,info:'字段标题必须唯一'};
    },
    //验证字段Key不能相同
    keyUniq(val){
      return {flag:_.filter(this.cols,c=>c.key==val).length<=1,info:'字段关键字必须唯一'};
    },
    fieldKindChange(v,d){

      if(!d || !v){
        if(!d) return; 
        // d.name='';
        // d.desc='';
        // d.isOrder=false;
        // d.isQuickSearch=false;
        // d.type='string';
        return;
      }
      
      let fkind=_.find(this.fieldKinds,f=>f.code==v);
      
      d.type=fkind.data_type.toLowerCase() || 'string';
      
      //if(fkind.code==d.dsFieldType && d.name) return;
      d.key=v;
      d.name=fkind.title;
      
      d.desc=fkind.note;
      d.isOrder=fkind.is_sort=='1';
      d.isQuickSearch=fkind.is_all_search=='1';
      

    },
    //检查页面是否有错误操作
    Valid(){
      let validRes={flag:true};
      //检查字段数据库列名是否设置正确
      if(this.$refs.fieldKey){
        for(let i=0;i<this.$refs.fieldKey.length;i++){
          let firstValid=this.$refs.fieldKey[i].ValidAndShow();
          if(!firstValid.flag) validRes = firstValid;
          
          let secondValid=this.$refs.fieldName[i].ValidAndShow();
          if(!secondValid.flag) validRes = secondValid;
          //if(!validRes.flag){break;}
        }
      }

      //检查字段标题是否设置正确
      // if(validRes.flag){
      //   if(this.$refs.fieldName){
      //     for(let i=0;i<this.$refs.fieldName.length;i++){
      //       validRes = this.$refs.fieldName[i].ValidAndShow();
      //       if(!validRes.flag){break;}
      //     }
      //   }
      // }

      this.$store.commit(SetAddSourcePageGo,{name:'FieldSetting',flag:validRes.flag,info:validRes.info});

    },
    //删除指定列数据
    removeCol(i){
      tool.confirm('您确认需要删除吗？',['确定','取消'],()=>{
        this.cols.splice(i,1);

      },function(){});
    },
    //新增列
    addCol(){
      this.cols.push({
        source_column:'',
        dest_column:'',
        def_val:'',
        format:'',
        params:[],
        ignore:0,
        firstParam:'',
        senondParam:'',
        type:'string',
        dsFieldType:'',
        name:'',
        key:'',
        desc:'',
        isIndex: false,
        isOrder: false,
        isQuickSearch: false,
        previewVal:''
      });

    },
    keyChange(val,d){ d.key=val;},
    nameChange(val,d){ d.name=val;},
    descChange(val,d){d.desc=val;},
    //数据类型选择改变事件
    dataKindChange(val,d){
      if(!d) return;
      //判断当前数据类型是否与字段类型中所设置的类型匹配，不匹配则设置为空
      let fkind = _.find(this.fieldKinds,f=>f.code==d.dsFieldType) || {data_type:''};

      if(fkind.data_type.toLowerCase()!=val){
        d.dsFieldType='';
      }
    },
    //查看示例
    lookSimple(){
      tool.open(function(){
         let html=`
          <div class="table_header" style="height:auto;">
                <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                    <thead><tr>
                        <th style="width:100px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">默认类型</div></th>
                        <th style="width:100px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">字段名称</div></th>
                        <th style="width:100px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">字段标题</div></th>
                        <th style="width:100px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">字段描述</div></th>
                        <th style="width:100px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">数据类型</div></th>
                        <th style="width:50px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis">索引</div></th>
                        <th style="width:50px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis">排序</div></th>
                        <th style="width:50px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis">快搜</div></th>
                    </tr></thead>
                </table>
            </div>
            <div class="table_body">
                <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                    <tbody><tr v-for="d in data">
                        <td style="width:100px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">{{d.type}}</div></td>
                        <td style="width:100px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">{{d.name}}</div></td>
                        <td style="width:100px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">{{d.title}}</div></td>
                        <td style="width:100px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">{{d.desc}}</div></td>
                        <td style="width:100px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">{{d.dataType}}</div></td>
                        <td style="width:50px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis">
                          <el-switch v-model="d.index" :width="40" disabled :class="{switchActive:d.index}"></el-switch></div>
                        </td>
                        <td style="width:50px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis">
                          <el-switch v-model="d.order" :width="40" :disabled="true" :class="{switchActive:d.order}"></el-switch></div>
                        </td>
                        <td style="width:50px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis">
                          <el-switch v-model="d.search" :width="40" :disabled="true" :class="{switchActive:d.search}"></el-switch></div>
                        </td>
                    </tr></tbody>
                </table>
            </div>
            <div style="padding:5px 10px;text-align:right;">
                <button type="button" class="btn btn-default" @click="cancel()">关闭</button>
            </div>
         `;
        let param={
            title:'查看示例',
            area:'800px',
            content:`<div class="openSimple" style="width:100%;height:100%;overflow-y:auto;">${html}</div>`,
            context:{
              data:[
                {type:'场所编码',name:'netbar_code',title:'场所编码',desc:'场所编码',dataType:'整型',index:true,order:true,search:true},
                {type:'证件类型',name:'cerfile_type',title:'证件类型',desc:'证件类型',dataType:'字符串',index:false,order:false,search:false},
                {type:'无',name:'cerfile_name',title:'证件姓名',desc:'',dataType:'字符串',index:true,order:true,search:true},
                {type:'无',name:'bank_code',title:'银行卡号',desc:'',dataType:'整型',index:true,order:false,search:true}
              ],
              cancel(){param.close()}
            }
        };
        
        return param;
      }());
    }
  }
}
</script>
<style lang="less">
 .openSimple .el-switch__core{background-color:#C0CCDA !important;}
 .openSimple .switchActive .el-switch__core{background-color:#409EFF !important;}
</style>

<style scoped lang="less">
@import "../../css/variables.less";
.FieldSetting{width:100%;height:100%;}

@titleH:40px;
.FieldSetting .title{text-align:left;width:100%;height:@titleH;line-height:@titleH;padding:0px 10px;.border('bottom');font-weight:600;font-style: italic;}

.FieldSetting .content{width:100%;height:~'calc(100% - @{titleH})';}

.btn_item i{cursor:pointer;}

.FieldSetting .option_bar{float:right;height:100%;font-weight:600;font-style:italic;}
.FieldSetting .option_bar .item{cursor:pointer;margin-left:10px;}
.FieldSetting .option_bar .item:hover{color:@Font_Hover_Col;}

//列表样式
@tableRowH:40px;
.table{margin-bottom:0px;}
.table_header{height:@tableRowH;.border('bottom');}
.table_header tr{height:~'calc(@{tableRowH} - 1px)';}
.table_header th{padding-left:0px;padding-right:0px;}
.table_header .table_title{color:@Font_Hover_Col;}
.table_body{height:~'calc(100% - @{tableRowH})';width:100%;}
.table_body td{padding-left:0px;padding-right:0px;}
</style>
