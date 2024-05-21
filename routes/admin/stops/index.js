const logger = require('../../../helpers/logger.js');
const utils = require('../../../helpers/utils.js');
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

const createOrUpdatestopData = (bData) => {

    stopData.name = bData.name;
    stopData.geoLocation = bData.geoLocation;

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
            message: error.response.message
        })
    }

})
router.patch('/:id', async (req, res) => {

    const params = Object.assign({}, req.params);
    let stops = createOrUpdatestopData(req.body);
    console.log({ stops });
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
            message: error.response.message
        })
    }

})

router.get('/all', async (req, res) => {
    try {

         //      origin = await pb.collection('stops').getList(0,10,{
    //         filter: `'place_id = ${tData.from.place_id}'`
    //     });
    //     destination = await pb.collection('stops').getList(0,10,{
    //         filter: `'place_id = ${tData.to.place_id}'`
    //     });
    // console.log({origin},{destination});
    const someVar = "ChIJL_P_CXMEDTkRw0ZdG-0GVvw";
        const records = await pb.collection('stops').getFullList({filter: `deleted=false && place_id="${someVar}"`});
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
            message: error.response.message
        })
    }

})

router.delete('/:id', async (req, res) => {
    try {
        const params = Object.assign({}, req.params);
        const records = await pb.collection('stops').update(params.id, {deleted: true});
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
        idArr.map(async (id)=>{
            await pb.collection('stops').update(id, {deleted: true});
        })
        return res.send({
            success: true,
            result: {message: "Deleted successfully!"}
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
