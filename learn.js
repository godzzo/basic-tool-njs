'use strict';

const commandLineArgs = require('command-line-args')

const utJson = require('./lib/ut_json');
const utData = require('./lib/ut_data');
const utHttp = require('./lib/ut_http');

const cliArguments = [
    { name: 'command', defaultOption: true, defaultValue: 'sayHi' },
    { name: 'verbose', alias: 'v', type: Boolean },
    { name: 'gsId', alias: 'd', defaultValue: '1OsTqExpSvKWqfmN9gSdYCAaJB-cyTOS4b_cJ-vIvMAY' }
    
];

const cfg = utJson.read('./config.json');
const options = commandLineArgs(cliArguments)

console.log("options", utJson.toString(options));

(async () => {
    await Main();
})();

async function Main() {
    if (options.command == 'showData') {
        console.log(utData.load(cfg.sampleDataPath, 0));
    }

    if (options.command == 'testPost') {
        const recs = utData.load(cfg.sampleDataPath, 0);

        const response = await utHttp.postJson(`${cfg.apiUrl}/issues`, recs[0]);

        console.log('response', response);
    }

    if (options.command == 'testUpload') {
        const response = await utHttp.uploadFile(cfg.uploadUrl, cfg.sampleDataPath);

        console.log('response', response);
    }

    if (options.command == 'testDownload') {
        // await utHttp.downloadFile('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', './out/dummy.pdf');
        
        // NASA Apollo 1972 Flight Plan 20MB
        await utHttp.downloadFile('https://www.hq.nasa.gov/alsj/a17/A17_FlightPlan.pdf', './out/A17_FlightPlan.pdf');
    }

    if (options.command == 'sayHi') {
        console.log('Hello There! 😎');
    }
}
