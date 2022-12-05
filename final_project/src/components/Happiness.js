import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, CardBody, 
  CardHeader} from 'reactstrap';
import React  from "react";
import Smiley from '../smiley-2979107_1280.jpg'

class Happiness extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

 

  render(){
    return (
      <div>
          <Container>
            <Row lg={8}>
              <Col>
              <Card>
                    <CardHeader>What is happiness?</CardHeader>
                    <CardBody>
                        <img src={Smiley} width={260} height={200}/>
                        <div className='new-line'>{"\n"}</div>
                        <div className='new-line'><b>Happiness</b> is an emotional state characterized by feelings of joy, satisfaction, contentment, and fulfillment. While happiness has many different definitions, it is often described as involving positive emotions and life satisfaction.</div>
                        <div className='new-line'>{"\n"}</div>
                        <div className='new-line'>As intuitive as it sounds, people, from philosophers and scientists to an average person,
                                                  pondered about happiness and its influence for ages for its intimate ties to human well-being.
                                                  While the major body of happiness research has been largely in the domains of economists and
                                                  psychologists, more research is being conducted in other areas, such as health and social
                                                  policies. Has happiness affected health and well-being? What about labor-market behaviors or
                                                  political uprisings? How is it affected by economic progress or poverty? How has COVID-19
                                                  shaped global happiness?
                                                  <div className='new-line'>{"\n"}</div>     
                                                  <div className='new-line'> Whether you are interested in a specific question predicting, mediating, or determining
                                                  happiness or are simply curious about global happiness, we encourage you to explore the data
                                                  through our visualization tool to gain interesting insights.
                                                  For those interested, extensive descriptive reports on the annual World Happiness Data are 
                                                  <a href="https://worldhappiness.report/"> available online</a>.</div>
                    </div></CardBody>
              </Card>
              </Col>

            <Col lg={6}>
            <Card>
                    <CardHeader>How is Happiness Being Measured?</CardHeader>
                    <CardBody>There are six predictors of happiness in our dataset: economic production, social support, life expectancy, freedom, absence of corruption, and generosity.
                      <ol>
                        <li><b>Economic Production</b> is Gross Domestic Product (GDP) per capita, generated by World Bank Data and OECD data.</li>
                        <li><b>Social Support </b>is a national average of whether an individual has social support from their friends and family in times of distress, generated by GWP data.</li>
                        <li><b>Life Expectancy</b> is healthy life expectancy at birth, generated by World Health Organization (WHO) Global Health Observatory data.</li>
                        <li><b>Freedom</b> is people’s perspective about their satisfaction in the freedom to make choices in their life, generated by GWP data</li>
                        <li><b>Absence of Corruption</b> is people’s perceptions of corruption in their government in a country. For countries where this data is missing, the report uses perceived corruption of businesses for the corruption-perception measure, generated by GWP data.</li>
                        <li><b>Generosity</b> is people’s response to the question, “Have you donated money to a charity in the past month?” generated by GWP data.</li>
                      </ol>
                            </CardBody>
                  </Card>
            
            </Col>




            </Row>
            <Row>
            <Card>
                    <CardHeader>Our data</CardHeader>
                    We accessed the World Happiness Report data from Kaggle for our analysis. The World Happiness Report is an extensive annual survey originally collected from the Gallup World Poll's Global Happiness Center. Individual-level population data is collected per country, and population-representative weights are applied to the figures to generate a national average. It contains the state of global happiness of more than 150 countries and their six indicators contributing to the happiness coefficient. We use data from the years 2015 to 2021 in our data. visualization.
                    <div className='new-line'>{"\n"}</div>
                    For those who are curious, World Happiness Reports provides more detailed information about each component.
                    <CardBody>

                            </CardBody>
                  </Card>


            </Row>

          </Container>
      </div>




    );

  }

}

export default Happiness;