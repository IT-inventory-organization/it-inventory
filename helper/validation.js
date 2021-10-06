/**
 * Check Password if its Correct with the format
 * @param {String} password 
 * @returns A Correct Format Password
 */
 function passwordFormat(password) {
    if(typeof password == 'undefined' || password.length == 0){
        throw new Error('Password Input is empty');
    }
    password = password.toString();
    if (password.length < 8) {
        throw new Error('Password Length Min 8')
    }
    if(!(/(?=[a-z])/g.test(password))){
        throw new Error('Password At Least Contain Lowercase')
    }
    if (!(/(?=[A-Z])/g.test(password))) {
        throw new Error('Password At Least One UpperCase');
    }
    if (!(/(?=[0-9])/g.test(password))) {
        throw new Error('Password At Least One Number');
    }

    return true;
}

function checkPhoneNumber(value){
    let mobile_number = value;
        if(typeof mobile_number !== 'string'){
            mobile_number = ""+mobile_number;
        }
        if(!mobile_number.includes('+')){
            throw new Error(`Mobile Phone Number Must Include Country Code Ex: +62`);
        }

        return true
}

module.exports = {
    passwordFormat,
    checkPhoneNumber
}