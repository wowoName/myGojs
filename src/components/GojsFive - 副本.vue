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
                        { text: "终止状态标准", color: '#ececec', bgColor: "#ececec" }
                    ],
                },
                // these are the regular nodes in the TreeModel
                /** 
                 * category 标记开始 结束 节点
                */
                { key: "0", text: "初始 \n 状态", color: "#ab2f2f", tcolor: "#ffffff", fig: 'RoundedRectangle' },
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

                { key: "5", text: "5", color: "#ccecff", tcolor: "#000000", },
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
                    },
                    //自定义节点背景颜色
                    $(go.Shape,
                        {
                            isPanelMain: true,
                            margin: 0,
                            stroke: '#999999',//边框颜色
                            strokeWidth: 1,
                        },
                        new go.Binding("fill", "color"),
                        new go.Binding("figure", "fig")//自定义外观
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
                        locationSpot: new go.Spot(0, 0, HORIZONTAL ? 0 : 120, HORIZONTAL ? 30 : 0),//泳道距离顶部的偏离值
                        layerName: "Background",
                        // pickable: false,
                        // selectable: false,
                        // resizable: true,
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
            /////////////////////

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