'use strict';

// storing all routes files in route to register them in one shot 

const glob = require('glob');

let routes= []

let files = glob.sync(__dirname+'**/*.js')

files.filter(file => file.indexOf('index.js') === -1 ) .forEach((file) =>{
    routes = routes.concat(require(file))
})


module.exports= routes;