const logger = require('../../helpers/logger.js');
const utils = require('../../helpers/utils.js');
const router = require('express').Router();

const PocketBase = require('pocketbase/cjs')
var pb_port = process.env.PB_PORT || 'http://127.0.0.1:8090';
const pb = new PocketBase(pb_port);


let driverData = {};

const createOrUpdateDriverData = (uData) => {

    driverData.name = uData.name;
    driverData.email = uData.email;
    driverData.password = uData.password;
    driverData.passwordConfirm = uData.password;
    driverData.phoneNumber = uData.phoneNumber;
    if (uData["oldPassword"]) {
        driverData.oldPassword = uData["oldPassword"];
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
            error: error
        })
    }
    // const result = await pb.collection('driver').listAuthMethods();

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
            error: error
        })
    }
    // const result = await pb.collection('driver').listAuthMethods();

})

router.get('/all', async (req, res) => {
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
            error: error
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
            error: error
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
            error: error
        })
    }

})

module.exports = router;
