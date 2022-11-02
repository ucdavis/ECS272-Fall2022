import * as d3 from "d3";
import linechart_data from '../assets/data/linechart_data.csv'; // data for line chart
import barchart_data from '../assets/data/barchart_data2.csv'; // data for bar chart
import smallmult_data_country from '../assets/data/smallmult_data_country.csv'; // data for small multiples (country)
import smallmult_data_region from '../assets/data/smallmult_data_region.csv'; // data for small multiples (region)

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

export function LineChart(selectbutton_id) {

    const margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 850 - margin.left - margin.right,
        height = 340 - margin.top - margin.bottom;

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
        d3.select(selectbutton_id)
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
        
        // add x axis label
        svg.append("text")
           .attr("class", "x label")
           .attr("text-anchor", "end")
           .transition()
           .duration(1000)
           .attr("x", width - 400)
           .attr("y", height + 30)
           .text("Year")
           .style("font", "18px arial");;

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

        // y axis label
        svg.append("text")
           .attr("class", "y label")
           .attr("text-anchor", "end")
           .transition()
           .duration(1000)
           .attr("x", -80)
           .attr("y", 3)
           .attr("dy", "-2.5em")
           .attr("transform", "rotate(-90)")
           .text("CO2 Emissions")
           .style("font", "18px arial");

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
        d3.select(selectbutton_id).on("change", function(event, d) {
            // recover the option that has been chosen
            const selected_country = d3.select(this).property("value")

            // run the update function with the selected option
            update(selected_country)
        })

    })

}

export function CountriesLegend(div_id) {

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
        svg.selectAll("circles")
            .data(legend_countries)
            .enter()
            .append("circle")
                .attr("cx", 280)
                .attr("cy", function(d, i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("r", 7)
                .style("fill", d => color_scheme(d))

        // add the country labels to each circle
        svg.selectAll("textlabels")
            .data(legend_countries)
            .enter()
            .append("text")
                .attr("x", 300)
                .attr("y", function(d, i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
                .style("fill", d => color_scheme(d))
                .text(d => d)
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .style("font", "14px arial");
    })
}

export function RegionsLegend(div_id) {

    d3.csv(smallmult_data_region).then(function(data) {

        var svg = d3.select(div_id)

        // get all the regions
        const legend_regions = new Set(data.map(d => d.region))
        
        // set color scheme for legend circles and labels
        const color_scheme = d3.scaleOrdinal()
                               .domain(legend_regions)
                               .range(d3.schemeDark2);

        // add a circle for each region
        svg.selectAll("circles")
            .data(legend_regions)
            .enter()
            .append("circle")
                .attr("cx", 280)
                .attr("cy", function(d, i){ return 100 + i*25}) 
                .attr("r", 7)
                .style("fill", d => color_scheme(d))

        // add the region labels to each circle
        svg.selectAll("textlabels")
            .data(legend_regions)
            .enter()
            .append("text")
                .attr("x", 300)
                .attr("y", function(d, i){ return 100 + i*25}) 
                .style("fill", d => color_scheme(d))
                .text(d => d)
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .style("font", "14px arial");
    })
}

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
                     .style("font", "12px arial");

    // initialize y axis
    const y = d3.scaleLinear()
                .range([height, 0]);
    const yAxis = svg.append("g")
                     .attr("class", "myYaxis")
                     .style("font", "14px arial");

    // add y axis label
    const title = "CO2 Emissions" + " " + "(" + measure + ")"
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .transition()
        .duration(1000)
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
        xAxis.transition()
                .duration(1000)
                .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("x", 2)
            .attr("y", 15)
            .attr("transform", "rotate(30)")
            .style("text-anchor", "start");

        // add updated y axis
        y.domain([0, d3.max(subset, function(d) { return +d.co2 })+2]);
        yAxis.transition()
                .duration(1000)
                .call(d3.axisLeft(y));

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
                .transition()
                .duration(1000)
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

export function SmallMultiplesRegion() {

    d3.select("#smallmultiples").selectAll("*").remove()

    // dimensions and margins of the chart
    const margin = {top: 30, right: 0, bottom: 30, left: 50},
    width = 280 - margin.left - margin.right,
    height = 290 - margin.top - margin.bottom;

    // load in the data
    d3.csv(smallmult_data_region).then(function(data) {

        // group the data by country
        const sumstat = d3.group(data, d => d.region) 

        // get a set of all the countries
        const all_countries = new Set(data.map(d => d.region))

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
                    .domain([0, 18])
                    .range([height, 0]);
        const yAxis = svg.append("g")
                    .style("font", "12px arial")
                    .transition()
                    .duration(1000)
                    .call(d3.axisLeft(y).ticks(5));

        // define color palette as usual
        const color = d3.scaleOrdinal()
                        .domain(all_countries)
                        .range(d3.schemeDark2)

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