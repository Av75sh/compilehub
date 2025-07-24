const express = require('express');
const { register, login, logout, getMe } = require('../controllers/authController');
const { compile } = require('../controllers/compileController');
const { getUserStats } = require('../controllers/userController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getMe);

router.post('/compile', compile);

router.get('/user/stats', getUserStats);

module.exports = router;