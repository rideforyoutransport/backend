const logger = require('../../helpers/logger');
const utils = require('../../helpers/utils.js');
const router = require('express').Router();

const {pb,pb_authStore} = require('../../pocketbase/pocketbase.js');

router.post('/login', async (req, res) => {

    try {
        console.log(req.body);
        const adminData = await pb.collection('Admin').authWithPassword(req.body.email, req.body.password);
        console.log(adminData);


        return res.send({
            success: true,
            result: { id: adminData.record.id, token: adminData.token }
        })

    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response && error.response.message ? error.response.message: "Something went wrong! Please try again later!"
        })
    }

})
// Reset password will work from chrome/ application URL not from the Application
router.post('/resetPassword', async (req, res) => {
    try {
        await pb.collection('admin').requestPasswordReset(req.body.email);
        return res.send({
            success: true,
            message: "Please Open your email and Click on verify"
        })

    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response && error.response.message ? error.response.message: "Something went wrong! Please try again later!"
        })
    }
})



router.use('/vendor', require('./vendor'));
router.use('/vehicle', require('./vehicle'));
router.use('/driver', require('./driver'));
router.use('/booking', require('./booking'));
router.use('/user', require('./user'));
router.use('/promoCode', require('./promoCode'));
router.use('/stops', require('./stops'));
router.use('/trips', require('./trips'));
router.use('/requestedTrips', require('./requestedTrips'));

module.exports = router;
