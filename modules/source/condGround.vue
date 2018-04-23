<!-- 条件分组组件 -->
<template>
    <div class="CondGround">
        <!--新增按钮-->
        <div class="addBtn" @click="addGround()">
            <i class="fa fa-plus"></i>
        </div>
        <!--头部信息-->
        <div class="header">
            <div class="number">编号</div>
            <div class="cond">条件</div>
            <div class="preview">条件详情</div>
            <div class="operator">关系</div> 
            <div class="cond">条件</div>
            <div class="preview">条件详情</div> 
        </div>

        <!--分组信息-->
        <div class="groundInfo">
          <Scroll :listen="groupConds">
            <div class="ground_item" v-for="(g,i) in groupConds">
              <div class="number">{{i+1}}</div>
              <div class="cond">
                <el-select 
                    v-model="g.firstVal" 
                    placeholder="请选择"
                    style="margin-top:2px;margin-left:5px;margin-right:5px;">
                    <el-option
                        v-for="item in getGroundSels(i)"
                        :label="item.name"
                        :value="item">
                    </el-option>
                </el-select>
              </div>
              <div class="preview divEllipsis" :title="converShowCond(g.firstVal)">{{converShowCond(g.firstVal) || '&nbsp;'}}</div>
              <!--关系-->
              <div class="operator">
                <el-select
                    v-model="g.cond"
                    placeholder="请选择"
                    style="margin-top:2px;margin-left:5px;margin-right:5px;">
                    <el-option
                        v-for="item in [{name:'且',val:'0'},{name:'或',val:'1'}]"
                        :label="item.name"
                        :value="item.val">
                    </el-option>
                </el-select>
              </div> 
              <div class="cond">
                <el-select  
                    v-model="g.scendtVal"
                    placeholder="请选择"
                    style="margin-top:2px;margin-left:5px;margin-right:5px;">
                    <el-option
                        v-for="item in getGroundSels(i)"
                        :label="item.name"
                        :value="item">
                    </el-option>
                </el-select>
              </div>
              <div class="preview divEllipsis" :title="converShowCond(g.scendtVal)">{{converShowCond(g.scendtVal) || '&nbsp;'}}</div> 
              <div class="clearfix"></div>
            </div>
          </Scroll>
        </div>

        <!--运算结果-->
        <div class="oper_res divEllipsis">
            <span style="font-style:italic;margin-right:10px;">运算结果:</span>{{result}}
        </div>
    </div>
</template>

<script>
import Scroll from 'components/scroll'
import {mapState,mapMutations} from 'vuex'
import {BODY_RESIZE,SetUploadSourcePageData,ClearUploadSourcePageData} from '../../store/mutation-types'
export default {
  name: 'CondGround',
  components:{Scroll},
  data () {
    return {
      groupConds:[],
      result:'',
      params:{},
      oriConds:[],//设置后的条件数据
    }
  },
  watch:{
    config:{
        deep:true,
        handler:function(){
            this.$store.commit(SetUploadSourcePageData,this.config);
        }
    },
    groupConds:{
        deep:true,
        handler:function(){
            if(this.groupConds.length<=0){this.result=''; return;}
            let res={};
            this.calculGroup(this.groupConds[0],res,true,this.params);
            
            this.result=res.pre()+res.cond+res.after();
        }
    }
  },
  computed:mapState({
    PageData:state=>{
        return state.uploadSource;
    },
    config(){
        return {
            groupConds:this.groupConds,
            oriConds:this.oriConds,
            filter:this.params
        };
    },
    conds:state=>state.uploadSource.conds,
  }),
  mounted(){
      this.recoverData();
      if(this.groupConds.length<=0){this.addGround();}

      this.oriConds=tool.Clone(this.conds);
  },
  methods:{
    //清除页面数据
    clearData(){
        this.$store.commit(ClearUploadSourcePageData);
    },
     //恢复页面之前操作的值
    recoverData(){
        let {groupConds,oriConds} =this.PageData;

        //判断上这次的设置条件是否与上一次的设置条件一致，不一致则重新出实话分组条件
        if(this.conds.length==oriConds.length){
            let conds=this.conds,blnDiff=false;
            for(let i=0;i<conds.length;i++){
                if(!_.find(oriConds,c=>c.field && c.field.key==(conds[i].field || {key:''}).key)){
                    blnDiff=true;break;
                }
            }

            if(blnDiff){
                this.groupConds=[];
            }else{
                this.groupConds=groupConds;
            }

        }else{
            this.groupConds=[];
        }
    },
    //添加分组
    addGround(){
      let item ={name:'分组'+(this.groupConds.length+1),type:'group',firstVal:'',scendtVal:'',cond:''};
      this.groupConds.push(item);
    },
    //设置分组当前分组允许设置的分组项
    getGroundSels(i){
        return [...this.conds,..._.filter(this.groupConds,(g,v)=>v>i)];
    },
    //转化显示条件
    converShowCond(val){
        if(!val){return ''}
        if(val.type=='group'){
            let res={},params={};
            this.calculGroup(val,res,true,params);
            if(res.pre()=='' && res.cond=='  ' && res.after()==''){
                return ''
            }
            return res.pre()+res.cond+res.after();
        }else{
            return val.field.name+' '+val.condSign + ' '+val.value;
        }
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
                return (hasOne?'':'( ') + (blnField?firstVal.field.name+' '+firstVal.condSign+' '+firstVal.value:firstVal.number);};
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
                return (blnField?scendtVal.field.name+' '+scendtVal.condSign+' '+scendtVal.value:scendtVal.number) + (hasOne?'':' )');};
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
.CondGround{width:100%;height:100%;position:relative;}
@headerH:40px;
.CondGround .header{width:100%;height:@headerH;.border('bottom');text-align:center;}
@condW:120px;//条件数据宽度
@operatorW:80px;//运算符宽度
@numberW:50px;
.CondGround .number{height:100%;width:@numberW;.border('right');float:left;line-height:@headerH;}
.CondGround .cond{height:100%;width:@condW;.border('right');float:left;line-height:@headerH;}
.CondGround .preview{height:100%;width:~'calc(50% - @{condW} - @{operatorW}/2 - @{numberW}/2)';.border('right');float:left;line-height:@headerH;padding:0px 10px;}
.CondGround .operator{height:100%;width:@operatorW;.border('right');float:left;line-height:@headerH;}

@operResH:40px;
.CondGround .oper_res{width:100%;height:@operResH;.border('top');line-height:@operResH;padding:0px 10px;}

.CondGround .groundInfo{width:100%;height:~'calc(100% - @{headerH} - @{operResH})';}
.CondGround .groundInfo .ground_item{.border('bottom');text-align:center;}

.CondGround .addBtn{position:absolute;right:2px;width:20px;height:20px;border-radius:50%;margin-top:10px;
                        background-color:@Font_Hover_Col;color:white;cursor:pointer;text-align:center;}
</style>
