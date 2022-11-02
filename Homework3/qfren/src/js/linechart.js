import * as d3 from 'd3';

export async function drawLinechart(csvPath, id) {
    const rawData = await d3.csv(csvPath);
    let processed_data = {};
    Object.values(rawData).forEach(d => {
        if (d.Generation != null && d.Generation != undefined && d.Generation != ''){
            if (typeof processed_data[d.Generation] == 'undefined' || processed_data[d.Generation] == null){
                processed_data[d.Generation] = 0;
            }
            processed_data[d.Generation] += 1;
        }
    })
    let data = [];
    for (var key in processed_data){
        let item = {}
        item.gen = key;
        item.value = 0;
        for (let i = 1; i <= key; i++){
            item.value += processed_data[i];
        }
        data.push(item);
    }

    let width = 1200;
    let height = 600;
    let margin = ({top: 20, right: 0, bottom: 30, left: 40});
    let curve = d3.curveLinear;
    let xType = d3.scaleUtc;
    let xRange = [margin.left, width - margin.right];
    let yType = d3.scaleLinear;
    let yRange = [height - margin.bottom, margin.top];
    let color = "currentColor";
    let strokeLinejoin = "round";
    let strokeLinecap = "round";
    let strokeWidth = 1.5;
    let strokeOpacity = 1;

    const X = d3.map(data, d => d.gen);
    const Y = d3.map(data, d => d.value);
    const I = d3.range(X.length);
    const defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
    const D = d3.map(data, defined);
    var yFormat;
  
    // Compute default domains.
    const xDomain = d3.extent(X);
    const yDomain = [0, d3.max(Y)];
  
    // Construct scales and axes.
    const xScale = xType(xDomain, xRange);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);
  
    // Construct a line generator.
    
  
    const svg = d3.select(id).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    /*
        const rect = svg.append('rect')
        .attr("class", "shield_rect")
        .attr("x", margin.left)
        .attr("y", 0)
        .attr("width", width - margin.left - margin.right)
        .attr("height", height - margin.top - margin.bottom)
        .style("fill", "white");
    */

    const line = d3.line()
        .defined(i => D[i])
        .curve(curve)
        .x(i => xScale(X[i]))
        .y(i => yScale(Y[i]));
  
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis);
  
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - margin.left - margin.right)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -margin.left)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text("number ↑"));

    /* 
    rect.transition()
        .duration(4000)
        .attr("x", width - margin.left)
        .remove();
    */
    const reveal = path => path.transition()
        .duration(5000)
        .ease(d3.easeLinear)
        .attrTween("stroke-dasharray", function() {
            const length = this.getTotalLength();
            return d3.interpolate(`0,${length}`, `${length},${length}`);
        })
  
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-linecap", strokeLinecap)
        .attr("stroke-linejoin", strokeLinejoin)
        .attr("stroke-opacity", strokeOpacity)
        .attr("d", line(I))
        .call(reveal);
  }