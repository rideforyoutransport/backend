const router = require('express').Router();


router.use('/admin', require('./admin'));
router.use('/user', require('./user'));
router.use('/booking', require('./booking'));
router.use('/trips', require('./trips'));


module.exports = router;
 