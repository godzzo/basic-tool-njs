'use strict'

const gsjson = require('google-spreadsheet-to-json');
const { GoogleSpreadsheet } = require('google-spreadsheet');

async function LoadSpreadsheetData(spreadsheetId, credentials = 'credentials/gd-drive-access.json') {
	return gsjson({
		spreadsheetId: spreadsheetId,
		credentials: credentials,
		// worksheet: [0, 1, 2]
		allWorksheets: true,
	});
}

async function GetData(spreadsheetId, credentials = 'credentials/gd-drive-access.json') {

    console.log('GoogleSpreadsheet', GoogleSpreadsheet);

    const doc = new GoogleSpreadsheet(spreadsheetId);

    await doc.useServiceAccountAuth(utJson.read(credentials));

    await doc.loadInfo();

    console.log(doc.title);

    const cnt = doc.sheetCount;
    const out = {};

    console.log('doc.sheetCount', doc.sheetCount);
    // console.log('doc', doc);

    for (let i=0; i<cnt; i++) {
        const sheet = doc.sheetsByIndex[i];

        console.log('sheet', sheet);

        const rows = await sheet.getRows();

        const recs = rows.map((row) => {
            const rec = {};

            for (let i=0; i<row._rawData.length; i++) {
                const val = row._rawData[i];
                const key = row._sheet.headerValues[i];

                rec[key] = val;
            }

            return rec;
        });

        out[sheet.title] = recs;

        // console.log('recs', recs);
    }

    return out;
}

module.exports = {
    load: LoadSpreadsheetData,
    getData: GetData
}

/* 
WARNING! You must upgrade to the latest version of google-spreadsheet!
Google's deprecation date for the v3 sheets API is March 3rd 2020
Bad news - this version of this module will stop working on that date :(
Good news - the new version of the module uses the newer v4 api :)
However, there are breaking changes, so please see the docs site
https://theoephraim.github.io/node-google-spreadsheet

Working but a lots of work to do get the data as json or arrays

npm i google-spreadsheet-to-json --save

const utJson = require('./ut_json');
const { GoogleSpreadsheet } = require('google-spreadsheet');

async function TestV4(spreadsheetId, credentials = 'credentials/gd-drive-access.json') {
    const doc = new GoogleSpreadsheet(spreadsheetId);

    await doc.useServiceAccountAuth(utJson.read(credentials));

    await doc.loadInfo();

    console.log(doc.title);

    const cnt = doc.sheetCount;

    for (let i=0; i<cnt; i++) {
        const sheet = doc.sheetsByIndex(i);

        
    }

    console.log("doc.sheetCount()", doc.sheetCount);
    console.log("doc._rawSheets", doc._rawSheets);
}


    await gs.testV4('1SGbLqGcR_Ew6tvE0LZQNCeRfvHDUfKgxb9KuJTXIxNs');
*/
