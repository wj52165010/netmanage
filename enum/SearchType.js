//查询添加类型
let Search_Type={
        '文本框':1,
        '日期':2,
        '日期范围':3,
        '下拉框':4,
        '场所控件':5,//只能选择场所
        '区域控件':6,//只能选择区域
        '派出所控件':7,//只能选择派出所
        '虚拟身份控件':8,
        '生日':9,//用于转变生日格式
        '远程字段':10,//远程字段格式
      };

export const searchType=Search_Type;

export const searchObj=_.map(Search_Type,(t,key)=>{return {id:t,name:key};})

export default (function(){
    let res={};
    Object.keys(Search_Type).forEach(key=>{
        res[Search_Type[key]]=key;
    });
    return  res;
})();

