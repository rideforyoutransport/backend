const logger = require('../../helpers/logger.js');
const utils = require('../../helpers/utils.js');
const router = require('express').Router();

const {pb,pb_authStore}  = require('../../pocketbase/pocketbase.js');


router.get('/:id', async (req, res) => {
    try {
        const params = Object.assign({}, req.params);
        const records = await pb.collection('chats').getOne(params.id);
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

router.post('/getChat', async (req, res) => {
    try {

        // recordsDestination = await pb.collection('stops').getFullList({ filter: `deleted=false && place_id="${destinationPlaceId}"` });

        const reqBody = Object.assign({}, req.body);
        console.log({reqBody})
        let filter ='';
        filter=filter+ `driver="${reqBody.driver}"`;
        if(reqBody.trip &&  reqBody.trip!=''){
            filter=filter+ `trip="${reqBody.trip}"`;
        }
        if(reqBody.booking &&  reqBody.booking!='' && reqBody.trip && reqBody.trip!='' ){
            filter=filter+ ` && booking="${reqBody.booking}"`;
        }else if(reqBody.booking){
            filter=filter+ `booking="${reqBody.booking}"`;
        }
        if(reqBody.user &&  reqBody.user!='' && reqBody.booking &&reqBody.booking!=''){
            filter=filter+ ` && user="${reqBody.user}"`;
        }else if(reqBody.user){
            filter=filter+ `user="${reqBody.user}"`;
        }
        console.log({filter});
        const records = await pb.collection('chats').getFullList({ filter: filter });
        console.log(records);
        return res.send({
            success: true,
            result: records[0]
        })
    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: "thithjhjk"
        })
    }

})

router.post('/createChat', async (req, res) => {
    try {
        let data = req.body;
        // const params = Object.assign({}, req.params);
        let records = await pb.collection('chats').create(data);
        return res.send({
            success: true,
            result: records
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



