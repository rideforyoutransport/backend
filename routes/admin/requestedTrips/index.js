const logger = require('../../../helpers/logger.js');
const utils = require('../../../helpers/utils.js');
const router = require('express').Router();

const {pb,pb_authStore}  = require('../../../pocketbase/pocketbase.js');

router.post('/all', async (req, res) => {
    try {
        let expandKeys = req.body.expandKeys;
        let expandKeyNames = [];
        Object.keys(expandKeys).forEach(key => {
            expandKeyNames.push(key);
        })
        console.log(expandKeys);
        let from = req.body.from? req.body.from: 0;
        let to = req.body.to? req.body.to: 100
        let records = await pb.collection('requestedTrips').getList(from, to, { expand: expandKeyNames.toString(), filter:
            'deleted=false', sort: '-created' });
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
