
d3.queue()
  .defer(d3.csv, "./data/data.csv", function(row) {
    return {
      region: row.date,
      year: row.price
    }
  })
  .await(function(error, data) {
    if (error) throw error;

    
    // var currentYear = extremeYears[0];
    
    var currentDataType = d3.select('input[name="data-type"]:checked')
                            .attr("value");

    var width = +d3.select(".chart-container")
                   .node().offsetWidth;
    var height = 300;
    drawSun(width, height);

    

    // createBar(width, height);
    // drawBar(data, currentDataType, "");
    drawBar(width, height, data);

    // var regionMap = {};
    // var yearFields = ["1990","1991","1992","1993","1994","1995","1996","1997","1998","1999","2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019"];
    // data.forEach(function(d) {
    //     var region = d.region;
    //     regionMap[region] = [];

    //     yearFields.forEach(function(field) {
    //       regionMap[region].push( +d[field] );
    //     });
    // });

    // var regions = Object.keys(regionMap).sort();


    // var select = document.createElement("select");
    // select.name = "regions";
    // select.id = "regions"

    // for (const val of regions) {
    //   var option = document.createElement("option");
    //   option.value = val;
    //   option.text = val.charAt(0).toUpperCase() + val.slice(1);
    //   select.appendChild(option);
    // }

    // var label = document.createElement("label");
    // label.innerHTML = "Select a region to display yearwise data"
    // label.htmlFor = "regions";

  //   document.getElementById("dropdown").appendChild(label).appendChild(select);
    
  //   d3.select("select")
  //   .on("change",function(d){
  //     var selected = d3.select("#regions").node().value;
  
  //     currentDataType = 'emissionsPerCapita';
  //     drawBar(data, currentDataType, selected);
  // })



    // d3.selectAll('input[name="data-type"]')
    //     .on("change", () => {
    //       var active = d3.select(".active").data()[0];
          
    //       var region = active ? active.properties.region : "";

    //       currentDataType = d3.event.target.value;
    //       drawBar(data, currentDataType, region);
    //     });

    // d3.selectAll("svg")
    //     .on("mousemove touchmove", updateTooltip);

    // function updateTooltip() {
    //   var tooltip = d3.select(".tooltip");
    //   var tgt = d3.select(d3.event.target);
    //   var isCountry = tgt.classed("country");
    //   var isBar = tgt.classed("bar");
    //   var isArc = tgt.classed("arc");
    //   var dataType = d3.select("input:checked")
    //                    .property("value");
    //   var units = dataType === "emissions" ? "thousand metric tons" : "metric tons per capita";
    //   var data;
    //   var percentage = "";
    //   if (isCountry) data = tgt.data()[0].properties;
    //   if (isArc) {
    //     data = tgt.data()[0].data;
    //     percentage = `<p>Percentage of total: ${getPercentage(tgt.data()[0])}</p>`;
    //   }
    //   if (isBar) data = tgt.data()[0];
    //   tooltip
    //       .style("opacity", +(isCountry || isArc || isBar))
    //       .style("left", (d3.event.pageX - tooltip.node().offsetWidth / 2) + "px")
    //       .style("top", (d3.event.pageY - tooltip.node().offsetHeight - 10) + "px");
    //   if (data) {
    //     var dataValue = data[dataType] ?
    //       data[dataType].toLocaleString() + " " + units :
    //       "Data Not Available";
    //     tooltip 
    //         .html(`
    //           <p>Region: ${data.region}</p>
    //           <p>${formatDataType(dataType)}: ${dataValue}</p>
    //           <p>Year: ${data.year || d3.select("#year").property("value")}</p>
    //           ${percentage}
    //         `)
    //   }
    // }
  });

  d3.queue()
  .defer(d3.csv, "./data/pie.csv", function(row) {
    return {
      emissionsPerCapita: +row["Emissions Per Capita"],
      region: row.Region,
      year: +row.Year
    }
  })
  .await(function(error, data) {
    if (error) throw error;

    var extremeYears = d3.extent(data, d => d.year);
    
    var currentYear = extremeYears[0];
    
    var currentDataType = d3.select('input[name="data-type"]:checked')
                            .attr("value");

    var width = +d3.select(".chart-container")
                   .node().offsetWidth;
    var height = 300;

    
    createPie(width, height);
    drawPie(data, currentYear);

    
    


    d3.select("#year")
        .property("min", currentYear)
        .property("max", extremeYears[1])
        .property("value", currentYear)
        .on("input", () => {
          currentYear = +d3.event.target.value;
          drawPie(data, currentYear);
          // highlightBars(currentYear);
        });

 
    d3.selectAll("svg")
        .on("mousemove touchmove", updateTooltip);

    function updateTooltip() {
      var tooltip = d3.select(".tooltip");
      var tgt = d3.select(d3.event.target);
      var isCountry = tgt.classed("country");
      var isBar = tgt.classed("bar");
      var isArc = tgt.classed("arc");
      var dataType = d3.select("input:checked")
                       .property("value");
      var units = dataType === "emissions" ? "thousand metric tons" : "metric tons per capita";
      var data;
      var percentage = "";
      if (isCountry) data = tgt.data()[0].properties;
      if (isArc) {
        
        data = tgt.data()[0].data;
        percentage = `<p>Percentage of total: ${getPercentage(tgt.data()[0])}</p>`;
      }
      if (isBar) data = tgt.data()[0];
      tooltip
          .style("opacity", +(isCountry || isArc || isBar))
          .style("left", (d3.event.pageX - tooltip.node().offsetWidth / 2) + "px")
          .style("top", (d3.event.pageY - tooltip.node().offsetHeight - 10) + "px");
      if (data) {
        
        var dataValue = data[dataType] ?
          data[dataType].toLocaleString() + " " + units :
          "Data Not Available";
        tooltip 
            .html(`
              <p>Region: ${data.region}</p>
              <p>${formatDataType(dataType)}: ${dataValue}</p>
              <p>Year: ${data.year || d3.select("#year").property("value")}</p>
              ${percentage}
            `)
      }
    }
  });

function formatDataType(key) {
  return key[0].toUpperCase() + key.slice(1).replace(/[A-Z]/g, c => " " + c);
}

function getPercentage(d) {
  var angle = d.endAngle - d.startAngle;
  var fraction = 100 * angle / (Math.PI * 2);
  return fraction.toFixed(2) + "%";
}


















