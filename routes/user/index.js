const logger = require('../../helpers/logger.js');
const utils = require('../../helpers/utils.js');
const router = require('express').Router();

const PocketBase = require('pocketbase/cjs')
var pb_port = process.env.PB_PORT || 'http://127.0.0.1:8090';
const pb = new PocketBase(pb_port);


let userData = {};

const createOrUpdateUserData =(uData)=>{

    userData.username=uData.userName;
    userData.name=uData.name;
    userData.email=uData.email;
    userData.password=uData.password;
    userData.passwordConfirm=uData.password;
    userData.username=uData.username;
    if(uData["oldPassword"]){
        userData.oldPassword=uData["oldPassword"];
    }

    return userData;
}

router.post('/login', async (req, res) => {

    try {
        const adminData = await pb.collection('users').authWithPassword(req.body.email ? req.body.email : req.body.userName, req.body.password);
        console.log(adminData);
        
    
        return res.send({
            success: true,
            result: {id:adminData.record.id,token:adminData.token}
        })

    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            error: error
        })
    }
    // const result = await pb.collection('users').listAuthMethods();

})
router.post('/register', async (req, res) => {

    let user = createOrUpdateUserData(req.body);
    try {
        const record = await pb.collection('users').create(user);
        await pb.collection('users').requestVerification(user.email);
console.log(record);
        return res.send({
            success: true,
            result: {id:record.record.id,token:record.token}

        })

    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            error: error
        })
    }
    // const result = await pb.collection('users').listAuthMethods();

})
router.patch('/:id', async (req, res) => {

    const params = Object.assign({}, req.params);
    let user = createOrUpdateUserData(req.body);
    console.log({user});
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
            error: error
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
            error: error
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
            error: error
        })
    }
 
})

router.delete('/:id', async (req, res) => {
    try {
        const params = Object.assign({}, req.params);
        const records = await pb.collection('users').delete(params.id); 
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
