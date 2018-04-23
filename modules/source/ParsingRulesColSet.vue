<!-- 文件解析规则列头设置组件 -->
<template>
    <div class="ParsingRulesColSet">
        <!--列显示栏-->
        <div class="colShow">
            <!--标题栏-->
            <div class="title">
                <span class="name">数据列</span>
            </div>
            <!--内容栏-->
            <div class="content">
                <Scroll ref="leftScroll" :listen="cols" :store="store">
                    <div class="item divEllipsis" :class="{active:curColIndex==i}" v-for="(c,i) in cols" @click="colClick(i)">
                        <span style="font-size:12px;margin-right:5px;float:left;">{{i+1}}.</span>
                        <span v-show="!sort">{{c.name || c.key || ('列'+(i+1))}}</span>
                        <span v-show="sort" :title="c.name || c.key || ('列'+(i+1))" class="divEllipsis" style="display:inline-block;width:90px;">{{c.name || ('列'+(i+1))}}</span>
                        <div class="option_bar" v-show="sort">
                            <span class="icon" @click.stop="changeSort(i)"><i class="fa fa-arrow-up"></i></span>
                            <span class="icon" @click.stop="changeSort(i,true)"><i class="fa fa-arrow-down"></i></span>
                        </div>
                    </div>
                </Scroll>
            </div>
        </div>
        <!--属性设置栏-->
        <div class="proSet">
            <!--标题栏-->
            <div class="title">
                <span class="name" style="color:black;">对应设置</span>
            </div>
            <!--内容栏-->
            <div class="content" v-if="curCol">

                <div class="item" v-if="!sort">
                    <div class="name">对应列名 :</div>
                    <div class="option">
                        <el-input v-model="curCol.dest_column" />
                    </div>
                    <div class="clearfix"></div>
                </div>

                <div class="item">
                    <div class="name">默认值 :</div>
                    <div class="option">
                        <el-input v-model="curCol.def_val" />
                    </div>
                    <div class="clearfix"></div>
                </div>

                <div class="item">
                    <div class="name">忽略字段 :</div>
                    <div class="option">
                        <el-radio  style="font-weight:400;" v-model="curCol.ignore" :label="1">是</el-radio>
                        <el-radio  style="font-weight:400;" v-model="curCol.ignore" :label="0">否</el-radio>
                    </div>
                    <div class="clearfix"></div>
                </div>

                <div class="item" v-if="curCol">
                    <div class="name">格式化函数 :</div>
                        <div class="option">
                            <el-select v-model="curCol.format" placeholder="格式化函数" :clearable="true" @change="formatChange">
                                <el-option
                                v-for="item in parseFormat"
                                :key="item.val"
                                :label="item.name"
                                :value="item.val">
                                </el-option>
                            </el-select>
                        </div>
                    <div class="clearfix"></div>
                </div>
                
                <div style="width:70%;margin: 0px auto;" v-if="curCol">
                    <div style="margin-top: 10px;" v-if="curCol.format=='SUBSTRING'">
                        <CInput label="启始索引" @change="param_one_change" :val="curCol.firstParam" />
                        <CInput label="结束索引" @change="param_two_change" :val="curCol.senondParam" />
                    </div>

                    <div style="margin-top: 10px;" v-if="curCol.format=='REPALCE'">
                        <CInput label="正则表达式" @change="param_one_change" :val="curCol.firstParam" />
                        <CInput label="替换字符串" @change="param_two_change" :val="curCol.senondParam" />
                    </div>

                    <div style="margin-top: 10px;" v-if="curCol.format=='TO_UNIX_TIMESTAMP'">
                        <CInput label="定义时间格式区分大小写(如:yyyyMMddHHmmss)" @change="param_one_change" :val="curCol.firstParam" />
                    </div>

                    <div style="margin-top: 10px;" v-if="curCol.format=='TO_DEFINE'">
                        <CInput label="定义的值" @change="param_one_change" :val="curCol.firstParam" />
                    </div>

                    <div style="margin-top: 10px;" v-if="curCol.format=='TO_DEFAULT'">
                        <CInput label="默认值" @change="param_one_change" :val="curCol.firstParam" />
                    </div>

                    <div style="margin-top: 10px;" v-if="curCol.format=='TO_CHECKSUM_ID'">
                        <CInput label="字段名(多个用逗号分隔)" @change="param_one_change" :val="curCol.firstParam" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Scroll from 'components/scroll'
import CInput from 'components/input'
import parseFormat from './emnu/parseFormat.js'
export default {
  name: 'ParsingRulesColSet',
  props:['store','data','sort'],
  components:{Scroll,CInput},
  data () {
    return {
      parseFormat:parseFormat,
      cols:[],//[{name:'1',_format:'',firstParam:'',senondParam:''},{name:'2',_format:''},{name:'3',_format:''}],
      curColIndex:-1,
      curCol:null,
      blnColClick:false,
    }
  },
  watch:{
      curColIndex(){
          this.curCol=this.cols[this.curColIndex];
      },
      data(){
          this.cols=this.data || [];
      }
  },
  mounted(){
      this.$store=this.$store || this.store;
      this.cols=this.data || [];
  },
  methods:{
      layout(){
          this.$refs.leftScroll.reloadyScroll();
      },
      colClick(i){
        this.blnColClick=true;
        this.curColIndex=i;
        setTimeout(()=>{
            this.blnColClick=false;
        },100)
      },
      changeSort(i,blnDown){
          
          let cloneData =tool.Clone(this.cols[i]);
          this.cols.splice(i,1);

          if(!blnDown){//向上移动   
            this.cols.splice(i-1,0,cloneData);
          }else{//向下移动
            this.cols.splice(i+1,0,cloneData);
          }
      },
      formatChange(){
        if(this.blnColClick){this.blnColClick=false;return;}
        this.curCol.firstParam='';
        this.curCol.senondParam='';
      },
      param_one_change(val){
        if(!this.curCol)return;
        this.curCol.firstParam=val;
      },
      param_two_change(val){
        if(!this.curCol)return;
        this.curCol.senondParam=val;
      }
  }
}
</script>

<style scoped lang="less">
@import "../../css/variables.less";
.ParsingRulesColSet{width:100%;height:100%;text-align:left;}
@colShowW:200px;
.ParsingRulesColSet .colShow{width:@colShowW;height:100%;.border('right');float:left;}

@titleH:30px;
.proSet .title,
.colShow .title{text-align:center;width:100%;height:@titleH;line-height:@titleH;padding:0px 10px;.border('bottom');font-weight:600;font-style: italic;}

.ParsingRulesColSet .active:before{
    font: normal normal normal 14px/1 FontAwesome;
    content:"\f00c";
    float:right;
    margin-top:8px;
    margin-right:10px;
    color:@Font_Hover_Col;
}

@ItemH:30px;
.ParsingRulesColSet .colShow .item{height:@ItemH;line-height:@ItemH;padding:0px 10px;.border('bottom');font-style:italic;position:relative;}
.ParsingRulesColSet .colShow .item:hover{cursor:pointer;background-color:@Font_Hover_Col;color:white;}
.ParsingRulesColSet .colShow .content{height:~'calc(100% - @{titleH})';width:100%;}

.ParsingRulesColSet .proSet{margin-left:@colShowW;margin-right:0px;height:100%;}
.ParsingRulesColSet .proSet .content{height:~'calc(100% - @{titleH})';width:100%;}
.ParsingRulesColSet .proSet .content .item{}

.ParsingRulesColSet .proSet .content .item {width:70%;line-height:40px;height:40px;margin:0px auto;margin-top:10px;}
  
@ItemNameW:80px;
.ParsingRulesColSet .proSet .content .item .name{width:@ItemNameW;float:left;font-style:italic;}
.ParsingRulesColSet .proSet .content .item .option{float:right;width:~'calc(100% - @{ItemNameW})';}

.ParsingRulesColSet .option_bar{position:absolute;right:40px;top:0px;}
</style>
