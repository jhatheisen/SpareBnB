const express = require('express');

const { Spot } = require('../../db/models');

const router = express.Router();

router.get('/', async (req, res) => {

  const spots = await Spot.findAll();

  res.json(
    {
    Spots: spots
    }
  );
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const spotsById = await Spot.findByPk(id);

  res.json(
    {
      Spots: spotsById
    }
  )
});

module.exports = router;
