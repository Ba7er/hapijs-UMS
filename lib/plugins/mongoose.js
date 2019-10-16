"use strict";

const Mongoose = require("mongoose");

exports.plugin = {
  register: (server, options) => {
    Mongoose.set("useCreateIndex", true);
    Mongoose.connect(
      options.MONGO_DB_URL,
      { useNewUrlParser: true },
      function(err) {
        if (err) {
          console.log(err);
          throw err;
        }
      }
    );
    // When the connection is connected
    Mongoose.connection.on("connected", function() {
      console.log("Mongo Database connected");
    });
    // When the connection is disconnected
    Mongoose.connection.on("disconnected", function() {
      console.log(" Mongo Database disconnected");
    });
    // If the node process ends, close the mongoose connection
    process.on("SIGINT", function() {
      Mongoose.connection.close(function() {
        console.log("Mongo Database disconnected through app termination");
        process.exit(0);
      });
    });
  },

  name: "mongoose"
};
