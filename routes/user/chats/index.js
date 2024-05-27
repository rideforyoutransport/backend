const logger = require('../../../helpers/logger.js');
const utils = require('../../../helpers/utils.js');
const router = require('express').Router();
const {pb,pb_authStore}  = require('../../../pocketbase/pocketbase.js');


let chatData ={};

const createOrUpdateChatData = (cData) => {
    // const data = {
    //     "user": "RELATION_RECORD_ID",
    //     "booking": "RELATION_RECORD_ID",
    //     "trip": "RELATION_RECORD_ID",
    //     "driver": "RELATION_RECORD_ID",
    //     "messages": "JSON"
    // };
    
    chatData.user = cData.user;
    chatData.booking = cData.booking;
    chatData.trip  = cData.trip;
    

 

    return bookingData;
}


router.get('/message/:id', async (req, res) => {
    try {
        const params = Object.assign({}, req.params);
        const records = await pb.collection('chats').getOne(params.id);
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

router.get('/message', async (req, res) => {
    try {
        // const params = Object.assign({}, req.params);
        const records = await pb.collection('chats').getFullList();
        console.log(records);
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
router.post('/chats', async (req, res) => {
    try {

        // recordsDestination = await pb.collection('stops').getFullList({ filter: `deleted=false && place_id="${destinationPlaceId}"` });

        const reqBody = Object.assign({}, req.body);
        console.log({reqBody})
        let filter ='';
        if(reqBody.trip &&  reqBody.trip!=''){
            filter=filter+ `trip="${reqBody.trip}"`;
        }
        if(reqBody.booking &&  reqBody.booking!='' && reqBody.trip && reqBody.trip!='' ){
            filter=filter+ ` && booking="${reqBody.booking}"`;

        }else if(reqBody.booking){
            filter=filter+ `booking="${reqBody.booking}"`;
        }
        if(reqBody.user &&  reqBody.user!='' && reqBody.booking &&reqBody.booking!=''){
            filter=filter+ ` && user="${reqBody.user}"`;
        }else if(reqBody.user){
            filter=filter+ `user="${reqBody.user}"`;
        }
        console.log({filter});
        const records = await pb.collection('chats').getFullList({ filter: filter });
        return res.send({
            success: true,
            result: records
        })
    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error
        })
    }

})

router.post('/message', async (req, res) => {
    try {
        let data = req.body;
        // const params = Object.assign({}, req.params);
        let records = await pb.collection('chats').create(data);
        return res.send({
            success: true,
            result: records
        })
    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error
        })
    }

})

