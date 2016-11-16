'use strict';

module.exports = {

  isValidUUID(uuid) {
    let uuidValidateRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    return uuidValidateRegex.test(uuid);
  },

  handleValidationErrors(res, statusCode) {
    statusCode = statusCode || 400;

    return function(validationError) {
      let friendlyValidationErrorMessages = [];

      // Sanitize.
      let mainMsg = validationError.message.replace('Validation error: ', '');
      friendlyValidationErrorMessages.push(mainMsg);

      validationError.errors.forEach((validationErrorItem) => {
        if (friendlyValidationErrorMessages.indexOf(validationErrorItem.message) === -1) {
          friendlyValidationErrorMessages.push(validationErrorItem.message);
        }
      });

      res.status(statusCode).json({
        errors: friendlyValidationErrorMessages
      });
    };
  }

};