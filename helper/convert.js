const convertStrignToDateUTC = (dateString) => {

    return dateString
}

const convertDate = (date) => {
    if(!date){
        return null;
    }
    const ISO = new Date(`${date}`);
    const data = `${ISO.getUTCFullYear()}-${addZero(ISO.getUTCMonth()+1)}-${addZero(ISO.getUTCDate())}`; 
    return data;
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