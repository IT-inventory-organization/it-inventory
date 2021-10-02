const convertStrignToDateUTC = (dateString) => {
    const regex = new RegExp(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/);
    if(!regex.test(dateString)) {
        throw Error('Format Date String is Ex: dd-mm-yyyy');
    }

    const arrDate = dateString.split('-');

    const date = new Date(arrDate[2], +(arrDate[1] - 1), arrDate[0]).toUTCString();

    return date;
}

module.exports = {
    convertStrignToDateUTC
}