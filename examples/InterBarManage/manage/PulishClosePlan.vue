<!-- 发布停业计划页面组件 -->
<template>
    <div class="PublishClosePlan">
        <div class="PublishClosePlan_container">

            <div class="row" style="margin:0px;margin-bottom:10px;">
                <div class="col-md-3" style="padding-top:10px;padding-left:25px;">停业方式:</div>
                <div class="col-md-5" style="padding-left:0px;padding-top:10px;">
                    <el-radio v-model="res.close_way"  label="1">临时停业</el-radio>
                    <el-radio v-model="res.close_way"  label="2">长期停业</el-radio>
                </div>
            </div>

            <div class="row" style="margin:0px;margin-bottom:10px;">
                <div class="col-md-3" style="padding-top:10px;padding-left:25px;">停业时段:</div>
                <div class="col-md-7" style="padding-left:0px;">
                    <el-date-picker  v-model="res.stop_time_range" type="datetimerange" style="width:100%;" placeholder="选择日期" :picker-options="simpleTime"> </el-date-picker>
                </div>
            </div>

            <div class="row" style="margin:0px;margin-bottom:10px;">
                <div class="col-md-3" style="padding-top:10px;padding-left:25px;">停业原因:</div>
                <div class="col-md-9" style="padding-left:0px;">
                    <textarea v-model="res.reason" placeholder="请输入不超过30个字符" style="padding:10px;height:60px;width:100%;resize:none;border-radius:5px;border: 1px solid #e5e5e5;" />
                </div>
            </div>

            <div class="row" style="margin:0px;margin-bottom:10px;" >
                <div class="col-md-3" style="padding-top:10px;padding-left:25px;">目标场所:</div>
                <div class="col-md-4" style="height:200px;border:1px solid #e7eaec;border-radius:5px;padding-right:0px;">
                    <PlaceTree ref="placeTree" :rootNode="rootNode" @res="PlaceResult"></PlaceTree>
                </div>
                <div class="col-md-1" style="width:6%;"></div>
                <div class="col-md-4"  style="height:200px;border:1px solid #e7eaec;border-radius:5px;padding-top:10px;padding-bottom:10px;padding-right:0px;">
                    <Scroll :listen="res.target">
                        <div v-for="(p,i) in res.target" style="margin-bottom:5px;padding-right:40px;position:relative;padding-left:20px;">
                            <span style="font-size:12px;position:absolute;left:0px;top:3px;">{{i+1}}.</span>{{p.name}} 
                            <i @click="delPlace(p)" class="fa fa-remove delPlaceItem" style="position:absolute;right:20px;top:3px;"></i>
                        </div>
                    </Scroll>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import PlaceTree from 'components/PlaceTreeNew'
import Scroll from  'components/scroll'
export default {
  name: 'PublishClosePlan',
  components:{PlaceTree,Scroll},
  data () {
    return {
        simpleTime:{
            disabledDate(time) {
            return time.getTime() > Date.now();
            }
        },
        rootNode:{name:tool.cookie.get('region_name'),code:tool.cookie.get('region_code')},//根节点数据
        res:{
            close_way:'1',//停业方式
            stop_time_range:[],//停业时段
            reason:'',//停业原因
            target:[] //关联目标场所
        }
        
    }
  },
  watch:{
    res:{
        deep:true,
        handler:function(){
            this.$emit('change',{
                close_way:parseInt(this.res.close_way),
                stop_time_range:this.res.stop_time_range[0]?_.map(this.res.stop_time_range,t=>tool.DateFormat(t,'yyyy-MM-dd hh:mm:ss')).join(' - '):'',
                reason:this.res.reason,
                target:_.map(this.res.target,t=>t.code).join(',')
            })
        }
    }
  },
  methods:{
    //场所区域选择改变事件
    PlaceResult(d){
        let res =  _.chain(d).values().flatten().value();
        this.res.target=res;
    },
    //删除选中的场所节点
    delPlace(d){
        this.$refs.placeTree.checkOut(d.code);
    },
  }
}
</script>
<style scoped lang="less">
@import "../../../css/variables.less";
.PublishClosePlan{width:100%;height:100%;padding:5px;}
.PublishClosePlan_container{width:100%;height:100%;background-color:white;}
</style>
