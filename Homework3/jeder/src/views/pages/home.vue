<template>

    <div class="container-fluid">
        <div class="row">
            <div id="filterContainer" class="col-md-3">
                <h3 style="display:inline">Filter:</h3>
                <br>
                <p style="display:inline">From:</p>
                <Datepicker v-model="fromDate" startingView='year' />
                <p style="display:inline">To:</p>
                <Datepicker v-model="toDate" startingView='year' />
                <br>
                <p style="display:inline" id="filter_country">Country:</p>
            </div>
            <div class="col-md-6">
                <OverviewChart :terrorismData="terrorismDataFiltered" 
                    v-model:countrieFilter="countrieFilter" 
                    v-model:selectedIncident="selectedIncident" />
            </div>
            <div id="addInfo" class="col-md-3">
                <p id="detail1_country">Country: {{selectedIncident?.country_txt}}</p>
                <p id="detail1_city">City: {{selectedIncident?.city}}</p>
                <p id="kill_wound">Killed/Wounded: {{selectedIncident?.nkill}} / {{selectedIncident?.nwound}}</p>
                <p id="detail1_summary">Summary: {{selectedIncident?.summary}}</p>
            </div>

        </div>
        <div class="row">
            <div class="col-md-6">
                <Detail1Chart 
                    :terrorismData="terrorismDataFiltered"
                    v-model:selectedIncident="selectedIncident" />
            </div>
            <div class="col-md-6">
                <Detail2Chart 
                    :terrorismData="terrorismDataFiltered"
                    v-model:selectedIncident="selectedIncident" />
            </div>
        </div>
    </div>
</template>

<script>
import OverviewChart from "../components/overview.vue"
import Detail1Chart from "../components/detail1.vue"
import Detail2Chart from "../components/detail2.vue"
import * as d3 from "d3";
import csvPath from '../../assets/data/globalterrorismdb_processed.csv';

import Datepicker from 'vue3-datepicker'
import { ref } from 'vue'

export const countryNameMap = new Map();
countryNameMap.set("United States", "United States of America");
countryNameMap.set("West Bank and Gaza Strip", "Palestine");
countryNameMap.set("Democratic Republic of the Congo", "Dem. Rep. Congo");
countryNameMap.set("Serbia-Montenegro", "Montenegro");
countryNameMap.set("Serbia-Montenegro", "Serbia");

countryNameMap.set("Republic of the Congo", "Congo");
countryNameMap.set("Solomon Islands", "Solomon Is.");
countryNameMap.set("International", "");
countryNameMap.set("Ivory Coast", "Côte d'Ivoire");
countryNameMap.set("East Timor", "Timor-Leste");
countryNameMap.set("Bosnia-Herzegovina", "Bosnia and Herz.");


export default {
    data() {
        return {
            dataExists: false,
            terrorismData: [],
            terrorismDataFiltered: [],
            fromDate: new Date(2001, 10, 1),
            toDate: new Date(2001, 10, 30),
            countrieFilter: null,
            selectedIncident: null
        }
    },
    components: {
        OverviewChart,
        Detail1Chart,
        Detail2Chart,
        Datepicker
    },
    async created() {
        /* Fetch via CSV */
        await this.loadData();
        this.filterData();
    },
    mounted() { },
    watch: {
        fromDate(newValue) {
            //console.log('newValue', newValue);
            this.filterData();
        },
        toDate(newValue) {
            //console.log('newValue', newValue);
            this.filterData();
        },
        countrieFilter(newValue) {
            // console.log('newValue', newValue);
            this.filterData();
        }
    },
    methods: {
        async loadData() {
            this.terrorismData = await d3.csv(csvPath);
            // console.log("Loaded " + this.terrorismData.length + " entries");
            this.dataExists = true;

        },
        filterData() {
            this.terrorismDataFiltered = this.terrorismData.filter(d => {
                const date = new Date(d.iyear, d.imonth - 1, d.iday);
                if(!(this.fromDate < date && date < this.toDate)){
                    return false; 
                }
                if(this.countrieFilter != null){
                    const mapedVal = countryNameMap.has(d.country_txt) ? countryNameMap.get(d.country_txt) : d.country_txt;
                    // console.log(this.countrieFilter + " ?= " + d.country_txt + " -> " + mapedVal);
                    if(this.countrieFilter != mapedVal)
                        return false;
                }
                return true;
            });
            // console.log("Filterd to: " + this.terrorismDataFiltered.length);
        }
    }
}

</script>
