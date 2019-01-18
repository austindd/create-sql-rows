'use strict';
const fs = require('fs');
const Path = require('path');

// =========================================================================================
// ====================================  NOTES TO USER  ====================================
// =========================================================================================
//
// External resource data should be stored in JSON files.
// For standardization purposes, resource objects should ideally conform to the following format:
//
// [{ 'type': value }, { 'type': value }, { 'type': value }, ...rest]
//
// ________________________________________
// ________________EXAMPLES________________
// [
//     { 'word': 'hyperbolic' },
//     { 'word': 'symbolism' },
//     ... rest
// ]
// [
//     { 'number': 1 },
//     { 'number': 2 },
//     { 'number': 3 },
//     ...rest
// ]
//
// =========================================================================================

module.exports.resourceData = {

    // Arrays for caching resource data:
    topFemaleNames: [],
    topMaleNames: [],
    randomText: [],
    randomWords: [],

    // Run to load all resource data into the above arrays for processing:
    loadData: () => {

        // Filepath definitions:
        let femaleNamesPath = Path.join(__dirname, './resource-data/top-female-names.json');
        let maleNamesPath = Path.join(__dirname, './resource-data/top-male-names.json');
        let randomTextPath = Path.join(__dirname, './resource-data/random-sentences-2.json');
        let randomWordsPath = Path.join(__dirname, './resource-data/random-words.json');

        // Get data for resourceData.topFemaleNames
        let femaleNamesJSON = JSON.parse(fs.readFileSync(femaleNamesPath, 'utf8'));
        for (let i = 0; i < 500; i++) {
            module.exports.resourceData.topFemaleNames.push(femaleNamesJSON[i].name);
        }

        // Get data for resourceData.topMaleNames
        let maleNamesJSON = JSON.parse(fs.readFileSync(maleNamesPath, 'utf8'));
        for (let i = 0; i < 500; i++) {
            module.exports.resourceData.topMaleNames.push(maleNamesJSON[i].name);
        }

        // Get data for resourceData.randomText
        let randomTextJSON = JSON.parse(fs.readFileSync(randomTextPath, 'utf8'));
        for (let i = 0; i < randomTextJSON.length; i++) {
            module.exports.resourceData.randomText.push(randomTextJSON[i].text);
        }
        // Get data for resourceData.randomWords

        let randomWordsJSON = JSON.parse(fs.readFileSync(randomWordsPath, 'utf8'));
        for (let i = 0; i < randomWordsJSON.length; i++) {
            module.exports.resourceData.randomWords.push(randomWordsJSON[i].word);
        }
    },
    // Delete cached resource data from arrays:
    reset: () => {
        module.exports.resourceData.topFemaleNames = [];
        module.exports.resourceData.topMaleNames = [];
        module.exports.resourceData.randomText = [];
        module.exports.resourceData.randomWords = [];
    }
}

//  ________________________________________________________________________________________
// | Functions to organize resource data into desirable formats for real-world applications |
// |________________________________________________________________________________________|
module.exports.incrementInt = {
    currentInt: 0,
    next: () => {
        module.exports.incrementInt.currentInt++;
        return module.exports.incrementInt.currentInt;
    },
    reset: () => {
        module.exports.incrementInt.currentInt = 0;
        return;
    }
}
module.exports.getRandomVal = {
    name: () => {
        let result;
        let gender = 0.5 < Math.random() ? 'male' : 'female';
        if (gender === 'female') {
            result = module.exports.resourceData.topFemaleNames[Math.floor(Math.random() * module.exports.resourceData.topFemaleNames.length - 1)];
        }
        if (gender === 'male') {
            result = module.exports.resourceData.topMaleNames[Math.floor(Math.random() * module.exports.resourceData.topMaleNames.length - 1)];
        }
        return result;
    },
    text: () => {
        let result = module.exports.resourceData.randomText[Math.floor(Math.random() * module.exports.resourceData.randomText.length - 1)];
        return result;
    },
    word: () => {
        let result = module.exports.resourceData.randomWords[Math.floor(Math.random() * module.exports.resourceData.randomWords.length - 1)];
        return result;
    },
    email: () => {
        let result = (
            module.exports.resourceData.randomWords[Math.floor(Math.random() * module.exports.resourceData.randomWords.length - 1)] +
            module.exports.resourceData.randomWords[Math.floor(Math.random() * module.exports.resourceData.randomWords.length - 1)] +
            "@example.com"
        );
        return result;
    },
    password: () => {
        let baseArr = [];
        let randLength = Math.floor(Math.random() * 14) + 8;
        for (let i = 0; i < randLength; i++) {
            baseArr.push('x');
        }
        let baseStr = baseArr.join('');
        let result = baseStr.replace(/[x]/g, function (c) {
            let r = Math.random() * 16 | 0;
            let v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        return result;
    },
    uuidv4: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
}

//  ________________________________________________________________________________________
// | Generate VALUE arguments for SQL INSERT queries |
// |________________________________________________________________________________________|
/*
    - Specify relative path of output file.
    - If the output file does not exist, a new file will be created.
    - No limit to number of rows.
    - Define as many columns as you want.
    - Options for append/overwrite and console logging.
*/

module.exports.generateRows = (outputFilePath = './output/output.txt',
    numberOfRows = 1,
    cols = [
        { name: '', datatype: '', getValue: () => { return undefined }, staticValue: undefined },
        ...rest
    ],
    options = {
        logToConsole: false,
        overwriteFile: false,
    }
) => {

    if (numberOfRows !== undefined && cols !== undefined) {
        let output = ''; // <--- main output string
        for (let i = 0; i < numberOfRows; i++) {

            // Generate JS object based on user-specified column names/values:
            let rowObj = {};
            cols.forEach((col) => {
                let val = '';
                if (col.staticValue) {
                    val = `${col.staticValue}, `;
                } else if (col.getValue) {
                    val = col.getValue();
                }
                rowObj[col.name] = val;
            });

            // Generate output text:
            let rowText = '(';
            const rowObjKeys = Object.keys(rowObj);
            rowObjKeys.forEach((item, index) => {
                if (index < rowObjKeys.length - 1) {
                    if (typeof rowObj[item] === 'string') {
                        rowText += `"${rowObj[item]}", `; // include quotation marks for string values
                    } else {
                        rowText += `${rowObj[item]}, `;
                    }
                } else {
                    if (typeof rowObj[item] === 'string') {
                        rowText += `"${rowObj[item]}"),\r\n`; // include quotations marks for string values
                    } else {
                        rowText += `${rowObj[item]}),\r\n`;
                    }
                }
            });

            // Should output data be logged to the console window?
            if (options.logToConsole === true) {
                console.log(rowText);
            }

            // Concatenate row text to the output string:
            output += rowText;
        }

        // Should output file be overwritten? And is the output file path defined?
        if (options.overwriteFile === true && outputFilePath !== null && outputFilePath !== undefined) {
            // Overwrite file with output string:
            fs.writeFileSync(outputFilePath, output);

        } else if (options.overwriteFile === false && outputFilePath !== null && outputFilePath !== undefined) {
            // Append output string to file:
            fs.appendFileSync(outputFilePath, output);

        } else {
            console.error('invalid_file_path OR invalid_options');
        }
    } else {
        console.error('invalid_arguments');
    }
}

return module.exports;