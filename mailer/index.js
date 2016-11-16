'use strict';

const Q = require('Q');
const env = process.env.NODE_ENV || "development";
const config = require('../config.js')[env];

const nodemailer = require('nodemailer');
const path = require('path');


const transporter = nodemailer.createTransport(config.mailer);

const EmailTemplate = require('email-templates').EmailTemplate;
const templatesDir = path.resolve(__dirname, 'templates');

const account_verify_template = new EmailTemplate(path.join(templatesDir, 'account_verify'));
const account_reset_template = new EmailTemplate(path.join(templatesDir, 'account_reset'));

function validateDataForEmail(data) {
  let deferred = Q.defer();

  if(!data.email || data.email === '') {
    deferred.reject({ message: 'Email is required.' });
  } else {
    deferred.resolve(data);
  }

  return deferred.promise;
}

module.exports = {

  sendAccountVerificationEmail(data) {

    data.verifyUrl = `${config.baseUrl}/auth/verify?verifyToken=${data.verifyToken}`;

    return validateDataForEmail(data)
    .then((verifiedData) => {
      return account_verify_template.render(verifiedData);
    })
    .then((renderResults) => {
      let mailData = {
          from: config.mailer.defaultFromAddress,
          to: data.email,
          subject: 'Please verify your account.',
          text: renderResults.text,
          html: renderResults.html
      };
      return transporter.sendMail(mailData);
    });
  },

  sendAccountResetEmail(data) {

    data.resetUrl = `${config.baseUrl}/auth/reset?resetToken=${data.resetToken}`;

    return validateDataForEmail(data)
    .then((verifiedData) => {
      return account_reset_template.render(verifiedData);
    })
    .then((renderResults) => {
      let mailData = {
          from: config.mailer.defaultFromAddress,
          to: data.email,
          subject: 'Reset your password.',
          text: renderResults.text,
          html: renderResults.html
      };
      return transporter.sendMail(mailData);
    });
  }

};
