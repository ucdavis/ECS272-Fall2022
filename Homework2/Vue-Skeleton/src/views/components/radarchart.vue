<template>
    <a-typography-title :level="4" :underline="true">Attributes for Top 3 Songs Contributing to Popularity</a-typography-title>
<div style="width:50%;display: flex;width: 100%;height: 100%">
        <div class="column1" id ="left" style="width:50%;">
            <select id="radarSelect"></select>
            <div id="radar"></div>
        </div>
        <div class="column2" id ="right" style="width:50%;">
            <svg id="radarLegend"></svg>
        </div>
    </div>
</template>

<script>
    import * as d3 from "d3";

    export default {
        name: 'RadarChart',
        data() {
            return {
                attributes: ["acousticness", "danceability", "energy", "instrumentalness", "liveness", "loudness", "popularity", "speechiness", "tempo", "valence"],
                artists: ["[Billie Holiday']", "['Lead Belly']", "['Miles Davis']","['The Beach Boys']", "['Queen']", "['Metallica']",
                            "['Nirvana']", "['Eminem']", "['Taylor Swift']","[Lil Uzi Vert']"]

            }
        },
        props:{
            myRadarData: Array,
        },
        mounted(){
            const years = this.makeYears();
            d3.select("#radarSelect")
            .selectAll('myOptions')
            .data(years)
            .enter()
            .append('option')
            .text(function (d) { return d; })
            .attr("value", function (d) { return d; })

            this.drawPieChart(this.myRadarData, "#radar")
        },
        methods: {
            makeYears() {
                var years = []
                for (let i = 1930; i < 2021; i += 10) {
                    years.push(i)
                }
                return years
            },

            comparator( a, b ) {
                if ( a.popularity < b.popularity ){
                    return -1;
                }
                if ( a.popularity > b.popularity ){
                    return 1;
                }
                return 0;
            },

            preprocess(artists) {
                var artistMap = new Map()
                artists.forEach(d => {
                    if (!artistMap.has(d.artists)) {
                        var inner_map = new Map()
                        const temp = []
                        const obj1 = {axis: "acousticness", value: d.acousticness}
                        const obj2 = {axis: "danceability", value: d.danceability}
                        const obj3 = {axis: "energy", value: d.energy}
                        const obj4 = {axis: "instrumentalness", value: d.instrumentalness}
                        const obj5 = {axis: "liveness", value: d.liveness}
                        temp.push(obj1, obj2, obj3, obj4, obj5)
                        inner_map.set(d.name, temp)
                        artistMap.set(d.artists, inner_map)
                        }
                    else {
                        var inner_map = artistMap.get(d.artists)
                        if (!inner_map.has(d.name)) {
                            const temp = []
                            const obj1 = {axis: "acousticness", value: d.acousticness}
                            const obj2 = {axis: "danceability", value: d.danceability}
                            const obj3 = {axis: "energy", value: d.energy}
                            const obj4 = {axis: "instrumentalness", value: d.instrumentalness}
                            const obj5 = {axis: "liveness", value: d.liveness}
                            temp.push(obj1, obj2, obj3, obj4, obj5)
                            inner_map.set(d.name, temp)
                            artistMap.set(d.artists, inner_map)
                        }
                    }
                })
                return artistMap
                },

            postProcess(processedData) {
                var result = []
                
                for (var [key, inner_map] of processedData) {
                    for (var [song, attributes] of inner_map) {
                    result.push(attributes)
                    }
                }

                return result
                },

            mozart(raw_file) {
                let i = 0
                var temp = []
                var result = []
                raw_file.forEach(d => {
                    temp.push(d)
                    i += 1
                    if (i % 10 == 0) {
                        temp.sort(this.comparator)
                        // temp = temp.slice(5, 10)
                        temp = temp.slice(7, 10)
                        result = result.concat(temp)
                        temp = []
                    }
                })
                return result
            },

            mapping(years, data) {
                const map = new Map()
                let i = 0
                years.forEach(a => {
                    // map.set(a, data.slice(i, i += 5))
                    map.set(a, data.slice(i, i += 3))  
                })
                return map
            },
            songMapping(artists) {
                const map = new Map()
                let i = 1930
                let j = 0
                var temp = []
                artists.forEach(d => {
                    temp.push(d.name)
                    j += 1
                    // if (j % 5 == 0) {
                    if (j % 3 == 0) {
                        map.set(i, temp)
                        temp = []
                        j = 0
                        i += 10
                    }
                })
                return map
                },

            drawPieChart(preData, id) {
                const years = this.makeYears();
                const artists = this.mozart(preData);
                const processedData = this.preprocess(artists);
                const data = this.postProcess(processedData);
                const map = this.mapping(years, data);
                const songs = this.songMapping(artists);

                const axesDomain = data[0].map(d => d.axis);
                const axesLength =  data[0].length;
                const formatPercent = d3.format(',.0%');
                const wrapWidth = 60;
                const axisLabelFactor = 1.12;
                const axisCircles = 3;
                const dotRadius = 4;
                const margin = 30;
                const height = 300;
                const width = 500;
                const radius = (height-(margin*2)) / 2;

                const initialSelection = d3.select("#radarSelect").property("value");

                const color = d3.scaleOrdinal()
                    .range(["#1f77b4", "#ff7f0e", "#2ca02c"])

                //legend
                var Svg2 = d3.select("#radarLegend")
                .attr("preserveAspectRatio", "xMidYMid meet")
                .attr("viewBox", [460, -75, 455, 300])
                .classed("svg-content-responsive", true)
                // Add one dot in the legend for each name.
                Svg2.selectAll("mydots")
                .data(songs.get(parseInt(initialSelection)))
                .enter()
                .append("circle")
                    .attr("cx", 500)
                    .attr("cy", function(d,i){ return 50 + i*25})
                    .attr("r", 7)
                    .style("fill", function(d){ return color(d)})

                // Add one label in the legend for each dot.
                var labels = Svg2.selectAll("mylabels")
                .data(songs.get(parseInt(initialSelection)))
                .enter()
                .append("text")
                    .attr("x", 520)
                    .attr("y", function(d,i){ return 50 + i*25})
                    .style("fill", function(d){ return color(d)})
                    .text(function(d){ return d})
                    .attr("text-anchor", "left")
                    .style("alignment-baseline", "middle")


                const angleSlice = Math.PI * 2 / axesLength;

                const initialMap = map.get(parseInt(initialSelection));
                var maxValue = -1;
                initialMap.forEach(d => {
                    var tempMax = Math.max(...d.map(o => o.value));
                    maxValue = Math.max(maxValue, tempMax);
                })
                const rScale = d3.scaleLinear()
                    .domain([0, maxValue])
                    .range([0, radius]);
                
                const radarLine = d3.lineRadial()
                    .curve(d3['curveCardinalClosed'])
                    .radius(d => rScale(d))
                    .angle((d, i) => i * angleSlice);
                
                const svg = d3.select(id)
                .append("svg")
                .attr("preserveAspectRatio", "xMidYMid meet")
                .attr("viewBox", [80, -25, width - 100, height + 100])
                .classed("svg-content-responsive", true);


                const containerWidth = width-(margin*2);
                const containerHeight = height-(margin*2);
                const container = svg.append('g')
                    .attr("width", containerWidth)
                    .attr("height", containerHeight)
                    .attr('transform', `translate(${(width/2)+margin}, ${(height/2)+margin})`);
                
                var axisGrid = container.append("g")
                    .attr("class", "axisWrapper");
                

                axisGrid.selectAll(".levels")
                    .data(d3.range(1,(axisCircles+1)).reverse())
                    .enter()
                    .append("circle")
                    .attr("class", "gridCircle")
                    .attr("r", (d, i) => radius/axisCircles*d)
                    .style("fill", "#CDCDCD")
                    .style("stroke", "#CDCDCD")
                    .style("fill-opacity", 0.1)

                //labels for inner circles
                axisGrid.selectAll(".axisLabel")
                    .data(d3.range(1,(axisCircles+1)).reverse())
                    .enter().append("text")
                    .attr("class", "axisLabel")
                    .attr("x", 6)
                    .attr("y", function(d){return -d*radius/axisCircles;})
                    .attr("dy", "0.4em")
                    .style("font-size", "13px")
                    .style("font-weight", "bold")
                    .attr("fill", "#737373")
                    .text(function(d,i) { return (maxValue * d/axisCircles).toFixed(3); });

                    
                const axis = axisGrid.selectAll(".axis")
                    .data(axesDomain)
                    .enter()
                        .append("g")
                        .attr("class", "axis");

                axis.append("line")
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", (d, i) => rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2))
                    .attr("y2", (d, i) => rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2))
                    .attr("class", "line")
                    .style("stroke", "white")
                    .style("stroke-width", "2px");

                axis.append("text")
                    .attr("class", "legend")
                    .style("font-size", "11px")
                    .attr("text-anchor", "middle")
                .attr("font-family", "monospace")
                .attr("dy", "0.35em")
                    .attr("x", (d, i) => rScale(maxValue * axisLabelFactor) * Math.cos(angleSlice*i - Math.PI/2))
                    .attr("y", (d, i) => rScale(maxValue * axisLabelFactor) * Math.sin(angleSlice*i - Math.PI/2))
                    .text(d => d);


                const plots = container.append('g')
                    .selectAll('g')
                    .data(map.get(parseInt(initialSelection)))
                    .join('g')
                    .attr("fill", "none")
                    .attr("stroke", "steelblue");

                plots.append('path')
                    .attr("d", d => radarLine(d.map(v => v.value)))
                    .attr("fill", (d, i) => color(i))
                    .attr("fill-opacity", 0.1)
                    .attr("stroke", (d, i) => color(i))
                    .attr("stroke-width", 2);
                
                plots.selectAll("circle")
                    .data(d => d)
                .join("circle")
                    .attr("r", dotRadius)
                    .attr("cx", (d,i) => rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2))
                    .attr("cy", (d,i) => rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2))
                    .style("fill-opacity", 0.8);


                    //dropdown
                    d3.select("#radarSelect").on("change", function(d) {
                        const selectedOption = d3.select(this).property("value");
                        d3.select(id).selectAll('svg').remove()
                        d3.select('#radarLegend').selectAll('text').remove();
                        d3.select('#radarLegend').selectAll('circle').remove();


                    const color = d3.scaleOrdinal()
                    .range(["#1f77b4", "#ff7f0e", "#2ca02c"])

                        var Svg2 = d3.select("#radarLegend")
                        .attr("preserveAspectRatio", "xMidYMid meet")
                        .attr("viewBox", [460, -75, 455, 300])
                        .classed("svg-content-responsive", true)
                        // Add one dot in the legend for each name.
                        Svg2.selectAll("mydots")
                        .data(songs.get(parseInt(selectedOption)))
                        .enter()
                        .append("circle")
                            .attr("cx", 500)
                            .attr("cy", function(d,i){ return 50 + i*25})
                            .attr("r", 7)
                            .style("fill", function(d){ return color(d)})

                        // Add one label in the legend for each dot.
                        var labels = Svg2.selectAll("mylabels")
                        .data(songs.get(parseInt(selectedOption)))
                        .enter()
                        .append("text")
                            .attr("x", 520)
                            .attr("y", function(d,i){ return 50 + i*25})
                            .style("fill", function(d){ return color(d)})
                            .text(function(d){ return d})
                            .attr("text-anchor", "left")
                            .style("alignment-baseline", "middle")

                        const angleSlice = Math.PI * 2 / axesLength;

                        const initialMap = map.get(parseInt(selectedOption));
                        var maxValue = -1;
                        initialMap.forEach(d => {
                            var tempMax = Math.max(...d.map(o => o.value));
                            maxValue = Math.max(maxValue, tempMax);
                        })
                        const rScale = d3.scaleLinear()
                            .domain([0, maxValue])
                            .range([0, radius]);
                        
                        const radarLine = d3.lineRadial()
                            .curve(d3['curveCardinalClosed'])
                            .radius(d => rScale(d))
                            .angle((d, i) => i * angleSlice);
                        

                        const width = 500;
                        const svg = d3.select(id)
                            .append("svg")
                            .attr("preserveAspectRatio", "xMidYMid meet")
                            .attr("viewBox", [80, -25, width - 100, height + 100])
                            .classed("svg-content-responsive", true)


                        const containerWidth = width-(margin*2);
                        const containerHeight = height-(margin*2);
                        const container = svg.append('g')
                            .attr("width", containerWidth)
                            .attr("height", containerHeight)
                            .attr('transform', `translate(${(width/2)+margin}, ${(height/2)+margin})`);
                        
                        var axisGrid = container.append("g")
                            .attr("class", "axisWrapper");
                        

                        axisGrid.selectAll(".levels")
                            .data(d3.range(1,(axisCircles+1)).reverse())
                            .enter()
                            .append("circle")
                            .attr("class", "gridCircle")
                            .attr("r", (d, i) => radius/axisCircles*d)
                            .style("fill", "#CDCDCD")
                            .style("stroke", "#CDCDCD")
                            .style("fill-opacity", 0.1);

                        //labels for inner circles
                        axisGrid.selectAll(".axisLabel")
                            .data(d3.range(1,(axisCircles+1)).reverse())
                            .enter().append("text")
                            .attr("class", "axisLabel")
                            .attr("x", 4)
                            .attr("y", function(d){return -d*radius/axisCircles;})
                            .attr("dy", "0.4em")
                            .style("font-size", "13px")
                            .style("font-weight", "bold")
                            .attr("fill", "#737373")
                            .text(function(d,i) { return (maxValue * d/axisCircles).toFixed(3); })


                        const axis = axisGrid.selectAll(".axis")
                            .data(axesDomain)
                            .enter()
                                .append("g")
                                .attr("class", "axis");

                        axis.append("line")
                            .attr("x1", 0)
                            .attr("y1", 0)
                            .attr("x2", (d, i) => rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2))
                            .attr("y2", (d, i) => rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2))
                            .attr("class", "line")
                            .style("stroke", "white")
                            .style("stroke-width", "2px");

                        axis.append("text")
                            .attr("class", "legend")
                            .style("font-size", "11px")
                            .attr("text-anchor", "middle")
                        .attr("font-family", "monospace")
                        .attr("dy", "0.35em")
                            .attr("x", (d, i) => rScale(maxValue * axisLabelFactor) * Math.cos(angleSlice*i - Math.PI/2))
                            .attr("y", (d, i) => rScale(maxValue * axisLabelFactor) * Math.sin(angleSlice*i - Math.PI/2))
                            .text(d => d);

                        const plots = container.append('g')
                            .selectAll('g')
                            .data(map.get(parseInt(selectedOption)))
                            .join('g')
                            .attr("fill", "none")
                            .attr("stroke", "steelblue");

                        plots.append('path')
                            .attr("d", d => radarLine(d.map(v => v.value)))
                            .attr("fill", (d, i) => color(i))
                            .attr("fill-opacity", 0.1)
                            .attr("stroke", (d, i) => color(i))
                            .attr("stroke-width", 2);
                        
                        plots.selectAll("circle")
                            .data(d => d)
                        .join("circle")
                            .attr("r", dotRadius)
                            .attr("cx", (d,i) => rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2))
                            .attr("cy", (d,i) => rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2))
                            .style("fill-opacity", 0.8);

            })
        },
    }
}
</script>


<style>

</style>