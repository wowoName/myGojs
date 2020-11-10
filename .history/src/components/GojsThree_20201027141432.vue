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
                {
                    key: "_BANDS",
                    category: "Bands",
                    itemArray: [
                        { text: "初始状态" },
                        { text: "第一阶段" },
                        { text: "" },
                        { text: "第二阶段" },
                        { text: "第三节点" },
                        { text: "" },
                        { text: "终止状态" }
                    ]
                },
                // these are the regular nodes in the TreeModel
                {
                    key: "1", text: "初始状态", color: "#f44336", tcolor: "#ececec",
                    fields: [
                        { name: "field1", info: "", color: "#F7B84B", figure: "Ellipse" }
                    ],
                },
                {
                    key: "2", parent: "1", text: "任务一", color: "#9c27b0", tcolor: "#cee111",
                    fields: [
                        { name: "field1", info: "", color: "#F7B84B", figure: "Ellipse" },
                    ],
                },

                {
                    key: "2.2", parent: "1", text: "任务一.一", color: "#9c27b0", tcolor: "#cee111",
                    fields: [
                        { name: "任务描述：", info: "任务描述：撒士大夫士大夫士大夫士大夫撒旦发射点阀手动阀撒旦发射点发生的发士大夫士大夫士大夫士大夫撒旦发射点阀手动阀士大夫士大夫 ", color: "#F7B84B", figure: "Ellipse" },
                    ],
                },

                {
                    key: "2.3", parent: "2", text: "任务一.二", color: "#9c27b0", tcolor: "#cee111",
                    fields: [
                        { name: "field1", info: "", color: "#F7B84B", figure: "Ellipse" },
                    ],
                },



                {
                    key: "3", parent: "2.3", text: "任务二", color: "#2196f3", tcolor: "#ffffff",
                    fields: [
                        { name: "field1", info: "", color: "#F7B84B", figure: "Ellipse" },
                    ],
                },
                {
                    key: "3.1", parent: "3", text: "任务二", color: "#2196f3", tcolor: "#ffffff",
                    fields: [
                        { name: "field1", info: "", color: "#F7B84B", figure: "Ellipse" },
                    ],
                },

                {
                    key: "4", parent: "3", text: "任务三", color: "#009688", tcolor: "#ffffff",
                    fields: [
                        { name: "field1", info: "", color: "#F7B84B", figure: "Ellipse" },
                    ],
                },
                {
                    key: "4.1", parent: "4", text: "任务三", color: "#009688", tcolor: "#ffffff",
                    fields: [
                        { name: "field1", info: "", color: "#F7B84B", figure: "Ellipse" },
                    ],
                },

                {
                    key: "5", parent: "4.1", text: "终止状态", color: "#ffc107", tcolor: "#ffffff",
                    fields: [
                        { name: "field1", info: "", color: "#F7B84B", figure: "Ellipse" },
                    ],
                }
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
                    isReadOnly: true, // 只读
                    "undoManager.isEnabled": false,
                    initialContentAlignment: go.Spot.Center,
                    "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom, //有鼠标滚轮事件放大和缩小
                });


            this.myDiagram.nodeTemplate =
                $(go.Node, go.Panel.Auto,
                    {
                        click: (a, b,) => {
                            let data = this.nodearray.find(v => v.key === b.key)
                            alert('点击了' + data.text)
                            console.log(a.part)
                        },
                        // isShadowed: true,
                        // shadowOffset: new go.Point(1, 2),
                        // shadowColor: "#f5f5f5"
                    },



                    ///////////////////////
                    $(go.Shape,
                        { fill: "red" }),
                    $(go.Panel, "Vertical",
                        // this is the header for the whole node
                        $(go.Panel, "Auto",
                            { stretch: go.GraphObject.Horizontal },  // as wide as the whole node
                            $(go.Shape,//每个模块表头背景色
                                { fill: "#716d6d", stroke: null },
                                // new go.Binding("fill", "color")
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
                                padding: 2,
                                minSize: new go.Size(150, 60),
                                defaultStretch: go.GraphObject.Horizontal,
                                itemTemplate: $(go.Panel, "TableRow",  // this Panel is a row in the containing Table
                                    new go.Binding("portId", "name"),  // this Panel is a "port"
                                    {
                                        background: "transparent",  // so this port's background can be picked by the mouse
                                        fromSpot: go.Spot.Right,  // links only go from the right side to the left side
                                        toSpot: go.Spot.Left,
                                        // allow drawing links from or to this port:
                                        fromLinkable: true, toLinkable: true
                                    },

                                    $(go.TextBlock,
                                        {
                                            margin: new go.Margin(0, 5),
                                            column: 2,
                                            font: "13px sans-serif",
                                            alignment: go.Spot.Left,
                                            width: 150,
                                            height: 50,
                                            textAlign: "center",
                                            wrap: go.TextBlock.WrapBreakAll,// TextBlock.WrapDesiredSize, TextBlock.
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
                        locationSpot: new go.Spot(0, 0, HORIZONTAL ? 0 : 30, HORIZONTAL ? 30 : 0),  // account for header height
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
                                    new go.Binding("width", "bounds", (r, a) => {

                                        let percent = this.getMegerLength(a.text)
                                        //  console.log(index, percent, r.width * percent, a.text)
                                        return HORIZONTAL ? r.width * percent : r.height * percent;
                                    }),
                                    new go.Binding("height", "bounds", function (r) { return 30 })
                                ),
                                // option 1: rectangular bands:
                                $(go.Shape,
                                    {
                                        stroke: '#ececec', //泳道边框
                                        strokeWidth: 1,
                                    },
                                    new go.Binding("text"),
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
                    ),// new go.Binding("stroke", "color")
                    //箭头样式设置
                    $(go.Shape, { toArrow: "Standard", scale: 0.8, strokeWidth: 0 },
                    ),//new go.Binding("fill", "color")
                );

            // define the tree node data


            this.myDiagram.model = new go.TreeModel(this.nodearray);
            //自适应大小
            //this.myDiagram.commandHandler.zoomToFit();
            //设置某一个节点位于屏幕中心
            //   this.myDiagram.commandHandler.scrollToPart(this.myDiagram.findNodeForKey());

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