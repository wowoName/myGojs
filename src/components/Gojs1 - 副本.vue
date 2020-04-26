<template>
    <div id="myDiagramDiv" class="gojs-main"></div>
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
        let transWidth = 0;
        for (var i = 0; i < layerRects.length; i++) {
            var itemdata = arr[i];
            if (itemdata) {
                //空白列进行位置调整
                if (itemdata.text === '') {
                    transWidth += layerRects[i].width
                    layerRects[i].width = 20
                }
                layerRects[i].left -= transWidth
                layerRects[i].width += transWidth
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
                        { text: "初始状态", color: '#ececec' },//color 泳道分隔线颜色
                        { text: "联合维权", color: '#ececec' },
                        { text: "海空打击", color: '#ececec' },
                        { text: "稳控收局", color: '#ececec' },
                        { text: "终止状态", color: '#ececec' },
                        { text: "战役目的XXX", color: '#ececec' }
                    ],
                },

                // these are the regular nodes in the TreeModel
                /** 
                 * category 标记开始 结束 节点
                */
                { key: "root", text: "初始 \n 状态", color: "#f44336", tcolor: "#ececec", category: "Start", },
                { key: "oneB", parent: "root", text: "XXX1", color: "#9c27b0", tcolor: "#cee111" },
                { key: "twoA", parent: "oneB", text: "XXX2", color: "#2196f3", tcolor: "#ffffff" },
                { key: "twoC", parent: "root", text: "XXX3", color: "#00bcd4", tcolor: "#0c2ce1" },
                { key: "twoD", parent: "root", text: "XXX9", color: "#26ad62", tcolor: "#ffffff" },
                { key: "twoE", parent: "root", text: "空白", color: "#ff5722", tcolor: "#ffffff", category: 'none' },

                { key: "threeC", parent: "twoC", text: "XXX4", color: "#009688", tcolor: "#ffffff" },
                { key: "threeD", parent: "twoC", text: "XXX5", color: "#8bc34a", tcolor: "#ffffff" },
                //定义空白连接点
                { key: "threeA", parent: "twoE", text: "空白", color: "#8bc34a", tcolor: "#ffffff", category: 'none' },

                { key: "fourB", parent: "threeD", text: "第四个的", color: "#ffc107", tcolor: "#ffffff" },
                { key: "fourA", parent: "threeA", text: "空白", color: "#8bc34a", tcolor: "#ffffff", category: 'none' },
                { key: "fourC", parent: "threeD", text: "连接空白", color: "#ff5722", tcolor: "#ffffff" },

                { key: "five", parent: "fourB", text: "xxx", color: "#344094", tcolor: "#ffffff" },
                { key: "fiveA", parent: "fourC", text: "第五个", color: "#344094", tcolor: "#ffffff" },
                { key: "fiveB", parent: "fourA", text: "第五个-开始", color: "#344094", tcolor: "#ffffff" },
                { key: "fiveC", parent: "fourA", text: "空白", color: "#8bc34a", tcolor: "#ffffff", category: 'none' },


                { key: "seven", parent: "fiveA", text: "目的", color: "#344094", tcolor: "#ffffff", category: "End" },
                { key: "sevenA", parent: "fiveC", text: "战役", color: "#344094", tcolor: "#ffffff", category: "End" },
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
                    layout: $(BandedTreeLayout,  // BandedTreeLayout  DoubleTreeLayout
                        {
                            angle: HORIZONTAL ? 0 : 90,
                            arrangement: HORIZONTAL ? go.TreeLayout.ArrangementVertical : go.TreeLayout.ArrangementHorizontal,
                        }),
                    isReadOnly: true, // 只读
                    "undoManager.isEnabled": false,
                    initialContentAlignment: go.Spot.Center,
                    "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom, //有鼠标滚轮事件放大和缩小
                });

            this.myDiagram.nodeTemplate =
                $(go.Node, go.Panel.Auto,
                    {
                        click: (a, b, ) => {
                            let data = this.nodearray.find(v => v.key === b.key)
                            alert('点击了' + data.text)
                            console.log(a.part)
                        },
                        // isShadowed: true,
                        // shadowOffset: new go.Point(1, 2),
                        // shadowColor: "#f5f5f5"
                    },
                    //自定义节点背景颜色
                    $(go.Shape, 'RoundedRectangle',//节点外观
                        {
                            isPanelMain: true,
                            margin: 0,
                            stroke: 'transparent',//边框颜色
                            strokeWidth: 1
                        },
                        new go.Binding("fill", "color")
                    ),//背景色

                    $(go.TextBlock, {
                        margin: 0,
                        height: 60,
                        width: 120,
                        textAlign: 'center',
                        verticalAlignment: go.Spot.Center,//文字垂直居中
                    },//样式大小
                        new go.Binding("text", "text"),//显示文字  text 为key
                        new go.Binding("stroke", "tcolor")//自定义字体颜色
                    )
                );

            this.myDiagram.nodeTemplateMap.add("Bands",
                $(go.Part, "Position",
                    new go.Binding("itemArray"),
                    {
                        isLayoutPositioned: false,  // but still in document bounds
                        locationSpot: new go.Spot(0, 0, HORIZONTAL ? 0 : 16, HORIZONTAL ? 30 : 0),  // account for header height
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
                                    new go.Binding("width", "bounds", function (r) {
                                        return HORIZONTAL ? r.width : r.height;
                                    }),
                                    new go.Binding("height", "bounds", function (r) { return 30 })//表头高度
                                ),
                                // option 1: rectangular bands:
                                $(go.Shape,
                                    {
                                        // stroke: '#ececec',
                                        strokeWidth: 1,
                                    },
                                    new go.Binding("stroke", "color"),//自定义泳道分隔线颜色
                                    new go.Binding("desiredSize", "bounds", function (r) {
                                        return r.size;
                                    }),
                                    //修改泳道颜色
                                    // new go.Binding("fill", "itemIndex", function (i) { return i % 2 == 0 ? "#f5f6f7" : go.Brush.darken("#ececec"); }).ofObject())
                                    new go.Binding("fill", "itemIndex", function (i) { return i % 2 == 0 ? "#ffffff" : '#ffffff'; }).ofObject())
                            )
                    }
                ));
            /////////////////////
            this.myDiagram.nodeTemplateMap.add("Start",
                $(go.Node, "Spot", { desiredSize: new go.Size(75, 75) },
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    $(go.Shape, "Circle",
                        {
                            fill: "#da1919",
                            stroke: null,
                            cursor: "pointer"
                        }),
                    $(go.TextBlock,
                        {
                            font: "bold 14px helvetica, bold arial, sans-serif",
                            stroke: "whitesmoke"
                        },
                        new go.Binding("text"),
                    )
                )
            );

            this.myDiagram.nodeTemplateMap.add("none",
                $(go.Node, "Spot", { desiredSize: new go.Size(0, 0) },
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    $(go.Shape,
                        {
                            fill: "transparent",
                            stroke: null,
                            cursor: "pointer"
                        }),
                )
            );

            this.myDiagram.nodeTemplateMap.add("End",
                $(go.Node, "Spot", { desiredSize: new go.Size(75, 75) },
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    $(go.Shape, "Circle",
                        {
                            fill: "#09cb22",
                            stroke: '#000000',
                            cursor: "pointer"
                        }),
                    // $(go.Shape, "Circle", { fill: null, desiredSize: new go.Size(65, 65), strokeWidth: 2, stroke: "whitesmoke" }),
                    $(go.TextBlock, "End",
                        {
                            font: " 14px helvetica, bold arial, sans-serif",
                            stroke: "whitesmoke"
                        },
                        new Binding('text', 'text'))
                )
            );
            ////////////////////////////
            this.myDiagram.linkTemplate =
                $(go.Link,
                    go.Link.Bezier,//连线样式 go.Link.Bezier  Orthogonal

                    //连接线颜色设置
                    $(go.Shape, { strokeWidth: 1 })
                    // $(go.Shape, { strokeWidth: 1 },
                    //     new go.Binding("stroke", "color")),
                    //箭头样式设置
                    // $(go.Shape, { toArrow: "Standard", scale: 0.8, strokeWidth: 0 },
                    //     new go.Binding("fill", "color")),
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