<template>
    <div class="five-main">
        <div id="myDiagramDiv" class="gojs"></div>
        <div class="op">
            <input type="button" @click="getData()" value="测试">
            <input type="button" @click="addNode()" value="添加">
            <select name="" id="level">
                <option value="0">当前</option>
                <option value="1">下一泳道</option>
            </select>
        </div>
    </div>
</template>

<script>
import go, { Binding } from 'gojs'
// this controls whether the layout is horizontal and the layer bands are vertical, or vice-versa:
var HORIZONTAL = false;  // this constant parameter can only be set here, not dynamically

// Perform a TreeLayout where commitLayers is overridden to modify the background Part whose key is "_BANDS".
function BandedTreeLayout() {
    go.TreeLayout.call(this);
    this.layerStyle = go.TreeLayout.LayerUniform;  // needed for straight layers
}
go.Diagram.inherit(BandedTreeLayout, go.TreeLayout);

BandedTreeLayout.prototype.commitLayers = function (layerRects, offset) {
    // update the background object holding the visual "bands"
    var bands = this.diagram.findPartForKey("_BANDS");
    if (bands) {
        var model = this.diagram.model;
        bands.location = this.arrangementOrigin.copy().add(offset);

        // make each band visible or not, depending on whether there is a layer for it
        for (var it = bands.elements; it.next();) {
            var idx = it.key;
            var elt = it.value;  // the item panel representing a band
            elt.visible = idx < layerRects.length;
        }

        // set the bounds of each band via data binding of the "bounds" property
        var arr = bands.data.itemArray;

        for (var i = 0; i < layerRects.length; i++) {
            var itemdata = arr[i];
            if (itemdata) {
                model.setDataProperty(itemdata, "bounds", layerRects[i]);
            }
        }
    }
};

////////////--连线--//////////////////

////////////////////////////////
// end BandedTreeLayout
var $ = go.GraphObject.make;
export default {
    components: {},
    data() {
        return {
            images: require('@/assets/images/u830.svg'),
            myDiagram: null,
            linkDataArray: [
                { from: "0", to: "1", color: "#2196f3" },
                { from: "1", to: "2", color: "#2196f3" },
                { from: "2", to: "3", color: "#2196f3" },
                { from: "3", to: "4", color: "#2196f3" },
                { from: "1", to: "5", color: "#2196f3" },
            ],
            nodearray: [
                {
                    key: "_BANDS",
                    category: "Bands",
                    itemArray: [
                        { text: "治理意图", level: 0, color: '#ececec', bgColor: "#ececec" },//color 泳道分隔线颜色
                        { text: "治理目的", color: '#ffffff', bgColor: "#ffffff" },
                        // { text: "", color: '#ffffff', bgColor: "#ececec" },
                        { text: "治理方针", color: '#ececec', bgColor: "#ececec" },
                        { text: "终止状态", color: '#ffffff', bgColor: "#ffffff" },
                        { text: "终止状态标准", color: '#ececec', bgColor: "#ececec" }
                    ],
                },
                // these are the regular nodes in the TreeModel
                /** 
                 * category 标记开始 结束 节点
                */
                { key: "0", text: "治理意图", images: "u6.png", bgColor: "#ececec", level: 0, color: "#ab2f2f", tcolor: "#ffffff", fig: 'RoundedRectangle', "category": "Start" },
                { key: "1", text: "治理目的", images: "u7.png", parent: 0, level: 1, color: "#2c82d4", tcolor: "#ffffff", fig: 'RoundedRectangle' },
                { key: "2", text: "治理方针", images: "u19.png", parent: 1, level: 2, color: "#fa9653", tcolor: "#ffffff", fig: 'RoundedRectangle' },
                { key: "3", text: "终止状态", images: "u6.png", parent: 2, level: 3, color: "#ffffff", tcolor: "#000000" },
                { key: "4", text: "终止状态标准", images: "u6.png", parent: 3, level: 4, color: "#ccecff", tcolor: "#000000", "category": "End" },
                { key: "5", text: "终止状态标准", images: "u6.png", parent: 0, level: 2, color: "#ccecff", tcolor: "#000000", "category": "End" },

            ],
            //对应层级配置   
            nodeLevelConfig: [{
                color: '#2c82d4',
                text: "治理目的",
                tcolor: "#ffffff",
                fig: 'RoundedRectangle'
            }, {
                color: '#fa9653',
                tcolor: "#ffffff", text: "治理方针",
                fig: 'RoundedRectangle'
            }, {
                color: '#ffffff', text: "终止状态",
                tcolor: "#000000"
            }, {
                color: '#ccecff', text: "终止状态标准",
                tcolor: "#000000",
                category: "End"
            }]
        };
    },
    computed: {},
    watch: {},
    methods: {
        init() {
            this.myDiagram = $(go.Diagram, "myDiagramDiv",
                {
                    layout: $(BandedTreeLayout,  // BandedTreeLayout  DoubleTreeLayout
                        {
                            angle: HORIZONTAL ? 0 : 90,
                            arrangement: HORIZONTAL ? go.TreeLayout.ArrangementVertical : go.TreeLayout.ArrangementHorizontal,

                        }),
                    //isReadOnly: true, // 只读
                    "undoManager.isEnabled": true,
                    initialContentAlignment: go.Spot.Center,
                    initialAutoScale: go.Diagram.Uniform,
                    "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom, //有鼠标滚轮事件放大和缩小
                    //删除 ---删除管理的子级
                    // "commandHandler.copiesTree": true,
                    // "commandHandler.copiesParentKey": true,
                    "commandHandler.deletesTree": true,
                    //"draggingTool.dragsTree": true,
                });

            this.myDiagram.nodeTemplate = this.getNodeTemplate()

            //添加泳道
            this.addNodeBounds()
            this.myDiagram.linkTemplate =
                $(go.Link,//MultiArrowLink
                    {
                        toShortLength: 3,
                        // relinkableFrom: true,
                        // relinkableTo: true,
                        // reshapable: true,
                        // resegmentable: true
                    },
                    go.Link.Orthogonal,//连线样式 go.Link.Bezier  Orthogonal

                    //连接线颜色设置
                    $(go.Shape, { strokeWidth: 3, stroke: '#1296db' }),

                    // $(go.Shape, { strokeWidth: 1 },
                    //     new go.Binding("stroke", "color")),
                    // 箭头样式设置
                    $(go.Shape, { toArrow: "Standard", scale: 0.8, strokeWidth: 5, stroke: "#1296db" },
                    ),//  new go.Binding("fill", "color")
                );

            // define the tree node data
            //右键事件
            this.addContextMenu()
            // this.myDiagram.model = new go.TreeModel(this.nodearray);
            this.myDiagram.model = $(go.GraphLinksModel,
                {
                    copiesArrays: true,
                    copiesArrayObjects: true,
                    nodeDataArray: this.nodearray,
                    linkDataArray: this.linkDataArray
                });


            //自适应大小
            //this.myDiagram.commandHandler.zoomToFit();
            //设置某一个节点位于屏幕中心
            //   this.myDiagram.commandHandler.scrollToPart(this.myDiagram.findNodeForKey());
            //监听连线生成事件
            this.myDiagram.addDiagramListener("LinkDrawn", function (e) {
                console.log(e.subject.data.to);

            })
        },
        getNodeTemplate() {
            return $(go.Node, go.Panel.Auto,
                {
                    click: (a, b,) => {
                        //  console.log(b.data)
                    },
                    selectionChanged: () => {
                        //  console.log('选择')
                    },
                    pickable: true,
                    selectable: true,
                    resizable: false,
                    selectionAdorned: false,
                    textEditable: true,
                },
                $(go.Panel, "Auto",
                    {
                        padding: new go.Margin(0, 30, 0, 30),
                        margin: new go.Margin(0, 30, 0, 30),
                        click: function (a, b) {
                            //   console.log(a, b)
                        },
                    },
                    $(go.Picture, {
                        source: this.images,
                        background: null,
                        width: 120,
                        height: 80,
                    },
                        new go.Binding("source", (a) => {
                            return require('@/assets/images/' + a.images)
                        }),
                    ),
                    $(go.Picture, {
                        source: this.images,
                        background: null,
                        width: 30,
                        height: 30,
                        margin: new go.Margin(30, 0, 0, 120)
                    },
                        new go.Binding("source", (a) => {
                            return require('@/assets/images/u13.png')
                        }),
                    ),
                ),

                $(go.TextBlock,
                    {
                        stroke: "#000",
                        name: 'boss',
                        font: "18px sans-serif",
                        textAlign: "center",
                        wrap: go.TextBlock.WrapBreakAll,// TextBlock.WrapDesiredSize, TextBlock.
                        verticalAlignment: go.Spot.Center,//文字垂直居中
                        overflow: go.TextBlock.OverflowEllipsis,
                        editable: true,
                        margin: new go.Margin(90, 0, 0, 0),
                        // alignment: go.Spot.Left
                    },
                    new go.Binding("text", 'text').makeTwoWay(),
                )
            );
        },
        //添加右键事件
        addContextMenu() {
            this.myDiagram.nodeTemplate.contextMenu = $("ContextMenu",
                $("ContextMenuButton",
                    $(go.TextBlock, "修改名称", {
                        margin: 5,
                        width: 60,
                        textAlign: "center",
                    }),
                    { click: function (e, obj) { e.diagram.commandHandler.editTextBlock(); } },
                    new go.Binding("visible", "", function (o) { return o.diagram && o.diagram.commandHandler.canEditTextBlock(); }).ofObject()),
                // add one for Editing...
                $("ContextMenuButton",
                    $(go.TextBlock, " 删 除 "),
                    {
                        click: (e, obj) => {
                            e.diagram.commandHandler.deleteSelection();
                        }
                    },
                    new go.Binding("visible", "", function (o) { return o.diagram && o.diagram.commandHandler.canDeleteSelection(); }).ofObject())
            );
        },
        //添加泳道
        addNodeBounds() {
            this.myDiagram.nodeTemplateMap.add("Bands",
                $(go.Part, "Position",
                    new go.Binding("itemArray"),
                    {
                        isLayoutPositioned: true,  // but still in document bounds
                        locationSpot: new go.Spot(0, 0, 120, 0),
                        layerName: "Background",
                        pickable: false,
                        selectable: false,
                        resizable: true,
                        resizeObjectName: "Background",
                        itemTemplate:
                            $(go.Panel, HORIZONTAL ? "Vertical" : "Horizontal",
                                {
                                    // margin: new go.Margin(20, 20, 20, 20)
                                },
                                new go.Binding("position", "bounds", function (a, b, c, d) {
                                    console.log(b.data)
                                    return a.position;
                                }),
                                $(go.Panel, "Auto",
                                    {
                                        stretch: go.GraphObject.Horizontal,

                                    },  // as wide as the whole node
                                    $(go.Shape,//每个模块表头背景色
                                        {
                                            fill: "#716d6d",
                                            stroke: '#cdcdcd',
                                            margin: new go.Margin(0, 0, 0, 0)
                                        },
                                        new go.Binding("fill", "bgColor"),
                                        new go.Binding("width", "bounds", (r, a) => {
                                            //如果当前下一个标题为空 进行列合并 
                                            let percent = 1// this.getMegerLength(a.text)
                                            //宽度固定
                                            return HORIZONTAL ? r.width * percent : 120// r.height
                                        }),
                                        //标题 宽/高
                                        new go.Binding("height", "bounds", (r, a) => {
                                            let merge = 1// this.getMegerLength(a.text)
                                            return HORIZONTAL ? 30 : r.height * merge;
                                            //  return 30
                                        })//表头高度
                                    ),
                                    $(go.TextBlock,
                                        {
                                            alignment: go.Spot.Center,
                                            margin: 3,
                                            stroke: "#000",
                                            textAlign: "center",
                                            font: "bold 12pt sans-serif"
                                        },
                                        new go.Binding("text", "text"))),
                                // option 1: rectangular bands:
                                $(go.Shape,
                                    {
                                        stroke: '#cdcdcd', //泳道边框
                                        strokeWidth: 1,
                                        margin: new go.Margin(0, 0, 0, 0)
                                    },
                                    new go.Binding("desiredSize", "bounds", (r, a) => {
                                        let merge = 1// this.getMegerLength(a.text)
                                        if (merge === 2) {
                                            return HORIZONTAL ? new go.Size(r.size.width * 2, r.size.height) : new go.Size(r.size.width, r.size.height * 2)

                                        } else if (merge === 0) {
                                            return new go.Size(0, 0)
                                        }
                                        return new go.Size(r.size.width, r.size.height)//r.size;
                                    }),
                                    //修改泳道颜色
                                    // new go.Binding("fill", "itemIndex", function (i) { return i % 2 == 0 ? "#f5f6f7" : go.Brush.darken("#ececec"); }).ofObject())
                                    new go.Binding("fill", "color")
                                ),


                            )
                    }
                ));
        },
        //获取数据
        getData() {
            console.log(this.myDiagram.model.toJson())
        },
        //添加节点
        addNode() {
            let node = {};
            node["key"] = "节点Key";
            node["loc"] = "0 0";//节点坐标
            node["text"] = "节点名称";
            this.myDiagram.model.addNodeData(node);
        },
        addNodeAndLink(e, obj) {
            //先添加泳道
            let fromNode = obj.part;
            let fromData = fromNode.data;
            let level = fromData.level + 1
            // //泳道位置
            // let boundsLevel = document.getElementById('level').value
            // if (level > 4) {
            //     console.log('等级错误')
            //     return
            // }
            // //父级数据
            // let index = this.nodearray.findIndex(v => v.key === fromData.key)
            // let swimData = this.nodearray[0].itemArray
            // //当前泳道  等级不变
            // if (boundsLevel == '0') {
            //     //当前泳道--已经有下级泳道
            //     if (swimData[level] && swimData[level].text === '') {
            //         console.log('当前--拥有下级泳道')
            //     } else {
            //         //没有下级泳道进行添加
            //         this.addSwimNodeData(level, fromData.bgColor, '0');
            //     }
            //     level -= 1
            // } else {
            //     //拥有下一泳道
            //     if (swimData[level]) {
            //         console.log('下一级 拥有泳道')
            //     } else {
            //         this.addSwimNodeData(level, fromData.bgColor, level);
            //     }
            // }

            //如果拥有子级 不在添加泳道
            // if (!this.nodearray.find(v => v.level === level)) {
            //     this.addSwimNodeData(level, fromData.bgColor);
            // } else {
            //     console.log('拥有')
            // }

            //  this.$nextTick(() => {
            let diagram = fromNode.diagram;
            diagram.startTransaction("Add State");
            // get the node data for which the user clicked the button

            // create a new "State" data object, positioned off to the right of the fromNode
            let p = fromNode.location.copy();
            p.x += diagram.toolManager.draggingTool.gridSnapCellSize.width;
            //nodeLevelConfig

            let toData = {
                key: (Math.random() * (36 - 1) + 1).toString(32).substr(2, 6),
                ... this.nodeLevelConfig[level - 1],
                level: level,//记录当前层级  设置子样式
                loc: go.Point.stringify(p)
            };
            // add the new node data to the model
            let model = diagram.model;
            model.addNodeData(toData);
            // create a link data from the old node data to the new node data
            var linkdata = {
                from: model.getKeyForNodeData(fromData),
                to: model.getKeyForNodeData(toData)
            };
            // 添加连线
            model.addLinkData(linkdata);
            // 选中新增的node
            let newnode = diagram.findNodeForData(toData);
            // diagram.select(newnode);
            //  将新节点吸附到有效位置
            newnode.location = diagram.toolManager.draggingTool.computeMove(newnode, p);
            // 考虑重叠部分
            this.shiftNodesToEmptySpaces();
            //新增动画
            diagram.commitTransaction("Add State");
            // })
        },
        //新增节点重叠部分处理
        shiftNodesToEmptySpaces() {
            this.myDiagram.selection.each((node) => {
                if (!(node instanceof go.Node)) return;
                // look for Parts overlapping the node
                while (true) {
                    var exist = this.myDiagram.findObjectsIn(node.actualBounds,
                        // only consider Parts
                        function (obj) { return obj.part; },
                        // ignore Links and the dropped node itself
                        function (part) { return part instanceof go.Node && part !== node; },
                        // check for any overlap, not complete containment
                        true).first();
                    if (exist === null) break;
                    // try shifting down beyond the existing node to see if there's empty space
                    node.position = new go.Point(node.actualBounds.x, exist.actualBounds.bottom + 10);
                }
            });
        },
        /** 
         * 添加泳道
         * @param {*} level 泳道层级 【父泳道+1】
         * @param {*} color 泳道颜色
        */
        addSwimNodeData(level, color, boundsLevel) {
            //当前泳道
            if (boundsLevel == '0') {
                this.nodearray[0].itemArray.splice(level, 0, { text: "", level: level, color: color, bgColor: color })
            } else {
                let colors = color === '#ececec' ? '#ffffff' : '#ececec'
                this.nodearray[0].itemArray.splice(level, 0, { text: "泳道" + (+new Date()), level: level, color: colors, bgColor: colors })
            }
            this.myDiagram.model = new go.TreeModel(this.nodearray);

        }
    },
    created() {

    },
    mounted() {
        this.init();

    },

}
</script>
<style  scoped>
.five-main {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
}
.op {
    width: 200px;
    height: 100%;
    border: 1px solid #ececec;
}
.gojs {
    flex: 1;
    height: 100%;
}
</style>