<template>
    <div>
        <h1>Welcome Home</h1>
        <Dropdown @selectedChange="handleChange" />
        <!-- <SelectCompound @valChange="handleChange"></SelectCompound> -->
        <BarChart v-if="dataExists" :myBarchartData="myBarData" :mySelection="selected" />
    </div>
</template>

<script>
import BarChart from "../components/barchart.vue"
import Dropdown from "../components/dropdown.vue"
import * as d3 from "d3";
import csvPath from '../../assets/data/spotify.csv';

export default {
    data(){
        return {
            dataExists: false,
            myBarData: [],
            selected: ""
        }
    },
    components: {
        BarChart,
        Dropdown
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
                this.myBarData = data; // updates the prop value to be the recieved data, which we hand in to our bar-chart
            });
        },
        handleChange(selected) {
            // handle here
            console.log('parent noticed change ' + selected.id + selected.text);
            this.selected = selected.id + selected.text;
        },
    }
}

</script>
