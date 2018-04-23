<!-- 添加解析规则组件 -->
<template>
    <div class="ParsingRulesAdd">
      <!--属性设置-->
      <div class="propSet">
        <div class="item">
            <div class="name">行分隔符 :</div>
            <div class="option">
                <el-select 
                    v-model="rowSep"
                    clearable 
                    allow-create
                    default-first-option
                    placeholder="请选择(必选)">
                    <el-option
                        v-for="item in fileSep"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="clearfix"></div>
        </div>

        <div class="item">
            <div class="name">列分隔符 :</div>
            <div class="option">
                <el-select 
                    v-model="colSep"
                    clearable  
                    allow-create
                    default-first-option
                    placeholder="请选择(必选)">
                    <el-option
                        v-for="item in fileSep"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="clearfix"></div>
        </div>

        <div class="item">
            <div class="name">编码格式 :</div>
            <div class="option">
                <el-select  
                    v-model="encoding"
                    placeholder="请选择(必选)">
                    <el-option
                        v-for="item in ['utf-8','gbk']"
                        :label="item"
                        :value="item">
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
      </div>
      <!--列头设置-->
      <div class="colSet">
        <!--标题栏-->
        <div class="title">
            <span class="name">列头设置</span>
        </div>
        <!--内容栏-->
        <div class="content">
            <HTag :tags="pages" @change="tagChange">
                <div slot="t0" style="height:100%;width:100%;">
                    <ParsingRulesColSet ref="headerScroll" :store="store" :data="data" :sort="1" />
                </div>
                <div slot="t1" style="height:100%;width:100%;">
                    <ParsingRulesColSet ref="noHeaderScroll" :store="store" :data="data" />
                </div>
            </HTag>
        </div>
      </div>
    </div>
</template>

<script>
import {File_Seperator} from '../../store/mutation-types'

import HTag from 'components/HTag'
import ParsingRulesColSet from './ParsingRulesColSet'
export default {
  name: 'ParsingRulesAdd',
  props:['store','data'],
  components:{HTag,ParsingRulesColSet},
  data () {
    return {
      rowSep:'',
      colSep:'',
      encoding:'',
      sourceOri:'',
      fileSep:[],
      pages:[{name:'不包含列头',icon:'fa fa-tag'},{name:'包含列头',icon:'fa fa-tag'}],
    }
  },
  mounted(){
    this.$store=this.$store || this.store;
    //获取文件分隔符
    this.$store.dispatch(File_Seperator).then(res=>{
        this.fileSep=res.biz_body;
    });
  },
  methods:{
      //获取结果
      getRes(){
          return {
            rowSep:this.rowSep,
            colSep:this.colSep,
            encoding:this.encoding,
            sourceOri:this.sourceOri,
            cols:this.data
          };
      },
      layout(){
          this.$refs.headerScroll.layout();
          this.$refs.noHeaderScroll.layout();
      },
      tagChange(i){
          this.layout();
          this.$emit('tagChange',i);
      }
  }
}
</script>

<style scoped lang="less">
  @import "../../css/variables.less";
  .ParsingRulesAdd{width:100%;height:100%;}
  @propSetH:100px;
  .ParsingRulesAdd .propSet{height:@propSetH;width:100%;.border('');}
  .ParsingRulesAdd .colSet{height:~'calc(100% - @{propSetH})';width:100%;}

  .ParsingRulesAdd .propSet .item {width:50%;line-height:40px;margin:0px auto;margin-top:10px;float:left;padding-right:10px;}
  
  @ItemNameW:80px;
  .ParsingRulesAdd .propSet .item .name{width:@ItemNameW;float:left;font-style:italic;}
  .ParsingRulesAdd .propSet .item .option{float:right;width:~'calc(100% - @{ItemNameW} - 10px)';}

  @titleH:40px;
  .ParsingRulesAdd .title{text-align:left;width:100%;height:@titleH;line-height:@titleH;padding:0px 10px;.border('bottom');font-weight:600;font-style: italic;}
  .ParsingRulesAdd .colSet .content{height:~'calc(100% - @{titleH})';width:100%;}
</style>
