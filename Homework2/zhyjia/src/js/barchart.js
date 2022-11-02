import * as d3 from "d3";
import csvPath from '../assets/data/test.csv';


export async function getDistribution() {
    const data = await d3.csv(csvPath);

    // var leg0 = [{class : "Eco", value : 0}, {class: "Eco Plus", value: 0}, {class: "Business", value: 0}]
    var leg1 = [{class : "Eco", value : 0}, {class: "Eco Plus", value: 0}, {class: "Business", value: 0}]
    var leg2 = [{class : "Eco", value : 0}, {class: "Eco Plus", value: 0}, {class: "Business", value: 0}]
    var leg3 = [{class : "Eco", value : 0}, {class: "Eco Plus", value: 0}, {class: "Business", value: 0}]
    var leg4 = [{class : "Eco", value : 0}, {class: "Eco Plus", value: 0}, {class: "Business", value: 0}]
    var leg5 = [{class : "Eco", value : 0}, {class: "Eco Plus", value: 0}, {class: "Business", value: 0}]
    var ecoCount = 0
    var ecoPlusCount = 0
    var businessCount = 0
 
	data.forEach(d => {
		if(d["Class"] == "Eco"){
			ecoCount += 1;
			//if(d["Leg room service"] == "0") leg0[0].value += 1;
			if(d["Leg room service"] == "1") leg1[0].value += 1;
			else if(d["Leg room service"] == "2") leg2[0].value += 1;
			else if(d["Leg room service"] == "3") leg3[0].value += 1;
			else if(d["Leg room service"] == "4") leg4[0].value += 1;
			else leg5[0].value += 1;
		} else if(d["Class"] == "Eco Plus"){
			ecoPlusCount += 1;
			// if(d["Leg room service"] == "0") leg0[1].value += 1;
			if(d["Leg room service"] == "1") leg1[1].value += 1;
			else if(d["Leg room service"] == "2") leg2[1].value += 1;
			else if(d["Leg room service"] == "3") leg3[1].value += 1;
			else if(d["Leg room service"] == "4") leg4[1].value += 1;
			else leg5[1].value += 1;
		} else{
			businessCount += 1;
			// if(d["Leg room service"] == "0") leg0[2].value += 1;
			if(d["Leg room service"] == "1") leg1[2].value += 1;
			else if(d["Leg room service"] == "2") leg2[2].value += 1;
			else if(d["Leg room service"] == "3") leg3[2].value += 1;
			else if(d["Leg room service"] == "4") leg4[2].value += 1;
			else leg5[2].value += 1;
		}
	});
	
	// leg0[0].value = leg0[0].value / ecoCount * 100;
    leg1[0].value = leg1[0].value / ecoCount * 100;
    leg2[0].value = leg2[0].value / ecoCount * 100;
    leg3[0].value = leg3[0].value / ecoCount * 100;
    leg4[0].value = leg4[0].value / ecoCount * 100;
    leg5[0].value = leg5[0].value / ecoCount * 100;

    // leg0[1].value = leg0[1].value / ecoPlusCount * 100;
    leg1[1].value = leg1[1].value / ecoPlusCount * 100;
    leg2[1].value = leg2[1].value / ecoPlusCount * 100;
    leg3[1].value = leg3[1].value / ecoPlusCount * 100;
    leg4[1].value = leg4[1].value / ecoPlusCount * 100;
    leg5[1].value = leg5[1].value / ecoPlusCount * 100;

    // leg0[2].value = leg0[2].value / businessCount * 100;
    leg1[2].value = leg1[2].value / businessCount * 100;
    leg2[2].value = leg2[2].value / businessCount * 100;
    leg3[2].value = leg3[2].value / businessCount * 100;
    leg4[2].value = leg4[2].value / businessCount * 100;
    leg5[2].value = leg5[2].value / businessCount * 100;
	
	var dmap = {
		"1": leg1, 
		"2": leg2, 
		"3": leg3, 
		"4": leg4, 
		"5": leg5
	}


    // drawPieChart(dmap["gender"], "#pie");

    drawBar(leg1)

    d3.select("#barSlider").on("change", function(d){
  		var s = this.value;
  		d3.select("#bar").selectAll("svg").remove();

  		drawBar(dmap[s])
	})

}

export function drawBar(dataset){

	var margin = {top: 30, right: 30, bottom: 70, left: 60},
	    width = 460 - margin.left - margin.right,
	    height = 400 - margin.top - margin.bottom;

	var svg = d3.select("#bar")
	  .append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform",
	          "translate(" + margin.left + "," + margin.top + ")");

	var x = d3.scaleBand()
	  .range([ 0, width ])
	  .domain(dataset.map(function(d) { return d.class; }))
	  .padding(0.2);
	svg.append("g")
	  .attr("transform", "translate(0," + height + ")")
	  .call(d3.axisBottom(x))

	var y = d3.scaleLinear()
	  .domain([0, 40])
	  .range([ height, 0]);
	svg.append("g")
	  .attr("class", "myYaxis")
	  .call(d3.axisLeft(y));

	svg.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(x))
         .append("text")
         .attr("y", height - 260)
         .attr("x", width - 200)
         .attr('text-anchor', 'middle')
         .attr("stroke", "red")
         .text("Class");

    
     svg.append("g")
         .call(d3.axisLeft(y).tickFormat(function(d){
             return d;
         })
         .ticks(10))
         .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 6)
         .attr("dy", "-5.1em")
         .attr("text-anchor", "end")
         .attr("stroke", "red")
         .text("Customer Percentage(%)");


	function update(data) {

	  var u = svg.selectAll("rect")
	    .data(data)

	  u.enter()
	    .append("rect")
	    // .merge(u)
	      .attr("x", function(d) { return x(d.class); })
	      .attr("y", function(d) { return y(d.value); })
	      .attr("width", x.bandwidth())
	      .attr("height", function(d) { return height - y(d.value); })
	      .attr("fill", "#69b3a2")
	}

	update(dataset)
}
