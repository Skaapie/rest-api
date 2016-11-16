'use strict';

var jwt = require('jsonwebtoken');
let env = process.env.NODE_ENV || 'development';
const config = require('../../config')[env];

module.exports = {

  isAuthenticated() {

    return function(req, res, next) {
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
    };

  }

};