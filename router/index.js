'use strict';

let authRoutes = require('./routes/auth');
let usersRoutes = require('./routes/users');

module.exports = (app) => {
  app.get('/', function(req, res) {
      res.json({ message: 'Api runnning.' });
  });

  app.use('/auth', authRoutes);
  app.use('/users', usersRoutes);

};