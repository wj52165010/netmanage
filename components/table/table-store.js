//列表仓库

//变化操作(内部使用)
mutations={
    //添加列
    insertColumn(states,column,index){
        let blnArr=column instanceof Array;

        blnArr?states.columns.splice(index,0,...column):
               states.columns.splice(index,0,column) ;
    },
    //删除列
    deleteColumn(states){
        states.columns.splice(0,states.columns.length);
    },
    //重置列数据比较两个列集合是否存在差异(存在则替换)
    replaceColumn(states,column){
        states.columns=column;
    }
}

class TableStore{
   constructor(){
      //仓库状态对象
      this.states={
         columns:[]
      };
   }

   //触发状态改变事件
   comit(name,...args){
      if(!mutations[name]) return;

      mutations[name].apply(this,[this.states].concat(args));
   }
}


export default TableStore;