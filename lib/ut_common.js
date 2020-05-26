const pluralize = require('pluralize');

function TranslateRecToObj(rec) {
    const fields = Object.keys(rec);
    const obj = {};

    fields.forEach(field => {
        const prop = GenerateNames(field).lowerCamelName;

        obj[prop] = rec[field];

        if (obj[prop] == 'NULL') {
            obj[prop] = null;
        }
    });

    return obj;
}

function GenerateNames(words) {
    const data = {};
    const arrWords = words.split(/_/g);
	const arrHypen = [];
	const arrCapital = [];
	const arrLowerCamel = [];

	arrWords.forEach(word => {
		const upper = word.charAt(0).toUpperCase() + word.substring(1);

		if (arrLowerCamel.length < 1) {
			arrLowerCamel.push(word);
		} else {
			arrLowerCamel.push(upper);
		}

		arrCapital.push(upper);

		arrHypen.push(word);
	});

	data.camelName = arrCapital.join('');
	data.lowerCamelName = arrLowerCamel.join('');
	data.pluralCamelName = pluralize.plural(data.camelName);
	data.pluralLowerCamelName = pluralize.plural(data.lowerCamelName);
	
	data.hyphenName = arrHypen.join('-');
    data.periodName = arrHypen.join('.');
    data.underScoreName = words;

	return data;
}

async function ForEach(array, fncHandler) {
    for (let i = 0; i < array.length; i++) {
        await fncHandler(array[i], i, array);
    }
}

function Timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    generateNames: GenerateNames,
	translateRec: TranslateRecToObj,
	forEach: ForEach,
	timeout: Timeout
};
