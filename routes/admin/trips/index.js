const { duration } = require('moment');
const logger = require('../../../helpers/logger.js');
const utils = require('../../../helpers/utils.js');
const router = require('express').Router();

// const PocketBase = require('pocketbase/cjs')
// var pb_port = process.env.PB_PORT || 'http://127.0.0.1:8090';
// const pb = new PocketBase(pb_port);

<<<<<<< HEAD
=======
const {pb,pb_authStore}  = require('../../../pocketbase/pocketbase.js');




>>>>>>> 722dbba ( chats and essages)
let tripData = {};


const calculateTotalTripAmount = async (tData) => {
    let amount = 0
    const fares = tData.fares;
    fares.forEach(fare => {
        if (fare.from.place_id == tData.from.place_id && fare.to.place_id == tData.to.place_id) {
            amount = fare.fare;
        }
    });
    return amount;
}

const createDataForStops = (data, obj) => {


    const returnStop = {
        "place_id": data[obj].place_id,
        "name": data[obj].place_name,
        "geoLocation": { 'lat': data[obj].lat, 'lng': data[obj].lng },
        "deleted": false
    };
    return returnStop;
}

const createOrUpdatetripData = async (tData, returnTrip) => {

    let totalTripAmount = await calculateTotalTripAmount(tData);
    tripData.totalTripAmount = parseFloat(totalTripAmount);
    tripData.vendor = tData.vendor;
    let recordsOrigin = null, recordsDestination = null, recordFrom = null, recordTo = null;
    let allStops = tData.stops;
    let allStopsIncFromTo = [];
    allStopsIncFromTo.push(tData.from, ...allStops, tData.to);

    let mapsApiOp = await utils.callMapsAPIForETAAll(allStopsIncFromTo);
    console.log({ mapsApiOp });

    tripData.duration = mapsApiOp.duration;
    for (let itr = 0; itr < allStops.length; itr++) {
        allStops[itr].duration = mapsApiOp.durationArray[itr];
    }

    let stopsDetailed = [];

    try {
        let originPlaceId = tData.from.place_id;
        let destinationPlaceId = tData.to.place_id;
        let stops = [];
        recordsOrigin = await pb.collection('stops').getFullList({ filter: `deleted=false && place_id="${originPlaceId}"` });
        recordsDestination = await pb.collection('stops').getFullList({ filter: `deleted=false && place_id="${destinationPlaceId}"` });
        for (const ele of allStops) {
            console.log({ ele });
            let stopPlaceId = ele.place_id;
            let recordStop = await pb.collection('stops').getFullList({ filter: `deleted=false && place_id="${stopPlaceId}"` });

            console.log({ recordStop });
            if (recordStop == null || recordStop.length == 0) {
                const newStop = {
                    "place_id": ele.place_id,
                    "name": ele.place_name,
                    "geoLocation": { 'lat': ele.lat, 'lng': ele.lng },
                    "deleted": false
                };
                let newAddedStop = await pb.collection('stops').create(newStop);
                console.log({ newAddedStop });
                stops = [...stops, newAddedStop.id];
                stopsDetailed.push({id: newAddedStop.id, name: newAddedStop.name, place_id: newAddedStop.place_id, duration: ele.duration});
            } else{
                stops = [...stops, recordStop[0].id];
                stopsDetailed.push({id: recordStop[0].id, name: recordStop[0].name, place_id: recordStop[0].place_id, duration: ele.duration});
            }
            tripData.stops = stops;
        }

        console.log(recordsDestination.length > 0, recordsOrigin.length > 0)
        if (recordsOrigin == null || recordsOrigin.length == 0) {
            const dataFrom = createDataForStops(tData, 'from')
            // console.log({dataFrom});
            recordFrom = await pb.collection('stops').create(dataFrom);
            tripData.from = recordFrom.id;
            // console.log({recordFrom});

        } else
            tripData.from = recordsOrigin[0].id;

        if (recordsDestination == null || recordsDestination.length == 0) {
            const dataTo = createDataForStops(tData, 'to')
            // console.log({dataTo});
            recordTo = await pb.collection('stops').create(dataTo);
            tripData.to = recordTo.id;
            // console.log({recordTo});
        } else
            tripData.to = recordsDestination[0].id;

        // console.log({recordsDestination},{recordsOrigin});


    } catch (error) {
        console.log(error);
    }
    // let tripDuration = await utils.callMapsAPIForETA(tData.from, tData.to, tData.stops); // new fun call 

    tripData.tripDate = tData.tripDate;
    tripData.tripDescription = tData.tripDescription;
    tripData.vehicle = tData.vehicle;
    tripData.driver = tData.driver;
    tripData.luggage = tData.luggage;
    tripData.stopsDetailed = stopsDetailed
    tripData.bookingMinimumAmount = 25;
    tripData.refreshments = tData.refreshments ? tData.refreshments : false;
    tripData.recurring = tData.recurring;
    tripData.promoCodes = tData.promoCodes;
    tripData.fares = { "fares": tData.fares };
    let vehicle;
    if (tData.vehicle) {
        vehicle = await pb.collection('vehicle').getOne(tData.vehicle);
    }

    tripData.totalSeatsLeft = vehicle ? vehicle.totalSeats : tData.totalSeatsLeft;
    tripData.totalSeats = vehicle ? vehicle.totalSeats : tData.totalSeats;
    tripData.isReturnTrip = tData.isReturnTrip ? Boolean(tData.isReturnTrip) : false;
    tripData.returnTrip = returnTrip ? returnTrip.id : null;
    tripData.actualStartTime = tData.actualStartTime;
    tripData.actualEndTime = tData.actualEndTime;
    console.log(tripData);

    return tripData;

}



const filterFromAndTo = (trips, filter) => {
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
        finalFilter = finalFilter.slice(0, finalFilter.length - 3) + '&& isReturnTrip=false && deleted=false';
    }
    console.log("finalFilter", finalFilter);
    return finalFilter

}

router.post('/add', async (req, res) => {
    console.log(req.body);
    let returnRecord;
    if (req.body.returnTrip) {
        let returnTrip = await createOrUpdatetripData(req.body.returnTrip, null);
        returnRecord = await pb.collection('trips').create(returnTrip);
    }
    let trip = await createOrUpdatetripData(req.body, returnRecord);
    console.log(trip.stops);
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
    if (req.body.returnTrip) {
        let mainTrip = await pb.collection('trips').getOne(params.id);
        returnTrip = await createOrUpdatetripData(req.body.returnTrip, null);
        if (!mainTrip.returnTrip) {
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
        let records = await pb.collection('trips').getList(req.body.from, req.body.to, {
            expand: expandKeyNames.toString(), filter:
                'totalSeatsLeft>0 && isReturnTrip=false && deleted=false'
        });
        console.log(records);
        records = utils.cleanExpandData(records, expandKeys, true);
        records.forEach(e => {
            e["vehicle"] = e["vehicle"] ? e["vehicle"] : null
            e["returnTrip"] = e["returnTrip"] ? e["returnTrip"] : null
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
        records.forEach(e => {
            e["vehicle"] = e["vehicle"] ? e["vehicle"] : null
            e["returnTrip"] = e["returnTrip"] ? e["returnTrip"] : null
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

router.post('/details/:id', async (req, res) => {
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
        if (trip.returnTrip) {
            let returnRecords = await pb.collection('trips').getOne(trip.returnTrip, { expand: expandKeyNames.toString() });
            let newReturnRecords = [];
            newReturnRecords.push(returnRecords);
            newReturnRecords = utils.cleanExpandData(newReturnRecords, expandKeys, false);
            newReturnRecords.forEach(e => {
                e["vehicle"] = e["vehicle"] ? e["vehicle"] : null
                e["returnTrip"] = e["returnTrip"] ? e["returnTrip"] : null
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
        if (trip.returnTrip) {
            const recordsReturn = await pb.collection('trips').update(trip.returnTrip, { deleted: true });
        }
        const records = await pb.collection('trips').update(params.id, { deleted: true });
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
        let idArr = req.body.ids;
        idArr.map(async (id) => {
            await pb.collection('trips').update(id, { deleted: true });
        })
        return res.send({
            success: true,
            result: { message: "Deleted successfully!" }
        })
    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error
        })
    }

})


module.exports = router;
