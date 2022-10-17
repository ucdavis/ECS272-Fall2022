<template>
  <div id="dropdown_1">
    <select v-model="selected" @change="onChange($event)" class="form-control">
       <option v-for="p in popularities" v-bind:value="{ id: p.id, text: p.name }">{{ p.name }}
       </option>
   </select>
  </div>
</template>

<script>
    import * as d3 from "d3";

    export default {
        name: 'Dropdown',
        data() { // pass data to others
            return {
                selected: {id: 0, text: 'Popularity All'},
                popularities: [
                    {id: 0, name: 'Popularity All'},
                    {id: 1, name: 'Popularity 40-60'},
                    {id: 2, name: 'Popularity 60-80'},
                    {id: 3, name: 'Popularity 80-100'}
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