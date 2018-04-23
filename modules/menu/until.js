//通用函数包
export default{
    //根据表对象获取对应的字段显示信息
    FieldsInfo(d){
        if(!d){return [];}
        //表索引字段
        let indexs=_.chain(d.indexFields || {requisite:[],notRequisite:[]}).values().flatten().value().join(',');
        //表字段相关操作(增删改查)
        let action =d.action || {};


        let fields=_.map(tool.Clone(d.fields),f=>{
            f.tableKey=d.key;
            f.tableName=d.name;
            f.isIndex=(','+indexs+',').indexOf(','+f.key+',')>=0;
            f.action_option=_.compact([
                (action.add || {fields:[]}).fields.indexOf(f.key)>=0?{name:'新增',icon:'fa fa-plus'}:'',
                (action.update || {fields:[]}).fields.indexOf(f.key)>=0?{name:'修改',icon:'fa fa-pencil'}:'',
                action.del?{name:'删除',icon:'fa fa-remove'}:'',
                action.detail?{name:"详细",icon:'fa fa-tasks'}:''
            ]);

            return f;
        });
        return fields;
    },
    //构建字段在设置条件页面需要的配置数据
    strcField(f){
        if(!f) return [];
        let pros=[
            {name:'showName',val:'',map:'name'},//显示名称
            {name:'width',val:'',map:'columnW'},   //列宽
            {name:'blnShow',val:0},  //是否显示
            {name:'fieldType',val:'0'}, //字段类型
            {name:'formatType',val:'0'},//字段格式化类型
            {name:'Format_express',val:''},//格式化
            {name:'groupFields',val:''},//组合字段
            {name:'Format_group_express',val:''},//组合格式化
            {name:'remoteFields',val:[]},//远程字段
            {name:'fun',val:''},//后端格式参数
            {name:'mask',val:''},//前端查询条件遮罩类型
            {name:'searchFormat',val:''},//查询格式化
        ];

        if(f instanceof Array){
            f=_.map(f,c=>{
                for(let i=0;i<pros.length;i++){
                    c[pros[i].name]=c[pros[i].name] || c[pros[i].map] || pros[i].val;
                    c.alias=(c.tableKey || c.table) +'_'+c.key;
                }
                return c;
              });
        }else{
            for(let i=0;i<pros.length;i++){
                f[pros[i].name]=f[pros[i].name] || f[pros[i].map] || pros[i].val;
                f.alias=(f.tableKey || f.table)+'_'+f.key;
            }
        }
        return f;
    },
}