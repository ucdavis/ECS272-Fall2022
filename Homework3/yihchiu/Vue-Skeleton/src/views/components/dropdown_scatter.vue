<template>
    <div id="dropdown_scatter">
        <select v-model="selected" @change="onChange($event)" class="form-control">
            <option v-for="p in types" v-bind:value="{ id: p.id, text: p.type }">{{p.type}}
            </option>
        </select>
    </div>
</template>

<script>
    import * as d3 from "d3";
    
    export default {
        name: 'DropdownScatter',
        data() {
            return {
                selected: { id: 0, text: 'Attack' },
                types: [
                    { id: 0, type: 'Attack' },
                    { id: 1, type: 'Defense' },
                    { id: 2, type: 'HP' },
                    { id: 3, type: 'SpecialAttack' },
                    { id: 4, type: 'SpecialDefense' },
                    { id: 5, type: 'Speed' }
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