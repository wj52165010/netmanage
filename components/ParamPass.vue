<!-- 参数传递组件 -->
<!-- 时间轴组件 -->
<template>
    <div class="ParamPass">
        <div class="title">{{iTitle}}</div>
        <div class="addBtn" @click="addClick()"><i class="fa fa-cog"></i></div>
        <div v-for="(item,index) in result">
            <div class="content">
                <div style="display:inline-block;float:left;">
                    <el-select v-model="item.source" placeholder="请选择">
                        <el-option
                        v-for="item in (source || [])"
                        :label="item.name"
                        :value="{key:item.alias || ((item.table || item.tableKey)+'_'+item.key),fieldKey:item.key,tableKey:item.table || item.tableKey,name:item.name}">
                        <span style="float: left">{{ item.name }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.tableName }}</span>
                        </el-option>
                    </el-select>
                </div>
                <div style="display:inline-block;float:right;">
                    <div style="height:36px;line-height:36px;width:200px;">{{item.target && item.target.name}}</div>
                </div>
                <div class="line"><div class="arrow"></div></div>
                <div class="clearfix"></div>
            </div>
        </div>
    </div>
</template>
<script>
// import {tool} from '../js/tool.js'
import OrderCheck from '../components/orderCheck.vue'

export default {
  name: 'ParamPass',
  props:['title','result','source','target','test'],
  data () {
    return {
      iTitle:'参数设置',
      selConds:{},//缓存选择的映射字段关系对象
    }
  },
  methods:{
      addClick(){
        //打开字段选择器
        let self=this;
        let html=`  <div style="margin:10px;">
                        <OrderCheck style="margin-right:10px;margin-bottom:10px;" v-for="(group,index) in data" :items="group" :id="'mapFieldKey'+index" :res="selConds"></OrderCheck>
                    </div>
                    <div style="text-align:right;padding-right:15px;">
                        <button type="button" class="btn btn-success" @click="submit_btn()">确定</button>
                        <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
                    </div>
                 `;
        tool.open(function(){
            let param = {
                    title:'选择链接页面对应映射的字段',
                    area:'600px',
                    content:`<div class="add_btn_option" style="padding:10px;">${html}</div>`,
                    components:{OrderCheck},
                    context:{
                        data:self.target,
                        selConds:self.selConds,
                        submit_btn(){
                            let conds =param.selfData.selConds,tempRes=[];

                            for(let key in conds){
                                let cond=conds[key];
                                if(cond.length<0)continue;
                                for(let itemCond of cond){
                                    let item=null;
                                    for(let ori of self.result){
                                        if(ori.target.key == itemCond.key){item=ori;break;}
                                    }

                                    item= item || {source:'',target:itemCond};
                                    tempRes.push(item);
                                }
                            }
                           
                            self.result.splice(0,self.result.length);
                            for(let item of tempRes){
                                self.result.push(item);
                            }

                            param.close();
                        },
                        cancel_btn(){
                            param.close();
                        }
                    }
                };
            return param;
        }());
        //this.result.push({source:'',target:''});
      },
      delClick(index){
          this.result.splice(index,1);
      }
  },
  mounted(){
    let s=this;
    this.iTitle=this.title || this.iTitle;
    // if(this.result.length<=0){
    //     this.result.push({source:'',target:''});
    // }

    if(this.result.length>0){
        let selConds =_.object(..._.zip(..._.map(this.target,(t,index)=>{
            return ['mapFieldKey'+index,[]];
        })));

        for(let i=0;i<s.result.length;i++){
            selConds[`mapFieldKey${s.result[i].target.tableKey}${i}`].push(s.result[i].target);
        }
       this.selConds=selConds;
    }
  }
}
</script>

<style scoped lang="less">
   .ParamPass{
        border:1px solid #C0CCDA;
        border-radius:5px;
        position: relative;
        padding:10px;
   }
   .ParamPass .title{
        position: absolute;
        background-color: white;
        top: -10px;
        color: #333333;
        font-style: italic;
        font-size: 12px;
   }
   .ParamPass .line{
        margin-left: 220px;
        margin-right: 220px;
        height: 36px;
        line-height: 36px;
        position:relative;
   }
   .ParamPass .line:before{
        content: '';
        width: 100%;
        height: 2px;
        background-color: #5cb85c;
        position: absolute;
        top: 50%;
        margin-top: -1px;
   }
   .ParamPass .line .arrow{
        width: 0;
        height: 0;
        border-top: 5px solid transparent;
        border-left: 10px solid #5cb85c;
        border-bottom: 5px solid transparent;
        position: absolute;
        right: 0px;
        top: 50%;
        margin-top: -5px;
   }

   .ParamPass .addBtn{
        position: absolute;
        z-index: 100;
        right: 0px;
        top: 0px;
        width: 20px;
        height: 20px;
        background: linear-gradient(45deg,transparent 50%,#449d44 50%);
        line-height: 10px;
        border-top-right-radius: 5px;
   }
   .ParamPass .addBtn:hover{cursor:pointer;}
   .ParamPass .addBtn i{
        font-size:10px;
        margin-left:10px;
        color:white;
   }

   .ParamPass .delBtn{float:right;width:20px;line-height:36px;text-align:center;}
   .ParamPass .delBtn i{font-size:16px;}
   .ParamPass .delBtn i:hover{cursor:pointer;}
   .ParamPass .content{margin-right:0px;margin-bottom:10px;}
</style>
