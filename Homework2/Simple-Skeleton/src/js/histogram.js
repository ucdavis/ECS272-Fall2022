import * as d3 from "d3";
import csvPath from '../assets/data/directorMoviesYearOut.csv';


export async function drawHisto(data, id) {

    // Format container
    const margin = { top: 5, right: 10, bottom: 60, left: 160 };
    const height = 330;
    const width = 900;

    // Get data for x axis (year)
    const x = d3.scaleBand().domain(data.map(d => d.year))
        .rangeRound([margin.left, width - margin.right])
        .padding(0.1);

    // Get data for y axis (count per year)
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.count)]).nice()
        .rangeRound([height - margin.bottom, margin.top]);

    // Append svg for plot
    let svg = d3.select(id).append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    // Add histogram rectangles
    var rects = svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", d => x(d.year))
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => y(0) - y(d.count))
        .attr("fill", "#417eb4");

    // Create xAxis element for histogram
    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        // .attr("stroke", "#06035a")
        .call(d3.axisBottom(x).tickSize([15]))

    // Create yAxis element for histogram
    const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .attr("stroke", "#06035a?")
        .call(d3.axisLeft(y))

    // Create xAxis title element
    const xTitle = g => g.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 14)
        .attr("x", 70+(width-margin.left-margin.right)/2)
        .attr("y", height - margin.bottom + 60)
        .text("Movie Release Year");

    // Create yAxis title element
    const yTitle = g => g.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 14)
        .attr("y", margin.left - 30)
        .attr("x", -(height-margin.top-margin.bottom+110)/2)
        .text("Movie Count");

    // Create chart title element
    const chartTitle = g => g.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 22)
        .attr("font-weight", 300)
        .attr("y", 15+margin.top)
        .attr("x", 30+(width-margin.left-margin.right-160)/2)
        .text("Release Year Of Comedy Movies On Netflix")
        .attr("text-anchor","center");

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
        .attr("transform", "rotate(-60)");

    svg.append("g")
        .call(yAxis)
        .call(g => g.select(".tick:last-of-type text")
            .clone()
            .attr("transform", `rotate(-90)`)
            .attr("text-anchor", "middle")
            .attr("x", -(15 - margin.top - margin.bottom) / 2)
            .attr("y", -80)
            .attr("font-weight", "bold"))

    const movieData = await d3.csv(csvPath); // Import movie data for each director for radio button selection
    const movieByDirector = d3.group(movieData, d => d.Director);

    console.log(rects.nodes().map(function(d) {return d.getAttribute("x");}))

    d3.selectAll(("input[name='stack']")).on("change", function () {
        var director = this.value
        switch (director) {
            case 'Ryan Polito':
                d3.selectAll("#releaseYear").remove();
                d3.selectAll("#yearCount").remove();
                var currentMovies = movieByDirector.get('Ryan Polito');
                var currentByYear = d3.group(currentMovies, d => d.release_year);
                currentByYear.forEach(d=> svg.append("text").attr("id","yearCount").attr("x",3+868-19*(2022-d[0].release_year)).attr("y", height-75).text(d.length).attr("stroke","orange"));
                currentByYear.forEach(d => svg.append("circle").attr("id","releaseYear").attr("cx",9+868-19*(2022-d[0].release_year)).attr("cy",height-65).attr("r",4).attr('fill','orange'));
                break;
            case 'Jay Karas':
                d3.selectAll("#releaseYear").remove();
                d3.selectAll("#yearCount").remove();
                var currentMovies = movieByDirector.get('Jay Karas');
                var currentByYear = d3.group(currentMovies, d => d.release_year);
                currentByYear.forEach(d=> svg.append("text").attr("id","yearCount").attr("x",3+868-19*(2022-d[0].release_year)).attr("y", height-75).text(d.length).attr("stroke","orange"));
                currentByYear.forEach(d => svg.append("circle").attr("id","releaseYear").attr("cx",10+868-19*(2022-d[0].release_year)).attr("cy",height-65).attr("r",4).attr('fill','orange'));
                break;
            case 'Jay Chapman':
                d3.selectAll("#releaseYear").remove();
                d3.selectAll("#yearCount").remove();
                var currentMovies = movieByDirector.get('Jay Chapman');
                var currentByYear = d3.group(currentMovies, d => d.release_year);
                currentByYear.forEach(d=> svg.append("text").attr("id","yearCount").attr("x",3+868-19*(2022-d[0].release_year)).attr("y", height-75).text(d.length).attr("stroke","orange"));
                currentByYear.forEach(d => svg.append("circle").attr("id","releaseYear").attr("cx",10+868-19*(2022-d[0].release_year)).attr("cy",height-65).attr("r",4).attr('fill','orange'));
                break;
            case 'Marcus Raboy':
                d3.selectAll("#releaseYear").remove();
                d3.selectAll("#yearCount").remove();
                var currentMovies = movieByDirector.get('Marcus Raboy');
                var currentByYear = d3.group(currentMovies, d => d.release_year);
                currentByYear.forEach(d=> svg.append("text").attr("id","yearCount").attr("x",3+868-19*(2022-d[0].release_year)).attr("y", height-75).text(d.length).attr("stroke","orange"));
                currentByYear.forEach(d => svg.append("circle").attr("id","releaseYear").attr("cx",10+868-19*(2022-d[0].release_year)).attr("cy",height-65).attr("r",4).attr('fill','orange'));
                break;
            case 'Raúl Campos':
                d3.selectAll("#releaseYear").remove();
                d3.selectAll("#yearCount").remove();
                var currentMovies = movieByDirector.get('Ryan Polito');
                var currentByYear = d3.group(currentMovies, d => d.release_year);
                currentByYear.forEach(d=> svg.append("text").attr("id","yearCount").attr("x",3+868-19*(2022-d[0].release_year)).attr("y", height-75).text(d.length).attr("stroke","orange"));
                currentByYear.forEach(d => svg.append("circle").attr("id","releaseYear").attr("cx",10+868-19*(2022-d[0].release_year)).attr("cy",height-65).attr("r",4).attr('fill','orange'));
                break;
            case 'Jan Suter':
                d3.selectAll("#releaseYear").remove();
                d3.selectAll("#yearCount").remove();
                var currentMovies = movieByDirector.get('Jan Suter');
                var currentByYear = d3.group(currentMovies, d => d.release_year);
                currentByYear.forEach(d=> svg.append("text").attr("id","yearCount").attr("x",3+868-19*(2022-d[0].release_year)).attr("y", height-75).text(d.length).attr("stroke","orange"));
                currentByYear.forEach(d => svg.append("circle").attr("id","releaseYear").attr("cx",10+868-19*(2022-d[0].release_year)).attr("cy",height-65).attr("r",4).attr('fill','orange'));
                break;
            default:
                console.log('No Selection')
        }
    
    });



}
