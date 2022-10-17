<template>
    <div>
        <!-- <h1>Welcome Home</h1> -->
        <Dropdown @selectedChange="handleChange" />
        <BarChart v-if="dataExists" :myBarchartData="myData" :mySelection="selected" />
    </div>
    <div>
        <Dropdown_Beeswarm @selectedChange="handleChange_beeswarm"/>
        <Beeswarm v-if="dataExists" :myData="myData" :mySelection="selected_beeswarm" />
    </div>
</template>

<script>
import BarChart from "../components/barchart.vue"
import Dropdown from "../components/dropdown.vue"
import * as d3 from "d3";
import Dropdown_Beeswarm from '../components/dropdown_beeswarm.vue';
import Beeswarm from '../components/beeswarm.vue';
import csvPath from '../../assets/data/spotify.csv';

export default {
    data(){
        return {
            dataExists: false,
            myData: [],
            selected: {id: 0, text: 'Popularity All'},
            selected_beeswarm: {id: 0, text: 'acousticness'}
        }
    },
    components: {
    BarChart,
    Dropdown,
    Dropdown_Beeswarm,
    Beeswarm
},
    created(){
        /* Fetch via CSV */
        this.drawFromCsv()
    },
    mounted(){},
    methods: {
        drawFromCsv(){
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
            // handle here
            console.log('parent noticed change bar ' + selected.id + selected.text);
            this.selected = selected;
        },
        handleChange_beeswarm(selected) {
            // handle here
            console.log('parent noticed change beeswarm ' + selected.id + selected.text);
            this.selected_beeswarm = selected;
        },
    }
}
</script>
