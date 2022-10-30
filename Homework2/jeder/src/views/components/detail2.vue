<template>
    <div id="det2" style="width: 100%; height: 100%;"></div>
</template>

<script>
import * as d3 from "d3";

const margin = { top: 20, right: 20, bottom: 60, left: 40 };
const width = 500;
const height = 300;


export default {
    name: 'Detail2Chart',
    data() {
        return null;
    },
    props: {
        terrorismData: Array,
    },
    watch: {
        terrorismData: function (newVal, oldVal) {
            this.updateChart();
        }
    },
    mounted() {
        this.createChart()
    },
    methods: {
        createChart() {

            var svg = d3.select("#det2")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

            const content = svg.append("g")
                .attr("id", "content")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");



            const xScale = d3.scaleBand()
                .range([0, width - margin.right])
                .domain(this.terrorismData.map((d) => d.eventid))
                .paddingInner(0.1);

            const xzScale = d3.scaleBand()
                .domain(["nkill", "nwound"])
                .range([0, xScale.bandwidth()])
                .padding(0.05);


            const yScale = d3.scaleLinear()
                .domain([0, d3.max(this.terrorismData, (d) => {
                    let nkill = parseInt(d.nkill) || 0;
                    let nwound = parseInt(d.nwound) || 0;
                    return Math.max(nkill, nwound);
                })])
                .range([height - margin.bottom - margin.top, 0]);

            let xAxis = d3.axisBottom(xScale);
            let yAxis = d3.axisLeft(yScale).ticks(10);

            content.append("g")
                .attr("class", "xAxis")
                .attr("transform", "translate(0," + (height - margin.bottom - margin.top) + ")")
                .call(xAxis);

            content.append("g")
                .attr("class", "yAxis")
                .call(yAxis);


            content.append("rect").attr("x", 50).attr("y", 244).attr("width", 8).attr("height", 8).style("fill", "#B22222")
            content.append("text").attr("x", 65).attr("y", 250).text("Killed").style("font-size", "12px").attr("alignment-baseline", "middle")
            content.append("rect").attr("x", 200).attr("y", 244).attr("width", 8).attr("height", 8).style("fill", "#F4A460")
            content.append("text").attr("x", 215).attr("y", 250).text("Wounded").style("font-size", "12px").attr("alignment-baseline", "middle")

            content.append("text")
                .attr("x", -120)
                .attr("y", -30)
                .text("PAX")
                .style("font-size", "12px")
                .attr("alignment-baseline", "middle")
                .attr("transform", "rotate(-90)");



        },

        updateChart() {

            console.log("Drawing: " + this.terrorismData.length);


            const svg = d3.select("#det2").select("svg");
            const content = svg.select("#content");

            // Update the Axis

            const xScale = d3.scaleBand()
                .range([0, width - margin.right])
                .domain(this.terrorismData.map((d) => d.eventid))
                .paddingInner(0.1);

            const xzScale = d3.scaleBand()
                .domain(["nkill", "nwound"])
                .range([0, xScale.bandwidth()])
                .padding(0.05);

            const max = d3.max(this.terrorismData, (d) => {
                let nkill = parseInt(d.nkill) || 0;
                let nwound = parseInt(d.nwound) || 0;
                return Math.max(nkill, nwound);
            });
            // console.log("max: " + max);

            const yScale = d3.scaleLinear()
                .domain([0, max])
                .range([height - margin.bottom - margin.top, 0]);


            let xAxis = d3.axisBottom(xScale)
                .tickFormat((d) => ""); // No labels -> would make the diagramm to crowded
            let yAxis = d3.axisLeft(yScale)
                .ticks(10);

            content.selectAll("g.yAxis")
                .call(yAxis)

            content.selectAll("g.xAxis")
                .call(xAxis)


            //kill
            content.selectAll(".rectKill")
                .data(this.terrorismData)
                .join("rect")
                .attr("class", "rectKill")
                .attr("x", (d) => xScale(d.eventid) + xzScale("nkill"))
                .attr("y", (d) => yScale(d.nkill))
                .attr("width", xzScale.bandwidth())
                .attr("height", (d) => height - margin.bottom - margin.top - yScale(d.nkill))
                .attr("fill", "#B22222");

            //wound
            content.selectAll(".rectWound")
                .data(this.terrorismData)
                .join("rect")
                .attr("class", "rectWound")
                .attr("x", (d) => xScale(d.eventid) + xzScale("nwound"))
                .attr("y", (d) => yScale(d.nwound))
                .attr("width", xzScale.bandwidth())
                .attr("height", (d) => height - margin.bottom - margin.top - yScale(d.nwound))
                .attr("fill", "#F4A460");
            // this.terrorismData.map(d => {
            //     console.log(d.nkill + " " + d.nwound);
            // });


        },
    }
}

</script>


<style>

</style>