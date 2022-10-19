<template>
    <info>Progression of all ball-strike counts and current at-bat result</info>
    <div id="chart2"></div>
</template>


<script>

const pitch_result_dict = {
    'Groundout': 'O',
    'Double': 'H',
    'Single': 'H',
    'Strikeout': 'O',
    'Walk': 'BB',
    'Runner Out': 'OT',
    'Flyout': 'O',
    'Forceout': 'O',
    'Pop Out': 'O',
    'Intent Walk': 'OT',
    'Lineout': 'O',
    'Home Run': 'H',
    'Triple': 'H',
    'Hit By Pitch': 'OT',
    'Grounded Into DP': 'O',
    'Sac Bunt': 'OT',
    'Fielders Choice': 'O',
    'Bunt Groundout': 'O',
    'Field Error': 'OT',
    'Double Play': 'O',
    'Sac Fly': 'OT',
    'Fielders Choice Out': 'O',
    'Bunt Pop Out': 'O',
    'Catcher Interference': 'OT',
    'Strikeout - DP': 'O',
    'Batter Interference': 'OT',
    'Sac Fly DP': 'O',
    'Bunt Lineout': 'O',
    'Sacrifice Bunt DP': 'O',
    'Triple Play': 'O'
}
import * as d3 from "d3";
import * as d3Sankey from "d3-sankey"

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/sankey-diagram
function SankeyChart({
    nodes, // an iterable of node objects (typically [{id}, …]); implied by links if missing
    links, // an iterable of link objects (typically [{source, target}, …])
    ab_path,
    id,

}, {
    format = ",", // a function or format specifier for values in titles
    align = "justify", // convenience shorthand for nodeAlign
    nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
    nodeGroup, // given d in nodes, returns an (ordinal) value for color
    nodeGroups, // an array of ordinal values representing the node groups
    nodeLabel, // given d in (computed) nodes, text to label the associated rect
    nodeTitle = d => `${d.id}\n${format(d.value)}`, // given d in (computed) nodes, hover text
    nodeAlign = align, // Sankey node alignment strategy: left, right, justify, center
    nodeWidth = 15, // width of node rects
    nodePadding = 10, // vertical separation between adjacent nodes
    nodeLabelPadding = 6, // horizontal separation between node and label
    nodeStroke = "currentColor", // stroke around node rects
    nodeStrokeWidth, // width of stroke around node rects, in pixels
    nodeStrokeOpacity, // opacity of stroke around node rects
    nodeStrokeLinejoin, // line join for stroke around node rects
    linkSource = ({source}) => source, // given d in links, returns a node identifier string
    linkTarget = ({target}) => target, // given d in links, returns a node identifier string
    linkValue = ({value}) => value, // given d in links, returns the quantitative value
    linkPath = d3Sankey.sankeyLinkHorizontal(), // given d in (computed) links, returns the SVG path
    linkTitle = d => `${d.source.id} → ${d.target.id}\n${format(d.value)}`, // given d in (computed) links
    linkColor = "source-target", // source, target, source-target, or static color
    linkStrokeOpacity = 0.3, // link stroke opacity
    linkMixBlendMode = "multiply", // link blending mode
    colors = d3.schemeTableau10, // array of colors
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    marginTop = 0, // top margin, in pixels
    marginRight = 20, // right margin, in pixels
    marginBottom = 0, // bottom margin, in pixels
    marginLeft = 20, // left margin, in pixels

} = {}) {
    // Convert nodeAlign from a name to a function (since d3-sankey is not part of core d3).
    if (typeof nodeAlign !== "function") nodeAlign = {
        left: d3Sankey.sankeyLeft,
        right: d3Sankey.sankeyRight,
        center: d3Sankey.sankeyCenter

    }[nodeAlign] ?? d3Sankey.sankeyJustify;

    // Compute values.
    let a  = d3.map(links, linkSource)
    const LS = d3.map(links, linkSource).map(intern);
    const LT = d3.map(links, linkTarget).map(intern);
    const LV = d3.map(links, linkValue);
    if (nodes === undefined) nodes = Array.from(d3.union(LS, LT), id => ({id}));
    const N = d3.map(nodes, nodeId).map(intern);
    const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);

    // Replace the input nodes and links with mutable objects for the simulation.
    nodes = d3.map(nodes, (_, i) => ({id: N[i]}));
    links = d3.map(links, (_, i) => ({source: LS[i], target: LT[i], value: LV[i]}));

    // Ignore a group-based linkColor option if no groups are specified.
    if (!G && ["source", "target", "source-target"].includes(linkColor)) linkColor = "currentColor";

    // Compute default domains.
    if (G && nodeGroups === undefined) nodeGroups = G;

    // Construct the scales.
    //const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);
    const color = G;
    let container = document.getElementById('chart2');

    // Compute the Sankey layout.
    console.log(nodeAlign);
    d3Sankey.sankey()
        .nodeId(({index: i}) => N[i])
        .nodeAlign(nodeAlign)
        .nodeWidth(nodeWidth)
        .nodePadding(nodePadding)
        .extent([[marginLeft, marginTop], [container.clientWidth - marginRight, container.clientHeight - marginBottom]])
    ({nodes, links});

    // Compute titles and labels using layout nodes, so as to access aggregate values.
    if (typeof format !== "function") format = d3.format(format);
    const Tl = nodeLabel === undefined ? N : nodeLabel == null ? null : d3.map(nodes, nodeLabel);
    const Tt = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
    const Lt = linkTitle == null ? null : d3.map(links, linkTitle);

    // A unique identifier for clip paths (to avoid conflicts).
    const uid = `O-${Math.random().toString(16).slice(2)}`;


    let svg = d3.select(id)
        .append("svg")
        .attr("width", container.clientWidth)
        .attr("height", container.clientHeight)
        .attr("viewBox", [0, 0, container.clientWidth, container.clientHeight ])
        .style("margin", "auto")
        .style("height", "100%");

    const node = svg.append("g")
        .attr("stroke", nodeStroke)
        .attr("stroke-width", nodeStrokeWidth)
        .attr("stroke-opacity", nodeStrokeOpacity)
        .attr("stroke-linejoin", nodeStrokeLinejoin)
        .selectAll("rect")
        .data(nodes)
        .join("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("opacity", d => { if (ab_path.includes(d.id)) { return 0.9 } else { return 0.2 } })
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0);

    //if (G) node.attr("fill", ({index: i}) => color(G[i]));
    if (G) node.attr("fill", ({index: i}) => color[i]);
    if (Tt) node.append("title").text(({index: i}) => Tt[i]);

    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", linkStrokeOpacity)
        .selectAll("g")
        .data(links)
        .join("g")
        .style("mix-blend-mode", linkMixBlendMode);

    if (linkColor === "source-target") link.append("linearGradient")
        .attr("id", d => `${uid}-link-${d.index}`)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", d => d.source.x1)
        .attr("x2", d => d.target.x0)
        .call(gradient => gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", ({source: {index: i}}) => color[i]))
        .call(gradient => gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", ({target: {index: i}}) => color[i]));

    link.append("path")
        .attr("d", linkPath)
        .attr("stroke", linkColor === "source-target" ? ({index: i}) => `url(#${uid}-link-${i})`
            : linkColor === "source" ? ({source: {index: i}}) => color[i]
            : linkColor === "target" ? ({target: {index: i}}) => color[i]
            : linkColor)
        .attr("stroke-width", ({width}) => Math.max(1, width))
        .attr("stroke-opacity", d => {if (ab_path.includes(d.source.id) & (ab_path.indexOf(d.source.id) != ab_path.length-1) & (ab_path[ab_path.indexOf(d.source.id)+1] == d.target.id)) { return 0.9 } else { return 0.2 } })
        .call(Lt ? path => path.append("title").text(({index: i}) => Lt[i]) : () => {});

    if (Tl) svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .selectAll("text")
        .data(nodes)
        .join("text")
        .attr("x", d => d.x0 < width / 2 ? d.x1 + nodeLabelPadding : d.x0 - nodeLabelPadding)
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
        .text(({index: i}) => Tl[i]);

    function intern(value) {
        return value !== null && typeof value === "object" ? value.valueOf() : value;

    }


}

export default {
    name: 'FlowChart',
    data() {
        return {
            ab_path: []
        };
    },
    props: {
        myFlowData: Object,
        myData: Object
    },
    mounted() {
        console.log("FlowChart: FlowData Passed down as a Prop  ", this.myFlowData);
        console.log("FlowChart: Data Passed down as a Prop  ", this.myData);
        this.ab_path = this.getcurABPath();
        this.drawSankey();
    },
    methods: {
        getcurABPath(){
            let path = [];
            this.myData.forEach((e) =>{
                let label = parseInt(e['b_count']).toString() + parseInt(e['s_count']).toString() 
                if (!path.includes(label))
                    path.push(label);
            })
            path.push(pitch_result_dict[this.myData[0]['event']])
            return path
        },
        givecolor(d){
            d=d.id;
            if (['00', '11',  '22'].includes(d)){
                return "#ebeb34"
            } else if (['10', '20', '21', '31', '30', 'H'].includes(d)){
                return "#34eb5b"
            } else if (['01', '02', '12', 'O'].includes(d)){
                return "#d63131"
            } else if (['OT', 'BB', '32'].includes(d)){
                return "#a8a399"
            }
            else {
                return "#31d6bd"
            }
        },
        givelabel(d){
            switch(d.id){
                case '00':
                    return '0-0'
                case '11':
                    return '1-1'
                case '22':
                    return '2-2'
                case '10':
                    return '1-0'
                case '20':
                    return '2-0'
                case '21':
                    return '2-1'
                case '31':
                    return '3-1'
                case '30':
                    return '3-0'
                case 'H':
                    return 'Hit'
                case '01':
                    return '0-1'
                case '02':
                    return '0-2'
                case '12':
                    return '1-2'
                case 'O':
                    return 'Out'
                case 'OT':
                    return 'Other'
                case 'BB':
                    return 'Walk'
                case '32':
                    return '3-2'
            }

        },
        drawSankey(){
            SankeyChart({ links: this.myFlowData, id: "#chart2", ab_path: this.ab_path}, 
                { nodeGroup: this.givecolor, 
                  nodeLabel: this.givelabel,
                  linkColor: "source", 
                  align: "right",
                  nodePadding: 60});
        },
    },
}

</script>
