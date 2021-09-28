const bcrypt = require("bcrypt");

const createHashText = (textData) => {
    const saltRound = bcrypt.genSaltSync(10);
    const hashText = bcrypt.hashSync(textData, saltRound)

    return hashText;
}

const checkHashText = (hashText, plainText) => {
    const compareTextWithHash = bcrypt.compareSync(plainText, hashText);

    return compareTextWithHash;
}

module.exports = {
    createHashText, 
    checkHashText
};