<!-- 参数映射关系组件 -->
<template>
    <div class="MapRelation">
        <div class="title">{{iTitle}}</div>
        <div class="addBtn" @click="addClick()"><i class="fa fa-plus"></i></div>
        <div v-for="(item,index) in result">
            <div class="content">
                <!--左边选择项-->
                <div style="display:inline-block;float:left;">
                    <el-select v-model="item.source" placeholder="请选择">
                        <el-option
                        v-for="item in (source || [])"
                        :label="item.name"
                        :value="{key:item.fieldKey || item.key,fieldKey:item.fieldKey || item.key,tableKey:item.table || item.tableKey,name:item.name}">
                        <span style="float: left">{{ item.name }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.tableName }}</span>
                        </el-option>
                    </el-select>
                </div>
                
                <!--右边选择项-->
                <div style="display:inline-block;float:right;">
                    <el-select v-model="item.target" placeholder="请选择">
                        <el-option
                        v-for="item in (target || [])"
                        :label="item.name"
                        :value="{key:item.fieldKey || item.key,fieldKey:item.fieldKey || item.key,tableKey:item.table || item.tableKey,name:item.name}">
                        <span style="float: left">{{ item.name }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.tableName }}</span>
                        </el-option>
                    </el-select>
                </div>

                <div class="line"><div class="arrow"></div></div>
                <div class="clearfix"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'MapRelation',
  props:['defVal','source','target'],
  data () {
    return {
      iTitle:'映射关系',
      result:[
          {source:'',target:''}
      ],
    }
  },
  watch:{
      defVal(){
        console.log(tool.Clone(this.defVal));
        if(this.defVal && this.defVal.length>0){
            this.result=tool.Clone(this.defVal);
        }
      }
  },
  mounted(){
    if(this.defVal && this.defVal.length>0){
        this.result=tool.Clone(this.defVal);
    }
  },
  methods:{
    clear(){
        this.result=[{source:'',target:''}];
    },
    addClick(){
        this.result.push({source:'',target:''});
    }
  }
}
</script>

<style scoped lang="less">
.MapRelation{
    border:1px solid #C0CCDA;
    border-radius:5px;
    position: relative;
    padding:10px;
}
.MapRelation .title{
    position: absolute;
    background-color: white;
    top: -10px;
    color: #333333;
    font-style: italic;
    font-size: 12px;
}
.MapRelation .addBtn{
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

.MapRelation .line{
    margin-left: 220px;
    margin-right: 220px;
    height: 36px;
    line-height: 36px;
    position:relative;
}
.MapRelation .line:before{
    content: '';
    width: 100%;
    height: 2px;
    background-color: #5cb85c;
    position: absolute;
    top: 50%;
    margin-top: -1px;
}
.MapRelation .line .arrow{
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

.MapRelation .addBtn:hover{cursor:pointer;}
.MapRelation .addBtn i{
    font-size:10px;
    margin-left:10px;
    color:white;
}

.MapRelation .delBtn{float:right;width:20px;line-height:36px;text-align:center;}
.MapRelation .delBtn i{font-size:16px;}
.MapRelation .delBtn i:hover{cursor:pointer;}
.MapRelation .content{margin-right:0px;margin-bottom:10px;}
</style>
