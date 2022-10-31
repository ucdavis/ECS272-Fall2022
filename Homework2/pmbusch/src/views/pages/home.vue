<template>
    <div class="row">
        <div class="column">
            <h1 class="chartTitle">California Wildfires events 1992-2015</h1>
            <div class="row" style="height: 50%">
                <h1 class="VisTitle">Acres <i>(in thousands)</i> burned due to fire across California: by cause, season and year</h1>
                <h1 class="note"><i>Leave cursor in node to get a preview of the total area burned. Click on a node to freeze the highlight view.</i></h1>
                <!--<Sankey v-if="dataExists" :mySankeyData="mySankeyData" /> -->
                <Sankey v-if="dataExists" :mySankeyData="mySankeyData" />
            </div>
        </div>     
        <div class="column">
            <div class="row">
                <h1 class="VisTitle">Burned areas by wildfires by the years</h1>
                <!--<div class="column">
                    <label class="button" for="yrange" 
                    style="display: inline-block; text-align: left">
                    Fire size below =   <span id="yrange-value">10</span>
                </label>  
                <input type="range" id="yrange" min=0.1 max=1000 value=10 style="width: 250px;">
                <br>
            </div>-->
            <!--<div class="column">
                <label class="button">
                    Color  
                </label>
                <select id="ScatterColor" class="button">
                    <option value="cause">Cause</option>
                    <option value="season">Season</option>
                </select>
            </div>-->
        </div>
            <!--
                <div class="row" id="idScatter">
                    <Scatter v-if="dataExists" :myScatterData="myScatterData" />
                </div>
            -->
            <div class="row" id="idStackedArea">
                <StackedArea v-if="dataExists" :myStackedAreaData="myStackedAreaData"/>
            </div>
            <div class="row" style="height: 50%">
                <h1 class="VisTitle">Different causes/seaons have different impacts per event</h1>
                <!-- <BarChart v-if="dataExists" :myBarchartData="myBarData" /> -->
                <div class="column">
                    <label class="button">
                        Choose Metric to show:     
                    </label>
                    <select id="BarYaxis">
                        <option value="fire_Totalsize">Total Acres Burned</option>
                        <option value="fire_count">Number of Fire Events</option>
                        <option value="fire_avgSize"> Average Acres Burned per Fire </option>
                    </select>
                </div>
                <div class="column">
                    <label class="button">
                        Show metrics by:     
                    </label>
                    <select id="BarCauseSeason">
                        <option value="STAT_CAUSE">Cause</option>
                        <option value="SEASON">Season</option>
                    </select>
                </div>
                <BarChart v-if="dataExists" :myBarchartData="myBarData" />
            </div>   
        </div>
    </div>
</template>

<script>
import BarChart from "../components/barchart.vue"
import Scatter from "../components/scatter.vue"
import Sankey from "../components/sankey.vue"
import StackedArea from "../components/stackedArea.vue"
import * as d3 from "d3";
import csvPathBar from '../../assets/data/fire_bar.csv';
import csvPath from '../../assets/data/fire_scatter.csv';
// import csvPath from '../../assets/data/fire_sankey.json';


export default {
    data(){
        return {
            dataExists: false,
            myBarData: [],
            myScatterData: [],
            mySankeyData: [],
            myStackedAreaData: []
        }
    },
    components: {
        BarChart,
        Scatter,
        Sankey,
        StackedArea
    },
    created(){
        /* Fetch via CSV */
        // this.drawBarFromCsv()
        this.drawScatterFromCsv()
    },
    mounted(){
        document.title="California Wildfires Dashboard";
    },
    methods: {
        drawScatterFromCsv(){
            //async method
            d3.csv(csvPath).then((data) => {
                // array of objects
                console.log(data.length);
                console.log(data);
                this.dataExists = true; // updates the v-if to conditionally show the barchart only if our data is here.
                // this.myBarData = data; // updates the prop value to be the recieved data, which we hand in to our bar-chart
                this.myScatterData=data;
                // this.mySankeyData = data;
            });
        }
    }
}

</script>

<style>
    .chartTitle{
        font-size: 2em;
    }
    
    .VisTitle{
        font-size: 1.4em;
    }
    .note{
        font-size: 0.9em;
    }
    .button{
        font-size: 1.2em;
    }
    .column {
        float: left;
        width: 50%;
    }
    /* Clear floats after the columns */
    .row:after {
    content: "";
    display: table;
    clear: both;
    height: 50%;
    }
</style>
