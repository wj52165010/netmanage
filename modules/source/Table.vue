<!-- 配置表组件 -->
<template>
    <div class="TableSetting">
        <!--已添加预览-->
        <div class="preView">
            <!--标题栏-->
            <div class="title">
                <span class="name">已添加预览</span>
            </div>
            <!--内容栏-->
            <div class="content">
                <!--表头-->
                <div class="table_header">
                    <table class="table" style="border-collapse: collapse;margin-bottom:0px;">
                        <thead><tr>
                            <th style="width:150px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">字段名称</div></th>
                            <th style="width:150px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">字段标题</div></th>
                            <th style="border-bottom:0px;border-right:1px solid #ddd;" :style="{width:descW+'px'}" class="text-center"><div :style="{width:descW+'px'}" class="divEllipsis">字段描述</div></th>
                            <th style="width:120px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:120px;" class="divEllipsis">数据类型</div></th>
                            <th style="width:50px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis">索引</div></th>
                            <th style="width:50px;border-bottom:0px;border-right:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis">排序</div></th>
                            <th style="width:50px;border-bottom:0px;border-right:0px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis">快搜</div></th>
                        </tr></thead>
                    </table>
                </div>
                <!--表体-->
                <div class="table_body">
                    <Scroll :listen="data">
                        <table class="table" style="border-collapse: collapse;margin-top:0px;">
                            <tbody>
                                <tr v-for="c in cols">
                                    <td style="width:150px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{c.key}}</div></td>
                                    <td style="width:150px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:150px;" class="divEllipsis">{{c.name}}</div></td>
                                    <td style="border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" :style="{width:descW+'px'}" class="text-center"><div :style="{width:descW+'px'}" class="divEllipsis">{{c.desc}}</div></td>
                                    <td style="width:120px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:120px;" class="divEllipsis">{{converDataKind(c.type)}}</div></td>
                                    <td style="width:50px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis"><i class="fa" :class="{'fa-check':c.isIndex,'fa-remove':!c.isIndex}"></i></div></td>
                                    <td style="width:50px;border-top:0px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis"><i class="fa" :class="{'fa-check':c.isOrder,'fa-remove':!c.isOrder}"></i></div></td>
                                    <td style="width:50px;border-top:0px;border-right:0px solid #ddd;border-bottom:1px solid #ddd;" class="text-center"><div style="width:50px;" class="divEllipsis"><i class="fa" :class="{'fa-check':c.isQuickSearch,'fa-remove':!c.isQuickSearch}"></i></div></td>
                                </tr>
                            </tbody>
                        </table>
                    </Scroll>
                </div>
            </div>
        </div>

        <!--表配置-->
        <div class="TableSet">
            <!--标题栏-->
            <div class="title">
                <span class="name">表配置</span>
            </div>
            <!--内容栏-->
            <div class="content">
                <div class="item">
                    <div class="name">数据源名称 :</div>
                    <div class="option">
                        <el-input v-model="title" />
                    </div>
                    <div class="clearfix"></div>
                </div>
                <div class="item">
                    <div class="name">数据源主键 :</div>
                    <div class="option">
                        <el-select  multiple v-model="primary_columns" placeholder="请选择">
                            <el-option
                                v-for="item in cols"
                                :label="item.name"
                                :value="item.key">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="clearfix"></div>
                </div>

                <div class="item">
                    <div class="name">数据来源 :</div>
                    <div class="option">
                        <el-select  
                            v-model="sourceOri"
                            placeholder="请选择">
                            <el-option
                                v-for="item in ['elastic']"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="clearfix"></div>
                </div>

                <div class="item">
                    <div class="name">拆分类型 :</div>
                    <div class="option">
                        <el-select v-model="split_type" placeholder="拆分类型">
                            <el-option
                            v-for="item in [{name:'年',val:'YEAR'},{name:'月',val:'MONTH'},{name:'日',val:'DAY'}]"
                            :key="item.val"
                            :label="item.name"
                            :value="item.val">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="clearfix"></div>
                </div>

                <div class="item">
                    <div class="name">拆分列 :</div>
                    <div class="option">
                        <el-select v-model="split_column" placeholder="拆分依据列名">
                            <el-option
                            v-for="item in cols"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import Scroll from 'components/scroll'
import {BODY_RESIZE,SetAddSourcePageData,ClearAddSourcePageData} from '../../store/mutation-types'

import FieldKind from './emnu/fieldKind'

export default {
  name: 'TableSetting',
  components:{Scroll},
  data () {
    return {
      descW:0,
      data:[],
      title:'',//数据源名称
      primary_columns:[],//数据源主键
      split_type:'',//拆分类型
      split_column:'',//拆分列名
      sourceOri:'',//数据源来源
    }
  },
  watch:{
      config:{
          deep:true,
          handler:function(){
              this.$store.commit(SetAddSourcePageData,this.config);
          }
      }
  },
  computed:mapState({
    cols:state=>{
      return state.addSource.cols;
    },
    config(){
        return {
            sourceTitle:this.title,
            primary_columns:this.primary_columns,
            split_type:this.split_type,
            split_column:this.split_column,
            sourceOri:this.sourceOri
        }
    },
    PageData:state=>{
        return state.addSource;
    },
  }),
  mounted(){
    setTimeout(()=>{
        let w= $(this.$el).find('.preView').width();
        this.descW=w-580;
    },0);
    this.$store.commit(BODY_RESIZE,()=>{
        setTimeout(()=>{
            let w= $(this.$el).find('.preView').width();
            this.descW=w-580;
        },100);
    });

    this.$nextTick(()=>{
        this.recoverData();
    });
  },
  methods:{
    //清空页面数据
    clearData(){
        this.$store.commit(ClearAddSourcePageData);
    },
    //恢复页面之前操作的值
    recoverData(){
        let {sourceTitle,primary_columns,split_type,split_column} =this.PageData;
        this.title=sourceTitle;
        this.primary_columns=primary_columns;
        this.split_type=split_type;
        this.split_column=split_column;
    },
    //转化数据类型为用户可看数据
    converDataKind(kind){
        return _.find(FieldKind,k=>k.val==kind).name;
    }
  }
}
</script>

<style scoped lang="less">
@import "../../css/variables.less";
.TableSetting{width:100%;height:100%;padding:10px;}
@titleH:40px;

.TableSetting .title{text-align:left;width:100%;height:@titleH;line-height:@titleH;padding:0px 10px;.border('bottom');font-weight:600;font-style: italic;}
.TableSetting .content{width:100%;height:~'calc(100% - @{titleH})';}

@TableSetW:300px;
.TableSetting .preView{width:~'calc(100% - @{TableSetW} - 10px)';height:100%;.border('');float:left;}
.TableSetting .TableSet{width:@TableSetW;height:100%;.border('');float:right;}


.TableSetting .content{}
.TableSetting .content .item {width:@TableSetW*.9;line-height:40px;margin:0px auto;margin-top:10px;}

@ItemNameW:100px;
.TableSetting .content .item .name{width:@ItemNameW;float:left;font-style:italic;}
.TableSetting .content .item .option{float:right;width:~'calc(100% - @{ItemNameW})';text-align:left;}

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
