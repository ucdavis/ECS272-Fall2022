<template>
    <a-row type="flex">
        <a-col :flex="5">
            <div id="scatter"></div>
        </a-col>
        <a-col :flex="1"></a-col>
    </a-row>
</template>

<script>
    import * as d3 from "d3";

    export default {
        name: 'ScatterChart',
        data() {
            return {
                google20c: [
                    "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099",
                    "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395",
                    "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300",
                    "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"
                ]
            }
        },
        props:{
            myScatterChartData: Array,
            selectPokemon: Function,
            selectedPokemon: Object,
        },
        mounted(){
            this.drawScatterChart(this.myScatterChartData, "#scatter", 500, 450)
            console.log("Data Passed down as a Prop  ", this.myScatterChartData)
        },
        methods: {
            drawScatterChart(data, id, height, width) {
                const that = this;
                const k = height/width;
                const x = d3.scaleLinear()
                    .domain([-100, 1000])
                    .range([0, width])
                const y = d3.scaleLinear()
                    .domain([-50, 750])
                    .range([height, 0])
                const xAxis = (g, x) => g
                    .attr("transform", `translate(0,${height})`)
                    .call(d3.axisTop(x).ticks(10))
                    .call(g => g.select(".domain").attr("display", "none"))
                const yAxis = (g, y) => g
                    .call(d3.axisRight(y).ticks(10 * k))
                    .call(g => g.select(".domain").attr("display", "none"))
                const grid = (g, x, y) => g
                    .attr("stroke", "currentColor")
                    .attr("stroke-opacity", 0.1)
                    .call(g => g
                    .selectAll(".x")
                    .data(x.ticks(10))
                    .join(
                        enter => enter.append("line").attr("class", "x").attr("y2", height),
                        update => update,
                        exit => exit.remove()
                    )
                        .attr("x1", d => 0.5 + x(d))
                        .attr("x2", d => 0.5 + x(d)))
                    .call(g => g
                    .selectAll(".y")
                    .data(y.ticks(10 * k))
                    .join(
                        enter => enter.append("line").attr("class", "y").attr("x2", width),
                        update => update,
                        exit => exit.remove()
                    )
                        .attr("y1", d => 0.5 + y(d))
                        .attr("y2", d => 0.5 + y(d)));

                const zoom = d3.zoom()
                .scaleExtent([0.5, 32])
                .on("zoom", zoomed);

                const svg = d3.select(id).append("svg")
                    .attr("viewBox", [0, 0, width, height]);

                const gGrid = svg.append("g");

                const gDot = svg.append("g")
                    .attr("fill", "none")
                    .attr("stroke-linecap", "round")

                gDot.selectAll("path")
                    .data(data)
                    .join("path")
                    .attr("d", d => `M${x(d.Weight_kg)+Math.random()*0.3},${y(d.Total)+Math.random()*0.3}h0`)
                    .attr("stroke", "steelblue")
                    .on("click", function(e, d){
                        that.selectPokemon(d);
                        d3.selectAll("path").style("stroke", "steelblue")
                        d3.select(this).style("stroke", "orange");
                    })
                
                const gx = svg.append("g");

                const gy = svg.append("g");
                
                svg.call(zoom).call(zoom.transform, d3.zoomIdentity);
                
                svg.append("text")
                .style("text-anchor", "end")
                    .attr("x", width)
                    .attr("y", height - 20)
                .text("Weight(kg)");
                svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 30)
                .attr("dy", "1em")
                .style("text-anchor", "end")
                .text("Total Stats");

                function zoomed({transform}) {
                    const zx = transform.rescaleX(x).interpolate(d3.interpolateRound);
                    const zy = transform.rescaleY(y).interpolate(d3.interpolateRound);
                    gDot.attr("transform", transform).attr("stroke-width", 6 / transform.k);
                    gx.call(xAxis, zx);
                    gy.call(yAxis, zy);
                    gGrid.call(grid, zx, zy);
                }
            }
        }
    }

</script>


<style>
a {
    color:black
}
</style>