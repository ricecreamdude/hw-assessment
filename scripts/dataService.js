const fs = require('fs');

async function createAppCache(inputArgs){

    let appCache = [];

    for( let i = 0; i < inputArgs.length - 1; i++ ){

        let path = inputArgs[i];

        if (i == 3) appCache.push( await createMarksCache( path ) ) 
        else {
            let data = await createPrimaryKeyCache( path );
            appCache.push( data );
        }
    }

    return appCache;
}

// Marks is composite key and needs to be handled differently
async function createMarksCache(fileLocation){

    let cache = {};
    let data = await parseCSVData(fileLocation); 

    validateMarksCache(data);

    data = data.splice(1);

    for (let i = 0; i < data.length; i++){

        let [testId, studentId, mark] = data[i];
        let newTest = {
            testId,
            mark
        }

        if (!cache[ studentId ] ) cache[ studentId ] = [newTest];
        else cache[ studentId ].push(newTest);
    }

    return cache;
}

async function createPrimaryKeyCache( fileLocation ){

    let cache = {};
    let data = await parseCSVData(fileLocation); 

    let columns = data[0];
    data = data.splice(1);
    
    for (let i = 0; i < data.length; i++){
        let row = data[i];
        for (let j = 0; j < row.length; j++){

            let colName = columns[j];
            if (j == 0) cache[ row[j] ] = {};
            else cache[ row [0] ] = {
                ...cache[ row [0] ],
                [colName]: row[j]
            };
        }
    }

    return cache;
}

function parseCSVData( fileLocation ) {

    let data;
    try{
        data = fs.readFileSync( fileLocation ).toString(); //Error handling for empty file?
    } catch(err){
        throw "Invalid file location";
    }
    

    data = data.split('\n');
    data = data.map( row => row.trim().split(',') );
    data = data.map( row => {
        return row.map( string => {
            return string.trim()
        } ) 
    });

    data = data.filter( row => row[0].length > 0); //Remove empty lines

    return data;
}

function writeFile( fileName, data ){

    validateFileName(fileName);
    validateData(data);

    try{
        fs.writeFileSync( fileName, JSON.stringify(data) );
    } catch(err){
        throw "Internal error - Problem with writing file";
    }
}

function validateFileName(fileName){

    try{
        let fileArray = fileName.split(".");
        if (fileArray[1] !== 'json') throw "Output String Error - Please include .json as file output type";
    } catch(err){
        throw err;
    }

}

function validateData(data){
    if (typeof data !== "object") throw "Interal Error - Invalid Data Input for Write"
}

function validateMarksCache(data){
    try{
        let expectedHeaders = [ 'mark', 'student_id', 'test_id' ];
        let headers = data[0].sort();

        for(var i = 0; i < expectedHeaders.length; i++){
            if (expectedHeaders[i] !== headers[i]){
                throw "Invalid Marks Column Names - Please check input order";
            }
        }

    } catch(err) {
        throw "Invalid Marks Column Names - Please check input order";
    }
}

module.exports = exports = {
    createPrimaryKeyCache,
    createAppCache,
    writeFile,
    parseCSVData,
    createMarksCache
}
