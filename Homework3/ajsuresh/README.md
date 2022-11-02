# Global Terrorism Database
This is a dashboard created through React-JS which examines the various facets of the Global Terrorism Database (1970 - 2017)

## Steps to build/run dashboard

In the project directory, you please run (please make sure to include the --legacy-peer-deps):

### `npm install --legacy-peer-deps`

Then, after all dependencies are installed, to run the project:

### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Development Screen Size
24-inch (4480 × 2520)

## Data Exploration

### World Map
Displayed is continent wise data for number of incidents
1) Please click on a continent to zoom in (animation to show effect of more granular data) and view country-wise data for the selected continent
2) You can also hover over each country to reveal a tooltip
3) Context view: Radar plot of most common incident types updates on selecting a continent
4) Click on the "World View" button to go back to the continent-wise view

Active Bugs:
1) Tooltip event occurs before data for the tooltip loads. Need to move away and move back in for the right information.

Possible extensions:
1) Additional map repositioning and zoom out animations for country-wise to continent-wise transition
2) Attempting to add markers on latitude/longitude for where events have occured (initial attempt showed too many overlapping data points which needed additional filtering)


### Radar Plot
-- Select a checkbox to show a plot for a continent - the visualization shows the types of attacks most prominent in each region of the world
-- Hover over datapoints to see actual value
-- Data also plotted when interacting with world map

Active Bugs:
1) Select/de-select logic to pop/push to the data array occasionally breaks
2) North America needs to remain selected by default - no error handling within D3RadarPlot to render an empty chart
3) Checkboxes should always show what the currently selected object is - not the case all the time

Possible extensions
1) d3-brush based diagonal selection zoom for the smaller data points or an axis scroll

### Bar Chart
-- This view acts as a timeline to show the most prominent terrorist groups over the years. Please drag the slider to view the data transform over the years!



