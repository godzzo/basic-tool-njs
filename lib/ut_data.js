'use strict';

const utJson = require('./ut_json');
const utCommon = require('./ut_common');

function LoadData(path, pos) {
    const data = utJson.read(path);

    return data[pos].map(rec => utCommon.translateRec(rec));
}

module.exports = {
    load: LoadData
};
