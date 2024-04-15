const logger = require('../../helpers/logger.js');
const utils = require('../../helpers/utils.js');
const router = require('express').Router();

const PocketBase = require('pocketbase/cjs')
var pb_port = process.env.PB_PORT || 'http://127.0.0.1:8090';
const pb = new PocketBase(pb_port);


let stopData = {};

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
//     "stopDate": "2022-01-01 10:00:00.123Z",
//     "promoCode": "RELATION_RECORD_ID",
//     "cancelled": true,
//     "reciept": "https://example.com"
// };

const createOrUpdatestopData =(bData)=>{

    stopData.vendor=bData.vendor;
    stopData.trip=bData.trip;
    stopData.user=bData.user;
    stopData.driver=bData.driver;
    stopData.amountPaid=bData.amountPaid;
    stopData.amountLeft=bData.amountLeft;
    stopData.totalAmount=bData.totalAmount;
    stopData.luggageTypeOpted=bData.luggageTypeOpted;
    stopData.totalSeatsBooked=bData.totalSeatsBooked;
    stopData.seatMapping=bData.seatMapping;
    stopData.seatMapping=bData.seatMapping;
    stopData.process=bData.promoCode;
    stopData.cancelled=bData.promoCode?bData.promoCode:false;
    stopData.reciept=bData.reciept;
 
    return stopData;
}


router.post('/add', async (req, res) => {

    let bData = createOrUpdatestopData(req.body);
    try {
        const record = await pb.collection('stops').create(bData);

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
    let stops = createOrUpdatestopData(req.body);
    console.log({stops});
    try {
const record = await pb.collection('stops').update(params.id, stops);

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
        const records = await pb.collection('stops').getFullList(); 
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
        const records = await pb.collection('stops').getOne(params.id); 
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
        const records = await pb.collection('stops').delete(params.id); 
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
