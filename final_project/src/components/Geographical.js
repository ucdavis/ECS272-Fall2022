import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, CardBody, 
  CardHeader} from 'reactstrap';
import React  from "react";
import  { scaleQuantile } from "d3-scale";
import BarChart from './Bar';


import { averageHappiness } from '../data/HappinessData';
import WorldMap from './WorldMap';



class Geographical extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      default: true,
      dropDownValue: 'Events',
      dropdownOpen: false,
      year: null,
      groupLabels: ['Finland', 'Denmark', 'Switzerland', 'Iceland', 'Norway', 'Netherlands', 'Sweden', 'New Zealand', 'Canada', 'Australia'],
      groupData: [7.62, 7.57, 7.53, 7.52, 7.51, 7.42, 7.33, 7.31, 7.30, 7.26],
      detailed: false,
      zoom: 2,
      center: [-100,100],
      color: [],
      isOpen: false

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

  COLOR_RANGE1 = [
    '#FFFFCC',
    '#ECFFAA',
    '#CAFF88',
    '#9BFF66',
    '#61FF44',
    '#22FF22',
    '#00FF32'
  ]

  COLOR_RANGE2 = [
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

  colorScale =
              scaleQuantile()
              .domain([0, 45])
              .range(this.COLOR_RANGE2)


  

  render(){
    return (
      <div>
          <Container>
          <Row>
            <Card style={{ height:'24rem'}}>
                    <CardHeader>Top 10 Happiest Countries in the World (2015 - 2021)</CardHeader>
                    <CardBody>
                            {/*<BarChart year={this.state.year} label={this.state.groupLabels} data={this.state.groupData} color={this.state.count ? this.colorScale(this.state.count) : "#EEE"}/>*/}
                            <BarChart data={this.state.groupData} label={this.state.groupLabels} color="#90b2c8" legend={false}/>
                            </CardBody>
                  </Card>


            </Row>
            <Row lg={8}>
              <Col>
              <Card style={{ height:'45rem'}}>
                    <CardHeader>7-year Average Global Happiness Score</CardHeader>
                    <CardBody>
                <WorldMap data={averageHappiness} center={[0,-50]} zoom={0.8} />

                    </CardBody>
              </Card>
              </Col>


            </Row>
            

          </Container>
      </div>




    );

  }

}

export default Geographical;