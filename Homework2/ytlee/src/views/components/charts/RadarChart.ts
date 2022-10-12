/////////////////////////////////////////////////////////
/////////////// The Radar Chart Function ////////////////
/////////////// Written by Nadieh Bremer ////////////////
////////////////// VisualCinnamon.com ///////////////////
/////////// Inspired by the code of alangrafu ///////////
/////////////////////////////////////////////////////////

//
// modified with animation by Sam Yu-Te Lee
//

import * as d3 from "d3"

interface Margin {
    top: number,
    bottom: number,
    left: number,
    right: number
}

class Config {
	w: number = 600  
	h: number = 600
	margin: Margin = {top: 20, right: 20, bottom: 20, left: 20}
	levels: number = 3        //How many levels or inner circles should there be drawn 
	maxValue: number = 0      //What is the value that the biggest circle will represent 
	labelFactor: number = 1.25 //How much farther than the radius of the outer circle should the labels be placed 
	wrapWidth: number = 60   //The number of pixels after which a label needs to be given a new line
	opacityArea: number = 0.35  //The opacity of the area of the blob
	dotRadius: number = 4 			//The size of the colored circles of each blog
	opacityCircles: number = 0.1 	//The opacity of the circles of each blob
	strokeWidth: number = 2 		//The width of the stroke around each blob
	roundStrokes: boolean = false	//If true the area and stroke will follow a round path (cardinal-closed)
	color: any = d3.scaleOrdinal(d3.schemeCategory10)	//Color function
}
export class RadarChart {
	cfg: Config;
	id: String
	options: any;
	axis: string[];
	radarLine: any;
	rScale: any;
	angleSlice: any;
	Format: any;
	public constructor(id: String, axis: string[], options: any) {
		this.id = id
		this.axis = axis
		this.options = options
		this.cfg = new Config()
	}

	init() {
		// Put all of the options into a variable called cfg
		if('undefined' !== typeof this.options){
			for(var i in this.options){
				if('undefined' !== typeof this.options[i]){ this.cfg[i] = this.options[i]; }
			}
		}
		
		// If the supplied maxValue is smaller than the actual one, replace by the max in the data
		const maxValue = this.cfg.maxValue
		// var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i) {
		// 	return d3.max(i.map(function(o) {
		// 		return o.value;
		// 	}))
		// }));
			
		// var allAxis = (data.map(function(i, j){return i.axis})),	//Names of each axis
		var allAxis = this.axis,	                //Names of each axis
			total = allAxis.length,					//The number of different axes
			radius = Math.min(this.cfg.w/2, this.cfg.h/2) 	//Radius of the outermost circle
		this.Format = d3.format('%')			 	//Percentage formatting
		this.angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
		
		//Scale for the radius
		this.rScale = d3.scaleLinear()
			.range([0, radius])
			.domain([0, maxValue]);

		//Remove whatever chart with the same id/class was present before
		d3.select(this.id).select("svg").remove();
		
		//Initiate the radar chart SVG
		const svg = d3.select(this.id).append("svg")
				.attr("width",  this.cfg.w + this.cfg.margin.left + this.cfg.margin.right)
				.attr("height", this.cfg.h + this.cfg.margin.top + this.cfg.margin.bottom)
				.attr("class", "radar"+this.id);
		console.log(this.id, svg.node())

		//Append a g element		
		var g = svg.append("g")
				.attr("transform", "translate(" + (this.cfg.w/2 + this.cfg.margin.left) + "," + (this.cfg.h/2 + this.cfg.margin.top) + ")");
		
		/////////////////////////////////////////////////////////
		////////// Glow filter for some extra pizzazz ///////////
		/////////////////////////////////////////////////////////
		
		//Filter for the outside glow
		var filter = g.append('defs').append('filter').attr('id','glow'),
			feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
			feMerge = filter.append('feMerge'),
			feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
			feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

		/////////////////////////////////////////////////////////
		/////////////// Draw the Circular grid //////////////////
		/////////////////////////////////////////////////////////
		
		//Wrapper for the grid & axes
		var axisGrid = g.append("g").attr("class", "axisWrapper");

		var self = this
		axisGrid.selectAll(".levels")
		.data(d3.range(1,(this.cfg.levels+1)).reverse())
		.enter()
			.append("circle")
			.attr("class", "gridCircle")
			.attr("r", function(d, i){return radius/self.cfg.levels*d;})
			.style("fill", "#CDCDCD")
			.style("stroke", "#CDCDCD")
			.style("fill-opacity", self.cfg.opacityCircles)
			.style("filter" , "url(#glow)");

		//Text indicating at what % each level is
		axisGrid.selectAll(".axisLabel")
		.data(d3.range(1,(self.cfg.levels+1)).reverse())
		.enter().append("text")
		.attr("class", "axisLabel")
		.attr("x", 4)
		.attr("y", function(d){return -d*radius/self.cfg.levels;})
		.attr("dy", "0.4em")
		.style("font-size", "10px")
		.attr("fill", "#737373")
		.text(function(d,i) { return self.Format(maxValue * d/self.cfg.levels); });

		/////////////////////////////////////////////////////////
		//////////////////// Draw the axes //////////////////////
		/////////////////////////////////////////////////////////
		
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
			.attr("x2", function(d, i){ return self.rScale(maxValue*1.1) * Math.cos(self.angleSlice*i - Math.PI/2); })
			.attr("y2", function(d, i){ return self.rScale(maxValue*1.1) * Math.sin(self.angleSlice*i - Math.PI/2); })
			.attr("class", "line")
			.style("stroke", "white")
			.style("stroke-width", "2px");

		//Append the labels at each axis
		axis.append("text")
			.attr("class", "legend")
			.style("font-size", "11px")
			.attr("text-anchor", "middle")
			.attr("dy", "0.35em")
			.attr("x", function(d, i){ return self.rScale(maxValue * self.cfg.labelFactor) * Math.cos(self.angleSlice*i - Math.PI/2); })
			.attr("y", function(d, i){ return self.rScale(maxValue * self.cfg.labelFactor) * Math.sin(self.angleSlice*i - Math.PI/2); })
			.text(function(d){return d})
			.call(self.wrap, self.cfg.wrapWidth);

		/////////////////////////////////////////////////////////
		///////////// Draw the radar chart blobs ////////////////
		/////////////////////////////////////////////////////////
		
		//The radial line function
		this.radarLine = d3.lineRadial()
			.curve(d3.curveLinearClosed)
			.radius(function(d) { return self.rScale(d.value); })
			.angle(function(d,i) {	return i*self.angleSlice; });
			
		if(this.cfg.roundStrokes) {
			this.radarLine.curve(d3.curveCardinalClosed)
			// radarLine.interpolate("cardinal-closed");
		}
	}

	update(data) {
		const svg = d3.select(this.id).select("svg")
		const g = svg.select("g")
		var self = this

		const duration = 100
		const radarArea = g.selectAll("path.radarArea")
			.data([data])
			.join(
				enter => enter.append("path")
							.attr("class", "radarArea")
							.attr("d", function(d,i) { return self.radarLine(d); })
							.style("fill", function(d,i) { return self.cfg.color(i); })
							.style("fill-opacity", self.cfg.opacityArea)
							.selection(),
				update => update.transition().duration(duration)
							.attr("d", function(d,i) { return self.radarLine(d); })
							.style("fill", function(d,i) { return self.cfg.color(i); })
							.style("fill-opacity", self.cfg.opacityArea)
							.selection(),
				exit => exit.remove()
			)

			radarArea.on('mouseover', function (d,i){
				//Dim all blobs
				d3.selectAll(".radarArea")
					.transition().duration(200)
					.style("fill-opacity", 0.1); 
				//Bring back the hovered over blob
				d3.select(this)
					.transition().duration(200)
					.style("fill-opacity", 0.7);	
			})
			.on('mouseout', function(){
				//Bring back all blobs
				d3.selectAll(".radarArea")
					.transition().duration(200)
					.style("fill-opacity", self.cfg.opacityArea);
			});
			
		//Create the outlines	
		// blobWrapper.append("path")
		const radarStroke = g.selectAll("path.radarStroke")
			.data([data])
			.join(
				enter => enter.append("path")
							.attr("class", "radarStroke")
							.attr("d", function(d,i) { return self.radarLine(d); })
							.style("stroke-width", self.cfg.strokeWidth + "px")
							.style("stroke", function(d,i) { return self.cfg.color(i); })
							.style("fill", "none")
							.style("filter" , "url(#glow)")
							.selection(),
				update => update.transition().duration(duration)
							.attr("d", function(d,i) { return self.radarLine(d); })
							.style("stroke", function(d,i) { return self.cfg.color(i); })
							.selection(),
				exit => exit.remove()

			)
		
		//Append the circles
		// blobWrapper.selectAll(".radarCircle")
		const radarCircles = g.selectAll("circle.radarCircle")
			.data(data)
			.enter().append("circle")
			.attr("class", "radarCircle")
			.attr("r", self.cfg.dotRadius)
			.attr("cx", function(d,i){ return self.rScale(d.value) * Math.cos(self.angleSlice*i - Math.PI/2); })
			.attr("cy", function(d,i){ return self.rScale(d.value) * Math.sin(self.angleSlice*i - Math.PI/2); })
			.style("fill", function(d,i,j) { return self.cfg.color(j); })
			.style("fill-opacity", 0.8);

		/////////////////////////////////////////////////////////
		//////// Append invisible circles for tooltip ///////////
		/////////////////////////////////////////////////////////
		
		//Wrapper for the invisible circles on top
		var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
			.data(data)
			.enter().append("g")
			.attr("class", "radarCircleWrapper");
			
		//Append a set of invisible circles on top for the mouseover pop-up
		blobCircleWrapper.selectAll(".radarInvisibleCircle")
			.data(function(d,i) { return d; })
			.enter().append("circle")
			.attr("class", "radarInvisibleCircle")
			.attr("r", self.cfg.dotRadius*1.5)
			.attr("cx", function(d,i){ return self.rScale(d.value) * Math.cos(self.angleSlice*i - Math.PI/2); })
			.attr("cy", function(d,i){ return self.rScale(d.value) * Math.sin(self.angleSlice*i - Math.PI/2); })
			.style("fill", "none")
			.style("pointer-events", "all")
			.on("mouseover", function(d,i) {
				const newX =  parseFloat(d3.select(this).attr('cx')) - 10;
				const newY =  parseFloat(d3.select(this).attr('cy')) - 10;
						
				tooltip
					.attr('x', newX)
					.attr('y', newY)
					.text(self.Format(d.value))
					.transition().duration(200)
					.style('opacity', 1);
			})
			.on("mouseout", function(){
				tooltip.transition().duration(200)
					.style("opacity", 0);
			});
			
		//Set up the small tooltip for when you hover over a circle
		var tooltip = g.append("text")
			.attr("class", "tooltip")
			.style("opacity", 0);
		
	}

	wrap(text, width) {
	  text.each(function() {
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
}