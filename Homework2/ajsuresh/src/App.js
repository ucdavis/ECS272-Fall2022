import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, CardBody, CardHeader, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap';
import React  from "react";
import  { scaleQuantile } from "d3-scale";




import MapChart from './components/WorldMap'
import RadarPlot  from './components/RadarPlot';
import BarChart from './components/Bar';

import {australAsia, centralAmerica, centralAsia, eastAsia,
  easternEurope, middleEast, northAmerica, southAmerica,
  southAsia, southEastAsia, subAfrica, westernEurope,
  attackCounts, casualtyCounts, terrorGroups}
from './data/AttackCounts'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      default: true,
      dropDownValue: 'Events',
      dropdownOpen: false,
      data: attackCounts,
      regionList: [australAsia, centralAmerica, centralAsia, eastAsia,
        easternEurope, middleEast, northAmerica, southAmerica,
        southAsia, southEastAsia, subAfrica, westernEurope],
      selectedRegions: [0],
      year: terrorGroups[0].Year,
      groupLabels: terrorGroups[0].labels,
      groupData: terrorGroups[0].data

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

  changeValue = (e) => {
    if (e.currentTarget.textContent === 'Events'){
      this.setState({
        dropDownValue: e.currentTarget.textContent,
        data: attackCounts
      })
    }
    else{
      this.setState({
        dropDownValue: e.currentTarget.textContent,
        data: casualtyCounts
      })
    }

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
                    <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle caret>
                      {this.state.dropDownValue}
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem header>Select: Events/Casualties</DropdownItem>
                      <DropdownItem onClick={this.changeValue}>Events</DropdownItem>
                      <DropdownItem onClick={this.changeValue}>Casualties</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  <MapChart  data={this.state.data}/>
                  <center>Number of {this.state.dropDownValue}</center>

                    </CardBody>
              </Card>
              </Col>

            <Col lg={5}>
            <Card style={{ width: '30rem' , height:'46rem'}}>
                    <CardHeader>Attack Types by Region</CardHeader>
                    <CardBody><RadarPlot data={this.state.selectedRegions}/></CardBody>
                    {this.state.regionList.map((x, i) => <label key={i}>
                              <input
                                type="checkbox"
                                name="lang"
                                value={i}
                                onChange={this.handleChange}
                              />  {x.label}
                            </label>)}
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
                            <BarChart year={this.state.year} label={this.state.groupLabels} data={this.state.groupData} color={this.state.count ? this.colorScale(this.state.count) : "#EEE"}/>
                            </CardBody>
                  </Card>


            </Row>

          </Container>
      </div>




    );

  }

}

export default App;
