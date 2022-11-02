import csvPath from './assets/data/pokemon.csv';
import './css/style.scss';
import './css/styles.css'; /* Example of connecting a style-sheet */
import {drawBarchart} from './js/barchart';
import {drawLinechart} from './js/linechart';
import { drawScatterplotMatrix } from './js/scatter';

drawBarchart(csvPath, "#barchart");
drawLinechart(csvPath, "#linechart");
drawScatterplotMatrix(csvPath, {
    columns: [
        'HP',
        'Attack',
        'Defense',
        'Sp_Atk',
        'Sp_Def',
        'Speed'
    ],
    id: "#scatterchart",
    z: d => d.Type_1
});

/* 
    TODO: all the other logic for implementing your charts + adding in some basic filters 
    (e.g. dropdown menus for seeing different aspects of the data)
*/