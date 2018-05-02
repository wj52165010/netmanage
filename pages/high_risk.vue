<!-- 高危库页面组件 -->
<template>
    <div class="HighRisk">
        <div class="page">
            <HList title="高危库" ref="hlist" :class="{hasPage:kind.val==0,noPage:kind.val!=0}" :action="action" :data="data" :header="header" :column="column"  :showField="showField" :blnNoSel="true"
                :rowAction="rowAction" :searchAction="searchAction" @seachName="seachName"
                @addPerson="addPerson" @delPerson="delPerson" @updatePerson="addPerson" @pageChange="pageChange" :pageNum="pageNum"
                :tag_action="kinds" @kindchange="kindchange" :blnNoPage="blnNoPage"
            />
        </div>
        <!--加载中标识-->
        <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;">
          <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;"><i class="fa fa-spinner fa-pulse"></i></div></div>
        </div>
    </div>
</template>

<script>
import cSelect from 'components/Select'
import HList from 'components/HList'
import cInput from 'components/Input'
import MulSelect from 'components/MulSelect'
import AttenType from '../enum/AttenType'
import {GetIdenPerson,AddIdentity,GetIndentity,DelIndentity,AddIdenPerson,UpdateIdenPerson,DelIdenPerson,GetIdenPersonDetail} from '../store/mutation-types'

export default {
  name: 'HighRisk',
  components:{cSelect,HList,cInput,MulSelect},
  data () {
    return {
       pageNum:0,
       showNum:10,
       blnNoPage:true,//是否显示分页控件
       kind:{name:'人员详细',val:0},//当前选中类型
       kinds:[{name:'人员详细',val:0,icon:'fa fa-user-circle-o',action:'kindchange'},{name:'人员信息',val:1,icon:'fa fa-user',action:'kindchange'}],
       data:[], //当前显示信息
       persons:[],//人员信息
       perdetails:[],//人员详细信息
       header:[],//['姓名','身份证','手机','mac','人员类型','关注方式'],  //头部信息
       column:[],//[{width:200},{width:200},{width:150},{width:200},{width:200,align:'center'},{width:0}],
       showField:'',//'key_identity_name,key_identity_cert,key_identity_mobile,key_identity_mac,personType,perFollows',
       action:[],//[{name:'添加人员',action:'addPerson',icon:'fa fa-plus'}],
       personType:[],//人员类型
       rowAction:[],//[{name:'修改',action:'updatePerson',icon:'fa fa-pen'},{name:'删除',action:'delPerson',icon:'fa fa-plus'}],
       searchAction:[],//[{name:'人员名称',action:'seachName'}]
       blnLoading:false,
    }
  },
  mounted(){
    this.loadData();
    this.kindchange(this.kinds[0]);
  },
  computed:{
    converPersons(){
        if(this.persons.length<=0){return [];}
        
        return  _.map(this.persons,per=>{
            per.personType=_.map(per.key_identity_types,i=>{
               return (_.find(this.personType,item=>{return item.key_identity_type_id==i}) || {name:''}).name;
            }).join(',');
            per.perFollows=_.compact(_.map(per.follows,i=>{
               return ((_.find(AttenType,item=>{return item.val==i}) || {name:''}) || {name:''}).name; 
            })).join(',');
            return per;
        });
    },
    converPerdetails(){
        if(this.perdetails.length<=0){return this.perdetails;}
        return _.map(this.perdetails,per=>{
            per.perKind=_.map(per.key_identity_type,i=>{
               return (_.find(this.personType,item=>{return item.key_identity_type_id==i}) || {name:''}).name;
            }).join(',');

            return per;
        });
    }
  },
  methods:{
      //刷新页面
      refreshPage(){
          this.loadData();
      },
      loadData(){
        //获取人员类型信息
        this.$store.dispatch(GetIndentity,{}).then(res=>{
            if(res.msg.code!='successed')return;
            this.personType=_.map(res.biz_body,item=>{item.name=item.key_identity_type_title;item.note=item.key_identity_type_note; return item;});
            //获取人员信息
            this.$store.dispatch(GetIdenPerson,{}).then(ress=>{
                if(ress.msg.code!='successed')return;
                this.persons=ress.biz_body;
            });
            //获取人员详细信息
            this.getPerdetails();
        });
      },
      //分页事件
      pageChange(pageNum){
        this.pageNum=pageNum>0? pageNum : 0;;
        this.getPerdetails();
      },
      //获取人员详细数据
      getPerdetails(){
        this.blnLoading=true;
        this.$store.dispatch(GetIdenPersonDetail,{id:'',limit:this.showNum,skip:this.pageNum * this.showNum}).then(res=>{
            this.blnLoading=false;
            if(res.msg.code!='successed')return;
            let data=res.biz_body;
            if(data.length<=0){
                tool.msg({msg:{code:'successed'}},'已经到了最后页!','已经到了最后页!');
                this.pageNum=this.pageNum-1;
                return;
            }
            this.perdetails=data;
            this.kindchange(this.kind);
        });
      },
      //类型改变事件
      kindchange(kind){
        this.kind=kind;
        switch(kind.val){
            case 0://人员详细
                this.blnNoPage=false;
                this.column=[{width:200,align:'center'},{width:0,align:'center'},{width:150,align:'center'},{width:200,align:'center'},{width:200,align:'center'},{width:200,align:'center'}];
                this.header=['人员名称','人员类型','重点库名','证件类型','证件号','MAC'];
                this.rowAction=[];
                this.showField='customer_name,perKind,source_id,certificate_type,certificate_code,mac';
                this.action=[];
                this.searchAction=[];
                this.data=this.converPerdetails;
                break;
            case 1://人员信息
                this.blnNoPage=true;
                this.column=[{width:200,align:'center'},{width:200,align:'center'},{width:150,align:'center'},{width:200,align:'center'},{width:200,align:'center'},{width:0,align:'center'}];
                this.header=['姓名','身份证','手机','mac','人员类型','关注方式'];
                this.rowAction=[{name:'修改',action:'updatePerson',icon:'fa fa-pen'},{name:'删除',action:'delPerson',icon:'fa fa-plus'}];
                this.showField='key_identity_name,key_identity_cert,key_identity_mobile,key_identity_mac,personType,perFollows';
                this.action=[{name:'添加人员',action:'addPerson',icon:'fa fa-plus'}];
                this.searchAction=[{name:'人员名称',action:'seachName'}];
                this.data=this.converPersons;
                break;
        }

        this.$nextTick(()=>{this.$refs.hlist.reloadyScroll()})
      },
      //根据人员名称查询
      seachName(val){
        this.$store.dispatch(GetIdenPerson,{key_identity_name:val}).then(res=>{
            if(res.msg.code!='successed')return;
            this.persons=res.biz_body;
            this.data=this.converPersons;
        });
      },
      //删除人员
      delPerson(val){
        tool.confirm('您确定要删除该人员信息吗?',['确定','取消'],()=>{
            let index= _.findIndex(this.persons,per=>{return per.key_identity_id==val.key_identity_id;});
            this.$store.dispatch(DelIdenPerson,{id:val.key_identity_id}).then(res=>{
                if(!tool.msg(res,'删除人员成功!','删除人员失败!'))return;
                this.persons.splice(index,1);
                this.data=this.converPersons;
            });
        },function(){});
      },
      //新增人员
      addPerson(valup){
          let self=this;
          tool.open(function(){

            let html=`<div class="addPerson_Pop">
                        <div class="item clearfix">
                            <span class="title">姓名:</span>
                            <div class="input" style="margin-top:-2px;"><cInput label="姓名" @change="nameChange" :val="name" /></div>
                        </div>
                        <div class="item clearfix">
                            <span class="title">身份证:</span>
                            <div class="input" style="margin-top:-2px;"><cInput label="身份证" @change="certChange" :val="cert" /></div>
                        </div>
                        <div class="item clearfix">
                            <span class="title">手机:</span>
                            <div class="input" style="margin-top:-2px;"><cInput label="手机" @change="mobileChange" :val="mobile" /></div>
                        </div>
                        <div class="item clearfix">
                            <span class="title">MAC:</span>
                            <div class="input" style="margin-top:-2px;"><cInput label="MAC" @change="macChange" :val="mac" /></div>
                        </div>
                        <div class="item clearfix">
                            <span class="title">人员类型:</span>
                            <div class="input" style="padding-top:10px;"><MulSelect ref="relativePerson" :defaultVal="defTypes" :selItems="types" :blnDel="true" @add="addPersonType" @del="delPersonType" keyid="key_identity_type_id" /></div>
                        </div>
                        <div class="item clearfix">
                            <span class="title">关注方式:</span>
                            <div class="input select">
                                <el-checkbox-group v-model="follows">
                                    <el-checkbox v-for="item in atten_way" :label="item.val">{{item.name}}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                        <div class="option_bar">
                            <button type="button" class="btn btn-success" style="font-size:12px;"  @click="submit">
                                <i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i><span v-show="!blnSearch">确定</span>
                            </button> 
                            <button type="button" class="btn btn-default" style="font-size:12px;" @click="cancel">取消</button>
                        </div>
                      </div>`;
            let param={
                title:valup?'修改人员':'添加人员',
                content:html,
                area:'600px',
                components:{cInput,MulSelect},
                context:{
                    blnSearch:false,//是否正在执行新增操作
                    name:valup?valup.key_identity_name:'',//姓名
                    cert:valup?valup.key_identity_cert:'',//身份证
                    mobile:valup?valup.key_identity_mobile:'',//手机
                    mac:valup?valup.key_identity_mac:'',//mac地址
                    types:self.personType,//重点人员类型
                    defTypes:valup?_.map(valup.key_identity_types,i=>{
                        return _.find(self.personType,item=>{return item.key_identity_type_id==i});
                    }):[],  //默认重点人员类型
                    follows:valup?valup.follows:[],//关注方式
                    atten_way:AttenType,
                    nameChange(val){param.selfData.name=val;},
                    certChange(val){param.selfData.cert=val;},
                    mobileChange(val){param.selfData.mobile=val;},
                    macChange(val){param.selfData.mac=val;},
                    addPersonType(val){
                        self.$store.dispatch(AddIdentity,{key_identity_type_title:val[val.length-1].name,key_identity_type_note:val[val.length-1].note}).then(res=>{
                            if(res.msg.code!='successed')return;
                            val[val.length-1].law_case_id=res.biz_body[0].key_identity_type_id;
                            val[val.length-1].key_identity_type_id=res.biz_body[0].key_identity_type_id;
                            param.selfData.types.push({name:val[val.length-1].name,note:val[val.length-1].note,key_identity_type_id:res.biz_body[0].key_identity_type_id});

                        });
                    },
                    //删除人员类型
                    delPersonType(val){
                        self.$store.dispatch(DelIndentity,val.key_identity_type_id).then(res=>{
                            if(res.msg.code!='successed')return;
                            // console.log(Fx.Clone(param.selfData.types));
                            // console.log(val.key_identity_type_id);
                            // let index = _.findIndex(param.selfData.types,type=>{return type.key_identity_type_id==val.key_identity_type_id;});
                            // console.log(index);
                            //param.selfData.types.splice(index,1);
                        });
                    },
                    submit(){
                        let data=param.selfData;
                        if(data.blnSearch){return;}
                        data.blnSearch=true;
                        let personTypes = _.map(param.$refs.relativePerson.$data.data,item=>{return item.key_identity_type_id;});//人员类型ID集合
                        let temp={
                            key_identity_name:data.name,
                            key_identity_cert:data.cert,
                            key_identity_mobile:data.mobile,
                            key_identity_mac:data.mac,
                            key_identity_types:personTypes,
                            follows:data.follows
                        };
                        
                        if(valup){//修改
                            let updateTemp={
                                key_identity_id:valup.key_identity_id,
                                key_identity_types:personTypes,
                                follows:data.follows
                            }
            
                            self.$store.dispatch(UpdateIdenPerson,updateTemp).then(res=>{
                                data.blnSearch=false;
                                if(res.msg.code!='successed')return;
                                valup.key_identity_types = updateTemp.key_identity_types;
                                valup.follows=updateTemp.follows;
                                if(self.kind==0){
                                    self.data=self.converPerdetails;
                                }else{
                                     self.data=self.converPersons;
                                }
                                param.close();
                            });

                        }else{//新增
                            self.$store.dispatch(AddIdenPerson,temp).then(res=>{
                                data.blnSearch=false;
                                if(res.msg.code!='successed')return;
                                temp.key_identity_id=res.biz_body[0].key_identity_id;
                                self.persons.unshift(temp);
                                self.data=self.converPersons;
                                param.close();
                            });
                        }
                    },
                    cancel(){param.close();}
                }
            };
            
            return param;
          }());
      }
  }
}
</script>
<style lang="less">
  @pop_itemH:44px;
  //添加布控弹窗样式
  .addPerson_Pop {padding:0px 10px;height:100%;}
  .addPerson_Pop .item .title{float:left;line-height:@pop_itemH;width:70px;text-align:center;}
  .addPerson_Pop .item .input{margin-left:70px;}
  .addPerson_Pop .item .input.select{line-height:@pop_itemH;}
  .addPerson_Pop .option_bar{text-align: right;margin: 10px 0px;}
  .el-checkbox__label,
  .el-radio__label{font-weight:normal;}
</style>

<style scoped lang="less">
   @import "../css/variables.less";
   .HighRisk{width:100%;height:100%;padding:5px;position:relative;}
   .HighRisk .page{background-color:@FrontCol;height:100%;}
   .HighRisk .page_container{border-top:1px solid @borderCol;}
</style>
