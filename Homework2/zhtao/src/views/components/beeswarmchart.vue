<template>
    <div id="beeswarm">
        <div class="beeswarmTitle">Beeswarm</div>
        <a-dropdown>
            <template #overlay>
                <a-menu @click="handleMenuClick">
                    <a-menu-item key="2019"> 2019 </a-menu-item>
                    <a-menu-item key="2018"> 2018 </a-menu-item>
                    <a-menu-item key="2017"> 2017 </a-menu-item>
                </a-menu>
            </template>
            <a-button class="beeswarmButton">
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
    name: 'beeswarmChart',
    data() {
        return {
            beeswarmData: [],
            year: 2019,
        };
    },
    props: {
        myDonutchartData: Array,
    },
    mounted() {
        this.processData(2019).then(() => this.drawChart());
    },
    methods: {
        handleMenuClick(e) {
            console.log('click left button', e);
            this.year = e.key;
            this.processData(e.key).then(() => {
                d3.select('#beeswarm').select('svg').remove();
                this.drawChart();
            });
        },
        processData(year) {
            return new Promise((res, rej) => {
                d3.csv(csvPath).then((co2_emission) => {
                    const newData = [];
                    co2_emission.forEach((d) => {
                        newData.push({
                            country: d['Country Name'],
                            emission: d[year],
                        });
                    });

                    this.beeswarmData = newData;
                    console.log(this.beeswarmData);
                    res();
                });
            })
        },
        beeswarmChart(
            data,
            {
                value = (d) => d, // convenience alias for x
                label, // convenience alias for xLabel
                type = d3.scaleLinear, // convenience alias for xType
                domain, // convenience alias for xDomain
                x = value, // given d in data, returns the quantitative x value
                title = null, // given d in data, returns the title
                group, // given d in data, returns an (ordinal) value for color
                groups, // an array of ordinal values representing the data groups
                colors = d3.schemeTableau10, // an array of color strings, for the dots
                radius = 3, // (fixed) radius of the circles
                padding = 1.5, // (fixed) padding between the circles
                marginTop = 10, // top margin, in pixels
                marginRight = 20, // right margin, in pixels
                marginBottom = 30, // bottom margin, in pixels
                marginLeft = 20, // left margin, in pixels
                width = 640, // outer width, in pixels
                height = 400, // outer height, in pixels
                xType = type, // type of x-scale, e.g. d3.scaleLinear
                xLabel = label, // a label for the x-axis
                xDomain = domain, // [xmin, xmax]
                xRange = [marginLeft, width - marginRight], // [left, right]
            } = {}
        ) {
            // Compute values.
            const X = d3.map(data, x).map((x) => (x == null ? NaN : +x));
            const T = title == null ? null : d3.map(data, title);
            const G = group == null ? null : d3.map(data, group);

            // Compute which data points are considered defined.
            const I = d3.range(X.length).filter((i) => !isNaN(X[i]));

            // Compute default domains.
            if (xDomain === undefined) xDomain = d3.extent(X);
            if (G && groups === undefined) groups = d3.sort(G);

            // Construct scales and axes.
            const xScale = xType(xDomain, xRange);
            const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
            const color =
                group == null ? null : d3.scaleOrdinal(groups, colors);

            // Compute the y-positions.
            const Y = dodge(
                I.map((i) => xScale(X[i])),
                radius * 2 + padding
            );

            // Compute the default height;
            if (height === undefined)
                height =
                    d3.max(Y) +
                    (radius + padding) * 2 +
                    marginTop +
                    marginBottom;

            // Given an array of x-values and a separation radius, returns an array of y-values.
            function dodge(X, radius) {
                const Y = new Float64Array(X.length);
                const radius2 = radius ** 2;
                const epsilon = 1e-3;
                let head = null,
                    tail = null;

                // Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
                function intersects(x, y) {
                    let a = head;
                    while (a) {
                        const ai = a.index;
                        if (
                            radius2 - epsilon >
                            (X[ai] - x) ** 2 + (Y[ai] - y) ** 2
                        )
                            return true;
                        a = a.next;
                    }
                    return false;
                }

                // Place each circle sequentially.
                for (const bi of d3
                    .range(X.length)
                    .sort((i, j) => X[i] - X[j])) {
                    // Remove circles from the queue that can’t intersect the new circle b.
                    while (head && X[head.index] < X[bi] - radius2)
                        head = head.next;

                    // Choose the minimum non-intersecting tangent.
                    if (intersects(X[bi], (Y[bi] = 0))) {
                        let a = head;
                        Y[bi] = Infinity;
                        do {
                            const ai = a.index;
                            let y =
                                Y[ai] +
                                Math.sqrt(radius2 - (X[ai] - X[bi]) ** 2);
                            if (y < Y[bi] && !intersects(X[bi], y)) Y[bi] = y;
                            a = a.next;
                        } while (a);
                    }

                    // Add b to the queue.
                    const b = { index: bi, next: null };
                    if (head === null) head = tail = b;
                    else tail = tail.next = b;
                }

                return Y;
            }

            const svg = d3
                .select('#beeswarm')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .attr('viewBox', [0, 0, width, height])
                .attr(
                    'style',
                    'max-width: 100%; height: auto; height: intrinsic;'
                );

            svg.append('g')
                .attr('transform', `translate(0,${height - marginBottom})`)
                .call(xAxis)
                .call((g) =>
                    g
                        .append('text')
                        .attr('x', width)
                        .attr('y', marginBottom - 4)
                        .attr('fill', 'currentColor')
                        .attr('text-anchor', 'end')
                        .text(xLabel)
                );

            const dot = svg
                .append('g')
                .selectAll('circle')
                .data(I)
                .join('circle')
                .attr('cx', (i) => xScale(X[i]))
                .attr(
                    'cy',
                    (i) => height - marginBottom - radius - padding - Y[i]
                )
                .attr('r', radius);

            if (G) dot.attr('fill', (i) => color(G[i]));

            if (T) dot.append('title').text((i) => T[i]);

            return svg.node();
        },
        drawChart() {
            this.beeswarmChart(this.beeswarmData, {
                x: (d) => d.emission,
                label: 'CO2 emission',
                type: d3.scaleLinear, // try d3.scaleLog
            });
        },
    },
};
</script>

<style>
#beeswarm {
    margin: 20px;
    background: #f0f2f5;
    position: relative;
}
.beeswarmButton {
    position: absolute;
}
.beeswarmTitle {
    position: absolute;
    width: 100%;
    text-align: center;
}
</style>
