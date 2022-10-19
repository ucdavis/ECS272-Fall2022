import * as d3 from "d3";
import csvPath from '../assets/data/test.csv';


// function drawBarFromCsv(){
//     //async method
//     d3.csv(csvPath).then((data) => {
//         // array of objects
//         console.log(data.length);
//         console.log(data);
//         // do something with the data (e.g process and render chart)
//         //  const pData = processData();
//         //  drawBarChart(pData, id);
//         //(data will only exist inside here since it is an async call to read in data) so all rendering and processsing with data has to occur inside the "then"
//     });
// }
// /* 
//     Same as the one above but we made the function itself asynch so we can use await
//     The two do the same thing essentially but it is cleaner to read
// */
// export async function drawBarFromCsvAsync(){
//     const data = await d3.csv(csvPath);
//     console.log(data); 
//     //process data()
//     //draw chart ()
//     //There will be some delay in console before it prints the array
// }

export async function getRating() {
    const data = await d3.csv(csvPath);

    var eco = {"onboard" : 0, "food" : 0, "seat": 0, "entertainment" : 0, "checkin": 0, "cleanliness" : 0};
    var ecoCount = 0;
    var ecoPlus = {"onboard" : 0, "food" : 0, "seat": 0, "entertainment" : 0, "checkin": 0, "cleanliness" : 0};
    var ecoPlusCount = 0;
    var business = {"onboard" : 0, "food" : 0, "seat": 0, "entertainment" : 0, "checkin": 0, "cleanliness" : 0};
    var businessCount = 0;
    data.forEach(d => {
        if(d["Class"] == "Eco"){
            ecoCount += 1;
            eco["onboard"] += parseInt(d["On-board service"]);
            eco["food"] += parseInt(d["Food and drink"]);
            eco["seat"] += parseInt(d["Seat comfort"]);
            eco["entertainment"] += parseInt(d["Inflight entertainment"]);
            eco["checkin"] += parseInt(d["Checkin service"]);
            eco["cleanliness"] += parseInt(d["Cleanliness"]);
        } else if(d["Class"] == "Eco Plus"){
            ecoPlusCount += 1;
            ecoPlus["onboard"] += parseInt(d["On-board service"]);
            ecoPlus["food"] += parseInt(d["Food and drink"]);
            ecoPlus["seat"] += parseInt(d["Seat comfort"]);
            ecoPlus["entertainment"] += parseInt(d["Inflight entertainment"]);
            ecoPlus["checkin"] += parseInt(d["Checkin service"]);
            ecoPlus["cleanliness"] += parseInt(d["Cleanliness"]);
        } else if(d["Class"] == "Business"){
            businessCount += 1;
            business["onboard"] += parseInt(d["On-board service"]);
            business["food"] += parseInt(d["Food and drink"]);
            business["seat"] += parseInt(d["Seat comfort"]);
            business["entertainment"] += parseInt(d["Inflight entertainment"]);
            business["checkin"] += parseInt(d["Checkin service"]);
            business["cleanliness"] += parseInt(d["Cleanliness"]);
        }
    })
    for(var key in eco){
        eco[key] = eco[key] / ecoCount;
    }
    for(var key in ecoPlus){
        ecoPlus[key] = ecoPlus[key] / ecoPlusCount;
    }
    for(var key in business){
        business[key] = business[key] / businessCount;
    }

    drawRadar({"Eco":eco, "Eco Plus": ecoPlus, "Business": business}, "#radar")
    
}

export function drawRadar(data, id){

        let features = ["onboard","food","seat","entertainment","checkin","cleanliness"];



        let svg = d3.select(id).append("svg")
        .attr("width", 600)
        .attr("height", 600);

        let radialScale = d3.scaleLinear()
        .domain([0,5])
        .range([0,150]);
        let ticks = [1,2,3,4,5];

        ticks.forEach(t =>
        svg.append("circle")
        // .attr("cx", 300)
        // .attr("cy", 300)
        .attr("cx", 250)
        .attr("cy", 200)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("r", radialScale(t)));

        
        ticks.forEach(t =>
        svg.append("text")
        // .attr("x", 305)
        // .attr("y", 300 - radialScale(t))
        .attr("x", 255)
        .attr("y", 200 - radialScale(t))
        .text(t.toString())
        );

        function angleToCoordinate(angle, value){
            let x = Math.cos(angle) * radialScale(value);
            let y = Math.sin(angle) * radialScale(value);
            // return {"x": 300 + x, "y": 300 - y};
            return {"x": 250 + x, "y": 200 - y};
        }

        for (var i = 0; i < features.length; i++) {
            let ft_name = features[i];
            let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
            let line_coordinate = angleToCoordinate(angle, 5);
            let label_coordinate = angleToCoordinate(angle, 5.6);



            //draw axis line
            svg.append("line")
            // .attr("x1", 300)
            // .attr("y1", 300)
            .attr("x1", 250)
            .attr("y1", 200)
            .attr("x2", line_coordinate.x)
            .attr("y2", line_coordinate.y)
            .attr("stroke","black");

            //draw axis label
            svg.append("text")
            .attr("x", label_coordinate.x)
            .attr("y", label_coordinate.y)
            .text(ft_name);
        }

        let line = d3.line()
        .x(d => d.x)
        .y(d => d.y);
        let colors = {"Eco": "navy", "Eco Plus": "darkorange", "Business": "gray"};

        function getPathCoordinates(data_point){
            let coordinates = [];
            for (var i = 0; i < features.length; i++){
                let ft_name = features[i];
                let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
                coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
            }
            return coordinates;
        }

        
        let d = data["Eco"];
        let color = colors["Eco"];
        let coordinates = getPathCoordinates(d);

        //draw the path element
        svg.append("path")
        .datum(coordinates)
        .attr("d",line)
        .attr("stroke-width", 3)
        .attr("stroke", color)
        .attr("fill", color)
        .attr("stroke-opacity", 1)
        .attr("opacity", 0.5);

        // svg.append("g").append("circle").attr("cx",100).attr("cy",130).attr("r", 6).style("fill", color)
        // svg.append("g").append("text").attr("x", 120).attr("y", 130).text("Eco").style("font-size", "15px").attr("alignment-baseline","middle")

        svg.append("g").append("circle").attr("cx",10).attr("cy",80).attr("r", 6).style("fill", color)
        svg.append("g").append("text").attr("x", 30).attr("y", 80).text("Eco").style("font-size", "15px").attr("alignment-baseline","middle")

        function update_radar(selectedGroup) {
            d3.select("#radar").selectAll("path").remove()
            d3.select("#radar").selectAll("g").selectAll("circle").remove() 
            d3.select("#radar").selectAll("g").selectAll("text").remove()

            if(selectedGroup == "All"){
                // let y = 130
                let y = 80
                for(var key in data){
                    let d = data[key];
                    let color = colors[key];
                    let coordinates = getPathCoordinates(d);
 
                    svg.append("path")
                    .datum(coordinates)
                    .attr("d",line)
                    .attr("stroke-width", 3)
                    .attr("stroke", color)
                    .attr("fill", color)
                    .attr("stroke-opacity", 1)
                    .attr("opacity", 0.5);

                    // svg.append("g").append("circle").attr("cx",100).attr("cy",y).attr("r", 6).style("fill", color)
                    // svg.append("g").append("text").attr("x", 120).attr("y", y).text(key).style("font-size", "15px").attr("alignment-baseline","middle")
                    svg.append("g").append("circle").attr("cx",10).attr("cy",y).attr("r", 6).style("fill", color)
                    svg.append("g").append("text").attr("x", 30).attr("y", y).text(key).style("font-size", "15px").attr("alignment-baseline","middle")
                    y += 30
                }
            } else{
                var dataFilter = data[selectedGroup]
                let color = colors[selectedGroup];
                let coordinates = getPathCoordinates(dataFilter);

                svg.append("path").datum(coordinates)
                .transition()
                .duration(300)
                .attr("d",line)
                .attr("stroke-width", 3)
                .attr("stroke", color)
                .attr("fill", color)
                .attr("stroke-opacity", 1)
                .attr("opacity", 0.5);

                // svg.append("g").append("circle").attr("cx",100).attr("cy",130).attr("r", 6).style("fill", color)
                // svg.append("g").append("text").attr("x", 120).attr("y", 130).text(selectedGroup).style("font-size", "15px").attr("alignment-baseline","middle")

                svg.append("g").append("circle").attr("cx",10).attr("cy",80).attr("r", 6).style("fill", color)
                svg.append("g").append("text").attr("x", 30).attr("y", 80).text("Eco").style("font-size", "15px").attr("alignment-baseline","middle")
            }

        }

        d3.select("#bar_dropdown").on("change",function(d){
            var selected = d3.select("#bar_dropdown").node().value;
            update_radar(selected)
        })
        
}


// export function drawBarChart(data, id) {

//     const margin = { top: 40, right: 40, bottom: 120, left: 100 };
//     const height = 300;
//     const width = 500;

//     const x = d3.scaleBand().domain(data.map(d => d.y))
//         .rangeRound([margin.left, width - margin.right])
//         .padding(0.1);

//     const y = d3.scaleLinear().domain([0, d3.max(data, d => d.x)]).nice()
//         .rangeRound([height - margin.bottom, margin.top]);

//     let svg = d3.select(id).append("svg")
//         .attr("viewBox", [0, 0, width, height])
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom);

//     svg.selectAll("rect")
//         .data(data)
//         .join("rect")
//         .attr("x", d => x(d.y))
//         .attr("y", d => y(d.x))
//         .attr("width", x.bandwidth())
//         .attr("height", d => y(0) - y(d.x))
//         .attr("fill", "green");

//     const xAxis = g => g
//         .attr("transform", `translate(0,${height - margin.bottom})`)
//         .call(d3.axisBottom(x))

//     const yAxis = g => g
//         .attr("transform", `translate(${margin.left},0)`)
//         .call(d3.axisLeft(y))

//     svg.append("g")
//         .attr("class", "x axis")
//         .attr("transform", "translate(0," + height + ")")
//         .call(xAxis)
//         .selectAll("text")
//         .style("text-anchor", "end")
//         .attr("dx", "-.8em")
//         .attr("dy", ".15em")
//         .attr("transform", "rotate(-65)")
//         .attr("font-weight", "bold");

//     svg.append("g")
//         .call(yAxis)
//         .call(g => g.select(".tick:last-of-type text")
//                 .clone()
//                 .attr("transform", `rotate(-90)`)
//                 .attr("text-anchor", "middle")
//                 .attr("x", -(15 - margin.top - margin.bottom) / 2)
//                 .attr("y", -80)
//                 .attr("font-weight", "bold"))
// }


