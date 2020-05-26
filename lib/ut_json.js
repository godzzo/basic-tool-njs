'use strict'

const fs = require('fs');

function ReadJson(filePath) {
    const rawdata = fs.readFileSync(filePath);

    return JSON.parse(rawdata);
}

function WriteJson(filePath, objValue, formatted = false) {
    const json = formatted? JSON.stringify(objValue, null, 4): JSON.stringify(objValue);

    fs.writeFileSync(filePath, json, 'utf8');
}

function ToString(objValue, formatted = false) {
    return formatted? JSON.stringify(objValue, null, 4): JSON.stringify(objValue);
}

module.exports = {
    read: ReadJson,
    write: WriteJson,
    toString: ToString
};
