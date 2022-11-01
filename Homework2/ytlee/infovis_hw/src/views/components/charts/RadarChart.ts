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
	vbWidth: number = 700  
	vbHeight: number = 700
	margin: Margin = {top: 20, right: 20, bottom: 20, left: 20}
	levels: number = 3        //How many levels or inner circles should there be drawn 
	maxValue: number = 0      //What is the value that the biggest circle will represent 
	labelFactor: number = 1.09 //How much farther than the radius of the outer circle should the labels be placed 
	wrapWidth: number = 60   //The number of pixels after which a label needs to be given a new line
	opacityArea: number = 0.35  //The opacity of the area of the blob
	dotRadius: number = 4 			//The size of the colored circles of each blog
	opacityCircles: number = 0.1 	//The opacity of the circles of each blob
	strokeWidth: number = 2 		//The width of the stroke around each blob
	roundStrokes: boolean = false	//If true the area and stroke will follow a round path (cardinal-closed)
	color: any = d3.scaleOrdinal(d3.schemeCategory10)	//Color function
	circle_color: string = "black"
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
				if('undefined' !== typeof this.options[i]){ (this.cfg as any)[i] = this.options[i]; }
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
		this.Format = d3.format('.0%')			 	//Percentage formatting
		this.angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
		//Scale for the radius
		this.rScale = d3.scaleLinear()
			.range([0, radius])
			.domain([0, maxValue])
			.clamp(true)
		//The radial line function
		this.radarLine = d3.lineRadial()
			.curve(d3.curveLinearClosed)
			.radius(function(d:any) { return self.rScale(d.value); })
			.angle(function(d,i) {	return i*self.angleSlice; })
			
		if(this.cfg.roundStrokes) {
			this.radarLine.curve(d3.curveCardinalClosed)
			// radarLine.interpolate("cardinal-closed");
		}
		

		//Remove whatever chart with the same id/class was present before
		d3.select(`${this.id}`).select("svg").remove();
		
		//Initiate the radar chart SVG
		const svg = d3.select(`${this.id}`).append("svg")
				// .attr("width",  this.cfg.w + this.cfg.margin.left + this.cfg.margin.right)
				// .attr("height", this.cfg.h + this.cfg.margin.top + this.cfg.margin.bottom)
				.attr("viewBox", `0 0 ${this.cfg.vbWidth} ${this.cfg.vbHeight}`)
				.attr("width", "100%")
				.attr("height", "100%")
				.attr("class", "radar"+this.id);

		//Append a g element		
		var g = svg.append("g").attr("class", "canvas")
				.attr("transform", "translate(" + (this.cfg.w/2 + this.cfg.margin.left) + "," + (this.cfg.h/2 + this.cfg.margin.top) + ")");

		// draw background
		var self = this
		const background_data = allAxis.map(axis => { return {"axis":axis,"value":1}})
		const radarArea = g.selectAll("path.radarBackground")
			.data([background_data])
			.join(
				enter => enter.append("path")
							.attr("class", "radarArea")
							.attr("d", function(d,i) { return self.radarLine(d); })
							.style("fill" , "url(#radar-gradient)")
							.attr("clip-path", "url(#radar-shape)")
							// .style("fill-opacity", self.cfg.opacityArea)
							.selection(),
			)
		g.append("defs").attr("class", "radar-clip")
			.append("clipPath")
			.attr("id", "radar-shape")
			.attr("class", "radarArea")
			.append("path")
			.attr("d", this.radarLine(background_data))
		
		/////////////////////////////////////////////////////////
		////////// Glow filter for some extra pizzazz ///////////
		/////////////////////////////////////////////////////////
		
		//Filter for the outside glow
		var filter = g.append('defs').append('filter').attr('id','glow'),
			feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
			feMerge = filter.append('feMerge'),
			feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
			feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');
		
		// gradient for the radar area
		const defs = g.append('defs');
		const bgGradient = defs
			.append('radialGradient')
			.attr('id', 'radar-gradient')
			.attr("cx", "0.5")
			.attr("cy", "0.5")
			.attr("r", "0.5")
			.attr("fx", "0.5")
			.attr("fy", "0.5")
			bgGradient
			.append('stop')
			.attr('stop-color', '#fff6b7')
			.attr('offset', '10%');
			bgGradient
			.append('stop')
			// .attr('stop-color', '#F2C66B')
			// .attr('stop-color', '#fed777')
			.attr('stop-color', '#ffc73f')
			.attr('offset', '30%');
			bgGradient
			.append('stop')
			// .attr('stop-color', '#D13D73')
			.attr('stop-color', '#eb766d')
			.attr('offset', '65%');
			bgGradient
			.append('stop')
			// .attr('stop-color', '#D13D73')
			.attr('stop-color', 'red')
			.attr('offset', '85%');

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
			// .style("filter" , "url(#glow)");

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
			.style("font-size", "15px")
			.attr("text-anchor", "middle")
			.attr("dy", "0.35em")
			.attr("x", function(d, i){ return self.rScale(maxValue) * self.cfg.labelFactor * Math.cos(self.angleSlice*i - Math.PI/2); })
			.attr("y", function(d, i){ return self.rScale(maxValue) * self.cfg.labelFactor * Math.sin(self.angleSlice*i - Math.PI/2); })
			.text(function(d){return d})
			.call(self.wrap, self.cfg.wrapWidth);


	}

	update(data: any[], transition_options: any) {
		const svg = d3.select(`${this.id}`).select("svg")
		const g = svg.select("g.canvas")
		const defs = g.select("defs.radar-clip")
		var self = this
		const duration = transition_options.duration
		const ease_func = transition_options.ease_func
		// const radarArea = g.selectAll("path.radarArea")
		const radarArea = defs.selectAll("clipPath.radarArea")
			.data([data])
			.join(
				// enter => enter.append("path")
				enter => enter.select("path")
							.transition().duration(duration).ease(ease_func)
							.attr("d", function(d,i) { return self.radarLine(d); })
							// .append("rect")
							// .attr("x", 0)
							// .attr("y", 0)
							// .attr("width", 300)
							// .attr("height", 800)
							// .style("fill" , "url(#radar-gradient)")
							.selection(),
				update => update.select("path")
							.transition().duration(duration).ease(ease_func)
							.attr("d", function(d,i) { return self.radarLine(d); })
							// .style("fill" , "url(#radar-gradient)")
							.selection(),
				exit => exit.remove()
			)

			// radarArea.on('mouseover', function (d,i){
			// 	//Dim all blobs
			// 	d3.selectAll(".radarArea")
			// 		.transition().duration(200)
			// 		.style("fill-opacity", 0.1); 
			// 	//Bring back the hovered over blob
			// 	d3.select(this)
			// 		.transition().duration(200)
			// 		.style("fill-opacity", 0.7);	
			// })
			// .on('mouseout', function(){
			// 	//Bring back all blobs
			// 	d3.selectAll(".radarArea")
			// 		.transition().duration(200)
			// 		.style("fill-opacity", self.cfg.opacityArea);
			// });
			
		//Create the outlines	
		// blobWrapper.append("path")
		const radarStroke = g.selectAll("path.radarStroke")
			.property("__oldData__", function(d){ return d; } )
			// .property("__oldData__", "some value")
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
							.easeVarying(function(d) {
								return transition_options.ease_func
							})
							.attr("d", function(d,i) { return self.radarLine(d); })
							.style("stroke", function(d,i) { return self.cfg.color(i); })
							.selection(),
				exit => exit.remove()

			)
		
		//Append the circles
		// blobWrapper.selectAll(".radarCircle")
		const radarCircles = g.selectAll("circle.radarCircle")
			.data(data)
			.join(
				enter => enter.append("circle").attr("class", "radarCircle")
						.attr("r", self.cfg.dotRadius)
						.attr("cx", function(d,i){ return self.rScale(d.value) * Math.cos(self.angleSlice*i - Math.PI/2); })
						.attr("cy", function(d,i){ return self.rScale(d.value) * Math.sin(self.angleSlice*i - Math.PI/2); })
						.style("fill", self.cfg.circle_color)
						.style("fill-opacity", 0.8)
						.selection(),
				update => update.transition().duration(duration).ease(ease_func)
						.attr("cx", function(d,i){ return self.rScale(d.value) * Math.cos(self.angleSlice*i - Math.PI/2); })
						.attr("cy", function(d,i){ return self.rScale(d.value) * Math.sin(self.angleSlice*i - Math.PI/2); })
						.selection()
			)

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
			.attr("cx", function(d:any,i){ return self.rScale(d.value) * Math.cos(self.angleSlice*i - Math.PI/2); })
			.attr("cy", function(d:any,i){ return self.rScale(d.value) * Math.sin(self.angleSlice*i - Math.PI/2); })
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

	wrap(text:any, width:any) {
		return
	  text.each(() => {
		console.log(d3.select(this).node())
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line:any[] = [],
			lineNumber = 0,
			lineHeight = 1.4, // ems
			y = text.attr("y"),
			x = text.attr("x"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			
		while (word = words.pop()) {
		  line.push(word);
		  tspan.text(line.join(" "));
		  if (tspan.node()!.getComputedTextLength() > width) {
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		  }
		}
	  });
	}//wrap	
}