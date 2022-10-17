<template>
    <div id="vis_board">
        <div id="filter_column">
            <div class="filter_row" id="filterRow1">
                <form>
                    <h1 class="filterHeader">Filter Comparison</h1>
                    <select name="input" @change="this.dropDownChanged" id="dataDropdown">
                        <option value="Dis_Vs_Sat">Dissatisfied vs. Satisfied</option>
                        <option value="Di_Vs_Loy">Disloyal vs. Loyal</option>
                    </select>
                </form>
            </div>
            <div class="filter_row" id="legend">
            </div>
            <div class="filter_row" id="filterRow1">
                <h1 class="filterHeader">Color Palette</h1>
                <div id="radio_input">
                    <input type="radio" id="radio_default" name="color_palette" value="default" @change="this.radioChanged" checked>
                    <label for="radio_default">Default</label><br>
                    <input type="radio" id="radio_color_blind" name="color_palette" value="cb_accessible" @change="this.radioChanged">
                    <label for="radio_color_blind">Color Blind Accessible</label><br>
                </div>
            </div>
        </div>
        <div class="column" id="pie_quad">
            <PieChart  ref="pie_component" v-if="dataExists" :myPieChartData="data_" :height="pie_h" :width="pie_w" :dd_option="current_dd_option" :radio_option="current_radio_option"/>
        </div>
        <div class="column">
            <div class="row" id="bar_quad">
                <StackedBar  ref="bar_component" v-if="dataExists" :myStackedBarData="data_" :height="radar_h" :width="radar_w" :dd_option="current_dd_option" :radio_option="current_radio_option"/>
            </div>
            <div class="row" id="radar_quad">
                <RadarPlot  ref="radar_component" v-if="dataExists" :myRadarPlotData="data_" :height="radar_h" :width="radar_w" :dd_option="current_dd_option" :radio_option="current_radio_option"/>
            </div>
        </div>
    </div>
</template>

<script>
import RadarPlot from "../components/radarplot.vue"
import PieChart from "../components/piechart.vue"
import StackedBar from "../components/stackedbar.vue"
import * as d3 from "d3";
import csvPath from '../../assets/data/AirlineSatisfaction.csv';

export default {
    data(){
        return {
            dataExists: false,
            data_: [],
            pie_h : 200,
            pie_w : 200,
            radar_h : 200,
            radar_w : 200,
            current_dd_option : "Dis_Vs_Sat",
            current_radio_option: "default",
            lenged_titles : {"Dis_Vs_Sat" : ["Dissatisfied Respondents", "Satisfied Respondents"],
                                     "Di_Vs_Loy" : ["Disloyal Respondents", "Loyal Respondents"] },
            color : {"default" : ["#999999", "#ef8a62"],
                    "cb_accessible" : ["#67a9cf", "#ef8a62"] },
        }
    },
    components: {
        RadarPlot,
        PieChart,
        StackedBar
    },
    created(){
        /* Fetch via CSV */
        this.drawPlots()
    },
    mounted(){},
    methods: {
        drawPlots(){
            //async method
            d3.csv(csvPath).then((data) => {
                // array of objects
                console.log(data.length);
                console.log(data[0]);
                this.dataExists = true; // updates the v-if to conditionally show the RadarPlot  only if our data is here.
                this.data_ = data; // updates the prop value to be the recieved data, which we hand in to our bar-chart
                this.pie_h = document.getElementById('pie_quad').clientHeight;
                this.pie_w = document.getElementById('pie_quad').clientWidth;

                this.radar_h = document.getElementById('radar_quad').clientHeight;
                this.radar_w = document.getElementById('radar_quad').clientWidth;

                this.drawLegend()
            });
        },
        dropDownChanged() {
            console.log("Drop Down Option Changed");
            let e = document.getElementById("dataDropdown");
            this.current_dd_option = e.value;
            // Needs time to update...
            this.sleep(50).then(() => {
                console.log("Complete");
                this.$refs.pie_component.updatePlot();
                this.$refs.bar_component.updatePlot();
                this.$refs.radar_component.updatePlot();
                d3.selectAll("#legend svg").remove();
                this.drawLegend();
            });
        },
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        drawLegend() {

            let width = document.getElementById("legend").offsetWidth;
            let height = document.getElementById("legend").offsetHeight;
            console.log(height, width);
            let svg = d3.select("#legend").append("svg")
                    .attr("viewBox", [-width*0.5, -height*0.5, width, height])
                    .attr("width", width-20)
                    .attr("height", height-20);

            // Handmade legend
            svg.append("text")
                    .attr("x", -width*0.45)
                    .attr("y", -height*0.42)
                    .text("Legend")
                    .style("font-size", "16.5px")
                    .style("font-weight", "bold")
                    .attr("alignment-baseline","right");

             
            svg.append("circle").attr("cx", -width*0.43).attr("cy",-height*0.32).attr("r", width*0.02).style("fill", this.color[this.current_radio_option][0]).style("fill-opacity", 0.8);
            svg.append("circle").attr("cx", -width*0.43).attr("cy",-height*0.22).attr("r",  width*0.02).style("fill", this.color[this.current_radio_option][1]).style("fill-opacity", 0.8);
            svg.append("text").attr("x", -width*0.35).attr("y", -height*0.305).text(this.lenged_titles[this.current_dd_option][0]).style("font-size", "16.5px").attr("alignment-baseline","right");
            svg.append("text").attr("x", -width*0.35).attr("y", -height*0.205).text(this.lenged_titles[this.current_dd_option][1]).style("font-size", "16.5px").attr("alignment-baseline","right");
            
        },
        radioChanged(event) {
            this.current_radio_option = event.target.value;
            console.log(this.current_radio_option);
            this.sleep(50).then(() => {
                console.log("Complete");
                this.$refs.pie_component.updatePlot();
                this.$refs.bar_component.updatePlot();
                this.$refs.radar_component.updatePlot();
                d3.selectAll("#legend svg").remove();
                this.drawLegend();
            });
        }
    }
}

</script>

<style scoped>
#vis_board{
    display: flex;
    width: 100%;
    height: 100%;
}

.column{
    width: 50%;
    border-style: solid;
    border-width: 2px;
    border-color: #ccc;
}

.row {
    height: 50%;
}

#filter_column {
    display: flex;
    flex-direction: column;
    width: 20%;
    justify-content: space-evenly;
}

.filter_row {
    height: 33%;
    border-style: solid;
    border-width: 2px;
    border-color: #ccc;
}

#dataDropdown {
    display: inline-block;
    padding: 2px;
    margin: 5px;
    border: 1px solid #ccc;
}

.filterHeader {
    margin: 5px;
    padding: 2px;
    font-size: 14.5px;
    font-weight: bold;
}

#radio_input {
    margin: 5px;
    padding: 2px;
}

</style>