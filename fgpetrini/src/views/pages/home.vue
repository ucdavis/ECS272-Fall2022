<template>
    <div id="vis_board">
        <div class="column" id="pie_quad">
            <form>
                <select name="input" @change="this.dropDownChanged" id="dataDropdown">
                    <option value="Dis_Vs_Sat">Dissatisfied vs. Satisfied</option>
                    <option value="Di_Vs_Loy">Disloyal vs. Loyal</option>
                </select>
            </form>
            <PieChart  v-if="dataExists" :myPieChartData="data_" :height="pie_h" :width="pie_w" />
        </div>
        <div class="column">
            <div class="row" id="quad2">
                
            </div>
            <div class="row" id="radar_quad">
                <RadarPlot  ref="radar_component" v-if="dataExists" :myRadarPlotData="data_" :height="radar_h" :width="radar_w" :dd_option="current_dd_option"/>
            </div>
        </div>
    </div>
</template>

<script>
import RadarPlot from "../components/radarplot.vue"
import PieChart from "../components/piechart.vue"
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
        }
    },
    components: {
        RadarPlot,
        PieChart
    },
    created(){
        /* Fetch via CSV */
        this.drawBarFromCsv()
    },
    mounted(){},
    methods: {
        drawBarFromCsv(){
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
            });
        },
        dropDownChanged() {
            console.log("Drop Down Option Changed");
            let e = document.getElementById("dataDropdown");
            this.current_dd_option = e.value;
            // Needs time to update...
            this.sleep(50).then(() => {
                console.log("Complete");
                this.$refs.radar_component.updatePlot();
            });
        },
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }
}

</script>

<style>
#vis_board{
    display: flex;
    width: 100%;
    height: 100%;
}

.column{
    width: 50%;
}

.row {
    height: 50%;
}

#quad1{
    background-color: aqua;
}

#quad2{
    background-color: peru;
}

#quad3{
    background-color: plum;
}
</style>