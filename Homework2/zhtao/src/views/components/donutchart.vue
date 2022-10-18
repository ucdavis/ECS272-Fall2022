<template>
    <div id="donut">
        <div class="donutTitle">{{year}} CO2 emission by region</div>
        <a-dropdown>
            <template #overlay>
                <a-menu @click="handleMenuClick">
                    <a-menu-item key="2019">
                        <UserOutlined />
                        2019
                    </a-menu-item>
                    <a-menu-item key="2018">
                        <UserOutlined />
                        2018
                    </a-menu-item>
                    <a-menu-item key="2017">
                        <UserOutlined />
                        2017
                    </a-menu-item>
                </a-menu>
            </template>
            <a-button class="donutButton">
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
    name: 'donutChart',
    data() {
        return {
            donutData: [],
            year: 2019,
        };
    },
    props: {
        myDonutchartData: Array,
    },
    mounted() {
        this.processData(this.year).then(() => this.drawChart());
    },
    methods: {
        handleMenuClick(e) {
            console.log('click left button', e);
            this.year = e.key;
            this.processData(e.key).then(() => {
                d3.select('#donut').select('svg').remove();
                this.drawChart();
            });
        },
        processData(year) {
            return new Promise((res, rej) => {
                d3.csv(csvPath).then((co2_emission) => {
                    const regionGroup = {};
                    co2_emission.forEach((d) => {
                        if (d.Region in regionGroup) {
                            regionGroup[d.Region]['sum'] += Number(d[year]);
                            regionGroup[d.Region]['count'] += 1;
                        } else {
                            regionGroup[d.Region] = {
                                name: d.Region,
                                sum: Number(d[year]),
                                count: 1,
                                y: year
                            };
                        }
                    });
                    const newData = [];
                    Object.keys(regionGroup).forEach((d) => {
                        newData.push(regionGroup[d]);
                    });
                    newData.sort((a, b) => a.sum - b.sum);
                    this.donutData = newData;
                    res()
                });
            });
        },
        donutChart(
            data,
            {
                name = ([x]) => x, // given d in data, returns the (ordinal) label
                sum = ([, y]) => y, // given d in data, returns the (quantitative) value
                title, // given d in data, returns the title text
                width = 640, // outer width, in pixels
                height = 400, // outer height, in pixels
                innerRadius = Math.min(width, height) / 3.5, // inner radius of pie, in pixels (non-zero for donut)
                outerRadius = Math.min(width, height) / 2.5, // outer radius of pie, in pixels
                labelRadius = (innerRadius + outerRadius) / 2.5, // center radius of labels
                format = ',', // a format specifier for values (in the label)
                names, // array of names (the domain of the color scale)
                colors, // array of colors for names
                stroke = innerRadius > 0 ? 'none' : 'white', // stroke separating widths
                strokeWidth = 1, // width of stroke separating wedges
                strokeLinejoin = 'round', // line join of stroke separating wedges
                padAngle = stroke === 'none' ? 1 / outerRadius : 0, // angular separation between wedges
            } = {}
        ) {
            // Compute values.
            console.log(data);
            const N = d3.map(data, name);
            const V = d3.map(data, sum);
            const I = d3.range(N.length).filter((i) => !isNaN(V[i]));

            // Unique the names.
            if (names === undefined) names = N;
            names = new d3.InternSet(names);

            // Chose a default color scheme based on cardinality.
            if (colors === undefined) colors = d3.schemeSpectral[names.size];
            if (colors === undefined)
                colors = d3.quantize(
                    (t) => d3.interpolateSpectral(t * 0.8 + 0.1),
                    names.size
                );

            // Construct scales.
            const color = d3.scaleOrdinal(names, colors).range(d3.schemeSet2);

            // Compute titles.
            if (title === undefined) {
                const formatValue = d3.format(format);
                title = (i) => `${N[i]}\n${formatValue(V[i])}`;
            } else {
                const O = d3.map(data, (d) => d);
                const T = title;
                title = (i) => T(O[i], i, data);
            }

            // Construct arcs.
            const arcs = d3
                .pie()
                .padAngle(padAngle)
                .sort(null)
                .value((i) => V[i])(I);
            const arc = d3
                .arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);
            const arcLabel = d3
                .arc()
                .innerRadius(labelRadius)
                .outerRadius(labelRadius);

            var svg = d3
                .select('#donut')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .attr('viewBox', [-width / 2, -height / 2, width, height])
                .attr(
                    'style',
                    'max-width: 100%; height: auto; height: intrinsic;'
                );

            var div = d3
                .select('body')
                .append('div')
                .attr('id', 'toolTip')
                .attr(
                    'style',
                    'position: absolute;display: none;width: auto;height: auto;background: none repeat scroll 0 0 white;border: 0 none;border-radius: 8px 8px 8px 8px;box-shadow: -3px 3px 15px #888888;color: black;font: 12px sans-serif;padding: 5px;text-align: center;'
                );

            svg.append('g')
                .attr('stroke', stroke)
                .attr('stroke-width', strokeWidth)
                .attr('stroke-linejoin', strokeLinejoin)
                .selectAll('path')
                .data(arcs)
                .join('path')
                .attr('fill', (d) => color(N[d.data]))
                .attr('d', arc)
                .append('title')
                .text((d) => title(d.data));

            svg.selectAll('mydots')
                .data(N)
                .enter()
                .append('circle')
                .attr('cx', -65)
                .attr('cy', function (d, i) {
                    return -70 + i * 25;
                }) // 100 is where the first dot appears. 25 is the distance between dots
                .attr('r', 7)
                .style('fill', function (d) {
                    return color(d);
                });

            // Add one dot in the legend for each name.
            svg.selectAll('mylabels')
                .data(N)
                .enter()
                .append('text')
                .attr('font-size', 12)
                .attr('x', -50)
                .attr('y', function (d, i) {
                    return -70 + i * 25;
                }) // 100 is where the first dot appears. 25 is the distance between dots
                .style('fill', function (d) {
                    return color(d);
                })
                .text(function (d) {
                    return d;
                })
                .attr('text-anchor', 'left')
                .style('alignment-baseline', 'middle')
                .style('font-color', 'black');

            svg.selectAll('path')
                .data(this.donutData)
                .on('mousemove', function (event, d) {
                    div.style('left', event.pageX + 10 + 'px');
                    div.style('top', event.pageY - 25 + 'px');
                    div.style('display', 'inline-block');
                    div.html(
                        d.name + `<br>${d.y} CO2 emission: ` + d.sum.toFixed(2)
                    );
                });

            svg.selectAll('path')
                .data(this.donutData)
                .on('mouseout', function (d) {
                    div.style('display', 'none');
                });

            return Object.assign(svg.node(), { scales: { color } });
        },
        drawChart() {
            this.donutChart(this.donutData, {
                name: (d) => d.name,
                sum: (d) => d.sum,
            });
        },
    },
};
</script>

<style>
#donut {
    margin: 20px;
    background: #f0f2f5;
    position: relative;
}
.donutButton {
    position: absolute;
}
.donutTitle {
    position: absolute;
    width: 100%;
    text-align: center;
}
</style>
