//数据源数据结构

export let lib={
    name:'',//数据源所属库名称
    icon:'',//所属库显示ICON
    tables:{}//关联数据源集合
};


export let table={
    name:'',//表名
    key:'',//表关键字名字
    desc:'',//表描述信息
    indexFields:{requisite:[],notRequisite:[]},//表索引字段(用于设置限定条件时使用)
    fields:{},//表关联字段集合
};

export let field={
    name:'',//字段名
    key:'',//字段关键字
    desc:'',//字段描述
    type:'',//字段类型
    mask:'',//掩码类型
    fun:'',//字段显示格式
    _data_type:'',//后端字段数据类型
    file_column:'',//文件解析列名
    def_val:'',//文件解析缺省值
    _format:'',//文件解析格式化函数
    firstParam:'',//文件解析格式化函数相关参数
    senondParam:'',//文件解析格式化函数相关参数
    indexType:0,//(0:普通字段,1:本地索引,2:通用索引)
    primeKey:0,//(0:普通字段,1:主键字段(前端用来进行增删改查),2:后端主键(后端用来创建数据结构主键))
    defval:'',//字段默认值(用于设置查询条件)
    referval:[],//字段设置查询条件时,选择默认值的筛选条件
};