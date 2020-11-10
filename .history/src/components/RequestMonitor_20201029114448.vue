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

                { key: "AFC", isGroup: true },
                { key: "group", isGroup: true, },
                { key: "NFC", isGroup: true },
                { key: "AFCE", isGroup: true },
                { key: "AFCN", isGroup: true },

                { key: "NE", div: "AFC", tag: "战略" },
                { key: "NE1", div: "AFC", tag: "战略" },

                { key: "DAL", div: "NFC", tag: "战略" },

                { key: "NYG", div: "AFCE", tag: "战略" },

                { key: "SEA", div: "AFCN", tag: "战略" },
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
                                    columnSpacing: 5,
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
                        toLinkable: false
                    },
                    $(go.Panel, "Vertical",  // the whole node panel
                        { // when the DIRECTION is vertical, use the whole Node as the port
                            fromSpot: go.Spot.TopBottomSides,
                            toSpot: go.Spot.TopBottomSides,
                        },
                        $(go.Panel, 'Auto',// "Vertical",//Vertical
                            {
                                padding: 0,
                                fromLinkable: true,
                                toLinkable: true,
                            },
                            $(go.Shape, "RoundedRectangle",
                                {
                                    fill: "#ffffff",
                                    stroke: '#eb1313',
                                    strokeWidth: 1,
                                    fromLinkable: false,
                                    toLinkable: false,
                                },
                                new go.Binding("key", "key")
                            ),
                            //start
                            $(go.Panel, 'Vertical', { fromLinkable: false, },
                                nodeTemplate(),
                                templateLineTwo(),
                                nodeTemplate(),
                            ),

                        )

                    )
                )
            //第二行
            function templateLineTwo() {
                return $(go.Panel, "Auto",
                    $(go.Panel, "Horizontal",
                        //
                        $(go.Panel,
                            $(go.Shape, "RoundedRectangle",
                                { fill: "#ececec", stroke: "#D8D8D8", width: 45, height: 25, }),
                            $(go.TextBlock,
                                { margin: 5, font: "bold 12pt Helvetica, bold Arial, sans-serif" },
                                new go.Binding("text", "tag"))
                        ),
                        //
                        $(go.TextBlock,
                            {
                                alignment: go.Spot.Center,
                                margin: 3,
                                stroke: "blue",
                                textAlign: "center",
                                font: "bold 12pt sans-serif",
                            },
                            new go.Binding("text", "key")
                        )

                    )
                )
            }
            //第一行文字
            function nodeTemplate() {
                return $(go.Panel, "Auto",
                    { stretch: go.GraphObject.Horizontal },  // as wide as the whole node
                    $(go.Shape,
                        { fill: null, stroke: null },
                        new go.Binding("key", "key"),
                        //   new go.Binding("fill", "color"),//自定义表头颜色

                    ),
                    $(go.Panel, "Horizontal", {},
                        $(go.TextBlock,
                            {
                                alignment: go.Spot.Center,
                                margin: 3,
                                stroke: "#000",
                                textAlign: "center",
                                font: "bold 12pt sans-serif",
                            },
                            new go.Binding("text", "key")
                        ),
                        $(go.TextBlock,
                            {
                                alignment: go.Spot.Center,
                                margin: 3,
                                stroke: "#000",
                                textAlign: "center",
                                font: "bold 12pt sans-serif",
                            },
                            new go.Binding("text", "key")
                        )
                    )
                )
            }
            function convertKeyImage(key) {
                if (!key) key = "NE";
                return "https://www.nwoods.com/go/beatpaths/" + key + "_logo-50x50.png";
            }

            // replace the default Link template in the linkTemplateMap
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
                        avoidable: true  // don't affect any AvoidsNodes link routes
                    },
                    $(go.TextBlock, { font: "bold 12pt sans-serif", angle: (DIRECTION === 0 || DIRECTION === 180) ? 270 : 0 },
                        new go.Binding("text", "key")),
                    $(go.Panel, "Auto",
                        $(go.Shape, { fill: "transparent", stroke: "orange" }),
                        $(go.Shape, { name: "PLACEHOLDER", fill: null, stroke: null, strokeWidth: 0 })
                    ),
                    $(go.TextBlock, { font: "bold 12pt sans-serif", angle: (DIRECTION === 0 || DIRECTION === 180) ? 90 : 0 },
                        new go.Binding("text", "key"))
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