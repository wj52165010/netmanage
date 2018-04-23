<!-- 查看规则组件 -->
<template>
    <div class="LookRule">
        <!--应设置设置区域-->
        <div class="fieldMap">
            <!--头部信息-->
            <div class="map_item">
                <div class="item">目标字段</div><div class="item">来源字段</div>
            </div>
            <div class="map_body">
                <Scroll :listen="data.columns">
                    <div class="map_item" v-for="c in data.columns">
                        <div class="item">{{getFieldName(data.dest_code,c.dest_column)}}</div><div class="item">{{getFieldName(data.source_code,c.source_column)}}</div>
                    </div>
                </Scroll>
            </div>
        </div>
        <!--限定条件展示区域-->
        <div class="groundCond divEllipsis" :title="result">
            <span style="margin-right:10px;font-style:italic;">限定条件:</span>{{result}}
        </div>
    </div>
</template>

<script>
import Scroll from 'components/scroll'
import {mapState,mapMutations} from 'vuex'
export default {
  name: 'LookRule',
  props:['data'],
  components:{Scroll},
  data () {
    return {
        result:''
    }
  },
  computed:mapState({
    dataSource:state=>{return state.oriSource;},
    targetTables(){
        let dataSource=this.dataSource;
        let data = tool.Clone(_.chain(dataSource).values().pluck('tables').flatten().value());

        return _.extend(...data);
      },
  }),
  mounted(){
    let res={};
    this.calcGroundRes(this.data.filter,res);

    this.result=res.pre()+res.cond+res.after();
  },
  methods:{
    getFieldName(table,key){
       return (this.targetTables[table].fields[key] || {name:''}).name;
    },
    //计算组合条件结果
    calcGroundRes(cond,res){
        let condValMap={'and':'&&','or':'||'},
            letterSign={'eq':'=',
                        'gt':'>',
                        'lt':'<',
                        'gte':'>=',
                        'lte':'<=',
                        'neq':'!-',
                        'in':'in',
                        'not_in':'not in',
                        'like':'like'};
        if(!cond.term){
            res.pre=()=>{return ''};
            res.cond=cond.term;
            res.after=()=>{return ''};
            return;
        }

        if(cond.term!='and' && cond.term!='or'){
            res.pre=()=>{return (this.targetTables[cond.field.table].fields[cond.field.key] || {name:''}).name;};
            res.cond=' '+ letterSign[cond.term] + ' ';
            res.after=()=>{return cond.value};
        }else{
            res.pre=()=>{
                let r1={};
                this.calcGroundRes(cond.condtions[0],r1)
                return (cond.condtions[1]?'(':'') + r1.pre()+r1.cond+r1.after();
            };
            res.cond=cond.condtions[1]?(' ' +condValMap[cond.term] + ' ') : '';
            res.after=()=>{
                let r2={};
                if(!cond.condtions[1]) return '';
                this.calcGroundRes(cond.condtions[1],r2)
                return  r2.pre()+r2.cond+r2.after() + ')';
            };
        }
    }

  }
}
</script>

<style scoped lang="less">
  @import "../../css/variables.less";
  .LookRule{width:100%;height:100%;}

  @groundCond:40px;
  .LookRule .fieldMap{width:100%;height:~'calc(100% - @{groundCond})';.border('bottom');}
  @mapItemH:40px;
  .LookRule .fieldMap .map_item .item{display:inline-block;width:50%;height:@mapItemH;line-height:@mapItemH;.border('bottom');text-align:center;}
  .LookRule .fieldMap .map_item .item:last-child{.border('left');}
  .LookRule .fieldMap .map_body{width:100%;height:~'calc(100% - @{mapItemH})';}

  .LookRule .groundCond{width:100%;height:@groundCond;line-height:@groundCond;padding:0px 10px; font-size:12px;}
</style>
