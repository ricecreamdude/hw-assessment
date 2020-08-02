//Command Line Arguments
const fs = require('fs')

const inputArgs = process.argv.slice(2);

let coursesArr, marksArr, studentsArr, testsArr;

//Async this
function parseCSVData( fileLocation ) {

    let data = fs.readFileSync( fileLocation ).toString();

    data = data.split('\n');
    data = data.map( row => row.split(',') );
    data = data.filter( row => row[0].length > 0); //Remove empty lines

    return data;
}

async function createCacheObject( fileLocation ){

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

    console.log(cache);
}

async function test(){


    for( let i = 0; i < inputArgs.length - 1; i++ ){
        let path = inputArgs[i];
    
        createCacheObject( path );
    }

     
}

test();



// console.log(inputArgs);

//



//Ideal command:
//node main.js data/courses.csv data/students.csv data/tests.csv data/marks.csv output.json 
//                INPUT   INPUT        INPUT     INPUT     OUTPUT




//Data Processing
//Read the files

//Sanatize the data

//Create data output

//Save the file