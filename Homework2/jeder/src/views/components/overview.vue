<template>
    <div id="overviewChart"></div>
</template>

<script>
import * as d3 from "d3";
import world from '../../assets/data/countries-50m.json';
import * as topojson from "topojson-client"

const projection = d3.geoEqualEarth();

export default {
    name: 'OverviewChart',

    data() {
        return null;
    },
    props: {
        terrorismData: Array,
    },
    watch: {
        terrorismData: function (newVal, oldVal) {
            // console.log('Prop changed: ', newVal.length, ' | was: ', oldVal.length);
            this.updateChart();
        }
    },
    mounted() {
        this.createChart()
    },
    methods: {

        createChart() {
            const width = 500;
            const height = 300;
            const countries = topojson.feature(world, world.objects.countries)
            const countrymesh = topojson.mesh(world, world.objects.countries, (a, b) => a !== b)

            // Construct a path generator.
            const path = d3.geoPath(projection);

            let svg = d3.select("#overviewChart").append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [0, 0, width * 2, height * 2]);

            svg.append("g")
                .selectAll("path")
                .data(countries.features)
                .join("path")
                .attr("fill", "grey")
                .attr("d", path)
                .on("mouseover", (event) => {
                    const datum = event.target.__data__;
                    // console.log(datum.properties.name);
                    d3.select("#filter_country")
                        .text("Country: " + datum.properties.name)
                });

            let legend = svg.append("g")
                .attr("id", "legendContainer");

            legend.append("text")
                .attr("id", "legendKillMin")
                .text("0")
                .attr("x", 185)
                .attr("y", 515);

            legend.append("text")
                .attr("id", "legendKillMax")
                .text("100")
                .attr("x", 790)
                .attr("y", 515);

            svg.append("g")
                .attr("id", "dotsContainer")
                .attr("stroke", "black");

        },
        updateChart() {

            // console.log("Drawing: " + this.terrorismData.length);

            // inspired by: https://observablehq.com/@mbostock/walmarts-growth
            // and: https://observablehq.com/@d3/world-choropleth

            let svg = d3.select("#overviewChart").select("svg");

            const g = svg.select("#dotsContainer");



            // LEGEND
            const max = d3.max(this.terrorismData, (d) => {
                let nkill = parseInt(d.nkill) || 0;
                return nkill;
            });

            svg.select("#legendContainer")
                .select("#legendKillMax")
                .text(max);

            let interpolator = d3.interpolate("#F4A460", "#B22222");
            let colorScale = d3.scaleSequential(interpolator)
                .domain([0, max]);

            let data = Array.from(Array(100).keys());
            let cScale = d3.scaleSequential()
                .interpolator(interpolator)
                .domain([0, 99]);

            let xScale = d3.scaleLinear()
                .domain([0, 99])
                .range([0, 580]);

            svg.select("#legendContainer")
                .selectAll("rect")
                .data(data)
                .join("rect")
                .attr("x", (d) => Math.floor(xScale(d)) + 200)
                .attr("y", 500)
                .attr("height", 20)
                .attr("width", (d) => {
                    if (d == 99) {
                        return 6;
                    }
                    return Math.floor(xScale(d + 1)) - Math.floor(xScale(d)) + 1;
                })
                .attr("fill", (d) => cScale(d));



            const dot = g.selectAll("circle")
                .data(this.terrorismData)
                .join("circle")
                .attr("transform", d => `translate(${projection([d.longitude, d.latitude])})`)
                .attr("r", 7)
                .attr("fill", d => colorScale(d.nkill))
                .on("click", (event) => {
                    const datum = event.target.__data__;
                    d3.select("#detail1_country")
                        .text("Country: " + datum.country_txt)
                    d3.select("#detail1_city")
                        .text("City: " + datum.city);
                    d3.select("#kill_wound")
                        .text("Kiled/Wounded: " + datum.nkill + "/" + datum.nwound);
                    d3.select("#detail1_summary")
                        .text("Summary: " + datum.summary);

                })

        },
    }
}

</script>


<style>

</style>