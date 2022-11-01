<template>
    <div class="radar_container">
        <div id="checkbox-selection" class="dropdown-check-list">
            <span class="anchor">Filter Data</span>
            <ul id="checkbox-selection-items" class="items">
                <li><input type="checkbox" @click="checkboxChanged($event)" checked=true id="Inflight Wifi"/> Inflight Wifi</li>
                <li><input type="checkbox" @click="checkboxChanged($event)" checked=true id="Departure/Arrival Time"/> Departure/Arrival Time</li>
                <li><input type="checkbox" @click="checkboxChanged($event)" checked=true id="Ease of Booking"/> Ease of Booking</li>
                <li><input type="checkbox" @click="checkboxChanged($event)" checked=true id="Gate Location"/> Gate Location</li>
                <li><input type="checkbox" @click="checkboxChanged($event)" checked=true id="Food and Drink"/> Food and Drink</li>
                <li><input type="checkbox" @click="checkboxChanged($event)" checked=true id="Online Boarding"/> Online Boarding</li>
                <li><input type="checkbox" @click="checkboxChanged($event)" checked=true id="Seat Comfort"/> Seat Comfort</li>
                <li><input type="checkbox" @click="checkboxChanged($event)" checked=true id="Inflight Entertainment"/> Inflight Entertainment</li>
                <li><input type="checkbox" @click="checkboxChanged($event)" checked=true id="On-board Service"/> On-board Service</li>
                <li><input type="checkbox" @click="checkboxChanged($event)" checked=true id="Leg Room"/> Leg Room</li>
                <li><input type="checkbox" @click="checkboxChanged($event)" checked=true id="Baggage Handling"/> Baggage Handling</li>
                <li><input type="checkbox" @click="checkboxChanged($event)" checked=true id="Checkin"/> Checkin</li>
                <li><input type="checkbox" @click="checkboxChanged($event)" checked=true id="Inflight Service"/> Inflight Service</li>
                <li><input type="checkbox" @click="checkboxChanged($event)" checked=true id="Cleanliness"/> Cleanliness</li>
            </ul>
        </div>
        <h1 id="radar_title">Average Respondent Rating By Service Category</h1>
        <div id="radar"> </div>
    </div>
</template>

<script>
    import * as d3 from "d3";

    export default {
        name: 'RadarPlot', 
        data() {
            return {
                name: 'Hello',
                margin : 30,
                radius : 160,
                axisCircles: 5,
                dotRadius: 4,
                // 14 elements
                axesDomain : [
                    "Inflight Wifi", 
                    "Departure/Arrival Time", 
                    "Ease of Booking", 
                    "Gate Location", 
                    "Food and Drink", 
                    "Online Boarding", 
                    "Seat Comfort", 
                    "Inflight Entertainment", 
                    "On-board Service", 
                    "Leg Room", 
                    "Baggage Handling", 
                    "Checkin", 
                    "Inflight Service",
                    "Cleanliness"
                ],
                maxValue : 5,
                angleSlice : Math.PI * 2 / 14,
                axisLabelFactor : 1.12,
                category : d => ["Dissatisfied", "Satisfied", "Disloyal", "Loyal"][d],
                dissatisfied_v_satisfied_data : [],
                dissatisfied_v_satisfied_filtered_data : [],
                disloyal_v_loyal_data : [],
                disloyal_v_loyal_filtered_data : [],
                drop_down_option : "Dis_Vs_Sat",
                id_map : {
                    "Inflight Wifi" : 0,
                    "Departure/Arrival Time" : 1,
                    "Ease of Booking" : 2, 
                    "Gate Location" : 3,
                    "Food and Drink" : 4,
                    "Online Boarding" : 5,
                    "Seat Comfort" : 6,
                    "Inflight Entertainment" : 7, 
                    "On-board Service" : 8,
                    "Leg Room" : 9,
                    "Baggage Handling" : 10, 
                    "Checkin" : 11,
                    "Inflight Service" : 12,
                    "Cleanliness" : 13,
                },
                color_dict : {"default" : ["#999999", "#ef8a62"],
                                "cb_accessible" : ["#67a9cf", "#ef8a62"] },
                satisfaction_data : [],
                loyalty_data : [],
                class_data : [],
                plot_title : "Average Respondent Rating By Service Category",
                class_satisfaction : {"Eco":[], "Eco Plus":[], "Business":[]},
                class_satisfaction_filter : {"Eco":[], "Eco Plus":[], "Business":[]},
                class_loyalty : {"Eco":[], "Eco Plus":[], "Business":[]},
                class_loyalty_filter : {"Eco":[], "Eco Plus":[], "Business":[]},

            }
        },
        props:{
            myRadarPlotData: Array,
            height : Number,
            width : Number,
            dd_option : String,
            radio_option: String,
            bar_option: String,
        },
        mounted(){
            this.color = d3.scaleOrdinal().range(this.color_dict[this.radio_option]);
            document.getElementById("checkbox-selection").style.marginBottom = -1 * this.height * 0.2;
            let pixels = String(Math.round(this.width / 40));
            document.getElementById("radar_title").style.fontSize = pixels+"px";
            this.radius = this.height * 0.38;
            this.satisfaction_data = this.groupBy(this.myRadarPlotData, "satisfaction");
            const satisfied = this.getSpiderPlotData(this.satisfaction_data["satisfied"]);
            const dissatisfied = this.getSpiderPlotData(this.satisfaction_data["neutral or dissatisfied"]);
            this.dissatisfied_v_satisfied_data = [dissatisfied, satisfied];
            // Need a deep copy
            this.dissatisfied_v_satisfied_filtered_data = JSON.parse(JSON.stringify(this.dissatisfied_v_satisfied_data));

            this.drawRadarPlot(this.dissatisfied_v_satisfied_data, "#radar");

            // Prioritize Render, then initialize other data
            this.loyalty_data = this.groupBy(this.myRadarPlotData, "Customer Type");
            const disloyal = this.getSpiderPlotData(this.loyalty_data["disloyal Customer"]);
            const loyal = this.getSpiderPlotData(this.loyalty_data["Loyal Customer"]);
            this.disloyal_v_loyal_data = [disloyal, loyal];
            // Need a deep copy
            this.disloyal_v_loyal_filtered_data = JSON.parse(JSON.stringify(this.disloyal_v_loyal_data));

            this.class_data = this.groupBy(this.myRadarPlotData, "Class");

            let class_satisfaction_data_eco = this.groupBy(this.class_data["Eco"], "satisfaction");
            const eco_satisfied = this.getSpiderPlotData(class_satisfaction_data_eco["satisfied"]);
            const eco_dissatisfied = this.getSpiderPlotData(class_satisfaction_data_eco["neutral or dissatisfied"]);
            this.class_satisfaction["Eco"] = [eco_dissatisfied, eco_satisfied];

            let class_satisfaction_data_eco_plus = this.groupBy(this.class_data["Eco Plus"], "satisfaction");
            const eco_plus_satisfied = this.getSpiderPlotData(class_satisfaction_data_eco_plus["satisfied"]);
            const eco_plus_dissatisfied = this.getSpiderPlotData(class_satisfaction_data_eco_plus["neutral or dissatisfied"]);
            this.class_satisfaction["Eco Plus"] = [eco_plus_dissatisfied, eco_plus_satisfied];

            let class_satisfaction_data_business = this.groupBy(this.class_data["Business"], "satisfaction");
            const business_satisfied = this.getSpiderPlotData(class_satisfaction_data_business["satisfied"]);
            const business_dissatisfied = this.getSpiderPlotData(class_satisfaction_data_business["neutral or dissatisfied"]);
            this.class_satisfaction["Business"] = [business_dissatisfied, business_satisfied];

            let class_loyalty_data_eco = this.groupBy(this.class_data["Eco"], "Customer Type");
            const eco_loyal = this.getSpiderPlotData(class_loyalty_data_eco["Loyal Customer"]);
            const eco_disloyal = this.getSpiderPlotData(class_loyalty_data_eco["disloyal Customer"]);
            this.class_loyalty["Eco"] = [eco_disloyal, eco_loyal];

            let class_loyalty_data_eco_plus = this.groupBy(this.class_data["Eco Plus"], "Customer Type");
            const eco_plus_loyal = this.getSpiderPlotData(class_loyalty_data_eco_plus["Loyal Customer"]);
            const eco_plus_disloyal = this.getSpiderPlotData(class_loyalty_data_eco_plus["disloyal Customer"]);
            this.class_loyalty["Eco Plus"] = [eco_plus_disloyal, eco_plus_loyal];

            let class_loyalty_data_business = this.groupBy(this.class_data["Business"], "Customer Type");
            const business_loyal = this.getSpiderPlotData(class_loyalty_data_business["Loyal Customer"]);
            const business_disloyal = this.getSpiderPlotData(class_loyalty_data_business["disloyal Customer"]);
            this.class_loyalty["Business"] = [business_disloyal, business_loyal];

            this.class_satisfaction_filter["Eco"] = JSON.parse(JSON.stringify(this.class_satisfaction["Eco"]));
            this.class_satisfaction_filter["Eco Plus"] = JSON.parse(JSON.stringify(this.class_satisfaction["Eco Plus"]));
            this.class_satisfaction_filter["Business"] = JSON.parse(JSON.stringify(this.class_satisfaction["Business"]));

            this.class_loyalty_filter["Eco"] = JSON.parse(JSON.stringify(this.class_loyalty["Eco"]));
            this.class_loyalty_filter["Eco Plus"] = JSON.parse(JSON.stringify(this.class_loyalty["Eco Plus"]));
            this.class_loyalty_filter["Business"] = JSON.parse(JSON.stringify(this.class_loyalty["Business"]));

            var checkList = document.getElementById('checkbox-selection');
            checkList.getElementsByClassName('anchor')[0].onclick = function(evt) {
            if (checkList.classList.contains('visible'))
                checkList.classList.remove('visible');
            else
                checkList.classList.add('visible');
            }

            //this.populateCheckboxes();
        },
        methods: {
            drawRadarPlot(radar_data, id) {

                const rScale = d3.scaleLinear()
                            .domain([0, this.maxValue])
                            .range([0, this.radius]);

                const radarLine = d3.lineRadial()
                    .curve(d3.curveCardinalClosed)
                    .radius(d => rScale(d))
                    .angle((d, i) => i * this.angleSlice);

                const dotRadius = this.dotRadius;

                let svg = d3.select(id).append("svg")
                    .attr("viewBox", [-30, 15, this.width, this.height])
                    .attr("width", this.width)
                    .attr("height", this.height);
                
                const containerWidth = this.width-(this.margin*2);
                const containerHeight = this.height-(this.margin*2);
                const container = svg.append('g')
                    .attr("width", containerWidth)
                    .attr("height", containerHeight)
                    .attr('transform', `translate(${(this.width/2)+this.margin}, ${(this.height/2)+this.margin})`);
                
                var axisGrid = container.append("g")
                .attr("class", "axisWrapper");

                axisGrid.selectAll(".levels")
                .data(d3.range(1,(this.axisCircles+1)).reverse())
                .enter()
                .append("circle")
                    .attr("class", "gridCircle")
                    .attr("r", (d, i) => this.radius/this.axisCircles*d)
                    .style("fill", "#CDCDCD")
                    .style("stroke", "#CDCDCD")
                    .style("fill-opacity", 0.1);
            
                const axis = axisGrid.selectAll(".axis")
                    .data(this.axesDomain)
                    .enter()
                        .append("g")
                        .attr("class", "axis");
                
                axis.append("line")
                        .attr("x1", 0)
                        .attr("y1", 0)
                        .attr("x2", (d, i) => rScale(this.maxValue*1.1) * Math.cos(this.angleSlice*i - Math.PI/2))
                        .attr("y2", (d, i) => rScale(this.maxValue*1.1) * Math.sin(this.angleSlice*i - Math.PI/2))
                        .attr("class", "line")
                        .style("stroke", "white")
                        .style("stroke-width", "2px");
                
                axis.append("text")
                    .attr("class", "legend")
                    .style("font-size", "11px")
                    .attr("text-anchor", "middle")
                    .attr("font-family", "monospace")
                    .attr("dy", "0.35em")
                    .attr("x", (d, i) => rScale(this.maxValue * this.axisLabelFactor) * Math.cos(this.angleSlice*i - Math.PI/2))
                    .attr("y", (d, i) => rScale(this.maxValue * this.axisLabelFactor) * Math.sin(this.angleSlice*i - Math.PI/2))
                    .text(d => d);
                
                const plots = container.append('g')
                    .selectAll('g')
                    .data(radar_data)
                    .join('g')
                        .attr("data-name", (d, i) => {
                            if(this.radio_option != "cb_accessible" && i == 0) {
                                return "default0";
                            } else if(this.radio_option != "cb_accessible" && i == 1) {
                                return "default1";
                            } else if(this.radio_option == "cb_accessible" && i == 0) {
                                return "cb0";
                            } else {
                                return "cb1";
                            }
                        });

                const transitionPath = d3
                    .transition()
                    .ease(d3.easeSin)
                    .duration(2500);
                
                plots.append('path')
                    .attr("d", d => radarLine(d.map(v => v.value)))
                    .attr("fill", (d, i) => this.color(i))
                    .attr("fill-opacity", 0.3)
                    .attr("stroke", (d, i) => this.color(i))
                    .attr("stroke-width", 2)
                    .on("mouseover", function(d) {
                        d3.select(this)
                        .style("transition", "fill-opacity 0.8s")
                        .attr("fill-opacity", 0.4)
                    })
                    .on("mouseout", function(d) {
                        d3.select(this)
                        .attr("fill-opacity", 0.1)
                    })
                    .append("title")
                        .text((d, i) => {
                            if(this.dd_option != "Dis_Vs_Sat")
                                return this.category(i+2);
                            else
                                return this.category(i)
                        });
                
                plots.selectAll("circle")
                    .data(d => d)
                    .join("circle")
                        .attr("r", dotRadius)
                        .attr("cx", (d,i) => rScale(d.value) * Math.cos(this.angleSlice*i - Math.PI/2))
                        .attr("cy", (d,i) => rScale(d.value) * Math.sin(this.angleSlice*i - Math.PI/2))
                    .on("mouseover", function(d) {
                        d3.select(this)
                        .attr("r", dotRadius+2)
                    })
                    .on("mouseout", function(d) {
                        d3.select(this)
                        .attr("r", dotRadius)
                    })
                    .append("title")
                        .text((d, i) => {
                            return String(Math.round(d.value*100)/100)+"/5";
                        });

                var zoom = d3.zoom()
                    .extent([[0, 0], [this.width, this.height]])
                    .scaleExtent([1, 8])
                    .on("zoom", zoomed).on("zoom", zoomed);

                function zoomed({transform}) {
                    d3.select("#radar svg g").attr("transform", transform);
                    // Hide title when zooming in / restore when zooming out
                    if(transform['k'] != 1) {
                        d3.select("#radar_title")
                            .style("transition", "opacity 0.8s")
                            .style("opacity", 0.0);
                    } else {
                        d3.select("#radar_title")
                            .style("transition", "opacity 0.8s")
                            .style("opacity", 1.0);
                    }
                }

                d3.select('#radar').select('svg').call(zoom);
                // After initial zoom, recenter svg
                d3.select('#radar').select('svg')
                    .call(zoom.transform, d3.zoomIdentity.scale(1)
                        .translate((this.width/2)+this.margin, (this.height/2)+this.margin));

            },
            groupBy(objectArray, property) {
                return objectArray.reduce(function (acc, obj) {
                    let key = obj[property];
                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    acc[key].push(obj);
                    return acc;
                }, {});
            },
            getSpiderPlotData(subset) {
                let ratings = {};
                const columns = this.myRadarPlotData.columns;
                console.log(subset.length, "HELLO");
                for(let i = 0; i < subset.length; i++) {
                    for (let j = 8; j < 22; j++) {
                        if(columns[j] in ratings)
                            ratings[columns[j]] += Number(subset[i][columns[j]]);
                        else
                            ratings[columns[j]] = Number(subset[i][columns[j]]);
                    }
                }
                let final = [];
                for(let axis in ratings) {
                    ratings[axis] /= subset.length;
                    let value = ratings[axis];
                    final.push({axis,value});
                }
                return final;
            },
            FilterByBarOption() {
                if(this.dd_option == "Dis_Vs_Sat") {
                    if(this.bar_option == "default") {
                        return this.dissatisfied_v_satisfied_filtered_data;
                    }
                    return this.class_satisfaction_filter[this.bar_option];
                } else {
                    if(this.bar_option == "default") {
                        return this.disloyal_v_loyal_filtered_data;
                    }
                    return this.class_loyalty_filter[this.bar_option];
                }  
            },
            updatePlot() {
                d3.selectAll("#radar svg").remove();
                this.color = d3.scaleOrdinal().range(this.color_dict[this.radio_option]);
                if(this.dd_option == "Dis_Vs_Sat") {
                    this.drawRadarPlot(this.FilterByBarOption(), "#radar");
                }
                else {
                    this.drawRadarPlot(this.FilterByBarOption(), "#radar");
                }
            },
            checkboxChanged(event) {
                //const id_index = this.id_map[event.target.id];
                const target_key = event.target.id;
                const checked = event.target.checked;
                

                if(!checked) {

                    // Need to search for new index, because modifications may change default
                    let id_index = 0;
                    for(let i = 0; i < this.axesDomain.length; i++) {
                        if(this.dissatisfied_v_satisfied_filtered_data[0][i].axis == target_key) {
                            id_index = i;
                            break;
                        }
                    }

                    delete this.dissatisfied_v_satisfied_filtered_data[0][id_index];
                    delete this.dissatisfied_v_satisfied_filtered_data[1][id_index];
                    this.dissatisfied_v_satisfied_filtered_data[0] = this.dissatisfied_v_satisfied_filtered_data[0].filter(function(){return true;});
                    this.dissatisfied_v_satisfied_filtered_data[1] = this.dissatisfied_v_satisfied_filtered_data[1].filter(function(){return true;});

                    delete this.class_satisfaction_filter["Eco"][0][id_index];
                    delete this.class_satisfaction_filter["Eco"][1][id_index];
                    this.class_satisfaction_filter["Eco"][0] = this.class_satisfaction_filter["Eco"][0].filter(function(){return true;});
                    this.class_satisfaction_filter["Eco"][1] = this.class_satisfaction_filter["Eco"][1].filter(function(){return true;});

                    delete this.class_satisfaction_filter["Eco Plus"][0][id_index];
                    delete this.class_satisfaction_filter["Eco Plus"][1][id_index];
                    this.class_satisfaction_filter["Eco Plus"][0] = this.class_satisfaction_filter["Eco Plus"][0].filter(function(){return true;});
                    this.class_satisfaction_filter["Eco Plus"][1] = this.class_satisfaction_filter["Eco Plus"][1].filter(function(){return true;});

                    delete this.class_satisfaction_filter["Business"][0][id_index];
                    delete this.class_satisfaction_filter["Business"][1][id_index];
                    this.class_satisfaction_filter["Business"][0] = this.class_satisfaction_filter["Business"][0].filter(function(){return true;});
                    this.class_satisfaction_filter["Business"][1] = this.class_satisfaction_filter["Business"][1].filter(function(){return true;});

                    delete this.disloyal_v_loyal_filtered_data[0][id_index];
                    delete this.disloyal_v_loyal_filtered_data[1][id_index];
                    this.disloyal_v_loyal_filtered_data[0] = this.disloyal_v_loyal_filtered_data[0].filter(function(){return true;});
                    this.disloyal_v_loyal_filtered_data[1] = this.disloyal_v_loyal_filtered_data[1].filter(function(){return true;});

                    delete this.class_loyalty_filter["Eco"][0][id_index];
                    delete this.class_loyalty_filter["Eco"][1][id_index];
                    this.class_loyalty_filter["Eco"][0] = this.class_loyalty_filter["Eco"][0].filter(function(){return true;});
                    this.class_loyalty_filter["Eco"][1] = this.class_loyalty_filter["Eco"][1].filter(function(){return true;});

                    delete this.class_loyalty_filter["Eco Plus"][0][id_index];
                    delete this.class_loyalty_filter["Eco Plus"][1][id_index];
                    this.class_loyalty_filter["Eco Plus"][0] = this.class_loyalty_filter["Eco Plus"][0].filter(function(){return true;});
                    this.class_loyalty_filter["Eco Plus"][1] = this.class_loyalty_filter["Eco Plus"][1].filter(function(){return true;});

                    delete this.class_loyalty_filter["Business"][0][id_index];
                    delete this.class_loyalty_filter["Business"][1][id_index];
                    this.class_loyalty_filter["Business"][0] = this.class_loyalty_filter["Business"][0].filter(function(){return true;});
                    this.class_loyalty_filter["Business"][1] = this.class_loyalty_filter["Business"][1].filter(function(){return true;});

                    // Adjust the radar slice angles
                    const active_params = this.dissatisfied_v_satisfied_filtered_data[0].length;
                    this.angleSlice = Math.PI * 2 / active_params;
                    
                    // Remove from domain
                    delete this.axesDomain[id_index];
                    this.axesDomain = this.axesDomain.filter(function(){return true;});

                } else {
                    
                    // Will be in default location in full data
                    const id_index = this.id_map[event.target.id];

                    // Insert [value1] @ index [id_index] deleting [0] values
                    let value = this.dissatisfied_v_satisfied_data[0][id_index];
                    this.dissatisfied_v_satisfied_filtered_data[0].splice(id_index, 0, value); 

                    value = this.dissatisfied_v_satisfied_data[1][id_index];
                    this.dissatisfied_v_satisfied_filtered_data[1].splice(id_index, 0, value);

                    value = this.disloyal_v_loyal_data[0][id_index];
                    this.disloyal_v_loyal_filtered_data[0].splice(id_index, 0, value);

                    value = this.disloyal_v_loyal_data[1][id_index];
                    this.disloyal_v_loyal_filtered_data[1].splice(id_index, 0, value);

                    // Sub Datasets
                    // Satisfaction
                    value = this.class_satisfaction["Eco"][0][id_index];
                    this.class_satisfaction_filter["Eco"][0].splice(id_index, 0, value);

                    value = this.class_satisfaction["Eco Plus"][0][id_index];
                    this.class_satisfaction_filter["Eco Plus"][0].splice(id_index, 0, value);

                    value = this.class_satisfaction["Business"][0][id_index];
                    this.class_satisfaction_filter["Business"][0].splice(id_index, 0, value);

                    value = this.class_satisfaction["Eco"][1][id_index];
                    this.class_satisfaction_filter["Eco"][1].splice(id_index, 0, value);

                    value = this.class_satisfaction["Eco Plus"][1][id_index];
                    this.class_satisfaction_filter["Eco Plus"][1].splice(id_index, 0, value);

                    value = this.class_satisfaction["Business"][1][id_index];
                    this.class_satisfaction_filter["Business"][1].splice(id_index, 0, value);

                    // Loyalty 
                    value = this.class_loyalty["Eco"][0][id_index];
                    this.class_loyalty_filter["Eco"][0].splice(id_index, 0, value);

                    value = this.class_loyalty["Eco Plus"][0][id_index];
                    this.class_loyalty_filter["Eco Plus"][0].splice(id_index, 0, value);

                    value = this.class_loyalty["Business"][0][id_index];
                    this.class_loyalty_filter["Business"][0].splice(id_index, 0, value);

                    value = this.class_loyalty["Eco"][1][id_index];
                    this.class_loyalty_filter["Eco"][1].splice(id_index, 0, value);

                    value = this.class_loyalty["Eco Plus"][1][id_index];
                    this.class_loyalty_filter["Eco Plus"][1].splice(id_index, 0, value);

                    value = this.class_loyalty["Business"][1][id_index];
                    this.class_loyalty_filter["Business"][1].splice(id_index, 0, value);

                    // Adjust the radar slice angles
                    const active_params = this.dissatisfied_v_satisfied_filtered_data[0].length;
                    this.angleSlice = Math.PI * 2 / active_params;

                    // Add to domain
                    this.axesDomain.splice(id_index, 0, event.target.id);
                }
                this.updatePlot();
                
            },
        },
        
    }

</script>


<style>

#checkbox-selection{
    padding-top: 10px;
    padding-left: 10px;
    position: absolute;
    z-index: 10;
}

#radar svg {
    position: relative;
    z-index: 9;
    color: blue;
    overflow: hidden;
    margin-top: -5%;
}

.dropdown-check-list {
    display: inline-block;
}

.dropdown-check-list .anchor {
    position: relative;
    cursor: pointer;
    display: inline-block;
    padding: 5px 50px 5px 10px;
    border: 1px solid #ccc;
}

.dropdown-check-list .anchor:after {
    position: absolute;
    content: "";
    border-left: 2px solid black;
    border-top: 2px solid black;
    padding: 5px;
    right: 10px;
    top: 20%;
    -moz-transform: rotate(-135deg);
    -ms-transform: rotate(-135deg);
    -o-transform: rotate(-135deg);
    -webkit-transform: rotate(-135deg);
    transform: rotate(-135deg);
}

.dropdown-check-list .anchor:active:after {
    right: 8px;
    top: 21%;
}

.dropdown-check-list ul.items {
    padding: 2px;
    display: none;
    margin: 0;
    border: 1px solid #ccc;
    border-top: none;
}

.dropdown-check-list ul.items li {
    list-style: none;
}

.dropdown-check-list.visible .anchor {
    color: #0094ff;
}

.dropdown-check-list.visible .items {
    display: block;
}

g[data-name="default0"] circle {
    fill:   #999999;
    stroke: #999999;
}
g[data-name="default1"] circle {
    fill: #ef8a62;
    stroke: #ef8a62;
}

g[data-name="cb0"] circle {
    fill:   #67a9cf;
    stroke: #67a9cf;
}
g[data-name="cb1"] circle {
    fill: #ef8a62;
    stroke: #ef8a62;
}
.radar_container {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

#radar_title {
    padding-top: 10px;
    padding-left: 100px;
    font-weight: bold;
    text-decoration: underline;
    text-align: center;
}

</style>