<!-- 新增/修改查询条件组件 -->
<template>
    <div class="QueryCond">
        <!--标题-->
        <div class="title">
            {{setF.name || '新建查询条件'}}
        </div>

        <!--操作栏-->
        <div class="QueryCond_option_bar">
            <div class="item">
                <el-input placeholder="请输入标题(必填)" v-model="setF.name"  class="input-with-select" />

                <!--验证错误提示信息-->
                <div class="validInfo" v-if="!blnVaildName" @mousedown="blnVaildName=true">
                    请输入<i class="fa fa-remove"></i>
                </div>
            </div>
            
            <div class="item">
                <el-select 
                    v-model="setType" 
                    @change="typeChange"
                    placeholder="请选择">
                    <el-option
                        v-for="(val,key) in searchArrType" :label="val" :value="key">
                    </el-option>
                </el-select>
            </div>

            <div class="item" v-show="searchArrType[setF.type]=='日期范围'">
                <el-button-group>
                    <el-button :class="{requried:setF.range==1}" @click="setF.range=1">今天之前</el-button>
                    <el-button :class="{no_requried:!setF.range}" @click="setF.range=0">无</el-button>
                </el-button-group>
            </div>

            <div class="item" v-show="searchArrType[setF.type]=='日期范围'">
                <el-button-group>
                    <el-button :class="{}">{{setF.timeShort?setF.timeShort.length:0}}个</el-button>
                    <el-button :class="{}" @click="addShortcut()" style="height:36px;"><i class="fa fa-plus"></i></el-button>
                </el-button-group>
            </div>

            <div class="item">
                <el-select 
                    v-model="setF.filed"
                    @change="filedChange" 
                    placeholder="索引字段(必选)">
                    <el-option
                        v-for="f in indexFields" :label="f.name" :value="f">
                    </el-option>
                </el-select>

                <!--验证错误提示信息-->
                <div class="validInfo" v-if="!blnVaildField" @mousedown="blnVaildField=true">
                    请选择<i class="fa fa-remove"></i>
                </div>
            </div>

            <div class="item">
                <el-input placeholder="请输入默认值" v-if="searchArrType[setF.type]=='文本框'"  v-model="setF.defVal"  class="input-with-select" />
                <el-date-picker style="width:100%;" v-if="searchArrType[setF.type]=='日期'" format="yyyy-MM-dd" v-model="setF.defVal" type="date" placeholder="选择日期" :picker-options="single_pickerOptions"></el-date-picker>
                <el-date-picker style="width:100%;" v-if="searchArrType[setF.type]=='生日'" format="yyyy-MM-dd" v-model="setF.defVal" type="date" placeholder="选择日期"></el-date-picker>
                <el-date-picker style="width:100%;" v-if="searchArrType[setF.type]=='日期范围'" format="yyyy-MM-dd" v-model="setF.defVal" type="daterange" placeholder="选择日期" :picker-options="single_pickerOptions"></el-date-picker>
                <el-select style="width:100%;" v-if="searchArrType[setF.type]=='下拉框'" v-model="setF.dropVal" placeholder="请选择" @change="dropChange">
                    <el-option
                        v-for="item in ((setF.filed || {}).referval || [])"
                        :label="item.name"
                        :value="item">
                    </el-option>
                </el-select>
                <virtualIden v-if="searchArrType[setF.type]=='虚拟身份控件'" :val="setF.defVal" :ccontext="setF" :options="VirType" @change="Idenchange"></virtualIden>
            </div>

            <div class="item" v-if="setF.filed">
                <el-select  v-model="setF.searchFormat" :clearable="true" placeholder="格式化参数">
                    <el-option
                    v-for="item in formatSearch"
                    :key="item.val"
                    :label="item.name"
                    :value="item.val">
                    </el-option>
                </el-select>
            </div>

            <div class="item" v-if="setF.filed">
                <el-select  v-model="setF.mask" :clearable="true" placeholder="请选择输入限制类型">
                    <el-option
                    v-for="item in mask"
                    :key="item.val"
                    :label="item.name"
                    :value="item.val">
                    </el-option>
                </el-select>
            </div>
        </div>


        <div style="text-align:right;margin-right:10px;">
            <button type="button" class="btn btn-success" @click="submit_btn()">{{setF.blnAdd==2?'修改':'确定'}}</button>
            <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
        </div>

        <!--删除按钮-->
        <div class="removeBtn" @click="cancel_btn()">
            <i class="fa fa-remove"></i>
        </div>
    </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import Scroll from 'components/Scroll'
import searchArrType from '../../enum/SearchType.js'
import {mask} from '../../enum/MaskType.js' 
import virtualIden from 'components/virtualIden'
export default {
  name: 'QueryCond',
  props:['data','store'],
  components:{virtualIden},
  data () {
    return {
      mask:mask,
      single_pickerOptions:{//单个日期控件选择限制条件
        disabledDate(time) {
            return false; //time.getTime() < Date.now() - 8.64e7;
        }
      },
      searchArrType:searchArrType,
      setF:{},
      setType:-1,//字段类型
      blnVaildName:true,
      blnVaildField:true,
      VirType:{},
      count:2,
    }
  },
  computed:mapState({
      //索引字段
      indexFields:state=>{
        let table=state.menuManage.curSelTable;
        let fieldKind=[];

        let indexFields=table.indexFields, 
        requisite=(indexFields && indexFields.requisite) || [],
        notRequisite=(indexFields && indexFields.notRequisite) || [];

        for(let site in requisite){
            let group=[];
            let groupItems=requisite[site].split(',');
            for(let field in groupItems){
                let item =table.fields[groupItems[field]];
                if(!item){continue;}
                item.tableKey=table.key;
                item.tableName=table.name;
                fieldKind.push(item);
            }
        }

        for(let site in notRequisite){
            let groupItem=notRequisite[site];
            let item =table.fields[groupItem];
            if(!item){continue;}
            item.tableKey=table.key;
            item.tableName=table.name;
            fieldKind.push(item);
        }

        return fieldKind;
      },
      formatSearch:state=>state.formatSearch
  }),
  mounted(){
    this.$store=this.$store || this.store;
    this.setF=tool.Clone(this.data || {});
    this.setType=this.setF.type;
    
    ser.getVidType().then(res=>{
        this.VirType=res.biz_body;
    });

  },
  methods:{
      typeChange(type){
          if(this.setF.blnAdd==2 && this.count>0){this.count=this.count-1; return;}

          this.setF.type=this.setType;
          this.setF.defVal='';
      },
      filedChange(f){
        if(this.setF.blnAdd==2 && this.count>0){this.count=this.count-1; return;}

        let s=this;
        this.setF.type=(f.type || 1)+'';
        this.setType=this.setF.type;
        this.setF.defVal=f.defVal || '';
        this.setF.referval=f.referval || [];
        this.setF.name= f.name;
        //转变参考值
        for(let item of s.setF.referval){
            if(item.value==s.setF.defVal){
                s.setF.dropVal=item;break;
            }
        }   
      },
      dropChange(val){
        if(!val){this.setF.defVal='';return;}

        this.setF.defVal=val.value;
      },
      Idenchange(item,val){
        item.defVal=val;
      },
      submit_btn(){
        let blnVaild=true;
        if(!this.setF.name){this.blnVaildName=false;blnVaild=false;}
        if(!this.setF.filed){this.blnVaildField=false;blnVaild=false;}
        if(!blnVaild)return;

        this.setF.blnAdd=0;
        this.setF.filed=tool.Clone(this.setF.filed);
        this.setF.filed.mask=this.setF.mask;
        Object.assign(this.data,this.setF);
        this.$emit('complete');
      },
      //取消
      cancel_btn(){
        this.$emit('cancel',this.data);
      },
      //添加/删除快捷选项(日期范围)
      addShortcut(){
          let self=this;
          let shortHtml=`
            <div class="optionBar" style="height:40px;width:100%;line-height:40px;text-align: center;border-bottom:1px solid #e7eaec;">
                <div style="display:inline-block;width:100px;"><el-input placeholder="快捷名称" v-model="name"></el-input></div>
                <div style="display:inline-block;width:80px;"><el-input placeholder="天数" v-model="day"></el-input></div>
                <div style="display:inline-block;width:180px;line-height:auto;">
                    <el-button-group style="margin-top:-4px;width:180px;">
                        <el-button :class="{shoreParamActive:tag==0}" @click="tag=0">之前</el-button>
                        <el-button :class="{shoreParamActive:tag==1}" @click="tag=1">之后</el-button>
                        <el-button :class="{shoreParamActive:odd==1}" @click="odd=odd?0:1">单天</el-button>
                    </el-button-group>
                </div>
                <div style="display:inline-block;width:60px;">
                    <el-button type="primary"" @click="add()"><span >添加</span></el-button>
                </div>
            </div>
            <div class="list" style="height:calc(100% - 40px - 34px);width:100%;">
                <Scroll :store="store" :listen="data">
                    <div v-for="(d,i) in data" class="shortItem" style="font-size:12px;">
                        <div style="float:left;height:100%;width:30px;text-align:center;border-right:1px solid #e7eaec;">{{i+1}}</div>
                        <div style="float:right;height:100%;width:30px;text-align:center;border-left:1px solid #e7eaec;cursor:pointer;">
                            <i class="fa fa-close" @click="remove(i)"></i>
                        </div>
                        <div style="margin: 0px 41px;height:100%;">
                            {{d.name}}
                            <span style="margin:0px 5px;color:#03c1d7;">{{d.day}}/天</span>
                            <span style="color:#ebb52f;">{{d.tag==0?'之前':'之后'}}</span>
                            <span style="">({{d.odd==0?'范围':'单天'}})</span>
                        </div>
                    </div>
                </Scroll>
            </div>
            <div style="text-align:right;">
                <button type="button" class="btn btn-success" @click="submit_btn()">确定</button>
                <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
            </div>
        `;
        tool.open(function(){
            let shortParma={
                title:'快捷项操作',
                area:['460px','300px'],
                components:{Scroll},
                content:`<div class="add_Shortcut_Pop" style="height:100%;width:100%;">${shortHtml}</div>`,
                context:{
                    store:self.$store,
                    name:'',
                    day:'',
                    tag:0,//时间标识(0:之前,1:之后)
                    odd:0,//标识是否为单天(0:为选取范围,1:为单天)
                    data:tool.Clone(self.setF.timeShort || []),
                    add(){
                        let d=shortParma.selfData,item={name:d.name,day:d.day,tag:d.tag,odd:d.odd},data=d.data;
                        data.push(item);
                        d.name='';
                        d.day='';
                        d.tag=0;
                        d.odd=0;
                    },
                    submit_btn(){
                        shortParma.close();
                        self.setF.timeShort=tool.Clone(shortParma.selfData.data);
                    },
                    cancel_btn(){
                        shortParma.close();
                    },
                    remove(i){
                        shortParma.selfData.data.splice(i,1);
                    }
                }
            };

            return shortParma;
        }());
      }
  }
}
</script>

<style lang="less">
 @import "../../css/variables.less";
//操作快捷项可选按钮样式
.add_Shortcut_Pop .shoreParamActive{background-color:#03c1d7;color:white !important;}
.add_Shortcut_Pop .shortItem{.border('bottom');line-height:30px;}
</style>
<style scoped lang="less">
   @import "../../css/variables.less";
   .QueryCond {padding-bottom:10px;width:100%;height:100%;position:relative;}
   .QueryCond .title{line-height:30px;text-align:center;font-style:italic;.border('bottom',#d9d9d9);}
   .QueryCond .QueryCond_option_bar{padding:10px;}
   .QueryCond .QueryCond_option_bar .item{margin-bottom:10px;position:relative;}

   .QueryCond .QueryCond_option_bar .item .validInfo{
       content:'';
       width:100%;
       height:100%;
       position:absolute;
       .border('',red);
       z-index:100;
       border-radius:5px;
       top:0px;
       left:0px;
       line-height:36px;
       padding-left:10px;
       background-color:white;
       color:red;
       cursor:pointer;
   }

   .QueryCond_option_bar .requried{background-color:@Font_Hover_Col;color:@FrontCol;}
   .QueryCond_option_bar .no_requried{background-color:@Font_Hover_Col;color:@FrontCol;}

   @removeBtnSize:20px;
   .QueryCond .removeBtn{height:@removeBtnSize;width:@removeBtnSize;border-radius:50%;background-color:@Font_Hover_Col;cursor:pointer;
                         text-align:center;line-height:@removeBtnSize;color:white;position:absolute;right:-@removeBtnSize/2;top:-@removeBtnSize/2;}
</style>
