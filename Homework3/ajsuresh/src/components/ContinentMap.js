import React from "react"
import { ComposableMap, Geographies, Geography, Sphere, Graticule, ZoomableGroup } from "react-simple-maps"
import  { scaleQuantile } from "d3-scale";
import LinearGradient from "./Legend";
import ReactTooltip from 'react-tooltip';
import Zoom from 'react-reveal/Zoom';


class ContinentMap extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        count: 0,
        data: this.props.data,
        url: this.props.url,
        showTooltip: false,
        value: 0,
        geographies: null,
        markers: [],
        center: [0,0],
        reveal: this.props.reveal
      };
    }

  componentDidUpdate = () => {}


  // Red Variants
    COLOR_RANGE = [
        '#CCF8F2',
        '#AAEDF2',
        '#88D1EC',
        '#66AAE4',
        '#4479DC',
        '#2240D2',
        '#0000C8'
      ]
      

    gradientData = () => {
    return(
    {
        fromColor: this.props.COLOR_RANGE[0],
        toColor: this.props.COLOR_RANGE[this.COLOR_RANGE.length - 1],
        min: 0,
        max: this.props.data.reduce((max, item) => (item.count > max ? item.count : max), 0)

    }
    )

  };


    colorScale =
            scaleQuantile()
            .domain(this.props.data.map(d => d.count))
            .range(this.props.COLOR_RANGE)


    geoUrl = this.props.geo

    country = geography => evt => {
        console.log(geography);
        const d = this.props.data.find((s) => s.Country === geography);
        this.setState({
            value: d.count,
            showTooltip: true
        })
        ReactTooltip.rebuild();
        
    }


    onMouseLeave = () => {
        this.setState({
            showTooltip: false
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
            <Zoom collapse when={this.props.reveal}>
            <LinearGradient data={this.gradientData()}></LinearGradient>
            <center>Number of Events</center>
            <div>
            <ComposableMap
             width={800}
            height={800}
            projectionConfig={{
                scale: 200
            }}
            >
              {(
                <ZoomableGroup zoom={1.8} center={this.props.center}>
                <Geographies geography={this.state.url}>
                  {({ geographies }) =>
                    geographies.map((geo, i) => {
                        const d = this.props.data.find((s) => s.Country === geo.properties.geounit);
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onMouseEnter={this.country(geo.properties.geounit)}
                          onMouseLeave={this.onMouseLeave}
                          data-tip={geo.properties.geounit.toString() + ": " + this.state.value.toString()}
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
            <ReactTooltip />
            </div>
            </Zoom>
          );

        };
    }


    export default ContinentMap
