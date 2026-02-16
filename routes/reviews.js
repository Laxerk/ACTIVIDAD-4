const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Movie = require('../models/Movie');

router.post('/', async (req, res) => {
  try {
    const { movie, user, rating, comment } = req.body;

    const existingReview = await Review.findOne({ movie, user });

    if (existingReview) {
      return res.status(400).json({
        message: "Este usuario ya reseñó esta película"
      });
    }

    const review = new Review({
      movie,
      user,
      rating,
      comment
    });

    await review.save();

    const reviews = await Review.find({ movie });
    const avg =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Movie.findByIdAndUpdate(movie, { averageRating: avg });

    res.json(review);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear reseña" });
  }
});

router.get('/movie/:movieId', async (req, res) => {
  const reviews = await Review.find({ movie: req.params.movieId })
    .populate('user', 'name')
    .populate('movie', 'title');

  res.json(reviews);
});

router.delete('/:movieId/:userId', async (req, res) => {
  try {
    const { movieId, userId } = req.params;

    const deleted = await Review.findOneAndDelete({
      movie: movieId,
      user: userId
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Reseña no encontrada"
      });
    }

    const reviews = await Review.find({ movie: movieId });

    const avg = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    await Movie.findByIdAndUpdate(movieId, { averageRating: avg });

    res.json({ message: "Reseña eliminada" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar reseña" });
  }
});


module.exports = router;
