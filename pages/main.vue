<!-- 主页组件 -->
<template>
    <div class="main">
      {{title}}
      {{content}}
      <button @click="update">修改</button>
      <div :class="{menu_container:true,active:menu_active}">
        <ul>
          <li>123</li>
          <li>123</li>
          <li>123</li>
          <li>123</li>
          <li>123</li>
          <li>123</li>
          <li>123</li>
          <li>123</li>
          <li>123</li>
          <li>123</li>
          <li>123</li>
          <li>123</li>
          <li>123</li>
          <li>123</li>
          <li>123</li>
          <li>123</li>
          <li>123</li>
          <li>123</li>
          <li>123</li>
          <li>123</li>
        </ul>
      </div>
    </div>
</template>

<script>
import { mapState,mapMutations} from 'vuex'
import {UPDATE_TO_MAIN_CONTENT} from '../store/mutation-types'

export default {
  name: 'Main',
  props:['title'],
  data () {
    return {
      menu_active:false,
      isMenu_item_click:false
    }
  },
  mounted(){
    
  },
  computed:{
    ...mapState({content:state=>state.main.content})
  },
  methods:{
    update(){
      this.$store.commit(UPDATE_TO_MAIN_CONTENT,'123');
    }
  }
}
</script>
<style scoped lang="less">
  .main{width:100%;height:100%;}
  .menu_container{
    position: fixed;
    bottom: 0px;
    background-color: #343c55;
    width: 100%;
    height: 100px;
    transform: translate(100%);
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.05s;
  }
  .menu_container.active{
     transform: translate(0%);
  }
  .menu_container ul{color:#9b9a99;list-style:none;height:100%;padding:10px 0px;transform: translate(100%); transition: all .5s cubic-bezier(.82,.01,.37,1.17) 0.55s;}
  .menu_container ul li{float:left;height:100%;width:80px;margin-right:5px;background-color:#f9f9f9;border-radius:5px;}
  .menu_container.active ul{transform: translate(0%);cursor:pointer;}
</style>
