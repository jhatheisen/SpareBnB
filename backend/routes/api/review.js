// backend/routes/api/review.js

const express = require('express');
const router = express.Router();

const { Review, ReviewImage, User, Spot } = require('../../db/models');

// create an image for a review by review id
router.post('/:id/images', async (req, res) => {

  // authentication 401
  if (req.user === null) {
    res.status(401);
    return res.json(
      {
        message: "Authentication required",
        statusCode: 401
      }
    );
  }

  const reviewId = req.params.id;
  const review = await Review.findByPk(reviewId);

  // doesn't exist
  if (!review) {
    res.status(404);
    return res.json(
      {
        message: "Review couldn't be found",
        statusCode: 404
      }
    );
  }

  // not owned by user
  if (review.dataValues.userId !== req.user.id) {
    res.status(403);
    return res.json(
      {
        message: "Forbidden",
        statusCode: 403
      }
    );
  }

  const allImagesForId = await ReviewImage.findAll({
    where: {
      reviewId
    }
  });

  // max images
  if (allImagesForId.length >= 10) {
    res.status(403);
    return res.json(
      {
        message: "Maximum number of images for this resource was reached",
        statusCode: 403
      }
    );
  }

  const { url, previewImage } = req.body;

  const newImage = await ReviewImage.create({
    reviewId,
    url,
    previewImage,
  });

  delete newImage.dataValues.createdAt;
  delete newImage.dataValues.updatedAt;

  return res.json(newImage);

});

// get all reviews for current user
router.get('/current', async (req, res) => {

  // authentication 401
  if (req.user === null) {
    res.status(401);
    return res.json(
      {
        message: "Authentication required",
        statusCode: 401
      }
    );
  }

  // find all reviews
  const reviews = await Review.findAll({
    where: {
      userId: req.user.id
    },
    include: [
      { model: User },
      {
        model: Spot,
        attributes: {exclude: ['createdAt', 'updatedAt']}
      },
      {
        model: ReviewImage,
        attributes: {exclude: ['createdAt', 'updatedAt']}
      }
    ]
  });

  res.json({Reviews: reviews})
});

// edit review by review id
router.put('/:id', async (req, res) => {

  // authentication 401
  if (req.user === null) {
    res.status(401);
    return res.json(
      {
        message: "Authentication required",
        statusCode: 401
      }
    );
  }

  const reviewId = req.params.id;
  const reviewById = await Review.findByPk(reviewId);

  // doesn't exist
  if (!reviewById) {
    res.status(404);
    return res.json(
      {
        message: "Review couldn't be found",
        statusCode: 404
      }
    );
  }

  // not owned by user
  if (reviewById.dataValues.userId !== req.user.id) {
    res.status(403);
    return res.json(
      {
        message: "Forbidden",
        statusCode: 403
      }
    );
  }

  const { review, stars } = req.body;

  // for validation errors
  const errors = [];

  if (!review || review.length > 255) errors.push("Review text is required and must be under 255 characters.");
  if (!stars || stars < 1 || stars > 5) errors.push("Stars must be an integer from 1 to 5");

  if (errors.length) {
    res.status(400);
    return res.json({
      message: "Validation error",
      statusCode: 400,
      errors
    });
  }

  reviewById.set({
    review,
    stars
  });

  await reviewById.save();

  return res.json(reviewById);
});

// delete review by id
router.delete('/:id', async (req, res) => {
  
  // authentication 401
  if (req.user === null) {
    res.status(401);
    return res.json(
      {
        message: "Authentication required",
        statusCode: 401
      }
    );
  }

  const reviewId = req.params.id;
  const reviewById = await Review.findByPk(reviewId);

  // doesn't exist
  if (!reviewById) {
    res.status(404);
    return res.json(
      {
        message: "Review couldn't be found",
        statusCode: 404
      }
    );
  }

  // not owned by user
  if (reviewById.dataValues.userId !== req.user.id) {
    res.status(403);
    return res.json(
      {
        message: "Forbidden",
        statusCode: 403
      }
    );
  }

  await reviewById.destroy();

  return res.json({
    message: "Successfully deleted",
    statusCode: 200
  });
});

module.exports = router;
