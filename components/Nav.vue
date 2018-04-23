<!-- 导航组件 -->
<template>
    <div class="nav">
        <ul class="root">
            <li v-for="item in data">
                <i :class="item.icon"></i>
                {{item.name}}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
  name: 'Nav',
  data () {
    return {
      data:[
        {name:'管理',icon:'fa fa-search'},
        {name:'查询',icon:''},
        {name:'实践',icon:''},
        {name:'报表',icon:''}
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @backgroundCol_front:#2f4157;
  @backgroundCol_back:#154d72;
  .nav{
       background:@backgroundCol_front;
       background:linear-gradient(to bottom, @backgroundCol_front 0%,@backgroundCol_front 60%,@backgroundCol_back 100%);
       height:100%;
       width:100%;
      }
  .nav .root{color:white;list-style: none;padding: 0px;}
</style>
