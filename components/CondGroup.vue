<!-- 条件组组件(用于配置页面) -->
<template>
    <div class="condGroup">
        <el-select class="firstCond" v-model="firstVal" placeholder="请选择" @change="firstChange">
           <el-option
            v-for="(item,index) in data"
            :label="item.name"
            :value="item">
            </el-option>
        </el-select>
        <condition class="groupCondition" :data="group"></condition>
        <el-select class="scendCond" v-model="scendtVal" placeholder="请选择" @change="scendChange">
            <el-option
            v-for="(item,index) in data"
            :label="item.name"
            :value="item">
            </el-option>
        </el-select>
        <div class="clearfix"></div>
    </div>
</template>

<script>
// import {tool} from '../js/tool.js'
export default {
  name: 'CondGroup',
  props:['items','group'],
  components:{
    condition:{
        props:['data'],
        template:`<el-dropdown trigger="click" @command="selItem">
                    <span class="el-dropdown-link">
                        <el-button>
                        {{showName}}<i class="el-icon-caret-bottom el-icon--right"></i>
                        </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="0">且</el-dropdown-item>
                        <el-dropdown-item command="1">或</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
        `,
        data(){
            return {
                showName:''
            }
        },
        mounted(){
            let mapSign=['且','或'];
            if(this.data && this.data.cond>=0){
                this.showName=mapSign[this.data.cond];
            }
        },
        methods:{
            selItem(command){
                let mapSign=['且','或'];
                this.showName=mapSign[command];
                this.$parent.$data.condition=command;
                this.$parent.group.cond=command;
                this.$parent.$emit('selChange');
            }
        }
    }
  },
  data () {
    return {
      firstVal:'',
      scendtVal:'',
      condition:-1,
      data:[]
    }
  },
  methods:{
      //第一个条件选中事件
      firstChange(val){
          let self=this;
          if(typeof(val)=='string'){
              for(let item of self.data){
                  if(item.name==val){val=item;break;}
              }
          }
          this.group.firstVal=val;
          this.$emit('selChange');
          if(val.type=="group"){
              val.relativeGroup=val.relativeGroup || [];//相关联的分组
              val.relativeGroup.push(this.group);
              val.reCal();
          }
      },
      //第二个条件选中事件
      scendChange(val){
          let self=this;
          if(typeof(val)=='string'){
              for(let item of self.data){
                  if(item.name==val){val=item;break;}
              }
          }
          this.group.scendtVal=val;
          this.$emit('selChange');
          if(val.type=="group"){
              val.relativeGroup=val.relativeGroup || [];//相关联的分组
              val.relativeGroup.push(this.group);
              val.reCal();
          }
      },
      //排除不可选的项
      excludeItem(){
          let self=this,index=-1,relativeGroup=[];
          self.data=[];
          let getRelativeGroup=function(group,result){
              result.push(group);
              let groups=group.relativeGroup || [];
              for(let item of groups){
                getRelativeGroup(item,result);
              }
          };
          getRelativeGroup(self.group,relativeGroup);

          for(let i=0;i<self.items.length;i++){
             let blnSkip=false; 
             for(let item of relativeGroup){
                 if(self.items[i]==item){blnSkip=true;break;}
             }

             if(blnSkip){continue;}
             self.data.push(self.items[i]); 
          }
      }
  },
  watch:{
      'items'(){
          this.excludeItem();
      }
  },
  mounted(){
      this.excludeItem();
      this.group.reCal=this.excludeItem;
      //console.log(tool.Clone(this.group));
      this.firstVal=this.group.firstVal || '';
      this.scendtVal=this.group.scendtVal || '';

      
  }
}
</script>
<style lang="less">
    .firstCond .el-input__inner{border-right: 0px !important;border-top-right-radius: 0px !important;border-bottom-right-radius: 0px !important;}
    .groupCondition .el-button{border-radius: 0px !important;height:36px;}
    .scendCond .el-input__inner{border-left: 0px !important;border-bottom-left-radius: 0px !important;border-top-left-radius: 0px !important;}
</style>
<style scoped lang="less">
  .condGroup{display:inline-block;};
  .firstCond{float:left;width: 100px;}
  .groupCondition{float:left;}
  .scendCond{float:left;width:100px;}
</style>
