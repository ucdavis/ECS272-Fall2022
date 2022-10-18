import './css/style.scss';
import './css/styles.css'; /* Example of connecting a style-sheet */
import * as d3 from "d3";
import histoData from "./assets/data/comediesPerYear.json"
import { drawHisto } from "./js/histogram"
import radarData from "./assets/data/countOtherGenresOut.json"
import { drawRadarChart } from "./js/radar"
import { drawBoxFromCsvAsync } from "./js/boxPlotFocus"

console.log(histoData);
drawHisto(histoData["data"], "#histo");

console.log(radarData)
drawRadarChart("#radar",[radarData[0]], 'undefined');


drawBoxFromCsvAsync()
