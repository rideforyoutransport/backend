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
    if (reqBody.user) {
        filter = filter + ` && user="${reqBody.user}"`;
    }
    return filter;
}

let createOrUpdateChatData = async (cData, id) => {
    let oldChatMessages = await pb.collection('chats').getOne(id);
    chatData.messages = [...oldChatMessages.messages, cData];
    return chatData;
};


router.post('/getChatData/:id', async (req, res) => {
    try {
        let expandKeys = req.body.expandKeys;
        let expandKeyNames = [];
        Object.keys(expandKeys).forEach(key => {
            expandKeyNames.push(key);
        })

        const params = Object.assign({}, req.params);
        const records = await pb.collection('chats').getOne(params.id, { expand: expandKeyNames.toString() });
        let newRecords = [];
        newRecords.push(records);
        newRecords = utils.cleanExpandData(newRecords, expandKeys, false);
        let record = newRecords[0];
        if(record.booking == ""){
            record.booking = null;
        }
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

});


router.post('/createChat', async (req, res) => {
    try {
        let data = req.body;
        // const params = Object.assign({}, req.params);
        let records = await pb.collection('chats').create(data);
        return res.send({
            success: true,
            result: records.id
        })
    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error
        })
    }

})


router.post('/getChat', async (req, res) => {
    try {
        console.log(req);
        let expandKeys = req.body.expandKeys;
        let expandKeyNames = [];
        Object.keys(expandKeys).forEach(key => {
            expandKeyNames.push(key);
        })

        const reqBody = Object.assign({}, req.body);
        console.log(reqBody);

        let filter = createFilterForChats(reqBody);
        console.log(filter);
        let records = await pb.collection('chats').getFullList({ filter: filter, expand: expandKeyNames.toString() });
        if(records && records.length > 0){
            records = utils.cleanExpandData(records, expandKeys, false);
            let chat = records[0];
            if(chat.booking == ""){
                chat.booking = null;
            }
            return res.send({
                success: true,
                result: chat
            })
        } else {
            return res.send({
                success: true,
                result: null,
                message: "No record found!"
            })
        }
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
            message: "Message Sent!"
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

