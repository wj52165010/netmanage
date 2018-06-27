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
                        <span style="width:50px;display:inline-block;"><span>*</span>起始IP</span>
                        <div style="display:inline-block;"><el-input style="width:50px;" /></div>:
                        <div style="display:inline-block;"><el-input style="width:50px;" /></div>:
                        <div style="display:inline-block;"><el-input style="width:50px;" /></div>:
                        <div style="display:inline-block;"><el-input style="width:50px;" /></div>
                    </div>
                    <div class="itemRow">
                        <span style="width:50px;display:inline-block;">结束IP</span>
                        <div style="display:inline-block;"><el-input style="width:50px;" /></div>:
                        <div style="display:inline-block;"><el-input style="width:50px;" /></div>:
                        <div style="display:inline-block;"><el-input style="width:50px;" /></div>:
                        <div style="display:inline-block;"><el-input style="width:50px;" /></div>
                        
                    </div>
                    <div class="itemRow" style="text-align:right;padding-right:20px;">
                        <button class="btn btn-default btn-xs" type="submit">清空</button>
                        <button class="btn btn-default btn-xs btn-primary" type="submit">添加</button>
                    </div>
                    <div class="line"></div>
                    <div class="itemRow">
                        <span style="width:50px;display:inline-block;">IP/掩码</span>
                        <div style="display:inline-block;"><el-input style="width:50px;" /></div>:
                        <div style="display:inline-block;"><el-input style="width:50px;" /></div>:
                        <div style="display:inline-block;"><el-input style="width:50px;" /></div>:
                        <div style="display:inline-block;"><el-input style="width:50px;" /></div>/
                        <div style="display:inline-block;"><el-input style="width:50px;" /></div>
                    </div>

                    <div class="itemRow" style="text-align:right;padding-right:20px;">
                        <button class="btn btn-default btn-xs" type="submit">清空</button>
                        <button class="btn btn-default btn-xs btn-primary" type="submit">添加</button>
                    </div>

                </div>

                <!--已添加IP-->
                <div class="addedIP">
                    <div class="subTitle"><div class="sub_container">已添加IP</div></div>
                    <!--表头-->
                    <ul class="table_ul">
                        <li style="width:100px;">编号
                            <div class="sortItem"><i class="fa fa-caret-up"></i><i class="fa fa-caret-down"></i></div>
                        </li>
                        <li style="width:150px;">起始IP</li>
                        <li style="width:150px;">结束IP</li>
                        <li style="width:calc(100% - 400px)">操作</li>
                    </ul>
                    <!--表体-->
                    <div style="width:100%;height:calc(100% - 31px - 40px);">
                        <Scroll :listen="ips">
                            <ul class="table_ul">
                                <li style="width:100px;">50</li>
                                <li style="width:150px;">192.192.192.192</li>
                                <li style="width:150px;">255.255.255.255</li>
                                <li style="width:calc(100% - 400px)"><i class="fa fa-remove"></i></li>
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
                    <div style="margin:10px 0px;"><el-input-number  style="width:80%;" :min="1" :max="365" label="描述文字"></el-input-number></div>
                </div>
                <div class="ip_container">
                    <div style="font-weight:600;">端口配置</div>
                    <div class="ip_text">
                        <textarea style="width:100%;height:100%;border:none;resize:none;" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Scroll from 'components/scroll'
export default {
  name: 'IPsetting',
  components:{Scroll},
  data () {
    return {
      pageIndex:0,
      ips:[],
    }
  },
  methods:{
    pageChange(i){

    }
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
.ip_container .ip_text{margin:10px 0px;height:~'calc(100% - 40px)';.border('');padding-bottom:20px;position:relative;}
.ip_container .ip_text:before{content:'*多个端口号请用逗号分隔';color:gray;position:absolute;right:0px; bottom:0px;font-size:12px;}

 
 //表格样式
 .table_ul{
    list-style:none;width:100%;padding:0px;margin:0px;overflow:hidden;
 }
 .table_ul li{float:left;text-align:center;.border('bottom',gray);line-height:30px;}
 .table_ul .sortItem{display:inline-block;position:relative;}
 .table_ul .sortItem .fa-caret-up{position:absolute;top:-15px;cursor:pointer;font-size:15px;}
 .table_ul .sortItem .fa-caret-down{position:absolute;top:-8px;cursor:pointer;font-size:15px;}
 .table_ul .fa-remove{cursor:pointer;}

 html{.TCol(~".table_ul .sortItem .fa-caret-up:hover");}
 html{.TCol(~".table_ul .sortItem .fa-caret-down:hover");}
 html{.TCol(~".table_ul .fa-remove:hover");}
</style>
