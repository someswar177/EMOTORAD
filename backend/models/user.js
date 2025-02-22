const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = Schema({
  googleId : {
    type: String,
    unique: true,
    sparse: true,
  },
  name : {
    type: String,
    required : true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // required: true,
  },
  picture: { 
    type: String 
  },
},{
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;