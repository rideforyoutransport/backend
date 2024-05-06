const logger = require('../../helpers/logger.js');
const utils = require('../../helpers/utils.js');
const router = require('express').Router();

const PocketBase = require('pocketbase/cjs')
var pb_port = process.env.PB_PORT || 'http://127.0.0.1:8090';
const pb = new PocketBase(pb_port);


let driverData = {};


const createOrUpdateDriverData = (dData) => {

    driverData.name = dData.name;
    driverData.email = dData.email;
    driverData.emailVisibility = dData.emailVisibility;
    driverData.rating = dData.rating;
    driverData.totalTrips = dData.totalTrips;
    driverData.vendorId = dData.vendorId;
    driverData.number = dData.number;
    driverData.username = dData.username;
    driverData.password = dData.password;
    driverData.passwordConfirm = dData.password;
    driverData.phoneNumber = dData.phoneNumber;
    if (dData["oldPassword"]) {
        driverData.oldPassword = dData["oldPassword"];
    }

    return driverData;
}

router.post('/login', async (req, res) => {

    try {
        const adminData = await pb.collection('driver').authWithPassword(req.body.email, req.body.password);
        console.log(adminData);

        return res.send({
            success: true,
            result: { id: adminData.record.id, token: adminData.token }
        })

    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response.message
        })
    }

})

// verify email via the auth token , not 6digit code 
router.post('/verify', async (req, res) => {
    try {
        await pb.collection('driver').requestVerification(req.body.email);
        return res.send({
            success: true,
            result: "Please Open your email and Click on verify"
        })

    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response.message
        })
    }
})
// Reset password will work from chrome/ application URL not from the Application
router.post('/resetPassword', async (req, res) => {
    try {
        await pb.collection('driver').requestPasswordReset(req.body.email);
        return res.send({
            success: true,
            result: "Please Open your email and Click on verify"
        })

    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response.message
        })
    }
})


router.patch('/:id', async (req, res) => {

    const params = Object.assign({}, req.params);
    let driver = createOrUpdateDriverData(req.body);
    console.log({ driver });
    try {
        const record = await pb.collection('driver').update(params.id, driver);

        return res.send({
            success: true,
            result: record
        })

    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response.message
        })
    }
    // const result = await pb.collection('driver').listAuthMethods();

})

router.post('/all', async (req, res) => {
    try {
        const records = await pb.collection('driver').getList(req.body.from, req.body.to);

        return res.send({
            success: true,
            result: records
        })
    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response.message
        })
    }

})


router.post('/allBookings', async (req, res) => {
    try {
        const records = await pb.collection('bookings').getList(req.body.from, req.body.to, { fields: 'id' });

        console.log(pb.authStore);

        return res.send({
            success: true,
            result: records
        })
    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response.message
        })
    }

})


router.get('/:id', async (req, res) => {
    try {
        const params = Object.assign({}, req.params);
        const records = await pb.collection('driver').getOne(params.id);
        return res.send({
            success: true,
            result: records
        })
    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response.message
        })
    }

})

router.delete('/:id', async (req, res) => {
    try {
        const params = Object.assign({}, req.params);
        const records = await pb.collection('driver').delete(params.id);
        return res.send({
            success: true,
            result: records
        })
    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response.message
        })
    }

})

module.exports = router;



