const fs = require('fs');
const dataService = require('../scripts/dataService');

const testFiles = [
    "data/courses.csv", 
    "data/students.csv", 
    "data/tests.csv", 
    "data/marks.csv"
]

describe('Write File', ()=>{

    test("Handles bad filename", () => {
        let badFile = "TestFileDeleteMeSpaghetti";
        let testData = {'test':'json'};

        try{
            dataService.writeFile(badFile, testData);
        } catch(err){
            expect(err).toBeDefined();
        }
        
    });

    test("Handles bad data", () => {
        let badFile = "TestFileDeleteMeSpaghetti.json";
        let testData = 11;

        try{
            dataService.writeFile(badFile, testData);
        } catch(err){
            expect(err).toBeDefined();
        }
        
    });

    test("Creates a file with provided name and data", ()=>{
        let randomNumber = Math.floor( Math.random() * 100 );
        let testFileName = `testFile${randomNumber}.json`;
        let testData = {'test':'json'};
    
        try{
            dataService.writeFile(testFileName, testData);
            let actualData = JSON.parse( fs.readFileSync(testFileName).toString() );
            expect(actualData).toEqual(testData);
        } catch(err){
            console.log(err);
        }finally{
            fs.unlinkSync(testFileName);
        }
    });

})

describe('Create Primary Key Cache', () => {

    test("Returns an object with the correct data structure", async () => {
        let testData = await dataService.createPrimaryKeyCache( testFiles[0] );

        expect(typeof testData).toEqual("object");
        expect(testData["1"].name).toBeDefined();
        expect(testData["1"].teacher).toBeDefined();
    });

});

describe('Parse CSV Data',  () => {
    test("Returns an object with the correct data structure", async () => {
        let testData = await dataService.parseCSVData( testFiles[0] );

        expect(typeof testData).toEqual("object");
    });
    test("Data should not have white spaces", async () => {
        let testData = await dataService.parseCSVData( testFiles[0] );
        let hasWhiteSpace = false;

        testData.forEach( row => {
            row.forEach( val => {
                if ( 
                    val.indexOf(" ") == val[val.length-1] || 
                    val.indexOf(" ") == val[0] 
                ) return hasWhiteSpace = true;
            })
        })
        expect(hasWhiteSpace).toBe(false);
    })
    test("Bad file location throws an error", async () => {
        try{
            let testData = await dataService.parseCSVData( 'spaghetti' );
        } catch (err){
            expect(err).toEqual("Invalid file location") 
        }
    })
        
});

describe('Create Marks Cache', () => {
    
    test("Returns valid data structure", async ()=>{
        try{
            let testData = await dataService.createMarksCache( testFiles["3"] );
            
            expect( typeof testData).toBe("object");

            for (const id in testData){
                expect(typeof testData[id].length).toBeDefined();
            }
        } catch(err){

        }
    })

    test('Does not allow non "marks" files from being used', async ()=>{
        try{
            let testData = await dataService.createMarksCache( testFiles["1"] );
        } catch(err){
            expect(err).toEqual("Invalid Marks Column Names - Please check input order");
        }
    })
});