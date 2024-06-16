const admin = require("firebase-admin");
const serviceAccount = require('./firebaseSecrets');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, query, where ,setDoc} = require('firebase/firestore/lite');

//initialization
const app = initializeApp(serviceAccount);
const db = getFirestore(app);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),

});




// const ref = db.ref('server/saving-data/fireblog');


const sendNotif = async (token, title, body) => {
  try {
    if (!token || typeof token !== 'string') {
      throw new Error('Invalid FCM token provided');
    }
    const message = {
      notification: {
        title: title,
        body: body,
      },
      android: {
        notification: {
          sound: "default",
        },
        data: {
          title: title,
          body: body,
        },
      },
      token: token,
    };
    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
  } catch (error) {
    console.error("Error sending message:", error.message);
    throw error;
  }
};

const getNotificationData = async (userId) => {
  try {
    const notificationCollection = collection(db, 'notificationDetails');
    const q = query(notificationCollection, where("userId", "==", userId)); // Filter by userId

    const querySnapshot = await getDocs(q);
    const notifications = [];

    querySnapshot.forEach((doc) => {
      console.log(doc);
      notifications.push({ id: doc.id, ...doc.data() });
    });
    console.log("notifications", notifications);
    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }

};


const setFCMToken = async (userId,notificationData) => {
  try {
    const notificationCollection = collection(db, "notificationDetails");

    if (userId) {
      // Update only for specific userId
      const q = query(notificationCollection, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // No documents found for this user, create a new one
        const docRef = doc(notificationCollection);
        await setDoc(docRef, { userId, ...notificationData });
        return docRef.id;
      } else {
        // Update existing document for this user
        querySnapshot.forEach((doc) => {
          const docRef = doc.ref;
          setDoc(docRef, { ...notificationData });
        });
        return "Updated existing documents";
      }
    } else {
      // Update all entries
      const docRef = doc(notificationCollection);
      await setDoc(docRef, notificationData);
      return docRef.id;
    }
  } catch (error) {
    console.error("Error updating notification data:", error);
    return null;
  }
};

module.exports = { sendNotif, getNotificationData, setFCMToken };