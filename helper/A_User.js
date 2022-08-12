const User = require("../database/models/user");
const { createHashText } = require("./bcrypt");

module.exports = {
  ChangePw: async (idUser, theNewPassword) => {
    return User.update(
      {
        password: theNewPassword,
      },
      {
        where: {
          id: +idUser,
        },
      }
    );
  },
  FindUser: async (idUser) => {
    return User.findOne({
      where: {
        id: +idUser,
      },
    });
  },
};
