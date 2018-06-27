<!-- 碰撞分析条件分组组件 -->
<template>
    <div class="CrashGroup" onselectstart="return false;">
        <!--条件展示区域-->
        <div class="cond_container">
            <div class="cond_content">
                <Scroll :listen="conds">
                    <div v-for="(c,i) in conds" class="cond_item" @mousedown="mousedown($event,c,`A${i+1}`)">
                        <div style="cursor:pointer;" class="icon incon_item">A{{i+1}}</div>
                        <!--<i style="cursor:pointer;float:right;margin-top:6px;" class="fa fa-remove"></i>-->
                        <div class="content" @mousedown.stop="noHandler()">{{c.title || '无标题'}}</div>
                    </div>
                </Scroll>
            </div>
        </div>
        <!--分组展示区域-->
        <div class="group_container">
            <div class="condGroup_item" style="position:absolute;background-color:transparent;width:100%;height:9px;top:-30px">
                <div class="info"></div>
                <div class="option_bar" style="border:none;">
                    <div class="option_item" v-for="(g,key) in group[0].val" style="background-color:transparent;text-align:center;padding:0px;font-weight:600;"><el-tooltip placement="top" :content="`分组${key.substr(0,1)}`">{{key.substr(0,1)}}</el-tooltip></div>
                </div>
            </div>
            <div class="condGroup_item" v-for="(v,i) in group">
                <div class="info"><el-tooltip placement="top" :content="v.tip">{{v.name}}</el-tooltip></div>
                    
                <div class="option_bar">
                    <div class="option_item" name="dragIn" :dataT="key" @mousedown="mousedown($event,item,key)" v-for="(item,key) in v.val">
                        <div class="child" :style="{'background-color':Color[i.name.substr(0,1)] || '#ff4c6a'}" v-if="item.length<=3" v-for="i in item">
                            {{i.name}}
                            <div class="delgroup" @mousedown.stop="delGroup(i,item,key)">x</div>
                        </div>

                        <div class="moreShow" v-if="More[key]">
                            <div class="child" :style="{'background-color':Color[i.name.substr(0,1)] || '#ff4c6a'}" v-for="i in item">{{i.name}}<div class="delgroup" @mousedown.stop="delGroup(i,item,key)">x</div></div>
                        </div>
                        <div class="groupBtn childB" v-if="item.length>3" @mousedown.stop="More[key]=!More[key]">{{key}}(超出3个)<div class="delgroup" @mousedown.stop="delGroup('all',item)">x</div></div>
                        
                    </div>
                </div>
            </div>
        </div>
        <!--操作按钮-->
        <div class="option_bar">
            <button type="button" class="btn btn-success btn-sm" @click="add()">添加分析</button>
        </div>
    </div>
</template>

<script>

import Vue from 'vue'
import Scroll from 'components/Scroll'

import {SecondCrashTask} from '../store/mutation-types'
export default {
  name: 'CrashGroup',
  props:['store','conds','taskid'],
  components:{Scroll},
  data () {
    return {
      B1:[],
      More:{
        // B1:false,
        // C1:false,
        // D1:false,
        // B2:false,
        // C2:false,
        // D2:false,
        // B3:false,
        // C3:false,
        // D3:false,
      },
      Color:{
        B:'#33bbff',
        C:'#52cc52',
        D:'#ff7733'
      },
      group:[
        {name:'U',tip:'交集',type:'join',val:{B1:[],C1:[],D1:[]}},
        {name:'N',tip:'并集',type:'union',val:{B2:[],C2:[],D2:[]}},
        {name:'一',tip:'差集',type:'except',val:{B3:[],C3:[],D3:[]}},
      ],
      //conds:[{id:0},{id:1},{id:2}],
      dragInDoms:null,
      mousemoveid:0,
      mouseupid:0,
      dragData:null,
      dragText:'',
      curDragDom:null,
      dragStartX:0,
      dragStartY:0,
    }
  },
  mounted(){
    this.$store=this.store || this.$store;

    this.mousemoveid=Fx.SingleBind('mousemove',$('body'), (e)=> {
      this.mousemove(e);
    });
    this.mouseupid=Fx.SingleBind('mouseup',$('body'), (e)=> {
      this.mouseup(e);
    });

    this.dragInDoms=$(this.$el).find('div[name="dragIn"]');

    //设置动态属性
    this.setMorePro();
    //设置动态id
    this.genIdens();

    //console.log(this.More);
  },
  destroyed(){
     Fx.ClearBind('mouseup',$('body'),this.mouseupid);
     Fx.ClearBind('mousemove',$('body'),this.mousemoveid);
  },
  methods:{
    noHandler(){},
    //初始化化页面需要的显示更多属性
    setMorePro(){
       let obj = _.extend(..._.chain(tool.Clone(this.group)).pluck('val').flatten().value());
       let keys=_.keys(obj);

       _.each(keys,k=>{
           Vue.set(this.More,k,false);
       });
    },
    //动态为每个分组生成唯一标识
    genIdens(){
       _.each(this.group,v=>{
           _.each(v.val,(val,k)=>{
               val.id=k+tool.guid();
           });
       });
    },
    //根据类型获取指定对象
    getObj(t){
        let s=this,res='';
        for(let i=0;i<s.group.length;i++){
            let g=s.group[i].val;
            for(let key in g){
                if(key != t){continue;}
                res=g[key]; break;
            }

            if(res)break;
        }

        return res;
    },
    //鼠标按下事件
    mousedown(e,d,text){
        //判断是否为B1,C1,D1这种类似数组的元素拖动
        let blnArr=false;
        if(d instanceof Array){
            blnArr=true;
            if(d.length<=0) return;
        }

        let dom =$(e.target || e.srcElement);
        if(blnArr)dom =dom.attr('dataT')?dom:dom.parent('div');

        if(!dom) return;
        let parentDom=$(this.$el);
        let appendDom = dom.clone();
        
        appendDom.addClass('incon_item');
        appendDom.css({'position':'absolute',
                        top:(dom.offset().top - parentDom.offset().top)+'px',
                        left:(dom.offset().left - parentDom.offset().left)+'px',
                        'border':'1px dashed #2f3341',
                        });
        
        if(blnArr){
            appendDom.empty();
            appendDom.append(text);
            appendDom.addClass(`child${appendDom.attr('dataT').substr(0,1)}`);
        }

        appendDom.appendTo(parentDom);
        
        this.dragData=tool.Clone(d);
        this.dragText=text;

        this.curDragDom=appendDom;
        this.dragStartX=e.clientX;
        this.dragStartY=e.clientY;
    },
    mousemove(e){
        let s=this;
        let parentDom=$(this.$el);

    
        if(!this.curDragDom) return;
        let offset=this.curDragDom.offset();
        let left= (offset.left - parentDom.offset().left +e.clientX-this.dragStartX),
            top =(offset.top - parentDom.offset().top +e.clientY-this.dragStartY),
            lw=this.curDragDom.width(),
            lh=this.curDragDom.height();
        this.curDragDom.css({
            left:left+'px',
            top:top+'px',
        });
        this.dragStartX=e.clientX;
        this.dragStartY=e.clientY;

        //判断拖动元素是否进入拖动框中
        
        this.insertDom=null;
        this.dragInDoms.removeClass('active');
        for(let i=0;i<this.dragInDoms.length;i++){
            let item=$(this.dragInDoms[i]),
                ioffset=item.offset(),
                w=item.width(),
                h=item.height(),
                ileft=ioffset.left - parentDom.offset().left,
                itop=ioffset.top - parentDom.offset().top;
            if(top<=itop+h && top>=itop && left>=ileft && left<=ileft+w){
                s.insertDom=item;

            }    
        }

        if(this.insertDom){
            //判断添加元素数据是否已经存在于容易内
            let type = $(this.insertDom).attr('dataT');
            if(this.dragText == type || _.find(this.getObj(type),i=>i.name==this.dragText)){
                s.insertDom=null;
            }else{
                $(this.insertDom).addClass('active');
            }

        }
    },
    //鼠标松开事件
    mouseup(e){
        if(!this.curDragDom) return;
        let s=this;
        this.dragInDoms.removeClass('active');
        this.curDragDom.remove();
        this.curDragDom=null;
        if(this.insertDom){
            let type=$(this.insertDom).attr('dataT');
            this.dragData.name=this.dragText;

            this.dragData.id=this.dragData.id || this.dragData.name;

            this.getObj(type).push(this.dragData);
           
            this.insertDom=null;
            this.dragData=null;
            //s.$emit('dataChange',s.conds,{B1:s.B1,C1:s.C1,D1:s.D1,B2:s.B2,C2:s.C2,D2:s.D2,B3:s.B3,C3:s.C3,D3:s.D3});
        }
    },
    //删除分组项
    delGroup(d,data,showMore){
    
        let s=this;
        if(d=='all'){
            data.splice(0,data.length);
        }else{
            let index = _.findIndex(data,i=>i.id==d.id);
            data.splice(index,1);

            if(data.length<=3){this.More[showMore]=false;}
        }
    },

    //生成提交数据
    genParam(){
        let obj = _.extend(..._.chain(tool.Clone(this.group)).pluck('val').flatten().value());
        let validConds=_.chain(obj).filter(v=>v.length>=2).map(v=>v).value();//包含在分组中的条件对象
        
        let kindsMap=_.map(tool.Clone(this.group),g=>{ return _.map(_.keys(g.val),k=>{ return {[k]:g.type} }) });
            kindsMap=_.extend(..._.flatten(kindsMap));

        
       return _.map(validConds,v=>{
            return {id:v.id,title:'',type:kindsMap[v.id.substr(0,2)] || '',data_source_ids:_.map(v,i=>i.id)}
        });
    },
    add(){
        let param=this.genParam();
        if(param.length<=0){tool.info('条件至少为2个!');return;}
        this.$store.dispatch(SecondCrashTask,{id:this.taskid,cond:param}).then(res=>{
            if(!tool.msg(res,'','添加失败')){return;}

            this.$emit('AddData',param);
            //清空数据
            _.each(this.group,g=>{
                _.each(g.val,(v,k)=>{
                    g.val[k]=[];
                })
            })
        });
    }
  }
}
</script>

<style scoped lang="less">
@import "../css/variables.less";
.CrashGroup{width:100%;height:100%;background-color:white;}

@groupH:140px;
@optionH:40px;
.CrashGroup .group_container{height:@groupH;width:100%;background-color:white;position:relative;}
.CrashGroup .cond_container{height:~'calc(100% - @{groupH} - @{optionH})';width:100%;}
.CrashGroup .cond_container .cond_content{height:~'calc(100% - 40px)';width:100%;text-align:left;}
.CrashGroup .option_bar{height:@optionH;text-align:right;padding-right:10px;line-height:@optionH;}

.CrashGroup .cond_container .cond_content .cond_item{ padding: 5px 10px;line-height: 30px;}
.CrashGroup .cond_container .cond_content .cond_item .icon{float:left;}
.CrashGroup .incon_item{    
    width: 30px;
    height: 30px;
    line-height: 30px;
    background-color: #ff4c6a;
    border-radius: 5px;
    text-align: center;
    color: white;
}
.CrashGroup .cond_container .cond_content .cond_item .content{
    margin-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0px 10px;
}

.CrashGroup .group_container .condGroup_item {
    text-align:left;
    height: 40px;
    margin-bottom: 10px;
    line-height: 40px;
    background-color: #dcdcdc;
}
.CrashGroup .group_container .condGroup_item .info {
    float: left;
    width: 30px;
    text-align: center;
}

.CrashGroup .group_container .condGroup_item .option_bar{
    margin-left: 30px;
    height: 100%;
    padding: 4px 0px;
    padding-right: 5px;
}
.CrashGroup .group_container .condGroup_item .option_bar .option_item{
    float: left;
    width: 32%;
    margin-right: 2%;
    height: 100%;
    background-color: white;
    border-radius: 5px;
    padding: 2px;
    position: relative;
}


.CrashGroup .group_container .condGroup_item .option_bar .option_item:last-child{margin-right:0px;}

.CrashGroup .group_container .condGroup_item .option_bar .option_item .child{
     width: 32%;
    line-height: 27px;
    color: white;
    height: 100%;
    margin-right: 2%;
    text-align: center;
    background-color: #ff4c6a;
    float: left;
    border-radius: 5px;
    position: relative;
}

.CrashGroup .group_container .condGroup_item .option_bar .option_item  .child:nth-child(3n+3){margin-right:0px;}
.CrashGroup .group_container .condGroup_item .option_bar .option_item  .child:nth-child(n+4){margin-top:5px;}

.CrashGroup .group_container .condGroup_item .option_bar .option_item .child:last-child{margin-right:0px;}

.CrashGroup .group_container .condGroup_item .option_bar .option_item.active{background-color:#535353;}

.CrashGroup .group_container .condGroup_item .option_item .groupBtn .delgroup,
.CrashGroup .group_container .condGroup_item .option_bar .option_item .child .delgroup{
    color: white;
    position: absolute;
    top: -7.5px;
    font-size: 1px;
    font-weight: 400;
    right: -7.5px;
    height: 15px;
    line-height: 15px;
    width: 15px;
    background-color: black;
    border-radius: 50%;
    cursor: pointer;
    z-index: 100;
}

.CrashGroup .groupBtn{
    height: 100%;
    width: 100%;
    border-radius: 5px;
    text-align: center;
    line-height: 27px;
    color: white;
    font-size: 12px;
    cursor: pointer;
    position: relative;
    background: #33bbff;
}

.CrashGroup .moreShow {
    position: absolute;
    width: 100%;
    bottom: 100%;
    padding: 5px;
    background-color: #535353;
    z-index: 100;
    border-radius: 5px;
    margin-bottom: 10px;
}

.CrashGroup .moreShow:before{
    content: '';
    width: 0;
    height: 0;
    border-width: 10px 10px 0;
    border-style: solid;
    border-color: #535353 transparent transparent;
    position: absolute;
    bottom: 0px;
    margin-bottom: -10px;
    left: 50%;
    margin-left: -10px;
}

.CrashAnaly .childB{background-color:#33bbff !important;}
</style>
