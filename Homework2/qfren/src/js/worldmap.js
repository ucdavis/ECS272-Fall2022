import world from "../assets/data/countries-50m.json"
import * as d3 from "d3";
import * as topojson from "topojson";
import csvPath from "../assets/data/CO2_emission.csv"

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/choropleth
function Choropleth(data, {
    id = d => d.id, // given d in data, returns the feature id
    value = () => undefined, // given d in data, returns the quantitative value
    title, // given a feature f and possibly a datum d, returns the hover text
    format, // optional format specifier for the title
    scale = d3.scaleSequential, // type of color scale
    domain, // [min, max] values; input of color scale
    range = d3.interpolateBlues, // output of color scale
    width = 640, // outer width, in pixels
    height, // outer height, in pixels
    projection, // a D3 projection; null for pre-projected geometry
    features, // a GeoJSON feature collection
    featureId = d => d.id, // given a feature, returns its id
    borders, // a GeoJSON object for stroking borders
    outline = projection && projection.rotate ? {type: "Sphere"} : null, // a GeoJSON object for the background
    unknown = "#ccc", // fill color for missing data
    fill = "white", // fill color for outline
    stroke = "white", // stroke color for borders
    strokeLinecap = "round", // stroke line cap for borders
    strokeLinejoin = "round", // stroke line join for borders
    strokeWidth, // stroke width for borders
    strokeOpacity, // stroke opacity for borders
    htmlid,
  } = {}) {
    // Compute values.
    const N = d3.map(data, id);
    const V = d3.map(data, value).map(d => d == null ? NaN : +d);
    const Im = new d3.InternMap(N.map((id, i) => [id, i]));
    const If = d3.map(features.features, featureId);
  
    // Compute default domains.
    if (domain === undefined) domain = d3.extent(V);
  
    // Construct scales.
    const color = scale(domain, range);
    if (color.unknown && unknown !== undefined) color.unknown(unknown);
  
    // Compute titles.
    if (title === undefined) {
      format = color.tickFormat(100, format);
      title = (f, i) => `${f.properties.name}\n${format(V[i])}`;
    } else if (title !== null) {
      const T = title;
      const O = d3.map(data, d => d);
      title = (f, i) => T(f, O[i]);
    }
  
    // Compute the default height. If an outline object is specified, scale the projection to fit
    // the width, and then compute the corresponding height.
    if (height === undefined) {
      if (outline === undefined) {
        height = 400;
      } else {
        const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(width, outline)).bounds(outline);
        const dy = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), dy);
        projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
        height = dy;
      }
    }
  
    // Construct a path generator.
    const path = d3.geoPath(projection);
  
    const svg = d3.select(htmlid).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "width: 100%; height: auto; height: intrinsic;");
  
    if (outline != null) svg.append("path")
        .attr("fill", fill)
        .attr("stroke", "currentColor")
        .attr("d", path(outline));
  
    svg.append("g")
      .selectAll("path")
      .data(features.features)
      .join("path")
        .attr("fill", (d, i) => color(V[Im.get(If[i])]))
        .attr("d", path)
      .append("title")
        .text((d, i) => title(d, Im.get(If[i])));
  
    if (borders != null) svg.append("path")
        .attr("pointer-events", "none")
        .attr("fill", "none")
        .attr("stroke", stroke)
        .attr("stroke-linecap", strokeLinecap)
        .attr("stroke-linejoin", strokeLinejoin)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-opacity", strokeOpacity)
        .attr("d", path(borders));
    
    return Object.assign(svg.node(), {scales: {color}});
}

// Copyright 2021, Observable Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/color-legend
function Legend(color, {
    title,
    tickSize = 6,
    width = 320, 
    height = 44 + tickSize,
    marginTop = 18,
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

function null_filter(arr) {
    const res = [];
    arr.forEach(d => {
      let f = 0;
      Object.keys(d).forEach((key) => (d[key] === null)? f = f + 1 : f);
      if (f == 0){
        res.push(d);
      }
    })
    return res
}

export async function drawWorldMap(chartid, legendid){
    d3.csv(csvPath).then((d) => {
        let data = null_filter(d);
        
        let rename = new Map([
            ["Antigua and Barbuda", "Antigua and Barb."],
            ["Bolivia (Plurinational State of)", "Bolivia"],
            ["Bosnia and Herzegovina", "Bosnia and Herz."],
            ["Brunei Darussalam", "Brunei"],
            ["Central African Republic", "Central African Rep."],
            ["Cook Islands", "Cook Is."],
            ["Democratic People's Republic of Korea", "North Korea"],
            ["Democratic Republic of the Congo", "Dem. Rep. Congo"],
            ["Dominican Republic", "Dominican Rep."],
            ["Equatorial Guinea", "Eq. Guinea"],
            ["Iran, Islamic Rep.", "Iran"],
            ["Lao PDR", "Laos"],
            ["Marshall Islands", "Marshall Is."],
            ["Micronesia (Federated States of)", "Micronesia"],
            ["Republic of Korea", "South Korea"],
            ["Republic of Moldova", "Moldova"],
            ["Russian Federation", "Russia"],
            ["Saint Kitts and Nevis", "St. Kitts and Nevis"],
            ["Saint Vincent and the Grenadines", "St. Vin. and Gren."],
            ["Sao Tome and Principe", "São Tomé and Principe"],
            ["Solomon Islands", "Solomon Is."],
            ["South Sudan", "S. Sudan"],
            ["Swaziland", "eSwatini"],
            ["Syrian Arab Republic", "Syria"],
            ["The former Yugoslav Republic of Macedonia", "Macedonia"],
            ["United States", "United States of America"],
            ["United Republic of Tanzania", "Tanzania"],
            ["Venezuela (Bolivarian Republic of)", "Venezuela"],
            ["Viet Nam", "Vietnam"],
            ["Venezuela, RB", "Venezuela"],
            ["Congo, Dem. Rep.", "Dem. Rep. Congo"],
            ["Egypt, Arab Rep.", "Egypt"],
            ["Yemen, Rep.", "Yemen"],
            ["Turkiye", "Turkey"],
            ["Czech Republic", "Czechia"],
            ["North Macedonia", "Macedonia"],
            ["Slovak Republic", "Slovakia"],
            ["Cote d'Ivoire", "Côte d'Ivoire"],
            ["Kyrgyz Republic", "Kyrgyzstan"],
            ["Korea, Rep.", "South Korea"],
            ["Korea, Dem. People's Rep.", "North Korea"]
        ]);

        let start_year = 1990;
        let end_year = 2019;
        const data_for_map = [];
        Object.keys(data).forEach(d => {
            let processed_data = {};
            let cumulative_val = 0;
            for (let i = start_year; i <= end_year; i++){
                cumulative_val = cumulative_val + parseFloat(data[d][i]);
              }
            processed_data.avgVal = cumulative_val / (end_year - start_year + 1);
            processed_data.Region = data[d].Region;
            processed_data.Country = rename.get(data[d]['Country Name']) || data[d]['Country Name'];
            data_for_map.push(processed_data);
        });

        let countries = topojson.feature(world, world.objects.countries);

        const map_chart =  Choropleth(data_for_map, {
            id: d => d.Country, 
            value: d => d.avgVal, 
            range: d3.interpolateYlGnBu,
            features: countries,
            featureId: d => d.properties.name, // i.e., not ISO 3166-1 numeric
            projection: d3.geoEqualEarth(),
            htmlid: chartid
        });

        Legend(map_chart.scales.color, {title: "Average Carbon Dioxide Emission (metric tons per capita)", id: legendid});
    });
}