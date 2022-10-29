import * as d3 from "d3";
import csvPath from '../assets/data/directorMoviesYearOut.csv';


export async function drawHisto(data, id) {

    // Format container
    var margin = { top: 5, right: 10, bottom: 60, left: 160 };
    var height = 330;
    var width = 900;

    // append the svg object to the body of the page
    var Svg = d3.select("#histo")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Get data for x axis (year)
    var x = d3.scaleBand().domain(data.map(d => d.year))
        .rangeRound([margin.left, width - margin.right])
        .padding(0.1);
    // .padding(0.1);

    // Create xAxis element for histogram
    var xAxis = Svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-60)");


    // Get data for y axis (count per year)
    var y = d3.scaleLinear().domain([0, d3.max(data, d => d.count)]).nice()
        .rangeRound([height - margin.bottom, margin.top]);

    // Create yAxis element for histogram
    var yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .attr("stroke", "#06035a?")
        .call(d3.axisLeft(y))

    Svg.append("g")
        .call(yAxis)
        .call(g => g.select(".tick:last-of-type text")
            .clone()
            .attr("transform", `rotate(-90)`)
            .attr("text-anchor", "middle")
            .attr("x", -(15 - margin.top - margin.bottom) / 2)
            .attr("y", -80)
            .attr("font-weight", "bold"))

    // Create xAxis title element
    const xTitle = g => g.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 14)
        .attr("x", 70 + (width - margin.left - margin.right) / 2)
        .attr("y", height - margin.bottom + 60)
        .text("Movie Release Year");

    // Create yAxis title element
    const yTitle = g => g.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 14)
        .attr("y", margin.left - 30)
        .attr("x", -(height - margin.top - margin.bottom + 110) / 2)
        .text("Movie Count");

    // Create chart title element
    const chartTitle = g => g.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 22)
        .attr("font-weight", 300)
        .attr("y", 15 + margin.top)
        .attr("x", 30 + (width - margin.left - margin.right - 160) / 2)
        .text("Release Year Of Comedy Movies On Netflix")
        .attr("text-anchor", "center");

    Svg.append("g")
        .call(xTitle);

    Svg.append("g")
        .call(yTitle)
        .attr("transform", `rotate(-90)`);

    Svg.append("g")
        .call(chartTitle);


    // Add a clipPath: everything out of this area won't be drawn.
    var clip = Svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

    // Add brushing
    var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
        .extent([[0, 0], [width, height]]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function

    var histo = Svg.append('g')
        .attr("clip-path", "url(#clip)")

    histo.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.year))
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => y(0) - y(d.count))
        .attr("fill", "#417eb4");

    // Add the brushing
    histo.append("g")
        .attr("class", "brush")
        .call(brush);

    // A function that set idleTimeOut to null
    var idleTimeout
    function idled() { idleTimeout = null; }

    // A function that update the chart for given boundaries
    function updateChart(event) {

        var extent = event.selection
        console.log(extent)

        // If no selection, back to initial coordinate. Otherwise, update X axis domain
        if (!extent) {
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
            x.domain([1979, 2022])
        } else {
            x.domain([x.invert(extent[0]), x.invert(extent[1])])
            histo.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
        }

        // Update axis and circle position
        xAxis.transition().duration(1000).call(d3.axisBottom(x))
        histo
            .selectAll("rect")
                .transition().duration(1000)
                // .data(data)
                // .join("rect")
                .attr("x", d => x(d.year))
                .attr("y", d => y(d.count))
                .attr("width", x.bandwidth())
                .attr("height", d => y(0) - y(d.count))
                .attr("fill", "#417eb4");


    }

    // custom invert function
    x.invert = function(x){ return d3.scaleQuantize().domain(this.range()).range(this.domain())(x);}

    const movieData = await d3.csv(csvPath); // Import movie data for each director for radio button selection
    const movieByDirector = d3.group(movieData, d => d.Director);

    // console.log(rect.nodes().map(function (d) { return d.getAttribute("x"); }))

    d3.selectAll(("input[name='stack']")).on("change", function () {
        var director = this.value
        switch (director) {
            case 'Ryan Polito':
                d3.selectAll("#releaseYear").remove();
                d3.selectAll("#yearCount").remove();
                var currentMovies = movieByDirector.get('Ryan Polito');
                var currentByYear = d3.group(currentMovies, d => d.release_year);
                currentByYear.forEach(d => Svg.append("text").attr("id", "yearCount").attr("x", 3 + 868 - 19 * (2022 - d[0].release_year)).attr("y", height - 75).text(d.length).attr("stroke", "orange"));
                currentByYear.forEach(d => Svg.append("circle").attr("id", "releaseYear").attr("cx", 9 + 868 - 19 * (2022 - d[0].release_year)).attr("cy", height - 65).attr("r", 4).attr('fill', 'orange'));
                break;
            case 'Jay Karas':
                d3.selectAll("#releaseYear").remove();
                d3.selectAll("#yearCount").remove();
                var currentMovies = movieByDirector.get('Jay Karas');
                var currentByYear = d3.group(currentMovies, d => d.release_year);
                currentByYear.forEach(d => Svg.append("text").attr("id", "yearCount").attr("x", 3 + 868 - 19 * (2022 - d[0].release_year)).attr("y", height - 75).text(d.length).attr("stroke", "orange"));
                currentByYear.forEach(d => Svg.append("circle").attr("id", "releaseYear").attr("cx", 9 + 868 - 19 * (2022 - d[0].release_year)).attr("cy", height - 65).attr("r", 4).attr('fill', 'orange'));
                break;
            case 'Jay Chapman':
                d3.selectAll("#releaseYear").remove();
                d3.selectAll("#yearCount").remove();
                var currentMovies = movieByDirector.get('Jay Chapman');
                var currentByYear = d3.group(currentMovies, d => d.release_year);
                currentByYear.forEach(d => Svg.append("text").attr("id", "yearCount").attr("x", 3 + 868 - 19 * (2022 - d[0].release_year)).attr("y", height - 75).text(d.length).attr("stroke", "orange"));
                currentByYear.forEach(d => Svg.append("circle").attr("id", "releaseYear").attr("cx", 9 + 868 - 19 * (2022 - d[0].release_year)).attr("cy", height - 65).attr("r", 4).attr('fill', 'orange'));
                break;
            case 'Marcus Raboy':
                d3.selectAll("#releaseYear").remove();
                d3.selectAll("#yearCount").remove();
                var currentMovies = movieByDirector.get('Marcus Raboy');
                var currentByYear = d3.group(currentMovies, d => d.release_year);
                currentByYear.forEach(d => Svg.append("text").attr("id", "yearCount").attr("x", 3 + 868 - 19 * (2022 - d[0].release_year)).attr("y", height - 75).text(d.length).attr("stroke", "orange"));
                currentByYear.forEach(d => Svg.append("circle").attr("id", "releaseYear").attr("cx", 9 + 868 - 19 * (2022 - d[0].release_year)).attr("cy", height - 65).attr("r", 4).attr('fill', 'orange'));
                break;
            case 'Raúl Campos':
                d3.selectAll("#releaseYear").remove();
                d3.selectAll("#yearCount").remove();
                var currentMovies = movieByDirector.get('Ryan Polito');
                var currentByYear = d3.group(currentMovies, d => d.release_year);
                currentByYear.forEach(d => Svg.append("text").attr("id", "yearCount").attr("x", 3 + 868 - 19 * (2022 - d[0].release_year)).attr("y", height - 75).text(d.length).attr("stroke", "orange"));
                currentByYear.forEach(d => Svg.append("circle").attr("id", "releaseYear").attr("cx", 9 + 868 - 19 * (2022 - d[0].release_year)).attr("cy", height - 65).attr("r", 4).attr('fill', 'orange'));
                break;
            case 'Jan Suter':
                d3.selectAll("#releaseYear").remove();
                d3.selectAll("#yearCount").remove();
                var currentMovies = movieByDirector.get('Jan Suter');
                var currentByYear = d3.group(currentMovies, d => d.release_year);
                currentByYear.forEach(d => Svg.append("text").attr("id", "yearCount").attr("x", 3 + 868 - 19 * (2022 - d[0].release_year)).attr("y", height - 75).text(d.length).attr("stroke", "orange"));
                currentByYear.forEach(d => Svg.append("circle").attr("id", "releaseYear").attr("cx", 9 + 868 - 19 * (2022 - d[0].release_year)).attr("cy", height - 65).attr("r", 4).attr('fill', 'orange'));
                break;
            default:
                console.log('No Selection')
        }

    });



}
