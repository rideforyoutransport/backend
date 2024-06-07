var axios = require("axios");
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_BASE_URL } = process.env;
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const EPOCH_24H= 86400;


const cleanExpandData = (data, keys, paginatedData) => {
    console.log(data);
    if (paginatedData) {
        data = data.items;
    }
    if (data.length > 0 && data[0].expand) {
        data.forEach(element => {
            let expandObject = element.expand
            delete element.expand;
            Object.keys(expandObject).forEach(key => {
                delete element[key];
                element[key] = createNewKeyObject(expandObject[key], keys[key] != null && keys[key].length > 0 ? keys[key] : ["id", "name"]);
            });

        });
    }

    return data;
}

const createNewKeyObject = (data, keys_to_keep) => {

    if (data instanceof Array) {
        data.forEach((d) => {
            Object.keys(d).forEach((key) => {
                if (!keys_to_keep.includes(key)) {
                    delete (d[key])
                }
            })
        })
    } else {
        Object.keys(data).forEach((key) => {
            if (!keys_to_keep.includes(key)) {
                delete (data[key])
            }
        })
    }
    return data;
}
let generateDynamicMailBody = (mail, details, is_subject) => {
    let process_env = process.env.AWS_BUCKET_NAME;
    let Obj = {
        '%issue_date%': details.issue_date,
        '%due_date%': details.due_date,
        '%owner_name%': details.owner_name,
        '%s_no%': details.s_no,
        '%space_name%': details.space_name,
        '%total_amount%': details.total_amount,
        '%space_logo%': details.space_logo,
        '%member_name%': details.member_name
    }
    let reg = new RegExp(Object.keys(Obj).join('|'), 'gi');

    if (!is_subject) {
        mail = details.is_logo_attached && details.space_logo ? mail +
            `<br><img src='https://s3.ap-south-1.amazonaws.com/${process_env}/logos/%space_logo%'` +
            ` style='width:170px'>` : mail;
    }
    return mail.replace(reg, function (matched) {
        return Obj[matched.toLowerCase()];
    });
};

let getRandomSixDigitPasscode = (passcode) => {
    let new_passcode = Math.floor(100000 + Math.random() * 900000);

    if (passcode == new_passcode) {
        return getRandomSixDigitPasscode(passcode);
    } else {
        return new_passcode;
    }
}

let asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
let getDayOfWeek = (date) => {
    const dayOfWeek = new Date(date).getDay();
    return isNaN(dayOfWeek) ? null :
        ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
}



let getReferralCode = function (name) {
    return name.slice(0, 4) + (Date.now().toString(36) +
        Math.random().toString(36).substr(2, 5))
        .toUpperCase().slice(7, 10);
}

let sendErrorMail = (error, source_file, source_function, details) => {
    let email_details = {
        email: process.env.DEV_EMAIL || 'hi@brskly.co',
        sender_email: process.env.EMAIL_FROM,
        subject: 'Error occured in ' + source_function,
        sender_name: 'DEV ERROR',
        html_content: `<p> Error in func -> <b>${source_function}</b> From File ->
        <b>${source_file}</b></p><p><br>Body<br>- ${error}</p><br>Details- ${details}`
    };

    emailService.send(email_details);
}

const callMapsAPIForETA = async (from, to, stops) => {

    let eta = 1;

    console.log("queryParamsforMaps", createStringForStops(stops) + `${to.lat},${to.lng}`);
    axios({
        url: 'https://maps.googleapis.com/maps/api/distancematrix/json',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        params: {
            'origins': (`${from.lat},${from.lng}`),
            "key": process.env.MAPS_KEY,
            "destinations": (createStringForStops(stops) + `${to.lat},${to.lng}`)
        }
    })
        .then(async function (response) {
            eta = response.data.rows;
            return calculateTotalDuration(eta[0].elements)
        })
        .catch(function (error) {
            console.log(error)
        })
    return eta;
}
const callMapsAPIForETAAll = async (stops) => {

    let duration = 0, durationArray = [];
    for (let origin = 0; origin < stops.length - 1; origin++) {
        let tempDuration = await callMapsApi(stops[origin], stops[origin + 1]);
        duration += tempDuration
        durationArray.push(tempDuration);
    }

    console.log({ duration, durationArray })
    return { duration, durationArray };
}
async function callMapsApi(originEle, destinationEle) {

    return axios({
        url: 'https://maps.googleapis.com/maps/api/distancematrix/json',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        params: {
            'origins': (`${originEle.lat},${originEle.lng}`),
            "key": process.env.MAPS_KEY,
            "destinations": `${destinationEle.lat},${destinationEle.lng}`
        }
    })
        .then(async function (response) {
            let respRows = response.data.rows[0].elements;
            console.log("this maps api ", parseInt(respRows[0].duration.value))
            return parseInt(respRows[0].duration.value);
        })
        .catch(function (error) {
            console.log(error)
        })
}

const generateAccessTokenPayPal = async () => {
    try {
        if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
            throw new Error("MISSING_API_CREDENTIALS");
        }
        const auth = Buffer.from(
            PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
        ).toString("base64");
        const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
            method: "POST",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });
        const data = await response.json();
        await console.log(data);

        return data.access_token;
    } catch (error) {
        console.error("Failed to generate Access Token:", error);
    }
};
const generateClientTokenPapPal = async () => {
    const accessToken = await generateAccessTokenPayPal();
    const url = `${PAYPAL_BASE_URL}/v1/identity/generate-token`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Accept-Language": "en_US",
            "Content-Type": "application/json",
        },
    });

    return handleResponse(response);
};

/**
* Create an order to start the transaction.
* @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
*/
const createOrderPayPal = async (cart) => {
    // use the cart information passed from the front-end to calculate the purchase unit details
    console.log(
        "shopping cart information passed from the frontend createOrder() callback:",
        cart,
    );

    const accessToken = await generateAccessTokenPayPal();
    const url = `${PAYPAL_BASE_URL}/v2/checkout/orders`;
    const payload = {
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "CAD",
                    value: cart.amount,
                },
                items: [
                    {
                        name: cart.name,
                        quantity: 1,
                        unit_amount: {
                            currency_code: "CAD",
                            value: cart.amount
                        }
                    }
                ]
            },
        ],
    };

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
            // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
            // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
            // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
            // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
        },
        method: "POST",
        body: JSON.stringify(payload),
    });

    return handleResponse(response);
};


/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
const captureOrderPayPal = async (orderID) => {
    const accessToken = await generateAccessTokenPayPal();
    const url = `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`;
  
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
        // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
        // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
      },
    });
  
    return handleResponse(response);
  };
  
  async function handleResponse(response) {
    try {
      const jsonResponse = await response.json();
      return {
        jsonResponse,
        httpStatusCode: response.status,
      };
    } catch (err) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
  }

const calculateTotalDuration = (eta) => {
    let duration = 0;
    eta.forEach(element => {
        duration += element.duration.value;
    });
    return duration;
}

const createStringForStops = (stops) => {
    let finalParam = ''
    stops.forEach(element => {
        finalParam = finalParam + `${element.lat},${element.lng}|`
    });
    // finalParam = finalParam.substring(0, finalParam.length - 1);
    console.log({ finalParam })
    return finalParam;
}

const initiateRefund=async (amount,payment_intent)=>{

const refund = await stripe.refunds.create({
  payment_intent: payment_intent,
  amount: amount
});
return refund;
}


module.exports = {

    getReferralCode,
    sendErrorMail,
    getRandomSixDigitPasscode,
    asyncForEach,
    generateDynamicMailBody,
    getDayOfWeek,
    cleanExpandData,
    callMapsAPIForETA,
    calculateTotalDuration,
    callMapsAPIForETAAll,
    generateAccessTokenPayPal,
    generateClientTokenPapPal,
    createOrderPayPal,
    captureOrderPayPal,
    initiateRefund,
    EPOCH_24H

}
