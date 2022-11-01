import {ComputedRef, Ref} from "vue"
import * as d3 from "d3"

interface Margin {
    top: number,
    bottom: number,
    left: number,
    right: number
}

class Config {
	width: number = 600  
	height: number = 600
	margin: Margin = {top: 20, right: 20, bottom: 20, left: 20}
}

export class ArtistScatterplot {
	cfg: Config;
	id: String;
	options: any;
    xScale: any;
    yScale: any;
    xLabel: string;
    yLabel: string;
    emit: any;
	public constructor(id: String, xLabel:any, yLabel:any, options: any) {
		this.id = id
		this.options = options
        this.xLabel = xLabel
        this.yLabel = yLabel
		this.cfg = new Config()
	}

    
	init(emit: any) {
		// Put all of the options into a variable called cfg
		if('undefined' !== typeof this.options){
			for(var i in this.options){
				if('undefined' !== typeof this.options[i]){ (this.cfg as any)[i] = this.options[i]; }
			}
		}
        this.emit = emit
		
		//Initiate the radar chart SVG
        console.log(d3.select(this.id).node())
		const svg = d3.select(this.id as any).append("svg")
				.attr("width",  this.cfg.width + this.cfg.margin.left + this.cfg.margin.right)
				.attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom)
				.attr("class", "scatter"+this.id);

		//Append a g element		
		svg.append("g")
            .attr("class", "canvas")
            .attr("transform", "translate(" + (this.cfg.margin.left) + "," + (this.cfg.margin.top) + ")");
        this.xScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0, this.cfg.width])
        this.yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([this.cfg.height, 0])
        this.drawAxis()
    }

    drawAxis(){
		const svg = d3.select(this.id as any).select("svg")
        const canvas = svg.select("g.canvas")
        canvas.append("g")
            .attr("class", "axis_x")
            .attr("transform", `translate(0, ${this.cfg.height})`)
            .call(d3.axisBottom(this.xScale));

        canvas.append("text")
            .attr("class", "axis_x_label")
            .attr("transform", `translate(${this.cfg.width+20}, ${this.cfg.height+5})`)
            .attr("text-anchor", "middle")
            .text(this.xLabel)
            .attr("fill", '#2c8c94')
            .style("font-weight", "bold");
            

        canvas.append("g")
            .attr("class", "axis_y")
            .attr("transform", `translate(${0},0)`)
            .call(d3.axisLeft(this.yScale))
            .raise();

        canvas.append("text")
            .attr("class", "axis_y_label")
            .attr("transform", `translate(0, -10)`)
            .attr("text-anchor", "middle")
            .text(this.yLabel)
            .attr("fill", "#e37213")
            .style("font-weight", "bold")
    }

    update(data: any[]) {
        console.log(data)
        const canvas = d3.select(`${this.id}`).select("svg").select("g.canvas")
    
        var self = this
        const node_radius = 3
        canvas.selectAll("circle.entity")
        .data(data)
        .join( 
            (enter: any) => enter.append("circle") 
                        .attr("class", "entity_circle")
                        .attr("r", node_radius)
                        .attr("cx", (d:any) => this.xScale(d.x))
                        .attr("cy", (d:any) => this.yScale(d.y))
                        .attr("stroke", "black")
                        .selection(),
            (update: any) => update .transition().duration(1000)
                    .attr("cx", (d: any) => this.xScale(d.x))
                    .attr("cy", (d: any) => this.yScale(d.y))
                    .selection(),
        ) 
        .on("click", function(e, d) {
            self.emit("node-clicked", d)
        })
    }
}
