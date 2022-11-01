<template>
    <a-typography-title :level="4" :underline="true">Top 10 Most Popular Songs Per Decade</a-typography-title>
    <div style="width:50%;display: flex;width: 100%;height: 100%">
        <div class="column1" id ="left" style="width:60%;">
            <!-- <select id="selectButton"></select> -->
            <div id="sunburst"></div>
        </div>
        <div class="column2" id ="right" style="width:40%;">
            <svg id="sun_legend"></svg>
        </div>
    </div>
</template>

<script>
    import * as d3 from "d3";

    export default {
        name: 'SunBurst',
        data() {
            return {
                attributes: ["acousticness", "danceability", "energy", "instrumentalness", "liveness", "loudness", "popularity", "speechiness", "tempo", "valence"],
                artists: ["[Billie Holiday']", "['Lead Belly']", "['Miles Davis']","['The Beach Boys']", "['Queen']", "['Metallica']",
                            "['Nirvana']", "['Eminem']", "['Taylor Swift']","[Lil Uzi Vert']"],
                nameMap: new Map(),

            }
        },
        props:{
            mySunData: Array,
            brushedData: Array,
            selectedSongs: Array,
        },
        watch: {
            selectedSongs(newValue, oldValue) {
                var colorMap = new Map()

                newValue.forEach(function(part, index, theArray) {
                    if (theArray[index].length >= 17) {
                        theArray[index] = theArray[index].slice(0, 13) + "..."
                    }
                    // var temp = d.data.name.replace(/ /g,"_");
                    // temp = temp.replace(/'/g,"_")
                    theArray[index] = theArray[index].replace(/ /g,"_");
                    theArray[index]=  theArray[index].replace(/'/g,"_")
                    theArray[index] = theArray[index].split('...').join('_');
                })
                console.log('SelectedSongs', newValue)
                if (newValue.length === 1) {
                    colorMap.set(newValue[0], "rgb(110, 64, 170)")
                    // console.log("#id_ring_PRIOR_", "#id_ring_" + newValue[0])
                    // console.log("#id_ring_", d3.select("#id_ring_" + newValue[0]))
                    // console.log("#id_ring_PRIOR_", `[id=${newValue[0]}]`)
                    // console.log("#id_ring_", d3.select(`[id=${newValue[0]}]`))

                    console.log("SELECTED", d3.select("#id_ring_" + newValue[0]))
                    d3.select("#id_ring_" + newValue[0]).attr("stroke", "rgb(110, 64, 170)")
                    d3.select("#id_ring_" + newValue[0]).attr("stroke-width", "3")
                }
                else if (newValue.length === 2) {
                    colorMap.set(newValue[0], "rgb(110, 64, 170)")
                    colorMap.set(newValue[1], "rgb(226, 183, 47)")

                    d3.select("#id_ring_" + newValue[0]).attr("stroke", "rgb(110, 64, 170)")
                    d3.select("#id_ring_" + newValue[0]).attr("stroke-width", "3")

                    d3.select("#id_ring_" + newValue[1]).attr("stroke", "rgb(226, 183, 47)")
                    d3.select("#id_ring_" + newValue[1]).attr("stroke-width", "3")
                }
                else {
                    colorMap.set(newValue[0], "rgb(110, 64, 170)")
                    colorMap.set(newValue[1], "rgb(226, 183, 47)")
                    colorMap.set(newValue[2], "rgb(76, 110, 219)")

                    d3.select("#id_ring_" + newValue[0]).attr("stroke", "rgb(110, 64, 170)")
                    d3.select("#id_ring_" + newValue[0]).attr("stroke-width", "3")

                    d3.select("#id_ring_" + newValue[1]).attr("stroke", "rgb(226, 183, 47)")
                    d3.select("#id_ring_" + newValue[1]).attr("stroke-width", "3")

                    d3.select("#id_ring_" + newValue[2]).attr("stroke", "rgb(76, 110, 219)")
                    d3.select("#id_ring_" + newValue[2]).attr("stroke-width", "3")
                }
                // newValue.forEach(d => {
                //     console.log('SelectedSongs', d)
                // })
            },

            brushedData(newValue, oldValue) {
                // console.log("newValue: ", newValue)
                // console.log("oldValue: ", oldValue)

                if (Object.keys(newValue).length !== 0) {
                     console.log(newValue)
                    this.drawSunChart(newValue, '#sunburst')
                }
                else {
                    this.drawSunChart(this.mySunData, '#sunburst')
                }
            }
        },
        mounted(){
            this.drawSunChart(this.mySunData, "#sunburst")
        },
        methods: {
            preProcess(shortenedData) {
                var data = {}
                data['name'] = "root"
                data['children'] = []

                var songMap = new Map()
                shortenedData.forEach(d => {
                    if (!songMap.get(d.year)) {
                        songMap.set(d.year, [d])
                    }
                    else {
                        var temp = songMap.get(d.year)
                        temp.push(d)
                        songMap.set(d.year, temp)
                        }
                })
                for (let [key, value] of songMap) {
                    var year = data['children']
                    var temp = {name: key, children: []}
                    var tempKids = temp['children']
                    
                    value.forEach(d => {
                        let song = {}
                        song['name'] = d['name']
                        song['value'] = d['popularity']
                        // console.log(song)
                        tempKids.push(song)
                    })
                    tempKids.sort((a, b) => b.value - a.value)
                    year.push(temp)
                    }
                return data
            },

            shortenLength(data) {
                data.forEach(d => {
                    // d.canonicalName = d.name
                    // console.log('d.canonicalName', d.canonicalName)
                    if (d.name.length >= 17) { // 34
                        const shortenedName = d.name.slice(0, 13) + "..." // 17
                        this.nameMap.set(shortenedName, d.name)
                        // d.shortenedName = shortenedName
                        d.name = shortenedName
                    }
                });
                // console.log('SHORTLEN LENGTH FUNCTION', this.nameMap)
                return data
            },

            drawSunChart(ogData, id) {
                d3.select(id).selectAll('svg').remove()

                const shortenedData = this.shortenLength(ogData);
                const data = this.preProcess(shortenedData)
                const partition = data => {
                    const root = d3.hierarchy(data)
                        .sum(d => d.value)
                        // .sort((a, b) => b.value - a.value);
                    return d3.partition()
                        .size([2 * Math.PI, root.height + 1])
                        (root);
                }
                
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

                // const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));
                const format = d3.format(",d")
                // const width = 932
                const width = 500
                const radius = width / 6
                const yearSet = new Set([1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020])

                const arc = d3.arc()
                    .startAngle(d => d.x0)
                    .endAngle(d => d.x1)
                    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
                    .padRadius(radius * 1.5)
                    .innerRadius(d => d.y0 * radius)
                    .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))

                    const root = partition(data);

                    root.each(d => d.current = d);

                    const svg = d3.select(id)
                        .append("svg")
                        .attr("preserveAspectRatio", "xMidYMid meet")
                        .attr("viewBox", [0, 0, width, width])
                        .classed("svg-content-responsive", true)
                        .style("font", "10px sans-serif")
                        // .style("background-color", "yellow")
                        // .style("color", "black");

                    const g = svg.append("g")
                        .attr("transform", `translate(${width / 2},${width / 2})`);

                    const path = g.append("g")
                    .selectAll("path")
                    .data(root.descendants().slice(1))
                    .join("path")
                        // .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
                        .attr("fill", d => { while (d.depth > 1) d = d.parent; return colorLegend[d.data.name]; })
                        .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
                        .attr("pointer-events", d => arcVisible(d.current) ? "auto" : "none")
                        .attr("class", function(d) {
                            if (yearSet.has(parseInt(d.parent.data.name))) {
                            return "ring_" + d.parent.data.name;
                            }
                            return "depth_" + d.data.name;
                        })
                        .attr("id", function(d) {
                            if (yearSet.has(parseInt(d.parent.data.name))) {
                                // var temp = d.data.name.split("")
                                // temp = temp.join("_")
                                var temp = d.data.name.replace(/ /g,"_");
                                temp = temp.replace(/'/g,"_")
                                temp = temp.split('...').join('_');
                                console.log(temp)
                                return "id_ring_" + temp;
                            }
                            return "id_depth_" + d.data.name;
                        })
                        .on("mouseover", songMouseOver)
                        .on("mouseleave", songMouseOut)
                        .attr("d", d => arc(d.current));
                    
                        const nameMapData = this.nameMap;

                        var Svg2 = d3.select("#sun_legend")
                            .attr("preserveAspectRatio", "xMidYMid meet")
                            .attr("viewBox", [460, 0, 455, 400])
                            .classed("svg-content-responsive", true)

                        function songMouseOut(d) {
                            d3.select('#sun_legend').selectAll('text').remove();
                        }


                        function songMouseOver(d) {
                            // console.log(d3.select(this)._groups[0][0])
                            // console.log(d3.select(this).attr("class"))
                            const className = d3.select(this).attr("class");
                            const classYear = className.split('_')[1];
                            // console.log(classYear)

                            const title = d3.select(this).select('title').text()
                            const splitTitle = title.split("/")

                            const shortName = splitTitle[2]
                            const popularity = splitTitle[3]

                            var canonicalName = [shortName + ", Popularity: " + popularity]

                            if (nameMapData.get(shortName)) {
                                canonicalName = [nameMapData.get(shortName) + ", Popularity: " + popularity]

                            }

                            var labels = Svg2.selectAll("mylabels")
                                    .data(canonicalName)
                                    .enter()
                                    .append("text")
                                        .attr("x", 460)
                                        .attr("y", 300)
                                        .style("fill", function(d){ return colorLegend[classYear]})
                                        // .style("fill", function(d){ return color(d)})
                                        .text(function(d){ return d})
                                        .attr("text-anchor", "left")
                                        .style("alignment-baseline", "middle")
                                        .style("font-size", "18px");
                        }

                    path.filter(d => d.children)
                        .style("cursor", "pointer")
                        .on("mouseover", mouseover)
                        .on("mouseleave", mouseleave)
                        .on("click", clicked);

                    path.append("title")
                        // .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);
                        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}/${format(d.value)}`);

                    // remove elements from outter ring
                    // d3.selectAll("path[class^='ring_']").style("opacity", 0)
                    console.log('SLICE', d3.selectAll("path[class^='ring_']"))
                    d3.selectAll("path[class^='ring_']").style("opacity", 0).style("visibility", "hidden")

                    const label = g.append("g")
                        .attr("pointer-events", "none")
                        .attr("text-anchor", "middle")
                        .style("user-select", "none")
                    .selectAll("text")
                    .data(root.descendants().slice(1))
                    .join("text")
                        .attr("dy", "0.35em")
                        .attr("class", function(d) {
                            if (yearSet.has(parseInt(d.parent.data.name))) {
                                return "label_year_" + d.parent.data.name;
                            }
                            return "depth_label_" + d.depth;
                        })
                        .attr("fill-opacity", d => +labelVisible(d.current))
                        .attr("transform", d => labelTransform(d.current))
                        .text(d => d.data.name);

                    

                    // remove text annotations from outter ring
                    d3.selectAll("text[class^='label_year_']").style("display", "none")

                    const parent = g.append("circle")
                        .datum(root)
                        .attr("r", radius)
                        .attr("fill", "none")
                        .attr("pointer-events", "all")
                        .on("click", clicked);

                    

                    function mouseover(d) {
                        // console.log(d3.select(this))
                        d3.select(this)
                        .style("transition-property", "opacity")
                        .style("transition-duration", "0.75s")
                        .attr("opacity", 0.5)
                    }

                    //mouse leave
                    // Restore everything to full opacity when moving off the visualization.
                    function mouseleave(d) {
                    // Transition segment to full opacity and then reactivate it.
                        d3.select(this)
                        .style("transition-property", "opacity")
                        .style("transition-duration", "0.75s")
                        .attr("opacity", 1)
                    }
                    
                    var temp = 0 //used in click function custom logic
                    var ref = this;

                function clicked(event, p) {
                    parent.datum(p.parent || root);

                    root.each(d => d.target = {
                        x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                        x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                        y0: Math.max(0, d.y0 - p.depth),
                        y1: Math.max(0, d.y1 - p.depth)
                    });

                    // const t = g.transition().duration(750);
                    const t = g.transition().duration(750);

                    // Transition the data on all arcs, even the ones that aren’t visible,
                    // so that if this transition is interrupted, entering arcs will start
                    // the next transition from the desired position.
                    path.transition(t)
                        .tween("data", d => {
                            const i = d3.interpolate(d.current, d.target);
                            return t => d.current = i(t);
                        })
                        .filter(function(d) {
                        return +this.getAttribute("fill-opacity") || arcVisible(d.target);
                        })
                        .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
                        .attr("pointer-events", d => arcVisible(d.target) ? "auto" : "none") 

                        .attrTween("d", d => () => arc(d.current));

                    label.filter(function(d) {
                        return +this.getAttribute("fill-opacity") || labelVisible(d.target);
                        }).transition(t)
                        .attr("fill-opacity", d => +labelVisible(d.target))
                        .attrTween("transform", d => () => labelTransform(d.current));
                    
                        if (yearSet.has(parseInt(p.data.name))) {
                            // d3.selectAll(".ring_" + p.data.name)
                            //     .style("transition-property", "opacity")
                            //     .style("transition-duration", "2s")
                            //     .style("visibility", "visible")
                            //     .style("opacity", 0)
                            //     .style("opacity", 1);

                            d3.selectAll(".ring_" + p.data.name)
                            .style("transition", "visibility 2s opacity 2s")
                                // .style("transition-duration", "2s")
                                .style("opacity", 1)
                                .style("visibility", "visible");

                            d3.selectAll(".label_year_" + p.data.name)
                                .style("display", "inline")

                            // d3.selectAll(".label_year_" + p.data.name)
                            //    .style("transition-property", "opacity")
                            //    .style("transition-duration", "2s")
                            //    .style("opacity", 1);
                            
                            temp = p.data.name
                        }

                        else {
                            // d3.selectAll(".ring_" + temp)
                            //     .style("transition-property", "opacity")
                            //     .style("transition-duration", "2s")
                            //     .style("opacity", 0)
                            //     .style("visibility", "hidden");

                            d3.selectAll(".ring_" + temp)
                                .style("transition", "visibility 2s opacity 2s")
                                // .style("transition-duration", "2s")
                                .style("opacity", 0)
                                .style("visibility", "hidden");
                               

                            d3.selectAll(".label_year_" + temp)
                                // .style("transition-property", "opacity")
                                // .style("transition-duration", "2s")
                                // .style("opacity", 0)
                                .style("display", "none");
                            
                            }
                            ref.$emit('update_radar_chart', [ogData, p.data.name ])
                            // if (p.data.name !== 'root') {
                            //     ref.$emit('update_year', p.data.name)
                            //     console.log('ogData', ogData)
                            // }
                            // ref.$emit('update_radar_chart', ogData)
                    
                    }

                    function arcVisible(d) {
                    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
                    }

                    function labelVisible(d) {
                    return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
                    }

                    function labelTransform(d) {
                    const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
                    const y = (d.y0 + d.y1) / 2 * radius;
                    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
                    }



            },
        }
    }

</script>


<style>

</style>