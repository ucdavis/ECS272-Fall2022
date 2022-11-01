<template>
    <h4>Brush: Choose two features of Netflix productions to explore their correlation</h4>
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
            {{ this.titleX }}
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
            {{ this.titleY }}
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
                        d.vote < this.voteThresh
                        && d.pop < this.popThresh
                        && d.score < this.scoreThresh
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
            this.varY = e.key
            this.titleY = titles[e.key]
        },
        drawChart() {
            let { countries, stats, colors } = this.getStats();
            let [marginLeft, marginRight, marginTop, marginBottom] = [10, 10, 10, 20];
            let [height, width] = [400 - marginTop - marginBottom, 640 - marginLeft - marginRight];

            let X = d3.map(stats, d => d[this.varX]);
            let Y = d3.map(stats, d => d[this.varY]);
            let xDomain = d3.extent(X);
            let yDomain = d3.extent(Y);

            let xScale = d3.scaleLinear(xDomain, [0, width]);
            let yScale = d3.scaleLinear(yDomain, [height, 0]);
            let xAxis = d3.axisBottom(xScale).ticks(width / 80);
            let yAxis = d3.axisRight(yScale).ticks(height / 50);

            d3.select("#scatterplot").select("svg").remove();
            const svg = d3.select("#scatterplot")
                .append("svg")
                .attr("width", width + marginLeft + marginRight)
                .attr("height", height + marginTop + marginBottom)
                .attr("transform", `translate(${marginLeft}, ${marginTop})`);

            xAxis = svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(xAxis)
                .call(g => g.append("text")
                    .attr("x", width)
                    .attr("y", marginBottom)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "end")
                    .text(this.titleX));

            yAxis = svg.append("g")
                .call(yAxis)
                .call(g => g.append("text")
                    .attr("x", marginLeft)
                    .attr("y", marginTop)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text(this.titleY));

            var clip = svg.append("defs").append("svg:clipPath")
                .attr("id", "clip")
                .append("svg:rect")
                .attr("width", width)
                .attr("height", height)
                .attr("x", 0)
                .attr("y", 0);

            // Dot legends
            svg.append("g")
                .selectAll("dots")
                .data(countries)
                .enter()
                .append("circle")
                .attr("cx", 50)
                .attr("cy", (_, i) => 50 + i * 25)
                .attr("r", 6)
                .style("fill", d => colors[d]);
            svg.selectAll("countries")
                .data(countries)
                .enter()
                .append("text")
                .attr("x", 80)
                .attr("y", function (_, i) { return 50 + i * 25 })
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

            // Plot scatter
            svg.append("g")
                .attr("clip-path", "url(#clip)")
                .attr("stroke", "#fff")
                .attr("stroke-width", 0.3)
                .attr("fill", "none")
                .selectAll("circle")
                .data(stats)
                .enter()
                .append("circle")
                .attr("fill", d => d.color)
                .attr("cx", d => xScale(d[this.varX]))
                .attr("cy", d => yScale(d[this.varY]))
                .attr("r", 3);

            let updateScatter = ({ selection }) => {
                let extent = selection
                if (!extent) {
                    if (!idleTimeout) return idleTimeout = setTimeout(idled, 350);
                    xScale.domain(xDomain)
                    yScale.domain(yDomain)
                } else {
                    xScale.domain([
                        xScale.invert(extent[0][0]),
                        xScale.invert(extent[1][0]),
                    ])
                    yScale.domain([
                        yScale.invert(extent[1][1]),
                        yScale.invert(extent[0][1]),
                    ])
                    svg.select(".brush").call(brush.move, null)
                }
                xAxis.transition().duration(1000).call(d3.axisBottom(xScale))
                yAxis.transition().duration(1000).call(d3.axisRight(yScale))
                svg
                    .selectAll("circle")
                    .transition().duration(1000)
                    .attr("cx", d => xScale(d[this.varX]))
                    .attr("cy", d => yScale(d[this.varY]))
            }

            var brush = d3.brush()
                .extent([[0, 0], [width, height]])
                .on("end", updateScatter)

            svg
                .append("g")
                .attr("class", "brush")
                .call(brush)

            var idleTimeout

            function idled() { idleTimeout = null; }

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