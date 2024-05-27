const logger = require('../../helpers/logger.js');
const utils = require('../../helpers/utils.js');
const router = require('express').Router();

const {pb,pb_authStore,currentUser}  = require('../../pocketbase/pocketbase.js');



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
        // console.log(adminData);

        if(adminData.record.verified){
            return res.send({
                success: true,
                result: { id: adminData.record.id, token: adminData.token }
            })
        } else {
            return res.send({
                success: false,
                verified: 0,
                message: "Email Verification Required!"
            })
        }
    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response && error.response.message ? error.response.message: "Something went wrong! Please try again later!"
        })
    }

})
router.post('/logout', async (req, res) => {

    try {
        console.log(pb_authStore,"this is the user");
        pb.authStore.clear();
        return res.send({
            success: true,
            message: "Logged Out Succesfully "
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
            message: "Please Open your email and Click on verify"
        })

    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response && error.response.message ? error.response.message: "Something went wrong! Please try again later!"
        })
    }
})
// Reset password will work from chrome/ application URL not from the Application
router.post('/resetPassword', async (req, res) => {
    try {
        await pb.collection('driver').requestPasswordReset(req.body.email);
        return res.send({
            success: true,
            message: "Please Open your email and Click on verify"
        })

    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response && error.response.message ? error.response.message: "Something went wrong! Please try again later!"
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
            message: error.response && error.response.message ? error.response.message: "Something went wrong! Please try again later!"
        })
    }
    // const result = await pb.collection('driver').listAuthMethods();

})

router.post('/all', async (req, res) => {
    try {
        console.log("current user from all users req ",(pb_authStore.baseModel));

        const records = await pb.collection('driver').getList(req.body.from, req.body.to);

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

        return res.send({
            success: true,
            result: trips
        })
    } catch (error) {
        logger.error(error);
        return res.send({
            success: false,
            message: error.response && error.response.message ? error.response.message: "Something went wrong! Please try again later!"
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
            message: error.response && error.response.message ? error.response.message: "Something went wrong! Please try again later!"
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
            message: error.response && error.response.message ? error.response.message: "Something went wrong! Please try again later!"
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
            message: error.response && error.response.message ? error.response.message: "Something went wrong! Please try again later!"
        })
    }

})

router.post('/allChats', async (req, res) => {
    try {
        // const params = Object.assign({}, req.params);
        let filter= `driver="${req.body.driver}"`;
        console.log("filter",filter);
        const records = await pb.collection('chats').getFullList({filter: filter});
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

module.exports=router;
