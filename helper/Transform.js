const TransformFetchBCF3314 = (data) => {
    const BCFMap = {};
    const KeysValue = Object.keys(data[0]);

    // Get Key
    for (const key in KeysValue) {
        const split = KeysValue[key].split('.');

        for (const ke in split) {
            console.log(split[ke])
            BCFMap[split[ke]] = "";
        }
    }
    // console.log(BCFMap)

}

module.exports = {
    TransformFetchBCF3314
}