const logger = require('../../helpers/logger.js');
const utils = require('../../helpers/utils.js');
const router = require('express').Router();

const PocketBase = require('pocketbase/cjs')
var pb_port = process.env.PB_PORT || 'http://127.0.0.1:8090';
const pb = new PocketBase(pb_port);


let stopData = {};

// example update data
// const data = {
//     "name": "test",
//     "geoLocation": "JSON"
// };

const createOrUpdatestopData =(bData)=>{

    stopData.name=bData.name;
    stopData.geoLocation=bData.geoLocation;
 
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
