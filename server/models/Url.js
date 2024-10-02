const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for each check (status code and timestamp)
const checkSchema = new Schema({
  statusCode: { type: Number, required: true },
  checkedAt: { type: Date, default: Date.now }
});

const urlSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true },
  frequency: { type: Number, required: true },
  dateAdded: { type: Date, default: Date.now },
  checks: { type: [checkSchema], default: [] }  // Ensure checks defaults to an empty array
});

module.exports = mongoose.model('Url', urlSchema);
