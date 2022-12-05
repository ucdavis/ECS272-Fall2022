import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, CardBody, CardHeader, Button, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap';
import React  from "react";
import  { scaleQuantile } from "d3-scale";



import MapChart from './components/WorldMap'
import RadarPlot  from './components/RadarPlot';
import BarChart from './components/Bar';
import AltWorldMap from './components/AltWorldMap';
import ContinentMap from './components/ContinentMap';
import D3BarChart from './components/D3BarChart';
import D3RadarPlot from './components/D3RadarPlot';

import {australAsia, centralAmerica, centralAsia, eastAsia,
  easternEurope, middleEast, northAmerica, southAmerica,
  southAsia, southEastAsia, subAfrica, westernEurope,
  attackCounts, casualtyCounts, terrorGroups}
from './data/AttackCounts'

import {continentCount, africaCountries, asiaCountries, europeCountries, northAmericaCountries,
southAmericaCountries, oceaniaCountries, Africa, Asia, Europe, NorthAmerica, SouthAmerica, Oceania} from './data/ContinentData'

const AFRICA_RANGE = 
[
  '#F6DDFF',
  '#FBC7FF',
  '#FFB1FF',
  '#FF9DEC',
  '#FF89D0',
  '#FF76AD',
  '#FF6384'
]

const ASIA_RANGE = 
[
  '#FFFFCC',
  '#ECFFAA',
  '#CAFF88',
  '#9BFF66',
  '#61FF44',
  '#22FF22',
  '#00FF32'
]

const EUROPE_RANGE = 
[
  '#E2CED1',
  '#CEB0AE',
  '#B9998F',
  '#A48670',
  '#8F7751',
  '#7A6C32',
  '#646314'
]

const NORTHA_RANGE = 
[
  '#CCFFFB',
  '#AAFFFF',
  '#8AECFF',
  '#6BC8FF',
  '#4D99FF',
  '#3060FF',
  '#141EFF'
]

const SOUTHA_RANGE = 
[
  '#D5CCD7',
  '#BCAABC',
  '#A1889C',
  '#866679',
  '#6A4454',
  '#4E222C',
  '#320003'
]

const OCEANIA_RANGE = 
[
  '#CCF8F2',
  '#AAEDF2',
  '#88D1EC',
  '#66AAE4',
  '#4479DC',
  '#2240D2',
  '#0000C8'
]


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      default: true,
      dropDownValue: 'Events',
      dropdownOpen: false,
      data: continentCount,
      url: "",
      regionList: [Africa, Asia, Europe, NorthAmerica, SouthAmerica, Oceania],
      selectedRegions: [NorthAmerica],
      year: terrorGroups[0].Year,
      groupLabels: terrorGroups[0].labels,
      groupData: terrorGroups[0].data,
      detailed: false,
      zoom: 2,
      center: [0,0],
      color: []

    };
  }

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

  colorScale =
              scaleQuantile()
              .domain([0, 45])
              .range(this.COLOR_RANGE)


  removeDetail = () => {
    this.setState({
      data: continentCount,
      detailed: false,
      selectedRegions: [NorthAmerica]
    })
  }

  sliderChange = (e) => {
    let index = e.target.value
    this.setState({
      count: index,
      year: terrorGroups[index].Year,
      groupLabels: terrorGroups[index].labels,
      groupData: terrorGroups[index].data
    })
  }

  continentSelect = geography => evt =>  {
    if(geography == 'Asia'){
      this.setState({
        data: asiaCountries,
        url: "https://raw.githubusercontent.com/deldersveld/topojson/master/continents/asia.json",
        detailed: !this.state.detailed,
        center: [80,20],
        selectedRegions: [Asia],
        color: ASIA_RANGE
      })
    }
    if(geography == 'North America'){
      this.setState({
        data: northAmericaCountries,
        url: "https://raw.githubusercontent.com/deldersveld/topojson/master/continents/north-america.json",
        detailed: !this.state.detailed,
        center: [-80,20],
        selectedRegions: [NorthAmerica],
        color: NORTHA_RANGE
      })
    }
    if(geography == 'South America'){
      this.setState({
        data: southAmericaCountries,
        url: "https://raw.githubusercontent.com/deldersveld/topojson/master/continents/south-america.json",
        detailed: !this.state.detailed,
        center: [-80,-30],
        selectedRegions: [SouthAmerica],
        color: SOUTHA_RANGE
      })
    }
    if(geography == 'Africa'){
      this.setState({
        data: africaCountries,
        url: "https://raw.githubusercontent.com/deldersveld/topojson/master/continents/africa.json",
        detailed: !this.state.detailed,
        center: [20,-10],
        selectedRegions: [Africa],
        color: AFRICA_RANGE
      })
    }
    if(geography == 'Europe'){
      this.setState({
        data: europeCountries,
        url: "https://raw.githubusercontent.com/deldersveld/topojson/master/continents/europe.json",
        detailed: !this.state.detailed,
        center: [10,40],
        selectedRegions: [Europe],
        color: EUROPE_RANGE
      })
    }
    if(geography == 'Oceania'){
      this.setState({
        data: oceaniaCountries,
        url: "https://raw.githubusercontent.com/deldersveld/topojson/master/continents/oceania.json",
        detailed: !this.state.detailed,
        center: [140,-40],
        selectedRegions: [Oceania],
        color: OCEANIA_RANGE
      })
    }
  }

  toggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  handleChange = (event) => {
    let region_list = this.state.regionList;
    let check = event.target.checked;
    let checked_region = region_list[event.target.value];
    if(check){
        this.setState({
          selectedRegions: [...this.state.selectedRegions, checked_region],
          default: false
        })
    }else{
        var regions = this.state.selectedRegions;
        var index = regions.indexOf(region_list[event.target.value]);
        if (index > -1) {
          console.log(regions[index]);
          regions.pop(regions[index]);
            this.setState({
              selectedRegions: regions,
              default: false
            })
        }
    }
  }

  render(){
    return (
      <div>
          <Container>
            <Row lg={8}>
              <Col>
              <Card style={{ height:'45rem'}}>
                    <CardHeader>Global Terrorist Incidents</CardHeader>
                    <CardBody>
                  <Button onClick={this.removeDetail} color="primary" disabled={!this.state.detailed}>World View</Button>
                  {this.state.detailed ?
                  <ContinentMap  data={this.state.data} url={this.state.url} center={this.state.center} COLOR_RANGE={this.state.color} />:<AltWorldMap  data={this.state.data} onClick={this.continentSelect} reveal={!this.state.detailed}/>}

                    </CardBody>
              </Card>
              </Col>

            <Col lg={5}>
            <Card style={{ width: '30rem' , height:'46rem'}}>
                    <CardHeader>Attack Types by Region</CardHeader>
                    <CardBody>
                      {/*<RadarPlot data={this.state.selectedRegions}/>*/}
                      {<D3RadarPlot data={this.state.selectedRegions}/>}
                      
                    {this.state.regionList.map((x, i) => <label key={i}>
                              <input
                                type="checkbox"
                                name="lang"
                                value={i}
                                onChange={this.handleChange}
                              />  {x.name}
                            </label>)}
                            </CardBody>
                  </Card>
            </Col>




            </Row>
            <Row>
            <Card style={{ height:'24rem'}}>
                    <CardHeader>Terrorist Group Activity by Year:
                            1970 <input type="range"
                            min={0}
                            max={46}
                            step={1}
                            value={this.state.count}
                            onChange={this.sliderChange}/> 2017</CardHeader>
                    <CardBody>
                            {/*<BarChart year={this.state.year} label={this.state.groupLabels} data={this.state.groupData} color={this.state.count ? this.colorScale(this.state.count) : "#EEE"}/>*/}
                            <D3BarChart year={this.state.year} data={this.state.groupData} label={this.state.groupLabels} color={this.state.count ? this.colorScale(this.state.count) : "#EEE"}/>
                            </CardBody>
                  </Card>


            </Row>

          </Container>
      </div>




    );

  }

}

export default App;
