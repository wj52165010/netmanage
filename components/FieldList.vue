<!-- 字段列表组件 -->
<template>
    <table class="fieldList table table-striped table-hover table-condensed" style="border-collapse: collapse;">
        <thead v-show="blnshow()"><tr>
            <th v-if="!noCheckBox" style="width:30px;" class="checkIcon" :class="{active:blnAllCheck}"><i class="fa" :class="{'fa-square-o':!blnAllCheck,'fa-check-square-o':blnAllCheck}" @click="allCheck_click"></i></th>
            <th style="width:150px;" class="text-center">名称</th>
            <th style="width:160px;" class="text-center">表名</th>
            <th style="width:160px;" class="text-center">字段名</th>
            <th>描述</th>
            <th class="text-center" style="width:150px;">关联操作</th>
        </tr></thead>
        <tbody><tr v-for="item in data">
            <td v-if="!noCheckBox" class="checkIcon" :class="{active:blnCheck(item)}"><i class="fa" :class="{'fa-square-o':!item.c_sel,'fa-check-square-o':item.c_sel}" @click="specialCheck_click(item)"></i></td>
            <td class="text-center">{{item.name}}</td>
            <td class="text-center">{{extraProp.tableKey}}</td>
            <td class="text-center">{{item.key}}</td>
            <td>{{item.desc}}</td>
            <td class="text-center" style="color:gray;">
                <el-tooltip v-for="action in (actions || [])[item.key]" style="margin-right:5px;" class="item" effect="light" :content="action.name" placement="top">
                    <i :class="action.icon" />
                </el-tooltip>
            </td>
        </tr></tbody>
    </table>
</template>

<script>
import Vue from 'vue'
import {BODY_RESIZE} from '../store/mutation-types'
// import {tool} from '../js/tool.js'
let sly=null;//导航栏插件实例
export default {
  name: 'FieldList',
  props:['data','extraProp','actions'],
  data () {
    return {
      blnAllCheck:false,//是否全部选中
      noCheckBox:false
    }
  },
  watch:{
      data(){
            let blnAllcheck=true,self=this;
            for(let key in this.data){
                let item=self.data[key];
                Vue.set(item,'c_sel',false);
                if(self.extraProp.selData){
                    for(let selItem of self.extraProp.selData){
                        if(selItem.key == item.key && selItem.tableKey == item.tableKey){item.c_sel=true;break;}
                    }
                }
                if(blnAllcheck){
                    blnAllcheck=item.c_sel;
                }
            }
            this.blnAllCheck=blnAllcheck;
      }
  },
  methods:{
    blnshow(){
        var hasProp = false;  
        for (var prop in this.data){  
            hasProp = true;  
            break;  
        } 
        return hasProp;
    },
    blnCheck(item){
        let res=item.c_sel;
        if(!res){
            for(let selItem of this.extraProp.selData){
                if(selItem.key == item.key && selItem.tableKey == item.tableKey){res=true;break;}
            }
        }
        return res;
    },
    //全选按钮单击事件
    allCheck_click(){
        let self=this;
        let oriVal = self.blnAllCheck;
        for(let key in this.data){
            let item=self.data[key];
            let sel=!!item.c_sel;
            if(sel!=oriVal){continue;}
            self.specialCheck_click(item);
        }

        this.blnAllCheck=!oriVal;
    },
    //个别项按钮单击事件
    specialCheck_click(item){
        let tempItem=null,self=this;
        for(let key in self.data){
            let bindItem=self.data[key];
            if(bindItem.key == item.key && bindItem.tableKey == item.tableKey){tempItem=bindItem;break;}
        }
        if(!tempItem){return 0;}

        if(!tempItem.c_sel){
            let res=true;
            for(let selItem of self.extraProp.selData){
                if(selItem.key == tempItem.key && selItem.tableKey == tempItem.tableKey){res=false;break;}
            }
            Vue.set(tempItem,'c_sel',res);
            this.$emit('triggerEvent','filedChange',tempItem);
        }else{
            tempItem.c_sel=!tempItem.c_sel;
            this.$emit('triggerEvent','filedChange',tempItem);
        }
        //设置全选按钮是否被选中
        if(!item.c_sel){this.blnAllCheck=false;}
        if(item.c_sel){
            let blnAllcheck=true;
            for(let key in this.data){
                let item=self.data[key];
                if(!item.c_sel){
                    blnAllcheck=false;
                    break;
                }
            }
            self.blnAllCheck=blnAllcheck;
        }
    },
  },
  mounted(){
    this.noCheckBox=!this.extraProp?false:!!this.extraProp.noCheckBox;
  }
}
</script>

<style scoped lang="less">
    @import "../css/variables.less";
    @itemH:40px;
   .fieldList .item{height:@itemH;.border('bottom');}
   .fieldList .checkIcon{text-align:right;cursor:pointer;font-size:24px;color:shade(@BgCol,30%);}
   .fieldList th,.fieldList td{padding:0px;line-height:@itemH;}
   .fieldList .active{color:@Font_Hover_Col;background-color:transparent !important;}
   .fieldList .option i{cursor:pointer;}
   .fieldList.table > thead > tr > th{border-bottom: 1px solid #ddd !important;}
</style>
