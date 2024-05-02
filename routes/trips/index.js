const logger = require('../../helpers/logger.js');
const utils = require('../../helpers/utils.js');
const router = require('express').Router();

const PocketBase = require('pocketbase/cjs')
var pb_port = process.env.PB_PORT || 'http://127.0.0.1:8090';
const pb = new PocketBase(pb_port);





let tripData = {};
// const data = {

//     "vendor": "RELATION_RECORD_ID",
//     "from": "JSON",
//     "to": "JSON",
//     "duration": 123,
//     "date": "2022-01-01 10:00:00.123Z",
//     "vehicle": "RELATION_RECORD_ID",
//     "drive": "RELATION_RECORD_ID",
//     "luggage": [
//         "s"
//     ],
//     "stops": "JSON",
//     "bma": "test",
//     "tta": "test",
//     "refreshments": true,
//     "cancelationCharges": "test",
//     "recurring": "2022-01-01 10:00:00.123Z",
//     "promoCodes": "test"
// };
const createOrUpdatetripData = (tData) => {

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
    tripData.bookingMinimumAmount = tData.bookingMinimumAmount;
    tripData.totalTripAmount = tData.totalTripAmount;
    tripData.refreshments = tData.refreshments;
    tripData.cancelationCharges = tData.cancelationCharges;
    tripData.recurring = tData.recurring;
    tripData.promoCodes = tData.promoCodes;
    // needs to be removed after 15/04/24 demo 
    tripData.totalSeatsLeft = tData.totalSeatsLeft;
    tripData.totalSeats = tData.totalSeatsLeft;
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

const calculateFinalStops = (allStops)=>{

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

    if(filter.length>0){
        filter.forEach(element => {
            console.log(element);
            let eleFilter = element.fieldName + " " + element.operand + " '" + element.value + "'"
            finalFilter += eleFilter + ' && '
    
        });
        finalFilter = finalFilter.slice(0, finalFilter.length - 3);
    }    
    console.log("finalFilter",finalFilter);
    return finalFilter
   
}

router.post('/add', async (req, res) => {

    let trip = createOrUpdatetripData(req.body);
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
            error: error
        })
    }
    // const result = await pb.collection('trips').listAuthMethods();

})
router.patch('/:id', async (req, res) => {

    const params = Object.assign({}, req.params);
    let trip = createOrUpdatetripData(req.body);
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
            error: error
        })
    }
    // const result = await pb.collection('trips').listAuthMethods();

})

router.post('/all', async (req, res) => {
    try {
        let expandKeys = req.body.expandKeys;
        let expandKeyNames =[];
        Object.keys(expandKeys).forEach(key =>{
            expandKeyNames.push(key);
        })
        let records = await pb.collection('trips').getList(req.body.from, req.body.to,{expand:expandKeyNames.toString()});
        records =  utils.cleanExpandData(records,expandKeys,true);
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



router.post('/allFilter', async (req, res) => {

    let fromToFilter = req.body.filter2;
    let finalFilter = filterToString(req.body.filter)
    let expandKeys = req.body.expandKeys;
    let expandKeyNames =[];
    Object.keys(expandKeys).forEach(key =>{
        expandKeyNames.push(key);
    })

    try {
        const records = await pb.collection('trips').getFullList({
            filter: finalFilter,
            expand:expandKeyNames.toString()
        });
        console.log(records)
        if(fromToFilter.from.length>0 && fromToFilter.to.length>0){
            let finalRecords = filterFromAndTo(records, fromToFilter);
            finalRecords=  utils.cleanExpandData(finalRecords,expandKeys,false);
            return res.send({
                success: true,
                result: finalRecords
            })
           
        }else{
            return res.send({
                success: true,
                result: records
            })
        }
       
       
    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            error: error
        })
    }
})

router.post('/:id', async (req, res) => {
    try {
        let expandKeys = req.body.expandKeys;
        let expandKeyNames =[];
        Object.keys(expandKeys).forEach(key =>{
            expandKeyNames.push(key);
        })
    
        const params = Object.assign({}, req.params);
        let records = await pb.collection('trips').getOne(params.id, {expand:expandKeyNames.toString()});
        let newRecords=[];
        newRecords.push(records);
        console.log(newRecords);
        newRecords=  utils.cleanExpandData(newRecords,expandKeys,false);
        return res.send({
            success: true,
            result: newRecords
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
        const records = await pb.collection('trips').delete(params.id);
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
