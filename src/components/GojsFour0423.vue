<template>
    <div id="myDiagramDiv" class="gojs-main"></div>
</template>

<script>
import go from 'gojs'
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
                model.setDataProperty(itemdata, "bounds", layerRects[i]);
            }
        }
    }



};
// end BandedTreeLayout

export default {
    components: {},
    data() {
        return {
            myDiagram: null,
            nodearray: [
                // {
                //     key: "_BANDS",
                //     category: "Bands",
                //     itemArray: [
                //         { text: "初始状态" },
                //         { text: "联合维权" },
                //         { text: "海空打击" },
                //         { text: "稳控收局" },
                //         { text: "终止状态" },
                //         { text: "战役目的XXX" }
                //     ]
                // },
                // these are the regular nodes in the TreeModel
                {
                    key: "1", text: "初始状态", color: "#f44336", tcolor: "#ececec",
                    fields: [
                        { name: "阶段\n目标", info: "1、手动蝶阀收水电费水电费单水电费水电费是2、水电费水电费第三方士大夫收到1、手动蝶阀收水电费水电费单水电费水电费是2、水电费水电费第三方士大夫收到", color: "#F7B84B", figure: "Ellipse" },
                        { name: "达成\n条件", info: "第二列", color: "#F25022", figure: "Ellipse" },
                    ],
                },

                {
                    key: "2", parent: "1", text: "XXX1", color: "#9c27b0", tcolor: "#cee111",
                    fields: [
                        { name: "阶段\n目标", info: "", color: "#F7B84B", figure: "Ellipse" },
                        { name: "达成\n条件", info: "一段文字描述", color: "#F25022", figure: "Ellipse" },
                    ],
                },
                {
                    key: "2.1", parent: "1", text: "XXX1", color: "#9c27b0", tcolor: "#cee111",
                    fields: [
                        { name: "阶段\n目标", info: "", color: "#F7B84B", figure: "Ellipse" },
                        { name: "达成\n条件", info: "一段文字描述", color: "#F25022", figure: "Ellipse" },
                    ],
                },


                {
                    key: "2.1", parent: "2", text: "XXX2", color: "#2196f3", tcolor: "#ffffff",
                    fields: [
                        { name: "阶段\n目标", info: "", color: "#F7B84B", figure: "Ellipse" },
                        { name: "达成\n条件", info: "一段文字描述", color: "#F25022", figure: "Ellipse" },
                    ],
                },

                {
                    key: "3", parent: "2.1", text: "XXX4", color: "#009688", tcolor: "#ffffff",
                    fields: [
                        { name: "阶段\n目标", info: "", color: "#F7B84B", figure: "Ellipse" },
                        { name: "达成\n条件", info: "一段文字描述", color: "#F25022", figure: "Ellipse" },
                    ],
                },
                {
                    key: "3.1", parent: "2.1", text: "XXX4", color: "#009688", tcolor: "#ffffff",
                    fields: [
                        { name: "阶段\n目标", info: "", color: "#F7B84B", figure: "Ellipse" },
                        { name: "达成\n条件", info: "一段文字描述", color: "#F25022", figure: "Ellipse" },
                    ],
                },

                {
                    key: "4", parent: "3", text: "XXX6", color: "#ffc107", tcolor: "#ffffff",
                    fields: [
                        { name: "阶段\n目标", info: "", color: "#F7B84B", figure: "Ellipse" },
                        { name: "达成\n条件", info: "一段文字描述", color: "#F25022", figure: "Ellipse" },
                    ],
                },

                {
                    key: "5", parent: "4", text: "xxx", color: "#344094", tcolor: "#ffffff",
                    fields: [
                        { name: "阶段目标", info: "", color: "#F7B84B", figure: "Ellipse" },
                        { name: "达成条件", info: "一段文字描述\n三大大幅度安抚\n安抚安抚安抚\n嗷嗷的是父", color: "#F25022", figure: "Ellipse" },
                    ],
                },
            ]
        };
    },
    computed: {},
    watch: {},
    methods: {
        init() {
            var $ = go.GraphObject.make;
            this.myDiagram = $(go.Diagram, "myDiagramDiv",
                {
                    layout: $(BandedTreeLayout,  // custom layout is defined above
                        {
                            angle: HORIZONTAL ? 0 : 90,
                            arrangement: HORIZONTAL ? go.TreeLayout.ArrangementVertical : go.TreeLayout.ArrangementHorizontal
                        }),
                    click: (a, b) => {
                        console.log("~~~~~~~~~")
                    },
                    isReadOnly: true, // 只读
                    "undoManager.isEnabled": false,
                    initialContentAlignment: go.Spot.Center,
                    "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom, //有鼠标滚轮事件放大和缩小
                });


            this.myDiagram.nodeTemplate =
                $(go.Node, go.Panel.Auto,
                    {
                        click: (a, b, ) => {
                            console.log(b.data)
                        }
                        // isShadowed: true,
                        // shadowOffset: new go.Point(1, 2),
                        // shadowColor: "#f5f5f5"
                    },
                    ///////////////////////
                    $(go.Shape,
                        {
                            fill: "#ffffff",
                            stroke: '#2196F3'//边框杨色
                        }),
                    $(go.Panel, "Vertical",
                        // this is the header for the whole node
                        $(go.Panel, "Auto",
                            { stretch: go.GraphObject.Horizontal },  // as wide as the whole node
                            $(go.Shape,
                                { fill: "#716d6d", stroke: null },
                                new go.Binding("fill", "color")//自定义表头颜色
                            ),
                            $(go.TextBlock,
                                {
                                    alignment: go.Spot.Center,
                                    margin: 3,
                                    stroke: "white",
                                    textAlign: "center",
                                    font: "bold 12pt sans-serif"
                                },
                                new go.Binding("text", "text"))),


                        $(go.Panel, "Table",
                            {
                                padding: 0,
                                minSize: new go.Size(100, 50),
                                // maxSize: new go.Size(200, 100),
                                defaultStretch: go.GraphObject.Horizontal,
                                defaultRowSeparatorStroke: "#8d8c8c",//列之间分割线
                                defaultColumnSeparatorStroke: "#8d8c8c",//列之间分割线
                                itemTemplate: $(go.Panel, "TableRow",  // this Panel is a row in the containing Table
                                    new go.Binding("portId", "name"),  // this Panel is a "port"
                                    {
                                        background: "transparent",  // so this port's background can be picked by the mouse
                                        fromSpot: go.Spot.Right,  // links only go from the right side to the left side
                                        toSpot: go.Spot.Left,
                                        // allow drawing links from or to this port:
                                        fromLinkable: true,
                                        toLinkable: true,
                                    },
                                    // $(go.Shape,
                                    //     {
                                    //         width: 12, height: 12, row: 3, strokeWidth: 2, margin: 0,
                                    //         fromLinkable: false,
                                    //         toLinkable: false,
                                    //         alignment: go.Spot.Center,
                                    //     },
                                    //     new go.Binding("figure", "figure"),
                                    //     new go.Binding("fill", "color")),
                                    $(go.TextBlock,
                                        {
                                            margin: new go.Margin(0, 0), column: 1, font: "bold 13px sans-serif",
                                            alignment: go.Spot.Center,
                                            width: 50,
                                            wrap: go.TextBlock.WrapBreakAll,// TextBlock.WrapDesiredSize, TextBlock.WrapFit, TextBlock.WrapBreakAll, and TextBlock.None.
                                            textAlign: "center",
                                            // background: "#00bcd4",
                                            stroke: "#000000",//字体颜色
                                            // and disallow drawing links from or to this text:
                                            fromLinkable: false,
                                            toLinkable: false,
                                        },
                                        new go.Binding("text", "name")),
                                    $(go.TextBlock,
                                        {
                                            margin: new go.Margin(10, 0),
                                            column: 2,
                                            width: 150,
                                            height: 50,
                                            font: "13px sans-serif",
                                            wrap: go.TextBlock.WrapBreakAll,
                                            alignment: go.Spot.Center,
                                            overflow: go.TextBlock.OverflowEllipsis
                                        },
                                        new go.Binding("text", "info"))
                                )
                            },
                            new go.Binding("itemArray", "fields")
                        )
                    ),
                    //////////////////

                );

            this.myDiagram.nodeTemplateMap.add("Bands",
                $(go.Part, "Position",
                    new go.Binding("itemArray"),
                    {
                        isLayoutPositioned: false,  // but still in document bounds
                        locationSpot: new go.Spot(0, 0, 0, 30),  // account for header height
                        layerName: "Background",
                        pickable: false,
                        selectable: false,
                        itemTemplate:
                            $(go.Panel, HORIZONTAL ? "Vertical" : "Horizontal",
                                new go.Binding("position", "bounds", function (b) { return b.position; }),
                                //设置列样式
                                $(go.TextBlock,
                                    {
                                        angle: HORIZONTAL ? 0 : 270,
                                        textAlign: "center",
                                        wrap: go.TextBlock.None,
                                        font: "bold 14px sans-serif",
                                        verticalAlignment: go.Spot.Center,//文字垂直居中
                                        stroke: "#ffffff",//字体颜色
                                        background: "#0589fe" //$(go.Brush, "Linear", { 0: "aqua", 1: go.Brush.darken("aqua") })
                                    },
                                    new go.Binding("text"),
                                    // always bind "width" because the angle does the rotation
                                    new go.Binding("width", "bounds", function (r) { return HORIZONTAL ? r.width : r.height; }),
                                    new go.Binding("height", "bounds", function (r) { return 30 })
                                ),
                                // option 1: rectangular bands:
                                $(go.Shape,
                                    {
                                        stroke: '#ececec', strokeWidth: 1,
                                    },
                                    new go.Binding("desiredSize", "bounds", function (r) { return r.size; }),
                                    //修改泳道颜色
                                    // new go.Binding("fill", "itemIndex", function (i) { return i % 2 == 0 ? "#f5f6f7" : go.Brush.darken("#ececec"); }).ofObject())
                                    new go.Binding("fill", "itemIndex", function (i) { return i % 2 == 0 ? "#ffffff" : '#ffffff'; }).ofObject())
                            )
                    }
                ));
            /////////////////////

            ////////////////////////////
            this.myDiagram.linkTemplate =
                $(go.Link,

                    go.Link.Orthogonal,//连线样式 go.Link.Bezier  Orthogonal
                    //连接线颜色设置
                    $(go.Shape, { strokeWidth: 1 },
                        new go.Binding("stroke", "color")),
                    //箭头样式设置
                    $(go.Shape, { toArrow: "Standard", scale: 0.8, strokeWidth: 0 },
                        new go.Binding("fill", "color")),
                );

            // define the tree node data


            this.myDiagram.model = new go.TreeModel(this.nodearray);
            //自适应大小
            //this.myDiagram.commandHandler.zoomToFit();
            //设置某一个节点位于屏幕中心
            //   this.myDiagram.commandHandler.scrollToPart(this.myDiagram.findNodeForKey());

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
</style>