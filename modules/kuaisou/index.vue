<!-- 快搜配置页面起始页 -->
<template>
    <div class="KSearchIndex">
        <!--配置文件展示区域-->
          <div class="setting">
            <!--标题栏-->
            <div class="title">
                <span class="name">快搜配置</span>
            </div>
            <!--数据为空时显示的内容-->
            <div class="empty" v-if="data.length<=0">
              <img src="../../assets/cry.png" style="width:50px;" />
              <span class="tipInfo">您还没有配置过快搜哦,您可以新建一个配置!</span>
              <div class="option"><button class="btn btn-primary" type="button" @click="add()">新建</button></div>
            </div>

            <!--配置项展示区域-->
            <div class="settingRegion" v-if="data.length>0">
              <!--内容展示-->
              <div class="content">
                <Scroll :listen="data">
                  <div class="item" v-for="(v,i) in data" :style="{'border-color':'black','box-shadow': v.keyid===(curSet || {keyid:''}).keyid?'1px 1px 5px #333333':''}" @click="selSet(v,i)">
                    <div class="item_container">
                      <div class="container">
                        <div class="name">{{v.name}}</div>
                      </div>
                      <div class="iden_container" v-show="v.isDefault">
                        <i class="fa fa-check iden" />
                      </div>
                    </div>
                    <div class="option_bar" @click.stop="noHandler()">
                        <div class="removeBtn" @click.stop="delItem(v,i)">
                          <i class="fa fa-remove" />
                        </div>
                    </div>
                  </div>
                </Scroll>
              </div>
              <!--操作展示-->
              <div class="option">
                <button class="btn btn-primary" type="button" @click="add()">新建</button>
                <button class="btn btn-info" type="button" :disabled="curSet && curSet.isAdd" @click="applySet()">应用</button>
              </div>
            </div>
          </div>

          <!--所选配置文件包含数据源源展示区域-->
          <div class="sources">
            <!--标题栏-->
            <div class="title">
                <span class="name">包含数据源</span>
                <span v-if="curSet">({{curSet.name}})</span>
            </div>
            <!--展示内容-->
            <div class="content">
              <Scroll :listen="(curSet || {souces:[]}).souces">
                <div class="item" v-for="s in (curSet || {souces:[]}).souces">
                  <!--标题栏-->
                  <div class="title">{{s.name}}</div>
                  <!--描述栏-->
                  <div class="desc">{{s.desc}}</div>
                </div>
              </Scroll>
            </div>
          </div>
    </div>
</template>

<script>
import InputDir from 'components/Input'
import Scroll from 'components/scroll'
import {Set_Setting_Obj,Clear_Set_Setting_Obj,GetSearch,DelSearch,UseSearch} from '../../store/mutation-types'
import * as d3 from 'd3'
import {scaleLinear,scaleSequential} from "d3-scale"
import { mapState,mapMutations} from 'vuex'

export default {
  name: 'KSearchIndex',
  components:{Scroll},
  data () {
    return {
      data:[],
      colorScale:function(val){//颜色伸缩尺子
         let scale= scaleSequential(d3.interpolateInferno);    
         let num=scaleLinear().domain([tool.Timestamp(new Date('2017-01-01')),tool.Timestamp(new Date('2040-01-01'))]).range([0,1]);
        return scale(num(val));
      }
    }
  },
  computed:mapState({
    curSet:state=>{
      return state.kuaisou.curSet;
    }
  }),
  mounted(){
    //获取配置数据
    this.$store.dispatch(GetSearch).then(res=>{
      this.data=_.map(res.biz_body,(b,i)=>{
        let oriObj=eval('('+b.originalObj+')');
        b.souces=oriObj.souces;
        b.pageLimit=oriObj.pageLimit;
        b.pages=oriObj.pages;

        if(b.isDefault){
          this.selSet(b,i);
        }

        return b;
      });

      this.$nextTick(()=>{
        //恢复之前选择的配置项
        if(this.curSet && !_.find(this.data,d=>d.keyid==this.curSet.keyid)){
          this.data.unshift(this.curSet);
        }
      });
    });

  },
  methods:{
    //清空页面数据
    clearData(){
        this.$store.commit(Clear_Set_Setting_Obj);
    },
    //空函数
    noHandler(){},
    applySet(){
      if(!this.curSet){tool.info('请先选择配置项!');return;}
      this.$store.dispatch(UseSearch,this.curSet.keyid).then(res=>{
        if(!tool.msg(res,'设置成功!','设置失败!')) return;
        _.each(this.data,d=>d.isDefault=0);
        this.curSet.isDefault=1;
      });
    },
    //新建
    add(){
      let s=this;
      tool.open(function(){
          let html=`<div style="padding:10px;">
                      <InputDir label="配置名称" @change="name_change" :val="name"/>
                      <div style="text-align:right;margin-top:10px;">
                            <button type="button" class="btn btn-success" style="font-size:12px;" @click="complete()">完成</button>
                            <button type="button" class="btn btn-default" style="font-size:12px;" @click="close()">关闭</button>
                      </div>
                    </div>`;
          let param={
              title:'配置名称',
              area:'300px',
              content:`<div class="searchSetPop" style="width:100%;height:100%;overflow-y:auto;">${html}</div>`,
              components:{InputDir},
              context:{
                  name:'',
                  complete(){
                    s.data.unshift({keyid:tool.guid(),name:param.selfData.name,isDefault:0,isAdd:true})
                    param.close();
                  },
                  close(){param.close();},
                  name_change(val){param.selfData.name=val;}
              }
          };
          
          return param;
      }());
    },
    //选择配置项
    selSet(d,i){
      this.$store.commit(Set_Setting_Obj,{
        curSet:this.data[i],
        curSelTable:this.data[i].souces || [],
        pageLimit:this.data[i].pageLimit,
        pages:this.data[i].pages
      });
    },
    //删除指定配置项
    delItem(d,i){
      tool.confirm('删除后将无法恢复，确定需要删除吗？',['确定','取消'],()=>{
          let msgIndex=tool.iconMsg('删除中,请耐心等待...');
          this.$store.dispatch(DelSearch,d.keyid).then(res=>{
            tool.closeMsg(msgIndex);
            if(!tool.msg(res,'删除成功!','删除失败!')){return;}
            //判断是否删除项当前被选中
            if(this.curSet &&  d.keyid==this.curSet.keyid){
              this.clearData();
            }

            this.data.splice(i,1);
          });
      },function(){});
    }
  }
}
</script>

<style scoped lang="less">
     @import "../../css/variables.less";
     @barH:40px;//操作栏高度
     @setItemW:150px;//配置展示项宽度
     @iconW:0px;

     .KSearchIndex{width:100%;height:100%;background-color:white;text-align:left;}
     .KSearchIndex .setting{width:100%;height:50%;}
     .KSearchIndex .sources{width:100%;height:50%;.border('top');}

     @titleH:40px;
     .KSearchIndex .title{width:100%;height:@titleH;line-height:@titleH;padding:0px 10px;.border('top');.border('bottom');font-weight:600;font-style: italic;}

     .KSearchIndex .empty{width:100%;height:100%;padding:20px;text-align:center;}
     .KSearchIndex .empty img{margin-right:20px;}
     .KSearchIndex .empty .tipInfo{font-size:20px;}
     .KSearchIndex .empty .option{width:100%;margin-top:20px;}
     .KSearchIndex .settingRegion{width:100%;height:~'calc(100% - @{titleH})';}
     .KSearchIndex .settingRegion .content{width:100%;padding:10px;height:~'calc(100% - @{barH})';text-align:left;}
     .KSearchIndex .settingRegion .content .item{
       cursor:pointer;text-align:center;position:relative;
       display:inline-block;width:@setItemW;margin-left:10px;height:@setItemW;.border('');border-radius:5px;
       .trans();
      }

      .KSearchIndex .settingRegion .content .item .item_container{
        overflow:hidden;position:relative;width:100%;height:100%;
      }

      .KSearchIndex .settingRegion .content .item .option_bar{display:none;}
      .KSearchIndex .settingRegion .content .item:hover .option_bar{
        display:block;position:absolute;bottom:0px;height:32px;color:black;
        width:100%;background-color:transparent;text-align:center;z-index:100;
      }

      .KSearchIndex .settingRegion .content .item:hover .option_bar .removeBtn{
        width:30px;height:30px; border-radius:50%;
        line-height:30px;color:white;margin: auto; margin-top:2px;
      }

      html{.TCol(~".KSearchIndex .settingRegion .content .item:hover .option_bar .removeBtn",'bg');}

      .KSearchIndex .settingRegion .content .item:hover{background-color:rgba(0,0,0,.4);color:white;}

     .KSearchIndex .settingRegion .content .item .icon{width:@iconW;display:inline-block;text-align:center;.border('right');float:left;color:white;}
     .KSearchIndex .settingRegion .content .item .container{display:table;width:100%;height:100%;}
     .KSearchIndex .settingRegion .content .item .name{
      width:~'calc(100% - @{iconW})';
      display:table-cell;
      padding:0px 10px 0px 10px;
      word-break: break-all;
      vertical-align: middle;
      }
      .KSearchIndex .settingRegion .content .item .iden{position:absolute;right: 3px; top: 2px;color: white;}
      .KSearchIndex .settingRegion .content .item .iden_container{
        position: absolute;
        top: 0px;
        right: 0px;
        width: 30px;
        height: 30px;


      }

      html{.TCol(~".KSearchIndex .settingRegion .content .item .iden_container",'lineLoopgen',45deg,transparent,50%,@Font_Hover_Col,50%,45deg,transparent,49%,@Font_Hover_Col,10%);
      }

      .KSearchIndex .settingRegion .option{width:100%;text-align:right;height:@barH;line-height:@barH;}

      //数据源样式
      .KSearchIndex .sources .content{width:100%;height:~'calc(100% - @{titleH})';padding-top:10px;}
      @content_itemW:200px;
      @content_itemH:70px;
      .KSearchIndex .sources .content .item{width:@content_itemW;height:@content_itemH;float:left;margin-left:10px;margin-bottom:10px;}
      .KSearchIndex .sources .content .item .title{
        border-top:0px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        display: block;
        border-top-left-radius:5px;
        border-top-right-radius:5px;
        .border('',@Font_Hover_Col);
      }

      html{.TCol(~".KSearchIndex .sources .content .item .title",'bc');}
      .KSearchIndex .sources .content .item .desc{
        line-height:~'calc(@{content_itemH} - 40px)';padding:0px 5px;font-style:italic;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        display: block;
        .border('',@Font_Hover_Col);
        border-bottom-left-radius:5px;
        border-bottom-right-radius:5px;
        border-top:0px;
        font-size:12px;
      }

      html{.TCol(~".KSearchIndex .sources .content .item .desc",'bc');}
</style>
