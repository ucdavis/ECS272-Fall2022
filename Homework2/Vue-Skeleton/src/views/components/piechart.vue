<template>
    <a-typography-title :level="4" :underline="true">Top 10 Most Popular Songs Per Decade</a-typography-title>
    <div style="width:50%;display: flex;width: 100%;height: 100%">
        <div class="column1" id ="left" style="width:50%;">
            <select id="selectButton"></select>
            <div id="pie"></div>
        </div>
        <div class="column2" id ="right" style="width:50%;">
            <svg id="pie_legend"></svg>
        </div>
    </div>
</template>

<script>
    import * as d3 from "d3";

    export default {
        name: 'PieChart',
        data() {
            return {
                attributes: ["acousticness", "danceability", "energy", "instrumentalness", "liveness", "loudness", "popularity", "speechiness", "tempo", "valence"],
                artists: ["[Billie Holiday']", "['Lead Belly']", "['Miles Davis']","['The Beach Boys']", "['Queen']", "['Metallica']",
                            "['Nirvana']", "['Eminem']", "['Taylor Swift']","[Lil Uzi Vert']"]

            }
        },
        props:{
            myPieData: Array,
        },
        mounted(){
            const years = this.makeYears();
            d3.select("#selectButton")
            .selectAll('myOptions')
            .data(years)
            .enter()
            .append('option')
            .text(function (d) { return d; })
            .attr("value", function (d) { return d; })

            this.drawPieChart(this.myPieData, "#pie")
        },
        methods: {
            makeYears() {
                var years = []
                for (let i = 1930; i < 2021; i += 10) {
                    years.push(i)
                }
                return years
            },

            makePieData(data) {
                const pieData = []
                data.forEach(d => {
                    const temp = {
                    song: d.name,
                    popularity: d.popularity
                    }
                    pieData.push(temp)
                })
                return pieData
            },

            createMap(years, pieData) {
                const map = new Map()
                let i = 0
                years.forEach(a => {
                    map.set(a, pieData.slice(i, i += 10))
                    // map.set(a, pieData.slice(i, i += 5))  
                })
                return map
            },

            drawPieChart(data, id) {
                const years = this.makeYears();
                const pieData = this.makePieData(data);
                const map = this.createMap(years, pieData)

                const width = 450, height = 450, margin = 100;
                const radius = Math.min(width, height) / 2 - margin

                  // append the svg object to the div called 'pie'
                const svg = d3.select(id)
                .append("svg")
                .attr("preserveAspectRatio", "xMidYMid meet")
                .attr("viewBox", [-50, 50, width + 95, height - 95])
                .classed("svg-content-responsive", true)
                .append("g")
                    .attr("transform", `translate(${width / 2}, ${height / 2}) scale(1.25)`);
                    

                var data = {}
                const initialSelection = d3.select("#selectButton").property("value")
                const slice = map.get(parseInt(initialSelection))
                slice.forEach(d => {
                    data[d.song] = d.popularity
                })

                const sorted = Object.entries(data)
                .sort(([, a], [, b]) => b - a)
                .reduce(
                    (r, [k, v]) => ({
                    ...r,
                    [k]: v
                    }),
                    {}
                )
                
                const color = d3.scaleOrdinal().range(d3.schemeCategory10);
                
                  // Compute the position of each group on the pie:
                var pie = d3.pie()
                .value(function(d) {return d[1]})
                var data_ready = pie(Object.entries(sorted))
                console.log('data_ready: ', data_ready)

                  // shape helper to build arcs:
                var arcGenerator = d3.arc()
                .innerRadius(0)
                .outerRadius(radius)

                  // Build the pie chart
                svg
                .selectAll('mySlices')
                .data(data_ready)
                .join('path')
                    .attr('d', arcGenerator)
                    .attr('fill', function(d){ return(color(d.data[0])) })
                    .attr("stroke", "black")
                    .style("stroke-width", "2px")
                    .style("opacity", 0.7)

                // Now add the annotation. Use the centroid method to get the best coordinates
                svg
                .selectAll('mySlices')
                .data(data_ready)
                .join('text')
                .text(function(d){ return d.data[1]})
                .attr("transform", function(d) { return `translate(${arcGenerator.centroid(d)})`})
                .style("text-anchor", "middle")
                .style("font-size", 17)

                //legend
                const keys = Object.keys(sorted)

                var Svg2 = d3.select("#pie_legend")
                .attr("preserveAspectRatio", "xMidYMid meet")
                .attr("viewBox", [460, 0, 455, 300])
                .classed("svg-content-responsive", true)

                // Add one dot in the legend for each name.
                Svg2.selectAll("mydots")
                .data(keys)
                .enter()
                .append("circle")
                    .attr("cx", 500)
                    .attr("cy", function(d,i){ return 50 + i*25})
                    .attr("r", 7)
                    .style("fill", function(d){ return color(d)})

                // Add one label in the legend for each dot.
                var labels = Svg2.selectAll("mylabels")
                .data(keys)
                .enter()
                .append("text")
                    .attr("x", 520)
                    .attr("y", function(d,i){ return 50 + i*25})
                    .style("fill", function(d){ return color(d)})
                    .text(function(d){ return d})
                    .attr("text-anchor", "left")
                    .style("alignment-baseline", "middle")

                
                    d3.select("#selectButton").on("change", function(d) {
                        // select the option that has been chosen
                        const selectedOption = d3.select(this).property("value")
                        var slice = map.get(parseInt(selectedOption))
                        var data = {}
                        slice.forEach(d => {
                        data[d.song] = d.popularity
                        })

                        const sorted = Object.entries(data)
                        .sort(([, a], [, b]) => b - a)
                        .reduce(
                            (r, [k, v]) => ({
                            ...r,
                            [k]: v
                            }),
                            {}
                        )

                        // Compute the position of each group on the pie:
                    var pie = d3.pie()
                        .value(function(d) {return d[1]})
                    // var data_ready = pie(Object.entries(data))
                    var data_ready = pie(Object.entries(sorted))
                    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
                    svg
                        .selectAll('mySlices')
                        .data(data_ready)
                        .join('path')
                        .transition()
                        .duration(1000)
                        .attr('d', arcGenerator)
                        .attr('fill', function(d){ return(color(d.data[0])) })
                        .attr("stroke", "black")
                        .style("stroke-width", "2px")
                        .style("opacity", 1)
                    
                    svg
                    .selectAll('mySlices')
                    .data(data_ready)
                    .join('text')
                    .text(function(d){ return d.data[1]})
                    .attr("transform", function(d) { return `translate(${arcGenerator.centroid(d)})`})
                    .style("text-anchor", "middle")
                    .style("font-size", 17)


                const keys = Object.keys(sorted)

                d3.select('#pie_legend').selectAll('text').remove();
                d3.select('#pie_legend').selectAll('circle').remove();
                var Svg2 = d3.select("#pie_legend")

                Svg2.selectAll("mydots")
                .data(keys)
                .enter()
                .append("circle")
                    .attr("cx", 500)
                    .attr("cy", function(d,i){ return 50 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
                    .attr("r", 7)
                    .style("fill", function(d){ return color(d)})
                
                Svg2.selectAll("mylabels")
                .data(keys)
                .enter()
                .append("text")
                    .attr("x", 520)
                    .attr("y", function(d,i){ return 50 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
                    .style("fill", function(d){ return color(d)})
                    .text(function(d){ return d})
                    .attr("text-anchor", "left")
                    .style("alignment-baseline", "middle")

                    })
            },
        }
    }

</script>


<style>

</style>