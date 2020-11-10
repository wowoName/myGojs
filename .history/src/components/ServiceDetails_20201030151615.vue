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
                { "key": 1, "name": "战役目的" },
                { "key": 2, "name": "XXX", },
                { "key": 3, "name": "XXX", },
                { "key": 4, "name": "XXXX", },
                { "key": 5, "name": "XXX", },
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
                goMake(go.Node, "Auto",

                    goMake(go.Shape, "Rectangle",
                        {
                            name: "SHAPE", fill: "#fff", stroke: '#000', strokeWidth: 1,
                            // set the port properties:
                            portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer"
                        }),
                    goMake(go.Panel, "Horizontal",
                        goMake(go.Picture,
                            {
                                name: "Picture",
                                desiredSize: new go.Size(64, 120),
                                margin: 1.5,
                                source: this.img2,
                            }),
                        // define the panel where the text will appear
                        goMake(go.Panel, "Table",
                            {
                                margin: new go.Margin(6, 10, 0, 6),
                                defaultAlignment: go.Spot.Left
                            },
                            goMake(go.RowColumnDefinition, { column: 2, width: 4 }),
                            goMake(go.TextBlock, { font: "9pt  Segoe UI,sans-serif", stroke: "#000" },  // the name
                                {
                                    row: 0, column: 0, columnSpan: 5,
                                    font: "12pt Segoe UI,sans-serif",
                                    editable: true, isMultiline: false,
                                    minSize: new go.Size(10, 16)
                                },
                                new go.Binding("text", "name").makeTwoWay()),

                        )  // end Table Panel
                    ) // end Horizontal Panel
                    ,

                );  // end Node


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