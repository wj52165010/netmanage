<!-- html模板组件 -->
<template>
    <div class="HtmlTmp">
        <div :id="id"></div>
        <!--加载中动画-->
        <div class="loading" v-show="blnShowLoading"><div :id="id+'inloading'" class="loadingContainer"></div></div>
    </div>
</template>

<script>
import Vue from 'vue'
import tmpDAO from '../js/dao/tmpDao.js'
import {Get_OPerate_Data,Get_Operate} from '../store/mutation-types'
import cLoading from '../js/canvasLoading.js'

export default {
  name: 'HtmlTmp',
  props:['menu','params','store','menuid','height'],
  data () {
    return {
      id:'',
      innerMenu:null,
      viewVue:null,//视图显示实例
      blnShowLoading:false,
    }
  },
  mounted(){
      this.id='htmltmp'+tool.guid();
      this.$nextTick(()=>{
        cLoading(this.id+'inloading',7);
      });

      this.$store=this.$store || this.store;
      if(this.menuid){
        let menus=this.store.getters.Menus,Rx=this.store.getters.Rx;
        //获取菜单
        let getMenu = Rx.Observable.create(obs=>{
            let menu = _.chain(menus).pluck('menus').flatten().compact().find(item=>{return item.keyid==this.menuid;}).value();
            if(menu){obs.next(menu); return;}
            this.$store.dispatch(Get_Operate,this.menuid).then(res=>{
                obs.next(res.biz_body[0]);
            });
        });

        getMenu.subscribe(menu=>{
           this.innerMenu=menu;
           this.complieTmp();
        });
      }else{
        this.complieTmp();
      }
  },
  methods:{
      //获取模板数据
      getData(){        
        let extraParam=this.params.extraConditon || [];//额外的条件参数
        let inter=this.params.interface || '';//远程数据条件
        let model=(this.menu || this.innerMenu).condtionsObj;
        let {param:result,sepParam} = tmpDAO.searchParam(extraParam,model);

        return this.store.dispatch(Get_OPerate_Data,{interface:inter,keyid:(this.menu || this.innerMenu).keyid,extraData:result,indexFields:sepParam,condtionsObj:model});
      },
      //编译模板数据
      complieTmp(){
        let self=this;
        try{
            let html=(this.menu || this.innerMenu).template;
            let fields=(this.menu || this.innerMenu).condtionsObj.show_fields;
            let blnShow=(this.menu || this.innerMenu).condtionsObj.query_kind.indexOf('show')>=0;
            let data={};
            _.each(fields,item=>{
                data[blnShow?item.key:item.alias]='';
            });
            //判断是否有elTable插件或则v-for指令存在
            let reg_for=/v-for=['"]?([^'"]*)['"]/i;
            let repress=/([^'"]*)\s+in\s+([^'"]*)/i;
            if(html.match(reg_for)){
                let vfor=html.match(reg_for)[1];
                let source=vfor.match(repress)[2];
                data[source]=[];
            }
            let elTable=/<el-table\s+[^>]*:data=['"]?([^'"]*)['"]/i
            if(html.match(elTable)){
                let source=html.match(elTable)[1];
                data[source]=[];
                let heightReg=/<el-table\s+[^>]*:height=['"]?([^'"]*)['"]/i
                if(html.match(heightReg)){
                    data['height']=self.height;
                }
            }

            //判断是否包含模板指令
            let htmlPage=/<htmlTmpPage\s/i
            if(html.match(htmlPage)){
                data['store']=self.store;
                data['params']=self.params;
            }

            //判断是否包含地图组件
            let MapDotPage=/<MapDotPage\s/i
            if(html.match(MapDotPage)){
                data['store']=self.store;
                data['params']={
                    keyid:self.menu.keyid,
                    extraConditon:self.params.extraConditon,
                    primaryKey:self.menu.condtionsObj.primaryKey,
                    orderFields:self.menu.condtionsObj.show_fields,
                    templateSet:tool.Clone(self.menu.condtionsObj.templateSet),
                    condtion:tool.Clone(self.menu.condtionsObj)
                };
            }

            let rest = Vue.compile(html);
            self.viewVue= new Vue({
                data:data,
                components: {},
                methods:{},
                render: rest.render,
                staticRenderFns: rest.staticRenderFns
            });
            setTimeout(()=>{
                self.viewVue.$mount($('#'+this.id)[0]);
            },0);
 
            self.blnShowLoading=true;
            self.getData().then(res=>{
                self.blnShowLoading=false;
                let blnSucess = tool.msg(res,'','获取模板数据失败!');
                if(!blnSucess){return;}
                let tempArr=[];
                if(this.params.interface){
                    //远程数据
                    tempArr=res.biz_body[this.params.interface]
                }else{
                    //本地数据
                    for(let i=0;i<res.biz_body.length;i++){
                        tempArr.push(self.converShowInfo(res.biz_body[i]));
                    }
                }
         
                let c_data= tempArr[0] || {};
                _.each(fields,item=>{
                    self.viewVue.$data[blnShow?item.key:item.alias]=c_data[blnShow?item.key:item.alias] || '';
                });
                
                //判断是否有elTable插件或则v-for指令存在
                let reg_for=/v-for=['"]?([^'"]*)['"]/i;
                let repress=/([^'"]*)\s+in\s+([^'"]*)/i;
                if(html.match(reg_for)){
                    let vfor=html.match(reg_for)[1];
                    let variable=vfor.match(repress)[1],source=vfor.match(repress)[2];
                    self.viewVue.$data[source]=tempArr;
                }
                let elTable=/<el-table\s+[^>]*:data=['"]?([^'"]*)['"]/i
                
                if(html.match(elTable)){
                    let source=html.match(elTable)[1];
                    self.viewVue.$data[source]=tempArr;
                }
            });
        }catch(e){}
      },
      //转化显示字段数据
      converShowInfo(data){
          let fields=(this.menu || this.innerMenu).condtionsObj.show_fields;

          for(let field of fields){
            if((data[field.alias] || data[field.key])!=undefined){
                if(data[field.alias]){
                    data[field.alias]=tmpDAO.formatData(field,data[field.alias] || data[field.key],data);
                }else{
                    data[field.key]=tmpDAO.formatData(field,data[field.alias] || data[field.key],data);
                }
            }
          }
         return data;
      }

  }
}
</script>

<style scoped lang="less">
  .HtmlTmp{height:100%;width: 100%;position:relative;}
  //加载中动画
 .loading{position: absolute;top:0px;left:0px;right:0px;bottom:0px;}
 .loadingContainer{text-align: center;position: absolute;left: 50%;margin-left: -50px;top: 50%;margin-top: -50px;}
</style>
