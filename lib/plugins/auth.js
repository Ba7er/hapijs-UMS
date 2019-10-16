'use strict';


const User = require("../models/users");
const boom = require('@hapi/boom')

exports.plugin = {
    name: 'auth',
    register: async (server, options) =>{


        const validate = async (decoded, req) =>{
            try{
                const user = await User.findById(decoded._id)
                if(user){
                    return {isValid: true, credentials: {
                        id: decoded._id
                    }}
                }else {
                    return {isValid: false}
                }
                
            }catch (err){
                throw boom.badRequest(e);
            }
            
        }


        await server.register(require('hapi-auth-jwt2'));

        server.auth.strategy('jwt', 'jwt', {
            key: options.JWT_key,
            validate: validate,
            verifyOptions: { algorithms: [ 'HS256' ] }
        })
    }
}