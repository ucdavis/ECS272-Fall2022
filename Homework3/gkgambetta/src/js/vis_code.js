import * as d3 from "d3";
import linechart_data from '../assets/data/linechart_data.csv'; // data for line chart
import barchart_data from '../assets/data/barchart_data2.csv'; // data for bar chart
import smallmult_data_country from '../assets/data/smallmult_data_country.csv'; // data for small multiples (country)
import smallmult_data_region from '../assets/data/smallmult_data_region.csv'; // data for small multiples (region)
import areachart_data from '../assets/data/areachart_data.csv'; // data for stacked area chart
import parallecoord_data from '../assets/data/parallel_coord_data.csv'; // data for parallel coordinates chart

var w = window.innerWidth;
var h = window.innerHeight;

console.log(w)
console.log(h)

// function drawBarFromCsv(){
//     //async method
//     d3.csv(barchart_data).then((data) => {
//         // array of objects
//         console.log(data.length);
//         console.log(data);
//         // do something with the data (e.g process and render chart)
//         //  const pData = processData();
//         //  drawBarChart(pData, id);
//         //(data will only exist inside here since it is an async call to read in data) so all rendering and processsing with data has to occur inside the "then"
//     });
// }
// /* 
//     Same as the one above but we made the function itself asynch so we can use await
//     The two do the same thing essentially but it is cleaner to read
// */
// export async function drawBarFromCsvAsync(){
//     const data = await d3.csv(piechart_data);
//     console.log(data); 
//     //process data()
//     //draw chart ()
//     //There will be some delay in console before it prints the array
// }

export function LineChart() {

    d3.select("#line").selectAll("*").remove()

    const margin = {top: 60, right: 230, bottom: 50, left: 50},
        width = 1000 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    d3.csv(linechart_data).then(function(data) {

        // append the svg object to the page
        const svg = d3.select("#line")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // obtain list of all countries
        const countries_list = new Set(data.map(d => d.country_name))
        
        // add the options to the button
        d3.select("#country_selectbutton").selectAll("*").remove()

        d3.select("#country_selectbutton")
            .selectAll('myOptions')
            .data(countries_list)
            .enter()
            .append('option')
            .text(d => d)
            .attr("value", d => d)

        // set color scale
        const color_scheme = d3.scaleOrdinal()
                               .domain(countries_list)
                               .range(["darkred", "orange", "blue", "green", "magenta", "grey", "teal", "goldenrod", 
                               "palevioletred", "slateblue", "purple", "lightskyblue", "limegreen", "darksalmon"]);
        
        // x axis
        var format_date = d3.timeParse("%Y-%m-%d")
        const x = d3.scaleTime()
                    .domain(d3.extent(data, d => format_date(d.date)))
                    .range([0, width]);
                    
        svg.append("g")
           .attr("transform", `translate(0, ${height})`)
           .transition()
           .duration(1000)
           .call(d3.axisBottom(x).ticks(8))
           .style("font", "14px arial");

        // y axis
        const y = d3.scaleLinear()
                    .domain([d3.min(data, d => +d.co2), d3.max(data, d => +d.co2)])
                    .range([height, 0]);
        const yAxis = svg.append("g")
           .attr("class", "myYaxis")
           .transition()
           .duration(1000)
           .call(d3.axisLeft(y))
           .style("font", "14px arial");

        // create line with first country (Australia)
        const line = svg
                        //.append('g')
                        .append("path")
                            .datum(data.filter(d => d.country_name == "Australia"))
                            .attr("d", d3.line()
                            .x(d => x(format_date(d.date)))
                            .y(d => y(+d.co2))
                            )
                            .attr("stroke", d => color_scheme("Australia"))
                            .style("stroke-width", 5)
                            .style("fill", "none")

        // function to update the line based on country selected
        function update(country) {
            
            // subset the data for the selected country
            const data_subset = data.filter(d => d.country_name == country)

            // // update the y axis range
            // y.domain([d3.min(data_subset, d => +d.co2), d3.max(data_subset, d => +d.co2)])
            // yAxis
            //     .transition()
            //     .duration(1000)
            //     .call(d3.axisLeft(y));

            // update the line
            line
                .datum(data_subset)
                .transition()
                .duration(1000)
                .attr("d", d3.line()
                    .x(d => x(format_date(d.date)))
                    .y(d => y(+d.co2))
                )
                .attr("stroke", d => color_scheme(country))

        }

        // when button is changed, run the update function
        d3.select("#country_selectbutton").on("change", function(event, d) {
            // recover the option that has been chosen
            const selected_country = d3.select(this).property("value")

            // run the update function with the selected option
            update(selected_country)
        })

    })

}

export function CountriesLegend(div_id) {

    d3.select("#legend1").selectAll("*").remove()

    d3.csv(linechart_data).then(function(data) {

        var svg = d3.select(div_id)

        // get all the countries
        const legend_countries = new Set(data.map(d => d.country_name))

        // set color scheme for legend circles and labels
        const color_scheme = d3.scaleOrdinal()
                               .domain(legend_countries)
                               .range(["darkred", "orange", "blue", "green", "magenta", "grey", "teal", "goldenrod", 
                                "palevioletred", "slateblue", "purple", "lightskyblue", "limegreen", "darksalmon"]);

        // add a circle for each country
        const size = 20
        svg.selectAll("mydots")
        .data(legend_countries)
        .enter()
        .append("rect")
            .attr("x", 270)
            .attr("y", function(d,i){ return 100 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("width", size)
            .attr("height", size)
            .style("fill", function(d){ return color_scheme(d)})

        // Add one dot in the legend for each name.
        svg.selectAll("mylabels")
        .data(legend_countries)
        .enter()
        .append("text")
            .attr("x", 300)
            .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d){ return color_scheme(d)})
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
    })
}

// export function RegionsLegend(div_id) {

//     d3.select("#legend2").selectAll("*").remove()

//     d3.csv(smallmult_data_region).then(function(data) {

//         var svg = d3.select(div_id)

//         // get all the regions
//         const legend_regions = new Set(data.map(d => d.region))
        
//         // set color scheme for legend circles and labels
//         const color_scheme = d3.scaleOrdinal()
//                                .domain(legend_regions)
//                                .range(d3.schemeDark2);

//         // add a circle for each region
//         svg.selectAll("circles")
//             .data(legend_regions)
//             .enter()
//             .append("circle")
//                 .attr("cx", 280)
//                 .attr("cy", function(d, i){ return 100 + i*25}) 
//                 .attr("r", 7)
//                 .style("fill", d => color_scheme(d))

//         // add the region labels to each circle
//         svg.selectAll("textlabels")
//             .data(legend_regions)
//             .enter()
//             .append("text")
//                 .attr("x", 300)
//                 .attr("y", function(d, i){ return 100 + i*25}) 
//                 .style("fill", d => color_scheme(d))
//                 .text(d => d)
//                 .attr("text-anchor", "left")
//                 .style("alignment-baseline", "middle")
//                 .style("font", "14px arial");
//     })
// }

export function BarChart(measure) {

    d3.select("#bar").selectAll("*").remove()

    // set the dimensions and margins of the graph
    const margin2 = {top: 25, right: 30, bottom: 70, left: 60},
        width = 850 - margin2.left - margin2.right,
        height = 450 - margin2.top - margin2.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#bar")
        .attr("width", width + margin2.left + margin2.right)
        .attr("height", height + margin2.top + margin2.bottom)
    .append("g")
        .attr("transform", `translate(${margin2.left}, ${margin2.top})`);

    // initialize x axis
    const x = d3.scaleBand()
                .range([0, width])
                .padding(0.2);
    const xAxis = svg.append("g")
                     .attr("transform", `translate(0, ${height})`)
                     .style("font", "14px arial");

    // initialize y axis
    const y = d3.scaleLinear()
                .range([height, 0]);
    const yAxis = svg.append("g")
                     .attr("class", "myYaxis")
                     .transition()
                     .duration(1000)
                     .style("font", "14px arial");

    // add y axis label
    const title = "CO2 Emissions" + " " + "(" + measure + ")"
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -90)
        .attr("y", 3)
        .attr("dy", "-2.5em")
        .attr("transform", "rotate(-90)")
        .text(title)
        .style("font", "18px arial");

    // load the data
    d3.csv(barchart_data).then(function(data) {

        const subset = data.filter(d => d.metric == measure)
        
        // add x axis
        x.domain(subset.map(d => d.country_name));
        xAxis
                .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("x", 2)
            .attr("y", 15)
            .attr("transform", "rotate(30)")
            .style("text-anchor", "start");

        // add updated y axis
        y.domain([0, d3.max(subset, d => +d.co2)+1]);
        yAxis.call(d3.axisLeft(y));

        // obtain list of all countries
        const all_countries = new Set(subset.map(d => d.country_name))

        // set the color scheme
        const color_scheme = d3.scaleOrdinal()
                                .domain(all_countries)
                                .range(["darkred", "orange", "blue", "green", "magenta", "grey", "teal", "goldenrod", 
                                "palevioletred", "slateblue", "purple", "lightskyblue", "limegreen", "darksalmon"]);

        // map the data to the bars
        svg.append("g")
            .selectAll()
                .data(subset)
                .enter()
                .append("rect")
                    .attr("x", d => x(d.country_name))
                    .attr("y", d => y(d.co2))
                    .attr("width", x.bandwidth())
                    .attr("height", d => height - y(d.co2))
                    .attr("fill", d => color_scheme(d.country_name))
            
    })
}

export function SmallMultiplesCountry() {
    
    d3.select("#smallmultiples").selectAll("*").remove()

    // dimensions and margins of the chart
    const margin = {top: 30, right: 0, bottom: 30, left: 50},
    width = 210 - margin.left - margin.right,
    height = 280 - margin.top - margin.bottom;

    // load in the data
    d3.csv(smallmult_data_country).then(function(data) {

        // group the data by country
        const sumstat = d3.group(data, d => d.country_name) 

        // get a set of all the countries
        const all_countries = new Set(data.map(d => d.country_name))

        // add svg element for each group
        const svg = d3.select("#smallmultiples")
                    .selectAll("uniqueChart")
                    .data(sumstat)
                    .enter()
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                            `translate(${margin.left}, ${margin.top})`);

        // add x axis in date format
        var format_date = d3.timeParse("%Y-%m-%d")
        const x = d3.scaleTime()
                    .domain(d3.extent(data, d => format_date(d.date)))
                    .range([0, width]);
                svg
                    .append("g")
                    .style("font", "11px arial")
                    .transition()
                    .duration(1000)
                    .attr("transform", `translate(0, ${height})`)
                    .call(d3.axisBottom(x).ticks(3));

        // add y axis, linear format
        const y = d3.scaleLinear()
                    .domain([0, 20])
                    .range([height, 0]);
        const yAxis = svg.append("g")
                    .style("font", "12px arial")
                    .transition()
                    .duration(1000)
                    .call(d3.axisLeft(y).ticks(5));

        // define color palette as usual
        const color = d3.scaleOrdinal()
                        .domain(all_countries)
                        .range(["darkred", "orange", "blue", "green", "magenta", "grey", "teal", "goldenrod", "palevioletred", 
                        "slateblue", "purple", "lightskyblue", "limegreen", "darksalmon"])

        // draw the lines on each plot
        svg.append("path")
            .transition()
            .duration(2000)
            .attr("fill", "none")
            .attr("stroke", d => color(d[0]))
            .attr("stroke-width", 2.5)
            .attr("d", function(d){
                return d3.line()
                .x(d => x(format_date(d.date)))
                .y(d => y(+d.co2))
                (d[1])
    })

    // add variable titles to each plot
    svg.append("text")
        .attr("text-anchor", "start")
        .attr("y", -5)
        .attr("x", 0)
        .transition()
        .duration(1000)
        .text(d => (d[0]))
        .style("fill", d => color(d[0]))

    })

}

// export function SmallMultiplesRegion() {

//     d3.select("#smallmultiples").selectAll("*").remove()

//     // dimensions and margins of the chart
//     const margin = {top: 30, right: 0, bottom: 30, left: 50},
//     width = 280 - margin.left - margin.right,
//     height = 290 - margin.top - margin.bottom;

//     // load in the data
//     d3.csv(smallmult_data_region).then(function(data) {

//         // group the data by country
//         const sumstat = d3.group(data, d => d.region) 

//         // get a set of all the countries
//         const all_countries = new Set(data.map(d => d.region))

//         // add svg element for each group
//         const svg = d3.select("#smallmultiples")
//                     .selectAll("uniqueChart")
//                     .data(sumstat)
//                     .enter()
//                     .append("svg")
//                     .attr("width", width + margin.left + margin.right)
//                     .attr("height", height + margin.top + margin.bottom)
//                     .append("g")
//                     .attr("transform",
//                             `translate(${margin.left}, ${margin.top})`);

//         // add x axis in date format
//         var format_date = d3.timeParse("%Y-%m-%d")
//         const x = d3.scaleTime()
//                     .domain(d3.extent(data, d => format_date(d.date)))
//                     .range([0, width]);
//                 svg
//                     .append("g")
//                     .style("font", "11px arial")
//                     .transition()
//                     .duration(1000)
//                     .attr("transform", `translate(0, ${height})`)
//                     .call(d3.axisBottom(x).ticks(3));

//         // add y axis, linear format
//         const y = d3.scaleLinear()
//                     .domain([0, 18])
//                     .range([height, 0]);
//         const yAxis = svg.append("g")
//                     .style("font", "12px arial")
//                     .transition()
//                     .duration(1000)
//                     .call(d3.axisLeft(y).ticks(5));

//         // define color palette as usual
//         const color = d3.scaleOrdinal()
//                         .domain(all_countries)
//                         .range(d3.schemeDark2)

//         // draw the lines on each plot
//         svg.append("path")
//             .transition()
//             .duration(2000)
//             .attr("fill", "none")
//             .attr("stroke", d => color(d[0]))
//             .attr("stroke-width", 2.5)
//             .attr("d", function(d){
//                 return d3.line()
//                 .x(d => x(format_date(d.date)))
//                 .y(d => y(+d.co2))
//                 (d[1])
//     })

//     // add variable titles to each plot
//     svg.append("text")
//         .attr("text-anchor", "start")
//         .attr("y", -5)
//         .attr("x", 0)
//         .transition()
//         .duration(1000)
//         .text(d => (d[0]))
//         .style("fill", d => color(d[0]))

//     })

// }

export function StackedAreaChart() {

    d3.select("#line").selectAll("*").remove()

    // set the dimensions and margins of the graph
    const margin = {top: 60, right: 230, bottom: 50, left: 50},
        width = 950 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    // append svg object to body of the page
    const svg = d3.select("#line")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            `translate(${margin.left}, ${margin.top})`);

    // load the data
    d3.csv(areachart_data).then(function(data) {

        // get the column names
        const keys = data.columns.slice(0, -2)
        console.log(keys)

        // define color palette
        const color = d3.scaleOrdinal()
            .domain(keys)
            .range(["darkred", "orange", "blue", "green", "magenta", "grey", "teal", "goldenrod", 
            "palevioletred", "slateblue", "purple", "lightskyblue", "limegreen", "darksalmon"]);

        const stackedData = d3.stack()
            .keys(keys)
            (data)

        ////////// AXIS //////////

        var format_date = d3.timeParse("%Y-%m-%d")

        // add X axis
        const x = d3.scaleTime()
            .domain(d3.extent(data, d => format_date(d.date)))
            .range([0, width]);
        const xAxis = svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).ticks(5))
            .style("font", "14px arial");

        // add Y axis
        const y = d3.scaleLinear()
            .domain([0, 115])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y).ticks(5))
            .transition()
            .duration(1500)
            .style("font", "14px arial");


        ////////// BRUSHING AND CHART //////////

        // add a clipPath: everything out of this area won't be drawn
        const clip = svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0);

        // add brushing
        const brush = d3.brushX() // add the brush feature using the d3.brush function
            .extent([[0, 0], [width, height]]) // initialise the brush area: start at 0,0 and finishes at width,height
            .on("end", updateChart) // each time the brush selection changes, call 'updateChart' function

        const areaChart = svg.append('g')
            .attr("clip-path", "url(#clip)")

        // area generator
        const area = d3.area()
            .x(d => x(format_date(d.data.date)))
            .y0(d => y(d[0]))
            .y1(d => y(d[1]))

        // show the stacked areas
        areaChart
            .selectAll("mylayers")
            .data(stackedData)
            .join("path")
            .attr("class", d => "myArea " + d.key)
            .style("fill", d => color(d.key))
            .attr("d", area)

        // add brushing
        areaChart
            .append("g")
            .attr("class", "brush")
            .call(brush);

        let idleTimeout
        function idled() { idleTimeout = null; }

        // function that updates the chart for given boundaries
        function updateChart(event, d) {

            const extent = event.selection

            // if no selection, back to initial coordinate, else update X axis domain
            if (!extent) {
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350);
                x.domain(d3.extent(data, d => format_date(d.date)))
            } else {
                x.domain([x.invert(extent[0]), x.invert(extent[1])])
                areaChart.select(".brush").call(brush.move, null)
            }

            // update axis and area position
            xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5))
            areaChart
            .selectAll("path")
            .transition().duration(1000)
            .attr("d", area)

        }

        ////////// HIGHLIGHT GROUP //////////
        // when one group is hovered
        const highlight1 = function(event, d) {
            // reduce opacity of all groups
            d3.selectAll(".myArea").style("opacity", .1)
            // expect the one that is hovered
            d3.select("."+d).style("opacity", 1)
        }

        // And when it is not hovered anymore
        const unhighlight1 = function(event, d) {
            d3.selectAll(".myArea").style("opacity", 1)
        }

        ////////// LEGEND //////////
        // add a square in the legend for each country
        const size = 20
        svg.selectAll("myrect")
        .data(keys)
        .join("rect")
            .attr("x", 700)
            .attr("y", function(d, i){ return 20 + i*(size+5)})
            .attr("width", size)
            .attr("height", size)
            .style("fill", d => color(d))
            .on("mouseover", highlight1)
            .on("mouseleave", unhighlight1)

        // add labels for each country
        svg.selectAll("mylabels")
        .data(keys)
        .join("text")
            .attr("x", 730)
            .attr("y", function(d, i){ return 20 + i*(size+5) + (size/2) })
            .style("fill", d => color(d))
            .text(d => d)   
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .on("mouseover", highlight1)
            .on("mouseleave", unhighlight1)

    })
}

export function ParallelCoord() {

    // use same div as small multiples since we will toggle between the two
    d3.select("#smallmultiples").selectAll("*").remove()

    // dimensions and margins of the graph
    const margin = {top: 30, right: 50, bottom: 10, left: 50},
    width = 870 - margin.left - margin.right,
    height = 820 - margin.top - margin.bottom;

    const svg = d3.select("#smallmultiples")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                        `translate(${margin.left}, ${margin.top})`);

    // load in the data
    d3.csv(parallecoord_data).then(function(data) {

        const all_countries = ["Australia", "Brazil", "Canada", "China", "France", "Germany",
                               "India", "Italy", "Japan", "Mexico", "Norway", "USA"]

        // set color palette
        const color_pc = d3.scaleOrdinal()
            .domain(all_countries)
            .range(["darkred", "orange", "blue", "green", "magenta", "grey", "teal", "goldenrod", "palevioletred", "slateblue", "purple", "lightskyblue"])

        // array of dimensions
        const dimensions = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018']

        // for each dimension, build a linear scale and store in object y
        const y_res = {}
        for (let i = 0; i < dimensions.length; i++) {
            const c_name = dimensions[i]
            y_res[c_name] = d3.scaleLinear()
            .domain([0, 20])
            .range([height, 0])
        }

        // define X scale
        const x = d3.scalePoint()
            .range([0, width])
            .domain(dimensions);

        // highlight the country that is hovered
        const highlight2 = function(event, d) {

            const selected_country = d.country_name

            // first every group turns grey
            d3.selectAll(".line")
            .transition().duration(200)
            .style("stroke", "lightgrey")
            .style("opacity", "0.2")
            
            // second the hovered country gets its color
            d3.selectAll("." + selected_country)
            .transition().duration(100)
            .style("stroke", color_pc(selected_country))
            .style("opacity", "1")
        }

        // unhighlight function
        const unhighlight2 = function(event, d) {
            d3.selectAll(".line")
            .transition()
            .duration(200)
            .delay(700)
            .style("stroke", d => color_pc(d.country_name))
            .style("opacity", "1")
        }

        function path(d) {
            return d3.line()(dimensions.map(function(p) { return [x(p), y_res[p](d[p])]; }));
        }

        // draw the lines
        svg
            .selectAll("myPath")
            .data(data)
            .join("path")
            .attr("class", d => "line " + d.country_name)
            .attr("d",  path)
            .style("fill", "none")
            .style("stroke", d => color_pc(d.country_name))
            .style("opacity", 1)
            .style("stroke-width", 4.25)
            .on("mouseover", highlight2)
            .on("mouseleave", unhighlight2)

        svg.selectAll("myAxis")
            .data(dimensions).enter()
            .append("g")
            .attr("class", "axis")
            .attr("transform", d => `translate(${x(d)})`)
            .style("font", "12px arial")
            .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y_res[d])); })
            .append("text")
            .style("text-anchor", "left")
            .attr("y", -15)
            .text(d => d)
            .style("fill", "black")
            .style("font", "15px arial");

    })

}