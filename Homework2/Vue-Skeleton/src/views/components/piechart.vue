<template>
    <div id="pieWrapper" class="pieChartContainer">
        <svg id="myPieChart" :height="height" :width="width"> </svg>
    </div>
</template>

<script>
import * as d3 from "d3";
import { piefunction } from "./myTestFunction"

export default {
    name: 'PieChart',
    componets: {},
    data() {
        return {
            pieData: [
                {date: 1910, count: 14},
                {date: 1920, count: 20},
                {date: 1930, count: 42},
                {date: 1940, count: 94},
                {date: 1950, count: 344},
                {date: 1960, count: 54},
                {date: 1970, count: 124}
            ],
            arc: null,
            arcs: [],
            color: null,
            pie: null,
            arcLabel: null,
            width: 500,
            height: 500,
        }
    },
    props: {
        myPieData: Array,
    },
    created() {
        /* we DO NOT have access to the HTML in Template */
        // MAYBE DATA PROCESSING OR FETCHING DATA HERE
        piefunction();
    },
    mounted() {
        /* We have access to our HTML defined in Template*/
        // D3 CODE CALLED HERE\
        this.init(this.pieData);
        this.drawPie(this.pieData);
    },
    methods: {
        init(data) {
            this.arc =  d3.arc()
                        .innerRadius(20)
                        .outerRadius(Math.min(this.width, this.height) / 2 - 1)

            this.color = d3.scaleOrdinal()
                        .domain(data.map(d => d.date))
                        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())
           
            this.pie =  d3.pie()
                    .sort(null)
                    .value(d => d.count)
            
            const radius = Math.min(this.width, this.height) / 2 * 0.8;
            this.arcLabel = d3.arc().innerRadius(radius).outerRadius(radius)

            let svg = d3.select("#myPieChart");
            svg.append("g").attr("id", "pieGroup").attr("transform", `translate(${this.width / 2},${this.height / 2})`)
            svg.append("g").attr("id", "pieLabelGroup")
        },
        drawPie(data) {
            let arcs = this.pie(data);
            let svg = d3.select("#pieGroup");

            let vueThis = this;
            svg.attr("stroke", "white")
                .selectAll("path")
                .data(arcs)
                .join("path")
                .attr("fill", d => this.color(d.data.date))
                .attr("d", this.arc)
                .on("click",function(e,d,i){
                    console.log("CLICKED THIS", e,d,i)
                    vueThis.$emit("TellParentSTuff", d)
                });


            d3.select("pieLabelGroup")
                .attr("font-family", "sans-serif")
                .attr("font-size", 17)
                .attr("text-anchor", "middle")
                .selectAll("text")
                .data(arcs)
                .join("text")
                .attr("transform", d => `translate(${this.arcLabel.centroid(d)})`)
                .text(function (d) { return d.data.date });
        }
    }
}
</script>

<style scoped>
.pieChartContainer {
    background-color: grey;
    height: 100%;
}
</style>