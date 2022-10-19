<template>
    <a-row type="flex">
        <a-col :flex="2">
            <div id="bubble"></div>
        </a-col>
        <a-col :flex="1">
            <div id="legend"></div>
            <div style="margin-left: 0px">
                <label>Bubble Size: </label>
                <a-select v-model:value="options" style="width: 150px" @change="handleChange">
                    <a-select-option value="avg_score">Avg IMDB Score</a-select-option>
                    <a-select-option value="num_movies">Number of Movies</a-select-option>
                </a-select>
            </div>
        </a-col>
    </a-row>
</template>

<script>
    import * as d3 from "d3";

    export default {
        name: 'BubbleChart',
        data() {
            return {
                name: 'Hello',
                options: 'avg_score',
                google20c: [
                    "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099",
                    "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395",
                    "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300",
                    "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"
                ]
            }
        },
        props:{
            myBubbleChartData: Array,
        },
        mounted(){
            this.drawBubbleChart(this.myBubbleChartData, "#bubble", {
                label: d => d.genre,
                value: d => Math.exp(d.imdb_score_avg),
                group: d => d.genre,
                title: d => 'Genre: ' + d.genre + '\n' + 'Avg IMDB Score: ' + d.imdb_score_avg + '\nNum of Movies of Genre: ' + d.num_movies,
                colors: this.google20c,
                width: 400
            })
            // this.drawBarChart(this.myBarchartData, "#bar")
            console.log("Data Passed down as a Prop  ", this.myBubbleChartData)
        },
        methods: {
            handleChange() {
                console.log(this.options);
                d3.select('#bubble').select('svg').remove();
                d3.select('#legend').select('svg').remove();
                if (this.options == 'avg_score') {
                    this.drawBubbleChart(this.myBubbleChartData, "#bubble", {
                        label: d => d.genre,
                        value: d => Math.exp(d.imdb_score_avg),
                        group: d => d.genre,
                        title: d => 'Genre: ' + d.genre + '\n' + 'Avg IMDB Score: ' + d.imdb_score_avg + '\nNum of Movies of Genre: ' + d.num_movies,
                        colors: this.google20c,
                        width: 400
                    })
                } else if (this.options == 'num_movies') {
                    this.drawBubbleChart(this.myBubbleChartData, "#bubble", {
                        label: d => d.genre,
                        value: d => Math.sqrt(d.num_movies),
                        group: d => d.genre,
                        title: d => 'Genre: ' + d.genre + '\n' + 'Avg IMDB Score: ' + d.imdb_score_avg + '\nNum of Movies of Genre: ' + d.num_movies,
                        colors: this.google20c,
                        width: 400
                    })
                }
            },
            drawBubbleChart(data, id, {
                name = ([x]) => x, // alias for label
                label = name, // given d in data, returns text to display on the bubble
                value = ([, y]) => y, // given d in data, returns a quantitative size
                group, // given d in data, returns a categorical value for color
                title, // given d in data, returns text to show on hover
                link, // given a node d, its link (if any)
                linkTarget = "_blank", // the target attribute for links, if any
                width = 640, // outer width, in pixels
                height = 550, // outer height, in pixels
                padding = 3, // padding between circles
                margin = 1, // default margins
                marginTop = margin, // top margin, in pixels
                marginRight = margin, // right margin, in pixels
                marginBottom = margin, // bottom margin, in pixels
                marginLeft = margin, // left margin, in pixels
                groups, // array of group names (the domain of the color scale)
                colors = d3.schemeTableau10, // an array of colors (for groups)
                fill = "#ccc", // a static fill color, if no group channel is specified
                fillOpacity = 0.7, // the fill opacity of the bubbles
                stroke, // a static stroke around the bubbles
                strokeWidth, // the stroke width around the bubbles, if any
                strokeOpacity, // the stroke opacity around the bubbles, if any
            } = {}) {
                // Compute the values.
                const D = d3.map(data, d => d);
                const V = d3.map(data, value);
                const G = group == null ? null : d3.map(data, group);
                const I = d3.range(V.length).filter(i => V[i] > 0);
                
                // Unique the groups.
                if (G && groups === undefined) groups = I.map(i => G[i]);
                groups = G && new d3.InternSet(groups);
                
                // Construct scales.
                const color = G && d3.scaleOrdinal(groups, colors);
                
                // Compute labels and titles.
                const L = label == null ? null : d3.map(data, label);
                const T = title === undefined ? L : title == null ? null : d3.map(data, title);
                
                // Compute layout: create a 1-deep hierarchy, and pack it.
                const root = d3.pack()
                    .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
                    .padding(padding)
                    (d3.hierarchy({children: I})
                    .sum(i => V[i]));
                
                const svg = d3.select(id).append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("viewBox", [-marginLeft, -marginTop, width, height])
                    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
                    .attr("fill", "currentColor")
                    .attr("font-size", 12)
                    .attr("font-family", "sans-serif")
                    .attr("text-anchor", "middle");

                const leaf = svg.selectAll("a")
                    .data(root.leaves())
                    .join("a")
                    .attr("xlink:href", link == null ? null : (d, i) => link(D[d.data], i, data))
                    .attr("target", link == null ? null : linkTarget)
                    .attr("transform", d => `translate(${d.x},${d.y})`);

                leaf.append("circle")
                    .attr("stroke", stroke)
                    .attr("stroke-width", strokeWidth)
                    .attr("stroke-opacity", strokeOpacity)
                    .attr("fill", G ? d => color(G[d.data]) : fill == null ? "none" : fill)
                    .attr("fill-opacity", fillOpacity)
                    .attr("r", d => d.r);

                if (T) leaf.append("title")
                    .text(d => T[d.data]);

                if (L) {
                    // A unique identifier for clip paths (to avoid conflicts).
                    const uid = `O-${Math.random().toString(16).slice(2)}`;

                    leaf.append("clipPath")
                        .attr("id", d => `${uid}-clip-${d.data}`)
                    .append("circle")
                        .attr("r", d => d.r);

                    leaf.append("text")
                        .attr("clip-path", d => `url(${new URL(`#${uid}-clip-${d.data}`, location)})`)
                    .selectAll("tspan")
                    .data(d => `${L[d.data]}`.split(/\n/g))
                    .join("tspan")
                        .attr("x", 0)
                        .attr("y", (d, i, D) => `${i - D.length / 2 + 0.85}em`)
                        .attr("fill-opacity", (d, i, D) => i === D.length - 1 ? 0.7 : null)
                        .text(d => d);
                }

                //Initialize legend
                var legendItemSize = 12;
                var legendSpacing = 4;
                var xOffset = 50;
                var yOffset = 50;
                var legend = d3.select('#legend')
                                .append('svg')
                                .selectAll('.legendItem')
                                .data(data);
                
                //Create legend items
                legend
                .enter()
                .append('rect')
                .attr('class', 'legendItem')
                .attr('width', legendItemSize)
                .attr('height', legendItemSize)
                .style('fill', d => color(d.genre))
                .attr('transform',
                    (d, i) => {
                        var x = xOffset;
                        var y = yOffset + (legendItemSize + legendSpacing) * i;
                        return `translate(${x}, ${y})`;
                    });
                
                //Create legend labels
                legend
                .enter()
                .append('text')
                .attr('x', xOffset + legendItemSize + 5)
                .attr('y', (d, i) => yOffset + (legendItemSize + legendSpacing) * i + 12)
                .text(d => d.genre); 
            },
        }
    }

</script>


<style>
a {
    color:black
}
#legend svg {
    height: 400px
}
</style>