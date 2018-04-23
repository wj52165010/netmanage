<!-- 运算符操作组件 -->
<template>
    <div class="operator_container">
        <el-dropdown trigger="click" @command="selItem">
          <span class="el-dropdown-link">
              <el-button>
              {{showName}}<i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
          </span>
          <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="0">等于</el-dropdown-item>
              <el-dropdown-item command="1">大于</el-dropdown-item>
              <el-dropdown-item command="2">小于</el-dropdown-item>
              <el-dropdown-item command="3">大于等于</el-dropdown-item>
              <el-dropdown-item command="4">小于等于</el-dropdown-item>
              <el-dropdown-item command="5">不等于</el-dropdown-item>
              <el-dropdown-item command="6">存在于</el-dropdown-item>
              <el-dropdown-item command="7">不存在于</el-dropdown-item>
              <el-dropdown-item command="8">模糊</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
export default {
  name: 'Operator',
  props:['data'],
  data () {
    return {
      showName:''
    }
  },
  mounted(){
        if(this.data && this.data.cond){
            let mapSign=['等于','大于','小于','大于等于','小于等于','不等于','存在于','不存在于','模糊'];
            let letterSign=['eq','gt','lt','gte','lte','neq','in','not_in','like'];
            let mapCondSign=['=','>','<','>=','<=','!=','in','!in','like'];
            this.data.cond=this.data.cond || '0';
            this.showName=mapSign[this.data.cond];
            this.data.condSign=mapCondSign[this.data.cond];
            this.data.condLetter=letterSign[this.data.cond];
        }
  },
  methods:{
      selItem(command){
          let mapSign=['等于','大于','小于','大于等于','小于等于','不等于','存在于','不存在于','模糊'];
          let letterSign=['eq','gt','lt','gte','lte','neq','in','not_in','like'];
          let mapCondSign=['=','>','<','>=','<=','!=','in','!in','like'];
          this.showName=mapSign[command];
          this.data.cond=command;
          this.data.condSign=mapCondSign[command];
          this.data.condLetter=letterSign[command];
      }
  }
}
</script>

<style scoped lang="less">
  .operator_container{width:100%;height:100%;}
</style>
