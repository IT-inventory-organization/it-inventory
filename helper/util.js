module.exports = {
    reverseJenisPemberiahuan: (val) => {
        let CValue = '';
        if((/(import)/gi).test(val)){
            CValue = 'Export'
        }else if((/(export)/gi).test(val)){
            CValue = 'Import'
        }else{
            throw new Error(`"Jenis Pemberitahuan ${val}" Not Recognized`);
        }
        return CValue;
    }
} 