<!-- 操作页面组件 -->
<template>
    <div class="handle">
       <!--操作按钮容器-->
       <div class="option_btn_container">
            <div class="title">
                <span><i class="fa fa-cog fa-fw title_icon" style="margin-right:5px;"></i>操作按钮</span>
                <div class="bar_container">
                    <el-tooltip class="item" effect="light" content="添加" placement="top">
                        <i class="fa fa-plus" @click="add_option()"></i>
                    </el-tooltip>
                </div>
            </div>
            <div class="content scrollContainer">
                <div class="slidee">
                    <div class="item" v-for="(item,index) in field_btns">
                        <div style="float:left;width:50px;height:100%;font-size:35px;text-align:center;">
                            <i :class="item.menu.icon" style="font-size:30px;"></i>
                        </div>
                        <div style="margin-left:50px;margin-right:0px;font-size:12px;text-align:right;margin-right:5px;">
                           <div>{{item.name}}</div>
                           <div>类型:{{item.type==0?"跳转":"操作"}}
                            <el-tooltip v-show="item.type==0 && item.mapFields && item.mapFields.length>0" effect="light" content="查看映射条件" placement="top">
                                <i style="margin-left:5px;" class="fa fa-info optionInfo" @click="lookMap(item)"></i>
                            </el-tooltip>
                            </div>
                           <div>菜单:{{item.menu.name}}</div>
                        </div>
                        <div style="position:absolute;right:0px;top:0px;width: 30px;height: 100%;font-size: 20px;text-align: center;line-height: 60px;border-left: 1px solid #ebedee;">
                            <i class="fa fa-close" style="cursor:pointer;"  @click="del_btn(index)"></i>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
            <div name="scrolloptionBar" class="scrollbar" v-show="blnShowoptionScroll">
                <div class="handle"></div>
            </div>   
       </div>
       <!--字段操作容器-->
       <div class="field_btn_container">
            <div class="title">
                <span><i class="fa fa-eraser" style="margin-right:5px;"></i>字段操作</span>
                <div class="bar_container">
                    <el-tooltip class="item" effect="light" content="添加" placement="top">
                        <i class="fa fa-plus" @click="add_field_option()"></i>
                    </el-tooltip>
                </div>
            </div>
            <div class="content scrollContainer">
                <div class="slidee">
                    <div class="item" v-for="(item,index) in field_options">
                        <div style="float:left;width:50px;height:100%;font-size:35px;text-align:center;">
                            <i :class="item.menu.icon" style="font-size:30px;"></i>
                        </div>
                        <div style="margin-left:50px;margin-right:0px;font-size:12px;text-align:right;margin-right:5px;">
                           <div>{{item.name}}</div>
                           <div>类型:{{item.type==0?"跳转":"操作"}}
                            <el-tooltip v-show="item.type==0 && item.mapFields && item.mapFields.length>0" effect="light" content="查看映射条件" placement="top">
                                <i style="margin-left:5px;" class="fa fa-info optionInfo" @click="lookMap(item)"></i>
                            </el-tooltip>
                           </div>
                           <div>菜单:{{item.menu.name}}</div>
                        </div>
                        <div style="position:absolute;right:0px;top:0px;width: 30px;height: 100%;font-size: 20px;text-align: center;line-height: 60px;border-left: 1px solid #ebedee;">
                            <i class="fa fa-close" style="cursor:pointer;"  @click="del_option(index)"></i>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
            <div name="scrollfieldBar" class="scrollbar" v-show="blnShowfieldScroll">
                <div class="handle"></div>
            </div>
       </div>
       <!-- 保存操作 -->
       <div class="optionBar_container"  v-show="blnShowSave"><button type="button" class="btn btn-success" @click="save_config()" v-html="saveBtn"></button></div> 
    </div>
</template>

<script>
import { mapState,mapMutations} from 'vuex'
import {Create_Operate,Update_Operate,Set_Handle_data,Reg_Menu_Change_Even,Add_System_Menus,verifySet,Field_Change,BODY_RESIZE,Del_PlaceMenu} from '../store/mutation-types'
// import {tool} from '../js/tool.js'
import ParamPass from '../components/ParamPass'
import IconSelector from '../components/IconSelector'
import optionHandle from '../js/dao/handlePop.js'
import SpecificOps from '../enum/SpecificOps.js'

export default {
  name: 'Handle',
  data () {
    return {
      blnShowSave:true,//是否显示查询按钮
      blnClickSave:true,//是否可以点击保存按钮
      field_btns:[],//字段按钮操作
      field_options:[],//字段操作
      fields:[],//显示字段
      scrolloptionIns:null,//操作按钮滚动插件实例
      blnShowoptionScroll:false,//是否显示操作按钮框滚动插件
      scrolloptionDom:null,//操作按钮滚动条dom元素
      scrollfieldIns:null,//字段按钮滚动插件实例
      blnShowfieldScroll:false,//是否显示字段按钮滚动插件
      scrollfieldDom:null,//字段按钮滚动条dom元素
    }
  },
  watch:{
    config:{
        deep: true,
        handler: function (val, oldVal) {
          this.$store.commit(Set_Handle_data,this.config);
        }
    },
    field_btns(){
       this.$nextTick(()=>{
           this.reloadyotpionScroll();
       });
    },
    field_options(){
        this.$nextTick(()=>{
          this.reloadyfieldScroll();
        });
    }
  },
  computed:mapState({
      menus:state=>{
          let cruMenu= state.setting.curMenu,menus=state.setting.menus;
          let result=[];
          if(!cruMenu){return menus;}
          for(let menu of  menus){
            if(menu.keyid==cruMenu.keyid){continue;}
            result.push(menu);
          }
          return result;
      },
      selTables:state=>{
          return state.setting.tables;
      },
      allTables:state=>{
          return state.setting.allTables;
      },
      menu:state=>{
          return state.setting.curMenu;
      },
      oriMenu:state=>{
          return state.setting.oriMenu;
      },
      config(){
          return {
              field_btns:this.field_btns,
              field_options:this.field_options
          }
      },
      saveBtn(){
         return this.blnClickSave?'保存':'<i class="fa fa-spinner fa-spin"></i>';
      }
  }),
  mounted(){
    //监听选择字段数据改变事件
    this.$store.commit(Field_Change,(res)=>{
        this.fields=res.showFields;
    });
    //监听菜单数据改变事件
    this.$store.commit(Reg_Menu_Change_Even,(menu)=>{
      //console.log(tool.Clone(menu))

      this.blnShowSave=!(menu.isSave && !(menu.condtionsObj && menu.condtionsObj.query_kind.indexOf('show')>=0));
      if(menu.hanldeDataConfig){
          this.field_btns=menu.hanldeDataConfig.field_btns;
          this.field_options=menu.hanldeDataConfig.field_options;
      }else{
          this.field_btns=[];
          this.field_options=[];
      }
    });

     //订阅页面大小改变事件
    this.$store.commit(BODY_RESIZE,()=>{
        this.reloadyotpionScroll();
        this.reloadyfieldScroll();
    });

    //初始化滚动插件
    this.scrolloptionDom=$('div[class="handle"] > div[name="scrolloptionBar"]');
    this.init_option_Scroll();

    this.scrollfieldDom=$('div[class="handle"] > div[name="scrollfieldBar"]');
    this.init_field_Scroll();

  },
  methods:{
      //查看映射信息
      lookMap(item){

          let items=_.map(item.mapFields,m=>{
              return `
                     <div style="width:100%;height:30px;line-height:30px;border:1px solid #e7eaec;border-bottom:none;">
                        <div style="width:50%;display:inline-block;text-align:center;border-right:1px solid #e7eaec;">${m.source.name}</div><div style="width:50%;display:inline-block;text-align:center;">${m.target.name}</div>
                     </div>
                     `;
          }).join('');
          let html=`
                <div style="width:100%;height:30px;line-height:30px;border:1px solid #e7eaec;border-bottom:none;">
                    <div style="width:50%;display:inline-block;text-align:center;border-right:1px solid #e7eaec;">原数据</div><div style="width:50%;display:inline-block;text-align:center;">目标数据</div>
                </div>
                ${items}
              `;
          tool.show({
              title:'映射信息',
              area:'300px',
              content:html
          });
      },
      //初始化操作按钮框滚动插件
      //初始化滚动条
      init_option_Scroll(){
        this.scrolloptionIns = new Sly($('.handle .option_btn_container .scrollContainer'),{
            speed:200,
            scrollBy:50,
            scrollBar:'.handle .option_btn_container .scrollbar',
            dynamicHandle: 0,
            dragHandle: 1,
            mouseDragging: 0});
        
        setTimeout(()=>{
                this.scrolloptionIns.init();
                this.reloadyotpionScroll();
        },0); 
      },
      //重新计算操作按钮滚动条高度
      reloadyotpionScroll(){
        this.scrolloptionIns.reload();
        this.blnShowoptionScroll=this.scrolloptionIns.rel.slideeSize-10>this.scrolloptionIns.rel.frameSize;
        this.setoptionScrollH();
        this.scrolloptionIns.reload();
      },
      //设置操作按钮滚动条高度
      setoptionScrollH(){
        let scrollContainerH=this.scrolloptionDom.height();
        let gap=(this.scrolloptionIns.rel.slideeSize-this.scrolloptionIns.rel.frameSize)*(this.scrolloptionIns.rel.frameSize/this.scrolloptionIns.rel.slideeSize);
        this.scrolloptionDom.find('.handle').css('height',(scrollContainerH-gap)<20?20:(scrollContainerH-gap)+'px');
      },
      init_field_Scroll(){
        this.scrollfieldIns = new Sly($('.handle .field_btn_container .scrollContainer'),{
            speed:200,
            scrollBy:50,
            scrollBar:'.handle .field_btn_container .scrollbar',
            dynamicHandle: 0,
            dragHandle: 1,
            mouseDragging: 0});
        
        setTimeout(()=>{
                this.scrollfieldIns.init();
                this.reloadyotpionScroll();
        },0); 
      },
      //重新计算操作按钮滚动条高度
      reloadyfieldScroll(){
        this.scrollfieldIns.reload();
        this.blnShowfieldScroll=this.scrollfieldIns.rel.slideeSize-10>this.scrollfieldIns.rel.frameSize;
        this.setfieldScrollH();
        this.scrollfieldIns.reload();
      },
      //设置操作按钮滚动条高度
      setfieldScrollH(){
        let scrollContainerH=this.scrollfieldDom.height();
        let gap=(this.scrollfieldIns.rel.slideeSize-this.scrollfieldIns.rel.frameSize)*(this.scrollfieldIns.rel.frameSize/this.scrollfieldIns.rel.slideeSize);
        this.scrollfieldDom.find('.handle').css('height',(scrollContainerH-gap)<20?20:(scrollContainerH-gap)+'px');
      },
      reloadSly(){
         setTimeout(()=>{
           this.reloadyotpionScroll();
           this.reloadyfieldScroll();
        },500); 
      },
      //保存配置对象
      save_config(){
          if(!this.blnClickSave){return;}
        //   console.log(tool.Clone(this.menu.condtionsObj));
        //     return;
          //this.menu.condtionsObj.params = this.menu.condtionsObj.params.condtions[0];
          //this.oriMenu=this.menu;
          //tool.Clone(this.menu,this.oriMenu);
           //console.log(tool.Clone(this.menu));
           //console.log(tool.Clone(this.selTables));
           //return;
         
          //验证数据是否合格
          if(!this.verify(this.menu)){return;}
          //转化菜单选中数据源中可以用来设置限定条件的对象(供字段操作,按钮操作用)
          let indexFields=this.converMapIndexs();

          this.menu.condtionsObj.indexFields=indexFields;//保存数据源预设的索引字段

          let tempData=tool.Clone(this.menu);
          if(tempData.menu_type.menus) delete tempData.menu_type.menus;
          
          if(!tempData.isSave){//新增
            this.blnClickSave=false; 
            this.$store.dispatch(Create_Operate,tempData).then(res=>{
                this.blnClickSave=true;
                this.menu.isSave = tool.msg(res,'添加自定义模块成功!','添加自定义模块失败!');
                this.menu.keyid=res.biz_body.keyid;
                this.menu.orderby=this.menu.keyid;
                this.oriMenu.keyid=res.biz_body.keyid;
                tool.Clone(this.menu,this.oriMenu);
                if(!this.menu.isSave){return;}
                //添加模块带菜单组件
                this.$store.commit(Add_System_Menus,this.menu);
            });
          }else{//修改

            tool.confirm('修改模板会重新生成数据,您确定要继续修改吗?',['确定','取消'],()=>{
               this.blnClickSave=false;
               this.$store.dispatch(Update_Operate,tempData).then(res=>{
                    this.blnClickSave=true;
                    tool.msg(res,'修改自定义模块成功!','修改自定义模块失败!');
                    tool.Clone(this.oriMenu,this.menu);
                });
            },function(){});
           
            // //先删除现在的菜单(然后再新增菜单)
            // this.$store.dispatch(Del_PlaceMenu,{keyid:tempData.keyid}).then(res=>{
            //     if(res.msg.code!='successed')return;
            //     //新增菜单
            //     this.$store.dispatch(Create_Operate,tempData).then(res=>{
            //         this.blnClickSave=true;
            //         this.menu.isSave = tool.msg(res,'修改自定义模块成功!','修改自定义模块失败!');
            //         this.menu.keyid=res.biz_body.keyid;
            //         this.menu.orderby=this.menu.keyid;
            //         this.oriMenu.keyid=res.biz_body.keyid;
            //         tool.Clone(this.menu,this.oriMenu);
            //     });
            // });
          }
      },
      //转化索引为字段映射组件需要的格式
      converIndexs(indexs){
        let self=this;
        let converIndex={};
        for(let indexArrStr of indexs){
            let indexArr=indexArrStr.split(',');
            for(let index of indexArr){
                let tableKey=index.split('@_@')[0],filedKey=index.split('@_@')[1];
                for(let source of self.allTables){
                    if(source.key!=tableKey)continue;
                    let field=source.fields[filedKey];
                    if(!field){continue;}
                    converIndex[index]=converIndex[index] || [];
                    converIndex[index].push({key:index,name:field.name,tableName:source.name,tableKey:source.key,fieldKey:field.key});
                }
            }
        }
        return converIndex;
      },
      
      //转化映射的索引字段为对应的字段对象
      converMapIndexs(){
          let indexFields={};
          for(let table of this.selTables){
            let indexFs=table.indexFields;
            let groupIndex=0;
            for(let requisiteItem of indexFs.requisite){
                let fields=requisiteItem.split(','),gourp=[];
                for(let fieldKey of fields){
                    let field=table.fields[fieldKey];
                    if(!field)continue;
                    gourp.push({key:table.key+'_'+field.key,name:field.name,tableName:table.name,tableKey:table.key,fieldKey:field.key});
                }
                indexFields[table.key+(groupIndex++)]=gourp;
            }

            for(let notRequisiteItem of indexFs.notRequisite){
                //排除独立索引与共享索引相同的数据
                if(indexFs.requisite.join(',').indexOf(notRequisiteItem)>=0)continue;
                let field = table.fields[notRequisiteItem];
                if(!field)continue;
                indexFields[table.key+(groupIndex++)]=[{key:table.key+'_'+field.key,name:field.name,tableName:table.name,tableKey:table.key,fieldKey:field.key}];
            }
          }

          return indexFields;
      },
      //获取索引的字段
      GetIndexs(){
          let blnShowPattern=this.menu.condtionsObj.query_kind.indexOf('show')>=0;//是否为展示模式(否:查询模式)
          let indexs=this.menu.condtionsObj.indexs || [];
          let fields=this.menu.condtionsObj.indexFields || this.converMapIndexs() || [];
          //转化索引为字段映射控件需要的数据格式
          let converIndex=this.converIndexs(indexs);

          return blnShowPattern?fields:converIndex;
      },
      //删除操作按钮
      del_btn(index){
          this.field_btns.splice(index,1);
      },
      //删除字段操作
      del_option(index){
          this.field_options.splice(index,1);
      },
      //添加字段操作
      add_field_option(){
          let self=this;
          let html=`
            <form class="form-horizontal" role="form">
                <div class="form-group" style="margin-bottom:10px !important;">
                    <label class="col-sm-3 control-label" style="font-weight:300;">字段</label>
                    <div class="col-sm-9">
                         <el-select v-model="field" placeholder="请选择">
                            <el-option
                            v-for="item in fields"
                            :label="item.tableName+'_'+item.name"
                            :value="item">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group" style="margin-bottom:10px !important;">
                    <label class="col-sm-3 control-label" style="font-weight:300;">菜单</label>
                    <div class="col-sm-9">
                        <el-select v-model="menu" placeholder="请选择" @change="menuChange">
                            <el-option
                            v-for="item in options"
                            :label="item.name"
                            :value="item">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group" style="margin-bottom:10px !important;margin-top:20px !important;padding:0px 15px;">
                    <ParamPass :result="mapRes" :source="source" :target="target" />
                </div>
            </form>
            <div style="text-align:right;padding-right:15px;">
                <button type="button" class="btn btn-success" @click="submit_btn()">确定</button>
                <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
            </div>
          `;
           tool.open(function(menus,curMenu){
            let param = {
                title:'添加字段操作',
                area:'600px',
                content:`<div class="add_btn_option" style="padding:10px;">${html}</div>`,
                components:{ParamPass},
                context:{
                    field:'',
                    menu:'',
                    source:self.menu && self.menu.condtionsObj.show_fields,//当前菜单显示字段集合
                    target:{},//关联页面允许被指定的映射字段
                    mapRes:curMenu.condtionsObj.field_options.mapFields || [],//映射字段结果集合
                    fields:self.fields || [],
                    options:menus,
                    submit_btn(){
                        let menu =param.selfData.menu;
                        self.field_options.push({
                                                 name:param.selfData.field.name,
                                                 type:0,//0:跳转页面1:具体操作
                                                 key:param.selfData.field.key,
                                                 mapFields:param.selfData.mapRes,
                                                 menu:{keyid:menu.keyid,icon:menu.icon,name:menu.name}
                                                 });
                        param.close();
                    },
                    cancel_btn(){
                        param.close();
                    },
                    menuChange(menu){
                        let blnShowPattern=menu.condtionsObj.query_kind.indexOf('show')>=0;//是否为展示模式(否:查询模式)
                        let indexs=menu.condtionsObj.indexs;
                        let fields=menu.condtionsObj.indexFields;

                        //转化索引为字段映射控件需要的数据格式
                        let converIndex=self.converIndexs(indexs);

                        param.selfData.target=blnShowPattern?fields:converIndex;

                    }
                }
            };
            return param;
           }(self.menus,self.menu));
      },
      //添加按钮操作
      add_option(){
          let self=this;
          let html=`
            <form class="form-horizontal containerBar btnOptionPop" role="form">
                <div class="form-group" style="margin-bottom:10px !important;">
                    <label class="col-sm-2 control-label" style="font-weight:300;">名称</label>
                    <div class="col-sm-10">
                        <el-input placeholder="请输入内容" v-model="name"></el-input>
                    </div>
                </div>
                <div style="margin:10px 15px;">
                    <el-tabs type="border-card">
                        <el-tab-pane label="页面跳转" name="first">
                            <div class="form-group" style="margin-bottom:10px !important;">
                                <label class="col-sm-2 control-label" style="font-weight:300;">菜单</label>
                                <div class="col-sm-10">
                                    <el-select v-model="menu" placeholder="请选择" @change="menuChange">
                                        <el-option
                                        v-for="item in options"
                                        :label="item.name"
                                        :value="item">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="form-group" style="margin-bottom:10px !important;margin-top:20px !important;padding:0px 15px;">
                                <ParamPass :result="mapRes" :source="source" :target="target" />
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="具体操作" name="second">
                            <div class="clearfix" style="margin-bottom:5px;">
                                <label class="col-sm-3 control-label" style="font-weight:300;">操作类型</label>
                                <div class="col-sm-9">
                                    <el-select v-model="kind" placeholder="请选择" @change="optionChange">
                                        <el-option
                                        v-for="item in operateKind"
                                        :label="item.name"
                                        :value="item">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="clearfix" style="margin-bottom:5px;">
                                <label class="col-sm-3 control-label" style="font-weight:300;">操作图标</label>
                                <div class="col-sm-9">
                                    <div class="icon_container">
                                    <div class="btn" @click="select_icon()"><i class="fa fa-navicon"></i></div>
                                    <div class="info"><i :class="icon"></i></div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group" style="margin-bottom:10px !important;margin-top:20px !important;padding:0px 15px;">
                                <el-checkbox style="margin-left:40px;font-weight:normal;" v-model="commonOption">公共操作</el-checkbox>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="特定操作" name="third">
                            <div class="clearfix" style="margin-bottom:5px;">
                                <label class="col-sm-3 control-label" style="font-weight:300;">操作类型</label>
                                <div class="col-sm-9">
                                    <el-select v-model="kind" placeholder="请选择" @change="optionChange">
                                        <el-option
                                        v-for="item in SpecificOps"
                                        :label="item.name"
                                        :value="item">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="clearfix" style="margin-bottom:5px;">
                                <label class="col-sm-3 control-label" style="font-weight:300;">操作图标</label>
                                <div class="col-sm-9">
                                    <div class="icon_container">
                                    <div class="btn" @click="select_icon()"><i class="fa fa-navicon"></i></div>
                                    <div class="info"><i :class="icon"></i></div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group" style="margin-bottom:10px !important;margin-top:20px !important;padding:0px 15px;">
                                <ParamPass :result="mapRes" :source="source" :target="sepTarget" />
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </form>
            <div class="optionBar" style="text-align:right;padding-right:15px;">
                <button type="button" class="btn btn-success" @click="submit_btn()">确定</button>
                <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
            </div>
          `;

           tool.open(function(menus,curMenu,store){
            let param = {
                title:'添加按钮操作',
                area:'600px',
                content:`<div class="add_btn_option" style="padding:10px;">${html}</div>`,
                components:{ParamPass},
                context:{
                    name:'',
                    menu:'',
                    source:self.menu && self.menu.condtionsObj.query_fields,//当前菜单查询字段集合
                    target:{},//关联页面允许被指定的映射字段(页面跳转用)
                    sepTarget:self.GetIndexs(),//允许映射的字段(特定操作用)
                    mapRes:curMenu.condtionsObj.field_btns.mapFields || [],//映射字段结果集合
                    options:menus,
                    kind:null,//操作类型
                    icon:'',//具体操作项的icon值
                    commonOption:false,//是否为公共操作(false:对应的数据行操作,ture:针对整个列表的操作)
                    operateKind:optionHandle.getSourceAction(self.menu,self.selTables),//具体数据源允许执行的操作
                    SpecificOps:SpecificOps,//特定操作执行项(如:路径)
                    submit_btn(){
                        let menu =param.selfData.menu,kind=param.selfData.kind;
                        //设置页面跳转按钮
                        if(menu){
                            self.field_btns.push({
                                name:param.selfData.name,
                                type:0,//0:跳转页面1:具体操作
                                menu:{keyid:menu.keyid,icon:menu.icon,name:menu.name},
                                mapFields:param.selfData.mapRes
                            });
                        }

                        //设置具体操作按钮
                        if(kind && !kind.type){
                            self.field_btns.push({
                                name:param.selfData.name || kind.name,
                                type:1,//0:跳转页面1:具体操作
                                menu:{keyid:self.menu.keyid,icon:param.selfData.icon,name:self.menu.name},
                                icon:param.selfData.icon,
                                value:kind,
                                blnCom:param.selfData.commonOption //是否为功能操作
                            });
                        }

                        //特定操作
                        if(kind && kind.type==2){
                            self.field_btns.push({
                                name:param.selfData.name,
                                type:2,//0:跳转页面1:具体操作2:特定操作
                                menu:{keyid:menu.keyid,icon:menu.icon,name:menu.name},
                                value:kind,
                                mapFields:param.selfData.mapRes
                            });
                        }

                        param.close();
                    },
                    cancel_btn(){
                        param.close();
                    },
                    //页面跳转下拉框选择改变事件
                    menuChange(menu){
                        if(!menu){return;}
                        let data=param.selfData;
                        data.clearOptionSetting();

                        let blnShowPattern=menu.condtionsObj.query_kind.indexOf('show')>=0;//是否为展示模式(否:查询模式)
                        let indexs=menu.condtionsObj.indexs || [];
                        let fields=menu.condtionsObj.indexFields || [];
                        //转化索引为字段映射控件需要的数据格式
                        let converIndex=self.converIndexs(indexs);
                        param.selfData.target=blnShowPattern?fields:converIndex;
                    },
                    //页面操作下拉框选择改变事件
                    optionChange(menu){
                        if(!menu || !menu._key){return;}
                        let data=param.selfData;
                        data.clearMenuSetting();
                    },
                    //清除页面跳转相关设置信息
                    clearMenuSetting(){
                        let data=param.selfData;
                        data.target={};
                        data.mapRes=[];
                        data.menu='';
                    },
                    //清除页面操作相关设置信息
                    clearOptionSetting(){
                        let data=param.selfData;
                        data.commonOption=false;
                        data.kind=null;
                        data.icon='';
                    },
                    //选择图标操作
                    select_icon(){
                        tool.open(function(store,icon,params){
                            let ins={
                                title:'图标选择',
                                area:['80%','80%'],
                                offset:'50px',
                                components:{
                                    IconSelector
                                },
                                context:{
                                    store:store,
                                    icon:icon,
                                    ok_btn(){
                                        params.selfData.icon=ins.$vm.$refs.iconSelector.value;
                                        ins.close();
                                    },
                                    cancel_btn(){
                                        ins.close();
                                    }
                                },
                                methods:{
                                    iconChange(value){
                                        this.icon=value;
                                    }
                                },
                                content:`<div class="iconSelector_container">
                                            <div class="icons">
                                                <IconSelector ref="iconSelector" :store="store" :value="icon" v-on:iconChange="iconChange"></IconSelector>
                                            </div>
                                            <div class="option_bar">
                                                <button type="button" class="btn btn-success" @click="ok_btn()">确定</button>
                                                <button type="button" class="btn btn-default" @click="cancel_btn()">取消</button>
                                            </div>
                                        </div>`,
                                success(){
                                    setTimeout(()=>{ins.$vm.$refs.iconSelector.reloadSly();},500);
                                }
                            };

                            return ins;
                        }(store,param.selfData.icon,param));
                    }
                }
            };
            return param;
           }(self.menus,self.menu,self.$store));
      }
  }
}
</script>
<style lang="less">
    //操作字段弹窗样式
    .btnOptionPop .el-tabs{display:block !important;}

    //操作按钮弹窗样式
    .add_btn_option .form-horizontal .icon_container{width:100%;height:36px;line-height:36px;border: 1px solid #C0CCDA;border-radius: 5px;}
    .add_btn_option .form-horizontal .icon_container .btn{float:right;width:36px;border-left:1px solid #C0CCDA;cursor:pointer;border-radius: 0px;}
    .add_btn_option .form-horizontal .icon_container .info{height:36px;margin-right:37px;text-align: center;}
</style>

<style scoped lang="less">
  @import "../css/variables.less";

  @optionBarH:200px;
  @optionBar_title_H:30px;
  @optionBar_container_H:40px;
  .handle{width:100%;height:100%;background-color:@FrontCol;padding:15px;}
  .handle .option_btn_container{height:@optionBarH;text-align:left;position:relative;}
  .handle .field_btn_container{text-align:left;height:~"calc(100% - @{optionBarH} - @{optionBar_container_H})";position: relative;}
  .handle .optionBar_container{text-align:right;height:@optionBar_container_H;}

  .handle .field_btn_container .title,
  .handle .option_btn_container .title{height:@optionBar_title_H;.border('bottom');line-height:@optionBar_title_H;padding-left:10px;}
  
  .handle .field_btn_container .content{width:100%;height:~"calc(100% - @{optionBar_title_H})";overflow-y:auto;}
  .handle .option_btn_container .content{width:100%;height:~"calc(100% - @{optionBar_title_H})";overflow-y:auto;}


  .handle .field_btn_container .bar_container,
  .handle .option_btn_container .bar_container{float:right;}
  .handle .field_btn_container .bar_container .item,
  .handle .option_btn_container .bar_container .item{cursor:pointer;}
  
  .handle .field_btn_container .content,
  .handle .option_btn_container .content{padding:10px 0px;}
  .handle .field_btn_container .content .item{
       float:left;position:relative;margin:10px;
       min-width:170px;border-radius: 5px;background:@btn_Bg_Col_hover_1;color:white;height:60px;padding:5px;padding-right:30px;
  }
  .handle .option_btn_container .content .item{
      float:left;position:relative;margin:10px;
      min-width:170px;border-radius: 5px;background:#1d365d;color:white;height:60px;padding:5px;padding-right:30px;
  }

  .handle .field_btn_container .content .item .close_label{
    width: 40px;text-align: center;position: absolute;top: -30px;right: -1px;border-width: 0px 0px 20px 15px;
    border-style: none solid solid;border-color: transparent transparent #52bf8a;height: 30px;line-height: 40px;color: white;
  }
  .handle .option_btn_container .content .item .close_label{
    width: 40px;text-align: center;position: absolute;top: -30px;right: -1px;border-width: 0px 0px 20px 15px;
    border-style: none solid solid;border-color: transparent transparent #1d365d;height: 30px;line-height: 40px;color: white;
  }

  .handle .field_btn_container .content .item .close_label,
  .handle .option_btn_container .content .item .close_label:hover{cursor:pointer;}

  .handle .field_btn_container .content .close_btn,
  .handle .option_btn_container .content .close_btn{
    position: absolute;
    top:0px;
    right: 0px;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    cursor:pointer;
  }
  .handle .field_btn_container .content .close_btn:hover,
  //.handle .option_btn_container .content .close_btn:hover{color:@Font_Hover_Col;}

  html{.TCol(~".handle .option_btn_container .content .close_btn:hover");}

  //下拉框样式
  .scrollContainer{width:100%;height:100%;position: relative;}
  .scrollbar:hover {cursor:pointer;}
  .scrollbar { border:1px solid @borderCol;width: 10px; height: ~"calc(100% - 30px - 20px)"; position: absolute;right: 5px;top: 30px;background:white;margin-top:10px;}
  .scrollbar .handle {width: 100%;height: 100px;background: @btn_Bg_Col_1;padding:0px !important;}

  .blnPage .scrollbar{display:block;}

  //.optionInfo:hover{cursor:pointer;color:@btn_Bg_Col_hover_0;}

  html{.TColAdd(~".optionInfo:hover");}
</style>
