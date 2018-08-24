<!-- 列表体插件 -->
<!--<template>
    <div class="tableBbody">
       <slot></slot>
    </div>
</template>-->

<script>
import Vue from 'vue'
import cRow from './tableRow'
import Scroll from 'components/scroll'
import Loading from 'components/Loading'

export default {
  name: 'v-table-body',
  props:['listen','store','blnLoading'],
  data () {
    return {
      info:'暂无数据'
    }
  },
  watch:{
    listen(){
      this.showInfo();
    },
    blnLoading(){
      this.$refs.loading.blnShow(this.blnLoading);
    }
  },
  mounted(){
    this.$refs.loading.blnShow(false);
    this.showInfo();
  },
  render: function (createElement) {

    let rows=_.filter(this.$slots.default,d=>d.tag);

    return createElement(
      'div', 
      {
        class:{
          tableBbody:true,
        }
      },
      [
        createElement(Scroll,
          {
            props:{ listen:this.listen || []},
            ref:'scroll'
          },
          _.map(rows,(r,i)=>createElement(cRow,{
              props:{
                store:this.store
              },
              on:{
                click:(e)=>{this.rowClick(e,r,i)}
              },
              class:{
                rowClick:r.componentOptions.listeners && r.componentOptions.listeners.click
              }
            },
            rows[i].componentOptions.children)
          )
        ),
        createElement(Loading,{ref:'loading'}),
        createElement('div',{
          ref:'info',
          style:{
            'width':'100%',
            'height':'100%',
            'text-align':'center',
            'display':'table',
          }
        },[
          createElement('div',{
            style:{
              'display':'table-cell',
              'vertical-align': 'middle'
            }
          },this.info)
        ])
      ]
      
    )
  },
  methods:{
    showInfo(){
      if(this.listen && this.listen.length>0){
        $(this.$refs.info).hide();
      }else{
        $(this.$refs.info).show();
      }
    },
    //行单击事件
    rowClick(e,r,index){
      let listeners =r.componentOptions.listeners;
      listeners && listeners.click && listeners.click(index);
    }
  }
  
}
</script>
<style lang="less">
  @import "../../css/variables.less";
  @import './common.less';
  .tableBbody{width:100%;height:100%;background-color:@tableBodyBG;position:relative;}
  html{.TColLighten(~".tableBbody .table-row:nth-of-type(even)",90%,'bg');}

  .tableBbody .rowClick{cursor:pointer;}

  .tableBbody .rowClick:hover{color:white;background-color:#777777;}

</style>

