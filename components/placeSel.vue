<!--场所选择基础插件-->
<template>
    <div class="PlaceSel" name="placeDir" v-on:click="click">
        <div class="inputContainer"><i class="fa fa-reorder" style="font-size:16px;"></i></div>
    </div>
</template>

<script>
import '../../static/bootstrap-treeview/bootstrap-treeview.min.css'
import '../../static/bootstrap-treeview/bootstrap-treeview.min.js'
import '../../static/jquery.slimscroll.min.js'
// import {tool as Fx} from '../js/tool.js'

import {GET_PLACE,SearchRangeSites} from '../store/mutation-types'

export default {
  name: 'PlaceSel',
  props:[
      'idKey',//数据中用来标识唯一的字段
      'searchKind',//搜索框选择类型0:地区,2:派出所,1:场所(多个用逗号分隔)
      'defautVal',//默认勾选的场所节点信息(只负责树形结构)
      'callback', //回调函数(返回场所选择结果)
      'blnRadio', //是否为单选
      'blnList',//只显示列表选择框
      'btnStyle',//按钮样式
      'store',
  ],
  data () {
    return {
      userInfo:'',
      childKey:'child',
      i_searchKind:'0,1,2',
      i_idKey:'code',
    }
  },
  mounted(){
     this.$store=this.$store || this.store;
     this.i_searchKind=this.searchKind==undefined?'0,1,2':this.searchKind;
     this.userInfo={lang:'',lat:''};
     this.i_idKey=this.idKey || 'code';
     let btn=$(this.$el);
     btn.css({'display':'inline-block','background-color': 'transparent'});
     btn.find('div').css(
         _.extend({ 'background-color':'white','line-height':'34px','border':'none','text-align':'center','cursor':'pointer','width':'34px','height':'34px'},this.btnStyle || {})
     );

 },
  methods:{
      click(){
         let self=this; 
         $(this.$el).addClass('pulse');
         Fx.open(function(searchKind,idKey,childKey,defautVal,store,vm,userInfo,callback){
            var map_id=Fx.guid();
            var typeMap = ['', 0, 2, 1];//服务端数据类型跟客户端第一不一致这里来映射(0:地区,2:派出所,1:场所)
            var treeComp;
            var layIndex;//弹窗索引
            var treeData;
            var treeDataCodeArray = [];//保存treeData所有节点的code值
            var isAddCodeArray = false;
            let param={
                title:'选择',
                area:['920px', '440px'],
                content:`<div class="tag">
                            <div class="bar" :class="{noBar:(','+searchKind+',').indexOf(',1,')<0 || blnRadio || blnList}">
                                <div class="item select" name="option">选择</div><div class="item map" name="option">地图</div>
                                <div class="marker"></div>
                            </div>
                            <div class="tree_page" id='${"tree"+map_id}'>
                                <div class="tree">
                                    <div name="scrollContainer"><div name="tree"></div></div>
                                </div>
                                <div class="tree_select_item"><div name="scrollContainer"><div class="tree_select_container"></div></div></div>
                             </div>
                             <div class="map_page" id='${"map_pop"+map_id}'>地图</div>
                             <div class="option_bar">
                                <span name="map_placeNumebr" style="margin-right:15px;"></span>
                                <button type="button" name="btn_ok" class="btn btn-green">确定</button>
                                <button type="button" name="btn_clear" class="btn btn-gray">清除</button>
                                <button type="button" name="btn_close" class="btn btn-gray">关闭</button>
                             </div>
                         </div>`,
                context:{
                    searchKind:searchKind,
                    blnRadio:self.blnRadio,
                    blnList:self.blnList
                },
                success(layero, index){
                   let blnTree=true;
                   treeComp = layero.find('div[name="tree"]');
                        var contentHeight = layero.find('.layui-layer-content').height(),
                            barHeight = layero.find('.bar').height(),
                            titleH=layero.find('.layui-layer-title').height(),
                            option_barHeight = layero.find('.option_bar').height(),
                            treeSelect = layero.find('div[class="tree_select_container"]'),
                            curPageIndex = 0,//当前显示的Tag页面索引(0:树形页面,1:地图页面)
                            cachePlace = {},//场所缓存点
                            hasLoadMap = false,//是否已经加载地图数据
                            loadHtml = '<div class="load6" style="position:absolute;width:100%;height:100%;"><div class="loader" style="margin-top:2em;"></div></div>',
                            loadHtmlTree = '<div class="loadHtmlTree" style="position:absolute;width:100%;top: 25%;"><div class="spinner"><div class="rect1"></div>' +
                                '<div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5">' +
                                '</div></div><div style="margin:0px auto;height:40px;text-align:center;">数据查询中</div></div>',
                            setDefValTips = '<div class="setDefValTips" style="position:absolute;width:100%;top: 25%;z-index: 999"><div class="spinner"><div class="rect1"></div>' +
                                '<div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5">' +
                                '</div></div><div style="margin:0px auto;height:40px;text-align:center;">选中数据设置中</div></div>',
                            mapContainer = $('#map_pop' + map_id),
                            treeContainer = $('#tree' + map_id),
                            mapResult = [];
                            //设置树形容器高度
                            layero.find('.layui-layer-content').height(layero.height() - titleH);
                            layero.find('.tree_page,.map_page').height(layero.height() - barHeight - titleH - option_barHeight);
                            layero.find('div[name="scrollContainer"]').height(layero.height() - barHeight - titleH - option_barHeight)
                                .slimScroll({
                                    position: 'right',
                                    size: '6px',
                                    color: '#44B5AE'
                                });

                            var selItemHtml = '<div class="selItem fadeInRight"><i class="fa fa-close" data-id="{1}" data-type="{3}" data-name="{4}" data-nodeId="{2}"></i>{0}</div>';
                        //勾选父类节点(通过判断子类节点是否全选中)
                        //blnFlag:true:添加选中,false:删除选中
                        var checkParentNode = function (node, blnFlag) {
                            if (node.parentId || node.parentId == 0) {
                                var parentNode = treeComp.treeview('getNode', node.parentId);
                                //判断是否子节点已经全部选中
                                var blnAllSel = true;
                                for (var i = 0; i < parentNode.nodes.length; i++) {
                                    if (!parentNode.nodes[i].state.checked) {
                                        blnAllSel = false;
                                        break;
                                    }
                                }

                                if (blnAllSel && blnFlag) {
                                    treeComp.treeview('checkNode', [parentNode.nodeId, {
                                        silent: false,
                                        noRender: true,
                                        data: {noAddAll: true}
                                    }]);
                                }

                                if (!blnAllSel && !blnFlag) {
                                    treeComp.treeview('uncheckNode', [parentNode.nodeId, {
                                        silent: false,
                                        noRender: true,
                                        data: {noRemoveAll:!self.blnRadio?true:false}
                                    }]);
                                }
                            }

                        };

                        var selDomCache = {};//选中节点缓存数据
                        var selNodeCache ={};//选中Node节点缓存数据

                        //控件只允许单选时需要删除之前选中的节点
                        var delNode=function(node){
            
                            if(!self.blnRadio){
                                 Fx.recur(node.nodes, 'nodes', function (node) {
                                   let domCache = selDomCache[node[idKey]];
                                   if(domCache){
                                    domCache.remove();
                                    delete selDomCache[node[idKey]];
                                   }

                                 });

                                return;
                            }

                            let nodeArr=[node[idKey]];
                            Fx.recur(node.nodes, 'nodes', function (node) {
                                nodeArr.push(node[idKey]);
                            });

                            
                            let removeNodes=_.flatten(_.map(selNodeCache,(val,key)=>{
                                //if(node[idKey].indexOf(key)>=0) return [];
                                if((','+nodeArr.join(',')+',').indexOf(','+key+',')>=0) return [];
                                return val;
                            }));

                            selNodeCache={[node[idKey]]:node};

                            for(let key in selDomCache){
                                selDomCache[key].remove();
                                delete selDomCache[key];
                            }
                            selDomCache[node[idKey]] = $(Fx.format(selItemHtml, node.text, node[idKey], node.nodeId, node.dataType, node.text));
                            treeSelect.append(selDomCache[node[idKey]]);

                            _.each(removeNodes,node=>{
                                treeComp.treeview('uncheckNode', [node.nodeId, {
                                    silent: false,
                                    noRender: true
                                }]);
                            });
                        };

                        var func = function (a, node, parentNode) {

                            counter = Fx.counter(arguments.callee);
                            var blnParentChecked = !parentNode ? false : parentNode.state.checked;//父节点是否选中
                            var blnAdd = node.state.checked;//节点是否为增加(true:增加,false:删除)
                            // var selItemHtml='<div class="selItem fadeInRight"><i class="fa fa-close" data-id="{1}" data-type="{3}" data-name="{4}" data-nodeId="{2}"></i>{0}</div>';
                            //根节点选中/未选中
                            if (!parentNode) {
                                Fx.recur(node.nodes, 'nodes', function (node) {
                                    if (selDomCache[node[idKey]] && !node.state.checked) {
                                        selDomCache[node[idKey]].remove();
                                        delete selDomCache[node[idKey]];
                                        delete selNodeCache[node[idKey]];
                                    }
                                });
                            }
                            //父节点选中(新增)
                            if (blnParentChecked && blnAdd) {
                                if ((',' + searchKind + ',').indexOf(',' + node.dataType + ',') < 0) {
                                    Fx.recur(node.nodes, 'nodes', function (childNode) {
                                        var parentNode = treeComp.treeview('getNode', childNode.parentId);
                                        if ((',' + searchKind + ',').indexOf(',' + parentNode.dataType + ',') < 0 && (',' + searchKind + ',').indexOf(',' + childNode.dataType + ',') >= 0) {
                                            if (selDomCache[childNode[idKey]]) {
                                                return;
                                            }
                                            selDomCache[childNode[idKey]] = $(Fx.format(selItemHtml, childNode.text, childNode[idKey], childNode.nodeId, childNode.dataType, childNode.text));
                                            treeSelect.append(selDomCache[childNode[idKey]]);
                                            selNodeCache[childNode[idKey]]=childNode;

                                            delNode(childNode);
                                        }
                                    });
                                    return;
                                }

                                if ((',' + searchKind + ',').indexOf(',' + parentNode.dataType + ',') < 0) {
                                    return;
                                }

                                var nodes = parentNode.nodes;

                                _.each(nodes, function (node) {
                                    if (selDomCache[node[idKey]]) {
                                        selDomCache[node[idKey]].remove();
                                        delete selDomCache[node[idKey]];
                                        delete selNodeCache[node[idKey]];
                                    }
                                });
                                if (selDomCache[parentNode[idKey]]) {
                                    return;
                                }

                                selDomCache[parentNode[idKey]] = $(Fx.format(selItemHtml, parentNode.text, parentNode[idKey], parentNode.nodeId, parentNode.dataType, parentNode.text));
                                selNodeCache[parentNode[idKey]]=parentNode;

                            } else if (!blnParentChecked && blnAdd) {
                                //父节点未选择选中(新增)
                                if (selDomCache[node[idKey]]) {
                                    return;
                                }
              
                                if ((',' + searchKind + ',').indexOf(',' + node.dataType + ',') < 0) {
                                    Fx.recur(node.nodes, 'nodes', function (childNode) {
                                        var parentNode = treeComp.treeview('getNode', childNode.parentId);
                                        if ((',' + searchKind + ',').indexOf(',' + parentNode.dataType + ',') < 0 && (',' + searchKind + ',').indexOf(',' + childNode.dataType + ',') >= 0) {
                                            if (selDomCache[childNode[idKey]]) {
                                                return;
                                            }
                                            selDomCache[childNode[idKey]] = $(Fx.format(selItemHtml, childNode.text, childNode[idKey], childNode.nodeId, childNode.dataType, childNode.text));
                                            treeSelect.append(selDomCache[childNode[idKey]]);
                                            selNodeCache[childNode[idKey]]=childNode;
                                            delNode(childNode);
                                        }
                                    });
                                    return;
                                }
                                
                                selDomCache[node[idKey]] = $(Fx.format(selItemHtml, node.text, node[idKey], node.nodeId, node.dataType, node.text));
                                selNodeCache[node[idKey]]=node;
                                _.each(node.nodes, function (node) {
                                    if (selDomCache[node[idKey]]) {
                                        selDomCache[node[idKey]].remove();
                                        delete selDomCache[node[idKey]];
                                        delete selNodeCache[node[idKey]];
                                    }
                                });
                                treeSelect.append(selDomCache[node[idKey]]);
                                delNode(node);
                            } else if (!blnParentChecked && !blnAdd) {
                                //父节点未选择选中(删除)
                                if (selDomCache[node[idKey]]) {
                                    selDomCache[node[idKey]].remove();
                                    delete selDomCache[node[idKey]];
                                    delete selNodeCache[node[idKey]];
                                }
                                if ((',' + searchKind + ',').indexOf(',' + node.dataType + ',') < 0) {
                                    Fx.recur(node.nodes, 'nodes', function (childNode) {
                                        if (selDomCache[childNode[idKey]] && !childNode.state.checked) {
                                            selDomCache[childNode[idKey]].remove();
                                            delete selDomCache[childNode[idKey]];
                                            delete selNodeCache[childNode[idKey]];
                                        }
                                    });

                                    return;
                                }
                                _.each(node.nodes, function (node) {
                                    if (selDomCache[node[idKey]] && !node.state.checked) {
                                        selDomCache[node[idKey]].remove();
                                        delete selDomCache[node[idKey]];
                                        delete selNodeCache[node[idKey]];
                                    }
                                    if (node.state.checked) {
                                        if (selDomCache[node[idKey]]) {
                                            return;
                                        }

                                        selDomCache[node[idKey]] = $(Fx.format(selItemHtml, node.text, node[idKey], node.nodeId, node.dataType, node.text));
                                        selNodeCache[node[idKey]]=node;
                                        treeSelect.append(selDomCache[node[idKey]]);
                                    }
                                });
                            }
                        };
                        var counter = Fx.counter(func);
                        var defVal = defautVal ? eval('(' + defautVal + ')') : [];
                        //重构树形结构数据(服务器数据与树形结构数据不一致需要重构)
                        //blnCheck:是否默认勾选
                        var struTreeData = function (data, callback, blnCheck,parentIndex,parentCode) {
                            var selArea = (',' + searchKind + ',').indexOf(',0,') >= 0,
                                selPolice = (',' + searchKind + ',').indexOf(',2,') >= 0,
                                selSite = (',' + searchKind + ',').indexOf(',1,') >= 0;
                            Fx.recur(data, childKey, function (item, index, parent) {
                                //只能选择场所的情况
                                if (!selPolice && !selSite && '1,2'.indexOf(typeMap[item.type]) >= 0) {
                                    return true;
                                }
                                //可以选择派出所或区域但不能选择场所
                                if (!selSite && '1'.indexOf(typeMap[item.type]) >= 0) {
                                    return true;
                                }

                                if (isAddCodeArray) {
                                    treeDataCodeArray.push(item.code);
                                }
                                item.text = item.name;
                                item.state = item.state || {checked: !!blnCheck};
                                item.discheckable=searchKind.indexOf(typeMap[item.type])<0;
                                item.blnEndNode=(searchKind==typeMap[item.type] && (searchKind == '1' || searchKind =='2'));//只能单独选场所或则派出所的情况下,需要把展开图标去掉
                                item.dataType = typeMap[item.type] || 0;//0区域
                                item.parentCode = parentCode || ( parent && parent.code) || "";
                                item.dataIndex =(parentIndex && parentIndex+','+index) || ( parent && parent.dataIndex + "," + index) || "" + index;

                                //delete item.name;
                                if (item[childKey]) {
                                    item.nodes = item[childKey];
                                    //delete item[childKey];
                                }
                            }, function (result) {
                                callback(result[0]);
                            });
                        };

                        //递归展开父级节点
                        var recursionExpandParent = function (node) {
                            if (node && node.parentId) {
                                //获取父节点
                                var parentNode = treeComp.treeview('getNode', node.parentId);
                                //父节点存在
                                if (parentNode) {
                                    //父节点未展开
                                    if (parentNode.state && !parentNode.state.expanded) {
                                        treeComp.treeview('expandNode', [node.parentId, {silent: true}]);
                                    }
                                    arguments.callee(parentNode);
                                }
                            }
                        };

                        var setDefVal = function () {
                            //treeContainer.append(setDefValTips);//添加加载中动画
                            //勾选默认值
                            var defVal = defautVal ? eval('(' + defautVal + ')') : [];
                            var setDefValStartTime = (new Date()).getTime();
                            for (var i = 0; i < defVal.length; i++) {
                                var nodes = treeComp.treeview('findNodes', ['i', {
                                    name: 'code',
                                    val: defVal[i].code
                                }]);

                                for (var j = 0; j < nodes.length; j++) {
                                    if (nodes[j].type == defVal[i].type) {
                                        treeComp.treeview('checkNode', [nodes[j].nodeId, {silent: false,noRender:true}]);
                                        //选中项父级展开
                                        //treeComp.treeview('expandNode', [nodes[j].parentId, {silent: true}]);
                                        recursionExpandParent(nodes[j]);
                                    }
                                }
                            }
                            var setDefValEndTime = (new Date()).getTime();
                            var rangeSetDefValTime = parseInt(setDefValEndTime) - parseInt(setDefValStartTime)
                            
                        };

                        //初始化树
                        function initTree(data) {
                           return new Promise((resolve,reject)=>{
                                struTreeData(data, function (result) {
    
                                    treeComp.treeview({
                                        data: result,
                                        showCheckbox: true,
                                        uncheckedIcon: 'uncheckIcon_tree',
                                        checkedIcon: 'checkIcon_tree',
                                        showBorder: false, levels: 2,
                                        onNodeChecked: function (event, node, extrData) {
                                            //存在父节点的情况
                                            checkParentNode(node, true);
                                            if (!(extrData && extrData.noAddAll && node.nodes)) {

                                                _.each(node.nodes, function (nodeChild) {
                                                    if (!nodeChild.state.checked) {
                                                        counter.add();
                                                        treeComp.treeview('checkNode', [nodeChild.nodeId, {
                                                            silent: false,
                                                            noRender: true
                                                        }]);
                                                    }
                                                });
                                            }
                                            counter.exec(counter, treeComp.treeview('getNode', node.nodeId), (node.parentId || node.parentId == 0) ? treeComp.treeview('getNode', node.parentId) : null);
                                        },
                                        onNodeUnchecked: function (event, node, extrData) {
                                            //存在父节点的情况
                                            checkParentNode(node, false);

                                            if (!(extrData && extrData.noRemoveAll && node.nodes)) {
                                                _.each(node.nodes, function (nodeChild) {
                                                    if (nodeChild.state.checked) {
                                                        counter.add();
                                                        treeComp.treeview('uncheckNode', [nodeChild.nodeId, {
                                                            silent: false,
                                                            noRender: true
                                                        }]);
                                                    }
                                                });
                                            }
                                            counter.exec(counter, treeComp.treeview('getNode', node.nodeId), (node.parentId || node.parentId == 0) ? treeComp.treeview('getNode', node.parentId) : null);
                                        },
                                        onNodeExpanded: function (event, node, extrData) {
                                            if (!node.nodes)return;
                                            if (node.nodes.length > 0) return;
                                            //简单判断当前是否只允许选择一种类型数据(场所，派出所的情况不需要获取后面的子数据)
                                            // if(searchKind=='1' || searchKind=='2' &&  searchKind==typeMap[node.type]){
                                
                                            //     return;
                                            // }

                                            treeComp.treeview('setNodeIcon', [node, 'fa fa-spinner fa-spin']);

                                
                                            store.dispatch(GET_PLACE,{code:node[idKey], type:node.type}).then(function (code) {
                                                var childData = _.map(code,c=>{c.selectable=false; return c;});

                                                var copyChildData = Fx.Clone(childData);
                                                isAddCodeArray = true;
                                                struTreeData(childData, function (childNodes) {
                                                    treeComp.treeview('addNode', [node.nodeId, {node: childNodes}]);
                                                    treeComp.treeview('setNodeIcon', [node, '']);

                                                    if (node.state.checked && (',' + searchKind + ',').indexOf(',' + node.dataType + ',') < 0) {
                                                        Fx.recur(childNodes, 'nodes', function (childNode) {
                                                            var parentNode = treeComp.treeview('getNode', childNode.parentId);
                                                            if ((',' + searchKind + ',').indexOf(',' + parentNode.dataType + ',') < 0 && (',' + searchKind + ',').indexOf(',' + childNode.dataType + ',') >= 0) {
                                                                if (selDomCache[childNode[idKey]]) {
                                                                    return;
                                                                }
                                                                selDomCache[childNode[idKey]] = $(Fx.format(selItemHtml, childNode.text, childNode[idKey], childNode.nodeId, childNode.dataType, childNode.text));
                                                                treeSelect.append(selDomCache[childNode[idKey]]);
                                                            }
                                                        });
                                                    }
                                                }, node.state.checked,node.dataIndex,node.parentCode);
                                                addChildToTreeData(copyChildData, node.dataIndex);
                                            });
                                        }
                                    });
                                    resolve("树生成成功");
                                });
                            });
                        };
                        //请求树json数据
                        var queryTreeData = function () {
                            treeContainer.append(loadHtmlTree);//添加加载中动画
                            var searchTreeStartTime = (new Date()).getTime();
                            let placeSerachKind = searchKind.replace('1','3').replace('0','1');
                            //code:'410500', type:'1' || placeSerachKind //测试属性控件卡属性
                 
                            store.dispatch(GET_PLACE,{code:'', type: placeSerachKind, defaultVal:defVal}).then(function (code) {
                                
                                var searchTreeEndTime = (new Date()).getTime();
                                var rangeTreeTime = parseInt(searchTreeEndTime) - parseInt(searchTreeStartTime);
                                //treeContainer.find('.load6').remove();
                                treeContainer.find('.loadHtmlTree').remove();
                                var data =code;
                                treeData = data;
                                initTree(Fx.Clone(data)).then(function (data) {
                                    setDefVal();
                                });
                            });
                        };
                        //展开tree的时候，如果是请求的数据，将请求到的事件添加到treeData
                        var addChildToTreeData = function (children, strIndex) {
                            if (children && children instanceof Array) {
                                var indexArray = strIndex.split(",");
                                switch (indexArray.length) {
                                    case 1:
                                        treeData[indexArray[0]].child = children;
                                        break;
                                    case 2:
                                        treeData[indexArray[0]].child[indexArray[1]].child = children;
                                        break;
                                    case 3:
                                        treeData[indexArray[0]].child[indexArray[1]].child[indexArray[2]].child = children;
                                        break;
                                }
                            }
                        };
                        //判断treeData 是否包含defVal的值
                        var isHasDefVal = function () {
                            if (defVal.length > 0) {
                                for (var i = 0; i < defVal.length; i++) {
                                    if (!_.contains(treeDataCodeArray, defVal[i].code)) {
                                        return false;
                                    }
                                }
                            }
                            return true;
                        };

                        //treeData为undefined 或者 treeData不完全包含默认值defVal，向后端请求树数据
                        if (!treeData || !isHasDefVal()) {
                            isAddCodeArray = true;//允许将请求到树节点数据的code值保存到treeDataCodeArray中
                            treeDataCodeArray = [];//清空treeDataCodeArray
                            queryTreeData();//请求数据
                        } else {
                            isAddCodeArray = false;
                            initTree(Fx.Clone(treeData)).then(function () {
                                setDefVal();
                            });
                        }
        
                        //注册选项单击事件
                        layero.find('.select,.map').click(function () {
                            blnTree = $(this).attr('class').indexOf('select') >= 0;
                            if (blnTree) {//树形结构选择
                                layero.find('.tree_page').show();
                                layero.find('.map_page').hide();
                                layero.find('button[name="btn_clear"]').show();
                                layero.find('span[name="map_placeNumebr"]').hide();
                                curPageIndex = 0;
                            } else {//地图结构选择
                                //加载场所
                                if (!hasLoadMap) {
                                    hasLoadMap = true;
                                    setTimeout(function(){setPlaces(hasLoadMap);},200);
                                }
                                layero.find('.tree_page').hide();
                                layero.find('.map_page').show();
                                layero.find('button[name="btn_clear"]').show();
                                layero.find('span[name="map_placeNumebr"]').show();
                                curPageIndex = 1;
                            }
                        });

                        //注册场所选中项删除事件
                        layero.on('click', '.tree_select_item .selItem i', function () {
                            var id = $(this).attr('data-id'), nodeId = $(this).attr('data-nodeId');
                            treeComp.treeview('uncheckNode', [+nodeId, {silent: false,noRender:true}]);
                        });
                        /********************************************************************************************************************/
                        //设置地图场所信息
                        var markers = [];
                        var cacheData={};
                        var labels={};
                        var setPlaces = function (blnInit) {
                            var centerPointer = map.getCenter();
                            var bounds=map.getBounds();
                            var lb=bounds.getSouthWest(),rt=bounds.getNorthEast();
                        
                            if(blnInit){
                                centerPointer=new BMap.Point(userInfo.lng || 0,userInfo.lat || 0);
                            } 
                            
                            //添加加载中提示框
                            mapContainer.append(loadHtml);
                            store.dispatch(SearchRangeSites,{lb:lb, rt:rt}).then(function (code) {
                                mapContainer.find('.load6').remove();
                                var data = code;
                                var tempMarker = [];
                                for (var i = 0; i < data.length; i++) {
                                    if (cachePlace[data[i].code]) {
                                        continue;
                                    }
                                    cachePlace[data[i].code] = data[i];
                                    cacheData[parseFloat(data[i].lng)+'-'+parseFloat(data[i].lat)]=data[i];
                                    var marker=new BMap.Marker(new BMap.Point(data[i].lng, data[i].lat));
                                    //添加数遍移上/移下事件(添加描述遮罩)
                                    var marker_triangle_html='<div class="triangle pulse" style="background-color:rgb(0, 204, 102);color: white;padding: 0px 10px;border-radius: 5px;min-width:140px;padding:5px 10px;">{0}</div>';
                                    var posSearchHtml=function(data){
                                        var result='';
                                        var template='<div>{0}&nbsp;&nbsp;:&nbsp;&nbsp;{1}</div>';
                                        result+=Fx.format(template,'全称',data.name || '');
                                        result+=Fx.format(template,'地址',data.address || '');
                                        result+=Fx.format(template,'电话',data.tel || '');
                                        result+=Fx.format(template,'在线上网人员','('+(data.onlinepeoplecount || 0)+'&nbsp;人)');

                                        return result;
                                    };
                                    
                                    marker.addEventListener("mouseover",function(e){
                                        
                                         var point=e.target.point;
                                         $('.BMapLabel').parent('div').css('z-index',1000);

                                         if(!cacheData[point.lng+'-'+point.lat]){return;}
                                         var label= new BMap.Label(Fx.format(marker_triangle_html,posSearchHtml(cacheData[point.lng+'-'+point.lat])),{position:point, offset:new BMap.Size(-70, -130)});
                                         label.setStyle({
                                            fontSize : "12px",
                                            lineHeight : "20px",
                                            fontFamily:"微软雅黑",
                                            fontWeight:'600',
                                            border:'0px solid black',
                                            'background-color':'transparent',
                                            'max-width':'none'
                                         });
                                         map.addOverlay(label);
                                         labels[point.lng+'-'+point.lat]=label;
                                    });
                                    marker.addEventListener("mouseout",function(e){
                                        $('.BMapLabel').parent('div').css('z-index',500);
                                        var point=e.target.point;
                                        if(!cacheData[point.lng+'-'+point.lat]){return;}
                                        var label=labels[point.lng+'-'+point.lat];
                                        map.removeOverlay(label);
                                        delete labels[point.lng+'-'+point.lat];
                                    });

                                    //构造场所遮罩
                                    markers.push({
                                        marker: marker,
                                        siteid: data[i].code
                                    });
                                    tempMarker.push(marker);
                                }
                                new BMapLib.MarkerClusterer(map, {markers: tempMarker});
                            });
                        };
                        //初始化地图页面
                        var map = new BMap.Map("map_pop" + map_id,{minZoom:13,maxZoom:18});
                        //LoadOverlayImage(map);//加载瓦片图
                        //map.centerAndZoom(new BMap.Point(106.33,29.35),13);//重庆中心点
                        let centerPoint=tool.cookie.get('centerPoint').split(',') || [];
                        map.centerAndZoom(new BMap.Point(centerPoint[0] || 0,centerPoint[1] || 0),13);//安阳中心点
                        //map.centerAndZoom('安阳');

                        //console.log(BMap.LocalSearch);

                        map.enableScrollWheelZoom(true);
                        // var ScaleControl = new BMap.ScaleControl();
                        // map.addControl(ScaleControl);
                        //生成鼠标绘制工具
                        var overlays = [];
                        var overlaycomplete = function (e, o) {
                            var count = 0, bound = e.overlay.getBounds();
                            var result = [];
                            for (var i = 0; i < markers.length; i++) {
                                if (bound.containsPoint(markers[i].marker.point)) {
                                    count++;
                                    var data = cachePlace[markers[i].siteid];
                                    if (data) {
                                        result.push({code: data.code, name: data.name});
                                    }
                                }
                            }
                            mapResult = result;
                            //设置显示信息
                            layero.find('span[name="map_placeNumebr"]').html('已选择' + count + '所场所');
                            overlays.push(e.overlay);
                        };
                        var styleOptions = {
                            strokeColor: "red",    //边线颜色。
                            fillColor: "red",      //填充颜色。当参数为空时，圆形将没有填充效果。
                            strokeWeight: 3,       //边线的宽度，以像素为单位。
                            strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
                            fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
                            strokeStyle: 'solid' //边线的样式，solid或dashed。
                        };
                        //实例化鼠标绘制工具
                        var drawingManager = new BMapLib.DrawingManager(map, {
                            isOpen: false, //是否开启绘制模式
                            enableDrawingTool: true, //是否显示工具栏
                            enableCalculate: false,//开起计算模式
                            drawingToolOptions: {
                                anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                                offset: new BMap.Size(5, 5), //偏离值
                                drawingModes: [
                                    BMAP_DRAWING_CIRCLE,
                                    BMAP_DRAWING_RECTANGLE
                                ]
                            },
                            circleOptions: styleOptions, //圆的样式
                            rectangleOptions: styleOptions //矩形的样式
                        });
                        //添加鼠标绘制工具监听事件，用于获取绘制结果
                        drawingManager.addEventListener('overlaycomplete', overlaycomplete);
                        function clearAll() {
                            for (var i = 0; i < overlays.length; i++) {
                                map.removeOverlay(overlays[i]);
                            }
                            overlays.length = 0
                            layero.find('span[name="map_placeNumebr"]').html('已选择' + overlays.length + '所场所');
                            mapResult = [];
                        }

                        //添加地图鼠标拖动事件
                        map.addEventListener('dragend', function (e) {
                            Fx.DelayTrigger(function () {
                                setPlaces();
                            }, map, 200);
                        });
                        //注册确定/关闭按钮单击事件
                        layero.find('button[name="btn_ok"],button[name="btn_close"],button[name="btn_clear"]').click(function () {
                            var btn_type = $(this).attr('name');
                            var btnOkBackState = true;//点击确定按钮返回的状态值
                            switch (btn_type) {
                                case 'btn_ok':
                                    switch (curPageIndex) {
                                        case 0://树形页面点击确定
                                            var data = {regions: [], polices: [], sites: []};
                                            _.each(selDomCache, function (item, key) {
                                                var iEl = item.find('i'), type = iEl.attr('data-type'), name = iEl.attr('data-name');
                                                if (type == '0') {
                                                    data.regions.push({code: key, name: name});
                                                } else if (type == '1') {
                                                    data.sites.push({code: key, name: name});
                                                } else if (type == '2') {
                                                    data.polices.push({code: key, name: name});
                                                }
                                            });
                                            btnOkBackState = callback(data);
                                            break;
                                        case 1://地图页面点击确定
                                            btnOkBackState = callback({
                                                regions: [],
                                                polices: [],
                                                sites: mapResult
                                            });
                                            break;
                                    }
                                    if (btnOkBackState) {
                                        layer.close(index);
                                    }
                                    // layer.style(index,{'display':'none'});
                                    // $('#layui-layer-shade'+index).hide();
                                    break;
                                case 'btn_close':
                                    layer.close(index);
                                    // layer.style(index,{'display':'none'});
                                    // $('#layui-layer-shade'+index).hide();
                                    break;
                                case 'btn_clear':
                                    if(blnTree){
                                        $('.tree_select_item .selItem i').trigger('click');
                                    }else{
                                        clearAll();
                                    }
                                    break;
                            }
                        });

                        //监听清空事件
                        vm.$on('palceClear', function () {
                            clearAll();
                            layero.find('.tree_select_item .selItem i').click();
                        });

                        //默认触发第一个操作项
                        layero.find('div[name="option"]').eq(0).click();
                }
            };
            

            return param;
         }(self.i_searchKind,self.i_idKey,self.childKey,self.defautVal,self.$store,self,self.userInfo,self.callback || function(){})); 

         Fx.animationend(this.$el,function(dom){
            $(dom).removeClass('pulse');
         });
      }
  }
}
</script>
<style>
.anchorBL a {display:none;}
.BMap_cpyCtrl{display:none;}
.tag .item{
    display: inline-block;
    width: 50%;
    background-color: #45B6AF;
    height: 100%;
    border-right: 2px ridge #45B6AF;
    text-align: center;
    line-height: 40px;
    color: white;
    font-size: 20px;
    cursor:pointer;
    transition: all .5s;
}

.tag .item:hover{
    background-color:#18a689;
}

.tag .map{
    border-right: none;
}

.bar{
    position:relative;
    overflow: hidden;
}

.noBar{
    height:0px;
}

.tag .item:hover:nth-of-type(1) ~ .marker{
    transform: translateX(0%);
}
.tag .item:hover:nth-of-type(2) ~ .marker{
    transform: translateX(100%);
}

.tag .marker{
    width:50%;
    height:5px;
    position: absolute;
    bottom: 0px;
    background-color:#333;
    transform: translateX(-100%);
    -webkit-transition: all 0.33s cubic-bezier(0.38, 0.8, 0.32, 1.07);
    transition: all 0.33s cubic-bezier(0.38, 0.8, 0.32, 1.07);
}

.tree_page,map_page{
    display:none;
    width:100%;
}
.tree_page .tree{
    float: left;
    width:50.4%;
    height:100%;
}

.tree_page .tree_select_item{
    float: left;
    width:49.2%;
    height:100%;
}

.tree_page .list-group{
    margin:0px;
}

.tree_select_item .selItem{
    width: 80%;
    line-height: 30px;
    padding:0px 20px;
    color: #333;
    background-color: #f5f5f5;
    margin: 10px 10px 0px 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.tree_select_item .selItem > i{
    margin-right:15px;
    cursor:pointer;
}

.tree_select_item .tree_select_container{
    padding-bottom: 10px;
}

.tag .option_bar{
    text-align: right;
    height: 50px;
    line-height: 40px;
    padding:0px 10px;
}

.tag .option_bar button{
    margin-right:10px;
}

.tag .tree_page{
    border-bottom: 1px solid #C2CCC9;
}

.tag .map_page{
    border-bottom: 4px solid #C2CCC9;
}
</style>

<style scoped lang="less">
    @import "../css/variables.less";
    //.PlaceSel .inputContainer{color:@Font_Hover_Col;}
    html{.TCol(~".PlaceSel .inputContainer");}
</style>
