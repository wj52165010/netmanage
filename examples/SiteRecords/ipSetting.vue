<!--扫描IP配置组件 -->
<template>
    <div class="IPsetting">
        <!--左边显示容器-->
        <div class="left_container">
            <!--标题栏-->
            <div class="title">IP配置</div>
            <!--内容栏-->
            <div class="container">
                <!--添加IP-->
                <div class="addIP">
                    <div class="subTitle"><div class="sub_container">添加IP</div></div>
                    <div class="itemRow">
                        <span style="width:50px;display:inline-block;"><span style="color:red;">*</span>起始IP</span>
                        <div style="display:inline-block;"><el-input style="width:50px;" v-model="startIP_one" /></div>:
                        <div style="display:inline-block;"><el-input style="width:50px;" v-model="startIP_two" /></div>:
                        <div style="display:inline-block;"><el-input style="width:50px;" v-model="startIP_three" /></div>:
                        <div style="display:inline-block;"><el-input style="width:50px;" v-model="startIP_four" /></div>
                    </div>
                    <div class="itemRow">
                        <span style="width:50px;display:inline-block;">结束IP</span>
                        <div style="display:inline-block;"><el-input style="width:50px;" v-model="endIP_one" /></div>:
                        <div style="display:inline-block;"><el-input style="width:50px;" v-model="endIP_two" /></div>:
                        <div style="display:inline-block;"><el-input style="width:50px;" v-model="endIP_three" /></div>:
                        <div style="display:inline-block;"><el-input style="width:50px;" v-model="endIP_four" /></div>
                    </div>
                    <div class="itemRow" style="text-align:right;padding-right:20px;">
                        <button class="btn btn-default btn-xs" type="submit" @click="clearIP()">清空</button>
                        <button class="btn btn-default btn-xs btn-primary" type="submit" @click="addIP()">添加</button>
                    </div>
                    <div class="line"></div>
                    <div class="itemRow">
                        <span style="width:50px;display:inline-block;">IP/掩码</span>
                        <div style="display:inline-block;"><el-input style="width:50px;" v-model="maskIP_one" /></div>:
                        <div style="display:inline-block;"><el-input style="width:50px;" v-model="maskIP_two" /></div>:
                        <div style="display:inline-block;"><el-input style="width:50px;" v-model="maskIP_three" /></div>:
                        <div style="display:inline-block;"><el-input style="width:50px;" v-model="maskIP_four" /></div>/
                        <div style="display:inline-block;"><el-input style="width:50px;" v-model="maskCount" /></div>
                    </div>

                    <div class="itemRow" style="text-align:right;padding-right:20px;">
                        <button class="btn btn-default btn-xs" type="submit" @click="clearMask()">清空</button>
                        <button class="btn btn-default btn-xs btn-primary" type="submit" @click="addMask()">添加</button>
                    </div>

                </div>

                <!--已添加IP-->
                <div class="addedIP">
                    <div class="subTitle"><div class="sub_container">已添加IP</div></div>
                    <!--表头-->
                    <ul class="table_ul">
                        <li style="width:100px;">编号
                            <div class="sortItem"><i class="fa fa-caret-up" :class="{active:!order}" @click="order=false"></i><i class="fa fa-caret-down" :class="{active:order}" @click="order=true"></i></div>
                        </li>
                        <li style="width:150px;">起始IP</li>
                        <li style="width:150px;">结束IP</li>
                        <li style="width:calc(100% - 400px)">操作</li>
                    </ul>
                    <!--表体-->
                    <div style="width:100%;height:calc(100% - 31px - 40px);position:relative;">
                        <!--加载中-->
                        <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index: 100;">
                            <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
                        </div>
                        <!--暂无数据-->
                        <div v-if="ips.length<=0" style="width:100%;height:100%;text-align:center;display:table;">
                            <div style="display:table-cell;vertical-align: middle;">暂无数据</div>
                        </div>
                        
                        <Scroll :listen="ips">
                            <ul class="table_ul" v-for="(p,i) in ips">
                                <li style="width:100px;">{{calNumber(i)}}</li>
                                <li style="width:150px;">{{p.start_ip}}</li>
                                <li style="width:150px;">{{p.end_ip || '- - - -'}}</li>
                                <li style="width:calc(100% - 400px)"><i class="fa fa-remove" @click="delIP(p.id,i)"></i></li>
                            </ul>
                        </Scroll>
                    </div>
                    <!--分页-->
                    <div name="page_container" class="page_container">
                        <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageIndex+1}}</span></span>
                        <div class="firstPage" @click="pageChange(0)">首页</div>
                        <div class="prePage" @click="pageChange(pageIndex-1)">上一页</div>
                        <div class="nextPage" @click="pageChange(pageIndex+1)">下一页</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!--右边显示容器-->
        <div class="right_container">
            <!--标题栏-->
            <div class="title">规则配置</div>
            <!--内容蓝-->
            <div class="container">
                <div class="weekcycle">
                    <div><span style="font-weight:600;">间隔周期</span><span style="color:gray;font-size:10px;">(单位/天)</span></div>
                    <div style="margin:10px 0px;"><el-input-number  style="width:80%;" v-model="portSetting.interval" :min="1" :max="365" label="描述文字"></el-input-number></div>
                </div>
                <div class="ip_container">
                    <div style="font-weight:600;">端口配置</div>
                    <div class="ip_text">
                        <textarea v-model="portSetting.port" style="width:100%;height:100%;border:none;resize:none;" />
                    </div>
                    <div style="text-align:right;">
                        <button type="button" class="btn btn-primary btn-sm" @click="saveProtSetting()">保 存</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Scroll from 'components/scroll'

import {WebSiteScanSetting,WebSiteAddIP,WebSiteDelIP,WebSiteSavePort,WebSitePortSetting} from '../../store/mutation-types'
export default {
  name: 'IPsetting',
  components:{Scroll},
  data () {
    return {
      blnLoading:false,
      pageIndex:0,
      pageNumber:10,
      ips:[],
      portSetting:{interval:1,port:''},
      order:false,
      listCount:0,
      startIP_one:'',
      startIP_two:'',
      startIP_three:'',
      startIP_four:'',
      endIP_one:'',
      endIP_two:'',
      endIP_three:'',
      endIP_four:'',
      maskIP_one:'',
      maskIP_two:'',
      maskIP_three:'',
      maskIP_four:'',
      maskCount:'',
    }
  },
  watch:{
    order(){
        this.getIPList(this.pageIndex);
    }
  },
  mounted(){
    //获取IP列表数据
    this.getIPList(0);
    this.getPortSetting();

  },
  methods:{
    //添加IP
    addIP(){
       if(this.startIP_one=='' && this.startIP_two=='' && this.startIP_three=='' && this.startIP_four==''){tool.info('请填写起始IP地址!'); return;}
       let startIP=`${this.startIP_one}.${this.startIP_two}.${this.startIP_three}.${this.startIP_four}`,
           endIP=(this.endIP_one=='' || this.endIP_two=='' || this.endIP_three=='' || this.endIP_four=='')?'':
                 `${this.endIP_one}.${this.endIP_two}.${this.endIP_three}.${this.endIP_four}`;

       if(!this.isValidIP(startIP)){tool.info('起始IP地址格式不正确!'); return;}
   
       if((this.endIP_one!='' || this.endIP_two!='' || this.endIP_three!='' || this.endIP_four!='') && !this.isValidIP(endIP)){tool.info('结束IP地址格式不正确!'); return;}
       
       //判断IP是否已经添加过
       if(_.find(this.ips,ip=>ip.start_ip==startIP && ip.end_ip==endIP)){tool.info('该IP配置已经存在,不能重复添加!'); return;}

       this.$store.dispatch(WebSiteAddIP,{
           start_ip:startIP,
           end_ip:endIP,
       }).then(res=>{
           if(!tool.msg(res,'添加IP成功')) return;
           this.ips.push(res.biz_body[0]);
           this.listCount++;
       });
    },
    //删除IP
    delIP(id,i){
        tool.confirm('您确定要删除该IP配置吗?',['确定','取消'],()=>{
            this.$store.dispatch(WebSiteDelIP,id).then(res=>{
                if(!tool.msg(res,'删除成功!')) return;

                this.ips.splice(i,1);
                this.listCount--;
            });
        },function(){});
        
    },
    //清空IP
    clearIP(){
        this.startIP_one='';
        this.startIP_two='';
        this.startIP_three='';
        this.startIP_four='';
        this.endIP_one='';
        this.endIP_two='';
        this.endIP_three='';
        this.endIP_four='';
    },
    //添加掩码
    addMask(){
       if(this.maskIP_one=='' && this.maskIP_two=='' && this.maskIP_three=='' && this.maskIP_four==''){tool.info('请填写掩码地址!'); return;}
       let maskIP=`${this.maskIP_one}.${this.maskIP_two}.${this.maskIP_three}.${this.maskIP_four}`;

       if(!this.isValidIP(maskIP)){tool.info('起始掩码格式不正确!'); return;}
       if(this.maskCount==''){tool.info('请填写掩码个数!'); return;}       
       if(!this.isInt(this.maskCount)){tool.info('掩码个数必须为正整数!'); return;}
       
       this.$store.dispatch(WebSiteAddIP,{
           mask_ip:maskIP,
           count:this.maskCount,
       }).then(res=>{
           if(!tool.msg(res,'添加IP成功')) return;

           this.ips.unshift(res.biz_body[0]);
       });
    },
    //清空掩码
    clearMask(){
        this.maskIP_one='';
        this.maskIP_two='';
        this.maskIP_three=''; 
        this.maskIP_four='';
        this.maskCount='';
    },
    //保存端口配置
    saveProtSetting(){
        if(!this.portSetting.port){tool.info('端口号不能为空!');return;}
        this.$store.dispatch(WebSiteSavePort,{...this.portSetting}).then(res=>{
            if(!tool.msg(res,'保存端口配置成功!')) return;
        });
    },
    //获取IP端口配置
    getPortSetting(){
        this.$store.dispatch(WebSitePortSetting).then(res=>{
            if(!tool.msg(res,'','获取IPD端口配置失败!')) return;
            this.portSetting=res.biz_body;
        });
    },
    //获取IP列表数据
    getIPList(i){
        i=i<0?0:i;
        this.blnLoading=true;
        this.$store.dispatch(WebSiteScanSetting,{
            limit:this.pageNumber,
            skip:i*this.pageNumber,
            is_desc:this.order
        }).then(res=>{
            this.blnLoading=false;
            if(!tool.msg(res,'','获取IP列表失败!')) return; 
            if(res.biz_body.length<=0 && i>0){tool.info('已经到了最后页!');return;}

            this.ips=res.biz_body;
            this.listCount=res.page.total;

            this.pageIndex=i;
        });
    },
    pageChange(i){
        this.getIPList(i);
    },
    isValidIP(ip) {
        var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
        return reg.test(ip);
    },
    isInt(val){
       var reg = /^[0-9]*[1-9][0-9]*$/
       return reg.test(val);
    },
    //计算编号
    calNumber(i){
        if(this.order){//降序
            return this.listCount - this.pageIndex*this.pageNumber - i;
        }else{//升序
            return this.pageIndex*this.pageNumber + i +1;
        }
    },
  }
}
</script>

<style scoped lang="less">
  @import "../../css/variables.less";
  .IPsetting{width:100%;height:100%;padding:5px;}

  @leftW:70%;
  .left_container{float:left;width:@leftW;height:100%;.border('');border-radius:5px;overflow:hidden;height:100%;}
  .right_container{margin-left:~'calc(70% + 10px)';height:100%;.border('');border-radius:5px;overflow:hidden;height:100%;}
  
  @titleH:30px;
  .right_container .title,
  .left_container .title{text-align:center;color:white;line-height:@titleH;}
  html{.TCol(~".right_container .title",'bg');}
  html{.TCol(~".left_container .title",'bg');}

  .right_container .container,
  .left_container .container{
    width:100%;height:~'calc(100% - @{titleH})';padding:15px;
  }
 
 @addIPH:220px;
 .addIP{width:100%;height:@addIPH;border-radius:5px;padding:10px;position:relative;overflow:hidden;padding-left:40px;}
 .addIP:before{content:'';position:absolute;left:0px;height:100%;top:0px;width:10px;}
 .addIP .subTitle{position:absolute;width:15px;height:100%;left:15px;font-weight:600;top:0px;display:table;}
 .addIP .subTitle .sub_container{height:100%;display:table-cell;vertical-align: middle;}
 .addIP .itemRow{margin-bottom:10px;padding-left:10%;}
 .addIP .line{width:100%;height:1px;background-color:gray;margin-bottom:5px;}

 html{.TColLighten(~".IPsetting .addIP",90%,'bg');}
 html{.TColLighten(~".addIP:before",50%,'bg');}

 .addedIP{width:100%;height:~'calc(100% - @{addIPH} - 15px)';margin-top:15px;border-radius:5px;padding:10px;position:relative;overflow:hidden;padding-left:40px;}
 .addedIP:before{content:'';position:absolute;left:0px;height:100%;top:0px;width:10px;}
 .addedIP .subTitle{position:absolute;width:15px;height:100%;left:15px;font-weight:600;top:0px;display:table;}
 .addedIP .subTitle .sub_container{height:100%;display:table-cell;vertical-align: middle;}

 html{.TColLighten(~".IPsetting .addedIP",90%,'bg');}
 html{.TColLighten(~".addedIP:before",50%,'bg');}

.weekcycle{padding:10px;.border('');border-radius:5px;}
.ip_container{padding:10px;.border('');border-radius:5px;height:~'calc(100% - 115px)';margin-top:10px;}
.ip_container .ip_text{margin:10px 0px;height:~'calc(100% - 70px)';.border('');padding-bottom:20px;position:relative;}
.ip_container .ip_text:before{content:'*多个端口号请用逗号分隔';color:gray;position:absolute;right:0px; bottom:0px;font-size:12px;}


html{.TCol(~".IPsetting .active");}




 
 //表格样式
 .table_ul{
    list-style:none;width:100%;padding:0px;margin:0px;overflow:hidden;
 }
 .table_ul li{float:left;text-align:center;.border('bottom',gray);line-height:30px;}
 .table_ul .sortItem{display:inline-block;position:relative;}
 .table_ul .sortItem .fa-caret-up{position:absolute;top:-18px;cursor:pointer;font-size:15px;}
 .table_ul .sortItem .fa-caret-down{position:absolute;top:-5px;cursor:pointer;font-size:15px;}
 .addedIP .fa-caret-down:before{position:absolute;line-height: 5px;}
 .table_ul .fa-remove{cursor:pointer;}

 html{.TCol(~".table_ul .sortItem .fa-caret-up:hover");}
 html{.TCol(~".table_ul .sortItem .fa-caret-down:hover");}
 html{.TCol(~".table_ul .fa-remove:hover");}
</style>
