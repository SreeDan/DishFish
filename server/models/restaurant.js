const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  id: String,
  name: String,
  location: String,
  hours: String, 
  location: {
    type: { type: String },
    coordinates: [Number]
  }
})

RestaurantSchema.index({ location: "2dsphere" })

const Restaurant = mongoose.model('Restaurant', RestaurantSchema)

module.exports = { Restaurant }