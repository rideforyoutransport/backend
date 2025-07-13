const logger = require('../../../helpers/logger.js');
const utils = require('../../../helpers/utils.js');
const router = require('express').Router();
const generateRequestedTripEmail = require('../../../helpers/requestedTrip.js');

const {pb,pb_authStore}  = require('../../../pocketbase/pocketbase.js');

let tripData = {};

const createDataForStops = (data, obj) => {


    const returnStop = {
        "place_id": data[obj].place_id,
        "name": data[obj].place_name,
        "geoLocation": { 'lat': data[obj].lat, 'lng': data[obj].lng },
        "deleted": false
    };
    return returnStop;
}

const createOrUpdatetripData = async (tData) => {

    let recordsOrigin = null, recordsDestination = null, recordFrom = null, recordTo = null;
    try {
        let originPlaceId = tData.from.place_id;
        let destinationPlaceId = tData.to.place_id;
        recordsOrigin = await pb.collection('stops').getFullList({ filter: `deleted=false && place_id="${originPlaceId}"` });
        recordsDestination = await pb.collection('stops').getFullList({ filter: `deleted=false && place_id="${destinationPlaceId}"` });

        console.log(recordsDestination.length > 0, recordsOrigin.length > 0)
        if (recordsOrigin == null || recordsOrigin.length == 0) {
            const dataFrom = createDataForStops(tData, 'from')
            // console.log({dataFrom});
            recordFrom = await pb.collection('stops').create(dataFrom);
            tripData.origin = recordFrom.id;
            // console.log({recordFrom});

        } else
            tripData.origin = recordsOrigin[0].id;

        if (recordsDestination == null || recordsDestination.length == 0) {
            const dataTo = createDataForStops(tData, 'to')
            // console.log({dataTo});
            recordTo = await pb.collection('stops').create(dataTo);
            tripData.destination = recordTo.id;
            // console.log({recordTo});
        } else
            tripData.destination = recordsDestination[0].id;

        // console.log({recordsDestination},{recordsOrigin});


    } catch (error) {
        console.log(error);
    }
    tripData.requestDate = tData.requestDate;
    tripData.totalSeats = tData.totalSeats;
    tripData.requestingUser = tData.user;
    console.log(tripData);

    return tripData;

}

router.post('/add', async (req, res) => {
    console.log(req.body);
    let trip = await createOrUpdatetripData(req.body);
    try {
        const html  = generateRequestedTripEmail(req.body);
        console.log(html);
        await utils.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.SMTP_USER,
            subject: "NEW TRIP REQUESTED",
            html
          })

        const record = await pb.collection('requestedTrips').create(trip);
        
        return res.send({
            success: true,
            message: "Request Added!"
        })

    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response && error.response.message ? error.response.message: "Something went wrong! Please try again later!"
        })
    }

})

router.post('/all', async (req, res) => {
    try {
        let expandKeys = req.body.expandKeys;
        let expandKeyNames = [];
        Object.keys(expandKeys).forEach(key => {
            expandKeyNames.push(key);
        })
        let records = await pb.collection('requestedTrips').getList(req.body.from, req.body.to, { expand: expandKeyNames.toString(), filter:
            'deleted=false' });
        records = utils.cleanExpandData(records, expandKeys, true);
        
        console.log(records);
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

router.post('/:id', async (req, res) => {
    try {
        let expandKeys = req.body.expandKeys;
        let expandKeyNames = [];
        Object.keys(expandKeys).forEach(key => {
            expandKeyNames.push(key);
        })

        const params = Object.assign({}, req.params);
        let records = await pb.collection('requestedTrips').getOne(params.id, { expand: expandKeyNames.toString() });
        let newRecords = [];
        newRecords.push(records);
        newRecords = utils.cleanExpandData(newRecords, expandKeys, false);
        let trip = newRecords[0];
        return res.send({
            success: true,
            result: trip
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
