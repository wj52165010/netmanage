<!-- 测试组件 -->
<template>
    <div class="testCom">
        <div v-for="i in 4000" style="width:100%;background:blue;">
          <ul>
            <li class="list-group-item node-" data-nodeid="15" style="color:undefined;background-color:undefined;">
            <span class="indent"></span><span class="indent"></span><span class="icon glyphicon"></span><span class="icon node-icon"></span><span class="icon check-icon uncheckIcon_tree"></span>安阳农行</li>
          </ul>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import baseCom from './baseCom'

@Component({
    props:{propMessage:String}
})

export default class testCom extends baseCom {
  constructor() {
    super();
  }
  msg=123
  mounted(){
    $(this.$el).on('click',function(){
      console.log(2);
    });
    let a=new testCom();
    a.test();
    
  }
  test(){
    console.log(1);
    //console.log(super.test());
  }
}
</script>

<style scoped lang="less">
  
</style>
