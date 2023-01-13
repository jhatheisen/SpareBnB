const express = require('express');

const { Spot, User, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const router = express.Router();

const Sequelize = require('sequelize');

const Op = Sequelize.Op;

// delete spot image by spot image id
router.delete('/:id', async (req, res) => {

    // 1. authenticate
    if (req.user === null) {
      res.status(401);
      return res.json(
        {
          message: "Authentication required",
          statusCode: 401
        }
      );
    }

    // 2. check if Spot Image exists

    const spotImageId = req.params.id;
    const targetImage = await SpotImage.findByPk(spotImageId);

    // cannot find spot image
    if (!targetImage) {
      res.status(404);
      return res.json({
        message: "Spot Image couldn't be found",
        statusCode: 404
      });
    }

    const spotId = targetImage.dataValues.spotId;

    const spot = await Spot.findByPk(spotId);

    const ownerId = spot.dataValues.ownerId;

    const userId = req.user.id;

    if (ownerId !== userId) {
      res.status(403);
      return res.json(
        {
          message: "Forbidden, cannot delete other people's Spot Images",
          statusCode: 403
        }
      );
    }

    await targetImage.destroy();

    return res.json({
      message: "Successfully deleted",
      statusCode: 200
    });
});

  module.exports = router;
