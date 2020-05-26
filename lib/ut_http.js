'use strict';

const utCommon = require('./ut_common');
const got = require('got');

// For upload file with multipart
const fs = require('fs');
const FormData = require('form-data');

// For download with pipe
const stream = require('stream');
const {promisify} = require('util');

const pipeline = promisify(stream.pipeline);


// https://github.com/sindresorhus/got#json-mode 
async function PostJson(url, rec) {
    try {
        console.log("PostJson", rec);

        const resp = await got.post(url, {
            json: rec,
            responseType: 'json'
        });

        console.log('response', resp);
        console.log('data', resp.body.data);

        await utCommon.timeout(1000);

        return resp.body;
    } catch (error) {
        console.log('error', error);
        console.log('error.response.body', error.response.body);
        //=> 'Internal server error ...'
    }
}

async function UploadFile(url, filePath, inputName = 'file') {
    try {
        const form = new FormData();

        form.append(inputName, fs.createReadStream(filePath), {filename: 'sample.json'});
        form.append('name', 'other.json');

        const resp = await got.post(url, {
            body: form
        });

        console.log('response', resp);
        console.log('data', resp.body.data);

        return resp.body;
    } catch (error) {
        console.log('error', error);
        console.log('error.response.body', error.response.body);
        //=> 'Internal server error ...'
    }
}

async function DownloadFile (url, filePath) {
    await pipeline(
        got.stream(url).on('downloadProgress', progress => {
			console.log('progress', progress);
		}),
        fs.createWriteStream(filePath)
    );
}

module.exports = {
    postJson: PostJson,
    uploadFile: UploadFile,
    downloadFile: DownloadFile
};
