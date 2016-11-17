'use strict';

let authRoutes = require('./routes/auth');
let usersRoutes = require('./routes/users');
let auth = require('./middleware/auth');

module.exports = (app) => {
  app.get('/', function(req, res) {
      res.json({ message: 'Api runnning.' });
  });

  //###################################################################
  // PUBLIC ROUTES.
  //###################################################################
  app.use('/api/auth', authRoutes);

  app.use('/api/users', usersRoutes);

  app.get('/api/admin', auth.hasRole(['Admin']), function(req, res) {
      res.json({ message: 'You are admin.' });
  });

};