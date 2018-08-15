<!-- 登记配置页面组件 -->
<template>
    <div class="RegSetting">
        <div class="row" style="margin:0px;margin-bottom:10px;">
            <div  :class="{'col-md-4':blnHideCoverPlace && blnHideTargetPlace,'col-md-2':!blnHideCoverPlace || !blnHideTargetPlace}" style="padding-top:10px;padding-left:25px;">可用次数:</div>
            <div class="col-md-5" style="padding-left:0px;">
                <el-input-number v-model="data.times" :min="1" :max="100000"></el-input-number>
            </div>
        </div>
        <div class="row" style="margin:0px;margin-bottom:10px;" v-if="!blnHideCoverPlace">
            <div class="col-md-2" style="padding-top:10px;padding-left:25px;">覆盖场所:</div>
            <div class="col-md-5" style="padding-left:0px;padding-top:10px;">
                <el-radio  label="1" v-model="data.cover">是</el-radio>
                <el-radio  label="2" v-model="data.cover">否</el-radio>
            </div>
        </div>

        <div class="row" style="margin:0px;margin-bottom:10px;" v-if="!blnHideTargetPlace">
            <div class="col-md-2" style="padding-top:10px;padding-left:25px;">目标场所:</div>
            <div class="col-md-4" style="height:300px;border:1px solid #e7eaec;border-radius:5px;padding-right:0px;">
                <PlaceTree ref="placeTree" :rootNode="rootNode" :defval="selRegion" @res="PlaceResult"></PlaceTree>
            </div>
            <div class="col-md-1"></div>
            <div class="col-md-4"  style="height:300px;border:1px solid #e7eaec;border-radius:5px;padding-top:10px;padding-bottom:10px;padding-right:0px;">
                <Scroll :listen="data.selPlaces">
                    <div v-for="(p,i) in data.selPlaces" style="margin-bottom:5px;padding-right:40px;position:relative;padding-left:20px;">
                        <span style="font-size:12px;position:absolute;left:0px;top:3px;">{{i+1}}.</span>{{p.name}} 
                        <i @click="delPlace(p)" class="fa fa-remove delPlaceItem" style="position:absolute;right:20px;top:3px;"></i>
                    </div>
                </Scroll>
            </div>
        </div>
    </div>
</template>

<script>
import PlaceTree from 'components/PlaceTreeNew'
import Scroll from  'components/scroll'

import {BODY_RESIZE,netbar_electronic_option_allow} from '../../../store/mutation-types'
export default {
  name: 'RegSetting',
  components:{PlaceTree,Scroll},
  props:['blnHideCoverPlace','blnHideTargetPlace'],
  data () {
    return {
        rootNode:{name:tool.cookie.get('region_name'),code:tool.cookie.get('region_code')},//根节点数据
        selRegion:[], //[{code:'410501',type:1},{code:'410502',type:1}],
        data:{
            cover:'1',
            times:1,
            selPlaces:[],
        }
    }
  },
  watch:{
      data:{
        deep:true,
        handler:function(){
            let d=this.data;
            this.$emit('change',{
                times:d.times,
                cover:d.cover==1?1:0,
                target:_.map(d.selPlaces,p=>p.code).join(',')
            })
        }
      }
  },
  mounted(){
    this.data=tool.Clone(this.data);
  },
  methods:{
    //场所区域选择改变事件
    PlaceResult(d){
        let res =  _.chain(d).values().flatten().value();
        this.data.selPlaces=res;
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
.RegSetting{width:100%;height:100%;padding:10px;}


</style>
