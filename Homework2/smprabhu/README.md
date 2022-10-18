
# CO2-Dashboard
In this assignment, I have used the CO2 emission dataset. This dashboard is built with the simple skeleton - a very barebones framework for web development as it is not using any of the modern frameworks.

# Requirements

Your task is to create a visualization dashboard. The design of this dashboard should facilitate the exploration of a dataset in an effective or interesting way.

This dashboard must have three visualization views.
Your visualizations should include at least one advanced visualization method.
The visualizations should depict different dimensions or aspects of the dataset to be examined.
The three visualizations should fit on a fullscreen browser. Consider where each view should be placed while designing the layout of your dashboard.
Legends for each view need to be provided as well as labels for axis.
One of your three views should serve as an overview of the data.
Choose appropriate visual encodings.
Color choice matters and has an effect on the interpretability of the visualization. Depending on the data the type of color scale you will use will change (categorical, linear, etc).
Carefully consider the design for each encoding that you will use and its effectiveness for portraying the data. Depending on the data you are visualizing, certain pairings of marks and channels will be more effective.
The design paradigm you will be following is referred to as focus + context.

A focus view is where the data of most interest is displayed at full size or with full details.
A context view is a peripheral zone, an overview, where elements are displayed at reduced size or in a simplified way. For each view, you need to provide one or more visual interface widgets (e.g., a dropdown menu or slider) for changing the parameters of the visualization. For example, a drop-down menu can be provided for selecting the data dimension that maps to the x-axis of a scatter plot or the color encoding used in a 2D heatmap.

# Setup 

Run This Commands To View The Dashboard Locally : 

Change the current working directory to the location where you want the cloned directory to be made : 
```
cd <your_directory>
```
Clone the repository and install http-server module : 
```
git clone <this_repository>
npm install -g http-server
http-server -p 3000
```
Install the list of packages specified in requirements.txt.

Once you are at the same directory as package.json run the following command. 

```
npm i
```

Now You Can view the dashboard on http://localhost:3000


