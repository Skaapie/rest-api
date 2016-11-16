'use strict';

module.exports = {

  hasRole(roleArr) {
    if (!roleArr) {
      throw new Error('hasRole required roles need to be set.');
    }

    return function(req, res, next) {
      if (roleArr.indexOf(req.token.role) !== -1) {
        next();
      } else {
        res.status(403).json({ errors: ['You are not authorized to access this resource.'] });
      }
    };
  }
}