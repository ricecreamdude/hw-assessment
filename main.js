//Command Line Arguments
const dataService = require('./scripts/dataService');
let Report = require('./scripts/Report');

//node main.js data/courses.csv data/students.csv data/tests.csv data/marks.csv output.json
//Main Application
async function App(){

    const inputArgs = process.argv.slice(2);
    const outputFilename = inputArgs[4];

    //Setup application data
    let [coursesCache, studentsCache, testsCache, marksCache] = await dataService.createAppCache( inputArgs );
    
    console.log('inputArgs', inputArgs);

    try{
        let report = new Report(coursesCache, studentsCache, testsCache, marksCache);
        let outputData = report.generate();
    } catch(err){
        let errMessage = err.message
        dataService.writeFile(outputFilename, errMessage);
    }



    //Write output.json
    dataService.writeFile(outputFilename, outputData);

}

App();