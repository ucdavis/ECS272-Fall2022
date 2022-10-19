import './css/style.scss';
import './css/styles.css'; /* Example of connecting a style-sheet */
import {drawHorizon} from './js/horizon';
import {drawWorldMap} from "./js/worldmap";
import {drawDiff} from "./js/diff";


drawWorldMap("#worldmap", "#legend1");
drawHorizon("#horizon");
drawDiff("#diff");

/* 
    TODO: all the other logic for implementing your charts + adding in some basic filters 
    (e.g. dropdown menus for seeing different aspects of the data)
*/