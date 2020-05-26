'use strict';

const commandLineArgs = require('command-line-args')
const got = require('got');

const utSql = require('./lib/ut_mysql');
const utJson = require('./lib/ut_json');
const gs = require('./lib/ut_gsapi');
const utCommon = require('./lib/ut_common');


const cliArguments = [
    { name: 'command', defaultOption: true, defaultValue: 'sayHi' },
    { name: 'verbose', alias: 'v', type: Boolean },
    { name: 'gsId', alias: 'd', defaultValue: '1SGbLqGcR_Ew6tvE0LZQNCeRfvHDUfKgxb9KuJTXIxNs' }
    
];

const cfg = utJson.read('./config.json');
const options = commandLineArgs(cliArguments)

console.log("options", utJson.toString(options));

(async () => {
    await Main();
})();

async function Main() {
    if (options.command == 'insert') {
        InsertData();
    }

    if (options.command == 'save') {
        SaveSampleJson();
    }
    
    if (options.command == 'test') {
        TestData();
    }

    if (options.command == 'sayHi') {
        console.log('Hello There! 😎');
    }
}

async function TestMySQL() {
    const res = await utSql.queryAsync(cfg.db, "SELECT 1");
    console.log("res", res);
}

async function SaveSampleJson() {
    const data = await gs.load(options.gsId);

    // console.log("data", data);

    utJson.write('out/data.json', data, true);
}

async function InsertData() {
    try {
        const recs = await LoadData();
        
        utCommon.forEach(recs, SaveIssueByRest);
    } catch (error) {
        console.log(error.response.body);
    }
}

function Timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// https://github.com/sindresorhus/got#json-mode 
async function SaveIssueByRest(rec) {
    try {
        console.log("SaveIssueByRest", rec);

        const {body} = await got.post('http://localhost:8080/api/issues', {
            json: rec,
            responseType: 'json'
        });

        console.log(body.data);

        await Timeout(1000);

        return body;
    } catch (error) {
        console.log(error.response.body);
        //=> 'Internal server error ...'
    }
}

function LoadData() {
    const data = utJson.read('out/data.json');

    return data[0].map(rec => utCommon.translateRec(rec));
}

async function TestData() {
    const rec = {
        "id": 3,
        "reqPlace": "outer",
        "reqType": "fix",
        "publicateDate": "2020-06-10T00:00:00+00:00",
        "isExpire": true,
        "expireDate": "2025-08-18T00:00:00+00:00",
        "title": "Árvíztűrő Ütvefúrógép"
    };

    const obj = utCommon.translateRec(rec);

    console.log("translateRec", utJson.toString(obj));
}
