<template>
    <div class="five-main">
        <div id="myDiagramDiv" class="gojs"></div>
    </div>
</template>

<script>
import SwimLaneLayout from '@/utils/swimLayout'
import go, { Binding } from 'gojs'
var $ = go.GraphObject.make;  // for conciseness in defining templates
var DIRECTION = 90;
var goMake = go.GraphObject.make;
export default {
    components: {},
    data() {
        return {
            images: require('@/assets/images/u830.svg'),
            myDiagram: null,
            linkDataArray: [
                { from: "NE1", to: "NE" },
                { from: "NE", to: "DAL" },
                { from: "DAL", to: "NYG" },
                { from: "NYG", to: "SEA" },
            ],
            nodearray: [

                { key: "AFC", name: "态势感知 ", isGroup: true },
                { key: "group", name: "指挥决策", isGroup: true, },
                { key: "NFC", name: "行动控制", isGroup: true },
                { key: "AFCE", name: "支援保障", isGroup: true },
                { key: "AFCN", name: "态势感知 ", isGroup: true },

                { key: "NE", div: "AFC", title: "态势上报", version: "v1.0", tag: "战略", tagDesc: "态势感知", services: "陆军", deviceType: "坦克指挥" },
                { key: "NE1", div: "AFC", title: "态势上报", version: "v1.0", tag: "战略", tagDesc: "态势感知", services: "海军", deviceType: "边缘指挥车" },

                { key: "DAL", div: "NFC", title: "态势上报", version: "v1.0", tag: "战略", tagDesc: "态势感知", services: "空军", deviceType: "预警机" },

                { key: "NYG", div: "AFCE", title: "态势上报", version: "v1.0", tag: "战略", tagDesc: "态势感知", services: "海军", deviceType: "边缘指挥车" },

                { key: "SEA", div: "AFCN", title: "态势上报", version: "v1.0", tag: "战略", tagDesc: "态势感知", services: "海军", deviceType: "边缘指挥车" },
            ]
        };
    },
    computed: {},
    watch: {},
    methods: {
        init() {
            const that = this;
            let myDiagram =
                $(go.Diagram, "myDiagramDiv",
                    { // automatically scale the diagram to fit the viewport's size
                        initialAutoScale: go.Diagram.Uniform,
                        // disable user copying of parts
                        allowCopy: false,
                        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
                        // position all of the nodes and route all of the links
                        layout:
                            $(SwimLaneLayout,
                                {
                                    laneProperty: "group",  // needs to know how to assign vertexes/nodes into lanes/groups
                                    direction: DIRECTION,  // Group template also depends on DIRECTION
                                    setsPortSpots: false,
                                    layerSpacing: 20,
                                    columnSpacing: 40,
                                    commitLayers: function (layerRects, offset) {
                                        if (layerRects.length === 0) return;

                                        var horiz = (this.direction === 0 || this.direction === 180);
                                        var forwards = (this.direction === 0 || this.direction === 90);

                                        var rect = layerRects[forwards ? layerRects.length - 1 : 0];
                                        var totallength = horiz ? rect.right : rect.bottom;

                                        for (var i = 0; i < this.laneNames.length; i++) {
                                            var lane = this.laneNames[i];
                                            // assume lane names do not conflict with node names
                                            var group = this.diagram.findNodeForKey(lane);
                                            if (group === null) {
                                                this.diagram.model.addNodeData({ key: lane, isGroup: true });
                                                group = this.diagram.findNodeForKey(lane);
                                            }
                                            if (horiz) {
                                                group.location = new go.Point(-this.layerSpacing / 2, this.lanePositions.get(lane) * this.columnSpacing + offset.y);
                                            } else {
                                                group.location = new go.Point(this.lanePositions.get(lane) * this.columnSpacing + offset.x, -this.layerSpacing / 2);
                                            }
                                            var ph = group.findObject("PLACEHOLDER");  // won't be a go.Placeholder, but just a regular Shape
                                            if (ph === null) ph = group;
                                            if (horiz) {
                                                ph.desiredSize = new go.Size(totallength, this.laneBreadths.get(lane) * this.columnSpacing);
                                            } else {
                                                ph.desiredSize = new go.Size(this.laneBreadths.get(lane) * this.columnSpacing, totallength);
                                            }
                                        }
                                    }
                                })
                    });

            // replace the default Node template in the nodeTemplateMap
            myDiagram.nodeTemplate =
                $(go.Node, go.Panel.Auto,
                    {
                        click: (a, b,) => {
                            console.log(b.data)
                        },
                        selectionAdorned: false,
                        textEditable: true,
                        fromLinkable: false,
                        toLinkable: false,
                    },
                    $(go.Panel, "Vertical",  // the whole node panel
                        { // when the DIRECTION is vertical, use the whole Node as the port
                            fromSpot: go.Spot.TopBottomSides,
                            toSpot: go.Spot.TopBottomSides,
                            margin: 10,
                            // minSize: new go.Size(400, 100)
                        },
                        $(go.Panel, 'Auto',// "Vertical",//Vertical
                            {
                                padding: 0,
                                fromLinkable: true,
                                toLinkable: true,
                            },
                            $(go.Shape, "RoundedRectangle",
                                {
                                    minSize: new go.Size(300, 100),
                                    fill: "#ffffff",
                                    stroke: 'blue',
                                    strokeWidth: 1,
                                    fromLinkable: false,
                                    toLinkable: false,
                                },
                                new go.Binding("key", "key")
                            ),
                            //start
                            $(go.Panel, 'Vertical', {
                                fromLinkable: false,
                                padding: new go.Margin(10, 10),
                                minSize: new go.Size(300, 100)
                            },
                                nodeTemplate("title", "version"),
                                templateLineTwo(),
                                templateLineThree(),
                            ),

                        )

                    )
                );
            //第三行
            function templateLineThree() {
                return $(go.Panel, "Auto", {
                    stretch: go.GraphObject.Horizontal
                },
                    $(go.Panel, "Horizontal", {
                        stretch: go.GraphObject.Horizontal
                    },
                        //
                        $(go.Shape, "Circle",
                            {
                                alignment: go.Spot.Center, alignmentFocus: go.Spot.Center,
                                width: 12,
                                height: 12,
                                fill: "#1890ff",
                                strokeWidth: 0,
                                margin: new go.Margin(0, 5, 0, 0),
                            }),
                        //
                        setTextNode("services"),
                        setTextNode("deviceType", {
                            margin: new go.Margin(0, 0, 0, 20),
                            width: 120,
                            textAlign: "left",
                        }),
                        $(go.Panel, "auto", {
                            cursor: "pointer",
                            margin: new go.Margin(0, 0, 0, 20),
                            click: (a, b) => {
                                console.log(a, b)
                            }
                        },
                            new Binding("key", "key"),
                            $(go.Shape, "RoundedRectangle",
                                { fill: "#169bd5", stroke: "#fff", width: 80, height: 30, },
                                // new go.Binding("fill", "isSelected", (s, a) => {//设置选中边框颜色
                                //     return s ? "#05f33a" : "red"
                                // }).ofObject(),
                            ),
                            $(go.TextBlock,
                                {
                                    width: 80,
                                    height: 35,
                                    stroke: "#fff",
                                    textAlign: "center",
                                    font: " 12pt Helvetica, bold Arial, sans-serif",
                                    verticalAlignment: go.Spot.Center
                                },
                                new go.Binding("text", "tag", val => {
                                    return "详情>>"
                                })
                            )
                        ),
                    )
                )
            }
            //第二行
            function templateLineTwo() {
                return $(go.Panel, "Auto", {
                    stretch: go.GraphObject.Horizontal,
                    margin: new go.Margin(5, 0)
                },
                    $(go.Panel, "Horizontal",
                        $(go.Panel, "auto",
                            $(go.Shape, "RoundedRectangle",
                                { fill: "#ececec", stroke: "#D8D8D8", width: 80, height: 30, }),
                            setTextNode("tag", {
                                width: 80,
                                height: 25,
                                margin: new go.Margin(3, 0),
                            }),
                        ),
                        setTextNode("tagDesc")
                    )
                )
            }
            //第一行文字
            function nodeTemplate(rightKey, leftKey) {
                return $(go.Panel, "Auto",
                    { stretch: go.GraphObject.Horizontal },
                    $(go.Panel, "Horizontal", {},
                        setTextNode(rightKey, {}),
                        setTextNode(leftKey),
                    )
                )
            }
            /** 
             * 设置node
             * @param {*} key 显示字段
             * @param {*} config 配置信息
            */
            function setTextNode(key, config = { margin: new go.Margin(0, 0, 0, 20), }) {
                return $(go.TextBlock,
                    {
                        alignment: go.Spot.Center,
                        stroke: "#000",
                        textAlign: "center",
                        verticalAlignment: go.Spot.Center,
                        font: "bold 12pt sans-serif",
                        wrap: go.TextBlock.WrapBreakAll,
                        overflow: go.TextBlock.OverflowEllipsis,
                        ...config,
                    },
                    new go.Binding("text", key)
                )
            }

            myDiagram.linkTemplate =
                $(go.Link,  // the whole link panel
                    { routing: go.Link.AvoidsNodes, corner: 10 },
                    $(go.Shape,  // the link shape
                        { strokeWidth: 1.5 }),
                    $(go.Shape,  // the arrowhead
                        { toArrow: "Standard", stroke: null })
                );

            myDiagram.groupTemplate = // assumes SwimLaneLayout.direction === 0
                $(go.Group, (DIRECTION === 0 || DIRECTION === 180) ? "Horizontal" : "Vertical",
                    {
                        layerName: "Background",
                        movable: false,
                        copyable: false,
                        locationObjectName: "PLACEHOLDER",
                        layout: null,
                        // minSize: new go.Size(200, 200),
                        avoidable: true  // don't affect any AvoidsNodes link routes
                    },
                    $(go.TextBlock, { font: "bold 20pt sans-serif", angle: (DIRECTION === 0 || DIRECTION === 180) ? 270 : 0 },
                        new go.Binding("text", "name")),
                    $(go.Panel, "Auto",
                        $(go.Shape, { fill: "transparent", stroke: "#1890ff", margin: 10, }),
                        $(go.Shape, { name: "PLACEHOLDER", fill: null, stroke: "#1890ff", strokeWidth: 2 })
                    ),
                    // $(go.TextBlock, { font: "bold 12pt sans-serif", angle: (DIRECTION === 0 || DIRECTION === 180) ? 90 : 0 },
                    //     new go.Binding("text", "key"))
                );

            partitionBy('d');


            function partitionBy(a) {
                // create the model and assign it to the Diagram
                var model = new go.GraphLinksModel();
                model.nodeGroupKey = "div";
                model.nodeDataArray = that.nodearray;
                model.linkDataArray = that.linkDataArray;
                myDiagram.layout.laneProperty = model.nodeGroupKey;
                myDiagram.layout.laneNames = that.nodearray.filter(v => v.hasOwnProperty('isGroup')).map(v => v.key)
                myDiagram.model = model;
            }
        }
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
.gojs {
    flex: 1;
    height: 100%;
}
</style>