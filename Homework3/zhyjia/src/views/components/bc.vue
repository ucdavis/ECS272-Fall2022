<template>
    <a-row type="flex">
<!--         <a-col :flex="4"> -->
            <div id="bbc"></div>
            <div style="margin-left: 0px">
                <label>Data Dimension </label>
                <a-select v-model:value="selected" style="width: 170px" @change="handleChange">
                    <a-select-option value="genre">Movie Genre</a-select-option>
                    <a-select-option value="rating">Movie Rating</a-select-option>
                    <a-select-option value="runtime">Movie Runtime</a-select-option>
                    <a-select-option value="year">Movie Release Time</a-select-option>
                    <a-select-option value="keyword">Movie Keyword</a-select-option>
                </a-select>
            </div>
    </a-row>
</template>

<script>
    import * as d3 from "d3";

    export default {
        name: 'BubbleChart',
        data() {
            return {
                selected: "genre",
                genre : [{'type': 'Action', 'cnt': 1144},
                     {'type': 'Adventure', 'cnt': 784},
                     {'type': 'Fantasy', 'cnt': 419},
                     {'type': 'Science', 'cnt': 532},
                     {'type': 'Crime', 'cnt': 693},
                     {'type': 'Drama', 'cnt': 2285},
                     {'type': 'Thriller', 'cnt': 1267},
                     {'type': 'Animation', 'cnt': 231},
                     {'type': 'Family', 'cnt': 505},
                     {'type': 'Western', 'cnt': 82},
                     {'type': 'Comedy', 'cnt': 1709},
                     {'type': 'Romance', 'cnt': 888},
                     {'type': 'Horror', 'cnt': 516},
                     {'type': 'Mystery', 'cnt': 346},
                     {'type': 'History', 'cnt': 196},
                     {'type': 'War', 'cnt': 144},
                     {'type': 'Music', 'cnt': 184},
                     {'type': 'Doc', 'cnt': 109}],
                rating: [{'level': '<3', 'cnt': 176},
                     {'level': '3~5', 'cnt': 870},
                     {'level': '5~7', 'cnt': 6538},
                     {'level': '7~8', 'cnt': 1880},
                     {'level': '>8', 'cnt': 90}],
                runtime: [{'time': '<60', 'cnt': 43},
                     {'time': '60~90', 'cnt': 698},
                     {'time': '90~120', 'cnt': 3009},
                     {'time': '120~150', 'cnt': 889},
                     {'time': '150~180', 'cnt': 132},
                     {'time': '>180', 'cnt': 49}],
                year: [{'year': '<1950', 'cnt': 45},
                     {'year': '1950~1975', 'cnt': 191},
                     {'year': '1975~2000', 'cnt': 1109},
                     {'year': '2000~2010', 'cnt': 2037},
                     {'year': '>2010', 'cnt': 1439}],
                keyword: [{'keyword': 'woman director', 'cnt': 321},
                     {'keyword': 'independent film', 'cnt': 318},
                     {'keyword': 'duringcreditsstinger', 'cnt': 304},
                     {'keyword': 'based on novel', 'cnt': 197},
                     {'keyword': 'murder', 'cnt': 189},
                     {'keyword': 'aftercreditsstinger', 'cnt': 169},
                     {'keyword': 'violence', 'cnt': 150},
                     {'keyword': 'dystopia', 'cnt': 138},
                     {'keyword': 'sport', 'cnt': 124},
                     {'keyword': 'revenge', 'cnt': 118}]
            }
        },

        mounted(){
            this.bubbleChart(this.genre, {
                label: d => d.type,
                value: d => Math.sqrt(d.cnt),
                group: d => d.type, 
                title: d => "Number of this genre: " + d.cnt 
            });
        },
        methods: {
            handleChange() {
                d3.select('#bbc').select('svg').remove();
                if (this.selected == 'genre') {
                    this.bubbleChart(this.genre, {
                        label: d => d.type,
                        value: d => Math.sqrt(d.cnt),
                        group: d => d.type, 
                        title: d => "Number of this genre: " + d.cnt 
                    });
                } else if(this.selected == 'rating'){
                    this.bubbleChart(this.rating, {
                        label: d => d.level,
                        value: d => d.cnt,
                        group: d => d.level, 
                        title: d => "Number of this level: " + d.cnt 
                    });
                } else if(this.selected == 'runtime'){
                    this.bubbleChart(this.runtime, {
                        label: d => d.time,
                        value: d => d.cnt,
                        group: d => d.time, 
                        title: d => "Number of this range: " + d.cnt 
                    });
                } else if(this.selected == 'year'){
                    this.bubbleChart(this.year, {
                        label: d => d.year,
                        value: d => d.cnt,
                        group: d => d.year, 
                        title: d => "Number of this range: " + d.cnt 
                    });
                } else if(this.selected == 'keyword'){
                    this.bubbleChart(this.keyword, {
                        label: d => d.keyword,
                        value: d => d.cnt,
                        group: d => d.keyword, 
                        title: d => "Number of this keyword: " + d.cnt 
                    });
                }
            },
            bubbleChart(data, {
              name = ([x]) => x, // alias for label
              label = name, // given d in data, returns text to display on the bubble
              value = ([, y]) => y, // given d in data, returns a quantitative size
              group, // given d in data, returns a categorical value for color
              title, // given d in data, returns text to show on hover
              link, // given a node d, its link (if any)
              linkTarget = "_blank", // the target attribute for links, if any
              width = 630, // outer width, in pixels
              height = 700, // outer height, in pixels
              padding = 3, // padding between circles
              margin = 1, // default margins
              marginTop = margin, // top margin, in pixels
              marginRight = margin, // right margin, in pixels
              marginBottom = margin, // bottom margin, in pixels
              marginLeft = margin, // left margin, in pixels
              groups, // array of group names (the domain of the color scale)
              colors = d3.schemeTableau10, // an array of colors (for groups)
              fill = "#ccc", // a static fill color, if no group channel is specified
              fillOpacity = 0.8, // the fill opacity of the bubbles
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

              const svg = d3.select("#bbc").append('svg')
                  .attr("width", width)
                  .attr("height", height)
                  .attr("viewBox", [-marginLeft, -marginTop, width, height])
                  .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
                  // .attr("fill", "currentColor")
                  .attr("font-size", 15)
                  // .attr("font-family", "sans-serif")
                  .attr("text-anchor", "middle");

              const leaf = svg.selectAll("a")
                .data(root.leaves())
                .join("a")
                  .attr("xlink:href", link == null ? null : (d, i) => link(D[d.data], i, data))
                  .attr("target", link == null ? null : linkTarget)
                  .attr("transform", d => `translate(${d.x},${d.y})`);

              leaf.append("circle")
                    .transition().delay(10).duration(500)
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
            },
        }
    }

</script>