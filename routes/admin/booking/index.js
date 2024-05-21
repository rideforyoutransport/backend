const logger = require('../../../helpers/logger.js');
const utils = require('../../../helpers/utils.js');
const router = require('express').Router();

const PocketBase = require('pocketbase/cjs')
var pb_port = process.env.PB_PORT || 'http://127.0.0.1:8090';
const pb = new PocketBase(pb_port);


let bookingData = {};

// const data = {
//     "vendor": "RELATION_RECORD_ID",
//     "trip": "RELATION_RECORD_ID",
//     "user": "RELATION_RECORD_ID",
//     "driver": "RELATION_RECORD_ID",
//     "amountPaid": "test",
//     "amountLeft": "test",
//     "totalAmount": "test",
//     "luggageTypeOpted": "s",
//     "totalSeatsBooked": 123,
//     "otherUsers": "JSON",
//     "refreshmentsOpted": true,
//     "bookingDate": "2022-01-01 10:00:00.123Z",
//     "promoCode": "RELATION_RECORD_ID",
//     "reciept": "https://example.com",
//     "tipAmount": 123,
//     "tipPaid": true,
//     "status": "0",
//     "from": "RELATION_RECORD_ID",
//     "to": "RELATION_RECORD_ID"
// };


const createOrUpdatebookingData = (bData) => {

    //bookingData.vendor=bData.vendor;
    bookingData.trip = bData.trip;
    bookingData.user = bData.user;
    bookingData.driver = bData.driver;
    //bookingData.amountPaid=bData.amountPaid;
    //bookingData.amountLeft=bData.amountLeft;
    //bookingData.bookingDate=bData.bookingDate;
    //bookingData.totalAmount=bData.totalAmount;
    bookingData.luggageTypeOpted = bData.luggageTypeOpted;
    bookingData.totalSeatsBooked = bData.totalSeatsBooked;
    bookingData.otherUsers = bData.otherUsers;
    bookingData.status = bData.status ? bData.status : 0;
    //bookingData.promoCode=bData.promoCode?bData.promoCode:false;
    bookingData.reciept = bData.reciept;
    bookingData.tipPaid = bData.tipPaid ? bData.tipPaid : false;
    bookingData.tipAmount = bData.tipPaid ? bdata.tipAmount : 0;
    bookingData.from = bData.from;
    bookingData.to = bData.to;
    bookingData.status = bData.status ? bData.status : 1

    return bookingData;
}


const getDataFromTrip = async (data) => {

    let record = await pb.collection('trips').getOne(data.trip);
    bookingData.vendor = record.vendor;
    bookingData.driver = record.driver;
    bookingData.vehicle = record.vehicle;
    bookingData.amountPaid = (record.bookingMinimumAmount > 0 ? record.bookingMinimumAmount : 25) * bookingData.totalSeatsBooked;
    bookingData.bookingDate = record.tripDate;
    bookingData.totalAmount = record.totalTripAmount * bookingData.totalSeatsBooked;
    bookingData.amountLeft = bookingData.totalAmount - bookingData.amountPaid;
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
    try {
        const record = await pb.collection('bookings').update(params.id, bookings);

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
        // let typeFilter = '';

        // if (req.body.type == 0) {
        //     typeFilter = "bookingDate < @now"
        // } else if (req.body.type == 1) {
        //     typeFilter = "bookingDate > @now"
        // }
        // console.log(typeFilter);
        let records = await pb.collection('bookings').getList(req.body.from, req.body.to, {
            expand: expandKeyNames.toString(), filter: 'deleted=false'
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

router.post('/details/:id', async (req, res) => {
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

router.post('/deleteMultiple', async (req, res) => {
    try {
        const idArr = req.body.ids;
        idArr.map(async (id)=>{
            await pb.collection('bookings').update(id, {deleted: true});
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
