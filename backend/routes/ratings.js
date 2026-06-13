const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');

router.post('/', async (req, res) => {
  try {
    const rating = new Rating(req.body);
    await rating.save();
    res.status(201).json(rating);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save rating' });
  }
});

router.get('/:pharmacyId', async (req, res) => {
  try {
    const ratings = await Rating.find({ pharmacyId: req.params.pharmacyId });
    const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length || 0;
    res.json({ ratings, avgRating, count: ratings.length });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch ratings' });
  }
});

module.exports = router;