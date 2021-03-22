const express = require('express');
const Router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const functions = require('firebase-functions');
const admin = {
  id: 'admin',
  loginID: 'admin',
  password: functions.config().admin.pw,
};

// @route POST auth
// @desc Auth Admin
// @access Public
Router.post('/', async (req, res) => {
  const { loginID, password } = req.body;

  // Simple validation
  if (!loginID || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // Check for existing user
  if (loginID !== admin.loginID) {
    return res.status(400).json({ msg: 'User does not exist' });
  }
  const comparePassword = await bcrypt.compare(password, admin.password);
  if (!comparePassword) {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }
  jwt.sign(
    { id: admin.id },
    functions.config().jwt.secret,
    { expiresIn: 3600 },
    (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user: {
          id: admin.id,
          loginID: admin.loginID,
        },
      });
    }
  );
});

// @route GET auth/user
// @desc Get User Data
// @access Private
Router.get('/', auth, (req, res) => {
  res.json({
    id: admin.id,
    loginID: admin.loginID,
  });
});

module.exports = Router;
