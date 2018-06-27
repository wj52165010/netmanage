<!-- 统计考核定制页面组件  created by Chuanjiang Li 2018/04/20 -->
<template>
    <div class="BasePage">
       <div class="base_conatiner">
       <!--加载中标识-->
        <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index:100;">
            <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;"><i class="fa fa-spinner fa-pulse" style="color:#98e32c;"></i></div></div>
        </div>
        <!-- 标签切换 导航-->
        <div style="height:30px" name="tagcomp">
            <div class="tagComp" style="text-align:left">                
                <div class="item" @click="switchView('statistics')" :class="{active: viewTable=='statistics'}">
                    <div class="item_container">
                        <span class="content"><i class="fa fa-gear"></i>统计</span>
                    </div>
                </div>
                <div class="item" @click="switchView('check')" :class="{active: viewTable=='check'}">
                    <div class="item_container">
                        <span class="content"><i class="fa fa-list"></i>考核</span>
                    </div>
                </div>
            </div>
        </div>        
        <!--相关页面过滤条件-->
        <div class="filter_container" v-show="viewTable=='statistics'"> 
            <!--详细统计页面过滤条件-->
            <div class="detail_filter" v-show="pageIndex==1">
                <div style="height:100%;float:left;" v-show="countIndex==0">
                    <div style="width:150px;display:inline-block;">
                        <el-select v-model="region" clearable placeholder="选择区域">
                            <el-option
                            v-for="kind in regions"
                            :key="kind.code"
                            :label="kind.name"
                            :value="kind.code">
                            </el-option>
                        </el-select>
                    </div>
                    <div style="width:150px;display:inline-block;">
                        <el-select v-model="firm" clearable placeholder="选择厂商">
                            <el-option
                            v-for="kind in firms"
                            :key="kind.code"
                            :label="kind.name"
                            :value="kind.code">
                            </el-option>
                        </el-select>
                    </div>
                    <div style="width:200px;display:inline-block;">
                        <el-select v-model="dataSource" clearable placeholder="数据来源1">
                            <el-option
                            v-for="kind in dataSources"
                            :key="kind.code"
                            :label="kind.name"
                            :value="kind.code">
                            </el-option>
                        </el-select>
                    </div>
                    <div style="width:220px;display:inline-block;">
                        <el-date-picker v-model="commonTime" type="daterange" placeholder="选择日期范围" :picker-options="limitTime" style="width: 220px"></el-date-picker>
                    </div>
                </div>

                <div style="height:100%;float:left;" v-show="countIndex==1">

                    <div style="width:250px;display:inline-block;">
                        <MulDropDwon :data="Listfirm" keyProp="name" id="code" placeholder="选择厂商">
                            <div v-for="t in firms" @mousedown="detail_list_firmClick(t)">{{t.name}}</div>
                        </MulDropDwon>
                    </div>

                   
                    <div style="width:220px;display:inline-block;">
                        <el-date-picker v-model="countTime" type="daterange" placeholder="统计时间" :picker-options="limitTime" style="width: 220px"></el-date-picker>
                    </div>
                </div>

                <div class="optionBar" style="float:right;line-height: 40px;">
                    <el-tooltip class="item" :class="{active:countIndex==0}" effect="light" content="图表" placement="top">
                        <i class="fa fa-area-chart" @click="countIndex=0"></i>
                    </el-tooltip>
                    <el-tooltip class="item" :class="{active:countIndex==1}" effect="light" content="列表" placement="top">                        
                        <i class="fa fa-bars" @click="countIndex=1"></i>
                    </el-tooltip>
                    <el-tooltip class="item" effect="light" content="导出数据" placement="top">                        
                        <i class="fa fa-level-down" @click="ExportDetailCount()"></i>
                    <el-tooltip>
                </div>
            </div>
        </div>
        <HTag :tags="pages" @change="tagChange" v-show="viewTable=='statistics'">
                <div slot="t0" style="height:100%;width:100%;">
                    <!--基础数据-->
                    <div class="header">
                        <titleComp title="基础数据" />
                    </div>
                    <div class="base_container">
                        <tag v-for="tag in tags" 
                            :title="tag.name" 
                            :num="tag.num" 
                            :info="tag.info" 
                            :icon="tag.icon" 
                            :tip="tag.tip" 
                            :subTip="tag.subTip" 
                            :bottomTip="tag.bottomTip"
                            :rightTitle="tag.right_title" 
                        />
                    </div>
                    <!--在离线统计-->
                    <div class="header">
                        <div class="titleComp" style="cursor:pointer;display:inline-block;">
                            <i class="fa fa-caret-down" style="font-size:18px;" ></i>
                            <span style="font-style: italic;">在离线统计</span>
                            <!--类型切换-->
                            <span class="tag_label" style="margin-left:10px;cursor:pointer;" v-for="k in kinds" @click="kindchange(k)">
                                <i :class="k.icon" style="margin-right:5px;"></i>{{k.name}}
                            </span>
                        </div>
                        <div style="width:250px;display:inline-block;">
                            <MulDropDwon :data="Selfirms" keyProp="name" id="code" placeholder="选择厂商">
                                <div v-for="t in firms" @mousedown="firmClick(t)">{{t.name}}</div>
                            </MulDropDwon>
                        </div>
                        <div style="display:inline-block;margin-left:10px;width:130px;">
                            <el-select v-model="timeRageVal" placeholder="时间范围">
                                <el-option
                                v-for="item in timeRange"
                                :key="item.val"
                                :label="item.name"
                                :value="item.val">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="optionBar">
                            <el-tooltip class="item" :class="{active:optionIndex==0}" effect="light" content="厂商在离线详情" placement="top">
                                <i class="fa fa-area-chart" @click="optionIndex=0"></i>
                            </el-tooltip>
                            <el-tooltip class="item" :class="{active:optionIndex==1}" effect="light" content="厂商在离线率" placement="top">                        
                                <i class="fa fa-line-chart" @click="optionIndex=1"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="light" content="导出数据" placement="top">                        
                                <i class="fa fa-level-down" @click="ExportOnlineCount()"></i>
                            <el-tooltip>
                        </div>
                    </div>
                    <!--图表显示区域-->
                    <div class="chart_container" >
                        <!--柱状图-->
                        <div name="chart_container" v-show="optionIndex==0" :class="{fadeIn:optionIndex==0}" style="width:100%;height:100%;"></div>
                        <!--线形图-->
                        <div name="line_chart_container" v-show="optionIndex==1" :class="{fadeIn:optionIndex==0}" style="width:100%;height:100%;"></div>
                    </div>
                </div>
                <div slot="t1" style="height:100%;width:100%;text-align:left;">

                    <!--图表显示-->
                    <div style="width:100%;height:100%;" class="fadeIn" v-show="countIndex==0">
                        <div class="count_item" v-for="i in detais">
                            <LineCount ref="lineCount" 
                                :name="i.name" 
                                :keyWord="i.key" 
                                :time="i.time"
                                :region="region"
                                :firm="firm" 
                                :microprobe="dataSource"
                            />
                        </div>
                    </div>

                    <!--列表显示-->
                    <div style="width:100%;height:100%;" class="fadeIn" v-show="countIndex==1">
                        <!--列表头-->
                        <div class="base_table_header">
                            <div class="column_1">
                                厂商
                            </div>
                            <div class="column_2">
                                <div class="row_1">
                                    <div class="item">数据上传详情</div><div class="item">数据上传质量</div>
                                </div>
                                <div class="row_2">
                                    <div class="item">
                                        <div class="sep">网吧</div>
                                        <div class="sep">无线WIFI采集</div>
                                        <div class="sep">特征采集设备</div>
                                        <div class="sep">合计</div>
                                    </div><div class="item">
                                        <div class="sep">实际条数</div>
                                        <div class="sep">有效条数</div>
                                        <div class="sep">无效条数</div>
                                        <div class="sep">有效率</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!--统计项-->
                        <div class="base_count_item">
                            <div class="column_1">全部厂商</div>
                            <div class="column_2">
                                <div class="item">
                                    <div class="sep">{{list_count_count_data.网吧}}</div>
                                    <div class="sep">{{list_count_count_data.无线WIFI}}</div>
                                    <div class="sep">{{list_count_count_data.特征采集}}</div>
                                    <div class="sep">{{list_count_count_data.合计}}</div>
                                </div><div class="item">
                                    <div class="sep">{{list_count_count_data.实际条数}}</div>
                                    <div class="sep">{{list_count_count_data.有效条数}}</div>
                                    <div class="sep">{{list_count_count_data.无效条数}}</div>
                                    <div class="sep">{{list_count_count_data.有效率}}</div>
                                </div>
                            </div>
                        </div>
                        <!--列内容-->
                        <div class="base_table_content">
                            <Scroll :listen="list_count_data">
                                <template v-for="d in list_count_data">
                                        <div class="base_count_item">
                                            <div class="column_1" :title="d.厂商名称">{{d.厂商名称}}</div>
                                            <div class="column_2">
                                                <div class="item">
                                                    <div class="sep">{{d.网吧}}</div>
                                                    <div class="sep">{{d.无线WIFI}}</div>
                                                    <div class="sep">{{d.特征采集}}</div>
                                                    <div class="sep">{{d.合计}}</div>
                                                </div><div class="item">
                                                    <div class="sep">{{d.实际条数}}</div>
                                                    <div class="sep">{{d.有效条数}}</div>
                                                    <div class="sep">{{d.无效条数}}</div>
                                                    <div class="sep">{{d.有效率}}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                            </Scroll>
                        </div>
                    </div>
                </div>
                <div slot="t2" style="height:100%;width:100%;">
                    <div class="option" style="display:block"> 
                        <div class="item" style="text-align: left;margin: 10px;">
                            <span>统计方式:</span>
                            <div class="input" style="display:inline-block;width:190px;">
                                <el-select v-model="colltype" placeholder="请选择"  >
                                <el-option
                                v-for="kind in colltypeAll"                           
                                :label="kind.name"
                                :value="kind.value">
                                </el-option>
                                </el-select>
                            </div>
                        </div>    
                    </div>
                    <div class="date-sel" v-show="colltype=='1'">
                        <div class="tag" style="width:18%;min-width:305px;float: left;margin: 10px;" v-for="name in FirmStatis">
                            <div style="padding:10px;">
                                <div class="title" style="line-height: 30px;font-size: 14px;text-indent: 0px;">
                                    <span style="font-size:14px;font-weight:900">{{name.security_software_orgname}}</span>
                                </div> 
                                <div class="title" style="line-height: 30px;font-size: 13px;text-indent: 0px;">昨日量：
                                    <span>{{name.last_detect_num}}</span>
                                </div> 
                                <div class="title" style="line-height: 30px;font-size: 13px;text-indent: 0px;">接入总量：
                                    <span>{{name.total_detect_num}}</span>
                                </div> 
                                <div style="padding-top:10px;font-size:20px;" class="number">
                                    <div style="position: absolute;right: 9px;top: 16px;"><i style="font-size: 90px" class="fa fa-globe"></i> 
                                    </div> 
                                </div>
                            </div> 
                        </div>                        
                    </div>
                    <div class="date-sel" v-show="colltype=='0'">
                        <div class="tag" style="width: 300px;float: left;margin: 10px;" v-for="f in CollMicroprobe">
                            <div style="padding:10px;">
                                <div class="title" style="line-height: 30px;font-size: 14px;text-indent: 20px;">
                                    <span style="font-size:18px;font-weight:900">{{f.name}}</span>
                                </div> 
                                <div class="title" style="line-height: 30px;font-size: 14px;text-indent: 20px;">{{f.title_one}}
                                    <span>{{f.num_one}}</span>
                                </div> 
                                <div class="title" style="line-height: 30px;font-size: 14px;text-indent: 20px;">{{f.title_two}}
                                    <span>{{f.num_two}}</span>
                                </div> 
                                <div style="padding-top:10px;font-size:20px;" class="number">
                                    <div style="position: absolute;right: 29px;top: 24px;"><i style="font-size: 80px" :class="f.icon"></i> 
                                    </div> 
                                </div>
                            </div> 
                        </div>                        
                    </div>               



                </div>            



        </HTag>
        <div v-show="viewTable=='check'" class="sta_check" style="height: calc(100% - 50px - -63px - 40px);position:relative">
            <!--左边侧边框-->
            <div class="left_pop bound" :class="{active:blnShowHistoryPop}">
                <!--显示标签-->
                <div class="pop_lable" @click="changeHisHun()">
                    历史记录
                </div>
                <Scroll ref="historyStaScroll" :listen="historyData">
                    <div class="pop_top">
                         <span class="content" @click="checkRuleList()"><i class="fa fa-gear"></i>&nbsp;考核规则</span>
                         <span class="content" @click="checkManageFun()"><i class="fa fa-plus-circle"></i>&nbsp;考核管理</span>
                    </div>
                    <div v-for="(h,i) in historyData" class="item" @click="getTaskResList(h.task_title,h.check_target_desc,h.use_standard,h.last_schedule,h.task_status,h.disabled,h.begin_day,h.end_day)">
                        <div style="line-height:20px;text-align:center">
                            <span>{{h.task_title}}</span>
                        </div>
                        <div class="item_span" style="line-height:25px">
                            <span >{{h.check_target_desc=="厂商"?"执行日期":"考核日期"}}：<span v-show="h.last_run_time&&h.last_run_time!='0'">{{converTime(h.last_run_time)}}</span></span>
                            <span style="float:right;margin-right:20px">{{h.disabled=="0"?h.task_status_desc:"任务失效"}}</span>
                        </div>
                        <div style="line-height:25px">
                            <span style="margin-right:20px;">考核类型：{{h.task_type_desc}}</span>
                            <span style="float:right;margin-right:20px">考核对象：{{h.check_target_desc}}</span>
                        </div>
                        <div style="line-height:15px;text-align:right;margin-right:10px">
                            <span title="禁用" class="his_icon" v-show="h.task_type!='timing'" @click.stop="deleteTaskFun(h.task_id)"><i class="fa fa-remove"></i></span>                            
                            <span title="导出" class="his_icon"  @click.stop="exportTastTesListFun(h.use_standard,h.last_schedule)"><i class="fa fa-download"></i></span>
                        </div>
                    </div>
                </Scroll>
            </div>
            <div class="no-data" v-show="showData.length<=0">请在左侧考核任务中选择一项</div>
            <div class="list_cont"  style="height:100%;"  v-show="showData.length>0">                
                <div class="option">
                    <div>考核名称：<span>{{listResultSu.name}}</span></div>
                    <div>考核对象：<span>{{listResultSu.type}}</span></div>
                    <div>时间范围：<span>{{listResultSu.begin_day}} 至 {{listResultSu.end_day}}</span></div>
                    <div class="item" style="height:40px;float:right;margin-right:35px;">
                        <el-button type="primary" title="导出" @click="exportTastTesListFun(listResultSu.use_standard,listResultSu.last_schedule)"><i  class="fa fa-download"></i></el-button>
                    </div> 
                    <div style="float:right">*考核结果仅做参考 </div>
                </div> 
                <ul class="header">
                    <li class="item" style="height:120px">
                        <div ref="tel_name"><span class="overflow" style="width:120px;">{{listResultSu.type=="厂商"?"厂商名称":"区域名称"}}</span></div>
                        <div ref="tel_onOff" v-show="dataColumn.is_check_netbar_off=='1'||dataColumn.is_check_netbar_except=='1'||dataColumn.is_check_netbar_detects=='1'">
                            <div style="height:39px;border-bottom:1px solid #fff" >在离线考核</div>
                            <div style="height:80px;display: flex; flex-flow: row;">
                                <div class="inline-fatg" style="line-height:80px" v-show="dataColumn.is_check_netbar_off=='1'"><span class="inline_overflow">离线率</span></div>
                                <div class="inline-fatg" style="line-height:80px" v-show="dataColumn.is_check_netbar_except=='1'"><span class="inline_overflow">异常率</span></div>
                                <div class="inline-fatg" style="line-height:80px" v-show="dataColumn.is_check_netbar_detects=='1'"><span class="inline_overflow">贡献率</span></div>
                                <div class="inline-fatg last" style="line-height:80px" v-show="dataColumn.is_check_netbar_off=='1'||dataColumn.is_check_netbar_except=='1'||dataColumn.is_check_netbar_detects=='1'"><span class="inline_overflow">参考结果</span></div>
                            </div>                                
                        </div>
                        <div style="width:100px" ref="tel_data" v-show="dataColumn.is_check_realname=='1'||dataColumn.is_check_virtual=='1'||dataColumn.is_check_hardware=='1'">
                            <div style="height:39px;border-bottom:1px solid #fff" >数据采集考核</div>
                            <div style="height:80px;display: flex; flex-flow: row;">
                                <!--<div style="border-right:1px solid #fff">
                                    <div style="height:82px;border-bottom:1px solid #fff;width:95px;line-height:80px">虚拟身份种类</div>
                                </div>-->
                                <div style="border-right:1px solid #fff" v-show="dataColumn.is_check_realname=='1'">
                                    <div style="height:39px;border-bottom:1px solid #fff" >实名采集</div>
                                    <div style="height:40px;display: flex; flex-flow: row;width:180px">
                                        <div class="inline-fatg" v-show="dataColumn.is_check_realidentity=='1'"><span class="inline_overflow">身份证</span></div>
                                        <div class="inline-fatg" v-show="dataColumn.is_check_mobile=='1'"><span class="inline_overflow">手机号</span></div> 
                                        <div class="inline-fatg last"><span class="inline_overflow">总量</span></div>                                          
                                    </div>
                                </div>
                                <div style="border-right:1px solid #fff" v-show="dataColumn.is_check_virtual=='1'">
                                    <div style="height:39px;border-bottom:1px solid #fff;">虚拟身份</div>
                                    <div style="height:40px;display: flex; flex-flow: row;width:370px">
                                        <div class="inline-fatg" v-show="dataColumn.is_check_qq=='1'"><span class="inline_overflow">虚拟身份种类</span></div>
                                        <div class="inline-fatg" v-show="dataColumn.is_check_qq=='1'"><span class="inline_overflow">QQ</span></div>
                                        <div class="inline-fatg" v-show="dataColumn.is_check_wechat=='1'"><span class="inline_overflow">微信</span></div> 
                                        <div class="inline-fatg" v-show="dataColumn.is_check_taobao=='1'"><span class="inline_overflow">淘宝</span></div>                                                                               
                                        <div class="inline-fatg last"><span class="inline_overflow">总量</span></div>                                          
                                    </div>
                                </div>                                
                                <div style="border-right:1px solid #fff" v-show="dataColumn.is_check_hardware=='1'">
                                    <div style="height:39px;border-bottom:1px solid #fff" >硬件特征</div>
                                    <div style="height:40px;display: flex; flex-flow: row;width:240px">
                                        <div class="inline-fatg"  v-show="dataColumn.is_check_mac=='1'"><span class="inline_overflow">MAC</span></div>
                                        <div class="inline-fatg"  v-show="dataColumn.is_check_imsi=='1'"><span class="inline_overflow">IMSI</span></div> 
                                        <div class="inline-fatg"  v-show="dataColumn.is_check_imei=='1'"><span class="inline_overflow">IMEI</span></div> 
                                        <div class="inline-fatg last"><span class="inline_overflow">总量</span></div>                                                                                 
                                    </div>
                                </div> 
                                <div>
                                    <div style="height:82px;border-bottom:1px solid #fff;width:65px;line-height:80px" v-show="dataColumn.is_check_realname=='1'||dataColumn.is_check_virtual=='1'||dataColumn.is_check_hardware=='1'">参考结果</div>
                                </div>                         
                            </div>                                
                        </div>
                        <div v-show="dataColumn.is_check_datareport=='1'||dataColumn.is_check_datavalid=='1'" ref="tel_trans">
                            <div style="height:39px;border-bottom:1px solid #fff" >数据传输质量</div>
                            <div style="height:80px;display: flex; flex-flow: row;">
                                <div class="inline-fatg" style="line-height:80px" v-show="dataColumn.is_check_datareport=='1'"><span class="inline_overflow">上报率</span></div>
                                <div class="inline-fatg" style="line-height:80px" v-show="dataColumn.is_check_datavalid=='1'"><span class="inline_overflow">有效率</span></div>
                                <div class="inline-fatg last" style="line-height:80px"><span class="inline_overflow">参考结果</span></div>
                            </div>                                
                        </div>
                        <div ref="tel_result"><span class="overflow" style="width:65px;">参考结果</span></div>
                    </li>            
                </ul>
                <div class="content" style="height: calc(100% - 50px - 60px - 90px);">
                    <Scroll :listen="data" ref="indList">
                        <ul class="body">
                            <li class="item" v-for="(d,i) in showData">
                                <!--<li class="item" style="text-align:center;display: table-caption;" v-if="showData.length<=0&&!blnLoading">暂无数据</li>-->
                                <div  :style="listWidth.name"><span class="overflow" style="width:120px;">{{d.target_note}}</span></div>
                                <div :style="listWidth.onOff" v-show="dataColumn.is_check_netbar_off=='1'||dataColumn.is_check_netbar_except=='1'||dataColumn.is_check_netbar_detects=='1'">
                                    <div style="display: flex; flex-flow: row;">
                                        <div style="flex:1;border-right: 1px solid #e7eaec;" v-show="dataColumn.is_check_netbar_off=='1'"><span class="overflow">{{d.offs}}</span></div>
                                        <div style="flex:1;border-right: 1px solid #e7eaec;" v-show="dataColumn.is_check_netbar_except=='1'"><span class="overflow">{{d.excepts}}</span></div>
                                        <div style="flex:1;border-right: 1px solid #e7eaec;" v-show="dataColumn.is_check_netbar_detects=='1'"><span class="overflow">{{d.detects}}</span></div>
                                        <div style="flex:1" v-show="dataColumn.is_check_netbar_off=='1'||dataColumn.is_check_netbar_except=='1'||dataColumn.is_check_netbar_detects=='1'"><span class="overflow">{{d.stat_result}}</span></div>
                                    </div>                                
                                </div>
                                <div :style="listWidth.data" v-show="dataColumn.is_check_realname=='1'||dataColumn.is_check_virtual=='1'||dataColumn.is_check_hardware=='1'">
                                    <div style="display: flex; flex-flow: row;">
                                        <!--<div style="border-right:1px solid #e7eaec;width:95px">{{d.virtual_types}}
                                        </div>-->
                                        <div style="border-right:1px solid #fff" v-show="dataColumn.is_check_realname=='1'">
                                            <div style="display: flex; flex-flow: row;width:180px">
                                                <div style="flex:1;border-right: 1px solid #e7eaec;" v-show="dataColumn.is_check_realidentity=='1'"><span class="overflow">{{d.identity_num}}</span></div>
                                                <div style="flex:1;border-right: 1px solid #e7eaec;" v-show="dataColumn.is_check_mobile=='1'"><span class="overflow">{{d.mobile_num}}</span></div> 
                                                <div style="flex:1;border-right: 1px solid #e7eaec;"><span class="overflow">{{d.real_num}}</span></div>                                          
                                            </div>
                                        </div>
                                        <div style="border-right:1px solid #fff" v-show="dataColumn.is_check_virtual=='1'">
                                            <div style="display: flex; flex-flow: row;width:370px">
                                                <div style="flex:1;border-right: 1px solid #e7eaec;" ><span class="overflow">{{d.virtual_types}}</span></div>
                                                <div style="flex:1;border-right: 1px solid #e7eaec;" v-show="dataColumn.is_check_qq=='1'"><span class="overflow">{{d.qq_num}}</span></div>
                                                <div style="flex:1;border-right: 1px solid #e7eaec;" v-show="dataColumn.is_check_wechat=='1'"><span class="overflow">{{d.wechat_num}}</span></div> 
                                                <div style="flex:1;border-right: 1px solid #e7eaec;" v-show="dataColumn.is_check_taobao=='1'"><span class="overflow">{{d.taobao_num}}</span></div>                                                                        
                                                <div style="flex:1;border-right: 1px solid #e7eaec;"><span class="overflow">{{d.virtual_num}}</span></div>                                          
                                            </div>
                                        </div>                                
                                        <div style="border-right:1px solid #fff" v-show="dataColumn.is_check_hardware=='1'">
                                            <div style="display: flex; flex-flow: row;width:240px">
                                                <div style="flex:1;border-right: 1px solid #e7eaec;" v-show="dataColumn.is_check_mac=='1'"><span class="overflow">{{d.mac_num}}</span></div>
                                                <div style="flex:1;border-right: 1px solid #e7eaec;" v-show="dataColumn.is_check_imsi=='1'"><span class="overflow">{{d.imsi_num}}</span></div> 
                                                <div style="flex:1;border-right: 1px solid #e7eaec;" v-show="dataColumn.is_check_imei=='1'"><span class="overflow">{{d.imei_num}}</span></div> 
                                                <div style="flex:1;border-right: 1px solid #e7eaec;"><span class="overflow">{{d.hardware_num}}</span></div>                                                                                 
                                            </div>
                                        </div> 
                                        <div>
                                            <div style="border-bottom:1px solid #fff;width:65px;" v-show="dataColumn.is_check_realname=='1'||dataColumn.is_check_virtual=='1'||dataColumn.is_check_hardware=='1'">{{d.detect_result}}</div>
                                        </div>                         
                                    </div>                                
                                </div>
                                <div :style="listWidth.trans" v-show="dataColumn.is_check_datareport=='1'||dataColumn.is_check_datavalid=='1'">
                                    <div style="display: flex; flex-flow: row;">
                                        <div  style="flex:1;border-right: 1px solid #e7eaec;" v-show="dataColumn.is_check_datareport=='1'"><span class="overflow">{{d.reports}}</span></div>
                                        <div  style="flex:1;border-right: 1px solid #e7eaec;" v-show="dataColumn.is_check_datavalid=='1'"><span class="overflow">{{d.valids}}</span></div>
                                        <div  style="flex:1" v-show="dataColumn.is_check_datareport=='1'||dataColumn.is_check_datavalid=='1'"><span class="overflow">{{d.data_result}}</span></div>
                                    </div>                                
                                </div>
                                <div :style="listWidth.result"><span class="overflow" style="width:65px;">{{d.result}}</span></div>

                            </li>
                        </ul>
                    </Scroll>
                </div>
                <div class="page_container">
                    <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageNum+1}}</span></span>
                    <div class="firstPage" @click="pageChange(0)">首页</div>
                    <div class="prePage" @click="pageChange(pageNum-1)">上一页</div>
                    <div class="nextPage" @click="pageChange(pageNum+1)">下一页</div>
                </div>

            </div>
        </div>
    </div>
    </div>
</template>

<script>
import cSelect from 'components/Select'
import cInput from 'components/Input'
import HTag from 'components/HTag'
import LineCount from 'components/count/lineCount'
import NumShow from 'components/numshow'
import Scroll from 'components/scroll'
import MulDropDwon from 'components/MulDropDown'

import '../../static/DateRangePicker/moment.js'
//import echarts from  'echarts'
import echarts from  'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
// 引入提示框和标题组件
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/dataZoom'

import CountType from '../enum/CountType'

import {Customer,VidCounter,VidMac,SiteCount,DataCount,EquipmentCount,MobileCount,ExportOnlineCount,ExportDetailCount,DataTotal,DetailListCount,DetailListExport,
        FirmCount,BODY_RESIZE,Trigger_RESIZE,FirmSiteCount,FirmEquipmentCount,GetRegion,GetFirm,GetMicroprobe,SiteOnlineRate,GetFirmCollFirm,GetCollMicroprobe,
        GetSiteDeviceList,examineTaskList,examineResultList,examineExportTask,examineRuleList,examineRuleAdd,examineAddTask,examineGetTimeSetting,examineUpdTimeSetting,examineDeleteTask,examineDeleteRule,
        examineOrgOptionList,getDictTables,examineSaveOrgOption} from '../store/mutation-types'

export default {
  name: 'BasePage',
  components:{
    cSelect,
    HTag,
    LineCount,
    MulDropDwon,
    Scroll,
    titleComp:{
      props:['title'],
      template:`<div class="titleComp" style="cursor:pointer;display:inline-block;" @click="itemClick()">
                  <i class="fa fa-caret-down" style="font-size:18px;" :class="{rotate:blnExpan,rotatereverse:!blnExpan}"></i>
                  <span style="font-style: italic;">{{title}}</span>
                </div>
               `,
      data(){
        return {
          blnExpan:false,
        };
      },
      methods:{
        itemClick(){
        //   this.blnExpan= !this.blnExpan;
        //   this.$emit('change',this.blnExpan);
        }
      }
    },
    tag:{
        props:['title','num','info','icon','tip','subTip','bottomTip','rightTitle'],
        components:{NumShow},
        template:`<div class="tag" @mouseenter="mouseenter()">
                    <div style="padding:10px;">
                        <div class="title">
                            {{title}}
                            <span style="float:right;">{{tip}}</span>
                        </div>
                        <div class="number" style="padding-top:10px;font-size:20px;">
                            <div style="float:left;">
                                <i :class="icon || ''" style="font-size: 45px;margin-right:10px;"></i>
                                <span style="font-size: 14px;">{{subTip}}{{subTip && ':'}}</span>
                            </div>
                            <div style="float:right;margin-top: 20px;font-size: 14px;">{{rightTitle}}</div>
                            <div style="margin-left:100px;margin-right:70px;margin-top:18px;" :title="cNum">
                                <NumShow :num="cNum" ref="numShow" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" />
                            </div>
                            <div class="clearfix"></div>
                        </div>
                    </div>
                    <div class="bar">
                        <div style="margin-right:20px;display:inline-block;" v-for="i in info">{{i.name}} : {{conver(i.val)}}</div>
                        <div style="float:right;font-size:12px;margin-right:10px;">{{bottomTip}}</div>
                    </div>
                  </div>
                  `,
        computed:{
            cNum(){
                let num =(this.num+'') || '0';
                num = num.split('').reverse().join('');
                let len=num.length/3;
                let arr=[];
                for(let i=0;i<len;i++){
                    let start=i*3;
                    arr.unshift(num.substr(start,3).split('').reverse().join(''));
                }
                return arr.join(',');
            }
        },
        methods:{
            conver(val){
                let num =(val+'') || '0';
                num = num.split('').reverse().join('');
                let len=num.length/3;
                let arr=[];
                for(let i=0;i<len;i++){
                    let start=i*3;
                    arr.unshift(num.substr(start,3).split('').reverse().join(''));
                }
                return arr.join(',');
            },
            mouseenter(){
                //this.$refs.numShow.reset();
            }
        }

    }
  },
  watch:{
    optionIndex(){
        switch(this.optionIndex){
            case 0://柱状图
                if(!this.myChart)return;
                setTimeout(()=>{
                    this.myChart.resize();
                },0);
                break;
            case 1://线性图
                if(!this.myLineChart)return;
                setTimeout(()=>{
                    this.myLineChart.resize();
                },0);
                break;
        }
    },
    colltype(){
        if(this.colltype=="0"){
            this.addCollMicroprobe();
        }else{
            this.addFirmStatis();
        }
    },
    countIndex(){
        this.$nextTick(()=>{
            this.$store.commit(Trigger_RESIZE);
        });
    },
    timeRageVal(){
        this.SiteCountData(this.curKind).then(res=>{
            this.loadChart(res);
        });
        this.$store.dispatch(SiteOnlineRate,{
            queryType:this.curKind.val==0?'site':'equipment',
            timeType:this.timeRageVal,
            firm_id:_.map(this.Selfirms,s=>s.code).join(',')
        }).then(res=>{
            this.loadLineChart(res.biz_body);
        });
    },
    Selfirms(){
        this.SiteCountData(this.curKind).then(res=>{
            this.loadChart(res);
        });
        this.$store.dispatch(SiteOnlineRate,{
            queryType:this.curKind.val==0?'site':'equipment',
            timeType:this.timeRageVal,
            firm_id:_.map(this.Selfirms,s=>s.code).join(',')
        }).then(res=>{
            this.loadLineChart(res.biz_body);
        });
    },
    commonTime(){
        //if(!(this.commonTime && this.commonTime.length>1 && this.commonTime[0]))return;
        this.detais=_.map(this.detais,d=>{
            d.startTime=tool.DateFormat(this.commonTime[0],'yyyy-MM-dd');
            d.endTime=tool.DateFormat(this.commonTime[1],'yyyy-MM-dd');
            d.time=[tool.DateFormat(this.commonTime[0],'yyyy-MM-dd'),tool.DateFormat(this.commonTime[1],'yyyy-MM-dd')];

            return d;
        });
    },
    Listfirm(){
        this.GetListData();
    },
    countTime(){
        this.GetListData();
    }
  },
  data () {
    return {
      blnLoading:false,
      tags:[
          {name:'场所在离线',num:0,icon:'fa fa-bank',info:[{name:'在线',val:'0'},{name:'离线',val:'0'}],tip:'统计时间:当天',subTip:'总数',bottomTip:'单位/个'},
          {name:'设备在离线',num:0,icon:'fa fa-feed',info:[{name:'在线',val:'0'},{name:'离线',val:'0'}],tip:'统计时间:当天',subTip:'总数',bottomTip:'单位/台'},
          {name:'数据上传质量',num:0,icon:'fa fa-line-chart',info:[{name:'在线',val:'0'},{name:'离线',val:'0'}],tip:'统计时间:当天',subTip:'接收总数',bottomTip:'单位/条'},
          {name:'数据采集总量',num:0,icon:'fa fa-database',info:[{name:'特征',val:'0'},{name:'非经',val:'0'},{name:'网吧',val:'0'}],tip:'截止时间:当前',subTip:'总数'},
          {name:'实名信息采集',num:0,icon:'fa fa-male',info:[{name:'证件',val:'0'},{name:'手机',val:'0'}],tip:'截止时间:当前',subTip:'总数'},
          {name:'虚拟身份采集',num:0,icon:'fa fa-id-card-o',info:[{name:'网吧',val:'0'},{name:'非经',val:'0'},{name:'WIFI',val:'0'}],tip:'截止时间:当前',subTip:'总数'},
          {name:'手机号码采集',num:0,icon:'fa fa-phone-square',info:[{name:'无线',val:'0'},{name:'非经',val:'0'},{name:'非经',val:'0'}],tip:'截止时间:当前',subTip:'总数'},
          {name:'Mac采集',num:0,icon:'fa fa-sticky-note-o',info:[{name:'围栏',val:'0'},{name:'无线',val:'0'}],tip:'截止时间:当前',subTip:'总数'},
      ],
      viewTable:"statistics",                //考核和统计相互切换的标识
      blnShowHistoryPop:false,                //历史记录隐藏和显示的标识
      pageNum:0,                      //当前页号（0开始计数）
      data:[],
      historyData:[],                 //历史记录（考核任务列表）
      query:{
          limit:20,//每页10条
          skip:0,//跳过0条
          use_standard:'',// // 考核规则id
          last_schedule:'',//调度id
      },
      data:[],
      dataColumn:[],
      listResultSu:{           //结果列表中需要填充的内容
          name:"", 
          type:"",
          use_standard:"",
          last_schedule:"",
          begin_day:"",
          end_day:"",
      },
      listWidth:{             //表格宽度处理（单独设置解决,因宽度始终无法对齐因此进行单独的特殊处理）
        name:"",
        onOff:"",
        data:"",
        trans:"",
        result:"",
      },


      pages:[{name:'数据总揽',icon:'fa fa-tag'},{name:'采集详情',icon:'fa fa-tag'},{name:'接入统计',icon:'fa fa-tag'}],
      pageIndex:0,
      curKind:null,
      kinds:[{name:'场所',val:0,icon:'fa fa-share-alt'},{name:'设备',val:1,icon:'fa fa-shopping-basket'}],
      colltype:"1",
      colltypeAll:[{name:'按数据来源',value:"0"},{name:'按厂商',value:"1"}],
      myChart:null,
      myChartData:null,
      myLineChart:null,
      myLineChartData:null,
      timeRange:[{name:'近一月',val:'month'},{name:'近一周',val:'week'},{name:'上一月',val:'last_month'}],
      timeRageVal:'week',
      optionIndex:0,//当前图表显示页面索引
      countIndex:0,//当前详情统计显示索引(0:图表,1:列表)
      detais:[],
      region:null,
      regions:[],//区域数据
      firm:null,
      Selfirms:[],
      Listfirm:[],//列表厂商过滤条件
      firms:[],//厂商数据
      dataSource:null,
      dataSources:[],//数据来源数据
      commonTime:[],//公共日期范围
      countTime:[],//统计日期范围
      limitTime:{//限定统计日期范围选择只能选择60天之内的数据
           disabledDate(time) {
               let startTime=moment(),endTime=moment(),selTime=moment(time);
               startTime.subtract(60,'d');
               endTime.add(60,'d');
               
               return !(startTime.isBefore(selTime) && selTime.isBefore(endTime) && time.getTime() < Date.now());
           }
       },
       list_count_data:[],//列表统计数据
       list_count_count_data:{},//厂商统计数据
       FirmStatis:[],
       CollMicroprobe:[]
    }
  },
  mounted(){
    this.loadData();
    this.$store.commit(BODY_RESIZE,()=>{
        this.$nextTick(()=>{
            this.dealListWidth();    //列表宽度处理
        });
        if(!this.myChart)return;
        this.loadChart();
        this.myChart.resize();

        if(!this.myLineChart)return;
        this.myLineChart.resize();

    });

    //构造当前详细默认时间
    this.detais=_.map(CountType,(val,key)=>{
        let date=new Date(),startTime=new Date();
        startTime.setDate(startTime.getDate()-30);
        date.setDate(date.getDate()-1);

        return {
            name:key,
            key:val,
            startTime:tool.DateFormat(startTime,'yyyy-MM-dd'),
            endTime:tool.DateFormat(date,'yyyy-MM-dd'),
            time:[tool.DateFormat(startTime,'yyyy-MM-dd'),tool.DateFormat(date,'yyyy-MM-dd')]
        };
    });

    //获取列表统计数据
    this.GetListData();
    
  },
  computed:{
      showData(){
          return _.map(this.data,r=>{
                return {
                    target_note:r.target_note,
                    offs:(parseFloat(r.offs)*100).toFixed(2)+"%",
                    excepts:(parseFloat(r.excepts)*100).toFixed(2)+"%",
                    detects:(parseFloat(r.detects)*100).toFixed(2)+"%",
                    stat_result:r.stat_result,
                    real_num:r.real_num!="-1"? r.real_num:"—",
                    identity_num:r.identity_num!="-1"? r.identity_num:"—",
                    mobile_num:r.mobile_num!="-1"? r.mobile_num:"—",
                    virtual_types:r.virtual_types!="-1"? r.virtual_types:"—",
                    virtual_num:r.virtual_num!="-1"? r.virtual_num:"—",
                    qq_num:r.qq_num!="-1"? r.qq_num:"—",
                    wechat_num:r.wechat_num!="-1"? r.wechat_num:"—",
                    taobao_num:r.taobao_num!="-1"? r.taobao_num:"—",
                    hardware_num:r.hardware_num!="-1"? r.hardware_num:"—",
                    mac_num:r.mac_num!="-1"? r.mac_num:"—",
                    imsi_num:r.imsi_num!="-1"? r.imsi_num:"—",
                    imei_num:r.imei_num!="-1"? r.imei_num:"—",
                    detect_result:r.detect_result,
                    reports:(parseFloat(r.reports)*100).toFixed(2)+"%" ,
                    valids:(parseFloat(r.valids)*100).toFixed(2)+"%",
                    data_result:r.data_result,
                    result:r.result
                }
            });
      }
  },
  methods:{
      //刷新页面
      refreshPage(){
          this.loadData();
      },
      //加载数据
      loadData(){
        this.blnLoading=true;
        let Rx=this.$store.getters.Rx;
        let countRx = new Rx.Subject().bufferCount(6);
        countRx.subscribe(r=>{
            this.blnLoading=false;
        });
        if(this.viewTable=="check"&&this.showData.length<=0){
            this.getExTaskList();            
        }
        //获取场所在离线信息
        this.$store.dispatch(SiteCount).then(res=>{
            countRx.next(1);
            if(!tool.msg(res,'','获取场所在离线信息失败!')){return;}
            let self=this;
            this.tags=_.map(this.tags,(t,i)=>{
                if(i==0){return tool.Clone(self.formatCounter('场所在离线',res.biz_body),t);}
                return t;
            });
        });

        //获取设备在离线信息
        this.$store.dispatch(EquipmentCount).then(res=>{
            countRx.next(1);
            if(!tool.msg(res,'','获取设备在离线信息失败!')){return;}
            let self=this;
            this.tags=_.map(this.tags,(t,i)=>{
                if(i==1){return tool.Clone(self.formatCounter('设备在离线',res.biz_body),t);}
                return t;
            });
        });

        //数据上传质量统计信息
        this.$store.dispatch(DataCount).then(res=>{
            countRx.next(1);
            if(!tool.msg(res,'','获取数据上传质量信息失败!')){return;}
            let self=this;
            this.tags=_.map(this.tags,(t,i)=>{
                if(i==2){return tool.Clone(self.formatCounter('数据上传质量',res.biz_body),t);}
                return t;
            });
        });

        //数据采集总量
        this.$store.dispatch(DataTotal).then(res=>{
            countRx.next(1);
            if(!tool.msg(res,'','获取数据采集总量信息失败!')){return;}
            let self=this;
            this.tags=_.map(this.tags,(t,i)=>{
                if(i==3){return tool.Clone(self.formatCounter('数据采集总量',res.biz_body),t);}
                return t;
            });
        });

        //获取实名在离线信息
        this.$store.dispatch(Customer).then(res=>{
            countRx.next(1);
            if(!tool.msg(res,'','获取实名在离线信息失败!')){return;}
            let self=this;
            this.tags=_.map(this.tags,(t,i)=>{
                if(i==4){return tool.Clone(self.formatCounter('实名信息采集',res.biz_body),t);}
                return t;
            });
        });

        //获取虚拟网吧/非经营统计信息
        this.$store.dispatch(VidCounter).then(res=>{
            countRx.next(1);
            if(!tool.msg(res,'','获取虚拟网吧/非经营统计信息失败!')){return;}
            let self=this;
            this.tags=_.map(this.tags,(t,i)=>{
                if(i==5){return tool.Clone(self.formatCounter('虚拟身份采集',res.biz_body),t);}
                return t;
            });
        });

        //获取手机号码采集信息
        this.$store.dispatch(MobileCount).then(res=>{
            countRx.next(1);
            if(!tool.msg(res,'','获取手机号码采集信息失败!')){return;}
            let self=this;
            this.tags=_.map(this.tags,(t,i)=>{
                if(i==6){return tool.Clone(self.formatCounter('手机号码采集',res.biz_body),t);}
                return t;
            });
        });

        //获取虚拟MAC统计信息
        this.$store.dispatch(VidMac).then(res=>{
            countRx.next(1);
            if(!tool.msg(res,'','获取虚拟MAC统计信息失败!')){return;}
            let self=this;
            this.tags=_.map(this.tags,(t,i)=>{
                if(i==7){return tool.Clone(self.formatCounter('Mac采集',res.biz_body),t);}
                return t;
            });
        });

        //获取区域下拉框数据
        this.$store.dispatch(GetRegion).then(res=>{
            if(!tool.msg(res,'','获取区域数据失败!'))return;
            this.regions=res.biz_body;
        });
        //获取厂商下拉框数据
        this.$store.dispatch(GetFirm).then(res=>{
            if(!tool.msg(res,'','获取厂商数据失败!'))return;
            this.firms=res.biz_body;
        });
        //获取数据来源下拉框数据
        this.$store.dispatch(GetMicroprobe).then(res=>{
            if(!tool.msg(res,'','获取数据来源数据失败!'))return;
            this.dataSources=res.biz_body;
        });

        this.addFirmStatis();    //按厂商统计采集量


        setTimeout(()=>{
            this.curKind=this.kinds[0];
            this.SiteCountData(this.curKind).then(res=>{
                countRx.next(1);
                this.myChart = echarts.init($(this.$el).find('div[name="chart_container"]')[0]);
                this.loadChart(res);
            });
            this.$store.dispatch(SiteOnlineRate,{
                queryType:this.curKind.val==0?'site':'equipment',
                timeType:this.timeRageVal,
                firm_id:_.map(this.Selfirms,s=>s.code).join(',')
            }).then(res=>{
                this.myLineChart=echarts.init($(this.$el).find('div[name="line_chart_container"]')[0]);
                this.loadLineChart(res.biz_body);
            });
        },100);

      },
      //考核和统计相互切换  
      switchView(type){
        if(type==this.viewTable) return
        this.viewTable=type;
        if(this.viewTable=="check"&&this.showData.length<=0){
            this.getExTaskList();            
        }else if(this.viewTable=="statistics"){
            this.$nextTick(()=>{
                this.$store.commit(Trigger_RESIZE);
            });
            
          /*  if(this.myChart){
                this.loadChart();
                this.myChart.resize();                
            };
            if(this.myLineChart){
                this.myLineChart.resize();
            }       */    
        }
      },      
      //获取列表数据
      GetListData(){
        //获取列表统计数据
        this.$store.dispatch(DetailListCount,{
            firm_id:_.map(this.Listfirm,d=>d.code).join(','),
            receive_time_start:this.countTime.length>0 && this.countTime[0]?tool.Timestamp(this.countTime[0]):'',
            receive_time_end:this.countTime.length>0 && this.countTime[1]?tool.Timestamp(this.countTime[1]):''
        }).then(res=>{
            this.list_count_data=res.biz_body;
            this.list_count_count_data=_.reduce(this.list_count_data,(r,d)=>{

                return {
                    '网吧':(r.网吧 || 0)+d.网吧,
                    '无线WIFI':(r.无线WIFI || 0)+d.无线WIFI,
                    '特征采集':(r.特征采集 || 0)+d.特征采集,
                    '合计':(r.合计 || 0)+d.合计,
                    '实际条数':(r.实际条数 || 0)+d.实际条数,
                    '有效条数':(r.有效条数 || 0)+d.有效条数,
                    '无效条数':(r.无效条数 || 0)+d.无效条数,
                    '有效率':parseFloat((r.有效率 || '0%').replace('%')) +parseFloat(d.有效率.replace('%'))+'%'
                };

            },{});
        });
      },
      //详情统计列表展示页面场所统计厂商选择项单击事件
      detail_list_firmClick(d){
        if(_.findIndex(this.Listfirm,t=>t.code==d.code)>=0)return;
        this.Listfirm.push(d);
      },
      firmClick(d){
        if(_.findIndex(this.Selfirms,t=>t.code==d.code)>=0)return;
        this.Selfirms.push(d);
      },
      //tag项改变事件
      tagChange(i){
        this.pageIndex=i;
        this.$store.commit(Trigger_RESIZE);
      },
      kindchange(item){
        this.curKind=item;
        this.SiteCountData(item).then(res=>{
            this.loadChart(res);
         });
        this.$store.dispatch(SiteOnlineRate,{
            queryType:this.curKind.val==0?'site':'equipment',
            timeType:this.timeRageVal,
            firm_id:_.map(this.Selfirms,s=>s.code).join(',')
        }).then(res=>{
            this.loadLineChart(res.biz_body);
        });
      },
      //导出在离线统计数据
      ExportOnlineCount(){

          this.$store.dispatch(ExportOnlineCount,{
              firm_id:_.map(this.Selfirms,m=>m.code).join(','),
              timeType:this.timeRageVal
            }).then(res=>{
              if(!tool.msg(res,'','导出失败!'))return;
              window.location=res.biz_body.url;
          });
      },
      //导出详情统计数据
      ExportDetailCount(){

          if(this.countIndex==0){
            //详情图表导出
            let time=this.commonTime[0]?[moment(tool.DateFormat(this.commonTime[0],'yyyy-MM-dd')),moment(tool.DateFormat(this.commonTime[1],'yyyy-MM-dd'))]:[];

            this.$store.dispatch(ExportDetailCount,{
                    region:this.region,
                    firm_id:this.firm,
                    microprobe_type:this.dataSource,
                    date:time.length>0?`${time[0].format('YYYYMMDD')},${time[1].format('YYYYMMDD')}`:'',
                }).then(res=>{

                if(!tool.msg(res,'','导出失败!'))return;
                window.location=res.biz_body.url;
            });
          }else{
              
              let time=this.countTime[0]?[moment(tool.DateFormat(this.countTime[0],'yyyy-MM-dd')),moment(tool.DateFormat(this.countTime[1],'yyyy-MM-dd'))]:[];
              
              //详情列表导出
              this.$store.dispatch(DetailListExport,{
                  firm_id:_.map(this.Listfirm,m=>m.code).join(','),
                  date:time.length>0?`${time[0].format('YYYYMMDD')},${time[1].format('YYYYMMDD')}`:'',
              }).then(res=>{
                  if(!tool.msg(res,'','导出失败!'))return;
                  window.location=res.biz_body.url;
              });
          }
      },
      //获取在离线统计相关数据
      SiteCountData(kind){ 
        switch(kind.val){
            case 0: //场所
               return this.$store.dispatch(FirmSiteCount,{timeType:this.timeRageVal,firm_id:_.map(this.Selfirms,s=>s.code).join(',')}).then(res=>{
                    if(res.msg.code!='successed')return;
                    let data=_.sortBy(res.biz_body,r=>{
                        return -_.reduce(r.data,function(memo,num){
                            return memo+Math.abs(num);},0)
                    });
                    
                    res={
                        xAxis:_.map(data,d=>d.厂商名称),
                        series:_.map(_.zip(..._.map(data,d=>{
                            return _.map(d.data,(val,key)=>{return {name:key,data:[val]};})
                        })),arr=>{
                            let res={};
                            res.data=_.map(arr,a=>{
                                res.name=a.name;
                                return a.data[0]
                            });
                            return res;
                        })
                    };

                    return res;
                });
                break;
            case 1://设备
                return this.$store.dispatch(FirmEquipmentCount,{timeType:this.timeRageVal,firm_id:_.map(this.Selfirms,s=>s.code).join(',')}).then(res=>{
                    if(res.msg.code!='successed')return;
                    let data=_.sortBy(res.biz_body,r=>{
                        return -_.reduce(r.data,function(memo,num){
                            return memo+Math.abs(num);},0)
                    });

                    res={
                        xAxis:_.map(data,d=>d.厂商名称),
                        series:_.map(_.zip(..._.map(data,d=>{
                            return _.map(d.data,(val,key)=>{return {name:key,data:[val]};})
                        })),arr=>{
                            let res={};
                            res.data=_.map(arr,a=>{
                                res.name=a.name;
                                return a.data[0]
                            });
                            return res;
                        })
                    };

                    return res;
                });
                break;
        }

        return res;
      },
      //加载柱状图数据
      loadChart(data){
        if(data){this.myChartData=data;}else{data=this.myChartData;}

        let option = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            color:['#1ca5f6','#85c226', '#f8c301'],
            legend: {
                data:_.map(data.series,d=>d.name)
            },
            grid: {
                left: '3%',
                right: '4%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    axisLabel:{
                        rotate:0,
                        show:true,
                        showMinLabel:true,
                    },
                    data :data.xAxis
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    splitNumber:1,
                }
            ],
            dataZoom: [{
                startValue: data.xAxis[0],
                endValue:$(window).width()>1500?data.xAxis[8] || data.xAxis[data.xAxis.length-1]:data.xAxis[5] || data.xAxis[data.xAxis.length-1]
            }, {
                type: 'inside'
            }],
            series : _.map(data.series,d=>{return {name:d.name,type:'bar',data:d.data}})
        };

        this.myChart.setOption(option,{notMerge:true});
      },
      //加载线性图
      loadLineChart(data){
        if(data){this.myLineChartData=data;}else{data=this.myLineChartData;}
        data.firms =_.sortBy(data.firms, function(f){ return Math.sin(f.id); });

        let firmNames=_.pluck(data.firms,'name');
        let firms=_.map(data.firms,f=>{ f.type="line"; return f;});

        let  option = {
                tooltip: {
                    trigger: 'axis',
                    formatter:function(param){
                        let str='';
                        _.each(param,p=>{
                            str+=`${p.seriesName}:${p.data}%<br>`
                        });
                        return str;
                    }
                },
                legend: {
                    data:firmNames
                },
                xAxis:  {
                    type: 'category',
                    boundaryGap: false,
                    data: data.days,
                    axisLabel:{  
                        interval:0,  
                        rotate:45,//倾斜度 -90 至 90 默认为0  
                        margin:2,  
                        textStyle:{  
                            color:"#000000"  
                        }  
                    },
                },
                yAxis: {
                    type: 'value',
                    name: '在线率',
                    axisLabel: {
                        formatter: '{value} %'
                    }
                },
                series:firms
            };
        
        this.myLineChart.setOption(option,{notMerge:true});
      },
      //转化统计数据显示格式
      formatCounter(name,data){
        let res={name:name,num:0,info:[]};
        let converFunc=(num,blnShow)=>{
            let baseNum=10000;
            if(num<baseNum){return num;}
            return blnShow?Math.floor(num/baseNum)+'万'+(num%baseNum):num;
        };

        _.each(data || [],(val,key)=>{
            if(key=='total'){
                res.num=converFunc(parseInt(val));
            }else if(key=='data'){
                res.info=_.map(val,v=>{return {name:v.name,val:converFunc(parseInt(v.count))};});
            }else if(key=='right_title'){
                res.right_title=val;
            }
        });
        return res;
      },

        // 加载按厂商统计采集量
       addFirmStatis(){
          this.$store.dispatch(GetFirmCollFirm).then(res=>{
              if(!tool.msg(res,'','搜索失败!'))return;
              this.FirmStatis=res.biz_body;
          });
       },
        // 加载按按数据来源统计采集量
       addCollMicroprobe(){
          this.$store.dispatch(GetCollMicroprobe).then(res=>{
              if(!tool.msg(res,'','搜索失败!'))return;
              this.CollMicroprobe=[];
                for(arr of res.biz_body){
                    switch(arr.microprobe_type){
                        case "网吧":
                            this.CollMicroprobe.push({
                                name:arr.microprobe_type,
                                title_one:"接入场所：",
                                num_one:arr.netbar_num,
                                title_two:"采集总量：",
                                num_two:arr.netbar_detect_num,     
                                icon:"fa fa-desktop"                       
                            })
                            break;
                        case "无线WIFI":
                            this.CollMicroprobe.push({
                                name:arr.microprobe_type,
                                title_one:"接入设备：",
                                num_one:arr.equip_num,
                                title_two:"接入总量：",
                                num_two:arr.equip_detect_num,     
                                icon:"fa fa-wifi"                       
                            })
                            break;
                        case "特征设备":
                            this.CollMicroprobe.push({
                                name:arr.microprobe_type,
                                title_one:"接入设备:",
                                num_one:arr.equip_num,
                                title_two:"接入总量:",
                                num_two:arr.equip_detect_num,     
                                icon:"fa fa-podcast"                       
                            })
                            break;
                        case "宾馆酒店":
                            this.CollMicroprobe.push({
                                name:arr.microprobe_type,
                                title_one:"接入设备:",
                                num_one:arr.equip_num,
                                title_two:"接入总量:",
                                num_two:arr.equip_detect_num,     
                                icon:"fa fa-leaf"                       
                            })
                            break;                                                    
                    }
                }



          });
       },


        //任务列表的现实和隐藏
        changeHisHun(){
            this.blnShowHistoryPop=!this.blnShowHistoryPop;
            if(this.blnShowHistoryPop){
                this.$nextTick(()=>{
                   this.$refs.historyStaScroll.reloadyScroll();
                });
            }   
        },
       //列表宽度处理，解决列表表头与数据不对齐的问题，因时间较紧，临时解决一下，后续需要处理
       dealListWidth(){
           if(this.viewTable!="check") return;
           if(!this.$refs.tel_name) return;           
            this.listWidth={           
                name:"width:"+this.$refs.tel_name.offsetWidth+"px",
                onOff:"width:"+this.$refs.tel_onOff.offsetWidth+"px",
                data:"width:"+this.$refs.tel_data.offsetWidth+"px",
                trans:"width:"+this.$refs.tel_trans.offsetWidth+"px",
                result:"width:"+this.$refs.tel_result.offsetWidth+"px",
            };
       },
       //转化时间
       converTime(t){
           return tool.DateByTimestamp(t,'yyyy-MM-dd hh:mm:ss');
       },
       //简单的时间戳转化（仅用于当前页面）
      changeTimeFun(val){
        let time=new Date(val).getFullYear()+'-';
        let timeMonth=parseInt((new Date(val).getMonth()+1))<10 ? '0'+(new Date(val).getMonth()+1):(new Date(val).getMonth()+1);
        let timeDay=parseInt(new Date(val).getDate())<10 ? '0'+new Date(val).getDate():new Date(val).getDate();
        time+=timeMonth+'-'+timeDay;
        return time;
      },
      //获取考核任务列表
      getExTaskList(){
            this.$store.dispatch(examineTaskList).then(res=>{
                if(res.msg.code!='successed')return;
                this.historyData=res.biz_body;
                // 默认显示第一个能显示的任务（如果页面没有内容可以显示时）
                if(this.showData.length<=0){
                    for(let any of this.historyData){
                        if(any.last_schedule&&any.last_schedule!='0'){               
                            this.getTaskResList(any.task_title,any.check_target_desc,any.use_standard,any.last_schedule,any.task_status,any.disabled,any.begin_day,any.end_day)                        
                            break;
                        }
                    }
                }
   
            });
      },  
      //删除考核任务
      deleteTaskFun(val){
            this.$store.dispatch(examineDeleteTask,{task_id:val}).then(res=>{
                if(res.msg.code!='successed')return;
                tool.info('任务禁用成功');
                this.getExTaskList(); //删除后刷新列表
        });
      },

      //获取考核结果列表 
      getTaskResList(title,type,use_standard,last_schedule,task_status,disabled,begin_day,end_day){
          /*if(disabled!="0"){
              tool.info('该任务已失效，请选择其他任务!');
              return;listResultSu.begin_day
          }*/
          if(!last_schedule||last_schedule=="0"){
              tool.info('该任务正在执行中，请稍后...');
              return;
          }
            this.blnShowHistoryPop=false;
            // 相关数据填充
            this.query.use_standard=use_standard;
            this.query.last_schedule=last_schedule;   
            this.listResultSu={
                name:title, 
                type:type,
                use_standard:use_standard,
                last_schedule:last_schedule,
                begin_day:begin_day.substring(0,4)+"-"+begin_day.substring(4,6)+"-"+begin_day.substring(6),
                end_day:end_day.substring(0,4)+"-"+end_day.substring(4,6)+"-"+end_day.substring(6),
            }      
            this.$store.dispatch(examineResultList,this.query).then(res=>{
                this.data=res.biz_body.data;     //所有数据
                this.dataColumn=res.biz_body.column;            
                this.$nextTick(()=>{
                    this.dealListWidth();    //列表宽度处理
                });
            });
      },
      //导出考核结果列表 
      exportTastTesListFun(use_standard,last_schedule){
        this.$store.dispatch(examineExportTask,{use_standard:use_standard,last_schedule:last_schedule}).then(res=>{
            if(!tool.msg(res,'','导出失败!'))return;
            window.location=res.biz_body.url;
        });
      },
        // 考核管理弹出层
       checkManageFun(){
            this.blnShowHistoryPop=false;
            let self=this;            
            tool.open(function(){
                let html=`<div name="container" class="container">
                            <div class="row"> 
                                <div class="item_set" @click="firmSet()">厂商配置 <i class="fa fa-gear"></i></div>
                            </div>
                            <div class="check-detail-row" @click="selectFun('1')">
                                <div class="item_label_left">
                                    <div class="img-t"><i class="fa fa-clock-o"></i></div>
                                    <div class="detail-title">配置定时考核</div>
                                    <div class="iden_container active" v-show="select=='1'"><i class="fa fa-check"></i></div>
                                </div>                          
                            </div>    
                            <div class="check-detail-row" @click="selectFun('2')">  
                                <div class="item_label_left">
                                    <div class="img-t"><i class="fa fa-calendar"></i></div>
                                    <div class="detail-title">新增考核任务</div>
                                    <div class="iden_container active" v-show="select=='2'"><i class="fa fa-check iden"></i></div>
                                </div>   
                            </div>
                            <div class="check-button">
                                <div class="item" >
                                    <el-button @click="cancel_click()"><span>取消</span></el-button>
                                    <el-button type="primary" @click="next_click()"><span>下一步</span></el-button>
                                </div>
                            </div>
                        </div>`;
                let param={
                        title:"考核管理",
                        content:html,
                        skin:'check-manage',
                        area:['600px','350px'],
                        context:{
                            select:"0",           //0：未选择  1：选中配置考核   2：选中新增考核   
                            cancel_click(){
                                param.close();
                            },
                            // 下一步
                            next_click(){
                                switch(param.selfData.select){
                                    case "1":
                                        self.setCheckFun();
                                        break;  
                                    case "2":
                                        self.newCheckFun();
                                        break;
                                    default:
                                        break;
                                }                       
                                param.close();
                            },
                            selectFun(val){
                                param.selfData.select=val;
                            },
                            firmSet(){
                                self.firmSetFun();
                                param.close();
                            }
                        },
                    };
                return param;                
            }());     
       },
      // 考核管理的厂商配置
      firmSetFun(){
            this.blnShowHistoryPop=false;
            let self=this;
            tool.open(function(){
                let html=`<div name="container" style="width:100%;height:100%;padding: 10px;" >
                            <div style="color: #888;margin-bottom: 15px;">*未选中则视为厂商不支持该种数据采集，不会被纳入考核</div>
                            <!--加载中标识-->
                            <div v-if="DeviceblnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;">
                                <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
                            </div>
                            <div class="mount-table">
                                <div class="header">
                                    <div class="mount_item" ><span class="overflow" style="width:220px;">厂商名称</span></div>
                                    <div class="mount_item" ><span class="overflow" style="width:200px;">数据来源</span></div>
                                    <div class="mount_ital" style="width:142px">
                                        <div class="mount_nule" style="border-bottom:1px solid #c9c9c9">实名采集</div>
                                        <div class="mount_nule">
                                            <div style="width:67px;border-right:2px solid #c9c9c9;height:100%"><span class="overflow">身份证</span></div>
                                            <div style="width:67px"><span class="overflow">手机号</span></div>
                                        </div>
                                    </div>
                                    <div class="mount_ital" style="width:213px">
                                        <div class="mount_nule" style="border-bottom:1px solid #c9c9c9">虚拟身份</div>
                                        <div class="mount_nule">
                                            <div style="width:67px;border-right:2px solid #c9c9c9;height:100%"><span class="overflow">QQ</span></div>
                                            <div style="width:67px;border-right:2px solid #c9c9c9;height:100%"><span class="overflow">微信</span></div>
                                            <div style="width:67px"><span class="overflow">淘宝</span></div>
                                        </div>
                                    </div>
                                    <div class="mount_ital" style="width:213px">
                                        <div class="mount_nule" style="border-bottom:1px solid #c9c9c9">硬件特征</div>
                                        <div class="mount_nule">
                                            <div style="width:67px;border-right:2px solid #c9c9c9;height:100%"><span class="overflow">MAC</span></div>
                                            <div style="width:67px;border-right:2px solid #c9c9c9;height:100%"><span class="overflow">IMSI</span></div>
                                            <div style="width:67px"><span class="overflow">IMEI</span></div>
                                        </div>
                                    </div>
                                    <div class="mount_item" v-if="detailData.length>=7"><span class="overflow" style="width:11px;"></span></div>
                                </div>
                                
                                <div class="content" style="height: 332px;overflow-y: auto;overflow-x: hidden;">
                                    <div v-if="detailData.length<=0&&!DeviceblnLoading" class="content">
                                        <div class="mount_item"><span class="overflow" style="width:990px;">暂无数据</span></div>
                                    </div>
                                   <!-- <Scroll :listen="detailData">    -->
                                        <div v-for="(d,i) in detailData" class="content">
                                            <div class="mount_item" :title="d.security_software_orgname"><span class="overflow" style="width:220px;">{{d.security_software_orgname}}</span></div>
                                            <div class="mount_item"><span class="overflow" style="width:200px;">
                                                <div style="width:140px;margin:0 auto">
                                                    <el-select v-model="d.microprobe_type" :clearable="true" placeholder="请选择" @change="editSelectFun(i)">
                                                        <el-option v-for="kind in dict_tables.microprobe_type" :label="kind.name" :value="kind.value"></el-option>
                                                    </el-select>
                                                </div>                                                                        
                                            </div>
                                            <div class="mount_item"><span class="overflow" style="width:65px;"><el-switch on-text="" off-text="" v-model="d.options.identity"></el-switch></span></div>
                                            <div class="mount_item"><span class="overflow" style="width:72px;"><el-switch on-text="" off-text="" v-model="d.options.mobile"></el-switch></span></div>
                                            <div class="mount_item"><span class="overflow" style="width:65px;"><el-switch on-text="" off-text="" v-model="d.options.qq"></el-switch></span></div>
                                            <div class="mount_item"><span class="overflow" style="width:68px;"><el-switch on-text="" off-text="" v-model="d.options.wechat"></el-switch></span></div>
                                            <div class="mount_item"><span class="overflow" style="width:72px;"><el-switch on-text="" off-text="" v-model="d.options.taobao"></el-switch></span></div>
                                            <div class="mount_item"><span class="overflow" style="width:65px;"><el-switch on-text="" off-text="" v-model="d.options.terminal_mac"></el-switch></span></div>
                                            <div class="mount_item"><span class="overflow" style="width:68px;"><el-switch on-text="" off-text="" v-model="d.options.imsi"></el-switch></span></div>
                                            <div class="mount_item"><span class="overflow" style="width:72px;"><el-switch on-text="" off-text="" v-model="d.options.imei"></el-switch></span></div>
                                    
                                        </div>
                                    <!--</Scroll>-->
                                </div>                                                              
                            </div>
                            <div style="margin-top:10px;margin-right:30px;text-align:right;">
                                    <button type="button" class="btn btn-success" style="font-size:12px;" @click="submit">确定</button> 
                                    <button type="button" class="btn btn-default" style="font-size:12px;" @click="cancel">取消</button>
                            </div>     
                        </div>`;
                let param={
                        title:'厂商数据项设置',
                        content:html,
                        skin:'firm-check-list',
                        area:['1030px','530px'],
                        components:{Scroll},
                        context:{
                            detailData:"",
                            valueTest:"",
                            dict_tables:"",
                            DeviceblnLoading:true,   //加载中标识
                            cancel(){
                                param.close();
                            },
                            // 	数据来源改变时设置默认值
                            editSelectFun(num){
                                num=parseInt(num);
                                param.selfData.detailData[num].options={
                                    hardware:true,
                                    real:true,
                                    virtual:true,
                                    identity:true,
                                    mobile:true,
                                    qq:true,
                                    wechat:true,
                                    taobao:true,
                                    terminal_mac:true,
                                    imsi:true,
                                    imei:true,                                                
                                }                                
                                switch( param.selfData.detailData[num].microprobe_type){
                                    case "145":
                                        param.selfData.detailData[num].options.identity=false;
                                        break;
                                    case "120":
                                        param.selfData.detailData[num].options.mobile=false;
                                        param.selfData.detailData[num].options.terminal_mac=false;
                                        param.selfData.detailData[num].options.imsi=false;
                                        param.selfData.detailData[num].options.imei=false;
                                        break;                                                                              
                                }
                            },
                            submit(){
                                for(var key of param.selfData.detailData){
                                    delete key.security_software_orgname;
                                    key.options=JSON.stringify(key.options)
                                }
                                let obj={
                                    options:param.selfData.detailData
                                }
                                 self.$store.dispatch(examineSaveOrgOption,obj).then(res=>{
                                    if(res.msg.code!='successed')return;
                                    param.close();
                                    tool.info('厂商数据项设置成功!');
                                 })
                            },
                            loadDictTables(){
                                self.$store.dispatch(getDictTables).then(res=>{
                                    param.selfData.dict_tables= res.biz_body;
                                    param.selfData.loadDevice();          
                                })
                            },
                            loadDevice(){
                                self.$store.dispatch(examineOrgOptionList).then(res=>{
                                    if(res.msg.code!='successed')return;
                                    param.selfData.DeviceblnLoading=false;
                                    param.selfData.detailData= res.biz_body;
                                    // 后端的数据options序列化一下,如果options为空则添加一个默认值
                                    for(let i=0;i<param.selfData.detailData.length;i++){
                                        if(param.selfData.detailData[i].options){
                                            param.selfData.detailData[i].options=eval('(' + param.selfData.detailData[i].options + ')');
                                        }else{
                                            param.selfData.detailData[i].options={
                                                hardware:true,
                                                real:true,
                                                virtual:true,
                                                identity:false,
                                                mobile:false,
                                                qq:false,
                                                wechat:false,
                                                taobao:false,
                                                terminal_mac:false,
                                                imsi:false,
                                                imei:false,                                                
                                            }
                                        }
                                    }
                                });
                            }
                        },
                        success(){
                            param.selfData.loadDictTables();                          
                        }
                    };

                return param;
            }());                 
      },
      // 新增考核任务
      newCheckFun(){
            let self=this;
            tool.open(function(){
                let html=`<div name="container" class="container">
                            <div class="row set-check-row">
                                <div class="form-group">
                                    <label class="col-md-2 control-label">考核名称:</label>
                                    <div class="col-md-4">
                                        <el-input v-model="sum.task_title" placeholder="请输入名称"></el-input>   
                                    </div>
                                </div>                                                    
                            </div>
                            <div class="row set-check-row">
                                <div class="form-group">
                                    <label class="col-md-2 control-label">考核周期:</label>
                                    <div class="col-md-6">
                                        <el-date-picker
                                        v-model="sum.times"
                                        type="daterange"
                                        :picker-options="pickerOptions0"
                                        placeholder="选择日期范围">
                                        </el-date-picker>
                                    </div>
                                </div>                                                    
                            </div>
                            <div class="row set-check-row">
                                <div class="form-group">
                                    <label class="col-md-2 control-label">考核规则:</label>
                                    <div class="col-md-4">
                                        <el-select v-model="sum.firm_use_standard" :clearable="true" placeholder="厂商规则" >
                                            <el-option v-for="kind in firm" :label="kind.standard_title" :value="kind.standard_id"></el-option>
                                        </el-select>
                                    </div>
                                    <div class="col-md-4">
                                        <el-select v-model="sum.region_use_standard" :clearable="true" placeholder="区域规则" >
                                            <el-option v-for="kind in region" :label="kind.standard_title" :value="kind.standard_id"></el-option>
                                        </el-select>
                                    </div>
                                </div>                                                    
                            </div>                                                  
                            <div style="margin-top:10px;margin-right:30px;text-align:right;">
                                <button type="button" class="btn btn-success" style="font-size:12px;"  @click="submit">确定</button> 
                                <button type="button" class="btn btn-default" style="font-size:12px;" @click="cancel">取消</button>
                            </div>                   
                        </div>`
                let param={
                        title:"新增考核",
                        content:html,
                        skin:'set-check-manage',
                        area:['600px','280px'],
                        context:{
                            sum:{
                                task_title:"",
                                begin_time:"",
                                end_time:"",
                                times:"",
                                firm_use_standard:"",
                                region_use_standard:"",                   
                            },
                            pickerOptions0: {                      //时间范围
                                disabledDate(time) {
                                    return time.getTime() >Date.now() - 8.64e7; //默认只能选择今天及今天以前的日期
                                }
                            },
                            firm:"",
                            region:"",
                            submit(){
                               if(!param.selfData.sum.task_title || !param.selfData.sum.times){
                                    tool.info('考核名称，考核周期必填!');
                                    return;
                                }
                                if(!param.selfData.sum.firm_use_standard && !param.selfData.sum.region_use_standard){
                                    tool.info('厂商规则和区域规则必须选择一个!');
                                    return;
                                }
                                param.selfData.sum.begin_time=self.changeTimeFun(param.selfData.sum.times[0]);
                                param.selfData.sum.end_time=self.changeTimeFun(param.selfData.sum.times[1]);   
                                self.$store.dispatch(examineAddTask,param.selfData.sum).then(res=>{
                                    if(res.msg.code!='successed')return;
                                    param.close();
                                    tool.info('考核任务新增成功!');
                                    self.getExTaskList();    // 考核任务新增成功后刷新任务列表
                                    self.blnShowHistoryPop=true;
                                })                                   
                            },
                            cancel(){
                                param.close();
                            },
                            loadDetail(){

                                self.$store.dispatch(examineRuleList,{check_target:'firm'}).then(res=>{
                                    if(res.msg.code!='successed')return;
                                     param.selfData.firm=res.biz_body;
                                })
                                self.$store.dispatch(examineRuleList,{check_target:'region'}).then(res=>{
                                    if(res.msg.code!='successed')return;
                                     param.selfData.region=res.biz_body;
                                })                                
                            }
                        },
                        success(){
                            param.selfData.loadDetail();    
                        },
                    };
                return param;                
            }());     
      },
      // 定时考核设置
       setCheckFun(){
            let self=this;
            tool.open(function(){
                let html=`<div name="container" class="container">
                            <div class="row set-check-row">
                                <div class="form-group">
                                    <label class="col-md-2 control-label">考核名称:</label>
                                    <div class="col-md-4">
                                        <el-input v-model="sum.task_title" placeholder="请输入名称"></el-input>   
                                    </div>
                                </div>                                                    
                            </div>
                            <div class="row set-check-row">
                                <div class="form-group">
                                    <label class="col-md-2 control-label">间隔天数:</label>
                                    <div class="col-md-4">
                                        <el-input v-model="sum.interval" placeholder="间隔时间"></el-input>                                           
                                    </div>
                                </div>                                                    
                            </div>
                            <div class="row set-check-row">
                                <div class="form-group">
                                    <label class="col-md-2 control-label">考核规则:</label>
                                    <div class="col-md-4">
                                        <el-select v-model="sum.firm_use_standard" placeholder="厂商规则" >
                                            <el-option v-for="kind in firm" :label="kind.standard_title" :value="kind.standard_id"></el-option>
                                        </el-select>
                                    </div>
                                    <div class="col-md-4">
                                        <el-select v-model="sum.region_use_standard" placeholder="区域规则" >
                                            <el-option v-for="kind in region" :label="kind.standard_title" :value="kind.standard_id"></el-option>
                                        </el-select>
                                    </div>
                                </div>                                                    
                            </div>                                                  
                            <div style="margin-top:10px;margin-right:30px;text-align:right;">
                                <button type="button" class="btn btn-success" style="font-size:12px;"  @click="submit">确定</button> 
                                <button type="button" class="btn btn-default" style="font-size:12px;" @click="cancel">取消</button>
                            </div>                   
                        </div>`
                let param={
                        title:"定时考核设置",
                        content:html,
                        skin:'set-check-manage',
                        area:['600px','280px'],
                        context:{
                            sum:{
                                task_title:"",
                                interval :"",
                                firm_task_id:"",
                                region_task_id:"",
                                firm_use_standard:"",    
                                region_use_standard:"",               
                            },
                            firm:"",
                            region:"",
                            submit(){
                               if(!param.selfData.sum.task_title || !param.selfData.sum.interval){
                                    tool.info('考核名称，间隔天数必填!');
                                    return;
                                }
                                if(!param.selfData.sum.firm_use_standard && !param.selfData.sum.region_use_standard){
                                    tool.info('厂商规则和区域规则必须选择一个!');
                                    return;
                                } 
                                self.$store.dispatch(examineUpdTimeSetting,param.selfData.sum).then(res=>{
                                    if(res.msg.code!='successed')return;
                                    param.close();
                                    tool.info('定时考核任务设置成功!');
                                })      
                            },
                            cancel(){
                                param.close();
                            },
                            loadDetail(){
                                self.$store.dispatch(examineGetTimeSetting).then(res=>{   //获取定时考核设置
                                    if(res.msg.code!='successed')return;
                                    let newData=res.biz_body;
                                    param.selfData.sum.task_title=newData.task_title;
                                    param.selfData.sum.interval=newData.interval;
                                    param.selfData.sum.firm_task_id=newData.firm_task_id;
                                    param.selfData.sum.region_task_id=newData.region_task_id;
                                    self.$store.dispatch(examineRuleList,{check_target:'firm'}).then(res=>{
                                        if(res.msg.code!='successed')return;
                                        param.selfData.firm=res.biz_body;                                        
                                        self.$nextTick(()=>{
                                            param.selfData.sum.firm_use_standard=newData.firm_use_standard;
                                        });
                                    })
                                    self.$store.dispatch(examineRuleList,{check_target:'region'}).then(res=>{
                                        if(res.msg.code!='successed')return;
                                        param.selfData.region=res.biz_body;
                                        self.$nextTick(()=>{
                                            param.selfData.sum.region_use_standard=newData.region_use_standard;
                                        });
                                    })  
                                }); 
                            }
                        },
                        success(){
                            param.selfData.loadDetail();    
                        },
                    };
                return param;                
            }());     
       },
      // 考核规则列表
      checkRuleList(){
            this.blnShowHistoryPop=false;
            let self=this;
            tool.open(function(){
                let html=`<div name="container" style="width:100%;height:100%;padding: 10px;" >
                            <!--加载中标识-->
                            <div v-if="DeviceblnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;">
                                <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
                            </div>
                            <div class="rule-check-add" @click="addRuleInFun()">
                                <span><i class="fa fa-plus"></i>&nbsp;添加规则
                                </span>
                            </div>
                            <div class="mount-table">
                                <div class="header">
                                    <div class="mount_item" ><span class="overflow" style="width:240px;">规则名称</span></div>
                                    <div class="mount_item" ><span class="overflow" style="width:170px;">规则对象</span></div>
                                    <div class="mount_item" ><span class="overflow" style="width:170px;">创建日期</span></div>
                                    <div class="mount_item" ><span class="overflow" style="width:150px;">操作</span></div>
                                    <div class="mount_item" v-if="deviceData.length>=9"><span class="overflow" style="width:6px;"></span></div>
                                </div>
                                <div class="content" style="height: 393px;overflow-y: auto;">
                                    <div v-if="deviceData.length<=0&&!DeviceblnLoading" class="content">
                                        <div class="mount_item"><span class="overflow" style="width:785px;">暂无数据</span></div>
                                    </div>
                                    <div v-for="(d,i) in deviceData" class="content">
                                        <div class="mount_item" :title="d.standard_title"><span class="overflow" style="width:240px;">{{d.standard_title}}</span></div>
                                        <div class="mount_item" :title="d.check_target_desc"><span class="overflow" style="width:170px;">{{d.check_target_desc}}</div>
                                        <div class="mount_item" :title="d.create_time" ><span class="overflow" style="width:170px;">{{d.create_time}}</span></div>
                                        <div class="mount_item" ><span class="overflow" style="width:150px;">
                                            <span title="查看详情" class="rule-check-icon" @click="detailFun(d)"><i class="fa fa-eye"></i></span>
                                            <span title="删除" class="rule-check-icon" @click="deleteRule(d.standard_id)"><i class="fa fa-close"></i></span>
                                        </span></div>                                   
                                    </div>
                                </div>
                            </div>
                        </div>`;
                let param={
                        title:'考核规则',
                        content:html,
                        skin:'rule-check-list',
                        area:['819px','533px'],
                        components:{Scroll},
                        context:{
                            deviceData:"",
                            DeviceblnLoading:true,   //加载中标识
                            data:[],
                            addRuleInFun(){
                                param.close();
                                self.addcheckRule();                               
                            },
                            //删除考核规则
                            deleteRule(val){
                                self.$store.dispatch(examineDeleteRule,{standard_id:val}).then(res=>{
                                    if(res.msg.code!='successed')return;
                                    tool.info('该考核规则删除成功');
                                     param.selfData.loadDevice(); //删除后刷新列表
                                });
                            },
                            //查看规则详情
                            detailFun(val){
                                param.close();
                                self.addcheckRule(val)
                            },
                            loadDevice(data){
                                self.$store.dispatch(examineRuleList).then(res=>{
                                    if(res.msg.code!='successed')return;
                                    param.selfData.DeviceblnLoading=false;
                                    param.selfData.deviceData= res.biz_body;
                                    for( let ary of param.selfData.deviceData){
                                       ary.create_time=(ary.create_time&&ary.create_time!='0') ? tool.DateByTimestamp(ary.create_time,'yyyy-MM-dd hh:mm:ss'):"无";
                                   };

                                });
                            }
                        },
                        success(){
                            param.selfData.loadDevice();
                        }
                    };

                return param;
            }());                 
      },
      //新增考核规则,查看详情，如果detail有值则是查看详情否则就是新增
      addcheckRule(detail){
            let self=this;
            tool.open(function(){
                let html=`<div name="container" class="container">
                            <div class="row set-check-row">
                                <div class="form-group">
                                    <label class="col-md-2 control-label">规则名称:</label>
                                    <div class="col-md-4">
                                        <el-input v-model="sum.standard_title" placeholder="请输入名称" :disabled=detail></el-input>   
                                    </div>
                                </div>                                                    
                            </div>
                            <div class="row set-check-row">
                                <div class="form-group">
                                    <label class="col-md-2 control-label">考核对象:</label>
                                    <div class="col-md-4">
                                        <el-select v-model="sum.check_target" placeholder="请选择" :disabled=detail>
                                            <el-option v-for="kind in checkObject" :label="kind.name" :value="kind.value"></el-option>
                                        </el-select>
                                    </div>
                                </div>                                                    
                            </div>
                            <div class="row set-check-row">
                                <div class="form-group">
                                    <label class="col-md-2 control-label">考核规则:</label>
                                </div>                                                    
                            </div>
                            <div class="row" style="position:relative;top:-45px">
                                <div class="form-group">
                                  <div class="col-md-9 col-md-offset-2">
                                    <div class="new-cont"> 
                                        <div class="new-title">在离线考核</div>
                                        <div class="new-select">
                                            <el-checkbox v-model="sum.is_check_netbar_off" :disabled=detail>场所离线率</el-checkbox>
                                            <el-checkbox v-model="sum.is_check_netbar_except" :disabled=detail>场所异常率</el-checkbox>
                                            <el-checkbox v-model="sum.is_check_netbar_detects" :disabled=detail>场所贡献率</el-checkbox>
                                        </div>
                                        <div class="new-hidd" @click="changeTypeFun('1')">
                                            <i class="fa fa-caret-up" v-show="changeType=='1'"></i>
                                            <i class="fa fa-caret-down" v-show="changeType!='1'"></i>
                                        </div>
                                        <div class="new-text" v-show="changeType=='1'">                                           
                                            <div class="form-group">
                                                <label class="col-md-5 control-label">场所离线率最大阈值:</label>
                                                <div class="col-md-5 new_input">
                                                    <el-slider v-model="sum.min_netbar_off" :disabled="!sum.is_check_netbar_off||detail"></el-slider>
                                                </div>{{sum.min_netbar_off}}%
                                            </div> 
                                            <div class="form-group">
                                                <label class="col-md-5 control-label">场所异常率最大阈值:</label>
                                                <div class="col-md-5 new_input">
                                                    <el-slider v-model="sum.min_netbar_except" :disabled="!sum.is_check_netbar_except||detail"></el-slider>
                                                </div>{{sum.min_netbar_except}}%
                                            </div> 
                                            <div class="form-group">
                                                <label class="col-md-5 control-label">场所贡献率最小阈值:</label>
                                                <div class="col-md-5 new_input">
                                                    <el-slider v-model="sum.min_netbar_detects" :disabled="!sum.is_check_netbar_detects||detail"></el-slider>
                                                </div>{{sum.min_netbar_detects}}%
                                            </div> 
                                        </div>                                         
                                    </div>
                                    <div class="new-cont"> 
                                        <div class="new-title">数据采集考核</div>
                                        <div class="new-select">
                                           
                                            <el-checkbox v-model="sum.is_check_realname" :disabled=detail @change="defalutFun('realname')">实名采集</el-checkbox>
                                            <el-checkbox v-model="sum.is_check_virtual" :disabled=detail @change="defalutFun('virtual')">虚拟身份</el-checkbox>
                                            <el-checkbox v-model="sum.is_check_hardware" :disabled=detail @change="defalutFun('hardware')">硬件特征</el-checkbox>
                                        </div>
                                        <div class="new-hidd" @click="changeTypeFun('2')">
                                             <i class="fa fa-caret-up" v-show="changeType=='2'"></i>
                                             <i class="fa fa-caret-down" v-show="changeType!='2'"></i>                                       
                                        </div>
                                        <div class="new-text" v-show="changeType=='2'">                                           
                                            <div class="form-group" style="height:20px">
                                                <label class="col-md-2 control-label" style="padding:0;position: relative;top: -7px;">实名采集:</label>
                                                <div class="col-md-10 new_input new-flex">
                                                    <el-checkbox v-model="sum.is_check_realidentity" :disabled="!sum.is_check_realname||detail">真实身份</el-checkbox>
                                                    <el-checkbox v-model="sum.is_check_mobile" :disabled="!sum.is_check_realname||detail">手机号</el-checkbox>
                                                    <el-checkbox v-model="sum.is_check_realname" disabled>总量</el-checkbox>
                                                </div>
                                            </div> 
                                            <div class="form-group" style="height:20px">
                                                <label class="col-md-2 control-label" style="padding:0;position: relative;top: -7px;">虚拟身份:</label>
                                                <div class="col-md-10 new_input new-flex">
                                                    <el-checkbox v-model="sum.is_check_qq" :disabled="!sum.is_check_virtual||detail">QQ</el-checkbox>
                                                    <el-checkbox v-model="sum.is_check_wechat" :disabled="!sum.is_check_virtual||detail">微信</el-checkbox>
                                                    <el-checkbox v-model="sum.is_check_taobao" :disabled="!sum.is_check_virtual||detail">淘宝</el-checkbox>
                                                    <el-checkbox v-model="sum.is_check_virtual" disabled>虚拟身份种类</el-checkbox>
                                                    <el-checkbox v-model="sum.is_check_virtual" disabled>总量</el-checkbox>
                                                </div>
                                            </div> 
                                            <div class="form-group" style="height:20px">
                                                <label class="col-md-2 control-label" style="padding:0;position: relative;top: -7px;">硬件特征:</label>
                                                <div class="col-md-10 new_input new-flex">
                                                    <el-checkbox v-model="sum.is_check_mac" :disabled="!sum.is_check_hardware||detail">MAC</el-checkbox>
                                                    <el-checkbox v-model="sum.is_check_imsi" :disabled="!sum.is_check_hardware||detail">IMSI</el-checkbox>
                                                    <el-checkbox v-model="sum.is_check_imei" :disabled="!sum.is_check_hardware||detail">IMEI</el-checkbox>
                                                    <el-checkbox v-model="sum.is_check_hardware" disabled>总量</el-checkbox>
                                                </div>
                                            </div> 
                                        </div>                                        
                                    </div>
                                    <div class="new-cont" v-show="sum.check_target=='firm'"> 
                                        <div class="new-title">数据传输质量考核</div>
                                        <div class="new-select">
                                            <el-checkbox v-model="sum.is_check_datareport" :disabled=detail>上报率</el-checkbox>
                                            <el-checkbox v-model="sum.is_check_datavalid" :disabled=detail>有效率</el-checkbox>
                                        </div>
                                        <div class="new-hidd" @click="changeTypeFun('3')">
                                            <i class="fa fa-caret-up" v-show="changeType=='3'"></i>
                                            <i class="fa fa-caret-down" v-show="changeType!='3'"></i>   
                                        </div>
                                        <div class="new-text" v-show="changeType=='3'">                                           
                                            <div class="form-group">
                                                <label class="col-md-5 control-label">厂商上报率最小阈值:</label>
                                                <div class="col-md-5 new_input">
                                                    <el-slider v-model="sum.min_data_report" :disabled="!sum.is_check_datareport||detail"></el-slider>
                                                </div>{{sum.min_data_report}}%
                                            </div> 
                                            <div class="form-group">
                                                <label class="col-md-5 control-label">厂商有效率最小阈值:</label>
                                                <div class="col-md-5 new_input">
                                                    <el-slider v-model="sum.min_data_valid" :disabled="!sum.is_check_datavalid||detail"></el-slider>
                                                </div>{{sum.min_data_valid}}%
                                            </div> 
                                        </div>                                         
                                    </div>                                    
                                  </div>
                                </div>                                                    
                            </div>                                                  
                            <div style="position: absolute;bottom: 15px;right: 71px;">
                                <button type="button" class="btn btn-success" style="font-size:12px;"  @click="submit" v-show="!detail">确定</button> 
                                <button type="button" class="btn btn-default" style="font-size:12px;" @click="cancel">返回</button>
                            </div>                   
                        </div>`
                let param={
                        title:!detail?"新增考核规则":"查看规则详情",
                        content:html,
                        
                        skin:'new-check-rule',
                        area:['750px','610px'],
                        context:{
                            changeType:"1",
                            detail:detail? true:false,
                            sum:{
                                standard_title: '',
                                check_target:'firm',// 规则适用对象，firm、region定义：examine_target  默认选择厂商
                                is_check_netbar_off: '',// 0未勾选，1勾选   是否考核场所离线率
                                min_netbar_off: null,// 最低离线率，0-100的数字
                                is_check_netbar_except: '',// 0未勾选，1勾选   是否考核场所异常率
                                min_netbar_except: null,// 最低异常率，0-100的数字
                                is_check_netbar_detects: '',// 0未勾选，1勾选   是否考核场所贡献量
                                min_netbar_detects: null,// 最低贡献率，0-100的数字
                                is_check_realname: '',// 0未勾选，1勾选   是否考核实名采集
                                is_check_realidentity: '',// 0未勾选，1勾选   是否考核真实身份采集
                                is_check_mobile: '',// 0未勾选，1勾选   是否考核手机号采集
                                is_check_virtual: '',// 0未勾选，1勾选   是否考核虚拟身份采集
                                is_check_qq: '',// 0未勾选，1勾选   是否考核qq号采集
                                is_check_wechat: '',// 0未勾选，1勾选   是否考核微信采集
                                is_check_taobao: '',// 0未勾选，1勾选   是否考核淘宝采集
                                is_check_hardware: '',// 0未勾选，1勾选   是否考核硬件特征
                                is_check_mac: '',// 0未勾选，1勾选   是否考核mac采集
                                is_check_imsi: '',// 0未勾选，1勾选   是否考核imsi采集
                                is_check_imei: '',// 0未勾选，1勾选   是否考核imei采集
                                is_check_datareport: '',// 0未勾选，1勾选   是否考核数据上报率
                                min_data_report: null,// 最低上报率，0-100的数字
                                is_check_datavalid:"",   // 0未勾选，1勾选   是否考核数据有效率
                                min_data_valid: null,// 最低有效率，0-100的数字
                            },
                            site:{
                                abnormal:"",
                                offLine:"",
                                contribute:""
                            },
                            checkObject:[{name:'厂商',value:"firm"},{name:'区域',value:"region"}],
                            changeTypeFun(val){        
                                if(param.selfData.changeType==val){
                                   param.selfData.changeType='0';
                                }else{
                                   param.selfData.changeType=val;
                                }                                               
                            },
                            // 默认勾选问题
                            defalutFun(val){
                                switch(val){
                                    case "realname":
                                        if(param.selfData.sum.is_check_realname){
                                            param.selfData.sum.is_check_realidentity=true;
                                            param.selfData.sum.is_check_mobile=true;
                                        }
                                        break;
                                    case "virtual":
                                        if(param.selfData.sum.is_check_virtual){
                                            param.selfData.sum.is_check_qq=true;
                                            param.selfData.sum.is_check_wechat=true;
                                        }
                                        break;
                                    case "hardware":
                                        if(param.selfData.sum.is_check_hardware){
                                            param.selfData.sum.is_check_mac=true;
                                            param.selfData.sum.is_check_imsi=true;
                                        }
                                        break;                                                                                
                                }
                            },
                            submit(){
                                if(!param.selfData.sum.standard_title || !param.selfData.sum.check_target){
                                    tool.info('规则名称，考核对象必填!');
                                    return;
                                }
                                // 将数据类型转换(后台接受的是0和1的形式，这边传递的是true和false)
                                for(let key in param.selfData.sum){
                                    if(key=="min_netbar_off"||key=="min_netbar_except"||key=="min_netbar_detects"||key=="min_data_report"||key=="min_data_valid"||key=="standard_title"||key=="check_target"){
                                        continue;
                                    }
                                    if(param.selfData.sum[key]){
                                        param.selfData.sum[key]="1";
                                    }else{
                                        param.selfData.sum[key]="0";
                                    }
                                }
                                self.$store.dispatch(examineRuleAdd,param.selfData.sum).then(res=>{
                                    if(res.msg.code!='successed')return;
                                    param.close();  
                                    tool.info('考核规则新增成功!');
                                    self.checkRuleList()
                                })  
                                param.close();
                            },
                            cancel(){                                
                                self.checkRuleList();
                                param.close();
                            },
                            // 加载详情
                            loadDetail(){
                                param.selfData.sum={
                                    standard_title: detail.standard_title,
                                    check_target:detail.check_target_desc=="厂商"?"firm":"region",
                                    is_check_netbar_off: detail.is_check_netbar_off=="1"?true:false,
                                    min_netbar_off: parseInt(detail.min_netbar_off),
                                    is_check_netbar_except: detail.is_check_netbar_except=="1"?true:false,
                                    min_netbar_except: parseInt(detail.min_netbar_except),
                                    is_check_netbar_detects: detail.is_check_netbar_detects=="1"?true:false,
                                    min_netbar_detects: parseInt(detail.min_netbar_detects),
                                    is_check_realname: detail.is_check_realname=="1"?true:false,
                                    is_check_realidentity: detail.is_check_realidentity=="1"?true:false,
                                    is_check_mobile: detail.is_check_mobile=="1"?true:false,
                                    is_check_virtual: detail.is_check_virtual=="1"?true:false,
                                    is_check_qq: detail.is_check_qq=="1"?true:false,
                                    is_check_wechat: detail.is_check_wechat=="1"?true:false,
                                    is_check_taobao: detail.is_check_taobao=="1"?true:false,
                                    is_check_hardware: detail.is_check_hardware=="1"?true:false,
                                    is_check_mac: detail.is_check_mac=="1"?true:false,
                                    is_check_imsi: detail.is_check_imsi=="1"?true:false,
                                    is_check_imei: detail.is_check_imei=="1"?true:false,
                                    is_check_datareport: detail.is_check_datareport=="1"?true:false,
                                    min_data_report: parseInt(detail.min_data_report),
                                    is_check_datavalid:detail.is_check_datavalid=="1"?true:false,
                                    min_data_valid: parseInt(detail.min_data_valid),
                                };                               
                            }
                        },
                        success(){
                            if(detail){
                                param.selfData.loadDetail();
                            }
                        }
                    };
                return param;                
            }());     
      }

  }
}
</script>
<style lang="less">
    @import "../css/variables.less";
    //基础数据标签样式
    .BasePage .tag .number{font-size:30px;}
    .BasePage .tag .bar{
        position: absolute;bottom:0px;width:100%;height:30px;background-color:@HeaderBgCol;color:white;line-height:30px;padding-left:10px;
        border-bottom-left-radius: 5px;
    }
  
    .BasePage .tag:hover .number .info{
        display:inline-block;
        -webkit-animation: toBottomFromTop 0.5s forwards;
        -moz-animation: toBottomFromTop 0.5s forwards;
        animation: toBottomFromTop 0.5s forwards;
    }

    @transW:100px;

    @-webkit-keyframes toRightFromLeft {
            49% {
                -webkit-transform: translate(@transW);
            }
            50% {
                opacity: 0;
                -webkit-transform: translate(-@transW);
            }
            51% {
                opacity: 1;
            }
        }
    @-moz-keyframes toRightFromLeft {
        49% {
            -moz-transform: translate(@transW);
        }
        50% {
            opacity: 0;
            -moz-transform: translate(-@transW);
        }
        51% {
            opacity: 1;
        }
    }
    @keyframes toRightFromLeft {
        49% {
            transform: translate(@transW);
        }
        50% {
            opacity: 0;
            transform: translate(-@transW);
        }
        51% {
            opacity: 1;
        }
    }   
    @-webkit-keyframes toBottomFromTop {
            49% {
                -webkit-transform: translateY(100%);
            }
            50% {
                opacity: 0;
                -webkit-transform: translateY(-100%);
            }
            51% {
                opacity: 1;
            }
        }
    @-moz-keyframes toBottomFromTop {
        49% {
            -moz-transform: translateY(100%);
        }
        50% {
            opacity: 0;
            -moz-transform: translateY(-100%);
        }
        51% {
            opacity: 1;
        }
    }
    @keyframes toBottomFromTop {
        49% {
            transform: translateY(100%);
        }
        50% {
            opacity: 0;
            transform: translateY(-100%);
        }
        51% {
            opacity: 1;
        }
    }   
    //考核管理配置样式
    .check-manage .container{
        position:relative;
        width: 100%;
        height: 100%;
        padding: 10px
    }
    .check-manage .container .item_set{
        display: inline-block;
        float: right;
        margin-right: 29px;
        font-size: 14px;
        cursor: pointer;
    }
    .check-manage .container .item_set:hover{
        color:rgb(44, 2, 2);
    }
    .check-manage .check-detail-row{
        display:inline-block;
        height: 64%;
        width: 49%;
    }
    .check-manage .check-detail-row .item_label_left{
        position: relative;
        cursor:pointer;
        color:#444;
        margin: 20px 30px;
        height: 100%;
        border: 1px solid #999;
        text-align:center;
    }
    .check-manage .check-detail-row .item_label_left .iden_container{
        //background-image: linear-gradient(45deg, transparent 50%, #007acc 50%),linear-gradient(45deg, transparent 49%, #007acc 10%);
        position: absolute;
        top: 0px;
        right: 0px;
        width: 50px;
        height: 50px;
    }
    html{.TCol(~".check-manage .check-detail-row .item_label_left .iden_container.active",'lineLoopgen',45deg,transparent,50%,@Font_Hover_Col,50%,45deg,transparent,49%,@Font_Hover_Col,10%);}
    
    .check-manage .check-detail-row .item_label_left .iden_container i{
        position: absolute;
        font-size:22px;
        right: 5px;
        top: 4px;
        color: white;
    }
    .check-manage .check-detail-row .img-t{
        font-size:100px;
    }
    .check-manage .check-detail-row .detail-title{
        font-size:16px;       
    }  
    .check-manage .check-detail-row .item_label_left:hover{
       color:#fff;
    }
    .check-manage .check-button{
        position: absolute;
        bottom: 21px;
        right: 48px;
    }
    html{.TCol(~".check-manage .check-detail-row .item_label_left:hover",'bg');}    
    // 新增考核与定时考核
    .set-check-manage .container{
        width:100%;height:100%;padding: 20px;
    }
    .set-check-manage .container .set-check-row{
        height:50px;
    }   
    .set-check-manage .container .set-check-row .control-label{
        line-height:36px;text-align:right
    } 
    html{.TCol(~".set-check-manage .container .btn-success",'bg');}    
    .set-check-manage .container .set-check-row .el-date-editor{
        width: 167px;
    }

    /*考核规则列表*/
    .rule-check-list .layui-layer-title{
        background-color: #03ab67;
        font-weight: 700;
        color:#fff;
    }
    .rule-check-list .mount-table .header div{
        display: inline-block;
    }
    .rule-check-list .mount-table .header{
        display: table-row;
    }
    .rule-check-list .mount-table .header .mount_item{
        display: table-cell;
        font-weight: bolder;
        text-align: center;
        background-color: #E5E5E5;
        line-height: 30px;
        padding: 5px 5px;
        border: 1px solid #C9C9C9;
    }
    .rule-check-list .mount-table .header .mount_item .overflow{
        display: block;
    }
    .rule-check-list .mount-table .content .mount_item{
        display: table-cell;
        font-weight: normal;
        text-align: center;
        line-height: 30px;
        padding: 5px;
        border: 1px solid #C9C9C9;

    }
    .rule-check-list .red{color:red}
    .rule-check-list .green{color:green}
    .rule-check-list .mount-table .content .mount_item .overflow{
        width:100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        display: block;
    }
    .rule-check-list .rule-check-add{
        line-height: 30px;
        text-align: right;
        margin-right: 30px;
        font-size: 16px;
    }
    .rule-check-list .rule-check-add span:hover{
        cursor:pointer;
        color:#555;
    } 
    .rule-check-list .rule-check-icon{
        width: 30px;
        display: inline-block;
        font-size: 15px;
        cursor: pointer;
    }

    /*厂商数据项设置列表*/

    .firm-check-list .mount-table .header div{
        display: inline-block;
    }
    .firm-check-list .mount-table .header{
        display: table-row;
    }
    .firm-check-list .mount-table .header .mount_item{
        display: table-cell;
        font-weight: bolder;
        text-align: center;
        //background-color: #E5E5E5;
        //line-height: 55px;
       // height: 55px;
        border: 1px solid #C9C9C9;
    }
    .firm-check-list .mount-table .header .mount_item .overflow{
        display: block;
    }
    .firm-check-list .mount-table .header .mount_ital{
        border: 1px solid #C9C9C9;
        height: 56px;
    }
    .firm-check-list .mount-table .header .mount_ital .mount_nule{
        height: 27px;
        width: 100%;
        text-align: center;
        font-weight: bolder;
       // border-bottom: 1px solid #c9c9c9;
    }
    .firm-check-list .mount-table .content .mount_item{
        display: table-cell;
        font-weight: normal;
        text-align: center;
        line-height: 45px;
        border: 1px solid #C9C9C9;

    }
    .firm-check-list .mount-table .content .mount_item .overflow{
        width:100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        display: block;
    }


    // 新增考核规则
    .new-check-rule .container{
        width:100%;height:100%;padding-top: 20px;
    }
    .new-check-rule .container .set-check-row{
        height:50px;
    }   
    .new-check-rule .container .set-check-row .control-label{
        line-height:36px;text-align:right
    } 
    .new-check-rule .new-cont{
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-bottom: 10px;
    }
    .new-check-rule .new-title{
        text-align: center;
        line-height: 26px;
        color:#fff;
        font-size:14px;
        font-weight:bold;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }
    html{.TCol(~".new-check-rule .new-title",'bg');}    
    .new-check-rule .new-select{
        display:flex;
        line-height: 31px;
        border-bottom: 1px solid #ccc;
    }
    .new-check-rule .new-select .el-checkbox{
        flex:1;
        text-align:center;
    }
    .new-check-rule .new-hidd{
        text-align: center;
        cursor: pointer;
        font-size: 16px;
        color:#666;
    }
    .new-check-rule .new-cont .new-text{
      //  display:none;
    }
    .new-check-rule .new-cont .new-text .control-label{
        text-align: right;  
        font-weight: normal;
        font-size: 16px;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Chrome/Safari/Opera */
        -khtml-user-select: none; /* Konqueror */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently*/
    }
    .new-check-rule .new-cont .new-text .new_input{
        position: relative;
        top: -4px;
    }
    .new-check-rule .new-cont .new-text input[type=text]{
        height: 28px;
    }

    .new-check-rule .new-cont .new-text .new-flex{
       display: flex;
       justify-content:space-around;
       padding-right:40px;
    }
    .new-check-rule .new-cont .new-text .new-flex .el-checkbox{
        flex:1;
    }
    .new-check-rule .new-cont .new-text .new-flex .el-checkbox:last-child{
        text-align:right;
    }
</style>

<style scoped lang="less">
  @import "../css/variables.less";
  @titleH:40px;
  @tagH:120px;
  .BasePage{width:100%;height:100%;padding:5px;}
  .BasePage .base_conatiner{background-color:@FrontCol;height:100%;position:relative;}
  .BasePage .header{height:@titleH;line-height:@titleH;text-align:left;padding:0px 10px;.border('bottom');}
  .BasePage .tag{
      display:inline-block;height:@tagH;width:~"calc(24.6% - 10px)";text-align: left;margin-right:15px;margin-bottom:10px;position:relative;
      //background-color:@btn_Bg_Col_hover_5;
      color:white;
      -moz-box-shadow: 2px 2px 1px #333333;
      -webkit-box-shadow: 2px 2px 1px #333333;
      box-shadow: 2px 2px 1px #333333;
      border-radius:5px;
   }
  html{.TCol(~".BasePage .tag",'bg');}   
  .BasePage .tag:nth-child(4n){margin-right:0px;}
  .BasePage .tagComp{
    height: 100%;
    width: 100%;
    padding: 2px 0px;
    text-align: left;
  }
  .BasePage .tagComp .item{
    display: inline-block;
    height: 100%;
    min-width: 50px;
    text-align: center;
    margin: 0px 5px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.35, 0.52, 0.33, 0.98) 0s;
  }
  .BasePage .tagComp .item.active{
  //  background-color: #03ab67;
    color: white;
    border-radius: 5px;
  }
  .BasePage .tagComp .item:hover{
    //background-color: #03ab67;
    color: white;
    border-radius: 5px;
  }
  .BasePage .tagComp .item .item_containner{
    display: table;
    height: 100%;
    width: 100%;
    padding: 0px 10px;
  }
  .BasePage .tagComp .item .item_container .content{
    display: table-cell;
    vertical-align: middle;
    padding: 5px 10px;
  }
  .BasePage .tagComp .item .item_container .content i{
    margin-right: 5px;
  }  
  html{.TCol(~".BasePage .tagComp .item.active",'bg');}
  html{.TCol(~".BasePage .tagComp .item:hover",'bg');}




  .BasePage .base_container{padding:10px;}
  .tag_label:hover{color:@btn_Bg_Col_hover_1;}
  //图表显示区域样式
  .BasePage .chart_container{height:~"calc(100% - @{titleH} - 360px)";width:100%;}

  .filter_container .optionBar,
  .header .optionBar{float:right;}
  .filter_container .optionBar .item,
  .header .optionBar .item{width:auto;margin-right:10px;}
  .filter_container .optionBar .item:hover,
  .header .optionBar .item:hover{cursor:pointer;}
  html{.TCol(~".header .optionBar .item:hover");}

  .filter_container .optionBar .item.active,
  //.header .optionBar .item.active{color:@Font_Hover_Col;}
  html{.TCol(~".header .optionBar .item.active");}

  .count_item{display:inline-block;width:33%;margin-right:.5%;height:46.75%;margin-bottom:.5%;}
  .count_item:nth-child(6),
  .count_item:nth-child(5),
  .count_item:nth-child(4){margin-bottom:0px;}

  .count_item:nth-child(6), 
  .count_item:nth-child(3){margin-right:0px;}

  .BasePage .filter_container{position:absolute;right:0px;left:330px;height:40px;padding-right:10px;z-index:1000;}
  .BasePage .filter_container .detail_filter{width:100%;height:100%;text-align:left;}


  @tableHeaderH:80px;
  @column_1_W:150px;
  .BasePage .base_table_header{width:100%;height:@tableHeaderH;.border("");color:rgb(114, 132, 153);}
  .BasePage .base_table_header .column_1{float:left;width:@column_1_W;height:@tableHeaderH - 1;.border('right');text-align:center;line-height:@tableHeaderH;}
  .BasePage .base_table_header .column_2{margin-left:@column_1_W;margin-right:0px;height:@tableHeaderH;}
  .BasePage .base_table_header .column_2 .row_1{height:@tableHeaderH/2;width:100%;.border('bottom');}

  .BasePage .base_table_header .column_2 .row_2 .item,
  .BasePage .base_table_header .column_2 .row_1 .item{display:inline-block;height:@tableHeaderH/2;width:50%;text-align:center;line-height:@tableHeaderH/2;}
  .BasePage .base_table_header .column_2 .row_2 .item:first-child,
  .BasePage .base_table_header .column_2 .row_1 .item:first-child{.border('right');}

  .BasePage .base_table_header .column_2 .row_2{height:@tableHeaderH/2;width:100%;}

  .BasePage .base_table_header .column_2 .row_2 .item .sep{float:left;width:25%;}
  .BasePage .base_table_header .column_2 .row_2 .item .sep{.border('right');}
  .BasePage .base_table_header .column_2 .row_2 .item .sep:last-child{border-right:none;}

  .BasePage .base_count_item{width:100%;height:@tableHeaderH/2;.border('bottom');.border('left');.border('right');}
  .BasePage .base_count_item .column_1{float:left;width:@column_1_W;height:@tableHeaderH/2;.border('right');text-align:center;line-height:@tableHeaderH/2;overflow:hidden;}
  .BasePage .base_count_item .column_2{margin-left:@column_1_W;margin-right:0px;height:@tableHeaderH/2;}
  .BasePage .base_count_item .column_2 .item{display:inline-block;height:@tableHeaderH/2;width:50%;text-align:center;line-height:@tableHeaderH/2;}
  .BasePage .base_count_item .column_2 .item:first-child{.border('right');}
  .BasePage .base_count_item .column_2 .item .sep{float:left;width:25%;height:100%;}
  .BasePage .base_count_item .column_2 .item .sep{.border('right');}
  .BasePage .base_count_item .column_2 .item .sep:last-child{border-right:none;}  


  .BasePage .base_table_content{width:100%;height:~'calc(100% - @{tableHeaderH} - @{tableHeaderH}/2)';}



    //左边侧边框
  @bgColor:fade(@HeaderBgCol,90%);
  @popW:300px;
  .BasePage .left_pop{
    position:absolute;left:-305px;top:14px;bottom:10px;z-index:100;width:@popW;background-color:@bgColor !important;
    border-top-right-radius:5px;border-bottom-right-radius:5px;color:white;text-align:left;
  }

  .BasePage .left_pop.active{left:0px;}

  .BasePage .left_pop .pop_lable{
    width:30px;position:absolute;top:50%;margin-top:-40px;
    background-color:@bgColor;color:white;
    font-size:12px;padding:10px 8px;border-top-right-radius:5px;border-bottom-right-radius:5px;
    right:-30px;
    cursor:pointer;.trans();
  }
 .BasePage .left_pop .pop_top{
    line-height: 40px;
    border-bottom: 1px solid #fff;
  }
  .BasePage .left_pop .pop_top .content{
    display:inline-block;
    width:49%;
    height: 100%;
    font-size:16px;
    text-align:center;
    cursor: pointer;
  }
  .BasePage .left_pop .his_icon{
    display: inline-block;
    margin-right: 10px;
    font-size: 16px;
  }
   .BasePage .left_pop .his_icon:hover{
       color:#ccc;
   }

  html{.TCol(~".BasePage .left_pop .pop_top .content:hover",'bg');}
  //.BasePage .left_pop .pop_lable:hover{background-color:@Font_Hover_Col;}
  html{.TCol(~".BasePage .left_pop .pop_lable:hover",'bg');}

  .BasePage .left_pop .item{font-size:12px;padding:10px 10px 5px 10px;.trans();.border('bottom');}
  .BasePage .left_pop .item:hover{cursor:pointer;}
  html{.TCol(~".BasePage .left_pop .item:hover",'bg');}

  .BasePage .left_pop .item .child{margin-bottom:10px;}
  .BasePage .left_pop .item .item_type{
    padding:2px 8px;position:relative;display:inline-block;
  }

  .BasePage .left_pop .item.active .bottom_right:before,
  .BasePage .left_pop .item.active .bottom_right:after,
  .BasePage .left_pop .item.active .top_left:after,
  .BasePage .left_pop .item.active .top_left:before,
  .BasePage .left_pop .item:hover .bottom_right:before,
  .BasePage .left_pop .item:hover .bottom_right:after,
  .BasePage .left_pop .item:hover .top_left:after,
  .BasePage .left_pop .item:hover .top_left:before{background:@bgColor;}

  @delBtnSize:20px;
  @rowH:40px;
  .BasePage .left_pop .delBtn{
      cursor:pointer;
      margin-right:10px;font-size:10px;width:@delBtnSize;height:@delBtnSize;line-height:@delBtnSize;float:right;border-radius:5px;background-color:#20a1ff;text-align:center;font-size:12px;
    }
  .BasePage .left_pop .delBtn:hover{background-color:#ff7733;}
  .BasePage .sta_check .list_cont .option div{
      display:inline-block;
      float:left;
      line-height:36px;
      margin-left:40px;
      font-size:14px;
  }
  .BasePage .sta_check .no-data{
      line-height: 600px;
      font-size: 38px;
      color: #999;
  }
    html{.TCol(~".BasePage .sta_check .list_cont .option .down:hover",'color');}
  .BasePage .sta_check .list_cont .header{width: 100% !important;list-style: none;padding-left: 0px;padding: 0px;margin-bottom:0px;display:table;}
  .BasePage .sta_check .list_cont .header .item{line-height: @rowH;height: @rowH;text-align: left;margin: 0px;display: table-row;width: 100%;color: white;}
  html{.TCol(~".BasePage .sta_check .list_cont .header .item",'bg');}
  .BasePage .sta_check .list_cont .body{width: 100% !important;list-style: none;padding-left: 0px;padding: 0px;margin-bottom:0px;display:table;}
  .BasePage .sta_check .list_cont .body .item{line-height: @rowH;height: @rowH;text-align: left;margin: 0px;display: table-row;width: 100%;color: white;}
  .BasePage .sta_check .list_cont .body .item{background-color:white;color:@HeaderBgCol;}
  .BasePage .sta_check .list_cont .body .item > div{display: table-cell;.border('bottom');.border('right');padding: 0px 0px 0px 0px;vertical-align: middle;text-align:center;}
  .BasePage .sta_check .list_cont .body .item .option .overflow > span{border:none;font-size:12px;display: initial;margin-right:5px;}
  .BasePage .sta_check .list_cont .body .item .option .overflow > span:hover{cursor:pointer;}
  .BasePage .sta_check .list_cont .body .item .sep{border-right:2px solid @FontCol;}
  .BasePage .sta_check .list_cont .body .item .count_item{width:80px;}
  html{.TCol(~".firmpage .body .item .option .overflow > span:hover");}
  .BasePage .sta_check .list_cont .item .overflow{margin:0 auto;}
  .BasePage .sta_check .list_cont .body .item .align .overflow{text-align:left}
  .BasePage .sta_check .list_cont .body .item .overflow.sit-click,.BasePage .sta_check .list_cont .body .item .overflow .sit-click{
      color:#03ab67;
      font-weight:bolder;
  }
.BasePage .sta_check .list_cont .body .item .overflow.sit-click:hover,.BasePage .sta_check .list_cont .body .item .overflow .sit-click:hover{
      cursor:pointer;
      text-decoration:underline;
  }

 
  .BasePage .sta_check .list_cont .item > div,.BasePage .sta_check .list_cont .header .item > div{
    display: table-cell;
    border-bottom: 1px solid #e7eaec;
    border-right: 1px solid #e7eaec;
    padding: 0px 0px 0px 0px;
    vertical-align: middle;
    text-align: center;
  }
  .BasePage .sta_check .list_cont .header .item .overflow{
      margin:0 auto;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      display: block;
  }
 .BasePage .sta_check .list_cont .header .item .inline-fatg{
     display:inline-block;
     float:left;
     height:100%;
     flex: 1;   
     border-right: 1px solid #fff;
 }
  .BasePage .sta_check .list_cont .header .item .inline_overflow{
      margin:0 auto;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      display: inline-block;
  } 

   .BasePage .sta_check .list_cont .header .item .inline-fatg.last{
     border-right: 1px solid transparent;
  } 
  .BasePage .sta_check .list_cont .item .align .overflow{text-align:left}
  .BasePage .sta_check .list_cont .item .overflow.sit-click{
      color:#03ab67;
      font-weight:bolder;
  }
  .BasePage .sta_check .list_cont .item .overflow.sit-click:hover{
      cursor:pointer;
      text-decoration:underline;
  }
  .BasePage .sta_check .list_cont .page_container{
        border-top: 1px solid #e7eaec;
        border-bottom: 1px solid #e7eaec;
        background-color: white;
        position: absolute;
        bottom: 2px;
  }
</style>
