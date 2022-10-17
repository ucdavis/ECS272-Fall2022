import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./App.scss";
import { Sankey } from "./sankey";
import * as d3 from "d3";
import { Async } from "react-async";
import { BarChart } from "./bar";
import { SatisfactionContext } from "./satisfaction-context";
import { MultiSelectSort } from "./sortSelect";

const SANKEY_LIMIT = 6;

const DefaultColorOn = "Satisfaction";
const Colors = {
  Satisfaction: (column, fallback = "gray") =>
    ({ satisfied: "#33a02c", "neutral or dissatisfied": "gray" }[column] ??
    fallback),
  Gender: (column, fallback = "gray") =>
    ({ Female: "#e377c2", Male: "#1f77b4" }[column] ?? fallback),
  "Customer Type": (column, fallback = "gray") =>
    ({ "Loyal Customer": "#fc8d62", "Disloyal Customer": "gray" }[column] ??
    fallback),
  "Type of Travel": (column, fallback = "gray") =>
    ({ "Business Travel": "#1f77b4", "Personal Travel": "#b2df8a" }[column] ??
    fallback),
  Class: (column, fallback = "gray") =>
    ({ Business: "#1f78b4", Eco: "#b2df8a", "Eco Plus": "#7570b3" }[column] ??
    fallback),
};

const DEFAULT_COLOR_GEN = (column, fallback = "gray") => fallback;

export const SatisfactionTitle = [
  "Unanswered",
  "Very Dissatisfied",
  "Dissatisfied",
  "Natural",
  "Satisfied",
  "Very Satisfied",
];

const SankeyOptions = [
  "Gender",
  "Customer Type",
  "Type of Travel",
  "Class",
  "Inflight wifi service",
  "Departure/Arrival time convenient",
  "Ease of Online booking",
  "Gate location",
  "Food and drink",
  "Online boarding",
  "Seat comfort",
  "Inflight entertainment",
  "On-board service",
  "Leg room service",
  "Baggage handling",
  "Checkin service",
  "Inflight service",
  "Cleanliness",
  "Satisfaction",
].sort();

const SankeyOptionsDefault = [
  "Gender",
  "Customer Type",
  "Type of Travel",
  "Class",
  "Satisfaction",
];

const SurveyColumns = [
  "Inflight wifi service",
  "Departure/Arrival time convenient",
  "Ease of Online booking",
  "Gate location",
  "Food and drink",
  "Online boarding",
  "Seat comfort",
  "Inflight entertainment",
  "On-board service",
  "Leg room service",
  "Baggage handling",
  "Checkin service",
  "Inflight service",
  "Cleanliness",
].sort();

async function fetchData() {
  return await d3.csv("/data.csv", d3.autoType);
}

export default function App() {
  const [focusCol, setFocusCol] = useState("Baggage handling");
  const [sankeyNodes, setSankeyNodes] = useState(SankeyOptionsDefault);
  const [colorOn, setColorOn] = useState(DefaultColorOn);
  const config = {
    column: colorOn,
    color: Colors[colorOn] ?? DEFAULT_COLOR_GEN,
  };
  return (
    <Async promiseFn={fetchData}>
      {({ data, error, isLoading }) => {
        if (isLoading) return "Loading...";
        if (error) return `Error: ${error.message}`;
        if (data)
          return (
            <Container fluid>
              <Row>
                <Col>
                  <Container fluid>
                    <Row>
                      <Col className="bar-container">
                        <BarChart
                          data={data}
                          column={focusCol}
                          config={config}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col className="sankey-container">
                        <div className="sankey-toolkit">
                          <label>Nodes</label>
                          <MultiSelectSort
                            limit={SANKEY_LIMIT}
                            options={SankeyOptions}
                            onSelect={setSankeyNodes}
                            selected={sankeyNodes}
                          />
                        </div>
                        <small>
                          Select upto {SANKEY_LIMIT} nodes, drag and drop to
                          reorder.
                        </small>
                        <Sankey
                          data={data}
                          columns={sankeyNodes}
                          config={config}
                        />
                      </Col>
                    </Row>
                  </Container>
                </Col>
                <Col xs="2" className="satisfaction-container">
                  <div className="toolkit">
                    <h5>Global Widget</h5>
                    <div>
                      <label>Color on</label>
                      <select
                        value={colorOn}
                        onChange={(e) => setColorOn(e.target.value)}
                      >
                        {Object.keys(Colors)
                          .sort()
                          .map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <SatisfactionContext
                    data={data}
                    columns={SurveyColumns}
                    config={config}
                    selected={focusCol}
                    onSelect={setFocusCol}
                  />
                </Col>
              </Row>
            </Container>
          );
        return null;
      }}
    </Async>
  );
}
