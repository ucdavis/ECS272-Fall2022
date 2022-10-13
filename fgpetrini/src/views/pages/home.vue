<template>
    <div id="vis_board">
        <div class="column" id="quad1">
            <h1>Quad 1</h1>
        </div>
        <div class="column">
            <div class="row" id="quad2">
                <RadarPlot  v-if="dataExists" :myRadarPlotData="myRadarData" />
            </div>
            <div class="row" id="quad3">
                <h1>Quad 3</h1>
            </div>
        </div>
    </div>
</template>

<script>
import RadarPlot from "../components/radarplot.vue"
import * as d3 from "d3";
import csvPath from '../../assets/data/AirlineSatisfaction.csv';

export default {
    data(){
        return {
            dataExists: false,
            myRadarData: [],
        }
    },
    components: {
        RadarPlot 
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
                console.log(data);
                this.dataExists = true; // updates the v-if to conditionally show the RadarPlot  only if our data is here.
                this.myRadarData = data; // updates the prop value to be the recieved data, which we hand in to our bar-chart

            });
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