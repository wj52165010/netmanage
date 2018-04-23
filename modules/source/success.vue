<!-- 数据源添加成功页面组件 -->
<template>
    <div class="SourceSuccess">
        <div class="info" style="text-align:center;height:110px;line-height:110px;">
            <img src="/static/smile.png" style="width:50px;" />
            <span style="margin-left:10px;">数据源创建成功!</span>
        </div>
        <div class="btns">
            <div style="float:left;">
                <button type="button" class="btn btn-default btn-sm" @click="customMenu">定制菜单</button>
            </div>
            <div style="float:right;">
                <button type="button" class="btn btn-default btn-sm" @click="upload()">{{status==0?'上传数据':'继续上传'}}</button>
                <button type="button" class="btn btn-default btn-sm" @click="complete()">完成</button>
            </div>
        </div>
    </div>
</template>

<script>
import {BODY_RESIZE,CreateFileParse,ClearUploadSourcePageData,UplaodFileData} from '../../store/mutation-types'
import {mapState,mapMutations} from 'vuex'

import UploadSource from './uploadSource.vue'
export default {
  name: 'SourceSuccess',
  props:['store','model'],
  data () {
    return {
      status:0,//0:上传数据,1:继续上传
    }
  },
  computed:mapState({
    cols:state=>{
      return state.addSource.cols;
    },
    sourceCode:state=>{
        return state.addSource.sourceCode;
    },
    containerHeader:state=>{
        return state.addSource.containerHeader>0;
    }
  }),
  mounted(){
      this.$store=this.$store || this.store;
      this.status=this.model || 0;
  },
  methods:{
      upload(){
        let s=this;
        //继续上传
        if(this.status){
            tool.open(function(){
                let html=`<UploadSource :fields="fields" :code="code" v-on:close="cancel_btn" v-on:changesize="change_size" v-on:pageChange="pageChange" />`;

                let layerIndex=-1;
                let param={
                    title:'请选择上传方式',//'上传数据源 - 选择解析规则',
                    area:['400px;','300px'], //['600px', '600px'],
                    components:{UploadSource},
                    content:`<div class="source_upload_pop" style="width:100%;height:100%;">${html}</div>`,
                    store:s.$store,
                    context:{
                        code:s.sourceCode,
                        fields:tool.Clone(_.map(s.cols,f=>{
                            f.source_column='';
                            f.dest_column='';
                            f.def_val='';
                            f.format='';
                            f.params=[];
                            f.ignore=0;
                            f.firstParam='';
                            f.senondParam='';
                            f.type=f.type || 'text';

                            return f;
                        })),
                        submit_btn(){
                            //layer.title('',index);
                        },
                        cancel_btn(){
                            param.close();
                        },
                        pageChange(tag,index){
                            if(tag=='file'){
                                let titles=['上传数据源 - 选择解析规则','上传数据源 - 新增解析规则','上传数据源 - 上传文件'];
                                layer.title(titles[index],layerIndex);
                            }

                            if(tag=='source'){
                                let titles=['请选择解析规则','配置映射','编辑限定条件','配置条件关系'];
                                layer.title(titles[index],layerIndex);
                            }
                        },
                        change_size(tag){
                            if(tag=='file'){
                                layer.size(layerIndex, {
                                    width: 600,
                                    height:600,
                                }); 
                            }
                            if(tag=='source'){
                                layer.size(layerIndex, {
                                    width: 800,
                                    height:410,
                                }); 
                            }
                        }
                    },
                    success(layero, index){
                        layerIndex=index;
                    },
                    sizeChange(){
                        
                    },
                    pop_close(){
                        s.$store.commit(ClearUploadSourcePageData);
                    }
                };

                return param;
            }());
            return;
        }
        

        //包含列头的情况下需要设置对应列名
        if(this.containerHeader){
            _.each(this.cols,c=>c.dest_column=c.name);
        }

        //上传文件
        //添加文件解析规则
        this.$store.dispatch(CreateFileParse).then(res=>{
            this.status=1;
            if(!tool.msg(res,'','添加文件解析规则失败,请重新上传!')){
                return;
            }
            
            //上传文件数据
            this.$store.dispatch(UplaodFileData,{code:res.biz_body.source_code,id:res.biz_body.id}).then(res=>{
                tool.msg(res,'上传数据成功!','上传数据失败,请重新上传!')
            });
        
        });

      },
      complete(){
        this.$emit('complete');
      },

      //定制菜单
      customMenu(){
        this.complete();
        this.$emit('customMenu');
      }
  }
}
</script>
<style scoped lang="less">
@import "../../css/variables.less";
.SourceSuccess{width:100%;height:100%;}
@btnH:50px;
.info{height:~'calc(100% - @{btnH})';text-align:center;line-height:~'calc(100% - @{btnH})';}
.btns{height:50px;line-height:50px;.border('top');padding:0px 10px;}

</style>
