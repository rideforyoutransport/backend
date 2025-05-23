const { default: axios } = require('axios');
const logger = require('../../../helpers/logger.js');
const utils = require('../../../helpers/utils.js');
const router = require('express').Router();
const { pb, pb_authStore, getRecordId } = require('../../../pocketbase/pocketbase.js');
const moment = require('moment');
const { sendNotif } = require('../../../helpers/firebaseFunctions.js');
const e = require('cors');


let bookingData = {};

const createOrUpdatebookingData = (bData) => {

    bookingData.trip = bData.trip;
    bookingData.user = bData.user;
    bookingData.driver = bData.driver;
    bookingData.luggageTypeOpted = bData.luggageTypeOpted;
    bookingData.totalSeatsBooked = bData.totalSeatsBooked;
    bookingData.otherUsers = bData.otherUsers;
    bookingData.totalAmount = bData.totalAmount;
    bookingData.amountPaid = bData.amountPaid;
    bookingData.amountLeft = bData.amountLeft;
    //bookingData.promoCode=bData.promoCode?bData.promoCode:false;
    bookingData.reciept = bData.reciept;
    bookingData.tipPaid = bData.tipPaid ? bData.tipPaid : false;
    bookingData.tipAmount = bData.tipPaid ? bData.tipAmount : 0;
    bookingData.from = bData.from;
    bookingData.to = bData.to;
    bookingData.bookingDate = bData.bookingDate;
    bookingData.status = bData.status
    bookingData.duration = bData.duration;
    bookingData.rating = bData.rating;
    bookingData.review = bData.review;
    bookingData.paymentID = bData.paymentID;
    bookingData.tipPaymentID = bData.tipPaymentID;
    return bookingData;
}


const getDataFromTrip = async (data) => {
    let record = await pb.collection('trips').getOne(data.trip);
    bookingData.vendor = record.vendor[0];
    bookingData.driver = record.driver;
    bookingData.vehicle = record.vehicle;
    bookingData.from = record.from;
    bookingData.to = record.to;
    return data;

}

const sendNotification = async (token, title, desc, page, id) => {
    try {
        if (!token || typeof token !== 'string') {
            throw new Error('Invalid FCM token provided');
        }
        let response = await sendNotif(token, title, JSON.stringify({ description: desc, id: id, page: page}));
        console.log(response);
        return response;
    } catch (error) {
        console.error("Notification API error:", error.message);
    }
}

router.post('/add', async (req, res) => {

    let bData = createOrUpdatebookingData(req.body);
    try {

        let data = await getDataFromTrip(bData);
        let trip = await pb.collection('trips').getOne(data.trip);
        if (bData.totalSeatsBooked <= trip.totalSeatsLeft) {
            trip.totalSeatsLeft = trip.totalSeatsLeft - bData.totalSeatsBooked;
            await pb.collection('trips').update(trip.id, trip);
            let bookingResp = await pb.collection('bookings').create(data);

            // console.log("chat session call", bookingResp);

            let chatSession = await pb.collection('chats').getFullList({ filter: `trip="${bData.trip}" && user="${bData.user}"`, sort: '-updated', });
            if (chatSession.length > 0 && chatSession[0].booking == '') {
                chatSession[0].booking = bookingResp.id;

                let respChats = await pb.collection('chats').update(chatSession[0].id, chatSession[0]);
                // await pb.collection('chats').update(chatSession[0].id));
            }

            let driver = await pb.collection('driver').getOne(trip.driver);
            let driverToken = driver.fcmToken;

            let user = await pb.collection('users').getOne(bookingResp.user);
            let userToken = user.fcmToken;

            let from = await pb.collection('stops').getOne(bookingResp.from);
            let to = await pb.collection('stops').getOne(bookingResp.to);
            

            if (driverToken !== '' && driverToken !== null) {
                try {
                    await sendNotification(driverToken, "Trip booked", `Booking for trip ${from.name} to ${to.name}(${moment(trip.tripDate).format('DD/MM/YYYY')}) for ${bookingResp.totalSeatsBooked} seats was booked by ${user.name}`, 2, trip.id);
                } catch (error) {
                    console.log(error);
                }
            }

            if (userToken !== '' && userToken !== null) {
                try {
                    await sendNotification(userToken, "Trip booked", `Booking for trip ${from.name} to ${to.name}(${moment(trip.tripDate).format('DD/MM/YYYY')}) for ${bookingResp.totalSeatsBooked} seats`, 3, bookingResp.id);
                } catch (error) {
                    console.log(error);
                }
            }

            return res.send({
                success: true,
                message: "Booking confirmed!"
            })
        } else {
            return res.send({
                success: false,
                message: "Not enough seats left!"
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


router.patch('/:id', async (req, res) => {

    const params = Object.assign({}, req.params);
    let bookings = createOrUpdatebookingData(req.body);
    try {
        let refund = null;
        let refundAmount = 0
        if (bookings.status == 0) {
            const record = await pb.collection('bookings').getOne(params.id, {
                expand: 'trip'
            });
            if (record?.expand?.trip?.tripDate) {
                tripDate = record?.expand?.trip?.tripDate;
                if ((new Date(tripDate).getTime() - new Date().getTime()) > utils.EPOCH_24H) {
                    refundAmount = (record?.expand?.trip?.bookingMinimumAmount) / 2;
                }
            }

            refund = await utils.initiateRefund(record?.expand?.trip?.bookingMinimumAmount, record?.paymentIntent);

            let driver = await pb.collection('driver').getOne(record?.expand?.trip?.driver);
            let driverToken = driver.fcmToken;

            let user = await pb.collection('users').getOne(record.user);
            let userToken = user.fcmToken;

            let from = await pb.collection('stops').getOne(record.from);
            let to = await pb.collection('stops').getOne(record.to);
            

            if (driverToken !== '' && driverToken !== null) {
                try {
                    await sendNotification(driverToken, "Booking cancelled", `Booking for trip ${from.name} to ${to.name}(${moment(record?.expand?.trip?.tripDate).format('DD/MM/YYYY')}) for ${record.totalSeatsBooked} seats was cancelled by ${user.name}`, 2, record?.expand?.trip?.id);
                } catch (error) {
                    console.log(error);
                }
            }

            if (userToken !== '' && userToken !== null) {
                try {
                    await sendNotification(userToken, "Booking cancelled", `Booking for trip ${from.name} to ${to.name}(${moment(record?.expand?.trip?.tripDate).format('DD/MM/YYYY')}) for ${record.totalSeatsBooked} seats was cancelled`, 3, record.id);
                } catch (error) {
                    console.log(error);
                }
            }
        }
        const record = await pb.collection('bookings').update(params.id, bookings);
        return res.send({
            success: true,
            message: "Record updated!",
            refund: refund
        })

    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response && error.response.message ? error.response.message : "Something went wrong! Please try again later!"
        })
    }

})

// "type":0-> prev 
//        1-> upcoming 

// filter with now time 

router.post('/all', async (req, res) => {
    try {
        console.log(req.headers.authorization)
        let userId = req.body.userId;
        let id = userId ? userId : await getRecordId("users", req.headers.authorization);
        console.log(id);

        let expandKeys = req.body.expandKeys;
        let expandKeyNames = [];
        Object.keys(expandKeys).forEach(key => {
            expandKeyNames.push(key);
        })
        let typeFilter = '';
        let tripSortFilter='';
        if (req.body.type == 0) {
            typeFilter = "bookingDate < @now",
            tripSortFilter="-bookingDate"

        } else if (req.body.type == 1) {
            typeFilter = "bookingDate > @now"
            tripSortFilter="bookingDate"
        }
         else {
            typeFilter = "bookingDate = @now"
        }

        typeFilter = typeFilter + ` && user="${id}"`;
        console.log(typeFilter);

        let records = await pb.collection('bookings').getList(req.body.from, req.body.to, {
            expand: expandKeyNames.toString(), filter:
                typeFilter + '&& deleted=false',
                sort: tripSortFilter
        });
        records = utils.cleanExpandData(records, expandKeys, true);

        records.forEach(element => {

            let details = element.otherUsers["details"];
            element.otherUsers["details"] = JSON.parse(details);
            return element;
        })

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

router.get('/getAllReviews', async (req, res) => {
    try {
        let typeFilter = "bookingDate < @now && deleted=false";

        let records = await pb.collection('bookings').getFullList({
            expand: "user", filter: typeFilter
        });

        let reviews = [];
        records.forEach(element => {
            if(element.rating!= 0){
                reviews.push({user: element.expand.user.name, rating: element.rating, review: element.review ? element.review: ""});
            }
        })

        return res.send({
            success: true,
            result: reviews
        })
    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response && error.response.message ? error.response.message : "Something went wrong! Please try again later!"
        })
    }

})

router.post('/:id', async (req, res) => {
    try {
        const params = Object.assign({}, req.params);
        let expandKeys = req.body.expandKeys;
        let expandKeyNames = [];
        Object.keys(expandKeys).forEach(key => {
            expandKeyNames.push(key);
        })

        let records = [];
        records.push(await pb.collection('bookings').getOne(params.id, { expand: expandKeyNames.toString() }));
        // console.log(records[0].expand);
        records = utils.cleanExpandData(records, expandKeys, false);

        records.forEach(element => {
            let details = element.otherUsers["details"];
            element.otherUsers["details"] = JSON.parse(details);
            return element;
        })

        return res.send({
            success: true,
            result: records[0]
        })
    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response && error.response.message ? error.response.message : "Something went wrong! Please try again later!"
        })
    }

})

router.delete('/:id', async (req, res) => {
    try {
        const params = Object.assign({}, req.params);
        const records = await pb.collection('bookings').update(params.id, { deleted: true });
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

module.exports = router;
