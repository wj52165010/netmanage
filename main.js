import store from './store/index'
import Vue from 'vue'
//import VueRouter from 'vue-router'
import App from './App'
import routes from './router'
import './css/app.less'
import 'bootstrap/less/bootstrap.less'
import '../static/font-awesome-4.7.0/less/font-awesome.less'
import {BODY_RESIZE_REG,BODY_MOUSEMOVE_REG,Reg_Menu_Change,Reg_Date_Source_Del,Reg_fieldChange_Even,Reg_Page_Switch} from './store/mutation-types'
import 'element-ui/lib/theme-default/index.css'
// import {tool} from'./js/tool.js'
import {Dropdown,DropdownMenu,DropdownItem,Button,ButtonGroup,Select,Option,OptionGroup,InputNumber,
        Tooltip,Steps,Step,Input,DatePicker,Table,TableColumn,Pagination,Checkbox,CheckboxGroup,RadioGroup,
        Radio,Tabs,TabPane,Slider,Switch,TimePicker,TimeSelect
       } from 'element-ui'

// import ctable from 'components/table/table'
// import ccolumn from 'components/table/tableColumn'

// Vue.component(ctable.name,ctable);
// Vue.component(ccolumn.name,ccolumn);


let Rx = require('rxjs/Rx');

//注册页面大小改变
store.commit(BODY_RESIZE_REG,{event:Rx.Observable.fromEvent(window,'resize').debounceTime(200),sub:new Rx.Subject()});
//注册页面鼠标移动监听事件
store.commit(BODY_MOUSEMOVE_REG,{event:Rx.Observable.fromEvent(window,'mousemove'),sub:new Rx.Subject()});
//注册菜单改变监听对象
//store.commit(Reg_Menu_Change,new Rx.Subject());
//注册选择字段数据改变监听对象
store.commit(Reg_fieldChange_Even,new Rx.Subject());
//注册数据源删除事件监听对象
store.commit(Reg_Date_Source_Del,new Rx.Subject());
//注册页面切换事件
store.commit(Reg_Page_Switch,new Rx.Subject());

Vue.component(TimeSelect.name,TimeSelect);
Vue.component(TimePicker.name,TimePicker);
Vue.component(Switch.name,Switch);
Vue.component(Dropdown.name, Dropdown);
Vue.component(DropdownMenu.name, DropdownMenu);
Vue.component(DropdownItem.name, DropdownItem);
Vue.component(Button.name, Button);
Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.component(OptionGroup.name, OptionGroup);
Vue.component(InputNumber.name, InputNumber);
Vue.component(ButtonGroup.name, ButtonGroup);
Vue.component(Tooltip.name, Tooltip);
Vue.component(Steps.name, Steps);
Vue.component(Step.name, Step);
Vue.component(Input.name, Input);
Vue.component(DatePicker.name, DatePicker);
Vue.component(Table.name, Table);
Vue.component(TableColumn.name, TableColumn);
Vue.component(Pagination.name, Pagination);
Vue.component(CheckboxGroup.name,CheckboxGroup);
Vue.component(Checkbox.name,Checkbox);
Vue.component(RadioGroup.name,RadioGroup);
Vue.component(Radio.name,Radio);
Vue.component(Tabs.name,Tabs);
Vue.component(TabPane.name,TabPane);
Vue.component(Slider.name,Slider);

//全局验证配置方法
Vue.mixin({
  methods:{
    verify(data){
      if(!data){return false;}
      let condtion=data.condtionsObj;
      //判断去重字段是否填写
      if(!condtion.distinct_fields && condtion.query_kind.indexOf('show')<0){
        tool.info('去重字段必填!');
        return false;
      }
      //判断限定条件是否填写
      if((!condtion.params || !condtion.params.term) && condtion.query_kind.indexOf('show')<0){
        tool.info('请到设置条件页面设置限定条件!');
        return false;
      }

      return true;
    }
  }
});

/* eslint-disable no-new */
// Vue.use(VueRouter);
// const router = new VueRouter({
//   routes // short for routes: routes
// })

Vue.directive('init-hook', {
    bind:function(el,binding){
        if(binding.value.bindFn){
             binding.value.bindFn(el,(binding.value.data==undefined || binding.value.data==null)?'':binding.value.data);
        }
    },
    update:function(el,binding){
       if(binding.value.bindFn){
            binding.value.bindFn(el,(binding.value.data==undefined || binding.value.data==null)?'':binding.value.data);
       }
    }
});


//地图定位指令
// Vue.directive('map-pos',{
//   bind:function(el,binding){
//     $(el).bind('click',(e)=>{
      
//         tool.open(function(){
//           let html=``;
//           let {lng,lat}=binding.value;

//           let param={
//             title:'显示位置',
//             area:'600px',
//             content:`<div name="map_container" style="width:100%;height:400px;">${html}</div>`,
//             context:{},
//             success(layero){

//                 let map =  new BMap.Map(layero.find('div[name="map_container"]')[0],{minZoom:13,maxZoom:18});
//                 map.centerAndZoom(new BMap.Point(lng,lat),7);//重庆中心点
//                 map.enableScrollWheelZoom(true);

//                 var marker=new BMap.Marker(new BMap.Point(lng,lat));
//                 map.addOverlay(marker);
//             }
//           }

//           return param;
//       }());

//     });
//   },
//   unbind:function(el){
//     $(el).unbind('click');
//   }
// });

//节流阀事件
Vue.directive('throttle-even',{
  bind:function(el,binding){
    var even = Rx.Observable.fromEvent(el, binding.arg).auditTime(500);
    even.subscribe(()=>{
      if(!binding.value)return;
      binding.value();
    })
  }
});

Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})

Vue.mixin({
  data(){
    return {
      Menu_State:{
        createing:{val:0,code:'createing',info:'创建中...'},
        backtracking:{val:2,code:'backtracking',info:'回溯数据中'},
        backtracked:{val:5,code:'backtracked',info:'回溯完成'},
        monitoring:{val:3,code:'monitoring',info:'监听数据中'},
        completed:{val:4,code:'completed',info:'完成!'},
        aborted:{val:-1,code:'aborted',info:'出错!'},
        error:{val:-2,code:'error',info:'出错啦!'},
        getKey(str){
          switch(str){
            case '创建中':
              return 'createing';
            case '回溯':
              return 'backtracking';
            case '回溯完成':
              return 'backtracked';
            case '监听':
              return 'monitoring'
            case '完成':
              return 'completed';
            case '异常':
              return 'aborted';
            case '出错':
              return 'error';
          }
        },
        getRes(statusObj){
          return {val:4,info:'完成!'}
          if(!statusObj){return {val:-1};}
          statusObj=eval('('+statusObj+')');
          let status=statusObj.status,statusVal=this[status];
          if(statusVal.val<=0){return statusVal;}

          let completeStatus=statusObj.completeStatus || {},backtrack=completeStatus.backtrack,monitor=completeStatus.monitor;
          if(backtrack && monitor){
            let backStatus=this[backtrack],monitorStatus=this[monitor];
            if(backStatus.val<0 && monitorStatus.val<0){
              return {val:-1,info:'监听,回溯失败!'}
            }else if(backStatus.val>0 && monitorStatus.val<0){
              return {val:4,info:'回溯成功,监听失败!'}
            }else if(backStatus.val<0 && monitorStatus.val>0){
              return {val:4,info:'监听成功,回溯失败!'}
            }else {
              return {val:4,info:'完成!'}
            }
          }else if(backtrack && !monitor){
            return this[backtrack];     
          }else if(!backtrack && monitor){
            return this[monitor];
          }else{
            return statusVal;
          }
        }
      },
      //temp_state:[{label:'列表',value:1},{label:'图表',value:2},{label:'地图描点',value:3},{label:'地图路径',value:4}]
    }
  }
});

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  //router,
  store
})
