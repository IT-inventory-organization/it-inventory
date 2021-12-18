const checkFormat = (value) => {
    const date = new RegExp(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][\d]|3[01])$/)
    
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

