<template>
    <div class="five-main">
        <div id="myDiagramDiv" class="gojs"></div>
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

var goMake = go.GraphObject.make;
export default {
    components: {},
    data() {
        return {
            images: require('@/assets/images/u830.svg'),
            myDiagram: null,
            linkDataArray: [
                // { from: "0", to: "1", color: "re" },
                // { from: "1", to: "2", color: "red" },
                // { from: "2", to: "3", color: "#2196f3" },
                { from: "n1", to: "n2", color: "transparent", category: "none" },
                { from: "n2", to: "n3", color: "transparent", category: "none" },
                { from: "n3", to: "n4", color: "transparent", category: "none" },
            ],
            nodearray: [
                {
                    key: "_BANDS",
                    category: "Bands",
                    itemArray: [
                        { text: "战略层级指挥所（固定）", color: '#ececec', bgColor: "#ececec" },
                        { text: "战役层级指挥所（固定）", color: '#ffffff', bgColor: "#ffffff" },
                        { text: "战术层级指挥所（机动）", color: '#ececec', bgColor: "#ececec" },
                        { text: "平台层级指挥所（机动）", color: '#ffffff', bgColor: "#ffffff" },
                    ],
                },
                //添加分组固定元素在目标泳道
                { key: "g1", text: "组一", isGroup: true, },
                { key: "g2", text: "组二", isGroup: true, },
                { key: "g3", text: "组三", isGroup: true, },
                { key: "g4", text: "组四", isGroup: true, },
                { key: "n1", group: "g1", "category": "None" },
                { key: "n2", group: "g2", "category": "None" },
                { key: "n3", group: "g3", "category": "None" },
                { key: "n4", group: "g4", "category": "None" },

                //真正元素
                { key: "0", text: "ddd手动蝶阀", group: "g1", images: "u6.png", bgColor: "#ececec", color: "#ab2f2f", tcolor: "#ffffff", fig: 'RoundedRectangle', },
                { key: "1", text: "东部战区", group: "g2", images: "u7.png", parent: 0, color: "#2c82d4", tcolor: "#ffffff", fig: 'RoundedRectangle' },
                { key: "2", text: "临沂机动指挥所", group: "g3", images: "u19.png", parent: 1, color: "#fa9653", tcolor: "#ffffff", fig: 'RoundedRectangle' },
                { key: "3", text: "无人机", group: "g4", images: "u48.png", parent: 2, color: "#ffffff", tcolor: "#000000" },
                { key: "4", text: "pad", group: "g4", images: "u55.png", parent: 0, color: "#ccecff", tcolor: "#000000", },
                { key: "5", text: "歼击机", group: "g4", images: "u49.png", parent: 0, color: "red", tcolor: "#000000", },
                { key: "6", text: "坦克", group: "g4", images: "u56.png", parent: 0, color: "#ccecff", tcolor: "#000000", },
            ]
        };
    },
    computed: {},
    watch: {},
    methods: {
        init() {
            this.myDiagram = goMake(go.Diagram, "myDiagramDiv",
                {
                    layout: goMake(BandedTreeLayout,  // BandedTreeLayout  DoubleTreeLayout
                        {
                            angle: HORIZONTAL ? 0 : 90,
                            arrangement: HORIZONTAL ? go.TreeLayout.ArrangementVertical : go.TreeLayout.ArrangementHorizontal,

                        }),
                    isReadOnly: true, // 只读
                    "undoManager.isEnabled": true,
                    initialContentAlignment: go.Spot.Center,
                    initialAutoScale: go.Diagram.Uniform,
                    "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
                    "commandHandler.deletesTree": true,
                });

            this.myDiagram.nodeTemplate = this.getNodeTemplate()

            this.myDiagram.nodeTemplateMap.add("None",
                goMake(go.Node, go.Panel.Auto,)
            );

            this.myDiagram.groupTemplate =
                goMake(go.Group, "Vertical", {
                    selectable: false,
                    selectionObjectName: "SHAPE",
                    layerName: "Background",
                    layout: goMake(go.GridLayout,
                        {
                            wrappingColumn: null,
                            cellSize: new go.Size(1, 1),
                            spacing: new go.Size(5, 5),
                            alignment: go.GridLayout.Position,
                            comparer: function (a, b) { // can re-order tasks within a lane
                                var ay = a.location.y;
                                var by = b.location.y;
                                if (isNaN(ay) || isNaN(by)) return 0;
                                if (ay < by) return -1;
                                if (ay > by) return 1;
                                return 0;
                            }
                        }),
                    click: function (e, grp) {
                        if (!e.shift && !e.control && !e.meta) e.diagram.clearSelection();
                    },
                    computesBoundsAfterDrag: true, // needed to prevent recomputing Group.placeholder bounds too soon
                    handlesDragDropForMembers: true, // don't need to define handlers on member Nodes and Links

                },
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    new go.Binding("isSubGraphExpanded", "expanded").makeTwoWay(),
                    // the lane header consisting of a TextBlock and an expander button

                    goMake(go.Panel, "Auto", // the lane consisting of a background Shape and a Placeholder representing the subgraph
                        goMake(go.Shape, "Rectangle", // this is the resized object
                            {
                                name: "SHAPE",
                                fill: "transparent",
                                stroke: null,
                                strokeWidth: 4
                            },
                            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)),
                        goMake(go.Placeholder, {
                            padding: -1,
                            alignment: go.Spot.TopLeft
                        }),
                    ) // end Auto Panel
                ); // end Group

            //添加泳道
            this.addNodeBounds()
            this.myDiagram.linkTemplate =
                goMake(go.Link,//MultiArrowLink Link
                    {},
                    go.Link.Orthogonal,//连线样式 go.Link.Bezier  Orthogonal go.Link.Orthogonal,
                    //连接线颜色设置
                    goMake(go.Shape, { strokeWidth: 3, stroke: '#1296db' }, new go.Binding("stroke", "color")),

                    // 箭头样式设置
                    goMake(go.Shape, { toArrow: "Standard", scale: 1, strokeWidth: 3 }
                        , new go.Binding("stroke", "color")
                    ),
                );

            this.myDiagram.model = goMake(go.GraphLinksModel,
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
            return goMake(go.Node, go.Panel.Auto,
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
                goMake(go.Panel, "Auto",
                    {
                        margin: new go.Margin(0, 20, 0, 0),
                        minSize: new go.Size(150, 80),
                        click: function (a, b) {
                            //   console.log(a, b)
                        },
                    },
                    goMake(go.Picture, {
                        source: this.images,
                        background: null,
                        width: 100,
                        height: 80,
                    },
                        new go.Binding("source", (a) => {
                            return require('@/assets/images/' + a.images)
                        }),
                    ),

                ),
                goMake(go.Picture, {
                    source: this.images,
                    background: null,
                    width: 30,
                    height: 30,
                    margin: new go.Margin(-53, 0, 0, 50)
                },
                    new go.Binding("source", (a) => {
                        //平台层级指挥所不显示信号强度
                        return a.group === 'g4' ? null : require('@/assets/images/u13.png')
                    }),
                ),
                goMake(go.TextBlock,
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

        //添加泳道
        addNodeBounds() {
            this.myDiagram.nodeTemplateMap.add("Bands",
                goMake(go.Part, "Position",
                    new go.Binding("itemArray"),
                    {
                        isLayoutPositioned: true,  // but still in document bounds
                        locationSpot: new go.Spot(0, 0, 200, 0),
                        layerName: "Background",
                        pickable: false,
                        selectable: false,
                        resizable: true,
                        resizeObjectName: "Background",
                        itemTemplate:
                            goMake(go.Panel, HORIZONTAL ? "Vertical" : "Horizontal",
                                {
                                    // margin: new go.Margin(20, 20, 20, 20)
                                },
                                new go.Binding("position", "bounds", function (a, b, c, d) {
                                    return a.position;
                                }),
                                goMake(go.Panel, "Auto",
                                    {
                                        stretch: go.GraphObject.Horizontal,

                                    },  // as wide as the whole node
                                    goMake(go.Shape,//每个模块表头背景色
                                        {
                                            fill: "#716d6d",
                                            stroke: '#cdcdcd',
                                            strokeWidth: 0,
                                            margin: new go.Margin(0, 0, 0, 0)
                                        },
                                        new go.Binding("fill", "bgColor"),
                                        new go.Binding("width", "bounds", (r, a) => {
                                            //如果当前下一个标题为空 进行列合并 
                                            let percent = 1// this.getMegerLength(a.text)
                                            //宽度固定
                                            return HORIZONTAL ? r.width * percent : 200// r.height
                                        }),
                                        //标题 宽/高
                                        new go.Binding("height", "bounds", (r, a) => {
                                            let merge = 1// this.getMegerLength(a.text)
                                            return HORIZONTAL ? 30 : r.height * merge;
                                            //  return 30
                                        })//表头高度
                                    ),
                                    goMake(go.TextBlock,
                                        {
                                            alignment: go.Spot.Center,
                                            margin: 3,
                                            stroke: "#000",
                                            textAlign: "center",
                                            font: "bold 12pt sans-serif"
                                        },
                                        new go.Binding("text", "text"))),
                                // option 1: rectangular bands:
                                goMake(go.Shape,
                                    {
                                        stroke: '#cdcdcd', //泳道边框
                                        strokeWidth: 0,
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
        /** 
         * 更新数据
        */
        loop() {
            setTimeout(() => {
                let model = this.myDiagram.model;
                let arr = model.nodeDataArray;
                for (let i = 0; i < arr.length; i++) {
                    let data = arr[i];
                    // data.text = (+ new Date())
                    model.updateTargetBindings(data);
                }
                //连线颜色
                arr = model.linkDataArray;
                for (let i = 0; i < arr.length; i++) {
                    let data = arr[i];
                    data.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
                    model.updateTargetBindings(data);
                }
                this.loop();
            }, 500);
        }
    },
    mounted() {
        this.init();
        this.loop()
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
.gojs {
    flex: 1;
    height: 100%;
}
</style>