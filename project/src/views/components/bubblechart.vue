<template>
    <div class="bubbleChartContainer" :id="myChartID">
        <svg></svg>
    </div>
</template>

<script>
import * as d3 from "d3";
//import { piefunction } from "./myTestFunction"

export default {
    name: 'BubbleChart',
    componets: {},
    data() {
        return {
            bubbleData: [
                { key: 1910, value: 14 },
                { key: 1920, value: 20 },
                { key: 1930, value: 42 },
                { key: 1940, value: 94 },
                { key: 1950, value: 344 },
                { key: 1960, value: 54 },
                { key: 1970, value: 124 }
            ],
            arc: null,
            arcs: [],
            color: null,
            pie: null,
            arcLabel: null,
            width: 300,
            height: 300,
            diameter: 300
        }
    },
    props: {
        myBubbleData: Array,
        refSize: Number,
        myChartID: String,
    },
    created() {
        /* we DO NOT have access to the HTML in Template */
        // MAYBE DATA PROCESSING OR FETCHING DATA HERE
        //piefunction();
    },
    mounted() {
        /* We have access to our HTML defined in Template*/
        // D3 CODE CALLED HERE\
        this.init(this.myBubbleData);
        this.drawBubble(this.myBubbleData, this.refSize);
    },
    watch: {
        myBubbleData(newval, oldval) {
            console.log("New piedata", newval)

            //console.log("Data Passed down as a Prop  ", newval)
            //this.init(newval);
            this.drawBubble(newval, this.refSize);
        }
    },
    methods: {
        classes(root) {
            var classes = [];                                                                                        //存储结果的数组
            /*自定义递归函数
             *
             * 第二个参数指传入的json对象
             * */
            function recurse(name, node) {
                if (node.children)                                                                                   //如果有孩子结点 （这里的children不是自带的，是json里面有的）
                {
                    node.children.forEach(function (child) {                                                          //将孩子结点中的每条数据
                        recurse(node.name, child);
                    })
                }
                else { classes.push({ className: node.name, value: node.size }) };                                     //如果自身是孩子结点的，将内容压入数组
            }
            recurse(null, root);
            return { children: classes };                                                                             //返回所有的子节点  （包含在children中）                                                                          
        },
        init(data) {
            const cols = 5;
            const rows = 2;
            var margin = { top: 10, right: 30, bottom: 30, left: 60 },
                width = 150 * cols,
                height = 150 * rows;

            let id = '#' + this.myChartID;

            d3.select(id).select("svg").remove();
            let svg = d3.select(id).append("svg")
                .attr("viewBox", [0, 0, width, height])
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            svg.append("g").attr("id", this.myChartID + "bubble")

        },
        drawBubble(data, refSize) {
            let vueThis = this;
            let id = '#' + this.myChartID;
            const cols = 5;
            const rows = 2;
            var margin = { top: 10, right: 30, bottom: 30, left: 60 },
                width = 150 * cols,
                height = 150 * rows;

            // let svg = d3.select(id).select("svg")
            //     .attr("viewBox", [0, 0, width, height])
            //     .attr("width", width + margin.left + margin.right)
            //     .attr("height", height + margin.top + margin.bottom);
            // let data = [
            //     { name: "AAA", size: 50 },
            //     { name: "asd", size: 200 },
            //     { name: "AdfA", size: 100 },
            //     { name: "AdsadfvAA", size: 150 },
            //     { name: "AasdfA", size: 1 },
            // ]


            var x = d3.scaleLinear()
                .domain([-0.5, cols - 0.5])
                .range([0, width]);

            var y = d3.scaleLinear()
                .domain([-0.5, rows - 0.5])
                .range([0, height]);

            let color = d3.scaleOrdinal().domain(data.map((x) => x.name)).range(d3.schemeCategory10);

            data = [...data].slice(0, rows * cols);
            data.sort((a, b) => -a.size + b.size);
            for (let i = 0; i < data.length; i++) {
                data[i]["order"] = i
            }



            function slot_x(order) {
                return order % cols
            }
            function slot_y(order) {
                return Math.floor(order / cols)
            }
            function get_r(size) {
                return Math.sqrt(size / refSize) * 0.5 * 100
            }

            let node = d3.select(id + "bubble")
                .selectAll(".node")
                .data(data)
                .enter()
                .append("g")
                .attr("class", "node")
                .attr("transform", function (d) {
                    return "translate(" + x(slot_x(d.order)) + "," + y(slot_y(d.order)) + ")";
                });
            node.append("circle")
                .attr("r", function (d) { return get_r(d.size) })
                .style("fill", function (d) { return color(d.name) })
            node.append("text")
                .attr("dy", ".2em")
                .style("text-anchor", "middle")
                .text(function (d) {
                    return d.name;
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", function (d) {
                    return get_r(d.size) / 3;
                })
                .attr("fill", "white");
            node.on("mouseover", function (d) {
                d3.select(this)
                    .selectAll("circle")
                    .transition()
                    .duration(100)
                    .attr("r", function (d) { return 1.2 * get_r(d.size) })
                d3.select(this)
                    .selectAll("text")
                    .transition()
                    .duration(100)
                    .attr("font-size", function (d) { return 1.2 * get_r(d.size) / 3 })

            })
            node.on("mouseout", function (d) {
                d3.select(this)
                    .selectAll("circle")
                    .transition()
                    .duration(100)
                    .attr("r", function (d) { return get_r(d.size) })
                d3.select(this)
                    .selectAll("text")
                    .transition()
                    .duration(100)
                    .attr("font-size", function (d) { return get_r(d.size) / 3 })

            })
            node.on("click", function (event, d) {
                console.log("Selected", d.name)
                vueThis.$emit("selectedEntry", d.name)
            })

            d3.select(id + "bubble")
                .selectAll(".node")
                .data(data)
                .exit()
                .remove();
                // .transition(t)
                // .attr("opacity", 1e-6)

            var t = d3.transition()
                .duration(750);
            d3.select(id + "bubble")
                .selectAll(".node")
                .data(data)
                .transition(t)
                .attr("transform", function (d) {
                    return "translate(" + x(slot_x(d.order)) + "," + y(slot_y(d.order)) + ")";
                });
            //     .attr("id", function (d) { return d.company })
            // .attr("cx", function (d) { return x(slot_x(d.order)); })
            // .attr("cy", function (d) { return y(slot_y(d.order)); })


        }
    }
}
</script>

<style scoped>
.pieChartContainer {
    background-color: white;
    height: 80%;
    width: 80%;
}
</style>