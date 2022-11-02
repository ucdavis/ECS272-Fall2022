<template>
    <div id="bubble">
        <div id="bubbleLegend"></div>
        <div class="bubbleTitle">{{ year }} CO2 emission by country</div>
        <a-dropdown>
            <template #overlay>
                <a-menu @click="handleMenuClick">
                    <a-menu-item key="2019"> 2019 </a-menu-item>
                    <a-menu-item key="2018"> 2018 </a-menu-item>
                    <a-menu-item key="2017"> 2017 </a-menu-item>
                </a-menu>
            </template>
            <a-button class="bubbleButton">
                {{ year }}
                ▼
            </a-button>
        </a-dropdown>
    </div>
</template>

<script>
import * as d3 from 'd3';
import csvPath from '../../assets/data/CO2_emission.csv';
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
        this.processData('2019').then(() => this.drawChart());
        // this.swatches('Category10');
    },
    methods: {
        swatches(name) {
            // const colors = this.colors;
            // const n = colors.length;
            // const dark = d3.lab(colors[0]).l < 50;
            // const canvas = `<svg viewBox="0 0 ${n} 1" style="display:block;width:${
            //     n * 33
            // }px;height:33px;margin:0 -14px;cursor:pointer;">${colors.map(
            //     (c, i) => `<rect x=${i} width=1 height=1 fill=${c}>`
            // )}`;
            // const label = d3.select('#bubbleLegend').append('svg')
            // // .attr('width', 20)
            // // .attr('height', 20)
            // colors.map((c, i) => d3.select('#bubbleLegend').select('svg').append('rect')
            // .attr('width', 10).attr('height', 10).attr('fill', c))
            // // .append('rect')
            // // .attr('width', 2)
            // // .attr('height', 2);
            // label.textContent = name;
            // label.style.position = 'absolute';
            // label.style.top = '4px';
            // label.style.color = dark ? `#fff` : `#000`;
            // canvas.onclick = () => {
            //     label.textContent = 'Copied!';
            //     navigator.clipboard.writeText(JSON.stringify(colors));
            //     setTimeout(() => (label.textContent = name), 2000);
            // };
            // return html`${canvas}${label}`;
        },
        handleMenuClick(e) {
            console.log('click left button', e);
            this.year = e.key;
            this.processData(e.key).then(() => {
                d3.select('#bubble').selectAll('svg').remove();
                this.drawChart();
            });
        },
        processData(year) {
            return new Promise((res, rej) => {
                d3.csv(csvPath).then((co2_emission) => {
                    this.rawData = co2_emission;
                    const newData = [];
                    co2_emission.forEach((d) => {
                        newData.push({
                            id: `${d.Region}.${d.country_code}`,
                            value: Number(d[year]).toFixed(2),
                            country: d['Country Name'],
                        });
                    });
                    newData
                        .filter((d) => d.value != '')
                        .sort((a, b) => a.id.localeCompare(b.id));
                    this.bubbleData = newData
                        .filter((d) => d.value != '')
                        .sort((a, b) => a.id.localeCompare(b.id));
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
            // Compute the values.
            const D = d3.map(data, (d) => d);
            const V = d3.map(data, value);
            const G = group == null ? null : d3.map(data, group);
            const I = d3.range(V.length).filter((i) => V[i] > 0);

            // Unique the groups.
            if (G && groups === undefined) groups = I.map((i) => G[i]);
            groups = G && new d3.InternSet(groups);

            // Construct scales.
            const color = G && d3.scaleOrdinal(groups, colors);

            // Compute labels and titles.
            const L = label == null ? null : d3.map(data, label);
            const T =
                title === undefined
                    ? L
                    : title == null
                    ? null
                    : d3.map(data, title);

            // Compute layout: create a 1-deep hierarchy, and pack it.
            const root = d3
                .pack()
                .size([
                    width - marginLeft - marginRight,
                    height - marginTop - marginBottom,
                ])
                .padding(padding)(
                d3.hierarchy({ children: I }).sum((i) => V[i])
            );

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
                .attr('font-size', 8)
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
                            this.bubbleData[d.data].country +
                                `<br>${this.year} CO2 emission: ` +
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
                .attr('r', (d) => d.r);

            if (T) leaf.append('title').text((d) => T[d.data]);

            if (L) {
                // A unique identifier for clip paths (to avoid conflicts).
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
            // .attr('width', 20)
            // .attr('height', 20)
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
                            .attr('x', 40 + (index <= 2 ? index * 200 : index <= 5 ? (index - 3) * 200 : (index - 6) * 200))
                            .attr('y', index <= 2 ? 0 : index <= 5 ? 20 : 40)
                            .attr('fill', color(G[i]));

                        // d3.select('#bubbleLegend').select('svg').append('text').text(T[i]);
                        d3.select('#bubbleLegend')
                            .select('svg')
                            .append('text')
                            .attr('x', 60 + (index <= 2 ? index * 200 : index <= 5 ? (index - 3) * 200 : (index - 6) * 200))
                            .attr('y', index <= 2 ? 10 : index <= 5 ? 30 : 50)
                            .attr('font-size', 12)
                            .text(T[i].split('.')[0]);
                    index++;
                }
            }

            // .append('rect')
            // .attr('width', 2)
            // .attr('height', 2);
            legendLabel.textContent = name;
            legendLabel.style.position = 'absolute';
            legendLabel.style.top = '4px';
            // legendLabel.style.color = dark ? `#fff` : `#000`;

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
                        d.value.toLocaleString('en'),
                    ].join('\n'),
                value: (d) => d.value,
                group: (d) => d.id.split('.')[0],
                title: (d) => `${d.id}\n${d.value.toLocaleString('en')}`,
            });
        },
    },
};
</script>

<style>
#bubble {
    margin: 20px;
    background: #f0f2f5;
    position: relative;
}
.bubbleButton {
    position: absolute;
    /* top: 30px;
    left: 30px; */
}
.bubbleTitle {
    position: absolute;
    width: 100%;
    text-align: center;
}
#bubbleLegend {
    position: absolute;
    right: 0;
    bottom: 0;
}
</style>
