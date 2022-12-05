import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, CardBody, 
  CardHeader, Button, Dropdown, 
  DropdownItem, DropdownToggle, DropdownMenu,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink} from 'reactstrap';
import React  from "react";
import { BrowserRouter, Routes, Route}
    from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Happiness from './components/Happiness';
import Geographical from './components/Geographical';
import Temporal from './components/Temporal';



class App extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false

    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render(){
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">World Happiness Report</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/geographical">Average Global Happiness</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/temporal">Global Happiness by Year</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/dashboard">Factors that Affect Happiness</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Happiness />} />
          <Route path="/geographical" element={<Geographical />} />
          <Route path="/temporal" element={<Temporal />} />
          <Route path="/dashboard" element={<Dashboard />} />

        </Routes>
       </BrowserRouter>
         
      </div>




    );

  }

}

export default App;
