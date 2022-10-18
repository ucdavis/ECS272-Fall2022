function createPie(width, height) {
    var pie = d3.select("#pie")
                    .attr("width", width)
                    .attr("height", height);
  
    pie.append("g")
        .attr("transform", "translate(" + width / 4 + ", " + (height / 2 + 20) + ")")
        .classed("chart", true);
  
    pie.append("text")
        .attr("x", width / 2)
        .attr("y", "1em")
        .attr("font-size", "1em")
        .style("text-anchor", "middle")
        .classed("pie-title", true);
  }
  
  function drawPie(data, currentYear) {
    
    var pie = d3.select("#pie");
  
    var arcs = d3.pie()
                 .sort((a,b) => {
                   if (a.region < b.region) return -1;
                   if (a.region > b.region) return 1;
                   return a.emissionsPerCapita - b.emissionsPerCapita;
                 })
                 .value(d => d.emissionsPerCapita);
  
    var path = d3.arc()
                 .outerRadius(+pie.attr("height") / 2 - 50)
                 .innerRadius(0);
  
    var yearData = data.filter(d => d.year === currentYear);
    var regions = [];
    for (var i = 0; i < yearData.length; i++) {
      var region = yearData[i].region;
      if (!regions.includes(region)) {
        regions.push(region);
      }
    }

  
    var colorScale = d3.scaleOrdinal()
                       .domain(regions)
                       .range(['#f95d6a', 
                        '#ff7c43',
                        '#003f5c',   
                        '#a05195', 
                        '#665191', 
                        '#ffa600',
                        '#d45087']); 
  //5,6,1,3,2,7,4
    var update = pie
                   .select(".chart")
                   .selectAll(".arc")
                   .data(arcs(yearData));
  
    update
      .exit()
      .remove();
  
    update
      .enter()
        .append("path")
        .classed("arc", true)
        .attr("stroke", "#ffffff")
        .attr("stroke-width", "0px")
      .merge(update)
        .attr("fill", d => colorScale(d.data.region))
        .attr("d", path);
  
    pie.select(".pie-title")
        .text("Emissions per capita for " + currentYear);
        
        
    var keys = ['East Asia & Pacific','Europe & Central Asia','Latin America & Caribbean','Middle East & North Africa','North America','South Asia','Sub-Saharan Africa']


// Add one dot in the legend for each name.
pie.selectAll("mydots")
  .data(keys)
  .enter()
  .append("circle")
    .attr("cx", 400)
    .attr("cy", function(d,i){ return 100 + i*15}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 5)
    .style("fill", function(d){ return colorScale(d)})

// Add one dot in the legend for each name.
pie.selectAll("mylabels")
  .data(keys)
  .enter()
  .append("text")
    .attr("x", 420)
    .attr("y", function(d,i){ return 100 + i*15}) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d){ return colorScale(d)})
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
  }
  
  
  
  
  
  
  
  
  
  
  
  