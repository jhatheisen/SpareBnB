// backend/routes/api/users.js
const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/vaidation');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4})
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('firstName')
    .exists({ checkFalsy: true})
    .withMessage('First Name is required'),
  check('lastName')
    .exists({ checkFalsy: true})
    .withMessage('Last Name is required'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must exist and be 6 characters or more.'),
  handleValidationErrors
];

// sign up
router.post('/', validateSignup, async (req, res) => {

  const { email, password, username, firstName, lastName } = req.body;
  const user = await User.signup({email, username, firstName, lastName, password});

  await setTokenCookie(res, user);

  user.dataValues.token = req.headers['xsrf-token'];

  return res.json(user);
})



module.exports = router;
