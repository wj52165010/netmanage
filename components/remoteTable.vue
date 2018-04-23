<!-- 远程数据展示组件 -->
<template>
    <div class="RemoteTable">
         <div class="left">
            <div class="title">远程项</div>
            <div class="content">
                <scroll :listen="sources" ref="sourceScroll">
                    <div class="item" v-for="(t,i) in tags" :class="{active:curSelId==t.id}" @click="tagClick(t)">
                        <span style="font-style: italic;margin-right:5px;">{{i+1}}.</span><span>{{t.name}}</span>
                    </div>
                </scroll>
            </div>
         </div>
         <div class="right">
            <div name="RemoteTable_table_container" class="table_container">
                <el-table :data="res[curSelId] || []" :height="listH" :max-height="listH || 0" :empty-text="statusText"  border stripe style="width: 100%" :ccontext="item" @row-click="rowClick">
                    <el-table-column v-for="field in (item.orderFields || [])" inline-template  :width="field.columnW || 'auto'"  :label="field.name">
                        <div @click="column_click(row,field,item)" :title="converShowInfo(row,field)">
                            <span :style="{'text-decoration':blnClickField(field,item.field_options)?'underline':'none',cursor:blnClickField(field,item.field_options)?'pointer':'default'}">{{converShowInfo(row,field)}}</span>
                        </div>
                    </el-table-column>
                    <el-table-column v-if="item.options && item.options.length>0" align="center" :width="calOptionW(item.options)" fixed="right" inline-template  label="操作" >
                        <div>
                            <span class="option_btn" v-for="option in item.options" @click="option_click(option,$index,item.id,row,item.queryFields,item.keyid,item.data,item.queryKind)" >{{option.name}}</span>
                        </div>
                    </el-table-column>
                </el-table>
            </div>
            <div name="page_container" class="page_container">
                <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageData[curSelId].pageIndex+1}}</span></span>
                <div class="firstPage" @click="pageChange(0,pageData[curSelId],item.limit)">首页</div>
                <div class="prePage" @click="pageChange(pageData[curSelId].pageIndex-1,pageData[curSelId],item.limit)">上一页</div>
                <div class="nextPage" @click="pageChange(pageData[curSelId].pageIndex+1,pageData[curSelId],item.limit)">下一页</div>
            </div>
         </div>
         <!--加载中动画-->
        <div class="loading" v-show="blnSearch"><div :id="id+'inloading'" class="loadingContainer"></div></div>
    </div>
</template>

<script>
import {BODY_RESIZE,GET_CONFIG,Add_History_Menu,Get_Operate,Get_OPerate_Data,Add_System_Menus,GetInterface} from '../store/mutation-types'
import { mapState,mapMutations} from 'vuex'
import tmpDAO from '../js/dao/tmpDao.js'
import handlePop from '../js/dao/handlePop.js'
import scroll from 'components/scroll'
import cLoading from '../js/canvasLoading.js'
export default {
  name: 'RemoteTable',
  props:['data','params','remoteIds','converShowInfo','blnClickField','calOptionW'],
  components:{scroll},
  data () {
    return {
      id:'',
      blnSearch:false,
      listH:0,
      item:{},
      sources:[],
      curSelId:-1,//当前选中Tag,id
      tags:[],//远程数据项
      res:{},//查询结果集
      pageData:{'-1':{pageIndex:0,skip:0}},//分页数据
    }
  },
  mounted(){
      this.id='page_'+tool.guid();
      this.$nextTick(()=>{
        cLoading(this.id+'inloading',7);
      });
      
      this.item=tool.Clone(this.data,'','comOptions');
      this.$store.commit(BODY_RESIZE,()=>{
          this.calListH()
      });
  },
  computed:mapState({
    statusText(){
         let status=this.params.model.status || {status:this.Menu_State.getKey('完成')},mapStatus=this.Menu_State.getRes(status);
         if(this.Menu_State.getKey('完成')==mapStatus.code){return this.emptyInfo || '暂无数据';}

         return mapStatus.info;
     },
     oriMenus:state=>{
         return state.menus;
     },
     Rx:state=>{return state.Rx;},
     VirType:state=>{return state.VirType;}
  }),
  methods:{
      //刷新页面数据
      refreshPage(){
          this.pageChange(0,this.pageData[this.curSelId],this.item.limit);
      },
      //tag项单击事件
      tagClick(t){
        this.curSelId=t.id;
      },
      //计算列表显示高度
      calListH(){
        this.listH=$(this.$el).find('div[name="RemoteTable_table_container"]').height();
        if(!this.$refs.sourceScroll)return;
        this.$refs.sourceScroll.reloadyScroll();
      },
      rowClick(row,e,config,index){
        if(!config || _.keys(config.templateSet)<=0)return;
        let tmpSet=config.templateSet[tempType['列表'].id];

        config.curSelIndex ==index ? config.curSelIndex=-1 :config.curSelIndex=index;

        _.each(tmpSet,r=>{
            if((row[r.alias] || row[r.key]) && config.curSelIndex>=0){
                r.value=row[r.alias] || row[r.key];
            }else{
                r.value='';
            }
        })
      },
      //blnOld:是否为旧的查询
      //remoteId:指定的远程数据ID
      //skip:跳过多少条数据
      query_click(callback,blnOld,remoteId,skip){
        if(!blnOld){
            this.item=tool.Clone(this.data,'','comOptions');
            this.tags=tool.Clone(this.remoteIds);
            this.tagClick(this.tags[0]);
            this.pageData=_.chain(this.tags).indexBy('id').each(t=>{t.skip=0;t.pageIndex=0;}).value();
        }
        let config=this.item,condtion=config.queryCondition,model=config.condtion,keyid=config.keyid;

        let {param:result,sepParam} = tmpDAO.searchParam(condtion.concat(config.extraConditon || []),model);

        //本地数据查询
        //获取模板数据
        this.blnSearch=true;
        model.skip=skip || 0;

        let tempDatePre=(new Date()).getTime();
        this.$store.dispatch(Get_OPerate_Data,{interface:remoteId!==undefined?remoteId+'':_.map(this.tags,t=>t.id).join(','),keyid:keyid,extraData:result,indexFields:sepParam,condtionsObj:model}).then(res=>{
            console.log((new Date()).getTime()-tempDatePre);
            if(callback){callback(res.biz_body)}
            this.blnSearch=false;
            let blnSucess = tool.msg(res,'','获取模板数据失败!');
            if(!blnSucess){return;}
            if(remoteId!=undefined){
                this.res[remoteId]=res.biz_body[remoteId];
            }else{
                this.res=res.biz_body;
            }
        });
      },
      //页号改变事件
      pageChange(number,item,limit){
        let tempModel = tool.Clone(item.condtion),skip=0;
        
        if(number>=0){
         skip=limit*number;
        }else{
          number=0;
          skip=limit*number;
        }
        this.blnShowLoading=true;
        this.query_click((data)=>{
            this.blnShowLoading=false;
            if(data.length<=0){
                tool.msg({msg:{code:'successed'}},'已经到了最后页!','已经到了最后页!');
                return;
            }
            item.skip=item.limit*number;
            item.pageIndex=number;
        },true,this.curSelId,skip);

      },
      //列单击事件
      column_click(row,field,column){
        let s=this;
        let field_options=column.field_options,redirectMenu=null,option=null;
        if(!(field_options && field_options.length>0))return;
        for(let field_option of  field_options){
            if(field_option.key != field.key){continue;}
            redirectMenu=field_option.menu;
            option=field_option;
        }
        if(!option){return;}
        //判断是否存在附加限定条件，存在则转换格式
        let extraConditon;
        if(option.mapFields.length>0){
            extraConditon=extraConditon || [];
            for(let field of option.mapFields){
                extraConditon.push({filed:{
                        table:field.target.tableKey,
                        key:field.target.fieldKey,
                        alias:field.target.key,
                        value:row[field.source.key] || row[field.target.fieldKey]
                    },
                    value:row[field.source.key] || row[field.target.fieldKey]
                });
            }
        }


        if(!redirectMenu)return;

         //获取菜单
        let getMenu = this.Rx.Observable.create(obs=>{
            let menu = _.chain(this.oriMenus).pluck('menus').flatten().compact().find(item=>{return item.keyid==redirectMenu.keyid;}).value();
            if(menu){obs.next(menu); return;}
            this.$store.dispatch(Get_Operate,redirectMenu.keyid).then(res=>{
                obs.next(res.biz_body[0]);
                this.$store.commit(Add_System_Menus,res.biz_body[0]);
            });
        });


        getMenu.subscribe(menu=>{
              if(!menu.kind){//列表模板页面
                this.$store.commit(Add_History_Menu,{
                        id:'field_menu_'+tool.guid(),
                        keyid:menu.keyid,
                        name:redirectMenu.name,
                        type:menu.type || 'templatePage',
                        icon:menu.icon || 'fa fa-history',
                        condtionsObj:menu.condtionsObj || {},
                        status:menu.status,
                        extraConditon:extraConditon,
                        interface:_.map(s.tags,t=>t.id).join(',') || ''
                });
              }else if(menu.kind==1){//HTML模板页面
                  let temp_area=menu.popWidth?menu.popHeight?[menu.popWidth+'px',menu.popHeight+'px']:menu.popWidth+'px':'';
                  tmpDAO.openTmp(menu,{extraConditon:extraConditon,interface:s.curSelId+''},this.$store,{title:field.name,area:temp_area});
              }
          });
      },
      //操作栏项单击事件
      option_click(option,index,id,row,fields,keyid,list,queryKind){
          let s=this;
          //跳转页面操作
          if(!option.type || option==0){
            //判断是否存在附加限定条件，存在则转换格式
            let extraConditon;
            if(option.mapFields.length>0){
                extraConditon=extraConditon || [];
                for(let field of option.mapFields){
                    extraConditon.push({filed:{
                            table:field.target.tableKey,
                            key:field.target.fieldKey,
                            alias:field.target.key,
                            value:row[field.source.key] || row[field.target.fieldKey]
                        },
                        value:row[field.source.key] || row[field.target.fieldKey]
                    });
                }
            }
            
            //获取菜单
            let getMenu = this.Rx.Observable.create(obs=>{
                let menu = _.chain(this.oriMenus).pluck('menus').flatten().compact().find(item=>{return item.keyid==option.menu.keyid;}).value();//从缓存中获取
                if(menu){obs.next(menu); return;}
                this.$store.dispatch(Get_Operate,option.menu.keyid).then(res=>{ //从服务器获取
                    obs.next(res.biz_body[0]);
                    this.$store.commit(Add_System_Menus,res.biz_body[0]);
                });
            });

            getMenu.subscribe(menu=>{
                if(!menu.kind){//列表模板页面
                    this.$store.commit(Add_History_Menu,{
                            id:id+'_'+index+'_'+menu.keyid,
                            keyid:menu.keyid,
                            name:option.name,
                            type:menu.type || 'templatePage',
                            icon:menu.icon || 'fa fa-history',
                            condtionsObj:menu.condtionsObj || {},
                            status:menu.status,
                            extraConditon:extraConditon,
                            interface:_.map(s.tags,t=>t.id).join(',') || ''
                    });
                }else if(menu.kind==1){//HTML模板页面
                    let temp_area=menu.popWidth?menu.popHeight?[menu.popWidth+'px',menu.popHeight+'px']:menu.popWidth+'px':'';
                    tmpDAO.openTmp(menu,{extraConditon:extraConditon,interface:s.curSelId+''},this.$store,{title:option.name,area:temp_area});
                }
            });
          }
          //特定操作(增删改查等)
          if(option.type==1){
            handlePop.play(option,{},row,fields,this.$store,keyid,list,queryKind,null,s.curSelId+'');
          }
      },
  }
}
</script>

<style scoped lang="less">
  @import "../css/variables.less";
  .RemoteTable{width:100%;height:100%;.border('top');}

  @leftW:150px;
  .RemoteTable .left{float:left;width:@leftW;height:100%;.border('right');}
  .RemoteTable .right{margin-left:@leftW;height:100%;}
  
  @pageH:40px;
  .RemoteTable .table_container{height:~'calc(100% - @{pageH})';width:100%;}

  @titleH:39px;
  .RemoteTable .left .title{height:@titleH;text-align:center;line-height:@titleH;background-color:@Font_Hover_Col;color:white;}
  .RemoteTable .left .content{width:100%;height:~'calc(100%  - @{titleH})';}
  .RemoteTable .left .content .item{
      width:@leftW;line-height:30px;.border('bottom');padding:0px 10px; cursor:pointer;
      overflow: hidden;text-overflow: ellipsis;white-space: nowrap;
   }

   .RemoteTable .left .content .item.active{background-color:@btn_Bg_Col_hover_0;color:white;}
   .RemoteTable .table_container .option_btn{margin-right:10px;cursor:pointer;}
   .RemoteTable .table_container .option_btn:hover{color:@Font_Hover_Col;}

   //加载中动画
    .loading{position: absolute;top:0px;left:0px;right:0px;bottom:0px;}
    .loadingContainer{text-align: center;position: absolute;left: 50%;margin-left: -50px;top: 50%;margin-top: -50px;}
</style>
