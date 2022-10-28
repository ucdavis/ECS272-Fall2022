<template>
  <div id="dropdown_2">
    <select v-model="selected" @change="onChange($event)" class="form-control">
       <option v-for="p in popularities" v-bind:value="{ id: p.id, text: p.name }">{{ p.name }}
       </option>
   </select>
  </div>
</template>

<script>
    import * as d3 from "d3";

    export default {
        name: 'Dropdown_Beeswarm',
        data() { // pass data to others
            return {
                selected: {id: 0, text: 'acousticness'},
                popularities: [
                    {id: 0, name: 'acousticness'},
                    {id: 1, name: 'danceability'},
                    {id: 2, name: 'energy'},
                    {id: 3, name: 'instrumentalness'},
                    {id: 4, name: 'liveness'},
                    {id: 5, name: 'speechiness'},
                    {id: 6, name: 'valence'}
                ]
            }
        },
        mounted(){ 
            // console.log(this.selected.id, this.selected.text);
            // this.selectedCompound(this.selected);
        },
        methods: {
            // selectedCompound(selected) {
            //     this.$emit('valChange', selected)
            // },
            onChange(event) {
                console.log(this.selected.id, this.selected.text);
                this.$emit('selectedChange', this.selected);
            }
        }
    }

</script>


<style>

</style>