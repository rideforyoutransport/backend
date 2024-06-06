const logger = require('../../helpers/logger.js');
const utils = require('../../helpers/utils.js');
const router = require('express').Router();
const confirmVerification  = require('../../pocketbase/pocketbase.js').confirmVerification;
 
const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env;



router.get('/secrets', async (req, res) => {
  try {
      confirmVerification('user',req.headers.authorization);
      res.status(200).json({STRIPE_PUBLISHABLE_KEY,STRIPE_SECRET_KEY});
    } catch (error) {
      console.error("Failed to Read Secrets from env", error);
      res.status(500).send({ error: "Failed to Read Secrets from env" });
    }
});

router.post('/token', async (req, res) => {
    try {
        const { jsonResponse, httpStatusCode } = await utils.generateClientTokenPapPal();
        res.status(httpStatusCode).json(jsonResponse);
      } catch (error) {
        console.error("Failed to generate client token:", error);
        res.status(500).send({ error: "Failed to generate client token." });
      }
});

router.post("/orders", async (req, res) => {
    try {
      // use the cart information passed from the front-end to calculate the order amount detals
      const { cart } = req.body;
      const { jsonResponse, httpStatusCode } = await utils.createOrderPayPal(cart);
      console.log(httpStatusCode, jsonResponse);
      res.send({
        status: true,
        code: httpStatusCode,
        order_id: jsonResponse.id
      });
    } catch (error) {
      console.error("Failed to create order:", error);
      res.send({
        status: false,
        message: "Failed to create order"
      })
    }
  });

  router.post("/orders/:orderID/capture", async (req, res) => {
    try {
      const { orderID } = req.params;
      const { jsonResponse, httpStatusCode } = await utils.captureOrderPayPal(orderID);
      res.send({
        status: true,
        code: httpStatusCode,
        result: jsonResponse
      });
    } catch (error) {
      console.error("Failed to create order:", error);
      res.send({
        status: false,
        message: "Failed to capture order"
      })
    }
  });
  


module.exports=router;
