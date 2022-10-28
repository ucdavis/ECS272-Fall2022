<template>
    <div id="overviewChart"></div>
</template>

<script>
import * as d3 from "d3";
import world from '../../assets/data/countries-50m.json';
import * as topojson from "topojson-client"
import { countryNameMap } from '../pages/home.vue'

const width = 500;
const height = 300;

// const projection = d3.geoEqualEarth();
let projection = d3.geoMercator()
    .scale(width / 2.5 / Math.PI)
    .translate([width / 2, height / 2]);

let k = 1;

export default {
    name: 'OverviewChart',

    data() {
        return {
            childCountrieFilter: null,
            childSelectedIncident: null,
        };
    },
    props: {
        terrorismData: Array,
        countrieFilter: String,
        selectedIncident: Object,
    },
    watch: {
        terrorismData: function (newVal, oldVal) {
            // console.log('Prop changed: ', newVal.length, ' | was: ', oldVal.length);
            this.updateChart();
            this.testDataMap();
        },
        selectedIncident: function (newVal, oldVal) {
            this.updateChart();
        }
    },
    mounted() {
        this.createChart();
    },
    methods: {
        testDataMap() {
            console.log("Testing Contry Names...")
            const countries = topojson.feature(world, world.objects.countries)

            this.terrorismData.forEach(t => {
                let found = false
                const mapedVal = countryNameMap.has(t.country_txt) ? countryNameMap.get(t.country_txt) : t.country_txt;
                countries.features.forEach(c => {

                    if (c.properties.name === mapedVal) {
                        found = true;
                    }
                });
                if (found == false) {
                    console.log("Couldnt Match: " + t.country_txt + " please add to maping manualy");
                }
            });

        },

        createChart() {
            var active = d3.select(null);

            const countries = topojson.feature(world, world.objects.countries)
            const countrymesh = topojson.mesh(world, world.objects.countries, (a, b) => a !== b)

            // Construct a path generator.
            const path = d3.geoPath(projection);

            let zoomed = function (event) {
                k = event.transform.k;
                g.style("stroke-width", 1.5 / k + "px");
                g.attr("transform", event.transform); // updated for d3 v4
                g.selectAll(".dot").attr("r", 4 / k + "px");
            }
            let zoom = d3.zoom().on("zoom", zoomed);

            let stopped = function (event) {
                if (event.defaultPrevented) event.stopPropagation();
            }
            let reset = function () {
                active.classed("active", false);
                active = d3.select(null);

                svg.transition()
                    .duration(750)
                    // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
                    .call(zoom.transform, d3.zoomIdentity); // updated for d3 v4

                context.childCountrieFilter = null;
                context.childSelectedIncident = null;
                context.$emit('update:countrieFilter', context.childCountrieFilter);
                context.$emit('update:selectedIncident', context.childSelectedIncident);


            }

            let svg = d3.select("#overviewChart").append("svg")
                .attr("width", width)
                .attr("height", height)
                // .attr("viewBox", [0, 0, width * 2, height * 2])
                .on("click", stopped, true);


            svg.append("rect")
                .attr("class", "background")
                .attr("width", width)
                .attr("height", height)
                .attr("fill", "#e6e6e6")
                .on("click", reset);

            let context = this; // for avoidng this context problems
            let clickedCountrie = function (event, d) {

                if (active.node() === this)
                    return reset();

                active.classed("active", false);
                active = d3.select(this).classed("active", true);

                var bounds = path.bounds(d),
                    dx = bounds[1][0] - bounds[0][0],
                    dy = bounds[1][1] - bounds[0][1],
                    x = (bounds[0][0] + bounds[1][0]) / 2,
                    y = (bounds[0][1] + bounds[1][1]) / 2,
                    scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
                    translate = [width / 2 - scale * x, height / 2 - scale * y];

                svg.transition()
                    .duration(750)
                    .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));

                this.childCountrieFilter = d.properties.name;
                this.childSelectedIncident = null;
                context.$emit('update:countrieFilter', this.childCountrieFilter);
                context.$emit('update:selectedIncident', this.childSelectedIncident);

            }


            let mouseOver = function (event, d) {
                // console.log(d.properties.name);
                d3.select("#filter_country")
                    .text("Country: " + d.properties.name);


                d3.selectAll(".Country")
                    .transition()
                    .duration(200)
                    .style("opacity", .8)
                    .style("stroke", "white");

                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 1)
                    .style("stroke", "black")
            }

            let mouseLeave = function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", .8)
                    .style("stroke", "white");

            }

            let g = svg.append("g");

            svg.call(zoom); // delete this line to disable free zooming

            g.selectAll("path")
                .data(countries.features)
                .join("path")
                .attr("fill", "grey")
                .style("stroke", "white")
                .style("opacity", .8)
                .attr("class", "Country")
                .attr("d", path)
                .on("mouseover", mouseOver)
                .on("mouseleave", mouseLeave)
                .on("click", clickedCountrie);

            let legend = svg.append("g")
                .attr("id", "legendContainer");

            legend.append("text")
                .attr("id", "legendKillMin")
                .text("0")
                .attr("x", 2)
                .attr("y", 295)
                .style("font-size",12);

            legend.append("text")
                .attr("id", "legendKillMax")
                .text("100")
                .attr("x", 2)
                .attr("y", 20)
                .style("font-size",12);


            g.append("g")
                .attr("id", "dotsContainer");

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

            let interpolator = d3.interpolate("#FFFFFF", "#B22222");
            let colorScale = d3.scaleSequential(interpolator)
                .domain([0, max]);

            let data = Array.from(Array(100).keys());
            let cScale = d3.scaleSequential()
                .interpolator(interpolator)
                .domain([0, 99]);

            let xScale = d3.scaleLinear()
                .domain([99, 0])
                .range([0, 250]);

            svg.select("#legendContainer")
                .selectAll("rect")
                .data(data)
                .join("rect")
                .attr("x", 0)
                .attr("y", (d) => Math.floor(xScale(d)) + 25)
                .attr("height",  (d) => {
                    if (d == 99) {
                        return 6;
                    }
                    return - Math.floor(xScale(d + 1)) + Math.floor(xScale(d)) + 2;
                })
                .attr("width", 20)
                .attr("fill", (d) => cScale(d));

            const context = this; //avoid this problems

            const dot = g.selectAll("circle")
                .data(this.terrorismData)
                .join("circle")
                .attr("transform", d => `translate(${projection([d.longitude, d.latitude])})`)
                .attr("r", d => {                
                    return 4 / k + "px";
                })                
                .attr("class", "dot")
                .attr("fill", d => {
                    if (this.selectedIncident && d.eventid == this.selectedIncident.eventid) {
                        return "blue"
                    }
                    return colorScale(d.nkill)
                })
                .style("stroke", d => {
                    if (this.selectedIncident && d.eventid == this.selectedIncident.eventid) {
                        return "white"
                    }
                    return "black";
                })
                .style("opacity", d => {
                    if (this.selectedIncident && d.eventid == this.selectedIncident.eventid) {
                        return 1
                    }
                    return .6;
                })
                .on("click", (event) => {
                    const datum = event.target.__data__;
                    context.childSelectedIncident = datum;
                    context.$emit('update:selectedIncident', context.childSelectedIncident);
                })

        },
    }
}

</script>


<style>

</style>