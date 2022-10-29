import './css/style.scss';
import './css/styles.css'; /* Example of connecting a style-sheet */
import * as d3 from "d3";
import histoData from "./assets/data/comediesPerYearNew.json"
import { drawHisto, smallHisto } from "./js/histogram2HW3"
import radarData from "./assets/data/countOtherGenresOut.json"
import { drawRadarChart } from "./js/radar"
import { drawBoxFromCsvAsync } from "./js/boxPlotFocus"

console.log(histoData);
drawHisto(histoData["data"], "#histo");
console.log("small histo", smallHisto)

console.log(radarData)
drawRadarChart("#radar", [radarData[0]], 'undefined');


drawBoxFromCsvAsync()

d3.selectAll(("#reset")).on("click", function () {
    if (smallHisto === 1) {
        var state = this.value
        console.log(state)
        d3.selectAll("#releaseYear").remove();
        d3.selectAll("#yearCount").remove();
        d3.selectAll("#newRect")
            .transition().duration(2000)
            .attr("x", 2300)
        d3.selectAll("#zoomHisto").transition().delay(700).ease(d3.easeLinear).remove();
        drawHisto(histoData["data"], "#histo");
    }
    else {
        console.log("Small Histo Has Not Been Plotted")
    }
})