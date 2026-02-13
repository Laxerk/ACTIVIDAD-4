const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Movie = require('../models/Movie');

router.post('/', async (req, res) => {
  const review = new Review(req.body);
  await review.save();

  const reviews = await Review.find({ movie: review.movie });
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await Movie.findByIdAndUpdate(review.movie, { averageRating: avg });

  res.json(review);
});

router.get('/movie/:movieId', async (req, res) => {
  const reviews = await Review.find({ movie: req.params.movieId })
    .populate('user', 'name')
    .populate('movie', 'title');

  res.json(reviews);
});

module.exports = router;
