//拖动插件
class drag {
    constructor(){
        let self=this;
        //拖动信息
        this.touches={
            start: 0,
            startX: 0,
            startY: 0,
            current: 0,
            currentX: 0,
            currentY: 0,
            diff: 0,
            abs: 0
        };
        this.positions={start: {x:0,y:0},current: {x:0,y:0}};
        this.Pos=null;//当前被拖动对象
        this.BindDom=null;//绑定事件对象
        this.isTouched=false; //标示是否处于拖动状态
        this.isDragTri=false;//是否为拖动插件触发

        this.browser={
            ie8: (function () {
                'use strict';
                var rv = -1; // Return value assumes failure.
                if (navigator.appName === 'Microsoft Internet Explorer') {
                    var ua = navigator.userAgent;
                    var re = new RegExp(/MSIE ([0-9]{1,}[\.0-9]{0,})/);
                    if (re.exec(ua) !== null)
                        rv = parseFloat(RegExp.$1);
                }
                return rv !== -1 && rv < 9;
            })(),

            ie10: window.navigator.msPointerEnabled,
            ie11: window.navigator.pointerEnabled
        };

        this.EvenMap=(function() {
            let desktopEvents = ['mousedown', 'mousemove,mouseleave', 'mouseup','mouseleave'];
            if (self.browser.ie10) desktopEvents = ['MSPointerDown', 'MSPointerMove,MSPointerLeave', 'MSPointerUp','MSPointerLeave'];
            if (self.browser.ie11) desktopEvents = ['pointerdown', 'pointermove,pointerleave', 'pointerup','pointerleave'];

            return {
                'touchstart':desktopEvents[0],
                'touchmove':desktopEvents[1],
                'touchend':desktopEvents[2],
                'touchleave':desktopEvents[3],
                'blur': 'blur',
                'gesturestart': 'gesturestart',
                'gesturechange': 'gesturechange',
                'gestureend': 'gestureend'
            };
        }());
        this.support={};
        this.support.transforms =(function () {
            'use strict';
            var div = document.createElement('div').style;
            return ('transform' in div || 'WebkitTransform' in div || 'MozTransform' in div || 'msTransform' in div || 'MsTransform' in div || 'OTransform' in div);
        })();

        this.support.transforms3d=(function () {
            'use strict';
            var div = document.createElement('div').style;
            return ('webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div);
        })();
    }

    //bindEventDom:绑定事件的元素(接收拖动事件的元素)
    //moveDom:被拖动的元素(如果不设置默认bindEventDom为拖动元素)
    Init(bindEventDom,moveDom){
        this.BindDom=bindEventDom;
		this.Pos=moveDom || this.BindDom;
        this.BindDom.style.cursor='pointer';
        this.RegisterEven();
    }

    //注册事件
    RegisterEven(){
        let self=this;
        //注册鼠标按下事件
        self.Event('touchstart',self.BindDom,(event)=>{
            if (event.preventDefault) { event.preventDefault(); }
            if (event.stopPropagation) { event.stopPropagation(); }
            self.isTouched = true;
            let isTouchEvent = event.type === 'touchstart'; //是否是触屏事件
            let pageX = isTouchEvent ? event.targetTouches[0].pageX : (event.pageX || event.clientX);
            let pageY = isTouchEvent ? event.targetTouches[0].pageY : (event.pageY || event.clientY);
            //初始化当前触屏坐标
            self.touches.startX = self.touches.currentX = pageX;
            self.touches.startY = self.touches.currentY = pageY;
            self.SetWrapperTransition(0);
            self.positions.start = self.positions.current = self.getWrapperTranslate();
            self.setWrapperTranslate(self.positions.start.x, self.positions.start.y);
        });

        //注册鼠标松开事件
        self.Event('touchend',self.BindDom,(event)=>{
             if (event.preventDefault) { event.preventDefault(); }
             if (event.stopPropagation) { event.stopPropagation(); }
             self.isTouched = false;
             setTimeout(function() {
                 self.isDragTri=false;
             }, 200);
        });

        //注册鼠标移动事件
        self.Event('touchmove',document.getElementsByTagName('body')[0],(event)=>{
            if (event.preventDefault) { event.preventDefault(); }
            if (event.stopPropagation) { event.stopPropagation(); }
            if (!self.isTouched) { return; }
            self.isDragTri=true;
            let isTouchEvent = event.type === 'touchmove';

            let pageX = isTouchEvent ? event.targetTouches[0].pageX : (event.pageX || event.clientX);
            let pageY = isTouchEvent ? event.targetTouches[0].pageY : (event.pageY || event.clientY);

            let moveX = pageX - self.touches.currentX;
            let moveY = pageY - self.touches.currentY;

            self.touches.currentX = pageX;
            self.touches.currentY = pageY;

            let wrapperTran = self.getWrapperTranslate();
            self.setWrapperTranslate(moveX + wrapperTran.x, moveY + wrapperTran.y);
        });
    }

    getWrapperTranslate() {
        var el = this.Pos, matrix, curTransform, curStyle, transformMatrix, result = {x:0,y:0};


        if (this.support.transforms) {
            curStyle = window.getComputedStyle(el, null);
            if (window.WebKitCSSMatrix) {
                // Some old versions of Webkit choke when 'none' is passed; pass
                // empty string instead in this case
                transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform === 'none' ? '' : curStyle.webkitTransform);
            }
            else {
                transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
                matrix = transformMatrix.toString().split(',');
            }

            //Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix) 
                result.x = transformMatrix.m41;
                //Crazy IE10 Matrix
            else if (matrix.length === 16)
                result.x = parseFloat(matrix[12]);
                //Normal Browsers
            else
                result.x = parseFloat(matrix[4]);

            //Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix)
                result.y = transformMatrix.m42;
                //Crazy IE10 Matrix
            else if (matrix.length === 16)
                result.y = parseFloat(matrix[13]);
                //Normal Browsers
            else
                result.y = parseFloat(matrix[5]);
        }
        else {
         result.x = parseFloat(el.style.left, 10) || 0;
         result.y = parseFloat(el.style.top, 10) || 0;
        }

        result.x = result.x || 0;
        result.y = result.y || 0;

        return result;
    }

    /*
     * 设置动画属性
     */
    setWrapperTranslate (x, y, z) {
        var es = this.Pos.style,
            coords = { x: x, y: y, z: 0 },
            translate;

        if (arguments.length === 3) {
            coords.x = x;
            coords.y = y;
            coords.z = z;
        }

        if (this.support.transforms) {
            translate = this.support.transforms3d ? 'translate3d(' + coords.x + 'px, ' + coords.y + 'px, ' + coords.z + 'px)' : 'translate(' + coords.x + 'px, ' + coords.y + 'px)';
            es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = translate;
        } else {
            es.left = coords.x + 'px';
            es.top = coords.y + 'px';
        }
    }
    /*
     * 设置动画转换率
     */
    SetWrapperTransition(duration) {
        var self = this;
        var es = self.Pos.style;
        es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = (duration / 1000) + 's';
    }

    Event(EvenName, dom, func) {      
        if (dom instanceof Array) {
            //数组对象
            for (var i = 0; i < dom.length; i++) {
                var item = dom[i];

                for (var j = 0; j < this.EvenMap[EvenName].split(',').length; j++) {
                    if (item.addEventListener) {
                        item.addEventListener(this.EvenMap[EvenName].split(',')[j], func, false);
                    } else {
                        item.attachEvent('on' + this.EvenMap[EvenName].split(',')[j], func);
                    }
                }
            }
        } else {
            //单个对象
            for (var i = 0; i < this.EvenMap[EvenName].split(',').length; i++) {
                if (dom.addEventListener) {
                    dom.addEventListener(this.EvenMap[EvenName].split(',')[i], func, false);
                } else {
                    dom.attachEvent('on' + this.EvenMap[EvenName].split(',')[i], func);
                }
            }
        }
    }

}


export default drag;