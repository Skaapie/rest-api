'use strict';

let authRoutes = require('./routes/auth');
let usersRoutes = require('./routes/users');
let isAuthenticated = require('./middleware/token_validator').isAuthenticated();
let hasRole = require('./middleware/role_validator').hasRole;

module.exports = (app) => {
  app.get('/', function(req, res) {
      res.json({ message: 'Api runnning.' });
  });

  //###################################################################
  // PUBLIC ROUTES.
  //###################################################################
  app.use('/api/auth', authRoutes);


  //###################################################################
  // MIDDLEWARE.
  //###################################################################
  // route middleware to verify a token. Anything underneath this will be protected by token.
  // apply the routes to our application with the prefix /api
  app.use('/api', isAuthenticated);

  //###################################################################
  // PROTECTED ROUTES. No access without a token.
  //###################################################################
  app.use('/api/users', usersRoutes);

  app.get('/api/admin', hasRole(['Admin']), function(req, res) {
      res.json({ message: 'You are admin.' });
  });

};