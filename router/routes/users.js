'use strict';

let router = require('express').Router();
let controller = require('../controllers/users');
let auth = require('../middleware/auth');

// All authenticated users.
router.get('/:id', auth.isAuthenticated(), controller.get);// User for self, admin for any.

// Admin only.
router.get('/', auth.hasRole(['Admin']), controller.index); // Get all users.
router.delete('/:id', auth.hasRole(['Admin']), controller.delete); // Delete specific user.
router.post('/', auth.hasRole(['Admin']), controller.create);// Create a new user.

module.exports = router;