<template>
    <div>
        <div id='myDiagramDiv' class="gojs-main"></div>
    </div>
</template>

<script>
import go from 'gojs';
// 需要先定义全局变量，不然会报错
// let go = window.go;
let gm = go.GraphObject.make; //定义模版，这里官网用的$太敏感，被我替换掉了
export default {
    data() {
        return {
            img1: require('@/assets/images/plane.png'),
            img2: require('@/assets/images/rocketCar.png'),
            img3: require('@/assets/images/ship.png'),
            diagramData: {
                "class": "go.TreeModel",
                "nodeDataArray": [
                    { "key": 1, "name": "战役目的" },
                    { "key": 2, "name": "XXX", "parent": 1 },
                    { "key": 3, "name": "XXX", "parent": 2 },
                    { "key": 4, "name": "XXXX", "parent": 1 },
                    { "key": 5, "name": "XXX", "parent": 4 },
                    { "key": 6, "name": "XXX", "parent": 2 },
                    { "key": 7, "name": "XXX", "parent": 3 },
                    { "key": 8, "name": "XXX", "parent": 5 },
                    { "key": 9, "name": "XXX", "parent": 6 },
                    { "key": 10, "name": "XXX", "parent": 4 },
                    { "key": 11, "name": "XXX", "parent": 5 },
                    { "key": 12, "name": "XXX", "parent": 10 },
                    { "key": 13, "name": "XXX", "parent": 10 },
                    { "key": 14, "name": "XXX", "parent": 10 },
                    { "key": 15, "name": "XXX", "parent": 5 },
                    { "key": 16, "name": "XXX", "parent": 3 }
                ]
            }
            ,
            myDiagram: null
        }
    },
    mounted() {

        this.init()
        this.$nextTick(() => {
            this.myDiagram.commandHandler.zoomToFit();
        })
    },
    methods: {
        //init方法需要在加在图表前的事件中调用
        init() {
            if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
            var $ = go.GraphObject.make;  // for conciseness in defining templates

            this.myDiagram =
                $(go.Diagram, "myDiagramDiv", // must be the ID or reference to div
                    {
                        maxSelectionCount: 1, // users can select only one part at a time
                        validCycle: go.Diagram.CycleDestinationTree, // make sure users can only create trees

                        layout:
                            $(go.TreeLayout,
                                {
                                    treeStyle: go.TreeLayout.StyleLastParents,
                                    arrangement: go.TreeLayout.ArrangementHorizontal,
                                    // properties for most of the tree:
                                    angle: 90,
                                    layerSpacing: 35,
                                    // properties for the "last parents":
                                    alternateAngle: 90,
                                    alternateLayerSpacing: 305,
                                    alternateAlignment: go.TreeLayout.AlignmentBus,
                                    alternateNodeSpacing: 50
                                }),
                        "undoManager.isEnabled": true,// enable undo & redo
                        isReadOnly: true, // 只读
                        initialContentAlignment: go.Spot.Center,
                        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom, //有鼠标滚轮事件放大和缩小
                    });

            // when the document is modified, add a "*" to the title and enable the "Save" button
            this.myDiagram.addDiagramListener("Modified", e => {
                var button = document.getElementById("SaveButton");
                if (button) button.disabled = !this.myDiagram.isModified;
                var idx = document.title.indexOf("*");
                if (this.myDiagram.isModified) {
                    if (idx < 0) document.title += "*";
                } else {
                    if (idx >= 0) document.title = document.title.substr(0, idx);
                }
            });

            // manage boss info manually when a node or link is deleted from the diagram
            this.myDiagram.addDiagramListener("SelectionDeleting", function (e) {
                var part = e.subject.first(); // e.subject is the myDiagram.selection collection,
                // so we'll get the first since we know we only have one selection
                this.myDiagram.startTransaction("clear boss");
                if (part instanceof go.Node) {
                    var it = part.findTreeChildrenNodes(); // find all child nodes
                    while (it.next()) { // now iterate through them and clear out the boss information
                        var child = it.value;
                        var bossText = child.findObject("boss"); // since the boss TextBlock is named, we can access it by name
                        if (bossText === null) return;
                        bossText.text = "";
                    }
                } else if (part instanceof go.Link) {
                    var child = part.toNode;
                    var bossText = child.findObject("boss"); // since the boss TextBlock is named, we can access it by name
                    if (bossText === null) return;
                    bossText.text = "";
                }
                this.myDiagram.commitTransaction("clear boss");
            });

            var levelColors = ["#AC193D", "#2672EC", "#8C0095", "#5133AB",
                "#008299", "#D24726", "#008A00", "#094AB2"];

            // override TreeLayout.commitNodes to also modify the background brush based on the tree depth level
            this.myDiagram.layout.commitNodes = () => {
                go.TreeLayout.prototype.commitNodes.call(this.myDiagram.layout);  // do the standard behavior
                // then go through all of the vertexes and set their corresponding node's Shape.fill
                // to a brush dependent on the TreeVertex.level value
                this.myDiagram.layout.network.vertexes.each(function (v) {
                    if (v.node) {
                        var level = v.level % (levelColors.length);
                        var color = levelColors[level];
                        var shape = v.node.findObject("SHAPE");
                        if (shape) shape.stroke = $(go.Brush, "Linear", { 0: color, 1: go.Brush.lightenBy(color, 0.05), start: go.Spot.Left, end: go.Spot.Right });
                    }
                });
            };


            // this is used to determine feedback during drags
            function mayWorkFor(node1, node2) {
                if (!(node1 instanceof go.Node)) return false;  // must be a Node
                if (node1 === node2) return false;  // cannot work for yourself
                if (node2.isInTreeOf(node1)) return false;  // cannot work for someone who works for you
                return true;
            }

            // This function provides a common style for most of the TextBlocks.
            // Some of these values may be overridden in a particular TextBlock.
            function textStyle() {
                return { font: "9pt  Segoe UI,sans-serif", stroke: "white" };
            }

            // This converter is used by the Picture.
            let that = this;
            function findHeadShot(key) {
                let imgIndex = parseInt(Math.random() * (3 - 1) + 1)
                return that['img' + imgIndex]
            }

            // define the Node template
            this.myDiagram.nodeTemplate =
                $(go.Node, "Auto",

                    { // handle dragging a Node onto a Node to (maybe) change the reporting relationship
                        mouseDragEnter: function (e, node, prev) {
                            var diagram = node.diagram;
                            var selnode = diagram.selection.first();
                            if (!mayWorkFor(selnode, node)) return;
                            var shape = node.findObject("SHAPE");
                            if (shape) {
                                shape._prevFill = shape.fill;  // remember the original brush
                                shape.fill = "darkred";
                            }
                        },
                        mouseDragLeave: function (e, node, next) {
                            var shape = node.findObject("SHAPE");
                            if (shape && shape._prevFill) {
                                shape.fill = shape._prevFill;  // restore the original brush
                            }
                        },
                        mouseDrop: function (e, node) {
                            var diagram = node.diagram;
                            var selnode = diagram.selection.first();  // assume just one Node in selection
                            if (mayWorkFor(selnode, node)) {
                                // find any existing link into the selected node
                                var link = selnode.findTreeParentLink();
                                if (link !== null) {  // reconnect any existing link
                                    link.fromNode = node;
                                } else {  // else create a new link
                                    diagram.toolManager.linkingTool.insertLink(node, node.port, selnode, selnode.port);
                                }
                            }
                        }
                    },
                    // for sorting, have the Node.text be the data.name
                    new go.Binding("text", "name"),
                    // bind the Part.layerName to control the Node's layer depending on whether it isSelected
                    new go.Binding("layerName", "isSelected", function (sel) { return sel ? "Foreground" : ""; }).ofObject(),
                    // define the node's outer shape
                    $(go.Shape, "Rectangle",
                        {
                            name: "SHAPE", fill: "#333333", stroke: 'white', strokeWidth: 3.5,
                            // set the port properties:
                            portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer"
                        }),
                    $(go.Panel, "Horizontal",
                        $(go.Picture,
                            {
                                name: "Picture",
                                desiredSize: new go.Size(64, 40),
                                margin: 1.5,
                            },
                            new go.Binding("source", "key", findHeadShot)),
                        // define the panel where the text will appear
                        $(go.Panel, "Table",
                            {
                                minSize: new go.Size(130, NaN),
                                maxSize: new go.Size(150, NaN),
                                margin: new go.Margin(6, 10, 0, 6),
                                defaultAlignment: go.Spot.Left
                            },
                            $(go.RowColumnDefinition, { column: 2, width: 4 }),
                            $(go.TextBlock, textStyle(),  // the name
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

            // the context menu allows users to make a position vacant,
            // remove a role and reassign the subtree, or remove a department
            this.myDiagram.nodeTemplate.contextMenu =
                $("ContextMenu",
                    $("ContextMenuButton",
                        $(go.TextBlock, "修改名字"),
                        {
                            click: (e, obj) => {
                                var node = obj.part.adornedPart;
                                if (node !== null) {
                                    var thisemp = node.data;
                                    this.myDiagram.startTransaction("vacate");
                                    // update the key, name, and comments
                                    this.myDiagram.model.setDataProperty(thisemp, "name", "名字变了");
                                    this.myDiagram.model.setDataProperty(thisemp, "comments", "");
                                    this.myDiagram.commitTransaction("vacate");
                                }
                            }
                        }
                    ),
                    $("ContextMenuButton",
                        $(go.TextBlock, "移除当前"),
                        {
                            click: (e, obj) => {
                                // reparent the subtree to this node's boss, then remove the node
                                var node = obj.part.adornedPart;
                                if (node !== null) {
                                    this.myDiagram.startTransaction("reparent remove");
                                    var chl = node.findTreeChildrenNodes();
                                    // iterate through the children and set their parent key to our selected node's parent key
                                    while (chl.next()) {
                                        var emp = chl.value;
                                        this.myDiagram.model.setParentKeyForNodeData(emp.data, node.findTreeParentNode().data.key);
                                    }
                                    // and now remove the selected node itself
                                    this.myDiagram.model.removeNodeData(node.data);
                                    this.myDiagram.commitTransaction("reparent remove");
                                }
                            }
                        }
                    ),
                    $("ContextMenuButton",
                        $(go.TextBlock, "移除关联"),
                        {
                            click: (e, obj) => {
                                // remove the whole subtree, including the node itself
                                var node = obj.part.adornedPart;
                                if (node !== null) {
                                    this.myDiagram.startTransaction("remove dept");
                                    this.myDiagram.removeParts(node.findTreeParts());
                                    this.myDiagram.commitTransaction("remove dept");
                                }
                            }
                        }
                    )
                );

            // define the Link template
            this.myDiagram.linkTemplate =
                $(go.Link, go.Link.Orthogonal,
                    { corner: 5, relinkableFrom: true, relinkableTo: true },
                    $(go.Shape, { strokeWidth: 1.5, stroke: "#F5F5F5" }));

            this.load();


            // support editing the properties of the selected person in HTML
            if (window.Inspector) myInspector = new Inspector("myInspector", this.myDiagram,
                {
                    properties: {
                        "key": { readOnly: true },
                        "comments": {}
                    }
                });

        },

        load() {
            this.myDiagram.model = go.Model.fromJson(this.diagramData);
            // make sure new data keys are unique positive integers
            var lastkey = 1;
            this.myDiagram.model.makeUniqueKeyFunction = function (model, data) {
                var k = data.key || lastkey;
                while (model.findNodeDataForKey(k)) k++;
                data.key = lastkey = k;
                return k;
            };

        }
    }
}
</script>
<style  scoped>
.gojs-main {
    background-color: #000000;
}
</style>