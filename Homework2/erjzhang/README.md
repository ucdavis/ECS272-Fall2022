# VUE 3.0 Skeleton
This is is a tempalate for working in Vue.js.
Vue 3.0 sits between react and basic javascript depending on the developers comfort level.
For this class stick with **Options API** rather than **Composition**.
If Vue is too weird, feel free to use the simpler template.
We offer Vue, since it is a modern framework that companies use so it could be useful for you if one of your projects in this class could make use of it.

OPTION API DOCUMENTATION [link](https://vuejs.org/api/#options-api)

## Note
You are not required to use Vue.js to solve HW2 and 3.
However, if you don't want to use it I would recommend using the Simple-Skeleton template.
If you have personal experience with another framework and would prefer to use that please go ahead, just let me know how to compile and run that.


# Install Dependencies
Assuming you have node.js installed. (If not go do that :) )
Install [Node](https://nodejs.org/en/).

Install from the package.json via terminal.
`npm i`

To install additional packages based on your needs
`npm install <package-name>`

## Run application 
`npm start`



## Some of the libraries attached
For UI components this template comes with [Ant Design](https://antdv.com/)
For icons etc. [Font-Awesome](https://fontawesome.com/)
Animations [Animate css](https://animate.style/)

D3 is included as well.

For fetching data from an API [Axios](https://axios-http.com/docs/intro)

# Files you have to care about
Most of these files you can ignore.
The files under `src/` are your concern.
The root script file for VUE will be `index.ts` which is the initial typescript/javascript file that instatinate our single page application.
The root file for all **development** needs with be `App.vue`

You will be adding to and editing files under the **Views** Directory.
Within the pages directory you really only need one page  **Pages/Home.vue** 
For components you may have several based on your design feel free to add what makes sense to you under **Components**