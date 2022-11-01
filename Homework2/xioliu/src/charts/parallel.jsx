import React from "react";
import * as d3 from "d3";
import Dropdown from "react-bootstrap/Dropdown";
import './parallel.css'

export default function Parallel({data}) {
    const svgRefParallel = React.useRef(null);
    const width = 1000;
    const height = 270;
    const margin = {top: 30, right: 30, bottom: 50, left: 80};
    const chartHeight = height - margin.top - margin.bottom;
    const charWidth = width - margin.left - margin.right;
    const [satisfaction, setSatisfaction] = React.useState('all');


    function plotParallel() {
        let keys = ['Baggage handling',  'Checkin service', 'Cleanliness', 'Departure/Arrival time convenient',
            'Ease of Online booking', 'Food and drink', 'Gate location', 'Inflight entertainment', 'Inflight service',
            'Inflight wifi service', 'Leg room service', 'On-board service', 'Online boarding', 'Seat comfort'];

        // d3.select(svgRef.current).selectAll('path').remove();
        // d3.select(svgRef.current).selectAll('text').remove();
        let filtered_data = Array();
        for (let d in data) {
            if (satisfaction!== 'all'){
                if (data[d]['satisfaction'] !== satisfaction){
                    continue;
                }
                filtered_data.push(data[d]);
            } else {
                filtered_data.push(data[d]);
            }
        }
        let sliced_data = filtered_data.slice(0, 1000);

        d3.select(svgRefParallel.current).selectAll('path').remove();
        const svg = d3.select(svgRefParallel.current).append('g')
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const y = {};
        for (let i in keys) {
            let key = keys[i];
            y[key] = d3.scaleLinear().domain(d3.extent(sliced_data.map((d) => d[key]))).range([chartHeight, 0])
        }

        const x = d3.scalePoint().domain(keys).range([0, charWidth]).padding(1);

        function path(d) {
            return d3.line()(keys.map((p) => [x(p), y[p](d[p])]));
        }

        svg.selectAll("myPath")
            .data(sliced_data)
            .join('path')
            .attr('d', path)
            .style('fill', 'none')
            .style('stroke', (d) => d['satisfaction'] === 'satisfied' ? 'green' : '#d54545' )
            .style("opacity", 0.016)

        svg.selectAll("myAxis")
            .data(keys).enter()
            .append('g')
            .attr('transform', (d) => `translate(${x(d)}, 0)`)
            .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })  //d3.select(this).call(d3.axisLeft(y[d])
            .append('text')
            .style('text-anchor', 'end')
            .attr('y', chartHeight)
            .attr('x', -30)
            .attr('transform', 'rotate(-20)')
            .text((d) => d)
            .style('fill', 'black')
            .style("font-size", 9)

        svg.append('circle')
            .attr("cx", 280)
            .attr("cy", -18)
            .attr('r', 6)
            .style('fill', '#179f5d')
        svg.append('text')
            .attr('x', 300)
            .attr('y', -15)
            .attr('text-anchor', 'start')
            .text('satisfied')

        svg.append('circle')
            .attr("cx", 400)
            .attr("cy", -18)
            .attr('r', 6)
            .style('fill', '#d54545')
        svg.append('text')
            .attr('x', 420)
            .attr('y', -15)
            .attr('text-anchor', 'start')
            .text('neutral or dissatisfied')


    }

    React.useEffect(() => {
        if (data !== null){
            plotParallel();
        }
    }, [data, satisfaction])

    if (data === null) {
        return(<div></div>)
    } else {
        return (
            <div className={'p-container'}>
                <div className={'parallel-header'}>
                    <div className={'header-text'}>
                        User Detailed Scores
                    </div>
                    <div className={"parallel-dropdown"}>
                        <Dropdown>
                            <Dropdown.Toggle id={"dropdown-basic"} variant="secondary" size={'sm'}>
                                {satisfaction}
                            </Dropdown.Toggle>

                            <Dropdown.Menu variant="dark">
                                <Dropdown.Item onClick={() => setSatisfaction('all')}>All</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSatisfaction('satisfied')}>Satisfied</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSatisfaction('neutral or dissatisfied')}>Neutral or dissatisfied</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                </div>

                <div className={'parallel-container'}>
                    <svg ref={svgRefParallel} width={width} height={height} />
                </div>
            </div>


        )
    }


}
