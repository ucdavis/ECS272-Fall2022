import * as d3 from "d3"

interface Margin {
    top: number,
    bottom: number,
    left: number,
    right: number
}
class Config {
	vbWidth: number = 700  
	vbHeight: number = 400
	margin: Margin = {top: 20, right: 20, bottom: 50, left: 10}
    radius = 3; // (fixed) radius of the circles
    value = d => d; // convenience alias for x
    label="unknown"; // convenience alias for xLabel
    type = d3.scaleLinear; // convenience alias for xType
    domain; // convenience alias for xDomain
    x = d=>d.value; // given d in data, returns the quantitative x value
    title = null; // given d in data, returns the title
    group=null; // given d in data, returns an (ordinal) value for color
    groups=null; // an array of ordinal values representing the data groups
    colors = d3.schemeTableau10; // an array of color strings, for the dots
    xScale;
    xMin = 0;
    xMax = 1;
    padding=1.5;
    xLabel = "unknown"; // a label for the x-axis
    tooltip_class="beeswarm_tooltip";
}

export class BeeswarmChart {
    id: String;
    cfg: Config;
    options: any;
    width: number;
    height: number;
    T:any;
    tooltip:any;
    init_done:boolean;
    old_node_color:string;

    public constructor(id: String, options:any) {
        this.id = id
        this.cfg = new Config()
        this.options = options
        this.width = this.cfg.vbWidth - this.cfg.margin.left - this.cfg.margin.right
        this.height = this.cfg.vbHeight - this.cfg.margin.top - this.cfg.margin.bottom
        this.init_done = false
        this.old_node_color = "black"
    }

    init() {
        if('undefined' !== typeof this.options){
            for(var i in this.options){
                if('undefined' !== typeof this.options[i]){ (this.cfg as any)[i] = this.options[i]; }
            }
        }

        const svg = d3.select(`${this.id}`).append("svg")
            .attr("class", "beeswarm_svg")
            .attr("viewBox", `0 0 ${this.cfg.vbWidth} ${this.cfg.vbHeight}`)
            .attr("width", "100%")
            .attr("height", "100%")
            // .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
        const canvas = svg.append("g").attr("class", "canvas")
                    .attr("transform", "translate(" + (this.cfg.margin.left) + "," + (this.cfg.margin.top) + ")");
        this.tooltip = d3.select(`${this.id}`).select(`.${this.cfg.tooltip_class}`)
        this.updateXaxis(this.cfg.xMin, this.cfg.xMax)
        const zoomed:any = ({transform}) => {
            canvas.attr("transform", transform)
            // const xAxis = d3.axisBottom(this.cfg.xScale).tickSizeOuter(0);
            // canvas.select("g.x-axis").call(xAxis.scale(transform.rescaleX(this.cfg.xScale)))
        }
        const zoom: any = d3.zoom().scaleExtent([1, 3]).on("zoom", zoomed)
        svg.call(zoom)
    }

    update(data, emit) {
        const canvas = d3.select("svg.beeswarm_svg").select("g.canvas")
        // Compute values.
        const X = d3.map(data, this.cfg.x).map(x => x == null ? NaN : +x);
        const T = this.cfg.title == null ? null : d3.map(data, this.cfg.title);
        this.T = T
        const G = this.cfg.group == null ? null : d3.map(data, this.cfg.group);

        // Compute which data points are considered defined.
        const I = d3.range(X.length).filter(i => !isNaN(X[i]));

        // Compute the y-positions.
        const Y = dodge(I.map(i => this.cfg.xScale(X[i])), this.cfg.radius * 2 + this.cfg.padding);

        // Given an array of x-values and a separation radius, returns an array of y-values.
        function dodge(X, radius) {
            const Y = new Float64Array(X.length);
            const radius2 = radius ** 2;
            const epsilon = 1e-3;
            let head:any = null, tail:any = null;

            // Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
            function intersects(x, y) {
                let a:any = head;
                while (a) {
                    const ai = a.index;
                    if (radius2 - epsilon > (X[ai] - x) ** 2 + (Y[ai] - y) ** 2) return true;
                    a = a.next;
                }
                return false;
            }

            // Place each circle sequentially.
            for (const bi of d3.range(X.length).sort((i, j) => X[i] - X[j])) {

            // Remove circles from the queue that can’t intersect the new circle b.
            while (head && X[head.index] < X[bi] - radius2) head = head.next;

            // Choose the minimum non-intersecting tangent.
            if (intersects(X[bi], Y[bi] = 0)) {
                let a = head;
                Y[bi] = Infinity;
                do {
                const ai = a.index;
                let y = Y[ai] + Math.sqrt(radius2 - (X[ai] - X[bi]) ** 2);
                if (y < Y[bi] && !intersects(X[bi], y)) Y[bi] = y;
                a = a.next;
                } while (a);
            }
        
            // Add b to the queue.
            const b = {index: bi, next: null};
            if (head === null) head = tail = b;
            else tail = tail.next = b;
            }
        
            return Y;
        }
        var self = this
        const dot = canvas
            .selectAll("circle")
            .data(I)
            .join(
                enter => enter.append("circle")
                        .attr("cx", i => this.cfg.xScale(X[i]))
                        .attr("cy", 0)
                        .attr("fill", this.init_done?"#01c401":"black")
                        .attr("r", this.init_done?this.cfg.radius:0)
                        .transition().duration(1000)
                        .attr("cx", i => this.cfg.xScale(X[i]))
                        .attr("cy", i => this.height -  this.cfg.radius - Y[i])
                        .attr("r", this.cfg.radius)
                        .transition().duration(100).delay(500)
                        .attr("fill", this.init_done?"#01c401":"black")
                        .attr("cursor", "pointer")
                        .selection(),
                update => update.attr("fill", "black")
                    .transition().duration(1000).delay(800)
                    .attr("cx", i => this.cfg.xScale(X[i]))
                    .attr("cy", i => this.height -  this.cfg.radius - Y[i])
                    .attr("fill", "black")
                    .selection(),
                exit => exit.transition().duration(500)
                    .attr("fill", "red")
                    .transition().duration(1000).delay(500)
                    .attr("cy", -100)
                    .style("opacity", -1)
                    .remove()
            )
            .on("mousemove", function(e) {
                self.tooltip
                    .style("left", e.offsetX + 20 + "px")
                    .style("top", e.offsetY - 10 + "px")
            })
            .on("mouseover", function(e, i) {
               d3.select(this)
                .attr("r", self.cfg.radius + 2) 
                .attr("stroke", "white")
                .attr("stroke-width", 2)
                self.tooltip.style("opacity", 1)
                            .html(self.T[i])
            })
            .on("mouseout", function(e, i) {
               d3.select(this)
                .attr("r", self.cfg.radius) 
                .attr("stroke", "none")
                .attr("stroke-width", 2)
                self.tooltip.style("opacity", 0)
            })
            .on("click", function(e, i){
                emit("node-clicked", self.T[i])
            })
        if(!this.init_done) this.init_done = true
    }
    updateXaxis(xMin, xMax) {
        const canvas = d3.select("svg.beeswarm_svg").select("g.canvas")
        this.cfg.xScale = d3.scaleLog()
            .domain([xMin, xMax])
            .range([0, this.width])
        const xAxis = d3.axisBottom(this.cfg.xScale).tickSizeOuter(0);
        canvas.select("g.x-axis").remove()
        // x axis
        canvas.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${this.height})`)
            .call(xAxis)
            .call(g => g.append("text")
                .attr("x", this.width )
                .attr("y", 30)
                .attr("fill", "currentColor")
                .attr("text-anchor", "end")
                .text(this.cfg.xLabel));
    }
    highlight(target_swarm, old_swarm = undefined) {
        if(!target_swarm) return 
        const canvas = d3.select("svg.beeswarm_svg").select("g.canvas")
        if(old_swarm) {
            const old_node = canvas.selectAll("circle").filter(i => this.T[i].split(":")[0] === old_swarm)
            old_node.attr("fill", this.old_node_color)
        }
        const highlight_node = canvas.selectAll("circle").filter(i => this.T[i].split(":")[0] === target_swarm)
        this.old_node_color = highlight_node.attr("fill")
        const cx = highlight_node.attr("cx")
        const cy = highlight_node.attr("cy")
        highlight_node.attr("cx", this.width/2).attr("cy", 0)
            .attr("r", this.cfg.radius*2)
            .attr("fill", "blue")
            .transition().duration(1000)
            .attr("cx", cx)
            .attr("cy", cy)
            .transition().duration(500)
            .attr("r", this.cfg.radius)
    }
}  

