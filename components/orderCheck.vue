<!-- 顺序选择插件 -->
<template>
    <div class="orderCheck" v-if="items.length>0">
       <el-checkbox-group v-model="checkList">
            <el-checkbox v-for="(item,index) in items" :checked="selItemIndex[index]" :label="item.name" v-on:change="change($event,index)"></el-checkbox>
        </el-checkbox-group>
    </div>
</template>

<script>
import Vue from 'vue'
// import {tool} from '../js/tool.js'
export default {
  name: 'OrderCheck',
  props:['items','res','id'],
  data () {
    return {
      checkList:[],
      selItems:[],
      selItemIndex:{},
      blnCheck:true
    }
  },
  created(){
    let self=this;
    for(let i in this.items){
        self.selItemIndex[i]=false;
    }
    
    if(this.res){
        if(this.res[this.id]){
            this.selItems=this.res[this.id];
        }
        this.res[this.id]=this.selItems;
    }

    let delVals=this.res[this.id];
    if(delVals.length>0 && self.id.indexOf("commonField")<0){
        for(let i=0;i<delVals.length;i++){
            self.selItemIndex[i]=true;
            //console.log(self.selItemIndex[i]);
        }
    }else if(delVals.length>0 && self.id.indexOf("commonField")>=0){
        for(let i=0;i<delVals.length;i++){
            self.selItemIndex[i]=true;
        }
    }
  },
  mounted(){
    //设置选中项选中
    
    //console.log(this.res);
  },
  methods:{
      change(e,index){
          this.blnCheck=false;
          let self=this;
          let blnChecked =e ? e.target.checked:true;
          if(blnChecked){
              this.selItems.splice(0,this.selItems.length);
              for(let i in this.items){
                  if(i>index){break;}
                  self.selItems.push(this.items[i]);
                  self.selItemIndex[i]=true;
              }
          }else{
              for(let i in this.items){
                if(i<index){continue;}
                self.selItems.splice(index,1);
                self.selItemIndex[i]=false;
              }
          }
          
          //console.log(tool.Clone(this.selItems));
      }
  }
}
</script>
<style scoped lang="less">
  .orderCheck{
      display:inline-block;
      padding: 10px 10px 5px;
      border: 1px solid darkgrey;
      border-radius: 10px;
      margin-bottom:10px;
  }
  .orderCheck label{
    font-weight:300 !important;
  }
  .orderCheck label span{font-size:12px !important;}
</style>
