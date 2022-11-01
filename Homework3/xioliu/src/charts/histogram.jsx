import * as d3 from "d3";
// import rd3 from 'react-d3-library';
import React from "react";
import './histogram.css'
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
// @ts-ignore

// @ts-ignore
export default function Histogram({data}) {
    const svgRef = React.useRef(null);
    const width = 1000;
    const height = 350;
    const [showAvgLine, setShowAvgLine] = React.useState(true);

    function processData(data) {
        let keys = ['Baggage handling',  'Checkin service', 'Cleanliness', 'Departure/Arrival time convenient',
        'Ease of Online booking', 'Food and drink', 'Gate location', 'Inflight entertainment', 'Inflight service',
        'Inflight wifi service', 'Leg room service', 'On-board service', 'Online boarding', 'Seat comfort'];
        let scores = Array();
        let sat_scores = Array();
        let unsat_scores = Array();

        for (let d in data) {
            let row = data[d];
            let score = 0;
            for (let key in keys) {
                // @ts-ignore
                score += Number(row[keys[key]])
            }
            scores.push(score);

            // @ts-ignore
            if (row['satisfaction'] === 'satisfied') {
                sat_scores.push(score);
            } else {
                unsat_scores.push(score);
            }
        }

        return {scores, sat_scores, unsat_scores}
    }

    function plotBarChart(){
        const {scores, sat_scores, unsat_scores} = processData(data);
        const line = d3.mean(unsat_scores);
        // console.log(line)

        const margin = {top: 70, right: 30, bottom: 40, left: 80};


        d3.select(svgRef.current).selectAll('text').remove();
        d3.select(svgRef.current).selectAll('line').remove();
        const svg = d3.select(svgRef.current).append('g').attr("transform", `translate(${margin.left},${margin.top})`);

        // @ts-ignore
        let x = d3.scaleLinear().domain([d3.min(scores), d3.max(scores)]).range([0, width - margin.left - margin.right]);
        // @ts-ignore
        let xAxis = d3.axisBottom(x)
        let gx = svg.append("g")
            .attr('transform', `translate(0, ${height - margin.top - margin.bottom})`)
            .call(xAxis);

        // @ts-ignore
        let hisograms = d3.bin().value((d) => d).domain(x.domain()).thresholds(x.ticks(20));
        let bins = hisograms(scores);

        // @ts-ignore
        let y = d3.scaleLinear().domain([0, d3.max(bins, (d) => d.length)]).range([height - margin.bottom - margin.top, 0]);
        let yAxis = d3.axisLeft(y);
        let gy = svg.append("g").call(yAxis);

        // console.log(y.domain());

        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .translateExtent([[-10, -10], [width - margin.left - margin.right, height]])
            .on("zoom", zoomed)

        function zoomed({transform}) {
            // rects.attr("transform", transform);
            let scaled_x = transform.rescaleX(x)
            svg.selectAll('rect').attr("x", 1)
                .attr("transform", function(d) { // @ts-ignore
                    return "translate(" + scaled_x(d.x0) + "," + y(d.length) + ")"; })
                .attr("width", function(d) { // @ts-ignore
                    return scaled_x(d.x1) - scaled_x(d.x0) -1 ; })
                .attr("height", function(d) { // @ts-ignore
                    return (height - margin.top - margin.bottom) - y(d.length); })
                .style("fill", "#1C8394")
            gx.call(xAxis.scale(scaled_x));
            gy.call(yAxis);

        }

        const rects = svg
            .append("g")
            .attr("class", "bars")
            .selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) { // @ts-ignore
                return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function(d) { // @ts-ignore
                return x(d.x1) - x(d.x0) -1 ; })
            .attr("height", function(d) { // @ts-ignore
                return (height - margin.top - margin.bottom) - y(d.length); })
            .style("fill", "#1C8394")

        svg.append('text')
            .attr('class', 'x label')
            .attr('text-anchor', 'middle')
            .attr('x', (width - margin.left - margin.right) / 2)
            .attr('y', height - margin.bottom - margin.top + 30).text("Satisfaction Score")

        svg.append('text')
            .attr('class', 'x label')
            .attr('text-anchor', 'end')
            .attr('x', -(height - margin.top - margin.bottom) / 2)
            .attr('y',  -50)
            .attr('transform', 'rotate(-90)')
            .text('Count')

        svg.append('circle')
            .attr("cx", width - margin.left - margin.right - 20)
            .attr("cy", 0)
            .attr('r', 6)
            .style('fill', "rgba(28,131,148,0.78)")
        svg.append('text')
            .attr('x', width - margin.left - margin.right)
            .attr('y', 2)
            .attr('text-anchor', 'start')
            .text('scores')
        svg.call(zoom);

    }

    React.useEffect(() => {
        if (data !== null){
            plotBarChart();
        }

    }, [data, showAvgLine])

    // console.log(1111);
    // @ts-ignore
    if (data !== {}){
        return (
            <div className={'svg-container'}>
                <div className={'headers'}>
                    <text>User Satisfaction Score Distribution</text>

                </div>
                <div className={'svg-chart'}>
                    <svg ref={svgRef} width={'100%'} height={'100%'} />
                </div>

            </div>
        );
    } else return (<div></div>)



}

