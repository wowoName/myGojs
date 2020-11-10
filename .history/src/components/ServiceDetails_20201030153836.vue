<template>
    <div id='myDiagramDiv' class="gojs-main"></div>
</template>

<script>
import go from 'gojs';
// 需要先定义全局变量，不然会报错
// let go = window.go;
let gm = go.GraphObject.make; //定义模版，这里官网用的goMake太敏感，被我替换掉了
export default {
    data() {
        return {
            img1: require('@/assets/images/plane.png'),
            img2: require('@/assets/images/u56.png'),
            img3: require('@/assets/images/ship.png'),
            nodeArray: [
                { key: "1", title: "态势上报", version: "v11.0", tag: "战略", tagDesc: "态势感知", services: "陆军", deviceType: "坦克指挥", servicesUrl: "service_target identification", },
                { key: "2", title: "态势上报", version: "v12.0", tag: "战略", tagDesc: "态势感知", services: "陆军", deviceType: "坦克指挥", servicesUrl: "service_target identification", },
                { key: "3", title: "态势上报", version: "v13.0", tag: "战略", tagDesc: "态势感知", services: "陆军", deviceType: "坦克指挥", servicesUrl: "service_target identification", },
                { key: "4", title: "态势上报", version: "v14.0", tag: "战略", tagDesc: "态势感知", services: "陆军", deviceType: "坦克指挥", servicesUrl: "service_target identification", },
                { key: "5", title: "态势上报", version: "v15.0", tag: "战略", tagDesc: "态势感知", services: "陆军", deviceType: "坦克指挥", servicesUrl: "service_target identification", },
            ],
            linkArray: [{
                from: 1, to: 2
            }, {
                from: 1, to: 3
            }, {
                from: 3, to: 4
            }, {
                from: 4, to: 5
            }],
            myDiagram: null
        }
    },
    mounted() {

        this.init()

    },
    methods: {
        //init方法需要在加在图表前的事件中调用
        init() {
            if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
            var goMake = go.GraphObject.make;  // for conciseness in defining templates

            this.myDiagram =
                goMake(go.Diagram, "myDiagramDiv", // must be the ID or reference to div
                    {
                        maxSelectionCount: 1, // users can select only one part at a time
                        validCycle: go.Diagram.CycleDestinationTree, // make sure users can only create trees

                        layout:
                            goMake(go.TreeLayout,
                                {
                                    treeStyle: go.TreeLayout.StyleLastParents,
                                    arrangement: go.TreeLayout.ArrangementHorizontal,
                                    // properties for most of the tree:
                                    angle: 0,
                                    layerSpacing: 35,
                                    // properties for the "last parents":
                                    // alternateAngle: 0,
                                    // alternateLayerSpacing: 35,
                                    // alternateAlignment: go.TreeLayout.AlignmentBus,
                                    // alternateNodeSpacing: 20
                                }),
                        "undoManager.isEnabled": true,// enable undo & redo
                        isReadOnly: true, // 只读
                        initialContentAlignment: go.Spot.Center,
                        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom, //有鼠标滚轮事件放大和缩小
                    });

            // define the Node template
            this.myDiagram.nodeTemplate =
                goMake(go.Node, go.Panel.Auto,
                    {
                        click: (a, b,) => {
                            console.log(b.data)
                        },
                        selectionAdorned: true,
                        textEditable: true,
                        selectable: false,
                        fromLinkable: false,
                        toLinkable: false,
                        isShadowed: true,
                        shadowColor: "#ececec"
                    },
                    goMake(go.Panel, "Vertical",  // the whole node panel

                        new go.Binding("margin", "type", value => {
                            return value === 'information' ? new go.Margin(0, 0, 0, 50) : new go.Margin(0, 0, 0, 140)
                        }),
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
                                setTextNode("servicesUrl", { font: "15px sans-serif", stroke: "blue", alignment: go.Spot.Left, }),
                                templateLineTwo(),
                                templateLineThree(),
                            ),
                        )
                    )
                );


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
                                width: 20,
                                height: 20,
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
                        goMake(go.Panel, "auto", {
                            cursor: "pointer",
                            margin: new go.Margin(0, 0, 0, 20),
                            click: (a, b) => {
                                let event = window.event
                                event.stopPropagation()
                                let key = b.key
                                let data = that.nodearray.find(v => v.key === key)
                                that.$emit("click", data)
                            },
                        },
                            new go.Binding("key", "key"),
                            // goMake(go.Shape, "RoundedRectangle",
                            //     { fill: "#169bd5", stroke: "#000", width: 100, height: 30, },
                            // new go.Binding("fill", "isSelected", (s, a) => {//设置选中边框颜色
                            //     return s ? "#05f33a" : "red"
                            // }).ofObject(),
                            // ),
                            // goMake(go.TextBlock,
                            //     {
                            //         width: 100,
                            //         height: 35,
                            //         stroke: "#000",
                            //         textAlign: "center",
                            //         font: " 16pt Helvetica, bold Arial, sans-serif",
                            //         verticalAlignment: go.Spot.Center
                            //     },
                            //     new go.Binding("text", "tag", val => {
                            //         return "详情>>"
                            //     })
                            // )
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
                        setTextNode("tagDesc"),
                        goMake(go.Panel, "auto", {
                            cursor: "pointer",
                            margin: new go.Margin(0, 0, 0, 20),
                            click: (a, b) => {
                                let event = window.event
                                event.stopPropagation()
                                let key = b.key
                                let data = that.nodearray.find(v => v.key === key)
                                that.$emit("click", data)
                            },
                        },
                            new go.Binding("key", "key"),
                            goMake(go.Shape, "RoundedRectangle",
                                { fill: "#169bd5", stroke: "#000", width: 100, height: 30, },
                                new go.Binding("fill", "isSelected", (s, a) => {//设置选中边框颜色
                                    return s ? "#05f33a" : "red"
                                }).ofObject(),
                            ),
                            goMake(go.TextBlock,
                                {
                                    width: 100,
                                    height: 35,
                                    stroke: "#000",
                                    textAlign: "center",
                                    font: " 16pt Helvetica, bold Arial, sans-serif",
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
                        font: "18pt sans-serif",
                        wrap: go.TextBlock.WrapBreakAll,
                        overflow: go.TextBlock.OverflowEllipsis,
                        ...config,
                    },
                    new go.Binding("text", key)
                )
            }

            // define the Link template
            this.myDiagram.linkTemplate =
                goMake(go.Link,  // the whole link panel
                    { routing: go.Link.AvoidsNodes, corner: 10 },
                    goMake(go.Shape,  // the link shape
                        { strokeWidth: 1.5 }),
                    goMake(go.Shape,  // the arrowhead
                        { toArrow: "Standard", stroke: null })
                );

            this.myDiagram.model = goMake(go.GraphLinksModel,
                {
                    copiesArrays: true,
                    copiesArrayObjects: true,
                    nodeDataArray: this.nodeArray,
                    linkDataArray: this.linkArray
                });

        },


    }
}
</script>
<style  scoped>
.gojs-main {
}
</style>