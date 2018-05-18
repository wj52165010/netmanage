export const UPDATE_TO_TITLE = 'UPDATE_TO_TITLE'//修改网站标题
export const UPDATE_TO_MAIN_CONTENT = 'UPDATE_TO_MAIN_CONTENT'//修改主页内容
export const BODY_RESIZE = 'BODY_RESIZE' //页面大小变化
export const BODY_RESIZE_REG = 'BODY_RESIZE_REG'//注入页面大小变化观察对象
export const Trigger_RESIZE='Trigger_RESIZE'    //触发页面大小改变事件
export const BODY_MOUSEMOVE='BODY_MOUSEMOVE' //页面鼠标移动事件
export const BODY_MOUSEMOVE_REG='BODY_MOUSEMOVE_REG'//注册页面鼠标移动事件
export const GetNewToken='GetNewToken' //获取新的Token信息

export const SetSource='SetSource' //设置原生数据源对象
export const SET_ALL_TABLE_DATA = 'SET_ALL_TABLE_DATA'//设置所有数据源表数据
export const SET_TABLE_DATA = 'SET_TABLE_DATA'//设置数据源表数据
export const SET_QUERY_FIELD = 'SET_QUERY_FIELD'//设置查询字段
export const SET_ORDER_FIELD = 'SET_ORDER_FIELD'//设置排序字段
export const GET_CONFIG = 'GET_CONFIG'//获取配置对象
export const Reg_Navigation_Func='Reg_Navigation_Func'//注册导航方法
export const Reg_Navigation_Refresh='Reg_Navigation_Refresh'//注册导航刷新
export const PageRefresh='PageRefresh'//页面刷新方法
export const Nav_Page='Navigation_Page'//导航页面
export const Nav_Page_Switch='Nav_Page_Switch' //导航页面切换
export const Reg_Page_Switch='Reg_Page_Switch' //注册页面切换监听
export const Trigger_Page_Switch='Trigger_Page_Switch'//触发页面切换事件
export const Reg_Del_Nav_Func='Reg_Del_Nav_Func'//注册删除导航方法
export const Del_Nav_Page='Del_Nav_Page'//删除导航页面
export const Del_PlaceMenu='Del_PlaceMenu' //删除场所菜单
export const Reg_Add_History_Menu_Func='Reg_Add_History_Menu_Func'//注册添加历史菜单方法
export const Add_History_Menu='Add_History_Menu'//添加历史菜单
export const Set_Menus='Set_Menus' //设置菜单集合数据
export const Set_Menu='Set_Menu'   //设置当前操作菜单项数据
export const Clear_Menu='Clear_Menu' //清空当前操作菜单项数据
export const Menu_Sort='Menu_Sort' //菜单排序(批量修改)
export const SetMenuPageGo='SetMenuPageGo'
export const SaveMenu='SaveMenu'//保存菜单相关配置

export const Set_System_Menus='Set_System_Menus' //设置系统菜单集合
export const Add_System_Menus='Add_System_Menus' //增加系统菜单集合
export const RSet_System_Menus='RSet_System_Menus' //重置系统菜单集合

export const Set_Source_data='Set_Source_data'  //设置数据源页面数据
export const Set_Show_data='Set_Show_data'      //设置显示页面数据
export const Set_Handle_data='Set_Handle_data'  //设置操作页面数据

export const Reg_Menu_Change='Reg_Menu_Change' //注册菜单数据改变对象
export const Reg_Menu_Change_Even='Reg_Menu_Change_Even' //注册菜单数据改变事件
export const Reg_Del_Menu_Even='Reg_Del_Menu' //注册删除菜单事件
export const Sub_Del_Menu='Sub_Del_Menu'//订阅删除菜单事件
export const Trigger_Del_Menu='Trigger_Del_Menu' //触发删除菜单事件

export const Set_Conifg='Set_Conifg' //设置配置对象

export const DynamicData='dynamicData' //获取动态数据
export const Date_Source='DateSource' //获取数据源集合
export const Create_Operate='Create_Operate' //创建自定义模块
export const Update_Operate='Update_Operate' //修改自定义模块
export const Set_Operate='Set_Operate' //设置自定义模块
export const Get_Operate='Get_Operate' //获取自定义模块
export const Get_OPerate_Data='Get_OPerate_Data' //获取自定义模块数据
export const get_OPerate_Data='get_OPerate_Data' //配置模块获取自定义数据
export const Get_Place_Count='Get_Place_Count' //获取场所统计数据(场所描点插件使用)

export const Reg_Data_Source_Change='Reg_Data_Source_Change' //注册数据改变事件对象
export const Data_Change='Data_Change' //监听数据源改变事件
export const Reg_Date_Source_Del='Date_Source_Del'  //注册数据源删除事件监听对象
export const Reg_Date_Source_Del_Even='Reg_Date_Source_Del_Even' //注册数据源删除事件
export const AnalyRateCount='AnalyRateCount' //同行频次统计


export const verifySet='verifySet'//验证模块数据

export const Reg_fieldChange_Even='Reg_fieldChange' //注册字段项改变事件
export const Field_Change='Field_Change'    //字段项改变

export const Reg_Rx='Reg_Rx' //注册Rx对象


export const GET_PLACE='GET_PLACE'   //获取场所信息
export const SearchRangeSites='SearchRangeSites' //地图查找范围内场所
export const GetSitesInfoByInfo='GetSitesInfoByInfo'//根据编码/中文/拼音/字母获取场所信息
export const SearchExact='SearchExact' //场所选择控件-精确查询
export const GetVirType='GetVirType' //获取虚拟身份类型


export const AddData='AddData' //添加数据
export const UpdateData='UpdateData' //修改数据
export const DelData='DelData' //删除数据
export const ExportData='ExportData' //导出数据

export const DelMenu='DelMenu'//删除指定菜单集合中的菜单数据


/*用户组*/
export const GetGroup='GetGroup'//获取用户组
export const AddGroup='AddGroup'//增加用户组
export const UpdateGroup='UpdateGroup'//修改用户组
export const DelGroup='DelGroup'//删除用户组

/*用户*/
export const GetUser='GetUser' //获取用户
export const AddUser='AddUser' //新增用户
export const UpdateUser='UpdateUser' //修改用户
export const DelUser='DelUser'  //删除用户
export const GetDepartments='GetDepartments' //获取用户部门信息

/*策略布控*/
export const AddPolicy='AddPolicy' //创建审计策略
export const GetPolicy='GetPolicy' //获取审计策略
export const DelPolicy='DelPolicy' //删除审计策略
export const GetPolicyDetail='GetPolicyDetail' //获取审计策略详细

/*案件*/
export const AddCase='AddCase' //创建案件
export const UpdateCase='UpdateCase' //修改案件
export const DelCase='DelCase' //删除案件
export const GetCase='GetCase' //获取案件

/*重点人员类型 */
export const AddIdentity='AddIdentity' //增加重点人员类型
export const UpdateIdentity='UpdateIdentity' //修改重点人员类型
export const GetIndentity='GetIndentity' //获取重点人员类型
export const DelIndentity='DelIndentity' //删除重点人员类型

/*重点人员 */
export const AddIdenPerson='AddIdenPerson' //增加重点人员
export const UpdateIdenPerson='UpdateIdenPerson' //重点人员修改
export const DelIdenPerson='DelIdenPerson' //删除重点人员
export const GetIdenPerson='GetIdenPerson' //获取重点人员
export const GetIdenPersonDetail='GetIdenPersonDetail' //获取重点人员详细

/* 分析任务 */
export const AddAnalyTask='AddAnalyTask' //增加分析任务
export const DelAnalyTask='DelAnalyTask' //删除分析任务
export const GetAnalyTask='GetAnalyTask' //获取分析任务
export const GetAnalyTaskData='GetAnalyTaskData' //获取分析任务数据
export const GetAnalyTaskMore='GetAnalyTaskMore' //获取分析任务数据详情更多
export const SecondCrashTask='secondCrashTask'//添加二次碰撞条件
export const delSecondCrash='delSecondCrash' //删除二次碰撞条件
export const RelationSecond='RelationSecond' //获取关联分析二次查询结果

/* 获取虚拟身份类型 */
export const VirType='VirType' //获取虚拟身份类型
export const RegVirType='RegVirType' //注册虚拟身份类型

/* 快搜 */
export const Search='Search'//快搜
export const AddSearch='AddSearch' //新增快搜
export const GetSearch='GetSearch' //获取快搜
export const DelSearch='DelSearch' //删除快搜
export const UpdateSearch='UpdateSearch' //修改快搜
export const UseSearch='UseSearch' //设置默认使用快搜
export const PreviewSearch='PrevieWSearch' //快搜预览数据
export const DataSearch='DataSearch' //快搜数据

/* 报警手机 */
export const AddAlarmMobile='AddAlarmMobile' //添加报警手机
export const DelAlarmMobile='DelAlarmMobile' //删除报警手机
export const GetAlarmMobile='GetAlarmMobile' //获取报警手机


/* 基础页面统计 */
export const Customer='Customer' //实名在离线统计
export const VidCounter='VidCounter' //虚拟身份网吧/非经营统计
export const DataTotal='DataTotal' //数据总量统计
export const VidMac='VidMac' //虚拟身份MAC统计
export const SiteCount='SiteCount' //场所在离线统计
export const EquipmentCount='EquipmentCount' //设备在离线统计
export const FirmCount='FirmCount' //厂商在离线统计
export const FirmSiteCount='FirmSiteCount'//厂商场所在离线统计
export const FirmEquipmentCount='FirmEquipmentCount'//厂商设备在离线统计
export const MobileCount='MobileCount' //手机号码采集统计
export const ExportOnlineCount='ExportOnlineCount' //导出厂商在离线数据
export const ExportDetailCount='ExportDetailCount' //导出详情统计数据
export const DetailListCount='DetailListCount' //详情统计列表统计
export const DetailListExport='DetailListExport' //详情统计列表统计导出
export const SiteOnlineRate='SiteOnlineRate' //厂商在离线率统计
export const IdentityCount='identityCount' //特定人员统计
export const InFirmCount='InFirmCount' //接入厂商
export const CertificateCount='certificateCount'//真实身份统计
export const VirtualCount='virtualCount'//虚拟身份统计
export const GetLastData='GetLastData' //获取最新重点人员报警数据

/*数据质量统计*/
export const DataMassCount='DataMassCount' //数据质量统计(数据质量组建页面使用)
export const DataCount='DataCount' //数据上传质量统计(首页使用)
export const DayCount='DayCount'  //日统计量
export const GetRegion='GetRegion' //获取地区
export const GetFirm='GetFirm'      //获取厂商
export const GetMicroprobe='GetMicroprobe'  //获取数据源
export const DataRate='DataRate' //数据质量有效率统计


/*远程数据接口*/
export const GetInterface='GetInterface' //获取远程数据接口
export const AddInterface='AddInterface' //增加远程数据接口
export const UpdateInterface='UpdateInterface' //修改远程数据接口
export const DelInterface='DelInterface' //删除远程数据接口

/* 保存本地数据源结构 */
export const SaveTableSchema='SaveTableSchema' //保存本地数据源结构


export const LoginOut='LoginOut' //注销账户
export const LoginForce='LoginForce' //用户强制登录


/* CCIC */
export const CCICPoliceData='CCICPoliceData' //获取报警信息
export const CCICAddPerson='CCICAddPerson' //添加人员信息
export const CCICDelPerson='CCICDelPerson' //删除人员信息
export const CCICGetPerson='CCICGetPerson' //获取人员信息
export const GetCertificateType='GetCertificateType' //获取证件类型
export const GetMatchMode='GetMatchMode' //获取匹配模式


/* 上传数据源 */
export const upload_dataSourceName_exist='upload_dataSourceName_exist'//判断数据源名称是否存在
export const upload_add_dataSource='upload_add_dataSource' //添加数据源配置对象
export const upload_get_dataSource='upload_get_dataSource' //获取上传数据源配置对象
export const upload_add_fileparse='upload_add_fileparse' //添加文件解析配置项
export const upload_update_fileparse='upload_update_fileparse' //修改文件解析配置项
export const upload_get_fileparse='upload_get_fileparse' //获取文件解析配置项
export const upload_del_fileparse='upload_del_fileparse' //删除文件解析配置项
export const upload_dataSource_file='upload_dataSource_file' //上传数据源数据
export const delSource='delSource' //删除上传数据源
export const File_Seperator='File_Seperator' //获取文件分隔符
export const SetAddSourcePageData='SetAddSourcePageData' //设置新增数据源页面相关页面属性
export const SetAddSourcePageGo='SetAddSourcePageGo' //设置操作页面是否允许通过进入下一步
export const ClearAddSourcePageData='ClearAddSourcePageData' //清空上传数据页面相关数据
export const FieldType='FieldType' //获取字段类型
export const SaveSource='SaveSource' //保存数据源相关配置
export const CreateFileParse='CreateFileParse' //创建文件上传解析规则
export const UplaodFileData='UplaodFileData' //上传文件数据
export const SetSepSourcePageData='SetSepSourcePageData'
export const ClearSepSource='ClearSepSource'
export const SetSepSourcePageGo='SetSepSourcePageGo'
export const SetUploadSourcePageData='SetUploadSourcePageData'
export const ClearUploadSourcePageData='ClearUploadSourcePageData'
export const DelDataSource='DelDataSource'//删除数据源
export const FormatDatas='FormatDatas' //格式化选项数据
export const FormatSearch='FormatSearch'//获取查询格式化参数选项值
export const ClearDataSource='ClearDataSource' //清空数据源数据
export const CreateDataParse='CreateDataParse' //创建数据源数据导入解析规则
export const IsDelSource='IsDelSource'//判断数据源是否允许删除


/* 操作日志 */
export const oper_log='oper_log' //获取操作日志


/** 快搜 **/
export const Set_Setting_Obj='Set_Setting_Obj'//设置配置对象
export const Clear_Set_Setting_Obj='Clear_Set_Setting_Obj'//清空页面数据
export const SetKuaiSouPageGo='SetKuaiSouPageGo'
export const Valid_Go='Valid_Go' //验证是否可以切换页面
export const Set_Source_Info='Set_Source_Info'//设置所选数据源信息
export const SaveSearch='SaveSearch'//保存快搜配置数据


/** 菜单 **/
export const Set_Menu_Setting='Set_Menu_Setting';//设置菜单页面配置对象
export const Clear_Menu_Setting='Clear_Menu_Setting';//清除菜单页面配置对象
export const MenuBacktrackInfo='MenuBacktrackInfo';//获取菜单回溯状态信息

/** 菜单类型 */
export const GetMenuKind='GetMenuKind'//获取菜单类型
export const AddMenuKind='AddMenuKind'//新增菜单类型
export const DelMenuKind='DelMenuKind'//删除菜单类型
export const SetMenuKind='SetMenuKind'//设置菜单类型
export const OrderMenuKind='OrderMenuKind' //菜单类型排序
export const SetFieldKind='SetFieldKind' //设置字段类型
export const SetFormatData='SetFormatData'//设置格式选项数据
export const SetFormatSearch='SetFormatSearch' //设置查询格式化选项数据
export const MenuChangeEven='MenuChangeEven' //订阅菜单数据改变事件
export const TriggerMenuChange='TriggerMenuChange' //触发菜单数据改变事件

/** 回溯状态 */
export const MenuBacktrackChange='MenuBacktrackChange' //注册回溯状态改变事件
export const MenuBacktrackCancel='MenuBacktrackCancel' //注销回溯状态监听事件
export const broastBacktrack='broastBacktrack' //广播回溯状态改变事件


export const SiteMapData='SiteMapData' //获取场所在离线地图数据
export const EquipmentMapData='EquipmentMapData' //获取设备在离线地图数据
export const MacMapData='MacMapData' //获取MAC热力图数据

export const AnalyTraceTask='AnalyTraceTask' //轨迹分析
export const AnalyTraceHistory='AnalyTraceHistory' //获取轨迹历史数据
export const DelTraceHistory='DelTraceHistory' //删除历史轨迹任务
export const GetAnalyTraceTask='GetAnalyTraceTask' //获取轨迹分析任务结果
export const MapDataRange='MapDataRange' //获取范围热力图数据

export const GetFocusPerson='GetFocusPerson'//获取关注人员
export const UpdateFocusPersonName='UpdateFocusPersonName' //修改关注人员姓名
export const UpdateFocusPersonRegion='UpdateFocusPersonRegion' //修改关注区域
export const AddFocusPersonProperty='AddFocusPersonProperty' //添加关注特征
export const DelFocusPersonProperty='DelFocusPersonProperty' //删除关注特征
export const AddMoreFocusPersonProperty='AddMoreFocusPersonProperty'//添加关注标签
export const DelMoreFocusPersonProperty='DelMoreFocusPersonProperty' //删除关注标签
export const AddFocusPersonLabel='AddFocusPersonLabel' //关注人员添加标签
export const UpdateFocusPersonLabel='UpdateFocusPersonLabel'//关注人员修改标签
export const DelFocusPersonLabel='DelFocusPersonLabel'//关注人员删除标签
export const GetFocusPersonLabel='GetFocusPersonLabel'//关注人员标签获取
export const GetTagCount='GetTagCount' //获取标签统计数量
export const DelFocusPerson='DelFocusPerson'//删除关注人员
export const AddFocusPerson='AddFocusPerson'//添加关注人员
export const UpdateFocusPerson='UpdateFocusPerson' //修改关注人员


export const AddShortPath='AddShortPath' //添加最短路径
export const GetShortPath='GetShortPath' //获取最短路径
export const DelShortPath='DelShortPath' //删除最短路径
export const GetShortPathRes='GetShortPathRes' //获取最短分析结果集
export const OneSearch='OneSearch' //一键搜搜索

export const GetCarhailingChart='GetCarhailingChart'//获取网约车统计图
export const GetCarhailingPersonList='GetCarhailingPersonList'//获取网约车人员信息列表
export const GetCarhailingFromplaceList='GetCarhailingFromplaceList'//获取网约车出发地列表
export const GetCarhailingToplaceList='GetCarhailingToplaceList'//获取网约车目的地列表

export const GetVehicleChart='GetVehicleChart'//获取车船出行统计图
export const GetVehiclePersonList='GetVehiclePersonList'//获取车船出行人员列表
export const GetVehicleTeam='GetVehicleTeam'//获取车船出行同行人群

export const GetDangerExpress='GetDangerExpress' //获取可疑快递详细信息
export const GetDangerExpressList='GetDangerExpressList'//获取可疑人员列表
export const GetDangerExpressListLoaction='GetDangerExpressListLoaction'//获取可疑快递区域列表

export const GetNation='GetNation' //获取民族数据
export const GetPersonPhoto='GetPersonPhoto' //获取人员头像

/**获取场所管理定制页面信息*/
export const GetSiteList='GetSiteList' //获取场所管理定制页面
export const SiteDetail='SiteDetail' //获取场所详情
export const GetSiteDeviceList='GetSiteDeviceList' //获取非网吧场所下挂在设备详情
export const GetSiteTerminalList='GetSiteTerminalList' //获取网吧场所下挂载终端列表
export const getDictTables='getDictTables' //获取字典信息集合
export const SiteDetectColl='SiteDetectColl' //获取数据采集趋势
export const siteDetectYesterday='siteDetectYesterday' //获取场所昨日采集详情的柱状图
export const siteDetectHistory='siteDetectHistory' //获取场所历史采集详情的折线图
export const SiteHisPercentage='SiteHisPercentage' //获取场所在离线数据
export const LastPercentage='LastPercentage' //获取场所昨日在离线状况
export const HisPercentageExport='HisPercentageExport' //导出统计场所状态率
export const GetSiteMap='GetSiteMap' //获取可视范围内场所集合
export const SiteMapRegion='SiteMapRegion' //获取按区域汇总场所集合
export const siteScoreCollect='siteScoreCollect' //获取场所管理问题场所页面信息

/**获取设备管理定制页面信息*/
export const GetDeviceList='GetDeviceList' //获取设备管理定制页面
export const DeviceDetectColl='DeviceDetectColl' //获取设备采集趋势
export const DeviceDetectYesterday='DeviceDetectYesterday' //获取设备昨日采集详情的柱状图
export const DeviceDetectHistory='DeviceDetectHistory' //获取设备历史采集详情的折线图

export const LastDevicePercentage='LastDevicePercentage' //获取设备昨日在离线状况
export const DeviceDetail='DeviceDetail' //获取设备详情
export const DeviceHisPercentage='DeviceHisPercentage' //获取设备在离线数据
export const DeviceHisPercentageExport='DeviceHisPercentageExport' //导出统计设备状态率
export const GetDeviceMap='GetDeviceMap' //获取可视范围内场所集合
export const DeviceMapRegion='DeviceMapRegion' //获取按区域汇总场所集合

/**获取厂商管理定制页面信息*/
export const GetFirmList='GetFirmList' //获取厂商管理定制页面
export const GetFirmCollColumn='GetFirmCollColumn' //厂商状态数量统计[柱状图]
export const GetFirmCollLine='GetFirmCollLine' //厂商状态数量统计[折线图]
export const GetFirmSiteExport='GetFirmSiteExport' //厂商状态率按场所汇总导出
export const GetFirmDeviceExport='GetFirmDeviceExport' //厂商状态率按设备汇总导出
export const FirmDetectColl='FirmDetectColl' //获取厂商采集趋势
export const FirmDetectYesterday='FirmDetectYesterday' //获取厂商昨日采集详情的柱状图
export const FirmDetectHistory='FirmDetectHistory' //获取厂商历史采集详情的折线图


// 获取区域管理定制页面信息
export const GetRegionList='GetRegionList' //获取区域管理定制页面


// 获取app定制页面信息
export const GetAppList='GetAppList' //获取app定制页面列表信息
export const GetViolationsAppList='GetViolationsAppList' //获取app定制页面违规app列表
export const GetAppDetail='GetAppDetail' //获取app定制页面详情
export const GetAppViolations='GetAppViolations' //app页面概况统计（用于饼图和右侧柱状图）
export const GetAppGreenPre='GetAppGreenPre' //app页面健康率统计
export const GetAppGreenPreExport='GetAppGreenPreExport' //app页面健康率导出

// 获取网站备案定制页面信息
export const GetWebList='GetWebList' //获取网站备案定制页面未备案网站列表
export const GetWebDetail='GetWebDetail' //获取未备案网站详情
export const GetWebChangeList='GetWebChangeList' //获取网站备案定制页面备案变更列表
export const GetWebChangeDetail='GetWebChangeDetail' //获取备案变更详情

// 获取热点列表定制页面信息
export const GetHotspotList='GetHotspotList' //获取热点列表定制页面信息
export const GetHotspotDetail='GetHotspotDetail' //获取热点列表定制页面详情

export const GetFirmCollFirm='GetFirmCollFirm' //按厂商统计采集量
export const GetCollMicroprobe='GetCollMicroprobe' //按数据来源统计采集量
export const GetIdentData='GetIdentData'//获取报警数据


//导出接口
export const ExportLawCase='ExportLawCase'//导出案例
export const ExportAnalyTask='ExportAnalyTask' //综合分析任务导出
export const ExportCriminal='ExportCriminal' //导出在逃人员
export const ExportCriminalLog='ExportCriminalLog' //导出在逃人员报警
export const ExportKeyIdentity='ExportKeyIdentity' //导出重点人员
export const ExportKeyIdentityLog='ExportKeyIdentityLog' //导出重点人员报警
export const ExportPolicy='ExportPolicy' //导出布控
export const ExportPolicyLog='ExportPolicyLog' //导出布控报警
export const ExportAnalyTraceTask='ExportAnalyTraceTask' //导出轨迹分析详细

/**************** 例子接口 ******************/
export const TogetherTeam='TogetherTeam' //获取同行分析组
export const TogetherTeamTrack='TogetherTeamTrack'//获取同行分析组MAC轨迹
export const TogetherTeamMainTrack='TogetherTeamMainTrack' //获取同行分析主MAC轨迹