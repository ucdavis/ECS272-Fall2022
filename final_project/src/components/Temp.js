import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, CardBody, 
  CardHeader, Button, Dropdown, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import React  from "react";
import  { scaleQuantile } from "d3-scale";
import { Multiselect } from "multiselect-react-dropdown";
import Select from 'react-select'
import { allCountries, numberCountries, countryColors, temporalLine} from '../data/HappinessData';


import D3RadarPlot from './D3RadarPlot';
import LineChart from './LineChart';
import WorldMap from './WorldMap';


import {year2015, year2016, year2017, year2018, year2019, year2020, year2021} from '../data/HappinessData'

import Inst1 from '../inst1.png'
import Inst2 from '../inst2.png'
import Inst3 from '../Inst3.png'

const tempData =
  { name: 'None',
    axes: [
      {axis: 'Economic Production', value: [0,0,0,0,0,0]},
      {axis: 'Social Support', value: [0,0,0,0,0,0]},
      {axis: 'Life Expectancy', value: [0,0,0,0,0,0]},
      {axis: 'Freedom', value: [0,0,0,0,0,0]},
      {axis: 'Absence of Corruption', value: [0,0,0,0,0,0]},
      {axis: 'Generosity', value: [0,0,0,0,0,0]}
      ],
  color: countryColors[0]
  }




const temp = [
    {
      label: 'Average Happiness Factor',
      data: [5.38, 5.38, 5.35, 5.38, 5.41, 5.47, 5.53],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }
  ];

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      default: true,
      countries: [],
      dropDownValue: 'Events',
      economy: temporalLine[0].economy,
      dropdownOpen: false,
      geoData: [],
      geoArr: [],
      selectedData: [allCountries[0]],
      worldData: year2015,
      radarData: [tempData],
      url: "",
      selectedRegions: [],
      detailed: false,
      zoom: 2,
      center: [0,0],
      color: [],
      isOpen: false, 
      temporal: temp,
      loadRadar: false,
      modal: false,
      modal1: false,
      keys: [],
      lineData: this.temporalValues,
      happinessFactor: 'Economic Production',
      happinessAccessor: 'economy',
      nothing: true

    };
    this.toggle = this.toggle.bind(this);
    this.selectValue = this.selectValue.bind(this);
    this.sliderChange = this.sliderChange.bind(this);
    this.loadData = this.loadData.bind(this);
    this.loadTemporal = this.loadTemporal.bind(this);
    this.removeValue = this.removeValue.bind(this);
    this.writeValue = this.writeValue.bind(this);
    this.toggle1 = this.toggle1.bind(this);
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
    let years = [year2015, year2016, year2017, year2018, year2019, year2020, year2021]
    this.setState({
      worldData: years[index],
      count: index
    })
    this.loadData()
  }

  loadData = (e) => {
    for(let i = 0; i < this.state.geoData.length; i++){
      
        this.state.geoArr[i] =

            { name: this.state.geoData[i][this.state.count].country,
              axes: [
                {axis: 'Economic Production', value: this.state.geoData[i][this.state.count].economy},
                {axis: 'Social Support', value: this.state.geoData[i][this.state.count].social_support},
                {axis: 'Life Expectancy', value: this.state.geoData[i][this.state.count].life_expectancy},
                {axis: 'Freedom', value: this.state.geoData[i][this.state.count].freedom},
                {axis: 'Absence of Corruption', value: this.state.geoData[i][this.state.count].trust_in_government},
                {axis: 'Generosity', value: this.state.geoData[i][this.state.count].generosity}
                ],
            color: countryColors[i]
            }
    }
    
  }

  removeData = (e) => {
    this.setState({
      geoArr: []
    })
    for(let i = 0; i < this.state.geoData.length; i++){
      
        this.state.geoArr[i] =

            { name: this.state.geoData[i][this.state.count].country,
              axes: [
                {axis: 'Economic Production', value: this.state.geoData[i][this.state.count].economy},
                {axis: 'Social Support', value: this.state.geoData[i][this.state.count].social_support},
                {axis: 'Life Expectancy', value: this.state.geoData[i][this.state.count].life_expectancy},
                {axis: 'Freedom', value: this.state.geoData[i][this.state.count].freedom},
                {axis: 'Absence of Corruption', value: this.state.geoData[i][this.state.count].trust_in_government},
                {axis: 'Generosity', value: this.state.geoData[i][this.state.count].generosity}
                ],
            color: countryColors[i]
            }
    }
    
  }




  temporalValues = []
  axes = ['Economy', 'Social Support', 'Life Expectancy', 'Trust in Government', 'Freedom', 'Generosity']

  loadTemporal = (e) => {

    for(let i = 0; i < this.state.keys.length; i++){
      this.temporalValues[i] =
      {
        label: temporalLine[this.state.keys[i]].country,
        data: temporalLine[this.state.keys[i]][this.state.happinessAccessor],
        borderColor: countryColors[i],
        backgroundColor: countryColors[i],
      }
   }
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  toggle1() {
    this.setState({
      modal1: !this.state.modal1
    });
  }

  // componentDidMount = () => {

  //   this.loadData()
  //   this.loadTemporal()
  //   this.setState({
  //     loadRadar: true,
  //     radarData: this.state.geoArr
  // })
  // }

 
  selectValue = (m, e) => {
    let tempArray = this.state.geoData
    let keyArray = this.state.keys
    tempArray.push(allCountries[e.key])
    keyArray.push(e.key)
    this.setState({
      geoData: tempArray,
      key: keyArray
    })
    this.loadData();
    this.loadTemporal();

    this.setState({
      radarData: this.state.geoArr,
      lineData: this.temporalValues
    })
  }


  removeValue = (m, e) => {
    let tempArray2 = this.state.geoData
    let keyArray2 = this.state.keys
    tempArray2.splice(tempArray2.indexOf(allCountries[e.key]), 1)
    console.log(keyArray2.indexOf(e.key))
    keyArray2.splice(keyArray2.indexOf(e.key), 1)
    this.setState({
      geoData: tempArray2,
      key: keyArray2
    }, () => {
      this.loadData();
      this.loadTemporal();
    })
    console.log(this.state.geoData)
      this.setState({
        radarData: this.state.geoArr,
        lineData: this.temporalValues
      })


  }

  writeValue = (e, m) => {
    console.log(e)
    if(e == "Economic Production"){
      this.setState({
        happinessFactor: e,
        happinessAccessor: 'economy'
      })

    }
    if(e == "Social Support"){
      this.setState({
        happinessFactor: e,
        happinessAccessor: 'social_support'
      })

    }
    if(e == "Life Expectancy"){
      this.setState({
        happinessFactor: e,
        happinessAccessor: 'life_expectancy'
      })

    }
    if(e == "Freedom"){
      this.setState({
        happinessFactor: e,
        happinessAccessor: 'freedom'
      })

    }
    if(e == "Absence of Corruption"){
      this.setState({
        happinessFactor: e,
        happinessAccessor: 'trust_in_government'
      })

    }
    if(e == "Generosity"){
      this.setState({
        happinessFactor: e,
        happinessAccessor: 'generosity'
      })
    }

    this.loadData();
    this.loadTemporal();
    
    
    
  }

  years = [2015, 2016, 2017, 2018, 2019, 2020, 2021]


  render(){
    return (
      <div>
          <Container>
          <b>Slide to see the evolution: </b>2015 <input type="range"
                            min={0}
                            max={6}
                            step={1}
                            value={this.state.count}
                            onChange={this.sliderChange}/> 2021  
            <Row lg={8}>
              

            <Col lg={7}>
            
            <Card style={{ height:'45rem'}}>
              
                    <CardHeader>Worldwide Happiness Scores
                             <Button color="primary" size="sm" onClick={this.toggle}>?</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>World Map</ModalHeader>
          <ModalBody>
            <b>Worldwide Happiness Scores:</b> Toggle the slide bar above the map to see how happiness has changed over time. 
            <img src={Inst1} width={260} height={40}/>
            <div className='new-line'>{"\n"}</div>
            Hover over each country to see their names and annual happiness score. 
            <div className='new-line'>{"\n"}</div>
            <img src={Inst2} width={260} height={200}/>
          </ModalBody>
        </Modal> 
                    </CardHeader>
                    <CardBody>
                    <center><b>{this.years[this.state.count]}</b></center>
                    <WorldMap data={this.state.worldData} center={[0,0]} zoom={1} />

                    </CardBody>
              </Card>
            
            </Col>
            <Col>
              <Card style={{ width: '30rem' , height:'46rem'}}>
                    <CardHeader>Six Factors Contributing to Happiness  <Button color="primary" size="sm" onClick={this.toggle1}>?</Button>
        <Modal isOpen={this.state.modal1} toggle={this.toggle1}>
          <ModalHeader toggle={this.toggle1}>What do the 6 factors mean?</ModalHeader>
          <ModalBody>
          <ol>
                        <li><b>Economic Production</b> is Gross Domestic Product (GDP) per capita, generated by World Bank Data and OECD data.</li>
                        <li><b>Social Support </b>is a national average of whether an individual has social support from their friends and family in times of distress, generated by GWP data.</li>
                        <li><b>Life Expectancy</b> is healthy life expectancy at birth, generated by World Health Organization (WHO) Global Health Observatory data.</li>
                        <li><b>Freedom</b> is people’s perspective about their satisfaction in the freedom to make choices in their life, generated by GWP data</li>
                        <li><b>Absence of Corruption</b> is people’s perceptions of corruption in their government in a country. For countries where this data is missing, the report uses perceived corruption of businesses for the corruption-perception measure, generated by GWP data.</li>
                        <li><b>Generosity</b> is people’s response to the question, “Have you donated money to a charity in the past month?” generated by GWP data.</li>
                      </ol>
                      <div className='new-line'>{"\n"}</div>
                      <b>Instructions</b>
                      <div className='new-line'>{"\n"}</div>
                      To see how the six factors play into the happiness score, select (or type) the country’s name from the dropdown menu. You can explore how it changed over time by moving the slide bar on the World Map. You can select multiple countries for comparison.
                      <div className='new-line'>{"\n"}</div>
                      To see how these factors have contributed to happiness over the years, click on a datapoint on the axis, to see the axis presented on the line chart below!
                      <div className='new-line'>{"\n"}</div>
                      <img src={Inst3} width={260} height={250}/>
                      
          </ModalBody>
        </Modal></CardHeader>
                    <CardBody>
                    {this.state.radarData.length > 0?<D3RadarPlot data={this.state.radarData} writeValue={this.writeValue}/>:<div>Please select a country from the dropdown!</div>}
                    <Multiselect onSelect={this.selectValue} onRemove={this.removeValue} isObject = {true} displayValue="value" options = {numberCountries} selectionLimit={3} />
                            </CardBody>
                  </Card>
              
              </Col>




            </Row>
            <Row>
            <Card style={{ height:'20rem'}}>

                    <CardHeader>How did  the influence of <b>{this.state.happinessFactor}</b> change over time?</CardHeader>
                    <CardBody>
                    <LineChart key={this.state.happinessAccessor} data={this.state.lineData}/>
                    </CardBody>
                    </Card>


            </Row>

          </Container>
      </div>




    );

  }

}

export default Dashboard;