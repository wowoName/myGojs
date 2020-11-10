<template>
    <div class="five-main">
        <div id="myDiagramDiv" class="gojs"></div>
    </div>
</template>

<script>
import SwimLaneLayout from '@/utils/swimLayout'

import go, { Binding, Size, TreeLayout } from 'gojs'
var DIRECTION = 90;
var goMake = go.GraphObject.make;
//start


//end
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
                { from: "g1", to: "g2" },
            ],
            nodearray: [
                { key: "g1", name: "一个大组的内容", category: "Parallel", isGroup: true, },
                //二级
                { key: "AFC", name: "态势感知", isGroup: true, group: "g1" },
                { key: "group", name: "指挥决策", isGroup: true, group: "g1" },
                { key: "NFC", name: "行动控制", isGroup: true, group: "g1" },
                { key: "AFCE", name: "支援保障end", isGroup: true, group: "g1", margin: 50 },
                //三级
                { key: "NE", group: "AFC", title: "态势上报", version: "v1.0", tag: "战略", tagDesc: "态势感知", services: "陆军", deviceType: "坦克指挥" },
                { key: "NE1", group: "AFC", title: "态势上报", version: "v1.0", tag: "战略", tagDesc: "态势感知", services: "海军", deviceType: "边缘指挥车" },

                { key: "DAL", group: "NFC", title: "态势上报", version: "v1.0", tag: "战略", tagDesc: "态势感知", services: "空军", deviceType: "预警机" },

                { key: "NYG", group: "AFCE", title: "态势上报end", version: "v1.0", tag: "战略", tagDesc: "态势感知", services: "海军", deviceType: "边缘指挥车" },
                //第二组
                { key: "g2", name: "第二组", category: "Parallel", isGroup: true, },
                { key: "AFC1", name: "态势感知", isGroup: true, group: "g2" },
                { key: "group1", name: "指挥决策", isGroup: true, group: "g2" },
                { key: "NFC1", name: "行动控制", isGroup: true, group: "g2" },
                { key: "AFCE1", name: "支援保障", isGroup: true, group: "g2" },
                { key: "AFCN1", name: "态势感知 ", isGroup: true, group: "g2" },
            ]
        };
    },
    computed: {},
    watch: {},
    methods: {
        init() {
            const that = this;
            let myDiagram =
                goMake(go.Diagram, "myDiagramDiv",
                    { // automatically scale the diagram to fit the viewport's size
                        initialAutoScale: go.Diagram.Uniform,
                        // disable user copying of parts
                        allowCopy: false,
                        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
                        // position all of the nodes and route all of the links
                        layout:
                            goMake(SwimLaneLayout,
                                {
                                    laneProperty: "group",  // needs to know how to assign vertexes/nodes into lanes/groups
                                    direction: DIRECTION,  // Group template also depends on DIRECTION
                                    setsPortSpots: false,
                                    layerSpacing: -10,
                                    columnSpacing: 0,
                                    commitLayers: function (layerRects, offset) {
                                        if (layerRects.length === 0) return;
                                        let horiz = (this.direction === 0 || this.direction === 180);
                                        let forwards = (this.direction === 0 || this.direction === 90);

                                        let rect = layerRects[forwards ? layerRects.length - 1 : 0];
                                        let totallength = horiz ? rect.right : rect.bottom;

                                        for (let i = 0; i < this.laneNames.length; i++) {
                                            let lane = this.laneNames[i];
                                            // assume lane names do not conflict with node names
                                            let group = this.diagram.findNodeForKey(lane);
                                            if (group === null) {
                                                this.diagram.model.addNodeData({ key: lane, isGroup: true });
                                                group = this.diagram.findNodeForKey(lane);
                                            }
                                            if (horiz) {
                                                group.location = new go.Point(-this.layerSpacing / 2, this.lanePositions.get(lane) * this.columnSpacing + offset.y);
                                            } else {
                                                group.location = new go.Point(this.lanePositions.get(lane) * this.columnSpacing + offset.x, -this.layerSpacing / 2);
                                            }
                                            let ph = group.findObject("PLACEHOLDER");
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
                goMake(go.Node, go.Panel.Auto,
                    {
                        click: (a, b,) => {
                            console.log(b.data)
                        },
                        selectionAdorned: false,
                        textEditable: true,
                        fromLinkable: false,
                        toLinkable: false,
                    },
                    goMake(go.Panel, "Vertical",  // the whole node panel
                        { // when the DIRECTION is vertical, use the whole Node as the port
                            fromSpot: go.Spot.TopBottomSides,
                            toSpot: go.Spot.TopBottomSides,
                            margin: 10,
                            // minSize: new go.Size(400, 100)
                        },
                        goMake(go.Panel, 'Auto',// "Vertical",//Vertical
                            {
                                padding: 0,
                                fromLinkable: true,
                                toLinkable: true,
                            },
                            goMake(go.Shape, "RoundedRectangle",
                                {
                                    // minSize: new go.Size(300, 100),
                                    fill: "#ffffff",
                                    stroke: 'blue',
                                    strokeWidth: 1,
                                    fromLinkable: false,
                                    toLinkable: false,
                                },
                                new go.Binding("key", "key")
                            ),
                            //start
                            goMake(go.Panel, 'Vertical', {
                                fromLinkable: false,
                                padding: new go.Margin(10, 10),
                                // minSize: new go.Size(300, 100)
                            },
                                nodeTemplate("title", "version"),
                                templateLineTwo(),
                                templateLineThree(),
                            ),
                        )
                    )
                );
            //占位元素
            myDiagram.nodeTemplateMap.add("None",
                goMake(go.Node, "Spot",
                    goMake(go.Panel, 'Auto', {
                        minSize: new go.Size(350, 0),
                    }
                    ),
                ));

            //第三行
            function templateLineThree() {
                return goMake(go.Panel, "Auto", {
                    stretch: go.GraphObject.Horizontal
                },
                    goMake(go.Panel, "Horizontal", {
                        stretch: go.GraphObject.Horizontal
                    },
                        //
                        goMake(go.Shape, "Circle",
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
                            width: 100,
                            textAlign: "left",
                        }),
                        goMake(go.Panel, "auto", {
                            cursor: "pointer",
                            margin: new go.Margin(0, 0, 0, 20),
                            click: (a, b) => {
                                console.log(a, b)
                            }
                        },
                            new Binding("key", "key"),
                            goMake(go.Shape, "RoundedRectangle",
                                { fill: "#169bd5", stroke: "#fff", width: 80, height: 30, },
                                // new go.Binding("fill", "isSelected", (s, a) => {//设置选中边框颜色
                                //     return s ? "#05f33a" : "red"
                                // }).ofObject(),
                            ),
                            goMake(go.TextBlock,
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
                return goMake(go.Panel, "Auto", {
                    stretch: go.GraphObject.Horizontal,
                    margin: new go.Margin(5, 0)
                },
                    goMake(go.Panel, "Horizontal",
                        goMake(go.Panel, "auto",
                            goMake(go.Shape, "RoundedRectangle",
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
                return goMake(go.Panel, "Auto",
                    { stretch: go.GraphObject.Horizontal },
                    goMake(go.Panel, "Horizontal", {},
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
                return goMake(go.TextBlock,
                    {
                        alignment: go.Spot.Center,
                        stroke: "#000",
                        textAlign: "center",
                        verticalAlignment: go.Spot.Center,
                        font: "bold 12px sans-serif",
                        wrap: go.TextBlock.WrapBreakAll,
                        overflow: go.TextBlock.OverflowEllipsis,
                        ...config,
                    },
                    new go.Binding("text", key)
                )
            }

            myDiagram.linkTemplate =
                goMake(go.Link,  // the whole link panel
                    { routing: go.Link.AvoidsNodes, corner: 10 },
                    goMake(go.Shape,  // the link shape
                        { strokeWidth: 1.5 }),
                    goMake(go.Shape,  // the arrowhead
                        { toArrow: "Standard", stroke: null })
                );

            myDiagram.groupTemplateMap.add("Parallel",
                goMake(go.Group, "Auto",
                    {
                        layerName: "Background",
                        movable: false,
                        copyable: false,
                        locationObjectName: "PLACEHOLDER",
                        layout: null,
                        avoidable: false,
                        padding: new go.Margin(80, 50, 0, 0),
                    },
                    goMake(go.TextBlock, {
                        font: "bold 25px sans-serif",
                        textAlign: "center",
                        verticalAlignment: go.Spot.Top,
                        margin: new go.Margin(-60, 0, 0, 0)
                    }, new go.Binding("text", "name")),

                    goMake(go.Panel, "Auto",
                        goMake(go.Shape,
                            {
                                name: "SHAPE",
                                fill: "transparent",
                                stroke: "blue",
                                strokeWidth: 1,
                                // margin: new go.Margin(10, 0, 0, 0),
                            },
                        ),
                        goMake(go.Placeholder, {
                            padding: -10,
                            margin: 0,
                            alignment: go.Spot.Center
                        }
                        )
                    )
                ));
            // end 

            myDiagram.groupTemplate = goMake(go.Group, (DIRECTION === 0 || DIRECTION === 180) ? "Horizontal" : "Vertical",
                {
                    layerName: "Background",
                    movable: false,
                    copyable: false,
                    locationObjectName: "PLACEHOLDER",
                    layout: null,
                    // minSize: new go.Size(200, 200),
                    avoidable: false  // don't affect any AvoidsNodes link routes
                },
                goMake(go.TextBlock, { font: "bold 20pt sans-serif", angle: (DIRECTION === 0 || DIRECTION === 180) ? 270 : 0 },
                    new go.Binding("text", "name")),
                goMake(go.Panel, "Auto", {
                    margin: 0,
                    padding: 10
                },
                    goMake(go.Shape, { fill: "transparent", stroke: "#1890ff", margin: 0 }
                    ),
                    goMake(go.Shape, { name: "PLACEHOLDER", fill: null, stroke: "#1890ff", strokeWidth: 1 })
                )

                // goMake(go.TextBlock, { font: "bold 12pt sans-serif", angle: (DIRECTION === 0 || DIRECTION === 180) ? 90 : 0 },
                //     new go.Binding("text", "key"))
            );

            //处理空组
            function dealEmptyGroup() {
                //无数据泳道添加占位元素 group
                let laneNames = that.nodearray.filter(v => Object.prototype.hasOwnProperty.call(v, 'isGroup')).map(v => v.key);
                //各组元素
                let defaultLane = [...new Set(that.nodearray.filter(v => Object.prototype.hasOwnProperty.call(v, 'group')).map(v => v.group))]
                //空组
                let emptyGroup = laneNames.filter(v => !defaultLane.includes(v))
                //空组添加占位元素
                let emptyItems = emptyGroup.map(v => ({
                    key: "z2", group: v, category: "None"
                }))
                that.nodearray = that.nodearray.concat(emptyItems)
            }
            //处理空组 添加占位元素
            dealEmptyGroup()
            myDiagram.model = goMake(go.GraphLinksModel,
                {
                    copiesArrays: true,
                    copiesArrayObjects: true,
                    nodeDataArray: that.nodearray,
                    linkDataArray: that.linkDataArray
                });
            // myDiagram.commandHandler.zoomToFit();
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