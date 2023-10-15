const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  id: String, 
  name: String,
  restaurantId: String,
  description: String,
  price: Number,
  bucket: String, // GCP Bucket
  pathToFile: String, // GCP File Name,
  signedURL: String,
  tag: [Number] // put id's here as reference to tags
})

const Food = mongoose.model('Food', FoodSchema);

module.exports =  { Food }
