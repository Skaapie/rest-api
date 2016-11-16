'use strict';

let router = require('express').Router();
let controller = require('../controllers/users');

// Unauthenticated.
router.post('/', controller.create);// Create a new user.
router.post('/signup', controller.create);

// All users.
router.get('/:id', controller.get);// User for self, admin for any.

// Admin only.
router.get('/', controller.index); // Get all users.
router.delete('/:id', controller.delete); // Delete specific user.

module.exports = router;