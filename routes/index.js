const router = require('express').Router();


router.use('/admin', require('./admin'));
router.use('/user', require('./user'));
router.use('/driver', require('./driver'));
router.use('/vendor', require('./vendor'));
router.use('/chats', require('./chats'));



module.exports = router;
 