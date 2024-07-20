const router = require('express').Router();


router.use('/admin', require('./admin'));
router.use('/user', require('./user'));
router.use('/driver', require('./driver'));
router.use('/vendor', require('./vendor'));
router.use('/chats', require('./chats'));
router.use('/pay', require('./pay'));
router.use('/fb', require('./firebase'));
router.use('/others', require('./others'));



module.exports = router;
 