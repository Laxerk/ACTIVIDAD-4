const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});


reviewSchema.index({ movie: 1, user: 1 }, { unique: true });
module.exports = mongoose.model('Review', reviewSchema);
