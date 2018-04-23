<!-- 首页组件 -->
<script>
export default {
  name: 'Index',
  functional: false,
  data () {
    return {
      menus:[]
    }
  },
  mounted(){
     
  },
  render(h){
    let self=this;
    return h(
            'div',{'class':'index'},
            [
              h('mainPage', {props:{title:'测试'}})
            ]
            );
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .index{width:100%;height:100%;}
</style>
