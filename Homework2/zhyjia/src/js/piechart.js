import * as d3 from "d3";
import csvPath from '../assets/data/test.csv';


export async function getOverview() {
    const data = await d3.csv(csvPath);

	var gender = [["Female", 0], ["Male", 0]];
	var customerType = [["Loyal Customer", 0], ["Disloyal Customer", 0]];
	var travelType = [["Business Travel", 0], ["Personal Travel", 0]];
	var fligtClass = [["Eco", 0], ["Eco Plus", 0], ["Business", 0]];
	var wifiService = [["0", 0], ["1", 0], ["2", 0], ["3", 0], ["4", 0], ["5", 0]];
	var timeConvenient = [["0", 0], ["1", 0], ["2", 0], ["3", 0], ["4", 0], ["5", 0]];
	var booking = [["0", 0], ["1", 0], ["2", 0], ["3", 0], ["4", 0], ["5", 0]];
	var gateLocation = [["0", 0], ["1", 0], ["2", 0], ["3", 0], ["4", 0], ["5", 0]];
	var food = [["0", 0], ["1", 0], ["2", 0], ["3", 0], ["4", 0], ["5", 0]];
	var onlineBoarding = [["0", 0], ["1", 0], ["2", 0], ["3", 0], ["4", 0], ["5", 0]];
	var seat = [["0", 0], ["1", 0], ["2", 0], ["3", 0], ["4", 0], ["5", 0]];
	var entertainment = [["0", 0], ["1", 0], ["2", 0], ["3", 0], ["4", 0], ["5", 0]];
	var onboard = [["0", 0], ["1", 0], ["2", 0], ["3", 0], ["4", 0], ["5", 0]];
	var legRoom = [["0", 0], ["1", 0], ["2", 0], ["3", 0], ["4", 0], ["5", 0]];
	var baggage = [["0", 0], ["1", 0], ["2", 0], ["3", 0], ["4", 0], ["5", 0]];
	var checkin = [["0", 0], ["1", 0], ["2", 0], ["3", 0], ["4", 0], ["5", 0]];
	var inflight = [["0", 0], ["1", 0], ["2", 0], ["3", 0], ["4", 0], ["5", 0]];
	var cleanliness = [["0", 0], ["1", 0], ["2", 0], ["3", 0], ["4", 0], ["5", 0]];
	var satisfaction = [["satisfied", 0], ["neutral or dissatisfied", 0]];
	data.forEach(d => {
		if(d["Gender"] == "Female") gender[0][1] += 1;
		else gender[1][1] += 1;

		if(d["Customer Type"] == "Loyal Customer") customerType[0][1] += 1;
		else customerType[1][1] += 1;

		if(d["Type of Travel"] == "Business travel") travelType[0][1] += 1;
		else travelType[1][1] += 1;

		if(d["Class"] == "Eco") fligtClass[0][1] += 1;
		else if(d["Class"] == "Eco Plus") fligtClass[1][1] += 1;
		else fligtClass[2][1] += 1;

		if(d["Inflight wifi service"] == "0") wifiService[0][1] += 1;
		else if(d["Inflight wifi service"] == "1") wifiService[1][1] += 1;
		else if(d["Inflight wifi service"] == "2") wifiService[2][1] += 1;
		else if(d["Inflight wifi service"] == "3") wifiService[3][1] += 1;
		else if(d["Inflight wifi service"] == "4") wifiService[4][1] += 1;
		else wifiService[5][1] += 1;

		if(d["Departure/Arrival time convenient"] == "0") timeConvenient[0][1] += 1;
		else if(d["Departure/Arrival time convenient"] == "1") timeConvenient[1][1] += 1;
		else if(d["Departure/Arrival time convenient"] == "2") timeConvenient[2][1] += 1;
		else if(d["Departure/Arrival time convenient"] == "3") timeConvenient[3][1] += 1;
		else if(d["Departure/Arrival time convenient"] == "4") timeConvenient[4][1] += 1;
		else timeConvenient[5][1] += 1;

		if(d["Ease of Online booking"] == "0") booking[0][1] += 1;
		else if(d["Ease of Online booking"] == "1") booking[1][1] += 1;
		else if(d["Ease of Online booking"] == "2") booking[2][1] += 1;
		else if(d["Ease of Online booking"] == "3") booking[3][1] += 1;
		else if(d["Ease of Online booking"] == "4") booking[4][1] += 1;
		else booking[5][1] += 1;

		if(d["Gate location"] == "0") gateLocation[0][1] += 1;
		else if(d["Gate location"] == "1") gateLocation[1][1] += 1;
		else if(d["Gate location"] == "2") gateLocation[2][1] += 1;
		else if(d["Gate location"] == "3") gateLocation[3][1] += 1;
		else if(d["Gate location"] == "4") gateLocation[4][1] += 1;
		else gateLocation[5][1] += 1;

		if(d["Food and drink"] == "0") food[0][1] += 1;
		else if(d["Food and drink"] == "1") food[1][1] += 1;
		else if(d["Food and drink"] == "2") food[2][1] += 1;
		else if(d["Food and drink"] == "3") food[3][1] += 1;
		else if(d["Food and drink"] == "4") food[4][1] += 1;
		else food[5][1] += 1;

		if(d["Online boarding"] == "0") onlineBoarding[0][1] += 1;
		else if(d["Online boarding"] == "1") onlineBoarding[1][1] += 1;
		else if(d["Online boarding"] == "2") onlineBoarding[2][1] += 1;
		else if(d["Online boarding"] == "3") onlineBoarding[3][1] += 1;
		else if(d["Online boarding"] == "4") onlineBoarding[4][1] += 1;
		else onlineBoarding[5][1] += 1;

		if(d["Seat comfort"] == "0") seat[0][1] += 1;
		else if(d["Seat comfort"] == "1") seat[1][1] += 1;
		else if(d["Seat comfort"] == "2") seat[2][1] += 1;
		else if(d["Seat comfort"] == "3") seat[3][1] += 1;
		else if(d["Seat comfort"] == "4") seat[4][1] += 1;
		else seat[5][1] += 1;

		if(d["Inflight entertainment"] == "0") entertainment[0][1] += 1;
		else if(d["Inflight entertainment"] == "1") entertainment[1][1] += 1;
		else if(d["Inflight entertainment"] == "2") entertainment[2][1] += 1;
		else if(d["Inflight entertainment"] == "3") entertainment[3][1] += 1;
		else if(d["Inflight entertainment"] == "4") entertainment[4][1] += 1;
		else entertainment[5][1] += 1;

		if(d["On-board service"] == "0") onboard[0][1] += 1;
		else if(d["On-board service"] == "1") onboard[1][1] += 1;
		else if(d["On-board service"] == "2") onboard[2][1] += 1;
		else if(d["On-board service"] == "3") onboard[3][1] += 1;
		else if(d["On-board service"] == "4") onboard[4][1] += 1;
		else onboard[5][1] += 1;

		if(d["Leg room service"] == "0") legRoom[0][1] += 1;
		else if(d["Leg room service"] == "1") legRoom[1][1] += 1;
		else if(d["Leg room service"] == "2") legRoom[2][1] += 1;
		else if(d["Leg room service"] == "3") legRoom[3][1] += 1;
		else if(d["Leg room service"] == "4") legRoom[4][1] += 1;
		else legRoom[5][1] += 1;

		if(d["Baggage handling"] == "0") baggage[0][1] += 1;
		else if(d["Baggage handling"] == "1") baggage[1][1] += 1;
		else if(d["Baggage handling"] == "2") baggage[2][1] += 1;
		else if(d["Baggage handling"] == "3") baggage[3][1] += 1;
		else if(d["Baggage handling"] == "4") baggage[4][1] += 1;
		else baggage[5][1] += 1;

		if(d["Checkin service"] == "0") checkin[0][1] += 1;
		else if(d["Checkin service"] == "1") checkin[1][1] += 1;
		else if(d["Checkin service"] == "2") checkin[2][1] += 1;
		else if(d["Checkin service"] == "3") checkin[3][1] += 1;
		else if(d["Checkin service"] == "4") checkin[4][1] += 1;
		else checkin[5][1] += 1;

		if(d["Inflight service"] == "0") inflight[0][1] += 1;
		else if(d["Inflight service"] == "1") inflight[1][1] += 1;
		else if(d["Inflight service"] == "2") inflight[2][1] += 1;
		else if(d["Inflight service"] == "3") inflight[3][1] += 1;
		else if(d["Inflight service"] == "4") inflight[4][1] += 1;
		else inflight[5][1] += 1;


		if(d["Cleanliness"] == "0") cleanliness[0][1] += 1;
		else if(d["Cleanliness"] == "1") cleanliness[1][1] += 1;
		else if(d["Cleanliness"] == "2") cleanliness[2][1] += 1;
		else if(d["Cleanliness"] == "3") cleanliness[3][1] += 1;
		else if(d["Cleanliness"] == "4") cleanliness[4][1] += 1;
		else cleanliness[5][1] += 1;

		if(d["satisfaction"] == "satisfied") satisfaction[0][1] += 1;
		else satisfaction[1][1] += 1;
	});

	var dmap = {
		"gender" : gender, 
		"customerType" : customerType, 
		"travelType" : travelType, 
		"fligtClass" : fligtClass, 
		"wifiService" : wifiService, 
		"timeConvenient" : timeConvenient,
		"booking" : booking,
		"gateLocation" : gateLocation,
		"food" : food,
		"onlineBoarding" : onlineBoarding,
		"seat" : seat,
		"entertainment" : entertainment,
		"onboard" : onboard,
		"legRoom" : legRoom,
		"baggage" : baggage,
		"checkin" : checkin,
		"inflight" : inflight,
		"cleanliness" : cleanliness,
		"satisfaction" : satisfaction
	};

    drawPieChart(dmap["gender"], "#pie");

    d3.select("#pie_dropdown").on("change",function(d){
        var selected = d3.select("#pie_dropdown").node().value;
        update_pie(selected)
    })

    function update_pie(selectedGroup) {
        d3.select("#pie").selectAll("svg").remove();
        drawPieChart(dmap[selectedGroup], "#pie")
    }
}

export function drawPieChart(dataset, id){
	var width = 800;
	var height = 800;


	var pie = d3.pie()
	            .sort(null)
	            .value(function(d){
	              return d[1];
	            });
	var piedata = pie(dataset);

	var outerRadius = width / 4;
	var innerRadius = 0;

	var arc = d3.arc()
	            .outerRadius(outerRadius)
	            .innerRadius(innerRadius);

	var colors = d3.schemeCategory10;

	var svg = d3.select(id)
				.append('svg')
				.attr('width', width)
				.attr('height', height);

	var arcs = svg.selectAll('g')
	              .data(piedata)
	              .enter()
	              .append('g')
	              .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

	arcs.append('path')
	    .attr('fill', function(d, i){
	      return colors[i];
	    })
	    .attr('d', function(d){
	      return arc(d);
	    });

	arcs.append('text')
			.attr('transform', function(d, i){
				var x = arc.centroid(d)[0] * 2.8;
				var y = arc.centroid(d)[1] * 2.8;
				if(i === 4) {
					return 'translate(' + (x * 1.2) + ', ' + (y * 1.2) + ')';
				} else if(i === 3) {
				  return 'translate(' + (x - 40) + ', ' + y + ')';
				} else if(i === 5) {
					return 'translate(' + (x + 40) + ', ' + y + ')';
				}
				return 'translate(' + x + ', ' + y + ')';
			})
			.attr('text-anchor', 'middle')
			.text(function(d){
				var percent = Number(d.value) / d3.sum(dataset, function(d){
					return d[1];
				}) * 100;
				return d.data[0] + ': ' + percent.toFixed(1) + '%';
			})

	arcs.append('line')
			.attr('stroke', 'black')
			.attr('x1', function(d){ return arc.centroid(d)[0] * 2; })
			.attr('y1', function(d){ return arc.centroid(d)[1] * 2; })
			.attr('x2', function(d, i){
				if(i === 4) {
					return arc.centroid(d)[0] * 3.2;
				}
				return arc.centroid(d)[0] * 2.5;
			})
			.attr('y2', function(d, i){
				if(i === 4) {
					return arc.centroid(d)[1] * 3.2;
				}
				return arc.centroid(d)[1] * 2.5;
			});
}
