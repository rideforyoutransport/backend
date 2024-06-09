const logger = require('../../helpers/logger.js');
const utils = require('../../helpers/utils.js');
const router = require('express').Router();
const confirmVerification  = require('../../pocketbase/pocketbase.js').confirmVerification;

router.post('/createOrder', async(req, res) => {
  try{
    //confirmVerification('user',req.headers.authorization);
    let body = req.body;
    let response = await utils.createStripePaymentIntent(body);
    res.send({
      success: true,
      result: {client_secret: response.client_secret, id: response.id}
    })
  }catch (error){
    console.error("Failed to create order:", error);
    res.send({
      success: false,
      message: "Failed to create order"
    })
  }
});

module.exports=router;
