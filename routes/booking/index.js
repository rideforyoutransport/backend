const logger = require('../../helpers/logger.js');
const utils = require('../../helpers/utils.js');
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
//     "seatMapping": "JSON",
//     "refreshmentsOpted": true,
//     "bookingDate": "2022-01-01 10:00:00.123Z",
//     "promoCode": "RELATION_RECORD_ID",
//     "cancelled": true,
//     "reciept": "https://example.com"
// };

const createOrUpdatebookingData =(bData)=>{

    bookingData.vendor=bData.vendor;
    bookingData.trip=bData.trip;
    bookingData.user=bData.user;
    bookingData.driver=bData.driver;
    bookingData.amountPaid=bData.amountPaid;
    bookingData.amountLeft=bData.amountLeft;
    bookingData.totalAmount=bData.totalAmount;
    bookingData.luggageTypeOpted=bData.luggageTypeOpted;
    bookingData.totalSeatsBooked=bData.totalSeatsBooked;
    bookingData.seatMapping=bData.seatMapping;
    bookingData.seatMapping=bData.seatMapping;
    bookingData.process=bData.promoCode;
    bookingData.cancelled=bData.promoCode?bData.promoCode:false;
    bookingData.reciept=bData.reciept;
 
    return bookingData;
}


router.post('/add', async (req, res) => {

    let bData = createOrUpdatebookingData(req.body);
    try {
        const record = await pb.collection('bookings').create(bData);

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

})
router.patch('/:id', async (req, res) => {

    const params = Object.assign({}, req.params);
    let bookings = createOrUpdatebookingData(req.body);
    console.log({bookings});
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
            error: error
        })
    }

})

router.get('/all', async (req, res) => {
    try {
        const records = await pb.collection('bookings').getList(req.body.from, req.body.to); 
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
        const records = await pb.collection('bookings').getOne(params.id); 
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
        const records = await pb.collection('bookings').delete(params.id); 
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
