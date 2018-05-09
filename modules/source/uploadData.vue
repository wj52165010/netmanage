<!-- 上传数据源数据(文本及FTP)组件 -->
<template>
    <div class="UploadData">
        <!--选择解析规则-->
        <div class="page_container" v-show="curPageIndex==0">
            <div class="title">
                <span class="item" @click="addSet()"><i class="fa fa-plus" style="margin-right:5px;"></i>解析规则</span>
            </div>
            <!--展示区域-->
            <div class="content">
                <ParsingRulesSel :code="code" :store="store" ref="ParsingRulesSel" />
            </div>
            <!--操作按钮-->
            <div class="option_bar">
                <button type="button" class="btn btn-default" @click="cancel()">取消</button>
                <button type="button" class="btn btn-default" @click="changePage(2,0)">下一步</button>
            </div>
        </div>

        <!--添加解析规则-->
        <div class="page_container" v-if="curPageIndex==1">
            <!--展示区域-->
            <div class="AddContent">
                <ParsingRulesAdd ref="ParsingRulesAdd" 
                    :store="store" 
                    :data="iner_fields"
                    @tagChange="parsingTagChange" />
            </div>
            <!--操作按钮-->
            <div class="option_bar">
                <button type="button" class="btn btn-default" @click="changePage(0)">返回</button>
                <button type="button" class="btn btn-default" @click="saveParse()">保存</button>
                <button type="button" class="btn btn-default" @click="saveParse(true)">下一步</button>
            </div>
        </div>

        <!--上传文件-->
        <div class="page_container" v-show="curPageIndex==2">
            <!--展示区域-->
            <div class="UploadContent">
                <UploadFile :store="store" ref="UploadFile" 
                    :code="parseCode"
                    :id="parseId" 
                    :fileName="file_name_filters.join(',')" 
                    :ftp="ftp_is_open"
                    :parseItem="parseItem" 
                    />
            </div>
            <!--操作按钮-->
            <div class="option_bar">
                <button type="button" class="btn btn-default" @click="changePage(0)">取消</button>
                <button type="button" class="btn btn-default" @click="changePage(0)">上一步</button>
                <button type="button" class="btn btn-default" @click="complete()">完成</button>
            </div>
        </div>
    </div>
</template>

<script>

import ParsingRulesSel from './ParsingRulesSel'
import ParsingRulesAdd from './ParsingRulesAdd'
import UploadFile from './uploadFile'

import { mapState,mapMutations} from 'vuex'
import {SetSource,IsDelSource} from '../../store/mutation-types'

export default {
  name: 'UploadData',
  props:['store','fields','code'],
  components:{ParsingRulesSel,ParsingRulesAdd,UploadFile},
  data () {
    return {
      curPageIndex:0,
      iner_fields:[],//内部使用的字段集合
      blnContainHeader:false,//是否包含列头
      parseId:'',
      parseCode:'',//解析规则唯一标识
      file_name_filters:[],//ftp文件过滤规则
      ftp_is_open:false,//ftp是否开始
      parseItem:null,
    }
  },
  watch:{
    curPageIndex(){
      this.$emit('pageChange',this.curPageIndex);

      if(this.curPageIndex==1){
          this.iner_fields=tool.Clone(this.fields || []);
      }
      
      this.$nextTick(()=>{
          //this.$refs.ParsingRulesAdd.layout();
      });
    }
  },
  computed:mapState({
      dataSource:state=>{return state.oriSource;},
  }),
  methods:{
      //添加解析规则
      addSet(){
          this.curPageIndex=1;
      },
      changePage(i,curPage){
        //解析规则页面跳转到上传页面
        if(curPage==0 && i==2 && !this.$refs.ParsingRulesSel.curSelItem.source_code){
            tool.info('请选择文件解析规则！');
            return;
        }

        this.parseCode=this.$refs.ParsingRulesSel.curSelItem.source_code;
        this.parseId=this.$refs.ParsingRulesSel.curSelItem.id;
        this.file_name_filters= this.$refs.ParsingRulesSel.curSelItem.file_name_filters || [];
        this.ftp_is_open=this.$refs.ParsingRulesSel.curSelItem.ftp_is_open; 

        this.parseItem=this.$refs.ParsingRulesSel.curSelItem;
        
        this.curPageIndex=i;
      },
      cancel(){
        this.$emit('close');
      },
      complete(){
        this.cancel();
      },
      parsingTagChange(i){
        this.blnContainHeader=i>0;
      },
      //保存规则
      //blnGoNext是否进入下一步删除页面
      saveParse(blnGoNext){
        let d=this.$refs.ParsingRulesAdd.getRes();
        if(!d.rowSep){
            tool.info('行分隔符不能为空!');
            return;
        }
        if(!d.colSep){
            tool.info('列分隔符不能为空!');
            return;
        }
        if(!d.encoding){
            tool.info('编码格式不能为空!');
            return;
        }

        
        let data={
            source_code:this.code,
            encoding:d.encoding,
            col_seperator:d.colSep,
            row_seperator:d.rowSep,
            is_first_column_name:this.blnContainHeader>0,
            file_name_filters:[],
            microprobe_type:d.sourceOri,
            columns:_.chain(d.cols).map(c=>{
                if(c.ignore){
                    return {
                        source_column:'',
                        dest_column:'',
                        def_val:'',
                        format:'',
                        params:[]
                    }
                }
                return {
                    source_column:this.blnContainHeader>0?c.dest_column:c.key,
                    dest_column:c.key,
                    def_val:c.def_val,
                    format:c.format,
                    params:[c.firstParam].concat([c.senondParam])
                }
            }).value(),
        };

        let msgIndex=tool.iconMsg('正在保存解析规则...');
        ser.upload_add_fileparse(data).then(res=>{
            tool.closeMsg(msgIndex);
            if(!tool.msg(res,'保存成功!','保存失败!')) return;
            
            this.$store.dispatch(IsDelSource,this.code).then(res=>{
                //添加新增的数据源到已有的数据源中
                let dataSource=tool.Clone(this.dataSource);
                let customSource=dataSource['自建数据源'];//自建数据源对象

                customSource.tables[this.code].isDel=res.biz_body.isDel;

                this.$store.commit(SetSource,dataSource);
            });
            

            this.$refs.ParsingRulesSel.addItem(res.biz_body);
            if(blnGoNext){
                this.$refs.ParsingRulesSel.selItem(res.biz_body);
                this.changePage(2,0);
            }else{
                this.changePage(0);
            }
        });
      }
  },
}
</script>

<style scoped lang="less">
  @import "../../css/variables.less";

.UploadData{width:100%;height:100%;}
@titleH:40px;
@OptionBarH:40px;
.UploadData .title{font-size:12px;text-align:right;width:100%;
height:@titleH;line-height:@titleH;padding:0px 10px;.border('bottom');font-style: italic;}
.UploadData .item{padding:5px;}
.UploadData .item:hover{.border('',@Font_Hover_Col);border-radius:5px;cursor:pointer;}

html{.TCol(~".UploadData .item:hover",'bc');}
html{.TCol(~".UploadData .item:hover");}

.UploadData .option_bar{text-align:right;padding-right:15px;line-height: @OptionBarH;}
.UploadData .content{height:~'calc(100% - @{titleH} - @{OptionBarH} - 1px)';.border('bottom');}
.UploadData .AddContent{height:~'calc(100% - @{OptionBarH} - 1px)';.border('bottom');}

.UploadData .page_container{width:100%;height:100%;}

.UploadData .UploadContent{height:~'calc(100% - @{OptionBarH} - 1px)';.border('bottom');}
</style>
