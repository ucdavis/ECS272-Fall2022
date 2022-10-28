<template>

<div class="container">
  <div class="Overview"></div>
  <div class="Details">
    <div class="Detail1"></div>
    <div class="Detail2"></div>
  </div>
</div>

    <!-- <div class="overview">
        <OverviewChart :terrorismData="terrorismDataFiltered" />

        <div id="filterContainer">
            <h3 style="display:inline">Filter:</h3>
            <br>
            <p style="display:inline">From:</p>
            <Datepicker v-model="fromDate" startingView='year' />
            <p style="display:inline">To:</p>
            <Datepicker v-model="toDate" startingView='year' />
            <br>
            <p style="display:inline" id="filter_country">Country:</p>
        </div>
            
        <div id="addInfo">
            <p id="detail1_country">Country:</p>
            <p id="detail1_city">City: </p>
            <p id="kill_wound">Killed/Wounded: </p>
            <p id="detail1_summary">Summary: </p>
        </div>

    </div>
    <div class="detail1">
        <Detail1Chart :terrorismData="terrorismDataFiltered" />
    </div>
    <div class="detail2">
        <Detail2Chart :terrorismData="terrorismDataFiltered" />

    </div> -->
</template>

<script>
import OverviewChart from "../components/overview.vue"
import Detail1Chart from "../components/detail1.vue"
import Detail2Chart from "../components/detail2.vue"
import * as d3 from "d3";
import csvPath from '../../assets/data/globalterrorismdb_processed.csv';

import Datepicker from 'vue3-datepicker'
import { ref } from 'vue'

export default {
    data() {
        return {
            dataExists: false,
            terrorismData: [],
            terrorismDataFiltered: [],
            fromDate: new Date(2001, 10, 1),
            toDate: new Date(2001,10,30),
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
        }
    },
    methods: {
        async loadData() {
            this.terrorismData = await d3.csv(csvPath);
            console.log("Loaded " + this.terrorismData.length + " entries");
            this.dataExists = true;

        },
        filterData() {
            this.terrorismDataFiltered = this.terrorismData.filter(d => {
                const date = new Date(d.iyear, d.imonth - 1, d.iday);
                return this.fromDate < date && date < this.toDate;
            });
            console.log("Filterd to: " + this.terrorismDataFiltered.length );    
        }
    }
}

</script>
