const fs = require('fs');
const dataService = require('../dataService');

test('Creates a file with provided name and data', done => {

    let randomNumber = Math.floor( Math.random() * 100 );
    let testFileName = `testFile${randomNumber}.json`;
    let testData = {'test':'json'};

    try{
        dataService.writeFile(testFileName, testData);
        let actualData = JSON.parse( fs.readFileSync(testFileName).toString() );
        expect(actualData).toEqual(testData);
    } finally{
        fs.unlinkSync(testFileName);
    }
    done();
});
