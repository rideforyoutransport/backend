const logger = require('../../../helpers/logger.js');
const utils = require('../../../helpers/utils.js');
const router = require('express').Router();

const PocketBase = require('pocketbase/cjs')
var pb_port = process.env.PB_PORT || 'http://127.0.0.1:8090';
const pb = new PocketBase(pb_port);





let tripData = {};

const searchFromAndTo=(tData)=>{
    console.log(tData);
    let origin = pb.collection('stops').getOne(tData.from.place_id);
    let destination=pb.collection('stops').getOne(tData.from.place_id);

    console.log({origin},{destination});

}

const createOrUpdatetripData = async (tData, returnTrip) => {
    console.log(tData)
    searchFromAndTo(tData);
    tripData.vendor = tData.vendor;
    tripData.from = tData.from;
    tripData.to = tData.to;
    tripData.duration = tData.duration;
    tripData.tripDate = tData.tripDate;
    tripData.tripDescription = tData.tripDescription;
    tripData.vehicle = tData.vehicle;
    tripData.driver = tData.driver;
    tripData.luggage = tData.luggage;
    tripData.stops = tData.stops;
    tripData.bookingMinimumAmount = 25;
    tripData.totalTripAmount = tData.totalTripAmount;
    tripData.refreshments = tData.refreshments;
    tripData.recurring = tData.recurring;
    tripData.promoCodes = tData.promoCodes;
    tripData.fares = tData.fares;
    let vehicle;
    if(tData.vehicle){
        vehicle = await pb.collection('vehicle').getOne(tData.vehicle);
    }

    tripData.totalSeatsLeft = vehicle? vehicle.totalSeats: tData.totalSeatsLeft;
    tripData.totalSeats = vehicle? vehicle.totalSeats: tData.totalSeats;

    tripData.isReturnTrip = tData.isReturnTrip? tData.isReturnTrip: false;
    tripData.returnTrip = returnTrip? returnTrip.id:  null;
    tripData.actualStartTime = tData.actualStartTime;
    tripData.actualEndTime = tData.actualEndTime;
    tripData.requestedTrip = tData.requestedTrip;
    tripData.requestingUser = tData.requestingUser;
    console.log("asdf");
    return tripData;
}

let filterFromAndTo = (trips, filter) => {
    let finalTrips = [];
    trips.forEach(trip => {
        let finalStops = calculateFinalStops([trip.from, ...trip.stops, trip.to]);
        if (finalStops.includes(filter.from) && finalStops.includes(filter.to) && finalStops.indexOf(filter.from) < finalStops.indexOf(filter.to)) {
            finalTrips.push(trip);
        }
    });
    return finalTrips;

}

const calculateFinalStops = (allStops) => {

    allStops.reduce((accumulator, item) => {
        if (!accumulator.includes(item)) {
            accumulator.push(item);
        }
        return accumulator;
    }, []);
    return allStops;
}

const filterToString = (filter) => {

    finalFilter = "";

    if (filter.length > 0) {
        filter.forEach(element => {
            console.log(element);
            let eleFilter = element.fieldName + " " + element.operand + " '" + element.value + "'"
            finalFilter += eleFilter + ' && '

        });
        finalFilter = finalFilter.slice(0, finalFilter.length - 3)+'&& isReturnTrip=false && requestedTrip=false && deleted=false';
    }
    console.log("finalFilter", finalFilter);
    return finalFilter

}

router.post('/add', async (req, res) => {
    let returnRecord;
    if(req.body.returnTrip){
        let returnTrip = await createOrUpdatetripData(req.body.returnTrip, null);
        returnRecord = await pb.collection('trips').create(returnTrip);
    }
    let trip = await createOrUpdatetripData(req.body, returnRecord);
    console.log(trip);
    try {
        const record = await pb.collection('trips').create(trip);

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
    // const result = await pb.collection('trips').listAuthMethods();

})
router.patch('/:id', async (req, res) => {

    const params = Object.assign({}, req.params);
    let returnRecord;
    if(req.body.returnTrip){
        let mainTrip = await pb.collection('trips').getOne(params.id);
        returnTrip = await createOrUpdatetripData(req.body.returnTrip, null);
        if(!mainTrip.returnTrip){
            returnRecord = await pb.collection('trips').create(returnTrip);
        } else {
            returnRecord = await pb.collection('trips').update(mainTrip.returnTrip, returnTrip);
        }
    }
    let trip = await createOrUpdatetripData(req.body, returnRecord);
    console.log({ trip });
    try {
        const record = await pb.collection('trips').update(params.id, trip);

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
    // const result = await pb.collection('trips').listAuthMethods();

})

router.post('/all', async (req, res) => {
    try {
        let expandKeys = req.body.expandKeys;
        let expandKeyNames = [];
        Object.keys(expandKeys).forEach(key => {
            expandKeyNames.push(key);
        })
        let records = await pb.collection('trips').getList(req.body.from, req.body.to, { expand: expandKeyNames.toString(), filter:
            'totalSeatsLeft>0 && isReturnTrip=false && requestedTrip=false && deleted=false' });
        records = utils.cleanExpandData(records, expandKeys, true);
        records.forEach(e=> {
            e["vehicle"] = e["vehicle"]? e["vehicle"]: null
            e["returnTrip"] = e["returnTrip"]? e["returnTrip"]: null
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

router.post('/allFilter', async (req, res) => {

    let fromToFilter = req.body.filter2;
    let finalFilter = filterToString(req.body.filter);
    let expandKeys = req.body.expandKeys;
    let expandKeyNames = [];
    Object.keys(expandKeys).forEach(key => {
        expandKeyNames.push(key);
    })

    try {
        const records = await pb.collection('trips').getFullList({
            filter: finalFilter,
            expand: expandKeyNames.toString()
        });
        records.forEach(e=> {
            e["vehicle"] = e["vehicle"]? e["vehicle"]: null
            e["returnTrip"] = e["returnTrip"]? e["returnTrip"]: null
        })
        console.log(records)
        if (fromToFilter.from.length > 0 && fromToFilter.to.length > 0) {
            let finalRecords = filterFromAndTo(records, fromToFilter);
            finalRecords = utils.cleanExpandData(finalRecords, expandKeys, false);
            return res.send({
                success: true,
                result: finalRecords
            })

        } else {
            return res.send({
                success: true,
                result: records
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

router.post('/:id', async (req, res) => {
    try {
        let expandKeys = req.body.expandKeys;
        let expandKeyNames = [];
        Object.keys(expandKeys).forEach(key => {
            expandKeyNames.push(key);
        })

        const params = Object.assign({}, req.params);
        let records = await pb.collection('trips').getOne(params.id, { expand: expandKeyNames.toString() });
        let newRecords = [];
        newRecords.push(records);
        newRecords = utils.cleanExpandData(newRecords, expandKeys, false);
        let trip = newRecords[0];
        if(trip.returnTrip){
            let returnRecords = await pb.collection('trips').getOne(trip.returnTrip, { expand: expandKeyNames.toString() });
            let newReturnRecords = [];
            newReturnRecords.push(returnRecords);
            newReturnRecords = utils.cleanExpandData(newReturnRecords, expandKeys, false);
            newReturnRecords.forEach(e=> {
                e["vehicle"] = e["vehicle"]? e["vehicle"]: null
                e["returnTrip"] = e["returnTrip"]? e["returnTrip"]: null
            })
            trip.returnTrip = newReturnRecords[0];
        } else {
            trip.returnTrip = null;
        }
        return res.send({
            success: true,
            result: trip
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
        let trip = await pb.collection('trips').getOne(params.id);
        if(trip.returnTrip){
            const recordsReturn = await pb.collection('trips').update(trip.returnTrip, {deleted: true});
        }
        const records = await pb.collection('trips').update(params.id, {deleted: true});
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
        let records;
        idArr.map(async (id)=>{
            records = await pb.collection('trips').update(id, {deleted: true});
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


module.exports = router;
