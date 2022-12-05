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
                {key: 1910, value: 14},
                {key: 1920, value: 20},
                {key: 1930, value: 42},
                {key: 1940, value: 94},
                {key: 1950, value: 344},
                {key: 1960, value: 54},    
                {key: 1970, value: 124}
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
        this.init(this.bubbleData);
        this.drawBubble(this.bubbleData);
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
					    	node.children.forEach(function(child) {                                                          //将孩子结点中的每条数据
					    		recurse(node.name, child); })
					    }
					    else {classes.push({ className: node.name, value: node.size})};                                     //如果自身是孩子结点的，将内容压入数组
					}
					recurse(null, root);
					return {children: classes};                                                                             //返回所有的子节点  （包含在children中）                                                                          
				},
        init(data) {
            let id = '#'+this.myChartID;
            this.bubble = d3.pack()                                  //初始化包图
                            //.radius(this.diameter)                       
                            .size([this.diameter, this.diameter])	                    //设置范围
                            .padding(1.5);    
                                                                            //设置间距
            this.color = d3.scaleOrdinal()
                        .domain(data.map(d => d.key))
                        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

            let svg = d3.select(id).select("svg").attr("viewBox", [0, 0, this.width, this.height]);
            
        },
        drawBubble(data) {
            let id = '#'+this.myChartID;
            let svg = d3.select(id).select("svg")
            var result = data;
			/*以下是字符串拼接*/
			var startString = "{\"name\": \"flare\",\"children\": [";                      //开头字符串
			result.forEach(function(dude){                                                 //遍历result并且拼接
				startString+="{\"name\":\""+dude.key+"\",\"size\":"+dude.value+"},";
			})
			/*去除最后一个末尾的逗号，这个逗号会影响后面JSON.parse的使用*/
			startString = startString.substring(0,startString.length-1);
			/*拼接尾部字符串*/
			startString+="]}";
			/*将拼接好的字符串转换成json对象*/
			var json2 = JSON.parse(startString);
			/*绘图部分*/
			console.log(this.classes(json2));
			var node = svg.selectAll(".node")
	                      .data(this.bubble(this.classes(json2))                                                                //绑定数据（配置结点）
	                      .filter(function(d) { return !d.children; }))                                                      //数据过滤，满足条件返回自身（没孩子返回自身，有孩子不返回，这里目的是去除父节点）
	 	                  .enter().append("g")
	                      .attr("class", "node")
	                      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });                  //设定g移动
				
				node.append("title")
				    .text(function(d) { return d.className + ": " + (d.value); });             //设置移入时候显示数据   数据名和值
				
				node.append("circle")
				    .attr("r", function(d) { return d.r;})                                     //设置圆的半径
				    .style("fill", function(d) { return this.color(d.value); });              //为圆形涂色
				
				node.append("text")
				    .attr("dy", ".3em")
				    .style("text-anchor", "middle")                                            //设置文本对齐
				    .text(function(d) { return d.className.substring(0, d.r / 3); })          //根据半径的大小来截取对应长度字符串（很重要）
                    .on("mouseover", function(d) {
                        d3.select(this)
                        .transition()
                        .duration(100)
                        .attr("font-size", "18px")
                    })
                    .on("mouseout", function(d) {
                        d3.select(this)
                        .transition()
                        .duration(100)
                        .attr("font-size", "12px")
                    });
                
            let vueThis = this;
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