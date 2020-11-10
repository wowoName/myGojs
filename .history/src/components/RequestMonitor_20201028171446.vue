<template>
    <div class="five-main">
        <div id="myDiagramDiv" class="gojs"></div>
    </div>
</template>

<script>
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
                { from: "0", to: "1", color: "re" },
                { from: "1", to: "2", color: "red" },
                { from: "2", to: "3", color: "#2196f3" },
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

                //真正元素
                { key: "0", text: "ddd手动蝶阀", group: "g1", images: "u6.png", bgColor: "#ececec", color: "#ab2f2f", tcolor: "#ffffff", fig: 'RoundedRectangle', "category": "Start" },
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
            myDiagram =
                $(go.Diagram, "myDiagramDiv",
                    { // automatically scale the diagram to fit the viewport's size
                        initialAutoScale: go.Diagram.Uniform,
                        // disable user copying of parts
                        allowCopy: false,
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
                $(go.Node, "Vertical",  // the whole node panel
                    { // when the DIRECTION is vertical, use the whole Node as the port
                        fromSpot: go.Spot.TopBottomSides,
                        toSpot: go.Spot.TopBottomSides
                    },
                    $(go.TextBlock,  // the text label
                        new go.Binding("text", "key")),
                    $(go.Picture,  // the icon showing the logo
                        // You should set the desiredSize (or width and height)
                        // whenever you know what size the Picture should be.
                        {
                            desiredSize: new go.Size(50, 50),
                            // when the DIRECTION is horizontal, use this icon as the port
                            portId: (DIRECTION === 0 || DIRECTION === 180) ? "" : null,
                            fromSpot: go.Spot.LeftRightSides,
                            toSpot: go.Spot.LeftRightSides
                        },
                        new go.Binding("source", "key", convertKeyImage))
                );

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
                        layerName: "Background",  // always behind all regular nodes and links
                        movable: false,  // user cannot move or copy any lanes
                        copyable: false,
                        locationObjectName: "PLACEHOLDER",  // this object will be sized and located by SwimLaneLayout
                        layout: null,  // no lane lays out its member nodes
                        avoidable: false  // don't affect any AvoidsNodes link routes
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