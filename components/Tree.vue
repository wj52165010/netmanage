<!-- 树形插件组件 -->
<template>
    <div class="Tree">
        <Scroll :listen="treeData">
            <template v-for="d in treeData">
                <div class="node" :style="{'margin-left':d.nodeDeep*15 +'px'}" v-show="!d.blnHide">
                    <span v-if="!hasPlus?false:!hasPlus(d)" style="display:inline-block;width:11px;">&nbsp;</span>
                    <i class="fa fa-plus" v-if="!hasPlus?true:hasPlus(d)" :class="{'fa fa-plus':!d.export,'fa fa-minus':d.export}" @click="NodeExpanded(d)"></i> 
                    <i class="fa fa-spinner fa-pulse" v-if="d.isLoadingData"></i>
                    <span :class="{uncheckIcon_tree:!d.checked,checkIcon_tree:d.checked}" @click.stop="check(d)"></span>
                    {{d.name}}
                </div>
            </template>
        </Scroll>
    </div>
</template>

<script>
import Vue from 'vue'
import {GET_PLACE} from '../store/mutation-types'
import Scroll from 'components/scroll'
export default {
  name: 'Tree',
  props:['data','hasPlus','checkNode'],
  components:{Scroll},
  data () {
    return {
      treeData:[],
      
    }
  },

  watch:{
    data:{
        deep:true,
        handler:function(){
            let temp=[],s=this;
            let checkNodeId=s.checkNode && s.checkNode.length>0?','+_.map(s.checkNode || [],m=>m.code).join(',')+',':'';

            Fx.recur(this.data,'child',function(d,i,parent){
                d.parentCode=parent?parent.code || '':'';

                if(d.checked==undefined){
                    Vue.set(d,'checked',checkNodeId.indexOf(','+d.code+',')>=0 || checkNodeId.indexOf(','+d.parentCode+',')>=0);
                }

                if(d.isLoadingData==undefined){
                    Vue.set(d,'isLoadingData',false);
                }


                if(d.export==undefined){
                    Vue.set(d,'export',checkNodeId.indexOf(d.code.replace(/[0]+$/g,''))>=0 && checkNodeId.indexOf(','+d.code+',')<0);
                }

                if(d.blnHide==undefined){
                    Vue.set(d,'blnHide',false);
                }
                if(parent){
                    d.blnHide=!parent.export;
                }

                temp.push(d);
                //console.log(tool.Clone(d));
            },()=>{
                this.treeData=temp;
                //console.log(tool.Clone(temp));
            });
        }
        
    },
    treeData(){
      let cludsId=[],data=[];
        
      let checkedData =Fx.recurByArr(this.treeData,t=>{
        if(t.checked){
            if(cludsId.indexOf(t.parentCode)<0){
                data.push(t);
            }
            cludsId.push(t.code);
            
        }
      },()=>{
        let groupData = _.groupBy(data,d=>d.type);

        let res={
            regions:groupData[1] || [],
            sites:groupData[3] || [],
            polices:groupData[2] || []
        }

        this.$emit('dataChange',res);
      });
    }
  },
  mounted(){
    
  },
  methods:{
    //取消选中的节点
    checkOut(id){
        let d=_.find(this.treeData,t=>t.code==id);
        if(!d) return;
        this.check(d);
    },
    //节点展示函数
    NodeExpanded(d){
        d.export=!d.export;
        if(!d.export ||(d.child && d.child.length>0)) return;

        d.isLoadingData=true;
        this.$emit('NodeExpanded',d);
    },
    //复选框单击事件
    check(d){
        d.checked=!d.checked;
        if(d.checked){//选中
         Fx.recur(d.child || [],'child',function(d,i,parent){
             d.checked=true;
         });

        }else{//不选中
         Fx.recur(d.child || [],'child',function(d,i,parent){
             d.checked=false;
         });
        }

        //判断父级节点是下是否只节点被全部选中
        Fx.recurByFunc(this.treeData,d,(arr,d)=>{
           let parent = _.find(arr,a=>a.code==d.parentCode);
           if(parent && parent.child){
               if(_.find(parent.child,c=>c.checked==false)){
                   parent.checked=false;
               }else{
                   parent.checked=true;
               }
           }

           return parent;
        });
    }
  }
  
}
</script>

<style scoped lang="less">
 .Tree{width:100%;height:100%;}
 .child,
 .node{
    line-height:30px;padding:5px 10px;
 }
 .child:hover,
 .node:hover{cursor:pointer;background:#F5F5F5;}


</style>
