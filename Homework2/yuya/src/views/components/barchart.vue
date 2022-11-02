<template>
    <info>Pitch paths from current at-bat and pitch speeds</info>
    <div id="legend">
        <ul id="pitch_list">
        </ul>
    </div>
    <div id="scene"></div>
</template>

<script>

import * as THREE from 'three';
import { OrbitControls  } from 'three/addons/controls/OrbitControls.js';
import * as d3 from "d3";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { LineMaterial  } from "three/examples/jsm/lines/LineMaterial";
import { LineGeometry  } from "three/examples/jsm/lines/LineGeometry";
import { Line2  } from "three/examples/jsm/lines/Line2";
import testData from "../../assets/data/test.json";
import homeplateData2 from "../../assets/data/Homeplate.gltf"

const pitch_type = {
    'FF': 0x7fc97f,
    'CU': 0xbeaed4,
    'SI': 0xffff99,
    'CH': 0x386cb0,
    'SL': 0xfdc086,
    'FS': 0xf0027f
}

const pitch_type_name = {
    '4-Seam Fastball': '#7fc97f',
    'Curveball': '#beaed4',
    'Sinker': '#ffff99',
    'Changeup': '#386cb0',
    'Slider': '#fdc086',
    'Splitter': '#f0027f',
    'Other': '#bf5617'
}

let curves_bool_array;

class bezierPath {

    constructor (config={}) {  

        let { parent, 
            name, 
            v1, 
            v2, 
            v3, 
            frequency = 1, 
            frameRate = 60, 
            height,
            pitch_speed,
            color = 0xffffff,
        } = config;

        //https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
        this.frameRate = frameRate;       
        this.pitch_speed = pitch_speed;

        this.parent = parent;
        this.curveGroup = new THREE.Group();
        if (name) this.curveGroup.name = name;
        this.curveGroup.visible =  false;  
        this.currentSegment = -1;
        this.animationFrame = undefined; 

        const curve = new THREE.QuadraticBezierCurve3(
            v1.applyMatrix4(parent.matrixWorld),
            v2.applyMatrix4(parent.matrixWorld),
            v3.applyMatrix4(parent.matrixWorld)
        );

        const numPoints =  Math.max(Math.floor((frameRate / 2) * frequency),15);

        const points = curve.getPoints(numPoints);

        const material = new LineMaterial({
            color: color,
            linewidth: 0.006,
        });
        for (let i = 0; i < points.length - 1; i++) {
            const pts = []
            pts.push(points[i].x, points[i].y, points[i].z);
            pts.push(points[i+1].x, points[i+1].y, points[i+1].z);

            const clrs = []
            clrs.push(255, 0, 0);
            clrs.push(255, 0, 0);

            const geometry = new LineGeometry();
            geometry.setPositions(pts);
            geometry.setColors(clrs);

            const line = new Line2(geometry, material);
            line.computeLineDistances();

            this.curveGroup.add(line);

        }  // for

        parent.add(this.curveGroup);


    } // constructor


    animate(){

        let start, original_start;
        let currentSegment = this.currentSegment;
        let curveGroup = this.curveGroup;
        const framRate = this.frameRate;
        const pitch_speed = this.pitch_speed;
        const parent = this.parent;

        this.hide();
        curveGroup.visible = true;
        /* window.requestAnimationFrame(step); */ 
        this.animationFrame = window.requestAnimationFrame(step); 
        let animationFrame = this.animationFrame;

        function step(timestamp) {

            if (start === undefined) 
                start = timestamp;
            if (original_start === undefined)
                original_start = timestamp;

            const elapsed_from_original = timestamp - original_start;
            /* console.log(elapsed_from_original); */
            const elapsed = timestamp - start;

            let curveDone = true;
            curveGroup.traverse( curveSegment =>  {curveDone = curveDone && curveSegment.visible; })
            if (curveDone){
                if (elapsed_from_original >= 6000){
                    curveGroup.traverse( curveSegment => curveSegment.visible = false  );
                    original_start = timestamp;
                    currentSegment = -1; 
                    curveGroup.visible = true;
                }
                /* console.log(elapsed_from_original); */
            }

            const framHelper = 4500 - (1500/60)*(pitch_speed - 50);
            if (elapsed >= (framHelper / framRate) && curveGroup.visible ) {
                /* currentSegment = ++currentSegment; */

                /* if (currentSegment === curveGroup.children.length){ */
                /*     return; */
                /* } */
                currentSegment < curveGroup.children.length - 1  ? ++currentSegment : 0;

                curveGroup.children[currentSegment].visible = true;
                /* !curveGroup.children[currentSegment].visible; */
                start = timestamp; 
            }

            /* if (curveGroup.visible) */ 
            animationFrame = window.requestAnimationFrame(step);  
        }
    } //animate  

    destroy() {
        window.cancelAnimationFrame(this.animationFrame);
        this.parent.remove(this.curveGroup); 

    } // destroy

    display() {
        /* window.cancelAnimationFrame(this.animationFrame); */
        this.curveGroup.traverse( curveSegment => curveSegment.visible = true  );

    } // hide  

    hide() {
        window.cancelAnimationFrame(this.animationFrame);
        this.curveGroup.traverse( curveSegment => curveSegment.visible = false  );

    } // hide  

    setColor(color){
        this.curveGroup.traverse(curveSegment => curveSegment.material ? curveSegment.material.color.set(color) : null)  

    } // setColor 


}      

let scene, mesh;

export default {
    name: 'BarChart',
    data() {
        return {
            name: 'Hello',
            someLocalValues: [1, 2, 3, 4, 5],
            height: 300,
            width: 300,
            grass_texture: new THREE.TextureLoader().load( require('../../assets/textures/dirt.jpg')),
                  
        }
    },
    props:{
        myData: Object,
    },
    mounted(){
        console.log("BarChart: Data Passed down as a Prop  ", this.myData);
        this.scene = this.setupScene();
        this.makeStrikeZone();
        this.camera = this.setupCamera();
        this.render();
        this.path = this.getPaths();
        this.addLegend();
        this.animate();
    },
    methods: {
        makeStrikeZone(){
            // Strike zone 
            let top = [], bot = [];

            this.myData.forEach(x => top.push(x['sz_top']));
            this.myData.forEach(x => bot.push(x['sz_bot']));

            top = top.reduce((a,b) => parseFloat(a) + parseFloat(b)) / top.length;
            bot = bot.reduce((a,b) => parseFloat(a) + parseFloat(b)) / bot.length;

            const points = [   
                [(-17/24), top-5, 50],
                [(-17/24), bot-5, 50],
                [(17/24), bot-5, 50],
                [(17/24), top-5, 50],
                [(-17/24), top-5, 50],
            ];
            const material = new LineMaterial({
                color: 0x000000,
                linewidth: 0.003,
            });

            for (let i = 0; i < points.length - 1; i++){
                const pts = []
                pts.push(points[i][0], points[i][1], points[i][2]);
                pts.push(points[i+1][0], points[i+1][1], points[i+1][2]);

                const clrs = []
                clrs.push(255, 0, 0);
                clrs.push(255, 0, 0);

                const geometry = new LineGeometry();
                geometry.setPositions(pts);
                geometry.setColors(clrs);

                const line = new Line2(geometry, material);
                line.computeLineDistances();
                this.scene.add(line);
            }
        },
        addLegend(){
            let container = document.getElementById('scene');

            let containerWidth = Math.min(container.clientWidth, container.clientHeight);
            let containerHeight = containerWidth;

            let svg = d3.select('#legend')
                .append("svg")
                .attr("viewBox", [0, 0, 200, 200])
                .attr("width", 200 )
                .attr("height", 200)
                .style("margin", "auto")
                .style("height", "100%");

            let size = 20;
            let keys = [ '4-Seam Fastball', 'Curveball', 'Sinker', 'Changeup', 'Slider', 'Splitter', 'Other'];

            svg.selectAll("mydots")
                .data(keys)
                .enter()
                .append("rect")
                .attr("x", 10)
                .attr("y", function(d,i){ return 10 + i*(size+5) }) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("width", size)
                .attr("height", size)
                .style("fill", d => pitch_type_name[d]);

            // Add one dot in the legend for each name.
            svg.selectAll("mylabels")
                .data(keys)
                .enter()
                .append("text")
                .attr("x", 10 + size*1.2)
                .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2) }) // 100 is where the first dot appears. 25 is the distance between dots
                .text(function(d){ return d })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")


        },
        render(){
            let container = document.getElementById('scene');
            let renderer = new THREE.WebGLRenderer({antialias: true});

            const controls = new OrbitControls(this.camera, renderer.domElement);
            controls.maxPolarAngle = 5.3*Math.PI/10;
            renderer.setSize(container.clientWidth, container.clientHeight);
            this.camera.aspect = container.clientWidth / container.clientHeight;
            this.camera.updateProjectionMatrix();
            renderer.setPixelRatio(window.devicePixelRatio);

            this.renderer = renderer;
            container.appendChild(this.renderer.domElement);

            this.renderer.render(this.scene, this.camera);

        }, // while
        animate() {

            requestAnimationFrame(this.animate);

            this.renderer.render(this.scene, this.camera);
        },


        getPaths(){
            let arr = []

            for (let path of this.myData){
                let color;
                if (pitch_type[path['pitch_type']] === undefined){
                    color = '#bf5617' 
                } else {
                    color = pitch_type[path['pitch_type']]
                }
                const p = new bezierPath({
                    parent: this.scene,
                    v1: new THREE.Vector3(
                        path['x0'],
                        path['z0'] - 5,
                        -50),
                    v2: new THREE.Vector3(
                        path['xmid'],
                        path['zmid'] - 5,
                        0),
                    v3: new THREE.Vector3(
                        path['px'],
                        path['pz'] - 5,
                        50),
                    height: 1,
                    color: color,
                    pitch_speed: path['start_speed'],
                });
                arr.push(p);
                p['animate']();
            }
            return arr;
        },
        setupScene() {
            /* const gridHelperSize = 10; */
            const gridHelperSize = 50;
            this.gridHelperSize = gridHelperSize;
            const scene = new THREE.Scene();

            scene.background = new THREE.Color(0xffffff);

            const sceneHeight = 1;
            //Cube is used temporarily to set size of boundingBox       
            const geometry = new THREE.BoxGeometry(10, 10, 100);
            const cube =  new THREE.Mesh(geometry, new THREE.MeshBasicMaterial()); 

            scene.add(cube);

            const boundingBox = new THREE.BoxHelper(scene, 0x000000);
            boundingBox.geometry.computeBoundingBox();  
            boundingBox.geometry.computeBoundingSphere();

            this.boundingBox = boundingBox;

            scene.remove(cube);
            const helper = new THREE.GridHelper( this.gridHelperSize, 10 );

            const geometry_plane = new THREE.PlaneGeometry( 1000, 1000 );
            this.grass_texture.wrapS = THREE.RepeatWrapping; 
            this.grass_texture.wrapT = THREE.RepeatWrapping;
            this.grass_texture.repeat.set(100,100);
            const material_plane = new THREE.MeshBasicMaterial({ map: this.grass_texture, side: THREE.DoubleSide, transparent: true, opacity: 0.9});
            /* const material_plane = new THREE.MeshBasicMaterial( {color: 0xb38650, side: THREE.DoubleSide, transparent: true, opacity: 0.5}  ); */
            const plane = new THREE.Mesh( geometry_plane, material_plane  );
            plane.rotation.x = Math.PI / 2;
            plane.position.y = -7;
            scene.add( plane  );

            const loader2 = new GLTFLoader();

            loader2.load(homeplateData2, 
                (o)=>{let temp = o.scene.children[0]; temp.material = new THREE.MeshBasicMaterial ( {color: 0xFFFFFF} ); temp.rotation.x = -1 * Math.PI / 2; temp.position.y = -7; temp.position.z=50; temp.scale.set(1/9, 1/9, 1/9); scene.add(temp)},
                (xhr)=>console.log((xhr.loaded / xhr.total) * 100+'% loaded'),
                (e) => console.log(e));

            return scene;  
        },

        setupCamera() {
            const fov = 45;
            const aspect = this.width / this.height;

            const near = 3;
            const sceneHeight = 1;
            const far = Math.max(10000,this.boundingBox.geometry.boundingSphere.radius * 2);
            const camera = new THREE.PerspectiveCamera(75, 1., near, far);

            // Position for a bird's eye view of the warehouse
            camera.position.set(0, -3, 55);


            camera.lookAt(this.boundingBox.geometry.boundingSphere.center.x,
                -7,
                this.boundingBox.geometry.boundingSphere.center.z);    

            return camera;
        },
    }
}

</script>


<style>

</style>
