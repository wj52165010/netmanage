<!-- 字段条件设置组件 -->
<template>
    <div class="fieldSet">
        <el-select class="fieldSelect" v-model="data.field" placeholder="请选择" v-if="tables.length>0">
            <el-option-group
                v-for="table in tables"
                :label="table.name">
                <el-option
                v-for="field in table.fields"
                :label="field.name"
                :value="field">
                </el-option>
            </el-option-group>
        </el-select>
        <div class="fieldText">{{data.field.name}}</div>
        <condition class="fieldCondition" :data="data"></condition>
        <el-input class="fieldInput" placeholder="请输入内容" v-model="data.value"></el-input>
        <span style="position: absolute;top:10px;width:20px;text-align:center;cursor:pointer;">
            <el-tooltip effect="light" content="克隆条件" placement="top">
                <i class="fa fa-plus" @click="copy" />
            </el-tooltip>
        </span>
        <div class="clearfix"></div>
    </div>
</template>

<script>
export default {
    name: 'FieldSet',
    props:['tables','data'],
    components:{
        condition:{
            props:['data'],
            template:`<el-dropdown trigger="click" @command="selItem">
                        <span class="el-dropdown-link">
                            <el-button>
                            {{showName}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="0">等于</el-dropdown-item>
                            <el-dropdown-item command="1">大于</el-dropdown-item>
                            <el-dropdown-item command="2">小于</el-dropdown-item>
                            <el-dropdown-item command="3">大于等于</el-dropdown-item>
                            <el-dropdown-item command="4">小于等于</el-dropdown-item>
                            <el-dropdown-item command="5">不等于</el-dropdown-item>
                            <el-dropdown-item command="6">存在于</el-dropdown-item>
                            <el-dropdown-item command="7">不存在于</el-dropdown-item>
                            <el-dropdown-item command="8">模糊</el-dropdown-item>
                        </el-dropdown-menu>
                        </el-dropdown>
            `,
            data(){
                return {
                    showName:''
                }
            },
            mounted(){
                if(this.data && this.data.cond>=0){
                    let mapSign=['等于','大于','小于','大于等于','小于等于','不等于','存在于','不存在于','模糊'];
                    let letterSign=['eq','gt','lt','gte','lte','neq','in','not_in','like'];
                    let mapCondSign=['=','>','<','>=','<=','!=','in','!in','like'];
                    this.data.cond=this.data.cond || 0;
                    this.showName=mapSign[this.data.cond];
                    this.data.condSign=mapCondSign[this.data.cond];
                    this.data.condLetter=letterSign[this.data.cond];
                }
            },
            methods:{
                selItem(command){
                    let mapSign=['等于','大于','小于','大于等于','小于等于','不等于','存在于','不存在于','模糊'];
                    let letterSign=['eq','gt','lt','gte','lte','neq','in','not_in','like'];
                    let mapCondSign=['=','>','<','>=','<=','!=','in','!in','like'];
                    this.showName=mapSign[command];
                    this.data.cond=command;
                    this.data.condSign=mapCondSign[command];
                    this.data.condLetter=letterSign[command];
                }
            }
        }
    },
    mounted() {
    },
    data(){
        return {
            value:''
        }
    },
    methods:{
        copy(){
            this.$emit('copy',tool.Clone(this.data));
        }
    }
}
</script>
<style lang="less">
    .fieldSet{display:inline-block;};
    .fieldSelect .el-input__inner{border-right: 0px !important;border-top-right-radius: 0px !important;border-bottom-right-radius: 0px !important;}
    .fieldCondition .el-button{border-radius: 0px !important;height:36px;}
    .fieldInput .el-input__inner{border-left: 0px !important;border-bottom-left-radius: 0px !important;border-top-left-radius: 0px !important;}
    // .el-select-dropdown{min-width:200px !important;}
    .fieldText{
        float:left;
        width: 100px;
        display:inline-block;
        height: 36px;
        line-height: 36px;
        border: 1px solid #C0CCDA;
        border-right: none;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        font-size: 14px;
        text-align: center;
    }
</style>
<style scoped lang="less">
    .fieldSelect{float:left;width: 100px;}
    .fieldCondition{float:left;}
    .fieldInput{float:left;width:100px;}
</style>
