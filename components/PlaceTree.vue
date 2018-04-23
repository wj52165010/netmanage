<!-- 场所树形结构选择组件 -->
<template>
    <div class="PlaceTree">
        <div name="scrollContainer">
            <div class="tree" style="width:100%;height:100%;"></div>
        </div>
    </div>
</template>

<script>
import '../../static/bootstrap-treeview/bootstrap-treeview.min.css'
import '../../static/bootstrap-treeview/bootstrap-treeview.min.js'
import '../../static/jquery.slimscroll.min.js'
import {GET_PLACE,SearchRangeSites} from '../store/mutation-types'

export default {
  name: 'PlaceTree',
  props:['store'],
  data () {
    return {
    }
  },
  mounted(){
    this.init();
  },
  methods:{
      //重新初始化滚动条插件
      initScroll(){
        $(this.$el).find('div[name="scrollContainer"]').height($(this.$el).height()).slimScroll({
            position: 'right',
            size: '6px',
            color: '#44B5AE'
        });
      },
      init(){
        let searchKind='1';
        let defautVal='';
        var typeMap = ['', 0, 2, 1];//服务端数据类型跟客户端第一不一致这里来映射(0:地区,2:派出所,1:场所)
        var treeData;
        var treeDataCodeArray = [];//保存treeData所有节点的code值
        var isAddCodeArray = false;
        var store=this.$store || this.store;
        var idKey='code';
        var childKey='child';
        var treeContainer =$(this.$el);
        var loadHtml = '<div class="load6" style="position:absolute;width:100%;height:100%;"><div class="loader" style="margin-top:2em;"></div></div>';
        var loadHtmlTree = '<div class="loadHtmlTree" style="position:absolute;width:100%;top: 25%;"><div class="spinner"><div class="rect1"></div>' +
                                '<div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5">' +
                                '</div></div><div style="margin:0px auto;height:40px;text-align:center;">数据查询中</div></div>';

        let Rx=store.getters.Rx;
        let resEmit=(new Rx.Subject()).debounceTime(300);
        //接收选中结果值
        resEmit.subscribe(res=>{
            let data=[];
            _.each(selDomCache, function (item, key) {
                var iEl = item.find('i'), type = iEl.attr('data-type'), name = iEl.attr('data-name');
                data.push({code: key, name: name});
            });

            this.$emit('change',data);
        });

        let treeComp =$(this.$el).find('div[class="tree"]');
            $(this.$el).find('div[name="scrollContainer"]').height($(this.$el).height()).slimScroll({
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

        var selDomCache ={};//选中节点缓存数据
        var selNodeCache ={};//选中Node节点缓存数据

        //控件只允许单选时需要删除之前选中的节点
        var delNode=function(node){
            if(!self.blnRadio){return;}
            let nodeArr=[node[idKey]];
            Fx.recur(node.nodes, 'nodes', function (node) {
                nodeArr.push(node[idKey]);
            });
            let removeNodes=_.flatten(_.map(selNodeCache,(val,key)=>{
                if((','+nodeArr.join(',')+',').indexOf(','+key+',')>=0) return [];
                return val;
            }));
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
                        resEmit.next(selDomCache);
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
                            //treeSelect.append(selDomCache[childNode[idKey]]);

                            resEmit.next(selDomCache);
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
                        resEmit.next(selDomCache);
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
                            //treeSelect.append(selDomCache[childNode[idKey]]);
                            resEmit.next(selDomCache);
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
                        resEmit.next(selDomCache);
                    }
                });

                //treeSelect.append(selDomCache[node[idKey]]);
                resEmit.next(selDomCache);
                delNode(node);
            } else if (!blnParentChecked && !blnAdd) {
                //父节点未选择选中(删除)
                if (selDomCache[node[idKey]]) {
                    selDomCache[node[idKey]].remove();
                    delete selDomCache[node[idKey]];
                    delete selNodeCache[node[idKey]];
                    resEmit.next(selDomCache);
                }
                if ((',' + searchKind + ',').indexOf(',' + node.dataType + ',') < 0) {
                    Fx.recur(node.nodes, 'nodes', function (childNode) {
                        if (selDomCache[childNode[idKey]] && !childNode.state.checked) {
                            selDomCache[childNode[idKey]].remove();
                            delete selDomCache[childNode[idKey]];
                            delete selNodeCache[childNode[idKey]];
                            resEmit.next(selDomCache);
                        }
                    });

                    return;
                }
                _.each(node.nodes, function (node) {
                    if (selDomCache[node[idKey]] && !node.state.checked) {
                        selDomCache[node[idKey]].remove();
                        delete selDomCache[node[idKey]];
                        delete selNodeCache[node[idKey]];
                        resEmit.next(selDomCache);
                    }
                    if (node.state.checked) {
                        if (selDomCache[node[idKey]]) {
                            return;
                        }

                        selDomCache[node[idKey]] = $(Fx.format(selItemHtml, node.text, node[idKey], node.nodeId, node.dataType, node.text));
                        selNodeCache[node[idKey]]=node;
                        //treeSelect.append(selDomCache[node[idKey]]);
                        resEmit.next(selDomCache);
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
                        treeComp.treeview('checkNode', [nodes[j].nodeId, {silent: false}]);
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
                            treeComp.treeview('setNodeIcon', [node, 'fa fa-spinner fa-spin']);

                            store.dispatch(GET_PLACE,{code:node[idKey], type:node.type}).then(function (code) {
                                var childData = code;
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
                                                //treeSelect.append(selDomCache[childNode[idKey]]);
                                                resEmit.next(selDomCache);
                                            }
                                        });
                                    }
                                }, node.state.checked,node.dataIndex,node.parentCode);
                                addChildToTreeData(copyChildData, node.dataIndex);
                            });
                        }
                    });
                });
            });
        };
        
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
      },
  }
}
</script>

<style scoped lang="less">
  @import "../css/variables.less";

  .PlaceTree{width:100%;height:100%;}
</style>
