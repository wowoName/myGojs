<template>
    <div class="five-main">
        <div id="myDiagramDiv" class="gojs"></div>
        <div class="op">
            <input type="button" @click="getData()" value="测试">
            <input type="button" @click="addNode()" value="添加">
            <select name="" id="level">
                <option value="0">当前</option>
                <option value="1">下一泳道</option>
            </select>
        </div>
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
                        { text: "战略层级指挥所（固定）", "isGroup": true, level: 0, color: '#ececec', bgColor: "#ececec" },//color 泳道分隔线颜色
                        { text: "战役层级指挥所（固定）", "isGroup": true, color: '#ffffff', bgColor: "#ffffff" },
                        // { text: "", color: '#ffffff', bgColor: "#ececec" },
                        { text: "战术层级指挥所（机动）", "isGroup": true, color: '#ececec', bgColor: "#ececec" },
                        { text: "平台层级指挥所（机动）", "isGroup": true, color: '#ffffff', bgColor: "#ffffff" },
                    ],
                },
                //添加分组固定元素在目标泳道
                { key: "g1", text: "组一", isGroup: true, },
                { key: "g2", text: "组二", isGroup: true, },
                { key: "g3", text: "组三", isGroup: true, },
                { key: "g4", text: "组四", isGroup: true, },

                //真正元素
                { key: "0", text: "ddd手动蝶阀", group: "g1", images: "u6.png", bgColor: "#ececec", color: "#ab2f2f", tcolor: "#ffffff", fig: 'RoundedRectangle', "category": "Start" },
                { key: "1", text: "xx", group: "g2", images: "u7.png", parent: 0, color: "#2c82d4", tcolor: "#ffffff", fig: 'RoundedRectangle' },
                { key: "2", text: "xx", group: "g3", images: "u19.png", parent: 1, color: "#fa9653", tcolor: "#ffffff", fig: 'RoundedRectangle' },
                { key: "3", text: "大是大非1", group: "g4", images: "u48.png", parent: 2, color: "#ffffff", tcolor: "#000000" },
                { key: "4", text: "xxx2", group: "g4", images: "u55.png", parent: 0, color: "#ccecff", tcolor: "#000000", },
                { key: "5", text: "xxx2", group: "g4", images: "u49.png", parent: 0, color: "red", tcolor: "#000000", },
                { key: "6", text: "xxx2", group: "g4", images: "u56.png", parent: 0, color: "#ccecff", tcolor: "#000000", },
            ],
            //对应层级配置   
            nodeLevelConfig: [{
                color: '#2c82d4',
                text: "治理目的",
                tcolor: "#ffffff",
                fig: 'RoundedRectangle'
            }, {
                color: '#fa9653',
                tcolor: "#ffffff", text: "治理方针",
                fig: 'RoundedRectangle'
            }, {
                color: '#ffffff', text: "终止状态",
                tcolor: "#000000"
            }, {
                color: '#ccecff', text: "终止状态标准",
                tcolor: "#000000",
                category: "End"
            }]
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
                            arrangement: HORIZONTAL ? go.TreeLayout.ArrangementVertical : go.TreeLayout.ArrangementHorizontal,

                        }),
                    //isReadOnly: true, // 只读
                    "undoManager.isEnabled": true,
                    initialContentAlignment: go.Spot.Center,
                    initialAutoScale: go.Diagram.Uniform,
                    "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom, //有鼠标滚轮事件放大和缩小
                    //删除 ---删除管理的子级
                    // "commandHandler.copiesTree": true,
                    // "commandHandler.copiesParentKey": true,
                    "commandHandler.deletesTree": true,
                    //"draggingTool.dragsTree": true,
                });

            this.myDiagram.nodeTemplate = this.getNodeTemplate()

            this.myDiagram.groupTemplate =
                $(go.Group, "Vertical", {
                    selectable: false,
                    selectionObjectName: "SHAPE", // even though its not selectable, this is used in the layout
                    layerName: "Background", // all lanes are always behind all nodes and links
                    layout: $(go.GridLayout, // automatically lay out the lane's subgraph
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
                    click: function (e, grp) { // allow simple click on group to clear selection
                        if (!e.shift && !e.control && !e.meta) e.diagram.clearSelection();
                    },
                    computesBoundsAfterDrag: true, // needed to prevent recomputing Group.placeholder bounds too soon
                    handlesDragDropForMembers: true, // don't need to define handlers on member Nodes and Links

                },
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    new go.Binding("isSubGraphExpanded", "expanded").makeTwoWay(),
                    // the lane header consisting of a TextBlock and an expander button

                    $(go.Panel, "Auto", // the lane consisting of a background Shape and a Placeholder representing the subgraph
                        $(go.Shape, "Rectangle", // this is the resized object
                            {
                                name: "SHAPE",
                                fill: "transparent",
                                stroke: null,
                                strokeWidth: 4
                            },
                            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)),
                        $(go.Placeholder, {
                            padding: -1,
                            alignment: go.Spot.TopLeft
                        }),
                    ) // end Auto Panel
                ); // end Group

            //添加泳道
            this.addNodeBounds()
            this.myDiagram.linkTemplate =
                $(go.Link,//MultiArrowLink
                    {
                        toShortLength: 3,
                        relinkableFrom: true,
                        relinkableTo: true,
                        reshapable: true,
                        resegmentable: true
                    },
                    go.Link.Orthogonal,//连线样式 go.Link.Bezier  Orthogonal

                    //连接线颜色设置
                    $(go.Shape, { strokeWidth: 3, stroke: '#1296db' }, new go.Binding("stroke", "color")),

                    // $(go.Shape, { strokeWidth: 1 },
                    //     new go.Binding("stroke", "color")),
                    // 箭头样式设置
                    $(go.Shape, { toArrow: "Standard", scale: 1, strokeWidth: 5, stroke: "red" }
                        , new go.Binding("stroke", "color")
                    ),
                );

            // define the tree node data
            //右键事件
            this.addContextMenu()
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
        getNodeTemplate() {
            return $(go.Node, go.Panel.Auto,
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
                $(go.Panel, "Auto",
                    {
                        margin: new go.Margin(0, 20, 0, 0),
                        minSize: new go.Size(150, 80),
                        click: function (a, b) {
                            //   console.log(a, b)
                        },
                    },
                    $(go.Picture, {
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
                $(go.Picture, {
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
                $(go.TextBlock,
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
        //添加右键事件
        addContextMenu() {
            this.myDiagram.nodeTemplate.contextMenu = $("ContextMenu",
                $("ContextMenuButton",
                    $(go.TextBlock, "修改名称", {
                        margin: 5,
                        width: 60,
                        textAlign: "center",
                    }),
                    { click: function (e, obj) { e.diagram.commandHandler.editTextBlock(); } },
                    new go.Binding("visible", "", function (o) { return o.diagram && o.diagram.commandHandler.canEditTextBlock(); }).ofObject()),
                // add one for Editing...
                $("ContextMenuButton",
                    $(go.TextBlock, " 删 除 "),
                    {
                        click: (e, obj) => {
                            e.diagram.commandHandler.deleteSelection();
                        }
                    },
                    new go.Binding("visible", "", function (o) { return o.diagram && o.diagram.commandHandler.canDeleteSelection(); }).ofObject())
            );
        },
        //添加泳道
        addNodeBounds() {
            this.myDiagram.nodeTemplateMap.add("Bands",
                $(go.Part, "Position",
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
                            $(go.Panel, HORIZONTAL ? "Vertical" : "Horizontal",
                                {
                                    // margin: new go.Margin(20, 20, 20, 20)
                                },
                                new go.Binding("position", "bounds", function (a, b, c, d) {
                                    return a.position;
                                }),
                                $(go.Panel, "Auto",
                                    {
                                        stretch: go.GraphObject.Horizontal,

                                    },  // as wide as the whole node
                                    $(go.Shape,//每个模块表头背景色
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
                                    $(go.TextBlock,
                                        {
                                            alignment: go.Spot.Center,
                                            margin: 3,
                                            stroke: "#000",
                                            textAlign: "center",
                                            font: "bold 12pt sans-serif"
                                        },
                                        new go.Binding("text", "text"))),
                                // option 1: rectangular bands:
                                $(go.Shape,
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
        //添加节点
        addNode() {
            let node = {};
            node["key"] = "节点Key";
            node["loc"] = "0 0";//节点坐标
            node["text"] = "节点名称";
            this.myDiagram.model.addNodeData(node);
        },
        addNodeAndLink(e, obj) {
            //先添加泳道
            let fromNode = obj.part;
            let fromData = fromNode.data;
            let level = fromData.level + 1


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
                ... this.nodeLevelConfig[level - 1],
                level: level,//记录当前层级  设置子样式
                loc: go.Point.stringify(p)
            };
            // add the new node data to the model
            let model = diagram.model;
            model.addNodeData(toData);
            // create a link data from the old node data to the new node data
            var linkdata = {
                from: model.getKeyForNodeData(fromData),
                to: model.getKeyForNodeData(toData)
            };
            // 添加连线
            model.addLinkData(linkdata);
            // 选中新增的node
            let newnode = diagram.findNodeForData(toData);
            // diagram.select(newnode);
            //  将新节点吸附到有效位置
            newnode.location = diagram.toolManager.draggingTool.computeMove(newnode, p);
            // 考虑重叠部分
            this.shiftNodesToEmptySpaces();
            //新增动画
            diagram.commitTransaction("Add State");
            // })
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
        /** 
         * 添加泳道
         * @param {*} level 泳道层级 【父泳道+1】
         * @param {*} color 泳道颜色
        */
        addSwimNodeData(level, color, boundsLevel) {
            //当前泳道
            if (boundsLevel == '0') {
                this.nodearray[0].itemArray.splice(level, 0, { text: "", level: level, color: color, bgColor: color })
            } else {
                let colors = color === '#ececec' ? '#ffffff' : '#ececec'
                this.nodearray[0].itemArray.splice(level, 0, { text: "泳道" + (+new Date()), level: level, color: colors, bgColor: colors })
            }
            this.myDiagram.model = new go.TreeModel(this.nodearray);

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
                for (i = 0; i < arr.length; i++) {
                    let data = arr[i];
                    data.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
                    model.updateTargetBindings(data);
                }
                this.loop();
            }, 500);
        }
    },
    created() {

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
.op {
    width: 200px;
    height: 100%;
    border: 1px solid #ececec;
}
.gojs {
    flex: 1;
    height: 100%;
}
</style>