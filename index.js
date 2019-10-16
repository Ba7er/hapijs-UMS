'use strict';


const Glue = require('@hapi/glue')
const Manifest = require('./config/manifest')
const routes = require('./lib/routes/index')


const options = {relativeTo: __dirname}

const startServer = async () =>{
    try{
        //composing server using Glue and the manifest file 
        const server = await Glue.compose(Manifest, options);

       //loading routes 
        await server.route(routes)
       
      
        // starting the servet 
        await server.start();
        console.log('Hapi User app is ON!')

    }catch (err) {
        console.log(err)
        process.exit(1)
    }
}

startServer()
  