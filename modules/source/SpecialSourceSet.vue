<!-- 特定数据源配置页面组件 -->
<template>
    <div class="SpecialSourceSet">
        <!--属性设置-->
        <div class="setting_container" :style="{height:optionH>0?optionH+'px':'auto'}">
          <!--标题栏-->
          <div class="title">
              <span class="name">数据源配置</span>
          </div>

          <!--内容栏-->
          <div class="content">

            <div class="form-group col-sm-2" style="width: 200px;">
                <label >查询类型</label>
                <div>
                    <el-select v-model="kind" multiple placeholder="请选择">
                        <el-option
                            v-for="item in queryKind"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>

            <div class="form-group col-sm-2" style="width: 200px;">
                <label >数据去重</label>
                <div>
                    <el-select v-model="distinct" placeholder="请选择">
                        <el-option
                            v-for="item in [{name:'是',value:1},{name:'否',value:2}]"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>

            <div class="form-group col-sm-2" style="width: 200px;">
                <label >数据源名称</label>
                <div>
                    <el-input v-model="sourceName" />
                </div>
            </div>

            <div class="form-group col-sm-2" style="width: 300px;">
                <label >数据源描述</label>
                <div>
                    <el-input v-model="sourceDesc" />
                </div>
            </div>

            <div class="clearfix"></div>
          </div>

        </div>
        <!--列展示-->
        <div class="col_container" :style="{height:optionH>0?listH+'px':'auto'}">
          <!--标题栏-->
          <div class="title">
              <span class="name">特定条件字段</span>
          </div>
          <!--列表显示区域-->
          <div style="width:100%;" :style="{height:listH>0?(listH-40)+'px':'auto'}">
            <!--表头-->
            <div class="table_header">
                <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                    <thead><tr>
                        <th @click="AllCheck()" style="cursor:pointer;width:30px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center hover table_title"><div style="width:30px;" class="divEllipsis">
                        <i class="fa" :class="{
                        'fa-square-o':!blnCheck(),
                        'fa-check-square-o':blnCheck()}">
                        </i></div>
                        </th>
                        <th style="width:150px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">名称</div></th>
                        <th style="width:150px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">表名</div></th>
                        <th style="width:150px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">字段名</div></th>
                        <th style="border-bottom:0px;border-right:1px solid #ddd;" :style="{width:descW+'px'}" class="text-center"><div :style="{width:descW+'px'}" class="divEllipsis">描述</div></th>
                        <th style="width:50px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis">索引</div></th>
                        <th style="width:50px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis">排序</div></th>
                        <th style="width:50px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis">快搜</div></th>
                        <th style="width:100px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">操作</div></th>
                        <th style="width:120px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:120px;" class="divEllipsis">预览数据</div></th>
                    </tr></thead>
                </table>
            </div>
            <!--表体-->
            <div class="table_body">
                <Scroll :listen="fields" ref="FieldScroll">
                    <table class="table" style="border-collapse: collapse;margin-top:0px;">
                        <tbody><tr v-for="f in fields">
                            <td @click="Check(f)" style="cursor:pointer;width:30px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center hover table_title"><div style="width:30px;" class="divEllipsis">
                            <i class="fa" :class="{
                            'fa-square-o':!blnCheck(f.key),
                            'fa-check-square-o':blnCheck(f.key)}">
                            </i></div>
                            </td>
                            <td style="width:150px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{f.name}}</div></td>
                            <td style="width:150px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{f.tableName}}</div></td>
                            <td style="width:150px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{f.key}}</div></td>
                            <td style="border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" :style="{width:descW+'px'}" class="text-center"><div :style="{width:descW+'px'}" class="divEllipsis">{{f.desc}}</div></th>
                            <td style="width:50px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis"><i class="fa" :class="{'fa-check':f.isIndex,'fa-remove':!f.isIndex}"></i></div></td>
                            <td style="width:50px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis"><i class="fa" :class="{'fa-check':f.isOrder,'fa-remove':!f.isOrder}"></i></div></td>
                            <td style="width:50px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis"><i class="fa" :class="{'fa-check':f.isQuickSearch,'fa-remove':!f.isQuickSearch}"></i></div></td>
                            <td style="width:100px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">
                                <el-tooltip style="margin-right:5px;" effect="light" v-for="a in f.action_option" :content="a.name" placement="top">
                                    <i :class="a.icon"></i>
                                </el-tooltip>
                            </div></td>
                            <td style="width:120px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:120px;" class="divEllipsis">{{f.previewVal}}</div></td>
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
import {BODY_RESIZE,ClearSepSource,SetSepSourcePageData,SetSepSourcePageGo} from '../../store/mutation-types'
import Scroll from 'components/scroll'
export default {
  name: 'SpecialSourceSet',
  components:{Scroll},
  data () {
    return {
      kind:[],
      distinct:2,//数据去重
      sourceName:'',//数据源名称
      sourceDesc:'',//数据源描述
      condFields:[],//用来设置条件字段
      queryKind:[{name:'回溯',value:'backtrack'},{name:'监察',value:'monitor'}],//查询类型
      optionH:0,//操作栏高度
      listH:0,//列表高度
      descW:0,//自适应列宽度
    }
  },
  computed:mapState({
    PageData:state=>{
      return state.specialSource;
    },
    config(){
      return {
        sourceName:this.sourceName,
        sourceDesc:this.sourceDesc,
        condFields:this.condFields,
        distinct:this.distinct,
        kind:this.kind,
      }
    },
    fields:state=>{
      return state.specialSource.selFields;
    },
  }),
  watch:{
    config:{
          deep:true,
          handler:function(){
            this.$store.commit(SetSepSourcePageData,this.config);
          }
    },
    kind(){
        this.$store.commit(SetSepSourcePageGo,{page:'SpecialSourceSet',name:'kind',flag:this.kind.length>0,info:'请选择查询模式!'})
    },
    sourceName(){
        this.$store.commit(SetSepSourcePageGo,{page:'SpecialSourceSet',name:'sourceName',flag:!!this.sourceName,info:'请设置数据源名称!'})
    }
  },
  mounted(){
    this.$store.commit(SetSepSourcePageGo,{page:'SpecialSourceSet',name:'kind',flag:this.kind.length>0,info:'请选择查询模式!'});
    this.$store.commit(SetSepSourcePageGo,{page:'SpecialSourceSet',name:'sourceName',flag:!!this.sourceName,info:'请设置数据源名称!'});

    this.optionH=$(this.$el).find('.setting_container').height();
    this.listH=$(this.$el).height()-this.optionH;

    setTimeout(()=>{
        let w= $(this.$el).width();
        this.descW=w-870;
    },0);

    this.$store.commit(BODY_RESIZE,()=>{
      this.optionH=0;
      this.$nextTick(()=>{
        this.optionH=$(this.$el).find('.setting_container').height();
        this.listH=$(this.$el).height()-this.optionH;
      });

      setTimeout(()=>{
          let w= $(this.$el).width();
          this.descW=w-870;
      },0);
    });

    this.$nextTick(()=>{
      this.recoverData();
    });
  },
  methods:{
    clearData(){
        this.$store.commit(ClearSepSource);
    },
    //恢复页面之前操作的值
    recoverData(){
        let {sourceName,sourceDesc,condFields,distinct,kind} =this.PageData;
        this.sourceName=sourceName;
        this.sourceDesc=sourceDesc;
        this.condFields=condFields;
        this.distinct=distinct;
        this.kind=kind;
    },
    //全选
    AllCheck(){
        if(this.condFields.length===this.fields.length){
            //取消全选
            this.condFields=[];
        }else{
            //全选
            this.condFields=tool.Clone(this.fields);
        }
    },
    //单选
    Check(f){
        let fIndex=this.condFields.map(f=>f.key).indexOf(f.key);
        if(fIndex>=0){
            //取消单选
            this.condFields.splice(fIndex,1);
        }else{
            //单选
            this.condFields.push(f);
        }
    },
    //判断是否选中某列(或是否全选)
    blnCheck(key){
        if(key){
          return this.condFields.map(f=>f.key).indexOf(key)>=0;
        }else{
          //判断全选
          return  _.difference(this.fields.map(f=>f.key),this.condFields.map(f=>f.key)).length<=0 && this.condFields.length>0;
        }
    },
  }
}
</script>

<style scoped lang="less">
@import "../../css/variables.less";
.SpecialSourceSet{width:100%;height:100%;overflow:hidden;}

@setting_containerH:150px;
.setting_container{width:100%;.border('bottom');}
.col_container{height:~'calc(100% - @{setting_containerH})';width:100%;}

@titleH:40px;
.col_container .title,
.setting_container .title{text-align:left;width:100%;height:@titleH;line-height:@titleH;padding:0px 10px;.border('bottom');font-weight:600;font-style: italic;}


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
