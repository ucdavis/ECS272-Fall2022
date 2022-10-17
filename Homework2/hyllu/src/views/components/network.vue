<template>
    <div id="network"></div>
</template>

<script>
    import * as d3 from "d3";
    import { object } from "vue-types";

    export default {
        name: 'Network',
        data() { // pass data to others
            return {
                prepared_data: undefined,
                colorScale: undefined
            }
        },
        props:{ // received data from others
            myData: Array,
            mySelection: Object //focused singer (eg. taylor swift)
        },
        watch: { 
            mySelection: function(newVal, oldVal) { // watch it
                this.prepareData(this.myData, this.mySelection);
                this.drawNetwork(this.prepared_data, "#network", this.mySelection);
            }
        },
        mounted(){ // actually drawing
            this.prepareData(this.myData, this.mySelection);
            this.drawNetwork(this.prepared_data, "#network", this.mySelection);
        },
        methods: {
            prepareData(data, selection) {
                let node = {};
                let link = {};
                let id = {};
                let count = 1;
                console.log("In network: ", selection.id + selection.text);
                data.forEach(element => {
                    let artist = element.artists.split('\'');
                    let musician_log = [];
                    let flag = false;
                    for (let i=0; i<artist.length; i++){
                        if (artist[i]===selection.text){
                            flag = true;
                            id[selection.text] = 0;
                        }
                        else if (artist[i][0]!='[' && artist[i][0]!=']' && artist[i][0]!=','){
                            musician_log.push(artist[i]);
                        }
                    }
                    if (flag === true && musician_log.length>0){
                        for (let tmp=0; tmp<musician_log.length; tmp++){
                            if (musician_log[tmp] in id);
                            else {
                                id[musician_log[tmp]] = count;
                                count += 1;
                            }
                            data.forEach(hop2 => {
                                let artist_hop2 = hop2.artists.split('\'');
                                let musician_log_hop2 = [];
                                let flag_hop2 = false;
                                for (let i=0; i<artist_hop2.length; i++){
                                    if (artist_hop2[i]===musician_log[tmp]){
                                        flag_hop2 = true;
                                    }
                                    else if (artist_hop2[i][0]!='[' && artist_hop2[i][0]!=']' && artist_hop2[i][0]!=','){
                                        musician_log_hop2.push(artist_hop2[i]);
                                    }
                                }
                                if (flag_hop2 === true && musician_log_hop2.length>0){
                                    for (let tmp_hop2=0; tmp_hop2<musician_log_hop2.length; tmp_hop2++){
                                        if (musician_log_hop2[tmp_hop2] in id);
                                        else {
                                            id[musician_log_hop2[tmp_hop2]] = count;
                                            count += 1;
                                        }
                                    }
                                }
                            });
                        }
                    }
                });

                console.log(id);
            },

            drawNetwork(data, id, selection) {
                
            }
        }
    }

</script>


<style>

</style>