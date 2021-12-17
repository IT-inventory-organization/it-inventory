const checkFormat = (value) => {

    const date = new RegExp(/^(0[1-9]|[12][0-9]|3[01])\-(0[1-9]|1[012])\-\d{4}$/);
    // Jika Tanggal Tidak Diisi
    if(value.length == 0){
        return true
    }
    if(!date.test(value)){
        throw Error('Date Format is Incorrect, Format example: dd-mm-yyyy');
    }

    return true;
}


module.exports = {
    checkFormat
}

