<!-- 舆情页面组件组件 -->
<template>
    <div class="PublicOpinion">
        <!--左边类型筛选-->
        <div class="left_container">
            <!--标题栏-->
            <div class="title_bar"><i class="fa fa-briefcase" style="margin-right:10px;"></i>涉案类型</div>
            <!--内容栏-->
            <div class="content_bar">
                <Scroll :listen="caseTypes">
                    <div class="item" v-for="c in caseTypes">
                        <span class="dott"></span>{{c.name}}
                    </div>
                </Scroll>
            </div>
        </div>
        <!--右边内容显示区域-->
        <div class="right_container">
            <HTag :tags="itags" @change="tagChange" @remove="removeTag">
                <div slot="t0" style="height:100%;width:100%;">
                    <Scroll ref="personScroll">
                        <div class="card" v-for="p in persons">
                          <div class="info">
                            <div class="item divEllipsis"><span class="title">姓名:</span><span class="content">五是要222222222</span></div>
                            <div class="item divEllipsis"><span class="title">涉案:</span><span class="content green">民事行为</span></div>
                            <div class="item divEllipsis"><span class="title">分数:</span><span class="content red max">140</span></div>
                            <div class="item">
                                <el-tooltip class="icon" content="关注" placement="bottom"><div style="width:20px;height:20px;" ><i class="fa fa-eye"></i></div></el-tooltip>
                                <el-tooltip class="icon" content="排除" placement="bottom"><div style="width:20px;height:20px;" ><i class="fa fa-trash-o"></i></div></el-tooltip>
                                <el-tooltip class="icon" content="详情" placement="bottom"><div style="width:20px;height:20px;" @click="lookDetail(p)"><i class="fa fa-info"></i></div></el-tooltip>
                                <el-tooltip class="icon" content="预览" placement="bottom"><div style="width:20px;height:20px;" ><i class="fa fa-caret-right"></i></div></el-tooltip>
                            </div>
                          </div>
                          <div class="image"><img src="" /></div>
                          <div class="extraInfo divEllipsis"><span class="title">身份证:</span>500109198612122533</div>
                        </div>
                        <div class="clearfix"></div>
                    </Scroll>
                </div>
                <div slot="t1" style="height:100%;width:100%;">
                    <Scroll ref="vidScroll">

                    </Scroll>
                </div>

                <div v-for="(i,index) in extraPage" :slot="'t'+(index+2)" style="height:100%;width:100%">
                    <PublicOpiDetail />
                </div>
            </HTag>
        </div>
    </div>
</template>

<script>
import HTag from 'components/HTag'
import Scroll from 'components/scroll'
import PublicOpiDetail from './PublicOpiDetail.example'
export default {
  name: 'PublicOpinion',
  components:{HTag,Scroll,PublicOpiDetail},
  data () {
    return {
      tags:[{name:'人员预警信息',icon:'fa fa-address-book-o'},{name:'虚拟身份预警',icon:'fa fa-qq'}],
      caseTypes:[
        {name:'涉毒行为'},{name:'民事行为'}
      ],//涉案类型
      persons:[1,2,3,4,5,6,7,7,7,7,7],
      extraPage:[],//详细页面
    }
  },
  computed:{
    itags(){
        return [...this.tags,...this.extraPage];
    }
  },
  methods:{
    //刷新页面
    refreshPage(){},
    tagChange(index){
        this.$nextTick(()=>{
            this.$refs.personScroll.reloadyScroll();
            this.$refs.vidScroll.reloadyScroll();
        });
    },
    //查看详情
    lookDetail(){
        this.extraPage.push({id:'page'+tool.guid(),name:'详细页面',icon:'fa fa-address-book-o',blnRemove:true});
    },
    //删除Tag项
    removeTag(item){
        let index =_.findIndex(this.extraPage,e=>e.id==item.id);
        if(index<0) return;
        this.extraPage.splice(index,1);
    }
  }
}
</script>

<style scoped lang="less">
 @import "../css/variables.less";
 .PublicOpinion{width:100%;height:100%;padding:5px;}
 
 @bgColor:#d9d9d9;
 @leftW:200px;
 .PublicOpinion .left_container{width:@leftW;height:100%;float:left;.border('');overflow:hidden;background-color:@bgColor;}
 @titleH:40px;
 .PublicOpinion .left_container .title_bar{width:100%;height:@titleH;line-height:@titleH;color:white;padding:0px 10px;}
 html{.TCol(~'.PublicOpinion .left_container .title_bar','bg')}

 .PublicOpinion .left_container .content_bar{width:100%;height:~'calc(100% - @{titleH})';text-align:left;font-size:12px;}

 .PublicOpinion .left_container .content_bar .item{padding:0px 10px;margin-top:5px;font-weight:600;line-height:30px;}
 .PublicOpinion .left_container .content_bar .item:last-child{margin-bottom:10px;}

 .PublicOpinion .left_container .content_bar .item:hover{color:white;cursor:pointer;}
 html{.TColFade(~'.PublicOpinion .left_container .content_bar .item:hover',80%,'bg')}

 .PublicOpinion .left_container .content_bar .item .dott{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:10px;}
 html{.TColFade(~'.PublicOpinion .left_container .content_bar .item .dott',80%,'bg')}
 .PublicOpinion .left_container .content_bar .item:hover .dott{background-color:white !important;}

 .PublicOpinion .right_container{margin-left:@leftW + 5px;height:100%;background-color:white;}

 @cardW:250px;
 @cardH:150px;
 .PublicOpinion .card{float:left;border:1px solid;
    border-radius:5px;width:@cardW;height:@cardH;margin-top:10px;margin-left:10px;padding:10px;padding-bottom:0px;overflow:hidden;position:relative;
    -moz-box-shadow:1px 1px 2px #333333; -webkit-box-shadow:1px 1px 2px #333333; box-shadow:1px 1px 2px #333333;
  }

 html{.TCol(~'.PublicOpinion .card','bc')}

 @infoH:100px;
 @infoW:150px;
 .PublicOpinion .card .info{height:@infoH;width:@infoW;float:left;}
 .PublicOpinion .card .info .item{text-align:left;margin-bottom:5px;font-size:12px;}
 .PublicOpinion .card .info .item .title{margin-right:5px;}
 html{.TCol(~'.PublicOpinion .card .info .item .content.green')}

 .PublicOpinion .card .info .item .icon{width:20px;height:20px;line-height:20px;text-align:center;border-radius:50%;font-size:14px;float:left;}
 .PublicOpinion .card .info .item .icon:hover{cursor:pointer;}
 html{.TCol(~'.PublicOpinion .card .info .item .icon:hover')}

 .PublicOpinion .card .info .item .icon .icon_info{font-size:10px;}

 .PublicOpinion .card .info .item .content.red{color:red;font-size:18px;font-weight:600;}

 .PublicOpinion .card .extraInfo{text-align:left;position:absolute;font-size:12px;color:white;height:28px;line-height:28px;padding:0px 10px;left:0px;right:0px;bottom:0px;}
  html{.TCol(~'.PublicOpinion .card .extraInfo','bg')}
  .PublicOpinion .card .extraInfo .title{margin-right:5px}

 .PublicOpinion .card .image{margin-left:@infoW;height:@infoH;.border('');border-radius:5px;}
 .PublicOpinion .card .image img{width:100%;height:100%;border-radius:5px;}
</style>
