const convertStrignToDateUTC = (dateString) => {
    // console.log('trigget')
    // if(dateString.length == 0){
    //     return null
    // }
    // if(dateString == null || typeof dateString == 'undefined'){
    //     return null
    // }
    // const regex = new RegExp(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/);
    // if(!regex.test(dateString)) {
    //     throw Error('Format Date String is Ex: dd-mm-yyyy' + dateString);
    // }

    // const arrDate = dateString.split('-');

    // const date = new Date(arrDate[2], +(arrDate[1] - 1), arrDate[0]).toUTCString();
    // // console.log(dateString)
    // return date;

    return dateString
}

const convertDate = (date) => {
    if(!date){
        return null;
    }
    const ISO = new Date(`${date}`);
    return `${addZero(ISO.getDate())}-${addZero(ISO.getMonth()+1)}-${ISO.getFullYear()}`;
    return date
}

const addZero = (val) => {
    if(val < 10){
        return `0${val}`
    }

    return val
}

const convertForInputDateOnly = date => {
    const data = date.split('-');
    return `${parseInt(data[2])}-${parseInt(data[1])}-${parseInt(data[0])+1}`;
}


module.exports = {
    convertStrignToDateUTC,
    convertDate,
    convertForInputDateOnly
}