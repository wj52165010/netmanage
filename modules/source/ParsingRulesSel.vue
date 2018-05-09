<!-- 解析规则选择组件 -->
<template>
    <div class="ParsingRulesSel">
        <!--表头-->
        <div class="table_header">
            <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                <thead><tr>
                    <th style="width:50px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center hover table_title"><div style="width:50px;" class="divEllipsis">选择</div></th>
                    <th style="width:100px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">行分隔符</div></th>
                    <th style="width:100px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">列分隔符</div></th>
                    <th style="width:100px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">编码格式</div></th>
                    <th style="border-bottom:0px;border-right:1px solid #ddd;" :style="{width:descW+'px'}" class="text-center"><div :style="{width:descW+'px'}" class="divEllipsis">数据来源</div></th>
                    <th style="width:100px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">操作</div></th>
                </tr></thead>
            </table>
        </div>
        <!--标体-->
        <div class="table_body">
            <Scroll :listen="data" :store="store" ref="scroll">
                <table class="table" style="border-collapse: collapse;margin-top:0px;">
                    <tbody>
                        <tr v-for="(d,i) in data">
                            <td @click="curSelItem=d" style="cursor:pointer;width:50px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center hover table_title"><div style="width:50px;" class="divEllipsis">
                            <i class="fa" :class="{
                            'fa-square-o':curSelItem.source_code!=d.source_code,
                            'fa-check-square-o':curSelItem.source_code==d.source_code}">
                            </i></div>
                            </td>
                            <td style="width:100px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">{{converFileSep(d.row_seperator)}}</div></td>
                            <td style="width:100px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">{{converFileSep(d.col_seperator)}}</div></td>
                            <td style="width:100px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis">{{d.encoding}}</div></td>
                            <td style="border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" :style="{width:descW+'px'}" class="text-center"><div :style="{width:descW+'px'}" class="divEllipsis">{{d.microprobe_type}}</div></td>
                            <td style="width:100px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:100px;" class="divEllipsis"><i class="fa fa-remove" style="cursor:pointer;" @click="removeItem(d,i)"></i></div></td>
                        </tr>
                    </tbody>
                </table>
            </Scroll>
        </div>
    </div>
</template>

<script>
import Scroll from 'components/scroll'
import {BODY_RESIZE,upload_get_fileparse,upload_del_fileparse,File_Seperator,SetSource,IsDelSource} from '../../store/mutation-types'
import { mapState,mapMutations} from 'vuex'
export default {
  name: 'ParsingRulesSel',
  props:['store','code'],
  components:{Scroll},
  data () {
    return {
      descW:0,
      data:[],
      curSelItem:{},
      fileSep:[]
    }
  },
  computed:mapState({
      dataSource:state=>{return state.oriSource;},
  }),
  mounted(){
    this.$store=this.$store || this.store;
    //获取文件分隔符
    this.$store.dispatch(File_Seperator).then(res=>{
        this.fileSep=res.biz_body;
        //获取解析规则
        this.$store.dispatch(upload_get_fileparse,{dataSource:this.code}).then(res=>{
            this.data=res.biz_body;
        });
    });

    setTimeout(()=>{
        let w= $(this.$el).width();
        this.descW=w-470;
    },0);
    this.$store.commit(BODY_RESIZE,()=>{
        setTimeout(()=>{
            let w= $(this.$el).width();
            this.descW=w-470;
        },100);
    });
  },
  methods:{
      //选中解析项
      selItem(item){
        this.curSelItem=item;
      },
      //添加解析项
      addItem(item){
        this.data.push(item);
      },
      //删除项
      removeItem(d,i){
        tool.confirm('您确定要删除该项解析规则？',['确定','取消'],()=>{
            this.$store.dispatch(upload_del_fileparse,d.id).then(res=>{
                if(!tool.msg(res,'','删除失败!'))return;
                this.data.splice(i,1);

                this.$store.dispatch(IsDelSource,this.code).then(res=>{
                    //添加新增的数据源到已有的数据源中
                    let dataSource=tool.Clone(this.dataSource);
                    let customSource=dataSource['自建数据源'];//自建数据源对象
                    customSource.tables[this.code].isDel=res.biz_body.isDel;

                    this.$store.commit(SetSource,dataSource);
                });

            });
        },function(){});
      },
      //转化文件分隔符显示
      converFileSep(sep){
        return  (_.find(this.fileSep,f=>f.value==sep) || {name:sep}).name;
      }
  }
}
</script>

<style scoped lang="less">
@import "../../css/variables.less";
.ParsingRulesSel{width:100%;height:100%;position:relative;}

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
