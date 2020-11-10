<template>
    <div>
        <div id="myDiagramDiv" class="gojs-main"></div>
        <div class="op">
            <input type="button" @click="getData()" value="测试">
            <input type="button" @click="addNode()" value="添加">
        </div>
    </div>
</template>

<script>
import go, { Binding } from 'gojs'
// this controls whether the layout is horizontal and the layer bands are vertical, or vice-versa:
var HORIZONTAL = true;  // this constant parameter can only be set here, not dynamically

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
                // layerRects[i].width = 500
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
            myDiagram: null,
            linkDataArray: [
                { from: "0", to: "1", color: "#2196f3" },
                { from: "1", to: "1.1", color: "#2196f3" },
                { from: "1.1", to: "2", color: "#2196f3" },
                { from: "2", to: "3", color: "#2196f3" },
                { from: "3", to: "end", color: "#2196f3" },
            ],
            nodearray: [
                {
                    key: "_BANDS",
                    category: "Bands",
                    itemArray: [
                        { text: "初始状态", color: '#f2f2f2' },//color 泳道分隔线颜色
                        { text: "应急响应阶段", color: '#ffffff' },
                        { text: "", color: '#ffffff' },
                        { text: "管控维稳阶段", color: '#f2f2f2' },
                        { text: "全面恢复阶段", color: '#ffffff' },
                        { text: "终止状态", color: '#f2f2f2' },
                    ],
                },
                // these are the regular nodes in the TreeModel
                /** 
                 * category 标记开始 结束 节点
                */
                { key: "0", text: "初始\n状态", level: 0, color: "#b24444", tcolor: "#ffffff", category: "Start", },
                { key: "1", text: "应急响应阶段", level: 1, color: "#4c7bbc", tcolor: "#ffffff" },
                { key: "1.1", text: "应急响应阶段", level: 2, color: "#4c7bbc", tcolor: "#ffffff" },
                { key: "2", text: "管控维稳阶段", level: 3, color: "#4c7bbc", tcolor: "#ffffff" },
                { key: "3", text: "全面恢复阶段", level: 4, color: "#4c7bbc", tcolor: "#ffffff", },
                { key: "end", text: "终止状态", color: "#48dab6", tcolor: "#ffffff", category: "End" },
            ],
            nodeLevelConfig: [{
                text: "应急响应阶段", color: "#4c7bbc", tcolor: "#ffffff"
            }, {
                text: "应急响应阶段", color: "#4c7bbc", tcolor: "#ffffff"
            }, {
                text: "管控维稳阶段", color: "#4c7bbc", tcolor: "#ffffff"
            }, {
                text: "全面恢复阶段", color: "#4c7bbc", tcolor: "#ffffff",
            }, {
                text: "终止状态", color: "#48dab6", tcolor: "#ffffff", category: "End"
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
                            // isOngoing: false
                        }),
                    //isReadOnly: true, // 只读
                    "undoManager.isEnabled": true,
                    initialContentAlignment: go.Spot.Center,
                    initialAutoScale: go.Diagram.Uniform,
                    "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom, //有鼠标滚轮事件放大和缩小
                });

            this.myDiagram.nodeTemplate = this.getComTemplate({ type: 'Com' });
            this.myDiagram.nodeTemplateMap.add('None', this.getComTemplate({ type: "None" })
            )
            this.myDiagram.nodeTemplateMap.add("Bands",
                $(go.Part, "Position",
                    new go.Binding("itemArray"),
                    {
                        isLayoutPositioned: false,  // but still in document bounds
                        locationSpot: new go.Spot(0, 0, HORIZONTAL ? 0 : 110, HORIZONTAL ? 30 : 0),//泳道距离顶部的偏离值
                        layerName: "Background",
                        pickable: true,
                        selectable: false,
                        resizable: false,
                        resizeObjectName: "Background",
                        itemTemplate:
                            $(go.Panel, HORIZONTAL ? "Vertical" : "Horizontal",
                                new go.Binding("position", "bounds", function (b) {
                                    return b.position;
                                }),
                                //设置列样式
                                $(go.TextBlock,
                                    {
                                        angle: 0,// HORIZONTAL ? 0 : 270,
                                        textAlign: "center",
                                        wrap: go.TextBlock.None,// TextBlock.WrapDesiredSize, TextBlock.WrapFit, TextBlock.WrapBreakAll, and TextBlock.None.
                                        font: " 14px sans-serif",
                                        verticalAlignment: go.Spot.Center,//文字垂直居中
                                        stroke: "#ffffff",//字体颜色
                                        background: "#246dc8" //$(go.Brush, "Linear", { 0: "aqua", 1: go.Brush.darken("aqua") })
                                    },
                                    new go.Binding("text"),
                                    // always bind "width" because the angle does the rotation
                                    new go.Binding("width", "bounds", (r, a) => {
                                        //如果当前下一个标题为空 进行列合并 
                                        let percent = this.getMegerLength(a.text)
                                        //  console.log(index, percent, r.width * percent, a.text)
                                        return HORIZONTAL ? r.width * percent : r.height * percent;
                                    }),
                                    //标题 宽/高
                                    new go.Binding("height", "bounds", function (r) {
                                        return HORIZONTAL ? 30 : r.height;
                                        //  return 30
                                    })//表头高度
                                ),
                                // option 1: rectangular bands:
                                $(go.Shape,
                                    {
                                        stroke: '#eaeaea', //泳道边框
                                        strokeWidth: 1,
                                    },
                                    new go.Binding("text"),
                                    // new go.Binding("stroke", "color"),//自定义泳道分隔线颜色
                                    new go.Binding("desiredSize", "bounds", (r, a) => {
                                        let merge = this.getMegerLength(a.text)
                                        if (merge === 2) {
                                            return new go.Size(r.size.width * 2, r.size.height)
                                        } else if (merge === 0) {
                                            return new go.Size(0, 0)
                                        }

                                        return r.size;
                                    }),
                                    //修改泳道颜色
                                    // new go.Binding("fill", "itemIndex", function (i) { return i % 2 == 0 ? "#f5f6f7" : go.Brush.darken("#ececec"); }).ofObject())
                                    new go.Binding("fill", "color")
                                ),

                            )
                    }
                ));
            /////////////////////
            this.myDiagram.nodeTemplateMap.add("Start",
                $(go.Node, "Spot", {
                    // desiredSize: new go.Size(95, 95),
                    selectionAdorned: false,
                    textEditable: true,
                },
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    $(go.Panel, 'Auto', {
                        padding: 7,
                        minSize: new go.Size(75, 75),
                    },
                        $(go.Shape, "Circle",
                            {
                                fill: "#09cb22",
                                stroke: null,
                                cursor: "pointer",
                            },
                            new go.Binding("fill", 'color'),
                        ),
                        // $(go.Shape, "Circle", { fill: null, desiredSize: new go.Size(65, 65), strokeWidth: 2, stroke: "whitesmoke" }),
                        $(go.TextBlock, "Start",
                            {
                                font: " 14px helvetica, bold arial, sans-serif",
                                stroke: "whitesmoke"
                            },
                            new Binding('text', 'text'))
                    ),
                    this.getAddTemplate()
                ));

            this.myDiagram.nodeTemplateMap.add("End", this.getNodeTemPlate('end'));
            ////////////////////////////
            this.myDiagram.linkTemplate =
                $(go.Link,//MultiArrowLink
                    {
                        toShortLength: 3,
                        relinkableFrom: true,
                        relinkableTo: true,
                        reshapable: true,
                        resegmentable: true

                    },
                    go.Link.Bezier,//连线样式 go.Link.Bezier  Orthogonal
                    //连接线颜色设置
                    $(go.Shape, { strokeWidth: 1, stroke: "#9e9e9e" }),
                    // $(go.Shape, { strokeWidth: 1 },
                    //     new go.Binding("stroke", "color")),
                    // 箭头样式设置
                    $(go.Shape, { toArrow: "Standard", scale: 0.8, strokeWidth: 0, },
                    ),//  new go.Binding("fill", "color")
                    {
                        contextMenu: this.addContextMenu()
                    }
                );
            // define the tree node data

            this.myDiagram.nodeTemplate.contextMenu = this.addContextMenu()
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
        //获取模板
        getComTemplate({ type }) {
            return $(go.Node, go.Panel.Auto,
                {
                    //节点点击事件
                    click: (a, b,) => {
                        // console.log(b.data)
                    },
                    selectionAdorned: false,//选中不显示外边框
                    textEditable: true,
                    fromLinkable: true,
                    toLinkable: true,
                    fromSpot: go.Spot.Right,  // links only go from the right side to the left side
                    toSpot: go.Spot.Left,
                },
                //自定义节点背景颜色
                $(go.Panel, "Auto", {
                    padding: type === 'None' ? 0 : 15,
                    margin: new go.Margin(0, 0, 0, -15),
                    fromLinkable: false,//内层节点 不可设置连接线
                    toLinkable: false
                },
                    $(go.Shape,
                        {
                            isPanelMain: true,
                            margin: 0,
                            stroke: 'transparent',//边框颜色
                            strokeWidth: 1,
                            minSize: new go.Size(120, 50),
                        },
                        new go.Binding("fill", "color")
                    ),//背景色

                    $(go.TextBlock, {
                        margin: 5,
                        height: 50,
                        width: 120,
                        textAlign: "center",
                        wrap: go.TextBlock.WrapBreakAll,// TextBlock.WrapDesiredSize, TextBlock.
                        verticalAlignment: go.Spot.Center,//文字垂直居中
                        overflow: go.TextBlock.OverflowEllipsis,
                        editable: true,
                    },//样式大小
                        new go.Binding("text", "text"),//显示文字  text 为key
                        new go.Binding("stroke", "tcolor")//自定义字体颜色
                    ),
                ),


                ///////////////
                ////////////////////
                /// 添加子级
                this.getAddTemplate(type)
                ///
            )
        },
        //获取添加子级panel
        getAddTemplate(type) {
            if (type === 'None') return '';
            return $(go.Panel, "Auto",
                {
                    alignment: go.Spot.Right,
                    portId: "from",
                    fromLinkable: true,
                    cursor: "pointer", click: (a, b) => {
                        //点击添加一个字节点
                        this.addNodeAndLink(a, b)
                    }
                },
                $(go.Shape, "Circle",
                    { width: 15, height: 15, fill: "#9b9b9b", stroke: "#9b9b9b", strokeWidth: 1 }),
                $(go.Shape, "PlusLine",
                    { width: 8, height: 8, fill: null, stroke: "#ffffff", strokeWidth: 1 })
            )
        },
        addNodeAndLink(e, obj) {


            let fromNode = obj.part;
            let fromData = fromNode.data;
            let level = fromData.level + 1;
            if (level === 5) return;
            let diagram = fromNode.diagram;
            //  diagram.startTransaction("Add State");
            // get the node data for which the user clicked the button

            // create a new "State" data object, positioned off to the right of the fromNode
            let p = fromNode.location.copy();
            p.x += diagram.toolManager.draggingTool.gridSnapCellSize.width;
            let toData = null
            let model = diagram.model;
            //添加倒数第二个节点  进行节点连线至最后节点

            toData = {
                key: (Math.random() * (36 - 1) + 1).toString(32).substr(2, 6),
                loc: go.Point.stringify(p),
                ...this.nodeLevelConfig[level - 1],
                level: level
            };
            // add the new node data to the model
            model.addNodeData(toData);

            // create a link data from the old node data to the new node data
            // var linkdata = {
            //     from: model.getKeyForNodeData(fromData),
            //     to: model.getKeyForNodeData(toData)
            // };
            // // 添加连线
            // model.addLinkData(linkdata);
            this.setLinks(model, fromData, toData)
            if (level === 4) {
                let end = this.myDiagram.model.findNodeDataForKey('end')
                this.setLinks(model, toData, end)
            }

            // 选中新增的node
            let newnode = diagram.findNodeForData(toData);
            // diagram.select(newnode);
            //  将新节点吸附到有效位置
            newnode.location = diagram.toolManager.draggingTool.computeMove(newnode, p);
            // 考虑重叠部分
            this.shiftNodesToEmptySpaces();
            //新增动画
            //    diagram.commitTransaction("Add State");
            // })


        },
        //通过设置layout isOngoing 设置是否可以自动布局
        setLayoutAttrs(bol) {
            this.myDiagram.setProperties({
                // isReadOnly: !bol,
                layout: $(BandedTreeLayout,  // BandedTreeLayout  DoubleTreeLayout
                    {
                        isOngoing: bol
                    }),
            })
        },
        setLinks(model, fromData, toData) {
            let linkdata = {
                from: model.getKeyForNodeData(fromData),
                to: model.getKeyForNodeData(toData)
            };
            // 添加连线
            model.addLinkData(linkdata);
        },
        //添加右键事件
        addContextMenu() {
            return $("ContextMenu",
                // $("ContextMenuButton",
                //     $(go.TextBlock, "修改名称", {
                //         margin: 5,
                //         width: 60,
                //         textAlign: "center",
                //     }),
                //     { click: function (e, obj) { e.diagram.commandHandler.editTextBlock(); } },
                //     new go.Binding("visible", "", function (o) { return o.diagram && o.diagram.commandHandler.canEditTextBlock(); }).ofObject()),
                // add one for Editing...
                $("ContextMenuButton",
                    $(go.TextBlock, " 删 除 ", {
                        margin: 5,
                        width: 60,
                        textAlign: "center",
                    }),
                    {
                        click: (e, obj) => {
                            e.diagram.commandHandler.deleteSelection();

                        }
                    },
                    // new go.Binding("visible", "", function (o) { return o.diagram && o.diagram.commandHandler.canDeleteSelection(); }).ofObject()
                )
            );
        },
        getContextMenu() {

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
        getNodeTemPlate() {
            return $(go.Node, "Spot", {
                desiredSize: new go.Size(85, 85),
                selectionAdorned: false,
                fromLinkable: false,
                toLinkable: true
            },
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Shape, "Circle",
                    {
                        fill: "#09cb22",
                        stroke: null,
                        cursor: "pointer",
                    },
                    new go.Binding("fill", 'color'),
                ),
                $(go.Shape, "Circle", {
                    fill: null,
                    desiredSize: new go.Size(75, 75),
                    strokeWidth: 10,
                    stroke: "#ffffff",
                    fromLinkable: false,
                    toLinkable: false
                }
                ),
                $(go.TextBlock, "End",
                    {
                        font: " 14px helvetica, bold arial, sans-serif",
                        stroke: "whitesmoke"
                    },
                    new Binding('text', 'text'))
            )
        },
        //获取合并行数量
        getMegerLength(text) {
            if (text === '') {
                return 0
            }
            let data = this.nodearray[0].itemArray;
            let index = data.findIndex(v => v.text === text);
            let a = data.slice(index + 1)
            let spaceLength = a.findIndex(v => v.text !== '')
            return spaceLength === -1 ? a.length + 1 : spaceLength !== 0 ? spaceLength + 1 : 1
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

    },
    created() {

    },
    mounted() {
        this.init();

    },

}
</script>
<style  scoped>
.op {
    position: absolute;
    top: 50px;
    left: 0;
    width: 100%;
    height: 40px;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.5);
}
</style>