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
    
//     function drawBar(data, dataType, country) {
  
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
//       var countryData = data.filter(d => d.country === country)
//                             .sort((a, b) => a.year - b.year);
    
//       var xScale = d3.scaleLinear()
//                      .domain(d3.extent(data, d => d.year))
//                      .range([padding.left, width - padding.right]);
    
//       var yScale = d3.scaleLinear()
//                      .domain([0, d3.max(countryData, d => d[dataType])])
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
    
//       var barTitle = country ?
//         "CO2 Emissions, " + country :
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
//                      .data(countryData);
    
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
function trychart(){

  console.log("hello")
    var data = [];

for (var i = 0; i < 300; i++) {
  var datum = {};
  datum.date = i;
  datum.price = Math.floor(Math.random() * 600);
  data.push(datum);
} 

  var margin = {top: 10, right: 10, bottom: 100, left: 40},
    margin2 = {top: 430, right: 10, bottom: 20, left: 40},
    width = 750 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

var x = d3.scale.ordinal().rangeBands([0, width], .1),
    x2 = d3.scale.ordinal().rangeBands([0, width], .1),
    y = d3.scale.linear().range([height, 0]),
    y2 = d3.scale.linear().range([height2, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom").tickValues([]),
    yAxis = d3.svg.axis().scale(y).orient("left");

		x.domain(data.map(function(d){ return d.date}));
	  y.domain([0, d3.max(data, function(d) { return d.price;})]);
  	x2.domain(x.domain());
	  y2.domain(y.domain());
		
  var brush = d3.svg.brush()
							  .x(x2) 
							  .on("brush", brushed);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

  focus.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  focus.append("g")
      .attr("class", "y axis")
      .call(yAxis);
	 
  console.log(x(data[0].date))
 	enter(data)
  updateScale(data)
  
  var subBars = context.selectAll('.subBar')
                                  	.data(data)
	
  subBars.enter().append("rect")
		  .classed('subBar', true)
			.attr(
    	{
        height: function (d)
        {
          return height2 - y2(d.price);
        },
        width: function(d){ return x.rangeBand()},
        x: function(d) {

          return x2(d.date);
        },
        y: function(d)
        {
          return y2(d.price)
        }
      })

  context.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  context.append("g")
      .attr("class", "x brush")
      .call(brush)
    .selectAll("rect")
      .attr("y", -6)
      .attr("height", height2 + 7);
  



function brushed() {
    var selected = null; 
      selected =  x2.domain()
                .filter(function(d){
                 		return (brush.extent()[0] <= x2(d)) && (x2(d) <= brush.extent()[1]);
							});
  
    var start;
    var end;
		
  	if(brush.extent()[0] != brush.extent()[1])
      {
        start = selected[0];
		  	end = selected[selected.length - 1] + 1;
      } else { 
				start = 0;
				end = data.length;
      }

    var updatedData = data.slice(start, end);

    update(updatedData);
    enter(updatedData);
    exit(updatedData);
  	updateScale(updatedData)
 

}
 
  function updateScale(data)
  { 
    		var tickScale = d3.scale.pow().range([data.length / 10, 0]).domain([data.length, 0]).exponent(.5)

    var brushValue = brush.extent()[1] - brush.extent()[0];
    if(brushValue === 0){
      brushValue = width;
    }

    var tickValueMultiplier = Math.ceil(Math.abs(tickScale(brushValue)));  
  	var filteredTickValues = data.filter(function(d, i){return i % tickValueMultiplier === 0}).map(function(d){ return d.date})

    focus.select(".x.axis").call(xAxis.tickValues(filteredTickValues));
    focus.select(".y.axis").call(yAxis);
  }
  
  function update(data)
  {
		  x.domain(data.map(function(d){ return d.date}));
		  y.domain([0, d3.max(data, function(d) { return d.price;})]);

      var bars =  focus.selectAll('.bar')
          .data(data)
      bars
        .attr(
        {  
          height: function (d, i)
          { 
            return height - y(d.price);
          },
          width: function(d){ 
            return x.rangeBand()
          },
          x: function(d) {

            return x(d.date);
          },
          y: function(d)
          {
            return y(d.price)
          }
        })

  } 
  
  function exit(data)
  {
		var bars =  focus.selectAll('.bar').data(data)
		bars.exit().remove()
  }
  
  function enter(data)
  {
    	x.domain(data.map(function(d){ return d.date}));
		  y.domain([0, d3.max(data, function(d) { return d.price;})]);

      var bars =  focus.selectAll('.bar')
          .data(data)
      bars.enter().append("rect")
        .classed('bar', true)
        .attr(
        {  
          height: function (d, i)
          { 
            return height - y(d.price);
          },
          width: function(d){ 
            return x.rangeBand()
          },
          x: function(d) {
 
            return x(d.date);
          },
          y: function(d)
          {
            return y(d.price)
          }
        })
  }
}
  
  
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    