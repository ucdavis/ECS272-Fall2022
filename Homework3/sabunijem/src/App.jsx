import { useState, useEffect } from "react";
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
    ({ "Loyal Customer": "red", "Disloyal Customer": "gray" }[column] ??
    fallback),
  "Type of Travel": (column, fallback = "gray") =>
    ({ "Business Travel": "#1f77b4", "Personal Travel": "#33a02c" }[column] ??
    fallback),
  Class: (column, fallback = "gray") =>
    ({ Business: "#1f78b4", Eco: "#33a02c", "Eco Plus": "#7570b3" }[column] ??
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

function groupBy(rawData, colorFn, colorOn, filters) {
  const groups = [...new Set(rawData.map((d) => d[colorOn]))];
  filters = Object.values(filters);
  if (filters.length)
    rawData = rawData.filter((d) => filters.every((filter) => filter(d)));

  const groupedData = {};
  for (let data of rawData) {
    for (let column of SurveyColumns) {
      groupedData[column] = groupedData[column] ?? {
        column,
        groups: groups.reduce(
          (prior, key) => ({
            ...prior,
            [key]: {
              group: key,
              color: colorFn(key),
              data: [0, 0, 0, 0, 0, 0],
            },
          }),
          {}
        ),
      };

      let colData = groupedData[column].groups;
      const groupKey = data[colorOn];
      colData[groupKey].data[data[column]] += 1;
    }
  }

  const data = Object.values(groupedData);
  data.forEach((d) => {
    d.groups = Object.values(d.groups);
    d.groups.sort((a, b) => a.group.localeCompare(b.group));
  });

  return {
    data,
    rawData,
    groups: groups.sort(),
  };
}

function Dashboard({ data }) {
  const [focusCol, setFocusCol] = useState("Baggage handling");
  const [filters, setFilters] = useState({});
  const [sankeyNodes, setSankeyNodes] = useState(SankeyOptionsDefault);
  const [colorOn, setColorOn] = useState(DefaultColorOn);

  const colorFn = Colors[colorOn] ?? DEFAULT_COLOR_GEN;
  const config = {
    column: colorOn,
    color: colorFn,
  };

  const [groupedData, setGroupedData] = useState({ rawData: data });
  useEffect(() => {
    setGroupedData(groupBy(data, colorFn, colorOn, filters));
  }, [data, colorFn, colorOn, filters]);

  useEffect(() => {
    const sankeyFilters = Object.entries(filters).filter(
      ([_key, d]) => d.sankey !== undefined
    );

    let changed = false;
    const newFilters = { ...filters };
    for (let [key] of sankeyFilters) {
      if (!sankeyNodes.includes(key)) {
        changed = true;
        delete newFilters[key];
      }
    }

    if (changed) setFilters(newFilters);
  }, [sankeyNodes, filters]);

  return (
    <Container fluid>
      <Row>
        <Col>
          <Container fluid>
            <Row>
              <Col className="bar-container">
                <BarChart
                  groupedData={groupedData}
                  column={focusCol}
                  colorFn={colorFn}
                  setFilters={setFilters}
                  filters={filters}
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
                    forcedSelection={colorOn}
                  />
                </div>
                <small>
                  Select upto {SANKEY_LIMIT} nodes, drag and drop to reorder.
                </small>
                <Sankey
                  data={groupedData.rawData}
                  columns={sankeyNodes}
                  config={config}
                  setColorOn={setColorOn}
                  filters={filters}
                  setFilters={setFilters}
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
            data={groupedData}
            colorFn={config.color}
            columns={SurveyColumns}
            selected={focusCol}
            onSelect={setFocusCol}
            filters={filters}
            setFilters={setFilters}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default function App() {
  useEffect(() => {
    alert("")
  });

  return (
    <Async promiseFn={fetchData}>
      {({ data, error, isLoading }) => {
        if (isLoading) return "Loading...";
        if (error) return `Error: ${error.message}`;
        if (data) return <Dashboard data={data} />;
        return null;
      }}
    </Async>
  );
}
