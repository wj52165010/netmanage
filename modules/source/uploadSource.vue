<!-- 上传数据源数据 -->
<template>
    <div class="UploadSource">
        <!--上传方式选择-->
        <div class="pageItem" v-if="!showPage">
            <div class="selContainer">
                <div class="selContainer_item">
                    <div style="margin:0px auto;width:330px;">
                        <div class="selItem" @click="curSelTag='file'">
                            <div class="icon"><i class="fa fa-file-o"></i></div>
                            <div class="info">文本及FTP</div>
                            <!--标识数据源是否被选中-->
                            <div class="iden_container" v-show="curSelTag=='file'">
                                <i class="fa fa-check iden" />
                            </div>
                        </div>
                        <div class="selItem" @click="curSelTag='source'">
                            <div class="icon"><i class="fa fa-database"></i></div>
                            <div class="info">数据源</div>
                            <!--标识数据源是否被选中-->
                            <div class="iden_container" v-show="curSelTag=='source'">
                                <i class="fa fa-check iden" />
                            </div>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
            </div>
            <!--操作栏-->
            <div class="option_bar">
                <button type="button" class="btn btn-default" @click="cancel()">取消</button>
                <button type="button" class="btn btn-default" @click="changeSize()">下一步</button>
            </div>
        </div>

        <!--文件及FTP上传-->
        <div class="pageItem" v-if="showPage=='file'">
            <UploadData :fields="fields" :code="code" v-on:close="cancel" v-on:pageChange="DataPageChange" />
        </div>

        <!--数据库数据上传-->
        <div class="pageItem" v-if="showPage=='source'">
            <UploadDataBase :code="code" v-on:pageChange="SourcePageChange" v-on:close="cancel" />
        </div>
    </div>
</template>

<script>
import UploadData from './uploadData.vue'
import UploadDataBase from './uploadDataBase.vue'
export default {
  name: 'UploadSource',
  components:{UploadData,UploadDataBase},
  props:['fields','code'],
  data () {
    return {
      curSelTag:'file',//file:文本,source:数据源
      showPage:'',
    }
  },
  methods:{
    changeSize(){
        if(!this.curSelTag){
            tool.info('请选择上传方式!');
            return;
        };
        this.$emit('changesize',this.curSelTag);
        this.showPage=this.curSelTag;
        this.$emit('pageChange',this.curSelTag,0);
    },
    cancel(){
        this.$emit('close');
    },
    //上传文本数据页面改变事件
    DataPageChange(i){
        this.$emit('pageChange','file',i);
    },
    //数据源上传文本数据页面改变事件
    SourcePageChange(i){
        this.$emit('pageChange','source',i);
    }
  }
}
</script>

<style scoped lang="less">
@import "../../css/variables.less";
.UploadSource{width:100%;height:100%;}
.UploadSource .pageItem{width:100%;height:100%;}

.UploadSource .selItem:last-child{margin-right:0px;}

@optionBar:40px;

.UploadSource .selContainer{display:table;width:100%;height:~'calc(100% - @{optionBar})';}
.UploadSource .option_bar{width:100%;height:@optionBar;.border('top');text-align:right;padding-top:2px;}

.UploadSource .selContainer_item{display:table-cell;vertical-align: middle;}
.UploadSource .selItem{width:150px;height:150px;float:left;.border('');margin-right:15px;border-radius:5px;overflow:hidden;position:relative;text-align:center;}
.UploadSource .selItem:hover{.border('',@Font_Hover_Col);cursor:pointer;}

html{.TCol(~".UploadSource .selItem:hover",'bc');}

.UploadSource .selItem .iden_container{
        position: absolute;
        top: 0px;
        right: 0px;
        width: 30px;
        height: 30px;
}

html{.TCol(~".UploadSource .selItem .iden_container",'lineLoopgen',45deg,transparent,50%,@Font_Hover_Col,50%,45deg,transparent,49%,@Font_Hover_Col,10%);}
.UploadSource .selItem .iden{position:absolute;right: 3px; top: 2px;color: white;}
.UploadSource .selItem .icon {font-size:80px;}
.UploadSource .selItem .info{font-style:italic;color:@FontCol;}
</style>
