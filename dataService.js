const fs = require('fs')

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

//create composite key cache, specifically for marks
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

exports.createPrimaryKeyCache = createPrimaryKeyCache;
exports.createMarksCache = createMarksCache;