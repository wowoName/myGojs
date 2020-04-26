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
                { from: "root", to: "oneB", color: "#2196f3" },
                { from: "oneB", to: "twoC", color: "#2196f3" },
                { from: "oneB", to: "twoA", color: "#2196f3" },
                { from: "oneB", to: "twoD", color: "#2196f3" },
                { from: "oneB", to: "twoE", color: "#2196f3" },

                { from: "twoA", to: "threeA", color: "#2196f3" },
                { from: "twoA", to: "threeC", color: "#2196f3" },
                { from: "twoA", to: "threeD", color: "#2196f3" },
                { from: "twoA", to: "threeE", color: "#2196f3" },
                { from: "twoA", to: "threeF", color: "#2196f3" },
                { from: "twoE", to: "threeF", color: "#2196f3" },

                { from: "threeC", to: "fourA", color: "#2196f3" },
                { from: "threeC", to: "fourC", color: "#2196f3" },
                { from: "threeC", to: "fourB", color: "#2196f3" },
                { from: "threeF", to: "five", color: "#2196f3" },


                { from: "fourA", to: "five", color: "#2196f3" },
                { from: "fourB", to: "five", color: "#2196f3" },
                { from: "fourC", to: "five", color: "#2196f3" },

                { from: "five", to: "six", color: "#2196f3" },
                { from: "six", to: "seven", color: "#2196f3" },
            ],
            nodearray: [
                {
                    key: "_BANDS",
                    category: "Bands",
                    itemArray: [
                        { text: "初始状态", color: '#ececec' },//color 泳道分隔线颜色
                        { text: "联合维权", color: '#ffffff' },
                        { text: "海空打击", color: '#ececec' },
                        { text: "", color: '#ececec' },
                        { text: "稳控收局", color: '#ffffff' },
                        { text: "终止状态", color: '#ececec' },
                        { text: "", color: '#ececec' },
                        { text: "战役目的XXX", color: '#ffffff' }
                    ],
                },
                // these are the regular nodes in the TreeModel
                /** 
                 * category 标记开始 结束 节点
                */
                { key: "root", text: "初始 \n 状态", color: "#f44336", tcolor: "#ececec", category: "Start", },
                { key: "oneB", text: "1.1", color: "#9c27b0", tcolor: "#cee111" },

                { key: "twoA", text: "2.1", color: "#2196f3", tcolor: "#ffffff" },
                { key: "twoC", text: "2.2", color: "#00bcd4", tcolor: "#0c2ce1" },
                { key: "twoD", text: "2.3", color: "#26ad62", tcolor: "#ffffff" },
                { key: "twoE", text: "2.4", color: "#ff5722", tcolor: "#ffffff", },

                { key: "threeC", text: "3.1", color: "#009688", tcolor: "#ffffff" },
                { key: "threeD", text: "3.2", color: "#8bc34a", tcolor: "#ffffff" },
                { key: "threeE", text: "3.3", color: "#8bc34a", tcolor: "#ffffff" },
                { key: "threeF", text: "3.4", color: "#8bc34a", tcolor: "#ffffff" },
                //定义空白连接点
                { key: "threeA", text: "3.1-空白", color: "#8bc34a", tcolor: "#ffffff", },

                { key: "fourB", text: "4.1", color: "#ffc107", tcolor: "#ffffff" },
                { key: "fourA", text: "4.2空白", color: "#8bc34a", tcolor: "#ffffff", },
                { key: "fourC", text: "4.3连接是打发地方的空白", color: "#ff5722", tcolor: "#ffffff" },

                { key: "five", text: "目的", color: "#344094", tcolor: "#ffffff", category: "End" },
                { key: "six", text: "目的", color: "#344094", tcolor: "#ffffff", category: "End" },
                { key: "seven", text: "目的", color: "#344094", tcolor: "#ffffff", category: "End" },
            ]
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
                        // isShadowed: true,
                        // shadowOffset: new go.Point(1, 2),
                        // shadowColor: "#f5f5f5",
                        // fromLinkable: true,
                        // fromLinkableSelfNode: false, fromLinkableDuplicates: false,  // optional
                        // toLinkable: true,
                        // toLinkableSelfNode: false, toLinkableDuplicates: false  // optional

                    },
                    //自定义节点背景颜色
                    $(go.Shape,
                        {
                            isPanelMain: true,
                            margin: 0,
                            stroke: 'transparent',//边框颜色
                            strokeWidth: 1,

                        },
                        new go.Binding("fill", "color")
                    ),//背景色

                    $(go.TextBlock, {
                        margin: 0,
                        height: 60,
                        width: 120,
                        textAlign: "center",
                        wrap: go.TextBlock.WrapBreakAll,// TextBlock.WrapDesiredSize, TextBlock.
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
                        locationSpot: new go.Spot(0, 0, HORIZONTAL ? 0 : 110, HORIZONTAL ? 30 : 0),//泳道距离顶部的偏离值
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
                                        font: "bold 14px sans-serif",
                                        verticalAlignment: go.Spot.Center,//文字垂直居中
                                        stroke: "#ffffff",//字体颜色
                                        background: "#0589fe" //$(go.Brush, "Linear", { 0: "aqua", 1: go.Brush.darken("aqua") })
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
                                        // stroke: '#FF5722',
                                        strokeWidth: 1,
                                    },
                                    new go.Binding("text"),
                                    new go.Binding("stroke", "color"),//自定义泳道分隔线颜色
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
                    $(go.Shape, { strokeWidth: 1 }),
                    // $(go.Shape, { strokeWidth: 1 },
                    //     new go.Binding("stroke", "color")),
                    // 箭头样式设置
                    $(go.Shape, { toArrow: "Standard", scale: 0.8, strokeWidth: 0, },
                    ),//  new go.Binding("fill", "color")
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