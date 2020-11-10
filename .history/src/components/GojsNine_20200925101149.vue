<template>
    <!-- <div>
        <div id="myDiagramDiv" class="gojs-main"></div>
        <div class="op">
            <input type="button" @click="getData()" value="测试">
            <input type="button" @click="addNode()" value="添加">
        </div>
    </div> -->
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
                    <!-- <input type="button" value='保存' @click="saveNodeData()">
                    <input type="button" value='fit' @click="zoomToFit()">
                    <input type="button" :value='isReadOnly?"解锁":"锁定"' @click="lockPanel()">
                    <input type="button" value='数据' @click="getData()"> -->
                </div>
            </form>
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
                // layerRects[i].width = 500
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
            isReadOnly: false,//只读
            form: {//节点属性值
                title: "",
                fields1: "",
                fields2: "",
                fields3: "",
                fields4: ""
            },
            selectKey: "",//当前选中的节点key 
            images: require('@/assets/images/u830.svg'),
            myDiagram: null,
            linkDataArray: [
                { from: "0", to: "1", color: "#2196f3" },
                { from: "1", to: "1.1", color: "#2196f3" },
            ],
            nodearray: [
                {
                    key: "0", text: "初始\n状态", color: "#b24444", tcolor: "#ffffff", category: "Start", fields: [{
                        "name": "阶段目标",
                        "type": "1",
                        "info": "单独的",
                        "color": "#F7B84B",
                        "figure": "Ellipse"
                    },
                    ]
                },
                {
                    key: "1", text: "初始\n状态", color: "#b24444", tcolor: "#ffffff", category: "Start", fields: [{
                        "name": "阶段目标",
                        "type": "1",
                        "info": "单独的",
                        "color": "#F7B84B",
                        "figure": "Ellipse"
                    },
                    ]
                },
            ],
        };
    },
    computed: {},
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
        //点击节点获取节点属性值
        setFormData() {
            //通过key查找 节点数据
            let thisemp = this.myDiagram.model.findNodeDataForKey(this.selectKey);
            if (!thisemp) return
            //数据同步到左侧面板
            this.form = {
                title: thisemp.text,
                fields1: thisemp.fields.find(v => v.type == '1').info
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
                { name: "阶段目标", type: "1", info: this.form.fields1, color: "#F7B84B", figure: "Ellipse" }]
            this.myDiagram.model.setDataProperty(thisemp, "fields", fields);

            this.myDiagram.commitTransaction("vacate");
        },
        //初始化流程图
        init() {
            this.myDiagram = $(go.Diagram, "myDiagramDiv",
                {
                    layout: $(BandedTreeLayout,  // BandedTreeLayout  DoubleTreeLayout
                        {
                            angle: HORIZONTAL ? 0 : 90,
                            arrangement: HORIZONTAL ? go.TreeLayout.ArrangementVertical : go.TreeLayout.ArrangementHorizontal,

                        }),
                    isReadOnly: true, // 只读
                    "undoManager.isEnabled": false,
                    initialContentAlignment: go.Spot.Center,
                    initialAutoScale: go.Diagram.Uniform,
                    "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom, //有鼠标滚轮事件放大和缩小
                    click: (a, b) => {
                        //点击画布 选择节点重置
                        this.selectKey = ""
                    },
                });

            this.myDiagram.nodeTemplate = this.getComTemplate({ type: 'Com' });
            this.myDiagram.nodeTemplateMap.add('None', this.getComTemplate({ type: "None" }))

            this.myDiagram.nodeTemplateMap.add("End", this.getNodeTemPlate('end'));
            ////////////////////////////
            this.myDiagram.linkTemplate =
                $(go.Link,//MultiArrowLink
                    {
                        toShortLength: 3,
                        // relinkableFrom: true,
                        // relinkableTo: true,
                        // reshapable: true,
                        // resegmentable: true
                    },
                    go.Link.Bezier,//连线样式 go.Link.Bezier  Orthogonal

                    //连接线颜色设置
                    $(go.Shape, { strokeWidth: 1, stroke: "#9e9e9e" }),
                    // $(go.Shape, { strokeWidth: 1 },
                    //     new go.Binding("stroke", "color")),
                    // 箭头样式设置
                    $(go.Shape, { toArrow: "Standard", scale: 0.8, strokeWidth: 0, },
                    ),//  new go.Binding("fill", "color")
                );

            // define the tree node data
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
        //获取模板
        getComTemplate({ type }) {
            return $(go.Node, go.Panel.Auto,
                {
                    click: (a, b,) => {
                        //保存当前选择的节点
                        this.selectKey = b.data.key
                        console.log(b.data)
                    },
                    selectionAdorned: false,//选中不显示外边框
                    textEditable: false,
                    fromLinkable: false,
                    toLinkable: false
                },
                //自定义节点背景颜色
                $(go.Panel, "Auto", {
                    padding: type === 'None' ? 0 : new go.Margin(0, 20, 0, 0),
                    margin: new go.Margin(0, 0, 0, 0),//-15
                    fromLinkable: true,
                    toLinkable: true
                },
                    $(go.Shape,
                        {
                            isPanelMain: true,
                            margin: 0,
                            //  stroke: 'transparent',//边框颜色
                            strokeWidth: 3,
                            minSize: new go.Size(120, 50),
                            fill: "#f59a23"
                        },
                        new go.Binding("stroke", "isSelected", (s, a) => {//设置选中边框颜色
                            return s ? "#0fee35" : 'transparent'
                        }).ofObject(),
                        // new go.Binding("fill", "color")
                    ),//背景色

                    $(go.TextBlock, {
                        margin: 5,
                        height: 50,
                        width: 120,
                        textAlign: "center",
                        wrap: go.TextBlock.WrapBreakAll,// TextBlock.WrapDesiredSize, TextBlock.
                        verticalAlignment: go.Spot.Center,//文字垂直居中
                        overflow: go.TextBlock.OverflowEllipsis,
                        editable: true,
                    },//样式大小
                        new go.Binding("text", "text"),//显示文字  text 为key
                        new go.Binding("stroke", "tcolor")//自定义字体颜色
                    )
                ),
                /// 添加子级
                this.getAddTemplate(type),
                ///
                this.templateTemplate(type)

            )
        },
        //获取添加子级panel
        getAddTemplate(type) {
            if (type === 'None') return '';
            return $(go.Panel, "Auto",
                {
                    alignment: go.Spot.TopRight, portId: "froms", fromLinkable: true, cursor: "pointer", click: (a, b) => {
                        //点击添加一个字节点
                        this.addNodeAndLink(a, b)
                    }
                },
                $(go.Shape, "Circle",
                    { width: 15, height: 15, margin: new go.Margin(0, 2, 0, 0), fill: "#f59a23", stroke: "#f59a23", strokeWidth: 1 }),
                $(go.Shape, "PlusLine",
                    { width: 8, height: 8, fill: null, stroke: "#ffffff", strokeWidth: 1 })
            )
        },
        //设置事件模板模板
        templateTemplate(type) {
            if (type === 'None') return '';
            return $(go.Panel, "Auto",
                {
                    alignment: go.Spot.RightCenter, portId: "from", fromLinkable: true, cursor: "pointer", click: (a, b) => {
                        //点击添加事件模板
                        this.addMultiNode(a, b)
                    }
                },
                $(go.Picture, {
                    source: this.images,
                    background: null,
                    width: 15,
                    height: 15,
                    margin: new go.Margin(10, 2, 0, 0)
                })
            )
        },
        //添加一个子节点
        addNodeAndLink(e, obj) {
            //先添加泳道
            let fromNode = obj.part;
            let fromData = fromNode.data;

            let diagram = fromNode.diagram;
            diagram.startTransaction("Add State");
            // get the node data for which the user clicked the button

            // create a new "State" data object, positioned off to the right of the fromNode
            let p = fromNode.location.copy();
            p.x += diagram.toolManager.draggingTool.gridSnapCellSize.width;
            let toData = null
            let model = diagram.model;
            //添加倒数第二个节点  进行节点连线至最后节点
            toData = {
                key: (Math.random() * (36 - 1) + 1).toString(32).substr(2, 6),
                loc: go.Point.stringify(p),
                ...{ text: "应急响应阶段", color: "#4c7bbc", tcolor: "#ffffff" }
            };
            // add the new node data to the model
            model.addNodeData(toData);
            //  添加连线
            this.setLinks(model, fromData, toData)
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
        //添加多个数据节点
        addMultiNode(e, obj) {

            let fromNode = obj.part;
            let diagram = fromNode.diagram;
            let model = diagram.model;
            diagram.startTransaction("Add State");
            //根节点数据
            let fromData = fromNode.data;
            let data = []
            //获取节点数据
            for (let i = 0, l = 5; i < l; i++) {
                let nodeData = {
                    key: (Math.random() * (36 - 1) + 1).toString(32).substr(2, 6),
                    ...{ text: "应急响应阶段" + i, color: "#4c7bbc", tcolor: "#ffffff" }
                }
                data.push(nodeData)
                model.addNodeData(nodeData);
            }
            //添加节点& 连接连线
            for (let i = 0, l = data.length; i < l; i++) {
                if (i === 0)
                    this.setLinks(model, fromData, data[i])
                if (i < data.length - 1)
                    this.setLinks(model, data[i], data[i + 1])
                else console.log('ddd', i)
            }
            diagram.commitTransaction("Add State");
        },
        setLinks(model, fromData, toData) {
            let linkdata = {
                from: model.getKeyForNodeData(fromData),
                to: model.getKeyForNodeData(toData)
            };
            // 添加连线
            model.addLinkData(linkdata);
        },
        //添加右键事件
        addContextMenu() {
            this.myDiagram.nodeTemplate.contextMenu = $("ContextMenu",
                // $("ContextMenuButton",
                //     $(go.TextBlock, "修改名称", {
                //         margin: 5,
                //         width: 60,
                //         textAlign: "center",
                //     }),
                //     { click: function (e, obj) { e.diagram.commandHandler.editTextBlock(); } },
                //     new go.Binding("visible", "", function (o) { return o.diagram && o.diagram.commandHandler.canEditTextBlock(); }).ofObject()),
                // add one for Editing...
                $("ContextMenuButton",
                    $(go.TextBlock, " 删 除 ", {
                        margin: 5,
                        width: 60,
                        textAlign: "center",
                    }),
                    {
                        click: (e, obj) => {
                            e.diagram.commandHandler.deleteSelection();

                        }
                    },
                    new go.Binding("visible", "", function (o) { return o.diagram && o.diagram.commandHandler.canDeleteSelection(); }).ofObject())
            );

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
        getNodeTemPlate() {
            return $(go.Node, "Spot", {
                desiredSize: new go.Size(85, 85),
                selectionAdorned: false,
                fromLinkable: false,
                toLinkable: true
            },
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Shape, "Circle",
                    {
                        fill: "#09cb22",
                        stroke: null,
                        cursor: "pointer",
                    },
                    new go.Binding("fill", 'color'),
                ),
                $(go.Shape, "Circle", {
                    fill: null,
                    desiredSize: new go.Size(75, 75),
                    strokeWidth: 10,
                    stroke: "#ffffff",
                    fromLinkable: false,
                    toLinkable: false
                }
                ),
                $(go.TextBlock, "End",
                    {
                        font: " 14px helvetica, bold arial, sans-serif",
                        stroke: "whitesmoke"
                    },
                    new Binding('text', 'text'))
            )
        },
        //获取合并行数量
        getMegerLength(text) {
            if (text === '') {
                return 0
            }
            let data = this.nodearray[0].itemArray;
            let index = data.findIndex(v => v.text === text);
            let a = data.slice(index + 1)
            let spaceLength = a.findIndex(v => v.text !== '')
            return spaceLength === -1 ? a.length + 1 : spaceLength !== 0 ? spaceLength + 1 : 1
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