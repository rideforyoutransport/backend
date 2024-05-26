const logger = require('../../../helpers/logger.js');
const utils = require('../../../helpers/utils.js');
const router = require('express').Router();

const {pb,pb_authStore}  = require('../../../pocketbase/pocketbase.js');


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
        finalFilter = finalFilter.slice(0, finalFilter.length - 3)+'&& isReturnTrip=false && deleted=false';
    }
    console.log("finalFilter", finalFilter);
    return finalFilter

}

router.post('/all', async (req, res) => {
    try {
        let expandKeys = req.body.expandKeys;
        let expandKeyNames = [];
        Object.keys(expandKeys).forEach(key => {
            expandKeyNames.push(key);
        })
        let records = await pb.collection('trips').getList(req.body.from, req.body.to, { expand: expandKeyNames.toString(), filter:
            'tripDate > @now && totalSeatsLeft>0 && isReturnTrip=false && deleted=false' });
        records = utils.cleanExpandData(records, expandKeys, true);
        records.forEach(e=> {
            e["vehicle"] = e["vehicle"]? e["vehicle"]: null
            e["returnTrip"] = e["returnTrip"]? e["returnTrip"]: null
        })
        console.log(records);
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
        console.log(trip.stopsDetailed);
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


module.exports = router;
