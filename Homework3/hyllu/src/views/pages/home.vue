<template>
    <div id="home">
        <div id="left_view">
            <div id="intro">
                Overview: <br>
                <!-- Find the interested singer to focus on using the dropdown menu. <br>
                The network layout shows the focused singer (center) and the singers he or she has collaborated with. <br>
                The size of a node (singer) encodes the collaboration count. <br>
                The edge thickness encodes how many times they have collaboraed with each other. <br>
                Hover over nodes to check the singers' names. <br>
                The center singer's collaborators will show up in the dopdown menu. <br> -->
            </div>
            <div id="network_view">
                <Dropdown_Network :myData="hop_1" @selectedChange="handleChange_network"/>
                <Network v-if="dataExists" :myData="myData" :mySelection="selected_network" @dropdownChange="handledropdown_network" @selectSingerChange="handleselectSinger_network"/>
            </div>
        </div>
        
        <div id="right_view">
            <div id="bar_view">
                <Dropdown :mySelection="selected" @selectedChange="handleChange" />
                <BarChart v-if="BarExists" :myBarchartData="myData" :mySelection="selected" :mySinger="selectSinger" @colorChange="handlecolor_views" />
            </div>
            <div id="beeswarm_view">
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
            BarExists: false,
            myData: [],
            selected: {id: 0, text: 'Popularity All'},
            selected_beeswarm: {id: 0, text: 'acousticness'},
            selected_network: {id: 0, text: 'Taylor Swift'},
            hop_1: [{id: 0, text: 'Taylor Swift'}],
            selectSinger: undefined,
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
        handleselectSinger_network(select_singer){
            console.log('parent noticed change selectSinger ' + select_singer);
            this.selectSinger = select_singer;
            if (this.selectSinger !== undefined){
                this.BarExists = true;
            }
            else {
                this.BarExists = false;
                this.selected = {id: 0, text: 'Popularity All'};
            }
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
        height: 100%;
        position: relative;
        justify-content: center;
    }
    #left_view {
        height: 100%;
        width: 35%;
        position: relative;
        border-style: dotted;
        border-width: 2px;
        border-color: #474141;
        border-radius: 5px;
        justify-content: center;
    }
    #intro {
        height: 38%;
        width: 80%;
        position: relative;
        border-style: solid;
        border-width: 2px;
        border-radius: 5px;
        border-color: #474141;
        margin-top: 10px;
        margin-bottom: 10px;
        margin-left: auto;
        margin-right: auto;
    }
    #network_view {
        height: 62%;
        width: 80%;
        position: relative;
    }
    #right_view {
        margin-left: 20px;
        height:100%;
        width: 50%;
        position: relative;
        margin-left: auto;
        margin-right: auto;
    }
    #bar_view {
        height: 50%;
        width: 100%;
        position: relative;
    }
    #beeswarm_view {
        margin-top: 10px;
        height: 50%;
        width: 100%;
        position: relative;
    }
</style>
