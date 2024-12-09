require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./router')
const { errorHandler } = require('./middleware/errorHandler');
require('./config/db');

const app = express();

app.use(express.static('public'));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '100mb', extended: true }));
app.use(express.json());

// middleware
// app.use((req, res, next) => {
//   // auth middleware will be here
//   next();
// });

app.use('/api/v1', router);

// error handler
app.use((error, req, res, next) => {
  errorHandler(error, req, res, next);
});

module.exports = app;
