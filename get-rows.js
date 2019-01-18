'use strict';
const CR = require('./module/create-sql-rows.js');
const Path = require('path');

console.log(
    `
     ________________________
    | GENERATING RANDOM ROWS |
    |________________________|
    `
);

// To use values from the resource-data folder, call 'module.resourceData.loadData()'.
CR.resourceData.loadData();

// Output file path should include the desired filename:
const outputPath = Path.join(__dirname, './output/user-table-rows.txt');

// Main function example:
CR.generateRows(outputPath, 100, [
        { name: 'id', datatype: 'int', getValue: CR.incrementInt.next },
        { name: 'name', datatype: 'varchar', getValue: CR.getRandomVal.name },
        { name: 'email', datatype: 'text', getValue: CR.getRandomVal.email },
        { name: 'password', datatype: 'varchar', getValue: CR.getRandomVal.password },
        { name: 'guid', datatype: 'varchar', getValue: CR.getRandomVal.uuidv4 },
    ], {overwriteFile: true, logToConsole: true});

console.log('~ DONE ~');