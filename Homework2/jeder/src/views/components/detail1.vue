<template>
    <div id="det1" style="width: 100%; height: 100%;"></div>
</template>

<script>
import * as d3 from "d3";

const margin = { top: 20, right: 10, bottom: 20, left: 10 };
const width = 500;
const height = 300;

const truncate = (input, length) => input.length > length ? `${input.substring(0, length - 3)}...` : input;

export default {
    name: 'Detail1Chart',
    data() {
        return null;
    },
    props: {
        terrorismData: Array,
    },
    watch: {
        terrorismData: function (newVal, oldVal) {
            this.updateChart();
        }
    },
    mounted() {
        this.createChart()
    },
    methods: {
        createChart() {

            var svg = d3.select("#det1")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

            svg.append("g")
                .attr("id", "content")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

        },

        updateChart() {
            // attributes:
            // - success
            // - suicide
            // - attacktype1 / attacktype1_txt
            // - targtype1 / targtype1_txt
            // - gname
            // - weaptype1 / weaptype1_txt
            // - nkill = number of fatalities
            // - nwound = number of confirmed non-fatal injuries
            // - propvalue = exact U.S. dollar amount (at the time of the incident) of total damages is listed.
            // - ishostkid = is it a kidnaping / nhostkid = number of hostages
            // - crit1, crit2, crit3 = 
            //      Criterion 1: POLITICAL, ECONOMIC, RELIGIOUS, OR SOCIAL GOAL (CRIT1)
            //      Criterion 2: INTENTION TO COERCE, INTIMIDATE OR PUBLICIZE TO LARGER AUDIENCE(S) 
            //      Criterion 3: OUTSIDE INTERNATIONAL HUMANITARIAN LAW (CRIT3)

            const svg = d3.select("#det1").select("svg");
            svg.select("g").remove();
            const content = svg.append("g")
                .attr("id", "content")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            const dimensions = ["success", "suicide", "attacktype1_txt", "targtype1_txt", "gname"];
            const dimension_lbls = {
                success: "Success",
                suicide: "Suicide",
                attacktype1_txt: "Attack Type",
                targtype1_txt: "Targ Type",
                gname: "Group Name"
            };

            let y = {}

            let terrorismData_prepared = this.terrorismData.map(d => {
                return {
                    ...d,
                    success: d.success == "1" ? "Yes" : "No",
                    suicide: d.suicide == "1" ? "Yes" : "No",
                };
            }
            );


            // console.log(terrorismData_prepared)

            y["success"] = d3.scalePoint()
                .domain(["No", "Yes"])
                .range([height - margin.top - margin.bottom, 0]);

            y["suicide"] = d3.scalePoint()
                .domain(["No", "Yes"])
                .range([height - margin.top - margin.bottom, 0]);

            const attacktype1_txts = [...new Set(terrorismData_prepared.map(d => d["attacktype1_txt"]))];
            y["attacktype1_txt"] = d3.scalePoint()
                .domain(attacktype1_txts)
                .range([height - margin.top - margin.bottom, 0]);

            const targtype1_txts = [...new Set(terrorismData_prepared.map(d => d["targtype1_txt"]))];
            y["targtype1_txt"] = d3.scalePoint()
                .domain(targtype1_txts)
                .range([height - margin.top - margin.bottom, 0]);

            let gnames = [...new Set(terrorismData_prepared.map(d => d["gname"]))];
            if (gnames.length > 5) {


                gnames = gnames.map(d => {
                    return {
                        name: d,
                        cnt: terrorismData_prepared.filter(e => e["gname"] == d).length
                    };
                })
                    .sort((a, b) => {
                        return b.cnt - a.cnt;
                    });
                let otherGnames = gnames.slice(5);
                gnames = gnames.slice(0, 5).concat(otherGnames.reduce((a, b) => {
                    return {
                        name: "other",
                        cnt: a.cnt + b.cnt,
                    }
                }))
                    .sort((a, b) => {
                        return b.cnt - a.cnt;
                    })
                    .map(g => g.name);

                otherGnames = otherGnames.map(g => g.name);

                terrorismData_prepared = terrorismData_prepared.map(d => {
                    if (otherGnames.includes(d.gname)) {
                        return { ...d, gname: "other" };
                    }
                    else
                        return { ...d };
                });
            }
            // console.log(terrorismData_prepared.filter(d => d.gname === "other"));

            y["gname"] = d3.scalePoint()
                .domain(gnames)
                .range([height - margin.top - margin.bottom, 0]);


            // Build the X scale -> it find the best position for each Y axis
            let x = d3.scalePoint()
                .range([0, width - margin.left - margin.right])
                .padding(1)
                .domain(dimensions);

            // Draw the axis:
            content.selectAll(".myAxis")
                // For each dimension of the dataset I add a 'g' element:
                .data(dimensions)
                .join("g")
                .attr("class", "myAxis")
                // I translate this element to its right position on the x axis
                .attr("transform", function (d) { return "translate(" + x(d) + ")"; })
                // And I build the axis with the call function                
                .each(function (d) {
                    d3.select(this).call(
                        d3.axisLeft()
                            .scale(y[d])
                            .tickFormat((d) => truncate(d, 12))
                    );
                })
                // Add axis title
                .append("text")
                .style("text-anchor", "middle")
                .attr("y", -9)
                .text(function (d) { return dimension_lbls[d]; })
                .style("fill", "black")

            content.selectAll("myPath")
                .data(terrorismData_prepared)
                .join("path")
                .attr("d", d => d3.line()(dimensions.map((p) => [x(p), y[p](d[p])])))
                .style("fill", "none")
                .style("stroke", "#69b3a2")
                .style("opacity", 0.5)

        },
    }
}

</script>


<style>

</style>