const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: String, 
  username: String,
  password: String,
  salt: String,
  email: String,
  tag: [Number] // put id's here as reference to tags
})

const User = mongoose.model('User', UserSchema);

module.exports =  { User }
