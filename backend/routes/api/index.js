// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const reviewRouter = require('./review.js');
const bookingsRouter = require('./bookings.js');
const imagesRouter = require('./images.js');
const spotImagesRouter = require('./spot-images.js');
const { restoreUser } = require("../../utils/auth.js");

// router.post('/test', function(req, res) {
//   res.json({ requestBody: req.body });
// });

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter);

router.use('/reviews', reviewRouter);

router.use('/bookings', bookingsRouter);

router.use('/review-images', imagesRouter);

router.use('/spot-images', spotImagesRouter);

module.exports = router;
