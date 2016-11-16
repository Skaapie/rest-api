'use strict';

let router = require('express').Router();
let controller = require('../controllers/auth');

router.post('/login', controller.login);
router.get('/verify', controller.verify);
router.post('/forgot', controller.forgot);
router.post('/reset', controller.reset);
router.post('/signup', controller.signup);

module.exports = router;