
const cleanExpandData = (data, keys,paginatedData) => {
    console.log(data);
    if(paginatedData){
        data=data.items;
    }
    data.forEach(element => {
        let expandObject = element.expand
        delete element.expand;
        Object.keys(expandObject).forEach(key => {
            delete element[key];
            element[key] = createNewKeyObject(expandObject[key], keys[key]!=null && keys[key].length >0 ? keys[key] : ["id", "name"]);
        });

    });

    return data;
}

const createNewKeyObject = (data, keys_to_keep) => {

    Object.keys(data).forEach((key) => {
        if (!keys_to_keep.includes(key)) {
            delete (data[key])
        }
    })
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



module.exports = {

    getReferralCode,
    sendErrorMail,
    getRandomSixDigitPasscode,
    asyncForEach,
    generateDynamicMailBody,
    getDayOfWeek,
    cleanExpandData
}
