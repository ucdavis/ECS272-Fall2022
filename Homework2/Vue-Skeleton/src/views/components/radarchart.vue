<template>
    <a-typography-title :level="4" :underline="true">Attributes for Top 3 Songs Contributing to Popularity</a-typography-title>
<div style="width:50%;display: flex;width: 100%;height: 100%">
        <div class="column1" id ="left" style="width:50%;">
            <!-- <select id="radarSelect"></select> -->
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
                            "['Nirvana']", "['Eminem']", "['Taylor Swift']","[Lil Uzi Vert']"],
                newValueRadar: '1930',
                songNameMap: new Map(),
                updatedData: [],


            }
        },
        props:{
            myRadarData: Array,
            year: String,
            selectedSunData: Array,
            brushedData: Array,

        },
        watch: {
            brushedData(newValue, oldValue) {
                if (Object.keys(newValue).length === 0) {
                    this.updatedData = this.myRadarData
                    this.drawRadarChart(this.updatedData, "#radar", '1930')
                    d3.selectAll('.dataBlob').remove()
                    d3.selectAll('.axisLabel').remove()
                    d3.select('#radarLegend').selectAll('text').remove();
                    d3.select('#radarLegend').selectAll('circle').remove();
                }
            },
            // year(newValue, oldValue) {
            //     // console.log("newValue: ", newValue)
            //     // console.log("oldValue: ", oldValue)

            //     // this.updateRadarChart(newValue)
            //     this.newValueRadar = newValue
            //     console.log('UPDATE YEAR')
            //     this.drawRadarChart(this.updatedData, "#radar", newValue)
            // },
            selectedSunData(newValue, oldValue) {
                const newSunData = newValue[0];
                const newYear = newValue[1]
                // var finalYear = oldValue[1];
                if (newYear !== 'root') {
                    // this.updatedData = newValue
                    this.drawRadarChart(newSunData, "#radar", newYear)
                    // finalYear = newYear
                }
                console.log("newValue1: ", newValue)
                console.log("oldValue1: ", oldValue)
                // console.log(" this.newValueRadar: ",  this.newValueRadar)

                // this.updatedData = newValue
                // if (newValue.length === 100) {
                //     this.drawRadarChart(this.myRadarData, "#radar", this.newValueRadar)
                // }
                // else {
                //     this.drawRadarChart(this.updatedData, "#radar", this.newValueRadar)
                // }



                // console.log("newValue1: ", newValue)
                // console.log("oldValue1: ", oldValue)
                // console.log(" this.newValueRadar: ",  this.newValueRadar)
                // this.updatedData = newValue
                // this.drawRadarChart(this.updatedData, "#radar", this.newValueRadar)
            }
        },
        mounted(){
            // const years = this.makeYears();
            // d3.select("#radarSelect")
            // .selectAll('myOptions')
            // .data(years)
            // .enter()
            // .append('option')
            // .text(function (d) { return d; })
            // .attr("value", function (d) { return d; })
            this.updatedData = this.myRadarData
            this.drawRadarChart(this.updatedData, "#radar", 1930)
            
            d3.selectAll('.dataBlob').remove()
            d3.selectAll('.axisLabel').remove()
            d3.select('#radarLegend').selectAll('text').remove();
            d3.select('#radarLegend').selectAll('circle').remove();
        },
        methods: {
            makeYears() {
                var years = []
                for (let i = 1930; i < 2021; i += 10) {
                    years.push(i)
                }
                return years
            },

            preprocess(artists) {
                var artistMap = new Map()
                // console.log('artists', artists)
                artists.forEach(d => {
                    if (!artistMap.has(d.year)) {
                        var inner_map = new Map()
                        const temp = []
                        const obj1 = {axis: "acousticness", value: d.acousticness}
                        const obj2 = {axis: "danceability", value: d.danceability}
                        const obj3 = {axis: "energy", value: d.energy}
                        const obj4 = {axis: "instrumentalness", value: d.instrumentalness}
                        const obj5 = {axis: "liveness", value: d.liveness}
                        const obj6 = {year: d.year}
                        temp.push(obj1, obj2, obj3, obj4, obj5)
                        // temp.push(obj1, obj2, obj3, obj4, obj5, obj6)
                        inner_map.set(d.canonicalName, temp)
                        // console.log('inner_map', inner_map)
                        artistMap.set(d.year, inner_map)
                        }
                    else {
                        var inner_map = artistMap.get(d.year)
                        if (!inner_map.has(d.canonicalName)) {
                            const temp = []
                            const obj1 = {axis: "acousticness", value: d.acousticness}
                            const obj2 = {axis: "danceability", value: d.danceability}
                            const obj3 = {axis: "energy", value: d.energy}
                            const obj4 = {axis: "instrumentalness", value: d.instrumentalness}
                            const obj5 = {axis: "liveness", value: d.liveness}
                            const obj6 = {year: d.year}
                            temp.push(obj1, obj2, obj3, obj4, obj5)
                            // temp.push(obj1, obj2, obj3, obj4, obj5, obj6)
                            inner_map.set(d.canonicalName, temp)
                            artistMap.set(d.year, inner_map)
                        }
                    }
                })
                return artistMap
                },
                
                // BELOW WE NEED TO CHANGE SO IT DOESNT SLICE 3 AT A TIME,
                // rather, it uses years in updated data to make a new mapping
            mapping(years, data) {
                console.log('map predata', data)
                const map = new Map()
                let i = 0
                years.forEach(a => {
                    map.set(a, data.slice(i, i += 3))  
                })
                return map
            },

            postProcessMapping(processedData) {
                const map = new Map()

                this.songNameMap.clear()

                for (var [key, inner_map] of processedData) {
                    for (var [song, attributes] of inner_map) {
                        if (!this.songNameMap.get(parseInt(key))) {
                            this.songNameMap.set(parseInt(key), [song])
                        }
                        else {
                            var tempSongName = this.songNameMap.get(parseInt(key))
                            tempSongName.push(song)
                            this.songNameMap.set(parseInt(key), tempSongName)
                        }
                        
                    }
                }

                for (var [key, inner_map] of processedData) {
                    for (var [song, attributes] of inner_map) {
                        if (!map.get(parseInt(key))) {
                            // var tempButes = []
                            // tempButes.push(attributes)
                            map.set(parseInt(key), [attributes])
                        }
                        else {
                            var temp = map.get(parseInt(key))
                            temp.push(attributes)
                            map.set(parseInt(key), temp)
                        }
                        
                    }
                }
                console.log('this.songNameMap', this.songNameMap)
                return map

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
                //also needs 2 change
            mozart(raw_file) {
                var songMap = new Map()
                raw_file.forEach(d => {
                    if (!songMap.get(d.year)) {
                        songMap.set(d.year, [d])
                    }
                    else {
                        var temp = songMap.get(d.year)
                        temp.push(d)
                        songMap.set(d.year, temp)
                        }
                })
                // console.log('songMap', songMap)
                var result = []
                songMap.forEach(function(key, val) {
                    songMap.get(val).sort((a,b) => b.popularity - a.popularity);
                    var temp = songMap.get(val).slice(0,3)
                    result = result.concat(temp)
                })
                
                console.log('songMap', songMap)

                
                // let i = 0
                // var temp = []
                // var result = []
                // raw_file.forEach(d => {
                //     temp.push(d)
                //     i += 1
                //     if (i % 10 == 0) {
                //         temp.sort((a,b) => b.popularity - a.popularity);
                //         temp = temp.slice(0, 3)
                //         result = result.concat(temp)
                //         temp = []
                //     }
                // })
                return result
            },

            
            songMapping(artists) {
                const map = new Map()
                let i = 1930
                let j = 0
                var temp = []
                artists.forEach(d => {
                    // temp.push(d.name)
                    temp.push(d.canonicalName)
                    j += 1
                    if (j % 3 == 0) {
                        map.set(i, temp)
                        temp = []
                        j = 0
                        i += 10
                    }
                })
                return map
                },

            

            drawRadarChart(preData, id, initialSelection) {
                console.log('preData', preData)
                const years = this.makeYears();

                const artists = this.mozart(preData);
                console.log('artists', artists)

                const processedData = this.preprocess(artists);
                console.log('processedData1', processedData)

                const map = this.postProcessMapping(processedData);
                console.log('postProcessMapping', map)
                
                const data = this.postProcess(processedData);
                console.log('postProcess', data)

                const ogMap = this.mapping(years, data);
                console.log('ogMap', ogMap)

                const songs = this.songMapping(artists);
                console.log('songs', songs)

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

                // const initialSelection = d3.select("#radarSelect").property("value");
                
                d3.select(id).selectAll('svg').remove()
                d3.select('#radarLegend').selectAll('text').remove();
                d3.select('#radarLegend').selectAll('circle').remove();

                // const color = d3.scaleOrdinal()
                //     .range(["#1f77b4", "#ff7f0e", "#2ca02c"])
                const colorLegend = {
                                "1930": "rgb(110, 64, 170)",
                                "1940": "rgb(191, 60, 175)",
                                "1950": "rgb(254, 75, 131)",
                                "1960": "rgb(255, 120, 71)",
                                "1970": "rgb(226, 183, 47)",
                                "1980": "rgb(175, 240, 91)",
                                "1990": "rgb(82, 246, 103)",
                                "2000": "rgb(29, 223, 163)",
                                "2010": "rgb(35, 171, 216)",
                                "2020": "rgb(76, 110, 219)",

                            }
                const color = d3.scaleOrdinal().range([
                                "rgb(110, 64, 170)",
                                // "rgb(191, 60, 175)",
                                // "rgb(254, 75, 131)",
                                // "rgb(255, 120, 71)",
                                "rgb(226, 183, 47)",
                                // "rgb(175, 240, 91)",
                                // "rgb(82, 246, 103)",
                                // "rgb(29, 223, 163)",
                                // "rgb(35, 171, 216)",
                                "rgb(76, 110, 219)"]);

                //legend
                var Svg2 = d3.select("#radarLegend")
                .attr("preserveAspectRatio", "xMidYMid meet")
                .attr("viewBox", [460, -75, 455, 300])
                .classed("svg-content-responsive", true)
                // Add one dot in the legend for each name.
                console.log('TESTINGGG', this.songNameMap.get(parseInt(initialSelection)))

                var colorMap = new Map()
                var colorList = this.songNameMap.get(parseInt(initialSelection))
                this.$emit('updateStrokeColor', colorList)

                if (colorList.length === 1) {
                    colorMap.set(colorList[0], "rgb(110, 64, 170)")
                }
                else if (colorList.length === 2) {
                    colorMap.set(colorList[0], "rgb(110, 64, 170)")
                    colorMap.set(colorList[1], "rgb(226, 183, 47)")
                }
                else {
                    colorMap.set(colorList[0], "rgb(110, 64, 170)")
                    colorMap.set(colorList[1], "rgb(226, 183, 47)")
                    colorMap.set(colorList[2], "rgb(76, 110, 219)")
                }

                Svg2.selectAll("mydots")
                .data(this.songNameMap.get(parseInt(initialSelection)))
                .enter()
                .append("circle")
                    .attr("cx", 500)
                    .attr("cy", function(d,i){ return 50 + i*25})
                    .attr("r", 7)
                    .style("fill", function(d){ 
                        console.log('color', d)
                        return colorMap.get(d)})
                        // return color(d)})

                // Add one label in the legend for each dot.
                var labels = Svg2.selectAll("mylabels")
                .data(this.songNameMap.get(parseInt(initialSelection)))
                .enter()
                .append("text")
                    .attr("x", 520)
                    .attr("y", function(d,i){ return 50 + i*25})
                    // .style("fill", function(d){ return color(d)})
                    .style("fill", function(d){ return colorMap.get(d)})
                    .text(function(d){ return d})
                    .attr("text-anchor", "left")
                    .style("alignment-baseline", "middle")


                const angleSlice = Math.PI * 2 / axesLength;

                const initialMap = map.get(parseInt(initialSelection));
                console.log('initialSelection', initialSelection)
                console.log('initialMap', initialMap)

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
                    .attr("stroke", "steelblue")
                    .attr("class", "dataBlob");

                plots.append('path')
                    .attr("d", d => radarLine(d.map(v => v.value)))
                    // .style("fill", function(d){ return color(d)})
                    // .attr("fill", (d, i) => color(i))
                    .attr("fill", function(d, i) {
                        console.log('color2', i)
                        // return colorMap.get(i)})
                        return color(i)})
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
            //         d3.select("#radarSelect").on("change", function(d) {
            //             const selectedOption = d3.select(this).property("value");
            //             d3.select(id).selectAll('svg').remove()
            //             d3.select('#radarLegend').selectAll('text').remove();
            //             d3.select('#radarLegend').selectAll('circle').remove();


            //         const color = d3.scaleOrdinal()
            //         .range(["#1f77b4", "#ff7f0e", "#2ca02c"])
            //         // const color = d3.scaleOrdinal().range(d3.schemeCategory10);

            //             var Svg2 = d3.select("#radarLegend")
            //             .attr("preserveAspectRatio", "xMidYMid meet")
            //             .attr("viewBox", [460, -75, 455, 300])
            //             .classed("svg-content-responsive", true)
            //             // Add one dot in the legend for each name.
            //             Svg2.selectAll("mydots")
            //             .data(songs.get(parseInt(selectedOption)))
            //             .enter()
            //             .append("circle")
            //                 .attr("cx", 500)
            //                 .attr("cy", function(d,i){ return 50 + i*25})
            //                 .attr("r", 7)
            //                 .style("fill", function(d){ return color(d)})

            //             // Add one label in the legend for each dot.
            //             var labels = Svg2.selectAll("mylabels")
            //             .data(songs.get(parseInt(selectedOption)))
            //             .enter()
            //             .append("text")
            //                 .attr("x", 520)
            //                 .attr("y", function(d,i){ return 50 + i*25})
            //                 .style("fill", function(d){ return color(d)})
            //                 .text(function(d){ return d})
            //                 .attr("text-anchor", "left")
            //                 .style("alignment-baseline", "middle")

            //             const angleSlice = Math.PI * 2 / axesLength;

            //             const initialMap = map.get(parseInt(selectedOption));
            //             var maxValue = -1;
            //             initialMap.forEach(d => {
            //                 var tempMax = Math.max(...d.map(o => o.value));
            //                 maxValue = Math.max(maxValue, tempMax);
            //             })
            //             const rScale = d3.scaleLinear()
            //                 .domain([0, maxValue])
            //                 .range([0, radius]);
                        
            //             const radarLine = d3.lineRadial()
            //                 .curve(d3['curveCardinalClosed'])
            //                 .radius(d => rScale(d))
            //                 .angle((d, i) => i * angleSlice);
                        

            //             const width = 500;
            //             const svg = d3.select(id)
            //                 .append("svg")
            //                 .attr("preserveAspectRatio", "xMidYMid meet")
            //                 .attr("viewBox", [80, -25, width - 100, height + 100])
            //                 .classed("svg-content-responsive", true)


            //             const containerWidth = width-(margin*2);
            //             const containerHeight = height-(margin*2);
            //             const container = svg.append('g')
            //                 .attr("width", containerWidth)
            //                 .attr("height", containerHeight)
            //                 .attr('transform', `translate(${(width/2)+margin}, ${(height/2)+margin})`);
                        
            //             var axisGrid = container.append("g")
            //                 .attr("class", "axisWrapper");
                        

            //             axisGrid.selectAll(".levels")
            //                 .data(d3.range(1,(axisCircles+1)).reverse())
            //                 .enter()
            //                 .append("circle")
            //                 .attr("class", "gridCircle")
            //                 .attr("r", (d, i) => radius/axisCircles*d)
            //                 .style("fill", "#CDCDCD")
            //                 .style("stroke", "#CDCDCD")
            //                 .style("fill-opacity", 0.1);

            //             //labels for inner circles
            //             axisGrid.selectAll(".axisLabel")
            //                 .data(d3.range(1,(axisCircles+1)).reverse())
            //                 .enter().append("text")
            //                 .attr("class", "axisLabel")
            //                 .attr("x", 4)
            //                 .attr("y", function(d){return -d*radius/axisCircles;})
            //                 .attr("dy", "0.4em")
            //                 .style("font-size", "13px")
            //                 .style("font-weight", "bold")
            //                 .attr("fill", "#737373")
            //                 .text(function(d,i) { return (maxValue * d/axisCircles).toFixed(3); })


            //             const axis = axisGrid.selectAll(".axis")
            //                 .data(axesDomain)
            //                 .enter()
            //                     .append("g")
            //                     .attr("class", "axis");

            //             axis.append("line")
            //                 .attr("x1", 0)
            //                 .attr("y1", 0)
            //                 .attr("x2", (d, i) => rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2))
            //                 .attr("y2", (d, i) => rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2))
            //                 .attr("class", "line")
            //                 .style("stroke", "white")
            //                 .style("stroke-width", "2px");

            //             axis.append("text")
            //                 .attr("class", "legend")
            //                 .style("font-size", "11px")
            //                 .attr("text-anchor", "middle")
            //             .attr("font-family", "monospace")
            //             .attr("dy", "0.35em")
            //                 .attr("x", (d, i) => rScale(maxValue * axisLabelFactor) * Math.cos(angleSlice*i - Math.PI/2))
            //                 .attr("y", (d, i) => rScale(maxValue * axisLabelFactor) * Math.sin(angleSlice*i - Math.PI/2))
            //                 .text(d => d);

            //             const plots = container.append('g')
            //                 .selectAll('g')
            //                 .data(map.get(parseInt(selectedOption)))
            //                 .join('g')
            //                 .attr("fill", "none")
            //                 .attr("stroke", "steelblue");

            //             plots.append('path')
            //                 .attr("d", d => radarLine(d.map(v => v.value)))
            //                 .attr("fill", (d, i) => color(i))
            //                 .attr("fill-opacity", 0.1)
            //                 .attr("stroke", (d, i) => color(i))
            //                 .attr("stroke-width", 2);
                        
            //             plots.selectAll("circle")
            //                 .data(d => d)
            //             .join("circle")
            //                 .attr("r", dotRadius)
            //                 .attr("cx", (d,i) => rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2))
            //                 .attr("cy", (d,i) => rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2))
            //                 .style("fill-opacity", 0.8);

            // })
        },
    }
}
</script>


<style>

</style>