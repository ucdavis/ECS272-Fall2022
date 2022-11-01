<template>
    <div id="home">
        <div id="left_view">
            <div id="center_table">
                <Table/>
            </div>
            <div id="network_view">
                <!-- <Dropdown_Network :myData="hop_1" @selectedChange="handleChange_network"/> -->
                <Network v-if="dataExists" :myData="myData" :mySelection="selected_network" @dropdownChange="handledropdown_network" @selectSingerChange="handleselectSinger_network"/>
            </div>
        </div>
        
        <div id="right_view">
            <div id="bar_view">
                <!-- <Dropdown v-if="BarExists" :mySelection="selected" @selectedChange="handleChange" /> -->
                <BarChart v-if="BarExists" :myBarchartData="myData" :mySelection="selected" :mySinger="selectSinger" @colorChange="handlecolor_views" @selectSongsChange="handleselectSongs_bar" @selectTextChange="handleselectText_bar" />
            </div>
            <div id="text_view">
                <TextArea v-if="BarExists" :myText="selected_text" />
            </div>
            <div id="beeswarm_view">
                <!-- <Dropdown_Beeswarm v-if="BeeswarmExits" @selectedChange="handleChange_beeswarm"/> -->
                <Beeswarm v-if="BeeswarmExits" :myData="myData" :mySelection="selected_beeswarm" :mySinger="selectSinger" :myColor="color" :slideshow="slideNumber" :mySongs="selected_songs" @slideshowChange="handleChange_slide"/>
            </div>
        </div>
    </div>
    
</template>

<script>
import * as d3 from "d3";
import BarChart from "../components/barchart_general.vue";
import Beeswarm from '../components/beeswarm_popularity.vue';
import Network from '../components/network.vue';
import Dropdown from "../components/dropdown.vue";
import Dropdown_Beeswarm from '../components/dropdown_beeswarm.vue';
import Dropdown_Network from '../components/dropdown_network.vue';
import TextArea from '../components/Text_area.vue';
import Table from '../components/table.vue';
import csvPath from '../../assets/data/spotify.csv';
import tablePath from '../../assets/data/table_data.csv';

export default {
    data(){
        return {
            dataExists: false,
            BarExists: false,
            BeeswarmExits: false,
            myData: [],
            selected: {id: 1, text: 'Popularity 0-20'},
            selected_beeswarm: {id: 0, text: 'acousticness'},
            selected_network: {id: 0, text: 'Taylor Swift'},
            hop_1: [{id: 0, text: 'Taylor Swift'}],
            selectSinger: undefined,
            color: undefined,
            colorExists: true,
            slideNumber: 0,
            selected_songs: [],
            selected_text: []
        }
    },
    components: {
        BarChart,
        Dropdown,
        Dropdown_Beeswarm,
        Beeswarm,
        Dropdown_Network,
        Network,
        TextArea,
        Table
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
            // this.selectSinger = select_singer;
            if (select_singer !== undefined){
                if (String(typeof(select_singer))==="string"){
                    this.BarExists = true;
                    this.BeeswarmExits = this.colorExists & this.BarExists;
                    if (select_singer !== this.selectSinger){
                        this.selected_network = {id: 0, text: select_singer};
                        this.selectSinger = select_singer;
                    }
                    this.selected_songs = [];
                    this.selected_text = [];
                }
                else {
                    this.BarExists = true;
                    this.BeeswarmExits = this.colorExists & this.BarExists;
                    this.selectSinger = select_singer;
                    this.selected_songs = [];
                    this.selected_text = [];
                }
            }
            else {
                // this.BarExists = false;
                // this.BeeswarmExits = this.colorExists & this.BarExists;
                this.selectSinger = this.selected_network.text;
                this.selected_songs = [];
                this.selected_text = [];
                this.selected = {id: 1, text: 'Popularity 0-20'};
            }
        },
        handlecolor_views(color){
            console.log('parent noticed change color ' + color);
            this.color = color;
            this.colorExists = true;
            this.BeeswarmExits = this.colorExists & this.BarExists;
        },
        handleselectSongs_bar(ti_tmp){
            console.log('parent noticed change TI ' + ti_tmp);
            this.selected_songs = ti_tmp;
        },
        handleselectText_bar(select_item){
            this.selected_text = select_item;
        },
        handleChange_slide(tmp_slide){
            const ori_this = this;
            function resolveAfter2Seconds() {
                return new Promise(resolve => {
                    setTimeout(() => {
                    resolve('resolved');
                    }, 5000);
                });
            }
            async function asyncCall() {
                console.log('calling');
                const result = await resolveAfter2Seconds();
                console.log(result);
                ori_this.slideNumber = tmp_slide;
            }
            asyncCall();
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
        width: 40%;
        position: relative;
        border-style: dotted;
        border-width: 2px;
        border-color: #474141;
        border-radius: 5px;
        justify-content: center;
    }
    #center_table {
        height: 15%;
        width: 95%;
        position: relative;
        /* border-style: solid;
        border-width: 2px;
        border-radius: 5px;
        border-color: #474141; */
        margin-top: 10px;
        margin-bottom: 10px;
        margin-left: auto;
        margin-right: auto;
    }
    #network_view {
        height: 85%;
        width: 95%;
        position: relative;
        margin-top: 10px;
        margin-bottom: 10px;
        margin-left: auto;
        margin-right: auto;
    }
    #right_view {
        margin-left: 20px;
        height:100%;
        width: 50%;
        position: relative;
        margin-left: auto;
        margin-right: auto;
    }
    #text_view {
        height: 15%;
        width: 100%;
        position: relative;
    }
    #bar_view {
        height: 40%;
        width: 100%;
        position: relative;
    }
    #beeswarm_view {
        margin-top: 10px;
        height: 45%;
        width: 100%;
        position: relative;
    }
</style>
