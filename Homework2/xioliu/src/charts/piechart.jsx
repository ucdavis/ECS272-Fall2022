import React from "react";
import * as d3 from "d3";
import './piechart.css'
import Dropdown from "react-bootstrap/Dropdown";

export default function Piechart({data}) {
    const svgRef = React.useRef(null);
    const width = 300;
    const height = 300;
    const margin = 10;
    const [selection, setSelection] = React.useState('All');

    function processData(data) {
        let dist = {Loyal: 0, Disloyal: 0};

        for (let d in data) {
            let row = data[d];
            if (selection !== 'All') {
                if (row['Gender'] !== selection) {
                    continue;
                }
            }

            if (row['Customer Type'] === 'Loyal Customer') {
                dist.Loyal += 1;
            } else {
                dist.Disloyal += 1;
            }
        }
        return dist
    }

    function plotPieChart(){
        let dist = processData(data);
        // console.log(dist)
        let radius = Math.min(width, height) / 2 - margin

        d3.select(svgRef.current).selectAll('path').remove();
        d3.select(svgRef.current).selectAll('text').remove();


        const svg = d3.select(svgRef.current).append('g')
            .attr("transform", "translate(" + (width  / 2 + 40) + "," + (height / 2 + 20) + ")");;
        let color = d3.scaleOrdinal()
            .range(d3.schemeSet2);

        let legendColor = {Loyal: '#008F8C', Disloyal: '#F24405'}
        // console.log(legendColor)

        let pie = d3.pie()
            .value((d) => d[1]);

        let data_ready = pie(Object.entries(dist));
        // console.log(data_ready)

        const arcGenerator = d3.arc()
            .innerRadius(20)
            .outerRadius(radius)

        svg
            .selectAll('mySlices')
            .data(data_ready)
            .join('path')
            .attr('d', arcGenerator)
            .attr('fill', function(d){ return(legendColor[d.data[0]]) })
            .attr("stroke", "black")
            .attr('x', width / 2)
            .attr('y', height / 2)
            .style("stroke-width", "2px")
            .style("opacity", 0.7)

        svg
            .selectAll('mySlices')
            .data(data_ready)
            .join('text')
            .text(function(d){ return d.data[0] + ':' + d.data[1]})
            .attr("transform", function(d) { return `translate(${arcGenerator.centroid(d)})`})
            .style("text-anchor", "middle")
            .style("font-size", 14)

        svg.append('circle')
            .attr("cx", width - 80)
            .attr("cy", 80)
            .attr('r', 6)
            .style('fill', legendColor.Loyal)
        svg.append('text')
            .attr('x', width - 65)
            .attr('y', 83)
            .attr('text-anchor', 'start')
            .text('Loyal')

        svg.append('circle')
            .attr("cx", width - 80)
            .attr("cy", 100)
            .attr('r', 6)
            .style('fill', legendColor.Disloyal)
        svg.append('text')
            .attr('x', width - 65)
            .attr('y', 103)
            .attr('text-anchor', 'start')
            .text('DisLoyal')
    }

    React.useEffect(() => {
        if (data !== null){
            plotPieChart();
        }
    }, [data, selection])

    if (data === null) {
        return(<div></div>)
    } else {
        return (
            <div className={'container'}>
                Customer Proportion
                <div className={"DropdownP"}>
                    <Dropdown>
                        <Dropdown.Toggle id={"dropdown-basic"} variant="secondary" size={'sm'}>
                            {selection}
                        </Dropdown.Toggle>

                        <Dropdown.Menu variant="dark">
                            <Dropdown.Item onClick={() => setSelection('All')}>All</Dropdown.Item>
                            <Dropdown.Item onClick={() => setSelection('Male')}>Male</Dropdown.Item>
                            <Dropdown.Item onClick={() => setSelection('Female')}>Female</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <div className={'pie-container'}>
                    <svg ref={svgRef} width={'100%'} height={'100%'} />
                </div>
            </div>


        )
    }


}
