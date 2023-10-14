const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true
  },
  name: String
})

module.exports = mongoose.model('Tag', TagSchema) 
