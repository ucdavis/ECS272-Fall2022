
<template>
    <a-row type="flex">
            <div id="bs"></div>
            <div style="margin-left: 0px">
                <label>Movie Genre: </label>
                <a-select v-model:value="selected" style="width: 160px" @change="handleChange">
                    <a-select-option value="sci">Science Fiction</a-select-option>
                    <a-select-option value="cri">Crime</a-select-option>
                    <a-select-option value="adv">Adventure</a-select-option>
                    <a-select-option value="ani">Animation</a-select-option>
                    <a-select-option value="rom">Romance</a-select-option>
                    <a-select-option value="act">Action</a-select-option>
                </a-select>
            </div>
    </a-row>
</template>

<script>
    import * as d3 from "d3";
    import csvPath from '../../assets/data/budget_total.csv';

    export default {
        name: 'Bs',
        data() {
            return {
            	selected: "Science Fiction",
                actData: Array,
                advData: Array,
                criData: Array,
                aniData: Array,
                romData: Array,
                sciData: Array,
            }
        },
        props:{
            myRadarData: Object,
        },
        mounted(){
            this.processData().then(() => this.drawScatter(this.sciData, "#440154ff"));
        },
        methods: {
            processData(){
                return new Promise((res) => {
                    d3.csv(csvPath).then((f) => {
                        var data = f;
                        var sci = [];
                        var act = [];
                        var adv = [];
                        var cri = [];
                        var ani = [];
                        var rom = [];
                        data.forEach(d => {
                        	if(d["type"] == "Action"){
                        		act.push({"budget":d["budget"], "revenue": d["revenue"]});
                        	} else if(d["type"] == "Adventure"){
                        		adv.push({"budget":d["budget"], "revenue": d["revenue"]});
                        	} else if(d["type"] == "Crime"){
                        		cri.push({"budget":d["budget"], "revenue": d["revenue"]});
                        	} else if(d["type"] == "Animation"){
                        		ani.push({"budget":d["budget"], "revenue": d["revenue"]});
                        	} else if(d["type"] == "Romance"){
                        		rom.push({"budget":d["budget"], "revenue": d["revenue"]});
                        	} else if(d["type"] == "Science Fiction"){
                        		sci.push({"budget":d["budget"], "revenue": d["revenue"]});
                        	}
                        });
                        this.actData = act;
                        this.advData = adv;
                        this.criData = cri;
                        this.aniData = ani;
                        this.romData = rom;
                        this.sciData = sci;
                        res();
                    });
                });
            },
            // dataProcess(){
            //     const data = await d3.csv(csvPath);

            //     var eco = {"onboard" : 0, "food" : 0, "seat": 0, "entertainment" : 0, "checkin": 0, "cleanliness" : 0};
            //     var ecoCount = 0;
            //     var ecoPlus = {"onboard" : 0, "food" : 0, "seat": 0, "entertainment" : 0, "checkin": 0, "cleanliness" : 0};
            //     var ecoPlusCount = 0;
            //     var business = {"onboard" : 0, "food" : 0, "seat": 0, "entertainment" : 0, "checkin": 0, "cleanliness" : 0};
            //     var businessCount = 0;
            //     data.forEach(d => {
            //         if(d["Class"] == "Eco"){
            //             ecoCount += 1;
            //             eco["onboard"] += parseInt(d["On-board service"]);
            //             eco["food"] += parseInt(d["Food and drink"]);
            //             eco["seat"] += parseInt(d["Seat comfort"]);
            //             eco["entertainment"] += parseInt(d["Inflight entertainment"]);
            //             eco["checkin"] += parseInt(d["Checkin service"]);
            //             eco["cleanliness"] += parseInt(d["Cleanliness"]);
            //         } else if(d["Class"] == "Eco Plus"){
            //             ecoPlusCount += 1;
            //             ecoPlus["onboard"] += parseInt(d["On-board service"]);
            //             ecoPlus["food"] += parseInt(d["Food and drink"]);
            //             ecoPlus["seat"] += parseInt(d["Seat comfort"]);
            //             ecoPlus["entertainment"] += parseInt(d["Inflight entertainment"]);
            //             ecoPlus["checkin"] += parseInt(d["Checkin service"]);
            //             ecoPlus["cleanliness"] += parseInt(d["Cleanliness"]);
            //         } else if(d["Class"] == "Business"){
            //             businessCount += 1;
            //             business["onboard"] += parseInt(d["On-board service"]);
            //             business["food"] += parseInt(d["Food and drink"]);
            //             business["seat"] += parseInt(d["Seat comfort"]);
            //             business["entertainment"] += parseInt(d["Inflight entertainment"]);
            //             business["checkin"] += parseInt(d["Checkin service"]);
            //             business["cleanliness"] += parseInt(d["Cleanliness"]);
            //         }
            //     })
            //     for(var key in eco){
            //         eco[key] = eco[key] / ecoCount;
            //     }
            //     for(var key in ecoPlus){
            //         ecoPlus[key] = ecoPlus[key] / ecoPlusCount;
            //     }
            //     for(var key in business){
            //         business[key] = business[key] / businessCount;
            //     }

            //     formatData = {"Eco":eco, "Eco Plus": ecoPlus, "Business": business};
            //     this.radarData = formatData
            // },
            handleChange() {
                d3.select('#bs').select('svg').remove();
                if (this.selected == 'sci') {
                	this.drawScatter(this.sciData, "#440154ff");
                } else if(this.selected == 'adv'){
                	this.drawScatter(this.advData, "#21908dff");
                } else if(this.selected == 'ani'){
                	this.drawScatter(this.aniData, "#fde725ff");
                } else if(this.selected == 'act'){
                	this.drawScatter(this.actData, "#ade624ff");
                } else if(this.selected == 'cri'){
                	this.drawScatter(this.criData, "#2faff4ff");
                } else if(this.selected == 'rom'){
                	this.drawScatter(this.romData, "#ba92aeff");
                }
            },
            drawScatter(data, color){
                console.log(this.bsData)
                var margin = {top: 10, right: 30, bottom: 30, left: 180},
                    // width = 460 - margin.left - margin.right,
                    width =  370,
                    height = 280 - margin.top - margin.bottom;

                // append the svg object to the body of the page
                var Svg = d3.select("#bs")
                  .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                    .attr("transform",
                          "translate(" + margin.left + "," + margin.top + ")");

                var x = d3.scaleLinear()
                .domain([0, 400])
                .range([ 0, width ]);
                var xAxis = Svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));


                // Add Y axis
                var y = d3.scaleLinear()
                .domain([0, 2900])
                .range([ height, 0]);

                Svg.append("text")
                .style("font-size", "12px")
                .attr("text-anchor", "end")
                .attr("x", width + 10)
                .attr("y", height + margin.top + 16)
                .text("budget (million)");

                Svg.append("text")
                .style("font-size", "12px")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left+140)
                .attr("x", -margin.top)
                .text("revenue (million)")
                
                Svg.append("g")
                .call(d3.axisLeft(y));

                // Add a clipPath: everything out of this area won't be drawn.
                var clip = Svg.append("defs").append("svg:clipPath")
                  .attr("id", "clip")
                  .append("svg:rect")
                  .attr("width", width )
                  .attr("height", height )
                  .attr("x", 0)
                  .attr("y", 0);

                // Color scale: give me a specie name, I return a color
                // var color = d3.scaleOrdinal()
                // .domain(["Eco", "Eco Plus", "Business" ])
                // .range([ "#440154ff", "#21908dff", "#fde725ff"])

              // Add brushing
                var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
                  .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
                  .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function

                // Create the scatter variable: where both the circles and the brush take place
                var scatter = Svg.append('g')
                .attr("clip-path", "url(#clip)")

                  // Add circles
                scatter
                    .selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .transition().duration(500)
                      .attr("cx", function (d) { return x(d.budget); } )
                      .attr("cy", function (d) { return y(d.revenue); } )
                      .attr("r", 8)
                      .style("fill", color)
                      .style("opacity", 0.5)

                // Add the brushing
                scatter
                    .append("g")
                      .attr("class", "brush")
                      .call(brush);

                  // A function that set idleTimeOut to null
                var idleTimeout
                function idled() { idleTimeout = null; }

                  // A function that update the chart for given boundaries
                function updateChart({selection}) {



                    // If no selection, back to initial coordinate. Otherwise, update X axis domain
                    if(!selection){
                      if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
                      x.domain([0, 280])
                    }else{
                      x.domain([ x.invert(selection[0]), x.invert(selection[1]) ])
                      scatter.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
                    }

                    // Update axis and circle position
                    xAxis.transition().duration(1000).call(d3.axisBottom(x))
                    scatter
                      .selectAll("circle")
                      .transition().duration(1000)
                      .attr("cx", function (d) { return x(d.budget); } )
                      .attr("cy", function (d) { return y(d.revenue); } )

                }

            },
        }
    }

</script>