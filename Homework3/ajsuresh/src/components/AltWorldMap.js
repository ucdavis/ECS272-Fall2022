import React from "react"
import request from "axios"
import { feature } from "topojson-client"
import { geoCentroid } from "d3-geo"
import { ComposableMap, Geographies, Geography, Sphere, Graticule, ZoomableGroup } from "react-simple-maps"
import  { scaleQuantile } from "d3-scale";
import {attackCounts} from '../data/AttackCounts'
import LinearGradient from "./Legend";
import ReactTooltip from 'react-tooltip';
import Zoom from 'react-reveal/Zoom';


class AltWorldMap extends React.Component {
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
        zoom: 1,
        reveal: this.props.reveal
      };
    }

  componentDidUpdate = () => {}


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

    gradientData = () => {
    return(
    {
        fromColor: this.COLOR_RANGE[0],
        toColor: this.COLOR_RANGE[this.COLOR_RANGE.length - 1],
        min: 0,
        max: this.props.data.reduce((max, item) => (item.count > max ? item.count : max), 0)

    }
    )

  };


    colorScale =
            scaleQuantile()
            .domain(this.props.data.map(d => d.count))
            .range(this.COLOR_RANGE)


    geoUrl =
     "https://raw.githubusercontent.com/deldersveld/topojson/master/world-continents.json"


    onMouseLeave = () => {
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
            <Zoom opposite when={this.props.reveal}>
            <LinearGradient data={this.gradientData()}></LinearGradient>
            <center>Number of Events</center>
            <ComposableMap
              projectionConfig={{
                rotate: [-10, 0, 0],
                scale: 147
              }}
            >
              <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
              <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
              {(
                <ZoomableGroup zoom={zoom} center={center}>
                <Geographies geography={this.geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo, i) => {
                      const d = this.props.data.find((s) => s.country === geo.properties.continent);
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
                          onClick={this.props.onClick(geo.properties.continent)}
                          onMouseLeave={this.onMouseLeave}
                          data-tip={geo.properties.continent.toString() + ": " + this.state.value.toString()}
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
                </ZoomableGroup>
              )}
            </ComposableMap>
            </Zoom>
            </div>




          );

        };
    }


        export default AltWorldMap
