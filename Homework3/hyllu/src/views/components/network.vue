<template>
    <div id="network"></div>
</template>

<script>
    import * as d3 from "d3";
    import { object } from "vue-types";

    export default {
        name: 'Network',
        data() { // pass data to others
            return {
                prepared_data: undefined,
                colorScale: undefined,
                nodes: undefined,
                links: undefined
            }
        },
        props:{ // received data from others
            myData: Array,
            mySelection: Object //focused singer (eg. taylor swift)
        },
        watch: { 
            mySelection: function(newVal, oldVal) { // watch it
                this.prepareData(this.myData, this.mySelection);
                this.drawNetwork(this.nodes, this.links, "#network", this.mySelection);
            }
        },
        mounted(){ // actually drawing
            this.prepareData(this.myData, this.mySelection);
            this.drawNetwork(this.nodes, this.links, "#network", this.mySelection);
        },
        methods: {
            prepareData(data, selection) {
                let node = [];
                let link = [];
                let hop_1 = {};
                let hop_2 = {};
                let hop_1_weight = {};
                let hop_1_size = {};
                let count = 1;
                console.log("In network: ", selection.id + selection.text);
                data.forEach(element => {
                    let artist = element.artists.split('\'');
                    let musician_log = [];
                    let flag = false;
                    for (let i=0; i<artist.length; i++){
                        if (artist[i]===selection.text){
                            flag = true;
                            hop_1[selection.text] = 0;
                        }
                        else if (artist[i][0]!='[' && artist[i][0]!=']' && artist[i][0]!=','){
                            musician_log.push(artist[i]);
                        }
                    }
                    if (flag === true && musician_log.length>0){
                        for (let tmp=0; tmp<musician_log.length; tmp++){
                            if (musician_log[tmp] in hop_1){
                                hop_1_weight[musician_log[tmp]] += 1;
                            }
                            else {
                                hop_1[musician_log[tmp]] = count;
                                hop_1_weight[musician_log[tmp]] = 1;
                                hop_1_size[musician_log[tmp]] = 1;
                                count += 1;
                            }
                            data.forEach(hop2 => {
                                let artist_hop2 = hop2.artists.split('\'');
                                let musician_log_hop2 = [];
                                let flag_hop2 = false;
                                for (let i=0; i<artist_hop2.length; i++){
                                    if (artist_hop2[i]===musician_log[tmp]){
                                        flag_hop2 = true;
                                    }
                                    else if (artist_hop2[i][0]!='[' && artist_hop2[i][0]!=']' && artist_hop2[i][0]!=','){
                                        musician_log_hop2.push(artist_hop2[i]);
                                    }
                                }
                                if (flag_hop2 === true && musician_log_hop2.length>0){
                                    for (let tmp_hop2=0; tmp_hop2<musician_log_hop2.length; tmp_hop2++){
                                        if (musician_log_hop2[tmp_hop2] in hop_1);
                                        else if (musician_log_hop2[tmp_hop2] in hop_2);
                                        else {
                                            hop_2[musician_log_hop2[tmp_hop2]] = count;
                                            hop_1_size[musician_log[tmp]] += 1;
                                            count += 1;
                                        }
                                    }
                                }
                            });
                        }
                    }
                });

                // console.log(hop_1);
                // console.log(hop_1_weight);
                // console.log(hop_1_size);

                let dropdown_update = []
                let update_count = 1
                dropdown_update.push({
                    id: 0,
                    name: selection.text
                });
                node.push({
                    id: 0,
                    size: Object.keys(hop_1_weight).length,
                    title: selection.text,
                    group: 0
                });
                Object.keys(hop_1_weight).forEach(element => {
                    const node_tmp = {
                        id: hop_1[element],
                        size: hop_1_size[element],
                        title: element,
                        group: 1
                    }
                    const link_tmp = {
                        source: 0,
                        target: hop_1[element],
                        weight: hop_1_weight[element]
                    }
                    const update_tmp = {
                        id: update_count,
                        name: element
                    }
                    node.push(node_tmp);
                    link.push(link_tmp);
                    dropdown_update.push(update_tmp);
                    update_count += 1;
                });
                // console.log(node);
                // console.log(link);
                this.nodes = node;
                this.links = link;
                this.$emit('dropdownChange', dropdown_update);
            },

            drawNetwork(nodes, links, id, selection) {

                const forEmitThis = this;

                let flag_dbclick_node = false;
                let select_node = "rgb(255, 255, 255)";
                let select_singer = undefined;
                const margin = { top: 20, right: 5, bottom: 50, left: 5 };
                // const height = 300;
                // const width = 500;

                let width  = d3.select(id).node().getBoundingClientRect().width;
                let height = d3.select(id).node().getBoundingClientRect().width;

                const intern = (value) => value !== null && typeof value === 'object' ? value.valueOf() : value;

                // Compute values.
                const N = d3.map(nodes, d => d.id);
                const LS = d3.map(links, d => d.source);
                const LT = d3.map(links, d => d.target);
                const T = d3.map(nodes, d => d.title);
                const G = d3.map(nodes, d => d.group);
                const S = d3.map(nodes, d => d.size);
                const W = d3.map(links, d => d.weight);
                console.log(S);

                // Replace the input nodes and links with mutable objects for the simulation.
                nodes = d3.map(nodes, (_, i) => ({
                    id: N[i]
                }));
                links = d3.map(links, (_, i) => ({
                    source: LS[i],
                    target: LT[i]
                }));

                // Compute default domains.
                let nodeGroups = d3.sort(G);

                // Construct the scales.
                const color = d3.scaleOrdinal(nodeGroups, d3.schemeTableau10);

                // Construct the forces.
                const forceNode = d3.forceManyBody();
                const forceLink = d3.forceLink(links).id(({
                    index: i
                }) => N[i]).distance(120);

                d3.selectAll(".layout").remove();
                let svg = d3.select(id).append("svg")
                    .attr("class", "layout")
                    .attr('viewBox', [-width / 2 - margin.left, -height / 2 - margin.top, width, height])
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);

                const link = svg.append('g')
                    .attr('stroke', '#999')
                    .attr('stroke-opacity', 0.6)
                    .attr('stroke-linecap', 'round')
                    .selectAll('line')
                    .data(links)
                    .join('line');

                const node = svg.append('g')
                    .attr('stroke', '#fff')
                    .attr('stroke-opacity', 1)
                    .attr('stroke-width', 1.5)
                    .selectAll('circle')
                    .data(nodes)
                    .join('circle')
                    .on("click", nodeclick)
                    .on("dblclick", nodedbclick);

                function nodeclick(){
                    if (flag_dbclick_node==false && select_node==="rgb(0, 255, 0)"){
                        d3.select(this).transition()
                            .duration('50')
                            .attr('stroke', "rgb(255, 255, 255)");
                    }
                };

                function nodedbclick(){
                    console.log(d3.select(this).select('title').text());
                    if (flag_dbclick_node==false){
                        flag_dbclick_node = true;
                        let cx_tmp = this.getAttribute('cx');
                        let cy_tmp = this.getAttribute('cy');
                        d3.select(this).transition()
                            .duration('50')
                            .attr('stroke', '#0f0');
                        svg.append("text")
                            .attr("x", cx_tmp)
                            .attr("y", cy_tmp)
                            .attr("class", "click_select")
                            .text(d3.select(this).select('title').text())
                            .style("font-size", "12px")
                            .style("opacity", 1);
                        select_node = "rgb(0, 255, 0)";
                        select_singer = d3.select(this).select('title').text();
                        console.log(select_node, select_singer);
                        forEmitThis.$emit('selectSingerChange', select_singer);
                    }
                    else if (this.getAttribute('stroke')===select_node){
                        d3.select(this).transition()
                            .duration('50')
                            .attr('stroke', '#fff');
                        d3.selectAll(".click_select").remove();
                        select_node = "rgb(255, 255, 255)";
                        flag_dbclick_node = false;
                        select_singer = undefined;
                        console.log(select_node, select_singer);
                        forEmitThis.$emit('selectSingerChange', select_singer);
                    }
                };

                const simulation = d3.forceSimulation(nodes)
                    .force('link', forceLink)
                    .force('charge', forceNode)
                    .force('center', d3.forceCenter())
                    .on('tick', () => {
                    link
                        .attr('x1', d => d.source.x)
                        .attr('y1', d => d.source.y)
                        .attr('x2', d => d.target.x)
                        .attr('y2', d => d.target.y);
                    node
                        .attr('cx', d => d.x)
                        .attr('cy', d => d.y);
                    });

                const drag = (simulation) => {
                    const dragstarted = event => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    if (invalidation != null) invalidation.then(() => simulation.stop());
                        event.subject.fx = event.subject.x;
                        event.subject.fy = event.subject.y;
                    }

                    const dragged = event => {
                        event.subject.fx = event.x;
                        event.subject.fy = event.y;
                    }

                    const dragended = event => {
                        if (!event.active) simulation.alphaTarget(0);
                        event.subject.fx = null;
                        event.subject.fy = null;
                    }

                    return d3.drag()
                        .on('start', dragstarted)
                        .on('drag', dragged)
                        .on('end', dragended);
                }

                node.call(drag(simulation));

                if (W) link.attr('stroke-width', ({
                    index: i
                }) => W[i]);
                if (G) node.attr('fill', ({
                    index: i
                }) => color(G[i]+5));
                if (S && d3.max(S)<30) node.attr('r', ({
                    index: i
                }) => S[i]+3);
                else if (S) node.attr('r', ({
                    index: i
                }) => S[i]/10+3);
                if (T) node.append('title').text(({
                    index: i
                }) => T[i]);

                let invalidation = new Promise((resolve, reject) => { // when this promise resolves, stop the simulation
                    setTimeout(() => {
                    resolve();
                    }, 8000) // simulation will be stopped after 8 sec
                });
                if (invalidation != null) invalidation.then(() => simulation.stop());

                // add lengend for chosen colors.
                svg.append("circle")
                    .attr("cx", -width/2 + 10)
                    .attr("cy", -height/2 - 15)
                    .attr("r", 8)
                    .style("fill", color(5))
                svg.append("circle")
                    .attr("cx", -width/2 + 120)
                    .attr("cy", -height/2 - 15)
                    .attr("r", 8)
                    .style("fill", color(6))

                svg.append("text")
                    .attr("x", -width/2 + 20)
                    .attr("y", -height/2 - 35)
                    .text("Center: " + selection.text)
                    .style("font-size", "12px")
                    .attr("alignment-baseline","middle")
                svg.append("text")
                    .attr("x", -width/2 + 20)
                    .attr("y", -height/2 - 14)
                    .text("Center Singer")
                    .style("font-size", "12px")
                    .attr("alignment-baseline","middle")
                svg.append("text")
                    .attr("x", -width/2 + 130)
                    .attr("y", -height/2 - 14)
                    .text("Collaborated Singers with Center")
                    .style("font-size", "12px")
                    .attr("alignment-baseline","middle")

                return Object.assign(svg.node(), {scales: {color}});
            }
        }
    }

</script>


<style>

</style>