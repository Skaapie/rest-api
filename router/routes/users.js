'use strict';

let router = require('express').Router();
let usersController = require('../controllers/users');

router.get('/', usersController.index);// Get all users.
router.post('/', usersController.createUser);// Create a new user.

module.exports = router;