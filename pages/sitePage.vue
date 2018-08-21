<!-- 场所管理定制页面组件 created by Chuanjiang Li 2018/04/09-->
<template>
    <div class="stiepage">
        <div class="CaseManage_container">
            <!--加载中标识-->
            <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;">
                <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;"><i class="fa fa-spinner fa-pulse"></i></div></div>
            </div>
            <!-- 标签切换 导航-->
            <div style="height:30px" name="tagcomp">
              <div class="tagComp" style="text-align:left">                
                <div class="item" @click="switchView('statistics')" :class="{active: viewTable=='statistics'}">
                    <div class="item_container">
                        <span class="content"><i class="fa fa-gear"></i>分析</span>
                    </div>
                </div>
                <div class="item" @click="switchView('map')" :class="{active: viewTable=='map'}">
                    <div class="item_container">
                        <span class="content"><i class="fa fa-map-marker"></i>地图</span>
                    </div>
                </div>
                <div class="item" @click="switchView('list')" :class="{active: viewTable=='list'}">
                    <div class="item_container">
                        <span class="content"><i class="fa fa-list"></i>列表</span>
                    </div>
                </div>
              </div>
            </div>
            <!--列表显示区域-->
            <div v-show="viewTable=='list'" style="height: calc(100% - 50px - -63px - 40px);position:relative">
                <div class="option clearfix" name="listOption" >
                    <div class="item">
                        <span>数据来源:</span>
                        <div class="input">
                            <el-select v-model="query.microprobe_type" placeholder="数据来源" :multiple="true" :collapse-tags="true">
                                <el-option v-for="kind in dict_tables.microprobe_type" :label="kind.name" :value="kind.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="item">
                        <span>场所范围:</span>
                        <div class="input" style="width:224px">
                            <PlaceSearch :blnLike="true" :blnClear="true" c_searchKind="1" @place_res="selectSite"></PlaceSearch>
                        </div>
                    </div>
                    <div class="item">
                        <span>区域范围:</span>
                        <div class="input" style="width:224px">
                            <PlaceSearch  :blnClear="true" c_searchKind="0" @place_res="selectArea"></PlaceSearch>
                        </div>
                    </div>
                    <div class="item">
                        <span>场所类型:</span>
                        <div class="input">
                            <el-select v-model="query.netsite_type" :clearable="true" placeholder="场所类型" >
                                <el-option v-for="kind in dict_tables.netsite_type" :label="kind.name" :value="kind.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="item">
                        <span>场所状态:</span>
                        <div class="input" style="width:106px">
                            <el-select v-model="query.netsite_state" :clearable="true" placeholder="场所状态" >
                                <el-option v-for="kind in dict_tables.device_state" :label="kind.name" :value="kind.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="item" style="font-size:12px;font-weight:normal;text-align:left">
                        <span>厂商范围：</span>
                        <div class="input" style="width:150px;display:inline-block;">
                            <MulDropDwon :data="siteIndfirms" keyProp="name" id="code" placeholder="请选择厂商">
                                <div v-for="t in firms" @mousedown="firmClick('listInd',t)">{{t.name}} <i v-if="isHasSelItem(siteIndfirms,t.code)" class="fa fa-check" style="float:right;margin-top: 10px;"></i></div>
                            </MulDropDwon>
                        </div>
                    </div> 
                    <div class="item" >
                        <el-button type="primary" @click="query_click()"><i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i><span v-show="!blnSearch">搜索</span></el-button>
                    </div>

                    <div class="item" style="float:right;">
                        <div class="exportSel" :class="{active:blnExport}" @click="blnExport=!blnExport"><i class="fa fa-check-square" style="margin-right:5px;" />选择</div>
                    </div>
                </div>
                <ul class="header">
                    <li class="item">
                        <div class="column cursor" @click="selAll()" v-if="blnExport" style="width:50px;"><span class="overflow" style="width:50px;"><i :class="{'fa fa-check-square-o':blnAllSel,'fa fa-square-o':!blnAllSel}"></i></span></div>
                        <div><span class="overflow" style="width:120px;">场所编码</span></div>
                        <div><span class="overflow" style="width:100px;">场所名称</span></div>
                        <div><span class="overflow" style="width:230px;">场所地址</span></div>
                        <div><span class="overflow" style="width:65px;">场所状态</span></div>
                        <div><span class="overflow" style="width:80px;">场所概况&nbsp;
                            <el-tooltip>
                            <div slot="content" style="line-height:20px">网吧终端概况：<br/>&nbsp;&nbsp;&nbsp;&nbsp;申报终端/检测终端/在线终端<br/>挂载设备概况：<br/>&nbsp;&nbsp;&nbsp;&nbsp;在线/离线/异常</div>
                            <i class="fa fa-question-circle" style="cursor:pointer"></i>
                            </el-tooltip>                            
                        </div>
                        <div><span class="overflow" style="width:90px;">最近联系时间</span></div>
                        <div><span class="overflow" style="width:72px;">昨日采集</span></div>
                        <div><span class="overflow" style="width:65px;">营业状态</span></div>
                        <div><span class="overflow" style="width:200px;">场所类型</span></div>
                        <div><span class="overflow" style="width:60px;">所属区域</span></div>
                        <div><span class="overflow" style="width:60px;">数据来源</span></div>
                        <div><span class="overflow" style="width:80px;">所属厂商</span></div>
                    </li>
                </ul>
                <div class="content" :style="{height:listBodyH}" :class="{'tete': query.microprobe_type.length>2}">
                    <Scroll :listen="data" ref="indList">
                        <ul class="body">
                            <li class="item" style="text-align:center;display: table-caption;" v-if="showData.length<=0&&!blnLoading">暂无数据</li>
                            <li v-for="(d,i) in showData" class="item" >
                                <div class="column cursor" @click="selItem(d)" v-if="blnExport"  style="width:50px;" ><span class="overflow" style="width:50px;"><i :class="{'fa fa-check-square-o':blnSelItem(d),'fa fa-square-o':!blnSelItem(d)}"></i></span></div>
                                <div  :title="d.netbar_wacode" @click="searchSiteDetail(d.netbar_wacode,d.microprobe_type)"><span class="overflow sit-click" style="width:120px;">{{d.netbar_wacode}}</span></div>
                                <div class="align" :title="d.netbar_name" ><span class="overflow" style="width:100px;">{{d.netbar_name}}</span></div>
                                <div class="align" :title="d.netbar_address"><span class="overflow" style="width:230px;">{{d.netbar_address}}</span></div>
                                <div  :title="d.online_state=='在线'?d.online_state_nelOn:d.online_state_nelOff"><span class="overflow" style="width:65px;" :class="[{red : d.online_state=='异常'},{green :d.online_state=='在线'}]">{{d.online_state}}</span></div>
                                <div  :title="d.situatioTitle" @click="moutType(d.netbar_wacode,d.netbar_name,d.microprobe_type)"><span class="overflow sit-click" style="width:80px;" v-html="d.situation"></span></div>
                                <div  :title="d.capture_time_desc"><span class="overflow" style="width:90px;">{{d.capture_time_desc}}</span></div>
                                <div  :title="d.last_upload_num" @click="dataStatus(d.netbar_wacode,d.netbar_name,d.microprobe_type_code)"><span class="overflow sit-click" style="width:72px;">{{d.last_upload_num}}</span></div>
                                <div  :title="d.business_state"><span class="overflow" style="width:65px;">{{d.business_state}}</span></div>
                                <div class="align" :title="d.netsite_type"><span class="overflow" style="width:200px;">{{d.netsite_type}}</span></div>
                                <div  :title="d.region_name"><span class="overflow" style="width:60px;">{{d.region_name}}</span></div>
                                <div  :title="d.microprobe_type"><span class="overflow" style="width:60px;">{{d.microprobe_type}}</span></div>
                                <div class="align" :title="d.security_software_orgname"><span class="overflow" style="width:80px;">{{d.security_software_orgname}}</span></div>
                                <!-- <div  title="查看详情" @click="searchSiteDetail(d.netbar_wacode,d.microprobe_type)"><span class="overflow sit-click" style="width:65px">详细</span></div> -->
                            </li>
                        </ul>
                    </Scroll>
                </div>
                <div class="page_container">
                    <span class="exportBtn" v-if="blnExport" @click="exportList()" style="float:left;margin-top:10px;margin-left:15px;font-size:12px;cursor:pointer;"><i class="fa fa-upload" /> 导出 <i v-if="exportDataing" class="fa fa-spinner fa-pulse" /></span>
                    <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;font-weight:bold">{{pageNum+1}}&nbsp;/&nbsp;{{pageSize}}</span></span>
                    <span style="float:left;margin-top:10px;margin-left:40px;font-size:12px;">每页&nbsp;{{query.limit}}&nbsp;条，&nbsp;&nbsp;共计&nbsp;&nbsp;<span>{{allTotall}}</span>&nbsp;条</span>
                    <div class="firstPage" @click="pageChange(0)" v-show="pageNum!=0">首页</div>
                    <div class="prePage" @click="pageChange(pageNum-1)" v-show="pageNum!=0">上一页</div>
                    <div class="nextPage" @click="pageChange(pageNum+1)" v-show="pageNum!=pageSize-1">下一页</div>
                    <div class="nextPage" @click="pageChange(pageSize-1)" v-show="pageNum!=pageSize-1">末页</div>
                </div>
            </div>
            <!--地图（瞄点）显示区域-->
            <div v-if="viewTable=='map'" style="height: calc(100% - 30px);position:relative">
                <MapSite :blnInit="true" :data="newObject" :showData="showData" :isSite="true"/>
            </div>
            <!--统计图表显示区域-->
            <div class="chart_container" v-show="viewTable=='statistics'" style="height: calc(100% - 30px);width:100%;position:relative">
                <!--扇形图（昨日状况）-->
                <div style="width:30%;height:40%;display:inline-block">
                     <div name="pie_chart_container" class="" style="width:100%;height:100%;text-align:left"></div>
                </div>      
                <!--扇形图（待处理场所）-->
                <div style="width:25%;height:40%;display:none" @click="changeDealFun(true)">
                     <div name="deal_chart_container" class="" style="width:100%;height:100%;text-align:left"></div>
                </div>             
                <!--柱状图(问题总览)-->
                <div style="width:67%;height:40%;display:inline-block">
                    <div name="bar_chart_container" style="width:100%%;height:100%;" ></div>
                </div>
                <!--线形图（在离线率）-->
                <div name="line_chart_container" style="width:95%;height:60%;display:inline-block;margin:0 auto">
                     <div class="his-row" style="height:13%">
                        <div class="his-title">场所在离线</div>
                        <div class="his-term item">
                            <span>数据来源：</span>
                            <div class="input">
                                <el-select v-model="microprobeType" placeholder="请选择" :clearable="true" :multiple="true">
                                <el-option
                                v-for="kind in dict_tables.microprobe_type"
                                :key="kind.code"
                                :label="kind.name"
                                :value="kind.value">
                                </el-option>
                                </el-select>
                            </div>
                        </div>                        
                        <div class="his-term item">
                            <span>时间范围：</span>
                            <div class="input"  style="width:100px">
                                <el-select v-model="collType" placeholder="请选择">
                                <el-option
                                v-for="kind in staticTime"
                                :key="kind.code"
                                :label="kind.name"
                                :value="kind.val">
                                </el-option>
                                </el-select>
                            </div>
                        </div>
                       <div class="his-term item" style="font-size:12px;font-weight:normal;text-align:left">
                            <span>厂商范围：</span>
                            <div class="input" style="width:180px;display:inline-block;">
                                <MulDropDwon :data="sitefirms" keyProp="name" id="code" placeholder="请选择厂商">
                                    <div v-for="t in firms" @mousedown="firmClick('chart',t)">{{t.name}} <i v-if="isHasSelItem(sitefirms,t.code)" class="fa fa-check" style="float:right;margin-top: 10px;"></i></div>
                                </MulDropDwon>
                            </div>
                        </div>                         
                        <div class="his-term item">
                            <span>区域范围:</span>
                            <div class="input">
                                <PlaceSearch  :blnClear="true" c_searchKind="0" @place_res="selectAreaChart"></PlaceSearch>
                            </div>
                        </div>
                        <div class="optionBar">
                            <div class="el-tooltip item " title="场所在离线详情" :class="{active: changeChart=='bar'}" @click="changeChartSty('bar')">
                                    <div class="el-tooltip__rel" ><i class="fa fa-area-chart"></i></div>
                            </div> 
                            <div class="el-tooltip item" title="场所在离线率" :class="{active: changeChart=='line'}" @click="changeChartSty('line')">
                                <div class="el-tooltip__rel"><i class="fa fa-line-chart"></i></div>
                            </div>
                            <div class="el-tooltip item" title="导出数据" @click="ExportOnlineCount()">
                                <div class="el-tooltip__rel"><i class="fa fa-level-down"></i></div>
                            </div>  
                        </div>       
                    </div>
                    <!--在离线率图表显示区域-->
                    <div class="chart_container" style="width:100%;height:82%;display:inline-block">
                        <!--在离线率柱状图-->
                        <div name="his_bar_chart_container" style="margin:0 auto;width:100%;height:100%" v-show="changeChart=='bar'"></div>
                        <!--在离线率线形图-->
                        <div name="his_line_chart_container" style="margin:0 auto;width:100%;height:100%" v-show="changeChart=='line'"></div>
                    </div>
                </div>
                <!--问题总览列表信息列表显示-->
                <div class="analysis_list" :class="{ 'noAnimateHide': problemTable=='0', 'noAnimateShow': problemTable=='1','animateShow': problemTable=='3','animateHide': problemTable=='5'}" style="z-index:1000">
                    <div style="" class="drag-info" @click="changeProblemFun(false)">
                        <div>问题总览&nbsp;&nbsp;<span style="font-size:40px;line-height:10px">︿</span></div>                        
                    </div>
                    <div class="option">
                        <div class="item">
                            <span>异常分类:</span>
                            <div class="input">
                                <el-select v-model="queryProblem.netbar_abnormal_type" placeholder="请选择" :blnClear="false">
                                    <el-option v-for="kind in dict_tables.netbar_abnormal_type" :label="kind.name" :value="kind.value"></el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="item" style="font-size:12px;font-weight:normal;text-align:left">
                                <span>所属厂商：</span>
                                <div class="input" style="width:250px;display:inline-block;">
                                    <MulDropDwon :data="Selfirms" keyProp="name" id="code" placeholder="请选择厂商">
                                        <div v-for="t in firms" @mousedown="firmClick('list',t)">{{t.name}} <i v-if="isHasSelItem(Selfirms,t.code)" class="fa fa-check" style="float:right;margin-top: 10px;"></i></div>
                                    </MulDropDwon>
                                </div>
                        </div>                         
                        <div class="item">
                            <span>所属区域:</span>
                            <div class="input">
                                <PlaceSearch  :blnClear="true" c_searchKind="0" @place_res="selectAreaProblem" ref="areaSel"></PlaceSearch>
                            </div>
                        </div>
                        <div class="item">
                            <span>场所范围:</span>
                            <div class="input">
                                <PlaceSearch :blnLike="true" :blnClear="true" c_searchKind="1" @place_res="selectSiteProblem" ref="siteSel"></PlaceSearch>
                            </div>
                        </div>
                        <div class="item" >
                            <el-button type="primary" @click="queryProblem_click()"><i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i><span v-show="!blnSearch">搜索</span></el-button>
                        </div> 

                    </div>
                    <ul class="header">
                        <li class="item">
                        <div><span class="overflow" style="width:120px;">场所编码</span></div>
                        <div><span class="overflow" style="width:100px;">场所名称</span></div>
                        <div><span class="overflow" style="width:80px;">所属厂商</span></div>
                        <div><span class="overflow" style="width:60px;">所属区域</span></div>
                        <!--<div><span class="overflow" style="width:230px;">问题分类</span></div>-->
                        <div><span class="overflow" style="width:93px;">当前场所状态</span></div>
                        <div><span class="overflow" style="width:80px;">场所概况</span></div>
                        <div><span class="overflow" style="width:140px;">最近联系时间</span></div>
                        <div><span class="overflow" style="width:72px;">昨日采集</span></div>
                        <div><span class="overflow" style="width:240px;">昨日异常原因</span></div>
                    
                        </li>
                    </ul>
                    <div class="content" style="height: calc(100% - 50px - 60px - 60px);background-color: #eee;">
                        <Scroll :listen="dataProblem" ref="ABC_problem">
                            <ul class="body">
                                <li class="item" style="text-align:center;display: table-caption;" v-if="showDataProblem.length<=0&&!blnLoading">暂无数据</li>
                                <li v-for="(d,i) in showDataProblem" class="item" >
                                    <div  :title="d.netbar_wacode" @click="searchSiteDetail(d.netbar_wacode,d.microprobe_type)"><span class="overflow sit-click" style="width:120px;">{{d.netbar_wacode}}</span></div>
                                    <div class="align" :title="d.netbar_name" ><span class="overflow" style="width:100px;">{{d.netbar_name}}</span></div>
                                    <div class="align" :title="d.security_software_orgname"><span class="overflow" style="width:80px;">{{d.security_software_orgname}}</span></div>
                                    <div  :title="d.region_name"><span class="overflow" style="width:60px;">{{d.region_name}}</span></div>
                                    <!--<div class="align" :title="d.netbar_address"><span class="overflow" style="width:230px;">{{d.netbar_address}}</span></div>-->
                                    <div  :title="d.online_state=='在线'?d.online_state_nelOn:d.online_state_nelOff"><span class="overflow" style="width:93px;" :class="[{red : d.online_state=='异常'},{green : d.online_state=='在线'}]">{{d.online_state}}</span></div>                                    
                                    <div  :title="d.situatioTitle" @click="moutType(d.netbar_wacode,d.netbar_name,d.microprobe_type)"><span class="overflow sit-click" style="width:80px;" v-html="d.situation"></span></div>                                    
                                    <div  :title="d.last_time"><span class="overflow" style="width:140px;">{{d.last_time}}</span></div>
                                    
                                    <div  :title="d.last_upload_num" @click="dataStatus(d.netbar_wacode,d.netbar_name,d.microprobe_type_code)"><span class="overflow sit-click" style="width:72px;">{{d.last_upload_num}}</span></div>                                                                    
                                    <div class="align" :title="d.errors"><span class="overflow" style="width:240px;">{{d.errors}}</span></div>
                                                                                                   
                                </li>
                            </ul>
                        </Scroll>
                    </div>
                    <div class="page_container">
                        <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageNumProblem+1}}</span></span>
                        <div class="firstPage" @click="pageProblemChange(0)">首页</div>
                        <div class="prePage" @click="pageProblemChange(pageNumProblem-1)">上一页</div>
                        <div class="nextPage" @click="pageProblemChange(pageNumProblem+1)">下一页</div>
                    </div>                    
                </div>
                <!--待处理场所列表信息列表显示 当前产品认为较复杂，下一阶段实现 目前先不显示 2018.5.23-->
                <div class="analysis_list" :class="problemTable=='2' ? 'noAnimateShow' : 'noAnimateHide'">
                    <div style="" class="drag-info" @click="changeDealFun(false)">
                        <div>待处理场所&nbsp;&nbsp;<span style="font-size:40px;line-height:10px">︿</span></div>                        
                    </div>
                    <div class="option">
                        
                        <div class="item">
                            <span>所属区域:</span>
                            <div class="input">
                                <PlaceSearch  :blnClear="true" c_searchKind="0" @place_res="selectAreaProblem"></PlaceSearch>
                            </div>
                        </div>
                        <div class="item" >
                            <el-button type="primary" @click="queryProblem_click()"><i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i><span v-show="!blnSearch">搜索</span></el-button>
                        </div> 

                    </div>
                    <ul class="header">
                        <li class="item">
                        <div><span class="overflow" style="width:115px;">场所编码</span></div>
                        <div><span class="overflow" style="width:100px;">场所名称</span></div>
                        <div><span class="overflow" style="width:80px;">所属厂商</span></div>
                        <div><span class="overflow" style="width:60px;">所属区域</span></div>
                        <!--<div><span class="overflow" style="width:230px;">问题分类</span></div>-->
                        <div><span class="overflow" style="width:63px;">场所状态</span></div>
                        <div><span class="overflow" style="width:80px;">场所概况</span></div>
                        <div><span class="overflow" style="width:140px;">最近联系时间</span></div>
                        <div><span class="overflow" style="width:72px;">昨日采集</span></div>
                        <div><span class="overflow" style="width:240px;">异常原因</span></div>
                    
                        </li>
                    </ul>
                    <div class="content" style="height: calc(100% - 50px - 60px - 60px);background-color: #eee;">
                        <Scroll :listen="dataProblem" ref="ABC_deal">
                            <ul class="body">
                                <li class="item" style="text-align:center;display: table-caption;" v-if="showDataProblem.length<=0&&!blnLoading">暂无数据</li>
                                <li v-for="(d,i) in showDataProblem" class="item" >
                                    <div  :title="d.netbar_wacode" @click="searchSiteDetail(d.netbar_wacode,d.microprobe_type)"><span class="overflow sit-click" style="width:115px;">{{d.netbar_wacode}}</span></div>
                                    <div class="align" :title="d.netbar_name" ><span class="overflow" style="width:100px;">{{d.netbar_name}}</span></div>
                                    <div class="align" :title="d.security_software_orgname"><span class="overflow" style="width:80px;">{{d.security_software_orgname}}</span></div>
                                    <div  :title="d.region_name"><span class="overflow" style="width:60px;">{{d.region_name}}</span></div>
                                    <!--<div class="align" :title="d.netbar_address"><span class="overflow" style="width:230px;">{{d.netbar_address}}</span></div>-->
                                    <div  :title="d.online_state"><span class="overflow" style="width:63px;" :class="[{red : d.online_state=='异常'},{green : d.online_state=='在线'}]">{{d.online_state}}</span></div>                                    
                                    <div  :title="d.situatioTitle" @click="moutType(d.netbar_wacode,d.netbar_name,d.microprobe_type)"><span class="overflow sit-click" style="width:80px;" v-html="d.situation"></span></div>                                    
                                    <div  :title="d.capture_time"><span class="overflow" style="width:140px;">{{d.capture_time}}</span></div>
                                    
                                    <div  :title="d.last_upload_num" @click="dataStatus(d.netbar_wacode,d.netbar_name,d.microprobe_type_code)"><span class="overflow sit-click" style="width:72px;">{{d.last_upload_num}}</span></div>                                                                    
                                    <div class="align" :title="d.errors"><span class="overflow" style="width:240px;">{{d.errors}}</span></div>
                                                                                                   
                                </li>
                            </ul>
                        </Scroll>
                    </div>
                    <div class="page_container">
                        <span style="float:left;margin-top:10px;margin-left:15px;font-size:12px;">当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageNumProblem+1}}</span></span>
                        <div class="firstPage" @click="pageProblemChange(0)">首页</div>
                        <div class="prePage" @click="pageProblemChange(pageNumProblem-1)">上一页</div>
                        <div class="nextPage" @click="pageProblemChange(pageNumProblem+1)">下一页</div>
                    </div>                    
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Scroll from 'components/scroll'
import cInput from 'components/Input'
import PlaceSearch from 'components/PlaceSearch'
import cSelect from 'components/Select'
import MapSite from 'components/MapSite'
// 引入图表组件
import echarts from  'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/dataZoom'

import * as d3 from 'd3'
import {scaleLinear,scaleSequential} from "d3-scale"
import BaiduHelper from '../helper/BaiduHelper';

import ScaleBar from 'components/scaleBar'
import MulDropDwon from 'components/MulDropDown'     //厂商选择控件
import TaskType from '../enum/TaskType'
import RelativeAnlay from '../modules/case/anlay'
import AddPop from '../modules/case/addPop'
import {HisPercentageExport,GetSiteTerminalList,GetFirm,BODY_RESIZE,GetSiteList,ExportSiteList,
        GetSiteDeviceList,getDictTables,SiteDetectColl,SiteDetail,SiteHisPercentage,LastPercentage
        ,siteDetectYesterday,siteDetectHistory,siteScoreCollect,waitingHandleSite} from '../store/mutation-types'
export default {
  name: 'sitePage',
  components:{
      Scroll,
      PlaceSearch,
      cSelect,
      MapSite,
      MulDropDwon,
      ScaleBar
    },
    watch:{
        collType () {
            this.getOnOffLineData();
        },
        microprobeType () {
            this.getOnOffLineData();
        },     
        regionRange () {
            this.getOnOffLineData();
        },            
        sitefirms(){
            this.softwareOrgcodes=_.map(this.sitefirms,s=>s.code).join(',');
            this.getOnOffLineData();        
        },        
        viewTable(){
            if(this.viewTable=="statistics"){
                if(this.myLineChart){
                    setTimeout(()=>{
                        this.myLineChart.resize(); 
                    })                          
                };
                if(this.myOnOffBarChart){
                    setTimeout(()=>{
                        this.myOnOffBarChart.resize();
                    })                                                      
                };
                if(this.myPieChart){
                    setTimeout(()=>{
                        this.myPieChart.resize(); 
                    })                                                    
                } ;    
               if(this.myDealChart){
                    setTimeout(()=>{
                        this.myDealChart.resize(); 
                    })                                                    
                } ;      
                if(this.myBarChart){
                    setTimeout(()=>{
                        this.myBarChart.resize();
                    })                                                     
                }                  
            }
        },
        changeChart(){
            if(!this.myLineChart)return;
                setTimeout(()=>{
                    this.myLineChart.resize();
            },0);            
            if(!this.myOnOffBarChart)return;
                setTimeout(()=>{
                    this.myOnOffBarChart.resize();
            },0);  
        },
        Selfirms(){
            this.queryProblem.security_software_orgcodes=_.map(this.Selfirms,s=>s.code).join(',');
        },
         siteIndfirms(){
            this.query.security_software_orgcodes=_.map(this.siteIndfirms,s=>s.code).join(',');
        },
        blnExport(){
            this.selIds=[];
        }
    },
  data () {
    return {
        place_status:{online:'在线',offline:'离线',abnormal:'异常'},      //场所在线状态
        listBodyH:0,          //列表表体高度
        siteType:[],          //场所类型
        siteState:[{name:'在线',val:true},{name:'离线',val:false}],
        siteSource:[],                  //数据来源
        viewTable:"statistics",                //列表，地图和统计相互切换的标识
        blnLoading:false,                //加载中标识
        pageNum:0,                      //当前页号（0开始计数）
        allTotall:null,                  //总条数
        pageSize:null,                  //总计多少页
        dict_tables:{},                 //字典信息集合
        myPieChart:"",  
        myDealChart:"",
        myBarChart:"",
        myLineChart:"",   
        myOnOffBarChart :"",
        problemTable:'0',              //问题总览列表,待处理场所列表与页面切换标识 0：不显示（无动画，都不显示）   1：问题总览（无动画，显示）  2：待处理场所（无动画，显示） 3:问题总览（临时动画态,显示） 4:待处理场所（临时动画态显示)   5:问题总览（临时动画态,隐藏） 6:待处理场所（临时动画态隐藏)
        staticTime:[{name:'近一周',val:'week'},{name:'近一月',val:'month'}],
        changeChart:"line",             //场所在线率柱状图与条形图的相互切换标识
        //OnOffLIneType:'week',              //场所在线率统计状态默认为近一周   
        weekOnOffLIne:"",              //场所在离线数据             
        //monthOnOffLIne:"",              //月场所在离线数据  
        myYesdayOnOffLIne:"",           //获取场所昨日在离线状况
        elWidth:0,
        elHeight:0,
        blnShowStatus:false,
        bodyClickId:-1,
        blnSearch:false,
        query:{
            limit:20,//每页20条
            skip:0,//跳过0条
            //netbar_name:'',//场所名称 
            netsite_type:'', //场所类型
            netsite_state:'',//场所状态
            microprobe_type:'',//数据来源&采集系统类型
            region_range:[],   //区域范围
            netsite_range:[],   //场所范围
            security_software_orgcodes:""
        },
        firms:[],            //所有厂商数据
        Selfirms:[],         //厂商控件选中的厂商(问题场所列表中的厂商控件)
        sitefirms:[],        //厂商控件选中的厂商(场所在离线柱状图和折线图中的厂商控件)
        siteIndfirms:[],      //厂商控件选中的厂商(主列表中的厂商控件)
        collType:'week',              //时间范围，默认为近一周  (场所在离线柱状图和折线图中)  
        microprobeType:"",            //数据来源， (场所在离线柱状图和折线图中)  
        regionRange:"",               //区域范围， (场所在离线柱状图和折线图中)  
        softwareOrgcodes:"",          //厂商范围， (场所在离线柱状图和折线图中)          
        pageNumProblem:0,
        queryProblem:{
            limit:20,//每页20条
            skip:0,//跳过0条
            region_range:[],   //区域范围
            netsite_range:[],     //场所范围
            security_software_orgcodes:"",   //厂商范围
            netbar_abnormal_type:"",

        },
        data:[],
        dataProblem:[],
        newObject:{
            primaryKey:"netbar_info|netbar_wacode",
        },
        blnExport:false,//是否进入导出选择阶段,
        selIds:[],//选中项的IDS
        exportDataing:false, //是否正在进行导出数据请求
        bodyResizeSub:null,

    }
  },
  mounted(){
    this.bodyClickId=tool.SingleBind('mousedown',$('body'),()=>{
       this.blnShowStatus=false;
    });
    //this.query.microprobe_type=["120"];
    this.refreshPage();
    this.getOnOffLineData();
    this.getYesdayData();
    this.getDealData();
    this.layout();

    this.$store.commit(BODY_RESIZE,{cb:(sub)=>{
       this.bodyResizeSub=sub
    },sub:()=>{
        this.layout();
        if(this.myLineChart){
            this.myLineChart.resize();              
        };
        if(this.myOnOffBarChart){
            this.myOnOffBarChart.resize();              
        };
        if(this.myPieChart){
            this.myPieChart.resize();             
        } ;        
        if(this.myBarChart){
            this.myBarChart.resize();             
        }     
        if(this.myDealChart){
            this.myDealChart.resize();             
        }             
    }});

  },
  computed:{
      showData(){
          return _.map(this.data,r=>{
                return {
                    netbar_wacode:r.netbar_wacode,
                    netbar_name:r.netbar_name,
                    netbar_address:r.netbar_address,
                    online_state:this.place_status[r.online_state] || r.online_state,
                    online_state_nelOn:(this.place_status[r.online_state] || r.online_state)=="在线"?"心跳在线，数据在线":"心跳离线，数据离线",
                    online_state_nelOff:(this.place_status[r.online_state] || r.online_state)=="异常"?"心跳在线，数据离线或心跳离线，数据在线":"心跳离线，数据离线",
                    capture_time:(r.capture_time&&r.capture_time!='0') ? tool.DateByTimestamp(r.capture_time,'yyyy-MM-dd hh:mm:ss'):'无',
                    capture_time_desc:r.capture_time_desc,
                    business_state:r.business_state,
                    last_upload_num:r.last_upload_num,
                    longitude:r.longitude,
                    latitude:r.latitude,
                    netsite_type:r.netsite_type,
                    region_name:r.region_name,
                    microprobe_type:r.microprobe_type,
                    microprobe_type_code:r.microprobe_type_code,
                    security_software_orgname:r.security_software_orgname,
                    situation:r.microprobe_type=="网吧"? r.net_terminal_num+"/"+r.actual_terminal+"/"+r.internet_users :"<span style='color:green'>"+ r.online_device+"</span>/<span style='color:red'>"+r.abnormal_device+"</span>/<span style='color:#000'>"+r.offline_device+"</span>",
                    situatioTitle:r.microprobe_type=="网吧"? "申报终端："+r.net_terminal_num+"台/检测终端："+r.actual_terminal+"台/在线终端："+r.internet_users+"台" :"在线："+r.online_device+"台/异常："+r.abnormal_device+"台/离线："+r.offline_device+"台",               
                }
            });
      },
      showDataProblem(){
          return _.map(this.dataProblem,r=>{
                return {
                    netbar_wacode:r.netbar_wacode,
                    netbar_name:r.netbar_name,
                    security_software_orgname:r.security_software_orgname,
                    online_state:this.place_status[r.online_state] || r.online_state,
                    online_state_nelOn:(this.place_status[r.online_state] || r.online_state)=="在线"?"心跳在线，数据在线":"心跳离线，数据离线",
                    online_state_nelOff:(this.place_status[r.online_state] || r.online_state)=="异常"?"心跳在线，数据离线或心跳离线，数据在线":"心跳离线，数据离线",                    
                    capture_time:(r.capture_time&&r.capture_time!='0') ? tool.DateByTimestamp(r.capture_time,'yyyy-MM-dd hh:mm:ss'):'无',
                    last_time:r.last_time,
                    business_state:r.business_state,
                    last_upload_num:r.last_upload_num,
                    longitude:r.longitude,
                    latitude:r.latitude,
                    netsite_type:r.netsite_type,
                    region_name:r.region_name,
                    errors:r.errors,
                    microprobe_type:r.microprobe_type,
                    microprobe_type_code:r.microprobe_type_code,
                    security_software_orgname:r.security_software_orgname,
                    situation:r.microprobe_type=="网吧"? r.net_terminal_num+"/"+r.actual_terminal+"/"+r.internet_users :"<span style='color:green'>"+ r.online_device+"</span>/<span style='color:red'>"+r.abnormal_device+"</span>/<span style='color:#000'>"+r.offline_device+"</span>",
                    situatioTitle:r.microprobe_type=="网吧"? "申报终端："+r.net_terminal_num+"台/检测终端："+r.actual_terminal+"台/在线终端："+r.internet_users+"台" :"在线："+r.online_device+"台/异常："+r.abnormal_device+"台/离线："+r.offline_device+"台",               
                }
            });
      },
      blnAllSel(){
        let s=this,res=true;
        for(let i=0;i<s.data.length;i++){
            if(_.findIndex(this.selIds,id=>id==s.data[i].netbar_wacode)<0){
                res=false;break;
            }
        }
        return res;
      }
  },
  beforeDestroy(){
    this.bodyResizeSub.unsubscribe();
  },
  destroyed(){
    tool.ClearBind(this.bodyClickId)
  },
  methods:{
      //是否包含选中项
      isHasSelItem(data,code){
        return  _.find(data,d=>d.code==code);
      },
      layout(){
        let optionH=$(this.$el).find('div[name="listOption"]').height();
        this.listBodyH=`calc(100% - 40px - 50px - 20px - ${optionH}px)`;
        this.$nextTick(()=>{
            this.$refs.indList.reloadyScroll();
        });
      },
      //数据来源多选下拉框特殊处理，选了网吧就不能选择其他的,如果为空的话也会被强制选择网吧   现在该需求取消不设置默认
      /*filterMicroprobe(data){
            if(data.length==0){
                this.query.microprobe_type=["120"];
            }
            if(data.length==1) return;
            if(data[data.length-1]=="120"){
                this.query.microprobe_type=["120"];
                return;
            }
            for(let i=0;i<data.length;i++){               
                if(data[i]=="120"){
                    this.query.microprobe_type.splice(i,1);               
                }               
            }
      },*/
      //刷新页面
      refreshPage(){
          this.loadData();
      },
      //加载数据
      loadData(){
        //加载时先清空数据在加载等待动画，请求完后数据加载
        if(this.data){
          this.data=[];
          this.blnLoading=true;
        }
        //获取数据来源（下拉框序列化）
        this.$store.dispatch(getDictTables).then(res=>{
            if(res.msg.code!='successed')return;
            this.dict_tables= res.biz_body;
            //this.query.microprobe_type=["120"];
        });
        //获取场所信息
        this.$store.dispatch(GetSiteList,this.query).then(res=>{
                if(res.msg.code!='successed')return;
                this.data=res.biz_body;
                this.allTotall=res.page?res.page.total:null;
                this.pageSize=res.page?res.page.page_size:null;
                this.blnLoading=false;
                //if(this.query.microprobe_type[0]=="120")   this.query.microprobe_type=["120"];
        });        
        //获取厂商下拉框数据
        this.$store.dispatch(GetFirm).then(res=>{
            if(!tool.msg(res,'','获取厂商数据失败!'))return;
            this.firms=res.biz_body;
        });
      },
      //区域范围的事件回传，第一个参数为上下文环境，第二个参数为具体值,因为该页面为单独定制没有上下文，因此取第二个值即可（主要用于列表页面）
      selectArea(val,data){
        if(data){
            this.query.region_range=data.regions;
        }else{
            this.query.region_range="";
        }
      },
      //区域范围的事件回传，（主要用于图表处的区域范围选择控件）
      selectAreaChart(val,data){
        if(data){
            this.regionRange=data.regions;
        }else{
            this.regionRange="";
        }
      },
      //区域范围的事件回传 （问题总览列表下的区域范围选择）
      selectAreaProblem(val,data){
        if(data){
            this.queryProblem.region_range=data.regions;
        }else{
            this.queryProblem.region_range="";
        }
      },
      //场所范围的事件回传，第一个参数为上下文环境，第二个参数为具体值,和区域范围选择类似
      selectSite(val,data){ 
        if(data){           
            this.query.netsite_range=data.sites;
        }else{
            this.query.netsite_range="";
        }
      },
      //场所范围的事件回传，第一个参数为上下文环境，第二个参数为具体值,和区域范围选择类似
      selectSiteProblem(val,data){ 
        if(data){           
            this.queryProblem.netsite_range=data.sites;
        }else{
            this.queryProblem.netsite_range="";
        }
      },
      //处理厂商选择控件的方法
      firmClick(type,d){
          let index=-1;
          switch(type){
              case "list":
                index=_.findIndex(this.Selfirms,t=>t.code==d.code);
                if(index>=0){this.Selfirms.splice(index,1); return;}
                this.Selfirms.push(d);
                break;
              case "chart":           
                index=_.findIndex(this.sitefirms,t=>t.code==d.code);
                if(index>=0){this.sitefirms.splice(index,1); return;}
                this.sitefirms.push(d);
                break;   
              case "listInd":
                index=_.findIndex(this.siteIndfirms,t=>t.code==d.code);
                if(index>=0){this.siteIndfirms.splice(index,1); return;}
                this.siteIndfirms.push(d);
                break;   

          }
        },

      //列表，地图和统计相互切换  
      switchView(type){
        if(type==this.viewTable) return
        this.viewTable=type;
        //处理多滚动条页面来回切换的bug
        if(type=="list"){
            this.$nextTick(()=>{
                this.layout();
            });
        }else if(type=="statistics"){
            if(this.problemTable=='1'){
                this.$nextTick(()=>{
                    this.$refs.ABC_problem.reloadyScroll();
                });     
            }else{
                this.$nextTick(()=>{
                    this.$refs.ABC_deal.reloadyScroll();
                });                   
            }    
        }   
      },
      //获取场所在离线数据
      getOnOffLineData(){
         this.$store.dispatch(SiteHisPercentage,{coll_type:this.collType,microprobe_type:this.microprobeType,region_range:this.regionRange,security_software_orgcodes:this.softwareOrgcodes}).then(res=>{
           if(res.msg.code!='successed')return;
           this.weekOnOffLIne=res.biz_body;
           this.addOfflineLineChart(this.weekOnOffLIne);     //加载折线图
           this.addOfflineBarChart(this.weekOnOffLIne);      //加载柱状图
         });
      },
      //获取昨日状况
      getYesdayData(){
         this.$store.dispatch(LastPercentage).then(res=>{
           if(res.msg.code!='successed')return;
           this.myYesdayOnOffLIne=res.biz_body;
    
            this.loadPieChart(this.myYesdayOnOffLIne);
            //this.loadDealChart(this.myYesdayOnOffLIne);
            this.loadBarChart(this.myYesdayOnOffLIne);
         });
      },   
      //获取待处理场所
      getDealData(){
         this.$store.dispatch(waitingHandleSite).then(res=>{
           if(res.msg.code!='successed')return;
           //this.myYesdayOnOffLIne=res.biz_body;
           this.loadDealChart(res.biz_body);
            //this.loadPieChart(this.myYesdayOnOffLIne);
            //this.loadDealChart(this.myYesdayOnOffLIne);
            //this.loadBarChart(this.myYesdayOnOffLIne);
         });
      },         
      //切换柱状图和条形图
      changeChartSty(val){
            if(val==this.changeChart) return;
            this.changeChart = val;          
      },
      //加载扇形图(饼图)，昨日状况
      loadPieChart(data){
        let myaPieChart=$(this.$el).find('div[name="pie_chart_container"]')[0]
        this.myPieChart = echarts.init(myaPieChart);
        let allNum=data.pie.online+data.pie.abnormals+data.pie.offline;
        let onlineNum="网吧："+data.pie.micprotype_120.online+' ( '+(data.pie.micprotype_120.online/allNum*100).toFixed(2)+'% )<br>WIFI：'+data.pie.micprotype_145.online+' ( '+(data.pie.micprotype_145.online/allNum*100).toFixed(2)+'% )<br>非经：'+data.pie.micprotype_123.online+' ( '+(data.pie.micprotype_123.online/allNum*100).toFixed(2)+'% )<br>特征：'+data.pie.micprotype_146.online+' ( '+(data.pie.micprotype_146.online/allNum*100).toFixed(2)+'% )';
        let offlineNum="网吧："+data.pie.micprotype_120.offline+' ( '+(data.pie.micprotype_120.offline/allNum*100).toFixed(2)+'% )<br>WIFI：'+data.pie.micprotype_145.offline+' ( '+(data.pie.micprotype_145.offline/allNum*100).toFixed(2)+'% )<br>非经：'+data.pie.micprotype_123.offline+' ( '+(data.pie.micprotype_123.offline/allNum*100).toFixed(2)+'% )<br>特征：'+data.pie.micprotype_146.offline+' ( '+(data.pie.micprotype_146.offline/allNum*100).toFixed(2)+'% )';
        let abnormalsNum="网吧："+data.pie.micprotype_120.abnormals+' ( '+(data.pie.micprotype_120.abnormals/allNum*100).toFixed(2)+'% )<br>WIFI：'+data.pie.micprotype_145.abnormals+' ( '+(data.pie.micprotype_145.abnormals/allNum*100).toFixed(2)+'% )<br>非经：'+data.pie.micprotype_123.abnormals+' ( '+(data.pie.micprotype_123.abnormals/allNum*100).toFixed(2)+'% )<br>特征：'+data.pie.micprotype_146.abnormals+' ( '+(data.pie.micprotype_146.abnormals/allNum*100).toFixed(2)+'% )';
 
        var option = {
            title: [{
                text: '昨日概况',
                x : 50, 
                textStyle: {  
                    fontSize: 19,
                    fontWeight:900,
                }, 
            },{
                text: '场所总量：'+(data.pie.online+data.pie.abnormals+data.pie.offline),
                x : 50, 
                y : 140, 
                textStyle: {  
                    fontSize: 13,
                    fontWeight:"normal",
                }, 
            } ],
            tooltip: {
                trigger: 'item',
                formatter:function(param){
                    let newName=param.name.substr(0,2);
                    let str=newName+'场所<br>总量：'+param.value+' ( '+param.percent+'% )<br>';                    
                    if(allNum!=0){                        
                        if(newName=='在线'){
                            str+=onlineNum;
                        }else if(newName=='离线'){
                            str+=offlineNum;
                        }else{
                            str+=abnormalsNum;
                        }
                    }
                    return str;
                }
            },
            legend: {
                orient : 'vertical',  
                x : 50,  
                y : 30,
                itemHeight:20,
                padding:[20,5,20,5],
                selectedMode:false,
                textStyle: {  
                    fontSize: 13,
                }, 
                data:["在线："+data.pie.online,"异常："+data.pie.abnormals,"离线："+data.pie.offline]  
            },
            series: [{
                name: '',
                type: 'pie',
                radius:"76%",
                center: ['65%','55%'],
                data: [
                    {
                        name: "在线："+data.pie.online, 
                        value: data.pie.online,
                        itemStyle:{
                            normal:{
                                color:'#85C226',
                                label : {
                                    show : true,
                                textStyle : {
                                    fontWeight : 300 ,
                                    fontSize : 12    //文字的字体大小
                                },
                                formatter:'{d}%'
                                },
                            }
                        }
                    },{
                        name: "异常："+data.pie.abnormals, 
                        value: data.pie.abnormals,
                        itemStyle:{
                            normal:{
                                color:'#F8C301',
                                label : {
                                    show : true,
                                    textStyle : {
                                        fontWeight : 300 ,
                                        fontSize : 12    //文字的字体大小
                                    },
                                formatter:'{d}%'
                                },
                            }
                        }
                    },{
                        name: "离线："+data.pie.offline, 
                        value: data.pie.offline,
                        itemStyle:{
                            normal:{
                                color:'#728498',
                                label : {
                                    show : true,
                                textStyle : {
                                    fontWeight : 300 ,
                                    fontSize : 12    //文字的字体大小
                                }, 
                                formatter:'{d}%'
                                },
                            }
                        }
                    },
                ]
            }]
        };
        this.myPieChart.setOption(option);
         setTimeout(()=>{
             this.myPieChart.resize();
         })
        
      },
      //加载扇形图(饼图)，待处理场所
      loadDealChart(data){
        let myaPieChart=$(this.$el).find('div[name="deal_chart_container"]')[0]
        this.myDealChart = echarts.init(myaPieChart);
        let allNum=data.urgent+data.serious+data.general+data.normal;
        if(!data.micprotype_120){
            data.micprotype_120={
                general:0,
                urgent:0,
                serious:0,
                normal:0
            }
        }
        if(!data.micprotype_145){
            data.micprotype_145={
                general:0,
                urgent:0,
                serious:0,
                normal:0
            }
        }
        if(!data.micprotype_123){
            data.micprotype_123={
                general:0,
                urgent:0,
                serious:0,
                normal:0
            }
        }
        if(!data.micprotype_146){
            data.micprotype_146={
                general:0,
                urgent:0,
                serious:0,
                normal:0
            }
        }

        let urgentNum="网吧："+data.micprotype_120.urgent+' ( '+(data.micprotype_120.urgent/allNum*100).toFixed(2)+'% )<br>WIFI：'+data.micprotype_145.urgent+' ( '+(data.micprotype_145.urgent/allNum*100).toFixed(2)+'% )<br>非经：'+data.micprotype_123.urgent+' ( '+(data.micprotype_123.urgent/allNum*100).toFixed(2)+'% )<br>特征：'+data.micprotype_146.urgent+' ( '+(data.micprotype_146.urgent/allNum*100).toFixed(2)+'% )';
        let seriousNum="网吧："+data.micprotype_120.serious+' ( '+(data.micprotype_120.serious/allNum*100).toFixed(2)+'% )<br>WIFI：'+data.micprotype_145.serious+' ( '+(data.micprotype_145.serious/allNum*100).toFixed(2)+'% )<br>非经：'+data.micprotype_123.serious+' ( '+(data.micprotype_123.serious/allNum*100).toFixed(2)+'% )<br>特征：'+data.micprotype_146.serious+' ( '+(data.micprotype_146.serious/allNum*100).toFixed(2)+'% )';
        let generaNum="网吧："+data.micprotype_120.general+' ( '+(data.micprotype_120.general/allNum*100).toFixed(2)+'% )<br>WIFI：'+data.micprotype_145.general+' ( '+(data.micprotype_145.general/allNum*100).toFixed(2)+'% )<br>非经：'+data.micprotype_123.general+' ( '+(data.micprotype_123.general/allNum*100).toFixed(2)+'% )<br>特征：'+data.micprotype_146.general+' ( '+(data.micprotype_146.general/allNum*100).toFixed(2)+'% )';
        let normalNum="网吧："+data.micprotype_120.normal+' ( '+(data.micprotype_120.normal/allNum*100).toFixed(2)+'% )<br>WIFI：'+data.micprotype_145.normal+' ( '+(data.micprotype_145.normal/allNum*100).toFixed(2)+'% )<br>非经：'+data.micprotype_123.normal+' ( '+(data.micprotype_123.normal/allNum*100).toFixed(2)+'% )<br>特征：'+data.micprotype_146.normal+' ( '+(data.micprotype_146.normal/allNum*100).toFixed(2)+'% )';
        var option = {
            title: {
                text: '待处理场所',
                x : 50, 
                y :30, 
                textStyle: {  
                    fontSize: 15,
                    fontWeight:200,
                }, 
            },
            tooltip: {
                trigger: 'item',
                formatter:function(param){
                    let str=param.name+'需处理<br>总量：'+param.value+' ( '+param.percent+'% )<br>';
                    if(allNum!=0){                        
                        if(param.name=='紧急'){
                            str+=urgentNum;
                        }else if(param.name=='严重'){
                            str+=seriousNum;
                        }else if(param.name=='一般'){
                            str+=generaNum;
                        }else{
                            str+=abnormalsNum;
                        }
                    }
                    return str;
                }
            },
            legend: {
                orient : 'vertical',  
                x : 50,  
                y : 80,
                itemHeight:20,
                padding:[20,5,20,5],
                textStyle: {  
                    fontSize: 13,
                }, 
                data:['紧急','严重','一般','无影响']  
            },
            series: [{
                name: '',
                type: 'pie',
                radius:"76%",
                center: ['65%','55%'],
                data: [
                    {
                        name: '紧急', 
                        value: data.urgent,
                        itemStyle:{
                            normal:{
                                //color:'#85C226',
                                label : {
                                    show : true,
                                    position:'inner', //标签的位置
                                textStyle : {
                                    fontWeight : 300 ,
                                    fontSize : 12    //文字的字体大小
                                },
                                formatter:'{d}%'
                                },
                            }
                        }
                    },{
                        name: '严重', 
                        value: data.serious,
                        itemStyle:{
                            normal:{
                                //color:'#F8C301',
                                label : {
                                    show : true,
                                    position:'inner', //标签的位置
                                    textStyle : {
                                        fontWeight : 300 ,
                                        fontSize : 12    //文字的字体大小
                                    },
                                formatter:'{d}%'
                                },
                            }
                        }
                    },{
                        name: '一般', 
                        value: data.general,
                        itemStyle:{
                            normal:{
                                //color:'#F8C301',
                                label : {
                                    show : true,
                                    position:'inner', //标签的位置
                                    textStyle : {
                                        fontWeight : 300 ,
                                        fontSize : 12    //文字的字体大小
                                    },
                                formatter:'{d}%'
                                },
                            }
                        }
                    },{
                        name: '无影响', 
                        value: data.normal,
                        itemStyle:{
                            normal:{
                                //color:'#728498',
                                label : {
                                    show : true,
                                    position:'inner', //标签的位置
                                textStyle : {
                                    fontWeight : 300 ,
                                    fontSize : 12    //文字的字体大小
                                }, 
                                formatter:'{d}%'
                                },
                            }
                        }
                    },
                ]
            }]
        };
        this.myDealChart.setOption(option);
         setTimeout(()=>{
             this.myDealChart.resize();
         })
        
      },      
      //加载柱状图 问题总览   
      loadBarChart(data){
        let myaBarChart=$(this.$el).find('div[name="bar_chart_container"]')[0]
        this.myBarChart = echarts.init(myaBarChart);
        option = {
            title: {
                text: '问题总览',
                x : 20, 
            },
            legend: {
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01],
                splitLine:{
                    show:false
                },
                axisLine:{
                    lineStyle:{
                        //color:'#C9C9C9',
                       // width:8,
                    }                    
                }
            },
            yAxis: {
                type: 'category',
                data: ['场所维护','场所处罚','场所离线','设备故障','采集波动','采集失效',"刷卡异常",'终端异常'],
                splitLine:{
                    show:false
                },
                axisTick: {
                    show: false
                },
                axisLine:{
                    lineStyle:{
                        //color:'#C9C9C9',
                       // width:8,//
                    }                    
                }
            },
            series: [
                {
                    name: '2011年',
                    type: 'bar',
                    //label: labelOption,
                    barWidth : 25,//柱图宽度
                    itemStyle:{  
                        normal:{  
                            color: function (params){
                                var colorList = ['rgb(114, 132, 154)','rgb(147, 160, 176)','rgb(189, 202, 218)','rgb(249, 201, 129)','rgb(253, 188, 96)','rgb(254, 169, 50)','rgb(255, 150, 0)'];
                                return colorList[params.dataIndex];
                            }
                        }  
                    }, 
                    label:{
                        normal:{
                            show:true,            //显示数字
                            position: 'insideLeft',        //这里可以自己选择位置
                            textStyle: {
                                color: '#fff',
                                fontSize:13,
                                fontWeight:700,
                                padding: [0, 20]
                            }
                        },

                    },
                    data: [data.hist.netbar_maintenances,data.hist.netbar_punishments, data.hist.netbar_offlines, data.hist.netbar_equip_faults, data.hist.collection_undulate, data.hist.collection_abnormals,data.hist.card_abnormals,data.hist.terminal_abnormals]
                }
                
            ]
        };
        this.myBarChart.setOption(option);
        let that=this;
        this.myBarChart.on('click', function (params) {
            for(let any of that.dict_tables.netbar_abnormal_type){
                if(any.name==params.name){
                    that.queryProblem.netbar_abnormal_type=any.value;
                }
            }            
            that.changeProblemFun(true);
        });
        setTimeout(()=>{
              this.myBarChart.resize();   
         })

      },
      //加载在离线折线图time横坐标时间 inLineData：在线 ,offLineData：离线,abnormalsData：异常
      addOfflineLineChart(data){
        let offlineLineChart=$(this.$el).find('div[name="his_line_chart_container"]')[0]
        this.myLineChart = echarts.init(offlineLineChart);
        let time=[],inLineData=[],offLineData=[],abnormalsData=[];
        for(let i=0;i<data.length;i++){
            time.push(data[i].stat_date.substr (0,4)+"-"+data[i].stat_date.substr (4,2)+"-"+data[i].stat_date.substr (6,2));
            inLineData.push((data[i].online_pre*100).toFixed(2))
            offLineData.push((data[i].offline_pre*100).toFixed(2))
            abnormalsData.push((data[i].abnormals_pre*100).toFixed(2))
        }
        let  option = {
                tooltip: {
                    trigger: 'axis',
                    formatter:function(param){
                        let str=param[0].axisValue+'<br>';
                        _.each(param,p=>{
                            str+=`${p.seriesName}:${p.data}%<br>`
                        });
                        return str;
                    },              
                },
                legend: {
                    orient : 'horizontal',  
                    textStyle: {  
                        fontSize: 13,
                    }, 
                    //selectedMode:false,
                    data:['在线率','异常率','离线率']  
                },
                grid:{	//设置图标上面和下面的距离
                    left: 50,
                    right: 50,
                },
                xAxis:  {
                    type: 'category',
                    boundaryGap: false,
                    data: time,
                },
                yAxis: {
                    type: 'value',                    
                    xisLabel: {
                        formatter: '{value} %'
                    },
                    axisLabel: {
                        formatter: '{value} %'
                    },
                    axisPointer: {
                        snap: true
                    }
                },
                series:[{
                    name: "在线率",
                    type: 'line',
                    data: inLineData,
                    itemStyle: {
                        normal: {
                            color:'#85C226',
                            label: {
                                formatter: '{c}%'
                            },
                        }
                    },
                    areaStyle: {
                        normal: {
                            color:{
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: '#B2CDFF' // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#fff' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                        }
                    },
                },{
                    name: "异常率",
                    type: 'line',
                    data: abnormalsData,
                    itemStyle: {
                        normal: {
                                color:'#F8C301',
                            label: {
                                formatter: '{c}%'
                            },
                           // color: '#d68262'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color:{
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: '#F5E8B4' // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#fff' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                        }
                    },                   
                },{
                    name: "离线率",
                    type: 'line',
                    data: offLineData,
                    itemStyle: {
                        
                        normal: {
                            color:'#728498',
                            label: {
                                formatter: '{c}%'
                            },
                           // color: '#FFD601'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color:{
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: '#D7DEE8' // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#fff' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                        }
                    },                  
                }]
            };
        
            this.myLineChart.setOption(option);
            this.myLineChart.resize();   
      

      
      },
      //加载在离线柱状图 
      addOfflineBarChart(data){
        let offlineLineChart=$(this.$el).find('div[name="his_bar_chart_container"]')[0]
        this.myOnOffBarChart = echarts.init(offlineLineChart);
        let time=[],inLineData=[],offLineData=[],abnormalsData=[];
        let tipOnline=[],tipOffline=[],tipAbnormals=[];
        for(let i=0;i<data.length;i++){
            time.push(data[i].stat_date.substr (0,4)+"-"+data[i].stat_date.substr (4,2)+"-"+data[i].stat_date.substr (6,2));
            inLineData.push(data[i].online_num)
            offLineData.push(data[i].offline_num)
            abnormalsData.push(data[i].abnormals_num);

                tipOnline[i]=(data[i].online_pre*100).toFixed(2)+'% )<br>';
                let newAnyOne=!data[i].micprotype_120 ?'' : '网吧：'+data[i].micprotype_120.online_num+'( '+(data[i].micprotype_120.online_pre*100).toFixed(2)+'% )<br>';
                let newAnyTwo=!data[i].micprotype_145 ?'' : 'WIFI：'+data[i].micprotype_145.online_num+'( '+(data[i].micprotype_145.online_pre*100).toFixed(2)+'% )<br>';
                let newAnyThree=!data[i].micprotype_123 ?'' : '非经：'+data[i].micprotype_123.online_num+'( '+(data[i].micprotype_123.online_pre*100).toFixed(2)+'% )<br>';
                let newAnyFour=!data[i].micprotype_146 ?'' : '特征：'+data[i].micprotype_146.online_num+'( '+(data[i].micprotype_146.online_pre*100).toFixed(2)+'% )<br>';
                tipOnline[i] +=newAnyOne+newAnyTwo+newAnyThree+newAnyFour;
               
                tipOffline[i]=(data[i].offline_pre*100).toFixed(2)+'% )<br>';
                let newAnyOffOne=!data[i].micprotype_120 ?'' : '网吧：'+data[i].micprotype_120.offline_num+'( '+(data[i].micprotype_120.offline_pre*100).toFixed(2)+'% )<br>';
                let newAnyOffTwo=!data[i].micprotype_145 ?'' : 'WIFI：'+data[i].micprotype_145.offline_num+'( '+(data[i].micprotype_145.offline_pre*100).toFixed(2)+'% )<br>';
                let newAnyOffThree=!data[i].micprotype_123 ?'' : '非经：'+data[i].micprotype_123.offline_num+'( '+(data[i].micprotype_123.offline_pre*100).toFixed(2)+'% )<br>';
                let newAnyOffFour=!data[i].micprotype_146 ?'' : '特征：'+data[i].micprotype_146.offline_num+'( '+(data[i].micprotype_146.offline_pre*100).toFixed(2)+'% )<br>';
                tipOffline[i] +=newAnyOffOne + newAnyOffTwo + newAnyOffThree + newAnyOffFour;
   
                tipAbnormals[i]=(data[i].abnormals_pre*100).toFixed(2)+'% )<br>';
                let newAnyAbsOne=!data[i].micprotype_120 ?'' : '网吧：'+data[i].micprotype_120.abnormals_num+'( '+(data[i].micprotype_120.abnormals_pre*100).toFixed(2)+'% )<br>';
                let newAnyAbsTwo=!data[i].micprotype_145 ?'' : 'WIFI：'+data[i].micprotype_145.abnormals_num+'( '+(data[i].micprotype_145.abnormals_pre*100).toFixed(2)+'% )<br>';
                let newAnyAbsThree=!data[i].micprotype_123 ?'' : '非经：'+data[i].micprotype_123.abnormals_num+'( '+(data[i].micprotype_123.abnormals_pre*100).toFixed(2)+'% )<br>';
                let newAnyAbsFour=!data[i].micprotype_146 ?'' : '特征：'+data[i].micprotype_146.abnormals_num+'( '+(data[i].micprotype_146.abnormals_pre*100).toFixed(2)+'% )<br>';
                tipAbnormals[i] +=newAnyAbsOne + newAnyAbsTwo + newAnyAbsThree + newAnyAbsFour;
        
        } 

        option = {
            tooltip: {
               // triggerOn:'click',
                trigger: 'item',
                formatter:function(param){
                    let  str=param.name+'<br>场所'+param.seriesName+'<br>总量：'+param.value+"( ";
                    if(param.seriesName=='在线数'){
                        str+=tipOnline[param.dataIndex];
                    }else if(param.seriesName=='离线数'){
                        str+=tipOffline[param.dataIndex];
                    }else{
                        str+=tipAbnormals[param.dataIndex];
                    }
                    return str;
                }                                 
            },
            legend: {
                orient : 'horizontal',  
                textStyle: {  
                        fontSize: 13,
                }, 
                data:['在线数','异常数','离线数']  
            },
            grid:{	//设置图标距离
                left: 50,
                right: 50,
            },            
            xAxis: {

                type: 'category',
                data: time
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name:"在线数",
                itemStyle: {
                    normal: {
                        color:'#85C226'
                    }
                },
                data: inLineData,
                type: 'bar'
            },
            {
                name:"异常数",
                itemStyle: {
                    normal: {
                        color:'#F8C301'
                    }
                },                
                data: abnormalsData,
                type: 'bar'
            },
            {
                name:"离线数",
                itemStyle: {    
                    normal: {
                        color:'#728498'
                    }
                },                
                data: offLineData,
                type: 'bar'
            },
            ]
        };
        this.myOnOffBarChart.setOption(option);
       // this.myOnOffBarChart.resize();
      },
      //导出统计场所状态率
      ExportOnlineCount(){
          this.$store.dispatch(HisPercentageExport,{coll_type:this.collType}).then(res=>{
              if(!tool.msg(res,'','导出失败!'))return;
              window.location=res.biz_body.url;
          });
      },
      //查询按钮(搜索)
      query_click(){
        setTimeout(()=>{            
            this.data=[];
            this.blnSearch=true;
            this.blnLoading=true;
            this.pageNum= 0;
            this.query.skip=this.pageNum*this.query.limit;
          
            this.$store.dispatch(GetSiteList,this.query).then(res=>{
                this.blnSearch=false;
                this.blnLoading=false;
                if(!tool.msg(res,'','搜索失败!'))return;
                this.data=res.biz_body;
                this.allTotall=res.page?res.page.total:null;
                this.pageSize=res.page?res.page.page_size:null;
            });
        },400)
      },
      //查询按钮(搜索)问题总览
      queryProblem_click(){
          //this.data=[];
          //this.blnSearch=true;
          //this.blnLoading=true;
          this.pageNumProblem= 0;
          this.queryProblem.skip=this.pageNumProblem*this.queryProblem.limit;
          this.$store.dispatch(siteScoreCollect,this.queryProblem).then(res=>{
              //this.blnSearch=false;
              //this.blnLoading=false;
              if(!tool.msg(res,'','搜索失败!'))return;
              this.dataProblem=res.biz_body;
          });
      },  
      //页码切换(分页)
      pageChange(index){
          this.pageNum=index>0? index : 0;
          this.query.skip=this.pageNum*this.query.limit;
          this.$store.dispatch(GetSiteList,this.query).then(res=>{
            if(!tool.msg(res))return;
            let data=res.biz_body;
            if(data.length<=0){
                tool.msg({msg:{code:'successed'}},'已经到了最后页!','已经到了最后页!');
                this.pageNum =this.pageNum-1;
                return;
            }

            this.data=data;
            this.allTotall=res.page?res.page.total:null;
            this.pageSize=res.page?res.page.page_size:null;
          });
      },
      //页码切换(问题总览)
      pageProblemChange(index){ 
          this.pageNumProblem=index>0? index : 0;
          this.queryProblem.skip=this.pageNumProblem*this.queryProblem.limit;
          this.$store.dispatch(siteScoreCollect,this.queryProblem).then(res=>{
            if(!tool.msg(res))return;
            let data=res.biz_body;
            if(data.length<=0){
                tool.msg({msg:{code:'successed'}},'已经到了最后页!','已经到了最后页!');
                this.pageNumProblem =this.pageNumProblem-1;
                return;
            }
            this.dataProblem=data;
          });
      },       
      //查看详情
      searchSiteDetail(siteId,type){
            let self=this;
            tool.open(function(){
                // 网吧和非网吧分开  html1：网吧    html2：非网吧
                let html1=`<div name="container" style="width:100%;height:100%;padding: 10px;" >
                            <!--加载中标识-->
                            <div v-if="detaillnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 10px;font-size: 50px;">
                                <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
                            </div>
                            <div style="width:100%;height:100%" v-if="!detaillnLoading">
                                <div  class="row">
                                    <div class="col-md-12 item_label_left item_label_title">场所信息：</div>
                                </div>
                                <div class="row site-detail-row">
                                    <div class="col-md-2 item_label_left">场所名称：</div>
                                    <div class="col-md-4">{{detailData.netbar_name}}</div>
                                    <div class="col-md-2 item_label_right">场所编码：</div>
                                    <div class="col-md-4">{{detailData.netbar_wacode}}</div>                                
                                </div>
                                <div class="row site-detail-row">
                                    <div class="col-md-2 item_label_left">营业状态：</div>
                                    <div class="col-md-4">{{detailData.business_state}}</div>
                                    <div class="col-md-2 item_label_right">场所状态：</div>
                                    <div class="col-md-4">{{detailData.online_state}}</div>                                
                                </div>
                                <div class="row site-detail-row">
                                    <div class="col-md-2 item_label_left">上网方式：</div>
                                    <div class="col-md-4">{{detailData.connect_mode  }}</div>
                                    <div class="col-md-2 item_label_right">申报IP：</div>
                                    <div class="col-md-4">{{detailData.access_ip}}</div>                                
                                </div>
                                <div class="row site-detail-row">
                                    <div class="col-md-2 item_label_left">终端状况：</div>
                                    <div class="col-md-4">申报终端：{{detailData.net_terminal_num}}/检测终端：{{detailData.actual_terminal}}/在线终端：{{detailData.internet_users}}</div>
                                    <div class="col-md-2 item_label_right">最近联系时间：</div>
                                    <div class="col-md-4">{{detailData.capture_time_desc}}</div>                                
                                </div>
                                <div class="row site-detail-row">
                                    <div class="col-md-2 item_label_left">所属派出所：</div>
                                    <div class="col-md-4">{{detailData.policestation_name}}</div>
                                    <div class="col-md-2 item_label_right">所属地区：</div>
                                    <div class="col-md-4">{{detailData.region_name}}</div>                                
                                </div>     
                                <div  class="row">
                                    <div class="col-md-12 item_label_left item_label_title">场所负责人：</div>
                                </div>                                                                                  
                                <div class="row site-detail-row">
                                    <div class="col-md-2 item_label_left">法人姓名：</div>
                                    <div class="col-md-2">{{detailData.law_principal_name}}</div>
                                    <div class="col-md-1 item_label_right">证件号:</div>
                                    <div class="col-md-3">{{detailData.law_principal_certificate_id}}</div>     
                                    <div class="col-md-2 item_label_left">联系电话：</div>
                                    <div class="col-md-2">{{detailData.law_principal_tel}}</div>                           
                                </div>
                                <div class="row site-detail-row">
                                    <div class="col-md-2 item_label_right">信息安全员：</div>
                                    <div class="col-md-2">{{detailData.infoman_name}}</div> 
                                    <div class="col-md-1 item_label_left">证件号:</div>
                                    <div class="col-md-3">{{detailData.infoman_certificate_id}}</div>
                                    <div class="col-md-2 item_label_right">联系电话：</div>
                                    <div class="col-md-2">{{detailData.infoman_tel}}</div>                                  
                                </div>
                                <div  class="row">
                                    <div class="col-md-12 item_label_left item_label_title">所属网监：</div>
                                </div>     
                                <div class="row site-detail-row">
                                    <div class="col-md-2 item_label_left">所属网监部门：</div>
                                    <div class="col-md-2">{{detailData.wa_department}}</div>   
                                    <div class="col-md-2 item_label_left">网监负责人：</div>
                                    <div class="col-md-2">{{detailData.supervisor}}</div>
                                    <div class="col-md-2 item_label_left">联系电话：</div>
                                    <div class="col-md-2">{{detailData.supervisor_tel_tel}}</div>                                     
                                </div>
                                <div  class="row">
                                    <div class="col-md-12 item_label_left item_label_title">所属厂商：</div>
                                </div>                                   
                                <div class="row site-detail-row">
                                    <div class="col-md-2 item_label_right">所属厂商：</div>
                                    <div class="col-md-2">{{detailData.security_software_orgname}}</div>       
                                    <div class="col-md-2 item_label_left">厂商负责人：</div>
                                    <div class="col-md-2">{{detailData.contactor}}</div>     
                                    <div class="col-md-2 item_label_right">联系电话：</div>
                                    <div class="col-md-2">{{detailData.contactor_tel}}</div>                    
                                </div>
                                <div id="siteMapOne" style="width:94%;height:200px;margin:0 auto;border:1px solid #aaa">
                                </div>
                            </div>
                        </div>`;
                let html2=`<div name="container" style="width:100%;height:100%;padding: 10px;" >
                            <!--加载中标识-->
                            <div v-if="detaillnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 10px;font-size: 50px;">
                                <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
                            </div>
                            <div style="width:100%;height:100%" v-if="!detaillnLoading">
                                <div  class="row">
                                    <div class="col-md-12 item_label_left item_label_title">场所信息：</div>
                                </div>
                                <div class="row site-detail-row">
                                    <div class="col-md-2 item_label_left">场所名称：</div>
                                    <div class="col-md-4">{{detailData.netbar_name}}</div>
                                    <div class="col-md-2 item_label_right">场所编码：</div>
                                    <div class="col-md-4">{{detailData.netbar_wacode}}</div>                                
                                </div>
                                <div class="row site-detail-row">
                                    <div class="col-md-2 item_label_left">营业状态：</div>
                                    <div class="col-md-4">{{detailData.business_state}}</div>
                                    <div class="col-md-2 item_label_right">场所状态：</div>
                                    <div class="col-md-4">{{detailData.online_state}}</div>                                
                                </div>
                                <div class="row site-detail-row">
                                    <div class="col-md-2 item_label_left">挂载设备：</div>
                                    <div class="col-md-4"><span style="color:green">在线：{{detailData.online_device}}</span>/<span style="color:red">异常：{{detailData.abnormal_device}}</span>/<span style="color:#000">离线：{{detailData.offline_device}}</span></div>
                                    <div class="col-md-2 item_label_right">最近联系时间：</div>
                                    <div class="col-md-4">{{detailData.capture_time}}</div>                                
                                </div>
                                <div class="row site-detail-row">
                                    <div class="col-md-2 item_label_left">经营性质：</div>
                                    <div class="col-md-4">{{detailData.business_nature}}</div>
                                    <div class="col-md-2 item_label_right">数据来源：</div>
                                    <div class="col-md-4">{{detailData.microprobe_type}}</div>                                
                                </div>
                                <div class="row site-detail-row">
                                    <div class="col-md-2 item_label_left">场所类型：</div>
                                    <div class="col-md-4">{{detailData.netsite_type}}</div>
                                    <div class="col-md-2 item_label_right">所属派出所：</div>
                                    <div class="col-md-4">{{detailData.policestation}}</div>                                
                                </div>     
                                <div  class="row">
                                    <div class="col-md-12 item_label_left item_label_title">网络接入信息：</div>
                                </div>                                                                                  
                                <div class="row site-detail-row">
                                    <div class="col-md-2 item_label_left">网络服务商：</div>
                                    <div class="col-md-2">{{detailData.access_servicecode}}</div>
                                    <div class="col-md-1 item_label_right" style="padding-left:0">接入方式:</div>
                                    <div class="col-md-3">{{detailData.connect_mode}}</div>     
                                    <div class="col-md-2 item_label_left">账号或IP：</div>
                                    <div class="col-md-2">{{detailData.access_ip}}&nbsp;&nbsp;&nbsp;&nbsp;{{detailData.auth_account}}</div>                           
                                </div>
                                <div  class="row">
                                    <div class="col-md-12 item_label_left item_label_title">场所负责人：</div>
                                </div>                                                                                  
                                <div class="row site-detail-row">
                                    <div class="col-md-2 item_label_left">法人姓名：</div>
                                    <div class="col-md-2">{{detailData.law_principal_name}}</div>
                                    <div class="col-md-1 item_label_right">证件号:</div>
                                    <div class="col-md-3">{{detailData.law_principal_certificate_id}}</div>     
                                    <div class="col-md-2 item_label_left">联系电话：</div>
                                    <div class="col-md-2">{{detailData.law_principal_tel}}</div>                           
                                </div>
                                <div  class="row">
                                    <div class="col-md-12 item_label_left item_label_title">所属厂商：</div>
                                </div>                                   
                                <div class="row site-detail-row">
                                    <div class="col-md-2 item_label_right">所属厂商：</div>
                                    <div class="col-md-2">{{detailData.security_software_orgname}}</div>       
                                    <div class="col-md-2 item_label_left">厂商负责人：</div>
                                    <div class="col-md-2">{{detailData.contactor}}</div>     
                                    <div class="col-md-2 item_label_right">联系电话：</div>
                                    <div class="col-md-2">{{detailData.contactor_tel}}</div>                    
                                </div>
                                <div id="siteMapOne" style="width:94%;height:200px;margin:0 auto;border:1px solid #aaa">
                                </div>                   
                            </div>
                        </div>`;
                let param={
                        title:'场所详情',
                        content:type=="网吧" ? html1 : html2,
                        skin:'site-detail-container',
                        area:['1000px','640px'],
                        context:{
                            detailData:{},
                            detaillnLoading:true,
                            map:null,
                            loadDetail(){
                                self.$store.dispatch(SiteDetail,{netbar_wacode:siteId}).then(res=>{
                                    if(res.msg.code!='successed')return;
                                    param.selfData.detaillnLoading=false;
                                    param.selfData.detailData=res.biz_body;
                                    param.selfData.detailData.capture_time = (param.selfData.detailData.capture_time && param.selfData.detailData.capture_time!='0') ? tool.DateByTimestamp(param.selfData.detailData.capture_time,'yyyy-MM-dd hh:mm:ss'):'无';
                                    
                                    self.$nextTick(()=>{
                                        let id=document.getElementById("siteMapOne");
                                        param.selfData.map = new BMap.Map(id,{enableMapClick:false,minZoom:13,maxZoom:18});          // 创建地图实例  
                                        let point = new BMap.Point(param.selfData.detailData.longitude, param.selfData.detailData.latitude);  // 创建点坐标                                          
                                        param.selfData.map.centerAndZoom(point, 13);                 // 初始化地图，设置中心点坐标和地图级别 
                                        param.selfData.map.enableScrollWheelZoom(true);              // 启动鼠标滚轮缩放
                                        let marker = new BMap.Marker(new BMap.Point(param.selfData.detailData.longitude, param.selfData.detailData.latitude)); // 创建点
                                        param.selfData.map.addOverlay(marker);                      //将点加入地图中
                                        let top_left_navigation = new BMap.NavigationControl({author:BMAP_NAVIGATION_CONTROL_ZOOM});  //左上角，添加默认缩放平移控件
                                        //param.selfData.map.addControl(top_left_navigation);   
                                        let opts = {
                                            width : 450,     // 信息窗口宽度
                                            height: 30,     // 信息窗口高度
                                            title : '场所地址：'+param.selfData.detailData.netbar_address , // 信息窗口标题
                                        }
                                        let infoWindow = new BMap.InfoWindow("经纬度："+param.selfData.detailData.longitude+' , '+param.selfData.detailData.latitude, opts);
                                        
                                        marker.addEventListener("click", function(){          
                                            param.selfData.map.openInfoWindow(infoWindow,point); //开启信息窗口
                                        });
                                    });

                                
                                
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
      //网吧挂终端，场所挂设备，这里进行分类处理
      moutType(siteId,name,type){
            if(type=="网吧"){
                this.mountTerminal(siteId,name);                
            }else{
                this.mountDevice(siteId,name);
            }
      },
      //挂在设备详情
      mountDevice(siteId,name){
            let self=this;
            tool.open(function(){
                let html=`<div name="container" style="width:100%;height:100%;padding: 10px;" >
                            <!--加载中标识-->
                            <div v-if="DeviceblnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;">
                                <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
                            </div>
                            <div class="mount-table">
                                <div class="header">
                                    <div class="mount_item" ><span class="overflow" style="width:180px;">设备编码</span></div>
                                    <div class="mount_item" ><span class="overflow" style="width:130px;">设备名称</span></div>
                                    <div class="mount_item" ><span class="overflow" style="width:70px;">设备状态</span></div>
                                    <div class="mount_item" ><span class="overflow" style="width:150px;">最近联系时间</span></div>
                                    <div class="mount_item" ><span class="overflow" style="width:80px;">数据来源</span></div>
                                    <div class="mount_item" ><span class="overflow" style="width:113px;">安全厂商</span></div>
                                    <div class="mount_item" v-if="deviceData.length>=9"><span class="overflow" style="width:6px;"></span></div>
                                </div>
                                <div class="content" style="height: 393px;overflow-y: auto;">
                                    <div v-if="deviceData.length<=0&&!DeviceblnLoading" class="content">
                                        <div class="mount_item"><span class="overflow" style="width:785px;">暂无数据</span></div>
                                    </div>
                                    <div v-for="(d,i) in deviceData" class="content">
                                        <div class="mount_item" :title="d.equipment_id"><span class="overflow" style="width:180px;">{{d.equipment_id}}</span></div>
                                        <div class="mount_item" :title="d.equipment_name"><span class="overflow" style="width:130px;">{{d.equipment_name}}</div>
                                        <div class="mount_item" :title="d.online_state" :class="[{red : d.online_state=='异常'},{green : d.online_state=='在线'}]"><span class="overflow" style="width:70px;">{{d.online_state}}</span></div>
                                        <div class="mount_item" :title="d.capture_time"><span class="overflow" style="width:150px;">{{d.capture_time}}</span></div>
                                        <div class="mount_item" :title="d.microprobe_type"><span class="overflow" style="width:80px;">{{d.microprobe_type}}</span></div>
                                        <div class="mount_item" :title="d.security_software_orgname"><span class="overflow" style="width:113px;">{{d.security_software_orgname}}</span></div>                               
                                    </div>
                                </div>
                            </div>
                        </div>`;
                let param={
                        title:'挂载设备详情（'+name+'）',
                        content:html,
                        skin:'device-detail-container',
                        area:['836px','500px'],
                        components:{Scroll},
                        context:{
                            deviceData:"",
                            DeviceblnLoading:true,   //加载中标识
                            data:[],
                            loadDevice(data){
                                self.$store.dispatch(GetSiteDeviceList,data).then(res=>{
                                    if(res.msg.code!='successed')return;
                                    param.selfData.DeviceblnLoading=false;
                                    param.selfData.deviceData= res.biz_body;
                                    for( let ary of param.selfData.deviceData){
                                       ary.capture_time=(ary.capture_time&&ary.capture_time!='0') ? tool.DateByTimestamp(ary.capture_time,'yyyy-MM-dd hh:mm:ss'):"无";
                                   };

                                });
                            }
                        },
                        success(){
                            param.selfData.loadDevice({netbar_wacode:siteId});
                        }
                    };

                return param;
            }());                 
      },
      //挂在终端详情
      mountTerminal(siteId,name){
            let self=this;
            tool.open(function(){
                let html=`<div name="container" style="width:100%;height:100%;padding: 10px;" >
                            <!--加载中标识-->
                            <div v-if="DeviceblnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;">
                                <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
                            </div>
                            <div class="mount-table">
                                <div class="header">
                                    <div class="mount_item" ><span class="overflow" style="width:80px;">证件类型</span></div>
                                    <div class="mount_item" ><span class="overflow" style="width:160px;">证件号</span></div>
                                    <div class="mount_item" ><span class="overflow" style="width:80px;">姓名</span></div>
                                    <div class="mount_item" ><span class="overflow" style="width:100px;">终端IP</span></div>
                                    <div class="mount_item" ><span class="overflow" style="width:170px;">终端MAC</span></div>
                                    <div class="mount_item" ><span class="overflow" style="width:40px;">民族</span></div>
                                    <div class="mount_item" ><span class="overflow" style="width:120px;">地址</span></div>
                                    <div class="mount_item" ><span class="overflow" style="width:153px;">采集时间</span></div>
                                    <div class="mount_item" ><span class="overflow" style="width:60px;">终端状态</span></div>
                                    <div class="mount_item" v-if="deviceData.length>=9"><span class="overflow" style="width:6px;"></span></div>
                                </div>
                                <div class="content" style="height: 393px;overflow-y: auto;">
                                    <div v-if="deviceData.length<=0&&!DeviceblnLoading" class="content">
                                        <div class="mount_item"><span class="overflow" style="width:1059px;">暂无数据</span></div>
                                    </div>
                                    <div v-for="(d,i) in deviceData" class="content">
                                        <div class="mount_item" :title="d.certificate_type"><span class="overflow" style="width:80px;">{{d.certificate_type}}</span></div>
                                        <div class="mount_item" :title="d.certificate_code"><span class="overflow" style="width:160px;">{{d.certificate_code}}</div>
                                        <div class="mount_item" :title="d.customer_name" ><span class="overflow" style="width:80px;">{{d.customer_name}}</span></div>
                                        <div class="mount_item" :title="d.terminal_ip"><span class="overflow" style="width:100px;">{{d.terminal_ip}}</span></div>
                                        <div class="mount_item" :title="d.terminal_mac"><span class="overflow" style="width:170px;">{{d.terminal_mac}}</span></div>
                                        <div class="mount_item" :title="d.nation"><span class="overflow" style="width:40px;">{{d.nation}}</span></div>
                                        <div class="mount_item" :title="d.address"><span class="overflow" style="width:120px;">{{d.address}}</span></div>
                                        <div class="mount_item" :title="d.capture_time"><span class="overflow" style="width:153px;">{{d.capture_time}}</span></div>                               
                                        <div class="mount_item" :title="d.terminal_state"><span class="overflow" style="width:60px;">{{d.terminal_state}}</span></div>                                    
                                    </div>
                                </div>
                            </div>
                        </div>`;
                let param={
                        title:'终端列表（'+name+'）',
                        content:html,
                        skin:'device-detail-container',
                        area:['1112px','500px'],
                        components:{Scroll},
                        context:{
                            deviceData:"",
                            DeviceblnLoading:true,   //加载中标识
                            data:[],
                            loadDevice(data){
                                self.$store.dispatch(GetSiteTerminalList,data).then(res=>{
                                    if(res.msg.code!='successed')return;
                                    param.selfData.DeviceblnLoading=false;
                                    param.selfData.deviceData= res.biz_body;
                                    for( let ary of param.selfData.deviceData){
                                       ary.capture_time=(ary.capture_time&&ary.capture_time!='0') ? tool.DateByTimestamp(ary.capture_time,'yyyy-MM-dd hh:mm:ss'):"无";
                                   };

                                });
                            }
                        },
                        success(){
                            param.selfData.loadDevice({netbar_wacode:siteId});
                        }
                    };

                return param;
            }());                 
      },
      //数据采集趋势
      dataStatus(siteId,name,type){
             let self=this;            
            tool.open(function(){
                let html=`<div name="container" style="width:100%;height:100%;padding: 10px;">
                            <div class="tit-row">
                                <div class="bar tit-bars" :class="isStateNo=='1'? 'active':''" @click="changeStatus('1')">采集趋势</div>
                                <div class="bar tit-bars" :class="isStateNo=='2'? 'active':''" @click="changeStatus('2')">采集详情</div>
                            </div>
                            <!--加载中标识-->
                            <div v-if="DeviceblnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 10px;font-size: 50px;">
                                <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
                            </div>
                            <div style="width:100%;height:100%;border-top: 1px solid #ccc;" class="data-row" >
                                <div class="tda-ert">
                                    <div class="lefts" v-show="isStateNo=='1'">
                                        <span>昨日采集：{{yesCollect}}</span>
                                        <span>累计采集：{{allCollect}}</span>
                                    </div>
                                    <div class="lefts" style="font-size:18px;margin:0 15px" v-show="isStateNo=='2'">
                                        <div class="el-tooltip item" title="昨日采集详情" :class="chartType=='bar'? 'active':''" @click="yesOrHisFun('bar')">
                                                <div class="el-tooltip__rel" ><i class="fa fa-area-chart"></i></div>
                                        </div>&nbsp; &nbsp;
                                        <div class="el-tooltip item" title="历史采集详情" :class="chartType=='line'? 'active':''" @click="yesOrHisFun('line')">
                                            <div class="el-tooltip__rel"><i class="fa fa-line-chart"></i></div>
                                        </div>
                                    </div>                                    
                                    <div class="rights" v-show="isStateNo=='1'">                                       
                                        <div class="sele-time" @click="changeline('week')" :class="{active: viewTime=='week'}">近一周</div>
                                        <div class="sele-time" @click="changeline('month')" :class="{active: viewTime=='month'}">近一月</div>
                                    </div>
                                    <div class="rights" v-show="isStateNo=='2'&&chartType=='line'">                                       
                                        <div class="sele-time" @click="changelineDetail('week')" :class="{active: viewLineTime=='week'}">近一周</div>
                                        <div class="sele-time" @click="changelineDetail('month')" :class="{active: viewLineTime=='month'}">近一月</div>
                                    </div>                                    
                                </div>
                                <div style="width:880px;height:400px;background-color:#eee" id="statusChar"  v-show="isStateNo=='1'"></div>
                                <div style="width:880px;height:400px;background-color:#eee" id="statusChar1" v-show="isStateNo=='2'&&chartType=='bar'"></div>
                                <div style="width:880px;height:400px;background-color:#eee" id="statusChar2" v-show="isStateNo=='2'&&chartType=='line'"></div>
                            </div>                        
                        </div>`;
                let param={
                    title:'数据采集趋势（'+name+'）',
                    content:html,
                    skin:'status-detail-container',
                    area:['900px','530px'],
                    context:{
                        pages:[{name:'手动添加',icon:'fa fa-tag'},{name:'批量导入',icon:'fa fa-tag',disable:false,tip:''}],
                        xData:[],
                        sginData:[],
                        allCollect:"",
                        yesCollect:"",
                        viewTime:"week",         //近一月与近一周的切换(采集趋势)
                        viewLineTime:"week",         //近一月与近一周的切换(采集详情)
                        chartType:"bar",         //采集详情中柱状图与折线图的切换标识
                        isStateNo:"1",          //采集趋势与采集详情的切换标识
                        DeviceblnLoading:true,  //加载中标识
                        lineHistoryChart:"",           //绘制采集详情折线图(历史详情)
                        //采集详情中与采集趋势
                        changeStatus(val){
                            if(val== param.selfData.isStateNo) return;
                             param.selfData.isStateNo=val;
                        },
                        //采集趋势中的近一月和近一周切换
                        changeline(val){
                            if(val== param.selfData.viewTime) return;
                            param.selfData.viewTime = val;
                            param.selfData.thisShowData()
                        },
                        //采集详情中的近一月和近一周切换
                        changelineDetail(val){
                            if(val== param.selfData.viewLineTime) return;
                            param.selfData.viewLineTime = val;
                            param.selfData.thisShowYesterDayLine();
                        },
                        //采集详情中的昨日与历史采集详情相互切换
                        yesOrHisFun(val){
                            if(val== param.selfData.chartType) return;
                            param.selfData.chartType = val;
                        },                        
                        editDate(val){
                            let times =val.substr (0,4)+"-"+val.substr (4,2)+"-"+val.substr (6,2);
                            return times
                        },
                        // 绘制采集详情柱状图(昨日详情)
                        thisShowYesterDayBar(){ 
                            var barChart=echarts.init(document.getElementById('statusChar1'));                             
                            self.$store.dispatch(siteDetectYesterday,{netbar_wacode:siteId,microprobe_type:type}).then(res=>{
                                if(res.msg.code!='successed')return;
                                let yesterday=res.biz_body;
                                var xZData=[],numData=[];
                                for( let ary of yesterday){
                                    xZData.push(ary.title)
                                    numData.push(ary.count)
                                };
                                option = {
                                    title: {
                                        text: '昨日采集详情',
                                        x : 20, 
                                        y :5, 
                                        textStyle: {  
                                            fontSize: 15,
                                            fontWeight:700,
                                        }, 
                                    },                                    
                                    tooltip: {
                                        trigger: 'axis',
                                        axisPointer: {
                                            type: 'shadow',
                                            label: {
                                                    show: true
                                            }
                                        }                   
                                    },
                                    grid:{	//设置图标距离
                                        left: 60,
                                        right: 40,
                                        y:45
                                    },            
                                    xAxis: {

                                        type: 'category',
                                        data: xZData
                                    },
                                    yAxis: {
                                        type: 'value'
                                    },
                                    series: [{
                                        name:"采集数",
                                        itemStyle: {
                                            normal: {
                                                color:'#42ABDF'
                                            }
                                        },
                                        data: numData,
                                        type: 'bar'
                                      },
                                    ]
                                };
                                barChart.setOption(option);
                            })
                        },
                        // 绘制采集详情折线图(历史详情)
                        thisShowYesterDayLine(){
                             param.selfData.DeviceblnLoading=true;
                            // document.getElementById('statusChar2').html("");
                            param.selfData.lineHistoryChart=echarts.init(document.getElementById('statusChar2'));                            
                             self.$store.dispatch(siteDetectHistory,{netbar_wacode:siteId,coll_type:param.selfData.viewLineTime,microprobe_type:type}).then(res=>{
                                if(res.msg.code!='successed')return;
                                param.selfData.DeviceblnLoading=false;
                                let allHistoryData=res.biz_body;
                                let time=[],allData=[],firmNames=[];
                                //获取所有类型
                                for(let i=0;i<allHistoryData[0].coll.length;i++){
                                    firmNames.push(allHistoryData[0].coll[i].title);           
                                    allData.push({
                                        name: allHistoryData[0].coll[i].title,
                                        type: 'line',
                                        data: [],
                                        itemStyle: {
                                            normal: {
                                                label: {
                                                    formatter: '{c}%'
                                                }
                                            }
                                        }                
                                    })
                                }
                                for(let i=0;i<allHistoryData.length;i++){
                                    time.push(allHistoryData[i].date.substr (0,4)+"-"+allHistoryData[i].date.substr (4,2)+"-"+allHistoryData[i].date.substr (6,2));
                                    for(let j=0;j<allHistoryData[i].coll.length;j++){
                                        allData[j].data.push((allHistoryData[i].coll[j].count))
                                    }
                                }
                                option = {      
                                    title: {
                                        text: '历史采集详情',
                                        textStyle: {  
                                            fontSize: 15,
                                            fontWeight:700,
                                        }, 
                                    },                       
                                    tooltip: {
                                        trigger: 'axis',
                                        formatter:function(param){
                                            let str='';
                                            _.each(param,p=>{
                                                str+=`${p.seriesName}:${p.data}<br>`
                                            });
                                            return str;
                                        }
                                    },
                                    legend: {
                                        orient : 'horizontal',  
                                        y:20,
                                        textStyle: {  
                                            fontSize: 13,
                                        }, 
                                        data:firmNames  
                                    },
                                    xAxis: {
                                        type: 'category',
                                        boundaryGap: false,
                                        data:  time
                                    },
                                    grid:{	//设置图标上面和下面的距离
                                        left: 60,
                                        right: 40,
                                        y:75
                                    },
                                    yAxis: {
                                        type: 'value',     
                                        //name: '历史采集详情',               
                                        xisLabel: {
                                            formatter: '{value}'
                                        },
                                        axisLabel: {
                                            formatter: '{value} '
                                        },
                                        axisPointer: {
                                            snap: true
                                        }
                                    },
                                    series:allData
                                };                               
                                param.selfData.lineHistoryChart.setOption(option);
                            });
                        },  
                        // 绘制采集趋势折线图
                        thisShowData(){
                             param.selfData.DeviceblnLoading=true;
                            var lineChart=echarts.init(document.getElementById('statusChar'));                            
                             self.$store.dispatch(SiteDetectColl,{netbar_wacode:siteId,coll_type:param.selfData.viewTime}).then(res=>{
                                if(res.msg.code!='successed')return;
                                param.selfData.DeviceblnLoading=false;
                                let allData=res.biz_body;
                                param.selfData.allCollect =allData.total_num ? allData.total_num : '0';
                                param.selfData.yesCollect =allData.last_num ? allData.last_num : '0';
                                param.selfData.xData=[];
                                param.selfData.sginData=[];
                                for( let ary of allData.chart){
                                    param.selfData.xData.push(param.selfData.editDate(ary.stat_date))
                                    param.selfData.sginData.push(ary.detect_num)
                                 };
                                option = {                           
                                    tooltip: {trigger: 'axis',},
                                    xAxis: {
                                        type: 'category',
                                        boundaryGap: false,
                                        data:  param.selfData.xData
                                    },
                                    grid:{	//设置图标上面和下面的距离
                                        left: 60,
                                        right: 40,
                                        y:45
                                    },
                                    yAxis: {
                                        type: 'value',                    
                                        xisLabel: {
                                            formatter: '{value} W'
                                        },
                                        axisPointer: {
                                            snap: true
                                        }
                                    },
                                    series: [{
                                        name:"采集数",
                                        data:  param.selfData.sginData,
                                        type: 'line',
                                    }]
                                };                               
                                lineChart.setOption(option);
                            });
                        }                  
                    }, 
                    success(){
                        param.selfData.thisShowData();
                        param.selfData.thisShowYesterDayBar();
                        param.selfData.thisShowYesterDayLine();
                    }
                };
                return param;           
            }())
      },
      //问题总览列表与分析图表页面相互切换
      changeProblemFun(val){
          if(val){         
            setTimeout(()=>{
                this.$store.dispatch(siteScoreCollect,this.queryProblem).then(res=>{

                    if(!tool.msg(res,'','搜索失败!'))return;
                    this.dataProblem=res.biz_body;
                    this.problemTable='3';
                    setTimeout(()=>{
                        this.problemTable='1';    
                    },1000)
                    this.$nextTick(()=>{
                        this.$refs.ABC_problem.reloadyScroll();
                    });
                });
            },0)            
          }else{
            //    关闭问题总览列表是重置除异常分类外的其他条件
            this.queryProblem.limit=20;
            this.queryProblem.skip=0;
            this.queryProblem.region_range=[];                        
            this.queryProblem.netsite_range=[];
            this.queryProblem.security_software_orgcodes="";
            this.Selfirms=[];
            this.pageNumProblem=0;
            this.$refs.areaSel.clearBtn.click();
            this.$refs.siteSel.clearBtn.click();
            this.problemTable='5';
                setTimeout(()=>{
                    this.problemTable='0';    
                },1000) 
          }
      },
      //待处理场所列表与分析图表页面相互切换
      changeDealFun(val){
          if(val){                        
            setTimeout(()=>{
               // this.data=[];
               // this.blnSearch=true;
                //this.blnLoading=true;
                //this.pageNum= 0;
               // this.query.skip=this.pageNum*this.query.limit;
                this.$store.dispatch(siteScoreCollect,this.queryProblem).then(res=>{
                   // this.blnSearch=false;
                   // this.blnLoading=false;
                    if(!tool.msg(res,'','搜索失败!'))return;
                    this.dataProblem=res.biz_body;
                    this.problemTable='2';
                    this.$nextTick(()=>{
                        this.$refs.ABC_deal.reloadyScroll();
                    });
                });
            },40)            
          }else{
            this.problemTable='0';  
          }
      },
      //全选/取消全选
      selAll(){
        let s=this;
        if(s.blnAllSel){
            for(let i=0;i<s.data.length;i++){
                let index=_.findIndex(s.selIds,id=>id==s.data[i].netbar_wacode);
                if(index<0) continue;
                s.selIds.splice(index,1);
            }
        }else{
            for(let i=0;i<s.data.length;i++){
                let index=_.findIndex(s.selIds,id=>id==s.data[i].netbar_wacode);
                if(index>=0) continue;
                s.selIds.push(s.data[i].netbar_wacode);
            }
        }
      },
      //单选
      selItem(d){
        let index=_.findIndex(this.selIds,id=>id==d.netbar_wacode);
        if(index>=0){
            this.selIds.splice(index,1);
        }else{
            this.selIds.push(d.netbar_wacode);
        }
      },
      blnSelItem(d){
        return _.findIndex(this.selIds,id=>id==d.netbar_wacode)>=0;
      },
      exportList(){
        if(this.exportDataing) return;
        this.exportDataing=true;
        
            
        this.$store.dispatch(ExportSiteList,{
            netsite_type:this.query.netsite_type,           //场所类型
            netsite_state:this.query.netsite_state,         //场所状态
            microprobe_type:this.query.microprobe_type,     //数据来源&采集系统类型
            region_range:this.query.region_range,           //区域范围
            netsite_range:this.query.netsite_range,         //场所范围
            security_software_orgcodes:this.query.security_software_orgcodes,
            ids:this.selIds.join(',')
        }).then(res=>{
            this.exportDataing=false;
            if(!tool.msg(res,'导出成功!','导出失败!'))  return;

            window.location = res.biz_body.url;
        });
      }
  }
}
</script>
<style lang="less">
    /* 场所详情样式*/
   .site-detail-container .layui-layer-title{
        background-color: #03ab67;
        font-weight: 700;
        color:#fff;
    }
    .site-detail-container .site-detail-row{
        margin: 0px;
        line-height: 30px;

    }
    .site-detail-container .site-detail-row .item_label_left{
        text-align: right;

    }
    .site-detail-container .site-detail-row .item_label_left{
        text-align: right;

    }
    .site-detail-container .item_label_title{
        font-weight: 900;
        text-indent: 10px;
        line-height: 25px;
    }
    .site-detail-container .site-detail-row .item_label_right{
        text-align: right;

    }

    /*挂在设备详情*/
    .device-detail-container .layui-layer-title{
        background-color: #03ab67;
        font-weight: 700;
        color:#fff;
    }
    .device-detail-container .mount-table .header div{
        display: inline-block;
    }
    .device-detail-container .mount-table .header{
        display: table-row;
    }
    .device-detail-container .mount-table .header .mount_item{
        display: table-cell;
        font-weight: bolder;
        text-align: center;
        background-color: #E5E5E5;
        line-height: 30px;
        padding: 5px 5px;
        border: 1px solid #C9C9C9;
    }
    .device-detail-container .mount-table .header .mount_item .overflow{
        display: block;
    }
    .device-detail-container .mount-table .content .mount_item{
        display: table-cell;
        font-weight: normal;
        text-align: center;
        line-height: 30px;
        padding: 5px;
        border: 1px solid #C9C9C9;

    }
    .device-detail-container .red{color:red}
    .device-detail-container .green{color:green}
    .device-detail-container .mount-table .content .mount_item .overflow{
        width:100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        display: block;
    }


    /* 数据采集趋势*/
    .status-detail-container .layui-layer-title{
        background-color: #03ab67;
        font-size: 16px;
        color: #fff;
    }
    .status-detail-container .tit-row{
        height:30px;
        padding:0 10px;
        margin-bottom: 6px;
    }
    .status-detail-container .tit-row .tit-bars{
        display: inline-block;
        text-align: center;
        margin: 0px 5px;
        cursor: pointer;
        width: 73px;
        line-height: 25px;
        background-color: #fff;
        color: #000;
        border:1px solid #04AB66;
        border-radius: 6px;
    }

    .status-detail-container .tit-row .tit-bars:hover{
         background-color: #04AB66;
        color: #fff;
        border:1px solid #04AB66;        
    }
    .status-detail-container .tit-row .tit-bars.active{
        background-color: #04AB66;
        color: #fff;
        border:1px solid #04AB66;        
    }
    .status-detail-container .data-row div{
        display: inline-block;
    }
    .status-detail-container .data-row .tda-ert{
        width: 100%;
        margin: 10px 0 7px;
        padding: 0 15px;
        font-size: 12px;
    }
    .status-detail-container .data-row .lefts span{
        display: inline-block;
        margin-right: 40px;
        margin-left: 5px;
    }
    .status-detail-container .data-row .rights{
        float:right;
    }
    .status-detail-container .data-row .rights .sele-time{
        width: 66px;
        text-align: center;
        color: #333645;
        border-bottom: 2px solid #CCC;
        margin: 0 3px;
        cursor: pointer;
    }
    .status-detail-container .data-row .rights .sele-time:hover{
        border-bottom: 2px solid #04AB66;       
    }
    .status-detail-container .data-row .rights .sele-time.active{
        border-bottom: 2px solid #04AB66;       
    }
    .status-detail-container .data-row .el-tooltip:hover{
    cursor: pointer;
    color: #03ab67;
  }  
  .status-detail-container .data-row .el-tooltip.active{
    cursor: pointer;
    color: #03ab67;
  } 
</style>
<style scoped lang="less">
  @import "../css/variables.less";
  @rowH:40px;
  .stiepage{width:100%;height:100%;overflow:hidden;padding:5px;}
  .stiepage .CaseManage_container{width:100%;height:100%;}
  .stiepage .body,
  .stiepage .header{width: 100% !important;list-style: none;padding-left: 0px;padding: 0px;margin-bottom:0px;display:table;}
  .stiepage .body .item,
  .stiepage .header .item{line-height: @rowH;height: @rowH;text-align: left;margin: 0px;display: table-row;width: 100%;color: white;}
  
  html{.TCol(~".stiepage .header .item",'bg');}
  
  .stiepage .body .item > div,
  .stiepage .header .item > div{display: table-cell;.border('bottom');.border('right');padding: 0px 0px 0px 0px;vertical-align: middle;text-align:center;}

  .stiepage .body .item{background-color:white;color:@HeaderBgCol;}

  .stiepage .body .item .sep,
  .stiepage .header .item .sep{border-right:2px solid @FontCol;}
  .stiepage .body .item .option,
  .stiepage .header .item .option{width:120px;background-color: inherit;}
  .stiepage .body .item .count_item,
  .stiepage .header .item .count_item{width:80px;}

  .stiepage .body .item .option .overflow > span{border:none;font-size:12px;display: initial;margin-right:5px;}
  .stiepage .body .item .option .overflow > span:hover{cursor:pointer;}
  html{.TCol(~".stiepage .body .item .option .overflow > span:hover");}

  .stiepage .item .overflow{margin:0 auto;}
  .stiepage .body .item .align .overflow{text-align:left}
  .stiepage .body .item .overflow.sit-click{
      color:#03ab67;
      font-weight:bolder;
  }
 .stiepage .body .item .overflow.sit-click:hover{
      cursor:pointer;
      text-decoration:underline;
  }
  @optionH:50px;
  .stiepage .option{width:100%;background-color: white;}
  .stiepage .page_container{.border('top');.border('bottom');background-color:white;position: absolute;bottom: 2px; }
 .stiepage .content{width:100%;height:~'calc(100% - @{optionH} - 60px - 40px)';}
  .stiepage .content.tete{width:100%;height:~'calc(100% - @{optionH} - 60px - 60px)';}
  .stiepage .header .item .dropDown{position: absolute;z-index: 100;top: 35px;line-height: initial;margin-left: 5px;
        width: calc(100% - 10px);
        color: black;
        text-align:left;
        background-color: white;
        -moz-box-shadow: 2px 2px 2px #333333;
        -webkit-box-shadow: 2px 2px 2px #333333;
        box-shadow: 2px 2px 2px #333333;
        font-size: 12px;
  }

  .stiepage .header .item .dropDown div{.border('bottom');line-height:25px;padding:0px 10px;}
  .stiepage .header .item .dropDown div:hover{color:white;cursor:pointer;}
  html{.TCol(~".stiepage .header .item .dropDown div:hover",'bg');}

  .stiepage .header .item .title_content{position:relative;}

  .stiepage .option{text-align: initial;padding:10px;}
  .stiepage .option .item{display:inline-block;margin: 2px 0;}
  .stiepage .option .item .input{display:inline-block;}
  .stiepage .tag_label:hover{color:@btn_Bg_Col_hover_1;}

  .stiepage .body .item .count_item:hover{cursor:pointer;}
  html{.TCol(~".stiepage .body .item .count_item:hover");}

  .overflow{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display:block;}
  .stiepage .tagComp{
    height: 100%;
    width: 100%;
    padding: 2px 0px;
    text-align: left;
  }
  .stiepage .tagComp .item{
    display: inline-block;
    height: 100%;
    min-width: 50px;
    text-align: center;
    margin: 0px 5px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.35, 0.52, 0.33, 0.98) 0s;
  }
  .stiepage .tagComp .item.active{
  //  background-color: #03ab67;
    color: white;
    border-radius: 5px;
  }
  .stiepage .tagComp .item:hover{
    //background-color: #03ab67;
    color: white;
    border-radius: 5px;
  }
  html{.TCol(~".stiepage .tagComp .item.active",'bg');}
  html{.TCol(~".stiepage .tagComp .item:hover",'bg');}
  html{.TCol(~".stiepage .item el-button--primary",'bg');}
  .stiepage .tagComp .item .item_containner{
    display: table;
    height: 100%;
    width: 100%;
    padding: 0px 10px;
  }
  .stiepage .tagComp .item .item_container .content{
    display: table-cell;
    vertical-align: middle;
    padding: 5px 10px;
  }
  .stiepage .tagComp .item .item_container .content i{
    margin-right: 5px;
  }
  .stiepage .chart_container .his-row{
    height:40px;
    width:100%;      
  }
  .stiepage .chart_container .his-row div{
    display: inline-block;
  }   
  .stiepage .chart_container .his-row .his-title{
    float: left;
    margin-left: 30px;
    font-size: 19px;
    font-weight: 900;  
  }
  .stiepage .chart_container .his-row .drop_content div{
    display: block;
  }
  .stiepage .red{color:red}
  .stiepage .green{color:green}
  .stiepage .chart_container .his-row .his-term{
    float: left;
    margin-left: 60px;
    margin-bottom:5px;
  }
  .stiepage .chart_container .his-row .optionBar{
    float: right;
    margin-right: 30px;
  }
  .stiepage .chart_container .his-row .optionBar .el-tooltip{
    margin-right:10px;
  }
  .stiepage .chart_container .his-row .optionBar .el-tooltip:hover{
    cursor: pointer;
    color: #03ab67;
  }  
  .stiepage .chart_container .his-row .optionBar .el-tooltip.active{
    cursor: pointer;
    color: #03ab67;
  }  
  .stiepage .chart_container .analysis_list{
     height: calc(100%);
     width:100%;
     position:absolute;
    top:0px;

  }
  //不加载动画直接显示
  .stiepage .chart_container .analysis_list.noAnimateShow{
    top:0;      
    display: block;  
  }
  //不加载动画直接影藏
  .stiepage .chart_container .analysis_list.noAnimateHide{
   top:2000px;       
   display: none; 
  }
  /*加载动画，逐渐出现 */
  .stiepage .chart_container .analysis_list.animateShow{
    animation: startAit 1s;
    -moz-animation: startAit 1s;	/* Firefox */
    -webkit-animation: startAit 1s;	/* Safari 和 Chrome */
    -o-animation: startAit 1s;	/* Opera */
    top:0;
  }
    /*加载动画，逐渐消失 */
  .stiepage .chart_container .analysis_list.animateHide{
    animation: finishAit 1s;
    -moz-animation: finishAit 1s;	/* Firefox */
    -webkit-animation: finishAit 1s;	/* Safari 和 Chrome */
    -o-animation: finishAit 1s;	/* Opera */
    top:2000px;        //将这个值改为一个较大的数值，必须远超屏幕高度，用于做动画效果
  }
    .analysis_list .drag-info{
    height: 30px;
    width:100%;
    background-color:#eee;
  }
  html{.TCol(~".analysis_list .drag-info div",'bg');}
  .analysis_list .drag-info div{
    width: 100%;
    height: 100%;
    border-radius: 5px;
    text-align: center;
    color:#fff;
    line-height: 34px;
    cursor:pointer;
    font-Weight:800;
  }
    @keyframes startAit{
        0% {
            top:1000px;
            display:block;
        }
        100% {
            top:0px;
            display:block;
        }                
    }
    @keyframes  finishAit{
        0% {
            top:0;
            display:block;
        }
        100% {
            top:1000px;
            display:none;
        }                
    }


    .stiepage  .exportSel{cursor:pointer;}
    html{.TCol(~".stiepage .exportSel:hover");}
    html{.TCol(~".stiepage .exportSel.active");}
    html{.TCol(~".stiepage .exportBtn:hover");}
    .stiepage .cursor{cursor:pointer;}
</style>
