'use strict';

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: false,
      trim: true
    },
    last_name: {
      type: String,
      required: false,
      trim: true
    },
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      unique: true
    },
    password: {
      type: String,
      required: false,
      trim: true,
      minlength: 7
    },
    tokens: [
      {
        token: {
          type: String,
          required: false
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

//// to return specific user details when sending resposnes back to clients , like we dont want the password to be sent back in the response 
userSchema.methods.toJSON =  function(){
  const user = this
  const userObject = user.toObject()
  delete userObject.password
  delete userObject._id
  delete userObject.__v
  delete userObject.tokens
  return userObject
}

userSchema.statics.findByCredentials = async (email, password) => {
  try {
    
    const user = await User.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Wrong email or password");
    }

    return user;
  } catch (e) {
    throw new Error("Wrong email or password");
  }
};

userSchema.methods.generateAuthtoken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  // to add many tokens
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.pre("save", async function(next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
const User = mongoose.model("users", userSchema);
module.exports = User
