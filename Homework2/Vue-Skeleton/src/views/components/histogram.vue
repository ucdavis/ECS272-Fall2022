<template>
    <div id="histo"></div>
</template>

<script>
import * as d3 from "d3";
import testData from "../../assets/data/comediesPerYear.json"; /* Example of reading in data direct from file*/

export default {
    name: 'Histogram',
    data() {
        return {
            name: 'Hello',
            someLocalValues: [1, 2, 3, 4, 5],
        }
    },
    props: {
        myHistogramData: Array,
    },
    mounted() {
        console.log(testData);
        let localData = testData['data'];
        this.drawBarChart(localData, "#histo") /* Example of reading data from a json file */
        // this.drawBarChart(this.myBarchartData, "#bar")
        console.log("Data Passed down as a Prop  ", this.myHistogramData)
    },
    methods: {
        drawBarChart(data, id) {

            const margin = { top: 80, right: 20, bottom: 150, left: 50 };
            const height = 400;
            const width = 500;

            const x = d3.scaleBand().domain(data.map(d => d.year))
                .rangeRound([margin.left, width - margin.right])
                .padding(0.1);

            const y = d3.scaleLinear().domain([0, d3.max(data, d => d.count)]).nice()
                .rangeRound([height - margin.bottom, margin.top]);

            let svg = d3.select(id).append("svg")
                .attr("viewBox", [0, 0, width, height])
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            svg.selectAll("rect")
                .data(data)
                .join("rect")
                .attr("x", d => x(d.year))
                .attr("y", d => y(d.count))
                .attr("width", x.bandwidth())
                .attr("height", d => y(0) - y(d.count))
                .attr("fill", "green");

            const xAxis = g => g
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x));

            const yAxis = g => g
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y));

            const xTitle = g => g.append("text")
                .attr("font-family", "sans-serif")
                .attr("font-size", 14)
                .attr("x", 200)
                .attr("y", height-margin.bottom+50)
                .text("Movie Release Year");

            const yTitle = g => g.append("text")
                .attr("font-family", "sans-serif")
                .attr("font-size", 14)
                .attr("y", 15)
                .attr("x", -200)
                .text("Movie Count");
            
            const chartTitle = g => g.append("text")
                .attr("font-family", "sans-serif")
                .attr("font-size", 16)
                .attr("font-weight",700)
                .attr("y", -20+margin.top)
                .attr("x", 100)
                .text("Release Year Of Comedy Movies On Netflix");

            svg.append("g")
                .call(xTitle);

            svg.append("g")
                .call(yTitle)
                .attr("transform", `rotate(-90)`);
            
            svg.append("g")
                .call(chartTitle);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)")
                .attr("font-weight", "bold");

            svg.append("g")
                .call(yAxis)
                .call(g => g.select(".tick:last-of-type text")
                    .clone()
                    .attr("transform", `rotate(-90)`)
                    .attr("text-anchor", "middle")
                    .attr("x", -(15 - margin.top - margin.bottom) / 2)
                    .attr("y", -80)
                    .attr("font-weight", "bold"))
        },
    }
}

</script>


<style>

</style>