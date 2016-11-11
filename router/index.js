'use strict';

let usersRoutes = require('./routes/users');

module.exports = (app) => {
  app.get('/', function(req, res) {
      res.json({ message: 'Api runnning.' });
  });

  app.use('/users', usersRoutes);

};