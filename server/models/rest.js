const mongoose = require('mongoose');

const Rest = new mongoose.Schema({
  id: {
    type: String,
    unique: true
  }, 
  name: String,
  location: String,
  hours: String, 
  location: {
    type: String,
    coordinates: [longitude, latitude]
  }
})

module.exports = mongoose.model('RestModel', Rest)
