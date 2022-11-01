<template>
    <div id="home">
        <div id="col1">
            <div id="bar_view">
                <Dropdown @selectedChange="handleChange" />
                <BarChart v-if="dataExists" :myBarchartData="myData" :mySelection="selected" />
            </div>
        </div>
        <div id="col2">
            <div id="area_view">
                <AreaChart v-if="dataExists" :myAreachartData="myData" :mySelection="selected"/>
            </div>
            <div id="scatter_view">
                <DropdownScatter @selectedChange="handleChange_scatter"/>
                <Scatter v-if="dataExists" :myScatterPlotData="myData" :mySelection="selected_scatter"/>
            </div>
        </div>
    </div>
</template>

<script>
import BarChart from "../components/barchart.vue"
import AreaChart from "../components/areachart.vue"
import LineChart from "../components/linechart.vue"
import Dropdown from "../components/dropdown.vue"
import Scatter from "../components/scatterplot.vue"
import DropdownScatter from "../components/dropdown_scatter.vue"
import * as d3 from "d3";
import csvPath from '../../../../../datasets/pokemon_alopez247.csv';

export default {
    data(){
        return {
            dataExists: false,
            myData: [],
            selected: { id: 0, text: 'Type_1' },
            selected_scatter: { id: 0, text: 'Attack' }
        }
    },
    components: {
        BarChart,
        AreaChart,
        LineChart,
        Dropdown,
        Scatter,
        DropdownScatter
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
                this.dataExists = true; // updates the v-if to conditionally show the barchart only if our data is here.
                this.myData = data; // updates the prop value to be the recieved data, which we hand in to our bar-chart

            });
        },
        handleChange(selected) {
            console.log('change type' + selected.id + selected.text);
            this.selected = selected;
        },
        handleChange_scatter(selected) {
            console.log('scatter change type' + selected.id + selected.text);
            this.selected_scatter = selected;
        }
    }
}

</script>

<style>

#home {
    display: flex;
    height: 100%;
    position: relative;
    justify-content: center;
}

#col1 {
    height: 100%;
    width: 50%;
    position: relative;
}

#bar_view {
    height: 100%;
    width: 80%;
    position: relative;
}

#col2 {
    height: 100%;
    width: 50%;
    position: relative;
}

#area_view {
    height: 50%;
    width: 100%;
    position: relative;
}

#scatter_view {
    height: 50%;
    width: 100%;
    position: relative;
}

</style>