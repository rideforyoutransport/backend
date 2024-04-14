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
const createOrUpdatetripData =(tData)=>{

    tripData.vendor=tData.vendor;
    tripData.from=tData.from;
    tripData.to=tData.to;
    tripData.duration=tData.duration;
    tripData.date=tData.date;
    tripData.vehicle=tData.vehicle;
    tripData.driver=tData.drive;
    tripData.luggage=tData.luggage;
    tripData.stops=tData.stops;
    tripData.bma=tData.bma;
    tripData.tta=tData.tta;
    tripData.refreshments=tData.refreshments;
    tripData.cancelationCharges=tData.cancelationCharges;
    tripData.recurring=tData.recurring;
    tripData.promoCodes=tData.promoCodes;

    return tripData;
}


const filterToString = (filter) =>{

    
    finalFilter=""
    // for(key in filter){
    //     console.log(key, filter[key]);
    // }
    filter.forEach(element => {
        console.log(element);
        let eleFilter=element.fieldName+" "+element.operand+" '"+element.value+"'"
        finalFilter+=eleFilter+' && '
        // console.log(element.getKey(),element[element.gerKey()]);
        
    });
    finalFilter=finalFilter.slice(0,finalFilter.length-3);
    console.log(finalFilter)
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
    console.log({trip});
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

router.get('/all', async (req, res) => {
    try {
        const records = await pb.collection('trips').getList(req.body.from, req.body.to); 
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



router.get('/allFilter', async (req, res) => {

    let filter=req.body.filter;
    let finalFilter=filterToString(req.body.filter2)
    finalFilter = finalFilter + " & stops.expand.name='1'"
    console.log(finalFilter);
    try {
        const records = await pb.collection('trips').getFullList({ filter:finalFilter,
            expand: 'stops'}); 
            console.log(records);
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
        const records = await pb.collection('trips').getOne(params.id); 
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
