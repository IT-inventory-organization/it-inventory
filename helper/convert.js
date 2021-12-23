const convertStrignToDateUTC = (dateString) => {

    return dateString
}

const convertDate = (date) => {
    if(!date){
        return null;
    }
    const ISO = new Date(`${date}`);
    return `${addZero(ISO.getDate())}-${addZero(ISO.getMonth()+1)}-${ISO.getFullYear()}`;
}

const addZero = (val) => {
    if(val < 10){
        return `0${val}`
    }

    return val
}

const convertForInputDateOnly = date => {
    const data = date.split('-');
    console.log(data)
    return `${parseInt(data[2])}-${parseInt(data[1])}-${parseInt(data[0])+1}`;
}


module.exports = {
    convertStrignToDateUTC,
    convertDate,
    convertForInputDateOnly
}