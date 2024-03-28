var express = require('express');
var app = express();
const PocketBase = require('pocketbase/cjs')

const pb = new PocketBase('http://127.0.0.1:8090');

app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(3000, function () {

    const admin =async ()=>{
        const adminData = await pb.admins.authWithPassword('rideforyoutransport@gmail.com', 'ride4u@12345');
        const result = await pb.collection('users').listAuthMethods();
        // await pb.collection('users').requestVerification('rideforyoutransport@gmail.com');
      

// const result = await pb.collection('users').listExternalAuths(
//     pb.authStore.model.id
// );

        // const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });

        console.log(result);
        // console.log(adminData);
    }



    admin();
  console.log('Example app listening on port 3000!');
});






// list and filter "example" collection records


// const result = await pb.collection('example').getList(1, 20, {
//     filter: 'status = true && created > "2022-08-01 10:00:00"'
// });

// // authenticate as auth collection record
// const userData = await pb.collection('users').authWithPassword('test@example.com', '123456');

// or as super-admin


// // and much more...