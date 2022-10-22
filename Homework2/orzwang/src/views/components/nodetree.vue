<template>
    <div>Type Movie Title to Show Staff (year to help specify): {{ movie }}</div>
    <input v-model.trim="movie"/>{{movie}}
    <input v-model.trim="year"/>{{year}}
    <div class="card" :id="myChartID">
    </div>
</template>

<script>
import * as d3 from "d3";

export default{
    name : "Nodetree",
    data(){
        return{
            testData: d3.hierarchy({
                name: "root",
                children: [
                    {name: "child #1"},
                    {
                    name: "child #2",
                    children: [
                        {name: "grandchild #1"},
                        {name: "grandchild #2"},
                        {name: "grandchild #3"}
                    ]
                    }
                ]
            }),
            movie : "Girlfriends",
            year : 2020,
            allmovies : Object,
            moviedetail : Object
        }
    },
    props:{
        myNodeData : Array,
        myChartID : String,

    },
    created(){
        console.log("Tree data passed:")
        console.log(this.myNodeData)
    },
    mounted(){
        //let localData = this.testData;
        //console.log("Data Passed down as a Prop  ", localData)
        //this.drawNodes(localData, this.myChartID, {label: d => d.data.name});
        this.changeData(this.movie)
    },
    watch: {
        movie(oldval, newval){
            this.changeData(this.movie)
        }
    },
    methods: {
        changeData(movie){
            console.log("Data Changed!")
            console.log(movie)
            
            let alltitle = this.myNodeData[movie]
            console.log(alltitle)
            let thismovie = alltitle[0]
            alltitle.forEach(d => {
                if (d.year == this.year){
                    thismovie = d
                }
            });
            let details = {
                name : movie,
                children : thismovie.involve.slice(0,10)
            }
            let localData = d3.hierarchy(details)
            this.drawNodes(localData, this.myChartID, {label: d => d.data.name})
        },
        groupBy(objectArray, property) {            
            return objectArray.reduce(function (acc, obj) {
                let key = obj[property]
                if (!acc[key]) {
                acc[key] = []
                }
                acc[key].push(obj)
                return acc
            }, {})
        },
        drawNodes(data, id, {
            label = d => d.data.id, 
            highlight = () => false,
            marginLeft = 20,
            width = 200
            } = {}) {
            let dx = 6;
            let dy = 60;
            const tree = d3.tree().nodeSize([dx, dy]);
            const treeLink = d3.linkHorizontal().x(d => d.y).y(d => d.x);
            let root = tree(data);

            let x0 = Infinity;
            let x1 = -x0;
            
            root.each(d => {
                if (d.x > x1) x1 = d.x;
                if (d.x < x0) x0 = d.x;
            });
            
            id = '#'+id
            d3.select(id).select('svg').remove()
            const svg = d3.select(id)
                .append("svg")
                .attr("viewBox", [0, 0, width, x1 - x0 + dx * 2])
                .style("overflow", "visible");
            
            const g = svg.append("g")
                .attr("font-family", "sans-serif")
                .attr("font-size", 4)
                .attr("transform", `translate(${marginLeft},${dx - x0})`);
                
            const link = g.append("g")
                .attr("fill", "none")
                .attr("stroke", "#555")
                .attr("stroke-opacity", 0.4)
                .attr("stroke-width", 1.5)
            .selectAll("path")
                .data(root.links())
                .join("path")
                .attr("stroke", d => highlight(d.source) && highlight(d.target) ? "red" : null)
                .attr("stroke-opacity", d => highlight(d.source) && highlight(d.target) ? 1 : null)
                .attr("d", treeLink);
            
            const node = g.append("g")
                .attr("stroke-linejoin", "round")
                .attr("stroke-width", 1)
                .selectAll("g")
                .data(root.descendants())
                .join("g")
                .attr("transform", d => `translate(${d.y},${d.x})`);

            node.append("circle")
                .attr("fill", d => highlight(d) ? "red" : d.children ? "#555" : "#999")
                .attr("r", 0.5);

            node.append("text")
                .attr("fill", d => highlight(d) ? "red" : null)
                .attr("stroke", "white")
                .attr("paint-order", "stroke")
                .attr("dy", "0.0031em")
                .attr("x", d => d.children ? -6 : 6)
                .attr("text-anchor", d => d.children ? "end" : "start")
                .text(label);
            
            return svg.node();
        },
        
    }
}
</script>
<style>
.card{
    height: 70%;
    width: 70;
}
</style>