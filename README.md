# create-sql-rows
A small Node.JS tool for generating random (but sensible) row values for INSERT queries in SQL syntax, based on column info that **YOU** define!

The tool is currently working properly (as far as I know), and I will be adding more features to it periodically.

Contributions are welcome!

## How to use it

Let's start with a basic example:
```js
'use strict';
const  CR  =  require('./module/create-sql-rows.js');
const  Path  =  require('path');

console.log(`
 _________________
| GENERATING ROWS |
|_________________|
`);

// To use values from the resource-data folder, call 'module.resourceData.loadData()'.
CR.resourceData.loadData();

// Output file path should include the desired filename:
const  outputPath  =  Path.join(__dirname,  './output/user-table-rows.txt');

// Main function:
CR.generateRows(outputPath, 100, [
{ name: 'id', datatype: 'int', getValue: CR.incrementInt.next },
{ name: 'name', datatype: 'varchar', getValue: CR.getRandomVal.name },
{ name: 'email', datatype: 'text', getValue: CR.getRandomVal.email },
{ name: 'password', datatype: 'varchar', getValue: CR.getRandomVal.password },
{ name: 'guid', datatype: 'varchar', getValue: CR.getRandomVal.uuidv4 },
], {overwriteFile: true, logToConsole: true});

// Output text is now written to './output/user-table-rows.txt'
console.log('~ DONE ~');
```
Running the above code in Node will write 100 rows of text to the specified output file. The result will look like this:
```
(1, FINLEY, crackpig@example.com, 04f2766bf08, 7bfc9a70-8e7a-44bc-bd12-c3e648c42f44),
(2, EVA, characteristicgoalkeeper@example.com, 67d9ad210c12214695b29, a807065d-49e6-415e-b0ba-fdae92b61a41),
(3, ROMEO, lootcomplex@example.com, 128e84702915bcfc41b6, a74abac6-fe81-4f63-9ea6-aedac25b0213),
(4, ELIAS, failisolation@example.com, 1a7fc89ec, b9609146-e229-4e4e-8146-96dca409186c),
(5, EUGENE, datelunch@example.com, 8f65767b10, 7e938448-772a-480d-b3f7-f3e0aab0a1dc),
(...), ...
```
You can copy and paste the text file into your SQL query, specifically within the VALUES argument for an INSERT statement.

*Voilà!* Now you can quickly test your SQL schema using realistic data tables!


## More Details

All the functions for this tool are located in  **`./servers/create-sql-rows.js`** file. I suggest importing the module like so:
```js
	const  CR  =  require('./servers/create-sql-rows.js');
	const  Path  =  require('path');
```

The exported module contains **3** main functions/objects:
```js
	module.exports = {
		resourceData: {
			topFemaleNames = [],
			topMaleNames = [],
			randomText = [],
			randomWords = [],
			loadData: () => {...},
			reset: () => {...}
		},
		getRandomVal: {
			name: () => {...},
			text: () => {...},
			word: () => {...},
			email: () => {...},
			password: () => {...},
			uuidv4: () => {...}
		},
		generateRows: () => {...};
	}
```
**`CR.generateRows()`** is the main function for this tool. It takes arguments for the output file path, the number of rows, the column layout, and the types of data to be inserted. The syntax is pretty straight-forward:
```js
	// Note: these are the default argument values
	CR.generateRows(
		outputFilePath = './output/output.txt',
		numberOfRows = 1,
		cols = [
			{name: '', datatype: '', getvalue: () => {return undefined}, staticValue: undefined},
			... rest
		],
		options = {
			logToConsole: false,
			overWriteFile: false
		}
	)
```
The other functions in the module allow you to access a pre-defined set of data in the the **`./module.resource-data/`** directory. Here are a few tips to get you started:

* Calling the **`CR.resourceData.loadData()`** method will synchronously load  **`CR.resourceData`** array properties (e.g. **`CR.topMaleNames`** with pre-assembled data. That data is stored within JSON files in the **`.create-sql-rows/module/resource-data`** directory.

* **`CR.getRandomVal`** methods like **`name()`** and **`email()`** take random values from **`CR.resourceData`** arrays and manipulate them to create text output based on common use cases.

* Other tools like **`CR.incrementInt.next()`** offer other, non-random sources of data to populate your rows.

* You can use your own functions to populate the column values if you want. Just keep in mind that **`CR.generateRows`** will call the function passed to the **`getValue`** argument **for each row**, so if you want to pass a particular *sequence* of values to your rows, you should pass a function that iterates through that sequence each time it is called. (I recommend [iterator functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)).

---
### Dependencies:

Basically none.

The tool is built for use in a Node environment, and it depends on Node's native `filesystem` and `path` modules for some functionality. No other dependencies are required.

However, the core function logic could be slightly adjusted to work with other file system management libraries, as well as other package managers. Just let me know if that is something you want.

---

### Contribute:

Feel free to reach out if you have any suggestions to offer. If you would like to add features or fix any issues, you can submit a pull request.