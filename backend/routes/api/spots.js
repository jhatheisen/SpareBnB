const express = require('express');

const { Spot, User, Review, sequelize } = require('../../db/models');

const { Sequelize } = require('sequelize');

const router = express.Router();

router.get('/', async (req, res) => {

  // aggregate loading
  const spots = await Spot.findAll();

  for (spot of spots) {
    const id = spot.dataValues.id

    const reviews = await Review.findAll({
      where: {
        spotId: id
      }
    });

    let stars = 0;
    let count = 0;

    for (review of reviews) {
      stars += review.dataValues.stars;
      count++;
    }

    const avgRating = stars / count;

    if (!isNaN(avgRating)) {
      spot.dataValues.avgRating = avgRating;
    }
  }

  res.json(
    {
    Spots: spots,
    }
  );
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const spotsById = await Spot.findByPk(id, {
    include: User
  });

  res.json(
    {
      Spots: spotsById
    }
  )
});

router.get('/user', async (req, res) => {

});

module.exports = router;
