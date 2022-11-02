<template>
    <div id="bubble">
        <div id="bubbleLegend"></div>

        <h2 class="chartname">Overview of total CO2 emission each year</h2>

        <a-button class="bubbleButton" @click="reset">reset</a-button>
    </div>
</template>

<script>
import * as d3 from 'd3';
import csvPath from '../../assets/data/bubbleData.csv';
export default {
    name: 'bubbleChart',
    data() {
        return {
            rawData: [],
            bubbleData: [],
            year: 2019,
            colors: d3.schemeTableau10,
        };
    },
    props: {
        myBubbleChartData: Array,
    },
    mounted() {
        this.processData().then(() => this.drawChart());
    },
    methods: {
        reset() {

          this.processData().then(() => this.drawChart());
        },
        processData() {
            return new Promise((res, rej) => {
                d3.csv(csvPath).then((co2_emission) => {
                    this.rawData = co2_emission;
                    const newData = [];
                    co2_emission.forEach((d) => {
                        newData.push({
                            id: `${d.year}`,
                            value: d["sum"],
                            year: d["year"],
                        });
                    });
                    this.bubbleData = newData;
                    console.log(this.bubbleData);
                    res();
                });
            });
        },
        bubbleChart(
            data,
            {
                name = ([x]) => x, // alias for label
                label = name, // given d in data, returns text to display on the bubble
                value = ([, y]) => y, // given d in data, returns a quantitative size
                group, // given d in data, returns a categorical value for color
                title, // given d in data, returns text to show on hover
                width = 800, // outer width, in pixels
                height = width, // outer height, in pixels
                padding = 3, // padding between circles
                margin = 1, // default margins
                marginTop = margin, // top margin, in pixels
                marginRight = margin, // right margin, in pixels
                marginBottom = margin + 100, // bottom margin, in pixels
                marginLeft = margin, // left margin, in pixels
                groups, // array of group names (the domain of the color scale)
                colors = this.colors, // an array of colors (for groups)
                fill = '#ccc', // a static fill color, if no group channel is specified
                fillOpacity = 0.7, // the fill opacity of the bubbles
                stroke, // a static stroke around the bubbles
                strokeWidth, // the stroke width around the bubbles, if any
                strokeOpacity, // the stroke opacity around the bubbles, if any
            } = {}
        ) {

            const D = d3.map(data, (d) => d);
            const V = d3.map(data, value);
            const G = group == null ? null : d3.map(data, group);
            const I = d3.range(V.length).filter((i) => V[i] > 0);


            if (G && groups === undefined) groups = I.map((i) => G[i]);
            groups = G && new d3.InternSet(groups);

            const color = G && d3.scaleOrdinal(groups, colors);

            const L = label == null ? null : d3.map(data, label);
            const T =
                title === undefined
                    ? L
                    : title == null
                    ? null
                    : d3.map(data, title);

            const root = d3
                .pack()
                .size([
                    width - marginLeft - marginRight,
                    height - marginTop - marginBottom,
                ])
                .padding(padding)(
                d3.hierarchy({ children: I }).sum((i) => V[i])
            );
            d3.select('#bubble').selectAll('svg').remove();
            const svg = d3
                .select('#bubble')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .attr('viewBox', [-marginLeft, -marginTop, width, height])
                .attr(
                    'style',
                    'max-width: 100%; height: auto; height: intrinsic;'
                )
                .attr('fill', 'currentColor')
                .attr('font-size', 10)
                .attr('font-family', 'sans-serif')
                .attr('text-anchor', 'middle');

            const leaf = svg
                .selectAll('a')
                .data(root.leaves())
                .join('a')
                .attr('transform', (d) => `translate(${d.x},${d.y})`)
                .on('mouseover', (event, d) => {
                    tooltip
                        .style('opacity', 1)
                        .html(
                                `${this.bubbleData[d.data].year} CO2 emission: ` +
                                this.bubbleData[d.data].value
                        )
                        .style('left', event.pageX + 10 + 'px')
                        .style('top', event.pageY + 10 + 'px');
                })
                .on('mousemove', (event, d) => {
                    tooltip
                        .style('left', event.pageX + 10 + 'px')
                        .style('top', event.pageY + 10 + 'px');
                })
                .on('mouseleave', (d) => {
                    tooltip.style('opacity', 0);
                });

            var tooltip = d3
                .select('body')
                .append('div')
                .style('opacity', 0)
                .attr('class', 'tooltip')
                .attr(
                    'style',
                    `position: absolute;
          z-index: 1070;
          display: block;
          margin: 0;
          font-weight: 400;
          line-height: 1.5;
          text-align: left;
          text-align: start;
          letter-spacing: normal;
          word-break: normal;
          word-spacing: normal;
          white-space: normal;
          line-break: auto;
          font-size: .875rem;
          word-wrap: break-word;
          opacity: 0;
          color: white;
          border-radius: 8px;
          padding: 8px;
          background-color: black`
                );

            leaf.append('circle')
                .attr('stroke', stroke)
                .attr('stroke-width', strokeWidth)
                .attr('stroke-opacity', strokeOpacity)
                .attr(
                    'fill',
                    G ? (d) => color(G[d.data]) : fill == null ? 'none' : fill
                )
                .attr('fill-opacity', fillOpacity)
                .attr('r', (d) => d.r)
                .on("click", function (e, d) {
                  d3.select("#bubble").selectAll("circle").style("fill", "steelblue")
                  d3.select(this).style("fill", "red")
                });


            if (T) leaf.append('title').text((d) => T[d.data]);

            if (L) {

                const uid = `O-${Math.random().toString(16).slice(2)}`;

                leaf.append('clipPath')
                    .attr('id', (d) => `${uid}-clip-${d.data}`)
                    .append('circle')
                    .attr('r', (d) => d.r);

                leaf.append('text')
                    .attr(
                        'clip-path',
                        (d) =>
                            `url(${new URL(
                                `#${uid}-clip-${d.data}`,
                                location
                            )})`
                    )
                    .selectAll('tspan')
                    .data((d) => `${L[d.data]}`.split(/\n/g))
                    .join('tspan')
                    .attr('x', 0)
                    .attr('y', (d, i, D) => `${i - D.length / 2 + 0.85}em`)
                    .attr('fill-opacity', (d, i, D) =>
                        i === D.length - 1 ? 0.7 : null
                    )
                    .attr('color', 'black')
                    .style('font-size', '16px')
                    .text((d, i, D) => (d < 1 ? '' : d));
            }

            const legendLabel = d3
                .select('#bubbleLegend')
                .append('svg')
                .attr('width', width)
                .attr('viewBox', [-marginLeft, -marginTop, width, 100])
                .attr(
                    'style',
                    'max-width: 100%; height: auto; height: intrinsic;'
                )
                .attr('height', 100);

            console.log(T, G, root, groups, colors, color);
            let set = new Set();
            let index = 0;
            for (let i = 0; i < G.length; i++) {
                if (set.has(G[i])) {
                    continue;
                } else {

                    set.add(G[i]);
                    d3.select('#bubbleLegend')
                            .select('svg')
                            .append('rect')
                            .attr('width', 10)
                            .attr('height', 10)
                            .attr('x', 40 + (index <= 9 ? index * 50 : index <= 19 ? (index - 10) * 50 : (index - 20) * 50))
                            .attr('y', index <= 9 ? 0 : index <= 19 ? 20 : 40)
                            .attr('fill', color(G[i]));


                        d3.select('#bubbleLegend')
                            .select('svg')
                            .append('text')
                            .attr('x', 52 + (index <= 9 ? index * 50 : index <= 19 ? (index - 10) * 50 : (index - 20) * 50))
                            .attr('y', index <= 9 ? 10 : index <= 19 ? 30 : 50)
                            .attr('font-size', 11)
                            .text(T[i].split('.')[0]);
                    index++;
                }
            }


            legendLabel.textContent = name;
            legendLabel.style.position = 'absolute';
            legendLabel.style.top = '4px';

            return Object.assign(svg.node(), { scales: { color } });
        },
        drawChart() {
            this.bubbleChart(this.bubbleData, {
                label: (d) =>
                    [
                        ...d.id
                            .split('.')
                            .pop()
                            .split(/(?=[A-Z][a-z])/g),

                    ].join('\n'),
                value: (d) => d.value,
                group: (d) => d.year,
                title: (d) => `${d.id}`,
            });
        },
    },
};
</script>

<style>
#bubble {
    margin: 20px;
    background: #ffffff;
    position: relative;
}
.bubbleButton {
    position: absolute;
}
#bubbleLegend {
    position: absolute;
    right: 0;
    bottom: 0;
}
</style>
