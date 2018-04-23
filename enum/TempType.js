//列表显示模板类型

let Temp_Type={
        '列表':{id:1,icon:'fa fa-list',name:'列表'},
        '图表':{id:2,icon:'fa fa-area-chart',name:'图表'},
        '地图描点':{id:3,icon:'fa fa-map-marker',name:'描点'},
        '地图路径':{id:4,icon:'fa fa-motorcycle',name:'路径'},
      };

export const tempType=Temp_Type;

//下拉框需要的数据结构
export const dropVal=(function(){
    let tempType=_.chain(Temp_Type);
    return tempType.map((val,key)=>{
        return {label:val.name,value:val.id,icon:val.icon};
    }).value();

})();


//Tag组件需要的数据结构
export const tagVal=(function(){
    let res={};
    _.each(Temp_Type,(val,key)=>{
        res[val.id]={name:val.name,icon:val.icon};
    });

    return res;
})();
