"use strict";
// Controlling response from it is sent back 




module.exports = {
  name: "ResponseControl",
  register: (server, options) => {
    server.ext("onPreResponse", (req, h) => {

        console.log(req.auth)

      let res = {};

      if (req.response.isBoom) {

        res = {
          success: false,
          data: {},
          error: req.response.output.payload
        };
        return res;

      }

      return (res = {
        success: true,
        data: req.response.source
      });
    });
  }
};
