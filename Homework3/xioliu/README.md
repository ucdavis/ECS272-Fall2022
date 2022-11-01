# Readme

This system is built with [ReactJS](https://reactjs.org/). Please follow the following steps to install the environment:

1. **Install Node**:

  ```
  brew install node
  brew install watchman
  ```

2. **Install Yarn**:

   ```
   npm install -g yarn
   ```

3. **Run Project**:

   ```
   cd CS272-Fall2022/Homework3/xioliu
   yarn
   yarn start
   ```

If everything goes well, you will be good to see the dashboard. Please email me at: xioliu@ucdavis.edu if you met any problems. Thank you so much!

#### Instructions of how to Interact with the Dashboard

1. User Satisfaction Score Distribution (Histogram)
   * This histogram is implemented with **zoom and pan** interaction. You can simply use the mouse wheel to zoom the histogram to see the sub-distribution. You could also drag the zoomed histogram to see your interested part.
2. User Detailed Scores(Parallel Coordinates Plot)
   * This histogram is implemented with the **selection** interaction and the **filter** transition. The default graph will show the detailed scores of both satisfied and dissatisfied customers' scores. When you move the mouse on either green lines or red lines. The plot will pre-view the scores of the group you selected. At this time, you can click the mouse to freeze the view. If the view is frozen, you can unfreeze it with another mouse click. If you want to return to the default view, double-click one of the axis label.
