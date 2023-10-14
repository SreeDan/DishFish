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

const Restaurant = mongoose.model('Restaurant', RestaurantSchema)

module.exports = { Restaurant }

/*
const newUser = new User({
        id: id,
        username: username,
        password: hash,
        salt: salt,
        tag: []
    })
        
    const insertedUser = await newUser.save()
*/