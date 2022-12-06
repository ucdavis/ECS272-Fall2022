<template>
    <div  class="pieChartContainer" :id="myChartID">
        <svg></svg>
    </div>
</template>

<script>
import * as d3 from "d3";
//import { piefunction } from "./myTestFunction"

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
            width: 300,
            height: 300,
        }
    },
    props: {
        myPieData: Array,
        myChartID: String,
    },
    created() {
        /* we DO NOT have access to the HTML in Template */
        // MAYBE DATA PROCESSING OR FETCHING DATA HERE
        //piefunction();
    },
    mounted() {
        /* We have access to our HTML defined in Template*/
        // D3 CODE CALLED HERE\
        //console.log("Piedata", this.myPieData);
        this.init(this.myPieData);
        this.drawPie(this.myPieData);

    },
    watch:{
        myPiedata(newval, oldval){
            //console.log("New sundata", newval)
            
            //console.log("Data Passed down as a Prop  ", sundata)
            //this.init(newval);
            this.drawPie(newval);
        }
    },
    methods: {
        init(data) {
            let id = '#'+this.myChartID;
            const radius = Math.min(this.width, this.height) / 2 * 0.8;
            this.arc =  d3.arc()
                        .innerRadius(radius*0.4).outerRadius(radius);

            this.color = d3.scaleOrdinal()
                        .domain(data.map(d => d.date))
                        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())
           
            this.pie =  d3.pie()
                    .sort(null)
                    .value(d => d.count)
            
            
            this.arcLabel = d3.arc().innerRadius(radius*0.4).outerRadius(radius)

            let svg = d3.select(id).select("svg").attr("viewBox", [0, 0, this.width, this.height]);
            svg.append("g").attr("id", this.myChartID+"pieGroup").attr("transform", `translate(${this.width / 2},${this.height / 2})`)
            svg.append("g").attr("id", this.myChartID+"pieLabelGroup").attr("transform", `translate(${this.width / 2},${this.height / 2})`)
        },
        drawPie(data) {
            let id = '#'+this.myChartID;
            let arcs = this.pie(data);
            let svg = d3.select(id+"pieGroup");

            let vueThis = this;
            svg.attr("stroke", "white")
                .selectAll("path")
                .data(arcs)
                .join("path")
                .attr("fill", d => this.color(d.data.date))
                .attr("d", this.arc);
                //.on("click",function(e,d,i){
                //    console.log("CLICKED THIS", e,d,i)
                //    vueThis.$emit("TellParentSTuff", d)
                //});
                
            let sum = d3.sum(data, d => d.count);
            console.log("SUM", sum)
            d3.select(id+"pieLabelGroup")
                .attr("font-family", "sans-serif")
                .attr("font-size", "10px")
                .attr("text-anchor", "middle")
                .selectAll("text")
                .data(arcs)
                .join("text")
                .attr("transform", d => `translate(${this.arcLabel.centroid(d)})`)
                //.selectAll("tspan")
                //.join("tspan")
                //.attr("x", 0)
                //.attr("y", (_, i) => `${i * 1.1}em`)
                //.attr("font-weight", (_, i) => i ? null : "bold")
                .text(function (d) { return d.data.date+":"+(d.data.count / sum * 100).toFixed(2) + "%"; })
                .on("mouseover", function(d) {
                    d3.select(this)
                    .transition()
                    .duration(100)
                    .attr("font-size", "18px")
                })
                .on("mouseout", function(d) {
                    d3.select(this)
                    .transition()
                    .duration(100)
                    .attr("font-size", "10px")
                });
        }
    }
}
</script>

<style scoped>
.pieChartContainer {
    background-color: white;
    height: 80%;
    width: 80%;
}
</style>