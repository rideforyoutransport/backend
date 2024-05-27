const logger = require('../../helpers/logger.js');
const utils = require('../../helpers/utils.js');
const router = require('express').Router();

const { pb, pb_authStore } = require('../../pocketbase/pocketbase.js');


let chatData = {};


const createFilterForChats = (reqBody) => {

    let filter = '';
    filter = filter + `driver="${reqBody.driver}"`;
    if (reqBody.trip && reqBody.trip != '') {
        filter = filter + ` && trip="${reqBody.trip}"`;
    }
    if (reqBody.booking && reqBody.booking != '' && reqBody.trip && reqBody.trip != '') {
        filter = filter + ` && booking="${reqBody.booking}"`;
    } else if (reqBody.booking) {
        filter = filter + `booking="${reqBody.booking}"`;
    }
    if (reqBody.user && reqBody.user != '' && reqBody.booking && reqBody.booking != '') {
        filter = filter + ` && user="${reqBody.user}"`;
    } else if (reqBody.user) {
        filter = filter + `user="${reqBody.user}"`;
    }
    return filter;
}

let createOrUpdateChatData = async (cData, id) => {
    chatData.user = cData.user;
    chatData.booking = cData.booking;
    chatData.trip = cData.trip;
    chatData.driver = cData.driver;
    // let filter = createFilterForChats(cData);
    let oldChatMessages = await pb.collection('chats').getOne(id);
    let oldMessages = [...oldChatMessages.messages.chats];
    oldMessages.push(cData.messages);
    chatData.messages = { "chats": oldMessages };
    return chatData;
};


router.get('/:id', async (req, res) => {
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
            message: error.response && error.response.message ? error.response.message : "Something went wrong! Please try again later!"
        })
    }

});


router.post('/createChat', async (req, res) => {
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


router.post('/getChats', async (req, res) => {
    try {

        // recordsDestination = await pb.collection('stops').getFullList({ filter: `deleted=false && place_id="${destinationPlaceId}"` });

        const reqBody = Object.assign({}, req.body);
        let filter = createFilterForChats(reqBody);
        const records = await pb.collection('chats').getFullList({ filter: filter });
        return res.send({
            success: true,
            result: records
        })
    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response && error.response.message ? error.response.message : "Something went wrong! Please try again later!"
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
            message: error.response && error.response.message ? error.response.message : "Something went wrong! Please try again later!"
        })
    }

})
router.patch('/chat/:id', async (req, res) => {
    try {
        let data = req.body;
        const params = Object.assign({}, req.params);
        let cData = await createOrUpdateChatData(data, params.id);
        const record = await pb.collection('chats').update(params.id, cData);
        return res.send({
            success: true,
            result: record
        })
    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response && error.response.message ? error.response.message : "Something went wrong! Please try again later!"
        })
    }

})



module.exports = router;

