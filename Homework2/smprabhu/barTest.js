function createBar(width, height) {


    var bar = d3.select("#bar")
                    .attr("width", width)
                    .attr("height", height);

  
    bar.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", - height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "1em")
        .classed("y-axis-label", true);
  
    bar.append("text")
        .attr("x", width / 2)
        .attr("y", "1em")
        .attr("font-size", "1.5em")
        .style("text-anchor", "middle")
        .classed("bar-title", true);
  }
  function drawBar(data, dataType, country) {

    var fileName = "./data/output.csv";
  var yearFields = ["1990","1991","1992","1993","1994","1995","1996","1997","1998","1999","2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019"];

  d3.csv(fileName, function(error, data) {
    var countryMap = {};
    data.forEach(function(d) {
        var country = d.Country;
        countryMap[country] = [];

        // { cerealName: [ bar1Val, bar2Val, ... ] }
        yearFields.forEach(function(field) {
          countryMap[country].push( +d[field] );
        });
    });
    makeVis(countryMap)
});

var makeVis = function(countryMap) {
    
    var bar = d3.select("#bar");
    
    var padding = {
      top: 30,
      right: 30,
      bottom: 30,
      left: 110
    };
    
    var barPadding = 1;
    var width = +bar.attr("width");
    var height = +bar.attr("height");
  

    var xScale = d3.scaleLinear()
                   .domain(yearFields)
                   .range([padding.left, width - padding.right]);
  
    var yScale = d3.scaleLinear()
                   .range([height, 0]);
  
    var barWidth = xScale(xScale.domain()[0] + 1) - xScale.range()[0];

    var xAxis = d3.axisBottom(xScale)
                  .tickFormat(d3.format(".0f"));
    
    bar.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + height + ")")
                  .call(xAxis);              
  
    var yAxis = d3.axisLeft(yScale);
  
    var yAxisHandleForUpdate = bar.append("g")
                    .attr("class", "y axis")
                    .call(yAxis);

    yAxisHandleForUpdate.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Value");
  
                    var updateBars = function(data) {
                      // First update the y-axis domain to match data
                      yScale.domain( d3.extent(data) );
                      yAxisHandleForUpdate.call(yAxis);
  
                      var bars = bar.selectAll(".bar").data(data);
  
                      // Add bars for new data
                      bars.enter()
                        .append("rect")
                          .attr("class", "bar")
                          .attr("x", function(d,i) { return xScale( yearFields[i] ); })
                          .attr("width", barWidth - barPadding)
                          .attr("y", function(d,i) { return yScale(d); })
                          .attr("height", function(d,i) { return height - yScale(d); });
  
                      // Update old ones, already have x / width from before
                      bars
                          .transition().duration(250)
                          .attr("y", function(d,i) { return yScale(d); })
                          .attr("height", function(d,i) { return height - yScale(d); });
  
                      // Remove old ones
                      bars.exit().remove();
                  };
                  
                  // Handler for dropdown value change
                  var dropdownChange = function() {
                      var newCountry = d3.select(this).property('value'),
                          newData   = countryMap[newCountry];
  
                      updateBars(newData);
                  };
  
                  // Get names of cereals, for dropdown
                  var countries = Object.keys(countryMap).sort();
  
                  var dropdown = d3.select("#bar")
                      .insert("select", "svg")
                      .on("change", dropdownChange);
  
                  dropdown.selectAll("option")
                      .data(countries)
                    .enter().append("option")
                      .attr("value", function (d) { return d; })
                      .text(function (d) {
                          return d[0].toUpperCase() + d.slice(1,d.length); // capitalize 1st letter
                      });
  
                  var initialData = countryMap[ countries[0] ];
                  updateBars(initialData);
                    };

  }