<template>
    <div id="stackedArea"></div>
</template>

<script>
    import * as d3 from "d3";
    // import dataStackedArea from "../../assets/data/stackedArea.json"; /* Example of reading in data direct from file*/
    import dataStackedArea from "../../assets/data/fire_area.json"; /* Example of reading in data direct from file*/


    export default {
        name: 'StackedArea',
        data() {
            return {
                /*name: 'Hello',
                someLocalValues: [1, 2, 3, 4, 5],*/

            }
        },
        props:{
            myStackedAreaData: Array,
        },
        mounted(){
            console.log(dataStackedArea);
            // let localData = d3.csv(dataStackedArea);
            let localData = dataStackedArea['data'];
            this.drawStackedArea(localData, "#stackedArea") /* Example of reading data from a json file */
            console.log("Data Passed down as a Prop  ", this.myStackedAreaData)
        },
        methods: {
            drawStackedArea(data, id) {
                
                // Source: https://d3-graph-gallery.com/graph/stackedarea_template.html
                // set the dimensions and margins of the graph
                const margin = {top: 60, right: 160, bottom: 50, left: 80},
                    width = 860 - margin.left - margin.right,
                    height = 400 - margin.top - margin.bottom;

                // const margin = { top: 40, right: 160, bottom: 40, left: 80};
                // const height = 300;
                // const width = 620; 

                // append the svg object to the body of the page
                const svg = d3.select(id).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform",
                        `translate(${margin.left}, ${margin.top})`);

                //////////
                // GENERAL //
                //////////

                // List of groups = header of the csv files
                // const keys = data.columns.slice(1)
                // const keys=["Amanda","Ashley","Betty","Deborah","Dorothy","Helen","Linda","Patricia"]

                // // color palette
                // const color = d3.scaleOrdinal()
                //     .domain(keys)
                //     .range(d3.schemeSet2);
                
                const keys = ["Lightning","Miscellaneous","Equipment Use","Arson",
                                "Campfire/Children/Smoking/Fireworks","Missing/Undefined",
                                "Debris Burning","Powerline/Railroad/Structure"]
                
                const color = d3.scaleOrdinal()
                    .domain(keys)
                    .range(["#e6ab02","#1b9e77","#d95f02","#66a61e",
                            "#e7298a","#666666","#a6761d","#7570b3"]); 


                //stack the data?
                const stackedData = d3.stack()
                    .keys(keys)
                    (data)

                //////////
                // AXIS //
                //////////

                // Add X axis
                const x = d3.scaleLinear()
                    .domain(d3.extent(data, function(d) { return d.year; }))
                    .range([ 0, width ]);
                
                const xAxis = svg.append("g")
                    .attr("transform", `translate(0, ${height})`)
                    .call(d3.axisBottom(x).ticks(5))

                // Add X axis label:
                svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("x", width)
                    .attr("y", height+40 )
                    .text("Time (year)");

                // Add Y axis label:
                svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("x", 0)
                    .attr("y", -20 )
                    .text("Total Acres burned")
                    .attr("text-anchor", "start")

                // Add Y axis
                const y = d3.scaleLinear()
                    .domain([0, 1200000])
                    .range([ height, 0 ]);
                svg.append("g")
                    .call(d3.axisLeft(y).ticks(5))



                //////////
                // BRUSHING AND CHART //
                //////////

                // Add a clipPath: everything out of this area won't be drawn.
                const clip = svg.append("defs").append("svg:clipPath")
                    .attr("id", "clip")
                    .append("svg:rect")
                    .attr("width", width )
                    .attr("height", height )
                    .attr("x", 0)
                    .attr("y", 0);

                // Add brushing
                const brush = d3.brushX()                 // Add the brush feature using the d3.brush function
                    .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
                    .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function

                // Create the scatter variable: where both the circles and the brush take place
                const areaChart = svg.append('g')
                    .attr("clip-path", "url(#clip)")

                // Area generator
                const area = d3.area()
                    .x(function(d) { return x(d.data.year); })
                    .y0(function(d) { return y(d[0]); })
                    .y1(function(d) { return y(d[1]); })

                // Show the areas
                areaChart
                    .selectAll("mylayers")
                    .data(stackedData)
                    .join("path")
                    .attr("class", function(d) { return "myArea " + d.key.replaceAll(" ","-").replaceAll("/","-") }) // to handle spaces and / in the highlight action
                    .style("fill", function(d) { return color(d.key); })
                    .attr("d", area)

                // Add the brushing
                areaChart
                    .append("g")
                    .attr("class", "brush")
                    .call(brush);

                let idleTimeout
                function idled() { idleTimeout = null; }

                // A function that update the chart for given boundaries
                function updateChart(event,d) {

                    var extent = event.selection

                    // If no selection, back to initial coordinate. Otherwise, update X axis domain
                    if(!extent){
                    if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
                    x.domain(d3.extent(data, function(d) { return d.year; }))
                    }else{
                    x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
                    areaChart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
                    }

                    // Update axis and area position
                    xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5))
                    areaChart
                    .selectAll("path")
                    .transition().duration(1000)
                    .attr("d", area)
                    }



                    //////////
                    // HIGHLIGHT GROUP //
                    //////////

                    // What to do when one group is hovered
                    const highlight = function(event,d){
                    // reduce opacity of all groups
                    d3.selectAll(".myArea").style("opacity", .1)
                    // expect the one that is hovered
                    d3.select("."+d.replaceAll(" ","-").replaceAll("/","-")).style("opacity", 1)
                    }

                    // And when it is not hovered anymore
                    const noHighlight = function(event,d){
                    d3.selectAll(".myArea").style("opacity", 1)
                    }



                    //////////
                    // LEGEND //
                    //////////

                    // Add one dot in the legend for each name.
                    const size = 10
                    svg.selectAll("myrect")
                    .data(keys)
                    .join("rect")
                        .attr("x", 20)
                        .attr("y", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
                        .attr("width", size)
                        .attr("height", size)
                        .style("fill", function(d){ return color(d)})
                        .on("mouseover", highlight)
                        .on("mouseleave", noHighlight)

                    // Add one dot in the legend for each name.
                    svg.selectAll("mylabels")
                    .data(keys)
                    .join("text")
                        .attr("x", 20 + size*1.2)
                        .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
                        .style("fill", function(d){ return color(d)})
                        .text(function(d){ return d})
                        .attr("text-anchor", "left")
                        .style("alignment-baseline", "middle")
                        .on("mouseover", highlight)
                        .on("mouseleave", noHighlight)


            },
        }
    }

</script>