<!-- 头部组件 -->
<template>
    <div class="menu_btn" id="test1">
      
    </div>
</template>

<script>
import { mapState,mapMutations} from 'vuex'
import MenuBtn from '../js/menuBtn_d3'

export default {
  name: 'MenuBtn',
  data () {
    return {
      
    }
  },
  mounted(){
    let m=new MenuBtn(60,60,[{name:'测试1',value:1},{name:'测试2',value:1},{name:'测试3',value:1},{name:'测试4',value:1},{name:'测试5',value:1}]);
  },
  computed:{
   
  },
  methods:{

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
    .circle,.close_circle{fill:deepPink;cursor:pointer;}
    .menuItem:hover > .solidArc{
        fill: #333 ;
    }

    .menuItem:hover > .title{fill:white;cursor:pointer;}

    .solidArc {
        -moz-transition: all 0.3s;
        -o-transition: all 0.3s;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
        fill: rgba(255, 255, 255, .8);
        stroke: #ddd;
        cursor:pointer;
    }
</style>
<style scoped lang="less">
  .menu_btn{width:60px;height:60px;position:absolute;top:50%;left:50%;
  transform:translate(-10,-10);
  -moz-transform:translate(-10,-10);
  -wekit-transform:translate(-10,-10);}
</style>
