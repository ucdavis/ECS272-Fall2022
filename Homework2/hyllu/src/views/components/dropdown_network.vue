<template>
  <div id="dropdown_3">
    <select v-model="selected" @change="onChange($event)" class="form-control">
       <option v-for="p in popularities" v-bind:value="{ id: p.id, text: p.name }">{{ p.name }}
       </option>
   </select>
  </div>
</template>

<script>
    import * as d3 from "d3";

    export default {
        name: 'Dropdown_Network',
        data() { // pass data to others
            return {
                selected: {id: 0, text: 'Taylor Swift'},
                popularities: [
                    {id: 0, name: 'Taylor Swift'},
                    {id: 1, name: 'Ed Sheeran'}
                ]
            }
        },
        mounted(){ 
        },
        methods: {
            onChange(event) {
                console.log(this.selected.id, this.selected.text);
                this.$emit('selectedChange', this.selected);
            }
        }
    }

</script>


<style>

</style>