/**
 * 
 * @param {String} password 
 * Check Password if its Correct with the format
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
    if (!(/(?=[A-Z])/g.test(password))) {
        throw new Error('At Least One Upper Case');
    }
    if (!(/(?=[0-9])/g.test(password))) {
        throw new Error('At Least One Number');
    }

    return true;
}

module.exports = {
    passwordFormat
}