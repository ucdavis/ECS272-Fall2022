import './css/style.scss';
import './css/styles.css'; /* Example of connecting a style-sheet */
import {LineChart, BarChart, CountriesLegend, SmallMultiplesCountry, SmallMultiplesRegion} from "./js/vis_code"; /* Example of importing one function from a js file for multiple {f(x), f(y), f(z)}*/
import * as d3 from "d3";

// generate line chart
LineChart("#selectbutton")

// generate legend for countries
CountriesLegend("#legend1")

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

// default to countries small multiples
SmallMultiplesCountry()

// if country button is clicked, run the function for country small multiples
d3.select("#button-country").on("click", () => {
    SmallMultiplesCountry()
})

// if region button is clicked, run the function for region small multiples
d3.select("#button-region").on("click", () => {
    SmallMultiplesRegion()
})
