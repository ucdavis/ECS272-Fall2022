import * as d3 from 'd3';

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/splom
export async function drawScatterplotMatrix(csvPath, {
    columns = data.columns, // array of column names, or accessor functions
    x = columns, // array of x-accessors
    y = columns, // array of y-accessors
    z = () => 1, // given d in data, returns the (categorical) z-value
    padding = 30, // separation between adjacent cells, in pixels
    marginTop = 30, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 30, // left margin, in pixels
    width = 2400, // outer width, in pixels
    height = width, // outer height, in pixels
    xType = d3.scaleLinear, // the x-scale type
    yType = d3.scaleLinear, // the y-scale type
    zDomain, // array of z-values
    fillOpacity = 0.7, // opacity of the dots
    colors = d3.schemeCategory10, // array of colors for z
    id,
  } = {}) {
    // Compute values (and promote column names to accessors)
    const data = await d3.csv(csvPath);

    // Compute values (and promote column names to accessors).
    const X = d3.map(x, x => d3.map(data, d => parseInt(d[x])));
    const Y = d3.map(y, y => d3.map(data, d => parseInt(d[y])));
    const Z = d3.map(data, z);
  
    // Compute default z-domain, and unique the z-domain.
    if (zDomain === undefined) zDomain = Z;
    zDomain = new d3.InternSet(zDomain);
  
    // Omit any data not present in the z-domain.
    const I = d3.range(Z.length).filter(i => zDomain.has(Z[i]));
  
    // Compute the inner dimensions of the cells.
    const cellWidth = (width - marginLeft - marginRight - (X.length - 1) * padding) / X.length;
    const cellHeight = (height - marginTop - marginBottom - (Y.length - 1) * padding) / Y.length;

    // Construct scales and axes.
    const xScales = X.map(X => xType(d3.extent(X), [0, cellWidth]));
    const yScales = Y.map(Y => yType(d3.extent(Y), [cellHeight, 0]));
    const zScale = d3.scaleOrdinal(zDomain, colors);
    const xAxis = d3.axisBottom().ticks(cellWidth / 50);
    const yAxis = d3.axisLeft().ticks(cellHeight / 50);
  
    const svg = d3.select(id).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-marginLeft, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
    svg.append("g")
      .selectAll("g")
      .data(yScales)
      .join("g")
        .attr("transform", (d, i) => `translate(0,${i * (cellHeight + padding)})`)
        .each(function(yScale) { return d3.select(this).call(yAxis.scale(yScale)); })
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1));
  
    svg.append("g")
      .selectAll("g")
      .data(xScales)
      .join("g")
        .attr("transform", (d, i) => `translate(${i * (cellWidth + padding)},${height - marginBottom - marginTop})`)
        .each(function(xScale) { return d3.select(this).call(xAxis.scale(xScale)); })
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("y2", -height + marginTop + marginBottom)
            .attr("stroke-opacity", 0.1))
  
    const cell = svg.append("g")
      .selectAll("g")
      .data(d3.cross(d3.range(X.length), d3.range(Y.length)))
      .join("g")
        .attr("fill-opacity", fillOpacity)
        .attr("transform", ([i, j]) => `translate(${i * (cellWidth + padding)},${j * (cellHeight + padding)})`);
  
    cell.append("rect")
        .attr("fill", "none")
        .attr("stroke", "currentColor")
        .attr("width", cellWidth)
        .attr("height", cellHeight);
  
    cell.each(function([x, y]) {
      d3.select(this).selectAll("circle")
        .data(I.filter(i => !isNaN(X[x][i]) && !isNaN(Y[y][i])))
        .join("circle")
            .attr("cx", i => xScales[x](X[x][i]))
            .attr("cy", i => yScales[y](Y[y][i]));
    });

    var circle = cell.selectAll("circle")
        .attr("r", 3.5)
        .attr("fill-opacity", 0.7)
        .attr("fill", i => zScale(Z[i]));

    let size = (width - (columns.length + 1) * padding) / columns.length + padding;

    function brush(cell, circle, svg) {
        const brush = d3.brush()
            .extent([[padding / 2, padding / 2], [size - padding / 2, size - padding / 2]])
            .on("start", brushstarted)
            .on("brush", brushed)
            .on("end", brushended);
      
        cell.call(brush);
      
        let brushCell;
      
        // Clear the previously-active brush, if any.
        function brushstarted() {
          if (brushCell !== this) {
            d3.select(brushCell).call(brush.move, null);
            brushCell = this;
          }
        }

        let x = columns.map(c => d3.scaleLinear()
            .domain(d3.extent(data, d => parseFloat(d[c])))
            .rangeRound([padding / 2, size - padding / 2]));

        let y = x.map(x => x.copy().range([size - padding / 2, padding / 2]));

        // Highlight the selected circles.
        function brushed({selection}, [i, j]) {
          let selected = [];
          if (selection) {
            const [[x0, y0], [x1, y1]] = selection; 
            circle.classed("hidden",
              d => x0 > x[i](d[columns[i]])
                || x1 < x[i](d[columns[i]])
                || y0 > y[j](d[columns[j]])
                || y1 < y[j](d[columns[j]]));
            selected = data.filter(
              d => x0 < x[i](d[columns[i]])
                && x1 > x[i](d[columns[i]])
                && y0 < y[j](d[columns[j]])
                && y1 > y[j](d[columns[j]]));
          }
          svg.property("value", selected).dispatch("input");
        }
      
        // If the brush is empty, select all circles.
        function brushended({selection}) {
          if (selection) return;
          svg.property("value", []).dispatch("input");
          circle.classed("hidden", false);
        }
      }

    cell.call(brush, circle, svg);
    var chart = Object.assign(svg.node(), {scales: {color: zScale}});
    Legend(chart.scales.color, {id: '#legend1'})
}

function Legend(color, {
    title,
    tickSize = 6,
    width = 1200, 
    height = 44 + tickSize,
    marginTop = 0,
    marginRight = 0,
    marginBottom = 16 + tickSize,
    marginLeft = 0,
    ticks = width / 64,
    tickFormat,
    tickValues,
    id
  } = {}) {
  
    function ramp(color, n = 256) {
      const canvas = document.createElement("canvas");
      canvas.width = n;
      canvas.height = 1;
      const context = canvas.getContext("2d");
      for (let i = 0; i < n; ++i) {
        context.fillStyle = color(i / (n - 1));
        context.fillRect(i, 0, 1, 1);
      }
      return canvas;
    }
  
    const svg = d3.select(id).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .style("overflow", "visible")
        .style("display", "block");
  
    let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
    let x;
  
    // Continuous
    if (color.interpolate) {
      const n = Math.min(color.domain().length, color.range().length);
  
      x = color.copy().rangeRound(d3.quantize(d3.interpolate(marginLeft, width - marginRight), n));
  
      svg.append("image")
          .attr("x", marginLeft)
          .attr("y", marginTop)
          .attr("width", width - marginLeft - marginRight)
          .attr("height", height - marginTop - marginBottom)
          .attr("preserveAspectRatio", "none")
          .attr("xlink:href", ramp(color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL());
    }
  
    // Sequential
    else if (color.interpolator) {
      x = Object.assign(color.copy()
          .interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
          {range() { return [marginLeft, width - marginRight]; }});
  
      svg.append("image")
          .attr("x", marginLeft)
          .attr("y", marginTop)
          .attr("width", width - marginLeft - marginRight)
          .attr("height", height - marginTop - marginBottom)
          .attr("preserveAspectRatio", "none")
          .attr("xlink:href", ramp(color.interpolator()).toDataURL());
  
      // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
      if (!x.ticks) {
        if (tickValues === undefined) {
          const n = Math.round(ticks + 1);
          tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
        }
        if (typeof tickFormat !== "function") {
          tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
        }
      }
    }
  
    // Threshold
    else if (color.invertExtent) {
      const thresholds
          = color.thresholds ? color.thresholds() // scaleQuantize
          : color.quantiles ? color.quantiles() // scaleQuantile
          : color.domain(); // scaleThreshold
  
      const thresholdFormat
          = tickFormat === undefined ? d => d
          : typeof tickFormat === "string" ? d3.format(tickFormat)
          : tickFormat;
  
      x = d3.scaleLinear()
          .domain([-1, color.range().length - 1])
          .rangeRound([marginLeft, width - marginRight]);
  
      svg.append("g")
        .selectAll("rect")
        .data(color.range())
        .join("rect")
          .attr("x", (d, i) => x(i - 1))
          .attr("y", marginTop)
          .attr("width", (d, i) => x(i) - x(i - 1))
          .attr("height", height - marginTop - marginBottom)
          .attr("fill", d => d);
  
      tickValues = d3.range(thresholds.length);
      tickFormat = i => thresholdFormat(thresholds[i], i);
    }
  
    // Ordinal
    else {
      x = d3.scaleBand()
          .domain(color.domain())
          .rangeRound([marginLeft, width - marginRight]);
  
      svg.append("g")
        .selectAll("rect")
        .data(color.domain())
        .join("rect")
          .attr("x", x)
          .attr("y", marginTop)
          .attr("width", Math.max(0, x.bandwidth() - 1))
          .attr("height", height - marginTop - marginBottom)
          .attr("fill", color);
  
      tickAdjust = () => {};
    }
  
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x)
          .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
          .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
          .tickSize(tickSize)
          .tickValues(tickValues))
        .call(tickAdjust)
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
          .attr("x", marginLeft)
          .attr("y", marginTop + marginBottom - height - 6)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .attr("class", "title")
          .text(title));
  
    return svg.node();
}