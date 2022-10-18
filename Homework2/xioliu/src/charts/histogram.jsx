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
        svg.append("g")
            .attr('transform', `translate(0, ${height - margin.top - margin.bottom})`)
            .call(d3.axisBottom(x));

        // @ts-ignore
        let hisograms = d3.bin().value((d) => d).domain(x.domain()).thresholds(x.ticks(20));
        let bins = hisograms(scores);

        // @ts-ignore
        let y = d3.scaleLinear().domain([0, d3.max(bins, (d) => d.length)]).range([height - margin.bottom - margin.top, 0]);
        svg.append("g").call(d3.axisLeft(y));

        // console.log(y.domain());

        svg.selectAll("rect")
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

        if (showAvgLine) {
            // @ts-ignore
            // @ts-ignore
            svg.append('line').attr('x1', x(41)).attr('y1', height - margin.top - margin.bottom).attr('x2', x(41))
                .attr('y2', -20).attr('stroke', '#d54545').attr('stroke-width', '2px');
            svg.append('text').attr('x', x(25))
                .attr('y', -20)
                .style('fill', '#d54545')
                .text('neutral or dissatisfied')

            svg.append('text').attr('x', x(55))
                .attr('y', -20)
                .style('fill', '#179f5d')
                .text('satisfied')
        }
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
                    <div className={"Dropdown"}>
                        <Dropdown>
                            <Dropdown.Toggle id={"dropdown-basic"} variant="secondary" size={'sm'}>
                                Ref Info: {showAvgLine === true? "On" : "Off"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu variant="dark">
                                <Dropdown.Item onClick={() => setShowAvgLine(true)}>On</Dropdown.Item>
                                <Dropdown.Item onClick={() => setShowAvgLine(false)}>Off</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                </div>
                <div className={'svg-chart'}>
                    <svg ref={svgRef} width={'100%'} height={'100%'} />
                </div>

            </div>
        );
    } else return (<div></div>)



}

