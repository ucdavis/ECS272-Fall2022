<template>
    <div id="legend"></div>
    <div id="area"></div>
</template>

<script>
    import { tSBigIntKeyword } from "@babel/types";
import * as d3 from "d3";
    import csvData from "../../../../../datasets/CO2_emission.csv"; /* Example of reading in data direct from file*/

export default {
    name: 'AreaChart',
    data() {
        return {
        }
    },
    props:{
        myAreachartData: Array,
    },
    mounted(){
        this.drawAreaFromCsv("#legend", "#area")
    },
    methods:{
        drawAreaFromCsv(id1, id2){
            const processData = []
            const regions = {}
            d3.csv(csvData).then((data) => {
                data.forEach(e => {
                    let k = Object.keys(e);
                    if (e['Region'] in regions){
                        regions[e['Region']] += 1;
                    }
                    else {
                        regions[[e['Region']]] = 1;
                    }
                    k.forEach(d => {
                        if (d.length == 4){
                            const temp = {
                                date: new Date(d),
                                value: Number(e[d]),
                                country: e['Country Name'],
                                region: e['Region']
                            }
                            processData.push(temp)
                        }
                    })
                })
                console.log(processData);
                //console.log(regions);

                const margin = {top: 60, right: 230, bottom: 50, left: 50},
                        width = 660 - margin.left - margin.right,
                        height = 400 - margin.top - margin.bottom;

                const keys = Object.keys(regions);
                
                const svg = d3.select(id2).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                    `translate(${margin.left}, ${margin.top})`);
                

                let color = d3.scaleOrdinal()
                                .domain(keys)
                                .range(d3.schemeTableau10);
                
                
                const stackedData = d3.stack().keys(keys)(processData);
                
                /*
                const x = d3.scaleUtc()
                                .domain(d3.extent(processData, function(d) {return d.date;}))
                                .range([0, width]);
                const xAxis = svg.append("g")
                                .attr("transform", `translate(0, ${height})`)
                                .call(d3.axisBottom(x).ticks(5))

                // x axis label
                svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("x", width)
                    .attr("y", height+40)
                    .text("Time (year)");

                // y axis label
                svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("x", 0)
                    .attr("y", 0)
                    .text("CO2 emissions (metric tons per capita) by Region")
                    .attr("text-anchor", "start")

                const y = d3.scaleLinear()
                            .domain([0, 60])
                            .range([height, 0]);
                
                svg.append("g")
                    .call(d3.axisLeft(y).ticks(5));

                
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

                const areaChart = svg.append('g')
                                .attr("clip-path", "url(#clip)");

                const area = d3.area()
                                .x(function(d) { return x(d.date); })
                                .y0(function(d) { return y(d[0]); })
                                .y1(function(d) { return y(d[1]); });
                
                areaChart.selectAll("mylayers")
                            .data(stackedData)
                            .join("path")
                            .attr("class", function(d) { return "myArea " + d.key })
                            .style("fill", function(d) { return color(d.key); })
                            .attr("d", area);


                areaChart.append("g").attr("class", "brush").call(brush);

                let idleTimeout
                function idled() { idleTimeout = null; }

                // A function that update the chart for given boundaries
                function updateChart(event,d) {
                
                    extent = event.selection
                
                    // If no selection, back to initial coordinate. Otherwise, update X axis domain
                    if(!extent){
                      if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
                      x.domain(d3.extent(processData, function(d) { return d.date; }))
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
                    d3.select("."+d).style("opacity", 1)
                }
            
                // And when it is not hovered anymore
                const noHighlight = function(event,d){
                    d3.selectAll(".myArea").style("opacity", 1)
                }
            
            
            
                //////////
                // LEGEND //
                //////////
            
                // Add one dot in the legend for each name.
                const size = 20
                svg.selectAll("myrect")
                    .data(keys)
                    .join("rect")
                    .attr("x", 400)
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
                    .attr("x", 400 + size*1.2)
                    .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
                    .style("fill", function(d){ return color(d)})
                    .text(function(d){ return d})
                    .attr("text-anchor", "left")
                    .style("alignment-baseline", "middle")
                    .on("mouseover", highlight)
                    .on("mouseleave", noHighlight);
                */
                
                let size = 20;
                svg.selectAll("mydots")
                    .data(keys)
                    .enter()
                    .append("rect")
                    .attr("x", 100)
                    .attr("y", function(d,i){ return 100 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
                    .attr("width", size)
                    .attr("height", size)
                    .style("fill", function(d){ return color(d)})

                // Add one dot in the legend for each name.
                svg.selectAll("mylabels")
                    .data(keys)
                    .enter()
                    .append("text")
                    .attr("x", 100 + size*1.2)
                    .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
                    .style("fill", function(d){ return color(d)})
                    .text(function(d){ return d})
                    .attr("text-anchor", "left")
                    .style("alignment-baseline", "middle");
                
                    
                let chart = StackedAreaChart(processData, id2, {
                    x: d => d.date,
                    y: d => d.value,
                    z: d => d.region,
                    yLabel: "CO2 emissions (metric tons per capita) by Region"
                });

                function StackedAreaChart(data, id, {
                    x = ([x]) => x, // given d in data, returns the (ordinal) x-value
                    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
                    z = () => 1, // given d in data, returns the (categorical) z-value
                    marginTop = 20, // top margin, in pixels
                    marginRight = 30, // right margin, in pixels
                    marginBottom = 30, // bottom margin, in pixels
                    marginLeft = 40, // left margin, in pixels
                    width = 800, // outer width, in pixels
                    height = 600, // outer height, in pixels
                    xType = d3.scaleUtc, // type of x-scale
                    xDomain, // [xmin, xmax]
                    xRange = [marginLeft, width - marginRight], // [left, right]
                    yType = d3.scaleLinear, // type of y-scale
                    yDomain, // [ymin, ymax]
                    yRange = [height - marginBottom, marginTop], // [bottom, top]
                    zDomain, // array of z-values
                    offset = d3.stackOffsetDiverging, // stack offset method
                    order = d3.stackOrderNone, // stack order method
                    xFormat, // a format specifier string for the x-axis
                    yFormat, // a format specifier for the y-axis
                    yLabel, // a label for the y-axis
                    colors = d3.schemeTableau10, // array of colors for z
                    } = {}) {
                    // Compute values.
                    const X = d3.map(data, x);
                    const Y = d3.map(data, y);
                    const Z = d3.map(data, z);
                        
                    // Compute default x- and z-domains, and unique the z-domain.
                    if (xDomain === undefined) xDomain = d3.extent(X);
                    if (zDomain === undefined) zDomain = Z;
                    zDomain = new d3.InternSet(zDomain);
                        
                    // Omit any data not present in the z-domain.
                    const I = d3.range(X.length).filter(i => zDomain.has(Z[i]));
                        
                    // Compute a nested array of series where each series is [[y1, y2], [y1, y2],
                    // [y1, y2], …] representing the y-extent of each stacked rect. In addition,
                    // each tuple has an i (index) property so that we can refer back to the
                    // original data point (data[i]). This code assumes that there is only one
                    // data point for a given unique x- and z-value.
                    const series = d3.stack()
                        .keys(zDomain)
                        .value(([x, I], z) => Y[I.get(z)])
                        .order(order)
                        .offset(offset)
                      (d3.rollup(I, ([i]) => i, i => X[i], i => Z[i]))
                      .map(s => s.map(d => Object.assign(d, {i: d.data[1].get(s.key)})));
                        
                    // Compute the default y-domain. Note: diverging stacks can be negative.
                    if (yDomain === undefined) yDomain = d3.extent(series.flat(2));
                        
                    // Construct scales and axes.
                    const xScale = xType(xDomain, xRange);
                    const yScale = yType(yDomain, yRange);
                    const color = d3.scaleOrdinal(zDomain, colors);
                    const xAxis = d3.axisBottom(xScale).ticks(width / 80, xFormat).tickSizeOuter(0);
                    const yAxis = d3.axisLeft(yScale).ticks(height / 50, yFormat);
                        
                    const area = d3.area()
                        .x(({i}) => xScale(X[i]))
                        .y0(([y1]) => yScale(y1))
                        .y1(([, y2]) => yScale(y2));
                        
                    const svg = d3.select(id).append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .attr("viewBox", [0, 0, width, height])
                        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
                        
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
                        .text(yLabel));
                        
                    svg.append("g")
                        .selectAll("path")
                        .data(series)
                        .join("path")
                        .attr("fill", ([{i}]) => color(Z[i]))
                        .attr("d", area)
                        .append("title")
                        .text(([{i}]) => Z[i]);
                        
                    svg.append("g")
                        .attr("transform", `translate(0,${height - marginBottom})`)
                        .call(xAxis);
                        
                    return Object.assign(svg.node(), {scales: {color}});
                }
            });
        }
    }
}
</script>


<style>

</style>