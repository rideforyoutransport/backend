const logger = require('../../helpers/logger.js');
const utils = require('../../helpers/utils.js');
const router = require('express').Router();

const {pb,pb_authStore}  = require('../../pocketbase/pocketbase.js');

let multer = require('multer');
let upload = multer();


let userData = {};

const createOrUpdateUserData = (uData) => {

    userData.name = uData.name;
    userData.email = uData.email;
    userData.password = uData.password;
    userData.passwordConfirm = uData.password;
    userData.phoneNumber = uData.phoneNumber;
    userData.emailVisibility = true;
    if (uData["oldPassword"]) {
        userData.oldPassword = uData["oldPassword"];
    }

    return userData;
}

router.post('/login', async (req, res) => {

    try {
        const adminData = await pb.collection('users').authWithPassword(req.body.email ? req.body.email : req.body.userName, req.body.password);
        // console.log(adminData);

        if(adminData.record.verified){
            // console.log(pb.authStore);

            return res.send({
                success: true,
                result: { id: adminData.record.id, token: adminData.token }
            })
        } else {
            return res.send({
                success: false,
                verified: 0,
                message: "Email Verification Required!"
            })
        }

    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response && error.response.message ? error.response.message: "Something went wrong! Please try again later!"
        })
    }

})
// verify email via the auth token , not 6digit code 
router.post('/verify', async (req, res) => {
    try {
        await pb.collection('users').requestVerification(req.body.email);
        return res.send({
            success: true,
            message: "Email sent. Please open your email and Click on verify"
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
        await pb.collection('users').requestPasswordReset(req.body.email);
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

router.post('/register', async (req, res) => {

    let user = createOrUpdateUserData(req.body);
    try {
        const record = await pb.collection('users').create(user);
        await pb.collection('users').requestVerification(user.email);
        const adminData = await pb.collection('users').authWithPassword(req.body.email, req.body.password);

        console.log(record);
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
    // const result = await pb.collection('users').listAuthMethods();

})

router.post('/registerNotify', async (req, res) => {

    let user = createOrUpdateUserData(req.body);
    try {
        const record = await pb.collection('users').create(user);
        await pb.collection('users').requestVerification(user.email);
        const adminData = await pb.collection('users').authWithPassword(req.body.email, req.body.password);

        console.log(record);
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
    // const result = await pb.collection('users').listAuthMethods();

})
router.patch('/:id', async (req, res) => {

    const params = Object.assign({}, req.params);
    let user = createOrUpdateUserData(req.body);
    try {
        const record = await pb.collection('users').update(params.id, user);

        return res.send({
            success: true,
            message: "Details updated!"
        })

    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response && error.response.message ? error.response.message: "Something went wrong! Please try again later!"
        })
    }
    // const result = await pb.collection('users').listAuthMethods();

})

router.get('/all', async (req, res) => {
    try {
        const records = await pb.collection('users').getList(req.body.from, req.body.to);
        return res.send({
            success: true,
            result: records
        })
    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response && error.response.message ? error.response.message: "Something went wrong! Please try again later!"
        })
    }

})

router.get('/:id', async (req, res) => {
    try {
        const params = Object.assign({}, req.params);
        const records = await pb.collection('users').getOne(params.id);
        return res.send({
            success: true,
            result: records
        })
    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response && error.response.message ? error.response.message: "Something went wrong! Please try again later!"
        })
    }

})

router.delete('/:id', async (req, res) => {
    try {
        const params = Object.assign({}, req.params);
        const records = await pb.collection('users').update(params.id, {deleted: true});
        return res.send({
            success: true,
            message: "Account Deleted"
        })
    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response && error.response.message ? error.response.message: "Something went wrong! Please try again later!"
        })
    }

})

router.use('/booking', require('./booking'));
router.use('/trips', require('./trips'));
router.use('/requestedTrips', require('./requestedTrips'));
router.use('/stops', require('./stops'));


module.exports = router;
