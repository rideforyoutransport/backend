const router = require('express').Router();


router.use('/admin', require('./admin'));
router.use('/user', require('./user'));
router.use('/driver', require('./driver'));
router.use('/vendor', require('./vendor'));




module.exports = router;
 