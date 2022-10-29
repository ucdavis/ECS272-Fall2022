// Reference: https://d3-graph-gallery.com/graph/boxplot_show_individual_points.html

import * as d3 from "d3";
import { selectAll } from "d3";
import * as d3Collection from "d3-collection"
import csvPath from '../assets/data/directorIMDBscoreComparison.csv';

export async function drawBoxFromCsvAsync() {
    const data = await d3.csv(csvPath);
    console.log(data);

    const margin = { top: 20, right: 90, bottom: 50, left: 90 };
    const width = 700 - margin.left - margin.right;
    const height = 215 - margin.top - margin.bottom;



    // append the svg object to the body of the page
    var svg = d3.select("#box")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")

    var svg2 = d3.select("#box")
        .append("svg")
        .attr("width", (width + margin.left + margin.right))
        .attr("height", height / 2 + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(220, " + margin.top + ")");


    // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
    var sumstat = d3Collection.nest() // nest function allows to group the calculation per level of a factor
        .key(function (d) { return d.Director; })
        .rollup(function (d) {
            var q1 = d3.quantile(d.map(function (g) { return g.imdb_score; }).sort(d3.ascending), .25)
            var median = d3.quantile(d.map(function (g) { return g.imdb_score; }).sort(d3.ascending), .5)
            var q3 = d3.quantile(d.map(function (g) { return g.imdb_score; }).sort(d3.ascending), .75)
            var interQuantileRange = q3 - q1
            var min = q1 - 1.5 * interQuantileRange
            var max = q3 + 1.5 * interQuantileRange
            return ({ q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max })
        })
        .entries(data)
    console.log("Sumstat", sumstat)

    // Show the X scale
    var x = d3.scaleBand()
        .range([0, width])
        .domain(['Ryan Polito', 'Jay Karas', 'Jay Chapman', 'Marcus Raboy', 'Raúl Campos', 'Jan Suter', 'All Comedies'])
        .paddingInner(1)
        .paddingOuter(.5)
    svg.append("g")
        .attr("id", "xaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .on("click", makeFocusPlot)


    // Show the Y scale
    var y = d3.scaleLinear()
        .domain([0, 10])
        .range([height, 0])
    var y2 = d3.scaleLinear()
        .domain([3, 9])
        .range([height - 50, 0])
    svg.append("g").call(d3.axisLeft(y))
    svg2.append("g").call(d3.axisLeft(y2).ticks(3))

    // Show the main vertical line
    svg
        .selectAll("vertLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("x1", function (d) { return (x(d.key)) })
        .attr("x2", function (d) { return (x(d.key)) })
        .attr("y1", function (d) { return (y(d.value.min)) })
        .attr("y2", function (d) { return (y(d.value.max)) })
        .attr("stroke", "black")
        .style("width", 40)

    // Create xAxis title element
    const xTitle = g => g.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 14)
        .attr("x", (width - margin.left - margin.right) / 2 - 90)
        .attr("y", height - margin.bottom + 90)
        .text("Most Prolific Directors (Click On Name For Detailed View)");

    // Create yAxis title element
    const yTitle = g => g.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 14)
        .attr("y", -25)
        .attr("x", -(height - margin.top - margin.bottom + 150) / 2)
        .text("IMDB Score");

    // Create chart title element
    const chartTitle = g => g.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 16)
        .attr("font-weight", 700)
        .attr("y", 0)
        .attr("x", (width - margin.left - margin.right - 200) / 2)
        .text("IMDB Ratings Of The Most Prolific Comedy Directors")
        .attr("text-anchor", "center");

    svg.append("g")
        .call(xTitle);

    svg.append("g")
        .call(yTitle)
        .attr("transform", `rotate(-90)`);

    svg.append("g")
        .call(chartTitle);

    // rectangle for the main 

    var boxWidth = 50
    svg
        .selectAll("boxes")
        .data(sumstat)
        .enter()
        .append("rect")
        .attr("x", function (d) { return (x(d.key) - boxWidth / 2) })
        .attr("y", function (d) { return (y(d.value.q3)) })
        .attr("height", function (d) { return (y(d.value.q1) - y(d.value.q3)) })
        .attr("width", boxWidth)
        .attr("stroke", "black")
        .style("fill", "#a1ccf2")

    // Show the median
    svg
        .selectAll("medianLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("x1", function (d) { return (x(d.key) - boxWidth / 2) })
        .attr("x2", function (d) { return (x(d.key) + boxWidth / 2) })
        .attr("y1", function (d) { return (y(d.value.median)) })
        .attr("y2", function (d) { return (y(d.value.median)) })
        .attr("stroke", "black")
        .style("width", 80)

    d3.selectAll(("input[name='toggle']")).on("change", function () {
        var state = this.value

        if (state === 'Yes') {

            var jitterWidth = 20
            svg
                .selectAll("indPoints")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return (x(d.Director) - jitterWidth / 2 + Math.random() * jitterWidth) })
                .attr("cy", function (d) { return (y(d.imdb_score)) })
                .attr("r", 4)
                .style("fill", "#eab621")
                .attr("stroke", "black")
                .attr("id", "points")


        }
        else if (state === 'No') {
            svg.selectAll("#points").remove()
        }
    })

    function makeFocusPlot(e, d, i) {
        svg2.selectAll("#focus").remove()
        svg2.selectAll("#focusPoints").remove()
        svg2.selectAll("#toptext").remove()
        // console.log("Click", e,"d",d,i, this) 
        let directorName = d
        const movieByDirector = d3.group(sumstat, d => d.key);
        var currentMovies = movieByDirector.get(directorName);
        var box2Width = 200
        svg2
            .selectAll("boxes")
            .data(currentMovies)
            .enter()
            .append("rect")
            .attr("x", 30)
            .attr("y", function (d) { return (y(d.value.q3)) })
            .attr("height", function (d) { return (y(d.value.q1) - y(d.value.q3)) })
            .attr("width", box2Width)
            .attr("stroke", "black")
            .style("fill", "#a1ccf2")
            .attr("id", "focus")

        var jitterWidth = 180
        var pointData = d3.group(data, d => d.Director)
        var currentPoints = pointData.get(directorName)
        console.log("Current", currentPoints)
        svg2
            .append('text')
            .attr("id", 'bottomtext')
            .attr("x", 60)
            .attr("y", 120)
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("font-family", "sans-serif")
            .text("Movie Title: ");
        svg2
            .append('text')
            .attr("id", 'toptext')
            .attr("x", 100)
            .attr("y", 10)
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("font-family", "sans-serif")
            .text(d);
        svg2
            .selectAll("indPoints")
            .data(currentPoints)
            .enter()
            .append("circle")
            .attr("cx", function () { return (130 - jitterWidth / 2 + Math.random() * jitterWidth) })
            .attr("cy", function (d) { return (y(d.imdb_score)) })
            .attr("r", 7)
            .style("fill", "#eab621")
            .attr("stroke", "black")
            .attr("id", "focusPoints")
            .on('mouseover', function (d, i) {
                // console.log(i.title);
                d3.select(this).attr('style', 'fill: purple;');
                d3.select("#bottomtext").text(`Movie Title: ${i.title}`);
            })
            .on('mouseout', function (d, i) {
                d3.select(this).attr('style', 'fill: #eab621;');
                d3.select("#bottomtext").text(`Movie Title:`);
            });

    }


}

