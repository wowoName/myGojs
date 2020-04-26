<template>
    <div class="main">
        <div class="gojs">
            <div id="myDiagramDiv"></div>
        </div>
        <div class="op">
            <form action="" id="attr">
                <div>
                    <label>标题：</label>
                    <input type="text" v-model="form.title" name='title' placeholder="标题">
                </div>
                <div>
                    <label>阶段目标：</label>
                    <input type="text" v-model="form.fields1" name='1' placeholder="阶段目标">
                </div>
                <div>
                    <label>达成条件：</label>
                    <input type="text" v-model="form.fields2" name='2' placeholder="达成条件">
                </div>
                <div>
                    <label>影响因素与风险：</label>
                    <input type="text" v-model="form.fields3" name='3' placeholder="影响因素与风险">
                </div>
                <div>
                    <label>达成条件标志：</label>
                    <input type="text" v-model="form.fields4" name='4' placeholder="达成条件标志">
                </div>
                <div>
                    <input type="button" value='保存' @click="saveNodeData()">
                    <input type="button" value='fit' @click="zoomToFit()">
                    <input type="button" :value='isReadOnly?"解锁":"锁定"' @click="lockPanel()">
                    <input type="button" value='数据' @click="getData()">
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import go from 'gojs'
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
                model.setDataProperty(itemdata, "bounds", layerRects[i]);
            }
        }
    }



};
// end BandedTreeLayout
var $ = go.GraphObject.make;
export default {
    components: {},
    data() {
        return {
            form: {
                title: "",
                fields1: "",
                fields2: "",
                fields3: "",
                fields4: ""
            },
            selectKey: "",//当前选择的节点 key
            myDiagram: null,
            linkDataArray: [
                { from: "1", to: "2", color: "#2196f3" },
                { from: "1", to: "2.1", color: "#2196f3" },
                { from: "1", to: "2.2", color: "#2196f3" },
                { from: "2.1", to: "3", color: "#2196f3" },
                { from: "2.2", to: "3.1", color: "#2196f3" },
                { from: "3", to: "4", color: "#2196f3" },
                { from: "4", to: "end", color: "#2196f3" },
            ],
            nodearray: [
                {
                    "key": "1",
                    "text": "初始状态",
                    "level": 0,
                    "color": "#b24444",
                    "tcolor": "#ececec",
                    "category": "Start",
                    "fields": [
                        {
                            "name": "阶段目标",
                            "type": "1",
                            "info": "单独的",
                            "color": "#F7B84B",
                            "figure": "Ellipse"
                        },
                        {
                            "name": "达成条件",
                            "type": "2",
                            "info": "第二列",
                            "color": "#F25022",
                            "figure": "Ellipse"
                        },
                        {
                            "name": "达成条件",
                            "type": "3",
                            "info": "第二列",
                            "color": "#F25022",
                            "figure": "Ellipse"
                        },
                        {
                            "name": "达成条件",
                            "type": "4",
                            "info": "第二列",
                            "color": "#F25022",
                            "figure": "Ellipse"
                        }
                    ],
                    "loc": "-792.1193365047936 353.7777213803324"
                },
                {
                    "key": "2",
                    "text": "测试",
                    "level": 2,
                    "color": "#4877b8",
                    "tcolor": "#cee111",
                    "fields": [
                        {
                            "name": "阶段目标",
                            "type": "1",
                            "info": "单独的",
                            "color": "#F7B84B",
                            "figure": "Ellipse"
                        },
                        {
                            "name": "达成条件",
                            "type": "2",
                            "info": "第二列",
                            "color": "#F25022",
                            "figure": "Ellipse"
                        },
                        {
                            "name": "达成条件",
                            "type": "3",
                            "info": "第二列",
                            "color": "#F25022",
                            "figure": "Ellipse"
                        },
                        {
                            "name": "达成条件",
                            "type": "4",
                            "info": "第二列",
                            "color": "#F25022",
                            "figure": "Ellipse"
                        }
                    ],
                    "loc": "-388.14286348346457 98.63889069312187"
                },
                {
                    "key": "2.1",
                    "text": "XXX1",
                    "level": 2,
                    "color": "#4877b8",
                    "tcolor": "#cee111",
                    "fields": [
                        {
                            "name": "阶段目标",
                            "type": "1",
                            "info": "单独的",
                            "color": "#F7B84B",
                            "figure": "Ellipse"
                        },
                        {
                            "name": "达成条件",
                            "type": "2",
                            "info": "第二列",
                            "color": "#F25022",
                            "figure": "Ellipse"
                        },
                        {
                            "name": "达成条件",
                            "type": "3",
                            "info": "第二列",
                            "color": "#F25022",
                            "figure": "Ellipse"
                        },
                        {
                            "name": "达成条件",
                            "type": "4",
                            "info": "第二列",
                            "color": "#F25022",
                            "figure": "Ellipse"
                        }
                    ],
                    "loc": "-392.9812492003523 467.57119421804634"
                },
                {
                    "key": "2.2",
                    "text": "XXX2",
                    "level": 2,
                    "color": "#4877b8",
                    "tcolor": "#ffffff",
                    "fields": [
                        {
                            "name": "阶段目标",
                            "type": "1",
                            "info": "单独的",
                            "color": "#F7B84B",
                            "figure": "Ellipse"
                        },
                        {
                            "name": "达成条件",
                            "type": "2",
                            "info": "第二列",
                            "color": "#F25022",
                            "figure": "Ellipse"
                        },
                        {
                            "name": "达成条件",
                            "type": "3",
                            "info": "第二列",
                            "color": "#F25022",
                            "figure": "Ellipse"
                        },
                        {
                            "name": "达成条件",
                            "type": "4",
                            "info": "第二列",
                            "color": "#F25022",
                            "figure": "Ellipse"
                        }
                    ],
                    "loc": "-402.60180743489445 862.3738310426991"
                },
                {
                    "key": "3",
                    "text": "XXX3",
                    "level": 3,
                    "color": "#4877b8",
                    "tcolor": "#ffffff",
                    "fields": [
                        {
                            "name": "阶段目标",
                            "type": "1",
                            "info": "单独的",
                            "color": "#F7B84B",
                            "figure": "Ellipse"
                        },
                        {
                            "name": "达成条件",
                            "type": "2",
                            "info": "第二列",
                            "color": "#F25022",
                            "figure": "Ellipse"
                        },
                        {
                            "name": "达成条件",
                            "type": "3",
                            "info": "第二列",
                            "color": "#F25022",
                            "figure": "Ellipse"
                        },
                        {
                            "name": "达成条件",
                            "type": "4",
                            "info": "第二列",
                            "color": "#F25022",
                            "figure": "Ellipse"
                        }
                    ],
                    "loc": "71.33012419427996 455.1501743483385"
                },
                {
                    "key": "3.1",
                    "text": "XXX3.1",
                    "level": 3,
                    "color": "#4877b8",
                    "tcolor": "#ffffff",
                    "fields": [
                        {
                            "name": "阶段目标",
                            "type": "1",
                            "info": "单独的",
                            "color": "#F7B84B",
                            "figure": "Ellipse"
                        },
                        {
                            "name": "达成条件",
                            "type": "2",
                            "info": "第二列",
                            "color": "#F25022",
                            "figure": "Ellipse"
                        },
                        {
                            "name": "达成条件",
                            "type": "3",
                            "info": "第二列",
                            "color": "#F25022",
                            "figure": "Ellipse"
                        },
                        {
                            "name": "达成条件",
                            "type": "4",
                            "info": "第二列",
                            "color": "#F25022",
                            "figure": "Ellipse"
                        }
                    ],
                    "loc": "74.51150868477316 862.3738310426991"
                },
                {
                    "key": "4",
                    "text": "XXX6",
                    "level": 4,
                    "color": "#4877b8",
                    "tcolor": "#ffffff",
                    "fields": [
                        {
                            "name": "阶段目标",
                            "type": "1",
                            "info": "单独的",
                            "color": "#F7B84B",
                            "figure": "Ellipse"
                        },
                        {
                            "name": "达成条件",
                            "type": "2",
                            "info": "第二列",
                            "color": "#F25022",
                            "figure": "Ellipse"
                        },
                        {
                            "name": "达成条件",
                            "type": "3",
                            "info": "第二列",
                            "color": "#F25022",
                            "figure": "Ellipse"
                        },
                        {
                            "name": "达成条件",
                            "type": "4",
                            "info": "第二列",
                            "color": "#F25022",
                            "figure": "Ellipse"
                        }
                    ],
                    "loc": "491.66134266592144 454.1314168660724"
                },
                {
                    "key": "end",
                    "text": "终止状态",
                    "category": "End",
                    "color": "#44d6b2",
                    "tcolor": "#ffffff",
                    "fields": [
                        {
                            "name": "阶段目标",
                            "type": "1",
                            "info": "单独的",
                            "color": "#F7B84B",
                            "figure": "Ellipse"
                        },
                        {
                            "name": "达成条件",
                            "type": "2",
                            "info": "第二列",
                            "color": "#F25022",
                            "figure": "Ellipse"
                        },
                        {
                            "name": "达成条件",
                            "type": "3",
                            "info": "第二列",
                            "color": "#F25022",
                            "figure": "Ellipse"
                        },
                        {
                            "name": "达成条件",
                            "type": "4",
                            "info": "第二列",
                            "color": "#F25022",
                            "figure": "Ellipse"
                        }
                    ],
                    "loc": "895.5508053436658 467.1625738802921"
                }
            ],
            isReadOnly: false,//只读
        };
    },
    watch: {
        //监听选择节点变化
        selectKey(newVal, oldVal) {
            if (newVal !== '') {
                this.setFormData()
            } else {
                this.form = Object.assign({}, this.$options.data().form)
            }
        }
    },
    methods: {
        init() {
            this.myDiagram = $(go.Diagram, "myDiagramDiv",
                {
                    // layout: $(BandedTreeLayout,  // custom layout is defined above
                    //     {
                    //         angle: HORIZONTAL ? 0 : 90,
                    //         arrangement: HORIZONTAL ? go.TreeLayout.ArrangementVertical : go.TreeLayout.ArrangementHorizontal
                    //     }),
                    layout:
                        $(go.TreeLayout,
                            {
                                //  treeStyle: go.TreeLayout.StyleLastParents,
                                arrangement: HORIZONTAL ? go.TreeLayout.ArrangementVertical : go.TreeLayout.ArrangementHorizontal,
                                // properties for most of the tree:
                                angle: HORIZONTAL ? 0 : 90,
                                //  layerSpacing: 35,
                                // properties for the "last parents":
                                // alternateAngle: 90,
                                // alternateLayerSpacing: 35,
                                // alternateAlignment: go.TreeLayout.AlignmentBus,
                                // alternateNodeSpacing: 20
                            }),
                    click: (a, b) => {
                        //点击画布 选择节点重置
                        this.selectKey = ""
                    },
                    allowDelete: true,//是否允许使用键盘 backspace 删除元素
                    // isReadOnly: true, // 只读
                    "undoManager.isEnabled": true,
                    initialContentAlignment: go.Spot.Center,
                    "commandHandler.deletesTree": true,//删除节点删除关联节点
                    "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom, //有鼠标滚轮事件放大和缩小
                });


            this.myDiagram.nodeTemplate = this.getCommonTemplate({ type: "com" })


            // this.myDiagram.nodeTemplateMap.add("Bands",
            //     $(go.Part, "Position",
            //         new go.Binding("itemArray"),
            //         {
            //             isLayoutPositioned: false,  // but still in document bounds
            //             locationSpot: new go.Spot(0, 0, 0, 30),  // account for header height
            //             layerName: "Background",
            //             pickable: false,
            //             selectable: false,
            //             itemTemplate:
            //                 $(go.Panel, HORIZONTAL ? "Vertical" : "Horizontal",
            //                     new go.Binding("position", "bounds", function (b) { return b.position; }),
            //                     //设置列样式
            //                     $(go.TextBlock,
            //                         {
            //                             angle: HORIZONTAL ? 0 : 270,
            //                             textAlign: "center",
            //                             wrap: go.TextBlock.None,
            //                             font: "bold 14px sans-serif",
            //                             verticalAlignment: go.Spot.Center,//文字垂直居中
            //                             stroke: "#ffffff",//字体颜色
            //                             background: "#0589fe" //$(go.Brush, "Linear", { 0: "aqua", 1: go.Brush.darken("aqua") })
            //                         },
            //                         new go.Binding("text"),
            //                         // always bind "width" because the angle does the rotation
            //                         new go.Binding("width", "bounds", function (r) { return HORIZONTAL ? r.width : r.height; }),
            //                         new go.Binding("height", "bounds", function (r) { return 30 })
            //                     ),
            //                     // option 1: rectangular bands:
            //                     $(go.Shape,
            //                         {
            //                             stroke: '#ececec', strokeWidth: 1,
            //                         },
            //                         new go.Binding("desiredSize", "bounds", function (r) { return r.size; }),
            //                         //修改泳道颜色
            //                         // new go.Binding("fill", "itemIndex", function (i) { return i % 2 == 0 ? "#f5f6f7" : go.Brush.darken("#ececec"); }).ofObject())
            //                         new go.Binding("fill", "itemIndex", function (i) { return i % 2 == 0 ? "#ffffff" : '#ffffff'; }).ofObject())
            //                 )
            //         }
            //     ));
            /////////////////////
            this.myDiagram.nodeTemplateMap.add("End",
                this.getCommonTemplate({ type: "End" })
            )
            this.myDiagram.nodeTemplateMap.add("Start",
                this.getCommonTemplate({ type: "Start" })
            )
            ////////////////////////////
            this.myDiagram.linkTemplate =
                $(go.Link,

                    // go.Link.Bezier,//连线样式 go.Link.Bezier  Orthogonal
                    //连接线颜色设置
                    $(go.Shape, { strokeWidth: 1, stroke: '#000000' }),
                    // $(go.Shape, { strokeWidth: 1 },
                    //     new go.Binding("stroke", "color")),
                    //箭头样式设置
                    $(go.Shape, { toArrow: "Standard", scale: 0.8, strokeWidth: 0 },
                    ),
                    // $(go.Shape, { toArrow: "Standard", scale: 0.8, strokeWidth: 0 },
                    //     new go.Binding("fill", "color")),
                );

            // define the tree node data

            //鼠标右键
            this.addContextMenu()
            //  this.myDiagram.model = new go.TreeModel(this.nodearray);

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

        },
        //设置元素位置
        nodeStyle() {
            return [
                // The Node.location comes from the "loc" property of the node data,
                // converted by the Point.parse static method.
                // If the Node.location is changed, it updates the "loc" property of the node data,
                // converting back using the Point.stringify static method.
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                {
                    // the Node.location is at the center of each node
                    locationSpot: go.Spot.Center
                }
            ];
        },
        getCommonTemplate({ type }) {
            return $(go.Node, go.Panel.Auto, this.nodeStyle(),
                {
                    click: (a, b, ) => {
                        this.nodeDataClickEvent(a, b)
                        //  console.log(b.data)
                    },
                    selectionAdorned: false,
                    textEditable: true,
                    fromLinkable: false,
                    toLinkable: false
                },
                ///////////////////////

                $(go.Panel, 'Vertical',
                    $(go.Panel, 'Auto',// "Vertical",//Vertical
                        {
                            padding: 17,
                            margin: new go.Margin(0, 0, 0, -17),
                            fromLinkable: true,
                            toLinkable: true,
                        },
                        $(go.Shape,
                            {
                                fill: "#ffffff",
                                stroke: '#8d8c8c',//边框杨色
                                fromLinkable: true,
                                toLinkable: true,

                            },
                            new go.Binding("key", "key"),
                            new go.Binding("stroke", "isSelected", (s, a) => {//设置选中边框颜色
                                return s ? "#05f33a" : this.nodearray.find(v => v.key === a.key).color
                            }).ofObject(),
                        ),
                        // this is the header for the whole node
                        $(go.Panel, 'Vertical', { fromLinkable: false, },
                            $(go.Panel, "Auto",
                                { stretch: go.GraphObject.Horizontal },  // as wide as the whole node
                                $(go.Shape,
                                    { fill: "#716d6d", stroke: null },
                                    new go.Binding("key", "key"),
                                    //   new go.Binding("fill", "color"),//自定义表头颜色
                                    new go.Binding("fill", "isSelected", (s, a) => {//设置选中颜色
                                        return s ? "#05f33a" : this.nodearray.find(v => v.key === a.key).color
                                    }).ofObject(),
                                ),

                                $(go.TextBlock,
                                    {
                                        alignment: go.Spot.Center,
                                        margin: 3,
                                        stroke: "white",
                                        textAlign: "center",
                                        font: "bold 12pt sans-serif"
                                    },
                                    new go.Binding("text", "text"))
                            ),
                            $(go.Panel, "Table",
                                {
                                    padding: 0,
                                    minSize: new go.Size(100, 50),
                                    // maxSize: new go.Size(200, 100),
                                    // defaultStretch: go.GraphObject.Vertical,//Horizontal,
                                    defaultRowSeparatorStroke: "#8d8c8c",//列之间分割线
                                    defaultColumnSeparatorStroke: "#8d8c8c",//列之间分割线
                                    itemTemplate: $(go.Panel, "TableRow",  // this Panel is a row in the containing Table
                                        new go.Binding("portId", "name"),  // this Panel is a "port"
                                        {
                                            background: "transparent",  // so this port's background can be picked by the mouse
                                            fromSpot: go.Spot.Right,  // links only go from the right side to the left side
                                            toSpot: go.Spot.Left,
                                            // allow drawing links from or to this port:
                                            //是否开启手动连接
                                            fromLinkable: type === 'end' ? false : true,
                                            toLinkable: type === 'end' ? false : true,

                                            // fromSpot: go.Spot.AllSides,
                                            // toSpot: go.Spot.AllSides,
                                        },

                                        $(go.TextBlock,
                                            {
                                                margin: new go.Margin(0, 0),
                                                column: 1,
                                                font: "bold 13px sans-serif",
                                                alignment: go.Spot.Center,
                                                width: 68,
                                                wrap: go.TextBlock.WrapBreakAll,// TextBlock.WrapDesiredSize, TextBlock.WrapFit, TextBlock.WrapBreakAll, and TextBlock.None.
                                                textAlign: "center",
                                                // background: "#00bcd4",
                                                stroke: "#000000",//字体颜色
                                                // and disallow drawing links from or to this text:
                                                // fromLinkable: false,
                                                // toLinkable: false,
                                            },
                                            new go.Binding("text", "name")),
                                        $(go.TextBlock,
                                            {
                                                margin: new go.Margin(5, 2),
                                                column: 2,
                                                width: 130,//150
                                                height: 50,
                                                font: "13px sans-serif",
                                                wrap: go.TextBlock.WrapBreakAll,
                                                alignment: go.Spot.Center,
                                                overflow: go.TextBlock.OverflowEllipsis
                                            },
                                            new go.Binding("text", "info"))
                                    )
                                },
                                new go.Binding("itemArray", "fields")
                            ))
                    )),
                //////////////////
                this.getLinkTemplate(type)
                //////////////////

            );
        },
        getLinkTemplate(type) {
            if (type == 'End') return '';
            return $(go.Panel, "Auto",
                {
                    alignment: go.Spot.Right,
                    portId: "from",
                    fromLinkable: false,//是否可以手动连接
                    cursor: "pointer",
                    click: (a, b) => {
                        //点击添加一个字节点
                        this.addNodeAndLink(a, b)
                    }
                },
                $(go.Shape, "Circle",
                    { width: 15, height: 15, fill: "#9b9b9b", stroke: "#9b9b9b", strokeWidth: 1 }),
                $(go.Shape, "PlusLine",
                    { width: 8, height: 8, fill: null, stroke: "#ffffff", strokeWidth: 1 })
            )

        },
        //添加节点
        addNodeAndLink(e, obj) {
            //先添加泳道
            let fromNode = obj.part;
            let fromData = fromNode.data;
            //  this.$nextTick(() => {
            let diagram = fromNode.diagram;

            diagram.startTransaction("Add State");
            // get the node data for which the user clicked the button

            // create a new "State" data object, positioned off to the right of the fromNode
            let p = fromNode.location.copy();
            p.x += diagram.toolManager.draggingTool.gridSnapCellSize.width;
            //nodeLevelConfig
            let toData = {
                key: (Math.random() * (36 - 1) + 1).toString(32).substr(2, 6),
                text: "XXXX",
                color: '#4877b8',
                tcolor: "#ffffff",
                level: fromData.level + 1,
                fields: [
                    { name: "阶段目标", type: "1", info: "", color: "#F7B84B", figure: "Ellipse" },
                    { name: "达成条件", type: "2", info: "", color: "#F25022", figure: "Ellipse" },
                    { name: "影响因素与风险", type: "3", info: "", color: "#F25022", figure: "Ellipse" },
                    { name: "达成条件", type: "4", info: "", color: "#F25022", figure: "Ellipse" },
                ],
            }
            //第五个层级为结束
            if (toData.level === 5) {
                toData.category = "End"
                toData.color = "#44d6b2"
                toData.text = '终止状态'
            }
            // add the new node data to the model
            let model = diagram.model;
            model.addNodeData(toData);
            // create a link data from the old node data to the new node data
            let linkdata = {
                from: model.getKeyForNodeData(fromData),
                to: model.getKeyForNodeData(toData)
            };

            // // 添加连线
            model.addLinkData(linkdata);
            //倒数第二个自动连接结束点
            // if (toData.level == 4) {
            //     model.addLinkData({
            //         from: model.getKeyForNodeData(toData),
            //         to: model.getKeyForNodeData(this.myDiagram.model.findNodeDataForKey('end'))
            //     });
            // }

            // 选中新增的node
            let newnode = diagram.findNodeForData(toData);
            diagram.select(newnode);
            //选中key
            this.$nextTick(() => {
                this.selectKey = toData.key
            })

            //  将新节点吸附到有效位置
            newnode.location = diagram.toolManager.draggingTool.computeMove(newnode, p);
            // 考虑重叠部分
            //  this.shiftNodesToEmptySpaces();
            //新增动画
            diagram.commitTransaction("Add State");
        },
        //新增节点重叠部分处理
        shiftNodesToEmptySpaces() {
            this.myDiagram.selection.each((node) => {
                if (!(node instanceof go.Node)) return;
                // look for Parts overlapping the node
                while (true) {
                    var exist = this.myDiagram.findObjectsIn(node.actualBounds,
                        // only consider Parts
                        function (obj) { return obj.part; },
                        // ignore Links and the dropped node itself
                        function (part) { return part instanceof go.Node && part !== node; },
                        // check for any overlap, not complete containment
                        true).first();
                    if (exist === null) break;
                    // try shifting down beyond the existing node to see if there's empty space
                    node.position = new go.Point(node.actualBounds.x, exist.actualBounds.bottom + 10);
                }
            });
        },
        //添加右键事件
        addContextMenu() {
            this.myDiagram.nodeTemplate.contextMenu = $("ContextMenu",
                $("ContextMenuButton",
                    $(go.TextBlock, "删 除", {
                        margin: 5,
                        width: 60,
                        textAlign: "center",
                    }), {
                    click: (e, obj) => {
                        e.diagram.commandHandler.deleteSelection();
                    }
                },
                    new go.Binding("visible", "", function (o) { return o.diagram && o.diagram.commandHandler.canDeleteSelection(); }).ofObject())
            );
        },
        //节点点击事件
        nodeDataClickEvent(a, b) {
            let key = b.data.key;
            //保存当前选择的数据
            this.selectKey = key
        },
        setFormData() {
            //通过key查找 节点数据
            let thisemp = this.myDiagram.model.findNodeDataForKey(this.selectKey);
            if (!thisemp) return
            //数据同步到左侧面板
            this.form = {
                title: thisemp.text,
                fields1: thisemp.fields.find(v => v.type == '1').info,
                fields2: thisemp.fields.find(v => v.type == '2').info,
                fields3: thisemp.fields.find(v => v.type == '3').info,
                fields4: thisemp.fields.find(v => v.type == '4').info
            }
        },
        //保存
        saveNodeData() {
            if (this.selectKey == "") {
                console.log('未选择节点数据')
                return
            }
            let thisemp = this.myDiagram.model.findNodeDataForKey(this.selectKey);
            this.myDiagram.startTransaction("vacate");
            //修改标题
            this.myDiagram.model.setDataProperty(thisemp, "text", this.form.title);
            //修改表格
            let fields = [
                { name: "阶段目标", type: "1", info: this.form.fields1, color: "#F7B84B", figure: "Ellipse" },
                { name: "达成条件", type: "2", info: this.form.fields2, color: "#F25022", figure: "Ellipse" },
                { name: "达成条件", type: "3", info: this.form.fields3, color: "#F25022", figure: "Ellipse" },
                { name: "达成条件", type: "4", info: this.form.fields4, color: "#F25022", figure: "Ellipse" },]
            this.myDiagram.model.setDataProperty(thisemp, "fields", fields);

            this.myDiagram.commitTransaction("vacate");
        },
        //画布自适应
        zoomToFit() {
            this.myDiagram.commandHandler.zoomToFit();
        },
        //只读
        lockPanel() {
            this.isReadOnly = !this.isReadOnly
            this.myDiagram.setProperties({
                allowDelete: this.isReadOnly,
                isReadOnly: this.isReadOnly
            })
        },
        //获取数据
        getData() {
            let data = this.myDiagram.model.toJson();
            console.log(data)
            setTimeout(() => {
                this.myDiagram.model = go.Model.fromJson(data);
            }, 5000)
        }
    },
    created() {

    },
    mounted() {
        this.init();

    },

}
</script>
<style  scoped>
.main {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.gojs {
    position: relative;
    float: left;
    width: calc(100% - 204px);
    height: 100%;
}
#myDiagramDiv {
    width: 100%;
    height: 100%;
}
.op {
    width: 200px;
    height: 100%;
    position: relative;
    float: right;
    background: #ececec;
}
#attr {
    padding: 5px 2px;
}
#attr > div {
    margin: 5px 0;
}
</style>