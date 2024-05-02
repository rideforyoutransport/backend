const router = require('express').Router();


router.use('/admin', require('./admin'));
router.use('/user', require('./user'));
router.use('/vendor', require('./vendor'));
router.use('/booking', require('./booking'));
router.use('/trips', require('./trips'));
router.use('/stops', require('./stops'));
router.use('/vehicle', require('./vehicle'));
router.use('/driver', require('./driver'));




module.exports = router;
 