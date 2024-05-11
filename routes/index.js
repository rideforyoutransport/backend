const router = require('express').Router();


router.use('/admin', require('./admin'));
router.use('/admin/vendor', require('./admin/vendor'));
router.use('/admin/booking', require('./admin/booking'));
router.use('/admin/trips', require('./admin/trips'));
router.use('/admin/stops', require('./admin/stops'));
router.use('/admin/vehicle', require('./admin/vehicle'));
router.use('/admin/driver', require('./admin/driver'));
router.use('/admin/user', require('./admin/user'));
//router.use('/admin/promocode', require('./admin/promocode'));

router.use('/user', require('./user'));
router.use('/user/booking', require('./user/booking'));
router.use('/user/trips', require('./user/trips'));
router.use('/user/stops', require('./user/stops'));

router.use('/driver', require('./driver'));

router.use('/vendor', require('./vendor'));




module.exports = router;
 