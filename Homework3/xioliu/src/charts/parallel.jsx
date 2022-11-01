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
    let selected = false;
    let lock = false;


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
        let sliced_data = filtered_data.slice(0, 100);

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

        const color = d3.scaleOrdinal().domain(['satisfied', 'dissatisfied']).range(['green', '#d54545'])
        var highlight = function (event, d){
            if (!event.ctrlKey){
                if (!lock) {
                    let selected =  d.satisfaction;
                    if (selected !== 'satisfied'){
                        selected = 'dissatisfied';
                    }

                    d3.selectAll(".line")
                        .transition().duration(200)
                        .style("stroke", "lightgrey")
                        .style("opacity", 0.25)

                    d3.selectAll('.' + selected)
                        .transition().duration(200)
                        .style("stroke", color(selected))
                        .style("opacity", 0.5)
                }
            }

        }


        var unHighlight = function (event, d) {
            console.log("mouse leaving")
            d3.selectAll(".line")
                .transition().duration(100).delay(100)
                .style("stroke", (d) => d['satisfaction'] === 'satisfied' ? 'green' : '#d54545')
                .style("opacity", 0.2)
            selected = false;
            console.log(selected);
        }

        var unHighlightLeave = function (event, d) {
            if (!event.ctrlKey && !selected) {
                console.log("mouse leaving")
                d3.selectAll(".line")
                    .transition().duration(100).delay(100)
                    .style("stroke", (d) => d['satisfaction'] === 'satisfied' ? 'green' : '#d54545')
                    .style("opacity", 0.2)
            }

        }

        const g = svg.append("g");

        g.selectAll("myPath")
            .data(sliced_data)
            .join('path')
            .attr("class", (d) => "line " + d.satisfaction)
            .attr('d', path)
            .style('fill', 'none')
            .style('stroke', (d) => d['satisfaction'] === 'satisfied' ? 'green' : '#d54545' )
            .style("opacity", 0.2)
            .on("mouseover", highlight)
            // .on("mouseleave", unHighlightLeave)



        g.selectAll("myAxis")
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

        function zoomed({transform}){
            g.attr("transform", transform)
        }
        function filter(event) {
            if (event.ctrlKey){
                event.preventDefault();
                event.stopImmediatePropagation();
                var isWheelEvent = event instanceof WheelEvent;
                return !isWheelEvent || (isWheelEvent && event.ctrlKey);
            }

        }
        const zoomBehavior = d3.zoom().scaleExtent([1, 8])
            .translateExtent([[0, 0], [width, height]])
            .on("zoom", zoomed)
            .filter(filter)
        svg.call(zoomBehavior)
        svg.on('dblclick.zoom', null);
        svg.on("dblclick", unHighlightLeave);
        svg.on("click", () => {lock = !lock})


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

                </div>

                <div className={'parallel-container'}>
                    <svg ref={svgRefParallel} width={width} height={height} />
                </div>
            </div>


        )
    }


}
