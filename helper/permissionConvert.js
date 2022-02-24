module.exports = {
  /**
   * @param {Array} data
   */
  ConvertPermission: (data) => {
    let mapPermission = {};

    for (const iterator of data) {
      mapPermission[iterator.accessModule] = { ...iterator };
    }

    return mapPermission;
  },
};
