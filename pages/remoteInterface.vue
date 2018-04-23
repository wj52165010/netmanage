<!-- 远程接口管理页面 -->
<template>
    <div class="RemoteFace">
        <div class="page">
            <HList title="远程接口" :data="data" :header="header" :showField="fields" :column="columns" 
                                   :blnNoSel="true" :blnNoPage="true" :tag_action="action" @add="add"
                                   :rowAction="rowAction" @update="update" @del="del"
                                   />
        </div>
    </div>
</template>

<script>
import HList from 'components/HList'
import InputDir from '../components/Input'
import {GetInterface,AddInterface,UpdateInterface,DelInterface} from '../store/mutation-types'
export default {
  name: 'RemoteFace',
  components:{HList},
  data () {
    return {
      header:['名称','主机名','端口','url地址','说明'],
      fields:'name,host,port,url,note',
      columns:[{width:150,align:'center'},{width:150,align:'center'},{width:150,align:'center'},{width:150,align:'center'},{width:0,align:'center'}],
      action:[{name:'新增',val:0,icon:'fa fa-plus',action:'add'}],
      rowAction:[{name:'修改',action:'update',icon:'fa fa-plus'},{name:'删除',action:'del',icon:'fa fa-plus'}],
      data:[],
    }
  },
  mounted(){
    this.getData();
  },
  methods:{
      //获取远程接口数据
      getData(){
        this.$store.dispatch(GetInterface).then(res=>{
            if(!tool.msg(res,'','获取远程接口数据失败!')){return}
            this.data=res.biz_body;
        });
      },
      //新增/修改
      add(edata,item){
        let s=this;
        let html=`
                    <InputDir label="名称" @change="name_change" :val="name" />
                    <InputDir label="主机名" @change="host_change" :val="host" />
                    <InputDir label="端口" @change="prot_change" :val="port" />
                    <InputDir label="URL" @change="url_change" :val="url" />
                    <InputDir label="说明" @change="note_change" :val="note" />
                    <div style="text-align:right;margin-top:10px;">
                            <button type="button" class="btn btn-success" style="font-size:12px;" @click="complete()">完成</button>
                            <button type="button" class="btn btn-default" style="font-size:12px;" @click="close()">关闭</button>
                    </div>
                 `;

        tool.open(function(){
            let param={
                title:item?'修改':'新增',
                area:'400px',
                content:`<div class="openTmp" style="width:100%;height:100%;padding:10px;overflow-y:auto;">${html}</div>`,
                components:{InputDir},
                context:{
                    name:item?item.name:'',
                    host:item?item.host:'',
                    port:item?item.port:'',
                    url:item?item.url:'',
                    note:item?item.note:'',
                    name_change(val){param.selfData.name=val;},
                    host_change(val){param.selfData.host=val;},
                    prot_change(val){param.selfData.port=val;},
                    url_change(val){param.selfData.url=val;},
                    note_change(val){param.selfData.note=val;},
                    complete(){
                        let d=param.selfData,
                            tmp={
                                name:d.name,
                                host:d.host,
                                port:d.port,
                                url:d.url,
                                note:d.note
                            };

                        if(item){
                            //修改
                            tmp.id=item.id;
                            s.$store.dispatch(UpdateInterface,tmp).then(res=>{
                                if(!tool.msg(res,'修改远程接口成功!','修改远程接口失败!')){return}
                                _.extend(item,tmp);
                            });
                        }else{
                            //新增
                            s.$store.dispatch(AddInterface,tmp).then(res=>{
                                 if(!tool.msg(res,'添加远程接口成功!','添加远程接口失败!')){return}
                                 tmp.id=res.biz_body.id;
                                 s.data.unshift(tmp);
                            });
                        }

                        param.close();
                    },  
                    close(){param.close();}
                }
            };

            return param;
        }());
      },
      //修改
      update(val){
        this.add(null,val);
      },
      //删除
      del(val){
        this.$store.dispatch(DelInterface,val.id).then(res=>{
            if(!tool.msg(res,'删除远程接口成功!','删除远程接口失败!')){return}
            this.data.splice(_.findLastIndex(this.data,item=>{return item.id == val.id}),1)
        });
      }
  }
}
</script>

<style scoped lang="less">
  @import "../css/variables.less";
  .RemoteFace{width:100%;height:100%;padding:5px;}
  .RemoteFace .page{background-color:@FrontCol;height:100%;}
</style>
