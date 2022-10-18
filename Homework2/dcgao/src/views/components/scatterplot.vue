<template>
    <h4>Choose two features of Netflix productions to explore their correlation</h4>
    <a-dropdown>
        <template #overlay>
            <a-menu @click="handleMenuXClick" :value="varX">
                <a-menu-item key="vote">
                    Vote
                </a-menu-item>
                <a-menu-item key="pop">
                    Popularity
                </a-menu-item>
                <a-menu-item key="score">
                    Score
                </a-menu-item>
            </a-menu>
        </template>
        <a-button class="menu-button">
            {{this.titleX}}
            <DownOutlined />
        </a-button>
    </a-dropdown>
    <a-dropdown>
        <template #overlay>
            <a-menu @click="handleMenuYClick">
                <a-menu-item key="vote">
                    Vote
                </a-menu-item>
                <a-menu-item key="pop">
                    Popularity
                </a-menu-item>
                <a-menu-item key="score">
                    Score
                </a-menu-item>
            </a-menu>
        </template>
        <a-button class="menu-button">
            {{this.titleY}}
            <DownOutlined />
        </a-button>
    </a-dropdown>
    <div id="scatterplot"></div>
</template>

<script>
import { DownOutlined } from '@ant-design/icons-vue';
import * as d3 from "d3";
import config from '../../config'
import utils from '../../utils'

export default {
    name: 'ScatterPlot',
    data() {
        return {
            numSelected: 3,
            voteThresh: 1000,
            popThresh: 50,
            scoreThresh: 10,
            varX: "vote",
            varY: "pop",
            titleX: "Votes",
            titleY: "Popularity",
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
        varX: {
            handler() { this.drawChart(); }
        },
        varY: {
            handler() { this.drawChart(); }
        }
    },
    methods: {
        getStats() {
            let selectedCountries = utils.selectTitleData(this.csvData, this.numSelected);
            let colors = {}
            let stats = []

            selectedCountries.forEach((country, i) => {
                stats.push(...this.csvData.stats[country].filter(
                    // Thresholds for different variables
                    d => (
                        d.vote < this.voteThresh && d.pop < this.popThresh && d.score < this.scoreThresh
                    )).map(
                        d => Object.assign(d, { color: config.COLOR_SCHEME[i] })
                    ));
                colors[country] = config.COLOR_SCHEME[i];
            });
            return {
                countries: selectedCountries,
                stats: stats,
                colors: colors,
            }
        },
        handleMenuXClick(e) {
            const titles = { 'vote': 'Votes', 'pop': 'Popularity', 'score': 'Score' }
            this.varX = e.key
            this.titleX = titles[e.key]
        },
        handleMenuYClick(e) {
            const titles = { 'vote': 'Votes', 'pop': 'Popularity', 'score': 'Score' }
            this.varX = e.key
            this.titleY = titles[e.key]
        },
        drawChart() {
            let { countries, stats, colors } = this.getStats();
            let [height, width] = [400, 640];
            let [marginLeft, marginRight, marginTop, marginBottom] = [40, 40, 40, 40];

            let X = d3.map(stats, d => d[this.varX]);
            let Y = d3.map(stats, d => d[this.varY]);
            let xDomain = d3.extent(X);
            let yDomain = d3.extent(Y);
            let [insetLeft, insetRight, insetTop, insetBottom] = [6, 6, 6, 6]
            let xRange = [marginLeft + insetLeft, width - marginRight - insetRight];
            let yRange = [height - marginBottom - insetBottom, marginTop + insetTop];

            const xScale = d3.scaleLinear(xDomain, xRange);
            const yScale = d3.scaleLinear(yDomain, yRange);
            const xAxis = d3.axisBottom(xScale).ticks(width / 80);
            const yAxis = d3.axisLeft(yScale).ticks(height / 50);

            d3.select("#scatterplot").select("svg").remove();
            const svg = d3.select("#scatterplot")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [0, 0, width, height]);

            svg.append("g")
                .attr("transform", `translate(0,${height - marginBottom})`)
                .call(xAxis)
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line").clone()
                    .attr("y2", marginTop + marginBottom - height)
                    .attr("stroke-opacity", 0.1))
                .call(g => g.append("text")
                    .attr("x", width)
                    .attr("y", marginBottom - 4)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "end")
                    .text(this.titleX));

            svg.append("g")
                .attr("transform", `translate(${marginLeft},0)`)
                .call(yAxis)
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line").clone()
                    .attr("x2", width - marginLeft - marginRight)
                    .attr("stroke-opacity", 0.1))
                .call(g => g.append("text")
                    .attr("x", -marginLeft)
                    .attr("y", 10)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text(this.titleY));

            svg.append("g")
                .attr("stroke", "#fff")
                .attr("stroke-width", 0.3)
                .attr("fill", "none")
                .selectAll("circle")
                .data(stats)
                .join("circle")
                .attr("fill", d => d.color)
                .attr("cx", d => xScale(d[this.varX]))
                .attr("cy", d => yScale(d[this.varY]))
                .attr("r", 3);

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
                .attr("y", function (d, i) { return 90 + i * 25 })
                .style("fill", d => colors[d])
                .text(d => d)
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle");

            // Plot title
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", 16)
                .attr("text-anchor", "middle")
                .style("font-size", "15px")
                .style("text-decoration", "underline")
                .text(`${this.titleX}-${this.titleY} Correlations in ${this.numSelected} Countries`);

            return svg.node();
        }
    },
}

</script>


<style scoped>
.menu-button {
    margin-top: 5px;
    margin-bottom: 5px;
    margin-right: 10px;
}
</style>