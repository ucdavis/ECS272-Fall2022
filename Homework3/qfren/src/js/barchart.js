import * as d3 from 'd3';

export async function drawBarchart(csvPath, id){
    const rawData = await d3.csv(csvPath);
    let processed_data = {};
    Object.values(rawData).forEach(d => {
        if (d.Type_1 != null && d.Type_1 != undefined && d.Type_1 != ''){
            if (typeof processed_data[d.Type_1] == 'undefined' || processed_data[d.Type_1] == null){
                processed_data[d.Type_1] = 0;
            }
            processed_data[d.Type_1] += 1;
        }
        if (d.Type_2 != null && d.Type_2 != undefined && d.Type_2 != ''){
            if (typeof processed_data[d.Type_2] == 'undefined' || processed_data[d.Type_2] == null){
                processed_data[d.Type_2] = 0;
            }
            processed_data[d.Type_2] += 1;
        }
    })
    let data = [];
    for (var key in processed_data){
        let item = {}
        item.type = key;
        item.value = processed_data[key];
        data.push(item);
    }

    let width = 1200;
    let height = 600;
    let margin = ({top: 20, right: 0, bottom: 30, left: 40});

    let x = d3.scaleBand()
        .domain(data.map(d => d.type))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    let y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice()
    .range([height - margin.bottom, margin.top]);

    let xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

    let yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())

    function zoom(svg) {
        const extent = [[margin.left, margin.top], [width - margin.right, height - margin.top]];
      
        svg.call(d3.zoom()
            .scaleExtent([1, 8])
            .translateExtent(extent)
            .extent(extent)
            .on("zoom", zoomed));
      
        function zoomed(event) {
          x.range([margin.left, width - margin.right].map(d => event.transform.applyX(d)));
          svg.selectAll(".bars rect").attr("x", d => x(d.type)).attr("width", x.bandwidth());
          svg.selectAll(".x-axis").call(xAxis);
        }
    }

    const svg = d3.select(id).append("svg")
        .attr("viewBox", [0, 0, width, height])
        .call(zoom);
      
    svg.append("g")
            .attr("class", "bars")
            .attr("fill", "steelblue")
        .selectAll("rect")
        .data(data)
        .join("rect")
            .attr("x", d => x(d.type))
            .attr("y", d => y(d.value))
            .attr("height", d => y(0) - y(d.value))
            .attr("width", x.bandwidth());
      
    svg.append("g")
        .attr("class", "x-axis")
        .call(xAxis);
      
    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis);
}