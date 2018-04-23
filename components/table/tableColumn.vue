<!-- 列表列插件 -->
<script>
export default {
  name: 'v-table-column',
  props:['label'],
  data () {
    return {
    }
  },
  computed:{
    owner(){
      let parent=this.$parent;
      return parent;
    }
  },
  methods:{
  
  },
  mounted(){
    this.customRender = this.$options.render;
    const owner = this.owner;
    const parent = this.$parent;
    let _self=this;
    let columnIndex;

    columnIndex = [].indexOf.call(parent.$refs.hiddenColumns.children, this.$el);

    this.renderCell = function(h, data) {
      if (_self.$vnode.data.inlineTemplate) {
        renderCell = function() {
          data._self = _self.context || data._self;
          if (Object.prototype.toString.call(data._self) === '[object Object]') {
            for (let prop in data._self) {
              if (!data.hasOwnProperty(prop)) {
                data[prop] = data._self[prop];
              }
            }
          }
          // 静态内容会缓存到 _staticTrees 内，不改的话获取的静态数据就不是内部 context
          data._staticTrees = _self._staticTrees;
          data.$options.staticRenderFns = _self.$options.staticRenderFns;
          return _self.customRender.call(data);
        };

        return h('div',{style:{height:'100%'}},[renderCell(h, data)]);
      }
    };

    this.owner.store.comit('insertColumn',this,columnIndex);
  }
}
</script>
<style scoped lang="less">
  .table-column{display:inline-block;}
</style>
