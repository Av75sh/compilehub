const router = require('express').Router();
const compile = require('../controllers/compileController');

router.post('/compile', compile);

module.exports = router;