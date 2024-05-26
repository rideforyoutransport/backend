const logger = require('../../../helpers/logger.js');
const utils = require('../../../helpers/utils.js');
const router = require('express').Router();

// const PocketBase = require('pocketbase/cjs')
// var pb_port = process.env.PB_PORT || 'http://127.0.0.1:8090';
// const pb = new PocketBase(pb_port);
const {pb,pb_authStore}  = require('../../../pocketbase/pocketbase.js');



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
            message: error.response.message
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
            message: error.response.message
        })
    }
    // const result = await pb.collection('users').listAuthMethods();

})
router.patch('/:id', async (req, res) => {

    const params = Object.assign({}, req.params);
    let user = createOrUpdateUserData(req.body);
    console.log({ user });
    try {
        const record = await pb.collection('users').update(params.id, user);

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
    // const result = await pb.collection('users').listAuthMethods();

})

router.post('/all', async (req, res) => {
    try {
        const records = await pb.collection('users').getList(req.body.from, req.body.to, {filter: 'deleted=false'});
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
        const records = await pb.collection('users').getOne(params.id);
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
        const records = await pb.collection('users').update(params.id, {deleted: true});
        return res.send({
            success: true,
            message: "Account Deleted"
        })
    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response.message
        })
    }

})


router.post('/deleteMultiple', async (req, res) => {
    try {
        console.log(req.body);
        const idArr = req.body.ids;
        
        idArr.map(async (id)=>{
            console.log(id);
            await pb.collection('users').update(id, {deleted: true});
        })
        return res.send({
            success: true,
            result: {message: "Deleted successfully!"}
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
