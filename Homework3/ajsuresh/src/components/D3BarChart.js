import React from 'react';
import * as d3 from "d3";

export default class D3BarChart extends React.Component {
  constructor(props) {
    super(props);
    this.myReference = React.createRef();
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate() {
    d3.select(this.myReference.current).selectAll('*').remove()
    this.update();
  }

  update() {

  let data = {};
  this.props.label.forEach((element, index) => {
    data[element] = this.props.data[index];
  });

  console.log(data);


  let margin = {top: 20, right: 100, bottom: 30, left: 250};
  let svgWidth = 800, svgHeight = 300;
  let height = svgHeight- margin.top- margin.bottom, width = svgWidth - margin.left - margin.right;
  let sourceNames = [], sourceCount = [];
  
  let x = d3.scaleLinear().rangeRound([0, width]),
      y = d3.scaleBand().rangeRound([0, height]).padding(0.1);
  for(let key in data){
      if(data.hasOwnProperty(key)){
          sourceNames.push(key);
          sourceCount.push(parseInt(data[key]));
      }
  }
  x.domain([0, d3.max(sourceCount, function(d) { return d; })]);
  y.domain(sourceNames);
  
  let svg = d3.select(this.myReference.current).append("svg");
  svg.attr('height', svgHeight)
     .attr('width', svgWidth);
  
  svg = svg.append("g")
           .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  svg.append("g")
      .attr("transform", "translate(0, " + height + ")")
      .call(d3.axisBottom(x))
      ;
  
  svg.append("g")
      .call(d3.axisLeft(y))
      ;
          
  // Create rectangles
  let bars = svg.selectAll('.bar')
      .data(sourceNames)
      .enter()
      .append("g");
  
  bars.append('rect')
      .attr('class', 'bar')
      .attr("x", function(d) { return 0; })
      .attr("y", function(d) { return y(d); })
      .attr("width", function(d){return x(data[d])})
      .attr("height", function(d) { return y.bandwidth(); })
      .attr("fill" , this.props.color);
      
  bars.append("text")
      .text(function(d) { 
          return data[d];
      })
      .attr("x", function(d){
          return x(data[d]) + 15;
      })
      .attr("y", function(d){
          console.log(d);
          return y(d) + y.bandwidth() * (0.5 + 0.1); // here 0.1 is the padding scale
      })
      .attr("font-family" , "sans-serif")
      .attr("font-size" , "16px")
      .attr("fill" , "black")
      .attr("text-anchor", "middle");

      svg.append("circle").attr("cx",480).attr("cy",0).attr("r", 6).style("fill", this.props.color);
      svg.append("text").attr("x", 500).attr("y", 0).text(this.props.year).style("font-size", "15px").attr("alignment-baseline","middle");
  }




  render() {
    return (
      <div ref={this.myReference}>
      </div>//</center>
    );
  }
}