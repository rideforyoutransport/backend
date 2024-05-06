const logger = require('../../helpers/logger.js');
const utils = require('../../helpers/utils.js');
const router = require('express').Router();

const PocketBase = require('pocketbase/cjs')
var pb_port = process.env.PB_PORT || 'http://127.0.0.1:8090';
const pb = new PocketBase(pb_port);


let vehicleData = {};

const data = {
    "name": "test",
    "number": 123,
    "totalSeats": 123,
    "seatingMap": "JSON",
    "carType": "a",
    "totalTrips": 123,
    "image": "https://example.com",
    "vendor": [
        "RELATION_RECORD_ID"
    ]
};


const createOrUpdatevehicleData = (vData) => {

    vehicleData.name = vData.name;
    vehicleData.number = vData.number;
    vehicleData.totalSeats = vData.totalSeats;
    vehicleData.seatingMap = vData.seatingMap;
    vehicleData.carType = vData.carType;
    vehicleData.totalTrips = vData.totalTrips;
    vehicleData.image = vData.image;
    vehicleData.vendor = vData.vendor;

    return vehicleData;
}


router.post('/add', async (req, res) => {

    let vData = createOrUpdatevehicleData(req.body);
    try {
        const record = await pb.collection('vehicle').create(vData);

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
router.patch('/:id', async (req, res) => {

    const params = Object.assign({}, req.params);
    let vehicle = createOrUpdatevehicleData(req.body);
    console.log({ vehicle });
    try {
        const record = await pb.collection('vehicle').update(params.id, vehicle);

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

router.get('/all', async (req, res) => {
    try {
        const records = await pb.collection('vehicle').getFullList();
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

router.get('/:id', async (req, res) => {
    try {
        const params = Object.assign({}, req.params);
        const records = await pb.collection('vehicle').getOne(params.id);
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

router.delete('/:id', async (req, res) => {
    try {
        const params = Object.assign({}, req.params);
        const records = await pb.collection('vehicle').delete(params.id);
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
