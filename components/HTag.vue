<!--水平Tag插件-->
<template>
    <div class="HTag">
        <div class="tag_header">
            <div v-for="(t,i) in tags" class="tag_item" :class="{active:curIndex==i}" @click="tagClick(i,t)" :title="t.tip || ''">
                <i :class="t.icon" style="margin-right:5px;"></i>{{t.name}}
            </div>
        </div>
        <div v-for="(t,i) in tags" v-show="curIndex==i" class="item" :class="{fadeIn:curIndex==i}">
            <slot :name="'t'+i"></slot>
        </div>
    </div>
</template>

<script>
export default {
  name: 'HTag',
  props:['tags','index'],
  data () {
    return {
        curIndex:0
    }
  },
  watch:{
      index(){
          this.curIndex=this.index;
      }
  },
  mounted(){
      this.curIndex=this.index==undefined?this.curIndex:this.index;
  },
  methods:{
    tagClick(i,d){
        if(d.disable){return;}
        this.curIndex=i;
        this.$nextTick(()=>{
            this.$emit('change',i);
        });
    }
  }
}
</script>

<style scoped lang="less">
 @import "../css/variables.less";
 .HTag{width:100%;height:100%;}
 @tagH:40px;
 .HTag .tag_header{height:@tagH;width:100%;text-align:left;.border('bottom');}

 .HTag .tag_item{
     display:inline-block;height:@tagH/4*3;line-height:@tagH/4*3;.border('');border-bottom:none;padding:0px 10px;
     margin-top:@tagH/4*1;margin-left:10px;font-size:12px;position:relative;border-top-left-radius:5px;border-top-right-radius:5px;
     color:@FontCol;
    }
 .HTag .tag_item.active:before{content:'';width: 100%;height: 2px;position: absolute;background-color: white;left: 0px;bottom: -1px;}
 .HTag .tag_item:hover{cursor:pointer;color:white;}
 html{.TCol(~".HTag .tag_item:hover",'bg');}
 .HTag .tag_item.active:after{content:'';width: 100%;height: 2px;position: absolute;left:0px;top:0px;}
 html{.TCol(~".HTag .tag_item.active:after",'bg');}

 .HTag .item{height:~'calc(100% -  @{tagH})';width:100%;}
</style>

