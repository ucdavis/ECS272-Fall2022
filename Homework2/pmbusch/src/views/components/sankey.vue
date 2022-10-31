<template>
    <div id="sankey"></div>
</template>

<script>
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import dataSankey from "../../assets/data/fire_sankey.json"
import dataSankeyDetail from "../../assets/data/fire_sankey_detail.json"
import dataSankeyDetailYear from "../../assets/data/fire_sankey_detailYear.json"

export default {
  name: 'Sankey',
  data() {
    return {
      /*items: {
       nodes: [
          { node: 0, name: 'node0', id: 'node0', color: 'red' },
          { node: 1, name: 'node1', id: 'node1', color: 'orange' },
          { node: 2, name: 'node2', id: 'node2', color: 'blue' },
          { node: 3, name: 'node3', id: 'node3', color: 'green' },
          { node: 4, name: 'node4', id: 'node4', color: 'brown' },
        ],
        links: [
          { source: 'node0', target: 'node2', value: 1, color: 'red' },
          { source: 'node1', target: 'node2', value: 2, color: 'orange' },
          { source: 'node1', target: 'node3', value: 2, color: 'orange' },
          { source: 'node0', target: 'node4', value: 3, color: 'red' },
        ],
      },*/
    };
  },
  props:{
    mySankeyData: Array,
  },
  mounted() {
    console.log(dataSankey);
    //let localData = dataSankey['data'];
    let localData=dataSankey["items"];
    let localDataDetail=dataSankeyDetail["items"];
    let localDataDetailYear=dataSankeyDetailYear["items"]; 
    this.drawSankey(localData, "#sankey",localDataDetail,localDataDetailYear) 
    console.log("Data Passed down as a Prop  ", this.mySankeyData)
  },
  methods:{
    drawSankey(data, id, data_detail,data_detail_year) {
        // https://stackblitz.com/edit/vue-unqnbj?file=src%2Fcomponents%2FUI.vue
        // const { items } = this;

        // console.log("Width is "+Element.clientWidth())

        var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 820 - margin.left - margin.right,
        height = 770 - margin.top - margin.bottom;
        
        const nodeWidth = 80;
        const nodeHeight = 60;
        const nodePadding = 10;

        const ENABLE_LINKS_GRADIENTS = false;

        // Color
        const causes = ["Miscellaneous","Lightning","Debris Burning","Campfire/Children/Smoking/Fireworks",
                            "Equipment Use","Arson","Powerline/Railroad/Structure","Missing/Undefined",
                        // season colors
                        "Summer","Fall","Spring","Winter",
                      // years
                      "1992","1993","1994","1995","1996","1997","1998","1999",
                      "2000","2001","2002","2003","2004","2005","2006","2007",
                      "2008","2009","2010","2011","2012","2013","2014","2015"
                      ]
                
        const color = d3.scaleOrdinal()
            .domain(causes)
            .range(["#1b9e77","#e6ab02","#a6761d","#e7298a",
                    "#d95f02","#66a61e","#7570b3","#666666",
                // season
                "#e31a1c","#543005","#78c679","#2b8cbe",
              
                // years - gradient of greens
              // "#f7fcf5","#f1faee","#eaf7e6","#e2f4dd","#d9f0d3","#ceecc8","#c3e7bc","#b6e2b0",
              // "#a9dca3","#9ad696","#8bcf8a","#7bc77e","#6bbf73","#5ab769","#4aad60","#3ca358",
              // "#30994f","#258e47","#1a833e","#0f7836","#076d2e","#026027","#005221","#00441b"
              
              // years: same color so it does not convey more information
              "#076d2e","#076d2e","#076d2e","#076d2e","#076d2e","#076d2e","#076d2e","#076d2e",
              "#076d2e","#076d2e","#076d2e","#076d2e","#076d2e","#076d2e","#076d2e","#076d2e",
              "#076d2e","#076d2e","#076d2e","#076d2e","#076d2e","#076d2e","#076d2e","#076d2e"
              ])   
        // color generator: https://observablehq.com/@d3/color-schemes 
        // (can modify the code to generate 24 discrete categories)


        const svg = d3
        .select(id).append("svg")
        // .select(this.$refs.svg)
        .attr('width',width)
        .attr('height',height)
        .attr('viewBox', [0, 0, width, height ]);

        // height scale
        const h = d3.scaleLinear()
                    .domain([0, d3.max(data.nodes, d => d.value)]).nice()
                    .rangeRound([0, nodeHeight*5.4]); // MAGIC NUMBER TO MAKE EVERYTHING SCALE

       /* const s = sankey()
        .nodeId((d) => d.name)
        .nodeWidth(nodeWidth)
        .nodePadding(nodePadding)
        .extent([
            [1, 1],
            [width, height],
        ])(data); // this line is key, it passes the data from JSON to the render display
*/

                //////////
        // HIGHLIGHT GROUP //
        //////////
        

        // What to do when one group is hovered
        
        var freezeHighlight=false // if click event, then we freeze the current highlight
        const highlight = function(event,d){
          if (!freezeHighlight){// if click then freeze
            // reduce opacity of all groups
            d3.selectAll(".myNode").style("opacity", .1)
            d3.selectAll(".myLink").style("opacity", .1)
            // expect the one that is hovered
            // console.log(d.id)
            let query = document.querySelector('.sankey-'+d.id) // query to get the x position of the node
            // console.log(query.getAttribute('x'))
  
            // opacity 1 for nodes in other columns
            d3.selectAll(".myNode")
            .filter(function() {
              return d3.select(this).attr("x") != query.getAttribute('x'); // filter by single attribute - not in the same column as the selected node
                })
              .style("opacity", 1)
  
            // opacity 1 for the node and links
            d3.select(".sankey-"+d.id).style("opacity", 1)
            d3.selectAll(".sankeyLink-"+d.id).style("opacity", 1)
            d3.selectAll(".sankeyLinkTarget-"+d.id).style("opacity", 1)
  
            // opacity 1 for link with detail
            d3.selectAll(".sankeyLinkDetail-"+d.id).style("opacity", 1)
          } 
          
        }


        // And when it is not hovered anymore
        const noHighlight = function(event,d){
          if (!freezeHighlight){ // if click then freeze
            d3.selectAll(".myNode").style("opacity", 1)
            d3.selectAll(".myLink").style("opacity", 1)
            d3.selectAll(".myDetailLink").style("opacity", 0) // invisible links behind
          }
        }
        
        const mouseClick = function(event,d){
          if (freezeHighlight){
            freezeHighlight=false
          } else {
            freezeHighlight=true
          }
        }
        //////////


        const { nodes, links} = sankey()
        .nodeId((d) => d.name)
        .nodeWidth(nodeWidth)
        .nodePadding(nodePadding)
        .nodeSort((d) => d.node)
        .linkSort((d) => d.index)
        .extent([
            [1, 1],
            [width, height - nodeHeight],
        ])(data); // this line is key, it passes the data from JSON to the render display


        svg
        .append('g')
        .attr('stroke', '#000')
        .attr('stroke-width', '0')
        .selectAll('rect')
        .data(nodes)
        .join('rect')
        .attr("class", function(d) { return "myNode sankey-" + d.id })
        .attr('x', (d) => d.x0)
        .attr('y', (d) => d.y0)
        // .attr('height', (d) => nodeHeight)
        .attr('height', (d) => h(d.value))
        .attr('width', (d) => d.x1 - d.x0)
        .style('fill', (d) => color(d.name))
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)
        .on("click",mouseClick)
        .append('title')
        .text((d) => `${d.name}\n${d.value} thousands acres burned`);

        const link = svg
        .append('g')
        .attr('fill', 'none')
        .attr('stroke-opacity', 0.5)
        .selectAll('g')
        .data(links)
        .join('g');

        if (ENABLE_LINKS_GRADIENTS) {
        const gradient = link
            .append('linearGradient')
            .attr('id', (d) => (d.uid = `${d.source.id}-to-${d.target.id}`))
            .attr('gradientUnits', 'userSpaceOnUse')
            .attr('x1', (d) => d.source.x1)
            .attr('x2', (d) => d.target.x0);

        gradient
            .append('stop')
            .attr('offset', '0%')
            .attr('stop-color', (d) => color(d.source.name));

        gradient
            .append('stop')
            .attr('offset', '100%')
            .attr('stop-color', (d) => color(d.target.name));
        }

        link
        .append('path')
        .attr('d', sankeyLinkHorizontal())
        .attr("class", function(d) { return "myLink sankeyLink-" + d.source.name.replaceAll(" ","-").replaceAll("/","-")})
        // .attr("class", function(d) { return "myLink sankeyLinkTarget-" + d.target.name })
        .attr('stroke', (d) =>
            !ENABLE_LINKS_GRADIENTS ? color(d.source.name) : `url(#${d.uid})`
        )
        // .attr('stroke',(d) => color(d.source.name))
        .attr('stroke-width', (d) => Math.max(1, d.width));


        // USE TWO LINKS TO CHANGE OPACITIY
        link
        .append('path')
        .attr('d', sankeyLinkHorizontal())
        .attr("class", function(d) { return "myLink sankeyLinkTarget-" + d.target.name.replaceAll(" ","-").replaceAll("/","-")})
        // .attr("class", function(d) { return "myLink sankeyLinkTarget-" + d.target.name })
        .attr('stroke', (d) =>
            !ENABLE_LINKS_GRADIENTS ? color(d.source.name) : `url(#${d.uid})`
        )
        // .attr('stroke',(d) => color(d.source.name))
        .attr('stroke-width', (d) => Math.max(1, d.width));


        link
        .append('title')
        .text((d) => `${d.source.name} → ${d.target.name}\n${d.value} thousands acres burned`);

        svg
        .append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 12)
        .selectAll('text')
        .data(nodes)
        .join('text')
        .attr('x', (d) => d.x0 + 8)
        .attr('y', (d) => (d.y1 + d.y0) / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'start')
        .text((d) => d.name)
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight);


        // ADD INVISIBLE LINKS TO SHOW DETAIL FOR CAUSES HISTORY - BASED ON DATA LOCAL DETAIL
        const sankeyDetail=sankey()
          .nodeId((d) => d.name)
          .nodeWidth(nodeWidth)
          .nodePadding(nodePadding)
          .nodeSort((d) => d.node)
          .linkSort((d) => d.index)
          .extent([
              [1, 1],
              [width, height - nodeHeight],
          ])(data_detail);

        const linksDetail=sankeyDetail.links
        
        const linkDetail = svg
          .append('g')
          .attr('fill', 'none')
          .attr('stroke-opacity', 0.5)
          .selectAll('g')
          .data(linksDetail)
          .join('g');

        if (ENABLE_LINKS_GRADIENTS) {
          const gradientDetail = linkDetail
            .append('linearGradient')
            .attr('id', (d) => (d.uid = `${d.source.id}-to-${d.target.id}`))
            .attr('gradientUnits', 'userSpaceOnUse')
            .attr('x1', (d) => d.source.x1)
            .attr('x2', (d) => d.target.x0);

          gradientDetail
            .append('stop')
            .attr('offset', '0%')
            .attr('stop-color', (d) => color(d.source.name));

            gradientDetail
              .append('stop')
              .attr('offset', '100%')
              .attr('stop-color', (d) => color(d.target.name));
        }

        linkDetail
        .append('path')
        .attr('d', sankeyLinkHorizontal())
        .attr("class", function(d) { return "myDetailLink sankeyLinkDetail-" + d.cause.replaceAll(" ","-").replaceAll("/","-")})
        // .attr("class", function(d) { return "myLink sankeyLinkTarget-" + d.target.name })
        .attr('stroke', (d) =>
            !ENABLE_LINKS_GRADIENTS ? color(d.cause) : `url(#${d.uid})`
        )
        // .attr('stroke',(d) => color(d.source.name))
        .attr('stroke-width', (d) => Math.max(1, d.width))
        .style("opacity", 0);

        linkDetail
        .append('title')
        .text((d) => `${d.cause}\n${d.source.name} → ${d.target.name}\n${d.value} thousands acres burned`);

        // ADD INVISIBLE LINKS FOR CAUSE-SEASON
        // ADD INVISIBLE LINKS TO SHOW DETAIL FOR CAUSES HISTORY - BASED ON DATA LOCAL DETAIL
        const sankeyDetailYear=sankey()
          .nodeId((d) => d.name)
          .nodeWidth(nodeWidth)
          .nodePadding(nodePadding)
          .nodeSort((d) => d.node)
          .linkSort((d) => d.index)
          .extent([
              [1, 1],
              [width, height - nodeHeight],
          ])(data_detail_year);

        const linksDetailYear=sankeyDetailYear.links
        
        const linkDetailYear = svg
          .append('g')
          .attr('fill', 'none')
          .attr('stroke-opacity', 0.5)
          .selectAll('g')
          .data(linksDetailYear)
          .join('g');

        if (ENABLE_LINKS_GRADIENTS) {
          const gradientDetail = linkDetailYear
            .append('linearGradient')
            .attr('id', (d) => (d.uid = `${d.source.id}-to-${d.target.id}`))
            .attr('gradientUnits', 'userSpaceOnUse')
            .attr('x1', (d) => d.source.x1)
            .attr('x2', (d) => d.target.x0);

          gradientDetail
            .append('stop')
            .attr('offset', '0%')
            .attr('stop-color', (d) => color(d.source.name));

            gradientDetail
              .append('stop')
              .attr('offset', '100%')
              .attr('stop-color', (d) => color(d.target.name));
        }

        linkDetailYear
        .append('path')
        .attr('d', sankeyLinkHorizontal())
        .attr("class", function(d) { return "myDetailLink sankeyLinkDetail-" + d.year.replaceAll(" ","-").replaceAll("/","-")})
        // .attr("class", function(d) { return "myLink sankeyLinkTarget-" + d.target.name })
        .attr('stroke', (d) =>
            !ENABLE_LINKS_GRADIENTS ? color(d.source.name) : `url(#${d.uid})`
        )
        // .attr('stroke',(d) => color(d.source.name))
        .attr('stroke-width', (d) => Math.max(1, d.width))
        .style("opacity", 0);

        linkDetail
        .append('title')
        .text((d) => `${d.cause}\n${d.source.name} → ${d.target.name}\n${d.value} thousands acres burned`);


        //

    }
  },
};
</script>