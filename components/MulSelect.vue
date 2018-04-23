<!-- 多选组件 -->
<template>
    <div class="MulSelect">
        <div class="mul_container">
            <div class="icon_container">
                <div class="icon_btn" @click="add()"><i class="fa fa-plus" /></div><div class="icon_btn" @click="select()"><i class="fa fa-pencil" /></div>
            </div>
            <div class="info">
                <div class="item" v-for="(item,index) in data"><div class="title">{{item.name}}</div><div class="icon" @click="delItem(index)"><i class="fa fa-remove" /></div></div>
            </div>
        </div>
    </div>
</template>

<script>
import cInput from 'components/Input'
export default {
  name: 'MulSelect',
  props:['selItems','keyid','defaultVal','blnDel','firstPlace','secondPlace','addFunc'],
  data () {
    return {
      data:[]
    }
  },
  mounted(){
    this.data=this.defaultVal || [];
  },
  methods:{
    delItem(index){
        this.data.splice(index,1);
    },
    add(){
        if(this.addFunc){
            this.addFunc();
            return;
        }

        let self=this;
        tool.open(function(){
            let html=`
                        <cInput :label="firstPlace" @change="inputChange" />
                        <cInput :label="secondPlace" @change="noteChange" />
                        <div style="margin-top:10px; text-align:right;">
                            <button type="button" class="btn btn-success" style="font-size:12px;"  @click="submit">确定</button> 
                            <button type="button" class="btn btn-default" style="font-size:12px;" @click="cancel">取消</button>
                        </div>
                     `;
            let param={
                title:'添加',
                area:'300px',
                components:{cInput},
                content:`<div style="width:100%;height:100%;overflow:hidden;padding:10px;">
                            ${html}
                         </div>`,
                context:{
                   firstPlace:self.firstPlace || '请输入名称',
                   secondPlace:self.secondPlace || '请输入描述',
                   val:'',
                   note:'',
                   submit(){
                       if(!param.selfData.val){param.close()}
                       self.data.unshift({name:param.selfData.val,note:param.selfData.note});
                       self.$emit('add',self.data);
                       param.close();
                   },
                   cancel(){
                       param.close();
                   },
                   inputChange(val){
                       param.selfData.val=val;
                   },
                   noteChange(val){
                       param.selfData.note=val;
                   }
                }
            };

            return param;
        }());
    },
    select(){
        let self=this;
        tool.open(function(){
            let html=`<div v-for="(item,index) in data" @click="itemClick(item)" style="height:30px;line-height:30px;border-bottom:1px solid #e7eaec;font-size:12px;cursor:pointer;">
                        <div style="float:left;width:20px;text-align:center;">{{index+1}}.</div>
                        <div style="float:right;width:40px;text-align:center;" @click.stop="delClick(item)"><i v-show="blnShowGou(vals,item)" class="fa fa-check" style="margin-right: 10px;" /><i class="fa fa-remove" title="删除" v-if="blnDel && !item.blnNodel"></i></div>
                        <div style="margin-left:20px;margin-right:20px;">{{item.name}}</div>
                      </div>`;
            let param={
                 title:'选择',
                 area:'300px',
                 components:{cInput},
                 content:`<div style="width:100%;height:300px;">
                            <div style="height:268px;overflow-y:auto;">${html}</div>
                            <div style="text-align:center;">
                                 <button type="button" class="btn btn-success" style="font-size:12px;"  @click="submit">确定</button> 
                                 <button type="button" class="btn btn-default" style="font-size:12px;" @click="cancel">取消</button>
                            </div>
                         </div>`,
                 context:{
                    data:self.selItems,
                    vals:tool.Clone(self.data) || [],
                    blnDel:self.blnDel,
                    blnShowGou(vals,item){
                       return (','+_.map(vals,val=>{return val[self.keyid];}).join(',')+',').indexOf(','+item[self.keyid]+',')>=0;
                    },
                    itemClick(val){
                        let index=-1;
                        for(let i=0;i<param.selfData.vals.length;i++){
                            if(param.selfData.vals[i][self.keyid]==val[self.keyid]){index=i;break;}
                        }

                        if(index>=0){return param.selfData.vals.splice(index,1)}
                        param.selfData.vals.push(val);
                    },
                    delClick(item){
                        if(!self.blnDel || item.blnNodel){return;}
                        let index = _.findIndex(self.data,(val)=>{return val[self.keyid]==item[self.keyid];});
                        let selIndex=_.findIndex(self.selItems,(val)=>{return val[self.keyid]==item[self.keyid];});
                        self.data.splice(index,1);
                        self.selItems.splice(selIndex,1);
                        self.$emit('del',item);
                    },
                    submit(){
                        self.data=param.selfData.vals;
                        param.close();
                    },
                    cancel(){
                        param.close();
                    }
                 }
            };

            return param;
        }());
    }
  }
}
</script>

<style scoped lang="less">
  @import "../css/variables.less";
  .MulSelect{width:100%;height:100%;}
  @mulH:40px;
  .MulSelect .mul_container{height:@mulH;.border('bottom',#d2d2d2)}
  .MulSelect .mul_container .icon_container{float:right;width:60px;height:100%;}
  .MulSelect .mul_container .info{margin-right:60px;height:100%;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;}
  .MulSelect .mul_container .icon_container .icon_btn{display:inline-block;width:50%;height:100%;text-align:center;line-height:@mulH;cursor:pointer;}
  .MulSelect .mul_container .icon_container .icon_btn:hover{color:@btn_Bg_Col_6;}

  @titleW:80px;
  .MulSelect .mul_container .info .item{margin-top:5px;display:inline-block;height:@mulH/4*3;font-size:12px;.border('',@btn_Bg_Col_hover_1);border-radius:5px;overflow: hidden;margin-left:5px;}
  .MulSelect .mul_container .info .item .title{float:left;width:@titleW;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;line-height:@mulH/4*3;padding:0px 5px; }
  .MulSelect .mul_container .info .item .icon{margin-left:@titleW;width:20px;line-height:@mulH/4*3;text-align:center;.border('left',@btn_Bg_Col_hover_1);cursor:pointer;}
</style>
