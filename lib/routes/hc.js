'use strict';

// Health Check endpoint

module.exports= [
    {
        method:'GET',
        path:'/ping',
        handler: (req, h) =>{
            
            return {message:'pong'}
        }
    }
]