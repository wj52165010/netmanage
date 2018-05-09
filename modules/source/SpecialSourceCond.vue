<!-- 限定数据源条件设置页面组件 -->
<template>
    <div class="SpecialSourceCond">
        <!--条件设置区域-->
        <div class="condSet">
          <!--标题栏-->
          <div class="title">
              <span class="name">设置条件</span>
          </div>
          <!--内容栏-->
          <div class="content">
            <Scroll :listen="conds">
                <div class="FieldSetItem" v-for="f in conds">
                <span class="number">{{f.number}}.</span> <CFieldSet :tables="[]" :data="f" @copy="copyCond" />
                </div>
            </Scroll>
          </div>
        </div>
        <!--条件组合区域-->
        <div class="condGroup_container">
          <!--标题栏-->
          <div class="title">
            <span class="name">条件组合方式</span>
            <div class="option_bar_right">
                <span class="item" @click="addGroup()"><i class="fa fa-plus" style="margin-right:5px;"></i>添加分组</span>
            </div>
          </div>
          <!--内容栏-->
          <div class="content">
            <!--左边分组条件显示区域-->
            <div class="left">
                <Scroll :listen="groups">
                    <div class="group_item" :class="{active:curSelGroupIndex==i}" v-for="(g,i) in groups" @click="curSelGroupIndex=i">
                        {{g.name}}
                    </div>
                </Scroll>
            </div>
            <!--右边分组设置区域-->
            <div class="right">
                <!--组合条件配置区域-->
                <div class="groupSet">
                    <div class="vcenter_container">
                        <CondGroup v-show="groups[curSelGroupIndex]==item" v-on:selChange="selChange" v-for="(item,index) in groups" :group="item" :items="groupConds"></CondGroup>
                    </div>
                </div>
                <!--组合条件显示区域-->
                <div class="condShow">
                    <span style="font-style:italic;">已组合的条件 :</span>
                    {{result}}
                </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import Scroll from 'components/scroll'
import CFieldSet from 'components/FieldSet.vue'
import CondGroup from 'components/CondGroup.vue'
import {BODY_RESIZE,ClearSepSource,SetSepSourcePageData} from '../../store/mutation-types'
export default {
  name: 'SpecialSourceCond',
  components:{Scroll,CFieldSet,CondGroup},
  data () {
    return {
      conds:[],//字段条件
      groupConds:[],//分组条件
      groups:[],//[{name:'分组1'},{name:'分组2'}]//分组信息
      curSelGroupIndex:-1,//当前选中分组索引
      params:{},
      result:''
    }
  },
  computed:mapState({
    PageData:state=>{
        return state.specialSource;
    },
    config(){
      return {
        conds:this.conds,
        groups:this.groups,
        curSelGroupIndex:this.curSelGroupIndex,
        params:this.params
      }
    },
    condFields:state=>{
        return _.map(state.specialSource.condFields,(f,i)=>{
            return {name:'条件'+(i+1),number:i+1,field:f,value:'',cond:''}
        });
    },

  }),
  watch:{
    conds:{
        deep:true,
        handler:function(){
            this.groupConds=tool.Clone(this.conds);
        }
    },
    config:{
        deep:true,
        handler:function(){
            this.$store.commit(SetSepSourcePageData,this.config);
        }
    },
  },
  mounted(){
    let s=this;
    this.recoverData();
    if(this.conds.length<=0) this.conds=this.condFields;
    //判断限定条件字段的数量是否已经发生改变,发生改变则需要重新设置分组条件
    this.resetDataByFields();

  },
  methods:{
    clearData(){
        this.$store.commit(ClearSepSource);
    },
    //恢复页面之前操作的值
    recoverData(){
        let {conds,groups,curSelGroupIndex,params} =this.PageData;
        this.conds=conds;
        this.groups=groups;
        this.curSelGroupIndex=curSelGroupIndex;
        this.params=params;
    },
    //根据限定条件字段改变重置相关数据
    resetDataByFields(){
        let s=this;
        let blnContain=true;
        //判断是否限定列都存在
        for(let i=0;i<s.condFields.length;i++){
            let res =false;
            for(let j=0;j<s.conds.length;j++){
                if(s.condFields[i].field.key==s.conds[j].field.key){
                    res=true;break;
                }
            }
            if(!res){blnContain=false;break;}
        }
        //判断列数量是否一致
        if(blnContain){
            blnContain=_.keys(_.groupBy(s.conds,c=>{
                return c.field.key;
            })).length==s.condFields.length;        
        }
        

        if(!blnContain){
            this.conds=_.map(_.flatten(_.map(s.condFields,c=>{
                    let arr=_.filter(s.conds,d=>d.field.key==c.field.key);
                    return arr.length<=0?c:arr;
                })),(f,i)=>{
                    f.number=i+1;
                    return f;
                });
            this.groups=[];
            this.curSelGroupIndex=-1;
        }
    },
    //克隆条件
    copyCond(data){
        data.name='条件'+(this.conds.length+1);
        data.number=this.conds.length+1;
        this.conds.push(data);
    },
    //添加分组
    addGroup(){
        let item ={name:'分组'+(this.groups.length+1),type:'group',firstVal:'',scendtVal:'',cond:''};
        this.groups.push(item);
        this.groupConds.push(item);
    },
    //条件改变事件
    selChange(){
        let res={};
        this.calculGroup(this.groups[0],res,false,this.params);
        
        this.result=res.pre()+res.cond+res.after();
    },
    //计算分组项的值
    calculGroup(group,res,blnField,conds){
        let condMap=['&&','||'],condValMap=['and','or'];
        let firstVal=group.firstVal,scendtVal=group.scendtVal,cond=condMap[group.cond] || '',hasOne=(firstVal && !scendtVal) || (!firstVal && scendtVal);
        if(conds && firstVal && scendtVal){
            conds.term=condValMap[group.cond];conds.condtions=[{},{}];conds.value='';conds.field={};
        }else{
            res.cond='';
            conds.term='';conds.value='';conds.field='';
            if(conds.condtions){delete conds.condtions;}
        }
        if(firstVal && firstVal.type=='group')
        {
            res.pre=()=>{
            let result={};
            this.calculGroup(firstVal,result,blnField,conds.condtions?conds.condtions[0]:conds);
            return (hasOne?'':'( ')+ result.pre() + result.cond + result.after();
            };
        }else if(firstVal){
            if(conds && !hasOne){
            conds.condtions[0].term=firstVal.condLetter;
            conds.condtions[0].field={table:firstVal.field.tableKey,key:firstVal.field.key};//firstVal.field.tableKey+'_'+firstVal.field.key;
            conds.condtions[0].value=firstVal.value;
            }else{
            conds.term=firstVal.condLetter;
            conds.field={table:firstVal.field.tableKey,key:firstVal.field.key};//firstVal.field.tableKey+'_'+firstVal.field.key;
            conds.value=firstVal.value;
            }

            res.pre=()=>{
                return (hasOne?'':'( ') + (blnField?firstVal.field.tableName+'.'+firstVal.field.name+' '+firstVal.condSign+' '+firstVal.value:firstVal.number);};
        }else{
            res.pre=()=>{return '';}
        }

        if(scendtVal && scendtVal.type=='group')
        {
        
            res.after=()=>{
            let result={};
            this.calculGroup(scendtVal,result,blnField,conds.condtions?conds.condtions[1]:conds);
            return  result.pre() + result.cond +result.after() + (hasOne?'':' )');
            };
        }else if(scendtVal){
            if(conds && !hasOne){
            conds.condtions[1].term=scendtVal.condLetter;
            conds.condtions[1].field={table:scendtVal.field.tableKey,key:scendtVal.field.key};//scendtVal.field.tableKey+'_'+scendtVal.field.key;
            conds.condtions[1].value=scendtVal.value;
            }else{
            conds.term=scendtVal.condLetter;
            conds.field={table:scendtVal.field.tableKey,key:scendtVal.field.key};//scendtVal.field.tableKey+'_'+scendtVal.field.key;
            conds.value=scendtVal.value;
            }
            res.after=()=>{
                return (blnField?scendtVal.field.tableName+'.'+scendtVal.field.name+' '+scendtVal.condSign+' '+scendtVal.value:scendtVal.number) + (hasOne?'':' )');};
        }else{
            res.after=()=>{return '';};
        }

        if(!hasOne){res.cond=' '+cond+' ';}
    },
  }
}
</script>

<style scoped lang="less">
@import "../../css/variables.less";
.SpecialSourceCond{width:100%;height:100%;}

@condSetH:40%;
.condSet{height:@condSetH;width:100%;.border('bottom');}
.condGroup_container{height:~'calc(100% - @{condSetH})';width:100%;}
@titleH:40px;
.condSet .title,
.condGroup_container .title{text-align:left;width:100%;height:@titleH;line-height:@titleH;padding:0px 10px;.border('bottom');font-weight:600;font-style: italic;}

.condSet .content,
.condGroup_container .content{height:~'calc(100% - @{titleH})';width:100%;text-align:left;}

.condSet .content{padding:10px;}

@LeftW:150px;
.condGroup_container .content .left{width:@LeftW;float:left;height:100%;.border('right');padding:10px;text-align:center;}
.condGroup_container .content .right{width:~'calc(100% - @{LeftW})';float:right;height:100%;}

@group_itemH:40px;
.condGroup_container .content .left .group_item{height:@group_itemH;line-height:@group_itemH;.border('');border-radius:5px;margin-bottom:10px;font-style:italic;}
.condGroup_container .content .left .group_item:hover{color:white;cursor:pointer;}
html{.TColIm(~".condGroup_container .content .left .group_item:hover",'bg');}
.condGroup_container .content .left .group_item.active{color:white;}
html{.TColIm(~".condGroup_container .content .left .group_item.active",'bg');}

@condShowH:100px;
.condGroup_container .content .right .groupSet{width:100%;height:~'calc(100% - @{condShowH})';.border('bottom');display:table;text-align:center;}
.condGroup_container .content .right .groupSet .vcenter_container{height:100%;width:100%;display:table-cell;vertical-align: middle;}
.condGroup_container .content .right .condShow{width:100%;height:@condShowH;text-align:left;padding:15px;}

.SpecialSourceCond .option_bar_right{float:right;height:100%;font-weight:600;font-style:italic;}
.SpecialSourceCond .option_bar_right .item{cursor:pointer;margin-left:10px;}
//.SpecialSourceCond .option_bar_right .item:hover{color:@Font_Hover_Col;}
html{.TCol(~".SpecialSourceCond .option_bar_right .item:hover");}


.SpecialSourceCond .FieldSetItem{display:inline-block;position: relative;margin-right: 30px;}
.SpecialSourceCond .FieldSetItem .number{font-style:italic;font-size:20px;float: left;margin-top: 12px;margin-right: 5px;}

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
