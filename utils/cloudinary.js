const cloudinary = require('cloudinary').v2;
const functions = require('firebase-functions');

cloudinary.config({
  cloud_name: functions.config().cloudinary.name,
  api_key: functions.config().cloudinary.key,
  api_secret: functions.config().cloudinary.secret,
});

module.exports = cloudinary;
