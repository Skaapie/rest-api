'use strict';

const models = require('../../models');

module.exports = {

  index(req, res) {
    models.User.findAll({
      attributes: {
        exclude: ['password_hash']
      },
      raw: true
    })
    .then((usersArr) => {
      res.send(usersArr);
    })
    .catch((err) => {
      // TODO : Handle.
      console.log(err);
    });
  },

  createUser(req, res) {
    models.User.create(req.body).then((user) => {
      res.json(user);
    }).catch((err) => {
      // TODO : Handle.
      console.log(err);
    });
  }

};