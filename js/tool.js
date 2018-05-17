// 工具包

import Vue from 'vue'

let tool={
    toString:Object.prototype.toString,
    valueFn:function(value) {return function() {return value;};},
    isUndefined:function(value){return typeof value === 'undefined';},
    isDefined:function(value){return typeof value !== 'undefined';},
    isObject:function(value){return value != null && typeof value === 'object';},
    isString:function(value){return typeof value === 'string';},
    isNumber:function(value){return typeof value === 'number';},
    isDate:function(value){return tool.toString.call(value) === '[object Date]';},
    isArray:function(value){return tool.toString.call(value) === '[object Array]';},
    isFunction:function(value){return typeof value === 'function';},
    isRegExp:function(value) {return tool.toString.call(value) === '[object RegExp]';},
    isFile:function(obj) {return tool.toString.call(obj) === '[object File]';},
    isBoolean:function(value) {return typeof value === 'boolean';},
    isWindow:function(obj) {return obj && obj.document && obj.location && obj.alert && obj.setInterval;},
    guid() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },
    msg(res,successMsg,faildMsg){
         let blnSuccessed=res.msg.code=='successed';
         faildMsg=faildMsg || res.msg.note;
         if(blnSuccessed){
             if(!successMsg){return blnSuccessed;}
             layer.msg(successMsg);
         }else{
             if(faildMsg){
                 layer.msg(faildMsg);
             }
         }

         return blnSuccessed;
    },
    iconMsg(msg,icon){
        icon=icon || 'fa-li fa fa-spinner fa-spin';
        return layer.msg(`<div style="height: 24px;color: white;position: relative;">
                    <i class="${icon}" style="font-size: 20px;position: absolute;left: -30px;"></i>
                    <span style="margin-left:10px;">${msg}</span>
                    </div>`,{shade:0.3,time:0});
    },
    closeMsg(index){
        layer.close(index);
    },
    //询问框
    confirm(title,option,...args){
      let okfuncCallback=function(){};
      if(args && args.length>=1){
        okfuncCallback=args.shift();
      }
      layer.confirm(title,{btn:option},(index)=>{okfuncCallback();layer.close(index);},...args);
    },
    //NoBtnComfirm
    NoBtnComfirm(title,option,...args){
        let okfuncCallback=function(){};
        if(args && args.length>=1){
            okfuncCallback=args.shift();
        }
        layer.confirm(title,{btn:option,closeBtn:false},(index)=>{okfuncCallback();layer.close(index);},...args);
    },
    info(msg){
        layer.msg(msg);
    },
    show(option){
        layer.open({
            type: 1,
            skin: 'layui-layer-rim', //加上边框
            title:option.title || '',
            area: option.area,
            content: option.content
        });
    },
    //用来判断递归执行完成后再执行
    counter:function(func,count){
        return {
            count:count || 1,
            add:function(){this.count++;},
            exec:function(){
                if(--this.count>0){return;}
                if(!arguments || arguments.length<=1){func(arguments);}
                else{
                    func.apply(this,arguments || []);
                }
            }
        };
    },
    /* 
    * 延迟触发函数
    * func:'触发函数'
    * context:触发上下文(该参数必须是持久对象)
    * delaytime:延迟触发时间(默认延迟500毫秒)
    */
    dr: function (func, context, delaytime) {
        delaytime = delaytime || 500;
        if (context.Fx_DelayTimerId) {
            clearTimeout(context.Fx_DelayTimerId);
            context.Fx_DelayTimerId = setTimeout(function () {
                delete context.Fx_DelayTimerId;
                func.apply(context, arguments || []);
            }, delaytime);
            return;
        }
        context.Fx_DelayTimerId = setTimeout(function () {
            delete context.Fx_DelayTimerId;
            func.apply(context, arguments || []);
        }, delaytime);
    },
    open(option){
        let contentHtml=option.content || '';
        var res = Vue.compile(contentHtml);
        let tempV= new Vue({
            watch:option.watch || {},
            data:option.context || {},
            components:option.components || {},
            methods:option.methods || {},
            mounted:option.mounted || function(){},
            computed:option.computed || {},
            render: res.render,
            staticRenderFns: res.staticRenderFns,
            store:option.store
        });

        let index=layer.open({
            type: 1,
            skin:(option.skin || ''),  //加上边框'layui-layer-rim '
            title:option.title || '',
            maxmin:option.maxmin || false,
            //shade: [1, 'transparent'],
            id:option.id || '',
            area:option.area || 'auto', //宽高
            offset:option.offset || '',
            move:option.move==undefined?'.layui-layer-title':option.move,
            content: `<div id="content"></div>`,
            full:option.full ||function(){},
            restore:option.restore || function(){},
            sizeChange:option.sizeChange || function(){},
            success: function(layero, index){
                tempV.$mount(layero.find('#content')[0]);
                option.close=()=>{layer.close(index)};
                option.selfData=tempV.$data;
                option.$refs=tempV.$refs;
                option.$vm=tempV;
                if(option.initMaxMin){layer.full(index);option.full && option.full();}
                if(option.success){option.success(layero, index);}
            },
            cancel:function(layero, index){
                if(option.pop_close){option.pop_close(layero, index);}
                tempV.$destroy();
            }
        });
    },
    hasPro(obj){
        let count=0;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
            count++;
            }
        }

        return count>0;
    },
    /* 
     * 字符串日期转化时间戳
     * timeStr:日期字符串(yyyy-MM-dd hh:mm:ss)
     */
    Timestamp:function(timeStr){
        let result;
        if(timeStr instanceof Date){
            result=this.DateFormat(timeStr,'yyyy-MM-dd hh:mm:ss');
        }else if(typeof(timeStr) ==  'string'){
            result=timeStr;
        }
        return Date.parse(result.replace(/-/g, "/"))/1000;
    },
    /* 
     * 将时间戳转化为指定日期格式
     * timestampStr:时间戳字符串
     * format:日期格式字符串(yyyy-MM-dd h:m:s)
     */
    DateByTimestamp:function(timestampStr,format){
        var dateFormat=function(dateobj){
            var date = {
                    "M+": dateobj.getMonth() + 1,
                    "d+": dateobj.getDate(),
                    "h+": dateobj.getHours(),
                    "m+": dateobj.getMinutes(),
                    "s+": dateobj.getSeconds(),
                    "q+": Math.floor((dateobj.getMonth() + 3) / 3),
                    "S+": dateobj.getMilliseconds()
            };
        if (/(y+)/i.test(format)) {
                format = format.replace(RegExp.$1, (dateobj.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
                if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1, RegExp.$1.length == 1
                            ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
                }
        }
        return format;				 
        };
        
        var newDate = new Date();
        newDate.setTime(timestampStr * 1000);
        
        return dateFormat(newDate);
    },
    DateFormat(dateobj,format){
        if(!dateobj) return '';
        var date = {
                    "M+": dateobj.getMonth() + 1,
                    "d+": dateobj.getDate(),
                    "h+": dateobj.getHours(),
                    "m+": dateobj.getMinutes(),
                    "s+": dateobj.getSeconds(),
                    "q+": Math.floor((dateobj.getMonth() + 3) / 3),
                    "S+": dateobj.getMilliseconds()
            };
        if (/(y+)/i.test(format)) {
                format = format.replace(RegExp.$1, (dateobj.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
                if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1, RegExp.$1.length == 1
                            ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
                }
        }
        return format;		
    },
    Clone: function (myObj,targetObj,exclude) {
        if (typeof (myObj) != 'object') return myObj;
        if (myObj instanceof Date)  return myObj;
        if (myObj == null) return myObj;
        if (myObj instanceof Array) {
            myNewObj = targetObj || new Array();
        } else {
            var myNewObj = targetObj || new Object();
        }
        for (var i in myObj)
        {
            if(exclude && exclude.indexOf(i)>=0)continue;
            myNewObj[i] = this.Clone(myObj[i]);
        }
        return myNewObj;
    },
    format: function (format) {
        var formatRe = /\{(\d+)\}/g;

        var args = new Array();
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }

        return format.replace(formatRe, function (m, i) {
            return args[i];
        });
    },
    formatPop:function(format,obj){
         var formatRe = /\{([^{}]*?)\}/g;
         return format.replace(formatRe, function (m, i) {
            return obj[i] || '';
        });
    },
    formatFunc:function(format,func){
         var formatRe = /\{([^{}]*?)\}/g;
         return format.replace(formatRe, function (m, i) {
            return func(i);
        });
    },
    CheckDateTime:function(str){  
        var reg = /^(\d+)\/(\d{1,2})\/(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;  
        var r = str.match(reg);  
        if(r==null)return false;  
        r[2]=r[2]-1;  
        var d= new Date(r[1], r[2],r[3], r[4],r[5], r[6]);  
        if(d.getFullYear()!=r[1])return false;  
        if(d.getMonth()!=r[2])return false;  
        if(d.getDate()!=r[3])return false;  
        if(d.getHours()!=r[4])return false;  
        if(d.getMinutes()!=r[5])return false;  
        if(d.getSeconds()!=r[6])return false;  
        return true;
    },
    //判断元素是否为Jquery对象
    //dom:元素
    IsJqObj: function (dom) {
        var BlnJQuery = false; //判断对象是否Jquery对象
        if (typeof (jQuery) != "undefined") { BlnJQuery = dom instanceof jQuery; }
        //当用Jquip(精简版Jquery时,需要判断对象是否包含selector属性)
        if (dom.selector != undefined) { BlnJQuery = true; }
        
        return BlnJQuery;
    },
    /* 
    * 对象转化成字符串格式
    * obj:需要转化的对象
    */
    objcetToString: function (obj) {
        if (obj == undefined) { return "0"; }
        var result = '';
        //判断对象是否是数组对象
        if (obj instanceof Array) {
            result += "[";
            var arrItem = new Array();
            for (var index = 0; index < obj.length; index++) {
                arrItem.push(this.objcetToString(obj[index]));
            }
            result += arrItem.join(',') + "]";
        } else//单个对象
        {
            result += "{";
            var arrPro = new Array();
            for (var key in obj) {
                if (obj[key] instanceof Array) {
                    arrPro.push(Fx.format("'{0}':{1}", key, this.objcetToString(obj[key])));
                }else if(obj[key] instanceof Object){
                    arrPro.push(Fx.format("'{0}':{1}", key, this.objcetToString(obj[key])));
                }else {
                    arrPro.push(Fx.format("'{0}':'{1}'", key, obj[key]));
                }
            }

            result += arrPro.join(',');
            result += "}";
        }
        return result;
    },
    //动画执行完回调函数
    //dom:'执行动画元素'
    //callback:动画执行完回调函数
    animationend:function(dom,callback){
        var t;
        var curanimation=null;
        dom = this.IsJqObj(dom) ? dom[0]:dom;
        
        var animations = {
            'animation':'animationend',
            'Oanimation':'oanimationend ',
            'Mozanimation':'mozAnimationEnd ',
            'Webkitanimation':'webkitAnimationEnd  ',
            'Msanimation':'MSAnimationEnd '
        };

        for(t in animations){
            if(dom.style[t] !== undefined ){
                curanimation=animations[t];
            }
        }
        
        if(!curanimation){return;}
        dom.addEventListener(curanimation, function(){ //动画结束时事件 
            callback(dom);
        }); 		
    }, 
    //递归数组执行
    //arr:递归数组
    //childKey:用于判断数组是否含有子项的属性名
    //func:每项执行的方法
    //completeFunc:递归完成后执行的方法
    recur:function(arr,childKey,func,completeFunc){
        if(!arr){return}
        var counter=this.counter(completeFunc || function(){});
        var exec=function(arr,childKey,func,counter,parentArr){
            var delIndexs=[];
            for(var i=0;i<arr.length;i++){
                var blnDelNode=false;
                if(func){blnDelNode=func(arr[i],i);}
                if(blnDelNode){delIndexs.push(i);}
    
                if(arr[i][childKey] && arr[i][childKey].length>0 && !blnDelNode){
                    counter.add();
                    arguments.callee.apply(this,[arr[i][childKey],childKey,func,counter,parentArr]);
                }
            }
            for(var j=0;j<delIndexs.length;j++){
                arr.splice(delIndexs[j]-j,1);
            }

            counter.exec(parentArr);
        };

        exec(arr,childKey,func,counter,arr);
    },
    isArrayLike:function(obj) {
        if (obj == null || this.isWindow(obj)) {
        return false;
        }

        var length = obj.length;

        if (obj.nodeType === 1 && length) {
        return true;
        }
        return this.isString(obj) || this.isArray(obj) || length === 0 || typeof length === 'number' && length > 0 && (length - 1) in obj;
    },
    each:function(obj,iterator,context){
        var key;
        if (obj) {
            if (this.isFunction(obj)){
                for (key in obj) {
                    if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
                        iterator.call(context, obj[key], key);
                    }
                }
            } else if (obj.forEach && obj.forEach !== _.each) {
                obj.forEach(iterator, context);
            } else if (this.isArrayLike(obj)) {
                for (key = 0; key < obj.length; key++)
                if(iterator.call(context, obj[key], key)==false)break;
            } else {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if(iterator.call(context, obj[key], key)==false)break;
                    }
                }
            }
        }
        return obj;
    },
    //单例绑定事件
    //eventStr:事件字符串
    //dom:绑定事件源元素
    //func:事件处理函数
    SingleBind: function (eventStr, dom, func) {
        var queue = 'Fx_' + eventStr;//加入前缀避免与其他JS库命名冲突
        var BlnJQuery = false; //判断对象是否Jquery对象
        if (typeof (jQuery) != "undefined") { BlnJQuery = dom instanceof jQuery; }
        //当用Jquip(精简版Jquery时,需要判断对象是否包含selector属性)
        if (dom.selector != undefined) { BlnJQuery = true; }
        //如果是Jquery对象需要转化为JS对象
        if (BlnJQuery) { dom = dom[0]; }
        //生成事件唯一标识
        var id = queue + tool.guid(); //唯一标示符
        //判断是否已经注册了该事件
        if (!dom) { return; }
        if (dom[queue]) {
            //已经注册
            dom[queue][id] = func;//添加事件处理函数到队列中
        } else {
            //未注册
            dom[queue] = new Object();//初始事件队列对象
            dom[queue][id] = func;//添加事件处理函数到队列中
            //绑定事件
            $(dom).bind(eventStr, function (e) {
                var handler = this[queue];//事件处理集
                for (var key in handler) {
                    handler[key].call(dom, e);
                }
            });
        }
        //返回唯一标识(用于删除事件处理函数)
        return id;
    },
    //清除绑定事件
    //eventStr:事件字符串
    //dom:绑定事件元素
    //id:绑定事件唯一标识事件
    ClearBind: function (eventStr, dom, id) {
        if (!dom) { return;}
        var queue = 'Fx_' + eventStr;//加入前缀避免与其他JS库命名冲突
        var BlnJQuery = false; //判断对象是否Jquery对象
        if (typeof (jQuery) != "undefined") { BlnJQuery = dom instanceof jQuery; }
        //当用Jquip(精简版Jquery时,需要判断对象是否包含selector属性)
        if (dom.selector != undefined) { BlnJQuery = true; }
        //如果是Jquery对象需要转化为JS对象
        if (BlnJQuery) { dom = dom[0]; }

        if (dom[queue][id]) {
            delete dom[queue][id];
        }
    }, 
   /* 
    * 延迟触发函数
    * func:'触发函数'
    * context:触发上下文(该参数必须是持久对象)
    * delaytime:延迟触发时间(默认延迟500毫秒)
    */
    DelayTrigger: function (func, context, delaytime) {
        delaytime = delaytime || 500;
        if (context.Fx_DelayTimerId) {
            clearTimeout(context.Fx_DelayTimerId);
            context.Fx_DelayTimerId = setTimeout(function () {
                delete context.Fx_DelayTimerId;
                func.apply(context, arguments || []);
            }, delaytime);
            return context;
        }
        context.Fx_DelayTimerId = setTimeout(function () {
            delete context.Fx_DelayTimerId;
            func.apply(context, arguments || []);
        }, delaytime);

        return context;
    },
    browser:function(){  
        var browser = {appname: 'unknown', version: 0},  
            userAgent = window.navigator.userAgent.toLowerCase();  // 使用navigator.userAgent来判断浏览器类型
        //msie,firefox,opera,chrome,netscape  
        if ( /(msie|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/.test( userAgent ) ){  
            browser.appname = RegExp.$1;  
            browser.version = RegExp.$2;  
        } else if ( /version\D+(\d[\d.]*).*safari/.test( userAgent ) ){ // safari  
            browser.appname = 'safari';  
            browser.version = RegExp.$2;  
        }  
        return browser;  
    },
    cookie:{
        set:function(name,value,time)
		{
			time=time || 's300'; //300秒
			var strsec = this.getsec(time);
			var exp = new Date();
			exp.setTime(exp.getTime() + strsec*1);
			document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
		}, 
		get:function(name)
		{
			var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		 
			if(arr=document.cookie.match(reg))
		 
				return unescape(arr[2]);
			else
				return null;
		}, 
		del:function(name)
		{
			var exp = new Date();
			exp.setTime(exp.getTime() - 1);
			var cval=this.get(name);
			if(cval!=null)
				document.cookie= name + "="+cval+";expires="+exp.toGMTString();
		},
		getsec:function(str)
		{
		   var str1=str.substring(1,str.length)*1;
		   var str2=str.substring(0,1);
		   if (str2=="s")
		   {
				return str1*1000;
		   }
		   else if (str2=="h")
		   {
			   return str1*60*60*1000;
		   }
		   else if (str2=="d")
		   {
			   return str1*24*60*60*1000;
		   }
		}
    },
    getHeight: function (el, outer, round) {
        'use strict';
        if (outer) return el.offsetHeight;

        var height = window.getComputedStyle(el, null).getPropertyValue('height');
        var returnHeight = parseFloat(height);
        //IE Fixes
        if (isNaN(returnHeight) || height.indexOf('%') > 0 || returnHeight < 0) {
            returnHeight = el.offsetHeight - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-top')) - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-bottom'));
        }
        if (outer) returnHeight += parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-top')) + parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-bottom'));
        if (round) return Math.ceil(returnHeight);
        else return returnHeight;
    },
    getWidth: function (el, outer, round) {
        'use strict';
        var width = window.getComputedStyle(el, null).getPropertyValue('width');
        var returnWidth = parseFloat(width);
        //IE Fixes
        if (isNaN(returnWidth) || width.indexOf('%') > 0 || returnWidth < 0) {
            returnWidth = el.offsetWidth - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-left')) - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-right'));
        }
        if (outer) returnWidth += parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-left')) + parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-right'));
        if (round) return Math.ceil(returnWidth);
        else return returnWidth;
    },
};

module.exports = tool; 