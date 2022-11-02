# Basic Webpack + ES6 Example
This is a very barebones framework for web development as it is not using any of the modern frameworks seen in industry (i.e., React, Angular, or Vue).


## Requirements
To use and run this template you need to have [node.js](https://nodejs.org/en/) downloaded and set up on your computer.
The version should be the latest.


## Set up
Node js enables us to utilize various javascript packages and libaries, essenitally the same as `pip install` or `apt-get`.
To install a libary we must be in terminal and get to the folder with **package.json** or where we intend the top-level of our project will be.


### Installing packages
To install new packages
`npm install <packagename>`

### Installing existing packages
This template comes with an existing list of packages that should be sufficient for the homework.
To install those first make sure within terminal you are the correct directory with package.json
You can check this by running  `ls` in linux/osx or `dir` on windows powershell.

Once you are at the same directory as package.json run the following command.
`npm i`


## Starting the system
You can launch this system after installing the packages.
`npm run start`
Which examines the package.json file, goes to scripts and executes the line that starts our project under "start".
Once it starts running your dashboard etc will be shown at (Project is running at http://localhost:3000/)
Go to that url in either Chrome or FireFox.
