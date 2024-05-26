const logger = require('../../../helpers/logger.js');
const utils = require('../../../helpers/utils.js');
const router = require('express').Router();

const {pb,pb_authStore}  = require('../../../pocketbase/pocketbase.js');


let vendorData = {};


const createOrUpdatevendorData = (vData) => {

    vendorData.vendorname = vData.vendorName;
    vendorData.name = vData.name;
    vendorData.email = vData.email;
    vendorData.password = vData.password;
    vendorData.passwordConfirm = vData.password;
    vendorData.vendorname = vData.vendorname;
    vendorData.phoneNumber = vData.phoneNumber;
    vendorData.emailVisibility = true;
    if (vData["oldPassword"]) {
        vendorData.oldPassword = vData["oldPassword"];
    }

    return vendorData;
}

router.post('/login', async (req, res) => {

    try {
        const vendorData = await pb.collection('vendor').authWithPassword(req.body.email ? req.body.email : req.body.userName, req.body.password);
        // console.log(vendorData);
        // console.log(pb.authStore.isValid);
        // console.log(pb.authStore.token);
        // console.log(pb.authStore.model.id);
        return res.send({
            success: true,
            result: vendorData
        })

    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response.message
        })
    }
    // const result = await pb.collection('vendor').listAuthMethods();

})
router.post('/register', async (req, res) => {

    let vendor = createOrUpdatevendorData(req.body);
    try {
        const record = await pb.collection('vendor').create(vendor);
        await pb.collection('vendor').requestVerification(vendor.email);

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
    // const result = await pb.collection('vendor').listAuthMethods();

})
router.patch('/:id', async (req, res) => {

    const params = Object.assign({}, req.params);
    let vendor = createOrUpdatevendorData(req.body);
    console.log({ vendor });
    try {
        const record = await pb.collection('vendor').update(params.id, vendor);

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
    // const result = await pb.collection('vendor').listAuthMethods();

})

router.post('/all', async (req, res) => {
    try {
        const records = await pb.collection('vendor').getList(req.body.from, req.body.to, {filter: 'deleted=false'});
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

// verify email via the auth token , not 6digit code 
router.post('/verify', async (req, res) => {
    try {
        await pb.collection('vendor').requestVerification(req.body.email);
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
        await pb.collection('vendor').requestPasswordReset(req.body.email);
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

router.get('/:id', async (req, res) => {
    try {
        const params = Object.assign({}, req.params);
        const records = await pb.collection('vendor').getOne(params.id);
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
        const records = await pb.collection('vendor').update(params.id, {deleted: true});
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

router.post('/deleteMultiple', async (req, res) => {
    try {
        const idArr = req.body.ids;
        idArr.map(async (id)=>{
            await pb.collection('vendor').update(id, {deleted: true});
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
