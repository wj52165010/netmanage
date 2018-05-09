<!-- 数据源类型管理组件 -->
<template>
    <div class="KindManage">
        <!--新增栏-->
        <div class="add_bar">
            <span class="title">添加分类</span>
            <el-input style="display:inline-block;" v-model="addName" placeholder="请输入分类名称"></el-input>
            <el-button @click="SetIcon()"><i :class="icon"></i></el-button> 
            <el-button type="primary" @click="addItem()" :disabled="!addName">添加</el-button>
        </div>

        <!--列表栏-->
        <div class="list">
            <Scroll :store="store" :listen="data">
                <div name="KindManage_list">
                    <div class="item" v-for="(d,i) in data" :dataid="d.id">
                        <span class="name">{{i+1}}.{{d.title}}</span>
                        <!--操作栏-->
                        <div class="option_bar">
                            <span class="icon" style="margin-right:10px;" @click="removeItem(d.id,i)" v-show="d.isDel">
                                <span style="font-size:12px;font-style:italic;">删除</span>
                            </span>
                            <span class="icon" v-show="i!=0" @click="changeSort(i)"><i class="fa fa-arrow-up"></i></span>
                            <span class="icon" v-show="i!=data.length-1" @click="changeSort(i,true)"><i class="fa fa-arrow-down"></i></span>
                        </div>
                    <div>
                </div>
            </Scroll>
        </div>
    </div>
</template>

<script>
import Scroll from 'components/scroll'
import IconSelector from 'components/IconSelector'
import {GetMenuKind,AddMenuKind,DelMenuKind,OrderMenuKind} from '../../store/mutation-types'

import '../../js/dragSort.js'
export default {
  name: 'KindManage',
  props:['store'],
  components:{Scroll},
  data () {
    return {
      data:[],
      sortIns:null,
      addName:'',
      icon:'fa fa-navicon'
    }
  },
  watch:{
      data(){
          if(!this.sortIns)return;
          this.$nextTick(()=>{
            this.sortIns.reload();
          });
      }
  },
  mounted(){
      let s=this;
      this.$store=this.$store || this.store;
      this.data=this.$store.getters.MenuKind;
    

      this.sortIns = $('div[name="KindManage_list"]').dragsort({
        columns:1,
        remove:()=>{
        },
        mouseup:(els)=>{
            s.data=_.chain(els).map(i=>{return $(i).attr('dataid')}).compact().map((val,i)=>{

                return _.find(s.data,d=>d.id==val);
            }).value();
        }
    });
  },
  methods:{
      //该改单击项位置
      //i:单击项现在位置索引
      //blnDown:是否向下移动
      changeSort(i,blnDown){
          let cloneData =tool.Clone(this.data[i]);
          this.data.splice(i,1);

          if(!blnDown){//向上移动   
            this.data.splice(i-1,0,cloneData);
          }else{//向下移动
            this.data.splice(i+1,0,cloneData);
          }
          
          //保存顺序
          this.$store.dispatch(OrderMenuKind,_.pluck(this.data,'id'));

      },
      //设置图标
      SetIcon(){
          let store=this.$store;
          let s=this;
          tool.open(function(store,icon,params){
            let ins={
            title:'图标选择',
            area:['80%','80%'],
            offset:'50px',
            components:{
                IconSelector
            },
            context:{
                store:store,
                icon:icon,
                ok_btn(){
                    params.icon=ins.$vm.$refs.iconSelector.value;
                    ins.close();
                },
                cancel_btn(){
                    ins.close();
                }
            },
            methods:{
                iconChange(value){
                        this.icon=value;
                }
            },
            content:`<div class="iconSelector_container">
                        <div class="icons">
                            <IconSelector ref="iconSelector" :store="store" :value="icon" v-on:iconChange="iconChange"></IconSelector>
                        </div>
                        <div class="option_bar">
                            <button type="button" class="btn btn-success" @click="ok_btn()">确定</button>
                            <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
                        </div>
                    </div>`,
            success(){
                setTimeout(()=>{ins.$vm.$refs.iconSelector.reloadSly();},500);
            }
            };

            return ins;
        }(store,s.icon,s));
      },
      //添加类型
      addItem(){
          if(!this.addName)return;
          this.$store.dispatch(AddMenuKind,{title:this.addName,icon:this.icon}).then(res=>{
              if(!tool.msg(res,'添加成功,请刷新页面!','添加失败!'))return;

              this.data.push({id:res.biz_body.id,icon:this.icon,title:this.addName,isDel:1});
              this.addName=''
          });
        
      },
      //删除类型
      removeItem(id,i){
        this.$store.dispatch(DelMenuKind,id).then(res=>{
            if(!tool.msg(res,'删除成功,请刷新页面!','删除失败!'))return;
            this.data.splice(i,1);
        });
      }
  }
}
</script>

<style scoped lang="less">
 @import "../../css/variables.less";
 .KindManage{width:100%;height:100%;}

 @addH:50px;
 .add_bar{height:@addH;line-height:@addH;text-align:center;.border('bottom');}
 .add_bar .title{font-style:italic;margin-right:5px;}

 .list{height:~'calc(100% - @{addH})';width:100%;}
 @itemH:40px;
 .list .item{height:@itemH;line-height:@itemH;padding:0px 10px;.border('bottom');width:100%;}
 .list .item:hover{cursor:pointer;}
 .list .item .name{font-style:italic;}
 .list .item .option_bar{float:right;height:@itemH;line-height:@itemH;margin-right:10px;}
 .list .item .option_bar .icon{color:black;}
 //.list .item .option_bar .icon:hover{color:@Font_Hover_Col !important;}

 html{.TCol(~".list .item .option_bar .icon:hover");}

 //图标选择器样式
  @optionBarH:50px;
  .iconSelector_container{width:100%;height:100%;padding:10px;}
  .iconSelector_container .option_bar{height:@optionBarH;width:100%;text-align:right;line-height:@optionBarH;}
  .iconSelector_container .icons{height:~"calc(100% - @{optionBarH})";width:100%;position: relative;}
  .iconSelector_container .option_bar .btn-success{background-color: @btn_Bg_Col_hover_6;}
</style>
