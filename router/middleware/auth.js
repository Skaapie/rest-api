'use strict';
let jwt = require('jsonwebtoken');
let composable_middleware = require('composable-middleware');
let env = process.env.NODE_ENV || 'development';
const config = require('../../config')[env];
const models = require('../../models');

exports.isAuthenticated = function() {

  return composable_middleware()
    // Validate the jwt token.
    .use((req, res, next) => {
      let token = req.body.token || req.query.token || req.headers['x-access-token'];

      if (!token) {
        res.status(401).json({ errors: ['No access token provided.'] });
      } else {
        jwt.verify(token, config.jwt.secret, (err, decoded) => {
          if (err) {
            res.status(403).json({ errors: ['Token invalid.'] });
          } else {
            req.token = decoded;
            next();
          }
        });
      }
    })
    // Attach the logged in user to the request.
    .use((req, res, next) => {
      models.User.findById(req.token.id)
      .then((user) => {
        if(!user) {
          return res.status(401).end();
        }
        req.user = user;
        next();
      })
      .catch(err => next(err));
    });
};

exports.hasRole = function(roleArr) {
  if (!roleArr) {
    throw new Error('hasRole required roles need to be set.');
  }

  return composable_middleware()
    .use(exports.isAuthenticated())
    .use((req, res, next) => {
      // Using the req.token.role is a bad idea.
      // The users role may have been changed and even though their token may be outdated
      // it could still be valid until it expires.
      if (roleArr.indexOf(req.user.role) !== -1) {
        next();
      } else {
        res.status(403).json({ errors: ['You are not authorized to access this resource.',
                                        'If you believe this is a mistake, please re-authorize.'] });
      }
    });
};

