import * as d3 from "d3";
import csvPath from '../assets/data/directorMoviesYearOut.csv';

var smallHisto = 0;
export { smallHisto };


export async function drawHisto(data, id) {
    smallHisto = 0;

    var dataNew = null;

    // Format container
    const margin = { top: 5, right: 10, bottom: 60, left: 160 };
    const height = 330;
    const width = 900;

    // Get data for x axis (year)
    var x = d3.scaleBand().domain(data.map(d => d.year))
        .rangeRound([margin.left, width - margin.right])
        .padding(0.1);

    // Get data for y axis (count per year)
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.count)]).nice()
        .rangeRound([height - margin.bottom, margin.top]);

    // Append svg for plot
    let histo = d3.select(id).append("svg")
        .attr("id", "fullHisto")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    // Add histogram rectangles
    var rects = histo.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => y(0) - y(d.count))
        .attr("fill", "#417eb4")
        .attr("x", d => x(d.year));

    // Create xAxis element for histogram
    var xAxis = g => g
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

    histo.append("g")
        .call(xTitle);

    histo.append("g")
        .call(yTitle)
        .attr("transform", `rotate(-90)`);

    histo.append("g")
        .call(chartTitle);

    histo.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-60)");

    histo.append("g")
        .call(yAxis)
        .call(g => g.select(".tick:last-of-type text")
            .clone()
            .attr("transform", `rotate(-90)`)
            .attr("text-anchor", "middle")
            .attr("x", -(15 - margin.top - margin.bottom) / 2)
            .attr("y", -80)
            .attr("font-weight", "bold"))

    const brush = d3.brushX()
        .on("end", brushed)
        .on("end.snap", brushended);

    histo.append("g")
        .call(brush);


    const movieData = await d3.csv(csvPath); // Import movie data for each director for radio button selection
    const movieByDirector = d3.group(movieData, d => d.Director);

    var rectPos = rects.nodes().map(function (d) { return d.getAttribute("x"); })
    var rectDiff = rectPos[1] - rectPos[0]
    var bandwidth = x.bandwidth()

    d3.selectAll(("input[name='stack']")).on("change", function () {
        var director = this.value
        console.log(director)
        switch (director) {
            case 'Ryan Polito':
                d3.selectAll("#releaseYear").remove();
                d3.selectAll("#yearCount").remove();
                var currentMovies = movieByDirector.get('Ryan Polito');
                var currentByYear = d3.group(currentMovies, d => d.release_year);
                currentByYear.forEach(d => histo.append("text").attr("id", "yearCount").attr("x", rectPos[rectPos.length - 1] - rectDiff * (2022 - d[0].release_year) + 3).attr("y", height - 75).text(d.length).attr("stroke", "orange"));
                currentByYear.forEach(d => histo.append("circle").attr("id", "releaseYear").attr("cx", rectPos[rectPos.length - 1] - rectDiff * (2022 - d[0].release_year) + bandwidth / 2).attr("cy", height - 65).attr("r", 4).attr('fill', 'orange'));
                break;
            case 'Jay Karas':
                d3.selectAll("#releaseYear").remove();
                d3.selectAll("#yearCount").remove();
                var currentMovies = movieByDirector.get('Jay Karas');
                var currentByYear = d3.group(currentMovies, d => d.release_year);
                currentByYear.forEach(d => histo.append("text").attr("id", "yearCount").attr("x", rectPos[rectPos.length - 1] - rectDiff * (2022 - d[0].release_year) + 3).attr("y", height - 75).text(d.length).attr("stroke", "orange"));
                currentByYear.forEach(d => histo.append("circle").attr("id", "releaseYear").attr("cx", rectPos[rectPos.length - 1] - rectDiff * (2022 - d[0].release_year) + bandwidth / 2).attr("cy", height - 65).attr("r", 4).attr('fill', 'orange'));
                break;
            case 'Jay Chapman':
                d3.selectAll("#releaseYear").remove();
                d3.selectAll("#yearCount").remove();
                var currentMovies = movieByDirector.get('Jay Chapman');
                var currentByYear = d3.group(currentMovies, d => d.release_year);
                currentByYear.forEach(d => histo.append("text").attr("id", "yearCount").attr("x", rectPos[rectPos.length - 1] - rectDiff * (2022 - d[0].release_year) + 3).attr("y", height - 75).text(d.length).attr("stroke", "orange"));
                currentByYear.forEach(d => histo.append("circle").attr("id", "releaseYear").attr("cx", rectPos[rectPos.length - 1] - rectDiff * (2022 - d[0].release_year) + bandwidth / 2).attr("cy", height - 65).attr("r", 4).attr('fill', 'orange'));
                break;
            case 'Marcus Raboy':
                d3.selectAll("#releaseYear").remove();
                d3.selectAll("#yearCount").remove();
                var currentMovies = movieByDirector.get('Marcus Raboy');
                var currentByYear = d3.group(currentMovies, d => d.release_year);
                currentByYear.forEach(d => histo.append("text").attr("id", "yearCount").attr("x", rectPos[rectPos.length - 1] - rectDiff * (2022 - d[0].release_year) + 3).attr("y", height - 75).text(d.length).attr("stroke", "orange"));
                currentByYear.forEach(d => histo.append("circle").attr("id", "releaseYear").attr("cx", rectPos[rectPos.length - 1] - rectDiff * (2022 - d[0].release_year) + bandwidth / 2).attr("cy", height - 65).attr("r", 4).attr('fill', 'orange'));
                break;
            case 'Raúl Campos':
                d3.selectAll("#releaseYear").remove();
                d3.selectAll("#yearCount").remove();
                var currentMovies = movieByDirector.get('Ryan Polito');
                var currentByYear = d3.group(currentMovies, d => d.release_year);
                currentByYear.forEach(d => histo.append("text").attr("id", "yearCount").attr("x", rectPos[rectPos.length - 1] - rectDiff * (2022 - d[0].release_year) + 3).attr("y", height - 75).text(d.length).attr("stroke", "orange"));
                currentByYear.forEach(d => histo.append("circle").attr("id", "releaseYear").attr("cx", rectPos[rectPos.length - 1] - rectDiff * (2022 - d[0].release_year) + bandwidth / 2).attr("cy", height - 65).attr("r", 4).attr('fill', 'orange'));
                break;
            case 'Jan Suter':
                d3.selectAll("#releaseYear").remove();
                d3.selectAll("#yearCount").remove();
                var currentMovies = movieByDirector.get('Jan Suter');
                var currentByYear = d3.group(currentMovies, d => d.release_year);
                currentByYear.forEach(d => histo.append("text").attr("id", "yearCount").attr("x", rectPos[rectPos.length - 1] - rectDiff * (2022 - d[0].release_year) + 3).attr("y", height - 75).text(d.length).attr("stroke", "orange"));
                currentByYear.forEach(d => histo.append("circle").attr("id", "releaseYear").attr("cx", rectPos[rectPos.length - 1] - rectDiff * (2022 - d[0].release_year) + bandwidth / 2).attr("cy", height - 65).attr("r", 4).attr('fill', 'orange'));
                break;
            default:
                console.log('No Selection')
        }

    });
    var fnCount = 0;

    function brushed({ selection }) {
        fnCount += 1;
        if (selection) {
            const range = x.domain().map(x);
            var i0 = d3.bisectRight(range, selection[0]) - 1;
            if (i0 < 0) {
                i0 = 0
            }
            var i1 = d3.bisectRight(range, selection[1]) - 1;
            if (i1 === 38) {
                i1 = 37
            }
            if (fnCount % 2 == 0) {
                dataNew = data.filter(function (d) { return (d.year >= x.domain()[i0] && d.year <= x.domain()[i1]) })
                rePlotHisto(dataNew, "#histo")
            }
            rects.attr("fill", (d, i) => i0 <= i && i <= i1 ? "orange" : "#417eb4");
            histo.property("value", x.domain().slice(i0, i1)).dispatch("input");
        } else {
            rects.attr("fill", "#417eb4");
            histo.property("value", []).dispatch("input");
        }

    }

    function brushended({ selection, sourceEvent }) {
        if (!sourceEvent || !selection) return;
        const range = x.domain().map(x), dx = x.step() / 2;
        const x0 = range[d3.bisectRight(range, selection[0])] - dx;
        const x1 = range[d3.bisectRight(range, selection[1]) - 1] + dx;
        d3.select(this).transition().call(brush.move, x1 > x0 ? [x0, x1] : null);
    }

    function rePlotHisto(data, id) {
        smallHisto = 1
        d3.selectAll("#releaseYear").remove();
        d3.selectAll("#yearCount").remove();
        histo.selectAll("rect")
            .transition().duration(2000)
            .attr("x", 2300)
        d3.selectAll("#fullHisto").transition().delay(700).ease(d3.easeLinear).remove();

        console.log("data", data)
        // Get data for x axis (year)
        var x2 = d3.scaleBand().domain(data.map(d => d.year))
            .rangeRound([margin.left, width - margin.right])
            .padding(0.1);

        // Get data for y axis (count per year)
        const y2 = d3.scaleLinear().domain([0, d3.max(data, d => d.count)]).nice()
            .rangeRound([height - margin.bottom, margin.top]);


        // Append svg for plot
        let histo2 = d3.select(id).append("svg")
            .attr("id", "zoomHisto")
            .attr("viewBox", [0, 0, width, height])
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        // Add histogram rectangles
        var rects2 = histo2.selectAll("rect")
            .data(data)
            .join("rect")
            .attr("id","newRect")
            .attr("y", d => y2(d.count))
            .attr("width", x2.bandwidth())
            .attr("height", d => y2(0) - y2(d.count))
            .attr("fill", "#417eb4")
            .transition().duration(2000)
            .attr("x", d => x2(d.year))


        // Create xAxis element for histogram
        var xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .transition().delay(1500)
            // .attr("stroke", "#06035a")
            .call(d3.axisBottom(x2).tickSize([15]))


        // Create yAxis element for histogram
        const yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .transition().delay(1500)
            // .attr("stroke", "#06035a?")
            .call(d3.axisLeft(y2))


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

        histo2.append("g")
            .call(xTitle);

        histo2.append("g")
            .call(yTitle)
            .attr("transform", `rotate(-90)`);

        histo2.append("g")
            .call(chartTitle);

        histo2.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-60)");

        histo2.append("g")
            .call(yAxis)
            .call(g => g.select(".tick:last-of-type text")
                .clone()
                .attr("transform", `rotate(-90)`)
                .attr("text-anchor", "middle")
                .attr("x", -(15 - margin.top - margin.bottom) / 2)
                .attr("y", -80)
                .attr("font-weight", "bold"))

        console.log("x2", x2.domain())
        console.log("data", data)
        // data.forEach(d => { if ("Ryan Polito" in d) { console.log("Ryan Polito In") } })

        d3.selectAll(("input[name='stack']")).on("change", function () {
            var director = this.value
            console.log(director)
            switch (director) {
                case 'Ryan Polito':
                    d3.selectAll("#releaseYear").remove();
                    d3.selectAll("#yearCount").remove();
                    data.forEach(d => {
                        if ("Ryan Polito" in d) {
                            histo2.append("circle")
                                .attr("id", "releaseYear")
                                .attr("cx", x2(d.year) + x2.bandwidth() / 2)
                                .attr("cy", height - 65)
                                .attr("r", 4)
                                .attr('fill', 'orange');
                            histo2.append("text")
                                .attr("id", "yearCount")
                                .attr("x", x2(d.year) + x2.bandwidth() / 2)
                                .attr("y", height - 75)
                                .text(d["Ryan Polito"])
                                .attr("stroke", "orange")
                                .attr("text-anchor", "middle");
                        }
                    })
                    break;
                case 'Jay Karas':
                    d3.selectAll("#releaseYear").remove();
                    d3.selectAll("#yearCount").remove();
                    data.forEach(d => {
                        if ("Jay Karas" in d) {
                            histo2.append("circle")
                                .attr("id", "releaseYear")
                                .attr("cx", x2(d.year) + x2.bandwidth() / 2)
                                .attr("cy", height - 65)
                                .attr("r", 4)
                                .attr('fill', 'orange');
                            histo2.append("text")
                                .attr("id", "yearCount")
                                .attr("x", x2(d.year) + x2.bandwidth() / 2)
                                .attr("y", height - 75)
                                .text(d["Jay Karas"])
                                .attr("stroke", "orange")
                                .attr("text-anchor", "middle");
                        }
                    })
                    break;
                case 'Jay Chapman':
                    d3.selectAll("#releaseYear").remove();
                    d3.selectAll("#yearCount").remove();
                    data.forEach(d => {
                        if ("Jay Chapman" in d) {
                            histo2.append("circle")
                                .attr("id", "releaseYear")
                                .attr("cx", x2(d.year) + x2.bandwidth() / 2)
                                .attr("cy", height - 65)
                                .attr("r", 4)
                                .attr('fill', 'orange');
                            histo2.append("text")
                                .attr("id", "yearCount")
                                .attr("x", x2(d.year) + x2.bandwidth() / 2)
                                .attr("y", height - 75)
                                .text(d["Jay Chapman"])
                                .attr("stroke", "orange")
                                .attr("text-anchor", "middle");
                        }
                    })
                    break;
                case 'Marcus Raboy':
                    d3.selectAll("#releaseYear").remove();
                    d3.selectAll("#yearCount").remove();
                    data.forEach(d => {
                        if ("Marcus Raboy" in d) {
                            histo2.append("circle")
                                .attr("id", "releaseYear")
                                .attr("cx", x2(d.year) + x2.bandwidth() / 2)
                                .attr("cy", height - 65)
                                .attr("r", 4)
                                .attr('fill', 'orange');
                            histo2.append("text")
                                .attr("id", "yearCount")
                                .attr("x", x2(d.year) + x2.bandwidth() / 2)
                                .attr("y", height - 75)
                                .text(d["Marcus Raboy"])
                                .attr("stroke", "orange")
                                .attr("text-anchor", "middle");
                        }
                    })
                    break;
                case 'Raúl Campos':
                    d3.selectAll("#releaseYear").remove();
                    d3.selectAll("#yearCount").remove();
                    data.forEach(d => {
                        if ("Raúl Campos" in d) {
                            histo2.append("circle")
                                .attr("id", "releaseYear")
                                .attr("cx", x2(d.year) + x2.bandwidth() / 2)
                                .attr("cy", height - 65)
                                .attr("r", 4)
                                .attr('fill', 'orange');
                            histo2.append("text")
                                .attr("id", "yearCount")
                                .attr("x", x2(d.year) + x2.bandwidth() / 2)
                                .attr("y", height - 75)
                                .text(d["Raúl Campos"])
                                .attr("stroke", "orange")
                                .attr("text-anchor", "middle");
                        }
                    })
                    break;
                case 'Jan Suter':
                    d3.selectAll("#releaseYear").remove();
                    d3.selectAll("#yearCount").remove();
                    data.forEach(d => {
                        if ("Jan Suter" in d) {
                            histo2.append("circle")
                                .attr("id", "releaseYear")
                                .attr("cx", x2(d.year) + x2.bandwidth() / 2)
                                .attr("cy", height - 65)
                                .attr("r", 4)
                                .attr('fill', 'orange');
                            histo2.append("text")
                                .attr("id", "yearCount")
                                .attr("x", x2(d.year) + x2.bandwidth() / 2)
                                .attr("y", height - 75)
                                .text(d["Jan Suter"])
                                .attr("stroke", "orange")
                                .attr("text-anchor", "middle");
                        }
                    })
                    break;
                default:
                    console.log('No Selection')
            }

        })



    }
}
