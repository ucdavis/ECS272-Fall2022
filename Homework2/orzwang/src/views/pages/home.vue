<template>
    <div class="column side">
        <div class="card">
            <h2>Chart UpperLeft</h2>

        </div>
        
    </div>
    <div class="column middle">
        <div class="card">
            <h2>Chart UpperRight</h2>
            
        </div>
        <div class="card">
            <h2>Chart LowerRight</h2>
            <BarChart v-if="dataExists" :myBarchartData=myBarData myChartID="barbottom"/>
        </div>
    </div>
</template>

<script>
import BarChart from "../components/barchart.vue";
import * as d3 from "d3";
//import csvPath from '../../assets/data/SF_Historical_Ballot_Measures.csv';
import person_csvPath from '../../assets/data/credits.csv';
import title_csvPath from '../../assets/data/titles.csv';
import Piechart from '../components/piechart.vue';
import { integer } from "vue-types";

export default {
    data(){
        return {
            dataExists: false,
            myBarData: [],
            //data_person = d3.csvParse(FileAttachment().text(), d3.autoType)
            //data_title = d3.csvParse(FileAttachment().text(), d3.autoType)
            //actorGroups : Array,
            //titleGroups : Array,
            //fdata_person : Array,
            //fdata_title : Array
        }
    },
    components: {
    BarChart,
    Piechart
},
    created(){
        /* Fetch via CSV */
        this.retrieveFromCsv(),
        this.drawBarChart(),
        this.levelGroup()
        
    },
    mounted(){
        this.levelGroup()
    },
    methods: {
        retrieveFromCsv(){
            //async method
            
            d3.csv(person_csvPath).then((data_person) => {
                // array of objects
                console.log(data_person.length);
                //console.log(data_person);
                //this.dataExists = true; // updates the v-if to conditionally show the barchart only if our data is here.
                //this.myBarData = data; // updates the prop value to be the recieved data, which we hand in to our bar-chart
                //this.data_person = data_person;
                
            
                d3.csv(title_csvPath).then((data_title) => {
                    // array of objects
                    console.log(data_title.length);
                    //console.log(data_title);
                    //this.dataExists = true; // updates the v-if to conditionally show the barchart only if our data is here.
                    //this.myBarData = data; // updates the prop value to be the recieved data, which we hand in to our bar-chart
                    //this.data_title = data_title;
                    this.processAllData(data_person,data_title);
                });
            });
            
        },
        processAllData(data_person,data_title){
            this.fdata_person = this.processpersonData(data_person,data_title);
            this.fdata_title = this.processtitleData(data_person,data_title);
            console.log(this.fdata_person.length);
            //console.log(this.fdata_person);
            console.log(this.fdata_title.length);
            //console.log(this.fdata_title);
            this.dataExists = true;
            this.actorGroups = this.groupBy(this.fdata_person, 'role')
            this.titleGroups = this.groupBy(this.fdata_title, 'year')
            //console.log(this.actorGroups.length)
            //console.log(Object.keys(this.actorGroups))
            //console.log(this.titleGroups.length)
            //console.log(Object.keys(this.titleGroups))
            const titlebarArray = [];
            const actorbarArray = [];
            Object.keys(this.titleGroups).forEach(d => {
                let year = {
                    y: d,
                    x: this.titleGroups[d].length
                }
                titlebarArray.push(year);
                this.titleGroups[d] = this.groupBy(this.titleGroups[d],'type');
                //console.log(Object.keys(this.titleGroups[d]))
                Object.keys(this.titleGroups[d]).forEach(itemkey =>{
                    this.titleGroups[d][itemkey] = this.groupBy(this.titleGroups[d][itemkey], 'first_country')
                    //console.log(Object.keys(this.titleGroups[d][itemkey]))
                })
            });
            this.myBarData = titlebarArray;
            console.log("Bardata Complete");
            //console.log(this.titleGroups);
            console.log(this.myBarData);
            this.dataExists = true;
        },
        drawBarChart(){
            
            //Object.keys(this.titleGroups).forEach(d => {
                
            //});
            //this.myBarData = barArray;
            
            //console.log(barArray.length);
            //console.log(barArray);
            //console.log(this.myBarData);
            //let Filesaver = require('file-saver');
            //Filesaver.saveAs(this.myBarData,"../assets/data/myBarData.json")
        },
        levelGroup(){
            console.log("levelGroup running!")
        },
        groupBy(objectArray, property) {            
            return objectArray.reduce(function (acc, obj) {
                let key = obj[property]
                if (!acc[key]) {
                acc[key] = []
                }
                acc[key].push(obj)
                return acc
            }, {})
        },
        processpersonData(data_person,data_title){
            // calculate product titles to merge for persons
            const titleGroups = {};
            data_title.forEach(d=>{
                if(!(d.id in titleGroups)){
                const t = {
                    name: d.title,
                    id: d.id,
                    type: d.type,
                }
                titleGroups[d.id] = t;
                }
            })
            const personGroups = {};
            data_person.forEach(d => {
                if(d.person_id in personGroups){
                personGroups[d.person_id].products = personGroups[d.person_id].products + 1;
                personGroups[d.person_id].titles.push(titleGroups[d.id]);

                }else{
                const person = {
                    titles : [],
                    name: d.name,
                    id: d.person_id,
                    products: 1,
                    role: d.role
                }
                personGroups[d.person_id] = person;
                personGroups[d.person_id].titles.push(titleGroups[d.id]);

                }
            })
            const formattedData = []
            Object.keys(personGroups).forEach(d => {
                formattedData.push(personGroups[d]);
            });
            
            // Sort by number of products per person
            formattedData.sort(function(a, b){
                if(a.products < b.products) { return 1; }
                if(a.products > b.products) { return -1; }
                return 0;
            })
            //console.log(formattedData)
            return formattedData
        },
        processtitleData(data_person,data_title) {
            // calculate persons to merge for product titles
            const personGroups = {};
            data_person.forEach(d => {
                if(d.person_id in personGroups){
                personGroups[d.person_id].products = personGroups[d.person_id].products + 1;
                }else{
                const person = {
                    name: d.name,
                    id: d.person_id,
                    products: 1,
                    role: d.role
                }
                personGroups[d.person_id] = person;
                }
            })
            const titleGroups = {};
            data_title.forEach(d=>{
                if(!(d.id in titleGroups)){
                    const t = {
                    first_country : d.production_countries.split(',')[0].split('[')[1].split(']')[0].split("'")[1],
                    year : d.release_year,
                    agec : (d.age_certification == '') ? 'No restriction' : d.age_certification,
                    name: d.title,
                    id: d.id,
                    type: d.type,
                    involve: [],
                    runtime: d.runtime,
                    imscore: d.imdb_score,
                    tmscore: d.tmdb_score,
                    popularity: Math.round(Math.min(500,d.tmdb_popularity)/100),
                    num_person: 0
                }
                    //if (t.agec == ''){
                    //    t.agec = 'No restriction'
                    //}
                    titleGroups[d.id] = t;
                }
            })
            const formattedData = []
            Object.keys(titleGroups).forEach(d => {
                data_person.forEach(e =>{
                    if (e.id == titleGroups[d].id){
                        titleGroups[d].num_person+=1;
                        titleGroups[d].involve.push(personGroups[e.person_id]);
                    }
                })
                formattedData.push(titleGroups[d]);
            });
            
            // Sort by name
            formattedData.sort(function(a, b){
                if(a.num_person < b.num_person) { return 1; }
                if(a.num_person > b.num_person) { return -1; }
                return 0;
            })
            //console.log(formattedData)
            return formattedData
        }
    }

}

</script>
<style scoped>
    body {
    margin: 0;
    }
    .column {
    float: left;
    padding: 10px;
    }

    .column.side {
    width: 40%;
    height: 45%;
    }

    .column.middle {
    width: 60%;
    height: 100%;
    }
    .card {
    background-color: white;
    padding: 20px;
    margin-top: 20px;
    }

    .row:after {
    content: "";
    display: table;
    clear: both;
    }
@media screen and (max-width: 600px) {
  .column.side, .column.middle {
    width: 100%;
  }
}
</style>
