'use strict';

const models = require('../../models');
const jwt = require('jsonwebtoken');
let env = process.env.NODE_ENV || 'development';
const config = require('../../config')[env];
const mailer = require('../../mailer');
const helpers = require('../helpers');

module.exports = {

  login(req, res, next) {
    let validationErrors = [];
    if (!req.body.email || req.body.email === '') {
      validationErrors.push('Email is required.');
    }
    if (!req.body.password || req.body.password === '') {
      validationErrors.push('Password is required.');
    }

    if (validationErrors.length > 0) {
      res.status(400).json({
        errors: validationErrors
      });
    } else {
      models.User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (!user) {
          res.status(404).json({ errors: ['User with that email does not exist.'] });
        } else {
          user.comparePassword(req.body.password, (err, isMatch) => {
            if(err) {
              next(err);
            } else {
              if(isMatch === true) {
                var tokenPayload = {
                  id: user.id,
                  email: user.email,
                  role: user.role
                };
                var token = jwt.sign(tokenPayload, config.jwt.secret, {
                  expiresIn: config.jwt.expiresIn
                });

                res.status(200).json({ token: token });
              } else {
                res.status(401).json({ errors: ['Password incorrect.'] });
              }
            }
          });
        }
      })
      .catch(err => next(err));
    }
  },

  verify(req, res, next) {
    if (!req.query.verifyToken || req.query.verifyToken === '' || req.query.verifyToken.length !== 40) {
      res.status(400).send({ errors: ['Verification token invalid.'] });
    } else {
      models.User.findOne({ where: { verifyToken: req.query.verifyToken } })
      .then((user) => {
        if (!user) {
          res.status(400).json({ errors: ['Verification token invalid. Please request a new one.'] });
        } else {
          return user.update({ verifyToken: null, verified: true });
        }
      })
      .then((updatedUser) => {
        res.status(200).json({ message: `Account for '${updatedUser.email}' verified.` });
      })
      .catch(err => next(err));
    }
  },

  signup(req, res, next) {
    models.User.create(req.body)
    .then((user) => {
      return mailer.sendAccountVerificationEmail(user.get({ plain: true }));
    }).then((info) => {
      // If it gets to this point, assume email sending worked.
      console.log(info.response.toString());
      res.status(200).json({ message: 'Account created.' });
    })
    .catch(models.Sequelize.ValidationError, helpers.handleValidationErrors(res))
    .catch(err => next(err));
  },

  forgot(req, res, next) {
    if (!req.body.email || req.body.email === '') {
      res.status(400).json({ errors: ['Email is required.'] });
    } else {
      models.User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (!user) {
          // Obviously you should not really do this because people can brute force
          // fish for "valid" emails.
          res.status(404).json({ errors: ['No account with that email exists.'] });
          // Probly better:
          // res.status(200).json({ message: 'Email sent if user exists.' });
        } else {
          user.genResetToken()
          .then((userWithToken) => {
            return userWithToken.save();
          })
          .then((savedUser) => {
            return mailer.sendAccountResetEmail(savedUser.get({ plain: true }));
          }).then((info) => {
            // If it gets to this point, assume email sending worked.
            // console.log(info.response.toString());
            res.status(200).json({ message: 'Email sent if user exists.' });
          })
          .catch(err => next(err));
        }
      })
      .catch(err => next(err));
    }
  },

  reset(req, res, next) {
    let validationErrors = [];
    if (!req.query.resetToken || req.query.resetToken === '' || req.query.resetToken.length !== 40) {
      validationErrors.push('Reset token format invalid.');
    }
    if (!req.body.newPassword || req.body.newPassword === '') {
      validationErrors.push('New password is required.');
    }

    if (validationErrors.length > 0) {
      res.status(400).json({
        errors: validationErrors
      });
    } else {
      models.User.findOne({ where: { resetToken: req.query.resetToken } })
      .then((user) => {
        if (!user) {
          res.status(400).json({ errors: ['Reset token invalid. Please request a new one.'] });
        } else {
          return user.update({ resetToken: null, password: req.body.newPassword });
        }
      })
      .then((updatedUser) => {
        res.status(200).json({ message: `Password reset successful. Please log in again.` });
      })
      .catch(err => next(err));
    }

  }

};