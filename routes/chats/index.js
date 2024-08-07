const logger = require('../../helpers/logger.js');
const utils = require('../../helpers/utils.js');
const router = require('express').Router();

const { sendNotif } = require('../../helpers/firebaseFunctions.js');

const { pb } = require('../../pocketbase/pocketbase.js');


const sendNotification = async (token, name, message, cData) => {
    try {
        if (!token || typeof token !== 'string') {
            throw new Error('Invalid FCM token provided');
        }
        let response = await sendNotif(token, `${name} sent you a message`, JSON.stringify({ description: message, id: cData.id, page: 1}));
        console.log(response);
        return response;
    } catch (error) {
        console.error("Notification API error:", error.message);
    }
}


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
    let chat = await pb.collection('chats').getOne(id);
    chat.messages = [...chat.messages, cData];
    return chat;
};


router.post('/getChatData/:id', async (req, res) => {
    try {
        let type = req.body.type;
        let expandKeys = req.body.expandKeys;
        let expandKeyNames = [];
        Object.keys(expandKeys).forEach(key => {
            expandKeyNames.push(key);
        })

        const params = Object.assign({}, req.params);
        let records = await pb.collection('chats').getOne(params.id, { expand: expandKeyNames.toString() });
        let update = false;
        let trip = await pb.collection('trips').getOne(records.expand.trip.id, {expand: "id, from, to, stops, tripDate" });
        let newTrips = [];
        newTrips.push(trip);
        let trips = utils.cleanExpandData(newTrips, ["id", "from", "to", "stops", "tripDate"], false);
        records.expand.trip = trips[0];
        if(records.booking!= ""){
            let booking = await pb.collection('bookings').getOne(records.expand.booking.id, {expand: "id, from, to, bookingDate, totalSeatsBooked, status" });
            let bookings = utils.cleanExpandData([booking], ["id", "from", "to", "bookingDate", "totalSeatsBooked", "status"], false);
            records.expand.booking = bookings[0];
        }
        records.messages.map(message => {
            if (type == "driver") {
                if (!message.seenByDriver) {
                    update = true;
                    message.seenByDriver = true;
                }
            }

            if (type == "user") {
                if (!message.seenByUser) {
                    update = true;
                    message.seenByUser = true;
                }
            }
        })

        if (update) {
            await pb.collection('chats').update(records.id, records);
        }
        let newRecords = [];
        newRecords.push(records);
        newRecords = utils.cleanExpandData(newRecords, expandKeys, false);
        let record = newRecords[0];

        if (record.booking == "") {
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
            message: error.response && error.response.message ? error.response.message : "Something went wrong! Please try again later!"
        })
    }

})


router.post('/getChat', async (req, res) => {
    try {
        let expandKeys = req.body.expandKeys;
        let expandKeyNames = [];
        Object.keys(expandKeys).forEach(key => {
            expandKeyNames.push(key);
        })

        const reqBody = Object.assign({}, req.body);

        let filter = createFilterForChats(reqBody);
        let records = await pb.collection('chats').getFullList({ filter: filter, expand: expandKeyNames.toString() });
        if (records && records.length > 0) {
            records = utils.cleanExpandData(records, expandKeys, false);
            let chat = records[0];
            if (chat.booking == "") {
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
        //console.log(params);
        let cData = await createOrUpdateChatData(data, params.id);
        //console.log(cData, data.senderId);

        const record = await pb.collection('chats').update(params.id, cData);
        //send Notification
        let token = '';
        let name = '';
        if (data.senderId == cData.user) {
            let driver = await pb.collection('driver').getOne(cData.driver);
            name = driver.name;
            token = driver.fcmToken;
        } else {
            let user = await pb.collection('users').getOne(cData.user);
            name = user.name;
            token = user.fcmToken;
        }
        if (token !== '' && token !== null) {
            try {
                await sendNotification(token, name, data.message, cData);
            } catch (error) {
                console.log(error);
            }
        }
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

