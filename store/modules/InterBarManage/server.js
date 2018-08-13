export default {
    /**
     * 发布停业计划
     * params{
     *  pwd:'!QAZ@WSX',
        close_way:'1',// 停业方式 1 定时，2长期
        stop_time_range:'2018-07-01 10:00:00 - 2018-07-31 10:00:00',
        reason:'测试停业理由',
        target:'41052727110692,41052727110710,41052727110734'
     * } 
     */
    NetBar_Stop_Add(data){
        this.baseBag.target='netbar_manages';
        this.baseBag.method='netbar_stop_add';
        this.baseBag.data=data || {};
        return this.post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag)
    },

    /**
     * 查询停业计划列表
     * params{
     *  limit: 20,
        skip: 0,
        sort:'',// 字段名
        order:'',//desc,asc
        time_range:'2018-07-01 - 2018-08-31',// 时间段
        netsite_range:'',//场所范围，场所控件格式[{code:''}]
        region_range:'',//区域范围，区域控件格式[{"code":"410501","name":"市辖区"}]
        plan_status:'',//取定义表：stop_status
     * } 
     */
    NetBar_Stop_Plan_List(data){
        this.baseBag.target='netbar_manages';
        this.baseBag.method='netbar_stop_plan_list';
        this.baseBag.data=data || {};
        return this.post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag)
    },

    /**
     * 停业计划列表导出
     * params{
     *  sort:'',// 字段名
        order:'',//desc,asc
        time_range:'2018-07-01 - 2018-08-31',// 时间段
        netsite_range:'',//场所范围，场所控件格式[{code:''}]
        region_range:'',//区域范围，区域控件格式[{"code":"410501","name":"市辖区"}]
        plan_status:'',//取定义表：stop_status
        plan_id:''// 停业计划id，多条用逗号分割
     * } 
     */
    NetBar_Stop_Plan_Export(data){
        this.baseBag.target='netbar_manages';
        this.baseBag.method='netbar_stop_plan_export';
        this.baseBag.data=data || {};
        return this.post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag)
    },

    /**
     * 撤销停业计划列表
     * params{
     *  plan_id:'',//停业计划id，多个逗号分割
     * } 
     */
    NetBar_Stop_Plan_Cancel(data){
        this.baseBag.target='netbar_manages';
        this.baseBag.method='netbar_stop_cancel';
        this.baseBag.data=data || {};
        return this.post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag)
    },

    /**
     * 上传通知附件
     * params{
     *  plan_id:'',//停业计划id，多个逗号分割
     * } 
     */
    NetBar_Stop_Plan_Upload(data){
        this.baseBag.target='netbar_manages';
        this.baseBag.method='netbar_notice_attachment_upload';
        this.baseBag.data=data || {};
        return this.post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag)
    },

    /**
     * 发布通知
     * params{
     *  title:'测试标题',
        content:'测试内容！！！！！',
        is_reply:0, // 0不可回复，1可回复
        timelimit:'2018-08-20 10:00:00',// 时限
        target:'41050010000001,41050010008888',
        accessory:''// 上传的文件标识（先调用上传接口上传文件，返回唯一标识）
     * } 
     */
    NetBar_Notice_ADD(data){
        this.baseBag.target='netbar_manages';
        this.baseBag.method='netbar_notice_add';
        this.baseBag.data=data || {};
        return this.post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag)
    },

    /**
     * 查询通知列表
     * params{
     *  limit: 20,
        skip: 0,
        sort:'',// 字段名
        order:'',//desc,asc
        time_range:'2018-07-01 - 2018-08-31',// 时间段
        content:'',// 内容
        title:'',// 标题
     * } 
     */
    NetBar_Notice_List(data){
        this.baseBag.target='netbar_manages';
        this.baseBag.method='netbar_notice_list';
        this.baseBag.data=data || {};
        return this.post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag)
    },

    /**
     * 通知详情
     * params{
     *  notice_id:''
     * } 
     */
    NetBar_Notice_Detail(data){
        this.baseBag.target='netbar_manages';
        this.baseBag.method='netbar_notice_detail';
        this.baseBag.data=data || {};
        return this.post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag)
    },

    /**
     * 通知签收列表
     * params{
     *  limit:20,
        skip:0,
        sign_status:'',// 签收状态（取定义 notice_sign_status）
        notice_id:''
     * } 
     */
    NetBar_Notice_Sign_List(data){
        this.baseBag.target='netbar_manages';
        this.baseBag.method='netbar_notice_sign_list';
        this.baseBag.data=data || {};
        return this.post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag)
    },

    /**
     * 通知回复列表
     * params{
     *  limit:20,
        skip:0,
        notice_id:''
     * } 
     */
    NetBar_Notice_Reply_List(data){
        this.baseBag.target='netbar_manages';
        this.baseBag.method='netbar_notice_reply_list';
        this.baseBag.data=data || {};
        return this.post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag)
    },

    /**
     * 通知删除
     * params{
     *  notice_id:''
     * } 
     */
    NetBar_Notice_Remove(data){
        this.baseBag.target='netbar_manages';
        this.baseBag.method='netbar_notice_del';
        this.baseBag.data=data || {};
        return this.post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag)
    },

    /**
     * 电子登记配置可用
     * params{
     *  times:10, // 次数
        cover:0,//0 不覆盖，1覆盖
        target:'41050010008888,41050010000001'// 只能传网吧（microprobetype=120）
     * } 
     */
    Netbar_Electronic_Option_Allow(data){
        this.baseBag.target='netbar_manages';
        this.baseBag.method='netbar_electronic_option_allow';
        this.baseBag.data=data || {};
        return this.post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag)
    },

    /**
     * 电子登记列表
     * params{
     *  limit:20,
        skip:0,
        sort:'',
        order:'',// desc asc
        netsite_range:'',// 场所范围[{code:''}]
        region_range:''// 区域范围[{code:''}]
     * } 
     */
    Netbar_Electronic_List(data){
        this.baseBag.target='netbar_manages';
        this.baseBag.method='netbar_electronic_list';
        this.baseBag.data=data || {};
        return this.post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag)
    },

    /**
     * 电子登记导出
     * params{
     *  sort:'',
        order:'',// desc asc
        netsite_range:'',// 场所范围[{code:''}]
        region_range:'',// 区域范围[{code:''}]
        site_id:''// 场所编码，多条用逗号分割
     * } 
     */
    Netbar_Electronic_Export(data){
        this.baseBag.target='netbar_manages';
        this.baseBag.method='netbar_electronic_list_export';
        this.baseBag.data=data || {};
        return this.post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag)
    },

    /**
     * 电子登记编辑可用次数
     * params{
     *  times:10,// 可用次数
        site_id:''// 场所编码，多条用逗号分割
     * } 
     */
    Netbar_Electronic_Edit_Allow(data){
        this.baseBag.target='netbar_manages';
        this.baseBag.method='netbar_electronic_edit_allow';
        this.baseBag.data=data || {};
        return this.post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag)
    }

}