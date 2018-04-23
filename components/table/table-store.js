//列表仓库

//变化操作(内部使用)
mutations={
    //添加列
    insertColumn(states,column,index){
        states.columns.splice(index,0,column);
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