// function createBar(width, height) {
//   var bar = d3.select("#bar")
//                       .attr("width", width)
//                       .attr("height", height);
    
//       bar.append("g")
//           .classed("x-axis", true);
    
//       bar.append("g")
//           .classed("y-axis", true);
    
//       bar.append("text")
//           .attr("transform", "rotate(-90)")
//           .attr("x", - height / 2)
//           .attr("dy", "50")
//           .style("text-anchor", "middle")
//           .style("font-size", "1em")
//           .classed("y-axis-label", true);
    
//       bar.append("text")
//           .attr("x", width / 2)
//           .attr("y", "1em")
//           .attr("font-size", "1em")
//           .style("text-anchor", "middle")
//           .classed("bar-title", true);
  
//       bar.append("text")
//           .attr("x", width / 2)
//           .attr("y", "320")
//           .attr("font-size", "1em")
//           .style("text-anchor", "middle")
//           .classed("x-axis-label", true);
//     }
    
//     function highlightBars(year) {
//       d3.select("#bar")
//         .selectAll("rect")
//           .attr("fill", d => d.year === year ? "#808080":"#000000");
//     }
    
//     function drawBar(data, dataType, region) {
  
//       var bar = d3.select("#bar");
//       var padding = {
//         top: 30,
//         right: 30,
//         bottom: 30,
//         left: 110
//       };
//       var barPadding = 1;
//       var width = +bar.attr("width");
//       var height = +bar.attr("height");
//       var regionData = data.filter(d => d.region === region)
//                             .sort((a, b) => a.year - b.year);
    
//       var xScale = d3.scaleLinear()
//                      .domain(d3.extent(data, d => d.year))
//                      .range([padding.left, width - padding.right]);
    
//       var yScale = d3.scaleLinear()
//                      .domain([0, d3.max(regionData, d => d[dataType])])
//                      .range([height - padding.bottom, padding.top]);
    
//       var barWidth = xScale(xScale.domain()[0] + 1) - xScale.range()[0];
    
//       var xAxis = d3.axisBottom(xScale)
//                     .tickFormat(d3.format(".0f"));
    
//       d3.select(".x-axis")
//           .attr("transform", "translate(0, " + (height - padding.bottom) + ")")
//           .call(xAxis);
    
//       var yAxis = d3.axisLeft(yScale);
    
//       d3.select(".y-axis")
//           .attr("transform", "translate(" + (padding.left - barWidth / 2) + ",0)")
//           .call(yAxis);
    
//       var axisLabel = dataType === "emissions" ?
//         "CO2 emissions, thousand metric tons" :
//         "CO2 emissions, metric tons per capita";
    
//       var barTitle = region ?
//         "CO2 Emissions, " + region :
//         "Click on a country to see annual trends.";
  
//       var xaxisLabel = "Year";
    
//       d3.select(".y-axis-label")
//           .text(axisLabel);
    
//       d3.select(".bar-title")
//           .text(barTitle);
  
//       d3.select(".x-axis-label")
//           .text(xaxisLabel);
    
//       var t = d3.transition()
//                 .duration(1000)
//                 .ease(d3.easeBounceOut);
    
//       var update = bar 
//                      .selectAll(".bar")
//                      .data(regionData);
    
//       update
//         .exit()
//         .transition(t)
//         .delay((d, i, nodes) => (nodes.length - i - 1) * 100)
//           .attr("y", height - padding.bottom)
//           .attr("height", 0)
//           .remove();
    
//       update
//         .enter()
//         .append("rect")
//           .classed("bar", true)
//           .attr("y", height - padding.bottom)
//           .attr("height", 0)
//         .merge(update)
//           .attr("x", d => (xScale(d.year) + xScale(d.year - 1)) / 2)
//           .attr("width", barWidth - barPadding)
//           .transition(t)
//             .delay((d, i) => i * 100)
//             .attr("y", d => yScale(d[dataType]))
//             .attr("height", d => height - padding.bottom - yScale(d[dataType]));
//     }
  
function drawBar(width, height, region){

  var set_height = height;
  var svg = d3.select("#bar"),
  margin = {top: 20, right: 20, bottom: 110, left: 70},
  margin2 = {top: 230, right: 20, bottom: 30, left: 70},
  width = width - margin.left - margin.right,
  height = set_height - margin.top - margin.bottom,
  height2 = set_height - margin2.top - margin2.bottom;

var parseDate = d3.timeParse("%b %Y");

var x = d3.scaleTime().range([0, width]),
  x2 = d3.scaleTime().range([0, width]),
  y = d3.scaleLinear().range([height, 0]),
  y2 = d3.scaleLinear().range([height2, 0]);

var xAxis = d3.axisBottom(x),
  xAxis2 = d3.axisBottom(x2),
  yAxis = d3.axisLeft(y);

var brush = d3.brushX()
  .extent([[0, 0], [width, height2]])
  .on("brush end", brushed);

var zoom = d3.zoom()
  .scaleExtent([1, Infinity])
  .translateExtent([[0, 0], [width, height]])
  .extent([[0, 0], [width, height]])
  .on("zoom", zoomed);

var area = d3.area()
  .curve(d3.curveMonotoneX)
  .x(function(d) { return x(d.date); })
  .y0(height)
  .y1(function(d) { return y(d.price); });

var area2 = d3.area()
  .curve(d3.curveMonotoneX)
  .x(function(d) { return x2(d.date); })
  .y0(height2)
  .y1(function(d) { return y2(d.price); });

svg.append("defs").append("clipPath")
  .attr("id", "clip")
.append("rect")
  .attr("width", width)
  .attr("height", height);

var focus = svg.append("g")
  .attr("class", "focus")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
  .attr("class", "context")
  .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

// var region = 'East_Asia_&_Pacific';
var filename  = "./data/"+region+".csv";
console.log("Bar.js selected",region);
console.log(filename);
d3.csv(filename, type, function(error, data) {
if (error) throw error;

x.domain(d3.extent(data, function(d) { return d.date; }));
y.domain([0, d3.max(data, function(d) { return d.price; })]);
x2.domain(x.domain());
y2.domain(y.domain());

focus.append("path")
    .datum(data)
    .attr("class", "area")
    .attr("d", area);

focus.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

focus.append("g")
    .attr("class", "axis axis--y")
    .call(yAxis);

context.append("path")
    .datum(data)
    .attr("class", "area")
    .attr("d", area2);

context.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height2 + ")")
    .call(xAxis2);

context.append("g")
    .attr("class", "brush")
    .call(brush)
    .call(brush.move, x.range());

svg.append("rect")
    .attr("class", "zoom")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);

    svg.append("text")
              .attr("transform", "rotate(-90)")
              .attr("x", - height )
              .attr("dy", "15")
              .style("text-anchor", "middle")
              .style("font-size", "1em")
              .classed("y-axis-label", true)
              .text('CO2 Emissions in metric tons/capita');
  
      svg.append("text")
          .attr("x", width / 2)
          .attr("y", "320")
          .attr("font-size", "1em")
          .style("text-anchor", "middle")
          .classed("x-axis-label", true)
          .text('Year');
});

function brushed() {
if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
var s = d3.event.selection || x2.range();
x.domain(s.map(x2.invert, x2));
focus.select(".area").attr("d", area);
focus.select(".axis--x").call(xAxis);
svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
    .scale(width / (s[1] - s[0]))
    .translate(-s[0], 0));
}

function zoomed() {
if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
var t = d3.event.transform;
x.domain(t.rescaleX(x2).domain());
focus.select(".area").attr("d", area);
focus.select(".axis--x").call(xAxis);
context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}

function type(d) {
d.date = parseDate(d.date);
d.price = +d.price;
return d;
}
}
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  