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
            let localData = testData['data'];
            this.drawAlluvialChart(localData, "#alluvial") /* Example of reading data from a json file */
            // this.drawAlluvialChart(this.myAlluvialchartData, "#alluvial")
            console.log("Data Passed down as a Prop  ", this.myAlluvialchartData)
        },
        methods: {
            drawAlluvialChart(data, id) {

                const margin = { top: 40, right: 40, bottom: 120, left: 100 };
                const height = 400;
                const width = 600;

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
                    .attr("stroke-opacity", 0.2);

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
                    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
                    .text(d => d.id);

                // const x = d3.scaleTime()
                //     .domain(d3.extent(data, d => d3.timeParse('%Y')(d.year)))
                //     .rangeRound([margin.left, width - margin.right]);

                // const y = d3.scaleLinear()
                //     .domain([0, d3.max(data, d => d.count)]).nice()
                //     .range([height - margin.bottom, margin.top]);

                // var color = d3.scaleBand.category10;

                // let svg = d3.select(id)
                //     .attr("viewBox", [0, 0, width, height])
                //     .attr("width", width + margin.left + margin.right)
                //     .attr("height", height + margin.top + margin.bottom);

                // svg.append('path')
                //     .datum(data)
                //     .attr('fill', 'none')
                //     .attr('stroke', 'blue')
                //     .attr('stroke-width', 2)
                //     .attr('d', d3.line()
                //         .x(d => x(d3.timeParse('%Y')(d.year)))
                //         .y(d => y(d.count))
                //     );

                // svg.selectAll("rect")
                //     .data(data)
                //     .join("rect")
                //     .attr("x", d => x(d.y))
                //     .attr("y", d => y(d.x))
                //     .attr("width", x.bandwidth())
                //     .attr("height", d => y(0) - y(d.x))
                //     .attr("fill", "green");

                // const xAxis = g => g
                //     .attr("transform", `translate(0,${height - margin.bottom})`)
                //     .call(d3.axisBottom(x))

                // const yAxis = g => g
                //     .attr("transform", `translate(${margin.left},0)`)
                //     .call(d3.axisLeft(y))

                // svg.append("g")
                //     .attr("class", "x axis")
                //     .attr("transform", "translate(0," + height + ")")
                //     .call(xAxis)
                //     .selectAll("text")
                //     .style("text-anchor", "end")
                //     .attr("dx", "-.8em")
                //     .attr("dy", ".15em")
                //     .attr("transform", "rotate(-65)")
                //     .attr("font-weight", "bold");

                // svg.append("g")
                //     .call(yAxis)
                //     .call(g => g.select(".tick:last-of-type text")
                //         .clone()
                //         .attr("transform", `rotate(-90)`)
                //         .attr("text-anchor", "middle")
                //         .attr("x", -(15 - margin.top - margin.bottom) / 2)
                //         .attr("y", -80)
                //         .attr("font-weight", "bold"))

                svg.append('text')
                    .text('Sum of Attck type, Weapons, Success between 1970 and 2017')
                    .attr('y', 10)
                    .attr('x', 10)
                    .attr('font-size', 9)
            },
        }
    }

</script>


<style>
svg {
    position: inherit;
    margin: 20px 20px 20px 20px;
    width: 90%;
    height: 90%;
}
</style>