const logger = require('../../helpers/logger.js');
const utils = require('../../helpers/utils.js');
const router = require('express').Router();

const {pb,pb_authStore}  = require('../../pocketbase/pocketbase.js');



let driverData = {};


const createOrUpdateDriverData = (dData) => {

    driverData.name = dData.name;
    driverData.email = dData.email;
    driverData.emailVisibility = true;
    driverData.rating = dData.rating;
    driverData.totalTrips = dData.totalTrips;
    driverData.vendorId = dData.vendorId;
    driverData.number = dData.number;
    driverData.username = dData.username;
    driverData.password = dData.password;
    driverData.passwordConfirm = dData.password;
    driverData.phoneNumber = dData.phoneNumber;
    if (dData["oldPassword"]) {
        driverData.oldPassword = dData["oldPassword"];
    }

    return driverData;
}

router.post('/login', async (req, res) => {

    try {
        const adminData = await pb.collection('driver').authWithPassword(req.body.email, req.body.password);
        console.log(adminData);

        return res.send({
            success: true,
            result: { id: adminData.record.id, token: adminData.token }
        })

    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response.message
        })
    }

})
router.post('/logout', async (req, res) => {

    try {
        pb.authStore.clear();
        return res.send({
            success: true,
            result: "Logged Out Succesfully "
        })

    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error
        })
    }

})


// verify email via the auth token , not 6digit code 
router.post('/verify', async (req, res) => {
    try {
        await pb.collection('driver').requestVerification(req.body.email);
        return res.send({
            success: true,
            result: "Please Open your email and Click on verify"
        })

    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response.message
        })
    }
})
// Reset password will work from chrome/ application URL not from the Application
router.post('/resetPassword', async (req, res) => {
    try {
        await pb.collection('driver').requestPasswordReset(req.body.email);
        return res.send({
            success: true,
            result: "Please Open your email and Click on verify"
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
    let driver = createOrUpdateDriverData(req.body);
    console.log({ driver });
    try {
        const record = await pb.collection('driver').update(params.id, driver);

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
    // const result = await pb.collection('driver').listAuthMethods();

})

router.post('/all', async (req, res) => {
    try {
        const records = await pb.collection('driver').getList(req.body.from, req.body.to);

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


router.post('/allTrips', async (req, res) => {
    try {
        let expandKeys = req.body.expandKeys;
        let expandKeyNames = [];
        Object.keys(expandKeys).forEach(key => {
            expandKeyNames.push(key);
        })
        let typeFilter = '';

        if (req.body.type == 0) {
            typeFilter = "tripDate < @now"
        } else if (req.body.type == 1) {
            typeFilter = "tripDate > @now"
        }
        console.log(typeFilter);
        let trips = await pb.collection('trips').getList(req.body.from, req.body.to, { expand: expandKeyNames.toString(),
            filter: typeFilter+"&& driver=\""+`${req.body.id}`+"\""+" && requestedTrip=false && deleted=false" });

        trips = utils.cleanExpandData(trips, expandKeys, true);
        trips.forEach(e=> {
            e["vehicle"] = e["vehicle"]? e["vehicle"]: null
            e["returnTrip"] = e["returnTrip"]? e["returnTrip"]: null
        })
        // if(trips.length>0){
        //     trips.forEach(e=> {
        //         e["vehicle"] = e["vehicle"]? e["vehicle"]: null
        //         e["returnTrip"] = e["returnTrip"]? e["returnTrip"]: null
        //     })
        //     for(let i = 0; i< trips.length; i++){
        //         let trip = trips[i];
        //         let bookings = await pb.collection('bookings').getList(req.body.from, req.body.to, {filter: "trip=\""+`${trip.id}`+"\"" });
        //         bookings = utils.cleanExpandData(bookings, [], true);
        //         let tempBookings = [];
        //         bookings.forEach(booking=>{
        //             let details = booking.otherUsers["details"];
        //             booking.otherUsers["details"] = JSON.parse(details);
        //             return booking;
        //         })
        //         trip.bookings = bookings;
    
        //     }
        // }

        return res.send({
            success: true,
            result: trips
        })
    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response.message
        })
    }

})

router.post('/trip/:id', async (req, res) => {
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
        trip["vehicle"] = trip["vehicle"]? trip["vehicle"]: null;
        trip["returnTrip"] = trip["returnTrip"]? trip["returnTrip"]: null;
        let expandNames = ["from", "to"];
        let bookings = await pb.collection('bookings').getList(req.body.from, req.body.to, {expand: expandNames.toString(), filter: "trip=\""+`${trip.id}`+"\"" });
        let expandKeysBookings = {
            from: ["name", "id", "place_id"],
            to: ["name", "id", "place_id"]
        };
        bookings = utils.cleanExpandData(bookings, expandKeysBookings, true);
        let keys = ["amountLeft", "amountPaid", "bookingDate", "created", "deleted", "from", "id", "luggageTypeOpted", "otherUsers", "refreshmentsOpted", "status", "tipAmount", "tipPaid", "to", "totalAmount", "totalSeatsBooked", "user", "rating", "review"];
        bookings.forEach(booking=>{
            let details = booking.otherUsers["details"];
            booking.otherUsers["details"] = JSON.parse(details);
            Object.keys(booking).forEach(key => {
                if(!keys.includes(key)){
                    delete booking[key];
                }
            });
            return booking;
        })
        trip.bookings = bookings;
        
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


router.get('/:id', async (req, res) => {
    try {
        const params = Object.assign({}, req.params);
        const records = await pb.collection('driver').getOne(params.id);
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
        const records = await pb.collection('driver').update(params.id, {deleted: true});
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


router.get('/message/:id', async (req, res) => {
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
            message: error.response.message
        })
    }

})

router.get('/message', async (req, res) => {
    try {
        // const params = Object.assign({}, req.params);
        const records = await pb.collection('chats').getFullList();
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
router.post('/chats', async (req, res) => {
    try {

        // recordsDestination = await pb.collection('stops').getFullList({ filter: `deleted=false && place_id="${destinationPlaceId}"` });

        const reqBody = Object.assign({}, req.body);
        console.log({reqBody})
        let filter ='';
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
            result: records
        })
    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: "thithjhjk"
        })
    }

})

router.post('/message', async (req, res) => {
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



