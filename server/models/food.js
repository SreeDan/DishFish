const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  id: String, 
  name: String,
  restaurant: String,
  restaurantId: String,
  description: String,
  price: Number,
  calories: Number,
  spicy: Boolean,
  vegetarian: Boolean,
  vegan: Boolean,
  glutenFree: Boolean,
  mealCategory: String,
  cuisine: String,
  bucket: String, // GCP Bucket
  pathToFile: String, // GCP File Name,
  signedURL: String,
})

const Food = mongoose.model('Food', FoodSchema);

module.exports =  { Food }
