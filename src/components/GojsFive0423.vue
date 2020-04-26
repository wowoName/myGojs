<template>
    <div>
        <div id="myDiagramDiv" class="gojs-main"></div>
        <!-- <div class="op">
            <input type="button" @click="getData()" value="测试">
            <input type="button" @click="addNode()" value="添加">
        </div> -->
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
            myDiagram: null,
            linkDataArray: [
                { from: "0", to: "1", color: "#2196f3" },
                { from: "1", to: "2.1", color: "#2196f3" },
                { from: "1", to: "2.2", color: "#2196f3" },
                { from: "1", to: "2.3", color: "#2196f3" },
                { from: "1", to: "2.4", color: "#2196f3" },

                { from: "2.1", to: "3.1", color: "#2196f3" },
                { from: "2.2", to: "3.2", color: "#2196f3" },
                { from: "2.3", to: "3.3", color: "#2196f3" },
                { from: "2.4", to: "3.4", color: "#2196f3" },
                { from: "2.1", to: "3.5", color: "#2196f3" },
                { from: "2.2", to: "3.6", color: "#2196f3" },

                { from: "3.1", to: "4.1", color: "#2196f3" },
                { from: "3.2", to: "4.2", color: "#2196f3" },
                { from: "3.3", to: "4.3", color: "#2196f3" },
                { from: "3.4", to: "4.2", color: "#2196f3" },


                { from: "4.1", to: "5", color: "#2196f3" },
                { from: "4.2", to: "5", color: "#2196f3" },
                { from: "4.3", to: "5", color: "#2196f3" },
            ],
            nodearray: [
                {
                    key: "_BANDS",
                    category: "Bands",
                    itemArray: [
                        { text: "治理意图", color: '#ececec', bgColor: "#ececec" },//color 泳道分隔线颜色
                        { text: "治理目的", color: '#ffffff', bgColor: "#ffffff" },
                        { text: "", color: '#ffffff', bgColor: "#ececec" },
                        { text: "治理方针", color: '#ececec', bgColor: "#ececec" },
                        { text: "终止状态", color: '#ffffff', bgColor: "#ffffff" },
                        { text: "终止状态标准", color: '#ececec', bgColor: "#ececec" },
                        { text: "其他的", color: '#ececec', bgColor: "#ececec" }
                    ],
                },
                // these are the regular nodes in the TreeModel
                /** 
                 * category 标记开始 结束 节点
                */
                { key: "0", text: "初始状态", color: "#ab2f2f", tcolor: "#ffffff", fig: 'RoundedRectangle' },
                { key: "1", text: "1.1", color: "#2c82d4", tcolor: "#ffffff", fig: 'RoundedRectangle' },

                { key: "2.1", text: "2.1", color: "#2c82d4", tcolor: "#ffffff", fig: 'RoundedRectangle' },
                { key: "2.2", text: "2.2", color: "#2c82d4", tcolor: "#ffffff", fig: 'RoundedRectangle' },
                { key: "2.3", text: "2.3", color: "#2c82d4", tcolor: "#ffffff", fig: 'RoundedRectangle' },
                { key: "2.4", text: "2.4", color: "#2c82d4", tcolor: "#ffffff", fig: 'RoundedRectangle' },

                { key: "3.1", text: "3.1", color: "#fa9653", tcolor: "#ffffff", fig: 'RoundedRectangle' },
                { key: "3.2", text: "3.2", color: "#fa9653", tcolor: "#ffffff", fig: 'RoundedRectangle' },
                { key: "3.3", text: "3.3", color: "#fa9653", tcolor: "#ffffff", fig: 'RoundedRectangle' },
                { key: "3.4", text: "3.4", color: "#fa9653", tcolor: "#ffffff", fig: 'RoundedRectangle' },
                { key: "3.5", text: "3.5", color: "#fa9653", tcolor: "#ffffff", fig: 'RoundedRectangle' },

                { key: "4.1", text: "4.1", color: "#ffffff", tcolor: "#000000" },
                { key: "4.2", text: "4.2", color: "#ffffff", tcolor: "#000000", },
                { key: "4.3", text: "4.3", color: "#ffffff", tcolor: "#000000" },

                { key: "5", text: "5", color: "#ccecff", tcolor: "#000000", "category": "End" },
            ],
            nodeColor: ['#2c82d4', '#fa9653', '#ffffff', '#ccecff']
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
                            arrangement: HORIZONTAL ? go.TreeLayout.ArrangementVertical : go.TreeLayout.ArrangementHorizontal

                        }),
                    isReadOnly: true, // 只读
                    "undoManager.isEnabled": true,
                    initialContentAlignment: go.Spot.Center,
                    initialAutoScale: go.Diagram.Uniform,
                    "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom, //有鼠标滚轮事件放大和缩小
                });

            this.myDiagram.nodeTemplate =
                $(go.Node, go.Panel.Auto,
                    {
                        click: (a, b, ) => {
                            console.log(b.data)
                        },
                        selectionChanged: () => {
                            console.log('选择')
                        },
                        pickable: true,
                        selectable: true,
                        resizable: false,
                    },
                    //自定义节点背景颜色
                    // $(go.Shape,
                    //     {
                    //         isPanelMain: true,
                    //         margin: 0,
                    //         stroke: '#999999',//边框颜色
                    //         strokeWidth: 1,
                    //     },
                    //     // new go.Binding("fill", "color"),
                    //     new go.Binding("figure", "fig"),//自定义外观
                    //     new go.Binding('text', 'text'),
                    //     new go.Binding("fill", "isSelected", (s, a) => {//设置选中颜色
                    //         return s ? "#05f33a" : this.nodearray.find(v => v.text === a.text).color
                    //     }).ofObject(),

                    // ),//背景色

                    // $(go.TextBlock, {
                    //     margin: new go.Margin(0, 0, 14, 0),
                    //     height: 60,
                    //     width: 120,
                    //     textAlign: "center",
                    //     wrap: go.TextBlock.WrapBreakAll,// TextBlock.WrapDesiredSize, TextBlock.
                    //     verticalAlignment: go.Spot.Center,//文字垂直居中
                    // },//样式大小
                    //     new go.Binding("text", "text"),//显示文字  text 为key
                    //     new go.Binding("stroke", "tcolor")//自定义字体颜色
                    // ),

                    $(go.Panel, "Auto",
                        {
                            padding: 22,
                            margin: new go.Margin(-22, 0, 0, 0),
                            click: function (a, b) {
                                console.log(a, b)
                            },
                        },
                        $(go.Shape, "Rectangle",
                            { minSize: new go.Size(200, 80) },
                            new go.Binding("fill", "color"),
                            new go.Binding("figure", "fig"),//自定义外观
                            new go.Binding('text', 'text'),
                            new go.Binding("fill", "isSelected", (s, a) => {
                                return s ? "#05f33a" : this.nodearray.find(v => v.text === a.text).color
                            }).ofObject()),
                        $(go.TextBlock,
                            {
                                // stroke: "black",
                                font: "18px sans-serif",
                                height: 60,
                                width: 200,
                                textAlign: "center",
                                wrap: go.TextBlock.WrapBreakAll,// TextBlock.WrapDesiredSize, TextBlock.
                                verticalAlignment: go.Spot.Center,//文字垂直居中
                                overflow: go.TextBlock.OverflowEllipsis
                                // margin: new go.Margin(3, 3 + 11, 3, 3 + 4),
                                // alignment: go.Spot.Left
                            },
                            new go.Binding("stroke", "tcolor"),//自定义字体颜色
                            new go.Binding("text", 'text').makeTwoWay())
                    ),
                    /////////////设置节点 添加子级样式//////////

                    $(go.Panel, "Auto",
                        {
                            alignment: go.Spot.Bottom, portId: "from", fromLinkable: true, cursor: "pointer", click: (a, b) => {
                                //点击添加一个字节点
                                this.addNodeAndLink(a, b)
                            }
                        },
                        $(go.Shape, "Circle",
                            { width: 22, height: 22, fill: "white", stroke: "#9b9b9b", strokeWidth: 1 }),
                        $(go.Shape, "PlusLine",
                            { width: 11, height: 11, fill: null, stroke: "#9b9b9b", strokeWidth: 1 })
                    ),

                    //////////////////////////
                );

            /////////////////////
            //添加泳道
            this.addNodeBounds()
            this.myDiagram.nodeTemplateMap.add("End",
                $(go.Node, "Spot", { desiredSize: new go.Size(200, 80) },
                    // new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    $(go.Shape,
                        {
                            isPanelMain: true,
                            margin: 0,
                            stroke: '#999999',//边框颜色
                            strokeWidth: 1,
                        },
                        // new go.Binding("fill", "color"),
                        new go.Binding("figure", "fig"),//自定义外观
                        new go.Binding('text', 'text'),
                        new go.Binding("fill", "isSelected", (s, a) => {//设置选中颜色
                            return s ? "#05f33a" : this.nodearray.find(v => v.text === a.text).color
                        }).ofObject(),

                    ),//背景色

                    $(go.TextBlock, 'End', {
                        margin: 0,
                        height: 60,
                        width: 200,
                        font: "18px sans-serif",
                        textAlign: "center",
                        wrap: go.TextBlock.WrapBreakAll,// TextBlock.WrapDesiredSize, TextBlock.
                        verticalAlignment: go.Spot.Center,//文字垂直居中
                    },//样式大小
                        new go.Binding("text", "text"),//显示文字  text 为key
                        new go.Binding("stroke", "tcolor")//自定义字体颜色
                    ),
                )
            );
            ////////////////////////////
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
                    $(go.Shape, { strokeWidth: 1, stroke: '#999999' }),

                    // $(go.Shape, { strokeWidth: 1 },
                    //     new go.Binding("stroke", "color")),
                    // 箭头样式设置
                    // $(go.Shape, { toArrow: "Standard", scale: 0.8, strokeWidth: 0, },
                    // ),//  new go.Binding("fill", "color")
                );

            // define the tree node data


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
        //添加泳道
        addNodeBounds() {
            this.myDiagram.nodeTemplateMap.add("Bands",
                $(go.Part, "Position",
                    new go.Binding("itemArray"),
                    {
                        isLayoutPositioned: false,  // but still in document bounds
                        locationSpot: new go.Spot(0, 0, HORIZONTAL ? 0 : 120, HORIZONTAL ? 30 : 0),//泳道距离顶部的偏离值
                        layerName: "Background",
                        pickable: false,
                        selectable: false,
                        resizable: true,
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
                                        stroke: "#000000",//字体颜色
                                        //背景色渐变  也可以是用固定值
                                        // background: $(go.Brush, "Linear", { 0: "#03a9f4", 1: go.Brush.darken("#1df403") })
                                    },
                                    new go.Binding("text", 'text'),
                                    new go.Binding("background", 'bgColor'),
                                    // always bind "width" because the angle does the rotation
                                    new go.Binding("width", "bounds", (r, a) => {
                                        //如果当前下一个标题为空 进行列合并 
                                        let percent = this.getMegerLength(a.text)
                                        //宽度固定
                                        return HORIZONTAL ? r.width * percent : 120// r.height
                                    }),
                                    //标题 宽/高
                                    new go.Binding("height", "bounds", (r, a) => {
                                        let merge = this.getMegerLength(a.text)
                                        return HORIZONTAL ? 30 : r.height * merge;
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
                                            return HORIZONTAL ? new go.Size(r.size.width * 2, r.size.height) : new go.Size(r.size.width, r.size.height * 2)

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
        },
        //标题行合并数量
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
        addNodeAndLink(e, obj) {
            //先添加泳道
            this.addSwimNodeData()
            this.$nextTick(() => {
                let fromNode = obj.part;
                let diagram = fromNode.diagram;
                diagram.startTransaction("Add State");
                // get the node data for which the user clicked the button
                let fromData = fromNode.data;
                // create a new "State" data object, positioned off to the right of the fromNode
                let p = fromNode.location.copy();
                p.x += diagram.toolManager.draggingTool.gridSnapCellSize.width;

                let toData = {
                    text: "new",
                    color: this.nodeColor[0],
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
                diagram.select(newnode);
                //  将新节点吸附到有效位置
                newnode.location = diagram.toolManager.draggingTool.computeMove(newnode, p);
                // 考虑重叠部分
                this.shiftNodesToEmptySpaces();
                //新增动画
                diagram.commitTransaction("Add State");
            })
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
        //添加泳道
        addSwimNodeData() {
            this.nodearray[0].itemArray.splice(2, 0, { text: "", color: '#ececec', bgColor: "#ececec" })
            //添加泳道
            this.addNodeBounds()
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