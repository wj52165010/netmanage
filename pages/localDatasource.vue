<!-- 本地数据源库配置页面组件 -->
<template>
    <div class="LocalDatasource">
        <scroll :listen="localSource" ref="scroll">
          <div v-for="t in localSource" class="item">
            <div class="title_bar">
              {{t.name}}
              <span class="uploadSource"><i class="fa fa-cloud-upload" @click.stop="addSource(t)"></i></span>
              <span class="delSource"><i class="fa fa-remove" @click.stop="DelSource(t)"></i></span>
            </div>
            <div class="content"></div>
          </div>
        </scroll>
    </div>
</template>

<script>
import {add as addSource} from 'modules/source'
import scroll from 'components/scroll'
import { mapState,mapMutations} from 'vuex'
import {BODY_RESIZE,upload_get_fileparse,delSource,SetSource,Trigger_Del_Menu} from '../store/mutation-types'
export default {
  name: 'LocalDatasource',
  components:{scroll},
  data () {
    return {
    }
  },
  computed:mapState({
    localSource:state=>{//本地数据源
        return (state.oriSource['localdb'] || {}).tables || {};
    },
    oriSource:state=>{
      return state.oriSource || {};
    }
  }),
  mounted(){
    //console.log(tool.Clone(this.localSource));
  },
  methods:{
    //上传数据
      addSource(d){
        let s=this;
        tool.open(function(){
            let layerIndex=-1;
            let param={
                title:'上传数据-设置字段',
                area:['500px','570px;'],
                components:{addSource},
                content:`<div class="settingSourcePop" style="width:100%;height:100%;overflow-y:auto;">
                            <addSource ref="addSource" :store="store" :sourceId="sourceId" :fields="fields" :fileParse="fileParse" :startIndex="4" @titleChange="titleChange" @complete="complete" />
                         </div>`,
                context:{
                    store:s.$store,
                    sourceId:d.key,
                    fileParse:[],
                    fields:tool.Clone(_.values(d.fields)),
                    titleChange(title){
                        layer.title(`上传数据-${title}`,layerIndex);
                    },
                    complete(){
                        param.close();
                    }
                },
                success(layero,index){
                   layerIndex=index;
                   setTimeout(()=>{
                    param.$refs.addSource.reload();
                   },500);
                   s.$store.dispatch(upload_get_fileparse,d.key).then(res=>{
                        param.selfData.fileParse=res.biz_body;
                   });
                }
            };

            return param;
        }());
    },
    //删除数据源
    DelSource(d){
      tool.confirm('您确定要删除该数据源吗,删除该数据源的同时会删除其关联的菜单数据,确定删除?',['确定','取消'],()=>{
          this.$store.dispatch(delSource,d.key).then(res=>{
            delete this.localSource[d.key];
            if(!tool.msg(res,'删除成功!','删除失败!')){return;}

            delete this.localSource[d.key];
            this.oriSource['localdb'].tables=this.localSource;
            this.$store.commit(SetSource,tool.Clone(this.oriSource));
            
            let keyIds=_.map(res.biz_body,r=>r.keyid);
            //删除关联菜单项
            let s=this;
            for(let i=0;i<keyIds.length;i++){
              s.$store.commit(Trigger_Del_Menu,keyIds[i]);
            }

          });
      },function(){});
    }
  }
}
</script>

<style scoped lang="less">
    @import "../css/variables.less";
    .LocalDatasource{width:100%;height:100%;background-color:white;}

    @itemH:52px;
    @titleH:26px;
    .item{width:12%;float:left;margin-left:2%;.border('',@Font_Hover_Col);margin-top:10px;border-radius:5px;height:@itemH;text-align:left;}

    html{.TCol(~".item",'bc');}
    .item .title_bar{
      width:100%;
      height:@titleH;
      line-height:@titleH;
      color:white;padding:0px 40px 0px 10px;
      position:relative;    
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    html{.TCol(~".item .title_bar",'bg');}
    .item .content{width:100%;height:~"calc(@{itemH} - @{titleH} - 2px)";white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}

    @media (max-width:1600px){
       .item{width:16%;margin-left:3.3%;}
    }

    @media (max-width:1400px){
      .item{width:20%;margin-left:4%;}
    }

    @media (max-width:1200px){
      .item{width:30%;margin-left:2.5%;}
    }

    .uploadSource{position:absolute;right:25px;cursor:pointer;}
    .delSource{position:absolute;right:5px;cursor:pointer;}
</style>
