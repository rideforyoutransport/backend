const logger = require('../../helpers/logger.js');
const utils = require('../../helpers/utils.js');
const router = require('express').Router();




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
      res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
      console.error("Failed to create order:", error);
      res.status(500).json({ error: "Failed to create order." });
    }
  });

  router.post("/orders/:orderID/capture", async (req, res) => {
    try {
      const { orderID } = req.params;
      const { jsonResponse, httpStatusCode } = await utils.captureOrderPayPal(orderID);
      res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
      console.error("Failed to create order:", error);
      res.status(500).json({ error: "Failed to capture order." });
    }
  });
  


module.exports=router;
