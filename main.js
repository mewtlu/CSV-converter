/**
 * Convert CSV to SQL inserts
 */

const fs = require('fs');
//const csvParse = require('csv-parse/lib/sync');
const cwdPath = process.cwd();
const countries = ['gb', 'us', 'de', 'fr', 'ru', 'it', 'nl', 'cn', 'at', 'se', 'ca', 'pl', 'fi', 'cz', 'no'];
//const countries = ['gb'];
var countriesOut = [];

for (var c in countries) {
	var country = countries[c];

	var countryFileBuffer = fs.readFileSync(cwdPath + '/data/' + '' + country.toUpperCase() + '.csv');
	var countryData = countryFileBuffer.toString().split('\r\n');

	var countriesOutPath = cwdPath + '/out/' + country + '.sql';
	countriesOut[country] = [];

	for (var r in countryData) {

		var row = countryData[r].split('\t');
		var done = [];

		if (row) {
			var label = row[0];
			var type = row[1] == 'Company' ? '3' : '1';
			var cleanUpRegEx = row[6];

			if (cleanUpRegEx) {
				cleanUpRegEx = cleanUpRegEx.replace(/"/g, '\\\'')
				console.log(cleanUpRegEx)
			}

			/*
			var add = row['Add'];
			var remove = row['Remove'];
			*/

			// process.stdout.write(countries[c] + '-' + label + " " + r + "\t\t");

			if (0) {
				if (country == 'no') {
					console.log(r, label, row);
					console.log('');
				}
			}
			if (label && row[1] && label !== 'Label' && done.indexOf(label) == -1) {
				done.push(label)

				/*
				var cleanUpRegExObj = [];

				if (remove) {
					cleanUpRegExObj.push({
						action: 'remove',
						regex: remove
					})
				}

				if (add) {
					cleanUpRegExObj.push({
						action: 'add',
						regex: add
					})
				}

				var cleanUpRegEx = JSON.stringify(cleanUpRegExObj);

				if (cleanUpRegEx == '[]') {
					cleanUpRegEx = '';
				}
				*/
				if (cleanUpRegEx == '') {
					cleanUpRegEx = 'null';
				} else {
					cleanUpRegEx = '"' + cleanUpRegEx + '"'
				}

				var newRow = 'INSERT INTO `5_ML_CountryISP` (`Country`, `ClusterId`, `Type`, `CleanUpRegEx`) VALUES ("' + country + '", ' + label + ', ' + type + ', ' + cleanUpRegEx + ');'
				countriesOut[country].push(newRow)
			}
		}

	}

	// process.stdout.write("\n");


	fs.writeFile(countriesOutPath, countriesOut[country].join('\n'), function(err) {
	    if (err) {
	        console.log('- Error saving file "' + countriesOutPath + '" :\n', err);
	    }

	});
}

console.log('-- Done.');
