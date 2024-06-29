const logger = require('../../helpers/logger.js');
const utils = require('../../helpers/utils.js');
const router = require('express').Router();
const {sendNotif,getNotificationData} = require('../../helpers/firebaseFunctions.js');
const {user , driver} = require('../../helpers/constants.js');

const {pb} = require('../../pocketbase/pocketbase.js');



const setFCMToken = async (id,userType,token) => {

  try {
    let oldToken=null;
    if(userType == user){
      // oldToken = await pb.collection('users').getOne(id);
      oldToken = await pb.collection('users').update(id, {'fcmToken':token});

    }else if(userType == driver){
      // oldToken = await pb.collection('driver').getOne(id);
      oldToken = await pb.collection('driver').update(id, {'fcmToken':token});
    }
    return ;
  } catch (error) {
    console.error("Error updating notification data:", error);
    return null;
  }
};

router.get("/bell", async (req, res) => {
    try {
      let token = "your-fcm-token-from-frontend"; // Replace with the actual FCM token
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid FCM token provided');
      }
      await sendNotif(token, "Test Notification", `How are you?`);
      res.json({
        status: "success",
      });
    } catch (error) {
      console.error("Notification API error:", error.message);
      res.status(500).json({
        status: "fail",
        error: error.message,
      });
    }
  });

  router.post("/setToken", async (req, res) => {
    const body = req.body;
    try {
      const resp= await setFCMToken(body.id,body.userType,body.token);
      res.json({
        status: "success",
        response: "Token Added Succesfully "
      });
    } catch (error) {
      console.error("Notification API error:", error.message);
      res.status(500).json({
        status: "fail",
        error: error.message,
      });
    }
  });


             
  module.exports = router;