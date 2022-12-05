import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, CardBody, 
  CardHeader} from 'reactstrap';
import React  from "react";
import  { scaleQuantile } from "d3-scale";

import BarChart from './Bar';
import LineChart from './LineChart';


import { yearlyRankings } from '../data/HappinessData';

const datasets = [
    {
      label: 'Average Happiness Factor',
      data: [5.38, 5.38, 5.35, 5.38, 5.41, 5.47, 5.53],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }
  ];


class Temporal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      default: true,
      data: datasets,
      url: "",
      year: yearlyRankings[0].year,
      groupLabels: yearlyRankings[0].labels,
      groupData: yearlyRankings[0].data,
      detailed: false,
      zoom: 2,
      center: [0,0],
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

  colorScale =
              scaleQuantile()
              .domain([0, 45])
              .range(this.COLOR_RANGE)



  sliderChange = (e) => {
    let index = e.target.value
    this.setState({
      count: index,
      year: yearlyRankings[index].year,
      groupLabels: yearlyRankings[index].labels,
      groupData: yearlyRankings[index].data
    })
  }



  render(){
    return (
      <div>
          <Container>
            
            <Row>
            <Card style={{ height:'24rem'}}>
                    <CardHeader>Top 10 Happiest Countries in the World (by year):
                            2015 <input type="range"
                            min={0}
                            max={6}
                            step={1}
                            value={this.state.count}
                            onChange={this.sliderChange}/> 2021</CardHeader>
                    <CardBody>
                            {/*<BarChart year={this.state.year} label={this.state.groupLabels} data={this.state.groupData} color={this.state.count ? this.colorScale(this.state.count) : "#EEE"}/>*/}
                            <BarChart year={this.state.year} data={this.state.groupData} label={this.state.groupLabels} color={'rgba(53, 162, 235, 0.5)'} legend={true}/>
                            </CardBody>
                  </Card>


            </Row>
            <Row lg={8}>
              <Col>
              <Card style={{ height:'45rem'}}>
                    <CardHeader>Average Happiness over Time</CardHeader>
                    <CardBody>
                    <LineChart data={this.state.data}/>
                    </CardBody>
              </Card>
              </Col>


            </Row>

          </Container>
      </div>




    );

  }

}

export default Temporal;