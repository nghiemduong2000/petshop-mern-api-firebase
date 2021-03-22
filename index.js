const functions = require('firebase-functions');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const sessionMiddleware = require('./middlewares/session');
const cors = require('cors');

const app = express();

app.use(express.json());

app.use(cors());
const db = functions.config().mongo.uri;

// Connect to Mongo
mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const { connection } = mongoose;
connection.once('open', () => {
  console.log('Mongo database connection established successfully');
});
app.use(cookieParser(functions.config().session.secret));

app.use('/api/products', sessionMiddleware, require('./routes/products'));
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/session', require('./routes/session'));

exports.app = functions.https.onRequest(app);
