const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true
  },
  name: String
})

const Tag = mongoose.model('Tag', TagSchema);

module.exports = { Tag } 
