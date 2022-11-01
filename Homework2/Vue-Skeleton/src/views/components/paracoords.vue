<template>
    <a-typography-title :level="4" :underline="true">Focus View: Intensity of Musical Attributes from 1930-2020</a-typography-title>
     <select id="attributeDropdown"></select>
    <div id="paracoords" style="position:relative;top:6%"></div>
    <svg id="para_legend" style="max-height: 10%;width: 100%;margin-top: 5%"></svg>
    
</template>

<script>
    import * as d3 from "d3";
    import legend from 'd3-svg-legend'

    export default {
        name: 'ParaCoords',
        data() {
            return {
                dimensions: ["acousticness", "danceability", "energy", "instrumentalness", "liveness", "loudness", "popularity", "speechiness", "tempo", "valence"],
                artists: ["[Billie Holiday']", "['Lead Belly']", "['Miles Davis']","['The Beach Boys']", "['Queen']", "['Metallica']",
                            "['Nirvana']", "['Eminem']", "['Taylor Swift']","[Lil Uzi Vert']"],
                // brushedData: []
            }
        },
        props:{
            myParaCoordsData: Array,
        },
        mounted(){
            d3.select("#attributeDropdown")
            .selectAll('myOptions')
            .data(this.dimensions)
            .enter()
            .append('option')
            .text(function (d) { return d; })
            .attr("value", function (d) { return d; })
            
            this.drawParaChart(this.myParaCoordsData, "#paracoords")
            
        },
        methods: {
            createMap() {
                const map = new Map()
                let i = 0
                this.artists.forEach(a => {
                    map.set(a, this.myParaCoordsData.slice(i, i += 10))  
                })
                return map
            },

            getMaxes(data) {
                var map = new Map();
                var max_acousticness = 0;
                var max_danceability = 0;
                var max_energy = 0;
                var max_instrumentalness = 0;
                var max_liveness = 0;
                var max_loudness = -60;
                var max_popularity = 0;
                var max_speechiness = 0;
                var max_tempo = 0;
                var max_valence = 0;

                data.forEach(d => {
                    max_acousticness = Math.max(max_acousticness, d.acousticness)
                    max_danceability = Math.max(max_danceability, d.danceability)
                    max_energy = Math.max(max_energy, d.energy)
                    max_instrumentalness = Math.max(max_instrumentalness, d.instrumentalness)
                    max_liveness = Math.max(max_liveness, d.liveness)
                    max_loudness = Math.max(max_loudness, d.loudness)
                    max_popularity = Math.max(max_popularity, d.popularity)
                    max_speechiness = Math.max(max_speechiness, d.speechiness)
                    max_tempo = Math.max(max_tempo, d.tempo)
                    max_valence = Math.max(max_valence, d.valence)
                })
                map.set("acousticness", max_acousticness.toFixed(2))
                map.set("danceability", max_danceability.toFixed(2))
                map.set("energy", max_energy.toFixed(2))
                map.set("instrumentalness", max_instrumentalness.toFixed(2))
                map.set("liveness", max_liveness.toFixed(2))
                map.set("loudness", max_loudness.toFixed(2))
                map.set("popularity", max_popularity.toFixed(2))
                map.set("speechiness", max_speechiness.toFixed(2))
                map.set("tempo", max_tempo.toFixed(2))
                map.set("valence", max_valence.toFixed(2))

                return map
            },


            drawParaChart(data, id) {
                var margin = {top: 30, right: 10, bottom: 10, left: 0},
                    width = 1000 - margin.left - margin.right,
                    height = 800 - margin.top - margin.bottom;
                const maxes = this.getMaxes(data);
                
                

                var svg = d3.select(id)
                    .append("svg")
                    .attr("preserveAspectRatio", "xMidYMid meet")
                    .attr("viewBox", [0, 0, width + 50, height + 60])
                    .classed("svg-content-responsive", true)
                    .append("g")
                        .attr("transform",
                                "translate(" + margin.left + "," + margin.top + ")");
             
                // set the style of hidden data items
                svg
                    .append("style")
                    .text("path.hidden { stroke: #000; stroke-opacity: 0.01;}");

                var y = {}
                for (let i in this.dimensions) {
                    let name = this.dimensions[i]
                    y[name] = d3.scaleLinear()
                    .domain( d3.extent(data, function(d) { return +d[name]; }) )
                    .range([height, 0])
                }

                const x = d3.scalePoint()
                    .range([0, width])
                    .padding(1)
                    .domain(this.dimensions);


                //path function
                const path = (d) => {
                    return d3.line()(this.dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
                }


                const initialSelection = d3.select("#attributeDropdown").property("value");

                    //create legend
                    var linear = d3.scaleLinear().domain([0,maxes.get(initialSelection)])
                    .range(["#D7E5F0","#00008B"])

                    var legendScale = d3.select("#para_legend")

                    legendScale.append("g")
                        .attr("class", "legendLinear")
                        .attr("transform", "translate(20,20)");
                    var legendLinear  = legend.legendColor()
                        .shapeWidth(50)
                        .cells(10)
                        .orient('horizontal')
                        .scale(linear);
                    legendScale.select(".legendLinear")
                        .call(legendLinear);
                    
                        const polylines = svg
                            .append("g")
                            .attr("fill", "none")
                            .attr("stroke-width", 1.5)
                            .attr("stroke-opacity", 0.6) 
                            .selectAll("path")
                            .data(data)
                            .join("path")

                        polylines
                            .attr("d",  path)
                            .style("fill", "none")
                            .style("stroke", function(d){
                                return linear(d[initialSelection]);
                            })




                             // Draw the axis:
                            let axes = svg
                            .append("g") //comment this out and add raise to svg
                            .selectAll("g")
                            .data(this.dimensions)
                            .join("g")
                            // I translate this element to its right position on the x axis
                            .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
                            // And I build the axis with the call function
                            .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); }) 
                            // Add axis title
                            .call(g => g.append("text")
                            .style("text-anchor", "middle")
                            .style("font", "16px times")
                            .attr("y", -9)
                            .text(function(d) { return d; })
                            .style("fill", "black"));

                // // Draw the axis:
                // let axes = svg.selectAll("myAxis")
                //     // For each dimension of the dataset I add a 'g' element:
                //     .append("g")
                //     .data(this.dimensions).enter()
                //     .append("g")
                //     // I translate this element to its right position on the x axis
                //     .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
                //     // And I build the axis with the call function
                //     .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
                //     // Add axis title
                //     .append("text")
                //     .style("text-anchor", "middle")
                //     .style("font", "16px times")
                //     .attr("y", -9)
                //     .text(function(d) { return d; })
                //     .style("fill", "black")

               
                    let activeBrushes = new Map();
                    // const test = d3.brushY();
                    // console.log('brushY: ' , test)

                                        // TODO implement brushing & linking
                    
                    

                    function updateBrushing() {
                        // d3.event.selection == activeBrushes without key
                        // console.log('d3: ', brushes.selectAll('rect.overlay'))
                        const dimensions = ["acousticness", "danceability", "energy", "instrumentalness", "liveness", "loudness", "popularity", "speechiness", "tempo", "valence"];
                        if (activeBrushes === null){  
                        polylines.classed("hidden",false);   
                        }
                        // console.log('this.dimensions: ', artists)
                        polylines.classed("hidden", d => {
                            // console.log(d);
                            var key = 0;
                            var value_y = 0;
                            var active_domain_y = 0;
                            /*Checks for each attribute whether the polyline should be drawn by checking whether 
                            it is in the active area or not */
                            
                            for(var i=0; i < dimensions.length; i++){
                            
                                key = dimensions[i];
                                // value_y = y.get(key)(d[key]);
                                value_y = y[key](d[key]);
                                active_domain_y /*[y0, y1]*/ = activeBrushes.get(key);
                                
                                if(active_domain_y != null){
                                    if(value_y < active_domain_y[0] || value_y > active_domain_y[1]) {
                                        return true;
                                    }
                                }
                            }
                            return false;
                        });
                    }    
                    

                    function brushed(event, attribute) {
                        activeBrushes.set(attribute, event.selection);
                        // setBrushedData();
                        updateBrushing();
                    }

                    function brushEnd(event, attribute) {
                        console.log('activeBrushes: ', activeBrushes)
                        if (event.selection !== null){ 
                            updateBrushing();
                            setBrushedData();
                            return;
                        }
                        activeBrushes.delete(attribute);
                        setBrushedData();
                        updateBrushing();
                    }

                    
                    const brushes = axes.append("g").call(
                        d3
                        .brushY()
                        // .extent([[-10, margin.top], [10, height]])
                        .extent([[-10, -1], [10, height]])
                        .on("brush", brushed)
                        .on("end", brushEnd)
                    );

                    // var ref = this;
                    const setBrushedData = () => {
                        var filteredData = [];
                        // console.log('hello')
                        activeBrushes.forEach((value, key) => {
                            if (value != null) {
                                let y0 = value[0];
                                let y1 = value[1];

                                if (filteredData.length === 0) {
                                    filteredData = data.filter(d => {
                                        return y[key](d[key]) <= y1 && y[key](d[key]) >= y0;
                                    })
                                
                                }
                                else {
                                    filteredData = filteredData.filter(d => {
                                        return y[key](d[key]) <= y1 && y[key](d[key]) >= y0;
                                    })
                                }
                                console.log('filteredData', filteredData);
                                // return data;
                            }
                        });
                        this.$emit('updateBrushedData', filteredData);
                    }

                
                d3.select("#attributeDropdown").on("change", function(d) {
                    // select the new option that has been chosen
                    
                    const selectedOption = d3.select(this).property("value")
                    d3.select('#para_legend').selectAll('g').remove()

                    var linear = d3.scaleLinear().domain([0,maxes.get(selectedOption)])
                        .range(["#D7E5F0","#00008B"])

                        var legendScale = d3.select("#para_legend");
                        
                        legendScale.append("g")
                            .attr("class", "legendLinear")
                            .attr("transform", "translate(20,20)");

                        var numberOfCells = 10
                        if (selectedOption === 'instrumentalness') {
                            console.log('instrumentalness')
                            numberOfCells = 9
                        }
                        if (selectedOption === 'speechiness') {
                            console.log('speechiness')
                            numberOfCells = 5
                        }

                        
                            var legendLinear  = legend.legendColor()
                            .shapeWidth(50)
                            // .cells(10)
                            // instrumentalness = 9, speech = 5
                            .cells(numberOfCells)
                            .orient('horizontal')
                            .scale(linear);
                        
                        legendScale.select(".legendLinear")
                            .call(legendLinear);

                        polylines.style("stroke", function(d){
                            return linear(d[selectedOption]);
                        })    
                
                })
            },

        }
    }
</script>


<style>

</style>