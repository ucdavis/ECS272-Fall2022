
d3.queue()
  .defer(d3.json, "//unpkg.com/world-atlas@1.1.4/world/50m.json")
  .defer(d3.csv, "./data/output.csv", function(row) {
    return {
      continent: row.Continent,
      country: row.Country,
      countryCode: row["Country Code"],
      emissions: +row["Emissions"],
      emissionsPerCapita: +row["Emissions Per Capita"],
      region: row.Region,
      year: +row.Year
    }
  })
  .await(function(error, mapData, data) {
    if (error) throw error;

    var extremeYears = d3.extent(data, d => d.year);
    
    var currentYear = extremeYears[0];
    
    var currentDataType = d3.select('input[name="data-type"]:checked')
                            .attr("value");
    // var geoData = topojson.feature(mapData, mapData.objects.countries).features;

    var width = +d3.select(".chart-container")
                   .node().offsetWidth;
    var height = 300;
    drawSun(width, height);

    

    // createMap(width, width * 4 / 5);
    createBar(width, height);
    // drawMap(geoData, data, currentYear, currentDataType);
    drawBar(data, currentDataType, "");

    var countryMap = {};
    var yearFields = ["1990","1991","1992","1993","1994","1995","1996","1997","1998","1999","2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019"];
    data.forEach(function(d) {
        var country = d.country;
        countryMap[country] = [];

        // { cerealName: [ bar1Val, bar2Val, ... ] }
        yearFields.forEach(function(field) {
          countryMap[country].push( +d[field] );
        });
    });

    var countries = Object.keys(countryMap).sort();

    // var values = ["dog", "cat", "parrot", "rabbit"];

    var select = document.createElement("select");
    select.name = "countries";
    select.id = "countries"

    for (const val of countries) {
      var option = document.createElement("option");
      option.value = val;
      option.text = val.charAt(0).toUpperCase() + val.slice(1);
      select.appendChild(option);
    }

    var label = document.createElement("label");
    label.innerHTML = "Select a country to display yearwise data"
    label.htmlFor = "countries";

    document.getElementById("dropdown").appendChild(label).appendChild(select);
    
    d3.select("select")
    .on("change",function(d){
      var selected = d3.select("#countries").node().value;
  
      currentDataType = 'emissionsPerCapita';
      drawBar(data, currentDataType, selected);
      // currentDataType = d3.event.target.value;
      //     drawMap(geoData, data, currentYear, currentDataType);
      //     drawBar(data, currentDataType, country);
  })



    d3.selectAll('input[name="data-type"]')
        .on("change", () => {
          var active = d3.select(".active").data()[0];
          
          var country = active ? active.properties.country : "";

          currentDataType = d3.event.target.value;
          // drawMap(geoData, data, currentYear, currentDataType);
          drawBar(data, currentDataType, country);
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
        // percentage = `<p>Percentage of total: ${getPercentage(tgt.data()[0])}</p>`;
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
              <p>Country: ${data.country}</p>
              <p>${formatDataType(dataType)}: ${dataValue}</p>
              <p>Year: ${data.year || d3.select("#year").property("value")}</p>
              ${percentage}
            `)
      }
    }
  });

  d3.queue()
  .defer(d3.json, "//unpkg.com/world-atlas@1.1.4/world/50m.json")
  .defer(d3.csv, "./data/output-2.csv", function(row) {
    return {
      emissionsPerCapita: +row["Emissions Per Capita"],
      region: row.Region,
      year: +row.Year
    }
  })
  .await(function(error, mapData, data) {
    if (error) throw error;

    var extremeYears = d3.extent(data, d => d.year);
    
    var currentYear = extremeYears[0];
    
    var currentDataType = d3.select('input[name="data-type"]:checked')
                            .attr("value");
    // var geoData = topojson.feature(mapData, mapData.objects.countries).features;

    var width = +d3.select(".chart-container")
                   .node().offsetWidth;
    var height = 300;

    

    // createMap(width, width * 4 / 5);
    createPie(width, height);
    // drawMap(geoData, data, currentYear, currentDataType);
    drawPie(data, currentYear);

    
    


    d3.select("#year")
        .property("min", currentYear)
        .property("max", extremeYears[1])
        .property("value", currentYear)
        .on("input", () => {
          currentYear = +d3.event.target.value;
          // drawMap(geoData, data, currentYear, currentDataType);
          drawPie(data, currentYear);
          highlightBars(currentYear);
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


















