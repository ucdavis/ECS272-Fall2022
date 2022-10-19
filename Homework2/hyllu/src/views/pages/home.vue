<template>
    <div id="home">
        <div>
            <Dropdown_Network :myData="hop_1" @selectedChange="handleChange_network"/>
            <Network v-if="dataExists" :myData="myData" :mySelection="selected_network" @dropdownChange="handledropdown_network"/>
        </div>
        <div>
            <div>
                <Dropdown @selectedChange="handleChange" />
                <BarChart v-if="dataExists" :myBarchartData="myData" :mySelection="selected" :mySinger="selected_network.text" @colorChange="handlecolor_views" />
            </div>
            <div>
                <Dropdown_Beeswarm @selectedChange="handleChange_beeswarm"/>
                <Beeswarm v-if="colorExists" :myData="myData" :mySelection="selected_beeswarm" :mySinger="selected_network.text" :myColor="color" />
            </div>
        </div>
    </div>
    
</template>

<script>
import * as d3 from "d3";
import BarChart from "../components/barchart_general.vue";
import Beeswarm from '../components/beeswarm_general.vue';
import Network from '../components/network.vue';
import Dropdown from "../components/dropdown.vue";
import Dropdown_Beeswarm from '../components/dropdown_beeswarm.vue';
import Dropdown_Network from '../components/dropdown_network.vue';
import csvPath from '../../assets/data/spotify.csv';

export default {
    data(){
        return {
            dataExists: false,
            myData: [],
            selected: {id: 0, text: 'Popularity All'},
            selected_beeswarm: {id: 0, text: 'acousticness'},
            selected_network: {id: 0, text: 'Taylor Swift'},
            hop_1: [{id: 0, text: 'Taylor Swift'}],
            color: undefined,
            colorExists: false
        }
    },
    components: {
    BarChart,
    Dropdown,
    Dropdown_Beeswarm,
    Beeswarm,
    Dropdown_Network,
    Network
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
        handleChange_network(selected) {
            // handle here
            console.log('parent noticed change network ' + selected.id + selected.text);
            this.selected_network = selected;
        },
        handledropdown_network(dropdown_update){
            console.log('parent noticed change dropdown ' + dropdown_update);
            this.hop_1 = dropdown_update;
        },
        handlecolor_views(color){
            console.log('parent noticed change color ' + color);
            this.color = color;
            this.colorExists = true;
        }
    }
}
</script>

<style>

    #home {
        display: flex;
    }
</style>
