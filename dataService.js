const fs = require('fs');

async function createAppCache(inputArgs){

    let appCache = []

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
async function createMarksCache( fileLocation ){

    let cache = {};
    let data = await parseCSVData(fileLocation); 

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

//Data Setup
async function createPrimaryKeyCache( fileLocation ){

    let cache = {}
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

    let data = fs.readFileSync( fileLocation ).toString(); //Error handling for empty file?

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

///WRITE FILE ///
function writeFile( fileName, data ){
    //Create a big ol data file first

    //Write once
    fs.writeFileSync( fileName, JSON.stringify(data) );
}


exports.createAppCache = createAppCache;
exports.writeFile = writeFile;