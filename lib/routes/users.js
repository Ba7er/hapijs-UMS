"use strict";

const User = require("../models/users");
const Joi = require("@hapi/joi");
const boom = require("@hapi/boom");

module.exports = [
  {
    method: "POST",
    path: "/users/register",
    config: {
      validate: {
        payload: Joi.object({
          first_name: Joi.string(),
          last_name: Joi.string().required(),
          email: Joi.string()
            .email()
            .required(),
          password: Joi.string().required()
        })
      },
      pre: [
        {
          assign: "emailCheck",
          method: async function(req, h) {
            try {
              const conditions = {
                email: req.payload.email
              };
              const user = await User.findOne(conditions);
              if (user) {
                throw boom.conflict("Email already in use.");
              }
              return user;
            } catch (e) {
              throw boom.badRequest(e);
            }
          }
        }
      ]
    },
    handler: async (req, h) => {
      const user = new User(req.payload);

      try {
        await user.save();
        return h.response(user).code(200);
        
      } catch (err) {
        throw boom.badRequest(err);
      }
    }
  },
  {
    method: "POST",
    path: "/users/login",
    handler: async (req, h) => {
      try {
        const user = await User.findByCredentials(
          req.payload.email,
          req.payload.password
        );
        const token = await user.generateAuthtoken();
        return h
          .response({ message: "Logged in Successfully!", token })
          .code(201);
      } catch (e) {
        throw boom.badRequest(e);
      }
    },
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string()
            .email()
            .required(),
          password: Joi.string().required()
        })
      }
    }
  },
  {
    method: "GET",
    path: "/users/profile",
    config: { auth: "jwt" },
    handler: async (req, h) => {
      try {
        const userId = req.auth.credentials;
        const user = await User.findById(userId.id);
        return h.response(user).code(200);
      } catch (e) {
        boom.badRequest(e);
      }
    }
  }
];

