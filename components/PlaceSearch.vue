<!-- 场所搜索插件 -->
<template>
    <div class="placeSearch">
        <div class="option_container">
            <div class="option_bar">
                <PlaceSel ref="PlaceSel" v-if="blnPlace && !blnLike" class="palceSearch" :defautVal="placeDefVal" :searchKind="searchKind" :callback="placeCallback" :blnRadio="blnRadio" :blnList="blnList"></PlaceSel><div class="palceSearch selEl" v-if="blnLike" :class="{blnSelAll:blnSelAll}" @mousedown.stop="selAll()"><el-tooltip class="item" effect="light" content="最多能全选500项" placement="top"><i class="fa fa-check"></i></el-tooltip></div><div class="refresh"><i class="fa fa-refresh"></i></div>
            </div>
            <div class="input" :class="{placeOne:!blnPlace}"><input type="text" class="place_input form-control" placeholder="编码/中文/拼音/首字母"></div>
            <div class="search_menu fadeIn" name="search_menu"><div name="scroll" class="scroll"></div></div>
        </div>
    </div>
</template>

<script>
import PlaceSel from './PlaceSel'
// import {tool as Fx} from '../js/tool.js'
import {GetSitesInfoByInfo,SearchExact} from '../store/mutation-types'
import '../../static/jquery.slimscroll.min.js'

let inputEl=null;
let search_container_el=null;
let searchMenuEl=null;
let searchScoll=null;
let refreshBtnEl=null;
let clearBtn=null;
let scrollEl=null;

var search_item = '<div name="search_item" class="search_item" data-code={2} data-type="{4}" data-name="{5}"><i class="fa {3}"></i><span style="margin-left:5px;">[{0}]-</span>{1}</div>',
    info_item = '<div class="search_item"><i class="fa {2}"></i><span style="margin-left:5px;">[{0}]-</span>{1}</div>';

export default {
  name: 'PlaceSearch',
  components:{
    PlaceSel
  },
  props:[
      'placesel',
      'defautVal',
      'c_searchKind',//搜索框选择类型0:地区,2:派出所,1:场所(多个用逗号分隔),
      'limitChecked',//限制选中个数,不配置该项则不做限制 add by xyl 2017.1.16
      'c_formatResult',
      'ccontext',//数据上下文
      'store',//存储对象上下文(在弹窗的情况默认$Store不存在需要动态传进来)
      'blnRadio',//是否为单选
      'blnList',//是否只显示列表
      'blnLike',//是否只显示模糊查找
      'blnClear',//是否在没有查询结果集的时候不清除用户输入的内容
      'blnNoSaveDelVal',//是否不记录每次选中的结果集
  ],
  data () {
    return {
      blnPlace:false,
      searchKind:'',
      formatResult:false,
      inputEl:null,
      search_container_el:null,
      searchMenuEl:null,
      searchScoll:null,
      refreshBtnEl:null,
      clearBtn:null,
      scrollEl:null,
      placeDefVal:'',
      blnSelAll:false,//在只显示模糊查找的情况下,标识是否可以全选查询项
      selData:{regions: [],polices: [],sites: []},//已选择的数据项
      searchData:[],//查询结果集
      limit:10,//限制显示条数
    }
  },
  watch:{
      defautVal(){
          this.placeDefVal=this.defautVal || '';
      }
  },
  mounted(){
    let self=this;
    if(!this.$store){this.$store=this.store;}
    this.placeDefVal=this.defautVal || '';
    this.blnPlace=this.placesel==false?false:true;
    this.searchKind = this.c_searchKind==undefined?'0,1,2':this.c_searchKind;
    this.formatResult = this.c_formatResult === 'true' ? true : false;
    let iElement=$(this.$el);

    this.inputEl=iElement.find('input');
    this.search_container_el = iElement.find('div[class="option_container"]'),
    this.searchMenuEl = iElement.find('div[name="search_menu"]'),
    this.searchScoll = this.searchMenuEl.find('div[name="scroll"]'),
    this.refreshBtnEl = iElement.find('div[class="refresh"] > i'),
    this.clearBtn = iElement.find('div[class="refresh"]');
    this.scrollEl=iElement.find('div[name="scroll"]');

    this.searchScoll.slimScroll({
       position: 'right',
       size: '12px'
    });


    let Rx=this.$store.getters.Rx;
    let resEmit=new Rx.Subject();
    resEmit.subscribe(()=>{
        this.placeCallback(self.selData);
        //self.selData={regions: [],polices: [],sites: []};
    });


    //注册搜索结果项单击事件
    iElement.on('click', 'div[name="search_item"]', function () {
        var code = $(this).attr('data-code'), type = $(this).attr('data-type'), name = $(this).attr('data-name'), 
        data = self.selData;
        //判断是否已经选择该项
        if(_.chain(data).values().flatten().find(d=>d.code==code).value()){
            $(this).removeClass('sel');
            for(let key in data){
                data[key]=_.filter(data[key],d=>d.code!=code);
            }
            return;
        }

        if (type == '0') {
            //地区
            data.regions.push({code: code, name: name});
        }

        if (type == '2') {
            //派出所
            data.polices.push({code: code, name: name});
        }

        if (type == '1') {
            //场所
            data.sites.push({code: code, name: name});
        }

        if(!self.blnRadio){
            $(this).addClass('sel');
            self.$emit('place_res',self.ccontext || '',self.formatSites(data));
        }else{
            self.placeCallback(data);
        }


        //self.placeCallback(data);
    });
    
    var flag = {clearBtn: false, input: false};

    var clearLazy = _.debounce(function () {
        if (flag.input) {
            flag.clearBtn = true;
        } else {
            flag.clearBtn = false;
        }
        self.inputEl.val('');
    }, 300);

     //注册清空按钮单击事件
     let clear = function () {
        clearLazy.call(this);
        self.refreshBtnEl.removeClass('fa-spinner fa-pulse');
        self.refreshBtnEl.addClass('fa-refresh');
        self.inputEl.removeAttr('disabled');
        self.search_container_el.removeClass('hoverEl');
        self.searchData={regions: [],polices: [],sites: []};
        self.selData={regions: [],polices: [],sites: []};
        self.placeDefVal="";
        //self.defautVal = "";
        self.$emit('place_res',self.ccontext || '',"");
        //scope.$apply(); // 外部调用clear后，这里会报错
        
        //scope.$broadcast('palceClear');
    };
    self.clearBtn.click(clear);

     //注册输入框输入事件
    var lazyLayout = _.debounce(function () {

        if (!$(this).val()) {
            flag.input = false;
            flag.clearBtn = false;
            self.searchMenuEl.hide();
            self.$emit('place_res',self.ccontext || '','');
            return;
        }
        /*
            * add by jyj 2016.11.25
            * 用户不手动选择匹配的数据列表时，自动根据用户输入的长度判断为区域或者场所编码
            * */
        // var inputData = {regions: [], polices: [], sites: []};
        // if (/^\d+$/.test($(this).val())) {
        //     if ($(this).val().length <= 6) {
        //         inputData.regions.push({code: $(this).val(), type: '1'});
        //     } else if ($(this).val().length <= 10) {
        //         inputData.polices.push({code: $(this).val(), type: '2'});
        //     } else if ($(this).val().length <= 14) {
        //         inputData.sites.push({code: $(this).val(), type: '3'});
        //     }
        //     self.$emit('place_res',self.ccontext || '',self.formatSites(inputData));
        // }

        self.refreshBtnEl.removeClass('fa-refresh');
        self.refreshBtnEl.addClass('fa-spinner fa-pulse');
        flag.input = true;
        self.$store.dispatch(GetSitesInfoByInfo,{condition:$(this).val(), types:self.searchKind}).then(function (code) {
            arrowIndex = -1;
            self.refreshBtnEl.removeClass('fa-spinner fa-pulse');
            self.refreshBtnEl.addClass('fa-refresh');
            flag.input = false;
            if (flag.clearBtn) {
                flag.clearBtn = false;
                return;
            }
            var data = code;
            let item_count=0;

            //构建查询结果html
            //地区0
            var regionsHtml = '';
            if ((',' + self.searchKind + ',').indexOf(',0,') >= 0) {
                _.each(data.regions, function (item) {
                    item_count++;
                    if(item_count<=self.limit){
                        regionsHtml += Fx.format(search_item, item.code, item.name, item.code, 'fa-bookmark-o', 0, item.name);
                    }
                });
            }

            //派出所2
            var policesHtml = '';
            if ((',' + self.searchKind + ',').indexOf(',2,') >= 0) {
                _.each(data.polices, function (item) {
                    item_count++;
                    if(item_count<=self.limit){
                        policesHtml += Fx.format(search_item, item.code, item.name, item.code, 'fa-flag-o', 2, item.name);
                    }
                });
            }

            //场所1
            var sitesHtml = '';
            if ((',' + self.searchKind + ',').indexOf(',1,') >= 0) {
                _.each(data.sites, function (item) {
                    item_count++;
                    if(item_count<=self.limit){
                        sitesHtml += Fx.format(search_item, item.code, item.name, item.code, 'fa-tv', 1, item.name);
                    }
                });
            }

            var totalHtml = regionsHtml + policesHtml + sitesHtml;

            if (!totalHtml) {
                totalHtml = "<div style='line-height:25px;text-align:center;'>暂无数据!</div>"
            }
            self.searchMenuEl.show();
            self.searchScoll.html(totalHtml);

            //判断是否只有一个搜索结果(如果只有一个搜索结果)
            let childs = self.searchScoll.children('.search_item');
            let count=(data.regions || []).length+(data.polices || []).length+(data.sites || []).length;
      
            if(childs.length==1){
                $(childs[0]).trigger('click');
            }else if(count>1 && count<500){
                self.blnSelAll=true;
                self.searchData=data;
                self.selData={regions: [],polices: [],sites: []};
                self.$emit('place_res',self.ccontext || '','');
            }else{
                self.blnSelAll=false;
                self.searchData={regions: [],polices: [],sites: []};
                self.selData={regions: [],polices: [],sites: []};
                self.$emit('place_res',self.ccontext || '','');
            }

            //单击body隐藏搜索结果框
            var contextMenuId = '',scrollId,blnScrollClick=false;
            if (contextMenuId) {
                Fx.ClearBind('mousedown', $('body'), contextMenuId);
            }
            contextMenuId = Fx.SingleBind('mousedown', $('body'), function (e) {
                Fx.ClearBind('mousedown', $('body'), contextMenuId);
                Fx.DelayTrigger(function () {
                    resEmit.next(1);
                    self.blnSelAll=false;
                    self.searchMenuEl.hide();
                    flag.input = false;
                    flag.clearBtn = false;
                }, new Object(), 200);
            });

            if(scrollId){
                Fx.ClearBind('mousedown', self.scrollEl, scrollId);
            }

            scrollId = Fx.SingleBind('mousedown', self.scrollEl, function (e) {
                e.stopPropagation();
            });
        });

    }, 500);

    //搜索结果栏中的项标记选中项索引
    var arrowIndex = -1;
    /*
        * add by xyl 2016.12.29
        * 使用 键盘 向上箭头键和向下箭头键 给搜索结果栏中的项标记选中
        * */
    var arrowSelectedItem = function (code) {
        var searchItems = self.searchScoll.find('div[name="search_item"]');
        switch (code) {
            case 38:
                if (arrowIndex > 0) {
                    arrowIndex--;
                }
                break;
            case 40:
                if (arrowIndex < searchItems.length - 1) {
                    arrowIndex++;
                }
                break;
        }
        if (searchItems.length > 0) {
            //为选中项设置背景色，同级项去掉背景色
            $(searchItems[arrowIndex]).addClass("searchItemSelected").siblings().removeClass("searchItemSelected");
            var itemsHeight = 0;
            for (var i = 0; i <= arrowIndex; i++) {
                itemsHeight += $(searchItems[i]).height();
            }
            var searchScrollHeight = self.searchScollsearchScoll.height();
            switch(code){
                case 38://向上
                    if(searchScrollHeight<itemsHeight)return;
                    self.searchScoll.slimScroll({ scrollTo: ((itemsHeight-searchScrollHeight)+'px') });
                    break;
                case 40://向下
                    if(searchScrollHeight>itemsHeight)return;
                    self.searchScoll.slimScroll({ scrollTo: ((itemsHeight-searchScrollHeight)+'px') });
                    break;
            }
            
        }
    };
    self.inputEl.change(function(){
      if(self.inputEl.val())return;
      self.$emit('place_res',self.ccontext || '','');
    });
    self.inputEl.keyup(function (event) {
        event.preventDefault();
        event.stopPropagation();
        var keyCode = event.keyCode;
        
        if (keyCode) {
            var codeInt = parseInt(keyCode);
            //48-57:数字键 65-90:字母键 96-105:小键盘数字键 8:backspace(退格键)
            var isCharCode = (48 <= codeInt && codeInt <= 90) || (96 <= codeInt && codeInt <= 105) || (codeInt == 8)
            if (isCharCode) {
                lazyLayout.call(this);
            }
            //38:向上箭头键 40:向下箭头键
            else if (codeInt == 38 || codeInt == 40) {
                arrowSelectedItem(codeInt);
            }
            //13:回车键
            else if (codeInt == 13) {
                var searchItems = self.searchScoll.find('div[name="search_item"]');
                if (searchItems.length > 0) {
                    var selectedObj = $(searchItems[arrowIndex]);
                    var code = selectedObj.attr('data-code'),
                        type = selectedObj.attr('data-type'),
                        name = selectedObj.attr('data-name'),
                        data = {
                            regions: [],
                            polices: [],
                            sites: []
                        };
                    if (type == '0') {
                        //地区
                        data.regions.push({code: code, name: name});
                    }

                    if (type == '2') {
                        //派出所
                        data.polices.push({code: code, name: name});
                    }

                    if (type == '1') {
                        //场所
                        data.sites.push({code: code, name: name});
                    }
                    self.placeCallback(data);
                }
            }//空格
            else if(codeInt==32){
                lazyLayout.call(this);
            }
        }
    });


    //存在默认值
   
    if (self.placeDefVal) {
  
        var typeMap = ['', 0, 2, 1];//服务端数据类型跟客户端定义不一致这里来映射(0:地区,2:派出所,1:场所)
        self.$store.dispatch(SearchExact,eval('(' + self.placeDefVal + ')')).then(function (code) {
            var data = code.data, result = {regions: [], polices: [], sites: []};
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                //判断节点是否能被选中
                if (self.searchKind.indexOf(typeMap[item.type]) < 0) {
                    continue;
                }

                switch (item.type) {
                    case 1://地区
                        result.regions.push({code: item.code, name: item.name});
                        break;
                    case 2://派出所
                        result.polices.push({code: item.code, name: item.name});
                        break;
                    case 3://场所
                        result.sites.push({code: item.code, name: item.name});
                        break;
                }
            }
            if (data.length > 0) {
                self.placeCallback(result);
            }
        });
    }

  },
  methods:{
      //弹窗选择场所
      Pop(){
          this.$refs.PlaceSel.click();
      },
      //全选
      selAll(){
          if(!this.blnSelAll) return;
          this.selData=tool.Clone(this.searchData);
          this.placeCallback(this.searchData);
      },
      // 格式化结果集，改变默认结果集,这个格式是和后端约定好的
      formatSites(obj) {
        if (!this.formatResult)return obj;
        if (obj !== undefined && obj !== "" && obj.length !== 0) {
            return Fx.format('{regionList:"{0}",policeStationList:"{1}",siteList:"{2}"}',
                _.map(obj.regions, function (obj) {
                    return obj.code;
                }).join(','),
                _.map(obj.polices, function (obj) {
                    return obj.code;
                }).join(','),
                _.map(obj.sites, function (obj) {
                    return obj.code;
                }).join(','));
        }
        return "";
      },
      placeCallback(result){
        let self=this;
        var checkObjLength = 0;
        if (result.regions) {
            checkObjLength += result.regions.length;
        }
        if (result.polices) {
            checkObjLength += result.polices.length;
        }
        if (result.sites) {
            checkObjLength += result.sites.length;
        }
        if (this.limitChecked && !isNaN(this.limitChecked)) {
            var limitCount = parseInt(this.limitChecked);
            if (checkObjLength > limitCount) {
                //scope._common.alertWarin("只能选择"+limitCount+"项");
                return false;
            }
        }

        if (checkObjLength > 0) {
            var regionsHtml = '{0}个地区',
                policesHtml = '{0}所派出所',
                sitesHtml = '{0}家网吧',
                totalHtml = '已选择',
                selVal = [],//选择的默认值
                infoHtml = '';
            if (result.regions && result.regions.length > 0) {
                totalHtml += Fx.format(regionsHtml, result.regions.length);
                _.each(result.regions, function (item) {
                    infoHtml += Fx.format(info_item, item.code, item.name, 'fa-bookmark-o');
                    selVal.push({code: item.code, type: "1"});
                });
            }

            if (result.polices && result.polices.length > 0) {
                totalHtml += Fx.format(policesHtml, result.polices.length);
                _.each(result.polices, function (item) {
                    infoHtml += Fx.format(info_item, item.code, item.name, 'fa-flag-o');
                    selVal.push({code: item.code, type: "2"});
                });
            }

            if (result.sites && result.sites.length > 0) {
                totalHtml += Fx.format(sitesHtml, result.sites.length);
                _.each(result.sites, function (item) {
                    infoHtml += Fx.format(info_item, item.code, item.name, 'fa-tv');
                    selVal.push({code: item.code, type: "3"});
                });
            }
            this.inputEl.val(totalHtml);
            this.inputEl.attr('disabled', true);
            this.search_container_el.addClass('hoverEl');
            this.searchScoll.html(infoHtml);
       
            //传递结果
            this.$emit('place_res',self.ccontext || '',self.formatSites(result));

            //设置默认值
            if (selVal.length > 0 && !this.blnNoSaveDelVal) {
                //this.defautVal = JSON.stringify(selVal);
                //this.placeDefVal=this.defautVal;
                
                this.placeDefVal=JSON.stringify(selVal);
            }
        } else {
            if(this.blnClear){
                let val=this.inputEl.val();
                
                let obj={regions:[],sites:[],polices:[]};
                switch(this.c_searchKind){
                    case '0'://区域
                        obj.regions.push({code:val});
                        break;
                    case '1'://场所
                        obj.sites.push({code:val});
                        break;
                    case '2'://派出所
                        obj.polices.push({code:val});
                        break;
                }

                this.$emit('place_res',self.ccontext || '',self.formatSites(obj));
                return;
            }

            this.clearBtn.click();
        }
        return true;
      }
  }
}
</script>

<style lang="less">
    .placeSearch{line-height: 30px;}
    .placeSearch .place_input{
        display: block;
        font-size:12px;
    }

    .placeSearch .title{float:left;}
    .placeSearch .option_bar{float:right;line-height: 34px;}
    .placeSearch .input{margin-right:68px;height:34px;}
    .placeSearch .input >input{border:none;border-radius:5px;border-top-right-radius:0px;border-bottom-right-radius:0px;}
    .placeSearch .input > input:focus {-moz-box-shadow:1px 1px 0px #45b6af inset,-1px -1px 0px #45b6af inset;-webkit-box-shadow:1px 1px 0px #45b6af inset,-1px -1px 0px #45b6af inset;box-shadow:1px 1px 0px #45b6af inset,-1px -1px 0px #45b6af inset;}
    .placeSearch .placeOne{margin-right:34px;}

    .placeSearch .option_container{border:1px solid #e5e5e5;border-radius:7px;position: relative;border-radius:5px;}
    .placeSearch .option_container .search_menu{width:100%;background-color: white;display:none;position: absolute;z-index: 10000;border: 1px solid #e5e5e5;}


    .placeSearch .option_bar .palceSearch,
    .placeSearch .option_bar .refresh{color:#2c3e50;display:inline-block;height:34px;width:34px;background-color:white;text-align:center;cursor:pointer;border-left: 1px solid #e5e5e5;}
    .placeSearch .option_bar .refresh{border-radius:5px;border-top-left-radius:0px;border-bottom-left-radius:0px;}

    .placeSearch .search_item{padding:0px 10px;font-size:12px;line-height:25px;text-align:left !important;color:black;}
    .placeSearch .search_item.sel{background-color:rgb(3, 171, 103);color:white;}
    .placeSearch .search_item:hover{cursor:pointer;background-color:#728499;color:white;}
    .searchItemSelected{background-color:#f3f3f4;}
    .placeSearch .search_menu .scroll{max-height:250px;overflow-y: scroll}
    .placeSearch .search_menu .scroll::-webkit-scrollbar {width: 6px;background-color: #F5F5F5;}
    .placeSearch .search_menu .scroll::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.1);background-color: #F5F5F5;border-radius: 3px;}
    .placeSearch .search_menu .scroll::-webkit-scrollbar-thumb {border-radius: 3px;-webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, .3);background-color: #EAEAEA;}

    .placeSearch  .hoverEl:hover{cursor:pointer;}

    .placeSearch  .hoverEl:hover .search_menu{display:block !important;}

    .selEl i{color:gray;}
    .selEl.blnSelAll i{color:rgb(3, 171, 103);}
</style>
