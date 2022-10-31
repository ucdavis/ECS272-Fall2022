<template>
    <div id="scatter"></div>
</template>

<script>
    import * as d3 from "d3";
    import dataScatter from "../../assets/data/fire_scatter.json"; /* Example of reading in data direct from file*/

    export default {
        name: 'Scatter',
        data() {
            return {
                /*name: 'Hello',
                someLocalValues: [1, 2, 3, 4, 5],*/

            }
        },
        props:{
            myScatterData: Array,
        },
        mounted(){
            console.log(dataScatter);
            let localData = dataScatter['data'];
            this.drawScatter(localData, "#scatter") /* Example of reading data from a json file */
            console.log("Data Passed down as a Prop  ", this.myScatterData)
        },
        methods: {
            drawScatter(data, id) {
                
                // Source: https://d3-graph-gallery.com/graph/scatter_grouped.html
                // set the dimensions and margins of the graph
                /*const margin = {top: 10, right: 30, bottom: 30, left: 60},
                    width = 460 - margin.left - margin.right,
                    height = 400 - margin.top - margin.bottom;*/

                const margin = { top: 40, right: 160, bottom: 40, left: 80};
                const height = 300;
                const width = 620;    

                
                // // Filter data
                // data = data.filter(d => d.FIRE_SIZE <1000)

                let svg = d3.select(id).append("svg")
                    .attr("viewBox", [0, 0, width, height])
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);

                // Add X axis
                var parseDate = d3.timeParse("%Y-%m-%d");
                const x = d3.scaleTime()
                    .domain(d3.extent(data, d => parseDate(d.FIRE_DATE)))
                    .rangeRound([margin.left, width - margin.right]);

                // Add Y axis
                var y = d3.scaleLinear()
                    // .domain([0, d3.max(data, d => d.FIRE_SIZE)]).nice()
                    .domain([0, 10]).nice()
                    .rangeRound([height - margin.bottom, margin.top]);
        

                // Color scale: give me a specie name, I return a color
                //see https://colorbrewer2.org/#type=qualitative&scheme=Dark2&n=8
                const causes = ["Lightning","Miscellaneous","Equipment Use","Arson",
                                "Campfire/Children/Smoking/Fireworks","Missing/Undefined",
                                "Debris Burning","Powerline/Railroad/Structure"]
                
                const color = d3.scaleOrdinal()
                    .domain(causes)
                    .range(["#e6ab02","#1b9e77","#d95f02","#66a61e",
                            "#e7298a","#666666","#a6761d","#7570b3"])   
                
                const seasons=["Summer","Fall","Spring","Winter"]
                const colorSeason=d3.scaleOrdinal()
                    .domain(seasons)
                    .range(["#e31a1c","#543005","#78c679","#2b8cbe"])

                // Add dots
                var scatterPlot=svg.append('g')
                    .selectAll("dot")
                    .data(data)
                    .join("circle")
                    .attr("cx", function (d) { return x(parseDate(d.FIRE_DATE)); } )
                    .attr("cy", function (d) { return y(d.FIRE_SIZE); } )
                    .attr("r", 2.5)
                    // .attr("r",d => (d.FIRE_SIZE/100)) // size could be a function of value
                    .attr("opacity",0.5)
                    .style("fill", function (d) { return color(d.STAT_CAUSE_DESCR) } )
                

                // Interactions with buttons    
                    // https://d3-graph-gallery.com/graph/interactivity_button.html
                    function changeYaxis() {
                        
                        // adjust the text on the range slider
                        d3.select("#yrange-value").text(this.value);
                        
                        // Update linear scale for Y axis
                        y.domain([0,this.value]).nice()
                            .rangeRound([height - margin.bottom, margin.top]);
                        
                        // Update values on the plot based on the new scale
                        scatterPlot
                            .attr("cy", function (d) { return y(d.FIRE_SIZE); } )
        
                        // Remove previous y Axis and create a new one identical but with new linear Y scale
                        svg.selectAll("#yAxis").remove();
                        svg.append("g")
                            .attr("id","yAxis")
                            .call(yAxis)
                            .call(g => g.select(".tick:last-of-type text")
                                .clone()
                                .attr("transform", `rotate(-90)`)
                                .attr("text-anchor", "middle")
                                .attr("x", -(350 - margin.top - margin.bottom) / 2)
                                .attr("y", -40)
                                .attr("font-weight", "bold")
                                .text("Fire size [acres burned]")
                        )
                    }
                    
                    d3.select("#yrange").on("input", changeYaxis)

                    // Change colors
                    d3.select("#ScatterColor").on("change",function(d){

                        // recover the option that has been chosen
                        var selectedOption = d3.select(this).property("value")
                        console.log(selectedOption)
                        
                        if (selectedOption=="season"){
                            var colorScale=colorSeason
                            var dataLegend=seasons
                            var stringVar="SEASON"
                        } else {
                            var colorScale=color
                            var dataLegend=causes
                            var stringVar="STAT_CAUSE_DESCR"
                        }

                        
                        // update the color of points
                        scatterPlot
                            .style("fill", function (d) { return colorScale(d[stringVar]) } )
                        
                        // update legend

                        // remove old legend
                        svg.selectAll("#circleLegend").remove();
                        svg.selectAll("#circleLegendText").remove();

                        // new legend
                        svg.selectAll("mydots")
                            .data(dataLegend)
                            .enter()
                            .append("circle")
                                .attr("id","circleLegend")
                                .attr("cx", xLeg)
                                .attr("cy", function(d,i){ return yLeg + i*yLegStep}) // yleg is where the first dot appears. 25 is the distance between dots
                                .attr("r", 3)
                                .style("fill", function(d){ return colorScale(d)})

                        svg.selectAll("mylabels")
                            .data(dataLegend)
                            .enter()
                            .append("text")
                                .attr("id","circleLegendText")
                                .attr("x", xLeg+10)
                                .attr("y", function(d,i){ return yLeg + i*yLegStep}) // yleg is where the first dot appears. 25 is the distance between dots
                                .style("fill", function(d){ return colorScale(d)})
                                .text(function(d){ return d})
                                .attr("text-anchor", "left")
                                .style("alignment-baseline", "middle")
                                .style("font-size", "12px")

                    })


                // SCALES    
                const xAxis = g => g
                    .attr("transform", `translate(0,${height - margin.bottom})`)
                    .call(d3.axisBottom(x))

                var yAxis = g => g
                    .attr("transform", `translate(${margin.left},0)`)
                    .call(d3.axisLeft(y))

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
                    .attr("id","yAxis")
                    .call(yAxis)
                    .call(g => g.select(".tick:last-of-type text")
                        .clone()
                        .attr("transform", `rotate(-90)`)
                        .attr("text-anchor", "middle")
                        .attr("x", -(350 - margin.top - margin.bottom) / 2)
                        .attr("y", -40)
                        .attr("font-weight", "bold")
                        .text("Fire size [acres burned]")
                        )

                // COLOR LEGEND
                // https://d3-graph-gallery.com/graph/custom_legend.html
                
                // position based on scale
                const xLeg = width-margin.right-margin.left+50
                const yLeg = d3.max(data, d => d.FIRE_SIZE)/10
                const yLegStep = d3.max(data, d => d.FIRE_SIZE)/50
                
                // Add one dot in the legend for each name.
                svg.selectAll("mydots")
                .data(causes)
                .enter()
                .append("circle")
                    .attr("id","circleLegend")
                    .attr("cx", xLeg)
                    .attr("cy", function(d,i){ return yLeg + i*yLegStep}) // yleg is where the first dot appears. 25 is the distance between dots
                    .attr("r", 3)
                    .style("fill", function(d){ return color(d)})
                
                
                // Add one dot in the legend for each name.
                svg.selectAll("mylabels")
                .data(causes)
                .enter()
                .append("text")
                    .attr("id","circleLegendText")
                    .attr("x", xLeg+10)
                    .attr("y", function(d,i){ return yLeg + i*yLegStep}) // yleg is where the first dot appears. 25 is the distance between dots
                    .style("fill", function(d){ return color(d)})
                    .text(function(d){ return d})
                    .attr("text-anchor", "left")
                    .style("alignment-baseline", "middle")
                    .style("font-size", "12px")


            },
        }
    }

</script>