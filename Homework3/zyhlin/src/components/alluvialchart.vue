<template>
    <svg id="alluvial"></svg>
</template>

<script>
    import * as d3 from "d3";
    import * as d3Sankey from "d3-sankey"
    import testData from "../assets/third_chart.json"; /* Example of reading in data direct from file*/

    export default {
        name: 'AlluvialChart',
        data() {
            return {
                name: 'Hello',
                someLocalValues: [1, 2, 3, 4, 5],

            }
        },
        props:{
            myAlluvialchartData: Array,
        },
        mounted(){
            let localData = testData;
            this.pick_data(localData, "#alluvial", this.drawAlluvialChart)
            // this.drawAlluvialChart(this.myAlluvialchartData, "#alluvial")
            console.log("Data Passed down as a Prop  ", this.myAlluvialchartData)
        },
        methods: {
            drawAlluvialChart(dset, id) {

                const margin = { top: 20, right: 20, bottom: 20, left: 20 };
                const height = 350;
                const width = 700;

                const data = dset['data']

                const sk = d3Sankey
                    .sankey()
                    .size([width, height])
                    .nodeId(d => d.id)
                    .nodeWidth(20)
                    .nodePadding(10)
                    .nodeAlign(d3Sankey.sankeyCenter);

                const svg = d3.select(id)

                
                let graph = sk(data)
                var colors = d3.scaleOrdinal(d3.schemeCategory10).domain(graph.nodes)

                let links = svg
                    .append("g")
                    .classed("links", true)
                    .selectAll("path")
                    .data(graph.links)
                    .enter()
                    .append("path")
                    .classed("link", true)
                    .attr("d", d3Sankey.sankeyLinkHorizontal())
                    .attr("fill", "none")
                    .attr("stroke", "#606060")
                    .attr("stroke-width", d => d.width)
                    .attr("stroke-opacity", 0.2)      
                    .attr('id', (d) => 'g-link-' + d.index)                             
                    .on('mouseover', (e, d) => {
                        d3.select(e.currentTarget)
                            .attr('stroke-opacity', 0.1)
                    })
                    .on('mouseleave', (e, d) => {
                        d3.select(e.currentTarget)
                            .attr('stroke-opacity', 0.2)
                    });

                let nodes = svg
                    .append("g")
                    .classed("nodes", true)
                    .selectAll("rect")
                    .data(graph.nodes)
                    .enter()
                    .append("rect")
                    .classed("node", true)
                    .attr("x", d => d.x0)
                    .attr("y", d => d.y0)
                    .attr("width", d => d.x1 - d.x0)
                    .attr("height", d => d.y1 - d.y0)
                    .attr("fill", d => colors(d.id))
                    .attr("opacity", 0.8);

                svg.append("g")
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 10)
                    .selectAll("text")
                    .data(graph.nodes)
                    .join("text")
                    .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
                    .attr("y", d => (d.y1 + d.y0) / 2)
                    .attr("dy", "0.35em")
                    .attr('font-size', 8)
                    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
                    .text(d => d.id);
                    
            },

            pick_data(dset, id, cb) {
                var input_option = 400
                var filtered_data = dset[input_option]

                const select_button = d3.select('#selectButton_chart3')
                    .selectAll('myOptions')
                    .data(dset.thresholds)
                    .enter()
                    .append('option')
                    .text(d => d)
                    .attr('value', d => d)

                d3.select("#selectButton_chart3").on("change", function(e, d) {
                    const input_option = d3.select(this).property("value")
                    update(input_option)
                })
                
                function update(input_option) {
                    filtered_data = dset[input_option]
                    d3.select('#alluvial').selectAll('g').remove()
                    d3.select('#alluvial').selectAll('text').remove()
                    cb(filtered_data, id)
                    
                }
                cb(dset[input_option], id)
            }

        }
    }

</script>


<style>
svg {
    position: inherit;
    margin: 20px 20px 20px 20px;
    width: 100%;
    height: 100%;
}
</style>