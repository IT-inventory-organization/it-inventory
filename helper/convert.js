const convertStrignToDateUTC = (dateString) => {
  if (dateString == null || typeof dateString == "undefined") {
    throw new Error(`Date Value Is Empty`);
  }
  const regex = new RegExp(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/);
  if (!regex.test(dateString)) {
    throw Error("Format Date String is Ex: dd-mm-yyyy");
  }

  const arrDate = dateString.split("-");

  const date = new Date(
    arrDate[2],
    +(arrDate[1] - 1),
    arrDate[0]
  ).toUTCString();

  return date;
};

const convertDate = (dateString) => {
  if (dateString == null || typeof dateString == "undefined") {
    throw new Error(`Date Value Is Empty`);
  }
  const regex = new RegExp(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/);
  if (!regex.test(dateString)) {
    throw Error("Format Date String is Ex: dd-mm-yyyy");
  }

  const arrDate = dateString.split("-");

  const date = new Date(arrDate[2], +(arrDate[1] - 1), arrDate[0]);

  return `${addZero(date.getDate())}-${addZero(
    date.getMonth() + 1
  )}-${date.getFullYear()}`;
};

const addZero = (val) => {
  if (val < 10) {
    return `0${val}`;
  }

  return val;
};

/**
 *
 * @param {string} val
 * @returns {string}
 */
const DateConv = (val) => {
  return new Date(val).toUTCString();
};

module.exports = {
  convertStrignToDateUTC,
  convertDate,
  addZero,
  DateConv,
};
