import React from "react"
import request from "axios"
import { feature } from "topojson-client"
import { geoCentroid } from "d3-geo"
import { ComposableMap, Geographies, Geography, Sphere, Graticule, ZoomableGroup } from "react-simple-maps"
import  { scaleQuantile } from "d3-scale";
import {attackCounts} from '../data/AttackCounts'
import LinearGradient from "./Legend";
import ReactTooltip from 'react-tooltip';
import Zoom from "chartjs-plugin-zoom"

const geoPaths = ['../world.json', ""]
class WorldMap extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        count: 0,
        data: this.props.data,
        tooltipContent: '',
        value: '',
        geographies: null,
        markers: [],
        center: [0,0],
        zoom: 1
      };
    }

  componentDidUpdate = () => {}

  componentDidMount() {
    request.get("\world.json")
      .then(response => {
        const world = response.data
        const features = feature(world, world.objects[Object.keys(world.objects)[0]]).features
        this.setState({
          geographies: features,
          markers: features.map(feat => {
            return {
              coordinates: geoCentroid(feat),
              iso3: feat.properties.ISO_A3,
              name: feat.properties.NAME,
            }
          })
        })
      })
  }

  // Red Variants
    COLOR_RANGE = [
    '#ffedea',
    '#ffcec5',
    '#ffad9f',
    '#ff8a75',
    '#ff5533',
    '#e2492d',
    '#be3d26',
    '#9a311f',
    '#782618'
  ];

  COLOR_RANGE1 = [
    '#90b2c8',
    '#81a5be',
    '#7297b4',
    '#638aab',
    '#547da1',
    '#466f97',
    '#37628d',
    '#285584',
    '#19477a',
    '#0a3a70'
  ]

    gradientData = () => {
    return(
    {
        fromColor: this.COLOR_RANGE1[0],
        toColor: this.COLOR_RANGE1[this.COLOR_RANGE1.length - 1],
        min: 0,
        max: 7.84

    }
    )

  };


    colorScale =
            scaleQuantile()
            .domain(this.props.data.map(d => d.count))
            .range(this.COLOR_RANGE1)


    geoUrl =
     "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"


    onMouseLeave = () => {
      console.log(geoPaths[0])
        this.setState({
            tooltipContent: ''
        })
      };

      handleMarkerClick = marker => () => {
        this.setState({
          center: marker.coordinates,
          zoom: 4,
        })
      }

      render(){

        const {
          zoom,
          center,
          markers,
          geographies,
        } = this.state
        
        return (
            <div>
            <ReactTooltip />
            <LinearGradient data={this.gradientData()}></LinearGradient>
            <ComposableMap
              projectionConfig={{
                rotate: [-10, 0, 0],
                scale: 147
              }}
            >
              <ZoomableGroup zoom={this.props.zoom} center={this.props.center}>
              <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
              <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
              {(
                <Geographies geography={this.geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo, i) => {
                      const d = this.props.data.find((s) => s.country === geo.id);
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onMouseEnter={() => {
                            this.setState({
                                value: d.count
                            })
                            ReactTooltip.rebuild();
                            }}
                          onMouseLeave={this.onMouseLeave}
                          data-tip={geo.properties.name.toString() + ": " + this.state.value.toString()}
                          style={{
                            default: {
                              fill: d ? this.colorScale(d.count) : "#EEE",
                              stroke: "#FFF",
                              strokeWidth: 0.75,
                              outline: "none",
                            },
                            hover: {
                              fill: "#263238",
                              stroke: "#FFF",
                              strokeWidth: 0.75,
                              outline: "none",
                            },
                            pressed: {
                              fill: "#263238",
                              stroke: "#FFF",
                              strokeWidth: 0.75,
                            }
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              )}
              </ZoomableGroup>
            </ComposableMap>
            </div>




          );

        };
    }


        export default WorldMap
