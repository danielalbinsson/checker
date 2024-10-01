const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true },
  frequency: {type:Number, required: true},
  dateAdded: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Url', urlSchema);
