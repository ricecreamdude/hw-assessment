const fs = require('fs');
const dataService = require('../scripts/dataService');

xtest('Data Services', done => {

    describe("Creates a file with provided name and data", () => {
        
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
    });

});
