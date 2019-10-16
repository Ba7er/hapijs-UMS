'use strict';


const manifest = {
    server:{
        host: process.env.HOST,
        port: process.env.PORT
    },
    register: {
        plugins:[
            {
                plugin: './lib/plugins/auth',
                options: {
                    JWT_key: process.env.JWT_SECRET
                }
            },
            {
                plugin: './lib/plugins/formatter'
            },
            {
                plugin: './lib/plugins/mongoose',
                options:{
                    MONGO_DB_URL : process.env.MONGODB_URL
                } 
            },
        ],
        
    }
}

module.exports = manifest