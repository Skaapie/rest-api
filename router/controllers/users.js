'use strict';

const models = require('../../models');
const helpers = require('../helpers');

module.exports = {

  index(req, res, next) {
    models.User.findAll({ attributes: ['id', 'email', 'role'], raw: true })
    .then(usersArr => res.status(200).json(usersArr))
    .catch(err => next(err));
  },

  get(req, res, next) {
    let userId = req.params.id;

    if (helpers.isValidUUID(userId) === false) {
      return res.status(400).json({ message: 'User id not a valid format.' });
    }

    models.User.findById(userId, { attributes: ['id', 'email', 'role'], raw: true })
    .then((user) => {
      if(!user) {
        return res.status(404).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
  },

  delete(req, res, next) {
    let userId = req.params.id;

    if (helpers.isValidUUID(userId) === false) {
      return res.status(400).json({ errors: ['User id not a valid format.'] });
    }

    models.User.findById(userId, { attributes: ['id', 'email', 'role'] })
    .then((user) => {
      if(user) {
        return user.destroy().then(() => {
          res.status(200).json({ message: 'User successfully deleted.' });
        });
      } else {
        res.status(404).json({ errors: [`User with id '${userId}' does not exist.`] }).end();
      }
    })
    .catch(err => next(err));
  },

  create(req, res, next) {
    models.User.create(req.body)
    .then((user) => {
      let plainUser = user.get({ plain: true });

      // Strip out and return only essentials.
      let returnObj = {
        id: plainUser.id,
        email: plainUser.email,
        role: plainUser.role
      };

      res.status(200).json(returnObj);
    })
    .catch(models.Sequelize.ValidationError, helpers.handleValidationErrors(res))
    .catch(err => next(err));
  }

};