const logger = require('../../../helpers/logger.js');
const utils = require('../../../helpers/utils.js');
const router = require('express').Router();

const {pb,pb_authStore}  = require('../../../pocketbase/pocketbase.js');



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
            message: error.response && error.response.message ? error.response.message: "Something went wrong! Please try again later!"
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
            message: error.response && error.response.message ? error.response.message: "Something went wrong! Please try again later!"
        })
    }

})

router.get('/all', async (req, res) => {
    try {
        const records = await pb.collection('vehicle').getFullList({filter: 'deleted=false',  sort: '-created'});
        return res.send({
            success: true,
            result: records
        })
    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response && error.response.message ? error.response.message: "Something went wrong! Please try again later!"
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
            message: error.response && error.response.message ? error.response.message: "Something went wrong! Please try again later!"
        })
    }

})

router.delete('/:id', async (req, res) => {
    try {
        const params = Object.assign({}, req.params);
        const records = await pb.collection('vehicle').update(params.id, {deleted: true});
        return res.send({
            success: true,
            result: records
        })
    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response && error.response.message ? error.response.message: "Something went wrong! Please try again later!"
        })
    }

})

router.post('/deleteMultiple', async (req, res) => {
    try {
        const idArr = req.body.ids;
        idArr.map(async (id)=>{
            await pb.collection('vehicle').update(id, {deleted: true});
        })
        return res.send({
            success: true,
            message: "Deleted successfully!"
        })
    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response && error.response.message ? error.response.message: "Something went wrong! Please try again later!"
        })
    }

})

module.exports = router;
