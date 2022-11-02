import './css/style.scss';
import './css/styles.css'; /* Example of connecting a style-sheet */
import {LineChart, BarChart, CountriesLegend, SmallMultiplesCountry, StackedAreaChart, ParallelCoord} from "./js/vis_code";
import * as d3 from "d3";

// generate legend
CountriesLegend("#legend1")

/////////////// BAR CHART /////////////// 
// generate bar chart with mean by default
BarChart("mean")

d3.select("#button-mean").on("click", () => {
    BarChart("mean")
    console.log("Called Function")
})

d3.select("#button-max").on("click", () => {
    BarChart("max")
    console.log("Called Function")
})

d3.select("#button-min").on("click", () => {
    BarChart("min")
    console.log("Called Function")
})

/////////////// PARALLEL COORDINATES AND SMALL MULTIPLES /////////////// 
// default to parallel coordinates
ParallelCoord()

// if country button is clicked, run the function for country small multiples
d3.select("#small_mult").on("click", () => {
    SmallMultiplesCountry()
})

// if parallel coordinates button is clicked, run the function for parallel coordinates
d3.select("#parallel_coord").on("click", () => {
    ParallelCoord()
})

/////////////// STACKED AREA CHART AND LINE CHART /////////////// 
// generate stacked area chart, default
StackedAreaChart()

d3.select("#area_button").on("click", () => {
    StackedAreaChart()
    d3.select("#country_selectbutton").selectAll("*").remove()
})

// if parallel coordinates button is clicked, run the function for parallel coordinates
d3.select("#line_button").on("click", () => {
    LineChart()
})
