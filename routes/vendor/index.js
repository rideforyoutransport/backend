const logger = require('../../helpers/logger.js');
const utils = require('../../helpers/utils.js');
const router = require('express').Router();

const PocketBase = require('pocketbase/cjs')
var pb_port = process.env.PB_PORT || 'http://127.0.0.1:8090';
const pb = new PocketBase(pb_port);


let vendorData = {};


const createOrUpdatevendorData =(vData)=>{

    vendorData.vendorname=vData.vendorName;
    vendorData.name=vData.name;
    vendorData.email=vData.email;
    vendorData.password=vData.password;
    vendorData.passwordConfirm=vData.password;
    vendorData.vendorname=vData.vendorname;
    vendorData.phoneNumber=vData.phoneNumber;
    if(vData["oldPassword"]){
        vendorData.oldPassword=vData["oldPassword"];
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
            error: error
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
            error: error
        })
    }
    // const result = await pb.collection('vendor').listAuthMethods();

})
router.patch('/:id', async (req, res) => {

    const params = Object.assign({}, req.params);
    let vendor = createOrUpdatevendorData(req.body);
    console.log({vendor});
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
            error: error
        })
    }
    // const result = await pb.collection('vendor').listAuthMethods();

})

router.get('/all', async (req, res) => {
    try {
        const records = await pb.collection('vendor').getList(req.body.from, req.body.to); 
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
        const records = await pb.collection('vendor').getOne(params.id); 
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
        const records = await pb.collection('vendor').delete(params.id); 
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