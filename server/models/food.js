const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  id: String, 
  name: String,
  restuarantId: String,
  description: String,
  price: Number,
  tag: [Number] // put id's here as reference to tags
})

const User = mongoose.model('User', UserSchema);

module.exports =  { User }
