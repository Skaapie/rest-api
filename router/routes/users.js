'use strict';

let router = require('express').Router();
let controller = require('../controllers/users');

// Admin only.
router.get('/', controller.index); // Get all users.
router.delete('/:id', controller.delete); // Delete specific user.

// Unauthenticated.
router.post('/', controller.create);// Create a new user.

// All users.
router.get('/:id', controller.get);// User for self, admin for any.

module.exports = router;