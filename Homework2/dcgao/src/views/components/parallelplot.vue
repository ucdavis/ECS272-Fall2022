<template>
    <h4>Select number of productions to show in parallel coordinates</h4>
    <a-slider id="linechart-slider" v-model:value="numSamples" :min=10 :max=800 :marks="marks" />
    <div id="parallelplot"></div>
</template>

<script>
import { DownOutlined } from '@ant-design/icons-vue';
import * as d3 from "d3";
import config from '../../config'
import utils from '../../utils'

export default {
    name: 'ParallelPlot',
    data() {
        return {
            renderData: {
                countries: [],
                stats: [],
                colors: {},
            },
            numSelected: 3,
            numSamples: 1000,
            thresholds: {
                "vote": 1000,
                "pop": 10,
                "score": 10,
                "tmdb_score": 10,
                "release_year": 1970
            },
            dimensions: [
                "vote",
                "pop",
                "score",
                "tmdb_score",
                "release_year"
            ],
            titles: [
                "Votes",
                "Popularity",
                "IMDB Score",
                "TMDB Score",
                "Release Year"
            ],
            marks: {
                10: '10',
                100: '100',
                200: '200',
                400: '400',
                600: '600',
                800: '800',
            }
        }
    },
    props: {
        csvData: Object,
    },
    components: {
        DownOutlined,
    },
    mounted() {
        this.drawChart()
    },
    watch: {
        numSamples: {
            handler() { this.drawChart(); }
        }
    },
    methods: {
        getStats() {
            if (this.renderData && this.renderData.length) {
                return {
                    ...this.renderData,
                    stats: this.renderData.slice(0, this.numSamples)
                };
            }
            let selectedCountries = utils.selectTitleData(this.csvData, this.numSelected);
            let colors = {}
            let stats = []

            selectedCountries.forEach((country, i) => {
                stats.push(...this.csvData.stats[country].filter(
                    // Thresholds for different variables
                    d => (
                        d.vote < this.thresholds["vote"] &&
                        d.pop < this.thresholds["pop"] &&
                        d.release_year >= this.thresholds["release_year"]
                    )).map(
                        d => Object.assign(d, { color: config.COLOR_SCHEME[i] })
                    ));
                colors[country] = config.COLOR_SCHEME[i];
            });
            stats = utils.shuffleArray(stats);
            this.renderData = {
                countries: selectedCountries,
                stats: stats.slice(0, this.numSamples),
                colors: colors,
            };
            return this.renderData;
        },
        drawChart() {
            let { countries, stats, colors } = this.getStats()
            const margin = { top: 30, right: 10, bottom: 10, left: 0 },
                width = 1280 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;

            d3.select("#parallelplot").select("svg").remove();
            const svg = d3.select("#parallelplot")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    `translate(${margin.left},${margin.top})`);

            const y = {}
            this.dimensions.forEach(varName => {
                y[varName] = d3.scaleLinear()
                    .domain(d3.extent(stats, d => d[varName]))
                    .range([height, 0])
            });
            y["vote"] = d3.scaleLinear()
                .domain([0, this.thresholds["vote"]])
                .range([height, 0])

            const x = d3.scalePoint()
                .range([0, width])
                .padding(1)
                .domain(this.dimensions);

            svg.selectAll("lines")
                .data(stats)
                .join("path")
                .attr("d", d => d3.line()(this.dimensions.map(varName => {
                    return [x(varName), y[varName](d[varName])];
                })))
                .style("fill", "none")
                .style("stroke", d => d.color)
                .style("opacity", 0.5)

            svg.selectAll("parallelAxis")
                .data(this.dimensions).enter()
                .append("g")
                .attr("transform", d => "translate(" + x(d) + ")")
                .each(function (d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
                .append("text")
                .style("text-anchor", "middle")
                .attr("y", -9)
                .text((_, i) => this.titles[i])
                .style("fill", "black");

            svg.append("rect")
                .style("fill", "none")
                .style("pointer-events", "all")
                .attr("width", width)
                .attr("height", height)
            svg.append("g")
                .selectAll("dots")
                .data(countries)
                .enter()
                .append("circle")
                .attr("cx", 90)
                .attr("cy", (_, i) => 90 + i * 25)
                .attr("r", 6)
                .style("fill", d => colors[d]);
            svg.selectAll("countries")
                .data(countries)
                .enter()
                .append("text")
                .attr("x", 110)
                .attr("y", function (_, i) { return 90 + i * 25 })
                .style("fill", d => colors[d])
                .text(d => d)
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle");

            // Plot title
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", 15)
                .attr("text-anchor", "middle")
                .style("font-size", "15px")
                .style("text-decoration", "underline")
                .text(`Parallel Coordinates of 5 Features of Netflix Productions in 3 Countries`);

            return svg.node();
        }
    },
}

</script>


<style>

</style>