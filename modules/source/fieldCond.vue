<!-- 字段条件设置页面 -->
<template>
    <div class="FieldCond">
        <!--新增按钮-->
        <div class="addBtn" @click="addCond()">
            <i class="fa fa-plus"></i>
        </div>
        <!--头部信息-->
        <div class="header">
            <div class="title">字段标题</div>
            <div class="preview">预览数据</div>
            <div class="operator">操作符</div> 
            <div class="cond">条件</div>
            <div class="handler">操作</div> 
        </div>
        <!--字段设置信息-->
        <div class="fieldSet">
            <Scroll :listen="data">
                <div v-for="(d,i) in data" class="setItem">
                    <!--字段-->
                    <div class="title">
                        <el-select  
                            v-model="d.field"
                            placeholder="请选择"
                            style="margin-top:2px;">
                            <el-option
                                v-for="item in indexFields"
                                :label="item.name"
                                :value="item">
                            </el-option>
                        </el-select>
                    </div>

                    <!--预览数据-->
                    <div class="preview">{{(d.field && d.field.previewVal) || '&nbsp;'}}</div>
                    
                    <!--操作符-->
                    <div class="operator">
                        <operator :data="d" />
                    </div> 

                    <!--条件-->
                    <div class="cond">
                        <ToggleInput v-model="d.value"  placeholder="请输入" style="margin-top:5px;" />
                    </div>

                    <!--操作-->
                    <div class="handler"><i class="fa fa-remove" @click="removeCond(i)"></i></div> 

                    <div class="clearfix"></div>
                </div>
            </Scroll>
        </div>
    </div>
</template>

<script>
import {BODY_RESIZE,SetUploadSourcePageData,ClearUploadSourcePageData} from '../../store/mutation-types'
import Scroll from 'components/scroll'
import ToggleInput from 'components/toggleInput'
import operator from 'components/operator'
import {mapState,mapMutations} from 'vuex'
export default {
  name: 'FieldCond',
  components:{Scroll,ToggleInput,operator},
  data () {
    return {
       data:[],
    }
  },
  watch:{
    config:{
        deep:true,
        handler:function(){
            this.$store.commit(SetUploadSourcePageData,this.config);
        }
    },
    data(){
        this.$emit('change',this.data);
    }
  },
  computed:mapState({
    PageData:state=>{
        return state.uploadSource;
    },
    config(){
        return {
            conds:this.data
        };
    },
    dataSource:state=>{return state.oriSource;},
    //索引字段
    indexFields:function(state){
       let oriSource=state.uploadSource.oriSource;
       let table=_.find(_.extend(..._.chain(tool.Clone(this.dataSource)).pluck('tables').value()),s=>s.key==oriSource);
       if(!table) return [];
       let fieldKind=[];

        let indexFields=table.indexFields, 
        requisite=(indexFields && indexFields.requisite) || [],
        notRequisite=(indexFields && indexFields.notRequisite) || [];

        for(let site in requisite){
            let group=[];
            let groupItems=requisite[site].split(',');
            for(let field in groupItems){
                let item =table.fields[groupItems[field]];
                if(!item){continue;}
                item.tableKey=table.key;
                item.tableName=table.name;
                fieldKind.push(item);
            }
        }

        for(let site in notRequisite){
            let groupItem=notRequisite[site];
            let item =table.fields[groupItem];
            if(!item){continue;}
            item.tableKey=table.key;
            item.tableName=table.name;
            fieldKind.push(item);
        }

        return fieldKind;
    }
  }),
  mounted(){
    this.recoverData();
    if(this.data.length<=0){this.addCond();}
  },
  methods:{
    clearData(){
        this.$store.commit(ClearUploadSourcePageData);    
    },
    //恢复页面之前操作的值
    recoverData(){
        let {conds} =this.PageData;
        this.data=conds;
    },
    //新增条件
    addCond(){
        this.data.push({name:`条件${this.data.length+1}`,field:null,value:'',cond:'0',condSign:'='});
    },
    //删除条件
    removeCond(i){
        this.data.splice(i,1);
    }
  }
}
</script>

<style scoped lang="less">
    @import "../../css/variables.less";
    .FieldCond{width:100%;height:100%;text-align:center;position:relative;}

    @headerH:40px;
    .FieldCond .header{width:100%;height:40px;.border('bottom');}
    .FieldCond .fieldSet{width:100%;height:~'calc(100% - @{headerH})';}

    .FieldCond .addBtn{position:absolute;right:2px;width:20px;height:20px;border-radius:50%;margin-top:10px;
                        background-color:@Font_Hover_Col;color:white;cursor:pointer;}

    @previewW:150px;//预览数据宽度
    @operatorW:130px;//运算符宽度
    @condW:150px;//条件宽度
    @handlerW:80px;//操作宽度

    .FieldCond .title{
        height:100%;width:~'calc(100% - @{previewW} - @{operatorW} - @{condW} - @{handlerW})';.border('right');float:left;line-height:@headerH;
        padding:0px 5px;
    }
    .FieldCond .preview{height:100%;width:@previewW;.border('right');float:left;line-height:@headerH;}
    .FieldCond .operator{height:100%;width:@operatorW;.border('right');float:left;line-height:@headerH;padding:0px 5px;}
    .FieldCond .cond{height:100%;width:@condW;.border('right');float:left;line-height:@headerH;}
    .FieldCond .handler{height:100%;width:@handlerW;.border('right');float:left;line-height:@headerH;}
    .FieldCond .handler i{cursor:pointer;}

    .FieldCond .fieldSet .setItem{.border('bottom');}
</style>
