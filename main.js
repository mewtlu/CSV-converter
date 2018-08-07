/**
 * Convert CSV to SQL inserts
 */

const fs = require('fs');
const csvParse = require('csv-parse/lib/sync');
const cwdPath = process.cwd();
const countries = ['us', 'de', 'fr', 'ru', 'it', 'nl', 'cn', 'at', 'se', 'ca', 'pl', 'fi', 'cz', 'no'];

for (var c in countries) {
	var countryFileBuffer = fs.readFileSync(cwdPath + '/data/' + 'Companies - ' + countries[c].toUpperCase() + '.csv');
	var countryData = csvParse(countryFileBuffer.toString(), { columns: true });

	var countryOutPath = cwdPath + '/out/' + countries[c] + '.sql';
	var countryOutStr = [];

	for (var r = 0; r <= 500; r++) {
		var row = countryData[r];

		if (row) {
			var label = row['Label'];
			var type = row['Type'] == 'Company' ? '3' : '1';
			var cleanUpRegEx = row['CleanUpRegEx'];

			var newRow = 'INSERT INTO `5_ML_CountryISP` (`Country`, `ClusterId`, `Type`, `CleanUpRegex`) VALUES ("' + countries[c] + '", "' + label + '", "' + type + '", "' + cleanUpRegEx + '");'
		}
		

		if(countries[c] === 'at') {
			//console.log(r);
		}


		countryOutStr.push(newRow)
	}


	fs.writeFile(countryOutPath, countryOutStr.join('\n'), function(err) {
	    if (err) {
	        console.log('- Error saving file "' + countryOutPath + '" :\n', err);
	    }

	});
}

console.log('-- Done.');