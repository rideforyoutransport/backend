const logger = require('../../../helpers/logger.js');
const utils = require('../../../helpers/utils.js');
const router = require('express').Router();
const {pb,pb_authStore}  = require('../../../pocketbase/pocketbase.js');

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
    bookingData.tipAmount = bData.tipPaid ? bdata.tipAmount : 0;
    bookingData.from = bData.from;
    bookingData.to = bData.to;
    bookingData.bookingDate = bData.bookingDate;
    bookingData.status = bData.status
    bookingData.duration = bData.duration;

    return bookingData;
}


const getDataFromTrip = async (data) => {

    let record = await pb.collection('trips').getOne(data.trip);
    bookingData.vendor = record.vendor;
    bookingData.driver = record.driver;
    bookingData.vehicle = record.vehicle;
    return data;
}

router.post('/add', async (req, res) => {

    let bData = await createOrUpdatebookingData(req.body);
    try {

        let data = await getDataFromTrip(bData);
        let trip = await pb.collection('trips').getOne(data.trip);
        if(bData.totalSeatsBooked <= trip.totalSeatsLeft){
            trip.totalSeatsLeft =  trip.totalSeatsLeft - bData.totalSeatsBooked;
            await pb.collection('trips').update(trip.id, trip);
            await pb.collection('bookings').create(data);

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
            message: error.response.message
        })
    }

})


router.patch('/:id', async (req, res) => {

    const params = Object.assign({}, req.params);
    let bookings = createOrUpdatebookingData(req.body);
    console.log(bookings);
    try {
        const record = await pb.collection('bookings').update(params.id, bookings);
        console.log(record);

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

})

// "type":0-> prev 
//        1-> upcoming 

// filter with now time 

router.post('/all', async (req, res) => {
    try {
        let expandKeys = req.body.expandKeys;
        let expandKeyNames = [];
        Object.keys(expandKeys).forEach(key => {
            expandKeyNames.push(key);
        })
        let typeFilter = '';

        if (req.body.type == 0) {
            typeFilter = "bookingDate < @now"
        } else if (req.body.type == 1) {
            typeFilter = "bookingDate > @now"
        }
        console.log(typeFilter);
        let records = await pb.collection('bookings').getList(req.body.from, req.body.to, {
            expand: expandKeyNames.toString(), filter:
                typeFilter+'&& deleted=false'
        });
        records = utils.cleanExpandData(records, expandKeys, true);
        records.forEach(element=>{
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
            message: error.response.message
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
        console.log(records[0].expand);
        records = utils.cleanExpandData(records, expandKeys, false);
        records.forEach(element=>{
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
            message: error.response.message
        })
    }

})

router.delete('/:id', async (req, res) => {
    try {
        const params = Object.assign({}, req.params);
        const records = await pb.collection('bookings').update(params.id, {deleted: true});
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

module.exports = router;
