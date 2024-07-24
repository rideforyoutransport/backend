const { default: axios } = require('axios');
const PocketBase = require('pocketbase/cjs');
const pb_port = normalizePort(process.env.PB_PORT || 'http://127.0.0.1:8080');
const pb = new PocketBase(pb_port);
const pb_authStore = pb.authStore
const currentUser = pb.authStore.model;


const confirmVerificationPb = async (collection, token, refresh) => {

  try {
    await pb.collection(collection).confirmVerification(token);
    if (refresh) {
      await pb.collection(collection).authRefresh();
    }
  } catch (error) {
    console.log(error);
  }


}

const getRecordId = async (collection, token) => {
  const response = await axios({
    method: 'post',
    url: `http://127.0.0.1:8090/api/collections/${collection}/auth-refresh`,
    headers: { 'Content-Type': 'application/json', 'Authorization': token },
  })


  return response.data.record.id;
}

const clearAuth = async (collection, token, refresh) => {
  pb.authStore.clear();
}

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

module.exports = {
  pb,
  confirmVerification: confirmVerificationPb,
  clearAuth,
  getRecordId,
  pb_authStore,
  currentUser
}