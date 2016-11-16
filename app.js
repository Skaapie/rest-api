'use strict';

let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let winston = require('winston');
let expressWinston = require('express-winston');
let env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];

let models = require('./models');
// Force changes to db without migration.
// models.syncDB();

// =======================
// Configuration =========
// =======================

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// express-winston logger makes sense BEFORE the router.
switch(env) {
  case 'development':
    app.use(expressWinston.logger({
      transports: [
        new winston.transports.Console({
          json: true,
          colorize: true
        })
      ],
      meta: true, // optional: control whether you want to log the meta data about the request (default to true)
      msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
      expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
      colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
      ignoreRoute: (req, res) => { return false; } // optional: allows to skip some log messages based on request and/or response
    }));
  break;
  case 'test':
  break;
  case 'production':
  break;
}

// =======================
// Routes ================
// =======================
var router = require('./router')(app);

 // express-winston errorLogger makes sense AFTER the router.
app.use(expressWinston.errorLogger({
      transports: [
        new winston.transports.Console({
          json: true,
          colorize: true
        })
      ]
    }));


// Error Handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).send('Unhandled error in global error handler.');
});

// =======================
// start the server ======
// =======================
app.listen(config.port, () => {
  console.log('Server running on port:', config.port);
});

module.exports = app;