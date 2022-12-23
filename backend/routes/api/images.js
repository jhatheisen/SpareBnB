const express = require('express');

const { Spot, User, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const router = express.Router();

const Sequelize = require('sequelize');

const Op = Sequelize.Op;

// delete review image by id
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

  // 2. check if Review Image exists

  const reviewImageId = req.params.id;
  const targetImage = await ReviewImage.findByPk(reviewImageId);

  // cannot find spot image
  if (!targetImage) {
    res.status(404);
    return res.json({
      message: "Review Image couldn't be found",
      statusCode: 404
    });
  }

  const reviewId = targetImage.dataValues.reviewId;

  const review = await Review.findByPk(reviewId);

  const userId = review.dataValues.userId;

  const currUserId = req.user.id;

  if (userId !== currUserId) {
    res.status(403);
    return res.json(
      {
        message: "Forbidden, cannot delete other people's Review Images",
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
