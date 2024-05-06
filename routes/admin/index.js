const logger = require('../../helpers/logger');
const utils = require('../../helpers/utils.js');
const router = require('express').Router();

const PocketBase = require('pocketbase/cjs')
var pb_port =  process.env.PB_PORT || '8090';
const pb = new PocketBase(pb_port);

router.get('/validate', async (req, res) => {
    
        const adminData = await pb.admins.authWithPassword('rideforyoutransport@gmail.com', 'ride4u@12345');
        const result = await pb.collection('users').listAuthMethods();
    
        console.log(result,adminData);
        return res.send({
            success: true,
            result:result,
            adminData:adminData
          })

    
  })
// Reset password will work from chrome/ application URL not from the Application
router.post('/resetPassword', async (req, res) => {
    try {
        await pb.collection('admin').requestPasswordReset(req.body.email);
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


console.log('Example app listening on port 3000!');




router.use('/vendor', require('./vendor'));
router.use('/vehicle', require('./vehicle'));
router.use('/driver', require('./driver'));
router.use('/scheduledTrip', require('./scheduledTrip'));
router.use('/booking', require('./booking'));
router.use('/user', require('./user'));
router.use('/promoCode', require('./promoCode'));
router.use('/stops', require('./stops'));




module.exports = router;
