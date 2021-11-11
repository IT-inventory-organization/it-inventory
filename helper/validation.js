/**
 * Check Password if its Correct with the format
 * @param {String} password 
 * @returns A Correct Format Password
 */
 function passwordFormat(password) {
    if(typeof password == 'undefined' || password.length == 0){
        throw new Error('Kolom Password Kosong');
    }
    password = password.toString();
    if (password.length < 8) {
        throw new Error('Password Minimal 8 Karakter')
    }
    if(!(/(?=[a-z])/g.test(password))){
        throw new Error('Password Harus Terdiri Satu Huruf Kecil')
    }
    if (!(/(?=[A-Z])/g.test(password))) {
        throw new Error('Password Harus Terdiri Satu Huruf Besar');
    }
    if (!(/(?=[0-9])/g.test(password))) {
        throw new Error('Password Harus Terdiri Satu Angka');
    }

    return true;
}

function checkPhoneNumber(value){
    let mobile_number = value;
        if(typeof mobile_number !== 'string'){
            mobile_number = ""+mobile_number;
        }
        if(!mobile_number.includes('+')){
            throw new Error(`Nomor Handphone Harus Memiliki Nomor Negara Cth: +62`);
            // 
        }

        return true
}

module.exports = {
    passwordFormat,
    checkPhoneNumber
}