// window8布局


class W8Layout{
    constructor(){
        //容器Html
        this.Container='<div id="{0}" class="{1}" style="color: inherit;width:{2}px;height:{3}px;background-color:{5};padding:{6}px;">{4}</div>';
        this.id='';//唯一标示符
        this.clsPrix='Window8Layout';//搜索框Class前缀(该前缀对应指定样式表中的样式)
        this.clearFloat='<div style="clear:both;"></div>';//清除浮动
        this.FrameWorkItemMargin=0.5;//框架容器外边距
        this.LayoutOrientation={ Vertical: 0, Horizontal: 1 };//布局方向
        this.BgCol=['#f9f9f9', '#f9f9f9', '#f9f9f9', '#f9f9f9', '#f9f9f9', ' #f9f9f9', '#f9f9f9', '#f9f9f9', '#f9f9f9', '#f9f9f9'];//背景色(测试用)
        this.config={
            //页面宽度
            ScreenWidth: 0,
            //页面高度
            ScreenHeight: 0,
            //是否自定义界面
            BlnCustom: true,
            bgCol:'#ececec',//背景色
            contentTemp:'<div class="menus_content_container"><i class="{icon}"></i><div class="name">{name}</div></div>',//显示区域内容模板
            /*
            * 名称:界面模板
            * 参数说明:
            *      Orientation:布局方向
            *      Number:该布局方向上划分的区域块数量
            *      BlnSelectItem:标识该区域是否用户可操作项(true:标识用户可操作,false:标识该区域只是用来布局所用)
            *      Fix:标识该区域模块在其父模块中占的大小比例,该区域大小是根据其父模块中其他区域的Fix值一同来换算比例
            *      Target:该属性只会出现在“BlnSelectItem”为“true”的情况,该属性标识该区域将选择布局元素中哪个元素进行展示(该属性需要结合TargetVal一             同使用),该属性代表布局元素中具体对象的属性名称
            *      TargetVal:与“Target”一样必须“BlnSelectItem”为“true”的情况下才可以使用,该属性标识具体布局元素对象属性的值
            *      LayoutInfo:标识该区域下具体的子项区域信息
            */
            UiTemplate:{
                Orientation: 0,
                Number: 3,
                BlnSelectItem: false,
                LayoutInfo: [
                    {
                        Orientation: 1, Number: 4, BlnSelectItem: true,Fix:1,LayoutInfo: [
                            { Target: 'id', TargetVal: '1', Fix: 1 },
                            { Target: 'id', TargetVal: '2', Fix: 1 },
                            {
                                Orientation: 0, Number: 2, BlnSelectItem: false,Fix:1,LayoutInfo: [
                                    { Target: 'id', TargetVal: '3', Fix: 1 },
                                    { Target: 'id', TargetVal: '4', Fix: 1 }
                                ]
                            },
                            {
                                Orientation: 0, Number: 2, BlnSelectItem: false,Fix:1,LayoutInfo: [
                                    { Target: 'id', TargetVal: '5', Fix: 1 },
                                    { Target: 'id', TargetVal: '6', Fix: 1 }
                                ]
                            }
                        ]
                    },
                    {
                        Orientation: 1, Number: 4, BlnSelectItem: true,Fix:1,LayoutInfo: [
                            { Target: 'id', TargetVal: '7', Fix: 1 },
                            {
                                Orientation: 0, Number: 2, BlnSelectItem: false,Fix:1,LayoutInfo: [
                                    { Target: 'id', TargetVal: '8', Fix: 1 },
                                    { Target: 'id', TargetVal: '9', Fix: 1 }
                                ]
                            },
                            {
                                Orientation: 0, Number: 2, BlnSelectItem: false,Fix:1,LayoutInfo: [
                                    { Target: 'id', TargetVal: '10', Fix: 1 },
                                    { Target: 'id', TargetVal: '11', Fix: 1 }
                                ]
                            },
                            { Target: 'id', TargetVal: '12', Fix: 1 }
                        ]
                    }
                ]
            },
            Data:[
                { id: 1,icon:'fa fa-search',name:'上网场所库' },
                { id: 2,icon:'fa fa-bullhorn',name:'实名人员库' },
                { id: 3,icon:'fa fa-bus',name:'网上昵称库'},
                { id: 4,icon:'fa fa-coffee',name:'邮件地址库' },
                { id: 5,icon:'fa fa-credit-card',name:'翻墙人员库' },
                { id: 6,icon:'fa fa-desktop',name:'银行账号库' },
                { id: 7,icon:'fa fa-folder-open-o',name:'虚拟身份库' },
                { id: 8,icon:'fa fa-gift',name:'手机号码库' },
                { id: 9,icon:'fa fa-paint-brush',name:'IP地址库' },
                { id: 10,icon:'fa fa-paw',name:'指纹收集库' },
                { id: 11,icon:'fa fa-pencil',name:'MAC地址库' },
                { id: 12,icon:'fa fa-recycle',name:'全库搜索' }
            ]
        };
    }

    format(format) {
        var formatRe = /\{(\d+)\}/g;
        var args = new Array();
        for (var i = 1; i < arguments.length; i++) {
            if(arguments[i] instanceof  Array){
                for(var k=0;k<arguments[i].length;k++){
                    args[k]=arguments[i][k];
                }
            }else{
                args[i - 1] = arguments[i];
            }
        }

        return format.replace(formatRe, function (m, i) {
            return args[i];
        });
    }
    /* 
     * 添加控件到指定元素中
     * Tag:名表元素名字
     * kind:Tag组件样式1
     */
    AppendTo(Tag,config){
        config = config || {};
        let self = this;
        //初始化配置参数
        self.config= Object.assign(self.config, config);
        $(Tag).append(self.GetHtml() + self.clearFloat);
        //注册事件
        self.RegisterEven();
    }
     /* 
     * 获取搜索框Html
     * kind:搜索框类型
     */
    GetHtml () {
        let self = this;
        let result = '';

        result += self.format(self.Container,
            self.clsPrix + self.id, //控件唯一标识
            self.clsPrix, //控件容器Class名称
            self.config.ScreenWidth == 0 ? $(window).width(): self.config.ScreenWidth, //屏幕宽度
            self.config.ScreenHeight == 0 ? $(window).height() : self.config.ScreenHeight,//屏幕高度
            self.FissionDom(self.config.Data,
                            self.config.ScreenHeight == 0 ? $(window).height()- 2*self.FrameWorkItemMargin : self.config.ScreenHeight- 2*self.FrameWorkItemMargin, //界面容器高度
                            self.config.ScreenWidth == 0 ? $(window).width()- 2*self.FrameWorkItemMargin : self.config.ScreenWidth- 2*self.FrameWorkItemMargin, //界面容器宽度
                            self.FrameWorkItemMargin, //操作项外边距
                            self.config.BlnCustom, //是否自定义界面
                            self.config.UiTemplate, //界面模板
                            self.config.boderCol //间隔先颜色
                            ).Flush(),
            self.config.bgCol,
            self.FrameWorkItemMargin
            );
        return result;
    }

    //注册事件
    RegisterEven(){
        // var self=this;
        // var Control = $(Fx.format('#{0}{1}', self.clsPrix, self.id));
       
        // //注册单击事件
        // var ClickItems = Control.find('div[name="ClickItem"]');
        // Fx.TouchClick(ClickItems, function () {
        //     //alert($(this).attr('name'));
        // });
    }

     formatAttr(format,obj){
        var formatRe = /\{(\w+)\}/g;
        var args = new Array();
        for (var i = 1; i < arguments.length; i++) {
            if(arguments[i] instanceof  Array){
                for(var k=0;k<arguments[i].length;k++){
                    args[k]=arguments[i][k];
                }
            }else{
                args[i - 1] = arguments[i];
            }
        }
        return format.replace(formatRe, function (m, i) {
            return obj[i] || '';
        });
    }

    //裂变布局元素
    //控件内容布局对象
    //data:展示内容集合
    //height:容器高度
    //width:容器宽度
    //itemMargin:容器外边距
    //blnCustom:是否定制界面(自定义界面布局)
    //uiTemplate:界面模板
    FissionDom(data, height, width, itemMargin, blnCustom, uiTemplate,boderCol) {
        var self = this;
        //内部对象
        var obj = function (data, height, width, itemMargin, blnCustom, uiTemplate) {
            blnCustom = blnCustom == true ? true : false;
            uiTemplate = uiTemplate || new Array();

            data = data || [];
            //布局方向
            var LayoutOrientation = { Vertical: 0, Horizontal: 1 };

            //展示区域背景色
            var BgCol = ['#f9f9f9', '#f9f9f9', '#f9f9f9', '#f9f9f9', '#f9f9f9', ' #f9f9f9', '#f9f9f9', '#f9f9f9', '#f9f9f9', '#f9f9f9'];
            var clearFloat = '<div style="clear:both;"></div>';
            var itemHtml = '<div name="{2}" style="{0}float:left;text-align: center;">{1}</div>';


            /*****************************对象内部方法*****************************/
            //筛选指定条件的对象
            //data:筛选结果集
            //targetItem:筛选对象
            var FilterData = function (data, targetItem) {
                var result = '';
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];

                    if (item[targetItem.Target] + '' == targetItem.TargetVal) {
                        result=data[i];
                        break;
                    }
                }
                return result;
            };
            //构造自定义界面模板数组内容集合
            //data:布局元素集合
            //result:操作结果集
            var CustomStructLayoutData = function (data, template, result) {
                for (var i = 0; i < template.LayoutInfo.length; i++) {
                    var item = template.LayoutInfo[i];
                    if (item.BlnSelectItem == true) {
                        //选项节点
                        if (item.Number == 1) { result.push(FilterData(data, item.LayoutInfo[0])); continue; }
                        var itemArr = new Array();
                        for (var j = 0; j < item.Number; j++) {
                            itemArr.push(FilterData(data, item.LayoutInfo[j]));
                        }
                        result.push(itemArr);
                    }
                    if (item.BlnSelectItem == false) {
                        //占位节点
                        var itemArr = new Array();
                        result.push(itemArr);
                        CustomStructLayoutData(data, item, itemArr);
                    }
                    if (item.BlnSelectItem == undefined) {
                        result.push(FilterData(data, item));
                    }
                }
            };
            //获取自定义界面模板区域大小
            //totalSize:容器总大小
            //index:当前区域索引
            //template:界面模板信息
            //margin:区域外边距
            //elementCount:元素剩余数量
            //remainSize:剩余大小
            var CustomAreaSize = function (totalSize, index, template, margin, elementCount, remainSize) {
                //当只有一个元素时则直接返回元素值,不需要随便分配值
                if (elementCount == 1) { return remainSize - 2 * margin; }
                //存在多个元素时
                var actualSize = totalSize - (2 * margin * template.Number); //去除外边距后的实际大小
                var member = 0;//分子数
                var denominator = 0;//分母数

                for (var i = 0; i < template.LayoutInfo.length; i++) {
                    var item = template.LayoutInfo[i];
                    if (index == i) { member = item.Fix;}
                    denominator += item.Fix;
                }
               
                return Math.ceil(actualSize * member / denominator);
            };
            //随机构造布局数组
            //Data:显示数组内容集合
            var RandomStrucLayoutData = function (data) {
                data = data || [];
                if (data.length == 0) { return 0; }
                var result = new Array();
                if (blnCustom == true) {
                    CustomStructLayoutData(data, uiTemplate, result);
                } else {
                    //随机生成界面模板
                    while (data.length > 0) {
                        var randomNumber = (Math.ceil((Math.random() * 10)) / 10) * (data.length - 1) + 1;
                        var returnValue = randomNumber == 1 ? data.splice(0, randomNumber)[0] : data.splice(0, randomNumber);

                        result.push(returnValue);
                    }
                }
                return result;
            };
            //根据指定元素数随机获取元素的高度/宽度的值
            //totalSize:总大小(用于随机取数)
            //elementCount:元素数
            //margin:元素外边距值
            //minSize:元素高度/宽度的最小值(如果没有设置,默认为元素的平均值的1/2)
            var GetMainRandomSize = function (totalSize, elementCount, margin,minSize) {
                //当只有一个元素时则直接返回元素值,不需要随便分配值
                if (elementCount == 1) { return totalSize - 2 * margin; }

                var aveSize = (totalSize - (2 * margin * elementCount)) / elementCount;//元素的平均值

                minSize = minSize || aveSize * 0.8;//元素最小值
                var maxSize = totalSize - (elementCount - 1) * minSize; //元素最大值
                //产生随机数(随机大小)
                var randomSize = Math.ceil((Math.random() * 10)) / 10 * (maxSize - minSize) + minSize;

                return Math.ceil(randomSize);
            };
            //包装主架构布局元素
            //layoutOrientation:布局方向(垂直/水平)
            //layoutData:元素
            //screenWidth:屏幕宽度
            //screenHeight:屏幕高度
            var PackMainFrameWork = function (layoutOrientation, layoutData, screenWidth, screenHeight) {
                var result = '';
                switch (layoutOrientation) {
                    case LayoutOrientation.Vertical://垂直布局
                        var totalHeight = screenHeight;
                        var domCount = layoutData.length;

                        for (var i = 0; i < layoutData.length; i++) {
                            var blnSelectItem = !(layoutData[i] instanceof Array);//是否为选择项(页面单击项)
                            var DomMargin = blnSelectItem == true ? itemMargin : 0;

                            var containerHeight = blnCustom == false ? GetMainRandomSize(totalHeight, domCount, DomMargin) : CustomAreaSize(screenHeight, i, uiTemplate, DomMargin, domCount, totalHeight);
                            totalHeight -= (containerHeight + 2 * DomMargin);
                            domCount -= 1;

                            var random = Math.random() * 9;
                            var bgColIndex = Math.ceil(random);
                            var elementCss = self.format('height:{0}px;width:{1}px;margin:{2}px;background-color:{3};', containerHeight, screenWidth - 2 * DomMargin, DomMargin, blnSelectItem == true ? BgCol[bgColIndex] :boderCol);
                            //设置内容行高使内容居中显示
                            elementCss += blnSelectItem == true ? self.format('line-height:{0}px;', containerHeight) : '';


                            var childItem = '';

                            childItem += !blnSelectItem == true ? new obj(layoutData[i], containerHeight, screenWidth - 2 * DomMargin, itemMargin, blnCustom, blnCustom == true ? uiTemplate.LayoutInfo[i] : null).Flush() : self.formatAttr(self.config.contentTemp,layoutData[i]);

                            result += self.format(itemHtml, elementCss, childItem, blnSelectItem == true ? 'ClickItem' : '');
                        }
                        break;
                    case LayoutOrientation.Horizontal://水平布局
                        var totalWidth = screenWidth;
                        var domCount = layoutData.length;
                        for (var i = 0; i < layoutData.length; i++) {

                            var blnSelectItem = !(layoutData[i] instanceof Array);//是否为选择项(页面单击项)
                        
                            var DomMargin = blnSelectItem == true ? itemMargin : 0;

                            var containerWidth = blnCustom == false ? GetMainRandomSize(totalWidth, domCount, DomMargin) : CustomAreaSize(screenWidth, i, uiTemplate, DomMargin, domCount, totalWidth);
                            totalWidth -= (containerWidth + 2 * DomMargin);
                            domCount -= 1;

                            var random = Math.random() * 9;
                            var bgColIndex = Math.ceil(random);
                            var elementCss = self.format('height:{0}px;width:{1}px;margin:{2}px;background-color:{3};', screenHeight - 2 * DomMargin, containerWidth, DomMargin, blnSelectItem == true ? BgCol[bgColIndex] : boderCol);
                            //设置内容行高使内容居中显示
                            elementCss += blnSelectItem == true ? self.format('line-height:{0}px;', screenHeight - 2 * DomMargin) : '';

                            var childItem = '';
                            childItem += !blnSelectItem == true ? new obj(layoutData[i], screenHeight - 2 * DomMargin, containerWidth, itemMargin, blnCustom,blnCustom==true?uiTemplate.LayoutInfo[i]:null).Flush() : self.formatAttr(self.config.contentTemp,layoutData[i]);

                            result += self.format(itemHtml, elementCss, childItem, blnSelectItem==true?'ClickItem':'');
                        }

                        break;
                }

                return result;
            };
            //获取布局方向(水平布局/垂直布局)
            var GetLayoutOrientation = function () {
                return Math.round(Math.random());//布局方向索引
            };

            /*****************************对象内部方法*****************************/

            /*****************************对象外部方法*****************************/

            //输出Html
            this.Flush = function () {
                var orientationLayout = GetLayoutOrientation();
                //判断是否为自定模板
                if (blnCustom == true) { orientationLayout = uiTemplate.Orientation; data = self.config.Data; }
                return PackMainFrameWork(orientationLayout, RandomStrucLayoutData(data), width, height) + clearFloat;
            };
            /*****************************对象外部方法*****************************/
        };

        return new obj(data, height, width, itemMargin,blnCustom,uiTemplate);
    }
}


export default W8Layout;