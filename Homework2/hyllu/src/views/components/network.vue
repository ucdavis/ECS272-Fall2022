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
                    node.push(node_tmp);
                    link.push(link_tmp);
                });
                // console.log(node);
                // console.log(link);
                this.nodes = node;
                this.links = link;
            },

            drawNetwork(nodes, links, id, selection) {

                const margin = { top: 20, right: 50, bottom: 20, left: 5 };
                // const height = 300;
                // const width = 500;

                let width  = 700;
                let height = 700;

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
                }) => N[i]);

                d3.selectAll(".layout").remove();
                let svg = d3.select(id).append("svg")
                    .attr("class", "layout")
                    .attr('viewBox', [-width / 2, -height / 2, width, height])
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
                    .join('circle');

                const simulation = d3.forceSimulation(nodes)
                    .force('link', forceLink)
                    .force("link", d3.forceLink().distance(5).strength(0.8))
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
                }) => color(G[i]+7));
                if (S) node.attr('r', ({
                    index: i
                }) => S[i]);
                if (T) node.append('title').text(({
                    index: i
                }) => T[i]);

                let invalidation = new Promise((resolve, reject) => { // when this promise resolves, stop the simulation
                    setTimeout(() => {
                    resolve();
                    }, 8000) // simulation will be stopped after 8 sec
                });
                if (invalidation != null) invalidation.then(() => simulation.stop());

                return Object.assign(svg.node(), {scales: {color}});
            }
        }
    }

</script>


<style>

</style>