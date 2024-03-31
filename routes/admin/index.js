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
