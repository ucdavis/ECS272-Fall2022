// Reference: http://bl.ocks.org/nbremer/21746a9668ffdf6d8242

import * as d3 from "d3";

export function drawRadarChart(id, data, options) {
    var cfg = {
        width: 300,				//Width of the circle
        height: 300,				//Height of the circle
        margin: { top: 20, right: 90, bottom: 20, left: 230 }, //The margins of the SVG
        levels: 4,				//How many levels or inner circles should there be drawn
        maxValue: 0, 			//What is the value that the biggest circle will represent
        labelFactor: 1.1, 	//How much farther than the radius of the outer circle should the labels be placed
        wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
        opacityArea: 0.35, 	//The opacity of the area of the blob
        dotRadius: 4, 			//The size of the colored circles of each blob
        opacityCircles: 0.1, 	//The opacity of the circles of each blob
        strokeWidth: 2, 		//The width of the stroke around each blob
        roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
        format: ".0f",
        color: d3.scaleOrdinal(d3.schemeCategory10)	//Color function
    };

    //Put all of the options into a variable called cfg
    if ('undefined' !== typeof options) {
        for (var i in options) {
            if ('undefined' !== typeof options[i]) { cfg[i] = options[i]; }
        }//for i
    }//if

    let maxValue = 0;
    for (let j = 0; j < data.length; j++) {
        for (let i = 0; i < data[j].length; i++) {
            if (data[j][i]["value"] > maxValue) {
                maxValue = data[j][i]["value"];
            }
        }
    }
    maxValue = Math.max(cfg.maxValue, maxValue);

    var allAxis = (data[0].map(function (i, j) { return i.axis })),	//Names of each axis
        total = allAxis.length,					//The number of different axes
        radius = Math.min(cfg.width / 2, cfg.height / 2), 	//Radius of the outermost circle
        Format = d3.format(cfg.format),
        angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

    //Scale for the radius
    var rScale = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue]);

    // Create container SVG and g
    //Remove whatever chart with the same id/class was present before
    d3.select(id).select("svg").remove();

    //Initiate the radar chart SVG
    var svg = d3.select(id).append("svg")
        .attr("width", cfg.width + cfg.margin.left + cfg.margin.right)
        .attr("height", cfg.height + cfg.margin.top + cfg.margin.bottom)
        .attr("class", id);
    //Append a g element		
    var g = svg.append("g")
        .attr("transform", "translate(" + (cfg.width / 2 + cfg.margin.left) + "," + (cfg.height / 2 + cfg.margin.top) + ")");

    //Add pizzazz
    //Filter for the outside glow
    var filter = g.append('defs').append('filter').attr('id', 'glow'),
        feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
        feMerge = filter.append('feMerge'),
        feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
        feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    //Draw circular grid in the container g
    //Wrapper for the grid & axes
    var axisGrid = g.append("g").attr("class", "axisWrapper");

    //Draw the background circles
    axisGrid.selectAll(".levels")
        .data(d3.range(1, (cfg.levels + 1)).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", function (d, i) { return radius / cfg.levels * d; })
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", cfg.opacityCircles)
        .style("filter", "url(#glow)");

    //Text indicating at what count each level is
    axisGrid.selectAll(".axisLabel")
        .data(d3.range(1, (cfg.levels + 1)).reverse())
        .enter().append("text")
        .attr("class", "axisLabel")
        .attr("x", 4)
        .attr("y", function (d) { return -d * radius / cfg.levels; })
        .attr("dy", "0.9em")
        .style("font-size", "10px")
        .attr("fill", "#737373")
        .text(function (d, i) { return Format(maxValue * d / cfg.levels); });

    //Draw the axes
    //Create the straight lines radiating outward from the center
    var axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");
    //Append the lines
    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function (d, i) { return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2); })
        .attr("y2", function (d, i) { return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2); })
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-width", "2px");

    //Append the labels at each axis
    axis.append("text")
        .attr("class", "legend")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", function (d, i) { return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2); })
        .attr("y", function (d, i) { return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2); })
        .text(function (d) { return d })
        .call(wrap, cfg.wrapWidth);

    //Draw the chart blobs
    //The radial line function
    var radarLine = d3.lineRadial()
        .curve(d3.curveLinearClosed)
        .radius(function (d) { return rScale(d.value); })
        .angle(function (d, i) { return i * angleSlice; });

    if (cfg.roundStrokes) {
        radarLine.curve(d3.curveCardinalClosed);
    }

    //Create a wrapper for the blobs	
    var blobWrapper = g.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarWrapper");

    //Append the backgrounds	
    blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", function (d, i) { return radarLine(d); })
        .style("fill", function (d, i) { return cfg.color(i); })
        .style("fill-opacity", cfg.opacityArea)
        .on('mouseover', function (d, i) {
            //Dim all blobs
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", 0.1);
            //Bring back the hovered over blob
            d3.select(this)
                .transition().duration(200)
                .style("fill-opacity", 0.7);
        })
        .on('mouseout', function () {
            //Bring back all blobs
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", cfg.opacityArea);
        });

    //Create the outlines	
    blobWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", function (d, i) { return radarLine(d); })
        .style("stroke-width", cfg.strokeWidth + "px")
        .style("stroke", function (d, i) { return cfg.color(i); })
        .style("fill", "none")
        .style("filter", "url(#glow)");

    //Append the circles
    blobWrapper.selectAll(".radarCircle")
        .data(function (d, i) { return d; })
        .enter().append("circle")
        .attr("class", "radarCircle")
        .attr("r", cfg.dotRadius)
        .attr("cx", function (d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
        .attr("cy", function (d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
        .style("fill", function (d, i, j) { return cfg.color(j); })
        .style("fill-opacity", 0.8);

    // Helper function
    function wrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.4, // ems
                y = text.attr("y"),
                x = text.attr("x"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }//wrap	

    var overlapGenres = ["Select", "Documentation", "Music"]
    var documentationDirectors = "Directors:,Ryan Polito,Jay Karas,Jay Chapman,Marcus Raboy"
    var musicDirectors = "Directors:,Marcus Raboy"

    var dropdownButton = d3.select("#dropdown")
        .append('select')

    dropdownButton // Add a button
        .selectAll('myOptions')
        .data(overlapGenres)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button

    dropdownButton.on("change", function (d) {

        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        d3.selectAll("#directorDocumentation").remove()
        d3.selectAll("#directorMusic").remove()
        if (selectedOption === 'Documentation') {
            axis.append("text")
                .attr("id", "directorDocumentation")
                .style("font-size", "11px")
                .attr("text-anchor", "middle")
                .attr("y", (rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * 3 - Math.PI / 2)) + 21)
                .text(documentationDirectors)

            axis.selectAll('#directorDocumentation') // select all the x tick texts
                .call(function (t) {
                    t.each(function (d) { // for each one
                        var self = d3.select(this);
                        var s = self.text().split(',');  // get the text and split it
                        self.text(''); // clear it out
                        self.append("tspan") // insert two tspans
                            .attr("x", rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * 3 - Math.PI / 2))
                            .attr("dy", ".95em")
                            .text(s[0]);
                        self.append("tspan")
                            .attr("x", rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * 3 - Math.PI / 2))
                            .attr("dy", ".95em")
                            .text(s[1]);
                        self.append("tspan") // insert two tspans
                            .attr("x", rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * 3 - Math.PI / 2))
                            .attr("dy", ".95em")
                            .text(s[2]);
                        self.append("tspan") // insert two tspans
                            .attr("x", rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * 3 - Math.PI / 2))
                            .attr("dy", ".95em")
                            .text(s[3]);
                        self.append("tspan") // insert two tspans
                            .attr("x", rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * 3 - Math.PI / 2))
                            .attr("dy", ".95em")
                            .text(s[4]);
                        self.append("tspan") // insert two tspans
                            .attr("x", rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * 3 - Math.PI / 2))
                            .attr("dy", ".95em")
                            .text(s[5]);
                    })

                })
        }
        else if (selectedOption === 'Music') {
            axis.append("text")
                .attr("id", "directorMusic")
                .style("font-size", "11px")
                .attr("text-anchor", "middle")
                .attr("y", (rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * 8 - Math.PI / 2)) + 8)
                .text(documentationDirectors)

            axis.selectAll('#directorMusic') // select all the x tick texts
                .call(function (t) {
                    t.each(function (d) { // for each one
                        var self = d3.select(this);
                        var s = self.text().split(',');  // get the text and split it
                        self.text(''); // clear it out
                        self.append("tspan") // insert two tspans
                            .attr("x", rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * 8 - Math.PI / 2))
                            .attr("dy", ".95em")
                            .text(s[0]);
                        self.append("tspan")
                            .attr("x", rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * 8 - Math.PI / 2))
                            .attr("dy", ".95em")
                            .text(s[1]);
                    })

                })
        }
        else if (selectedOption === 'Select') {
            console.log("Select")
        }
    })
}
