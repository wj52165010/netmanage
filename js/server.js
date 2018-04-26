//服务

//基地址192.168.100.80:3031(http://192.168.23.73:3030)
//发布地址:172.23.90.8:3030
let url='http://192.168.23.73:3030';
let baseUri=url+'/api/v1';
//baseUri='http://localhost:8080/api/v1';

//基础服务包
let baseBag={
    ver:'',          //数据包版本
    timestamp:0,     //时间戳
    target:'',       //对象
    method:'',       //行为
    session_id:'',   //会话ID
    userid:'',       //用户ID
    token:'',        //令牌
    interface:'',    //是否为远程数据(多个远程数据用逗号分隔)
    data:{}          //数据
};
var post=function(url,data,callback){
    return $.ajax({
        type:'POST',
        //contentType:'multipart/form-data',
        dataType:'json',
        //jsonp:'callback',
        url:url,
        data:{data:JSON.stringify(data)},
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            //console.log(XMLHttpRequest.status);
        }
        //data:data
    }).then(function(res){
        if(res.msg.code!='successed'){
            layer.msg(res.msg.note);
        }
        return res;
    });
};

class server{
    constructor(baseBag,uri,url){
        this.url=url;
        this.uri=uri;
        this.baseBag=baseBag;
        this.baseBag={
            ver:'1.1.0',
            timestamp:'100000',
            session_id:'123',
            userid:'test',
            token:'123213'
        };
    }

    //上传文件
    uploadFile(url,files,code,id){
      var formData = new FormData();
      formData.append('file',files[0]);
      formData.append('code',code || '');
      formData.append('id',id || '');
      return $.ajax({
          url: this.uri+'/'+url,
          type: 'POST',
          cache: false,
          data: formData,
          processData: false,
          contentType: false
      }).then(function(res){
        return res;
      })
    }

    //删除数据源
    delSource(sourceId){
      this.baseBag.target='upload';
      this.baseBag.method='del_datasource';
      this.baseBag.data={source:sourceId || ''};
      return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag)
    }

    //获取动态地址接口数据
    dynamicData(dyUrl){
      let cdyUrl= dyUrl.substring(1).split('/');

      this.baseBag.target=cdyUrl[0];
      this.baseBag.method=cdyUrl[1];
      this.baseBag.data={};
      return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag)
    }

    //获取数据源
    dataSource(){
        this.baseBag.target='mapping_table';
        this.baseBag.method='get';
        this.baseBag.data={};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag)
    }

    //删除数据源
    delDataSource(code){
      this.baseBag.target='upload';
      this.baseBag.method='del_datasource';
      this.baseBag.data={code:code || ''};
      return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag)
    }

    //判断数据源是否可以被删除
    isDelSource(sourceId){
      this.baseBag.target='mapping_table';
      this.baseBag.method='datasource_is_del';
      this.baseBag.data={keyid:sourceId || ''};
      return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag)
    }

    //获取服务器端格式化选项值
    formatDatas(){
      this.baseBag.target='mapping_table';
      this.baseBag.method='get_show_format';
      this.baseBag.data={};
      return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag)
    }

    //获取查询格式化选项值
    formatSearch(){
      this.baseBag.target='mapping_table';
      this.baseBag.method='get_seach_format';
      this.baseBag.data={};
      return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag)
    }

    //清空数据源数据
    clearDataSource(code){
      this.baseBag.target='upload';
      this.baseBag.method='del_datasource_data';
      this.baseBag.data={code:code || ''};
      return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag)
    }

    //创建自定义模块
    createOperate(data){
        this.baseBag.target='custom_module';
        this.baseBag.method='create';
        this.baseBag.data=data || {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    }

    //修改自定义模块
    updateOperate(data){
      this.baseBag.target='custom_module';
      this.baseBag.method='update';
      this.baseBag.data=data || {};
      return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    }

    //设置自定义模块
    setOperate(data){
        this.baseBag.target='custom_module';
        this.baseBag.method='set';
        this.baseBag.data=data || {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    }
    //获取自定义模块数据(keyid不传代表获取全部数据)
    getOperate(data){
        this.baseBag.target='custom_module';
        this.baseBag.method='get';
        this.baseBag.data=data || {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    }
    //获取自定义模块数据
    getOperateData(data){
        let baseBag=tool.Clone(this.baseBag);
        baseBag.target='custom_module_data';
        baseBag.method='get';
        baseBag.interface=data.interface;
        delete data.interface;
        baseBag.data=data || {keyid:'',extraData:{},condtionsObj:{}};
        return post(this.uri+'/'+baseBag.target+'/'+baseBag.method,baseBag);
    }
    //获取地区下的场所信息(用于地区选择插件)
    //code:编码(默认不传,则根据当前用户登录数据获取一级信息)
    //type:数据类型(1:地区,2:派出所,3:场所)
    //defaultVal:[{code:"50015",type:"1"}]默认选中的值
    placeByArea(code,type,defaultVal){
        this.baseBag.target='site';
        this.baseBag.method='getRegionAndSiteTree';
        this.baseBag.data={code:code,type:type,default:defaultVal};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    }
    
    //模块菜单删除
    delPlace(keyid){
        this.baseBag.target='custom_module';
        this.baseBag.method='del';
        this.baseBag.data={keyid:keyid || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    }

    //地图查找范围内场所
    //"data": {
    //    "lb": { 左下角经纬度
    //        "lng": "108.377121",
    //        "lat": "30.797873"
    //    },
    //    "rt": { 右上角经纬度
    //        "lng": "108.377121",
    //        "lat": "30.797873"
    //    }
    //}
    SearchRangeSites(lb,rt){
        this.baseBag.target='site';
        this.baseBag.method='searchRangeSites';
        this.baseBag.data={lb:lb,rt:rt};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    };

    //根据编码/中文/拼音/字母获取场所信息
    GetSitesInfoByInfo(condition,types,records){
        this.baseBag.target='site';
        this.baseBag.method='searchSiteTree';
        this.baseBag.data={search:condition,types:types,records:records || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    };

    // 场所选择控件-精确查询(SearchExact)
    /**
    "data":
        [
            {
                "code": "500115",  编码 
                "type": "1" 类型 1-地区，2-派出所,3-场所
            }
        ]
    **/
    SearchExact(data) {
        this.baseBag.target='site';
        this.baseBag.method='searchExact';
        this.baseBag.data=data || {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    };
    
    /**
     * 添加数据(/custom_module_data /add)
     * data:{
     *   keyid:''//菜单ID
     *   values:[
     *     { field:’’, value:’’ }    
     *   ]
     * 
     * }
     */
     addData(data){
        let baseBag=tool.Clone(this.baseBag);
        baseBag.target='custom_module_data';
        baseBag.method='add';
        baseBag.interface=data.interface;
        delete data.interface;
        baseBag.data=data || {};
        return post(this.uri+'/'+baseBag.target+'/'+baseBag.method,baseBag);
     }

     /**
      * 修改数据(/custom_module_data /update)
      * data:{
            keyid: ‘’,
            values: {
                { field:’’, value:’’ }
            …
            },
            beforeValues: {
                { field:’’, value:’’ }   //修改前的字段和值
            …
            },
            prime_key: ‘’, //列表行唯一标识符
        }
      *
      */
      updateData(data){
        let baseBag=tool.Clone(this.baseBag);
        baseBag.target='custom_module_data';
        baseBag.method='update';
        baseBag.interface=data.interface;
        delete data.interface;
        baseBag.data=data || {};
        return post(this.uri+'/'+baseBag.target+'/'+baseBag.method,baseBag);
      }

      /**
       * 删除数据(/custom_module_data /del)
       * data:{
       *    keyid: ‘’,
            prime_key: ‘’
       * }
       */

      delData(data){
        let baseBag=tool.Clone(this.baseBag);
        baseBag.target='custom_module_data';
        baseBag.method='del';
        baseBag.interface=data.interface;
        delete data.interface;
        baseBag.data=data || {};
        return post(this.uri+'/'+baseBag.target+'/'+baseBag.method,baseBag);
      }

      /**
       * 导出数据(/custom_module_data /export)
       * data:{
       *    keyid: ‘’,
            params: {}   //查询条件
            limit: 0     //导出数
       * }
       */
      exportData(data){
        let baseBag=tool.Clone(this.baseBag);
        baseBag.target='custom_module_data';
        baseBag.method='export';
        baseBag.interface=data.interface;
        delete data.interface;
        baseBag.data=data || {};
        return post(this.uri+'/'+baseBag.target+'/'+baseBag.method,baseBag);
      }

      /**
       * 用户登录(/user/login)
       * data:{
       *    account: ‘’,
            pwd: ‘’ 
       * }
       */
      login(data){
        this.baseBag.target='user';
        this.baseBag.method='login';
        this.baseBag.data=data || {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 用户组添加(/ user_group/add)
       * data{
       *    name:'',//名称
       *    note:'',//描述
       *    permission:[],//相关菜单id
       * }
       */
      addGroup(data){
        this.baseBag.target='user_group';
        this.baseBag.method='add';
        this.baseBag.data=data || {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 修改用户组(/user_group/update)
       * data{
       *    user_group_id: ‘’,用户组ID
       *    name:'',//用户组名称
       *    note:'',//描述
       *    permission:[],//相关菜单id
       * }
       */
      updateGroup(data){
        this.baseBag.target='user_group';
        this.baseBag.method='update';
        this.baseBag.data=data || {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 删除用户组(/user_group/del)
       */
      delGroup(user_group_id){
        this.baseBag.target='user_group';
        this.baseBag.method='del';
        this.baseBag.data={user_group_id:user_group_id};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 获取用户组信息(/user_group/get)
       */
      getGroup(){
        this.baseBag.target='user_group';
        this.baseBag.method='get';
        this.baseBag.data={};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * 获取用户信息(/user/get)
       */
      getUser(id){
        this.baseBag.target='user';
        this.baseBag.method='get';
        this.baseBag.data={user_id:id || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 用户添加(/user/add)
       * data{
       *    account:'',//账号
       *    name:'',//姓名
       *    pwd:'',//密码
       *    tel:'',//电话
       *    email:'',//邮箱
       *    department:'',//部门
       *    policestation_code:'',//派出所编码
       *    region_code:'',//区域编码
       *    status:'', //lock,disabled,normal
       *    usb_key:'',
       *    groups:[],//组id
       *    note:''//描述
       * }
       */
      addUser(data){
        this.baseBag.target='user';
        this.baseBag.method='add';
        this.baseBag.data=data || {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 用户修改(/user/update)
       * data{
       *    user_id:''//用户ID
       *    account:'',//账号
       *    name:'',//姓名
       *    pwd:'',//密码
       *    tel:'',//电话
       *    email:'',//邮箱
       *    department:'',//部门
       *    policestation_code:'',//派出所编码
       *    region_code:'',//区域编码
       *    status:'', //lock,disabled,normal
       *    usb_key:'',
       *    groups:[],//组id
       *    note:''//描述
       * }
       */
      updateUser(data){
        this.baseBag.target='user';
        this.baseBag.method='update';
        this.baseBag.data=data || {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 用户删除(/user/del)
       * data{
       *    user_id:'',//用户ID
       * }
       */
      delUser(user_id){
        this.baseBag.target='user';
        this.baseBag.method='del';
        this.baseBag.data={user_id:user_id};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 获取用户部门信息(/user/departments)
       */
      getDepartments(){
        this.baseBag.target='user';
        this.baseBag.method='departments';
        this.baseBag.data={};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /** 
       * 常见审计策略(/audit_policy/add)
       * data{
       *   policy_title:''//策略名
       *   policy_type:'' //策略类型[
                                        {name: '身份证', value: 'cert'},
                                        {name: '虚拟身份', value: 'vid'},
                                        {name: 'MAC地址', value: 'mac'},
                                        {name: '手机号', value: 'mobile'},
                                        {name: 'imsi', value: 'imsi'},
                                        {name: 'imei', value: 'imei'}
                                     ];
            keywords:[],//策略关键字
            locus_ids:[],//策略布控区域用','分隔
            alam_type:[],//报警类型[
                                        {name: ‘邮件’, value: 'email'},
                                        {name: ‘短信’, value: 'sms'},
                                        {name: '网站', value: 'web'}
                                    ];
            alarm_account:{}    //  {email:[], sms:[], web:[]}
            law_cases:[] //案件
       * }
       */
      addPolicy(data){
        this.baseBag.target='audit_policy';
        this.baseBag.method='add';
        this.baseBag.data=data || {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /*
       *获取审计策略列表信息(/audit_policy/get)
       *data{
           policy_id:''//可以为空(策越ID)
       }
       */
      getPolicy({policy_id,policy_title,law_case,user_id,blnCase,limit,skip}){
        this.baseBag.target='audit_policy';
        this.baseBag.method='get';
        this.baseBag.data={policy_id:policy_id || '',policy_title:policy_title || '',user_id:user_id || '',law_case:law_case || '',is_lawpolicy:blnCase || '',limit:limit || 10,skip:skip || 0};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /*
         删除审计策略(/audit_policy/del）
         data{
             policy_id:'' //策略ID
         }
       */
      delPolicy(id){
        this.baseBag.target='audit_policy';
        this.baseBag.method='del';
        this.baseBag.data={policy_id:id || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /*
         获取审计策略详细(/audit_policy/getdata
         data{
             policy_id:'' //策略ID
             law_case_id:'',//案件ID
             limit:0,     //返回结果记录数0为不限制
             skip:0,      //跳过记录数
             blnCase:''   //是否关联案件
             log_id:''    //报警记录ID
             keywords:''  //关键字
         }
       */
      getPolicyDetail({id,law_case_id,limit,skip,blnCase,log_id,keywords}){
        this.baseBag.target='audit_policy';
        this.baseBag.method='getdata';
        this.baseBag.data={policy_id:id || '',law_case_id:law_case_id || '',limit:limit || 0,skip:skip || 0,is_lawpolicy:blnCase || '',log_id:log_id || '',keywords:keywords || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * 案件添加(/law_case/add)
       * data{
       * law_case_title:'',//案件名称
       * law_case_note:'',//案件描述
       * law_case_id:案件ID
       * law_case_status:案件状态
       * law_case_place:案件地点
       * law_case_time:案件时间(时间戳)
       * }
       */
      addCase(data){
        this.baseBag.target='law_case';
        this.baseBag.method='add';
        this.baseBag.data=data || {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 案件修改（/ law_case /update）
       * data{
       *    law_case_title: ‘’,
            law_case_note: ‘’,
            law_case_id: ‘’ 
       * }
       */
      updateCase(data){
        this.baseBag.target='law_case';
        this.baseBag.method='update';
        this.baseBag.data=data || {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * 案件删除(/law_case/del)
       * data{
       *    law_case_id:''
       * }
       */
      delCase(id){
        this.baseBag.target='law_case';
        this.baseBag.method='del';
        this.baseBag.data={law_case_id:id || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * 获取案件(/law_case/get)
       * limit:0,     //返回结果记录数0为不限制
       * skip:0,      //跳过记录数
       */
      getCase({law_case_id,law_case_title,law_case_time,law_case_status,limit,skip}){
        this.baseBag.target='law_case';
        this.baseBag.method='get';
        this.baseBag.data={law_case_id:law_case_id || '',law_case_title:law_case_title || '',law_case_time:law_case_time || '',law_case_status:law_case_status || '',limit:limit ||'',skip:skip || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 获取最新重点人员报警数据
       */
      getLastData(){
        this.baseBag.target='key_identity';
        this.baseBag.method='getlastdata';
        this.baseBag.data={};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * 重点人员类型添加（/ key_identity_type /add)
       * data{
       *  key_identity_type_title: ‘’,
       *  key_identity_type_note: ‘’
       * }
       * 
       */
      addIdentity({key_identity_type_title,key_identity_type_note}){
        this.baseBag.target='key_identity_type';
        this.baseBag.method='add';
        this.baseBag.data={key_identity_type_title:key_identity_type_title || '',key_identity_type_note:key_identity_type_note || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 重点人员类型修改（/ key_identity_type /update）
       * data{
       *    key_identity_type_title: ‘’,
       *    key_identity_type_note: ‘’，
       *    key_identity_type_id: ‘’
       * }
       */
      updateIdentity({key_identity_type_id,key_identity_type_title,key_identity_type_note}){
        this.baseBag.target='key_identity_type';
        this.baseBag.method='update';
        this.baseBag.data={key_identity_type_id:key_identity_type_id,key_identity_type_title:key_identity_type_title || '',key_identity_type_note:key_identity_type_note || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
       /**
       * 重点人员类型删除（/ key_identity_type /del）
       * data{
       *    key_identity_type_id: ‘’
       * }
       */
       delIdentity(id){
        this.baseBag.target='key_identity_type';
        this.baseBag.method='del';
        this.baseBag.data={key_identity_type_id:id || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
       }
      /**
       * 获取重点人员类型（/ key_identity_type /get）
       * data{
       *    key_identity_type_title: ‘’,
       *    key_identity_type_id: ‘’
       * }
       */
      getIndentity(){
        this.baseBag.target='key_identity_type';
        this.baseBag.method='get';
        this.baseBag.data={};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 重点人员添加（/ key_identity /add）
       * data{
       *    key_identity_name: '',  //姓名
            key_identity_cert: '',  //身份证
            key_identity_mobile: '',//手机
            key_identity_mac: '',    //mac
            key_identity_types: [],  //重点人员类型
            follows: ''   //关注方式
       * }
       */
      addIdenPerson(data){
        this.baseBag.target='key_identity';
        this.baseBag.method='add';
        this.baseBag.data=data || {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 重点人员修改（/ key_identity /update)
       * data{
       *    key_identity_id: ‘’ 
            key_identity_types：[],
            follows:[]
       * }
       */
      updateIndenPerson(data){
        this.baseBag.target='key_identity';
        this.baseBag.method='update';
        this.baseBag.data=data || {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 重点人员删除（/ key_identity /del）
       * data{
       *    key_identity_id: ‘’
       * }
       */
      delIdenPerson(id){
        this.baseBag.target='key_identity';
        this.baseBag.method='del';
        this.baseBag.data={key_identity_id:id};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 获取重点人员（/ key_identity /get）
       * data{
       *    key_identity_name：‘’，
            key_identity_cert：‘’,
            key_identity_mobile:’’
            key_identity_mac: ‘’
            key_identity_type:’’
       * }
       */
      getIdenPerson({limit,skip,key_identity_name,key_identity_cert,key_identity_mobile,key_identity_mac,key_identity_type}){
        this.baseBag.target='key_identity';
        this.baseBag.method='get';
        this.baseBag.data={key_identity_name:key_identity_name || '',
                           key_identity_cert:key_identity_cert || '',
                           key_identity_mobile:key_identity_mobile || '',
                           key_identity_mac:key_identity_mac || '',
                           key_identity_type:key_identity_type || '',
                           limit:limit || '',
                           skip:skip || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 获取重点人员详细（/ key_identity /getdata)
       * data{
       *    key_identity_id：‘’，
            limit：‘’,
            skip:’’
       * }
       */
      getIdenPersonDetail({id,limit,skip,key_identity_name,key_identity_cert,key_identity_mobile,key_identity_mac,key_identity_type}){
        this.baseBag.target='key_identity';
        this.baseBag.method='getdata';
        this.baseBag.data={ key_identity_id:id || '',
                            key_identity_name:key_identity_name || '',
                            key_identity_cert:key_identity_cert || '',
                            key_identity_mobile:key_identity_mobile || '',
                            key_identity_mac:key_identity_mac || '',
                            key_identity_type:key_identity_type || '',
                            limit:limit || '',
                            skip:skip || ''};
        
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      } 
      /**
       * 添加分析任务(/analy_task/add）
       * data{
              task_name:’’   //任务名
              task_type：‘’  //任务类型(together 同行分析,correlation  关联分析,collide  碰撞)
              task_target_type:’’ //任务对象类型			  
                      {name: '身份证', value: 'cert'},
                      {name: '虚拟身份', value: 'vid'},
                      {name: 'MAC地址', value: 'mac'},
                      {name: '手机号', value: 'mobile'},
                      {name: 'imsi', value: 'imsi'},
                      {name: 'imei', value: 'imei'}
                
              task_conditions：{}  //分析条件
              task_status：’’,      //分析任务状态
              created	创建
              running	执行中
              completed	完成
              aborted	异常
              task_note：‘‘   //任务说明
              task_progress：‘‘ //任务进度
              extracting	数据提取
              aggregating	数据聚合
              writing	数据写入
              completed	完成,
              begin_time:开始时间
              end_time:结束时间
              begin_hour:开始小时int
              end_hour:结束小时int
              frequency:使用次数
              nations:[],民族数组
              certs:[],身份证筛选支持
          }
       */
      addAnalyTask(data){
        this.baseBag.target='analy_task';
        this.baseBag.method='add';
        this.baseBag.data=data || {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * 分析任务删除（/ analy_task /del）
       * data{
       *    task_id: ‘’
       * }
       */
      delAnalyTask(id){
        this.baseBag.target='analy_task';
        this.baseBag.method='del';
        this.baseBag.data={task_id:id || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * 获取分析任务（/ analy_task /get）
       * data{
       * }
       */
      getAnalyTask(data){
        data =data || {id:'',law_case_id:''}
        this.baseBag.target='analy_task';
        this.baseBag.method='get';
        this.baseBag.data={task_id:data.id || '',law_case_id:data.law_case_id,task_type:data.task_type};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * 获取分析任务分析数据（/ analy_task /getdata)
       * data{
       *  task_id:''
       *  limit:0,
       *  skip:0,
       *  append_conditions:[
       *    {
       *      key:'collison_id',//二次碰撞关键字(固定值)
       *      value:'con_new_id'//二次碰撞后新生成的条件ID
       *    }
       *  ],//目前只有查看二次碰撞时需要该条件
       *  conds:['id','id'],//二次碰撞新生成的条件ID
       * }
       */
      getAnalyTaskData(id,limit,skip,conds){
        this.baseBag.target='analy_task';
        this.baseBag.method='getdata';
        this.baseBag.data={task_id:id,limit:limit || '',skip:skip || '',append_conditions:_.map((conds || []),c=>{return {key:"collison_id",value:c};})};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 获取分析任务分析数据详情更多（/ analy_task /getdata_more)
       * data{
       *  task_id:''
       *  limit:0,
       *  skip:0
       * }
       */
      getAnalyTaskMore(taskid,mid){
        this.baseBag.target='analy_task';
        this.baseBag.method='getdata_more';
        this.baseBag.data={task_id:taskid,mid:mid};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 获取关联分析二次查询（/correlation_task /getdata)
       * data{
       *  task_target_type:'' //任务类型
       *  account_type:'', //虚拟身份类型(当任务类型为虚拟身份时才需要)
       *  keyword:'', //关键字
       * }
       */
      getRelationSecond(task_target_type,account_type,keyword){
        this.baseBag.target='correlation_task';
        this.baseBag.method='getdata';
        this.baseBag.data={task_target_type:task_target_type || '',account_type:account_type || '',keyword:keyword || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 添加二次碰撞条件（/analy_task/add_collide)
       * data{
       *  task_id:''
       *  task_conditions:{
       *    id:"new_con",//二次碰撞条件ID
       *    title:'new_con_title'// 二次碰撞条件名称
       *    data_source_ids:["con_1","con_2"],//子条件ID
       *  }
       * }
       */
      secondCrashTask(taskid,cond){
        this.baseBag.target='analy_task';
        this.baseBag.method='add_collide';
        this.baseBag.data={task_id:taskid,task_conditions:cond};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 删除二次碰撞条件（/analy_task/del_collide)
       * data{
       *  task_id:'',//任务ID
       *  id:''//二次碰撞ID
       * }
       */
      delSecondCrash({taskid,id}){
        this.baseBag.target='analy_task';
        this.baseBag.method='del_collide';
        this.baseBag.data={task_id:taskid,id:id};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /** 
       * 获取虚拟身份类型（/vid_type/get）
       * data{
       * }
       */
      getVidType(){
        this.baseBag.target='vid_type';
        this.baseBag.method='get';
        this.baseBag.data={};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * 批量修改菜单排序（/custom_module/orderby）
       * data[{keyid:0,orderby:1}]
       * 
       */
      menuSort(data){
        this.baseBag.target='custom_module';
        this.baseBag.method='orderby';
        this.baseBag.data={orderby:data};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 快搜结果/custom_module/orderby）
       * data[{keyid:0,orderby:1}]
       * 
       */
      search(str,skip,limit){
        this.baseBag.target='one_search';
        this.baseBag.method='getdata';
        this.baseBag.data={keyword:str,skip:skip,limit:limit};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 添加报警手机/contact_mobile/add)
       * data[{contact_name:0,mobile:1}]
       * 
       */
      addAlarmMobile(contact_name,mobile){
        this.baseBag.target='contact_mobile';
        this.baseBag.method='add';
        this.baseBag.data={contact_name:contact_name,mobile:mobile};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 删除报警手机/contact_mobile/del)
       * data[{id:0}]
       * 
       */
      delAlarmMobile(id){
        this.baseBag.target='contact_mobile';
        this.baseBag.method='del';
        this.baseBag.data={id:id};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 获取报警手机/contact_mobile/get)
       * data[{id:0}]
       * 
       */
      getAlarmMobile(){
        this.baseBag.target='contact_mobile';
        this.baseBag.method='get';
        this.baseBag.data={};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 场所在离线统计/data_count/site)
       * {
          total: 0, 
          data: [
                                  { name: "证件", count: 0},
                                  { name: "手机", count: 0}
                ]
          }
       * 
       */
      siteCount(){
        this.baseBag.target='data_count';
        this.baseBag.method='site';
        this.baseBag.data={};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 场所在离线率统计
       * 
       */
      siteOnlineRate({queryType,timeType,firm_id}){
        this.baseBag.target='data_count';
        this.baseBag.method='firm_online_day';
        this.baseBag.data={queryType:queryType || '',timeType:timeType || '',firm_id:firm_id || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 日数据统计/data_count/data_day_count)
       * {
          region:'',         //地区ID
          firm_id:'',        //厂商ID
          microprobe_type:'' //采集类型
          date:'',           //查询时间 格式20170905
          type:'' //all               采集总量
                  //customer_archives 真实身份
                  //virtual_archives  虚拟身份
                  //mobile_archives   手机号
                  //mac_archives      MAC
                  //netlogs           上网日志
       * 
       */
      dayCount(data){
        this.baseBag.target='data_count';
        this.baseBag.method='data_day_count';
        this.baseBag.data=data || {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      } 

      /**
       * 设备在离线统计/data_count/equipment)
       * {
          total: 0, 
          data: [
                                  { name: "证件", count: 0},
                                  { name: "手机", count: 0}
                ]
          }
       * 
       */
      equipmentCount(){
        this.baseBag.target='data_count';
        this.baseBag.method='equipment';
        this.baseBag.data={};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
       /**
       * 厂商在离线统计/data_count/firm)
       * {
          total: 0, 
          data: [
                                  { name: "证件", count: 0},
                                  { name: "手机", count: 0}
                ]
          }
       * 
       */
      firmCount(){
        this.baseBag.target='data_count';
        this.baseBag.method='firm';
        this.baseBag.data={};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 实名在离线统计/data_count/customer)
       * {
          total: 0, 
          data: [
                                  { name: "证件", count: 0},
                                  { name: "手机", count: 0}
                ]
          }
       * 
       */
      customer(){
        this.baseBag.target='data_count';
        this.baseBag.method='customer';
        this.baseBag.data={};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 虚拟身份网吧/非经营统计/data_count/vid)
       * {
          total: 0, 
          data: [
                  { name: "网吧", count: 0},
                  { name: "非经", count: 0},
                  { name: "WIFI", count: 0} 
                ]
          }
       * 
       */
      vidcounter(){
        this.baseBag.target='data_count';
        this.baseBag.method='vid';
        this.baseBag.data={};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 虚拟身份MAC统计/data_count/mac)
       * {
          total: 0, 
          data: [
                  { name: "围栏", count: 0},
                  { name: "无线", count: 0}
                ]
          }
       * 
       */
      vidMac(){
        this.baseBag.target='data_count';
        this.baseBag.method='mac';
        this.baseBag.data={};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      
      /**
       * 数据总量/data_count/data_total)
       * {
          }
       * 
       */
      dataTotal(){
        this.baseBag.target='data_count';
        this.baseBag.method='data_total';
        this.baseBag.data={};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 场所统计(/data_count/all_firm_site_online_offline)
       * {
       *  timeType:''//时间类型
       * }
       * 
       */
      firmSiteCount({timeType,firm_id}){
        this.baseBag.target='data_count';
        this.baseBag.method='all_firm_site_online_offline';
        this.baseBag.data={timeType:timeType || '',firm_id:firm_id || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 设备统计(/data_count/all_firm_equipment_online_offline)
       * {
       *  timeType:''//时间类型
       * }
       * 
       */
      firmEquipmentCount({timeType,firm_id}){
        this.baseBag.target='data_count';
        this.baseBag.method='all_firm_equipment_online_offline';
        this.baseBag.data={timeType:timeType || '',firm_id:firm_id || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 数据质量统计(/data_count/all_firm_equipment_online_offline)数据质量组建页面使用
       * {
       *   startTime:''接收开始时间
       *   endTime:''接收结束时间
       * }
       * 
       */
      dataMassCount(startTime,endTime,firm_id){
        this.baseBag.target='data_count';
        this.baseBag.method='all_firm_clean';
        this.baseBag.data={receive_time_start:startTime || '',receive_time_end:endTime || '',firm_id:firm_id || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 数据上传质量统计(/data_count/data_count/clean_log_count)首页使用
       * {
       * }
       * 
       */
      dataCount(){
        this.baseBag.target='data_count';
        this.baseBag.method='clean_log_count';
        this.baseBag.data={};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 数据质量有效率统计(/data_count/all_firm_equipment_online_offline)
       * {
       *   startTime:''接收开始时间
       *   endTime:''接收结束时间
       * }
       * 
       */
      dataRate({receive_time_start,receive_time_end,firm_id}){
        this.baseBag.target='data_count';
        this.baseBag.method='all_firm_clean_day';
        this.baseBag.data={receive_time_start:receive_time_start || '',receive_time_end:receive_time_end || '',firm_id:firm_id || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 手机号码采集统计(data_count/mobile)
       * }
       * 
       */
      mobileCount(){
        this.baseBag.target='data_count';
        this.baseBag.method='mobile';
        this.baseBag.data={};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 特定人员统计(data_count//key_identity_count)
       * }
       * 
       */
      identityCount(){
        this.baseBag.target='data_count';
        this.baseBag.method='key_identity_count';
        this.baseBag.data={};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 接入厂商(data_count//firm_count)
       * }
       * 
       */
      inFirmCount(){
        this.baseBag.target='data_count';
        this.baseBag.method='firm_count';
        this.baseBag.data={};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 真实身份统计(data_count//certificate_count)
       * }
       * 
       */
      certificateCount(){
        this.baseBag.target='data_count';
        this.baseBag.method='certificate_count';
        this.baseBag.data={};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 虚拟身份统计(data_count//virtual_count)
       * }
       * 
       */
      virtualCount(){
        this.baseBag.target='data_count';
        this.baseBag.method='virtual_count';
        this.baseBag.data={};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * 获取远程数据接口(/interface/get)
       * {
       * }
       * 
       */
      getInterface(){
        this.baseBag.target='interface';
        this.baseBag.method='get';
        this.baseBag.data={};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 增加远程数据接口(/interface/add)
       * {
       *    name:''//名称
       *    host:''//主机名
       *    port:''//端口
       *    url:''//url地址
       *    note:''//说明
       *    isDefault:''//是否默认接口 0为非默认,1为默认
       * }
       * 
       */
      addInterface({name,host,port,url,note}){
        this.baseBag.target='interface';
        this.baseBag.method='add';
        this.baseBag.data={name:name || '',host:host || '',port:port || '',url:url || '',note:note || '',isDefautl:0};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 修改远程数据接口(/interface/update)
       * {
       *    name:''//名称
       *    host:''//主机名
       *    port:''//端口
       *    url:''//url地址
       *    note:''//说明
       *    isDefault:''//是否默认接口 0为非默认,1为默认
       * }
       * 
       */
      updateInterface({id,name,host,port,url,note}){
        this.baseBag.target='interface';
        this.baseBag.method='update';
        this.baseBag.data={id:id,name:name || '',host:host || '',port:port || '',url:url || '',note:note || '',isDefault:0};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 删除远程数据接口(/interface/del)
       * {
       *    Id:''
       * }
       * 
       */
      delInterfase(id){
        this.baseBag.target='interface';
        this.baseBag.method='del';
        this.baseBag.data={id:id};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * 保存本地数据源配置结构(/upload/table_schema)
       * 
       */
      saveTableSchema(data){
        this.baseBag.target='upload';
        this.baseBag.method='table_schema';
        this.baseBag.data=data || {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 获取场所统计数据接口(该接口用于场所描点插件，因为数据量过大才调用该接口改为提取统计数据来显示)(/data_count/region_site_count)
       * 
       */
      GetPlaceCount(data){
        this.baseBag.target='data_count';
        this.baseBag.method='region_site_count';
        this.baseBag.data=data || {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 获取地区
       * 
       */
      GetRegion(){
        this.baseBag.target='data';
        this.baseBag.method='region';
        this.baseBag.data= {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * 获取厂商
       * 
       */
      GetFirm(){
        this.baseBag.target='data';
        this.baseBag.method='firm';
        this.baseBag.data= {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * 获取数据源
       * 
       */
      GetMicroprobe(){
        this.baseBag.target='data';
        this.baseBag.method='microprobe_type';
        this.baseBag.data= {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * 导出在离线统计数据(首页)
       * 
       * 
       */
      ExportOnlineCount({firm_id,timeType}){
        this.baseBag.target='data_export';
        this.baseBag.method='all_firm_online_offline';
        this.baseBag.data= {firm_id:firm_id || '',timeType:timeType || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 导出详情统计数据(首页)
       * 
       * 
       */
      ExportDetailCount({region,firm_id,microprobe_type,date}){
        this.baseBag.target='data_export';
        this.baseBag.method='firm_region_day_count';
        this.baseBag.data= {region:region || '',firm_id:firm_id || '',microprobe_type:microprobe_type || '',date:date || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 注销账户(首页)
       * 
       * 
       */
      LoginOut(account){
        this.baseBag.target='user';
        this.baseBag.method='logout';
        this.baseBag.data= {account:account || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 账户强制登录(首页)
       * 
       * 
       */
      LoginForce(account){
        this.baseBag.target='user';
        this.baseBag.method='login_force';
        this.baseBag.data= {account:account || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * CCIC报警记录
       * param:{
       *  crime_id:'',//为空就所有(人员ID)
       *  limit:0,    //返回结果记录数 0为不限制
       *  skip:0,     //跳过记录数
       *  log_id:0    //
       * }
       * 
       */
      CCICPoliceData({crime_id,limit,skip,log_id,customer_name,certificate_code,certificate_type,netbar_wacode,mac}){
        this.baseBag.target='criminal';
        this.baseBag.method='getdata';
        this.baseBag.data= {crime_id:crime_id || '',limit:limit || 0,skip:skip || 0,log_id:log_id || 0,
                            customer_name:customer_name || '',
                            certificate_code:certificate_code || '',
                            certificate_type:certificate_type || '',
                            netbar_wacode:netbar_wacode || '',
                            mac:mac || ''
                          };
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * CCIC添加人员信息
       * param:{
       *  certificate_type:'',//身份证件类型
       *  certificate_code:'',    //身份证件号码
       *  customer_name:'',     //姓名
       *  crime_match_mode:''  //匹配模式
       * }
       * 
       */
      CCICAddPerson({certificate_type,certificate_code,customer_name,crime_match_mode}){
        this.baseBag.target='criminal';
        this.baseBag.method='add';
        this.baseBag.data= {certificate_type:certificate_type || '',certificate_code:certificate_code || '',customer_name:customer_name || '',crime_match_mode:crime_match_mode || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * CCIC删除人员信息
       * param:{
       *  crime_id:''
       * }
       * 
       */
      CCICDelPerson(crime_id){
        this.baseBag.target='criminal';
        this.baseBag.method='del';
        this.baseBag.data= {crime_id:crime_id || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * CCIC获取人员信息
       * param:{
       *  crime_id:''
       *  limit:0,    //返回结果记录数 0为不限制
       *  skip:0,     //跳过记录数
       * }
       * 
       */
      CCICGetPerson({crime_id,limit,skip,customer_name,certificate_code,crime_match_mode}){
        this.baseBag.target='criminal';
        this.baseBag.method='get';
        this.baseBag.data= {crime_id:crime_id || '',limit:limit || 0,skip:skip || 0,customer_name:customer_name || '',certificate_code:certificate_code || '',crime_match_mode:crime_match_mode || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * 获取证件类型
       * param:{
       * }
       * 
       */
      GetCertificateType(){
        this.baseBag.target='data';
        this.baseBag.method='certificate_type';
        this.baseBag.data= {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * 获取匹配模式
       * param:{
       * }
       * 
       */
      GetMatchMode(){
        this.baseBag.target='data';
        this.baseBag.method='crimeMatch_mode';
        this.baseBag.data= {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      } 

      /**
       * 详情统计列表统计(首页)
       * param:{
       * }
       * 
       */
      DetailListCount({firm_id,receive_time_start,receive_time_end}){
        this.baseBag.target='data_count';
        this.baseBag.method='all_firm_type_clean';
        this.baseBag.data= {firm_id:firm_id,receive_time_start:receive_time_start,receive_time_end:receive_time_end};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      
      /**
       * 详情统计列表统计导出(首页)
       * param:{
       * }
       * 
       */
      DetailListExport({firm_id,date}){
        this.baseBag.target='data_export';
        this.baseBag.method='all_firm_type_clean';
        this.baseBag.data= {firm_id:firm_id || '',receive_time_start:date.split(',')[0],receive_time_end:date.split(',')[1]};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * 获取新的token
       */
      GetNewToken(token){
        this.baseBag.target='user';
        this.baseBag.method='refreshToken';
        this.baseBag.data= {token:token || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 获取虚拟身份类型
       */
      GetVirType({key}){
        this.baseBag.target='data';
        this.baseBag.method='get_account_type';
        this.baseBag.data= {key:key || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * 同行频次统计
       * 
       */
      AnalyRateCount(id){
        this.baseBag.target='analy_task';
        this.baseBag.method='get_together_stat';
        this.baseBag.data= {task_id:id || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
    
      //#region 上传数据源

      /**
       * 上传数据源名称是否存在
       * params:{
       *   name:''
       * }
       */
      upload_dataSourceName_exist(name){
        this.baseBag.target='upload';
        this.baseBag.method='datasource_name_exist';
        this.baseBag.data= {name:name || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * 添加上传数据源(弃用)
       * params:{
       *   webConfig:{},//前端展示配置
       *   dbConfig:{}  //数据存储配置
       * }
       */
      upload_add_dataSource({webConfig,dbConfig}){
        this.baseBag.target='upload';
        this.baseBag.method='add_datasource';
        this.baseBag.data= {webConfig:webConfig || {},dbConfig:dbConfig || {}};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 添加上传数据源
       * params:{
       *   
       * }
       */
      upload_add_dataSource_new(data){
        this.baseBag.target='upload';
        this.baseBag.method='add_datasource';
        this.baseBag.data= data || {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 获取上传数据源
       * params:{
       * }
       */
      upload_get_dataSource({key}){
        this.baseBag.target='upload';
        this.baseBag.method='get_datasource';
        this.baseBag.data= {key:key || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * 获取文件分隔符
       * params:{
       * }
       */
      file_seperator(){
        this.baseBag.target='data';
        this.baseBag.method='get_seperator';
        this.baseBag.data= {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      
      /**
       * 获取字段类型
       * params:{
       * }
       */
      fieldType(){
        this.baseBag.target='data';
        this.baseBag.method='get_config_column';
        this.baseBag.data= {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * 添加文件转化格式
       * params:{
       *    encoding:"",
            col_seperator:"",
            row_seperator:"",
            is_first_column_name:false,        
            datasource:"",        
            columns:[],
            microprobe_type:"",
            filters:[],
       * }
       */
      upload_add_fileparse(data){
        this.baseBag.target='upload';
        this.baseBag.method='add_fileparse';
        this.baseBag.data= data || {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * 修改文件转化格式
       * params:{
       *    code:"",
            file_name_filters:[],
            ftp:''
       * }
       */
      upload_update_fileparse({code,file_name_filters,ftp_is_open}){
        this.baseBag.target='upload';
        this.baseBag.method='update_fileparse';
        this.baseBag.data= {id:code || '',file_name_filters:file_name_filters || [],ftp_is_open:ftp_is_open || false};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }
      /**
       * 获取文件转化格式
       * params:{
       *    dataSource
       * }
       */
      upload_get_fileparse({dataSource,type}){
        this.baseBag.target='upload';
        this.baseBag.method='get_fileparse';
        this.baseBag.data={code:dataSource || '',type:type || ''};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * 删除文件转化格式
       * params:{
       *   code:''
       * }
       */
      upload_del_fileparse(id){
        this.baseBag.target='upload';
        this.baseBag.method='del_fileparse';
        this.baseBag.data= {id:id || {}};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * 上传数据源文件
       * params:{
       *   code:''
       * }
       */
      upload_dataSource_file(code){
        this.baseBag.target='upload';
        this.baseBag.method='file';
        this.baseBag.data= {code:code || {}};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      //#endregion

      /**
       * 获取操作日志
       * params:{
          user_id: ‘’，
          account:’’,
          result_type=’’, 成功/失败
          skip:’’,
          limit:’’
        }
       */
      oper_log(data){
        this.baseBag.target='operation_log';
        this.baseBag.method='get';
        this.baseBag.data=data || {};
        return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
      }

      /**
       * 创建快搜
       * params:{
          name:’’,  //名称
          originalObj: {}   //配置
        }
       */
    addQuickSearch(data){
      this.baseBag.target='quick_search';
      this.baseBag.method='add';
      this.baseBag.data=data || {};
      return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    }

    /**
     * 获取快搜
     * params:{
        keyid
      }
      */
    getQuickSearch(keyid){
      this.baseBag.target='quick_search';
      this.baseBag.method='get';
      this.baseBag.data={keyid:keyid || ''};
      return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    }

    /**
     * 删除快搜
     * params:{
        keyid
      }
      */
    delQuickSearch(keyid){
      this.baseBag.target='quick_search';
      this.baseBag.method='del';
      this.baseBag.data={keyid:keyid || ''};
      return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    }

    /**
     * 修改快搜
     * params:{
        keyid
      }
      */
    updateQuickSearch(config){
      this.baseBag.target='quick_search';
      this.baseBag.method='update';
      this.baseBag.data={config:config || ''};
      return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    }

    /**
     * 设置默认使用快搜
     * params:{
        keyid
      }
      */
    useQuickSearch(keyid){
      this.baseBag.target='quick_search';
      this.baseBag.method='update_default_use';
      this.baseBag.data={keyid:keyid || ''};
      return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    }

    /**
     * 快搜预览数据
     * params:{
        dbkey:[],//多个数据源用逗号分隔
        limit:0,//显示多少条数据
      }
      */
    previewQucikSearch({dbkey,format_fields,limit}){
      this.baseBag.target='quick_search';
      this.baseBag.method='preview';
      
      this.baseBag.data={dbkey:dbkey || [],format_fields:format_fields || [],limit:limit || ''};
      return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    }

    /**
     * 快搜数据
     * params:{
        keyword：'',搜索关键字
        pageIndex:0,//页号
      }
      */
    getDataQuickSearch({keyword,pageIndex}){
      this.baseBag.target='quick_search';
      this.baseBag.method='getdata';
      this.baseBag.data={keyword:keyword || '',pageIndex:pageIndex || 0};
      return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    }
    /**
     * 获取菜单类别
     * params:{
        title: ‘’, 
        id:  0, 
        isDel: 0,  //0为不能删
        isDefault: 1  //1为默认菜单类型，0为不是默认

      }
      */
    GetMenuKind(data){
      this.baseBag.target='menu_type';
      this.baseBag.method='get';
      this.baseBag.data=data || {};
      return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    }

    /**
     * 添加菜单类别
     * params:{
        title: ‘’, 
      }
      */
    AddMenuKind({title,icon}){
      this.baseBag.target='menu_type';
      this.baseBag.method='add';
      this.baseBag.data={title:title || '',icon:icon || ''};
      return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    }

    /**
     * 删除菜单类别
     * params:{
        id: ‘’, 
    }
    */
    DelMenuKind(id){
      this.baseBag.target='menu_type';
      this.baseBag.method='del';
      this.baseBag.data={id:id || ''};
      return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    }
    /**
     * 获取范围地图热力图数据
     * params:{
        task_id: ‘’, //任务ID
        reg_index:0,//所在索引
    }
    */
    MapDataRange({id,index}){
      this.baseBag.target='analy_trace_task';
      this.baseBag.method='getMapDataRange';
      this.baseBag.data={task_id:id || '',reg_index:index};

      return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    }


    
    /**
     * 修改菜单类别顺序
     * params:{
        id: [id...], 
    }
    */
    OrderMenuKind(ids){
      this.baseBag.target='menu_type';
      this.baseBag.method='update_orderby';
      this.baseBag.data={orderby:ids || []};
      return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    }

    /**
     * 获取菜单回溯信息
     * 
     * params:{
        keyid: [id...], 
     }
    */
    MenuBacktrackInfo(keyid){
      this.baseBag.target='custom_module';
      this.baseBag.method='get_menu_backtrack_info';
      this.baseBag.data={keyid:keyid || ''};
      return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    }

    /*********************** 例子接口 ******************************/
    //#region 例子接口
    /**
     * 获取同行分析组
     * 
     * params:{
       
     }
    */
    TogetherTeam(){
      this.baseBag.target='analy_task';
      this.baseBag.method='get_together_team';
      this.baseBag.data={};

      return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    }

    /**
     * 获取同行分析组MAC轨迹
     * 
     * params:{
        mac:''
     }
    */
    TogetherTeamTrack({mac,indexArray}){
      this.baseBag.target='analy_task';
      this.baseBag.method='get_together_team_track';
      this.baseBag.data={mac:mac || '',indexArray:indexArray || []};

      return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    }

    /**
     * 获取同行分析组主MAC轨迹
     * 
     * params:{
        mac:''
     }
    */
    TogetherTeamMainTrack(){
      this.baseBag.target='analy_task';
      this.baseBag.method='get_together_team_main_mac_track';
      this.baseBag.data={};

      return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    }
    //#endregion

    /**
     * 获取场所在离线地图数据
     * 
     * params:{
        ditu:''
     }
    */
    SiteMapData(ditu){
      this.baseBag.target='site';
      this.baseBag.method='getMapData';
      this.baseBag.data=ditu;

      return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    }
    /**
     * 获取设备在离线地图数据
     * 
     * params:{
        ditu:''
     }
    */
    EquipmentMapData(ditu){
      this.baseBag.target='equipment';
      this.baseBag.method='getMapData';
      this.baseBag.data=ditu;

      return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
    }

    /**
     * 获取MAC热力地图数据
     * 
     * params:{
        ditu:''
     }
    */
   MacMapData(ditu){
    this.baseBag.target='terminal_mac';
    this.baseBag.method='getMapData';
    this.baseBag.data=ditu;
    return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
   }
   /**
     * 获取轨迹分析
     * 
     * params:{
        trace_key:'' //关键字
        key_type:'',//关键类型
        start_time:'',//开始时间 时间戳
        end_time:'',//结束时间 时间戳
        locus_ids:'',//区域逗号分隔
     }
    */
   AnalyTraceTask(data){
    this.baseBag.target='analy_trace_task';
    this.baseBag.method='search';
    this.baseBag.data=data;
    return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
   }

   /**
     * 获取历史轨迹分析
     * 
     * params:{
      
     }
    */
   AnalyTraceHistory(){
    this.baseBag.target='analy_trace_task';
    this.baseBag.method='get';
    this.baseBag.data={};
    return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
   }
   /**
     * 获取历史轨迹分析
     * 
     * params:{
        task_id:''//任务ID
     }
    */
  DelTraceHistory(id){
    this.baseBag.target='analy_trace_task';
    this.baseBag.method='del';
    this.baseBag.data={task_id:id};
    return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
  }

  /**
   * 获取轨迹分析任务结果
   * 
   * params:{
      task_id:''//任务ID
    }
  */
  GetAnalyTraceTask(id){
    this.baseBag.target='analy_trace_task';
    this.baseBag.method='getdata';
    this.baseBag.data={task_id:id};
    return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
  }

/**
 * 获取关注人员
 * 
 * params:{
    key:''//关注人员标识
    skip:'',
    limit:'',
    sort_by:'alarm_last_time"\"alarms',
    tag_id:''
    not_define:'',
  }
  */
 GetFocusPerson(data){
  this.baseBag.target='focus_people';
  this.baseBag.method='get';
  this.baseBag.data=data;
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
 }
 /**
 * 关注人员修改姓名
 * 
 * params:{
    focus_id:''//关注ID
    focus_title:'', //关注标题
  }
  */
 UpdateFocusPersonName(data){
  this.baseBag.target='focus_people';
  this.baseBag.method='update_title';
  this.baseBag.data=data;
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
 }
 /**
 * 关注人员修改关注区域
 * 
 * params:{
    focus_id:''//关注ID
    focus_locus_ids:'', //关注区域
  }
  */
 UpdateFocusPersonRegion(data){
  this.baseBag.target='focus_people';
  this.baseBag.method='update_locus_ids';
  this.baseBag.data=data;
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
 }
/**
 * 关注人员添加关注特征
 * 
 * params:{
    focus_id:''//关注ID
    focus_property_item：{
      k: ‘’, //查询关键字
      t: ‘’, //mac,mobile,virtual,cert
      n: ‘’ //如果virtual,cert就是类型
    }

  }
  */
 AddFocusPersonProperty(data){
  this.baseBag.target='focus_people';
  this.baseBag.method='add_property';
  this.baseBag.data=data;
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
 }
 /**
 * 关注人员删除关注特征
 * 
 * params:{
    focus_id:''//关注ID
    focus_property_item：{
      k: ‘’, //查询关键字
      t: ‘’, //mac,mobile,virtual,cert
      n: ‘’ //如果virtual,cert就是类型
    }

  }
  */
 DelFocusPersonProperty(data){
  this.baseBag.target='focus_people';
  this.baseBag.method='del_property';
  this.baseBag.data=data;
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
 } 
 /**
 * 关注人员添加关注标签
 * 
 * params:{
    focus_ids:[0,0,0]//关注ID
    tag_id:'', 
  }
  */
 AddMoreFocusPersonProperty(data){
  this.baseBag.target='focus_people';
  this.baseBag.method='add_focus_tags';
  this.baseBag.data=data;
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
 }
 /**
 * 关注人员删除关注标签
 * 
 * params:{
    focus_ids:[0,0,0]//关注ID
    tag_id:'', 
  }
  */
 DelMoreFocusPersonProperty(data){
  this.baseBag.target='focus_people';
  this.baseBag.method='del_focus_tags';
  this.baseBag.data=data;
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
 }
/**
 * 关注人员添加
 * 
 * params:{
    focus_title: '',  //姓名
    focus_property: [
      {
        k: ‘’, //查询关键字
        t: ‘’, //mac,mobile,virtual,cert
        n: ‘’ //如果virtual,cert就是类型
      }
      …
    ],
    focus_tags: [1,2,3] // tag_id 的数组
    focus_locus_ids: [‘50000’] //区域数组
    alarm_type:[],  //报警类型
      [
              {name: ‘邮件’, value: 'email'},
              {name: ‘短信’, value: 'sms'},
              {name: '网站', value: 'web'}
      ];

	  alarm_account:{}    //  {email:[], sms:[], web:[]}

  }
  */
 AddFocusPerson(data){
  this.baseBag.target='focus_people';
  this.baseBag.method='add';
  this.baseBag.data=data;
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
 }
  /**
 * 关注人员修改
 * 
 * params:{
    tag_title:''
  }
  */
UpdateFocusPerson(data){
  this.baseBag.target='focus_people';
  this.baseBag.method='update';
  this.baseBag.data=data;
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
}
  /**
 * 关注人员标签添加
 * 
 * params:{
    tag_title:''
  }
  */
 AddFocusPersonLabel(data){
  this.baseBag.target='focus_people_tag';
  this.baseBag.method='add';
  this.baseBag.data=data;
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
 }
 /**
 * 关注人员标签修改
 * 
 * params:{
 *  tag_id:0
    tag_title:''
  }
  */
 UpdateFocusPersonLabel(data){
  this.baseBag.target='focus_people_tag';
  this.baseBag.method='update';
  this.baseBag.data=data;
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
 }
 /**
 * 关注人员标签删除
 * 
 * params:{
 *  tag_id:0
  }
  */
 DelFocusPersonLabel(data){
  this.baseBag.target='focus_people_tag';
  this.baseBag.method='del';
  this.baseBag.data=data;
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
 }
 /**
 * 关注人员标签获取
 * 
 * params:{
 *  tag_title:0
  }
  */
 GetFocusPersonLabel(data){
  this.baseBag.target='focus_people_tag';
  this.baseBag.method='get';
  this.baseBag.data=data;
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
 }

 GetTagCount({id,not_define}){
  this.baseBag.target='focus_people';
  this.baseBag.method='tag_count';
  this.baseBag.data={tag_id:id,not_define:!!not_define};
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
 }
 //删除关注人员
 DelFocusPerson(data){
  this.baseBag.target='focus_people';
  this.baseBag.method='del';
  this.baseBag.data=data;
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
 }
 /**
 * 最短路径
 * 
 * params:{
 *   first_key: '',   //关键字1
 *   second_key: ''  //关键字2
  }
  */

  AddShortPath(data){
    this.baseBag.target='analy_shortpath_relation';
    this.baseBag.method='add';
    this.baseBag.data=data;
    return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
  }
  /**
   * 获取最短路径
   * 
   * params:{
      }
    */
   GetShortPath(){
    this.baseBag.target='analy_shortpath_relation';
    this.baseBag.method='get';
    this.baseBag.data={};
    return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
  }
/**
 * 删除最短路径
 * 
 * params:{
 *   task_id: '',   //任务ID
 *   
  }
  */

 DelShortPath(data){
    this.baseBag.target='analy_shortpath_relation';
    this.baseBag.method='del';
    this.baseBag.data=data;
    return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
  }
 /**
 * 获取最短路径结果
 * 
 * params:{
 *   task_id: '',   //任务ID
 *   
  }
  */
 GetShortPathRes(data){
  this.baseBag.target='analy_shortpath_relation';
  this.baseBag.method='getdata';
  this.baseBag.data=data;
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
 }

 /**
 * 一键搜查询
 * 
 * params:{
 *   task_target_type:'' //任务类型
 *   account_type:'', //虚拟身份类型(当任务类型为虚拟身份时才需要)
 *   keyword:'', //关键字
 *   
  }
  */
 OneSearch(data){
  this.baseBag.target='correlation_task';
  this.baseBag.method='getdata_count';
  this.baseBag.data=data;
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
 }
/**
 * 获取民族信息
 * 
 * params:{
 *   
  }
  */
GetNation(){
  this.baseBag.target='data';
  this.baseBag.method='get_nation';
  this.baseBag.data={};
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
}
/**
 *获取网约车统计图
 * 
 * params:{
 * task_id: ‘’,
	 type:’’ //day 按时间统计    from 按出发地统计    to 按目的地统计

 *     
  }
  */
 GetCarhailingChart(data){
  this.baseBag.target='analy_task';
  this.baseBag.method='get_carhailing_chart';
  this.baseBag.data=data;
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
 }
 /**
 *获取网约车人员信息列表
 * 
 * params:{
 * task_id: ‘’,

 *     
  }
  */
 GetCarhailingPersonList(data){
  this.baseBag.target='analy_task';
  this.baseBag.method='get_carhailing_passengers';
  this.baseBag.data=data;
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
 }

  /**
 *获取网约车出发地列表列表
 * 
 * params:{
 * task_id: ‘’,

 *     
  }
  */
 GetCarhailingFromplaceList(data){
  this.baseBag.target='analy_task';
  this.baseBag.method='get_carhailing_fromplace';
  this.baseBag.data=data;
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
 }

  /**
 *获取网约车目的地列表列表
 * 
 * params:{
 * task_id: ‘’,

 *     
  }
  */
 GetCarhailingToplaceList(data){
  this.baseBag.target='analy_task';
  this.baseBag.method='get_carhailing_toplace';
  this.baseBag.data=data;
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
 }

  /**
 *获取车船出行统计图
 * 
 * params:{
 * task_id: ‘’,

 *     
  }
  */
GetVehicleChart(data){
  this.baseBag.target='analy_task';
  this.baseBag.method='get_vehicle_chart';
  this.baseBag.data=data;
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
}

 /**
 *获取车船出行人员列表
 * 
 * params:{
 * task_id: ‘’，
   type: ‘’//in 进入 out 出行,
	 limit: 10,
	 skip: 0


 *     
  }
  */
 GetVehiclePersonList(data){
  this.baseBag.target='analy_task';
  this.baseBag.method='get_vehicle_list';
  this.baseBag.data=data;
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
}

/**
 *获取车船出行同行人群
 * 
 * params:{
 * task_id: ‘’，
 *     
  }
  */
 GetVehicleTeam(data){
  this.baseBag.target='analy_task';
  this.baseBag.method='get_vehicle_team';
  this.baseBag.data=data;
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
}
/**
 *获取可疑快递信息
 * 
 * params:{
 * task_id: ‘’，
 *     
  }
  */
 GetDangerExpress(data){
  this.baseBag.target='analy_task';
  this.baseBag.method='get_danger_express';
  this.baseBag.data=data;
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
 }

 /**
 *获取可疑人员列表
 * 
 * params:{
 * task_id: ‘’，
 * limit:0,
 * skip:0
  }
  */
 GetDangerExpressList(data){
  this.baseBag.target='analy_task';
  this.baseBag.method='get_danger_express_receiver';
  this.baseBag.data=data;
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
 }
 
 /**
 *获取可疑人员列表
 * 
 * params:{
 * task_id: ‘’，

  }
  */
 GetDangerExpressListLoaction(data){
  this.baseBag.target='analy_task';
  this.baseBag.method='get_danger_express_location';
  this.baseBag.data=data;
  return post(this.uri+'/'+this.baseBag.target+'/'+this.baseBag.method,this.baseBag);
 }
 
  /**
 *获取可疑人员头像
 * 
 * params:{
 * certcode: ‘’，

  }
  */
 GetPersonPhoto(cert){
  return post(this.url+'/'+'cert'+'/'+cert);
 }
}

module.exports = new server(baseBag,baseUri,url);